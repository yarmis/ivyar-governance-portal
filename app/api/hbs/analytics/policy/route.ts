import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, domain = 'all', priority = 'all' } = await request.json();

    if (action === 'recommendations') {
      return NextResponse.json({ success: true, ...getRecommendations(domain, priority) });
    }
    if (action === 'policy-gaps') {
      return NextResponse.json({ success: true, ...getPolicyGaps(domain) });
    }
    if (action === 'benchmarks') {
      return NextResponse.json({ success: true, ...getBenchmarks(domain) });
    }
    if (action === 'impact-assessment') {
      return NextResponse.json({ success: true, ...getImpactAssessment(domain) });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getRecommendations(domain: string, priority: string) {
  const allRecs = [
    {
      id: 'REC-001',
      domain: 'Governance',
      priority: 'critical',
      title: 'Implement Dual Authorization for High-Value Decisions',
      description: 'Analysis shows 23% of high-risk decisions lack secondary approval. Implement mandatory dual authorization for decisions exceeding $50,000.',
      rationale: 'Pattern analysis detected single-point-of-failure in 156 decisions over 90 days',
      expectedImpact: { riskReduction: 35, complianceImprovement: 20, efficiencyChange: -5 },
      implementationEffort: 'medium',
      timeframe: '30 days',
      resources: ['Policy update', 'System configuration', 'Staff training'],
      metrics: ['Dual-auth compliance rate', 'Decision reversal rate', 'Processing time'],
      stakeholders: ['Finance', 'Procurement', 'Senior Management'],
      evidenceBasis: ['Decision pattern analysis', 'Risk incident correlation', 'Industry benchmarks']
    },
    {
      id: 'REC-002',
      domain: 'Financial',
      priority: 'critical',
      title: 'Establish Emergency Reserve Fund',
      description: 'Cash flow analysis indicates vulnerability to disbursement delays. Establish minimum 60-day operating reserve.',
      rationale: 'Early warning system detected 3 near-miss cash crises in past 6 months',
      expectedImpact: { riskReduction: 45, complianceImprovement: 10, efficiencyChange: 0 },
      implementationEffort: 'high',
      timeframe: '90 days',
      resources: ['Board approval', 'Donor negotiation', 'Treasury management'],
      metrics: ['Days of reserve', 'Cash flow stability index', 'Emergency fund utilization'],
      stakeholders: ['Board', 'Finance', 'Donors'],
      evidenceBasis: ['Cash flow modeling', 'Scenario analysis', 'Sector benchmarks']
    },
    {
      id: 'REC-003',
      domain: 'Compliance',
      priority: 'high',
      title: 'Automate Sanctions Screening',
      description: 'Manual screening processes are inconsistent and incomplete. Implement automated real-time sanctions screening for all transactions.',
      rationale: 'Audit found 12% of transactions lacked proper screening documentation',
      expectedImpact: { riskReduction: 60, complianceImprovement: 40, efficiencyChange: 25 },
      implementationEffort: 'medium',
      timeframe: '60 days',
      resources: ['Screening software', 'Integration development', 'Process redesign'],
      metrics: ['Screening coverage', 'False positive rate', 'Processing time'],
      stakeholders: ['Compliance', 'IT', 'Operations'],
      evidenceBasis: ['Compliance audit', 'Transaction analysis', 'Regulatory requirements']
    },
    {
      id: 'REC-004',
      domain: 'Operations',
      priority: 'high',
      title: 'Implement Real-Time Decision Dashboard',
      description: 'Decision-makers lack visibility into pipeline and bottlenecks. Deploy real-time dashboard for decision tracking.',
      rationale: 'Average decision cycle time 40% above benchmark due to visibility gaps',
      expectedImpact: { riskReduction: 15, complianceImprovement: 25, efficiencyChange: 35 },
      implementationEffort: 'medium',
      timeframe: '45 days',
      resources: ['Dashboard development', 'Data integration', 'User training'],
      metrics: ['Decision cycle time', 'Bottleneck identification', 'User adoption'],
      stakeholders: ['All Departments', 'IT', 'Management'],
      evidenceBasis: ['Process analysis', 'User feedback', 'Benchmark comparison']
    },
    {
      id: 'REC-005',
      domain: 'Ethics',
      priority: 'high',
      title: 'Strengthen Whistleblower Protection',
      description: 'Low reporting rates suggest barriers to speaking up. Enhance anonymous reporting and protection mechanisms.',
      rationale: 'Only 23% of staff confident in whistleblower protection based on survey',
      expectedImpact: { riskReduction: 30, complianceImprovement: 20, efficiencyChange: 0 },
      implementationEffort: 'low',
      timeframe: '30 days',
      resources: ['Policy update', 'Hotline setup', 'Communication campaign'],
      metrics: ['Reporting rate', 'Staff confidence score', 'Issue resolution time'],
      stakeholders: ['HR', 'Legal', 'All Staff'],
      evidenceBasis: ['Staff survey', 'Benchmark analysis', 'Incident review']
    },
    {
      id: 'REC-006',
      domain: 'Governance',
      priority: 'medium',
      title: 'Quarterly Governance Review Cycle',
      description: 'Governance frameworks not keeping pace with operational changes. Implement quarterly review and update cycle.',
      rationale: 'Gap analysis shows 34% of policies outdated by more than 18 months',
      expectedImpact: { riskReduction: 20, complianceImprovement: 30, efficiencyChange: 10 },
      implementationEffort: 'low',
      timeframe: '15 days',
      resources: ['Review committee', 'Documentation system', 'Calendar blocking'],
      metrics: ['Policy currency rate', 'Gap closure rate', 'Update cycle time'],
      stakeholders: ['Governance Committee', 'All Departments'],
      evidenceBasis: ['Policy audit', 'Gap analysis', 'Best practices']
    },
    {
      id: 'REC-007',
      domain: 'Financial',
      priority: 'medium',
      title: 'Vendor Concentration Risk Mitigation',
      description: 'Over-reliance on limited vendors creates supply and integrity risks. Implement vendor diversification requirements.',
      rationale: 'Top 3 vendors account for 67% of procurement spend',
      expectedImpact: { riskReduction: 25, complianceImprovement: 15, efficiencyChange: -10 },
      implementationEffort: 'medium',
      timeframe: '90 days',
      resources: ['Procurement policy update', 'Vendor assessment', 'Market analysis'],
      metrics: ['Vendor concentration index', 'Alternative vendor count', 'Pricing competitiveness'],
      stakeholders: ['Procurement', 'Operations', 'Finance'],
      evidenceBasis: ['Spend analysis', 'Risk assessment', 'Market research']
    },
    {
      id: 'REC-008',
      domain: 'Operations',
      priority: 'medium',
      title: 'Cross-Training Program for Critical Roles',
      description: 'Key person dependencies create operational risk. Implement systematic cross-training for all critical positions.',
      rationale: 'Behavior analysis shows 8 single-point-of-failure roles',
      expectedImpact: { riskReduction: 30, complianceImprovement: 10, efficiencyChange: 15 },
      implementationEffort: 'medium',
      timeframe: '120 days',
      resources: ['Training program design', 'Staff time allocation', 'Knowledge documentation'],
      metrics: ['Cross-training coverage', 'Backup capability index', 'Knowledge transfer score'],
      stakeholders: ['HR', 'All Departments', 'Management'],
      evidenceBasis: ['Role analysis', 'Turnover impact assessment', 'Continuity planning']
    }
  ];

  let filtered = allRecs;
  if (domain !== 'all') filtered = filtered.filter(r => r.domain.toLowerCase() === domain.toLowerCase());
  if (priority !== 'all') filtered = filtered.filter(r => r.priority === priority);

  const summary = {
    total: filtered.length,
    byPriority: {
      critical: filtered.filter(r => r.priority === 'critical').length,
      high: filtered.filter(r => r.priority === 'high').length,
      medium: filtered.filter(r => r.priority === 'medium').length
    },
    avgRiskReduction: Math.round(filtered.reduce((sum, r) => sum + r.expectedImpact.riskReduction, 0) / filtered.length),
    avgComplianceImprovement: Math.round(filtered.reduce((sum, r) => sum + r.expectedImpact.complianceImprovement, 0) / filtered.length)
  };

  return { domain, priority, summary, recommendations: filtered, generatedAt: new Date().toISOString() };
}

function getPolicyGaps(domain: string) {
  return {
    domain,
    generatedAt: new Date().toISOString(),
    totalGaps: 18,
    criticalGaps: 4,
    gaps: [
      {
        id: 'GAP-001',
        severity: 'critical',
        domain: 'Compliance',
        title: 'No AI Governance Policy',
        description: 'Organization using AI tools without formal governance framework',
        currentState: 'No policy exists',
        requiredState: 'Comprehensive AI governance policy aligned with emerging regulations',
        risk: 'Regulatory non-compliance, ethical violations, data protection breaches',
        recommendation: 'Develop AI governance framework within 60 days',
        benchmark: '78% of peer organizations have AI policies'
      },
      {
        id: 'GAP-002',
        severity: 'critical',
        domain: 'Financial',
        title: 'Cryptocurrency Transaction Policy Missing',
        description: 'No guidance on accepting or using cryptocurrency donations',
        currentState: 'Ad-hoc handling',
        requiredState: 'Clear policy on crypto acceptance, conversion, and reporting',
        risk: 'AML violations, tax compliance issues, volatility exposure',
        recommendation: 'Either prohibit or establish comprehensive framework',
        benchmark: '45% of organizations have explicit crypto policies'
      },
      {
        id: 'GAP-003',
        severity: 'high',
        domain: 'Ethics',
        title: 'Incomplete Conflict of Interest Coverage',
        description: 'COI policy does not address post-employment restrictions or family relationships',
        currentState: 'Basic COI disclosure only',
        requiredState: 'Comprehensive COI including cooling-off periods and relationship disclosure',
        risk: 'Undisclosed conflicts, integrity breaches, donor concerns',
        recommendation: 'Expand COI policy scope within 30 days',
        benchmark: '92% of peer organizations have comprehensive COI policies'
      },
      {
        id: 'GAP-004',
        severity: 'high',
        domain: 'Operations',
        title: 'Remote Work Governance Undefined',
        description: 'No formal policy for remote work security and productivity',
        currentState: 'Informal arrangements',
        requiredState: 'Formal remote work policy with security requirements',
        risk: 'Data security breaches, productivity issues, liability unclear',
        recommendation: 'Formalize remote work framework within 45 days',
        benchmark: '89% of organizations have formal remote work policies'
      },
      {
        id: 'GAP-005',
        severity: 'medium',
        domain: 'Governance',
        title: 'Succession Planning Gap',
        description: 'No documented succession plan for executive positions',
        currentState: 'Informal understanding only',
        requiredState: 'Documented succession plan for top 10 positions',
        risk: 'Leadership vacuum, operational disruption, stakeholder concern',
        recommendation: 'Develop succession framework within 90 days',
        benchmark: '67% of peer organizations have formal succession plans'
      }
    ],
    gapsByDomain: [
      { domain: 'Governance', count: 4, critical: 1 },
      { domain: 'Financial', count: 3, critical: 1 },
      { domain: 'Compliance', count: 4, critical: 1 },
      { domain: 'Operations', count: 4, critical: 1 },
      { domain: 'Ethics', count: 3, critical: 0 }
    ]
  };
}

function getBenchmarks(domain: string) {
  return {
    domain,
    generatedAt: new Date().toISOString(),
    organizationScore: 72,
    peerAverage: 68,
    topQuartile: 85,
    benchmarks: [
      {
        metric: 'Governance Maturity Index',
        yourScore: 72,
        peerAverage: 68,
        topQuartile: 85,
        trend: 'improving',
        gap: -13,
        priority: 'medium'
      },
      {
        metric: 'Decision Cycle Time (days)',
        yourScore: 2.3,
        peerAverage: 2.8,
        topQuartile: 1.5,
        trend: 'improving',
        gap: 0.8,
        priority: 'medium'
      },
      {
        metric: 'Compliance Score',
        yourScore: 88,
        peerAverage: 82,
        topQuartile: 95,
        trend: 'stable',
        gap: -7,
        priority: 'low'
      },
      {
        metric: 'Risk Incident Rate (per 100 decisions)',
        yourScore: 3.2,
        peerAverage: 4.1,
        topQuartile: 1.8,
        trend: 'worsening',
        gap: 1.4,
        priority: 'high'
      },
      {
        metric: 'Stakeholder Satisfaction',
        yourScore: 76,
        peerAverage: 72,
        topQuartile: 88,
        trend: 'improving',
        gap: -12,
        priority: 'medium'
      },
      {
        metric: 'Training Completion Rate',
        yourScore: 67,
        peerAverage: 71,
        topQuartile: 92,
        trend: 'stable',
        gap: -25,
        priority: 'high'
      },
      {
        metric: 'Policy Currency Rate',
        yourScore: 66,
        peerAverage: 74,
        topQuartile: 95,
        trend: 'worsening',
        gap: -29,
        priority: 'critical'
      }
    ],
    peerComparison: {
      totalPeers: 45,
      yourRank: 12,
      percentile: 73
    }
  };
}

function getImpactAssessment(domain: string) {
  return {
    domain,
    generatedAt: new Date().toISOString(),
    assessments: [
      {
        policy: 'Dual Authorization Implementation',
        scenarios: [
          { scenario: 'Full implementation', riskChange: -35, costChange: 15, timelineImpact: 'minimal' },
          { scenario: 'Partial (>$100K only)', riskChange: -20, costChange: 5, timelineImpact: 'none' },
          { scenario: 'No change', riskChange: 0, costChange: 0, timelineImpact: 'none' }
        ],
        recommendation: 'Full implementation',
        breakEvenPeriod: '4 months'
      },
      {
        policy: 'Automated Sanctions Screening',
        scenarios: [
          { scenario: 'Enterprise solution', riskChange: -60, costChange: 45, timelineImpact: 'moderate' },
          { scenario: 'Basic automation', riskChange: -35, costChange: 15, timelineImpact: 'minimal' },
          { scenario: 'Enhanced manual', riskChange: -15, costChange: 25, timelineImpact: 'significant' }
        ],
        recommendation: 'Enterprise solution',
        breakEvenPeriod: '8 months'
      }
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Policy Recommendations',
    version: '1.6',
    actions: ['recommendations', 'policy-gaps', 'benchmarks', 'impact-assessment'],
    description: 'AI-driven policy recommendations based on analytics'
  });
}