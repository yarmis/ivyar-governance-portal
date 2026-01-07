// lib/auth/playbook.ts
// IVYAR Access Governance Module - Administrative Playbook v2.0
// Practical step-by-step guide for administrators

// ============================================================================
// TYPES
// ============================================================================

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  path?: string;
  requiredRole: string;
  requiresMFA: boolean;
  requiresDualApproval: boolean;
  steps: string[];
  warnings?: string[];
  notes?: string[];
}

export interface PlaybookSection {
  id: string;
  title: string;
  description: string;
  procedures: PlaybookStep[];
}

// ============================================================================
// SECTION 1: ROLE MANAGEMENT
// ============================================================================

export const ROLE_MANAGEMENT: PlaybookSection = {
  id: 'SEC-01',
  title: 'Role Management',
  description: 'Procedures for creating, modifying, and deleting roles.',
  procedures: [
    {
      id: 'PROC-01.01',
      title: 'Creating a New Role',
      description: 'Step-by-step guide for creating a new role in AGM.',
      path: '/admin/governance',
      requiredRole: 'super_admin',
      requiresMFA: true,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Roles tab',
        'Click "Create Role" button',
        'Enter role details: code, name, nameUk, level (0-10)',
        'Select permissions from the available list',
        'Define allowed routes for the role',
        'Specify which roles this role can create (canCreate)',
        'Run Consistency Check to validate configuration',
        'Review and confirm changes',
        'Role is created and logged in Audit'
      ],
      warnings: [
        'Role code must be unique and lowercase with underscores only',
        'Level must be appropriate for the role type (user: 1-4, partner: 5-6, admin: 7-10)',
        'Do not assign critical permissions to non-admin roles'
      ],
      notes: [
        'All role changes are automatically logged',
        'New roles require consistency check before activation'
      ]
    },
    {
      id: 'PROC-01.02',
      title: 'Modifying an Existing Role',
      description: 'How to safely modify role permissions and settings.',
      path: '/admin/governance',
      requiredRole: 'super_admin',
      requiresMFA: true,
      requiresDualApproval: true,
      steps: [
        'Navigate to /admin/governance → Roles tab',
        'Select the role to modify',
        'Click "Edit" button',
        'Make necessary changes to permissions/routes',
        'Run Consistency Check',
        'If role level >= 7, request dual approval',
        'Enter MFA code',
        'Confirm changes',
        'Changes are applied and logged'
      ],
      warnings: [
        'Modifying admin roles (level >= 7) requires dual approval',
        'Removing permissions may affect active users immediately',
        'Always run consistency check before saving'
      ]
    },
    {
      id: 'PROC-01.03',
      title: 'Deleting a Role',
      description: 'Safe procedure for removing unused roles.',
      path: '/admin/governance',
      requiredRole: 'super_admin',
      requiresMFA: true,
      requiresDualApproval: true,
      steps: [
        'Navigate to /admin/governance → Roles tab',
        'Select the role to delete',
        'Verify role has NO active users (userCount = 0)',
        'Click "Delete" button',
        'Confirm deletion in modal',
        'Enter MFA code',
        'Role is deleted and logged'
      ],
      warnings: [
        'CANNOT delete roles with active users',
        'Deletion is permanent and cannot be undone',
        'System roles (super_admin, public) cannot be deleted'
      ]
    }
  ]
};

// ============================================================================
// SECTION 2: USER MANAGEMENT
// ============================================================================

