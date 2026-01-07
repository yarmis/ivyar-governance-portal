// app/api/hbs/ai/route.ts
// HBS AI Assistant API v1.0

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

type AIRole = 'doctor' | 'patient' | 'admin' | 'ministry' | 'officer';
type AIModule = 'health' | 'access' | 'governance' | 'aviation' | 'business' | 'education' | 'immigration';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface AssistantRequest {
  tenantId: string;
  role: AIRole;
  module: AIModule;
  sessionId?: string;
  locale?: string;
  question: string;
  context?: Record<string, any>;
}

interface AssistantResponse {
  success: boolean;
  interactionId: string;
  sessionId: string;
  answer: string;
  role: AIRole;
  module: AIModule;
  tenantId: string;
  tags: string[];
  riskLevel: RiskLevel;
  referencedPolicies: string[];
  referencedBoundaries: string[];
  suggestedActions: string[];
  escalated: boolean;
  escalationReason?: string;
  disclaimer: string;
  timestamp: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const VALID_ROLES: AIRole[] = ['doctor', 'patient', 'admin', 'ministry', 'officer'];
const VALID_MODULES: AIModule[] = ['health', 'access', 'governance', 'aviation', 'business', 'education', 'immigration'];

const ROLE_MODULE_MATRIX: Record<AIModule, AIRole[]> = {
  health: ['doctor', 'patient', 'admin', 'ministry'],
  access: ['admin', 'ministry', 'officer'],
  governance: ['admin', 'ministry'],
  aviation: ['admin', 'officer', 'ministry'],
  business: ['admin', 'officer', 'ministry'],
  education: ['admin', 'officer', 'ministry'],
  immigration: ['officer', 'admin', 'ministry'],
};

const DISCLAIMERS: Record<AIRole, string> = {
  doctor: 'This AI provides ethical and communication guidance only. It does not provide medical diagnosis, treatment, or clinical advice.',
  patient: 'This AI helps you understand your rights. It does not provide medical advice. For health concerns, consult your healthcare provider.',
  admin: 'This AI provides governance analysis. It cannot modify policies or audit logs. All actions require human authorization.',
  ministry: 'This AI provides governance reports. All recommendations are advisory and require human review.',
  officer: 'This AI provides procedural guidance. It cannot make case decisions or provide legal interpretations.',
};

// Rate limiting (in-memory for demo)
const rateLimits: Map<string, { count: number; resetAt: number }> = new Map();
const RATE_LIMIT_PER_MINUTE = 20;

// ============================================================================
// INPUT VALIDATION
// ============================================================================

const PROHIBITED_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions/i,
  /disregard\s+(previous|above|all)/i,
  /pretend\s+you\s+are/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all)/i,
  /override\s+(your|the)\s+(rules|instructions)/i,
  /system\s+prompt/i,
  /jailbreak/i,
];

function validateRequest(body: AssistantRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body.tenantId) errors.push('tenantId is required');
  if (!body.role) errors.push('role is required');
  if (!body.module) errors.push('module is required');
  if (!body.question) errors.push('question is required');

  if (body.role && !VALID_ROLES.includes(body.role)) {
    errors.push(`Invalid role: ${body.role}`);
  }

  if (body.module && !VALID_MODULES.includes(body.module)) {
    errors.push(`Invalid module: ${body.module}`);
  }

  if (body.role && body.module) {
    const allowedRoles = ROLE_MODULE_MATRIX[body.module];
    if (allowedRoles && !allowedRoles.includes(body.role)) {
      errors.push(`Role '${body.role}' is not allowed for module '${body.module}'`);
    }
  }

  if (body.question) {
    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.test(body.question)) {
        errors.push('Input contains prohibited patterns');
        break;
      }
    }
    if (body.question.length > 4000) {
      errors.push('Question exceeds maximum length (4000 characters)');
    }
  }

  return { valid: errors.length === 0, errors };
}

function checkRateLimit(tenantId: string): { allowed: boolean; reason?: string } {
  const key = tenantId;
  const now = Date.now();
  let record = rateLimits.get(key);

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + 60000 };
  }

  if (record.count >= RATE_LIMIT_PER_MINUTE) {
    return { allowed: false, reason: 'Rate limit exceeded. Please wait a moment.' };
  }

  record.count++;
  rateLimits.set(key, record);
  return { allowed: true };
}

// ============================================================================
// MOCK RESPONSE GENERATOR
// ============================================================================

