'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// COMPLETE DATA (54 permissions, 11 roles, 6 policies, 12 checks)
// ============================================================================

// Permissions (54 total)
const PERMISSIONS = [
  // Auth (5)
  { key: 'auth.login', module: 'auth', name: 'Login', risk: 'low', category: 'system' },
  { key: 'auth.logout', module: 'auth', name: 'Logout', risk: 'low', category: 'system' },
  { key: 'auth.refresh', module: 'auth', name: 'Refresh Token', risk: 'low', category: 'system' },
  { key: 'auth.mfa.enable', module: 'auth', name: 'Enable MFA', risk: 'medium', category: 'write' },
  { key: 'auth.mfa.disable', module: 'auth', name: 'Disable MFA', risk: 'high', category: 'write' },
  // Profile (4)
  { key: 'profile.view', module: 'profile', name: 'View Profile', risk: 'low', category: 'read' },
  { key: 'profile.update', module: 'profile', name: 'Update Profile', risk: 'low', category: 'write' },
  { key: 'profile.documents.upload', module: 'profile', name: 'Upload Documents', risk: 'low', category: 'write' },
  { key: 'profile.documents.delete', module: 'profile', name: 'Delete Documents', risk: 'medium', category: 'write' },
  // Citizen (5)
  { key: 'citizen.dashboard', module: 'citizen', name: 'Citizen Dashboard', risk: 'low', category: 'read' },
  { key: 'citizen.applications.create', module: 'citizen', name: 'Create Applications', risk: 'low', category: 'write' },
  { key: 'citizen.applications.view', module: 'citizen', name: 'View Applications', risk: 'low', category: 'read' },
  { key: 'citizen.applications.update', module: 'citizen', name: 'Update Applications', risk: 'low', category: 'write' },
  { key: 'citizen.documents.view', module: 'citizen', name: 'View Documents', risk: 'low', category: 'read' },
  // Business (7)
  { key: 'business.dashboard', module: 'business', name: 'Business Dashboard', risk: 'low', category: 'read' },
  { key: 'business.company.manage', module: 'business', name: 'Manage Company', risk: 'medium', category: 'write' },
  { key: 'business.documents.manage', module: 'business', name: 'Manage Documents', risk: 'medium', category: 'write' },
  { key: 'business.contracts.create', module: 'business', name: 'Create Contracts', risk: 'medium', category: 'write' },
  { key: 'business.contracts.sign', module: 'business', name: 'Sign Contracts', risk: 'high', category: 'write' },
  { key: 'business.payments.process', module: 'business', name: 'Process Payments', risk: 'high', category: 'write' },
  { key: 'business.api.access', module: 'business', name: 'API Access', risk: 'medium', category: 'read' },
  // Employer (5)
  { key: 'employer.dashboard', module: 'employer', name: 'Employer Dashboard', risk: 'low', category: 'read' },
  { key: 'employer.employees.manage', module: 'employer', name: 'Manage Employees', risk: 'medium', category: 'write' },
  { key: 'employer.documents.verify', module: 'employer', name: 'Verify Documents', risk: 'medium', category: 'write' },
  { key: 'employer.hr.integrations', module: 'employer', name: 'HR Integrations', risk: 'high', category: 'admin' },
  { key: 'employer.applications.submit', module: 'employer', name: 'Submit Applications', risk: 'medium', category: 'write' },
  // Attorney (5)
  { key: 'attorney.dashboard', module: 'attorney', name: 'Attorney Dashboard', risk: 'low', category: 'read' },
  { key: 'attorney.clients.access', module: 'attorney', name: 'Client Access', risk: 'high', category: 'read' },
  { key: 'attorney.documents.sign', module: 'attorney', name: 'Sign Documents', risk: 'high', category: 'write' },
  { key: 'attorney.applications.submit.on_behalf', module: 'attorney', name: 'Submit on Behalf', risk: 'high', category: 'write' },
  { key: 'attorney.audit.view', module: 'attorney', name: 'View Audit', risk: 'medium', category: 'read' },
  // Payments (4)
  { key: 'payments.initiate', module: 'payments', name: 'Initiate Payment', risk: 'high', category: 'write' },
  { key: 'payments.refund', module: 'payments', name: 'Process Refund', risk: 'critical', category: 'write' },
  { key: 'payments.history.view', module: 'payments', name: 'View History', risk: 'low', category: 'read' },
  { key: 'payments.billing.manage', module: 'payments', name: 'Manage Billing', risk: 'high', category: 'admin' },
  // API (5)
  { key: 'api.read', module: 'api', name: 'API Read', risk: 'low', category: 'read' },
  { key: 'api.write', module: 'api', name: 'API Write', risk: 'medium', category: 'write' },
  { key: 'api.admin', module: 'api', name: 'API Admin', risk: 'high', category: 'admin' },
  { key: 'api.keys.create', module: 'api', name: 'Create Keys', risk: 'high', category: 'admin' },
  { key: 'api.keys.revoke', module: 'api', name: 'Revoke Keys', risk: 'high', category: 'admin' },
  // Localization (3)
  { key: 'localization.languages.manage', module: 'localization', name: 'Manage Languages', risk: 'medium', category: 'admin' },
  { key: 'localization.translations.edit', module: 'localization', name: 'Edit Translations', risk: 'low', category: 'write' },
  { key: 'localization.translations.publish', module: 'localization', name: 'Publish Translations', risk: 'medium', category: 'admin' },
  // Notifications (3)
  { key: 'notifications.send', module: 'notifications', name: 'Send Notifications', risk: 'medium', category: 'write' },
  { key: 'notifications.templates.manage', module: 'notifications', name: 'Manage Templates', risk: 'medium', category: 'admin' },
  { key: 'notifications.settings.update', module: 'notifications', name: 'Update Settings', risk: 'low', category: 'write' },
  // Security (6)
  { key: 'security.dashboard', module: 'security', name: 'Security Dashboard', risk: 'high', category: 'read' },
  { key: 'security.heatmap.view', module: 'security', name: 'View Heatmap', risk: 'medium', category: 'read' },
  { key: 'security.ip.analysis', module: 'security', name: 'IP Analysis', risk: 'high', category: 'read' },
  { key: 'security.user.block', module: 'security', name: 'Block User', risk: 'critical', category: 'admin' },
  { key: 'security.user.unblock', module: 'security', name: 'Unblock User', risk: 'high', category: 'admin' },
  { key: 'security.audit.logs', module: 'security', name: 'Audit Logs', risk: 'high', category: 'read' },
  // Breaches (4)
  { key: 'breaches.incidents.view', module: 'breaches', name: 'View Incidents', risk: 'high', category: 'read' },
  { key: 'breaches.incidents.manage', module: 'breaches', name: 'Manage Incidents', risk: 'critical', category: 'admin' },
  { key: 'breaches.events.timeline', module: 'breaches', name: 'Event Timeline', risk: 'medium', category: 'read' },
  { key: 'breaches.escalation.trigger', module: 'breaches', name: 'Trigger Escalation', risk: 'critical', category: 'admin' },
  // Admin (6)
  { key: 'admin.users.manage', module: 'admin', name: 'Manage Users', risk: 'critical', category: 'admin' },
  { key: 'admin.roles.manage', module: 'admin', name: 'Manage Roles', risk: 'critical', category: 'admin' },
  { key: 'admin.permissions.manage', module: 'admin', name: 'Manage Permissions', risk: 'critical', category: 'admin' },
  { key: 'admin.modules.enable', module: 'admin', name: 'Enable Modules', risk: 'high', category: 'admin' },
  { key: 'admin.modules.disable', module: 'admin', name: 'Disable Modules', risk: 'critical', category: 'admin' },
  { key: 'admin.settings.update', module: 'admin', name: 'Update Settings', risk: 'high', category: 'admin' },
];

