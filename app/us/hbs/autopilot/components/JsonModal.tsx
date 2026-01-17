"use client";

import { useState } from "react";
import { type AutopilotDecision } from "@/lib/autopilot";

interface Props {
  decision: AutopilotDecision;
}

export default function JsonModal({ decision }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          background: "white",
          border: "1px solid #0070f3",
          color: "#0070f3",
          cursor: "pointer"
        }}
      >
        View Full JSON
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "6px",
          padding: "1.5rem",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, color: "#fff" }}>Autopilot Decision (JSON)</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              background: "#0070f3",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
        <pre style={{
          padding: "1rem",
          background: "#0f172a", color: "#e2e8f0",
          borderRadius: "6px",
          overflow: "auto",
          fontSize: "0.875rem"
        }}>
          {JSON.stringify(decision, null, 2)}
        </pre>
      </div>
    </div>
  );
}
