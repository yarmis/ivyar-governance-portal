'use client';

import Link from 'next/link';

export default function ProcurementModulePage() {
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
            <div className="text-6xl">📋</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">PROCUREMENT ENGINE</h1>
              <p className="text-lg text-[#8B949E]">Transparent Tender & Contract Management</p>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-xs text-[#8B949E] mb-1">STATUS</div>
              <div className="text-sm font-medium text-[#3CCB7F]">✓ LIVE</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">VERSION</div>
              <div className="text-sm font-medium">3.1</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">18</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">UPDATED</div>
              <div className="text-sm font-medium">2026-01-13</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">MODE</div>
              <div className="text-sm font-medium">● Production-Ready</div>
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
            <p>The Procurement Engine provides transparent, auditable tender management and full contract lifecycle oversight for public and donor‑funded projects.</p>
            <p>It ensures fairness, accountability, and compliance across all procurement workflows with AI-assisted fraud detection and supplier verification.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
                        <div>▸ Fraud detection and anomaly alerts</div>
            <div>▸ Supplier risk scoring</div>
            <div>▸ Contract performance monitoring</div>
            <div>▸ Complete audit trail</div>
          </div>
        </section>

        {/* Key Capabilities */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔑</span>
            <h2 className="text-2xl font-bold">KEY CAPABILITIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div key={0} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📑</span>
              <span className="text-sm text-[#8B949E]">Tender creation & automated publishing</span>
            </div>
            <div key={1} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🔍</span>
              <span className="text-sm text-[#8B949E]">Supplier verification & background checks</span>
            </div>
            <div key={2} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📊</span>
              <span className="text-sm text-[#8B949E]">Contract performance tracking</span>
            </div>
            <div key={3} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📁</span>
              <span className="text-sm text-[#8B949E]">Document integrity & immutability</span>
            </div>
            <div key={4} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">⚖️</span>
              <span className="text-sm text-[#8B949E]">Bid evaluation with AI scoring</span>
            </div>
            <div key={5} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🧩</span>
              <span className="text-sm text-[#8B949E]">Integration with Payments & HBS</span>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="bg-[#161B22] border border-[#1F242C] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-bold">PROCUREMENT INTEGRATION</h2>
          </div>
          <p className="text-[#8B949E] mb-6">
            The Procurement Engine integrates with existing e-procurement systems, donor platforms, and government portals.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Partners can supply:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Tender templates and evaluation criteria</li>
                <li>— Supplier databases and verification sources</li>
                <li>— Contract templates and legal frameworks</li>
                <li>— Compliance and regulatory requirements</li>
                <li>— Payment and settlement workflows</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">IVYAR provides:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Unified tender management platform</li>
                <li>— AI fraud detection and risk scoring</li>
                <li>— Blockchain-backed audit trail</li>
                <li>— Multi-stakeholder transparency</li>
                <li>— Real-time monitoring dashboards</li>
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
            <div key={0} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 1</div>
              <div>
                <div className="font-semibold mb-1">Requirements Analysis</div>
                <div className="text-sm text-[#8B949E]">Define tender types, evaluation criteria, and compliance frameworks.</div>
              </div>
            </div>
            <div key={1} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 2</div>
              <div>
                <div className="font-semibold mb-1">System Integration</div>
                <div className="text-sm text-[#8B949E]">Connect existing procurement systems, map workflows, enable data exchange.</div>
              </div>
            </div>
            <div key={2} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 3</div>
              <div>
                <div className="font-semibold mb-1">Pilot Deployment</div>
                <div className="text-sm text-[#8B949E]">Launch with selected tenders, validate processes, tune AI models.</div>
              </div>
            </div>
            <div key={3} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 4</div>
              <div>
                <div className="font-semibold mb-1">Scale & Monitor</div>
                <div className="text-sm text-[#8B949E]">Expand to all procurement categories with ongoing optimization.</div>
              </div>
            </div>
            <div key={4} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 5</div>
              <div>
                <div className="font-semibold mb-1">Continuous Improvement</div>
                <div className="text-sm text-[#8B949E]">Regular audits, AI refinement, and stakeholder feedback integration.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔗</span>
            <h2 className="text-2xl font-bold">ACTIONS</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/procurement" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <Link href="#" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              VIEW API →
            </Link>
            <Link href="/procurement" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
