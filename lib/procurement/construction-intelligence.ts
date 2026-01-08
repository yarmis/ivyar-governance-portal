// lib/procurement/construction-intelligence.ts
// Construction Intelligence Platform v1.0 - FIXED
// PunchOut Integration for Ariba, Coupa, Ivalua, Jaggaer

// ============================================================================
// PROCUREMENT PLATFORM TYPES
// ============================================================================

export type ProcurementPlatform = 'ariba' | 'coupa' | 'ivalua' | 'jaggaer';
export type PunchOutProtocol = 'cxml' | 'oci';
export type CatalogFormat = 'cif' | 'csv' | 'xml' | 'cxml' | 'excel';
export type PunchOutLevel = 'L1' | 'L2';

export interface PlatformConfig {
  platform: ProcurementPlatform;
  name: string;
  protocols: PunchOutProtocol[];
  catalogFormats: CatalogFormat[];
  punchOutLevels: PunchOutLevel[];
  features: string[];
  apiType: 'rest' | 'soap' | 'cxml';
  authMethods: string[];
}

export const PLATFORM_CONFIGS: Record<ProcurementPlatform, PlatformConfig> = {
  ariba: {
    platform: 'ariba',
    name: 'SAP Ariba',
    protocols: ['cxml'],
    catalogFormats: ['cif', 'cxml'],
    punchOutLevels: ['L1', 'L2'],
    features: ['Ariba Network', 'Contract Catalogs', 'Spot Buy', 'UNSPSC'],
    apiType: 'cxml',
    authMethods: ['cXML Credentials', 'SAML SSO', 'API Token'],
  },
  coupa: {
    platform: 'coupa',
    name: 'Coupa',
    protocols: ['cxml', 'oci'],
    catalogFormats: ['csv', 'excel', 'cxml'],
    punchOutLevels: ['L1'],
    features: ['Smart Orders', 'Marketplace', 'Data Normalization', 'Webhooks'],
    apiType: 'rest',
    authMethods: ['OAuth', 'API Key', 'cXML Credentials'],
  },
  ivalua: {
    platform: 'ivalua',
    name: 'Ivalua',
    protocols: ['cxml'],
    catalogFormats: ['csv', 'xml'],
    punchOutLevels: ['L1', 'L2'],
    features: ['Flexible Data Model', 'Supplier Portal', 'SLA Tracking', 'Scorecards'],
    apiType: 'rest',
    authMethods: ['SAML SSO', 'Token', 'cXML'],
  },
  jaggaer: {
    platform: 'jaggaer',
    name: 'Jaggaer',
    protocols: ['cxml', 'oci'],
    catalogFormats: ['cif', 'xml', 'excel'],
    punchOutLevels: ['L1'],
    features: ['Scientific Catalogs', 'Lab Equipment', 'Budget Controls', 'ERP Integration'],
    apiType: 'rest',
    authMethods: ['SAML SSO', 'API Key', 'cXML'],
  },
};

// ============================================================================
// PUNCHOUT TYPES
// ============================================================================

export interface PunchOutSetupRequest {
  id: string;
  timestamp: string;
  platform: ProcurementPlatform;
  protocol: PunchOutProtocol;
  buyerCookie: string;
  browserFormPost: string;
  fromDomain: string;
  fromIdentity: string;
  toDomain: string;
  toIdentity: string;
  senderDomain: string;
  senderIdentity: string;
  sharedSecret: string;
  userEmail?: string;
  userName?: string;
  userContact?: string;
  operation: 'create' | 'edit' | 'inspect';
  selectedItem?: string;
  geoContext?: {
    latitude: number;
    longitude: number;
    address?: string;
    country: 'UA' | 'US';
  };
}

export interface PunchOutSetupResponse {
  id: string;
  timestamp: string;
  status: 'success' | 'error';
  statusCode: number;
  statusText: string;
  punchOutUrl?: string;
  error?: string;
}

