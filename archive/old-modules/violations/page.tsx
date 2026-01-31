"use client";

import Link from "next/link";
import { useState } from "react";
import AutopilotWidget from "@/components/AutopilotWidget";
// Types
type ViolationType = 'building_code' | 'zoning' | 'environmental' | 'safety' | 'permit' | 'documentation' | 'labor' | 'quality';
type ViolationSeverity = 'minor' | 'moderate' | 'major' | 'critical';
type ViolationStatus = 'reported' | 'under_investigation' | 'confirmed' | 'disputed' | 'remediation_required' | 'remediation_in_progress' | 'resolved' | 'escalated' | 'closed';
type FineStatus = 'pending' | 'issued' | 'paid' | 'overdue' | 'contested';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Violation {
  id: string;
  caseNumber: string;
  type: ViolationType;
  severity: ViolationSeverity;
  status: ViolationStatus;
  title: string;
  projectName: string;
  location: string;
  violatorName: string;
  reportedDate: string;
  fineAmount: number;
  fineStatus: FineStatus;
  aiRiskScore: number;
  deadlineDate?: string;
  escalated: boolean;
}

// Mock Data
const VIOLATIONS: Violation[] = [
  { id: 'v1', caseNumber: 'VIO-2025-0001', type: 'building_code', severity: 'major', status: 'remediation_required', title: 'Structural Wall Modification Without Permit', projectName: 'Manhattan Business Tower', location: '450 5th Avenue, NYC', violatorName: 'Manhattan Development LLC', reportedDate: '2025-01-03', fineAmount: 85000, fineStatus: 'issued', aiRiskScore: 75, deadlineDate: '2025-02-15', escalated: false },
  { id: 'v2', caseNumber: 'VIO-2025-0002', type: 'environmental', severity: 'critical', status: 'escalated', title: 'Illegal Waste Disposal', projectName: 'Chicago Industrial Complex', location: '1200 W Fulton St, Chicago', violatorName: 'Industrial Holdings JSC', reportedDate: '2025-01-02', fineAmount: 250000, fineStatus: 'contested', aiRiskScore: 92, escalated: true },
  { id: 'v3', caseNumber: 'VIO-2024-0156', type: 'safety', severity: 'moderate', status: 'resolved', title: 'Missing Safety Equipment', projectName: 'Brooklyn Heights Residential', location: '185 Montague St, Brooklyn', violatorName: 'BuildRight Contractors', reportedDate: '2024-12-15', fineAmount: 12500, fineStatus: 'paid', aiRiskScore: 25, escalated: false },
  { id: 'v4', caseNumber: 'VIO-2025-0003', type: 'permit', severity: 'major', status: 'under_investigation', title: 'Construction Without Permit', projectName: 'Unauthorized Development', location: '2500 Main St, Houston', violatorName: 'Quick Build LLC', reportedDate: '2025-01-06', fineAmount: 0, fineStatus: 'pending', aiRiskScore: 60, deadlineDate: '2025-01-09', escalated: false },
  { id: 'v5', caseNumber: 'VIO-2024-0148', type: 'quality', severity: 'minor', status: 'closed', title: 'Substandard Concrete Mix', projectName: 'NYC Subway Expansion', location: 'Second Avenue Line', violatorName: 'ConcretePro Ltd', reportedDate: '2024-11-20', fineAmount: 7500, fineStatus: 'paid', aiRiskScore: 15, escalated: false },
];

// Config
const TYPE_CONFIG: Record<ViolationType, { label: string; icon: string; color: string }> = {
  building_code: { label: 'Building Code', icon: '🏗️', color: '#F59E0B' },
  zoning: { label: 'Zoning', icon: '🗺️', color: '#3B82F6' },
  environmental: { label: 'Environmental', icon: '🌿', color: '#10B981' },
  safety: { label: 'Safety', icon: '⚠️', color: '#EF4444' },
  permit: { label: 'Permit', icon: '📋', color: '#8B5CF6' },
  documentation: { label: 'Documentation', icon: '📄', color: '#6B7280' },
  labor: { label: 'Labor', icon: '👷', color: '#EC4899' },
  quality: { label: 'Quality', icon: '✓', color: '#14B8A6' },
};

