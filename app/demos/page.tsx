'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type DemoType = 'reasoning' | 'decision-tree' | 'boundaries' | 'assistant' | 'simulator';
type ReasoningMode = 'ministerial' | 'donor' | 'operational' | 'technical';
type AssistantMode = 'minister' | 'donor' | 'it-lead' | 'citizen';
type SimulatorScenario = 'crisis' | 'scaling' | 'transition' | 'audit';
type DecisionBranch = 'risk' | 'ethics' | 'budget' | 'sovereignty';

// ============================================
// DATA
// ============================================
const REASONING_MODES = {
  ministerial: {
    id: 'ministerial',
    title: 'Ministerial Briefing',
    icon: '🏛️',
    color: '#A371F7',
    description: 'Executive-level analysis for government decision makers',
    outputFormat: 'Strategic recommendation with policy implications',
    sampleQuery: 'Should we expand the IDP assistance program to include housing reconstruction grants?',
  },
  donor: {
    id: 'donor',
    title: 'Donor Alignment Check',
    icon: '🤝',
    color: '#EC4899',
    description: 'Verify compliance with donor requirements and funding conditions',
    outputFormat: 'Alignment assessment with compliance status',
    sampleQuery: 'Does the proposed emergency response comply with World Bank ESF requirements?',
  },
  operational: {
    id: 'operational',
    title: 'Operational Decision',
    icon: '⚙️',
    color: '#3CCB7F',
    description: 'Day-to-day operational guidance for program staff',
    outputFormat: 'Action recommendation with workflow steps',
    sampleQuery: 'How should we handle 500 applications flagged for potential duplication?',
  },
  technical: {
    id: 'technical',
    title: 'Technical Analysis',
    icon: '💻',
    color: '#00A3FF',
    description: 'System architecture and integration decisions',
    outputFormat: 'Technical recommendation with implementation approach',
    sampleQuery: 'Should we migrate the payment gateway integration to the new API version?',
  },
};

const POLICY_TREE_NODES = {
  root: {
    id: 'root',
    question: 'Policy Decision Required',
    branch: null as DecisionBranch | null,
    children: ['risk', 'ethics', 'budget', 'sovereignty'],
  },
  risk: {
    id: 'risk',
    question: 'Risk Assessment',
    branch: 'risk' as DecisionBranch,
    children: ['risk-high', 'risk-medium', 'risk-low'],
    criteria: [
      'Population affected (scale)',
      'Reversibility of decision',
      'Precedent implications',
      'External dependencies',
    ],
  },
  'risk-high': {
    id: 'risk-high',
    question: 'High Risk: Cabinet Approval Required',
    branch: 'risk' as DecisionBranch,
    outcome: 'Escalate to Cabinet with full impact assessment',
    children: [],
  },
  'risk-medium': {
    id: 'risk-medium',
    question: 'Medium Risk: Minister Approval',
    branch: 'risk' as DecisionBranch,
    outcome: 'Minister decision with risk mitigation plan',
    children: [],
  },
  'risk-low': {
    id: 'risk-low',
    question: 'Low Risk: Director Authority',
    branch: 'risk' as DecisionBranch,
    outcome: 'Proceed with standard monitoring',
    children: [],
  },
  ethics: {
    id: 'ethics',
    question: 'Ethical Review',
    branch: 'ethics' as DecisionBranch,
    children: ['ethics-clear', 'ethics-review', 'ethics-block'],
    criteria: [
      'Non-discrimination compliance',
      'Vulnerable population impact',
      'Human oversight requirements',
      'Transparency obligations',
    ],
  },
  'ethics-clear': {
    id: 'ethics-clear',
    question: 'Ethics: Cleared',
    branch: 'ethics' as DecisionBranch,
    outcome: 'Proceed - no ethical concerns identified',
    children: [],
  },
  'ethics-review': {
    id: 'ethics-review',
    question: 'Ethics: Review Required',
    branch: 'ethics' as DecisionBranch,
    outcome: 'Refer to Ethics Committee for assessment',
    children: [],
  },
  'ethics-block': {
    id: 'ethics-block',
    question: 'Ethics: Blocked',
    branch: 'ethics' as DecisionBranch,
    outcome: 'RED LINE - Cannot proceed under any circumstances',
    children: [],
  },
  budget: {
    id: 'budget',
    question: 'Budget Impact',
    branch: 'budget' as DecisionBranch,
    children: ['budget-within', 'budget-realloc', 'budget-new'],
    criteria: [
      'Within existing allocation',
      'Requires reallocation',
      'Needs new funding',
      'Multi-year implications',
    ],
  },
  'budget-within': {
    id: 'budget-within',
    question: 'Within Allocation',
    branch: 'budget' as DecisionBranch,
    outcome: 'Proceed with existing budget',
    children: [],
  },
  'budget-realloc': {
    id: 'budget-realloc',
    question: 'Reallocation Needed',
    branch: 'budget' as DecisionBranch,
    outcome: 'Finance Ministry approval required',
    children: [],
  },
  'budget-new': {
    id: 'budget-new',
    question: 'New Funding Required',
    branch: 'budget' as DecisionBranch,
    outcome: 'Parliament approval for supplementary budget',
    children: [],
  },
  sovereignty: {
    id: 'sovereignty',
    question: 'Sovereignty Check',
    branch: 'sovereignty' as DecisionBranch,
    children: ['sov-clear', 'sov-conditions', 'sov-block'],
    criteria: [
      'Data residency compliance',
      'National control maintained',
      'No external override capability',
      'Audit trail sovereignty',
    ],
  },
  'sov-clear': {
    id: 'sov-clear',
    question: 'Sovereignty: Maintained',
    branch: 'sovereignty' as DecisionBranch,
    outcome: 'Full national control preserved',
    children: [],
  },
  'sov-conditions': {
    id: 'sov-conditions',
    question: 'Sovereignty: Conditions Apply',
    branch: 'sovereignty' as DecisionBranch,
    outcome: 'Proceed with sovereignty safeguards',
    children: [],
  },
  'sov-block': {
    id: 'sov-block',
    question: 'Sovereignty: Compromised',
    branch: 'sovereignty' as DecisionBranch,
    outcome: 'BLOCKED - Sovereignty requirements not met',
    children: [],
  },
};

