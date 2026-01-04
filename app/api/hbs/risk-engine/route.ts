import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, context, realtime = false } = await request.json();

    const analysis = analyzeRisk(action, context, realtime);

    return NextResponse.json({
      success: true,
      ...analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function analyzeRisk(action: string, context: any, realtime: boolean): any {
  const { amount = 0, beneficiaries = 0, urgency = 'normal', location = '', category = '', partners = [], duration = 0 } = context || {};

  // Risk Categories
  const risks: any[] = [];
  let overallScore = 0;
  let criticalAlerts: string[] = [];
  let recommendations: string[] = [];

  // Financial Risk
  const financialRisk = calculateFinancialRisk(amount, duration);
  risks.push(financialRisk);
  overallScore += financialRisk.score * financialRisk.weight;

  // Operational Risk
  const operationalRisk = calculateOperationalRisk(beneficiaries, urgency, location);
  risks.push(operationalRisk);
  overallScore += operationalRisk.score * operationalRisk.weight;

  // Reputational Risk
  const reputationalRisk = calculateReputationalRisk(partners, category);
  risks.push(reputationalRisk);
  overallScore += reputationalRisk.score * reputationalRisk.weight;

  // Compliance Risk
  const complianceRisk = calculateComplianceRisk(amount, category, location);
  risks.push(complianceRisk);
  overallScore += complianceRisk.score * complianceRisk.weight;

  // Ethical Risk
  const ethicalRisk = calculateEthicalRisk(action, context);
  risks.push(ethicalRisk);
  overallScore += ethicalRisk.score * ethicalRisk.weight;

  // Normalize score
  const totalWeight = risks.reduce((sum, r) => sum + r.weight, 0);
  overallScore = Math.round(overallScore / totalWeight);

  // Determine risk level
  let riskLevel = 'low';
  if (overallScore >= 80) riskLevel = 'critical';
  else if (overallScore >= 60) riskLevel = 'high';
  else if (overallScore >= 40) riskLevel = 'medium';

  // Generate alerts
  risks.forEach(r => {
    if (r.score >= 80) criticalAlerts.push(`CRITICAL: ${r.category} - ${r.primaryConcern}`);
    else if (r.score >= 60) criticalAlerts.push(`WARNING: ${r.category} - ${r.primaryConcern}`);
  });

  // Generate recommendations
  recommendations = generateRecommendations(risks, context);

  // Boundary conditions check
  const boundaryConditions = checkBoundaryConditions(risks, context);

  // Trend analysis (for realtime)
  const trend = realtime ? analyzeTrend(overallScore) : null;

  return {
    overallScore,
    riskLevel,
    risks,
    criticalAlerts,
    recommendations,
    boundaryConditions,
    trend,
    governance: {
      approvalRequired: overallScore >= 50,
      approvalLevel: overallScore >= 80 ? 'Board' : overallScore >= 60 ? 'Senior Management' : overallScore >= 40 ? 'Department Head' : 'Standard',
      documentationLevel: overallScore >= 60 ? 'Enhanced' : 'Standard'
    },
    mitigationStrategies: generateMitigationStrategies(risks)
  };
}

function calculateFinancialRisk(amount: number, duration: number): any {
  let score = 0;
  let factors: string[] = [];

  if (amount > 1000000) { score += 40; factors.push('Very high value transaction'); }
  else if (amount > 500000) { score += 30; factors.push('High value transaction'); }
  else if (amount > 100000) { score += 20; factors.push('Significant value'); }
  else if (amount > 50000) { score += 10; factors.push('Moderate value'); }

  if (duration > 36) { score += 15; factors.push('Long-term commitment'); }
  else if (duration > 12) { score += 10; factors.push('Medium-term commitment'); }

  return {
    category: 'Financial',
    score: Math.min(100, score),
    weight: 0.25,
    factors,
    primaryConcern: factors[0] || 'Standard financial parameters',
    color: score >= 60 ? 'red' : score >= 40 ? 'orange' : 'green'
  };
}

function calculateOperationalRisk(beneficiaries: number, urgency: string, location: string): any {
  let score = 0;
  let factors: string[] = [];

  if (beneficiaries > 50000) { score += 35; factors.push('Very large scale operation'); }
  else if (beneficiaries > 10000) { score += 25; factors.push('Large scale operation'); }
  else if (beneficiaries > 1000) { score += 15; factors.push('Medium scale operation'); }

  if (urgency === 'emergency') { score += 30; factors.push('Emergency timeline'); }
  else if (urgency === 'urgent') { score += 20; factors.push('Urgent timeline'); }

  const highRiskLocations = ['conflict', 'war', 'disaster', 'crisis'];
  if (highRiskLocations.some(l => location.toLowerCase().includes(l))) {
    score += 25;
    factors.push('High-risk location');
  }

  return {
    category: 'Operational',
    score: Math.min(100, score),
    weight: 0.25,
    factors,
    primaryConcern: factors[0] || 'Standard operational parameters',
    color: score >= 60 ? 'red' : score >= 40 ? 'orange' : 'green'
  };
}

function calculateReputationalRisk(partners: string[], category: string): any {
  let score = 0;
  let factors: string[] = [];

  if (partners.length === 0) { score += 20; factors.push('No partner verification'); }
  if (partners.length > 5) { score += 15; factors.push('Complex partner network'); }

  const sensitiveCategories = ['political', 'religious', 'military'];
  if (sensitiveCategories.some(c => category.toLowerCase().includes(c))) {
    score += 35;
    factors.push('Sensitive category');
  }

  return {
    category: 'Reputational',
    score: Math.min(100, score),
    weight: 0.15,
    factors,
    primaryConcern: factors[0] || 'Standard reputational parameters',
    color: score >= 60 ? 'red' : score >= 40 ? 'orange' : 'green'
  };
}

function calculateComplianceRisk(amount: number, category: string, location: string): any {
  let score = 0;
  let factors: string[] = [];

  if (amount > 100000) { score += 20; factors.push('Enhanced due diligence required'); }

  const sanctionRiskLocations = ['syria', 'iran', 'north korea', 'russia', 'belarus'];
  if (sanctionRiskLocations.some(l => location.toLowerCase().includes(l))) {
    score += 50;
    factors.push('Sanctions risk location');
  }

  const regulatedCategories = ['financial', 'medical', 'technology'];
  if (regulatedCategories.some(c => category.toLowerCase().includes(c))) {
    score += 15;
    factors.push('Regulated category');
  }

  return {
    category: 'Compliance',
    score: Math.min(100, score),
    weight: 0.20,
    factors,
    primaryConcern: factors[0] || 'Standard compliance parameters',
    color: score >= 60 ? 'red' : score >= 40 ? 'orange' : 'green'
  };
}

function calculateEthicalRisk(action: string, context: any): any {
  let score = 0;
  let factors: string[] = [];

  const { vulnerableGroups = false, communityConsent = true, environmentalImpact = 'low' } = context;

  if (vulnerableGroups) { score += 25; factors.push('Vulnerable populations involved'); }
  if (!communityConsent) { score += 40; factors.push('Community consent not obtained'); }
  if (environmentalImpact === 'high') { score += 20; factors.push('High environmental impact'); }
  else if (environmentalImpact === 'medium') { score += 10; factors.push('Moderate environmental impact'); }

  return {
    category: 'Ethical',
    score: Math.min(100, score),
    weight: 0.15,
    factors,
    primaryConcern: factors[0] || 'Standard ethical parameters',
    color: score >= 60 ? 'red' : score >= 40 ? 'orange' : 'green'
  };
}

function checkBoundaryConditions(risks: any[], context: any): any[] {
  const boundaries = [];

  const avgScore = risks.reduce((sum, r) => sum + r.score, 0) / risks.length;

  if (avgScore >= 70) {
    boundaries.push({ id: 'B-1', rule: 'Do No Harm', status: 'AT_RISK', action: 'Enhanced monitoring required' });
  }
  if (risks.find(r => r.category === 'Financial')?.score >= 60) {
    boundaries.push({ id: 'B-4', rule: 'Financial Transparency', status: 'ACTIVE', action: 'Full documentation required' });
  }
  if (risks.find(r => r.category === 'Compliance')?.score >= 50) {
    boundaries.push({ id: 'B-9', rule: 'Anti-Money Laundering', status: 'ACTIVE', action: 'Enhanced due diligence' });
    boundaries.push({ id: 'B-10', rule: 'Sanctions Compliance', status: 'ACTIVE', action: 'Sanctions screening required' });
  }
  if (risks.find(r => r.category === 'Ethical')?.score >= 40) {
    boundaries.push({ id: 'B-2', rule: 'Beneficiary Protection', status: 'MONITOR', action: 'Impact assessment needed' });
  }

  return boundaries;
}

function generateRecommendations(risks: any[], context: any): string[] {
  const recs: string[] = [];

  risks.forEach(r => {
    if (r.score >= 60) {
      if (r.category === 'Financial') recs.push('Implement enhanced financial controls and oversight');
      if (r.category === 'Operational') recs.push('Develop detailed operational risk mitigation plan');
      if (r.category === 'Reputational') recs.push('Conduct stakeholder mapping and communication strategy');
      if (r.category === 'Compliance') recs.push('Engage compliance team for review before proceeding');
      if (r.category === 'Ethical') recs.push('Conduct ethical impact assessment with community input');
    }
  });

  if (recs.length === 0) recs.push('Proceed with standard protocols and monitoring');

  return recs;
}

function generateMitigationStrategies(risks: any[]): any[] {
  return risks.filter(r => r.score >= 40).map(r => ({
    category: r.category,
    strategy: getMitigationStrategy(r.category),
    priority: r.score >= 70 ? 'Immediate' : r.score >= 50 ? 'High' : 'Medium',
    owner: getOwner(r.category)
  }));
}

function getMitigationStrategy(category: string): string {
  const strategies: Record<string, string> = {
    'Financial': 'Implement phased funding release with milestone verification',
    'Operational': 'Establish contingency plans and backup resources',
    'Reputational': 'Develop proactive stakeholder engagement plan',
    'Compliance': 'Complete all regulatory checks before proceeding',
    'Ethical': 'Conduct participatory impact assessment'
  };
  return strategies[category] || 'Standard risk management protocols';
}

function getOwner(category: string): string {
  const owners: Record<string, string> = {
    'Financial': 'Finance Director',
    'Operational': 'Operations Manager',
    'Reputational': 'Communications Lead',
    'Compliance': 'Compliance Officer',
    'Ethical': 'Program Director'
  };
  return owners[category] || 'Project Manager';
}

function analyzeTrend(currentScore: number): any {
  // Simulated trend data
  const historical = [
    currentScore - 15 + Math.random() * 10,
    currentScore - 10 + Math.random() * 10,
    currentScore - 5 + Math.random() * 10,
    currentScore
  ];

  const trend = historical[3] > historical[0] ? 'increasing' : historical[3] < historical[0] ? 'decreasing' : 'stable';

  return {
    direction: trend,
    historical,
    prediction: currentScore + (trend === 'increasing' ? 5 : trend === 'decreasing' ? -5 : 0),
    confidence: 0.75
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Ethical Risk Engine',
    version: '1.5',
    capabilities: ['Real-time risk analysis', 'Multi-factor assessment', 'Boundary condition monitoring', 'Trend analysis'],
    riskCategories: ['Financial', 'Operational', 'Reputational', 'Compliance', 'Ethical']
  });
}