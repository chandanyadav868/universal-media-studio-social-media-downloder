import MediaStudio from "../../../components/MediaStudio";
import Link from "next/link";
import { Film, Image as ImageIcon, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Facebook Video Downloader — Download FB Reels & Watch Videos in HD",
  description: "Download public Facebook videos, Reels, and Watch clips in High Definition 1080p/720p MP4. Free, fast in-memory zero-disk streaming with no software installation.",
  keywords: [
    "facebook video downloader",
    "download facebook reels",
    "facebook watch downloader hd",
    "save fb video mp4",
    "free facebook video saver",
    "facebook photo downloader"
  ],
  alternates: {
    canonical: "https://yourdomain.com/platforms/facebook",
  },
};

export default function FacebookPlatformPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Facebook Video Downloader",
        "operatingSystem": "All (Web Browser, Windows, macOS, Android, iOS)",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourdomain.com" },
          { "@type": "ListItem", "position": 2, "name": "Platforms", "item": "https://yourdomain.com/platforms" },
          { "@type": "ListItem", "position": 3, "name": "Facebook Downloader", "item": "https://yourdomain.com/platforms/facebook" }
        ]
      }
    ]
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MediaStudio />

      <article style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem" }}>
          Facebook HD & SD Media Streaming Engine
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
          Facebook hosts video content across Facebook Watch, Reels, and Page posts in dual-stream profiles (High Definition and Standard Definition). Our zero-disk streaming architecture inspects Facebook's manifest, isolates the highest-bitrate progressive MP4 file, and streams it directly to your device with full stereo audio.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#3b82f6", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Film size={20} /> Facebook HD & SD MP4
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Choose between crystal-clear 1080p/720p HD Video or lightweight 480p SD Video for fast mobile viewing and saving data.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", marginBottom: "0.75rem", fontWeight: 700 }}>
              <ImageIcon size={20} /> Lookaside Photo Proxy
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Bypasses Facebook's login redirections on `lookaside.fbsbx.com` to stream pristine, full-resolution 150KB+ photos seamlessly.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Shield size={20} /> In-Memory Zero-Disk Speed
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Data transfers in real time. We never store copies of your downloaded Facebook media on our servers.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/guides/video-download-guide" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Step-by-step Download Instructions <ArrowRight size={14} />
          </Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/faq" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Facebook Downloader FAQ <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
