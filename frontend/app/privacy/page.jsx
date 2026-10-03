export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Universal Media Studio protects user privacy, our zero-disk streaming architecture, and our Google AdSense advertising cookie disclosures.",
  robots: { index: true, follow: true }
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Last updated: October 2026 • Effective Date: Immediate
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", color: "#cbd5e1", lineHeight: 1.7, fontSize: "0.95rem" }}>
          
          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              1. Our Zero-Disk Commitment to Privacy
            </h2>
            <p>
              At <strong>Universal Media Studio</strong> ("we", "our", or "us"), we prioritize user privacy above all else. Unlike traditional media tools that record user browsing histories or store copies of downloaded videos and photos, our service operates entirely on a <strong>zero-disk in-memory streaming architecture</strong>.
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              We do not save, archive, or retain any videos, audio streams, images, or media URLs on our server storage disks. All streaming binaries are transferred in transient volatile memory (RAM) directly between the target public CDN and your client browser, and are immediately discarded upon stream completion.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              2. Information We Do Not Collect
            </h2>
            <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li>We do not require user accounts, passwords, or personal registrations.</li>
              <li>We do not collect names, physical addresses, or phone numbers.</li>
              <li>We do not record the content of the media files you inspect or download.</li>
              <li>We do not correlate download requests with individual user identities.</li>
            </ul>
          </section>

          <section id="cookies">
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              3. Google AdSense & Third-Party Advertising Cookies
            </h2>
            <p>
              To keep Universal Media Studio 100% free and accessible to everyone worldwide, we display non-intrusive advertisements served by <strong>Google AdSense</strong> and authorized advertising partners.
            </p>
            <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginTop: "0.5rem" }}>
              <li>
                <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites on the Internet.
              </li>
              <li>
                <strong>Google Advertising Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                <strong>Opt-Out Choices:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              4. Server Logs & Analytics
            </h2>
            <p>
              Like most web utilities, our web servers collect standard, non-personally identifiable technical information in transient memory for operational reliability and DDoS mitigation. This may include browser user-agent strings, request timestamps, and response status codes. These transient metrics are purged regularly and are never sold or shared with commercial data brokers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              5. GDPR & CCPA Compliance
            </h2>
            <p>
              If you reside in the European Economic Area (EEA), United Kingdom, or California (under the CCPA/CPRA), you have rights regarding your personal data. Because we do not store personal data or maintain user profiles, there is no personal data to access, rectify, or delete. If you have any privacy inquiries, you may reach out to our privacy officer via our contact page.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              6. Changes to this Policy
            </h2>
            <p>
              We reserve the right to update this Privacy Policy to reflect technical, regulatory, or operational improvements. Any modifications will be posted here with an updated effective date.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
