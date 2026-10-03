import { getYtDlpPath, getFfmpegPath, sanitizeMediaUrl } from "./platforms/baseHandler.js";
import { getPlatformHandler, getSupportedPlatformEngines } from "./platforms/platformManager.js";

/**
 * Inspect video URL using the dedicated platform handler component
 */
export async function inspectMediaUrl(rawUrl) {
  const cleanUrl = sanitizeMediaUrl(rawUrl);
  const handler = getPlatformHandler(cleanUrl);
  const ytdlp = getYtDlpPath();

  console.log(`[ZeroDiskService] Using handler "${handler.name}" for URL: ${cleanUrl}`);
  return await handler.inspect(cleanUrl, ytdlp);
}

/**
 * Streams media directly using the dedicated platform handler component
 * 100% in-memory with ZERO disk writes!
 */
export async function streamMediaDirect(url, formatSelector, mediaType, title, res) {
  const cleanUrl = sanitizeMediaUrl(url);
  const handler = getPlatformHandler(cleanUrl);
  const ytdlp = getYtDlpPath();
  const ffmpeg = getFfmpegPath();

  const isAudio = mediaType === "audio" && !(formatSelector && (formatSelector.includes("+") || formatSelector === "hd" || formatSelector === "sd" || formatSelector === "1"));
  const ext = isAudio ? "mp3" : "mp4";
  const contentType = isAudio ? "audio/mpeg" : "video/mp4";

  const cleanTitle = (title || "video")
    .replace(/[^\w\s-]/gi, "")
    .replace(/\s+/g, "_")
    .substring(0, 60);

  // Set HTTP headers for direct attachment download
  res.setHeader("Content-Disposition", `attachment; filename="${cleanTitle}.${ext}"`);
  res.setHeader("Content-Type", contentType);
  res.setHeader("Transfer-Encoding", "chunked");

  console.log(`[ZeroDiskService] Dispatching stream to [${handler.name}] -> format: ${formatSelector}, type: ${mediaType}`);

  const session = handler.startStream({
    url: cleanUrl,
    formatSelector,
    mediaType,
    ffmpegPath: ffmpeg,
    ytdlpPath: ytdlp,
    res
  });

  res.on("close", () => {
    if (session && typeof session.cleanup === "function") {
      session.cleanup();
    }
  });
}

export { getSupportedPlatformEngines, getYtDlpPath, sanitizeMediaUrl };