const BOUNDARY_SCENARIOS = [
  {
    id: 'red-line-discrimination',
    category: 'Red Line',
    title: 'Discriminatory Targeting',
    request: 'Exclude beneficiaries from eastern regions due to "security concerns"',
    analysis: {
      redLine: true,
      checks: [
        { name: 'Non-discrimination', status: 'VIOLATED', severity: 'critical' },
        { name: 'Geographic neutrality', status: 'VIOLATED', severity: 'critical' },
        { name: 'Legal compliance', status: 'BLOCKED', severity: 'critical' },
      ],
      escalation: 'NONE - Action prohibited regardless of authority level',
      hitlRequired: false,
      decision: 'ABSOLUTE_BLOCK',
    },
  },
  {
    id: 'red-line-override',
    category: 'Red Line',
    title: 'Emergency Stop Override',
    request: 'Disable ESS (Emergency Stop System) to process urgent payments',
    analysis: {
      redLine: true,
      checks: [
        { name: 'ESS integrity', status: 'PROTECTED', severity: 'critical' },
        { name: 'System safety', status: 'NON-NEGOTIABLE', severity: 'critical' },
      ],
      escalation: 'NONE - ESS cannot be disabled under any circumstances',
      hitlRequired: false,
      decision: 'ABSOLUTE_BLOCK',
    },
  },
  {
    id: 'escalation-budget',
    category: 'Escalation Path',
    title: 'Large Payment Authorization',
    request: 'Approve $15M emergency payment batch (exceeds $1M limit)',
    analysis: {
      redLine: false,
      checks: [
        { name: 'Amount threshold', status: 'EXCEEDED', severity: 'high' },
        { name: 'Emergency justification', status: 'VERIFIED', severity: 'ok' },
        { name: 'Funding availability', status: 'CONFIRMED', severity: 'ok' },
      ],
      escalation: 'Director → Deputy Minister → Minister (sequential approval)',
      hitlRequired: true,
      decision: 'ESCALATE',
    },
  },
  {
    id: 'escalation-policy',
    category: 'Escalation Path',
    title: 'Policy Exception Request',
    request: 'Extend eligibility to households above poverty threshold due to displacement',
    analysis: {
      redLine: false,
      checks: [
        { name: 'Policy deviation', status: 'FLAGGED', severity: 'medium' },
        { name: 'Humanitarian justification', status: 'STRONG', severity: 'ok' },
        { name: 'Precedent assessment', status: 'REVIEWED', severity: 'medium' },
      ],
      escalation: 'Program Manager → Policy Unit → Minister',
      hitlRequired: true,
      decision: 'ESCALATE_WITH_RECOMMENDATION',
    },
  },
  {
    id: 'hitl-ai-override',
    category: 'Human-in-the-Loop',
    title: 'AI Recommendation Override',
    request: 'Override AI fraud detection flagging 200 legitimate applications',
    analysis: {
      redLine: false,
      checks: [
        { name: 'Override authority', status: 'AUTHORIZED', severity: 'ok' },
        { name: 'Justification required', status: 'MANDATORY', severity: 'medium' },
        { name: 'Audit trail', status: 'RECORDING', severity: 'ok' },
      ],
      escalation: 'Operator → Supervisor verification → Batch approval',
      hitlRequired: true,
      decision: 'ALLOW_WITH_OVERSIGHT',
    },
  },
  {
    id: 'hitl-low-confidence',
    category: 'Human-in-the-Loop',
    title: 'Low Confidence AI Decision',
    request: 'Process eligibility batch with 72% AI confidence (below 85% threshold)',
    analysis: {
      redLine: false,
      checks: [
        { name: 'Confidence level', status: '72%', severity: 'warning' },
        { name: 'Sample review', status: 'REQUIRED', severity: 'medium' },
        { name: 'Human verification', status: 'MANDATORY', severity: 'medium' },
      ],
      escalation: 'AI recommendation → Human sample review → Batch decision',
      hitlRequired: true,
      decision: 'HUMAN_REVIEW_REQUIRED',
    },
  },
];

