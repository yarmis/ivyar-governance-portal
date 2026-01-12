"use client";

import { useState } from "react";

// Types
type ProcurementPlatform = 'ariba' | 'coupa' | 'ivalua' | 'jaggaer';
type MaterialCategory = 'concrete' | 'steel' | 'lumber' | 'insulation' | 'electrical' | 'plumbing' | 'hvac';
type ComplianceStatus = 'compliant' | 'review_required' | 'non_compliant';
type ConnectionStatus = 'connected' | 'pending' | 'disconnected';
import AutopilotWidget from "@/components/AutopilotWidget";
interface CatalogItem {
  id: string;
  name: string;
  category: MaterialCategory;
  supplierPartId: string;
  price: number;
  currency: string;
  unit: string;
  unspsc: string;
  compliance: string[];
  inStock: boolean;
  leadDays: number;
}

interface Platform {
  id: ProcurementPlatform;
  name: string;
  status: ConnectionStatus;
  catalogFormat: string;
  punchOutProtocol: string;
  lastSync?: string;
  itemCount?: number;
}

interface PunchOutSession {
  id: string;
  platform: ProcurementPlatform;
  buyerName: string;
  startTime: string;
  status: 'active' | 'completed' | 'abandoned';
  itemCount: number;
  totalValue: number;
}

// Mock Data
const CATALOG_ITEMS: CatalogItem[] = [
  { id: 'mat-001', name: 'Portland Cement M400', category: 'concrete', supplierPartId: 'BMS-CONC-M400', price: 125.00, currency: 'USD', unit: 'BAG', unspsc: '30111601', compliance: ['ASTM', 'DSTU', 'EN'], inStock: true, leadDays: 3 },
  { id: 'mat-002', name: 'Reinforcing Steel A500C', category: 'steel', supplierPartId: 'BMS-REBAR-A500C', price: 850.00, currency: 'USD', unit: 'TON', unspsc: '30102001', compliance: ['ASTM', 'DSTU', 'ISO'], inStock: true, leadDays: 5 },
  { id: 'mat-003', name: 'Dimensional Lumber 2x4 SPF', category: 'lumber', supplierPartId: 'ABM-LUM-2X4', price: 4.50, currency: 'USD', unit: 'EA', unspsc: '30103601', compliance: ['IBC', 'IRC', 'FSC'], inStock: true, leadDays: 2 },
  { id: 'mat-004', name: 'Fiberglass Insulation R-19', category: 'insulation', supplierPartId: 'ABM-INS-R19', price: 0.85, currency: 'USD', unit: 'SQF', unspsc: '30141501', compliance: ['IBC', 'IECC', 'ASTM'], inStock: true, leadDays: 3 },
  { id: 'mat-005', name: 'THHN Wire 12 AWG Copper', category: 'electrical', supplierPartId: 'PES-WIRE-12AWG', price: 0.45, currency: 'USD', unit: 'FT', unspsc: '26121600', compliance: ['NEC', 'NFPA', 'UL'], inStock: true, leadDays: 2 },
  { id: 'mat-006', name: 'PVC Pipe Schedule 40 2"', category: 'plumbing', supplierPartId: 'PES-PVC-2IN', price: 8.50, currency: 'USD', unit: 'EA', unspsc: '40142001', compliance: ['IPC', 'ASTM', 'NSF'], inStock: true, leadDays: 2 },
  { id: 'mat-007', name: 'Mini-Split AC Unit 12000 BTU', category: 'hvac', supplierPartId: 'HVC-SPLIT-12K', price: 1250.00, currency: 'USD', unit: 'EA', unspsc: '40101701', compliance: ['IECC', 'AHRI', 'EPA'], inStock: false, leadDays: 14 },
];

