"use client";
import { Download, Sparkles, Music, Film, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function FormatCard({ format, onDownloadClick }) {
  const isAudio = format.isAudioOnly || format.ext === "mp3";
  const is4k = format.is4k;
  const isHd = format.isHd;

  // Clean concise labels to prevent layout and button overflow
  let displayTitle = format.resolution;
  let buttonLabel = `Download ${format.resolution}`;

  if (isAudio) {
    displayTitle = "MP3 Audio (320kbps)";
    buttonLabel = "Download MP3 Audio";
  } else if (format.resolution.toLowerCase().includes("hd")) {
    displayTitle = "HD Video (720p/1080p)";
    buttonLabel = "Download HD Video";
  } else if (format.resolution.toLowerCase().includes("sd")) {
    displayTitle = "SD Video (360p/480p)";
    buttonLabel = "Download SD Video";
  } else if (format.resolution.endsWith("p")) {
    displayTitle = `${format.resolution} Video`;
    buttonLabel = `Download ${format.resolution} Video`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between border transition-colors shadow-lg backdrop-blur-md ${
        isAudio
          ? "bg-slate-900/70 border-pink-500/25 hover:border-pink-500/50 shadow-pink-950/20"
          : is4k
          ? "bg-slate-900/70 border-amber-500/30 hover:border-amber-500/60 shadow-amber-950/20"
          : isHd
          ? "bg-slate-900/70 border-blue-500/30 hover:border-blue-500/60 shadow-blue-950/20"
          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div>
        {/* Header row with badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {isAudio ? (
              <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-400 shrink-0">
                <Music size={16} />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
                <Film size={16} />
              </div>
            )}
            <span className="font-bold text-sm sm:text-base text-white truncate tracking-tight">
              {displayTitle}
            </span>
          </div>

          {isHd && (
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 shrink-0">
              Zero-Disk
            </span>
          )}
        </div>

        {/* Quality & Format Details */}
        <div className="flex items-center gap-1.5 flex-wrap my-2">
          {is4k && (
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
              4K UHD
            </span>
          )}
          {isHd && !is4k && (
            <span className="text-[11px] font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded-md border border-blue-500/30">
              HD
            </span>
          )}
          <span className="text-xs font-medium text-slate-400">
            {format.ext.toUpperCase()} • {format.filesizeApprox || (format.filesizeMB ? `${format.filesizeMB} MB` : "Direct Stream")}
          </span>
        </div>

        <p className="text-xs text-slate-400/90 leading-relaxed mb-3">
          {format.note || "Direct instant stream download with stereo audio"}
        </p>

        {format.processingMethod && (
          <div className="inline-flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg mb-3">
            <span>⚡ {format.processingMethod}</span>
          </div>
        )}
      </div>

      {/* Touch-Friendly High-Contrast Download CTA Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => onDownloadClick(format)}
        className={`w-full min-h-[46px] py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:opacity-90 cursor-pointer ${
          isAudio
            ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-900/30"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30"
        }`}
      >
        <Download size={16} className="shrink-0" />
        <span className="truncate">{buttonLabel}</span>
      </motion.button>
    </motion.div>
  );
}
