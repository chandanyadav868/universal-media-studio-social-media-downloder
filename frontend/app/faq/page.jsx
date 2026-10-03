export const metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description: "Common questions about downloading 1080p/4K videos, audio extraction, original photo extraction, zero-disk security, and legality.",
  robots: { index: true, follow: true }
};

export default function FaqPage() {
  const faqs = [
    {
      q: "Why do some other downloaders produce 1080p videos with no sound?",
      a: "Modern streaming platforms (especially YouTube) store video and audio in separate streams for resolutions above 720p (DASH streaming). Standard downloaders only fetch the video track, resulting in a silent file. Universal Media Studio uses a high-performance in-memory engine that merges the progressive video and 320kbps stereo audio tracks in real-time, giving you pristine 1080p/4K video with crystal-clear sound."
    },
    {
      q: "What does 'Zero-Disk Streaming' mean?",
      a: "Most web downloaders first save the video to their server's hard drive or SSD, and then send it to you. This creates serious privacy risks and wears down server storage. Universal Media Studio operates completely in volatile RAM memory (zero disk writes). The bytes stream directly from the public CDN through our node into your browser's download manager with zero persistence."
    },
    {
      q: "How do I extract original full-resolution photos from YouTube Community Posts?",
      a: "Simply copy the YouTube Community Post link (e.g., https://www.youtube.com/post/...) and paste it into our High-Res Image & Post Downloader. Our system extracts the uncompressed original photo asset directly from Google's CDN with the highest available resolution."
    },
    {
      q: "Does this tool work on mobile devices (iOS / Android)?",
      a: "Yes! Universal Media Studio is fully responsive. On iOS (Safari) and Android (Chrome), simply paste the URL, tap your desired quality, and your device will natively save the MP4 video or JPEG image to your Camera Roll or Files app."
    },
    {
      q: "Can I download Instagram Carousels and multi-photo posts?",
      a: "Yes. When you paste an Instagram, YouTube Community, or Twitter post URL containing multiple images, our system detects every photo in the post and provides both individual download buttons and a 1-click 'Download All Images' button."
    },
    {
      q: "Is Universal Media Studio safe and free from malware?",
      a: "100% safe. We never require you to install browser extensions, desktop software, or mobile APKs. Everything runs natively in your browser using standard web protocols. We do not use deceptive popup ads or unauthorized redirects."
    },
    {
      q: "Is downloading videos and photos legal?",
      a: "Downloading content for personal, non-commercial archiving and educational fair use is generally permitted in most jurisdictions. However, you should never redistribute, monetize, or claim ownership of copyrighted content that you do not have permission to use. Please review our Terms of Service for more information."
    }
  ];

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Everything you need to know about formats, audio muxing, photo extraction, and zero-disk safety.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "0.75rem",
                padding: "1.25rem 1.5rem"
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
                {faq.q}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
