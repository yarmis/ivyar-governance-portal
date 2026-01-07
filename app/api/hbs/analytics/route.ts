// app/api/hbs/analytics/route.ts
// HBS Analytics API Route

import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsData {
  timestamp: string;
  tenantId?: string;
  period: string;
  summary: {
    totalUsers: number;
    totalDecisions: number;
    totalAssessments: number;
    averageRisk: number;
    complianceRate: number;
    incidentsOpen: number;
  };
  tenants: {
    id: string;
    name: string;
    status: string;
    users: number;
    decisions: number;
    risk: number;
  }[];
  modules: {
    id: string;
    name: string;
    decisions: number;
    users: number;
    risk: number;
  }[];
  trends: {
    period: string;
    decisions: number;
    risk: number;
    incidents: number;
  }[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = request.headers.get('x-tenant-id') || searchParams.get('tenantId');
  const period = searchParams.get('period') || 'month';

  // Mock data - in production, aggregate from all engines
  const data: AnalyticsData = {
    timestamp: new Date().toISOString(),
    tenantId: tenantId || undefined,
    period,
    summary: {
      totalUsers: 90930,
      totalDecisions: 26840,
      totalAssessments: 8420,
      averageRisk: 3.8,
      complianceRate: 98.7,
      incidentsOpen: 4,
    },
    tenants: [
      { id: 'UA', name: 'Ukraine MSPS', status: 'active', users: 45230, decisions: 12450, risk: 4.2 },
      { id: 'PL', name: 'Poland MoD', status: 'active', users: 28100, decisions: 8320, risk: 3.1 },
      { id: 'GE', name: 'Georgia MoJ', status: 'active', users: 12400, decisions: 4180, risk: 3.8 },
      { id: 'MD', name: 'Moldova MLSP', status: 'active', users: 5200, decisions: 1890, risk: 4.5 },
      { id: 'KE', name: 'Kenya MoI', status: 'pending', users: 0, decisions: 0, risk: 0 },
    ],
    modules: [
      { id: 'health', name: 'Health', decisions: 8420, users: 12300, risk: 4.1 },
      { id: 'access', name: 'Access', decisions: 15200, users: 89500, risk: 3.2 },
      { id: 'governance', name: 'Governance', decisions: 3100, users: 450, risk: 2.8 },
      { id: 'emigrant', name: 'Emigrant', decisions: 4500, users: 8900, risk: 3.5 },
    ],
    trends: [
      { period: '2025-08', decisions: 4200, risk: 4.0, incidents: 8 },
      { period: '2025-09', decisions: 4500, risk: 3.8, incidents: 5 },
      { period: '2025-10', decisions: 4800, risk: 3.6, incidents: 6 },
      { period: '2025-11', decisions: 5100, risk: 3.5, incidents: 4 },
      { period: '2025-12', decisions: 4300, risk: 3.7, incidents: 7 },
      { period: '2026-01', decisions: 3940, risk: 3.8, incidents: 4 },
    ],
  };

  return NextResponse.json({
    success: true,
    data,
  });
}
