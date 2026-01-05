import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'list-countries':
        return NextResponse.json({ success: true, ...listCountries(body) });
      case 'country-dashboard':
        return NextResponse.json({ success: true, ...getCountryDashboard(body) });
      case 'ministries':
        return NextResponse.json({ success: true, ...getMinistries(body) });
      case 'ministry-dashboard':
        return NextResponse.json({ success: true, ...getMinistryDashboard(body) });
      case 'cross-border':
        return NextResponse.json({ success: true, ...crossBorderExchange(body) });
      case 'regional-hub':
        return NextResponse.json({ success: true, ...getRegionalHub(body) });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function listCountries(body: any): any {
  return {
    totalCountries: 8,
    activeCountries: 6,
    countries: [
      {
        code: 'UA',
        name: 'Ukraine',
        flag: '🇺🇦',
        status: 'active',
        tier: 'primary',
        joinedAt: '2024-01-01',
        dataResidency: 'Kyiv, Ukraine',
        ministries: 12,
        activePrograms: 156,
        totalBudget: 2500000000,
        beneficiaries: 4500000,
        complianceScore: 96,
        lastSync: new Date(Date.now() - 300000).toISOString(),
        features: ['full-governance', 'blockchain-audit', 'ai-advisor', 'real-time-signals']
      },
      {
        code: 'MD',
        name: 'Moldova',
        flag: '🇲🇩',
        status: 'active',
        tier: 'secondary',
        joinedAt: '2024-06-15',
        dataResidency: 'Chișinău, Moldova',
        ministries: 8,
        activePrograms: 45,
        totalBudget: 350000000,
        beneficiaries: 280000,
        complianceScore: 94,
        lastSync: new Date(Date.now() - 600000).toISOString(),
        features: ['full-governance', 'ai-advisor']
      },
      {
        code: 'GE',
        name: 'Georgia',
        flag: '🇬🇪',
        status: 'active',
        tier: 'secondary',
        joinedAt: '2024-08-01',
        dataResidency: 'Tbilisi, Georgia',
        ministries: 7,
        activePrograms: 32,
        totalBudget: 220000000,
        beneficiaries: 150000,
        complianceScore: 92,
        lastSync: new Date(Date.now() - 900000).toISOString(),
        features: ['full-governance', 'ai-advisor']
      },
      {
        code: 'PL',
        name: 'Poland',
        flag: '🇵🇱',
        status: 'active',
        tier: 'partner',
        joinedAt: '2024-03-01',
        dataResidency: 'Warsaw, Poland (EU)',
        ministries: 5,
        activePrograms: 28,
        totalBudget: 450000000,
        beneficiaries: 320000,
        complianceScore: 98,
        lastSync: new Date(Date.now() - 450000).toISOString(),
        features: ['refugee-coordination', 'cross-border-exchange']
      },
      {
        code: 'RO',
        name: 'Romania',
        flag: '🇷🇴',
        status: 'active',
        tier: 'partner',
        joinedAt: '2024-04-15',
        dataResidency: 'Bucharest, Romania (EU)',
        ministries: 4,
        activePrograms: 18,
        totalBudget: 180000000,
        beneficiaries: 95000,
        complianceScore: 95,
        lastSync: new Date(Date.now() - 750000).toISOString(),
        features: ['refugee-coordination', 'cross-border-exchange']
      },
      {
        code: 'SK',
        name: 'Slovakia',
        flag: '🇸🇰',
        status: 'active',
        tier: 'partner',
        joinedAt: '2024-05-01',
        dataResidency: 'Bratislava, Slovakia (EU)',
        ministries: 3,
        activePrograms: 12,
        totalBudget: 85000000,
        beneficiaries: 45000,
        complianceScore: 97,
        lastSync: new Date(Date.now() - 1200000).toISOString(),
        features: ['refugee-coordination']
      },
      {
        code: 'AM',
        name: 'Armenia',
        flag: '🇦🇲',
        status: 'onboarding',
        tier: 'secondary',
        joinedAt: '2025-01-01',
        dataResidency: 'Yerevan, Armenia',
        ministries: 0,
        activePrograms: 0,
        totalBudget: 0,
        beneficiaries: 0,
        complianceScore: 0,
        features: []
      },
      {
        code: 'AZ',
        name: 'Azerbaijan',
        flag: '🇦🇿',
        status: 'pending',
        tier: 'secondary',
        joinedAt: null,
        dataResidency: 'TBD',
        ministries: 0,
        activePrograms: 0,
        totalBudget: 0,
        beneficiaries: 0,
        complianceScore: 0,
        features: []
      }
    ],
    summary: {
      totalBudget: 3785000000,
      totalBeneficiaries: 5390000,
      totalPrograms: 291,
      avgComplianceScore: 95.3,
      regions: ['Eastern Europe', 'South Caucasus', 'Central Europe']
    }
  };
}

