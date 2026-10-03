export const metadata = {
  title: "DMCA & Copyright Policy",
  description: "Digital Millennium Copyright Act (DMCA) compliance notice, non-hosting policy, and designated copyright agent information for Universal Media Studio.",
  robots: { index: true, follow: true }
};

export default function DmcaPage() {
  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          DMCA & Copyright Policy
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Digital Millennium Copyright Act Notice & Designated Agent
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", color: "#cbd5e1", lineHeight: 1.7, fontSize: "0.95rem" }}>
          
          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              1. Non-Hosting & Safe Harbor Statement
            </h2>
            <p>
              Universal Media Studio respects the intellectual property rights of creators and copyright holders and adheres to Title 17, United States Code, Section 512(c)(3) of the Digital Millennium Copyright Act ("DMCA").
            </p>
            <div style={{ marginTop: "0.75rem", padding: "1rem", borderRadius: "0.75rem", background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <strong>Notice of Zero-Disk Architecture:</strong> Universal Media Studio does not host, upload, store, transcode on disk, or broadcast any audio, video, or image media. We operate as a technical client-side proxy that establishes an ephemeral streaming tunnel between the end user and public content delivery networks. Because no files reside on our physical or cloud disks, there is no content stored on our servers to delete or remove.
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              2. Submitting a DMCA Notice
            </h2>
            <p>
              If you are a copyright owner or authorized representative and believe that any functionality of this service is being utilized to infringe upon your copyrighted material, you may submit a formal notification to our Designated Copyright Agent containing:
            </p>
            <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginTop: "0.5rem" }}>
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the specific URL on third-party platforms that is the subject of infringing activity.</li>
              <li>Information reasonably sufficient to permit us to contact you (such as your address, telephone number, and email address).</li>
              <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement under penalty of perjury that the information in the notification is accurate.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              3. Designated Copyright Agent Contact
            </h2>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <p style={{ color: "#f8fafc", fontWeight: 600 }}>Universal Media Studio DMCA Compliance Desk</p>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                Email: <span style={{ color: "#60a5fa" }}>dmca@universalmediastudio.com</span>
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Response Time: Valid requests are reviewed and addressed within 24 to 48 business hours.
              </p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
              4. Repeat Infringer Policy
            </h2>
            <p>
              In accordance with the DMCA and other applicable laws, Universal Media Studio reserves the right to block specific domain patterns, IP ranges, or URL parameters associated with accounts that are determined to be repeat infringers of intellectual property rights.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
