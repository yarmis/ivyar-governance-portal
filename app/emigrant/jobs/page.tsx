'use client';

import { useState } from 'react';
import Link from 'next/link';

type Region = 'usa' | 'canada' | 'europe';

const JOB_SITES: Record<Region, { name: string; url: string; desc: string; descUk: string }[]> = {
  usa: [
    { name: 'LinkedIn', url: 'https://linkedin.com/jobs', desc: 'Professional network & jobs', descUk: 'Професійна мережа та вакансії' },
    { name: 'Indeed', url: 'https://indeed.com', desc: 'Largest job board', descUk: 'Найбільша база вакансій' },
    { name: 'Glassdoor', url: 'https://glassdoor.com', desc: 'Jobs + company reviews', descUk: 'Вакансії + відгуки про компанії' },
    { name: 'ZipRecruiter', url: 'https://ziprecruiter.com', desc: 'AI-powered job matching', descUk: 'AI-підбір вакансій' },
    { name: 'USAJOBS', url: 'https://usajobs.gov', desc: 'Federal government jobs', descUk: 'Робота в уряді США' },
    { name: 'AngelList', url: 'https://wellfound.com', desc: 'Startup jobs', descUk: 'Робота в стартапах' },
  ],
  canada: [
    { name: 'Job Bank', url: 'https://jobbank.gc.ca', desc: 'Official government job board', descUk: 'Офіційна урядова база вакансій' },
    { name: 'LinkedIn', url: 'https://linkedin.com/jobs', desc: 'Professional network', descUk: 'Професійна мережа' },
    { name: 'Indeed Canada', url: 'https://ca.indeed.com', desc: 'Popular job board', descUk: 'Популярна база вакансій' },
    { name: 'Workopolis', url: 'https://workopolis.com', desc: 'Canadian job site', descUk: 'Канадський сайт вакансій' },
    { name: 'Glassdoor', url: 'https://glassdoor.ca', desc: 'Jobs + reviews', descUk: 'Вакансії + відгуки' },
    { name: 'Monster Canada', url: 'https://monster.ca', desc: 'International job board', descUk: 'Міжнародна база вакансій' },
  ],
  europe: [
    { name: 'LinkedIn', url: 'https://linkedin.com/jobs', desc: 'Professional network', descUk: 'Професійна мережа' },
    { name: 'EURES', url: 'https://eures.europa.eu', desc: 'EU job mobility portal', descUk: 'Портал мобільності ЄС' },
    { name: 'Indeed EU', url: 'https://indeed.com', desc: 'Jobs across Europe', descUk: 'Вакансії по Європі' },
    { name: 'StepStone', url: 'https://stepstone.de', desc: 'Germany, Austria, Belgium', descUk: 'Німеччина, Австрія, Бельгія' },
    { name: 'Glassdoor', url: 'https://glassdoor.com', desc: 'Jobs + company info', descUk: 'Вакансії + інфо про компанії' },
    { name: 'Relocate.me', url: 'https://relocate.me', desc: 'Jobs with relocation', descUk: 'Вакансії з релокацією' },
  ]
};

const TIPS = [
  { icon: '📝', title: 'Resume/CV', titleUk: 'Резюме', desc: 'Adapt format for each country', descUk: 'Адаптуй формат під країну' },
  { icon: '💼', title: 'LinkedIn', titleUk: 'LinkedIn', desc: 'Complete profile, add "Open to Work"', descUk: 'Заповни профіль, додай "Open to Work"' },
  { icon: '🎯', title: 'Keywords', titleUk: 'Ключові слова', desc: 'Match job description terms', descUk: 'Використовуй слова з опису вакансії' },
  { icon: '🤝', title: 'Networking', titleUk: 'Нетворкінг', desc: 'Connect with people in your field', descUk: 'Знайомся з людьми у своїй галузі' },
  { icon: '📧', title: 'Follow Up', titleUk: 'Фоловап', desc: 'Send thank you emails after interviews', descUk: 'Надсилай листи подяки після співбесід' },
  { icon: '🌐', title: 'Work Permit', titleUk: 'Дозвіл на роботу', desc: 'Check visa requirements first', descUk: 'Спочатку перевір вимоги візи' },
];

export default function JobsPage() {
  const [region, setRegion] = useState<Region>('usa');
  const [lang, setLang] = useState<'en' | 'uk'>('uk');
  const t = (en: string, uk: string) => lang === 'en' ? en : uk;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/emigrant" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">IV</div>
              <span className="font-semibold">IVYAR</span>
            </Link>
            <span className="text-[#8B949E]">/</span>
            <span className="text-[#00A3FF]">💼 {t('Jobs', 'Робота')}</span>
          </div>
          <button onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')} className="px-3 py-1.5 bg-[#1F242C] rounded-lg text-sm">
            {lang === 'uk' ? '🇺🇸 EN' : '🇺🇦 UA'}
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('Find a Job Abroad', 'Знайди роботу за кордоном')}</h1>
          <p className="text-[#8B949E] mb-6">{t('Best job sites and tips for emigrants', 'Найкращі сайти вакансій та поради для емігрантів')}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {(['usa', 'canada', 'europe'] as Region[]).map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${region === r ? 'bg-[#00A3FF] text-[#0D1117]' : 'bg-[#1F242C] hover:bg-[#2D333B]'}`}>
                {r === 'usa' ? '🇺🇸 США' : r === 'canada' ? '🇨🇦 Канада' : '🇪🇺 ЄС'}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Top Job Sites', 'Топ сайтів вакансій')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {JOB_SITES[region].map((site) => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-all group">
                <h3 className="font-semibold mb-1 group-hover:text-[#00A3FF]">{site.name}</h3>
                <p className="text-sm text-[#8B949E] mb-3">{t(site.desc, site.descUk)}</p>
                <span className="text-xs text-[#00A3FF]">{t('Visit site', 'Перейти')} →</span>
              </a>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Job Search Tips', 'Поради для пошуку роботи')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map((tip) => (
              <div key={tip.title} className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="text-2xl mb-2">{tip.icon}</div>
                <h3 className="font-semibold mb-1">{t(tip.title, tip.titleUk)}</h3>
                <p className="text-sm text-[#8B949E]">{t(tip.desc, tip.descUk)}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}