// app/api/geo/route.ts
// Geo Utilities Platform API - FIXED VERSION
// Unified UA/US Utilities, FEMA Flood Zones, Elevation, Service Areas

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

type CountryCode = 'UA' | 'US';

interface Coordinates {
  lat: number;
  lng: number;
}

interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

interface UtilityContact {
  phone: string;
  emergency?: string;
  website?: string;
}

interface Utility {
  id: string;
  countryCode: CountryCode;
  name: string;
  shortName: string;
  utilityType: string;
  region: string; // oblast for UA, state for US
  customers: number;
  bbox: BoundingBox;
  contact: UtilityContact;
}

interface ServiceArea {
  id: string;
  districtType: string;
  name: string;
  state: string;
  county?: string;
  population: number;
  bbox: BoundingBox;
}

interface FloodZone {
  id: string;
  zoneType: string;
  state: string;
  county: string;
  communityId: string;
  bfe?: number;
  riskLevel: string;
  insuranceRequired: boolean;
  sfha: boolean;
  coastalHighHazard?: boolean;
  bbox: BoundingBox;
}

interface SoilMap {
  id: string;
  mukey: string;
  musym: string;
  muname: string;
  state: string;
  county: string;
  hydrologicGroup: string;
  drainageClass: string;
  bbox: BoundingBox;
}

interface TechnicalCondition {
  id: string;
  providerId: string;
  utilityType: string;
  title: string;
  titleUk: string;
  processingDays: number;
  costMin: number;
  costMax: number;
  currency: string;
  documents: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const UTILITIES: Utility[] = [
  // UA Utilities
  { id: 'ua-water-001', countryCode: 'UA', name: 'Kyivvodokanal', shortName: 'KVK', utilityType: 'water', region: 'Kyiv Oblast', customers: 2900000, bbox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 }, contact: { phone: '+380 44 238 3838', emergency: '104' } },
  { id: 'ua-elec-001', countryCode: 'UA', name: 'DTEK Kyiv Electric', shortName: 'DTEK', utilityType: 'electricity', region: 'Kyiv Oblast', customers: 1200000, bbox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 }, contact: { phone: '+380 44 467 3456', emergency: '103' } },
  { id: 'ua-gas-001', countryCode: 'UA', name: 'Kyivgaz', shortName: 'KG', utilityType: 'gas', region: 'Kyiv Oblast', customers: 850000, bbox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 }, contact: { phone: '+380 44 238 0404', emergency: '104' } },
  { id: 'ua-heat-001', countryCode: 'UA', name: 'Kyivteploenergo', shortName: 'KTE', utilityType: 'heat', region: 'Kyiv Oblast', customers: 12000, bbox: { minLng: 30.2, minLat: 50.3, maxLng: 30.8, maxLat: 50.6 }, contact: { phone: '+380 44 247 3838', emergency: '15-88' } },
  { id: 'ua-water-002', countryCode: 'UA', name: 'Kharkivvodokanal', shortName: 'KhVK', utilityType: 'water', region: 'Kharkiv Oblast', customers: 1400000, bbox: { minLng: 36.1, minLat: 49.9, maxLng: 36.4, maxLat: 50.1 }, contact: { phone: '+380 57 733 2222', emergency: '104' } },
  // US Utilities
  { id: 'us-elec-001', countryCode: 'US', name: 'Pacific Gas and Electric', shortName: 'PG&E', utilityType: 'electricity', region: 'California', customers: 16000000, bbox: { minLng: -122.5, minLat: 37.5, maxLng: -121.5, maxLat: 38.5 }, contact: { phone: '1-800-743-5000', emergency: '1-800-743-5002' } },
  { id: 'us-elec-002', countryCode: 'US', name: 'Consolidated Edison', shortName: 'ConEd', utilityType: 'electricity', region: 'New York', customers: 10000000, bbox: { minLng: -74.1, minLat: 40.5, maxLng: -73.7, maxLat: 41.0 }, contact: { phone: '1-800-752-6633', emergency: '1-800-752-6633' } },
  { id: 'us-elec-003', countryCode: 'US', name: 'LADWP', shortName: 'LADWP', utilityType: 'electricity', region: 'California', customers: 4000000, bbox: { minLng: -118.7, minLat: 33.7, maxLng: -118.1, maxLat: 34.4 }, contact: { phone: '1-800-342-5397' } },
  { id: 'us-elec-004', countryCode: 'US', name: 'Duke Energy', shortName: 'Duke', utilityType: 'electricity', region: 'North Carolina', customers: 7800000, bbox: { minLng: -81.5, minLat: 34.5, maxLng: -79.5, maxLat: 36.5 }, contact: { phone: '1-800-777-9898' } },
  { id: 'us-water-001', countryCode: 'US', name: 'Miami-Dade Water and Sewer', shortName: 'MDWASD', utilityType: 'water', region: 'Florida', customers: 2300000, bbox: { minLng: -80.5, minLat: 25.5, maxLng: -80.1, maxLat: 26.0 }, contact: { phone: '305-665-7477' } },
];

