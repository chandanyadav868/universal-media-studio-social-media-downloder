import Link from "next/link";
import { CheckCircle2, Film, Music, Image as ImageIcon, Shield, ArrowRight, Zap } from "lucide-react";

export const metadata = {
  title: "Supported Platforms & Video Formats Matrix — Universal Media Studio",
  description: "Explore all supported websites, video resolutions, audio bitrates, and photo extraction capabilities across YouTube, Instagram, Facebook, TikTok, Twitter, and Reddit.",
  keywords: [
    "supported video platforms",
    "downloader supported websites",
    "supported video formats",
    "4k downloader compatibility",
    "youtube facebook instagram tiktok compatibility"
  ],
  alternates: {
    canonical: "https://yourdomain.com/supported-platforms",
  },
};

export default function SupportedPlatformsPage() {
  const platforms = [
    {
      name: "YouTube & Shorts",
      urlExamples: "youtube.com/watch?v=..., youtube.com/shorts/...",
      maxVideo: "4K UHD / 1080p 60fps (H.264)",
      audio: "320kbps MP3 / Stereo AAC",
      images: "MaxRes 1080p Thumbnails & Community Posts",
      engine: "Zero-Disk DASH Remuxer (WMP-Compliant)",
      color: "#ef4444",
      anchor: "/#youtubevideodownloader"
    },
    {
      name: "Instagram",
      urlExamples: "instagram.com/reel/..., instagram.com/p/...",
      maxVideo: "1080p HD Progressive MP4",
      audio: "Stereo AAC / 320kbps MP3",
      images: "Uncompressed 1440x1800 Photos & Carousels",
      engine: "Meta Direct Progressive Engine",
      color: "#ec4899",
      anchor: "/#instagramreelsdownloader"
    },
    {
      name: "Facebook",
      urlExamples: "facebook.com/watch/?v=..., fb.watch/...",
      maxVideo: "1080p HD / 480p SD MP4",
      audio: "Stereo AAC / 320kbps MP3",
      images: "Full-Resolution Album & Post Photos",
      engine: "Facebook Progressive HD/SD Pipeline",
      color: "#3b82f6",
      anchor: "/#facebookvideodownloader"
    },
    {
      name: "TikTok",
      urlExamples: "tiktok.com/@user/video/..., vm.tiktok.com/...",
      maxVideo: "1080p HD (No Watermark)",
      audio: "Original Sound 320kbps MP3",
      images: "Video Cover Art & Slides",
      engine: "Clean HD Stream Extraction",
      color: "#06b6d4",
      anchor: "/#tiktokvideodownloader"
    },
    {
      name: "Twitter / X",
      urlExamples: "x.com/user/status/..., twitter.com/...",
      maxVideo: "1080p 60fps Progressive MP4",
      audio: "Stereo AAC / 320kbps MP3",
      images: "Full-Size JPEG/PNG & Multi-Image Posts",
      engine: "Twitter Syndication Progressive Engine",
      color: "#94a3b8",
      anchor: "/#twittervideodownloader"
    },
    {
      name: "Reddit",
      urlExamples: "reddit.com/r/videos/comments/...",
      maxVideo: "1080p / 720p Muxed MP4",
      audio: "Muxed Stereo AAC / MP3",
      images: "Reddit Image Gallery & Banners",
      engine: "Reddit In-Memory Remuxer",
      color: "#f97316",
      anchor: "/#redditvideodownloader"
    }
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "rgba(59, 130, 246, 0.12)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          color: "#60a5fa",
          padding: "0.3rem 0.75rem",
          borderRadius: "9999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          marginBottom: "1rem"
        }}>
          <Zap size={14} /> Full Technical Compatibility Matrix
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
          Supported Platforms, Resolutions & Media Formats
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
          Detailed technical specifications for each social media network and video hosting provider supported by our zero-disk streaming engine.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {platforms.map((p, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color, display: "inline-block" }} />
                  {p.name}
                </h3>
                <span style={{ fontSize: "0.72rem", color: "#34d399", background: "rgba(16, 185, 129, 0.1)", padding: "0.2rem 0.5rem", borderRadius: "9999px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                  Verified
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.86rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
                <div>
                  <strong style={{ color: "#e2e8f0" }}>Video Quality:</strong> {p.maxVideo}
                </div>
                <div>
                  <strong style={{ color: "#e2e8f0" }}>Audio Track:</strong> {p.audio}
                </div>
                <div>
                  <strong style={{ color: "#e2e8f0" }}>Images & Art:</strong> {p.images}
                </div>
                <div>
                  <strong style={{ color: "#e2e8f0" }}>Engine Pipeline:</strong> {p.engine}
                </div>
              </div>
            </div>

            <Link
              href={p.anchor}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "#60a5fa",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                transition: "all 0.2s ease"
              }}
            >
              Open {p.name} Downloader <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", fontWeight: 700, textDecoration: "none" }}>
          Return to Downloader Studio <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
