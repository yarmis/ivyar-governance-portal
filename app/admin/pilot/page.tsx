"use client";
export default function PilotDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>📊 Pilot Program Dashboard</h1>
            <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>Monitor pilot progress</p>
          </div>
          <a href="/admin" style={{ color: "#10B9B9", textDecoration: "none" }}>← Back to Admin</a>
        </div>
      </div>
      <div style={{ padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Active Claims</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0" }}>24</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Total Breaches</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#EF4444" }}>8</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Resolved</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#10B981" }}>5</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0 }}>Days Left</p>
            <p style={{ fontSize: "36px", fontWeight: "700", margin: "8px 0 0", color: "#C9A227" }}>32</p>
          </div>
        </div>
        <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
          <h2 style={{ margin: "0 0 16px" }}>Pilot Timeline</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }}></div>
              <span>Week 1: Setup - Completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B981" }}></div>
              <span>Week 2: Monitoring - Completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10B9B9" }}></div>
              <span>Week 3: Active Tracking - Current</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#2D4A6A" }}></div>
              <span>Week 4-7: Evaluation - Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}