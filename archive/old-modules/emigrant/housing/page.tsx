'use client';

import { useState } from 'react';
import Link from 'next/link';

type Region = 'usa' | 'canada' | 'europe';

const HOUSING_SITES: Record<Region, { name: string; url: string; desc: string; descUk: string; type: string }[]> = {
  usa: [
    { name: 'Zillow', url: 'https://zillow.com', desc: 'Rent & buy homes', descUk: 'Оренда та купівля житла', type: 'rent/buy' },
    { name: 'Apartments.com', url: 'https://apartments.com', desc: 'Apartment rentals', descUk: 'Оренда квартир', type: 'rent' },
    { name: 'Craigslist', url: 'https://craigslist.org', desc: 'Local listings, rooms', descUk: 'Локальні оголошення, кімнати', type: 'rent' },
    { name: 'Facebook Marketplace', url: 'https://facebook.com/marketplace', desc: 'Community listings', descUk: 'Оголошення спільноти', type: 'rent' },
    { name: 'Trulia', url: 'https://trulia.com', desc: 'Homes & neighborhoods', descUk: 'Житло та райони', type: 'rent/buy' },
    { name: 'Airbnb', url: 'https://airbnb.com', desc: 'Temporary stays', descUk: 'Тимчасове житло', type: 'temp' },
  ],
  canada: [
    { name: 'Realtor.ca', url: 'https://realtor.ca', desc: 'Official MLS listings', descUk: 'Офіційні MLS оголошення', type: 'rent/buy' },
    { name: 'Rentals.ca', url: 'https://rentals.ca', desc: 'Apartment rentals', descUk: 'Оренда квартир', type: 'rent' },
    { name: 'Kijiji', url: 'https://kijiji.ca', desc: 'Local classifieds', descUk: 'Локальні оголошення', type: 'rent' },
    { name: 'PadMapper', url: 'https://padmapper.com', desc: 'Map-based search', descUk: 'Пошук на карті', type: 'rent' },
    { name: 'Facebook Marketplace', url: 'https://facebook.com/marketplace', desc: 'Community listings', descUk: 'Оголошення спільноти', type: 'rent' },
    { name: 'Airbnb', url: 'https://airbnb.com', desc: 'Temporary stays', descUk: 'Тимчасове житло', type: 'temp' },
  ],
  europe: [
    { name: 'Immobilienscout24', url: 'https://immobilienscout24.de', desc: 'Germany housing', descUk: 'Житло в Німеччині', type: 'rent/buy' },
    { name: 'Idealista', url: 'https://idealista.com', desc: 'Spain, Italy, Portugal', descUk: 'Іспанія, Італія, Португалія', type: 'rent/buy' },
    { name: 'Funda', url: 'https://funda.nl', desc: 'Netherlands', descUk: 'Нідерланди', type: 'rent/buy' },
    { name: 'Rightmove', url: 'https://rightmove.co.uk', desc: 'UK housing', descUk: 'Житло у Великобританії', type: 'rent/buy' },
    { name: 'OLX', url: 'https://olx.pl', desc: 'Poland, Eastern Europe', descUk: 'Польща, Східна Європа', type: 'rent' },
    { name: 'HousingAnywhere', url: 'https://housinganywhere.com', desc: 'Student & expat housing', descUk: 'Житло для студентів та експатів', type: 'rent' },
  ]
};

const TIPS = [
  { icon: '📍', title: 'Location', titleUk: 'Локація', desc: 'Check commute time & safety', descUk: 'Перевір час дороги та безпеку' },
  { icon: '💰', title: 'Budget', titleUk: 'Бюджет', desc: 'Rent should be <30% of income', descUk: 'Оренда має бути <30% доходу' },
  { icon: '📄', title: 'Documents', titleUk: 'Документи', desc: 'ID, proof of income, references', descUk: 'ID, підтвердження доходу, рекомендації' },
  { icon: '🔍', title: 'Scams', titleUk: 'Шахрайство', desc: 'Never pay before viewing', descUk: 'Ніколи не плати до перегляду' },
  { icon: '📝', title: 'Lease', titleUk: 'Договір', desc: 'Read carefully before signing', descUk: 'Читай уважно перед підписанням' },
  { icon: '🏠', title: 'Temporary First', titleUk: 'Спочатку тимчасове', desc: 'Airbnb while searching', descUk: 'Airbnb поки шукаєш постійне' },
];

const COSTS: Record<Region, { city: string; rent: string }[]> = {
  usa: [
    { city: 'New York', rent: '$2,500-4,000' },
    { city: 'San Francisco', rent: '$2,800-4,500' },
    { city: 'Los Angeles', rent: '$2,000-3,500' },
    { city: 'Chicago', rent: '$1,500-2,500' },
    { city: 'Austin', rent: '$1,400-2,200' },
    { city: 'Miami', rent: '$1,800-3,000' },
  ],
  canada: [
    { city: 'Toronto', rent: 'C$2,200-3,500' },
    { city: 'Vancouver', rent: 'C$2,400-3,800' },
    { city: 'Montreal', rent: 'C$1,400-2,200' },
    { city: 'Calgary', rent: 'C$1,500-2,300' },
    { city: 'Ottawa', rent: 'C$1,600-2,400' },
    { city: 'Edmonton', rent: 'C$1,200-1,800' },
  ],
  europe: [
    { city: 'London', rent: '£1,800-3,000' },
    { city: 'Berlin', rent: '€1,200-2,000' },
    { city: 'Amsterdam', rent: '€1,600-2,500' },
    { city: 'Paris', rent: '€1,500-2,500' },
    { city: 'Warsaw', rent: '€600-1,000' },
    { city: 'Lisbon', rent: '€1,000-1,800' },
  ]
};

export default function HousingPage() {
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
            <span className="text-[#00A3FF]">🏠 {t('Housing', 'Житло')}</span>
          </div>
          <button onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')} className="px-3 py-1.5 bg-[#1F242C] rounded-lg text-sm">
            {lang === 'uk' ? '🇺🇸 EN' : '🇺🇦 UA'}
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('Find Housing', 'Знайди житло')}</h1>
          <p className="text-[#8B949E] mb-6">{t('Rent or buy a home in your new country', 'Орендуй або купи житло в новій країні')}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {(['usa', 'canada', 'europe'] as Region[]).map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${region === r ? 'bg-[#00A3FF] text-[#0D1117]' : 'bg-[#1F242C] hover:bg-[#2D333B]'}`}>
                {r === 'usa' ? '🇺🇸 США' : r === 'canada' ? '🇨🇦 Канада' : '🇪🇺 ЄС'}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Housing Websites', 'Сайти пошуку житла')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {HOUSING_SITES[region].map((site) => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"
                className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-[#00A3FF]">{site.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${site.type === 'temp' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[#00A3FF]/20 text-[#00A3FF]'}`}>
                    {site.type === 'temp' ? t('Temporary', 'Тимчасове') : site.type === 'rent' ? t('Rent', 'Оренда') : t('Rent/Buy', 'Оренда/Купівля')}
                  </span>
                </div>
                <p className="text-sm text-[#8B949E] mb-3">{t(site.desc, site.descUk)}</p>
                <span className="text-xs text-[#00A3FF]">{t('Visit site', 'Перейти')} →</span>
              </a>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Average Rent (1BR)', 'Середня оренда (1 кімн.)')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {COSTS[region].map((item) => (
              <div key={item.city} className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl text-center">
                <div className="font-semibold text-[#00A3FF] mb-1">{item.rent}</div>
                <div className="text-sm text-[#8B949E]">{item.city}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Housing Tips', 'Поради щодо житла')}</h2>
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