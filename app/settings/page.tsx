'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type SettingsSection = 'overview' | 'users' | 'roles' | 'system' | 'integrations' | 'security' | 'ai-governance' | 'audit';
type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
type RoleLevel = 'system' | 'ministry' | 'regional' | 'operator';

// ============================================
// DATA
// ============================================
const SYSTEM_USERS = [
  { id: 'usr-001', name: 'Olena Kovalenko', email: 'o.kovalenko@msp.gov.ua', role: 'System Administrator', department: 'IT Department', status: 'active' as UserStatus, lastLogin: '2026-01-05 14:32', mfa: true },
  { id: 'usr-002', name: 'Dmytro Shevchenko', email: 'd.shevchenko@msp.gov.ua', role: 'Ministry Admin', department: 'Social Protection', status: 'active' as UserStatus, lastLogin: '2026-01-05 13:45', mfa: true },
  { id: 'usr-003', name: 'Maria Bondarenko', email: 'm.bondarenko@msp.gov.ua', role: 'Regional Coordinator', department: 'Kyiv Oblast', status: 'active' as UserStatus, lastLogin: '2026-01-05 12:18', mfa: true },
  { id: 'usr-004', name: 'Ivan Petrenko', email: 'i.petrenko@msp.gov.ua', role: 'Payment Operator', department: 'Finance Division', status: 'active' as UserStatus, lastLogin: '2026-01-05 11:02', mfa: true },
  { id: 'usr-005', name: 'Natalia Sydorenko', email: 'n.sydorenko@msp.gov.ua', role: 'Compliance Officer', department: 'Legal & Compliance', status: 'active' as UserStatus, lastLogin: '2026-01-04 16:45', mfa: true },
  { id: 'usr-006', name: 'Andriy Melnyk', email: 'a.melnyk@msp.gov.ua', role: 'Data Analyst', department: 'Analytics', status: 'inactive' as UserStatus, lastLogin: '2025-12-20 09:30', mfa: false },
  { id: 'usr-007', name: 'Yulia Tkachenko', email: 'y.tkachenko@wb.org', role: 'Donor Observer', department: 'World Bank', status: 'active' as UserStatus, lastLogin: '2026-01-03 10:15', mfa: true },
  { id: 'usr-008', name: 'New User', email: 'pending@msp.gov.ua', role: 'Pending Assignment', department: 'TBD', status: 'pending' as UserStatus, lastLogin: 'Never', mfa: false },
];

const SYSTEM_ROLES = [
  {
    id: 'role-001',
    name: 'System Administrator',
    level: 'system' as RoleLevel,
    users: 3,
    permissions: ['Full system access', 'User management', 'Configuration', 'Security settings', 'AI governance'],
    description: 'Complete administrative access to all system functions',
  },
  {
    id: 'role-002',
    name: 'Ministry Admin',
    level: 'ministry' as RoleLevel,
    users: 12,
    permissions: ['Program management', 'User management (ministry)', 'Reports', 'Approvals', 'Budget oversight'],
    description: 'Ministry-level administrative functions',
  },
  {
    id: 'role-003',
    name: 'Regional Coordinator',
    level: 'regional' as RoleLevel,
    users: 24,
    permissions: ['Regional operations', 'Beneficiary management', 'Local reports', 'Escalation handling'],
    description: 'Oblast-level coordination and operations',
  },
  {
    id: 'role-004',
    name: 'Payment Operator',
    level: 'operator' as RoleLevel,
    users: 156,
    permissions: ['Payment processing', 'Transaction review', 'Exception handling', 'Basic reports'],
    description: 'Payment processing and transaction management',
  },
  {
    id: 'role-005',
    name: 'Beneficiary Manager',
    level: 'operator' as RoleLevel,
    users: 234,
    permissions: ['Beneficiary registration', 'Eligibility verification', 'Case management', 'Appeals processing'],
    description: 'Beneficiary enrollment and case management',
  },
  {
    id: 'role-006',
    name: 'Compliance Officer',
    level: 'ministry' as RoleLevel,
    users: 8,
    permissions: ['Audit access', 'Compliance reports', 'Policy review', 'Risk assessment'],
    description: 'Compliance monitoring and audit functions',
  },
  {
    id: 'role-007',
    name: 'Data Analyst',
    level: 'ministry' as RoleLevel,
    users: 18,
    permissions: ['Analytics dashboard', 'Report generation', 'Data export', 'Trend analysis'],
    description: 'Data analysis and reporting',
  },
  {
    id: 'role-008',
    name: 'Donor Observer',
    level: 'ministry' as RoleLevel,
    users: 15,
    permissions: ['View reports', 'Funding tracking', 'Impact metrics', 'IATI data'],
    description: 'Read-only access for donor representatives',
  },
];

