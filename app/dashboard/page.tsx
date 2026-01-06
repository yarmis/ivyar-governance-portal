'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type DashboardView = 'executive' | 'operations' | 'analytics' | 'governance';
type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
type TimeRange = '24h' | '7d' | '30d' | '90d' | 'ytd';

// ============================================
// MOCK DATA
// ============================================
const EXECUTIVE_KPIS = {
  beneficiaries: { value: 9647832, change: 2.4, label: 'Total Beneficiaries', icon: '👥' },
  disbursed: { value: 4218000000, change: 8.7, label: 'Total Disbursed', icon: '💰', currency: true },
  programs: { value: 192, change: 3, label: 'Active Programs', icon: '📋' },
  paymentSuccess: { value: 99.7, change: 0.2, label: 'Payment Success Rate', icon: '✓', percentage: true },
};

const PROGRAM_STATUS = [
  { id: 'idp-assistance', name: 'IDP Cash Assistance', status: 'active', beneficiaries: 2847000, budget: 1200000000, utilized: 87, trend: 'up' },
  { id: 'housing-comp', name: 'Housing Compensation', status: 'active', beneficiaries: 892000, budget: 890000000, utilized: 72, trend: 'up' },
  { id: 'child-support', name: 'Child Support Program', status: 'active', beneficiaries: 1456000, budget: 456000000, utilized: 91, trend: 'stable' },
  { id: 'disability', name: 'Disability Allowance', status: 'active', beneficiaries: 723000, budget: 378000000, utilized: 84, trend: 'up' },
  { id: 'pension-top', name: 'Pension Top-up', status: 'active', beneficiaries: 2134000, budget: 567000000, utilized: 95, trend: 'stable' },
  { id: 'emergency', name: 'Emergency Response Fund', status: 'standby', beneficiaries: 0, budget: 250000000, utilized: 12, trend: 'stable' },
];

const AI_INSIGHTS = [
  {
    id: 'insight-1',
    type: 'recommendation',
    priority: 'high',
    title: 'Budget Reallocation Opportunity',
    description: 'Emergency Response Fund has 88% unutilized budget. Recommend temporary reallocation of $45M to IDP Assistance which is approaching 90% utilization.',
    confidence: 94,
    impact: '$45M optimization',
    action: 'Review Recommendation',
    timestamp: '2 hours ago',
  },
  {
    id: 'insight-2',
    type: 'anomaly',
    priority: 'medium',
    title: 'Unusual Registration Pattern Detected',
    description: 'Kharkiv Oblast showing 340% increase in new registrations over past 48 hours. Pattern consistent with displacement event. Recommend capacity scaling.',
    confidence: 89,
    impact: '~12,000 new beneficiaries',
    action: 'View Analysis',
    timestamp: '4 hours ago',
  },
  {
    id: 'insight-3',
    type: 'prediction',
    priority: 'medium',
    title: 'Payment Volume Forecast',
    description: 'Predicted 23% increase in payment volume for next disbursement cycle due to seasonal factors and program expansions.',
    confidence: 91,
    impact: '+$89M processing',
    action: 'Prepare Resources',
    timestamp: '6 hours ago',
  },
  {
    id: 'insight-4',
    type: 'compliance',
    priority: 'low',
    title: 'IATI Reporting Reminder',
    description: 'Q4 2025 IATI report due in 12 days. Current data completeness at 97.2%. 3 activities require updated results.',
    confidence: 100,
    impact: 'Compliance deadline',
    action: 'View Report Status',
    timestamp: '1 day ago',
  },
];

const SYSTEM_ALERTS: { id: string; severity: AlertSeverity; title: string; description: string; timestamp: string; acknowledged: boolean }[] = [
  { id: 'alert-1', severity: 'warning', title: 'Payment Gateway Latency', description: 'PrivatBank API response time elevated (avg 2.3s vs 0.8s baseline)', timestamp: '15 min ago', acknowledged: false },
  { id: 'alert-2', severity: 'info', title: 'Scheduled Maintenance', description: 'Database maintenance window: Jan 6, 02:00-04:00 UTC', timestamp: '2 hours ago', acknowledged: true },
  { id: 'alert-3', severity: 'success', title: 'Backup Completed', description: 'Daily backup completed successfully. 847GB archived.', timestamp: '6 hours ago', acknowledged: true },
];

