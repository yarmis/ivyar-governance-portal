"use client";

import { useState, useEffect } from "react";
import { getScenarios, autopilotRequest, AutopilotScenario, AutopilotDecision } from "@/lib/autopilot";

export default function AutopilotPage() {
  const [scenarios, setScenarios] = useState<AutopilotScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<AutopilotScenario | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [decision, setDecision] = useState<AutopilotDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  // Load scenarios on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  async function loadScenarios() {
    try {
      const data = await getScenarios();
      setScenarios(data);
    } catch (err: any) {
      setError("Failed to load scenarios");
      console.error(err);
    }
  }

  function handleScenarioChange(scenarioId: string) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    setSelectedScenario(scenario || null);
    setFormData({});
    setDecision(null);
    setError(null);
  }

  function handleInputChange(fieldName: string, value: any) {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  }

  async function handleSubmit() {
    if (!selectedScenario) return;

    setLoading(true);
    setError(null);

    try {
      const result = await autopilotRequest({
        scenarioId: selectedScenario.id,
        input: formData
      });
      setDecision(result);
    } catch (err: any) {
      setError(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setFormData({});
    setDecision(null);
    setError(null);
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          Autopilot Decision Engine
        </h1>
        <p style={{ color: "#666" }}>
          Scenario-based cognitive evaluation
        </p>
      </div>

      {/* Scenario Selector */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem" }}>
          Select Scenario
        </label>
        <select
          value={selectedScenario?.id || ""}
          onChange={(e) => handleScenarioChange(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem"
          }}
        >
          <option value="">-- Choose a scenario --</option>
          {scenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name} ({scenario.category})
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Description */}
      {selectedScenario && (
        <div style={{
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "6px",
          marginBottom: "2rem"
        }}>
          <p style={{ margin: 0 }}>{selectedScenario.description}</p>
        </div>
      )}

      {/* Dynamic Form */}
      {selectedScenario && selectedScenario.inputSchema && (
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Input Data</h3>
          
          {Object.entries(selectedScenario.inputSchema.properties || {}).map(([fieldName, fieldDef]: [string, any]) => (
            <div key={fieldName} style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "500", marginBottom: "0.25rem" }}>
                {fieldName}
                {selectedScenario.inputSchema.required?.includes(fieldName) && (
                  <span style={{ color: "red" }}> *</span>
                )}
              </label>
              
              {fieldDef.description && (
                <p style={{ fontSize: "0.875rem", color: "#666", margin: "0.25rem 0" }}>
                  {fieldDef.description}
                </p>
              )}

              {/* Render appropriate input based on type */}
              {fieldDef.enum ? (
                <select
                  value={formData[fieldName] || ""}
                  onChange={(e) => handleInputChange(fieldName, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                >
                  <option value="">-- Select --</option>
                  {fieldDef.enum.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : fieldDef.type === "number" ? (
                <input
                  type="number"
                  value={formData[fieldName] || ""}
                  onChange={(e) => handleInputChange(fieldName, parseFloat(e.target.value))}
                  min={fieldDef.minimum}
                  max={fieldDef.maximum}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={formData[fieldName] || ""}
                  onChange={(e) => handleInputChange(fieldName, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                background: loading ? "#ccc" : "#0070f3",
                color: "white",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600"
              }}
            >
              {loading ? "Processing..." : "Run Autopilot"}
            </button>
            
            <button
              onClick={handleClear}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                background: "white",
                color: "#333",
                border: "1px solid #ccc",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          padding: "1rem",
          background: "#fee",
          border: "1px solid #fcc",
          borderRadius: "6px",
          color: "#c00",
          marginBottom: "2rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Result Panel */}
      {decision && (
        <div style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "1rem" }}>Decision Result</h3>

          {/* Status Badge */}
          <div style={{ marginBottom: "1rem" }}>
            <span style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              background: 
                decision.status === "approve" ? "#d4edda" :
                decision.status === "review" ? "#fff3cd" : "#f8d7da",
              color:
                decision.status === "approve" ? "#155724" :
                decision.status === "review" ? "#856404" : "#721c24",
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "0.875rem"
            }}>
              {decision.status}
            </span>
          </div>

          {/* Score Bar */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: "600" }}>Confidence Score</span>
              <span style={{ fontWeight: "600" }}>{decision.score}/100</span>
            </div>
            <div style={{
              width: "100%",
              height: "24px",
              background: "#eee",
              borderRadius: "12px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${decision.score}%`,
                height: "100%",
                background: decision.score >= 80 ? "#28a745" :
                           decision.score >= 50 ? "#ffc107" : "#dc3545",
                transition: "width 0.5s"
              }} />
            </div>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Explanation</h4>
            <p style={{ color: "#555", lineHeight: "1.6" }}>
              {decision.explanation}
            </p>
          </div>

          {/* References */}
          {decision.references && decision.references.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>References</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {decision.references.map((ref, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#e9ecef",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      color: "#495057"
                    }}
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* View JSON Button */}
          <button
            onClick={() => setShowJson(!showJson)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              background: "white",
              border: "1px solid #0070f3",
              color: "#0070f3",
              cursor: "pointer"
            }}
          >
            {showJson ? "Hide" : "View"} Full JSON
          </button>

          {/* JSON Modal */}
          {showJson && (
            <pre style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#f5f5f5",
              borderRadius: "6px",
              overflow: "auto",
              fontSize: "0.875rem"
            }}>
              {JSON.stringify(decision, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedScenario && !loading && !error && (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "#999"
        }}>
          <p style={{ fontSize: "1.25rem" }}>Select a scenario to begin</p>
        </div>
      )}
    </div>
  );
}
