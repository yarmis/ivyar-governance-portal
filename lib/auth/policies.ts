// lib/auth/policies.ts
// IVYAR Access Governance Module - Formal Policy Rules v2.0

// ============================================================================
// TYPES
// ============================================================================

export interface PolicyRule {
  id: string;
  description: string;
  condition: string;
  action: 'allow' | 'deny' | 'require_mfa' | 'dual_approval' | 'log' | 'escalate' | 'alert';
  severity: 'info' | 'warning' | 'critical';
}

export interface FormalPolicy {
  id: string;
  name: string;
  fullName: string;
  version: string;
  status: 'active' | 'draft' | 'deprecated';
  effectiveDate: string;
  lastReview: string;
  nextReview: string;
  owner: string;
  approver: string;
  purpose: string;
  scope: string;
  rules: PolicyRule[];
  exceptions: string[];
  references: string[];
}

// ============================================================================
// ACCESS CONTROL POLICY (ACP-01)
// ============================================================================

export const ACCESS_CONTROL_POLICY: FormalPolicy = {
  id: 'ACP-01',
  name: 'Access Control Policy',
  fullName: 'IVYAR Access Control Policy',
  version: '2.0',
  status: 'active',
  effectiveDate: '2024-01-01',
  lastReview: '2026-01-06',
  nextReview: '2026-07-01',
  owner: 'Security Admin',
  approver: 'Super Admin',
  purpose: 'Establish access control rules for all IVYAR modules and resources.',
  scope: 'All users, administrators, modules, APIs, and integrations.',
  rules: [
    {
      id: 'ACP-01.01',
      description: 'Role-Based Access Only - All access must be granted through roles. Direct user permissions are prohibited.',
      condition: 'permission.source === "direct"',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'ACP-01.02',
      description: 'Least Privilege Principle - Each role must have minimum required permissions.',
      condition: 'role.permissions.length > role.requiredPermissions.length * 1.5',
      action: 'alert',
      severity: 'warning'
    },
    {
      id: 'ACP-01.03',
      description: 'No Implicit Access - If permission is not explicitly granted, access is denied.',
      condition: '!hasExplicitPermission(user, resource)',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'ACP-01.04',
      description: 'Separation of Duties - No user can have conflicting admin roles simultaneously.',
      condition: 'user.roles.includes("security_admin") && user.roles.includes("breaches_admin")',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'ACP-01.05',
      description: 'Sensitive Modules Restricted - Security, Breaches, API Admin only for authorized roles.',
      condition: 'module.sensitive && !user.role.level >= 8',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'ACP-01.06',
      description: 'Government Role Restriction - Government officials cannot have super_admin privileges.',
      condition: 'user.roles.includes("government") && user.roles.includes("super_admin")',
      action: 'deny',
      severity: 'critical'
    }
  ],
  exceptions: [
    'Emergency access window (see EP-05.02)',
    'System maintenance by IVYAR staff'
  ],
  references: ['NIST 800-53 AC-1', 'ISO 27001 A.9.1', 'GDPR Article 32']
};

// ============================================================================
// POLICY FOR ROLE MANAGEMENT (PRM-02)
// ============================================================================

export const ROLE_MANAGEMENT_POLICY: FormalPolicy = {
  id: 'PRM-02',
  name: 'Role Management Policy',
  fullName: 'IVYAR Policy for Role Management',
  version: '2.0',
  status: 'active',
  effectiveDate: '2024-01-01',
  lastReview: '2026-01-06',
  nextReview: '2026-07-01',
  owner: 'Super Admin',
  approver: 'Super Admin',
  purpose: 'Govern the creation, modification, and deletion of roles.',
  scope: 'All role management operations within IVYAR.',
  rules: [
    {
      id: 'PRM-02.01',
      description: 'Role Creation Restricted - Only super_admin can create new roles.',
      condition: 'action === "create_role" && actor.role !== "super_admin"',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'PRM-02.02',
      description: 'Role Modification Audit - Every role change must be logged in Audit.',
      condition: 'action.type === "role_modification"',
      action: 'log',
      severity: 'info'
    },
    {
      id: 'PRM-02.03',
      description: 'Role Deletion Protection - Roles with active users cannot be deleted.',
      condition: 'action === "delete_role" && role.activeUsers > 0',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'PRM-02.04',
      description: 'Role Consistency Check - Consistency checks must pass before publishing.',
      condition: 'action === "publish_role" && !consistencyCheck.passed',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'PRM-02.05',
      description: 'Admin Role Changes Require Dual Approval.',
      condition: 'action === "modify_role" && role.level >= 7',
      action: 'dual_approval',
      severity: 'critical'
    }
  ],
  exceptions: ['Initial system setup'],
  references: ['NIST 800-53 AC-2', 'ISO 27001 A.9.2']
};

