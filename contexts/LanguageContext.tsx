'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'uk' | 'de' | 'fr' | 'pl' | 'es';

const translations: Record<string, Record<Language, string>> = {
  'nav.overview': { en: 'Overview', uk: 'Огляд', de: 'Überblick', fr: 'Aperçu', pl: 'Przegląd', es: 'Resumen' },
  'nav.governance': { en: 'Governance', uk: 'Управління', de: 'Governance', fr: 'Gouvernance', pl: 'Zarządzanie', es: 'Gobernanza' },
  'nav.decisionTree': { en: 'Decision Tree', uk: 'Дерево рішень', de: 'Entscheidungsbaum', fr: 'Arbre décision', pl: 'Drzewo decyzji', es: 'Árbol decisión' },
  'nav.aiAdvisor': { en: 'AI Advisor', uk: 'AI Радник', de: 'KI-Berater', fr: 'Conseiller IA', pl: 'Doradca AI', es: 'Asesor IA' },
  'nav.smartSuite': { en: 'Smart Suite', uk: 'Смарт Набір', de: 'Smart Suite', fr: 'Suite Smart', pl: 'Smart Suite', es: 'Suite Smart' },
  'nav.analytics': { en: 'Analytics', uk: 'Аналітика', de: 'Analytik', fr: 'Analytique', pl: 'Analityka', es: 'Analítica' },
  'nav.engine': { en: 'Engine', uk: 'Двигун', de: 'Engine', fr: 'Moteur', pl: 'Silnik', es: 'Motor' },
  'nav.signals': { en: 'Signals', uk: 'Сигнали', de: 'Signale', fr: 'Signaux', pl: 'Sygnały', es: 'Señales' },
  'nav.institutional': { en: 'Institutional', uk: 'Інституційний', de: 'Institutionell', fr: 'Institutionnel', pl: 'Instytucjonalny', es: 'Institucional' },
  'nav.interoperability': { en: 'Interoperability', uk: 'Сумісність', de: 'Interoperabilität', fr: 'Interopérabilité', pl: 'Interoperacyjność', es: 'Interoperabilidad' },
  'header.title': { en: 'HBS Global Platform', uk: 'HBS Глобальна Платформа', de: 'HBS Globale Plattform', fr: 'Plateforme HBS', pl: 'Platforma HBS', es: 'Plataforma HBS' },
  'header.subtitle': { en: 'Humanitarian Budget Support', uk: 'Гуманітарна Бюджетна Підтримка', de: 'Humanitäre Budgethilfe', fr: 'Soutien Budgétaire', pl: 'Wsparcie Budżetowe', es: 'Apoyo Presupuestario' },
  'header.backToIvyar': { en: '← Back to IVYAR', uk: '← Назад до IVYAR', de: '← Zurück zu IVYAR', fr: '← Retour à IVYAR', pl: '← Powrót do IVYAR', es: '← Volver a IVYAR' },
  'footer.text': { en: 'Global Interoperability Platform', uk: 'Глобальна Платформа Сумісності', de: 'Globale Interoperabilitätsplattform', fr: 'Plateforme Interopérabilité', pl: 'Platforma Interoperacyjności', es: 'Plataforma Interoperabilidad' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultT = (key: string): string => translations[key]?.en || key;

const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: defaultT,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hbs-language');
      if (saved && ['en', 'uk', 'de', 'fr', 'pl', 'es'].includes(saved)) {
        setLanguageState(saved as Language);
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem('hbs-language', lang); } catch (e) {}
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}