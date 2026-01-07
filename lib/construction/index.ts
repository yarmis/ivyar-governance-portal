/**
 * Construction Governance Hub - Module Index
 * National Digital Module for Transparent, Safe, and Accountable Construction Governance
 * 
 * @module ConstructionGovernanceHub
 * @version 2.0.0
 * @author IVYAR/HBS Architecture Team
 */

// Re-export all from main engine
export * from './governance-hub';

// Module metadata
export const MODULE_INFO = {
  id: 'construction-governance-hub',
  name: 'Construction Governance Hub',
  version: '2.0.0',
  description: 'National Digital Module for Transparent, Safe, and Accountable Construction Governance',
  author: 'IVYAR/HBS Architecture Team',
  
  // Core capabilities
  capabilities: {
    projectRegistry: {
      enabled: true,
      description: 'Unified database of all construction projects with lifecycle tracking'
    },
    parcelIntegration: {
      enabled: true,
      description: 'Automatic validation of cadastral data, zoning rules, and restrictions'
    },
    digitalPermits: {
      enabled: true,
      description: 'Full workflow: draft → submission → review → approval → revocation'
    },
    inspectionsManagement: {
      enabled: true,
      description: 'Scheduling, mobile inspections, photo/video evidence, AI anomaly detection'
    },
    contractorRegistry: {
      enabled: true,
      description: 'Licensing, violations history, trust index, insurance verification'
    },
    materialsCertification: {
      enabled: true,
      description: 'Tracking of certified materials, suppliers, and quality scores'
    },
    financialTransparency: {
      enabled: true,
      description: 'AI-based anomaly detection, donor reporting, expenditure tracking'
    },
    aiRiskScoring: {
      enabled: true,
      description: 'Automated risk assessment for corruption, delays, safety, compliance'
    },
    governanceEngine: {
      enabled: true,
      description: 'Approve/reject decisions with immutable audit logs and escalations'
    },
    commissioningWorkflow: {
      enabled: true,
      description: 'End-to-end commissioning with certificate generation and national registry'
    }
  },

  // API endpoints
  endpoints: {
    base: '/api/construction',
    dashboard: '/api/construction?action=get_dashboard_metrics',
    heatmap: '/api/construction?action=get_regional_heatmap',
    permits: '/api/construction?action=get_permit_pipeline',
    projects: '/api/construction?action=get_risk_projects',
    inspections: '/api/construction?action=get_recent_inspections',
    anomalies: '/api/construction?action=get_financial_anomalies',
    contractors: '/api/construction?action=get_contractor_trust'
  },

  // User roles
  roles: [
    {
      id: 'developer',
      name: 'Developer',
      description: 'Project owners who submit permits and track construction',
      permissions: ['submit_project', 'view_own_projects', 'upload_documents', 'request_commissioning']
    },
    {
      id: 'inspector',
      name: 'Inspector',
      description: 'Field inspectors who conduct on-site inspections',
      permissions: ['conduct_inspections', 'view_projects', 'update_inspections', 'upload_evidence']
    },
    {
      id: 'regulator',
      name: 'Regulator',
      description: 'Regulatory officials who review and approve permits',
      permissions: ['review_permits', 'approve_permits', 'reject_permits', 'view_all_projects']
    },
    {
      id: 'municipality',
      name: 'Municipality',
      description: 'Local government officials managing regional projects',
      permissions: ['manage_local_projects', 'review_permits', 'manage_inspections', 'view_regional_data']
    },
    {
      id: 'ministry',
      name: 'Ministry',
      description: 'National-level officials with full oversight',
      permissions: ['national_overview', 'policy_management', 'approve_commissioning', 'system_configuration']
    },
    {
      id: 'donor',
      name: 'Donor',
      description: 'International donors and financial institutions',
      permissions: ['view_donor_projects', 'view_financial_reports', 'view_transparency_dashboard']
    },
    {
      id: 'contractor',
      name: 'Contractor',
      description: 'Construction contractors assigned to projects',
      permissions: ['view_assigned_projects', 'update_progress', 'manage_materials', 'view_inspections']
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'System administrators with full access',
      permissions: ['full_access']
    }
  ],

  // Compliance standards
  complianceStandards: [
    'National Building Code 2024',
    'Environmental Protection Act',
    'Fire Safety Regulations',
    'Accessibility Standards',
    'Structural Integrity Code',
    'Anti-Corruption Framework',
    'Donor Transparency Requirements (World Bank, EBRD, EU)',
    'FMCSA-equivalent Construction Regulations'
  ],

  // Deployment phases
  deploymentPhases: [
    {
      phase: 1,
      name: 'Pilot Region',
      description: 'Limited permits, selected municipalities, core workflows',
      duration: '3-6 months'
    },
    {
      phase: 2,
      name: 'National Rollout',
      description: 'Full permit catalog, all regions, integration with national registries',
      duration: '6-12 months'
    },
    {
      phase: 3,
      name: 'Donor Integration',
      description: 'Dedicated dashboards, compliance reporting, cross-border standards',
      duration: '12-18 months'
    }
  ],

  // UI configuration
  ui: {
    primaryColor: '#1A4B9A',
    secondaryColor: '#2F6BCF',
    accentColor: '#E8F0FB',
    fontFamily: 'Inter, system-ui, sans-serif',
    dashboardWidgets: [
      'metricsRow',
      'riskHeatmap',
      'permitPipeline',
      'highRiskProjects',
      'recentInspections',
      'financialAnomalies',
      'contractorTrustIndex',
      'aiInsights'
    ]
  }
};

// Default export
export default MODULE_INFO;
