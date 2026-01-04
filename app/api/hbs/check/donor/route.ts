import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, context } = await request.json();

    const result = checkDonor(action, context);

    return NextResponse.json({
      success: true,
      module: 'donor',
      action,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function checkDonor(action: string, context: any): any {
  const { amount = 0, donor = '', purpose = '', restrictions = [], reportingFrequency = 'quarterly' } = context || {};

  let approved = true;
  let riskLevel = 'low';
  let warnings: string[] = [];
  let requirements: string[] = [];
  let governanceNode = 'GOV-4';

  // Amount thresholds
  if (amount > 1000000) {
    riskLevel = 'high';
    requirements.push('Board notification required');
    requirements.push('Dedicated fund management');
    requirements.push('Enhanced reporting framework');
  } else if (amount > 100000) {
    riskLevel = 'medium';
    requirements.push('Senior management approval');
    requirements.push('Fund tracking setup');
  }

  // Donor due diligence
  if (!donor) {
    warnings.push('Donor information incomplete');
    requirements.push('Complete donor verification');
  } else {
    requirements.push('Donor due diligence check');
    requirements.push('Sanctions screening');
  }

  // Purpose checks
  if (!purpose) {
    warnings.push('Donation purpose not specified');
  }

  // Restriction checks
  if (restrictions && restrictions.length > 0) {
    warnings.push(`Restricted funding: ${restrictions.length} conditions apply`);
    requirements.push('Restriction compliance monitoring');
    requirements.push('Separate fund accounting');
  }

  // Reporting requirements
  if (reportingFrequency === 'monthly') {
    requirements.push('Monthly financial reports');
    requirements.push('Monthly narrative updates');
  } else if (reportingFrequency === 'quarterly') {
    requirements.push('Quarterly progress reports');
  }

  // Compliance checks
  const boundaries = [
    { id: 'B-4', rule: 'Financial Transparency', check: true },
    { id: 'B-6', rule: 'Donor Compliance', check: true },
    { id: 'B-9', rule: 'Anti-Money Laundering', check: amount > 50000 },
    { id: 'B-10', rule: 'Sanctions Compliance', check: true }
  ];

  return {
    approved,
    riskLevel,
    riskScore: riskLevel === 'high' ? 70 : riskLevel === 'medium' ? 50 : 30,
    governanceNode,
    warnings,
    requirements,
    boundaries: boundaries.filter(b => b.check),
    recommendations: [
      'Acknowledge donation within 48 hours',
      'Set up fund tracking immediately',
      'Schedule reporting milestones',
      'Document donor communication'
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Donor Check',
    version: '1.4',
    actions: ['accept', 'allocate', 'report', 'return'],
    contextFields: ['amount', 'donor', 'purpose', 'restrictions', 'reportingFrequency']
  });
}