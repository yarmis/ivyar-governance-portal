// app/api/hbs/pdf/route.ts
// HBS Ministry PDF Report API v2.0

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES (In production, import from lib/hbs/pdf/ministry-report)
// ============================================================================

interface MinistryReportRequest {
  tenantId: string;
  period: {
    from: string;
    to: string;
  };
  format: 'html' | 'pdf';
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  includeAnnex: boolean;
}

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

function createMockReportData(tenantId: string, period: { from: string; to: string }, classification: string) {
  const tenants: Record<string, any> = {
    'TEN-UA-001': { name: 'Ukraine MSPS', fullName: 'Ministry of Social Policy of Ukraine', flag: '🇺🇦', countryCode: 'UA', score: 92 },
    'TEN-PL-001': { name: 'Poland MoD', fullName: 'Ministry of Digital Affairs of Poland', flag: '🇵🇱', countryCode: 'PL', score: 88 },
    'TEN-GE-001': { name: 'Georgia MoJ', fullName: 'Ministry of Justice of Georgia', flag: '🇬🇪', countryCode: 'GE', score: 85 },
    'TEN-MD-001': { name: 'Moldova MLSP', fullName: 'Ministry of Labor and Social Protection of Moldova', flag: '🇲🇩', countryCode: 'MD', score: 78 },
    'TEN-KE-001': { name: 'Kenya MoI', fullName: 'Ministry of Interior of Kenya', flag: '🇰🇪', countryCode: 'KE', score: 0 },
  };
  
  const tenantInfo = tenants[tenantId] || tenants['TEN-UA-001'];
  
  return {
    tenant: {
      id: tenantId,
      name: tenantInfo.name,
      fullName: tenantInfo.fullName,
      type: 'ministry',
      flag: tenantInfo.flag,
      countryCode: tenantInfo.countryCode,
      scope: 'national',
      modules: ['health', 'access', 'governance', 'emigrant'],
    },
    period,
    governance: {
      score: tenantInfo.score,
      previousScore: tenantInfo.score - 5,
      trend: 'improving',
      ranking: Object.keys(tenants).indexOf(tenantId) + 1,
      totalTenants: 5,
    },
    incidents: {
      total: 42,
      highRisk: 8,
      resolved: 35,
      pending: 7,
      avgResolutionHours: 4.2,
      byModule: [
        { module: 'Health', count: 18, severity: 'medium' },
        { module: 'Access', count: 12, severity: 'high' },
        { module: 'Governance', count: 8, severity: 'low' },
        { module: 'Emigrant', count: 4, severity: 'low' },
      ],
      topIncidents: [
        { id: 'INC-001', date: period.to, module: 'Access', type: 'policy', severity: 'high', status: 'resolved', description: 'Unauthorized access attempt' },
        { id: 'INC-002', date: period.to, module: 'Health', type: 'boundary', severity: 'medium', status: 'resolved', description: 'Consent workflow deviation' },
        { id: 'INC-003', date: period.to, module: 'Governance', type: 'risk', severity: 'high', status: 'investigating', description: 'High risk score detected' },
      ],
    },
    policies: {
      total: 25,
      compliant: 23,
      violations: 8,
      compliance: {
        access: { score: 92, status: 'green', issues: [] },
        ethics: { score: 88, status: 'yellow', issues: ['2 consent delays'] },
        risk: { score: 85, status: 'yellow', issues: ['Threshold exceeded 3 times'] },
        audit: { score: 98, status: 'green', issues: [] },
        data: { score: 90, status: 'green', issues: [] },
      },
    },
    analytics: {
      decisionsTotal: 12450,
      decisionsAvgPerDay: 402,
      usersActive: 3200,
      usersTotal: 4500,
      riskTrend: [
        { date: 'Week 1', score: 4.2 },
        { date: 'Week 2', score: 3.9 },
        { date: 'Week 3', score: 3.7 },
        { date: 'Week 4', score: 3.8 },
      ],
      moduleUsage: [
        { module: 'health', usage: 45 },
        { module: 'access', usage: 35 },
        { module: 'governance', usage: 15 },
        { module: 'emigrant', usage: 5 },
      ],
    },
    recommendations: [
      { priority: 'high', title: 'Strengthen Ethics Review Process', description: 'Implement additional checks for consent workflows to reduce delays and improve compliance.', deadline: '2026-02-01' },
      { priority: 'medium', title: 'Risk Threshold Optimization', description: 'Review and adjust risk thresholds based on operational patterns to reduce false positives.', deadline: '2026-03-01' },
      { priority: 'medium', title: 'User Training Program', description: 'Conduct refresher training for 450 users on governance protocols and best practices.' },
      { priority: 'low', title: 'Documentation Update', description: 'Update internal documentation to reflect recent policy changes and new module features.' },
    ],
    generatedBy: 'HBS Governance Core',
    generatedAt: new Date().toISOString(),
    reportId: `RPT-${tenantId}-${Date.now()}`,
    version: '2.0',
    classification,
  };
}

