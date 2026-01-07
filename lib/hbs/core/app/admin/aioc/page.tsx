'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

interface AIMetrics {
  interactions24h: number;
  interactions30d: number;
  highRiskAlerts: number;
  boundaryViolations: number;
  policyViolations: number;
  auditCoverage: number;
  avgResponseTime: number;
  escalations: number;
}

interface AIIncident {
  id: string;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  tenantFlag: string;
  module: string;
  role: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'boundary' | 'policy' | 'risk' | 'ethics' | 'injection';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  description: string;
}

interface TenantAIStatus {
  tenantId: string;
  tenantName: string;
  tenantFlag: string;
  health: 'green' | 'yellow' | 'red';
  access: 'green' | 'yellow' | 'red';
  governance: 'green' | 'yellow' | 'red';
  interactions24h: number;
  riskScore: number;
}

interface AIAuditEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  role: string;
  module: string;
  action: string;
  riskLevel: string;
  status: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_METRICS: AIMetrics = {
  interactions24h: 1247,
  interactions30d: 41892,
  highRiskAlerts: 8,
  boundaryViolations: 3,
  policyViolations: 12,
  auditCoverage: 100,
  avgResponseTime: 1.2,
  escalations: 5,
};

const MOCK_INCIDENTS: AIIncident[] = [
  { id: 'AI-INC-001', timestamp: '2026-01-06T14:32:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', tenantFlag: '🇺🇦', module: 'health', role: 'doctor', severity: 'high', type: 'boundary', status: 'investigating', description: 'Attempted medical advice generation blocked' },
  { id: 'AI-INC-002', timestamp: '2026-01-06T12:15:00Z', tenantId: 'TEN-PL-001', tenantName: 'Poland', tenantFlag: '🇵🇱', module: 'access', role: 'admin', severity: 'medium', type: 'policy', status: 'resolved', description: 'Policy modification request blocked' },
  { id: 'AI-INC-003', timestamp: '2026-01-06T10:45:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', tenantFlag: '🇺🇦', module: 'governance', role: 'ministry', severity: 'low', type: 'risk', status: 'resolved', description: 'High risk score triggered review' },
  { id: 'AI-INC-004', timestamp: '2026-01-06T09:20:00Z', tenantId: 'TEN-GE-001', tenantName: 'Georgia', tenantFlag: '🇬🇪', module: 'health', role: 'patient', severity: 'critical', type: 'injection', status: 'escalated', description: 'Prompt injection attempt detected and blocked' },
  { id: 'AI-INC-005', timestamp: '2026-01-05T16:30:00Z', tenantId: 'TEN-MD-001', tenantName: 'Moldova', tenantFlag: '🇲🇩', module: 'health', role: 'doctor', severity: 'medium', type: 'ethics', status: 'open', description: 'Ethics boundary approach warning' },
];

const MOCK_TENANT_STATUS: TenantAIStatus[] = [
  { tenantId: 'TEN-UA-001', tenantName: 'Ukraine MSPS', tenantFlag: '🇺🇦', health: 'green', access: 'green', governance: 'green', interactions24h: 542, riskScore: 3.2 },
  { tenantId: 'TEN-PL-001', tenantName: 'Poland MoD', tenantFlag: '🇵🇱', health: 'green', access: 'yellow', governance: 'green', interactions24h: 328, riskScore: 3.8 },
  { tenantId: 'TEN-GE-001', tenantName: 'Georgia MoJ', tenantFlag: '🇬🇪', health: 'yellow', access: 'green', governance: 'green', interactions24h: 215, riskScore: 4.5 },
  { tenantId: 'TEN-MD-001', tenantName: 'Moldova MLSP', tenantFlag: '🇲🇩', health: 'yellow', access: 'green', governance: 'yellow', interactions24h: 162, riskScore: 5.2 },
];

const MOCK_AUDIT: AIAuditEntry[] = [
  { id: 'AUD-001', timestamp: '2026-01-06T14:35:00Z', tenantId: 'TEN-UA-001', role: 'doctor', module: 'health', action: 'explain_consent', riskLevel: 'low', status: 'success' },
  { id: 'AUD-002', timestamp: '2026-01-06T14:32:00Z', tenantId: 'TEN-UA-001', role: 'doctor', module: 'health', action: 'medical_advice', riskLevel: 'high', status: 'blocked' },
  { id: 'AUD-003', timestamp: '2026-01-06T14:28:00Z', tenantId: 'TEN-PL-001', role: 'admin', module: 'governance', action: 'analyze_incidents', riskLevel: 'low', status: 'success' },
  { id: 'AUD-004', timestamp: '2026-01-06T14:25:00Z', tenantId: 'TEN-GE-001', role: 'patient', module: 'health', action: 'explain_rights', riskLevel: 'low', status: 'success' },
  { id: 'AUD-005', timestamp: '2026-01-06T14:20:00Z', tenantId: 'TEN-UA-001', role: 'ministry', module: 'governance', action: 'generate_report', riskLevel: 'low', status: 'success' },
];

