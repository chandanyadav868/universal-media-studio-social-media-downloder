import MediaStudio from "../../components/MediaStudio";

export const metadata = {
  title: "Facebook Video Downloader — Download FB Reels & Watch Videos Free",
  description: "Download Facebook videos, Reels, and Watch clips in 1080p Full HD MP4 with audio. Safe, fast, zero-disk in-memory streaming with no login required.",
  keywords: [
    "facebook video downloader",
    "download facebook reels with audio",
    "fb video saver hd",
    "facebook watch downloader",
    "facebook story saver",
    "fb to mp4 1080p online"
  ],
  openGraph: {
    title: "Facebook Video Downloader — HD MP4 Free",
    description: "Download Facebook videos and Reels in Full HD with audio. Zero-disk streaming.",
    url: "https://yourdomain.com/facebook-downloader",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/facebook-downloader",
  },
};

export default function FacebookDownloaderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Facebook Video Downloader",
    "url": "https://yourdomain.com/facebook-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download Facebook videos and Reels in 1080p Full HD with sound."
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.75rem", background: "linear-gradient(135deg, #1877f2 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Facebook Video & Reels Downloader
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          Save Facebook public videos, Watch clips, and Reels in High Definition (720p/1080p) MP4 with crystal-clear stereo audio.
        </p>
      </div>

      <MediaStudio defaultUrl="https://www.facebook.com/watch/?v=" placeholder="Paste Facebook video or Reel link here..." />

      {/* SEO Editorial Guide */}
      <section style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.5rem", color: "#f8fafc" }}>
          How to Download Facebook Videos in High Definition
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#3b82f6", marginBottom: "0.5rem" }}>1. Copy Link</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              On Facebook, click "Share" under any public video or Reel and click "Copy link".
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#3b82f6", marginBottom: "0.5rem" }}>2. Paste & Inspect</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste the link into the studio search bar above and click "Fetch Video".
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#3b82f6", marginBottom: "0.5rem" }}>3. Save HD MP4</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Select "HD Video" to stream the progressive MP4 file directly to your phone or PC with full audio.
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1rem", color: "#f8fafc" }}>
          Facebook Downloader FAQ
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Do I need to log into Facebook to download videos?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              No! You never need to enter your Facebook credentials. Simply paste the link to any public post or Reel.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Can I download Facebook photos and carousel albums?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Yes! Click the "Images & Posts" tab above to download Facebook photos, community posts, and album covers in full original resolution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