// ============================================================================
// SIMPLIFIED HTML GENERATOR (Full version in ministry-report.ts)
// ============================================================================

function generateReportHTML(data: any): string {
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return '#10B981';
      case 'yellow': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ministry Governance Report - ${data.tenant.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; font-size: 11pt; line-height: 1.6; color: #1a1a2e; background: white; }
    .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto 10mm; background: white; position: relative; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    @media print { .page { page-break-after: always; margin: 0; padding: 15mm; box-shadow: none; } }
    
    .cover { display: flex; flex-direction: column; justify-content: space-between; height: calc(297mm - 40mm); }
    .cover-header { text-align: center; padding-top: 60px; }
    .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #00E0B8, #00A3FF); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: #0D1117; margin: 0 auto 40px; }
    .cover-title { font-size: 36px; font-weight: 700; color: #0D1117; margin-bottom: 10px; }
    .cover-subtitle { font-size: 18px; color: #666; margin-bottom: 60px; }
    .cover-tenant { background: linear-gradient(135deg, #f8f9fa, #fff); border: 2px solid #e0e0e0; border-radius: 16px; padding: 30px; display: inline-block; }
    .tenant-flag { font-size: 64px; margin-bottom: 15px; }
    .tenant-name { font-size: 24px; font-weight: 700; color: #0D1117; }
    .tenant-id { font-size: 12px; color: #666; margin-top: 5px; }
    .cover-period { margin-top: 40px; font-size: 16px; color: #666; }
    .cover-footer { text-align: center; padding-bottom: 20px; }
    .classification-badge { display: inline-block; padding: 8px 20px; background: ${data.classification === 'confidential' ? '#EF4444' : data.classification === 'restricted' ? '#F59E0B' : '#10B981'}; color: white; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 6px; margin-bottom: 20px; }
    .cover-meta { font-size: 11px; color: #999; }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 2px solid #00E0B8; margin-bottom: 25px; }
    .page-header-logo { display: flex; align-items: center; gap: 10px; }
    .page-header-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #00E0B8, #00A3FF); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #0D1117; }
    .page-header-title { font-size: 14px; font-weight: 600; color: #0D1117; }
    .page-header-meta { text-align: right; font-size: 10px; color: #666; }
    
    .section { margin-bottom: 30px; }
    .section-number { display: inline-block; width: 30px; height: 30px; background: #0D1117; color: white; border-radius: 50%; text-align: center; line-height: 30px; font-size: 14px; font-weight: 600; margin-right: 10px; }
    .section-title { font-size: 20px; font-weight: 700; color: #0D1117; margin-bottom: 20px; display: flex; align-items: center; }
    
    .summary-box { background: linear-gradient(135deg, #0D1117, #1a2332); color: white; padding: 25px; border-radius: 12px; margin: 20px 0; }
    .summary-title { font-size: 14px; font-weight: 600; margin-bottom: 15px; color: #00E0B8; }
    .summary-text { font-size: 12px; line-height: 1.8; }
    
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .kpi-card { padding: 20px; background: linear-gradient(135deg, #f8f9fa, #fff); border: 1px solid #e0e0e0; border-radius: 12px; text-align: center; }
    .kpi-value { font-size: 32px; font-weight: 700; color: #00E0B8; }
    .kpi-value.warning { color: #F59E0B; }
    .kpi-value.danger { color: #EF4444; }
    .kpi-value.blue { color: #00A3FF; }
    .kpi-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 5px; }
    .kpi-change { font-size: 10px; margin-top: 5px; }
    .kpi-change.positive { color: #10B981; }
    
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10pt; }
    th { background: #0D1117; color: white; padding: 12px 10px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; }
    td { padding: 12px 10px; border-bottom: 1px solid #e0e0e0; }
    tr:nth-child(even) { background: #f8f9fa; }
    
    .heatmap { display: grid; grid-template-columns: 120px repeat(5, 1fr); gap: 2px; margin: 20px 0; }
    .heatmap-header { background: #0D1117; color: white; padding: 10px; font-size: 10px; font-weight: 600; text-align: center; }
    .heatmap-label { background: #f8f9fa; padding: 10px; font-size: 11px; font-weight: 500; }
    .heatmap-cell { padding: 15px 10px; text-align: center; font-size: 14px; font-weight: 700; color: white; border-radius: 4px; }
    .heatmap-cell.green { background: #10B981; }
    .heatmap-cell.yellow { background: #F59E0B; }
    .heatmap-cell.red { background: #EF4444; }
    
    .recommendation { display: flex; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #00E0B8; }
    .recommendation.high { border-left-color: #F97316; }
    .recommendation.critical { border-left-color: #EF4444; }
    .recommendation-number { width: 28px; height: 28px; background: #0D1117; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
    .recommendation-title { font-size: 13px; font-weight: 600; color: #0D1117; margin-bottom: 5px; }
    .recommendation-description { font-size: 11px; color: #666; }
    .recommendation-deadline { font-size: 10px; color: #F59E0B; margin-top: 5px; }
    
    .page-footer { position: absolute; bottom: 15mm; left: 20mm; right: 20mm; padding-top: 10px; border-top: 1px solid #e0e0e0; font-size: 9px; color: #666; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div class="page">
    <div class="cover">
      <div class="cover-header">
        <div class="logo">HBS</div>
        <h1 class="cover-title">Ministry Governance Report</h1>
        <p class="cover-subtitle">Comprehensive Governance Assessment & Analytics</p>
        <div class="cover-tenant">
          <div class="tenant-flag">${data.tenant.flag}</div>
          <div class="tenant-name">${data.tenant.fullName}</div>
          <div class="tenant-id">${data.tenant.id} | ${data.tenant.type.toUpperCase()} | ${data.tenant.scope.toUpperCase()}</div>
        </div>
        <div class="cover-period">
          <strong>Reporting Period:</strong> ${formatDate(data.period.from)} — ${formatDate(data.period.to)}
        </div>
      </div>
      <div class="cover-footer">
        <div class="classification-badge">${data.classification}</div>
        <div class="cover-meta">
          Report ID: ${data.reportId}<br>
          Generated: ${formatDate(data.generatedAt)} by ${data.generatedBy}<br>
          Version: ${data.version}
        </div>
      </div>
    </div>
  </div>
  
  <!-- EXECUTIVE SUMMARY -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">${data.tenant.name}<br>${formatDate(data.period.from)} — ${formatDate(data.period.to)}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">1</span> Executive Summary</h2>
      
      <div class="summary-box">
        <div class="summary-title">Overall Assessment</div>
        <div class="summary-text">
          During the reporting period, <strong>${data.tenant.name}</strong> achieved a governance score of 
          <strong>${data.governance.score}/100</strong> (${data.governance.trend === 'improving' ? '↑ improving' : '→ stable'} from ${data.governance.previousScore}).
          The organization processed <strong>${data.analytics.decisionsTotal.toLocaleString()}</strong> governance decisions.
          <strong>${data.incidents.total}</strong> incidents were recorded, of which <strong>${data.incidents.highRisk}</strong> were classified as high-risk.
          Policy compliance rate stands at <strong>${Math.round((data.policies.compliant / data.policies.total) * 100)}%</strong>.
        </div>
      </div>
      
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value ${data.governance.score >= 80 ? '' : 'warning'}">${data.governance.score}</div>
          <div class="kpi-label">Governance Score</div>
          <div class="kpi-change positive">↑ from ${data.governance.previousScore}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value ${data.incidents.highRisk > 10 ? 'danger' : ''}">${data.incidents.total}</div>
          <div class="kpi-label">Total Incidents</div>
          <div class="kpi-change">${data.incidents.highRisk} high-risk</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value ${data.policies.violations > 20 ? 'danger' : 'warning'}">${data.policies.violations}</div>
          <div class="kpi-label">Policy Violations</div>
          <div class="kpi-change">${data.policies.total} policies</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value blue">${data.incidents.avgResolutionHours}h</div>
          <div class="kpi-label">Avg Resolution</div>
          <div class="kpi-change">${data.incidents.resolved} resolved</div>
        </div>
      </div>
    </div>
    <div class="page-footer"><div>© 2024-2026 IVYAR. All rights reserved.</div><div>Page 2 of 6</div></div>
  </div>
  
  <!-- POLICY COMPLIANCE -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">${data.tenant.name}<br>${formatDate(data.period.from)} — ${formatDate(data.period.to)}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">2</span> Policy Compliance</h2>
      <p style="margin-bottom: 20px; color: #666;">Green ≥90% | Yellow ≥70% | Red &lt;70%</p>
      
      <div class="heatmap">
        <div class="heatmap-header"></div>
        <div class="heatmap-header">Access</div>
        <div class="heatmap-header">Ethics</div>
        <div class="heatmap-header">Risk</div>
        <div class="heatmap-header">Audit</div>
        <div class="heatmap-header">Data</div>
        <div class="heatmap-label">${data.tenant.name}</div>
        <div class="heatmap-cell ${data.policies.compliance.access.status}">${data.policies.compliance.access.score}%</div>
        <div class="heatmap-cell ${data.policies.compliance.ethics.status}">${data.policies.compliance.ethics.score}%</div>
        <div class="heatmap-cell ${data.policies.compliance.risk.status}">${data.policies.compliance.risk.score}%</div>
        <div class="heatmap-cell ${data.policies.compliance.audit.status}">${data.policies.compliance.audit.score}%</div>
        <div class="heatmap-cell ${data.policies.compliance.data.status}">${data.policies.compliance.data.score}%</div>
      </div>
      
      ${Object.entries(data.policies.compliance).map(([key, value]: [string, any]) => `
      <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${getStatusColor(value.status)};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="text-transform: capitalize;">${key} Policy</strong>
          <span style="font-size: 18px; font-weight: 700; color: ${getStatusColor(value.status)};">${value.score}%</span>
        </div>
        ${value.issues.length > 0 ? `<div style="font-size: 11px; color: #666;"><strong>Issues:</strong> ${value.issues.join(', ')}</div>` : '<div style="font-size: 11px; color: #10B981;">No issues detected</div>'}
      </div>
      `).join('')}
    </div>
    <div class="page-footer"><div>© 2024-2026 IVYAR. All rights reserved.</div><div>Page 3 of 6</div></div>
  </div>
  
  <!-- RECOMMENDATIONS -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">${data.tenant.name}<br>${formatDate(data.period.from)} — ${formatDate(data.period.to)}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">3</span> Recommendations</h2>
      <p style="margin-bottom: 20px; color: #666;">Based on the governance assessment, the following actions are recommended.</p>
      
      ${data.recommendations.map((rec: any, idx: number) => `
      <div class="recommendation ${rec.priority}">
        <div class="recommendation-number">${idx + 1}</div>
        <div>
          <div class="recommendation-title">${rec.title}</div>
          <div class="recommendation-description">${rec.description}</div>
          ${rec.deadline ? `<div class="recommendation-deadline">⏰ Deadline: ${formatDate(rec.deadline)}</div>` : ''}
        </div>
      </div>
      `).join('')}
    </div>
    
    <div style="text-align: center; margin-top: 60px; padding: 30px; background: #f8f9fa; border-radius: 12px;">
      <div style="font-size: 12px; color: #666; margin-bottom: 10px;">End of Report</div>
      <div style="font-size: 24px; font-weight: 700; color: #0D1117;">🏛️ IVYAR</div>
      <div style="font-size: 11px; color: #666;">HBS Governance Platform</div>
      <div style="font-size: 10px; color: #999; margin-top: 10px;">Washington, USA | www.ivyar.org</div>
    </div>
    
    <div class="page-footer"><div>© 2024-2026 IVYAR. All rights reserved.</div><div>Page 4 of 6</div></div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// API HANDLERS
// ============================================================================

// GET - List available report types and get report templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  return NextResponse.json({
    success: true,
    data: {
      reportTypes: [
        { type: 'ministry', title: 'Ministry Governance Report', pages: 6, icon: '🏛️' },
        { type: 'readiness', title: 'Deployment Readiness Report', pages: 4, icon: '🚀' },
        { type: 'audit', title: 'Audit & Compliance Report', pages: 5, icon: '📋' },
        { type: 'executive', title: 'Executive Summary', pages: 2, icon: '📊' },
        { type: 'incident', title: 'Incident Report', pages: 3, icon: '⚠️' },
      ],
      classifications: ['public', 'internal', 'confidential', 'restricted'],
      formats: ['html', 'pdf'],
      availableTenants: [
        { id: 'TEN-UA-001', name: 'Ukraine MSPS', flag: '🇺🇦' },
        { id: 'TEN-PL-001', name: 'Poland MoD', flag: '🇵🇱' },
        { id: 'TEN-GE-001', name: 'Georgia MoJ', flag: '🇬🇪' },
        { id: 'TEN-MD-001', name: 'Moldova MLSP', flag: '🇲🇩' },
        { id: 'TEN-KE-001', name: 'Kenya MoI', flag: '🇰🇪' },
      ],
    },
  });
}

// POST - Generate Ministry Governance Report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MinistryReportRequest;

    // Validate request
    const errors: string[] = [];
    if (!body.tenantId) errors.push('tenantId is required');
    if (!body.period?.from || !body.period?.to) errors.push('period (from, to) is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } },
        { status: 400 }
      );
    }

    // Generate report data
    const reportData = createMockReportData(
      body.tenantId,
      body.period,
      body.classification || 'internal'
    );

    // Generate HTML
    const html = generateReportHTML(reportData);

    // Return response
    if (body.format === 'pdf') {
      // In production, convert HTML to PDF using puppeteer or similar
      // For now, return HTML with PDF metadata
      return NextResponse.json({
        success: true,
        data: {
          reportId: reportData.reportId,
          tenantId: body.tenantId,
          tenantName: reportData.tenant.name,
          period: body.period,
          classification: body.classification || 'internal',
          format: 'html', // Would be 'pdf' in production
          pages: 6,
          generatedAt: reportData.generatedAt,
          downloadUrl: `/api/hbs/pdf/download/${reportData.reportId}`,
          html, // Include HTML for preview
        },
      });
    }

    // Return HTML directly
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${reportData.reportId}.html"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'GENERATION_ERROR', message: 'Failed to generate report' } },
      { status: 500 }
    );
  }
}
