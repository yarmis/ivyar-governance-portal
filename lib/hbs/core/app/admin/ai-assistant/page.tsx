'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

type AIRole = 'doctor' | 'patient' | 'admin' | 'ministry';
type AIModule = 'health' | 'access' | 'governance' | 'aviation' | 'business';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tags?: string[];
  riskLevel?: RiskLevel;
  referencedPolicies?: string[];
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TENANTS = [
  { id: 'TEN-UA-001', name: 'Ukraine MSPS', flag: '🇺🇦' },
  { id: 'TEN-PL-001', name: 'Poland MoD', flag: '🇵🇱' },
  { id: 'TEN-GE-001', name: 'Georgia MoJ', flag: '🇬🇪' },
  { id: 'TEN-MD-001', name: 'Moldova MLSP', flag: '🇲🇩' },
];

const ROLES: { id: AIRole; label: string; icon: string; description: string }[] = [
  { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️', description: 'Ethical & communication support' },
  { id: 'patient', label: 'Patient', icon: '🧑‍🦽', description: 'Rights & process guidance' },
  { id: 'admin', label: 'Administrator', icon: '🏛️', description: 'Governance analysis' },
  { id: 'ministry', label: 'Ministry', icon: '🌍', description: 'Strategic insights' },
];

const MODULES: { id: AIModule; label: string; icon: string }[] = [
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'access', label: 'Access', icon: '🔐' },
  { id: 'governance', label: 'Governance', icon: '🏛️' },
  { id: 'aviation', label: 'Aviation', icon: '✈️' },
  { id: 'business', label: 'Business', icon: '💼' },
];

const QUICK_ACTIONS: Record<AIRole, QuickAction[]> = {
  doctor: [
    { id: 'explain_decision', label: 'Explain Decision', prompt: 'Help me explain a difficult medical decision to a patient in an ethical and compassionate way.' },
    { id: 'evaluate_risk', label: 'Evaluate Risk', prompt: 'Help me assess the ethical and communication risks in the current situation.' },
    { id: 'generate_consent', label: 'Generate Consent', prompt: 'Help me create clear, ethical informed consent documentation.' },
    { id: 'communication_help', label: 'Communication Help', prompt: 'Help me navigate a difficult conversation with a patient or family member.' },
  ],
  patient: [
    { id: 'explain_rights', label: 'Explain My Rights', prompt: 'Explain my rights as a patient in simple, clear terms.' },
    { id: 'explain_decision', label: 'Understand Decision', prompt: 'Help me understand the doctor\'s recommendation in simple terms.' },
    { id: 'what_to_expect', label: 'What to Expect', prompt: 'What should I expect during this process?' },
    { id: 'help_questions', label: 'Help Ask Questions', prompt: 'What questions should I ask my doctor about my situation?' },
  ],
  admin: [
    { id: 'analyze_incidents', label: 'Analyze Incidents', prompt: 'Analyze recent incidents and identify patterns or areas of concern.' },
    { id: 'explain_violation', label: 'Explain Violation', prompt: 'Explain this policy violation and suggest remediation steps.' },
    { id: 'governance_summary', label: 'Governance Summary', prompt: 'Provide a summary of the current governance status and key metrics.' },
    { id: 'suggest_improvements', label: 'Suggest Improvements', prompt: 'Suggest improvements based on current governance data.' },
  ],
  ministry: [
    { id: 'generate_report', label: 'Generate Report', prompt: 'Generate a Ministry Governance Report for the specified period.' },
    { id: 'explain_risk', label: 'Risk Profile', prompt: 'Explain the current risk profile and key areas of concern.' },
    { id: 'summarize_period', label: 'Summarize 30 Days', prompt: 'Summarize governance activity and key metrics for the last 30 days.' },
    { id: 'recommendations', label: 'Recommendations', prompt: 'Provide strategic recommendations based on current governance data.' },
  ],
};

const DISCLAIMERS: Record<AIRole, string> = {
  doctor: 'This AI provides ethical and communication guidance only. It does not provide medical diagnosis, treatment, or clinical advice.',
  patient: 'This AI helps you understand your rights. It does not provide medical advice. For health concerns, consult your healthcare provider.',
  admin: 'This AI provides governance analysis. It cannot modify policies or audit logs. All actions require human authorization.',
  ministry: 'This AI provides governance reports. All recommendations are advisory and require human review.',
};

// ============================================================================
// MOCK RESPONSE GENERATOR
// ============================================================================