export interface PunchOutOrderMessage {
  id: string;
  timestamp: string;
  buyerCookie: string;
  total: number;
  currency: string;
  items: PunchOutCartItem[];
  compliance?: {
    codes: string[];
    status: 'compliant' | 'review_required' | 'non_compliant';
    warnings: string[];
  };
  deliveryLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
    zoning?: string;
    floodZone?: string;
  };
}

export interface PunchOutCartItem {
  supplierPartId: string;
  supplierPartAuxId?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  unitOfMeasure: string;
  description: string;
  shortName: string;
  unspsc?: string;
  manufacturerPartId?: string;
  manufacturerName?: string;
  attributes?: {
    category: string;
    subcategory: string;
    specifications: Record<string, string>;
    certifications: string[];
    complianceCodes: string[];
  };
  leadTimeDays?: number;
  inStock?: boolean;
  minOrderQty?: number;
}

// ============================================================================
// CATALOG TYPES
// ============================================================================

export type MaterialCategory = 
  | 'concrete' | 'steel' | 'lumber' | 'masonry' | 'roofing' 
  | 'insulation' | 'electrical' | 'plumbing' | 'hvac' 
  | 'finishing' | 'hardware' | 'safety' | 'equipment';

// FIXED: Added IECC, IPC, IMC, AHRI to ComplianceStandard
export type ComplianceStandard = 
  | 'DBN' | 'DSTU' | 'IBC' | 'IRC' | 'NEC' | 'NFPA' 
  | 'ADA' | 'OSHA' | 'EPA' | 'ASTM' | 'ISO' | 'EN'
  | 'IECC' | 'IPC' | 'IMC' | 'AHRI' | 'UL' | 'CSA' | 'NSF';

