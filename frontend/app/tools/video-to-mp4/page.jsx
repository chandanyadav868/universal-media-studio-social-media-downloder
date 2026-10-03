import MediaStudio from "../../../components/MediaStudio";
import Link from "next/link";
import { Film, CheckCircle2, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Video to MP4 Converter Online — Stream & Save as Standard MP4",
  description: "Convert and download online web videos directly to universal MP4 format. 100% compatible with Windows Media Player, QuickTime, iPhone, iPad, and Android.",
  keywords: [
    "video to mp4 converter",
    "convert online video to mp4",
    "download web video as mp4",
    "video to mp4 online free",
    "save video as mp4 hd"
  ],
  alternates: {
    canonical: "https://yourdomain.com/tools/video-to-mp4",
  },
};

export default function VideoToMp4ToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Online Video to MP4 Converter",
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
          { "@type": "ListItem", "position": 3, "name": "Video to MP4", "item": "https://yourdomain.com/tools/video-to-mp4" }
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
          Why Universal MP4 is the Global Standard for Video Downloads
        </h2>
        <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
          Many video streaming websites serve content encoded in modern but fragmented formats like WebM, VP9, or raw MPEG Transport Streams (MPEG-TS). While browsers can render these natively, legacy media players and editing software (such as Windows 10/11 Media Player, QuickTime, Adobe Premiere, and Final Cut Pro) frequently encounter audio sync issues or format rejection. Our engine multiplexes incoming video streams into standard ISO Base Media File Format (ISO MP4) with H.264 video and stereo AAC audio.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Film size={20} /> Guaranteed Playback
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Plays reliably on smart TVs, game consoles, smartphones, tablets, and desktop operating systems without installing external codec packs.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#34d399", marginBottom: "0.75rem", fontWeight: 700 }}>
              <CheckCircle2 size={20} /> Zero Quality Loss
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Our pipeline copies native H.264 stream packets without lossy re-compression, preserving 100% of the original video detail and frame rate.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#c084fc", marginBottom: "0.75rem", fontWeight: 700 }}>
              <Shield size={20} /> Clean Metadata Headers
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Embeds complete duration and audio track descriptors in the initial MP4 `moov` header, preventing player initialization crashes.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/guides/video-formats" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            Read MP4 vs WebM Comparison <ArrowRight size={14} />
          </Link>
          <span style={{ color: "#475569" }}>•</span>
          <Link href="/supported-platforms" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", textDecoration: "none", fontSize: "0.9rem" }}>
            View Supported Platforms <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
