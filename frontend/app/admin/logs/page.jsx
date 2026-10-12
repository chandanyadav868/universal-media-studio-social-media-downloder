"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, AlertTriangle, CheckCircle2, Shield, RefreshCw, Trash2, 
  Download, Search, Radio, Clock, ExternalLink, Copy, Check, Terminal, Server
} from "lucide-react";

export default function AdminLogsDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  const eventSourceRef = useRef(null);

  // Load saved key on mount
  useEffect(() => {
    const saved = localStorage.getItem("ums_admin_key") || "ums_admin_2026";
    if (saved) {
      setAdminKey(saved);
      checkAuth(saved);
    }
  }, []);

  const checkAuth = async (key) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/monitoring/stats?key=${encodeURIComponent(key)}`, {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsAuthenticated(true);
        localStorage.setItem("ums_admin_key", key);
        fetchLogs(key);
      } else {
        setIsAuthenticated(false);
        setErrorMsg("Invalid Admin Key. Please enter the correct secret.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to monitoring service: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (key = adminKey) => {
    try {
      const res = await fetch(`/api/monitoring/logs?limit=250&key=${encodeURIComponent(key)}`, {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    }
  };

  const fetchStats = async (key = adminKey) => {
    try {
      const res = await fetch(`/api/monitoring/stats?key=${encodeURIComponent(key)}`, {
        headers: { "x-admin-key": key },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {}
  };

  // Real-time SSE Live Stream
  useEffect(() => {
    if (!isAuthenticated || !isLiveStreaming) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const sseUrl = `/api/monitoring/stream?key=${encodeURIComponent(adminKey)}`;
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        if (newLog.id) {
          setLogs((prev) => [newLog, ...prev.slice(0, 249)]);
          fetchStats(adminKey);
        }
      } catch (e) {}
    };

    es.onerror = () => {
      console.warn("SSE connection interrupted, retrying...");
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [isAuthenticated, isLiveStreaming, adminKey]);

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to clear all memory and disk logs?")) return;
    try {
      await fetch(`/api/monitoring/logs?key=${encodeURIComponent(adminKey)}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      setLogs([]);
      fetchStats();
    } catch (e) {
      alert("Failed to clear logs: " + e.message);
    }
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `universal_media_logs_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterLevel !== "ALL" && log.level !== filterLevel) return false;
    if (filterType !== "ALL" && log.type !== filterType.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (log.url && log.url.toLowerCase().includes(q)) ||
        (log.title && log.title.toLowerCase().includes(q)) ||
        (log.errorMessage && log.errorMessage.toLowerCase().includes(q)) ||
        (log.platform && log.platform.toLowerCase().includes(q)) ||
        (log.clientIp && log.clientIp.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
            <Shield size={26} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Developer Live Console
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter your secret admin key to view real-time production activities, stream health, and error logs.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); checkAuth(adminKey); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Access Live Monitoring"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Terminal className="text-blue-400" size={28} />
              <span>Real-Time Production Telemetry &amp; Error Console</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Self-hosted, persistent activity tracking with zero database dependencies.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsLiveStreaming((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isLiveStreaming
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            <Radio size={14} className={isLiveStreaming ? "animate-pulse text-emerald-400" : ""} />
            <span>{isLiveStreaming ? "Live SSE: Active" : "Live SSE: Paused"}</span>
          </button>

          <button
            onClick={() => { fetchLogs(); fetchStats(); }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw size={15} />
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Download logs (.json)"
          >
            <Download size={15} />
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 cursor-pointer"
            title="Clear all logs"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Real-Time Metrics Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Activity
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {stats.totalRequests || 0}
            </div>
            <span className="text-[10px] text-slate-500">Tracked events</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Errors
            </span>
            <div className={`text-2xl font-black font-mono ${(stats.totalErrors || 0) > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {stats.totalErrors || 0}
            </div>
            <span className="text-[10px] text-slate-500">Error rate: {stats.errorRate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Video Streams
            </span>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {stats.totalStreams || 0}
            </div>
            <span className="text-[10px] text-slate-500">Stream sessions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Inspections
            </span>
            <div className="text-2xl font-black text-purple-400 font-mono">
              {stats.totalInspections || 0}
            </div>
            <span className="text-[10px] text-slate-500">Link inspections</span>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Persistent Disk Log
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {stats.diskLogSizeKB} KB
            </div>
            <span className="text-[10px] text-slate-500">/app/logs/errors.jsonl</span>
          </div>
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
        {/* Level Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {["ALL", "ERROR", "WARN", "INFO"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterLevel === lvl
                  ? lvl === "ERROR"
                    ? "bg-rose-500 text-white"
                    : lvl === "WARN"
                    ? "bg-amber-500 text-black"
                    : "bg-blue-600 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Type Filters */}
          {["ALL", "STREAM", "INSPECT", "CLIENT"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === t
                  ? "bg-slate-700 text-white"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by URL, error, or IP..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden shadow-xl">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No events match your selected filters. Trigger actions or downloads on the site to see live logs!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredLogs.map((log) => {
              const isErr = log.level === "ERROR";
              const isWarn = log.level === "WARN";

              return (
                <div
                  key={log.id}
                  className={`p-3.5 sm:p-4 transition-colors hover:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isErr ? "bg-rose-950/15" : ""
                  }`}
                >
                  {/* Left: Badges & Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider shrink-0 mt-0.5 ${
                        isErr
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : isWarn
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {log.status || 200} {log.level}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                          {log.platform} • {log.type}
                        </span>
                        {log.format && (
                          <span className="text-[10px] text-blue-400 font-mono">
                            [{log.format}]
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono ml-auto">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* URL / Title */}
                      <div className="text-xs text-white font-mono truncate max-w-2xl mb-1">
                        {log.title ? <span className="font-bold text-slate-200">{log.title} </span> : null}
                        {log.url && <span className="text-slate-400">({log.url})</span>}
                      </div>

                      {/* Error Message if present */}
                      {log.errorMessage && (
                        <div className="text-xs text-rose-400 font-mono bg-rose-950/30 p-2 rounded-lg border border-rose-900/40 mt-1.5 flex items-start justify-between gap-2">
                          <span className="break-all">{log.errorMessage}</span>
                          {log.stack && (
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="text-[10px] text-rose-300 underline font-bold shrink-0 cursor-pointer"
                            >
                              View Stack
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Copy & Inspect */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {log.url && (
                      <button
                        onClick={() => copyToClipboard(log.url, log.id)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedId === log.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stack Trace Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-mono">ERROR</span>
                  <span>{selectedLog.errorMessage || "Error Diagnostics"}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{selectedLog.timestamp}</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs text-rose-300 bg-slate-950 p-4 rounded-xl border border-slate-850 whitespace-pre-wrap leading-relaxed">
              {selectedLog.stack || selectedLog.errorMessage || "No stack trace available."}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
