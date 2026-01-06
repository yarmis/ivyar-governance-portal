'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type DemoType = 'reasoning' | 'decision-tree' | 'boundaries' | 'assistant' | 'simulator';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  reasoning?: string[];
}

interface DecisionNode {
  id: string;
  question: string;
  options: { label: string; nextId: string | null; outcome?: string }[];
}

// ============================================
// DEMO DATA
// ============================================
const DECISION_TREE: Record<string, DecisionNode> = {
  start: {
    id: 'start',
    question: 'What type of social protection decision needs to be made?',
    options: [
      { label: 'Beneficiary Eligibility', nextId: 'eligibility' },
      { label: 'Payment Authorization', nextId: 'payment' },
      { label: 'Program Allocation', nextId: 'allocation' },
      { label: 'Crisis Response', nextId: 'crisis' },
    ],
  },
  eligibility: {
    id: 'eligibility',
    question: 'Is the applicant\'s identity verified through national ID system?',
    options: [
      { label: 'Yes, verified', nextId: 'eligibility-income' },
      { label: 'No, not verified', nextId: null, outcome: '❌ DENIED: Identity verification required before processing' },
      { label: 'Partial verification', nextId: 'eligibility-manual' },
    ],
  },
  'eligibility-income': {
    id: 'eligibility-income',
    question: 'Does household income fall below poverty threshold?',
    options: [
      { label: 'Below threshold', nextId: 'eligibility-approve' },
      { label: 'Above threshold', nextId: null, outcome: '❌ DENIED: Income exceeds eligibility threshold' },
      { label: 'Requires verification', nextId: 'eligibility-review' },
    ],
  },
  'eligibility-approve': {
    id: 'eligibility-approve',
    question: 'Vulnerability assessment score:',
    options: [
      { label: 'High vulnerability (>70)', nextId: null, outcome: '✅ APPROVED: Priority enrollment recommended' },
      { label: 'Medium vulnerability (40-70)', nextId: null, outcome: '✅ APPROVED: Standard enrollment' },
      { label: 'Low vulnerability (<40)', nextId: null, outcome: '⏳ WAITLIST: Subject to budget availability' },
    ],
  },
  'eligibility-manual': {
    id: 'eligibility-manual',
    question: 'Manual verification pathway:',
    options: [
      { label: 'Schedule in-person verification', nextId: null, outcome: '📋 ACTION: Schedule field verification within 14 days' },
      { label: 'Request additional documents', nextId: null, outcome: '📋 ACTION: Request birth certificate + utility bill' },
    ],
  },
  'eligibility-review': {
    id: 'eligibility-review',
    question: 'Income verification method:',
    options: [
      { label: 'Cross-check with tax authority', nextId: null, outcome: '📋 ACTION: Automated verification initiated (2-3 days)' },
      { label: 'Request payslips/bank statements', nextId: null, outcome: '📋 ACTION: Documents requested from applicant' },
    ],
  },
  payment: {
    id: 'payment',
    question: 'What is the payment amount?',
    options: [
      { label: 'Under $1,000', nextId: 'payment-auto' },
      { label: '$1,000 - $10,000', nextId: 'payment-review' },
      { label: 'Over $10,000', nextId: 'payment-approval' },
    ],
  },
  'payment-auto': {
    id: 'payment-auto',
    question: 'Is beneficiary account verified?',
    options: [
      { label: 'Yes', nextId: null, outcome: '✅ AUTO-APPROVED: Payment scheduled for next batch' },
      { label: 'No', nextId: null, outcome: '⏳ HOLD: Account verification required' },
    ],
  },
  'payment-review': {
    id: 'payment-review',
    question: 'Supervisor review required. Status:',
    options: [
      { label: 'Supervisor approved', nextId: null, outcome: '✅ APPROVED: Payment authorized' },
      { label: 'Supervisor rejected', nextId: null, outcome: '❌ REJECTED: Review comments added' },
      { label: 'Escalate to director', nextId: 'payment-approval' },
    ],
  },
  'payment-approval': {
    id: 'payment-approval',
    question: 'Director-level approval required:',
    options: [
      { label: 'Approved with documentation', nextId: null, outcome: '✅ APPROVED: High-value payment authorized' },
      { label: 'Request additional justification', nextId: null, outcome: '📋 ACTION: Justification memo required' },
      { label: 'Rejected', nextId: null, outcome: '❌ REJECTED: Does not meet policy criteria' },
    ],
  },
  allocation: {
    id: 'allocation',
    question: 'Program type for allocation:',
    options: [
      { label: 'Cash Transfer', nextId: 'allocation-cash' },
      { label: 'In-kind Support', nextId: 'allocation-inkind' },
      { label: 'Voucher Program', nextId: 'allocation-voucher' },
    ],
  },
  'allocation-cash': {
    id: 'allocation-cash',
    question: 'Available budget vs. demand:',
    options: [
      { label: 'Budget sufficient', nextId: null, outcome: '✅ ALLOCATED: Full benefit amount assigned' },
      { label: 'Budget constrained', nextId: null, outcome: '⚠️ PARTIAL: Pro-rata allocation applied' },
      { label: 'No budget available', nextId: null, outcome: '❌ WAITLIST: Added to next cycle queue' },
    ],
  },
  'allocation-inkind': {
    id: 'allocation-inkind',
    question: 'Inventory availability:',
    options: [
      { label: 'In stock', nextId: null, outcome: '✅ ALLOCATED: Distribution scheduled' },
      { label: 'Procurement needed', nextId: null, outcome: '📋 ACTION: Procurement request initiated' },
    ],
  },
  'allocation-voucher': {
    id: 'allocation-voucher',
    question: 'Vendor network status:',
    options: [
      { label: 'Vendors available in area', nextId: null, outcome: '✅ ALLOCATED: E-voucher issued' },
      { label: 'No vendors in area', nextId: null, outcome: '⚠️ ALTERNATIVE: Cash transfer recommended' },
    ],
  },
  crisis: {
    id: 'crisis',
    question: 'Crisis severity level:',
    options: [
      { label: 'Level 1 - Localized', nextId: 'crisis-local' },
      { label: 'Level 2 - Regional', nextId: 'crisis-regional' },
      { label: 'Level 3 - National', nextId: 'crisis-national' },
    ],
  },
  'crisis-local': {
    id: 'crisis-local',
    question: 'Estimated affected population:',
    options: [
      { label: 'Under 1,000', nextId: null, outcome: '🟡 RESPONSE: Local team authorized, standard protocols' },
      { label: '1,000 - 10,000', nextId: null, outcome: '🟠 RESPONSE: Regional coordination activated' },
    ],
  },
  'crisis-regional': {
    id: 'crisis-regional',
    question: 'Multi-sector response needed?',
    options: [
      { label: 'Yes', nextId: null, outcome: '🔴 RESPONSE: Inter-agency coordination initiated' },
      { label: 'No', nextId: null, outcome: '🟠 RESPONSE: Sector-specific response deployed' },
    ],
  },
  'crisis-national': {
    id: 'crisis-national',
    question: 'National emergency declaration:',
    options: [
      { label: 'Declared', nextId: null, outcome: '🔴 EMERGENCY: All protocols activated, international support requested' },
      { label: 'Pending', nextId: null, outcome: '🟠 STANDBY: Pre-positioning resources, awaiting declaration' },
    ],
  },
};

