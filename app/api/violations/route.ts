import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

type ViolationType = 'building_code' | 'zoning' | 'environmental' | 'safety' | 'permit' | 'documentation' | 'labor' | 'quality';
type ViolationSeverity = 'minor' | 'moderate' | 'major' | 'critical';
type ViolationStatus = 'reported' | 'under_investigation' | 'confirmed' | 'disputed' | 'remediation_required' | 'remediation_in_progress' | 'resolved' | 'escalated' | 'closed';
type FineStatus = 'pending' | 'issued' | 'paid' | 'overdue' | 'contested';

interface Violation {
  id: string;
  caseNumber: string;
  type: ViolationType;
  severity: ViolationSeverity;
  status: ViolationStatus;
  title: string;
  description: string;
  projectName: string;
  location: string;
  violatorName: string;
  violatorId: string;
  reportedDate: string;
  reportedBy: string;
  fineAmount: number;
  fineStatus: FineStatus;
  aiRiskScore: number;
  deadlineDate?: string;
  escalated: boolean;
  escalationLevel?: string;
  remediationStatus?: string;
}

function authenticateRequest(request: Request): { authenticated: boolean; user?: any; error?: string } {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    let token: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieHeader) {
      const authMatch = cookieHeader.match(/auth-token=([^;]+)/);
      const ivyarMatch = cookieHeader.match(/ivyar_auth=([^;]+)/);
      token = authMatch?.[1] || ivyarMatch?.[1] || null;
    }
    
    if (!token) {
      return { authenticated: false, error: 'No authentication token' };
    }
    
    if (!JWT_SECRET) {
      return { authenticated: false, error: 'Server configuration error' };
    }
    
    const decoded = verify(token, JWT_SECRET);
    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, error: 'Invalid token' };
  }
}

function hasPermission(user: any, action: 'read' | 'write' | 'admin'): boolean {
  const role = user?.role;
  
  if (action === 'read') {
    return ['veteran', 'government_official', 'admin', 'emergency_admin', 'inspector'].includes(role);
  }
  
  if (action === 'write') {
    return ['government_official', 'admin', 'emergency_admin', 'inspector'].includes(role);
  }
  
  if (action === 'admin') {
    return ['admin', 'emergency_admin'].includes(role);
  }
  
  return false;
}

const VIOLATIONS: Violation[] = [
  { id: 'v1', caseNumber: 'VIO-2025-0001', type: 'building_code', severity: 'major', status: 'remediation_required', title: 'Structural Wall Modification Without Permit', description: 'Unauthorized removal of load-bearing wall', projectName: 'Kyiv Business Center', location: '15 Khreshchatyk St', violatorName: 'Kyiv Development LLC', violatorId: 'vr-001', reportedDate: '2025-01-03', reportedBy: 'State Inspector', fineAmount: 850000, fineStatus: 'issued', aiRiskScore: 75, deadlineDate: '2025-02-15', escalated: false, remediationStatus: 'in_progress' },
  { id: 'v2', caseNumber: 'VIO-2025-0002', type: 'environmental', severity: 'critical', status: 'escalated', title: 'Illegal Waste Disposal', description: 'Hazardous construction waste dumped illegally', projectName: 'Industrial Facility', location: '25 Industrial St', violatorName: 'Industrial Holdings JSC', violatorId: 'vr-002', reportedDate: '2025-01-02', reportedBy: 'Environmental Agency', fineAmount: 2500000, fineStatus: 'contested', aiRiskScore: 92, escalated: true, escalationLevel: 'national' },
  { id: 'v3', caseNumber: 'VIO-2024-0156', type: 'safety', severity: 'moderate', status: 'resolved', title: 'Missing Safety Equipment', description: 'Workers without required PPE', projectName: 'Peremohy Residential', location: '78 Peremohy Ave', violatorName: 'BuildRight Contractors', violatorId: 'vr-003', reportedDate: '2024-12-15', reportedBy: 'Labor Inspector', fineAmount: 125000, fineStatus: 'paid', aiRiskScore: 25, escalated: false },
  { id: 'v4', caseNumber: 'VIO-2025-0003', type: 'permit', severity: 'major', status: 'under_investigation', title: 'Construction Without Permit', description: 'Construction commenced before permit approval', projectName: 'Unauthorized Development', location: '45 Svobody St', violatorName: 'Quick Build LLC', violatorId: 'vr-004', reportedDate: '2025-01-06', reportedBy: 'Citizen Complaint', fineAmount: 0, fineStatus: 'pending', aiRiskScore: 60, deadlineDate: '2025-01-09', escalated: false },
  { id: 'v5', caseNumber: 'VIO-2024-0148', type: 'quality', severity: 'minor', status: 'closed', title: 'Substandard Concrete Mix', description: 'Concrete below specification', projectName: 'Metro Extension', location: 'Line 4 Station', violatorName: 'ConcretePro Ltd', violatorId: 'vr-005', reportedDate: '2024-11-20', reportedBy: 'Quality Inspector', fineAmount: 75000, fineStatus: 'paid', aiRiskScore: 15, escalated: false },
];

