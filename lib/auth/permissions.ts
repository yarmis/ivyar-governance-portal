// lib/auth/permissions.ts
// IVYAR Access Governance Module - Complete Permissions System v2.0
// Total: 54 permissions across 13 modules

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

export interface PermissionDefinition {
  key: string;
  module: string;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  category: 'read' | 'write' | 'admin' | 'system';
}

export const PERMISSION_MODULES = [
  'auth', 'profile', 'citizen', 'business', 'employer', 'attorney',
  'payments', 'api', 'localization', 'notifications', 'security',
  'breaches', 'admin'
] as const;

export type PermissionModule = typeof PERMISSION_MODULES[number];

// Complete permission registry - 54 permissions
export const PERMISSIONS: PermissionDefinition[] = [
  // ========================================
  // A. AUTHENTICATION (5)
  // ========================================
  { key: 'auth.login', module: 'auth', name: 'Login', description: 'Authenticate into the platform', risk: 'low', category: 'system' },
  { key: 'auth.logout', module: 'auth', name: 'Logout', description: 'End current session', risk: 'low', category: 'system' },
  { key: 'auth.refresh', module: 'auth', name: 'Refresh Token', description: 'Refresh authentication tokens', risk: 'low', category: 'system' },
  { key: 'auth.mfa.enable', module: 'auth', name: 'Enable MFA', description: 'Enable multi-factor authentication', risk: 'medium', category: 'write' },
  { key: 'auth.mfa.disable', module: 'auth', name: 'Disable MFA', description: 'Disable multi-factor authentication', risk: 'high', category: 'write' },

  // ========================================
  // B. USER PROFILE (4)
  // ========================================
  { key: 'profile.view', module: 'profile', name: 'View Profile', description: 'View own user profile', risk: 'low', category: 'read' },
  { key: 'profile.update', module: 'profile', name: 'Update Profile', description: 'Modify own profile information', risk: 'low', category: 'write' },
  { key: 'profile.documents.upload', module: 'profile', name: 'Upload Documents', description: 'Upload personal documents', risk: 'low', category: 'write' },
  { key: 'profile.documents.delete', module: 'profile', name: 'Delete Documents', description: 'Remove personal documents', risk: 'medium', category: 'write' },

  // ========================================
  // C. CITIZEN MODULE (5)
  // ========================================
  { key: 'citizen.dashboard', module: 'citizen', name: 'Citizen Dashboard', description: 'Access citizen dashboard', risk: 'low', category: 'read' },
  { key: 'citizen.applications.create', module: 'citizen', name: 'Create Applications', description: 'Submit new applications', risk: 'low', category: 'write' },
  { key: 'citizen.applications.view', module: 'citizen', name: 'View Applications', description: 'View own applications', risk: 'low', category: 'read' },
  { key: 'citizen.applications.update', module: 'citizen', name: 'Update Applications', description: 'Modify pending applications', risk: 'low', category: 'write' },
  { key: 'citizen.documents.view', module: 'citizen', name: 'View Documents', description: 'View personal documents', risk: 'low', category: 'read' },

  // ========================================
  // D. BUSINESS MODULE (7)
  // ========================================
  { key: 'business.dashboard', module: 'business', name: 'Business Dashboard', description: 'Access business dashboard', risk: 'low', category: 'read' },
  { key: 'business.company.manage', module: 'business', name: 'Manage Company', description: 'Manage company profile and settings', risk: 'medium', category: 'write' },
  { key: 'business.documents.manage', module: 'business', name: 'Manage Documents', description: 'Upload and manage business documents', risk: 'medium', category: 'write' },
  { key: 'business.contracts.create', module: 'business', name: 'Create Contracts', description: 'Create new business contracts', risk: 'medium', category: 'write' },
  { key: 'business.contracts.sign', module: 'business', name: 'Sign Contracts', description: 'Digitally sign contracts', risk: 'high', category: 'write' },
  { key: 'business.payments.process', module: 'business', name: 'Process Payments', description: 'Execute payment transactions', risk: 'high', category: 'write' },
  { key: 'business.api.access', module: 'business', name: 'API Access', description: 'Access business API endpoints', risk: 'medium', category: 'read' },

  // ========================================
  // E. EMPLOYER MODULE (5)
  // ========================================
  { key: 'employer.dashboard', module: 'employer', name: 'Employer Dashboard', description: 'Access employer dashboard', risk: 'low', category: 'read' },
  { key: 'employer.employees.manage', module: 'employer', name: 'Manage Employees', description: 'Add, update, remove employees', risk: 'medium', category: 'write' },
  { key: 'employer.documents.verify', module: 'employer', name: 'Verify Documents', description: 'Verify employee documents', risk: 'medium', category: 'write' },
  { key: 'employer.hr.integrations', module: 'employer', name: 'HR Integrations', description: 'Connect external HR systems', risk: 'high', category: 'admin' },
  { key: 'employer.applications.submit', module: 'employer', name: 'Submit Applications', description: 'Submit applications on behalf of company', risk: 'medium', category: 'write' },

  // ========================================
  // F. ATTORNEY MODULE (5)
  // ========================================
  { key: 'attorney.dashboard', module: 'attorney', name: 'Attorney Dashboard', description: 'Access legal professional dashboard', risk: 'low', category: 'read' },
  { key: 'attorney.clients.access', module: 'attorney', name: 'Client Access', description: 'Access client information and cases', risk: 'high', category: 'read' },
  { key: 'attorney.documents.sign', module: 'attorney', name: 'Sign Documents', description: 'Digitally sign legal documents', risk: 'high', category: 'write' },
  { key: 'attorney.applications.submit.on_behalf', module: 'attorney', name: 'Submit on Behalf', description: 'Submit applications for clients', risk: 'high', category: 'write' },
  { key: 'attorney.audit.view', module: 'attorney', name: 'View Audit Trail', description: 'View case audit history', risk: 'medium', category: 'read' },

  // ========================================
  // G. PAYMENTS MODULE (4)
  // ========================================
  { key: 'payments.initiate', module: 'payments', name: 'Initiate Payment', description: 'Start payment transactions', risk: 'high', category: 'write' },
  { key: 'payments.refund', module: 'payments', name: 'Process Refund', description: 'Issue payment refunds', risk: 'critical', category: 'write' },
  { key: 'payments.history.view', module: 'payments', name: 'View Payment History', description: 'View transaction history', risk: 'low', category: 'read' },
  { key: 'payments.billing.manage', module: 'payments', name: 'Manage Billing', description: 'Configure billing settings', risk: 'high', category: 'admin' },

  // ========================================
  // H. API MODULE (5)
  // ========================================
  { key: 'api.read', module: 'api', name: 'API Read', description: 'Read data via API', risk: 'low', category: 'read' },
  { key: 'api.write', module: 'api', name: 'API Write', description: 'Write data via API', risk: 'medium', category: 'write' },
  { key: 'api.admin', module: 'api', name: 'API Admin', description: 'Administer API settings', risk: 'high', category: 'admin' },
  { key: 'api.keys.create', module: 'api', name: 'Create API Keys', description: 'Generate new API keys', risk: 'high', category: 'admin' },
  { key: 'api.keys.revoke', module: 'api', name: 'Revoke API Keys', description: 'Invalidate API keys', risk: 'high', category: 'admin' },

  // ========================================
  // I. LOCALIZATION MODULE (3)
  // ========================================
  { key: 'localization.languages.manage', module: 'localization', name: 'Manage Languages', description: 'Add or remove supported languages', risk: 'medium', category: 'admin' },
  { key: 'localization.translations.edit', module: 'localization', name: 'Edit Translations', description: 'Modify translation strings', risk: 'low', category: 'write' },
  { key: 'localization.translations.publish', module: 'localization', name: 'Publish Translations', description: 'Deploy translation updates', risk: 'medium', category: 'admin' },

  // ========================================
  // J. NOTIFICATIONS MODULE (3)
  // ========================================
  { key: 'notifications.send', module: 'notifications', name: 'Send Notifications', description: 'Send system notifications', risk: 'medium', category: 'write' },
  { key: 'notifications.templates.manage', module: 'notifications', name: 'Manage Templates', description: 'Create and edit notification templates', risk: 'medium', category: 'admin' },
  { key: 'notifications.settings.update', module: 'notifications', name: 'Update Settings', description: 'Configure notification settings', risk: 'low', category: 'write' },

  // ========================================
  // K. SECURITY CENTER (6)
  // ========================================
  { key: 'security.dashboard', module: 'security', name: 'Security Dashboard', description: 'Access security monitoring dashboard', risk: 'high', category: 'read' },
  { key: 'security.heatmap.view', module: 'security', name: 'View Heatmap', description: 'View geographic threat heatmap', risk: 'medium', category: 'read' },
  { key: 'security.ip.analysis', module: 'security', name: 'IP Analysis', description: 'Analyze IP addresses and patterns', risk: 'high', category: 'read' },
  { key: 'security.user.block', module: 'security', name: 'Block User', description: 'Block user accounts', risk: 'critical', category: 'admin' },
  { key: 'security.user.unblock', module: 'security', name: 'Unblock User', description: 'Restore blocked user accounts', risk: 'high', category: 'admin' },
  { key: 'security.audit.logs', module: 'security', name: 'View Audit Logs', description: 'Access security audit logs', risk: 'high', category: 'read' },

  // ========================================
  // L. BREACHES CENTER (4)
  // ========================================
  { key: 'breaches.incidents.view', module: 'breaches', name: 'View Incidents', description: 'View security incidents', risk: 'high', category: 'read' },
  { key: 'breaches.incidents.manage', module: 'breaches', name: 'Manage Incidents', description: 'Create, update, resolve incidents', risk: 'critical', category: 'admin' },
  { key: 'breaches.events.timeline', module: 'breaches', name: 'Event Timeline', description: 'View incident event timeline', risk: 'medium', category: 'read' },
  { key: 'breaches.escalation.trigger', module: 'breaches', name: 'Trigger Escalation', description: 'Escalate incidents to higher level', risk: 'critical', category: 'admin' },

  // ========================================
  // M. ADMIN MODULE (6)
  // ========================================
  { key: 'admin.users.manage', module: 'admin', name: 'Manage Users', description: 'Create, update, delete user accounts', risk: 'critical', category: 'admin' },
  { key: 'admin.roles.manage', module: 'admin', name: 'Manage Roles', description: 'Create, update, delete roles', risk: 'critical', category: 'admin' },
  { key: 'admin.permissions.manage', module: 'admin', name: 'Manage Permissions', description: 'Assign and revoke permissions', risk: 'critical', category: 'admin' },
  { key: 'admin.modules.enable', module: 'admin', name: 'Enable Modules', description: 'Activate platform modules', risk: 'high', category: 'admin' },
  { key: 'admin.modules.disable', module: 'admin', name: 'Disable Modules', description: 'Deactivate platform modules', risk: 'critical', category: 'admin' },
  { key: 'admin.settings.update', module: 'admin', name: 'Update Settings', description: 'Modify system settings', risk: 'high', category: 'admin' },
];

