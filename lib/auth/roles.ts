// lib/auth/roles.ts
// IVYAR RBAC System v2.0

export type Permission = 
  | 'view_public' | 'register'
  | 'dashboard_view' | 'profile_manage' | 'applications_create' | 'applications_view' | 'documents_upload' | 'documents_view' | 'notifications_view'
  | 'company_manage' | 'contracts_manage' | 'payments_use' | 'invoices_manage' | 'api_basic'
  | 'employees_manage' | 'employees_verify' | 'hr_integrations' | 'bulk_applications'
  | 'client_access' | 'client_documents' | 'digital_signatures' | 'submit_on_behalf' | 'legal_templates'
  | 'gov_dashboard' | 'gov_reports' | 'gov_approvals' | 'gov_statistics' | 'ministry_manage'
  | 'donor_dashboard' | 'donor_reports' | 'funding_track' | 'impact_analytics'
  | 'audit_logs' | 'audit_reports' | 'compliance_check' | 'read_only_all'
  | 'logs_view' | 'modules_test' | 'security_center' | 'heatmap_view' | 'ip_analysis' | 'user_block' | 'incidents_view' | 'incidents_manage' | 'users_manage' | 'roles_manage' | 'settings_manage' | 'billing_manage' | 'api_admin'
  | '*';

export type RoleCode = 'public' | 'citizen' | 'business' | 'employer' | 'attorney' | 'government' | 'donor' | 'auditor' | 'pilot_admin' | 'security_admin' | 'breaches_admin' | 'super_admin';

export interface Role {
  code: RoleCode;
  name: string;
  nameUk: string;
  level: number;
  permissions: Permission[];
  routes: string[];
  canCreate: RoleCode[];
  pricing: { type: 'free' | 'subscription' | 'transaction' | 'contract' | 'internal'; monthly?: number; annual?: number; };
}

export const ROLES: Record<RoleCode, Role> = {
  public: { code: 'public', name: 'Public', nameUk: 'Публічний', level: 0, permissions: ['view_public', 'register'], routes: ['/login', '/register', '/info', '/public', '/pricing'], canCreate: [], pricing: { type: 'free' } },
  citizen: { code: 'citizen', name: 'Citizen', nameUk: 'Громадянин', level: 1, permissions: ['view_public', 'dashboard_view', 'profile_manage', 'applications_create', 'applications_view', 'documents_upload', 'documents_view', 'notifications_view'], routes: ['/client', '/client/*', '/profile', '/applications', '/documents'], canCreate: [], pricing: { type: 'free' } },
  business: { code: 'business', name: 'Business', nameUk: 'Бізнес', level: 2, permissions: ['view_public', 'dashboard_view', 'profile_manage', 'applications_create', 'applications_view', 'documents_upload', 'documents_view', 'notifications_view', 'company_manage', 'contracts_manage', 'payments_use', 'invoices_manage', 'api_basic'], routes: ['/business', '/business/*', '/contracts', '/payments', '/api-access'], canCreate: ['citizen'], pricing: { type: 'subscription', monthly: 19 } },
  employer: { code: 'employer', name: 'Employer', nameUk: 'Роботодавець', level: 3, permissions: ['view_public', 'dashboard_view', 'profile_manage', 'applications_create', 'applications_view', 'documents_upload', 'documents_view', 'notifications_view', 'company_manage', 'contracts_manage', 'payments_use', 'employees_manage', 'employees_verify', 'hr_integrations', 'bulk_applications'], routes: ['/employer', '/employer/*', '/employees', '/hr', '/verification'], canCreate: ['citizen', 'business'], pricing: { type: 'subscription', monthly: 49 } },
  attorney: { code: 'attorney', name: 'Attorney', nameUk: 'Юрист', level: 4, permissions: ['view_public', 'dashboard_view', 'profile_manage', 'applications_create', 'applications_view', 'documents_upload', 'documents_view', 'notifications_view', 'client_access', 'client_documents', 'digital_signatures', 'submit_on_behalf', 'legal_templates'], routes: ['/legal', '/legal/*', '/clients', '/signatures', '/templates'], canCreate: ['citizen'], pricing: { type: 'subscription', monthly: 99 } },
  government: { code: 'government', name: 'Government Official', nameUk: 'Державний службовець', level: 6, permissions: ['view_public', 'dashboard_view', 'applications_view', 'documents_view', 'gov_dashboard', 'gov_reports', 'gov_approvals', 'gov_statistics', 'ministry_manage', 'audit_logs'], routes: ['/gov', '/gov/*', '/ministry', '/approvals', '/statistics'], canCreate: ['citizen', 'business', 'employer'], pricing: { type: 'contract', annual: 50000 } },
  donor: { code: 'donor', name: 'Donor Representative', nameUk: 'Представник донора', level: 5, permissions: ['view_public', 'dashboard_view', 'donor_dashboard', 'donor_reports', 'funding_track', 'impact_analytics', 'audit_logs'], routes: ['/donor', '/donor/*', '/funding', '/impact', '/reports'], canCreate: [], pricing: { type: 'contract', annual: 25000 } },
  auditor: { code: 'auditor', name: 'External Auditor', nameUk: 'Зовнішній аудитор', level: 5, permissions: ['view_public', 'audit_logs', 'audit_reports', 'compliance_check', 'read_only_all'], routes: ['/audit', '/audit/*', '/compliance', '/logs'], canCreate: [], pricing: { type: 'contract', annual: 10000 } },
  pilot_admin: { code: 'pilot_admin', name: 'Pilot Admin', nameUk: 'Тестовий адміністратор', level: 7, permissions: ['view_public', 'dashboard_view', 'logs_view', 'modules_test'], routes: ['/admin/pilot', '/admin/logs', '/admin/test'], canCreate: [], pricing: { type: 'internal' } },
  security_admin: { code: 'security_admin', name: 'Security Admin', nameUk: 'Адміністратор безпеки', level: 8, permissions: ['view_public', 'dashboard_view', 'logs_view', 'security_center', 'heatmap_view', 'ip_analysis', 'user_block', 'audit_logs'], routes: ['/admin/security', '/admin/security/*', '/admin/heatmap', '/admin/ip'], canCreate: ['pilot_admin'], pricing: { type: 'internal' } },
  breaches_admin: { code: 'breaches_admin', name: 'Breaches Admin', nameUk: 'Адміністратор інцидентів', level: 8, permissions: ['view_public', 'dashboard_view', 'logs_view', 'incidents_view', 'incidents_manage', 'audit_logs'], routes: ['/admin/breaches', '/admin/breaches/*', '/admin/incidents'], canCreate: [], pricing: { type: 'internal' } },
  super_admin: { code: 'super_admin', name: 'Super Admin', nameUk: 'Суперадміністратор', level: 10, permissions: ['*'], routes: ['*'], canCreate: ['public', 'citizen', 'business', 'employer', 'attorney', 'government', 'donor', 'auditor', 'pilot_admin', 'security_admin', 'breaches_admin', 'super_admin'], pricing: { type: 'internal' } }
};

export function hasPermission(role: RoleCode, permission: Permission): boolean {
  const r = ROLES[role];
  return r.permissions.includes('*') || r.permissions.includes(permission);
}

export function canAccessRoute(role: RoleCode, route: string): boolean {
  const r = ROLES[role];
  if (r.routes.includes('*')) return true;
  return r.routes.some(p => p.endsWith('/*') ? route.startsWith(p.slice(0, -2)) : route === p);
}

export function canCreateRole(creator: RoleCode, target: RoleCode): boolean {
  return ROLES[creator].canCreate.includes(target);
}
