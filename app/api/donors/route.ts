// app/api/donors/route.ts
// Donor Portal API - Transparency & Fund Tracking

import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const DONORS = [
  { id: 'd1', name: 'World Bank', shortName: 'WB', type: 'multilateral', country: 'International', totalPledged: 500000000, totalDisbursed: 320000000, activeProjects: 12, complianceRating: 94, focusAreas: ['Infrastructure', 'Energy', 'Public Administration'] },
  { id: 'd2', name: 'EBRD', shortName: 'EBRD', type: 'multilateral', country: 'International', totalPledged: 350000000, totalDisbursed: 180000000, activeProjects: 8, complianceRating: 91, focusAreas: ['Transport', 'Municipal', 'Energy Efficiency'] },
  { id: 'd3', name: 'European Investment Bank', shortName: 'EIB', type: 'multilateral', country: 'EU', totalPledged: 280000000, totalDisbursed: 145000000, activeProjects: 6, complianceRating: 96, focusAreas: ['Housing', 'Social', 'Digital'] },
  { id: 'd4', name: 'USAID', shortName: 'USAID', type: 'bilateral', country: 'USA', totalPledged: 200000000, totalDisbursed: 125000000, activeProjects: 15, complianceRating: 89, focusAreas: ['Governance', 'Anti-corruption'] },
  { id: 'd5', name: 'JICA', shortName: 'JICA', type: 'bilateral', country: 'Japan', totalPledged: 150000000, totalDisbursed: 85000000, activeProjects: 5, complianceRating: 98, focusAreas: ['Reconstruction', 'Healthcare'] },
  { id: 'd6', name: 'KfW', shortName: 'KfW', type: 'bilateral', country: 'Germany', totalPledged: 180000000, totalDisbursed: 95000000, activeProjects: 7, complianceRating: 93, focusAreas: ['Energy', 'Water'] },
];

const PROGRAMS = [
  { id: 'prog-001', donorId: 'd1', donorName: 'World Bank', name: 'Ukraine Recovery Program', totalBudget: 250000000, currency: 'USD', status: 'disbursed', sector: 'Multi-sector', complianceStatus: 'compliant' },
  { id: 'prog-002', donorId: 'd2', donorName: 'EBRD', name: 'Municipal Infrastructure', totalBudget: 120000000, currency: 'EUR', status: 'disbursed', sector: 'Infrastructure', complianceStatus: 'compliant' },
  { id: 'prog-003', donorId: 'd4', donorName: 'USAID', name: 'Transparent Governance', totalBudget: 45000000, currency: 'USD', status: 'disbursed', sector: 'Governance', complianceStatus: 'minor_issues' },
];

const PROJECTS = [
  { id: 'p1', programId: 'prog-001', donorId: 'd1', donorName: 'World Bank', name: 'Kharkiv School Reconstruction', sector: 'Education', oblast: 'Kharkiv', budget: 35000000, utilized: 28500000, utilizationRate: 81, phase: 'implementation', beneficiaries: 15000, complianceStatus: 'compliant' },
  { id: 'p2', programId: 'prog-001', donorId: 'd1', donorName: 'World Bank', name: 'Kyiv Energy Infrastructure', sector: 'Energy', oblast: 'Kyiv', budget: 85000000, utilized: 52000000, utilizationRate: 61, phase: 'implementation', beneficiaries: 500000, complianceStatus: 'compliant' },
  { id: 'p3', programId: 'prog-001', donorId: 'd1', donorName: 'World Bank', name: 'Odesa Port Facilities', sector: 'Transport', oblast: 'Odesa', budget: 65000000, utilized: 18000000, utilizationRate: 28, phase: 'implementation', beneficiaries: 50000, complianceStatus: 'under_review' },
  { id: 'p4', programId: 'prog-002', donorId: 'd2', donorName: 'EBRD', name: 'Dnipro Water System', sector: 'Water', oblast: 'Dnipro', budget: 45000000, utilized: 32000000, utilizationRate: 71, phase: 'implementation', beneficiaries: 250000, complianceStatus: 'compliant' },
  { id: 'p5', programId: 'prog-001', donorId: 'd5', donorName: 'JICA', name: 'Lviv Hospital Modernization', sector: 'Healthcare', oblast: 'Lviv', budget: 28000000, utilized: 22000000, utilizationRate: 79, phase: 'implementation', beneficiaries: 120000, complianceStatus: 'compliant' },
];

