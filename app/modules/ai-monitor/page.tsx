'use client';

import Link from 'next/link';

export default function AIIntegrityMonitor() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="border-b border-[#1F242C] bg-[#161B22] px-6 py-4">
        <Link 
          href="/"
          className="text-sm text-[#8B949E] transition-colors hover:text-[#E6EDF3]"
        >
          ← BACK TO MODULES
        </Link>
      </nav>

      {/* Header */}
      <header className="border-b border-[#1F242C] bg-[#161B22] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Icon and Title */}
          <div className="mb-8 flex items-start gap-4">
            <div className="text-5xl">🤖</div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-[#E6EDF3]">
                AI INTEGRITY MONITOR
              </h1>
              <p className="mt-2 text-lg text-[#8B949E]">
                Algorithmic Transparency & Public Oversight
              </p>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Status
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFA657]">◆</span>
                <span className="text-sm font-medium">BETA</span>
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Version
              </div>
              <div className="text-sm font-medium">1.9</div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Models Tracked
              </div>
              <div className="text-sm font-medium">18</div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Updated
              </div>
              <div className="text-sm font-medium">2026-01-14</div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Mode
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FFA657]"></span>
                <span className="text-sm font-medium">Active Monitoring</span>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['EU AI Act Ready', 'ISO/IEC 42001', 'NIST AI RMF', 'Explainable AI'].map((badge) => (
              <span
                key={badge}
                className="rounded bg-[#1F242C] px-3 py-1 text-xs font-medium text-[#8B949E]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        
        {/* Overview */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>📘</span>
            <span>OVERVIEW</span>
          </h2>
          <div className="space-y-4 text-[#8B949E]">
            <p>
              The AI Integrity Monitor provides public transparency into how artificial intelligence is 
              used across IVYAR's governance platform, ensuring algorithmic accountability and fairness.
            </p>
            <p>
              Every AI model, decision, and recommendation is documented, explained, and auditable — 
              demonstrating that AI serves as a responsible tool under human oversight, not an 
              opaque black box making unchecked decisions.
            </p>
          </div>
        </section>

        {/* AI Governance */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🧠</span>
            <span>AI GOVERNANCE</span>
          </h2>
          <div className="space-y-2 text-[#8B949E]">
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Full audit trail of all AI decisions and reasoning</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Quarterly bias and fairness assessments</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Real-time model performance monitoring</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Public challenge mechanism for contested decisions</span>
            </div>
          </div>
        </section>

        {/* Key Capabilities */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🔑</span>
            <span>KEY CAPABILITIES</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">📊</div>
              <div className="font-medium">Model performance dashboards</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🔍</div>
              <div className="font-medium">Explainable AI reasoning trails</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">⚖️</div>
              <div className="font-medium">Bias detection and mitigation</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">📝</div>
              <div className="font-medium">Decision challenge and review process</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">📈</div>
              <div className="font-medium">Accuracy and confidence metrics</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🔒</div>
              <div className="font-medium">Data sovereignty and privacy controls</div>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🧩</span>
            <span>AI MONITOR INTEGRATION</span>
          </h2>
          <div className="space-y-6">
            <p className="text-[#8B949E]">
              The AI Integrity Monitor connects with all IVYAR modules that use machine learning, 
              providing centralized oversight and public accountability.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">Partners can supply:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Existing AI/ML model documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Training data provenance and quality reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Historical decision logs and outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Regulatory requirements and compliance frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Ethics board oversight structures</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">IVYAR provides:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Unified AI monitoring and reporting platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Automated bias detection and alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Public transparency dashboard for AI operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Explainability tools for non-technical stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Quarterly audit reports and compliance documentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Roadmap */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🛠️</span>
            <span>INTEGRATION ROADMAP</span>
          </h2>
          <div className="space-y-6">
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 1</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">AI Inventory</h4>
              <p className="text-sm text-[#6E7681]">
                Catalog all AI models in use, document purposes, assess risk levels.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 2</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Monitoring Setup</h4>
              <p className="text-sm text-[#6E7681]">
                Instrument AI systems for logging, establish baseline metrics, configure alerts.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 3</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Internal Auditing</h4>
              <p className="text-sm text-[#6E7681]">
                Conduct first bias assessments, validate explainability features, train reviewers.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 4</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Public Launch</h4>
              <p className="text-sm text-[#6E7681]">
                Release transparency dashboard, enable decision challenges, publish audit reports.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 5</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Continuous Governance</h4>
              <p className="text-sm text-[#6E7681]">
                Quarterly audits, regular model updates, community oversight integration.
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section>
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🔗</span>
            <span>ACTIONS</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => alert('Opening AI Integrity Monitor dashboard...')}
              className="rounded-lg border border-[#1F6FEB] bg-[#1F6FEB]/10 px-6 py-3 font-medium text-[#1F6FEB] transition-colors hover:bg-[#1F6FEB]/20"
            >
              OPEN MODULE →
            </button>
            <button
              onClick={() => alert('Loading current AI audit reports and bias assessments...')}
              className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]"
            >
              VIEW AUDITS →
            </button>
            <button
              onClick={() => alert('Launching interactive demo showing AI decision explanation...')}
              className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]"
            >
              RUN DEMO →
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1F242C] bg-[#161B22] px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-[#6E7681]">
          🇺🇸 Built in the United States • 💙💛 Inspired by Ukraine • 🌍 Designed for the world
        </div>
      </footer>
    </div>
  );
}
