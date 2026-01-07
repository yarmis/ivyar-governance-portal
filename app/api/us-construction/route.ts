// app/api/us-construction/route.ts
// US Construction Governance Hub API
// IBC/IRC Codes, County Permits, FEMA Compliance

import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const US_ZONES = [
  { id: 'zone-r1', code: 'R-1', name: 'Single-Family Residential', category: 'residential', maxHeight: 35, maxStories: 2, minLotSize: 7500, maxCoverage: 40 },
  { id: 'zone-r3', code: 'R-3', name: 'Multi-Family Residential', category: 'residential', maxHeight: 45, maxStories: 3, minLotSize: 15000, maxCoverage: 50 },
  { id: 'zone-c1', code: 'C-1', name: 'Neighborhood Commercial', category: 'commercial', maxHeight: 35, maxStories: 2, minLotSize: 5000, maxCoverage: 60 },
  { id: 'zone-c3', code: 'C-3', name: 'Regional Commercial', category: 'commercial', maxHeight: 75, maxStories: 6, minLotSize: 20000, maxCoverage: 70 },
  { id: 'zone-i1', code: 'I-1', name: 'Light Industrial', category: 'industrial', maxHeight: 50, maxStories: 4, minLotSize: 20000, maxCoverage: 60 },
  { id: 'zone-mu', code: 'MU-1', name: 'Mixed Use', category: 'mixed_use', maxHeight: 65, maxStories: 5, minLotSize: 10000, maxCoverage: 65 },
];

const PERMITS = [
  { id: '1', permitNumber: 'BP-2025-00142', type: 'building', status: 'under_review', projectName: 'Main Street Shopping Center Expansion', address: '1234 Main St, Springfield, MO', apn: '123-456-789-000', applicant: 'Smith Architecture', value: 2500000, sqft: 15000, occupancy: 'M', submitDate: '2025-01-02' },
  { id: '2', permitNumber: 'BP-2025-00138', type: 'building', status: 'approved', projectName: 'Oak Avenue Apartments', address: '567 Oak Ave, Miami, FL', apn: '234-567-890-001', applicant: 'Coastal Design', value: 8500000, sqft: 45000, occupancy: 'R-2', submitDate: '2024-12-15' },
  { id: '3', permitNumber: 'EP-2025-00089', type: 'electrical', status: 'issued', projectName: 'Solar Panel Installation', address: '890 Sunset Blvd, Phoenix, AZ', apn: '345-678-901-002', applicant: 'SunPower', value: 125000, sqft: 2500, occupancy: 'R-3', submitDate: '2024-12-20' },
];

const PARCELS = [
  { id: '1', apn: '123-456-789-000', address: '1234 Main Street', city: 'Springfield', county: 'Greene', state: 'MO', zoneId: 'zone-c3', zoneName: 'Regional Commercial', lotSize: 87120, assessedValue: 2500000, floodZone: 'X', owner: 'Springfield Development LLC' },
  { id: '2', apn: '234-567-890-001', address: '567 Oak Avenue', city: 'Miami', county: 'Miami-Dade', state: 'FL', zoneId: 'zone-r3', zoneName: 'Multi-Family Residential', lotSize: 25000, assessedValue: 1800000, floodZone: 'AE', owner: 'Coastal Properties Trust' },
  { id: '3', apn: '345-678-901-002', address: '890 Industrial Pkwy', city: 'Houston', county: 'Harris', state: 'TX', zoneId: 'zone-i1', zoneName: 'Light Industrial', lotSize: 150000, assessedValue: 3200000, floodZone: 'X500', owner: 'Houston Logistics Inc' },
];

const FEMA_DISASTERS = [
  { id: '1', disasterNumber: 'DR-4806', type: 'hurricane', state: 'FL', declarationDate: '2024-08-15', counties: ['Miami-Dade', 'Broward', 'Palm Beach'], totalObligated: 850000000, paObligated: 520000000, iaObligated: 280000000, projects: 45 },
  { id: '2', disasterNumber: 'DR-4798', type: 'tornado', state: 'MO', declarationDate: '2024-05-20', counties: ['Greene', 'Christian', 'Webster'], totalObligated: 125000000, paObligated: 85000000, iaObligated: 35000000, projects: 18 },
];

const FEMA_PROJECTS = [
  { id: '1', disasterNumber: 'DR-4806', projectNumber: 'PA-08-FL-4806-PW-00125', applicant: 'Miami-Dade County', title: 'Emergency Debris Removal', category: 'A', obligated: 12500000, status: 'in_progress' },
  { id: '2', disasterNumber: 'DR-4806', projectNumber: 'PA-08-FL-4806-PW-00186', applicant: 'City of Miami Beach', title: 'Beach Erosion Emergency Repairs', category: 'B', obligated: 8200000, status: 'obligated' },
  { id: '3', disasterNumber: 'DR-4798', projectNumber: 'PA-07-MO-4798-PW-00045', applicant: 'Greene County', title: 'School Building Reconstruction', category: 'E', obligated: 4500000, status: 'in_progress' },
];