// ============================================================================
// ROLE-PERMISSION MAPPING (Updated)
// ============================================================================

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  public: [
    'auth.login'
  ],
  
  citizen: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update', 'profile.documents.upload', 'profile.documents.delete',
    'citizen.dashboard', 'citizen.applications.create', 'citizen.applications.view',
    'citizen.applications.update', 'citizen.documents.view',
    'payments.initiate', 'payments.history.view',
    'notifications.settings.update'
  ],
  
  business: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update', 'profile.documents.upload', 'profile.documents.delete',
    'business.dashboard', 'business.company.manage', 'business.documents.manage',
    'business.contracts.create', 'business.contracts.sign', 'business.payments.process',
    'business.api.access',
    'payments.initiate', 'payments.history.view',
    'api.read', 'api.write',
    'notifications.settings.update'
  ],
  
  employer: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update', 'profile.documents.upload', 'profile.documents.delete',
    'business.dashboard', 'business.company.manage', 'business.documents.manage',
    'employer.dashboard', 'employer.employees.manage', 'employer.documents.verify',
    'employer.hr.integrations', 'employer.applications.submit',
    'payments.initiate', 'payments.history.view',
    'api.read', 'api.write',
    'notifications.settings.update'
  ],
  
  attorney: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update', 'profile.documents.upload', 'profile.documents.delete',
    'attorney.dashboard', 'attorney.clients.access', 'attorney.documents.sign',
    'attorney.applications.submit.on_behalf', 'attorney.audit.view',
    'payments.initiate', 'payments.history.view',
    'api.read',
    'notifications.settings.update'
  ],
  
  government: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update',
    'citizen.applications.view', 'citizen.documents.view',
    'business.dashboard', 'employer.dashboard',
    'payments.history.view',
    'security.audit.logs',
    'api.read',
    'notifications.send', 'notifications.settings.update'
  ],
  
  donor: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable',
    'profile.view', 'profile.update',
    'payments.history.view',
    'security.audit.logs',
    'api.read',
    'notifications.settings.update'
  ],
  
  auditor: [
    'auth.login', 'auth.logout', 'auth.refresh',
    'profile.view',
    'citizen.applications.view', 'citizen.documents.view',
    'business.dashboard', 'employer.dashboard', 'attorney.dashboard',
    'payments.history.view',
    'security.dashboard', 'security.heatmap.view', 'security.audit.logs',
    'breaches.incidents.view', 'breaches.events.timeline',
    'api.read'
  ],
  
  pilot_admin: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update',
    'security.audit.logs',
    'api.read', 'api.write',
    'localization.translations.edit',
    'notifications.settings.update'
  ],
  
  security_admin: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update',
    'security.dashboard', 'security.heatmap.view', 'security.ip.analysis',
    'security.user.block', 'security.user.unblock', 'security.audit.logs',
    'breaches.incidents.view', 'breaches.events.timeline',
    'api.read',
    'admin.users.manage'
  ],
  
  breaches_admin: [
    'auth.login', 'auth.logout', 'auth.refresh', 'auth.mfa.enable', 'auth.mfa.disable',
    'profile.view', 'profile.update',
    'security.dashboard', 'security.audit.logs',
    'breaches.incidents.view', 'breaches.incidents.manage',
    'breaches.events.timeline', 'breaches.escalation.trigger',
    'api.read',
    'notifications.send'
  ],
  
  super_admin: ['*'] // Full access
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPermissionsByModule(module: PermissionModule): PermissionDefinition[] {
  return PERMISSIONS.filter(p => p.module === module);
}

