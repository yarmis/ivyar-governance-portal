'use client';

import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UA' },
];

export function LanguageSwitcher() {
  const [lang, setLang] = useState('en');

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
            lang === l.code
              ? 'bg-[#00A3FF]/20 text-[#00A3FF]'
              : 'text-[#8B949E] hover:text-[#E6EDF3]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
