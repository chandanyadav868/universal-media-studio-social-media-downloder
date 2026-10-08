"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Film, Image as ImageIcon, Sparkles, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isVideoActive = pathname === "/" || pathname === "";
  const isImageActive = pathname.startsWith("/image-downloader");

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl shadow-xl shadow-black/40">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 sm:gap-3 group text-decoration-none">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.94 }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0"
          >
            <Sparkles size={20} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-black text-white tracking-tight leading-none">
              Universal<span className="text-blue-400">Media</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
              Zero-Disk Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Tabs Switcher */}
        <nav className="hidden md:flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 gap-1.5 shadow-inner">
          {/* Tab 1: Video & Audio Downloader */}
          <Link href="/">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-md focus:outline-none"
          >
            {mobileMenuOpen ? <X size={22} className="text-blue-400" /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-3xl px-4 py-4 shadow-2xl"
          >
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2">
                Download Tools
              </span>

              {/* Mobile Tab 1 */}
              <Link href="/" onClick={closeMenu}>
                <div
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isVideoActive
                      ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/20 border border-blue-500/40 text-white"
                      : "bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Film size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Video & Audio Downloader</div>
                      <div className="text-[11px] text-slate-400">1080p, 4K MP4 & 320kbps MP3</div>
                    </div>
                  </div>
                  <ArrowRight size={16} className={isVideoActive ? "text-blue-400" : "text-slate-600"} />
                </div>
              </Link>

              {/* Mobile Tab 2 */}
              <Link href="/image-downloader" onClick={closeMenu}>
                <div
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isImageActive
                      ? "bg-gradient-to-r from-purple-600/30 to-fuchsia-600/20 border border-purple-500/40 text-white"
                      : "bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Images & Posts Extractor</div>
                      <div className="text-[11px] text-slate-400">Thumbnails, Community & Photos</div>
                    </div>
                  </div>
                  <ArrowRight size={16} className={isImageActive ? "text-purple-400" : "text-slate-600"} />
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
