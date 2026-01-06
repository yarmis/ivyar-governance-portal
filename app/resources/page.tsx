'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type ResourceCategory = 'whitepaper' | 'standard' | 'ethics' | 'audit' | 'case-study' | 'deployment';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  date: string;
  author?: string;
  pages?: number;
  readTime?: string;
  downloadUrl?: string;
  tags: string[];
  featured?: boolean;
  country?: string;
  countryFlag?: string;
}

// ============================================
// DATA
// ============================================
const CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: '📚', count: 0 },
  { id: 'whitepaper', name: 'Whitepapers', icon: '📄', count: 0, color: '#00A3FF' },
  { id: 'standard', name: 'Governance Standards', icon: '⚖️', count: 0, color: '#A371F7' },
  { id: 'ethics', name: 'Ethical Framework', icon: '🛡️', count: 0, color: '#3CCB7F' },
  { id: 'audit', name: 'Audit & Compliance', icon: '✅', count: 0, color: '#F59E0B' },
  { id: 'case-study', name: 'Case Studies', icon: '💡', count: 0, color: '#EC4899' },
  { id: 'deployment', name: 'Country Deployments', icon: '🌍', count: 0, color: '#06B6D4' },
];

const RESOURCES: Resource[] = [
  // ========================================
  // WHITEPAPERS
  // ========================================
  {
    id: 'wp-sovereign-intelligence',
    title: 'Sovereign Intelligence: AI-Aligned Governance for Nation States',
    description: 'Comprehensive framework for implementing AI-driven decision support systems in government while maintaining democratic oversight, ethical boundaries, and national sovereignty.',
    category: 'whitepaper',
    date: '2026-01',
    author: 'IVYAR Research',
    pages: 48,
    readTime: '45 min',
    tags: ['AI', 'governance', 'sovereignty', 'ethics'],
    featured: true,
  },
  {
    id: 'wp-prometheus-blockchain',
    title: 'Prometheus: Distributed Ledger for Public Finance Transparency',
    description: 'Technical whitepaper on Prometheus v9.0 blockchain architecture, consensus mechanisms, and applications for government financial accountability.',
    category: 'whitepaper',
    date: '2025-11',
    author: 'IVYAR Engineering',
    pages: 62,
    readTime: '60 min',
    tags: ['blockchain', 'transparency', 'Ethereum L2', 'audit'],
    featured: true,
  },
  {
    id: 'wp-hbs-model',
    title: 'Humanitarian Budget Support: A New Paradigm for Social Protection',
    description: 'Research paper on the HBS model for delivering social protection at scale, including case studies from 24 countries and $7.8B in managed disbursements.',
    category: 'whitepaper',
    date: '2025-09',
    author: 'IVYAR Policy Team',
    pages: 36,
    readTime: '35 min',
    tags: ['HBS', 'social protection', 'cash transfers', 'development'],
  },
  {
    id: 'wp-crisis-anticipation',
    title: 'Crisis Anticipation Engine: Predictive Analytics for Humanitarian Response',
    description: 'Technical overview of the Crisis Anticipation Engine, combining 47 data sources with machine learning for 14-day early warning capabilities.',
    category: 'whitepaper',
    date: '2025-07',
    author: 'IVYAR Data Science',
    pages: 42,
    readTime: '40 min',
    tags: ['crisis', 'prediction', 'AI', 'early warning'],
  },
  {
    id: 'wp-digital-twin',
    title: 'National Digital Twin: Modeling State-Level Decision Making',
    description: 'Framework for creating digital replicas of national systems to simulate policy impacts before implementation.',
    category: 'whitepaper',
    date: '2025-05',
    author: 'IVYAR Research',
    pages: 38,
    readTime: '35 min',
    tags: ['digital twin', 'simulation', 'policy', 'modeling'],
  },

  // ========================================
  // GOVERNANCE STANDARDS
  // ========================================
  {
    id: 'std-data-governance',
    title: 'IVYAR Data Governance Standard v3.0',
    description: 'Comprehensive data governance framework covering data classification, access controls, retention policies, and cross-border data flows.',
    category: 'standard',
    date: '2026-01',
    pages: 86,
    tags: ['data', 'governance', 'GDPR', 'privacy'],
    featured: true,
  },
  {
    id: 'std-api-governance',
    title: 'API Governance & Integration Standards',
    description: 'Standards for API design, versioning, security, rate limiting, and integration patterns for IVYAR platform extensions.',
    category: 'standard',
    date: '2025-10',
    pages: 54,
    tags: ['API', 'integration', 'security', 'standards'],
  },
  {
    id: 'std-procurement',
    title: 'Public Procurement Governance Framework',
    description: 'Standards for transparent procurement processes, bid evaluation criteria, contract management, and anti-corruption measures.',
    category: 'standard',
    date: '2025-08',
    pages: 72,
    tags: ['procurement', 'transparency', 'anti-corruption', 'OCDS'],
  },
  {
    id: 'std-beneficiary',
    title: 'Beneficiary Data Protection Standard',
    description: 'Privacy-preserving standards for handling sensitive beneficiary information in social protection programs.',
    category: 'standard',
    date: '2025-06',
    pages: 48,
    tags: ['privacy', 'beneficiary', 'protection', 'PII'],
  },
  {
    id: 'std-interoperability',
    title: 'Government Systems Interoperability Standard',
    description: 'Technical standards for integrating IVYAR with national ID systems, treasury management, and social registries.',
    category: 'standard',
    date: '2025-04',
    pages: 64,
    tags: ['interoperability', 'integration', 'government', 'X-Road'],
  },
  {
    id: 'std-iati-implementation',
    title: 'IATI 2.03 Implementation Guide',
    description: 'Complete guide for achieving IATI compliance, including data mapping, validation rules, and reporting workflows.',
    category: 'standard',
    date: '2025-03',
    pages: 42,
    tags: ['IATI', 'transparency', 'reporting', 'donors'],
  },

  // ========================================
  // ETHICAL FRAMEWORK
  // ========================================
  {
    id: 'eth-core-charter',
    title: 'IVYAR Ethical Charter v2.0',
    description: 'Foundational ethical principles governing all IVYAR operations: zero harm, non-discrimination, transparency, human oversight, and accountability.',
    category: 'ethics',
    date: '2026-01',
    pages: 28,
    tags: ['ethics', 'charter', 'principles', 'values'],
    featured: true,
  },
  {
    id: 'eth-ai-governance',
    title: 'Ethical AI Governance Framework',
    description: 'Comprehensive framework for developing, deploying, and monitoring AI systems in humanitarian and government contexts.',
    category: 'ethics',
    date: '2025-11',
    pages: 56,
    tags: ['AI ethics', 'governance', 'bias', 'fairness'],
  },
  {
    id: 'eth-human-oversight',
    title: 'Human-in-the-Loop: Oversight Protocols for AI Systems',
    description: 'Detailed protocols for maintaining human oversight over AI-driven decisions, including escalation procedures and override mechanisms.',
    category: 'ethics',
    date: '2025-09',
    pages: 34,
    tags: ['human oversight', 'AI', 'control', 'safety'],
  },
  {
    id: 'eth-bias-mitigation',
    title: 'Bias Detection & Mitigation Guidelines',
    description: 'Technical and procedural guidelines for identifying, measuring, and mitigating algorithmic bias in IVYAR systems.',
    category: 'ethics',
    date: '2025-07',
    pages: 46,
    tags: ['bias', 'fairness', 'ML', 'discrimination'],
  },
  {
    id: 'eth-data-ethics',
    title: 'Data Ethics in Humanitarian Operations',
    description: 'Ethical considerations for collecting, processing, and sharing data about vulnerable populations.',
    category: 'ethics',
    date: '2025-05',
    pages: 38,
    tags: ['data ethics', 'humanitarian', 'consent', 'privacy'],
  },
  {
    id: 'eth-ess-protocols',
    title: 'Emergency Stop System (ESS) Protocols',
    description: 'Technical documentation for ESS implementation, including trigger conditions, response procedures, and recovery processes.',
    category: 'ethics',
    date: '2025-04',
    pages: 24,
    tags: ['ESS', 'safety', 'emergency', 'shutdown'],
  },

  // ========================================
  // AUDIT & COMPLIANCE
  // ========================================
  {
    id: 'aud-iso27001-cert',
    title: 'ISO 27001:2022 Certification Report',
    description: 'External audit report confirming IVYAR platform compliance with ISO 27001 information security management standards.',
    category: 'audit',
    date: '2025-12',
    author: 'Deloitte',
    pages: 124,
    tags: ['ISO 27001', 'security', 'certification', 'audit'],
    featured: true,
  },
  {
    id: 'aud-soc2-report',
    title: 'SOC 2 Type II Attestation Report',
    description: 'Independent attestation report on security, availability, processing integrity, confidentiality, and privacy controls.',
    category: 'audit',
    date: '2025-11',
    author: 'KPMG',
    pages: 186,
    tags: ['SOC 2', 'controls', 'attestation', 'security'],
  },
  {
    id: 'aud-gdpr-assessment',
    title: 'GDPR Compliance Assessment',
    description: 'Comprehensive assessment of IVYAR GDPR compliance including data processing activities, legal bases, and rights fulfillment.',
    category: 'audit',
    date: '2025-09',
    author: 'DLA Piper',
    pages: 78,
    tags: ['GDPR', 'privacy', 'compliance', 'EU'],
  },
  {
    id: 'aud-penetration-test',
    title: 'Q4 2025 Penetration Testing Report',
    description: 'Quarterly security assessment including vulnerability scanning, penetration testing, and remediation recommendations.',
    category: 'audit',
    date: '2025-12',
    author: 'NCC Group',
    pages: 92,
    tags: ['security', 'pentest', 'vulnerability', 'assessment'],
  },
  {
    id: 'aud-blockchain-audit',
    title: 'Prometheus Smart Contract Audit',
    description: 'Independent security audit of Prometheus blockchain smart contracts by leading blockchain security firm.',
    category: 'audit',
    date: '2025-10',
    author: 'Trail of Bits',
    pages: 64,
    tags: ['blockchain', 'smart contract', 'security', 'audit'],
  },
  {
    id: 'aud-ethics-review',
    title: 'Annual Ethical AI Review 2025',
    description: 'Independent review of AI systems ethics compliance, bias assessments, and human oversight effectiveness.',
    category: 'audit',
    date: '2025-12',
    author: 'Ada Lovelace Institute',
    pages: 56,
    tags: ['AI ethics', 'review', 'bias', 'oversight'],
  },
  {
    id: 'aud-compliance-guide',
    title: 'Regulatory Compliance Guide',
    description: 'Comprehensive guide to regulatory requirements across jurisdictions including EU, US, UK, and partner countries.',
    category: 'audit',
    date: '2025-08',
    pages: 148,
    tags: ['compliance', 'regulatory', 'legal', 'international'],
  },

  // ========================================
  // CASE STUDIES
  // ========================================
  {
    id: 'cs-ukraine-idp',
    title: 'Ukraine IDP Cash Assistance Program',
    description: 'How IVYAR enabled rapid deployment of cash assistance to 2.1 million internally displaced persons within 6 weeks.',
    category: 'case-study',
    date: '2025-11',
    readTime: '12 min',
    tags: ['Ukraine', 'IDP', 'cash transfer', 'emergency'],
    featured: true,
    country: 'Ukraine',
    countryFlag: '🇺🇦',
  },
  {
    id: 'cs-jordan-refugees',
    title: 'Jordan Refugee Social Protection Integration',
    description: 'Integration of UNHCR refugee data with national social protection system serving 680,000 Syrian refugees.',
    category: 'case-study',
    date: '2025-09',
    readTime: '15 min',
    tags: ['Jordan', 'refugees', 'UNHCR', 'integration'],
    country: 'Jordan',
    countryFlag: '🇯🇴',
  },
  {
    id: 'cs-kenya-procurement',
    title: 'Kenya Public Procurement Transparency Initiative',
    description: 'Blockchain-verified procurement reducing corruption indicators by 67% across 12 government ministries.',
    category: 'case-study',
    date: '2025-07',
    readTime: '10 min',
    tags: ['Kenya', 'procurement', 'anti-corruption', 'blockchain'],
    country: 'Kenya',
    countryFlag: '🇰🇪',
  },
  {
    id: 'cs-bangladesh-flood',
    title: 'Bangladesh Flood Response: Crisis Anticipation in Action',
    description: 'How 14-day early warning enabled pre-positioning of resources, reducing response time by 56%.',
    category: 'case-study',
    date: '2025-05',
    readTime: '8 min',
    tags: ['Bangladesh', 'flood', 'crisis', 'early warning'],
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
  },
  {
    id: 'cs-colombia-peace',
    title: 'Colombia Post-Conflict Reintegration Program',
    description: 'Supporting reintegration of 13,000 ex-combatants through targeted social protection and skills training.',
    category: 'case-study',
    date: '2025-03',
    readTime: '14 min',
    tags: ['Colombia', 'peace', 'reintegration', 'social protection'],
    country: 'Colombia',
    countryFlag: '🇨🇴',
  },
  {
    id: 'cs-morocco-digital',
    title: 'Morocco Digital Social Registry',
    description: 'Building a unified social registry covering 11 million households for targeted social protection.',
    category: 'case-study',
    date: '2025-01',
    readTime: '11 min',
    tags: ['Morocco', 'registry', 'digital', 'social protection'],
    country: 'Morocco',
    countryFlag: '🇲🇦',
  },

  // ========================================
  // COUNTRY DEPLOYMENT STORIES
  // ========================================
  {
    id: 'dep-ukraine',
    title: 'Ukraine: National Scale HBS Deployment',
    description: 'Full deployment story of IVYAR HBS in Ukraine, managing $4.2B in social protection across all 24 oblasts with 9.6M beneficiaries.',
    category: 'deployment',
    date: '2025-12',
    readTime: '20 min',
    tags: ['Ukraine', 'national', 'HBS', 'scale'],
    featured: true,
    country: 'Ukraine',
    countryFlag: '🇺🇦',
  },
  {
    id: 'dep-poland',
    title: 'Poland: Cross-Border Humanitarian Coordination',
    description: 'Coordinating refugee response across Poland-Ukraine border with real-time data sharing between 47 organizations.',
    category: 'deployment',
    date: '2025-10',
    readTime: '15 min',
    tags: ['Poland', 'coordination', 'refugees', 'border'],
    country: 'Poland',
    countryFlag: '🇵🇱',
  },
  {
    id: 'dep-germany',
    title: 'Germany: Federal Integration Program',
    description: 'Integration of IVYAR with German federal systems for refugee benefit administration across 16 Länder.',
    category: 'deployment',
    date: '2025-08',
    readTime: '18 min',
    tags: ['Germany', 'federal', 'integration', 'refugees'],
    country: 'Germany',
    countryFlag: '🇩🇪',
  },
  {
    id: 'dep-georgia',
    title: 'Georgia: Digital Government Transformation',
    description: 'Comprehensive e-governance deployment integrating social protection, procurement, and citizen services.',
    category: 'deployment',
    date: '2025-06',
    readTime: '14 min',
    tags: ['Georgia', 'e-governance', 'digital', 'transformation'],
    country: 'Georgia',
    countryFlag: '🇬🇪',
  },
  {
    id: 'dep-moldova',
    title: 'Moldova: EU Accession Alignment',
    description: 'Aligning Moldovan social protection systems with EU standards using IVYAR governance framework.',
    category: 'deployment',
    date: '2025-04',
    readTime: '12 min',
    tags: ['Moldova', 'EU', 'alignment', 'standards'],
    country: 'Moldova',
    countryFlag: '🇲🇩',
  },
  {
    id: 'dep-albania',
    title: 'Albania: Post-Earthquake Recovery Program',
    description: 'Rapid deployment supporting 45,000 households affected by 2019 earthquake through reconstruction assistance.',
    category: 'deployment',
    date: '2025-02',
    readTime: '10 min',
    tags: ['Albania', 'recovery', 'earthquake', 'reconstruction'],
    country: 'Albania',
    countryFlag: '🇦🇱',
  },
  {
    id: 'dep-ethiopia',
    title: 'Ethiopia: Productive Safety Net Program Integration',
    description: 'Integration with Ethiopia PSNP, the largest social protection program in Africa serving 8 million beneficiaries.',
    category: 'deployment',
    date: '2024-12',
    readTime: '16 min',
    tags: ['Ethiopia', 'PSNP', 'Africa', 'scale'],
    country: 'Ethiopia',
    countryFlag: '🇪🇹',
  },
  {
    id: 'dep-indonesia',
    title: 'Indonesia: PKH Program Digitization',
    description: 'Digital transformation of Indonesia\'s flagship conditional cash transfer program reaching 10 million families.',
    category: 'deployment',
    date: '2024-10',
    readTime: '14 min',
    tags: ['Indonesia', 'PKH', 'digital', 'CCT'],
    country: 'Indonesia',
    countryFlag: '🇮🇩',
  },
];

