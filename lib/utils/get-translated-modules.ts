import { autopilotModules, type AutopilotModuleDefinition } from '@/data/autopilot-modules';

// Import module translations
const MODULE_TRANSLATIONS = {
  ua: {
    materials: {
      name: 'AI Відповідності Матеріалів',
      description: 'Автоматизована перевірка будівельних матеріалів на відповідність стандартам безпеки та будівельним нормам',
      capabilities: [
        'Перевірка матеріалів в реальному часі',
        'Перевірка відповідності будівельним нормам',
        'Валідація стандартів безпеки',
        'Відстеження сертифікації постачальників'
      ]
    },
    zoning: {
      name: 'AI Інтелектуального Зонування',
      description: 'Розумний аналіз зонування та перевірка відповідності для розвитку земель',
      capabilities: [
        'Інтерпретація кодексу зонування',
        'Відповідність землекористування',
        'Виявлення вимог для відхилень',
        'Аналіз можливості розвитку'
      ]
    },
    violations: {
      name: 'AI Виявлення Порушень',
      description: 'Автоматичне виявлення та класифікація порушень будівельних норм',
      capabilities: [
        'Розпізнавання патернів порушень',
        'Класифікація за ступенем тяжкості',
        'Автоматизована система повідомлень',
        'Відстеження термінів усунення'
      ]
    },
    donors: {
      name: 'AI Підбору Донорів',
      description: 'Інтелектуальне зіставлення проектів розвитку з пріоритетами та фінансуванням донорів',
      capabilities: [
        'Оцінка узгодження пріоритетів',
        'Виявлення можливостей фінансування',
        'Моделювання прогнозу впливу',
        'Зіставлення з вимогами донорів'
      ]
    },
    'us-construction': {
      name: 'AI Будівництва США',
      description: 'Автоматизована обробка та схвалення дозволів і документації на будівництво в США',
      capabilities: [
        'Обробка заявок на дозволи',
        'Перевірка повноти документів',
        'Перевірка відповідності нормам',
        'Оцінка термінів виконання'
      ]
    },
    geo: {
      name: 'AI Геопросторового Аналізу',
      description: 'Передова геопросторова аналітика для розвитку земель та планування інфраструктури',
      capabilities: [
        'Аналіз рельєфу місцевості',
        'Оцінка можливості інфраструктури',
        'Оцінка екологічного впливу',
        'Оптимальний вибір місця'
      ]
    },
    procurement: {
      name: 'AI Закупівель',
      description: 'Інтелектуальний вибір постачальників та оптимізація закупівель',
      capabilities: [
        'Оцінка та ранжування постачальників',
        'Виявлення цінових аномалій',
        'Відповідність контрактам',
        'Оцінка ризиків'
      ]
    },
    freight: {
      name: 'AI Оптимізації Вантажів',
      description: 'Розумна логістика та маршрутизація вантажів для будівельних матеріалів',
      capabilities: [
        'Оптимізація маршрутів',
        'Мінімізація витрат',
        'Планування доставок',
        'Вибір перевізника'
      ]
    },
    routing: {
      name: 'AI Інтелектуальної Маршрутизації',
      description: 'Передові алгоритми маршрутизації для логістики та оптимізації доставок',
      capabilities: [
        'Планування маршрутів з кількома зупинками',
        'Аналіз транспортних потоків',
        'Оптимізація часових вікон',
        'Максимізація паливної ефективності'
      ]
    },
    hbs: {
      name: 'AI Прогнозування Бюджету',
      description: 'Прогнозний аналіз бюджету та фінансове планування для інфраструктурних проектів',
      capabilities: [
        'Прогнозування витрат',
        'Аналіз відхилень бюджету',
        'Оптимізація розподілу ресурсів',
        'Моделювання фінансових ризиків'
      ]
    }
  },
  
  es: {
    materials: {
      name: 'IA de Cumplimiento de Materiales',
      description: 'Verificación automatizada de materiales de construcción contra estándares de seguridad y códigos de construcción',
      capabilities: [
        'Verificación de materiales en tiempo real',
        'Comprobación de cumplimiento del código de construcción',
        'Validación de estándares de seguridad',
        'Seguimiento de certificación de proveedores'
      ]
    },
    zoning: {
      name: 'IA de Inteligencia de Zonificación',
      description: 'Análisis inteligente de zonificación y verificación de cumplimiento para desarrollo de tierras',
      capabilities: [
        'Interpretación del código de zonificación',
        'Cumplimiento de uso de suelo',
        'Detección de requisitos de varianza',
        'Análisis de viabilidad de desarrollo'
      ]
    },
    violations: {
      name: 'IA de Detección de Violaciones',
      description: 'Detección y clasificación automatizada de violaciones del código de construcción',
      capabilities: [
        'Reconocimiento de patrones de violación',
        'Clasificación de severidad',
        'Sistema de notificación automatizado',
        'Seguimiento de cronograma de cumplimiento'
      ]
    },
    donors: {
      name: 'IA de Emparejamiento de Donantes',
      description: 'Emparejamiento inteligente de proyectos de desarrollo con prioridades y financiamiento de donantes',
      capabilities: [
        'Puntuación de alineación de prioridades',
        'Detección de oportunidades de financiamiento',
        'Modelado de predicción de impacto',
        'Coincidencia de requisitos de donantes'
      ]
    },
    'us-construction': {
      name: 'IA de Construcción de EE.UU.',
      description: 'Procesamiento y aprobación automatizados de permisos y documentación de construcción de EE.UU.',
      capabilities: [
        'Procesamiento de solicitud de permiso',
        'Verificación de completitud de documentos',
        'Comprobación de cumplimiento de código',
        'Estimación de cronograma'
      ]
    },
    geo: {
      name: 'IA de Análisis Geoespacial',
      description: 'Inteligencia geoespacial avanzada para desarrollo de tierras y planificación de infraestructura',
      capabilities: [
        'Análisis de terreno',
        'Viabilidad de infraestructura',
        'Evaluación de impacto ambiental',
        'Selección óptima de sitio'
      ]
    },
    procurement: {
      name: 'IA de Adquisiciones',
      description: 'Selección inteligente de proveedores y optimización de adquisiciones',
      capabilities: [
        'Puntuación y clasificación de proveedores',
        'Detección de anomalías de precios',
        'Cumplimiento de contratos',
        'Evaluación de riesgos'
      ]
    },
    freight: {
      name: 'IA de Optimización de Carga',
      description: 'Logística inteligente y enrutamiento de carga para materiales de construcción',
      capabilities: [
        'Optimización de rutas',
        'Minimización de costos',
        'Programación de entregas',
        'Selección de transportista'
      ]
    },
    routing: {
      name: 'IA de Inteligencia de Enrutamiento',
      description: 'Algoritmos avanzados de enrutamiento para logística y optimización de entregas',
      capabilities: [
        'Planificación de rutas con múltiples paradas',
        'Análisis de patrones de tráfico',
        'Optimización de ventanas de tiempo',
        'Maximización de eficiencia de combustible'
      ]
    },
    hbs: {
      name: 'IA de Pronóstico de Presupuesto',
      description: 'Análisis predictivo de presupuesto y planificación financiera para proyectos de infraestructura',
      capabilities: [
        'Pronóstico de costos',
        'Análisis de varianza de presupuesto',
        'Optimización de asignación de recursos',
        'Modelado de riesgo financiero'
      ]
    }
  }
};

type LocaleCode = 'us' | 'ua' | 'es';

export function getTranslatedModules(locale: LocaleCode): AutopilotModuleDefinition[] {
  // For US (English), return original modules
  if (locale === 'us') {
    return autopilotModules;
  }

  // For other locales, merge with translations
  return autopilotModules.map(module => {
    const translation = MODULE_TRANSLATIONS[locale]?.[module.id as keyof typeof MODULE_TRANSLATIONS['ua']];
    
    if (!translation) {
      // Fallback to English if translation not found
      return module;
    }

    return {
      ...module,
      name: translation.name,
      description: translation.description,
      capabilities: translation.capabilities
    };
  });
}
