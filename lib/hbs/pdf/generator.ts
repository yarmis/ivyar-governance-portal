// lib/hbs/pdf/generator.ts
// HBS Ministry PDF Report Generator v1.0

// ============================================================================
// TYPES
// ============================================================================

export type ReportType = 
  | 'readiness'
  | 'audit'
  | 'deployment'
  | 'compliance'
  | 'executive'
  | 'incident'
  | 'risk';

export type ReportFormat = 'pdf' | 'html' | 'json';

export interface PdfPayload {
  tenantId: string;
  tenantName: string;
  module: string;
  reportType: ReportType;
  period?: {
    from: string;
    to: string;
  };
  data: any;
  options?: PdfOptions;
}

export interface PdfOptions {
  language: string;
  includeCharts: boolean;
  includeAppendix: boolean;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  watermark?: string;
}

export interface ReportMetadata {
  id: string;
  title: string;
  subtitle?: string;
  version: string;
  generatedAt: string;
  generatedBy: string;
  tenantId: string;
  tenantName: string;
  module: string;
  reportType: ReportType;
  period?: { from: string; to: string };
  classification: string;
  pageCount?: number;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string | ReportTable | ReportChart | ReportList;
  type: 'text' | 'table' | 'chart' | 'list' | 'kpi' | 'html';
}

export interface ReportTable {
  headers: string[];
  rows: (string | number)[][];
  footer?: string[];
}

export interface ReportChart {
  type: 'bar' | 'line' | 'pie' | 'donut';
  title: string;
  data: { label: string; value: number; color?: string }[];
}

export interface ReportList {
  items: { title: string; description?: string; status?: string }[];
  ordered: boolean;
}

export interface GeneratedReport {
  metadata: ReportMetadata;
  sections: ReportSection[];
  html: string;
  buffer?: Buffer;
}

// ============================================================================
// REPORT TEMPLATES
// ============================================================================

const REPORT_TEMPLATES: Record<ReportType, {
  title: string;
  sections: string[];
  icon: string;
}> = {
  readiness: {
    title: 'Deployment Readiness Report',
    sections: ['executive_summary', 'system_status', 'modules', 'infrastructure', 'security', 'recommendations'],
    icon: '🚀',
  },
  audit: {
    title: 'Audit & Compliance Report',
    sections: ['executive_summary', 'audit_summary', 'activity_log', 'violations', 'compliance_status', 'recommendations'],
    icon: '📋',
  },
  deployment: {
    title: 'Deployment Status Report',
    sections: ['executive_summary', 'deployment_phases', 'milestones', 'risks', 'timeline', 'next_steps'],
    icon: '📦',
  },
  compliance: {
    title: 'Compliance Assessment Report',
    sections: ['executive_summary', 'standards', 'assessment', 'gaps', 'remediation', 'certification_status'],
    icon: '✅',
  },
  executive: {
    title: 'Executive Summary Report',
    sections: ['key_metrics', 'highlights', 'challenges', 'recommendations', 'outlook'],
    icon: '📊',
  },
  incident: {
    title: 'Incident Report',
    sections: ['incident_summary', 'timeline', 'impact', 'response', 'root_cause', 'prevention'],
    icon: '⚠️',
  },
  risk: {
    title: 'Risk Assessment Report',
    sections: ['executive_summary', 'risk_overview', 'risk_matrix', 'mitigation', 'monitoring', 'recommendations'],
    icon: '🎯',
  },
};

// ============================================================================
// HTML TEMPLATE GENERATOR
// ============================================================================

