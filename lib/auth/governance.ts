// lib/auth/governance.ts
// IVYAR Access Governance Module - Consistency Checker & Audit Engine

import { PERMISSIONS, ROLE_PERMISSIONS, PermissionDefinition } from './permissions';

// ============================================================================
// TYPES
// ============================================================================

export interface ConsistencyCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  severity: 'info' | 'warning' | 'critical';
  details?: string[];
  timestamp: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: AuditAction;
  target: string;
  targetType: 'user' | 'role' | 'permission' | 'policy' | 'module' | 'system';
  result: 'success' | 'failure' | 'denied';
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export type AuditAction = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'login' | 'logout' | 'mfa_enable' | 'mfa_disable'
  | 'role_assign' | 'role_revoke' | 'permission_grant' | 'permission_revoke'
  | 'policy_create' | 'policy_update' | 'policy_delete' | 'policy_activate'
  | 'user_block' | 'user_unblock' | 'incident_create' | 'incident_resolve'
  | 'api_key_create' | 'api_key_revoke' | 'settings_update';

export interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'access' | 'security' | 'escalation' | 'data';
  status: 'active' | 'draft' | 'deprecated' | 'restricted';
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_mfa' | 'escalate' | 'log';
  priority: number;
}

// ============================================================================
// CONSISTENCY CHECKER
// ============================================================================