// Update category counts
CATEGORIES.forEach(cat => {
  if (cat.id === 'all') {
    cat.count = RESOURCES.length;
  } else {
    cat.count = RESOURCES.filter(r => r.category === cat.id).length;
  }
});

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  'whitepaper': '#00A3FF',
  'standard': '#A371F7',
  'ethics': '#3CCB7F',
  'audit': '#F59E0B',
  'case-study': '#EC4899',
  'deployment': '#06B6D4',
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = RESOURCES.filter(resource => {
    if (activeCategory !== 'all' && resource.category !== activeCategory) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (resource.country && resource.country.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const featuredResources = RESOURCES.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <span className="font-semibold">IVYAR Resources</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-[#8B949E] hover:text-white">Documentation</Link>
            <Link href="/academy" className="text-sm text-[#8B949E] hover:text-white">Academy</Link>
            <Link href="/demo" className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]">
              Request Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">📚</span>
              <span className="text-sm bg-[#00A3FF]/10 text-[#00A3FF] px-3 py-1 rounded-full font-medium">
                Knowledge Center
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Resources & Publications</h1>
            <p className="text-lg text-[#8B949E]">
              Explore whitepapers, governance standards, ethical frameworks, audit reports, 
              case studies, and country deployment stories from the IVYAR platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-10">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#161B22] border-[#00A3FF]'
                    : 'bg-[#0D1117] border-[#1F242C] hover:border-[#3D444D]'
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-2xl font-bold" style={{ color: cat.color }}>{cat.count}</div>
                <div className="text-xs text-[#8B949E]">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="py-12 border-b border-[#1F242C]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-xl font-semibold mb-6">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.slice(0, 4).map((resource) => (
                <div
                  key={resource.id}
                  className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 hover:border-[#3D444D] transition-all group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">
                      {CATEGORIES.find(c => c.id === resource.category)?.icon}
                    </span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${CATEGORY_COLORS[resource.category]}15`,
                        color: CATEGORY_COLORS[resource.category]
                      }}
                    >
                      {CATEGORIES.find(c => c.id === resource.category)?.name}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-[#00A3FF] transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-[#8B949E] line-clamp-2 mb-3">{resource.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#6E7681]">
                    <span>{resource.date}</span>
                    {resource.pages && <span>{resource.pages} pages</span>}
                    {resource.readTime && <span>{resource.readTime}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24">
                {/* Search */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161B22] border border-[#1F242C] rounded-lg pl-10 pr-4 py-2.5 text-sm"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Categories */}
                <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-[#00A3FF]/10 text-[#00A3FF]'
                          : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161B22]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-xs">{cat.count}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Links */}
                <div className="mt-8 pt-6 border-t border-[#1F242C]">
                  <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
                    Quick Links
                  </h3>
                  <div className="space-y-2 text-sm">
                    <a href="#" className="block text-[#8B949E] hover:text-[#00A3FF]">📥 Download All (ZIP)</a>
                    <a href="#" className="block text-[#8B949E] hover:text-[#00A3FF]">📧 Subscribe to Updates</a>
                    <a href="#" className="block text-[#8B949E] hover:text-[#00A3FF]">🔗 API Documentation</a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Resource Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {activeCategory === 'all' ? 'All Resources' : CATEGORIES.find(c => c.id === activeCategory)?.name}
                  <span className="text-sm font-normal text-[#8B949E] ml-2">
                    ({filteredResources.length} items)
                  </span>
                </h2>
                <select className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Most Popular</option>
                </select>
              </div>

              {/* Whitepapers Section */}
              {(activeCategory === 'all' || activeCategory === 'whitepaper') && filteredResources.some(r => r.category === 'whitepaper') && (
                <div className="mb-10">
                  {activeCategory === 'all' && (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>📄</span> Whitepapers
                    </h3>
                  )}
                  <div className="space-y-4">
                    {filteredResources.filter(r => r.category === 'whitepaper').map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Governance Standards Section */}
              {(activeCategory === 'all' || activeCategory === 'standard') && filteredResources.some(r => r.category === 'standard') && (
                <div className="mb-10">
                  {activeCategory === 'all' && (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>⚖️</span> Governance Standards
                    </h3>
                  )}
                  <div className="space-y-4">
                    {filteredResources.filter(r => r.category === 'standard').map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ethical Framework Section */}
              {(activeCategory === 'all' || activeCategory === 'ethics') && filteredResources.some(r => r.category === 'ethics') && (
                <div className="mb-10">
                  {activeCategory === 'all' && (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>🛡️</span> Ethical Framework
                    </h3>
                  )}
                  <div className="space-y-4">
                    {filteredResources.filter(r => r.category === 'ethics').map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Audit & Compliance Section */}
              {(activeCategory === 'all' || activeCategory === 'audit') && filteredResources.some(r => r.category === 'audit') && (
                <div className="mb-10">
                  {activeCategory === 'all' && (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>✅</span> Audit & Compliance
                    </h3>
                  )}
                  <div className="space-y-4">
                    {filteredResources.filter(r => r.category === 'audit').map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Case Studies Section */}
              {(activeCategory === 'all' || activeCategory === 'case-study') && filteredResources.some(r => r.category === 'case-study') && (
                <div className="mb-10">
                  {activeCategory === 'all' && (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>💡</span> Case Studies
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredResources.filter(r => r.category === 'case-study').map((resource) => (
                      <CaseStudyCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Country Deployments Section */}
              {(activeCategory === 'all' || activeCategory === 'deployment') && filteredResources.some(r => r.category === 'deployment') && (
                <div className="mb-10">
                  {activeCategory === 'all' && (
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span>🌍</span> Country Deployment Stories
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredResources.filter(r => r.category === 'deployment').map((resource) => (
                      <DeploymentCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {filteredResources.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                  <p className="text-[#8B949E]">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* World Map Section */}
      <section className="py-16 bg-[#161B22] border-t border-[#1F242C]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-4">Global Deployment Footprint</h2>
            <p className="text-[#8B949E]">IVYAR is deployed in 24+ countries across 6 continents</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { flag: '🇺🇦', name: 'Ukraine', status: 'National' },
              { flag: '🇵🇱', name: 'Poland', status: 'Active' },
              { flag: '🇩🇪', name: 'Germany', status: 'Active' },
              { flag: '🇬🇪', name: 'Georgia', status: 'Active' },
              { flag: '🇲🇩', name: 'Moldova', status: 'Active' },
              { flag: '🇦🇱', name: 'Albania', status: 'Active' },
              { flag: '🇯🇴', name: 'Jordan', status: 'Active' },
              { flag: '🇰🇪', name: 'Kenya', status: 'Pilot' },
              { flag: '🇧🇩', name: 'Bangladesh', status: 'Pilot' },
              { flag: '🇨🇴', name: 'Colombia', status: 'Active' },
              { flag: '🇲🇦', name: 'Morocco', status: 'Active' },
              { flag: '🇪🇹', name: 'Ethiopia', status: 'Pilot' },
              { flag: '🇮🇩', name: 'Indonesia', status: 'Pilot' },
              { flag: '🇹🇷', name: 'Turkey', status: 'Active' },
              { flag: '🇱🇻', name: 'Latvia', status: 'Active' },
              { flag: '🇱🇹', name: 'Lithuania', status: 'Active' },
            ].map((country, i) => (
              <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">{country.flag}</div>
                <div className="text-xs font-medium">{country.name}</div>
                <div className={`text-[10px] mt-1 ${
                  country.status === 'National' ? 'text-[#3CCB7F]' :
                  country.status === 'Active' ? 'text-[#00A3FF]' : 'text-[#F59E0B]'
                }`}>
                  {country.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 border-t border-[#1F242C]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-[#8B949E] mb-6">
            Subscribe to receive new whitepapers, case studies, and platform updates.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-[#161B22] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
            />
            <button className="px-6 py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF]">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-xs">
                IV
              </div>
              <span className="text-sm text-[#8B949E]">IVYAR Resources — Knowledge Center</span>
            </div>
            <div className="flex gap-6 text-sm text-[#6E7681]">
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 hover:border-[#3D444D] transition-all group">
      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: `${CATEGORY_COLORS[resource.category]}15` }}
        >
          {CATEGORIES.find(c => c.id === resource.category)?.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold group-hover:text-[#00A3FF] transition-colors mb-1">
                {resource.title}
              </h4>
              <p className="text-sm text-[#8B949E] line-clamp-2 mb-3">{resource.description}</p>
            </div>
            {resource.featured && (
              <span className="shrink-0 text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-4 text-xs text-[#6E7681]">
            <span>{resource.date}</span>
            {resource.author && <span>by {resource.author}</span>}
            {resource.pages && <span>{resource.pages} pages</span>}
            {resource.readTime && <span>{resource.readTime} read</span>}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="text-xs bg-[#1F242C] text-[#6E7681] px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <button className="text-sm text-[#00A3FF] font-medium hover:underline">
              Download PDF →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudyCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#EC4899] transition-all group">
      <div className="h-2" style={{ backgroundColor: CATEGORY_COLORS['case-study'] }}></div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {resource.countryFlag && <span className="text-2xl">{resource.countryFlag}</span>}
          <span className="text-xs text-[#EC4899] font-medium">{resource.country}</span>
        </div>
        <h4 className="font-semibold mb-2 group-hover:text-[#EC4899] transition-colors">
          {resource.title}
        </h4>
        <p className="text-sm text-[#8B949E] line-clamp-2 mb-4">{resource.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#6E7681]">
            <span>{resource.date}</span>
            {resource.readTime && <span>{resource.readTime}</span>}
          </div>
          <button className="text-sm text-[#EC4899] font-medium hover:underline">
            Read Story →
          </button>
        </div>
      </div>
    </div>
  );
}

function DeploymentCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#06B6D4] transition-all group">
      <div className="h-2" style={{ backgroundColor: CATEGORY_COLORS['deployment'] }}></div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {resource.countryFlag && <span className="text-3xl">{resource.countryFlag}</span>}
          <div>
            <span className="text-lg font-semibold">{resource.country}</span>
            <div className="text-xs text-[#06B6D4]">Deployment Story</div>
          </div>
        </div>
        <h4 className="font-medium mb-2 group-hover:text-[#06B6D4] transition-colors">
          {resource.title}
        </h4>
        <p className="text-sm text-[#8B949E] line-clamp-2 mb-4">{resource.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-[#06B6D4]/10 text-[#06B6D4] px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6E7681]">{resource.readTime}</span>
          <button className="text-sm text-[#06B6D4] font-medium hover:underline">
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
}
