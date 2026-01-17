'use client';

import Link from 'next/link';

export default function CultureModulePage() {
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
            <div className="text-6xl">🎭</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">CULTURE & MEDIA HARMONY</h1>
              <p className="text-lg text-[#8B949E]">Cultural Infrastructure & Media Coordination</p>
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
              <div className="text-sm font-medium">1.0</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div>
              <div className="text-sm font-medium">1</div>
            </div>
            <div>
              <div className="text-xs text-[#8B949E] mb-1">UPDATED</div>
              <div className="text-sm font-medium">2026-01-16</div>
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

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 text-white space-y-12">
        
        {/* Overview */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📘</span>
            <h2 className="text-2xl font-bold">OVERVIEW</h2>
          </div>
          <div className="space-y-3 text-[#8B949E]">
            <p>Culture & Media Harmony enables institutions to preserve cultural heritage, coordinate media outreach, and maintain consistent communication across multiple channels and languages.</p>
            <p>It transforms cultural assets into accessible digital infrastructure while ensuring ethical guidelines and cultural sensitivity.</p>
          </div>
        </section>

        {/* AI Governance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h2 className="text-2xl font-bold">AI GOVERNANCE</h2>
          </div>
          <div className="space-y-2 text-[#8B949E]">
            <div>▸ Cultural sensitivity review</div>
            <div>▸ Multi-language content validation</div>
            <div>▸ Media compliance checking</div>
            <div>▸ Human approval for public releases</div>
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
              { icon: '🎨', title: 'Cultural heritage preservation' },
              { icon: '📰', title: 'Media coordination and outreach' },
              { icon: '🌍', title: 'Multi-language content management' },
              { icon: '📊', title: 'Communication analytics' },
              { icon: '🎬', title: 'Multimedia asset management' },
              { icon: '🧩', title: 'Integration with social platforms' },
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
            <Link href="/culture-hub" className="px-6 py-3 bg-[#00A3FF] text-white font-semibold rounded hover:bg-[#33B5FF] transition-colors">
              OPEN MODULE →
            </Link>
            <button
              onClick={() => alert('API Documentation\n\nGET /api/v1/culture/metrics - Culture & media metrics\n\nFull documentation coming soon.')}
              className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors cursor-pointer"
            >
              VIEW API →
            </button>
            <Link href="/culture-hub" className="px-6 py-3 bg-[#161B22] border border-[#1F242C] font-semibold rounded hover:border-[#00A3FF] transition-colors">
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
