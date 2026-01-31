'use client';

import { useState } from 'react';
import Link from 'next/link';

type Region = 'usa' | 'canada' | 'europe';

const BANKS: Record<Region, { name: string; url: string; desc: string; descUk: string; type: 'traditional' | 'online' | 'neo' }[]> = {
  usa: [
    { name: 'Chase', url: 'https://chase.com', desc: 'Largest US bank, easy for newcomers', descUk: 'Найбільший банк США, легко для новачків', type: 'traditional' },
    { name: 'Bank of America', url: 'https://bankofamerica.com', desc: 'Wide branch network', descUk: 'Широка мережа відділень', type: 'traditional' },
    { name: 'Wells Fargo', url: 'https://wellsfargo.com', desc: 'Popular for immigrants', descUk: 'Популярний серед іммігрантів', type: 'traditional' },
    { name: 'Chime', url: 'https://chime.com', desc: 'No-fee online bank', descUk: 'Онлайн банк без комісій', type: 'neo' },
    { name: 'Mercury', url: 'https://mercury.com', desc: 'For startups & freelancers', descUk: 'Для стартапів та фрілансерів', type: 'online' },
    { name: 'Wise', url: 'https://wise.com', desc: 'Multi-currency account', descUk: 'Мультивалютний рахунок', type: 'neo' },
  ],
  canada: [
    { name: 'TD Bank', url: 'https://td.com', desc: 'Newcomer banking packages', descUk: 'Пакети для новоприбулих', type: 'traditional' },
    { name: 'RBC', url: 'https://rbc.com', desc: 'Largest Canadian bank', descUk: 'Найбільший канадський банк', type: 'traditional' },
    { name: 'Scotiabank', url: 'https://scotiabank.com', desc: 'StartRight program for newcomers', descUk: 'Програма StartRight для новачків', type: 'traditional' },
    { name: 'BMO', url: 'https://bmo.com', desc: 'NewStart program', descUk: 'Програма NewStart', type: 'traditional' },
    { name: 'Simplii', url: 'https://simplii.com', desc: 'No-fee digital bank', descUk: 'Цифровий банк без комісій', type: 'online' },
    { name: 'Wise', url: 'https://wise.com', desc: 'Multi-currency transfers', descUk: 'Мультивалютні перекази', type: 'neo' },
  ],
  europe: [
    { name: 'N26', url: 'https://n26.com', desc: 'Digital bank, no address needed', descUk: 'Цифровий банк, адреса не потрібна', type: 'neo' },
    { name: 'Revolut', url: 'https://revolut.com', desc: 'Multi-currency, crypto, investing', descUk: 'Мультивалюта, крипто, інвестиції', type: 'neo' },
    { name: 'Wise', url: 'https://wise.com', desc: 'Best for transfers', descUk: 'Найкращий для переказів', type: 'neo' },
    { name: 'Bunq', url: 'https://bunq.com', desc: 'EU bank, eco-friendly', descUk: 'ЄС банк, еко-френдлі', type: 'neo' },
    { name: 'Deutsche Bank', url: 'https://deutsche-bank.de', desc: 'Germany traditional bank', descUk: 'Німецький традиційний банк', type: 'traditional' },
    { name: 'ING', url: 'https://ing.com', desc: 'Netherlands, Germany, Spain', descUk: 'Нідерланди, Німеччина, Іспанія', type: 'traditional' },
  ]
};

const REQUIREMENTS: Record<Region, { doc: string; docUk: string; required: boolean }[]> = {
  usa: [
    { doc: 'Passport', docUk: 'Паспорт', required: true },
    { doc: 'SSN or ITIN', docUk: 'SSN або ITIN', required: true },
    { doc: 'Proof of Address', docUk: 'Підтвердження адреси', required: true },
    { doc: 'Visa / I-94', docUk: 'Віза / I-94', required: true },
    { doc: 'Initial Deposit', docUk: 'Початковий депозит', required: false },
  ],
  canada: [
    { doc: 'Passport', docUk: 'Паспорт', required: true },
    { doc: 'SIN (can open without)', docUk: 'SIN (можна без нього)', required: false },
    { doc: 'Proof of Address', docUk: 'Підтвердження адреси', required: true },
    { doc: 'Work/Study Permit or PR', docUk: 'Дозвіл на роботу/навчання або PR', required: true },
    { doc: 'Reference Letter', docUk: 'Рекомендаційний лист', required: false },
  ],
  europe: [
    { doc: 'Passport / EU ID', docUk: 'Паспорт / ID ЄС', required: true },
    { doc: 'Proof of Address', docUk: 'Підтвердження адреси', required: true },
    { doc: 'Tax ID', docUk: 'Податковий номер', required: false },
    { doc: 'Residence Permit', docUk: 'Дозвіл на проживання', required: true },
    { doc: 'Employment Contract', docUk: 'Трудовий договір', required: false },
  ]
};

