'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type PortalSection = 'overview' | 'vendor' | 'contractor' | 'logistics' | 'api' | 'raci' | 'onboarding' | 'audit';
type OnboardingStage = 'registration' | 'verification' | 'contract' | 'access' | 'monitoring' | 'offboarding';
type APITier = 'sandbox' | 'staging' | 'production';

// ============================================
// DATA
// ============================================
const RACI_MATRIX = {
  activities: [
    {
      category: 'Vendor Management',
      items: [
        { activity: 'Vendor registration approval', vendor: 'I', contractor: '-', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'C' },
        { activity: 'Contract negotiation', vendor: 'C', contractor: '-', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'C' },
        { activity: 'Performance evaluation', vendor: 'I', contractor: '-', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'I' },
        { activity: 'Payment authorization', vendor: 'I', contractor: '-', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'C' },
      ],
    },
    {
      category: 'Contractor Operations',
      items: [
        { activity: 'Project assignment', vendor: '-', contractor: 'I', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'I' },
        { activity: 'Progress reporting', vendor: '-', contractor: 'R', logistics: 'C', ministry: 'I', procurement: 'A', compliance: 'I' },
        { activity: 'Quality inspection', vendor: '-', contractor: 'C', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'C' },
        { activity: 'Milestone approval', vendor: '-', contractor: 'I', logistics: '-', ministry: 'A', procurement: 'R', compliance: 'C' },
      ],
    },
    {
      category: 'Logistics Operations',
      items: [
        { activity: 'Shipment tracking', vendor: 'I', contractor: 'I', logistics: 'R', ministry: 'I', procurement: 'I', compliance: 'I' },
        { activity: 'Delivery confirmation', vendor: '-', contractor: 'C', logistics: 'R', ministry: 'I', procurement: 'A', compliance: 'I' },
        { activity: 'Inventory management', vendor: 'C', contractor: '-', logistics: 'R', ministry: 'I', procurement: 'A', compliance: 'I' },
        { activity: 'Route optimization', vendor: '-', contractor: '-', logistics: 'R', ministry: 'I', procurement: 'I', compliance: '-' },
      ],
    },
    {
      category: 'Compliance & Audit',
      items: [
        { activity: 'Document verification', vendor: 'R', contractor: 'R', logistics: 'R', ministry: 'I', procurement: 'C', compliance: 'A' },
        { activity: 'Audit trail review', vendor: 'I', contractor: 'I', logistics: 'I', ministry: 'I', procurement: 'C', compliance: 'R' },
        { activity: 'Compliance reporting', vendor: 'C', contractor: 'C', logistics: 'C', ministry: 'A', procurement: 'C', compliance: 'R' },
        { activity: 'Incident escalation', vendor: 'I', contractor: 'I', logistics: 'I', ministry: 'A', procurement: 'C', compliance: 'R' },
      ],
    },
  ],
  legend: {
    R: { label: 'Responsible', description: 'Does the work', color: '#3CCB7F' },
    A: { label: 'Accountable', description: 'Final authority', color: '#00A3FF' },
    C: { label: 'Consulted', description: 'Provides input', color: '#F59E0B' },
    I: { label: 'Informed', description: 'Kept updated', color: '#8B949E' },
    '-': { label: 'Not Involved', description: '', color: '#3D444D' },
  },
};

