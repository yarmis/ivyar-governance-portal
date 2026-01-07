// app/api/materials/route.ts
// Materials Module API Endpoints

import { NextRequest, NextResponse } from 'next/server';

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
// HELPER FUNCTIONS
// ============================================================================

function getDashboardMetrics() {
  const lowStock = MATERIALS.filter(m => m.currentStock < m.minStock).length;
  const pendingTests = BATCHES.filter(b => b.status === 'testing').length;
  const activeAnomalies = BATCHES.reduce((sum, b) => sum + b.anomalyCount, 0);
  const avgSupplierScore = Math.round(SUPPLIERS.reduce((sum, s) => sum + s.overallScore, 0) / SUPPLIERS.length);
  
  // Calculate metrics by category
  const materialsByCategory: Record<string, number> = {};
  MATERIALS.forEach(m => {
    materialsByCategory[m.category] = (materialsByCategory[m.category] || 0) + 1;
  });
  
  // Calculate metrics by supplier status
  const suppliersByStatus: Record<string, number> = {};
  SUPPLIERS.forEach(s => {
    suppliersByStatus[s.status] = (suppliersByStatus[s.status] || 0) + 1;
  });
  
  // Calculate metrics by batch status
  const batchesByStatus: Record<string, number> = {};
  BATCHES.forEach(b => {
    batchesByStatus[b.status] = (batchesByStatus[b.status] || 0) + 1;
  });
  
  // Calculate metrics by risk level
  const suppliersByRisk: Record<string, number> = {};
  SUPPLIERS.forEach(s => {
    suppliersByRisk[s.riskLevel] = (suppliersByRisk[s.riskLevel] || 0) + 1;
  });

  return {
    totalMaterials: MATERIALS.length,
    totalSuppliers: SUPPLIERS.length,
    totalBatches: BATCHES.length,
    lowStockAlerts: lowStock,
    pendingTests,
    activeAnomalies,
    avgSupplierScore,
    materialsByCategory,
    suppliersByStatus,
    batchesByStatus,
    suppliersByRisk,
    recentActivity: [
      { type: 'batch_received', message: 'Batch EC-2025-0007 received', timestamp: '2025-01-07T10:30:00Z' },
      { type: 'test_started', message: 'Quality testing started for MP-2025-0042', timestamp: '2025-01-06T14:00:00Z' },
      { type: 'batch_approved', message: 'Batch KB-2025-0001 approved - Grade A', timestamp: '2025-01-05T16:45:00Z' },
      { type: 'anomaly_detected', message: 'Documentation anomaly detected in MP-2025-0042', timestamp: '2025-01-06T15:30:00Z' },
    ],
  };
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'low';
  if (score < 50) return 'medium';
  if (score < 75) return 'high';
  return 'critical';
}

