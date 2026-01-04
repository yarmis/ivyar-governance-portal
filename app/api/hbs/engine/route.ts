import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'evaluate':
        return NextResponse.json({ success: true, ...evaluateDecision(body) });
      case 'approve':
        return NextResponse.json({ success: true, ...processApproval(body) });
      case 'reject':
        return NextResponse.json({ success: true, ...processRejection(body) });
      case 'escalate':
        return NextResponse.json({ success: true, ...escalateDecision(body) });
      case 'audit':
        return NextResponse.json({ success: true, ...getAuditTrail(body) });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function evaluateDecision(body: any): any {
  const { module, operation, data, user } = body;
  const timestamp = new Date().toISOString();
  const decisionId = `DEC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  // Run all checks
  const ethicsCheck = runEthicsCheck(module, operation, data);
  const boundaryCheck = runBoundaryCheck(module, operation, data);
  const riskAssessment = runRiskAssessment(module, operation, data);
  const policyCheck = runPolicyCheck(module, operation, data);
  const complianceCheck = runComplianceCheck(module, operation, data);

  // Calculate overall score
  const scores = [ethicsCheck.score, boundaryCheck.score, riskAssessment.score, policyCheck.score, complianceCheck.score];
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Determine decision
  const allPassed = ethicsCheck.passed && boundaryCheck.passed && policyCheck.passed && complianceCheck.passed;
  const hasCriticalRisk = riskAssessment.level === 'critical';
  const hasHighRisk = riskAssessment.level === 'high';

  let decision: 'auto-approve' | 'manual-review' | 'escalate' | 'auto-reject';
  let requiredApprover: string | null = null;

  if (!allPassed || hasCriticalRisk) {
    decision = hasCriticalRisk ? 'auto-reject' : 'escalate';
    requiredApprover = hasCriticalRisk ? null : 'Board';
  } else if (hasHighRisk) {
    decision = 'manual-review';
    requiredApprover = 'Senior Management';
  } else if (riskAssessment.level === 'medium') {
    decision = 'manual-review';
    requiredApprover = 'Department Head';
  } else {
    decision = 'auto-approve';
  }

  return {
    decisionId,
    timestamp,
    module,
    operation,
    user,
    evaluation: {
      overallScore,
      decision,
      requiredApprover,
      checks: {
        ethics: ethicsCheck,
        boundaries: boundaryCheck,
        risk: riskAssessment,
        policy: policyCheck,
        compliance: complianceCheck
      }
    },
    conditions: generateConditions(ethicsCheck, boundaryCheck, riskAssessment),
    requirements: generateRequirements(decision, riskAssessment.level),
    auditEntry: {
      id: decisionId,
      timestamp,
      module,
      operation,
      user,
      decision,
      overallScore
    }
  };
}

function runEthicsCheck(module: string, operation: string, data: any): any {
  const checks = [
    { name: 'Human Dignity', passed: true, score: 95 },
    { name: 'Do No Harm', passed: !data.conflictZone || data.safetyPlan, score: data.conflictZone && !data.safetyPlan ? 40 : 90 },
    { name: 'Beneficiary Protection', passed: data.beneficiaryConsent !== false, score: data.beneficiaryConsent === false ? 30 : 92 },
    { name: 'Transparency', passed: data.documented !== false, score: data.documented === false ? 50 : 88 },
    { name: 'Accountability', passed: true, score: 90 }
  ];

  const avgScore = Math.round(checks.reduce((sum, c) => sum + c.score, 0) / checks.length);
  const allPassed = checks.every(c => c.passed);

  return {
    passed: allPassed && avgScore >= 70,
    score: avgScore,
    checks,
    violations: checks.filter(c => !c.passed).map(c => c.name),
    recommendations: checks.filter(c => c.score < 80).map(c => `Strengthen ${c.name} measures`)
  };
}

function runBoundaryCheck(module: string, operation: string, data: any): any {
  const boundaries = [
    { id: 'B-1', rule: 'No funding to sanctioned entities', triggered: data.sanctionRisk === true, severity: 'critical' },
    { id: 'B-2', rule: 'Conflict of interest disclosure', triggered: data.conflictOfInterest && !data.coiDisclosed, severity: 'high' },
    { id: 'B-3', rule: 'Dual authorization for >$100K', triggered: (data.amount > 100000) && !data.dualAuth, severity: 'high' },
    { id: 'B-4', rule: 'Beneficiary verification', triggered: data.beneficiaries > 1000 && !data.verified, severity: 'medium' },
    { id: 'B-5', rule: 'Environmental safeguards', triggered: data.environmentalImpact === 'high' && !data.eiaCompleted, severity: 'medium' },
    { id: 'B-6', rule: 'Community consent', triggered: data.communityImpact && !data.communityConsent, severity: 'high' },
    { id: 'B-7', rule: 'Financial transparency', triggered: data.amount > 50000 && !data.budgetApproved, severity: 'medium' },
    { id: 'B-8', rule: 'Partner due diligence', triggered: data.newPartner && !data.dueDiligence, severity: 'high' },
    { id: 'B-9', rule: 'Data protection', triggered: data.personalData && !data.dataProtection, severity: 'medium' },
    { id: 'B-10', rule: 'Anti-fraud controls', triggered: data.amount > 25000 && !data.fraudChecks, severity: 'medium' }
  ];

  const triggered = boundaries.filter(b => b.triggered);
  const criticalViolations = triggered.filter(b => b.severity === 'critical');
  const highViolations = triggered.filter(b => b.severity === 'high');

  const score = 100 - (criticalViolations.length * 40) - (highViolations.length * 20) - ((triggered.length - criticalViolations.length - highViolations.length) * 10);

  return {
    passed: criticalViolations.length === 0 && highViolations.length === 0,
    score: Math.max(0, score),
    totalBoundaries: boundaries.length,
    triggered: triggered.map(b => ({ id: b.id, rule: b.rule, severity: b.severity })),
    criticalViolations: criticalViolations.length,
    highViolations: highViolations.length,
    recommendations: triggered.map(b => `Address ${b.id}: ${b.rule}`)
  };
}

function runRiskAssessment(module: string, operation: string, data: any): any {
  let score = 20; // Base risk

  // Amount-based risk
  if (data.amount > 1000000) score += 35;
  else if (data.amount > 500000) score += 25;
  else if (data.amount > 100000) score += 15;
  else if (data.amount > 50000) score += 10;

  // Operational risk
  if (data.urgency === 'emergency') score += 20;
  else if (data.urgency === 'urgent') score += 10;

  if (data.conflictZone) score += 25;
  if (data.newPartner) score += 15;
  if (data.beneficiaries > 10000) score += 15;
  else if (data.beneficiaries > 1000) score += 10;

  // Compliance risk
  if (data.sanctionRisk) score += 40;
  if (data.regulatoryChange) score += 10;

  score = Math.min(100, score);

  let level: 'low' | 'medium' | 'high' | 'critical';
  if (score >= 80) level = 'critical';
  else if (score >= 60) level = 'high';
  else if (score >= 40) level = 'medium';
  else level = 'low';

  return {
    score,
    level,
    factors: [
      { factor: 'Financial', value: data.amount || 0, contribution: Math.min(35, (data.amount || 0) / 30000) },
      { factor: 'Operational', value: data.urgency || 'normal', contribution: data.urgency === 'emergency' ? 20 : data.urgency === 'urgent' ? 10 : 0 },
      { factor: 'Geographic', value: data.conflictZone ? 'Conflict Zone' : 'Standard', contribution: data.conflictZone ? 25 : 0 },
      { factor: 'Compliance', value: data.sanctionRisk ? 'Elevated' : 'Normal', contribution: data.sanctionRisk ? 40 : 0 }
    ],
    mitigations: generateMitigations(level, data)
  };
}

function runPolicyCheck(module: string, operation: string, data: any): any {
  const policies = [
    { id: 'POL-001', name: 'Procurement Policy', applicable: module === 'procurement', compliant: data.competitiveBid !== false || (data.amount || 0) < 10000 },
    { id: 'POL-002', name: 'Financial Controls', applicable: true, compliant: data.budgetApproved !== false },
    { id: 'POL-003', name: 'HR Policy', applicable: module === 'hr', compliant: data.hrApproval !== false },
    { id: 'POL-004', name: 'Partner Policy', applicable: data.newPartner === true, compliant: data.dueDiligence === true },
    { id: 'POL-005', name: 'Emergency Protocol', applicable: data.urgency === 'emergency', compliant: data.emergencyJustification === true },
    { id: 'POL-006', name: 'Data Policy', applicable: data.personalData === true, compliant: data.dataProtection === true },
    { id: 'POL-007', name: 'Travel Policy', applicable: module === 'travel', compliant: data.travelApproved !== false },
    { id: 'POL-008', name: 'Grant Policy', applicable: module === 'donor', compliant: data.grantAgreement !== false }
  ];

  const applicable = policies.filter(p => p.applicable);
  const compliant = applicable.filter(p => p.compliant);
  const nonCompliant = applicable.filter(p => !p.compliant);

  const score = applicable.length > 0 ? Math.round((compliant.length / applicable.length) * 100) : 100;

  return {
    passed: nonCompliant.length === 0,
    score,
    applicable: applicable.length,
    compliant: compliant.length,
    nonCompliant: nonCompliant.map(p => ({ id: p.id, name: p.name })),
    recommendations: nonCompliant.map(p => `Ensure compliance with ${p.name}`)
  };
}

function runComplianceCheck(module: string, operation: string, data: any): any {
  const requirements = [
    { name: 'AML Screening', required: (data.amount || 0) > 10000, completed: data.amlScreening === true },
    { name: 'Sanctions Check', required: true, completed: data.sanctionRisk !== true || data.sanctionsCleared === true },
    { name: 'Tax Compliance', required: (data.amount || 0) > 50000, completed: data.taxCompliant !== false },
    { name: 'Regulatory Filing', required: data.regulatoryRequired === true, completed: data.regulatoryFiled === true },
    { name: 'Audit Trail', required: true, completed: data.documented !== false },
    { name: 'Authorization Chain', required: (data.amount || 0) > 25000, completed: data.authorized !== false }
  ];

  const required = requirements.filter(r => r.required);
  const completed = required.filter(r => r.completed);
  const pending = required.filter(r => !r.completed);

  const score = required.length > 0 ? Math.round((completed.length / required.length) * 100) : 100;

  return {
    passed: pending.length === 0,
    score,
    required: required.length,
    completed: completed.length,
    pending: pending.map(r => r.name),
    recommendations: pending.map(r => `Complete ${r.name} before proceeding`)
  };
}

function generateConditions(ethics: any, boundaries: any, risk: any): string[] {
  const conditions: string[] = [];

  if (ethics.score < 90) conditions.push('Ethics review required before final approval');
  if (boundaries.triggered.length > 0) conditions.push('Address all boundary conditions');
  if (risk.level === 'high') conditions.push('Senior management sign-off required');
  if (risk.level === 'critical') conditions.push('Board approval and risk mitigation plan required');

  return conditions;
}

function generateRequirements(decision: string, riskLevel: string): any {
  const base = {
    documentation: ['Decision rationale', 'Supporting documents'],
    approvals: [] as string[],
    timeline: '5 business days',
    followUp: ['Post-implementation review']
  };

  if (decision === 'manual-review' || decision === 'escalate') {
    base.approvals.push('Line manager approval');
    if (riskLevel === 'high' || riskLevel === 'critical') {
      base.approvals.push('Senior management approval');
      base.documentation.push('Risk mitigation plan');
    }
    if (riskLevel === 'critical') {
      base.approvals.push('Board notification');
      base.timeline = '2 business days';
    }
  }

  return base;
}

function generateMitigations(level: string, data: any): string[] {
  const mitigations: string[] = [];

  if (level === 'critical' || level === 'high') {
    mitigations.push('Implement enhanced monitoring');
    mitigations.push('Establish contingency fund');
    mitigations.push('Create incident response plan');
  }
  if (data.conflictZone) mitigations.push('Deploy security protocols');
  if (data.newPartner) mitigations.push('Conduct comprehensive due diligence');
  if ((data.amount || 0) > 100000) mitigations.push('Implement phased disbursement');

  return mitigations;
}

function processApproval(body: any): any {
  const { decisionId, approver, conditions, notes } = body;
  return {
    decisionId,
    status: 'approved',
    approver,
    approvedAt: new Date().toISOString(),
    conditions,
    notes,
    nextSteps: ['Proceed with implementation', 'Document approval in system', 'Notify stakeholders']
  };
}

function processRejection(body: any): any {
  const { decisionId, rejector, reason, appealProcess } = body;
  return {
    decisionId,
    status: 'rejected',
    rejector,
    rejectedAt: new Date().toISOString(),
    reason,
    appealProcess: appealProcess || 'Submit appeal to Governance Committee within 5 business days',
    recommendations: ['Review rejection reasons', 'Address identified issues', 'Resubmit with modifications']
  };
}

function escalateDecision(body: any): any {
  const { decisionId, escalatedBy, escalateTo, reason, urgency } = body;
  return {
    decisionId,
    status: 'escalated',
    escalatedBy,
    escalateTo,
    escalatedAt: new Date().toISOString(),
    reason,
    urgency,
    expectedResponse: urgency === 'critical' ? '24 hours' : '3 business days',
    escalationChain: ['Department Head', 'Senior Management', 'Executive Committee', 'Board']
  };
}

function getAuditTrail(body: any): any {
  const { decisionId, module, dateRange } = body;
  
  // Simulated audit trail
  return {
    query: { decisionId, module, dateRange },
    totalRecords: 156,
    entries: [
      { id: 'AUD-001', timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'evaluate', user: 'user_pm_001', module: 'procurement', decision: 'manual-review', score: 72 },
      { id: 'AUD-002', timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'approve', user: 'user_mgr_012', module: 'procurement', decision: 'approved', score: 85 },
      { id: 'AUD-003', timestamp: new Date(Date.now() - 259200000).toISOString(), action: 'evaluate', user: 'user_fin_003', module: 'finance', decision: 'auto-approve', score: 92 },
      { id: 'AUD-004', timestamp: new Date(Date.now() - 345600000).toISOString(), action: 'escalate', user: 'user_pm_007', module: 'logistics', decision: 'escalated', score: 45 },
      { id: 'AUD-005', timestamp: new Date(Date.now() - 432000000).toISOString(), action: 'reject', user: 'user_exec_001', module: 'donor', decision: 'rejected', score: 38 }
    ],
    summary: {
      evaluated: 89,
      approved: 67,
      rejected: 8,
      escalated: 14,
      avgScore: 74
    }
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Governance Engine',
    version: '2.0',
    actions: ['evaluate', 'approve', 'reject', 'escalate', 'audit'],
    description: 'Central governance brain for IVYAR platform',
    capabilities: [
      'Automatic ethics checks',
      'Boundary condition monitoring',
      'Real-time risk assessment',
      'Policy compliance verification',
      'Audit trail management'
    ]
  });
}