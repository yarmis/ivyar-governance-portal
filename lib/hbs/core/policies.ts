// lib/hbs/core/policies.ts
// HBS Governance Core - Policy Engine v1.0

// ============================================================================
// TYPES
// ============================================================================

export type PolicyStatus = 'draft' | 'active' | 'deprecated' | 'archived';

export type PolicyType = 
  | 'access'
  | 'security'
  | 'data'
  | 'ethical'
  | 'operational'
  | 'compliance'
  | 'financial'
  | 'escalation';

export type RuleAction = 
  | 'allow'
  | 'deny'
  | 'require_mfa'
  | 'require_approval'
  | 'dual_approval'
  | 'log'
  | 'alert'
  | 'escalate'
  | 'notify';

export type RuleSeverity = 'info' | 'warning' | 'critical' | 'mandatory';

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  condition: string; // Expression to evaluate
  action: RuleAction;
  severity: RuleSeverity;
  target?: string;
  message?: string;
  notifyRoles?: string[];
  metadata?: Record<string, any>;
}

export interface Policy {
  id: string;
  name: string;
  fullName: string;
  type: PolicyType;
  version: string;
  status: PolicyStatus;
  module: string | '*';
  tenantId?: string;
  description: string;
  purpose: string;
  scope: string;
  rules: PolicyRule[];
  exceptions?: PolicyException[];
  references?: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  lastReview?: string;
  nextReview?: string;
  owner: string;
  approver?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyException {
  id: string;
  ruleId: string;
  description: string;
  condition: string;
  approvedBy: string;
  approvedAt: string;
  expiresAt?: string;
}

export interface PolicyEvaluationResult {
  policyId: string;
  allowed: boolean;
  matchedRules: {
    ruleId: string;
    ruleName: string;
    action: RuleAction;
    severity: RuleSeverity;
    message?: string;
  }[];
  requiredApprovals?: string[];
  notifications?: { role: string; message: string }[];
}

export interface PolicyVersion {
  policyId: string;
  version: string;
  changes: string;
  changedBy: string;
  changedAt: string;
  previousVersion?: string;
  policy: Policy;
}

// ============================================================================
// CORE ENGINE
// ============================================================================

export class PolicyEngine {
  private policies: Map<string, Policy> = new Map();
  private versions: PolicyVersion[] = [];

  // Register a policy
  registerPolicy(policy: Policy): void {
    this.policies.set(policy.id, policy);
  }

  // Get policy by ID
  getPolicy(policyId: string): Policy | undefined {
    return this.policies.get(policyId);
  }

  // Get policies by type
  getPoliciesByType(type: PolicyType): Policy[] {
    return Array.from(this.policies.values()).filter(
      p => p.type === type && p.status === 'active'
    );
  }

  // Get policies by module
  getPoliciesByModule(module: string): Policy[] {
    return Array.from(this.policies.values()).filter(
      p => (p.module === module || p.module === '*') && p.status === 'active'
    );
  }

  // Get policies for tenant
  getPoliciesForTenant(tenantId: string, module?: string): Policy[] {
    return Array.from(this.policies.values()).filter(p => {
      if (p.status !== 'active') return false;
      if (p.tenantId && p.tenantId !== tenantId) return false;
      if (module && p.module !== '*' && p.module !== module) return false;
      return true;
    });
  }

  // Evaluate policies for an action
  evaluate(context: {
    tenantId: string;
    module: string;
    actorId: string;
    actorRole: string;
    action: string;
    data: Record<string, any>;
  }): PolicyEvaluationResult[] {
    const results: PolicyEvaluationResult[] = [];
    const applicablePolicies = this.getPoliciesForTenant(context.tenantId, context.module);

    for (const policy of applicablePolicies) {
      const result: PolicyEvaluationResult = {
        policyId: policy.id,
        allowed: true,
        matchedRules: [],
        requiredApprovals: [],
        notifications: [],
      };

      for (const rule of policy.rules) {
        // Check if rule condition matches
        const conditionMet = this.evaluateCondition(rule.condition, {
          ...context.data,
          actorRole: context.actorRole,
          action: context.action,
        });

        if (conditionMet) {
          // Check for exceptions
          const hasException = policy.exceptions?.some(
            ex => ex.ruleId === rule.id && this.evaluateCondition(ex.condition, context.data)
          );

          if (!hasException) {
            result.matchedRules.push({
              ruleId: rule.id,
              ruleName: rule.name,
              action: rule.action,
              severity: rule.severity,
              message: rule.message,
            });

            // Process action
            switch (rule.action) {
              case 'deny':
                result.allowed = false;
                break;
              case 'require_approval':
              case 'dual_approval':
                result.requiredApprovals?.push(rule.target || 'supervisor');
                break;
              case 'require_mfa':
                result.requiredApprovals?.push('mfa');
                break;
              case 'notify':
              case 'alert':
                if (rule.notifyRoles) {
                  rule.notifyRoles.forEach(role => {
                    result.notifications?.push({
                      role,
                      message: rule.message || `Policy ${policy.name}: ${rule.name}`,
                    });
                  });
                }
                break;
            }
          }
        }
      }

      if (result.matchedRules.length > 0) {
        results.push(result);
      }
    }

    return results;
  }

