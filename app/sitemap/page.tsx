'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// MODULE DEFINITIONS
// ============================================
const MODULES = {
  core: [
    {
      id: 'hbs',
      name: 'HBS Core',
      icon: '🏛️',
      status: 'live',
      apis: 24,
      description: 'Humanitarian Budget Support',
      color: '#00A3FF',
      routes: [
        { path: '/hbs', name: 'Dashboard' },
        { path: '/hbs/overview', name: 'Overview' },
        { path: '/hbs/programs', name: 'Programs' },
        { path: '/hbs/beneficiaries', name: 'Beneficiaries' },
        { path: '/hbs/payments', name: 'Payments' },
        { path: '/hbs/reports', name: 'Reports' },
        { path: '/hbs/audit', name: 'Audit Trail' },
        { path: '/hbs/settings', name: 'Settings' },
      ],
    },
    {
      id: 'governance',
      name: 'Governance Engine',
      icon: '⚖️',
      status: 'live',
      apis: 18,
      description: 'Policy & compliance management',
      color: '#A371F7',
      routes: [
        { path: '/governance', name: 'Dashboard' },
        { path: '/governance/policies', name: 'Policies' },
        { path: '/governance/workflows', name: 'Workflows' },
        { path: '/governance/compliance', name: 'Compliance' },
        { path: '/governance/risks', name: 'Risk Assessment' },
        { path: '/governance/audit', name: 'Audit' },
      ],
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📊',
      status: 'live',
      apis: 22,
      description: 'Dashboards & KPI tracking',
      color: '#3CCB7F',
      routes: [
        { path: '/analytics', name: 'Dashboard' },
        { path: '/analytics/kpis', name: 'KPIs' },
        { path: '/analytics/trends', name: 'Trends' },
        { path: '/analytics/reports', name: 'Reports' },
        { path: '/analytics/exports', name: 'Exports' },
        { path: '/analytics/alerts', name: 'Alerts' },
      ],
    },
    {
      id: 'prometheus',
      name: 'Prometheus',
      icon: '🔗',
      status: 'live',
      apis: 16,
      description: 'Distributed ledger (Ethereum L2)',
      color: '#F97316',
      routes: [
        { path: '/prometheus', name: 'Dashboard' },
        { path: '/prometheus/ledger', name: 'Ledger' },
        { path: '/prometheus/transactions', name: 'Transactions' },
        { path: '/prometheus/verification', name: 'Verification' },
        { path: '/prometheus/nodes', name: 'Nodes' },
        { path: '/prometheus/contracts', name: 'Contracts' },
      ],
    },
    {
      id: 'signals',
      name: 'Signals',
      icon: '📡',
      status: 'live',
      apis: 14,
      description: 'Real-time data ingestion',
      color: '#06B6D4',
      routes: [
        { path: '/signals', name: 'Dashboard' },
        { path: '/signals/feeds', name: 'Data Feeds' },
        { path: '/signals/sources', name: 'Sources' },
        { path: '/signals/alerts', name: 'Alerts' },
        { path: '/signals/anomalies', name: 'Anomalies' },
      ],
    },
    {
      id: 'crisis',
      name: 'Crisis Anticipation',
      icon: '⚠️',
      status: 'live',
      apis: 12,
      description: 'Early warning system',
      color: '#EF4444',
      routes: [
        { path: '/crisis', name: 'Dashboard' },
        { path: '/crisis/predictions', name: 'Predictions' },
        { path: '/crisis/scenarios', name: 'Scenarios' },
        { path: '/crisis/response', name: 'Response' },
        { path: '/crisis/resources', name: 'Resources' },
        { path: '/crisis/history', name: 'History' },
      ],
    },
  ],
  operational: [
    {
      id: 'procurement',
      name: 'Procurement Engine',
      icon: '📋',
      status: 'live',
      apis: 18,
      description: 'Tender & contract management',
      color: '#8B5CF6',
      routes: [
        { path: '/procurement', name: 'Dashboard' },
        { path: '/procurement/tenders', name: 'Tenders' },
        { path: '/procurement/contracts', name: 'Contracts' },
        { path: '/procurement/suppliers', name: 'Suppliers' },
        { path: '/procurement/bids', name: 'Bids' },
        { path: '/procurement/awards', name: 'Awards' },
      ],
    },
    {
      id: 'logistics',
      name: 'Logistics Engine',
      icon: '🚚',
      status: 'pilot',
      apis: 14,
      description: 'Supply chain & routing',
      color: '#F59E0B',
      routes: [
        { path: '/logistics', name: 'Dashboard' },
        { path: '/logistics/shipments', name: 'Shipments' },
        { path: '/logistics/inventory', name: 'Inventory' },
        { path: '/logistics/routes', name: 'Routes' },
        { path: '/logistics/warehouses', name: 'Warehouses' },
        { path: '/logistics/fleet', name: 'Fleet' },
      ],
    },
    {
      id: 'donors',
      name: 'Donor Dashboard',
      icon: '🤝',
      status: 'design',
      apis: 12,
      description: 'Funding transparency',
      color: '#EC4899',
      routes: [
        { path: '/donors', name: 'Dashboard' },
        { path: '/donors/contributions', name: 'Contributions' },
        { path: '/donors/projects', name: 'Projects' },
        { path: '/donors/impact', name: 'Impact' },
        { path: '/donors/reports', name: 'Reports' },
        { path: '/donors/iati', name: 'IATI' },
      ],
    },
    {
      id: 'data',
      name: 'Data Platform',
      icon: '🗄️',
      status: 'dev',
      apis: 10,
      description: 'Unified data lake',
      color: '#6366F1',
      routes: [
        { path: '/data', name: 'Dashboard' },
        { path: '/data/lake', name: 'Data Lake' },
        { path: '/data/documents', name: 'Documents' },
        { path: '/data/schemas', name: 'Schemas' },
        { path: '/data/quality', name: 'Quality' },
      ],
    },
  ],
  intelligence: [
    {
      id: 'sovereign',
      name: 'Sovereign Intelligence',
      icon: '🛡️',
      status: 'live',
      apis: 20,
      description: 'National decision support',
      color: '#14B8A6',
      routes: [
        { path: '/sovereign', name: 'Dashboard' },
        { path: '/sovereign/policies', name: 'Policies' },
        { path: '/sovereign/decisions', name: 'Decisions' },
        { path: '/sovereign/compliance', name: 'Compliance' },
        { path: '/sovereign/reports', name: 'Reports' },
      ],
    },
    {
      id: 'national',
      name: 'National Digital Twin',
      icon: '🌐',
      status: 'pilot',
      apis: 16,
      description: 'State replica',
      color: '#0EA5E9',
      routes: [
        { path: '/national', name: 'Dashboard' },
        { path: '/national/regions', name: 'Regions' },
        { path: '/national/sectors', name: 'Sectors' },
        { path: '/national/simulation', name: 'Simulation' },
        { path: '/national/forecasts', name: 'Forecasts' },
      ],
    },
    {
      id: 'ai-ops',
      name: 'AI Operations',
      icon: '🤖',
      status: 'beta',
      apis: 8,
      description: 'Autonomous governance',
      color: '#F472B6',
      routes: [
        { path: '/ai-ops', name: 'Dashboard' },
        { path: '/ai-ops/models', name: 'Models' },
        { path: '/ai-ops/predictions', name: 'Predictions' },
        { path: '/ai-ops/recommendations', name: 'Recommendations' },
        { path: '/ai-ops/automation', name: 'Automation' },
        { path: '/ai-ops/ethics', name: 'Ethics' },
        { path: '/ai-ops/audit', name: 'Audit' },
      ],
    },
    {
      id: 'protection',
      name: 'Protection from Delays',
      icon: '🛑',
      status: 'live',
      apis: 6,
      description: 'SLA enforcement',
      color: '#DC2626',
      routes: [
        { path: '/protection', name: 'Dashboard' },
        { path: '/protection/monitor', name: 'Monitor' },
        { path: '/protection/alerts', name: 'Alerts' },
        { path: '/protection/escalation', name: 'Escalation' },
      ],
    },
  ],
  support: [
    {
      id: 'ai',
      name: 'AI Administrator',
      icon: '💬',
      status: 'live',
      apis: 5,
      description: 'Ethical AI assistant',
      color: '#00A3FF',
      routes: [
        { path: '/ai', name: 'Chat' },
        { path: '/ai/assistant', name: 'Assistant' },
        { path: '/ai/insights', name: 'Insights' },
        { path: '/ai/history', name: 'History' },
      ],
    },
    {
      id: 'academy',
      name: 'HBS Academy',
      icon: '🎓',
      status: 'beta',
      apis: 8,
      description: 'Training platform',
      color: '#22C55E',
      routes: [
        { path: '/academy', name: 'Home' },
        { path: '/academy/courses', name: 'Courses' },
        { path: '/academy/certifications', name: 'Certifications' },
        { path: '/academy/progress', name: 'Progress' },
        { path: '/academy/webinars', name: 'Webinars' },
      ],
    },
    {
      id: 'ethical',
      name: 'Ethical Core v2.0',
      icon: '✅',
      status: 'live',
      apis: 4,
      description: 'Ethics validation',
      color: '#10B981',
      routes: [
        { path: '/ethical', name: 'Dashboard' },
        { path: '/ethical/validation', name: 'Validation' },
        { path: '/ethical/logs', name: 'Logs' },
      ],
    },
    {
      id: 'audit',
      name: 'Audit Layer',
      icon: '📝',
      status: 'live',
      apis: 10,
      description: 'Complete audit trail',
      color: '#64748B',
      routes: [
        { path: '/audit', name: 'Dashboard' },
        { path: '/audit/logs', name: 'Logs' },
        { path: '/audit/reports', name: 'Reports' },
        { path: '/audit/export', name: 'Export' },
      ],
    },
  ],
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  live: { bg: 'bg-[#3CCB7F]/15', text: 'text-[#3CCB7F]', label: 'Live' },
  pilot: { bg: 'bg-[#FFB84D]/15', text: 'text-[#FFB84D]', label: 'Pilot' },
  beta: { bg: 'bg-[#00A3FF]/15', text: 'text-[#00A3FF]', label: 'Beta' },
  dev: { bg: 'bg-[#A371F7]/15', text: 'text-[#A371F7]', label: 'Dev' },
  design: { bg: 'bg-[#8B949E]/15', text: 'text-[#8B949E]', label: 'Design' },
};

