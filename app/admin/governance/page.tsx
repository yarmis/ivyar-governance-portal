"use client";
import { useState } from "react";

type Section = 
  | "overview"
  | "access"
  | "security"
  | "compliance"
  | "notifications"
  | "sla"
  | "data"
  | "reporting"
  | "pilot"
  | "architecture"
  | "api"
  | "policies";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "🏛️" },
  { id: "access", label: "Access Control", icon: "🔐" },
  { id: "security", label: "Security & Audit", icon: "🛡️" },
  { id: "compliance", label: "Compliance", icon: "✅" },
  { id: "notifications", label: "Notifications", icon: "📧" },
  { id: "sla", label: "SLA Governance", icon: "⏱️" },
  { id: "data", label: "Data Integrity", icon: "🔒" },
  { id: "reporting", label: "Reporting", icon: "📊" },
  { id: "pilot", label: "Pilot Program", icon: "🚀" },
  { id: "architecture", label: "Architecture", icon: "🏗️" },
  { id: "api", label: "API Documentation", icon: "🔌" },
  { id: "policies", label: "Policies", icon: "📜" },
];

export default function GovernancePortal() {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      {/* Sidebar */}
      <div style={{ width: "280px", background: "#0A1628", borderRight: "1px solid #1B3A5C", padding: "20px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid #1B3A5C" }}>
          <h1 style={{ margin: 0, fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            🏛️ Governance Portal
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#A8B5C4" }}>Institutional Framework</p>
        </div>
        <nav style={{ padding: "16px 0" }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "none",
                background: activeSection === section.id ? "#1B3A5C" : "transparent",
                color: activeSection === section.id ? "#10B9B9" : "#A8B5C4",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                borderLeft: activeSection === section.id ? "3px solid #10B9B9" : "3px solid transparent",
              }}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "20px", borderTop: "1px solid #1B3A5C", marginTop: "auto" }}>
          <a href="/admin" style={{ color: "#A8B5C4", textDecoration: "none", fontSize: "14px" }}>← Back to Admin</a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>{sections.find(s => s.id === activeSection)?.icon}</span>
            <div>
              <h2 style={{ margin: 0 }}>{sections.find(s => s.id === activeSection)?.label}</h2>
              <p style={{ margin: "4px 0 0", color: "#A8B5C4", fontSize: "14px" }}>IVYAR Institutional Governance Framework</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "32px 40px" }}>
          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Executive Summary</h3>
                <p style={{ margin: 0, lineHeight: 1.8, color: "#E6E6E6" }}>
                  The IVYAR Governance Portal defines the institutional governance framework that ensures 
                  transparency, accountability, security, and compliance across all operational layers of 
                  the IVYAR Platform. It serves as the authoritative reference for partners, auditors, 
                  employers, attorneys, and internal teams.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                {[
                  { title: "Access Control", desc: "RBAC, roles, route protection", icon: "🔐" },
                  { title: "Security Layer", desc: "Audit, alerts, monitoring", icon: "🛡️" },
                  { title: "Compliance", desc: "SOC2, ISO27001, NIST, GDPR", icon: "✅" },
                  { title: "Notifications", desc: "Delivery rules, escalation", icon: "📧" },
                  { title: "SLA Governance", desc: "Breach detection, reporting", icon: "⏱️" },
                  { title: "Data Integrity", desc: "Immutable logs, retention", icon: "🔒" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#1B3A5C", padding: "20px", borderRadius: "8px" }}>
                    <span style={{ fontSize: "24px" }}>{item.icon}</span>
                    <h4 style={{ margin: "12px 0 8px" }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#A8B5C4" }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Governance Principles</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {["Transparency", "Accountability", "Auditability", "Security by Design", "Compliance Readiness", "Institutional Trust"].map((p, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "12px 16px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#10B9B9" }}>✓</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACCESS CONTROL */}
          {activeSection === "access" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>1. Roles & Access Levels</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #2D4A6A" }}>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Role</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Category</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "client", cat: "Worker", desc: "Access to personal case and timeline" },
                      { role: "attorney", cat: "Legal", desc: "Access to client case as legal representative" },
                      { role: "employer", cat: "Employer", desc: "Access to employer dashboards and reporting" },
                      { role: "admin", cat: "Institutional", desc: "Full governance, audit, and system control" },
                    ].map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #2D4A6A" }}>
                        <td style={{ padding: "12px" }}><code style={{ background: "#0D1B2A", padding: "4px 8px", borderRadius: "4px" }}>{r.role}</code></td>
                        <td style={{ padding: "12px" }}>{r.cat}</td>
                        <td style={{ padding: "12px", color: "#A8B5C4" }}>{r.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>2. Route Access Matrix</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #2D4A6A" }}>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Route</th>
                      <th style={{ textAlign: "center", padding: "12px", color: "#A8B5C4" }}>Client</th>
                      <th style={{ textAlign: "center", padding: "12px", color: "#A8B5C4" }}>Attorney</th>
                      <th style={{ textAlign: "center", padding: "12px", color: "#A8B5C4" }}>Employer</th>
                      <th style={{ textAlign: "center", padding: "12px", color: "#A8B5C4" }}>Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { route: "/login", c: true, a: true, e: true, ad: true },
                      { route: "/client/*", c: true, a: true, e: false, ad: true },
                      { route: "/employer/*", c: false, a: false, e: true, ad: true },
                      { route: "/admin/*", c: false, a: false, e: false, ad: true },
                      { route: "/admin/governance", c: false, a: false, e: false, ad: true },
                      { route: "/admin/security", c: false, a: false, e: false, ad: true },
                    ].map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #2D4A6A" }}>
                        <td style={{ padding: "12px" }}><code>{r.route}</code></td>
                        <td style={{ padding: "12px", textAlign: "center", color: r.c ? "#10B981" : "#EF4444" }}>{r.c ? "✔" : "✖"}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: r.a ? "#10B981" : "#EF4444" }}>{r.a ? "✔" : "✖"}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: r.e ? "#10B981" : "#EF4444" }}>{r.e ? "✔" : "✖"}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: r.ad ? "#10B981" : "#EF4444" }}>{r.ad ? "✔" : "✖"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>3. Authorization Rules</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { portal: "Client Portal", rule: "role ∈ {client, attorney, admin}" },
                    { portal: "Employer Portal", rule: "role ∈ {employer, admin}" },
                    { portal: "Admin Portal", rule: "role === admin" },
                  ].map((r, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ margin: "0 0 8px", fontWeight: "600" }}>{r.portal}</p>
                      <code style={{ color: "#10B9B9" }}>{r.rule}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY & AUDIT */}
          {activeSection === "security" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>1. Login Audit</h3>
                <p style={{ margin: "0 0 16px", color: "#A8B5C4" }}>All login attempts are recorded with the following fields:</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {["email", "user_id", "success/failure", "ip_address", "user_agent", "timestamp"].map((f, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "12px", borderRadius: "6px", fontFamily: "monospace" }}>{f}</div>
                  ))}
                </div>
                <div style={{ marginTop: "16px", padding: "12px", background: "#10B9B920", borderRadius: "8px", borderLeft: "4px solid #10B9B9" }}>
                  <strong>Retention:</strong> Minimum 3 years • <strong>Access:</strong> Admin only • <strong>Immutable:</strong> Yes
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>2. Security Alerts</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #2D4A6A" }}>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Alert Type</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Trigger</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "FAILED_LOGIN_BURST", trigger: ">5 failures in 10 minutes", sev: "High", color: "#EF4444" },
                      { type: "NEW_ADMIN_IP", trigger: "Admin login from new IP", sev: "Medium", color: "#F59E0B" },
                      { type: "MULTI_ACCOUNT_IP", trigger: "Multiple accounts from same IP", sev: "Medium", color: "#F59E0B" },
                      { type: "GEO_ANOMALY", trigger: "Login from unusual location", sev: "High", color: "#EF4444" },
                    ].map((a, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #2D4A6A" }}>
                        <td style={{ padding: "12px" }}><code>{a.type}</code></td>
                        <td style={{ padding: "12px", color: "#A8B5C4" }}>{a.trigger}</td>
                        <td style={{ padding: "12px" }}><span style={{ background: `${a.color}20`, color: a.color, padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>{a.sev}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>3. Security Center Components</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {[
                    { name: "Alerts Dashboard", desc: "Real-time security alerts view" },
                    { name: "Login Heatmap", desc: "Behavioral pattern visualization" },
                    { name: "IP Risk Profiles", desc: "IP classification and risk scoring" },
                    { name: "User Login History", desc: "Per-user login audit trail" },
                    { name: "Export Tools", desc: "CSV, JSON, PDF export" },
                    { name: "Incident Response", desc: "Alert lifecycle management" },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "600" }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#A8B5C4" }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COMPLIANCE */}
          {activeSection === "compliance" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Compliance Standards</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  {[
                    { name: "SOC2", color: "#3B82F6" },
                    { name: "ISO27001", color: "#10B981" },
                    { name: "NIST", color: "#F59E0B" },
                    { name: "GDPR", color: "#8B5CF6" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "24px", borderRadius: "8px", textAlign: "center", borderTop: `4px solid ${s.color}` }}>
                      <p style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>{s.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Compliance Mapping</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #2D4A6A" }}>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Standard</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Controls</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>IVYAR Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { std: "SOC2", ctrl: "CC6.1, CC6.2, CC7.2", cov: "RBAC, Audit, Monitoring" },
                      { std: "ISO27001", ctrl: "A.9.1, A.9.2, A.12.4", cov: "Access Control, Logging" },
                      { std: "NIST", ctrl: "AC-2, AC-3, AC-7", cov: "Account Management, Access" },
                      { std: "GDPR", ctrl: "Art. 30", cov: "Records of Processing" },
                    ].map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #2D4A6A" }}>
                        <td style={{ padding: "12px", fontWeight: "600" }}>{r.std}</td>
                        <td style={{ padding: "12px" }}><code>{r.ctrl}</code></td>
                        <td style={{ padding: "12px", color: "#A8B5C4" }}>{r.cov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Evidence Requirements</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {["Audit Logs", "Access Logs", "Security Alerts", "SLA Reports", "User Activity", "Change History"].map((e, i) => (
                    <span key={i} style={{ background: "#0D1B2A", padding: "8px 16px", borderRadius: "20px", fontSize: "14px" }}>{e}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Notification Types</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {[
                    { type: "System", desc: "Platform alerts and updates" },
                    { type: "SLA Breach", desc: "Deadline violations" },
                    { type: "Security", desc: "Login alerts, anomalies" },
                    { type: "Employer", desc: "Worker updates, reports" },
                    { type: "Attorney", desc: "Case updates, filings" },
                    { type: "Escalation", desc: "Critical breach alerts" },
                  ].map((n, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "600" }}>{n.type}</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#A8B5C4" }}>{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Delivery Channels</h3>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { ch: "Email", icon: "📧" },
                    { ch: "In-App", icon: "🔔" },
                    { ch: "SMS", icon: "📱" },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, background: "#0D1B2A", padding: "24px", borderRadius: "8px", textAlign: "center" }}>
                      <span style={{ fontSize: "32px" }}>{c.icon}</span>
                      <p style={{ margin: "12px 0 0", fontWeight: "600" }}>{c.ch}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Escalation Rules</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { level: "Level 1", time: "0-24 hours", action: "Email attorney, portal notification" },
                    { level: "Level 2", time: "24-72 hours", action: "Email employer + TPA, timeline event" },
                    { level: "Level 3", time: "72+ hours", action: "Critical report, email all parties" },
                  ].map((l, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ background: i === 2 ? "#EF4444" : i === 1 ? "#F59E0B" : "#10B9B9", padding: "8px 12px", borderRadius: "6px", fontWeight: "600" }}>{l.level}</span>
                      <span style={{ color: "#A8B5C4" }}>{l.time}</span>
                      <span style={{ flex: 1 }}>{l.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLA GOVERNANCE */}
          {activeSection === "sla" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>SLA Types</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #2D4A6A" }}>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>SLA Rule</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Actor</th>
                      <th style={{ textAlign: "left", padding: "12px", color: "#A8B5C4" }}>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rule: "Initial Response", actor: "TPA", deadline: "3 business days" },
                      { rule: "Document Review", actor: "TPA", deadline: "10 business days" },
                      { rule: "Claim Decision", actor: "TPA", deadline: "14 business days" },
                      { rule: "Employer Response", actor: "Employer", deadline: "7 business days" },
                      { rule: "Attorney Filing", actor: "Attorney", deadline: "30 days" },
                    ].map((s, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #2D4A6A" }}>
                        <td style={{ padding: "12px" }}>{s.rule}</td>
                        <td style={{ padding: "12px" }}><code>{s.actor}</code></td>
                        <td style={{ padding: "12px", color: "#A8B5C4" }}>{s.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Breach Center</h3>
                <p style={{ margin: "0 0 16px", color: "#A8B5C4" }}>The SLA Breach Center provides:</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {["Breach Detection", "Severity Classification", "Actor Attribution", "Timeline Recording", "Escalation Triggers", "Reporting"].map((f, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "12px 16px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#10B9B9" }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DATA INTEGRITY */}
          {activeSection === "data" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Immutable Logs</h3>
                <p style={{ margin: "0 0 16px", color: "#A8B5C4" }}>The following logs are immutable and cannot be modified or deleted:</p>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["Login Audit", "Security Alerts", "Notification Log", "SLA Breaches", "Timeline Events"].map((l, i) => (
                    <span key={i} style={{ background: "#0D1B2A", padding: "12px 20px", borderRadius: "8px", border: "1px solid #10B9B9" }}>{l}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Data Retention</h3>
                <div style={{ background: "#0D1B2A", padding: "20px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span>Audit Logs</span>
                    <strong>3 years minimum</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span>Security Alerts</span>
                    <strong>3 years minimum</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Case Data</span>
                    <strong>7 years minimum</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Tamper-Proofing</h3>
                <p style={{ margin: 0, color: "#A8B5C4" }}>
                  Optional hash chain implementation for cryptographic integrity verification. 
                  Each audit entry can be linked to the previous entry via SHA-256 hash, 
                  ensuring any modification is detectable.
                </p>
              </div>
            </div>
          )}

          {/* REPORTING */}
          {activeSection === "reporting" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", marginBottom: "24px" }}>
                <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Security Reports</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {["Security Alerts Report", "Login Audit Summary", "IP Risk Analysis", "Incident Report"].map((r, i) => (
                      <div key={i} style={{ background: "#0D1B2A", padding: "12px", borderRadius: "6px" }}>{r}</div>
                    ))}
                  </div>
                </div>
                <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Operational Reports</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {["SLA Compliance Report", "Notification Summary", "Employer Dashboard", "Case Timeline"].map((r, i) => (
                      <div key={i} style={{ background: "#0D1B2A", padding: "12px", borderRadius: "6px" }}>{r}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Export Formats</h3>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { fmt: "CSV", desc: "Spreadsheet compatible" },
                    { fmt: "JSON", desc: "API integration" },
                    { fmt: "PDF", desc: "Official documents" },
                  ].map((f, i) => (
                    <div key={i} style={{ flex: 1, background: "#0D1B2A", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "700", color: "#10B9B9" }}>{f.fmt}</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#A8B5C4" }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PILOT PROGRAM */}
          {activeSection === "pilot" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Pilot Objectives</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {["Transparency", "Accountability", "SLA Enforcement", "Security Monitoring", "Reporting", "Partner Onboarding"].map((o, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                      <span style={{ color: "#10B9B9" }}>✓</span> {o}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Partner Packs</h3>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { type: "Employer", color: "#3B82F6" },
                    { type: "Attorney", color: "#10B981" },
                    { type: "TPA", color: "#F59E0B" },
                  ].map((p, i) => (
                    <div key={i} style={{ flex: 1, background: "#0D1B2A", padding: "24px", borderRadius: "8px", textAlign: "center", borderTop: `4px solid ${p.color}` }}>
                      <p style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>{p.type} Pack</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Pilot Dashboard Metrics</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  {[
                    { metric: "SLA Compliance", value: "78%" },
                    { metric: "Active Claims", value: "24" },
                    { metric: "Breaches", value: "8" },
                    { metric: "Resolved", value: "5" },
                  ].map((m, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: "700" }}>{m.value}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#A8B5C4" }}>{m.metric}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ARCHITECTURE */}
          {activeSection === "architecture" && (
            <div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 20px", color: "#10B9B9" }}>High-Level Architecture</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "#0D1B2A", borderRadius: "8px" }}>
                  {["Frontend", "API", "Database", "Audit", "Security"].map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ background: "#10B9B920", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontWeight: "600" }}>{c}</p>
                      </div>
                      {i < 4 && <span style={{ color: "#10B9B9", fontSize: "20px" }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Data Flow</h3>
                <div style={{ background: "#0D1B2A", padding: "20px", borderRadius: "8px", fontFamily: "monospace", textAlign: "center" }}>
                  User → Auth → Portal → API → Database → Audit → Dashboard
                </div>
              </div>

              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>Technology Stack</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {[
                    { layer: "Frontend", tech: "Next.js 16, React, TypeScript" },
                    { layer: "Backend", tech: "API Routes, Node.js" },
                    { layer: "Database", tech: "PostgreSQL (planned)" },
                    { layer: "Auth", tech: "JWT, HttpOnly Cookies" },
                    { layer: "Email", tech: "Resend API" },
                    { layer: "Deploy", tech: "Vercel (planned)" },
                  ].map((t, i) => (
                    <div key={i} style={{ background: "#0D1B2A", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ margin: "0 0 4px", fontWeight: "600", color: "#10B9B9" }}>{t.layer}</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#A8B5C4" }}>{t.tech}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API DOCUMENTATION */}
          {activeSection === "api" && (
            <div>
              {[
                { cat: "Authentication", endpoints: ["/api/auth/login", "/api/auth/logout", "/api/auth/me"] },
                { cat: "Admin", endpoints: ["/api/orchestrator", "/api/notifications/send"] },
                { cat: "Protection", endpoints: ["/api/protection/claims", "/api/protection/sla/rules", "/api/protection/delays"] },
              ].map((c, i) => (
                <div key={i} style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 16px", color: "#10B9B9" }}>{c.cat} APIs</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {c.endpoints.map((e, j) => (
                      <div key={j} style={{ background: "#0D1B2A", padding: "12px", borderRadius: "6px", fontFamily: "monospace" }}>
                        <span style={{ color: "#10B981", marginRight: "12px" }}>GET/POST</span>
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* POLICIES */}
          {activeSection === "policies" && (
            <div>
              {[
                { name: "Access Control Policy", desc: "RBAC enforced at middleware. Admin-only user creation. Immutable audit logs." },
                { name: "Security Monitoring Policy", desc: "Alerts generated automatically. Admin review required. Critical alerts escalated." },
                { name: "Data Integrity Policy", desc: "No deletion of audit logs. No modification of access records. 3-year minimum retention." },
                { name: "Incident Response Policy", desc: "Identify → Classify → Contain → Document → Report → Remediate" },
                { name: "Change Management Policy", desc: "All changes require governance approval. Semantic versioning. Structured release notes." },
              ].map((p, i) => (
                <div key={i} style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "16px" }}>
                  <h3 style={{ margin: "0 0 12px" }}>{p.name}</h3>
                  <p style={{ margin: 0, color: "#A8B5C4" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
