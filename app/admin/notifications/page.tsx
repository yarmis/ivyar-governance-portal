"use client";
import Link from "next/link";
import { useState } from "react";

export default function NotificationsPage() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("sla_breach_attorney");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "single",
          to: email,
          type,
          emailData: {
            claimId: "SDG-2026-00142",
            actor: "Sedgwick",
            delayDays: 18,
            severity: "critical",
            portalUrl: "http://localhost:3000",
            name: "Test User",
            email: email,
            role: "Admin",
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Email sent successfully!");
      } else {
        setStatus("❌ Error: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setStatus("❌ Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>📧 Email Notifications</h1>
            <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>Send test emails</p>
          </div>
          <Link href="/admin" style={{ color: "#10B9B9", textDecoration: "none" }}>← Back to Admin</Link>
        </div>
      </div>

      <div style={{ padding: "32px 40px", maxWidth: "600px" }}>
        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
          <h2 style={{ margin: "0 0 20px" }}>Send Test Email</h2>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px" }}>Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#0D1B2A", color: "white", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px" }}>Email Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#0D1B2A", color: "white" }}
            >
              <option value="sla_breach_attorney">SLA Breach (Attorney)</option>
              <option value="sla_breach_client">SLA Breach (Client)</option>
              <option value="sla_breach_employer">SLA Breach (Employer)</option>
              <option value="escalation_level2">Escalation Level 2</option>
              <option value="escalation_level3">Escalation Level 3 (Critical)</option>
              <option value="welcome">Welcome Email</option>
              <option value="pilot_invitation">Pilot Invitation</option>
            </select>
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !email}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#2D4A6A" : "#10B9B9",
              color: "white",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Test Email"}
          </button>

          {status && (
            <div style={{ marginTop: "16px", padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              {status}
            </div>
          )}
        </div>

        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginTop: "24px" }}>
          <h2 style={{ margin: "0 0 16px" }}>Email Templates</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <strong>SLA Breach (Attorney)</strong> — Formal notification with case details
            </div>
            <div style={{ padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <strong>SLA Breach (Client)</strong> — Friendly update for workers
            </div>
            <div style={{ padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <strong>SLA Breach (Employer)</strong> — Compliance alert
            </div>
            <div style={{ padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <strong>Escalation Level 2</strong> — 24+ hours warning
            </div>
            <div style={{ padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <strong>Escalation Level 3</strong> — Critical 72+ hours alert
            </div>
          </div>
        </div>

        <div style={{ background: "#FEF3C7", padding: "16px", borderRadius: "8px", marginTop: "24px", color: "#92400E" }}>
          <p style={{ margin: 0 }}><strong>⚠️ Setup Required:</strong></p>
          <p style={{ margin: "8px 0 0" }}>Add RESEND_API_KEY to your .env.local file:</p>
          <code style={{ display: "block", marginTop: "8px", background: "#FDE68A", padding: "8px", borderRadius: "4px" }}>
            RESEND_API_KEY=re_xxxxxxxxxxxxx
          </code>
        </div>
      </div>
    </div>
  );
}