const INTEGRATIONS = [
  { id: 'int-001', name: 'Diia', type: 'Identity', status: 'active', lastSync: '2026-01-05 14:30', records: '42.3M', health: 100 },
  { id: 'int-002', name: 'PrivatBank', type: 'Payment', status: 'active', lastSync: '2026-01-05 14:32', records: '28.1M', health: 98 },
  { id: 'int-003', name: 'Monobank', type: 'Payment', status: 'active', lastSync: '2026-01-05 14:31', records: '8.4M', health: 100 },
  { id: 'int-004', name: 'Tax Authority', type: 'Verification', status: 'active', lastSync: '2026-01-05 14:00', records: '38.7M', health: 99 },
  { id: 'int-005', name: 'Civil Registry', type: 'Identity', status: 'active', lastSync: '2026-01-05 13:45', records: '41.2M', health: 100 },
  { id: 'int-006', name: 'Pension Fund', type: 'Benefits', status: 'active', lastSync: '2026-01-05 12:00', records: '12.8M', health: 97 },
  { id: 'int-007', name: 'UNHCR proGres', type: 'Humanitarian', status: 'active', lastSync: '2026-01-05 10:00', records: '680K', health: 100 },
  { id: 'int-008', name: 'World Bank API', type: 'Reporting', status: 'active', lastSync: '2026-01-04 18:00', records: 'N/A', health: 100 },
];

const SECURITY_SETTINGS = {
  authentication: {
    mfaRequired: true,
    mfaMethods: ['TOTP', 'SMS', 'Hardware Key'],
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: 'Strong (12+ chars, mixed case, numbers, symbols)',
  },
  encryption: {
    dataAtRest: 'AES-256',
    dataInTransit: 'TLS 1.3',
    keyManagement: 'HSM-backed',
    certificateExpiry: '2026-06-15',
  },
  network: {
    firewallStatus: 'Active',
    ddosProtection: 'Enabled',
    ipWhitelist: 'Configured',
    vpnRequired: 'For admin access',
  },
  compliance: {
    gdprStatus: 'Compliant',
    iso27001: 'Certified',
    soc2: 'Type II Attested',
    lastPentest: '2025-11-15',
  },
};

const AI_GOVERNANCE_CONFIG = {
  decisionThresholds: [
    { category: 'Eligibility', autoApprove: 95, humanReview: 85, reject: 50 },
    { category: 'Payment', autoApprove: 98, humanReview: 90, reject: 60 },
    { category: 'Fraud Detection', autoApprove: 99, humanReview: 95, reject: 70 },
    { category: 'Risk Assessment', autoApprove: 90, humanReview: 75, reject: 40 },
  ],
  humanOversight: {
    appealProcess: 'Enabled',
    overrideAuthority: ['Supervisor', 'Manager', 'Director'],
    auditRequirement: '100% of overrides',
    escalationPath: 'Operator → Supervisor → Manager → Director → Minister',
  },
  ethicalBoundaries: [
    { boundary: 'Non-discrimination', status: 'Active', violations: 0 },
    { boundary: 'Data sovereignty', status: 'Active', violations: 0 },
    { boundary: 'Transparency', status: 'Active', violations: 0 },
    { boundary: 'Human dignity', status: 'Active', violations: 0 },
    { boundary: 'Proportionality', status: 'Active', violations: 0 },
  ],
  emergencyStop: {
    status: 'Armed',
    lastTest: '2025-12-28',
    authorizedTriggers: 3,
    responseTime: '30 seconds',
  },
};

