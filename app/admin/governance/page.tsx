'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// IMPORTS (These would come from lib/auth in production)
// ============================================================================

// Permission definitions
const PERMISSION_MODULES = [
  'auth', 'profile', 'citizen', 'business', 'employer', 'attorney',
  'payments', 'api', 'localization', 'notifications', 'security',
  'breaches', 'admin'
];

interface PermissionDefinition {
  key: string;
  module: string;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  category: 'read' | 'write' | 'admin' | 'system';
}

// Complete 54 permissions
const PERMISSIONS: PermissionDefinition[] = [
  // Auth (5)
  { key: 'auth.login', module: 'auth', name: 'Login', description: 'Authenticate into the platform', risk: 'low', category: 'system' },
  { key: 'auth.logout', module: 'auth', name: 'Logout', description: 'End current session', risk: 'low', category: 'system' },
  { key: 'auth.refresh', module: 'auth', name: 'Refresh Token', description: 'Refresh authentication tokens', risk: 'low', category: 'system' },
  { key: 'auth.mfa.enable', module: 'auth', name: 'Enable MFA', description: 'Enable multi-factor authentication', risk: 'medium', category: 'write' },
  { key: 'auth.mfa.disable', module: 'auth', name: 'Disable MFA', description: 'Disable multi-factor authentication', risk: 'high', category: 'write' },
  // Profile (4)
  { key: 'profile.view', module: 'profile', name: 'View Profile', description: 'View own user profile', risk: 'low', category: 'read' },
  { key: 'profile.update', module: 'profile', name: 'Update Profile', description: 'Modify own profile information', risk: 'low', category: 'write' },
  { key: 'profile.documents.upload', module: 'profile', name: 'Upload Documents', description: 'Upload personal documents', risk: 'low', category: 'write' },
  { key: 'profile.documents.delete', module: 'profile', name: 'Delete Documents', description: 'Remove personal documents', risk: 'medium', category: 'write' },
  // Citizen (5)
  { key: 'citizen.dashboard', module: 'citizen', name: 'Citizen Dashboard', description: 'Access citizen dashboard', risk: 'low', category: 'read' },
  { key: 'citizen.applications.create', module: 'citizen', name: 'Create Applications', description: 'Submit new applications', risk: 'low', category: 'write' },
  { key: 'citizen.applications.view', module: 'citizen', name: 'View Applications', description: 'View own applications', risk: 'low', category: 'read' },
  { key: 'citizen.applications.update', module: 'citizen', name: 'Update Applications', description: 'Modify pending applications', risk: 'low', category: 'write' },
  { key: 'citizen.documents.view', module: 'citizen', name: 'View Documents', description: 'View personal documents', risk: 'low', category: 'read' },
  // Business (7)
  { key: 'business.dashboard', module: 'business', name: 'Business Dashboard', description: 'Access business dashboard', risk: 'low', category: 'read' },
  { key: 'business.company.manage', module: 'business', name: 'Manage Company', description: 'Manage company profile', risk: 'medium', category: 'write' },
  { key: 'business.documents.manage', module: 'business', name: 'Manage Documents', description: 'Manage business documents', risk: 'medium', category: 'write' },
  { key: 'business.contracts.create', module: 'business', name: 'Create Contracts', description: 'Create new contracts', risk: 'medium', category: 'write' },
  { key: 'business.contracts.sign', module: 'business', name: 'Sign Contracts', description: 'Digitally sign contracts', risk: 'high', category: 'write' },
  { key: 'business.payments.process', module: 'business', name: 'Process Payments', description: 'Execute payments', risk: 'high', category: 'write' },
  { key: 'business.api.access', module: 'business', name: 'API Access', description: 'Access business API', risk: 'medium', category: 'read' },
  // Employer (5)
  { key: 'employer.dashboard', module: 'employer', name: 'Employer Dashboard', description: 'Access employer dashboard', risk: 'low', category: 'read' },
  { key: 'employer.employees.manage', module: 'employer', name: 'Manage Employees', description: 'Manage employee records', risk: 'medium', category: 'write' },
  { key: 'employer.documents.verify', module: 'employer', name: 'Verify Documents', description: 'Verify employee documents', risk: 'medium', category: 'write' },
  { key: 'employer.hr.integrations', module: 'employer', name: 'HR Integrations', description: 'Connect HR systems', risk: 'high', category: 'admin' },
  { key: 'employer.applications.submit', module: 'employer', name: 'Submit Applications', description: 'Submit on behalf of company', risk: 'medium', category: 'write' },
  // Attorney (5)
  { key: 'attorney.dashboard', module: 'attorney', name: 'Attorney Dashboard', description: 'Access legal dashboard', risk: 'low', category: 'read' },
  { key: 'attorney.clients.access', module: 'attorney', name: 'Client Access', description: 'Access client information', risk: 'high', category: 'read' },
  { key: 'attorney.documents.sign', module: 'attorney', name: 'Sign Documents', description: 'Sign legal documents', risk: 'high', category: 'write' },
  { key: 'attorney.applications.submit.on_behalf', module: 'attorney', name: 'Submit on Behalf', description: 'Submit for clients', risk: 'high', category: 'write' },
  { key: 'attorney.audit.view', module: 'attorney', name: 'View Audit', description: 'View case audit history', risk: 'medium', category: 'read' },
  // Payments (4)
  { key: 'payments.initiate', module: 'payments', name: 'Initiate Payment', description: 'Start payment transactions', risk: 'high', category: 'write' },
  { key: 'payments.refund', module: 'payments', name: 'Process Refund', description: 'Issue payment refunds', risk: 'critical', category: 'write' },
  { key: 'payments.history.view', module: 'payments', name: 'View History', description: 'View transaction history', risk: 'low', category: 'read' },
  { key: 'payments.billing.manage', module: 'payments', name: 'Manage Billing', description: 'Configure billing', risk: 'high', category: 'admin' },
  // API (5)
  { key: 'api.read', module: 'api', name: 'API Read', description: 'Read data via API', risk: 'low', category: 'read' },
  { key: 'api.write', module: 'api', name: 'API Write', description: 'Write data via API', risk: 'medium', category: 'write' },
  { key: 'api.admin', module: 'api', name: 'API Admin', description: 'Administer API', risk: 'high', category: 'admin' },
  { key: 'api.keys.create', module: 'api', name: 'Create Keys', description: 'Generate API keys', risk: 'high', category: 'admin' },
  { key: 'api.keys.revoke', module: 'api', name: 'Revoke Keys', description: 'Invalidate API keys', risk: 'high', category: 'admin' },
  // Localization (3)
  { key: 'localization.languages.manage', module: 'localization', name: 'Manage Languages', description: 'Manage supported languages', risk: 'medium', category: 'admin' },
  { key: 'localization.translations.edit', module: 'localization', name: 'Edit Translations', description: 'Modify translations', risk: 'low', category: 'write' },
  { key: 'localization.translations.publish', module: 'localization', name: 'Publish Translations', description: 'Deploy translations', risk: 'medium', category: 'admin' },
  // Notifications (3)
  { key: 'notifications.send', module: 'notifications', name: 'Send Notifications', description: 'Send system notifications', risk: 'medium', category: 'write' },
  { key: 'notifications.templates.manage', module: 'notifications', name: 'Manage Templates', description: 'Manage notification templates', risk: 'medium', category: 'admin' },
  { key: 'notifications.settings.update', module: 'notifications', name: 'Update Settings', description: 'Configure notification settings', risk: 'low', category: 'write' },
  // Security (6)
  { key: 'security.dashboard', module: 'security', name: 'Security Dashboard', description: 'Access security dashboard', risk: 'high', category: 'read' },
  { key: 'security.heatmap.view', module: 'security', name: 'View Heatmap', description: 'View threat heatmap', risk: 'medium', category: 'read' },
  { key: 'security.ip.analysis', module: 'security', name: 'IP Analysis', description: 'Analyze IP patterns', risk: 'high', category: 'read' },
  { key: 'security.user.block', module: 'security', name: 'Block User', description: 'Block user accounts', risk: 'critical', category: 'admin' },
  { key: 'security.user.unblock', module: 'security', name: 'Unblock User', description: 'Restore blocked users', risk: 'high', category: 'admin' },
  { key: 'security.audit.logs', module: 'security', name: 'Audit Logs', description: 'Access audit logs', risk: 'high', category: 'read' },
  // Breaches (4)
  { key: 'breaches.incidents.view', module: 'breaches', name: 'View Incidents', description: 'View security incidents', risk: 'high', category: 'read' },
  { key: 'breaches.incidents.manage', module: 'breaches', name: 'Manage Incidents', description: 'Manage incidents', risk: 'critical', category: 'admin' },
  { key: 'breaches.events.timeline', module: 'breaches', name: 'Event Timeline', description: 'View incident timeline', risk: 'medium', category: 'read' },
  { key: 'breaches.escalation.trigger', module: 'breaches', name: 'Trigger Escalation', description: 'Escalate incidents', risk: 'critical', category: 'admin' },
  // Admin (6)
  { key: 'admin.users.manage', module: 'admin', name: 'Manage Users', description: 'Manage user accounts', risk: 'critical', category: 'admin' },
  { key: 'admin.roles.manage', module: 'admin', name: 'Manage Roles', description: 'Manage roles', risk: 'critical', category: 'admin' },
  { key: 'admin.permissions.manage', module: 'admin', name: 'Manage Permissions', description: 'Manage permissions', risk: 'critical', category: 'admin' },
  { key: 'admin.modules.enable', module: 'admin', name: 'Enable Modules', description: 'Activate modules', risk: 'high', category: 'admin' },
  { key: 'admin.modules.disable', module: 'admin', name: 'Disable Modules', description: 'Deactivate modules', risk: 'critical', category: 'admin' },
  { key: 'admin.settings.update', module: 'admin', name: 'Update Settings', description: 'Modify system settings', risk: 'high', category: 'admin' },
];

