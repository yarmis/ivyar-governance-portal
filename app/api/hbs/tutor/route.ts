import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, topic, level, lang = 'en' } = await request.json();

    if (action === 'lesson') {
      return NextResponse.json({ success: true, ...getLesson(topic, level, lang) });
    }
    if (action === 'quiz') {
      return NextResponse.json({ success: true, ...getQuiz(topic, level, lang) });
    }
    if (action === 'case') {
      return NextResponse.json({ success: true, ...getCase(topic, lang) });
    }
    if (action === 'feedback') {
      return NextResponse.json({ success: true, ...getFeedback(request) });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getLesson(topic: string, level: string, lang: string) {
  const lessons: Record<string, any> = {
    'human-dignity': {
      title: lang === 'uk' ? 'Людська гідність' : 'Human Dignity',
      objectives: [
        lang === 'uk' ? 'Зрозуміти принцип людської гідності' : 'Understand human dignity principle',
        lang === 'uk' ? 'Застосовувати на практиці' : 'Apply in practice',
        lang === 'uk' ? 'Розпізнавати порушення' : 'Recognize violations'
      ],
      content: [
        { type: 'concept', text: lang === 'uk' ? 'Людська гідність — фундаментальне право кожної людини на повагу.' : 'Human dignity is the fundamental right of every person to be treated with respect.' },
        { type: 'example', text: lang === 'uk' ? 'Приклад: Надання вибору бенефіціарам замість нав\'язування допомоги.' : 'Example: Giving beneficiaries choice instead of imposing aid.' },
        { type: 'warning', text: lang === 'uk' ? 'Уникайте патерналістських підходів.' : 'Avoid paternalistic approaches.' }
      ],
      keyPoints: [
        'Respect individual agency',
        'Preserve choice and control',
        'Cultural sensitivity',
        'Build on strengths'
      ],
      nextTopic: 'transparency',
      estimatedTime: '15 min'
    },
    'transparency': {
      title: lang === 'uk' ? 'Прозорість' : 'Transparency',
      objectives: [
        'Understand transparency mechanisms',
        'Implement disclosure practices',
        'Build stakeholder trust'
      ],
      content: [
        { type: 'concept', text: 'Transparency ensures all stakeholders have access to clear information about decisions and resource allocation.' },
        { type: 'example', text: 'Publishing monthly financial reports with detailed breakdowns.' },
        { type: 'warning', text: 'Balance transparency with security in conflict zones.' }
      ],
      keyPoints: ['Public disclosure', 'Real-time tracking', 'Independent oversight', 'Grievance mechanisms'],
      nextTopic: 'accountability',
      estimatedTime: '20 min'
    },
    'accountability': {
      title: 'Accountability',
      objectives: ['Define accountability structures', 'Implement checks and balances', 'Create feedback loops'],
      content: [
        { type: 'concept', text: 'Accountability means being answerable for actions and decisions to all stakeholders.' },
        { type: 'example', text: 'Regular audits and community feedback sessions.' },
        { type: 'warning', text: 'Avoid accountability that exists only on paper.' }
      ],
      keyPoints: ['Clear responsibilities', 'Regular reporting', 'Community feedback', 'Corrective actions'],
      nextTopic: 'do-no-harm',
      estimatedTime: '25 min'
    },
    'do-no-harm': {
      title: 'Do No Harm',
      objectives: ['Analyze potential negative impacts', 'Implement safeguards', 'Monitor unintended consequences'],
      content: [
        { type: 'concept', text: 'Do No Harm ensures interventions do not exacerbate conflict, inequality, or vulnerability.' },
        { type: 'example', text: 'Conducting conflict sensitivity analysis before program implementation.' },
        { type: 'warning', text: 'Even well-intentioned aid can cause harm if not carefully planned.' }
      ],
      keyPoints: ['Conflict sensitivity', 'Environmental safeguards', 'Protection integration', 'Harm monitoring'],
      nextTopic: 'governance',
      estimatedTime: '30 min'
    },
    'governance': {
      title: 'Governance Architecture',
      objectives: ['Design governance structures', 'Balance stakeholder representation', 'Ensure effective oversight'],
      content: [
        { type: 'concept', text: 'Governance architecture establishes structures for accountable decision-making.' },
        { type: 'example', text: 'Multi-stakeholder steering committee with community representation.' },
        { type: 'warning', text: 'Avoid governance capture by any single stakeholder group.' }
      ],
      keyPoints: ['Balanced representation', 'Clear mandates', 'Decision protocols', 'Oversight mechanisms'],
      nextTopic: 'risk-management',
      estimatedTime: '35 min'
    },
    'risk-management': {
      title: 'Risk Management',
      objectives: ['Identify risk categories', 'Assess probability and impact', 'Develop mitigation strategies'],
      content: [
        { type: 'concept', text: 'Risk management is the systematic process of identifying, assessing, and mitigating risks.' },
        { type: 'example', text: 'Risk register with regular updates and mitigation tracking.' },
        { type: 'warning', text: 'Do not ignore low-probability, high-impact risks.' }
      ],
      keyPoints: ['Risk identification', 'Impact assessment', 'Mitigation planning', 'Continuous monitoring'],
      nextTopic: null,
      estimatedTime: '30 min'
    }
  };

  return lessons[topic] || lessons['human-dignity'];
}

function getQuiz(topic: string, level: string, lang: string) {
  const quizzes: Record<string, any> = {
    'human-dignity': {
      title: 'Human Dignity Quiz',
      questions: [
        {
          id: 1,
          type: 'multiple',
          question: 'What is the core principle of human dignity in HBS?',
          options: ['Speed of delivery', 'Cost efficiency', 'Respect for individual agency', 'Donor satisfaction'],
          correct: 2,
          explanation: 'Human dignity prioritizes respect for individual agency and inherent worth of every person.'
        },
        {
          id: 2,
          type: 'multiple',
          question: 'Which approach violates human dignity?',
          options: ['Giving beneficiaries choice', 'Paternalistic decision-making', 'Cultural sensitivity', 'Building on strengths'],
          correct: 1,
          explanation: 'Paternalistic approaches that impose solutions without consultation violate dignity.'
        },
        {
          id: 3,
          type: 'truefalse',
          question: 'Human dignity requires consulting beneficiaries before making decisions about their aid.',
          correct: true,
          explanation: 'Meaningful participation is essential to respecting human dignity.'
        },
        {
          id: 4,
          type: 'scenario',
          question: 'A donor wants to distribute winter coats, but the community needs food. What should you do?',
          options: ['Distribute coats as planned', 'Consult community and advocate for needs assessment', 'Refuse the donation', 'Accept both items'],
          correct: 1,
          explanation: 'Respecting dignity means advocating for community-identified needs.'
        }
      ],
      passingScore: 75,
      timeLimit: 600
    },
    'transparency': {
      title: 'Transparency Quiz',
      questions: [
        {
          id: 1,
          type: 'multiple',
          question: 'What is the primary goal of transparency in HBS?',
          options: ['Impress donors', 'Build stakeholder trust', 'Create paperwork', 'Meet legal requirements'],
          correct: 1,
          explanation: 'Transparency builds trust among all stakeholders including beneficiaries.'
        },
        {
          id: 2,
          type: 'multiple',
          question: 'Which is NOT a transparency mechanism?',
          options: ['Public financial reports', 'Community feedback sessions', 'Secret decision-making', 'Open data platforms'],
          correct: 2,
          explanation: 'Secret decision-making contradicts transparency principles.'
        },
        {
          id: 3,
          type: 'truefalse',
          question: 'In conflict zones, some information may need to be restricted for security.',
          correct: true,
          explanation: 'Transparency must be balanced with security considerations.'
        }
      ],
      passingScore: 70,
      timeLimit: 480
    },
    'governance': {
      title: 'Governance Quiz',
      questions: [
        {
          id: 1,
          type: 'multiple',
          question: 'What is governance architecture?',
          options: ['Building design', 'Decision-making structures', 'IT infrastructure', 'Financial systems'],
          correct: 1,
          explanation: 'Governance architecture refers to structures and processes for decision-making.'
        },
        {
          id: 2,
          type: 'multiple',
          question: 'Who should be represented in HBS governance?',
          options: ['Only donors', 'Only government', 'Multiple stakeholders including beneficiaries', 'Only implementing organizations'],
          correct: 2,
          explanation: 'Inclusive governance requires representation from all stakeholder groups.'
        }
      ],
      passingScore: 75,
      timeLimit: 420
    }
  };

  return quizzes[topic] || quizzes['human-dignity'];
}

function getCase(topic: string, lang: string) {
  const cases: Record<string, any> = {
    'human-dignity': {
      title: 'Case Study: Emergency Food Distribution',
      scenario: 'You are managing food distribution in a crisis zone. A large shipment of culturally inappropriate food has arrived. Local leaders request different food items, but changing the order will delay distribution by 2 weeks.',
      stakeholders: ['Beneficiaries', 'Donors', 'Local leaders', 'Implementing staff'],
      questions: [
        'What are the human dignity implications of each option?',
        'How would you balance speed vs. appropriateness?',
        'What would you communicate to each stakeholder?'
      ],
      options: [
        { id: 'A', text: 'Distribute as planned for speed', dignity: 'low', risk: 'medium', outcome: 'Fast but potentially wasteful, dignity concerns' },
        { id: 'B', text: 'Delay and change order', dignity: 'high', risk: 'low', outcome: 'Slower but respectful, may face donor pushback' },
        { id: 'C', text: 'Partial distribution + advocacy for change', dignity: 'medium', risk: 'medium', outcome: 'Balanced approach, requires strong communication' }
      ],
      bestAnswer: 'B',
      learningPoints: ['Dignity sometimes requires difficult trade-offs', 'Communication with all stakeholders is crucial', 'Document decisions and rationale']
    },
    'governance': {
      title: 'Case Study: Governance Crisis',
      scenario: 'A major donor discovers that a local partner has been misreporting beneficiary numbers. The donor threatens to withdraw funding. The community depends on this program.',
      stakeholders: ['Donor', 'Local partner', 'Beneficiaries', 'Government'],
      questions: [
        'What governance failures led to this situation?',
        'How should you respond to each stakeholder?',
        'What preventive measures should be implemented?'
      ],
      options: [
        { id: 'A', text: 'Terminate partnership immediately', dignity: 'low', risk: 'high', outcome: 'Shows accountability but harms beneficiaries' },
        { id: 'B', text: 'Investigate and implement corrective measures', dignity: 'high', risk: 'medium', outcome: 'Balanced, maintains services while addressing issues' },
        { id: 'C', text: 'Minimize issue to preserve funding', dignity: 'low', risk: 'critical', outcome: 'Short-term gain, long-term trust destruction' }
      ],
      bestAnswer: 'B',
      learningPoints: ['Governance failures require transparent response', 'Beneficiary interests must be protected', 'Prevention is better than crisis management']
    }
  };

  return cases[topic] || cases['human-dignity'];
}

function getFeedback(request: any) {
  return {
    message: 'Feedback recorded successfully',
    recommendations: ['Review weak areas', 'Practice more scenarios', 'Take advanced modules']
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS AI Governance Tutor',
    version: '1.5',
    actions: ['lesson', 'quiz', 'case', 'feedback'],
    topics: ['human-dignity', 'transparency', 'accountability', 'do-no-harm', 'governance', 'risk-management']
  });
}