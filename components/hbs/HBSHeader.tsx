'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function HBSHeader() {
  const { t } = useLanguage();

  const navItems = [
    { name: t('nav.overview'), href: '/hbs' },
    { name: t('nav.governance'), href: '/hbs/governance' },
    { name: t('nav.smartSuite'), href: '/hbs/smart' },
    { name: t('nav.analytics'), href: '/hbs/analytics' },
    { name: t('nav.engine'), href: '/hbs/engine' },
    { name: t('nav.signals'), href: '/hbs/signals' },
    { name: t('nav.institutional'), href: '/hbs/institutional' },
    { name: t('nav.interoperability'), href: '/hbs/interoperability' },
    { name: 'National', href: '/hbs/national' },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-700 via-blue-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-emerald-200 hover:text-white transition-colors">
            {t('header.backToIvyar')}
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl">🏛️</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">HBS National Cloud</h1>
              <p className="text-emerald-200">{t('header.subtitle')} v4.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">AI</span>
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">MULTI-COUNTRY</span>
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">SOVEREIGN</span>
            <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">AUDIT</span>
            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">MINISTRIES</span>
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">v4.0</span>
          </div>
        </div>
        <nav className="flex gap-4 mt-4 flex-wrap">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-emerald-100 hover:text-white font-medium pb-2 border-b-2 border-transparent hover:border-white transition-all text-sm">
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}