const AUDIT_LOGS = [
  { id: 'log-001', timestamp: '2026-01-05 14:32:15', user: 'o.kovalenko@msp.gov.ua', action: 'User role updated', target: 'usr-004', ip: '10.0.0.45', result: 'Success' },
  { id: 'log-002', timestamp: '2026-01-05 14:28:03', user: 'system', action: 'Integration sync completed', target: 'int-001', ip: 'internal', result: 'Success' },
  { id: 'log-003', timestamp: '2026-01-05 14:15:42', user: 'd.shevchenko@msp.gov.ua', action: 'Configuration changed', target: 'payment_threshold', ip: '10.0.0.23', result: 'Success' },
  { id: 'log-004', timestamp: '2026-01-05 14:02:11', user: 'system', action: 'Security scan completed', target: 'system', ip: 'internal', result: 'Success' },
  { id: 'log-005', timestamp: '2026-01-05 13:58:33', user: 'm.bondarenko@msp.gov.ua', action: 'Report generated', target: 'monthly_report_dec', ip: '10.0.1.88', result: 'Success' },
  { id: 'log-006', timestamp: '2026-01-05 13:45:21', user: 'unknown', action: 'Login attempt', target: 'admin_panel', ip: '185.234.xx.xx', result: 'Blocked' },
  { id: 'log-007', timestamp: '2026-01-05 13:30:05', user: 'i.petrenko@msp.gov.ua', action: 'Payment batch approved', target: 'batch_2026010512', ip: '10.0.0.67', result: 'Success' },
  { id: 'log-008', timestamp: '2026-01-05 13:15:48', user: 'n.sydorenko@msp.gov.ua', action: 'Compliance report viewed', target: 'iati_q4_2025', ip: '10.0.0.89', result: 'Success' },
];

const SYSTEM_CONFIG = {
  general: [
    { key: 'system_name', label: 'System Name', value: 'IVYAR HBS Platform', type: 'text' },
    { key: 'version', label: 'Version', value: '10.0.2', type: 'readonly' },
    { key: 'environment', label: 'Environment', value: 'Production', type: 'readonly' },
    { key: 'timezone', label: 'Default Timezone', value: 'Europe/Kyiv', type: 'select' },
    { key: 'language', label: 'Default Language', value: 'Ukrainian', type: 'select' },
    { key: 'date_format', label: 'Date Format', value: 'DD.MM.YYYY', type: 'select' },
  ],
  operations: [
    { key: 'payment_threshold', label: 'Auto-approve Threshold', value: '$10,000', type: 'currency' },
    { key: 'batch_size', label: 'Max Batch Size', value: '50,000', type: 'number' },
    { key: 'processing_hours', label: 'Processing Window', value: '06:00-22:00', type: 'time' },
    { key: 'retry_attempts', label: 'Payment Retry Attempts', value: '3', type: 'number' },
    { key: 'escalation_timeout', label: 'Escalation Timeout', value: '24 hours', type: 'duration' },
  ],
  notifications: [
    { key: 'email_notifications', label: 'Email Notifications', value: 'Enabled', type: 'toggle' },
    { key: 'sms_notifications', label: 'SMS Notifications', value: 'Enabled', type: 'toggle' },
    { key: 'alert_threshold', label: 'Alert Threshold', value: 'Medium', type: 'select' },
    { key: 'digest_frequency', label: 'Digest Frequency', value: 'Daily', type: 'select' },
  ],
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function SettingsV10Page() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] rounded-lg flex items-center justify-center font-bold text-[#0D1117] text-sm">
                IV
              </div>
            </Link>
            <div className="h-6 w-px bg-[#1F242C]"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <span className="font-semibold">Settings & Admin</span>
              <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm w-64"
            />
            <button className="text-sm bg-[#161B22] border border-[#1F242C] px-4 py-2 rounded-lg hover:bg-[#1F242C]">
              Export Config
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-56 bg-[#161B22] border-r border-[#1F242C] p-4 overflow-y-auto">
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'roles', label: 'Roles & Permissions', icon: '🔑' },
              { id: 'system', label: 'System Config', icon: '⚙️' },
              { id: 'integrations', label: 'Integrations', icon: '🔌' },
              { id: 'security', label: 'Security', icon: '🛡️' },
              { id: 'ai-governance', label: 'AI Governance', icon: '🧠' },
              { id: 'audit', label: 'Audit Logs', icon: '📋' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#00A3FF]/10 text-[#00A3FF]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#1F242C]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-56 p-6">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'roles' && <RolesSection />}
          {activeSection === 'system' && <SystemConfigSection />}
          {activeSection === 'integrations' && <IntegrationsSection />}
          {activeSection === 'security' && <SecuritySection />}
          {activeSection === 'ai-governance' && <AIGovernanceSection />}
          {activeSection === 'audit' && <AuditSection />}
        </main>
      </div>
    </div>
  );
}

