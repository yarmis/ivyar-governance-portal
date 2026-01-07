'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// MOCK DATA (In production, fetch from API)
// ============================================================================

const TENANTS = [
  { id: 'UA', name: 'Ukraine MSPS', flag: '🇺🇦', status: 'active', users: 45230, decisions: 12450, risk: 4.2 },
  { id: 'PL', name: 'Poland MoD', flag: '🇵🇱', status: 'active', users: 28100, decisions: 8320, risk: 3.1 },
  { id: 'GE', name: 'Georgia MoJ', flag: '🇬🇪', status: 'active', users: 12400, decisions: 4180, risk: 3.8 },
  { id: 'MD', name: 'Moldova MLSP', flag: '🇲🇩', status: 'active', users: 5200, decisions: 1890, risk: 4.5 },
  { id: 'KE', name: 'Kenya MoI', flag: '🇰🇪', status: 'pending', users: 0, decisions: 0, risk: 0 },
];

const MODULES = [
  { id: 'health', name: 'Health', icon: '🏥', decisions: 8420, users: 12300, risk: 4.1 },
  { id: 'access', name: 'Access', icon: '🔐', decisions: 15200, users: 89500, risk: 3.2 },
  { id: 'governance', name: 'Governance', icon: '🏛️', decisions: 3100, users: 450, risk: 2.8 },
  { id: 'emigrant', name: 'Emigrant', icon: '🌍', decisions: 4500, users: 8900, risk: 3.5 },
];

const INCIDENTS = [
  { id: 'INC-001', tenant: '🇺🇦 UA', module: 'Health', type: 'Boundary Violation', severity: 'high', status: 'investigating', time: '2h ago' },
  { id: 'INC-002', tenant: '🇵🇱 PL', module: 'Access', type: 'High Risk Score', severity: 'medium', status: 'resolved', time: '5h ago' },
  { id: 'INC-003', tenant: '🇺🇦 UA', module: 'Access', type: 'Escalation', severity: 'critical', status: 'open', time: '12h ago' },
  { id: 'INC-004', tenant: '🇬🇪 GE', module: 'Governance', type: 'Policy Violation', severity: 'low', status: 'resolved', time: '1d ago' },
  { id: 'INC-005', tenant: '🇲🇩 MD', module: 'Health', type: 'Consent Issue', severity: 'medium', status: 'investigating', time: '2d ago' },
];

const RISK_TRENDS = [
  { month: 'Aug', health: 4.5, access: 3.8, governance: 3.0 },
  { month: 'Sep', health: 4.3, access: 3.5, governance: 2.8 },
  { month: 'Oct', health: 4.1, access: 3.2, governance: 2.9 },
  { month: 'Nov', health: 4.0, access: 3.0, governance: 2.7 },
  { month: 'Dec', health: 4.2, access: 3.1, governance: 2.8 },
  { month: 'Jan', health: 4.1, access: 3.2, governance: 2.8 },
];