const VIOLATORS = [
  { id: 'vr-001', name: 'Kyiv Development LLC', type: 'company', totalViolations: 2, totalFines: 850000, riskLevel: 'medium' },
  { id: 'vr-002', name: 'Industrial Holdings JSC', type: 'company', totalViolations: 5, totalFines: 2500000, riskLevel: 'high' },
  { id: 'vr-003', name: 'BuildRight Contractors', type: 'contractor', totalViolations: 1, totalFines: 125000, riskLevel: 'low' },
  { id: 'vr-004', name: 'Quick Build LLC', type: 'company', totalViolations: 1, totalFines: 0, riskLevel: 'medium' },
  { id: 'vr-005', name: 'ConcretePro Ltd', type: 'company', totalViolations: 1, totalFines: 75000, riskLevel: 'low' },
];

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized', message: auth.error }, { status: 401 });
  }
  
  if (!hasPermission(auth.user, 'read')) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'dashboard';

  switch (action) {
    case 'dashboard':
      const all = VIOLATIONS;
      const active = all.filter(v => !['resolved', 'closed'].includes(v.status));
      const totalFines = all.reduce((s, v) => s + v.fineAmount, 0);
      const collectedFines = all.filter(v => v.fineStatus === 'paid').reduce((s, v) => s + v.fineAmount, 0);

      return NextResponse.json({
        success: true,
        data: {
          totalViolations: all.length,
          activeViolations: active.length,
          escalatedCases: all.filter(v => v.escalated).length,
          criticalCases: all.filter(v => v.severity === 'critical').length,
          totalFinesIssued: totalFines,
          totalFinesCollected: collectedFines,
          collectionRate: totalFines > 0 ? Math.round((collectedFines / totalFines) * 100) : 0,
          byType: all.reduce((acc: Record<string, number>, v) => { acc[v.type] = (acc[v.type] || 0) + 1; return acc; }, {}),
          bySeverity: all.reduce((acc: Record<string, number>, v) => { acc[v.severity] = (acc[v.severity] || 0) + 1; return acc; }, {}),
          byStatus: all.reduce((acc: Record<string, number>, v) => { acc[v.status] = (acc[v.status] || 0) + 1; return acc; }, {}),
          highRiskViolators: VIOLATORS.filter(v => v.riskLevel === 'high' || v.totalViolations >= 3),
        },
      });

    case 'violations':
      const status = searchParams.get('status');
      const severity = searchParams.get('severity');
      const type = searchParams.get('type');
      let violations = [...VIOLATIONS];
      if (status && status !== 'all') violations = violations.filter(v => v.status === status);
      if (severity && severity !== 'all') violations = violations.filter(v => v.severity === severity);
      if (type && type !== 'all') violations = violations.filter(v => v.type === type);
      return NextResponse.json({ success: true, data: violations, total: violations.length });

    case 'violation':
      const violationId = searchParams.get('id');
      const caseNum = searchParams.get('case');
      const violation = violationId ? VIOLATIONS.find(v => v.id === violationId) : VIOLATIONS.find(v => v.caseNumber === caseNum);
      if (!violation) return NextResponse.json({ success: false, error: 'Violation not found' }, { status: 404 });
      const violator = VIOLATORS.find(vr => vr.id === violation.violatorId);
      return NextResponse.json({ success: true, data: { ...violation, violator } });

    case 'escalated':
      return NextResponse.json({ success: true, data: VIOLATIONS.filter(v => v.escalated) });

    case 'active':
      return NextResponse.json({ success: true, data: VIOLATIONS.filter(v => !['resolved', 'closed'].includes(v.status)) });

    case 'fines':
      const fineStatus = searchParams.get('status');
      let fines = VIOLATIONS.filter(v => v.fineAmount > 0).map(v => ({
        violationId: v.id,
        caseNumber: v.caseNumber,
        violatorName: v.violatorName,
        amount: v.fineAmount,
        status: v.fineStatus,
        issuedDate: v.reportedDate,
        dueDate: v.deadlineDate,
      }));
      if (fineStatus && fineStatus !== 'all') fines = fines.filter(f => f.status === fineStatus);
      return NextResponse.json({ success: true, data: fines, total: fines.length });

    case 'violators':
      return NextResponse.json({ success: true, data: VIOLATORS });

    case 'violator':
      const violatorId = searchParams.get('id');
      const vr = VIOLATORS.find(v => v.id === violatorId);
      if (!vr) return NextResponse.json({ success: false, error: 'Violator not found' }, { status: 404 });
      const vrViolations = VIOLATIONS.filter(v => v.violatorId === violatorId);
      return NextResponse.json({ success: true, data: { ...vr, violations: vrViolations } });

    case 'risk-assessment':
      const assessId = searchParams.get('violationId');
      const assessViolation = VIOLATIONS.find(v => v.id === assessId);
      if (!assessViolation) return NextResponse.json({ success: false, error: 'Violation not found' }, { status: 404 });
      
      const recommendations: string[] = [];
      if (assessViolation.severity === 'critical') recommendations.push('Immediate action required');
      if (assessViolation.escalated) recommendations.push('Case already escalated - monitor closely');
      const assessViolator = VIOLATORS.find(vr => vr.id === assessViolation.violatorId);
      if (assessViolator && assessViolator.totalViolations > 2) recommendations.push('Repeat offender - enhanced monitoring');
      
      return NextResponse.json({
        success: true,
        data: {
          violationId: assessViolation.id,
          aiRiskScore: assessViolation.aiRiskScore,
          riskLevel: assessViolation.aiRiskScore >= 75 ? 'critical' : assessViolation.aiRiskScore >= 50 ? 'high' : assessViolation.aiRiskScore >= 25 ? 'medium' : 'low',
          recommendations,
        },
      });

    default:
      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized', message: auth.error }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'report_violation':
        if (!hasPermission(auth.user, 'write')) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        const newId = `v${Date.now()}`;
        const newCase = `VIO-${new Date().getFullYear()}-${String(VIOLATIONS.length + 1).padStart(4, '0')}`;
        
        console.log('[VIOLATION_REPORTED]', JSON.stringify({ id: newId, caseNumber: newCase, reportedBy: auth.user.email }));
        
        return NextResponse.json({
          success: true,
          message: 'Violation reported successfully',
          data: { id: newId, caseNumber: newCase, status: 'reported', ...body.violation },
        });

      case 'update_status':
        if (!hasPermission(auth.user, 'write')) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Violation status updated',
          data: { violationId: body.violationId, newStatus: body.status, updatedAt: new Date().toISOString(), updatedBy: auth.user.email },
        });

      case 'issue_fine':
        if (!hasPermission(auth.user, 'admin')) {
          return NextResponse.json({ success: false, error: 'Forbidden', message: 'Only admins can issue fines' }, { status: 403 });
        }
        
        console.log('[FINE_ISSUED]', JSON.stringify({ violationId: body.violationId, amount: body.amount, issuedBy: auth.user.email }));
        
        return NextResponse.json({
          success: true,
          message: 'Fine issued',
          data: { violationId: body.violationId, amount: body.amount, status: 'issued', issuedAt: new Date().toISOString(), issuedBy: auth.user.email },
        });

      case 'record_payment':
        if (!hasPermission(auth.user, 'admin')) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Payment recorded',
          data: { violationId: body.violationId, amount: body.amount, status: 'paid', paidAt: new Date().toISOString() },
        });

      case 'escalate':
        if (!hasPermission(auth.user, 'admin')) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        console.log('[CASE_ESCALATED]', JSON.stringify({ violationId: body.violationId, level: body.level, escalatedBy: auth.user.email }));
        
        return NextResponse.json({
          success: true,
          message: 'Case escalated',
          data: { violationId: body.violationId, level: body.level, escalatedAt: new Date().toISOString(), escalatedBy: auth.user.email },
        });

      case 'submit_remediation':
        if (!hasPermission(auth.user, 'write')) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        return NextResponse.json({
          success: true,
          message: 'Remediation plan submitted',
          data: { violationId: body.violationId, plan: body.plan, status: 'submitted' },
        });

      case 'close_case':
        if (!hasPermission(auth.user, 'admin')) {
          return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        
        console.log('[CASE_CLOSED]', JSON.stringify({ violationId: body.violationId, closedBy: auth.user.email }));
        
        return NextResponse.json({
          success: true,
          message: 'Case closed',
          data: { violationId: body.violationId, status: 'closed', closedAt: new Date().toISOString(), closedBy: auth.user.email },
        });

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[VIOLATIONS_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
