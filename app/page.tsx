'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GlobalSearch } from '@/components/GlobalSearch';
import AutopilotWidget from "@/components/AutopilotWidget";

const TRANSLATIONS: Record<string, {
  hero: { title: string; subtitle: string };
  nav: { modules: string; ai: string; about: string; portal: string };
  countries: { label: string };
  trusted: string;
  modules: { title: string; subtitle: string; learnMore: string; endpoints: string };
  ai: { badge: string; title: string; desc: string; features: string[] };
  cta: { title: string; subtitle: string; demo: string; contact: string };
  footer: { tagline: string; platform: string; modules: string; company: string; copyright: string; nato: string };
  modulesList: { name: string; desc: string }[];
}> = {
  en: {
    hero: {
      title: 'IVYAR Governance Platform',
      subtitle: 'Institutional infrastructure for ethical, transparent, AI-aligned decision-making across governments and international partners.',
    },
    nav: { modules: 'Modules', ai: 'AI Administrator', about: 'About', portal: 'Access Portal' },
    countries: { label: 'Operating with respect across:' },
    trusted: 'Trusted by leading institutions',
    modules: { title: 'Platform Modules', subtitle: 'Modular Architecture for Government Operations', learnMore: 'Learn more', endpoints: 'API endpoints' },
    ai: {
      badge: 'Ethical AI Steward',
      title: 'AI Administrator — Ethical, Transparent, Human-Aligned',
      desc: 'The IVYAR AI Administrator assists operators with insights, summaries, and risk signals. It never replaces human authority, always explains its reasoning, and follows the IVYAR ethical charter and HBS safeguards.',
      features: [
        'Calm, respectful, and non-intrusive behavior',
        'Transparent reasoning and audit-ready logs',
        'Human-first decision support, never autonomous control',
      ],
    },
    cta: {
      title: 'Ready to modernize your governance operations?',
      subtitle: 'Join leading institutions using IVYAR for secure, compliant, and ethical digital governance.',
      demo: 'Request Demo',
      contact: 'Contact Us',
    },
    footer: {
      tagline: 'Ethical, transparent, AI-aligned governance infrastructure.',
      platform: 'Platform',
      modules: 'Modules',
      company: 'Company',
      copyright: '© 2024-2026 IVYAR. All rights reserved.',
      nato: 'NATO-Aligned • Multi-Region Infrastructure',
    },
    modulesList: [
      { name: 'Procurement Engine', desc: 'Transparent tender management and contract oversight' },
      { name: 'Logistics Engine', desc: 'Route optimization and supply chain tracking' },
      { name: 'Donor Dashboard', desc: 'Funding transparency and impact reporting' },
      { name: 'Data Platform', desc: 'Unified data lake and document management' },
      { name: 'HBS Module', desc: 'Humanitarian budget support and ethical governance' },
      { name: 'AI Services', desc: 'Intelligent automation and decision support' },
    ],
  },
  uk: {
    hero: {
      title: 'Платформа управління IVYAR',
      subtitle: 'Інституційна інфраструктура для етичного, прозорого, AI-орієнтованого прийняття рішень урядами та міжнародними партнерами.',
    },
    nav: { modules: 'Модулі', ai: 'AI Адміністратор', about: 'Про нас', portal: 'Увійти в портал' },
    countries: { label: 'Працюємо з повагою в:' },
    trusted: 'Нам довіряють провідні інституції',
    modules: { title: 'Модулі платформи', subtitle: 'Модульна архітектура для державних операцій', learnMore: 'Детальніше', endpoints: 'API точок' },
    ai: {
      badge: 'Етичний AI Стюард',
      title: 'AI Адміністратор — Етичний, Прозорий, Людиноцентричний',
      desc: 'AI Адміністратор IVYAR допомагає операторам з аналітикою, резюме та сигналами ризику. Він ніколи не замінює людський авторитет, завжди пояснює своє міркування та дотримується етичної хартії IVYAR.',
      features: [
        'Спокійна, шанобліва та ненав\'язлива поведінка',
        'Прозоре міркування та готові до аудиту логи',
        'Підтримка рішень людиною, ніколи автономний контроль',
      ],
    },
    cta: {
      title: 'Готові модернізувати ваші операції управління?',
      subtitle: 'Приєднуйтесь до провідних інституцій, які використовують IVYAR для безпечного, відповідного та етичного цифрового управління.',
      demo: 'Запросити демо',
      contact: 'Зв\'язатися',
    },
    footer: {
      tagline: 'Етична, прозора, AI-орієнтована інфраструктура управління.',
      platform: 'Платформа',
      modules: 'Модулі',
      company: 'Компанія',
      copyright: '© 2024-2026 IVYAR. All rights reserved.',
      nato: 'NATO-сумісний • Мульти-регіональна інфраструктура',
    },
    modulesList: [
      { name: 'Модуль закупівель', desc: 'Прозоре управління тендерами та контроль контрактів' },
      { name: 'Модуль логістики', desc: 'Оптимізація маршрутів та відстеження ланцюга постачання' },
      { name: 'Панель донорів', desc: 'Прозорість фінансування та звітність про вплив' },
      { name: 'Платформа даних', desc: 'Уніфіковане сховище даних та управління документами' },
      { name: 'HBS Модуль', desc: 'Гуманітарна бюджетна підтримка та етичне управління' },
      { name: 'AI Сервіси', desc: 'Інтелектуальна автоматизація та підтримка рішень' },
    ],
  },
  fr: {
    hero: {
      title: 'Plateforme de gouvernance IVYAR',
      subtitle: 'Infrastructure institutionnelle pour une prise de décision éthique, transparente et alignée sur l\'IA entre les gouvernements et les partenaires internationaux.',
    },
    nav: { modules: 'Modules', ai: 'Administrateur IA', about: 'À propos', portal: 'Accès au portail' },
    countries: { label: 'Opérant avec respect à travers:' },
    trusted: 'Approuvé par les institutions leaders',
    modules: { title: 'Modules de la plateforme', subtitle: 'Architecture modulaire pour les opérations gouvernementales', learnMore: 'En savoir plus', endpoints: 'points API' },
    ai: {
      badge: 'Intendant IA éthique',
      title: 'Administrateur IA — Éthique, Transparent, Aligné sur l\'humain',
      desc: 'L\'administrateur IA IVYAR aide les opérateurs avec des insights, des résumés et des signaux de risque. Il ne remplace jamais l\'autorité humaine et suit la charte éthique IVYAR.',
      features: [
        'Comportement calme, respectueux et non intrusif',
        'Raisonnement transparent et journaux prêts pour l\'audit',
        'Support décisionnel humain, jamais de contrôle autonome',
      ],
    },
    cta: {
      title: 'Prêt à moderniser vos opérations de gouvernance?',
      subtitle: 'Rejoignez les institutions leaders utilisant IVYAR pour une gouvernance numérique sécurisée, conforme et éthique.',
      demo: 'Demander une démo',
      contact: 'Nous contacter',
    },
    footer: {
      tagline: 'Infrastructure de gouvernance éthique, transparente et alignée sur l\'IA.',
      platform: 'Plateforme',
      modules: 'Modules',
      company: 'Entreprise',
      copyright: '© 2024-2026 IVYAR. All rights reserved.',
      nato: 'Aligné OTAN • Infrastructure multi-région',
    },
    modulesList: [
      { name: 'Moteur d\'approvisionnement', desc: 'Gestion transparente des appels d\'offres' },
      { name: 'Moteur logistique', desc: 'Optimisation des itinéraires et suivi de la chaîne' },
      { name: 'Tableau de bord donateurs', desc: 'Transparence du financement et rapports d\'impact' },
      { name: 'Plateforme de données', desc: 'Lac de données unifié et gestion documentaire' },
      { name: 'Module HBS', desc: 'Soutien budgétaire humanitaire et gouvernance éthique' },
      { name: 'Services IA', desc: 'Automatisation intelligente et support décisionnel' },
    ],
  },
  de: {
    hero: {
      title: 'IVYAR Governance-Plattform',
      subtitle: 'Institutionelle Infrastruktur für ethische, transparente, KI-ausgerichtete Entscheidungsfindung für Regierungen und internationale Partner.',
    },
    nav: { modules: 'Module', ai: 'KI-Administrator', about: 'Über uns', portal: 'Portal-Zugang' },
    countries: { label: 'Mit Respekt tätig in:' },
    trusted: 'Vertraut von führenden Institutionen',
    modules: { title: 'Plattform-Module', subtitle: 'Modulare Architektur für Regierungsoperationen', learnMore: 'Mehr erfahren', endpoints: 'API-Endpunkte' },
    ai: {
      badge: 'Ethischer KI-Steward',
      title: 'KI-Administrator — Ethisch, Transparent, Menschenorientiert',
      desc: 'Der IVYAR KI-Administrator unterstützt Operatoren mit Einblicken, Zusammenfassungen und Risikosignalen. Er ersetzt nie menschliche Autorität und folgt der ethischen IVYAR-Charta.',
      features: [
        'Ruhiges, respektvolles und nicht-aufdringliches Verhalten',
        'Transparente Argumentation und audit-bereite Protokolle',
        'Menschliche Entscheidungsunterstützung, nie autonome Kontrolle',
      ],
    },
    cta: {
      title: 'Bereit, Ihre Governance-Operationen zu modernisieren?',
      subtitle: 'Schließen Sie sich führenden Institutionen an, die IVYAR für sichere, konforme und ethische digitale Governance nutzen.',
      demo: 'Demo anfordern',
      contact: 'Kontaktieren Sie uns',
    },
    footer: {
      tagline: 'Ethische, transparente, KI-ausgerichtete Governance-Infrastruktur.',
      platform: 'Plattform',
      modules: 'Module',
      company: 'Unternehmen',
      copyright: '© 2024-2026 IVYAR. All rights reserved.',
      nato: 'NATO-konform • Multi-Region-Infrastruktur',
    },
    modulesList: [
      { name: 'Beschaffungs-Engine', desc: 'Transparentes Ausschreibungsmanagement' },
      { name: 'Logistik-Engine', desc: 'Routenoptimierung und Lieferkettenverfolging' },
      { name: 'Spender-Dashboard', desc: 'Finanzierungstransparenz und Wirkungsberichte' },
      { name: 'Datenplattform', desc: 'Einheitlicher Data Lake und Dokumentenverwaltung' },
      { name: 'HBS-Modul', desc: 'Humanitäre Budgetunterstützung und ethische Governance' },
      { name: 'KI-Dienste', desc: 'Intelligente Automatisierung und Entscheidungsunterstützung' },
    ],
  },
};

