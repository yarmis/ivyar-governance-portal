"use client";

import { type AutopilotDecision } from "@/lib/autopilot";
import JsonModal from "./JsonModal";

interface Props {
  decision: AutopilotDecision;
}

export default function ResultPanel({ decision }: Props) {
  const statusColor = 
    decision.status === "approve" ? "#1a7f37" : 
    decision.status === "review" ? "#b38600" : "#b00020";
  
  return (
    <section style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem", background: "white" }}>
      <h3 style={{ marginBottom: "1rem" }}>Decision Result</h3>
      
      <div style={{ marginBottom: "1rem" }}>
        <span style={{
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          background: statusColor,
          color: "white",
          fontWeight: "600",
          textTransform: "uppercase",
          fontSize: "0.875rem"
        }}>
          {decision.status}
        </span>
      </div>

      {typeof decision.score === "number" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: "600" }}>Confidence Score</span>
            <span style={{ fontWeight: "600" }}>{decision.score}/100</span>
          </div>
          <div style={{ width: "100%", height: "24px", background: "#eee", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{
              width: decision.score + "%",
              height: "100%",
              background: decision.score >= 80 ? "#28a745" : decision.score >= 50 ? "#ffc107" : "#dc3545"
            }} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <h4 style={{ marginBottom: "0.5rem" }}>Explanation</h4>
        <p style={{ color: "#555", lineHeight: "1.6" }}>{decision.explanation}</p>
      </div>

      {decision.references && decision.references.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ marginBottom: "0.5rem" }}>References</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {decision.references.map((ref, idx) => (
              <span key={idx} style={{
                padding: "0.25rem 0.75rem",
                background: "#e9ecef",
                borderRadius: "12px",
                fontSize: "0.875rem"
              }}>
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}

      <JsonModal decision={decision} />
    </section>
  );
}
