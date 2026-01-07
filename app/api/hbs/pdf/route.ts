// app/api/hbs/pdf/route.ts
// HBS Ministry PDF Report API Route

import { NextRequest, NextResponse } from 'next/server';

// Types (in production, import from lib/hbs/pdf/generator)
type ReportType = 'readiness' | 'audit' | 'deployment' | 'compliance' | 'executive' | 'incident' | 'risk';

interface PdfPayload {
  tenantId: string;
  tenantName: string;
  module: string;
  reportType: ReportType;
  period?: { from: string; to: string };
  data: any;
  options?: {
    language: string;
    includeCharts: boolean;
    includeAppendix: boolean;
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
    watermark?: string;
  };
}

const SUPPORTED_REPORT_TYPES: ReportType[] = ['readiness', 'audit', 'deployment', 'compliance', 'executive', 'incident', 'risk'];

// POST - Generate PDF Report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PdfPayload;

    // Validate payload
    const errors: string[] = [];
    if (!body.tenantId) errors.push('tenantId is required');
    if (!body.tenantName) errors.push('tenantName is required');
    if (!body.module) errors.push('module is required');
    if (!body.reportType) errors.push('reportType is required');
    if (body.reportType && !SUPPORTED_REPORT_TYPES.includes(body.reportType)) {
      errors.push(`Invalid reportType: ${body.reportType}. Supported: ${SUPPORTED_REPORT_TYPES.join(', ')}`);
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: errors.join('; ') } },
        { status: 400 }
      );
    }

    // Generate report metadata
    const reportId = `RPT-${body.tenantId}-${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // In production, call generateMinistryPdf from lib/hbs/pdf/generator
    // For now, return HTML report as JSON with download URL

    const reportHtml = generateMockHtmlReport(body, reportId, generatedAt);

    // Return report info (in production, would return PDF buffer or URL)
    return NextResponse.json({
      success: true,
      data: {
        reportId,
        tenantId: body.tenantId,
        tenantName: body.tenantName,
        module: body.module,
        reportType: body.reportType,
        generatedAt,
        classification: body.options?.classification || 'internal',
        format: 'html', // In production: 'pdf'
        // In production: url to download PDF from S3/storage
        // downloadUrl: `https://storage.ivyar.org/reports/${reportId}.pdf`,
        html: reportHtml,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'GENERATION_ERROR', message: 'Failed to generate report' } },
      { status: 500 }
    );
  }
}

// GET - List available report types and templates
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  return NextResponse.json({
    success: true,
    data: {
      supportedTypes: SUPPORTED_REPORT_TYPES,
      templates: [
        { type: 'readiness', title: 'Deployment Readiness Report', icon: '🚀', sections: 6 },
        { type: 'audit', title: 'Audit & Compliance Report', icon: '📋', sections: 6 },
        { type: 'deployment', title: 'Deployment Status Report', icon: '📦', sections: 6 },
        { type: 'compliance', title: 'Compliance Assessment Report', icon: '✅', sections: 6 },
        { type: 'executive', title: 'Executive Summary Report', icon: '📊', sections: 5 },
        { type: 'incident', title: 'Incident Report', icon: '⚠️', sections: 6 },
        { type: 'risk', title: 'Risk Assessment Report', icon: '🎯', sections: 6 },
      ],
      classifications: ['public', 'internal', 'confidential', 'restricted'],
      formats: ['pdf', 'html'],
    },
  });
}

// Mock HTML generator (simplified version)
function generateMockHtmlReport(payload: PdfPayload, reportId: string, generatedAt: string): string {
  const titles: Record<ReportType, string> = {
    readiness: 'Deployment Readiness Report',
    audit: 'Audit & Compliance Report',
    deployment: 'Deployment Status Report',
    compliance: 'Compliance Assessment Report',
    executive: 'Executive Summary Report',
    incident: 'Incident Report',
    risk: 'Risk Assessment Report',
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${titles[payload.reportType]}</title>
  <style>
    body { font-family: Inter, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #00E0B8; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0D1117; }
    .title { font-size: 28px; font-weight: bold; margin: 30px 0; text-align: center; }
    .meta { color: #666; font-size: 12px; }
    .section { margin: 25px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
    .section h2 { font-size: 18px; margin-bottom: 15px; color: #0D1117; }
    .kpi { display: inline-block; padding: 15px 25px; margin: 5px; background: white; border-radius: 8px; text-align: center; }
    .kpi-value { font-size: 24px; font-weight: bold; color: #00E0B8; }
    .kpi-label { font-size: 11px; color: #666; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background: #0D1117; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
    .badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; }
    .badge-success { background: #D1FAE5; color: #065F46; }
    .badge-warning { background: #FEF3C7; color: #92400E; }
    .classification { display: inline-block; padding: 4px 12px; background: #10B981; color: white; font-size: 10px; font-weight: 600; text-transform: uppercase; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="logo">🏛️ IVYAR HBS</div>
      <div class="meta">
        <span class="classification">${payload.options?.classification || 'INTERNAL'}</span><br>
        Report ID: ${reportId}<br>
        Generated: ${new Date(generatedAt).toLocaleDateString()}
      </div>
    </div>
  </div>
  
  <h1 class="title">${titles[payload.reportType]}</h1>
  
  <div style="text-align: center; margin-bottom: 30px;">
    <strong>${payload.tenantName}</strong><br>
    <span class="meta">${payload.tenantId} | ${payload.module.toUpperCase()} Module</span>
    ${payload.period ? `<br><span class="meta">Period: ${payload.period.from} — ${payload.period.to}</span>` : ''}
  </div>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <p>This ${payload.reportType} report has been generated for ${payload.tenantName}. The analysis covers the ${payload.module} module operations and provides key metrics and recommendations.</p>
  </div>
  
  <div class="section">
    <h2>Key Metrics</h2>
    <div style="text-align: center;">
      <div class="kpi"><div class="kpi-value">${payload.data?.readinessScore || '85'}%</div><div class="kpi-label">Score</div></div>
      <div class="kpi"><div class="kpi-value">${payload.data?.issues || '3'}</div><div class="kpi-label">Issues</div></div>
      <div class="kpi"><div class="kpi-value">${payload.data?.compliance || '98.7'}%</div><div class="kpi-label">Compliance</div></div>
      <div class="kpi"><div class="kpi-value">${payload.data?.risk || '3.8'}</div><div class="kpi-label">Risk Score</div></div>
    </div>
  </div>
  
  <div class="section">
    <h2>Status Overview</h2>
    <table>
      <tr><th>Component</th><th>Status</th><th>Notes</th></tr>
      <tr><td>Infrastructure</td><td><span class="badge badge-success">Ready</span></td><td>All systems operational</td></tr>
      <tr><td>Security</td><td><span class="badge badge-success">Ready</span></td><td>Passed all checks</td></tr>
      <tr><td>Integration</td><td><span class="badge badge-warning">In Progress</span></td><td>SSO pending</td></tr>
      <tr><td>Training</td><td><span class="badge badge-success">Ready</span></td><td>Complete</td></tr>
    </table>
  </div>
  
  <div class="section">
    <h2>Recommendations</h2>
    <ol>
      <li><strong>Complete SSO Integration</strong> - Finalize national identity provider integration</li>
      <li><strong>Load Testing</strong> - Conduct final performance validation</li>
      <li><strong>Documentation Review</strong> - Ensure all procedures are documented</li>
    </ol>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #666; text-align: center;">
    © 2024-2026 IVYAR. All rights reserved. | HBS Governance Platform | Washington, USA
  </div>
</body>
</html>
  `;
}
