// lib/hbs/config/tenant-policies.ts
// HBS Multi-tenant Policy Configuration v1.0

// ============================================================================
// TYPES
// ============================================================================

export interface TenantPolicyConfig {
  tenantId: string;
  name: string;
  type: 'country' | 'ministry' | 'program' | 'donor';
  countryCode: string;
  scope: 'national' | 'regional' | 'pilot' | 'demo';
  modules: string[];
  policies: {
    access: AccessPolicyConfig;
    ethics: EthicsPolicyConfig;
    risk: RiskPolicyConfig;
    audit: AuditPolicyConfig;
    data: DataPolicyConfig;
    escalation: EscalationPolicyConfig;
  };
  integrations: IntegrationConfig[];
  contacts: ContactConfig[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    owner: string;
  };
}

export interface AccessPolicyConfig {
  enforceLeastPrivilege: boolean;
  requireMfaForAdmins: boolean;
  requireMfaForAllUsers: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLogins: number;
  lockoutDurationMinutes: number;
  allowedIpRanges?: string[];
  forbiddenActions?: string[];
  requireDualApprovalForRoles: string[];
}

export interface EthicsPolicyConfig {
  enableHealthModule: boolean;
  requireDoctorCertification: boolean;
  requireConsentForAllProcedures: boolean;
  enableBoundaryChecks: boolean;
  enableDecisionTree: boolean;
  communicationProtocols: string[];
  ethicsCommitteeRequired: boolean;
  minCapacityAssessmentScore: number;
}

export interface RiskPolicyConfig {
  enableRiskAssessment: boolean;
  lowRiskThreshold: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  criticalRiskThreshold: number;
  autoEscalateHighRisk: boolean;
  autoEscalateCriticalRisk: boolean;
  riskFactorWeights: Record<string, number>;
  assessmentFrequency: 'per_action' | 'daily' | 'weekly';
}

export interface AuditPolicyConfig {
  logAllDecisions: boolean;
  logAllAccess: boolean;
  logPiiAccess: boolean;
  retentionDays: number;
  exportRequiresApproval: boolean;
  exportApproverRole: string;
  immutableLogs: boolean;
  realTimeAlerts: boolean;
  alertThresholds: {
    failedLogins: number;
    accessDenied: number;
    highRiskActions: number;
  };
}

export interface DataPolicyConfig {
  gdprCompliant: boolean;
  hipaaCompliant: boolean;
  encryptAtRest: boolean;
  encryptInTransit: boolean;
  piiMaskingEnabled: boolean;
  crossBorderTransferAllowed: boolean;
  allowedCountries?: string[];
  dataResidency: string;
  backupFrequency: 'hourly' | 'daily' | 'weekly';
  backupRetentionDays: number;
}

export interface EscalationPolicyConfig {
  levels: EscalationLevel[];
  notificationChannels: string[];
  autoEscalateAfterHours: number;
  requireAcknowledgment: boolean;
  criticalContactEmail: string;
  criticalContactPhone?: string;
}

export interface EscalationLevel {
  level: number;
  name: string;
  triggerConditions: string[];
  notifyRoles: string[];
  responseTimeHours: number;
}

