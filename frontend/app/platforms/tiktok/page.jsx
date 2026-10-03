import MediaStudio from "../../../components/MediaStudio";
import Link from "next/link";
import { Film, Music, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "TikTok Video Downloader — Download Without Watermark in HD",
  description: "Download TikTok videos without watermark in high-definition MP4. Extract original TikTok sounds and songs to 320kbps MP3 audio for free on any device.",
  keywords: [
    "tiktok downloader no watermark",
    "download tiktok video hd",
    "tiktok mp3 sound download",
    "save tiktok video free",
    "tiktok without watermark mp4"
  ],
  alternates: {
    canonical: "https://yourdomain.com/platforms/tiktok",
  },
};

export default function TikTokPlatformPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "TikTok Video Downloader",
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
          { "@type": "ListItem", "position": 3, "name": "TikTok Downloader", "item": "https://yourdomain.com/platforms/tiktok" }
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
          Clean Watermark-Free TikTok Video Processing
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
          ByteDance injects moving watermark overlays on videos downloaded directly through the TikTok mobile application. Universal Media Studio queries TikTok's underlying media stream metadata, identifies the unwatermarked original-source H.264 video feed, and streams it cleanly in standard MP4 format.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#06b6d4", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Film size={20} /> No Watermark MP4
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Downloads clean, unbranded vertical HD videos suitable for personal backup and cross-platform editing.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Music size={20} /> TikTok Audio to MP3
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Isolate and download trending TikTok songs, creator voiceovers, and sound clips directly in 320kbps MP3 format.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Shield size={20} /> Mobile Optimized
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Works natively on iPhone Safari, Android Chrome, iPad, and desktop browsers with 1-click download.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/guides/video-download-guide" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            How to Download TikTok Videos <ArrowRight size={14} />
          </Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/supported-platforms" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Supported Formats Matrix <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
