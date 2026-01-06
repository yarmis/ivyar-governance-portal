/**
 * HBS Global Search API
 * /api/search
 * 
 * Full-text search across all portal content
 */

import { NextRequest, NextResponse } from 'next/server';

// Search index - in production, use database or search service
const SEARCH_INDEX = [
  // HBS Modules
  {
    id: 'hbs-prometheus',
    title: 'HBS Prometheus v9.0',
    description: 'Distributed Ledger + Autonomous Governance + Crisis Prediction',
    category: 'module',
    path: '/hbs/prometheus',
    keywords: ['blockchain', 'ledger', 'governance', 'crisis', 'prediction', 'ai', 'autonomous'],
    content: 'HBS Sovereign Cloud v9.0 Prometheus. 24 countries, 192 programs, $7.8B budget, 9.6M beneficiaries. Ethereum L2, 45.2M transactions. AI Governance 99.4% autonomy.'
  },
  {
    id: 'hbs-governance',
    title: 'HBS Governance',
    description: 'Policy and rule management system',
    category: 'module',
    path: '/hbs/governance',
    keywords: ['governance', 'policy', 'rules', 'audit', 'control'],
    content: 'Governance management module for policies, rules, control mechanisms, and audit processes.'
  },
  {
    id: 'hbs-engine',
    title: 'HBS Engine',
    description: 'Live Governance Engine with AI',
    category: 'module',
    path: '/hbs/engine',
    keywords: ['engine', 'live', 'governance', 'ai', 'automation'],
    content: 'Real-time governance engine powering autonomous decision-making and process automation.'
  },
  {
    id: 'hbs-signals',
    title: 'HBS Signals',
    description: 'Real-time data ingestion and monitoring',
    category: 'module',
    path: '/hbs/signals',
    keywords: ['signals', 'data', 'monitoring', 'real-time', 'ingestion'],
    content: 'Signals layer collecting real-time data from programs, transactions, geo indicators, and donor feeds.'
  },
  {
    id: 'hbs-analytics',
    title: 'HBS Analytics',
    description: 'Insights, trends, and KPI dashboards',
    category: 'module',
    path: '/hbs/analytics',
    keywords: ['analytics', 'insights', 'trends', 'kpi', 'dashboard'],
    content: 'Analytics layer transforming data into actionable insights, trends, KPIs, and anomaly detection.'
  },
  {
    id: 'hbs-national',
    title: 'HBS National',
    description: 'National-level coordination',
    category: 'module',
    path: '/hbs/national',
    keywords: ['national', 'ministry', 'coordination', 'government'],
    content: 'National level coordination across ministries and government programs.'
  },
  {
    id: 'hbs-sovereign',
    title: 'HBS Sovereign',
    description: 'Sovereign infrastructure and compliance',
    category: 'module',
    path: '/hbs/sovereign',
    keywords: ['sovereign', 'infrastructure', 'compliance', 'strategic'],
    content: 'Sovereign level strategic decision support and national risk management.'
  },
  {
    id: 'hbs-ai',
    title: 'HBS AI Ops',
    description: 'AI operations and model management',
    category: 'module',
    path: '/hbs/ai',
    keywords: ['ai', 'operations', 'model', 'machine learning', 'automation'],
    content: 'AI operations center for model orchestration, monitoring, and optimization.'
  },
  {
    id: 'hbs-autopilot',
    title: 'HBS Autopilot',
    description: 'Autonomous governance processes',
    category: 'module',
    path: '/hbs/autopilot',
    keywords: ['autopilot', 'autonomous', 'automation', 'workflow'],
    content: 'Autopilot module for autonomous processes, automated recommendations, and controlled actions.'
  },
  {
    id: 'protection-delays',
    title: 'Protection from Delays',
    description: 'Claims and payment delay prevention',
    category: 'module',
    path: '/client',
    keywords: ['protection', 'delays', 'claims', 'payments', 'verification'],
    content: 'Protection from delays in claims processing, payments, and verifications.'
  },
  
  // Documentation
  {
    id: 'doc-concept',
    title: 'HBS v10.0 Concept Paper',
    description: 'Executive concept paper for HBS v10.0',
    category: 'documentation',
    path: '/docs/HBS_v10_CONCEPT_PAPER',
    keywords: ['concept', 'vision', 'sil', 'sovereign', 'intelligence'],
    content: 'HBS v10.0 Sovereign Intelligence Layer. Crisis Anticipation Engine, Ethical Core v2.0, Interoperability Hub, Autonomous Governance v2.0, National Digital Twin.'
  },
  {
    id: 'doc-architecture',
    title: 'SIL Architecture',
    description: 'Sovereign Intelligence Layer architecture',
    category: 'documentation',
    path: '/docs/HBS_v10_SIL_ARCHITECTURE',
    keywords: ['architecture', 'sil', 'diagram', 'technical', 'layer'],
    content: 'Sovereign Intelligence Layer architecture diagrams. Signals, Analytics, Forecasting, Optimization, Ethical Core, Autonomous Governance.'
  },
  {
    id: 'doc-ethics',
    title: 'Ethical Framework',
    description: 'Ethical Core v2.0 framework',
    category: 'documentation',
    path: '/docs/HBS_v10_ETHICAL_FRAMEWORK',
    keywords: ['ethics', 'ethical', 'zero harm', 'compliance', 'human oversight'],
    content: 'Ethical Core v2.0. Zero Harm Principle, Human Oversight, Transparency, Non-Discrimination, Accountability, Compliance. ESS stop signals.'
  },
  {
    id: 'doc-modules',
    title: 'Module Map',
    description: 'Complete module map of HBS v10.0',
    category: 'documentation',
    path: '/docs/HBS_v10_MODULE_MAP',
    keywords: ['modules', 'map', 'structure', 'components'],
    content: 'Full module map of HBS v10.0. SIL layer, Governance Delivery layer, Data Infrastructure layer. 20 modules total.'
  },
  {
    id: 'doc-deployment',
    title: 'State Deployment Framework',
    description: '4-phase national deployment model',
    category: 'documentation',
    path: '/docs/HBS_v10_STATE_DEPLOYMENT',
    keywords: ['deployment', 'implementation', 'rollout', 'government', 'national'],
    content: 'State Deployment Framework. Phase 1 Preparation, Phase 2 Pilot, Phase 3 National Rollout, Phase 4 International Alignment.'
  },
  {
    id: 'doc-government',
    title: 'Government Edition',
    description: 'Strategic overview for ministries',
    category: 'documentation',
    path: '/docs/HBS_v10_GOVERNMENT_EDITION',
    keywords: ['government', 'ministry', 'state', 'public sector'],
    content: 'Government Edition. Benefits for state: transparency, efficiency, control, compliance, prediction, institutional resilience.'
  },
  {
    id: 'doc-donor',
    title: 'Donor Edition',
    description: 'Guide for international donors',
    category: 'documentation',
    path: '/docs/HBS_v10_DONOR_EDITION',
    keywords: ['donor', 'usaid', 'eu', 'world bank', 'funding'],
    content: 'Donor Edition. Full transparency, accountability, risk reduction, efficiency gains, USAID ADS compliance, IATI, HXL.'
  },
  {
    id: 'doc-partners',
    title: 'International Partners Edition',
    description: 'Guide for UN, WB, OECD partners',
    category: 'documentation',
    path: '/docs/HBS_v10_INTERNATIONAL_PARTNERS',
    keywords: ['international', 'un', 'oecd', 'world bank', 'partners'],
    content: 'International Partners Edition. UN OCHA HDX, UNHCR PRIMES, UNICEF RapidPro, WFP SCOPE, World Bank Open Data integration.'
  },
  
  // Standards
  {
    id: 'standard-iati',
    title: 'IATI 2.03 Compliance',
    description: 'International Aid Transparency Initiative',
    category: 'standard',
    path: '/docs/standards/iati',
    keywords: ['iati', 'transparency', 'aid', 'humanitarian', 'reporting'],
    content: 'IATI 2.03 compliance. 99.2% adherence. Humanitarian data reporting standard.'
  },
  {
    id: 'standard-hxl',
    title: 'HXL 1.1 Support',
    description: 'Humanitarian Exchange Language',
    category: 'standard',
    path: '/docs/standards/hxl',
    keywords: ['hxl', 'humanitarian', 'data', 'exchange'],
    content: 'HXL 1.1 support. 99.8% compliance. Humanitarian data exchange standard.'
  },
  {
    id: 'standard-iso',
    title: 'ISO 27001 Certified',
    description: 'Information security management',
    category: 'standard',
    path: '/docs/security',
    keywords: ['iso', 'security', 'certification', '27001'],
    content: 'ISO 27001 certified. Information security management system certification.'
  },
  {
    id: 'standard-gdpr',
    title: 'GDPR Compliant',
    description: 'EU data protection regulation',
    category: 'standard',
    path: '/docs/security',
    keywords: ['gdpr', 'privacy', 'data protection', 'eu'],
    content: 'GDPR compliant. European Union data protection and privacy regulation.'
  },
  
  // Countries
  {
    id: 'country-ukraine',
    title: 'Ukraine',
    description: 'Primary deployment country',
    category: 'country',
    path: '/hbs/prometheus',
    keywords: ['ukraine', 'ua', 'eastern europe'],
    content: 'Ukraine. 52 programs, $3.2B budget, 4.8M beneficiaries, 3.2M digital IDs. Primary HBS deployment.'
  },
  {
    id: 'country-poland',
    title: 'Poland',
    description: 'Active deployment',
    category: 'country',
    path: '/hbs/prometheus',
    keywords: ['poland', 'pl', 'eu'],
    content: 'Poland. 38 programs, $1.5B budget, 2.1M beneficiaries. Active HBS deployment.'
  },
  {
    id: 'country-moldova',
    title: 'Moldova',
    description: 'Active deployment',
    category: 'country',
    path: '/hbs/prometheus',
    keywords: ['moldova', 'md'],
    content: 'Moldova. 28 programs, $0.8B budget, 0.6M beneficiaries. Active HBS deployment.'
  },
  {
    id: 'country-georgia',
    title: 'Georgia',
    description: 'Active deployment',
    category: 'country',
    path: '/hbs/prometheus',
    keywords: ['georgia', 'ge', 'caucasus'],
    content: 'Georgia. 24 programs, $0.7B budget, 0.5M beneficiaries. Active HBS deployment.'
  }
];

