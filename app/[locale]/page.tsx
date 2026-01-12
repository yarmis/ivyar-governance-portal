// app/[locale]/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { GlobalSearch } from '@/components/GlobalSearch';

const MODULE_META = [
  { icon: '📋', status: 'live', apis: 18, key: 'procurement', href: '/modules/procurement' },
  { icon: '🚚', status: 'pilot', apis: 14, key: 'logistics', href: '/modules/logistics' },
  { icon: '🤝', status: 'design', apis: 12, key: 'donor', href: '/modules/donor-dashboard' },
  { icon: '🗄️', status: 'dev', apis: 10, key: 'data', href: '/modules/data-platform' },
  { icon: '🏛️', status: 'core', apis: 8, key: 'hbs', href: '/hbs' },
  { icon: '🤖', status: 'beta', apis: 5, key: 'ai', href: '/modules/ai-services' },
  { icon: '🏪', status: 'live', apis: 12, key: 'trade', href: '/modules/trade' },
  { icon: '🛡️', status: 'live', apis: 10, key: 'insurance', href: '/modules/insurance' },
  { icon: '💳', status: 'live', apis: 8, key: 'payments', href: '/modules/payments' },
  { icon: '🏗️', status: 'pilot', apis: 14, key: 'reconstruction', href: '/modules/reconstruction' },
  { icon: '🚛', status: 'live', apis: 10, key: 'freight', href: '/modules/freight' },
];

const PARTNERS = ['NATO', 'World Bank', 'USAID', 'European Commission', 'Government of Canada'];

