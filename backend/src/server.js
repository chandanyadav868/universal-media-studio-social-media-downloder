import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { inspectMediaUrl, streamMediaDirect } from "./services/zeroDiskStreamService.js";
import { inspectMediaImages, proxyImageStream } from "./services/imageDownloaderService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Universal Media Studio Streaming Backend" });
});

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
 * GET /api/media/stream
 * Streams file directly into browser attachment with ZERO disk writes!
 */
app.get("/api/media/stream", async (req, res) => {
  try {
    const { url, formatSelector, mediaType, title } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).send("Missing URL parameter.");
    }

    await streamMediaDirect(url, formatSelector, mediaType, title, res);
  } catch (error) {
    console.error("[Backend] Stream error:", error);
    if (!res.headersSent) {
      res.status(500).send("Streaming failed.");
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

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Zero-Disk Streaming Backend running on Port ${PORT}`);
  console.log(`   - Info API:   POST http://localhost:${PORT}/api/media/info`);
  console.log(`   - Stream API: GET  http://localhost:${PORT}/api/media/stream`);
  console.log(`====================================================`);
});
