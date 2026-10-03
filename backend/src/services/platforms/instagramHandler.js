import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * Instagram Modular Handler
 * Handles Reels, Posts, and Videos via direct progressive MP4
 */
export const instagramHandler = {
  name: "Instagram",
  engineName: "Instagram Progressive Direct Engine",
  processingMethod: "Zero-Disk Direct Progressive MP4 (Native HD)",

  canHandle(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("instagram.com") || lower.includes("instagr.am");
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
          const errMsg = stderr || error.message || "";
          if (errMsg.includes("login") || errMsg.includes("checkpoint")) {
            return reject(new Error("This Instagram post is private or requires login."));
          }
          return reject(new Error(`Failed to inspect Instagram media: ${errMsg.split("\n")[0]}`));
        }

        try {
          const info = JSON.parse(stdout);
          const duration = info.duration || 0;
          const formats = [];

          // Instagram standard HD progressive format
          formats.push({
            formatId: "1/best",
            resolution: "HD Video (Original Quality)",
            ext: "mp4",
            hasAudio: true,
            filesizeMB: duration > 0 ? ((1500 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "12.0",
            filesizeApprox: duration > 0 ? `~${((1500 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~12.0 MB",
            vcodec: "h264",
            isHd: true,
            is4k: false,
            note: "Original Quality HD Reel/Video with Stereo Audio",
            processingMethod: "Direct Progressive MP4 Stream",
          });

          // Dedicated MP3 audio track
          formats.push({
            formatId: "bestaudio/best",
            resolution: "MP3 Audio (320kbps)",
            ext: "mp3",
            hasAudio: true,
            filesizeMB: duration > 0 ? ((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "3.0",
            filesizeApprox: duration > 0 ? `~${((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~3.0 MB",
            vcodec: "none",
            isHd: false,
            is4k: false,
            isAudioOnly: true,
            note: "Clean Audio Track Extracted to MP3",
            processingMethod: "Direct LAME MP3 Extraction",
          });

          resolve({
            title: info.title || info.description?.substring(0, 60) || "Instagram Reel",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || info.channel || "Instagram Creator",
            viewCount: info.view_count || 0,
            platform: "instagram",
            originalUrl: cleanUrl,
            engine: instagramHandler.engineName,
            processingMethod: instagramHandler.processingMethod,
            formats,
          });
        } catch (parseErr) {
          reject(new Error(`Failed to parse Instagram info: ${parseErr.message}`));
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

      ytdlpProc.on("error", (e) => console.error("[InstagramHandler] yt-dlp error:", e));
      ffmpegProc.on("error", (e) => console.error("[InstagramHandler] ffmpeg error:", e));

      ffmpegProc.on("close", (code) => {
        console.log(`[InstagramHandler] Audio stream finished with code ${code}`);
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

    // Always stream native progressive MP4 (format 1 / best)
    const args = [
      "--js-runtimes", "node",
      "-f", "1/best",
      "-o", "-",
      url
    ];

    const streamerProcess = spawn(ytdlpPath, args);
    streamerProcess.stdout.pipe(res);

    streamerProcess.on("error", (err) => {
      console.error("[InstagramHandler] Stream error:", err);
      if (!res.headersSent) res.status(500).send("Stream error");
    });

    streamerProcess.on("close", (code) => {
      console.log(`[InstagramHandler] Progressive stream finished with code ${code}`);
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
