'use client';

import Link from 'next/link';

export default function InsuranceModulePage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Navigation */}
      <nav className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <Link href="/" className="text-[#8B949E] hover:text-white flex items-center gap-2">
            ← BACK TO MODULES
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="flex items-start gap-6 mb-8">
            <div className="text-6xl">🛡️</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">INSURANCE MODULE</h1>
              <p className="text-lg text-[#8B949E]">Institutional Risk & Coverage Infrastructure</p>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <div className="text-xs text-[#8B949E] mb-1">STATUS</div>
              <div className="text-sm font-medium text-[#3CCB7F]">✓ LIVE</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">VERSION</div>
              <div className="text-sm font-medium">3.0</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">10</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">UPDATED</div>
              <div className="text-sm font-medium">2026-01-12</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-[#8B949E] mb-1">MODE</div>
              <div className="text-sm font-medium">● Production-Ready (Demo data active)</div>
            </div>
          </div>

          {/* Compliance */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['ISO 27001', 'SOC 2', 'GDPR', 'IRAP', 'PQC-Ready'].map((cert) => (
              <span key={cert} className="px-3 py-1 bg-[#0D1117] border border-[#1F242C] text-xs font-medium">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
        {/* Overview */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📘</span>
            <h2 className="text-2xl font-bold">OVERVIEW</h2>
          </div>
          <div className="text-[#8B949E] space-y-4">
            <p>
              The Insurance Module provides AI‑assisted risk assessment, policy management, and claims processing 
              for cargo, liability, and operational coverage across humanitarian, governmental, and reconstruction activities.
            </p>
            <p>
              Designed for integration with licensed insurance providers, the module ensures full transparency, 
              auditability, and compliance with international standards.
            </p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
            <div>▸ Human‑in‑the‑loop approval</div>
            <div>▸ Explainable, traceable decisions</div>
            <div>▸ AI‑driven risk scoring and anomaly detection</div>
            <div>▸ Complete audit logs with full transparency</div>
          </div>
        </section>

        {/* Key Capabilities */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔑</span>
            <h2 className="text-2xl font-bold">KEY CAPABILITIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: '📝', text: 'Policy creation, renewal, and endorsements' },
              { icon: '📊', text: 'AI‑assisted underwriting and risk modeling' },
              { icon: '🚚', text: 'Cargo, liability, and operational coverage' },
              { icon: '📁', text: 'Claims processing with fraud detection' },
              { icon: '🔐', text: 'Immutable audit trail and compliance alignment' },
              { icon: '🧩', text: 'Integration with Logistics, Procurement, Freight, and Payments' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-[#8B949E]">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Integration */}
        <section className="bg-[#161B22] border border-[#1F242C] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-bold">PARTNER INTEGRATION BRIEF</h2>
          </div>
          <p className="text-[#8B949E] mb-6">
            The Insurance Module is ready for integration with licensed insurance providers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Partners can supply:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                <li>— Insurance products and tariff structures</li>
                <li>— Underwriting rules and risk models</li>
                <li>— Claims adjudication logic</li>
                <li>— Regulatory compliance requirements</li>
                <li>— API or data‑exchange specifications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">IVYAR provides:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                <li>— Secure policy and claims infrastructure</li>
                <li>— AI‑enhanced risk scoring</li>
                <li>— Full auditability for donors and regulators</li>
                <li>— Zero‑Trust security and PQC‑ready cryptography</li>
                <li>— Multi‑region redundancy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Integration Roadmap */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🛠️</span>
            <h2 className="text-2xl font-bold">INTEGRATION ROADMAP</h2>
          </div>
          <div className="space-y-4">
            {[
              { phase: 'PHASE 1', title: 'Alignment', desc: 'Define coverage types, compliance requirements, and underwriting rules.' },
              { phase: 'PHASE 2', title: 'Technical Integration', desc: 'Connect provider API, map policy structures, enable secure document exchange.' },
              { phase: 'PHASE 3', title: 'Validation & Compliance', desc: 'Test issuance, validate claims workflows, conduct security review.' },
              { phase: 'PHASE 4', title: 'Controlled Launch', desc: 'Limited rollout for selected partners, monitoring and AI tuning.' },
              { phase: 'PHASE 5', title: 'Full Deployment', desc: 'Nationwide or multi‑agency activation with ongoing audits and monitoring.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
                <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">{item.phase}</div>
                <div>
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="text-sm text-[#8B949E]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔗</span>
            <h2 className="text-2xl font-bold">ACTIONS</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/insurance" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <Link href="#" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              VIEW API →
            </Link>
            <Link href="/insurance" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
