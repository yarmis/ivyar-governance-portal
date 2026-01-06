import Link from "next/link";
"use client";
import { useState } from "react";

// Mock breach data
const mockBreaches = [
  {
    id: "breach-001",
    claimId: "SDG-2026-00142",
    actor: "Sedgwick",
    actorType: "tpa",
    delayDays: 18,
    severity: "critical",
    escalationLevel: 2,
    lastNotification: "sent",
    createdAt: "2025-11-07T14:30:00Z",
  },
  {
    id: "breach-002",
    claimId: "SDG-2026-00142",
    actor: "Sedgwick",
    actorType: "tpa",
    delayDays: 14,
    severity: "critical",
    escalationLevel: 1,
    lastNotification: "delivered",
    createdAt: "2025-12-15T10:00:00Z",
  },
  {
    id: "breach-003",
    claimId: "SDG-2026-00144",
    actor: "BuildRight Construction",
    actorType: "employer",
    delayDays: 7,
    severity: "major",
    escalationLevel: 1,
    lastNotification: "sent",
    createdAt: "2026-01-05T09:00:00Z",
  },
  {
    id: "breach-004",
    claimId: "SDG-2026-00145",
    actor: "Sedgwick",
    actorType: "tpa",
    delayDays: 3,
    severity: "minor",
    escalationLevel: 1,
    lastNotification: "pending",
    createdAt: "2026-01-10T16:00:00Z",
  },
];

const severityColors: Record<string, string> = {
  minor: "bg-yellow-100 text-yellow-800",
  major: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function BreachCenterPage() {
  const [selectedBreach, setSelectedBreach] = useState<any>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredBreaches = mockBreaches.filter(
    (b) => filterSeverity === "all" || b.severity === filterSeverity
  );

  const stats = {
    total: mockBreaches.length,
    critical: mockBreaches.filter((b) => b.severity === "critical").length,
    major: mockBreaches.filter((b) => b.severity === "major").length,
    minor: mockBreaches.filter((b) => b.severity === "minor").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", color: "white", fontFamily: "system-ui" }}>
      {/* Header */}
      <div style={{ background: "#1B3A5C", padding: "20px 40px", borderBottom: "1px solid #2D4A6A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>🚨 SLA Breach Center</h1>
            <p style={{ margin: "8px 0 0", color: "#A8B5C4" }}>
              Monitor and escalate SLA breaches across all claims
            </p>
          </div>
          <Link href="/admin" style={{ color: "#10B9B9", textDecoration: "none" }}>
            ← Back to Admin
          </Link>
        </div>
      </div>

      <div style={{ padding: "32px 40px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#1B3A5C", padding: "20px", borderRadius: "12px" }}>
            <p style={{ color: "#A8B5C4", margin: 0, fontSize: "14px" }}>Total Breaches</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0" }}>{stats.total}</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #EF4444" }}>
            <p style={{ color: "#A8B5C4", margin: 0, fontSize: "14px" }}>Critical</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0", color: "#EF4444" }}>{stats.critical}</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #F59E0B" }}>
            <p style={{ color: "#A8B5C4", margin: 0, fontSize: "14px" }}>Major</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0", color: "#F59E0B" }}>{stats.major}</p>
          </div>
          <div style={{ background: "#1B3A5C", padding: "20px", borderRadius: "12px", borderLeft: "4px solid #FCD34D" }}>
            <p style={{ color: "#A8B5C4", margin: 0, fontSize: "14px" }}>Minor</p>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "8px 0 0", color: "#FCD34D" }}>{stats.minor}</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {["all", "critical", "major", "minor"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: filterSeverity === sev ? "#10B9B9" : "#1B3A5C",
                color: "white",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Breach Table */}
        <div style={{ background: "#1B3A5C", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0D1B2A" }}>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Claim</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Actor</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Delay</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Severity</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Escalation</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Notification</th>
                <th style={{ padding: "16px", textAlign: "left", color: "#A8B5C4", fontWeight: "500" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBreaches.map((breach) => (
                <tr key={breach.id} style={{ borderTop: "1px solid #2D4A6A" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{breach.claimId}</td>
                  <td style={{ padding: "16px" }}>
                    <div>{breach.actor}</div>
                    <div style={{ fontSize: "12px", color: "#A8B5C4" }}>{breach.actorType}</div>
                  </td>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{breach.delayDays} days</td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          breach.severity === "critical"
                            ? "#EF444430"
                            : breach.severity === "major"
                            ? "#F59E0B30"
                            : "#FCD34D30",
                        color:
                          breach.severity === "critical"
                            ? "#EF4444"
                            : breach.severity === "major"
                            ? "#F59E0B"
                            : "#FCD34D",
                      }}
                    >
                      {breach.severity.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        background: "#10B9B930",
                        color: "#10B9B9",
                      }}
                    >
                      Level {breach.escalationLevel}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        background:
                          breach.lastNotification === "delivered"
                            ? "#10B98130"
                            : breach.lastNotification === "sent"
                            ? "#3B82F630"
                            : "#6B728030",
                        color:
                          breach.lastNotification === "delivered"
                            ? "#10B981"
                            : breach.lastNotification === "sent"
                            ? "#3B82F6"
                            : "#6B7280",
                      }}
                    >
                      {breach.lastNotification}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <button
                      onClick={() => setSelectedBreach(breach)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#10B9B9",
                        color: "white",
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#2D4A6A",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Escalate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedBreach && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setSelectedBreach(null)}
          >
            <div
              style={{
                background: "#1B3A5C",
                padding: "32px",
                borderRadius: "16px",
                width: "500px",
                maxWidth: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: "0 0 24px" }}>Breach Details</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <p style={{ color: "#A8B5C4", margin: 0, fontSize: "12px" }}>CLAIM ID</p>
                  <p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: "600" }}>{selectedBreach.claimId}</p>
                </div>
                <div>
                  <p style={{ color: "#A8B5C4", margin: 0, fontSize: "12px" }}>RESPONSIBLE ACTOR</p>
                  <p style={{ margin: "4px 0 0" }}>{selectedBreach.actor} ({selectedBreach.actorType})</p>
                </div>
                <div>
                  <p style={{ color: "#A8B5C4", margin: 0, fontSize: "12px" }}>DELAY DURATION</p>
                  <p style={{ margin: "4px 0 0", fontSize: "24px", fontWeight: "700", color: "#EF4444" }}>
                    {selectedBreach.delayDays} days
                  </p>
                </div>
                <div>
                  <p style={{ color: "#A8B5C4", margin: 0, fontSize: "12px" }}>DETECTED</p>
                  <p style={{ margin: "4px 0 0" }}>{new Date(selectedBreach.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#10B9B9",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Send Reminder
                </button>
                <button
                  onClick={() => setSelectedBreach(null)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #2D4A6A",
                    background: "transparent",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}