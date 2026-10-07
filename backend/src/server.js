import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { execSync } from "child_process";
import { inspectMediaUrl, streamMediaDirect } from "./services/zeroDiskStreamService.js";
import { inspectMediaImages, proxyImageStream } from "./services/imageDownloaderService.js";
import { acquireStreamSlot, releaseStreamSlot, getQueueStatus } from "./services/streamQueueService.js";

dotenv.config();

const app = express();
const rawPort = String(process.env.PORT || "5000").replace(/[^0-9]/g, "");
const PORT = Number.parseInt(rawPort, 10) || 5000;

// Dynamic CORS configuration with robust whitelist support
const rawOrigins = process.env.FRONTEND_URL || process.env.ALLOWED_ORIGINS || "*";
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (server-to-server, curl, mobile apps)
  if (allowedOrigins.includes("*")) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Automatically whitelist humantalking.com apex and all subdomains
  if (origin.endsWith("humantalking.com") || origin.includes(".humantalking.com")) {
    return true;
  }

  // Local development fallback
  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
    return true;
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin not in whitelist: ${origin}`);
        callback(new Error(`CORS Error: Origin ${origin} not allowed by backend whitelist.`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Range",
      "Cache-Control"
    ],
    exposedHeaders: [
      "Content-Length",
      "Content-Range",
      "Content-Disposition",
      "X-Estimated-Content-Length",
      "Accept-Ranges"
    ],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// Helper function to query installed binaries in production
const getSystemDiagnostics = () => {
  const runCmd = (cmd) => {
    try {
      return execSync(cmd, { timeout: 3000, stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim();
    } catch (e) {
      return `Unavailable (${e.message})`;
    }
  };

  return {
    python: runCmd("python3 --version") || runCmd("python --version"),
    ytdlp: runCmd("yt-dlp --version"),
    ffmpeg: runCmd("ffmpeg -version")?.split("\n")[0] || "Unavailable",
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  };
};

// Health Check & Root Status
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Universal Media Studio Streaming Backend",
    system: getSystemDiagnostics(),
    time: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  const statusData = await checkEngineStatus();
  res.json(statusData);
});

app.get("/api/system/status", async (req, res) => {
  const statusData = await checkEngineStatus();
  res.json(statusData);
});

async function checkEngineStatus() {
  let potStatus = "offline";
  const potUrl = process.env.POT_PROVIDER_URL || "http://pot-provider:4416";
  try {
    const potRes = await fetch(`${potUrl}/ping`, { signal: AbortSignal.timeout(2000) });
    if (potRes.ok) potStatus = "online";
  } catch (e) {
    try {
      const potRes2 = await fetch("http://127.0.0.1:4416/ping", { signal: AbortSignal.timeout(2000) });
      if (potRes2.ok) potStatus = "online";
    } catch (e2) {}
  }

  return {
    status: "ok",
    backend: "online",
    service: "Universal Media Studio Streaming Backend",
    potProvider: {
      status: potStatus,
      url: potUrl,
    },
    system: getSystemDiagnostics(),
    uptimeSeconds: Math.floor(process.uptime()),
    time: new Date().toISOString(),
  };
}

/**
 * POST /api/media/info
 * Inspects URL and returns all quality formats & video metadata
 */
app.post("/api/media/info", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string" || !url.trim().startsWith("http")) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid video URL.",
      });
    }

    console.log(`[Backend] Inspecting URL: ${url}`);
    const data = await inspectMediaUrl(url.trim());

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[Backend] Info error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to inspect video.",
    });
  }
});

/**
 * GET /api/media/queue-status
 * Live queue monitoring for high-concurrency traffic
 */
app.get("/api/media/queue-status", (req, res) => {
  res.json({ success: true, ...getQueueStatus() });
});

/**
 * GET /api/media/stream
 * Streams file directly into browser attachment with ZERO disk writes!
 * Concurrency-protected by FIFO queue semaphore to prevent 1-core VPS overload.
 */
app.get("/api/media/stream", async (req, res) => {
  let slotAcquired = false;
  let activeTicketId = null;

  try {
    const { url, formatSelector, mediaType, title } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).send("Missing URL parameter.");
    }

    // Acquire stream concurrency slot (queues user if 3 active streams running)
    const slot = await acquireStreamSlot();
    slotAcquired = true;
    activeTicketId = slot.ticketId;
    res.setHeader("X-Stream-Ticket", activeTicketId);

    // Release slot as soon as client closes connection or stream finishes
    res.on("close", () => {
      if (slotAcquired) {
        releaseStreamSlot(activeTicketId);
        slotAcquired = false;
      }
    });

    await streamMediaDirect(url, formatSelector, mediaType, title, res);
  } catch (error) {
    if (slotAcquired) {
      releaseStreamSlot(activeTicketId);
      slotAcquired = false;
    }
    console.error("[Backend] Stream error:", error);
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        error: error.message || "Streaming failed due to queue congestion.",
      });
    }
  }
});

/**
 * POST /api/image/info
 * Inspects YouTube Thumbnails, YouTube Community Posts, Instagram, Facebook, and X.com Images
 */
app.post("/api/image/info", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string" || !url.trim().startsWith("http")) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid media image or post URL.",
      });
    }

    console.log(`[Backend] Inspecting Image/Post URL: ${url}`);
    const data = await inspectMediaImages(url.trim());

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[Backend] Image Info error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to extract image assets.",
    });
  }
});

/**
 * GET /api/image/download
 * Proxies image streaming directly to browser attachment (bypasses CORS with 0 disk writes)
 */
app.get("/api/image/download", async (req, res) => {
  try {
    const { url, filename, view } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).send("Missing image URL parameter.");
    }

    const isInline = view === "1" || view === "true";
    await proxyImageStream(url, filename, res, isInline);
  } catch (error) {
    console.error("[Backend] Image proxy error:", error);
    if (!res.headersSent) {
      res.status(500).send("Image download failed.");
    }
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`====================================================`);
  console.log(`🚀 Zero-Disk Streaming Backend running on Port ${PORT} (0.0.0.0)`);
  console.log(`   - Root API:   GET  http://0.0.0.0:${PORT}/`);
  console.log(`   - Health API: GET  http://0.0.0.0:${PORT}/health`);
  console.log(`   - Info API:   POST http://0.0.0.0:${PORT}/api/media/info`);
  console.log(`   - Stream API: GET  http://0.0.0.0:${PORT}/api/media/stream`);
  console.log(`====================================================`);
});
