import MediaStudio from "../../components/MediaStudio";

export const metadata = {
  title: "TikTok Downloader Without Watermark — Fast HD MP4 & MP3 Free",
  description: "Download TikTok videos without watermark in HD MP4. Free, fast, and no app installation required. Save TikTok clips with crystal-clear audio.",
  keywords: [
    "tiktok downloader without watermark",
    "download tiktok no watermark hd",
    "tiktok to mp4 free",
    "tiktok video saver",
    "snaptik alternative free",
    "tiktok sound download mp3"
  ],
  openGraph: {
    title: "TikTok Downloader Without Watermark — HD MP4 Free",
    description: "Download TikTok videos without watermark in original HD with sound. Zero-disk streaming.",
    url: "https://yourdomain.com/tiktok-downloader",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/tiktok-downloader",
  },
};

export default function TikTokDownloaderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TikTok Downloader Without Watermark",
    "url": "https://yourdomain.com/tiktok-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download TikTok videos without watermark in HD MP4 with audio."
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.75rem", background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          TikTok Video Downloader Without Watermark
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          Download any TikTok video in high definition without the annoying bouncing watermark. Clean, pristine MP4 with full audio.
        </p>
      </div>

      <MediaStudio defaultUrl="https://www.tiktok.com/@" placeholder="Paste TikTok video link here..." />

      {/* SEO Editorial Guide */}
      <section style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.5rem", color: "#f8fafc" }}>
          How to Save TikTok Videos Without Watermark
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>1. Copy TikTok Link</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              In TikTok, tap "Share" (the arrow icon) and select "Copy link".
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>2. Paste Link</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste the link into the search bar above and click "Fetch Video".
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8", marginBottom: "0.5rem" }}>3. Download No-Watermark MP4</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Select your format to stream the clean, watermark-free video directly to your phone or computer.
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1rem", color: "#f8fafc" }}>
          TikTok Downloader FAQ
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Are TikTok videos downloaded without the logo/watermark?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Yes! Our engine fetches the raw source stream directly, removing the platform overlay and logo watermark.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Can I extract TikTok sound as MP3?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Yes! You can choose the "Download MP3 Audio" option in the modal to save only the original background music or voiceover.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
