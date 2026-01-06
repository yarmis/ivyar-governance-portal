'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type ProgramSection = 'overview' | 'catalog' | 'create' | 'eligibility' | 'payments' | 'monitoring';
type ProgramStatus = 'active' | 'paused' | 'draft' | 'closed' | 'standby';
type ProgramCategory = 'cash-transfer' | 'in-kind' | 'subsidy' | 'emergency' | 'reconstruction';
type PaymentFrequency = 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'event-based';

// ============================================
// PROGRAM DATA
// ============================================
const PROGRAMS = [
  {
    id: 'prog-001',
    code: 'IDP-CASH-2024',
    name: 'IDP Cash Assistance Program',
    nameUk: 'Програма грошової допомоги ВПО',
    category: 'cash-transfer' as ProgramCategory,
    status: 'active' as ProgramStatus,
    startDate: '2022-03-01',
    endDate: '2026-12-31',
    budget: { allocated: 1200000000, utilized: 1044000000, committed: 89000000 },
    beneficiaries: { registered: 2847000, active: 2634000, suspended: 89000, exited: 124000 },
    payments: { total: 12847000, success: 99.7, avgAmount: 2100 },
    donors: ['World Bank', 'USAID', 'EU'],
    description: 'Monthly cash transfers to internally displaced persons to cover basic needs including housing, food, and utilities.',
    eligibility: ['IDP status verified', 'Registered in Diia', 'Below income threshold', 'Not receiving duplicate benefits'],
    aiInsight: { type: 'recommendation', text: 'Consider 5% benefit increase based on inflation data', confidence: 89 },
  },
  {
    id: 'prog-002',
    code: 'HOUSING-COMP-2023',
    name: 'Housing Damage Compensation',
    nameUk: 'Компенсація за пошкоджене житло',
    category: 'reconstruction' as ProgramCategory,
    status: 'active' as ProgramStatus,
    startDate: '2023-01-15',
    endDate: '2027-12-31',
    budget: { allocated: 890000000, utilized: 640800000, committed: 156000000 },
    beneficiaries: { registered: 892000, active: 567000, suspended: 45000, exited: 280000 },
    payments: { total: 892000, success: 98.9, avgAmount: 12500 },
    donors: ['World Bank', 'EU', 'Germany'],
    description: 'Compensation for housing damaged or destroyed due to military action, based on damage assessment.',
    eligibility: ['Property damage verified', 'Ownership confirmed', 'Damage assessment completed', 'No insurance payout received'],
    aiInsight: { type: 'anomaly', text: 'Unusual claim pattern detected in Kherson oblast', confidence: 78 },
  },
  {
    id: 'prog-003',
    code: 'CHILD-SUPPORT-2024',
    name: 'Child Support Enhancement',
    nameUk: 'Підтримка дітей',
    category: 'cash-transfer' as ProgramCategory,
    status: 'active' as ProgramStatus,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    budget: { allocated: 456000000, utilized: 414960000, committed: 28000000 },
    beneficiaries: { registered: 1456000, active: 1398000, suspended: 23000, exited: 35000 },
    payments: { total: 8736000, success: 99.8, avgAmount: 850 },
    donors: ['UNICEF', 'USAID'],
    description: 'Monthly support payments for families with children under 18, enhanced rates for single parents and large families.',
    eligibility: ['Children under 18', 'Income below threshold', 'Ukrainian citizenship or residency', 'Not in state care'],
    aiInsight: { type: 'prediction', text: 'Projected 12% enrollment increase in Q1 2026', confidence: 91 },
  },
  {
    id: 'prog-004',
    code: 'DISABILITY-2024',
    name: 'Disability Allowance',
    nameUk: 'Допомога людям з інвалідністю',
    category: 'cash-transfer' as ProgramCategory,
    status: 'active' as ProgramStatus,
    startDate: '2024-03-01',
    endDate: '2026-02-28',
    budget: { allocated: 378000000, utilized: 317520000, committed: 34000000 },
    beneficiaries: { registered: 723000, active: 698000, suspended: 12000, exited: 13000 },
    payments: { total: 4338000, success: 99.6, avgAmount: 1450 },
    donors: ['EU', 'UNHCR'],
    description: 'Monthly allowance for persons with disabilities, with enhanced rates based on disability group.',
    eligibility: ['Disability status verified', 'Medical commission certificate', 'Ukrainian residency'],
    aiInsight: { type: 'compliance', text: 'All verification requirements met', confidence: 100 },
  },
  {
    id: 'prog-005',
    code: 'PENSION-TOP-2024',
    name: 'Pension Top-up Program',
    nameUk: 'Доплата до пенсії',
    category: 'cash-transfer' as ProgramCategory,
    status: 'active' as ProgramStatus,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    budget: { allocated: 567000000, utilized: 538650000, committed: 18000000 },
    beneficiaries: { registered: 2134000, active: 2089000, suspended: 15000, exited: 30000 },
    payments: { total: 12534000, success: 99.9, avgAmount: 420 },
    donors: ['National Budget', 'EU'],
    description: 'Supplementary payments for pensioners below the minimum living standard.',
    eligibility: ['Pension recipient', 'Below minimum living standard', 'Ukrainian citizenship'],
    aiInsight: null,
  },
  {
    id: 'prog-006',
    code: 'EMERGENCY-2024',
    name: 'Emergency Response Fund',
    nameUk: 'Фонд екстреного реагування',
    category: 'emergency' as ProgramCategory,
    status: 'standby' as ProgramStatus,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    budget: { allocated: 250000000, utilized: 30000000, committed: 0 },
    beneficiaries: { registered: 0, active: 0, suspended: 0, exited: 0 },
    payments: { total: 0, success: 0, avgAmount: 0 },
    donors: ['USAID', 'UNHCR', 'WFP'],
    description: 'Rapid response fund for emergency situations including natural disasters and conflict escalation.',
    eligibility: ['Emergency declaration', 'Affected area verification', 'Rapid assessment completed'],
    aiInsight: { type: 'alert', text: 'Fund ready for activation. 48hr deployment capability.', confidence: 100 },
  },
  {
    id: 'prog-007',
    code: 'WINTER-HEAT-2025',
    name: 'Winter Heating Subsidy 2025',
    nameUk: 'Субсидія на опалення 2025',
    category: 'subsidy' as ProgramCategory,
    status: 'draft' as ProgramStatus,
    startDate: '2025-10-01',
    endDate: '2026-04-30',
    budget: { allocated: 320000000, utilized: 0, committed: 0 },
    beneficiaries: { registered: 0, active: 0, suspended: 0, exited: 0 },
    payments: { total: 0, success: 0, avgAmount: 0 },
    donors: ['National Budget', 'EU'],
    description: 'Seasonal subsidy for heating costs during winter months for vulnerable households.',
    eligibility: ['Below income threshold', 'Heating costs verification', 'Primary residence only'],
    aiInsight: { type: 'recommendation', text: 'Based on 2024 data, recommend targeting 1.8M households', confidence: 87 },
  },
];

