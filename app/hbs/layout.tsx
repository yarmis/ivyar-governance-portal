import Link from 'next/link';
import LanguageSwitcher from '@/components/hbs/LanguageSwitcher';

export default function HBSLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Overview', href: '/hbs' },
    { name: 'Whitepaper', href: '/hbs/whitepaper' },
    { name: 'Governance', href: '/hbs/governance' },
    { name: 'Decision Tree', href: '/hbs/governance/tree' },
    { name: 'Boundaries', href: '/hbs/governance/boundaries' },
    { name: 'AI Advisor', href: '/hbs/ai' },
    { name: 'Smart Suite', href: '/hbs/smart' },
    { name: 'Analytics', href: '/hbs/analytics' },
    { name: 'Engine', href: '/hbs/engine' },
    { name: 'Signals', href: '/hbs/signals' },
    { name: 'Integration', href: '/hbs/integration' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-red-700 via-orange-600 to-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-orange-200 hover:text-white transition-colors">
              ← Back to IVYAR
            </Link>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-4xl">🧠</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HBS Governance Engine</h1>
                <p className="text-orange-200">Humanitarian Budget Support v2.1</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">AI</span>
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">LIVE</span>
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">6 LANGS</span>
              <span className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">ANALYTICS</span>
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">ENGINE</span>
              <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">SIGNALS</span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">v2.1</span>
            </div>
          </div>
          <nav className="flex gap-4 mt-4 flex-wrap">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-orange-100 hover:text-white font-medium pb-2 border-b-2 border-transparent hover:border-white transition-all text-sm">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
        <p>HBS v2.1 — Autonomous Governance Signals — Central Brain for IVYAR Platform — © 2026</p>
      </footer>
    </div>
  );
}