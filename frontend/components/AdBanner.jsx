"use client";
import { useEffect } from "react";

export default function AdBanner({ slot, format = "auto" }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense load silently handled
    }
  }, []);

  return (
    <div className="w-full my-4 py-2 px-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 text-center flex flex-col items-center justify-center min-h-[60px] overflow-hidden">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px", minHeight: "50px", width: "100%" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot || "1234567890"}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
