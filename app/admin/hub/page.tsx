'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROLES, RoleCode, hasPermission, canAccessRoute, canCreateRole } from '@/lib/auth/roles';
import { PRICING_PLANS, TRANSACTION_FEES, API_TIERS } from '@/lib/auth/pricing';

// ============================================================================
// TYPES
// ============================================================================
interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: string;
  cpu: number;
  memory: number;
  lastCheck: string;
}

interface ActivityItem {
  id: string;
  type: 'login' | 'logout' | 'permission_change' | 'role_assigned' | 'incident' | 'api_call' | 'security_alert';
  user: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  metadata?: Record<string, string>;
}

interface ModuleStats {
  id: string;
  name: string;
  icon: string;
  status: 'online' | 'offline' | 'maintenance';
  requests24h: number;
  errorRate: number;
  latency: number;
  url: string;
}

// ============================================================================
// MOCK DATA (Replace with real API calls in production)
// ============================================================================
const SYSTEM_HEALTH: SystemHealth = {
  status: 'healthy',
  uptime: '99.97%',
  cpu: 23,
  memory: 45,
  lastCheck: '2 seconds ago'
};

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'login', user: 'o.kovalenko@gov.ua', description: 'Successful authentication from Kyiv, UA', timestamp: '2 min ago', severity: 'info' },
  { id: '2', type: 'security_alert', user: 'System', description: 'Blocked brute force attempt from 45.33.32.156', timestamp: '5 min ago', severity: 'critical' },
  { id: '3', type: 'role_assigned', user: 'admin@ivyar.org', description: 'Assigned "employer" role to j.smith@company.com', timestamp: '15 min ago', severity: 'info' },
  { id: '4', type: 'permission_change', user: 'super_admin', description: 'Added "api_admin" permission to security_admin role', timestamp: '1 hour ago', severity: 'warning' },
  { id: '5', type: 'incident', user: 'WAF', description: 'SQL injection attempt blocked - INC-005', timestamp: '2 hours ago', severity: 'critical' },
  { id: '6', type: 'api_call', user: 'api-service', description: '10,000 API calls processed successfully', timestamp: '3 hours ago', severity: 'info' },
  { id: '7', type: 'logout', user: 'm.garcia@legal.com', description: 'Session ended normally', timestamp: '4 hours ago', severity: 'info' },
];

const MODULE_STATS: ModuleStats[] = [
  { id: 'access', name: 'Access Control', icon: '🔐', status: 'online', requests24h: 45230, errorRate: 0.02, latency: 45, url: '/admin/access' },
  { id: 'security', name: 'Security Center', icon: '🛡️', status: 'online', requests24h: 128450, errorRate: 0.01, latency: 23, url: '/admin/security' },
  { id: 'breaches', name: 'Breaches Center', icon: '⚠️', status: 'online', requests24h: 8920, errorRate: 0.00, latency: 67, url: '/admin/breaches' },
  { id: 'audit', name: 'Audit Logs', icon: '📋', status: 'online', requests24h: 234560, errorRate: 0.03, latency: 34, url: '/admin/audit' },
  { id: 'users', name: 'User Management', icon: '👥', status: 'online', requests24h: 67890, errorRate: 0.01, latency: 56, url: '/admin/users' },
  { id: 'billing', name: 'Billing & Payments', icon: '💳', status: 'online', requests24h: 12340, errorRate: 0.00, latency: 89, url: '/admin/billing' },
];

