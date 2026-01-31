'use client';

import { useState } from 'react';
import Link from 'next/link';

type Region = 'usa' | 'canada' | 'europe';

const CHECKLISTS: Record<Region, { title: string; titleUk: string; steps: { id: string; title: string; titleUk: string; desc: string; descUk: string; docs: string[]; docsUk: string[]; timeline: string; }[] }> = {
  usa: {
    title: 'USA Immigration Checklist',
    titleUk: 'Чекліст еміграції до США',
    steps: [
      { id: '1', title: 'Get Valid Passport', titleUk: 'Отримай закордонний паспорт', desc: 'Ensure passport is valid for 6+ months', descUk: 'Паспорт має бути дійсним 6+ місяців', docs: ['Passport', 'Birth Certificate'], docsUk: ['Паспорт', 'Свідоцтво про народження'], timeline: '2-4 weeks' },
      { id: '2', title: 'Determine Visa Type', titleUk: 'Визнач тип візи', desc: 'Work (H1B), Student (F1), Tourist (B1/B2), Green Card', descUk: 'Робоча (H1B), Студентська (F1), Туристична (B1/B2), Грін Карта', docs: ['Job Offer', 'I-20 Form'], docsUk: ['Пропозиція роботи', 'Форма I-20'], timeline: '1-2 weeks' },
      { id: '3', title: 'Complete DS-160', titleUk: 'Заповни DS-160', desc: 'Online visa application form', descUk: 'Онлайн форма заявки на візу', docs: ['Photo', 'Travel History'], docsUk: ['Фото', 'Історія подорожей'], timeline: '1-2 hours' },
      { id: '4', title: 'Pay Visa Fee', titleUk: 'Сплати візовий збір', desc: '$160-$190 depending on visa type', descUk: '$160-$190 залежно від типу візи', docs: ['Payment Receipt'], docsUk: ['Квитанція про оплату'], timeline: '1 day' },
      { id: '5', title: 'Schedule Interview', titleUk: 'Запиши на співбесіду', desc: 'Book appointment at US Embassy', descUk: 'Забронюй візит до посольства США', docs: ['DS-160 Confirmation', 'Appointment Letter'], docsUk: ['Підтвердження DS-160', 'Лист про призначення'], timeline: '1-8 weeks' },
      { id: '6', title: 'Attend Interview', titleUk: 'Пройди співбесіду', desc: 'Bring all required documents', descUk: 'Візьми всі необхідні документи', docs: ['All Documents', 'Passport'], docsUk: ['Всі документи', 'Паспорт'], timeline: '1 day' },
      { id: '7', title: 'Receive Visa', titleUk: 'Отримай візу', desc: 'Wait for passport with visa', descUk: 'Чекай паспорт з візою', docs: ['Tracking Number'], docsUk: ['Номер відстеження'], timeline: '1-2 weeks' },
      { id: '8', title: 'Book Flight', titleUk: 'Забронюй рейс', desc: 'One-way or round trip', descUk: 'В один бік або туди-назад', docs: ['Flight Ticket'], docsUk: ['Авіаквиток'], timeline: '1 day' },
      { id: '9', title: 'Get SSN', titleUk: 'Отримай SSN', desc: 'Social Security Number after arrival', descUk: 'Номер соціального страхування після прибуття', docs: ['Visa', 'I-94', 'Passport'], docsUk: ['Віза', 'I-94', 'Паспорт'], timeline: '2-4 weeks' },
      { id: '10', title: 'Open Bank Account', titleUk: 'Відкрий банківський рахунок', desc: 'Chase, Bank of America, Wells Fargo', descUk: 'Chase, Bank of America, Wells Fargo', docs: ['SSN', 'ID', 'Proof of Address'], docsUk: ['SSN', 'ID', 'Підтвердження адреси'], timeline: '1 day' },
      { id: '11', title: 'Find Housing', titleUk: 'Знайди житло', desc: 'Apartment, room, or temporary stay', descUk: 'Квартира, кімната або тимчасове житло', docs: ['Credit Check', 'Income Proof'], docsUk: ['Кредитна перевірка', 'Підтвердження доходу'], timeline: '1-4 weeks' },
      { id: '12', title: 'Get Health Insurance', titleUk: 'Оформи медичне страхування', desc: 'Through employer or marketplace', descUk: 'Через роботодавця або marketplace', docs: ['Employment Letter'], docsUk: ['Лист від роботодавця'], timeline: '1-2 weeks' },
    ]
  },
  canada: {
    title: 'Canada Immigration Checklist',
    titleUk: 'Чекліст еміграції до Канади',
    steps: [
      { id: '1', title: 'Check Eligibility', titleUk: 'Перевір відповідність', desc: 'Use CRS calculator for Express Entry', descUk: 'Використай CRS калькулятор', docs: ['Education Assessment', 'Language Test'], docsUk: ['Оцінка освіти', 'Мовний тест'], timeline: '1 day' },
      { id: '2', title: 'Take Language Test', titleUk: 'Склади мовний тест', desc: 'IELTS or CELPIP for English', descUk: 'IELTS або CELPIP для англійської', docs: ['Test Results'], docsUk: ['Результати тесту'], timeline: '2-4 weeks' },
      { id: '3', title: 'Get ECA', titleUk: 'Отримай ECA', desc: 'Educational Credential Assessment', descUk: 'Оцінка освітніх документів', docs: ['Diploma', 'Transcripts'], docsUk: ['Диплом', 'Транскрипти'], timeline: '4-8 weeks' },
      { id: '4', title: 'Create Express Entry Profile', titleUk: 'Створи профіль Express Entry', desc: 'Submit profile to the pool', descUk: 'Подай профіль до пулу', docs: ['All Documents'], docsUk: ['Всі документи'], timeline: '1-2 hours' },
      { id: '5', title: 'Receive ITA', titleUk: 'Отримай ITA', desc: 'Invitation to Apply', descUk: 'Запрошення подати заявку', docs: ['Express Entry Profile'], docsUk: ['Профіль Express Entry'], timeline: '2-12 weeks' },
      { id: '6', title: 'Submit Application', titleUk: 'Подай заявку', desc: 'Within 60 days of ITA', descUk: 'Протягом 60 днів після ITA', docs: ['Police Certificate', 'Medical Exam'], docsUk: ['Довідка про несудимість', 'Медичний огляд'], timeline: '60 days' },
      { id: '7', title: 'Medical Exam', titleUk: 'Пройди медогляд', desc: 'At designated clinic', descUk: 'У призначеній клініці', docs: ['Medical Forms'], docsUk: ['Медичні форми'], timeline: '1 day' },
      { id: '8', title: 'Wait for COPR', titleUk: 'Чекай на COPR', desc: 'Confirmation of Permanent Residence', descUk: 'Підтвердження резидентства', docs: ['Application Receipt'], docsUk: ['Квитанція про заявку'], timeline: '6-12 months' },
      { id: '9', title: 'Land in Canada', titleUk: 'Прибути до Канади', desc: 'Complete landing process', descUk: 'Завершити процес landing', docs: ['COPR', 'Passport'], docsUk: ['COPR', 'Паспорт'], timeline: '1 day' },
      { id: '10', title: 'Get SIN', titleUk: 'Отримай SIN', desc: 'Social Insurance Number', descUk: 'Номер соціального страхування', docs: ['PR Card', 'Passport'], docsUk: ['PR картка', 'Паспорт'], timeline: '1 day' },
    ]
  },
  europe: {
    title: 'EU Immigration Checklist',
    titleUk: 'Чекліст еміграції до ЄС',
    steps: [
      { id: '1', title: 'Choose Country', titleUk: 'Обери країну', desc: 'Germany, Poland, Netherlands, etc.', descUk: 'Німеччина, Польща, Нідерланди тощо', docs: ['Research'], docsUk: ['Дослідження'], timeline: '1-2 weeks' },
      { id: '2', title: 'Check Visa Requirements', titleUk: 'Перевір вимоги візи', desc: 'Work permit, Blue Card, Student visa', descUk: 'Дозвіл на роботу, Blue Card, Студентська віза', docs: ['Job Offer', 'University Acceptance'], docsUk: ['Пропозиція роботи', 'Зарахування до ВНЗ'], timeline: '1 day' },
      { id: '3', title: 'Gather Documents', titleUk: 'Збери документи', desc: 'Apostille, translations, certificates', descUk: 'Апостиль, переклади, сертифікати', docs: ['All Certificates'], docsUk: ['Всі сертифікати'], timeline: '2-4 weeks' },
      { id: '4', title: 'Apply for Visa', titleUk: 'Подай на візу', desc: 'At embassy or consulate', descUk: 'У посольстві або консульстві', docs: ['Application Form', 'Photos'], docsUk: ['Форма заявки', 'Фото'], timeline: '1-3 months' },
      { id: '5', title: 'Find Accommodation', titleUk: 'Знайди житло', desc: 'Required for residence permit', descUk: 'Потрібно для дозволу на проживання', docs: ['Rental Contract'], docsUk: ['Договір оренди'], timeline: '1-4 weeks' },
      { id: '6', title: 'Register Address', titleUk: 'Зареєструй адресу', desc: 'Anmeldung (Germany), etc.', descUk: 'Anmeldung (Німеччина) тощо', docs: ['Passport', 'Rental Contract'], docsUk: ['Паспорт', 'Договір оренди'], timeline: '1 day' },
      { id: '7', title: 'Open Bank Account', titleUk: 'Відкрий рахунок', desc: 'N26, Revolut, or local bank', descUk: 'N26, Revolut, або місцевий банк', docs: ['ID', 'Address Registration'], docsUk: ['ID', 'Реєстрація адреси'], timeline: '1 day' },
      { id: '8', title: 'Get Health Insurance', titleUk: 'Оформи страхування', desc: 'Public or private', descUk: 'Державне або приватне', docs: ['Employment Contract'], docsUk: ['Трудовий договір'], timeline: '1 week' },
      { id: '9', title: 'Apply for Residence Permit', titleUk: 'Подай на дозвіл', desc: 'If staying longer than visa allows', descUk: 'Якщо залишаєшся довше', docs: ['All Documents'], docsUk: ['Всі документи'], timeline: '1-3 months' },
      { id: '10', title: 'Get Tax ID', titleUk: 'Отримай податковий ID', desc: 'Required for employment', descUk: 'Потрібно для працевлаштування', docs: ['Registration', 'Passport'], docsUk: ['Реєстрація', 'Паспорт'], timeline: '1-4 weeks' },
    ]
  }
};

