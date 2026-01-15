'use client';



import Link from 'next/link';

export default function CitizenFeedback() {
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
            <div className="text-5xl">💬</div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-[#E6EDF3]">
                CITIZEN FEEDBACK
              </h1>
              <p className="mt-2 text-lg text-[#8B949E]">
                Structured Public Dialogue & Insight
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
              <div className="text-sm font-medium">2.8</div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                API Endpoints
              </div>
              <div className="text-sm font-medium">12</div>
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
                <span className="text-sm font-medium">Active Listening</span>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['ISO 27001', 'SOC 2', 'GDPR', 'WCAG 2.1 AAA'].map((badge) => (
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
              The Citizen Feedback module creates a structured, respectful channel for public input on 
              government services, policies, and institutional performance.
            </p>
            <p>
              Unlike traditional complaint systems, this module treats citizen insights as valuable intelligence 
              that informs continuous improvement, policy refinement, and responsive governance.
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
              <span>Sentiment analysis with cultural context awareness</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Automatic categorization and priority routing</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Pattern detection across feedback themes</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Privacy protection and anonymization options</span>
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
              <div className="mb-2 text-2xl">📝</div>
              <div className="font-medium">Multi-channel feedback collection</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🔄</div>
              <div className="font-medium">"You Said, We Did" transparency</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">📊</div>
              <div className="font-medium">Trend analysis and reporting</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🔔</div>
              <div className="font-medium">Response tracking and notifications</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🌍</div>
              <div className="font-medium">Multi-language support (24+ languages)</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🛡️</div>
              <div className="font-medium">Anonymous and authenticated modes</div>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🧩</span>
            <span>FEEDBACK INTEGRATION</span>
          </h2>
          <div className="space-y-6">
            <p className="text-[#8B949E]">
              The Citizen Feedback module integrates with CRM systems, service delivery platforms, 
              and case management tools across government agencies.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">Partners can supply:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Existing complaint management systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Customer service platforms and ticketing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Survey tools and response databases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Social media monitoring feeds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Call center transcripts and logs</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">IVYAR provides:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Unified feedback aggregation platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>AI-powered sentiment and trend analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Automated routing to responsible agencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Public transparency dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Response accountability and tracking</span>
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
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Channel Mapping</h4>
              <p className="text-sm text-[#6E7681]">
                Identify existing feedback channels, categorization taxonomies, and routing workflows.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 2</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Platform Setup</h4>
              <p className="text-sm text-[#6E7681]">
                Configure feedback forms, integrate data sources, establish AI categorization rules.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 3</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Soft Launch</h4>
              <p className="text-sm text-[#6E7681]">
                Pilot with select agencies, train staff on response protocols, refine categorization.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 4</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Public Rollout</h4>
              <p className="text-sm text-[#6E7681]">
                Launch public feedback portal, activate all channels, enable transparency dashboard.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 5</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Continuous Improvement</h4>
              <p className="text-sm text-[#6E7681]">
                Regular review cycles, policy updates based on insights, AI model refinement.
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
              onClick={() => alert('Opening Citizen Feedback module interface...')}
              className="rounded-lg border border-[#1F6FEB] bg-[#1F6FEB]/10 px-6 py-3 font-medium text-[#1F6FEB] transition-colors hover:bg-[#1F6FEB]/20"
            >
              OPEN MODULE →
            </button>
            <button
              onClick={() => alert('Loading API documentation for Feedback endpoints...')}
              className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]"
            >
              VIEW API →
            </button>
            <button
              onClick={() => alert('Launching interactive demo with sample feedback workflows...')}
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
