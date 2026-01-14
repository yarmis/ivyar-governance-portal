"use client";

import { useState } from "react";
import Link from "next/link";
import AutopilotWidget from "@/components/AutopilotWidget"; // ← Додати цей рядок!

// Types

// Types
type DonorType = 'multilateral' | 'bilateral' | 'foundation' | 'corporate';
type ProjectPhase = 'planning' | 'procurement' | 'implementation' | 'monitoring' | 'completed';
type ComplianceStatus = 'compliant' | 'minor_issues' | 'major_issues' | 'under_review';

interface Donor {
  id: string; name: string; shortName: string; type: DonorType; country: string;
  totalPledged: number; totalDisbursed: number; activeProjects: number; complianceRating: number;
  focusAreas: string[];
}

interface Project {
  id: string; name: string; donorName: string; donorShort: string; sector: string; state: string;
  budget: number; utilized: number; utilizationRate: number; phase: ProjectPhase;
  beneficiaries: number; complianceStatus: ComplianceStatus;
}

// Mock Data
const DONORS: Donor[] = [
  { id: 'd1', name: 'World Bank', shortName: 'WB', type: 'multilateral', country: 'International', totalPledged: 500000000, totalDisbursed: 320000000, activeProjects: 12, complianceRating: 94, focusAreas: ['Infrastructure', 'Energy', 'Public Administration'] },
  { id: 'd2', name: 'EBRD', shortName: 'EBRD', type: 'multilateral', country: 'International', totalPledged: 350000000, totalDisbursed: 180000000, activeProjects: 8, complianceRating: 91, focusAreas: ['Transport', 'Municipal', 'Energy Efficiency'] },
  { id: 'd3', name: 'European Investment Bank', shortName: 'EIB', type: 'multilateral', country: 'EU', totalPledged: 280000000, totalDisbursed: 145000000, activeProjects: 6, complianceRating: 96, focusAreas: ['Housing', 'Social', 'Digital'] },
  { id: 'd4', name: 'USAID', shortName: 'USAID', type: 'bilateral', country: 'USA', totalPledged: 200000000, totalDisbursed: 125000000, activeProjects: 15, complianceRating: 89, focusAreas: ['Governance', 'Anti-corruption'] },
  { id: 'd5', name: 'JICA', shortName: 'JICA', type: 'bilateral', country: 'Japan', totalPledged: 150000000, totalDisbursed: 85000000, activeProjects: 5, complianceRating: 98, focusAreas: ['Reconstruction', 'Healthcare'] },
  { id: 'd6', name: 'KfW', shortName: 'KfW', type: 'bilateral', country: 'Germany', totalPledged: 180000000, totalDisbursed: 95000000, activeProjects: 7, complianceRating: 93, focusAreas: ['Energy', 'Water'] },
];

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Kharkiv School Reconstruction', donorName: 'World Bank', donorShort: 'WB', sector: 'Education', state: 'New York', budget: 35000000, utilized: 28500000, utilizationRate: 81, phase: 'implementation', beneficiaries: 15000, complianceStatus: 'compliant' },
  { id: 'p2', name: 'Texas Energy Grid Modernization', donorName: 'World Bank', donorShort: 'WB', sector: 'Energy', state: 'Texas', budget: 85000000, utilized: 52000000, utilizationRate: 61, phase: 'implementation', beneficiaries: 500000, complianceStatus: 'compliant' },
  { id: 'p3', name: 'Odesa Port Facilities', donorName: 'World Bank', donorShort: 'WB', sector: 'Transport', state: 'California', budget: 65000000, utilized: 18000000, utilizationRate: 28, phase: 'implementation', beneficiaries: 50000, complianceStatus: 'under_review' },
  { id: 'p4', name: 'Dnipro Water System', donorName: 'EBRD', donorShort: 'EBRD', sector: 'Water', state: 'Dnipro', budget: 45000000, utilized: 32000000, utilizationRate: 71, phase: 'implementation', beneficiaries: 250000, complianceStatus: 'compliant' },
  { id: 'p5', name: 'Lviv Hospital Modernization', donorName: 'JICA', donorShort: 'JICA', sector: 'Healthcare', state: 'California', budget: 28000000, utilized: 22000000, utilizationRate: 79, phase: 'implementation', beneficiaries: 120000, complianceStatus: 'compliant' },
];