const REPORTS = [
  { id: 'rep-001', type: 'quarterly', programId: 'prog-001', donorId: 'd1', period: 'Q3 2024', submittedDate: '2024-10-15', status: 'approved' },
  { id: 'rep-002', type: 'quarterly', programId: 'prog-002', donorId: 'd2', period: 'Q3 2024', submittedDate: '2024-10-20', status: 'approved' },
  { id: 'rep-003', type: 'annual', programId: 'prog-003', donorId: 'd4', period: '2024', submittedDate: '2024-12-15', status: 'under_review' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';

  switch (action) {
    case 'dashboard':
      const totalPledged = DONORS.reduce((s, d) => s + d.totalPledged, 0);
      const totalDisbursed = DONORS.reduce((s, d) => s + d.totalDisbursed, 0);
      const totalUtilized = PROJECTS.reduce((s, p) => s + p.utilized, 0);
      const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);

      return NextResponse.json({
        success: true,
        data: {
          totalDonors: DONORS.length,
          totalPledged,
          totalDisbursed,
          totalUtilized,
          disbursementRate: Math.round((totalDisbursed / totalPledged) * 100),
          utilizationRate: Math.round((totalUtilized / totalDisbursed) * 100),
          activePrograms: PROGRAMS.filter(p => p.status === 'disbursed').length,
          activeProjects: PROJECTS.filter(p => p.phase === 'implementation').length,
          totalBeneficiaries: PROJECTS.reduce((s, p) => s + p.beneficiaries, 0),
          avgComplianceRating: Math.round(DONORS.reduce((s, d) => s + d.complianceRating, 0) / DONORS.length),
          byDonorType: DONORS.reduce((acc: Record<string, { count: number; amount: number }>, d) => {
            if (!acc[d.type]) acc[d.type] = { count: 0, amount: 0 };
            acc[d.type].count++;
            acc[d.type].amount += d.totalPledged;
            return acc;
          }, {}),
          bySector: Object.entries(PROJECTS.reduce((acc: Record<string, { budget: number; projects: number }>, p) => {
            if (!acc[p.sector]) acc[p.sector] = { budget: 0, projects: 0 };
            acc[p.sector].budget += p.budget;
            acc[p.sector].projects++;
            return acc;
          }, {})).map(([sector, data]) => ({ sector, ...data })),
        },
      });

    case 'donors':
      const donorType = searchParams.get('type');
      let donors = [...DONORS];
      if (donorType && donorType !== 'all') donors = donors.filter(d => d.type === donorType);
      return NextResponse.json({ success: true, data: donors, total: donors.length });

    case 'donor':
      const donorId = searchParams.get('id');
      const donor = DONORS.find(d => d.id === donorId);
      if (!donor) return NextResponse.json({ success: false, error: 'Donor not found' }, { status: 404 });
      const donorPrograms = PROGRAMS.filter(p => p.donorId === donorId);
      const donorProjects = PROJECTS.filter(p => p.donorId === donorId);
      return NextResponse.json({ success: true, data: { ...donor, programs: donorPrograms, projects: donorProjects } });

    case 'programs':
      const progDonorId = searchParams.get('donor');
      let programs = [...PROGRAMS];
      if (progDonorId) programs = programs.filter(p => p.donorId === progDonorId);
      return NextResponse.json({ success: true, data: programs, total: programs.length });

    case 'program':
      const programId = searchParams.get('id');
      const program = PROGRAMS.find(p => p.id === programId);
      if (!program) return NextResponse.json({ success: false, error: 'Program not found' }, { status: 404 });
      const programProjects = PROJECTS.filter(p => p.programId === programId);
      return NextResponse.json({ success: true, data: { ...program, projects: programProjects } });

    case 'projects':
      const sector = searchParams.get('sector');
      const oblast = searchParams.get('oblast');
      const projDonorId = searchParams.get('donor');
      let projects = [...PROJECTS];
      if (sector && sector !== 'all') projects = projects.filter(p => p.sector === sector);
      if (oblast) projects = projects.filter(p => p.oblast === oblast);
      if (projDonorId) projects = projects.filter(p => p.donorId === projDonorId);
      return NextResponse.json({ success: true, data: projects, total: projects.length });

    case 'project':
      const projectId = searchParams.get('id');
      const project = PROJECTS.find(p => p.id === projectId);
      if (!project) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      const projectDonor = DONORS.find(d => d.id === project.donorId);
      return NextResponse.json({ success: true, data: { ...project, donor: projectDonor } });

    case 'reports':
      const reportDonor = searchParams.get('donor');
      const reportStatus = searchParams.get('status');
      let reports = [...REPORTS];
      if (reportDonor) reports = reports.filter(r => r.donorId === reportDonor);
      if (reportStatus && reportStatus !== 'all') reports = reports.filter(r => r.status === reportStatus);
      return NextResponse.json({ success: true, data: reports, total: reports.length });

    case 'compliance':
      const complianceData = {
        overall: Math.round(DONORS.reduce((s, d) => s + d.complianceRating, 0) / DONORS.length),
        byProject: PROJECTS.reduce((acc: Record<string, number>, p) => {
          acc[p.complianceStatus] = (acc[p.complianceStatus] || 0) + 1;
          return acc;
        }, {}),
        byDonor: DONORS.map(d => ({ id: d.id, name: d.shortName, rating: d.complianceRating })),
      };
      return NextResponse.json({ success: true, data: complianceData });

    case 'transparency':
      return NextResponse.json({
        success: true,
        data: {
          financialReports: 24,
          auditReports: 6,
          procurementRecords: 45,
          projectDocuments: 128,
          publicDatasets: 8,
          lastUpdated: '2025-01-07',
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
      case 'submit_report':
        return NextResponse.json({
          success: true,
          message: 'Report submitted successfully',
          data: { id: `rep-${Date.now()}`, status: 'submitted', submittedAt: new Date().toISOString() },
        });

      case 'update_project':
        return NextResponse.json({
          success: true,
          message: 'Project updated',
          data: { projectId: body.projectId, ...body.updates },
        });

      case 'request_disbursement':
        return NextResponse.json({
          success: true,
          message: 'Disbursement request submitted',
          data: { requestId: `disb-${Date.now()}`, status: 'pending', amount: body.amount },
        });

      case 'add_outcome':
        return NextResponse.json({
          success: true,
          message: 'Outcome recorded',
          data: { projectId: body.projectId, outcome: body.outcome },
        });

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
