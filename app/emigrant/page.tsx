'use client';

import { useState } from 'react';
import Link from 'next/link';

type Region = 'usa' | 'canada' | 'europe';

const REGIONS = {
  usa: { flag: '🇺🇸', name: 'United States', nameUk: 'США', desc: 'Green Card, Work Visa', color: '#3B82F6' },
  canada: { flag: '🇨🇦', name: 'Canada', nameUk: 'Канада', desc: 'Express Entry, PNP', color: '#EF4444' },
  europe: { flag: '🇪🇺', name: 'European Union', nameUk: 'Європейський Союз', desc: 'Blue Card, Schengen', color: '#F59E0B' }
};

const CATEGORIES = [
  { icon: '📄', key: 'documents', name: 'Documents', nameUk: 'Документи' },
  { icon: '✅', key: 'checklist', name: 'Checklist', nameUk: 'Чекліст' },
  { icon: '💼', key: 'jobs', name: 'Jobs', nameUk: 'Робота' },
  { icon: '🏠', key: 'housing', name: 'Housing', nameUk: 'Житло' },
  { icon: '🏥', key: 'healthcare', name: 'Healthcare', nameUk: 'Медицина' },
  { icon: '🏦', key: 'banking', name: 'Banking', nameUk: 'Банки' },
  { icon: '📚', key: 'education', name: 'Education', nameUk: 'Освіта' },
  { icon: '⚖️', key: 'legal', name: 'Legal Help', nameUk: 'Юридична допомога' },
  { icon: '🤝', key: 'community', name: 'Community', nameUk: 'Спільнота' },
];

export default function EmigrantHub() {
  const [region, setRegion] = useState<Region | null>(null);
  const [lang, setLang] = useState<'en' | 'uk'>('uk');
  const t = (en: string, uk: string) => lang === 'en' ? en : uk;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">IV</div>
            <span className="font-semibold">IVYAR</span>
            <span className="text-[#00A3FF] ml-2">Emigrant Hub</span>
          </Link>
          <button onClick={() => setLang(lang === 'en' ? 'uk' : 'en')} className="px-3 py-1.5 bg-[#1F242C] rounded-lg text-sm">
            {lang === 'uk' ? '🇺🇸 EN' : '🇺🇦 UA'}
          </button>
        </div>
      </nav>

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A3FF]/10 border border-[#00A3FF]/30 rounded-full mb-6">
              <span className="text-2xl">🌍</span>
              <span className="text-[#00A3FF]">{t('Your Immigration Journey Simplified', 'Твій шлях еміграції спрощено')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">{t('Emigrant Hub', 'Хаб Емігранта')}</h1>
            <p className="text-lg text-[#8B949E]">
              {t('Everything you need to start a new life abroad.', 'Все для нового життя за кордоном.')}
            </p>
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">{t('Choose Destination', 'Обери напрямок')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {(Object.keys(REGIONS) as Region[]).map((key) => (
              <button key={key} onClick={() => setRegion(key)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${region === key ? 'border-[#00A3FF] bg-[#00A3FF]/10' : 'border-[#1F242C] bg-[#161B22] hover:border-[#3D444D]'}`}>
                <span className="text-4xl">{REGIONS[key].flag}</span>
                <h3 className="font-semibold mt-2">{t(REGIONS[key].name, REGIONS[key].nameUk)}</h3>
                <p className="text-sm text-[#8B949E]">{REGIONS[key].desc}</p>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">{t('What do you need?', 'Що тобі потрібно?')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.key} href={`/emigrant/${cat.key}${region ? `?region=${region}` : ''}`}
                className="group p-5 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00A3FF]/10 rounded-lg flex items-center justify-center text-2xl">{cat.icon}</div>
                <span className="font-semibold group-hover:text-[#00A3FF]">{t(cat.name, cat.nameUk)}</span>
                <span className="ml-auto text-[#8B949E] group-hover:text-[#00A3FF]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-[#1F242C]">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved.
        </div>
      </footer>
    </div>
  );
}