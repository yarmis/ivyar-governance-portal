'use client';

import Link from 'next/link';

export default function FreightModulePage() {
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
            <div className="text-6xl">🚛</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">DIRECT FREIGHT</h1>
              <p className="text-lg text-[#8B949E]">Broker-Free Logistics</p>
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
              <div className="text-sm font-medium">10</div>
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
            <p>Direct Freight enables broker‑free freight coordination with AI‑optimized rates, verified carriers, and real‑time shipment visibility.</p>
            <p>It eliminates middlemen, reduces costs, and ensures transparency across the entire shipping lifecycle.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
                        <div>▸ Carrier risk scoring</div>
            <div>▸ Route and cost optimization</div>
            <div>▸ Delivery time prediction</div>
            <div>▸ Transparent pricing and tracking</div>
          </div>
        </section>

        {/* Key Capabilities */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔑</span>
            <h2 className="text-2xl font-bold">KEY CAPABILITIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div key={0} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer transition-all" onClick={() => alert("Coming soon")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <span className="text-xl">🚛</span>
              <span className="text-sm text-[#8B949E]">Direct freight booking</span>
            </div>
            <div key={1} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer transition-all" onClick={() => alert("Coming soon")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <span className="text-xl">📦</span>
              <span className="text-sm text-[#8B949E]">Real-time shipment tracking</span>
            </div>
            <div key={2} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer transition-all" onClick={() => alert("Coming soon")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <span className="text-xl">📊</span>
              <span className="text-sm text-[#8B949E]">AI rate optimization</span>
            </div>
            <div key={3} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer transition-all" onClick={() => alert("Coming soon")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <span className="text-xl">📁</span>
              <span className="text-sm text-[#8B949E]">Carrier verification and rating</span>
            </div>
            <div key={4} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer transition-all" onClick={() => alert("Coming soon")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <span className="text-xl">⚡</span>
              <span className="text-sm text-[#8B949E]">Instant quote generation</span>
            </div>
            <div key={5} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🧩</span>
              <span className="text-sm text-[#8B949E]">Integration with Logistics & Insurance</span>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="bg-[#161B22] border border-[#1F242C] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-bold">FREIGHT INTEGRATION</h2>
          </div>
          <p className="text-[#8B949E] mb-6">
            Direct Freight integrates with carrier networks, tracking systems, and logistics platforms.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Partners can supply:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Carrier networks and capacity</li>
                <li>— Tracking and telematics systems</li>
                <li>— Route and traffic data</li>
                <li>— Insurance and liability coverage</li>
                <li>— Customs and documentation services</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">IVYAR provides:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Direct carrier marketplace</li>
                <li>— AI pricing optimization</li>
                <li>— Real-time tracking dashboard</li>
                <li>— Carrier performance analytics</li>
                <li>— Automated documentation</li>
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
                <div className="font-semibold mb-1">Carrier Network</div>
                <div className="text-sm text-[#8B949E]">Onboard verified carriers, establish rate structures.</div>
              </div>
            </div>
            <div key={1} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 2</div>
              <div>
                <div className="font-semibold mb-1">Platform Integration</div>
                <div className="text-sm text-[#8B949E]">Connect tracking systems, enable real-time updates.</div>
              </div>
            </div>
            <div key={2} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 3</div>
              <div>
                <div className="font-semibold mb-1">AI Calibration</div>
                <div className="text-sm text-[#8B949E]">Train pricing models, optimize routes.</div>
              </div>
            </div>
            <div key={3} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 4</div>
              <div>
                <div className="font-semibold mb-1">Pilot Shipments</div>
                <div className="text-sm text-[#8B949E]">Process initial freight, validate performance.</div>
              </div>
            </div>
            <div key={4} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 5</div>
              <div>
                <div className="font-semibold mb-1">Scale Operations</div>
                <div className="text-sm text-[#8B949E]">Expand to all routes with continuous optimization.</div>
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
            <Link href="/freight" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <button onClick={() => alert("API Documentation\n\nREST API endpoints for freight booking, tracking, and rate optimization.\n\nFull documentation coming soon.")} className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors cursor-pointer">
              VIEW API →
            </button>
            <Link href="/freight" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