// Roles
interface Role {
  code: string;
  name: string;
  level: number;
  permissionCount: number;
  userCount: number;
  type: 'user' | 'partner' | 'admin';
}

const ROLES: Role[] = [
  { code: 'citizen', name: 'Citizen', level: 1, permissionCount: 17, userCount: 8920, type: 'user' },
  { code: 'business', name: 'Business', level: 2, permissionCount: 21, userCount: 2340, type: 'user' },
  { code: 'employer', name: 'Employer', level: 3, permissionCount: 23, userCount: 890, type: 'user' },
  { code: 'attorney', name: 'Attorney', level: 4, permissionCount: 18, userCount: 156, type: 'user' },
  { code: 'government', name: 'Government', level: 6, permissionCount: 15, userCount: 45, type: 'partner' },
  { code: 'donor', name: 'Donor', level: 5, permissionCount: 10, userCount: 12, type: 'partner' },
  { code: 'auditor', name: 'Auditor', level: 5, permissionCount: 16, userCount: 8, type: 'partner' },
  { code: 'pilot_admin', name: 'Pilot Admin', level: 7, permissionCount: 11, userCount: 5, type: 'admin' },
  { code: 'security_admin', name: 'Security Admin', level: 8, permissionCount: 14, userCount: 3, type: 'admin' },
  { code: 'breaches_admin', name: 'Breaches Admin', level: 8, permissionCount: 13, userCount: 2, type: 'admin' },
  { code: 'super_admin', name: 'Super Admin', level: 10, permissionCount: 54, userCount: 2, type: 'admin' },
];