export const USER_MANAGEMENT: PlaybookSection = {
  id: 'SEC-02',
  title: 'User Management',
  description: 'Procedures for assigning roles and managing user access.',
  procedures: [
    {
      id: 'PROC-02.01',
      title: 'Standard Role Assignment',
      description: 'Assigning a standard role to a user.',
      path: '/admin/governance',
      requiredRole: 'pilot_admin',
      requiresMFA: false,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Users tab',
        'Search for the user by name or email',
        'Click "Assign Role" button',
        'Select role from dropdown (only roles you can create)',
        'Add optional expiration date if temporary',
        'Add reason/justification for assignment',
        'Confirm assignment',
        'User receives notification of new role'
      ],
      notes: [
        'You can only assign roles that your role is allowed to create',
        'User can have multiple roles simultaneously',
        'Assignment is effective immediately'
      ]
    },
    {
      id: 'PROC-02.02',
      title: 'High-Risk Role Assignment',
      description: 'Assigning admin or sensitive roles.',
      path: '/admin/governance',
      requiredRole: 'super_admin',
      requiresMFA: true,
      requiresDualApproval: true,
      steps: [
        'Navigate to /admin/governance → Users tab',
        'Search for the user',
        'Click "Assign Role" button',
        'Select admin role (level >= 7)',
        'System prompts for MFA verification',
        'Enter MFA code',
        'System prompts for dual approval',
        'Second administrator approves the request',
        'Role is assigned and logged'
      ],
      warnings: [
        'Admin roles require MFA and dual approval',
        'Verify user identity before assigning admin roles',
        'Consider temporary assignments with expiration dates'
      ]
    },
    {
      id: 'PROC-02.03',
      title: 'Revoking a Role',
      description: 'Removing a role from a user.',
      path: '/admin/governance',
      requiredRole: 'pilot_admin',
      requiresMFA: false,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Users tab',
        'Find the user',
        'Click on user to see current roles',
        'Click "Revoke" next to the role to remove',
        'Add reason for revocation',
        'Confirm revocation',
        'User loses access immediately'
      ],
      warnings: [
        'Revocation is immediate - user sessions may be terminated',
        'For admin roles, MFA and dual approval required'
      ]
    },
    {
      id: 'PROC-02.04',
      title: 'Suspending a User',
      description: 'Temporarily blocking all user access.',
      path: '/admin/governance',
      requiredRole: 'security_admin',
      requiresMFA: true,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Users tab',
        'Find the user',
        'Click "Suspend" button',
        'Select suspension reason from list',
        'Add detailed notes',
        'Set suspension duration (or indefinite)',
        'Enter MFA code',
        'Confirm suspension',
        'User is immediately logged out and blocked'
      ],
      notes: [
        'Suspended users cannot log in',
        'All active sessions are terminated',
        'Suspension can be reversed by security_admin or super_admin'
      ]
    }
  ]
};

// ============================================================================
// SECTION 3: PERMISSION MANAGEMENT
// ============================================================================

export const PERMISSION_MANAGEMENT: PlaybookSection = {
  id: 'SEC-03',
  title: 'Permission Management',
  description: 'Procedures for managing permissions.',
  procedures: [
    {
      id: 'PROC-03.01',
      title: 'Adding a New Permission',
      description: 'Creating a new permission in the system.',
      path: '/admin/governance',
      requiredRole: 'super_admin',
      requiresMFA: true,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Permissions tab',
        'Click "Add Permission" button',
        'Enter permission key in format: module.action (e.g., business.reports.export)',
        'Select module from dropdown',
        'Enter name and description',
        'Select risk level (low/medium/high/critical)',
        'Select category (read/write/admin/system)',
        'Assign to roles',
        'Run Consistency Check',
        'Confirm creation'
      ],
      warnings: [
        'Permission key must follow module.action format',
        'Critical permissions should only be assigned to admin roles',
        'All permissions must be assigned to at least one role'
      ]
    },
    {
      id: 'PROC-03.02',
      title: 'Viewing Permission Matrix',
      description: 'How to review the complete permission-role mapping.',
      path: '/admin/hub',
      requiredRole: 'auditor',
      requiresMFA: false,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/hub → Permission Matrix tab',
        'Use filters to narrow down permissions',
        'Review which roles have which permissions',
        'Export matrix for compliance review if needed'
      ]
    }
  ]
};

// ============================================================================
// SECTION 4: POLICY MANAGEMENT
// ============================================================================

export const POLICY_MANAGEMENT: PlaybookSection = {
  id: 'SEC-04',
  title: 'Policy Management',
  description: 'Procedures for configuring and enforcing policies.',
  procedures: [
    {
      id: 'PROC-04.01',
      title: 'Reviewing Active Policies',
      description: 'How to review current policy configuration.',
      path: '/admin/governance',
      requiredRole: 'auditor',
      requiresMFA: false,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Policies tab',
        'View list of all policies with status',
        'Click on policy to see rules and configuration',
        'Review references to compliance standards',
        'Note effective dates and next review dates'
      ]
    },
    {
      id: 'PROC-04.02',
      title: 'Modifying a Policy',
      description: 'Updating policy rules and configuration.',
      path: '/admin/governance',
      requiredRole: 'super_admin',
      requiresMFA: true,
      requiresDualApproval: true,
      steps: [
        'Navigate to /admin/governance → Policies tab',
        'Select policy to modify',
        'Click "Edit" button',
        'Make changes to rules',
        'Update version number',
        'Add change notes',
        'Request dual approval',
        'Both approvers enter MFA',
        'Changes are applied and logged'
      ],
      warnings: [
        'Policy changes require dual approval',
        'Changes may affect all users immediately',
        'Document all changes thoroughly'
      ]
    }
  ]
};