const ONBOARDING_STAGES: Record<OnboardingStage, {
  id: OnboardingStage;
  title: string;
  icon: string;
  duration: string;
  description: string;
  steps: { name: string; responsible: string; automated: boolean }[];
  documents: string[];
  checkpoints: string[];
}> = {
  registration: {
    id: 'registration',
    title: 'Registration',
    icon: '📝',
    duration: '1-2 days',
    description: 'Initial application submission and preliminary screening',
    steps: [
      { name: 'Submit registration form', responsible: 'Partner', automated: false },
      { name: 'Upload required documents', responsible: 'Partner', automated: false },
      { name: 'Automated document validation', responsible: 'System', automated: true },
      { name: 'Preliminary eligibility check', responsible: 'System', automated: true },
      { name: 'Application acknowledgment', responsible: 'System', automated: true },
    ],
    documents: ['Business registration certificate', 'Tax compliance certificate', 'Bank account details', 'Authorized signatory documentation'],
    checkpoints: ['All required fields completed', 'Document formats valid', 'No duplicate registration'],
  },
  verification: {
    id: 'verification',
    title: 'Verification',
    icon: '🔍',
    duration: '3-5 days',
    description: 'Background checks and document authentication',
    steps: [
      { name: 'Document authenticity verification', responsible: 'Compliance Team', automated: false },
      { name: 'Business registry cross-check', responsible: 'System', automated: true },
      { name: 'Tax authority verification', responsible: 'System', automated: true },
      { name: 'Reference checks', responsible: 'Procurement Team', automated: false },
      { name: 'Risk assessment scoring', responsible: 'System', automated: true },
    ],
    documents: ['Verification report', 'Risk assessment score', 'Reference feedback'],
    checkpoints: ['All documents authenticated', 'Risk score within threshold', 'No negative references'],
  },
  contract: {
    id: 'contract',
    title: 'Contract',
    icon: '📄',
    duration: '5-10 days',
    description: 'Contract negotiation, review, and execution',
    steps: [
      { name: 'Contract template selection', responsible: 'Procurement Team', automated: false },
      { name: 'Terms customization', responsible: 'Procurement Team', automated: false },
      { name: 'Legal review', responsible: 'Legal Team', automated: false },
      { name: 'Partner review period', responsible: 'Partner', automated: false },
      { name: 'Digital signature', responsible: 'Both Parties', automated: true },
      { name: 'Contract registration', responsible: 'System', automated: true },
    ],
    documents: ['Framework agreement', 'Terms and conditions', 'Data processing agreement', 'SLA document'],
    checkpoints: ['Legal approval obtained', 'Both parties signed', 'Contract registered in system'],
  },
  access: {
    id: 'access',
    title: 'Access',
    icon: '🔑',
    duration: '1-2 days',
    description: 'System access provisioning and training',
    steps: [
      { name: 'User account creation', responsible: 'System', automated: true },
      { name: 'Role assignment', responsible: 'Admin Team', automated: false },
      { name: 'Access credentials delivery', responsible: 'System', automated: true },
      { name: 'MFA enrollment', responsible: 'Partner', automated: false },
      { name: 'Training completion', responsible: 'Partner', automated: false },
      { name: 'Access activation', responsible: 'System', automated: true },
    ],
    documents: ['User credentials', 'Access policy acknowledgment', 'Training completion certificate'],
    checkpoints: ['MFA configured', 'Training completed', 'Policy acknowledged'],
  },
  monitoring: {
    id: 'monitoring',
    title: 'Monitoring',
    icon: '📊',
    duration: 'Ongoing',
    description: 'Continuous performance and compliance monitoring',
    steps: [
      { name: 'Activity logging', responsible: 'System', automated: true },
      { name: 'Performance tracking', responsible: 'System', automated: true },
      { name: 'Compliance checks', responsible: 'System', automated: true },
      { name: 'Periodic reviews', responsible: 'Procurement Team', automated: false },
      { name: 'Alert monitoring', responsible: 'Compliance Team', automated: false },
    ],
    documents: ['Performance reports', 'Compliance certificates', 'Audit logs'],
    checkpoints: ['KPIs within thresholds', 'No compliance violations', 'Certifications current'],
  },
  offboarding: {
    id: 'offboarding',
    title: 'Offboarding',
    icon: '🚪',
    duration: '5-15 days',
    description: 'Contract termination and access revocation',
    steps: [
      { name: 'Offboarding request', responsible: 'Either Party', automated: false },
      { name: 'Outstanding obligations review', responsible: 'Procurement Team', automated: false },
      { name: 'Final payment settlement', responsible: 'Finance Team', automated: false },
      { name: 'Data export/deletion', responsible: 'System', automated: true },
      { name: 'Access revocation', responsible: 'System', automated: true },
      { name: 'Archive records', responsible: 'System', automated: true },
    ],
    documents: ['Termination notice', 'Final settlement statement', 'Data deletion certificate', 'Archive confirmation'],
    checkpoints: ['All payments settled', 'Data properly handled', 'Access fully revoked'],
  },
};

