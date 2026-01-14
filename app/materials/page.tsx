"use client";

import { useState } from "react";
import Link from "next/link";
import AutopilotWidget from "@/components/AutopilotWidget";
// ============================================================================
// TYPES
// ============================================================================

type MaterialCategory = 'concrete' | 'steel' | 'timber' | 'glass' | 'insulation' | 'roofing' | 'electrical' | 'plumbing' | 'finishing' | 'foundation';
type SupplierStatus = 'active' | 'pending_approval' | 'suspended' | 'blacklisted' | 'inactive';
type BatchStatus = 'received' | 'testing' | 'approved' | 'rejected' | 'in_use' | 'depleted';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

interface Material {
  id: string;
  code: string;
  name: string;
  nameUk: string;
  category: MaterialCategory;
  unit: string;
  currentPrice: number;
  currency: string;
  currentStock: number;
  minStock: number;
  aiRiskScore: number;
  suppliers: string[];
}

interface Supplier {
  id: string;
  code: string;
  name: string;
  country: string;
  status: SupplierStatus;
  categories: MaterialCategory[];
  qualityRating: number;
  deliveryRating: number;
  overallScore: number;
  onTimeDeliveryRate: number;
  defectRate: number;
  riskLevel: RiskLevel;
}

interface Batch {
  id: string;
  batchNumber: string;
  materialId: string;
  supplierId: string;
  quantity: number;
  unit: string;
  status: BatchStatus;
  receivedDate: string;
  qualityGrade?: QualityGrade;
  aiQualityScore?: number;
  anomalyCount: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MATERIALS: Material[] = [
  { id: 'mat-001', code: 'CON-C30', name: 'Concrete C30/37', nameUk: 'Бетон C30/37', category: 'concrete', unit: 'm³', currentPrice: 125, currency: 'EUR', currentStock: 0, minStock: 50, aiRiskScore: 15, suppliers: ['sup-001', 'sup-002'] },
  { id: 'mat-002', code: 'STL-A500', name: 'Reinforcement Steel A500C', nameUk: 'Арматурна сталь A500C', category: 'steel', unit: 'ton', currentPrice: 850, currency: 'EUR', currentStock: 45, minStock: 20, aiRiskScore: 25, suppliers: ['sup-003'] },
  { id: 'mat-003', code: 'INS-MW150', name: 'Mineral Wool 150mm', nameUk: 'Мінеральна вата 150мм', category: 'insulation', unit: 'm²', currentPrice: 18, currency: 'EUR', currentStock: 1200, minStock: 500, aiRiskScore: 10, suppliers: ['sup-004'] },
  { id: 'mat-004', code: 'TIM-C24', name: 'Structural Timber C24', nameUk: 'Конструкційна деревина C24', category: 'timber', unit: 'm³', currentPrice: 320, currency: 'EUR', currentStock: 25, minStock: 30, aiRiskScore: 18, suppliers: ['sup-005'] },
  { id: 'mat-005', code: 'GLS-DGU', name: 'Double Glazing Unit', nameUk: 'Склопакет двокамерний', category: 'glass', unit: 'm²', currentPrice: 85, currency: 'EUR', currentStock: 150, minStock: 100, aiRiskScore: 12, suppliers: ['sup-006'] },
];

const SUPPLIERS: Supplier[] = [
  { id: 'sup-001', code: 'SUP-001', name: 'KyivBeton LLC', country: 'UA', status: 'active', categories: ['concrete'], qualityRating: 92, deliveryRating: 88, overallScore: 88, onTimeDeliveryRate: 94.5, defectRate: 0.8, riskLevel: 'low' },
  { id: 'sup-002', code: 'SUP-002', name: 'EuroConcrete', country: 'PL', status: 'active', categories: ['concrete'], qualityRating: 95, deliveryRating: 82, overallScore: 85, onTimeDeliveryRate: 86.2, defectRate: 0.3, riskLevel: 'low' },
  { id: 'sup-003', code: 'SUP-003', name: 'MetalPrime Ukraine', country: 'UA', status: 'active', categories: ['steel'], qualityRating: 94, deliveryRating: 91, overallScore: 89, onTimeDeliveryRate: 92.1, defectRate: 0.5, riskLevel: 'low' },
  { id: 'sup-004', code: 'SUP-004', name: 'ThermoTech GmbH', country: 'DE', status: 'active', categories: ['insulation'], qualityRating: 98, deliveryRating: 85, overallScore: 85, onTimeDeliveryRate: 89.3, defectRate: 0.1, riskLevel: 'low' },
  { id: 'sup-005', code: 'SUP-005', name: 'Nordic Timber AS', country: 'NO', status: 'pending_approval', categories: ['timber'], qualityRating: 90, deliveryRating: 78, overallScore: 82, onTimeDeliveryRate: 82.5, defectRate: 1.2, riskLevel: 'medium' },
];

const BATCHES: Batch[] = [
  { id: 'batch-001', batchNumber: 'KB-2025-0001', materialId: 'mat-001', supplierId: 'sup-001', quantity: 150, unit: 'm³', status: 'approved', receivedDate: '2025-01-05', qualityGrade: 'A', aiQualityScore: 96, anomalyCount: 0 },
  { id: 'batch-002', batchNumber: 'MP-2025-0042', materialId: 'mat-002', supplierId: 'sup-003', quantity: 25, unit: 'ton', status: 'testing', receivedDate: '2025-01-06', anomalyCount: 1 },
  { id: 'batch-003', batchNumber: 'TT-2025-0018', materialId: 'mat-003', supplierId: 'sup-004', quantity: 500, unit: 'm²', status: 'in_use', receivedDate: '2025-01-03', qualityGrade: 'A', aiQualityScore: 98, anomalyCount: 0 },
  { id: 'batch-004', batchNumber: 'EC-2025-0007', materialId: 'mat-001', supplierId: 'sup-002', quantity: 80, unit: 'm³', status: 'received', receivedDate: '2025-01-07', anomalyCount: 0 },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

const CATEGORY_CONFIG: Record<MaterialCategory, { name: string; nameUk: string; icon: string; color: string }> = {
  concrete: { name: 'Concrete', nameUk: 'Бетон', icon: '🧱', color: '#6B7280' },
  steel: { name: 'Steel', nameUk: 'Сталь', icon: '🔩', color: '#374151' },
  timber: { name: 'Timber', nameUk: 'Деревина', icon: '🪵', color: '#92400E' },
  glass: { name: 'Glass', nameUk: 'Скло', icon: '🪟', color: '#06B6D4' },
  insulation: { name: 'Insulation', nameUk: 'Ізоляція', icon: '🧊', color: '#F59E0B' },
  roofing: { name: 'Roofing', nameUk: 'Покрівля', icon: '🏠', color: '#DC2626' },
  electrical: { name: 'Electrical', nameUk: 'Електричні', icon: '⚡', color: '#FBBF24' },
  plumbing: { name: 'Plumbing', nameUk: 'Сантехніка', icon: '🚿', color: '#3B82F6' },
  finishing: { name: 'Finishing', nameUk: 'Оздоблення', icon: '🎨', color: '#8B5CF6' },
  foundation: { name: 'Foundation', nameUk: 'Фундамент', icon: '🏗️', color: '#4B5563' },
};

const STATUS_CONFIG: Record<SupplierStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#10B981', bg: '#D1FAE5' },
  pending_approval: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
  suspended: { label: 'Suspended', color: '#F97316', bg: '#FFEDD5' },
  blacklisted: { label: 'Blacklisted', color: '#DC2626', bg: '#FEE2E2' },
  inactive: { label: 'Inactive', color: '#6B7280', bg: '#F3F4F6' },
};

const BATCH_STATUS_CONFIG: Record<BatchStatus, { label: string; color: string; bg: string }> = {
  received: { label: 'Received', color: '#3B82F6', bg: '#DBEAFE' },
  testing: { label: 'Testing', color: '#F59E0B', bg: '#FEF3C7' },
  approved: { label: 'Approved', color: '#10B981', bg: '#D1FAE5' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2' },
  in_use: { label: 'In Use', color: '#8B5CF6', bg: '#EDE9FE' },
  depleted: { label: 'Depleted', color: '#6B7280', bg: '#F3F4F6' },
};

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#10B981', bg: '#D1FAE5' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  high: { label: 'High', color: '#F97316', bg: '#FFEDD5' },
  critical: { label: 'Critical', color: '#DC2626', bg: '#FEE2E2' },
};

const GRADE_CONFIG: Record<QualityGrade, { color: string; bg: string }> = {
  A: { color: '#059669', bg: '#D1FAE5' },
  B: { color: '#10B981', bg: '#D1FAE5' },
  C: { color: '#F59E0B', bg: '#FEF3C7' },
  D: { color: '#F97316', bg: '#FFEDD5' },
  F: { color: '#DC2626', bg: '#FEE2E2' },
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function MaterialsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'suppliers' | 'batches' | 'tests'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | 'all'>('all');

  // Filter materials
  const filteredMaterials = MATERIALS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate metrics
  const metrics = {
    totalMaterials: MATERIALS.length,
    totalSuppliers: SUPPLIERS.length,
    totalBatches: BATCHES.length,
    lowStock: MATERIALS.filter(m => m.currentStock < m.minStock).length,
    pendingTests: BATCHES.filter(b => b.status === 'testing').length,
    activeAnomalies: BATCHES.reduce((sum, b) => sum + b.anomalyCount, 0),
    avgSupplierScore: Math.round(SUPPLIERS.reduce((sum, s) => sum + s.overallScore, 0) / SUPPLIERS.length),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#E2E8F0', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/construction" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Construction Hub
            </Link>
            <div style={{ width: '1px', height: '24px', background: '#475569' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🧱 Materials Management
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94A3B8' }}>
                Certification, Suppliers & Quality Control
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Last updated: {new Date().toLocaleTimeString()}</span>
            <button style={{ padding: '8px 16px', background: '#3B82F6', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              + Add Material
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ background: '#1E293B', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px' }}>
          {(['overview', 'materials', 'suppliers', 'batches', 'tests'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab ? '#334155' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent',
                color: activeTab === tab ? '#E2E8F0' : '#94A3B8',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Materials', value: metrics.totalMaterials, icon: '📦', color: '#3B82F6' },
                { label: 'Active Suppliers', value: metrics.totalSuppliers, icon: '🏭', color: '#10B981' },
                { label: 'Material Batches', value: metrics.totalBatches, icon: '📋', color: '#8B5CF6' },
                { label: 'Low Stock Alerts', value: metrics.lowStock, icon: '⚠️', color: metrics.lowStock > 0 ? '#F59E0B' : '#10B981' },
                { label: 'Pending Tests', value: metrics.pendingTests, icon: '🔬', color: '#06B6D4' },
                { label: 'Active Anomalies', value: metrics.activeAnomalies, icon: '🚨', color: metrics.activeAnomalies > 0 ? '#EF4444' : '#10B981' },
                { label: 'Avg Supplier Score', value: `${metrics.avgSupplierScore}%`, icon: '⭐', color: '#F59E0B' },
              ].map((metric, i) => (
                <div key={i} onClick={() => alert(`${metric.icon} ${metric.label}\n\nValue: ${metric.value}\n\nThis would show detailed breakdown and analytics.`)} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#334155'; e.currentTarget.style.borderColor = '#3B82F6'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.borderColor = '#334155'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{metric.label}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: 700, color: metric.color }}>{metric.value}</p>
                    </div>
                    <span style={{ fontSize: '24px' }}>{metric.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Recent Batches */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Recent Batches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {BATCHES.slice(0, 4).map(batch => {
                    const material = MATERIALS.find(m => m.id === batch.materialId);
                    const statusConfig = BATCH_STATUS_CONFIG[batch.status];
                    return (
                      <div key={batch.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{batch.batchNumber}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                            {material?.name} • {batch.quantity} {batch.unit}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {batch.qualityGrade && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: GRADE_CONFIG[batch.qualityGrade].bg,
                              color: GRADE_CONFIG[batch.qualityGrade].color,
                            }}>
                              {batch.qualityGrade}
                            </span>
                          )}
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: statusConfig.bg,
                            color: statusConfig.color,
                          }}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Suppliers */}
              <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Top Suppliers by Score</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...SUPPLIERS].sort((a, b) => b.overallScore - a.overallScore).slice(0, 4).map(supplier => {
                    const statusConfig = STATUS_CONFIG[supplier.status];
                    const riskConfig = RISK_CONFIG[supplier.riskLevel];
                    return (
                      <div key={supplier.id} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{supplier.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                              {supplier.country} • {supplier.categories.map(c => CATEGORY_CONFIG[c].name).join(', ')}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              background: riskConfig.bg,
                              color: riskConfig.color,
                            }}>
                              {riskConfig.label}
                            </span>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              background: statusConfig.bg,
                              color: statusConfig.color,
                            }}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                          <span style={{ color: '#94A3B8' }}>Score: <strong style={{ color: '#E2E8F0' }}>{supplier.overallScore}%</strong></span>
                          <span style={{ color: '#94A3B8' }}>Quality: <strong style={{ color: '#E2E8F0' }}>{supplier.qualityRating}%</strong></span>
                          <span style={{ color: '#94A3B8' }}>Delivery: <strong style={{ color: '#E2E8F0' }}>{supplier.deliveryRating}%</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            {metrics.lowStock > 0 && (
              <div style={{ marginTop: '24px', background: '#422006', borderRadius: '12px', padding: '20px', border: '1px solid #F59E0B' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚠️ Low Stock Alerts
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                  {MATERIALS.filter(m => m.currentStock < m.minStock).map(material => (
                    <div key={material.id} style={{ background: '#1E293B', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{material.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                            Code: {material.code}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#EF4444' }}>
                            {material.currentStock} {material.unit}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94A3B8' }}>
                            Min: {material.minStock} {material.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Distribution */}
            <div style={{ marginTop: '24px', background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Materials by Category</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                  const count = MATERIALS.filter(m => m.category === key).length;
                  if (count === 0) return null;
                  return (
                    <div key={key} onClick={() => alert(`${config.icon} ${config.name}\n\nTotal materials: ${count}\n\nThis would filter materials by this category.`)} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      background: '#0F172A',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }} onMouseEnter={(e) => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.borderColor = '#3B82F6'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#0F172A'; e.currentTarget.style.borderColor = '#334155'; }}>
                      <span style={{ fontSize: '20px' }}>{config.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{config.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>{count} material{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  maxWidth: '300px',
                  padding: '10px 14px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#E2E8F0',
                  fontSize: '14px',
                }}
              />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value as MaterialCategory | 'all')}
                style={{
                  padding: '10px 14px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#E2E8F0',
                  fontSize: '14px',
                }}
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.name}</option>
                ))}
              </select>
            </div>

            {/* Materials Table */}
            <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0F172A' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Material</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Stock</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>AI Risk</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Suppliers</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material, i) => {
                    const category = CATEGORY_CONFIG[material.category];
                    const isLowStock = material.currentStock < material.minStock;
                    const riskLevel: RiskLevel = material.aiRiskScore < 25 ? 'low' : material.aiRiskScore < 50 ? 'medium' : material.aiRiskScore < 75 ? 'high' : 'critical';
                    const riskConfig = RISK_CONFIG[riskLevel];
                    return (
                      <tr key={material.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{material.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>{material.code}</p>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                            {category.icon} {category.name}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px' }}>
                          {material.currentPrice.toLocaleString()} {material.currency}/{material.unit}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span style={{ color: isLowStock ? '#EF4444' : '#E2E8F0', fontWeight: isLowStock ? 600 : 400 }}>
                            {material.currentStock} {material.unit}
                          </span>
                          {isLowStock && <span style={{ marginLeft: '6px', color: '#EF4444' }}>⚠️</span>}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            background: riskConfig.bg,
                            color: riskConfig.color,
                          }}>
                            {material.aiRiskScore}%
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px' }}>
                          {material.suppliers.length}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Supplier</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Country</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Categories</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Score</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Quality</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Delivery</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Risk</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLIERS.map((supplier, i) => {
                  const statusConfig = STATUS_CONFIG[supplier.status];
                  const riskConfig = RISK_CONFIG[supplier.riskLevel];
                  return (
                    <tr key={supplier.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>{supplier.name}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>{supplier.code}</p>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '14px' }}>{supplier.country}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          background: statusConfig.bg,
                          color: statusConfig.color,
                        }}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                          {supplier.categories.map(cat => (
                            <span key={cat} style={{ fontSize: '16px' }} title={CATEGORY_CONFIG[cat].name}>
                              {CATEGORY_CONFIG[cat].icon}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: supplier.overallScore >= 85 ? '#10B981' : supplier.overallScore >= 70 ? '#F59E0B' : '#EF4444' }}>
                        {supplier.overallScore}%
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{supplier.qualityRating}%</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{supplier.deliveryRating}%</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          background: riskConfig.bg,
                          color: riskConfig.color,
                        }}>
                          {riskConfig.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Batches Tab */}
        {activeTab === 'batches' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Batch</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Material</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Quantity</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Grade</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>AI Score</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Received</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Anomalies</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {BATCHES.map((batch, i) => {
                  const material = MATERIALS.find(m => m.id === batch.materialId);
                  const statusConfig = BATCH_STATUS_CONFIG[batch.status];
                  return (
                    <tr key={batch.id} style={{ borderTop: '1px solid #334155', background: i % 2 === 0 ? 'transparent' : '#0F172A20' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500, fontSize: '14px' }}>{batch.batchNumber}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px' }}>{material?.name || '-'}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px' }}>{batch.quantity} {batch.unit}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          background: statusConfig.bg,
                          color: statusConfig.color,
                        }}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {batch.qualityGrade ? (
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: GRADE_CONFIG[batch.qualityGrade].bg,
                            color: GRADE_CONFIG[batch.qualityGrade].color,
                          }}>
                            {batch.qualityGrade}
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px' }}>
                        {batch.aiQualityScore ? `${batch.aiQualityScore}%` : '-'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>{batch.receivedDate}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {batch.anomalyCount > 0 ? (
                          <span style={{ color: '#EF4444', fontWeight: 600 }}>🚨 {batch.anomalyCount}</span>
                        ) : (
                          <span style={{ color: '#10B981' }}>✓</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button style={{ padding: '6px 12px', background: '#334155', border: 'none', borderRadius: '6px', color: '#E2E8F0', cursor: 'pointer', fontSize: '12px' }}>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div style={{ background: '#1E293B', borderRadius: '12px', padding: '40px', border: '1px solid #334155', textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>🔬</span>
            <h3 style={{ margin: '16px 0 8px', fontSize: '18px', fontWeight: 600 }}>Quality Tests & Lab Results</h3>
            <p style={{ margin: 0, color: '#94A3B8' }}>Coming soon - Full test management with AI verification</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '16px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
          <span>IVYAR Materials Module v1.0</span>
          <span>Construction Governance Hub • Materials Management</span>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget module="materials" />
    </div>
  );
}