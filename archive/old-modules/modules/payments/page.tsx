'use client';

import Link from 'next/link';

export default function PaymentsModulePage() {
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
            <div className="text-6xl">💳</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">PAYMENTS MODULE</h1>
              <p className="text-lg text-[#8B949E]">Secure Cross-Border Settlements</p>
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
              <div className="text-sm font-medium">3.2</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">8</div>
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
            <p>The Payments Module enables secure, compliant, cross‑border settlements with full traceability for public, donor, and institutional transactions.</p>
            <p>It ensures instant settlements, multi-currency support, and complete audit trails for all financial operations.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
                        <div>▸ Transaction risk scoring</div>
            <div>▸ AML and fraud detection</div>
            <div>▸ Suspicious pattern alerts</div>
            <div>▸ Complete transaction audit logs</div>
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
              <span className="text-xl">💳</span>
              <span className="text-sm text-[#8B949E]">Instant settlement processing</span>
            </div>
            <div key={1} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🌍</span>
              <span className="text-sm text-[#8B949E]">Multi-currency support</span>
            </div>
            <div key={2} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📊</span>
              <span className="text-sm text-[#8B949E]">Payment analytics and reporting</span>
            </div>
            <div key={3} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📁</span>
              <span className="text-sm text-[#8B949E]">Audit-ready transaction logs</span>
            </div>
            <div key={4} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🔐</span>
              <span className="text-sm text-[#8B949E]">PSD2 and regulatory compliance</span>
            </div>
            <div key={5} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🧩</span>
              <span className="text-sm text-[#8B949E]">Integration with Procurement, Trade & HBS</span>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="bg-[#161B22] border border-[#1F242C] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-bold">PAYMENTS INTEGRATION</h2>
          </div>
          <p className="text-[#8B949E] mb-6">
            The Payments Module integrates with banking systems, payment gateways, and treasury platforms.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Partners can supply:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Banking rails and SWIFT connectivity</li>
                <li>— Payment gateway APIs</li>
                <li>— Currency exchange services</li>
                <li>— Compliance and KYC systems</li>
                <li>— Settlement and reconciliation tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">IVYAR provides:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Unified payment infrastructure</li>
                <li>— AI fraud detection</li>
                <li>— Real-time settlement tracking</li>
                <li>— Multi-currency orchestration</li>
                <li>— Regulatory compliance automation</li>
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
                <div className="font-semibold mb-1">Banking Integration</div>
                <div className="text-sm text-[#8B949E]">Connect banking partners, configure payment rails.</div>
              </div>
            </div>
            <div key={1} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 2</div>
              <div>
                <div className="font-semibold mb-1">Gateway Setup</div>
                <div className="text-sm text-[#8B949E]">Integrate payment gateways, enable multi-currency.</div>
              </div>
            </div>
            <div key={2} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 3</div>
              <div>
                <div className="font-semibold mb-1">Compliance Validation</div>
                <div className="text-sm text-[#8B949E]">Implement KYC/AML, conduct security audits.</div>
              </div>
            </div>
            <div key={3} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 4</div>
              <div>
                <div className="font-semibold mb-1">Pilot Transactions</div>
                <div className="text-sm text-[#8B949E]">Process initial payments, validate workflows.</div>
              </div>
            </div>
            <div key={4} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 5</div>
              <div>
                <div className="font-semibold mb-1">Full Operations</div>
                <div className="text-sm text-[#8B949E]">Scale to all transactions with continuous monitoring.</div>
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
            <Link href="/payments" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <Link href="#" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              VIEW API →
            </Link>
            <Link href="/payments" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