const QUICK_STATS = [
  { label: 'Total Users', value: '2,847', change: '+12%', trend: 'up', icon: '👥' },
  { label: 'Active Sessions', value: '1,247', change: '+23', trend: 'up', icon: '🟢' },
  { label: 'API Calls (24h)', value: '1.2M', change: '+18%', trend: 'up', icon: '🔌' },
  { label: 'Open Incidents', value: '7', change: '+2', trend: 'down', icon: '🔴' },
  { label: 'Revenue (MTD)', value: '$45.2K', change: '+8%', trend: 'up', icon: '💰' },
  { label: 'Uptime', value: '99.97%', change: '0', trend: 'stable', icon: '⏱️' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getActivityIcon = (type: ActivityItem['type']): string => {
  const icons: Record<ActivityItem['type'], string> = {
    login: '🔓', logout: '👋', permission_change: '🔐',
    role_assigned: '🎭', incident: '🚨', api_call: '🔌', security_alert: '⚠️'
  };
  return icons[type];
};

const getSeverityColor = (severity: ActivityItem['severity']): string => {
  const colors: Record<ActivityItem['severity'], string> = {
    info: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    critical: 'bg-red-500/20 text-red-400'
  };
  return colors[severity];
};

const getRoleColor = (code: string): string => {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    security_admin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    breaches_admin: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    pilot_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    government: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    donor: 'bg-green-500/20 text-green-400 border-green-500/30',
    auditor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    attorney: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    employer: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    business: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    citizen: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    public: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[code] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function AdministrationHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'permissions' | 'pricing'>('overview');
  const [selectedRole, setSelectedRole] = useState<RoleCode | null>(null);
  const [permissionFilter, setPermissionFilter] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const roles = Object.values(ROLES);
  const allPermissions = [...new Set(roles.flatMap(r => r.permissions))].filter(p => p !== '*');

  // Filter permissions
  const filteredPermissions = allPermissions.filter(p => 
    p.toLowerCase().includes(permissionFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A3FF] to-[#00E0B8] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">IV</div>
              <div>
                <div className="font-bold text-lg">IVYAR</div>
                <div className="text-xs text-[#8B949E]">Administration Hub</div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#161B22] rounded-lg border border-[#1F242C]">
              <span className="text-sm text-[#8B949E]">{currentTime.toLocaleTimeString()}</span>
              <span className="text-[#3D444D]">|</span>
              <span className="text-sm text-[#8B949E]">{currentTime.toLocaleDateString()}</span>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
              SYSTEM_HEALTH.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
              SYSTEM_HEALTH.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              System {SYSTEM_HEALTH.status}
            </div>
          </div>
        </div>
      </nav>

      {/* ================================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================================== */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Administration Hub</h1>
            <p className="text-[#8B949E]">
              Unified control center for access management, security monitoring, and system administration
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {QUICK_STATS.map((stat) => (
              <div key={stat.label} className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#3D444D] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{stat.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    stat.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                    stat.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                    'bg-[#1F242C] text-[#8B949E]'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#161B22] rounded-xl border border-[#1F242C] w-fit">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'roles', label: 'Role Hierarchy', icon: '🎭' },
              { key: 'permissions', label: 'Permission Matrix', icon: '🔐' },
              { key: 'pricing', label: 'Pricing Tiers', icon: '💰' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'hover:bg-[#1F242C] text-[#8B949E]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ================================================================ */}
          {/* OVERVIEW TAB */}
          {/* ================================================================ */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Module Status */}
              <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Module Status</h3>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MODULE_STATS.map((module) => (
                    <Link
                      key={module.id}
                      href={module.url}
                      className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{module.icon}</span>
                          <span className="font-medium group-hover:text-[#00A3FF]">{module.name}</span>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${
                          module.status === 'online' ? 'bg-green-500' :
                          module.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-sm font-medium">{(module.requests24h / 1000).toFixed(1)}K</div>
                          <div className="text-xs text-[#8B949E]">Requests</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{module.errorRate}%</div>
                          <div className="text-xs text-[#8B949E]">Errors</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{module.latency}ms</div>
                          <div className="text-xs text-[#8B949E]">Latency</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">System Health</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="p-4 bg-[#0D1117] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#8B949E]">CPU Usage</span>
                      <span className="font-medium">{SYSTEM_HEALTH.cpu}%</span>
                    </div>
                    <div className="h-2 bg-[#1F242C] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00A3FF] rounded-full transition-all"
                        style={{ width: `${SYSTEM_HEALTH.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0D1117] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#8B949E]">Memory Usage</span>
                      <span className="font-medium">{SYSTEM_HEALTH.memory}%</span>
                    </div>
                    <div className="h-2 bg-[#1F242C] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00E0B8] rounded-full transition-all"
                        style={{ width: `${SYSTEM_HEALTH.memory}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#0D1117] rounded-xl text-center">
                    <div className="text-3xl font-bold text-[#00A3FF] mb-1">{SYSTEM_HEALTH.uptime}</div>
                    <div className="text-sm text-[#8B949E]">Uptime (30 days)</div>
                  </div>
                  <div className="text-xs text-[#8B949E] text-center">
                    Last health check: {SYSTEM_HEALTH.lastCheck}
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="lg:col-span-3 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <Link href="/admin/audit" className="text-sm text-[#00A3FF] hover:underline">
                    View all →
                  </Link>
                </div>
                <div className="divide-y divide-[#1F242C]">
                  {RECENT_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-[#1F242C]/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-xl">{getActivityIcon(activity.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium truncate">{activity.user}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(activity.severity)}`}>
                              {activity.severity}
                            </span>
                          </div>
                          <p className="text-sm text-[#8B949E] truncate">{activity.description}</p>
                        </div>
                        <div className="text-sm text-[#8B949E] whitespace-nowrap">{activity.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ROLES TAB */}
          {/* ================================================================ */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Role List */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">All Roles ({roles.length})</h3>
                </div>
                <div className="p-2 max-h-[600px] overflow-y-auto">
                  {roles
                    .sort((a, b) => b.level - a.level)
                    .map((role) => (
                    <button
                      key={role.code}
                      onClick={() => setSelectedRole(role.code)}
                      className={`w-full p-3 rounded-lg text-left transition-all mb-1 ${
                        selectedRole === role.code
                          ? 'bg-[#00A3FF]/10 border border-[#00A3FF]'
                          : 'hover:bg-[#1F242C] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{role.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${getRoleColor(role.code)}`}>
                          Lvl {role.level}
                        </span>
                      </div>
                      <div className="text-xs text-[#8B949E]">{role.nameUk}</div>
                      <div className="text-xs text-[#8B949E] mt-1">
                        {role.permissions.length} permissions • {role.routes.length} routes
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Details */}
              <div className="lg:col-span-2">
                {selectedRole ? (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{ROLES[selectedRole].name}</h3>
                          <p className="text-sm text-[#8B949E]">{ROLES[selectedRole].nameUk}</p>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded border ${getRoleColor(selectedRole)}`}>
                          Level {ROLES[selectedRole].level}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-6">
                      
                      {/* Permissions */}
                      <div>
                        <h4 className="text-sm font-medium text-[#8B949E] mb-2">Permissions</h4>
                        <div className="flex flex-wrap gap-2">
                          {ROLES[selectedRole].permissions.map((perm) => (
                            <span key={perm} className="px-2 py-1 bg-[#0D1117] border border-[#1F242C] rounded text-sm">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Routes */}
                      <div>
                        <h4 className="text-sm font-medium text-[#8B949E] mb-2">Allowed Routes</h4>
                        <div className="flex flex-wrap gap-2">
                          {ROLES[selectedRole].routes.map((route) => (
                            <span key={route} className="px-2 py-1 bg-[#00A3FF]/10 text-[#00A3FF] border border-[#00A3FF]/30 rounded text-sm font-mono">
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Can Create */}
                      <div>
                        <h4 className="text-sm font-medium text-[#8B949E] mb-2">Can Create Roles</h4>
                        {ROLES[selectedRole].canCreate.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {ROLES[selectedRole].canCreate.map((code) => (
                              <span key={code} className={`px-2 py-1 rounded text-sm border ${getRoleColor(code)}`}>
                                {ROLES[code as RoleCode]?.name || code}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-[#8B949E]">Cannot create any roles</span>
                        )}
                      </div>

                      {/* Pricing */}
                      <div>
                        <h4 className="text-sm font-medium text-[#8B949E] mb-2">Pricing</h4>
                        <div className="p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-[#8B949E]">Type:</span>
                            <span className="font-medium capitalize">{ROLES[selectedRole].pricing.type}</span>
                          </div>
                          {ROLES[selectedRole].pricing.monthly && (
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[#8B949E]">Monthly:</span>
                              <span className="font-medium text-[#00A3FF]">${ROLES[selectedRole].pricing.monthly}/mo</span>
                            </div>
                          )}
                          {ROLES[selectedRole].pricing.annual && (
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[#8B949E]">Annual:</span>
                              <span className="font-medium text-[#00E0B8]">${ROLES[selectedRole].pricing.annual}/yr</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role Validation Test */}
                      <div>
                        <h4 className="text-sm font-medium text-[#8B949E] mb-2">Permission Test</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['dashboard_view', 'users_manage', 'api_admin', 'security_center'].map((perm) => (
                            <div key={perm} className="flex items-center justify-between p-2 bg-[#0D1117] rounded">
                              <span className="text-sm font-mono">{perm}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                hasPermission(selectedRole, perm as any)
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {hasPermission(selectedRole, perm as any) ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">🎭</span>
                    <h3 className="font-semibold mb-2">Select a Role</h3>
                    <p className="text-[#8B949E]">Choose a role from the list to view its details, permissions, and configuration.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PERMISSIONS TAB */}
          {/* ================================================================ */}
          {activeTab === 'permissions' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">Permission Matrix</h3>
                <input
                  type="text"
                  placeholder="Filter permissions..."
                  value={permissionFilter}
                  onChange={(e) => setPermissionFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm focus:border-[#00A3FF] focus:outline-none w-64"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E] sticky left-0 bg-[#161B22]">Permission</th>
                      {roles.sort((a, b) => b.level - a.level).map((role) => (
                        <th key={role.code} className="px-2 py-3 text-center text-xs font-medium">
                          <div className={`px-2 py-1 rounded ${getRoleColor(role.code)}`}>
                            {role.code.replace('_', ' ')}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPermissions.slice(0, 30).map((perm) => (
                      <tr key={perm} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-2 text-sm font-mono sticky left-0 bg-[#161B22]">{perm}</td>
                        {roles.sort((a, b) => b.level - a.level).map((role) => (
                          <td key={role.code} className="px-2 py-2 text-center">
                            {hasPermission(role.code, perm as any) ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-[#3D444D]">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPermissions.length > 30 && (
                <div className="p-4 text-center text-sm text-[#8B949E]">
                  Showing 30 of {filteredPermissions.length} permissions. Use filter to narrow results.
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* PRICING TAB */}
          {/* ================================================================ */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              {/* Pricing Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-5 bg-[#161B22] border rounded-xl ${
                      plan.recommended
                        ? 'border-[#00A3FF] ring-2 ring-[#00A3FF]/20'
                        : 'border-[#1F242C]'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="text-xs text-[#00A3FF] font-medium mb-2">⭐ RECOMMENDED</div>
                    )}
                    <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                    <p className="text-sm text-[#8B949E] mb-4">{plan.nameUk}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price.monthly}</span>
                      {plan.price.monthly > 0 && <span className="text-[#8B949E]">/mo</span>}
                    </div>
                    <div className="space-y-2 mb-4">
                      {plan.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-green-400">✓</span>
                          <span className="text-[#8B949E]">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-[#1F242C] text-xs text-[#8B949E]">
                      <div>Users: {plan.limits.users}</div>
                      <div>Storage: {plan.limits.storage}</div>
                      <div>API Calls: {plan.limits.apiCalls.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction Fees */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Transaction Fees</h3>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(TRANSACTION_FEES).map(([key, value]) => (
                    <div key={key} className="p-4 bg-[#0D1117] rounded-lg text-center">
                      <div className="text-lg font-bold text-[#00A3FF]">${value.default}</div>
                      <div className="text-sm text-[#8B949E] capitalize">{key}</div>
                      <div className="text-xs text-[#3D444D] mt-1">
                        ${value.min} - ${value.max}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Tiers */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">API Tiers</h3>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(API_TIERS).map(([key, value]) => (
                    <div key={key} className="p-4 bg-[#0D1117] rounded-lg text-center">
                      <div className="text-lg font-bold capitalize mb-2">{key}</div>
                      <div className="text-2xl font-bold text-[#00A3FF]">
                        {value.calls === -1 ? '∞' : `${(value.calls / 1000).toFixed(0)}K`}
                      </div>
                      <div className="text-sm text-[#8B949E]">calls/month</div>
                      <div className="text-lg font-medium mt-2">
                        ${value.price}{value.price > 0 && '/mo'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#8B949E]">
            © 2024-2026 IVYAR. All rights reserved. | Administration Hub v2.0
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin/access" className="text-[#8B949E] hover:text-white">Access Control</Link>
            <Link href="/admin/security" className="text-[#8B949E] hover:text-white">Security</Link>
            <Link href="/admin/breaches" className="text-[#8B949E] hover:text-white">Breaches</Link>
            <Link href="/docs" className="text-[#00A3FF] hover:underline">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