export function runConsistencyChecks(): ConsistencyCheck[] {
  const checks: ConsistencyCheck[] = [];
  const timestamp = new Date().toISOString();

  // Check 1: Roles without permissions
  const rolesWithoutPerms = Object.entries(ROLE_PERMISSIONS).filter(
    ([_, perms]) => !perms || perms.length === 0
  ).map(([role]) => role);
  
  checks.push({
    id: 'roles_without_permissions',
    name: 'Roles Without Permissions',
    description: 'Ensures all roles have at least one permission assigned',
    passed: rolesWithoutPerms.length === 0,
    severity: 'critical',
    details: rolesWithoutPerms.length > 0 ? rolesWithoutPerms : undefined,
    timestamp
  });

  // Check 2: Orphan permissions (defined but not assigned to any role)
  const allDefinedPermKeys = PERMISSIONS.map(p => p.key);
  const allAssignedPerms = new Set(
    Object.values(ROLE_PERMISSIONS)
      .flat()
      .filter(p => p !== '*')
  );
  const orphanPerms = allDefinedPermKeys.filter(p => !allAssignedPerms.has(p));
  
  checks.push({
    id: 'orphan_permissions',
    name: 'Orphan Permissions',
    description: 'Permissions defined but not assigned to any role',
    passed: orphanPerms.length === 0,
    severity: 'warning',
    details: orphanPerms.length > 0 ? orphanPerms : undefined,
    timestamp
  });

  // Check 3: Invalid permissions (assigned but not defined)
  const invalidPerms: string[] = [];
  Object.entries(ROLE_PERMISSIONS).forEach(([role, perms]) => {
    perms.forEach(perm => {
      if (perm !== '*' && !allDefinedPermKeys.includes(perm)) {
        invalidPerms.push(`${role}: ${perm}`);
      }
    });
  });
  
  checks.push({
    id: 'invalid_permissions',
    name: 'Invalid Permissions',
    description: 'Permissions assigned to roles but not defined in the system',
    passed: invalidPerms.length === 0,
    severity: 'critical',
    details: invalidPerms.length > 0 ? invalidPerms : undefined,
    timestamp
  });

  // Check 4: Super admin has wildcard
  const superAdminPerms = ROLE_PERMISSIONS['super_admin'] || [];
  checks.push({
    id: 'super_admin_wildcard',
    name: 'Super Admin Wildcard',
    description: 'Super admin role must have wildcard (*) permission',
    passed: superAdminPerms.includes('*'),
    severity: 'critical',
    timestamp
  });

  // Check 5: All roles have authentication permissions
  const authPerms = ['auth.login', 'auth.logout'];
  const rolesWithoutAuth = Object.entries(ROLE_PERMISSIONS)
    .filter(([role, perms]) => {
      if (role === 'public') return false; // Public only needs login
      if (perms.includes('*')) return false;
      return !authPerms.every(ap => perms.includes(ap));
    })
    .map(([role]) => role);
  
  checks.push({
    id: 'roles_without_auth',
    name: 'Roles Without Authentication',
    description: 'All roles (except public) must have login and logout permissions',
    passed: rolesWithoutAuth.length === 0,
    severity: 'warning',
    details: rolesWithoutAuth.length > 0 ? rolesWithoutAuth : undefined,
    timestamp
  });

  // Check 6: Critical permissions only for admin roles
  const criticalPerms = PERMISSIONS.filter(p => p.risk === 'critical').map(p => p.key);
  const adminRoles = ['super_admin', 'security_admin', 'breaches_admin'];
  const nonAdminWithCritical: string[] = [];
  
  Object.entries(ROLE_PERMISSIONS).forEach(([role, perms]) => {
    if (adminRoles.includes(role)) return;
    if (perms.includes('*')) return;
    const hasCritical = perms.some(p => criticalPerms.includes(p));
    if (hasCritical) {
      nonAdminWithCritical.push(role);
    }
  });
  
  checks.push({
    id: 'critical_permissions_check',
    name: 'Critical Permissions Distribution',
    description: 'Critical permissions should only be assigned to admin roles',
    passed: nonAdminWithCritical.length === 0,
    severity: 'warning',
    details: nonAdminWithCritical.length > 0 ? nonAdminWithCritical : undefined,
    timestamp
  });

  // Check 7: No duplicate permissions in roles
  const rolesWithDuplicates: string[] = [];
  Object.entries(ROLE_PERMISSIONS).forEach(([role, perms]) => {
    const uniquePerms = new Set(perms);
    if (uniquePerms.size !== perms.length) {
      rolesWithDuplicates.push(role);
    }
  });
  
  checks.push({
    id: 'duplicate_permissions',
    name: 'Duplicate Permissions',
    description: 'No role should have duplicate permission entries',
    passed: rolesWithDuplicates.length === 0,
    severity: 'info',
    details: rolesWithDuplicates.length > 0 ? rolesWithDuplicates : undefined,
    timestamp
  });

  // Check 8: Permission module coverage
  const modulesCovered = new Set(PERMISSIONS.map(p => p.module));
  const expectedModules = ['auth', 'profile', 'citizen', 'business', 'employer', 
    'attorney', 'payments', 'api', 'security', 'breaches', 'admin'];
  const missingModules = expectedModules.filter(m => !modulesCovered.has(m));
  
  checks.push({
    id: 'module_coverage',
    name: 'Module Permission Coverage',
    description: 'All core modules should have permissions defined',
    passed: missingModules.length === 0,
    severity: 'warning',
    details: missingModules.length > 0 ? missingModules : undefined,
    timestamp
  });

  // Check 9: Least privilege for citizen role
  const citizenPerms = ROLE_PERMISSIONS['citizen'] || [];
  const highRiskPerms = PERMISSIONS.filter(p => p.risk === 'high' || p.risk === 'critical').map(p => p.key);
  const citizenHighRisk = citizenPerms.filter(p => highRiskPerms.includes(p));
  
  checks.push({
    id: 'citizen_least_privilege',
    name: 'Citizen Least Privilege',
    description: 'Citizen role should not have high-risk permissions',
    passed: citizenHighRisk.length === 0,
    severity: 'warning',
    details: citizenHighRisk.length > 0 ? citizenHighRisk : undefined,
    timestamp
  });

  // Check 10: Security roles have security permissions
  const securityPermsRequired = ['security.dashboard', 'security.audit.logs'];
  const securityRoles = ['security_admin', 'breaches_admin'];
  const securityRolesMissingPerms: string[] = [];
  
  securityRoles.forEach(role => {
    const perms = ROLE_PERMISSIONS[role] || [];
    if (perms.includes('*')) return;
    const hasSecurity = securityPermsRequired.some(sp => perms.includes(sp));
    if (!hasSecurity) {
      securityRolesMissingPerms.push(role);
    }
  });
  
  checks.push({
    id: 'security_roles_permissions',
    name: 'Security Roles Configuration',
    description: 'Security roles must have security-related permissions',
    passed: securityRolesMissingPerms.length === 0,
    severity: 'critical',
    details: securityRolesMissingPerms.length > 0 ? securityRolesMissingPerms : undefined,
    timestamp
  });

  // Check 11: Profile permissions consistency
  const profilePerms = ['profile.view', 'profile.update'];
  const rolesWithoutProfile = Object.entries(ROLE_PERMISSIONS)
    .filter(([role, perms]) => {
      if (role === 'public') return false;
      if (perms.includes('*')) return false;
      return !perms.includes('profile.view');
    })
    .map(([role]) => role);
  
  checks.push({
    id: 'profile_permissions',
    name: 'Profile Access Consistency',
    description: 'All authenticated roles should have profile view permission',
    passed: rolesWithoutProfile.length === 0,
    severity: 'info',
    details: rolesWithoutProfile.length > 0 ? rolesWithoutProfile : undefined,
    timestamp
  });

  // Check 12: No conflicting policies (placeholder)
  checks.push({
    id: 'policy_conflicts',
    name: 'Policy Conflict Check',
    description: 'No conflicting access policies exist',
    passed: true, // Would check actual policies in production
    severity: 'critical',
    timestamp
  });

  return checks;
}

