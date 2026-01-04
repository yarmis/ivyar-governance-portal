'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'uk' as const, name: 'Українська', flag: '🇺🇦' },
  { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  { code: 'pl' as const, name: 'Polski', flag: '🇵🇱' },
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
      >
        <span className="text-lg">{current.flag}</span>
        <span className="text-sm font-medium">{current.code.toUpperCase()}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50 min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                className={'w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors ' + (language === lang.code ? 'bg-gray-700 text-white' : 'text-gray-300')}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {language === lang.code && <span className="ml-auto text-green-400">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}