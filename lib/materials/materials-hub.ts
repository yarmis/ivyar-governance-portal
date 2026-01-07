// lib/materials/materials-hub.ts
// IVYAR Construction Materials Module v1.0
// Material Certification, Supplier Management, AI Quality Checks

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MaterialCategory = 
  | 'concrete' 
  | 'steel' 
  | 'timber' 
  | 'glass' 
  | 'insulation' 
  | 'roofing' 
  | 'electrical' 
  | 'plumbing' 
  | 'finishing' 
  | 'foundation';

export type CertificationStatus = 
  | 'pending' 
  | 'under_review' 
  | 'certified' 
  | 'expired' 
  | 'rejected' 
  | 'suspended';

export type SupplierStatus = 
  | 'active' 
  | 'pending_approval' 
  | 'suspended' 
  | 'blacklisted' 
  | 'inactive';

export type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export type BatchStatus = 
  | 'received' 
  | 'testing' 
  | 'approved' 
  | 'rejected' 
  | 'in_use' 
  | 'depleted';

export type TestResult = 'pass' | 'fail' | 'conditional' | 'pending';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Material {
  id: string;
  code: string;
  name: string;
  nameUk: string;
  category: MaterialCategory;
  subcategory: string;
  description: string;
  unit: string;
  specifications: MaterialSpecification[];
  certifications: MaterialCertification[];
  suppliers: string[]; // supplier IDs
  currentPrice: number;
  currency: string;
  minStock: number;
  currentStock: number;
  leadTimeDays: number;
  shelfLifeDays?: number;
  hazardClass?: string;
  originCountries: string[];
  complianceStandards: string[];
  aiRiskScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialSpecification {
  id: string;
  name: string;
  value: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  testMethod: string;
  mandatory: boolean;
}

export interface MaterialCertification {
  id: string;
  materialId: string;
  certificateNumber: string;
  certificateType: string;
  issuingBody: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  documentUrl: string;
  verifiedAt?: string;
  verifiedBy?: string;
  aiVerified: boolean;
  aiConfidence?: number;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  legalName: string;
  country: string;
  region: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  status: SupplierStatus;
  categories: MaterialCategory[];
  certifications: SupplierCertification[];
  qualityRating: number; // 0-100
  deliveryRating: number; // 0-100
  priceRating: number; // 0-100
  overallScore: number; // 0-100
  totalOrders: number;
  onTimeDeliveryRate: number; // percentage
  defectRate: number; // percentage
  avgLeadTimeDays: number;
  paymentTerms: string;
  bankDetails: BankDetails;
  documents: SupplierDocument[];
  auditHistory: SupplierAudit[];
  riskLevel: RiskLevel;
  aiRiskFactors: string[];
  blacklistReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCertification {
  id: string;
  type: string; // ISO 9001, ISO 14001, etc.
  certificateNumber: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  documentUrl: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
  currency: string;
}

export interface SupplierDocument {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  expiryDate?: string;
}

export interface SupplierAudit {
  id: string;
  date: string;
  auditor: string;
  type: 'initial' | 'periodic' | 'special';
  score: number;
  findings: string[];
  recommendations: string[];
  nextAuditDate: string;
}

export interface MaterialBatch {
  id: string;
  batchNumber: string;
  materialId: string;
  supplierId: string;
  projectId?: string;
  purchaseOrderId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  status: BatchStatus;
  receivedDate: string;
  receivedBy: string;
  manufacturingDate?: string;
  expiryDate?: string;
  storageLocation: string;
  testResults: QualityTest[];
  qualityGrade?: QualityGrade;
  certificates: string[];
  photos: string[];
  notes: string;
  aiQualityScore?: number;
  aiAnomalies: AIAnomaly[];
  usageRecords: UsageRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface QualityTest {
  id: string;
  batchId: string;
  testType: string;
  testMethod: string;
  testedBy: string;
  testedAt: string;
  laboratory?: string;
  parameters: TestParameter[];
  overallResult: TestResult;
  certificateUrl?: string;
  notes: string;
  aiVerified: boolean;
  aiConfidence?: number;
}

export interface TestParameter {
  name: string;
  value: number | string;
  unit: string;
  minSpec?: number;
  maxSpec?: number;
  result: TestResult;
}

export interface UsageRecord {
  id: string;
  batchId: string;
  projectId: string;
  usedQuantity: number;
  usedDate: string;
  usedBy: string;
  location: string;
  notes: string;
}

export interface AIAnomaly {
  id: string;
  type: 'price' | 'quality' | 'delivery' | 'documentation' | 'supplier' | 'specification';
  severity: RiskLevel;
  description: string;
  detectedAt: string;
  confidence: number;
  recommendation: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  projectId: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'partial' | 'complete' | 'cancelled';
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  expectedDelivery: string;
  actualDelivery?: string;
  deliveryAddress: string;
  paymentTerms: string;
  notes: string;
}

export interface PurchaseOrderItem {
  id: string;
  materialId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  batchIds: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const MOCK_MATERIALS: Material[] = [
  {
    id: 'mat-001',
    code: 'CON-C30',
    name: 'Concrete C30/37',
    nameUk: 'Бетон C30/37',
    category: 'concrete',
    subcategory: 'Ready-mix',
    description: 'High-strength ready-mix concrete for structural applications',
    unit: 'm³',
    specifications: [
      { id: 'spec-1', name: 'Compressive Strength', value: '30', unit: 'MPa', minValue: 30, maxValue: 37, testMethod: 'EN 12390-3', mandatory: true },
      { id: 'spec-2', name: 'Slump', value: '100', unit: 'mm', minValue: 80, maxValue: 120, testMethod: 'EN 12350-2', mandatory: true },
      { id: 'spec-3', name: 'Water-Cement Ratio', value: '0.45', unit: '', maxValue: 0.50, testMethod: 'EN 206', mandatory: true },
    ],
    certifications: [],
    suppliers: ['sup-001', 'sup-002'],
    currentPrice: 125,
    currency: 'EUR',
    minStock: 50,
    currentStock: 0,
    leadTimeDays: 1,
    originCountries: ['UA', 'PL'],
    complianceStandards: ['EN 206', 'DSTU B V.2.7-43:2010'],
    aiRiskScore: 15,
    createdAt: '2024-01-15',
    updatedAt: '2025-01-05',
  },
  {
    id: 'mat-002',
    code: 'STL-A500',
    name: 'Reinforcement Steel A500C',
    nameUk: 'Арматурна сталь A500C',
    category: 'steel',
    subcategory: 'Reinforcement',
    description: 'Ribbed reinforcement steel bars for concrete structures',
    unit: 'ton',
    specifications: [
      { id: 'spec-4', name: 'Yield Strength', value: '500', unit: 'MPa', minValue: 500, testMethod: 'EN 10080', mandatory: true },
      { id: 'spec-5', name: 'Tensile Strength', value: '575', unit: 'MPa', minValue: 575, testMethod: 'EN 10080', mandatory: true },
      { id: 'spec-6', name: 'Elongation', value: '14', unit: '%', minValue: 14, testMethod: 'EN 10080', mandatory: true },
    ],
    certifications: [],
    suppliers: ['sup-003'],
    currentPrice: 850,
    currency: 'EUR',
    minStock: 20,
    currentStock: 45,
    leadTimeDays: 7,
    originCountries: ['UA', 'TR', 'DE'],
    complianceStandards: ['EN 10080', 'DSTU 3760:2006'],
    aiRiskScore: 25,
    createdAt: '2024-01-15',
    updatedAt: '2025-01-06',
  },
  {
    id: 'mat-003',
    code: 'INS-MW150',
    name: 'Mineral Wool 150mm',
    nameUk: 'Мінеральна вата 150мм',
    category: 'insulation',
    subcategory: 'Thermal Insulation',
    description: 'High-density mineral wool insulation boards',
    unit: 'm²',
    specifications: [
      { id: 'spec-7', name: 'Thermal Conductivity', value: '0.035', unit: 'W/(m·K)', maxValue: 0.038, testMethod: 'EN 12667', mandatory: true },
      { id: 'spec-8', name: 'Density', value: '150', unit: 'kg/m³', minValue: 140, maxValue: 160, testMethod: 'EN 1602', mandatory: true },
      { id: 'spec-9', name: 'Fire Class', value: 'A1', unit: '', testMethod: 'EN 13501-1', mandatory: true },
    ],
    certifications: [],
    suppliers: ['sup-004'],
    currentPrice: 18,
    currency: 'EUR',
    minStock: 500,
    currentStock: 1200,
    leadTimeDays: 5,
    originCountries: ['DE', 'PL'],
    complianceStandards: ['EN 13162', 'DSTU B V.2.7-94:2000'],
    aiRiskScore: 10,
    createdAt: '2024-02-01',
    updatedAt: '2025-01-04',
  },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    code: 'SUP-CONC-001',
    name: 'KyivBeton LLC',
    legalName: 'ТОВ "КиївБетон"',
    country: 'UA',
    region: 'Kyiv Oblast',
    address: 'вул. Промислова 15, м. Київ, 02090',
    contactPerson: 'Oleksandr Petrenko',
    contactEmail: 'o.petrenko@kyivbeton.ua',
    contactPhone: '+380 44 555 1234',
    website: 'https://kyivbeton.ua',
    status: 'active',
    categories: ['concrete'],
    certifications: [
      {
        id: 'cert-s1',
        type: 'ISO 9001:2015',
        certificateNumber: 'UA-QMS-2023-0156',
        issuingBody: 'TÜV SÜD Ukraine',
        issueDate: '2023-03-15',
        expiryDate: '2026-03-14',
        status: 'certified',
        documentUrl: '/docs/suppliers/kyivbeton-iso9001.pdf',
      },
    ],
    qualityRating: 92,
    deliveryRating: 88,
    priceRating: 85,
    overallScore: 88,
    totalOrders: 156,
    onTimeDeliveryRate: 94.5,
    defectRate: 0.8,
    avgLeadTimeDays: 1.2,
    paymentTerms: 'Net 30',
    bankDetails: {
      bankName: 'ПриватБанк',
      accountNumber: 'UA123456789012345678901234567',
      iban: 'UA123456789012345678901234567',
      swift: 'PBANUA2X',
      currency: 'UAH',
    },
    documents: [],
    auditHistory: [
      {
        id: 'audit-1',
        date: '2024-06-15',
        auditor: 'Quality Control Dept',
        type: 'periodic',
        score: 91,
        findings: ['Minor documentation gaps'],
        recommendations: ['Improve batch traceability records'],
        nextAuditDate: '2025-06-15',
      },
    ],
    riskLevel: 'low',
    aiRiskFactors: [],
    createdAt: '2022-05-10',
    updatedAt: '2025-01-05',
  },
  {
    id: 'sup-002',
    code: 'SUP-CONC-002',
    name: 'EuroConcrete',
    legalName: 'EuroConcrete Sp. z o.o.',
    country: 'PL',
    region: 'Lublin',
    address: 'ul. Betonowa 42, 20-001 Lublin',
    contactPerson: 'Marek Kowalski',
    contactEmail: 'm.kowalski@euroconcrete.pl',
    contactPhone: '+48 81 555 4321',
    website: 'https://euroconcrete.pl',
    status: 'active',
    categories: ['concrete'],
    certifications: [
      {
        id: 'cert-s2',
        type: 'ISO 9001:2015',
        certificateNumber: 'PL-QMS-2022-0892',
        issuingBody: 'Bureau Veritas Poland',
        issueDate: '2022-11-20',
        expiryDate: '2025-11-19',
        status: 'certified',
        documentUrl: '/docs/suppliers/euroconcrete-iso9001.pdf',
      },
    ],
    qualityRating: 95,
    deliveryRating: 82,
    priceRating: 78,
    overallScore: 85,
    totalOrders: 42,
    onTimeDeliveryRate: 86.2,
    defectRate: 0.3,
    avgLeadTimeDays: 3.5,
    paymentTerms: 'Net 45',
    bankDetails: {
      bankName: 'Bank Pekao',
      accountNumber: 'PL61109010140000071219812874',
      iban: 'PL61109010140000071219812874',
      swift: 'PKOPPLPW',
      currency: 'PLN',
    },
    documents: [],
    auditHistory: [],
    riskLevel: 'low',
    aiRiskFactors: ['Cross-border logistics complexity'],
    createdAt: '2023-08-20',
    updatedAt: '2025-01-03',
  },
  {
    id: 'sup-003',
    code: 'SUP-STL-001',
    name: 'MetalPrime Ukraine',
    legalName: 'ПрАТ "МеталПрайм Україна"',
    country: 'UA',
    region: 'Dnipropetrovsk Oblast',
    address: 'просп. Металургів 78, м. Дніпро, 49000',
    contactPerson: 'Viktor Shevchenko',
    contactEmail: 'v.shevchenko@metalprime.ua',
    contactPhone: '+380 56 777 8899',
    website: 'https://metalprime.ua',
    status: 'active',
    categories: ['steel'],
    certifications: [
      {
        id: 'cert-s3',
        type: 'ISO 9001:2015',
        certificateNumber: 'UA-QMS-2024-0234',
        issuingBody: 'SGS Ukraine',
        issueDate: '2024-01-10',
        expiryDate: '2027-01-09',
        status: 'certified',
        documentUrl: '/docs/suppliers/metalprime-iso9001.pdf',
      },
      {
        id: 'cert-s4',
        type: 'ISO 14001:2015',
        certificateNumber: 'UA-EMS-2024-0089',
        issuingBody: 'SGS Ukraine',
        issueDate: '2024-01-10',
        expiryDate: '2027-01-09',
        status: 'certified',
        documentUrl: '/docs/suppliers/metalprime-iso14001.pdf',
      },
    ],
    qualityRating: 94,
    deliveryRating: 91,
    priceRating: 82,
    overallScore: 89,
    totalOrders: 89,
    onTimeDeliveryRate: 92.1,
    defectRate: 0.5,
    avgLeadTimeDays: 5.8,
    paymentTerms: 'Net 30',
    bankDetails: {
      bankName: 'Укрексімбанк',
      accountNumber: 'UA987654321098765432109876543',
      iban: 'UA987654321098765432109876543',
      swift: 'EXBSUA2X',
      currency: 'UAH',
    },
    documents: [],
    auditHistory: [],
    riskLevel: 'low',
    aiRiskFactors: [],
    createdAt: '2022-03-01',
    updatedAt: '2025-01-06',
  },
  {
    id: 'sup-004',
    code: 'SUP-INS-001',
    name: 'ThermoTech GmbH',
    legalName: 'ThermoTech Insulation GmbH',
    country: 'DE',
    region: 'Bavaria',
    address: 'Industriestraße 25, 85748 Garching',
    contactPerson: 'Hans Mueller',
    contactEmail: 'h.mueller@thermotech.de',
    contactPhone: '+49 89 555 7890',
    website: 'https://thermotech.de',
    status: 'active',
    categories: ['insulation'],
    certifications: [
      {
        id: 'cert-s5',
        type: 'ISO 9001:2015',
        certificateNumber: 'DE-QMS-2023-5678',
        issuingBody: 'TÜV Rheinland',
        issueDate: '2023-06-01',
        expiryDate: '2026-05-31',
        status: 'certified',
        documentUrl: '/docs/suppliers/thermotech-iso9001.pdf',
      },
    ],
    qualityRating: 98,
    deliveryRating: 85,
    priceRating: 72,
    overallScore: 85,
    totalOrders: 28,
    onTimeDeliveryRate: 89.3,
    defectRate: 0.1,
    avgLeadTimeDays: 7.2,
    paymentTerms: 'Net 60',
    bankDetails: {
      bankName: 'Deutsche Bank',
      accountNumber: 'DE89370400440532013000',
      iban: 'DE89370400440532013000',
      swift: 'DEUTDEFF',
      currency: 'EUR',
    },
    documents: [],
    auditHistory: [],
    riskLevel: 'low',
    aiRiskFactors: ['Long lead times', 'Currency exchange risk'],
    createdAt: '2023-09-15',
    updatedAt: '2025-01-02',
  },
];

export const MOCK_BATCHES: MaterialBatch[] = [
  {
    id: 'batch-001',
    batchNumber: 'KB-2025-0001',
    materialId: 'mat-001',
    supplierId: 'sup-001',
    projectId: 'proj-kyiv-hospital',
    purchaseOrderId: 'po-2025-0001',
    quantity: 150,
    unit: 'm³',
    unitPrice: 125,
    totalPrice: 18750,
    currency: 'EUR',
    status: 'approved',
    receivedDate: '2025-01-05',
    receivedBy: 'Ivan Kovalenko',
    manufacturingDate: '2025-01-05',
    storageLocation: 'Site A - Sector 3',
    testResults: [
      {
        id: 'test-001',
        batchId: 'batch-001',
        testType: 'Compressive Strength',
        testMethod: 'EN 12390-3',
        testedBy: 'Lab Tech A. Bondar',
        testedAt: '2025-01-05T14:30:00Z',
        laboratory: 'KyivBeton QC Lab',
        parameters: [
          { name: '7-day Strength', value: 25.5, unit: 'MPa', minSpec: 22, result: 'pass' },
          { name: '28-day Strength (projected)', value: 33.2, unit: 'MPa', minSpec: 30, result: 'pass' },
        ],
        overallResult: 'pass',
        certificateUrl: '/docs/tests/batch-001-strength.pdf',
        notes: 'All parameters within specification',
        aiVerified: true,
        aiConfidence: 98.5,
      },
    ],
    qualityGrade: 'A',
    certificates: ['cert-batch-001'],
    photos: ['/photos/batch-001-delivery.jpg'],
    notes: 'Delivered on schedule, excellent quality',
    aiQualityScore: 96,
    aiAnomalies: [],
    usageRecords: [
      {
        id: 'use-001',
        batchId: 'batch-001',
        projectId: 'proj-kyiv-hospital',
        usedQuantity: 45,
        usedDate: '2025-01-06',
        usedBy: 'Construction Team Alpha',
        location: 'Foundation Block A',
        notes: 'Foundation pour - Phase 1',
      },
    ],
    createdAt: '2025-01-05',
    updatedAt: '2025-01-06',
  },
  {
    id: 'batch-002',
    batchNumber: 'MP-2025-0042',
    materialId: 'mat-002',
    supplierId: 'sup-003',
    projectId: 'proj-kyiv-hospital',
    purchaseOrderId: 'po-2025-0002',
    quantity: 25,
    unit: 'ton',
    unitPrice: 850,
    totalPrice: 21250,
    currency: 'EUR',
    status: 'testing',
    receivedDate: '2025-01-06',
    receivedBy: 'Petro Marchenko',
    manufacturingDate: '2024-12-20',
    storageLocation: 'Site A - Steel Yard',
    testResults: [],
    certificates: [],
    photos: ['/photos/batch-002-delivery.jpg'],
    notes: 'Awaiting lab test results',
    aiQualityScore: undefined,
    aiAnomalies: [
      {
        id: 'anom-001',
        type: 'documentation',
        severity: 'medium',
        description: 'Mill certificate pending verification',
        detectedAt: '2025-01-06T10:00:00Z',
        confidence: 85,
        recommendation: 'Request original mill certificate from supplier',
        resolved: false,
      },
    ],
    usageRecords: [],
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },
];

// ============================================================================
// CATEGORY CONFIGURATIONS
// ============================================================================

export const MATERIAL_CATEGORIES: Record<MaterialCategory, {
  name: string;
  nameUk: string;
  icon: string;
  color: string;
  requiredTests: string[];
  complianceStandards: string[];
}> = {
  concrete: {
    name: 'Concrete',
    nameUk: 'Бетон',
    icon: '🧱',
    color: '#6B7280',
    requiredTests: ['Compressive Strength', 'Slump', 'Air Content'],
    complianceStandards: ['EN 206', 'DSTU B V.2.7-43:2010'],
  },
  steel: {
    name: 'Steel',
    nameUk: 'Сталь',
    icon: '🔩',
    color: '#374151',
    requiredTests: ['Tensile Strength', 'Yield Strength', 'Elongation', 'Chemical Composition'],
    complianceStandards: ['EN 10080', 'DSTU 3760:2006'],
  },
  timber: {
    name: 'Timber',
    nameUk: 'Деревина',
    icon: '🪵',
    color: '#92400E',
    requiredTests: ['Moisture Content', 'Grading', 'Treatment Verification'],
    complianceStandards: ['EN 14081', 'DSTU EN 336:2004'],
  },
  glass: {
    name: 'Glass',
    nameUk: 'Скло',
    icon: '🪟',
    color: '#06B6D4',
    requiredTests: ['Thickness', 'Impact Resistance', 'Thermal Performance'],
    complianceStandards: ['EN 572', 'DSTU B V.2.7-122:2009'],
  },
  insulation: {
    name: 'Insulation',
    nameUk: 'Ізоляція',
    icon: '🧊',
    color: '#F59E0B',
    requiredTests: ['Thermal Conductivity', 'Density', 'Fire Classification'],
    complianceStandards: ['EN 13162', 'DSTU B V.2.7-94:2000'],
  },
  roofing: {
    name: 'Roofing',
    nameUk: 'Покрівля',
    icon: '🏠',
    color: '#DC2626',
    requiredTests: ['Water Resistance', 'Wind Uplift', 'Fire Classification'],
    complianceStandards: ['EN 14783', 'DSTU B V.2.7-113:2002'],
  },
  electrical: {
    name: 'Electrical',
    nameUk: 'Електричні',
    icon: '⚡',
    color: '#FBBF24',
    requiredTests: ['Conductivity', 'Insulation Resistance', 'Fire Rating'],
    complianceStandards: ['IEC 60227', 'ДСТУ ГОСТ 22483:2019'],
  },
  plumbing: {
    name: 'Plumbing',
    nameUk: 'Сантехніка',
    icon: '🚿',
    color: '#3B82F6',
    requiredTests: ['Pressure Rating', 'Material Composition', 'Leak Testing'],
    complianceStandards: ['EN 12201', 'ДСТУ Б В.2.5-17:2001'],
  },
  finishing: {
    name: 'Finishing',
    nameUk: 'Оздоблення',
    icon: '🎨',
    color: '#8B5CF6',
    requiredTests: ['VOC Content', 'Adhesion', 'Color Consistency'],
    complianceStandards: ['EN 13300', 'ДСТУ Б В.2.7-224:2009'],
  },
  foundation: {
    name: 'Foundation',
    nameUk: 'Фундамент',
    icon: '🏗️',
    color: '#4B5563',
    requiredTests: ['Compaction', 'Bearing Capacity', 'Drainage'],
    complianceStandards: ['EN 1997', 'ДБН В.2.1-10:2018'],
  },
};

export const CERTIFICATION_STATUS_CONFIG: Record<CertificationStatus, {
  label: string;
  labelUk: string;
  color: string;
  bgColor: string;
}> = {
  pending: { label: 'Pending', labelUk: 'Очікує', color: '#F59E0B', bgColor: '#FEF3C7' },
  under_review: { label: 'Under Review', labelUk: 'На розгляді', color: '#3B82F6', bgColor: '#DBEAFE' },
  certified: { label: 'Certified', labelUk: 'Сертифіковано', color: '#10B981', bgColor: '#D1FAE5' },
  expired: { label: 'Expired', labelUk: 'Прострочено', color: '#EF4444', bgColor: '#FEE2E2' },
  rejected: { label: 'Rejected', labelUk: 'Відхилено', color: '#DC2626', bgColor: '#FEE2E2' },
  suspended: { label: 'Suspended', labelUk: 'Призупинено', color: '#F97316', bgColor: '#FFEDD5' },
};

export const SUPPLIER_STATUS_CONFIG: Record<SupplierStatus, {
  label: string;
  labelUk: string;
  color: string;
  bgColor: string;
}> = {
  active: { label: 'Active', labelUk: 'Активний', color: '#10B981', bgColor: '#D1FAE5' },
  pending_approval: { label: 'Pending Approval', labelUk: 'Очікує схвалення', color: '#F59E0B', bgColor: '#FEF3C7' },
  suspended: { label: 'Suspended', labelUk: 'Призупинено', color: '#F97316', bgColor: '#FFEDD5' },
  blacklisted: { label: 'Blacklisted', labelUk: 'У чорному списку', color: '#DC2626', bgColor: '#FEE2E2' },
  inactive: { label: 'Inactive', labelUk: 'Неактивний', color: '#6B7280', bgColor: '#F3F4F6' },
};

export const BATCH_STATUS_CONFIG: Record<BatchStatus, {
  label: string;
  labelUk: string;
  color: string;
  bgColor: string;
}> = {
  received: { label: 'Received', labelUk: 'Отримано', color: '#3B82F6', bgColor: '#DBEAFE' },
  testing: { label: 'Testing', labelUk: 'Тестування', color: '#F59E0B', bgColor: '#FEF3C7' },
  approved: { label: 'Approved', labelUk: 'Схвалено', color: '#10B981', bgColor: '#D1FAE5' },
  rejected: { label: 'Rejected', labelUk: 'Відхилено', color: '#EF4444', bgColor: '#FEE2E2' },
  in_use: { label: 'In Use', labelUk: 'У використанні', color: '#8B5CF6', bgColor: '#EDE9FE' },
  depleted: { label: 'Depleted', labelUk: 'Вичерпано', color: '#6B7280', bgColor: '#F3F4F6' },
};

export const QUALITY_GRADE_CONFIG: Record<QualityGrade, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  minScore: number;
}> = {
  A: { label: 'Grade A', description: 'Excellent - Exceeds specifications', color: '#059669', bgColor: '#D1FAE5', minScore: 90 },
  B: { label: 'Grade B', description: 'Good - Meets all specifications', color: '#10B981', bgColor: '#D1FAE5', minScore: 80 },
  C: { label: 'Grade C', description: 'Acceptable - Meets minimum requirements', color: '#F59E0B', bgColor: '#FEF3C7', minScore: 70 },
  D: { label: 'Grade D', description: 'Marginal - Requires review', color: '#F97316', bgColor: '#FFEDD5', minScore: 60 },
  F: { label: 'Grade F', description: 'Failed - Does not meet specifications', color: '#DC2626', bgColor: '#FEE2E2', minScore: 0 },
};

export const RISK_LEVEL_CONFIG: Record<RiskLevel, {
  label: string;
  labelUk: string;
  color: string;
  bgColor: string;
  scoreRange: [number, number];
}> = {
  low: { label: 'Low', labelUk: 'Низький', color: '#10B981', bgColor: '#D1FAE5', scoreRange: [0, 25] },
  medium: { label: 'Medium', labelUk: 'Середній', color: '#F59E0B', bgColor: '#FEF3C7', scoreRange: [26, 50] },
  high: { label: 'High', labelUk: 'Високий', color: '#F97316', bgColor: '#FFEDD5', scoreRange: [51, 75] },
  critical: { label: 'Critical', labelUk: 'Критичний', color: '#DC2626', bgColor: '#FEE2E2', scoreRange: [76, 100] },
};

// ============================================================================
// AI ENGINE
// ============================================================================

export class MaterialsAIEngine {
  /**
   * Calculate AI quality score for a batch
   */
  static calculateBatchQualityScore(batch: MaterialBatch, tests: QualityTest[]): number {
    if (tests.length === 0) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const test of tests) {
      const testWeight = test.parameters.length;
      let testScore = 0;
      
      for (const param of test.parameters) {
        if (param.result === 'pass') testScore += 100;
        else if (param.result === 'conditional') testScore += 70;
        else if (param.result === 'pending') testScore += 50;
        // fail = 0
      }
      
      totalScore += (testScore / test.parameters.length) * testWeight;
      totalWeight += testWeight;
    }
    
    return Math.round(totalWeight > 0 ? totalScore / totalWeight : 0);
  }
  
  /**
   * Detect anomalies in batch
   */
  static detectAnomalies(batch: MaterialBatch, material: Material, supplier: Supplier): AIAnomaly[] {
    const anomalies: AIAnomaly[] = [];
    const now = new Date();
    
    // Price anomaly
    if (batch.unitPrice > material.currentPrice * 1.2) {
      anomalies.push({
        id: `anom-price-${batch.id}`,
        type: 'price',
        severity: batch.unitPrice > material.currentPrice * 1.5 ? 'high' : 'medium',
        description: `Unit price ${batch.unitPrice} ${batch.currency} is ${Math.round((batch.unitPrice / material.currentPrice - 1) * 100)}% above average`,
        detectedAt: now.toISOString(),
        confidence: 92,
        recommendation: 'Review pricing with procurement team and compare with alternative suppliers',
        resolved: false,
      });
    }
    
    // Delivery anomaly
    if (supplier.onTimeDeliveryRate < 80) {
      anomalies.push({
        id: `anom-delivery-${batch.id}`,
        type: 'delivery',
        severity: 'medium',
        description: `Supplier has ${supplier.onTimeDeliveryRate}% on-time delivery rate`,
        detectedAt: now.toISOString(),
        confidence: 95,
        recommendation: 'Monitor delivery closely and have backup supplier ready',
        resolved: false,
      });
    }
    
    // Supplier risk
    if (supplier.defectRate > 2) {
      anomalies.push({
        id: `anom-supplier-${batch.id}`,
        type: 'supplier',
        severity: supplier.defectRate > 5 ? 'high' : 'medium',
        description: `Supplier defect rate is ${supplier.defectRate}%`,
        detectedAt: now.toISOString(),
        confidence: 90,
        recommendation: 'Increase inspection frequency for materials from this supplier',
        resolved: false,
      });
    }
    
    // Expiry check
    if (batch.expiryDate) {
      const expiryDate = new Date(batch.expiryDate);
      const daysToExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry < 30) {
        anomalies.push({
          id: `anom-expiry-${batch.id}`,
          type: 'quality',
          severity: daysToExpiry < 7 ? 'critical' : 'high',
          description: `Material expires in ${daysToExpiry} days`,
          detectedAt: now.toISOString(),
          confidence: 100,
          recommendation: daysToExpiry < 7 
            ? 'Use immediately or return to supplier'
            : 'Prioritize usage of this batch',
          resolved: false,
        });
      }
    }
    
    return anomalies;
  }
  
  /**
   * Calculate supplier risk score
   */
  static calculateSupplierRisk(supplier: Supplier): { score: number; level: RiskLevel; factors: string[] } {
    let score = 0;
    const factors: string[] = [];
    
    // Quality risk (0-25)
    if (supplier.qualityRating < 80) {
      score += 25 - (supplier.qualityRating * 0.25);
      factors.push(`Quality rating below 80%: ${supplier.qualityRating}%`);
    }
    
    // Delivery risk (0-25)
    if (supplier.onTimeDeliveryRate < 90) {
      score += (90 - supplier.onTimeDeliveryRate) * 0.5;
      factors.push(`On-time delivery below 90%: ${supplier.onTimeDeliveryRate}%`);
    }
    
    // Defect risk (0-25)
    if (supplier.defectRate > 1) {
      score += supplier.defectRate * 5;
      factors.push(`Defect rate above 1%: ${supplier.defectRate}%`);
    }
    
    // Certification risk (0-15)
    const expiredCerts = supplier.certifications.filter(c => c.status === 'expired').length;
    if (expiredCerts > 0) {
      score += expiredCerts * 5;
      factors.push(`${expiredCerts} expired certification(s)`);
    }
    
    // Country risk (0-10)
    const highRiskCountries = ['RU', 'BY', 'IR', 'KP'];
    if (highRiskCountries.includes(supplier.country)) {
      score += 10;
      factors.push('High-risk country of origin');
    }
    
    // Determine level
    let level: RiskLevel = 'low';
    if (score >= 76) level = 'critical';
    else if (score >= 51) level = 'high';
    else if (score >= 26) level = 'medium';
    
    return { score: Math.min(100, Math.round(score)), level, factors };
  }
  
  /**
   * Verify certificate authenticity (simulated)
   */
  static async verifyCertificate(cert: MaterialCertification): Promise<{ verified: boolean; confidence: number; issues: string[] }> {
    // Simulate AI verification
    const issues: string[] = [];
    let confidence = 95;
    
    // Check expiry
    if (new Date(cert.expiryDate) < new Date()) {
      issues.push('Certificate has expired');
      confidence -= 50;
    }
    
    // Check issuing body (simulated verification)
    const trustedBodies = ['TÜV', 'SGS', 'Bureau Veritas', 'Lloyd', 'DNV'];
    const isTrusted = trustedBodies.some(body => cert.issuingBody.includes(body));
    if (!isTrusted) {
      issues.push('Issuing body not in trusted list');
      confidence -= 20;
    }
    
    return {
      verified: issues.length === 0,
      confidence: Math.max(0, confidence),
      issues,
    };
  }
  
  /**
   * Generate quality grade from test results
   */
  static determineQualityGrade(score: number): QualityGrade {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

// ============================================================================
// SERVICES
// ============================================================================

export class MaterialsService {
  static getAllMaterials(): Material[] {
    return MOCK_MATERIALS;
  }
  
  static getMaterialById(id: string): Material | undefined {
    return MOCK_MATERIALS.find(m => m.id === id);
  }
  
  static getMaterialsByCategory(category: MaterialCategory): Material[] {
    return MOCK_MATERIALS.filter(m => m.category === category);
  }
  
  static searchMaterials(query: string): Material[] {
    const q = query.toLowerCase();
    return MOCK_MATERIALS.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.nameUk.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q)
    );
  }
  
  static getLowStockMaterials(): Material[] {
    return MOCK_MATERIALS.filter(m => m.currentStock < m.minStock);
  }
}