const BOUNDARIES_SCENARIOS = [
  {
    id: 'discrimination',
    title: 'Discrimination Detection',
    request: 'Exclude all beneficiaries from Region X due to political affiliation',
    analysis: [
      { check: 'Non-discrimination principle', status: 'VIOLATED', severity: 'critical' },
      { check: 'Equal treatment requirement', status: 'VIOLATED', severity: 'critical' },
      { check: 'Political neutrality', status: 'VIOLATED', severity: 'critical' },
      { check: 'Legal compliance (Art. 14 ECHR)', status: 'VIOLATED', severity: 'critical' },
    ],
    decision: 'BLOCKED',
    explanation: 'This action violates fundamental non-discrimination principles. Beneficiary eligibility cannot be based on political affiliation, region of origin, or any protected characteristic.',
  },
  {
    id: 'data-breach',
    title: 'Data Protection Boundary',
    request: 'Export full beneficiary database including personal IDs to external partner',
    analysis: [
      { check: 'Data minimization principle', status: 'VIOLATED', severity: 'high' },
      { check: 'Purpose limitation', status: 'WARNING', severity: 'medium' },
      { check: 'Third-party data sharing agreement', status: 'MISSING', severity: 'high' },
      { check: 'GDPR Article 6 legal basis', status: 'UNVERIFIED', severity: 'high' },
    ],
    decision: 'BLOCKED',
    explanation: 'Bulk export of personal data requires: (1) Data sharing agreement, (2) Legal basis verification, (3) Data minimization review. Please contact Data Protection Officer.',
  },
  {
    id: 'budget-override',
    title: 'Budget Authority Boundary',
    request: 'Approve payment batch of $5.2M (exceeds authorized limit of $1M)',
    analysis: [
      { check: 'Single transaction limit', status: 'EXCEEDED', severity: 'high' },
      { check: 'User authorization level', status: 'INSUFFICIENT', severity: 'high' },
      { check: 'Budget availability', status: 'VERIFIED', severity: 'ok' },
      { check: 'Dual control requirement', status: 'NOT_MET', severity: 'medium' },
    ],
    decision: 'ESCALATED',
    explanation: 'Transaction exceeds your authorization limit. Automatically escalated to Director level. Requires dual approval for amounts over $1M.',
  },
  {
    id: 'ai-override',
    title: 'AI Recommendation Override',
    request: 'Override AI recommendation to deny 500 applications flagged as fraudulent',
    analysis: [
      { check: 'Human oversight requirement', status: 'ACTIVE', severity: 'ok' },
      { check: 'Override justification', status: 'REQUIRED', severity: 'medium' },
      { check: 'Audit trail', status: 'RECORDING', severity: 'ok' },
      { check: 'Fraud detection confidence', status: '94.2%', severity: 'info' },
    ],
    decision: 'ALLOWED_WITH_CONDITIONS',
    explanation: 'Human override is permitted. You must provide written justification. All overridden cases will be flagged for quarterly review. Fraud detection model accuracy: 94.2%.',
  },
  {
    id: 'ethical-valid',
    title: 'Ethical Request (Valid)',
    request: 'Prioritize elderly and disabled beneficiaries for immediate payment',
    analysis: [
      { check: 'Vulnerability-based prioritization', status: 'ALIGNED', severity: 'ok' },
      { check: 'Non-discrimination (positive action)', status: 'COMPLIANT', severity: 'ok' },
      { check: 'Policy framework alignment', status: 'VERIFIED', severity: 'ok' },
      { check: 'Audit documentation', status: 'COMPLETE', severity: 'ok' },
    ],
    decision: 'APPROVED',
    explanation: 'Prioritization based on vulnerability criteria is permitted and encouraged. This aligns with social protection best practices and IVYAR ethical guidelines.',
  },
];

