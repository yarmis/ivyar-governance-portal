// i18n/config.ts
// IVYAR Internationalization Configuration

export const locales = [
  // English variants
  { code: 'us', name: 'United States', lang: 'en', flag: '🇺🇸', dir: 'ltr' },
  { code: 'gb', name: 'United Kingdom', lang: 'en', flag: '🇬🇧', dir: 'ltr' },
  { code: 'eu', name: 'European Union', lang: 'en', flag: '🇪🇺', dir: 'ltr' },
  
  // Western Europe
  { code: 'de', name: 'Germany', lang: 'de', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'France', lang: 'fr', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spain', lang: 'es', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', name: 'Italy', lang: 'it', flag: '🇮🇹', dir: 'ltr' },
  { code: 'pl', name: 'Poland', lang: 'pl', flag: '🇵🇱', dir: 'ltr' },
  
  // Eastern Europe
  { code: 'ua', name: 'Ukraine', lang: 'uk', flag: '🇺🇦', dir: 'ltr' },
  { code: 'cz', name: 'Czech Republic', lang: 'cs', flag: '🇨🇿', dir: 'ltr' },
  { code: 'bg', name: 'Bulgaria', lang: 'bg', flag: '🇧🇬', dir: 'ltr' },
  { code: 'rs', name: 'Serbia', lang: 'sr', flag: '🇷🇸', dir: 'ltr' },
  { code: 'al', name: 'Albania', lang: 'sq', flag: '🇦🇱', dir: 'ltr' },
  
  // Baltic States
  { code: 'lv', name: 'Latvia', lang: 'lv', flag: '🇱🇻', dir: 'ltr' },
  { code: 'lt', name: 'Lithuania', lang: 'lt', flag: '🇱🇹', dir: 'ltr' },
  { code: 'ee', name: 'Estonia', lang: 'et', flag: '🇪🇪', dir: 'ltr' },
  
  // Caucasus & Central Asia
  { code: 'ge', name: 'Georgia', lang: 'ka', flag: '🇬🇪', dir: 'ltr' },
  { code: 'am', name: 'Armenia', lang: 'hy', flag: '🇦🇲', dir: 'ltr' },
  { code: 'kz', name: 'Kazakhstan', lang: 'kk', flag: '🇰🇿', dir: 'ltr' },
  { code: 'tr', name: 'Turkey', lang: 'tr', flag: '🇹🇷', dir: 'ltr' },
  
  // Middle East
  { code: 'il', name: 'Israel', lang: 'he', flag: '🇮🇱', dir: 'rtl' },
  { code: 'sa', name: 'Saudi Arabia', lang: 'ar', flag: '🇸🇦', dir: 'rtl' },
  
  // Asia
  { code: 'jp', name: 'Japan', lang: 'ja', flag: '🇯🇵', dir: 'ltr' },
  { code: 'kr', name: 'South Korea', lang: 'ko', flag: '🇰🇷', dir: 'ltr' },
  { code: 'cn', name: 'China', lang: 'zh', flag: '🇨🇳', dir: 'ltr' },
] as const;

export type LocaleCode = typeof locales[number]['code'];
export type LanguageCode = typeof locales[number]['lang'];

export const defaultLocale: LocaleCode = 'us';

export const localeCodes = locales.map(l => l.code);

export function getLocaleByCode(code: string) {
  return locales.find(l => l.code === code) || locales.find(l => l.code === defaultLocale)!;
}

export function getLocaleByLang(lang: string) {
  return locales.find(l => l.lang === lang) || locales.find(l => l.code === defaultLocale)!;
}

// Language names in their native form
export const nativeNames: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
  uk: 'Українська',
  cs: 'Čeština',
  bg: 'Български',
  sr: 'Српски',
  sq: 'Shqip',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  et: 'Eesti',
  ka: 'ქართული',
  hy: 'Հայերեն',
  kk: 'Қазақша',
  tr: 'Türkçe',
  he: 'עברית',
  ar: 'العربية',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
};
