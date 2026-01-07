// lib/hbs/ai/governance-policy.ts
// HBS AI Governance Policy Configuration v1.0
// Defines rules, boundaries, and constraints for AI behavior

// ============================================================================
// TYPES
// ============================================================================

export type AIRole = 'doctor' | 'patient' | 'admin' | 'ministry' | 'officer';
export type AIModule = 'health' | 'access' | 'governance' | 'aviation' | 'business' | 'education' | 'immigration';
export type PolicyStatus = 'active' | 'draft' | 'deprecated';
export type BoundaryType = 'absolute' | 'contextual' | 'advisory';

export interface AIGovernanceConfig {
  version: string;
  lastUpdated: string;
  status: PolicyStatus;
  global: GlobalAIPolicy;
  roles: Record<AIRole, RolePolicy>;
  modules: Record<AIModule, ModulePolicy>;
  boundaries: AIBoundary[];
  escalation: EscalationPolicy;
  audit: AuditPolicy;
  compliance: ComplianceFramework[];
}

export interface GlobalAIPolicy {
  // Absolute prohibitions
  allowMedicalAdvice: false;
  allowLegalAdvice: false;
  allowPoliticalOpinions: false;
  allowFinancialAdvice: false;
  
  // Required behaviors
  requireDisclaimer: true;
  requirePolicyReferences: true;
  requireAuditLogging: true;
  
  // Limits
  maxInputLength: number;
  maxOutputLength: number;
  maxSessionMessages: number;
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  
  // Safety
  inputSanitization: boolean;
  outputFiltering: boolean;
  piiDetection: boolean;
  promptInjectionProtection: boolean;
}

export interface RolePolicy {
  id: AIRole;
  name: string;
  description: string;
  allowedModules: AIModule[];
  permissions: RolePermissions;
  prohibitions: string[];
  requiredContext: string[];
  disclaimer: string;
}

export interface RolePermissions {
  canExplainPolicies: boolean;
  canExplainRights: boolean;
  canExplainRisks: boolean;
  canExplainDecisions: boolean;
  canSuggestCommunication: boolean;
  canGenerateDocumentation: boolean;
  canAnalyzeIncidents: boolean;
  canGenerateReports: boolean;
  canAccessTenantData: boolean;
  canAccessAggregateData: boolean;
}

export interface ModulePolicy {
  id: AIModule;
  name: string;
  enabled: boolean;
  allowedRoles: AIRole[];
  constraints: string[];
  requiredBoundaries: string[];
}

export interface AIBoundary {
  id: string;
  name: string;
  type: BoundaryType;
  description: string;
  applies_to: ('all' | AIRole)[];
  condition: string;
  action: 'block' | 'warn' | 'escalate' | 'log';
  message: string;
}

export interface EscalationPolicy {
  levels: EscalationLevel[];
  defaultChannel: string;
  requireAcknowledgment: boolean;
}

export interface EscalationLevel {
  level: number;
  name: string;
  triggers: string[];
  notifyRoles: string[];
  responseTimeMinutes: number;
}