const COUNTRIES = [
  { code: 'us', name: 'USA', lang: 'en' },
  { code: 'ca', name: 'Canada', lang: 'en' },
  { code: 'uk', name: 'United Kingdom', lang: 'en' },
  { code: 'eu', name: 'European Union', lang: 'fr' },
  { code: 'ua', name: 'Ukraine', lang: 'uk' },
];

const MODULE_META = [
  { icon: '📋', status: 'live', apis: 18, href: '/modules/procurement' },
  { icon: '🚚', status: 'pilot', apis: 14, href: '/modules/logistics' },
  { icon: '🤝', status: 'design', apis: 12, href: '/modules/donor-dashboard' },
  { icon: '🗄️', status: 'dev', apis: 10, href: '/modules/data-platform' },
  { icon: '🏛️', status: 'core', apis: 8, href: '/us/hbs' },
  { icon: '🤖', status: 'beta', apis: 5, href: '/modules/ai-services' },
  { icon: '🏪', status: 'live', apis: 4, href: '/modules/trade' },
  { icon: '🛡️', status: 'live', apis: 4, href: '/modules/insurance' },
  { icon: '💳', status: 'live', apis: 4, href: '/modules/payments' },
  { icon: '🏗️', status: 'pilot', apis: 4, href: '/modules/reconstruction' },
  { icon: '🚛', status: 'live', apis: 4, href: '/modules/freight' },
];


