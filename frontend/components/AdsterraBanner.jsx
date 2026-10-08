"use client";
import { useEffect, useRef, useState } from "react";
import { ADSTERRA_CONFIG } from "../lib/adsterraConfig";
import { Sparkles, ExternalLink } from "lucide-react";

/**
 * Universal Adsterra Banner Container
 * Types:
 *   - "leaderboard" (Responsive: 728x90 on desktop, 468x60 on tablet, 320x50 on mobile)
 *   - "rectangle" (300x250 High-CTR medium rectangle)
 *   - "mobile" (320x50)
 *   - "native" (Native 4:1 widget)
 *   - "native3x1" (Native 3:1 widget)
 *   - "skyscraper" (160x600)
 */
export default function AdsterraBanner({
  type = "rectangle",
  className = "",
  showSmartlink = false,
  smartlinkLabel = "Recommended High-Speed Cloud Storage & Downloader",
}) {
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const nativeRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For native ad injection
  useEffect(() => {
    if (!mounted) return;
    if (type === "native" || type === "native3x1") {
      const cfg = type === "native3x1" ? ADSTERRA_CONFIG.native3x1 : ADSTERRA_CONFIG.native4x1;
      const container = document.getElementById(cfg.containerId);
      if (container && !container.hasAttribute("data-ad-loaded")) {
        container.setAttribute("data-ad-loaded", "true");
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = cfg.scriptSrc;
        if (container.parentNode) { container.parentNode.insertBefore(script, container); } else { container.appendChild(script); }
      }
    }
  }, [mounted, type]);

  if (!mounted) {
    return <div className={`min-h-[60px] w-full ${className}`} />;
  }

  // Determine configuration based on type and screen width
  let bannerConfig = ADSTERRA_CONFIG.banner300x250;
  if (type === "leaderboard") {
    if (windowWidth >= 768) {
      bannerConfig = ADSTERRA_CONFIG.banner728x90;
    } else if (windowWidth >= 500) {
      bannerConfig = ADSTERRA_CONFIG.banner468x60;
    } else {
      bannerConfig = ADSTERRA_CONFIG.banner320x50;
    }
  } else if (type === "mobile") {
    bannerConfig = ADSTERRA_CONFIG.banner320x50;
  } else if (type === "tablet") {
    bannerConfig = ADSTERRA_CONFIG.banner468x60;
  } else if (type === "skyscraper") {
    bannerConfig = ADSTERRA_CONFIG.banner160x600;
  } else if (type === "skyscraperSmall") {
    bannerConfig = ADSTERRA_CONFIG.banner160x300;
  }

  // Handle Native Banners
  if (type === "native" || type === "native3x1") {
    const cfg = type === "native3x1" ? ADSTERRA_CONFIG.native3x1 : ADSTERRA_CONFIG.native4x1;
    return (
      <aside aria-label="Sponsored Content" className={`w-full my-4 flex flex-col items-center ${className}`}>
        <div className="w-full text-center mb-1.5 flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Sponsored Recommendations
          </span>
        </div>
        <div id={cfg.containerId} ref={nativeRef} className="w-full min-h-[90px] flex justify-center items-center overflow-hidden" />
      </aside>
    );
  }

  // Standard Iframe Display Banner
  const iframeSrcDoc = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; overflow: hidden; }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${bannerConfig.key}',
      'format' : 'iframe',
      'height' : ${bannerConfig.height},
      'width' : ${bannerConfig.width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highrevenueformat.com/${bannerConfig.key}/invoke.js"></script>
</body>
</html>`;

  return (
    <aside aria-label="Sponsored Advertisement" className={`my-3 mx-auto flex flex-col items-center justify-center ${className}`}>
      {/* Subtle Ad Label */}
      <div className="w-full text-center mb-1 flex items-center justify-center gap-1.5">
        <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
          Advertisement
        </span>
      </div>

      {/* Sandboxed Adsterra Banner Frame */}
      <div
        className="rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950/70 shadow-lg flex items-center justify-center"
        style={{
          width: `${bannerConfig.width}px`,
          height: `${bannerConfig.height}px`,
          maxWidth: "100%",
        }}
      >
        <iframe
          title={`Adsterra Ad ${bannerConfig.width}x${bannerConfig.height}`}
          srcDoc={iframeSrcDoc}
          width={bannerConfig.width}
          height={bannerConfig.height}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        />
      </div>

      {/* Optional High-CTR Smartlink Partner Bar */}
      {showSmartlink && (
        <a
          href={ADSTERRA_CONFIG.smartlink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/50 hover:to-indigo-900/50 border border-blue-500/30 text-[11px] text-blue-300 hover:text-white font-medium transition-all shadow-md"
        >
          <Sparkles size={12} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span>{smartlinkLabel}</span>
          <ExternalLink size={10} className="text-blue-400" />
        </a>
      )}
    </aside>
  );
}
