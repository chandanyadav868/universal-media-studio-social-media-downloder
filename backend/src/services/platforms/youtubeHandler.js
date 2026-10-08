import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * YouTube & YouTube Shorts Clean Authenticated Handler
 * Powered directly by cookies.txt with zero external proxy or sidecar container dependencies.
 */

const TAG = "[YouTubeHandler]";
const log = (...a) => console.log(TAG, ...a);
const warn = (...a) => console.warn(TAG, ...a);

const getCookiesPath = () => {
  // Check cwd and __dirname
  const candidates = [
    path.resolve(process.cwd(), "cookies.txt"),
    path.resolve(process.cwd(), "backend", "cookies.txt"),
    path.resolve("/app", "cookies.txt"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).size > 10) {
      return c;
    }
  }
  return candidates[0];
};

const baseArgs = (cookiesPath) => {
  const args = ["--force-ipv4"];
  if (cookiesPath && fs.existsSync(cookiesPath)) {
    args.push("--cookies", cookiesPath);
  }
  return args;
};

// One-time environment report
let envReportDone = false;
async function logEnvironmentReport(ytdlpPath) {
  if (envReportDone) return;
  envReportDone = true;

  const cookiesPath = getCookiesPath();
  const hasCookies = fs.existsSync(cookiesPath);

  log("================ ENVIRONMENT REPORT ================");
  log(`yt-dlp binary: ${ytdlpPath}`);
  log(`cookies.txt path: ${cookiesPath} (Present: ${hasCookies ? `YES, ${fs.statSync(cookiesPath).size} bytes` : "NO"})`);

  try {
    const r = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(4000) });
    const { ip } = await r.json();
    log(`Outbound egress IP: ${ip}`);
  } catch (e) {
    // ignore
  }

  await new Promise((resolve) => {
    execFile(ytdlpPath, ["--version"], { timeout: 10000 }, (_err, stdout) => {
      log(`yt-dlp version: ${(stdout || "").trim()}`);
      resolve();
    });
  });
  log("====================================================");
}

