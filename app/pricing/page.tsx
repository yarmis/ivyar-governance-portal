'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRICING_TIERS = [
  {
    name: 'Pilot',
    description: 'For initial deployment and proof of concept',
    price: 'Custom',
    period: 'per project',
    highlight: false,
    features: [
      '1-3 ministries',
      'Core modules (HBS, Analytics)',
      '3-month implementation',
      'Basic training (40 hours)',
      'Email support',
      'Standard SLA (99.5%)',
    ],
    cta: 'Start Pilot',
    href: '/demo',
  },
  {
    name: 'Government',
    description: 'Full national deployment with all modules',
    price: 'Custom',
    period: 'annual license',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited ministries',
      'All platform modules',
      'Sovereign Intelligence Layer',
      'Crisis Anticipation Engine',
      'Dedicated support team',
      'Enterprise SLA (99.9%)',
      'On-premise option',
      'Custom integrations',
      'HBS Academy access',
    ],
    cta: 'Request Quote',
    href: '/demo',
  },
  {
    name: 'International',
    description: 'For UN agencies, World Bank, and donors',
    price: 'Custom',
    period: 'partnership',
    highlight: false,
    features: [
      'Multi-country deployment',
      'Cross-border coordination',
      'Donor transparency dashboard',
      'IATI/HXL compliance',
      'Joint governance model',
      'Dedicated account team',
      'Priority roadmap input',
    ],
    cta: 'Partner With Us',
    href: '/demo',
  },
];

const MODULES_PRICING = [
  { name: 'HBS Core', description: 'Humanitarian Budget Support', included: ['Pilot', 'Government', 'International'] },
  { name: 'Analytics', description: 'Dashboards & KPIs', included: ['Pilot', 'Government', 'International'] },
  { name: 'Signals', description: 'Real-time data ingestion', included: ['Government', 'International'] },
  { name: 'Crisis Anticipation', description: 'Early warning system', included: ['Government', 'International'] },
  { name: 'AI Ops', description: 'Autonomous governance', included: ['Government', 'International'] },
  { name: 'Prometheus', description: 'Distributed ledger', included: ['Government', 'International'] },
  { name: 'National Digital Twin', description: 'State replica', included: ['Government', 'International'] },
  { name: 'Ethical Core v2.0', description: 'Ethics validation', included: ['Government', 'International'] },
  { name: 'Multi-country', description: 'Cross-border ops', included: ['International'] },
];

const FAQS = [
  {
    q: 'How is pricing determined?',
    a: 'Pricing is customized based on country size, number of ministries, modules required, and deployment complexity. Contact us for a detailed quote.',
  },
  {
    q: 'Is there a free trial?',
    a: 'We offer a 30-day proof of concept for qualified government and international organization partners.',
  },
  {
    q: 'What payment terms are available?',
    a: 'We support annual licensing, multi-year agreements, and donor-funded implementations with flexible payment schedules.',
  },
  {
    q: 'Can we start with a pilot and expand?',
    a: 'Yes. Most implementations start with a 3-6 month pilot in 1-3 ministries before national rollout.',
  },
  {
    q: 'Is on-premise deployment available?',
    a: 'Yes. Government tier includes on-premise deployment option for data sovereignty requirements.',
  },
  {
    q: 'What support is included?',
    a: 'All tiers include email support. Government and International tiers include dedicated support teams, 24/7 monitoring, and priority response.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">Pricing</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mt-4 mb-6">
            Transparent Pricing for<br />Government & Partners
          </h1>
          <p className="text-lg text-[#8B949E] max-w-2xl mx-auto">
            Flexible deployment models for governments, international organizations, and development partners. All pricing is customized to your specific needs.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-[60px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-[#161B22] border rounded-lg p-8 flex flex-col ${
                  tier.highlight
                    ? 'border-[#00A3FF] shadow-[0_0_30px_-5px_rgba(0,163,255,0.3)]'
                    : 'border-[#1F242C]'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00A3FF] text-[#0D1117] text-xs font-semibold rounded-full">
                    {tier.badge}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-sm text-[#8B949E]">{tier.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-sm text-[#8B949E] ml-2">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-[#3CCB7F] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#E6EDF3]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`h-12 flex items-center justify-center font-medium text-sm transition-colors ${
                    tier.highlight
                      ? 'bg-[#00A3FF] text-[#0D1117] hover:bg-[#33B5FF]'
                      : 'bg-[#1F242C] text-[#E6EDF3] hover:bg-[#2D333B] border border-[#3D444D]'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Comparison */}
      <section className="py-[80px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Module Availability</h2>
            <p className="text-[#8B949E]">Compare features across different tiers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1F242C]">
                  <th className="text-left py-4 px-4 text-sm font-medium text-[#8B949E]">Module</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-[#8B949E]">Pilot</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-[#00A3FF]">Government</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-[#8B949E]">International</th>
                </tr>
              </thead>
              <tbody>
                {MODULES_PRICING.map((module, i) => (
                  <tr key={i} className="border-b border-[#1F242C]/50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#E6EDF3]">{module.name}</div>
                      <div className="text-xs text-[#6E7681]">{module.description}</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      {module.included.includes('Pilot') ? (
                        <svg className="w-5 h-5 text-[#3CCB7F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[#6E7681]">—</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4 bg-[#00A3FF]/5">
                      {module.included.includes('Government') ? (
                        <svg className="w-5 h-5 text-[#3CCB7F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[#6E7681]">—</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {module.included.includes('International') ? (
                        <svg className="w-5 h-5 text-[#3CCB7F] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-[#6E7681]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-[80px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Cost Factors</h2>
            <p className="text-[#8B949E]">Understanding what influences your implementation cost</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏛️', title: 'Scale', desc: 'Number of ministries and programs' },
              { icon: '🧩', title: 'Modules', desc: 'Selected platform capabilities' },
              { icon: '🔗', title: 'Integration', desc: 'Connection to existing systems' },
              { icon: '🎓', title: 'Training', desc: 'Capacity building requirements' },
            ].map((factor, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                <div className="w-12 h-12 bg-[#00A3FF]/10 flex items-center justify-center text-2xl mb-4 rounded-lg">
                  {factor.icon}
                </div>
                <h3 className="font-semibold mb-2">{factor.title}</h3>
                <p className="text-sm text-[#8B949E]">{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-[80px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-[#1F242C] rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1F242C]/50 transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-[#8B949E] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-[#8B949E]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-[#8B949E] text-lg mb-8">
            Contact our team for a customized quote based on your specific requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center hover:bg-[#33B5FF] transition-colors"
            >
              Request Quote
            </Link>
            <Link
              href="mailto:sales@ivyar.org"
              className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center hover:bg-[#00A3FF]/10 transition-colors"
            >
              Contact Sales
            </Link>
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
