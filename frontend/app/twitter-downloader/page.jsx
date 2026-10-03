import MediaStudio from "../../components/MediaStudio";

export const metadata = {
  title: "Twitter / X Video Downloader — Download X Videos & GIFs Free",
  description: "Download Twitter (X) videos and animated GIFs in 1080p, 720p HD MP4. Free online Twitter media saver with crystal-clear sound.",
  keywords: [
    "twitter video downloader",
    "x video downloader",
    "download twitter video hd",
    "twitter to mp4 converter",
    "save twitter gif",
    "free x video saver"
  ],
  openGraph: {
    title: "Twitter / X Video Downloader — HD MP4 Free",
    description: "Download Twitter / X videos in HD with sound. Zero-disk streaming.",
    url: "https://yourdomain.com/twitter-downloader",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/twitter-downloader",
  },
};

export default function TwitterDownloaderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Twitter / X Video Downloader",
    "url": "https://yourdomain.com/twitter-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download Twitter and X videos in Full HD MP4 with audio."
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.75rem", background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Twitter / X Video & GIF Downloader
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          Save videos, clips, and GIFs from X (formerly Twitter) in original 1080p / 720p HD MP4 with crystal-clear stereo audio.
        </p>
      </div>

      <MediaStudio defaultUrl="https://x.com/" placeholder="Paste Twitter / X tweet link here..." />

      {/* SEO Editorial Guide */}
      <section style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.5rem", color: "#f8fafc" }}>
          How to Download Videos from X (Twitter)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>1. Copy Tweet URL</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Click the Share icon under the tweet with video and select "Copy link to Tweet".
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>2. Paste in Studio</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste the link into the box above and tap "Fetch Video" to inspect available HD formats.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>3. Save MP4</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Select your preferred resolution (1080p, 720p, or 480p) to stream the video directly to your storage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
