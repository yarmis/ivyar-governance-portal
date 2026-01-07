"use client";

import { useState } from "react";

// Types
type PermitStatus = 'submitted' | 'under_review' | 'approved' | 'issued' | 'inspection_scheduled' | 'final' | 'expired';
type FloodZone = 'A' | 'AE' | 'V' | 'VE' | 'X' | 'X500' | 'D';

interface Permit {
  id: string;
  permitNumber: string;
  type: string;
  status: PermitStatus;
  projectName: string;
  address: string;
  applicant: string;
  contractor: string;
  value: number;
  submitDate: string;
  occupancy: string;
  sqft: number;
}

interface Parcel {
  id: string;
  apn: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zone: string;
  zoneName: string;
  lotSize: number;
  assessedValue: number;
  floodZone: FloodZone;
  owner: string;
}

interface FEMAProject {
  id: string;
  disasterNumber: string;
  projectNumber: string;
  applicant: string;
  title: string;
  category: string;
  obligated: number;
  status: string;
  county: string;
  state: string;
}

// Mock Data
const PERMITS: Permit[] = [
  { id: '1', permitNumber: 'BP-2025-00142', type: 'Building', status: 'under_review', projectName: 'Main Street Shopping Center Expansion', address: '1234 Main St, Springfield, MO', applicant: 'Smith Architecture', contractor: 'Johnson Construction', value: 2500000, submitDate: '2025-01-02', occupancy: 'M (Mercantile)', sqft: 15000 },
  { id: '2', permitNumber: 'BP-2025-00138', type: 'Building', status: 'approved', projectName: 'Oak Avenue Apartments', address: '567 Oak Ave, Miami, FL', applicant: 'Coastal Design Group', contractor: 'Atlantic Builders', value: 8500000, submitDate: '2024-12-15', occupancy: 'R-2 (Residential)', sqft: 45000 },
  { id: '3', permitNumber: 'EP-2025-00089', type: 'Electrical', status: 'issued', projectName: 'Solar Panel Installation', address: '890 Sunset Blvd, Phoenix, AZ', applicant: 'SunPower Solutions', contractor: 'Desert Electric', value: 125000, submitDate: '2024-12-20', occupancy: 'R-3 (Residential)', sqft: 2500 },
  { id: '4', permitNumber: 'BP-2025-00145', type: 'Building', status: 'submitted', projectName: 'Community Center Renovation', address: '200 Civic Center Dr, Austin, TX', applicant: 'City of Austin', contractor: 'TBD', value: 4200000, submitDate: '2025-01-05', occupancy: 'A-3 (Assembly)', sqft: 28000 },
];

const PARCELS: Parcel[] = [
  { id: '1', apn: '123-456-789-000', address: '1234 Main Street', city: 'Springfield', county: 'Greene', state: 'MO', zone: 'C-3', zoneName: 'Regional Commercial', lotSize: 87120, assessedValue: 2500000, floodZone: 'X', owner: 'Springfield Development LLC' },
  { id: '2', apn: '234-567-890-001', address: '567 Oak Avenue', city: 'Miami', county: 'Miami-Dade', state: 'FL', zone: 'R-3', zoneName: 'Multi-Family Residential', lotSize: 25000, assessedValue: 1800000, floodZone: 'AE', owner: 'Coastal Properties Trust' },
  { id: '3', apn: '345-678-901-002', address: '890 Industrial Pkwy', city: 'Houston', county: 'Harris', state: 'TX', zone: 'I-1', zoneName: 'Light Industrial', lotSize: 150000, assessedValue: 3200000, floodZone: 'X500', owner: 'Houston Logistics Inc' },
];

const FEMA_PROJECTS: FEMAProject[] = [
  { id: '1', disasterNumber: 'DR-4806', projectNumber: 'PA-08-FL-4806-PW-00125', applicant: 'Miami-Dade County', title: 'Emergency Debris Removal', category: 'A', obligated: 12500000, status: 'in_progress', county: 'Miami-Dade', state: 'FL' },
  { id: '2', disasterNumber: 'DR-4806', projectNumber: 'PA-08-FL-4806-PW-00186', applicant: 'City of Miami Beach', title: 'Beach Erosion Emergency Repairs', category: 'B', obligated: 8200000, status: 'obligated', county: 'Miami-Dade', state: 'FL' },
  { id: '3', disasterNumber: 'DR-4798', projectNumber: 'PA-07-MO-4798-PW-00045', applicant: 'Greene County', title: 'School Building Reconstruction', category: 'E', obligated: 4500000, status: 'in_progress', county: 'Greene', state: 'MO' },
];

// Config
const PERMIT_STATUS_CONFIG: Record<PermitStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: '#FEF3C7' },
  approved: { label: 'Approved', color: '#10B981', bg: '#D1FAE5' },
  issued: { label: 'Issued', color: '#059669', bg: '#D1FAE5' },
  inspection_scheduled: { label: 'Inspection', color: '#8B5CF6', bg: '#EDE9FE' },
  final: { label: 'Finaled', color: '#059669', bg: '#D1FAE5' },
  expired: { label: 'Expired', color: '#6B7280', bg: '#F3F4F6' },
};