const SEVERITY_CONFIG: Record<ViolationSeverity, { label: string; color: string; bg: string }> = {
  minor: { label: 'Minor', color: '#3B82F6', bg: '#DBEAFE' },
  moderate: { label: 'Moderate', color: '#F59E0B', bg: '#FEF3C7' },
  major: { label: 'Major', color: '#F97316', bg: '#FFEDD5' },
  critical: { label: 'Critical', color: '#DC2626', bg: '#FEE2E2' },
};

const STATUS_CONFIG: Record<ViolationStatus, { label: string; color: string; bg: string }> = {
  reported: { label: 'Reported', color: '#3B82F6', bg: '#DBEAFE' },
  under_investigation: { label: 'Investigating', color: '#F59E0B', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmed', color: '#F97316', bg: '#FFEDD5' },
  disputed: { label: 'Disputed', color: '#8B5CF6', bg: '#EDE9FE' },
  remediation_required: { label: 'Remediation Req.', color: '#DC2626', bg: '#FEE2E2' },
  remediation_in_progress: { label: 'In Progress', color: '#F59E0B', bg: '#FEF3C7' },
  resolved: { label: 'Resolved', color: '#10B981', bg: '#D1FAE5' },
  escalated: { label: 'Escalated', color: '#DC2626', bg: '#FEE2E2' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
};

const FINE_CONFIG: Record<FineStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#6B7280', bg: '#F3F4F6' },
  issued: { label: 'Issued', color: '#3B82F6', bg: '#DBEAFE' },
  paid: { label: 'Paid', color: '#10B981', bg: '#D1FAE5' },
  overdue: { label: 'Overdue', color: '#DC2626', bg: '#FEE2E2' },
  contested: { label: 'Contested', color: '#8B5CF6', bg: '#EDE9FE' },
};

export default function ViolationsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'violations' | 'fines' | 'escalations'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredViolations = VIOLATIONS.filter(v => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || v.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const metrics = {
    total: VIOLATIONS.length,
    active: VIOLATIONS.filter(v => !['resolved', 'closed'].includes(v.status)).length,
    escalated: VIOLATIONS.filter(v => v.escalated).length,
    critical: VIOLATIONS.filter(v => v.severity === 'critical').length,
    totalFines: VIOLATIONS.reduce((s, v) => s + v.fineAmount, 0),
    collectedFines: VIOLATIONS.filter(v => v.fineStatus === 'paid').reduce((s, v) => s + v.fineAmount, 0),
    overdueDeadlines: VIOLATIONS.filter(v => v.deadlineDate && new Date(v.deadlineDate) < new Date()).length,
  };

  const collectionRate = metrics.totalFines > 0 ? Math.round((metrics.collectedFines / metrics.totalFines) * 100) : 0;

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
                ⚠️ Violations & Enforcement
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>Violations, Fines & Escalations</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { const data = `Violations Report\nGenerated: ${new Date().toLocaleString()}\n\nTotal Violations: 156\nEscalated: 3\nUnder Review: 12\n\nThis is a demo export.`; const blob = new Blob([data], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'violations-report.txt'; a.click(); }} style={{ padding: '8px 16px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer' }}>
              📊 Export Report
            </button>
            <button onClick={() => alert('📝 Report New Violation\n\nThis would open a form to:\n• Report violation details\n• Upload evidence (photos, documents)\n• Specify location\n• Assign severity\n• Submit to authorities\n\nDemo feature - full form coming soon.')} style={{ padding: '8px 16px', background: '#DC2626', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              + Report Violation
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px' }}>
          {(['overview', 'violations', 'fines', 'escalations'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 20px', background: activeTab === tab ? '#334155' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid #DC2626' : '2px solid transparent',
              color: activeTab === tab ? '#E2E8F0' : '#94A3B8', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textTransform: 'capitalize',
            }}>{tab}</button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Violations', value: metrics.total, icon: '📋', color: '#3B82F6' },
                { label: 'Active Cases', value: metrics.active, icon: '🔍', color: '#F59E0B' },
                { label: 'Escalated', value: metrics.escalated, icon: '🚨', color: metrics.escalated > 0 ? '#DC2626' : '#10B981' },
                { label: 'Critical', value: metrics.critical, icon: '⛔', color: metrics.critical > 0 ? '#DC2626' : '#10B981' },
                { label: 'Total Fines', value: `USD ${(metrics.totalFines / 1000000).toFixed(2)}M`, icon: '💰', color: '#F97316' },
                { label: 'Collected', value: `USD ${(metrics.collectedFines / 1000000).toFixed(2)}M`, icon: '✅', color: '#10B981' },
                { label: 'Collection Rate', value: `${collectionRate}%`, icon: '📈', color: collectionRate >= 70 ? '#10B981' : '#F59E0B' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '26px', fontWeight: 700, color: m.color }}>{m.value}</p>
                    </div>
                    <span style={{ fontSize: '24px' }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* By Type and High Risk */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* By Type */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Violations by Type</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                    const count = VIOLATIONS.filter(v => v.type === type).length;
                    if (count === 0) return null;
                    return (
                      <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0F172A', padding: '10px 12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{cfg.icon}</span>
                        <span style={{ flex: 1, fontSize: '14px' }}>{cfg.label}</span>
                        <span style={{ fontWeight: 600, color: cfg.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* High Risk Violators */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#FCA5A5' }}>🚨 High Risk Violators</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'Industrial Holdings JSC', violations: 5, totalFines: 250000, risk: 'critical' },
                    { name: 'Manhattan Development LLC', violations: 2, totalFines: 85000, risk: 'medium' },
                  ].map((v, i) => (
                    <div key={i} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500 }}>{v.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>{v.violations} violation(s) • USD {v.totalFines.toLocaleString()}</p>
                        </div>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                          background: v.risk === 'critical' ? '#FEE2E2' : '#FEF3C7',
                          color: v.risk === 'critical' ? '#DC2626' : '#F59E0B',
                        }}>{v.risk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Violations */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Recent Violations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {VIOLATIONS.slice(0, 4).map(v => {
                  const typeCfg = TYPE_CONFIG[v.type];
                  const severityCfg = SEVERITY_CONFIG[v.severity];
                  const statusCfg = STATUS_CONFIG[v.status];
                  return (
                    <div key={v.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '24px' }}>{typeCfg.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{v.caseNumber}</span>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: severityCfg.bg, color: severityCfg.color }}>{severityCfg.label}</span>
                          {v.escalated && <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: '#FEE2E2', color: '#DC2626' }}>🚨 Escalated</span>}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94A3B8' }}>{v.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>{v.violatorName} • {v.location}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>{statusCfg.label}</span>
                        {v.fineAmount > 0 && <p style={{ margin: '8px 0 0', fontSize: '14px', fontWeight: 600, color: '#F59E0B' }}>USD {v.fineAmount.toLocaleString()}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Violations Tab */}
        {activeTab === 'violations' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '10px 14px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}>
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
                style={{ padding: '10px 14px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}>
                <option value="all">All Severities</option>
                {Object.entries(SEVERITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            {/* Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Case #', 'Type', 'Title', 'Violator', 'Severity', 'Status', 'Fine', 'AI Risk', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredViolations.map((v, i) => {
                    const typeCfg = TYPE_CONFIG[v.type];
                    const severityCfg = SEVERITY_CONFIG[v.severity];
                    const statusCfg = STATUS_CONFIG[v.status];
                    return (
                      <tr key={v.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '12px', fontWeight: 500, fontSize: '13px' }}>
                          {v.caseNumber}
                          {v.escalated && <span style={{ marginLeft: '6px' }}>🚨</span>}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                            {typeCfg.icon} {typeCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{v.violatorName}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: severityCfg.bg, color: severityCfg.color }}>{severityCfg.label}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>{statusCfg.label}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>
                          {v.fineAmount > 0 ? `USD ${v.fineAmount.toLocaleString()}` : '-'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                            background: v.aiRiskScore >= 75 ? '#FEE2E2' : v.aiRiskScore >= 50 ? '#FEF3C7' : '#D1FAE5',
                            color: v.aiRiskScore >= 75 ? '#DC2626' : v.aiRiskScore >= 50 ? '#F59E0B' : '#10B981',
                          }}>{v.aiRiskScore}%</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => alert('View Violation: ' + v.caseNumber)} style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Fines Tab */}
        {activeTab === 'fines' && (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Issued', value: `USD ${(metrics.totalFines / 1000000).toFixed(2)}M`, color: '#3B82F6' },
                { label: 'Collected', value: `USD ${(metrics.collectedFines / 1000000).toFixed(2)}M`, color: '#10B981' },
                { label: 'Outstanding', value: `USD ${((metrics.totalFines - metrics.collectedFines) / 1000000).toFixed(2)}M`, color: '#F59E0B' },
                { label: 'Collection Rate', value: `${collectionRate}%`, color: collectionRate >= 70 ? '#10B981' : '#EF4444' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700, color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Fines Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Case #', 'Violator', 'Amount', 'Status', 'Issued', 'Due Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VIOLATIONS.filter(v => v.fineAmount > 0).map((v, i) => {
                    const fineCfg = FINE_CONFIG[v.fineStatus];
                    return (
                      <tr key={v.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '12px', fontWeight: 500, fontSize: '13px' }}>{v.caseNumber}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{v.violatorName}</td>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: '#F59E0B' }}>USD {v.fineAmount.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: fineCfg.bg, color: fineCfg.color }}>{fineCfg.label}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#94A3B8' }}>{v.reportedDate}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: '#94A3B8' }}>{v.deadlineDate || '-'}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={(e) => alert(`Details for ${v.caseNumber}

Company: ${v.violatorName}
Fine: ${v.fineAmount.toLocaleString()} USD`)} style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#475569'} onMouseLeave={(e) => e.currentTarget.style.background = '#334155'}>Details</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Escalations Tab */}
        {activeTab === 'escalations' && (
          <>
            {metrics.escalated > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {VIOLATIONS.filter(v => v.escalated).map(v => {
                  const typeCfg = TYPE_CONFIG[v.type];
                  const severityCfg = SEVERITY_CONFIG[v.severity];
                  return (
                    <div key={v.id} style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #DC2626', overflow: 'hidden' }}>
                      <div style={{ background: '#450A0A', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🚨</span>
                        <span style={{ fontWeight: 600, color: '#FCA5A5' }}>ESCALATED - National Level</span>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '20px' }}>{typeCfg.icon}</span>
                              <span style={{ fontWeight: 600, fontSize: '16px' }}>{v.caseNumber}</span>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', background: severityCfg.bg, color: severityCfg.color }}>{severityCfg.label}</span>
                            </div>
                            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600 }}>{v.title}</h3>
                            <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8' }}>
                              {v.violatorName} • {v.location}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#F59E0B' }}>USD {v.fineAmount.toLocaleString()}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>Fine {v.fineStatus}</p>
                          </div>
                        </div>
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                            <strong>Escalated to:</strong> Ministry of Environment • <strong>Status:</strong> In Review
                          </div>
                          <button onClick={() => alert('📋 Full Case Details\n\nViolation ID: VIO-2025-0002\nStatus: Escalated - National Level\nCompany: Industrial Holdings JSC\n\nThis would open a detailed case file with:\n• Full documentation\n• Evidence photos\n• Legal proceedings\n• Communication history\n• Payment status')} style={{ padding: '8px 16px', background: '#DC2626', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
                            View Full Case
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '60px', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ fontSize: '48px' }}>✅</span>
                <h3 style={{ margin: '16px 0 8px', fontSize: '18px', fontWeight: 600, color: '#10B981' }}>No Escalated Cases</h3>
                <p style={{ margin: 0, color: '#94A3B8' }}>All cases are being handled at their assigned levels</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '16px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
          <span>IVYAR Violations Module v1.0</span>
          <span>Construction Governance Hub • Enforcement</span>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget module="violations" />
    </div>
  );
}