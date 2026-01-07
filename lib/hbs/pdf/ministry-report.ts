// lib/hbs/pdf/ministry-report.ts
// HBS Ministry Governance Report Generator v2.0

// ============================================================================
// TYPES
// ============================================================================

export interface MinistryReportData {
  tenant: {
    id: string;
    name: string;
    fullName: string;
    type: 'country' | 'ministry' | 'program' | 'donor';
    flag: string;
    countryCode: string;
    scope: 'national' | 'regional' | 'pilot';
    modules: string[];
  };
  period: {
    from: string;
    to: string;
  };
  governance: {
    score: number;
    previousScore: number;
    trend: 'improving' | 'stable' | 'declining';
    ranking: number;
    totalTenants: number;
  };
  incidents: {
    total: number;
    highRisk: number;
    resolved: number;
    pending: number;
    avgResolutionHours: number;
    byModule: { module: string; count: number; severity: string }[];
    topIncidents: {
      id: string;
      date: string;
      module: string;
      type: string;
      severity: string;
      status: string;
      description: string;
    }[];
  };
  policies: {
    total: number;
    compliant: number;
    violations: number;
    compliance: {
      access: { score: number; status: string; issues: string[] };
      ethics: { score: number; status: string; issues: string[] };
      risk: { score: number; status: string; issues: string[] };
      audit: { score: number; status: string; issues: string[] };
      data: { score: number; status: string; issues: string[] };
    };
  };
  analytics: {
    decisionsTotal: number;
    decisionsAvgPerDay: number;
    usersActive: number;
    usersTotal: number;
    riskTrend: { date: string; score: number }[];
    moduleUsage: { module: string; usage: number }[];
  };
  recommendations: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    deadline?: string;
  }[];
  generatedBy: string;
  generatedAt: string;
  reportId: string;
  version: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

// ============================================================================
// HTML TEMPLATE
// ============================================================================

