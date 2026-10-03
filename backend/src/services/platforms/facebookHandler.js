import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * Facebook Modular Handler
 * Handles Facebook Watch, Reels, and Posts via HD and SD progressive MP4
 */
export const facebookHandler = {
  name: "Facebook",
  engineName: "Facebook Progressive Direct Engine",
  processingMethod: "Zero-Disk Direct HD/SD Progressive MP4",

  canHandle(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("facebook.com") || lower.includes("fb.watch") || lower.includes("fb.com");
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
          if (errMsg.includes("private") || errMsg.includes("login")) {
            return reject(new Error("This Facebook video is from a private group or account."));
          }
          return reject(new Error(`Failed to inspect Facebook video: ${errMsg.split("\n")[0]}`));
        }

        try {
          const info = JSON.parse(stdout);
          const duration = info.duration || 0;
          const rawFormats = info.formats || [];
          const formats = [];

          const fbHd = rawFormats.find((f) => f.format_id === "hd" || (f.height && f.height >= 720));
          const fbSd = rawFormats.find((f) => f.format_id === "sd" || (f.height && f.height < 720));

          if (fbHd) {
            formats.push({
              formatId: "hd",
              resolution: "HD Video (720p/1080p)",
              ext: "mp4",
              hasAudio: true,
              filesizeMB: duration > 0 ? ((1400 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "9.0",
              filesizeApprox: duration > 0 ? `~${((1400 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~9.0 MB",
              vcodec: "h264",
              isHd: true,
              is4k: false,
              note: "Crystal-Clear HD Video with Audio (Universal MP4)",
              processingMethod: "Direct Progressive MP4 Stream",
            });
          }

          if (fbSd || formats.length === 0) {
            formats.push({
              formatId: "sd",
              resolution: "SD Video (480p/360p)",
              ext: "mp4",
              hasAudio: true,
              filesizeMB: duration > 0 ? ((700 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "4.5",
              filesizeApprox: duration > 0 ? `~${((700 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~4.5 MB",
              vcodec: "h264",
              isHd: false,
              is4k: false,
              note: "Standard Definition Progressive MP4 with Audio",
              processingMethod: "Direct Progressive MP4 Stream",
            });
          }

          // Dedicated MP3 audio track
          formats.push({
            formatId: "bestaudio/best",
            resolution: "MP3 Audio (320kbps)",
            ext: "mp3",
            hasAudio: true,
            filesizeMB: duration > 0 ? ((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "3.5",
            filesizeApprox: duration > 0 ? `~${((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~3.5 MB",
            vcodec: "none",
            isHd: false,
            is4k: false,
            isAudioOnly: true,
            note: "High-Bitrate 320kbps Audio Track",
            processingMethod: "Direct LAME MP3 Extraction",
          });

          resolve({
            title: info.title || "Facebook Video",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || "Facebook Creator",
            viewCount: info.view_count || 0,
            platform: "facebook",
            originalUrl: cleanUrl,
            engine: facebookHandler.engineName,
            processingMethod: facebookHandler.processingMethod,
            formats,
          });
        } catch (parseErr) {
          reject(new Error(`Failed to parse Facebook info: ${parseErr.message}`));
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

      ytdlpProc.on("error", (e) => console.error("[FacebookHandler] yt-dlp error:", e));
      ffmpegProc.on("error", (e) => console.error("[FacebookHandler] ffmpeg error:", e));

      ffmpegProc.on("close", (code) => {
        console.log(`[FacebookHandler] Audio stream finished with code ${code}`);
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

    const effectiveFormat = formatSelector === "sd" ? "sd/best" : "hd/best";
    const args = [
      "--js-runtimes", "node",
      "-f", effectiveFormat,
      "-o", "-",
      url
    ];

    const streamerProcess = spawn(ytdlpPath, args);
    streamerProcess.stdout.pipe(res);

    streamerProcess.on("error", (err) => {
      console.error("[FacebookHandler] Stream error:", err);
      if (!res.headersSent) res.status(500).send("Stream error");
    });

    streamerProcess.on("close", (code) => {
      console.log(`[FacebookHandler] Progressive stream finished with code ${code}`);
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
