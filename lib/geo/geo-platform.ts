// lib/geo/geo-platform.ts
// IVYAR Geo Utilities Platform v1.0
// Unified UA/US Utilities, Topography, FEMA Flood Zones, Service Areas

// ============================================================================
// CORE TYPES
// ============================================================================

export type CountryCode = 'UA' | 'US';
export type UtilityType = 'water' | 'gas' | 'electricity' | 'heat' | 'sewer' | 'telecom';
export type DistrictType = 'water' | 'fire' | 'school' | 'sewer' | 'trash' | 'utility';
export type FloodZoneType = 'A' | 'AE' | 'AH' | 'AO' | 'V' | 'VE' | 'X' | 'X500' | 'D';
export type SoilClassification = 'A' | 'B' | 'C' | 'D' | 'A/D' | 'B/D' | 'C/D';
export type ElevationSource = 'SRTM' | 'EU-DEM' | 'USGS' | 'LIDAR';
export type RiskLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'severe';

// ============================================================================
// GEOMETRY TYPES (GeoJSON Compatible)
// ============================================================================

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export interface GeoMultiPolygon {
  type: 'MultiPolygon';
  coordinates: [number, number][][][];
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// ============================================================================
// UTILITY PROVIDER
// ============================================================================

export interface UtilityProvider {
  id: string;
  countryCode: CountryCode;
  name: string;
  shortName: string;
  utilityType: UtilityType;
  state?: string; // US only
  oblast?: string; // UA only
  serviceArea: GeoMultiPolygon;
  boundingBox: BoundingBox;
  contact: ProviderContact;
  metadata: ProviderMetadata;
  technicalConditions?: TechnicalCondition[]; // UA only
  tariffs?: Tariff[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface ProviderContact {
  address: string;
  phone: string;
  email?: string;
  website?: string;
  emergencyPhone?: string;
  workingHours?: string;
}

export interface ProviderMetadata {
  customersCount?: number;
  networkLength?: number; // km
  foundedYear?: number;
  regulatoryId?: string;
  licenseNumber?: string;
  lastInspectionDate?: string;
}

export interface Tariff {
  id: string;
  name: string;
  rate: number;
  unit: string;
  currency: 'UAH' | 'USD';
  effectiveDate: string;
  customerType: 'residential' | 'commercial' | 'industrial';
}

// ============================================================================
// TECHNICAL CONDITIONS (UA)
// ============================================================================

export interface TechnicalCondition {
  id: string;
  providerId: string;
  utilityType: UtilityType;
  title: string;
  titleUk: string;
  description: string;
  requirements: string[];
  documentsNeeded: Document[];
  processingTimeDays: number;
  cost: CostRange;
  validityDays: number;
  applicationUrl?: string;
  regulatoryBasis: string;
  updatedAt: string;
}

export interface Document {
  name: string;
  nameUk: string;
  required: boolean;
  description?: string;
  templateUrl?: string;
}

export interface CostRange {
  min: number;
  max: number;
  currency: 'UAH' | 'USD';
  notes?: string;
}

// ============================================================================
// US SERVICE AREAS
// ============================================================================

export interface ServiceAreaUS {
  id: string;
  districtType: DistrictType;
  name: string;
  state: string;
  county?: string;
  serviceArea: GeoMultiPolygon;
  boundingBox: BoundingBox;
  contact?: ProviderContact;
  population?: number;
  establishedYear?: number;
  website?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FEMA FLOOD ZONES
// ============================================================================

export interface FloodZone {
  id: string;
  zoneType: FloodZoneType;
  subType?: string;
  geometry: GeoMultiPolygon;
  state: string;
  county: string;
  communityId: string;
  communityName: string;
  panelNumber: string;
  effectiveDate: string;
  baseFloodElevation?: number; // ft
  staticBFE?: boolean;
  floodway?: boolean;
  coastalHighHazard: boolean;
  riskLevel: RiskLevel;
  insuranceRequired: boolean;
  specialFloodHazardArea: boolean;
  metadata: FloodZoneMetadata;
}

export interface FloodZoneMetadata {
  mapRevisionDate?: string;
  studyType?: string;
  sourceData?: string;
  verticalDatum?: string;
}

export interface FloodRiskAssessment {
  coordinates: Coordinates;
  zones: FloodZone[];
  primaryZone?: FloodZone;
  riskLevel: RiskLevel;
  insuranceRequired: boolean;
  elevationRequired: boolean;
  baseFloodElevation?: number;
  recommendations: string[];
  nfipCommunity?: {
    id: string;
    name: string;
    status: 'participating' | 'non-participating' | 'suspended';
    crsClass?: number;
    discount?: number;
  };
}

// ============================================================================
// ELEVATION & TOPOGRAPHY
// ============================================================================

export interface ElevationPoint {
  id: string;
  countryCode: CountryCode;
  coordinates: Coordinates;
  elevationMeters: number;
  elevationFeet: number;
  source: ElevationSource;
  accuracy: number; // meters
  captureDate?: string;
}

export interface ElevationResponse {
  coordinates: Coordinates;
  elevation: {
    meters: number;
    feet: number;
  };
  source: ElevationSource;
  accuracy: number;
  terrain?: TerrainInfo;
}

export interface TerrainInfo {
  slope: number; // degrees
  aspect: number; // degrees (0-360, N=0)
  slopeClass: 'flat' | 'gentle' | 'moderate' | 'steep' | 'very_steep';
  aspectDirection: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  hillshade?: number; // 0-255
}

export interface TopographyTile {
  id: string;
  countryCode: CountryCode;
  z: number;
  x: number;
  y: number;
  tileUrl: string;
  format: 'png' | 'webp' | 'pbf';
  layerType: 'topo' | 'hillshade' | 'dem' | 'contour';
  createdAt: string;
}

// ============================================================================
// SOIL MAPS (US - NRCS)
// ============================================================================

export interface SoilMap {
  id: string;
  mukey: string; // Map Unit Key
  musym: string; // Map Unit Symbol
  muname: string; // Map Unit Name
  geometry: GeoMultiPolygon;
  state: string;
  county: string;
  hydrologicGroup: SoilClassification;
  drainageClass: string;
  floodFrequency: string;
  farmlandClass?: string;
  slopeRange?: string;
  depthToWaterTable?: number; // cm
  components: SoilComponent[];
  metadata: Record<string, unknown>;
}

export interface SoilComponent {
  cokey: string;
  compname: string;
  comppct: number; // percentage
  taxclname?: string;
  taxorder?: string;
}

// ============================================================================
// MOCK DATA - UA UTILITIES
// ============================================================================

export const UA_UTILITIES: UtilityProvider[] = [
  {
    id: 'ua-water-001',
    countryCode: 'UA',
    name: 'Kyivvodokanal',
    shortName: 'KVK',
    utilityType: 'water',
    oblast: 'Kyiv',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[30.2, 50.3], [30.8, 50.3], [30.8, 50.6], [30.2, 50.6], [30.2, 50.3]]]] },
    boundingBox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 },
    contact: {
      address: '1 Heroiv Oborony St, Kyiv, 03150',
      phone: '+380 44 238 3838',
      email: 'info@vodokanal.kiev.ua',
      website: 'https://vodokanal.kiev.ua',
      emergencyPhone: '104',
      workingHours: 'Mon-Fri 8:00-17:00',
    },
    metadata: { customersCount: 2900000, networkLength: 5200, foundedYear: 1872, regulatoryId: 'UA-WTR-001' },
    technicalConditions: [
      {
        id: 'tc-001',
        providerId: 'ua-water-001',
        utilityType: 'water',
        title: 'Water Connection Technical Conditions',
        titleUk: 'Технічні умови на підключення водопостачання',
        description: 'Requirements for connecting to centralized water supply network',
        requirements: ['Land ownership documents', 'Site plan 1:500', 'Building permit', 'Design project'],
        documentsNeeded: [
          { name: 'Application Form', nameUk: 'Заява', required: true, templateUrl: '/forms/water-app.pdf' },
          { name: 'Land Title', nameUk: 'Документ на землю', required: true },
          { name: 'Site Plan', nameUk: 'Ситуаційний план', required: true },
          { name: 'Building Permit', nameUk: 'Дозвіл на будівництво', required: true },
        ],
        processingTimeDays: 30,
        cost: { min: 2500, max: 15000, currency: 'UAH', notes: 'Depends on connection diameter' },
        validityDays: 730,
        applicationUrl: 'https://vodokanal.kiev.ua/services/connection',
        regulatoryBasis: 'Resolution of the Cabinet of Ministers No. 1314',
        updatedAt: '2025-01-01',
      },
    ],
    tariffs: [
      { id: 'tar-001', name: 'Residential Water', rate: 24.50, unit: 'm³', currency: 'UAH', effectiveDate: '2024-07-01', customerType: 'residential' },
      { id: 'tar-002', name: 'Commercial Water', rate: 42.80, unit: 'm³', currency: 'UAH', effectiveDate: '2024-07-01', customerType: 'commercial' },
    ],
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'ua-elec-001',
    countryCode: 'UA',
    name: 'DTEK Kyiv Electric Networks',
    shortName: 'DTEK KEM',
    utilityType: 'electricity',
    oblast: 'Kyiv',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[30.2, 50.3], [30.8, 50.3], [30.8, 50.6], [30.2, 50.6], [30.2, 50.3]]]] },
    boundingBox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 },
    contact: {
      address: '57 Predslavynska St, Kyiv, 03150',
      phone: '+380 44 467 3456',
      email: 'info@dtek-kem.com.ua',
      website: 'https://dtek-kem.com.ua',
      emergencyPhone: '103',
      workingHours: 'Mon-Fri 8:00-18:00',
    },
    metadata: { customersCount: 1200000, networkLength: 12500, foundedYear: 1930, regulatoryId: 'UA-ELC-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'ua-gas-001',
    countryCode: 'UA',
    name: 'Kyivgaz',
    shortName: 'Kyivgaz',
    utilityType: 'gas',
    oblast: 'Kyiv',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[30.2, 50.3], [30.8, 50.3], [30.8, 50.6], [30.2, 50.6], [30.2, 50.3]]]] },
    boundingBox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 },
    contact: {
      address: '104 Zhylianska St, Kyiv, 01032',
      phone: '+380 44 238 0404',
      emergencyPhone: '104',
      website: 'https://kyivgaz.ua',
    },
    metadata: { customersCount: 850000, networkLength: 4800, regulatoryId: 'UA-GAS-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'ua-heat-001',
    countryCode: 'UA',
    name: 'Kyivteploenergo',
    shortName: 'KTE',
    utilityType: 'heat',
    oblast: 'Kyiv',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[30.2, 50.3], [30.8, 50.3], [30.8, 50.6], [30.2, 50.6], [30.2, 50.3]]]] },
    boundingBox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 },
    contact: {
      address: '21 Saksahanskoho St, Kyiv, 01033',
      phone: '+380 44 247 3838',
      emergencyPhone: '15-88',
      website: 'https://kte.kmda.gov.ua',
    },
    metadata: { customersCount: 12000, networkLength: 2800, regulatoryId: 'UA-HET-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'ua-water-002',
    countryCode: 'UA',
    name: 'Kharkivvodokanal',
    shortName: 'KhVK',
    utilityType: 'water',
    oblast: 'Kharkiv',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[36.1, 49.9], [36.4, 49.9], [36.4, 50.1], [36.1, 50.1], [36.1, 49.9]]]] },
    boundingBox: { minLng: 36.1, minLat: 49.9, maxLng: 36.4, maxLat: 50.1 },
    contact: {
      address: '56 Shevchenko St, Kharkiv, 61001',
      phone: '+380 57 733 2222',
      emergencyPhone: '104',
      website: 'https://vodokanal.kharkov.ua',
    },
    metadata: { customersCount: 1400000, networkLength: 3200, regulatoryId: 'UA-WTR-002' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
];

