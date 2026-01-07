// lib/hbs/core/index.ts
// HBS Governance Core - Main Export v1.0

// ============================================================================
// EXPORTS
// ============================================================================

// Decision Tree Engine
export * from './decision-tree';

// Boundaries Engine
export * from './boundaries';

// Risk Engine
export * from './risk-engine';

// Audit Engine
export * from './audit';

// Policies Engine
export * from './policies';

// Tenant Management
export * from './tenant';

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

import { decisionTreeEngine } from './decision-tree';
import { boundariesEngine } from './boundaries';
import { riskEngine } from './risk-engine';
import { auditEngine } from './audit';
import { policyEngine } from './policies';
import { tenantManager } from './tenant';

export const hbsCore = {
  decisionTree: decisionTreeEngine,
  boundaries: boundariesEngine,
  risk: riskEngine,
  audit: auditEngine,
  policies: policyEngine,
  tenants: tenantManager,
};

// ============================================================================
// GOVERNANCE STATE
// ============================================================================

export interface GovernanceState {
  timestamp: string;
  tenantId?: string;
  decisionTree: {
    totalTrees: number;
    totalNodes: number;
    totalDecisions: number;
  };
  boundaries: {
    totalRules: number;
    activeRules: number;
    unresolvedViolations: number;
  };
  risk: {
    totalFactors: number;
    totalAssessments: number;
    averageScore: number;
    criticalCount: number;
  };
  audit: {
    totalEntries: number;
    errorsLast24h: number;
    securityEventsLast24h: number;
  };
  policies: {
    totalPolicies: number;
    activePolicies: number;
    totalRules: number;
  };
  tenants: {
    total: number;
    active: number;
  };
}

export function getGovernanceState(options?: { tenantId?: string }): GovernanceState {
  const decisionStats = decisionTreeEngine.getStats();
  const boundaryStats = boundariesEngine.getStats(options?.tenantId);
  const riskStats = riskEngine.getStats(options?.tenantId);
  const auditStats = auditEngine.getStats(options?.tenantId ? { tenantId: options.tenantId } : undefined);
  const policyStats = policyEngine.getStats();
  const tenantStats = tenantManager.getStats();

  // Calculate 24h metrics
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const recentAudit = auditEngine.query({ from: yesterday }, { limit: 10000 });
  const errorsLast24h = recentAudit.entries.filter(e => e.severity === 'error' || e.severity === 'critical').length;
  const securityEventsLast24h = auditEngine.getSecurityEvents(options?.tenantId, 24).length;

  return {
    timestamp: now.toISOString(),
    tenantId: options?.tenantId,
    decisionTree: {
      totalTrees: decisionStats.totalTrees,
      totalNodes: decisionStats.totalNodes,
      totalDecisions: decisionStats.totalDecisions,
    },
    boundaries: {
      totalRules: boundaryStats.totalRules,
      activeRules: boundaryStats.activeRules,
      unresolvedViolations: boundaryStats.unresolvedViolations,
    },
    risk: {
      totalFactors: riskStats.totalFactors,
      totalAssessments: riskStats.totalAssessments,
      averageScore: riskStats.averageScore,
      criticalCount: riskStats.byLevel.critical || 0,
    },
    audit: {
      totalEntries: auditStats.totalEntries,
      errorsLast24h,
      securityEventsLast24h,
    },
    policies: {
      totalPolicies: policyStats.totalPolicies,
      activePolicies: policyStats.activePolicies,
      totalRules: policyStats.totalRules,
    },
    tenants: {
      total: tenantStats.totalTenants,
      active: tenantStats.activeTenants,
    },
  };
}

// ============================================================================
// MODULE INTEGRATION
// ============================================================================

export interface ModuleContext {
  tenantId: string;
  module: string;
  userId: string;
  userRole: string;
  sessionId?: string;
}

export interface ModuleAction {
  type: string;
  target: string;
  targetType: string;
  data: Record<string, any>;
  riskFactors?: Record<string, number>;
}

export interface ModuleActionResult {
  allowed: boolean;
  decision?: {
    treeId: string;
    nodeId: string;
    outcome: string;
    riskLevel: string;
  };
  boundaries: {
    violations: number;
    warnings: string[];
    requiredApprovals: string[];
  };
  risk?: {
    composite: number;
    level: string;
    alerts: string[];
  };
  policies: {
    matched: number;
    denied: boolean;
    notifications: { role: string; message: string }[];
  };
  auditId: string;
}

export function processModuleAction(
  context: ModuleContext,
  action: ModuleAction
): ModuleActionResult {
  const result: ModuleActionResult = {
    allowed: true,
    boundaries: { violations: 0, warnings: [], requiredApprovals: [] },
    policies: { matched: 0, denied: false, notifications: [] },
    auditId: '',
  };

  // 1. Check boundaries
  const boundaryCheck = boundariesEngine.checkBoundaries({
    tenantId: context.tenantId,
    module: context.module,
    actorId: context.userId,
    actorRole: context.userRole,
    action: action.type,
    data: action.data,
  });

  result.boundaries = {
    violations: boundaryCheck.violations.length,
    warnings: boundaryCheck.warnings,
    requiredApprovals: boundaryCheck.requiredApprovals || [],
  };

  if (!boundaryCheck.allowed) {
    result.allowed = false;
  }

  // 2. Evaluate policies
  const policyResults = policyEngine.evaluate({
    tenantId: context.tenantId,
    module: context.module,
    actorId: context.userId,
    actorRole: context.userRole,
    action: action.type,
    data: action.data,
  });

  for (const policyResult of policyResults) {
    result.policies.matched += policyResult.matchedRules.length;
    if (!policyResult.allowed) {
      result.policies.denied = true;
      result.allowed = false;
    }
    if (policyResult.requiredApprovals) {
      result.boundaries.requiredApprovals.push(...policyResult.requiredApprovals);
    }
    if (policyResult.notifications) {
      result.policies.notifications.push(...policyResult.notifications);
    }
  }

  // 3. Assess risk if factors provided
  if (action.riskFactors && Object.keys(action.riskFactors).length > 0) {
    const riskResult = riskEngine.evaluate({
      tenantId: context.tenantId,
      module: context.module,
      factors: action.riskFactors,
      context: action.data,
    });

    result.risk = {
      composite: riskResult.composite,
      level: riskResult.level,
      alerts: riskResult.alerts,
    };

    // Block if critical risk without approval
    if (riskResult.level === 'critical' && result.boundaries.requiredApprovals.length === 0) {
      result.boundaries.requiredApprovals.push('risk_committee');
    }
  }

  // 4. Log audit entry
  const auditEntry = auditEngine.log({
    tenantId: context.tenantId,
    module: context.module,
    actorId: context.userId,
    actorRole: context.userRole,
    action: action.type as any,
    target: action.target,
    targetType: action.targetType,
    result: result.allowed ? 'success' : 'denied',
    severity: result.allowed ? 'info' : 'warning',
    metadata: {
      boundaryViolations: result.boundaries.violations,
      policiesMatched: result.policies.matched,
      riskLevel: result.risk?.level,
    },
    sessionId: context.sessionId,
  });

  result.auditId = auditEntry.id;

  return result;
}

// ============================================================================
// VERSION INFO
// ============================================================================

export const HBS_CORE_VERSION = {
  version: '1.0.0',
  buildDate: '2026-01-06',
  components: [
    'Decision Tree Engine',
    'Boundaries Engine',
    'Risk Engine',
    'Audit Engine',
    'Policy Engine',
    'Tenant Manager',
  ],
};
