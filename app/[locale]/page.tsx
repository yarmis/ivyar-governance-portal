'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { locales } from '@/i18n/config';
import { CORE_TRANSLATIONS, GB_TRANSLATIONS, EU_TRANSLATIONS } from '@/i18n/translations-core';
import { CORE_MODULES } from '@/i18n/modules-core';
import { loadTranslation, loadModules } from '@/i18n/dynamic-loader';

const catColors = {
  governance: { bg: 'from-[#3A8DFF]/10 to-[#3A8DFF]/5', badge: 'bg-[#3A8DFF]/20 text-[#3A8DFF]' },
  donor: { bg: 'from-[#4CD3C2]/10 to-[#4CD3C2]/5', badge: 'bg-[#4CD3C2]/20 text-[#4CD3C2]' },
  intelligence: { bg: 'from-[#3CCB7F]/10 to-[#3CCB7F]/5', badge: 'bg-[#3CCB7F]/20 text-[#3CCB7F]' },
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

export default function HomePage() {
  const params = useParams();
  const locale = (params.locale as string) || 'us';
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const langRef = useRef<HTMLDivElement>(null);
  
  // Translation state
  const [translations, setTranslations] = useState<any>(null);
  const [modules, setModules] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load translations on locale change
  useEffect(() => {
    async function loadLocaleData() {
      // Core languages - already loaded
      if (locale === 'us' || locale === 'gb' || locale === 'eu') {
        setTranslations(locale === 'us' ? CORE_TRANSLATIONS.us : GB_TRANSLATIONS);
        setModules(CORE_MODULES.us);
        return;
      }
      
      if (locale === 'ua') {
        setTranslations(CORE_TRANSLATIONS.ua);
        setModules(CORE_MODULES.ua);
        return;
      }
      
      if (locale === 'es') {
        setTranslations(CORE_TRANSLATIONS.es);
        setModules(CORE_MODULES.es);
        return;
      }
      
      // Dynamic languages - load on demand
      setLoading(true);
      const [translation, moduleData] = await Promise.all([
        loadTranslation(locale),
        loadModules(locale)
      ]);
      
      setTranslations(translation || CORE_TRANSLATIONS.us);
      setModules(moduleData || CORE_MODULES.us);
      setLoading(false);
    }
    
    loadLocaleData();
  }, [locale]);

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
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Fallback while loading
  const t = translations || CORE_TRANSLATIONS.us;
  const tm = modules || CORE_MODULES.us;

  const allModules = [...tm.governance, ...tm.donor, ...tm.intelligence];
  const searchResults = searchQuery.trim()
    ? allModules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allModules;

  const availableLocales = locales.filter(l => l.code === 'us' || l.code === 'ua' || l.code === 'es');
  const currentLang = availableLocales.find(l => l.code === locale) || availableLocales[0];

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0B0D0E]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#3A8DFF] to-[#4CD3C2] flex items-center justify-center font-bold text-sm sm:text-base">IV</div>
            <span className="font-bold text-lg sm:text-xl">IVYAR</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
              <span>🔍</span><span>{t.nav.search}</span><span className="text-xs text-white/40">⌘K</span>
            </button>
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                {currentLang.flag} {locale.toUpperCase()} ▼
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#1A1D1F] border border-white/10 rounded-lg p-2 min-w-[200px] z-50 shadow-2xl">
                  {availableLocales.map(lang => (
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <span className="text-xl">🔍</span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0B0D0E]">
            <div className="px-4 py-4 space-y-2">
              <div className="text-xs text-white/40 mb-2">{t.nav.menu}</div>
              {availableLocales.map(lang => (
                <a 
                  key={lang.code} 
                  href={`/${lang.code}`} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all ${locale === lang.code ? 'bg-[#3A8DFF]/20 text-[#3A8DFF]' : ''}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed top-20 right-4 bg-[#3A8DFF] text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Loading translations...
        </div>
      )}

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#3A8DFF]/10 border border-[#3A8DFF]/30 rounded-full text-[#4CD3C2] text-xs sm:text-sm font-semibold mb-4 sm:mb-6">{t.badge}</div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-[#3A8DFF] bg-clip-text text-transparent px-4">{t.hero.title}</h1>
        <p className="text-base sm:text-xl text-white/60 mb-3 sm:mb-4 max-w-3xl mx-auto px-4">{t.hero.subtitle}</p>
        <p className="text-xs sm:text-sm text-white/40 mb-8 sm:mb-12 px-4">{t.hero.origin}</p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12 px-4">{t.stats.title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[t.stats.uptime, t.stats.value, t.stats.jobs, t.stats.served].map((stat, i) => (
            <div key={i} className="p-5 sm:p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#3A8DFF] to-[#4CD3C2] bg-clip-text text-transparent mb-2">{stat.value}</div>
              <div className="font-semibold text-white/90 mb-1 text-sm sm:text-base">{stat.label}</div>
              <div className="text-xs sm:text-sm text-white/50">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 px-4">{t.modules.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {allModules.slice(0, 6).map((m, i) => (
            <button 
              key={i} 
              onClick={() => handleModuleClick(m)}
              className={`p-5 sm:p-6 bg-gradient-to-br ${catColors[m.cat as keyof typeof catColors].bg} border border-white/10 rounded-xl hover:border-white/20 transition-all text-left w-full cursor-pointer active:scale-[0.98]`}
            >
              <h4 className="font-semibold text-base sm:text-lg mb-2">{m.title}</h4>
              <p className="text-white/60 text-sm">{m.desc}</p>
            </button>
          ))}
        </div>
        <div className="text-center p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-white/80 text-sm sm:text-base"><strong>{t.note.title}</strong></p>
          <p className="text-white/40 text-xs sm:text-sm mt-1">{t.note.desc}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-[#3A8DFF]/10 to-[#4CD3C2]/10 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">{t.cta.title}</h2>
          <p className="text-base sm:text-xl text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">{t.cta.subtitle}</p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-col sm:flex-row px-4">
            <a href="/demo" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#3A8DFF] rounded-lg hover:bg-[#2E7FED] transition-all font-semibold shadow-lg text-center active:scale-[0.98]">
              {t.cta.demo} →
            </a>
            <a href="/contact" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all font-semibold text-center active:scale-[0.98]">
              {t.cta.contact}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#3A8DFF] to-[#4CD3C2] flex items-center justify-center font-bold text-sm sm:text-base">IV</div>
              <div className="text-center md:text-left">
                <div className="font-bold text-sm sm:text-base">IVYAR</div>
                <div className="text-xs sm:text-sm text-white/40">{t.footer.tagline}</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/60">
              <a href="/demo" className="hover:text-white transition-all">{t.footer.links.demo}</a>
              <a href="/docs" className="hover:text-white transition-all">{t.footer.links.docs}</a>
              <a href="/contact" className="hover:text-white transition-all">{t.footer.links.contact}</a>
              <a href="/privacy" className="hover:text-white transition-all">{t.footer.links.privacy}</a>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-white/40 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/5">
            {t.footer.copyright}
          </div>
        </div>
      </footer>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-20 sm:pt-32 px-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-[#1A1D1F] border border-white/10 rounded-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-3">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder={tm.search.placeholder} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="flex-1 bg-transparent text-white outline-none text-sm sm:text-base" 
                autoFocus 
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white">✕</button>}
            </div>
            {searchQuery && <div className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-white/40 border-b border-white/10">{searchResults.length} {tm.search.results}</div>}
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-2">
              {searchResults.length === 0 && searchQuery ? (
                <div className="p-6 sm:p-8 text-center text-white/40 text-sm">{tm.search.noResults}</div>
              ) : (
                searchResults.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => handleModuleClick(m)}
                    className="w-full text-left p-3 sm:p-4 hover:bg-white/5 rounded-lg cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div className="font-semibold text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: highlightText(m.title, searchQuery) }} />
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${catColors[m.cat as keyof typeof catColors].badge}`}>
                        {tm.categories[m.cat as keyof typeof tm.categories]}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-white/60" dangerouslySetInnerHTML={{ __html: highlightText(m.desc, searchQuery) }} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedModule(null)}>
          <div className={`bg-gradient-to-br ${catColors[selectedModule.cat as keyof typeof catColors].bg} border-2 border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <span className={`inline-block px-3 py-1 text-xs rounded-full ${catColors[selectedModule.cat as keyof typeof catColors].badge} mb-3`}>
                  {tm.categories[selectedModule.cat as keyof typeof tm.categories]}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">{selectedModule.title}</h2>
              </div>
              <button onClick={() => setSelectedModule(null)} className="text-white/40 hover:text-white text-2xl shrink-0">✕</button>
            </div>
            <p className="text-white/80 text-base sm:text-lg mb-6">{selectedModule.desc}</p>
            <button onClick={() => setSelectedModule(null)} className="w-full sm:w-auto px-6 py-3 bg-[#3A8DFF] rounded-lg hover:bg-[#2E7FED] transition-all active:scale-[0.98]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
