"use client";
import { useState } from "react";

export default function PilotLandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      {/* Navigation */}
      <nav style={{ background: "#1B3A5C", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ fontSize: "20px", fontWeight: "700" }}>🛡️ IVYAR</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="#why" style={{ color: "#A8B5C4", textDecoration: "none" }}>Why</a>
          <a href="#features" style={{ color: "#A8B5C4", textDecoration: "none" }}>Features</a>
          <a href="#timeline" style={{ color: "#A8B5C4", textDecoration: "none" }}>Timeline</a>
          <a href="#download" style={{ color: "#A8B5C4", textDecoration: "none" }}>Pilot Kit</a>
        </div>
        <a href="#demo" style={{ background: "#10B9B9", padding: "10px 20px", borderRadius: "6px", color: "white", textDecoration: "none", fontWeight: "600" }}>
          Request Demo
        </a>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "80px 40px", textAlign: "center", background: "linear-gradient(180deg, #1B3A5C 0%, #0D1B2A 100%)" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "700", margin: "0 0 16px" }}>
          IVYAR Pilot Program
        </h1>
        <p style={{ fontSize: "20px", color: "#A8B5C4", margin: "0 0 40px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          Institutional Transparency and Legal Integrity in Claims Processing
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a href="#demo" style={{ background: "#10B9B9", padding: "14px 28px", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: "600" }}>
            Request Demo
          </a>
          <a href="#download" style={{ background: "transparent", border: "1px solid #2D4A6A", padding: "14px 28px", borderRadius: "8px", color: "white", textDecoration: "none" }}>
            Download Pilot Kit
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "60px", marginTop: "60px" }}>
          <div>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: 0, color: "#10B9B9" }}>85%</p>
            <p style={{ color: "#A8B5C4", margin: "4px 0 0" }}>Target SLA Compliance</p>
          </div>
          <div>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: 0, color: "#10B981" }}>&lt;5</p>
            <p style={{ color: "#A8B5C4", margin: "4px 0 0" }}>Days Avg Response</p>
          </div>
          <div>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: 0, color: "#C9A227" }}>100%</p>
            <p style={{ color: "#A8B5C4", margin: "4px 0 0" }}>Timeline Integrity</p>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why" style={{ padding: "80px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "32px", textAlign: "center", marginBottom: "48px" }}>Why the Pilot Matters</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {[
            { icon: "⏳", title: "Claims Stall for Months", desc: "Average workers comp claim takes 6-18 months to resolve" },
            { icon: "👁️", title: "No Visibility", desc: "Workers do not know where their case is stuck" },
            { icon: "⚖️", title: "No Accountability", desc: "Delays go unrecorded and unpunished" },
            { icon: "📄", title: "No Evidence", desc: "Attorneys lack structured evidence for legal proceedings" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
              <span style={{ fontSize: "32px" }}>{item.icon}</span>
              <h3 style={{ margin: "12px 0 8px", fontSize: "18px" }}>{item.title}</h3>
              <p style={{ margin: 0, color: "#A8B5C4" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#10B9B920", border: "1px solid #10B9B9", padding: "24px", borderRadius: "12px", marginTop: "32px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "18px" }}>
            <strong style={{ color: "#10B9B9" }}>IVYAR introduces</strong> a transparent, auditable, legally defensible system for all stakeholders.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 40px", background: "#1B3A5C" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", textAlign: "center", marginBottom: "48px" }}>What is Included in the Pilot</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { icon: "⏱️", title: "SLA Monitoring", desc: "Real-time deadline tracking" },
              { icon: "🚨", title: "Delay Detection", desc: "Automatic breach identification" },
              { icon: "📜", title: "Immutable Timeline", desc: "Tamper-proof event history" },
              { icon: "🔗", title: "Hash Chain", desc: "Cryptographic integrity" },
              { icon: "📧", title: "Notifications", desc: "Email, SMS, Portal alerts" },
              { icon: "📊", title: "Breach Center", desc: "Centralized monitoring" },
              { icon: "📋", title: "Reports", desc: "Delay, Summary, Behavior" },
              { icon: "👤", title: "Client Portal", desc: "Worker transparency" },
              { icon: "⚙️", title: "Admin Dashboard", desc: "Institutional oversight" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0D1B2A", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
                <h4 style={{ margin: "12px 0 4px" }}>{item.title}</h4>
                <p style={{ margin: 0, color: "#A8B5C4", fontSize: "14px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" style={{ padding: "80px 40px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "32px", textAlign: "center", marginBottom: "48px" }}>Pilot Timeline</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[
            { week: "Week 1", title: "Setup and Onboarding", items: ["Data connection", "SLA configuration", "User training"] },
            { week: "Weeks 2-6", title: "Monitoring and Reporting", items: ["SLA tracking active", "Breach detection", "Reports generated"] },
            { week: "Week 7", title: "Evaluation", items: ["Metrics review", "Partner feedback", "Recommendations"] },
          ].map((phase, i) => (
            <div key={i} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <div style={{ background: "#10B9B9", padding: "12px 20px", borderRadius: "8px", minWidth: "100px", textAlign: "center" }}>
                <strong>{phase.week}</strong>
              </div>
              <div style={{ background: "#1B3A5C", padding: "20px", borderRadius: "8px", flex: 1 }}>
                <h4 style={{ margin: "0 0 12px" }}>{phase.title}</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#A8B5C4" }}>
                  {phase.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Metrics */}
      <section style={{ padding: "80px 40px", background: "#1B3A5C" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", textAlign: "center", marginBottom: "48px" }}>Success Metrics</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {[
              { metric: "Delay Reduction", icon: "📉" },
              { metric: "SLA Compliance", icon: "✅" },
              { metric: "Partner Satisfaction", icon: "🤝" },
              { metric: "Worker Transparency", icon: "👁️" },
              { metric: "Response Time", icon: "⚡" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0D1B2A", padding: "24px", borderRadius: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "32px" }}>{item.icon}</span>
                <p style={{ margin: "12px 0 0", fontSize: "14px" }}>{item.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section style={{ padding: "80px 40px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "32px", textAlign: "center", marginBottom: "48px" }}>Who Can Join the Pilot</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
          {[
            { title: "Employers", icon: "🏢" },
            { title: "Attorneys", icon: "⚖️" },
            { title: "TPA", icon: "📋" },
            { title: "Government", icon: "🏛️" },
            { title: "Donors", icon: "💰" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "40px" }}>{item.icon}</span>
              <p style={{ margin: "12px 0 0", fontWeight: "600" }}>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section id="download" style={{ padding: "80px 40px", background: "#1B3A5C" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>Download the Pilot Kit</h2>
          <p style={{ color: "#A8B5C4", marginBottom: "32px" }}>
            Complete package including: Pilot Overview, Compliance Pack, Partner Packs, Agreement, Email Templates
          </p>
          <a href="#" style={{ background: "#10B9B9", padding: "14px 28px", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: "600", display: "inline-block" }}>
            Download Kit
          </a>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" style={{ padding: "80px 40px", background: "#0D1B2A" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>Request a Demo</h2>
          <p style={{ color: "#A8B5C4", marginBottom: "32px" }}>
            See IVYAR in action. Schedule a personalized demo with our team.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ padding: "14px 20px", borderRadius: "8px", border: "1px solid #2D4A6A", background: "#1B3A5C", color: "white", width: "300px" }}
              />
              <button type="submit" style={{ background: "#10B9B9", padding: "14px 28px", borderRadius: "8px", color: "white", border: "none", fontWeight: "600", cursor: "pointer" }}>
                Request Demo
              </button>
            </form>
          ) : (
            <div style={{ background: "#10B98120", border: "1px solid #10B981", padding: "20px", borderRadius: "8px" }}>
              <p style={{ margin: 0, color: "#10B981" }}>Thank you! We will contact you soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px", textAlign: "center", borderTop: "1px solid #2D4A6A" }}>
        <p style={{ color: "#A8B5C4", margin: 0 }}>© 2024-2026 IVYAR. All rights reserved.</p>
      </footer>
    </div>
  );
}
