// lib/zoning/zoning-hub.ts
// IVYAR Zoning & Cadastre Module v1.0
// Land Zoning, Cadastre Management, Restrictions & AI Compliance

// ============================================================================
// TYPES
// ============================================================================

export type ZoneType = 'residential' | 'commercial' | 'industrial' | 'mixed_use' | 'agricultural' | 'recreational' | 'protected' | 'infrastructure' | 'military' | 'reserve';
export type ParcelStatus = 'active' | 'pending_registration' | 'disputed' | 'subdividing' | 'merging' | 'archived';
export type RestrictionType = 'height_limit' | 'setback' | 'coverage' | 'density' | 'use_prohibition' | 'heritage' | 'environmental' | 'easement' | 'utility' | 'flood_zone' | 'seismic' | 'noise' | 'airport';
export type RestrictionSeverity = 'advisory' | 'standard' | 'strict' | 'absolute';
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review' | 'exempted' | 'conditional';
export type OwnershipType = 'private' | 'state' | 'municipal' | 'communal' | 'mixed' | 'unknown';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type PermitStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired' | 'revoked';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Zone {
  id: string;
  code: string;
  name: string;
  nameUk: string;
  type: ZoneType;
  description: string;
  color: string;
  maxHeight: number;
  maxStoreys: number;
  maxCoverage: number;
  maxFAR: number;
  minSetback: number;
  permittedUses: string[];
  prohibitedUses: string[];
  area: number;
  parcelsCount: number;
}

export interface Parcel {
  id: string;
  cadastralNumber: string;
  address: string;
  addressUk: string;
  zoneId: string;
  zoneName: string;
  area: number;
  coordinates: { lat: number; lng: number };
  status: ParcelStatus;
  ownershipType: OwnershipType;
  ownerName?: string;
  landUse: string;
  landUseUk: string;
  restrictions: ParcelRestriction[];
  valuationUAH: number;
  valuationEUR: number;
  lastValuationDate: string;
  registrationDate: string;
  aiComplianceScore: number;
  aiRiskFactors: string[];
}

export interface ParcelRestriction {
  id: string;
  type: RestrictionType;
  severity: RestrictionSeverity;
  description: string;
  value?: string | number;
  unit?: string;
  status: 'active' | 'expired' | 'suspended';
}

export interface Restriction {
  id: string;
  code: string;
  type: RestrictionType;
  name: string;
  nameUk: string;
  severity: RestrictionSeverity;
  description: string;
  legalBasis: string;
  penaltyRange: string;
}

export interface BuildingPermit {
  id: string;
  permitNumber: string;
  parcelId: string;
  cadastralNumber: string;
  type: 'construction' | 'reconstruction' | 'renovation' | 'demolition';
  status: PermitStatus;
  projectName: string;
  applicant: string;
  submittedDate: string;
  decisionDate?: string;
  expiryDate?: string;
  proposedHeight: number;
  proposedStoreys: number;
  proposedArea: number;
  complianceScore: number;
  violations: string[];
}

