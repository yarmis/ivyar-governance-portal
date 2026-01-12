// Types
export interface AutopilotScenario {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  enabled: boolean;
  inputSchema?: any;
}

export interface AutopilotDecision {
  decisionId: string;
  scenarioId: string;
  status: 'approve' | 'review' | 'reject';
  score: number;
  explanation: string;
  references: string[];
  createdAt: string;
}

export interface AutopilotRequestPayload {
  scenarioId: string;
  input: Record<string, any>;
}

const API_BASE = "https://ivyar-api.ivyar-gov.workers.dev/autopilot";

export async function getScenarios(): Promise<AutopilotScenario[]> {
  try {
    const res = await fetch(API_BASE + "/scenarios");
    
    if (!res.ok) {
      throw new Error("Failed to fetch scenarios: " + res.status);
    }
    
    const data = await res.json();
    return data.scenarios || [];
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    throw error;
  }
}

export async function autopilotRequest(payload: AutopilotRequestPayload): Promise<AutopilotDecision> {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Autopilot API error: " + res.status);
    }

    const data = await res.json();
    return data.decision;
  } catch (error) {
    console.error('Error in autopilot request:', error);
    throw error;
  }
}

export async function getDecisionLog(decisionId: string): Promise<any> {
  try {
    const res = await fetch(API_BASE + "/logs/" + decisionId);
    
    if (!res.ok) {
      throw new Error("Failed to fetch decision log: " + res.status);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching decision log:', error);
    throw error;
  }
}

export async function getAutopilotHealth(): Promise<any> {
  try {
    const res = await fetch(API_BASE + "/health");
    return await res.json();
  } catch (error) {
    console.error('Error checking autopilot health:', error);
    throw error;
  }
}
