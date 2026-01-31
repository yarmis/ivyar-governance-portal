'use client';

import Link from 'next/link';

export default function TradeModulePage() {
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
            <div className="text-6xl">🏪</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">TRADE MODULE</h1>
              <p className="text-lg text-[#8B949E]">Verified B2B Marketplace</p>
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
              <div className="text-sm font-medium">2.9</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">12</div>
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
            <p>The Trade Module enables verified, compliant B2B transactions between trusted suppliers, buyers, and institutions.</p>
            <p>It ensures transparency, traceability, and accountability in commercial operations with AI-assisted supplier verification.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
                        <div>▸ Supplier risk scoring</div>
            <div>▸ Transaction anomaly detection</div>
            <div>▸ Fraud pattern recognition</div>
            <div>▸ Transparent trading history</div>
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
              <span className="text-xl">🏷️</span>
              <span className="text-sm text-[#8B949E]">Verified supplier directory</span>
            </div>
            <div key={1} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📦</span>
              <span className="text-sm text-[#8B949E]">Product catalogs and specifications</span>
            </div>
            <div key={2} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">💳</span>
              <span className="text-sm text-[#8B949E]">Secure transaction processing</span>
            </div>
            <div key={3} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📊</span>
              <span className="text-sm text-[#8B949E]">Market analytics and insights</span>
            </div>
            <div key={4} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🔐</span>
              <span className="text-sm text-[#8B949E]">Contract enforcement and escrow</span>
            </div>
            <div key={5} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🧩</span>
              <span className="text-sm text-[#8B949E]">Integration with Procurement & Payments</span>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="bg-[#161B22] border border-[#1F242C] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-bold">TRADE INTEGRATION</h2>
          </div>
          <p className="text-[#8B949E] mb-6">
            The Trade Module connects with e-commerce platforms, supplier networks, and payment gateways.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Partners can supply:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Product catalogs and pricing</li>
                <li>— Supplier credentials and certifications</li>
                <li>— Trade compliance requirements</li>
                <li>— Logistics and fulfillment networks</li>
                <li>— Payment and settlement systems</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">IVYAR provides:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Verified marketplace platform</li>
                <li>— AI supplier vetting</li>
                <li>— Secure transaction infrastructure</li>
                <li>— Real-time market analytics</li>
                <li>— Multi-party escrow services</li>
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
                <div className="font-semibold mb-1">Supplier Onboarding</div>
                <div className="text-sm text-[#8B949E]">Verify suppliers, build product catalogs.</div>
              </div>
            </div>
            <div key={1} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 2</div>
              <div>
                <div className="font-semibold mb-1">Platform Integration</div>
                <div className="text-sm text-[#8B949E]">Connect payment gateways, enable transactions.</div>
              </div>
            </div>
            <div key={2} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 3</div>
              <div>
                <div className="font-semibold mb-1">Pilot Trading</div>
                <div className="text-sm text-[#8B949E]">Launch with selected categories, monitor activity.</div>
              </div>
            </div>
            <div key={3} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 4</div>
              <div>
                <div className="font-semibold mb-1">Market Expansion</div>
                <div className="text-sm text-[#8B949E]">Scale to all product categories and regions.</div>
              </div>
            </div>
            <div key={4} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 5</div>
              <div>
                <div className="font-semibold mb-1">Continuous Growth</div>
                <div className="text-sm text-[#8B949E]">Add features, refine AI, expand partnerships.</div>
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
            <Link href="/trade" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <Link href="#" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              VIEW API →
            </Link>
            <Link href="/trade" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
