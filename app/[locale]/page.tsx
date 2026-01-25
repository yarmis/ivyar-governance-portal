'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { locales } from '@/i18n/config';

const MODULES_TRANSLATIONS = {
  us: {
    governance: [
      { title: 'Governance Core', desc: 'Authority, roles, delegation, institutional control', cat: 'governance' },
      { title: 'Program Registry', desc: 'Programs, contracts, ceilings, obligations tracking', cat: 'governance' },
      { title: 'Decision Ledger', desc: 'Immutable approvals, justifications, timestamped actions', cat: 'governance' },
      { title: 'Audit Engine', desc: 'Evidence trails, compliance mapping, OIG-ready exports', cat: 'governance' },
      { title: 'Risk & Safeguards', desc: 'Risk registry, misuse detection, human override', cat: 'governance' },
      { title: 'Transparency Hub', desc: 'Real-time visibility, cross-ministry dashboards', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS Module', desc: 'Human-in-the-loop oversight, decision authorization', cat: 'donor' },
      { title: 'Donor Dashboard', desc: 'Real-time program visibility, KPI tracking, IATI compliance', cat: 'donor' },
      { title: 'MEL & Evidence', desc: 'Indicators, evidence linkage, outcome verification', cat: 'donor' },
      { title: 'Reconstruction', desc: 'Post-conflict recovery, infrastructure rebuild', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI Administrator', desc: 'Ethical AI assistant — human authority enforced', cat: 'intelligence' },
      { title: 'Platform Status', desc: '99.97% uptime, real-time monitoring', cat: 'intelligence' },
    ],
    categories: { governance: 'Governance & Control', donor: 'Donor Oversight', intelligence: 'Intelligence' },
    search: { placeholder: 'Search modules...', results: 'results', noResults: 'No results found' }
  },
  ua: {
    governance: [
      { title: 'Ядро управління', desc: 'Повноваження, ролі, делегування, інституційний контроль', cat: 'governance' },
      { title: 'Реєстр програм', desc: 'Програми, контракти, ліміти, відстеження зобов\'язань', cat: 'governance' },
      { title: 'Реєстр рішень', desc: 'Незмінні затвердження, обґрунтування, дії з позначкою часу', cat: 'governance' },
      { title: 'Модуль аудиту', desc: 'Сліди доказів, відповідність, експорт для OIG', cat: 'governance' },
      { title: 'Ризики та захист', desc: 'Реєстр ризиків, виявлення зловживань, контроль', cat: 'governance' },
      { title: 'Центр прозорості', desc: 'Видимість в реальному часі, міжміністерські панелі', cat: 'governance' },
    ],
    donor: [
      { title: 'Модуль HBS', desc: 'Нагляд з людиною в циклі, авторизація рішень', cat: 'donor' },
      { title: 'Панель донорів', desc: 'Видимість програм, відстеження KPI, відповідність IATI', cat: 'donor' },
      { title: 'MEL та докази', desc: 'Індикатори, зв\'язок доказів, перевірка результатів', cat: 'donor' },
      { title: 'Реконструкція', desc: 'Відновлення після конфлікту, відбудова інфраструктури', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI Адміністратор', desc: 'Етичний AI асистент — людський контроль забезпечено', cat: 'intelligence' },
      { title: 'Статус платформи', desc: '99.97% uptime, моніторинг в реальному часі', cat: 'intelligence' },
    ],
    categories: { governance: 'Управління та контроль', donor: 'Донорський нагляд', intelligence: 'Інтелект' },
    search: { placeholder: 'Пошук модулів...', results: 'результатів', noResults: 'Нічого не знайдено' }
  },
  de: {
    governance: [{ title: 'Governance-Kern', desc: 'Befugnisse, Rollen, Delegierung', cat: 'governance' }, { title: 'Programmregister', desc: 'Programme, Verträge', cat: 'governance' }, { title: 'Entscheidungsregister', desc: 'Genehmigungen', cat: 'governance' }, { title: 'Audit-Engine', desc: 'Beweispfade', cat: 'governance' }, { title: 'Risiko & Schutz', desc: 'Risikoregister', cat: 'governance' }, { title: 'Transparenz-Hub', desc: 'Sichtbarkeit', cat: 'governance' }],
    donor: [{ title: 'HBS-Modul', desc: 'Aufsicht', cat: 'donor' }, { title: 'Geber-Dashboard', desc: 'Sichtbarkeit', cat: 'donor' }, { title: 'MEL & Beweise', desc: 'Indikatoren', cat: 'donor' }, { title: 'Wiederaufbau', desc: 'Wiederherstellung', cat: 'donor' }],
    intelligence: [{ title: 'KI-Administrator', desc: 'Assistent', cat: 'intelligence' }, { title: 'Status', desc: '99.97%', cat: 'intelligence' }],
    categories: { governance: 'Governance', donor: 'Geber', intelligence: 'Intelligenz' },
    search: { placeholder: 'Suchen...', results: 'Ergebnisse', noResults: 'Keine' }
  },
  fr: {
    governance: [{ title: 'Noyau', desc: 'Autorité, rôles', cat: 'governance' }, { title: 'Registre', desc: 'Programmes', cat: 'governance' }, { title: 'Décisions', desc: 'Approbations', cat: 'governance' }, { title: 'Audit', desc: 'Pistes', cat: 'governance' }, { title: 'Risques', desc: 'Registre', cat: 'governance' }, { title: 'Transparence', desc: 'Visibilité', cat: 'governance' }],
    donor: [{ title: 'HBS', desc: 'Surveillance', cat: 'donor' }, { title: 'Donateurs', desc: 'Visibilité', cat: 'donor' }, { title: 'MEL', desc: 'Indicateurs', cat: 'donor' }, { title: 'Reconstruction', desc: 'Récupération', cat: 'donor' }],
    intelligence: [{ title: 'IA', desc: 'Assistant', cat: 'intelligence' }, { title: 'État', desc: '99.97%', cat: 'intelligence' }],
    categories: { governance: 'Gouvernance', donor: 'Donateurs', intelligence: 'Intelligence' },
    search: { placeholder: 'Rechercher...', results: 'résultats', noResults: 'Aucun' }
  },
  es: { governance: [{ title: 'Núcleo', desc: 'Autoridad', cat: 'governance' }, { title: 'Registro', desc: 'Programas', cat: 'governance' }, { title: 'Decisiones', desc: 'Aprobaciones', cat: 'governance' }, { title: 'Auditoría', desc: 'Rastros', cat: 'governance' }, { title: 'Riesgos', desc: 'Registro', cat: 'governance' }, { title: 'Transparencia', desc: 'Visibilidad', cat: 'governance' }], donor: [{ title: 'HBS', desc: 'Supervisión', cat: 'donor' }, { title: 'Donantes', desc: 'Visibilidad', cat: 'donor' }, { title: 'MEL', desc: 'Indicadores', cat: 'donor' }, { title: 'Reconstrucción', desc: 'Recuperación', cat: 'donor' }], intelligence: [{ title: 'IA', desc: 'Asistente', cat: 'intelligence' }, { title: 'Estado', desc: '99.97%', cat: 'intelligence' }], categories: { governance: 'Gobernanza', donor: 'Donantes', intelligence: 'Inteligencia' }, search: { placeholder: 'Buscar...', results: 'resultados', noResults: 'Sin' } },
  it: { governance: [{ title: 'Nucleo', desc: 'Autorità', cat: 'governance' }, { title: 'Registro', desc: 'Programmi', cat: 'governance' }, { title: 'Decisioni', desc: 'Approvazioni', cat: 'governance' }, { title: 'Audit', desc: 'Tracce', cat: 'governance' }, { title: 'Rischi', desc: 'Registro', cat: 'governance' }, { title: 'Trasparenza', desc: 'Visibilità', cat: 'governance' }], donor: [{ title: 'HBS', desc: 'Supervisione', cat: 'donor' }, { title: 'Donatori', desc: 'Visibilità', cat: 'donor' }, { title: 'MEL', desc: 'Indicatori', cat: 'donor' }, { title: 'Ricostruzione', desc: 'Recupero', cat: 'donor' }], intelligence: [{ title: 'IA', desc: 'Assistente', cat: 'intelligence' }, { title: 'Stato', desc: '99.97%', cat: 'intelligence' }], categories: { governance: 'Governance', donor: 'Donatori', intelligence: 'Intelligenza' }, search: { placeholder: 'Cerca...', results: 'risultati', noResults: 'Nessun' } },
  pl: { governance: [{ title: 'Rdzeń', desc: 'Uprawnienia', cat: 'governance' }, { title: 'Rejestr', desc: 'Programy', cat: 'governance' }, { title: 'Decyzje', desc: 'Zatwierdzenia', cat: 'governance' }, { title: 'Audyt', desc: 'Ślady', cat: 'governance' }, { title: 'Ryzyko', desc: 'Rejestr', cat: 'governance' }, { title: 'Przejrzystość', desc: 'Widoczność', cat: 'governance' }], donor: [{ title: 'HBS', desc: 'Nadzór', cat: 'donor' }, { title: 'Darczyńcy', desc: 'Widoczność', cat: 'donor' }, { title: 'MEL', desc: 'Wskaźniki', cat: 'donor' }, { title: 'Odbudowa', desc: 'Odzyskiwanie', cat: 'donor' }], intelligence: [{ title: 'AI', desc: 'Asystent', cat: 'intelligence' }, { title: 'Status', desc: '99.97%', cat: 'intelligence' }], categories: { governance: 'Zarządzanie', donor: 'Darczyńcy', intelligence: 'Inteligencja' }, search: { placeholder: 'Szukaj...', results: 'wyników', noResults: 'Brak' } },
};

// Базовий hero translation
const baseHero = { hero: { title: 'IVYAR Governance Platform', subtitle: 'Institutional governance infrastructure', origin: 'Built in USA • Inspired by Ukraine' }, nav: { search: 'Search' }, badge: 'NATO-Aligned • World Bank Ready', modules: { title: 'Institutional Infrastructure' }, note: { title: 'Advanced capabilities', desc: 'Procurement, logistics' } };

const TRANSLATIONS: Record<string, any> = {
  us: baseHero,
  gb: baseHero,
  eu: baseHero,
  ua: { hero: { title: 'Платформа IVYAR', subtitle: 'Інституційна інфраструктура', origin: 'Створено в США • Натхненно Україною' }, nav: { search: 'Пошук' }, badge: 'NATO-сумісний • World Bank', modules: { title: 'Інфраструктура' }, note: { title: 'Розширені можливості', desc: 'Закупівлі, логістика' } },
  de: { hero: { title: 'IVYAR Plattform', subtitle: 'Governance-Infrastruktur', origin: 'USA • Ukraine' }, nav: { search: 'Suchen' }, badge: 'NATO-konform', modules: { title: 'Infrastruktur' }, note: { title: 'Fähigkeiten', desc: 'Beschaffung' } },
  fr: { hero: { title: 'Plateforme IVYAR', subtitle: 'Infrastructure', origin: 'USA • Ukraine' }, nav: { search: 'Rechercher' }, badge: 'OTAN', modules: { title: 'Infrastructure' }, note: { title: 'Capacités', desc: 'Achats' } },
  es: { hero: { title: 'Plataforma IVYAR', subtitle: 'Infraestructura', origin: 'EE.UU.' }, nav: { search: 'Buscar' }, badge: 'OTAN', modules: { title: 'Infraestructura' }, note: { title: 'Capacidades', desc: 'Compras' } },
  it: { hero: { title: 'Piattaforma IVYAR', subtitle: 'Infrastruttura', origin: 'USA' }, nav: { search: 'Cerca' }, badge: 'NATO', modules: { title: 'Infrastruttura' }, note: { title: 'Capacità', desc: 'Appalti' } },
  pl: { hero: { title: 'Platforma IVYAR', subtitle: 'Infrastruktura', origin: 'USA' }, nav: { search: 'Szukaj' }, badge: 'NATO', modules: { title: 'Infrastruktura' }, note: { title: 'Możliwości', desc: 'Zakupy' } },
};

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark class="bg-[#3A8DFF]/30 text-[#3A8DFF] rounded px-1">${part}</mark>`
      : part
  ).join('');
};

const catColors = {
  governance: { bg: 'from-[#3A8DFF]/10 to-[#3A8DFF]/5', badge: 'bg-[#3A8DFF]/20 text-[#3A8DFF]' },
  donor: { bg: 'from-[#4CD3C2]/10 to-[#4CD3C2]/5', badge: 'bg-[#4CD3C2]/20 text-[#4CD3C2]' },
  intelligence: { bg: 'from-[#3CCB7F]/10 to-[#3CCB7F]/5', badge: 'bg-[#3CCB7F]/20 text-[#3CCB7F]' },
};

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'us';
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const langRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[locale] || baseHero;
  const tm = MODULES_TRANSLATIONS[locale as keyof typeof MODULES_TRANSLATIONS] || MODULES_TRANSLATIONS.us;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { 
        e.preventDefault(); 
        setSearchOpen(true);
      }
      if (e.key === 'Escape') { 
        setSearchOpen(false); 
        setLangOpen(false); 
        setSelectedModule(null);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const allModules = [...tm.governance, ...tm.donor, ...tm.intelligence];
  const searchResults = searchQuery.trim()
    ? allModules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allModules;

  const availableLocales = locales.filter(l => 
    TRANSLATIONS[l.code] || MODULES_TRANSLATIONS[l.code as keyof typeof MODULES_TRANSLATIONS]
  );

  const currentLang = availableLocales.find(l => l.code === locale) || availableLocales[0];

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-white">
      <nav className="sticky top-0 z-40 bg-[#0B0D0E]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-3 hover:opacity-80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3A8DFF] to-[#4CD3C2] flex items-center justify-center font-bold">IV</div>
            <span className="font-bold text-xl">IVYAR</span>
          </a>
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
              <span>🔍</span><span className="hidden md:inline">{t.nav.search}</span><span className="text-xs text-white/40">⌘K</span>
            </button>
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                {currentLang.flag} {locale.toUpperCase()} ▼
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#1A1D1F] border border-white/10 rounded-lg p-2 min-w-[200px] max-h-[400px] overflow-y-auto z-50 shadow-2xl">
                  {availableLocales.slice(0, 10).map(lang => (
                    <a 
                      key={lang.code} 
                      href={`/${lang.code}`} 
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/10 text-left transition-all ${locale === lang.code ? 'bg-[#3A8DFF]/20 text-[#3A8DFF]' : ''}`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block px-4 py-2 bg-[#3A8DFF]/10 border border-[#3A8DFF]/30 rounded-full text-[#4CD3C2] text-sm font-semibold mb-6">{t.badge}</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#3A8DFF] bg-clip-text text-transparent">{t.hero.title}</h1>
        <p className="text-xl text-white/60 mb-4">{t.hero.subtitle}</p>
        <p className="text-sm text-white/40 mb-12">{t.hero.origin}</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t.modules.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {allModules.slice(0, 6).map((m, i) => (
            <button 
              key={i} 
              onClick={() => handleModuleClick(m)}
              className={`p-6 bg-gradient-to-br ${catColors[m.cat as keyof typeof catColors].bg} border border-white/10 rounded-xl hover:border-white/20 transition-all text-left w-full cursor-pointer`}
            >
              <h4 className="font-semibold text-lg mb-2">{m.title}</h4>
              <p className="text-white/60 text-sm">{m.desc}</p>
            </button>
          ))}
        </div>
        <div className="text-center p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-white/80"><strong>{t.note.title}</strong></p>
          <p className="text-white/40 text-sm">{t.note.desc}</p>
        </div>
      </section>

      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-32" onClick={() => setSearchOpen(false)}>
          <div className="bg-[#1A1D1F] border border-white/10 rounded-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder={tm.search.placeholder} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="flex-1 bg-transparent text-white outline-none" 
                autoFocus 
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">✕</button>}
            </div>
            {searchQuery && <div className="px-6 py-2 text-sm text-white/40 border-b border-white/10">{searchResults.length} {tm.search.results}</div>}
            <div className="max-h-96 overflow-y-auto p-2">
              {searchResults.length === 0 && searchQuery ? (
                <div className="p-8 text-center text-white/40">{tm.search.noResults}</div>
              ) : (
                searchResults.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => handleModuleClick(m)}
                    className="w-full text-left p-4 hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold" dangerouslySetInnerHTML={{ __html: highlightText(m.title, searchQuery) }} />
                      <span className={`px-2 py-1 text-xs rounded-full ${catColors[m.cat as keyof typeof catColors].badge}`}>
                        {tm.categories[m.cat as keyof typeof tm.categories]}
                      </span>
                    </div>
                    <div className="text-sm text-white/60" dangerouslySetInnerHTML={{ __html: highlightText(m.desc, searchQuery) }} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedModule && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6" onClick={() => setSelectedModule(null)}>
          <div className={`bg-gradient-to-br ${catColors[selectedModule.cat as keyof typeof catColors].bg} border-2 border-white/20 rounded-2xl max-w-2xl w-full p-8`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`inline-block px-3 py-1 text-xs rounded-full ${catColors[selectedModule.cat as keyof typeof catColors].badge} mb-3`}>
                  {tm.categories[selectedModule.cat as keyof typeof tm.categories]}
                </span>
                <h2 className="text-3xl font-bold">{selectedModule.title}</h2>
              </div>
              <button onClick={() => setSelectedModule(null)} className="text-white/40 hover:text-white text-2xl">✕</button>
            </div>
            <p className="text-white/80 text-lg mb-6">{selectedModule.desc}</p>
            <button onClick={() => setSelectedModule(null)} className="px-6 py-3 bg-[#3A8DFF] rounded-lg hover:bg-[#2E7FED] transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
