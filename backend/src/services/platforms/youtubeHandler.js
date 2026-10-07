import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import { formatDuration, sanitizeMediaUrl } from "./baseHandler.js";

/**
 * YouTube & YouTube Shorts Modular Handler (v3)
 * - Strategy ladder: Cookies -> bgutil plugin (official) -> manual PO-token -> TV -> iOS/MWeb
 * - Optional outbound proxy via YTDLP_PROXY (residential / WARP socks5)
 * - Verbose diagnostics: environment report, egress IP, per-strategy yt-dlp debug lines, timings
 */

const TAG = "[YouTubeHandler]";
const log = (...a) => console.log(TAG, ...a);
const warn = (...a) => console.warn(TAG, ...a);

// Shorten long tokens / visitor data so logs stay readable and secrets are not dumped
const redact = (s) =>
  String(s).replace(/[A-Za-z0-9_\-%=+\/]{40,}/g, (m) => `${m.slice(0, 8)}…(${m.length} chars)`);

const getProxy = () => (process.env.YTDLP_PROXY || "").trim() || null;
const getPotServer = () => process.env.POT_PROVIDER_URL || "http://pot-provider:4416";
const baseArgs = () => {
  const args = ["--force-ipv4"];
  const proxy = getProxy();
  if (proxy) args.push("--proxy", proxy);
  return args;
};

// ---------------------------------------------------------------------------
// One-time environment report (yt-dlp version, plugins, egress IP)
// ---------------------------------------------------------------------------
let envReportDone = false;

async function logEnvironmentReport(ytdlpPath) {
  if (envReportDone) return;
  envReportDone = true;

  log("================ ENVIRONMENT REPORT ================");
  log(`yt-dlp path: ${ytdlpPath}`);
  log(`POT provider URL: ${getPotServer()}`);
  log(`Proxy (YTDLP_PROXY): ${getProxy() ? redact(getProxy()) : "not set"}`);
  log(`Cookies file present: ${fs.existsSync(path.resolve(process.cwd(), "cookies.txt"))}`);

  try {
    const r = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(5000) });
    const { ip } = await r.json();
    log(`Outbound public IP (what YouTube sees without proxy): ${ip}`);
  } catch (e) {
    warn(`Could not determine outbound IP: ${e.message}`);
  }

  // `yt-dlp -v` with no URL prints the debug header (version, python, plugins, runtimes) then exits
  await new Promise((resolve) => {
    execFile(ytdlpPath, ["-v"], { timeout: 20000, maxBuffer: 5 * 1024 * 1024 }, (_err, _out, stderr) => {
      const keep = /version|python|plugin|exe versions|js runtime|runtime|proxy|pot|bgutil|ejs/i;
      (stderr || "")
        .split("\n")
        .filter((l) => l.startsWith("[debug]") && keep.test(l))
        .forEach((l) => log(`  ${redact(l.trim())}`));
      resolve();
    });
  });
  log("====================================================");
}

// ---------------------------------------------------------------------------
// Manual PO token fetch (used by the fallback "manual injection" strategy)
// ---------------------------------------------------------------------------
let cachedPoToken = null;
let tokenExpiresAt = 0;