// ============================================================================
// PERMISSION POLICY (PP-03)
// ============================================================================

export const PERMISSION_POLICY: FormalPolicy = {
  id: 'PP-03',
  name: 'Permission Policy',
  fullName: 'IVYAR Permission Management Policy',
  version: '2.0',
  status: 'active',
  effectiveDate: '2024-01-01',
  lastReview: '2026-01-06',
  nextReview: '2026-07-01',
  owner: 'Security Admin',
  approver: 'Super Admin',
  purpose: 'Define standards for permission naming, assignment, and management.',
  scope: 'All permissions in IVYAR system.',
  rules: [
    {
      id: 'PP-03.01',
      description: 'Permission Names Must Be Namespaced - Format: module.action (e.g., business.contracts.sign).',
      condition: '!permission.key.includes(".")',
      action: 'deny',
      severity: 'warning'
    },
    {
      id: 'PP-03.02',
      description: 'No Wildcards Except Super Admin - Only super_admin can have * permission.',
      condition: 'permission === "*" && role !== "super_admin"',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'PP-03.03',
      description: 'Permission Orphans Forbidden - All permissions must be assigned to at least one role.',
      condition: 'permission.assignedRoles.length === 0',
      action: 'alert',
      severity: 'warning'
    },
    {
      id: 'PP-03.04',
      description: 'Critical Permissions Require MFA - High-risk permissions require MFA.',
      condition: 'permission.risk === "critical" || permission.risk === "high"',
      action: 'require_mfa',
      severity: 'critical'
    }
  ],
  exceptions: ['System permissions'],
  references: ['NIST 800-53 AC-3', 'ISO 27001 A.9.4']
};

// ============================================================================
// SECURITY POLICY (SP-04)
// ============================================================================

export const SECURITY_POLICY: FormalPolicy = {
  id: 'SP-04',
  name: 'Security Policy',
  fullName: 'IVYAR Security Operations Policy',
  version: '2.0',
  status: 'active',
  effectiveDate: '2024-01-01',
  lastReview: '2026-01-06',
  nextReview: '2026-07-01',
  owner: 'Security Admin',
  approver: 'Super Admin',
  purpose: 'Define security requirements for access governance operations.',
  scope: 'All security-sensitive operations.',
  rules: [
    {
      id: 'SP-04.01',
      description: 'High-Risk Actions Require MFA - Role changes, policy changes, user blocking, Security/Breaches access.',
      condition: 'action.risk === "high" || action.risk === "critical"',
      action: 'require_mfa',
      severity: 'critical'
    },
    {
      id: 'SP-04.02',
      description: 'IP-based Restrictions - Admin roles can only work from allowed IP ranges.',
      condition: 'user.role.level >= 7 && !allowedIPs.includes(request.ip)',
      action: 'deny',
      severity: 'critical'
    },
    {
      id: 'SP-04.03',
      description: 'Automatic Incident Trigger - 5+ access changes in 5 minutes creates an incident.',
      condition: 'accessChanges.last5min >= 5',
      action: 'escalate',
      severity: 'critical'
    },
    {
      id: 'SP-04.04',
      description: 'Session Timeout - Admin sessions expire after 30 minutes of inactivity.',
      condition: 'session.idleTime > 30 && user.role.level >= 7',
      action: 'deny',
      severity: 'warning'
    },
    {
      id: 'SP-04.05',
      description: 'Failed Login Lockout - 5 failed attempts locks account for 15 minutes.',
      condition: 'failedAttempts >= 5',
      action: 'deny',
      severity: 'critical'
    }
  ],
  exceptions: ['Emergency access window'],
  references: ['NIST 800-53 AC-7', 'ISO 27001 A.9.4', 'GDPR Article 32']
};

// ============================================================================
// ESCALATION POLICY (EP-05)
// ============================================================================