  // Simple condition evaluator
  private evaluateCondition(condition: string, context: Record<string, any>): boolean {
    // Simple expression evaluator
    // In production, use a proper expression parser
    try {
      // Replace variables in condition
      let expr = condition;
      for (const [key, value] of Object.entries(context)) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (typeof value === 'string') {
          expr = expr.replace(regex, `"${value}"`);
        } else if (typeof value === 'boolean' || typeof value === 'number') {
          expr = expr.replace(regex, String(value));
        } else if (Array.isArray(value)) {
          expr = expr.replace(regex, JSON.stringify(value));
        }
      }

      // Very basic evaluation - in production use safe expression parser
      // This is simplified for demo purposes
      if (expr.includes('===')) {
        const [left, right] = expr.split('===').map(s => s.trim());
        return left === right;
      }
      if (expr.includes('!==')) {
        const [left, right] = expr.split('!==').map(s => s.trim());
        return left !== right;
      }
      if (expr.includes('>=')) {
        const [left, right] = expr.split('>=').map(s => parseFloat(s.trim()));
        return left >= right;
      }
      if (expr.includes('<=')) {
        const [left, right] = expr.split('<=').map(s => parseFloat(s.trim()));
        return left <= right;
      }
      if (expr.includes('>')) {
        const [left, right] = expr.split('>').map(s => parseFloat(s.trim()));
        return left > right;
      }
      if (expr.includes('<')) {
        const [left, right] = expr.split('<').map(s => parseFloat(s.trim()));
        return left < right;
      }

      return false;
    } catch {
      return false;
    }
  }

  // Update policy
  updatePolicy(policyId: string, updates: Partial<Policy>, changedBy: string): Policy | null {
    const existing = this.policies.get(policyId);
    if (!existing) return null;

    // Create version record
    const version: PolicyVersion = {
      policyId,
      version: existing.version,
      changes: JSON.stringify(updates),
      changedBy,
      changedAt: new Date().toISOString(),
      previousVersion: existing.version,
      policy: { ...existing },
    };
    this.versions.push(version);

    // Update policy
    const updated: Policy = {
      ...existing,
      ...updates,
      version: this.incrementVersion(existing.version),
      updatedAt: new Date().toISOString(),
    };
    this.policies.set(policyId, updated);

    return updated;
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number);
    parts[parts.length - 1]++;
    return parts.join('.');
  }

  // Get policy versions
  getPolicyVersions(policyId: string): PolicyVersion[] {
    return this.versions
      .filter(v => v.policyId === policyId)
      .sort((a, b) => b.changedAt.localeCompare(a.changedAt));
  }

  // Get all policies
  getAllPolicies(filters?: {
    status?: PolicyStatus;
    type?: PolicyType;
    module?: string;
  }): Policy[] {
    let policies = Array.from(this.policies.values());

    if (filters?.status) policies = policies.filter(p => p.status === filters.status);
    if (filters?.type) policies = policies.filter(p => p.type === filters.type);
    if (filters?.module) policies = policies.filter(p => p.module === filters.module || p.module === '*');

    return policies;
  }

  // Get statistics
  getStats(): {
    totalPolicies: number;
    activePolicies: number;
    totalRules: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  } {
    const policies = Array.from(this.policies.values());
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalRules = 0;

    for (const policy of policies) {
      byType[policy.type] = (byType[policy.type] || 0) + 1;
      byStatus[policy.status] = (byStatus[policy.status] || 0) + 1;
      totalRules += policy.rules.length;
    }

    return {
      totalPolicies: policies.length,
      activePolicies: policies.filter(p => p.status === 'active').length,
      totalRules,
      byType,
      byStatus,
    };
  }
}