// ============================================================================
// MOCK DATA - US UTILITIES
// ============================================================================

export const US_UTILITIES: UtilityProvider[] = [
  {
    id: 'us-elec-001',
    countryCode: 'US',
    name: 'Pacific Gas and Electric Company',
    shortName: 'PG&E',
    utilityType: 'electricity',
    state: 'CA',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-122.5, 37.5], [-121.5, 37.5], [-121.5, 38.5], [-122.5, 38.5], [-122.5, 37.5]]]] },
    boundingBox: { minLng: -122.5, minLat: 37.5, maxLng: -121.5, maxLat: 38.5 },
    contact: {
      address: '77 Beale Street, San Francisco, CA 94105',
      phone: '1-800-743-5000',
      email: 'customer.service@pge.com',
      website: 'https://www.pge.com',
      emergencyPhone: '1-800-743-5002',
      workingHours: '24/7 Emergency',
    },
    metadata: { customersCount: 16000000, networkLength: 180000, foundedYear: 1905, regulatoryId: 'CPUC-E-001' },
    tariffs: [
      { id: 'us-tar-001', name: 'E-1 Residential', rate: 0.32, unit: 'kWh', currency: 'USD', effectiveDate: '2024-01-01', customerType: 'residential' },
      { id: 'us-tar-002', name: 'E-19 Commercial', rate: 0.28, unit: 'kWh', currency: 'USD', effectiveDate: '2024-01-01', customerType: 'commercial' },
    ],
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'us-elec-002',
    countryCode: 'US',
    name: 'Consolidated Edison',
    shortName: 'ConEd',
    utilityType: 'electricity',
    state: 'NY',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-74.1, 40.5], [-73.7, 40.5], [-73.7, 41.0], [-74.1, 41.0], [-74.1, 40.5]]]] },
    boundingBox: { minLng: -74.1, minLat: 40.5, maxLng: -73.7, maxLat: 41.0 },
    contact: {
      address: '4 Irving Place, New York, NY 10003',
      phone: '1-800-752-6633',
      website: 'https://www.coned.com',
      emergencyPhone: '1-800-752-6633',
    },
    metadata: { customersCount: 10000000, networkLength: 96000, foundedYear: 1823, regulatoryId: 'NYPSC-E-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'us-elec-003',
    countryCode: 'US',
    name: 'Los Angeles Department of Water and Power',
    shortName: 'LADWP',
    utilityType: 'electricity',
    state: 'CA',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-118.7, 33.7], [-118.1, 33.7], [-118.1, 34.4], [-118.7, 34.4], [-118.7, 33.7]]]] },
    boundingBox: { minLng: -118.7, minLat: 33.7, maxLng: -118.1, maxLat: 34.4 },
    contact: {
      address: '111 N Hope Street, Los Angeles, CA 90012',
      phone: '1-800-342-5397',
      website: 'https://www.ladwp.com',
      emergencyPhone: '1-800-342-5397',
    },
    metadata: { customersCount: 4000000, networkLength: 35000, foundedYear: 1902, regulatoryId: 'LA-MUN-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'us-elec-004',
    countryCode: 'US',
    name: 'Duke Energy Carolinas',
    shortName: 'Duke',
    utilityType: 'electricity',
    state: 'NC',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-81.5, 34.5], [-79.5, 34.5], [-79.5, 36.5], [-81.5, 36.5], [-81.5, 34.5]]]] },
    boundingBox: { minLng: -81.5, minLat: 34.5, maxLng: -79.5, maxLat: 36.5 },
    contact: {
      address: '550 South Tryon Street, Charlotte, NC 28202',
      phone: '1-800-777-9898',
      website: 'https://www.duke-energy.com',
      emergencyPhone: '1-800-769-3766',
    },
    metadata: { customersCount: 7800000, networkLength: 280000, foundedYear: 1904, regulatoryId: 'NCUC-E-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'us-water-001',
    countryCode: 'US',
    name: 'Miami-Dade Water and Sewer',
    shortName: 'MDWASD',
    utilityType: 'water',
    state: 'FL',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-80.5, 25.5], [-80.1, 25.5], [-80.1, 26.0], [-80.5, 26.0], [-80.5, 25.5]]]] },
    boundingBox: { minLng: -80.5, minLat: 25.5, maxLng: -80.1, maxLat: 26.0 },
    contact: {
      address: '3071 SW 38th Avenue, Miami, FL 33146',
      phone: '305-665-7477',
      website: 'https://www.miamidade.gov/water',
      emergencyPhone: '305-274-9272',
    },
    metadata: { customersCount: 2300000, networkLength: 8500, foundedYear: 1972, regulatoryId: 'FL-WTR-001' },
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
];

