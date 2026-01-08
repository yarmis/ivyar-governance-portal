"use client";

import { useState } from "react";

// Types
type CountryCode = 'UA' | 'US';
type UtilityType = 'water' | 'gas' | 'electricity' | 'heat' | 'sewer';
type DistrictType = 'water' | 'fire' | 'school' | 'sewer' | 'trash';
type FloodZoneType = 'A' | 'AE' | 'V' | 'VE' | 'X' | 'X500';
type RiskLevel = 'minimal' | 'moderate' | 'high' | 'severe';

interface Utility {
  id: string;
  name: string;
  shortName: string;
  type: UtilityType;
  country: CountryCode;
  region: string;
  customers: number;
  status: 'active' | 'inactive';
}

interface ServiceArea {
  id: string;
  name: string;
  type: DistrictType;
  state: string;
  population: number;
}

interface FloodZone {
  id: string;
  zone: FloodZoneType;
  risk: RiskLevel;
  county: string;
  state: string;
  insuranceRequired: boolean;
}

// Mock Data
const UTILITIES: Utility[] = [
  { id: 'u1', name: 'Kyivvodokanal', shortName: 'KVK', type: 'water', country: 'UA', region: 'Kyiv Oblast', customers: 2900000, status: 'active' },
  { id: 'u2', name: 'DTEK Kyiv Electric', shortName: 'DTEK', type: 'electricity', country: 'UA', region: 'Kyiv Oblast', customers: 1200000, status: 'active' },
  { id: 'u3', name: 'Kyivgaz', shortName: 'KG', type: 'gas', country: 'UA', region: 'Kyiv Oblast', customers: 850000, status: 'active' },
  { id: 'u4', name: 'Kyivteploenergo', shortName: 'KTE', type: 'heat', country: 'UA', region: 'Kyiv Oblast', customers: 12000, status: 'active' },
  { id: 'u5', name: 'PG&E', shortName: 'PG&E', type: 'electricity', country: 'US', region: 'California', customers: 16000000, status: 'active' },
  { id: 'u6', name: 'ConEd', shortName: 'ConEd', type: 'electricity', country: 'US', region: 'New York', customers: 10000000, status: 'active' },
  { id: 'u7', name: 'LADWP', shortName: 'LADWP', type: 'electricity', country: 'US', region: 'California', customers: 4000000, status: 'active' },
  { id: 'u8', name: 'Duke Energy', shortName: 'Duke', type: 'electricity', country: 'US', region: 'North Carolina', customers: 7800000, status: 'active' },
  { id: 'u9', name: 'Miami-Dade Water', shortName: 'MDWASD', type: 'water', country: 'US', region: 'Florida', customers: 2300000, status: 'active' },
];

const SERVICE_AREAS: ServiceArea[] = [
  { id: 'sa1', name: 'LA County Fire District', type: 'fire', state: 'CA', population: 4000000 },
  { id: 'sa2', name: 'LA Unified School District', type: 'school', state: 'CA', population: 420000 },
  { id: 'sa3', name: 'Metro Water District SoCal', type: 'water', state: 'CA', population: 19000000 },
  { id: 'sa4', name: 'Miami-Dade Fire Rescue', type: 'fire', state: 'FL', population: 2700000 },
  { id: 'sa5', name: 'NYC Sanitation District', type: 'trash', state: 'NY', population: 8300000 },
];

const FLOOD_ZONES: FloodZone[] = [
  { id: 'fz1', zone: 'AE', risk: 'high', county: 'Miami-Dade', state: 'FL', insuranceRequired: true },
  { id: 'fz2', zone: 'VE', risk: 'severe', county: 'Miami-Dade', state: 'FL', insuranceRequired: true },
  { id: 'fz3', zone: 'X', risk: 'minimal', county: 'Miami-Dade', state: 'FL', insuranceRequired: false },
  { id: 'fz4', zone: 'AE', risk: 'high', county: 'Harris', state: 'TX', insuranceRequired: true },
  { id: 'fz5', zone: 'X500', risk: 'moderate', county: 'Los Angeles', state: 'CA', insuranceRequired: false },
];