const AUDIT_TRAIL_EVENTS = [
  { category: 'Authentication', events: ['Login attempt', 'Login success', 'Login failure', 'Logout', 'MFA challenge', 'Password reset'] },
  { category: 'Data Access', events: ['Record view', 'Record search', 'Report generation', 'Data export', 'Bulk download'] },
  { category: 'Transactions', events: ['Bid submission', 'Contract creation', 'Payment request', 'Invoice submission', 'Delivery confirmation'] },
  { category: 'System Actions', events: ['Profile update', 'Settings change', 'Document upload', 'API key generation', 'Webhook configuration'] },
  { category: 'Compliance', events: ['Certification upload', 'Compliance check', 'Audit request', 'Exception flagged', 'Escalation triggered'] },
];

const API_TIERS: Record<APITier, {
  id: APITier;
  title: string;
  color: string;
  description: string;
  access: string;
  rateLimit: string;
  dataScope: string;
  sla: string;
  features: string[];
  requirements: string[];
}> = {
  sandbox: {
    id: 'sandbox',
    title: 'Sandbox',
    color: '#F59E0B',
    description: 'Development and testing environment',
    access: 'Self-service registration',
    rateLimit: '100 requests/minute',
    dataScope: 'Synthetic test data only',
    sla: 'Best effort (no SLA)',
    features: [
      'Full API functionality',
      'Synthetic test data',
      'Reset capability',
      'Debug logging',
      'Error simulation',
    ],
    requirements: [
      'Developer account',
      'Terms acceptance',
      'No production data',
    ],
  },
  staging: {
    id: 'staging',
    title: 'Staging',
    color: '#00A3FF',
    description: 'Pre-production validation environment',
    access: 'Approval required',
    rateLimit: '500 requests/minute',
    dataScope: 'Anonymized production mirror',
    sla: '99% availability',
    features: [
      'Production-like data',
      'Performance testing',
      'Integration validation',
      'Security scanning',
      'UAT support',
    ],
    requirements: [
      'Sandbox testing completed',
      'Integration plan approved',
      'Security assessment passed',
    ],
  },
  production: {
    id: 'production',
    title: 'Production',
    color: '#3CCB7F',
    description: 'Live production environment',
    access: 'Formal agreement required',
    rateLimit: '1000+ requests/minute (tier-based)',
    dataScope: 'Full production data',
    sla: '99.9% availability',
    features: [
      'Full production access',
      'Real-time data',
      'Priority support',
      'Custom rate limits',
      'Dedicated account manager',
    ],
    requirements: [
      'Staging validation completed',
      'Security audit passed',
      'Legal agreement signed',
      'Technical review completed',
      'Insurance requirements met',
    ],
  },
};