const ACTIVITY_TIMELINE = [
  { time: '14:32', action: 'Decision recorded', actor: 'Dr. Kovalenko', module: 'Health', tenant: '🇺🇦' },
  { time: '14:28', action: 'Risk assessment', actor: 'System', module: 'Access', tenant: '🇵🇱' },
  { time: '14:15', action: 'Policy updated', actor: 'Admin', module: 'Governance', tenant: '🇺🇦' },
  { time: '14:02', action: 'Consent recorded', actor: 'Nurse Petrov', module: 'Health', tenant: '🇺🇦' },
  { time: '13:55', action: 'Boundary check', actor: 'System', module: 'Access', tenant: '🇬🇪' },
  { time: '13:48', action: 'Escalation closed', actor: 'Security Admin', module: 'Governance', tenant: '🇵🇱' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function AnalyticsDashboard() {
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate totals
  const totalUsers = TENANTS.reduce((sum, t) => sum + t.users, 0);
  const totalDecisions = TENANTS.reduce((sum, t) => sum + t.decisions, 0);
  const avgRisk = TENANTS.filter(t => t.risk > 0).reduce((sum, t) => sum + t.risk, 0) / TENANTS.filter(t => t.risk > 0).length;
  const activeTenants = TENANTS.filter(t => t.status === 'active').length;

  const getRiskColor = (risk: number) => {
    if (risk >= 7) return 'text-red-400';
    if (risk >= 5) return 'text-orange-400';
    if (risk >= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBg = (risk: number) => {
    if (risk >= 7) return 'bg-red-500/20';
    if (risk >= 5) return 'bg-orange-500/20';
    if (risk >= 3) return 'bg-yellow-500/20';
    return 'bg-green-500/20';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400';
      case 'open': return 'bg-red-500/20 text-red-400';
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1800px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">HBS</div>
              <div>
                <div className="font-bold text-lg">IVYAR Analytics</div>
                <div className="text-xs text-[#8B949E]">Governance Dashboard</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm"
            >
              <option value="all">All Tenants</option>
              {TENANTS.map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
              ))}
            </select>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#161B22] rounded-lg border border-[#1F242C] text-sm text-[#8B949E]">
              {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-[1800px] mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
            <p className="text-[#8B949E]">Real-time governance metrics across all tenants and modules</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00E0B8]">{totalUsers.toLocaleString()}</div>
              <div className="text-xs text-[#8B949E]">Total Users</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00A3FF]">{totalDecisions.toLocaleString()}</div>
              <div className="text-xs text-[#8B949E]">Decisions</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className={`text-2xl font-bold ${getRiskColor(avgRisk)}`}>{avgRisk.toFixed(1)}</div>
              <div className="text-xs text-[#8B949E]">Avg Risk Score</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-purple-400">{activeTenants}/{TENANTS.length}</div>
              <div className="text-xs text-[#8B949E]">Active Tenants</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-cyan-400">{MODULES.length}</div>
              <div className="text-xs text-[#8B949E]">Active Modules</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-orange-400">{INCIDENTS.filter(i => i.status !== 'resolved').length}</div>
              <div className="text-xs text-[#8B949E]">Open Incidents</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-green-400">98.7%</div>
              <div className="text-xs text-[#8B949E]">Compliance Rate</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-yellow-400">4</div>
              <div className="text-xs text-[#8B949E]">Policies Active</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Tenants Overview */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">🌍 Tenants</h3>
                <span className="text-xs text-[#8B949E]">{activeTenants} active</span>
              </div>
              <div className="p-4 space-y-3">
                {TENANTS.map(tenant => (
                  <div key={tenant.id} className="p-3 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tenant.flag}</span>
                        <span className="font-medium text-sm">{tenant.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[#8B949E]">Users: </span>
                        <span className="font-medium">{tenant.users.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Decisions: </span>
                        <span className="font-medium">{tenant.decisions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Risk: </span>
                        <span className={`font-medium ${getRiskColor(tenant.risk)}`}>
                          {tenant.risk > 0 ? tenant.risk.toFixed(1) : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules Overview */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C]">
                <h3 className="font-semibold">📦 Modules</h3>
              </div>
              <div className="p-4 space-y-3">
                {MODULES.map(module => (
                  <div key={module.id} className="p-3 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{module.icon}</span>
                        <span className="font-medium text-sm">{module.name}</span>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-xs ${getRiskBg(module.risk)} ${getRiskColor(module.risk)}`}>
                        Risk: {module.risk.toFixed(1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#8B949E]">Decisions: </span>
                        <span className="font-medium">{module.decisions.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Users: </span>
                        <span className="font-medium">{module.users.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Trends */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C]">
                <h3 className="font-semibold">📈 Risk Trends (6 months)</h3>
              </div>
              <div className="p-4">
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {RISK_TRENDS.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-1">
                        <div 
                          className="w-full bg-red-500/40 rounded-t"
                          style={{ height: `${data.health * 20}px` }}
                          title={`Health: ${data.health}`}
                        />
                        <div 
                          className="w-full bg-blue-500/40"
                          style={{ height: `${data.access * 20}px` }}
                          title={`Access: ${data.access}`}
                        />
                        <div 
                          className="w-full bg-green-500/40 rounded-b"
                          style={{ height: `${data.governance * 20}px` }}
                          title={`Governance: ${data.governance}`}
                        />
                      </div>
                      <span className="text-xs text-[#8B949E]">{data.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500/40 rounded" />
                    <span className="text-[#8B949E]">Health</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500/40 rounded" />
                    <span className="text-[#8B949E]">Access</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500/40 rounded" />
                    <span className="text-[#8B949E]">Governance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incidents */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">⚠️ Recent Incidents</h3>
                <Link href="/admin/breaches" className="text-xs text-[#00E0B8]">View all →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-2 text-left text-xs text-[#8B949E]">ID</th>
                      <th className="px-4 py-2 text-left text-xs text-[#8B949E]">Tenant</th>
                      <th className="px-4 py-2 text-left text-xs text-[#8B949E]">Type</th>
                      <th className="px-4 py-2 text-left text-xs text-[#8B949E]">Severity</th>
                      <th className="px-4 py-2 text-left text-xs text-[#8B949E]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INCIDENTS.map(inc => (
                      <tr key={inc.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-2 text-xs font-mono">{inc.id}</td>
                        <td className="px-4 py-2 text-sm">{inc.tenant}</td>
                        <td className="px-4 py-2 text-xs">{inc.type}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(inc.severity)}`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(inc.status)}`}>
                            {inc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">🕐 Live Activity</h3>
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
                {ACTIVITY_TIMELINE.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 bg-[#0D1117] rounded-lg">
                    <div className="text-xs text-[#8B949E] w-12">{activity.time}</div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.action}</div>
                      <div className="text-xs text-[#8B949E]">
                        {activity.actor} • {activity.module} • {activity.tenant}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/admin/governance" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div><div className="font-medium text-sm">AGM</div><div className="text-xs text-[#8B949E]">Access</div></div>
            </Link>
            <Link href="/hbs/health" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🏥</span>
              <div><div className="font-medium text-sm">Health</div><div className="text-xs text-[#8B949E]">Module</div></div>
            </Link>
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div><div className="font-medium text-sm">Security</div><div className="text-xs text-[#8B949E]">Center</div></div>
            </Link>
            <Link href="/admin/breaches" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div><div className="font-medium text-sm">Breaches</div><div className="text-xs text-[#8B949E]">Incidents</div></div>
            </Link>
            <Link href="/admin/hub" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div><div className="font-medium text-sm">Admin</div><div className="text-xs text-[#8B949E]">Hub</div></div>
            </Link>
            <Link href="/emigrant" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <div><div className="font-medium text-sm">Emigrant</div><div className="text-xs text-[#8B949E]">Hub</div></div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1800px] mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | HBS Analytics Dashboard v1.0 | Washington, USA
        </div>
      </footer>
    </div>
  );
}
