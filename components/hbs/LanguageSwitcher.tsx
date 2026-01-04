'use client';

import { usePathname, useRouter } from 'next/navigation';

const languages = [
  { code: 'en', name: 'US', flag: '🇺🇸' },
  { code: 'en', name: 'UK', flag: '🇬🇧' },
  { code: 'uk', name: 'UA', flag: '🇺🇦' },
  { code: 'de', name: 'DE', flag: '🇩🇪' },
  { code: 'fr', name: 'FR', flag: '🇫🇷' },
  { code: 'pl', name: 'PL', flag: '🇵🇱' },
  { code: 'es', name: 'ES', flag: '🇪🇸' },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentLang = () => {
    const match = pathname.match(/\/hbs\/([a-z]{2})/);
    return match ? match[1] : 'en';
  };

  const currentLang = getCurrentLang();

  const switchLanguage = (lang: string) => {
    const hasLang = /\/hbs\/[a-z]{2}/.test(pathname);
    if (hasLang) {
      router.push(pathname.replace(/\/hbs\/[a-z]{2}/, '/hbs/' + lang));
    } else {
      router.push('/hbs/' + lang);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.flag}
          onClick={() => switchLanguage(lang.code)}
          className={'px-2 py-1 rounded text-sm transition-colors ' + (currentLang === lang.code ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30')}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}