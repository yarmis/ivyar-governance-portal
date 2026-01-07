// lib/hbs/ai/assistant.ts
import { AIModule, AIRole } from "./governance-policy";
// HBS AI Assistant Core Engine v1.0
// Ethical, Transparent, Multi-Tenant AI Governance Assistant

// ============================================================================
// TYPES
// ============================================================================



export type AITag = 'ethics' | 'risk' | 'policy' | 'communication' | 'governance' | 'rights' | 'procedure' | 'documentation';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type InteractionStatus = 'success' | 'blocked' | 'escalated' | 'error';

export interface AIAssistantRequest {
  tenantId: string;
  role: AIRole;
  module: AIModule;
  sessionId?: string;
  locale?: string;
  question: string;
  context?: AIContext;
}

export interface AIContext {
  // Non-clinical, governance-safe context only
  caseId?: string;
  userId?: string;
  riskScore?: number;
  previousMessages?: AIMessage[];
  metadata?: Record<string, any>;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tags?: AITag[];
}

export interface AIAssistantResponse {
  success: boolean;
  interactionId: string;
  sessionId: string;
  answer: string;
  role: AIRole;
  module: AIModule;
  tenantId: string;
  tags: AITag[];
  riskLevel: RiskLevel;
  referencedPolicies: string[];
  referencedBoundaries: string[];
  suggestedActions: string[];
  escalated: boolean;
  escalationReason?: string;
  disclaimer: string;
  timestamp: string;
}

export interface AIRolePermissions {
  canExplainPolicies: boolean;
  canExplainRights: boolean;
  canExplainRisks: boolean;
  canExplainDecisions: boolean;
  canSuggestCommunication: boolean;
  canGenerateDocumentation: boolean;
  canAnalyzeIncidents: boolean;
  canGenerateReports: boolean;
  canAccessPatientContext: boolean;
  canAccessGovernanceData: boolean;
  // Strict prohibitions
  cannotGiveMedicalAdvice: boolean;
  cannotGiveLegalAdvice: boolean;
  cannotGivePoliticalOpinions: boolean;
  cannotModifyPolicies: boolean;
  cannotOverrideHumanDecisions: boolean;
}