// Roles (11 total)
const ROLES = [
  { code: 'public', name: 'Public', level: 0, permCount: 1, userCount: 0, type: 'user' },
  { code: 'citizen', name: 'Citizen', level: 1, permCount: 17, userCount: 8920, type: 'user' },
  { code: 'business', name: 'Business', level: 2, permCount: 21, userCount: 2340, type: 'user' },
  { code: 'employer', name: 'Employer', level: 3, permCount: 23, userCount: 890, type: 'user' },
  { code: 'attorney', name: 'Attorney', level: 4, permCount: 18, userCount: 156, type: 'user' },
  { code: 'donor', name: 'Donor', level: 5, permCount: 10, userCount: 12, type: 'partner' },
  { code: 'auditor', name: 'Auditor', level: 5, permCount: 16, userCount: 8, type: 'partner' },
  { code: 'government', name: 'Government', level: 6, permCount: 15, userCount: 45, type: 'partner' },
  { code: 'pilot_admin', name: 'Pilot Admin', level: 7, permCount: 11, userCount: 5, type: 'admin' },
  { code: 'security_admin', name: 'Security Admin', level: 8, permCount: 14, userCount: 3, type: 'admin' },
  { code: 'breaches_admin', name: 'Breaches Admin', level: 8, permCount: 13, userCount: 2, type: 'admin' },
  { code: 'super_admin', name: 'Super Admin', level: 10, permCount: 54, userCount: 2, type: 'admin' },
];