const FLOOD_ZONE_CONFIG: Record<FloodZone, { label: string; risk: string; color: string }> = {
  A: { label: 'Zone A', risk: 'High', color: '#DC2626' },
  AE: { label: 'Zone AE', risk: 'High', color: '#DC2626' },
  V: { label: 'Zone V', risk: 'Coastal High', color: '#7C2D12' },
  VE: { label: 'Zone VE', risk: 'Coastal High', color: '#7C2D12' },
  X: { label: 'Zone X', risk: 'Minimal', color: '#10B981' },
  X500: { label: 'Zone X (Shaded)', risk: 'Moderate', color: '#F59E0B' },
  D: { label: 'Zone D', risk: 'Undetermined', color: '#6B7280' },
};

const BUILDING_CODES = [
  { code: 'IBC', name: 'International Building Code', edition: '2021', color: '#3B82F6' },
  { code: 'IRC', name: 'International Residential Code', edition: '2021', color: '#10B981' },
  { code: 'IFC', name: 'International Fire Code', edition: '2021', color: '#EF4444' },
  { code: 'NEC', name: 'National Electrical Code', edition: '2023', color: '#F59E0B' },
  { code: 'ADA', name: 'Americans with Disabilities Act', edition: '2010', color: '#6366F1' },
  { code: 'OSHA', name: 'Occupational Safety & Health', edition: '29 CFR', color: '#EC4899' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

const formatNumber = (num: number) => num.toLocaleString('en-US');

export default function USConstructionHubPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'permits' | 'parcels' | 'fema' | 'codes'>('overview');

  const metrics = {
    totalPermits: PERMITS.length,
    underReview: PERMITS.filter(p => p.status === 'under_review').length,
    totalValue: PERMITS.reduce((s, p) => s + p.value, 0),
    avgReviewDays: 12,
    totalParcels: PARCELS.length,
    highRiskFlood: PARCELS.filter(p => ['A', 'AE', 'V', 'VE'].includes(p.floodZone)).length,
    femaObligated: FEMA_PROJECTS.reduce((s, p) => s + p.obligated, 0),
    activeDisasters: 2,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#E2E8F0', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)', borderBottom: '1px solid #334155', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #DC2626, #1E40AF)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                🇺🇸
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>
                  US Construction Governance Hub
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>
                  IBC/IRC Codes • County Permits • FEMA Compliance
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ padding: '10px 20px', background: '#334155', border: 'none', borderRadius: '8px', color: '#E2E8F0', cursor: 'pointer', fontSize: '14px' }}>
                📍 Select Jurisdiction
              </button>
              <button style={{ padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                + New Permit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px' }}>
          {(['overview', 'permits', 'parcels', 'fema', 'codes'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '14px 24px', background: activeTab === tab ? '#334155' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent',
              color: activeTab === tab ? '#E2E8F0' : '#94A3B8', cursor: 'pointer', fontSize: '14px', fontWeight: 500, textTransform: 'capitalize',
            }}>{tab === 'fema' ? 'FEMA Compliance' : tab === 'codes' ? 'Building Codes' : tab}</button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Active Permits', value: metrics.totalPermits, sub: `${metrics.underReview} under review`, icon: '📋', color: '#3B82F6' },
                { label: 'Permit Value', value: formatCurrency(metrics.totalValue), sub: `Avg review: ${metrics.avgReviewDays} days`, icon: '💰', color: '#10B981' },
                { label: 'FEMA Obligated', value: formatCurrency(metrics.femaObligated), sub: `${metrics.activeDisasters} active disasters`, icon: '🏛️', color: '#8B5CF6' },
                { label: 'Flood Risk Parcels', value: metrics.highRiskFlood, sub: `of ${metrics.totalParcels} total parcels`, icon: '🌊', color: metrics.highRiskFlood > 0 ? '#F59E0B' : '#10B981' },
              ].map((m, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', borderRadius: '12px', padding: '20px', border: '1px solid #475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                      <p style={{ margin: '8px 0 4px', fontSize: '28px', fontWeight: 700, color: m.color }}>{m.value}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{m.sub}</p>
                    </div>
                    <span style={{ fontSize: '32px' }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Building Codes + Recent Permits */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
              {/* Adopted Codes */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>📚 Adopted Building Codes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {BUILDING_CODES.map(code => (
                    <div key={code.code} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${code.color}20`, color: code.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                          {code.code}
                        </span>
                        <div>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{code.name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>{code.edition}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#10B981' }}>✓ Active</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Permits */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>📋 Recent Permit Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PERMITS.slice(0, 4).map(permit => {
                    const statusCfg = PERMIT_STATUS_CONFIG[permit.status];
                    return (
                      <div key={permit.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 600, fontSize: '14px' }}>{permit.permitNumber}</span>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: '#334155', color: '#94A3B8' }}>{permit.type}</span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94A3B8' }}>{permit.projectName}</p>
                          </div>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                          <span>{permit.address}</span>
                          <span style={{ fontWeight: 500, color: '#10B981' }}>{formatCurrency(permit.value)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FEMA + Flood Zones */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* FEMA Disasters */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🏛️ Active FEMA Disaster Declarations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { number: 'DR-4806', type: 'Hurricane', state: 'FL', date: 'Aug 2024', obligated: 850000000, projects: 45 },
                    { number: 'DR-4798', type: 'Tornado', state: 'MO', date: 'May 2024', obligated: 125000000, projects: 18 },
                  ].map((d, i) => (
                    <div key={i} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px', borderLeft: '3px solid #3B82F6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '15px' }}>{d.number}</span>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: '#334155' }}>{d.type}</span>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>{d.state}</span>
                          </div>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94A3B8' }}>Declared: {d.date} • {d.projects} projects</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#10B981' }}>{formatCurrency(d.obligated)}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>Federal obligated</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flood Zone Summary */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🌊 Flood Zone Risk Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(FLOOD_ZONE_CONFIG).slice(0, 5).map(([zone, cfg]) => {
                    const count = PARCELS.filter(p => p.floodZone === zone).length;
                    return (
                      <div key={zone} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${cfg.color}20`, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>
                            {zone}
                          </span>
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{cfg.label}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>{cfg.risk} Risk</p>
                          </div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '16px', color: cfg.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Permits Tab */}
        {activeTab === 'permits' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['Permit #', 'Type', 'Project', 'Address', 'Occupancy', 'Sq Ft', 'Value', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMITS.map((p, i) => {
                  const statusCfg = PERMIT_STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '12px', fontWeight: 600, fontSize: '13px' }}>{p.permitNumber}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{p.type}</td>
                      <td style={{ padding: '12px', fontSize: '13px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.projectName}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#94A3B8' }}>{p.address}</td>
                      <td style={{ padding: '12px', fontSize: '12px' }}>{p.occupancy}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{formatNumber(p.sqft)}</td>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500, color: '#10B981' }}>{formatCurrency(p.value)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>{statusCfg.label}</span>
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
        )}

        {/* Parcels Tab */}
        {activeTab === 'parcels' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['APN', 'Address', 'City/County', 'Zone', 'Lot Size', 'Assessed Value', 'Flood Zone', 'Owner', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARCELS.map((p, i) => {
                  const floodCfg = FLOOD_ZONE_CONFIG[p.floodZone];
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '12px', fontWeight: 600, fontSize: '13px', fontFamily: 'monospace' }}>{p.apn}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{p.address}</td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#94A3B8' }}>{p.city}, {p.county} Co., {p.state}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.zone}</span>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>{p.zoneName}</p>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{formatNumber(p.lotSize)} sf</td>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{formatCurrency(p.assessedValue)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: `${floodCfg.color}20`, color: floodCfg.color }}>
                          {floodCfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.owner}</td>
                      <td style={{ padding: '12px' }}>
                        <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* FEMA Tab */}
        {activeTab === 'fema' && (
          <>
            {/* FEMA Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Active Disasters', value: '2', icon: '🌀', color: '#EF4444' },
                { label: 'Total Obligated', value: formatCurrency(metrics.femaObligated), icon: '💰', color: '#10B981' },
                { label: 'Active Projects', value: FEMA_PROJECTS.length.toString(), icon: '📋', color: '#3B82F6' },
                { label: 'Counties Affected', value: '8', icon: '📍', color: '#F59E0B' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px' }}>{m.icon}</span>
                  <p style={{ margin: '8px 0 4px', fontSize: '24px', fontWeight: 700, color: m.color }}>{m.value}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* FEMA Projects */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>FEMA Public Assistance Projects</h3>
                <button style={{ padding: '8px 16px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '13px' }}>
                  📊 Export to FEMA Grants Portal
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Disaster #', 'Project #', 'Applicant', 'Title', 'Category', 'Obligated', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEMA_PROJECTS.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '12px', fontWeight: 600, fontSize: '13px' }}>{p.disasterNumber}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontFamily: 'monospace', color: '#94A3B8' }}>{p.projectNumber}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{p.applicant}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{p.title}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: '#334155' }}>Cat {p.category}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: '#10B981' }}>{formatCurrency(p.obligated)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: '#DBEAFE', color: '#3B82F6' }}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {BUILDING_CODES.map(code => (
              <div key={code.code} style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                <div style={{ height: '4px', background: code.color }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ width: '56px', height: '56px', borderRadius: '12px', background: `${code.color}20`, color: code.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
                      {code.code}
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{code.name}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>Edition: {code.edition}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '13px' }}>
                      📖 View Code
                    </button>
                    <button style={{ flex: 1, padding: '10px', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '13px' }}>
                      📋 Amendments
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '20px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🇺🇸</span>
            <span>US Construction Governance Hub v1.0</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>IBC 2021</span>
            <span>•</span>
            <span>FEMA Compliant</span>
            <span>•</span>
            <span>ADA Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
