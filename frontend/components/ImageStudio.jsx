"use client";
import { useState, useEffect } from "react";
import AdBanner from "./AdBanner";
import PlatformFeatureHeader from "./PlatformFeatureHeader";
import { getFeatureConfig, FEATURE_MAP } from "../lib/featureMap";
import { 
  Search, Clipboard, X, Loader2, Sparkles, Image as ImageIcon, 
  Download, ExternalLink, ShieldCheck, Zap, Layers 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ImageStudio({ activeFeature: propFeature, onSelectHash: propOnSelectHash }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageData, setImageData] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [localFeature, setLocalFeature] = useState(propFeature || FEATURE_MAP.youtubethumbnaildownloader);

  useEffect(() => {
    if (propFeature) {
      setLocalFeature(propFeature);
      return;
    }
    const syncHash = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const cfg = getFeatureConfig(hash);
      setLocalFeature(cfg);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [propFeature]);

  const handleHashChange = (newHash) => {
    if (propOnSelectHash) {
      propOnSelectHash(newHash);
    } else if (typeof window !== "undefined") {
      if (newHash) {
        window.location.hash = newHash;
      } else {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        setLocalFeature(FEATURE_MAP.youtubethumbnaildownloader);
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
      setError("Please paste a valid image, post, or thumbnail URL first!");
      return;
    }

    setLoading(true);
    setError("");
    setImageData(null);

    try {
      const res = await fetch("/api/image/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to extract image assets.");
      }

      setImageData(json.data);
    } catch (err) {
      setError(err.message || "Failed to inspect image URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = (img) => {
    setDownloadingId(img.id);
    const proxyUrl = `/api/image/download?url=${encodeURIComponent(img.url)}&filename=${encodeURIComponent(img.filename || "image.jpg")}`;
    
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = img.filename || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  const handleDownloadAll = () => {
    if (!imageData?.images) return;
    imageData.images.forEach((img, idx) => {
      setTimeout(() => {
        handleDownloadImage(img);
      }, idx * 600);
    });
  };

  const getImagePreviewSrc = (rawImgUrl) => {
    if (!rawImgUrl) return "";
    if (rawImgUrl.includes("lookaside.fbsbx.com") || rawImgUrl.includes("facebook.com")) {
      return `/api/image/download?url=${encodeURIComponent(rawImgUrl)}&view=1`;
    }
    return rawImgUrl;
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-5xl mx-auto">
      {/* Top Banner Ad */}
      <AdBanner slot="1111222233" format="horizontal" />

      {/* Input Form Glass Panel */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl">
        {/* Dynamic Platform Feature Header */}
        <PlatformFeatureHeader
          activeFeature={localFeature}
          onSelectHash={handleHashChange}
        />

        <form onSubmit={handleFetch} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-inner transition-all focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/20">
            {/* Input Row with search icon & controls */}
            <div className="flex items-center flex-1 min-w-0 px-2 py-1">
              <Search size={20} className="text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={localFeature?.placeholder || "Paste YouTube post, YouTube thumbnail, Instagram, Facebook, or X URL..."}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder:text-slate-500"
              />

              {url && (
                <button
                  type="button"
                  onClick={() => setUrl("")}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                  title="Clear input"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold ml-1.5 shrink-0 border border-slate-700/80 transition-colors cursor-pointer"
              >
                <Clipboard size={14} /> <span className="hidden xs:inline">Paste</span>
              </button>
            </div>

            {/* Mobile Full-Width CTA Submit Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={18} />
                  <span>Extract Images</span>
                </>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium mt-1"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-5 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>YouTube Community Posts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={15} className="text-purple-400" />
            <span>1080p MaxRes Thumbnails</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={15} className="text-blue-400" />
            <span>Instagram, Facebook & X Photos</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {imageData && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5 sm:gap-6"
          >
            {/* Post Header Card */}
            <div className="rounded-2xl p-4 sm:p-6 bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-block bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 border border-purple-500/30">
                  {imageData.platform} • {imageData.type === "community_post" ? "Community Post" : imageData.type === "thumbnail" ? "Video Thumbnail" : "Image Post"}
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 leading-snug">
                  {imageData.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  By <strong className="text-slate-200">{imageData.author}</strong> • {imageData.count} {imageData.count === 1 ? "Image" : "Images"} Extracted
                </p>
              </div>

              {imageData.images && imageData.images.length > 1 && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDownloadAll}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 shrink-0 cursor-pointer"
                >
                  <Layers size={17} /> Download All Images ({imageData.count})
                </motion.button>
              )}
            </div>

            {/* In-Feed Ad Banner */}
            <AdBanner slot="3333444455" format="horizontal" />

            {/* Extracted Images Grid */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                Extracted High-Resolution Photos
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageData.images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-2xl p-3.5 bg-slate-900/70 border flex flex-col justify-between shadow-lg backdrop-blur-md ${
                      img.isBest ? "border-purple-500/40 shadow-purple-950/20" : "border-slate-800"
                    }`}
                  >
                    {/* Image Preview Box */}
                    <div className="relative rounded-xl overflow-hidden bg-slate-950/80 mb-3 aspect-video flex items-center justify-center">
                      <img
                        src={getImagePreviewSrc(img.url)}
                        alt={img.title || "Extracted image"}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const fallback = `/api/image/download?url=${encodeURIComponent(img.url)}&view=1`;
                          if (e.currentTarget.src !== fallback && !e.currentTarget.src.includes("&view=1")) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Best Quality Tag */}
                      {img.isBest && (
                        <span className="absolute top-2 left-2 bg-purple-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm border border-purple-400/30">
                          ⭐ Best Quality
                        </span>
                      )}

                      {/* Dimensions Pill */}
                      {img.width && img.height && (
                        <span className="absolute bottom-2 right-2 bg-slate-950/85 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-800">
                          {img.width} × {img.height}
                        </span>
                      )}
                    </div>

                    {/* Image Title & Quality */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {img.title}
                      </h4>
                      <span className="text-xs text-purple-300 font-semibold shrink-0">
                        {img.qualityLabel}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleDownloadImage(img)}
                        disabled={downloadingId === img.id}
                        className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                          img.isBest
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/40"
                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40"
                        }`}
                      >
                        {downloadingId === img.id ? (
                          <>
                            <Loader2 size={15} className="animate-spin" /> Saving...
                          </>
                        ) : (
                          <>
                            <Download size={15} /> Download High-Res
                          </>
                        )}
                      </motion.button>

                      <a
                        href={getImagePreviewSrc(img.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open full size in new tab"
                        className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shrink-0 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Ad Banner */}
      <AdBanner slot="5555666677" format="horizontal" />
    </div>
  );
}