// ============================================================================
// SECTION 5: AUDIT & MONITORING
// ============================================================================

export const AUDIT_MONITORING: PlaybookSection = {
  id: 'SEC-05',
  title: 'Audit & Monitoring',
  description: 'Procedures for reviewing audit logs and monitoring access.',
  procedures: [
    {
      id: 'PROC-05.01',
      title: 'Reviewing Audit Log',
      description: 'How to review and analyze audit entries.',
      path: '/admin/governance',
      requiredRole: 'auditor',
      requiresMFA: false,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Audit tab',
        'Use filters: actor, action, module, result, date range',
        'Review entries for anomalies',
        'Click on entry for full details',
        'Export filtered results if needed'
      ],
      notes: [
        'Audit logs are immutable',
        'Logs are retained for 7 years',
        'Export for compliance reviews'
      ]
    },
    {
      id: 'PROC-05.02',
      title: 'Running Consistency Checks',
      description: 'How to verify system consistency.',
      path: '/admin/governance',
      requiredRole: 'pilot_admin',
      requiresMFA: false,
      requiresDualApproval: false,
      steps: [
        'Navigate to /admin/governance → Dashboard',
        'View Consistency Checker card',
        'All 12 checks should show green ✓',
        'If any check fails, click for details',
        'Resolve issues before they cause problems'
      ]
    },
    {
      id: 'PROC-05.03',
      title: 'Incident Response',
      description: 'What to do when suspicious activity is detected.',
      path: '/admin/security',
      requiredRole: 'security_admin',
      requiresMFA: true,
      requiresDualApproval: false,
      steps: [
        'Identify suspicious activity in audit log or Security Center',
        'Assess severity (info/warning/critical)',
        'If critical: immediately suspend user account',
        'Create incident in Breaches Center',
        'Document all findings',
        'Notify relevant stakeholders',
        'Conduct investigation',
        'Implement remediation',
        'Close incident with resolution notes'
      ],
      warnings: [
        'Critical incidents require immediate action',
        '5+ access changes in 5 minutes triggers automatic incident',
        'Always document your response'
      ]
    }
  ]
};

// ============================================================================
// COMPLETE PLAYBOOK
// ============================================================================

export const AGM_PLAYBOOK: PlaybookSection[] = [
  ROLE_MANAGEMENT,
  USER_MANAGEMENT,
  PERMISSION_MANAGEMENT,
  POLICY_MANAGEMENT,
  AUDIT_MONITORING
];

export function getPlaybookSection(sectionId: string): PlaybookSection | undefined {
  return AGM_PLAYBOOK.find(s => s.id === sectionId);
}

export function getProcedure(procedureId: string): PlaybookStep | undefined {
  for (const section of AGM_PLAYBOOK) {
    const proc = section.procedures.find(p => p.id === procedureId);
    if (proc) return proc;
  }
  return undefined;
}

export function getProceduresByRole(role: string): PlaybookStep[] {
  const roleHierarchy: Record<string, number> = {
    public: 0, citizen: 1, business: 2, employer: 3, attorney: 4,
    donor: 5, auditor: 5, government: 6, pilot_admin: 7,
    security_admin: 8, breaches_admin: 8, super_admin: 10
  };
  
  const userLevel = roleHierarchy[role] || 0;
  
  return AGM_PLAYBOOK.flatMap(section => 
    section.procedures.filter(proc => {
      const requiredLevel = roleHierarchy[proc.requiredRole] || 0;
      return userLevel >= requiredLevel;
    })
  );
}

// ============================================================================
// PLAYBOOK STATISTICS
// ============================================================================

export const PLAYBOOK_STATS = {
  totalSections: AGM_PLAYBOOK.length,
  totalProcedures: AGM_PLAYBOOK.reduce((sum, s) => sum + s.procedures.length, 0),
  mfaRequired: AGM_PLAYBOOK.flatMap(s => s.procedures).filter(p => p.requiresMFA).length,
  dualApprovalRequired: AGM_PLAYBOOK.flatMap(s => s.procedures).filter(p => p.requiresDualApproval).length
};