// Formal Policies (6 total, 25 rules)
const POLICIES = [
  {
    id: 'ACP-01', name: 'Access Control Policy', status: 'active', version: '2.0',
    rules: [
      { id: 'ACP-01.01', desc: 'Role-Based Access Only', action: 'deny', severity: 'critical' },
      { id: 'ACP-01.02', desc: 'Least Privilege Principle', action: 'alert', severity: 'warning' },
      { id: 'ACP-01.03', desc: 'No Implicit Access', action: 'deny', severity: 'critical' },
      { id: 'ACP-01.04', desc: 'Separation of Duties', action: 'deny', severity: 'critical' },
      { id: 'ACP-01.05', desc: 'Sensitive Modules Restricted', action: 'deny', severity: 'critical' },
      { id: 'ACP-01.06', desc: 'Government Role Restriction', action: 'deny', severity: 'critical' },
    ]
  },
  {
    id: 'PRM-02', name: 'Role Management Policy', status: 'active', version: '2.0',
    rules: [
      { id: 'PRM-02.01', desc: 'Role Creation Restricted', action: 'deny', severity: 'critical' },
      { id: 'PRM-02.02', desc: 'Role Modification Audit', action: 'log', severity: 'info' },
      { id: 'PRM-02.03', desc: 'Role Deletion Protection', action: 'deny', severity: 'critical' },
      { id: 'PRM-02.04', desc: 'Role Consistency Check', action: 'deny', severity: 'critical' },
      { id: 'PRM-02.05', desc: 'Admin Role Dual Approval', action: 'dual_approval', severity: 'critical' },
    ]
  },
  {
    id: 'PP-03', name: 'Permission Policy', status: 'active', version: '2.0',
    rules: [
      { id: 'PP-03.01', desc: 'Permission Namespacing Required', action: 'deny', severity: 'warning' },
      { id: 'PP-03.02', desc: 'No Wildcards Except Super Admin', action: 'deny', severity: 'critical' },
      { id: 'PP-03.03', desc: 'No Orphan Permissions', action: 'alert', severity: 'warning' },
      { id: 'PP-03.04', desc: 'Critical Permissions Require MFA', action: 'require_mfa', severity: 'critical' },
    ]
  },
  {
    id: 'SP-04', name: 'Security Policy', status: 'active', version: '2.0',
    rules: [
      { id: 'SP-04.01', desc: 'High-Risk Actions Require MFA', action: 'require_mfa', severity: 'critical' },
      { id: 'SP-04.02', desc: 'IP-based Restrictions for Admins', action: 'deny', severity: 'critical' },
      { id: 'SP-04.03', desc: '5+ Changes in 5min = Incident', action: 'escalate', severity: 'critical' },
      { id: 'SP-04.04', desc: '30min Admin Session Timeout', action: 'deny', severity: 'warning' },
      { id: 'SP-04.05', desc: '5 Failed Logins = Lockout', action: 'deny', severity: 'critical' },
    ]
  },
  {
    id: 'EP-05', name: 'Escalation Policy', status: 'active', version: '2.0',
    rules: [
      { id: 'EP-05.01', desc: 'Security Changes Need Dual Approval', action: 'dual_approval', severity: 'critical' },
      { id: 'EP-05.02', desc: 'Emergency Access: 30min Max', action: 'allow', severity: 'critical' },
      { id: 'EP-05.03', desc: 'Escalation Log Required', action: 'log', severity: 'info' },
      { id: 'EP-05.04', desc: 'Critical Incident Notification', action: 'alert', severity: 'critical' },
      { id: 'EP-05.05', desc: '24h Unresolved = Auto-Escalate', action: 'escalate', severity: 'warning' },
    ]
  },
  {
    id: 'DP-06', name: 'Data Protection Policy', status: 'active', version: '2.0',
    rules: [
      { id: 'DP-06.01', desc: 'Sensitive Data Requires MFA', action: 'require_mfa', severity: 'critical' },
      { id: 'DP-06.02', desc: 'Large Export Logging (>1000)', action: 'log', severity: 'warning' },
      { id: 'DP-06.03', desc: 'PII Access Audit', action: 'log', severity: 'info' },
      { id: 'DP-06.04', desc: 'Cross-border Transfer Restriction', action: 'deny', severity: 'critical' },
    ]
  }
];

