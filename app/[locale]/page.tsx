// app/[locale]/page.tsx
'use client';

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

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={locale.dir}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href={`/${locale.code}`} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">
              IV
            </div>
            <span className="text-lg font-semibold hidden sm:block">IVYAR</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
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

          <div className="flex items-center gap-3">
            <GlobalSearch />
            <LocaleSwitcher />
            
            <div className="hidden lg:flex items-center gap-2 px-3 h-8 bg-[#3CCB7F]/10">
              <span className="w-2 h-2 bg-[#3CCB7F] rounded-full animate-pulse" />
              <span className="text-xs font-medium text-[#3CCB7F]">{t('common.status.operational')}</span>
            </div>
            
            <Link 
              href={`/${locale.code}/demo`}
              className="hidden sm:flex h-11 px-5 bg-gradient-to-r from-[#00A3FF] to-[#0077CC] text-white font-medium text-sm items-center gap-2 hover:from-[#33B5FF] hover:to-[#0088DD] transition-all"
            >
              {t('nav.demo')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M11 17l-5-5m0 0l5-5m-5 5h12" : "M13 7l5 5m0 0l-5 5m5-5H6"} />
              </svg>
            </Link>
            
            <Link 
              href={`/${locale.code}/hbs`}
              className="h-11 px-5 bg-[#1F242C] border border-[#3D444D] text-[#E6EDF3] font-medium text-sm flex items-center hover:bg-[#2D333B] transition-colors"
            >
              {t('nav.portal')}
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
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{locale.flag}</span>
                  <span className="text-sm text-[#8B949E]">{locale.name}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[56px] font-semibold leading-[1.1] tracking-[-0.02em]">
                  {t('hero.title')}
                </h1>
                <p className="text-base lg:text-lg text-[#8B949E] leading-relaxed max-w-xl">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/${locale.code}/hbs`}
                  className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center justify-center hover:bg-[#33B5FF] transition-colors"
                >
                  {t('hero.cta.portal')}
                </Link>
                <Link 
                  href="#modules" 
                  className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center justify-center hover:bg-[#00A3FF]/10 transition-colors"
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
      <section className="py-12 bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <span className="text-xs font-medium text-[#6E7681] uppercase tracking-wider">
              {t('trusted.label')}
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
              <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">
                {t('modules.title')}
              </span>
              <h2 className="text-2xl lg:text-4xl font-semibold">{t('modules.subtitle')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULE_META.map((mod, i) => (
                <a href={mod.href} key={i} className="bg-[#161B22] border border-[#1F242C] p-6 flex flex-col gap-4 hover:border-[#00A3FF] transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-[#00A3FF]/10 flex items-center justify-center text-2xl">{mod.icon}</div>
                    <span className={`text-[11px] font-semibold uppercase px-2 h-[22px] flex items-center ${
                      mod.status === 'live' || mod.status === 'core' ? 'bg-[#3CCB7F]/15 text-[#3CCB7F]' :
                      mod.status === 'pilot' || mod.status === 'beta' ? 'bg-[#FFB84D]/15 text-[#FFB84D]' :
                      mod.status === 'dev' ? 'bg-[#00A3FF]/15 text-[#00A3FF]' : 'bg-[#8B949E]/15 text-[#8B949E]'
                    }`}>
                      {t(`common.status.${mod.status}` as any) || mod.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">
                    {t(`modules.${mod.key}` as any)}
                  </h3>
                  <p className="text-sm text-[#8B949E] flex-1">
                    {t(`modules.${mod.key}.desc` as any)}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#1F242C]">
                    <span className="text-xs text-[#6E7681]">{mod.apis} {t('modules.endpoints')}</span>
                    <span className="text-sm font-medium text-[#00A3FF] group-hover:translate-x-1 transition-transform">
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
      <section id="ai" className="py-[80px] lg:py-[120px] bg-[#161B22] border-y border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-medium text-[#00A3FF] uppercase tracking-wider">
                  {t('ai.badge')}
                </span>
                <h2 className="text-2xl lg:text-4xl font-semibold">{t('ai.title')}</h2>
                <p className="text-[#8B949E] leading-relaxed">
                  {t('ai.desc')}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {[t('ai.feature1'), t('ai.feature2'), t('ai.feature3')].map((feature, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 bg-[#00A3FF]/5 ${isRTL ? 'border-r-2' : 'border-l-2'} border-[#00A3FF]`}>
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
            <h2 className="text-2xl lg:text-4xl font-semibold">{t('cta.title')}</h2>
            <p className="text-[#8B949E] text-lg">{t('cta.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link 
                href={`/${locale.code}/demo`}
                className="h-[52px] px-8 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center hover:bg-[#33B5FF] transition-colors"
              >
                {t('cta.demo')}
              </Link>
              <Link 
                href="#contact" 
                className="h-[52px] px-8 border border-[#00A3FF] text-[#00A3FF] font-medium flex items-center hover:bg-[#00A3FF]/10 transition-colors"
              >
                {t('cta.contact')}
              </Link>
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
              <p className="text-sm text-[#8B949E]">{t('footer.tagline')}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['ISO 27001', 'SOC 2', 'GDPR', 'IRAP'].map((cert, i) => (
                  <span key={i} className="text-[10px] font-semibold text-[#00A3FF] bg-[#00A3FF]/10 px-2 py-1">{cert}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{t('footer.platform')}</h4>
              <div className="flex flex-col gap-3">
                {['Dashboard', 'AI Operations', 'Documentation', 'API Reference'].map((link, i) => (
                  <Link key={i} href={`/${locale.code}/hbs`} className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{t('footer.modules')}</h4>
              <div className="flex flex-col gap-3">
                {['Procurement', 'Logistics', 'Donor Dashboard', 'HBS Module'].map((link, i) => (
                  <Link key={i} href={`/${locale.code}/hbs`} className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{t('footer.company')}</h4>
              <div className="flex flex-col gap-3">
                {['About IVYAR', 'Contact', 'Careers', 'Press'].map((link, i) => (
                  <Link key={i} href="#" className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">{link}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-[#6E7681]">{t('footer.copyright')}</span>
            <span className="text-sm text-[#6E7681]">{t('footer.nato')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