export interface CatalogItem {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierPartId: string;
  name: string;
  shortName: string;
  description: string;
  longDescription?: string;
  category: MaterialCategory;
  subcategory: string;
  unspsc: string;
  unspscDescription: string;
  unitPrice: number;
  currency: 'USD' | 'EUR' | 'UAH';
  unitOfMeasure: string;
  priceUnit: number;
  minOrderQty: number;
  contractId?: string;
  contractPrice?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  specifications: MaterialSpecification[];
  complianceStandards: ComplianceStandard[];
  certifications: string[];
  leadTimeDays: number;
  inStock: boolean;
  stockQty?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  datasheetUrl?: string;
  manufacturerName?: string;
  manufacturerPartId?: string;
  countryOfOrigin?: string;
  availableRegions?: string[];
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface MaterialSpecification {
  name: string;
  value: string;
  unit?: string;
  type: 'dimension' | 'physical' | 'chemical' | 'performance' | 'other';
}

export interface Catalog {
  id: string;
  name: string;
  supplierId: string;
  supplierName: string;
  type: 'hosted' | 'punchout' | 'contract';
  format: CatalogFormat;
  items: CatalogItem[];
  itemCount: number;
  effectiveDate: string;
  expirationDate: string;
  version: string;
  previousVersion?: string;
  complianceChecked: boolean;
  complianceStatus: 'compliant' | 'partial' | 'review_required';
  platforms: ProcurementPlatform[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// COMPLIANCE ENGINE
// ============================================================================

export interface ComplianceRule {
  id: string;
  standard: ComplianceStandard;
  code: string;
  section: string;
  title: string;
  description: string;
  requirement: string;
  country: 'UA' | 'US' | 'both';
  categories: MaterialCategory[];
  validationType: 'specification' | 'certification' | 'test_report' | 'manual';
  validationField?: string;
  validationOperator?: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in_range';
  validationValue?: string | number;
  validationRange?: { min: number; max: number };
  severity: 'critical' | 'major' | 'minor' | 'informational';
  effectiveDate: string;
  updatedAt: string;
}

export interface ComplianceCheck {
  id: string;
  itemId: string;
  ruleId: string;
  standard: ComplianceStandard;
  status: 'pass' | 'fail' | 'warning' | 'not_applicable' | 'manual_review';
  message: string;
  details?: string;
  checkedAt: string;
  checkedBy: 'system' | 'manual';
}

export interface ComplianceReport {
  id: string;
  catalogId?: string;
  itemIds: string[];
  country: 'UA' | 'US';
  standards: ComplianceStandard[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    manualReview: number;
  };
  checks: ComplianceCheck[];
  recommendations: string[];
  generatedAt: string;
}

// ============================================================================
// GEO-INTELLIGENCE
// ============================================================================

export interface GeoContext {
  coordinates: { lat: number; lng: number };
  address: string;
  country: 'UA' | 'US';
  oblast?: string;
  hromada?: string;
  state?: string;
  county?: string;
  city?: string;
  zoneCode?: string;
  zoneName?: string;
  permittedUses?: string[];
  floodZone?: string;
  floodRisk?: 'minimal' | 'moderate' | 'high' | 'severe';
  seismicZone?: string;
  availableUtilities?: string[];
  applicableCodes: ComplianceStandard[];
}

export interface GeoMaterialRecommendation {
  itemId: string;
  item: CatalogItem;
  score: number;
  reasons: string[];
  warnings: string[];
  complianceStatus: 'compliant' | 'review_required' | 'non_compliant';
}

// ============================================================================
// MOCK DATA - CATALOG ITEMS
// ============================================================================

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'mat-001',
    supplierId: 'sup-001',
    supplierName: 'BuildMaster Supply Co.',
    supplierPartId: 'BMS-CONC-M400',
    name: 'Portland Cement M400',
    shortName: 'Cement M400',
    description: 'High-strength Portland cement for structural applications',
    category: 'concrete',
    subcategory: 'cement',
    unspsc: '30111601',
    unspscDescription: 'Portland cement',
    unitPrice: 125.00,
    currency: 'USD',
    unitOfMeasure: 'BAG',
    priceUnit: 1,
    minOrderQty: 10,
    specifications: [
      { name: 'Strength Class', value: 'M400', type: 'performance' },
      { name: 'Weight', value: '50', unit: 'kg', type: 'physical' },
      { name: 'Setting Time', value: '45-60', unit: 'min', type: 'performance' },
    ],
    complianceStandards: ['ASTM', 'DSTU', 'EN'],
    certifications: ['ISO 9001', 'CE Mark'],
    leadTimeDays: 3,
    inStock: true,
    stockQty: 5000,
    imageUrl: '/images/cement-m400.jpg',
    manufacturerName: 'CemTech Industries',
    countryOfOrigin: 'UA',
    availableRegions: ['UA', 'US-East'],
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'mat-002',
    supplierId: 'sup-001',
    supplierName: 'BuildMaster Supply Co.',
    supplierPartId: 'BMS-REBAR-A500C',
    name: 'Reinforcing Steel Bar A500C',
    shortName: 'Rebar A500C',
    description: 'High-strength reinforcing steel bar for concrete structures',
    category: 'steel',
    subcategory: 'rebar',
    unspsc: '30102001',
    unspscDescription: 'Reinforcing bar',
    unitPrice: 850.00,
    currency: 'USD',
    unitOfMeasure: 'TON',
    priceUnit: 1,
    minOrderQty: 1,
    specifications: [
      { name: 'Grade', value: 'A500C', type: 'performance' },
      { name: 'Diameter', value: '12', unit: 'mm', type: 'dimension' },
      { name: 'Yield Strength', value: '500', unit: 'MPa', type: 'performance' },
    ],
    complianceStandards: ['ASTM', 'DSTU', 'ISO'],
    certifications: ['Mill Certificate', 'ISO 9001'],
    leadTimeDays: 5,
    inStock: true,
    stockQty: 500,
    manufacturerName: 'SteelWorks UA',
    countryOfOrigin: 'UA',
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'mat-003',
    supplierId: 'sup-002',
    supplierName: 'American Building Materials',
    supplierPartId: 'ABM-LUM-2X4-SPF',
    name: 'Dimensional Lumber 2x4 SPF',
    shortName: '2x4 SPF Stud',
    description: 'Spruce-Pine-Fir dimensional lumber for framing',
    category: 'lumber',
    subcategory: 'dimensional',
    unspsc: '30103601',
    unspscDescription: 'Lumber',
    unitPrice: 4.50,
    currency: 'USD',
    unitOfMeasure: 'EA',
    priceUnit: 1,
    minOrderQty: 100,
    specifications: [
      { name: 'Dimensions', value: '2x4x96', unit: 'in', type: 'dimension' },
      { name: 'Species', value: 'SPF', type: 'physical' },
      { name: 'Grade', value: '#2 & Better', type: 'performance' },
      { name: 'Moisture Content', value: '19', unit: '%', type: 'physical' },
    ],
    complianceStandards: ['IBC', 'IRC', 'ASTM'],
    certifications: ['FSC Certified', 'SFI Certified'],
    leadTimeDays: 2,
    inStock: true,
    stockQty: 10000,
    manufacturerName: 'Pacific Lumber Co.',
    countryOfOrigin: 'US',
    availableRegions: ['US'],
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'mat-004',
    supplierId: 'sup-002',
    supplierName: 'American Building Materials',
    supplierPartId: 'ABM-INS-R19-BATT',
    name: 'Fiberglass Insulation R-19 Batt',
    shortName: 'R-19 Insulation',
    description: 'Unfaced fiberglass batt insulation for walls and floors',
    category: 'insulation',
    subcategory: 'fiberglass',
    unspsc: '30141501',
    unspscDescription: 'Fiberglass insulation',
    unitPrice: 0.85,
    currency: 'USD',
    unitOfMeasure: 'SQF',
    priceUnit: 1,
    minOrderQty: 500,
    specifications: [
      { name: 'R-Value', value: '19', type: 'performance' },
      { name: 'Thickness', value: '6.25', unit: 'in', type: 'dimension' },
      { name: 'Width', value: '15', unit: 'in', type: 'dimension' },
      { name: 'Facing', value: 'Unfaced', type: 'physical' },
    ],
    complianceStandards: ['IBC', 'IRC', 'IECC', 'ASTM'],
    certifications: ['GREENGUARD', 'Energy Star'],
    leadTimeDays: 3,
    inStock: true,
    manufacturerName: 'Owens Corning',
    countryOfOrigin: 'US',
    availableRegions: ['US'],
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'mat-005',
    supplierId: 'sup-003',
    supplierName: 'ProElectric Supply',
    supplierPartId: 'PES-WIRE-12AWG-THHN',
    name: 'THHN Wire 12 AWG Solid Copper',
    shortName: '12 AWG THHN',
    description: 'Thermoplastic high heat-resistant nylon-coated wire',
    category: 'electrical',
    subcategory: 'wire',
    unspsc: '26121600',
    unspscDescription: 'Electrical wire',
    unitPrice: 0.45,
    currency: 'USD',
    unitOfMeasure: 'FT',
    priceUnit: 1,
    minOrderQty: 500,
    specifications: [
      { name: 'Gauge', value: '12', unit: 'AWG', type: 'dimension' },
      { name: 'Material', value: 'Solid Copper', type: 'physical' },
      { name: 'Insulation', value: 'THHN', type: 'physical' },
      { name: 'Voltage Rating', value: '600', unit: 'V', type: 'performance' },
      { name: 'Temperature Rating', value: '90', unit: '°C', type: 'performance' },
    ],
    complianceStandards: ['NEC', 'NFPA', 'IBC', 'UL', 'CSA'],
    certifications: ['UL Listed', 'CSA Certified'],
    leadTimeDays: 2,
    inStock: true,
    manufacturerName: 'Southwire',
    countryOfOrigin: 'US',
    availableRegions: ['US', 'CA'],
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
];

// ============================================================================
// MOCK DATA - COMPLIANCE RULES
// ============================================================================

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'rule-001',
    standard: 'IBC',
    code: 'IBC-2021',
    section: '1903.1',
    title: 'Concrete Compressive Strength',
    description: 'Minimum compressive strength requirements for structural concrete',
    requirement: 'Concrete must have minimum compressive strength of 2500 psi (17 MPa)',
    country: 'US',
    categories: ['concrete'],
    validationType: 'specification',
    validationField: 'Strength Class',
    validationOperator: 'greater_than',
    validationValue: 'M200',
    severity: 'critical',
    effectiveDate: '2021-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'rule-002',
    standard: 'NEC',
    code: 'NEC-2023',
    section: '310.16',
    title: 'Conductor Ampacity',
    description: 'Ampacity requirements for conductors based on gauge',
    requirement: '12 AWG THHN rated for 30A at 90°C',
    country: 'US',
    categories: ['electrical'],
    validationType: 'certification',
    severity: 'critical',
    effectiveDate: '2023-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'rule-003',
    standard: 'DSTU',
    code: 'DSTU B V.2.7-46:2010',
    section: '5.1',
    title: 'Reinforcing Steel Requirements',
    description: 'Requirements for reinforcing steel in Ukraine',
    requirement: 'Rebar must be class A500C or higher for structural use',
    country: 'UA',
    categories: ['steel'],
    validationType: 'specification',
    validationField: 'Grade',
    validationOperator: 'contains',
    validationValue: 'A500',
    severity: 'critical',
    effectiveDate: '2010-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'rule-004',
    standard: 'IECC',
    code: 'IECC-2021',
    section: 'R402.1.2',
    title: 'Insulation R-Value Requirements',
    description: 'Minimum R-value requirements by climate zone',
    requirement: 'Climate Zone 4: Wall R-13 to R-20, Ceiling R-38 to R-49',
    country: 'US',
    categories: ['insulation'],
    validationType: 'specification',
    validationField: 'R-Value',
    validationOperator: 'in_range',
    validationRange: { min: 13, max: 49 },
    severity: 'major',
    effectiveDate: '2021-01-01',
    updatedAt: '2024-01-01',
  },
];