export interface IntegrationConfig {
  type: 'sso' | 'registry' | 'payment' | 'notification' | 'storage' | 'analytics';
  provider: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface ContactConfig {
  type: 'admin' | 'technical' | 'security' | 'compliance' | 'executive';
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const TENANT_POLICY_CONFIGS: TenantPolicyConfig[] = [
  // ========================================
  // UKRAINE - Ministry of Social Policy
  // ========================================
  {
    tenantId: 'TEN-UA-001',
    name: 'Ministry of Social Policy of Ukraine',
    type: 'ministry',
    countryCode: 'UA',
    scope: 'national',
    modules: ['health', 'access', 'governance', 'emigrant'],
    policies: {
      access: {
        enforceLeastPrivilege: true,
        requireMfaForAdmins: true,
        requireMfaForAllUsers: false,
        sessionTimeoutMinutes: 30,
        maxFailedLogins: 5,
        lockoutDurationMinutes: 15,
        requireDualApprovalForRoles: ['super_admin', 'security_admin', 'government'],
      },
      ethics: {
        enableHealthModule: true,
        requireDoctorCertification: true,
        requireConsentForAllProcedures: true,
        enableBoundaryChecks: true,
        enableDecisionTree: true,
        communicationProtocols: ['SPIKES', 'NURSE', 'SBAR'],
        ethicsCommitteeRequired: true,
        minCapacityAssessmentScore: 70,
      },
      risk: {
        enableRiskAssessment: true,
        lowRiskThreshold: 30,
        mediumRiskThreshold: 50,
        highRiskThreshold: 70,
        criticalRiskThreshold: 85,
        autoEscalateHighRisk: true,
        autoEscalateCriticalRisk: true,
        riskFactorWeights: {
          clinical: 0.25,
          ethical: 0.20,
          legal: 0.20,
          communication: 0.15,
          emotional: 0.10,
          reputational: 0.10,
        },
        assessmentFrequency: 'per_action',
      },
      audit: {
        logAllDecisions: true,
        logAllAccess: true,
        logPiiAccess: true,
        retentionDays: 2555, // 7 years
        exportRequiresApproval: true,
        exportApproverRole: 'data_protection_officer',
        immutableLogs: true,
        realTimeAlerts: true,
        alertThresholds: {
          failedLogins: 5,
          accessDenied: 10,
          highRiskActions: 3,
        },
      },
      data: {
        gdprCompliant: true,
        hipaaCompliant: false,
        encryptAtRest: true,
        encryptInTransit: true,
        piiMaskingEnabled: true,
        crossBorderTransferAllowed: true,
        allowedCountries: ['UA', 'EU', 'US'],
        dataResidency: 'EU',
        backupFrequency: 'daily',
        backupRetentionDays: 90,
      },
      escalation: {
        levels: [
          { level: 1, name: 'Standard Review', triggerConditions: ['risk_score >= 50'], notifyRoles: ['supervisor'], responseTimeHours: 24 },
          { level: 2, name: 'Formal Review', triggerConditions: ['risk_score >= 70', 'policy_violation'], notifyRoles: ['department_head', 'compliance'], responseTimeHours: 8 },
          { level: 3, name: 'Executive Review', triggerConditions: ['risk_score >= 85', 'critical_incident'], notifyRoles: ['director', 'legal', 'security'], responseTimeHours: 2 },
          { level: 4, name: 'Emergency Response', triggerConditions: ['imminent_harm', 'data_breach'], notifyRoles: ['minister', 'ciso', 'legal'], responseTimeHours: 0.5 },
        ],
        notificationChannels: ['email', 'sms', 'dashboard'],
        autoEscalateAfterHours: 24,
        requireAcknowledgment: true,
        criticalContactEmail: 'emergency@msp.gov.ua',
        criticalContactPhone: '+380441234567',
      },
    },
    integrations: [
      { type: 'sso', provider: 'Diia', enabled: true, config: { clientId: 'msp-ua-001', realm: 'government' } },
      { type: 'registry', provider: 'USRPOU', enabled: true, config: { apiEndpoint: 'https://api.usrpou.gov.ua' } },
      { type: 'notification', provider: 'GovNotify', enabled: true, config: { channel: 'msp' } },
    ],
    contacts: [
      { type: 'admin', name: 'Olena Kovalenko', email: 'admin@msp.gov.ua', role: 'Chief IT Officer' },
      { type: 'security', name: 'Dmytro Shevchenko', email: 'security@msp.gov.ua', role: 'CISO' },
      { type: 'compliance', name: 'Anna Bondarenko', email: 'dpo@msp.gov.ua', role: 'Data Protection Officer' },
    ],
    metadata: {
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2026-01-06T00:00:00Z',
      version: '2.1',
      owner: 'Ministry of Social Policy of Ukraine',
    },
  },

  // ========================================
  // POLAND - Ministry of Digital Affairs
  // ========================================
  {
    tenantId: 'TEN-PL-001',
    name: 'Ministry of Digital Affairs of Poland',
    type: 'ministry',
    countryCode: 'PL',
    scope: 'national',
    modules: ['health', 'access', 'governance'],
    policies: {
      access: {
        enforceLeastPrivilege: true,
        requireMfaForAdmins: true,
        requireMfaForAllUsers: true, // Stricter than UA
        sessionTimeoutMinutes: 20,
        maxFailedLogins: 3,
        lockoutDurationMinutes: 30,
        requireDualApprovalForRoles: ['super_admin', 'security_admin'],
      },
      ethics: {
        enableHealthModule: true,
        requireDoctorCertification: true,
        requireConsentForAllProcedures: true,
        enableBoundaryChecks: true,
        enableDecisionTree: true,
        communicationProtocols: ['SPIKES', 'NURSE'],
        ethicsCommitteeRequired: true,
        minCapacityAssessmentScore: 75, // Higher threshold
      },
      risk: {
        enableRiskAssessment: true,
        lowRiskThreshold: 25,
        mediumRiskThreshold: 45,
        highRiskThreshold: 65, // Lower threshold = stricter
        criticalRiskThreshold: 80,
        autoEscalateHighRisk: true,
        autoEscalateCriticalRisk: true,
        riskFactorWeights: {
          clinical: 0.20,
          ethical: 0.20,
          legal: 0.25, // Higher weight for legal
          communication: 0.15,
          emotional: 0.10,
          reputational: 0.10,
        },
        assessmentFrequency: 'per_action',
      },
      audit: {
        logAllDecisions: true,
        logAllAccess: true,
        logPiiAccess: true,
        retentionDays: 3650, // 10 years
        exportRequiresApproval: true,
        exportApproverRole: 'data_protection_officer',
        immutableLogs: true,
        realTimeAlerts: true,
        alertThresholds: {
          failedLogins: 3,
          accessDenied: 5,
          highRiskActions: 2,
        },
      },
      data: {
        gdprCompliant: true,
        hipaaCompliant: false,
        encryptAtRest: true,
        encryptInTransit: true,
        piiMaskingEnabled: true,
        crossBorderTransferAllowed: true,
        allowedCountries: ['PL', 'EU'],
        dataResidency: 'EU',
        backupFrequency: 'daily',
        backupRetentionDays: 180,
      },
      escalation: {
        levels: [
          { level: 1, name: 'Standard', triggerConditions: ['risk_score >= 45'], notifyRoles: ['supervisor'], responseTimeHours: 24 },
          { level: 2, name: 'Formal', triggerConditions: ['risk_score >= 65'], notifyRoles: ['department_head', 'compliance'], responseTimeHours: 4 },
          { level: 3, name: 'Executive', triggerConditions: ['risk_score >= 80'], notifyRoles: ['director', 'legal'], responseTimeHours: 1 },
        ],
        notificationChannels: ['email', 'sms', 'dashboard'],
        autoEscalateAfterHours: 12,
        requireAcknowledgment: true,
        criticalContactEmail: 'emergency@mc.gov.pl',
      },
    },
    integrations: [
      { type: 'sso', provider: 'Profil Zaufany', enabled: true, config: { clientId: 'mc-pl-001' } },
      { type: 'registry', provider: 'ZUS', enabled: true, config: {} },
    ],
    contacts: [
      { type: 'admin', name: 'Jan Kowalski', email: 'admin@mc.gov.pl', role: 'IT Director' },
      { type: 'security', name: 'Piotr Nowak', email: 'security@mc.gov.pl', role: 'Security Officer' },
    ],
    metadata: {
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2026-01-06T00:00:00Z',
      version: '1.5',
      owner: 'Ministry of Digital Affairs of Poland',
    },
  },

  // ========================================
  // GEORGIA - Ministry of Justice
  // ========================================
  {
    tenantId: 'TEN-GE-001',
    name: 'Ministry of Justice of Georgia',
    type: 'ministry',
    countryCode: 'GE',
    scope: 'national',
    modules: ['health', 'access', 'governance'],
    policies: {
      access: {
        enforceLeastPrivilege: true,
        requireMfaForAdmins: true,
        requireMfaForAllUsers: false,
        sessionTimeoutMinutes: 30,
        maxFailedLogins: 5,
        lockoutDurationMinutes: 15,
        requireDualApprovalForRoles: ['super_admin'],
      },
      ethics: {
        enableHealthModule: true,
        requireDoctorCertification: false, // Different requirements
        requireConsentForAllProcedures: true,
        enableBoundaryChecks: true,
        enableDecisionTree: true,
        communicationProtocols: ['SPIKES'],
        ethicsCommitteeRequired: false,
        minCapacityAssessmentScore: 60,
      },
      risk: {
        enableRiskAssessment: true,
        lowRiskThreshold: 30,
        mediumRiskThreshold: 50,
        highRiskThreshold: 70,
        criticalRiskThreshold: 85,
        autoEscalateHighRisk: true,
        autoEscalateCriticalRisk: true,
        riskFactorWeights: {
          clinical: 0.20,
          ethical: 0.20,
          legal: 0.30, // Justice ministry - higher legal weight
          communication: 0.10,
          emotional: 0.10,
          reputational: 0.10,
        },
        assessmentFrequency: 'daily',
      },
      audit: {
        logAllDecisions: true,
        logAllAccess: true,
        logPiiAccess: true,
        retentionDays: 1825, // 5 years
        exportRequiresApproval: true,
        exportApproverRole: 'compliance_officer',
        immutableLogs: true,
        realTimeAlerts: true,
        alertThresholds: {
          failedLogins: 5,
          accessDenied: 10,
          highRiskActions: 5,
        },
      },
      data: {
        gdprCompliant: false, // Not EU member
        hipaaCompliant: false,
        encryptAtRest: true,
        encryptInTransit: true,
        piiMaskingEnabled: true,
        crossBorderTransferAllowed: true,
        allowedCountries: ['GE', 'EU', 'US'],
        dataResidency: 'GE',
        backupFrequency: 'daily',
        backupRetentionDays: 60,
      },
      escalation: {
        levels: [
          { level: 1, name: 'Review', triggerConditions: ['risk_score >= 50'], notifyRoles: ['supervisor'], responseTimeHours: 48 },
          { level: 2, name: 'Escalate', triggerConditions: ['risk_score >= 70'], notifyRoles: ['department_head'], responseTimeHours: 24 },
          { level: 3, name: 'Critical', triggerConditions: ['risk_score >= 85'], notifyRoles: ['director'], responseTimeHours: 4 },
        ],
        notificationChannels: ['email', 'dashboard'],
        autoEscalateAfterHours: 48,
        requireAcknowledgment: true,
        criticalContactEmail: 'emergency@justice.gov.ge',
      },
    },
    integrations: [
      { type: 'sso', provider: 'Public Service Hall', enabled: true, config: {} },
    ],
    contacts: [
      { type: 'admin', name: 'Giorgi Beridze', email: 'admin@justice.gov.ge' },
    ],
    metadata: {
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2026-01-06T00:00:00Z',
      version: '1.2',
      owner: 'Ministry of Justice of Georgia',
    },
  },

  // ========================================
  // MOLDOVA - Ministry of Labor
  // ========================================
  {
    tenantId: 'TEN-MD-001',
    name: 'Ministry of Labor and Social Protection of Moldova',
    type: 'ministry',
    countryCode: 'MD',
    scope: 'pilot',
    modules: ['health', 'access'],
    policies: {
      access: {
        enforceLeastPrivilege: true,
        requireMfaForAdmins: true,
        requireMfaForAllUsers: false,
        sessionTimeoutMinutes: 60,
        maxFailedLogins: 5,
        lockoutDurationMinutes: 15,
        requireDualApprovalForRoles: ['super_admin'],
      },
      ethics: {
        enableHealthModule: true,
        requireDoctorCertification: false,
        requireConsentForAllProcedures: true,
        enableBoundaryChecks: true,
        enableDecisionTree: true,
        communicationProtocols: ['SPIKES'],
        ethicsCommitteeRequired: false,
        minCapacityAssessmentScore: 60,
      },
      risk: {
        enableRiskAssessment: true,
        lowRiskThreshold: 30,
        mediumRiskThreshold: 50,
        highRiskThreshold: 70,
        criticalRiskThreshold: 85,
        autoEscalateHighRisk: false, // Pilot - less strict
        autoEscalateCriticalRisk: true,
        riskFactorWeights: {
          clinical: 0.25,
          ethical: 0.20,
          legal: 0.20,
          communication: 0.15,
          emotional: 0.10,
          reputational: 0.10,
        },
        assessmentFrequency: 'daily',
      },
      audit: {
        logAllDecisions: true,
        logAllAccess: true,
        logPiiAccess: true,
        retentionDays: 1825,
        exportRequiresApproval: true,
        exportApproverRole: 'admin',
        immutableLogs: false, // Pilot
        realTimeAlerts: false,
        alertThresholds: {
          failedLogins: 10,
          accessDenied: 20,
          highRiskActions: 10,
        },
      },
      data: {
        gdprCompliant: true, // EU candidate
        hipaaCompliant: false,
        encryptAtRest: true,
        encryptInTransit: true,
        piiMaskingEnabled: true,
        crossBorderTransferAllowed: true,
        allowedCountries: ['MD', 'EU'],
        dataResidency: 'EU',
        backupFrequency: 'daily',
        backupRetentionDays: 30,
      },
      escalation: {
        levels: [
          { level: 1, name: 'Review', triggerConditions: ['risk_score >= 70'], notifyRoles: ['supervisor'], responseTimeHours: 72 },
          { level: 2, name: 'Critical', triggerConditions: ['risk_score >= 85'], notifyRoles: ['director'], responseTimeHours: 24 },
        ],
        notificationChannels: ['email'],
        autoEscalateAfterHours: 72,
        requireAcknowledgment: false,
        criticalContactEmail: 'emergency@social.gov.md',
      },
    },
    integrations: [
      { type: 'sso', provider: 'MPass', enabled: false, config: {} },
    ],
    contacts: [
      { type: 'admin', name: 'Ion Popescu', email: 'admin@social.gov.md' },
    ],
    metadata: {
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2026-01-06T00:00:00Z',
      version: '0.9',
      owner: 'Ministry of Labor and Social Protection of Moldova',
    },
  },

  // ========================================
  // KENYA - Ministry of Interior (Pending)
  // ========================================
  {
    tenantId: 'TEN-KE-001',
    name: 'Ministry of Interior of Kenya',
    type: 'ministry',
    countryCode: 'KE',
    scope: 'pilot',
    modules: ['access', 'governance'],
    policies: {
      access: {
        enforceLeastPrivilege: true,
        requireMfaForAdmins: true,
        requireMfaForAllUsers: false,
        sessionTimeoutMinutes: 30,
        maxFailedLogins: 5,
        lockoutDurationMinutes: 15,
        requireDualApprovalForRoles: ['super_admin'],
      },
      ethics: {
        enableHealthModule: false,
        requireDoctorCertification: false,
        requireConsentForAllProcedures: false,
        enableBoundaryChecks: true,
        enableDecisionTree: true,
        communicationProtocols: [],
        ethicsCommitteeRequired: false,
        minCapacityAssessmentScore: 50,
      },
      risk: {
        enableRiskAssessment: true,
        lowRiskThreshold: 30,
        mediumRiskThreshold: 50,
        highRiskThreshold: 70,
        criticalRiskThreshold: 85,
        autoEscalateHighRisk: false,
        autoEscalateCriticalRisk: true,
        riskFactorWeights: {
          clinical: 0.10,
          ethical: 0.15,
          legal: 0.25,
          communication: 0.15,
          emotional: 0.10,
          reputational: 0.25, // Security ministry - reputation important
        },
        assessmentFrequency: 'daily',
      },
      audit: {
        logAllDecisions: true,
        logAllAccess: true,
        logPiiAccess: true,
        retentionDays: 1825,
        exportRequiresApproval: true,
        exportApproverRole: 'admin',
        immutableLogs: true,
        realTimeAlerts: true,
        alertThresholds: {
          failedLogins: 5,
          accessDenied: 10,
          highRiskActions: 5,
        },
      },
      data: {
        gdprCompliant: false,
        hipaaCompliant: false,
        encryptAtRest: true,
        encryptInTransit: true,
        piiMaskingEnabled: true,
        crossBorderTransferAllowed: false, // Security concern
        allowedCountries: ['KE'],
        dataResidency: 'KE',
        backupFrequency: 'daily',
        backupRetentionDays: 90,
      },
      escalation: {
        levels: [
          { level: 1, name: 'Review', triggerConditions: ['risk_score >= 60'], notifyRoles: ['supervisor'], responseTimeHours: 24 },
          { level: 2, name: 'Security', triggerConditions: ['risk_score >= 80'], notifyRoles: ['security_officer'], responseTimeHours: 4 },
        ],
        notificationChannels: ['email', 'sms'],
        autoEscalateAfterHours: 24,
        requireAcknowledgment: true,
        criticalContactEmail: 'emergency@interior.go.ke',
      },
    },
    integrations: [
      { type: 'sso', provider: 'Huduma', enabled: false, config: {} },
    ],
    contacts: [
      { type: 'admin', name: 'James Mwangi', email: 'admin@interior.go.ke' },
    ],
    metadata: {
      createdAt: '2025-10-01T00:00:00Z',
      updatedAt: '2026-01-06T00:00:00Z',
      version: '0.1',
      owner: 'Ministry of Interior of Kenya',
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTenantPolicyConfig(tenantId: string): TenantPolicyConfig | undefined {
  return TENANT_POLICY_CONFIGS.find(t => t.tenantId === tenantId);
}

export function getTenantsByCountry(countryCode: string): TenantPolicyConfig[] {
  return TENANT_POLICY_CONFIGS.filter(t => t.countryCode === countryCode);
}

export function getTenantsByScope(scope: TenantPolicyConfig['scope']): TenantPolicyConfig[] {
  return TENANT_POLICY_CONFIGS.filter(t => t.scope === scope);
}

export function validateTenantPolicy(config: TenantPolicyConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!config.tenantId) errors.push('tenantId is required');
  if (!config.name) errors.push('name is required');
  if (!config.modules || config.modules.length === 0) errors.push('At least one module is required');

  // Policy validation
  if (config.policies.risk.highRiskThreshold <= config.policies.risk.mediumRiskThreshold) {
    errors.push('highRiskThreshold must be greater than mediumRiskThreshold');
  }
  if (config.policies.risk.criticalRiskThreshold <= config.policies.risk.highRiskThreshold) {
    errors.push('criticalRiskThreshold must be greater than highRiskThreshold');
  }

  // Audit retention
  if (config.policies.audit.retentionDays < 365) {
    errors.push('Audit retention must be at least 1 year (365 days)');
  }

  // Escalation levels
  if (config.policies.escalation.levels.length === 0) {
    errors.push('At least one escalation level is required');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// YAML EXPORT
// ============================================================================

export function exportTenantConfigAsYAML(config: TenantPolicyConfig): string {
  const yaml = `
# HBS Tenant Policy Configuration
# Tenant: ${config.name}
# Version: ${config.metadata.version}
# Last Updated: ${config.metadata.updatedAt}

tenantId: ${config.tenantId}
name: "${config.name}"
type: ${config.type}
countryCode: ${config.countryCode}
scope: ${config.scope}

modules:
${config.modules.map(m => `  - ${m}`).join('\n')}

policies:
  access:
    enforceLeastPrivilege: ${config.policies.access.enforceLeastPrivilege}
    requireMfaForAdmins: ${config.policies.access.requireMfaForAdmins}
    requireMfaForAllUsers: ${config.policies.access.requireMfaForAllUsers}
    sessionTimeoutMinutes: ${config.policies.access.sessionTimeoutMinutes}
    maxFailedLogins: ${config.policies.access.maxFailedLogins}
    lockoutDurationMinutes: ${config.policies.access.lockoutDurationMinutes}
    requireDualApprovalForRoles:
${config.policies.access.requireDualApprovalForRoles.map(r => `      - ${r}`).join('\n')}

  ethics:
    enableHealthModule: ${config.policies.ethics.enableHealthModule}
    requireDoctorCertification: ${config.policies.ethics.requireDoctorCertification}
    requireConsentForAllProcedures: ${config.policies.ethics.requireConsentForAllProcedures}
    enableBoundaryChecks: ${config.policies.ethics.enableBoundaryChecks}
    enableDecisionTree: ${config.policies.ethics.enableDecisionTree}
    communicationProtocols:
${config.policies.ethics.communicationProtocols.map(p => `      - ${p}`).join('\n') || '      []'}
    ethicsCommitteeRequired: ${config.policies.ethics.ethicsCommitteeRequired}
    minCapacityAssessmentScore: ${config.policies.ethics.minCapacityAssessmentScore}

  risk:
    enableRiskAssessment: ${config.policies.risk.enableRiskAssessment}
    lowRiskThreshold: ${config.policies.risk.lowRiskThreshold}
    mediumRiskThreshold: ${config.policies.risk.mediumRiskThreshold}
    highRiskThreshold: ${config.policies.risk.highRiskThreshold}
    criticalRiskThreshold: ${config.policies.risk.criticalRiskThreshold}
    autoEscalateHighRisk: ${config.policies.risk.autoEscalateHighRisk}
    autoEscalateCriticalRisk: ${config.policies.risk.autoEscalateCriticalRisk}
    assessmentFrequency: ${config.policies.risk.assessmentFrequency}

  audit:
    logAllDecisions: ${config.policies.audit.logAllDecisions}
    logAllAccess: ${config.policies.audit.logAllAccess}
    logPiiAccess: ${config.policies.audit.logPiiAccess}
    retentionDays: ${config.policies.audit.retentionDays}
    exportRequiresApproval: ${config.policies.audit.exportRequiresApproval}
    exportApproverRole: ${config.policies.audit.exportApproverRole}
    immutableLogs: ${config.policies.audit.immutableLogs}
    realTimeAlerts: ${config.policies.audit.realTimeAlerts}

  data:
    gdprCompliant: ${config.policies.data.gdprCompliant}
    encryptAtRest: ${config.policies.data.encryptAtRest}
    encryptInTransit: ${config.policies.data.encryptInTransit}
    piiMaskingEnabled: ${config.policies.data.piiMaskingEnabled}
    crossBorderTransferAllowed: ${config.policies.data.crossBorderTransferAllowed}
    dataResidency: ${config.policies.data.dataResidency}
    backupFrequency: ${config.policies.data.backupFrequency}
    backupRetentionDays: ${config.policies.data.backupRetentionDays}

  escalation:
    autoEscalateAfterHours: ${config.policies.escalation.autoEscalateAfterHours}
    requireAcknowledgment: ${config.policies.escalation.requireAcknowledgment}
    criticalContactEmail: ${config.policies.escalation.criticalContactEmail}
    notificationChannels:
${config.policies.escalation.notificationChannels.map(c => `      - ${c}`).join('\n')}
    levels:
${config.policies.escalation.levels.map(l => `      - level: ${l.level}
        name: "${l.name}"
        responseTimeHours: ${l.responseTimeHours}
        notifyRoles:
${l.notifyRoles.map(r => `          - ${r}`).join('\n')}`).join('\n')}

contacts:
${config.contacts.map(c => `  - type: ${c.type}
    name: "${c.name}"
    email: ${c.email}${c.role ? `\n    role: "${c.role}"` : ''}`).join('\n')}

metadata:
  version: "${config.metadata.version}"
  owner: "${config.metadata.owner}"
  createdAt: ${config.metadata.createdAt}
  updatedAt: ${config.metadata.updatedAt}
`.trim();

  return yaml;
}
