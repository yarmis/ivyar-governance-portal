import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, userId, level, answers, lang = 'en' } = await request.json();

    if (action === 'start-exam') {
      return NextResponse.json({ success: true, ...getExam(level, lang) });
    }
    if (action === 'submit-exam') {
      return NextResponse.json({ success: true, ...gradeExam(level, answers, lang) });
    }
    if (action === 'get-certificate') {
      return NextResponse.json({ success: true, ...generateCertificate(userId, level, lang) });
    }
    if (action === 'verify') {
      return NextResponse.json({ success: true, ...verifyCertificate(userId) });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getExam(level: string, lang: string): any {
  const exams: Record<string, any> = {
    'practitioner': {
      title: lang === 'uk' ? 'HBS Практик — Сертифікаційний Екзамен' : 'HBS Practitioner Certification Exam',
      level: 'Practitioner',
      duration: 60,
      passingScore: 75,
      totalQuestions: 25,
      sections: [
        {
          name: 'Core Principles',
          questions: [
            { id: 1, type: 'multiple', question: 'What is the primary purpose of HBS?', options: ['Maximize donor satisfaction', 'Ethical budget support in humanitarian contexts', 'Reduce operational costs', 'Increase organizational revenue'], correct: 1 },
            { id: 2, type: 'multiple', question: 'How many core principles form the HBS framework?', options: ['5', '6', '8', '10'], correct: 2 },
            { id: 3, type: 'truefalse', question: 'Human dignity requires consulting beneficiaries in decision-making.', correct: true },
            { id: 4, type: 'multiple', question: 'Which is NOT an HBS core principle?', options: ['Human Dignity', 'Transparency', 'Profit Maximization', 'Do No Harm'], correct: 2 },
            { id: 5, type: 'multiple', question: 'Transparency in HBS means:', options: ['Hiding sensitive information', 'Clear information for all stakeholders', 'Only reporting to donors', 'Avoiding accountability'], correct: 1 }
          ]
        },
        {
          name: 'Governance',
          questions: [
            { id: 6, type: 'multiple', question: 'Who should be represented in HBS governance?', options: ['Only donors', 'Only government', 'Multiple stakeholders including beneficiaries', 'Only implementing organizations'], correct: 2 },
            { id: 7, type: 'truefalse', question: 'Governance structures should have checks and balances.', correct: true },
            { id: 8, type: 'multiple', question: 'What is a boundary condition?', options: ['Geographic limit', 'Ethical red line that cannot be crossed', 'Budget ceiling', 'Time constraint'], correct: 1 },
            { id: 9, type: 'multiple', question: 'The Decision Tree helps with:', options: ['Planting trees', 'Structured decision-making', 'Environmental assessment', 'Staff management'], correct: 1 },
            { id: 10, type: 'truefalse', question: 'Emergency decisions can bypass all governance requirements.', correct: false }
          ]
        },
        {
          name: 'Risk Management',
          questions: [
            { id: 11, type: 'multiple', question: 'Risk assessment should happen:', options: ['Only at project start', 'Continuously throughout implementation', 'Only when problems occur', 'Never'], correct: 1 },
            { id: 12, type: 'multiple', question: 'Which risk category is NOT part of HBS framework?', options: ['Financial', 'Operational', 'Astrological', 'Ethical'], correct: 2 },
            { id: 13, type: 'truefalse', question: 'Low-probability high-impact risks can be ignored.', correct: false },
            { id: 14, type: 'multiple', question: 'Risk mitigation strategies should be:', options: ['Secret', 'Documented and tracked', 'Optional', 'Generic'], correct: 1 },
            { id: 15, type: 'multiple', question: 'The Ethical Risk Engine analyzes:', options: ['Only financial risks', 'Multiple risk categories in real-time', 'Historical data only', 'Weather patterns'], correct: 1 }
          ]
        },
        {
          name: 'Practical Application',
          questions: [
            { id: 16, type: 'scenario', question: 'A donor wants quick disbursement but due diligence is incomplete. You should:', options: ['Disburse immediately to please donor', 'Complete due diligence first', 'Ignore the situation', 'Blame the compliance team'], correct: 1 },
            { id: 17, type: 'scenario', question: 'Community leaders disagree with your needs assessment. You should:', options: ['Ignore them', 'Engage in dialogue and review assessment', 'Cancel the project', 'Report them'], correct: 1 },
            { id: 18, type: 'scenario', question: 'You discover minor financial irregularities. You should:', options: ['Cover it up', 'Investigate and report appropriately', 'Ignore if amount is small', 'Blame subordinates'], correct: 1 },
            { id: 19, type: 'multiple', question: 'Conflict of interest should be:', options: ['Hidden', 'Disclosed and managed', 'Ignored', 'Encouraged'], correct: 1 },
            { id: 20, type: 'truefalse', question: 'Community participation slows down implementation and should be minimized.', correct: false }
          ]
        },
        {
          name: 'Ethics & Accountability',
          questions: [
            { id: 21, type: 'multiple', question: 'Do No Harm principle requires:', options: ['Avoiding all action', 'Analyzing potential negative impacts', 'Maximizing speed', 'Reducing costs'], correct: 1 },
            { id: 22, type: 'truefalse', question: 'Accountability means being answerable to all stakeholders.', correct: true },
            { id: 23, type: 'multiple', question: 'When ethical and operational goals conflict:', options: ['Operational always wins', 'Ethical considerations take precedence', 'Flip a coin', 'Ask the donor'], correct: 1 },
            { id: 24, type: 'scenario', question: 'A partner asks you to inflate beneficiary numbers. You should:', options: ['Comply to maintain relationship', 'Refuse and document the request', 'Negotiate a compromise', 'Ignore'], correct: 1 },
            { id: 25, type: 'truefalse', question: 'Whistleblower protection is important for accountability.', correct: true }
          ]
        }
      ]
    },
    'specialist': {
      title: 'HBS Specialist Certification Exam',
      level: 'Specialist',
      duration: 90,
      passingScore: 80,
      totalQuestions: 40,
      sections: [
        {
          name: 'Advanced Governance',
          questions: [
            { id: 1, type: 'multiple', question: 'Multi-stakeholder governance requires:', options: ['Simple majority voting', 'Balanced representation and clear mandates', 'Donor control', 'Government override'], correct: 1 },
            { id: 2, type: 'scenario', question: 'Two governance bodies have conflicting decisions. Resolution should:', options: ['Favor the more powerful', 'Follow established arbitration protocols', 'Ignore both', 'Delay indefinitely'], correct: 1 },
            { id: 3, type: 'multiple', question: 'Governance capture refers to:', options: ['Physical security', 'Undue influence by single stakeholder', 'Data storage', 'Meeting attendance'], correct: 1 },
            { id: 4, type: 'truefalse', question: 'Tokenistic participation satisfies governance requirements.', correct: false },
            { id: 5, type: 'multiple', question: 'Effective oversight requires:', options: ['Independence and access to information', 'Loyalty to management', 'Minimal involvement', 'Secrecy'], correct: 0 }
          ]
        },
        {
          name: 'Complex Risk Scenarios',
          questions: [
            { id: 6, type: 'scenario', question: 'Multiple high-severity risks emerge simultaneously. Priority should be:', options: ['Address all equally', 'Triage based on impact and urgency', 'Address easiest first', 'Ignore until resources available'], correct: 1 },
            { id: 7, type: 'multiple', question: 'Cascading risks occur when:', options: ['Risks are unrelated', 'One risk triggers others', 'Risks are documented', 'Risks are mitigated'], correct: 1 },
            { id: 8, type: 'truefalse', question: 'Risk appetite should be explicitly defined by governance.', correct: true },
            { id: 9, type: 'scenario', question: 'A mitigation strategy creates new risks. You should:', options: ['Ignore secondary risks', 'Assess and manage secondary risks', 'Abandon mitigation', 'Hide the analysis'], correct: 1 },
            { id: 10, type: 'multiple', question: 'Systemic risk differs from operational risk in:', options: ['Documentation requirements', 'Potential to affect entire system', 'Reporting frequency', 'Color coding'], correct: 1 }
          ]
        }
      ]
    },
    'trainer': {
      title: 'HBS Trainer Certification Exam',
      level: 'Trainer',
      duration: 120,
      passingScore: 85,
      totalQuestions: 50,
      sections: [
        {
          name: 'Training Methodology',
          questions: [
            { id: 1, type: 'multiple', question: 'Adult learning principles emphasize:', options: ['Passive reception', 'Active participation and relevance', 'Memorization', 'Punishment for errors'], correct: 1 },
            { id: 2, type: 'truefalse', question: 'Effective training adapts to learner needs and contexts.', correct: true },
            { id: 3, type: 'multiple', question: 'Simulation-based learning is effective because:', options: ['It is entertaining', 'It provides safe practice with realistic scenarios', 'It is cheap', 'It requires no preparation'], correct: 1 }
          ]
        }
      ]
    }
  };

  return exams[level] || exams['practitioner'];
}

function gradeExam(level: string, answers: Record<number, any>, lang: string): any {
  const exam = getExam(level, lang);
  let correct = 0;
  let total = 0;
  const results: any[] = [];

  exam.sections.forEach((section: any) => {
    section.questions.forEach((q: any) => {
      total++;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) correct++;
      results.push({
        questionId: q.id,
        correct: isCorrect,
        userAnswer,
        correctAnswer: q.correct
      });
    });
  });

  const score = Math.round((correct / total) * 100);
  const passed = score >= exam.passingScore;

  return {
    score,
    passed,
    correct,
    total,
    passingScore: exam.passingScore,
    results,
    feedback: passed
      ? (lang === 'uk' ? 'Вітаємо! Ви склали екзамен.' : 'Congratulations! You passed the exam.')
      : (lang === 'uk' ? 'На жаль, ви не склали. Спробуйте ще раз.' : 'Unfortunately, you did not pass. Please try again.'),
    recommendations: passed
      ? ['Proceed to next certification level', 'Apply knowledge in practice']
      : ['Review weak areas', 'Complete additional training modules', 'Retake exam after preparation']
  };
}

