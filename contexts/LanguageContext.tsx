'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'uk' | 'de' | 'fr' | 'pl' | 'es';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.overview': { en: 'Overview', uk: 'Огляд', de: 'Überblick', fr: 'Aperçu', pl: 'Przegląd', es: 'Resumen' },
  'nav.governance': { en: 'Governance', uk: 'Управління', de: 'Governance', fr: 'Gouvernance', pl: 'Zarządzanie', es: 'Gobernanza' },
  'nav.decisionTree': { en: 'Decision Tree', uk: 'Дерево рішень', de: 'Entscheidungsbaum', fr: 'Arbre de décision', pl: 'Drzewo decyzyjne', es: 'Árbol de decisiones' },
  'nav.aiAdvisor': { en: 'AI Advisor', uk: 'AI Радник', de: 'KI-Berater', fr: 'Conseiller IA', pl: 'Doradca AI', es: 'Asesor IA' },
  'nav.smartSuite': { en: 'Smart Suite', uk: 'Смарт-набір', de: 'Smart Suite', fr: 'Suite intelligente', pl: 'Smart Suite', es: 'Suite inteligente' },
  'nav.analytics': { en: 'Analytics', uk: 'Аналітика', de: 'Analytik', fr: 'Analytique', pl: 'Analityka', es: 'Analítica' },
  'nav.engine': { en: 'Engine', uk: 'Двигун', de: 'Engine', fr: 'Moteur', pl: 'Silnik', es: 'Motor' },
  'nav.signals': { en: 'Signals', uk: 'Сигнали', de: 'Signale', fr: 'Signaux', pl: 'Sygnały', es: 'Señales' },
  'nav.institutional': { en: 'Institutional', uk: 'Інституційний', de: 'Institutionell', fr: 'Institutionnel', pl: 'Instytucjonalny', es: 'Institucional' },
  'nav.interoperability': { en: 'Interoperability', uk: 'Інтероперабельність', de: 'Interoperabilität', fr: 'Interopérabilité', pl: 'Interoperacyjność', es: 'Interoperabilidad' },
  
  // Header
  'header.title': { en: 'HBS Global Platform', uk: 'HBS Глобальна Платформа', de: 'HBS Globale Plattform', fr: 'Plateforme mondiale HBS', pl: 'Globalna Platforma HBS', es: 'Plataforma Global HBS' },
  'header.subtitle': { en: 'Humanitarian Budget Support', uk: 'Гуманітарна бюджетна підтримка', de: 'Humanitäre Budgethilfe', fr: 'Soutien budgétaire humanitaire', pl: 'Humanitarne wsparcie budżetowe', es: 'Apoyo presupuestario humanitario' },
  'header.backToIvyar': { en: '← Back to IVYAR', uk: '← Назад до IVYAR', de: '← Zurück zu IVYAR', fr: '← Retour à IVYAR', pl: '← Powrót do IVYAR', es: '← Volver a IVYAR' },
  
  // Footer
  'footer.text': { en: 'Global Interoperability Platform', uk: 'Глобальна платформа інтероперабельності', de: 'Globale Interoperabilitätsplattform', fr: 'Plateforme d\'interopérabilité mondiale', pl: 'Globalna platforma interoperacyjności', es: 'Plataforma de interoperabilidad global' },
  
  // Common
  'common.loading': { en: 'Loading...', uk: 'Завантаження...', de: 'Wird geladen...', fr: 'Chargement...', pl: 'Ładowanie...', es: 'Cargando...' },
  'common.save': { en: 'Save', uk: 'Зберегти', de: 'Speichern', fr: 'Enregistrer', pl: 'Zapisz', es: 'Guardar' },
  'common.cancel': { en: 'Cancel', uk: 'Скасувати', de: 'Abbrechen', fr: 'Annuler', pl: 'Anuluj', es: 'Cancelar' },
  'common.submit': { en: 'Submit', uk: 'Надіслати', de: 'Absenden', fr: 'Soumettre', pl: 'Wyślij', es: 'Enviar' },
  'common.refresh': { en: 'Refresh', uk: 'Оновити', de: 'Aktualisieren', fr: 'Actualiser', pl: 'Odśwież', es: 'Actualizar' },
  
  // Dashboard
  'dashboard.compliance': { en: 'Compliance', uk: 'Відповідність', de: 'Compliance', fr: 'Conformité', pl: 'Zgodność', es: 'Cumplimiento' },
  'dashboard.frameworks': { en: 'Frameworks', uk: 'Фреймворки', de: 'Frameworks', fr: 'Cadres', pl: 'Frameworki', es: 'Marcos' },
  'dashboard.certifications': { en: 'Certifications', uk: 'Сертифікації', de: 'Zertifizierungen', fr: 'Certifications', pl: 'Certyfikaty', es: 'Certificaciones' },
  'dashboard.apiVersion': { en: 'API Version', uk: 'Версія API', de: 'API-Version', fr: 'Version API', pl: 'Wersja API', es: 'Versión API' },
  'dashboard.pendingActions': { en: 'Pending Actions', uk: 'Очікувані дії', de: 'Ausstehende Aktionen', fr: 'Actions en attente', pl: 'Oczekujące akcje', es: 'Acciones pendientes' },
  'dashboard.auditSchedule': { en: 'Audit Schedule', uk: 'Графік аудиту', de: 'Prüfungsplan', fr: 'Calendrier d\'audit', pl: 'Harmonogram audytu', es: 'Calendario de auditoría' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('hbs-language') as Language;
    if (saved && ['en', 'uk', 'de', 'fr', 'pl', 'es'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hbs-language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}