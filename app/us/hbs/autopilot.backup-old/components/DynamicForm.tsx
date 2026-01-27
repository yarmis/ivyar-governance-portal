"use client";

import { useEffect, useState } from "react";
import { type AutopilotScenario } from "@/lib/autopilot";

interface Props {
  scenario: AutopilotScenario;
  onRun: (input: Record<string, any>) => void;
  loading?: boolean;
}

export default function DynamicForm({ scenario, onRun, loading }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    const props = scenario.inputSchema?.properties || {};
    Object.keys(props).forEach((key) => { initial[key] = ""; });
    setFormData(initial);
    setLocalError(null);
  }, [scenario]);

  function handleChange(key: string, value: any) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const required = scenario.inputSchema?.required || [];
    for (const field of required) {
      const value = formData[field];
      if (value === undefined || value === null || value === "") {
        setLocalError("Please fill all required fields");
        return;
      }
    }
    onRun(formData);
  }

  const properties = scenario.inputSchema?.properties || {};

  return (
    <section>
      <h3 style={{ marginBottom: "1rem" }}>Input Data</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {Object.entries(properties).map(([key, schema]: [string, any]) => {
          const value = formData[key] ?? "";
          const isEnum = Array.isArray(schema.enum);
          const isRequired = scenario.inputSchema?.required?.includes(key);
          
          return (
            <div key={key}>
              <label htmlFor={key} style={{ display: "block", fontWeight: 500, marginBottom: "0.25rem" }}>
                {key} {isRequired && <span style={{ color: "red" }}>*</span>}
              </label>
              {schema.description && (
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.25rem 0" }}>
                  {schema.description}
                </p>
              )}
              {isEnum ? (
                <select
                  id={key}
                  value={String(value)}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={!!loading}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="">Select...</option>
                  {schema.enum.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : schema.type === "number" ? (
                <input
                  id={key}
                  type="number"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value === "" ? "" : Number(e.target.value))}
                  disabled={!!loading}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              ) : (
                <input
                  id={key}
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={!!loading}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              )}
            </div>
          );
        })}
        {localError && (
          <p style={{ color: "#b00020", fontSize: "0.85rem", margin: 0 }}>{localError}</p>
        )}
        <button
          type="submit"
          disabled={!!loading}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: loading ? "#999" : "#0070f3",
            color: "#fff",
            cursor: loading ? "default" : "pointer",
            fontWeight: "600"
          }}
        >
          {loading ? "Processing..." : "Run Autopilot"}
        </button>
      </form>
    </section>
  );
}
