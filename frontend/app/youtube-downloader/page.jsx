import MediaStudio from "../../components/MediaStudio";

export const metadata = {
  title: "YouTube Video Downloader — Download 1080p, 4K & MP3 Free",
  description: "Fastest free online YouTube video downloader. Download YouTube videos, Shorts, and MP3 audio in Full HD 1080p and 4K 60fps with crystal-clear sound.",
  keywords: [
    "youtube video downloader",
    "download youtube 1080p with audio",
    "youtube shorts downloader",
    "youtube to mp3 320kbps",
    "youtube 4k video saver",
    "free youtube downloader online"
  ],
  openGraph: {
    title: "YouTube Video Downloader — 1080p, 4K & MP3 Free",
    description: "Download YouTube videos and Shorts in 1080p Full HD with audio. Zero-disk streaming, 100% free.",
    url: "https://yourdomain.com/youtube-downloader",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/youtube-downloader",
  },
};

export default function YouTubeDownloaderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "YouTube Video Downloader",
    "url": "https://yourdomain.com/youtube-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download YouTube videos, Shorts, and audio in 1080p, 4K, and 320kbps MP3 for free."
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.75rem", background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          YouTube Video & Shorts Downloader
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          Download any YouTube video or Short in crystal-clear 1080p Full HD, 4K 60fps, or extract high-bitrate 320kbps MP3 audio with zero waiting time.
        </p>
      </div>

      <MediaStudio defaultUrl="https://www.youtube.com/watch?v=" placeholder="Paste YouTube video or Shorts link here..." />

      {/* SEO Editorial Guide */}
      <section style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.5rem", color: "#f8fafc" }}>
          How to Download YouTube Videos in 1080p with Audio
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ef4444", marginBottom: "0.5rem" }}>1. Copy Link</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Open YouTube, click the "Share" button under the video or Short, and copy the link to your clipboard.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ef4444", marginBottom: "0.5rem" }}>2. Paste & Inspect</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste the YouTube URL into the box above and click "Fetch Video". Our engine instantly inspects 1080p, 720p, 4K, and MP3 formats.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ef4444", marginBottom: "0.5rem" }}>3. Instant Zero-Disk Download</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Choose your format. The video and audio are muxed in real-time in memory and streamed directly to your device.
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1rem", color: "#f8fafc" }}>
          Frequently Asked Questions (YouTube)
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Why do other downloaders save 1080p YouTube videos without sound?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              YouTube stores 1080p and 4K video as separate video and audio streams. Most downloaders lack the capability to multiplex them without storing files on disk. Universal Media Studio performs zero-disk in-memory muxing so your 1080p videos always include full crystal-clear sound.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Can I download YouTube Shorts?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Yes! All YouTube Shorts links (`youtube.com/shorts/...`) are fully supported in native vertical MP4 format with audio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