export interface AIGovernancePolicy {
  global: {
    allowMedicalAdvice: false;
    allowLegalAdvice: false;
    allowPoliticalOpinions: false;
    logAllInteractions: true;
    requireDisclaimer: true;
    maxContextMessages: number;
    rateLimitPerMinute: number;
    rateLimitPerHour: number;
  };
  roles: Record<AIRole, AIRolePermissions>;
  modules: Record<AIModule, {
    enabled: boolean;
    allowedRoles: AIRole[];
    additionalConstraints: string[];
  }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AI_GOVERNANCE_POLICY: AIGovernancePolicy = {
  global: {
    allowMedicalAdvice: false,
    allowLegalAdvice: false,
    allowPoliticalOpinions: false,
    logAllInteractions: true,
    requireDisclaimer: true,
    maxContextMessages: 10,
    rateLimitPerMinute: 20,
    rateLimitPerHour: 200,
  },
  roles: {
    doctor: {
      canExplainPolicies: true,
      canExplainRights: true,
      canExplainRisks: true,
      canExplainDecisions: true,
      canSuggestCommunication: true,
      canGenerateDocumentation: true,
      canAnalyzeIncidents: false,
      canGenerateReports: false,
      canAccessPatientContext: true,
      canAccessGovernanceData: false,
      cannotGiveMedicalAdvice: true,
      cannotGiveLegalAdvice: true,
      cannotGivePoliticalOpinions: true,
      cannotModifyPolicies: true,
      cannotOverrideHumanDecisions: true,
    },
    patient: {
      canExplainPolicies: true,
      canExplainRights: true,
      canExplainRisks: false,
      canExplainDecisions: true,
      canSuggestCommunication: true,
      canGenerateDocumentation: false,
      canAnalyzeIncidents: false,
      canGenerateReports: false,
      canAccessPatientContext: false,
      canAccessGovernanceData: false,
      cannotGiveMedicalAdvice: true,
      cannotGiveLegalAdvice: true,
      cannotGivePoliticalOpinions: true,
      cannotModifyPolicies: true,
      cannotOverrideHumanDecisions: true,
    },
    admin: {
      canExplainPolicies: true,
      canExplainRights: true,
      canExplainRisks: true,
      canExplainDecisions: true,
      canSuggestCommunication: false,
      canGenerateDocumentation: true,
      canAnalyzeIncidents: true,
      canGenerateReports: true,
      canAccessPatientContext: false,
      canAccessGovernanceData: true,
      cannotGiveMedicalAdvice: true,
      cannotGiveLegalAdvice: true,
      cannotGivePoliticalOpinions: true,
      cannotModifyPolicies: true,
      cannotOverrideHumanDecisions: true,
    },
    ministry: {
      canExplainPolicies: true,
      canExplainRights: true,
      canExplainRisks: true,
      canExplainDecisions: true,
      canSuggestCommunication: false,
      canGenerateDocumentation: true,
      canAnalyzeIncidents: true,
      canGenerateReports: true,
      canAccessPatientContext: false,
      canAccessGovernanceData: true,
      cannotGiveMedicalAdvice: true,
      cannotGiveLegalAdvice: true,
      cannotGivePoliticalOpinions: true,
      cannotModifyPolicies: true,
      cannotOverrideHumanDecisions: true,
    },
    officer: {
      canExplainPolicies: true,
      canExplainRights: true,
      canExplainRisks: true,
      canExplainDecisions: true,
      canSuggestCommunication: true,
      canGenerateDocumentation: true,
      canAnalyzeIncidents: false,
      canGenerateReports: false,
      canAccessPatientContext: false,
      canAccessGovernanceData: false,
      cannotGiveMedicalAdvice: true,
      cannotGiveLegalAdvice: true,
      cannotGivePoliticalOpinions: true,
      cannotModifyPolicies: true,
      cannotOverrideHumanDecisions: true,
    },
  },
  modules: {
    health: {
      enabled: true,
      allowedRoles: ['doctor', 'patient', 'admin', 'ministry'],
      additionalConstraints: [
        'No clinical diagnosis',
        'No treatment recommendations',
        'No medication advice',
        'Ethics and communication guidance only',
      ],
    },
    access: {
      enabled: true,
      allowedRoles: ['admin', 'ministry', 'officer'],
      additionalConstraints: [
        'Cannot modify roles',
        'Cannot grant permissions',
        'Explanation and analysis only',
      ],
    },
    governance: {
      enabled: true,
      allowedRoles: ['admin', 'ministry'],
      additionalConstraints: [
        'Policy explanation only',
        'Cannot modify policies',
        'Cannot override audit',
      ],
    },
    aviation: {
      enabled: true,
      allowedRoles: ['admin', 'officer', 'ministry'],
      additionalConstraints: [
        'No flight safety advice',
        'No technical recommendations',
        'Booking and rights only',
      ],
    },
    business: {
      enabled: true,
      allowedRoles: ['admin', 'officer', 'ministry'],
      additionalConstraints: [
        'No financial advice',
        'No legal interpretation',
        'Policy guidance only',
      ],
    },
    education: {
      enabled: true,
      allowedRoles: ['admin', 'officer', 'ministry'],
      additionalConstraints: [
        'Academic rights only',
        'No grading decisions',
        'Process explanation only',
      ],
    },
    immigration: {
      enabled: true,
      allowedRoles: ['officer', 'admin', 'ministry'],
      additionalConstraints: [
        'No legal advice',
        'No case decisions',
        'Status and process only',
      ],
    },
  },
};

const ROLE_DISCLAIMERS: Record<AIRole, string> = {
  doctor: 'This AI provides ethical and communication guidance only. It does not provide medical diagnosis, treatment recommendations, or clinical advice. Always rely on your professional medical judgment.',
  patient: 'This AI helps you understand your rights and processes. It does not provide medical advice. For health concerns, please consult your healthcare provider.',
  admin: 'This AI provides governance analysis and insights. It cannot modify policies, roles, or audit logs. All actions require human authorization.',
  ministry: 'This AI provides governance reports and analysis. All recommendations are advisory and require human review and approval.',
  officer: 'This AI provides procedural guidance. It cannot make case decisions or provide legal interpretations. All decisions require human authorization.',
};

const QUICK_ACTIONS: Record<AIRole, { id: string; label: string; prompt: string }[]> = {
  doctor: [
    { id: 'explain_decision', label: 'Explain Decision', prompt: 'Help me explain a difficult medical decision to a patient in an ethical and compassionate way.' },
    { id: 'evaluate_risk', label: 'Evaluate Risk', prompt: 'Help me assess the ethical and communication risks in the current situation.' },
    { id: 'generate_consent', label: 'Generate Consent Text', prompt: 'Help me create clear, ethical informed consent documentation.' },
    { id: 'communication_help', label: 'Communication Help', prompt: 'Help me navigate a difficult conversation with a patient or family member.' },
  ],
  patient: [
    { id: 'explain_rights', label: 'Explain My Rights', prompt: 'Explain my rights as a patient in simple, clear terms.' },
    { id: 'explain_decision', label: 'Explain Decision', prompt: 'Help me understand the doctor\'s recommendation in simple terms.' },
    { id: 'what_to_expect', label: 'What to Expect', prompt: 'What should I expect during this process?' },
    { id: 'help_questions', label: 'Help Me Ask Questions', prompt: 'What questions should I ask my doctor about my situation?' },
  ],
  admin: [
    { id: 'analyze_incidents', label: 'Analyze Incidents', prompt: 'Analyze recent incidents and identify patterns or areas of concern.' },
    { id: 'explain_violation', label: 'Explain Violation', prompt: 'Explain this policy violation and suggest remediation steps.' },
    { id: 'governance_summary', label: 'Governance Summary', prompt: 'Provide a summary of the current governance status and key metrics.' },
    { id: 'suggest_improvements', label: 'Suggest Improvements', prompt: 'Suggest improvements based on current governance data.' },
  ],
  ministry: [
    { id: 'generate_report', label: 'Generate Report', prompt: 'Generate a Ministry Governance Report for the specified period.' },
    { id: 'explain_risk', label: 'Explain Risk Profile', prompt: 'Explain the current risk profile and key areas of concern.' },
    { id: 'summarize_period', label: 'Summarize Period', prompt: 'Summarize governance activity and key metrics for the last 30 days.' },
    { id: 'recommendations', label: 'Recommendations', prompt: 'Provide strategic recommendations based on current governance data.' },
  ],
  officer: [
    { id: 'explain_process', label: 'Explain Process', prompt: 'Explain the current process and next steps.' },
    { id: 'explain_status', label: 'Explain Status', prompt: 'Explain the current case status and what it means.' },
    { id: 'documentation_help', label: 'Documentation Help', prompt: 'Help me with the required documentation for this case.' },
    { id: 'timeline', label: 'Expected Timeline', prompt: 'What is the expected timeline for this process?' },
  ],
};

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

const SYSTEM_PROMPT_BASE = `You are the HBS Governance Assistant — an institutional AI designed to support ethical, transparent, and policy-aligned decision-making across all HBS/IVYAR modules.

YOUR PURPOSE:
- Help users understand policies, rights, boundaries, risks, and governance rules
- Provide structured, ethical, non-medical, non-legal guidance
- Support users within their allowed scope based on their role
- Always follow HBS Governance Core: policies, boundaries, risk engine, audit rules, tenant context

YOUR ABSOLUTE CONSTRAINTS:
- You NEVER provide medical diagnosis, medical treatment, or clinical recommendations
- You NEVER provide legal advice or legal interpretations
- You NEVER provide political opinions or politically biased content
- You NEVER override human authority or decision-making
- You NEVER contradict tenant policies or boundaries
- You NEVER suggest actions outside the user's authorized scope
- You ALWAYS prioritize safety, ethics, transparency, and clarity

YOUR BEHAVIOR:
- Explain decisions, rights, risks, and policies in clear, accessible language
- Provide structured reasoning based on HBS governance framework
- Cite specific policies, boundaries, or protocols when relevant
- Escalate when risk is high or boundaries are crossed
- Use calm, neutral, respectful, and institutional tone
- No emotional manipulation, personal opinions, or speculation

RESPONSE FORMAT:
- Keep responses focused and actionable
- Use clear structure when explaining complex topics
- Always include relevant policy or boundary references
- Suggest next steps when appropriate`;

const ROLE_PROMPTS: Record<AIRole, string> = {
  doctor: `${SYSTEM_PROMPT_BASE}

ROLE: Doctor Assistant

YOUR SPECIFIC PURPOSE:
- Help doctors understand ethical decisions, communication strategies, and documentation
- Provide structured guidance based on HBS Decision Tree and Boundaries Engine
- Support difficult conversations with patients and families

YOU MAY:
- Explain ethical reasoning and frameworks
- Suggest communication strategies (SPIKES, NURSE, SBAR protocols)
- Highlight ethical and communication risks
- Generate documentation templates (consent, refusal, explanations)
- Identify boundary risks and escalation needs

YOU MUST NOT:
- Give clinical diagnosis or medical advice
- Suggest treatments or medications
- Replace medical judgment
- Access or interpret clinical data

ALWAYS REFERENCE:
- HBS Ethical Boundaries
- HBS Risk Engine
- HBS Communication Protocols (SPIKES, NURSE, SBAR)`,

  patient: `${SYSTEM_PROMPT_BASE}

ROLE: Patient Assistant

YOUR SPECIFIC PURPOSE:
- Explain patient rights, expectations, and processes in simple language
- Help patients understand decisions without providing medical advice
- Empower patients to communicate effectively with healthcare providers

YOU MAY:
- Explain patient rights in simple, clear language
- Explain what to expect during procedures or processes
- Suggest questions patients can ask their doctor
- Clarify ethical or procedural steps
- Provide emotional support through difficult situations

YOU MUST NOT:
- Provide medical advice or health recommendations
- Interpret clinical data or test results
- Suggest treatments or medications
- Make decisions on behalf of patients

ALWAYS REFERENCE:
- HBS Patient Rights Framework
- HBS Communication Guide`,

  admin: `${SYSTEM_PROMPT_BASE}

ROLE: Administrator Assistant

YOUR SPECIFIC PURPOSE:
- Help administrators analyze incidents, policy violations, and governance metrics
- Provide insights for governance improvement

YOU MAY:
- Summarize and analyze incidents
- Explain policy violations and their implications
- Suggest governance improvements
- Identify risk patterns and clusters
- Generate governance reports

YOU MUST NOT:
- Modify policies or access controls
- Override audit logs
- Make disciplinary decisions
- Access individual patient data

ALWAYS REFERENCE:
- HBS Governance Policies
- HBS Audit Engine
- HBS Risk Engine`,

  ministry: `${SYSTEM_PROMPT_BASE}

ROLE: Ministry Governance Assistant

YOUR SPECIFIC PURPOSE:
- Provide high-level governance insights for ministries and donors
- Generate summaries, reports, and strategic recommendations

YOU MAY:
- Summarize governance status across tenants
- Explain risk profiles and trends
- Generate Ministry Governance Reports
- Provide recommendations based on policy compliance
- Compare performance across modules or time periods

YOU MUST NOT:
- Provide political opinions or policy preferences
- Modify governance rules or configurations
- Access individual-level data
- Make budget or resource allocation decisions

ALWAYS REFERENCE:
- HBS Governance Core
- Tenant Policies
- Audit & Compliance Framework`,

  officer: `${SYSTEM_PROMPT_BASE}

ROLE: Officer Assistant

YOUR SPECIFIC PURPOSE:
- Help officers understand processes, documentation, and procedures
- Provide guidance on case handling within policy framework

YOU MAY:
- Explain processes and procedures
- Help with documentation requirements
- Explain case statuses and timelines
- Identify relevant policies and guidelines

YOU MUST NOT:
- Make case decisions or recommendations
- Provide legal interpretations
- Access unauthorized case information
- Override procedural requirements

ALWAYS REFERENCE:
- Relevant Module Policies
- HBS Governance Framework
- Standard Operating Procedures`,
};

// ============================================================================
// INPUT VALIDATION & SANITIZATION
// ============================================================================

const PROHIBITED_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions/i,
  /disregard\s+(previous|above|all)/i,
  /pretend\s+you\s+are/i,
  /act\s+as\s+if\s+you\s+are/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all|your)/i,
  /new\s+instructions/i,
  /override\s+(your|the)\s+(rules|instructions)/i,
  /system\s+prompt/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