const RISK_TREND = [
  { time: '00:00', score: 3.2 },
  { time: '04:00', score: 2.8 },
  { time: '08:00', score: 3.5 },
  { time: '12:00', score: 4.2 },
  { time: '16:00', score: 3.8 },
  { time: '20:00', score: 3.4 },
  { time: 'Now', score: 3.6 },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function AIOCDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400';
      case 'open': return 'bg-blue-500/20 text-blue-400';
      case 'escalated': return 'bg-red-500/20 text-red-400';
      case 'success': return 'text-green-400';
      case 'blocked': return 'text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const maxRisk = Math.max(...RISK_TREND.map(r => r.score));

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1800px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">AI</div>
              <div>
                <div className="font-bold text-lg">AI Operations Center</div>
                <div className="text-xs text-[#8B949E]">Real-time AI governance & oversight</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm"
            >
              <option value="all">All Tenants</option>
              {MOCK_TENANT_STATUS.map(t => (
                <option key={t.tenantId} value={t.tenantId}>{t.tenantFlag} {t.tenantName}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#161B22] rounded-lg border border-[#1F242C] text-sm text-[#8B949E]">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-[1800px] mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-[#161B22] rounded-xl border border-[#1F242C] w-fit">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'incidents', label: 'Incidents', icon: '⚠️' },
              { key: 'tenants', label: 'Tenant Status', icon: '🌍' },
              { key: 'audit', label: 'Audit Log', icon: '📋' },
              { key: 'explain', label: 'Explainability', icon: '🔍' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key ? 'bg-[#00E0B8] text-[#0D1117]' : 'hover:bg-[#1F242C] text-[#8B949E]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00E0B8]">{MOCK_METRICS.interactions24h.toLocaleString()}</div>
              <div className="text-xs text-[#8B949E]">Interactions (24h)</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00A3FF]">{MOCK_METRICS.interactions30d.toLocaleString()}</div>
              <div className="text-xs text-[#8B949E]">Interactions (30d)</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-orange-400">{MOCK_METRICS.highRiskAlerts}</div>
              <div className="text-xs text-[#8B949E]">High-Risk Alerts</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-red-400">{MOCK_METRICS.boundaryViolations}</div>
              <div className="text-xs text-[#8B949E]">Boundary Violations</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-yellow-400">{MOCK_METRICS.policyViolations}</div>
              <div className="text-xs text-[#8B949E]">Policy Violations</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-green-400">{MOCK_METRICS.auditCoverage}%</div>
              <div className="text-xs text-[#8B949E]">Audit Coverage</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-purple-400">{MOCK_METRICS.avgResponseTime}s</div>
              <div className="text-xs text-[#8B949E]">Avg Response</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-cyan-400">{MOCK_METRICS.escalations}</div>
              <div className="text-xs text-[#8B949E]">Escalations</div>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Risk Trend */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">📈 AI Risk Level (24h)</h3>
                </div>
                <div className="p-4">
                  <div className="h-[200px] flex items-end justify-between gap-4">
                    {RISK_TREND.map((point, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs text-[#00E0B8] font-medium">{point.score.toFixed(1)}</div>
                        <div
                          className="w-full bg-gradient-to-t from-[#00E0B8] to-[#00A3FF] rounded-t"
                          style={{ height: `${(point.score / maxRisk) * 150}px` }}
                        />
                        <div className="text-xs text-[#8B949E]">{point.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Behavior Heatmap */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">🎯 AI Behavior by Tenant & Module</h3>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs text-[#8B949E]">Tenant</th>
                        <th className="px-3 py-2 text-center text-xs text-[#8B949E]">Health</th>
                        <th className="px-3 py-2 text-center text-xs text-[#8B949E]">Access</th>
                        <th className="px-3 py-2 text-center text-xs text-[#8B949E]">Gov</th>
                        <th className="px-3 py-2 text-center text-xs text-[#8B949E]">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TENANT_STATUS.map(tenant => (
                        <tr key={tenant.tenantId} className="border-t border-[#1F242C]">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span>{tenant.tenantFlag}</span>
                              <span className="text-sm">{tenant.tenantName.split(' ')[0]}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className={`w-8 h-8 mx-auto rounded ${getStatusColor(tenant.health)}`} />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className={`w-8 h-8 mx-auto rounded ${getStatusColor(tenant.access)}`} />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className={`w-8 h-8 mx-auto rounded ${getStatusColor(tenant.governance)}`} />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-sm font-medium ${tenant.riskScore < 4 ? 'text-green-400' : tenant.riskScore < 5 ? 'text-yellow-400' : 'text-orange-400'}`}>
                              {tenant.riskScore.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Incidents */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl lg:col-span-2">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">⚠️ Recent AI Incidents</h3>
                  <button onClick={() => setActiveTab('incidents')} className="text-xs text-[#00E0B8]">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1F242C]">
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Time</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Module</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Severity</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Type</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Status</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INCIDENTS.slice(0, 5).map(inc => (
                        <tr key={inc.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                          <td className="px-4 py-3 text-xs text-[#8B949E]">{formatTimeAgo(inc.timestamp)}</td>
                          <td className="px-4 py-3 text-sm">{inc.tenantFlag} {inc.tenantName}</td>
                          <td className="px-4 py-3 text-sm capitalize">{inc.module}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(inc.severity)}`}>{inc.severity}</span>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{inc.type}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(inc.status)}`}>{inc.status}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#8B949E] max-w-[300px] truncate">{inc.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">📋 AI Audit Log</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-[#0D1117] border border-[#1F242C] rounded text-xs">Export JSON</button>
                  <button className="px-3 py-1 bg-[#0D1117] border border-[#1F242C] rounded text-xs">Export CSV</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">ID</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Time</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Role</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Module</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Action</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Risk</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_AUDIT.map(entry => (
                      <tr key={entry.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-3 text-xs font-mono">{entry.id}</td>
                        <td className="px-4 py-3 text-xs text-[#8B949E]">{formatTimeAgo(entry.timestamp)}</td>
                        <td className="px-4 py-3 text-sm">{entry.tenantId}</td>
                        <td className="px-4 py-3 text-sm capitalize">{entry.role}</td>
                        <td className="px-4 py-3 text-sm capitalize">{entry.module}</td>
                        <td className="px-4 py-3 text-sm">{entry.action}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${entry.riskLevel === 'high' ? 'text-red-400' : entry.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                            {entry.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs ${getStatusColor(entry.status)}`}>{entry.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'explain' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C]">
                <h3 className="font-semibold">🔍 AI Explainability Panel</h3>
                <p className="text-xs text-[#8B949E] mt-1">Understand why AI made specific decisions</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sample Explanation */}
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-[#1F242C]">
                    <h4 className="font-medium mb-3">Response: AI-2026-001</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-[#8B949E]">Question:</span>
                        <p className="mt-1">"Help me explain a difficult decision to a patient"</p>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Policies Used:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">HBS-ETH-001</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">HBS-COMM-SPIKES</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Boundaries Checked:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">✓ no-medical-advice</span>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">✓ patient-privacy</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Risk Assessment:</span>
                        <p className="mt-1 text-yellow-400">Medium (Score: 4.2)</p>
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Decision Path:</span>
                        <p className="mt-1 font-mono text-xs">ethics_check → communication_protocol → spikes_framework → generate_response</p>
                      </div>
                    </div>
                  </div>

                  {/* Governance Principles */}
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0D1117] rounded-xl border border-[#1F242C]">
                      <h4 className="font-medium mb-2">Active Governance Principles</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Human-Centered Decision Making</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Policy Alignment Verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Boundary Enforcement</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Risk Assessment Integration</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Audit Trail Generation</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0D1117] rounded-xl border border-[#1F242C]">
                      <h4 className="font-medium mb-2">Compliance Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>GDPR</span>
                          <span className="text-green-400">✓ Compliant</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>ISO/IEC 27001</span>
                          <span className="text-green-400">✓ Compliant</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>WHO Ethics Guidelines</span>
                          <span className="text-green-400">✓ Compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/admin/ai-assistant" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div><div className="font-medium text-sm">AI Assistant</div><div className="text-xs text-[#8B949E]">Chat</div></div>
            </Link>
            <Link href="/admin/analytics" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div><div className="font-medium text-sm">Analytics</div><div className="text-xs text-[#8B949E]">Dashboard</div></div>
            </Link>
            <Link href="/admin/governance" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div><div className="font-medium text-sm">AGM</div><div className="text-xs text-[#8B949E]">Access</div></div>
            </Link>
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div><div className="font-medium text-sm">Security</div><div className="text-xs text-[#8B949E]">Center</div></div>
            </Link>
            <Link href="/admin/breaches" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div><div className="font-medium text-sm">Breaches</div><div className="text-xs text-[#8B949E]">Incidents</div></div>
            </Link>
            <Link href="/api/hbs/pdf" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div><div className="font-medium text-sm">Reports</div><div className="text-xs text-[#8B949E]">PDF</div></div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1800px] mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | AI Operations Center v1.0 | Washington, USA
        </div>
      </footer>
    </div>
  );
}
