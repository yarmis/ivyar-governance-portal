// lib/us-construction/us-hub.ts
// IVYAR US Construction Governance Hub v1.0
// IBC/IRC Building Codes, US Zoning, County Permits, FEMA Compliance

// ============================================================================
// US GEOGRAPHIC TYPES
// ============================================================================

export type USState = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

export interface Jurisdiction {
  id: string;
  name: string;
  type: 'state' | 'county' | 'city' | 'township';
  state: USState;
  county?: string;
  fipsCode: string;
  population: number;
  adoptedCodes: AdoptedCode[];
  contactInfo: JurisdictionContact;
}

export interface JurisdictionContact {
  department: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hoursOfOperation: string;
}

export interface AdoptedCode {
  code: BuildingCodeType;
  edition: string;
  effectiveDate: string;
  amendments: string[];
}

// ============================================================================
// US BUILDING CODES
// ============================================================================

export type BuildingCodeType =
  | 'IBC'      // International Building Code
  | 'IRC'      // International Residential Code
  | 'IPC'      // International Plumbing Code
  | 'IMC'      // International Mechanical Code
  | 'IFC'      // International Fire Code
  | 'IECC'     // International Energy Conservation Code
  | 'IEC'      // International Electrical Code
  | 'NEC'      // National Electrical Code (NFPA 70)
  | 'ADA'      // Americans with Disabilities Act
  | 'OSHA'     // Occupational Safety and Health
  | 'EPA'      // Environmental Protection Agency
  | 'NFPA';    // National Fire Protection Association

export type OccupancyGroup =
  | 'A-1' | 'A-2' | 'A-3' | 'A-4' | 'A-5'  // Assembly
  | 'B'                                      // Business
  | 'E'                                      // Educational
  | 'F-1' | 'F-2'                           // Factory/Industrial
  | 'H-1' | 'H-2' | 'H-3' | 'H-4' | 'H-5'  // High Hazard
  | 'I-1' | 'I-2' | 'I-3' | 'I-4'          // Institutional
  | 'M'                                      // Mercantile
  | 'R-1' | 'R-2' | 'R-3' | 'R-4'          // Residential
  | 'S-1' | 'S-2'                           // Storage
  | 'U';                                     // Utility

export type ConstructionType = 'I-A' | 'I-B' | 'II-A' | 'II-B' | 'III-A' | 'III-B' | 'IV' | 'V-A' | 'V-B';

export interface BuildingCodeRequirement {
  id: string;
  code: BuildingCodeType;
  section: string;
  title: string;
  description: string;
  applicableOccupancies: OccupancyGroup[];
  requirement: string;
  exceptions?: string[];
  relatedSections: string[];
}

// ============================================================================
// US ZONING TYPES
// ============================================================================

export type USZoneCategory = 
  | 'residential'
  | 'commercial' 
  | 'industrial'
  | 'agricultural'
  | 'mixed_use'
  | 'planned_development'
  | 'special_purpose'
  | 'overlay';

export type ResidentialZone = 
  | 'R-1'   // Single-Family Residential (Low Density)
  | 'R-1A'  // Single-Family Residential (Estate)
  | 'R-2'   // Two-Family Residential (Duplex)
  | 'R-3'   // Multi-Family Residential (Low)
  | 'R-4'   // Multi-Family Residential (Medium)
  | 'R-5'   // Multi-Family Residential (High)
  | 'RMH'   // Residential Mobile Home
  | 'RR';   // Rural Residential

export type CommercialZone =
  | 'C-1'   // Neighborhood Commercial
  | 'C-2'   // Community Commercial
  | 'C-3'   // Regional Commercial
  | 'C-4'   // Highway Commercial
  | 'C-5'   // Central Business District
  | 'CO'    // Commercial Office
  | 'CR';   // Commercial Recreation

export type IndustrialZone =
  | 'I-1'   // Light Industrial
  | 'I-2'   // General Industrial
  | 'I-3'   // Heavy Industrial
  | 'BP';   // Business Park

export type SpecialZone =
  | 'PD'    // Planned Development
  | 'PUD'   // Planned Unit Development
  | 'TOD'   // Transit-Oriented Development
  | 'OS'    // Open Space
  | 'P'     // Public/Institutional
  | 'A-1'   // Agricultural
  | 'A-2'   // Agricultural-Residential
  | 'FP'    // Floodplain
  | 'HP';   // Historic Preservation