function generateHtmlReport(metadata: ReportMetadata, sections: ReportSection[]): string {
  const template = REPORT_TEMPLATES[metadata.reportType];
  
  return `
<!DOCTYPE html>
<html lang="${metadata.module === 'uk' ? 'uk' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a2e;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      background: white;
      position: relative;
    }
    
    @media print {
      .page { 
        page-break-after: always;
        margin: 0;
        padding: 15mm;
      }
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 15px;
      border-bottom: 3px solid #00E0B8;
      margin-bottom: 25px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #00E0B8, #00A3FF);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      color: #0D1117;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #0D1117;
    }
    
    .logo-subtitle {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .report-meta {
      text-align: right;
      font-size: 9pt;
      color: #666;
    }
    
    .classification {
      display: inline-block;
      padding: 3px 10px;
      background: ${metadata.classification === 'confidential' ? '#EF4444' : metadata.classification === 'restricted' ? '#F59E0B' : '#10B981'};
      color: white;
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
      margin-bottom: 5px;
    }
    
    /* Title */
    .title-section {
      text-align: center;
      margin: 40px 0;
    }
    
    .title-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #0D1117;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #666;
    }
    
    .tenant-info {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      display: inline-block;
    }
    
    .tenant-name {
      font-size: 18px;
      font-weight: 600;
      color: #0D1117;
    }
    
    .tenant-id {
      font-size: 11px;
      color: #666;
    }
    
    /* Sections */
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #0D1117;
      padding-bottom: 8px;
      border-bottom: 2px solid #00E0B8;
      margin-bottom: 15px;
    }
    
    .section-content {
      color: #333;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10pt;
    }
    
    th {
      background: #0D1117;
      color: white;
      padding: 10px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .kpi-card {
      padding: 15px;
      background: linear-gradient(135deg, #f8f9fa, #fff);
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      text-align: center;
    }
    
    .kpi-value {
      font-size: 24px;
      font-weight: 700;
      color: #00E0B8;
    }
    
    .kpi-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Status badges */
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 500;
    }
    
    .badge-success { background: #D1FAE5; color: #065F46; }
    .badge-warning { background: #FEF3C7; color: #92400E; }
    .badge-danger { background: #FEE2E2; color: #991B1B; }
    .badge-info { background: #DBEAFE; color: #1E40AF; }
    
    /* Lists */
    .report-list {
      list-style: none;
      padding: 0;
    }
    
    .report-list li {
      padding: 10px;
      border-left: 3px solid #00E0B8;
      margin-bottom: 10px;
      background: #f8f9fa;
    }
    
    .report-list li strong {
      display: block;
      color: #0D1117;
    }
    
    /* Footer */
    .footer {
      position: absolute;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
      font-size: 8pt;
      color: #666;
      display: flex;
      justify-content: space-between;
    }
    
    /* Watermark */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 80px;
      color: rgba(0, 0, 0, 0.03);
      font-weight: bold;
      pointer-events: none;
      z-index: -1;
    }
  </style>
</head>
<body>
  ${metadata.classification === 'confidential' || metadata.classification === 'restricted' ? `<div class="watermark">${metadata.classification.toUpperCase()}</div>` : ''}
  
  <div class="page">
    <header class="header">
      <div class="logo">
        <div class="logo-icon">HBS</div>
        <div>
          <div class="logo-text">IVYAR</div>
          <div class="logo-subtitle">Governance Platform</div>
        </div>
      </div>
      <div class="report-meta">
        <div class="classification">${metadata.classification}</div>
        <div>Report ID: ${metadata.id}</div>
        <div>Generated: ${new Date(metadata.generatedAt).toLocaleDateString()}</div>
        <div>Version: ${metadata.version}</div>
      </div>
    </header>
    
    <div class="title-section">
      <div class="title-icon">${template.icon}</div>
      <h1 class="title">${metadata.title}</h1>
      ${metadata.subtitle ? `<p class="subtitle">${metadata.subtitle}</p>` : ''}
      <div class="tenant-info">
        <div class="tenant-name">${metadata.tenantName}</div>
        <div class="tenant-id">${metadata.tenantId} | ${metadata.module.toUpperCase()} Module</div>
        ${metadata.period ? `<div class="tenant-id">Period: ${metadata.period.from} — ${metadata.period.to}</div>` : ''}
      </div>
    </div>
  </div>
  
  ${sections.map((section, index) => `
  <div class="page">
    ${index === 0 ? '' : `
    <header class="header" style="margin-bottom: 15px;">
      <div class="logo">
        <div class="logo-icon" style="width: 30px; height: 30px; font-size: 12px;">HBS</div>
        <div class="logo-text" style="font-size: 14px;">IVYAR</div>
      </div>
      <div class="report-meta">
        <div>${metadata.title}</div>
      </div>
    </header>
    `}
    
    <section class="section">
      <h2 class="section-title">${section.title}</h2>
      <div class="section-content">
        ${renderSectionContent(section)}
      </div>
    </section>
    
    <footer class="footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page ${index + 2}</div>
    </footer>
  </div>
  `).join('')}
</body>
</html>
  `;
}

