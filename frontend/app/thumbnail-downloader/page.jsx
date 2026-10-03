import ImageStudio from "../../components/ImageStudio";

export const metadata = {
  title: "Thumbnail & Image Downloader — YouTube, Instagram & FB Free",
  description: "Download YouTube 4K/1080p MaxRes thumbnails, YouTube Community post photos, Instagram 1440x1800 uncropped photos, and Facebook images in full original resolution.",
  keywords: [
    "youtube thumbnail downloader",
    "youtube maxresdefault download",
    "youtube community post downloader",
    "instagram full resolution photo saver",
    "facebook image downloader",
    "extract hd thumbnails free"
  ],
  openGraph: {
    title: "HD Thumbnail & Image Post Downloader — Free",
    description: "Download MaxRes YouTube thumbnails and high-res social media post photos. 100% free.",
    url: "https://yourdomain.com/thumbnail-downloader",
    siteName: "Universal Media Studio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/thumbnail-downloader",
  },
};

export default function ThumbnailDownloaderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "HD Thumbnail & Image Downloader",
    "url": "https://yourdomain.com/thumbnail-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download 4K YouTube thumbnails, Community posts, and Instagram uncropped photos in master quality."
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.75rem", background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          HD Thumbnail & Social Post Image Downloader
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          Extract maximum resolution 4K/1080p YouTube thumbnails (`maxresdefault`), full YouTube Community post images, uncropped Instagram portraits (1440x1800), and Facebook photos with zero compression.
        </p>
      </div>

      <ImageStudio />

      {/* SEO Editorial Guide */}
      <section style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.5rem", color: "#f8fafc" }}>
          How to Download MaxRes Thumbnails & Social Images
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", marginBottom: "0.5rem" }}>1. Copy Media URL</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Copy any YouTube video or Community post URL, Instagram photo post link, or Facebook image link.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", marginBottom: "0.5rem" }}>2. Extract Master Files</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Paste the link above and tap "Inspect Image". Our system bypasses CDN compression and unearths the master uncropped files.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", marginBottom: "0.5rem" }}>3. Instant Save</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Click "Download Full Resolution" or choose 1080p/720p tiers to save directly to your photos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
