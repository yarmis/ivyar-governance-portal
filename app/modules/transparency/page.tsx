'use client';



import Link from 'next/link';
import AIAssistant from '@/app/components/AIAssistant';

export default function TransparencyHub() {
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
            <div className="text-5xl">👁️</div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-[#E6EDF3]">
                TRANSPARENCY HUB
              </h1>
              <p className="mt-2 text-lg text-[#8B949E]">
                Public Trust & Governance Visibility
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
                <span className="text-[#3CCB7F]">✓</span>
                <span className="text-sm font-medium">LIVE</span>
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Version
              </div>
              <div className="text-sm font-medium">3.1</div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                API Endpoints
              </div>
              <div className="text-sm font-medium">16</div>
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
                <span className="h-2 w-2 rounded-full bg-[#3CCB7F]"></span>
                <span className="text-sm font-medium">Global Deployment</span>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['ISO 27001', 'SOC 2', 'GDPR', 'IRAP', 'PQC-Ready'].map((badge) => (
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
              The Transparency Hub provides citizens, donors, and oversight bodies with real-time visibility 
              into government operations, resource allocation, and project outcomes.
            </p>
            <p>
              It transforms complex governance data into clear, accessible insights — enabling public accountability, 
              informed decision-making, and institutional trust through radical transparency.
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
              <span>Explainable AI insights with full reasoning trails</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Automated bias detection and fairness auditing</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Human oversight required for all public-facing outputs</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Transparent model documentation and impact assessments</span>
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
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4 cursor-pointer transition-all" onClick={() => alert("Transparency Feature\n\nDetailed insights and visualizations coming soon.")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <div className="mb-2 text-2xl">💰</div>
              <div className="font-medium">Financial flow visualization</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4 cursor-pointer transition-all" onClick={() => alert("Transparency Feature\n\nDetailed insights and visualizations coming soon.")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <div className="mb-2 text-2xl">📊</div>
              <div className="font-medium">Project progress tracking</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4 cursor-pointer transition-all" onClick={() => alert("Transparency Feature\n\nDetailed insights and visualizations coming soon.")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <div className="mb-2 text-2xl">🎯</div>
              <div className="font-medium">Impact measurement and reporting</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4 cursor-pointer transition-all" onClick={() => alert("Transparency Feature\n\nDetailed insights and visualizations coming soon.")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <div className="mb-2 text-2xl">🔍</div>
              <div className="font-medium">Decision transparency and audit trails</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4 cursor-pointer transition-all" onClick={() => alert("Transparency Feature\n\nDetailed insights and visualizations coming soon.")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <div className="mb-2 text-2xl">📱</div>
              <div className="font-medium">Personalized citizen dashboards</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4 cursor-pointer transition-all" onClick={() => alert("Transparency Feature\n\nDetailed insights and visualizations coming soon.")} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3CCB7F"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1F242C"}>
              <div className="mb-2 text-2xl">🔔</div>
              <div className="font-medium">Intelligent alerts and notifications</div>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🧩</span>
            <span>TRANSPARENCY INTEGRATION</span>
          </h2>
          <div className="space-y-6">
            <p className="text-[#8B949E]">
              The Transparency Hub integrates with existing government systems, donor platforms, 
              and international reporting frameworks.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">Partners can supply:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Treasury and financial management data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Project execution and monitoring systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Procurement and contract records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Donor funding and disbursement tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Audit and compliance documentation</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">IVYAR provides:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Unified public-facing transparency platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>AI-powered anomaly detection and insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Real-time dashboards and visualizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Multi-stakeholder access controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>International standards compliance (IATI, OECD DAC)</span>
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
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Discovery & Configuration</h4>
              <p className="text-sm text-[#6E7681]">
                Map existing data sources, define stakeholder access levels, configure initial dashboards.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 2</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Data Pipeline Setup</h4>
              <p className="text-sm text-[#6E7681]">
                Establish secure API connections, automate data ingestion, implement validation rules.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 3</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Pilot Launch</h4>
              <p className="text-sm text-[#6E7681]">
                Deploy transparency portal for selected projects, gather user feedback, refine interfaces.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 4</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Full Deployment</h4>
              <p className="text-sm text-[#6E7681]">
                Expand to all government operations, enable public access, integrate AI monitoring.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 5</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Continuous Enhancement</h4>
              <p className="text-sm text-[#6E7681]">
                Ongoing feature releases, quarterly AI audits, stakeholder-driven improvements.
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
              onClick={() => alert('Opening Transparency Hub module interface...')}
              className="rounded-lg border border-[#1F6FEB] bg-[#1F6FEB]/10 px-6 py-3 font-medium text-[#1F6FEB] transition-colors hover:bg-[#1F6FEB]/20"
            >
              OPEN MODULE →
            </button>
            <button
              onClick={() => alert('Loading API documentation for Transparency Hub endpoints...')}
              className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]"
            >
              VIEW API →
            </button>
            <button
              onClick={() => alert('Launching interactive demo with sample transparency data...')}
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
      {/* AI Assistant */}
      <AIAssistant module="transparency" />
    </div>
  );
}
