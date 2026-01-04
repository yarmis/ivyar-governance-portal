import Link from 'next/link';
import LanguageSwitcher from '@/components/hbs/LanguageSwitcher';

export default function HBSLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Overview', href: '/hbs' },
    { name: 'Whitepaper', href: '/hbs/whitepaper' },
    { name: 'Governance', href: '/hbs/governance' },
    { name: 'Decision Tree', href: '/hbs/governance/tree' },
    { name: 'Boundaries', href: '/hbs/governance/boundaries' },
    { name: 'Reasoning', href: '/hbs/reasoning' },
    { name: 'AI Advisor', href: '/hbs/ai' },
    { name: 'AI Docs', href: '/hbs/docs' },
    { name: 'Smart Suite', href: '/hbs/smart' },
    { name: 'Education', href: '/hbs/education' },
    { name: 'Integration', href: '/hbs/integration' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-blue-200 hover:text-white transition-colors">
              ← Back to IVYAR
            </Link>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold text-white">HBS Module</h1>
              <p className="text-blue-200">Humanitarian Budget Support v1.5</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">AI</span>
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">LIVE</span>
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">6 LANGS</span>
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">SMART</span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">v1.5</span>
            </div>
          </div>
          <nav className="flex gap-4 mt-4 flex-wrap">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-blue-100 hover:text-white font-medium pb-2 border-b-2 border-transparent hover:border-white transition-all text-sm">
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
        <p>HBS Module v1.5 — AI-Powered Smart Governance Suite — © 2026 IVYAR Platform</p>
      </footer>
    </div>
  );
}