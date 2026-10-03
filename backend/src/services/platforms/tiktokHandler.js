import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * TikTok Modular Handler
 */
export const tiktokHandler = {
  name: "TikTok",
  engineName: "TikTok Zero-Disk Progressive Engine",
  processingMethod: "Zero-Disk Direct Stream",

  canHandle(url) {
    if (!url) return false;
    return url.toLowerCase().includes("tiktok.com");
  },

  inspect(rawUrl, ytdlpPath) {
    return new Promise((resolve, reject) => {
      const cleanUrl = sanitizeMediaUrl(rawUrl);
      const args = [
        "--js-runtimes", "node",
        "--dump-single-json",
        "--no-warnings",
        "--no-playlist",
        "--skip-download",
        cleanUrl,
      ];

      execFile(ytdlpPath, args, { maxBuffer: 1024 * 1024 * 30 }, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(`Failed to inspect TikTok video: ${(stderr || error.message).split("\n")[0]}`));
        }

        try {
          const info = JSON.parse(stdout);
          const duration = info.duration || 0;
          const formats = [];

          formats.push({
            formatId: "best",
            resolution: "HD Video (Original Quality)",
            ext: "mp4",
            hasAudio: true,
            filesizeMB: duration > 0 ? ((1500 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "8.0",
            filesizeApprox: duration > 0 ? `~${((1500 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~8.0 MB",
            vcodec: "h264",
            isHd: true,
            is4k: false,
            note: "Crystal-Clear HD TikTok Video with Original Audio",
            processingMethod: "Direct Stream",
          });

          formats.push({
            formatId: "bestaudio/best",
            resolution: "MP3 Audio (320kbps)",
            ext: "mp3",
            hasAudio: true,
            filesizeMB: duration > 0 ? ((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "2.5",
            filesizeApprox: duration > 0 ? `~${((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~2.5 MB",
            vcodec: "none",
            isHd: false,
            is4k: false,
            isAudioOnly: true,
            note: "High-Bitrate 320kbps Audio Track",
            processingMethod: "Direct LAME MP3 Extraction",
          });

          resolve({
            title: info.title || info.description?.substring(0, 60) || "TikTok Video",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || "TikTok Creator",
            viewCount: info.view_count || 0,
            platform: "tiktok",
            originalUrl: cleanUrl,
            engine: tiktokHandler.engineName,
            processingMethod: tiktokHandler.processingMethod,
            formats,
          });
        } catch (parseErr) {
          reject(new Error(`Failed to parse TikTok info: ${parseErr.message}`));
        }
      });
    });
  },

  startStream({ url, formatSelector, mediaType, ffmpegPath, ytdlpPath, res }) {
    const isAudio = mediaType === "audio";

    if (isAudio) {
      const ytdlpArgs = ["--js-runtimes", "node", "-f", "bestaudio/best", "-o", "-", url];
      const ffmpegArgs = ["-i", "pipe:0", "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-f", "mp3", "pipe:1"];

      const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
      const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

      ytdlpProc.stdout.pipe(ffmpegProc.stdin);
      ffmpegProc.stdout.pipe(res);

      ytdlpProc.on("error", (e) => console.error("[TikTokHandler] yt-dlp error:", e));
      ffmpegProc.on("error", (e) => console.error("[TikTokHandler] ffmpeg error:", e));

      ffmpegProc.on("close", (code) => {
        console.log(`[TikTokHandler] Audio stream finished with code ${code}`);
        res.end();
      });

      return {
        cleanup() {
          try {
            ytdlpProc.kill("SIGKILL");
            ffmpegProc.kill("SIGKILL");
          } catch (e) {}
        }
      };
    }

    const effectiveFormat = formatSelector || "best";
    const args = ["--js-runtimes", "node", "-f", effectiveFormat, "-o", "-", url];

    const streamerProcess = spawn(ytdlpPath, args);
    streamerProcess.stdout.pipe(res);

    streamerProcess.on("error", (err) => {
      console.error("[TikTokHandler] Stream error:", err);
      if (!res.headersSent) res.status(500).send("Stream error");
    });

    streamerProcess.on("close", (code) => {
      console.log(`[TikTokHandler] Stream finished with code ${code}`);
      res.end();
    });

    return {
      cleanup() {
        try {
          streamerProcess.kill("SIGKILL");
        } catch (e) {}
      }
    };
  }
};
