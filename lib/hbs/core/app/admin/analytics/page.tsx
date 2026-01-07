'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

interface KPIData {
  activeTenants: number;
  totalTenants: number;
  highRiskIncidents30d: number;
  policyViolations30d: number;
  auditCoverage: number;
  governanceScore: number;
  decisionsToday: number;
  avgResolutionHours: number;
}

interface RiskTrendPoint {
  timestamp: string;
  date: string;
  avgRiskScore: number;
  minRisk: number;
  maxRisk: number;
  assessments: number;
}

interface IncidentsByModule {
  module: string;
  icon: string;
  count: number;
  high: number;
  medium: number;
  low: number;
}

interface TenantOverview {
  tenantId: string;
  name: string;
  flag: string;
  type: 'country' | 'ministry' | 'program';
  modules: string[];
  lastIncidentAt: string | null;
  governanceScore: number;
  status: 'active' | 'warning' | 'critical';
}

interface Incident {
  id: string;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  tenantFlag: string;
  module: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'policy' | 'access' | 'ethics' | 'risk' | 'boundary';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  description: string;
}

interface PolicyCompliance {
  tenantId: string;
  tenantName: string;
  tenantFlag: string;
  policies: {
    access: { score: number; status: 'green' | 'yellow' | 'red' };
    ethics: { score: number; status: 'green' | 'yellow' | 'red' };
    risk: { score: number; status: 'green' | 'yellow' | 'red' };
    audit: { score: number; status: 'green' | 'yellow' | 'red' };
    data: { score: number; status: 'green' | 'yellow' | 'red' };
  };
  overallScore: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_KPIS: KPIData = {
  activeTenants: 4,
  totalTenants: 5,
  highRiskIncidents30d: 12,
  policyViolations30d: 37,
  auditCoverage: 100,
  governanceScore: 87,
  decisionsToday: 1247,
  avgResolutionHours: 4.2,
};

const MOCK_RISK_TREND: RiskTrendPoint[] = [
  { timestamp: '2025-12-01', date: 'Dec 1', avgRiskScore: 4.2, minRisk: 2.1, maxRisk: 7.8, assessments: 145 },
  { timestamp: '2025-12-08', date: 'Dec 8', avgRiskScore: 4.0, minRisk: 1.8, maxRisk: 7.2, assessments: 168 },
  { timestamp: '2025-12-15', date: 'Dec 15', avgRiskScore: 3.8, minRisk: 1.5, maxRisk: 6.9, assessments: 152 },
  { timestamp: '2025-12-22', date: 'Dec 22', avgRiskScore: 3.9, minRisk: 1.7, maxRisk: 7.1, assessments: 134 },
  { timestamp: '2025-12-29', date: 'Dec 29', avgRiskScore: 3.7, minRisk: 1.4, maxRisk: 6.5, assessments: 121 },
  { timestamp: '2026-01-05', date: 'Jan 5', avgRiskScore: 3.8, minRisk: 1.6, maxRisk: 6.8, assessments: 189 },
];

const MOCK_INCIDENTS_BY_MODULE: IncidentsByModule[] = [
  { module: 'Health', icon: '🏥', count: 24, high: 3, medium: 12, low: 9 },
  { module: 'Access', icon: '🔐', count: 18, high: 5, medium: 8, low: 5 },
  { module: 'Governance', icon: '🏛️', count: 8, high: 1, medium: 4, low: 3 },
  { module: 'Emigrant', icon: '🌍', count: 6, high: 2, medium: 2, low: 2 },
  { module: 'Aviation', icon: '✈️', count: 3, high: 1, medium: 1, low: 1 },
];

const MOCK_TENANTS: TenantOverview[] = [
  { tenantId: 'TEN-UA-001', name: 'Ukraine MSPS', flag: '🇺🇦', type: 'ministry', modules: ['health', 'access', 'governance', 'emigrant'], lastIncidentAt: '2026-01-05T14:32:00Z', governanceScore: 92, status: 'active' },
  { tenantId: 'TEN-PL-001', name: 'Poland MoD', flag: '🇵🇱', type: 'ministry', modules: ['health', 'access', 'governance'], lastIncidentAt: '2026-01-04T09:15:00Z', governanceScore: 88, status: 'active' },
  { tenantId: 'TEN-GE-001', name: 'Georgia MoJ', flag: '🇬🇪', type: 'ministry', modules: ['health', 'access', 'governance'], lastIncidentAt: '2026-01-03T16:45:00Z', governanceScore: 85, status: 'active' },
  { tenantId: 'TEN-MD-001', name: 'Moldova MLSP', flag: '🇲🇩', type: 'ministry', modules: ['health', 'access'], lastIncidentAt: '2026-01-02T11:20:00Z', governanceScore: 78, status: 'warning' },
  { tenantId: 'TEN-KE-001', name: 'Kenya MoI', flag: '🇰🇪', type: 'ministry', modules: ['access', 'governance'], lastIncidentAt: null, governanceScore: 0, status: 'critical' },
];

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-001', timestamp: '2026-01-06T14:32:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', tenantFlag: '🇺🇦', module: 'Health', severity: 'high', type: 'boundary', status: 'investigating', description: 'Boundary violation in consent workflow' },
  { id: 'INC-002', timestamp: '2026-01-06T12:15:00Z', tenantId: 'TEN-PL-001', tenantName: 'Poland', tenantFlag: '🇵🇱', module: 'Access', severity: 'medium', type: 'access', status: 'resolved', description: 'Unauthorized role assignment attempt' },
  { id: 'INC-003', timestamp: '2026-01-06T10:45:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', tenantFlag: '🇺🇦', module: 'Access', severity: 'critical', type: 'policy', status: 'escalated', description: 'Critical policy violation - bulk data export' },
  { id: 'INC-004', timestamp: '2026-01-05T18:20:00Z', tenantId: 'TEN-GE-001', tenantName: 'Georgia', tenantFlag: '🇬🇪', module: 'Governance', severity: 'low', type: 'risk', status: 'resolved', description: 'Risk threshold exceeded during assessment' },
  { id: 'INC-005', timestamp: '2026-01-05T14:10:00Z', tenantId: 'TEN-MD-001', tenantName: 'Moldova', tenantFlag: '🇲🇩', module: 'Health', severity: 'medium', type: 'ethics', status: 'open', description: 'Ethics consultation required for complex case' },
  { id: 'INC-006', timestamp: '2026-01-05T09:30:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', tenantFlag: '🇺🇦', module: 'Emigrant', severity: 'high', type: 'access', status: 'investigating', description: 'Cross-tenant access attempt blocked' },
  { id: 'INC-007', timestamp: '2026-01-04T16:45:00Z', tenantId: 'TEN-PL-001', tenantName: 'Poland', tenantFlag: '🇵🇱', module: 'Access', severity: 'low', type: 'policy', status: 'resolved', description: 'Minor policy configuration mismatch' },
  { id: 'INC-008', timestamp: '2026-01-04T11:20:00Z', tenantId: 'TEN-GE-001', tenantName: 'Georgia', tenantFlag: '🇬🇪', module: 'Health', severity: 'medium', type: 'boundary', status: 'resolved', description: 'Communication protocol deviation' },
];

