// i18n/useTranslation.ts
'use client';

import { useParams } from 'next/navigation';
import { translations, t as translate, TranslationKey } from './translations';
import { getLocaleByCode, locales, LocaleCode } from './config';

export function useTranslation() {
  const params = useParams();
  const localeCode = (params?.locale as string) || 'us';
  const locale = getLocaleByCode(localeCode);
  const lang = locale.lang;

  const t = (key: TranslationKey): string => {
    return translate(lang, key);
  };

  return {
    t,
    locale,
    localeCode,
    lang,
    dir: locale.dir,
    isRTL: locale.dir === 'rtl',
  };
}

// Hook for locale switcher
export function useLocales() {
  const { localeCode } = useTranslation();
  
  return {
    locales,
    currentLocale: localeCode,
    getLocalePath: (targetLocale: LocaleCode, currentPath: string) => {
      // Remove current locale from path and add new one
      const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '');
      return `/${targetLocale}${pathWithoutLocale || ''}`;
    },
  };
}