const BUILDING_CODES = [
  { code: 'IBC', name: 'International Building Code', edition: '2021', type: 'building' },
  { code: 'IRC', name: 'International Residential Code', edition: '2021', type: 'residential' },
  { code: 'IFC', name: 'International Fire Code', edition: '2021', type: 'fire' },
  { code: 'IPC', name: 'International Plumbing Code', edition: '2021', type: 'plumbing' },
  { code: 'IMC', name: 'International Mechanical Code', edition: '2021', type: 'mechanical' },
  { code: 'IECC', name: 'International Energy Conservation Code', edition: '2021', type: 'energy' },
  { code: 'NEC', name: 'National Electrical Code', edition: '2023', type: 'electrical' },
  { code: 'ADA', name: 'Americans with Disabilities Act', edition: '2010', type: 'accessibility' },
  { code: 'OSHA', name: 'Occupational Safety and Health', edition: '29 CFR', type: 'safety' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';

  switch (action) {
    case 'dashboard':
      const totalPermitValue = PERMITS.reduce((s, p) => s + p.value, 0);
      const femaObligated = FEMA_DISASTERS.reduce((s, d) => s + d.totalObligated, 0);
      const highRiskParcels = PARCELS.filter(p => ['A', 'AE', 'V', 'VE'].includes(p.floodZone)).length;

      return NextResponse.json({
        success: true,
        data: {
          permits: {
            total: PERMITS.length,
            underReview: PERMITS.filter(p => p.status === 'under_review').length,
            totalValue: totalPermitValue,
            avgReviewDays: 12,
          },
          parcels: {
            total: PARCELS.length,
            highRiskFlood: highRiskParcels,
            totalAssessedValue: PARCELS.reduce((s, p) => s + p.assessedValue, 0),
          },
          fema: {
            activeDisasters: FEMA_DISASTERS.length,
            totalObligated: femaObligated,
            activeProjects: FEMA_PROJECTS.length,
            affectedCounties: FEMA_DISASTERS.flatMap(d => d.counties).length,
          },
          codes: {
            adopted: BUILDING_CODES.length,
            primary: 'IBC 2021',
          },
        },
      });

    case 'zones':
      const category = searchParams.get('category');
      let zones = [...US_ZONES];
      if (category && category !== 'all') zones = zones.filter(z => z.category === category);
      return NextResponse.json({ success: true, data: zones, total: zones.length });

    case 'zone':
      const zoneId = searchParams.get('id');
      const zoneCode = searchParams.get('code');
      const zone = zoneId ? US_ZONES.find(z => z.id === zoneId) : US_ZONES.find(z => z.code === zoneCode);
      if (!zone) return NextResponse.json({ success: false, error: 'Zone not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: zone });

    case 'permits':
      const status = searchParams.get('status');
      const type = searchParams.get('type');
      let permits = [...PERMITS];
      if (status && status !== 'all') permits = permits.filter(p => p.status === status);
      if (type && type !== 'all') permits = permits.filter(p => p.type === type);
      return NextResponse.json({ success: true, data: permits, total: permits.length });

    case 'permit':
      const permitId = searchParams.get('id');
      const permitNumber = searchParams.get('number');
      const permit = permitId ? PERMITS.find(p => p.id === permitId) : PERMITS.find(p => p.permitNumber === permitNumber);
      if (!permit) return NextResponse.json({ success: false, error: 'Permit not found' }, { status: 404 });
      const permitParcel = PARCELS.find(p => p.apn === permit.apn);
      return NextResponse.json({ success: true, data: { ...permit, parcel: permitParcel } });

    case 'parcels':
      const floodZone = searchParams.get('floodZone');
      const county = searchParams.get('county');
      const state = searchParams.get('state');
      let parcels = [...PARCELS];
      if (floodZone && floodZone !== 'all') parcels = parcels.filter(p => p.floodZone === floodZone);
      if (county) parcels = parcels.filter(p => p.county === county);
      if (state) parcels = parcels.filter(p => p.state === state);
      return NextResponse.json({ success: true, data: parcels, total: parcels.length });

    case 'parcel':
      const parcelId = searchParams.get('id');
      const apn = searchParams.get('apn');
      const parcel = parcelId ? PARCELS.find(p => p.id === parcelId) : PARCELS.find(p => p.apn === apn);
      if (!parcel) return NextResponse.json({ success: false, error: 'Parcel not found' }, { status: 404 });
      const parcelZone = US_ZONES.find(z => z.id === parcel.zoneId);
      const parcelPermits = PERMITS.filter(p => p.apn === parcel.apn);
      return NextResponse.json({ success: true, data: { ...parcel, zone: parcelZone, permits: parcelPermits } });

    case 'fema-disasters':
      const disasterState = searchParams.get('state');
      let disasters = [...FEMA_DISASTERS];
      if (disasterState) disasters = disasters.filter(d => d.state === disasterState);
      return NextResponse.json({ success: true, data: disasters, total: disasters.length });

    case 'fema-disaster':
      const disasterNumber = searchParams.get('number');
      const disaster = FEMA_DISASTERS.find(d => d.disasterNumber === disasterNumber);
      if (!disaster) return NextResponse.json({ success: false, error: 'Disaster not found' }, { status: 404 });
      const disasterProjects = FEMA_PROJECTS.filter(p => p.disasterNumber === disasterNumber);
      return NextResponse.json({ success: true, data: { ...disaster, projects: disasterProjects } });

    case 'fema-projects':
      const projDisaster = searchParams.get('disaster');
      const projCategory = searchParams.get('category');
      let femaProjects = [...FEMA_PROJECTS];
      if (projDisaster) femaProjects = femaProjects.filter(p => p.disasterNumber === projDisaster);
      if (projCategory) femaProjects = femaProjects.filter(p => p.category === projCategory);
      return NextResponse.json({ success: true, data: femaProjects, total: femaProjects.length });

    case 'building-codes':
      return NextResponse.json({ success: true, data: BUILDING_CODES });

    case 'code-check':
      const checkCode = searchParams.get('code');
      const checkSection = searchParams.get('section');
      // Simplified code compliance check
      return NextResponse.json({
        success: true,
        data: {
          code: checkCode || 'IBC',
          section: checkSection || '903.2',
          requirement: 'Automatic sprinkler systems required in buildings over 5,000 SF',
          applicable: true,
          exceptions: ['Single-family dwellings', 'Agricultural buildings'],
        },
      });

    case 'flood-check':
      const checkApn = searchParams.get('apn');
      const checkParcel = PARCELS.find(p => p.apn === checkApn);
      if (!checkParcel) return NextResponse.json({ success: false, error: 'Parcel not found' }, { status: 404 });
      
      const isHighRisk = ['A', 'AE', 'V', 'VE'].includes(checkParcel.floodZone);
      return NextResponse.json({
        success: true,
        data: {
          apn: checkParcel.apn,
          floodZone: checkParcel.floodZone,
          riskLevel: isHighRisk ? 'High' : ['B', 'X500'].includes(checkParcel.floodZone) ? 'Moderate' : 'Minimal',
          floodInsuranceRequired: isHighRisk,
          elevationCertificateRequired: isHighRisk,
          baseFloodElevation: isHighRisk ? 12.5 : null,
          requirements: isHighRisk ? [
            'Flood insurance required for federally-backed mortgages',
            'Elevation certificate required',
            'Lowest floor must be at or above BFE',
            'Flood vents required in enclosures below BFE',
          ] : [],
        },
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
      case 'submit_permit':
        return NextResponse.json({
          success: true,
          message: 'Permit application submitted',
          data: {
            permitNumber: `BP-2025-${String(Math.floor(Math.random() * 90000) + 10000)}`,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
            estimatedReviewDays: 14,
          },
        });

      case 'update_permit':
        return NextResponse.json({
          success: true,
          message: 'Permit updated',
          data: { permitId: body.permitId, ...body.updates },
        });

      case 'schedule_inspection':
        return NextResponse.json({
          success: true,
          message: 'Inspection scheduled',
          data: {
            permitId: body.permitId,
            inspectionType: body.inspectionType,
            scheduledDate: body.date,
            confirmationNumber: `INS-${Date.now()}`,
          },
        });

      case 'submit_fema_project':
        return NextResponse.json({
          success: true,
          message: 'FEMA project worksheet submitted',
          data: {
            projectNumber: `PA-${body.disasterNumber}-PW-${String(Math.floor(Math.random() * 90000) + 10000)}`,
            status: 'formulation',
            submittedAt: new Date().toISOString(),
          },
        });

      case 'substantial_damage_assessment':
        const damagePercent = (body.damageValue / body.preDisasterValue) * 100;
        return NextResponse.json({
          success: true,
          message: 'Substantial damage assessment completed',
          data: {
            parcelId: body.parcelId,
            preDisasterValue: body.preDisasterValue,
            damageValue: body.damageValue,
            damagePercentage: damagePercent,
            isSubstantialDamage: damagePercent >= 50,
            requiredActions: damagePercent >= 50 ? [
              'Building must be brought into compliance with current floodplain regulations',
              'Elevation to or above BFE required',
              'New flood insurance rating will apply',
            ] : [],
          },
        });

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
