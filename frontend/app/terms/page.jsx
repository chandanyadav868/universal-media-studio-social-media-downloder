export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions governing the use of Universal Media Studio zero-disk streaming tools.",
  robots: { index: true, follow: true }
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          Terms of Service
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Last updated: October 2026 • Agreement between User and Universal Media Studio
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", color: "#cbd5e1", lineHeight: 1.7, fontSize: "0.95rem" }}>
          
          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong>Universal Media Studio</strong>, you signify that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using this website immediately.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              2. Nature of the Service & Non-Hosting Architecture
            </h2>
            <p>
              Universal Media Studio is a technical utility that facilitates client-initiated data streaming directly from third-party content delivery networks (such as YouTube, Meta, TikTok, and X). We act solely as a zero-disk conduit. Our servers do not host, store, replicate, or index any copyrighted audiovisual files or images.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              3. Permitted Fair Use & User Responsibilities
            </h2>
            <p>
              This service is provided strictly for personal, non-commercial, and fair-use educational or archiving purposes. You agree that:
            </p>
            <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginTop: "0.5rem" }}>
              <li>You will only download or inspect media that you own, have authorized permission to access, or that falls strictly under statutory fair use doctrine.</li>
              <li>You will not use this service to infringe upon the intellectual property, copyright, or trademark rights of any creator, company, or third party.</li>
              <li>You will not automate abuse, launch denial-of-service (DoS) attacks, or attempt to compromise server infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              4. Disclaimer of Warranties
            </h2>
            <p>
              Universal Media Studio is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee continuous, uninterrupted, or error-free operation, as third-party platform protocols frequently change without notice.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              5. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall Universal Media Studio, its operators, or technical contributors be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this service, or for any copyright infringements committed by individual users.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              6. Trademark Disclaimers
            </h2>
            <p>
              YouTube, Instagram, Facebook, TikTok, Twitter/X, Pinterest, Reddit, Threads, and Vimeo are registered trademarks of their respective owners. Universal Media Studio is an independent project and is not affiliated with, sponsored by, or endorsed by any of these social platforms.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
