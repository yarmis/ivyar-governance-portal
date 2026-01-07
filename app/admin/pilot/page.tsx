"use client";
import Link from "next/link";

export default function PilotDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>🚀 Pilot Dashboard</h1>
            <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>Pilot program management</p>
          </div>
          <Link href="/admin" style={{ color: "#10B9B9", textDecoration: "none" }}>← Back to Admin</Link>
        </div>
      </div>
      <div style={{ padding: "32px 40px" }}>
        <p>Pilot dashboard content coming soon.</p>
      </div>
    </div>
  );
}
