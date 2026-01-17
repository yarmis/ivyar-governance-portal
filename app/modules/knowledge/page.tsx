'use client';



import Link from 'next/link';
import AIAssistant from '@/app/components/AIAssistant';

export default function KnowledgeBase() {
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
            <div className="text-5xl">📚</div>
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-[#E6EDF3]">
                KNOWLEDGE BASE
              </h1>
              <p className="mt-2 text-lg text-[#8B949E]">
                Institutional Education & Civic Literacy
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
              <div className="text-sm font-medium">2.4</div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase tracking-wide text-[#6E7681]">
                Articles
              </div>
              <div className="text-sm font-medium">1,240+</div>
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
                <span className="text-sm font-medium">Public Access</span>
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['WCAG 2.1 AAA', 'Multi-language', 'Open Content', 'Accessible'].map((badge) => (
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
              The Knowledge Base democratizes understanding of governance systems, making institutional 
              processes accessible to every citizen, stakeholder, and partner organization.
            </p>
            <p>
              It provides clear explanations of how IVYAR works, what standards govern its operations, 
              how decisions are made, and how security and ethics are maintained — transforming complexity 
              into clarity without sacrificing accuracy.
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
              <span>Intelligent content recommendations based on user context</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Automated translation quality assurance (24+ languages)</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Readability optimization for diverse literacy levels</span>
            </div>
            <div className="flex items-start gap-2">
              <span>▸</span>
              <span>Search enhancement with semantic understanding</span>
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
              <div className="mb-2 text-2xl">📖</div>
              <div className="font-medium">Comprehensive module documentation</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🗺️</div>
              <div className="font-medium">Visual learning paths and workflows</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">❓</div>
              <div className="font-medium">Interactive FAQs and troubleshooting</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🎓</div>
              <div className="font-medium">Role-based training materials</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">🔍</div>
              <div className="font-medium">Semantic search across all content</div>
            </div>
            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-4">
              <div className="mb-2 text-2xl">📹</div>
              <div className="font-medium">Video tutorials and case studies</div>
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold">
            <span>🧩</span>
            <span>KNOWLEDGE BASE INTEGRATION</span>
          </h2>
          <div className="space-y-6">
            <p className="text-[#8B949E]">
              The Knowledge Base integrates with content management systems, learning platforms, 
              and institutional documentation repositories.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">Partners can supply:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Existing policy and procedure documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Training materials and user guides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Legal and regulatory frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Historical decision records and rationale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Subject matter expert contacts</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-3 font-medium text-[#E6EDF3]">IVYAR provides:</h3>
                <ul className="space-y-2 text-sm text-[#8B949E]">
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Searchable, categorized knowledge repository</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>AI-assisted content translation and localization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Interactive learning pathways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Usage analytics and content effectiveness metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>*</span>
                    <span>Version control and update tracking</span>
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
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Content Audit</h4>
              <p className="text-sm text-[#6E7681]">
                Catalog existing documentation, identify gaps, define taxonomy and structure.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 2</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Content Migration</h4>
              <p className="text-sm text-[#6E7681]">
                Import and structure existing materials, translate core content, establish templates.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 3</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Beta Launch</h4>
              <p className="text-sm text-[#6E7681]">
                Release to internal users, collect feedback, refine navigation and search.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 4</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Public Release</h4>
              <p className="text-sm text-[#6E7681]">
                Open knowledge base to all stakeholders, activate AI-powered features.
              </p>
            </div>

            <div className="rounded-lg border border-[#1F242C] bg-[#161B22] p-6">
              <h3 className="mb-2 font-medium text-[#E6EDF3]">PHASE 5</h3>
              <h4 className="mb-3 text-sm font-medium text-[#8B949E]">Continuous Curation</h4>
              <p className="text-sm text-[#6E7681]">
                Regular content updates, community contributions, expanded language coverage.
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
              onClick={() => alert('Opening Knowledge Base interface...')}
              className="rounded-lg border border-[#1F6FEB] bg-[#1F6FEB]/10 px-6 py-3 font-medium text-[#1F6FEB] transition-colors hover:bg-[#1F6FEB]/20"
            >
              OPEN MODULE →
            </button>
            <button className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]">
              VIEW API →
            </button>
            <button
              onClick={() => alert('Browsing available documentation and learning paths...')}
              className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]"
            >
              VIEW DOCS →
            </button>
            <button
              onClick={() => alert('Launching interactive knowledge base tour...')}
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
      <AIAssistant module="knowledge" />
    </div>
  );
}