// ============================================
// OVERVIEW SECTION
// ============================================
function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings Overview</h2>
        <p className="text-sm text-[#8B949E]">System administration and configuration dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: '486', icon: '👥', color: '#00A3FF' },
          { label: 'System Roles', value: '8', icon: '🔑', color: '#A371F7' },
          { label: 'Integrations', value: '8', icon: '🔌', color: '#3CCB7F' },
          { label: 'Security Score', value: '98%', icon: '🛡️', color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-sm text-[#8B949E]">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add User', icon: '👤+' },
              { label: 'Create Role', icon: '🔑+' },
              { label: 'Run Security Scan', icon: '🔍' },
              { label: 'Export Audit Log', icon: '📤' },
              { label: 'Test Integrations', icon: '🔄' },
              { label: 'Backup Config', icon: '💾' },
            ].map((action, i) => (
              <button 
                key={i}
                className="flex items-center gap-2 p-3 bg-[#0D1117] rounded-lg hover:bg-[#1F242C] transition-colors text-left"
              >
                <span>{action.icon}</span>
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { component: 'Database', status: 'Healthy', uptime: '99.99%' },
              { component: 'API Gateway', status: 'Healthy', uptime: '99.97%' },
              { component: 'Payment Services', status: 'Degraded', uptime: '99.87%' },
              { component: 'AI Engine', status: 'Healthy', uptime: '99.92%' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    item.status === 'Healthy' ? 'bg-[#3CCB7F]' : 'bg-[#F59E0B]'
                  }`}></span>
                  <span className="text-sm">{item.component}</span>
                </div>
                <span className="text-xs text-[#8B949E]">{item.uptime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Admin Activity</h3>
        <div className="space-y-3">
          {AUDIT_LOGS.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#6E7681]">{log.timestamp.split(' ')[1]}</span>
                <span>{log.action}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#8B949E]">{log.user.split('@')[0]}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  log.result === 'Success' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F85149]/20 text-[#F85149]'
                }`}>
                  {log.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// USERS SECTION
// ============================================
function UsersSection() {
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');

  const filteredUsers = filterStatus === 'all' 
    ? SYSTEM_USERS 
    : SYSTEM_USERS.filter(u => u.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          <p className="text-sm text-[#8B949E]">Manage system users and access</p>
        </div>
        <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium">
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'all')}
          className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
        <span className="text-sm text-[#8B949E]">{filteredUsers.length} users</span>
      </div>

      {/* Users Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Department</th>
                <th className="text-center p-4">MFA</th>
                <th className="text-left p-4">Last Login</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#1F242C]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#00A3FF] rounded-full flex items-center justify-center text-xs font-bold text-[#0D1117]">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-[#6E7681]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4 text-[#8B949E]">{user.department}</td>
                  <td className="p-4 text-center">
                    {user.mfa ? (
                      <span className="text-[#3CCB7F]">✓</span>
                    ) : (
                      <span className="text-[#F85149]">✗</span>
                    )}
                  </td>
                  <td className="p-4 text-[#8B949E]">{user.lastLogin}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.status === 'active' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                      user.status === 'inactive' ? 'bg-[#8B949E]/20 text-[#8B949E]' :
                      user.status === 'suspended' ? 'bg-[#F85149]/20 text-[#F85149]' :
                      'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-[#00A3FF] hover:underline text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ROLES SECTION
// ============================================
function RolesSection() {
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Roles & Permissions</h2>
          <p className="text-sm text-[#8B949E]">Configure access control and permissions</p>
        </div>
        <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium">
          + Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role List */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold">System Roles</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {SYSTEM_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full p-4 text-left hover:bg-[#1F242C]/50 transition-colors ${
                  selectedRole.id === role.id ? 'bg-[#1F242C]/50 border-l-2 border-[#00A3FF]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{role.name}</div>
                    <div className="text-xs text-[#6E7681]">{role.users} users</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    role.level === 'system' ? 'bg-[#F85149]/20 text-[#F85149]' :
                    role.level === 'ministry' ? 'bg-[#A371F7]/20 text-[#A371F7]' :
                    role.level === 'regional' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                    'bg-[#8B949E]/20 text-[#8B949E]'
                  }`}>
                    {role.level}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role Details */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">{selectedRole.name}</h3>
              <p className="text-sm text-[#8B949E]">{selectedRole.description}</p>
            </div>
            <button className="text-sm text-[#00A3FF] hover:underline">Edit Role</button>
          </div>

          <div className="mb-6">
            <div className="text-sm font-medium mb-3">Permissions</div>
            <div className="flex flex-wrap gap-2">
              {selectedRole.permissions.map((perm, i) => (
                <span key={i} className="text-xs bg-[#0D1117] border border-[#1F242C] px-3 py-1.5 rounded-lg">
                  {perm}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4">
              <div className="text-sm text-[#8B949E] mb-1">Assigned Users</div>
              <div className="text-2xl font-bold">{selectedRole.users}</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4">
              <div className="text-sm text-[#8B949E] mb-1">Access Level</div>
              <div className="text-2xl font-bold capitalize">{selectedRole.level}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SYSTEM CONFIG SECTION
// ============================================
function SystemConfigSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">System Configuration</h2>
        <p className="text-sm text-[#8B949E]">Platform settings and operational parameters</p>
      </div>

      {/* General Settings */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          {SYSTEM_CONFIG.general.map((config, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1F242C] last:border-0">
              <div>
                <div className="text-sm font-medium">{config.label}</div>
                <div className="text-xs text-[#6E7681]">{config.key}</div>
              </div>
              {config.type === 'readonly' ? (
                <span className="text-sm text-[#8B949E]">{config.value}</span>
              ) : (
                <input 
                  type="text" 
                  defaultValue={config.value}
                  className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-1.5 text-sm w-48"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Operations Settings */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Operations Settings</h3>
        <div className="space-y-4">
          {SYSTEM_CONFIG.operations.map((config, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1F242C] last:border-0">
              <div>
                <div className="text-sm font-medium">{config.label}</div>
                <div className="text-xs text-[#6E7681]">{config.key}</div>
              </div>
              <input 
                type="text" 
                defaultValue={config.value}
                className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-1.5 text-sm w-48"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {SYSTEM_CONFIG.notifications.map((config, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#1F242C] last:border-0">
              <div className="text-sm font-medium">{config.label}</div>
              {config.type === 'toggle' ? (
                <button className={`w-12 h-6 rounded-full transition-colors ${
                  config.value === 'Enabled' ? 'bg-[#3CCB7F]' : 'bg-[#1F242C]'
                }`}>
                  <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                    config.value === 'Enabled' ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></span>
                </button>
              ) : (
                <select className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-1.5 text-sm">
                  <option>{config.value}</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ============================================
// INTEGRATIONS SECTION
// ============================================
function IntegrationsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Integrations</h2>
        <p className="text-sm text-[#8B949E]">External system connections and APIs</p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold">{integration.name}</h4>
                <span className="text-xs text-[#8B949E]">{integration.type}</span>
              </div>
              <span className={`w-3 h-3 rounded-full ${
                integration.status === 'active' ? 'bg-[#3CCB7F]' : 'bg-[#F85149]'
              }`}></span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Last Sync</span>
                <span>{integration.lastSync}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Records</span>
                <span>{integration.records}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Health</span>
                <span className={integration.health >= 99 ? 'text-[#3CCB7F]' : 'text-[#F59E0B]'}>
                  {integration.health}%
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-1.5 bg-[#0D1117] rounded-lg text-xs hover:bg-[#1F242C]">
                Test
              </button>
              <button className="flex-1 py-1.5 bg-[#0D1117] rounded-lg text-xs hover:bg-[#1F242C]">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SECURITY SECTION
// ============================================
function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Security Settings</h2>
        <p className="text-sm text-[#8B949E]">Authentication, encryption, and compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>🔐</span> Authentication
          </h3>
          <div className="space-y-3">
            {Object.entries(SECURITY_SETTINGS.authentication).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm py-2 border-b border-[#1F242C] last:border-0">
                <span className="text-[#8B949E] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Encryption */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>🔒</span> Encryption
          </h3>
          <div className="space-y-3">
            {Object.entries(SECURITY_SETTINGS.encryption).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm py-2 border-b border-[#1F242C] last:border-0">
                <span className="text-[#8B949E] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Network */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>🌐</span> Network Security
          </h3>
          <div className="space-y-3">
            {Object.entries(SECURITY_SETTINGS.network).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm py-2 border-b border-[#1F242C] last:border-0">
                <span className="text-[#8B949E] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={value === 'Active' || value === 'Enabled' ? 'text-[#3CCB7F]' : ''}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>✓</span> Compliance Status
          </h3>
          <div className="space-y-3">
            {Object.entries(SECURITY_SETTINGS.compliance).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm py-2 border-b border-[#1F242C] last:border-0">
                <span className="text-[#8B949E] uppercase">{key}</span>
                <span className={value === 'Compliant' || value === 'Certified' ? 'text-[#3CCB7F]' : ''}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AI GOVERNANCE SECTION
// ============================================
function AIGovernanceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">AI Governance</h2>
        <p className="text-sm text-[#8B949E]">Sovereign Intelligence controls and ethical boundaries</p>
      </div>

      {/* Decision Thresholds */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Decision Thresholds</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-3">Category</th>
                <th className="text-center p-3">Auto-Approve</th>
                <th className="text-center p-3">Human Review</th>
                <th className="text-center p-3">Auto-Reject</th>
              </tr>
            </thead>
            <tbody>
              {AI_GOVERNANCE_CONFIG.decisionThresholds.map((threshold, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-3 font-medium">{threshold.category}</td>
                  <td className="p-3 text-center">
                    <span className="text-[#3CCB7F]">≥{threshold.autoApprove}%</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[#F59E0B]">{threshold.humanReview}-{threshold.autoApprove - 1}%</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[#F85149]">&lt;{threshold.reject}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Human Oversight */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Human Oversight Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(AI_GOVERNANCE_CONFIG.humanOversight).map(([key, value]) => (
            <div key={key} className="bg-[#0D1117] rounded-lg p-4">
              <div className="text-xs text-[#8B949E] mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
              <div className="font-medium">{Array.isArray(value) ? value.join(' → ') : String(value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ethical Boundaries */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Ethical Boundaries</h3>
        <div className="space-y-3">
          {AI_GOVERNANCE_CONFIG.ethicalBoundaries.map((boundary, i) => (
            <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${boundary.status === 'Active' ? 'bg-[#3CCB7F]' : 'bg-[#F85149]'}`}></span>
                <span>{boundary.boundary}</span>
              </div>
              <span className="text-xs text-[#3CCB7F]">{boundary.violations} violations</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Stop */}
      <div className="bg-gradient-to-r from-[#F85149]/10 to-transparent border border-[#F85149]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🛑</span>
          <div className="flex-1">
            <h3 className="font-semibold text-[#F85149] mb-2">Emergency Stop System (ESS)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(AI_GOVERNANCE_CONFIG.emergencyStop).map(([key, value]) => (
                <div key={key} className="bg-[#0D1117] rounded-lg p-3">
                  <div className="text-xs text-[#8B949E] capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="font-medium">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="px-4 py-2 bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/30 rounded-lg text-sm font-medium">
            Test ESS
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AUDIT SECTION
// ============================================
function AuditSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Audit Logs</h2>
          <p className="text-sm text-[#8B949E]">System activity and security event logs</p>
        </div>
        <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium">
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm">
          <option>All Actions</option>
          <option>Login/Logout</option>
          <option>Configuration</option>
          <option>User Management</option>
          <option>Security Events</option>
        </select>
        <select className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm">
          <option>All Results</option>
          <option>Success</option>
          <option>Blocked</option>
          <option>Failed</option>
        </select>
        <input 
          type="text" 
          placeholder="Search logs..."
          className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm flex-1"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Timestamp</th>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Action</th>
                <th className="text-left p-4">Target</th>
                <th className="text-left p-4">IP Address</th>
                <th className="text-center p-4">Result</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="border-b border-[#1F242C]">
                  <td className="p-4 font-mono text-xs">{log.timestamp}</td>
                  <td className="p-4">{log.user}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4 text-[#8B949E]">{log.target}</td>
                  <td className="p-4 font-mono text-xs text-[#8B949E]">{log.ip}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      log.result === 'Success' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F85149]/20 text-[#F85149]'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#8B949E]">Showing 1-8 of 12,847 entries</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-[#161B22] border border-[#1F242C] rounded text-sm">Previous</button>
          <button className="px-3 py-1 bg-[#00A3FF] text-[#0D1117] rounded text-sm">1</button>
          <button className="px-3 py-1 bg-[#161B22] border border-[#1F242C] rounded text-sm">2</button>
          <button className="px-3 py-1 bg-[#161B22] border border-[#1F242C] rounded text-sm">3</button>
          <button className="px-3 py-1 bg-[#161B22] border border-[#1F242C] rounded text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}