const TECHNICAL_CONDITIONS: TechnicalCondition[] = [
  { id: 'tc-001', providerId: 'ua-water-001', utilityType: 'water', title: 'Water Connection', titleUk: 'Підключення водопостачання', processingDays: 30, costMin: 2500, costMax: 15000, currency: 'UAH', documents: ['Application', 'Land Title', 'Site Plan', 'Building Permit'] },
  { id: 'tc-002', providerId: 'ua-elec-001', utilityType: 'electricity', title: 'Electric Connection', titleUk: 'Підключення електропостачання', processingDays: 45, costMin: 5000, costMax: 50000, currency: 'UAH', documents: ['Application', 'Land Title', 'Load Calculation', 'Project'] },
  { id: 'tc-003', providerId: 'ua-gas-001', utilityType: 'gas', title: 'Gas Connection', titleUk: 'Підключення газопостачання', processingDays: 60, costMin: 15000, costMax: 80000, currency: 'UAH', documents: ['Application', 'Land Title', 'Project', 'Safety Certificate'] },
];

const SERVICE_AREAS: ServiceArea[] = [
  { id: 'sa-fire-001', districtType: 'fire', name: 'LA County Fire District', state: 'CA', county: 'Los Angeles', population: 4000000, bbox: { minLng: -118.7, minLat: 33.7, maxLng: -117.6, maxLat: 34.8 } },
  { id: 'sa-school-001', districtType: 'school', name: 'LA Unified School District', state: 'CA', county: 'Los Angeles', population: 420000, bbox: { minLng: -118.6, minLat: 33.9, maxLng: -118.1, maxLat: 34.4 } },
  { id: 'sa-water-001', districtType: 'water', name: 'Metro Water District SoCal', state: 'CA', population: 19000000, bbox: { minLng: -118.8, minLat: 33.0, maxLng: -116.0, maxLat: 35.0 } },
  { id: 'sa-fire-002', districtType: 'fire', name: 'Miami-Dade Fire Rescue', state: 'FL', county: 'Miami-Dade', population: 2700000, bbox: { minLng: -80.5, minLat: 25.3, maxLng: -80.1, maxLat: 26.0 } },
];

const FLOOD_ZONES: FloodZone[] = [
  { id: 'fz-001', zoneType: 'AE', state: 'FL', county: 'Miami-Dade', communityId: '120650', bfe: 8, riskLevel: 'high', insuranceRequired: true, sfha: true, bbox: { minLng: -80.3, minLat: 25.7, maxLng: -80.1, maxLat: 25.9 } },
  { id: 'fz-002', zoneType: 'VE', state: 'FL', county: 'Miami-Dade', communityId: '120650', bfe: 12, riskLevel: 'severe', insuranceRequired: true, sfha: true, coastalHighHazard: true, bbox: { minLng: -80.15, minLat: 25.75, maxLng: -80.1, maxLat: 25.85 } },
  { id: 'fz-003', zoneType: 'X', state: 'FL', county: 'Miami-Dade', communityId: '120650', riskLevel: 'minimal', insuranceRequired: false, sfha: false, bbox: { minLng: -80.4, minLat: 25.8, maxLng: -80.3, maxLat: 26.0 } },
  { id: 'fz-004', zoneType: 'AE', state: 'TX', county: 'Harris', communityId: '481201', bfe: 10, riskLevel: 'high', insuranceRequired: true, sfha: true, bbox: { minLng: -95.6, minLat: 29.6, maxLng: -95.2, maxLat: 30.0 } },
  { id: 'fz-005', zoneType: 'X500', state: 'CA', county: 'Los Angeles', communityId: '060137', riskLevel: 'moderate', insuranceRequired: false, sfha: false, bbox: { minLng: -118.5, minLat: 34.0, maxLng: -118.2, maxLat: 34.2 } },
];

