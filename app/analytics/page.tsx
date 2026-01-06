'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type AnalyticsSection = 'dashboard' | 'trends' | 'donors' | 'impact' | 'reports' | 'ai-insights';
type TimeRange = '24h' | '7d' | '30d' | '90d' | 'ytd' | 'custom';
type MetricCategory = 'beneficiaries' | 'payments' | 'programs' | 'operations' | 'compliance';

// ============================================
// DATA
// ============================================
const DASHBOARD_METRICS = {
  beneficiaries: {
    total: 9647832,
    active: 8934521,
    new30d: 234567,
    growth: 2.4,
    byRegion: [
      { name: 'Kyiv', value: 1847000 },
      { name: 'Kharkiv', value: 1234000 },
      { name: 'Dnipro', value: 987000 },
      { name: 'Odesa', value: 756000 },
      { name: 'Lviv', value: 623000 },
      { name: 'Other', value: 4200832 },
    ],
  },
  payments: {
    totalVolume: 4218000000,
    transactions: 48234567,
    successRate: 99.7,
    avgAmount: 1847,
    byMethod: [
      { name: 'Bank Transfer', value: 67 },
      { name: 'Mobile Money', value: 24 },
      { name: 'Cash', value: 9 },
    ],
  },
  programs: {
    active: 192,
    beneficiariesServed: 9647832,
    budgetUtilization: 87,
    avgCoverage: 94.2,
  },
  operations: {
    avgProcessingTime: 2.3,
    pendingApplications: 12847,
    escalations: 234,
    systemUptime: 99.97,
  },
};

const TREND_DATA = {
  beneficiaryGrowth: [
    { month: 'Jul', value: 8234000 },
    { month: 'Aug', value: 8456000 },
    { month: 'Sep', value: 8723000 },
    { month: 'Oct', value: 9012000 },
    { month: 'Nov', value: 9345000 },
    { month: 'Dec', value: 9648000 },
  ],
  paymentVolume: [
    { month: 'Jul', value: 567000000 },
    { month: 'Aug', value: 589000000 },
    { month: 'Sep', value: 612000000 },
    { month: 'Oct', value: 645000000 },
    { month: 'Nov', value: 678000000 },
    { month: 'Dec', value: 712000000 },
  ],
  successRate: [
    { month: 'Jul', value: 99.4 },
    { month: 'Aug', value: 99.5 },
    { month: 'Sep', value: 99.5 },
    { month: 'Oct', value: 99.6 },
    { month: 'Nov', value: 99.6 },
    { month: 'Dec', value: 99.7 },
  ],
};

const DONOR_REPORTS = [
  {
    id: 'donor-001',
    donor: 'World Bank',
    program: 'IDP Cash Assistance',
    reportType: 'Quarterly Progress',
    period: 'Q4 2025',
    status: 'submitted',
    dueDate: '2026-01-15',
    submittedDate: '2026-01-05',
    compliance: 99.2,
  },
  {
    id: 'donor-002',
    donor: 'USAID',
    program: 'Housing Compensation',
    reportType: 'Monthly Financial',
    period: 'December 2025',
    status: 'approved',
    dueDate: '2026-01-10',
    submittedDate: '2026-01-03',
    compliance: 98.8,
  },
  {
    id: 'donor-003',
    donor: 'EU',
    program: 'Child Support',
    reportType: 'IATI Publication',
    period: 'Q4 2025',
    status: 'pending',
    dueDate: '2026-01-20',
    submittedDate: null,
    compliance: 99.4,
  },
  {
    id: 'donor-004',
    donor: 'UNHCR',
    program: 'Disability Allowance',
    reportType: 'Impact Assessment',
    period: 'H2 2025',
    status: 'draft',
    dueDate: '2026-01-31',
    submittedDate: null,
    compliance: 97.6,
  },
  {
    id: 'donor-005',
    donor: 'UNICEF',
    program: 'Child Support',
    reportType: 'Results Framework',
    period: '2025',
    status: 'approved',
    dueDate: '2026-01-08',
    submittedDate: '2025-12-28',
    compliance: 100,
  },
];