function generateResponse(request: AssistantRequest): AssistantResponse {
  const { tenantId, role, module, question, sessionId } = request;
  const interactionId = `INT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const newSessionId = sessionId || `SES-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const lowerQuestion = question.toLowerCase();
  let answer: string;
  let tags: string[] = [];
  let riskLevel: RiskLevel = 'low';
  let referencedPolicies: string[] = [];
  let referencedBoundaries: string[] = [];
  let suggestedActions: string[] = [];

  // Role-specific responses
  if (role === 'doctor') {
    if (lowerQuestion.includes('consent') || lowerQuestion.includes('refuse')) {
      answer = `**Consent & Refusal Guidance**

Based on HBS ethical framework:

**Key Principles:**
1. **Patient Autonomy** — Right to accept or refuse any intervention
2. **Informed Decision** — Ensure understanding of benefits, risks, alternatives
3. **Documentation** — All discussions must be documented

**SPIKES Protocol:**
- Setting: Private, adequate time
- Perception: What does patient know?
- Invitation: How much do they want to know?
- Knowledge: Share clearly
- Empathy: Respond to emotions
- Strategy: Summarize next steps

**Documentation Template:**
"Patient informed of [procedure], including benefits, risks, alternatives. Patient [consented/declined] after discussion."`;
      tags = ['ethics', 'communication', 'documentation'];
      riskLevel = 'medium';
      referencedPolicies = ['HBS-ETH-001', 'HBS-COMM-SPIKES'];
      referencedBoundaries = ['patient-autonomy', 'informed-consent'];
      suggestedActions = ['Document conversation', 'Offer follow-up', 'Consider ethics committee if needed'];
    } else {
      answer = `I'm here to help with ethical guidance, communication strategies, and documentation.

**I can assist with:**
- Explaining decisions ethically
- Navigating difficult conversations
- Generating consent documentation
- Assessing ethical and communication risks

**I cannot provide:**
- Medical diagnosis
- Treatment recommendations
- Clinical advice

How can I help you today?`;
      tags = ['ethics', 'communication'];
    }
  } else if (role === 'patient') {
    if (lowerQuestion.includes('right') || lowerQuestion.includes('refuse')) {
      answer = `**Your Patient Rights**

✅ **Right to Information** — Clear explanations in terms you understand
✅ **Right to Consent** — No procedure without your agreement
✅ **Right to Refuse** — You can say no to any treatment
✅ **Right to Second Opinion** — Ask another doctor
✅ **Right to Privacy** — Your information stays confidential

**Questions to Ask Your Doctor:**
- "What are my options?"
- "What if I wait?"
- "What are the risks?"
- "Can you explain simpler?"

Remember: Taking time to decide is okay.`;
      tags = ['rights', 'communication'];
      referencedPolicies = ['HBS-PAT-RIGHTS'];
      suggestedActions = ['Ask for written information', 'Take time to consider', 'Bring someone you trust'];
    } else {
      answer = `Hello! I'm here to help you understand your care and rights.

**I can help you:**
- Understand your rights
- Know what to expect
- Prepare questions for your doctor

**Please Note:** I cannot give medical advice. For health questions, talk to your doctor.

What would you like to know?`;
      tags = ['rights'];
    }
  } else if (role === 'admin') {
    if (lowerQuestion.includes('incident') || lowerQuestion.includes('pattern')) {
      answer = `**Incident Analysis — Last 30 Days**

| Metric | Value | Trend |
|--------|-------|-------|
| Total Incidents | 42 | ↓ 8% |
| High-Risk | 8 | Stable |
| Resolution Rate | 83% | ↑ 5% |
| Avg Resolution | 4.2h | ↓ 12% |

**Top Patterns:**
1. Consent Issues — 40%, peaks Mon/Fri
2. Access Violations — 25%, evening hours
3. Documentation Gaps — 20%

**Recommendations:**
1. Targeted training for high-incident areas
2. Review consent procedures
3. Add oversight during peak periods`;
      tags = ['governance', 'risk', 'policy'];
      riskLevel = 'medium';
      referencedPolicies = ['HBS-GOV-AUDIT', 'HBS-INC-001'];
      suggestedActions = ['Generate detailed report', 'Schedule review', 'Initiate training'];
    } else {
      answer = `I'm here for governance analysis.

**Available:**
- Analyze incidents/patterns
- Explain policy violations
- Generate governance summaries
- Suggest improvements

**Limitations:**
- Cannot modify policies
- Cannot change access controls

What would you like to analyze?`;
      tags = ['governance'];
    }
  } else if (role === 'ministry') {
    if (lowerQuestion.includes('report') || lowerQuestion.includes('summary')) {
      answer = `**Governance Summary — Last 30 Days**

**Overall Status:** ✅ Good (Score: 87/100)

| KPI | Value | Status |
|-----|-------|--------|
| Active Tenants | 4/5 | ✅ |
| Decisions | 12,450 | ↑ 8% |
| Compliance | 92% | ✅ |
| Incidents | 42 | ↓ 12% |

**Areas of Concern:**
1. Moldova: Risk threshold exceeded 3x
2. Ethics compliance at 88%
3. 2 unresolved high-risk incidents

**Recommendations:**
1. Review pending incidents (immediate)
2. Address ethics gap (short-term)
3. Moldova training (medium-term)

I can generate a full PDF report.`;
      tags = ['governance', 'risk', 'policy'];
      referencedPolicies = ['HBS-GOV-001', 'HBS-REPORT-001'];
      suggestedActions = ['Generate PDF Report', 'Schedule review', 'Request breakdown'];
    } else {
      answer = `I provide ministry-level governance insights.

**Available:**
- Summarize governance across tenants
- Explain risk profiles
- Generate Ministry Reports
- Strategic recommendations

How can I assist?`;
      tags = ['governance'];
    }
  } else {
    answer = `I provide procedural guidance.

**Available:**
- Explain processes/procedures
- Help with documentation
- Explain case statuses

**Limitations:**
- Cannot make case decisions
- Cannot provide legal interpretations

How can I help?`;
    tags = ['procedure'];
  }

  return {
    success: true,
    interactionId,
    sessionId: newSessionId,
    answer,
    role,
    module,
    tenantId,
    tags,
    riskLevel,
    referencedPolicies,
    referencedBoundaries,
    suggestedActions,
    escalated: false,
    disclaimer: DISCLAIMERS[role],
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// API HANDLERS
// ============================================================================

// POST - Ask AI Assistant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AssistantRequest;

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join('; '),
        },
      }, { status: 400 });
    }

    // Check rate limit
    const rateLimit = checkRateLimit(body.tenantId);
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: rateLimit.reason,
        },
      }, { status: 429 });
    }

    // Generate response
    const response = generateResponse(body);

    // Log interaction (in production, integrate with Audit Engine)
    console.log(`[AI] ${response.interactionId} | ${body.tenantId} | ${body.role} | ${body.module}`);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to process request',
      },
    }, { status: 500 });
  }
}