export class SupplierService {
  static getAllSuppliers(): Supplier[] {
    return MOCK_SUPPLIERS;
  }
  
  static getSupplierById(id: string): Supplier | undefined {
    return MOCK_SUPPLIERS.find(s => s.id === id);
  }
  
  static getSuppliersByCategory(category: MaterialCategory): Supplier[] {
    return MOCK_SUPPLIERS.filter(s => s.categories.includes(category));
  }
  
  static getActiveSuppliers(): Supplier[] {
    return MOCK_SUPPLIERS.filter(s => s.status === 'active');
  }
  
  static getSuppliersByRisk(level: RiskLevel): Supplier[] {
    return MOCK_SUPPLIERS.filter(s => s.riskLevel === level);
  }
  
  static searchSuppliers(query: string): Supplier[] {
    const q = query.toLowerCase();
    return MOCK_SUPPLIERS.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.legalName.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  }
}

export class BatchService {
  static getAllBatches(): MaterialBatch[] {
    return MOCK_BATCHES;
  }
  
  static getBatchById(id: string): MaterialBatch | undefined {
    return MOCK_BATCHES.find(b => b.id === id);
  }
  
  static getBatchesByMaterial(materialId: string): MaterialBatch[] {
    return MOCK_BATCHES.filter(b => b.materialId === materialId);
  }
  
