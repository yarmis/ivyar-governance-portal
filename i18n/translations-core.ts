
// IVYAR Governance Platform - Core Translations
// Complete multilingual support: US (English), UA (Ukrainian), ES (Spanish)

export const CORE_TRANSLATIONS = {
  us: {
    hero: {
      title: 'IVYAR Governance Platform',
      subtitle: 'Institutional governance infrastructure trusted by leading development institutions',
      description: 'Empowering public institutions through intelligent automation, secure workflows, and AI-driven institutional transparency'
    },
    nav: {
      platform: 'Platform',
      autopilot: 'Autopilot',
      solutions: 'Solutions',
      about: 'About'
    },
    badge: {
      trusted: 'Trusted by',
      worldBank: 'World Bank',
      usaid: 'USAID',
      natoDiana: 'NATO DIANA'
    },
    modules: {
      title: 'Governance Modules',
      subtitle: 'Comprehensive AI-powered solutions for institutional operations'
    },
    stats: {
      accuracy: 'Accuracy',
      decisions: 'Decisions/Day',
      compliance: 'Compliance Rate',
      uptime: 'Uptime'
    },
    autopilot: {
      hero: {
        badge: 'v12 AUTOPILOT',
        title: 'AI Autopilot Platform',
        subtitle: '10 autonomous modules for institutional governance',
        filterAll: 'All Modules',
        filterGovernance: 'Governance',
        filterOperations: 'Operations',
        filterFinance: 'Finance',
        sortBy: 'Sort by',
        sortAccuracy: 'Accuracy',
        sortDecisions: 'Decisions',
        sortName: 'Name',
        search: 'Search modules...',
        exportReport: 'Export Report',
        shareReport: 'Share'
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
        submit: 'Run AI Decision Engine',
        submitting: 'Processing...',
        required: 'Required field',
        invalidFormat: 'Invalid format'
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
        decision: 'decision',
        decisions: 'decisions',
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
        scenarios: 'Loading scenarios...',
        analyzing: 'Analyzing with AI...'
      },
      errors: {
        somethingWrong: 'Something went wrong',
        noScenarios: 'No scenarios available'
      },
      empty: {
        title: 'Select a scenario to begin',
        subtitle: 'Choose a decision scenario from above to start the AI evaluation process'
      }
    },
    governanceAutopilot: {
      hero: {
        badge: 'GOVERNANCE AUTOPILOT',
        title: 'Constitutional Layer for AI Authority & Boundaries',
        intro1: 'AI systems are becoming more capable, adaptive, and autonomous. But in public-sector and high-risk environments, capability alone is not enough.',
        intro2: 'Authority must be defined. Boundaries must be enforced. And decisions must remain legitimate under uncertainty.',
        intro3: 'Governance Autopilot provides the constitutional layer of the platform — the mechanisms that determine what the system is allowed to do, what it must refuse, and how delegated authority is preserved at runtime.',
        layerType: 'Constitutional',
        enforcement: 'Runtime Active',
        transparency: 'Audit Ready'
      },
      purpose: {
        title: 'Why This Layer Exists',
        delegatedAuthority: { title: 'Delegated Authority', desc: 'Who gives power to the system and what that power includes' },
        admissibility: { title: 'Admissibility', desc: 'Which decisions the system is allowed to make' },
        runtimeBoundaries: { title: 'Runtime Boundaries', desc: 'What the system must never cross during operation' },
        refusalLogic: { title: 'Refusal Logic', desc: 'When the system must say "no" regardless of request' },
        intentPreservation: { title: 'Intent Preservation', desc: 'How institutional intent is kept under uncertainty' },
        constitutionalFoundation: { title: 'Constitutional Foundation', desc: 'Immutable principles that ensure trustworthy AI' }
      },
      governanceModel: {
        title: 'Governance Model',
        subtitle: '10 constitutional mechanisms that define AI authority and boundaries'
      },
      boundaryTest: {
        title: 'Test a Boundary',
        subtitle: 'See how the constitutional layer evaluates a proposed action',
        context: 'Context',
        describeAction: 'Describe the Action',
        evaluate: 'Evaluate',
        status: 'Status',
        reason: 'Reason',
        ruleReference: 'Rule Reference',
        authorityLevel: 'Authority Level',
        viewJson: 'View JSON Response',
        hideJson: 'Hide JSON Response',
        admissible: 'ADMISSIBLE',
        escalationRequired: 'ESCALATION REQUIRED',
        inadmissible: 'INADMISSIBLE'
      },
      audit: {
        title: 'Audit & Compliance View',
        subtitle: 'Constitutional rules, refusal logic, and traceability',
        governanceRules: 'Governance Rules',
        version: 'Version',
        viewFullJson: 'View Full JSON',
        hideFullJson: 'Hide Full JSON',
        refusalLogic: 'Refusal Logic',
        authorityChain: 'Authority Chain',
        level: 'Level',
        can: 'Can',
        cannot: 'Cannot'
      },
      integration: {
        title: 'How This Layer Fits',
        visitLayer: 'Visit layer',
        current: 'Current'
      },
      footer: {
        title: 'The Constitutional Foundation of Trustworthy AI',
        text: 'Governance Autopilot does not replace the decision engine. It defines the boundaries within which the decision engine must operate.'
      }
    },
    cta: {
      title: 'Ready to Modernize Governance Operations?',
      subtitle: 'Join leading institutions leveraging AI for transparent, efficient governance',
      primaryButton: 'Request Demo',
      secondaryButton: 'View Documentation'
    },
    footer: {
      platform: 'Platform',
      solutions: 'Solutions',
      resources: 'Resources',
      company: 'Company',
      copyright: '2024 IVYAR LLC. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    publicFeedback: {
      title: 'Public Feedback System',
      backToHbs: 'Back to HBS Portal',
      stats: {
        totalSubmissions: 'Total Submissions',
        avgResponseTime: 'Avg Response Time',
        resolvedIssues: 'Resolved Issues',
        activeCases: 'Active Cases'
      },
      tabs: {
        overview: 'Overview',
        submit: 'Submit Feedback',
        analytics: 'Analytics',
        youSaid: 'You Said, We Did'
      },
      overview: {
        title: 'Feedback by Category',
        submissions: 'submissions'
      },
      submit: {
        title: 'Submit Your Feedback',
        selectCategory: 'Select Category',
        subject: 'Subject',
        subjectPlaceholder: 'Brief description...',
        message: 'Your Feedback',
        messagePlaceholder: 'Share your feedback...',
        email: 'Email (optional)',
        emailPlaceholder: 'your@email.com',
        submitButton: 'Submit Feedback',
        thankYou: 'Thank You!',
        submitted: 'Your feedback has been submitted successfully.',
        reference: 'Reference'
      },
      analytics: {
        title: 'Feedback Trends',
        exportReport: 'Export Report'
      },
      youSaid: {
        title: 'You Said, We Did — Recent Actions',
        impact: 'Impact'
      },
      categories: {
        healthcare: 'Healthcare',
        education: 'Education',
        infrastructure: 'Infrastructure',
        safety: 'Public Safety',
        environment: 'Environment',
        other: 'Other Services'
      },
      status: {
        completed: 'Completed',
        inProgress: 'In Progress',
        planned: 'Planned'
      }
    }
  },
  ua: {
    hero: {
      title: 'Платформа IVYAR для управління',
      subtitle: 'Інфраструктура інституційного управління якій довіряють провідні організації розвитку',
      description: 'Розширення можливостей державних установ через інтелектуальну автоматизацію, безпечні робочі процеси та інституційну прозорість на основі AI'
    },
    nav: {
      platform: 'Платформа',
      autopilot: 'Автопілот',
      solutions: 'Рішення',
      about: 'Про нас'
    },
    badge: {
      trusted: 'Нам довіряють',
      worldBank: 'Світовий Банк',
      usaid: 'USAID',
      natoDiana: 'NATO DIANA'
    },
    modules: {
      title: 'Модулі управління',
      subtitle: 'Комплексні рішення на основі AI для інституційних операцій'
    },
    stats: {
      accuracy: 'Точність',
      decisions: 'Рішень/день',
      compliance: 'Рівень відповідності',
      uptime: 'Час роботи'
    },
    autopilot: {
      hero: {
        badge: 'v12 АВТОПІЛОТ',
        title: 'AI Платформа Автопілот',
        subtitle: '10 автономних модулів для інституційного управління',
        filterAll: 'Всі модулі',
        filterGovernance: 'Управління',
        filterOperations: 'Операції',
        filterFinance: 'Фінанси',
        sortBy: 'Сортувати за',
        sortAccuracy: 'Точність',
        sortDecisions: 'Рішення',
        sortName: 'Назва',
        search: 'Пошук модулів...',
        exportReport: 'Експортувати звіт',
        shareReport: 'Поділитися'
      }
    },
    hbsAutopilot: {
      hero: {
        badge: 'HBS ДВИГУН АВТОПІЛОТ',
        title: 'AI Двигун Рішень',
        subtitle: 'Розширена когнітивна оцінка на основі сценаріїв з AI. Приймайте обґрунтовані рішення з оцінкою впевненості, поясненням та інституційними аудит-трейлами.',
        aiEngineActive: 'AI Двигун Активний',
        scenariosAvailable: 'Доступно сценаріїв',
        explainableAI: 'Пояснюваний AI'
      },
      wizard: {
        startOver: 'Почати спочатку',
        editInput: 'Редагувати введення',
        history: 'Історія',
        compare: 'Порівняти',
        clearAllHistory: 'Очистити всю історію'
      },
      steps: {
        selectScenario: 'Обрати сценарій',
        inputData: 'Введення даних',
        viewDecision: 'Переглянути рішення',
        chooseScenario: 'Оберіть сценарій для оцінки',
        provideInfo: 'Надайте необхідну інформацію для AI аналізу',
        reviewDecision: 'Перегляньте AI рішення та висновки'
      },
      scenarios: {
        title: 'Оберіть сценарій рішення',
        subtitle: 'Виберіть тип оцінки яку хочете виконати',
        fieldsRequired: 'полів потрібно',
        howItWorks: 'Як це працює',
        howItWorksText: 'Оберіть сценарій вище щоб почати. Наш AI проведе вас через процес оцінки, надаючи пояснювані рішення з оцінками впевненості та детальним обґрунтуванням. Всі рішення логуються для інституційного аудиту.'
      },
      form: {
        submit: 'Запустити AI двигун рішень',
        submitting: 'Обробка...',
        required: 'Обов\'язкове поле',
        invalidFormat: 'Невірний формат'
      },
      results: {
        decisionResult: 'Результат рішення',
        evaluated: 'Оцінено',
        approved: 'СХВАЛЕНО',
        reviewRequired: 'ПОТРІБЕН ПЕРЕГЛЯД',
        rejected: 'ВІДХИЛЕНО',
        confidence: 'Впевненість',
        confidenceScore: 'Оцінка впевненості',
        highConfidence: 'Висока впевненість',
        mediumConfidence: 'Середня впевненість',
        lowConfidence: 'Низька впевненість',
        aiReasoning: 'AI обґрунтування',
        references: 'Посилання та цитати',
        inputSummary: 'Підсумок введених даних',
        exportDecision: 'Експортувати рішення',
        viewRawJSON: 'Переглянути Raw JSON',
        shareDecision: 'Поділитися рішенням'
      },
      comparison: {
        title: 'Порівняння рішень',
        subtitle: 'Порівняйте поточне рішення з історичними результатами',
        compareWith: 'Порівняти з:',
        currentDecision: 'Поточне рішення',
        previousDecision: 'Попереднє рішення',
        new: 'НОВЕ',
        status: 'Статус',
        explanation: 'Пояснення',
        insights: 'Висновки порівняння',
        sameStatus: 'Обидва рішення мають однаковий статус',
        statusChanged: 'Статус змінився з',
        to: 'на',
        scoresIdentical: 'Оцінки впевненості ідентичні',
        confidenceImproved: 'Впевненість покращилась на',
        confidenceDecreased: 'Впевненість знизилась на',
        points: 'пунктів',
        close: 'Закрити'
      },
      history: {
        title: 'Історія рішень',
        decision: 'рішення',
        decisions: 'рішень',
        recorded: 'записано',
        searchPlaceholder: 'Пошук за сценарієм або статусом...',
        noHistory: 'Рішень ще немає',
        noHistoryText: 'Ваша історія рішень з\'явиться тут',
        noMatching: 'Немає відповідної історії',
        tryDifferent: 'Спробуйте інший пошуковий запит',
        rerun: 'Повторити з тими ж даними',
        details: 'Деталі',
        hide: 'Приховати',
        delete: 'Видалити',
        deleteConfirm: 'Видалити це рішення з історії?',
        deleteAllConfirm: 'Видалити всі',
        inputData: 'Введені дані',
        fullExplanation: 'Повне пояснення'
      },
      loading: {
        default: 'Завантаження...',
        scenarios: 'Завантаження сценаріїв...',
        analyzing: 'Аналіз з AI...'
      },
      errors: {
        somethingWrong: 'Щось пішло не так',
        noScenarios: 'Немає доступних сценаріїв'
      },
      empty: {
        title: 'Оберіть сценарій щоб почати',
        subtitle: 'Виберіть сценарій рішення вище щоб розпочати процес AI оцінки'
      }
    },
    governanceAutopilot: {
      hero: {
        badge: 'GOVERNANCE АВТОПІЛОТ',
        title: 'Конституційний шар для AI влади та меж',
        intro1: 'AI системи стають більш здатними, адаптивними та автономними. Але в державному секторі та середовищах високого ризику самої здатності недостатньо.',
        intro2: 'Влада має бути визначена. Межі мають бути застосовані. А рішення мають залишатися легітимними в умовах невизначеності.',
        intro3: 'Governance Autopilot надає конституційний шар платформи — механізми, які визначають що система може робити, що вона мусить відхилити, і як делегована влада зберігається під час виконання.',
        layerType: 'Конституційний',
        enforcement: 'Активне виконання',
        transparency: 'Готово до аудиту'
      },
      purpose: {
        title: 'Чому існує цей шар',
        delegatedAuthority: { title: 'Делегована влада', desc: 'Хто надає владу системі і що ця влада включає' },
        admissibility: { title: 'Допустимість', desc: 'Які рішення система може приймати' },
        runtimeBoundaries: { title: 'Межі виконання', desc: 'Що система не повинна перетинати під час роботи' },
        refusalLogic: { title: 'Логіка відмови', desc: 'Коли система повинна сказати "ні" незалежно від запиту' },
        intentPreservation: { title: 'Збереження наміру', desc: 'Як зберігається інституційний намір в умовах невизначеності' },
        constitutionalFoundation: { title: 'Конституційна основа', desc: 'Незмінні принципи що забезпечують надійний AI' }
      },
      governanceModel: {
        title: 'Модель управління',
        subtitle: '10 конституційних механізмів що визначають AI владу та межі'
      },
      boundaryTest: {
        title: 'Тест меж',
        subtitle: 'Подивіться як конституційний шар оцінює запропоновану дію',
        context: 'Контекст',
        describeAction: 'Опишіть дію',
        evaluate: 'Оцінити',
        status: 'Статус',
        reason: 'Причина',
        ruleReference: 'Посилання на правило',
        authorityLevel: 'Рівень влади',
        viewJson: 'Переглянути JSON відповідь',
        hideJson: 'Приховати JSON відповідь',
        admissible: 'ДОПУСТИМО',
        escalationRequired: 'ПОТРІБНА ЕСКАЛАЦІЯ',
        inadmissible: 'НЕДОПУСТИМО'
      },
      audit: {
        title: 'Огляд аудиту та відповідності',
        subtitle: 'Конституційні правила, логіка відмови та відстежуваність',
        governanceRules: 'Правила управління',
        version: 'Версія',
        viewFullJson: 'Переглянути повний JSON',
        hideFullJson: 'Приховати повний JSON',
        refusalLogic: 'Логіка відмови',
        authorityChain: 'Ланцюг влади',
        level: 'Рівень',
        can: 'Може',
        cannot: 'Не може'
      },
      integration: {
        title: 'Як цей шар вписується',
        visitLayer: 'Відвідати шар',
        current: 'Поточний'
      },
      footer: {
        title: 'Конституційна основа надійного AI',
        text: 'Governance Autopilot не замінює двигун рішень. Він визначає межі в яких двигун рішень має працювати.'
      }
    },
    cta: {
      title: 'Готові модернізувати операції управління?',
      subtitle: 'Приєднуйтесь до провідних інституцій що використовують AI для прозорого, ефективного управління',
      primaryButton: 'Запитати демо',
      secondaryButton: 'Переглянути документацію'
    },
    footer: {
      platform: 'Платформа',
      solutions: 'Рішення',
      resources: 'Ресурси',
      company: 'Компанія',
      copyright: '2024 IVYAR LLC. Всі права захищені.',
      privacy: 'Політика конфіденційності',
      terms: 'Умови використання'
    },publicFeedback: {
      title: 'Система Зворотного Зв\'язку',
      backToHbs: 'Назад до HBS Порталу',
      stats: {
        totalSubmissions: 'Всього Звернень',
        avgResponseTime: 'Середній Час Відповіді',
        resolvedIssues: 'Вирішено Питань',
        activeCases: 'Активних Справ'
      },
      tabs: {
        overview: 'Огляд',
        submit: 'Подати Звернення',
        analytics: 'Аналітика',
        youSaid: 'Ви Сказали, Ми Зробили'
      },
      overview: {
        title: 'Звернення за Категоріями',
        submissions: 'звернень'
      },
      submit: {
        title: 'Подайте Ваше Звернення',
        selectCategory: 'Оберіть Категорію',
        subject: 'Тема',
        subjectPlaceholder: 'Короткий опис...',
        message: 'Ваше Звернення',
        messagePlaceholder: 'Поділіться вашим зверненням...',
        email: 'Email (необов\'язково)',
        emailPlaceholder: 'ваш@email.com',
        submitButton: 'Подати Звернення',
        thankYou: 'Дякуємо!',
        submitted: 'Ваше звернення успішно надіслано.',
        reference: 'Номер'
      },
      analytics: {
        title: 'Тренди Звернень',
        exportReport: 'Експортувати Звіт'
      },
      youSaid: {
        title: 'Ви Сказали, Ми Зробили — Останні Дії',
        impact: 'Вплив'
      },
      categories: {
        healthcare: 'Охорона Здоров\'я',
        education: 'Освіта',
        infrastructure: 'Інфраструктура',
        safety: 'Громадська Безпека',
        environment: 'Довкілля',
        other: 'Інші Послуги'
      },
      status: {
        completed: 'Завершено',
        inProgress: 'В Процесі',
        planned: 'Заплановано'
      }
    }
  },
  es: {
    hero: {
      title: 'Plataforma IVYAR de Gobernanza',
      subtitle: 'Infraestructura de gobernanza institucional confiada por las principales instituciones de desarrollo',
      description: 'Empoderando a las instituciones públicas a través de automatización inteligente, flujos de trabajo seguros y transparencia institucional impulsada por IA'
    },
    nav: {
      platform: 'Plataforma',
      autopilot: 'Autopilot',
      solutions: 'Soluciones',
      about: 'Acerca de'
    },
    badge: {
      trusted: 'Confiado por',
      worldBank: 'Banco Mundial',
      usaid: 'USAID',
      natoDiana: 'NATO DIANA'
    },
    modules: {
      title: 'Módulos de gobernanza',
      subtitle: 'Soluciones integrales impulsadas por IA para operaciones institucionales'
    },
    stats: {
      accuracy: 'Precisión',
      decisions: 'Decisiones/Día',
      compliance: 'Tasa de cumplimiento',
      uptime: 'Tiempo de actividad'
    },
    autopilot: {
      hero: {
        badge: 'v12 AUTOPILOT',
        title: 'Plataforma AI Autopilot',
        subtitle: '10 módulos autónomos para gobernanza institucional',
        filterAll: 'Todos los módulos',
        filterGovernance: 'Gobernanza',
        filterOperations: 'Operaciones',
        filterFinance: 'Finanzas',
        sortBy: 'Ordenar por',
        sortAccuracy: 'Precisión',
        sortDecisions: 'Decisiones',
        sortName: 'Nombre',
        search: 'Buscar módulos...',
        exportReport: 'Exportar informe',
        shareReport: 'Compartir'
      }
    },
    hbsAutopilot: {
      hero: {
        badge: 'MOTOR HBS AUTOPILOT',
        title: 'Motor de Decisiones IA',
        subtitle: 'Evaluación cognitiva avanzada basada en escenarios impulsada por IA. Tome decisiones informadas con puntuación de confianza, razonamiento explicable y registros de auditoría de grado institucional.',
        aiEngineActive: 'Motor IA Activo',
        scenariosAvailable: 'Escenarios disponibles',
        explainableAI: 'IA Explicable'
      },
      wizard: {
        startOver: 'Empezar de nuevo',
        editInput: 'Editar entrada',
        history: 'Historial',
        compare: 'Comparar',
        clearAllHistory: 'Borrar todo el historial'
      },
      steps: {
        selectScenario: 'Seleccionar escenario',
        inputData: 'Ingresar datos',
        viewDecision: 'Ver decisión',
        chooseScenario: 'Elija un escenario para evaluar',
        provideInfo: 'Proporcione la información necesaria para el análisis de IA',
        reviewDecision: 'Revise la decisión de IA y las perspectivas'
      },
      scenarios: {
        title: 'Seleccione un escenario de decisión',
        subtitle: 'Elija el tipo de evaluación que desea realizar',
        fieldsRequired: 'campos requeridos',
        howItWorks: 'Cómo funciona',
        howItWorksText: 'Seleccione un escenario arriba para comenzar. Nuestra IA lo guiará a través del proceso de evaluación, proporcionando decisiones explicables con puntuaciones de confianza y razonamiento detallado. Todas las decisiones se registran para el cumplimiento de auditoría institucional.'
      },
      form: {
        submit: 'Ejecutar motor de decisiones IA',
        submitting: 'Procesando...',
        required: 'Campo obligatorio',
        invalidFormat: 'Formato inválido'
      },
      results: {
        decisionResult: 'Resultado de decisión',
        evaluated: 'Evaluado',
        approved: 'APROBADO',
        reviewRequired: 'REVISIÓN REQUERIDA',
        rejected: 'RECHAZADO',
        confidence: 'Confianza',
        confidenceScore: 'Puntuación de confianza',
        highConfidence: 'Alta confianza',
        mediumConfidence: 'Confianza media',
        lowConfidence: 'Baja confianza',
        aiReasoning: 'Razonamiento IA',
        references: 'Referencias y citas',
        inputSummary: 'Resumen de datos de entrada',
        exportDecision: 'Exportar decisión',
        viewRawJSON: 'Ver JSON sin procesar',
        shareDecision: 'Compartir decisión'
      },
      comparison: {
        title: 'Comparación de decisiones',
        subtitle: 'Compare la decisión actual con los resultados históricos',
        compareWith: 'Comparar con:',
        currentDecision: 'Decisión actual',
        previousDecision: 'Decisión anterior',
        new: 'NUEVA',
        status: 'Estado',
        explanation: 'Explicación',
        insights: 'Perspectivas de comparación',
        sameStatus: 'Ambas decisiones tienen el mismo estado',
        statusChanged: 'Estado cambió de',
        to: 'a',
        scoresIdentical: 'Las puntuaciones de confianza son idénticas',
        confidenceImproved: 'Confianza mejorada en',
        confidenceDecreased: 'Confianza disminuida en',
        points: 'puntos',
        close: 'Cerrar'
      },
      history: {
        title: 'Historial de decisiones',
        decision: 'decisión',
        decisions: 'decisiones',
        recorded: 'registradas',
        searchPlaceholder: 'Buscar por escenario o estado...',
        noHistory: 'Aún no hay decisiones',
        noHistoryText: 'Su historial de decisiones aparecerá aquí',
        noMatching: 'No hay historial coincidente',
        tryDifferent: 'Pruebe un término de búsqueda diferente',
        rerun: 'Volver a ejecutar con las mismas entradas',
        details: 'Detalles',
        hide: 'Ocultar',
        delete: 'Eliminar',
        deleteConfirm: '¿Eliminar esta decisión del historial?',
        deleteAllConfirm: 'Eliminar todas',
        inputData: 'Datos de entrada',
        fullExplanation: 'Explicación completa'
      },
      loading: {
        default: 'Cargando...',
        scenarios: 'Cargando escenarios...',
        analyzing: 'Analizando con IA...'
      },
      errors: {
        somethingWrong: 'Algo salió mal',
        noScenarios: 'No hay escenarios disponibles'
      },
      empty: {
        title: 'Seleccione un escenario para comenzar',
        subtitle: 'Elija un escenario de decisión de arriba para iniciar el proceso de evaluación de IA'
      }
    },
    governanceAutopilot: {
      hero: {
        badge: 'GOVERNANCE AUTOPILOT',
        title: 'Capa constitucional para autoridad y límites de IA',
        intro1: 'Los sistemas de IA se están volviendo más capaces, adaptativos y autónomos. Pero en entornos de alto riesgo y del sector público, la capacidad por sí sola no es suficiente.',
        intro2: 'La autoridad debe definirse. Los límites deben aplicarse. Y las decisiones deben permanecer legítimas bajo incertidumbre.',
        intro3: 'Governance Autopilot proporciona la capa constitucional de la plataforma: los mecanismos que determinan qué puede hacer el sistema, qué debe rechazar y cómo se preserva la autoridad delegada en tiempo de ejecución.',
        layerType: 'Constitucional',
        enforcement: 'Activo en tiempo real',
        transparency: 'Listo para auditoría'
      },
      purpose: {
        title: 'Por qué existe esta capa',
        delegatedAuthority: { title: 'Autoridad delegada', desc: 'Quién otorga poder al sistema y qué incluye ese poder' },
        admissibility: { title: 'Admisibilidad', desc: 'Qué decisiones puede tomar el sistema' },
        runtimeBoundaries: { title: 'Límites de ejecución', desc: 'Qué nunca debe cruzar el sistema durante la operación' },
        refusalLogic: { title: 'Lógica de rechazo', desc: 'Cuándo el sistema debe decir "no" independientemente de la solicitud' },
        intentPreservation: { title: 'Preservación de la intención', desc: 'Cómo se mantiene la intención institucional bajo incertidumbre' },
        constitutionalFoundation: { title: 'Fundamento constitucional', desc: 'Principios inmutables que garantizan una IA confiable' }
      },
      governanceModel: {
        title: 'Modelo de gobernanza',
        subtitle: '10 mecanismos constitucionales que definen la autoridad y límites de IA'
      },
      boundaryTest: {
        title: 'Prueba de límites',
        subtitle: 'Vea cómo la capa constitucional evalúa una acción propuesta',
        context: 'Contexto',
        describeAction: 'Describa la acción',
        evaluate: 'Evaluar',
        status: 'Estado',
        reason: 'Razón',
        ruleReference: 'Referencia de regla',
        authorityLevel: 'Nivel de autoridad',
        viewJson: 'Ver respuesta JSON',
        hideJson: 'Ocultar respuesta JSON',
        admissible: 'ADMISIBLE',
        escalationRequired: 'ESCALACIÓN REQUERIDA',
        inadmissible: 'INADMISIBLE'
      },
      audit: {
        title: 'Vista de auditoría y cumplimiento',
        subtitle: 'Reglas constitucionales, lógica de rechazo y trazabilidad',
        governanceRules: 'Reglas de gobernanza',
        version: 'Versión',
        viewFullJson: 'Ver JSON completo',
        hideFullJson: 'Ocultar JSON completo',
        refusalLogic: 'Lógica de rechazo',
        authorityChain: 'Cadena de autoridad',
        level: 'Nivel',
        can: 'Puede',
        cannot: 'No puede'
      },
      integration: {
        title: 'Cómo encaja esta capa',
        visitLayer: 'Visitar capa',
        current: 'Actual'
      },
      footer: {
        title: 'El fundamento constitucional de una IA confiable',
        text: 'Governance Autopilot no reemplaza el motor de decisiones. Define los límites dentro de los cuales debe operar el motor de decisiones.'
      }
    },
    cta: {
      title: '¿Listo para modernizar las operaciones de gobernanza?',
      subtitle: 'Únase a las instituciones líderes que aprovechan la IA para una gobernanza transparente y eficiente',
      primaryButton: 'Solicitar demostración',
      secondaryButton: 'Ver documentación'
    },
    footer: {
      platform: 'Plataforma',
      solutions: 'Soluciones',
      resources: 'Recursos',
      company: 'Empresa',
      copyright: '2024 IVYAR LLC. Todos los derechos reservados.',
      privacy: 'Política de privacidad',
      terms: 'Términos de servicio'
    }, publicFeedback: {
      title: 'Sistema de Retroalimentación Pública',
      backToHbs: 'Volver al Portal HBS',
      stats: {
        totalSubmissions: 'Total de Envíos',
        avgResponseTime: 'Tiempo Promedio de Respuesta',
        resolvedIssues: 'Problemas Resueltos',
        activeCases: 'Casos Activos'
      },
      tabs: {
        overview: 'Resumen',
        submit: 'Enviar Comentarios',
        analytics: 'Analítica',
        youSaid: 'Dijiste, Hicimos'
      },
      overview: {
        title: 'Comentarios por Categoría',
        submissions: 'envíos'
      },
      submit: {
        title: 'Envía tus Comentarios',
        selectCategory: 'Seleccionar Categoría',
        subject: 'Asunto',
        subjectPlaceholder: 'Breve descripción...',
        message: 'Tus Comentarios',
        messagePlaceholder: 'Comparte tus comentarios...',
        email: 'Email (opcional)',
        emailPlaceholder: 'tu@email.com',
        submitButton: 'Enviar Comentarios',
        thankYou: '¡Gracias!',
        submitted: 'Tus comentarios han sido enviados exitosamente.',
        reference: 'Referencia'
      },
      analytics: {
        title: 'Tendencias de Comentarios',
        exportReport: 'Exportar Informe'
      },
      youSaid: {
        title: 'Dijiste, Hicimos — Acciones Recientes',
        impact: 'Impacto'
      },
      categories: {
        healthcare: 'Salud',
        education: 'Educación',
        infrastructure: 'Infraestructura',
        safety: 'Seguridad Pública',
        environment: 'Medio Ambiente',
        other: 'Otros Servicios'
      },
      status: {
        completed: 'Completado',
        inProgress: 'En Progreso',
        planned: 'Planificado'
      }
    }
  }
};

export const GB_TRANSLATIONS = CORE_TRANSLATIONS.us;
export const EU_TRANSLATIONS = CORE_TRANSLATIONS.us;

export default CORE_TRANSLATIONS;