// Config
const UTILITY_CONFIG: Record<UtilityType, { label: string; icon: string; color: string }> = {
  water: { label: 'Water', icon: '💧', color: '#3B82F6' },
  gas: { label: 'Gas', icon: '🔥', color: '#F97316' },
  electricity: { label: 'Electricity', icon: '⚡', color: '#EAB308' },
  heat: { label: 'Heat', icon: '🌡️', color: '#EF4444' },
  sewer: { label: 'Sewer', icon: '🚰', color: '#6B7280' },
};

const DISTRICT_CONFIG: Record<DistrictType, { label: string; icon: string; color: string }> = {
  water: { label: 'Water', icon: '💧', color: '#3B82F6' },
  fire: { label: 'Fire', icon: '🚒', color: '#EF4444' },
  school: { label: 'School', icon: '🏫', color: '#8B5CF6' },
  sewer: { label: 'Sewer', icon: '🚰', color: '#6B7280' },
  trash: { label: 'Sanitation', icon: '🗑️', color: '#78716C' },
};

const FLOOD_CONFIG: Record<FloodZoneType, { label: string; color: string; risk: string }> = {
  A: { label: 'Zone A', color: '#DC2626', risk: 'High' },
  AE: { label: 'Zone AE', color: '#DC2626', risk: 'High' },
  V: { label: 'Zone V', color: '#7C2D12', risk: 'Severe' },
  VE: { label: 'Zone VE', color: '#7C2D12', risk: 'Severe' },
  X: { label: 'Zone X', color: '#10B981', risk: 'Minimal' },
  X500: { label: 'Zone X500', color: '#F59E0B', risk: 'Moderate' },
};

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  minimal: { label: 'Minimal', color: '#10B981', bg: '#D1FAE5' },
  moderate: { label: 'Moderate', color: '#F59E0B', bg: '#FEF3C7' },
  high: { label: 'High', color: '#EF4444', bg: '#FEE2E2' },
  severe: { label: 'Severe', color: '#7C2D12', bg: '#FEE2E2' },
};

const formatNumber = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toString();