// ============================================================================
// MOCK DATA - US SERVICE AREAS
// ============================================================================

export const US_SERVICE_AREAS: ServiceAreaUS[] = [
  {
    id: 'sa-fire-001',
    districtType: 'fire',
    name: 'Los Angeles County Fire District',
    state: 'CA',
    county: 'Los Angeles',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-118.7, 33.7], [-117.6, 33.7], [-117.6, 34.8], [-118.7, 34.8], [-118.7, 33.7]]]] },
    boundingBox: { minLng: -118.7, minLat: 33.7, maxLng: -117.6, maxLat: 34.8 },
    contact: {
      address: '1320 N Eastern Avenue, Los Angeles, CA 90063',
      phone: '323-881-2411',
      website: 'https://fire.lacounty.gov',
    },
    population: 4000000,
    establishedYear: 1923,
    metadata: { stations: 179, personnel: 4800 },
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'sa-school-001',
    districtType: 'school',
    name: 'Los Angeles Unified School District',
    state: 'CA',
    county: 'Los Angeles',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-118.6, 33.9], [-118.1, 33.9], [-118.1, 34.4], [-118.6, 34.4], [-118.6, 33.9]]]] },
    boundingBox: { minLng: -118.6, minLat: 33.9, maxLng: -118.1, maxLat: 34.4 },
    contact: {
      address: '333 South Beaudry Avenue, Los Angeles, CA 90017',
      phone: '213-241-1000',
      website: 'https://www.lausd.org',
    },
    population: 420000,
    establishedYear: 1853,
    metadata: { schools: 1413, students: 420000 },
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'sa-water-001',
    districtType: 'water',
    name: 'Metropolitan Water District of Southern California',
    state: 'CA',
    serviceArea: { type: 'MultiPolygon', coordinates: [[[[-118.8, 33.0], [-116.0, 33.0], [-116.0, 35.0], [-118.8, 35.0], [-118.8, 33.0]]]] },
    boundingBox: { minLng: -118.8, minLat: 33.0, maxLng: -116.0, maxLat: 35.0 },
    contact: {
      address: '700 N Alameda Street, Los Angeles, CA 90012',
      phone: '213-217-6000',
      website: 'https://www.mwdh2o.com',
    },
    population: 19000000,
    establishedYear: 1928,
    metadata: { memberAgencies: 26, aqueductMiles: 830 },
    createdAt: '2024-01-01',
    updatedAt: '2025-01-01',
  },
];

