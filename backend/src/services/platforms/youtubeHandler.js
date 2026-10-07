import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * YouTube & YouTube Shorts Modular Handler
 * Features:
 * 1. Direct PO-Token Injection Engine: Communicates with Docker pot-provider container
 *    to generate proof-of-origin tokens and injects them natively into yt-dlp.
 * 2. Smart TV & Android Client Fallback: Seamless bot-challenge bypass without login.
 * 3. Support for burner Cookie Session Authentication via cookies.txt or YOUTUBE_COOKIES env.
 * 4. 100% Windows Media Player & Apple compatible standard AAC audio remuxing.
 */

// In-memory cache for Proof-of-Origin (PO) Token
let cachedPoToken = null;
let tokenExpiresAt = 0;

async function getOrFetchPoToken() {
  const now = Date.now();
  if (cachedPoToken && now < tokenExpiresAt) {
    return cachedPoToken;
  }

  const potServer = process.env.POT_PROVIDER_URL || "http://pot-provider:4416";
  const candidates = [potServer, "http://127.0.0.1:4416"];

  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/get_pot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(30000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.poToken) {
          cachedPoToken = {
            poToken: data.poToken,
            visitorData: data.contentBinding,
          };
          tokenExpiresAt = data.expiresAt ? new Date(data.expiresAt).getTime() - 60000 : now + 3600000;
          console.log(`[YouTubeHandler] Acquired fresh Proof-of-Origin Token from ${base}`);
          return cachedPoToken;
        }
      }
    } catch (e) {
      // Continue to next candidate
    }
  }

  return null;
}