const CATEGORY_LABELS: Record<string, { name: string; icon: string }> = {
  core: { name: 'Core Modules', icon: '🏛️' },
  operational: { name: 'Operational Modules', icon: '⚙️' },
  intelligence: { name: 'Intelligence Modules', icon: '🧠' },
  support: { name: 'Support Modules', icon: '🛠️' },
};

// ============================================
// COMPONENT
// ============================================
export default function SiteMapPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const allModules = [
    ...MODULES.core,
    ...MODULES.operational,
    ...MODULES.intelligence,
    ...MODULES.support,
  ];

  const filteredModules = searchQuery
    ? allModules.filter(
        m =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.routes.some(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const totalRoutes = allModules.reduce((sum, m) => sum + m.routes.length, 0);
  const totalApis = allModules.reduce((sum, m) => sum + m.apis, 0);

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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[120px] pb-[40px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">Portal Architecture</span>
              <h1 className="text-3xl lg:text-4xl font-semibold mt-2">HBS Portal Site Map</h1>
              <p className="text-[#8B949E] mt-2">Complete module structure and navigation</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#00A3FF]/10 flex items-center justify-center text-[#00A3FF] font-bold rounded">
                    {allModules.length}
                  </span>
                  <span className="text-[#8B949E]">Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#3CCB7F]/10 flex items-center justify-center text-[#3CCB7F] font-bold rounded">
                    {totalRoutes}
                  </span>
                  <span className="text-[#8B949E]">Routes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#A371F7]/10 flex items-center justify-center text-[#A371F7] font-bold rounded">
                    {totalApis}
                  </span>
                  <span className="text-[#8B949E]">APIs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="pb-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7681]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search modules and routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-[#161B22] border border-[#1F242C] rounded-lg text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#00A3FF]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`h-11 px-4 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'bg-[#161B22] text-[#8B949E] border border-[#1F242C] hover:text-white'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`h-11 px-4 rounded-lg font-medium text-sm transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'bg-[#161B22] text-[#8B949E] border border-[#1F242C] hover:text-white'
                }`}
              >
                Tree View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {filteredModules && (
        <section className="pb-8">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
              <h3 className="text-sm font-medium text-[#8B949E] mb-4">
                Found {filteredModules.length} modules matching "{searchQuery}"
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{module.icon}</span>
                      <span className="font-medium">{module.name}</span>
                    </div>
                    <p className="text-sm text-[#8B949E] mb-3">{module.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {module.routes
                        .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((route) => (
                          <span key={route.path} className="text-xs bg-[#00A3FF]/10 text-[#00A3FF] px-2 py-0.5 rounded">
                            {route.name}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Module Categories */}
      {!filteredModules && (
        <section className="pb-[60px]">
          <div className="max-w-[1200px] mx-auto px-6">
            {viewMode === 'grid' ? (
              <div className="space-y-12">
                {Object.entries(MODULES).map(([category, modules]) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">{CATEGORY_LABELS[category].icon}</span>
                      <h2 className="text-xl font-semibold">{CATEGORY_LABELS[category].name}</h2>
                      <span className="text-sm text-[#6E7681]">({modules.length} modules)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {modules.map((module) => (
                        <div
                          key={module.id}
                          className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#3D444D] transition-colors"
                        >
                          <div
                            className="p-5 cursor-pointer"
                            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div
                                className="w-12 h-12 flex items-center justify-center text-2xl rounded-lg"
                                style={{ backgroundColor: `${module.color}20` }}
                              >
                                {module.icon}
                              </div>
                              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${STATUS_CONFIG[module.status].bg} ${STATUS_CONFIG[module.status].text}`}>
                                {STATUS_CONFIG[module.status].label}
                              </span>
                            </div>
                            <h3 className="font-semibold mb-1">{module.name}</h3>
                            <p className="text-sm text-[#8B949E] mb-3">{module.description}</p>
                            <div className="flex items-center justify-between text-xs text-[#6E7681]">
                              <span>{module.routes.length} routes</span>
                              <span>{module.apis} APIs</span>
                            </div>
                          </div>

                          {expandedModule === module.id && (
                            <div className="border-t border-[#1F242C] p-4 bg-[#0D1117]">
                              <div className="space-y-1">
                                {module.routes.map((route) => (
                                  <div
                                    key={route.path}
                                    className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#00A3FF] transition-colors py-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span>{route.name}</span>
                                    <span className="text-[10px] text-[#6E7681] ml-auto">{route.path}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Tree View */
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 font-mono text-sm">
                <div className="text-[#8B949E]">
                  <div className="text-[#00A3FF] font-bold mb-2">ivyar.org/</div>
                  {Object.entries(MODULES).map(([category, modules], ci) => (
                    <div key={category} className="ml-4">
                      <div className="flex items-center gap-2 text-[#E6EDF3] my-2">
                        <span>{CATEGORY_LABELS[category].icon}</span>
                        <span className="font-semibold">{CATEGORY_LABELS[category].name}</span>
                      </div>
                      {modules.map((module, mi) => (
                        <div key={module.id} className="ml-4">
                          <div
                            className="flex items-center gap-2 cursor-pointer hover:text-[#00A3FF] py-0.5"
                            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                          >
                            <span>{ci === Object.keys(MODULES).length - 1 && mi === modules.length - 1 ? '└──' : '├──'}</span>
                            <span>{module.icon}</span>
                            <span style={{ color: module.color }}>{module.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_CONFIG[module.status].bg} ${STATUS_CONFIG[module.status].text}`}>
                              {STATUS_CONFIG[module.status].label}
                            </span>
                          </div>
                          {expandedModule === module.id && (
                            <div className="ml-8">
                              {module.routes.map((route, ri) => (
                                <div key={route.path} className="text-[#6E7681] py-0.5">
                                  <span>{ri === module.routes.length - 1 ? '└──' : '├──'}</span>
                                  <span className="ml-2">{route.path}</span>
                                  <span className="text-[#8B949E] ml-2">({route.name})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Legend */}
      <section className="py-8 bg-[#161B22] border-t border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded ${config.bg}`} />
                <span className="text-[#8B949E]">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-8">
        <div className="max-w-[1200px] mx-auto px-6 text-center text-sm text-[#6E7681]">
          HBS v10.0 "Sovereign Intelligence" • {allModules.length} Modules • {totalRoutes} Routes • {totalApis} APIs
        </div>
      </footer>
    </div>
  );
}
