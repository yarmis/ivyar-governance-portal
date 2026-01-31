"use client";

import { useState } from "react";
import Link from "next/link";
import AutopilotWidget from "@/components/AutopilotWidget";
// Types
type ZoneType = 'residential' | 'commercial' | 'industrial' | 'mixed_use' | 'agricultural' | 'protected';
type ParcelStatus = 'active' | 'pending_registration' | 'disputed' | 'subdividing' | 'merging' | 'archived';
type PermitStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired';
type RestrictionSeverity = 'advisory' | 'standard' | 'strict' | 'absolute';

interface Zone {
  id: string; code: string; name: string; nameUk: string; type: ZoneType;
  color: string; maxHeight: number; maxStoreys: number; maxCoverage: number;
  area: number; parcelsCount: number;
}

interface Parcel {
  id: string; cadastralNumber: string; address: string; zoneId: string; zoneName: string;
  area: number; status: ParcelStatus; ownershipType: string; ownerName?: string;
  landUse: string; valuationUAH: number; valuationEUR: number;
  aiComplianceScore: number; restrictionCount: number;
}

interface Permit {
  id: string; permitNumber: string; parcelId: string; cadastralNumber: string;
  type: string; status: PermitStatus; projectName: string; applicant: string;
  submittedDate: string; complianceScore: number; violations: string[];
}

// Mock Data
const ZONES: Zone[] = [
  { id: 'zone-001', code: 'R-1', name: 'Residential Low', nameUk: 'Житлова низька', type: 'residential', color: '#FEF3C7', maxHeight: 12, maxStoreys: 3, maxCoverage: 30, area: 450, parcelsCount: 2100 },
  { id: 'zone-002', code: 'R-2', name: 'Residential Medium', nameUk: 'Житлова середня', type: 'residential', color: '#FCD34D', maxHeight: 18, maxStoreys: 5, maxCoverage: 40, area: 245, parcelsCount: 1250 },
  { id: 'zone-003', code: 'R-3', name: 'Residential High', nameUk: 'Житлова висока', type: 'residential', color: '#F59E0B', maxHeight: 75, maxStoreys: 25, maxCoverage: 50, area: 85, parcelsCount: 320 },
  { id: 'zone-004', code: 'C-1', name: 'Commercial Core', nameUk: 'Комерційне ядро', type: 'commercial', color: '#3B82F6', maxHeight: 100, maxStoreys: 30, maxCoverage: 70, area: 65, parcelsCount: 420 },
  { id: 'zone-005', code: 'I-1', name: 'Light Industrial', nameUk: 'Легка промисловість', type: 'industrial', color: '#A855F7', maxHeight: 25, maxStoreys: 4, maxCoverage: 60, area: 320, parcelsCount: 185 },
  { id: 'zone-006', code: 'MU-1', name: 'Mixed Use', nameUk: 'Змішане', type: 'mixed_use', color: '#EC4899', maxHeight: 35, maxStoreys: 10, maxCoverage: 55, area: 95, parcelsCount: 450 },
  { id: 'zone-007', code: 'P-1', name: 'Protected Natural', nameUk: 'Природоохоронна', type: 'protected', color: '#10B981', maxHeight: 0, maxStoreys: 0, maxCoverage: 0, area: 1250, parcelsCount: 45 },
  { id: 'zone-008', code: 'A-1', name: 'Agricultural', nameUk: 'Сільськогосподарська', type: 'agricultural', color: '#84CC16', maxHeight: 12, maxStoreys: 2, maxCoverage: 10, area: 2500, parcelsCount: 890 },
];