const ELIGIBILITY_RULES = [
  {
    id: 'rule-001',
    name: 'Income Threshold',
    type: 'economic',
    operator: 'less_than',
    value: '6700',
    unit: 'UAH/month per capita',
    source: 'Tax Authority API',
    automated: true,
  },
  {
    id: 'rule-002',
    name: 'IDP Status',
    type: 'status',
    operator: 'equals',
    value: 'verified',
    unit: '',
    source: 'Diia Registry',
    automated: true,
  },
  {
    id: 'rule-003',
    name: 'Age Requirement',
    type: 'demographic',
    operator: 'between',
    value: '0-18',
    unit: 'years',
    source: 'Civil Registry',
    automated: true,
  },
  {
    id: 'rule-004',
    name: 'Residency',
    type: 'geographic',
    operator: 'in',
    value: 'Ukraine (all oblasts)',
    unit: '',
    source: 'Address Registry',
    automated: true,
  },
  {
    id: 'rule-005',
    name: 'No Duplicate Benefits',
    type: 'cross-check',
    operator: 'not_exists',
    value: 'Similar program enrollment',
    unit: '',
    source: 'HBS Deduplication Engine',
    automated: true,
  },
  {
    id: 'rule-006',
    name: 'Disability Verification',
    type: 'status',
    operator: 'equals',
    value: 'Group I, II, or III',
    unit: '',
    source: 'Medical Commission Registry',
    automated: false,
  },
];