const TIPS = [
  { icon: '🏦', title: 'Open Early', titleUk: 'Відкрий рано', desc: 'Open account within first weeks', descUk: 'Відкрий рахунок у перші тижні' },
  { icon: '💳', title: 'Build Credit', titleUk: 'Будуй кредит', desc: 'Get secured credit card first', descUk: 'Спочатку візьми забезпечену картку' },
  { icon: '📱', title: 'Mobile Banking', titleUk: 'Мобільний банкінг', desc: 'Download bank app immediately', descUk: 'Завантаж додаток відразу' },
  { icon: '💸', title: 'Transfers', titleUk: 'Перекази', desc: 'Use Wise for international transfers', descUk: 'Використовуй Wise для міжнародних переказів' },
  { icon: '🔐', title: 'Security', titleUk: 'Безпека', desc: 'Enable 2FA, monitor transactions', descUk: 'Увімкни 2FA, слідкуй за транзакціями' },
  { icon: '📊', title: 'Credit Score', titleUk: 'Кредитний рейтинг', desc: 'Check score regularly (Credit Karma)', descUk: 'Перевіряй рейтинг регулярно (Credit Karma)' },
];

export default function BankingPage() {
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
            <span className="text-[#00A3FF]">🏦 {t('Banking', 'Банки')}</span>
          </div>
          <button onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')} className="px-3 py-1.5 bg-[#1F242C] rounded-lg text-sm">
            {lang === 'uk' ? '🇺🇸 EN' : '🇺🇦 UA'}
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('Open a Bank Account', 'Відкрий банківський рахунок')}</h1>
          <p className="text-[#8B949E] mb-6">{t('Banks, requirements, and tips for newcomers', 'Банки, вимоги та поради для новоприбулих')}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {(['usa', 'canada', 'europe'] as Region[]).map((r) => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${region === r ? 'bg-[#00A3FF] text-[#0D1117]' : 'bg-[#1F242C] hover:bg-[#2D333B]'}`}>
                {r === 'usa' ? '🇺🇸 США' : r === 'canada' ? '🇨🇦 Канада' : '🇪🇺 ЄС'}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Recommended Banks', 'Рекомендовані банки')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {BANKS[region].map((bank) => (
              <a key={bank.name} href={bank.url} target="_blank" rel="noopener noreferrer"
                className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-[#00A3FF]">{bank.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    bank.type === 'neo' ? 'bg-purple-500/20 text-purple-400' : 
                    bank.type === 'online' ? 'bg-green-500/20 text-green-400' : 
                    'bg-[#00A3FF]/20 text-[#00A3FF]'
                  }`}>
                    {bank.type === 'neo' ? 'Neobank' : bank.type === 'online' ? 'Online' : t('Traditional', 'Традиційний')}
                  </span>
                </div>
                <p className="text-sm text-[#8B949E] mb-3">{t(bank.desc, bank.descUk)}</p>
                <span className="text-xs text-[#00A3FF]">{t('Open account', 'Відкрити рахунок')} →</span>
              </a>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Required Documents', 'Необхідні документи')}</h2>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REQUIREMENTS[region].map((req) => (
                <div key={req.doc} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${req.required ? 'bg-[#00A3FF]/20 text-[#00A3FF]' : 'bg-[#1F242C] text-[#8B949E]'}`}>
                    {req.required ? '✓' : '○'}
                  </span>
                  <span className={req.required ? 'font-medium' : 'text-[#8B949E]'}>
                    {t(req.doc, req.docUk)}
                  </span>
                  {req.required && <span className="text-xs text-[#00A3FF]">{t('Required', 'Обов\'язково')}</span>}
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('Banking Tips', 'Поради щодо банків')}</h2>
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