// ============================================================================
// API HANDLERS
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';

  switch (action) {
    case 'dashboard':
      return NextResponse.json({
        success: true,
        data: getDashboardMetrics(),
      });

    case 'materials':
      const category = searchParams.get('category');
      const search = searchParams.get('search')?.toLowerCase();
      let filteredMaterials = [...MATERIALS];
      
      if (category && category !== 'all') {
        filteredMaterials = filteredMaterials.filter(m => m.category === category);
      }
      if (search) {
        filteredMaterials = filteredMaterials.filter(m => 
          m.name.toLowerCase().includes(search) ||
          m.code.toLowerCase().includes(search) ||
          m.nameUk.toLowerCase().includes(search)
        );
      }
      
      return NextResponse.json({
        success: true,
        data: filteredMaterials,
        total: filteredMaterials.length,
      });

    case 'material':
      const materialId = searchParams.get('id');
      const material = MATERIALS.find(m => m.id === materialId);
      if (!material) {
        return NextResponse.json({ success: false, error: 'Material not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: material });

    case 'suppliers':
      const status = searchParams.get('status');
      const supplierCategory = searchParams.get('category');
      const riskLevel = searchParams.get('risk');
      let filteredSuppliers = [...SUPPLIERS];
      
      if (status && status !== 'all') {
        filteredSuppliers = filteredSuppliers.filter(s => s.status === status);
      }
      if (supplierCategory && supplierCategory !== 'all') {
        filteredSuppliers = filteredSuppliers.filter(s => s.categories.includes(supplierCategory as MaterialCategory));
      }
      if (riskLevel && riskLevel !== 'all') {
        filteredSuppliers = filteredSuppliers.filter(s => s.riskLevel === riskLevel);
      }
      
      return NextResponse.json({
        success: true,
        data: filteredSuppliers,
        total: filteredSuppliers.length,
      });

    case 'supplier':
      const supplierId = searchParams.get('id');
      const supplier = SUPPLIERS.find(s => s.id === supplierId);
      if (!supplier) {
        return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: supplier });

    case 'batches':
      const batchStatus = searchParams.get('status');
      const batchMaterial = searchParams.get('material');
      const batchSupplier = searchParams.get('supplier');
      let filteredBatches = [...BATCHES];
      
      if (batchStatus && batchStatus !== 'all') {
        filteredBatches = filteredBatches.filter(b => b.status === batchStatus);
      }
      if (batchMaterial) {
        filteredBatches = filteredBatches.filter(b => b.materialId === batchMaterial);
      }
      if (batchSupplier) {
        filteredBatches = filteredBatches.filter(b => b.supplierId === batchSupplier);
      }
      
      // Enrich with material and supplier names
      const enrichedBatches = filteredBatches.map(batch => ({
        ...batch,
        material: MATERIALS.find(m => m.id === batch.materialId),
        supplier: SUPPLIERS.find(s => s.id === batch.supplierId),
      }));
      
      return NextResponse.json({
        success: true,
        data: enrichedBatches,
        total: enrichedBatches.length,
      });

    case 'batch':
      const batchId = searchParams.get('id');
      const batch = BATCHES.find(b => b.id === batchId);
      if (!batch) {
        return NextResponse.json({ success: false, error: 'Batch not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: {
          ...batch,
          material: MATERIALS.find(m => m.id === batch.materialId),
          supplier: SUPPLIERS.find(s => s.id === batch.supplierId),
        },
      });

    case 'low-stock':
      const lowStockMaterials = MATERIALS.filter(m => m.currentStock < m.minStock);
      return NextResponse.json({
        success: true,
        data: lowStockMaterials,
        total: lowStockMaterials.length,
      });

    case 'pending-tests':
      const pendingBatches = BATCHES.filter(b => b.status === 'testing' || b.status === 'received');
      return NextResponse.json({
        success: true,
        data: pendingBatches.map(batch => ({
          ...batch,
          material: MATERIALS.find(m => m.id === batch.materialId),
          supplier: SUPPLIERS.find(s => s.id === batch.supplierId),
        })),
        total: pendingBatches.length,
      });

    case 'anomalies':
      const batchesWithAnomalies = BATCHES.filter(b => b.anomalyCount > 0);
      return NextResponse.json({
        success: true,
        data: batchesWithAnomalies.map(batch => ({
          ...batch,
          material: MATERIALS.find(m => m.id === batch.materialId),
          supplier: SUPPLIERS.find(s => s.id === batch.supplierId),
        })),
        total: batchesWithAnomalies.length,
      });

    case 'ai-risk-analysis':
      const riskAnalysis = MATERIALS.map(m => ({
        id: m.id,
        code: m.code,
        name: m.name,
        aiRiskScore: m.aiRiskScore,
        riskLevel: getRiskLevel(m.aiRiskScore),
        factors: m.aiRiskScore > 20 
          ? ['Price volatility', 'Supply chain risk'] 
          : ['Stable supply chain'],
      }));
      return NextResponse.json({
        success: true,
        data: riskAnalysis,
      });

    default:
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_material':
        // Mock create material
        return NextResponse.json({
          success: true,
          message: 'Material created successfully',
          data: { id: `mat-${Date.now()}`, ...body.material },
        });

      case 'create_supplier':
        // Mock create supplier
        return NextResponse.json({
          success: true,
          message: 'Supplier created successfully',
          data: { id: `sup-${Date.now()}`, ...body.supplier },
        });

      case 'receive_batch':
        // Mock receive batch
        return NextResponse.json({
          success: true,
          message: 'Batch received successfully',
          data: { id: `batch-${Date.now()}`, status: 'received', ...body.batch },
        });

      case 'submit_test':
        // Mock submit test results
        return NextResponse.json({
          success: true,
          message: 'Test results submitted',
          data: {
            batchId: body.batchId,
            testResult: body.result,
            qualityGrade: body.result === 'pass' ? 'A' : 'F',
            aiQualityScore: body.result === 'pass' ? 95 : 45,
          },
        });

      case 'approve_batch':
        // Mock approve batch
        return NextResponse.json({
          success: true,
          message: 'Batch approved',
          data: { batchId: body.batchId, status: 'approved' },
        });

      case 'reject_batch':
        // Mock reject batch
        return NextResponse.json({
          success: true,
          message: 'Batch rejected',
          data: { batchId: body.batchId, status: 'rejected', reason: body.reason },
        });

      case 'resolve_anomaly':
        // Mock resolve anomaly
        return NextResponse.json({
          success: true,
          message: 'Anomaly resolved',
          data: { anomalyId: body.anomalyId, resolvedBy: body.resolvedBy },
        });

      case 'verify_certificate':
        // Mock AI certificate verification
        const verificationResult = Math.random() > 0.1; // 90% success rate
        return NextResponse.json({
          success: true,
          data: {
            verified: verificationResult,
            confidence: verificationResult ? 95 + Math.floor(Math.random() * 5) : 45 + Math.floor(Math.random() * 20),
            issues: verificationResult ? [] : ['Certificate format mismatch', 'Issuing body verification pending'],
          },
        });

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}
