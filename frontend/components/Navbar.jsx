"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Film, Image as ImageIcon, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isVideoActive = pathname === "/" || pathname === "";
  const isImageActive = pathname.startsWith("/image-downloader");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl shadow-xl shadow-black/40">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.94 }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0"
          >
            <Sparkles size={20} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">
              Universal<span className="text-blue-400">Media</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              Zero-Disk Studio
            </span>
          </div>
        </Link>

        {/* Navigation Tabs Switcher */}
        <nav className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 gap-1.5 shadow-inner">
          {/* Tab 1: Video & Audio Downloader */}
          <Link href="/">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isVideoActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Film size={15} />
              <span>Video & Audio</span>
            </motion.div>
          </Link>

          {/* Tab 2: High-Res Image & Post Downloader */}
          <Link href="/image-downloader">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isImageActive
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <ImageIcon size={15} />
              <span>Images & Posts</span>
            </motion.div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
