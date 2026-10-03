import MediaStudio from "../../../components/MediaStudio";
import Link from "next/link";
import { Sparkles, Film, Image as ImageIcon, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Instagram Reels & Video Downloader — Save Reels & Stories in HD",
  description: "Fast and free Instagram Reels and video downloader. Save high-resolution Instagram Reels, Videos, Stories, and photos directly in MP4 format without registration.",
  keywords: [
    "instagram reels downloader",
    "download instagram video",
    "save instagram story mp4",
    "instagram photo downloader",
    "free instagram saver",
    "download instagram carousel"
  ],
  alternates: {
    canonical: "https://socialmediadownloader.humantalking.com/platforms/instagram",
  },
};

export default function InstagramPlatformPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Instagram Reels & Video Downloader",
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
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://socialmediadownloader.humantalking.com" },
          { "@type": "ListItem", "position": 2, "name": "Platforms", "item": "https://socialmediadownloader.humantalking.com/platforms" },
          { "@type": "ListItem", "position": 3, "name": "Instagram Downloader", "item": "https://socialmediadownloader.humantalking.com/platforms/instagram" }
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
          Instagram Video & Photo Extraction Architecture
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
          Instagram serves video assets through progressive MP4 streams while applying strict edge bot detection on photo and carousel posts. Our platform implements an intelligent multi-tiered crawler protocol using Meta crawler whitelists to ensure 100% reliable extraction of public Reels, Videos, and uncompressed 1440x1800 photos without requiring your personal account credentials.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ec4899", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Film size={20} /> High-Resolution Reels
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Extracts the native progressive MP4 video stream directly from Meta's CDN with synchronized stereo audio.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#c084fc", marginBottom: "0.75rem", fontWeight: 700 }}>
              <ImageIcon size={20} /> Uncropped Photos
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Bypasses square viewport cropping to retrieve original uncompressed 1440x1800 source images and multi-photo carousels.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Shield size={20} /> Zero Login Required
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              100% safe and anonymous. You never need to enter your Instagram password or share access tokens.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/guides/video-download-guide" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Read the Video Download Guide <ArrowRight size={14} />
          </Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/supported-platforms" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Check supported platforms <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