async function generateResponse(role: AIRole, module: AIModule, question: string): Promise<{
  answer: string;
  tags: string[];
  riskLevel: RiskLevel;
  referencedPolicies: string[];
}> {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const lowerQuestion = question.toLowerCase();

  if (role === 'doctor') {
    if (lowerQuestion.includes('consent') || lowerQuestion.includes('refuse')) {
      return {
        answer: `**Consent & Refusal Guidance**

I understand you're dealing with a consent-related situation. Here's guidance based on the HBS ethical framework:

**Key Principles:**
1. **Patient Autonomy** — The patient has the right to accept or refuse any intervention
2. **Informed Decision** — Ensure the patient understands benefits, risks, and alternatives
3. **Documentation** — All consent discussions must be documented

**SPIKES Communication Protocol:**
- **S**etting: Private, adequate time
- **P**erception: What does the patient know?
- **I**nvitation: How much do they want to know?
- **K**nowledge: Share clearly and compassionately
- **E**mpathy: Respond to emotions
- **S**trategy: Summarize next steps

**Suggested Documentation:**
"Patient was informed of [procedure], including benefits, risks, and alternatives. Patient [consented/declined] after discussion."`,
        tags: ['ethics', 'communication', 'documentation'],
        riskLevel: 'medium',
        referencedPolicies: ['HBS-ETH-001', 'HBS-COMM-SPIKES'],
      };
    }
    return {
      answer: `I'm here to help with ethical guidance, communication strategies, and documentation.

**I can assist with:**
- Explaining decisions ethically
- Navigating difficult conversations
- Generating consent documentation
- Assessing ethical and communication risks

**I cannot provide:**
- Medical diagnosis
- Treatment recommendations
- Clinical advice

How can I help you today?`,
      tags: ['ethics', 'communication'],
      riskLevel: 'low',
      referencedPolicies: [],
    };
  }

  if (role === 'patient') {
    if (lowerQuestion.includes('right') || lowerQuestion.includes('refuse')) {
      return {
        answer: `**Your Patient Rights** 📋

As a patient, you have important rights:

✅ **Right to Information**
You deserve clear explanations in terms you understand.

✅ **Right to Consent**
No procedure happens without your agreement.

✅ **Right to Refuse**
You can say no to any treatment, even if recommended.

✅ **Right to Second Opinion**
You can ask another doctor's perspective.

✅ **Right to Privacy**
Your medical information stays confidential.

**Questions to Ask Your Doctor:**
- "What are my options?"
- "What if I wait or do nothing?"
- "What are the risks of each option?"
- "Can you explain in simpler terms?"

Remember: Taking time to decide is okay. Your choice matters.`,
        tags: ['rights', 'communication'],
        riskLevel: 'low',
        referencedPolicies: ['HBS-PAT-RIGHTS'],
      };
    }
    return {
      answer: `Hello! I'm here to help you understand your care and rights.

**I can help you:**
- Understand your rights
- Know what to expect
- Prepare questions for your doctor
- Understand medical processes

**Please Note:**
I cannot give medical advice. For health questions, please talk to your doctor.

What would you like to know?`,
      tags: ['rights'],
      riskLevel: 'low',
      referencedPolicies: [],
    };
  }

  if (role === 'admin') {
    if (lowerQuestion.includes('incident') || lowerQuestion.includes('pattern')) {
      return {
        answer: `**Incident Analysis — Last 30 Days** 📊

**Summary:**
| Metric | Value | Trend |
|--------|-------|-------|
| Total Incidents | 42 | ↓ 8% |
| High-Risk | 8 | → Stable |
| Resolution Rate | 83% | ↑ 5% |
| Avg Resolution | 4.2h | ↓ 12% |

**Top Patterns Identified:**
1. **Consent Issues** — 40% of incidents, peaks Mon/Fri
2. **Access Violations** — 25% of incidents, evening hours
3. **Documentation Gaps** — 20% of incidents, 3 departments

**Risk Clusters:**
- Department A: 12 incidents (attention needed)
- Weekend shifts: Higher error rate

**Recommended Actions:**
1. Schedule targeted training for high-incident departments
2. Review consent procedures
3. Add oversight during peak periods
4. Follow-up audit in 2 weeks`,
        tags: ['governance', 'risk', 'policy'],
        riskLevel: 'medium',
        referencedPolicies: ['HBS-GOV-AUDIT', 'HBS-INC-001'],
      };
    }
    return {
      answer: `I'm here to help with governance analysis.

**Available Functions:**
- Analyze incidents and patterns
- Explain policy violations
- Generate governance summaries
- Suggest improvements

**Limitations:**
- Cannot modify policies
- Cannot change access controls
- All changes need human approval

What would you like to analyze?`,
      tags: ['governance'],
      riskLevel: 'low',
      referencedPolicies: [],
    };
  }

  // Ministry role
  if (lowerQuestion.includes('report') || lowerQuestion.includes('summary')) {
    return {
      answer: `**Governance Summary — Last 30 Days** 🏛️

**Overall Status:** ✅ Good (Score: 87/100)

| KPI | Value | Status |
|-----|-------|--------|
| Active Tenants | 4/5 | ✅ |
| Total Decisions | 12,450 | ↑ 8% |
| Policy Compliance | 92% | ✅ |
| Incidents | 42 | ↓ 12% |
| High-Risk | 8 | → |
| Avg Resolution | 4.2h | ✅ |

**Areas Requiring Attention:**
1. ⚠️ Moldova: Risk threshold exceeded 3 times
2. ⚠️ Ethics compliance at 88% (target: 90%)
3. 🔴 2 unresolved high-risk incidents

**Strategic Recommendations:**
1. **Immediate:** Review pending high-risk incidents
2. **Short-term:** Address ethics compliance gap
3. **Medium-term:** Moldova team training
4. **Strategic:** Increase threshold review frequency

Would you like me to generate a full PDF report?`,
      tags: ['governance', 'risk', 'policy'],
      riskLevel: 'low',
      referencedPolicies: ['HBS-GOV-001', 'HBS-REPORT-001'],
    };
  }

  return {
    answer: `I'm here to provide ministry-level governance insights.

**Available Functions:**
- Summarize governance across tenants
- Explain risk profiles
- Generate Ministry Reports
- Provide strategic recommendations

How can I assist you today?`,
    tags: ['governance'],
    riskLevel: 'low',
    referencedPolicies: [],
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function AIAssistantPage() {
  const [selectedTenant, setSelectedTenant] = useState(TENANTS[0]);
  const [selectedRole, setSelectedRole] = useState<AIRole>('doctor');
  const [selectedModule, setSelectedModule] = useState<AIModule>('health');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset messages when role changes
  useEffect(() => {
    setMessages([]);
  }, [selectedRole, selectedTenant]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(selectedRole, selectedModule, input);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        tags: response.tags,
        riskLevel: response.riskLevel,
        referencedPolicies: response.referencedPolicies,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        riskLevel: 'low',
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      ethics: 'bg-purple-500/20 text-purple-400',
      risk: 'bg-orange-500/20 text-orange-400',
      communication: 'bg-blue-500/20 text-blue-400',
      governance: 'bg-cyan-500/20 text-cyan-400',
      rights: 'bg-green-500/20 text-green-400',
      documentation: 'bg-yellow-500/20 text-yellow-400',
      policy: 'bg-indigo-500/20 text-indigo-400',
    };
    return colors[tag] || 'bg-gray-500/20 text-gray-400';
  };

  const currentRole = ROLES.find(r => r.id === selectedRole)!;
  const quickActions = QUICK_ACTIONS[selectedRole];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#161B22] border-r border-[#1F242C] flex flex-col">
        <div className="p-4 border-b border-[#1F242C]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">AI</div>
            <div>
              <div className="font-bold">AI Assistant</div>
              <div className="text-xs text-[#8B949E]">HBS Governance</div>
            </div>
          </Link>
        </div>

        {/* Tenant Selector */}
        <div className="p-4 border-b border-[#1F242C]">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider mb-2 block">Tenant</label>
          <select
            value={selectedTenant.id}
            onChange={(e) => setSelectedTenant(TENANTS.find(t => t.id === e.target.value)!)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm"
          >
            {TENANTS.map(t => (
              <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
            ))}
          </select>
        </div>

        {/* Role Selector */}
        <div className="p-4 border-b border-[#1F242C]">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider mb-2 block">Role</label>
          <div className="space-y-2">
            {ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedRole === role.id
                    ? 'bg-[#00E0B8]/20 border border-[#00E0B8]'
                    : 'bg-[#0D1117] border border-[#1F242C] hover:border-[#00E0B8]/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{role.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{role.label}</div>
                    <div className="text-xs text-[#8B949E]">{role.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Module Selector */}
        <div className="p-4">
          <label className="text-xs text-[#8B949E] uppercase tracking-wider mb-2 block">Module</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value as AIModule)}
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm"
          >
            {MODULES.map(m => (
              <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-auto p-4 border-t border-[#1F242C]">
          <Link href="/admin/analytics" className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-white">
            <span>📊</span> Analytics Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-[#161B22] border-b border-[#1F242C] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentRole.icon}</span>
            <div>
              <h1 className="font-semibold">{currentRole.label} Assistant</h1>
              <p className="text-xs text-[#8B949E]">{currentRole.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0D1117] rounded-lg text-sm">
              <span>{selectedTenant.flag}</span>
              <span>{selectedTenant.name}</span>
            </div>
            <button
              onClick={() => setShowContext(!showContext)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${showContext ? 'bg-[#00E0B8] text-[#0D1117]' : 'bg-[#0D1117] text-[#8B949E]'}`}
            >
              Context Panel
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{currentRole.icon}</div>
                  <h2 className="text-xl font-semibold mb-2">Welcome to {currentRole.label} Assistant</h2>
                  <p className="text-[#8B949E] mb-8 max-w-md mx-auto">{DISCLAIMERS[selectedRole]}</p>
                  
                  <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {quickActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleQuickAction(action)}
                        className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl text-left hover:border-[#00E0B8] transition-all"
                      >
                        <div className="font-medium text-sm">{action.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-[#00E0B8] text-[#0D1117]'
                          : 'bg-[#161B22] border border-[#1F242C]'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {message.tags?.map(tag => (
                          <span key={tag} className={`px-2 py-0.5 rounded text-xs ${getTagColor(tag)}`}>
                            {tag}
                          </span>
                        ))}
                        {message.riskLevel && message.riskLevel !== 'low' && (
                          <span className={`text-xs ${getRiskColor(message.riskLevel)}`}>
                            Risk: {message.riskLevel}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#00E0B8] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#00E0B8] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#00E0B8] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length > 0 && (
              <div className="px-6 py-3 border-t border-[#1F242C] flex gap-2 overflow-x-auto">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-xs whitespace-nowrap hover:border-[#00E0B8] transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-[#1F242C]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Ask the ${currentRole.label} Assistant...`}
                  className="flex-1 px-4 py-3 bg-[#161B22] border border-[#1F242C] rounded-xl focus:outline-none focus:border-[#00E0B8] transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 bg-[#00E0B8] text-[#0D1117] rounded-xl font-medium hover:bg-[#00E0B8]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-[#8B949E] mt-2 text-center">
                {DISCLAIMERS[selectedRole]}
              </p>
            </div>
          </div>

          {/* Context Panel */}
          {showContext && (
            <aside className="w-80 bg-[#161B22] border-l border-[#1F242C] overflow-y-auto">
              <div className="p-4 border-b border-[#1F242C]">
                <h3 className="font-semibold text-sm">Context Panel</h3>
              </div>

              {/* Active Policies */}
              <div className="p-4 border-b border-[#1F242C]">
                <h4 className="text-xs text-[#8B949E] uppercase tracking-wider mb-3">Active Policies</h4>
                <div className="space-y-2">
                  {['HBS-ETH-001', 'HBS-COMM-001', 'HBS-RISK-001'].map(policy => (
                    <div key={policy} className="flex items-center justify-between p-2 bg-[#0D1117] rounded-lg">
                      <span className="text-xs font-mono">{policy}</span>
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Level */}
              <div className="p-4 border-b border-[#1F242C]">
                <h4 className="text-xs text-[#8B949E] uppercase tracking-wider mb-3">Risk Level</h4>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-400">3.2</span>
                  </div>
                  <div>
                    <div className="font-medium text-green-400">Low Risk</div>
                    <div className="text-xs text-[#8B949E]">Within normal range</div>
                  </div>
                </div>
              </div>

              {/* Boundaries */}
              <div className="p-4 border-b border-[#1F242C]">
                <h4 className="text-xs text-[#8B949E] uppercase tracking-wider mb-3">Active Boundaries</h4>
                <div className="space-y-2">
                  {[
                    { name: 'No Medical Advice', status: 'active' },
                    { name: 'No Legal Advice', status: 'active' },
                    { name: 'Policy Aligned', status: 'active' },
                    { name: 'Tenant Scoped', status: 'active' },
                  ].map(boundary => (
                    <div key={boundary.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#00E0B8] rounded-full" />
                      <span>{boundary.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tenant Info */}
              <div className="p-4">
                <h4 className="text-xs text-[#8B949E] uppercase tracking-wider mb-3">Tenant Context</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedTenant.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{selectedTenant.name}</div>
                      <div className="text-xs text-[#8B949E]">{selectedTenant.id}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-[#0D1117] rounded-lg">
                      <div className="text-[#8B949E]">Module</div>
                      <div className="font-medium capitalize">{selectedModule}</div>
                    </div>
                    <div className="p-2 bg-[#0D1117] rounded-lg">
                      <div className="text-[#8B949E]">Role</div>
                      <div className="font-medium capitalize">{selectedRole}</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
