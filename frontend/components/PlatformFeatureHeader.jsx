"use client";
import React from "react";
import { motion } from "motion/react";
import { Sparkles, Film, CheckCircle2, Zap, Shield, Music, Layers } from "lucide-react";
import { SUPPORTED_PLATFORMS, SUB_FEATURES_BY_PLATFORM } from "../lib/featureMap";

export default function PlatformFeatureHeader({ activeFeature, onSelectHash }) {
  const currentPlatformId = activeFeature?.platform || "all";
  const subFeatures = SUB_FEATURES_BY_PLATFORM[currentPlatformId] || SUB_FEATURES_BY_PLATFORM.all;

  const handlePlatformClick = (plat) => {
    onSelectHash(plat.defaultHash);
  };

  const handleSubFeatureClick = (sub) => {
    onSelectHash(sub.hash);
  };

  return (
    <div className="text-center w-full max-w-4xl mx-auto mb-8 sm:mb-10 pt-2">
      {/* 1. Dynamic Hero Pill Badge */}
      <motion.div
        key={activeFeature?.badge}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 sm:mb-6 shadow-lg backdrop-blur-md transition-all border"
        style={{
          background: activeFeature?.platform === "youtube" ? "rgba(239, 68, 68, 0.12)" :
                      activeFeature?.platform === "instagram" ? "rgba(236, 72, 153, 0.12)" :
                      activeFeature?.platform === "facebook" ? "rgba(59, 130, 246, 0.12)" :
                      activeFeature?.platform === "tiktok" ? "rgba(6, 182, 212, 0.12)" :
                      activeFeature?.platform === "twitter" ? "rgba(56, 189, 248, 0.12)" :
                      "rgba(59, 130, 246, 0.12)",
          borderColor: activeFeature?.platform === "youtube" ? "rgba(239, 68, 68, 0.35)" :
                       activeFeature?.platform === "instagram" ? "rgba(236, 72, 153, 0.35)" :
                       activeFeature?.platform === "facebook" ? "rgba(59, 130, 246, 0.35)" :
                       activeFeature?.platform === "tiktok" ? "rgba(6, 182, 212, 0.35)" :
                       activeFeature?.platform === "twitter" ? "rgba(56, 189, 248, 0.35)" :
                       "rgba(59, 130, 246, 0.35)",
          color: activeFeature?.platform === "youtube" ? "#fca5a5" :
                 activeFeature?.platform === "instagram" ? "#f9a8d4" :
                 activeFeature?.platform === "facebook" ? "#93c5fd" :
                 activeFeature?.platform === "tiktok" ? "#67e8f9" :
                 activeFeature?.platform === "twitter" ? "#7dd3fc" :
                 "#93c5fd",
        }}
      >
        <Sparkles size={14} className="animate-spin text-blue-400" style={{ animationDuration: "4s" }} />
        <span>{activeFeature?.badge || "Universal High-Speed Media Downloader"}</span>
      </motion.div>

      {/* 2. Bold Hero H1 Title with Gradient Highlights */}
      <motion.h1
        key={activeFeature?.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none mb-4 sm:mb-6"
      >
        {activeFeature?.title ? (
          <span>{activeFeature.title}</span>
        ) : (
          <>
            Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">HD Video</span> Downloader
          </>
        )}
      </motion.h1>

      {/* 3. Subtitle Description */}
      <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
        {activeFeature?.subtitle || "Download crystal-clear 1080p, 4K videos and 320kbps MP3 audio from YouTube, Reels, Facebook, and TikTok with high-speed in-memory streaming."}
      </p>

      {/* 4. Interactive Platform Selector Tabs */}
      <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 py-2 px-1 mb-5 touch-pan-x">
        {SUPPORTED_PLATFORMS.map((plat) => {
          const isSelected = (currentPlatformId === plat.id) || (plat.id === "all" && currentPlatformId === "all");
          return (
            <motion.button
              key={plat.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handlePlatformClick(plat)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-slate-800 text-white shadow-lg border"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
              }`}
              style={{
                borderColor: isSelected ? plat.color : undefined,
                boxShadow: isSelected ? `0 0 20px ${plat.color}33` : undefined,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                style={{ background: plat.color }}
              />
              <span>{plat.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 5. Sub-Feature Toggles (e.g. Video vs Thumbnail vs Posts) */}
      {subFeatures && subFeatures.length > 1 && (
        <div className="inline-flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-1.5 mb-6 max-w-full overflow-x-auto no-scrollbar shadow-inner">
          {subFeatures.map((sub, idx) => {
            const isSubActive = (activeFeature?.hash === sub.hash) || (!activeFeature?.hash && !sub.hash);
            return (
              <motion.button
                key={idx}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubFeatureClick(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSubActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {sub.label}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* 6. Discreet Live Engine Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 pt-1">
        <div className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zero-Disk Stream Engine</span>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
          <Film size={13} className="text-blue-400" />
          <span>Full 1080p & 4K UHD</span>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
          <Music size={13} className="text-pink-400" />
          <span>320kbps MP3 Audio</span>
        </div>
      </div>
    </div>
  );
}