// ============================================================================
// MOCK DATA - FEMA FLOOD ZONES
// ============================================================================

export const FEMA_FLOOD_ZONES: FloodZone[] = [
  {
    id: 'fz-001',
    zoneType: 'AE',
    geometry: { type: 'MultiPolygon', coordinates: [[[[-80.3, 25.7], [-80.1, 25.7], [-80.1, 25.9], [-80.3, 25.9], [-80.3, 25.7]]]] },
    state: 'FL',
    county: 'Miami-Dade',
    communityId: '120650',
    communityName: 'City of Miami',
    panelNumber: '12086C0312L',
    effectiveDate: '2024-09-18',
    baseFloodElevation: 8,
    staticBFE: true,
    floodway: false,
    coastalHighHazard: false,
    riskLevel: 'high',
    insuranceRequired: true,
    specialFloodHazardArea: true,
    metadata: { mapRevisionDate: '2024-09-18', studyType: 'Detailed', verticalDatum: 'NAVD88' },
  },
  {
    id: 'fz-002',
    zoneType: 'VE',
    geometry: { type: 'MultiPolygon', coordinates: [[[[-80.15, 25.75], [-80.1, 25.75], [-80.1, 25.85], [-80.15, 25.85], [-80.15, 25.75]]]] },
    state: 'FL',
    county: 'Miami-Dade',
    communityId: '120650',
    communityName: 'City of Miami Beach',
    panelNumber: '12086C0380L',
    effectiveDate: '2024-09-18',
    baseFloodElevation: 12,
    staticBFE: true,
    floodway: false,
    coastalHighHazard: true,
    riskLevel: 'severe',
    insuranceRequired: true,
    specialFloodHazardArea: true,
    metadata: { mapRevisionDate: '2024-09-18', studyType: 'Detailed' },
  },
  {
    id: 'fz-003',
    zoneType: 'X',
    geometry: { type: 'MultiPolygon', coordinates: [[[[-80.4, 25.8], [-80.3, 25.8], [-80.3, 26.0], [-80.4, 26.0], [-80.4, 25.8]]]] },
    state: 'FL',
    county: 'Miami-Dade',
    communityId: '120650',
    communityName: 'City of Miami',
    panelNumber: '12086C0315L',
    effectiveDate: '2024-09-18',
    coastalHighHazard: false,
    riskLevel: 'minimal',
    insuranceRequired: false,
    specialFloodHazardArea: false,
    metadata: { mapRevisionDate: '2024-09-18' },
  },
];