// GET - Get AI Assistant configuration
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const role = searchParams.get('role') as AIRole | null;

  // Return quick actions for role
  const quickActions: Record<AIRole, { id: string; label: string; prompt: string }[]> = {
    doctor: [
      { id: 'explain_decision', label: 'Explain Decision', prompt: 'Help me explain a difficult decision ethically.' },
      { id: 'evaluate_risk', label: 'Evaluate Risk', prompt: 'Help assess ethical and communication risks.' },
      { id: 'generate_consent', label: 'Generate Consent', prompt: 'Create informed consent documentation.' },
      { id: 'communication_help', label: 'Communication Help', prompt: 'Navigate a difficult conversation.' },
    ],
    patient: [
      { id: 'explain_rights', label: 'My Rights', prompt: 'Explain my patient rights.' },
      { id: 'explain_decision', label: 'Understand Decision', prompt: 'Help me understand the recommendation.' },
      { id: 'what_to_expect', label: 'What to Expect', prompt: 'What should I expect?' },
      { id: 'help_questions', label: 'Help Ask Questions', prompt: 'What questions should I ask?' },
    ],
    admin: [
      { id: 'analyze_incidents', label: 'Analyze Incidents', prompt: 'Analyze recent incidents and patterns.' },
      { id: 'explain_violation', label: 'Explain Violation', prompt: 'Explain this policy violation.' },
      { id: 'governance_summary', label: 'Governance Summary', prompt: 'Summarize current governance status.' },
      { id: 'suggest_improvements', label: 'Improvements', prompt: 'Suggest governance improvements.' },
    ],
    ministry: [
      { id: 'generate_report', label: 'Generate Report', prompt: 'Generate Ministry Governance Report.' },
      { id: 'explain_risk', label: 'Risk Profile', prompt: 'Explain current risk profile.' },
      { id: 'summarize_period', label: 'Summarize', prompt: 'Summarize last 30 days.' },
      { id: 'recommendations', label: 'Recommendations', prompt: 'Provide strategic recommendations.' },
    ],
    officer: [
      { id: 'explain_process', label: 'Explain Process', prompt: 'Explain the current process.' },
      { id: 'explain_status', label: 'Case Status', prompt: 'Explain the case status.' },
      { id: 'documentation_help', label: 'Documentation', prompt: 'Help with documentation.' },
      { id: 'timeline', label: 'Timeline', prompt: 'What is the expected timeline?' },
    ],
  };

  return NextResponse.json({
    success: true,
    data: {
      roles: VALID_ROLES,
      modules: VALID_MODULES,
      roleModuleMatrix: ROLE_MODULE_MATRIX,
      disclaimers: DISCLAIMERS,
      quickActions: role ? quickActions[role] : quickActions,
      limits: {
        maxQuestionLength: 4000,
        rateLimitPerMinute: RATE_LIMIT_PER_MINUTE,
      },
    },
  });
}