// Config
const TYPE_CONFIG: Record<DonorType, { label: string; icon: string; color: string }> = {
  multilateral: { label: 'Multilateral', icon: '🌐', color: '#3B82F6' },
  bilateral: { label: 'Bilateral', icon: '🤝', color: '#10B981' },
  foundation: { label: 'Foundation', icon: '🏛️', color: '#8B5CF6' },
  corporate: { label: 'Corporate', icon: '🏢', color: '#F59E0B' },
};

const PHASE_CONFIG: Record<ProjectPhase, { label: string; color: string; bg: string }> = {
  planning: { label: 'Planning', color: '#6B7280', bg: '#F3F4F6' },
  procurement: { label: 'Procurement', color: '#F59E0B', bg: '#FEF3C7' },
  implementation: { label: 'Implementation', color: '#3B82F6', bg: '#DBEAFE' },
  monitoring: { label: 'Monitoring', color: '#8B5CF6', bg: '#EDE9FE' },
  completed: { label: 'Completed', color: '#10B981', bg: '#D1FAE5' },
};

const COMPLIANCE_CONFIG: Record<ComplianceStatus, { label: string; color: string; bg: string; icon: string }> = {
  compliant: { label: 'Compliant', color: '#10B981', bg: '#D1FAE5', icon: '✅' },
  minor_issues: { label: 'Minor Issues', color: '#F59E0B', bg: '#FEF3C7', icon: '⚠️' },
  major_issues: { label: 'Major Issues', color: '#F97316', bg: '#FFEDD5', icon: '🚨' },
  under_review: { label: 'Under Review', color: '#6B7280', bg: '#F3F4F6', icon: '🔍' },
};