const REAL_TIME_METRICS = {
  activeUsers: 4827,
  requestsPerSecond: 1247,
  avgResponseTime: 142,
  errorRate: 0.02,
  queueDepth: 234,
  cacheHitRate: 98.7,
};

const REGIONAL_DATA = [
  { region: 'Kyiv', beneficiaries: 1847000, payments: 89, status: 'normal' },
  { region: 'Kharkiv', beneficiaries: 1234000, payments: 94, status: 'elevated' },
  { region: 'Dnipro', beneficiaries: 987000, payments: 91, status: 'normal' },
  { region: 'Odesa', beneficiaries: 756000, payments: 88, status: 'normal' },
  { region: 'Lviv', beneficiaries: 623000, payments: 96, status: 'normal' },
  { region: 'Zaporizhzhia', beneficiaries: 534000, payments: 82, status: 'warning' },
  { region: 'Other', beneficiaries: 3666832, payments: 90, status: 'normal' },
];

const DONOR_FUNDING = [
  { donor: 'World Bank', committed: 1200000000, disbursed: 890000000, color: '#00A3FF' },
  { donor: 'USAID', committed: 890000000, disbursed: 720000000, color: '#3CCB7F' },
  { donor: 'EU', committed: 750000000, disbursed: 650000000, color: '#A371F7' },
  { donor: 'UNHCR', committed: 450000000, disbursed: 380000000, color: '#F59E0B' },
  { donor: 'Other', committed: 928000000, disbursed: 578000000, color: '#8B949E' },
];

const GOVERNANCE_METRICS = {
  aiDecisions: { total: 847234, humanOverride: 1247, overrideRate: 0.15 },
  escalations: { pending: 12, resolved24h: 89, avgResolutionTime: '4.2h' },
  compliance: { overall: 98.4, gdpr: 99.1, iati: 99.2, nationalLaw: 97.8 },
  audit: { lastAudit: '2025-12-15', findings: 3, resolved: 2, nextAudit: '2026-03-15' },
};

