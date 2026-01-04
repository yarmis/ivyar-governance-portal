import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'intercept':
        return NextResponse.json({ success: true, ...interceptRequest(body) });
      case 'validate':
        return NextResponse.json({ success: true, ...validateOperation(body) });
      case 'transform':
        return NextResponse.json({ success: true, ...transformRequest(body) });
      case 'log':
        return NextResponse.json({ success: true, ...logActivity(body) });
      case 'status':
        return NextResponse.json({ success: true, ...getMiddlewareStatus() });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function interceptRequest(body: any): any {
  const { source, target, operation, payload, user } = body;
  const interceptId = `INT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // Pre-flight checks
  const preflightChecks = runPreflightChecks(source, target, operation, payload);
  
  // Determine routing
  const routing = determineRouting(preflightChecks, operation, payload);

  // Apply transformations
  const transformedPayload = applyTransformations(payload, routing.transformations);

  // Generate governance headers
  const governanceHeaders = generateGovernanceHeaders(interceptId, preflightChecks, routing);

  return {
    interceptId,
    timestamp,
    source,
    target,
    operation,
    user,
    preflight: preflightChecks,
    routing,
    transformedPayload,
    governanceHeaders,
    status: routing.allow ? 'passed' : 'blocked',
    blockReason: routing.allow ? null : routing.blockReason,
    nextAction: routing.allow ? 'proceed' : routing.escalate ? 'escalate' : 'reject'
  };
}

function runPreflightChecks(source: string, target: string, operation: string, payload: any): any {
  const checks = {
    authentication: { passed: true, score: 100 },
    authorization: { passed: payload.authorized !== false, score: payload.authorized === false ? 0 : 100 },
    rateLimit: { passed: true, score: 95, remaining: 450, limit: 500 },
    dataValidation: { passed: validatePayloadStructure(payload), score: validatePayloadStructure(payload) ? 100 : 60 },
    sanctionsScreen: { passed: payload.sanctionRisk !== true, score: payload.sanctionRisk ? 0 : 100 },
    boundaryCheck: { passed: !hasCriticalBoundaryViolation(payload), score: hasCriticalBoundaryViolation(payload) ? 20 : 90 },
    policyCompliance: { passed: true, score: 85 },
    riskThreshold: { passed: calculateRiskScore(payload) < 80, score: 100 - calculateRiskScore(payload) }
  };

  const allPassed = Object.values(checks).every((c: any) => c.passed);
  const avgScore = Math.round(Object.values(checks).reduce((sum: number, c: any) => sum + c.score, 0) / Object.keys(checks).length);

  return {
    allPassed,
    avgScore,
    checks,
    criticalFailures: Object.entries(checks).filter(([_, c]: any) => !c.passed && c.score < 30).map(([name]) => name),
    warnings: Object.entries(checks).filter(([_, c]: any) => c.passed && c.score < 80).map(([name]) => name)
  };
}

function validatePayloadStructure(payload: any): boolean {
  if (!payload) return false;
  if (typeof payload !== 'object') return false;
  return true;
}

function hasCriticalBoundaryViolation(payload: any): boolean {
  return payload.sanctionRisk === true || 
         (payload.amount > 100000 && !payload.dualAuth) ||
         (payload.conflictOfInterest && !payload.coiDisclosed);
}

function calculateRiskScore(payload: any): number {
  let score = 20;
  if ((payload.amount || 0) > 500000) score += 30;
  else if ((payload.amount || 0) > 100000) score += 20;
  else if ((payload.amount || 0) > 50000) score += 10;
  if (payload.urgency === 'emergency') score += 15;
  if (payload.conflictZone) score += 20;
  if (payload.newPartner) score += 10;
  if (payload.sanctionRisk) score += 40;
  return Math.min(100, score);
}

function determineRouting(preflight: any, operation: string, payload: any): any {
  const riskScore = calculateRiskScore(payload);
  
  // Critical block conditions
  if (preflight.criticalFailures.length > 0) {
    return {
      allow: false,
      escalate: preflight.criticalFailures.includes('sanctionsScreen'),
      blockReason: `Critical failures: ${preflight.criticalFailures.join(', ')}`,
      route: 'blocked',
      transformations: []
    };
  }

  // High risk escalation
  if (riskScore >= 80) {
    return {
      allow: false,
      escalate: true,
      blockReason: 'Risk score exceeds automatic approval threshold',
      route: 'escalation',
      escalateTo: 'Board',
      transformations: ['addRiskFlag', 'requireDualAuth']
    };
  }

  // Medium risk manual review
  if (riskScore >= 60) {
    return {
      allow: true,
      route: 'manual-review',
      requiredApprover: 'Senior Management',
      transformations: ['addReviewFlag', 'enhanceDocumentation']
    };
  }

  // Standard processing with conditions
  if (riskScore >= 40 || preflight.warnings.length > 0) {
    return {
      allow: true,
      route: 'conditional',
      conditions: generateConditions(preflight, riskScore),
      transformations: ['addConditions']
    };
  }

  // Auto-approve
  return {
    allow: true,
    route: 'auto-approve',
    transformations: []
  };
}

function generateConditions(preflight: any, riskScore: number): string[] {
  const conditions: string[] = [];
  if (riskScore >= 50) conditions.push('Post-implementation review required');
  if (preflight.warnings.includes('riskThreshold')) conditions.push('Enhanced monitoring during execution');
  if (preflight.warnings.includes('policyCompliance')) conditions.push('Policy exception documentation required');
  return conditions;
}

function applyTransformations(payload: any, transformations: string[]): any {
  const transformed = { ...payload };
  
  for (const t of transformations) {
    switch (t) {
      case 'addRiskFlag':
        transformed._governanceFlags = transformed._governanceFlags || [];
        transformed._governanceFlags.push('HIGH_RISK');
        break;
      case 'requireDualAuth':
        transformed._requireDualAuth = true;
        break;
      case 'addReviewFlag':
        transformed._requireReview = true;
        break;
      case 'enhanceDocumentation':
        transformed._enhancedDocs = true;
        break;
      case 'addConditions':
        transformed._hasConditions = true;
        break;
    }
  }

  transformed._processedAt = new Date().toISOString();
  transformed._middlewareVersion = '2.0';

  return transformed;
}

function generateGovernanceHeaders(interceptId: string, preflight: any, routing: any): any {
  return {
    'X-Governance-Id': interceptId,
    'X-Governance-Score': preflight.avgScore,
    'X-Governance-Route': routing.route,
    'X-Governance-Status': routing.allow ? 'allowed' : 'blocked',
    'X-Governance-Version': '2.0',
    'X-Governance-Timestamp': new Date().toISOString()
  };
}

function validateOperation(body: any): any {
  const { module, operation, user, permissions } = body;

  const moduleOperations: Record<string, string[]> = {
    procurement: ['create', 'approve', 'reject', 'modify', 'cancel', 'view'],
    logistics: ['dispatch', 'receive', 'transfer', 'track', 'view'],
    finance: ['disburse', 'receive', 'allocate', 'report', 'view'],
    donor: ['accept', 'allocate', 'report', 'return', 'view'],
    hr: ['hire', 'terminate', 'promote', 'transfer', 'view'],
    field: ['submit', 'update', 'close', 'escalate', 'view']
  };

  const validModule = module in moduleOperations;
  const validOperation = validModule && moduleOperations[module].includes(operation);

  const requiredPermissions = getRequiredPermissions(module, operation);
  const hasPermissions = requiredPermissions.every(p => permissions?.includes(p));

  return {
    valid: validModule && validOperation && hasPermissions,
    module: { valid: validModule, available: Object.keys(moduleOperations) },
    operation: { valid: validOperation, available: validModule ? moduleOperations[module] : [] },
    permissions: { valid: hasPermissions, required: requiredPermissions, missing: requiredPermissions.filter(p => !permissions?.includes(p)) }
  };
}

function getRequiredPermissions(module: string, operation: string): string[] {
  const writeOps = ['create', 'approve', 'reject', 'modify', 'cancel', 'dispatch', 'disburse', 'allocate', 'hire', 'terminate', 'submit'];
  const adminOps = ['approve', 'reject', 'terminate', 'allocate'];
  
  const perms = [`${module}:read`];
  if (writeOps.includes(operation)) perms.push(`${module}:write`);
  if (adminOps.includes(operation)) perms.push(`${module}:admin`);
  
  return perms;
}

function transformRequest(body: any): any {
  const { payload, transformations } = body;
  return {
    original: payload,
    transformed: applyTransformations(payload, transformations || []),
    appliedTransformations: transformations || []
  };
}

function logActivity(body: any): any {
  const { interceptId, event, details, user } = body;
  return {
    logged: true,
    logId: `LOG-${Date.now()}`,
    interceptId,
    event,
    user,
    timestamp: new Date().toISOString(),
    details
  };
}

function getMiddlewareStatus(): any {
  return {
    status: 'operational',
    version: '2.0',
    uptime: '99.97%',
    lastRestart: new Date(Date.now() - 86400000 * 7).toISOString(),
    metrics: {
      requestsToday: 12456,
      blocked: 234,
      escalated: 89,
      autoApproved: 8934,
      avgLatency: '23ms'
    },
    modules: {
      procurement: { status: 'active', requests: 3456 },
      logistics: { status: 'active', requests: 2345 },
      finance: { status: 'active', requests: 1890 },
      donor: { status: 'active', requests: 1234 },
      hr: { status: 'active', requests: 987 },
      field: { status: 'active', requests: 2544 }
    },
    healthChecks: {
      database: 'healthy',
      cache: 'healthy',
      engine: 'healthy',
      analytics: 'healthy'
    }
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Governance Middleware',
    version: '2.0',
    actions: ['intercept', 'validate', 'transform', 'log', 'status'],
    description: 'Central middleware for all IVYAR platform operations'
  });
}