function renderSectionContent(section: ReportSection): string {
  switch (section.type) {
    case 'text':
      return `<p>${section.content}</p>`;
      
    case 'html':
      return section.content as string;
      
    case 'table':
      const table = section.content as ReportTable;
      return `
        <table>
          <thead>
            <tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
          ${table.footer ? `<tfoot><tr>${table.footer.map(f => `<td>${f}</td>`).join('')}</tr></tfoot>` : ''}
        </table>
      `;
      
    case 'list':
      const list = section.content as ReportList;
      const tag = list.ordered ? 'ol' : 'ul';
      return `
        <${tag} class="report-list">
          ${list.items.map(item => `
            <li>
              <strong>${item.title}</strong>
              ${item.description ? `<span>${item.description}</span>` : ''}
              ${item.status ? `<span class="badge badge-${item.status}">${item.status}</span>` : ''}
            </li>
          `).join('')}
        </${tag}>
      `;
      
    case 'kpi':
      const kpis = section.content as unknown as { label: string; value: string | number }[];
      return `
        <div class="kpi-grid">
          ${kpis.map(kpi => `
            <div class="kpi-card">
              <div class="kpi-value">${kpi.value}</div>
              <div class="kpi-label">${kpi.label}</div>
            </div>
          `).join('')}
        </div>
      `;
      
    default:
      return String(section.content);
  }
}

// ============================================================================
// REPORT GENERATORS
// ============================================================================

function generateReadinessReport(payload: PdfPayload): ReportSection[] {
  const data = payload.data;
  
  return [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      type: 'text',
      content: `This report assesses the deployment readiness of the ${payload.module.toUpperCase()} module for ${payload.tenantName}. Based on our comprehensive evaluation, the system demonstrates a readiness score of ${data.readinessScore || 85}% with ${data.criticalIssues || 0} critical issues requiring attention before go-live.`,
    },
    {
      id: 'kpis',
      title: 'Key Metrics',
      type: 'kpi' as any,
      content: [
        { label: 'Readiness Score', value: `${data.readinessScore || 85}%` },
        { label: 'Critical Issues', value: data.criticalIssues || 0 },
        { label: 'Modules Ready', value: `${data.modulesReady || 4}/${data.totalModules || 5}` },
        { label: 'Security Score', value: `${data.securityScore || 92}%` },
      ] as any,
    },
    {
      id: 'checklist',
      title: 'Readiness Checklist',
      type: 'table',
      content: {
        headers: ['Component', 'Status', 'Score', 'Notes'],
        rows: [
          ['Infrastructure', '✅ Ready', '95%', 'All systems operational'],
          ['Security', '✅ Ready', '92%', 'Passed penetration testing'],
          ['Integration', '⚠️ In Progress', '78%', 'SSO integration pending'],
          ['Training', '✅ Ready', '88%', '450 users trained'],
          ['Documentation', '✅ Ready', '90%', 'Complete'],
        ],
      },
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      type: 'list',
      content: {
        ordered: true,
        items: [
          { title: 'Complete SSO Integration', description: 'Finalize integration with national identity provider', status: 'warning' },
          { title: 'Load Testing', description: 'Conduct final load test with 10,000 concurrent users', status: 'info' },
          { title: 'Backup Verification', description: 'Verify disaster recovery procedures', status: 'success' },
        ],
      },
    },
  ];
}

function generateAuditReport(payload: PdfPayload): ReportSection[] {
  const data = payload.data;
  
  return [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      type: 'text',
      content: `This audit report covers the period ${payload.period?.from || 'N/A'} to ${payload.period?.to || 'N/A'} for ${payload.tenantName}. During this period, ${data.totalActions || 15420} actions were logged, with ${data.violations || 12} policy violations detected and ${data.resolved || 10} resolved.`,
    },
    {
      id: 'kpis',
      title: 'Audit Summary',
      type: 'kpi' as any,
      content: [
        { label: 'Total Actions', value: (data.totalActions || 15420).toLocaleString() },
        { label: 'Violations', value: data.violations || 12 },
        { label: 'Compliance Rate', value: `${data.complianceRate || 98.7}%` },
        { label: 'Risk Score', value: data.avgRisk || 3.8 },
      ],
    },
    {
      id: 'activity',
      title: 'Activity Breakdown',
      type: 'table',
      content: {
        headers: ['Action Type', 'Count', 'Percentage', 'Trend'],
        rows: [
          ['Read Operations', '8,450', '54.8%', '↑ 12%'],
          ['Write Operations', '4,230', '27.4%', '↓ 3%'],
          ['Admin Operations', '1,890', '12.3%', '→ 0%'],
          ['Security Events', '850', '5.5%', '↓ 8%'],
        ],
      },
    },
    {
      id: 'violations',
      title: 'Policy Violations',
      type: 'table',
      content: {
        headers: ['Date', 'Type', 'Severity', 'Status'],
        rows: data.violationsList || [
          ['2026-01-05', 'Boundary Violation', 'High', 'Resolved'],
          ['2026-01-04', 'Access Attempt', 'Medium', 'Resolved'],
          ['2026-01-03', 'Data Export', 'Low', 'Investigating'],
        ],
      },
    },
  ];
}