async function getOrFetchPoToken() {
  const now = Date.now();
  if (cachedPoToken && now < tokenExpiresAt) {
    log(`Using cached PO token (expires in ${Math.round((tokenExpiresAt - now) / 1000)}s)`);
    return cachedPoToken;
  }

  const body = {};
  if (getProxy()) body.proxy = getProxy(); // token must be minted from the same IP yt-dlp uses

  for (const base of [getPotServer(), "http://127.0.0.1:4416"]) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${base}/get_pot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) {
        warn(`PO token request to ${base} returned HTTP ${res.status} (${Date.now() - t0}ms)`);
        continue;
      }
      const data = await res.json();
      if (!data?.poToken) {
        warn(`PO token response from ${base} had no poToken field`);
        continue;
      }
      cachedPoToken = { poToken: data.poToken, visitorData: data.contentBinding };
      tokenExpiresAt = data.expiresAt ? new Date(data.expiresAt).getTime() - 60000 : now + 3600000;
      log(`Acquired PO token from ${base} in ${Date.now() - t0}ms (token ${data.poToken.length} chars, visitorData ${data.contentBinding ? "yes" : "no"})`);
      return cachedPoToken;
    } catch (e) {
      warn(`PO token request to ${base} failed after ${Date.now() - t0}ms: ${e.message}`);
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

  async _getStrategies() {
    const cookiesPath = path.resolve(process.cwd(), "cookies.txt");

    if (process.env.YOUTUBE_COOKIES && process.env.YOUTUBE_COOKIES.trim().length > 10) {
      try {
        let cookieContent = process.env.YOUTUBE_COOKIES.trim();
        if (cookieContent.includes("\\n") && !cookieContent.includes("\n")) {
          cookieContent = cookieContent.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
        }
        fs.writeFileSync(cookiesPath, cookieContent, "utf8");
        log(`Wrote cookies.txt from YOUTUBE_COOKIES (${cookieContent.length} chars)`);
      } catch (e) {
        warn(`Could not write cookies.txt from YOUTUBE_COOKIES: ${e.message}`);
      }
    }

    const hasCookies = fs.existsSync(cookiesPath) && fs.statSync(cookiesPath).size > 10;
    const strategies = [];

    // 1. Authenticated cookies (only if the operator supplied burner cookies)
    if (hasCookies) {
      strategies.push({
        name: "Cookie Session + bgutil plugin",
        args: [
          ...baseArgs(),
          "--cookies", cookiesPath,
          "--extractor-args", `youtubepot-bgutilhttp:base_url=${getPotServer()}`,
          "--extractor-args", "youtube:player_client=web,mweb",
        ],
      });
      strategies.push({
        name: "Cookie Session (Web client)",
        args: [
          ...baseArgs(),
          "--cookies", cookiesPath,
        ],
      });
    }

    // 2. Official route: bgutil plugin requests tokens itself with the correct context
    strategies.push({
      name: "bgutil plugin (official PO-token provider)",
      args: [
        ...baseArgs(),
        "--extractor-args", `youtubepot-bgutilhttp:base_url=${getPotServer()}`,
        "--extractor-args", "youtube:player_client=mweb,web",
      ],
    });

    // 3. Manual injection with yt-dlp's documented format (mweb + visitor data, skip webpage)
    const pot = await getOrFetchPoToken();
    if (pot?.poToken && pot.visitorData) {
      strategies.push({
        name: "Manual PO-token injection (mweb + visitor_data)",
        args: [
          ...baseArgs(),
          "--extractor-args",
          `youtube:player_client=mweb;player_skip=webpage,configs;visitor_data=${pot.visitorData};po_token=mweb.gvs+${pot.poToken},mweb.player+${pot.poToken}`,
        ],
      });
    }

    // 4. TV client
    strategies.push({
      name: "TV client",
      args: [...baseArgs(), "--extractor-args", "youtube:player_client=tv"],
    });

    // 5. iOS / mobile web
    strategies.push({
      name: "iOS + MWeb clients",
      args: [...baseArgs(), "--extractor-args", "youtube:player_client=ios,mweb"],
    });

    return strategies;
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

      log(`▶ ${label} "${strategy.name}"`);
      log(`  cmd: yt-dlp ${redact(args.join(" "))}`);
      const t0 = Date.now();

      execFile(ytdlpPath, args, { maxBuffer: 1024 * 1024 * 50, timeout: 90000 }, (error, stdout, stderr) => {
        const ms = Date.now() - t0;
        const lines = (stderr || "").split("\n").map((l) => l.trim()).filter(Boolean);

        // Only the lines that explain what happened (clients used, PO token activity, warnings, errors)
        const interesting = /\[youtube\]|po.?token|\[pot|bgutil|player|client|proxy|sign in|bot|http error|403|429|warning|error|challenge|js runtime|ejs/i;
        const detail = lines.filter((l) => interesting.test(l) && !l.includes("Loaded ")).slice(-30);
        detail.forEach((l) => log(`  │ ${redact(l)}`));

        if (error) {
          const errLine = lines.find((l) => l.startsWith("ERROR:")) || lines[lines.length - 1] || error.message;
          warn(`✖ ${label} "${strategy.name}" failed in ${ms}ms (exit ${error.code ?? "?"}${error.killed ? ", killed by timeout" : ""})`);
          return reject(new Error(errLine || "yt-dlp inspection failed."));
        }

        log(`✔ ${label} "${strategy.name}" succeeded in ${ms}ms`);

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

          log(`  formats returned: ${formats.map((f) => f.resolution).join(", ")}`);

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
    const strategies = await this._getStrategies();
    log(`Inspecting ${cleanUrl} with ${strategies.length} strategies: ${strategies.map((s) => s.name).join(" → ")}`);

    const summary = [];
    let lastError = null;

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      const label = `[${i + 1}/${strategies.length}]`;
      const t0 = Date.now();
      try {
        const result = await this._runInspect(cleanUrl, ytdlpPath, strategy, label);
        this._lastSuccessfulStrategy = strategy;
        summary.push(`${label} ${strategy.name}: OK (${Date.now() - t0}ms)`);
        log(`SUMMARY:\n  ${summary.join("\n  ")}`);
        return result;
      } catch (err) {
        lastError = err;
        const msg = err.message || "";
        summary.push(`${label} ${strategy.name}: FAIL (${Date.now() - t0}ms) ${msg.slice(0, 120)}`);

        if (msg.includes("Private video") || msg.includes("Video unavailable") || msg.includes("This video is unavailable")) {
          log(`SUMMARY:\n  ${summary.join("\n  ")}`);
          throw err;
        }
      }
    }

    log(`SUMMARY:\n  ${summary.join("\n  ")}`);

    const botBlocked = summary.every((s) => /sign in|bot/i.test(s));
    if (botBlocked) {
      warn("All strategies hit YouTube's bot check. YouTube is flagging this server's outbound IP.");
      warn("Fix options: set YTDLP_PROXY (residential or WARP socks5), or provide YOUTUBE_COOKIES from a burner account.");
      throw new Error("YouTube is temporarily blocking this server (bot check). Please try again later.");
    }

    throw new Error(`Failed to inspect YouTube video after all strategies: ${lastError?.message || "unknown error"}`);
  },

  startStream({ url, formatSelector, mediaType, ffmpegPath, ytdlpPath, res }) {
    const isAudio = mediaType === "audio" && !(formatSelector && (formatSelector.includes("+") || formatSelector === "hd" || formatSelector === "sd"));
    const activeStrategy = this._lastSuccessfulStrategy || { name: "Default", args: baseArgs() };
    const cookiesPath = path.resolve(process.cwd(), "cookies.txt");

    const ytdlpArgs = [
      ...activeStrategy.args,
      "-f", isAudio ? "bestaudio/best" : (formatSelector || "bestvideo[vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo+bestaudio/best"),
      "-o", "-",
    ];
    if (fs.existsSync(cookiesPath) && !ytdlpArgs.includes("--cookies")) {
      ytdlpArgs.push("--cookies", cookiesPath);
    }
    ytdlpArgs.push(url);

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

    log(`▶ Stream (${isAudio ? "audio" : "video"}) using strategy "${activeStrategy.name}"`);
    log(`  cmd: yt-dlp ${redact(ytdlpArgs.join(" "))}`);

    const ytdlpProc = spawn(ytdlpPath, ytdlpArgs);
    const ffmpegProc = spawn(ffmpegPath, ffmpegArgs);

    ytdlpProc.stdout.pipe(ffmpegProc.stdin);
    ffmpegProc.stdout.pipe(res);

    // Surface yt-dlp problems during streaming (403s, bot checks, etc.)
    ytdlpProc.stderr.on("data", (chunk) => {
      chunk.toString().split("\n").forEach((l) => {
        if (/error|warning|403|429|sign in/i.test(l)) warn(`  stream yt-dlp: ${redact(l.trim())}`);
      });
    });

    ytdlpProc.on("error", (e) => console.error(`${TAG} stream yt-dlp spawn error:`, e));
    ffmpegProc.on("error", (e) => console.error(`${TAG} stream ffmpeg spawn error:`, e));
    ytdlpProc.on("close", (code) => log(`  stream yt-dlp exited with code ${code}`));

    ffmpegProc.on("close", (code) => {
      log(`  stream ffmpeg exited with code ${code}`);
      res.end();
    });

    return {
      cleanup() {
        try {
          ytdlpProc.kill("SIGKILL");
          ffmpegProc.kill("SIGKILL");
        } catch (e) {}
      },
    };
  },
};
