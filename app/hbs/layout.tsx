'use client';

import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/hbs/LanguageSwitcher';

function HBSLayoutContent({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();

  const navItems = [
    { key: 'nav.overview', href: '/hbs' },
    { key: 'nav.governance', href: '/hbs/governance' },
    { key: 'nav.decisionTree', href: '/hbs/governance/tree' },
    { key: 'nav.aiAdvisor', href: '/hbs/ai' },
    { key: 'nav.smartSuite', href: '/hbs/smart' },
    { key: 'nav.analytics', href: '/hbs/analytics' },
    { key: 'nav.engine', href: '/hbs/engine' },
    { key: 'nav.signals', href: '/hbs/signals' },
    { key: 'nav.institutional', href: '/hbs/institutional' },
    { key: 'nav.interoperability', href: '/hbs/interoperability' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-700 via-green-600 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-blue-200 hover:text-white transition-colors">
              {t('header.backToIvyar')}
            </Link>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-4xl">🌍</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{t('header.title')}</h1>
                <p className="text-blue-200">{t('header.subtitle')} v3.1</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">AI</span>
              <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">LIVE</span>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">OpenAPI</span>
              <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">EU</span>
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">USAID</span>
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">UN</span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">v3.1</span>
            </div>
          </div>
          <nav className="flex gap-4 mt-4 flex-wrap">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-blue-100 hover:text-white font-medium pb-2 border-b-2 border-transparent hover:border-white transition-all text-sm">
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
        <p>HBS v3.1 — {t('footer.text')} — OpenAPI | EU | USAID | UN OCHA — © 2026 IVYAR</p>
      </footer>
    </div>
  );
}

export default function HBSLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <HBSLayoutContent>{children}</HBSLayoutContent>
    </LanguageProvider>
  );
}