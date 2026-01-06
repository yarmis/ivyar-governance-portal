'use client';

import Link from 'next/link';
import { useState } from 'react';

const FAQ_CATEGORIES = [
  {
    name: 'General',
    icon: '📋',
    questions: [
      {
        q: 'What is IVYAR?',
        a: 'IVYAR is a sovereign intelligence platform for governments and international organizations. It provides transparent, ethical, AI-aligned governance infrastructure for humanitarian, social, and public programs.',
      },
      {
        q: 'Who is IVYAR designed for?',
        a: 'IVYAR is designed for governments, ministries, international organizations (UN, World Bank, OECD), donors (USAID, EU, bilateral partners), and humanitarian agencies.',
      },
      {
        q: 'What makes IVYAR different from other platforms?',
        a: 'IVYAR combines distributed ledger technology, autonomous governance, crisis prediction, and a unique Ethical Core that ensures zero harm, transparency, and human oversight in all operations.',
      },
      {
        q: 'Is IVYAR available globally?',
        a: 'Yes. IVYAR operates across 24+ countries with multi-region infrastructure. Primary regions include Ukraine, European Union, Canada, and United States.',
      },
    ],
  },
  {
    name: 'Platform & Modules',
    icon: '🧩',
    questions: [
      {
        q: 'What modules are included in IVYAR?',
        a: 'Core modules include: HBS (Humanitarian Budget Support), Analytics, Signals, Crisis Anticipation Engine, AI Ops, Prometheus (distributed ledger), National Digital Twin, and Ethical Core v2.0.',
      },
      {
        q: 'What is the Sovereign Intelligence Layer (SIL)?',
        a: 'SIL is the cognitive layer of HBS v10.0 that integrates analytics, forecasting, optimization, and ethical control into a unified intelligent system for national governance.',
      },
      {
        q: 'What is HBS Prometheus?',
        a: 'HBS Prometheus v9.0 is the distributed ledger and crisis prediction module. It manages 192 programs, $7.8B budget, 9.6M beneficiaries, and 45.2M+ transactions on Ethereum L2.',
      },
      {
        q: 'What is the Crisis Anticipation Engine?',
        a: 'An early warning system that predicts crises 48-72 hours in advance. It integrates with INFORM Risk Index, ACLED, UN OCHA, and GDACS for multi-hazard threat assessment.',
      },
      {
        q: 'Can I choose specific modules?',
        a: 'Yes. IVYAR is modular. You can start with core modules (HBS, Analytics) and expand to additional capabilities as needed.',
      },
    ],
  },
  {
    name: 'Ethics & Security',
    icon: '🛡️',
    questions: [
      {
        q: 'What is Ethical Core v2.0?',
        a: 'Ethical Core v2.0 is the ethics validation layer that ensures zero harm, non-discrimination, transparency, human oversight, and international standards compliance for every system decision.',
      },
      {
        q: 'Does AI make autonomous decisions?',
        a: 'No. IVYAR AI operates under human oversight. It provides recommendations and insights, but all critical decisions require human approval. The system includes override capability at all levels.',
      },
      {
        q: 'What security certifications does IVYAR have?',
        a: 'IVYAR is ISO 27001 certified, SOC 2 compliant, GDPR compliant, IRAP certified, and NATO-aligned.',
      },
      {
        q: 'How is data protected?',
        a: 'Data is protected with AES-256 encryption at rest, TLS 1.3 in transit, role-based access control, multi-factor authentication, complete audit trails, and immutable logging.',
      },
      {
        q: 'Can IVYAR be deployed on-premise?',
        a: 'Yes. Government tier includes on-premise deployment option for data sovereignty requirements.',
      },
    ],
  },
  {
    name: 'Implementation',
    icon: '🚀',
    questions: [
      {
        q: 'How long does implementation take?',
        a: 'Pilot implementations typically take 3-6 months. Full national rollout follows a 4-phase model: Preparation (6-12 weeks), Pilot (8-16 weeks), National Rollout (3-12 months), and International Alignment (ongoing).',
      },
      {
        q: 'What is the typical deployment process?',
        a: 'Phase 1: Institutional mandate and readiness assessment. Phase 2: Pilot in 1-3 ministries with training. Phase 3: Expansion to all ministries. Phase 4: International alignment and donor integration.',
      },
      {
        q: 'What training is provided?',
        a: 'IVYAR includes HBS Academy with structured courses, certification tests, and role-based training. Basic training starts at 40 hours for pilot implementations.',
      },
      {
        q: 'What support is available?',
        a: 'All tiers include email support. Government and International tiers include dedicated support teams, 24/7 monitoring, priority response, and a dedicated account manager.',
      },
      {
        q: 'Can we start with a pilot?',
        a: 'Yes. Most implementations start with a 3-6 month pilot in 1-3 ministries before national rollout. This allows for validation, training, and optimization.',
      },
    ],
  },
  {
    name: 'Compliance & Standards',
    icon: '✅',
    questions: [
      {
        q: 'What international standards does IVYAR comply with?',
        a: 'IVYAR aligns with UN Digital Governance Principles, World Bank GovTech Maturity Model, OECD Digital Government Framework, USAID Digital Strategy, and EU Interoperability Framework.',
      },
      {
        q: 'Is IVYAR IATI compliant?',
        a: 'Yes. IVYAR supports IATI 2.03 (99.2% compliance), HXL 1.1 (99.8% compliance), and OpenAPI 3.1 (100% compliance).',
      },
      {
        q: 'How does IVYAR support donor requirements?',
        a: 'IVYAR provides full transparency dashboards, automated IATI/HXL reporting, independent audit access, real-time monitoring, and compliance with USAID ADS 201/303/579.',
      },
      {
        q: 'Can auditors access the system?',
        a: 'Yes. IVYAR includes an independent audit layer with complete transaction logging, reproducible actions, and external verification access.',
      },
    ],
  },
  {
    name: 'Pricing & Licensing',
    icon: '💰',
    questions: [
      {
        q: 'How is pricing determined?',
        a: 'Pricing is customized based on country size, number of ministries, modules required, integration complexity, and training needs. Contact us for a detailed quote.',
      },
      {
        q: 'What payment options are available?',
        a: 'We support annual licensing, multi-year agreements, and donor-funded implementations with flexible payment schedules.',
      },
      {
        q: 'Is there a free trial?',
        a: 'We offer a 30-day proof of concept for qualified government and international organization partners.',
      },
      {
        q: 'What tiers are available?',
        a: 'Three tiers: Pilot (1-3 ministries, core modules), Government (unlimited ministries, all modules), and International (multi-country, cross-border coordination).',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('General');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const currentCategory = FAQ_CATEGORIES.find(c => c.name === activeCategory) || FAQ_CATEGORIES[0];

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
          <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">Support</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#8B949E] max-w-2xl mx-auto">
            Find answers to common questions about IVYAR platform, implementation, security, and pricing.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-[100px] space-y-2">
                <h3 className="text-xs font-medium text-[#6E7681] uppercase tracking-wider mb-4">Categories</h3>
                {FAQ_CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setActiveCategory(category.name);
                      setOpenQuestion(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.name
                        ? 'bg-[#00A3FF]/10 text-[#00A3FF] border border-[#00A3FF]/30'
                        : 'bg-[#161B22] text-[#8B949E] border border-[#1F242C] hover:border-[#3D444D]'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-auto text-xs bg-[#1F242C] px-2 py-0.5 rounded">
                      {category.questions.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{currentCategory.icon}</span>
                <h2 className="text-xl font-semibold">{currentCategory.name}</h2>
              </div>

              <div className="space-y-4">
                {currentCategory.questions.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-[#1F242C] rounded-lg overflow-hidden bg-[#161B22]"
                  >
                    <button
                      onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1F242C]/50 transition-colors"
                    >
                      <span className="font-medium pr-4 text-[#E6EDF3]">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 text-[#8B949E] shrink-0 transition-transform ${
                          openQuestion === i ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openQuestion === i && (
                      <div className="px-5 pb-5 text-[#8B949E] leading-relaxed border-t border-[#1F242C] pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-[80px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-[#8B949E] text-lg mb-8">
            Our team is here to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center hover:bg-[#33B5FF] transition-colors"
            >
              Request Demo
            </Link>
            <Link
              href="mailto:support@ivyar.org"
              className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center hover:bg-[#00A3FF]/10 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h3 className="text-lg font-semibold mb-6 text-center">Helpful Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📚', title: 'Documentation', desc: 'Technical guides and API reference', href: '/docs' },
              { icon: '💰', title: 'Pricing', desc: 'Plans and cost models', href: '/pricing' },
              { icon: '🚀', title: 'Request Demo', desc: 'See IVYAR in action', href: '/demo' },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-start gap-4 p-6 bg-[#161B22] border border-[#1F242C] rounded-lg hover:border-[#00A3FF] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#00A3FF]/10 flex items-center justify-center text-2xl rounded-lg">
                  {link.icon}
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[#00A3FF] transition-colors">{link.title}</h4>
                  <p className="text-sm text-[#8B949E]">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[#6E7681]">© 2024-2026 IVYAR Platform</span>
          <span className="text-sm text-[#6E7681]">NATO-Aligned • Multi-Region Infrastructure</span>
        </div>
      </footer>
    </div>
  );
}