export interface ZoningApplication {
  id: string;
  applicationNumber: string;
  type: 'rezoning' | 'variance' | 'subdivision' | 'merger';
  status: 'draft' | 'submitted' | 'public_notice' | 'hearing' | 'approved' | 'denied';
  parcelId: string;
  currentZone: string;
  proposedZone?: string;
  applicant: string;
  submittedDate: string;
  hearingDate?: string;
  publicComments: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const ZONES: Zone[] = [
  {
    id: 'zone-001', code: 'R-1', name: 'Residential Low Density', nameUk: 'Житлова низької щільності',
    type: 'residential', description: 'Single-family homes, max 3 stories',
    color: '#FEF3C7', maxHeight: 12, maxStoreys: 3, maxCoverage: 30, maxFAR: 0.8, minSetback: 6,
    permittedUses: ['Single-family', 'Duplex', 'Parks'], prohibitedUses: ['Commercial', 'Industrial'],
    area: 450, parcelsCount: 2100
  },
  {
    id: 'zone-002', code: 'R-2', name: 'Residential Medium Density', nameUk: 'Житлова середньої щільності',
    type: 'residential', description: 'Multi-family housing up to 5 stories',
    color: '#FCD34D', maxHeight: 18, maxStoreys: 5, maxCoverage: 40, maxFAR: 1.5, minSetback: 6,
    permittedUses: ['Multi-family', 'Schools', 'Parks'], prohibitedUses: ['Industrial', 'Heavy commercial'],
    area: 245, parcelsCount: 1250
  },
  {
    id: 'zone-003', code: 'R-3', name: 'Residential High Density', nameUk: 'Житлова високої щільності',
    type: 'residential', description: 'High-rise residential up to 25 stories',
    color: '#F59E0B', maxHeight: 75, maxStoreys: 25, maxCoverage: 50, maxFAR: 3.0, minSetback: 10,
    permittedUses: ['High-rise residential', 'Retail podium'], prohibitedUses: ['Industrial'],
    area: 85, parcelsCount: 320
  },
  {
    id: 'zone-004', code: 'C-1', name: 'Commercial Core', nameUk: 'Комерційне ядро',
    type: 'commercial', description: 'Central business district, high-rise office',
    color: '#3B82F6', maxHeight: 100, maxStoreys: 30, maxCoverage: 70, maxFAR: 5.0, minSetback: 0,
    permittedUses: ['Offices', 'Retail', 'Hotels', 'Entertainment'], prohibitedUses: ['Industrial', 'Warehousing'],
    area: 65, parcelsCount: 420
  },
  {
    id: 'zone-005', code: 'C-2', name: 'Commercial General', nameUk: 'Комерційне загальне',
    type: 'commercial', description: 'General commercial and retail',
    color: '#60A5FA', maxHeight: 25, maxStoreys: 6, maxCoverage: 60, maxFAR: 2.5, minSetback: 3,
    permittedUses: ['Retail', 'Restaurants', 'Services'], prohibitedUses: ['Heavy industrial'],
    area: 120, parcelsCount: 680
  },
  {
    id: 'zone-006', code: 'I-1', name: 'Light Industrial', nameUk: 'Легка промисловість',
    type: 'industrial', description: 'Light manufacturing and warehousing',
    color: '#A855F7', maxHeight: 25, maxStoreys: 4, maxCoverage: 60, maxFAR: 2.0, minSetback: 10,
    permittedUses: ['Light manufacturing', 'Warehousing', 'Distribution'], prohibitedUses: ['Residential'],
    area: 320, parcelsCount: 185
  },
  {
    id: 'zone-007', code: 'I-2', name: 'Heavy Industrial', nameUk: 'Важка промисловість',
    type: 'industrial', description: 'Heavy manufacturing with buffer zones',
    color: '#7C3AED', maxHeight: 40, maxStoreys: 6, maxCoverage: 50, maxFAR: 1.5, minSetback: 50,
    permittedUses: ['Heavy manufacturing', 'Processing'], prohibitedUses: ['Residential', 'Schools', 'Hospitals'],
    area: 180, parcelsCount: 75
  },
  {
    id: 'zone-008', code: 'MU-1', name: 'Mixed Use', nameUk: 'Змішане використання',
    type: 'mixed_use', description: 'Combined residential and commercial',
    color: '#EC4899', maxHeight: 35, maxStoreys: 10, maxCoverage: 55, maxFAR: 3.0, minSetback: 5,
    permittedUses: ['Residential', 'Retail', 'Office', 'Entertainment'], prohibitedUses: ['Industrial'],
    area: 95, parcelsCount: 450
  },
  {
    id: 'zone-009', code: 'P-1', name: 'Protected Natural', nameUk: 'Природоохоронна',
    type: 'protected', description: 'Protected natural areas, no construction',
    color: '#10B981', maxHeight: 0, maxStoreys: 0, maxCoverage: 0, maxFAR: 0, minSetback: 100,
    permittedUses: ['Conservation', 'Eco-tourism trails'], prohibitedUses: ['Any construction'],
    area: 1250, parcelsCount: 45
  },
  {
    id: 'zone-010', code: 'A-1', name: 'Agricultural', nameUk: 'Сільськогосподарська',
    type: 'agricultural', description: 'Agricultural land use',
    color: '#84CC16', maxHeight: 12, maxStoreys: 2, maxCoverage: 10, maxFAR: 0.2, minSetback: 20,
    permittedUses: ['Farming', 'Agricultural buildings'], prohibitedUses: ['Residential subdivisions', 'Commercial'],
    area: 2500, parcelsCount: 890
  },
];

export const PARCELS: Parcel[] = [
  {
    id: 'parcel-001', cadastralNumber: '8000000000:01:001:0001',
    address: '15 Khreshchatyk Street, Kyiv', addressUk: 'вул. Хрещатик, 15, м. Київ',
    zoneId: 'zone-004', zoneName: 'Commercial Core', area: 2500, coordinates: { lat: 50.4501, lng: 30.5234 },
    status: 'active', ownershipType: 'private', ownerName: 'Kyiv Development LLC',
    landUse: 'Commercial - Office', landUseUk: 'Комерційне - Офіс',
    restrictions: [{ id: 'r1', type: 'heritage', severity: 'strict', description: 'Heritage protection zone', status: 'active' }],
    valuationUAH: 125000000, valuationEUR: 3125000, lastValuationDate: '2024-01-15', registrationDate: '2005-03-20',
    aiComplianceScore: 85, aiRiskFactors: ['Heritage zone restrictions']
  },
  {
    id: 'parcel-002', cadastralNumber: '8000000000:02:015:0045',
    address: '78 Peremohy Avenue, Kyiv', addressUk: 'просп. Перемоги, 78, м. Київ',
    zoneId: 'zone-002', zoneName: 'Residential Medium', area: 5000, coordinates: { lat: 50.4567, lng: 30.4123 },
    status: 'active', ownershipType: 'municipal',
    landUse: 'Residential - Multi-family', landUseUk: 'Житлове - Багатоквартирне',
    restrictions: [{ id: 'r2', type: 'height_limit', severity: 'standard', description: 'Max 18m height', value: 18, unit: 'm', status: 'active' }],
    valuationUAH: 45000000, valuationEUR: 1125000, lastValuationDate: '2023-09-01', registrationDate: '1995-08-12',
    aiComplianceScore: 92, aiRiskFactors: []
  },
  {
    id: 'parcel-003', cadastralNumber: '8000000000:03:022:0112',
    address: '25 Industrial Street, Kyiv', addressUk: 'вул. Промислова, 25, м. Київ',
    zoneId: 'zone-006', zoneName: 'Light Industrial', area: 15000, coordinates: { lat: 50.4234, lng: 30.5567 },
    status: 'disputed', ownershipType: 'private', ownerName: 'Industrial Holdings JSC',
    landUse: 'Industrial - Manufacturing', landUseUk: 'Промислове - Виробництво',
    restrictions: [{ id: 'r3', type: 'environmental', severity: 'strict', description: 'Environmental remediation required', status: 'active' }],
    valuationUAH: 28000000, valuationEUR: 700000, lastValuationDate: '2022-12-01', registrationDate: '1998-04-22',
    aiComplianceScore: 45, aiRiskFactors: ['Ownership dispute', 'Environmental contamination']
  },
  {
    id: 'parcel-004', cadastralNumber: '8000000000:04:008:0078',
    address: '112 Shevchenko Boulevard, Kyiv', addressUk: 'бульв. Шевченка, 112, м. Київ',
    zoneId: 'zone-008', zoneName: 'Mixed Use', area: 3200, coordinates: { lat: 50.4412, lng: 30.5089 },
    status: 'active', ownershipType: 'private', ownerName: 'Urban Mix Development',
    landUse: 'Mixed Use - Residential/Retail', landUseUk: 'Змішане - Житло/Торгівля',
    restrictions: [],
    valuationUAH: 68000000, valuationEUR: 1700000, lastValuationDate: '2024-03-10', registrationDate: '2015-07-18',
    aiComplianceScore: 98, aiRiskFactors: []
  },
  {
    id: 'parcel-005', cadastralNumber: '8000000000:05:003:0234',
    address: 'Holosiivskyi Forest Area', addressUk: 'Голосіївський ліс',
    zoneId: 'zone-009', zoneName: 'Protected Natural', area: 250000, coordinates: { lat: 50.3856, lng: 30.5123 },
    status: 'active', ownershipType: 'state',
    landUse: 'Protected - Nature Reserve', landUseUk: 'Охоронна - Природний заповідник',
    restrictions: [{ id: 'r4', type: 'use_prohibition', severity: 'absolute', description: 'No construction allowed', status: 'active' }],
    valuationUAH: 0, valuationEUR: 0, lastValuationDate: '2020-01-01', registrationDate: '1990-06-15',
    aiComplianceScore: 100, aiRiskFactors: []
  },
];

export const RESTRICTIONS: Restriction[] = [
  { id: 'rest-001', code: 'HRT-001', type: 'heritage', name: 'Heritage Protection', nameUk: 'Охорона памяток', severity: 'strict', description: 'Cultural heritage protection zone', legalBasis: 'Law on Cultural Heritage Protection', penaltyRange: '500-5000 min wages' },
  { id: 'rest-002', code: 'HGT-001', type: 'height_limit', name: 'Height Restriction', nameUk: 'Обмеження висоти', severity: 'standard', description: 'Building height limitation', legalBasis: 'DBN B.2.2-12:2019', penaltyRange: '100-1000 min wages' },
  { id: 'rest-003', code: 'ENV-001', type: 'environmental', name: 'Environmental Zone', nameUk: 'Екологічна зона', severity: 'strict', description: 'Environmental protection requirements', legalBasis: 'Law on Environmental Protection', penaltyRange: '1000-10000 min wages' },
  { id: 'rest-004', code: 'FLD-001', type: 'flood_zone', name: 'Flood Risk Zone', nameUk: 'Зона затоплення', severity: 'strict', description: 'Flood risk area restrictions', legalBasis: 'Water Code of Ukraine', penaltyRange: '200-2000 min wages' },
  { id: 'rest-005', code: 'SET-001', type: 'setback', name: 'Setback Requirement', nameUk: 'Вимога відступу', severity: 'standard', description: 'Minimum building setback', legalBasis: 'DBN B.2.2-12:2019', penaltyRange: '50-500 min wages' },
  { id: 'rest-006', code: 'APT-001', type: 'airport', name: 'Airport Vicinity', nameUk: 'Зона аеропорту', severity: 'strict', description: 'Airport height and noise restrictions', legalBasis: 'Air Code of Ukraine', penaltyRange: '500-5000 min wages' },
];

export const PERMITS: BuildingPermit[] = [
  {
    id: 'permit-001', permitNumber: 'BP-2025-0001', parcelId: 'parcel-001', cadastralNumber: '8000000000:01:001:0001',
    type: 'reconstruction', status: 'under_review', projectName: 'Khreshchatyk Business Center Renovation',
    applicant: 'Kyiv Development LLC', submittedDate: '2025-01-02', expiryDate: '2026-01-02',
    proposedHeight: 45, proposedStoreys: 12, proposedArea: 28000, complianceScore: 78,
    violations: ['Exceeds heritage zone height limit by 5m']
  },
  {
    id: 'permit-002', permitNumber: 'BP-2025-0002', parcelId: 'parcel-002', cadastralNumber: '8000000000:02:015:0045',
    type: 'construction', status: 'approved', projectName: 'Peremohy Residential Complex',
    applicant: 'City Housing Department', submittedDate: '2024-11-15', decisionDate: '2024-12-20', expiryDate: '2027-12-20',
    proposedHeight: 18, proposedStoreys: 5, proposedArea: 12500, complianceScore: 100,
    violations: []
  },
  {
    id: 'permit-003', permitNumber: 'BP-2024-0089', parcelId: 'parcel-004', cadastralNumber: '8000000000:04:008:0078',
    type: 'construction', status: 'approved', projectName: 'Shevchenko Mixed-Use Tower',
    applicant: 'Urban Mix Development', submittedDate: '2024-06-10', decisionDate: '2024-08-15', expiryDate: '2027-08-15',
    proposedHeight: 32, proposedStoreys: 9, proposedArea: 18500, complianceScore: 95,
    violations: []
  },
  {
    id: 'permit-004', permitNumber: 'BP-2025-0003', parcelId: 'parcel-003', cadastralNumber: '8000000000:03:022:0112',
    type: 'renovation', status: 'rejected', projectName: 'Industrial Facility Expansion',
    applicant: 'Industrial Holdings JSC', submittedDate: '2025-01-05', decisionDate: '2025-01-06',
    proposedHeight: 30, proposedStoreys: 5, proposedArea: 8000, complianceScore: 35,
    violations: ['Environmental remediation not completed', 'Ownership dispute unresolved', 'Buffer zone violation']
  },
];

export const APPLICATIONS: ZoningApplication[] = [
  {
    id: 'app-001', applicationNumber: 'ZA-2025-0001', type: 'rezoning', status: 'public_notice',
    parcelId: 'parcel-002', currentZone: 'R-2', proposedZone: 'R-3',
    applicant: 'City Housing Department', submittedDate: '2024-12-15', hearingDate: '2025-02-01', publicComments: 23
  },
  {
    id: 'app-002', applicationNumber: 'ZA-2025-0002', type: 'variance', status: 'submitted',
    parcelId: 'parcel-001', currentZone: 'C-1',
    applicant: 'Kyiv Development LLC', submittedDate: '2025-01-03', publicComments: 5
  },
  {
    id: 'app-003', applicationNumber: 'ZA-2024-0045', type: 'subdivision', status: 'approved',
    parcelId: 'parcel-003', currentZone: 'I-1',
    applicant: 'Industrial Holdings JSC', submittedDate: '2024-09-20', publicComments: 8
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

export const ZONE_TYPE_CONFIG: Record<ZoneType, { label: string; labelUk: string; color: string; icon: string }> = {
  residential: { label: 'Residential', labelUk: 'Житлова', color: '#F59E0B', icon: '🏠' },
  commercial: { label: 'Commercial', labelUk: 'Комерційна', color: '#3B82F6', icon: '🏢' },
  industrial: { label: 'Industrial', labelUk: 'Промислова', color: '#8B5CF6', icon: '🏭' },
  mixed_use: { label: 'Mixed Use', labelUk: 'Змішана', color: '#EC4899', icon: '🏙️' },
  agricultural: { label: 'Agricultural', labelUk: 'Сільськогосподарська', color: '#84CC16', icon: '🌾' },
  recreational: { label: 'Recreational', labelUk: 'Рекреаційна', color: '#14B8A6', icon: '🏞️' },
  protected: { label: 'Protected', labelUk: 'Охоронна', color: '#10B981', icon: '🌲' },
  infrastructure: { label: 'Infrastructure', labelUk: 'Інфраструктурна', color: '#6B7280', icon: '🛤️' },
  military: { label: 'Military', labelUk: 'Військова', color: '#991B1B', icon: '🎖️' },
  reserve: { label: 'Reserve', labelUk: 'Резервна', color: '#9CA3AF', icon: '📋' },
};

export const PARCEL_STATUS_CONFIG: Record<ParcelStatus, { label: string; labelUk: string; color: string; bg: string }> = {
  active: { label: 'Active', labelUk: 'Активна', color: '#10B981', bg: '#D1FAE5' },
  pending_registration: { label: 'Pending', labelUk: 'Очікує реєстрації', color: '#F59E0B', bg: '#FEF3C7' },
  disputed: { label: 'Disputed', labelUk: 'Оспорюється', color: '#EF4444', bg: '#FEE2E2' },
  subdividing: { label: 'Subdividing', labelUk: 'Поділ', color: '#3B82F6', bg: '#DBEAFE' },
  merging: { label: 'Merging', labelUk: 'Об\'єднання', color: '#8B5CF6', bg: '#EDE9FE' },
  archived: { label: 'Archived', labelUk: 'Архівна', color: '#6B7280', bg: '#F3F4F6' },
};

export const RESTRICTION_TYPE_CONFIG: Record<RestrictionType, { label: string; labelUk: string; icon: string; color: string }> = {
  height_limit: { label: 'Height Limit', labelUk: 'Обмеження висоти', icon: '📏', color: '#F59E0B' },
  setback: { label: 'Setback', labelUk: 'Відступ', icon: '↔️', color: '#3B82F6' },
  coverage: { label: 'Coverage', labelUk: 'Покриття', icon: '⬛', color: '#8B5CF6' },
  density: { label: 'Density', labelUk: 'Щільність', icon: '🏢', color: '#EC4899' },
  use_prohibition: { label: 'Use Prohibition', labelUk: 'Заборона використання', icon: '🚫', color: '#EF4444' },
  heritage: { label: 'Heritage', labelUk: 'Памятка', icon: '🏛️', color: '#92400E' },
  environmental: { label: 'Environmental', labelUk: 'Екологічна', icon: '🌿', color: '#10B981' },
  easement: { label: 'Easement', labelUk: 'Сервітут', icon: '📜', color: '#6B7280' },
  utility: { label: 'Utility', labelUk: 'Комунікації', icon: '⚡', color: '#FBBF24' },
  flood_zone: { label: 'Flood Zone', labelUk: 'Зона затоплення', icon: '🌊', color: '#0EA5E9' },
  seismic: { label: 'Seismic', labelUk: 'Сейсмічна', icon: '🌋', color: '#DC2626' },
  noise: { label: 'Noise', labelUk: 'Шумова', icon: '🔊', color: '#F97316' },
  airport: { label: 'Airport', labelUk: 'Аеропорт', icon: '✈️', color: '#0284C7' },
};

export const SEVERITY_CONFIG: Record<RestrictionSeverity, { label: string; labelUk: string; color: string; bg: string }> = {
  advisory: { label: 'Advisory', labelUk: 'Рекомендаційна', color: '#3B82F6', bg: '#DBEAFE' },
  standard: { label: 'Standard', labelUk: 'Стандартна', color: '#F59E0B', bg: '#FEF3C7' },
  strict: { label: 'Strict', labelUk: 'Сувора', color: '#F97316', bg: '#FFEDD5' },
  absolute: { label: 'Absolute', labelUk: 'Абсолютна', color: '#DC2626', bg: '#FEE2E2' },
};

export const PERMIT_STATUS_CONFIG: Record<PermitStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#6B7280', bg: '#F3F4F6' },
  submitted: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: '#FEF3C7' },
  approved: { label: 'Approved', color: '#10B981', bg: '#D1FAE5' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: '#FEE2E2' },
  expired: { label: 'Expired', color: '#9CA3AF', bg: '#F3F4F6' },
  revoked: { label: 'Revoked', color: '#DC2626', bg: '#FEE2E2' },
};

// ============================================================================
// AI ENGINE
// ============================================================================

export class ZoningAIEngine {
  static checkCompliance(parcel: Parcel, zone: Zone, permit: Partial<BuildingPermit>): { score: number; violations: string[] } {
    const violations: string[] = [];
    let score = 100;

    if (permit.proposedHeight && permit.proposedHeight > zone.maxHeight) {
      violations.push(`Height ${permit.proposedHeight}m exceeds zone max ${zone.maxHeight}m`);
      score -= 20;
    }

    if (permit.proposedStoreys && permit.proposedStoreys > zone.maxStoreys) {
      violations.push(`${permit.proposedStoreys} storeys exceeds zone max ${zone.maxStoreys}`);
      score -= 15;
    }

    if (parcel.restrictions.some(r => r.type === 'heritage' && r.status === 'active')) {
      if (permit.proposedHeight && permit.proposedHeight > 40) {
        violations.push('Heritage zone: height over 40m requires special approval');
        score -= 25;
      }
    }

    if (parcel.restrictions.some(r => r.type === 'environmental' && r.status === 'active')) {
      violations.push('Environmental restrictions: remediation verification required');
      score -= 15;
    }

    if (parcel.status === 'disputed') {
      violations.push('Parcel ownership is disputed - permits suspended');
      score -= 30;
    }

    return { score: Math.max(0, score), violations };
  }

