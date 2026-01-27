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
    autopilot: {
      hero: {
        badge: 'AUTOPILOT API v12',
        title: 'AI-Powered Governance',
        subtitle: '10 specialized AI decision engines operating 24/7 across governance, logistics, and finance. Human-aligned, explainable, and fully auditable.',
        exploreModules: 'Explore Modules',
        watchDemo: 'Watch Live Demo',
        exportReport: 'Export Report',
        share: 'Share',
        operational: 'All systems operational',
        decisionsToday: 'decisions today'
      },
      modules: {
        title: 'Autopilot AI Modules',
        subtitle: '10 specialized decision engines for transparent governance',
        noModulesFound: 'No modules found',
        tryAdjusting: 'Try adjusting your search or filters'
      },
      liveSimulation: {
        title: 'Live Decision Simulation',
        subtitle: 'Real-time AI decision-making demonstration'
      },
      architecture: {
        title: 'Technical Architecture',
        subtitle: 'Built on proven AI governance principles',
        explainableAI: {
          title: 'Explainable AI',
          description: 'Every decision includes full reasoning chain and confidence scoring. Human auditors can trace logic and override when needed.'
        },
        auditTrail: {
          title: 'Immutable Audit Trail',
          description: 'All decisions logged to blockchain. Tamper-proof evidence for compliance, investigations, and institutional oversight.'
        },
        humanAlignment: {
          title: 'Human Alignment',
          description: 'AI recommendations require human approval for high-stakes decisions. Ethical guidelines embedded in all modules.'
        }
      },
      cta: {
        title: 'Ready to deploy AI governance?',
        subtitle: 'Schedule a demo to see Autopilot AI in action across your governance workflows.',
        requestDemo: 'Request Demo'
      }
    },
    hbsAutopilot: {
      hero: {
        badge: 'HBS AUTOPILOT ENGINE',
        title: 'AI Decision Engine',
        subtitle: 'Advanced scenario-based cognitive evaluation powered by AI. Make informed decisions with confidence scoring, explainable reasoning, and institutional-grade audit trails.',
        aiEngineActive: 'AI Engine Active',
        scenariosAvailable: 'Scenarios Available',
        explainableAI: 'Explainable AI'
      },
      wizard: {
        startOver: 'Start Over',
        editInput: 'Edit Input',
        history: 'History',
        compare: 'Compare',
        clearAllHistory: 'Clear All History'
      },
      steps: {
        selectScenario: 'Select Scenario',
        inputData: 'Input Data',
        viewDecision: 'View Decision',
        chooseScenario: 'Choose a scenario to evaluate',
        provideInfo: 'Provide the necessary information for AI analysis',
        reviewDecision: 'Review the AI decision and insights'
      },
      scenarios: {
        title: 'Select a Decision Scenario',
        subtitle: 'Choose the type of evaluation you want to perform',
        fieldsRequired: 'fields required',
        howItWorks: 'How It Works',
        howItWorksText: 'Select a scenario above to begin. Our AI will guide you through the evaluation process, providing explainable decisions with confidence scores and detailed reasoning. All decisions are logged for institutional audit compliance.'
      },
      form: {
        required: 'required',
        runEngine: 'Run AI Decision Engine',
        processing: 'Processing Decision...'
      },
      results: {
        decisionResult: 'Decision Result',
        evaluated: 'Evaluated',
        approved: 'APPROVED',
        reviewRequired: 'REVIEW REQUIRED',
        rejected: 'REJECTED',
        confidence: 'Confidence',
        confidenceScore: 'Confidence Score',
        highConfidence: 'High Confidence',
        mediumConfidence: 'Medium Confidence',
        lowConfidence: 'Low Confidence',
        aiReasoning: 'AI Reasoning',
        references: 'References & Citations',
        inputSummary: 'Input Data Summary',
        exportDecision: 'Export Decision',
        viewRawJSON: 'View Raw JSON',
        shareDecision: 'Share Decision'
      },
      comparison: {
        title: 'Decision Comparison',
        subtitle: 'Compare current decision with historical results',
        compareWith: 'Compare with:',
        currentDecision: 'Current Decision',
        previousDecision: 'Previous Decision',
        new: 'NEW',
        status: 'Status',
        explanation: 'Explanation',
        insights: 'Comparison Insights',
        sameStatus: 'Both decisions have the same status',
        statusChanged: 'Status changed from',
        to: 'to',
        scoresIdentical: 'Confidence scores are identical',
        confidenceImproved: 'Confidence improved by',
        confidenceDecreased: 'Confidence decreased by',
        points: 'points',
        close: 'Close'
      },
      history: {
        title: 'Decision History',
        decisions: 'decisions',
        decision: 'decision',
        recorded: 'recorded',
        searchPlaceholder: 'Search by scenario or status...',
        noHistory: 'No decisions yet',
        noHistoryText: 'Your decision history will appear here',
        noMatching: 'No matching history',
        tryDifferent: 'Try a different search term',
        rerun: 'Rerun with same inputs',
        details: 'Details',
        hide: 'Hide',
        delete: 'Delete',
        deleteConfirm: 'Delete this decision from history?',
        deleteAllConfirm: 'Delete all',
        inputData: 'Input Data',
        fullExplanation: 'Full Explanation'
      },
      loading: {
        default: 'Loading...',
        scenarios: 'Loading decision scenarios...',
        analyzing: 'AI is analyzing your scenario...'
      },
      errors: {
        somethingWrong: 'Something went wrong',
        noScenarios: 'No scenarios available. Please contact support.'
      },
      empty: {
        title: 'Select a scenario to begin',
        subtitle: 'Choose a decision scenario from above to start the AI evaluation process'
      }
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
    autopilot: {
      hero: {
        badge: 'АВТОПІЛОТ API v12',
        title: 'Управління на основі AI',
        subtitle: '10 спеціалізованих AI-модулів прийняття рішень, що працюють 24/7 у сферах управління, логістики та фінансів. Орієнтовані на людину, пояснювані та повністю піддаються аудиту.',
        exploreModules: 'Переглянути модулі',
        watchDemo: 'Дивитись демо',
        exportReport: 'Експортувати звіт',
        share: 'Поділитися',
        operational: 'Всі системи працюють',
        decisionsToday: 'рішень сьогодні'
      },
      modules: {
        title: 'Модулі Автопілот AI',
        subtitle: '10 спеціалізованих модулів прийняття рішень для прозорого управління',
        noModulesFound: 'Модулі не знайдено',
        tryAdjusting: 'Спробуйте налаштувати пошук або фільтри'
      },
      liveSimulation: {
        title: 'Симуляція рішень в реальному часі',
        subtitle: 'Демонстрація прийняття рішень AI в реальному часі'
      },
      architecture: {
        title: 'Технічна архітектура',
        subtitle: 'Побудовано на перевірених принципах AI-управління',
        explainableAI: {
          title: 'Пояснюваний AI',
          description: 'Кожне рішення включає повний ланцюг обґрунтування та оцінку впевненості. Людина-аудитор може простежити логіку та втрутитися при потребі.'
        },
        auditTrail: {
          title: 'Незмінний аудит-трейл',
          description: 'Всі рішення записуються в блокчейн. Захищені від підробки докази для відповідності, розслідувань та інституційного нагляду.'
        },
        humanAlignment: {
          title: 'Людиноцентричність',
          description: 'Рекомендації AI потребують схвалення людини для критично важливих рішень. Етичні принципи вбудовані у всі модулі.'
        }
      },
      cta: {
        title: 'Готові впровадити AI-управління?',
        subtitle: 'Запишіться на демо, щоб побачити Автопілот AI в дії у ваших робочих процесах управління.',
        requestDemo: 'Запит демонстрації'
      }
    },
    hbsAutopilot: {
      hero: {
        badge: 'HBS ДВИГУН АВТОПІЛОТУ',
        title: 'AI Двигун Рішень',
        subtitle: 'Передова когнітивна оцінка на основі сценаріїв з підтримкою AI. Приймайте обґрунтовані рішення з оцінкою впевненості, поясненим обґрунтуванням та аудит-трейлом інституційного рівня.',
        aiEngineActive: 'AI Двигун Активний',
        scenariosAvailable: 'Сценаріїв Доступно',
        explainableAI: 'Пояснюваний AI'
      },
      wizard: {
        startOver: 'Почати Спочатку',
        editInput: 'Редагувати Введення',
        history: 'Історія',
        compare: 'Порівняти',
        clearAllHistory: 'Очистити Всю Історію'
      },
      steps: {
        selectScenario: 'Вибрати Сценарій',
        inputData: 'Ввести Дані',
        viewDecision: 'Переглянути Рішення',
        chooseScenario: 'Оберіть сценарій для оцінки',
        provideInfo: 'Надайте необхідну інформацію для AI аналізу',
        reviewDecision: 'Перегляньте AI рішення та висновки'
      },
      scenarios: {
        title: 'Оберіть Сценарій Рішення',
        subtitle: 'Виберіть тип оцінки, яку хочете виконати',
        fieldsRequired: 'полів потрібно',
        howItWorks: 'Як Це Працює',
        howItWorksText: 'Оберіть сценарій вище, щоб почати. Наш AI проведе вас через процес оцінки, надаючи пояснювані рішення з оцінками впевненості та детальним обґрунтуванням. Всі рішення логуються для інституційного аудиту.'
      },
      form: {
        required: "обов'язково",
        runEngine: 'Запустити AI Двигун Рішень',
        processing: 'Обробка Рішення...'
      },
      results: {
        decisionResult: 'Результат Рішення',
        evaluated: 'Оцінено',
        approved: 'СХВАЛЕНО',
        reviewRequired: 'ПОТРІБЕН ПЕРЕГЛЯД',
        rejected: 'ВІДХИЛЕНО',
        confidence: 'Впевненість',
        confidenceScore: 'Оцінка Впевненості',
        highConfidence: 'Висока Впевненість',
        mediumConfidence: 'Середня Впевненість',
        lowConfidence: 'Низька Впевненість',
        aiReasoning: 'AI Обґрунтування',
        references: 'Посилання та Цитати',
        inputSummary: 'Зведення Вхідних Даних',
        exportDecision: 'Експортувати Рішення',
        viewRawJSON: 'Переглянути JSON',
        shareDecision: 'Поділитися Рішенням'
      },
      comparison: {
        title: 'Порівняння Рішень',
        subtitle: 'Порівняйте поточне рішення з історичними результатами',
        compareWith: 'Порівняти з:',
        currentDecision: 'Поточне Рішення',
        previousDecision: 'Попереднє Рішення',
        new: 'НОВЕ',
        status: 'Статус',
        explanation: 'Пояснення',
        insights: 'Висновки Порівняння',
        sameStatus: 'Обидва рішення мають однаковий статус',
        statusChanged: 'Статус змінився з',
        to: 'на',
        scoresIdentical: 'Оцінки впевненості ідентичні',
        confidenceImproved: 'Впевненість покращилась на',
        confidenceDecreased: 'Впевненість знизилась на',
        points: 'балів',
        close: 'Закрити'
      },
      history: {
        title: 'Історія Рішень',
        decisions: 'рішень',
        decision: 'рішення',
        recorded: 'записано',
        searchPlaceholder: 'Пошук за сценарієм або статусом...',
        noHistory: 'Рішень ще немає',
        noHistoryText: 'Ваша історія рішень з\'явиться тут',
        noMatching: 'Не знайдено співпадінь',
        tryDifferent: 'Спробуйте інший пошуковий запит',
        rerun: 'Запустити знову з тими ж даними',
        details: 'Деталі',
        hide: 'Приховати',
        delete: 'Видалити',
        deleteConfirm: 'Видалити це рішення з історії?',
        deleteAllConfirm: 'Видалити всі',
        inputData: 'Вхідні Дані',
        fullExplanation: 'Повне Пояснення'
      },
      loading: {
        default: 'Завантаження...',
        scenarios: 'Завантаження сценаріїв рішень...',
        analyzing: 'AI аналізує ваш сценарій...'
      },
      errors: {
        somethingWrong: 'Щось пішло не так',
        noScenarios: 'Сценарії недоступні. Будь ласка, зверніться до підтримки.'
      },
      empty: {
        title: 'Оберіть сценарій для початку',
        subtitle: 'Виберіть сценарій рішення вище, щоб почати процес AI оцінки'
      }
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
    autopilot: {
      hero: {
        badge: 'AUTOPILOT API v12',
        title: 'Gobernanza impulsada por IA',
        subtitle: '10 motores de decisión de IA especializados que operan 24/7 en gobernanza, logística y finanzas. Alineados con humanos, explicables y completamente auditables.',
        exploreModules: 'Explorar módulos',
        watchDemo: 'Ver demostración',
        exportReport: 'Exportar informe',
        share: 'Compartir',
        operational: 'Todos los sistemas operativos',
        decisionsToday: 'decisiones hoy'
      },
      modules: {
        title: 'Módulos Autopilot AI',
        subtitle: '10 motores de decisión especializados para gobernanza transparente',
        noModulesFound: 'No se encontraron módulos',
        tryAdjusting: 'Intente ajustar su búsqueda o filtros'
      },
      liveSimulation: {
        title: 'Simulación de decisiones en vivo',
        subtitle: 'Demostración de toma de decisiones de IA en tiempo real'
      },
      architecture: {
        title: 'Arquitectura técnica',
        subtitle: 'Construido sobre principios probados de gobernanza de IA',
        explainableAI: {
          title: 'IA explicable',
          description: 'Cada decisión incluye una cadena de razonamiento completa y puntuación de confianza. Los auditores humanos pueden rastrear la lógica y anular cuando sea necesario.'
        },
        auditTrail: {
          title: 'Registro de auditoría inmutable',
          description: 'Todas las decisiones registradas en blockchain. Evidencia a prueba de manipulaciones para cumplimiento, investigaciones y supervisión institucional.'
        },
        humanAlignment: {
          title: 'Alineación humana',
          description: 'Las recomendaciones de IA requieren aprobación humana para decisiones de alto riesgo. Directrices éticas integradas en todos los módulos.'
        }
      },
      cta: {
        title: '¿Listo para implementar gobernanza de IA?',
        subtitle: 'Programe una demostración para ver Autopilot AI en acción en sus flujos de trabajo de gobernanza.',
        requestDemo: 'Solicitar demostración'
      }
    },
    hbsAutopilot: {
      hero: {
        badge: 'MOTOR HBS AUTOPILOT',
        title: 'Motor de Decisiones IA',
        subtitle: 'Evaluación cognitiva avanzada basada en escenarios impulsada por IA. Tome decisiones informadas con puntuación de confianza, razonamiento explicable y registros de auditoría de grado institucional.',
        aiEngineActive: 'Motor IA Activo',
        scenariosAvailable: 'Escenarios Disponibles',
        explainableAI: 'IA Explicable'
      },
      wizard: {
        startOver: 'Empezar de Nuevo',
        editInput: 'Editar Entrada',
        history: 'Historial',
        compare: 'Comparar',
        clearAllHistory: 'Borrar Todo el Historial'
      },
      steps: {
        selectScenario: 'Seleccionar Escenario',
        inputData: 'Ingresar Datos',
        viewDecision: 'Ver Decisión',
        chooseScenario: 'Elija un escenario para evaluar',
        provideInfo: 'Proporcione la información necesaria para el análisis de IA',
        reviewDecision: 'Revise la decisión de IA y los conocimientos'
      },
      scenarios: {
        title: 'Seleccione un Escenario de Decisión',
        subtitle: 'Elija el tipo de evaluación que desea realizar',
        fieldsRequired: 'campos requeridos',
        howItWorks: 'Cómo Funciona',
        howItWorksText: 'Seleccione un escenario arriba para comenzar. Nuestra IA lo guiará a través del proceso de evaluación, proporcionando decisiones explicables con puntuaciones de confianza y razonamiento detallado. Todas las decisiones se registran para el cumplimiento de auditoría institucional.'
      },
      form: {
        required: 'requerido',
        runEngine: 'Ejecutar Motor de Decisiones IA',
        processing: 'Procesando Decisión...'
      },
      results: {
        decisionResult: 'Resultado de Decisión',
        evaluated: 'Evaluado',
        approved: 'APROBADO',
        reviewRequired: 'REVISIÓN REQUERIDA',
        rejected: 'RECHAZADO',
        confidence: 'Confianza',
        confidenceScore: 'Puntuación de Confianza',
        highConfidence: 'Alta Confianza',
        mediumConfidence: 'Confianza Media',
        lowConfidence: 'Baja Confianza',
        aiReasoning: 'Razonamiento IA',
        references: 'Referencias y Citas',
        inputSummary: 'Resumen de Datos de Entrada',
        exportDecision: 'Exportar Decisión',
        viewRawJSON: 'Ver JSON Bruto',
        shareDecision: 'Compartir Decisión'
      },
      comparison: {
        title: 'Comparación de Decisiones',
        subtitle: 'Compare la decisión actual con resultados históricos',
        compareWith: 'Comparar con:',
        currentDecision: 'Decisión Actual',
        previousDecision: 'Decisión Anterior',
        new: 'NUEVA',
        status: 'Estado',
        explanation: 'Explicación',
        insights: 'Perspectivas de Comparación',
        sameStatus: 'Ambas decisiones tienen el mismo estado',
        statusChanged: 'El estado cambió de',
        to: 'a',
        scoresIdentical: 'Las puntuaciones de confianza son idénticas',
        confidenceImproved: 'La confianza mejoró en',
        confidenceDecreased: 'La confianza disminuyó en',
        points: 'puntos',
        close: 'Cerrar'
      },
      history: {
        title: 'Historial de Decisiones',
        decisions: 'decisiones',
        decision: 'decisión',
        recorded: 'registradas',
        searchPlaceholder: 'Buscar por escenario o estado...',
        noHistory: 'Aún no hay decisiones',
        noHistoryText: 'Su historial de decisiones aparecerá aquí',
        noMatching: 'No hay historial coincidente',
        tryDifferent: 'Pruebe con un término de búsqueda diferente',
        rerun: 'Volver a ejecutar con las mismas entradas',
        details: 'Detalles',
        hide: 'Ocultar',
        delete: 'Eliminar',
        deleteConfirm: '¿Eliminar esta decisión del historial?',
        deleteAllConfirm: 'Eliminar todas',
        inputData: 'Datos de Entrada',
        fullExplanation: 'Explicación Completa'
      },
      loading: {
        default: 'Cargando...',
        scenarios: 'Cargando escenarios de decisión...',
        analyzing: 'IA está analizando su escenario...'
      },
      errors: {
        somethingWrong: 'Algo salió mal',
        noScenarios: 'No hay escenarios disponibles. Por favor contacte a soporte.'
      },
      empty: {
        title: 'Seleccione un escenario para comenzar',
        subtitle: 'Elija un escenario de decisión arriba para iniciar el proceso de evaluación de IA'
      }
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

export const GB_TRANSLATIONS = CORE_TRANSLATIONS.us;
export const EU_TRANSLATIONS = CORE_TRANSLATIONS.us;
