"use client";
import Link from "next/link";
export default function SecurityCenter() {
  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>🔒 Security Center</h1>
            <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>Login audit and security alerts</p>
          </div>
          <Link href="/admin" style={{ color: "#10B9B9", textDecoration: "none" }}>← Back to Admin</Link>
        </div>
      </div>
      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Total Logins</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0" }}>142</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Failed Logins</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#EF4444" }}>7</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Open Alerts</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#F59E0B" }}>3</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Critical</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#DC2626" }}>1</p>
          </div>
        </div>
        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 16px" }}>Recent Security Alerts</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#0D1B2A", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
              <span>FAILED_LOGIN_BURST - 192.168.1.100</span>
              <span style={{ color: "#EF4444" }}>High</span>
            </div>
            <div style={{ background: "#0D1B2A", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
              <span>NEW_ADMIN_IP - 10.0.0.50</span>
              <span style={{ color: "#F59E0B" }}>Medium</span>
            </div>
          </div>
        </div>
        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
          <h2 style={{ margin: "0 0 16px" }}>Recent Login Activity</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #2D4A6A" }}>
              <span>admin@ivyar.org</span>
              <span style={{ color: "#10B981" }}>Success</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #2D4A6A" }}>
              <span>unknown@test.com</span>
              <span style={{ color: "#EF4444" }}>Failed</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
              <span>employer@ivyar.org</span>
              <span style={{ color: "#10B981" }}>Success</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}