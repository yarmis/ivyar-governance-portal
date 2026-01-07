// app/api/zoning/route.ts
// Zoning & Cadastre Module API

import { NextRequest, NextResponse } from 'next/server';

// Types
type ZoneType = 'residential' | 'commercial' | 'industrial' | 'mixed_use' | 'agricultural' | 'protected';
type ParcelStatus = 'active' | 'pending_registration' | 'disputed' | 'subdividing' | 'merging' | 'archived';
type PermitStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired';

// Mock Data
const ZONES = [
  { id: 'zone-001', code: 'R-1', name: 'Residential Low Density', type: 'residential', maxHeight: 12, maxStoreys: 3, maxCoverage: 30, area: 450, parcelsCount: 2100 },
  { id: 'zone-002', code: 'R-2', name: 'Residential Medium Density', type: 'residential', maxHeight: 18, maxStoreys: 5, maxCoverage: 40, area: 245, parcelsCount: 1250 },
  { id: 'zone-003', code: 'R-3', name: 'Residential High Density', type: 'residential', maxHeight: 75, maxStoreys: 25, maxCoverage: 50, area: 85, parcelsCount: 320 },
  { id: 'zone-004', code: 'C-1', name: 'Commercial Core', type: 'commercial', maxHeight: 100, maxStoreys: 30, maxCoverage: 70, area: 65, parcelsCount: 420 },
  { id: 'zone-005', code: 'I-1', name: 'Light Industrial', type: 'industrial', maxHeight: 25, maxStoreys: 4, maxCoverage: 60, area: 320, parcelsCount: 185 },
  { id: 'zone-006', code: 'MU-1', name: 'Mixed Use', type: 'mixed_use', maxHeight: 35, maxStoreys: 10, maxCoverage: 55, area: 95, parcelsCount: 450 },
  { id: 'zone-007', code: 'P-1', name: 'Protected Natural', type: 'protected', maxHeight: 0, maxStoreys: 0, maxCoverage: 0, area: 1250, parcelsCount: 45 },
  { id: 'zone-008', code: 'A-1', name: 'Agricultural', type: 'agricultural', maxHeight: 12, maxStoreys: 2, maxCoverage: 10, area: 2500, parcelsCount: 890 },
];

const PARCELS = [
  { id: 'p1', cadastralNumber: '8000000000:01:001:0001', address: '15 Khreshchatyk St, Kyiv', zoneId: 'zone-004', area: 2500, status: 'active', ownershipType: 'private', valuationEUR: 3125000, aiComplianceScore: 85 },
  { id: 'p2', cadastralNumber: '8000000000:02:015:0045', address: '78 Peremohy Ave, Kyiv', zoneId: 'zone-002', area: 5000, status: 'active', ownershipType: 'municipal', valuationEUR: 1125000, aiComplianceScore: 92 },
  { id: 'p3', cadastralNumber: '8000000000:03:022:0112', address: '25 Industrial St, Kyiv', zoneId: 'zone-005', area: 15000, status: 'disputed', ownershipType: 'private', valuationEUR: 700000, aiComplianceScore: 45 },
  { id: 'p4', cadastralNumber: '8000000000:04:008:0078', address: '112 Shevchenko Blvd, Kyiv', zoneId: 'zone-006', area: 3200, status: 'active', ownershipType: 'private', valuationEUR: 1700000, aiComplianceScore: 98 },
  { id: 'p5', cadastralNumber: '8000000000:05:003:0234', address: 'Holosiivskyi Forest', zoneId: 'zone-007', area: 250000, status: 'active', ownershipType: 'state', valuationEUR: 0, aiComplianceScore: 100 },
];

const PERMITS = [
  { id: 'pm1', permitNumber: 'BP-2025-0001', parcelId: 'p1', type: 'reconstruction', status: 'under_review', projectName: 'Khreshchatyk Business Center Renovation', applicant: 'Kyiv Development LLC', submittedDate: '2025-01-02', complianceScore: 78, violations: ['Exceeds heritage zone height'] },
  { id: 'pm2', permitNumber: 'BP-2025-0002', parcelId: 'p2', type: 'construction', status: 'approved', projectName: 'Peremohy Residential Complex', applicant: 'City Housing Department', submittedDate: '2024-11-15', complianceScore: 100, violations: [] },
  { id: 'pm3', permitNumber: 'BP-2024-0089', parcelId: 'p4', type: 'construction', status: 'approved', projectName: 'Shevchenko Mixed-Use Tower', applicant: 'Urban Mix Development', submittedDate: '2024-06-10', complianceScore: 95, violations: [] },
  { id: 'pm4', permitNumber: 'BP-2025-0003', parcelId: 'p3', type: 'renovation', status: 'rejected', projectName: 'Industrial Facility Expansion', applicant: 'Industrial Holdings JSC', submittedDate: '2025-01-05', complianceScore: 35, violations: ['Environmental remediation not completed', 'Ownership dispute'] },
];