export const youtubeHandler = {
  name: "YouTube",
  engineName: "YouTube Studio DASH Remuxer (Authenticated Session + AAC)",
  processingMethod: "Zero-Disk DASH Muxing with Universal Stereo AAC",

  _lastSuccessfulStrategy: null,

  canHandle(url) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("youtube.com") || lower.includes("youtu.be");
  },

  _getStrategies() {
    const cookiesPath = getCookiesPath();
    const common = baseArgs(cookiesPath);

    return [
      {
        name: "Authenticated Session (Standard Web Client)",
        args: [...common],
      },
      {
        name: "Authenticated Session (Web + MWeb Client)",
        args: [...common, "--extractor-args", "youtube:player_client=web,mweb"],
      },
      {
        name: "Authenticated Session (TV Client)",
        args: [...common, "--extractor-args", "youtube:player_client=tv"],
      },
      {
        name: "Authenticated Session (iOS Client)",
        args: [...common, "--extractor-args", "youtube:player_client=ios,mweb"],
      },
    ];
  },

  _runInspect(cleanUrl, ytdlpPath, strategy, label) {
    return new Promise((resolve, reject) => {
      const args = [
        ...strategy.args,
        "-v",
        "--dump-single-json",
        "--no-playlist",
        "--skip-download",
        cleanUrl,
      ];

      log(`▶  ${label} "${strategy.name}"`);
      const t0 = Date.now();

      execFile(ytdlpPath, args, { maxBuffer: 1024 * 1024 * 50, timeout: 90000 }, (error, stdout, stderr) => {
        const ms = Date.now() - t0;
        const lines = (stderr || "").split("\n").map((l) => l.trim()).filter(Boolean);

        const interesting = /\[youtube\]|player|client|sign in|bot|http error|403|429|warning|error/i;
        const detail = lines.filter((l) => interesting.test(l) && !l.includes("Loaded ")).slice(-20);
        detail.forEach((l) => log(`  ↳ ${l}`));

        if (error) {
          const errLine = lines.find((l) => l.startsWith("ERROR:")) || lines[lines.length - 1] || error.message;
          warn(`✗  ${label} "${strategy.name}" failed in ${ms}ms: ${errLine}`);
          return reject(new Error(errLine || "yt-dlp inspection failed."));
        }

        log(`✓  ${label} "${strategy.name}" succeeded in ${ms}ms`);

        try {
          const info = JSON.parse(stdout);
          const rawFormats = info.formats || [];
          const formats = [];
          const duration = info.duration || 0;

          const videoFormats = rawFormats.filter(
            (f) => (f.vcodec && f.vcodec !== "none") || (f.height || f.resolution)
          );

          const formatsByResolution = new Map();
          for (const fmt of videoFormats) {
            const w = fmt.width || 0;
            const h = fmt.height || parseInt(fmt.resolution) || 0;
            const resHeight = Math.min(w, h) || h || 0;

            let targetHeight = 0;
            let label2 = "";
            if (resHeight >= 2160) { targetHeight = 2160; label2 = "2160p Video"; }
            else if (resHeight >= 1440) { targetHeight = 1440; label2 = "1440p Video"; }
            else if (resHeight >= 1080) { targetHeight = 1080; label2 = "1080p Video"; }
            else if (resHeight >= 720) { targetHeight = 720; label2 = "720p Video"; }
            else if (resHeight >= 480) { targetHeight = 480; label2 = "480p Video"; }
            else if (resHeight >= 360) { targetHeight = 360; label2 = "360p Video"; }
            else if (resHeight >= 240) { targetHeight = 240; label2 = "240p Video"; }

            if (targetHeight > 0) {
              const existing = formatsByResolution.get(targetHeight);
              const isH264 = (fmt.vcodec || "").toLowerCase().startsWith("avc1");
              const isExistingH264 = (existing?.vcodec || "").toLowerCase().startsWith("avc1");
              if (!existing || (isH264 && !isExistingH264) ||
                  (isH264 === isExistingH264 && (fmt.tbr || 0) > (existing.tbr || 0))) {
                formatsByResolution.set(targetHeight, { ...fmt, targetHeight, label: label2 });
              }
            }
          }

          const sortedHeights = Array.from(formatsByResolution.keys()).sort((a, b) => b - a);
          for (const height of sortedHeights) {
            const fmt = formatsByResolution.get(height);
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
              isHd: height >= 720,
              is4k: height >= 2160,
              note: `Full ${fmt.label} with Synchronized Universal Audio`,
              processingMethod: "Zero-Disk DASH Remux (Universal AAC)",
            });
          }

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

  async inspect(rawUrl, ytdlpPath) {
    await logEnvironmentReport(ytdlpPath);

    const cleanUrl = sanitizeMediaUrl(rawUrl);
    const strategies = this._getStrategies();
    log(`Inspecting ${cleanUrl} (${strategies.length} authenticated strategies)`);

    let lastError = null;
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      const label = `[${i + 1}/${strategies.length}]`;
      try {
        const result = await this._runInspect(cleanUrl, ytdlpPath, strategy, label);
        this._lastSuccessfulStrategy = strategy;
        return result;
      } catch (err) {
        lastError = err;
        const msg = err.message || "";
        if (msg.includes("Private video") || msg.includes("Video unavailable") || msg.includes("This video is unavailable")) {
          throw err;
        }
      }
    }

    throw new Error(`Failed to inspect YouTube video: ${lastError?.message || "unknown error"}`);
  },

  startStream({ url, formatSelector, mediaType, ffmpegPath, ytdlpPath, res }) {
    const isAudio = mediaType === "audio" && !(formatSelector && (formatSelector.includes("+") || formatSelector === "hd" || formatSelector === "sd"));
    const cookiesPath = getCookiesPath();
    const common = baseArgs(cookiesPath);

    const activeStrategy = this._lastSuccessfulStrategy || {
      name: "Default Authenticated",
      args: common,
    };

    const ytdlpArgs = [
      ...activeStrategy.args,
      "-f", isAudio ? "bestaudio/best" : (formatSelector || "bestvideo[vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo+bestaudio/best"),
      "-o", "-",
      url,
    ];

    const ffmpegArgs = isAudio
      ? ["-i", "pipe:0", "-vn", "-c:a", "libmp3lame", "-q:a", "2", "-f", "mp3", "pipe:1"]
      : [
          "-fflags", "+genpts",
          "-i", "pipe:0",
          "-c:v", "copy",
          "-c:a", "aac",
          "-b:a", "192k",
          "-ac", "2",
          "-movflags", "frag_keyframe+empty_moov+default_base_moof",
          "-f", "mp4",
          "pipe:1",
        ];

    log(`▶  Stream (${isAudio ? "audio" : "video"}) using strategy "${activeStrategy.name}"`);

    const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
    const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

    ytdlpProc.stdout.pipe(ffmpegProc.stdin);

    ffmpegProc.stdout.on("data", (chunk) => {
      try {
        if (!res.writableEnded) {
          res.write(chunk);
        }
      } catch (err) {
        log(`Write stream error: ${err.message}`);
      }
    });

    ffmpegProc.stdout.on("end", () => {
      try {
        if (!res.writableEnded) {
          res.end();
        }
      } catch (e) {}
      log("✓  Zero-disk stream completed successfully.");
    });

    let ytdlpStderr = "";
    ytdlpProc.stderr.on("data", (d) => {
      ytdlpStderr += d.toString();
    });

    let ffmpegStderr = "";
    ffmpegProc.stderr.on("data", (d) => {
      ffmpegStderr += d.toString();
    });

    const cleanup = () => {
      try { ytdlpProc.kill("SIGKILL"); } catch (e) {}
      try { ffmpegProc.kill("SIGKILL"); } catch (e) {}
    };

    ytdlpProc.on("error", (err) => {
      warn(`yt-dlp stream process error: ${err.message}`);
      cleanup();
    });

    ffmpegProc.on("error", (err) => {
      warn(`ffmpeg stream process error: ${err.message}`);
      cleanup();
    });

    ytdlpProc.on("close", (code) => {
      if (code !== 0 && code !== null) {
        warn(`yt-dlp stream exited with code ${code}`);
      }
    });

    ffmpegProc.on("close", (code) => {
      if (code !== 0 && code !== null) {
        warn(`ffmpeg stream exited with code ${code}`);
      }
    });

    res.on("close", () => {
      cleanup();
    });
  },
};
