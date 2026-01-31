'use client';

import Link from 'next/link';

export default function LogisticsModulePage() {
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
            <div className="text-6xl">🚚</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">LOGISTICS ENGINE</h1>
              <p className="text-lg text-[#8B949E]">End-to-End Supply Chain Visibility</p>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-xs text-[#8B949E] mb-1">STATUS</div>
              <div className="text-sm font-medium text-[#3CCB7F]">✓ PILOT</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">VERSION</div>
              <div className="text-sm font-medium">2.8</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">14</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">UPDATED</div>
              <div className="text-sm font-medium">2026-01-13</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">MODE</div>
              <div className="text-sm font-medium">● Pilot Phase</div>
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
            <p>The Logistics Engine delivers end‑to‑end visibility, route optimization, and supply chain tracking for critical infrastructure and humanitarian operations.</p>
            <p>It ensures timely, efficient, and transparent movement of goods with AI-powered predictive analytics and real-time monitoring.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
                        <div>▸ Route optimization and delay prediction</div>
            <div>▸ Risk-based cargo prioritization</div>
            <div>▸ Anomaly detection in transit</div>
            <div>▸ Transparent decision logging</div>
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
              <span className="text-xl">🚛</span>
              <span className="text-sm text-[#8B949E]">Real-time shipment tracking</span>
            </div>
            <div key={1} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📦</span>
              <span className="text-sm text-[#8B949E]">Inventory visibility across hubs</span>
            </div>
            <div key={2} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🛰️</span>
              <span className="text-sm text-[#8B949E]">Geo-monitoring and geofencing</span>
            </div>
            <div key={3} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">📊</span>
              <span className="text-sm text-[#8B949E]">Operational analytics & KPIs</span>
            </div>
            <div key={4} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">⚡</span>
              <span className="text-sm text-[#8B949E]">Automated route optimization</span>
            </div>
            <div key={5} className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <span className="text-xl">🧩</span>
              <span className="text-sm text-[#8B949E]">Integration with Procurement, Freight & Insurance</span>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="bg-[#161B22] border border-[#1F242C] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🧩</span>
            <h2 className="text-2xl font-bold">LOGISTICS INTEGRATION</h2>
          </div>
          <p className="text-[#8B949E] mb-6">
            The Logistics Engine connects with carriers, warehouse systems, and tracking platforms.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Partners can supply:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Carrier networks and capacity data</li>
                <li>— Warehouse and hub locations</li>
                <li>— GPS and IoT tracking devices</li>
                <li>— Customs and border clearance systems</li>
                <li>— Temperature and condition monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">IVYAR provides:</h3>
              <ul className="space-y-2 text-sm text-[#8B949E]">
                                <li>— Unified logistics dashboard</li>
                <li>— AI route optimization</li>
                <li>— Real-time cargo visibility</li>
                <li>— Predictive delay alerts</li>
                <li>— Multi-modal coordination</li>
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
                <div className="font-semibold mb-1">Network Mapping</div>
                <div className="text-sm text-[#8B949E]">Map carrier networks, hubs, and routes.</div>
              </div>
            </div>
            <div key={1} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 2</div>
              <div>
                <div className="font-semibold mb-1">System Integration</div>
                <div className="text-sm text-[#8B949E]">Connect tracking systems, enable real-time data flow.</div>
              </div>
            </div>
            <div key={2} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 3</div>
              <div>
                <div className="font-semibold mb-1">AI Calibration</div>
                <div className="text-sm text-[#8B949E]">Train models on historical data, validate predictions.</div>
              </div>
            </div>
            <div key={3} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 4</div>
              <div>
                <div className="font-semibold mb-1">Pilot Operations</div>
                <div className="text-sm text-[#8B949E]">Launch with selected routes, monitor performance.</div>
              </div>
            </div>
            <div key={4} className="flex gap-4 p-4 bg-[#161B22] border border-[#1F242C] rounded">
              <div className="text-sm font-mono text-[#00A3FF] whitespace-nowrap">PHASE 5</div>
              <div>
                <div className="font-semibold mb-1">Full Deployment</div>
                <div className="text-sm text-[#8B949E]">Scale to all operations with continuous optimization.</div>
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
            <Link href="/logistics" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <Link href="#" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              VIEW API →
            </Link>
            <Link href="/logistics" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