const ASSISTANT_MODES = {
  minister: {
    id: 'minister',
    title: 'Minister Mode',
    icon: '🏛️',
    color: '#A371F7',
    description: 'Strategic briefings and policy recommendations',
    tone: 'Executive, concise, decision-focused',
    capabilities: ['Policy analysis', 'Strategic recommendations', 'Risk briefings', 'Stakeholder summaries'],
    sampleGreeting: 'Good morning, Minister. I\'m ready to provide strategic briefings on social protection programs. How may I assist you today?',
  },
  donor: {
    id: 'donor',
    title: 'Donor Mode',
    icon: '🤝',
    color: '#EC4899',
    description: 'Funding tracking, compliance, and reporting',
    tone: 'Professional, transparent, data-driven',
    capabilities: ['Funding status', 'Compliance reports', 'Impact metrics', 'IATI queries'],
    sampleGreeting: 'Welcome. I can help you track funding allocations, monitor program compliance, and access impact data. What would you like to know?',
  },
  'it-lead': {
    id: 'it-lead',
    title: 'IT Lead Mode',
    icon: '💻',
    color: '#00A3FF',
    description: 'Technical documentation and system queries',
    tone: 'Technical, precise, solution-oriented',
    capabilities: ['System status', 'API documentation', 'Integration support', 'Troubleshooting'],
    sampleGreeting: 'IT Lead interface active. I can provide technical documentation, system status, and integration guidance. What\'s your query?',
  },
  citizen: {
    id: 'citizen',
    title: 'Citizen Explainer',
    icon: '👤',
    color: '#3CCB7F',
    description: 'Simple explanations for public understanding',
    tone: 'Friendly, simple, reassuring',
    capabilities: ['Eligibility info', 'Application status', 'Process explanations', 'Rights information'],
    sampleGreeting: 'Hello! I\'m here to help you understand social protection programs in simple terms. What would you like to know?',
  },
};