const PAYMENT_SCHEDULES = [
  { id: 'sched-001', program: 'IDP-CASH-2024', frequency: 'monthly', nextDate: '2026-01-15', amount: 2100, beneficiaries: 2634000, status: 'scheduled' },
  { id: 'sched-002', program: 'CHILD-SUPPORT-2024', frequency: 'monthly', nextDate: '2026-01-10', amount: 850, beneficiaries: 1398000, status: 'scheduled' },
  { id: 'sched-003', program: 'DISABILITY-2024', frequency: 'monthly', nextDate: '2026-01-12', amount: 1450, beneficiaries: 698000, status: 'scheduled' },
  { id: 'sched-004', program: 'PENSION-TOP-2024', frequency: 'monthly', nextDate: '2026-01-05', amount: 420, beneficiaries: 2089000, status: 'processing' },
  { id: 'sched-005', program: 'HOUSING-COMP-2023', frequency: 'event-based', nextDate: 'On approval', amount: 12500, beneficiaries: 567000, status: 'continuous' },
];

const CATEGORIES: { id: ProgramCategory; label: string; icon: string; color: string }[] = [
  { id: 'cash-transfer', label: 'Cash Transfer', icon: '💵', color: '#3CCB7F' },
  { id: 'in-kind', label: 'In-Kind Support', icon: '📦', color: '#F59E0B' },
  { id: 'subsidy', label: 'Subsidy', icon: '🏠', color: '#00A3FF' },
  { id: 'emergency', label: 'Emergency', icon: '🚨', color: '#F85149' },
  { id: 'reconstruction', label: 'Reconstruction', icon: '🏗️', color: '#A371F7' },
];

const STATUS_CONFIG: Record<ProgramStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: '#3CCB7F' },
  paused: { label: 'Paused', color: '#F59E0B' },
  draft: { label: 'Draft', color: '#8B949E' },
  closed: { label: 'Closed', color: '#F85149' },
  standby: { label: 'Standby', color: '#00A3FF' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ProgramsV10Page() {
  const [activeSection, setActiveSection] = useState<ProgramSection>('overview');
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0]);
  const [filterCategory, setFilterCategory] = useState<ProgramCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ProgramStatus | 'all'>('all');

  const filteredPrograms = PROGRAMS.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

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
              <span className="text-xl">📋</span>
              <span className="font-semibold">Programs</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm bg-[#161B22] border border-[#1F242C] px-4 py-2 rounded-lg hover:bg-[#1F242C]">
              Export Report
            </button>
            <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium hover:bg-[#33B5FF]">
              + New Program
            </button>
          </div>
        </div>
      </nav>

      {/* Section Tabs */}
      <div className="fixed top-16 left-0 right-0 bg-[#0D1117] border-b border-[#1F242C] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'catalog', label: 'Program Catalog', icon: '📋' },
              { id: 'eligibility', label: 'Eligibility Rules', icon: '✓' },
              { id: 'payments', label: 'Payment Schedules', icon: '💳' },
              { id: 'monitoring', label: 'Monitoring', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as ProgramSection)}
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
          {activeSection === 'overview' && (
            <OverviewSection 
              programs={PROGRAMS} 
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
            />
          )}
          {activeSection === 'catalog' && (
            <CatalogSection 
              programs={filteredPrograms}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
            />
          )}
          {activeSection === 'eligibility' && <EligibilitySection />}
          {activeSection === 'payments' && <PaymentsSection />}
          {activeSection === 'monitoring' && <MonitoringSection programs={PROGRAMS} />}
        </div>
      </main>
    </div>
  );
}