const PARTNERS = ['NATO', 'World Bank', 'USAID', 'European Commission', 'Government of Canada'];

export default function LandingPage() {
  const [activeCountry, setActiveCountry] = useState('us');
  
  const currentLang = COUNTRIES.find(c => c.code === activeCountry)?.lang || 'en';
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const modules = MODULE_META.map((m, i) => ({
    ...m,
    name: t.modulesList[i]?.name || '',
    desc: t.modulesList[i]?.desc || '',
  }));

  const handleModuleClick = (href: string) => {
    console.log("CLICK:", href); window.location.href = href;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">IV</div>
            <span className="text-lg font-semibold hidden sm:block">IVYAR</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#modules" className="text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{t.nav.modules}</Link>
            <Link href="#ai" className="text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{t.nav.ai}</Link>
            <Link href="#about" className="text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{t.nav.about}</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 h-8 bg-[#3CCB7F]/10">
              <span className="w-2 h-2 bg-[#3CCB7F] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-[#3CCB7F]">Operational</span>
            </div>
            
            <Link 
              href="/demo" 
              className="hidden sm:flex h-11 px-5 bg-gradient-to-r from-[#00A3FF] to-[#0077CC] text-white font-medium text-sm items-center gap-2 hover:from-[#33B5FF] hover:to-[#0088DD] transition-all"
            >
              Request Demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              href="/hbs" 
              className="h-11 px-5 bg-[#1F242C] border border-[#3D444D] text-[#E6EDF3] font-medium text-sm flex items-center hover:bg-[#2D333B] transition-colors"
            >
              {t.nav.portal}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-[140px] pb-[100px] lg:pt-[160px] lg:pb-[120px]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-semibold leading-[1.1] tracking-[-0.02em]">
                  {t.hero.title}
                </h1>
                <p className="text-base lg:text-lg text-[#8B949E] leading-relaxed max-w-xl">
                  {t.hero.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/hbs" className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center justify-center hover:bg-[#33B5FF] transition-colors">
                  {t.nav.portal}
                </Link>
                <Link href="#modules" className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center justify-center hover:bg-[#00A3FF]/10 transition-colors">
                  {t.nav.modules}
                </Link>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <span className="text-xs font-medium text-[#8B949E] uppercase tracking-wider">
                  {t.countries.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => setActiveCountry(country.code)}
                      className={`h-10 px-4 lg:px-5 bg-[#161B22] border text-xs lg:text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                        activeCountry === country.code 
                          ? 'border-[#00A3FF] text-[#E6EDF3] shadow-[0_0_12px_0_rgba(0,163,255,0.35)] animate-[breathing_3s_ease-in-out_infinite]' 
                          : 'border-[#1F242C] text-[#8B949E] hover:border-[#00A3FF] hover:text-[#E6EDF3]'
                      }`}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full h-[400px] bg-[#161B22] border border-[#1F242C] relative overflow-hidden">
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
                </div>
                <div className="absolute top-12 left-4 right-4 font-mono text-sm">
                  <p className="text-[#6E7681]">$ ivyar initialize --platform gov-cloud</p>
                  <p className="text-[#3CCB7F] mt-2">✓ IVYAR GOVERNANCE PLATFORM v3.0</p>
                  <p className="text-[#8B949E] mt-1">✓ 12 modules loaded</p>
                  <p className="text-[#8B949E]">✓ 5 regions active</p>
                  <p className="text-[#8B949E]">✓ AI Administrator online</p>
                  <p className="text-[#00A3FF] mt-4 animate-pulse">Ready for operations_</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <span className="text-xs font-medium text-[#6E7681] uppercase tracking-wider">
              {t.trusted}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              {PARTNERS.map((partner, i) => (
                <span key={i} className="text-[#6E7681] text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-[80px] lg:py-[120px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
              <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">{t.modules.title}</span>
              <h2 className="text-2xl lg:text-4xl font-semibold">{t.modules.subtitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod, i) => (
                <a href={mod.href} 
                  key={i}
                  onClick={() => handleModuleClick(mod.href)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleModuleClick(mod.href)}
                  className="bg-[#161B22] border border-[#1F242C] p-6 hover:border-[#00A3FF] transition-colors group cursor-pointer select-none"
                >
                  <div className="flex flex-col gap-4 ">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-[#00A3FF]/10 flex items-center justify-center text-2xl">{mod.icon}</div>
                      <span className={`text-[11px] font-semibold uppercase px-2 h-[22px] flex items-center ${
                        mod.status === 'live' || mod.status === 'core' ? 'bg-[#3CCB7F]/15 text-[#3CCB7F]' :
                        mod.status === 'pilot' || mod.status === 'beta' ? 'bg-[#FFB84D]/15 text-[#FFB84D]' :
                        mod.status === 'dev' ? 'bg-[#00A3FF]/15 text-[#00A3FF]' : 'bg-[#8B949E]/15 text-[#8B949E]'
                      }`}>{mod.status}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{mod.name}</h3>
                    <p className="text-sm text-[#8B949E] flex-1">{mod.desc}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1F242C]">
                      <span className="text-xs text-[#6E7681]">{mod.apis} {t.modules.endpoints}</span>
                      <span className="text-sm font-medium text-[#00A3FF] group-hover:translate-x-1 transition-transform">{t.modules.learnMore} →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Administrator */}
      <section id="ai" className="py-[80px] lg:py-[120px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">{t.ai.badge}</span>
                <h2 className="text-2xl lg:text-4xl font-semibold">{t.ai.title}</h2>
                <p className="text-[#8B949E] leading-relaxed">
                  {t.ai.desc}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {t.ai.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-[#00A3FF]/5 border-l-2 border-[#00A3FF]">
                    <span className="text-[#00A3FF] font-bold">✓</span>
                    <span className="text-[15px]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-[#0D1117] border border-[#1F242C] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#00A3FF]/20 flex items-center justify-center">🤖</div>
                  <div>
                    <p className="font-medium">AI Administrator</p>
                    <p className="text-xs text-[#6E7681]">Ethical Governance Assistant</p>
                  </div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="p-3 bg-[#161B22] border border-[#1F242C]">
                    <p className="text-[#8B949E]">Analysis complete. 3 recommendations ready.</p>
                  </div>
                  <div className="p-3 bg-[#3CCB7F]/10 border border-[#3CCB7F]/30">
                    <p className="text-[#3CCB7F]">✓ All actions require human approval</p>
                  </div>
                  <div className="p-3 bg-[#00A3FF]/10 border border-[#00A3FF]/30">
                    <p className="text-[#00A3FF]">ℹ Reasoning logs available for audit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px] lg:py-[120px]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl lg:text-4xl font-semibold">{t.cta.title}</h2>
            <p className="text-[#8B949E] text-lg">{t.cta.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link href="/demo" className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center hover:bg-[#33B5FF] transition-colors">Request Demo</Link>
              <Link href="#contact" className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center hover:bg-[#00A3FF]/10 transition-colors">{t.cta.contact}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] pt-16 pb-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#1F242C]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">IV</div>
                <span className="text-lg font-semibold">IVYAR</span>
              </div>
              <p className="text-sm text-[#8B949E]">{t.footer.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['ISO 27001', 'SOC 2', 'GDPR', 'IRAP'].map((cert, i) => (
                  <span key={i} className="text-[10px] font-semibold text-[#00A3FF] bg-[#00A3FF]/10 px-2 py-1">{cert}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{t.footer.platform}</h4>
              <div className="flex flex-col gap-3">
                {['Dashboard', 'AI Operations', 'Documentation', 'API Reference'].map((link, i) => (
                  <Link key={i} href="/hbs" className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{t.footer.modules}</h4>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Procurement', href: '/modules/procurement' },
                  { name: 'Logistics', href: '/modules/logistics' },
                  { name: 'Donor Dashboard', href: '/modules/donor-dashboard' },
                  { name: 'HBS Module', href: '/hbs' }
                ].map((link, i) => (
                  <Link key={i} href={link.href} className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link.name}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{t.footer.company}</h4>
              <div className="flex flex-col gap-3">
                {['About IVYAR', 'Contact', 'Careers', 'Press'].map((link, i) => (
                  <Link key={i} href="#" className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-[#6E7681]">{t.footer.copyright}</span>
            <span className="text-sm text-[#6E7681]">{t.footer.nato}</span>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AutopilotWidget module="general" />


      <style jsx global>{`
        @keyframes breathing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 163, 255, 0.15); }
          50% { box-shadow: 0 0 12px 0 rgba(0, 163, 255, 0.35); }
        }
      `}</style>
    </div>
  );
}