// Policies
interface Policy {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'draft' | 'restricted' | 'deprecated';
  rules: number;
}

const POLICIES: Policy[] = [
  { id: 'POL-001', name: 'Module Access Policy', type: 'access', status: 'active', rules: 2 },
  { id: 'POL-002', name: 'Admin Access Policy', type: 'access', status: 'active', rules: 2 },
  { id: 'POL-003', name: 'Security Operations Policy', type: 'security', status: 'active', rules: 2 },
  { id: 'POL-004', name: 'Incident Escalation Policy', type: 'escalation', status: 'active', rules: 2 },
  { id: 'POL-005', name: 'Data Protection Policy', type: 'data', status: 'active', rules: 2 },
];

// Users (sample)
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended' | 'blocked';
  lastLogin: string;
}

const USERS: User[] = [
  { id: '1', name: 'Olena Kovalenko', email: 'o.kovalenko@gov.ua', role: 'super_admin', status: 'active', lastLogin: '2 min ago' },
  { id: '2', name: 'John Smith', email: 'j.smith@company.com', role: 'business', status: 'active', lastLogin: '1 hour ago' },
  { id: '3', name: 'Maria Garcia', email: 'm.garcia@legal.com', role: 'attorney', status: 'active', lastLogin: '3 hours ago' },
  { id: '4', name: 'Ahmed Hassan', email: 'a.hassan@org.com', role: 'employer', status: 'pending', lastLogin: 'Never' },
  { id: '5', name: 'Sarah Johnson', email: 's.johnson@usaid.gov', role: 'donor', status: 'active', lastLogin: '1 day ago' },
  { id: '6', name: 'Ivan Petrenko', email: 'i.petrenko@audit.com', role: 'auditor', status: 'active', lastLogin: '2 days ago' },
];