export function generateMinistryReportHTML(data: MinistryReportData): string {
  const {
    tenant,
    period,
    governance,
    incidents,
    policies,
    analytics,
    recommendations,
    generatedBy,
    generatedAt,
    reportId,
    version,
    classification,
  } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return '#10B981';
      case 'yellow': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getScoreStatus = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: '#EF4444',
      high: '#F97316',
      medium: '#F59E0B',
      low: '#10B981',
    };
    return `<span style="background: ${colors[severity] || '#6B7280'}20; color: ${colors[severity] || '#6B7280'}; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase;">${severity}</span>`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ministry Governance Report - ${tenant.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
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
      margin: 0 auto 10mm;
      background: white;
      position: relative;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    @media print {
      body { background: white; }
      .page {
        page-break-after: always;
        margin: 0;
        padding: 15mm;
        box-shadow: none;
      }
      .no-print { display: none; }
    }
    
    /* ========== COVER PAGE ========== */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: calc(297mm - 40mm);
    }
    
    .cover-header {
      text-align: center;
      padding-top: 40px;
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00E0B8, #00A3FF);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: #0D1117;
    }
    
    .cover-title {
      font-size: 36px;
      font-weight: 700;
      color: #0D1117;
      margin-bottom: 10px;
    }
    
    .cover-subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 60px;
    }
    
    .cover-tenant {
      background: linear-gradient(135deg, #f8f9fa, #fff);
      border: 2px solid #e0e0e0;
      border-radius: 16px;
      padding: 30px;
      display: inline-block;
    }
    
    .tenant-flag {
      font-size: 64px;
      margin-bottom: 15px;
    }
    
    .tenant-name {
      font-size: 24px;
      font-weight: 700;
      color: #0D1117;
    }
    
    .tenant-id {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    
    .cover-period {
      margin-top: 40px;
      font-size: 16px;
      color: #666;
    }
    
    .cover-period strong {
      color: #0D1117;
    }
    
    .cover-footer {
      text-align: center;
      padding-bottom: 20px;
    }
    
    .classification-badge {
      display: inline-block;
      padding: 8px 20px;
      background: ${classification === 'confidential' ? '#EF4444' : classification === 'restricted' ? '#F59E0B' : '#10B981'};
      color: white;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    
    .cover-meta {
      font-size: 11px;
      color: #999;
    }
    
    /* ========== PAGE HEADER ========== */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      border-bottom: 2px solid #00E0B8;
      margin-bottom: 25px;
    }
    
    .page-header-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .page-header-logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #00E0B8, #00A3FF);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: #0D1117;
    }
    
    .page-header-title {
      font-size: 14px;
      font-weight: 600;
      color: #0D1117;
    }
    
    .page-header-meta {
      text-align: right;
      font-size: 10px;
      color: #666;
    }
    
    /* ========== SECTIONS ========== */
    .section {
      margin-bottom: 30px;
    }
    
    .section-number {
      display: inline-block;
      width: 30px;
      height: 30px;
      background: #0D1117;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      font-weight: 600;
      margin-right: 10px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #0D1117;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    
    .section-content {
      color: #333;
    }
    
    /* ========== KPI CARDS ========== */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .kpi-card {
      padding: 20px;
      background: linear-gradient(135deg, #f8f9fa, #fff);
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      text-align: center;
    }
    
    .kpi-value {
      font-size: 32px;
      font-weight: 700;
      color: #00E0B8;
    }
    
    .kpi-value.warning { color: #F59E0B; }
    .kpi-value.danger { color: #EF4444; }
    .kpi-value.blue { color: #00A3FF; }
    
    .kpi-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 5px;
    }
    
    .kpi-change {
      font-size: 10px;
      margin-top: 5px;
    }
    
    .kpi-change.positive { color: #10B981; }
    .kpi-change.negative { color: #EF4444; }
    
    /* ========== TABLES ========== */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10pt;
    }
    
    th {
      background: #0D1117;
      color: white;
      padding: 12px 10px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 12px 10px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    /* ========== COMPLIANCE HEATMAP ========== */
    .heatmap {
      display: grid;
      grid-template-columns: 120px repeat(5, 1fr);
      gap: 2px;
      margin: 20px 0;
    }
    
    .heatmap-header {
      background: #0D1117;
      color: white;
      padding: 10px;
      font-size: 10px;
      font-weight: 600;
      text-align: center;
    }
    
    .heatmap-label {
      background: #f8f9fa;
      padding: 10px;
      font-size: 11px;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
    
    .heatmap-cell {
      padding: 15px 10px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color: white;
      border-radius: 4px;
    }
    
    .heatmap-cell.green { background: #10B981; }
    .heatmap-cell.yellow { background: #F59E0B; }
    .heatmap-cell.red { background: #EF4444; }
    
    /* ========== RISK CHART ========== */
    .risk-chart {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .risk-chart-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .risk-bars {
      display: flex;
      align-items: flex-end;
      height: 120px;
      gap: 10px;
    }
    
    .risk-bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .risk-bar {
      width: 100%;
      background: linear-gradient(180deg, #00E0B8, #00A3FF);
      border-radius: 4px 4px 0 0;
      min-height: 10px;
    }
    
    .risk-bar-label {
      font-size: 9px;
      color: #666;
      margin-top: 5px;
      text-align: center;
    }
    
    .risk-bar-value {
      font-size: 10px;
      font-weight: 600;
      color: #0D1117;
      margin-bottom: 5px;
    }
    
    /* ========== RECOMMENDATIONS ========== */
    .recommendation {
      display: flex;
      gap: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 10px;
      border-left: 4px solid #00E0B8;
    }
    
    .recommendation.critical { border-left-color: #EF4444; }
    .recommendation.high { border-left-color: #F97316; }
    .recommendation.medium { border-left-color: #F59E0B; }
    
    .recommendation-number {
      width: 28px;
      height: 28px;
      background: #0D1117;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    .recommendation-content {
      flex: 1;
    }
    
    .recommendation-title {
      font-size: 13px;
      font-weight: 600;
      color: #0D1117;
      margin-bottom: 5px;
    }
    
    .recommendation-description {
      font-size: 11px;
      color: #666;
    }
    
    .recommendation-deadline {
      font-size: 10px;
      color: #F59E0B;
      margin-top: 5px;
    }
    
    /* ========== FOOTER ========== */
    .page-footer {
      position: absolute;
      bottom: 15mm;
      left: 20mm;
      right: 20mm;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
      font-size: 9px;
      color: #666;
      display: flex;
      justify-content: space-between;
    }
    
    /* ========== SUMMARY BOX ========== */
    .summary-box {
      background: linear-gradient(135deg, #0D1117, #1a2332);
      color: white;
      padding: 25px;
      border-radius: 12px;
      margin: 20px 0;
    }
    
    .summary-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #00E0B8;
    }
    
    .summary-text {
      font-size: 12px;
      line-height: 1.8;
    }
    
    /* ========== TENANT INFO BOX ========== */
    .tenant-info-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .tenant-info-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    
    .tenant-info-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .tenant-info-value {
      font-size: 14px;
      font-weight: 600;
      color: #0D1117;
      margin-top: 5px;
    }
    
    /* ========== ANNEX ========== */
    .annex-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .annex-title {
      font-size: 12px;
      font-weight: 600;
      color: #0D1117;
      margin-bottom: 10px;
    }
    
    .annex-list {
      font-size: 11px;
      color: #666;
    }
    
    .annex-list li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <!-- ================================================================ -->
  <!-- PAGE 1: COVER -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="cover">
      <div class="cover-header">
        <div class="logo-container">
          <div class="logo">HBS</div>
        </div>
        <h1 class="cover-title">Ministry Governance Report</h1>
        <p class="cover-subtitle">Comprehensive Governance Assessment & Analytics</p>
        
        <div class="cover-tenant">
          <div class="tenant-flag">${tenant.flag}</div>
          <div class="tenant-name">${tenant.fullName}</div>
          <div class="tenant-id">${tenant.id} | ${tenant.type.toUpperCase()} | ${tenant.scope.toUpperCase()}</div>
        </div>
        
        <div class="cover-period">
          <strong>Reporting Period:</strong> ${formatDate(period.from)} — ${formatDate(period.to)}
        </div>
      </div>
      
      <div class="cover-footer">
        <div class="classification-badge">${classification}</div>
        <div class="cover-meta">
          Report ID: ${reportId}<br>
          Generated: ${formatDate(generatedAt)} by ${generatedBy}<br>
          Version: ${version}
        </div>
      </div>
    </div>
  </div>
  
  <!-- ================================================================ -->
  <!-- PAGE 2: EXECUTIVE SUMMARY -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">
        ${tenant.name}<br>
        ${formatDate(period.from)} — ${formatDate(period.to)}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">1</span> Executive Summary</h2>
      
      <div class="summary-box">
        <div class="summary-title">Overall Assessment</div>
        <div class="summary-text">
          During the reporting period, <strong>${tenant.name}</strong> achieved a governance score of 
          <strong>${governance.score}/100</strong> (${governance.trend === 'improving' ? '↑ improving' : governance.trend === 'declining' ? '↓ declining' : '→ stable'} from ${governance.previousScore}).
          
          The organization processed <strong>${analytics.decisionsTotal.toLocaleString()}</strong> governance decisions
          with an average of <strong>${analytics.decisionsAvgPerDay}</strong> decisions per day.
          
          <strong>${incidents.total}</strong> incidents were recorded, of which <strong>${incidents.highRisk}</strong> were classified as high-risk.
          The average incident resolution time was <strong>${incidents.avgResolutionHours} hours</strong>.
          
          Policy compliance rate stands at <strong>${Math.round((policies.compliant / policies.total) * 100)}%</strong> with 
          <strong>${policies.violations}</strong> violations detected and addressed.
        </div>
      </div>
      
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value ${governance.score >= 80 ? '' : governance.score >= 60 ? 'warning' : 'danger'}">${governance.score}</div>
          <div class="kpi-label">Governance Score</div>
          <div class="kpi-change ${governance.trend === 'improving' ? 'positive' : governance.trend === 'declining' ? 'negative' : ''}">
            ${governance.trend === 'improving' ? '↑' : governance.trend === 'declining' ? '↓' : '→'} from ${governance.previousScore}
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value ${incidents.highRisk > 10 ? 'danger' : incidents.highRisk > 5 ? 'warning' : ''}">${incidents.total}</div>
          <div class="kpi-label">Total Incidents</div>
          <div class="kpi-change">${incidents.highRisk} high-risk</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value ${policies.violations > 20 ? 'danger' : policies.violations > 10 ? 'warning' : ''}">${policies.violations}</div>
          <div class="kpi-label">Policy Violations</div>
          <div class="kpi-change">${policies.total} policies</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value blue">${incidents.avgResolutionHours}h</div>
          <div class="kpi-label">Avg Resolution</div>
          <div class="kpi-change">${incidents.resolved} resolved</div>
        </div>
      </div>
    </div>
    
    <div class="page-footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page 2 of 7</div>
    </div>
  </div>
  
  <!-- ================================================================ -->
  <!-- PAGE 3: TENANT OVERVIEW -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">
        ${tenant.name}<br>
        ${formatDate(period.from)} — ${formatDate(period.to)}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">2</span> Tenant Overview</h2>
      
      <div class="tenant-info-box">
        <div class="tenant-info-item">
          <div class="tenant-info-label">Organization Name</div>
          <div class="tenant-info-value">${tenant.fullName}</div>
        </div>
        <div class="tenant-info-item">
          <div class="tenant-info-label">Tenant ID</div>
          <div class="tenant-info-value">${tenant.id}</div>
        </div>
        <div class="tenant-info-item">
          <div class="tenant-info-label">Type</div>
          <div class="tenant-info-value" style="text-transform: capitalize;">${tenant.type}</div>
        </div>
        <div class="tenant-info-item">
          <div class="tenant-info-label">Scope</div>
          <div class="tenant-info-value" style="text-transform: capitalize;">${tenant.scope}</div>
        </div>
        <div class="tenant-info-item">
          <div class="tenant-info-label">Country</div>
          <div class="tenant-info-value">${tenant.flag} ${tenant.countryCode}</div>
        </div>
        <div class="tenant-info-item">
          <div class="tenant-info-label">Governance Ranking</div>
          <div class="tenant-info-value">#${governance.ranking} of ${governance.totalTenants}</div>
        </div>
      </div>
      
      <h3 style="font-size: 14px; font-weight: 600; margin: 25px 0 15px;">Active Modules</h3>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Status</th>
            <th>Usage</th>
            <th>Incidents</th>
          </tr>
        </thead>
        <tbody>
          ${tenant.modules.map(mod => {
            const moduleIncidents = incidents.byModule.find(m => m.module.toLowerCase() === mod.toLowerCase());
            const moduleUsage = analytics.moduleUsage.find(m => m.module.toLowerCase() === mod.toLowerCase());
            return `
            <tr>
              <td><strong>${mod.charAt(0).toUpperCase() + mod.slice(1)}</strong></td>
              <td><span style="color: #10B981;">● Active</span></td>
              <td>${moduleUsage?.usage || 0}%</td>
              <td>${moduleIncidents?.count || 0}</td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      
      <h3 style="font-size: 14px; font-weight: 600; margin: 25px 0 15px;">User Statistics</h3>
      <div class="kpi-grid" style="grid-template-columns: repeat(2, 1fr);">
        <div class="kpi-card">
          <div class="kpi-value blue">${analytics.usersActive.toLocaleString()}</div>
          <div class="kpi-label">Active Users</div>
          <div class="kpi-change">${Math.round((analytics.usersActive / analytics.usersTotal) * 100)}% of total</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">${analytics.usersTotal.toLocaleString()}</div>
          <div class="kpi-label">Total Users</div>
          <div class="kpi-change">Registered</div>
        </div>
      </div>
    </div>
    
    <div class="page-footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page 3 of 7</div>
    </div>
  </div>
  
  <!-- ================================================================ -->
  <!-- PAGE 4: GOVERNANCE ANALYTICS -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">
        ${tenant.name}<br>
        ${formatDate(period.from)} — ${formatDate(period.to)}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">3</span> Governance Analytics</h2>
      
      <div class="risk-chart">
        <div class="risk-chart-title">Risk Level Over Time</div>
        <div class="risk-bars">
          ${analytics.riskTrend.map(point => {
            const height = Math.max(10, (point.score / 10) * 100);
            return `
            <div class="risk-bar-container">
              <div class="risk-bar-value">${point.score.toFixed(1)}</div>
              <div class="risk-bar" style="height: ${height}px;"></div>
              <div class="risk-bar-label">${point.date}</div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <h3 style="font-size: 14px; font-weight: 600; margin: 25px 0 15px;">Incidents by Module</h3>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Total</th>
            <th>High Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${incidents.byModule.map(m => `
          <tr>
            <td><strong>${m.module}</strong></td>
            <td>${m.count}</td>
            <td>${getSeverityBadge(m.severity)}</td>
            <td><span style="color: ${m.count > 5 ? '#F59E0B' : '#10B981'};">${m.count > 5 ? 'Needs Attention' : 'Normal'}</span></td>
          </tr>
          `).join('')}
        </tbody>
      </table>
      
      <h3 style="font-size: 14px; font-weight: 600; margin: 25px 0 15px;">Recent Incidents</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Module</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${incidents.topIncidents.slice(0, 5).map(inc => `
          <tr>
            <td>${formatDate(inc.date)}</td>
            <td>${inc.module}</td>
            <td style="text-transform: capitalize;">${inc.type}</td>
            <td>${getSeverityBadge(inc.severity)}</td>
            <td style="text-transform: capitalize;">${inc.status}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="page-footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page 4 of 7</div>
    </div>
  </div>
  
  <!-- ================================================================ -->
  <!-- PAGE 5: POLICY COMPLIANCE -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">
        ${tenant.name}<br>
        ${formatDate(period.from)} — ${formatDate(period.to)}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">4</span> Policy Compliance</h2>
      
      <p style="margin-bottom: 20px; color: #666;">
        Assessment of compliance across five policy domains. 
        <span style="color: #10B981;">Green ≥90%</span> | 
        <span style="color: #F59E0B;">Yellow ≥70%</span> | 
        <span style="color: #EF4444;">Red &lt;70%</span>
      </p>
      
      <div class="heatmap">
        <div class="heatmap-header"></div>
        <div class="heatmap-header">Access</div>
        <div class="heatmap-header">Ethics</div>
        <div class="heatmap-header">Risk</div>
        <div class="heatmap-header">Audit</div>
        <div class="heatmap-header">Data</div>
        
        <div class="heatmap-label">${tenant.name}</div>
        <div class="heatmap-cell ${policies.compliance.access.status}">${policies.compliance.access.score}%</div>
        <div class="heatmap-cell ${policies.compliance.ethics.status}">${policies.compliance.ethics.score}%</div>
        <div class="heatmap-cell ${policies.compliance.risk.status}">${policies.compliance.risk.score}%</div>
        <div class="heatmap-cell ${policies.compliance.audit.status}">${policies.compliance.audit.score}%</div>
        <div class="heatmap-cell ${policies.compliance.data.status}">${policies.compliance.data.score}%</div>
      </div>
      
      <h3 style="font-size: 14px; font-weight: 600; margin: 25px 0 15px;">Compliance Details</h3>
      
      ${Object.entries(policies.compliance).map(([key, value]) => `
      <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid ${getStatusColor(value.status)};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="text-transform: capitalize;">${key} Policy</strong>
          <span style="font-size: 18px; font-weight: 700; color: ${getStatusColor(value.status)};">${value.score}%</span>
        </div>
        ${value.issues.length > 0 ? `
        <div style="font-size: 11px; color: #666;">
          <strong>Issues:</strong> ${value.issues.join(', ')}
        </div>
        ` : `
        <div style="font-size: 11px; color: #10B981;">No issues detected</div>
        `}
      </div>
      `).join('')}
    </div>
    
    <div class="page-footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page 5 of 7</div>
    </div>
  </div>
  
  <!-- ================================================================ -->
  <!-- PAGE 6: RECOMMENDATIONS -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">
        ${tenant.name}<br>
        ${formatDate(period.from)} — ${formatDate(period.to)}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">5</span> Recommendations</h2>
      
      <p style="margin-bottom: 20px; color: #666;">
        Based on the governance assessment, the following actions are recommended to improve compliance and reduce risk.
      </p>
      
      ${recommendations.map((rec, idx) => `
      <div class="recommendation ${rec.priority}">
        <div class="recommendation-number">${idx + 1}</div>
        <div class="recommendation-content">
          <div class="recommendation-title">${rec.title}</div>
          <div class="recommendation-description">${rec.description}</div>
          ${rec.deadline ? `<div class="recommendation-deadline">⏰ Deadline: ${formatDate(rec.deadline)}</div>` : ''}
        </div>
      </div>
      `).join('')}
    </div>
    
    <div class="page-footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page 6 of 7</div>
    </div>
  </div>
  
  <!-- ================================================================ -->
  <!-- PAGE 7: ANNEX -->
  <!-- ================================================================ -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <div class="page-header-logo-icon">HBS</div>
        <div class="page-header-title">Ministry Governance Report</div>
      </div>
      <div class="page-header-meta">
        ${tenant.name}<br>
        ${formatDate(period.from)} — ${formatDate(period.to)}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><span class="section-number">6</span> Annex: Technical Notes</h2>
      
      <div class="annex-section">
        <div class="annex-title">Data Collection Methodology</div>
        <ul class="annex-list">
          <li>Data collected from HBS Governance Core API endpoints</li>
          <li>Risk scores calculated using weighted 6-factor assessment model</li>
          <li>Incident data aggregated from all active modules</li>
          <li>Policy compliance calculated as percentage of rules passed</li>
        </ul>
      </div>
      
      <div class="annex-section">
        <div class="annex-title">Modules Included</div>
        <ul class="annex-list">
          ${tenant.modules.map(m => `<li>${m.charAt(0).toUpperCase() + m.slice(1)} Module</li>`).join('')}
        </ul>
      </div>
      
      <div class="annex-section">
        <div class="annex-title">Governance Score Formula</div>
        <ul class="annex-list">
          <li>Access Policy: 25% weight</li>
          <li>Audit Policy: 25% weight</li>
          <li>Risk Management: 20% weight</li>
          <li>Ethics Compliance: 15% weight</li>
          <li>Data Protection: 15% weight</li>
        </ul>
      </div>
      
      <div class="annex-section">
        <div class="annex-title">Limitations</div>
        <ul class="annex-list">
          <li>Report covers only the specified reporting period</li>
          <li>Pending incidents may affect final statistics</li>
          <li>Third-party integrations not included in audit coverage</li>
        </ul>
      </div>
      
      <div class="annex-section">
        <div class="annex-title">Report Information</div>
        <ul class="annex-list">
          <li>Report ID: ${reportId}</li>
          <li>Generated: ${formatDate(generatedAt)} at ${new Date(generatedAt).toLocaleTimeString()}</li>
          <li>Generated by: ${generatedBy}</li>
          <li>Platform: HBS Governance Core v${version}</li>
          <li>Classification: ${classification.toUpperCase()}</li>
        </ul>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
      <div style="font-size: 12px; color: #666; margin-bottom: 10px;">End of Report</div>
      <div style="font-size: 24px; font-weight: 700; color: #0D1117;">🏛️ IVYAR</div>
      <div style="font-size: 11px; color: #666;">HBS Governance Platform</div>
      <div style="font-size: 10px; color: #999; margin-top: 10px;">Washington, USA | www.ivyar.org</div>
    </div>
    
    <div class="page-footer">
      <div>© 2024-2026 IVYAR. All rights reserved.</div>
      <div>Page 7 of 7</div>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================================================
// GENERATE REPORT FUNCTION
// ============================================================================

export async function generateMinistryReport(data: MinistryReportData): Promise<{
  html: string;
  reportId: string;
  pages: number;
}> {
  const html = generateMinistryReportHTML(data);
  
  return {
    html,
    reportId: data.reportId,
    pages: 7,
  };
}

// ============================================================================
// MOCK DATA GENERATOR (for testing)
// ============================================================================

export function createMockReportData(tenantId: string): MinistryReportData {
  const tenants: Record<string, any> = {
    'TEN-UA-001': { name: 'Ukraine MSPS', fullName: 'Ministry of Social Policy of Ukraine', flag: '🇺🇦', countryCode: 'UA' },
    'TEN-PL-001': { name: 'Poland MoD', fullName: 'Ministry of Digital Affairs of Poland', flag: '🇵🇱', countryCode: 'PL' },
    'TEN-GE-001': { name: 'Georgia MoJ', fullName: 'Ministry of Justice of Georgia', flag: '🇬🇪', countryCode: 'GE' },
    'TEN-MD-001': { name: 'Moldova MLSP', fullName: 'Ministry of Labor and Social Protection of Moldova', flag: '🇲🇩', countryCode: 'MD' },
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
    period: {
      from: '2025-12-01',
      to: '2025-12-31',
    },
    governance: {
      score: 87,
      previousScore: 82,
      trend: 'improving',
      ranking: 1,
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
        { id: 'INC-001', date: '2025-12-28', module: 'Access', type: 'policy', severity: 'high', status: 'resolved', description: 'Unauthorized access attempt' },
        { id: 'INC-002', date: '2025-12-25', module: 'Health', type: 'boundary', severity: 'medium', status: 'resolved', description: 'Consent workflow deviation' },
        { id: 'INC-003', date: '2025-12-22', module: 'Governance', type: 'risk', severity: 'high', status: 'investigating', description: 'High risk score detected' },
        { id: 'INC-004', date: '2025-12-20', module: 'Access', type: 'access', severity: 'low', status: 'resolved', description: 'Failed login attempts' },
        { id: 'INC-005', date: '2025-12-18', module: 'Health', type: 'ethics', severity: 'medium', status: 'open', description: 'Ethics consultation required' },
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
    classification: 'internal',
  };
}
