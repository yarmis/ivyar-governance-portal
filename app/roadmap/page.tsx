'use client';

import Link from 'next/link';
import { useState } from 'react';

const ROADMAP_QUARTERS = [
  {
    quarter: 'Q1 2026',
    status: 'current',
    theme: 'Sovereign Intelligence Foundation',
    items: [
      {
        title: 'Sovereign Intelligence Layer (SIL) v1.0',
        description: 'Core cognitive layer for national governance',
        status: 'in-progress',
        progress: 75,
        tags: ['Core', 'AI'],
      },
      {
        title: 'Crisis Anticipation Engine v2.0',
        description: 'Enhanced early warning with 72-hour prediction',
        status: 'in-progress',
        progress: 60,
        tags: ['AI', 'Analytics'],
      },
      {
        title: 'Ethical Core v2.0',
        description: 'Advanced ethics validation with ESS stop signals',
        status: 'completed',
        progress: 100,
        tags: ['Ethics', 'Compliance'],
      },
      {
        title: 'IATI 2.03 Full Compliance',
        description: 'Complete humanitarian data standard support',
        status: 'completed',
        progress: 100,
        tags: ['Compliance', 'Integration'],
      },
      {
        title: 'Multi-language Dashboard',
        description: 'Support for EN, UK, FR, DE, ES, AR',
        status: 'in-progress',
        progress: 45,
        tags: ['UX', 'Localization'],
      },
    ],
  },
  {
    quarter: 'Q2 2026',
    status: 'upcoming',
    theme: 'National Scale & Integration',
    items: [
      {
        title: 'National Digital Twin v1.0',
        description: 'Real-time state replica for simulation',
        status: 'planned',
        progress: 0,
        tags: ['Core', 'AI'],
      },
      {
        title: 'Interoperability Hub',
        description: 'UN OCHA, UNHCR, WFP, World Bank connectors',
        status: 'planned',
        progress: 0,
        tags: ['Integration', 'Partners'],
      },
      {
        title: 'Autonomous Governance v2.0',
        description: 'Enhanced automation with human oversight',
        status: 'planned',
        progress: 0,
        tags: ['AI', 'Governance'],
      },
      {
        title: 'HBS Academy v2.0',
        description: 'Interactive training platform with certifications',
        status: 'planned',
        progress: 0,
        tags: ['Training', 'UX'],
      },
      {
        title: 'Mobile App (iOS/Android)',
        description: 'Field operations and notifications',
        status: 'planned',
        progress: 0,
        tags: ['Mobile', 'UX'],
      },
    ],
  },
  {
    quarter: 'Q3 2026',
    status: 'future',
    theme: 'Advanced AI & Cross-Border',
    items: [
      {
        title: 'Predictive Resource Allocation',
        description: 'AI-driven budget optimization',
        status: 'planned',
        progress: 0,
        tags: ['AI', 'Analytics'],
      },
      {
        title: 'Cross-Border Coordination',
        description: 'Multi-country program management',
        status: 'planned',
        progress: 0,
        tags: ['International', 'Governance'],
      },
      {
        title: 'Advanced Fraud Detection v3.0',
        description: 'ML-powered anomaly detection',
        status: 'planned',
        progress: 0,
        tags: ['Security', 'AI'],
      },
      {
        title: 'Real-time Translation Engine',
        description: 'Live document and chat translation',
        status: 'planned',
        progress: 0,
        tags: ['AI', 'UX'],
      },
    ],
  },
  {
    quarter: 'Q4 2026',
    status: 'future',
    theme: 'Global Scale & Ecosystem',
    items: [
      {
        title: 'Partner API Marketplace',
        description: 'Third-party integrations ecosystem',
        status: 'planned',
        progress: 0,
        tags: ['Platform', 'Integration'],
      },
      {
        title: 'Decentralized Identity (DID)',
        description: 'Self-sovereign identity for beneficiaries',
        status: 'planned',
        progress: 0,
        tags: ['Security', 'Blockchain'],
      },
      {
        title: 'Climate Risk Integration',
        description: 'Climate data for crisis prediction',
        status: 'planned',
        progress: 0,
        tags: ['Analytics', 'Environment'],
      },
      {
        title: 'HBS v11.0 Planning',
        description: 'Next generation architecture',
        status: 'planned',
        progress: 0,
        tags: ['Core', 'Future'],
      },
    ],
  },
];

