// CORE MODULES - завжди в bundle (US, UA, ES)
export const CORE_MODULES = {
  us: {
    governance: [
      { title: 'Governance Core', desc: 'Authority, roles, delegation, institutional control', cat: 'governance' },
      { title: 'Program Registry', desc: 'Programs, contracts, ceilings, obligations tracking', cat: 'governance' },
      { title: 'Decision Ledger', desc: 'Immutable approvals, justifications, timestamped actions', cat: 'governance' },
      { title: 'Audit Engine', desc: 'Evidence trails, compliance mapping, OIG-ready exports', cat: 'governance' },
      { title: 'Risk & Safeguards', desc: 'Risk registry, misuse detection, human override', cat: 'governance' },
      { title: 'Transparency Hub', desc: 'Real-time visibility, cross-ministry dashboards', cat: 'governance' },
    ],
    donor: [
      { title: 'HBS Module', desc: 'Human-in-the-loop oversight, decision authorization', cat: 'donor' },
      { title: 'Donor Dashboard', desc: 'Real-time program visibility, KPI tracking, IATI compliance', cat: 'donor' },
      { title: 'MEL & Evidence', desc: 'Indicators, evidence linkage, outcome verification', cat: 'donor' },
      { title: 'Reconstruction', desc: 'Post-conflict recovery, infrastructure rebuild', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI Administrator', desc: 'Ethical AI assistant — human authority enforced', cat: 'intelligence' },
      { title: 'Platform Status', desc: '99.97% uptime, real-time monitoring', cat: 'intelligence' },
    ],
    categories: { governance: 'Governance & Control', donor: 'Donor Oversight', intelligence: 'Intelligence' },
    search: { placeholder: 'Search modules...', results: 'results', noResults: 'No results found' }
  },
  
  ua: {
    governance: [
      { title: 'Ядро управління', desc: 'Повноваження, ролі, делегування, інституційний контроль', cat: 'governance' },
      { title: 'Реєстр програм', desc: 'Програми, контракти, ліміти, відстеження зобов\'язань', cat: 'governance' },
      { title: 'Реєстр рішень', desc: 'Незмінні затвердження, обґрунтування, дії з позначкою часу', cat: 'governance' },
      { title: 'Модуль аудиту', desc: 'Сліди доказів, відповідність, експорт для OIG', cat: 'governance' },
      { title: 'Ризики та захист', desc: 'Реєстр ризиків, виявлення зловживань, людський контроль', cat: 'governance' },
      { title: 'Центр прозорості', desc: 'Видимість в реальному часі, міжміністерські панелі', cat: 'governance' },
    ],
    donor: [
      { title: 'Модуль HBS', desc: 'Нагляд з людиною в циклі, авторизація рішень', cat: 'donor' },
      { title: 'Панель донорів', desc: 'Видимість програм в реальному часі, відстеження KPI, відповідність IATI', cat: 'donor' },
      { title: 'MEL та докази', desc: 'Індикатори, зв\'язок доказів, перевірка результатів', cat: 'donor' },
      { title: 'Реконструкція', desc: 'Відновлення після конфлікту, відбудова інфраструктури', cat: 'donor' },
    ],
    intelligence: [
      { title: 'AI Адміністратор', desc: 'Етичний AI асистент — людський контроль забезпечено', cat: 'intelligence' },
      { title: 'Статус платформи', desc: '99.97% час роботи, моніторинг в реальному часі', cat: 'intelligence' },
    ],
    categories: { governance: 'Управління та контроль', donor: 'Донорський нагляд', intelligence: 'Інтелект' },
    search: { placeholder: 'Пошук модулів...', results: 'результатів', noResults: 'Нічого не знайдено' }
  },
  
  es: {
    governance: [
      { title: 'Núcleo de gobernanza', desc: 'Autoridad, roles, delegación, control institucional', cat: 'governance' },
      { title: 'Registro de programas', desc: 'Programas, contratos, techos, seguimiento de obligaciones', cat: 'governance' },
      { title: 'Registro de decisiones', desc: 'Aprobaciones inmutables, justificaciones, acciones con marca de tiempo', cat: 'governance' },
      { title: 'Motor de auditoría', desc: 'Rastros de evidencia, mapeo de cumplimiento, exportaciones listas para OIG', cat: 'governance' },
      { title: 'Riesgos y salvaguardias', desc: 'Registro de riesgos, detección de uso indebido, anulación humana', cat: 'governance' },
      { title: 'Centro de transparencia', desc: 'Visibilidad en tiempo real, paneles interministeriales', cat: 'governance' },
    ],
    donor: [
      { title: 'Módulo HBS', desc: 'Supervisión con humano en el bucle, autorización de decisión', cat: 'donor' },
      { title: 'Panel de donantes', desc: 'Visibilidad del programa en tiempo real, seguimiento de KPI, cumplimiento IATI', cat: 'donor' },
      { title: 'MEL y evidencia', desc: 'Indicadores, vinculación de evidencia, verificación de resultados', cat: 'donor' },
      { title: 'Reconstrucción', desc: 'Recuperación posconflicto, reconstrucción de infraestructura', cat: 'donor' },
    ],
    intelligence: [
      { title: 'Administrador IA', desc: 'Asistente IA ético — autoridad humana aplicada', cat: 'intelligence' },
      { title: 'Estado de la plataforma', desc: '99.97% de disponibilidad, monitoreo en tiempo real', cat: 'intelligence' },
    ],
    categories: { governance: 'Gobernanza y control', donor: 'Supervisión de donantes', intelligence: 'Inteligencia' },
    search: { placeholder: 'Buscar módulos...', results: 'resultados', noResults: 'No se encontraron resultados' }
  }
};
