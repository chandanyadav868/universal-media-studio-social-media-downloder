"use client";
import { useEffect, useRef, useState } from "react";
import { ADSTERRA_CONFIG } from "../lib/adsterraConfig";
import { Sparkles, ExternalLink } from "lucide-react";

/**
 * Universal Adsterra Banner Container
 * Seamless rendering without intrusive labels or black empty boxes.
 */
export default function AdsterraBanner({
  type = "rectangle",
  className = "",
  showSmartlink = false,
  smartlinkLabel = "High-Speed Cloud Mirror (Direct Access)",
  refreshKey = 0,
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
      if (container) {
        // Clear previous scripts if re-rendering on refreshKey
        const existingScript = container.parentNode?.querySelector('script[src="' + cfg.scriptSrc + '"]');
        if (existingScript) {
          existingScript.remove();
        }
        container.innerHTML = "";
        
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = cfg.scriptSrc;
        if (container.parentNode) {
          container.parentNode.insertBefore(script, container);
        } else {
          container.appendChild(script);
        }
      }
    }
  }, [mounted, type, refreshKey]);

  if (!mounted) {
    return <div className={"min-h-[50px] w-full " + className} />;
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

  // Handle Native Banners (Organic Recommendation Cards without badges)
  if (type === "native" || type === "native3x1") {
    const cfg = type === "native3x1" ? ADSTERRA_CONFIG.native3x1 : ADSTERRA_CONFIG.native4x1;
    return (
      <div key={"native-" + refreshKey} className={"w-full my-3 flex flex-col items-center " + className}>
        <div 
          id={cfg.containerId} 
          ref={nativeRef} 
          className="w-full min-h-[90px] flex justify-center items-center overflow-hidden" 
        />
      </div>
    );
  }

  // Standard Iframe Display Banner
  const iframeSrcDoc = '<!DOCTYPE html><html><head><style>body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; overflow: hidden; }</style></head><body>' +
    '<script type="text/javascript">' +
    'atOptions = {' +
    "  'key' : '" + bannerConfig.key + "'," +
    "  'format' : 'iframe'," +
    "  'height' : " + bannerConfig.height + "," +
    "  'width' : " + bannerConfig.width + "," +
    "  'params' : {}" +
    '};' +
    '</script>' +
    '<script type="text/javascript" src="https://www.highrevenueformat.com/' + bannerConfig.key + '/invoke.js"></script>' +
    '</body></html>';

  return (
    <div key={"banner-" + refreshKey} className={"my-2.5 mx-auto flex flex-col items-center justify-center " + className}>
      {/* Seamless frame without dark black borders */}
      <div
        className="rounded-xl overflow-hidden flex items-center justify-center bg-transparent"
        style={{
          width: bannerConfig.width + "px",
          height: bannerConfig.height + "px",
          maxWidth: "100%",
        }}
      >
        <iframe
          title={"Ad " + bannerConfig.width + "x" + bannerConfig.height}
          srcDoc={iframeSrcDoc}
          width={bannerConfig.width}
          height={bannerConfig.height}
          style={{ border: "none", overflow: "hidden", background: "transparent" }}
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
    </div>
  );
}
