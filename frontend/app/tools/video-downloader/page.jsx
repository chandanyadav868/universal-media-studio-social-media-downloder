import MediaStudio from "../../../components/MediaStudio";
import Link from "next/link";
import { Sparkles, Film, Music, Shield, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Online Video Downloader — Download Videos From Any URL Free",
  description: "Universal online video downloader from URL. Download 1080p, 4K videos and MP3 audio from YouTube, Facebook, Instagram, TikTok, and Twitter with zero-disk in-memory streaming.",
  keywords: [
    "online video downloader",
    "video downloader from url",
    "download video online free",
    "free online video saver",
    "download video as mp4",
    "universal media downloader"
  ],
  alternates: {
    canonical: "https://yourdomain.com/tools/video-downloader",
  },
};

export default function VideoDownloaderToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Universal Online Video Downloader",
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
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://yourdomain.com/tools" },
          { "@type": "ListItem", "position": 3, "name": "Video Downloader", "item": "https://yourdomain.com/tools/video-downloader" }
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
          Universal Video Downloader from URL: Fast, Private & Zero-Disk
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
          Universal Media Studio is built for users who need a dependable, lightweight tool to download public videos from web URLs without registering or installing bloated desktop applications. Our streaming engine establishes a direct in-memory pipe between the video source CDN and your browser attachment, ensuring 100% privacy and maximum download throughput.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Zap size={20} /> High-Speed In-Memory Stream
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Videos begin downloading immediately as the first bytes arrive from the source server. No waiting for slow disk caching.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Shield size={20} /> Zero Logs & Zero Disk Footprint
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              We do not track user IP addresses, store downloaded video files, or maintain personal browsing records.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#c084fc", marginBottom: "0.75rem", fontWeight: 700 }}>
              <CheckCircle2 size={20} /> Universal Device Compatibility
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              All downloaded MP4 files are muxed with standard ISO MPEG-4 headers, ensuring seamless playback in Windows Media Player, QuickTime, iOS, and Android.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/platforms/youtube" style={{ color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>YouTube Downloader</Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/platforms/instagram" style={{ color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>Instagram Downloader</Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/platforms/facebook" style={{ color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>Facebook Downloader</Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/guides/video-formats" style={{ color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>Video Formats Guide</Link>
        </div>
      </article>
    </div>
  );
}