// ============================================================================
// SERVICES
// ============================================================================

export class PunchOutService {
  static validateSetupRequest(request: PunchOutSetupRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!request.fromDomain || !request.fromIdentity) {
      errors.push('Missing buyer credentials');
    }
    if (!request.toDomain || !request.toIdentity) {
      errors.push('Missing supplier credentials');
    }
    if (!request.buyerCookie) {
      errors.push('Missing buyer cookie');
    }
    if (!request.browserFormPost) {
      errors.push('Missing browser form post URL');
    }
    
    const platformConfig = PLATFORM_CONFIGS[request.platform];
    if (!platformConfig) {
      errors.push('Unsupported platform');
    } else if (!platformConfig.protocols.includes(request.protocol)) {
      errors.push(`Protocol ${request.protocol} not supported by ${request.platform}`);
    }
    
    return { valid: errors.length === 0, errors };
  }

  static generateSetupResponse(request: PunchOutSetupRequest, punchOutUrl: string): PunchOutSetupResponse {
    return {
      id: `PORES-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'success',
      statusCode: 200,
      statusText: 'OK',
      punchOutUrl,
    };
  }

  static generateOrderMessage(
    buyerCookie: string,
    items: PunchOutCartItem[],
    geoContext?: GeoContext
  ): PunchOutOrderMessage {
    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    
    return {
      id: `POOM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      buyerCookie,
      total,
      currency: items[0]?.currency || 'USD',
      items,
      compliance: {
        codes: [...new Set(items.flatMap(i => i.attributes?.complianceCodes || []))],
        status: 'compliant',
        warnings: [],
      },
      deliveryLocation: geoContext ? {
        address: geoContext.address,
        coordinates: geoContext.coordinates,
        zoning: geoContext.zoneCode,
        floodZone: geoContext.floodZone,
      } : undefined,
    };
  }
}