// ============================================
// OVERVIEW SECTION
// ============================================
function OverviewSection({ 
  programs, 
  selectedProgram, 
  setSelectedProgram 
}: { 
  programs: typeof PROGRAMS;
  selectedProgram: typeof PROGRAMS[0];
  setSelectedProgram: (p: typeof PROGRAMS[0]) => void;
}) {
  const totals = programs.reduce((acc, p) => ({
    budget: acc.budget + p.budget.allocated,
    utilized: acc.utilized + p.budget.utilized,
    beneficiaries: acc.beneficiaries + p.beneficiaries.active,
    payments: acc.payments + p.payments.total,
  }), { budget: 0, utilized: 0, beneficiaries: 0, payments: 0 });

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Programs', value: programs.filter(p => p.status === 'active').length, icon: '📋', color: '#3CCB7F' },
          { label: 'Total Budget', value: `$${(totals.budget / 1000000000).toFixed(2)}B`, icon: '💰', color: '#00A3FF' },
          { label: 'Active Beneficiaries', value: `${(totals.beneficiaries / 1000000).toFixed(1)}M`, icon: '👥', color: '#A371F7' },
          { label: 'Total Payments', value: `${(totals.payments / 1000000).toFixed(1)}M`, icon: '💳', color: '#F59E0B' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{kpi.icon}</span>
              <span className="text-sm text-[#8B949E]">{kpi.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Programs Grid + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program List */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold">Active Programs</h3>
          </div>
          <div className="divide-y divide-[#1F242C] max-h-[500px] overflow-y-auto">
            {programs.filter(p => p.status === 'active').map((program) => (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className={`w-full p-4 text-left hover:bg-[#1F242C]/50 transition-colors ${
                  selectedProgram.id === program.id ? 'bg-[#1F242C]/50 border-l-2 border-[#00A3FF]' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{program.name}</div>
                    <div className="text-xs text-[#6E7681]">{program.code}</div>
                  </div>
                  <span className="text-lg">
                    {CATEGORIES.find(c => c.id === program.category)?.icon}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-[#8B949E]">
                  <span>{(program.beneficiaries.active / 1000000).toFixed(2)}M</span>
                  <span>${(program.budget.utilized / 1000000).toFixed(0)}M</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Program Detail */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div 
            className="p-4 border-b border-[#1F242C]"
            style={{ backgroundColor: `${CATEGORIES.find(c => c.id === selectedProgram.category)?.color}10` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{CATEGORIES.find(c => c.id === selectedProgram.category)?.icon}</span>
                  <h3 className="font-semibold">{selectedProgram.name}</h3>
                </div>
                <div className="text-sm text-[#8B949E]">{selectedProgram.nameUk}</div>
                <div className="text-xs text-[#6E7681] mt-1">{selectedProgram.code}</div>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded"
                style={{ 
                  backgroundColor: `${STATUS_CONFIG[selectedProgram.status].color}20`,
                  color: STATUS_CONFIG[selectedProgram.status].color
                }}
              >
                {STATUS_CONFIG[selectedProgram.status].label}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <p className="text-sm text-[#8B949E]">{selectedProgram.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681] mb-1">Budget Allocated</div>
                <div className="font-bold">${(selectedProgram.budget.allocated / 1000000).toFixed(0)}M</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681] mb-1">Utilized</div>
                <div className="font-bold text-[#3CCB7F]">
                  {((selectedProgram.budget.utilized / selectedProgram.budget.allocated) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681] mb-1">Active Beneficiaries</div>
                <div className="font-bold">{(selectedProgram.beneficiaries.active / 1000000).toFixed(2)}M</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#6E7681] mb-1">Payment Success</div>
                <div className="font-bold text-[#3CCB7F]">{selectedProgram.payments.success}%</div>
              </div>
            </div>

            {/* Budget Bar */}
            <div>
              <div className="flex justify-between text-xs text-[#8B949E] mb-2">
                <span>Budget Utilization</span>
                <span>${(selectedProgram.budget.utilized / 1000000).toFixed(0)}M / ${(selectedProgram.budget.allocated / 1000000).toFixed(0)}M</span>
              </div>
              <div className="h-3 bg-[#1F242C] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3CCB7F] rounded-full"
                  style={{ width: `${(selectedProgram.budget.utilized / selectedProgram.budget.allocated) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Eligibility & Donors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-xs font-semibold text-[#8B949E] mb-2">ELIGIBILITY CRITERIA</div>
                <ul className="space-y-1">
                  {selectedProgram.eligibility.map((e, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#8B949E]">
                      <span className="text-[#3CCB7F]">✓</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-xs font-semibold text-[#8B949E] mb-2">FUNDING SOURCES</div>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.donors.map((d, i) => (
                    <span key={i} className="text-xs bg-[#1F242C] px-2 py-1 rounded">{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insight */}
            {selectedProgram.aiInsight && (
              <div className={`rounded-lg p-4 ${
                selectedProgram.aiInsight.type === 'recommendation' ? 'bg-[#00A3FF]/10 border border-[#00A3FF]/30' :
                selectedProgram.aiInsight.type === 'anomaly' ? 'bg-[#F59E0B]/10 border border-[#F59E0B]/30' :
                selectedProgram.aiInsight.type === 'prediction' ? 'bg-[#A371F7]/10 border border-[#A371F7]/30' :
                'bg-[#3CCB7F]/10 border border-[#3CCB7F]/30'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🧠</span>
                  <div>
                    <div className="text-sm font-medium mb-1">AI Insight</div>
                    <p className="text-xs text-[#8B949E]">{selectedProgram.aiInsight.text}</p>
                    <span className="text-xs text-[#6E7681]">Confidence: {selectedProgram.aiInsight.confidence}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CATALOG SECTION
// ============================================
function CatalogSection({
  programs,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  selectedProgram,
  setSelectedProgram,
}: {
  programs: typeof PROGRAMS;
  filterCategory: ProgramCategory | 'all';
  setFilterCategory: (c: ProgramCategory | 'all') => void;
  filterStatus: ProgramStatus | 'all';
  setFilterStatus: (s: ProgramStatus | 'all') => void;
  selectedProgram: typeof PROGRAMS[0];
  setSelectedProgram: (p: typeof PROGRAMS[0]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs text-[#8B949E] block mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ProgramCategory | 'all')}
              className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#8B949E] block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ProgramStatus | 'all')}
              className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([id, config]) => (
                <option key={id} value={id}>{config.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1"></div>
          <div className="text-sm text-[#8B949E]">
            {programs.length} programs found
          </div>
        </div>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((program) => {
          const category = CATEGORIES.find(c => c.id === program.category);
          const status = STATUS_CONFIG[program.status];
          return (
            <div 
              key={program.id}
              className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#3D444D] transition-colors cursor-pointer"
              onClick={() => setSelectedProgram(program)}
            >
              <div className="h-1" style={{ backgroundColor: category?.color }}></div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category?.icon}</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${status.color}20`, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                  <span className="text-xs text-[#6E7681]">{program.code}</span>
                </div>
                <h4 className="font-medium text-sm mb-1">{program.name}</h4>
                <p className="text-xs text-[#6E7681] mb-3 line-clamp-2">{program.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0D1117] rounded p-2">
                    <div className="text-[#6E7681]">Beneficiaries</div>
                    <div className="font-medium">{(program.beneficiaries.active / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="bg-[#0D1117] rounded p-2">
                    <div className="text-[#6E7681]">Budget</div>
                    <div className="font-medium">${(program.budget.allocated / 1000000).toFixed(0)}M</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// ELIGIBILITY SECTION
// ============================================
function EligibilitySection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Eligibility Rules Engine</h2>
          <p className="text-sm text-[#8B949E]">Configure and manage program eligibility criteria</p>
        </div>
        <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium">
          + Add Rule
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Rule Name</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Condition</th>
                <th className="text-left p-4">Data Source</th>
                <th className="text-center p-4">Automated</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ELIGIBILITY_RULES.map((rule) => (
                <tr key={rule.id} className="border-b border-[#1F242C]">
                  <td className="p-4 font-medium">{rule.name}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      rule.type === 'economic' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                      rule.type === 'status' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                      rule.type === 'demographic' ? 'bg-[#A371F7]/20 text-[#A371F7]' :
                      rule.type === 'geographic' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#8B949E]/20 text-[#8B949E]'
                    }`}>
                      {rule.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <code className="text-xs bg-[#0D1117] px-2 py-1 rounded">
                      {rule.operator} {rule.value} {rule.unit}
                    </code>
                  </td>
                  <td className="p-4 text-[#8B949E]">{rule.source}</td>
                  <td className="p-4 text-center">
                    {rule.automated ? (
                      <span className="text-[#3CCB7F]">✓</span>
                    ) : (
                      <span className="text-[#F59E0B]">Manual</span>
                    )}
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

      {/* Rule Builder Preview */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>🔧</span> Rule Builder
        </h3>
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 font-mono text-sm">
          <div className="text-[#8B949E]">
            <span className="text-[#A371F7]">IF</span> beneficiary.income_per_capita <span className="text-[#F59E0B]">&lt;</span> <span className="text-[#3CCB7F]">6700</span> UAH<br/>
            <span className="text-[#A371F7]">AND</span> beneficiary.idp_status <span className="text-[#F59E0B]">==</span> <span className="text-[#3CCB7F]">"verified"</span><br/>
            <span className="text-[#A371F7]">AND</span> beneficiary.residency <span className="text-[#F59E0B]">IN</span> <span className="text-[#3CCB7F]">["Ukraine"]</span><br/>
            <span className="text-[#A371F7]">AND NOT</span> duplicate_check(beneficiary.id, program_id)<br/>
            <span className="text-[#A371F7]">THEN</span> <span className="text-[#00A3FF]">ELIGIBLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAYMENTS SECTION
// ============================================
function PaymentsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Payment Schedules</h2>
          <p className="text-sm text-[#8B949E]">Manage payment cycles and disbursement schedules</p>
        </div>
        <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded-lg font-medium">
          + Schedule Payment
        </button>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold">Upcoming Payment Cycles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Program</th>
                <th className="text-left p-4">Frequency</th>
                <th className="text-left p-4">Next Date</th>
                <th className="text-right p-4">Amount/Person</th>
                <th className="text-right p-4">Beneficiaries</th>
                <th className="text-right p-4">Total Volume</th>
                <th className="text-center p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_SCHEDULES.map((schedule) => (
                <tr key={schedule.id} className="border-b border-[#1F242C]">
                  <td className="p-4 font-medium">{schedule.program}</td>
                  <td className="p-4 text-[#8B949E]">{schedule.frequency}</td>
                  <td className="p-4">{schedule.nextDate}</td>
                  <td className="p-4 text-right font-mono">${schedule.amount}</td>
                  <td className="p-4 text-right font-mono">{(schedule.beneficiaries / 1000000).toFixed(2)}M</td>
                  <td className="p-4 text-right font-mono text-[#3CCB7F]">
                    ${((schedule.amount * schedule.beneficiaries) / 1000000).toFixed(1)}M
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      schedule.status === 'processing' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      schedule.status === 'scheduled' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                      'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Calendar */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">January 2026 Payment Calendar</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[#8B949E] py-2">{d}</div>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const hasPayment = [5, 10, 12, 15].includes(day);
            return (
              <div 
                key={day}
                className={`py-2 rounded ${
                  hasPayment ? 'bg-[#00A3FF]/20 text-[#00A3FF] font-medium' : 'hover:bg-[#1F242C]'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { method: 'Bank Transfer', percentage: 67, icon: '🏦' },
          { method: 'Mobile Money', percentage: 24, icon: '📱' },
          { method: 'Cash Pickup', percentage: 9, icon: '💵' },
        ].map((pm, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{pm.icon}</span>
              <div>
                <div className="font-medium">{pm.method}</div>
                <div className="text-sm text-[#8B949E]">{pm.percentage}% of payments</div>
              </div>
            </div>
            <div className="h-2 bg-[#1F242C] rounded-full">
              <div className="h-full bg-[#00A3FF] rounded-full" style={{ width: `${pm.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MONITORING SECTION
// ============================================
function MonitoringSection({ programs }: { programs: typeof PROGRAMS }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Program Monitoring</h2>
        <p className="text-sm text-[#8B949E]">Real-time program performance and outcome tracking</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Coverage Rate', value: '94.2%', target: '95%', status: 'below', icon: '📊' },
          { label: 'Payment Success', value: '99.7%', target: '99.5%', status: 'above', icon: '✓' },
          { label: 'Avg Processing', value: '2.3 days', target: '3 days', status: 'above', icon: '⏱️' },
          { label: 'Beneficiary Satisfaction', value: '4.6/5', target: '4.5/5', status: 'above', icon: '😊' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{kpi.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                kpi.status === 'above' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}>
                {kpi.status === 'above' ? '✓ On Track' : '⚠ Below'}
              </span>
            </div>
            <div className="text-xl font-bold">{kpi.value}</div>
            <div className="text-xs text-[#8B949E]">{kpi.label}</div>
            <div className="text-xs text-[#6E7681]">Target: {kpi.target}</div>
          </div>
        ))}
      </div>

      {/* Program Performance Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold">Program Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Program</th>
                <th className="text-right p-4">Registered</th>
                <th className="text-right p-4">Active</th>
                <th className="text-right p-4">Suspended</th>
                <th className="text-right p-4">Exited</th>
                <th className="text-right p-4">Success Rate</th>
                <th className="text-right p-4">Budget Util.</th>
              </tr>
            </thead>
            <tbody>
              {programs.filter(p => p.status === 'active').map((program) => (
                <tr key={program.id} className="border-b border-[#1F242C]">
                  <td className="p-4">
                    <div className="font-medium">{program.name}</div>
                    <div className="text-xs text-[#6E7681]">{program.code}</div>
                  </td>
                  <td className="p-4 text-right font-mono">{(program.beneficiaries.registered / 1000000).toFixed(2)}M</td>
                  <td className="p-4 text-right font-mono text-[#3CCB7F]">{(program.beneficiaries.active / 1000000).toFixed(2)}M</td>
                  <td className="p-4 text-right font-mono text-[#F59E0B]">{(program.beneficiaries.suspended / 1000).toFixed(0)}K</td>
                  <td className="p-4 text-right font-mono text-[#8B949E]">{(program.beneficiaries.exited / 1000).toFixed(0)}K</td>
                  <td className="p-4 text-right font-mono text-[#3CCB7F]">{program.payments.success}%</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-[#1F242C] rounded-full">
                        <div 
                          className="h-full bg-[#00A3FF] rounded-full"
                          style={{ width: `${(program.budget.utilized / program.budget.allocated) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{((program.budget.utilized / program.budget.allocated) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Monitoring Insights */}
      <div className="bg-gradient-to-r from-[#A371F7]/10 to-transparent border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="font-semibold mb-2">AI Monitoring Summary</h3>
            <p className="text-sm text-[#8B949E] mb-4">
              All active programs are performing within expected parameters. Key observations:
            </p>
            <ul className="space-y-2 text-sm text-[#8B949E]">
              <li className="flex items-start gap-2">
                <span className="text-[#3CCB7F]">✓</span>
                IDP Cash Assistance approaching 90% budget utilization - recommend budget review
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F59E0B]">⚠</span>
                Housing Compensation showing unusual claim patterns in Kherson - flagged for review
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A3FF]">ℹ</span>
                Child Support enrollment predicted to increase 12% in Q1 2026
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