// ============================================================================
// DEFAULT POLICIES
// ============================================================================

export const DEFAULT_POLICIES: Policy[] = [
  {
    id: 'POL-ACC-001',
    name: 'Access Control Policy',
    fullName: 'HBS Universal Access Control Policy',
    type: 'access',
    version: '1.0',
    status: 'active',
    module: '*',
    description: 'Universal access control rules for all modules',
    purpose: 'Ensure proper access control across all HBS modules',
    scope: 'All users, all modules, all tenants',
    rules: [
      {
        id: 'ACC-R001',
        name: 'Role-Based Access Only',
        description: 'All access must be through assigned roles',
        condition: 'directPermission === true',
        action: 'deny',
        severity: 'mandatory',
        message: 'Direct permissions not allowed. Use roles.',
      },
      {
        id: 'ACC-R002',
        name: 'Admin Actions Require MFA',
        description: 'Administrative actions require MFA',
        condition: 'isAdminAction === true',
        action: 'require_mfa',
        severity: 'mandatory',
        message: 'Please verify with MFA',
      },
    ],
    effectiveFrom: '2024-01-01',
    owner: 'security_admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'POL-SEC-001',
    name: 'Security Policy',
    fullName: 'HBS Security Operations Policy',
    type: 'security',
    version: '1.0',
    status: 'active',
    module: '*',
    description: 'Security requirements for all operations',
    purpose: 'Maintain security posture across all modules',
    scope: 'All security-sensitive operations',
    rules: [
      {
        id: 'SEC-R001',
        name: 'High-Risk Actions Logging',
        description: 'All high-risk actions must be logged',
        condition: 'riskLevel >= 7',
        action: 'log',
        severity: 'mandatory',
      },
      {
        id: 'SEC-R002',
        name: 'Critical Changes Notification',
        description: 'Notify security team on critical changes',
        condition: 'severity === "critical"',
        action: 'notify',
        severity: 'mandatory',
        notifyRoles: ['security_admin'],
      },
      {
        id: 'SEC-R003',
        name: 'Suspicious Activity Escalation',
        description: 'Escalate suspicious patterns',
        condition: 'suspiciousActivity === true',
        action: 'escalate',
        severity: 'critical',
        notifyRoles: ['security_admin', 'super_admin'],
      },
    ],
    effectiveFrom: '2024-01-01',
    owner: 'security_admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'POL-DAT-001',
    name: 'Data Protection Policy',
    fullName: 'HBS Data Protection & Privacy Policy',
    type: 'data',
    version: '1.0',
    status: 'active',
    module: '*',
    description: 'Data protection and privacy requirements',
    purpose: 'Ensure GDPR and data protection compliance',
    scope: 'All data processing operations',
    rules: [
      {
        id: 'DAT-R001',
        name: 'PII Access Logging',
        description: 'All PII access must be logged',
        condition: 'containsPII === true',
        action: 'log',
        severity: 'mandatory',
      },
      {
        id: 'DAT-R002',
        name: 'Bulk Export Approval',
        description: 'Bulk data exports require approval',
        condition: 'recordCount > 1000',
        action: 'require_approval',
        severity: 'critical',
        target: 'data_protection_officer',
      },
    ],
    effectiveFrom: '2024-01-01',
    owner: 'data_protection_officer',
    references: ['GDPR Article 32', 'ISO 27001'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'POL-ESC-001',
    name: 'Escalation Policy',
    fullName: 'HBS Incident Escalation Policy',
    type: 'escalation',
    version: '1.0',
    status: 'active',
    module: '*',
    description: 'Escalation procedures for incidents',
    purpose: 'Ensure proper escalation of critical issues',
    scope: 'All incidents and violations',
    rules: [
      {
        id: 'ESC-R001',
        name: 'Critical Incident Notification',
        description: 'Immediate notification for critical incidents',
        condition: 'incidentSeverity === "critical"',
        action: 'alert',
        severity: 'critical',
        notifyRoles: ['security_admin', 'breaches_admin', 'super_admin'],
      },
      {
        id: 'ESC-R002',
        name: 'Dual Approval for Security Changes',
        description: 'Security module changes need dual approval',
        condition: 'module === "security"',
        action: 'dual_approval',
        severity: 'mandatory',
      },
    ],
    effectiveFrom: '2024-01-01',
    owner: 'breaches_admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const policyEngine = new PolicyEngine();

// Register default policies
DEFAULT_POLICIES.forEach(policy => policyEngine.registerPolicy(policy));
