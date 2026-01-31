'use client';

import Link from 'next/link';

export default function DonorDashboardModulePage() {
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
            <div className="text-6xl">🤝</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">DONOR DASHBOARD</h1>
              <p className="text-lg text-[#8B949E]">Funding Transparency & Impact Reporting</p>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-xs text-[#8B949E] mb-1">STATUS</div>
              <div className="text-sm font-medium text-[#F59E0B]">⚠ DESIGN</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">VERSION</div>
              <div className="text-sm font-medium">0.1</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">12</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">UPDATED</div>
              <div className="text-sm font-medium">2026-01-16</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">MODE</div>
              <div className="text-sm font-medium">⚙️ In Development</div>
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

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 text-white space-y-12">
        
        {/* Overview */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📘</span>
            <h2 className="text-2xl font-bold">OVERVIEW</h2>
          </div>
          <div className="space-y-3 text-[#8B949E]">
            <p>The Donor Dashboard provides complete visibility into fund allocation and impact. Every dollar is tracked from commitment to outcome, with real-time reporting and AI-powered impact analysis.</p>
            <p>It enables international donors to monitor portfolio performance, track beneficiary outcomes, and ensure compliance with funding requirements.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
            <div>▸ Impact prediction and modeling</div>
            <div>▸ Fraud detection and anomaly alerts</div>
            <div>▸ Portfolio optimization recommendations</div>
            <div>▸ Transparent AI decision explanations</div>
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
              { icon: '💰', title: 'Real-time fund tracking' },
              { icon: '📊', title: 'Impact metrics dashboard' },
              { icon: '📈', title: 'Automated project reporting' },
              { icon: '🎯', title: 'Donor analytics & ROI' },
              { icon: '📋', title: 'Compliance reports generation' },
              { icon: '💬', title: 'Beneficiary feedback integration' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer transition-all"
                onClick={() => alert(`${item.title}\n\nDetailed documentation coming soon.`)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3CCB7F'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1F242C'}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-[#8B949E]">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔗</span>
            <h2 className="text-2xl font-bold">ACTIONS</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/donor-dashboard" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <button
              onClick={() => alert('API Documentation\n\n12 endpoints for donor management, impact tracking, and reporting.\n\nFull documentation coming soon.')}
              className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors cursor-pointer"
            >
              VIEW API →
            </button>
            <Link href="/donor-dashboard" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
              RUN DEMO →
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1F242C] bg-[#161B22] px-6 py-8">
        <div className="max-w-[1200px] mx-auto text-center text-sm text-[#6E7681]">
          🇺🇸 Built in the United States • 💙💛 Inspired by Ukraine • 🌍 Designed for the world
        </div>
      </footer>
    </div>
  );
}
