import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, context } = await request.json();

    const result = checkLogistics(action, context);

    return NextResponse.json({
      success: true,
      module: 'logistics',
      action,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function checkLogistics(action: string, context: any): any {
  const { destination = '', items = [], beneficiaries = 0, urgency = 'normal', transportMode = '' } = context || {};

  let approved = true;
  let riskLevel = 'low';
  let warnings: string[] = [];
  let requirements: string[] = [];
  let governanceNode = 'GOV-2';

  // Beneficiary count checks
  if (beneficiaries > 10000) {
    riskLevel = 'high';
    requirements.push('Large-scale distribution plan required');
    requirements.push('Coordination with local authorities');
    requirements.push('Multi-agency logistics review');
  } else if (beneficiaries > 1000) {
    riskLevel = 'medium';
    requirements.push('Distribution plan documentation');
  }

  // Destination checks
  if (destination.toLowerCase().includes('conflict') || destination.toLowerCase().includes('war')) {
    riskLevel = 'critical';
    warnings.push('Conflict zone delivery - enhanced security protocols');
    requirements.push('Security assessment');
    requirements.push('Staff safety plan');
    requirements.push('Alternative route planning');
  }

  // Urgency checks
  if (urgency === 'emergency') {
    governanceNode = 'GOV-2';
    warnings.push('Emergency logistics - expedited approval path');
    requirements.push('Post-delivery documentation within 24 hours');
  }

  // Transport mode checks
  if (transportMode === 'air') {
    requirements.push('Air cargo documentation');
    requirements.push('Customs pre-clearance');
  } else if (transportMode === 'sea') {
    requirements.push('Maritime insurance');
    requirements.push('Port handling arrangements');
  }

  // Item-specific checks
  if (items.some((i: string) => i.toLowerCase().includes('medical'))) {
    requirements.push('Cold chain verification');
    requirements.push('Medical supplies handling protocol');
  }
  if (items.some((i: string) => i.toLowerCase().includes('food'))) {
    requirements.push('Food safety certification');
    requirements.push('Expiry date tracking');
  }

  const boundaries = [
    { id: 'B-1', rule: 'Do No Harm', check: true },
    { id: 'B-2', rule: 'Beneficiary Protection', check: true },
    { id: 'B-8', rule: 'Safe Delivery', check: riskLevel === 'critical' }
  ];

  return {
    approved,
    riskLevel,
    riskScore: riskLevel === 'critical' ? 80 : riskLevel === 'high' ? 60 : riskLevel === 'medium' ? 40 : 20,
    governanceNode,
    warnings,
    requirements,
    boundaries: boundaries.filter(b => b.check),
    recommendations: [
      'Track all shipments end-to-end',
      'Verify beneficiary receipt',
      'Document delivery conditions'
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Logistics Check',
    version: '1.4',
    actions: ['dispatch', 'delivery', 'distribution', 'transfer'],
    contextFields: ['destination', 'items', 'beneficiaries', 'urgency', 'transportMode']
  });
}