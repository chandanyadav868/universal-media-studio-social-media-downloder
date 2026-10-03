"use client";
import { useEffect, useState, useRef } from "react";
import { Megaphone, Sparkles } from "lucide-react";

export default function AdBanner({ 
  slot = "1234567890", 
  format = "auto", 
  label = "Sponsored Advertisement" 
}) {
  const [adLoaded, setAdLoaded] = useState(false);
  const insRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense push safely caught
    }

    // Monitor when AdSense injects iframe and fills ad
    if (insRef.current) {
      const checkAdStatus = () => {
        const status = insRef.current?.getAttribute("data-ad-status");
        if (status === "filled") {
          setAdLoaded(true);
        }
      };

      const observer = new MutationObserver(checkAdStatus);
      observer.observe(insRef.current, { attributes: true, attributeFilter: ["data-ad-status"] });
      checkAdStatus();

      return () => observer.disconnect();
    }
  }, []);

  // Determine device-tailored dimensions & reserved min-height to prevent Cumulative Layout Shift (CLS)
  const isRectangle = format === "rectangle";
  const containerClasses = isRectangle
    ? "min-h-[250px] sm:min-h-[280px] max-w-[336px]"
    : "min-h-[60px] sm:min-h-[90px] md:min-h-[100px] w-full max-w-4xl";

  return (
    <aside 
      aria-label="Advertisement Banner"
      className={`relative mx-auto my-5 sm:my-7 flex flex-col items-center justify-center overflow-hidden rounded-2xl transition-all ${containerClasses}`}
    >
      {/* Visual Glassmorphic Placeholder (Displayed until ad fills, preventing layout shift) */}
      {!adLoaded && (
        <div className="absolute inset-0 w-full h-full rounded-2xl border border-dashed border-slate-800/90 bg-gradient-to-r from-slate-950/70 via-slate-900/50 to-slate-950/70 flex flex-col items-center justify-center p-3 text-center select-none shadow-inner">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Megaphone size={13} className="text-blue-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
              {label}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 hidden sm:inline-block">
            Responsive Ad Unit (Mobile: 320×50 • Tablet: 728×90 • Desktop: 970×90)
          </span>
        </div>
      )}

      {/* Google AdSense ins container */}
      <ins
        ref={insRef}
        className="adsbygoogle relative z-10 w-full"
        style={{
          display: "block",
          textAlign: "center",
          minHeight: isRectangle ? "250px" : "60px",
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={isRectangle ? "rectangle" : "auto"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
