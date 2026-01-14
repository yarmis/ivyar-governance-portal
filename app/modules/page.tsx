'use client';

import Link from 'next/link';

const MODULES = [
  { icon: '📋', name: 'Procurement Engine', href: '/modules/procurement', status: 'live' },
  { icon: '🚚', name: 'Logistics Engine', href: '/modules/logistics', status: 'live' },
  { icon: '🤝', name: 'Donor Dashboard', href: '/modules/donor-dashboard', status: 'live' },
  { icon: '🗄️', name: 'Data Platform', href: '/modules/data-platform', status: 'live' },
  { icon: '🏛️', name: 'HBS Module', href: '/us/hbs', status: 'live' },
  { icon: '🤖', name: 'AI Services', href: '/modules/ai-services', status: 'live' },
  { icon: '🏪', name: 'Trade Module', href: '/modules/trade', status: 'live' },
  { icon: '🛡️', name: 'Insurance Module', href: '/modules/insurance', status: 'live' },
  { icon: '💳', name: 'Payments Module', href: '/modules/payments', status: 'live' },
  { icon: '🏗️', name: 'Reconstruction Module', href: '/modules/reconstruction', status: 'live' },
  { icon: '🚛', name: 'Direct Freight', href: '/modules/freight', status: 'live' },
  { icon: '👁️', name: 'Transparency Hub', href: '/modules/transparency', status: 'live', badge: 'CIVIC CORE' },
  { icon: '💬', name: 'Citizen Feedback', href: '/modules/feedback', status: 'live', badge: 'CIVIC CORE' },
  { icon: '📚', name: 'Knowledge Base', href: '/modules/knowledge', status: 'live', badge: 'CIVIC CORE' },
  { icon: '🤖', name: 'AI Integrity Monitor', href: '/modules/ai-monitor', status: 'beta', badge: 'CIVIC CORE' },
];

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="border-b border-[#1F242C] bg-[#161B22] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#E6EDF3]">
            🏛️ IVYAR
          </Link>
          <nav className="flex gap-6">
            <Link href="/us" className="text-sm text-[#8B949E] hover:text-[#E6EDF3]">
              Home
            </Link>
            <Link href="/modules" className="text-sm text-[#00A3FF]">
              Modules
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#1F242C] bg-gradient-to-b from-[#161B22] to-[#0D1117] px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-4 text-5xl font-bold text-[#E6EDF3]">
            🌍 Global Module Catalog
          </h1>
          <p className="text-xl text-[#8B949E]">
            15 production-ready modules for institutional governance
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#6E7681]">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              11 Core Modules
            </span>
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              4 Civic Core Modules
            </span>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group relative overflow-hidden rounded-lg border border-[#30363D] bg-[#161B22] p-6 transition-all hover:border-[#00A3FF] hover:shadow-lg hover:shadow-[#00A3FF]/20"
              >
                {/* Badge */}
                {module.badge && (
                  <div className="absolute right-4 top-4 rounded bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400">
                    {module.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4 text-4xl">{module.icon}</div>

                {/* Name */}
                <h3 className="mb-2 text-lg font-semibold text-[#E6EDF3] group-hover:text-[#00A3FF]">
                  {module.name}
                </h3>

                {/* Status */}
                <div className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${
                    module.status === 'live' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-[#8B949E] uppercase">
                    {module.status}
                  </span>
                </div>

                {/* Arrow */}
                <div className="mt-4 text-[#00A3FF] opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F242C] bg-[#161B22] px-6 py-8 mt-16">
        <div className="mx-auto max-w-7xl text-center text-sm text-[#6E7681]">
          🇺🇸 Built in the United States • 💙💛 Inspired by Ukraine • 🌍 Designed for the world
        </div>
      </footer>
    </div>
  );
}
