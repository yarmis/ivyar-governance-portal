// CORE TRANSLATIONS - завжди в bundle (US, UA, ES)
export const CORE_TRANSLATIONS = {
  us: {
    hero: { 
      title: 'IVYAR Governance Platform', 
      subtitle: 'Institutional governance infrastructure trusted by leading development institutions', 
      origin: 'Built in the United States • Inspired by Ukraine • Designed for the world' 
    },
    nav: { search: 'Search', menu: 'Menu' },
    badge: 'NATO-Aligned • World Bank Ready • USAID Compatible',
    modules: { title: 'Institutional Infrastructure' },
    note: { 
      title: 'Advanced operational capabilities available on request', 
      desc: 'Procurement, logistics, emergency services — demonstrated in live pilot sessions' 
    },
    stats: {
      title: 'Trusted by Leading Institutions',
      uptime: { value: '99.97%', label: 'Platform Uptime', sublabel: 'NATO-grade reliability' },
      value: { value: '$115.8M', label: 'Total Project Value', sublabel: '6 active reconstruction projects' },
      jobs: { value: '1,247', label: 'Jobs Created', sublabel: 'Including 121 veterans employed' },
      served: { value: '450K', label: 'People Served', sublabel: 'By restored facilities' }
    },
    cta: {
      title: 'Ready to Modernize Governance Operations?',
      subtitle: 'Join leading institutions using IVYAR for secure, compliant, and ethical digital governance',
      demo: 'Request Demo',
      contact: 'Schedule Call'
    },
    footer: {
      tagline: 'Digital Public Infrastructure for Transparent Governance',
      links: { demo: 'Demo', docs: 'Documentation', contact: 'Contact', privacy: 'Privacy' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  ua: {
    hero: { 
      title: 'Платформа IVYAR', 
      subtitle: 'Інституційна інфраструктура управління, якій довіряють провідні інституції розвитку', 
      origin: 'Створено в США • Натхненно Україною • Призначено для світу' 
    },
    nav: { search: 'Пошук', menu: 'Меню' },
    badge: 'NATO-сумісний • Готовий для Світового банку • Сумісний з USAID',
    modules: { title: 'Інституційна інфраструктура' },
    note: { 
      title: 'Розширені операційні можливості доступні за запитом', 
      desc: 'Закупівлі, логістика, екстрені служби — демонструються в пілотних сесіях наживо' 
    },
    stats: {
      title: 'Довіра провідних інституцій',
      uptime: { value: '99.97%', label: 'Час роботи платформи', sublabel: 'Надійність рівня NATO' },
      value: { value: '$115.8M', label: 'Загальна вартість проектів', sublabel: '6 активних проектів реконструкції' },
      jobs: { value: '1,247', label: 'Створено робочих місць', sublabel: 'Включно з 121 працевлаштованим ветераном' },
      served: { value: '450K', label: 'Обслуговано людей', sublabel: 'Відновленими об\'єктами' }
    },
    cta: {
      title: 'Готові модернізувати операції управління?',
      subtitle: 'Приєднуйтесь до провідних інституцій, які використовують IVYAR',
      demo: 'Запит демонстрації',
      contact: 'Запланувати дзвінок'
    },
    footer: {
      tagline: 'Цифрова публічна інфраструктура для прозорого управління',
      links: { demo: 'Демо', docs: 'Документація', contact: 'Контакти', privacy: 'Конфіденційність' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  },
  
  es: {
    hero: { 
      title: 'Plataforma IVYAR', 
      subtitle: 'Infraestructura de gobernanza institucional confiable para las principales instituciones de desarrollo', 
      origin: 'Construido en Estados Unidos • Inspirado por Ucrania • Diseñado para el mundo' 
    },
    nav: { search: 'Buscar', menu: 'Menú' },
    badge: 'Compatible con OTAN • Listo Banco Mundial • Compatible USAID',
    modules: { title: 'Infraestructura institucional' },
    note: { 
      title: 'Capacidades operativas avanzadas disponibles bajo solicitud', 
      desc: 'Adquisiciones, logística, servicios de emergencia — demostrados en sesiones piloto en vivo' 
    },
    stats: {
      title: 'Confiable por instituciones líderes',
      uptime: { value: '99.97%', label: 'Disponibilidad de la plataforma', sublabel: 'Confiabilidad de grado OTAN' },
      value: { value: '$115.8M', label: 'Valor total del proyecto', sublabel: '6 proyectos de reconstrucción activos' },
      jobs: { value: '1,247', label: 'Empleos creados', sublabel: 'Incluyendo 121 veteranos empleados' },
      served: { value: '450K', label: 'Personas atendidas', sublabel: 'Por instalaciones restauradas' }
    },
    cta: {
      title: '¿Listo para modernizar las operaciones de gobernanza?',
      subtitle: 'Únase a las instituciones líderes que utilizan IVYAR',
      demo: 'Solicitar demo',
      contact: 'Programar llamada'
    },
    footer: {
      tagline: 'Infraestructura pública digital para gobernanza transparente',
      links: { demo: 'Demo', docs: 'Documentación', contact: 'Contacto', privacy: 'Privacidad' },
      copyright: '© 2024-2026 IVYAR LLC • Lake Stevens, Washington, USA'
    }
  }
};

// GB та EU використовують US
export const GB_TRANSLATIONS = CORE_TRANSLATIONS.us;
export const EU_TRANSLATIONS = CORE_TRANSLATIONS.us;
