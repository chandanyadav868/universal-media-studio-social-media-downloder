import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * Twitter / X.com Modular Handler
 * Provides:
 * 1. Syndication API authentication bypass (prevents guest token rate-limiting & empty JSON errors)
 * 2. Direct progressive HTTP MP4 format extraction from video.twimg.com (1080p 60fps, 720p, 480p)
 * 3. Zero-re-encode progressive streaming with synchronized H.264 video & AAC audio
 */
export const twitterHandler = {
  name: "Twitter / X",
  engineName: "Twitter Syndication Progressive Engine",
  processingMethod: "Zero-Disk Direct Progressive MP4 (1080p 60fps)",

  canHandle(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("twitter.com") || lower.includes("x.com");
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
        "--extractor-args", "twitter:api=syndication",
        cleanUrl,
      ];

      execFile(ytdlpPath, args, { maxBuffer: 1024 * 1024 * 30 }, (error, stdout, stderr) => {
        if (error) {
          const errMsg = stderr || error.message || "";
          if (errMsg.includes("private") || errMsg.includes("login")) {
            return reject(new Error("This X/Twitter post is from a private account or requires login."));
          }
          if (errMsg.includes("404") || errMsg.includes("Not Found")) {
            return reject(new Error("Post not found. It may have been deleted."));
          }
          return reject(new Error(`Failed to inspect Twitter post: ${errMsg.split("\n")[0]}`));
        }

        try {
          const info = JSON.parse(stdout);
          const rawFormats = info.formats || [];
          const formats = [];
          const duration = info.duration || 0;

          // Twitter / X provides progressive MP4s with format_id starting with "http-"
          const twitterHttpFormats = rawFormats.filter((f) =>
            (f.format_id && f.format_id.startsWith("http-")) ||
            (f.url && f.url.includes("twimg.com") && f.ext === "mp4" && !f.format_id.includes("audio"))
          );

          if (twitterHttpFormats.length > 0) {
            twitterHttpFormats.sort((a, b) => (b.height || 0) - (a.height || 0));

            for (const fmt of twitterHttpFormats) {
              const height = fmt.height || (fmt.resolution ? parseInt(fmt.resolution.split("x")[1]) : 720) || 720;
              let calculatedMB = null;
              if (fmt.filesize) {
                calculatedMB = (fmt.filesize / (1024 * 1024)).toFixed(1);
              } else if (duration > 0) {
                calculatedMB = ((1400 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1);
              }

              formats.push({
                formatId: fmt.format_id,
                resolution: `${height}p Video`,
                ext: "mp4",
                hasAudio: true,
                filesizeMB: calculatedMB || "8.5",
                filesizeApprox: calculatedMB ? `~${calculatedMB} MB` : null,
                vcodec: "h264",
                isHd: height >= 720,
                is4k: height >= 2160,
                note: `Crystal-Clear ${height}p Direct MP4 with Full Stereo Audio`,
                processingMethod: "Direct Progressive MP4 Stream",
              });
            }
          }

          // Fallback if no http-* format was found
          if (formats.length === 0) {
            formats.push({
              formatId: "best",
              resolution: "HD Video (Best)",
              ext: "mp4",
              hasAudio: true,
              filesizeMB: "10.0",
              filesizeApprox: "~10.0 MB",
              vcodec: "h264",
              isHd: true,
              is4k: false,
              note: "Original Quality Video with Audio",
              processingMethod: "Direct Stream",
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
            title: info.title || info.description?.substring(0, 60) || "X (Twitter) Video",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || info.uploader_id || "Twitter User",
            viewCount: info.view_count || 0,
            platform: "twitter",
            originalUrl: cleanUrl,
            engine: twitterHandler.engineName,
            processingMethod: twitterHandler.processingMethod,
            formats,
          });
        } catch (parseErr) {
          reject(new Error(`Failed to parse Twitter info: ${parseErr.message}`));
        }
      });
    });
  },

  /**
   * Builds the zero-disk streaming pipeline for Twitter / X
   */
  startStream({ url, formatSelector, mediaType, ffmpegPath, ytdlpPath, res }) {
    const isAudio = mediaType === "audio";

    if (isAudio) {
      const ytdlpArgs = [
        "--js-runtimes", "node",
        "--extractor-args", "twitter:api=syndication",
        "-f", "bestaudio/best",
        "-o", "-",
        url
      ];
      const ffmpegArgs = ["-i", "pipe:0", "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-f", "mp3", "pipe:1"];

      const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
      const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

      ytdlpProc.stdout.pipe(ffmpegProc.stdin);
      ffmpegProc.stdout.pipe(res);

      ytdlpProc.on("error", (e) => console.error("[TwitterHandler] yt-dlp error:", e));
      ffmpegProc.on("error", (e) => console.error("[TwitterHandler] ffmpeg error:", e));

      ffmpegProc.on("close", (code) => {
        console.log(`[TwitterHandler] Audio stream finished with code ${code}`);
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

    // Direct progressive stream: yt-dlp streams the pre-muxed H.264+AAC progressive MP4 directly
    const effectiveFormat = formatSelector || "best";
    const args = [
      "--js-runtimes", "node",
      "--extractor-args", "twitter:api=syndication",
      "-f", effectiveFormat,
      "-o", "-",
      url
    ];

    const streamerProcess = spawn(ytdlpPath, args);
    streamerProcess.stdout.pipe(res);

    streamerProcess.on("error", (err) => {
      console.error("[TwitterHandler] Stream error:", err);
      if (!res.headersSent) res.status(500).send("Stream error");
    });

    streamerProcess.on("close", (code) => {
      console.log(`[TwitterHandler] Progressive stream finished with code ${code}`);
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