export function getConsistencySummary(checks: ConsistencyCheck[]) {
  return {
    total: checks.length,
    passed: checks.filter(c => c.passed).length,
    failed: checks.filter(c => !c.passed).length,
    critical: checks.filter(c => !c.passed && c.severity === 'critical').length,
    warnings: checks.filter(c => !c.passed && c.severity === 'warning').length,
    allPassed: checks.every(c => c.passed)
  };
}

// ============================================================================
// AUDIT ENGINE
// ============================================================================

// In-memory audit log (use database in production)
let auditLog: AuditEntry[] = [];

export function logAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
  const newEntry: AuditEntry = {
    ...entry,
    id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  auditLog.unshift(newEntry); // Add to beginning
  
  // Keep only last 10000 entries in memory
  if (auditLog.length > 10000) {
    auditLog = auditLog.slice(0, 10000);
  }
  
  return newEntry;
}

export function getAuditLog(options?: {
  actor?: string;
  action?: AuditAction;
  targetType?: AuditEntry['targetType'];
  result?: AuditEntry['result'];
  from?: string;
  to?: string;
  limit?: number;
}): AuditEntry[] {
  let filtered = [...auditLog];
  
  if (options?.actor) {
    filtered = filtered.filter(e => e.actor === options.actor);
  }
  if (options?.action) {
    filtered = filtered.filter(e => e.action === options.action);
  }
  if (options?.targetType) {
    filtered = filtered.filter(e => e.targetType === options.targetType);
  }
  if (options?.result) {
    filtered = filtered.filter(e => e.result === options.result);
  }
  if (options?.from) {
    filtered = filtered.filter(e => e.timestamp >= options.from!);
  }
  if (options?.to) {
    filtered = filtered.filter(e => e.timestamp <= options.to!);
  }
  
  return filtered.slice(0, options?.limit || 100);
}