const PARCELS: Parcel[] = [
  { id: 'p1', cadastralNumber: '8000000000:01:001:0001', address: '15 Khreshchatyk St, Kyiv', zoneId: 'zone-004', zoneName: 'Commercial Core', area: 2500, status: 'active', ownershipType: 'private', ownerName: 'Kyiv Development LLC', landUse: 'Commercial - Office', valuationUAH: 125000000, valuationEUR: 3125000, aiComplianceScore: 85, restrictionCount: 1 },
  { id: 'p2', cadastralNumber: '8000000000:02:015:0045', address: '78 Peremohy Ave, Kyiv', zoneId: 'zone-002', zoneName: 'Residential Medium', area: 5000, status: 'active', ownershipType: 'municipal', landUse: 'Residential - Multi-family', valuationUAH: 45000000, valuationEUR: 1125000, aiComplianceScore: 92, restrictionCount: 1 },
  { id: 'p3', cadastralNumber: '8000000000:03:022:0112', address: '25 Industrial St, Kyiv', zoneId: 'zone-005', zoneName: 'Light Industrial', area: 15000, status: 'disputed', ownershipType: 'private', ownerName: 'Industrial Holdings JSC', landUse: 'Industrial - Manufacturing', valuationUAH: 28000000, valuationEUR: 700000, aiComplianceScore: 45, restrictionCount: 2 },
  { id: 'p4', cadastralNumber: '8000000000:04:008:0078', address: '112 Shevchenko Blvd, Kyiv', zoneId: 'zone-006', zoneName: 'Mixed Use', area: 3200, status: 'active', ownershipType: 'private', ownerName: 'Urban Mix Development', landUse: 'Mixed Use', valuationUAH: 68000000, valuationEUR: 1700000, aiComplianceScore: 98, restrictionCount: 0 },
  { id: 'p5', cadastralNumber: '8000000000:05:003:0234', address: 'Holosiivskyi Forest', zoneId: 'zone-007', zoneName: 'Protected Natural', area: 250000, status: 'active', ownershipType: 'state', landUse: 'Protected - Nature Reserve', valuationUAH: 0, valuationEUR: 0, aiComplianceScore: 100, restrictionCount: 1 },
];

const PERMITS: Permit[] = [
  { id: 'pm1', permitNumber: 'BP-2025-0001', parcelId: 'p1', cadastralNumber: '8000000000:01:001:0001', type: 'reconstruction', status: 'under_review', projectName: 'Khreshchatyk Business Center Renovation', applicant: 'Kyiv Development LLC', submittedDate: '2025-01-02', complianceScore: 78, violations: ['Exceeds heritage zone height'] },
  { id: 'pm2', permitNumber: 'BP-2025-0002', parcelId: 'p2', cadastralNumber: '8000000000:02:015:0045', type: 'construction', status: 'approved', projectName: 'Peremohy Residential Complex', applicant: 'City Housing Department', submittedDate: '2024-11-15', complianceScore: 100, violations: [] },
  { id: 'pm3', permitNumber: 'BP-2024-0089', parcelId: 'p4', cadastralNumber: '8000000000:04:008:0078', type: 'construction', status: 'approved', projectName: 'Shevchenko Mixed-Use Tower', applicant: 'Urban Mix Development', submittedDate: '2024-06-10', complianceScore: 95, violations: [] },
  { id: 'pm4', permitNumber: 'BP-2025-0003', parcelId: 'p3', cadastralNumber: '8000000000:03:022:0112', type: 'renovation', status: 'rejected', projectName: 'Industrial Facility Expansion', applicant: 'Industrial Holdings JSC', submittedDate: '2025-01-05', complianceScore: 35, violations: ['Environmental remediation not completed', 'Ownership dispute'] },
];

// Config
const ZONE_TYPE_CONFIG: Record<ZoneType, { label: string; icon: string; color: string }> = {
  residential: { label: 'Residential', icon: '🏠', color: '#F59E0B' },
  commercial: { label: 'Commercial', icon: '🏢', color: '#3B82F6' },
  industrial: { label: 'Industrial', icon: '🏭', color: '#8B5CF6' },
  mixed_use: { label: 'Mixed Use', icon: '🏙️', color: '#EC4899' },
  agricultural: { label: 'Agricultural', icon: '🌾', color: '#84CC16' },
  protected: { label: 'Protected', icon: '🌲', color: '#10B981' },
};

const STATUS_CONFIG: Record<ParcelStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#10B981', bg: '#D1FAE5' },
  pending_registration: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
  disputed: { label: 'Disputed', color: '#EF4444', bg: '#FEE2E2' },
  subdividing: { label: 'Subdividing', color: '#3B82F6', bg: '#DBEAFE' },
  merging: { label: 'Merging', color: '#8B5CF6', bg: '#EDE9FE' },
  archived: { label: 'Archived', color: '#6B7280', bg: '#F3F4F6' },
};

const PERMIT_STATUS_CONFIG: Record<PermitStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' },
  submitted: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: '#FEF3C7' },
  approved: { label: 'Approved', color: '#10B981', bg: '#D1FAE5' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2' },
  expired: { label: 'Expired', color: '#9CA3AF', bg: '#F3F4F6' },
};

