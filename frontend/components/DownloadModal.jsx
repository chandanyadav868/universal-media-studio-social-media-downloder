"use client";
import { useState, useEffect, useRef } from "react";
import AdsterraBanner from "./AdsterraBanner";
import { Download, Clock, X, CheckCircle, Zap, AlertCircle, Film, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DownloadModal({ isOpen, format, targetDownloadUrl, videoTitle, mediaData, onClose }) {
  // Phases: 'choice' | 'streaming' | 'completed' | 'error'
  const [phase, setPhase] = useState("choice");
  const [countdown, setCountdown] = useState(5);
  const [autoStartEnabled, setAutoStartEnabled] = useState(true);

  // Active download state
  const [currentDownloadType, setCurrentDownloadType] = useState("video"); // 'video' | 'audio'
  const [progressPercent, setProgressPercent] = useState(0);
  const [loadedMB, setLoadedMB] = useState(0);
  const [displayTotalMB, setDisplayTotalMB] = useState(0);
  const [speedMBs, setSpeedMBs] = useState("0.0");
  const [errorMessage, setErrorMessage] = useState("");
  const [fallbackBlobUrl, setFallbackBlobUrl] = useState("");

  const abortControllerRef = useRef(null);
  const downloadStartedRef = useRef(false);
  const timerRef = useRef(null);

  // Find corresponding audio-only format if available
  const audioFormat = mediaData?.formats?.find((f) => f.isAudioOnly || f.ext === "mp3") || {
    formatId: "bestaudio/best",
    resolution: "MP3 Audio",
    filesizeMB: "5.5",
    ext: "mp3"
  };

  // Find the primary video format to use if format is audio
  const videoFormat = (!format || format.isAudioOnly || format.ext === "mp3")
    ? (mediaData?.formats?.find((f) => !f.isAudioOnly && f.ext !== "mp3") || format)
    : format;

  // Reset modal state on open
  useEffect(() => {
    if (!isOpen) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    downloadStartedRef.current = false;

    const isAudioInit = format?.ext === "mp3" || format?.isAudioOnly;
    const targetFmt = isAudioInit ? audioFormat : (videoFormat || format);

    setPhase("choice");
    setCountdown(5);
    setAutoStartEnabled(true);
    setCurrentDownloadType(isAudioInit ? "audio" : "video");
    setProgressPercent(0);
    setLoadedMB(0);
    setSpeedMBs("0.0");
    setErrorMessage("");
    setFallbackBlobUrl("");

    const baseMB = parseFloat(targetFmt?.filesizeMB) || parseFloat(targetFmt?.filesizeApprox?.replace(/[^0-9.]/g, "")) || 45;
    setDisplayTotalMB(baseMB.toFixed(1));

    // 5-second countdown timer for auto-start
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          startDownload(targetFmt, isAudioInit ? "audio" : "video");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, format]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const startDownload = async (targetFmt, type) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (downloadStartedRef.current) return;
    downloadStartedRef.current = true;

    setAutoStartEnabled(false);
    setCurrentDownloadType(type);
    setPhase("streaming");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const startTime = Date.now();
    let receivedBytes = 0;
    const chunks = [];

    const isAudioTarget = type === "audio" || targetFmt?.ext === "mp3" || targetFmt?.isAudioOnly;
    const effectiveFmt = isAudioTarget ? audioFormat : (targetFmt || videoFormat || format);
    const expectedMB = isAudioTarget
      ? parseFloat(audioFormat.filesizeMB) || 5.5
      : parseFloat(effectiveFmt?.filesizeMB) || 50;

    let targetTotalBytes = expectedMB * 1024 * 1024;
    setDisplayTotalMB(expectedMB.toFixed(1));

    const params = new URLSearchParams({
      url: mediaData?.originalUrl || "",
      formatSelector: isAudioTarget ? "bestaudio/best" : (effectiveFmt?.formatId || "hd/bestvideo+bestaudio/best"),
      mediaType: isAudioTarget ? "audio" : "video",
      title: videoTitle || "video",
    });

    const streamUrl = `/api/media/stream?${params.toString()}`;

    try {
      const response = await fetch(streamUrl, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: Stream unavailable.`);
      }

      const headerLength = response.headers.get("content-length") || response.headers.get("x-estimated-content-length");
      if (headerLength) {
        const parsedHeader = parseInt(headerLength, 10);
        if (!isNaN(parsedHeader) && parsedHeader > 0) {
          targetTotalBytes = parsedHeader;
          setDisplayTotalMB((targetTotalBytes / (1024 * 1024)).toFixed(1));
        }
      }

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.byteLength;

        if (receivedBytes > targetTotalBytes) {
          targetTotalBytes = Math.round(receivedBytes * 1.08);
          setDisplayTotalMB((targetTotalBytes / (1024 * 1024)).toFixed(1));
        }

        const elapsedSeconds = Math.max(0.5, (Date.now() - startTime) / 1000);
        const currentSpeed = (receivedBytes / elapsedSeconds / (1024 * 1024)).toFixed(1);
        const currentPercent = Math.min(99, Math.round((receivedBytes / targetTotalBytes) * 100));

        setProgressPercent((prev) => Math.max(prev, currentPercent));
        setLoadedMB((receivedBytes / (1024 * 1024)).toFixed(1));
        setSpeedMBs(currentSpeed);
      }

      setProgressPercent(100);
      const finalMB = (receivedBytes / (1024 * 1024)).toFixed(1);
      setLoadedMB(finalMB);
      setDisplayTotalMB(finalMB);

      const ext = isAudioTarget ? "mp3" : "mp4";
      const mimeType = isAudioTarget ? "audio/mpeg" : "video/mp4";
      const blob = new Blob(chunks, { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      setFallbackBlobUrl(blobUrl);

      const cleanTitle = (videoTitle || "video")
        .replace(/[^\w\s-]/gi, "")
        .replace(/\s+/g, "_")
        .substring(0, 60);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = `${cleanTitle}.${ext}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Monetag Direct Link: Opens in background tab upon successful download
      try {
        window.open("https://uplcm.com/4/11972780", "_blank", "noopener,noreferrer");
      } catch (adErr) {
        console.warn("Direct link trigger:", adErr);
      }

      setPhase("completed");
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Stream download aborted by user.");
      } else {
        console.error("Stream reader error:", err);
        setErrorMessage(err.message || "Streaming interrupted. Please try direct download.");
        setPhase("error");
      }
    }
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-slate-900/95 border border-blue-500/30 rounded-3xl p-5 sm:p-7 text-center relative shadow-2xl shadow-black/80 max-h-[92vh] overflow-y-auto my-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* PHASE 1: Choice & Countdown */}
            {phase === "choice" && (
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1.5">
                  Choose Download Format
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-sm mx-auto">
                  Select your preferred stream format below, or wait for automatic download:
                </p>

                {/* Video & Audio Choice Cards */}
                <div className="flex flex-col gap-3 mb-5 text-left">
                  {/* Option 1: Video */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startDownload(videoFormat || format, "video")}
                    className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-blue-950/20 border border-blue-500/40 hover:border-blue-400/80 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Film size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base text-white truncate">
                          Video ({(videoFormat || format)?.resolution || "1080p"} MP4)
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          High-def video with stereo audio
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-blue-400">
                        ~{(videoFormat || format)?.filesizeMB || "45"} MB
                      </span>
                    </div>
                  </motion.button>

                  {/* Option 2: Audio Only */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startDownload(audioFormat, "audio")}
                    className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-900/30 to-pink-950/20 border border-pink-500/40 hover:border-pink-400/80 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Music size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base text-white truncate">
                          Audio Track (MP3 320kbps)
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          Crystal-clear audio track • High bitrate
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-pink-400">
                        ~{audioFormat.filesizeMB || "5.5"} MB
                      </span>
                    </div>
                  </motion.button>
                </div>

                {/* Auto-start Countdown Tag */}
                {autoStartEnabled && countdown > 0 && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60 mb-3">
                    <Clock size={13} className="text-blue-400" />
                    <span>Auto-starting download in <strong className="text-blue-400 font-bold">{countdown}s</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 2: Live In-Memory Streaming Progress */}
            {phase === "streaming" && (() => {
              const speedVal = parseFloat(speedMBs) || 0;
              const loadedVal = parseFloat(loadedMB) || 0;
              const totalVal = parseFloat(displayTotalMB) || 50;
              const remainingMB = Math.max(0, totalVal - loadedVal);
              const estimatedSecLeft = speedVal > 0 ? Math.ceil(remainingMB / speedVal) : null;

              return (
                <div className="py-2">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse ${
                    currentDownloadType === "audio" ? "bg-pink-500/20 text-pink-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    <Zap size={28} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                    Downloading {currentDownloadType === "audio" ? "Audio Track" : `${format?.resolution || "1080p"} Video`}
                  </h3>

                  {/* Live Status with Estimated Time */}
                  <div className="text-xs sm:text-sm text-slate-300 mb-4 min-h-[22px]">
                    {loadedVal === 0 ? (
                      <span className="text-blue-400 font-medium inline-flex items-center gap-1.5 animate-pulse">
                        <Clock size={13} />
                        <span>Allocating stream slot & remuxing DASH stream... (Please wait ~4–8s)</span>
                      </span>
                    ) : (
                      <span>
                        Zero-disk stream active •{" "}
                        <span className="font-semibold text-white">{speedMBs} MB/s</span>
                        {estimatedSecLeft !== null && (
                          <span className="text-blue-300 ml-1.5 font-mono">
                            (Est. ~{estimatedSecLeft}s remaining)
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Modern Track Progress Bar */}
                  <div className="h-4 bg-slate-950/80 rounded-full p-0.5 border border-slate-800 overflow-hidden mb-2 shadow-inner">
                    <motion.div
                      className={`h-full rounded-full transition-all duration-150 ${
                        currentDownloadType === "audio"
                          ? "bg-gradient-to-r from-pink-500 to-rose-400"
                          : "bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4 px-1">
                    <span>
                      <strong className="text-white">{loadedMB} MB</strong> / {displayTotalMB} MB
                    </span>
                    <span className={`font-bold ${currentDownloadType === "audio" ? "text-pink-400" : "text-blue-400"}`}>
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Informational Guidance Box */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] sm:text-xs text-slate-400 flex items-start gap-2 text-left mb-2">
                    <Clock size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      Direct in-memory zero-disk pipeline combines video and stereo audio on the fly. Please keep this window open until complete.
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* PHASE 3: Completed Screen */}
            {phase === "completed" && (
              <div className="py-2">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-emerald-500/20 text-emerald-400">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                  {currentDownloadType === "audio" ? "Audio" : "Video"} Download Complete!
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-5">
                  {loadedMB} MB saved successfully with high quality.
                </p>

                {fallbackBlobUrl && (
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={fallbackBlobUrl}
                    download={`${(videoTitle || "video").replace(/[^\w\s-]/gi, "")}.${currentDownloadType === "audio" ? "mp3" : "mp4"}`}
                    className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 mb-3"
                  >
                    <Download size={16} /> Click Here if Download Didn't Save
                  </motion.a>
                )}

                <button
                  type="button"
                  onClick={() => setPhase("choice")}
                  className="text-xs text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                >
                  ← Download another format
                </button>
              </div>
            )}

            {/* PHASE 4: Error State */}
            {phase === "error" && (
              <div className="py-2">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-rose-500/20 text-rose-400">
                  <AlertCircle size={30} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Streaming Interrupted
                </h3>
                <p className="text-xs sm:text-sm text-rose-400 mb-5">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setPhase("choice")}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* In-Modal Ad Slot */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <AdsterraBanner type="rectangle" showSmartlink={true} smartlinkLabel="🚀 Fast Cloud Acceleration (Partner Mirror)" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
