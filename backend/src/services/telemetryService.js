import fs from "fs";
import path from "path";

/**
 * Universal Media Studio - Persistent Telemetry & Real-Time Error Monitoring Engine
 * Zero external database dependencies:
 *   - In-memory ring buffer (fast query & SSE broadcast)
 *   - Persistent disk-backed JSONL file (persists across container restarts)
 *   - Auto-rotating log storage (capped to 5,000 entries / 10MB)
 */

const LOGS_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOGS_DIR, "errors.jsonl");
const MAX_MEMORY_LOGS = 500;
const MAX_FILE_ENTRIES = 5000;

// Admin secret for dashboard access
export const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "ums_admin_2026";

// Ensure logs directory exists on disk
if (!fs.existsSync(LOGS_DIR)) {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  } catch (e) {
    console.error("[Telemetry] Failed to create logs dir:", e.message);
  }
}

// In-memory circular buffer
const memoryLogs = [];

// Active SSE client connections for real-time live monitoring
const sseClients = new Set();

// Telemetry counters
const stats = {
  totalRequests: 0,
  totalErrors: 0,
  totalStreams: 0,
  totalInspections: 0,
  startedAt: new Date().toISOString(),
};

// Load existing disk logs on startup
function loadRecentLogsFromDisk() {
  if (!fs.existsSync(LOG_FILE)) return;
  try {
    const content = fs.readFileSync(LOG_FILE, "utf8");
    const lines = content.trim().split("\n").filter(Boolean);
    const recent = lines.slice(-MAX_MEMORY_LOGS);
    for (const line of recent) {
      try {
        const parsed = JSON.parse(line);
        memoryLogs.push(parsed);
        stats.totalRequests++;
        if (parsed.level === "ERROR") stats.totalErrors++;
        if (parsed.type === "stream") stats.totalStreams++;
        if (parsed.type === "inspect") stats.totalInspections++;
      } catch (err) {}
    }
    console.log(`[Telemetry] Loaded ${memoryLogs.length} historical logs from persistent disk storage.`);
  } catch (err) {
    console.error("[Telemetry] Error reading log file on startup:", err.message);
  }
}

loadRecentLogsFromDisk();

/**
 * Append a log entry to persistent disk storage with automatic rotation
 */
function appendToDisk(entry) {
  try {
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(LOG_FILE, line, "utf8");

    // Check size & rotate if needed
    const stat = fs.statSync(LOG_FILE);
    if (stat.size > 10 * 1024 * 1024) { // 10MB
      rotateDiskLogs();
    }
  } catch (e) {
    console.error("[Telemetry] Failed to write to disk log:", e.message);
  }
}

function rotateDiskLogs() {
  try {
    if (!fs.existsSync(LOG_FILE)) return;
    const content = fs.readFileSync(LOG_FILE, "utf8");
    const lines = content.trim().split("\n").filter(Boolean);
    if (lines.length > MAX_FILE_ENTRIES) {
      const retained = lines.slice(-Math.floor(MAX_FILE_ENTRIES / 2));
      fs.writeFileSync(LOG_FILE, retained.join("\n") + "\n", "utf8");
      console.log(`[Telemetry] Rotated persistent log file down to ${retained.length} entries.`);
    }
  } catch (e) {
    console.error("[Telemetry] Log rotation error:", e.message);
  }
}

/**
 * Broadcast event to all connected developer SSE dashboards
 */
function broadcastSSE(entry) {
  const payload = `data: ${JSON.stringify(entry)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

/**
 * Log an activity or error
 */
export function logActivity({
  level = "INFO", // "INFO" | "WARN" | "ERROR"
  type = "stream", // "stream" | "inspect" | "image" | "client" | "system"
  platform = "general",
  url = "",
  title = "",
  format = "",
  status = 200,
  durationMs = null,
  error = null,
  stack = null,
  clientIp = "",
  userAgent = "",
}) {
  stats.totalRequests++;
  if (level === "ERROR") stats.totalErrors++;
  if (type === "stream") stats.totalStreams++;
  if (type === "inspect") stats.totalInspections++;

  const errorMessage = error instanceof Error ? error.message : (error || "");
  const errorStack = stack || (error instanceof Error ? error.stack : "");

  const entry = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    level,
    type,
    platform: platform || "general",
    url: url || "",
    title: title || "",
    format: format || "",
    status,
    durationMs,
    errorMessage,
    stack: errorStack,
    clientIp: clientIp || "unknown",
    userAgent: userAgent ? userAgent.substring(0, 150) : "",
  };

  // 1. In-memory buffer
  memoryLogs.unshift(entry);
  if (memoryLogs.length > MAX_MEMORY_LOGS) {
    memoryLogs.pop();
  }

  // 2. Persistent disk (always write ERROR and WARN, sample INFO)
  if (level === "ERROR" || level === "WARN" || Math.random() < 0.25) {
    appendToDisk(entry);
  }

  // 3. Real-time broadcast to developer dashboard
  broadcastSSE(entry);

  return entry;
}

/**
 * Query logs with search & filters
 */
export function getLogs({ limit = 100, level = "", type = "", search = "" } = {}) {
  let filtered = memoryLogs;

  if (level) {
    filtered = filtered.filter((l) => l.level === level.toUpperCase());
  }

  if (type) {
    filtered = filtered.filter((l) => l.type === type.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        (l.url && l.url.toLowerCase().includes(s)) ||
        (l.title && l.title.toLowerCase().includes(s)) ||
        (l.errorMessage && l.errorMessage.toLowerCase().includes(s)) ||
        (l.platform && l.platform.toLowerCase().includes(s))
    );
  }

  return filtered.slice(0, Math.min(limit, MAX_MEMORY_LOGS));
}

/**
 * Live Dashboard Stats
 */
export function getTelemetryStats() {
  const errorRate = stats.totalRequests > 0
    ? ((stats.totalErrors / stats.totalRequests) * 100).toFixed(1)
    : "0.0";

  return {
    ...stats,
    errorRate: `${errorRate}%`,
    inMemoryCount: memoryLogs.length,
    activeSSEListeners: sseClients.size,
    uptimeSeconds: Math.floor(process.uptime()),
    diskLogSizeKB: fs.existsSync(LOG_FILE) ? Math.round(fs.statSync(LOG_FILE).size / 1024) : 0,
  };
}

/**
 * Clear memory & disk logs
 */
export function clearLogs() {
  memoryLogs.length = 0;
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, "", "utf8");
    }
  } catch (e) {}
  stats.totalErrors = 0;
  return { success: true, message: "Logs cleared successfully." };
}

/**
 * Register SSE Client for real-time live monitoring
 */
export function subscribeSSE(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  // Send initial connection packet
  res.write(`data: ${JSON.stringify({ type: "connected", time: new Date().toISOString() })}\n\n`);

  // Heartbeat comment every 15s keeps intermediate reverse proxies (Nginx/Traefik/Cloudflare)
  // and browser connections alive without interrupting EventSource
  const heartbeatTimer = setInterval(() => {
    try {
      res.write(": keepalive\n\n");
    } catch (e) {
      clearInterval(heartbeatTimer);
    }
  }, 15000);

  sseClients.add(res);

  req.on("close", () => {
    clearInterval(heartbeatTimer);
    sseClients.delete(res);
  });
}
