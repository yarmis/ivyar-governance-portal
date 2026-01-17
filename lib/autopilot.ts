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

// Import local scenarios for demo/fallback
import { MODULE_SCENARIOS } from './autopilot/ivyar-autopilot-scenarios';

// Convert MODULE_SCENARIOS to AutopilotScenario format
function getLocalScenarios(): AutopilotScenario[] {
  return Object.entries(MODULE_SCENARIOS).map(([key, scenario]) => ({
    id: key,
    name: scenario.name,
    description: scenario.description,
    category: 'Module Assistant',
    version: '1.0',
    enabled: true,
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Your question or request' }
      }
    }
  }));
}

export async function getScenarios(): Promise<AutopilotScenario[]> {
  try {
    // Try API first
    const res = await fetch(API_BASE + "/scenarios", {
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (!res.ok) {
      throw new Error("API unavailable");
    }
    
    const data = await res.json();
    return data.scenarios || getLocalScenarios();
  } catch (error) {
    // Fallback to local scenarios for demo
    console.log('Using local scenarios (demo mode)');
    return getLocalScenarios();
  }
}

export async function autopilotRequest(payload: AutopilotRequestPayload): Promise<AutopilotDecision> {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      throw new Error("API unavailable");
    }

    const data = await res.json();
    return data.decision;
  } catch (error) {
    // Return mock decision for demo
    const scenario = MODULE_SCENARIOS[payload.scenarioId as keyof typeof MODULE_SCENARIOS];
    return {
      decisionId: `demo-${Date.now()}`,
      scenarioId: payload.scenarioId,
      status: 'review',
      score: 85,
      explanation: `Demo mode: This is a ${scenario?.name || 'scenario'} assistant. In production, this would analyze your request using AI and provide detailed recommendations.`,
      references: ['Demo Mode - Connect to production API for full functionality'],
      createdAt: new Date().toISOString()
    };
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
    return { status: 'demo', message: 'Using local scenarios' };
  }
}