function generateCertificate(userId: string, level: string, lang: string): any {
  const certId = `HBS-${level.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const issueDate = new Date().toISOString().split('T')[0];
  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0];

  return {
    certificateId: certId,
    userId,
    level: level.charAt(0).toUpperCase() + level.slice(1),
    title: `HBS ${level.charAt(0).toUpperCase() + level.slice(1)} Certificate`,
    issueDate,
    expiryDate,
    validYears: 2,
    issuedBy: 'IVYAR HBS Certification Authority',
    verificationUrl: `https://ivyar.org/verify/${certId}`,
    skills: getCertificationSkills(level),
    badge: getBadgeUrl(level)
  };
}

function getCertificationSkills(level: string): string[] {
  const skills: Record<string, string[]> = {
    'practitioner': ['HBS Core Principles', 'Basic Governance', 'Risk Awareness', 'Ethical Decision-Making'],
    'specialist': ['Advanced Governance', 'Complex Risk Management', 'Multi-Stakeholder Coordination', 'Strategic Planning'],
    'trainer': ['Training Methodology', 'Curriculum Development', 'Assessment Design', 'Facilitation Skills']
  };
  return skills[level] || skills['practitioner'];
}

function getBadgeUrl(level: string): string {
  return `/badges/hbs-${level}.svg`;
}

function verifyCertificate(certId: string): any {
  // In production, this would check a database
  if (certId && certId.startsWith('HBS-')) {
    return {
      valid: true,
      status: 'Active',
      message: 'Certificate is valid and active'
    };
  }
  return {
    valid: false,
    status: 'Not Found',
    message: 'Certificate not found in registry'
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Certification System',
    version: '1.5',
    levels: ['practitioner', 'specialist', 'trainer'],
    actions: ['start-exam', 'submit-exam', 'get-certificate', 'verify']
  });
}