const MOCK_POLICY_COMPLIANCE: PolicyCompliance[] = [
  { tenantId: 'TEN-UA-001', tenantName: 'Ukraine MSPS', tenantFlag: '🇺🇦', policies: { access: { score: 95, status: 'green' }, ethics: { score: 92, status: 'green' }, risk: { score: 88, status: 'yellow' }, audit: { score: 100, status: 'green' }, data: { score: 94, status: 'green' } }, overallScore: 94 },
  { tenantId: 'TEN-PL-001', tenantName: 'Poland MoD', tenantFlag: '🇵🇱', policies: { access: { score: 91, status: 'green' }, ethics: { score: 88, status: 'yellow' }, risk: { score: 85, status: 'yellow' }, audit: { score: 98, status: 'green' }, data: { score: 90, status: 'green' } }, overallScore: 90 },
  { tenantId: 'TEN-GE-001', tenantName: 'Georgia MoJ', tenantFlag: '🇬🇪', policies: { access: { score: 88, status: 'yellow' }, ethics: { score: 85, status: 'yellow' }, risk: { score: 82, status: 'yellow' }, audit: { score: 95, status: 'green' }, data: { score: 86, status: 'yellow' } }, overallScore: 87 },
  { tenantId: 'TEN-MD-001', tenantName: 'Moldova MLSP', tenantFlag: '🇲🇩', policies: { access: { score: 78, status: 'yellow' }, ethics: { score: 72, status: 'yellow' }, risk: { score: 68, status: 'red' }, audit: { score: 92, status: 'green' }, data: { score: 75, status: 'yellow' } }, overallScore: 77 },
  { tenantId: 'TEN-KE-001', tenantName: 'Kenya MoI', tenantFlag: '🇰🇪', policies: { access: { score: 0, status: 'red' }, ethics: { score: 0, status: 'red' }, risk: { score: 0, status: 'red' }, audit: { score: 0, status: 'red' }, data: { score: 0, status: 'red' } }, overallScore: 0 },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function GovernanceAnalyticsDashboard() {
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 50) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

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
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400';
      case 'open': return 'bg-blue-500/20 text-blue-400';
      case 'escalated': return 'bg-red-500/20 text-red-400';
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Calculate max for chart scaling
  const maxRisk = Math.max(...MOCK_RISK_TREND.map(p => p.maxRisk));

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1800px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">HBS</div>
              <div>
                <div className="font-bold text-lg">Governance Analytics</div>
                <div className="text-xs text-[#8B949E]">Real-time oversight for ministries & donors</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm">
              <option value="all">All Tenants</option>
              {MOCK_TENANTS.map(t => <option key={t.tenantId} value={t.tenantId}>{t.flag} {t.name}</option>)}
            </select>
            <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm">
              <option value="all">All Modules</option>
              {MOCK_INCIDENTS_BY_MODULE.map(m => <option key={m.module} value={m.module}>{m.icon} {m.module}</option>)}
            </select>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#161B22] rounded-lg border border-[#1F242C] text-sm text-[#8B949E]">
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
              { key: 'tenants', label: 'Tenants', icon: '🌍' },
              { key: 'incidents', label: 'Incidents', icon: '⚠️' },
              { key: 'compliance', label: 'Compliance', icon: '✅' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === tab.key ? 'bg-[#00E0B8] text-[#0D1117]' : 'hover:bg-[#1F242C] text-[#8B949E]'}`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/* SECTION A: TOP KPIs */}
          {/* ============================================================ */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00E0B8]">{MOCK_KPIS.activeTenants}/{MOCK_KPIS.totalTenants}</div>
              <div className="text-xs text-[#8B949E]">Active Tenants</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-orange-400">{MOCK_KPIS.highRiskIncidents30d}</div>
              <div className="text-xs text-[#8B949E]">High-Risk (30d)</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-yellow-400">{MOCK_KPIS.policyViolations30d}</div>
              <div className="text-xs text-[#8B949E]">Violations (30d)</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-green-400">{MOCK_KPIS.auditCoverage}%</div>
              <div className="text-xs text-[#8B949E]">Audit Coverage</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className={`text-2xl font-bold ${getScoreColor(MOCK_KPIS.governanceScore)}`}>{MOCK_KPIS.governanceScore}</div>
              <div className="text-xs text-[#8B949E]">Governance Score</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-[#00A3FF]">{MOCK_KPIS.decisionsToday.toLocaleString()}</div>
              <div className="text-xs text-[#8B949E]">Decisions Today</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-purple-400">{MOCK_KPIS.avgResolutionHours}h</div>
              <div className="text-xs text-[#8B949E]">Avg Resolution</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-cyan-400">5</div>
              <div className="text-xs text-[#8B949E]">Active Modules</div>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* ============================================================ */}
              {/* SECTION B: GOVERNANCE HEALTH (Charts) */}
              {/* ============================================================ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Risk Level Over Time */}
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                  <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                    <h3 className="font-semibold">📈 Risk Level Over Time</h3>
                    <span className="text-xs text-[#8B949E]">Last 6 weeks</span>
                  </div>
                  <div className="p-4">
                    <div className="h-[200px] flex items-end justify-between gap-4">
                      {MOCK_RISK_TREND.map((point, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          {/* Bar with range */}
                          <div className="w-full relative" style={{ height: `${(point.maxRisk / maxRisk) * 150}px` }}>
                            {/* Max-Min range */}
                            <div 
                              className="absolute w-full bg-[#00E0B8]/10 rounded"
                              style={{ 
                                bottom: `${(point.minRisk / maxRisk) * 150}px`,
                                height: `${((point.maxRisk - point.minRisk) / maxRisk) * 150}px`
                              }}
                            />
                            {/* Average line */}
                            <div 
                              className="absolute w-full h-1 bg-[#00E0B8] rounded"
                              style={{ bottom: `${(point.avgRiskScore / maxRisk) * 150}px` }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-[#00E0B8]">{point.avgRiskScore.toFixed(1)}</div>
                            <div className="text-xs text-[#8B949E]">{point.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-4 text-xs text-[#8B949E]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-[#00E0B8] rounded" />
                        <span>Average</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#00E0B8]/10 rounded" />
                        <span>Min-Max Range</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incidents by Module */}
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                  <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                    <h3 className="font-semibold">📊 Incidents by Module</h3>
                    <span className="text-xs text-[#8B949E]">Last 30 days</span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {MOCK_INCIDENTS_BY_MODULE.map((m) => (
                        <div key={m.module} className="flex items-center gap-4">
                          <div className="w-24 flex items-center gap-2">
                            <span>{m.icon}</span>
                            <span className="text-sm">{m.module}</span>
                          </div>
                          <div className="flex-1 flex h-6 rounded-lg overflow-hidden bg-[#0D1117]">
                            <div className="bg-red-500/80 h-full" style={{ width: `${(m.high / m.count) * 100}%` }} title={`High: ${m.high}`} />
                            <div className="bg-yellow-500/80 h-full" style={{ width: `${(m.medium / m.count) * 100}%` }} title={`Medium: ${m.medium}`} />
                            <div className="bg-green-500/80 h-full" style={{ width: `${(m.low / m.count) * 100}%` }} title={`Low: ${m.low}`} />
                          </div>
                          <div className="w-12 text-right text-sm font-medium">{m.count}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs text-[#8B949E]">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/80 rounded" /><span>High</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500/80 rounded" /><span>Medium</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500/80 rounded" /><span>Low</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION C: TENANTS OVERVIEW */}
              {/* ============================================================ */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl mb-8">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">🌍 Tenants Overview</h3>
                  <Link href="/admin/tenants" className="text-xs text-[#00E0B8]">Manage tenants →</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1F242C]">
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Active Modules</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Last Incident</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Governance Score</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TENANTS.map(tenant => (
                        <tr key={tenant.tenantId} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{tenant.flag}</span>
                              <div>
                                <div className="font-medium text-sm">{tenant.name}</div>
                                <div className="text-xs text-[#8B949E]">{tenant.tenantId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{tenant.type}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {tenant.modules.slice(0, 3).map(m => (
                                <span key={m} className="px-2 py-0.5 bg-[#0D1117] rounded text-xs">{m}</span>
                              ))}
                              {tenant.modules.length > 3 && <span className="text-xs text-[#8B949E]">+{tenant.modules.length - 3}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#8B949E]">
                            {tenant.lastIncidentAt ? formatTimeAgo(tenant.lastIncidentAt) : 'Never'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getScoreBg(tenant.governanceScore)}`}>
                                {tenant.governanceScore || '—'}
                              </div>
                              <div className="w-16 h-2 bg-[#0D1117] rounded-full overflow-hidden">
                                <div className={`h-full ${tenant.governanceScore >= 90 ? 'bg-green-500' : tenant.governanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${tenant.governanceScore}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tenant.status)}`}>{tenant.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============================================================ */}
              {/* SECTION D: INCIDENTS & ESCALATIONS */}
              {/* ============================================================ */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl mb-8">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">⚠️ Recent Incidents & Escalations</h3>
                  <Link href="/admin/breaches" className="text-xs text-[#00E0B8]">View all →</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1F242C]">
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Time</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Tenant</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Module</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Severity</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INCIDENTS.slice(0, 6).map(inc => (
                        <tr key={inc.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                          <td className="px-4 py-3 text-xs text-[#8B949E]">{formatTimeAgo(inc.timestamp)}</td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{inc.tenantFlag} {inc.tenantName}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">{inc.module}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(inc.severity)}`}>{inc.severity}</span>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{inc.type}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(inc.status)}`}>{inc.status}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#8B949E] max-w-[250px] truncate">{inc.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* COMPLIANCE TAB */}
          {/* ============================================================ */}
          {activeTab === 'compliance' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C]">
                <h3 className="font-semibold">✅ Policy Compliance Heatmap</h3>
                <p className="text-xs text-[#8B949E] mt-1">Green ≥90% | Yellow ≥70% | Red &lt;70%</p>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Tenant</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Access</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Ethics</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Risk</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Audit</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Data</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Overall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_POLICY_COMPLIANCE.map(tenant => (
                      <tr key={tenant.tenantId} className="border-t border-[#1F242C]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{tenant.tenantFlag}</span>
                            <span className="text-sm font-medium">{tenant.tenantName}</span>
                          </div>
                        </td>
                        {(['access', 'ethics', 'risk', 'audit', 'data'] as const).map(policy => (
                          <td key={policy} className="px-4 py-3 text-center">
                            <div className={`w-12 h-12 mx-auto rounded-lg ${getComplianceColor(tenant.policies[policy].status)} flex items-center justify-center text-sm font-bold text-white`}>
                              {tenant.policies[policy].score || '—'}
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <div className={`w-14 h-14 mx-auto rounded-xl ${tenant.overallScore >= 90 ? 'bg-green-500' : tenant.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'} flex items-center justify-center text-lg font-bold text-white`}>
                            {tenant.overallScore || '—'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TENANTS TAB */}
          {/* ============================================================ */}
          {activeTab === 'tenants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_TENANTS.map(tenant => (
                <div key={tenant.tenantId} className={`p-5 bg-[#161B22] border rounded-xl ${tenant.status === 'active' ? 'border-[#1F242C]' : tenant.status === 'warning' ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tenant.flag}</span>
                      <div>
                        <div className="font-semibold">{tenant.name}</div>
                        <div className="text-xs text-[#8B949E]">{tenant.tenantId}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tenant.status)}`}>{tenant.status}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8B949E]">Type</span>
                      <span className="capitalize">{tenant.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8B949E]">Modules</span>
                      <span>{tenant.modules.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#8B949E]">Last Incident</span>
                      <span>{tenant.lastIncidentAt ? formatTimeAgo(tenant.lastIncidentAt) : 'Never'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8B949E]">Governance Score</span>
                      <div className={`text-xl font-bold ${getScoreColor(tenant.governanceScore)}`}>{tenant.governanceScore || '—'}</div>
                    </div>
                    <div className="w-full h-2 bg-[#0D1117] rounded-full overflow-hidden">
                      <div className={`h-full ${tenant.governanceScore >= 90 ? 'bg-green-500' : tenant.governanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${tenant.governanceScore}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {tenant.modules.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-[#0D1117] rounded text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* INCIDENTS TAB */}
          {/* ============================================================ */}
          {activeTab === 'incidents' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">⚠️ All Incidents</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs">Critical: 1</button>
                  <button className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">High: 3</button>
                  <button className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Medium: 4</button>
                  <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs">Low: 2</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">ID</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Time</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Module</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Severity</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_INCIDENTS.map(inc => (
                      <tr key={inc.id} className="border-b border-[#1F242C]/50 hover:bg-[#1F242C]/30">
                        <td className="px-4 py-3 text-xs font-mono">{inc.id}</td>
                        <td className="px-4 py-3 text-xs text-[#8B949E]">{formatTimeAgo(inc.timestamp)}</td>
                        <td className="px-4 py-3 text-sm">{inc.tenantFlag} {inc.tenantName}</td>
                        <td className="px-4 py-3 text-sm">{inc.module}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(inc.severity)}`}>{inc.severity}</span></td>
                        <td className="px-4 py-3 text-sm capitalize">{inc.type}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(inc.status)}`}>{inc.status}</span></td>
                        <td className="px-4 py-3 text-sm text-[#8B949E] max-w-[300px]">{inc.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
            <Link href="/api/hbs/pdf" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div><div className="font-medium text-sm">Reports</div><div className="text-xs text-[#8B949E]">PDF</div></div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1800px] mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | HBS Governance Analytics v1.0 | Washington, USA
        </div>
      </footer>
    </div>
  );
}
