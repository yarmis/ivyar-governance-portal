'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

export function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname?.split('/')[1] || 'us';
  const currentLang = locales.find(l => l.code === currentLocale) || locales[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.code.toUpperCase()}</span>
        <span className="text-xs">▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-[#1A1D1F] border border-white/10 rounded-lg p-2 min-w-[200px] max-h-[400px] overflow-y-auto z-50 shadow-2xl">
          {locales.slice(0, 3).map(lang => (
            <Link
              key={lang.code}
              href={`/${lang.code}`}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-white/10 text-left transition-all ${
                currentLocale === lang.code ? 'bg-[#3A8DFF]/20 text-[#3A8DFF]' : ''
              }`}
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