const COMPLETED_MILESTONES = [
  { date: 'Dec 2025', title: 'HBS v10.0 "Sovereign Intelligence" Release', type: 'major' },
  { date: 'Nov 2025', title: 'Prometheus v9.0 Distributed Ledger', type: 'major' },
  { date: 'Oct 2025', title: '45M+ Transactions Milestone', type: 'milestone' },
  { date: 'Sep 2025', title: '24 Countries Active', type: 'milestone' },
  { date: 'Aug 2025', title: 'ISO 27001 Certification', type: 'certification' },
  { date: 'Jul 2025', title: 'SOC 2 Type II Compliance', type: 'certification' },
  { date: 'Jun 2025', title: 'IRAP Certification', type: 'certification' },
  { date: 'May 2025', title: '$7.8B Budget Under Management', type: 'milestone' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-[#3CCB7F]/15', text: 'text-[#3CCB7F]', label: 'Completed' },
  'in-progress': { bg: 'bg-[#00A3FF]/15', text: 'text-[#00A3FF]', label: 'In Progress' },
  planned: { bg: 'bg-[#8B949E]/15', text: 'text-[#8B949E]', label: 'Planned' },
};

const QUARTER_STATUS: Record<string, { border: string; badge: string }> = {
  current: { border: 'border-[#00A3FF]', badge: 'bg-[#00A3FF] text-[#0D1117]' },
  upcoming: { border: 'border-[#FFB84D]', badge: 'bg-[#FFB84D] text-[#0D1117]' },
  future: { border: 'border-[#1F242C]', badge: 'bg-[#1F242C] text-[#8B949E]' },
};

export default function RoadmapPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(ROADMAP_QUARTERS.flatMap(q => q.items.flatMap(i => i.tags)))
  ).sort();

  const filteredQuarters = ROADMAP_QUARTERS.map(quarter => ({
    ...quarter,
    items: selectedTag
      ? quarter.items.filter(item => item.tags.includes(selectedTag))
      : quarter.items,
  }));

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">
              IV
            </div>
            <span className="text-lg font-semibold">IVYAR</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[#8B949E] hover:text-white transition-colors">
              ← Back to Home
            </Link>
            <Link
              href="/demo"
              className="h-11 px-6 bg-[#00A3FF] text-[#0D1117] font-medium text-sm flex items-center hover:bg-[#33B5FF] transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[140px] pb-[60px]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">Product</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4 mb-6">
            Product Roadmap
          </h1>
          <p className="text-lg text-[#8B949E] max-w-2xl mx-auto">
            Our vision for IVYAR's evolution. Transparent planning for governments, donors, and partners.
          </p>
        </div>
      </section>

      {/* Current Version Badge */}
      <section className="pb-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 rounded-full">
              <span className="w-2 h-2 bg-[#3CCB7F] rounded-full" />
              <span className="text-sm font-medium text-[#3CCB7F]">Current: HBS v10.0 "Sovereign Intelligence"</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-full">
              <span className="text-sm text-[#8B949E]">Prometheus v9.0</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-full">
              <span className="text-sm text-[#8B949E]">24 Countries • 192 Programs • $7.8B</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tags */}
      <section className="pb-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                !selectedTag
                  ? 'bg-[#00A3FF] text-[#0D1117]'
                  : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-[40px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="space-y-8">
            {filteredQuarters.map((quarter, qi) => (
              <div
                key={quarter.quarter}
                className={`border rounded-xl overflow-hidden ${QUARTER_STATUS[quarter.status].border}`}
              >
                {/* Quarter Header */}
                <div className="flex items-center justify-between p-6 bg-[#161B22] border-b border-[#1F242C]">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded ${QUARTER_STATUS[quarter.status].badge}`}>
                      {quarter.quarter}
                    </span>
                    <h2 className="text-lg font-semibold text-[#E6EDF3]">{quarter.theme}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6E7681]">{quarter.items.length} items</span>
                    {quarter.status === 'current' && (
                      <span className="flex items-center gap-1 text-xs text-[#00A3FF]">
                        <span className="w-1.5 h-1.5 bg-[#00A3FF] rounded-full animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Quarter Items */}
                <div className="divide-y divide-[#1F242C]">
                  {quarter.items.length === 0 ? (
                    <div className="p-6 text-center text-[#6E7681]">
                      No items match the selected filter
                    </div>
                  ) : (
                    quarter.items.map((item, i) => (
                      <div key={i} className="p-6 hover:bg-[#161B22]/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-[#E6EDF3]">{item.title}</h3>
                              <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${STATUS_COLORS[item.status].bg} ${STATUS_COLORS[item.status].text}`}>
                                {STATUS_COLORS[item.status].label}
                              </span>
                            </div>
                            <p className="text-sm text-[#8B949E] mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-[10px] font-medium bg-[#1F242C] text-[#8B949E] rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {item.status !== 'planned' && (
                            <div className="w-32 shrink-0">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-[#6E7681]">Progress</span>
                                <span className="text-[#E6EDF3] font-medium">{item.progress}%</span>
                              </div>
                              <div className="h-2 bg-[#1F242C] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    item.progress === 100 ? 'bg-[#3CCB7F]' : 'bg-[#00A3FF]'
                                  }`}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Completed Milestones */}
      <section className="py-[60px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-8 text-center">Completed Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPLETED_MILESTONES.map((milestone, i) => (
              <div
                key={i}
                className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    milestone.type === 'major' ? 'bg-[#00A3FF]' :
                    milestone.type === 'certification' ? 'bg-[#A371F7]' :
                    'bg-[#3CCB7F]'
                  }`} />
                  <span className="text-xs text-[#6E7681]">{milestone.date}</span>
                </div>
                <p className="text-sm font-medium text-[#E6EDF3]">{milestone.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Feature */}
      <section className="py-[60px]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Have a Feature Request?</h2>
          <p className="text-[#8B949E] mb-8">
            We actively incorporate feedback from governments, donors, and partners into our roadmap.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/support#ticket"
              className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center hover:bg-[#33B5FF] transition-colors"
            >
              Submit Feature Request
            </Link>
            <Link
              href="/demo"
              className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center hover:bg-[#00A3FF]/10 transition-colors"
            >
              Discuss with Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-[40px] bg-[#161B22] border-t border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#00A3FF]" />
              <span className="text-[#8B949E]">Current Quarter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#FFB84D]" />
              <span className="text-[#8B949E]">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#1F242C]" />
              <span className="text-[#8B949E]">Future</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#3CCB7F]" />
              <span className="text-[#8B949E]">Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[#6E7681]">© 2024-2026 IVYAR Platform</span>
          <span className="text-sm text-[#6E7681]">Roadmap updated: January 2026</span>
        </div>
      </footer>
    </div>
  );
}