const PORTAL_TYPES = [
  { id: 'vendor', title: 'Vendor Portal', icon: '🏪', color: '#00A3FF', users: '2,400+', volume: '$890M' },
  { id: 'contractor', title: 'Contractor Portal', icon: '🏗️', color: '#3CCB7F', users: '580+', volume: '$2.1B' },
  { id: 'logistics', title: 'Logistics Portal', icon: '🚚', color: '#F59E0B', users: '340+', volume: '12.5M items' },
  { id: 'api', title: 'API Portal', icon: '🔌', color: '#A371F7', users: '450+', volume: '28M req/mo' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function PortalsV10Page() {
  const [activeSection, setActiveSection] = useState<PortalSection>('overview');
  const [selectedStage, setSelectedStage] = useState<OnboardingStage>('registration');
  const [selectedTier, setSelectedTier] = useState<APITier>('sandbox');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Partner Ecosystem</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]">
              Partner Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🤝</span>
            <span className="text-sm bg-[#00A3FF]/10 text-[#00A3FF] px-3 py-1 rounded-full font-medium">
              Contractor Ecosystem
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Partner Portals v10.0</h1>
          <p className="text-[#8B949E] max-w-2xl">
            Comprehensive ecosystem for vendors, contractors, logistics partners, and API integrators. 
            Full lifecycle management from onboarding to offboarding with complete audit trails.
          </p>
        </div>
      </section>

      {/* Section Tabs */}
      <section className="border-b border-[#1F242C] sticky top-16 bg-[#0D1117] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'raci', label: 'RACI & Roles', icon: '👥' },
              { id: 'onboarding', label: 'Onboarding Flow', icon: '🚀' },
              { id: 'audit', label: 'Audit Trails', icon: '📊' },
              { id: 'api', label: 'API Tiers', icon: '🔌' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as PortalSection)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
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
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'raci' && <RACISection />}
          {activeSection === 'onboarding' && (
            <OnboardingSection selected={selectedStage} setSelected={setSelectedStage} />
          )}
          {activeSection === 'audit' && <AuditSection />}
          {activeSection === 'api' && (
            <APITiersSection selected={selectedTier} setSelected={setSelectedTier} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B949E]">
            Partner Ecosystem v10.0 — Transparent, Auditable, Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// OVERVIEW SECTION
// ============================================
function OverviewSection() {
  return (
    <div className="space-y-12">
      {/* Portal Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PORTAL_TYPES.map((portal) => (
          <div 
            key={portal.id}
            className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 hover:border-[#3D444D] transition-colors"
          >
            <div className="text-3xl mb-3">{portal.icon}</div>
            <div className="font-semibold mb-1">{portal.title}</div>
            <div className="text-sm text-[#8B949E] mb-3">
              {portal.users} partners
            </div>
            <div 
              className="text-lg font-bold"
              style={{ color: portal.color }}
            >
              {portal.volume}
            </div>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="text-2xl mb-3">👥</div>
          <h3 className="font-semibold mb-2">RACI Matrix</h3>
          <p className="text-sm text-[#8B949E]">
            Clear responsibility assignment for every action. Who does what, who approves, who needs to know.
          </p>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="text-2xl mb-3">🔄</div>
          <h3 className="font-semibold mb-2">Full Lifecycle</h3>
          <p className="text-sm text-[#8B949E]">
            Complete partner journey from registration through verification, contracting, access, monitoring, to offboarding.
          </p>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="text-2xl mb-3">📊</div>
          <h3 className="font-semibold mb-2">Audit Trail</h3>
          <p className="text-sm text-[#8B949E]">
            Every action logged and blockchain-verified. Full transparency for donors and oversight bodies.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-6">Ecosystem Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Partners', value: '3,770+' },
            { label: 'Contracts Managed', value: '4,200+' },
            { label: 'Transactions Processed', value: '$4.1B' },
            { label: 'Audit Events/Day', value: '2.8M' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#00A3FF]">{stat.value}</div>
              <div className="text-sm text-[#8B949E]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Badges */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-6">Compliance & Certifications</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { name: 'ISO 27001', status: 'Certified' },
            { name: 'GDPR', status: 'Compliant' },
            { name: 'OCDS 1.1', status: '98.5%' },
            { name: 'IATI 2.03', status: '99.2%' },
            { name: 'SOC 2 Type II', status: 'Attested' },
          ].map((cert, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-2 flex items-center gap-2">
              <span className="text-[#3CCB7F]">✓</span>
              <span className="text-sm">{cert.name}</span>
              <span className="text-xs text-[#8B949E]">({cert.status})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// RACI SECTION
// ============================================
function RACISection() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">RACI Matrix & Roles</h2>
        <p className="text-[#8B949E]">
          Clear responsibility assignment for all partner ecosystem activities.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">RACI Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(RACI_MATRIX.legend).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: `${value.color}20`, color: value.color }}
              >
                {key}
              </div>
              <div>
                <div className="text-sm font-medium">{value.label}</div>
                {value.description && (
                  <div className="text-xs text-[#6E7681]">{value.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RACI Tables */}
      {RACI_MATRIX.activities.map((category, catIndex) => (
        <div key={catIndex} className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] bg-[#0D1117]">
            <h3 className="font-semibold">{category.category}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1F242C]">
                  <th className="text-left p-3 text-[#8B949E]">Activity</th>
                  <th className="text-center p-3 text-[#8B949E]">Vendor</th>
                  <th className="text-center p-3 text-[#8B949E]">Contractor</th>
                  <th className="text-center p-3 text-[#8B949E]">Logistics</th>
                  <th className="text-center p-3 text-[#8B949E]">Ministry</th>
                  <th className="text-center p-3 text-[#8B949E]">Procurement</th>
                  <th className="text-center p-3 text-[#8B949E]">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {category.items.map((item, i) => (
                  <tr key={i} className="border-b border-[#1F242C]">
                    <td className="p-3">{item.activity}</td>
                    {['vendor', 'contractor', 'logistics', 'ministry', 'procurement', 'compliance'].map((role) => {
                      const value = item[role as keyof typeof item];
                      const legend = RACI_MATRIX.legend[value as keyof typeof RACI_MATRIX.legend];
                      return (
                        <td key={role} className="p-3 text-center">
                          <span 
                            className="inline-flex w-6 h-6 items-center justify-center rounded text-xs font-bold"
                            style={{ 
                              backgroundColor: legend ? `${legend.color}20` : 'transparent', 
                              color: legend?.color || '#3D444D'
                            }}
                          >
                            {value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Role Descriptions */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Role Descriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { role: 'Ministry', desc: 'Government oversight body with final accountability for all partner activities' },
            { role: 'Procurement Team', desc: 'Operational team managing vendor selection, contracting, and performance' },
            { role: 'Compliance Team', desc: 'Independent oversight ensuring adherence to policies and regulations' },
            { role: 'Vendor/Contractor/Logistics', desc: 'External partners providing goods, services, or logistics support' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] rounded-lg p-4">
              <div className="font-medium text-sm mb-1">{item.role}</div>
              <p className="text-xs text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ONBOARDING SECTION
// ============================================
function OnboardingSection({ 
  selected, 
  setSelected 
}: { 
  selected: OnboardingStage; 
  setSelected: (stage: OnboardingStage) => void;
}) {
  const stage = ONBOARDING_STAGES[selected];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Partner Onboarding Flow</h2>
        <p className="text-[#8B949E]">
          Complete lifecycle from registration to offboarding with clear checkpoints.
        </p>
      </div>

      {/* Stage Timeline */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {Object.values(ONBOARDING_STAGES).map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className="flex flex-col items-center min-w-[100px] relative"
            >
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
                  selected === s.id 
                    ? 'bg-[#00A3FF] text-[#0D1117]' 
                    : 'bg-[#1F242C] text-[#8B949E]'
                }`}
              >
                {s.icon}
              </div>
              <div className={`text-xs text-center ${selected === s.id ? 'text-[#00A3FF]' : 'text-[#8B949E]'}`}>
                {s.title}
              </div>
              <div className="text-[10px] text-[#6E7681]">{s.duration}</div>
              {i < Object.values(ONBOARDING_STAGES).length - 1 && (
                <div className="absolute top-6 left-full w-full h-0.5 bg-[#1F242C] -translate-x-1/2 hidden md:block"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Stage Header */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#00A3FF]/20 rounded-xl flex items-center justify-center text-2xl">
                {stage.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{stage.title}</h3>
                <span className="text-sm text-[#8B949E]">Duration: {stage.duration}</span>
              </div>
            </div>
            <p className="text-[#8B949E]">{stage.description}</p>
          </div>

          {/* Steps */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Process Steps</h4>
            <div className="space-y-3">
              {stage.steps.map((step, i) => (
                <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1F242C] rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-[#6E7681]">By: {step.responsible}</div>
                    </div>
                  </div>
                  {step.automated && (
                    <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">
                      Automated
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Required Documents</h4>
            <ul className="space-y-2">
              {stage.documents.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span className="text-[#00A3FF]">📄</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Checkpoints */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Gate Checkpoints</h4>
            <ul className="space-y-2">
              {stage.checkpoints.map((cp, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span className="text-[#3CCB7F]">✓</span>
                  {cp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Full Flow Diagram */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Complete Onboarding Flow</h3>
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            PARTNER ONBOARDING LIFECYCLE                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │REGISTRAT.│───>│VERIFICAT.│───>│ CONTRACT │───>│  ACCESS  │───>│MONITORING│              │
│  │  📝      │    │  🔍      │    │   📄     │    │   🔑     │    │   📊     │              │
│  │ 1-2 days │    │ 3-5 days │    │5-10 days │    │ 1-2 days │    │ Ongoing  │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │               │               │                     │
│       ▼               ▼               ▼               ▼               ▼                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                   │
│  │ Submit  │    │ BG Check│    │ Review  │    │ Create  │    │ KPIs &  │                   │
│  │ Docs    │    │ Tax Ver.│    │ Terms   │    │ Account │    │ Alerts  │                   │
│  │ Auto-   │    │ Refs    │    │ Legal   │    │ MFA     │    │ Reviews │                   │
│  │ validate│    │ Risk    │    │ Sign    │    │ Train   │    │ Compliance                  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘                   │
│                                                                    │                        │
│                                                                    │                        │
│                                               ┌────────────────────┴────────────────────┐  │
│                                               │                                         │  │
│                                               ▼                                         │  │
│                                         ┌──────────┐                                    │  │
│                                         │OFFBOARDING                                    │  │
│                                         │   🚪     │                                    │  │
│                                         │5-15 days │                                    │  │
│                                         │          │                                    │  │
│                                         │ Settle   │                                    │  │
│                                         │ Revoke   │                                    │  │
│                                         │ Archive  │                                    │  │
│                                         └──────────┘                                    │  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AUDIT SECTION
// ============================================
function AuditSection() {
  const [selectedCategory, setSelectedCategory] = useState(AUDIT_TRAIL_EVENTS[0].category);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Audit Trails</h2>
        <p className="text-[#8B949E]">
          Complete audit logging for all partner activities with blockchain verification and donor transparency.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Events/Day', value: '2.8M', icon: '📊' },
          { label: 'Retention', value: '7 years', icon: '📁' },
          { label: 'Blockchain Verified', value: '100%', icon: '🔗' },
          { label: 'Query Latency', value: '<100ms', icon: '⚡' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-[#00A3FF]">{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Event Categories */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Logged Event Categories</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {AUDIT_TRAIL_EVENTS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.category
                  ? 'bg-[#00A3FF] text-[#0D1117]'
                  : 'bg-[#0D1117] text-[#8B949E] hover:text-white border border-[#1F242C]'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AUDIT_TRAIL_EVENTS.find(c => c.category === selectedCategory)?.events.map((event, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-3 text-sm">
              {event}
            </div>
          ))}
        </div>
      </div>

      {/* Sample Audit Log */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C] bg-[#0D1117] flex items-center justify-between">
          <h3 className="font-semibold">Sample Audit Log</h3>
          <span className="text-xs text-[#8B949E]">Last 5 events</span>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {[
            { time: '2026-01-05 14:32:15', user: 'vendor_123', action: 'Invoice submitted', resource: 'INV-2026-0142', ip: '192.168.1.45' },
            { time: '2026-01-05 14:28:03', user: 'proc_officer_7', action: 'Payment approved', resource: 'PAY-2026-0891', ip: '10.0.0.23' },
            { time: '2026-01-05 14:15:42', user: 'contractor_456', action: 'Progress report uploaded', resource: 'PRJ-2025-0034', ip: '172.16.0.88' },
            { time: '2026-01-05 14:02:11', user: 'system', action: 'Compliance check completed', resource: 'VND-2024-0567', ip: 'internal' },
            { time: '2026-01-05 13:58:33', user: 'logistics_78', action: 'Delivery confirmed', resource: 'SHP-2026-0234', ip: '192.168.2.101' },
          ].map((log, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#6E7681]">{log.time}</span>
                <span className="text-sm font-medium">{log.action}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#8B949E]">
                <span>User: {log.user}</span>
                <span>Resource: {log.resource}</span>
                <span>IP: {log.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="bg-gradient-to-r from-[#00A3FF]/10 to-[#A371F7]/10 border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔗</div>
          <div>
            <h3 className="font-semibold mb-2">Blockchain Verification</h3>
            <p className="text-sm text-[#8B949E] mb-4">
              All audit logs are anchored to Prometheus blockchain every 15 minutes. 
              Merkle tree roots provide tamper-proof verification for donors and auditors.
            </p>
            <div className="bg-[#0D1117] rounded-lg p-4 font-mono text-xs">
              <div className="text-[#8B949E]">Latest anchor:</div>
              <div className="text-[#00A3FF] break-all">0x7f8b3a2c...4d5e6f (Block #12,847,293)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// API TIERS SECTION
// ============================================
function APITiersSection({ 
  selected, 
  setSelected 
}: { 
  selected: APITier; 
  setSelected: (tier: APITier) => void;
}) {
  const tier = API_TIERS[selected];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">API Partner Tiers</h2>
        <p className="text-[#8B949E]">
          Progressive access model from sandbox development through staging to production.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.values(API_TIERS).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`p-6 rounded-xl text-left transition-all ${
              selected === t.id
                ? 'border-2'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
            style={selected === t.id ? { borderColor: t.color, backgroundColor: `${t.color}10` } : {}}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{ backgroundColor: `${t.color}20` }}
            >
              {t.id === 'sandbox' ? '🧪' : t.id === 'staging' ? '🔄' : '🚀'}
            </div>
            <h3 className="text-lg font-bold mb-2">{t.title}</h3>
            <p className="text-sm text-[#8B949E] mb-4">{t.description}</p>
            <div 
              className="text-xs px-2 py-1 rounded inline-block"
              style={{ backgroundColor: `${t.color}20`, color: t.color }}
            >
              {t.sla}
            </div>
          </button>
        ))}
      </div>

      {/* Tier Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">{tier.title} Details</h3>
          <div className="space-y-4">
            {[
              { label: 'Access', value: tier.access },
              { label: 'Rate Limit', value: tier.rateLimit },
              { label: 'Data Scope', value: tier.dataScope },
              { label: 'SLA', value: tier.sla },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#1F242C]">
                <span className="text-sm text-[#8B949E]">{item.label}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span style={{ color: tier.color }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Requirements</h4>
            <ul className="space-y-2">
              {tier.requirements.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span className="text-[#F59E0B]">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Progression Path */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">API Access Progression</h3>
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              API ACCESS PROGRESSION PATH                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐                         │
│   │   SANDBOX   │────────> │   STAGING   │────────> │ PRODUCTION  │                         │
│   │     🧪      │          │     🔄      │          │     🚀      │                         │
│   │             │          │             │          │             │                         │
│   │ • Test Data │          │ • Real Data │          │ • Live Data │                         │
│   │ • No SLA    │          │ • 99% SLA   │          │ • 99.9% SLA │                         │
│   │ • Self-serv │          │ • Approval  │          │ • Contract  │                         │
│   └─────────────┘          └─────────────┘          └─────────────┘                         │
│         │                        │                        │                                  │
│         │                        │                        │                                  │
│         ▼                        ▼                        ▼                                  │
│   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐                         │
│   │ GATE 1      │          │ GATE 2      │          │ GATE 3      │                         │
│   │             │          │             │          │             │                         │
│   │ • Terms     │          │ • Security  │          │ • Legal     │                         │
│   │   accepted  │          │   assessment│          │   agreement │                         │
│   │ • Dev acct  │          │ • Int. plan │          │ • Audit     │                         │
│   │   created   │          │   approved  │          │   passed    │                         │
│   └─────────────┘          └─────────────┘          └─────────────┘                         │
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>
    </div>
  );
}