const PLATFORMS: Platform[] = [
  { id: 'ariba', name: 'SAP Ariba', status: 'connected', catalogFormat: 'CIF 3.0', punchOutProtocol: 'cXML L1/L2', lastSync: '2025-01-07 14:30', itemCount: 1250 },
  { id: 'coupa', name: 'Coupa', status: 'connected', catalogFormat: 'CSV/Excel', punchOutProtocol: 'cXML/OCI', lastSync: '2025-01-07 12:15', itemCount: 1180 },
  { id: 'ivalua', name: 'Ivalua', status: 'pending', catalogFormat: 'CSV/XML', punchOutProtocol: 'cXML', lastSync: undefined, itemCount: 0 },
  { id: 'jaggaer', name: 'Jaggaer', status: 'disconnected', catalogFormat: 'CIF/XML', punchOutProtocol: 'cXML/OCI', lastSync: undefined, itemCount: 0 },
];

const PUNCHOUT_SESSIONS: PunchOutSession[] = [
  { id: 'PO-001', platform: 'ariba', buyerName: 'Turner Construction', startTime: '2025-01-07 09:15', status: 'completed', itemCount: 24, totalValue: 45600 },
  { id: 'PO-002', platform: 'coupa', buyerName: 'Skanska USA', startTime: '2025-01-07 10:30', status: 'active', itemCount: 12, totalValue: 23400 },
  { id: 'PO-003', platform: 'ariba', buyerName: 'Bechtel Corp', startTime: '2025-01-07 11:45', status: 'completed', itemCount: 8, totalValue: 12800 },
  { id: 'PO-004', platform: 'coupa', buyerName: 'Fluor Corporation', startTime: '2025-01-07 13:00', status: 'abandoned', itemCount: 3, totalValue: 4500 },
];

// Config
const PLATFORM_CONFIG: Record<ProcurementPlatform, { color: string; icon: string }> = {
  ariba: { color: '#0070F3', icon: '🔷' },
  coupa: { color: '#00B4D8', icon: '🔶' },
  ivalua: { color: '#7C3AED', icon: '🟣' },
  jaggaer: { color: '#DC2626', icon: '🔴' },
};

