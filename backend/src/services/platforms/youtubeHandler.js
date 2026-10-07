import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * YouTube & YouTube Shorts Modular Handler
 * Features:
 * 1. Hybrid Failover Engine: Automatically rotates across PO-Token provider, Android/Web, iOS/MWeb, and Cookies
 * 2. Normalized vertical Shorts resolution (720p HD, 1080p FHD, 4K)
 * 3. Strict H.264 (AVC1) format filtering
 * 4. 100% Windows Media Player & Apple compatible standard AAC audio remuxing
 */
export const youtubeHandler = {
  name: "YouTube",
  engineName: "YouTube Studio DASH Remuxer (Hybrid Failover + AAC)",
  processingMethod: "Zero-Disk DASH Muxing with Universal Stereo AAC",

  // Cache last successful strategy to optimize streaming
  _lastSuccessfulStrategy: null,

  canHandle(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("youtube.com") || lower.includes("youtu.be");
  },

  /**
   * Generates hybrid failover strategies in prioritized order
   */
  _getStrategies() {
    const potServer = process.env.POT_PROVIDER_URL || "http://pot-provider:4416";
    const cookiesPath = path.resolve(process.cwd(), "cookies.txt");

    // Automatically sync cookies from YOUTUBE_COOKIES env variable if provided
    if (process.env.YOUTUBE_COOKIES && process.env.YOUTUBE_COOKIES.trim().length > 10) {
      try {
        fs.writeFileSync(cookiesPath, process.env.YOUTUBE_COOKIES.trim(), "utf8");
      } catch (e) {}
    }

    const hasCookies = fs.existsSync(cookiesPath) && fs.statSync(cookiesPath).size > 10;
    const strategies = [];

    // 1. If cookies are provided, use authenticated session first
    if (hasCookies) {
      strategies.push({
        name: "Authenticated Cookie Session",
        args: [
          "--force-ipv4",
          "--cookies", cookiesPath,
          "--extractor-args", "youtube:player_client=web,android",
        ],
      });
    }

    // 2. Smart TV & Android Client (Bypasses datacenter VPS bot challenges without cookies)
    strategies.push({
      name: "Smart TV & Android Client Evasion",
      args: [
        "--force-ipv4",
        "--extractor-args", "youtube:player_client=tv,android",
      ],
    });

    // 3. Docker POT-Provider + Android/Web Hybrid
    strategies.push({
      name: "Docker POT-Provider Hybrid",
      args: [
        "--force-ipv4",
        "--js-runtimes", "node",
        "--extractor-args", `youtubepot-bgutilhttp:base_url=${potServer};youtube:player_client=android,web`,
      ],
    });

    // 4. iOS & Mobile Web Emulation
    strategies.push({
      name: "iOS & Mobile Web Emulation",
      args: [
        "--force-ipv4",
        "--extractor-args", "youtube:player_client=ios,mweb",
      ],
    });

    // 5. Standard Android Client Direct
    strategies.push({
      name: "Android Mobile Client Direct",
      args: [
        "--force-ipv4",
        "--extractor-args", "youtube:player_client=android",
      ],
    });

    return strategies;
  },

  /**
   * Executes inspection for a single strategy
   */
  _runInspect(cleanUrl, ytdlpPath, strategy) {
    return new Promise((resolve, reject) => {
      const args = [
        ...strategy.args,
        "--dump-single-json",
        "--no-warnings",
        "--no-playlist",
        "--skip-download",
        cleanUrl,
      ];

      execFile(ytdlpPath, args, { maxBuffer: 1024 * 1024 * 30 }, (error, stdout, stderr) => {
        if (error) {
          const errMsg = stderr || error.message || "";
          return reject(new Error(errMsg.split("\n")[0] || "yt-dlp inspection failed."));
        }

        try {
          const info = JSON.parse(stdout);
          const rawFormats = info.formats || [];
          const formats = [];
          const duration = info.duration || 0;

          // Filter for valid video formats
          const videoFormats = rawFormats.filter(
            (f) => (f.vcodec && f.vcodec !== "none") || (f.height || f.resolution)
          );

          // Group formats by standard height bucket
          const formatsByResolution = new Map();
          for (const fmt of videoFormats) {
            const w = fmt.width || 0;
            const h = fmt.height || parseInt(fmt.resolution) || 0;
            const isVertical = h > w && w > 0;
            const standardHeight = isVertical ? w : h;
            if (standardHeight <= 0) continue;

            let bucket = 360;
            if (standardHeight >= 2160) bucket = 2160;
            else if (standardHeight >= 1440) bucket = 1440;
            else if (standardHeight >= 1080) bucket = 1080;
            else if (standardHeight >= 720) bucket = 720;
            else if (standardHeight >= 480) bucket = 480;
            else if (standardHeight >= 360) bucket = 360;
            else bucket = 240;

            if (!formatsByResolution.has(bucket)) {
              formatsByResolution.set(bucket, []);
            }
            formatsByResolution.get(bucket).push(fmt);
          }

          // Sort buckets descending
          const sortedBuckets = Array.from(formatsByResolution.keys()).sort((a, b) => b - a);

          for (const bucket of sortedBuckets) {
            const group = formatsByResolution.get(bucket);

            group.sort((a, b) => {
              const aIsHttps = (a.protocol || "").startsWith("http") && !(a.protocol || "").includes("m3u8");
              const bIsHttps = (b.protocol || "").startsWith("http") && !(b.protocol || "").includes("m3u8");
              if (aIsHttps && !bIsHttps) return -1;
              if (!aIsHttps && bIsHttps) return 1;

              const aIsAvc = (a.vcodec || "").startsWith("avc") || (a.vcodec || "").startsWith("h264");
              const bIsAvc = (b.vcodec || "").startsWith("avc") || (b.vcodec || "").startsWith("h264");
              if (aIsAvc && !bIsAvc) return -1;
              if (!aIsAvc && bIsAvc) return 1;

              return (b.tbr || 0) - (a.tbr || 0);
            });

            const bestFmt = group[0];
            const hasAudio = bestFmt.acodec && bestFmt.acodec !== "none";
            const isDash = !hasAudio;

            let calculatedMB = null;
            if (bestFmt.filesize) {
              calculatedMB = (bestFmt.filesize / (1024 * 1024)).toFixed(1);
            } else if (bestFmt.filesize_approx) {
              calculatedMB = (bestFmt.filesize_approx / (1024 * 1024)).toFixed(1);
            } else if (duration > 0) {
              const vbr = bestFmt.tbr || bestFmt.vbr || (bucket >= 2160 ? 18000 : bucket >= 1080 ? 3000 : bucket >= 720 ? 1500 : 700);
              const totalBitrate = vbr + (isDash ? 128 : 0);
              calculatedMB = ((totalBitrate * duration * 1000) / (8 * 1024 * 1024)).toFixed(1);
            }

            formats.push({
              formatId: isDash ? `${bestFmt.format_id}+bestaudio[ext=m4a]/bestaudio/best` : bestFmt.format_id,
              resolution: `${bucket}p Video`,
              ext: "mp4",
              hasAudio: true,
              filesizeMB: calculatedMB || "15.0",
              filesizeApprox: calculatedMB ? `~${calculatedMB} MB` : null,
              vcodec: bestFmt.vcodec ? bestFmt.vcodec.split(".")[0] : "h264",
              isHd: bucket >= 720,
              is4k: bucket >= 2160,
              note: `Full ${bucket}p Video with Synchronized Universal Audio`,
              processingMethod: "Zero-Disk DASH Remux (Universal AAC)",
            });
          }

          // Dedicated High-Bitrate MP3 Audio Track
          let audioMB = null;
          if (duration > 0) {
            audioMB = ((320 * duration * 1000) / (8 * 1024 * 1024)).toFixed(1);
          }
          formats.push({
            formatId: "bestaudio/best",
            resolution: "MP3 Audio (320kbps)",
            ext: "mp3",
            hasAudio: true,
            filesizeMB: audioMB || "4.5",
            filesizeApprox: audioMB ? `~${audioMB} MB` : "~4.5 MB",
            vcodec: "none",
            isHd: false,
            is4k: false,
            isAudioOnly: true,
            note: "High-Bitrate 320kbps Audio Track",
            processingMethod: "Direct LAME MP3 Extraction",
          });

          resolve({
            title: info.title || "YouTube Video",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || info.channel || "YouTube Creator",
            viewCount: info.view_count || 0,
            platform: "youtube",
            originalUrl: cleanUrl,
            engine: youtubeHandler.engineName,
            processingMethod: youtubeHandler.processingMethod,
            formats,
          });
        } catch (parseErr) {
          reject(new Error(`Failed to parse YouTube info: ${parseErr.message}`));
        }
      });
    });
  },

  /**
   * Hybrid Failover Engine: Tries strategies sequentially until one succeeds
   */
  async inspect(rawUrl, ytdlpPath) {
    const cleanUrl = sanitizeMediaUrl(rawUrl);
    const strategies = this._getStrategies();

    let lastError = null;
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      try {
        const result = await this._runInspect(cleanUrl, ytdlpPath, strategy);
        console.log(`[YouTubeHandler] Succeeded using strategy: ${strategy.name}`);
        this._lastSuccessfulStrategy = strategy;
        return result;
      } catch (err) {
        lastError = err;
        const errMsg = err.message || "";
        console.warn(`[YouTubeHandler] Strategy ${i + 1}/${strategies.length} (${strategy.name}) failed: ${errMsg}`);

        // Check if error is private or removed (do not retry for genuinely non-existent videos)
        if (errMsg.includes("private") || errMsg.includes("404") || errMsg.includes("unavailable")) {
          throw err;
        }
      }
    }

    throw new Error(`Failed to inspect YouTube video after all hybrid failovers: ${lastError?.message || "All strategies failed."}`);
  },

  /**
   * Builds the zero-disk streaming pipeline for YouTube with hybrid fallback arguments
   */
  startStream({ url, formatSelector, mediaType, ffmpegPath, ytdlpPath, res }) {
    const isAudio = mediaType === "audio" && !(formatSelector && (formatSelector.includes("+") || formatSelector === "hd" || formatSelector === "sd"));
    const activeStrategy = this._lastSuccessfulStrategy || this._getStrategies()[0];
    const cookiesPath = path.resolve(process.cwd(), "cookies.txt");

    if (isAudio) {
      const ytdlpArgs = [
        ...activeStrategy.args,
        "-f", "bestaudio/best",
        "-o", "-",
      ];
      if (fs.existsSync(cookiesPath) && !ytdlpArgs.includes("--cookies")) {
        ytdlpArgs.push("--cookies", cookiesPath);
      }
      ytdlpArgs.push(url);

      const ffmpegArgs = ["-i", "pipe:0", "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-f", "mp3", "pipe:1"];

      const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
      const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

      ytdlpProc.stdout.pipe(ffmpegProc.stdin);
      ffmpegProc.stdout.pipe(res);

      ytdlpProc.on("error", (e) => console.error("[YouTubeHandler] yt-dlp error:", e));
      ffmpegProc.on("error", (e) => console.error("[YouTubeHandler] ffmpeg error:", e));

      ffmpegProc.on("close", (code) => {
        console.log(`[YouTubeHandler] Audio stream finished with code ${code}`);
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

    // Video stream: zero-disk pipe with FFmpeg AAC remux
    const effectiveFormat = formatSelector || "bestvideo[vcodec^=avc]+bestaudio[ext=m4a]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best/bestvideo+bestaudio";

    const ytdlpArgs = [
      ...activeStrategy.args,
      "--ffmpeg-location", ffmpegPath,
      "-f", effectiveFormat,
      "-o", "-",
    ];
    if (fs.existsSync(cookiesPath) && !ytdlpArgs.includes("--cookies")) {
      ytdlpArgs.push("--cookies", cookiesPath);
    }
    ytdlpArgs.push(url);

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

    ytdlpProc.on("error", (e) => console.error("[YouTubeHandler] yt-dlp DASH error:", e));
    ffmpegProc.on("error", (e) => console.error("[YouTubeHandler] ffmpeg mux error:", e));

    ffmpegProc.on("close", (code) => {
      console.log(`[YouTubeHandler] Fragmented MP4 stream finished with code ${code}`);
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
