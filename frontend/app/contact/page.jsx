"use client";
import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "1rem 0" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          Contact Us
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Have a question, feedback, bug report, or DMCA inquiry? Our technical support desk is here to help.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          
          {/* Direct Contact Channels */}
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
              Direct Channels
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", fontWeight: 700, marginBottom: "0.3rem" }}>
                  <Mail size={18} /> General Support & Inquiries
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                  support@universalmediastudio.com
                </p>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#a855f7", fontWeight: 700, marginBottom: "0.3rem" }}>
                  <MessageSquare size={18} /> DMCA & Copyright Legal
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                  dmca@universalmediastudio.com
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>
                ⏱️ Standard response times: Technical inquiries are typically answered within 12–24 hours on business days.
              </div>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>
              Send an Inquiry
            </h2>

            {submitted ? (
              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "0.75rem", padding: "1.5rem", textAlign: "center" }}>
                <CheckCircle2 size={36} style={{ color: "#34d399", margin: "0 auto 0.75rem auto" }} />
                <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem" }}>Message Dispatched</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  Thank you for contacting us. A technical specialist will review your request and reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.6rem",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.6rem",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Subject (e.g. Bug Report, Feature Request, Inquiry)"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.6rem",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details or paste the problematic URL..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.6rem",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      outline: "none",
                      resize: "vertical"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    border: "none",
                    borderRadius: "0.6rem",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
