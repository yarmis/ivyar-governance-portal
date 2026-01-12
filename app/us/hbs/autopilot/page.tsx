"use client";

import AutopilotContainer from "./components/AutopilotContainer";

export default function AutopilotPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
          Autopilot Decision Engine
        </h1>
        <p style={{ margin: "0.5rem 0", color: "#666" }}>
          Scenario-based cognitive evaluation
        </p>
      </header>
      
      <AutopilotContainer />
    </div>
  );
}
