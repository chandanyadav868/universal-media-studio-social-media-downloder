"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Cpu, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Terminal,
  ExternalLink
} from "lucide-react";

export default function SystemStatusModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const runCheck = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = await res.json();
      setDiagnostics(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setErrorMsg(err.message || "Failed to reach health endpoint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBackendOnline = diagnostics?.backend === "online";
  const isPotOnline = diagnostics?.dockerPotProvider?.status === "online";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Activity size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Docker & Engine Diagnostics</h3>
                <p className="text-xs text-slate-400">Live health verification for Zero-Disk Studio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Status Overview Cards */}
          <div className="mt-5 space-y-3.5">
            {/* 1. Docker PO-Token Provider Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isPotOnline 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-amber-950/20 border-amber-500/30 text-amber-300"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isPotOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    <Cpu size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Docker PO-Token Container</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        pot-provider:4416
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {isPotOnline 
                        ? "🟢 Docker container is RUNNING and generating proof-of-origin tokens."
                        : "🟡 Docker container is STANDBY. Fallback mobile client emulation is active."}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isPotOnline ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                  {isPotOnline ? "Running" : "Standby"}
                </span>
              </div>
            </div>

            {/* 2. Streaming Backend API Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isBackendOnline 
                ? "bg-blue-950/20 border-blue-500/30 text-blue-300"
                : "bg-rose-950/20 border-rose-500/30 text-rose-300"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBackendOnline ? "bg-blue-500/20 text-blue-400" : "bg-rose-500/20 text-rose-400"
                  }`}>
                    <Server size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Backend Stream Service</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Port 5000
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {isBackendOnline 
                        ? `Connected at ${diagnostics?.connectedBackendUrl || "Internal network"}`
                        : "Backend unreachable. Ensure Coolify backend container is deployed."}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isBackendOnline ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                }`}>
                  {isBackendOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {/* 3. Failover & Protection Ladder */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-300">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <ShieldCheck size={14} className="text-blue-400" />
                <span>Anti-Bot Hybrid Fallback Ladder</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Tier 1</div>
                  <div className="font-bold text-white mt-0.5">Docker POT</div>
                  <div className={`text-[10px] mt-1 font-semibold ${isPotOnline ? "text-emerald-400" : "text-amber-400"}`}>
                    {isPotOnline ? "Active" : "Standby"}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Tier 2</div>
                  <div className="font-bold text-white mt-0.5">Mobile Android</div>
                  <div className="text-[10px] mt-1 font-semibold text-emerald-400">Ready</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Tier 3</div>
                  <div className="font-bold text-white mt-0.5">iOS & MWeb</div>
                  <div className="text-[10px] mt-1 font-semibold text-emerald-400">Ready</div>
                </div>
              </div>
            </div>

            {/* 4. Engine Binaries / yt-dlp */}
            {diagnostics?.system && (
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                <div>yt-dlp: <span className="text-slate-200 font-mono">{diagnostics.system.ytdlp || "Installed"}</span></div>
                <div>Node: <span className="text-slate-200 font-mono">{diagnostics.system.node || "v20"}</span></div>
                <div>Platform: <span className="text-slate-200 font-mono">{diagnostics.system.platform || "linux"}</span></div>
              </div>
            )}
          </div>

          {/* Action / Refresh Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {lastChecked ? `Checked at ${lastChecked}` : "Checking status..."}
            </div>
            <button
              onClick={runCheck}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>{loading ? "Testing..." : "Test Connection"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
