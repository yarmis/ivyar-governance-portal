// app/api/hbs/analytics/route.ts
// HBS Enhanced Analytics API v2.0

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

interface KPIData {
  activeTenants: number;
  totalTenants: number;
  highRiskIncidents30d: number;
  policyViolations30d: number;
  auditCoverage: number;
  governanceScore: number;
  decisionsToday: number;
  avgResolutionHours: number;
}

interface RiskTrendPoint {
  timestamp: string;
  date: string;
  avgRiskScore: number;
  minRisk: number;
  maxRisk: number;
  assessments: number;
}

interface IncidentsByModule {
  module: string;
  icon: string;
  count: number;
  high: number;
  medium: number;
  low: number;
}

interface TenantOverview {
  tenantId: string;
  name: string;
  flag: string;
  type: 'country' | 'ministry' | 'program';
  modules: string[];
  lastIncidentAt: string | null;
  governanceScore: number;
  status: 'active' | 'warning' | 'critical';
}

interface Incident {
  id: string;
  timestamp: string;
  tenantId: string;
  tenantName: string;
  module: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'policy' | 'access' | 'ethics' | 'risk' | 'boundary';
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  description: string;
}

interface PolicyCompliance {
  tenantId: string;
  tenantName: string;
  policies: {
    access: { score: number; status: 'green' | 'yellow' | 'red' };
    ethics: { score: number; status: 'green' | 'yellow' | 'red' };
    risk: { score: number; status: 'green' | 'yellow' | 'red' };
    audit: { score: number; status: 'green' | 'yellow' | 'red' };
    data: { score: number; status: 'green' | 'yellow' | 'red' };
  };
  overallScore: number;
}

// ============================================================================
// MOCK DATA (In production, fetch from database)
// ============================================================================

const MOCK_KPIS: KPIData = {
  activeTenants: 4,
  totalTenants: 5,
  highRiskIncidents30d: 12,
  policyViolations30d: 37,
  auditCoverage: 100,
  governanceScore: 87,
  decisionsToday: 1247,
  avgResolutionHours: 4.2,
};

const MOCK_RISK_TREND: RiskTrendPoint[] = [
  { timestamp: '2025-12-01', date: 'Dec 1', avgRiskScore: 4.2, minRisk: 2.1, maxRisk: 7.8, assessments: 145 },
  { timestamp: '2025-12-08', date: 'Dec 8', avgRiskScore: 4.0, minRisk: 1.8, maxRisk: 7.2, assessments: 168 },
  { timestamp: '2025-12-15', date: 'Dec 15', avgRiskScore: 3.8, minRisk: 1.5, maxRisk: 6.9, assessments: 152 },
  { timestamp: '2025-12-22', date: 'Dec 22', avgRiskScore: 3.9, minRisk: 1.7, maxRisk: 7.1, assessments: 134 },
  { timestamp: '2025-12-29', date: 'Dec 29', avgRiskScore: 3.7, minRisk: 1.4, maxRisk: 6.5, assessments: 121 },
  { timestamp: '2026-01-05', date: 'Jan 5', avgRiskScore: 3.8, minRisk: 1.6, maxRisk: 6.8, assessments: 189 },
];

const MOCK_INCIDENTS_BY_MODULE: IncidentsByModule[] = [
  { module: 'Health', icon: '🏥', count: 24, high: 3, medium: 12, low: 9 },
  { module: 'Access', icon: '🔐', count: 18, high: 5, medium: 8, low: 5 },
  { module: 'Governance', icon: '🏛️', count: 8, high: 1, medium: 4, low: 3 },
  { module: 'Emigrant', icon: '🌍', count: 6, high: 2, medium: 2, low: 2 },
  { module: 'Aviation', icon: '✈️', count: 3, high: 1, medium: 1, low: 1 },
];