// Search function
function search(query: string, filters?: { category?: string; limit?: number }) {
  const q = query.toLowerCase().trim();
  const limit = filters?.limit || 20;
  const category = filters?.category;
  
  if (!q) {
    return [];
  }
  
  // Score each item
  const results = SEARCH_INDEX
    .filter(item => !category || item.category === category)
    .map(item => {
      let score = 0;
      
      // Title match (highest priority)
      if (item.title.toLowerCase().includes(q)) {
        score += 100;
        if (item.title.toLowerCase().startsWith(q)) {
          score += 50;
        }
      }
      
      // Keyword match (high priority)
      const keywordMatches = item.keywords.filter(k => k.includes(q)).length;
      score += keywordMatches * 30;
      
      // Description match (medium priority)
      if (item.description.toLowerCase().includes(q)) {
        score += 20;
      }
      
      // Content match (lower priority)
      const contentLower = item.content.toLowerCase();
      if (contentLower.includes(q)) {
        score += 10;
        // Bonus for multiple occurrences
        const occurrences = (contentLower.match(new RegExp(q, 'g')) || []).length;
        score += Math.min(occurrences * 2, 20);
      }
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return results;
}

// GET handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  const results = search(query, { category, limit });
  
  return NextResponse.json({
    query,
    count: results.length,
    results: results.map(({ score, ...item }) => item)
  });
}

// POST handler for advanced search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, limit } = body;
    
    const results = search(query || '', { category, limit });
    
    return NextResponse.json({
      query,
      count: results.length,
      results: results.map(({ score, ...item }) => item)
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
