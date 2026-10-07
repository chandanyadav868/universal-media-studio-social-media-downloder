"use client";
import { useEffect, useState, useRef } from "react";
import { Sparkles, ExternalLink } from "lucide-react";

export default function AdBanner({ 
  slot = "1234567890", 
  format = "auto", 
  label = "Sponsored Recommendation" 
}) {
  const [adSenseFilled, setAdSenseFilled] = useState(false);
  const insRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {}

    if (insRef.current) {
      const checkAdStatus = () => {
        if (insRef.current?.getAttribute("data-ad-status") === "filled") {
          setAdSenseFilled(true);
        }
      };
      const observer = new MutationObserver(checkAdStatus);
      observer.observe(insRef.current, { attributes: true, attributeFilter: ["data-ad-status"] });
      return () => observer.disconnect();
    }
  }, []);

  const isRectangle = format === "rectangle";

  return (
    <aside 
      aria-label="Advertisement Banner"
      className={`relative mx-auto my-4 flex flex-col items-center justify-center overflow-hidden rounded-2xl transition-all ${
        isRectangle ? "max-w-[336px] w-full" : "w-full max-w-4xl"
      }`}
    >
      {/* Monetag SmartLink Sponsored Card (replaces empty AdSense placeholder) */}
      {!adSenseFilled && (
        <a
          href="https://uplcm.com/4/11972780"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full group rounded-2xl border border-blue-500/20 bg-gradient-to-r from-slate-900/90 via-blue-950/40 to-slate-900/90 hover:border-blue-500/50 p-3 sm:p-4 flex items-center justify-between gap-3 text-left transition-all shadow-lg hover:shadow-blue-950/30 cursor-pointer ${
            isRectangle ? "flex-col text-center" : "flex-row"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles size={17} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Sponsored
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                  High-Speed Unlimited Cloud & Media Streaming
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Check recommended partner offers • 100% Free & Fast
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
            <span>Explore</span>
            <ExternalLink size={12} />
          </div>
        </a>
      )}

      {/* AdSense fallback container (hidden until AdSense is approved & fills) */}
      <ins
        ref={insRef}
        className="adsbygoogle relative z-10 w-full"
        style={{
          display: adSenseFilled ? "block" : "none",
          textAlign: "center",
          minHeight: isRectangle ? "250px" : "60px",
        }}
        data-ad-client="ca-pub-1412205696232927"
        data-ad-slot={slot}
        data-ad-format={isRectangle ? "rectangle" : "auto"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