const SIMULATOR_SCENARIOS = {
  crisis: {
    id: 'crisis',
    title: 'Crisis Response',
    icon: '🚨',
    color: '#F85149',
    description: 'Simulate rapid response to emerging humanitarian crisis',
    parameters: [
      { name: 'Crisis Type', options: ['Flood', 'Conflict', 'Economic Shock', 'Pandemic'] },
      { name: 'Affected Population', options: ['100K', '500K', '1M', '5M'] },
      { name: 'Response Time', options: ['24 hours', '72 hours', '1 week', '2 weeks'] },
    ],
    metrics: ['Activation time', 'Coverage rate', 'Payment success', 'Cost per beneficiary'],
  },
  scaling: {
    id: 'scaling',
    title: 'Multi-Country Scaling',
    icon: '🌍',
    color: '#00A3FF',
    description: 'Simulate expanding IVYAR to multiple countries',
    parameters: [
      { name: 'Countries', options: ['2', '3', '5', '10'] },
      { name: 'Federation Model', options: ['Full', 'Hybrid', 'Coordination Only'] },
      { name: 'Timeline', options: ['6 months', '12 months', '24 months'] },
    ],
    metrics: ['Deployment time', 'Resource requirements', 'Interoperability score', 'Cost projection'],
  },
  transition: {
    id: 'transition',
    title: 'Government Transition',
    icon: '🔄',
    color: '#F59E0B',
    description: 'Simulate continuity during government change',
    parameters: [
      { name: 'Transition Type', options: ['Election', 'Cabinet Reshuffle', 'Ministry Merger'] },
      { name: 'Preparation Time', options: ['1 month', '3 months', '6 months'] },
      { name: 'Handover Depth', options: ['Full', 'Standard', 'Minimal'] },
    ],
    metrics: ['Service continuity', 'Knowledge transfer', 'Staff retention', 'Policy alignment'],
  },
  audit: {
    id: 'audit',
    title: 'Donor Audit',
    icon: '📋',
    color: '#A371F7',
    description: 'Simulate comprehensive donor audit scenario',
    parameters: [
      { name: 'Audit Scope', options: ['Financial', 'Compliance', 'Performance', 'Full'] },
      { name: 'Audit Body', options: ['World Bank', 'EU', 'UN', 'National'] },
      { name: 'Notice Period', options: ['2 weeks', '1 month', '3 months'] },
    ],
    metrics: ['Document readiness', 'Compliance score', 'Finding risk', 'Response time'],
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AIDemsV10Page() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('reasoning');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] flex items-center justify-center font-bold text-[#0D1117] text-sm rounded-lg">
              🧠
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Cognitive Governance Center</span>
              <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B949E]">AI-Powered Decision Support</span>
            <button className="text-sm bg-[#A371F7] text-white px-4 py-2 rounded font-medium hover:bg-[#B485FF]">
              Request Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-[#1a1a2e] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🧠</span>
            <span className="text-sm bg-[#A371F7]/20 text-[#A371F7] px-3 py-1 rounded-full font-medium">
              Sovereign Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Cognitive Governance Center</h1>
          <p className="text-[#8B949E] max-w-2xl">
            Interactive demonstrations of IVYAR's AI-powered governance capabilities. 
            Explore reasoning engines, policy decision trees, ethical boundaries, and national-scale simulation.
          </p>
        </div>
      </section>

      {/* Demo Tabs */}
      <section className="border-b border-[#1F242C] sticky top-16 bg-[#0D1117] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'reasoning', label: 'Live Reasoning', icon: '🧠' },
              { id: 'decision-tree', label: 'Policy Tree', icon: '🌳' },
              { id: 'boundaries', label: 'Ethical Boundaries', icon: '🛡️' },
              { id: 'assistant', label: 'AI Assistant', icon: '🤖' },
              { id: 'simulator', label: 'National Simulator', icon: '☁️' },
            ].map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id as DemoType)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeDemo === demo.id
                    ? 'bg-[#A371F7] text-white'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{demo.icon}</span>
                <span>{demo.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {activeDemo === 'reasoning' && <ReasoningDemo />}
          {activeDemo === 'decision-tree' && <PolicyTreeDemo />}
          {activeDemo === 'boundaries' && <BoundariesDemo />}
          {activeDemo === 'assistant' && <AssistantDemo />}
          {activeDemo === 'simulator' && <SimulatorDemo />}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B949E]">
            Cognitive Governance Center v10.0 — Sovereign Intelligence for Democratic Governance
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// REASONING DEMO
// ============================================
function ReasoningDemo() {
  const [mode, setMode] = useState<ReasoningMode>('ministerial');
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const selectedMode = REASONING_MODES[mode];

  const processQuery = async () => {
    setIsProcessing(true);
    setResult(null);

    // Simulate processing
    await new Promise(r => setTimeout(r, 2000));

    const results = {
      ministerial: {
        summary: 'Strategic Recommendation: PROCEED WITH MODIFICATIONS',
        confidence: 87,
        sections: [
          { title: 'Policy Alignment', content: 'Aligns with National Social Protection Strategy 2024-2030. Supports SDG 1.3 (social protection systems).' },
          { title: 'Budget Impact', content: 'Estimated additional allocation: $45M. Can be sourced from underspent Q3 allocation with Finance Ministry approval.' },
          { title: 'Risk Assessment', content: 'Medium risk. Main concern: potential for scope creep. Recommend pilot in 3 oblasts before national rollout.' },
          { title: 'Stakeholder Impact', content: 'Positive reception expected from international partners. May face questions from fiscal conservatives.' },
        ],
        recommendation: 'Proceed with phased implementation. Present to Cabinet with 3-oblast pilot proposal.',
        nextSteps: ['Draft Cabinet submission', 'Consult Finance Ministry', 'Prepare donor briefing'],
      },
      donor: {
        summary: 'Compliance Assessment: ALIGNED WITH CONDITIONS',
        confidence: 92,
        sections: [
          { title: 'World Bank ESF', content: 'ESS1 (Risk Management): Compliant. ESS10 (Stakeholder Engagement): Requires enhanced consultation.' },
          { title: 'IATI Reporting', content: 'Activity will be IATI-publishable. Recommend adding humanitarian scope markers.' },
          { title: 'Fiduciary Standards', content: 'Within acceptable parameters. Existing financial controls sufficient.' },
          { title: 'Results Framework', content: 'Aligns with agreed indicators. Additional indicator for housing outcomes recommended.' },
        ],
        recommendation: 'Proceed with minor adjustments to stakeholder engagement plan.',
        nextSteps: ['Update ESS10 documentation', 'Add IATI markers', 'Brief task team leader'],
      },
      operational: {
        summary: 'Operational Guidance: PROCESS WITH VERIFICATION',
        confidence: 94,
        sections: [
          { title: 'Deduplication Analysis', content: '340 of 500 flags are likely false positives based on name similarity. 160 require manual review.' },
          { title: 'Recommended Workflow', content: 'Batch approve 340 with confidence >95%. Route 160 to verification queue.' },
          { title: 'Resource Requirement', content: 'Estimated 4 staff-hours for manual review. Can be completed within SLA.' },
          { title: 'Risk Mitigation', content: 'Document batch decision. Flag for quarterly audit sample.' },
        ],
        recommendation: 'Split batch: auto-approve high-confidence, manual review remainder.',
        nextSteps: ['Execute batch split', 'Assign reviewers', 'Log decision rationale'],
      },
      technical: {
        summary: 'Technical Recommendation: PROCEED WITH STAGING',
        confidence: 89,
        sections: [
          { title: 'API Compatibility', content: 'New API version is backward compatible. Breaking changes only in deprecated endpoints.' },
          { title: 'Performance Impact', content: 'Expected 15% improvement in response times. New pagination reduces memory usage.' },
          { title: 'Migration Effort', content: 'Estimated 3 days development, 2 days testing. Low complexity.' },
          { title: 'Rollback Plan', content: 'Automatic rollback available. Blue-green deployment recommended.' },
        ],
        recommendation: 'Proceed with migration. Use staging environment for validation.',
        nextSteps: ['Deploy to staging', 'Run integration tests', 'Schedule production window'],
      },
    };

    setResult(results[mode]);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Live Reasoning Engine</h2>
        <p className="text-[#8B949E]">
          Select a reasoning mode and submit a query to see AI-powered analysis with transparent reasoning.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(REASONING_MODES).map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as ReasoningMode); setResult(null); }}
            className={`p-4 rounded-xl text-left transition-all ${
              mode === m.id
                ? 'border-2'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
            style={mode === m.id ? { borderColor: m.color, backgroundColor: `${m.color}10` } : {}}
          >
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className="font-semibold text-sm">{m.title}</div>
            <div className="text-xs text-[#8B949E] mt-1">{m.description}</div>
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Query ({selectedMode.title})</label>
          <textarea
            value={query || selectedMode.sampleQuery}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-24 bg-[#0D1117] border border-[#1F242C] rounded-lg p-3 text-sm resize-none"
            placeholder="Enter your governance query..."
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6E7681]">Output format: {selectedMode.outputFormat}</span>
          <button
            onClick={processQuery}
            disabled={isProcessing}
            className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: selectedMode.color }}
          >
            {isProcessing ? 'Analyzing...' : 'Analyze Query'}
          </button>
        </div>
      </div>

      {/* Results */}
      {isProcessing && (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-[#A371F7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8B949E]">Processing with Sovereign Intelligence Layer...</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] flex items-center justify-between" style={{ backgroundColor: `${selectedMode.color}10` }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{selectedMode.icon}</span>
              <div>
                <div className="font-semibold">{result.summary}</div>
                <div className="text-xs text-[#8B949E]">Confidence: {result.confidence}%</div>
              </div>
            </div>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl"
              style={{ backgroundColor: `${selectedMode.color}20`, color: selectedMode.color }}
            >
              {result.confidence}%
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {result.sections.map((section: any, i: number) => (
                <div key={i} className="bg-[#0D1117] rounded-lg p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: selectedMode.color }}>
                    {section.title}
                  </div>
                  <p className="text-sm text-[#8B949E]">{section.content}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 mb-4">
              <div className="text-xs font-semibold text-[#3CCB7F] mb-2">RECOMMENDATION</div>
              <p className="text-sm">{result.recommendation}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#8B949E] mb-2">NEXT STEPS</div>
              <div className="flex flex-wrap gap-2">
                {result.nextSteps.map((step: string, i: number) => (
                  <span key={i} className="text-xs bg-[#1F242C] px-3 py-1 rounded-full">
                    {i + 1}. {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// POLICY TREE DEMO
// ============================================
function PolicyTreeDemo() {
  const [activeBranch, setActiveBranch] = useState<DecisionBranch | null>(null);
  const [selectedNode, setSelectedNode] = useState<string>('root');

  const branches = [
    { id: 'risk', label: 'Risk Assessment', icon: '⚠️', color: '#F59E0B' },
    { id: 'ethics', label: 'Ethical Review', icon: '⚖️', color: '#A371F7' },
    { id: 'budget', label: 'Budget Impact', icon: '💰', color: '#3CCB7F' },
    { id: 'sovereignty', label: 'Sovereignty', icon: '🛡️', color: '#00A3FF' },
  ];

  const currentNode = POLICY_TREE_NODES[selectedNode as keyof typeof POLICY_TREE_NODES];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Policy Decision Tree</h2>
        <p className="text-[#8B949E]">
          Visual policy tree with branches for risk, ethics, budget, and sovereignty assessment.
        </p>
      </div>

      {/* Branch Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => { setActiveBranch(branch.id as DecisionBranch); setSelectedNode(branch.id); }}
            className={`p-4 rounded-xl text-center transition-all ${
              activeBranch === branch.id
                ? 'border-2'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
            style={activeBranch === branch.id ? { borderColor: branch.color, backgroundColor: `${branch.color}10` } : {}}
          >
            <div className="text-3xl mb-2">{branch.icon}</div>
            <div className="font-semibold text-sm">{branch.label}</div>
          </button>
        ))}
      </div>

      {/* Tree Visualization */}
      {activeBranch && (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>{branches.find(b => b.id === activeBranch)?.icon}</span>
              {branches.find(b => b.id === activeBranch)?.label} Branch
            </h3>
          </div>

          {/* Criteria */}
          {currentNode?.criteria && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-[#8B949E] mb-3">ASSESSMENT CRITERIA</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentNode.criteria.map((c, i) => (
                  <div key={i} className="bg-[#0D1117] rounded-lg p-3 text-center">
                    <span className="text-sm">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentNode?.children?.map((childId) => {
              const child = POLICY_TREE_NODES[childId as keyof typeof POLICY_TREE_NODES];
              const branchColor = branches.find(b => b.id === activeBranch)?.color;
              return (
                <button
                  key={childId}
                  onClick={() => setSelectedNode(childId)}
                  className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 text-left hover:border-[#3D444D] transition-all"
                >
                  <div className="font-medium mb-2">{child?.question}</div>
                  {child?.outcome && (
                    <div 
                      className="text-xs p-2 rounded mt-2"
                      style={{ backgroundColor: `${branchColor}10`, color: branchColor }}
                    >
                      {child.outcome}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Tree Diagram */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Complete Policy Decision Framework</h3>
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-[#8B949E]">{`
                              ┌────────────────────────────┐
                              │    POLICY DECISION         │
                              │    REQUIRED                │
                              └──────────────┬─────────────┘
                                             │
        ┌────────────────────┬───────────────┼───────────────┬────────────────────┐
        │                    │               │               │                    │
        ▼                    ▼               ▼               ▼                    │
   ┌─────────┐         ┌─────────┐     ┌─────────┐     ┌─────────┐               │
   │  RISK   │         │ ETHICS  │     │ BUDGET  │     │SOVEREIGN│               │
   │⚠️ Yellow│         │⚖️ Purple│     │💰 Green │     │🛡️ Blue  │               │
   └────┬────┘         └────┬────┘     └────┬────┘     └────┬────┘               │
        │                   │               │               │                    │
   ┌────┼────┐         ┌────┼────┐     ┌────┼────┐     ┌────┼────┐               │
   │    │    │         │    │    │     │    │    │     │    │    │               │
   ▼    ▼    ▼         ▼    ▼    ▼     ▼    ▼    ▼     ▼    ▼    ▼               │
  HIGH MED  LOW     CLEAR REV BLOCK  WITH REAL  NEW  CLEAR COND BLOCK           │
   │    │    │         │    │    │     │    │    │     │    │    │               │
   ▼    ▼    ▼         ▼    ▼    ▼     ▼    ▼    ▼     ▼    ▼    ▼               │
Cabinet Min  Dir    Proceed Ethics 🔴   OK  FinMin Parl  OK  Safe  🔴            │
Approval     Auth           Comm   RED     Approval     guards  RED             │
                            LINE                        LINE                    │
          `}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BOUNDARIES DEMO
// ============================================
function BoundariesDemo() {
  const [selectedScenario, setSelectedScenario] = useState(BOUNDARY_SCENARIOS[0]);

  const categories = ['Red Line', 'Escalation Path', 'Human-in-the-Loop'];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Ethical Boundaries Engine</h2>
        <p className="text-[#8B949E]">
          Explore red lines, escalation paths, and human-in-the-loop requirements.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Red Line (Absolute Block)', color: '#F85149', icon: '🔴' },
          { label: 'Escalation Required', color: '#F59E0B', icon: '⚠️' },
          { label: 'Human-in-the-Loop', color: '#00A3FF', icon: '👤' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span>{item.icon}</span>
            <span style={{ color: item.color }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BOUNDARY_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario)}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedScenario.id === scenario.id
                ? 'border-2 border-[#A371F7] bg-[#A371F7]/10'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded ${
                scenario.category === 'Red Line' ? 'bg-[#F85149]/20 text-[#F85149]' :
                scenario.category === 'Escalation Path' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                'bg-[#00A3FF]/20 text-[#00A3FF]'
              }`}>
                {scenario.category}
              </span>
            </div>
            <div className="font-medium text-sm">{scenario.title}</div>
          </button>
        ))}
      </div>

      {/* Scenario Detail */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className={`p-4 border-b border-[#1F242C] ${
          selectedScenario.analysis.redLine ? 'bg-[#F85149]/10' : 'bg-[#0D1117]'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${selectedScenario.analysis.redLine ? '' : ''}`}>
              {selectedScenario.analysis.redLine ? '🔴' : selectedScenario.analysis.hitlRequired ? '👤' : '⚠️'}
            </span>
            <div>
              <h3 className="font-semibold">{selectedScenario.title}</h3>
              <span className={`text-xs ${
                selectedScenario.category === 'Red Line' ? 'text-[#F85149]' :
                selectedScenario.category === 'Escalation Path' ? 'text-[#F59E0B]' :
                'text-[#00A3FF]'
              }`}>
                {selectedScenario.category}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Request */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#8B949E] mb-2">REQUEST</div>
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <code className="text-sm text-[#F59E0B]">{selectedScenario.request}</code>
            </div>
          </div>

          {/* Checks */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#8B949E] mb-2">BOUNDARY CHECKS</div>
            <div className="space-y-2">
              {selectedScenario.analysis.checks.map((check, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
                  <span className="text-sm">{check.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    check.severity === 'critical' ? 'bg-[#F85149]/20 text-[#F85149]' :
                    check.severity === 'ok' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                    'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-[#8B949E] mb-2">ESCALATION PATH</div>
            <div className="bg-[#0D1117] rounded-lg p-4">
              <p className="text-sm">{selectedScenario.analysis.escalation}</p>
            </div>
          </div>

          {/* Decision */}
          <div className={`p-4 rounded-lg ${
            selectedScenario.analysis.decision === 'ABSOLUTE_BLOCK' ? 'bg-[#F85149]/10 border border-[#F85149]' :
            selectedScenario.analysis.decision === 'ESCALATE' || selectedScenario.analysis.decision === 'ESCALATE_WITH_RECOMMENDATION' ? 'bg-[#F59E0B]/10 border border-[#F59E0B]' :
            'bg-[#00A3FF]/10 border border-[#00A3FF]'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {selectedScenario.analysis.decision === 'ABSOLUTE_BLOCK' ? '🛑' :
                 selectedScenario.analysis.decision.includes('ESCALATE') ? '⚠️' : '👤'}
              </span>
              <div>
                <div className="font-bold">
                  {selectedScenario.analysis.decision.replace(/_/g, ' ')}
                </div>
                {selectedScenario.analysis.hitlRequired && (
                  <span className="text-xs text-[#00A3FF]">Human oversight required</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ASSISTANT DEMO
// ============================================
function AssistantDemo() {
  const [mode, setMode] = useState<AssistantMode>('minister');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedMode = ASSISTANT_MODES[mode];

  useEffect(() => {
    setMessages([{ role: 'assistant', content: selectedMode.sampleGreeting }]);
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      const responses: Record<AssistantMode, string> = {
        minister: `Based on my analysis of the current situation:

**Key Points:**
1. Program coverage has reached 94% of eligible population
2. Budget utilization is at 87% with Q4 runway secure
3. Donor confidence remains high (98% positive feedback)

**Recommendation:** Proceed with planned expansion to reconstruction support. The operational foundation is solid.

Shall I prepare a Cabinet brief on this topic?`,
        donor: `Here's the funding status overview:

**Allocation Summary:**
- Total committed: $4.2B
- Disbursed: $3.1B (74%)
- Pipeline: $1.1B

**IATI Compliance:** 99.2%
**Next Report Due:** February 15, 2026

All transactions are blockchain-verified and audit-ready. Would you like me to generate a detailed funding report?`,
        'it-lead': `System status check complete:

**Infrastructure:**
- All services: ✅ Operational
- API latency (p95): 142ms
- Database replication: Healthy

**Recent Deployments:**
- HBS Core v10.0.2 deployed 2 days ago
- No incidents reported

**Pending:**
- Security patch scheduled for Saturday maintenance window

Need more details on any component?`,
        citizen: `I'm happy to help explain this simply!

**Your Benefits:**
You may be eligible for social assistance if:
- Your household income is below the threshold
- You have valid identification
- You live in an eligible area

**How to Apply:**
1. Visit your local social services office
2. Bring your ID and proof of address
3. Fill out a simple form

The process usually takes about 2 weeks. Would you like help finding your nearest office?`,
      };

      setMessages(prev => [...prev, { role: 'assistant', content: responses[mode] }]);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">AI Governance Assistant</h2>
        <p className="text-[#8B949E]">
          Context-aware assistant with specialized modes for different stakeholders.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(ASSISTANT_MODES).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as AssistantMode)}
            className={`p-4 rounded-xl text-left transition-all ${
              mode === m.id
                ? 'border-2'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
            style={mode === m.id ? { borderColor: m.color, backgroundColor: `${m.color}10` } : {}}
          >
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className="font-semibold text-sm">{m.title}</div>
            <div className="text-xs text-[#8B949E] mt-1">{m.tone}</div>
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C] flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: `${selectedMode.color}20` }}
          >
            {selectedMode.icon}
          </div>
          <div>
            <div className="font-semibold text-sm">{selectedMode.title}</div>
            <div className="text-xs text-[#8B949E]">{selectedMode.description}</div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-4 rounded-xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'text-[#0D1117]' 
                    : 'bg-[#0D1117] border border-[#1F242C]'
                }`}
                style={msg.role === 'user' ? { backgroundColor: selectedMode.color } : {}}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#1F242C]">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Ask as ${selectedMode.title.toLowerCase().replace(' mode', '')}...`}
              className="flex-1 bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: selectedMode.color }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SIMULATOR DEMO
// ============================================
function SimulatorDemo() {
  const [scenario, setScenario] = useState<SimulatorScenario>('crisis');
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const selectedScenario = SIMULATOR_SCENARIOS[scenario];

  const runSimulation = () => {
    setIsSimulating(true);
    setResults(null);

    setTimeout(() => {
      const simulationResults = {
        crisis: {
          activationTime: '4.2 hours',
          coverageRate: '89%',
          paymentSuccess: '99.4%',
          costPerBeneficiary: '$12.40',
          timeline: [
            { time: '0h', event: 'Crisis detected by Anticipation Engine' },
            { time: '0.5h', event: 'Alert escalated to Minister' },
            { time: '1h', event: 'Emergency protocols activated' },
            { time: '2h', event: 'Beneficiary lists generated' },
            { time: '4h', event: 'First payments disbursed' },
          ],
        },
        scaling: {
          deploymentTime: '14 months',
          resourceRequirements: '45 FTE',
          interoperabilityScore: '87%',
          costProjection: '$12.4M',
          timeline: [
            { time: 'M1-3', event: 'Assessment and planning' },
            { time: 'M4-6', event: 'Federation hub deployment' },
            { time: 'M7-9', event: 'Country 1-2 onboarding' },
            { time: 'M10-12', event: 'Country 3-5 onboarding' },
            { time: 'M13-14', event: 'Integration and stabilization' },
          ],
        },
        transition: {
          serviceContinuity: '99.2%',
          knowledgeTransfer: '94%',
          staffRetention: '87%',
          policyAlignment: '91%',
          timeline: [
            { time: 'W1', event: 'Transition team briefed' },
            { time: 'W2', event: 'Documentation handover' },
            { time: 'W3', event: 'System access transfer' },
            { time: 'W4', event: 'Policy alignment review' },
          ],
        },
        audit: {
          documentReadiness: '96%',
          complianceScore: '98.4%',
          findingRisk: 'Low',
          responseTime: '24 hours',
          timeline: [
            { time: 'D1', event: 'Audit notification received' },
            { time: 'D2', event: 'Documentation package assembled' },
            { time: 'D3-5', event: 'Auditor interviews and review' },
            { time: 'D6', event: 'Preliminary findings' },
            { time: 'D7', event: 'Response submitted' },
          ],
        },
      };

      setResults(simulationResults[scenario]);
      setIsSimulating(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">National Simulator</h2>
        <p className="text-[#8B949E]">
          Simulate complex governance scenarios: crisis response, multi-country scaling, government transition, and audits.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(SIMULATOR_SCENARIOS).map((s) => (
          <button
            key={s.id}
            onClick={() => { setScenario(s.id as SimulatorScenario); setResults(null); }}
            className={`p-4 rounded-xl text-left transition-all ${
              scenario === s.id
                ? 'border-2'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D]'
            }`}
            style={scenario === s.id ? { borderColor: s.color, backgroundColor: `${s.color}10` } : {}}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-semibold text-sm">{s.title}</div>
            <div className="text-xs text-[#8B949E] mt-1">{s.description}</div>
          </button>
        ))}
      </div>

      {/* Parameters */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Simulation Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {selectedScenario.parameters.map((param, i) => (
            <div key={i}>
              <label className="block text-sm font-medium mb-2">{param.name}</label>
              <select
                value={parameters[param.name] || param.options[0]}
                onChange={(e) => setParameters({ ...parameters, [param.name]: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-2 text-sm"
              >
                {param.options.map((opt, j) => (
                  <option key={j} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full py-3 rounded-lg font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: selectedScenario.color }}
        >
          {isSimulating ? 'Running Simulation...' : 'Run Simulation'}
        </button>
      </div>

      {/* Results */}
      {isSimulating && (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: selectedScenario.color }}></div>
          <p className="text-[#8B949E]">Running {selectedScenario.title} simulation...</p>
        </div>
      )}

      {results && !isSimulating && (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]" style={{ backgroundColor: `${selectedScenario.color}10` }}>
            <h3 className="font-semibold flex items-center gap-2">
              <span>{selectedScenario.icon}</span>
              {selectedScenario.title} Results
            </h3>
          </div>
          <div className="p-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {selectedScenario.metrics.map((metric, i) => {
                const value = Object.values(results)[i];
                return (
                  <div key={i} className="bg-[#0D1117] rounded-lg p-4 text-center">
                    <div className="text-xl font-bold" style={{ color: selectedScenario.color }}>
                      {value as string}
                    </div>
                    <div className="text-xs text-[#8B949E]">{metric}</div>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <div>
              <div className="text-xs font-semibold text-[#8B949E] mb-3">SIMULATION TIMELINE</div>
              <div className="space-y-3">
                {results.timeline.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div 
                      className="w-16 text-xs font-mono text-center py-1 rounded"
                      style={{ backgroundColor: `${selectedScenario.color}20`, color: selectedScenario.color }}
                    >
                      {item.time}
                    </div>
                    <div className="flex-1 text-sm text-[#8B949E]">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
