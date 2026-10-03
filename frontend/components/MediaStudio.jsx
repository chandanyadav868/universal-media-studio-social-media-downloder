"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import FormatCard from "./FormatCard";
import DownloadModal from "./DownloadModal";
import AdBanner from "./AdBanner";
import PlatformFeatureHeader from "./PlatformFeatureHeader";
import ImageStudio from "./ImageStudio";
import { getFeatureConfig, FEATURE_MAP } from "../lib/featureMap";
import { safeFetchJson, buildStreamUrl } from "../lib/api";
import { Search, Clipboard, X, Loader2, Sparkles, ShieldCheck, Zap, Film, CheckCircle2 } from "lucide-react";

export default function MediaStudio() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaData, setMediaData] = useState(null);
  const [activeFeature, setActiveFeature] = useState(FEATURE_MAP.default);

  // Download Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [downloadStreamUrl, setDownloadStreamUrl] = useState("");

  // Sync state with URL #hash
  useEffect(() => {
    const handleHashSync = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const cfg = getFeatureConfig(hash);
      setActiveFeature(cfg);
    };

    handleHashSync();
    window.addEventListener("hashchange", handleHashSync);
    return () => window.removeEventListener("hashchange", handleHashSync);
  }, []);

  const handleHashSelect = (targetHash) => {
    if (typeof window !== "undefined") {
      if (targetHash) {
        window.location.hash = targetHash;
      } else {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        setActiveFeature(FEATURE_MAP.default);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError("");
      }
    } catch (err) {
      console.log("Clipboard read blocked");
    }
  };

  const handleFetch = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setError("Please paste a valid video URL first!");
      return;
    }

    setLoading(true);
    setError("");
    setMediaData(null);

    try {
      const json = await safeFetchJson("/api/media/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!json.success) {
        throw new Error(json.error || "Failed to inspect video details.");
      }

      setMediaData(json.data);
    } catch (err) {
      setError(err.message || "Network error. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = (format) => {
    setSelectedFormat(format);
    const streamUrl = buildStreamUrl({
      url: mediaData.originalUrl,
      formatSelector: format.formatId,
      mediaType: format.ext === "mp3" ? "audio" : "video",
      title: mediaData.title || "video",
    });
    setDownloadStreamUrl(streamUrl);
    setModalOpen(true);
  };

  // If the active hash is configured for Image/Thumbnail extraction, render ImageStudio seamlessly!
  if (activeFeature && activeFeature.mode === "image") {
    return (
      <ImageStudio
        activeFeature={activeFeature}
        onSelectHash={handleHashSelect}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
      {/* Dynamic Platform & Feature Header with Reactive Hash Switcher */}
      <PlatformFeatureHeader
        activeFeature={activeFeature}
        onSelectHash={handleHashSelect}
      />

      {/* Hero Glass Box Wrapper */}
      <div className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
        
        <div className="relative w-full rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl p-4 sm:p-8 shadow-2xl">
          <form onSubmit={handleFetch} className="flex flex-col gap-4">
            {/* Main Search Input & CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-950/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-inner transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <div className="flex items-center flex-1 min-w-0 px-2 py-1">
                <Search size={22} className="text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={activeFeature?.placeholder || "Paste YouTube, Instagram Reels, Facebook, or TikTok URL..."}
                  className="bg-transparent border-none outline-none text-white text-sm sm:text-base md:text-lg w-full placeholder:text-slate-500"
                />

                {url && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setUrl("")}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer mr-2 shrink-0"
                    title="Clear input"
                  >
                    <X size={16} />
                  </motion.button>
                )}

                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold shrink-0 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Clipboard size={14} /> <span>Paste</span>
                </button>
              </div>

              {/* High-CTR Fetch CTA Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-12 sm:h-14 px-7 sm:px-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shrink-0 shadow-xl shadow-blue-950/50 cursor-pointer disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Inspecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Fetch Video</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Trust Value Propositions */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-5 mt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>100% Free & No Sign-up</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-blue-400" />
              <span>In-Memory Zero-Disk Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <Film size={15} className="text-purple-400" />
              <span>Full 1080p 60fps & 4K UHD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Results Display */}
      <AnimatePresence>
        {mediaData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-6 sm:gap-8 mt-8 sm:mt-10"
          >
            {/* Metadata Overview Card */}
            <div className="rounded-3xl p-5 sm:p-7 bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-2xl backdrop-blur-xl">
              {mediaData.thumbnail && (
                <div className="relative w-full sm:w-60 aspect-video rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 shadow-md">
                  <img
                    src={mediaData.thumbnail}
                    alt={mediaData.title || "Video preview"}
                    className="w-full h-full object-cover"
                  />
                  {mediaData.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
                      {Math.floor(mediaData.duration / 60)}:
                      {(mediaData.duration % 60).toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
                  {mediaData.platform || "Video"}
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white mb-2 leading-snug">
                  {mediaData.title}
                </h2>
                {mediaData.uploader && (
                  <p className="text-xs sm:text-sm text-slate-400">
                    Creator: <strong className="text-slate-200">{mediaData.uploader}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* In-Feed Ad Banner */}
            <AdBanner slot="3333444455" format="horizontal" />

            {/* Available Quality Formats Grid */}
            <div className="w-full">
              <h3 className="text-base sm:text-xl font-extrabold text-white mb-4 flex items-center gap-2">
                <Film size={20} className="text-blue-400" />
                <span>Available Download Formats</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {mediaData.formats.map((fmt, idx) => (
                  <FormatCard
                    key={idx}
                    format={fmt}
                    onDownloadClick={handleDownloadClick}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5-Second Countdown Gate Modal with Video/Audio Choice & Live Progress Bar */}
      <DownloadModal
        isOpen={modalOpen}
        format={selectedFormat}
        targetDownloadUrl={downloadStreamUrl}
        videoTitle={mediaData?.title}
        mediaData={mediaData}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