const SIMULATOR_REGIONS = [
  { id: 'kyiv', name: 'Kyiv', population: 2800000, gdp: 42, programs: 12, beneficiaries: 180000 },
  { id: 'lviv', name: 'Lviv', population: 720000, gdp: 8.5, programs: 8, beneficiaries: 45000 },
  { id: 'odesa', name: 'Odesa', population: 1010000, gdp: 12, programs: 9, beneficiaries: 72000 },
  { id: 'kharkiv', name: 'Kharkiv', population: 1430000, gdp: 15, programs: 11, beneficiaries: 156000 },
  { id: 'dnipro', name: 'Dnipro', population: 980000, gdp: 18, programs: 10, beneficiaries: 68000 },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function DemosPage() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('reasoning');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">IVYAR Demos</span>
              <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-2 py-0.5 rounded">Interactive</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-[#8B949E] hover:text-white">Documentation</Link>
            <Link href="/demo" className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]">
              Request Full Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🎮</span>
            <span className="text-sm bg-[#00A3FF]/10 text-[#00A3FF] px-3 py-1 rounded-full font-medium">
              Interactive Demonstrations
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4">AI & Governance Demos</h1>
          <p className="text-[#8B949E] max-w-2xl">
            Explore IVYAR's AI capabilities through interactive demonstrations. 
            See real-time reasoning, decision trees, ethical boundaries, and national-scale simulation.
          </p>
        </div>
      </section>

      {/* Demo Tabs */}
      <section className="border-b border-[#1F242C] sticky top-16 bg-[#0D1117] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'reasoning', label: 'Live Reasoning', icon: '🧠' },
              { id: 'decision-tree', label: 'Decision Tree', icon: '🌳' },
              { id: 'boundaries', label: 'Boundaries Engine', icon: '🛡️' },
              { id: 'assistant', label: 'AI Governance Assistant', icon: '🤖' },
              { id: 'simulator', label: 'National Cloud Simulator', icon: '☁️' },
            ].map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id as DemoType)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeDemo === demo.id
                    ? 'bg-[#00A3FF] text-[#0D1117]'
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
          {activeDemo === 'reasoning' && <LiveReasoningDemo />}
          {activeDemo === 'decision-tree' && <DecisionTreeDemo />}
          {activeDemo === 'boundaries' && <BoundariesEngineDemo />}
          {activeDemo === 'assistant' && <AIAssistantDemo />}
          {activeDemo === 'simulator' && <NationalCloudSimulator />}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B949E]">
            These are interactive demonstrations. For production deployment, <Link href="/demo" className="text-[#00A3FF] hover:underline">request a full demo</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// DEMO 1: LIVE REASONING