const IMPACT_INDICATORS = [
  {
    id: 'impact-001',
    indicator: 'Poverty Reduction',
    baseline: 24.1,
    target: 18.0,
    current: 19.8,
    unit: '%',
    trend: 'improving',
    sdg: 'SDG 1.2',
  },
  {
    id: 'impact-002',
    indicator: 'Food Security',
    baseline: 67,
    target: 85,
    current: 81,
    unit: '% adequate',
    trend: 'improving',
    sdg: 'SDG 2.1',
  },
  {
    id: 'impact-003',
    indicator: 'Housing Stability',
    baseline: 45,
    target: 75,
    current: 68,
    unit: '% stable',
    trend: 'improving',
    sdg: 'SDG 11.1',
  },
  {
    id: 'impact-004',
    indicator: 'Child Education Access',
    baseline: 78,
    target: 95,
    current: 91,
    unit: '% enrolled',
    trend: 'stable',
    sdg: 'SDG 4.1',
  },
  {
    id: 'impact-005',
    indicator: 'Healthcare Access',
    baseline: 62,
    target: 80,
    current: 74,
    unit: '% coverage',
    trend: 'improving',
    sdg: 'SDG 3.8',
  },
  {
    id: 'impact-006',
    indicator: 'Financial Inclusion',
    baseline: 58,
    target: 85,
    current: 79,
    unit: '% banked',
    trend: 'improving',
    sdg: 'SDG 8.10',
  },
];

const AI_INSIGHTS = [
  {
    id: 'ai-001',
    type: 'anomaly',
    severity: 'high',
    title: 'Unusual Registration Spike in Kharkiv',
    description: 'Registration volume increased 340% in past 48 hours, consistent with displacement event patterns.',
    recommendation: 'Scale processing capacity and activate emergency response protocols.',
    confidence: 94,
    impact: '~12,000 new beneficiaries expected',
    timestamp: '2 hours ago',
  },
  {
    id: 'ai-002',
    type: 'prediction',
    severity: 'medium',
    title: 'Q1 2026 Payment Volume Forecast',
    description: 'Predicted 23% increase in payment volume due to seasonal factors and program expansions.',
    recommendation: 'Ensure sufficient liquidity and payment gateway capacity.',
    confidence: 91,
    impact: '+$89M processing volume',
    timestamp: '6 hours ago',
  },
  {
    id: 'ai-003',
    type: 'optimization',
    severity: 'medium',
    title: 'Budget Reallocation Opportunity',
    description: 'Emergency Fund has 88% unutilized budget while IDP Assistance approaches 90% utilization.',
    recommendation: 'Consider temporary reallocation of $45M to IDP Assistance.',
    confidence: 89,
    impact: '$45M optimization potential',
    timestamp: '1 day ago',
  },
  {
    id: 'ai-004',
    type: 'compliance',
    severity: 'low',
    title: 'IATI Reporting Completeness',
    description: 'Q4 2025 IATI report at 97.2% completeness. 3 activities require updated results.',
    recommendation: 'Update remaining activity results before Jan 20 deadline.',
    confidence: 100,
    impact: 'Compliance maintenance',
    timestamp: '1 day ago',
  },
  {
    id: 'ai-005',
    type: 'trend',
    severity: 'low',
    title: 'Beneficiary Satisfaction Improvement',
    description: 'Satisfaction scores increased from 4.4 to 4.6 over past quarter, driven by faster processing times.',
    recommendation: 'Continue current operational improvements.',
    confidence: 96,
    impact: 'Positive trend continuation',
    timestamp: '2 days ago',
  },
];