const formatCurrency = (amount: number, short = false) => {
  if (short) {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`;
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

export default function DonorPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'projects' | 'transparency'>('overview');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const metrics = {
    totalPledged: DONORS.reduce((s, d) => s + d.totalPledged, 0),
    totalDisbursed: DONORS.reduce((s, d) => s + d.totalDisbursed, 0),
    totalUtilized: PROJECTS.reduce((s, p) => s + p.utilized, 0),
    activeProjects: PROJECTS.filter(p => p.phase === 'implementation').length,
    totalBeneficiaries: PROJECTS.reduce((s, p) => s + p.beneficiaries, 0),
    avgCompliance: Math.round(DONORS.reduce((s, d) => s + d.complianceRating, 0) / DONORS.length),
  };

  const disbursementRate = Math.round((metrics.totalDisbursed / metrics.totalPledged) * 100);
  const utilizationRate = Math.round((metrics.totalUtilized / metrics.totalDisbursed) * 100);

  const sectors = [...new Set(PROJECTS.map(p => p.sector))];
  const filteredProjects = sectorFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.sector === sectorFilter);

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#E2E8F0', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/construction" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
            <div style={{ width: '1px', height: '24px', background: '#475569' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                💰 Donor Portal
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>Transparency & Fund Tracking</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { const data = `Donor Dashboard Report\nGenerated: ${new Date().toLocaleString()}\n\nTotal Projects: ${PROJECTS.length}\nTotal Donors: ${DONORS.length}\n\nThis is a demo export.`; const blob = new Blob([data], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'donor-report.txt'; a.click(); }} style={{ padding: '8px 16px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer' }}>
              📊 Export Report
            </button>
            <button onClick={() => setShowSubmitModal(true)} style={{ padding: '8px 16px', background: '#10B981', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              📄 Submit Report
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px' }}>
          {(['overview', 'donors', 'projects', 'transparency'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 20px', background: activeTab === tab ? '#334155' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid #10B981' : '2px solid transparent',
              color: activeTab === tab ? '#E2E8F0' : '#94A3B8', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textTransform: 'capitalize',
            }}>{tab}</button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Top Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Pledged', value: formatCurrency(metrics.totalPledged, true), icon: '🎯', color: '#3B82F6' },
                { label: 'Disbursed', value: formatCurrency(metrics.totalDisbursed, true), sub: `${disbursementRate}%`, icon: '💵', color: '#10B981' },
                { label: 'Utilized', value: formatCurrency(metrics.totalUtilized, true), sub: `${utilizationRate}%`, icon: '📊', color: '#8B5CF6' },
                { label: 'Active Projects', value: metrics.activeProjects, icon: '🏗️', color: '#F59E0B' },
                { label: 'Beneficiaries', value: `${(metrics.totalBeneficiaries / 1000).toFixed(0)}K+`, icon: '👥', color: '#EC4899' },
                { label: 'Avg Compliance', value: `${metrics.avgCompliance}%`, icon: '✅', color: metrics.avgCompliance >= 90 ? '#10B981' : '#F59E0B' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700, color: m.color }}>{m.value}</p>
                      {m.sub && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>of total</p>}
                    </div>
                    <span style={{ fontSize: '28px' }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Donors + Sector Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Top Donors */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Top Donors by Contribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {DONORS.sort((a, b) => b.totalPledged - a.totalPledged).slice(0, 5).map(d => {
                    const typeCfg = TYPE_CONFIG[d.type];
                    const pct = Math.round((d.totalPledged / metrics.totalPledged) * 100);
                    return (
                      <div key={d.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '18px' }}>{typeCfg.icon}</span>
                              <span style={{ fontWeight: 600 }}>{d.shortName}</span>
                              <span style={{ fontSize: '12px', color: '#64748B' }}>{d.country}</span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>{d.activeProjects} active projects</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#10B981' }}>{formatCurrency(d.totalPledged, true)}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>{pct}% of total</p>
                          </div>
                        </div>
                        <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.round((d.totalDisbursed / d.totalPledged) * 100)}%`, background: '#10B981', borderRadius: '3px' }} />
                        </div>
                        <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#64748B' }}>
                          {formatCurrency(d.totalDisbursed, true)} disbursed ({Math.round((d.totalDisbursed / d.totalPledged) * 100)}%)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* By Sector */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Funding by Sector</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sectors.map(sector => {
                    const sectorProjects = PROJECTS.filter(p => p.sector === sector);
                    const sectorBudget = sectorProjects.reduce((s, p) => s + p.budget, 0);
                    const sectorUtilized = sectorProjects.reduce((s, p) => s + p.utilized, 0);
                    return (
                      <div key={sector} style={{ background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 500, fontSize: '14px' }}>{sector}</span>
                          <span style={{ fontWeight: 600, color: '#10B981' }}>{formatCurrency(sectorBudget, true)}</span>
                        </div>
                        <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.round((sectorUtilized / sectorBudget) * 100)}%`, background: '#3B82F6' }} />
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748B' }}>{sectorProjects.length} project(s) • {Math.round((sectorUtilized / sectorBudget) * 100)}% utilized</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Active Projects</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                {PROJECTS.filter(p => p.phase === 'implementation').slice(0, 4).map(p => {
                  const phaseCfg = PHASE_CONFIG[p.phase];
                  const compCfg = COMPLIANCE_CONFIG[p.complianceStatus];
                  return (
                    <div key={p.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{p.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>{p.donorShort} • {p.oblast}</p>
                        </div>
                        <span style={{ fontSize: '16px' }}>{compCfg.icon}</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: '#94A3B8' }}>Utilization</span>
                          <span style={{ fontWeight: 600 }}>{p.utilizationRate}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.utilizationRate}%`, background: p.utilizationRate >= 70 ? '#10B981' : p.utilizationRate >= 50 ? '#F59E0B' : '#3B82F6' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8' }}>
                        <span>Budget: {formatCurrency(p.budget, true)}</span>
                        <span>{p.beneficiaries.toLocaleString()} beneficiaries</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Donors Tab */}
        {activeTab === 'donors' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {DONORS.map(d => {
              const typeCfg = TYPE_CONFIG[d.type];
              const disbPct = Math.round((d.totalDisbursed / d.totalPledged) * 100);
              return (
                <div key={d.id} style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '24px' }}>{typeCfg.icon}</span>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{d.shortName}</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{d.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>{d.country}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                          background: d.complianceRating >= 95 ? '#D1FAE5' : d.complianceRating >= 90 ? '#FEF3C7' : '#FEE2E2',
                          color: d.complianceRating >= 95 ? '#10B981' : d.complianceRating >= 90 ? '#F59E0B' : '#EF4444',
                        }}>{d.complianceRating}% ✓</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ background: '#0F172A', padding: '10px', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>Pledged</p>
                        <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: '#3B82F6' }}>{formatCurrency(d.totalPledged, true)}</p>
                      </div>
                      <div style={{ background: '#0F172A', padding: '10px', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>Disbursed</p>
                        <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: '#10B981' }}>{formatCurrency(d.totalDisbursed, true)}</p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#94A3B8' }}>Disbursement Progress</span>
                        <span style={{ fontWeight: 500 }}>{disbPct}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${disbPct}%`, background: `linear-gradient(90deg, #3B82F6, #10B981)` }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      {d.focusAreas.map((area, i) => (
                        <span key={i} style={{ padding: '4px 8px', background: '#0F172A', borderRadius: '4px', fontSize: '11px', color: '#94A3B8' }}>{area}</span>
                      ))}
                    </div>

                    <div style={{ paddingTop: '12px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#94A3B8' }}>{d.activeProjects} active projects</span>
                      <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View Details</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
                style={{ padding: '10px 14px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}>
                <option value="all">All Sectors</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Project', 'Donor', 'Sector', 'State', 'Budget', 'Utilized', 'Rate', 'Beneficiaries', 'Compliance', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p, i) => {
                    const compCfg = COMPLIANCE_CONFIG[p.complianceStatus];
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '12px', fontWeight: 500, fontSize: '13px' }}>{p.name}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{p.donorShort}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{p.sector}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{p.oblast}</td>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{formatCurrency(p.budget, true)}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{formatCurrency(p.utilized, true)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600,
                            background: p.utilizationRate >= 70 ? '#D1FAE5' : p.utilizationRate >= 50 ? '#FEF3C7' : '#DBEAFE',
                            color: p.utilizationRate >= 70 ? '#10B981' : p.utilizationRate >= 50 ? '#F59E0B' : '#3B82F6',
                          }}>{p.utilizationRate}%</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{p.beneficiaries.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: compCfg.bg, color: compCfg.color }}>
                            {compCfg.icon} {compCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Transparency Tab */}
        {activeTab === 'transparency' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Upcoming Reports */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>📅 Upcoming Deadlines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { type: 'Q4 Report', donor: 'World Bank', date: '2025-01-31', status: 'due_soon' },
                    { type: 'Semi-annual Report', donor: 'EBRD', date: '2025-02-15', status: 'upcoming' },
                    { type: 'Annual Audit', donor: 'USAID', date: '2025-03-01', status: 'upcoming' },
                  ].map((d, i) => (
                    <div key={i} style={{ background: '#0F172A', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{d.type}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>{d.donor}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '13px', color: d.status === 'due_soon' ? '#F59E0B' : '#94A3B8' }}>{d.date}</p>
                        <span style={{
                          padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
                          background: d.status === 'due_soon' ? '#FEF3C7' : '#F3F4F6',
                          color: d.status === 'due_soon' ? '#F59E0B' : '#6B7280',
                        }}>{d.status === 'due_soon' ? 'Due Soon' : 'Upcoming'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Summary */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>✅ Compliance Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(COMPLIANCE_CONFIG).map(([status, cfg]) => {
                    const count = PROJECTS.filter(p => p.complianceStatus === status).length;
                    return (
                      <div key={status} style={{ background: '#0F172A', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
                          <span style={{ fontSize: '14px' }}>{cfg.label}</span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '18px', color: cfg.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Public Data */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🌐 Public Transparency Data</h3>
              <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#94A3B8' }}>
                All project data, financial reports, and procurement information are publicly accessible in compliance with donor requirements.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Financial Reports', icon: '📊', count: 24 },
                  { label: 'Audit Reports', icon: '🔍', count: 6 },
                  { label: 'Procurement Records', icon: '📋', count: 45 },
                  { label: 'Project Documents', icon: '📄', count: 128 },
                ].map((d, i) => (
                  <button key={i} style={{ padding: '12px 20px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{d.icon}</span>
                    <span>{d.label}</span>
                    <span style={{ background: '#334155', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{d.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      {/* Submit Report Modal */}
      </main>

      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowSubmitModal(false)}>
          <div style={{ background: '#1E293B', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '90%', border: '1px solid #334155' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', marginBottom: '1.5rem', color: '#E2E8F0' }}>📄 Submit Compliance Report</h2>
            <button type="button" onClick={() => setShowSubmitModal(false)} style={{ padding: '0.75rem 1.5rem', background: '#10B981', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Close & Submit Demo</button>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AutopilotWidget module="donors" />
    </div>
  );
}
