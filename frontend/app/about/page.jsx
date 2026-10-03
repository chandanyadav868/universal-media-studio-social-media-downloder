export const metadata = {
  title: "About Us",
  description: "Learn about the mission, engineering, and zero-disk streaming technology behind Universal Media Studio.",
  robots: { index: true, follow: true }
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          About Universal Media Studio
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Engineering the next generation of zero-disk cloud media delivery.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", color: "#cbd5e1", lineHeight: 1.7, fontSize: "0.95rem" }}>
          
          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              Our Mission
            </h2>
            <p>
              Universal Media Studio was founded with a singular objective: <strong>to make media extraction fast, transparent, and completely free of invasive bloatware, spyware, and file storage vulnerabilities.</strong>
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Traditional media downloaders force users through unsafe third-party redirects, save copies of user downloads on untrusted servers, and produce muted or downscaled 1080p videos. We engineered a completely different approach based on high-performance Linux memory pipelines.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              What Makes Our Technology Unique?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ background: "rgba(15, 23, 42, 0.7)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <h3 style={{ color: "#60a5fa", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                  1. Zero-Disk In-Memory Pipes
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  Your files are never written to any server hard drive or SSD. Chunks stream via volatile RAM directly to your browser download manager.
                </p>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.7)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <h3 style={{ color: "#34d399", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                  2. True 1080p Muxed Audio
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  YouTube separates high-definition video and audio tracks. Our engine muxes them in real-time on-the-fly without losing quality.
                </p>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.7)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <h3 style={{ color: "#c084fc", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                  3. Original Camera Quality
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                  For YouTube Community Posts, Instagram, and X.com photos, we bypass compression tokens and deliver the exact uncompressed source asset.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              Our Values
            </h2>
            <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li><strong>Zero Subscriptions:</strong> Free for everyone with no hidden paywalls.</li>
              <li><strong>Privacy by Architecture:</strong> We don't store your files because our servers are physically programmed not to write them to disk.</li>
              <li><strong>Clean Web Standards:</strong> Transparent AdSense monetization with zero deceptive download buttons or malicious popups.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