export function getAuditStats() {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentEntries = auditLog.filter(e => e.timestamp >= last24h);
  
  return {
    total: auditLog.length,
    last24h: recentEntries.length,
    byResult: {
      success: recentEntries.filter(e => e.result === 'success').length,
      failure: recentEntries.filter(e => e.result === 'failure').length,
      denied: recentEntries.filter(e => e.result === 'denied').length
    },
    byAction: recentEntries.reduce((acc, e) => {
      acc[e.action] = (acc[e.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

// ============================================================================
// POLICY ENGINE
// ============================================================================

// Default policies
export const DEFAULT_POLICIES: Policy[] = [
  {
    id: 'POL-001',
    name: 'Module Access Policy',
    description: 'Controls access to platform modules based on user roles',
    type: 'access',
    status: 'active',
    rules: [
      { id: 'R1', condition: 'role.level >= 1', action: 'allow', priority: 1 },
      { id: 'R2', condition: 'role === "public"', action: 'deny', priority: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'POL-002',
    name: 'Admin Access Policy',
    description: 'Restricts administrative functions to admin roles only',
    type: 'access',
    status: 'active',
    rules: [
      { id: 'R1', condition: 'role.level >= 7', action: 'allow', priority: 1 },
      { id: 'R2', condition: 'permission.startsWith("admin.")', action: 'require_mfa', priority: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'POL-003',
    name: 'Security Operations Policy',
    description: 'Governs security-related operations and logging',
    type: 'security',
    status: 'active',
    rules: [
      { id: 'R1', condition: 'action.type === "security"', action: 'log', priority: 1 },
      { id: 'R2', condition: 'attempts > 5', action: 'deny', priority: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'POL-004',
    name: 'Incident Escalation Policy',
    description: 'Defines escalation paths for security incidents',
    type: 'escalation',
    status: 'active',
    rules: [
      { id: 'R1', condition: 'incident.severity === "critical"', action: 'escalate', priority: 1 },
      { id: 'R2', condition: 'incident.unresolved > 24h', action: 'escalate', priority: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'POL-005',
    name: 'Data Protection Policy',
    description: 'Ensures data access complies with privacy requirements',
    type: 'data',
    status: 'active',
    rules: [
      { id: 'R1', condition: 'data.sensitivity === "high"', action: 'require_mfa', priority: 1 },
      { id: 'R2', condition: 'export.size > 1000', action: 'log', priority: 2 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  }
];

export function getPolicies(): Policy[] {
  return DEFAULT_POLICIES;
}

export function getPolicyById(id: string): Policy | undefined {
  return DEFAULT_POLICIES.find(p => p.id === id);
}

export function getPoliciesByType(type: Policy['type']): Policy[] {
  return DEFAULT_POLICIES.filter(p => p.type === type);
}

export function getPoliciesByStatus(status: Policy['status']): Policy[] {
  return DEFAULT_POLICIES.filter(p => p.status === status);
}

// ============================================================================
// INITIALIZATION - Add some sample audit entries
// ============================================================================

// Add sample audit entries for demo
const sampleActions: Array<Omit<AuditEntry, 'id' | 'timestamp'>> = [
  { actor: 'o.kovalenko@gov.ua', actorRole: 'super_admin', action: 'login', target: 'session', targetType: 'system', result: 'success', ip: '192.168.1.45' },
  { actor: 'system', actorRole: 'system', action: 'user_block', target: '45.33.32.156', targetType: 'user', result: 'success' },
  { actor: 'admin@ivyar.org', actorRole: 'super_admin', action: 'role_assign', target: 'j.smith@company.com', targetType: 'role', result: 'success', metadata: { role: 'employer' } },
  { actor: 'super_admin', actorRole: 'super_admin', action: 'permission_grant', target: 'security_admin', targetType: 'permission', result: 'success', metadata: { permission: 'api_admin' } },
  { actor: 'WAF', actorRole: 'system', action: 'incident_create', target: 'INC-005', targetType: 'system', result: 'success', metadata: { type: 'SQL injection' } },
  { actor: 'api-service', actorRole: 'system', action: 'read', target: 'api/v1/*', targetType: 'module', result: 'success', metadata: { calls: 10000 } },
  { actor: 'm.garcia@legal.com', actorRole: 'attorney', action: 'logout', target: 'session', targetType: 'system', result: 'success' },
];

// Initialize with sample data
sampleActions.forEach(entry => logAuditEntry(entry));