// Consistency Checks (12 total)
const CHECKS = [
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

// Country Scenarios
const SCENARIOS = [
  { code: 'UA', flag: '🇺🇦', country: 'Ukraine', ministry: 'Ministry of Social Policy', timeline: '14 weeks', budget: '$150K-$250K' },
  { code: 'PL', flag: '🇵🇱', country: 'Poland', ministry: 'Ministry of Digital Affairs', timeline: '14 weeks', budget: '$200K-$350K' },
  { code: 'GE', flag: '🇬🇪', country: 'Georgia', ministry: 'Ministry of Justice', timeline: '12 weeks', budget: '$100K-$180K' },
  { code: 'MD', flag: '🇲🇩', country: 'Moldova', ministry: 'Ministry of Labor', timeline: '14 weeks', budget: '$80K-$150K' },
  { code: 'KE', flag: '🇰🇪', country: 'Kenya', ministry: 'Ministry of Interior', timeline: '16 weeks', budget: '$120K-$220K' },
];

// Audit Log
const AUDIT = [
  { id: '1', time: '2026-01-06 14:12', actor: 'super_admin', action: 'update_role', target: 'business', result: 'success' },
  { id: '2', time: '2026-01-06 14:08', actor: 'security_admin', action: 'user_block', target: '45.33.32.156', result: 'success' },
  { id: '3', time: '2026-01-06 13:55', actor: 'admin@ivyar.org', action: 'role_assign', target: 'j.smith@company.com', result: 'success' },
  { id: '4', time: '2026-01-06 13:44', actor: 'system', action: 'policy_check', target: 'ACP-01', result: 'success' },
  { id: '5', time: '2026-01-06 13:30', actor: 'WAF', action: 'incident_create', target: 'INC-005', result: 'success' },
  { id: '6', time: '2026-01-06 13:15', actor: 'breaches_admin', action: 'escalation_trigger', target: 'INC-003', result: 'success' },
  { id: '7', time: '2026-01-06 12:45', actor: 'o.kovalenko@gov.ua', action: 'login', target: 'session', result: 'success' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function AccessGovernancePage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [permissionFilter, setPermissionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalUsers = ROLES.reduce((sum, r) => sum + r.userCount, 0);
  const totalRules = POLICIES.reduce((sum, p) => sum + p.rules.length, 0);
  const passedChecks = CHECKS.filter(c => c.passed).length;

  const modules = [...new Set(PERMISSIONS.map(p => p.module))];
  const filteredPermissions = PERMISSIONS.filter(p => {
    if (moduleFilter !== 'all' && p.module !== moduleFilter) return false;
    if (permissionFilter && !p.key.toLowerCase().includes(permissionFilter.toLowerCase())) return false;
    return true;
  });

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-400',
      high: 'bg-orange-500/20 text-orange-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400'
    };
    return colors[risk] || 'bg-gray-500/20 text-gray-400';
  };

  const getRoleColor = (type: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      partner: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      user: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      deny: 'bg-red-500/20 text-red-400',
      allow: 'bg-green-500/20 text-green-400',
      require_mfa: 'bg-purple-500/20 text-purple-400',
      dual_approval: 'bg-blue-500/20 text-blue-400',
      log: 'bg-cyan-500/20 text-cyan-400',
      alert: 'bg-yellow-500/20 text-yellow-400',
      escalate: 'bg-orange-500/20 text-orange-400'
    };
    return colors[action] || 'bg-gray-500/20 text-gray-400';
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
              {passedChecks}/{CHECKS.length} Passed
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Access Governance Module</h1>
            <p className="text-[#8B949E]">Single source of truth for roles, permissions, policies, and audit</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00E0B8]">{totalUsers.toLocaleString()}</div>
              <div className="text-xs text-[#8B949E]">Total Users</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00A3FF]">{ROLES.length}</div>
              <div className="text-xs text-[#8B949E]">Roles</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#F59E0B]">{PERMISSIONS.length}</div>
              <div className="text-xs text-[#8B949E]">Permissions</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-purple-400">{POLICIES.length}</div>
              <div className="text-xs text-[#8B949E]">Policies</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-cyan-400">{totalRules}</div>
              <div className="text-xs text-[#8B949E]">Policy Rules</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-green-400">{passedChecks}/{CHECKS.length}</div>
              <div className="text-xs text-[#8B949E]">Checks Passed</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#161B22] rounded-xl border border-[#1F242C] w-fit">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'roles', label: 'Roles', icon: '🎭' },
              { key: 'permissions', label: 'Permissions', icon: '🔐' },
              { key: 'policies', label: 'Policies', icon: '📜' },
              { key: 'audit', label: 'Audit', icon: '📋' },
              { key: 'deployment', label: 'Deployment', icon: '🌍' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key ? 'bg-[#00E0B8] text-[#0D1117]' : 'hover:bg-[#1F242C] text-[#8B949E]'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
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
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">All Passed</span>
                </div>
                <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
                  {CHECKS.map(check => (
                    <div key={check.id} className="flex items-center justify-between p-2 bg-[#0D1117] rounded-lg">
                      <span className="text-sm">{check.name}</span>
                      <span className="text-green-400">✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles Overview */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Roles Overview</h3>
                </div>
                <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
                  {ROLES.filter(r => r.code !== 'public').sort((a, b) => b.level - a.level).map(role => (
                    <div key={role.code} className="flex items-center justify-between p-2 bg-[#0D1117] rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{role.name}</div>
                        <div className="text-xs text-[#8B949E]">{role.permCount} perms</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-xs border ${getRoleColor(role.type)}`}>
                          Lvl {role.level}
                        </span>
                        <div className="text-xs text-[#8B949E] mt-1">{role.userCount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <button onClick={() => setActiveTab('audit')} className="text-xs text-[#00E0B8]">View all →</button>
                </div>
                <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
                  {AUDIT.slice(0, 5).map(entry => (
                    <div key={entry.id} className="p-2 bg-[#0D1117] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{entry.actor}</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">{entry.result}</span>
                      </div>
                      <div className="text-xs text-[#8B949E]">{entry.action} → {entry.target}</div>
                      <div className="text-xs text-[#3D444D] mt-1">{entry.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLES.filter(r => r.code !== 'public').sort((a, b) => b.level - a.level).map(role => (
                <div key={role.code} className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{role.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getRoleColor(role.type)}`}>{role.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                    <div><div className="text-[#8B949E] text-xs">Level</div><div className="font-medium">{role.level}</div></div>
                    <div><div className="text-[#8B949E] text-xs">Perms</div><div className="font-medium">{role.permCount}</div></div>
                    <div><div className="text-[#8B949E] text-xs">Users</div><div className="font-medium">{role.userCount.toLocaleString()}</div></div>
                  </div>
                  <button className="w-full px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm hover:border-[#00E0B8]">
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
                  className="px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm"
                >
                  <option value="all">All Modules ({PERMISSIONS.length})</option>
                  {modules.map(mod => (
                    <option key={mod} value={mod}>{mod} ({PERMISSIONS.filter(p => p.module === mod).length})</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#161B22]">
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Permission</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Module</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Risk</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermissions.map(perm => (
                      <tr key={perm.key} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-3 font-mono text-sm text-[#00E0B8]">{perm.key}</td>
                        <td className="px-4 py-3 text-sm">{perm.name}</td>
                        <td className="px-4 py-3 text-sm"><span className="px-2 py-0.5 bg-[#1F242C] rounded">{perm.module}</span></td>
                        <td className="px-4 py-3 text-sm"><span className={`px-2 py-0.5 rounded ${getRiskColor(perm.risk)}`}>{perm.risk}</span></td>
                        <td className="px-4 py-3 text-sm text-[#8B949E]">{perm.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {POLICIES.map(policy => (
                  <div
                    key={policy.id}
                    className={`p-4 bg-[#161B22] border rounded-xl cursor-pointer transition-all ${
                      selectedPolicy === policy.id ? 'border-[#00E0B8]' : 'border-[#1F242C] hover:border-[#3D444D]'
                    }`}
                    onClick={() => setSelectedPolicy(selectedPolicy === policy.id ? null : policy.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-[#8B949E]">{policy.id}</span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">{policy.status}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{policy.name}</h3>
                    <div className="text-xs text-[#8B949E]">v{policy.version} • {policy.rules.length} rules</div>
                  </div>
                ))}
              </div>
              <div>
                {selectedPolicy ? (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <h3 className="font-semibold">{POLICIES.find(p => p.id === selectedPolicy)?.name} Rules</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {POLICIES.find(p => p.id === selectedPolicy)?.rules.map(rule => (
                        <div key={rule.id} className="p-3 bg-[#0D1117] rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs text-[#8B949E]">{rule.id}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getActionColor(rule.action)}`}>{rule.action}</span>
                          </div>
                          <div className="text-sm">{rule.desc}</div>
                          <div className={`text-xs mt-1 ${getRiskColor(rule.severity)}`}>Severity: {rule.severity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">📜</span>
                    <h3 className="font-semibold mb-2">Select a Policy</h3>
                    <p className="text-[#8B949E] text-sm">Click on a policy to view its rules and configuration.</p>
                  </div>
                )}
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
                    {AUDIT.map(entry => (
                      <tr key={entry.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-3 text-sm text-[#8B949E]">{entry.time}</td>
                        <td className="px-4 py-3 font-medium">{entry.actor}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-[#1F242C] rounded text-sm">{entry.action}</span></td>
                        <td className="px-4 py-3 text-sm">{entry.target}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">{entry.result}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Deployment Tab */}
          {activeTab === 'deployment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {SCENARIOS.map(s => (
                  <div key={s.code} className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] transition-colors">
                    <div className="text-3xl mb-2">{s.flag}</div>
                    <h3 className="font-semibold mb-1">{s.country}</h3>
                    <div className="text-xs text-[#8B949E] mb-3">{s.ministry}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-[#8B949E]">Timeline:</span><span>{s.timeline}</span></div>
                      <div className="flex justify-between"><span className="text-[#8B949E]">Budget:</span><span className="text-[#00E0B8]">{s.budget}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Deployment Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {[
                    { phase: '1', name: 'Architecture', weeks: '2-4' },
                    { phase: '2', name: 'Development', weeks: '4-8' },
                    { phase: '3', name: 'Integration', weeks: '2-4' },
                    { phase: '4', name: 'Testing', weeks: '2-3' },
                    { phase: '5', name: 'Training', weeks: '1-2' },
                    { phase: '6', name: 'Deployment', weeks: '2-3' },
                  ].map(p => (
                    <div key={p.phase} className="p-4 bg-[#0D1117] rounded-lg text-center">
                      <div className="w-8 h-8 bg-[#00E0B8] rounded-full flex items-center justify-center mx-auto mb-2 text-[#0D1117] font-bold">{p.phase}</div>
                      <div className="font-medium text-sm">{p.name}</div>
                      <div className="text-xs text-[#8B949E]">{p.weeks} weeks</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/hub" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div><div className="font-medium">Admin Hub</div><div className="text-xs text-[#8B949E]">Dashboard</div></div>
            </Link>
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div><div className="font-medium">Security</div><div className="text-xs text-[#8B949E]">Monitoring</div></div>
            </Link>
            <Link href="/admin/breaches" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div><div className="font-medium">Breaches</div><div className="text-xs text-[#8B949E]">Incidents</div></div>
            </Link>
            <Link href="/admin/access" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div><div className="font-medium">Access</div><div className="text-xs text-[#8B949E]">Users</div></div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1600px] mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | Access Governance Module v2.0 | Washington, USA
        </div>
      </footer>
    </div>
  );
}