export function getPermissionsByRisk(risk: PermissionDefinition['risk']): PermissionDefinition[] {
  return PERMISSIONS.filter(p => p.risk === risk);
}

export function getPermissionsByCategory(category: PermissionDefinition['category']): PermissionDefinition[] {
  return PERMISSIONS.filter(p => p.category === category);
}

export function getPermissionDefinition(key: string): PermissionDefinition | undefined {
  return PERMISSIONS.find(p => p.key === key);
}

export function getRolePermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasRolePermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

// ============================================================================
// STATISTICS
// ============================================================================

export const PERMISSION_STATS = {
  total: PERMISSIONS.length,
  byModule: PERMISSION_MODULES.reduce((acc, mod) => {
    acc[mod] = PERMISSIONS.filter(p => p.module === mod).length;
    return acc;
  }, {} as Record<string, number>),
  byRisk: {
    low: PERMISSIONS.filter(p => p.risk === 'low').length,
    medium: PERMISSIONS.filter(p => p.risk === 'medium').length,
    high: PERMISSIONS.filter(p => p.risk === 'high').length,
    critical: PERMISSIONS.filter(p => p.risk === 'critical').length,
  },
  byCategory: {
    read: PERMISSIONS.filter(p => p.category === 'read').length,
    write: PERMISSIONS.filter(p => p.category === 'write').length,
    admin: PERMISSIONS.filter(p => p.category === 'admin').length,
    system: PERMISSIONS.filter(p => p.category === 'system').length,
  }
};
