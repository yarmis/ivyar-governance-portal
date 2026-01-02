"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      <div style={{ background: "#1B3A5C", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>🛡️ IVYAR Admin</h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setActiveTab("overview")} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: activeTab === "overview" ? "#10B9B9" : "transparent", color: "white", cursor: "pointer" }}>Overview</button>
          <button onClick={() => setActiveTab("claims")} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: activeTab === "claims" ? "#10B9B9" : "transparent", color: "white", cursor: "pointer" }}>Claims</button>
          <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#EF4444", color: "white", cursor: "pointer", marginLeft: "16px" }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <a href="/admin/breaches" style={{ background: "#1B3A5C", padding: "16px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>🚨 Breach Center</a>
          <a href="/admin/pilot" style={{ background: "#1B3A5C", padding: "16px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>📊 Pilot Dashboard</a>
          <a href="/admin/security" style={{ background: "#1B3A5C", padding: "16px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>🔒 Security</a>
        </div><a href="/admin/notifications" style={{ background: "#1B3A5C", padding: "16px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>📧 Notifications</a>

        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <p style={{ color: "#A8B5C4", margin: "0 0 8px" }}>Total Claims</p>
                <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>156</p>
              </div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <p style={{ color: "#A8B5C4", margin: "0 0 8px" }}>Active Breaches</p>
                <p style={{ fontSize: "36px", fontWeight: "700", margin: 0, color: "#EF4444" }}>12</p>
              </div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <p style={{ color: "#A8B5C4", margin: "0 0 8px" }}>Avg Response</p>
                <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>5.2 days</p>
              </div>
              <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
                <p style={{ color: "#A8B5C4", margin: "0 0 8px" }}>Compliance</p>
                <p style={{ fontSize: "36px", fontWeight: "700", margin: 0, color: "#10B981" }}>78%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "claims" && (
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <h2 style={{ margin: "0 0 16px" }}>All Claims</h2>
            <p style={{ color: "#A8B5C4" }}>SDG-2026-00142 - John Williams - Under Review</p>
            <p style={{ color: "#A8B5C4" }}>SDG-2026-00143 - Sarah Chen - Open</p>
          </div>
        )}
      </div>
    </div>
  );
} <a href="/admin/orchestrator" style={{ background: "#1B3A5C", padding: "16px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>🧠 Orchestrator</a>