export interface AuditPolicy {
  logAllInteractions: boolean;
  logInputs: boolean;
  logOutputs: boolean;
  logContext: boolean;
  retentionDays: number;
  immutable: boolean;
  exportable: boolean;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  requirements: string[];
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const AI_GOVERNANCE_CONFIG: AIGovernanceConfig = {
  version: '1.0.0',
  lastUpdated: '2026-01-06T00:00:00Z',
  status: 'active',
  
  global: {
    allowMedicalAdvice: false,
    allowLegalAdvice: false,
    allowPoliticalOpinions: false,
    allowFinancialAdvice: false,
    requireDisclaimer: true,
    requirePolicyReferences: true,
    requireAuditLogging: true,
    maxInputLength: 4000,
    maxOutputLength: 8000,
    maxSessionMessages: 20,
    rateLimitPerMinute: 20,
    rateLimitPerHour: 200,
    inputSanitization: true,
    outputFiltering: true,
    piiDetection: true,
    promptInjectionProtection: true,
  },

  roles: {
    doctor: {
      id: 'doctor',
      name: 'Doctor Assistant',
      description: 'Ethical and communication support for healthcare professionals',
      allowedModules: ['health'],
      permissions: {
        canExplainPolicies: true,
        canExplainRights: true,
        canExplainRisks: true,
        canExplainDecisions: true,
        canSuggestCommunication: true,
        canGenerateDocumentation: true,
        canAnalyzeIncidents: false,
        canGenerateReports: false,
        canAccessTenantData: false,
        canAccessAggregateData: false,
      },
      prohibitions: [
        'Cannot provide medical diagnosis',
        'Cannot recommend treatments',
        'Cannot prescribe medications',
        'Cannot interpret clinical data',
        'Cannot override clinical judgment',
      ],
      requiredContext: ['role_verified', 'tenant_context'],
      disclaimer: 'This AI provides ethical and communication guidance only. It does not provide medical diagnosis, treatment recommendations, or clinical advice. Always rely on your professional medical judgment.',
    },
    
    patient: {
      id: 'patient',
      name: 'Patient Assistant',
      description: 'Rights and process guidance for patients',
      allowedModules: ['health'],
      permissions: {
        canExplainPolicies: true,
        canExplainRights: true,
        canExplainRisks: false,
        canExplainDecisions: true,
        canSuggestCommunication: true,
        canGenerateDocumentation: false,
        canAnalyzeIncidents: false,
        canGenerateReports: false,
        canAccessTenantData: false,
        canAccessAggregateData: false,
      },
      prohibitions: [
        'Cannot provide medical advice',
        'Cannot interpret test results',
        'Cannot recommend treatments',
        'Cannot diagnose conditions',
        'Cannot access clinical records',
      ],
      requiredContext: ['tenant_context'],
      disclaimer: 'This AI helps you understand your rights and processes. It does not provide medical advice. For health concerns, please consult your healthcare provider.',
    },
    
    admin: {
      id: 'admin',
      name: 'Administrator Assistant',
      description: 'Governance analysis and insights',
      allowedModules: ['health', 'access', 'governance', 'aviation', 'business', 'education', 'immigration'],
      permissions: {
        canExplainPolicies: true,
        canExplainRights: true,
        canExplainRisks: true,
        canExplainDecisions: true,
        canSuggestCommunication: false,
        canGenerateDocumentation: true,
        canAnalyzeIncidents: true,
        canGenerateReports: true,
        canAccessTenantData: true,
        canAccessAggregateData: true,
      },
      prohibitions: [
        'Cannot modify policies',
        'Cannot change access controls',
        'Cannot delete audit logs',
        'Cannot access individual patient data',
        'Cannot override governance rules',
      ],
      requiredContext: ['role_verified', 'tenant_context', 'admin_permissions'],
      disclaimer: 'This AI provides governance analysis and insights. It cannot modify policies, roles, or audit logs. All actions require human authorization.',
    },
    
    ministry: {
      id: 'ministry',
      name: 'Ministry Governance Assistant',
      description: 'High-level governance insights for ministries and donors',
      allowedModules: ['governance', 'health', 'access', 'aviation', 'business', 'education', 'immigration'],
      permissions: {
        canExplainPolicies: true,
        canExplainRights: true,
        canExplainRisks: true,
        canExplainDecisions: true,
        canSuggestCommunication: false,
        canGenerateDocumentation: true,
        canAnalyzeIncidents: true,
        canGenerateReports: true,
        canAccessTenantData: true,
        canAccessAggregateData: true,
      },
      prohibitions: [
        'Cannot provide political opinions',
        'Cannot modify governance rules',
        'Cannot access individual-level data',
        'Cannot make budget decisions',
        'Cannot override human authority',
      ],
      requiredContext: ['role_verified', 'tenant_context', 'ministry_clearance'],
      disclaimer: 'This AI provides governance reports and analysis. All recommendations are advisory and require human review and approval.',
    },
    
    officer: {
      id: 'officer',
      name: 'Officer Assistant',
      description: 'Procedural guidance for case officers',
      allowedModules: ['access', 'aviation', 'business', 'education', 'immigration'],
      permissions: {
        canExplainPolicies: true,
        canExplainRights: true,
        canExplainRisks: true,
        canExplainDecisions: true,
        canSuggestCommunication: true,
        canGenerateDocumentation: true,
        canAnalyzeIncidents: false,
        canGenerateReports: false,
        canAccessTenantData: false,
        canAccessAggregateData: false,
      },
      prohibitions: [
        'Cannot make case decisions',
        'Cannot provide legal interpretations',
        'Cannot access unauthorized case data',
        'Cannot override procedures',
        'Cannot approve applications',
      ],
      requiredContext: ['role_verified', 'tenant_context'],
      disclaimer: 'This AI provides procedural guidance. It cannot make case decisions or provide legal interpretations. All decisions require human authorization.',
    },
  },

  modules: {
    health: {
      id: 'health',
      name: 'Health Module',
      enabled: true,
      allowedRoles: ['doctor', 'patient', 'admin', 'ministry'],
      constraints: [
        'No clinical diagnosis',
        'No treatment recommendations',
        'No medication advice',
        'Ethics and communication guidance only',
      ],
      requiredBoundaries: ['no-medical-advice', 'patient-privacy'],
    },
    access: {
      id: 'access',
      name: 'Access Governance',
      enabled: true,
      allowedRoles: ['admin', 'ministry', 'officer'],
      constraints: [
        'Cannot modify roles',
        'Cannot grant permissions',
        'Explanation and analysis only',
      ],
      requiredBoundaries: ['no-policy-modification'],
    },
    governance: {
      id: 'governance',
      name: 'Governance Module',
      enabled: true,
      allowedRoles: ['admin', 'ministry'],
      constraints: [
        'Policy explanation only',
        'Cannot modify policies',
        'Cannot override audit',
      ],
      requiredBoundaries: ['no-policy-modification', 'audit-integrity'],
    },
    aviation: {
      id: 'aviation',
      name: 'Aviation Module',
      enabled: true,
      allowedRoles: ['admin', 'officer', 'ministry'],
      constraints: [
        'No flight safety advice',
        'No technical recommendations',
        'Booking and rights only',
      ],
      requiredBoundaries: ['no-safety-advice'],
    },
    business: {
      id: 'business',
      name: 'Business Module',
      enabled: true,
      allowedRoles: ['admin', 'officer', 'ministry'],
      constraints: [
        'No financial advice',
        'No legal interpretation',
        'Policy guidance only',
      ],
      requiredBoundaries: ['no-financial-advice', 'no-legal-advice'],
    },
    education: {
      id: 'education',
      name: 'Education Module',
      enabled: true,
      allowedRoles: ['admin', 'officer', 'ministry'],
      constraints: [
        'Academic rights only',
        'No grading decisions',
        'Process explanation only',
      ],
      requiredBoundaries: ['no-academic-decisions'],
    },
    immigration: {
      id: 'immigration',
      name: 'Immigration Module',
      enabled: true,
      allowedRoles: ['officer', 'admin', 'ministry'],
      constraints: [
        'No legal advice',
        'No case decisions',
        'Status and process only',
      ],
      requiredBoundaries: ['no-legal-advice', 'no-case-decisions'],
    },
  },

  boundaries: [
    {
      id: 'no-medical-advice',
      name: 'No Medical Advice',
      type: 'absolute',
      description: 'AI must never provide medical diagnosis, treatment, or clinical advice',
      applies_to: ['all'],
      condition: 'intent:medical_advice OR content:diagnosis OR content:treatment',
      action: 'block',
      message: 'I cannot provide medical advice. Please consult a healthcare professional.',
    },
    {
      id: 'no-legal-advice',
      name: 'No Legal Advice',
      type: 'absolute',
      description: 'AI must never provide legal advice or interpretations',
      applies_to: ['all'],
      condition: 'intent:legal_advice OR content:legal_interpretation',
      action: 'block',
      message: 'I cannot provide legal advice. Please consult a qualified legal professional.',
    },
    {
      id: 'no-political-opinions',
      name: 'No Political Opinions',
      type: 'absolute',
      description: 'AI must never express political opinions or bias',
      applies_to: ['all'],
      condition: 'intent:political_opinion OR content:partisan',
      action: 'block',
      message: 'I cannot provide political opinions. I focus on factual, policy-based guidance.',
    },
    {
      id: 'no-policy-modification',
      name: 'No Policy Modification',
      type: 'absolute',
      description: 'AI cannot modify, create, or delete policies',
      applies_to: ['all'],
      condition: 'intent:modify_policy OR action:policy_change',
      action: 'block',
      message: 'I cannot modify policies. All policy changes require human authorization.',
    },
    {
      id: 'patient-privacy',
      name: 'Patient Privacy',
      type: 'absolute',
      description: 'AI must protect patient privacy and not expose PHI',
      applies_to: ['all'],
      condition: 'content:phi OR action:expose_phi',
      action: 'block',
      message: 'I cannot share or process protected health information.',
    },
    {
      id: 'tenant-boundary',
      name: 'Tenant Boundary',
      type: 'absolute',
      description: 'AI must operate within tenant context only',
      applies_to: ['all'],
      condition: 'action:cross_tenant_access',
      action: 'block',
      message: 'I can only access information within your authorized tenant context.',
    },
    {
      id: 'high-risk-escalation',
      name: 'High Risk Escalation',
      type: 'contextual',
      description: 'AI must escalate high-risk situations',
      applies_to: ['all'],
      condition: 'risk_score >= 70 OR intent:harm',
      action: 'escalate',
      message: 'This situation requires human review. I am escalating to the appropriate team.',
    },
    {
      id: 'audit-integrity',
      name: 'Audit Integrity',
      type: 'absolute',
      description: 'AI cannot modify or delete audit logs',
      applies_to: ['all'],
      condition: 'action:modify_audit OR action:delete_audit',
      action: 'block',
      message: 'Audit logs cannot be modified. They are immutable for compliance.',
    },
  ],

  escalation: {
    levels: [
      {
        level: 1,
        name: 'Standard Review',
        triggers: ['risk_score >= 50', 'user_request'],
        notifyRoles: ['supervisor'],
        responseTimeMinutes: 60,
      },
      {
        level: 2,
        name: 'Urgent Review',
        triggers: ['risk_score >= 70', 'boundary_violation'],
        notifyRoles: ['supervisor', 'compliance'],
        responseTimeMinutes: 15,
      },
      {
        level: 3,
        name: 'Critical Response',
        triggers: ['risk_score >= 85', 'potential_harm', 'security_incident'],
        notifyRoles: ['supervisor', 'compliance', 'security', 'director'],
        responseTimeMinutes: 5,
      },
    ],
    defaultChannel: 'dashboard',
    requireAcknowledgment: true,
  },

  audit: {
    logAllInteractions: true,
    logInputs: true,
    logOutputs: true,
    logContext: true,
    retentionDays: 2555, // 7 years
    immutable: true,
    exportable: true,
  },

  compliance: [
    {
      id: 'gdpr',
      name: 'GDPR',
      version: '2016/679',
      requirements: [
        'Data minimization',
        'Purpose limitation',
        'Right to access',
        'Right to erasure',
        'Data portability',
      ],
    },
    {
      id: 'iso27001',
      name: 'ISO/IEC 27001',
      version: '2022',
      requirements: [
        'Information security management',
        'Risk assessment',
        'Access control',
        'Incident management',
        'Business continuity',
      ],
    },
    {
      id: 'who-ethics',
      name: 'WHO Ethics Guidelines',
      version: '2021',
      requirements: [
        'Human oversight',
        'Transparency',
        'Accountability',
        'Inclusiveness',
        'Responsiveness',
      ],
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRolePolicy(role: AIRole): RolePolicy {
  return AI_GOVERNANCE_CONFIG.roles[role];
}

export function getModulePolicy(module: AIModule): ModulePolicy {
  return AI_GOVERNANCE_CONFIG.modules[module];
}

export function isRoleAllowedForModule(role: AIRole, module: AIModule): boolean {
  const modulePolicy = getModulePolicy(module);
  return modulePolicy.allowedRoles.includes(role);
}

export function getBoundariesForRole(role: AIRole): AIBoundary[] {
  return AI_GOVERNANCE_CONFIG.boundaries.filter(
    b => b.applies_to.includes('all') || b.applies_to.includes(role)
  );
}

export function getEscalationLevel(riskScore: number): EscalationLevel | null {
  const levels = AI_GOVERNANCE_CONFIG.escalation.levels;
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    const threshold = parseInt(level.triggers.find(t => t.includes('risk_score'))?.split('>= ')[1] || '100');
    if (riskScore >= threshold) {
      return level;
    }
  }
  return null;
}

export function validateGovernanceCompliance(role: AIRole, module: AIModule, action: string): {
  allowed: boolean;
  reason?: string;
  boundary?: AIBoundary;
} {
  // Check role-module compatibility
  if (!isRoleAllowedForModule(role, module)) {
    return {
      allowed: false,
      reason: `Role '${role}' is not allowed for module '${module}'`,
    };
  }

  // Check boundaries
  const boundaries = getBoundariesForRole(role);
  for (const boundary of boundaries) {
    if (boundary.type === 'absolute' && boundary.action === 'block') {
      // In production, evaluate boundary.condition against the action
      // For now, return allowed
    }
  }

  return { allowed: true };
}

// ============================================================================
// YAML EXPORT
// ============================================================================

export function exportAsYAML(): string {
  return `# HBS AI Governance Policy
# Version: ${AI_GOVERNANCE_CONFIG.version}
# Last Updated: ${AI_GOVERNANCE_CONFIG.lastUpdated}

global:
  allowMedicalAdvice: false
  allowLegalAdvice: false
  allowPoliticalOpinions: false
  allowFinancialAdvice: false
  requireDisclaimer: true
  requirePolicyReferences: true
  requireAuditLogging: true
  maxInputLength: ${AI_GOVERNANCE_CONFIG.global.maxInputLength}
  maxOutputLength: ${AI_GOVERNANCE_CONFIG.global.maxOutputLength}
  maxSessionMessages: ${AI_GOVERNANCE_CONFIG.global.maxSessionMessages}
  rateLimitPerMinute: ${AI_GOVERNANCE_CONFIG.global.rateLimitPerMinute}
  rateLimitPerHour: ${AI_GOVERNANCE_CONFIG.global.rateLimitPerHour}
  inputSanitization: true
  outputFiltering: true
  piiDetection: true
  promptInjectionProtection: true

roles:
${Object.entries(AI_GOVERNANCE_CONFIG.roles).map(([key, role]) => `
  ${key}:
    name: "${role.name}"
    description: "${role.description}"
    allowedModules: [${role.allowedModules.join(', ')}]
    permissions:
      canExplainPolicies: ${role.permissions.canExplainPolicies}
      canExplainRights: ${role.permissions.canExplainRights}
      canExplainRisks: ${role.permissions.canExplainRisks}
      canAnalyzeIncidents: ${role.permissions.canAnalyzeIncidents}
      canGenerateReports: ${role.permissions.canGenerateReports}
    prohibitions:
${role.prohibitions.map(p => `      - "${p}"`).join('\n')}`).join('\n')}

modules:
${Object.entries(AI_GOVERNANCE_CONFIG.modules).map(([key, mod]) => `
  ${key}:
    name: "${mod.name}"
    enabled: ${mod.enabled}
    allowedRoles: [${mod.allowedRoles.join(', ')}]
    constraints:
${mod.constraints.map(c => `      - "${c}"`).join('\n')}`).join('\n')}

boundaries:
${AI_GOVERNANCE_CONFIG.boundaries.map(b => `
  - id: ${b.id}
    name: "${b.name}"
    type: ${b.type}
    action: ${b.action}
    message: "${b.message}"`).join('\n')}

audit:
  logAllInteractions: true
  retentionDays: ${AI_GOVERNANCE_CONFIG.audit.retentionDays}
  immutable: true
  exportable: true

compliance:
${AI_GOVERNANCE_CONFIG.compliance.map(c => `
  - id: ${c.id}
    name: "${c.name}"
    version: "${c.version}"`).join('\n')}
`;
}