export default function GeoPlatformPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'utilities' | 'service-areas' | 'flood-zones' | 'elevation'>('overview');
  const [countryFilter, setCountryFilter] = useState<'all' | CountryCode>('all');
  const [searchCoords, setSearchCoords] = useState({ lat: '', lng: '' });
  const [searchResult, setSearchResult] = useState<{ elevation?: number; utilities: Utility[]; zones: FloodZone[] } | null>(null);

  const filteredUtilities = countryFilter === 'all' 
    ? UTILITIES 
    : UTILITIES.filter(u => u.country === countryFilter);

  const metrics = {
    totalUtilities: UTILITIES.length,
    uaUtilities: UTILITIES.filter(u => u.country === 'UA').length,
    usUtilities: UTILITIES.filter(u => u.country === 'US').length,
    totalCustomers: UTILITIES.reduce((s, u) => s + u.customers, 0),
    serviceAreas: SERVICE_AREAS.length,
    floodZones: FLOOD_ZONES.length,
    highRiskZones: FLOOD_ZONES.filter(z => z.risk === 'high' || z.risk === 'severe').length,
  };

  const handleCoordSearch = () => {
    const lat = parseFloat(searchCoords.lat);
    const lng = parseFloat(searchCoords.lng);
    if (isNaN(lat) || isNaN(lng)) return;

    // Simulated search result
    const elevation = Math.round(100 + Math.sin(lat) * 50 + Math.cos(lng) * 30);
    const nearbyUtilities = UTILITIES.slice(0, 3);
    const nearbyZones = FLOOD_ZONES.slice(0, 2);
    
    setSearchResult({ elevation, utilities: nearbyUtilities, zones: nearbyZones });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#E2E8F0', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #0F4C75 0%, #0F172A 100%)', borderBottom: '1px solid #334155', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #3B82F6, #10B981)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                🌍
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>
                  Geo Utilities Platform
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>
                  UA/US Utilities • FEMA Flood Zones • Elevation • Service Areas
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', background: '#1E293B', borderRadius: '8px', padding: '4px' }}>
                {(['all', 'UA', 'US'] as const).map(c => (
                  <button key={c} onClick={() => setCountryFilter(c)} style={{
                    padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    background: countryFilter === c ? '#3B82F6' : 'transparent',
                    color: countryFilter === c ? 'white' : '#94A3B8',
                  }}>
                    {c === 'all' ? '🌍 All' : c === 'UA' ? '🇺🇦 Ukraine' : '🇺🇸 USA'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px' }}>
          {(['overview', 'utilities', 'service-areas', 'flood-zones', 'elevation'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '14px 24px', background: activeTab === tab ? '#334155' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent',
              color: activeTab === tab ? '#E2E8F0' : '#94A3B8', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              textTransform: 'capitalize',
            }}>{tab.replace('-', ' ')}</button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Utilities', value: metrics.totalUtilities, sub: `${metrics.uaUtilities} UA • ${metrics.usUtilities} US`, icon: '⚡', color: '#3B82F6' },
                { label: 'Customers Served', value: formatNumber(metrics.totalCustomers), icon: '👥', color: '#10B981' },
                { label: 'Service Areas (US)', value: metrics.serviceAreas, icon: '📍', color: '#8B5CF6' },
                { label: 'FEMA Flood Zones', value: metrics.floodZones, sub: `${metrics.highRiskZones} high risk`, icon: '🌊', color: metrics.highRiskZones > 0 ? '#EF4444' : '#10B981' },
              ].map((m, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', borderRadius: '12px', padding: '20px', border: '1px solid #475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                      <p style={{ margin: '8px 0 4px', fontSize: '32px', fontWeight: 700, color: m.color }}>{m.value}</p>
                      {m.sub && <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{m.sub}</p>}
                    </div>
                    <span style={{ fontSize: '32px' }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coordinate Search */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 Location Lookup
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Latitude</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 50.4501" 
                    value={searchCoords.lat}
                    onChange={e => setSearchCoords(s => ({ ...s, lat: e.target.value }))}
                    style={{ padding: '10px 14px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', width: '150px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>Longitude</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 30.5234" 
                    value={searchCoords.lng}
                    onChange={e => setSearchCoords(s => ({ ...s, lng: e.target.value }))}
                    style={{ padding: '10px 14px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', width: '150px' }}
                  />
                </div>
                <button 
                  onClick={handleCoordSearch}
                  style={{ padding: '10px 24px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                >
                  🔍 Search
                </button>
              </div>
              
              {searchResult && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#0F172A', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Elevation</p>
                      <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700, color: '#10B981' }}>{searchResult.elevation}m</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Nearby Utilities</p>
                      <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700 }}>{searchResult.utilities.length}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Flood Zones</p>
                      <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 700 }}>{searchResult.zones.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Utilities by Type + Flood Risk */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* By Utility Type */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Utilities by Type</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(UTILITY_CONFIG).map(([type, cfg]) => {
                    const count = UTILITIES.filter(u => u.type === type).length;
                    const customers = UTILITIES.filter(u => u.type === type).reduce((s, u) => s + u.customers, 0);
                    return (
                      <div key={type} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{cfg.icon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 500 }}>{cfg.label}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>{formatNumber(customers)} customers</p>
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '20px', color: cfg.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flood Risk Summary */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🌊 FEMA Flood Risk Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(RISK_CONFIG).map(([risk, cfg]) => {
                    const count = FLOOD_ZONES.filter(z => z.risk === risk).length;
                    return (
                      <div key={risk} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                            {risk.charAt(0).toUpperCase()}
                          </span>
                          <span style={{ fontWeight: 500 }}>{cfg.label} Risk</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '20px', color: cfg.color }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Utilities Tab */}
        {activeTab === 'utilities' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['Provider', 'Type', 'Country', 'Region', 'Customers', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUtilities.map((u, i) => {
                  const typeCfg = UTILITY_CONFIG[u.type];
                  return (
                    <tr key={u.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{typeCfg.icon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{u.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>{u.shortName}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: `${typeCfg.color}20`, color: typeCfg.color }}>
                          {typeCfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px', fontSize: '14px' }}>
                        {u.country === 'UA' ? '🇺🇦' : '🇺🇸'} {u.country}
                      </td>
                      <td style={{ padding: '14px 12px', fontSize: '14px', color: '#94A3B8' }}>{u.region}</td>
                      <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 500 }}>{formatNumber(u.customers)}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: '#D1FAE5', color: '#10B981' }}>
                          Active
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Service Areas Tab */}
        {activeTab === 'service-areas' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🇺🇸</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>US Service Districts</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['District Name', 'Type', 'State', 'Population', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICE_AREAS.map((sa, i) => {
                  const typeCfg = DISTRICT_CONFIG[sa.type];
                  return (
                    <tr key={sa.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{typeCfg.icon}</span>
                          <span style={{ fontWeight: 500, fontSize: '14px' }}>{sa.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: `${typeCfg.color}20`, color: typeCfg.color }}>
                          {typeCfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px', fontSize: '14px' }}>{sa.state}</td>
                      <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 500 }}>{formatNumber(sa.population)}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>View Area</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Flood Zones Tab */}
        {activeTab === 'flood-zones' && (
          <>
            {/* Risk Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {Object.entries(RISK_CONFIG).map(([risk, cfg]) => {
                const count = FLOOD_ZONES.filter(z => z.risk === risk).length;
                return (
                  <div key={risk} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: cfg.bg, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '24px' }}>🌊</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: cfg.color }}>{count}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94A3B8' }}>{cfg.label} Risk</p>
                  </div>
                );
              })}
            </div>

            {/* Zones Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Zone', 'Risk Level', 'County', 'State', 'Insurance Required', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FLOOD_ZONES.map((fz, i) => {
                    const zoneCfg = FLOOD_CONFIG[fz.zone];
                    const riskCfg = RISK_CONFIG[fz.risk];
                    return (
                      <tr key={fz.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, background: `${zoneCfg.color}20`, color: zoneCfg.color }}>
                            {zoneCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: riskCfg.bg, color: riskCfg.color }}>
                            {riskCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', fontSize: '14px' }}>{fz.county}</td>
                        <td style={{ padding: '14px 12px', fontSize: '14px' }}>{fz.state}</td>
                        <td style={{ padding: '14px 12px' }}>
                          {fz.insuranceRequired ? (
                            <span style={{ color: '#EF4444', fontWeight: 500 }}>✓ Required</span>
                          ) : (
                            <span style={{ color: '#64748B' }}>Not required</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>Details</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Elevation Tab */}
        {activeTab === 'elevation' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Elevation Lookup */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 Elevation Lookup
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>Latitude</label>
                  <input 
                    type="text" 
                    placeholder="Enter latitude (e.g. 50.4501)"
                    style={{ width: '100%', padding: '12px 16px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94A3B8', marginBottom: '8px' }}>Longitude</label>
                  <input 
                    type="text" 
                    placeholder="Enter longitude (e.g. 30.5234)"
                    style={{ width: '100%', padding: '12px 16px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
                  />
                </div>
                <button style={{ padding: '14px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                  Get Elevation
                </button>
              </div>
            </div>

            {/* Data Sources */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600 }}>📡 Data Sources</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'EU-DEM', region: '🇺🇦 Ukraine', resolution: '30m', status: 'active' },
                  { name: 'SRTM', region: '🌍 Global', resolution: '30m', status: 'active' },
                  { name: 'USGS 3DEP', region: '🇺🇸 USA', resolution: '10m', status: 'active' },
                  { name: 'LIDAR', region: '🇺🇸 Select areas', resolution: '1m', status: 'limited' },
                ].map((src, i) => (
                  <div key={i} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{src.name}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>{src.region} • {src.resolution}</p>
                    </div>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                      background: src.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                      color: src.status === 'active' ? '#10B981' : '#F59E0B',
                    }}>
                      {src.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '20px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌍</span>
            <span>Geo Utilities Platform v1.0</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>PostGIS Ready</span>
            <span>•</span>
            <span>GeoJSON Compatible</span>
            <span>•</span>
            <span>FEMA NFIP Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