const RECENT_ACTIVITY = [
  { time: '14:32', action: 'Payment batch completed', details: '12,847 payments • $4.2M', user: 'System', type: 'payment' },
  { time: '14:28', action: 'New program approved', details: 'Winter Heating Subsidy 2026', user: 'Minister Vereshchuk', type: 'approval' },
  { time: '14:15', action: 'AI recommendation accepted', details: 'Eligibility threshold adjustment', user: 'Dir. Kovalenko', type: 'ai' },
  { time: '14:02', action: 'Donor report generated', details: 'USAID Q4 2025 Report', user: 'System', type: 'report' },
  { time: '13:58', action: 'Escalation resolved', details: 'Mass payment exception • Kherson', user: 'Sup. Bondarenko', type: 'escalation' },
  { time: '13:45', action: 'User access granted', details: 'Regional Coordinator • Poltava', user: 'Admin Shevchenko', type: 'access' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function DashboardV10Page() {
  const [view, setView] = useState<DashboardView>('executive');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#161B22] border-r border-[#1F242C] z-50 transition-all ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] rounded-lg flex items-center justify-center font-bold text-[#0D1117] text-sm">
                IV
              </div>
              <span className="font-semibold">IVYAR</span>
              <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-1.5 py-0.5 rounded">v10</span>
            </Link>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-[#1F242C] rounded-lg text-[#8B949E]"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {[
            { id: 'executive', icon: '📊', label: 'Executive' },
            { id: 'operations', icon: '⚙️', label: 'Operations' },
            { id: 'analytics', icon: '📈', label: 'Analytics' },
            { id: 'governance', icon: '🛡️', label: 'Governance' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as DashboardView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                view === item.id
                  ? 'bg-[#00A3FF]/10 text-[#00A3FF]'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#1F242C]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <>
            <div className="p-4 border-t border-[#1F242C] mt-4">
              <div className="text-xs text-[#6E7681] mb-2">QUICK ACCESS</div>
              <div className="space-y-1">
                {[
                  { icon: '📋', label: 'Programs', href: '/programs' },
                  { icon: '👥', label: 'Beneficiaries', href: '/beneficiaries' },
                  { icon: '💳', label: 'Payments', href: '/payments' },
                  { icon: '📄', label: 'Reports', href: '/reports' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#8B949E] hover:text-white hover:bg-[#1F242C]"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1F242C]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00A3FF] rounded-full flex items-center justify-center text-sm font-bold text-[#0D1117]">
                  AK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">Admin Kovalenko</div>
                  <div className="text-xs text-[#6E7681]">System Administrator</div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="sticky top-0 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                {view === 'executive' && 'Executive Dashboard'}
                {view === 'operations' && 'Operations Center'}
                {view === 'analytics' && 'Analytics & Insights'}
                {view === 'governance' && 'Governance & Compliance'}
              </h1>
              <p className="text-sm text-[#8B949E]">
                Sovereign Intelligence Platform • Real-time Overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="ytd">Year to Date</option>
              </select>

              {/* Alerts */}
              <button className="relative p-2 hover:bg-[#161B22] rounded-lg">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F59E0B] rounded-full"></span>
              </button>

              {/* Current Time */}
              <div className="text-sm text-[#8B949E] font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC
              </div>

              {/* AI Status */}
              <div className="flex items-center gap-2 bg-[#3CCB7F]/10 text-[#3CCB7F] px-3 py-1.5 rounded-lg text-sm">
                <span className="w-2 h-2 bg-[#3CCB7F] rounded-full animate-pulse"></span>
                <span>AI Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {view === 'executive' && <ExecutiveView />}
          {view === 'operations' && <OperationsView />}
          {view === 'analytics' && <AnalyticsView />}
          {view === 'governance' && <GovernanceView />}
        </div>
      </main>
    </div>
  );
}

// ============================================
// EXECUTIVE VIEW
// ============================================
function ExecutiveView() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(EXECUTIVE_KPIS).map(([key, kpi]) => (
          <div key={key} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`text-xs px-2 py-1 rounded ${kpi.change >= 0 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F85149]/20 text-[#F85149]'}`}>
                {kpi.change >= 0 ? '+' : ''}{kpi.change}{("percentage" in kpi) ? 'pp' : '%'}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {("currency" in kpi) ? `$${(kpi.value / 1000000000).toFixed(2)}B` : 
               ("percentage" in kpi) ? `${kpi.value}%` : 
               kpi.value.toLocaleString()}
            </div>
            <div className="text-sm text-[#8B949E]">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights Panel */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] flex items-center justify-between bg-gradient-to-r from-[#A371F7]/10 to-transparent">
            <div className="flex items-center gap-3">
              <span className="text-xl">🧠</span>
              <div>
                <h3 className="font-semibold">Sovereign Intelligence</h3>
                <span className="text-xs text-[#8B949E]">AI-Powered Insights & Recommendations</span>
              </div>
            </div>
            <Link href="/demos" className="text-xs text-[#00A3FF] hover:underline">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {AI_INSIGHTS.slice(0, 3).map((insight) => (
              <div key={insight.id} className="p-4 hover:bg-[#1F242C]/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    insight.type === 'recommendation' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                    insight.type === 'anomaly' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                    insight.type === 'prediction' ? 'bg-[#A371F7]/20 text-[#A371F7]' :
                    'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                  }`}>
                    {insight.type === 'recommendation' ? '💡' :
                     insight.type === 'anomaly' ? '⚠️' :
                     insight.type === 'prediction' ? '📈' : '✓'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{insight.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        insight.priority === 'high' ? 'bg-[#F85149]/20 text-[#F85149]' :
                        insight.priority === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#8B949E]/20 text-[#8B949E]'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B949E] mb-2">{insight.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#6E7681]">Confidence: {insight.confidence}%</span>
                      <span className="text-xs text-[#00A3FF]">{insight.impact}</span>
                      <span className="text-xs text-[#6E7681]">{insight.timestamp}</span>
                    </div>
                  </div>
                  <button className="text-xs bg-[#1F242C] hover:bg-[#2D333B] px-3 py-1.5 rounded-lg">
                    {insight.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>🔔</span> System Alerts
            </h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {SYSTEM_ALERTS.map((alert) => (
              <div key={alert.id} className={`p-4 ${alert.acknowledged ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    alert.severity === 'critical' ? 'bg-[#F85149]' :
                    alert.severity === 'warning' ? 'bg-[#F59E0B]' :
                    alert.severity === 'success' ? 'bg-[#3CCB7F]' :
                    'bg-[#00A3FF]'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{alert.title}</div>
                    <p className="text-xs text-[#8B949E]">{alert.description}</p>
                    <span className="text-xs text-[#6E7681]">{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Status & Funding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Status */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <span>📋</span> Program Status
            </h3>
            <Link href="/programs" className="text-xs text-[#00A3FF] hover:underline">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1F242C] text-[#8B949E]">
                  <th className="text-left p-3">Program</th>
                  <th className="text-right p-3">Beneficiaries</th>
                  <th className="text-right p-3">Utilized</th>
                  <th className="text-center p-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAM_STATUS.slice(0, 5).map((program) => (
                  <tr key={program.id} className="border-b border-[#1F242C]">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${program.status === 'active' ? 'bg-[#3CCB7F]' : 'bg-[#F59E0B]'}`}></span>
                        <span className="truncate max-w-[150px]">{program.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono">{(program.beneficiaries / 1000000).toFixed(2)}M</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-[#1F242C] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${program.utilized}%`,
                              backgroundColor: program.utilized > 90 ? '#F59E0B' : '#3CCB7F'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-[#8B949E] w-8">{program.utilized}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={program.trend === 'up' ? 'text-[#3CCB7F]' : program.trend === 'down' ? 'text-[#F85149]' : 'text-[#8B949E]'}>
                        {program.trend === 'up' ? '↑' : program.trend === 'down' ? '↓' : '→'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donor Funding */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <span>🤝</span> Donor Funding
            </h3>
            <span className="text-xs text-[#8B949E]">Total: $4.22B committed</span>
          </div>
          <div className="p-4 space-y-4">
            {DONOR_FUNDING.map((donor) => (
              <div key={donor.donor}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{donor.donor}</span>
                  <span className="text-xs text-[#8B949E]">
                    ${(donor.disbursed / 1000000).toFixed(0)}M / ${(donor.committed / 1000000).toFixed(0)}M
                  </span>
                </div>
                <div className="h-2 bg-[#1F242C] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(donor.disbursed / donor.committed) * 100}%`,
                      backgroundColor: donor.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Map & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Status */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>🗺️</span> Regional Overview
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {REGIONAL_DATA.slice(0, 6).map((region) => (
                <div key={region.region} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{region.region}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      region.status === 'normal' ? 'bg-[#3CCB7F]' :
                      region.status === 'elevated' ? 'bg-[#F59E0B]' : 'bg-[#F85149]'
                    }`}></span>
                  </div>
                  <div className="text-lg font-bold">{(region.beneficiaries / 1000000).toFixed(2)}M</div>
                  <div className="text-xs text-[#8B949E]">{region.payments}% payment rate</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>⏱️</span> Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-[#1F242C] max-h-80 overflow-y-auto">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="p-3 hover:bg-[#1F242C]/50">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-[#6E7681]">{activity.time}</span>
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-[#8B949E]">{activity.details}</div>
                    <div className="text-xs text-[#6E7681]">{activity.user}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPERATIONS VIEW
// ============================================
function OperationsView() {
  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Users', value: REAL_TIME_METRICS.activeUsers.toLocaleString(), icon: '👥', color: '#00A3FF' },
          { label: 'Requests/sec', value: REAL_TIME_METRICS.requestsPerSecond.toLocaleString(), icon: '📊', color: '#3CCB7F' },
          { label: 'Avg Response', value: `${REAL_TIME_METRICS.avgResponseTime}ms`, icon: '⚡', color: '#F59E0B' },
          { label: 'Error Rate', value: `${REAL_TIME_METRICS.errorRate}%`, icon: '❌', color: '#F85149' },
          { label: 'Queue Depth', value: REAL_TIME_METRICS.queueDepth.toString(), icon: '📋', color: '#A371F7' },
          { label: 'Cache Hit', value: `${REAL_TIME_METRICS.cacheHitRate}%`, icon: '💾', color: '#3CCB7F' },
        ].map((metric, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{metric.icon}</span>
              <span className="text-xs text-[#8B949E]">{metric.label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: metric.color }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Service Status Grid */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold flex items-center gap-2">
            <span>🖥️</span> Service Status
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'HBS Core', status: 'operational', uptime: '99.99%' },
              { name: 'Payment Gateway', status: 'degraded', uptime: '99.87%' },
              { name: 'ID Verification', status: 'operational', uptime: '99.95%' },
              { name: 'AI Engine', status: 'operational', uptime: '99.92%' },
              { name: 'Blockchain Node', status: 'operational', uptime: '100%' },
              { name: 'Document Store', status: 'operational', uptime: '99.98%' },
              { name: 'Notification Service', status: 'operational', uptime: '99.94%' },
              { name: 'Reporting Engine', status: 'operational', uptime: '99.91%' },
            ].map((service, i) => (
              <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{service.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    service.status === 'operational' ? 'bg-[#3CCB7F]' :
                    service.status === 'degraded' ? 'bg-[#F59E0B]' : 'bg-[#F85149]'
                  }`}></span>
                </div>
                <div className="text-xs text-[#8B949E]">Uptime: {service.uptime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Processing & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>💳</span> Payment Processing
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: 'Today\'s Volume', value: '$12.4M', subtext: '48,234 transactions' },
              { label: 'Pending', value: '234', subtext: '$892K awaiting processing' },
              { label: 'Failed (24h)', value: '12', subtext: '0.02% failure rate' },
              { label: 'Avg Processing Time', value: '2.3s', subtext: 'Target: <3s' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#1F242C] last:border-0">
                <span className="text-sm text-[#8B949E]">{item.label}</span>
                <div className="text-right">
                  <div className="font-bold">{item.value}</div>
                  <div className="text-xs text-[#6E7681]">{item.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>📥</span> Processing Queue
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { type: 'Eligibility Checks', count: 1247, priority: 'normal' },
              { type: 'Payment Batches', count: 23, priority: 'high' },
              { type: 'Document Verification', count: 892, priority: 'normal' },
              { type: 'ID Verification', count: 156, priority: 'normal' },
              { type: 'Compliance Scans', count: 45, priority: 'low' },
            ].map((queue, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    queue.priority === 'high' ? 'bg-[#F59E0B]' :
                    queue.priority === 'low' ? 'bg-[#8B949E]' : 'bg-[#3CCB7F]'
                  }`}></span>
                  <span className="text-sm">{queue.type}</span>
                </div>
                <span className="font-mono text-sm">{queue.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ANALYTICS VIEW
// ============================================
function AnalyticsView() {
  return (
    <div className="space-y-6">
      {/* Trend Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>📈</span> Beneficiary Growth
          </h3>
          <div className="h-64 flex items-center justify-center bg-[#0D1117] rounded-lg border border-[#1F242C]">
            <div className="text-center text-[#8B949E]">
              <div className="text-4xl mb-2">📊</div>
              <div>Interactive chart</div>
              <div className="text-xs">+2.4% MoM growth</div>
            </div>
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>💰</span> Disbursement Trends
          </h3>
          <div className="h-64 flex items-center justify-center bg-[#0D1117] rounded-lg border border-[#1F242C]">
            <div className="text-center text-[#8B949E]">
              <div className="text-4xl mb-2">📊</div>
              <div>Interactive chart</div>
              <div className="text-xs">$4.2B YTD disbursed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold flex items-center gap-2">
            <span>📊</span> Key Performance Indicators
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Metric</th>
                <th className="text-right p-4">Current</th>
                <th className="text-right p-4">Target</th>
                <th className="text-right p-4">vs Last Period</th>
                <th className="text-center p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Payment Success Rate', current: '99.7%', target: '99.5%', change: '+0.2%', status: 'above' },
                { metric: 'Processing Time (avg)', current: '2.3s', target: '3.0s', change: '-0.4s', status: 'above' },
                { metric: 'Coverage Rate', current: '94.2%', target: '95.0%', change: '+1.8%', status: 'below' },
                { metric: 'Fraud Detection Rate', current: '99.4%', target: '99.0%', change: '+0.1%', status: 'above' },
                { metric: 'User Satisfaction', current: '4.6/5', target: '4.5/5', change: '+0.2', status: 'above' },
                { metric: 'IATI Compliance', current: '99.2%', target: '100%', change: '+0.3%', status: 'below' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-4">{row.metric}</td>
                  <td className="p-4 text-right font-mono">{row.current}</td>
                  <td className="p-4 text-right font-mono text-[#8B949E]">{row.target}</td>
                  <td className={`p-4 text-right font-mono ${row.change.startsWith('+') ? 'text-[#3CCB7F]' : 'text-[#F85149]'}`}>
                    {row.change}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      row.status === 'above' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {row.status === 'above' ? '✓ On Track' : '⚠ Below'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analytics */}
      <div className="bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10 border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🧠</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">AI-Powered Analytics Summary</h3>
            <p className="text-sm text-[#8B949E] mb-4">
              Based on current trends, the platform is performing above expectations. Key highlight: 
              Payment processing efficiency has improved 15% compared to last quarter, primarily due to 
              AI-optimized routing and fraud detection improvements.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-lg font-bold text-[#3CCB7F]">+15%</div>
                <div className="text-xs text-[#8B949E]">Processing Efficiency</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-lg font-bold text-[#00A3FF]">$127M</div>
                <div className="text-xs text-[#8B949E]">Fraud Prevented</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-lg font-bold text-[#A371F7]">847K</div>
                <div className="text-xs text-[#8B949E]">AI Decisions/Day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// GOVERNANCE VIEW
// ============================================
function GovernanceView() {
  return (
    <div className="space-y-6">
      {/* Governance KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <div className="text-2xl mb-2">🤖</div>
          <div className="text-2xl font-bold">{GOVERNANCE_METRICS.aiDecisions.total.toLocaleString()}</div>
          <div className="text-sm text-[#8B949E]">AI Decisions (30d)</div>
          <div className="text-xs text-[#6E7681] mt-1">
            {GOVERNANCE_METRICS.aiDecisions.humanOverride.toLocaleString()} overrides ({GOVERNANCE_METRICS.aiDecisions.overrideRate}%)
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-2xl font-bold">{GOVERNANCE_METRICS.escalations.pending}</div>
          <div className="text-sm text-[#8B949E]">Pending Escalations</div>
          <div className="text-xs text-[#6E7681] mt-1">
            {GOVERNANCE_METRICS.escalations.resolved24h} resolved in 24h
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <div className="text-2xl mb-2">✓</div>
          <div className="text-2xl font-bold text-[#3CCB7F]">{GOVERNANCE_METRICS.compliance.overall}%</div>
          <div className="text-sm text-[#8B949E]">Overall Compliance</div>
          <div className="text-xs text-[#6E7681] mt-1">
            GDPR: {GOVERNANCE_METRICS.compliance.gdpr}% | IATI: {GOVERNANCE_METRICS.compliance.iati}%
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <div className="text-2xl mb-2">📋</div>
          <div className="text-2xl font-bold">{GOVERNANCE_METRICS.audit.findings}</div>
          <div className="text-sm text-[#8B949E]">Audit Findings</div>
          <div className="text-xs text-[#6E7681] mt-1">
            {GOVERNANCE_METRICS.audit.resolved} resolved | Next: {GOVERNANCE_METRICS.audit.nextAudit}
          </div>
        </div>
      </div>

      {/* Human Oversight & Ethics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>👤</span> Human-in-the-Loop Activity
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { type: 'AI Overrides', count: 47, reason: 'Manual eligibility decisions' },
              { type: 'Escalation Reviews', count: 23, reason: 'High-value exceptions' },
              { type: 'Ethics Consultations', count: 8, reason: 'Policy boundary cases' },
              { type: 'Emergency Interventions', count: 2, reason: 'System safety triggers' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
                <div>
                  <div className="font-medium text-sm">{item.type}</div>
                  <div className="text-xs text-[#6E7681]">{item.reason}</div>
                </div>
                <div className="text-lg font-bold text-[#00A3FF]">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold flex items-center gap-2">
              <span>🛡️</span> Ethical Boundaries Status
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { boundary: 'Non-discrimination', status: 'active', violations: 0 },
              { boundary: 'Data sovereignty', status: 'active', violations: 0 },
              { boundary: 'Human oversight', status: 'active', violations: 0 },
              { boundary: 'Transparency requirements', status: 'active', violations: 0 },
              { boundary: 'Emergency stop capability', status: 'standby', violations: 0 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-[#3CCB7F]' : 'bg-[#F59E0B]'}`}></span>
                  <span className="text-sm">{item.boundary}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.violations === 0 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F85149]/20 text-[#F85149]'
                }`}>
                  {item.violations === 0 ? 'No violations' : `${item.violations} violations`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Matrix */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold flex items-center gap-2">
            <span>📊</span> Compliance Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Standard</th>
                <th className="text-center p-4">Status</th>
                <th className="text-right p-4">Score</th>
                <th className="text-right p-4">Last Audit</th>
                <th className="text-right p-4">Next Review</th>
              </tr>
            </thead>
            <tbody>
              {[
                { standard: 'GDPR', status: 'compliant', score: 99.1, lastAudit: '2025-11-15', nextReview: '2026-05-15' },
                { standard: 'IATI 2.03', status: 'compliant', score: 99.2, lastAudit: '2025-12-01', nextReview: '2026-03-01' },
                { standard: 'ISO 27001', status: 'certified', score: 100, lastAudit: '2025-09-20', nextReview: '2026-09-20' },
                { standard: 'National Law', status: 'compliant', score: 97.8, lastAudit: '2025-10-10', nextReview: '2026-04-10' },
                { standard: 'EU AI Act', status: 'compliant', score: 96.5, lastAudit: '2025-12-15', nextReview: '2026-06-15' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-4 font-medium">{row.standard}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      row.status === 'certified' ? 'bg-[#A371F7]/20 text-[#A371F7]' : 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono">{row.score}%</td>
                  <td className="p-4 text-right text-[#8B949E]">{row.lastAudit}</td>
                  <td className="p-4 text-right text-[#8B949E]">{row.nextReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Stop Panel */}
      <div className="bg-gradient-to-r from-[#F85149]/10 to-transparent border border-[#F85149]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🛑</div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#F85149] mb-2">Emergency Stop System (ESS)</h3>
            <p className="text-sm text-[#8B949E] mb-4">
              The ESS is armed and ready. In case of critical system failure, ethical violation detection, or 
              authorized emergency order, the ESS can halt all automated operations within 30 seconds.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-[#3CCB7F] rounded-full"></span>
                <span>Status: Armed</span>
              </div>
              <div className="text-sm text-[#8B949E]">Last test: 2025-12-28</div>
              <div className="text-sm text-[#8B949E]">Authorized triggers: 3</div>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#F85149]/20 text-[#F85149] border border-[#F85149]/30 rounded-lg text-sm font-medium hover:bg-[#F85149]/30">
            View ESS Console
          </button>
        </div>
      </div>
    </div>
  );
}
