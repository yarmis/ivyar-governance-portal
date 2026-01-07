// lib/hbs/core/boundaries.ts
// HBS Governance Core - Boundaries Engine v1.0

// ============================================================================
// TYPES
// ============================================================================

export type BoundaryCategory = 
  | 'ethical'
  | 'professional'
  | 'access'
  | 'data'
  | 'operational'
  | 'legal'
  | 'financial'
  | 'communication';

export type BoundarySeverity = 'advisory' | 'mandatory' | 'critical' | 'absolute';

export type ViolationStatus = 'detected' | 'investigating' | 'confirmed' | 'resolved' | 'escalated';

export interface BoundaryRule {
  id: string;
  name: string;
  category: BoundaryCategory;
  severity: BoundarySeverity;
  description: string;
  module: string | '*';
  tenantId?: string;
  conditions: BoundaryCondition[];
  actions: BoundaryAction[];
  exceptions?: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'active' | 'draft' | 'deprecated';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoundaryCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in' | 'between';
  value: any;
  logic?: 'and' | 'or';
}

export interface BoundaryAction {
  type: 'block' | 'warn' | 'log' | 'notify' | 'escalate' | 'require_approval';
  target?: string;
  message?: string;
  notifyRoles?: string[];
}

export interface BoundaryViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  category: BoundaryCategory;
  severity: BoundarySeverity;
  tenantId: string;
  module: string;
  actorId: string;
  actorRole: string;
  action: string;
  context: Record<string, any>;
  status: ViolationStatus;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

export interface BoundaryCheckResult {
  allowed: boolean;
  violations: BoundaryViolation[];
  warnings: string[];
  requiredApprovals?: string[];
}

// ============================================================================
// CORE ENGINE
// ============================================================================

export class BoundariesEngine {
  private rules: Map<string, BoundaryRule> = new Map();
  private violations: BoundaryViolation[] = [];

  // Register a boundary rule
  registerRule(rule: BoundaryRule): void {
    this.rules.set(rule.id, rule);
  }

  // Get rule by ID
  getRule(ruleId: string): BoundaryRule | undefined {
    return this.rules.get(ruleId);
  }

  // Get rules by category
  getRulesByCategory(category: BoundaryCategory): BoundaryRule[] {
    return Array.from(this.rules.values()).filter(r => r.category === category && r.status === 'active');
  }

  // Get rules by module
  getRulesByModule(module: string): BoundaryRule[] {
    return Array.from(this.rules.values()).filter(
      r => (r.module === module || r.module === '*') && r.status === 'active'
    );
  }