// Audit entries
interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  result: 'success' | 'failure' | 'denied';
}

const AUDIT_LOG: AuditEntry[] = [
  { id: '1', timestamp: '2026-01-06 14:12', actor: 'super_admin', action: 'update_role', target: 'business', result: 'success' },
  { id: '2', timestamp: '2026-01-06 14:08', actor: 'security_admin', action: 'user_block', target: '45.33.32.156', result: 'success' },
  { id: '3', timestamp: '2026-01-06 13:55', actor: 'admin@ivyar.org', action: 'role_assign', target: 'j.smith@company.com', result: 'success' },
  { id: '4', timestamp: '2026-01-06 13:44', actor: 'system', action: 'policy_check', target: 'POL-001', result: 'success' },
  { id: '5', timestamp: '2026-01-06 13:30', actor: 'WAF', action: 'incident_create', target: 'INC-005', result: 'success' },
];

// Consistency checks
interface ConsistencyCheck {
  id: string;
  name: string;
  passed: boolean;
  severity: 'info' | 'warning' | 'critical';
}

const CONSISTENCY_CHECKS: ConsistencyCheck[] = [
  { id: '1', name: 'No roles without permissions', passed: true, severity: 'critical' },
  { id: '2', name: 'No users without roles', passed: true, severity: 'critical' },
  { id: '3', name: 'No orphan permissions', passed: true, severity: 'warning' },
  { id: '4', name: 'No conflicting policies', passed: true, severity: 'critical' },
  { id: '5', name: 'Super admin has wildcard', passed: true, severity: 'critical' },
  { id: '6', name: 'All roles have auth permissions', passed: true, severity: 'warning' },
  { id: '7', name: 'Critical perms only for admins', passed: true, severity: 'warning' },
  { id: '8', name: 'No duplicate permissions', passed: true, severity: 'info' },
  { id: '9', name: 'Module permission coverage', passed: true, severity: 'warning' },
  { id: '10', name: 'Citizen least privilege', passed: true, severity: 'warning' },
  { id: '11', name: 'Security roles configured', passed: true, severity: 'critical' },
  { id: '12', name: 'Profile access consistency', passed: true, severity: 'info' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function AccessGovernancePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roles' | 'permissions' | 'policies' | 'users' | 'audit'>('dashboard');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [permissionFilter, setPermissionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalUsers = ROLES.reduce((sum, r) => sum + r.userCount, 0);
  const passedChecks = CONSISTENCY_CHECKS.filter(c => c.passed).length;

  const filteredPermissions = PERMISSIONS.filter(p => {
    if (moduleFilter !== 'all' && p.module !== moduleFilter) return false;
    if (permissionFilter && !p.key.toLowerCase().includes(permissionFilter.toLowerCase())) return false;
    return true;
  });

  const getRoleColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partner': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'draft': return 'bg-blue-500/20 text-blue-400';
      case 'restricted': return 'bg-orange-500/20 text-orange-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'blocked': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">IV</div>
              <div>
                <div className="font-bold text-lg">IVYAR</div>
                <div className="text-xs text-[#8B949E]">Access Governance</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#161B22] rounded-lg border border-[#1F242C] text-sm text-[#8B949E]">
              {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
            </div>
            <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              {passedChecks}/{CONSISTENCY_CHECKS.length} Checks Passed
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Access Governance</h1>
            <p className="text-[#8B949E]">Single source of truth for roles, permissions, and policies</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-3xl font-bold text-[#00E0B8]">{totalUsers.toLocaleString()}</div>
              <div className="text-sm text-[#8B949E]">Total Users</div>
            </div>
            <div className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-3xl font-bold text-[#00A3FF]">{ROLES.length}</div>
              <div className="text-sm text-[#8B949E]">Active Roles</div>
            </div>
            <div className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-3xl font-bold text-[#F59E0B]">{PERMISSIONS.length}</div>
              <div className="text-sm text-[#8B949E]">Permissions</div>
            </div>
            <div className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-3xl font-bold text-green-400">{passedChecks}/{CONSISTENCY_CHECKS.length}</div>
              <div className="text-sm text-[#8B949E]">Policy Checks Passed</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#161B22] rounded-xl border border-[#1F242C] w-fit">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'roles', label: 'Roles', icon: '🎭' },
              { key: 'permissions', label: 'Permissions', icon: '🔐' },
              { key: 'policies', label: 'Policies', icon: '📜' },
              { key: 'users', label: 'Users', icon: '👥' },
              { key: 'audit', label: 'Audit Log', icon: '📋' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key ? 'bg-[#00E0B8] text-[#0D1117]' : 'hover:bg-[#1F242C] text-[#8B949E]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Consistency Checker */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">Consistency Checker</h3>
                  <span className={`px-2 py-1 rounded text-xs ${passedChecks === CONSISTENCY_CHECKS.length ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {passedChecks === CONSISTENCY_CHECKS.length ? 'All Passed' : `${CONSISTENCY_CHECKS.length - passedChecks} Issues`}
                  </span>
                </div>
                <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                  {CONSISTENCY_CHECKS.map(check => (
                    <div key={check.id} className="flex items-center justify-between p-2 bg-[#0D1117] rounded-lg">
                      <span className="text-sm">{check.name}</span>
                      <span className={check.passed ? 'text-green-400' : 'text-red-400'}>
                        {check.passed ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles Overview */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Roles Overview</h3>
                </div>
                <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                  {ROLES.sort((a, b) => b.level - a.level).map(role => (
                    <div key={role.code} className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg">
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-[#8B949E]">{role.permissionCount} permissions</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-xs border ${getRoleColor(role.type)}`}>
                          Lvl {role.level}
                        </span>
                        <div className="text-xs text-[#8B949E] mt-1">{role.userCount.toLocaleString()} users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <button onClick={() => setActiveTab('audit')} className="text-xs text-[#00E0B8] hover:underline">
                    View all →
                  </button>
                </div>
                <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                  {AUDIT_LOG.map(entry => (
                    <div key={entry.id} className="p-3 bg-[#0D1117] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{entry.actor}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${entry.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {entry.result}
                        </span>
                      </div>
                      <div className="text-xs text-[#8B949E]">{entry.action} → {entry.target}</div>
                      <div className="text-xs text-[#3D444D] mt-1">{entry.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLES.sort((a, b) => b.level - a.level).map(role => (
                <div
                  key={role.code}
                  className={`p-5 bg-[#161B22] border rounded-xl cursor-pointer transition-all ${
                    selectedRole === role.code ? 'border-[#00E0B8]' : 'border-[#1F242C] hover:border-[#3D444D]'
                  }`}
                  onClick={() => setSelectedRole(selectedRole === role.code ? null : role.code)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{role.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getRoleColor(role.type)}`}>
                      {role.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-[#8B949E]">Level</div>
                      <div className="font-medium">{role.level}</div>
                    </div>
                    <div>
                      <div className="text-[#8B949E]">Permissions</div>
                      <div className="font-medium">{role.permissionCount}</div>
                    </div>
                    <div>
                      <div className="text-[#8B949E]">Users</div>
                      <div className="font-medium">{role.userCount.toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm hover:border-[#00E0B8] transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#1F242C] flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={permissionFilter}
                  onChange={(e) => setPermissionFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm focus:border-[#00E0B8] focus:outline-none w-64"
                />
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm focus:border-[#00E0B8] focus:outline-none"
                >
                  <option value="all">All Modules</option>
                  {PERMISSION_MODULES.map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
                <span className="text-sm text-[#8B949E]">{filteredPermissions.length} permissions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Permission</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Module</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Risk</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermissions.slice(0, 20).map(perm => (
                      <tr key={perm.key} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-3 font-mono text-sm text-[#00E0B8]">{perm.key}</td>
                        <td className="px-4 py-3 text-sm">{perm.description}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-0.5 bg-[#1F242C] rounded">{perm.module}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-0.5 rounded ${getRiskColor(perm.risk)}`}>{perm.risk}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#8B949E]">{perm.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPermissions.length > 20 && (
                <div className="p-4 text-center text-sm text-[#8B949E]">
                  Showing 20 of {filteredPermissions.length} permissions
                </div>
              )}
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {POLICIES.map(policy => (
                <div key={policy.id} className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#8B949E]">{policy.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{policy.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#8B949E]">
                    <span>Type: {policy.type}</span>
                    <span>Rules: {policy.rules}</span>
                  </div>
                  <button className="w-full mt-4 px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm hover:border-[#00E0B8] transition-colors">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Last Login</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-[#8B949E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {USERS.map(user => (
                      <tr key={user.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-4 font-medium">{user.name}</td>
                        <td className="px-4 py-4 text-sm text-[#8B949E]">{user.email}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 bg-[#1F242C] rounded text-sm">{user.role}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#8B949E]">{user.lastLogin}</td>
                        <td className="px-4 py-4 text-right">
                          <button className="px-3 py-1 bg-[#0D1117] border border-[#1F242C] rounded text-sm hover:border-[#00E0B8]">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Time</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Actor</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Target</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_LOG.map(entry => (
                      <tr key={entry.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-3 text-sm text-[#8B949E]">{entry.timestamp}</td>
                        <td className="px-4 py-3 font-medium">{entry.actor}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-[#1F242C] rounded text-sm">{entry.action}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">{entry.target}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${entry.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {entry.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link href="/admin/hub" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] transition-colors flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-medium">Admin Hub</div>
                <div className="text-xs text-[#8B949E]">Central dashboard</div>
              </div>
            </Link>
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] transition-colors flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-medium">Security Center</div>
                <div className="text-xs text-[#8B949E]">Monitor threats</div>
              </div>
            </Link>
            <Link href="/admin/breaches" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] transition-colors flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-medium">Breaches Center</div>
                <div className="text-xs text-[#8B949E]">Incidents</div>
              </div>
            </Link>
            <Link href="/admin/access" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] transition-colors flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="font-medium">Access Control</div>
                <div className="text-xs text-[#8B949E]">Manage users</div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1600px] mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | Access Governance Module v2.0
        </div>
      </footer>
    </div>
  );
}
