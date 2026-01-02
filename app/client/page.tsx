"use client";
import { useState } from "react";

const mockClaims: Record<string, any> = {
  "SDG-2026-00142": {
    id: "SDG-2026-00142",
    worker: "John Williams",
    employer: "TechCorp Inc.",
    status: "Under Review",
    stage: "Document Review",
    daysInStage: 14,
    isDelayed: true,
    totalDelayDays: 32,
    responsible: "Sedgwick",
    timeline: [
      { date: "2025-10-15", event: "Claim Filed", actor: "John Williams", isBreach: false },
      { date: "2025-11-07", event: "Initial Response (18 days late)", actor: "Sedgwick", isBreach: true },
      { date: "2025-12-15", event: "Document Review (14 days late)", actor: "Sedgwick", isBreach: true },
      { date: "2026-01-10", event: "Decision Pending", actor: "Sedgwick", isBreach: false },
    ],
    delays: [
      { id: 1, actor: "Sedgwick", days: 18, description: "Initial response missed" },
      { id: 2, actor: "Sedgwick", days: 14, description: "Document review delayed" },
    ]
  }
};

export default function ClientPortal() {
  const [claimNumber, setClaimNumber] = useState("");
  const [claim, setClaim] = useState<any>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("status");

  const search = () => {
    const found = mockClaims[claimNumber.toUpperCase()];
    if (found) {
      setClaim(found);
      setError("");
    } else {
      setError("Not found. Try: SDG-2026-00142");
      setClaim(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", padding: "40px", fontFamily: "system-ui" }}>
      <h1>🛡️ IVYAR Protection</h1>
      <p style={{ color: "#A8B5C4" }}>Where is my case stuck?</p>

      <div style={{ marginTop: "24px", marginBottom: "24px" }}>
        <input
          value={claimNumber}
          onChange={(e) => setClaimNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Enter: SDG-2026-00142"
          style={{ padding: "12px", width: "300px", borderRadius: "8px", border: "none", marginRight: "12px" }}
        />
        <button onClick={search} style={{ padding: "12px 24px", background: "#10B9B9", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>
          Search
        </button>
        {error && <p style={{ color: "#EF4444" }}>{error}</p>}
      </div>

      {claim && (
        <div>
          {claim.isDelayed && (
            <div style={{ background: "#EF444430", borderLeft: "4px solid #EF4444", padding: "16px", marginBottom: "24px", borderRadius: "8px" }}>
              <strong style={{ color: "#EF4444" }}>⚠️ Case Delayed by {claim.totalDelayDays} days</strong>
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <button onClick={() => setTab("status")} style={{ padding: "10px 20px", marginRight: "8px", background: tab === "status" ? "#10B9B9" : "#1B3A5C", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>Status</button>
            <button onClick={() => setTab("timeline")} style={{ padding: "10px 20px", marginRight: "8px", background: tab === "timeline" ? "#10B9B9" : "#1B3A5C", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>Timeline</button>
            <button onClick={() => setTab("delays")} style={{ padding: "10px 20px", background: tab === "delays" ? "#10B9B9" : "#1B3A5C", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>Delays</button>
          </div>

          {tab === "status" && (
            <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
              <p><strong>Claim:</strong> {claim.id}</p>
              <p><strong>Worker:</strong> {claim.worker}</p>
              <p><strong>Status:</strong> {claim.status}</p>
              <p><strong>Stage:</strong> {claim.stage}</p>
              <p><strong>Days in Stage:</strong> {claim.daysInStage}</p>
              <p><strong>Responsible:</strong> {claim.responsible}</p>
            </div>
          )}

          {tab === "timeline" && (
            <div style={{ background: "#1B3A5C", padding: "24px", borderRadius: "12px" }}>
              {claim.timeline.map((t: any, i: number) => (
                <div key={i} style={{ marginBottom: "16px", paddingLeft: "16px", borderLeft: t.isBreach ? "3px solid #EF4444" : "3px solid #10B981" }}>
                  <p style={{ margin: 0, color: "#A8B5C4", fontSize: "12px" }}>{t.date}</p>
                  <p style={{ margin: "4px 0", color: t.isBreach ? "#EF4444" : "white" }}>{t.event}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>By: {t.actor}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "delays" && (
            <div>
              <div style={{ background: "#EF444430", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "16px" }}>
                <p style={{ fontSize: "48px", margin: 0, color: "#EF4444", fontWeight: "bold" }}>{claim.totalDelayDays}</p>
                <p style={{ color: "#A8B5C4" }}>Total Days Delayed</p>
              </div>
              {claim.delays.map((d: any) => (
                <div key={d.id} style={{ background: "#1B3A5C", padding: "16px", marginBottom: "12px", borderRadius: "8px", borderLeft: "4px solid #EF4444" }}>
                  <strong>{d.actor}</strong>
                  <p style={{ color: "#A8B5C4", margin: "8px 0" }}>{d.description}</p>
                  <p style={{ color: "#EF4444" }}>{d.days} days overdue</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}