  static getBatchesByProject(projectId: string): MaterialBatch[] {
    return MOCK_BATCHES.filter(b => b.projectId === projectId);
  }
  
  static getBatchesByStatus(status: BatchStatus): MaterialBatch[] {
    return MOCK_BATCHES.filter(b => b.status === status);
  }
  
  static getPendingTestBatches(): MaterialBatch[] {
    return MOCK_BATCHES.filter(b => b.status === 'testing' || b.status === 'received');
  }
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface MaterialsDashboardMetrics {
  totalMaterials: number;
  totalSuppliers: number;
  totalBatches: number;
  lowStockAlerts: number;
  pendingTests: number;
  expiringCertificates: number;
  activeAnomalies: number;
  avgSupplierScore: number;
  monthlySpend: number;
  topCategories: { category: MaterialCategory; count: number }[];
  suppliersByRisk: Record<RiskLevel, number>;
  batchesByStatus: Record<BatchStatus, number>;
}

export class DashboardService {
  static getMetrics(): MaterialsDashboardMetrics {
    const materials = MOCK_MATERIALS;
    const suppliers = MOCK_SUPPLIERS;
    const batches = MOCK_BATCHES;
    
    // Calculate top categories
    const categoryCounts: Record<string, number> = {};
    materials.forEach(m => {
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category: category as MaterialCategory, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Suppliers by risk
    const suppliersByRisk: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    suppliers.forEach(s => {
      suppliersByRisk[s.riskLevel]++;
    });
    
    // Batches by status
    const batchesByStatus: Record<BatchStatus, number> = {
      received: 0, testing: 0, approved: 0, rejected: 0, in_use: 0, depleted: 0
    };
    batches.forEach(b => {
      batchesByStatus[b.status]++;
    });
    
    // Active anomalies
    const activeAnomalies = batches.reduce((sum, b) => 
      sum + b.aiAnomalies.filter(a => !a.resolved).length, 0
    );
    
    // Average supplier score
    const avgSupplierScore = suppliers.reduce((sum, s) => sum + s.overallScore, 0) / suppliers.length;
    
    // Monthly spend (from batches in last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlySpend = batches
      .filter(b => new Date(b.receivedDate) >= monthAgo)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    return {
      totalMaterials: materials.length,
      totalSuppliers: suppliers.length,
      totalBatches: batches.length,
      lowStockAlerts: materials.filter(m => m.currentStock < m.minStock).length,
      pendingTests: batches.filter(b => b.status === 'testing').length,
      expiringCertificates: 2, // Mock
      activeAnomalies,
      avgSupplierScore: Math.round(avgSupplierScore),
      monthlySpend,
      topCategories,
      suppliersByRisk,
      batchesByStatus,
    };
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================

export const MATERIALS_MODULE_INFO = {
  id: 'materials',
  name: 'Construction Materials',
  nameUk: 'Будівельні матеріали',
  version: '1.0.0',
  description: 'Material certification, supplier management, quality control, and AI-powered anomaly detection',
  descriptionUk: 'Сертифікація матеріалів, управління постачальниками, контроль якості та AI-виявлення аномалій',
  features: [
    'Material Registry with Specifications',
    'Supplier Management & Ratings',
    'Batch Tracking & Traceability',
    'Quality Testing & Certification',
    'AI Anomaly Detection',
    'Certificate Verification',
    'Low Stock Alerts',
    'Compliance Monitoring',
  ],
  endpoints: {
    materials: '/api/materials',
    suppliers: '/api/materials/suppliers',
    batches: '/api/materials/batches',
    tests: '/api/materials/tests',
    certifications: '/api/materials/certifications',
    dashboard: '/api/materials/dashboard',
  },
  roles: [
    { id: 'procurement', name: 'Procurement Officer', permissions: ['view_materials', 'manage_suppliers', 'create_orders'] },
    { id: 'quality', name: 'Quality Inspector', permissions: ['view_materials', 'manage_tests', 'approve_batches'] },
    { id: 'warehouse', name: 'Warehouse Manager', permissions: ['view_materials', 'receive_batches', 'manage_stock'] },
    { id: 'project', name: 'Project Manager', permissions: ['view_materials', 'request_materials', 'view_reports'] },
    { id: 'admin', name: 'Administrator', permissions: ['full_access'] },
  ],
};
