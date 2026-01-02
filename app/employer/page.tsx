"use client";
export default function EmployerDashboard() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      <div style={{ background: "#1B3A5C", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>🏢 Employer Dashboard</h1>
          <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>TechCorp Inc. — Claims Overview</p>
        </div>
        <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#EF4444", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>Sign Out</button>
      </div>
      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Total Claims</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0" }}>24</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Active</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#10B9B9" }}>8</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Resolved</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#10B981" }}>16</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Avg Resolution</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0" }}>45 days</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>SLA Compliance</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0", color: "#10B981" }}>78%</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Active Breaches</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0", color: "#EF4444" }}>3</p>
          </div>
        </div>
        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
          <h2 style={{ margin: "0 0 16px" }}>TPA Performance (Sedgwick)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <span>Initial Response</span><span style={{ color: "#EF4444" }}>4.2 days (Target: 3)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <span>Document Review</span><span style={{ color: "#10B981" }}>8.5 days (Target: 10)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#0D1B2A", borderRadius: "8px" }}>
              <span>Claim Decision</span><span style={{ color: "#10B981" }}>12.3 days (Target: 14)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}