function getCountryDashboard(body: any): any {
  const { countryCode } = body;

  const countryData: Record<string, any> = {
    UA: {
      country: { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
      overview: {
        totalBudget: 2500000000,
        utilized: 1875000000,
        utilizationRate: 75,
        beneficiaries: 4500000,
        activePrograms: 156,
        ministries: 12
      },
      governanceHealth: {
        overall: 96,
        decisionSpeed: 94,
        compliance: 98,
        transparency: 95,
        auditReadiness: 97
      },
      topPrograms: [
        { name: 'IDP Support Program', ministry: 'Social Policy', budget: 450000000, beneficiaries: 1200000, status: 'active' },
        { name: 'Healthcare Emergency', ministry: 'Health', budget: 380000000, beneficiaries: 850000, status: 'active' },
        { name: 'Education Continuity', ministry: 'Education', budget: 280000000, beneficiaries: 620000, status: 'active' },
        { name: 'Infrastructure Recovery', ministry: 'Infrastructure', budget: 520000000, beneficiaries: 0, status: 'active' },
        { name: 'Social Protection', ministry: 'Social Policy', budget: 340000000, beneficiaries: 980000, status: 'active' }
      ],
      recentActivity: [
        { time: '10 min ago', action: 'Budget allocation approved', ministry: 'Finance', amount: 25000000 },
        { time: '25 min ago', action: 'Program milestone completed', ministry: 'Health', program: 'Healthcare Emergency' },
        { time: '1 hour ago', action: 'Audit report submitted', ministry: 'Social Policy', status: 'clean' },
        { time: '2 hours ago', action: 'Cross-border data sync', partner: 'Poland', records: 15000 }
      ],
      alerts: [
        { severity: 'medium', message: 'Q4 reporting deadline in 15 days', ministry: 'All' },
        { severity: 'low', message: 'System maintenance scheduled', date: '2026-01-10' }
      ]
    }
  };

  return countryData[countryCode] || countryData['UA'];
}

function getMinistries(body: any): any {
  const { countryCode } = body;

  return {
    countryCode: countryCode || 'UA',
    totalMinistries: 12,
    ministries: [
      {
        id: 'MIN-UA-001',
        code: 'MSP',
        name: 'Ministry of Social Policy',
        nameLocal: 'Міністерство соціальної політики',
        minister: 'Oksana Zholnovych',
        status: 'active',
        programs: 45,
        budget: 890000000,
        utilized: 712000000,
        beneficiaries: 2100000,
        staff: 2500,
        complianceScore: 97,
        lastAudit: '2025-11-15',
        systems: ['DIIA', 'E-Social', 'Pension Fund'],
        departments: ['Social Protection', 'Pension Services', 'Family Support', 'Disability Services']
      },
      {
        id: 'MIN-UA-002',
        code: 'MOF',
        name: 'Ministry of Finance',
        nameLocal: 'Міністерство фінансів',
        minister: 'Serhii Marchenko',
        status: 'active',
        programs: 28,
        budget: 0,
        budgetManaged: 2500000000,
        staff: 1800,
        complianceScore: 99,
        lastAudit: '2025-10-01',
        systems: ['Treasury', 'E-Data', 'ProZorro'],
        departments: ['Budget', 'Treasury', 'Tax Policy', 'Public Debt']
      },
      {
        id: 'MIN-UA-003',
        code: 'MOH',
        name: 'Ministry of Health',
        nameLocal: 'Міністерство охорони здоров\'я',
        minister: 'Viktor Liashko',
        status: 'active',
        programs: 32,
        budget: 520000000,
        utilized: 416000000,
        beneficiaries: 850000,
        staff: 3200,
        complianceScore: 95,
        lastAudit: '2025-09-20',
        systems: ['eHealth', 'NHSU', 'MedData'],
        departments: ['Public Health', 'Medical Services', 'Pharmaceuticals', 'Emergency Medicine']
      },
      {
        id: 'MIN-UA-004',
        code: 'MOE',
        name: 'Ministry of Education',
        nameLocal: 'Міністерство освіти і науки',
        minister: 'Oksen Lisovyi',
        status: 'active',
        programs: 24,
        budget: 380000000,
        utilized: 285000000,
        beneficiaries: 620000,
        staff: 2100,
        complianceScore: 96,
        lastAudit: '2025-10-15',
        systems: ['EDEBO', 'NMT', 'E-School'],
        departments: ['General Education', 'Higher Education', 'Science', 'Youth Policy']
      },
      {
        id: 'MIN-UA-005',
        code: 'MINF',
        name: 'Ministry of Infrastructure',
        nameLocal: 'Міністерство інфраструктури',
        minister: 'Oleksandr Kubrakov',
        status: 'active',
        programs: 18,
        budget: 620000000,
        utilized: 372000000,
        beneficiaries: 0,
        staff: 1500,
        complianceScore: 94,
        lastAudit: '2025-08-30',
        systems: ['DREAM', 'Transport Portal'],
        departments: ['Roads', 'Railways', 'Ports', 'Aviation']
      },
      {
        id: 'MIN-UA-006',
        code: 'MCTOT',
        name: 'Ministry of Reintegration',
        nameLocal: 'Міністерство реінтеграції',
        minister: 'Iryna Vereshchuk',
        status: 'active',
        programs: 15,
        budget: 180000000,
        utilized: 153000000,
        beneficiaries: 450000,
        staff: 800,
        complianceScore: 98,
        lastAudit: '2025-11-01',
        systems: ['IDP Registry', 'Humanitarian Hub'],
        departments: ['IDP Affairs', 'TOT Policy', 'Humanitarian Corridors']
      }
    ],
    interMinistryCoordination: {
      activeWorkgroups: 8,
      sharedPrograms: 12,
      dataExchanges: 45,
      lastCoordinationMeeting: '2025-12-28'
    }
  };
}

function getMinistryDashboard(body: any): any {
  const { ministryId } = body;

  return {
    ministry: {
      id: ministryId || 'MIN-UA-001',
      name: 'Ministry of Social Policy',
      code: 'MSP'
    },
    kpis: [
      { name: 'Budget Utilization', value: 80, target: 85, unit: '%', trend: 'up' },
      { name: 'Beneficiaries Served', value: 2100000, target: 2500000, trend: 'up' },
      { name: 'Program Completion', value: 72, target: 80, unit: '%', trend: 'stable' },
      { name: 'Compliance Score', value: 97, target: 95, unit: '%', trend: 'up' },
      { name: 'Response Time', value: 2.3, target: 3, unit: 'days', trend: 'down' }
    ],
    programs: [
      { id: 'PRG-001', name: 'IDP Cash Assistance', status: 'active', budget: 250000000, spent: 212500000, beneficiaries: 850000 },
      { id: 'PRG-002', name: 'Pension Support', status: 'active', budget: 180000000, spent: 162000000, beneficiaries: 450000 },
      { id: 'PRG-003', name: 'Family Benefits', status: 'active', budget: 120000000, spent: 96000000, beneficiaries: 320000 },
      { id: 'PRG-004', name: 'Disability Services', status: 'active', budget: 95000000, spent: 71250000, beneficiaries: 180000 }
    ],
    governance: {
      pendingDecisions: 8,
      awaitingApproval: 12,
      escalatedIssues: 2,
      auditFindings: 0
    },
    dataQuality: {
      completeness: 98,
      accuracy: 97,
      timeliness: 95,
      consistency: 99
    }
  };
}

function crossBorderExchange(body: any): any {
  const { subAction, sourceCountry, targetCountry } = body;

  if (subAction === 'status') {
    return {
      exchanges: [
        {
          id: 'CBE-001',
          source: { code: 'UA', name: 'Ukraine' },
          target: { code: 'PL', name: 'Poland' },
          type: 'refugee-data',
          status: 'active',
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          recordsSynced: 125000,
          frequency: 'daily',
          compliance: ['GDPR', 'Bilateral Agreement 2024']
        },
        {
          id: 'CBE-002',
          source: { code: 'UA', name: 'Ukraine' },
          target: { code: 'MD', name: 'Moldova' },
          type: 'humanitarian-coordination',
          status: 'active',
          lastSync: new Date(Date.now() - 7200000).toISOString(),
          recordsSynced: 45000,
          frequency: 'daily',
          compliance: ['Bilateral Agreement 2024']
        },
        {
          id: 'CBE-003',
          source: { code: 'UA', name: 'Ukraine' },
          target: { code: 'RO', name: 'Romania' },
          type: 'refugee-data',
          status: 'active',
          lastSync: new Date(Date.now() - 5400000).toISOString(),
          recordsSynced: 38000,
          frequency: 'daily',
          compliance: ['GDPR', 'EU Framework']
        }
      ],
      summary: {
        totalExchanges: 3,
        activeExchanges: 3,
        totalRecordsSynced: 208000,
        lastGlobalSync: new Date(Date.now() - 3600000).toISOString()
      }
    };
  }

  if (subAction === 'initiate') {
    return {
      exchangeId: `CBE-${Date.now().toString(36).toUpperCase()}`,
      status: 'initiated',
      source: sourceCountry,
      target: targetCountry,
      steps: [
        { step: 'Authorization', status: 'pending' },
        { step: 'Data Preparation', status: 'pending' },
        { step: 'Encryption', status: 'pending' },
        { step: 'Transfer', status: 'pending' },
        { step: 'Verification', status: 'pending' }
      ]
    };
  }

  return { subAction, message: 'Cross-border operation completed' };
}

function getRegionalHub(body: any): any {
  return {
    hub: 'Eastern Europe & South Caucasus',
    coordinator: 'IVYAR Regional Office',
    countries: ['UA', 'MD', 'GE', 'PL', 'RO', 'SK', 'AM', 'AZ'],
    activeCountries: 6,
    statistics: {
      totalBudget: 3785000000,
      totalBeneficiaries: 5390000,
      totalPrograms: 291,
      crossBorderExchanges: 12,
      sharedStandards: ['IATI', 'HXL', 'OpenAPI 3.1']
    },
    coordination: {
      nextMeeting: '2026-01-15',
      activeWorkgroups: ['Data Standards', 'Refugee Coordination', 'Financial Reporting', 'Audit Harmonization'],
      sharedResources: ['Translation Services', 'Audit Pool', 'Technical Support']
    },
    compliance: {
      euFramework: 94,
      unStandards: 96,
      bilateralAgreements: 12
    }
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS National Governance',
    version: '4.0',
    actions: ['list-countries', 'country-dashboard', 'ministries', 'ministry-dashboard', 'cross-border', 'regional-hub'],
    description: 'Multi-country, multi-ministry national governance cloud'
  });
}