const CATEGORY_CONFIG: Record<MaterialCategory, { label: string; icon: string; color: string }> = {
  concrete: { label: 'Concrete', icon: '🧱', color: '#6B7280' },
  steel: { label: 'Steel', icon: '🔩', color: '#3B82F6' },
  lumber: { label: 'Lumber', icon: '🪵', color: '#D97706' },
  insulation: { label: 'Insulation', icon: '🧊', color: '#EC4899' },
  electrical: { label: 'Electrical', icon: '⚡', color: '#EAB308' },
  plumbing: { label: 'Plumbing', icon: '🚰', color: '#06B6D4' },
  hvac: { label: 'HVAC', icon: '❄️', color: '#8B5CF6' },
};

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; color: string; bg: string }> = {
  connected: { label: 'Connected', color: '#10B981', bg: '#D1FAE5' },
  pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
  disconnected: { label: 'Disconnected', color: '#6B7280', bg: '#F3F4F6' },
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
const formatNumber = (n: number) => n.toLocaleString('en-US');

export default function ConstructionIntelligencePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'platforms' | 'punchout' | 'compliance' | 'export'>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<ProcurementPlatform | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'all'>('all');

  const filteredItems = selectedCategory === 'all' 
    ? CATALOG_ITEMS 
    : CATALOG_ITEMS.filter(i => i.category === selectedCategory);

  const metrics = {
    totalItems: CATALOG_ITEMS.length,
    totalValue: CATALOG_ITEMS.reduce((s, i) => s + i.price, 0),
    connectedPlatforms: PLATFORMS.filter(p => p.status === 'connected').length,
    totalPlatforms: PLATFORMS.length,
    activeSessions: PUNCHOUT_SESSIONS.filter(s => s.status === 'active').length,
    todayOrders: PUNCHOUT_SESSIONS.filter(s => s.status === 'completed').length,
    todayValue: PUNCHOUT_SESSIONS.filter(s => s.status === 'completed').reduce((s, p) => s + p.totalValue, 0),
    complianceRate: 94,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#E2E8F0', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)', borderBottom: '1px solid #334155', padding: '20px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                🏗️
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700 }}>
                  Construction Intelligence Platform
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>
                  PunchOut • Catalogs • Compliance • Ariba / Coupa / Ivalua / Jaggaer
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ padding: '10px 20px', background: '#334155', border: 'none', borderRadius: '8px', color: '#E2E8F0', cursor: 'pointer', fontSize: '14px' }}>
                📊 Analytics
              </button>
              <button style={{ padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                + Add Platform
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px' }}>
          {(['overview', 'catalog', 'platforms', 'punchout', 'compliance', 'export'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '14px 24px', background: activeTab === tab ? '#334155' : 'transparent',
              border: 'none', borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent',
              color: activeTab === tab ? '#E2E8F0' : '#94A3B8', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
              textTransform: 'capitalize',
            }}>{tab}</button>
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
                { label: 'Catalog Items', value: formatNumber(metrics.totalItems), sub: `${Object.keys(CATEGORY_CONFIG).length} categories`, icon: '📦', color: '#3B82F6' },
                { label: 'Connected Platforms', value: `${metrics.connectedPlatforms}/${metrics.totalPlatforms}`, sub: 'Ariba, Coupa active', icon: '🔗', color: '#10B981' },
                { label: 'Today\'s Orders', value: formatNumber(metrics.todayOrders), sub: formatCurrency(metrics.todayValue), icon: '🛒', color: '#8B5CF6' },
                { label: 'Compliance Rate', value: `${metrics.complianceRate}%`, sub: 'IBC/IRC/NEC/DSTU', icon: '✅', color: '#10B981' },
              ].map((m, i) => (
                <div key={i} style={{ background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', borderRadius: '12px', padding: '20px', border: '1px solid #475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                      <p style={{ margin: '8px 0 4px', fontSize: '32px', fontWeight: 700, color: m.color }}>{m.value}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{m.sub}</p>
                    </div>
                    <span style={{ fontSize: '32px' }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Status + Recent Sessions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
              {/* Platform Status */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🔌 Platform Connections</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PLATFORMS.map(platform => {
                    const statusCfg = STATUS_CONFIG[platform.status];
                    const platCfg = PLATFORM_CONFIG[platform.id];
                    return (
                      <div key={platform.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>{platCfg.icon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{platform.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>{platform.punchOutProtocol}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                          {platform.itemCount ? (
                            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748B' }}>{formatNumber(platform.itemCount)} items</p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent PunchOut Sessions */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>🛒 Recent PunchOut Sessions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PUNCHOUT_SESSIONS.map(session => {
                    const platCfg = PLATFORM_CONFIG[session.platform];
                    return (
                      <div key={session.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '14px' }}>{platCfg.icon}</span>
                              <span style={{ fontWeight: 600, fontSize: '14px' }}>{session.buyerName}</span>
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>{session.startTime}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                              background: session.status === 'completed' ? '#D1FAE5' : session.status === 'active' ? '#DBEAFE' : '#FEE2E2',
                              color: session.status === 'completed' ? '#10B981' : session.status === 'active' ? '#3B82F6' : '#EF4444',
                            }}>
                              {session.status}
                            </span>
                            <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600, color: '#10B981' }}>
                              {formatCurrency(session.totalValue)}
                            </p>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                          {session.itemCount} items • {session.id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Categories + Compliance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Categories */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>📦 Material Categories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
                    const count = CATALOG_ITEMS.filter(i => i.category === cat).length;
                    return (
                      <div key={cat} style={{ background: '#0F172A', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{cfg.icon}</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{cfg.label}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>{count} items</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compliance Standards */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>📋 Compliance Standards</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    { code: 'IBC', name: 'International Building Code', region: 'US', count: 45 },
                    { code: 'IRC', name: 'International Residential Code', region: 'US', count: 38 },
                    { code: 'NEC', name: 'National Electrical Code', region: 'US', count: 22 },
                    { code: 'DSTU', name: 'Ukrainian National Standard', region: 'UA', count: 35 },
                    { code: 'DBN', name: 'Ukrainian Building Norms', region: 'UA', count: 28 },
                    { code: 'ASTM', name: 'ASTM International', region: 'Global', count: 56 },
                  ].map(std => (
                    <div key={std.code} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#3B82F6' }}>{std.code}</span>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>{std.region}</p>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{std.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <select 
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value as MaterialCategory | 'all')}
                style={{ padding: '10px 16px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px' }}
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
                  <option key={cat} value={cat}>{cfg.icon} {cfg.label}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Search items..."
                style={{ padding: '10px 16px', background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', fontSize: '14px', flex: 1 }}
              />
              <button style={{ padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                🔍 Search
              </button>
            </div>

            {/* Catalog Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Item', 'Category', 'Part ID', 'UNSPSC', 'Price', 'Unit', 'Compliance', 'Stock', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, i) => {
                    const catCfg = CATEGORY_CONFIG[item.category];
                    return (
                      <tr key={item.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '18px' }}>{catCfg.icon}</span>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: `${catCfg.color}20`, color: catCfg.color }}>
                            {catCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', fontSize: '13px', fontFamily: 'monospace' }}>{item.supplierPartId}</td>
                        <td style={{ padding: '14px 12px', fontSize: '13px', color: '#94A3B8' }}>{item.unspsc}</td>
                        <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 600, color: '#10B981' }}>{formatCurrency(item.price)}</td>
                        <td style={{ padding: '14px 12px', fontSize: '13px' }}>{item.unit}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {item.compliance.slice(0, 3).map(c => (
                              <span key={c} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: '#334155', color: '#94A3B8' }}>{c}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          {item.inStock ? (
                            <span style={{ color: '#10B981', fontWeight: 500 }}>✓ In Stock</span>
                          ) : (
                            <span style={{ color: '#F59E0B' }}>{item.leadDays}d lead</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Platforms Tab */}
        {activeTab === 'platforms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {PLATFORMS.map(platform => {
              const platCfg = PLATFORM_CONFIG[platform.id];
              const statusCfg = STATUS_CONFIG[platform.status];
              return (
                <div key={platform.id} style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                  <div style={{ height: '4px', background: platCfg.color }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '36px' }}>{platCfg.icon}</span>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{platform.name}</h3>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Catalog Format</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{platform.catalogFormat}</p>
                      </div>
                      <div style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>PunchOut Protocol</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{platform.punchOutProtocol}</p>
                      </div>
                      <div style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Synced Items</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{platform.itemCount || '—'}</p>
                      </div>
                      <div style={{ background: '#0F172A', borderRadius: '8px', padding: '14px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Last Sync</p>
                        <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{platform.lastSync || 'Never'}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {platform.status === 'connected' ? (
                        <>
                          <button style={{ flex: 1, padding: '12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#E2E8F0', cursor: 'pointer', fontSize: '14px' }}>
                            🔄 Sync Catalog
                          </button>
                          <button style={{ flex: 1, padding: '12px', background: platCfg.color, border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                            ⚙️ Configure
                          </button>
                        </>
                      ) : (
                        <button style={{ flex: 1, padding: '12px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                          🔗 Connect Platform
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PunchOut Tab */}
        {activeTab === 'punchout' && (
          <>
            {/* PunchOut Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Active Sessions', value: metrics.activeSessions, icon: '🟢', color: '#10B981' },
                { label: 'Today Completed', value: metrics.todayOrders, icon: '✅', color: '#3B82F6' },
                { label: 'Today Value', value: formatCurrency(metrics.todayValue), icon: '💰', color: '#10B981' },
                { label: 'Avg Cart Size', value: '15 items', icon: '🛒', color: '#8B5CF6' },
              ].map((m, i) => (
                <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px' }}>{m.icon}</span>
                  <p style={{ margin: '8px 0 4px', fontSize: '24px', fontWeight: 700, color: m.color }}>{m.value}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Sessions Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>PunchOut Sessions</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    {['Session ID', 'Platform', 'Buyer', 'Started', 'Items', 'Value', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PUNCHOUT_SESSIONS.map((session, i) => {
                    const platCfg = PLATFORM_CONFIG[session.platform];
                    return (
                      <tr key={session.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '14px 12px', fontFamily: 'monospace', fontSize: '13px' }}>{session.id}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ fontSize: '14px' }}>{platCfg.icon} {PLATFORMS.find(p => p.id === session.platform)?.name}</span>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 500 }}>{session.buyerName}</td>
                        <td style={{ padding: '14px 12px', fontSize: '13px', color: '#94A3B8' }}>{session.startTime}</td>
                        <td style={{ padding: '14px 12px' }}>{session.itemCount}</td>
                        <td style={{ padding: '14px 12px', fontWeight: 600, color: '#10B981' }}>{formatCurrency(session.totalValue)}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ 
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                            background: session.status === 'completed' ? '#D1FAE5' : session.status === 'active' ? '#DBEAFE' : '#FEE2E2',
                            color: session.status === 'completed' ? '#10B981' : session.status === 'active' ? '#3B82F6' : '#EF4444',
                          }}>
                            {session.status}
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
          </>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* UA Standards */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                🇺🇦 Ukraine Standards
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { code: 'DBN', name: 'Державні Будівельні Норми', items: 45, status: 'active' },
                  { code: 'DSTU', name: 'Державні Стандарти України', items: 38, status: 'active' },
                  { code: 'НПАОП', name: 'Нормативні Акти з Охорони Праці', items: 12, status: 'active' },
                ].map(std => (
                  <div key={std.code} style={{ background: '#0F172A', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#3B82F6' }}>{std.code}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94A3B8' }}>{std.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '18px' }}>{std.items}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#10B981' }}>items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* US Standards */}
            <div style={{ background: '#1E293B', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                🇺🇸 US Standards
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { code: 'IBC', name: 'International Building Code', items: 52, status: 'active' },
                  { code: 'IRC', name: 'International Residential Code', items: 38, status: 'active' },
                  { code: 'NEC', name: 'National Electrical Code', items: 24, status: 'active' },
                  { code: 'NFPA', name: 'National Fire Protection Association', items: 18, status: 'active' },
                  { code: 'OSHA', name: 'Occupational Safety and Health', items: 15, status: 'active' },
                ].map(std => (
                  <div key={std.code} style={{ background: '#0F172A', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#10B981' }}>{std.code}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94A3B8' }}>{std.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '18px' }}>{std.items}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#10B981' }}>items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { format: 'CIF 3.0', platform: 'SAP Ariba', icon: '🔷', desc: 'Catalog Interchange Format for Ariba Network', items: 1250 },
              { format: 'CSV', platform: 'Coupa', icon: '🔶', desc: 'Comma-separated values for Coupa import', items: 1180 },
              { format: 'cXML', platform: 'Universal', icon: '📄', desc: 'Commerce XML for PunchOut catalogs', items: 1250 },
              { format: 'Excel', platform: 'Manual', icon: '📊', desc: 'Excel spreadsheet for manual upload', items: 1250 },
            ].map(exp => (
              <div key={exp.format} style={{ background: '#1E293B', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '36px' }}>{exp.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{exp.format}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>{exp.platform}</p>
                  </div>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#94A3B8' }}>{exp.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{formatNumber(exp.items)} items</span>
                  <button style={{ padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                    ⬇️ Export
                  </button>
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
            <span>🏗️</span>
            <span>Construction Intelligence Platform v1.0</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>PunchOut cXML</span>
            <span>•</span>
            <span>CIF 3.0</span>
            <span>•</span>
            <span>UNSPSC v24</span>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget module="procurement" />
    </div>
  );
}