// ============================================================================
// MOCK DATA - SOIL MAPS
// ============================================================================

export const SOIL_MAPS: SoilMap[] = [
  {
    id: 'soil-001',
    mukey: '2946920',
    musym: 'BaB',
    muname: 'Balcom-Zaca complex, 2 to 9 percent slopes',
    geometry: { type: 'MultiPolygon', coordinates: [[[[-118.5, 34.2], [-118.4, 34.2], [-118.4, 34.3], [-118.5, 34.3], [-118.5, 34.2]]]] },
    state: 'CA',
    county: 'Los Angeles',
    hydrologicGroup: 'C',
    drainageClass: 'Well drained',
    floodFrequency: 'None',
    farmlandClass: 'Not prime farmland',
    slopeRange: '2 to 9 percent',
    depthToWaterTable: 200,
    components: [
      { cokey: '16839284', compname: 'Balcom', comppct: 45, taxclname: 'Fine-loamy, mixed, superactive, thermic Calcic Haploxerolls', taxorder: 'Mollisols' },
      { cokey: '16839285', compname: 'Zaca', comppct: 40, taxclname: 'Fine, smectitic, thermic Vertic Haploxerolls', taxorder: 'Mollisols' },
    ],
    metadata: { surveyArea: 'CA696', surveyName: 'Los Angeles County' },
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

export const UTILITY_TYPE_CONFIG: Record<UtilityType, { label: string; icon: string; color: string }> = {
  water: { label: 'Water', icon: '💧', color: '#3B82F6' },
  gas: { label: 'Gas', icon: '🔥', color: '#F97316' },
  electricity: { label: 'Electricity', icon: '⚡', color: '#EAB308' },
  heat: { label: 'Heat', icon: '🌡️', color: '#EF4444' },
  sewer: { label: 'Sewer', icon: '🚰', color: '#6B7280' },
  telecom: { label: 'Telecom', icon: '📡', color: '#8B5CF6' },
};

export const FLOOD_ZONE_CONFIG: Record<FloodZoneType, { label: string; risk: RiskLevel; color: string; description: string; insuranceRequired: boolean }> = {
  A: { label: 'Zone A', risk: 'high', color: '#DC2626', description: '1% annual chance flood, no BFE', insuranceRequired: true },
  AE: { label: 'Zone AE', risk: 'high', color: '#DC2626', description: '1% annual chance flood with BFE', insuranceRequired: true },
  AH: { label: 'Zone AH', risk: 'high', color: '#DC2626', description: 'Shallow flooding 1-3 ft', insuranceRequired: true },
  AO: { label: 'Zone AO', risk: 'high', color: '#DC2626', description: 'Sheet flow flooding', insuranceRequired: true },
  V: { label: 'Zone V', risk: 'severe', color: '#7C2D12', description: 'Coastal high velocity', insuranceRequired: true },
  VE: { label: 'Zone VE', risk: 'severe', color: '#7C2D12', description: 'Coastal high velocity with BFE', insuranceRequired: true },
  X: { label: 'Zone X', risk: 'minimal', color: '#10B981', description: 'Minimal flood hazard', insuranceRequired: false },
  X500: { label: 'Zone X (shaded)', risk: 'moderate', color: '#F59E0B', description: '0.2% annual chance (500-year)', insuranceRequired: false },
  D: { label: 'Zone D', risk: 'moderate', color: '#6B7280', description: 'Undetermined risk', insuranceRequired: false },
};

export const DISTRICT_TYPE_CONFIG: Record<DistrictType, { label: string; icon: string; color: string }> = {
  water: { label: 'Water District', icon: '💧', color: '#3B82F6' },
  fire: { label: 'Fire District', icon: '🚒', color: '#EF4444' },
  school: { label: 'School District', icon: '🏫', color: '#8B5CF6' },
  sewer: { label: 'Sewer District', icon: '🚰', color: '#6B7280' },
  trash: { label: 'Sanitation District', icon: '🗑️', color: '#78716C' },
  utility: { label: 'Utility District', icon: '⚡', color: '#EAB308' },
};

// ============================================================================
// SERVICES
// ============================================================================

export class GeoUtilityService {
  static getAllUtilities(country: CountryCode): UtilityProvider[] {
    return country === 'UA' ? UA_UTILITIES : US_UTILITIES;
  }

  static getUtilityById(id: string): UtilityProvider | undefined {
    return [...UA_UTILITIES, ...US_UTILITIES].find(u => u.id === id);
  }

  static getUtilitiesByType(country: CountryCode, type: UtilityType): UtilityProvider[] {
    const all = country === 'UA' ? UA_UTILITIES : US_UTILITIES;
    return all.filter(u => u.utilityType === type);
  }

  static findUtilitiesWithin(country: CountryCode, coords: Coordinates): UtilityProvider[] {
    const all = country === 'UA' ? UA_UTILITIES : US_UTILITIES;
    return all.filter(u => this.isPointInBoundingBox(coords, u.boundingBox));
  }

  static isPointInBoundingBox(point: Coordinates, bbox: BoundingBox): boolean {
    return point.lng >= bbox.minLng && point.lng <= bbox.maxLng &&
           point.lat >= bbox.minLat && point.lat <= bbox.maxLat;
  }
}

export class ServiceAreaService {
  static getAll(): ServiceAreaUS[] {
    return US_SERVICE_AREAS;
  }

  static getByType(type: DistrictType): ServiceAreaUS[] {
    return US_SERVICE_AREAS.filter(sa => sa.districtType === type);
  }

  static findWithin(coords: Coordinates): ServiceAreaUS[] {
    return US_SERVICE_AREAS.filter(sa => 
      coords.lng >= sa.boundingBox.minLng && coords.lng <= sa.boundingBox.maxLng &&
      coords.lat >= sa.boundingBox.minLat && coords.lat <= sa.boundingBox.maxLat
    );
  }
}

export class FloodZoneService {
  static getAll(): FloodZone[] {
    return FEMA_FLOOD_ZONES;
  }

  static findWithin(coords: Coordinates): FloodZone[] {
    return FEMA_FLOOD_ZONES.filter(fz => {
      const bbox = this.getBoundingBox(fz.geometry);
      return coords.lng >= bbox.minLng && coords.lng <= bbox.maxLng &&
             coords.lat >= bbox.minLat && coords.lat <= bbox.maxLat;
    });
  }

  static assessRisk(coords: Coordinates): FloodRiskAssessment {
    const zones = this.findWithin(coords);
    const primaryZone = zones.sort((a, b) => {
      const riskOrder: Record<RiskLevel, number> = { severe: 4, high: 3, moderate: 2, low: 1, minimal: 0 };
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    })[0];

    const recommendations: string[] = [];
    if (primaryZone?.insuranceRequired) {
      recommendations.push('Flood insurance required for federally-backed mortgages');
      recommendations.push('Elevation certificate recommended');
    }
    if (primaryZone?.coastalHighHazard) {
      recommendations.push('V-zone construction standards apply');
      recommendations.push('Building must be elevated on pilings');
    }

    return {
      coordinates: coords,
      zones,
      primaryZone,
      riskLevel: primaryZone?.riskLevel || 'minimal',
      insuranceRequired: primaryZone?.insuranceRequired || false,
      elevationRequired: primaryZone?.specialFloodHazardArea || false,
      baseFloodElevation: primaryZone?.baseFloodElevation,
      recommendations,
    };
  }

  private static getBoundingBox(geometry: GeoMultiPolygon): BoundingBox {
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    geometry.coordinates.forEach(poly => 
      poly.forEach(ring => 
        ring.forEach(([lng, lat]) => {
          minLng = Math.min(minLng, lng);
          minLat = Math.min(minLat, lat);
          maxLng = Math.max(maxLng, lng);
          maxLat = Math.max(maxLat, lat);
        })
      )
    );
    return { minLng, minLat, maxLng, maxLat };
  }
}

export class ElevationService {
  static getElevation(coords: Coordinates, country: CountryCode): ElevationResponse {
    // Simulated elevation based on coordinates
    const baseElevation = country === 'UA' 
      ? 150 + Math.sin(coords.lat * 10) * 50 + Math.cos(coords.lng * 10) * 30
      : 100 + Math.sin(coords.lat * 8) * 200 + Math.cos(coords.lng * 8) * 150;
    
    const meters = Math.round(baseElevation);
    return {
      coordinates: coords,
      elevation: { meters, feet: Math.round(meters * 3.28084) },
      source: country === 'UA' ? 'EU-DEM' : 'USGS',
      accuracy: 30,
      terrain: {
        slope: Math.random() * 15,
        aspect: Math.random() * 360,
        slopeClass: 'gentle',
        aspectDirection: 'NE',
      },
    };
  }
}

export class SoilService {
  static getAll(): SoilMap[] {
    return SOIL_MAPS;
  }

  static findWithin(coords: Coordinates): SoilMap[] {
    return SOIL_MAPS.filter(sm => {
      const bbox = { minLng: -118.5, minLat: 34.2, maxLng: -118.4, maxLat: 34.3 };
      return coords.lng >= bbox.minLng && coords.lng <= bbox.maxLng &&
             coords.lat >= bbox.minLat && coords.lat <= bbox.maxLat;
    });
  }
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface GeoDashboardMetrics {
  utilities: { ua: number; us: number; total: number; byType: Record<UtilityType, number> };
  serviceAreas: { total: number; byType: Record<DistrictType, number> };
  floodZones: { total: number; byRisk: Record<RiskLevel, number> };
  coverage: { uaOblasts: number; usStates: number };
}

export class DashboardService {
  static getMetrics(): GeoDashboardMetrics {
    const uaUtils = UA_UTILITIES.length;
    const usUtils = US_UTILITIES.length;
    
    const byType: Record<string, number> = {};
    [...UA_UTILITIES, ...US_UTILITIES].forEach(u => {
      byType[u.utilityType] = (byType[u.utilityType] || 0) + 1;
    });

    const byDistrictType: Record<string, number> = {};
    US_SERVICE_AREAS.forEach(sa => {
      byDistrictType[sa.districtType] = (byDistrictType[sa.districtType] || 0) + 1;
    });

    const byRisk: Record<string, number> = {};
    FEMA_FLOOD_ZONES.forEach(fz => {
      byRisk[fz.riskLevel] = (byRisk[fz.riskLevel] || 0) + 1;
    });

    return {
      utilities: { ua: uaUtils, us: usUtils, total: uaUtils + usUtils, byType: byType as Record<UtilityType, number> },
      serviceAreas: { total: US_SERVICE_AREAS.length, byType: byDistrictType as Record<DistrictType, number> },
      floodZones: { total: FEMA_FLOOD_ZONES.length, byRisk: byRisk as Record<RiskLevel, number> },
      coverage: { uaOblasts: 2, usStates: 4 },
    };
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================

export const GEO_PLATFORM_INFO = {
  id: 'geo-platform',
  name: 'Geo Utilities Platform',
  version: '1.0.0',
  description: 'Unified UA/US Utilities, Topography, FEMA Flood Zones, Service Areas',
  features: ['Utility Lookup', 'Technical Conditions (UA)', 'Service Areas (US)', 'FEMA Flood Zones', 'Elevation/DEM', 'Soil Maps'],
  dataStandards: ['GeoJSON', 'PostGIS Compatible', 'NFIP Compliant', 'NRCS Web Soil Survey'],
};
