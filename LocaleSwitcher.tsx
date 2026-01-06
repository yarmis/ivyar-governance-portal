// components/LocaleSwitcher.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation, useLocales } from '@/i18n';

export function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, isRTL } = useTranslation();
  const { locales, getLocalePath } = useLocales();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group locales by region
  const regions = {
    'English': locales.filter(l => l.lang === 'en'),
    'Western Europe': locales.filter(l => ['de', 'fr', 'es', 'it'].includes(l.lang)),
    'Eastern Europe': locales.filter(l => ['pl', 'uk', 'cs', 'bg', 'sr', 'sq'].includes(l.lang)),
    'Baltic': locales.filter(l => ['lv', 'lt', 'et'].includes(l.lang)),
    'Caucasus & Central Asia': locales.filter(l => ['ka', 'hy', 'kk', 'tr'].includes(l.lang)),
    'Middle East': locales.filter(l => ['he', 'ar'].includes(l.lang)),
    'Asia': locales.filter(l => ['ja', 'ko', 'zh'].includes(l.lang)),
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#161B22] border border-[#1F242C] hover:border-[#3D444D] rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{locale.flag}</span>
        <span className="text-sm font-medium text-[#E6EDF3] hidden sm:inline">{locale.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-[#8B949E] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-[320px] max-h-[70vh] overflow-y-auto bg-[#161B22] border border-[#1F242C] rounded-xl shadow-2xl z-50`}
          role="listbox"
        >
          <div className="p-3 border-b border-[#1F242C]">
            <p className="text-xs font-medium text-[#6E7681] uppercase tracking-wider">Select Region</p>
          </div>

          <div className="p-2">
            {Object.entries(regions).map(([regionName, regionLocales]) => (
              regionLocales.length > 0 && (
                <div key={regionName} className="mb-3">
                  <p className="px-2 py-1 text-[10px] font-semibold text-[#6E7681] uppercase tracking-wider">
                    {regionName}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {regionLocales.map((l) => (
                      <Link
                        key={l.code}
                        href={getLocalePath(l.code, pathname)}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          locale.code === l.code
                            ? 'bg-[#00A3FF]/10 text-[#00A3FF]'
                            : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F242C]'
                        }`}
                        role="option"
                        aria-selected={locale.code === l.code}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span className="text-sm font-medium truncate">{l.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LocaleSwitcher;
