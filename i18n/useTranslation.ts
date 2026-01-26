'use client';

import { useParams } from 'next/navigation';
import { getLocaleByCode, locales, LocaleCode } from './config';
import { CORE_TRANSLATIONS } from './translations-core';
import { CORE_MODULES } from './modules-core';
import { useState, useEffect } from 'react';
import { loadTranslation, loadModules } from './dynamic-loader';

export function useTranslation() {
  const params = useParams();
  const locale = (params?.locale as LocaleCode) || 'us';
  const [translations, setTranslations] = useState(CORE_TRANSLATIONS.us);
  const [modules, setModules] = useState(CORE_MODULES.us);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLocaleData() {
      // Core languages
      if (locale === 'us' || locale === 'gb' || locale === 'eu') {
        setTranslations(CORE_TRANSLATIONS.us);
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
      
      // Dynamic languages
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

  return {
    t: translations,
    tm: modules,
    locale,
    loading,
    localeInfo: getLocaleByCode(locale)
  };
}