export const youtubeHandler = {
  name: "YouTube",
  engineName: "YouTube Studio DASH Remuxer (Hybrid Failover + AAC)",
  processingMethod: "Zero-Disk DASH Muxing with Universal Stereo AAC",

  _lastSuccessfulStrategy: null,

  canHandle(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("youtube.com") || lower.includes("youtu.be");
  },

  /**
   * Generates hybrid failover strategies in prioritized order
   */
  async _getStrategies() {
    const cookiesPath = path.resolve(process.cwd(), "cookies.txt");

    // Automatically sync cookies from YOUTUBE_COOKIES env variable if provided
    if (process.env.YOUTUBE_COOKIES && process.env.YOUTUBE_COOKIES.trim().length > 10) {
      try {
        fs.writeFileSync(cookiesPath, process.env.YOUTUBE_COOKIES.trim(), "utf8");
      } catch (e) {}
    }

    const hasCookies = fs.existsSync(cookiesPath) && fs.statSync(cookiesPath).size > 10;
    const strategies = [];

    // 1. If cookies are provided, prioritize authenticated session
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

    // 2. Direct Docker Proof-of-Origin (PO) Token Injection (Bypasses bot challenge on datacenter VPS)
    const potData = await getOrFetchPoToken();
    if (potData && potData.poToken) {
      const extractorArg = potData.visitorData
        ? `youtube:po_token=web+${potData.poToken};visitor_data=${potData.visitorData}`
        : `youtube:po_token=web+${potData.poToken}`;
      strategies.push({
        name: "Docker PO-Token Native Injection",
        args: [
          "--force-ipv4",
          "--extractor-args", extractorArg,
        ],
      });
    }

    // 3. Smart TV Client Evasion
    strategies.push({
      name: "Smart TV Client Evasion",
      args: [
        "--force-ipv4",
        "--extractor-args", "youtube:player_client=tv",
      ],
    });

    // 4. Android Mobile Client Evasion
    strategies.push({
      name: "Android Mobile Client Evasion",
      args: [
        "--force-ipv4",
        "--extractor-args", "youtube:player_client=android",
      ],
    });

    // 5. iOS & Mobile Web Emulation
    strategies.push({
      name: "iOS & Mobile Web Emulation",
      args: [
        "--force-ipv4",
        "--extractor-args", "youtube:player_client=ios,mweb",
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
            const resHeight = Math.min(w, h) || h || 0;

            let targetHeight = 0;
            let label = "";

            if (resHeight >= 2160) {
              targetHeight = 2160;
              label = "2160p Video";
            } else if (resHeight >= 1440) {
              targetHeight = 1440;
              label = "1440p Video";
            } else if (resHeight >= 1080) {
              targetHeight = 1080;
              label = "1080p Video";
            } else if (resHeight >= 720) {
              targetHeight = 720;
              label = "720p Video";
            } else if (resHeight >= 480) {
              targetHeight = 480;
              label = "480p Video";
            } else if (resHeight >= 360) {
              targetHeight = 360;
              label = "360p Video";
            } else if (resHeight >= 240) {
              targetHeight = 240;
              label = "240p Video";
            }

            if (targetHeight > 0) {
              const existing = formatsByResolution.get(targetHeight);
              const isH264 = (fmt.vcodec || "").toLowerCase().startsWith("avc1");
              const isExistingH264 = (existing?.vcodec || "").toLowerCase().startsWith("avc1");

              if (!existing) {
                formatsByResolution.set(targetHeight, { ...fmt, targetHeight, label });
              } else if (isH264 && !isExistingH264) {
                formatsByResolution.set(targetHeight, { ...fmt, targetHeight, label });
              } else if (isH264 === isExistingH264 && (fmt.tbr || 0) > (existing.tbr || 0)) {
                formatsByResolution.set(targetHeight, { ...fmt, targetHeight, label });
              }
            }
          }

          // Sort descending by resolution height
          const sortedHeights = Array.from(formatsByResolution.keys()).sort((a, b) => b - a);

          for (const height of sortedHeights) {
            const fmt = formatsByResolution.get(height);
            const isHd = height >= 720;
            const is4k = height >= 2160;

            const videoFilesize = fmt.filesize || fmt.filesize_approx || 0;
            const audioFilesize = (128 * 1024 * duration) / 8;
            const totalBytes = videoFilesize > 0 ? videoFilesize + audioFilesize : 0;
            const filesizeMB = totalBytes > 0 ? (totalBytes / (1024 * 1024)).toFixed(1) : null;

            formats.push({
              formatId: `${fmt.format_id}+bestaudio[ext=m4a]/bestaudio/best`,
              resolution: fmt.label,
              ext: "mp4",
              hasAudio: true,
              filesizeMB,
              filesizeApprox: filesizeMB ? `~${filesizeMB} MB` : null,
              vcodec: fmt.vcodec || "avc1",
              isHd,
              is4k,
              note: `Full ${fmt.label} with Synchronized Universal Audio`,
              processingMethod: "Zero-Disk DASH Remux (Universal AAC)",
            });
          }

          // Guaranteed Universal High-Bitrate MP3 Audio format
          const audioBytes = (320 * 1024 * duration) / 8;
          const audioMB = audioBytes > 0 ? (audioBytes / (1024 * 1024)).toFixed(1) : null;
          formats.push({
            formatId: "bestaudio/best",
            resolution: "MP3 Audio (320kbps)",
            ext: "mp3",
            hasAudio: true,
            filesizeMB: audioMB,
            filesizeApprox: audioMB ? `~${audioMB} MB` : null,
            vcodec: "none",
            isHd: false,
            is4k: false,
            isAudioOnly: true,
            note: "High-Bitrate 320kbps Audio Track",
            processingMethod: "Direct LAME MP3 Extraction",
          });

          resolve({
            title: info.title || "YouTube Media",
            thumbnail: info.thumbnail || "",
            duration,
            durationFormatted: formatDuration(duration),
            uploader: info.uploader || info.channel || "YouTube Creator",
            viewCount: info.view_count || null,
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
    const strategies = await this._getStrategies();

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
    const activeStrategy = this._lastSuccessfulStrategy || { name: "Default", args: ["--force-ipv4"] };
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

    const effectiveFormat = formatSelector || "bestvideo[vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo+bestaudio/best";
    const ytdlpArgs = [
      ...activeStrategy.args,
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
      "-ac", "2",
      "-movflags", "frag_keyframe+empty_moov+default_base_moof",
      "-f", "mp4",
      "pipe:1"
    ];

    const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
    const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

    ytdlpProc.stdout.pipe(ffmpegProc.stdin);
    ffmpegProc.stdout.pipe(res);

    ytdlpProc.on("error", (e) => console.error("[YouTubeHandler] Video streaming yt-dlp error:", e));
    ffmpegProc.on("error", (e) => console.error("[YouTubeHandler] Video streaming ffmpeg error:", e));

    ffmpegProc.on("close", (code) => {
      console.log(`[YouTubeHandler] Video streaming process finished with code ${code}`);
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