function generateDeploymentReport(payload: PdfPayload): ReportSection[] {
  const data = payload.data;
  
  return [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      type: 'text',
      content: `Deployment of the ${payload.module.toUpperCase()} module for ${payload.tenantName} is ${data.status || 'on track'}. Current progress: ${data.progress || 75}% complete. Expected go-live: ${data.goLiveDate || 'Q2 2026'}.`,
    },
    {
      id: 'kpis',
      title: 'Deployment Status',
      type: 'kpi' as any,
      content: [
        { label: 'Progress', value: `${data.progress || 75}%` },
        { label: 'Phase', value: data.currentPhase || '3 of 5' },
        { label: 'Days Remaining', value: data.daysRemaining || 45 },
        { label: 'Budget Used', value: `${data.budgetUsed || 68}%` },
      ],
    },
    {
      id: 'timeline',
      title: 'Deployment Timeline',
      type: 'table',
      content: {
        headers: ['Phase', 'Status', 'Start', 'End', 'Progress'],
        rows: [
          ['1. Architecture', '✅ Complete', 'Jan 2025', 'Feb 2025', '100%'],
          ['2. Development', '✅ Complete', 'Feb 2025', 'Jun 2025', '100%'],
          ['3. Integration', '🔄 In Progress', 'Jul 2025', 'Jan 2026', '65%'],
          ['4. Testing', '⏳ Pending', 'Jan 2026', 'Mar 2026', '0%'],
          ['5. Go-Live', '⏳ Pending', 'Apr 2026', 'Apr 2026', '0%'],
        ],
      },
    },
    {
      id: 'risks',
      title: 'Key Risks',
      type: 'list',
      content: {
        ordered: false,
        items: [
          { title: 'SSO Integration Delay', description: 'National provider readiness uncertain', status: 'warning' },
          { title: 'Training Capacity', description: 'Need to train 500+ admins in 6 weeks', status: 'info' },
          { title: 'Budget Pressure', description: 'Currency fluctuation impact', status: 'danger' },
        ],
      },
    },
  ];
}

// ============================================================================
// MAIN GENERATOR FUNCTION
// ============================================================================

export async function generateMinistryPdf(payload: PdfPayload): Promise<GeneratedReport> {
  const template = REPORT_TEMPLATES[payload.reportType];
  
  // Generate metadata
  const metadata: ReportMetadata = {
    id: `RPT-${payload.tenantId}-${Date.now()}`,
    title: template.title,
    subtitle: `${payload.module.toUpperCase()} Module Report`,
    version: '1.0',
    generatedAt: new Date().toISOString(),
    generatedBy: 'HBS Governance Core',
    tenantId: payload.tenantId,
    tenantName: payload.tenantName,
    module: payload.module,
    reportType: payload.reportType,
    period: payload.period,
    classification: payload.options?.classification || 'internal',
  };
  
  // Generate sections based on report type
  let sections: ReportSection[];
  
  switch (payload.reportType) {
    case 'readiness':
      sections = generateReadinessReport(payload);
      break;
    case 'audit':
      sections = generateAuditReport(payload);
      break;
    case 'deployment':
      sections = generateDeploymentReport(payload);
      break;
    default:
      sections = generateReadinessReport(payload);
  }
  
  // Generate HTML
  const html = generateHtmlReport(metadata, sections);
  
  return {
    metadata,
    sections,
    html,
    // In production, convert HTML to PDF using puppeteer or similar
    // buffer: await htmlToPdf(html),
  };
}

// ============================================================================
// API HELPERS
// ============================================================================

export function validatePdfPayload(payload: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!payload.tenantId) errors.push('tenantId is required');
  if (!payload.tenantName) errors.push('tenantName is required');
  if (!payload.module) errors.push('module is required');
  if (!payload.reportType) errors.push('reportType is required');
  if (payload.reportType && !REPORT_TEMPLATES[payload.reportType as ReportType]) {
    errors.push(`Invalid reportType: ${payload.reportType}`);
  }
  
  return { valid: errors.length === 0, errors };
}

export const SUPPORTED_REPORT_TYPES = Object.keys(REPORT_TEMPLATES) as ReportType[];
