"use client";

import { useEffect, useState } from "react";
import { getScenarios, autopilotRequest, type AutopilotScenario, type AutopilotDecision } from "@/lib/autopilot";
import ScenarioSelector from "./ScenarioSelector";
import DynamicForm from "./DynamicForm";
import ResultPanel from "./ResultPanel";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

export default function AutopilotContainer() {
  const [scenarios, setScenarios] = useState<AutopilotScenario[] | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("");
  const [selectedScenario, setSelectedScenario] = useState<AutopilotScenario | null>(null);
  const [decision, setDecision] = useState<AutopilotDecision | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadScenarios() {
      try {
        setInitialLoading(true);
        const data = await getScenarios();
        if (!cancelled) setScenarios(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load scenarios");
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }
    loadScenarios();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!scenarios) return;
    const found = scenarios.find((s) => s.id === selectedScenarioId) || null;
    setSelectedScenario(found);
    setDecision(null);
    setError(null);
  }, [selectedScenarioId, scenarios]);

  async function handleRunAutopilot(input: Record<string, any>) {
    if (!selectedScenarioId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await autopilotRequest({ scenarioId: selectedScenarioId, input });
      setDecision(result);
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {initialLoading && <LoadingState />}
      {!initialLoading && !scenarios && <ErrorState message="No scenarios" />}
      {scenarios && (
        <>
          <ScenarioSelector scenarios={scenarios} selectedScenarioId={selectedScenarioId} onChange={setSelectedScenarioId} />
          {!selectedScenario && <EmptyState />}
          {selectedScenario && <DynamicForm scenario={selectedScenario} onRun={handleRunAutopilot} loading={loading} />}
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {decision && <ResultPanel decision={decision} />}
        </>
      )}
    </div>
  );
}
