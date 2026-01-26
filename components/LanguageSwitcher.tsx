'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LANGUAGES = [
  { code: 'us', label: 'EN', flag: '🇺🇸' },
  { code: 'ua', label: 'UA', flag: '🇺🇦' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'us';

  return (
    <div className="flex items-center gap-1 border border-border-subtle rounded-lg p-1">
      {LANGUAGES.map((lang) => {
        const segments = pathname?.split('/') || [];
        segments[1] = lang.code;
        const newPath = segments.join('/');
        
        return (
          <Link
            key={lang.code}
            href={newPath}
            className={`
              px-3 py-1.5 text-xs font-medium rounded transition-colors
              flex items-center gap-1.5
              ${
                currentLocale === lang.code
                  ? 'bg-accent-cyan/20 text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
              }
            `}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
