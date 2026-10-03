import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * Generic Fallback Handler for Reddit, Vimeo, Pinterest, etc.
 */
export const genericHandler = {
  name: "Universal Media",
  engineName: "Universal Zero-Disk Remuxer",
  processingMethod: "Zero-Disk DASH Remux (Universal AAC)",

  canHandle(url) {
    return true; // Fallback handler for all valid URLs
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
          return reject(new Error(`Failed to inspect media: ${(stderr || error.message).split("\n")[0]}`));
        }

        try {
          const info = JSON.parse(stdout);
          const duration = info.duration || 0;
          const formats = [];

          formats.push({
            formatId: "bestvideo[vcodec^=avc]+bestaudio[ext=m4a]/bestvideo+bestaudio/best",
            resolution: "HD Video (Original Quality)",
            ext: "mp4",
            hasAudio: true,
            filesizeMB: duration > 0 ? ((1400 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1) : "10.0",
            filesizeApprox: duration > 0 ? `~${((1400 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1)} MB` : "~10.0 MB",
            vcodec: "h264",
            isHd: true,
            is4k: false,
            note: "Standard MP4 with High-Definition Audio",
            processingMethod: "Universal Remux",
          });

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
            note: "Universal High-Bitrate MP3",
            processingMethod: "Direct LAME MP3 Extraction",
          });

          resolve({
            title: info.title || "Universal Media Video",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || "Creator",
            viewCount: info.view_count || 0,
            platform: "generic",
            originalUrl: cleanUrl,
            engine: genericHandler.engineName,
            processingMethod: genericHandler.processingMethod,
            formats,
          });
        } catch (parseErr) {
          reject(new Error(`Failed to parse media info: ${parseErr.message}`));
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

      ytdlpProc.on("error", (e) => console.error("[GenericHandler] yt-dlp error:", e));
      ffmpegProc.on("error", (e) => console.error("[GenericHandler] ffmpeg error:", e));

      ffmpegProc.on("close", (code) => {
        console.log(`[GenericHandler] Audio stream finished with code ${code}`);
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

    const effectiveFormat = formatSelector || "bestvideo[vcodec^=avc]+bestaudio[ext=m4a]/bestvideo+bestaudio/best";
    const ytdlpArgs = [
      "--js-runtimes", "node",
      "--ffmpeg-location", ffmpegPath,
      "-f", effectiveFormat,
      "-o", "-",
      url
    ];

    const ffmpegArgs = [
      "-fflags", "+genpts",
      "-i", "pipe:0",
      "-c:v", "copy",
      "-c:a", "aac",
      "-b:a", "192k",
      "-f", "mp4",
      "-movflags", "frag_keyframe+default_base_moof",
      "pipe:1"
    ];

    const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
    const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

    ytdlpProc.stdout.pipe(ffmpegProc.stdin);
    ffmpegProc.stdout.pipe(res);

    ytdlpProc.on("error", (e) => console.error("[GenericHandler] yt-dlp error:", e));
    ffmpegProc.on("error", (e) => console.error("[GenericHandler] ffmpeg error:", e));

    ffmpegProc.on("close", (code) => {
      console.log(`[GenericHandler] Stream finished with code ${code}`);
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
};
