"use client";
import React from "react";
import { Sparkles, Scissors, Clapperboard, Layers, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function OwnProductPromo({
  className = "",
  targetUrl = process.env.NEXT_PUBLIC_AI_APP_URL || "https://ai.humantalking.com",
}) {
  return (
    <aside
      aria-label="Featured AI Creative Studio"
      className={`w-full my-8 relative group rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#091528]/95 via-slate-900/95 to-[#0e1e38]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-purple-600/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Product Info & Value Proposition */}
        <div className="flex-1">
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/40 bg-cyan-950/60 text-cyan-300 text-xs font-semibold mb-3.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <Sparkles size={13} className="text-cyan-400" />
            <span>Featured Product • Free AI Creative Studio</span>
          </div>

          {/* Product Headline */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug mb-2.5">
            AI Visual Studio &amp; Neural Background Remover
          </h3>

          {/* Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mb-4">
            Isolate objects with text prompts, remove backgrounds with zero compression, animate GIFs, and design on a multi-layer canvas — all running <strong className="text-cyan-300 font-semibold">100% privately in your browser with zero cloud uploads</strong>.
          </p>

          {/* Feature Micro-Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <Scissors size={13} className="text-cyan-400" /> Neural Cutouts
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <Layers size={13} className="text-purple-400" /> Multi-Layer Canvas
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <Clapperboard size={13} className="text-indigo-400" /> GIF Studio
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <ShieldCheck size={13} className="text-emerald-400" /> 100% Client-Side Privacy
            </span>
          </div>
        </div>

        {/* Right Column: High-Intent Call To Action */}
        <div className="shrink-0 w-full sm:w-auto">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/40 hover:shadow-cyan-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group/btn"
          >
            <span>Open AI Studio</span>
            <ArrowRight size={16} className="text-white group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </aside>
  );
}
