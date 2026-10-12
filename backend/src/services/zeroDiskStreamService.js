import { getYtDlpPath, getFfmpegPath, sanitizeMediaUrl } from "./platforms/baseHandler.js";
import { getPlatformHandler, getSupportedPlatformEngines } from "./platforms/platformManager.js";
import { logActivity } from "./telemetryService.js";

/**
 * Inspect video URL using the dedicated platform handler component
 */
export async function inspectMediaUrl(rawUrl) {
  const startTime = Date.now();
  const cleanUrl = sanitizeMediaUrl(rawUrl);
  const handler = getPlatformHandler(cleanUrl);
  const ytdlp = getYtDlpPath();

  console.log(`[ZeroDiskService] Using handler "${handler.name}" for URL: ${cleanUrl}`);
  try {
    const result = await handler.inspect(cleanUrl, ytdlp);
    logActivity({
      level: "INFO",
      type: "inspect",
      platform: result.platform || handler.name.toLowerCase(),
      url: cleanUrl,
      title: result.title || "",
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return result;
  } catch (err) {
    logActivity({
      level: "ERROR",
      type: "inspect",
      platform: handler.name.toLowerCase(),
      url: cleanUrl,
      status: 500,
      durationMs: Date.now() - startTime,
      error: err,
    });
    throw err;
  }
}

/**
 * Streams media directly using the dedicated platform handler component
 * 100% in-memory with ZERO disk writes!
 * Robust RFC 5987 / RFC 6266 filename encoding ensures Hindi/Unicode never throws ERR_INVALID_CHAR!
 */
export async function streamMediaDirect(url, formatSelector, mediaType, title, res) {
  const startTime = Date.now();
  let cleanUrl = sanitizeMediaUrl(url);

  // Normalize YouTube Shorts URLs to canonical watch URL
  cleanUrl = cleanUrl.replace(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/, "youtube.com/watch?v=$1");

  const handler = getPlatformHandler(cleanUrl);
  const ytdlp = getYtDlpPath();
  const ffmpeg = getFfmpegPath();

  const isAudio = mediaType === "audio" && !(formatSelector && (formatSelector.includes("+") || formatSelector === "hd" || formatSelector === "sd" || formatSelector === "1"));
  const ext = isAudio ? "mp3" : "mp4";
  const contentType = isAudio ? "audio/mpeg" : "video/mp4";

  // 1. Safe ASCII filename fallback (strictly valid ASCII for legacy HTTP headers)
  const rawTitle = (title || "video").trim();
  const safeAscii = rawTitle
    .replace(/[^\w\s-]/gi, "")
    .replace(/\s+/g, "_")
    .substring(0, 50)
    .trim() || "media_download";

  // 2. RFC 5987 / RFC 6266 UTF-8 encoded filename (supports Hindi, Arabic, Japanese, emojis)
  const encodedUtf8 = encodeURIComponent(rawTitle.replace(/[\r\n\t]/g, "_") || "media_download");

  // Set HTTP headers safely without ERR_INVALID_CHAR
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeAscii}.${ext}"; filename*=UTF-8''${encodedUtf8}.${ext}`
  );
  res.setHeader("Content-Type", contentType);
  res.setHeader("Transfer-Encoding", "chunked");

  console.log(`[ZeroDiskService] Dispatching stream to [${handler.name}] -> format: ${formatSelector}, type: ${mediaType}, title: ${safeAscii}`);

  try {
    const session = handler.startStream({
      url: cleanUrl,
      formatSelector,
      mediaType,
      ffmpegPath: ffmpeg,
      ytdlpPath: ytdlp,
      res,
      onCompleted: () => {
        logActivity({
          level: "INFO",
          type: "stream",
          platform: handler.name.toLowerCase(),
          url: cleanUrl,
          title: rawTitle,
          format: formatSelector || ext,
          status: 200,
          durationMs: Date.now() - startTime,
        });
      },
      onError: (streamErr) => {
        logActivity({
          level: "ERROR",
          type: "stream",
          platform: handler.name.toLowerCase(),
          url: cleanUrl,
          title: rawTitle,
          format: formatSelector || ext,
          status: 500,
          durationMs: Date.now() - startTime,
          error: streamErr,
        });
      }
    });

    res.on("close", () => {
      if (session && typeof session.cleanup === "function") {
        session.cleanup();
      }
    });
  } catch (err) {
    logActivity({
      level: "ERROR",
      type: "stream",
      platform: handler.name.toLowerCase(),
      url: cleanUrl,
      title: rawTitle,
      format: formatSelector || ext,
      status: 500,
      durationMs: Date.now() - startTime,
      error: err,
    });
    throw err;
  }
}

export { getSupportedPlatformEngines, getYtDlpPath, sanitizeMediaUrl };
