import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, context } = await request.json();

    const result = checkProcurement(action, context);

    return NextResponse.json({
      success: true,
      module: 'procurement',
      action,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function checkProcurement(action: string, context: any): any {
  const { amount = 0, vendor = '', urgency = 'normal', category = '' } = context || {};

  let approved = true;
  let riskLevel = 'low';
  let warnings: string[] = [];
  let requirements: string[] = [];
  let governanceNode = 'GOV-3';

  // Amount thresholds
  if (amount > 100000) {
    riskLevel = 'critical';
    requirements.push('Board approval required for amounts over $100,000');
    requirements.push('Full due diligence report');
    requirements.push('Competitive bidding documentation');
  } else if (amount > 50000) {
    riskLevel = 'high';
    requirements.push('Senior management approval required');
    requirements.push('Three-quote comparison');
  } else if (amount > 10000) {
    riskLevel = 'medium';
    requirements.push('Department head approval');
  }

  // Vendor checks
  if (!vendor) {
    warnings.push('Vendor information missing');
  }

  // Urgency checks
  if (urgency === 'emergency') {
    warnings.push('Emergency procurement - expedited review required');
    requirements.push('Post-hoc documentation within 48 hours');
  }

  // Category-specific rules
  if (category === 'technology') {
    requirements.push('IT security review');
    requirements.push('Data protection assessment');
  } else if (category === 'construction') {
    requirements.push('Safety compliance certificate');
    requirements.push('Environmental impact assessment');
  } else if (category === 'medical') {
    requirements.push('Quality certification verification');
    requirements.push('Cold chain requirements check');
  }

  // Boundary checks
  const boundaries = [
    { id: 'B-3', rule: 'Conflict of Interest', check: true },
    { id: 'B-5', rule: 'Competitive Bidding', check: amount > 10000 },
    { id: 'B-7', rule: 'Vendor Due Diligence', check: amount > 25000 }
  ];

  return {
    approved,
    riskLevel,
    riskScore: riskLevel === 'critical' ? 85 : riskLevel === 'high' ? 65 : riskLevel === 'medium' ? 45 : 25,
    governanceNode,
    warnings,
    requirements,
    boundaries: boundaries.filter(b => b.check),
    recommendations: [
      'Document all procurement decisions',
      'Maintain audit trail',
      'Verify vendor credentials'
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Procurement Check',
    version: '1.4',
    actions: ['purchase', 'contract', 'tender', 'renewal'],
    contextFields: ['amount', 'vendor', 'urgency', 'category']
  });
}