const RESTRICTIONS = [
  { id: 'r1', code: 'HRT-001', type: 'heritage', name: 'Heritage Protection', severity: 'strict', legalBasis: 'Law on Cultural Heritage' },
  { id: 'r2', code: 'HGT-001', type: 'height_limit', name: 'Height Restriction', severity: 'standard', legalBasis: 'DBN B.2.2-12:2019' },
  { id: 'r3', code: 'ENV-001', type: 'environmental', name: 'Environmental Zone', severity: 'strict', legalBasis: 'Law on Environmental Protection' },
  { id: 'r4', code: 'FLD-001', type: 'flood_zone', name: 'Flood Risk Zone', severity: 'strict', legalBasis: 'Water Code of Ukraine' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';

  switch (action) {
    case 'dashboard':
      const totalArea = ZONES.reduce((s, z) => s + z.area, 0);
      return NextResponse.json({
        success: true,
        data: {
          totalZones: ZONES.length,
          totalParcels: PARCELS.length,
          totalArea,
          disputedParcels: PARCELS.filter(p => p.status === 'disputed').length,
          pendingPermits: PERMITS.filter(p => ['submitted', 'under_review'].includes(p.status)).length,
          avgComplianceScore: Math.round(PARCELS.reduce((s, p) => s + p.aiComplianceScore, 0) / PARCELS.length),
          totalValuation: PARCELS.reduce((s, p) => s + p.valuationEUR, 0),
          zonesByType: ZONES.reduce((acc: Record<string, number>, z) => {
            acc[z.type] = (acc[z.type] || 0) + 1;
            return acc;
          }, {}),
          parcelsByStatus: PARCELS.reduce((acc: Record<string, number>, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
          }, {}),
        },
      });

    case 'zones':
      const zoneType = searchParams.get('type');
      let zones = [...ZONES];
      if (zoneType && zoneType !== 'all') {
        zones = zones.filter(z => z.type === zoneType);
      }
      return NextResponse.json({ success: true, data: zones, total: zones.length });

    case 'zone':
      const zoneId = searchParams.get('id');
      const zone = ZONES.find(z => z.id === zoneId);
      if (!zone) return NextResponse.json({ success: false, error: 'Zone not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: zone });

    case 'parcels':
      const status = searchParams.get('status');
      const zoneFilter = searchParams.get('zone');
      const search = searchParams.get('search')?.toLowerCase();
      let parcels = [...PARCELS];
      if (status && status !== 'all') parcels = parcels.filter(p => p.status === status);
      if (zoneFilter && zoneFilter !== 'all') parcels = parcels.filter(p => p.zoneId === zoneFilter);
      if (search) parcels = parcels.filter(p => p.cadastralNumber.includes(search) || p.address.toLowerCase().includes(search));
      return NextResponse.json({ success: true, data: parcels, total: parcels.length });

    case 'parcel':
      const parcelId = searchParams.get('id');
      const cadastral = searchParams.get('cadastral');
      const parcel = parcelId ? PARCELS.find(p => p.id === parcelId) : PARCELS.find(p => p.cadastralNumber === cadastral);
      if (!parcel) return NextResponse.json({ success: false, error: 'Parcel not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: { ...parcel, zone: ZONES.find(z => z.id === parcel.zoneId) } });

    case 'permits':
      const permitStatus = searchParams.get('status');
      let permits = [...PERMITS];
      if (permitStatus && permitStatus !== 'all') permits = permits.filter(p => p.status === permitStatus);
      return NextResponse.json({ success: true, data: permits, total: permits.length });

    case 'permit':
      const permitId = searchParams.get('id');
      const permit = PERMITS.find(p => p.id === permitId);
      if (!permit) return NextResponse.json({ success: false, error: 'Permit not found' }, { status: 404 });
      const permitParcel = PARCELS.find(p => p.id === permit.parcelId);
      return NextResponse.json({ success: true, data: { ...permit, parcel: permitParcel } });

    case 'restrictions':
      return NextResponse.json({ success: true, data: RESTRICTIONS });

    case 'disputed':
      return NextResponse.json({ success: true, data: PARCELS.filter(p => p.status === 'disputed') });

    case 'compliance-check':
      const checkParcelId = searchParams.get('parcelId');
      const proposedHeight = parseFloat(searchParams.get('height') || '0');
      const proposedStoreys = parseInt(searchParams.get('storeys') || '0');
      
      const checkParcel = PARCELS.find(p => p.id === checkParcelId);
      if (!checkParcel) return NextResponse.json({ success: false, error: 'Parcel not found' }, { status: 404 });
      
      const checkZone = ZONES.find(z => z.id === checkParcel.zoneId);
      if (!checkZone) return NextResponse.json({ success: false, error: 'Zone not found' }, { status: 404 });

      const violations: string[] = [];
      let score = 100;

      if (proposedHeight > checkZone.maxHeight) {
        violations.push(`Height ${proposedHeight}m exceeds zone maximum ${checkZone.maxHeight}m`);
        score -= 25;
      }
      if (proposedStoreys > checkZone.maxStoreys) {
        violations.push(`${proposedStoreys} storeys exceeds zone maximum ${checkZone.maxStoreys}`);
        score -= 20;
      }
      if (checkParcel.status === 'disputed') {
        violations.push('Parcel ownership is disputed');
        score -= 30;
      }

      return NextResponse.json({
        success: true,
        data: {
          parcel: checkParcel,
          zone: checkZone,
          proposedHeight,
          proposedStoreys,
          complianceScore: Math.max(0, score),
          violations,
          recommendation: score >= 80 ? 'Proceed with application' : score >= 60 ? 'Revise proposal' : 'Application likely to be rejected',
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
      case 'create_permit':
        return NextResponse.json({
          success: true,
          message: 'Permit application created',
          data: { id: `permit-${Date.now()}`, status: 'draft', ...body.permit },
        });

      case 'submit_permit':
        return NextResponse.json({
          success: true,
          message: 'Permit submitted for review',
          data: { permitId: body.permitId, status: 'submitted', submittedDate: new Date().toISOString() },
        });

      case 'create_application':
        return NextResponse.json({
          success: true,
          message: 'Zoning application created',
          data: { id: `app-${Date.now()}`, status: 'draft', ...body.application },
        });

      case 'update_parcel':
        return NextResponse.json({
          success: true,
          message: 'Parcel updated',
          data: { parcelId: body.parcelId, ...body.updates },
        });

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