const REPORT_TEMPLATES = [
  { id: 'tpl-001', name: 'Executive Summary', category: 'Management', frequency: 'Weekly', format: 'PDF' },
  { id: 'tpl-002', name: 'Donor Progress Report', category: 'Donor', frequency: 'Monthly', format: 'PDF/Excel' },
  { id: 'tpl-003', name: 'IATI Activity Report', category: 'Compliance', frequency: 'Quarterly', format: 'XML' },
  { id: 'tpl-004', name: 'Financial Statement', category: 'Finance', frequency: 'Monthly', format: 'Excel' },
  { id: 'tpl-005', name: 'Beneficiary Analysis', category: 'Operations', frequency: 'Weekly', format: 'PDF/Excel' },
  { id: 'tpl-006', name: 'Payment Reconciliation', category: 'Finance', frequency: 'Daily', format: 'Excel' },
  { id: 'tpl-007', name: 'Impact Assessment', category: 'M&E', frequency: 'Quarterly', format: 'PDF' },
  { id: 'tpl-008', name: 'Compliance Dashboard', category: 'Compliance', frequency: 'Real-time', format: 'Dashboard' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function AnalyticsV10Page() {
  const [activeSection, setActiveSection] = useState<AnalyticsSection>('dashboard');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

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
              <span className="text-xl">📈</span>
              <span className="font-semibold">Analytics</span>
              <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              <option value="custom">Custom Range</option>
            </select>
            <button className="text-sm bg-[#161B22] border border-[#1F242C] px-4 py-2 rounded-lg hover:bg-[#1F242C]">
              Export
            </button>
            <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium hover:bg-[#33B5FF]">
              + New Report
            </button>
          </div>
        </div>
      </nav>

      {/* Section Tabs */}
      <div className="fixed top-16 left-0 right-0 bg-[#0D1117] border-b border-[#1F242C] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'trends', label: 'Trends', icon: '📈' },
              { id: 'donors', label: 'Donor Reports', icon: '🤝' },
              { id: 'impact', label: 'Impact', icon: '🎯' },
              { id: 'reports', label: 'Report Builder', icon: '📄' },
              { id: 'ai-insights', label: 'AI Insights', icon: '🧠' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as AnalyticsSection)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'trends' && <TrendsSection />}
          {activeSection === 'donors' && <DonorReportsSection />}
          {activeSection === 'impact' && <ImpactSection />}
          {activeSection === 'reports' && <ReportBuilderSection />}
          {activeSection === 'ai-insights' && <AIInsightsSection />}
        </div>
      </main>
    </div>
  );
}

// ============================================
// DASHBOARD SECTION
// ============================================
function DashboardSection() {
  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Beneficiaries', value: '9.65M', change: '+2.4%', icon: '👥', color: '#00A3FF' },
          { label: 'Payment Volume', value: '$4.22B', change: '+8.7%', icon: '💰', color: '#3CCB7F' },
          { label: 'Success Rate', value: '99.7%', change: '+0.2pp', icon: '✓', color: '#A371F7' },
          { label: 'Active Programs', value: '192', change: '+3', icon: '📋', color: '#F59E0B' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon}</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-sm text-[#8B949E]">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiaries by Region */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Beneficiaries by Region</h3>
          <div className="space-y-3">
            {DASHBOARD_METRICS.beneficiaries.byRegion.map((region, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{region.name}</span>
                  <span className="text-[#8B949E]">{(region.value / 1000000).toFixed(2)}M</span>
                </div>
                <div className="h-2 bg-[#1F242C] rounded-full">
                  <div 
                    className="h-full bg-[#00A3FF] rounded-full"
                    style={{ width: `${(region.value / DASHBOARD_METRICS.beneficiaries.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Payment Methods Distribution</h3>
          <div className="flex items-center justify-center h-48">
            <div className="relative w-40 h-40">
              {/* Donut Chart Placeholder */}
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1F242C" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3CCB7F" strokeWidth="20" 
                  strokeDasharray={`${67 * 2.51} ${100 * 2.51}`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#00A3FF" strokeWidth="20" 
                  strokeDasharray={`${24 * 2.51} ${100 * 2.51}`} strokeDashoffset={`${-67 * 2.51}`} />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" 
                  strokeDasharray={`${9 * 2.51} ${100 * 2.51}`} strokeDashoffset={`${-91 * 2.51}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">48.2M</div>
                  <div className="text-xs text-[#8B949E]">transactions</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {DASHBOARD_METRICS.payments.byMethod.map((method, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`w-3 h-3 rounded-full ${
                  i === 0 ? 'bg-[#3CCB7F]' : i === 1 ? 'bg-[#00A3FF]' : 'bg-[#F59E0B]'
                }`}></span>
                <span className="text-[#8B949E]">{method.name} ({method.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operations & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Operations</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg Processing Time', value: '2.3 days', status: 'good' },
              { label: 'Pending Applications', value: '12,847', status: 'warning' },
              { label: 'Active Escalations', value: '234', status: 'warning' },
              { label: 'System Uptime', value: '99.97%', status: 'good' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-[#8B949E]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.value}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    item.status === 'good' ? 'bg-[#3CCB7F]' : 'bg-[#F59E0B]'
                  }`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Compliance Status</h3>
          <div className="space-y-4">
            {[
              { label: 'GDPR Compliance', value: '99.1%' },
              { label: 'IATI Compliance', value: '99.2%' },
              { label: 'National Law', value: '97.8%' },
              { label: 'Donor Requirements', value: '98.4%' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#8B949E]">{item.label}</span>
                  <span className="text-[#3CCB7F]">{item.value}</span>
                </div>
                <div className="h-2 bg-[#1F242C] rounded-full">
                  <div 
                    className="h-full bg-[#3CCB7F] rounded-full"
                    style={{ width: item.value }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Generate Executive Report', icon: '📄' },
              { label: 'Export Payment Data', icon: '💳' },
              { label: 'Run Compliance Check', icon: '✓' },
              { label: 'Schedule Analysis', icon: '📅' },
            ].map((action, i) => (
              <button 
                key={i}
                className="w-full flex items-center gap-3 p-3 bg-[#0D1117] rounded-lg hover:bg-[#1F242C] transition-colors text-left"
              >
                <span>{action.icon}</span>
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRENDS SECTION
// ============================================
function TrendsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Trend Analysis</h2>
        <p className="text-sm text-[#8B949E]">Historical trends and forecasting</p>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiary Growth */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Beneficiary Growth (6 months)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {TREND_DATA.beneficiaryGrowth.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-[#00A3FF] rounded-t"
                  style={{ height: `${((item.value - 8000000) / 2000000) * 100}%` }}
                ></div>
                <div className="text-xs text-[#8B949E] mt-2">{item.month}</div>
                <div className="text-xs text-[#6E7681]">{(item.value / 1000000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Volume */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Payment Volume (6 months)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {TREND_DATA.paymentVolume.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-[#3CCB7F] rounded-t"
                  style={{ height: `${((item.value - 500000000) / 250000000) * 100}%` }}
                ></div>
                <div className="text-xs text-[#8B949E] mt-2">{item.month}</div>
                <div className="text-xs text-[#6E7681]">${(item.value / 1000000).toFixed(0)}M</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Rate Trend */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Payment Success Rate Trend</h3>
        <div className="h-32 relative">
          <div className="absolute inset-0 flex items-end">
            {TREND_DATA.successRate.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-4 h-4 bg-[#A371F7] rounded-full relative"
                  style={{ marginBottom: `${(item.value - 99) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#A371F7]">
                    {item.value}%
                  </span>
                </div>
                <div className="text-xs text-[#8B949E] mt-8">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecasts */}
      <div className="bg-gradient-to-r from-[#A371F7]/10 to-transparent border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🔮</span>
          <div>
            <h3 className="font-semibold mb-2">AI-Powered Forecasts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { metric: 'Q1 2026 Beneficiaries', forecast: '10.2M', confidence: 91, trend: '+5.7%' },
                { metric: 'Q1 2026 Payment Volume', forecast: '$2.3B', confidence: 88, trend: '+12%' },
                { metric: 'Success Rate', forecast: '99.8%', confidence: 94, trend: '+0.1pp' },
              ].map((f, i) => (
                <div key={i} className="bg-[#0D1117] rounded-lg p-4">
                  <div className="text-sm text-[#8B949E] mb-1">{f.metric}</div>
                  <div className="text-xl font-bold text-[#A371F7]">{f.forecast}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#3CCB7F]">{f.trend}</span>
                    <span className="text-xs text-[#6E7681]">({f.confidence}% confidence)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DONOR REPORTS SECTION
// ============================================
function DonorReportsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Donor Reports</h2>
          <p className="text-sm text-[#8B949E]">Track and manage donor reporting requirements</p>
        </div>
        <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium">
          + New Report
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Submitted', count: 2, color: '#3CCB7F' },
          { label: 'Approved', count: 2, color: '#00A3FF' },
          { label: 'Pending', count: 1, color: '#F59E0B' },
          { label: 'Draft', count: 1, color: '#8B949E' },
        ].map((status, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: status.color }}>{status.count}</div>
            <div className="text-sm text-[#8B949E]">{status.label}</div>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Donor</th>
                <th className="text-left p-4">Program</th>
                <th className="text-left p-4">Report Type</th>
                <th className="text-left p-4">Period</th>
                <th className="text-left p-4">Due Date</th>
                <th className="text-center p-4">Compliance</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DONOR_REPORTS.map((report) => (
                <tr key={report.id} className="border-b border-[#1F242C]">
                  <td className="p-4 font-medium">{report.donor}</td>
                  <td className="p-4 text-[#8B949E]">{report.program}</td>
                  <td className="p-4">{report.reportType}</td>
                  <td className="p-4 text-[#8B949E]">{report.period}</td>
                  <td className="p-4">{report.dueDate}</td>
                  <td className="p-4 text-center">
                    <span className={`font-mono ${report.compliance >= 99 ? 'text-[#3CCB7F]' : 'text-[#F59E0B]'}`}>
                      {report.compliance}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      report.status === 'approved' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                      report.status === 'submitted' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                      report.status === 'pending' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#8B949E]/20 text-[#8B949E]'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-[#00A3FF] hover:underline text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IATI Compliance */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">IATI 2.03 Compliance Dashboard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { element: 'Activity Data', score: 100 },
            { element: 'Transaction Data', score: 99.8 },
            { element: 'Results Data', score: 97.2 },
            { element: 'Location Data', score: 98.9 },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-[#3CCB7F]">{item.score}%</div>
              <div className="text-sm text-[#8B949E]">{item.element}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// IMPACT SECTION
// ============================================
function ImpactSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Impact Measurement</h2>
        <p className="text-sm text-[#8B949E]">Track outcomes against SDG targets and program objectives</p>
      </div>

      {/* Impact Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IMPACT_INDICATORS.map((indicator) => {
          const progress = ((indicator.baseline - indicator.current) / (indicator.baseline - indicator.target)) * 100;
          return (
            <div key={indicator.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-0.5 rounded">
                  {indicator.sdg}
                </span>
                <span className={`text-xs ${
                  indicator.trend === 'improving' ? 'text-[#3CCB7F]' : 'text-[#8B949E]'
                }`}>
                  {indicator.trend === 'improving' ? '↑ Improving' : '→ Stable'}
                </span>
              </div>
              <h4 className="font-medium mb-2">{indicator.indicator}</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold">{indicator.current}</span>
                <span className="text-sm text-[#8B949E]">{indicator.unit}</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-[#6E7681] mb-1">
                  <span>Baseline: {indicator.baseline}{indicator.unit.includes('%') ? '%' : ''}</span>
                  <span>Target: {indicator.target}{indicator.unit.includes('%') ? '%' : ''}</span>
                </div>
                <div className="h-2 bg-[#1F242C] rounded-full">
                  <div 
                    className="h-full bg-[#3CCB7F] rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-[#8B949E]">
                {progress.toFixed(0)}% progress to target
              </div>
            </div>
          );
        })}
      </div>

      {/* SDG Alignment */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">SDG Alignment Summary</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { sdg: 1, name: 'No Poverty', score: 87 },
            { sdg: 2, name: 'Zero Hunger', score: 81 },
            { sdg: 3, name: 'Good Health', score: 74 },
            { sdg: 4, name: 'Education', score: 91 },
            { sdg: 8, name: 'Decent Work', score: 79 },
            { sdg: 11, name: 'Sustainable Cities', score: 68 },
          ].map((sdg, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full border-4 border-[#1F242C] flex items-center justify-center relative">
                <span className="text-lg font-bold">{sdg.sdg}</span>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#3CCB7F" strokeWidth="8" 
                    strokeDasharray={`${sdg.score * 2.89} 289`} />
                </svg>
              </div>
              <div className="text-xs text-[#8B949E]">{sdg.name}</div>
              <div className="text-sm font-medium text-[#3CCB7F]">{sdg.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPORT BUILDER SECTION
// ============================================
function ReportBuilderSection() {
  const [selectedTemplate, setSelectedTemplate] = useState(REPORT_TEMPLATES[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Report Builder</h2>
        <p className="text-sm text-[#8B949E]">Create and customize reports from templates</p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedTemplate.id === template.id
                ? 'bg-[#00A3FF]/10 border-2 border-[#00A3FF]'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-[#8B949E] mt-1">{template.category}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-[#1F242C] px-2 py-0.5 rounded">{template.frequency}</span>
              <span className="text-xs text-[#6E7681]">{template.format}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Report Configuration */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Configure Report: {selectedTemplate.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#8B949E] block mb-2">Report Period</label>
              <select className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-2">
                <option>Q4 2025</option>
                <option>December 2025</option>
                <option>H2 2025</option>
                <option>2025 Full Year</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#8B949E] block mb-2">Programs</label>
              <select className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-2">
                <option>All Programs</option>
                <option>IDP Cash Assistance</option>
                <option>Housing Compensation</option>
                <option>Child Support</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#8B949E] block mb-2">Output Format</label>
              <div className="flex gap-2">
                {['PDF', 'Excel', 'CSV', 'XML'].map((format) => (
                  <button 
                    key={format}
                    className="px-4 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm hover:border-[#00A3FF]"
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#8B949E] block mb-2">Include Sections</label>
              <div className="space-y-2">
                {['Executive Summary', 'Financial Overview', 'Beneficiary Analysis', 'Impact Metrics', 'Recommendations'].map((section) => (
                  <label key={section} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{section}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#1F242C]">
          <button className="px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm">
            Preview
          </button>
          <button className="px-4 py-2 bg-[#00A3FF] text-[#0D1117] rounded-lg text-sm font-medium">
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recently Generated Reports</h3>
        <div className="space-y-3">
          {[
            { name: 'Executive Summary - December 2025', date: '2026-01-02', format: 'PDF', size: '2.4 MB' },
            { name: 'IATI Q4 2025 Publication', date: '2026-01-01', format: 'XML', size: '890 KB' },
            { name: 'World Bank Progress Report', date: '2025-12-28', format: 'PDF', size: '4.1 MB' },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <div className="text-sm font-medium">{report.name}</div>
                  <div className="text-xs text-[#6E7681]">{report.date} • {report.format} • {report.size}</div>
                </div>
              </div>
              <button className="text-[#00A3FF] hover:underline text-sm">Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// AI INSIGHTS SECTION
// ============================================
function AIInsightsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">AI-Powered Insights</h2>
        <p className="text-sm text-[#8B949E]">Anomaly detection, predictions, and optimization recommendations</p>
      </div>

      {/* Insight Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Anomalies Detected', value: '3', period: 'this week', color: '#F59E0B' },
          { label: 'Predictions Generated', value: '12', period: 'this month', color: '#A371F7' },
          { label: 'Optimizations Suggested', value: '8', period: 'this month', color: '#00A3FF' },
          { label: 'Actions Taken', value: '67%', period: 'acceptance rate', color: '#3CCB7F' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
            <div className="text-xs text-[#6E7681]">{stat.period}</div>
          </div>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {AI_INSIGHTS.map((insight) => (
          <div 
            key={insight.id}
            className={`bg-[#161B22] border rounded-xl overflow-hidden ${
              insight.severity === 'high' ? 'border-[#F59E0B]' :
              insight.severity === 'medium' ? 'border-[#1F242C]' : 'border-[#1F242C]'
            }`}
          >
            <div className={`px-4 py-3 border-b border-[#1F242C] flex items-center justify-between ${
              insight.severity === 'high' ? 'bg-[#F59E0B]/10' : 'bg-[#0D1117]'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`text-lg ${
                  insight.type === 'anomaly' ? '' :
                  insight.type === 'prediction' ? '' :
                  insight.type === 'optimization' ? '' :
                  insight.type === 'compliance' ? '' : ''
                }`}>
                  {insight.type === 'anomaly' ? '⚠️' :
                   insight.type === 'prediction' ? '🔮' :
                   insight.type === 'optimization' ? '💡' :
                   insight.type === 'compliance' ? '✓' : '📊'}
                </span>
                <div>
                  <div className="font-medium text-sm">{insight.title}</div>
                  <div className="text-xs text-[#6E7681]">{insight.timestamp}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  insight.severity === 'high' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                  insight.severity === 'medium' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                  'bg-[#8B949E]/20 text-[#8B949E]'
                }`}>
                  {insight.severity}
                </span>
                <span className="text-xs text-[#6E7681]">{insight.confidence}% confidence</span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-[#8B949E] mb-4">{insight.description}</p>
              <div className="bg-[#0D1117] rounded-lg p-3 mb-4">
                <div className="text-xs text-[#6E7681] mb-1">Recommendation</div>
                <p className="text-sm">{insight.recommendation}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#00A3FF]">Impact: {insight.impact}</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[#1F242C] rounded-lg text-xs hover:bg-[#2D333B]">
                    Dismiss
                  </button>
                  <button className="px-3 py-1.5 bg-[#00A3FF] text-[#0D1117] rounded-lg text-xs font-medium">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Model Info */}
      <div className="bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10 border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="font-semibold mb-2">Sovereign Intelligence Engine</h3>
            <p className="text-sm text-[#8B949E] mb-4">
              AI models trained on 4+ years of social protection data, optimized for Ukrainian context. 
              All processing occurs within sovereign infrastructure with full human oversight.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Model Version', value: 'v10.2.1' },
                { label: 'Training Data', value: '48M records' },
                { label: 'Accuracy', value: '94.7%' },
                { label: 'Last Updated', value: '2025-12-28' },
              ].map((item, i) => (
                <div key={i} className="bg-[#0D1117] rounded-lg p-3">
                  <div className="text-xs text-[#6E7681]">{item.label}</div>
                  <div className="font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