const SOIL_MAPS: SoilMap[] = [
  { id: 'soil-001', mukey: '2946920', musym: 'BaB', muname: 'Balcom-Zaca complex', state: 'CA', county: 'Los Angeles', hydrologicGroup: 'C', drainageClass: 'Well drained', bbox: { minLng: -118.5, minLat: 34.2, maxLng: -118.4, maxLat: 34.3 } },
  { id: 'soil-002', mukey: '2946921', musym: 'ChC', muname: 'Chino clay', state: 'CA', county: 'Los Angeles', hydrologicGroup: 'D', drainageClass: 'Poorly drained', bbox: { minLng: -118.3, minLat: 34.1, maxLng: -118.2, maxLat: 34.2 } },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function isPointInBbox(coords: Coordinates, bbox: BoundingBox): boolean {
  return coords.lng >= bbox.minLng && coords.lng <= bbox.maxLng &&
         coords.lat >= bbox.minLat && coords.lat <= bbox.maxLat;
}

function getElevation(coords: Coordinates, country: CountryCode): { meters: number; feet: number; source: string; accuracy: number } {
  const base = country === 'UA' ? 150 : 100;
  const variation = Math.sin(coords.lat * 10) * 50 + Math.cos(coords.lng * 10) * 30;
  const meters = Math.round(base + variation);
  return {
    meters,
    feet: Math.round(meters * 3.28084),
    source: country === 'UA' ? 'EU-DEM' : 'USGS',
    accuracy: 30,
  };
}

function assessFloodRisk(zones: FloodZone[]) {
  const riskOrder: Record<string, number> = { severe: 4, high: 3, moderate: 2, low: 1, minimal: 0 };
  const sorted = [...zones].sort((a, b) => (riskOrder[b.riskLevel] || 0) - (riskOrder[a.riskLevel] || 0));
  const primary = sorted[0];
  
  const recommendations: string[] = [];
  if (primary?.insuranceRequired) {
    recommendations.push('Flood insurance required for federally-backed mortgages');
    recommendations.push('Elevation certificate recommended');
  }
  if (primary?.coastalHighHazard) {
    recommendations.push('V-zone construction standards apply');
    recommendations.push('Building must be elevated on pilings');
  }
  if (primary?.sfha) {
    recommendations.push('Located in Special Flood Hazard Area');
    recommendations.push('Development permits required');
  }

  return {
    primaryZone: primary,
    riskLevel: primary?.riskLevel || 'minimal',
    insuranceRequired: primary?.insuranceRequired || false,
    baseFloodElevation: primary?.bfe,
    recommendations,
  };
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';
  const country = (searchParams.get('country')?.toUpperCase() || 'US') as CountryCode;

  try {
    switch (action) {
      // ==================== DASHBOARD ====================
      case 'dashboard': {
        const uaUtils = UTILITIES.filter(u => u.countryCode === 'UA');
        const usUtils = UTILITIES.filter(u => u.countryCode === 'US');
        
        const byType: Record<string, number> = {};
        UTILITIES.forEach(u => { byType[u.utilityType] = (byType[u.utilityType] || 0) + 1; });

        const byRisk: Record<string, number> = {};
        FLOOD_ZONES.forEach(fz => { byRisk[fz.riskLevel] = (byRisk[fz.riskLevel] || 0) + 1; });

        return NextResponse.json({
          success: true,
          data: {
            utilities: {
              total: UTILITIES.length,
              ua: uaUtils.length,
              us: usUtils.length,
              totalCustomers: UTILITIES.reduce((s, u) => s + u.customers, 0),
              byType,
            },
            serviceAreas: {
              total: SERVICE_AREAS.length,
              byType: SERVICE_AREAS.reduce((acc: Record<string, number>, sa) => {
                acc[sa.districtType] = (acc[sa.districtType] || 0) + 1;
                return acc;
              }, {}),
            },
            floodZones: {
              total: FLOOD_ZONES.length,
              byRisk,
              highRiskCount: FLOOD_ZONES.filter(z => z.riskLevel === 'high' || z.riskLevel === 'severe').length,
            },
            coverage: {
              uaOblasts: [...new Set(uaUtils.map(u => u.region))].length,
              usStates: [...new Set(usUtils.map(u => u.region))].length,
            },
          },
        });
      }

      // ==================== UTILITIES ====================
      case 'utilities': {
        const type = searchParams.get('type');
        let utilities = UTILITIES.filter(u => u.countryCode === country);
        if (type && type !== 'all') {
          utilities = utilities.filter(u => u.utilityType === type);
        }
        return NextResponse.json({ success: true, data: utilities, total: utilities.length });
      }

      case 'utilities-all': {
        return NextResponse.json({ 
          success: true, 
          data: { 
            ua: UTILITIES.filter(u => u.countryCode === 'UA'), 
            us: UTILITIES.filter(u => u.countryCode === 'US') 
          },
          total: UTILITIES.length,
        });
      }

      case 'utility': {
        const id = searchParams.get('id');
        const utility = UTILITIES.find(u => u.id === id);
        if (!utility) return NextResponse.json({ success: false, error: 'Utility not found' }, { status: 404 });
        const techConditions = TECHNICAL_CONDITIONS.filter(tc => tc.providerId === id);
        return NextResponse.json({ success: true, data: { ...utility, technicalConditions: techConditions } });
      }

      case 'utilities-within': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const coords = { lat, lng };
        const utilities = UTILITIES.filter(u => u.countryCode === country && isPointInBbox(coords, u.bbox));
        return NextResponse.json({ success: true, data: utilities, coordinates: coords });
      }

      // ==================== TECHNICAL CONDITIONS (UA) ====================
      case 'technical-conditions': {
        const utilityType = searchParams.get('type');
        let conditions = [...TECHNICAL_CONDITIONS];
        if (utilityType && utilityType !== 'all') {
          conditions = conditions.filter(tc => tc.utilityType === utilityType);
        }
        return NextResponse.json({ success: true, data: conditions });
      }

      // ==================== SERVICE AREAS (US) ====================
      case 'service-areas': {
        const districtType = searchParams.get('type');
        const state = searchParams.get('state');
        let areas = [...SERVICE_AREAS];
        if (districtType && districtType !== 'all') areas = areas.filter(sa => sa.districtType === districtType);
        if (state) areas = areas.filter(sa => sa.state === state);
        return NextResponse.json({ success: true, data: areas, total: areas.length });
      }

      case 'service-areas-within': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const coords = { lat, lng };
        const found = SERVICE_AREAS.filter(sa => isPointInBbox(coords, sa.bbox));
        return NextResponse.json({ success: true, data: found, coordinates: coords });
      }

      // ==================== ELEVATION ====================
      case 'elevation': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const elevation = getElevation({ lat, lng }, country);
        return NextResponse.json({
          success: true,
          data: {
            coordinates: { lat, lng },
            elevation,
            terrain: {
              slope: Math.round(Math.random() * 15 * 10) / 10,
              aspect: Math.round(Math.random() * 360),
            },
          },
        });
      }

      // ==================== FLOOD ZONES ====================
      case 'flood-zones': {
        const state = searchParams.get('state');
        const zoneType = searchParams.get('zoneType');
        let zones = [...FLOOD_ZONES];
        if (state) zones = zones.filter(z => z.state === state);
        if (zoneType && zoneType !== 'all') zones = zones.filter(z => z.zoneType === zoneType);
        return NextResponse.json({ success: true, data: zones, total: zones.length });
      }

      case 'flood-zones-within': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const coords = { lat, lng };
        const found = FLOOD_ZONES.filter(fz => isPointInBbox(coords, fz.bbox));
        const assessment = assessFloodRisk(found);
        return NextResponse.json({
          success: true,
          data: {
            coordinates: coords,
            zones: found,
            assessment,
          },
        });
      }

      case 'flood-risk-assessment': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const coords = { lat, lng };
        const found = FLOOD_ZONES.filter(fz => isPointInBbox(coords, fz.bbox));
        const assessment = assessFloodRisk(found);
        return NextResponse.json({
          success: true,
          data: {
            coordinates: coords,
            ...assessment,
            zonesCount: found.length,
            nfipStatus: 'participating',
            crsClass: 5,
            insuranceDiscount: 25,
          },
        });
      }

      // ==================== SOIL MAPS (US) ====================
      case 'soil': {
        const state = searchParams.get('state');
        let soils = [...SOIL_MAPS];
        if (state) soils = soils.filter(s => s.state === state);
        return NextResponse.json({ success: true, data: soils, total: soils.length });
      }

      case 'soil-within': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const coords = { lat, lng };
        const found = SOIL_MAPS.filter(s => isPointInBbox(coords, s.bbox));
        return NextResponse.json({ success: true, data: found, coordinates: coords });
      }

      // ==================== COMBINED LOCATION LOOKUP ====================
      case 'location-lookup': {
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        if (isNaN(lat) || isNaN(lng)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates' }, { status: 400 });
        }
        const coords = { lat, lng };
        
        // Determine country based on coordinates
        const detectedCountry: CountryCode = lng > 0 ? 'UA' : 'US';
        
        // Get all relevant data
        const utilities = UTILITIES.filter(u => u.countryCode === detectedCountry && isPointInBbox(coords, u.bbox));
        const serviceAreas = detectedCountry === 'US' 
          ? SERVICE_AREAS.filter(sa => isPointInBbox(coords, sa.bbox))
          : [];
        const floodZones = FLOOD_ZONES.filter(fz => isPointInBbox(coords, fz.bbox));
        const soilMaps = detectedCountry === 'US'
          ? SOIL_MAPS.filter(s => isPointInBbox(coords, s.bbox))
          : [];
        const elevation = getElevation(coords, detectedCountry);
        const floodAssessment = assessFloodRisk(floodZones);

        return NextResponse.json({
          success: true,
          data: {
            coordinates: coords,
            country: detectedCountry,
            elevation,
            utilities,
            serviceAreas,
            floodZones: {
              zones: floodZones,
              assessment: floodAssessment,
            },
            soilMaps,
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Geo API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'batch-elevation': {
        const { coordinates } = body;
        if (!Array.isArray(coordinates)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates array' }, { status: 400 });
        }
        const results = coordinates.map((c: Coordinates) => ({
          coordinates: c,
          elevation: getElevation(c, c.lng > 0 ? 'UA' : 'US'),
        }));
        return NextResponse.json({ success: true, data: results });
      }

      case 'batch-flood-check': {
        const { coordinates } = body;
        if (!Array.isArray(coordinates)) {
          return NextResponse.json({ success: false, error: 'Invalid coordinates array' }, { status: 400 });
        }
        const results = coordinates.map((c: Coordinates) => {
          const zones = FLOOD_ZONES.filter(fz => isPointInBbox(c, fz.bbox));
          return {
            coordinates: c,
            assessment: assessFloodRisk(zones),
          };
        });
        return NextResponse.json({ success: true, data: results });
      }

      case 'report-issue': {
        const { type, coordinates, description } = body;
        return NextResponse.json({
          success: true,
          message: 'Issue reported successfully',
          data: {
            ticketId: `GEO-${Date.now()}`,
            type,
            coordinates,
            status: 'received',
          },
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Geo API POST Error:', error);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