  // Check boundaries for an action
  checkBoundaries(context: {
    tenantId: string;
    module: string;
    actorId: string;
    actorRole: string;
    action: string;
    data: Record<string, any>;
  }): BoundaryCheckResult {
    const result: BoundaryCheckResult = {
      allowed: true,
      violations: [],
      warnings: [],
      requiredApprovals: [],
    };

    const applicableRules = this.getRulesByModule(context.module);

    for (const rule of applicableRules) {
      // Check if rule applies to this tenant
      if (rule.tenantId && rule.tenantId !== context.tenantId) continue;

      // Check conditions
      const conditionsMet = this.evaluateConditions(rule.conditions, context.data);

      if (conditionsMet) {
        // Create violation
        const violation: BoundaryViolation = {
          id: `VIO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          tenantId: context.tenantId,
          module: context.module,
          actorId: context.actorId,
          actorRole: context.actorRole,
          action: context.action,
          context: context.data,
          status: 'detected',
          detectedAt: new Date().toISOString(),
        };

        // Process actions
        for (const action of rule.actions) {
          switch (action.type) {
            case 'block':
              result.allowed = false;
              result.violations.push(violation);
              this.violations.push(violation);
              break;
            case 'warn':
              result.warnings.push(action.message || `Warning: ${rule.name}`);
              break;
            case 'log':
              // Just log, don't block
              this.violations.push({ ...violation, status: 'resolved', resolution: 'logged_only' });
              break;
            case 'require_approval':
              result.requiredApprovals?.push(action.target || 'supervisor');
              if (!result.requiredApprovals?.length) {
                result.allowed = false;
              }
              break;
            case 'escalate':
              violation.status = 'escalated';
              result.violations.push(violation);
              this.violations.push(violation);
              break;
          }
        }

        // Absolute severity always blocks
        if (rule.severity === 'absolute') {
          result.allowed = false;
        }
      }
    }

    return result;
  }

  // Evaluate conditions
  private evaluateConditions(conditions: BoundaryCondition[], data: Record<string, any>): boolean {
    if (conditions.length === 0) return false;

    let result = true;
    let currentLogic: 'and' | 'or' = 'and';

    for (const condition of conditions) {
      const fieldValue = this.getNestedValue(data, condition.field);
      const conditionResult = this.evaluateCondition(condition, fieldValue);

      if (currentLogic === 'and') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      currentLogic = condition.logic || 'and';
    }

    return result;
  }

  private evaluateCondition(condition: BoundaryCondition, value: any): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'contains':
        return String(value).includes(condition.value);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      case 'between':
        return Array.isArray(condition.value) && value >= condition.value[0] && value <= condition.value[1];
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  // Get violations
  getViolations(filters?: {
    tenantId?: string;
    module?: string;
    category?: BoundaryCategory;
    severity?: BoundarySeverity;
    status?: ViolationStatus;
    from?: string;
    to?: string;
  }): BoundaryViolation[] {
    let results = [...this.violations];

    if (filters?.tenantId) results = results.filter(v => v.tenantId === filters.tenantId);
    if (filters?.module) results = results.filter(v => v.module === filters.module);
    if (filters?.category) results = results.filter(v => v.category === filters.category);
    if (filters?.severity) results = results.filter(v => v.severity === filters.severity);
    if (filters?.status) results = results.filter(v => v.status === filters.status);
    if (filters?.from) results = results.filter(v => v.detectedAt >= filters.from!);
    if (filters?.to) results = results.filter(v => v.detectedAt <= filters.to!);

    return results.sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
  }

  // Resolve violation
  resolveViolation(violationId: string, resolution: string, resolvedBy: string): BoundaryViolation | null {
    const violation = this.violations.find(v => v.id === violationId);
    if (!violation) return null;

    violation.status = 'resolved';
    violation.resolution = resolution;
    violation.resolvedBy = resolvedBy;
    violation.resolvedAt = new Date().toISOString();

    return violation;
  }

  // Get statistics
  getStats(tenantId?: string): {
    totalRules: number;
    activeRules: number;
    totalViolations: number;
    unresolvedViolations: number;
    violationsByCategory: Record<string, number>;
    violationsBySeverity: Record<string, number>;
  } {
    const rules = Array.from(this.rules.values());
    const violations = tenantId 
      ? this.violations.filter(v => v.tenantId === tenantId)
      : this.violations;

    const violationsByCategory: Record<string, number> = {};
    const violationsBySeverity: Record<string, number> = {};

    for (const v of violations) {
      violationsByCategory[v.category] = (violationsByCategory[v.category] || 0) + 1;
      violationsBySeverity[v.severity] = (violationsBySeverity[v.severity] || 0) + 1;
    }

    return {
      totalRules: rules.length,
      activeRules: rules.filter(r => r.status === 'active').length,
      totalViolations: violations.length,
      unresolvedViolations: violations.filter(v => v.status !== 'resolved').length,
      violationsByCategory,
      violationsBySeverity,
    };
  }
}

// ============================================================================
// DEFAULT RULES
// ============================================================================

export const DEFAULT_BOUNDARY_RULES: BoundaryRule[] = [
  // Access Boundaries
  {
    id: 'BND-ACC-001',
    name: 'Role Level Access Restriction',
    category: 'access',
    severity: 'absolute',
    description: 'Users cannot access resources above their role level',
    module: '*',
    conditions: [
      { field: 'requiredLevel', operator: 'greater_than', value: 0 },
      { field: 'userLevel', operator: 'less_than', value: 'requiredLevel' },
    ],
    actions: [
      { type: 'block', message: 'Access denied: insufficient role level' },
      { type: 'log' },
    ],
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'BND-ACC-002',
    name: 'Cross-Tenant Access Prevention',
    category: 'access',
    severity: 'absolute',
    description: 'Users cannot access data from other tenants',
    module: '*',
    conditions: [
      { field: 'targetTenantId', operator: 'not_equals', value: 'userTenantId' },
    ],
    actions: [
      { type: 'block', message: 'Access denied: cross-tenant access not allowed' },
      { type: 'escalate' },
    ],
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Ethical Boundaries
  {
    id: 'BND-ETH-001',
    name: 'Conflict of Interest Declaration',
    category: 'ethical',
    severity: 'mandatory',
    description: 'Decisions involving potential conflicts require declaration',
    module: '*',
    conditions: [
      { field: 'decisionType', operator: 'in', value: ['approval', 'assignment', 'procurement'] },
      { field: 'conflictDeclared', operator: 'equals', value: false },
    ],
    actions: [
      { type: 'require_approval', target: 'ethics_officer', message: 'Conflict declaration required' },
      { type: 'warn', message: 'Please declare any potential conflicts of interest' },
    ],
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Data Boundaries
  {
    id: 'BND-DAT-001',
    name: 'PII Export Restriction',
    category: 'data',
    severity: 'critical',
    description: 'Bulk PII export requires approval',
    module: '*',
    conditions: [
      { field: 'action', operator: 'equals', value: 'export' },
      { field: 'containsPII', operator: 'equals', value: true },
      { field: 'recordCount', operator: 'greater_than', value: 100 },
    ],
    actions: [
      { type: 'require_approval', target: 'data_protection_officer' },
      { type: 'log' },
      { type: 'notify', notifyRoles: ['security_admin'] },
    ],
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Financial Boundaries
  {
    id: 'BND-FIN-001',
    name: 'High Value Transaction Approval',
    category: 'financial',
    severity: 'critical',
    description: 'Transactions above threshold require dual approval',
    module: '*',
    conditions: [
      { field: 'transactionAmount', operator: 'greater_than', value: 10000 },
    ],
    actions: [
      { type: 'require_approval', target: 'finance_director' },
      { type: 'log' },
    ],
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Operational Boundaries
  {
    id: 'BND-OPS-001',
    name: 'After-Hours System Changes',
    category: 'operational',
    severity: 'mandatory',
    description: 'System changes outside business hours require approval',
    module: '*',
    conditions: [
      { field: 'action', operator: 'in', value: ['deploy', 'update', 'delete', 'modify_config'] },
      { field: 'isBusinessHours', operator: 'equals', value: false },
    ],
    actions: [
      { type: 'require_approval', target: 'on_call_admin' },
      { type: 'notify', notifyRoles: ['security_admin', 'operations_lead'] },
    ],
    status: 'active',
    effectiveFrom: '2024-01-01',
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const boundariesEngine = new BoundariesEngine();

// Register default rules
DEFAULT_BOUNDARY_RULES.forEach(rule => boundariesEngine.registerRule(rule));