export default function LocalizedLandingPage() {
  const { t, locale, isRTL } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={locale.dir}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale.code}`} className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm sm:text-base">
              IV
            </div>
            <span className="text-base sm:text-lg font-semibold">IVYAR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="#modules" className="text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
              {t('nav.modules')}
            </Link>
            <Link href="#ai" className="text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
              {t('nav.ai')}
            </Link>
            <Link href="#about" className="text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors">
              {t('nav.about')}
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <GlobalSearch />
            <LocaleSwitcher />
            
            <div className="hidden lg:flex items-center gap-2 px-3 h-8 bg-[#3CCB7F]/10">
              <span className="w-2 h-2 bg-[#3CCB7F] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-[#3CCB7F]">{t('common.status.operational')}</span>
            </div>
            
            <Link 
              href={`/${locale.code}/demo`}
              className="h-10 lg:h-11 px-4 lg:px-5 bg-gradient-to-r from-[#00A3FF] to-[#0077CC] text-white font-medium text-sm flex items-center gap-2 hover:from-[#33B5FF] hover:to-[#0088DD] transition-all"
            >
              {t('nav.demo')}
              <svg className="w-4 h-4 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M11 17l-5-5m0 0l5-5m-5 5h12" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
              </svg>
            </Link>
            
            <Link 
              href={`/${locale.code}/hbs`}
              className="h-10 lg:h-11 px-4 lg:px-5 bg-[#1F242C] border border-[#3D444D] text-[#E6EDF3] font-medium text-sm flex items-center hover:bg-[#2D333B] transition-colors"
            >
              {t('nav.portal')}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#8B949E] hover:text-white hover:bg-[#1F242C] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-2 bg-[#0D1117] border-t border-[#1F242C]">
            <GlobalSearch />
            
            <div className="pt-2 space-y-1">
              <Link 
                href="#modules" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F242C] rounded-lg"
              >
                {t('nav.modules')}
              </Link>
              <Link 
                href="#ai" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F242C] rounded-lg"
              >
                {t('nav.ai')}
              </Link>
              <Link 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F242C] rounded-lg"
              >
                {t('nav.about')}
              </Link>
            </div>

            <div className="pt-4 space-y-2 border-t border-[#1F242C]">
              <Link 
                href={`/${locale.code}/demo`}
                className="w-full h-12 px-4 bg-gradient-to-r from-[#00A3FF] to-[#0077CC] text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                {t('nav.demo')}
              </Link>
              <Link 
                href={`/${locale.code}/hbs`}
                className="w-full h-12 px-4 bg-[#1F242C] border border-[#3D444D] text-[#E6EDF3] font-medium text-sm flex items-center justify-center"
              >
                {t('nav.portal')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-[160px] lg:pb-[120px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{locale.flag}</span>
                  <span className="text-xs sm:text-sm text-[#8B949E]">{locale.name}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-[56px] font-semibold leading-[1.1] tracking-[-0.02em]">
                  {t('hero.title')}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#8B949E] leading-relaxed max-w-xl">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href={`/${locale.code}/hbs`}
                  className="h-12 sm:h-[52px] px-6 sm:px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center justify-center hover:bg-[#33B5FF] transition-colors"
                >
                  {t('hero.cta.portal')}
                </Link>
                <Link 
                  href="#modules" 
                  className="h-12 sm:h-[52px] px-6 sm:px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center justify-center hover:bg-[#00A3FF]/10 transition-colors"
                >
                  {t('hero.cta.modules')}
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full h-[400px] bg-[#161B22] border border-[#1F242C] relative overflow-hidden">
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex gap-2`}>
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
                </div>
                <div className={`absolute top-12 ${isRTL ? 'right-4 left-4 text-right' : 'left-4 right-4'} font-mono text-sm`}>
                  <p className="text-[#6E7681]">$ ivyar initialize --platform gov-cloud</p>
                  <p className="text-[#3CCB7F] mt-2">✓ IVYAR GOVERNANCE PLATFORM v3.0</p>
                  <p className="text-[#8B949E] mt-1">✓ 12 modules loaded</p>
                  <p className="text-[#8B949E]">✓ 25 regions active</p>
                  <p className="text-[#8B949E]">✓ AI Administrator online</p>
                  <p className="text-[#00A3FF] mt-4 animate-pulse">Ready for operations_</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 sm:py-12 bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <span className="text-[10px] sm:text-xs font-medium text-[#6E7681] uppercase tracking-wider">
              {t('trusted.label')}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12">
              {PARTNERS.map((partner, i) => (
                <span key={i} className="text-[#6E7681] text-xs sm:text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-16 sm:py-20 lg:py-[120px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-8 sm:gap-12">
            <div className="flex flex-col gap-3 sm:gap-4 text-center max-w-2xl mx-auto">
              <span className="text-[10px] sm:text-xs font-medium text-[#00A3FF] uppercase tracking-wider">
                {t('modules.title')}
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold">{t('modules.subtitle')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {MODULE_META.map((mod, i) => (
                <a href={mod.href} key={i} className="bg-[#161B22] border border-[#1F242C] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 hover:border-[#00A3FF] transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00A3FF]/10 flex items-center justify-center text-xl sm:text-2xl">{mod.icon}</div>
                    <span className={`text-[10px] sm:text-[11px] font-semibold uppercase px-2 h-5 sm:h-[22px] flex items-center ${
                      mod.status === 'live' || mod.status === 'core' ? 'bg-[#3CCB7F]/15 text-[#3CCB7F]' :
                      mod.status === 'pilot' || mod.status === 'beta' ? 'bg-[#FFB84D]/15 text-[#FFB84D]' :
                      mod.status === 'dev' ? 'bg-[#00A3FF]/15 text-[#00A3FF]' : 'bg-[#8B949E]/15 text-[#8B949E]'
                    }`}>
                      {t(`common.status.${mod.status}` as any) || mod.status}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    {t(`modules.${mod.key}` as any)}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8B949E] flex-1 line-clamp-2">
                    {t(`modules.${mod.key}.desc` as any)}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#1F242C]">
                    <span className="text-[10px] sm:text-xs text-[#6E7681]">{mod.apis} {t('modules.endpoints')}</span>
                    <span className="text-xs sm:text-sm font-medium text-[#00A3FF] group-hover:translate-x-1 transition-transform">
                      {t('modules.learnMore')} →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Administrator */}
      <section id="ai" className="py-16 sm:py-20 lg:py-[120px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <span className="text-[10px] sm:text-xs font-medium text-[#00A3FF] uppercase tracking-wider">
                  AI Administrator
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold">Ethical AI Governance</h2>
                <p className="text-sm sm:text-base text-[#8B949E] leading-relaxed">
                  AI-powered decision support with full transparency and human oversight.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-4">
                {['Human-in-the-loop approval', 'Full audit trail', 'Explainable decisions'].map((feature, i) => (
                  <div key={i} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[#00A3FF]/5 ${isRTL ? 'border-r-2' : 'border-l-2'} border-[#00A3FF]`}>
                    <span className="text-[#00A3FF] font-bold">✓</span>
                    <span className="text-sm sm:text-[15px]">{feature}</span>
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


      {/* ========================================== */}
      {/* TEAM OS SECTION - Internal Operations      */}
      {/* ========================================== */}
      <section id="team-os" className="py-24 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
              <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Internal Operations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Team Operating System</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Operational foundation and cultural principles for world-class execution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <a href="/team-os/leadership-principles" className="group bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-[#00A3FF] transition-all cursor-pointer">
              <div className="text-4xl mb-4">🧭</div>
              <h3 className="text-xl font-semibold group-hover:text-[#00A3FF] transition-colors mb-2">Leadership Principles</h3>
              <p className="text-sm text-gray-400 mb-4">7 principles that define how we work</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-[#00A3FF] transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a href="/team-os/dri-handbook" className="group bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-[#00A3FF] transition-all cursor-pointer">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold group-hover:text-[#00A3FF] transition-colors mb-2">DRI Handbook</h3>
              <p className="text-sm text-gray-400 mb-4">Ownership model and responsibilities</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-[#00A3FF] transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a href="/team-os/operational-rhythm" className="group bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-[#00A3FF] transition-all cursor-pointer">
              <div className="text-4xl mb-4">🕐</div>
              <h3 className="text-xl font-semibold group-hover:text-[#00A3FF] transition-colors mb-2">Operational Rhythm</h3>
              <p className="text-sm text-gray-400 mb-4">Daily and weekly cadence</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-[#00A3FF] transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a href="/team-os/kickoff-script" className="group bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-[#00A3FF] transition-all cursor-pointer">
              <div className="text-4xl mb-4">▶️</div>
              <h3 className="text-xl font-semibold group-hover:text-[#00A3FF] transition-colors mb-2">Kickoff Script</h3>
              <p className="text-sm text-gray-400 mb-4">30-minute meeting template</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-[#00A3FF] transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a href="/team-os/team-charter" className="group bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-[#00A3FF] transition-all cursor-pointer">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-xl font-semibold group-hover:text-[#00A3FF] transition-colors mb-2">Team Charter</h3>
              <p className="text-sm text-gray-400 mb-4">Mission, values, and standards</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-[#00A3FF] transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a href="/team-os/dashboard" className="group bg-[#161B22] border border-[#30363D] rounded-lg p-6 hover:border-[#00A3FF] transition-all cursor-pointer">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold group-hover:text-[#00A3FF] transition-colors mb-2">Dashboard</h3>
              <p className="text-sm text-gray-400 mb-4">Critical Path and Red Flags monitoring</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-[#00A3FF] transition-colors">
                <span>Learn more</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
          <div className="text-center">
            <a href="/team-os" className="inline-flex items-center gap-2 text-[#00A3FF] hover:underline text-lg font-medium">
              <span>View Full Team Operating System</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>


      {/* ========================================== */}
      {/* QUANTUM SECURITY SECTION                   */}
      {/* ========================================== */}
      <section id="quantum-security" className="py-24 bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
              <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                Post-Quantum Cryptography
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Quantum-Resistant Security
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Future-proof protection using NIST-approved algorithms resistant to quantum computing attacks
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* CRYSTALS-Kyber */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">CRYSTALS-Kyber</h3>
              </div>
              <p className="text-gray-400 mb-4">
                NIST-standardized key encapsulation mechanism for secure key exchange
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Protects API authentication between nations</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secures sensitive financial data at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Hybrid mode with classical encryption</span>
                </li>
              </ul>
            </div>

            {/* CRYSTALS-Dilithium */}
            <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold">CRYSTALS-Dilithium</h3>
              </div>
              <p className="text-gray-400 mb-4">
                NIST-standardized digital signature scheme for long-term document integrity
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Signs contracts and tenders (50+ year validity)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Ensures immutability of audit trails</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verifiable by any party without trust</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Why It Matters */}
          <div className="bg-[#0D1117] border border-purple-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Why Quantum-Resistant Cryptography Matters for Governance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400">
              <div>
                <h4 className="font-semibold text-white mb-2">⏳ "Harvest Now, Decrypt Later" Threat</h4>
                <p className="text-sm">
                  Adversaries are already capturing encrypted government data today, waiting for quantum computers powerful enough to break current encryption in 10-15 years.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📜 Long-Term Document Validity</h4>
                <p className="text-sm">
                  Contracts, treaties, and procurement records must remain legally valid and tamper-proof for 50+ years, outlasting classical cryptography's security guarantees.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🌍 Cross-Border Trust</h4>
                <p className="text-sm">
                  International cooperation requires cryptographic standards that all nations trust will remain secure against emerging quantum threats.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✅ NIST Standardization (2024)</h4>
                <p className="text-sm">
                  CRYSTALS-Kyber and CRYSTALS-Dilithium are officially standardized by NIST, ensuring global interoperability and regulatory compliance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-[120px]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold">Ready to Transform Governance?</h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#8B949E]">Join leading institutions using IVYAR</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
              <Link 
                href={`/${locale.code}/demo`}
                className="h-12 sm:h-[52px] px-6 sm:px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center justify-center hover:bg-[#33B5FF] transition-colors"
              >
                Request Demo
              </Link>
              <Link 
                href="#contact" 
                className="h-12 sm:h-[52px] px-6 sm:px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center justify-center hover:bg-[#00A3FF]/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] pt-12 sm:pt-16 pb-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 pb-8 sm:pb-12 border-b border-[#1F242C]">
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm sm:text-base">IV</div>
                <span className="text-base sm:text-lg font-semibold">IVYAR</span>
              </div>
              <p className="text-xs sm:text-sm text-[#8B949E]">Ethical AI Governance Platform</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['ISO 27001', 'SOC 2', 'GDPR', 'PQC Ready'].map((cert, i) => (
                  <span key={i} className="text-[9px] sm:text-[10px] font-semibold text-[#00A3FF] bg-[#00A3FF]/10 px-2 py-1">{cert}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <h4 className="text-xs sm:text-sm font-semibold">Platform</h4>
              <div className="flex flex-col gap-2 sm:gap-3">
                {['Dashboard', 'AI Operations', 'Documentation'].map((link, i) => (
                  <Link key={i} href={`/${locale.code}/hbs`} className="text-xs sm:text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <h4 className="text-xs sm:text-sm font-semibold">Modules</h4>
              <div className="flex flex-col gap-2 sm:gap-3">
                {['Procurement', 'Logistics', 'HBS Module'].map((link, i) => (
                  <Link key={i} href={`/${locale.code}/hbs`} className="text-xs sm:text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              <h4 className="text-xs sm:text-sm font-semibold">Company</h4>
              <div className="flex flex-col gap-2 sm:gap-3">
                {['About', 'Contact', 'Careers'].map((link, i) => (
                  <Link key={i} href="#" className="text-xs sm:text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <span className="text-xs sm:text-sm text-[#6E7681]">© 2024-2026 IVYAR. All rights reserved.</span>
            <span className="text-xs sm:text-sm text-[#6E7681]">NATO DIANA Approved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