  static assessParcelRisk(parcel: Parcel): { level: RiskLevel; factors: string[] } {
    const factors: string[] = [];
    let riskScore = 0;

    if (parcel.status === 'disputed') {
      factors.push('Ownership dispute');
      riskScore += 40;
    }

    const strictRestrictions = parcel.restrictions.filter(r => r.severity === 'strict' || r.severity === 'absolute');
    if (strictRestrictions.length > 0) {
      factors.push(`${strictRestrictions.length} strict restriction(s)`);
      riskScore += strictRestrictions.length * 15;
    }

    if (parcel.aiComplianceScore < 60) {
      factors.push('Low compliance score');
      riskScore += 20;
    }

    let level: RiskLevel = 'low';
    if (riskScore >= 60) level = 'critical';
    else if (riskScore >= 40) level = 'high';
    else if (riskScore >= 20) level = 'medium';

    return { level, factors };
  }
}

// ============================================================================
// SERVICES
// ============================================================================

export class ZoningService {
  static getZones = () => ZONES;
  static getZoneById = (id: string) => ZONES.find(z => z.id === id);
  static getZoneByCode = (code: string) => ZONES.find(z => z.code === code);
  static getZonesByType = (type: ZoneType) => ZONES.filter(z => z.type === type);
}

export class ParcelService {
  static getParcels = () => PARCELS;
  static getParcelById = (id: string) => PARCELS.find(p => p.id === id);
  static getParcelByCadastral = (num: string) => PARCELS.find(p => p.cadastralNumber === num);
  static getParcelsByZone = (zoneId: string) => PARCELS.filter(p => p.zoneId === zoneId);
  static getParcelsByStatus = (status: ParcelStatus) => PARCELS.filter(p => p.status === status);
  static getDisputedParcels = () => PARCELS.filter(p => p.status === 'disputed');
}

export class PermitService {
  static getPermits = () => PERMITS;
  static getPermitById = (id: string) => PERMITS.find(p => p.id === id);
  static getPermitsByParcel = (parcelId: string) => PERMITS.filter(p => p.parcelId === parcelId);
  static getPermitsByStatus = (status: PermitStatus) => PERMITS.filter(p => p.status === status);
  static getPendingPermits = () => PERMITS.filter(p => p.status === 'submitted' || p.status === 'under_review');
}

export class ApplicationService {
  static getApplications = () => APPLICATIONS;
  static getApplicationById = (id: string) => APPLICATIONS.find(a => a.id === id);
  static getPendingApplications = () => APPLICATIONS.filter(a => ['submitted', 'public_notice', 'hearing'].includes(a.status));
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface ZoningDashboardMetrics {
  totalZones: number;
  totalParcels: number;
  totalArea: number;
  disputedParcels: number;
  pendingPermits: number;
  pendingApplications: number;
  avgComplianceScore: number;
  zonesByType: Record<ZoneType, number>;
  parcelsByStatus: Record<ParcelStatus, number>;
  recentActivity: { type: string; description: string; date: string }[];
}

export class DashboardService {
  static getMetrics(): ZoningDashboardMetrics {
    const zonesByType: Record<ZoneType, number> = {} as any;
    ZONES.forEach(z => { zonesByType[z.type] = (zonesByType[z.type] || 0) + 1; });

    const parcelsByStatus: Record<ParcelStatus, number> = {} as any;
    PARCELS.forEach(p => { parcelsByStatus[p.status] = (parcelsByStatus[p.status] || 0) + 1; });

    return {
      totalZones: ZONES.length,
      totalParcels: PARCELS.length,
      totalArea: ZONES.reduce((sum, z) => sum + z.area, 0),
      disputedParcels: PARCELS.filter(p => p.status === 'disputed').length,
      pendingPermits: PERMITS.filter(p => ['submitted', 'under_review'].includes(p.status)).length,
      pendingApplications: APPLICATIONS.filter(a => ['submitted', 'public_notice', 'hearing'].includes(a.status)).length,
      avgComplianceScore: Math.round(PARCELS.reduce((sum, p) => sum + p.aiComplianceScore, 0) / PARCELS.length),
      zonesByType,
      parcelsByStatus,
      recentActivity: [
        { type: 'permit', description: 'BP-2025-0003 rejected - violations found', date: '2025-01-06' },
        { type: 'application', description: 'ZA-2025-0001 public notice period started', date: '2025-01-05' },
        { type: 'parcel', description: 'Parcel 8000000000:03:022:0112 status changed to disputed', date: '2025-01-04' },
      ],
    };
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================

export const ZONING_MODULE_INFO = {
  id: 'zoning',
  name: 'Zoning & Cadastre',
  nameUk: 'Зонування та кадастр',
  version: '1.0.0',
  description: 'Land zoning, cadastre management, restrictions, and AI compliance checking',
  descriptionUk: 'Зонування земель, управління кадастром, обмеження та AI-перевірка відповідності',
};
