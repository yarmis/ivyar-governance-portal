'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HBSHeader() {
  const { t } = useLanguage();

  const navItems = [
    { name: 'Command', href: '/hbs' },
    { name: t('nav.governance'), href: '/hbs/governance' },
    { name: t('nav.engine'), href: '/hbs/engine' },
    { name: t('nav.signals'), href: '/hbs/signals' },
    { name: t('nav.analytics'), href: '/hbs/analytics' },
    { name: 'National', href: '/hbs/national' },
    { name: 'Sovereign', href: '/hbs/sovereign' },
    { name: 'AI Ops', href: '/hbs/ai' },
    { name: 'Whitepaper', href: '/hbs/whitepaper' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-indigo-200 hover:text-white transition-colors">
            {t('header.backToIvyar')}
          </Link>
          
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl">🏛️</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">HBS Sovereign Cloud</h1>
              <p className="text-indigo-200">{t('header.subtitle')} v5.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">AI</span>
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">SOVEREIGN</span>
            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">FEDERATED</span>
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">DEPLOY KIT</span>
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">v5.0</span>
          </div>
        </div>
        <nav className="flex gap-4 mt-4 flex-wrap">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-indigo-100 hover:text-white font-medium pb-2 border-b-2 border-transparent hover:border-white transition-all text-sm">
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