export interface USZone {
  id: string;
  code: string;
  name: string;
  category: USZoneCategory;
  description: string;
  color: string;
  minimumLotSize: number; // sq ft
  minimumLotWidth: number; // ft
  maximumHeight: number; // ft
  maximumStories: number;
  maximumLotCoverage: number; // %
  maximumFAR: number;
  setbacks: ZoneSetbacks;
  minimumParking: ParkingRequirement[];
  permittedUses: string[];
  conditionalUses: string[];
  prohibitedUses: string[];
  densityLimit?: number; // units per acre
  openSpaceRequirement?: number; // %
}

export interface ZoneSetbacks {
  front: number;
  rear: number;
  sideInterior: number;
  sideStreet: number;
  unit: 'ft' | 'm';
}

export interface ParkingRequirement {
  use: string;
  ratio: string;
  minimum: number;
}

// ============================================================================
// US PARCEL & PROPERTY
// ============================================================================

export type ParcelStatus = 'active' | 'pending' | 'subdividing' | 'merging' | 'disputed' | 'exempt';

export interface USParcel {
  id: string;
  apn: string; // Assessor's Parcel Number
  altApn?: string;
  situs: string; // Property address
  city: string;
  county: string;
  state: USState;
  zipCode: string;
  zoneId: string;
  zoneName: string;
  lotSize: number; // sq ft
  lotSizeAcres: number;
  coordinates: { lat: number; lng: number };
  boundaries: { lat: number; lng: number }[];
  status: ParcelStatus;
  ownerName: string;
  ownerAddress: string;
  ownerType: 'individual' | 'corporation' | 'llc' | 'trust' | 'government' | 'nonprofit';
  assessedValue: number;
  marketValue: number;
  taxYear: number;
  propertyTax: number;
  landUseCode: string;
  landUseDescription: string;
  improvements: PropertyImprovement[];
  easements: Easement[];
  floodZone?: FEMAFloodZone;
  permits: string[];
  violations: string[];
  lastSaleDate?: string;
  lastSalePrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImprovement {
  id: string;
  type: 'primary_structure' | 'accessory_structure' | 'pool' | 'garage' | 'other';
  yearBuilt: number;
  squareFootage: number;
  stories: number;
  bedrooms?: number;
  bathrooms?: number;
  constructionType: string;
  condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
  value: number;
}

export interface Easement {
  id: string;
  type: 'utility' | 'access' | 'drainage' | 'conservation' | 'scenic' | 'other';
  holder: string;
  description: string;
  recordedDate: string;
  documentNumber: string;
}

// ============================================================================
// US PERMIT SYSTEM
// ============================================================================

export type PermitType =
  | 'building'
  | 'electrical'
  | 'plumbing'
  | 'mechanical'
  | 'fire'
  | 'demolition'
  | 'grading'
  | 'sign'
  | 'fence'
  | 'pool'
  | 'solar'
  | 'roofing'
  | 'foundation'
  | 'tenant_improvement'
  | 'certificate_of_occupancy';

export type PermitStatus =
  | 'pre_application'
  | 'submitted'
  | 'under_review'
  | 'corrections_required'
  | 'approved'
  | 'issued'
  | 'inspection_scheduled'
  | 'inspection_passed'
  | 'inspection_failed'
  | 'final'
  | 'expired'
  | 'revoked'
  | 'cancelled';

export type ReviewDiscipline =
  | 'planning'
  | 'building'
  | 'fire'
  | 'public_works'
  | 'environmental'
  | 'health'
  | 'utilities'
  | 'traffic'
  | 'accessibility';

export interface USPermit {
  id: string;
  permitNumber: string;
  type: PermitType;
  status: PermitStatus;
  parcelId: string;
  apn: string;
  siteAddress: string;
  jurisdiction: string;
  projectName: string;
  projectDescription: string;
  applicant: Applicant;
  contractor?: Contractor;
  owner: string;
  occupancyGroup: OccupancyGroup;
  constructionType: ConstructionType;
  squareFootage: number;
  stories: number;
  estimatedValue: number;
  submittalDate: string;
  approvalDate?: string;
  issueDate?: string;
  expirationDate?: string;
  reviews: PermitReview[];
  inspections: Inspection[];
  fees: PermitFee[];
  conditions: string[];
  documents: PermitDocument[];
  codeCompliance: CodeComplianceCheck[];
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber?: string;
}

export interface Contractor {
  name: string;
  company: string;
  licenseNumber: string;
  licenseType: string;
  licenseState: USState;
  licenseExpiration: string;
  insuranceExpiration: string;
  bondAmount?: number;
  email: string;
  phone: string;
}

export interface PermitReview {
  id: string;
  discipline: ReviewDiscipline;
  reviewer: string;
  status: 'pending' | 'in_review' | 'approved' | 'corrections_required' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  comments: ReviewComment[];
  correctionItems: CorrectionItem[];
}

export interface ReviewComment {
  id: string;
  date: string;
  reviewer: string;
  comment: string;
  codeReference?: string;
  resolved: boolean;
}

export interface CorrectionItem {
  id: string;
  discipline: ReviewDiscipline;
  codeSection: string;
  description: string;
  sheetReference?: string;
  status: 'open' | 'addressed' | 'verified' | 'waived';
  response?: string;
  responseDate?: string;
}

export interface Inspection {
  id: string;
  type: string;
  status: 'scheduled' | 'completed' | 'passed' | 'failed' | 'partial' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  inspector: string;
  result?: 'approved' | 'approved_with_conditions' | 'not_approved' | 'reinspection_required';
  comments: string;
  corrections?: string[];
  photos?: string[];
}

export interface PermitFee {
  id: string;
  type: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'waived' | 'refunded';
  paidDate?: string;
  receiptNumber?: string;
}

export interface PermitDocument {
  id: string;
  type: 'plans' | 'calculations' | 'reports' | 'specifications' | 'other';
  name: string;
  version: number;
  uploadedDate: string;
  uploadedBy: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'superseded';
  url: string;
}

export interface CodeComplianceCheck {
  id: string;
  code: BuildingCodeType;
  section: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'not_applicable' | 'pending';
  notes?: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

// ============================================================================
// FEMA COMPLIANCE
// ============================================================================

export type FEMAFloodZone = 
  | 'A' | 'AE' | 'AH' | 'AO' | 'AR' | 'A99'  // High Risk
  | 'V' | 'VE'                                 // Coastal High Risk
  | 'B' | 'X500'                               // Moderate Risk
  | 'C' | 'X'                                  // Minimal Risk
  | 'D';                                       // Undetermined

export type DisasterType = 
  | 'flood' 
  | 'hurricane' 
  | 'tornado' 
  | 'earthquake' 
  | 'wildfire' 
  | 'severe_storm' 
  | 'winter_storm'
  | 'drought'
  | 'volcanic';

export type FEMAProgram =
  | 'PA'      // Public Assistance
  | 'IA'      // Individual Assistance
  | 'HMGP'    // Hazard Mitigation Grant Program
  | 'BRIC'    // Building Resilient Infrastructure and Communities
  | 'FMA'     // Flood Mitigation Assistance
  | 'PDM'     // Pre-Disaster Mitigation
  | 'NFIP';   // National Flood Insurance Program

export interface FEMADisasterDeclaration {
  id: string;
  disasterNumber: string;
  declarationType: 'DR' | 'EM' | 'FM';
  declarationDate: string;
  disasterType: DisasterType;
  state: USState;
  designatedCounties: string[];
  incidentPeriodStart: string;
  incidentPeriodEnd?: string;
  programs: FEMAProgram[];
  totalObligated: number;
  publicAssistance: number;
  individualAssistance: number;
  hazardMitigation: number;
  closeoutDate?: string;
}

export interface FEMAProject {
  id: string;
  disasterNumber: string;
  projectNumber: string;
  applicant: string;
  applicantType: 'state' | 'county' | 'city' | 'tribal' | 'nonprofit';
  county: string;
  state: USState;
  projectTitle: string;
  projectDescription: string;
  damageCategory: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'Z';
  projectType: 'emergency_work' | 'permanent_work' | 'mitigation';
  status: FEMAProjectStatus;
  federalShareObligated: number;
  totalObligated: number;
  projectSize: 'small' | 'large';
  workCompletionDate?: string;
  deadlines: FEMADeadline[];
  inspections: FEMAInspection[];
  documents: FEMADocument[];
  complianceStatus: FEMAComplianceStatus;
  environmentalReview: EnvironmentalReviewStatus;
  historicPreservation: HistoricPreservationStatus;
}

export type FEMAProjectStatus =
  | 'formulation'
  | 'review'
  | 'obligated'
  | 'in_progress'
  | 'completed'
  | 'closeout'
  | 'appealed'
  | 'denied';

export type FEMAComplianceStatus = 
  | 'compliant' 
  | 'pending_review' 
  | 'deficiency_identified' 
  | 'corrective_action_required'
  | 'non_compliant';

export type EnvironmentalReviewStatus = 
  | 'not_started'
  | 'categorical_exclusion'
  | 'environmental_assessment'
  | 'environmental_impact_statement'
  | 'completed'
  | 'finding_of_no_significant_impact';

export type HistoricPreservationStatus =
  | 'not_required'
  | 'section_106_initiated'
  | 'consultation_ongoing'
  | 'no_historic_properties'
  | 'no_adverse_effect'
  | 'adverse_effect_resolved'
  | 'completed';

export interface FEMADeadline {
  id: string;
  type: 'work_completion' | 'documentation' | 'closeout' | 'appeal';
  description: string;
  dueDate: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed' | 'extended';
  extensionGranted?: boolean;
  newDueDate?: string;
}

export interface FEMAInspection {
  id: string;
  type: 'damage_assessment' | 'progress' | 'final' | 'closeout';
  date: string;
  inspector: string;
  organization: string;
  findings: string;
  recommendations: string[];
  photoDocumentation: string[];
  status: 'scheduled' | 'completed' | 'follow_up_required';
}

export interface FEMADocument {
  id: string;
  type: 'project_worksheet' | 'damage_description' | 'cost_estimate' | 'photos' | 'insurance' | 'environmental' | 'historic' | 'appeal' | 'closeout';
  name: string;
  version: number;
  uploadedDate: string;
  status: 'draft' | 'submitted' | 'approved' | 'revision_required';
  url: string;
}

export interface SubstantialDamageAssessment {
  id: string;
  parcelId: string;
  disasterNumber?: string;
  assessmentDate: string;
  assessor: string;
  preDisasterValue: number;
  damageValue: number;
  damagePercentage: number;
  isSubstantialDamage: boolean; // >50% of pre-disaster value
  isSubstantialImprovement: boolean;
  requiredActions: string[];
  floodZone: FEMAFloodZone;
  baseFloodElevation?: number;
  lowestFloorElevation?: number;
  freeboard?: number;
  complianceDeadline?: string;
  status: 'assessed' | 'notice_sent' | 'permit_required' | 'compliant' | 'non_compliant';
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const US_ZONES: USZone[] = [
  {
    id: 'zone-r1',
    code: 'R-1',
    name: 'Single-Family Residential',
    category: 'residential',
    description: 'Low-density single-family detached dwellings',
    color: '#FEF3C7',
    minimumLotSize: 7500,
    minimumLotWidth: 60,
    maximumHeight: 35,
    maximumStories: 2,
    maximumLotCoverage: 40,
    maximumFAR: 0.5,
    setbacks: { front: 25, rear: 20, sideInterior: 5, sideStreet: 15, unit: 'ft' },
    minimumParking: [{ use: 'Single-family', ratio: '2 per unit', minimum: 2 }],
    permittedUses: ['Single-family dwelling', 'Home occupation', 'Accessory dwelling unit'],
    conditionalUses: ['Day care home', 'Bed and breakfast', 'Religious facility'],
    prohibitedUses: ['Multi-family', 'Commercial', 'Industrial'],
    densityLimit: 4,
  },
  {
    id: 'zone-r3',
    code: 'R-3',
    name: 'Multi-Family Residential',
    category: 'residential',
    description: 'Medium-density multi-family dwellings',
    color: '#FCD34D',
    minimumLotSize: 15000,
    minimumLotWidth: 100,
    maximumHeight: 45,
    maximumStories: 3,
    maximumLotCoverage: 50,
    maximumFAR: 1.5,
    setbacks: { front: 20, rear: 15, sideInterior: 10, sideStreet: 15, unit: 'ft' },
    minimumParking: [{ use: 'Multi-family', ratio: '1.5 per unit', minimum: 2 }],
    permittedUses: ['Multi-family dwelling', 'Townhomes', 'Apartments'],
    conditionalUses: ['Senior housing', 'Assisted living'],
    prohibitedUses: ['Industrial', 'Heavy commercial'],
    densityLimit: 20,
  },
  {
    id: 'zone-c1',
    code: 'C-1',
    name: 'Neighborhood Commercial',
    category: 'commercial',
    description: 'Small-scale retail and services for surrounding neighborhood',
    color: '#93C5FD',
    minimumLotSize: 5000,
    minimumLotWidth: 50,
    maximumHeight: 35,
    maximumStories: 2,
    maximumLotCoverage: 60,
    maximumFAR: 1.0,
    setbacks: { front: 10, rear: 10, sideInterior: 0, sideStreet: 10, unit: 'ft' },
    minimumParking: [{ use: 'Retail', ratio: '1 per 250 sf', minimum: 4 }],
    permittedUses: ['Retail', 'Restaurant', 'Personal services', 'Office'],
    conditionalUses: ['Drive-through', 'Gas station'],
    prohibitedUses: ['Industrial', 'Adult entertainment', 'Auto repair'],
  },
  {
    id: 'zone-c3',
    code: 'C-3',
    name: 'Regional Commercial',
    category: 'commercial',
    description: 'Large-scale retail, shopping centers, and commercial uses',
    color: '#3B82F6',
    minimumLotSize: 20000,
    minimumLotWidth: 150,
    maximumHeight: 75,
    maximumStories: 6,
    maximumLotCoverage: 70,
    maximumFAR: 3.0,
    setbacks: { front: 20, rear: 20, sideInterior: 10, sideStreet: 20, unit: 'ft' },
    minimumParking: [{ use: 'Retail', ratio: '1 per 200 sf', minimum: 100 }],
    permittedUses: ['Shopping center', 'Big-box retail', 'Hotel', 'Entertainment'],
    conditionalUses: ['Mixed-use development'],
    prohibitedUses: ['Heavy industrial', 'Residential (standalone)'],
  },
  {
    id: 'zone-i1',
    code: 'I-1',
    name: 'Light Industrial',
    category: 'industrial',
    description: 'Light manufacturing, warehousing, and distribution',
    color: '#C4B5FD',
    minimumLotSize: 20000,
    minimumLotWidth: 100,
    maximumHeight: 50,
    maximumStories: 4,
    maximumLotCoverage: 60,
    maximumFAR: 2.0,
    setbacks: { front: 30, rear: 20, sideInterior: 15, sideStreet: 30, unit: 'ft' },
    minimumParking: [{ use: 'Industrial', ratio: '1 per 1000 sf', minimum: 10 }],
    permittedUses: ['Light manufacturing', 'Warehouse', 'Distribution', 'Research'],
    conditionalUses: ['Outdoor storage', 'Truck terminal'],
    prohibitedUses: ['Residential', 'Retail', 'Heavy manufacturing'],
  },
  {
    id: 'zone-mu',
    code: 'MU-1',
    name: 'Mixed Use',
    category: 'mixed_use',
    description: 'Combination of residential, commercial, and office uses',
    color: '#F472B6',
    minimumLotSize: 10000,
    minimumLotWidth: 80,
    maximumHeight: 65,
    maximumStories: 5,
    maximumLotCoverage: 65,
    maximumFAR: 3.5,
    setbacks: { front: 10, rear: 15, sideInterior: 5, sideStreet: 10, unit: 'ft' },
    minimumParking: [{ use: 'Mixed', ratio: 'Per use type', minimum: 20 }],
    permittedUses: ['Residential above ground floor', 'Retail', 'Office', 'Restaurant'],
    conditionalUses: ['Live-work units', 'Brewery/taproom'],
    prohibitedUses: ['Industrial', 'Auto-oriented uses', 'Drive-through'],
  },
];

export const US_PARCELS: USParcel[] = [
  {
    id: 'parcel-001',
    apn: '123-456-789-000',
    situs: '1234 Main Street',
    city: 'Springfield',
    county: 'Greene',
    state: 'MO',
    zipCode: '65801',
    zoneId: 'zone-c3',
    zoneName: 'Regional Commercial',
    lotSize: 87120,
    lotSizeAcres: 2.0,
    coordinates: { lat: 37.2090, lng: -93.2923 },
    boundaries: [],
    status: 'active',
    ownerName: 'Springfield Development LLC',
    ownerAddress: '500 Business Park Dr, Springfield, MO 65801',
    ownerType: 'llc',
    assessedValue: 2500000,
    marketValue: 3200000,
    taxYear: 2024,
    propertyTax: 48500,
    landUseCode: 'COM',
    landUseDescription: 'Commercial - Retail',
    improvements: [
      { id: 'imp-1', type: 'primary_structure', yearBuilt: 2018, squareFootage: 45000, stories: 2, constructionType: 'Steel Frame', condition: 'excellent', value: 2800000 }
    ],
    easements: [],
    floodZone: 'X',
    permits: ['permit-001'],
    violations: [],
    lastSaleDate: '2020-03-15',
    lastSalePrice: 2900000,
    createdAt: '2018-01-01',
    updatedAt: '2024-12-01',
  },
  {
    id: 'parcel-002',
    apn: '234-567-890-001',
    situs: '567 Oak Avenue',
    city: 'Miami',
    county: 'Miami-Dade',
    state: 'FL',
    zipCode: '33101',
    zoneId: 'zone-r3',
    zoneName: 'Multi-Family Residential',
    lotSize: 25000,
    lotSizeAcres: 0.57,
    coordinates: { lat: 25.7617, lng: -80.1918 },
    boundaries: [],
    status: 'active',
    ownerName: 'Coastal Properties Trust',
    ownerAddress: '100 Biscayne Blvd, Miami, FL 33101',
    ownerType: 'trust',
    assessedValue: 1800000,
    marketValue: 2400000,
    taxYear: 2024,
    propertyTax: 38200,
    landUseCode: 'RES-MF',
    landUseDescription: 'Residential - Multi-Family',
    improvements: [
      { id: 'imp-2', type: 'primary_structure', yearBuilt: 1985, squareFootage: 18000, stories: 3, bedrooms: 24, bathrooms: 24, constructionType: 'Concrete Block', condition: 'good', value: 1600000 }
    ],
    easements: [],
    floodZone: 'AE',
    permits: [],
    violations: [],
    createdAt: '1985-06-15',
    updatedAt: '2024-11-15',
  },
];

export const US_PERMITS: USPermit[] = [
  {
    id: 'permit-001',
    permitNumber: 'BP-2025-00142',
    type: 'building',
    status: 'under_review',
    parcelId: 'parcel-001',
    apn: '123-456-789-000',
    siteAddress: '1234 Main Street, Springfield, MO 65801',
    jurisdiction: 'City of Springfield',
    projectName: 'Main Street Shopping Center Expansion',
    projectDescription: 'Addition of 15,000 SF retail space and parking structure',
    applicant: { name: 'John Smith', company: 'Smith Architecture', email: 'jsmith@smitharch.com', phone: '417-555-1234', address: '200 Design Way, Springfield, MO', licenseNumber: 'AR-12345' },
    contractor: { name: 'Mike Johnson', company: 'Johnson Construction Inc', licenseNumber: 'GC-98765', licenseType: 'General Contractor', licenseState: 'MO', licenseExpiration: '2025-12-31', insuranceExpiration: '2025-06-30', email: 'mike@johnsonconstruction.com', phone: '417-555-5678' },
    owner: 'Springfield Development LLC',
    occupancyGroup: 'M',
    constructionType: 'II-B',
    squareFootage: 15000,
    stories: 2,
    estimatedValue: 2500000,
    submittalDate: '2025-01-02',
    reviews: [
      { id: 'rev-1', discipline: 'planning', reviewer: 'Sarah Brown', status: 'approved', submittedDate: '2025-01-02', reviewedDate: '2025-01-05', comments: [], correctionItems: [] },
      { id: 'rev-2', discipline: 'building', reviewer: 'Tom Wilson', status: 'in_review', submittedDate: '2025-01-02', comments: [], correctionItems: [] },
      { id: 'rev-3', discipline: 'fire', reviewer: 'Chief Martinez', status: 'pending', submittedDate: '2025-01-02', comments: [], correctionItems: [] },
    ],
    inspections: [],
    fees: [
      { id: 'fee-1', type: 'Plan Review', description: 'Building plan review fee', amount: 3750, status: 'paid', paidDate: '2025-01-02', receiptNumber: 'RCP-20250102-001' },
      { id: 'fee-2', type: 'Permit', description: 'Building permit fee', amount: 12500, status: 'pending' },
    ],
    conditions: [],
    documents: [],
    codeCompliance: [
      { id: 'cc-1', code: 'IBC', section: '903.2', requirement: 'Automatic sprinkler system required', status: 'compliant' },
      { id: 'cc-2', code: 'ADA', section: '206', requirement: 'Accessible routes required', status: 'pending' },
    ],
    createdAt: '2025-01-02',
    updatedAt: '2025-01-07',
  },
];

export const FEMA_DISASTERS: FEMADisasterDeclaration[] = [
  {
    id: 'fema-001',
    disasterNumber: 'DR-4806',
    declarationType: 'DR',
    declarationDate: '2024-08-15',
    disasterType: 'hurricane',
    state: 'FL',
    designatedCounties: ['Miami-Dade', 'Broward', 'Palm Beach', 'Monroe'],
    incidentPeriodStart: '2024-08-10',
    incidentPeriodEnd: '2024-08-20',
    programs: ['PA', 'IA', 'HMGP'],
    totalObligated: 850000000,
    publicAssistance: 520000000,
    individualAssistance: 280000000,
    hazardMitigation: 50000000,
  },
  {
    id: 'fema-002',
    disasterNumber: 'DR-4798',
    declarationType: 'DR',
    declarationDate: '2024-05-20',
    disasterType: 'tornado',
    state: 'MO',
    designatedCounties: ['Greene', 'Christian', 'Webster', 'Lawrence'],
    incidentPeriodStart: '2024-05-15',
    incidentPeriodEnd: '2024-05-16',
    programs: ['PA', 'IA', 'HMGP'],
    totalObligated: 125000000,
    publicAssistance: 85000000,
    individualAssistance: 35000000,
    hazardMitigation: 5000000,
  },
];

export const FEMA_PROJECTS: FEMAProject[] = [
  {
    id: 'fema-proj-001',
    disasterNumber: 'DR-4806',
    projectNumber: 'PA-08-FL-4806-PW-00125',
    applicant: 'Miami-Dade County',
    applicantType: 'county',
    county: 'Miami-Dade',
    state: 'FL',
    projectTitle: 'Emergency Debris Removal - Countywide',
    projectDescription: 'Removal of hurricane debris from public roads and rights-of-way',
    damageCategory: 'A',
    projectType: 'emergency_work',
    status: 'in_progress',
    federalShareObligated: 12500000,
    totalObligated: 16666667,
    projectSize: 'large',
    deadlines: [
      { id: 'dl-1', type: 'work_completion', description: 'Emergency work completion', dueDate: '2025-02-15', status: 'upcoming' }
    ],
    inspections: [],
    documents: [],
    complianceStatus: 'compliant',
    environmentalReview: 'categorical_exclusion',
    historicPreservation: 'not_required',
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

export const BUILDING_CODE_CONFIG: Record<BuildingCodeType, { name: string; fullName: string; color: string }> = {
  IBC: { name: 'IBC', fullName: 'International Building Code', color: '#3B82F6' },
  IRC: { name: 'IRC', fullName: 'International Residential Code', color: '#10B981' },
  IPC: { name: 'IPC', fullName: 'International Plumbing Code', color: '#06B6D4' },
  IMC: { name: 'IMC', fullName: 'International Mechanical Code', color: '#8B5CF6' },
  IFC: { name: 'IFC', fullName: 'International Fire Code', color: '#EF4444' },
  IECC: { name: 'IECC', fullName: 'International Energy Conservation Code', color: '#22C55E' },
  IEC: { name: 'IEC', fullName: 'International Electrical Code', color: '#F59E0B' },
  NEC: { name: 'NEC', fullName: 'National Electrical Code (NFPA 70)', color: '#F97316' },
  ADA: { name: 'ADA', fullName: 'Americans with Disabilities Act', color: '#6366F1' },
  OSHA: { name: 'OSHA', fullName: 'Occupational Safety and Health Admin', color: '#EC4899' },
  EPA: { name: 'EPA', fullName: 'Environmental Protection Agency', color: '#14B8A6' },
  NFPA: { name: 'NFPA', fullName: 'National Fire Protection Association', color: '#DC2626' },
};

export const PERMIT_STATUS_CONFIG: Record<PermitStatus, { label: string; color: string; bg: string }> = {
  pre_application: { label: 'Pre-Application', color: '#6B7280', bg: '#F3F4F6' },
  submitted: { label: 'Submitted', color: '#3B82F6', bg: '#DBEAFE' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: '#FEF3C7' },
  corrections_required: { label: 'Corrections Required', color: '#F97316', bg: '#FFEDD5' },
  approved: { label: 'Approved', color: '#10B981', bg: '#D1FAE5' },
  issued: { label: 'Issued', color: '#059669', bg: '#D1FAE5' },
  inspection_scheduled: { label: 'Inspection Scheduled', color: '#8B5CF6', bg: '#EDE9FE' },
  inspection_passed: { label: 'Inspection Passed', color: '#10B981', bg: '#D1FAE5' },
  inspection_failed: { label: 'Inspection Failed', color: '#EF4444', bg: '#FEE2E2' },
  final: { label: 'Finaled', color: '#059669', bg: '#D1FAE5' },
  expired: { label: 'Expired', color: '#9CA3AF', bg: '#F3F4F6' },
  revoked: { label: 'Revoked', color: '#DC2626', bg: '#FEE2E2' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
};

export const FLOOD_ZONE_CONFIG: Record<FEMAFloodZone, { label: string; risk: string; color: string; description: string }> = {
  A: { label: 'Zone A', risk: 'High', color: '#DC2626', description: '1% annual chance flood (100-year), no BFE' },
  AE: { label: 'Zone AE', risk: 'High', color: '#DC2626', description: '1% annual chance flood with BFE determined' },
  AH: { label: 'Zone AH', risk: 'High', color: '#DC2626', description: '1% annual chance shallow flooding (1-3 ft)' },
  AO: { label: 'Zone AO', risk: 'High', color: '#DC2626', description: '1% annual chance sheet flow flooding' },
  AR: { label: 'Zone AR', risk: 'High', color: '#DC2626', description: 'Flood protection system under construction' },
  A99: { label: 'Zone A99', risk: 'High', color: '#DC2626', description: 'To be protected by federal flood protection' },
  V: { label: 'Zone V', risk: 'Coastal High', color: '#7C2D12', description: 'Coastal flood with wave action, no BFE' },
  VE: { label: 'Zone VE', risk: 'Coastal High', color: '#7C2D12', description: 'Coastal flood with wave action, BFE determined' },
  B: { label: 'Zone B', risk: 'Moderate', color: '#F59E0B', description: '0.2% annual chance flood (500-year)' },
  X500: { label: 'Zone X (Shaded)', risk: 'Moderate', color: '#F59E0B', description: '0.2% annual chance flood (500-year)' },
  C: { label: 'Zone C', risk: 'Minimal', color: '#10B981', description: 'Minimal flood hazard' },
  X: { label: 'Zone X', risk: 'Minimal', color: '#10B981', description: 'Minimal flood hazard' },
  D: { label: 'Zone D', risk: 'Undetermined', color: '#6B7280', description: 'Flood hazard undetermined' },
};

export const FEMA_DAMAGE_CATEGORY: Record<string, { name: string; description: string }> = {
  A: { name: 'Category A', description: 'Debris Removal' },
  B: { name: 'Category B', description: 'Emergency Protective Measures' },
  C: { name: 'Category C', description: 'Roads and Bridges' },
  D: { name: 'Category D', description: 'Water Control Facilities' },
  E: { name: 'Category E', description: 'Public Buildings and Contents' },
  F: { name: 'Category F', description: 'Public Utilities' },
  G: { name: 'Category G', description: 'Parks, Recreational, and Other' },
  Z: { name: 'Category Z', description: 'Management Costs' },
};

// ============================================================================
// MODULE INFO
// ============================================================================

export const US_HUB_INFO = {
  id: 'us-construction',
  name: 'US Construction Governance Hub',
  version: '1.0.0',
  description: 'IBC/IRC Building Codes, US Zoning, County Permits, FEMA Compliance',
  supportedStates: 50,
  buildingCodes: ['IBC 2021', 'IRC 2021', 'NEC 2023', 'NFPA', 'ADA', 'OSHA'],
  femaPrograms: ['PA', 'IA', 'HMGP', 'BRIC', 'NFIP'],
};