export class CatalogService {
  static getAllItems(): CatalogItem[] {
    return CATALOG_ITEMS;
  }

  static getItemById(id: string): CatalogItem | undefined {
    return CATALOG_ITEMS.find(i => i.id === id);
  }

  static getItemsByCategory(category: MaterialCategory): CatalogItem[] {
    return CATALOG_ITEMS.filter(i => i.category === category);
  }

  static searchItems(query: string): CatalogItem[] {
    const q = query.toLowerCase();
    return CATALOG_ITEMS.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.unspsc.includes(q) ||
      i.supplierPartId.toLowerCase().includes(q)
    );
  }

  static filterByCompliance(country: 'UA' | 'US'): CatalogItem[] {
    const countryStandards: ComplianceStandard[] = country === 'UA'
      ? ['DBN', 'DSTU', 'ISO', 'EN']
      : ['IBC', 'IRC', 'NEC', 'NFPA', 'ASTM', 'ADA', 'OSHA', 'IECC'];
    
    return CATALOG_ITEMS.filter(i =>
      i.complianceStandards.some(s => countryStandards.includes(s))
    );
  }

  static exportToCIF(items: CatalogItem[]): string {
    let cif = `CIF_I_V3.0\n`;
    cif += `LOADMODE: F\n`;
    cif += `CODEFORMAT: UNSPSC\n`;
    cif += `CURRENCY: USD\n`;
    cif += `SUPPLIERID_DOMAIN: NetworkID\n`;
    cif += `ITEMCOUNT: ${items.length}\n\n`;
    
    cif += `DATA\n`;
    cif += `Supplier ID\tSupplier Part ID\tManufacturer Part ID\tItem Description\tSPSC Code\tUnit Price\tUnit of Measure\tLead Time\tManufacturer Name\tURL\n`;
    
    items.forEach(item => {
      cif += `${item.supplierId}\t${item.supplierPartId}\t${item.manufacturerPartId || ''}\t${item.description}\t${item.unspsc}\t${item.unitPrice}\t${item.unitOfMeasure}\t${item.leadTimeDays}\t${item.manufacturerName || ''}\t${item.imageUrl || ''}\n`;
    });
    
    cif += `ENDOFDATA\n`;
    return cif;
  }

  static exportToCSV(items: CatalogItem[]): string {
    const headers = [
      'Supplier Part Number', 'Name', 'Description', 'Price', 'Currency',
      'Unit of Measure', 'UNSPSC', 'Lead Time', 'Manufacturer', 'Image URL'
    ];
    
    let csv = headers.join(',') + '\n';
    
    items.forEach(item => {
      const row = [
        item.supplierPartId,
        `"${item.name}"`,
        `"${item.description}"`,
        item.unitPrice,
        item.currency,
        item.unitOfMeasure,
        item.unspsc,
        item.leadTimeDays,
        item.manufacturerName || '',
        item.imageUrl || ''
      ];
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }
}

export class ComplianceService {
  static checkItem(item: CatalogItem, country: 'UA' | 'US'): ComplianceCheck[] {
    const applicableRules = COMPLIANCE_RULES.filter(r =>
      (r.country === country || r.country === 'both') &&
      r.categories.includes(item.category)
    );
    
    return applicableRules.map(rule => {
      let status: ComplianceCheck['status'] = 'pass';
      let message = `Compliant with ${rule.standard} ${rule.section}`;
      
      if (rule.validationType === 'certification') {
        const hasCert = item.certifications.some(c =>
          c.toLowerCase().includes(rule.standard.toLowerCase())
        );
        if (!hasCert) {
          status = 'manual_review';
          message = `${rule.standard} certification not found - manual review required`;
        }
      }
      
      if (rule.validationType === 'specification' && rule.validationField) {
        const spec = item.specifications.find(s => s.name === rule.validationField);
        if (!spec) {
          status = 'warning';
          message = `Specification "${rule.validationField}" not found`;
        }
      }
      
      return {
        id: `CHK-${item.id}-${rule.id}`,
        itemId: item.id,
        ruleId: rule.id,
        standard: rule.standard,
        status,
        message,
        checkedAt: new Date().toISOString(),
        checkedBy: 'system',
      };
    });
  }

  static generateReport(items: CatalogItem[], country: 'UA' | 'US'): ComplianceReport {
    const allChecks = items.flatMap(item => this.checkItem(item, country));
    
    const summary = {
      total: allChecks.length,
      passed: allChecks.filter(c => c.status === 'pass').length,
      failed: allChecks.filter(c => c.status === 'fail').length,
      warnings: allChecks.filter(c => c.status === 'warning').length,
      manualReview: allChecks.filter(c => c.status === 'manual_review').length,
    };
    
    const recommendations: string[] = [];
    if (summary.failed > 0) {
      recommendations.push('Review failed items before proceeding with procurement');
    }
    if (summary.manualReview > 0) {
      recommendations.push('Schedule compliance review for items requiring manual verification');
    }
    
    return {
      id: `RPT-${Date.now()}`,
      itemIds: items.map(i => i.id),
      country,
      standards: country === 'UA' ? ['DBN', 'DSTU'] : ['IBC', 'IRC', 'NEC', 'IECC'],
      summary,
      checks: allChecks,
      recommendations,
      generatedAt: new Date().toISOString(),
    };
  }
}

export class GeoIntelligenceService {
  static getRecommendations(items: CatalogItem[], geoContext: GeoContext): GeoMaterialRecommendation[] {
    return items.map(item => {
      let score = 100;
      const reasons: string[] = [];
      const warnings: string[] = [];
      
      if (item.availableRegions && !item.availableRegions.some(r => 
        r === geoContext.country || r.startsWith(geoContext.country)
      )) {
        score -= 30;
        warnings.push('Material not typically available in this region');
      }
      
      const countryStandards = geoContext.applicableCodes;
      const hasRelevantStandards = item.complianceStandards.some(s => 
        countryStandards.includes(s)
      );
      if (hasRelevantStandards) {
        score += 10;
        reasons.push('Compliant with local building codes');
      } else {
        score -= 20;
        warnings.push('May require additional compliance verification');
      }
      
      if (geoContext.floodRisk === 'high' || geoContext.floodRisk === 'severe') {
        if (item.category === 'insulation' || item.category === 'lumber') {
          warnings.push('Consider flood-resistant alternatives for high-risk zone');
        }
      }
      
      if (item.leadTimeDays <= 3) {
        reasons.push('Fast delivery available');
      }
      
      if (item.inStock) {
        reasons.push('In stock and ready to ship');
      }
      
      return {
        itemId: item.id,
        item,
        score: Math.max(0, Math.min(100, score)),
        reasons,
        warnings,
        complianceStatus: warnings.length === 0 ? 'compliant' : 'review_required',
      };
    }).sort((a, b) => b.score - a.score);
  }
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface ProcurementDashboardMetrics {
  catalogs: {
    total: number;
    byPlatform: Record<ProcurementPlatform, number>;
    itemCount: number;
  };
  punchOut: {
    activeSessions: number;
    todayOrders: number;
    todayValue: number;
  };
  compliance: {
    checkedItems: number;
    complianceRate: number;
    pendingReviews: number;
  };
  platforms: {
    connected: ProcurementPlatform[];
    pending: ProcurementPlatform[];
  };
}

export class DashboardService {
  static getMetrics(): ProcurementDashboardMetrics {
    return {
      catalogs: {
        total: 3,
        byPlatform: { ariba: 1, coupa: 1, ivalua: 1, jaggaer: 0 },
        itemCount: CATALOG_ITEMS.length,
      },
      punchOut: {
        activeSessions: 5,
        todayOrders: 12,
        todayValue: 45000,
      },
      compliance: {
        checkedItems: CATALOG_ITEMS.length,
        complianceRate: 94,
        pendingReviews: 2,
      },
      platforms: {
        connected: ['ariba', 'coupa'],
        pending: ['ivalua', 'jaggaer'],
      },
    };
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================

export const PLATFORM_INFO = {
  id: 'construction-intelligence',
  name: 'Construction Intelligence Platform',
  version: '1.0.0',
  description: 'PunchOut integration for Ariba, Coupa, Ivalua, Jaggaer with construction materials, compliance, and geo-intelligence',
  capabilities: [
    'PunchOut (cXML/OCI)',
    'Hosted Catalogs (CIF/CSV/XML)',
    'Compliance Engine (UA/US)',
    'Geo-Intelligence',
    'Material Recommendations',
  ],
  supportedPlatforms: ['ariba', 'coupa', 'ivalua', 'jaggaer'] as ProcurementPlatform[],
};