export default function ZoningPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'zones' | 'parcels' | 'permits' | 'map'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  const filteredParcels = PARCELS.filter(p => {
    const matchesSearch = p.cadastralNumber.includes(searchQuery) || p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'all' || p.zoneId === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const metrics = {
    totalZones: ZONES.length,
    totalParcels: PARCELS.length,
    totalArea: ZONES.reduce((sum, z) => sum + z.area, 0),
    disputedParcels: PARCELS.filter(p => p.status === 'disputed').length,
    pendingPermits: PERMITS.filter(p => ['submitted', 'under_review'].includes(p.status)).length,
    avgCompliance: Math.round(PARCELS.reduce((sum, p) => sum + p.aiComplianceScore, 0) / PARCELS.length),
    totalValuation: PARCELS.reduce((sum, p) => sum + p.valuationEUR, 0),
  };

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
                🗺️ Zoning & Cadastre
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>Land Zoning, Parcels & Restrictions</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '8px 16px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer' }}>
              📍 Search Cadastral
            </button>
            <button style={{ padding: '8px 16px', background: '#3B82F6', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              + New Permit
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px' }}>
          {(['overview', 'zones', 'parcels', 'permits', 'map'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 20px', background: activeTab === tab ? '#334155' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent',
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
                { label: 'Total Zones', value: metrics.totalZones, icon: '🗺️', color: '#3B82F6' },
                { label: 'Total Parcels', value: metrics.totalParcels.toLocaleString(), icon: '📍', color: '#10B981' },
                { label: 'Total Area', value: `${metrics.totalArea.toLocaleString()} ha`, icon: '📐', color: '#8B5CF6' },
                { label: 'Disputed', value: metrics.disputedParcels, icon: '⚠️', color: metrics.disputedParcels > 0 ? '#EF4444' : '#10B981' },
                { label: 'Pending Permits', value: metrics.pendingPermits, icon: '📋', color: '#F59E0B' },
                { label: 'Avg Compliance', value: `${metrics.avgCompliance}%`, icon: '✅', color: '#10B981' },
                { label: 'Total Value', value: `€${(metrics.totalValuation / 1000000).toFixed(1)}M`, icon: '💰', color: '#F59E0B' },
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

            {/* Zone Distribution & Recent Permits */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Zones by Type */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Zone Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(ZONE_TYPE_CONFIG).map(([type, config]) => {
                    const count = ZONES.filter(z => z.type === type).length;
                    const area = ZONES.filter(z => z.type === type).reduce((s, z) => s + z.area, 0);
                    if (count === 0) return null;
                    return (
                      <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0F172A', padding: '12px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{config.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{config.label}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>{count} zones • {area.toLocaleString()} ha</p>
                        </div>
                        <div style={{ width: '60px', height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${(area / metrics.totalArea) * 100}%`, height: '100%', background: config.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Permits */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Recent Permits</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PERMITS.slice(0, 4).map(permit => {
                    const statusCfg = PERMIT_STATUS_CONFIG[permit.status];
                    return (
                      <div key={permit.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{permit.permitNumber}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>{permit.projectName}</p>
                          </div>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8' }}>
                          <span>{permit.applicant}</span>
                          <span>Compliance: <strong style={{ color: permit.complianceScore >= 80 ? '#10B981' : permit.complianceScore >= 60 ? '#F59E0B' : '#EF4444' }}>{permit.complianceScore}%</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Disputed Parcels Alert */}
            {metrics.disputedParcels > 0 && (
              <div style={{ marginTop: '24px', background: '#450A0A', borderRadius: '12px', padding: '20px', border: '1px solid #EF4444' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 600, color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚠️ Disputed Parcels Requiring Attention
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {PARCELS.filter(p => p.status === 'disputed').map(p => (
                    <div key={p.id} style={{ background: '#1E293B', borderRadius: '8px', padding: '12px' }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>{p.cadastralNumber}</p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#94A3B8' }}>{p.address}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#FCA5A5' }}>AI Compliance: {p.aiComplianceScore}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Zones Tab */}
        {activeTab === 'zones' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {ZONES.map(zone => {
              const typeCfg = ZONE_TYPE_CONFIG[zone.type as ZoneType] || { label: zone.type, icon: '📍', color: '#6B7280' };
              return (
                <div key={zone.id} style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                  <div style={{ height: '8px', background: zone.color }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{zone.code}</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>{zone.name}</p>
                      </div>
                      <span style={{ fontSize: '28px' }}>{typeCfg.icon}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                      <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                        <p style={{ margin: 0, color: '#94A3B8' }}>Max Height</p>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{zone.maxHeight > 0 ? `${zone.maxHeight}m` : 'N/A'}</p>
                      </div>
                      <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                        <p style={{ margin: 0, color: '#94A3B8' }}>Max Storeys</p>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{zone.maxStoreys > 0 ? zone.maxStoreys : 'N/A'}</p>
                      </div>
                      <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                        <p style={{ margin: 0, color: '#94A3B8' }}>Coverage</p>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{zone.maxCoverage > 0 ? `${zone.maxCoverage}%` : 'N/A'}</p>
                      </div>
                      <div style={{ background: '#0F172A', padding: '8px', borderRadius: '6px' }}>
                        <p style={{ margin: 0, color: '#94A3B8' }}>Area</p>
                        <p style={{ margin: '2px 0 0', fontWeight: 600 }}>{zone.area} ha</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#94A3B8' }}>{zone.parcelsCount.toLocaleString()} parcels</span>
                      <button style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer' }}>View Details →</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Parcels Tab */}
        {activeTab === 'parcels' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input type="text" placeholder="Search cadastral number or address..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, maxWidth: '350px', padding: '10px 14px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }} />
              <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)}
                style={{ padding: '10px 14px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}>
                <option value="all">All Zones</option>
                {ZONES.map(z => <option key={z.id} value={z.id}>{z.code} - {z.name}</option>)}
              </select>
            </div>

            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Cadastral Number', 'Address', 'Zone', 'Area', 'Status', 'Ownership', 'Valuation (EUR)', 'Compliance', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredParcels.map((p, i) => {
                    const statusCfg = STATUS_CONFIG[p.status];
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '12px', fontWeight: 500, fontSize: '13px' }}>{p.cadastralNumber}</td>
                        <td style={{ padding: '12px', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{p.zoneName}</td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>{p.area.toLocaleString()} m²</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>{statusCfg.label}</span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', textTransform: 'capitalize' }}>{p.ownershipType}</td>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>€{p.valuationEUR.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ color: p.aiComplianceScore >= 80 ? '#10B981' : p.aiComplianceScore >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>{p.aiComplianceScore}%</span>
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

        {/* Permits Tab */}
        {activeTab === 'permits' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['Permit #', 'Project', 'Type', 'Applicant', 'Status', 'Submitted', 'Compliance', 'Violations', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMITS.map((p, i) => {
                  const statusCfg = PERMIT_STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '12px', fontWeight: 500, fontSize: '13px' }}>{p.permitNumber}</td>
                      <td style={{ padding: '12px', fontSize: '13px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.projectName}</td>
                      <td style={{ padding: '12px', fontSize: '13px', textTransform: 'capitalize' }}>{p.type}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{p.applicant}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>{statusCfg.label}</span>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#94A3B8' }}>{p.submittedDate}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ color: p.complianceScore >= 80 ? '#10B981' : p.complianceScore >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>{p.complianceScore}%</span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {p.violations.length > 0 ? (
                          <span style={{ color: '#EF4444' }}>🚨 {p.violations.length}</span>
                        ) : (
                          <span style={{ color: '#10B981' }}>✓</span>
                        )}
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

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', padding: '40px', border: '1px solid #334155', textAlign: 'center' }}>
            <span style={{ fontSize: '64px' }}>🗺️</span>
            <h3 style={{ margin: '16px 0 8px', fontSize: '20px', fontWeight: 600 }}>Interactive Zoning Map</h3>
            <p style={{ margin: 0, color: '#94A3B8', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              Coming soon - Interactive map with cadastre overlay, zone boundaries, and parcel search
            </p>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(ZONE_TYPE_CONFIG).map(([type, cfg]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#0F172A', borderRadius: '6px', fontSize: '12px' }}>
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '16px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
          <span>IVYAR Zoning Module v1.0</span>
          <span>Construction Governance Hub • Cadastre Management</span>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget module="zoning" />
    </div>
  );
}