export default function ChecklistPage() {
  const [region, setRegion] = useState<Region>('usa');
  const [lang, setLang] = useState<'en' | 'uk'>('uk');
  const [completed, setCompleted] = useState<string[]>([]);

  const t = (en: string, uk: string) => lang === 'en' ? en : uk;
  const checklist = CHECKLISTS[region];
  const toggleStep = (id: string) => setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const progress = Math.round((completed.length / checklist.steps.length) * 100);

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
            <span className="text-[#00A3FF]">{t('Checklist', 'Чекліст')}</span>
          </div>
          <button onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')} className="px-3 py-1.5 bg-[#1F242C] rounded-lg text-sm">
            {lang === 'uk' ? '🇺🇸 EN' : '🇺🇦 UA'}
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(CHECKLISTS) as Region[]).map((r) => (
              <button key={r} onClick={() => { setRegion(r); setCompleted([]); }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${region === r ? 'bg-[#00A3FF] text-[#0D1117]' : 'bg-[#1F242C] hover:bg-[#2D333B]'}`}>
                {r === 'usa' ? '🇺🇸 США' : r === 'canada' ? '🇨🇦 Канада' : '🇪🇺 ЄС'}
              </button>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t(checklist.title, checklist.titleUk)}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-3 bg-[#1F242C] rounded-full overflow-hidden">
              <div className="h-full bg-[#00A3FF] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[#00A3FF] font-bold">{progress}%</span>
          </div>

          <div className="space-y-4">
            {checklist.steps.map((step, i) => {
              const isCompleted = completed.includes(step.id);
              return (
                <div key={step.id} className={`p-4 sm:p-6 rounded-xl border transition-all ${isCompleted ? 'bg-[#00A3FF]/10 border-[#00A3FF]/50' : 'bg-[#161B22] border-[#1F242C]'}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleStep(step.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? 'bg-[#00A3FF] border-[#00A3FF]' : 'border-[#3D444D] hover:border-[#00A3FF]'}`}>
                      {isCompleted && <span className="text-[#0D1117]">✓</span>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#8B949E] text-sm">{t('Step', 'Крок')} {i + 1}</span>
                        <span className="text-xs px-2 py-0.5 bg-[#1F242C] rounded">{step.timeline}</span>
                      </div>
                      <h3 className={`font-semibold mb-1 ${isCompleted ? 'line-through text-[#8B949E]' : ''}`}>
                        {t(step.title, step.titleUk)}
                      </h3>
                      <p className="text-sm text-[#8B949E] mb-3">{t(step.desc, step.descUk)}</p>
                      <div className="flex flex-wrap gap-2">
                        {(lang === 'en' ? step.docs : step.docsUk).map((doc, j) => (
                          <span key={j} className="text-xs px-2 py-1 bg-[#1F242C] rounded">📄 {doc}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {progress === 100 && (
            <div className="mt-8 p-6 bg-[#00A3FF]/10 border border-[#00A3FF] rounded-xl text-center">
              <span className="text-4xl mb-4 block">🎉</span>
              <h2 className="text-xl font-bold mb-2">{t('Congratulations!', 'Вітаємо!')}</h2>
              <p className="text-[#8B949E]">{t('You completed all steps!', 'Ти виконав всі кроки!')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}