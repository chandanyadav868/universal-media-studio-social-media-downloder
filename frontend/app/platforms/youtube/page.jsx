import MediaStudio from "../../../components/MediaStudio";
import Link from "next/link";
import { CheckCircle2, Sparkles, Film, Music, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "YouTube Video & Shorts Downloader — 1080p 60fps & 320kbps MP3",
  description: "Download high-definition YouTube videos and Shorts in 1080p Full HD, 4K UHD, and pristine 320kbps MP3 audio with zero quality loss and zero disk storage.",
  keywords: [
    "youtube video downloader",
    "download youtube shorts",
    "youtube 1080p 60fps downloader",
    "youtube to mp3 320kbps",
    "save youtube video free",
    "youtube thumbnail grabber"
  ],
  alternates: {
    canonical: "https://yourdomain.com/platforms/youtube",
  },
};

export default function YouTubePlatformPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "YouTube Video & Shorts Downloader",
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
          { "@type": "ListItem", "position": 3, "name": "YouTube Downloader", "item": "https://yourdomain.com/platforms/youtube" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I download YouTube Shorts in high quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Our engine normalizes vertical YouTube Shorts dimensions (720x1280) to provide full 720p HD and 1080p MP4 downloads with synchronized audio."
            }
          },
          {
            "@type": "Question",
            "name": "Does the 1080p download include audio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. While YouTube serves 1080p video as separate DASH streams, our zero-disk streaming engine muxes H.264 video with pristine stereo AAC audio in real time."
            }
          }
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

      {/* Downloader Studio */}
      <MediaStudio />

      {/* Unique Platform Technical & Educational Guide */}
      <article style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ffffff", marginBottom: "1rem" }}>
          How Our YouTube Zero-Disk Streaming Engine Works
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
          YouTube delivers standard videos and vertical Shorts using Dynamic Adaptive Streaming over HTTP (DASH). Higher resolutions (such as 1080p 60fps and 4K UHD) are split into isolated video and audio feeds. Universal Media Studio bridges this gap with an in-memory real-time remuxing pipeline that delivers a single, universally playable MP4 file directly to your browser attachment without writing a single byte to our server hard drives.
        </p>

        {/* Feature Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Film size={20} /> 1080p 60fps & 4K Video
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Pristine H.264 (AVC1) streams selected to ensure smooth hardware decoding on Windows Media Player, iOS Safari, QuickTime, and Android.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Music size={20} /> 320kbps MP3 Audio
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Extract audio directly into studio-grade 320kbps MP3 tracks via LAME encoding for music tracks, podcasts, and speeches.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Shield size={20} /> Vertical Shorts Normalization
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Automatically maps vertical 9:16 Shorts dimensions into standard 720p HD and 1080p tiers rather than inverted downscales.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
            3 Steps to Download YouTube Videos & Shorts
          </h3>
          <ol style={{ paddingLeft: "1.25rem", color: "#94a3b8", lineHeight: 1.8, fontSize: "0.92rem" }}>
            <li><strong>Copy Link:</strong> Open YouTube and copy the video or Shorts URL from your address bar or the "Share" menu.</li>
            <li><strong>Paste & Analyze:</strong> Paste the link into the box above and click "Fetch Video" to inspect available stream quality tiers.</li>
            <li><strong>Download:</strong> Click your preferred resolution (1080p, 720p, or MP3). The stream initiates instantly in your browser.</li>
          </ol>
        </div>

        {/* Related Guides Link */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/guides/video-formats" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Learn about MP4 vs WebM codecs <ArrowRight size={14} />
          </Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/supported-platforms" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            View all supported platforms <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