const MOCK_TENANTS: TenantOverview[] = [
  { tenantId: 'TEN-UA-001', name: 'Ukraine MSPS', flag: '🇺🇦', type: 'ministry', modules: ['health', 'access', 'governance', 'emigrant'], lastIncidentAt: '2026-01-05T14:32:00Z', governanceScore: 92, status: 'active' },
  { tenantId: 'TEN-PL-001', name: 'Poland MoD', flag: '🇵🇱', type: 'ministry', modules: ['health', 'access', 'governance'], lastIncidentAt: '2026-01-04T09:15:00Z', governanceScore: 88, status: 'active' },
  { tenantId: 'TEN-GE-001', name: 'Georgia MoJ', flag: '🇬🇪', type: 'ministry', modules: ['health', 'access', 'governance'], lastIncidentAt: '2026-01-03T16:45:00Z', governanceScore: 85, status: 'active' },
  { tenantId: 'TEN-MD-001', name: 'Moldova MLSP', flag: '🇲🇩', type: 'ministry', modules: ['health', 'access'], lastIncidentAt: '2026-01-02T11:20:00Z', governanceScore: 78, status: 'warning' },
  { tenantId: 'TEN-KE-001', name: 'Kenya MoI', flag: '🇰🇪', type: 'ministry', modules: ['access', 'governance'], lastIncidentAt: null, governanceScore: 0, status: 'critical' },
];

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-001', timestamp: '2026-01-06T14:32:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', module: 'Health', severity: 'high', type: 'boundary', status: 'investigating', description: 'Boundary violation in consent workflow' },
  { id: 'INC-002', timestamp: '2026-01-06T12:15:00Z', tenantId: 'TEN-PL-001', tenantName: 'Poland', module: 'Access', severity: 'medium', type: 'access', status: 'resolved', description: 'Unauthorized role assignment attempt' },
  { id: 'INC-003', timestamp: '2026-01-06T10:45:00Z', tenantId: 'TEN-UA-001', tenantName: 'Ukraine', module: 'Access', severity: 'critical', type: 'policy', status: 'escalated', description: 'Critical policy violation - bulk data export' },
  { id: 'INC-004', timestamp: '2026-01-05T18:20:00Z', tenantId: 'TEN-GE-001', tenantName: 'Georgia', module: 'Governance', severity: 'low', type: 'risk', status: 'resolved', description: 'Risk threshold exceeded during assessment' },
  { id: 'INC-005', timestamp: '2026-01-05T14:10:00Z', tenantId: 'TEN-MD-001', tenantName: 'Moldova', module: 'Health', severity: 'medium', type: 'ethics', status: 'open', description: 'Ethics consultation required for complex case' },
];

const MOCK_POLICY_COMPLIANCE: PolicyCompliance[] = [
  { tenantId: 'TEN-UA-001', tenantName: 'Ukraine MSPS', policies: { access: { score: 95, status: 'green' }, ethics: { score: 92, status: 'green' }, risk: { score: 88, status: 'yellow' }, audit: { score: 100, status: 'green' }, data: { score: 94, status: 'green' } }, overallScore: 94 },
  { tenantId: 'TEN-PL-001', tenantName: 'Poland MoD', policies: { access: { score: 91, status: 'green' }, ethics: { score: 88, status: 'yellow' }, risk: { score: 85, status: 'yellow' }, audit: { score: 98, status: 'green' }, data: { score: 90, status: 'green' } }, overallScore: 90 },
  { tenantId: 'TEN-GE-001', tenantName: 'Georgia MoJ', policies: { access: { score: 88, status: 'yellow' }, ethics: { score: 85, status: 'yellow' }, risk: { score: 82, status: 'yellow' }, audit: { score: 95, status: 'green' }, data: { score: 86, status: 'yellow' } }, overallScore: 87 },
  { tenantId: 'TEN-MD-001', tenantName: 'Moldova MLSP', policies: { access: { score: 78, status: 'yellow' }, ethics: { score: 72, status: 'yellow' }, risk: { score: 68, status: 'red' }, audit: { score: 92, status: 'green' }, data: { score: 75, status: 'yellow' } }, overallScore: 77 },
  { tenantId: 'TEN-KE-001', tenantName: 'Kenya MoI', policies: { access: { score: 0, status: 'red' }, ethics: { score: 0, status: 'red' }, risk: { score: 0, status: 'red' }, audit: { score: 0, status: 'red' }, data: { score: 0, status: 'red' } }, overallScore: 0 },
];

