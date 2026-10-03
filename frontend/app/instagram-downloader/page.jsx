import MediaStudio from "../../components/MediaStudio";

export const metadata = {
  title: "Instagram Downloader — Download Reels, Videos & Stories Free",
  description: "Download Instagram Reels, videos, carousel photos, and stories in original 1080p Full HD MP4 and uncropped 1440x1800 resolution with sound. 100% free.",
  keywords: [
    "instagram reel downloader",
    "download instagram video with audio",
    "instagram photo downloader",
    "instagram 1080p reel saver",
    "instagram story downloader",
    "free instagram saver online"
  ],
  openGraph: {
    title: "Instagram Downloader — Reels, Videos & Photos Free",
    description: "Download Instagram Reels and Videos in original HD with crystal-clear audio. Fast and zero-disk streaming.",
    url: "https://socialmediadownloader.humantalking.com/instagram-downloader",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://socialmediadownloader.humantalking.com/instagram-downloader",
  },
};

export default function InstagramDownloaderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Instagram Downloader",
    "url": "https://socialmediadownloader.humantalking.com/instagram-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download Instagram Reels, videos, and full uncropped photos in HD with sound."
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.75rem", background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Instagram Reels & Video Downloader
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          Save Instagram Reels, posts, and videos directly to your camera roll in original 1080p Full HD MP4 with crystal-clear sound.
        </p>
      </div>

      <MediaStudio defaultUrl="https://www.instagram.com/reel/" placeholder="Paste Instagram Reel or Video URL here..." />

      {/* SEO Editorial Guide */}
      <section style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.5rem", color: "#f8fafc" }}>
          How to Download Instagram Reels with Audio on iPhone & Android
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ec4899", marginBottom: "0.5rem" }}>1. Copy Reel Link</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              In the Instagram app or browser, tap the Share icon on any Reel and choose "Copy Link".
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ec4899", marginBottom: "0.5rem" }}>2. Paste & Inspect</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste the link into the studio input above and tap "Fetch Video". Our engine verifies the progressive HD MP4 file.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ec4899", marginBottom: "0.5rem" }}>3. Save to Gallery</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Tap "Download HD Video". The pristine Reel streams directly to your downloads or camera roll with full sound.
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1rem", color: "#f8fafc" }}>
          Instagram Downloader FAQ
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Does this Instagram downloader save Reels with sound?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Yes! We extract Instagram's progressive H.264 + AAC master format, guaranteeing that both video and original background music/audio are perfectly synced in the downloaded MP4.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>
              Can I download Instagram photos in full resolution without cropping?
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Yes! Switch to the "Images & Posts" tab above to download Instagram photos in their original uncropped 1440x1800 resolution without square avatar crops.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
