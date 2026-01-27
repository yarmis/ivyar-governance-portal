'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from '@/i18n/useTranslation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'us';
  const { t } = useTranslation(locale);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setLangOpen(false);
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const langs = [
    { code: 'us', flag: '🇺🇸', name: 'English' },
    { code: 'ua', flag: '🇺🇦', name: 'Українська' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
  ];

  const currentLang = langs.find(l => l.code === locale) || langs[0];

  const sections = [
    {
      title: 'Governance & Oversight',
      modules: [
        { icon: '👁️', title: 'Transparency Hub', desc: 'Real-time visibility into all government decisions', status: 'Live' },
        { icon: '🤖', title: 'AI Administrator', desc: 'Ethical AI-assisted decision support', status: 'Live' },
        { icon: '📋', title: 'Compliance Engine', desc: 'Automated regulatory compliance', status: 'Pilot' },
        { icon: '🔍', title: 'Audit Trail Engine', desc: 'Immutable records of activities', status: 'Live' },
      ]
    },
    {
      title: 'Identity, Access & Security',
      modules: [
        { icon: '🔐', title: 'Identity & Access', desc: 'Secure authentication and role-based access', status: 'Live' },
        { icon: '🛡️', title: 'Insurance & Risk', desc: 'Institutional risk assessment', status: 'Live' },
        { icon: '💳', title: 'Payments Security', desc: 'Secure cross-border payments', status: 'Live' },
      ]
    },
    {
      title: 'Operations & Logistics',
      modules: [
        { icon: '🚚', title: 'Logistics Engine', desc: 'Supply chain visibility', status: 'Pilot' },
        { icon: '🚑', title: 'Emergency Services', desc: 'Crisis response coordination', status: 'Live' },
        { icon: '🚗', title: 'Fleet Management', desc: 'Vehicle tracking and optimization', status: 'Pilot' },
        { icon: '📦', title: 'Warehousing', desc: 'Inventory management', status: 'Live' },
        { icon: '✈️', title: 'Freight Coordination', desc: 'Multi-modal freight tracking', status: 'Live' },
      ]
    },
    {
      title: 'Social & Human Services',
      modules: [
        { icon: '🎖️', title: 'Veterans Services', desc: 'Support for military veterans', status: 'Live' },
        { icon: '🏥', title: 'Healthcare Services', desc: 'Medical services coordination', status: 'Live' },
        { icon: '👥', title: 'Citizen Services', desc: 'Public-facing government portal', status: 'Pilot' },
        { icon: '🎓', title: 'Education Services', desc: 'Student records management', status: 'Dev' },
        { icon: '💰', title: 'Benefits Distribution', desc: 'Social benefits payment', status: 'Live' },
      ]
    },
    {
      title: 'Finance & Procurement',
      modules: [
        { icon: '🏛️', title: 'Procurement Engine', desc: 'Transparent tender management', status: 'Live' },
        { icon: '💵', title: 'Payments', desc: 'Government payment processing', status: 'Live' },
        { icon: '📊', title: 'Donor Dashboard', desc: 'Real-time donor visibility', status: 'Live' },
        { icon: '📈', title: 'Fiscal Planning', desc: 'Budget planning and forecasting', status: 'Pilot' },
      ]
    },
  ];

  const allModules = sections.flatMap(s => s.modules);
  const searchResults = searchQuery.length >= 2 
    ? allModules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const statusColors = {
    'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Pilot': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Dev': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}/>
      </div>

      <header className="sticky top-0 z-30 bg-[rgba(11,14,17,0.85)] backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-3 text-white no-underline font-semibold text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-[#10B9B9] to-[#4FD1C5] rounded-lg flex items-center justify-center font-bold">IV</div>
            IVYAR
          </a>
          
          <div className="flex gap-4 items-center">
            <a href={`/${locale}/hbs`} className="px-4 py-2 text-sm text-white/80 hover:text-white transition no-underline">
              Portal
            </a>
            <a href={`/${locale}/hbs/autopilot`} className="px-4 py-2 text-sm text-white/80 hover:text-white transition no-underline">
              Autopilot
            </a>
            
            <button type="button" onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition">
              🔍 <span className="hidden sm:inline text-sm">Search</span> <span className="text-xs bg-white/10 px-2 py-0.5 rounded">⌘K</span>
            </button>

            <div className="relative">
              <button type="button" onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition">
                <span>{currentLang.flag}</span>
                <span className="font-medium text-sm">{currentLang.code.toUpperCase()}</span>
                <span className="text-xs">▼</span>
              </button>
              
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#0B0E11] border border-white/10 rounded p-2 min-w-[180px] shadow-2xl">
                  {langs.map(lang => (
                    <a key={lang.code} href={`/${lang.code}`} className={`flex items-center gap-3 px-3 py-2 rounded no-underline transition ${lang.code === locale ? 'bg-[#10B9B9]/20 text-[#10B9B9]' : 'text-white/65 hover:bg-white/10'}`}>
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative max-w-[1120px] mx-auto px-8 pt-32 pb-24">
        <p className="text-xs uppercase tracking-wider text-white/65 mb-4">NATO-Aligned • World Bank Ready • USAID Compatible</p>
        <h1 className="text-5xl md:text-6xl font-semibold mb-6 leading-tight">
          {t?.hero?.title || 'IVYAR Governance Platform'}
        </h1>
        <p className="text-lg md:text-xl text-white/65 max-w-3xl mb-8">
          {t?.hero?.subtitle || 'Ethical, transparent, AI-aligned infrastructure for governments, donors, and international partners'}
        </p>
        <div className="flex gap-4">
          <a href="/demo" className="px-6 py-3 bg-[#10B9B9] text-white rounded font-medium hover:bg-[#0EA3A3] transition no-underline">
            {t?.hero?.cta || 'Request Demo'}
          </a>
          <a href={`/${locale}/hbs`} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition no-underline">
            {t?.hero?.explore || 'Explore Portal'}
          </a>
          <a href={`/${locale}/hbs/autopilot`} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition no-underline">
            🤖 Autopilot
          </a>
        </div>
      </section>

      <div className="max-w-[1120px] mx-auto px-8 space-y-28 pb-24">
        {sections.map((section, idx) => (
          <section key={idx}>
            <div className="mb-8">
              <div className="w-16 h-0.5 bg-[#10B9B9] mb-4"/>
              <h2 className="text-3xl font-semibold mb-2">{section.title}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.modules.map((module, midx) => (
                <div key={midx} className="bg-white/[0.03] border border-white/10 rounded-lg p-5 hover:bg-white/[0.05] hover:border-[#10B9B9]/60 hover:shadow-[0_0_24px_rgba(16,185,185,0.35)] hover:scale-[1.01] transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{module.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[module.status as keyof typeof statusColors]}`}>
                      {module.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#10B9B9] transition">{module.title}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{module.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-white/10 mt-24 pt-12 pb-8">
        <div className="max-w-[1120px] mx-auto px-8 text-center text-sm text-white/65">
          <p>© 2024-2026 IVYAR Platform • NATO-Aligned • Multi-Region Infrastructure</p>
          <p className="mt-2">Built in the United States 🇺🇸 • Inspired by Ukraine 🇺🇦</p>
        </div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-start justify-center pt-[10vh]" onClick={() => setSearchOpen(false)}>
          <div className="w-[90%] max-w-2xl bg-[#0B0E11] border border-white/10 rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search modules..." className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded text-white outline-none focus:border-[#10B9B9] transition" autoFocus />
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {searchQuery.length < 2 ? (
                <div className="p-8 text-center text-white/65">
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="font-medium mb-2">Search IVYAR Platform</div>
                  <div className="text-sm">Type 2+ characters</div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-white/65">
                  <div className="text-4xl mb-4">❌</div>
                  <div className="font-medium">No results</div>
                </div>
              ) : (
                searchResults.map((r, i) => (
                  <div key={i} className="p-4 rounded hover:bg-white/10 cursor-pointer mb-2">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{r.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{r.title}</div>
                        <div className="text-sm text-white/65">{r.desc}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