// ============================================================================
// API HANDLERS
// ============================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'overview';
  const tenantId = searchParams.get('tenantId');
  const module = searchParams.get('module');
  const range = searchParams.get('range') || '30d';
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');

  try {
    switch (endpoint) {
      // GET /api/hbs/analytics?endpoint=overview
      case 'overview':
        return NextResponse.json({
          success: true,
          data: MOCK_KPIS,
          timestamp: new Date().toISOString(),
        });

      // GET /api/hbs/analytics?endpoint=risk-trend
      case 'risk-trend':
        let riskData = [...MOCK_RISK_TREND];
        // Filter by range if needed
        return NextResponse.json({
          success: true,
          data: riskData,
          meta: {
            range,
            tenantId: tenantId || 'all',
            module: module || 'all',
          },
        });

      // GET /api/hbs/analytics?endpoint=incidents-by-module
      case 'incidents-by-module':
        let moduleData = [...MOCK_INCIDENTS_BY_MODULE];
        if (tenantId) {
          // Filter by tenant if needed
        }
        return NextResponse.json({
          success: true,
          data: moduleData,
          meta: {
            range,
            tenantId: tenantId || 'all',
          },
        });

      // GET /api/hbs/analytics?endpoint=tenants
      case 'tenants':
        let tenantsData = [...MOCK_TENANTS];
        if (status) {
          tenantsData = tenantsData.filter(t => t.status === status);
        }
        return NextResponse.json({
          success: true,
          data: tenantsData,
          meta: {
            total: tenantsData.length,
            active: tenantsData.filter(t => t.status === 'active').length,
          },
        });

      // GET /api/hbs/analytics?endpoint=incidents
      case 'incidents':
        let incidentsData = [...MOCK_INCIDENTS];
        if (tenantId) {
          incidentsData = incidentsData.filter(i => i.tenantId === tenantId);
        }
        if (module) {
          incidentsData = incidentsData.filter(i => i.module.toLowerCase() === module.toLowerCase());
        }
        if (severity) {
          incidentsData = incidentsData.filter(i => i.severity === severity);
        }
        if (status) {
          incidentsData = incidentsData.filter(i => i.status === status);
        }
        return NextResponse.json({
          success: true,
          data: incidentsData,
          meta: {
            total: incidentsData.length,
            byStatus: {
              open: incidentsData.filter(i => i.status === 'open').length,
              investigating: incidentsData.filter(i => i.status === 'investigating').length,
              resolved: incidentsData.filter(i => i.status === 'resolved').length,
              escalated: incidentsData.filter(i => i.status === 'escalated').length,
            },
            bySeverity: {
              critical: incidentsData.filter(i => i.severity === 'critical').length,
              high: incidentsData.filter(i => i.severity === 'high').length,
              medium: incidentsData.filter(i => i.severity === 'medium').length,
              low: incidentsData.filter(i => i.severity === 'low').length,
            },
          },
        });

      // GET /api/hbs/analytics?endpoint=policy-compliance
      case 'policy-compliance':
        let complianceData = [...MOCK_POLICY_COMPLIANCE];
        if (tenantId) {
          complianceData = complianceData.filter(c => c.tenantId === tenantId);
        }
        return NextResponse.json({
          success: true,
          data: complianceData,
          meta: {
            averageScore: Math.round(
              complianceData.filter(c => c.overallScore > 0).reduce((sum, c) => sum + c.overallScore, 0) / 
              complianceData.filter(c => c.overallScore > 0).length
            ),
            tenantsAtRisk: complianceData.filter(c => c.overallScore > 0 && c.overallScore < 70).length,
          },
        });

      // GET /api/hbs/analytics?endpoint=governance-score
      case 'governance-score':
        // Governance Score Formula:
        // (Access * 0.25) + (Audit * 0.25) + (Risk * 0.20) + (Ethics * 0.15) + (Data * 0.15)
        const calculateGovernanceScore = (c: PolicyCompliance) => {
          const { access, audit, risk, ethics, data } = c.policies;
          return Math.round(
            (access.score * 0.25) +
            (audit.score * 0.25) +
            (risk.score * 0.20) +
            (ethics.score * 0.15) +
            (data.score * 0.15)
          );
        };

        const scores = MOCK_POLICY_COMPLIANCE.map(c => ({
          tenantId: c.tenantId,
          tenantName: c.tenantName,
          governanceScore: calculateGovernanceScore(c),
          components: {
            access: { score: c.policies.access.score, weight: 0.25 },
            audit: { score: c.policies.audit.score, weight: 0.25 },
            risk: { score: c.policies.risk.score, weight: 0.20 },
            ethics: { score: c.policies.ethics.score, weight: 0.15 },
            data: { score: c.policies.data.score, weight: 0.15 },
          },
        }));

        return NextResponse.json({
          success: true,
          data: tenantId ? scores.filter(s => s.tenantId === tenantId) : scores,
          meta: {
            formula: '(Access * 0.25) + (Audit * 0.25) + (Risk * 0.20) + (Ethics * 0.15) + (Data * 0.15)',
            thresholds: {
              excellent: '>= 90',
              good: '>= 80',
              acceptable: '>= 70',
              warning: '>= 50',
              critical: '< 50',
            },
          },
        });

      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_ENDPOINT', message: `Unknown endpoint: ${endpoint}` } },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST - Create/Update analytics data (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tenantId, data } = body;

    switch (action) {
      case 'refresh':
        // Trigger analytics refresh
        return NextResponse.json({
          success: true,
          message: 'Analytics refresh triggered',
          timestamp: new Date().toISOString(),
        });

      case 'export':
        // Export analytics data
        return NextResponse.json({
          success: true,
          data: {
            exportId: `EXP-${Date.now()}`,
            format: body.format || 'json',
            status: 'processing',
            estimatedTime: '2 minutes',
          },
        });

      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_ACTION', message: `Unknown action: ${action}` } },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
