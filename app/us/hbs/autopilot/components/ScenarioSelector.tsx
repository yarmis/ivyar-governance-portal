"use client";

import { type AutopilotScenario } from "@/lib/autopilot";

interface Props {
  scenarios: AutopilotScenario[];
  selectedScenarioId: string;
  onChange: (id: string) => void;
}

export default function ScenarioSelector({ scenarios, selectedScenarioId, onChange }: Props) {
  return (
    <section>
      <label htmlFor="scenario" style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
        Select Scenario
      </label>
      <select
        id="scenario"
        value={selectedScenarioId}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "0.75rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          minWidth: "320px",
          fontSize: "1rem"
        }}
      >
        <option value="">Choose a scenario...</option>
        {scenarios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} {s.category ? `(${s.category})` : ""}
          </option>
        ))}
      </select>
    </section>
  );
}