export const ESCALATION_POLICY: FormalPolicy = {
  id: 'EP-05',
  name: 'Escalation Policy',
  fullName: 'IVYAR Incident Escalation Policy',
  version: '2.0',
  status: 'active',
  effectiveDate: '2024-01-01',
  lastReview: '2026-01-06',
  nextReview: '2026-07-01',
  owner: 'Breaches Admin',
  approver: 'Super Admin',
  purpose: 'Define escalation procedures for access-related incidents.',
  scope: 'All security incidents and access violations.',
  rules: [
    {
      id: 'EP-05.01',
      description: 'Critical Access Changes Require Dual Approval - Security/Breaches changes need 2 signatures.',
      condition: 'action.target.module === "security" || action.target.module === "breaches"',
      action: 'dual_approval',
      severity: 'critical'
    },
    {
      id: 'EP-05.02',
      description: 'Emergency Access Window - Super admin can get temporary full access for 30 minutes max.',
      condition: 'emergency === true && actor.role === "super_admin"',
      action: 'allow',
      severity: 'critical'
    },
    {
      id: 'EP-05.03',
      description: 'Escalation Log Required - All escalations must be logged separately.',
      condition: 'action.type === "escalation"',
      action: 'log',
      severity: 'info'
    },
    {
      id: 'EP-05.04',
      description: 'Critical Incident Notification - Critical incidents trigger immediate notification.',
      condition: 'incident.severity === "critical"',
      action: 'alert',
      severity: 'critical'
    },
    {
      id: 'EP-05.05',
      description: 'Unresolved Incident Escalation - Incidents unresolved for 24h auto-escalate.',
      condition: 'incident.age > 24h && incident.status !== "resolved"',
      action: 'escalate',
      severity: 'warning'
    }
  ],
  exceptions: ['Planned maintenance windows'],
  references: ['NIST 800-61', 'ISO 27001 A.16']
};

// ============================================================================
// DATA PROTECTION POLICY (DP-06)
// ============================================================================

export const DATA_PROTECTION_POLICY: FormalPolicy = {
  id: 'DP-06',
  name: 'Data Protection Policy',
  fullName: 'IVYAR Data Protection & Privacy Policy',
  version: '2.0',
  status: 'active',
  effectiveDate: '2024-01-01',
  lastReview: '2026-01-06',
  nextReview: '2026-07-01',
  owner: 'Security Admin',
  approver: 'Super Admin',
  purpose: 'Ensure data access complies with privacy requirements.',
  scope: 'All data access and processing operations.',
  rules: [
    {
      id: 'DP-06.01',
      description: 'Sensitive Data Access Requires MFA.',
      condition: 'data.classification === "sensitive" || data.classification === "confidential"',
      action: 'require_mfa',
      severity: 'critical'
    },
    {
      id: 'DP-06.02',
      description: 'Large Data Export Logging - Exports > 1000 records must be logged.',
      condition: 'export.recordCount > 1000',
      action: 'log',
      severity: 'warning'
    },
    {
      id: 'DP-06.03',
      description: 'PII Access Audit - All PII access must be audited.',
      condition: 'data.containsPII === true',
      action: 'log',
      severity: 'info'
    },
    {
      id: 'DP-06.04',
      description: 'Cross-border Data Transfer Restriction.',
      condition: 'transfer.crossBorder === true && !transfer.approved',
      action: 'deny',
      severity: 'critical'
    }
  ],
  exceptions: ['Anonymized data'],
  references: ['GDPR Articles 5, 25, 32', 'ISO 27001 A.8', 'NIST 800-53 SC-8']
};

// ============================================================================
// ALL POLICIES EXPORT
// ============================================================================

export const ALL_POLICIES: FormalPolicy[] = [
  ACCESS_CONTROL_POLICY,
  ROLE_MANAGEMENT_POLICY,
  PERMISSION_POLICY,
  SECURITY_POLICY,
  ESCALATION_POLICY,
  DATA_PROTECTION_POLICY
];

export function getPolicyById(id: string): FormalPolicy | undefined {
  return ALL_POLICIES.find(p => p.id === id);
}

export function getActiveRules(): PolicyRule[] {
  return ALL_POLICIES
    .filter(p => p.status === 'active')
    .flatMap(p => p.rules);
}

export function getCriticalRules(): PolicyRule[] {
  return getActiveRules().filter(r => r.severity === 'critical');
}

// ============================================================================
// POLICY STATISTICS
// ============================================================================

export const POLICY_STATS = {
  totalPolicies: ALL_POLICIES.length,
  activePolicies: ALL_POLICIES.filter(p => p.status === 'active').length,
  totalRules: ALL_POLICIES.reduce((sum, p) => sum + p.rules.length, 0),
  criticalRules: getActiveRules().filter(r => r.severity === 'critical').length,
  references: [...new Set(ALL_POLICIES.flatMap(p => p.references))].length
};
