import { execFile } from "child_process";
import ffmpegPath from "ffmpeg-static";

/**
 * Common sanitization and helper utilities for platform handlers
 */
export function sanitizeMediaUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  try {
    const parsed = new URL(rawUrl.trim());
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("fbclid");
    parsed.searchParams.delete("igsh");
    parsed.searchParams.delete("t");
    return parsed.toString();
  } catch (e) {
    return rawUrl.trim().split("?")[0];
  }
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "N/A";
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getYtDlpPath() {
  return "yt-dlp";
}

export function getFfmpegPath() {
  return ffmpegPath || "ffmpeg";
}
