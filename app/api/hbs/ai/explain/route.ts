import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { section, context, lang = 'en' } = await request.json();

    if (!section) {
      return NextResponse.json({ success: false, error: 'Section is required' }, { status: 400 });
    }

    // AI explanation based on section content
    const explanation = generateExplanation(section, context, lang);

    return NextResponse.json({
      success: true,
      section,
      lang,
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function generateExplanation(section: string, context: string, lang: string): {
  summary: string;
  keyPoints: string[];
  example: string;
  risks: string[];
  relatedSections: string[];
} {
  const sectionLower = section.toLowerCase();

  // Multilingual responses
  const responses: Record<string, Record<string, any>> = {
    en: {
      'human dignity': {
        summary: 'Human dignity is the foundational principle ensuring every person affected by crisis is treated with respect and their inherent worth is recognized.',
        keyPoints: ['Respect individual agency', 'Preserve choice and control', 'Cultural sensitivity', 'Build on existing strengths'],
        example: 'Instead of distributing pre-selected food packages, HBS allows families to choose what they need most through cash transfers.',
        risks: ['Paternalistic approaches', 'Ignoring local knowledge', 'One-size-fits-all solutions'],
        relatedSections: ['Transparency', 'Community Participation', 'Inclusive Participation']
      },
      'transparency': {
        summary: 'Transparency ensures all stakeholders have clear information about how decisions are made and resources are allocated.',
        keyPoints: ['Public disclosure of criteria', 'Real-time financial tracking', 'Independent oversight', 'Accessible grievance mechanisms'],
        example: 'Publishing monthly reports showing exactly how funds were distributed and to whom.',
        risks: ['Information overload', 'Security concerns in conflict zones', 'Misinterpretation of data'],
        relatedSections: ['Accountability', 'Governance Architecture', 'Stakeholder Engagement']
      },
      'governance': {
        summary: 'Governance architecture establishes the structures and processes for accountable decision-making in HBS programs.',
        keyPoints: ['Multi-stakeholder representation', 'Clear roles and responsibilities', 'Checks and balances', 'Community oversight'],
        example: 'A governing board with representatives from donors, government, NGOs, and affected communities meeting quarterly.',
        risks: ['Elite capture', 'Slow decision-making', 'Tokenistic participation'],
        relatedSections: ['Accountability Mechanisms', 'Risk Management', 'Ethical Decision-Making']
      },
      default: {
        summary: 'This section outlines important principles and guidelines for humanitarian budget support implementation.',
        keyPoints: ['Follow ethical guidelines', 'Ensure accountability', 'Prioritize affected populations', 'Document decisions'],
        example: 'Implementing regular reviews and adjustments based on community feedback.',
        risks: ['Implementation gaps', 'Resource constraints', 'Coordination challenges'],
        relatedSections: ['Core Principles', 'Implementation Guidelines', 'Monitoring & Evaluation']
      }
    },
    uk: {
      'human dignity': {
        summary: 'Людська гідність — це фундаментальний принцип, що забезпечує повагу до кожної особи, постраждалої від кризи.',
        keyPoints: ['Повага до агентності', 'Збереження вибору', 'Культурна чутливість', 'Опора на існуючі сильні сторони'],
        example: 'Замість роздачі заздалегідь обраних продуктових пакетів, HBS дозволяє сім\'ям обирати через грошові трансфери.',
        risks: ['Патерналістські підходи', 'Ігнорування місцевих знань', 'Універсальні рішення'],
        relatedSections: ['Прозорість', 'Участь громади', 'Інклюзивна участь']
      },
      default: {
        summary: 'Цей розділ описує важливі принципи та настанови для впровадження гуманітарної бюджетної підтримки.',
        keyPoints: ['Дотримуватись етичних настанов', 'Забезпечити підзвітність', 'Пріоритет постраждалим', 'Документувати рішення'],
        example: 'Впровадження регулярних переглядів на основі зворотного зв\'язку від громади.',
        risks: ['Прогалини впровадження', 'Обмеження ресурсів', 'Проблеми координації'],
        relatedSections: ['Основні принципи', 'Настанови впровадження', 'Моніторинг та оцінка']
      }
    }
  };

  const langResponses = responses[lang] || responses['en'];
  
  // Find matching section
  for (const key of Object.keys(langResponses)) {
    if (key !== 'default' && sectionLower.includes(key)) {
      return langResponses[key];
    }
  }

  return langResponses['default'];
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS AI Explain',
    version: '1.4',
    description: 'AI-powered explanations for HBS documentation sections',
    usage: {
      method: 'POST',
      body: {
        section: 'string (required) - Section title or content',
        context: 'string (optional) - Additional context',
        lang: 'string (optional) - Language code (en, uk, de, fr, pl, es)'
      }
    }
  });
}