// ============================================
function LiveReasoningDemo() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [finalAnswer, setFinalAnswer] = useState('');

  const exampleQueries = [
    'Should we approve emergency cash transfer for flood victims in Region X?',
    'What is the optimal budget allocation for Q2 social programs?',
    'Analyze fraud risk for payment batch #4521',
    'Recommend response strategy for predicted food shortage',
  ];

  const simulateReasoning = async (q: string) => {
    setIsProcessing(true);
    setReasoningSteps([]);
    setFinalAnswer('');

    const steps = [
      '🔍 Parsing query and identifying intent...',
      '📊 Retrieving relevant data from HBS Core...',
      '⚖️ Checking against Ethical Core v2.0 guidelines...',
      '🔗 Verifying blockchain audit trail...',
      '📈 Analyzing historical patterns...',
      '🎯 Evaluating policy alignment...',
      '✅ Generating recommendation with confidence score...',
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setReasoningSteps(prev => [...prev, steps[i]]);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFinalAnswer(`**Recommendation:** Based on analysis of 47 data points, historical patterns, and policy alignment:

✅ **Approved** with the following parameters:
- Confidence Score: 94.2%
- Risk Level: Low
- Ethical Compliance: Verified
- Budget Impact: Within allocation

**Reasoning Summary:**
1. Request aligns with emergency response protocols
2. Beneficiary eligibility verified through cross-reference
3. No ethical boundary violations detected
4. Blockchain audit trail initiated

**Next Steps:**
- Supervisor notification sent
- Payment batch queued for next cycle
- Audit record created (TX: 0x7f8b...3a2c)`);
    
    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🧠</span> Live AI Reasoning
        </h2>
        <p className="text-sm text-[#8B949E] mb-4">
          See how IVYAR AI processes governance decisions with transparent, step-by-step reasoning.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Query</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a governance decision query..."
            className="w-full h-32 bg-[#0D1117] border border-[#1F242C] rounded-lg p-3 text-sm resize-none"
          />
        </div>

        <button
          onClick={() => simulateReasoning(query || exampleQueries[0])}
          disabled={isProcessing}
          className="w-full py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Analyze Query'}
        </button>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2 text-[#8B949E]">Example Queries</label>
          <div className="space-y-2">
            {exampleQueries.map((eq, i) => (
              <button
                key={i}
                onClick={() => { setQuery(eq); simulateReasoning(eq); }}
                className="w-full text-left p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg text-sm text-[#8B949E] hover:border-[#00A3FF] hover:text-[#E6EDF3] transition-colors"
              >
                {eq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reasoning Panel */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>⚡</span> Reasoning Process
        </h2>

        {reasoningSteps.length === 0 && !isProcessing && (
          <div className="text-center py-12 text-[#6E7681]">
            <div className="text-4xl mb-4">🧠</div>
            <p>Enter a query to see live AI reasoning</p>
          </div>
        )}

        {reasoningSteps.length > 0 && (
          <div className="space-y-3 mb-6">
            {reasoningSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg animate-fadeIn"
              >
                <span className="w-6 h-6 bg-[#3CCB7F]/20 text-[#3CCB7F] rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm">{step}</span>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-3 p-3">
                <div className="w-6 h-6 border-2 border-[#00A3FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-[#8B949E]">Processing...</span>
              </div>
            )}
          </div>
        )}

        {finalAnswer && (
          <div className="p-4 bg-[#0D1117] border border-[#3CCB7F] rounded-lg">
            <h3 className="text-sm font-semibold text-[#3CCB7F] mb-3">✅ Analysis Complete</h3>
            <div className="text-sm text-[#E6EDF3] whitespace-pre-wrap">{finalAnswer}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// DEMO 2: DECISION TREE
// ============================================
function DecisionTreeDemo() {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<string | null>(null);

  const currentNode = DECISION_TREE[currentNodeId];

  const handleOption = (option: { label: string; nextId: string | null; outcome?: string }) => {
    setHistory([...history, `${currentNode.question} → ${option.label}`]);
    
    if (option.outcome) {
      setOutcome(option.outcome);
    } else if (option.nextId) {
      setCurrentNodeId(option.nextId);
    }
  };

  const reset = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setOutcome(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Decision Panel */}
      <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>🌳</span> Decision Tree Navigator
          </h2>
          <button
            onClick={reset}
            className="text-sm text-[#8B949E] hover:text-white"
          >
            ↺ Reset
          </button>
        </div>

        {!outcome ? (
          <>
            <div className="mb-6">
              <div className="text-xs text-[#8B949E] mb-2">CURRENT QUESTION</div>
              <h3 className="text-xl font-semibold">{currentNode.question}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentNode.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOption(option)}
                  className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg text-left hover:border-[#00A3FF] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#00A3FF]/10 text-[#00A3FF] rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-[#00A3FF] group-hover:text-[#0D1117] transition-colors">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className={`text-6xl mb-4 ${
              outcome.includes('✅') ? '' : outcome.includes('❌') ? '' : ''
            }`}>
              {outcome.includes('✅') ? '✅' : outcome.includes('❌') ? '❌' : outcome.includes('⏳') ? '⏳' : '📋'}
            </div>
            <h3 className="text-xl font-semibold mb-4">Decision Outcome</h3>
            <p className={`text-lg p-4 rounded-lg ${
              outcome.includes('✅') ? 'bg-[#3CCB7F]/10 text-[#3CCB7F]' :
              outcome.includes('❌') ? 'bg-[#F85149]/10 text-[#F85149]' :
              'bg-[#F59E0B]/10 text-[#F59E0B]'
            }`}>
              {outcome}
            </p>
            <button
              onClick={reset}
              className="mt-6 px-6 py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF]"
            >
              Start New Decision
            </button>
          </div>
        )}
      </div>

      {/* History Panel */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[#8B949E] mb-4">DECISION PATH</h3>
        {history.length === 0 ? (
          <p className="text-sm text-[#6E7681]">No decisions made yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#1F242C] rounded-full flex items-center justify-center text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-[#8B949E]">{step}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-[#1F242C]">
          <h3 className="text-sm font-semibold text-[#8B949E] mb-3">ABOUT THIS DEMO</h3>
          <p className="text-xs text-[#6E7681]">
            This interactive decision tree demonstrates how IVYAR guides users through 
            governance decisions with clear pathways and documented outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEMO 3: BOUNDARIES ENGINE
// ============================================
function BoundariesEngineDemo() {
  const [selectedScenario, setSelectedScenario] = useState(BOUNDARIES_SCENARIOS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(true);

  const analyzeScenario = (scenario: typeof BOUNDARIES_SCENARIOS[0]) => {
    setSelectedScenario(scenario);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Scenarios List */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🛡️</span> Test Scenarios
        </h2>
        <p className="text-sm text-[#8B949E] mb-4">
          Select a scenario to see how IVYAR's Ethical Boundaries Engine responds.
        </p>
        <div className="space-y-2">
          {BOUNDARIES_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => analyzeScenario(scenario)}
              className={`w-full p-3 rounded-lg text-left text-sm transition-all ${
                selectedScenario.id === scenario.id
                  ? 'bg-[#00A3FF]/10 border border-[#00A3FF]'
                  : 'bg-[#0D1117] border border-[#1F242C] hover:border-[#3D444D]'
              }`}
            >
              <div className="font-medium mb-1">{scenario.title}</div>
              <div className={`text-xs ${
                scenario.decision === 'BLOCKED' ? 'text-[#F85149]' :
                scenario.decision === 'APPROVED' ? 'text-[#3CCB7F]' :
                'text-[#F59E0B]'
              }`}>
                {scenario.decision}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Boundaries Analysis</h2>

        {/* Request */}
        <div className="mb-6">
          <div className="text-xs text-[#8B949E] mb-2">INCOMING REQUEST</div>
          <div className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg">
            <code className="text-sm text-[#F59E0B]">{selectedScenario.request}</code>
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#00A3FF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Analyzing against ethical boundaries...</span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisComplete && !isAnalyzing && (
          <>
            <div className="mb-6">
              <div className="text-xs text-[#8B949E] mb-2">BOUNDARY CHECKS</div>
              <div className="space-y-2">
                {selectedScenario.analysis.map((check, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg">
                    <span className="text-sm">{check.check}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      check.severity === 'critical' ? 'bg-[#F85149]/20 text-[#F85149]' :
                      check.severity === 'high' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      check.severity === 'medium' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                      check.severity === 'ok' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                      'bg-[#8B949E]/20 text-[#8B949E]'
                    }`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision */}
            <div className={`p-4 rounded-lg border ${
              selectedScenario.decision === 'BLOCKED' ? 'bg-[#F85149]/10 border-[#F85149]' :
              selectedScenario.decision === 'APPROVED' ? 'bg-[#3CCB7F]/10 border-[#3CCB7F]' :
              'bg-[#F59E0B]/10 border-[#F59E0B]'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {selectedScenario.decision === 'BLOCKED' ? '🛑' :
                   selectedScenario.decision === 'APPROVED' ? '✅' : '⚠️'}
                </span>
                <span className={`text-lg font-bold ${
                  selectedScenario.decision === 'BLOCKED' ? 'text-[#F85149]' :
                  selectedScenario.decision === 'APPROVED' ? 'text-[#3CCB7F]' :
                  'text-[#F59E0B]'
                }`}>
                  {selectedScenario.decision}
                </span>
              </div>
              <p className="text-sm text-[#E6EDF3]">{selectedScenario.explanation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// DEMO 4: AI GOVERNANCE ASSISTANT
// ============================================
function AIAssistantDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the IVYAR AI Governance Assistant. I can help you with:\n\n• Policy interpretation and compliance questions\n• Program eligibility guidance\n• Reporting and analytics queries\n• Ethical framework clarification\n• System navigation assistance\n\nHow can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'What are the eligibility criteria for emergency cash assistance?',
    'How do I generate an IATI compliance report?',
    'Explain the human oversight requirements for AI decisions',
    'What happens if a payment exceeds my authorization limit?',
  ];

  const generateResponse = (question: string): string => {
    const responses: Record<string, string> = {
      'eligibility': `**Emergency Cash Assistance Eligibility Criteria:**

1. **Identity Verification**
   - Valid national ID or registered refugee status
   - Biometric verification where available

2. **Income Threshold**
   - Household income below 150% of national poverty line
   - Income verification via tax authority cross-check

3. **Vulnerability Assessment**
   - Score calculated from 12 indicators
   - Priority given to: elderly (65+), disabled, single parents, large households

4. **Geographic Targeting**
   - Must reside in declared emergency zone
   - Verified through address validation

Would you like me to help you process a specific eligibility case?`,

      'iati': `**Generating IATI Compliance Report:**

1. Navigate to **Analytics → Reports → IATI Export**
2. Select reporting period and activities
3. Click "Generate IATI 2.03 Report"

**Report includes:**
- Organization information
- Activity details and dates
- Transaction records
- Results and indicators
- Geographic locations

**Compliance Score:** Your current IATI compliance is **99.2%**

Need help with any specific IATI elements?`,

      'oversight': `**Human Oversight Requirements for AI Decisions:**

Under IVYAR Ethical Core v2.0, human oversight is mandatory for:

🔴 **Always Required:**
- Payments over $10,000
- Eligibility denials
- Crisis response activation
- Policy changes

🟡 **Review Required:**
- AI confidence below 85%
- Flagged for unusual patterns
- First-time scenarios

🟢 **Automated (with logging):**
- Routine payments under threshold
- Standard eligibility approvals
- Report generation

All AI decisions include full audit trail and can be overridden by authorized personnel.`,

      'authorization': `**Payment Authorization Limits:**

| Role | Single Transaction | Daily Limit |
|------|-------------------|-------------|
| Operator | $1,000 | $10,000 |
| Supervisor | $10,000 | $100,000 |
| Manager | $100,000 | $500,000 |
| Director | $1,000,000 | $5,000,000 |

**When limit exceeded:**
1. Transaction automatically escalated
2. Higher authority notified
3. You receive confirmation when approved
4. Full audit trail maintained

Need to request a limit increase?`,
    };

    const q = question.toLowerCase();
    if (q.includes('eligib')) return responses.eligibility;
    if (q.includes('iati') || q.includes('report')) return responses.iati;
    if (q.includes('oversight') || q.includes('human')) return responses.oversight;
    if (q.includes('limit') || q.includes('authorization') || q.includes('payment')) return responses.authorization;

    return `I understand you're asking about: "${question}"

Let me help you with that. Based on IVYAR governance protocols:

1. **Context Analysis:** Your query relates to platform operations
2. **Policy Reference:** See Section 4.2 of the Governance Manual
3. **Recommended Action:** I can provide more specific guidance

Would you like me to:
- Explain relevant policies?
- Guide you through the process?
- Connect you with human support?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(input),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Chat Panel */}
      <div className="lg:col-span-3 bg-[#161B22] border border-[#1F242C] rounded-xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-[#1F242C] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00A3FF]/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="font-semibold">AI Governance Assistant</h2>
            <span className="text-xs text-[#3CCB7F]">● Online • Ethical Core v2.0</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'bg-[#0D1117] border border-[#1F242C]'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#0D1117] border border-[#1F242C] p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#8B949E] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#8B949E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#8B949E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#1F242C]">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about governance, policies, or procedures..."
              className="flex-1 bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Panel */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 h-fit">
        <h3 className="text-sm font-semibold text-[#8B949E] mb-4">SUGGESTED QUESTIONS</h3>
        <div className="space-y-2">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); }}
              className="w-full p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg text-left text-sm text-[#8B949E] hover:border-[#00A3FF] hover:text-[#E6EDF3] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-[#1F242C]">
          <h3 className="text-sm font-semibold text-[#8B949E] mb-3">CAPABILITIES</h3>
          <ul className="space-y-2 text-xs text-[#6E7681]">
            <li>✓ Policy interpretation</li>
            <li>✓ Process guidance</li>
            <li>✓ Compliance checking</li>
            <li>✓ Data retrieval</li>
            <li>✓ Audit trail access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEMO 5: NATIONAL CLOUD SIMULATOR
// ============================================
function NationalCloudSimulator() {
  const [selectedRegion, setSelectedRegion] = useState(SIMULATOR_REGIONS[0]);
  const [simulationMode, setSimulationMode] = useState<'overview' | 'scenario'>('overview');
  const [scenarioType, setScenarioType] = useState<string>('budget-cut');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResults(null);

    setTimeout(() => {
      const results = {
        'budget-cut': {
          impact: 'High',
          affectedBeneficiaries: Math.floor(selectedRegion.beneficiaries * 0.23),
          recommendation: 'Prioritize vulnerable groups, implement graduated reduction',
          riskLevel: 'Medium',
          alternativeScenarios: [
            'Reduce admin costs by 15% first',
            'Phase over 6 months',
            'Seek emergency donor funding',
          ],
        },
        'population-growth': {
          impact: 'Medium',
          additionalBeneficiaries: Math.floor(selectedRegion.beneficiaries * 0.12),
          recommendation: 'Scale infrastructure, request 12% budget increase',
          riskLevel: 'Low',
          capacityNeeded: '+3 processing centers',
        },
        'crisis-event': {
          impact: 'Critical',
          emergencyResponse: 'Activate Level 2 protocols',
          resourcesNeeded: '$' + (selectedRegion.population * 0.05).toLocaleString(),
          timeToDeployment: '48-72 hours',
          partnerCoordination: '12 organizations notified',
        },
      };

      setSimulationResults(results[scenarioType as keyof typeof results]);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Map Header */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>☁️</span> National Digital Twin Simulator
            </h2>
            <p className="text-sm text-[#8B949E]">
              Simulate policy scenarios and see projected impacts across regions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSimulationMode('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                simulationMode === 'overview' ? 'bg-[#00A3FF] text-[#0D1117]' : 'bg-[#1F242C] text-[#8B949E]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSimulationMode('scenario')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                simulationMode === 'scenario' ? 'bg-[#00A3FF] text-[#0D1117]' : 'bg-[#1F242C] text-[#8B949E]'
              }`}
            >
              Run Scenario
            </button>
          </div>
        </div>

        {/* Region Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SIMULATOR_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedRegion.id === region.id
                  ? 'bg-[#00A3FF]/10 border-2 border-[#00A3FF]'
                  : 'bg-[#0D1117] border border-[#1F242C] hover:border-[#3D444D]'
              }`}
            >
              <h3 className="font-semibold mb-2">{region.name}</h3>
              <div className="space-y-1 text-xs text-[#8B949E]">
                <div>Pop: {(region.population / 1000000).toFixed(1)}M</div>
                <div>Programs: {region.programs}</div>
                <div>Beneficiaries: {(region.beneficiaries / 1000).toFixed(0)}K</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Region Details */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedRegion.name} Region</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1117] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#00A3FF]">
                {(selectedRegion.population / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-[#8B949E]">Population</div>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#3CCB7F]">
                ${selectedRegion.gdp}B
              </div>
              <div className="text-xs text-[#8B949E]">Regional GDP</div>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#A371F7]">
                {selectedRegion.programs}
              </div>
              <div className="text-xs text-[#8B949E]">Active Programs</div>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#F59E0B]">
                {(selectedRegion.beneficiaries / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-[#8B949E]">Beneficiaries</div>
            </div>
          </div>

          {/* Mini charts placeholder */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#8B949E]">Program Coverage</span>
                <span>{((selectedRegion.beneficiaries / selectedRegion.population) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00A3FF] rounded-full"
                  style={{ width: `${(selectedRegion.beneficiaries / selectedRegion.population) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#8B949E]">Budget Utilization</span>
                <span>87.3%</span>
              </div>
              <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                <div className="h-full bg-[#3CCB7F] rounded-full" style={{ width: '87.3%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#8B949E]">Payment Success Rate</span>
                <span>99.2%</span>
              </div>
              <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden">
                <div className="h-full bg-[#A371F7] rounded-full" style={{ width: '99.2%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Panel */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          {simulationMode === 'overview' ? (
            <>
              <h3 className="text-lg font-semibold mb-4">National Overview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#0D1117] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">System Health</span>
                    <span className="text-xs text-[#3CCB7F]">● Operational</span>
                  </div>
                  <div className="text-xs text-[#8B949E]">
                    All 5 regions connected • 99.97% uptime • Last sync: 2 min ago
                  </div>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-lg">
                  <div className="text-sm font-medium mb-2">Active Alerts</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#F59E0B] rounded-full"></span>
                      <span className="text-[#8B949E]">Budget threshold warning in Kharkiv (92% utilized)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#00A3FF] rounded-full"></span>
                      <span className="text-[#8B949E]">New beneficiary surge detected in Lviv (+12%)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-lg">
                  <div className="text-sm font-medium mb-2">Predictive Insights</div>
                  <div className="text-xs text-[#8B949E]">
                    AI model predicts 8% increase in program demand over next quarter based on economic indicators and seasonal patterns.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-4">Run Scenario</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Scenario Type</label>
                  <select
                    value={scenarioType}
                    onChange={(e) => setScenarioType(e.target.value)}
                    className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                  >
                    <option value="budget-cut">20% Budget Reduction</option>
                    <option value="population-growth">Population Growth (+15%)</option>
                    <option value="crisis-event">Natural Disaster Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Region</label>
                  <div className="p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg">
                    {selectedRegion.name}
                  </div>
                </div>

                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF] disabled:opacity-50"
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>

                {isSimulating && (
                  <div className="flex items-center justify-center gap-3 py-4">
                    <div className="w-5 h-5 border-2 border-[#00A3FF] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-[#8B949E]">Running simulation model...</span>
                  </div>
                )}

                {simulationResults && !isSimulating && (
                  <div className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg">
                    <h4 className="text-sm font-semibold mb-3 text-[#00A3FF]">Simulation Results</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(simulationResults).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-[#8B949E] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-[#E6EDF3]">
                            {Array.isArray(value) ? value.length + ' options' : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
