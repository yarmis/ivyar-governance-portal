"use client";

import { useState, useEffect } from "react";
import { getScenarios, autopilotRequest, type AutopilotScenario, type AutopilotDecision } from "@/lib/autopilot";

export default function AutopilotPage() {
  const [scenarios, setScenarios] = useState<AutopilotScenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenarios();
  }, []);

  async function loadScenarios() {
    try {
      const data = await getScenarios();
      setScenarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading scenarios...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Autopilot Decision Engine</h1>
      <p>Scenario-based cognitive evaluation</p>
      
      <div style={{ marginTop: "2rem" }}>
        <h3>Available Scenarios:</h3>
        <ul>
          {scenarios.map(s => (
            <li key={s.id}>
              <strong>{s.name}</strong> - {s.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
