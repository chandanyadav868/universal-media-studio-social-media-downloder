"use client";
import React from "react";
import { Youtube, Instagram, Facebook, Twitter, Pin, Video, Film, Share2, MessageCircle } from "lucide-react";

const PLATFORMS = [
  {
    name: "YouTube",
    tagline: "4K UHD • 1080p • Community Posts • MaxRes Thumbnails",
    color: "#ff0000",
    bg: "rgba(255, 0, 0, 0.12)",
    border: "rgba(255, 0, 0, 0.3)",
    icon: Youtube,
  },
  {
    name: "Instagram",
    tagline: "Reels • HD Videos • Carousels • Original Photos",
    color: "#e1306c",
    bg: "rgba(225, 48, 108, 0.12)",
    border: "rgba(225, 48, 108, 0.3)",
    icon: Instagram,
  },
  {
    name: "Facebook",
    tagline: "Reels • 1080p Watch • Full Audio • HD Photos",
    color: "#1877f2",
    bg: "rgba(24, 119, 242, 0.12)",
    border: "rgba(24, 119, 242, 0.3)",
    icon: Facebook,
  },
  {
    name: "X (Twitter)",
    tagline: "Original UHD Photos • 1080p MP4 • Zero Compression",
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    icon: Twitter,
  },
  {
    name: "TikTok",
    tagline: "No Watermark • 1080p 60fps • MP3 Audio",
    color: "#22d3ee",
    bg: "rgba(34, 211, 238, 0.12)",
    border: "rgba(34, 211, 238, 0.3)",
    icon: Video,
  },
  {
    name: "Pinterest",
    tagline: "Pins • Ultra HD Photos • Video Pins",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: Pin,
  },
  {
    name: "Reddit",
    tagline: "Audio+Video Muxed • Original Assets",
    color: "#ff4500",
    bg: "rgba(255, 69, 0, 0.12)",
    border: "rgba(255, 69, 0, 0.3)",
    icon: MessageCircle,
  },
  {
    name: "Threads",
    tagline: "High-Res Photos • Carousel Slides • MP4 Clips",
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
    border: "rgba(168, 85, 247, 0.3)",
    icon: Share2,
  },
  {
    name: "Vimeo",
    tagline: "4K Master Streams • Pro Audio Delivery",
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    icon: Film,
  },
];

export default function MediaMarquee({ title = "Supported Media Platforms (All Available in 1 Click)" }) {
  // Duplicate array to achieve seamless infinite loop
  const duplicated = [...PLATFORMS, ...PLATFORMS];

  return (
    <div style={{
      width: "100%",
      overflow: "hidden",
      position: "relative",
      padding: "1.25rem 0",
      margin: "1.5rem 0",
      maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
    }}>
      {title && (
        <div style={{
          textAlign: "center",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginBottom: "1.25rem"
        }}>
          ✨ {title}
        </div>
      )}

      {/* Marquee Track running in continuous loop */}
      <div className="marquee-track" style={{
        display: "flex",
        gap: "1rem",
        width: "max-content",
      }}>
        {duplicated.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 1.1rem",
                borderRadius: "0.85rem",
                background: "rgba(15, 23, 42, 0.75)",
                border: `1px solid ${item.border}`,
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                flexShrink: 0,
                transition: "transform 0.2s ease, border-color 0.2s ease",
                cursor: "default"
              }}
              className="hover:scale-105"
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "0.5rem",
                background: item.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.color,
                boxShadow: `0 0 10px ${item.border}`
              }}>
                <Icon size={18} />
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                  {item.tagline}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