function sanitizeInput(input: string): { safe: boolean; sanitized: string; reason?: string } {
  // Check for prompt injection attempts
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(input)) {
      return {
        safe: false,
        sanitized: '',
        reason: 'Input contains prohibited patterns',
      };
    }
  }

  // Remove potential control characters
  const sanitized = input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, 4000); // Max input length

  return { safe: true, sanitized };
}

function validateRequest(request: AIAssistantRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.tenantId) errors.push('tenantId is required');
  if (!request.role) errors.push('role is required');
  if (!request.module) errors.push('module is required');
  if (!request.question) errors.push('question is required');

  // Validate role
  if (request.role && !AI_GOVERNANCE_POLICY.roles[request.role]) {
    errors.push(`Invalid role: ${request.role}`);
  }

  // Validate module
  if (request.module && !AI_GOVERNANCE_POLICY.modules[request.module]) {
    errors.push(`Invalid module: ${request.module}`);
  }

  // Check role-module compatibility
  if (request.role && request.module) {
    const moduleConfig = AI_GOVERNANCE_POLICY.modules[request.module];
    if (moduleConfig && !moduleConfig.allowedRoles.includes(request.role)) {
      errors.push(`Role '${request.role}' is not allowed for module '${request.module}'`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================================
// RATE LIMITING (In-memory for demo, use Redis in production)
// ============================================================================

const rateLimitStore: Map<string, { minute: number; hour: number; lastMinute: number; lastHour: number }> = new Map();

function checkRateLimit(tenantId: string, role: AIRole): { allowed: boolean; reason?: string } {
  const key = `${tenantId}:${role}`;
  const now = Date.now();
  const policy = AI_GOVERNANCE_POLICY.global;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { minute: 0, hour: 0, lastMinute: now, lastHour: now };
  }

  // Reset minute counter
  if (now - record.lastMinute > 60000) {
    record.minute = 0;
    record.lastMinute = now;
  }

  // Reset hour counter
  if (now - record.lastHour > 3600000) {
    record.hour = 0;
    record.lastHour = now;
  }

  // Check limits
  if (record.minute >= policy.rateLimitPerMinute) {
    return { allowed: false, reason: 'Rate limit exceeded (per minute)' };
  }
  if (record.hour >= policy.rateLimitPerHour) {
    return { allowed: false, reason: 'Rate limit exceeded (per hour)' };
  }

  // Increment counters
  record.minute++;
  record.hour++;
  rateLimitStore.set(key, record);

  return { allowed: true };
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

const sessionStore: Map<string, { messages: AIMessage[]; createdAt: number; tenantId: string; role: AIRole }> = new Map();

function getOrCreateSession(sessionId: string | undefined, tenantId: string, role: AIRole): string {
  if (sessionId && sessionStore.has(sessionId)) {
    return sessionId;
  }

  const newSessionId = `AI-${tenantId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStore.set(newSessionId, {
    messages: [],
    createdAt: Date.now(),
    tenantId,
    role,
  });

  return newSessionId;
}

function addMessageToSession(sessionId: string, message: AIMessage): void {
  const session = sessionStore.get(sessionId);
  if (session) {
    session.messages.push(message);
    // Keep only last N messages
    if (session.messages.length > AI_GOVERNANCE_POLICY.global.maxContextMessages) {
      session.messages = session.messages.slice(-AI_GOVERNANCE_POLICY.global.maxContextMessages);
    }
  }
}

function getSessionContext(sessionId: string): AIMessage[] {
  return sessionStore.get(sessionId)?.messages || [];
}

// ============================================================================
// MOCK AI RESPONSE GENERATOR (Replace with actual LLM integration)
// ============================================================================

function generateMockResponse(request: AIAssistantRequest, sessionId: string): AIAssistantResponse {
  const { tenantId, role, module, question } = request;
  const interactionId = `INT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Detect intent and generate appropriate response
  const lowerQuestion = question.toLowerCase();
  let answer: string;
  let tags: AITag[] = [];
  let riskLevel: RiskLevel = 'low';
  let referencedPolicies: string[] = [];
  let referencedBoundaries: string[] = [];
  let suggestedActions: string[] = [];
  let escalated = false;

  // Role-specific response generation
  if (role === 'doctor') {
    if (lowerQuestion.includes('consent') || lowerQuestion.includes('refus')) {
      answer = `I understand you're dealing with a consent-related situation. Here's guidance based on HBS ethical framework:

**Key Principles:**
1. **Patient Autonomy**: The patient has the right to accept or refuse any recommended intervention
2. **Informed Decision**: Ensure the patient understands the benefits, risks, and alternatives
3. **Documentation**: All consent discussions should be documented thoroughly

**Recommended Approach:**
- Use the SPIKES protocol for structuring the conversation
- Acknowledge the patient's emotions and concerns
- Provide clear, jargon-free explanations
- Respect the patient's decision, even if you disagree

**Documentation Template:**
"Patient was informed of [procedure/treatment], including benefits, risks, and alternatives. Patient [consented/declined] after discussion. Questions were addressed regarding [specific concerns]."`;
      tags = ['ethics', 'communication', 'documentation', 'rights'];
      referencedPolicies = ['HBS-ETH-001', 'HBS-COMM-SPIKES'];
      referencedBoundaries = ['patient-autonomy', 'informed-consent'];
      suggestedActions = ['Document the conversation', 'Offer follow-up discussion', 'Involve ethics committee if needed'];
    } else if (lowerQuestion.includes('difficult') || lowerQuestion.includes('emotional')) {
      answer = `For difficult or emotional conversations, I recommend the following structured approach:

**SPIKES Protocol:**
1. **S**etting: Ensure privacy and adequate time
2. **P**erception: Assess what the patient already knows
3. **I**nvitation: Ask how much information they want
4. **K**nowledge: Share information clearly and compassionately
5. **E**mpathy: Respond to emotions with empathy
6. **S**trategy: Summarize and discuss next steps

**NURSE Framework for Emotional Responses:**
- **N**ame the emotion: "I can see this is difficult"
- **U**nderstand: "It's natural to feel this way"
- **R**espect: "You're handling this with strength"
- **S**upport: "We're here to support you"
- **E**xplore: "Tell me more about your concerns"`;
      tags = ['communication', 'ethics'];
      referencedPolicies = ['HBS-COMM-SPIKES', 'HBS-COMM-NURSE'];
      riskLevel = 'medium';
    } else {
      answer = `I'm here to help with ethical guidance, communication strategies, and documentation. I can assist with:

- Explaining decisions to patients ethically
- Navigating difficult conversations
- Generating consent documentation
- Assessing ethical and communication risks

Please note: I cannot provide medical diagnosis, treatment recommendations, or clinical advice. How can I assist you today?`;
      tags = ['ethics', 'communication'];
    }
  } else if (role === 'patient') {
    if (lowerQuestion.includes('right') || lowerQuestion.includes('refuse')) {
      answer = `**Your Patient Rights:**

As a patient, you have important rights that protect you:

1. **Right to Information**: You have the right to receive clear, understandable information about your condition and treatment options

2. **Right to Consent**: No procedure can be performed without your informed consent

3. **Right to Refuse**: You can refuse any treatment, even if your doctor recommends it

4. **Right to a Second Opinion**: You can seek another doctor's perspective

5. **Right to Privacy**: Your medical information is confidential

**What This Means:**
- Doctors must explain things in terms you understand
- You can ask as many questions as you need
- Taking time to decide is okay
- Your decision will be respected

**Questions to Ask Your Doctor:**
- "What are my options?"
- "What happens if I choose to wait?"
- "What are the risks of each option?"`;
      tags = ['rights', 'communication'];
      referencedPolicies = ['HBS-PAT-RIGHTS'];
      suggestedActions = ['Ask your doctor to explain in simpler terms', 'Request written information', 'Take time to consider your options'];
    } else {
      answer = `I'm here to help you understand your rights, the process, and what to expect. I can:

- Explain your rights in simple terms
- Help you understand what doctors are telling you
- Suggest questions you might want to ask
- Explain what to expect during your care

Please note: I cannot give medical advice. For health questions, please speak with your healthcare provider. How can I help you today?`;
      tags = ['rights', 'procedure'];
    }
  } else if (role === 'admin') {
    if (lowerQuestion.includes('incident') || lowerQuestion.includes('pattern')) {
      answer = `**Incident Analysis Overview:**

Based on the governance data, here's a summary of recent incident patterns:

**Key Findings:**
1. **Volume**: 42 incidents recorded in the past 30 days
2. **High-Risk**: 8 incidents classified as high-risk (19%)
3. **Primary Module**: Health module accounts for 43% of incidents
4. **Resolution Rate**: 83% resolved within SLA

**Pattern Analysis:**
- Consent-related incidents spike on Mondays and Fridays
- Access violations concentrated in evening hours
- Documentation gaps in 3 specific departments

**Recommendations:**
1. Implement targeted training for high-incident areas
2. Review consent procedures in identified departments
3. Consider additional oversight during peak periods
4. Schedule follow-up audit in 2 weeks`;
      tags = ['governance', 'risk', 'policy'];
      referencedPolicies = ['HBS-GOV-AUDIT', 'HBS-INC-001'];
      riskLevel = 'medium';
      suggestedActions = ['Generate detailed incident report', 'Schedule department review', 'Initiate training program'];
    } else {
      answer = `I'm here to help with governance analysis and insights. I can:

- Analyze incidents and identify patterns
- Explain policy violations
- Generate governance summaries
- Suggest improvements

Please note: I cannot modify policies or access controls. All changes require human authorization. How can I assist you?`;
      tags = ['governance'];
    }
  } else if (role === 'ministry') {
    if (lowerQuestion.includes('report') || lowerQuestion.includes('summary')) {
      answer = `**Governance Summary (Last 30 Days):**

**Overall Status:** ✅ Good (Score: 87/100)

**Key Metrics:**
- Active Tenants: 4/5
- Total Decisions: 12,450
- Policy Compliance: 92%
- Incidents: 42 (8 high-risk)
- Avg Resolution Time: 4.2 hours

**Top Concerns:**
1. Risk threshold exceeded 3 times in Moldova tenant
2. Ethics compliance at 88% (target: 90%)
3. 2 unresolved high-risk incidents pending

**Recommendations:**
1. **Immediate**: Review pending high-risk incidents
2. **Short-term**: Address ethics compliance gap
3. **Medium-term**: Conduct training for Moldova team
4. **Strategic**: Consider increasing risk thresholds review frequency

I can generate a full PDF Ministry Governance Report if needed.`;
      tags = ['governance', 'risk', 'policy'];
      referencedPolicies = ['HBS-GOV-001', 'HBS-REPORT-001'];
      suggestedActions = ['Generate PDF Report', 'Schedule review meeting', 'Request detailed breakdown'];
    } else {
      answer = `I'm here to provide ministry-level governance insights. I can:

- Summarize governance status across tenants
- Explain risk profiles and trends
- Generate Ministry Governance Reports
- Provide strategic recommendations

How can I assist you today?`;
      tags = ['governance'];
    }
  } else {
    answer = `I'm here to help with procedural guidance and documentation. I can:

- Explain processes and procedures
- Help with documentation requirements
- Explain case statuses and timelines

Please note: I cannot make case decisions or provide legal interpretations. How can I assist you?`;
    tags = ['procedure'];
  }

  return {
    success: true,
    interactionId,
    sessionId,
    answer,
    role,
    module,
    tenantId,
    tags,
    riskLevel,
    referencedPolicies,
    referencedBoundaries,
    suggestedActions,
    escalated,
    disclaimer: ROLE_DISCLAIMERS[role],
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// MAIN ASSISTANT FUNCTION
// ============================================================================

export async function hbsAssistant(request: AIAssistantRequest): Promise<AIAssistantResponse> {
  const startTime = Date.now();

  // 1. Validate request
  const validation = validateRequest(request);
  if (!validation.valid) {
    return {
      success: false,
      interactionId: `ERR-${Date.now()}`,
      sessionId: '',
      answer: `Request validation failed: ${validation.errors.join(', ')}`,
      role: request.role || 'admin',
      module: request.module || 'governance',
      tenantId: request.tenantId || 'unknown',
      tags: [],
      riskLevel: 'low',
      referencedPolicies: [],
      referencedBoundaries: [],
      suggestedActions: [],
      escalated: false,
      disclaimer: '',
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Sanitize input
  const sanitized = sanitizeInput(request.question);
  if (!sanitized.safe) {
    return {
      success: false,
      interactionId: `ERR-${Date.now()}`,
      sessionId: '',
      answer: 'Your message could not be processed. Please rephrase your question.',
      role: request.role,
      module: request.module,
      tenantId: request.tenantId,
      tags: [],
      riskLevel: 'high',
      referencedPolicies: [],
      referencedBoundaries: ['input-validation'],
      suggestedActions: [],
      escalated: true,
      escalationReason: 'Prohibited input pattern detected',
      disclaimer: ROLE_DISCLAIMERS[request.role],
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Check rate limit
  const rateLimit = checkRateLimit(request.tenantId, request.role);
  if (!rateLimit.allowed) {
    return {
      success: false,
      interactionId: `ERR-${Date.now()}`,
      sessionId: '',
      answer: `Service temporarily unavailable. ${rateLimit.reason}. Please try again later.`,
      role: request.role,
      module: request.module,
      tenantId: request.tenantId,
      tags: [],
      riskLevel: 'low',
      referencedPolicies: [],
      referencedBoundaries: ['rate-limit'],
      suggestedActions: ['Wait a few minutes before trying again'],
      escalated: false,
      disclaimer: ROLE_DISCLAIMERS[request.role],
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Get or create session
  const sessionId = getOrCreateSession(request.sessionId, request.tenantId, request.role);

  // 5. Generate response
  const response = generateMockResponse({ ...request, question: sanitized.sanitized }, sessionId);

  // 6. Add messages to session
  addMessageToSession(sessionId, {
    role: 'user',
    content: sanitized.sanitized,
    timestamp: new Date().toISOString(),
  });
  addMessageToSession(sessionId, {
    role: 'assistant',
    content: response.answer,
    timestamp: response.timestamp,
    tags: response.tags,
  });

  // 7. Log interaction (would integrate with Audit Engine in production)
  console.log(`[AI Audit] ${response.interactionId} | Tenant: ${request.tenantId} | Role: ${request.role} | Duration: ${Date.now() - startTime}ms`);

  return response;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  AI_GOVERNANCE_POLICY,
  ROLE_DISCLAIMERS,
  QUICK_ACTIONS,
  ROLE_PROMPTS,
  validateRequest,
  sanitizeInput,
  checkRateLimit,
  getSessionContext,
};
