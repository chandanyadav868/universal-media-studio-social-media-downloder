"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already gave consent
    try {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        // Small delay to prevent initial render-blocking
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // In case localStorage is blocked in private browsing
    }
  }, []);

  const handleConsent = (level) => {
    try {
      localStorage.setItem("cookie_consent", level);
      localStorage.setItem("cookie_consent_date", new Date().toISOString());
    } catch (e) {}
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          aria-label="Cookie and Privacy Consent Banner"
          role="region"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-3xl bg-slate-950/95 border border-slate-800/90 shadow-2xl shadow-black/80 backdrop-blur-2xl text-slate-300"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Cookie size={19} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center justify-between">
                <span>Privacy & Cookie Choices</span>
                <button
                  type="button"
                  onClick={() => handleConsent("essential")}
                  aria-label="Dismiss cookie notice"
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
                We use cookies to enhance navigation, analyze site performance, and serve relevant advertising via Google AdSense in compliance with GDPR & CPRA.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-800/60 mt-3">
            <button
              type="button"
              onClick={() => handleConsent("accepted")}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/40 transition-all cursor-pointer text-center"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => handleConsent("essential")}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all cursor-pointer text-center"
            >
              Essential Only
            </button>
            <Link
              href="/privacy"
              className="text-[11px] text-slate-400 hover:text-blue-400 underline underline-offset-2 px-1 text-center shrink-0"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
