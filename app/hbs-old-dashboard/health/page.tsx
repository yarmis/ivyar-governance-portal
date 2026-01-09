'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

interface RiskScore {
  clinical: number;
  ethical: number;
  communication: number;
  legal: number;
  emotional: number;
  reputational: number;
  composite: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

interface DecisionNode {
  id: string;
  question: string;
  yesPath: string | null;
  noPath: string | null;
  outcome?: string;
  recommendation?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

interface PatientRight {
  id: string;
  name: string;
  description: string;
  icon: string;
  articles: string[];
  actions: string[];
}

interface EthicalScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  stakeholders: string[];
  dilemma: string;
  options: { action: string; pros: string[]; cons: string[]; risk: string }[];
  recommendation: string;
  references: string[];
}

interface CommunicationProtocol {
  id: string;
  name: string;
  acronym: string;
  steps: { letter: string; step: string; description: string; tips: string[] }[];
  applicableTo: string[];
}

interface ConsentForm {
  id: string;
  name: string;
  type: 'general' | 'procedure' | 'research' | 'emergency' | 'minor';
  required: string[];
  sections: string[];
  validityPeriod: string;
}

// ============================================================================
// DATA - DECISION TREE
// ============================================================================

const DECISION_TREE: DecisionNode[] = [
  // Entry point
  { id: 'start', question: 'Is this an emergency situation requiring immediate action?', yesPath: 'emergency', noPath: 'capacity' },
  
  // Emergency branch
  { id: 'emergency', question: 'Is the patient conscious and able to communicate?', yesPath: 'emergency-consent', noPath: 'emergency-implied' },
  { id: 'emergency-implied', question: 'Is there a family member or legal guardian available?', yesPath: 'emergency-proxy', noPath: 'emergency-proceed', outcome: 'Implied consent applies - proceed with life-saving treatment', riskLevel: 'high' },
  { id: 'emergency-consent', question: 'Does the patient consent to emergency treatment?', yesPath: 'emergency-proceed', noPath: 'emergency-refusal' },
  { id: 'emergency-proceed', question: '', yesPath: null, noPath: null, outcome: 'Proceed with emergency treatment. Document all decisions.', recommendation: 'Follow emergency protocol. Ensure proper documentation.', riskLevel: 'medium' },
  { id: 'emergency-proxy', question: '', yesPath: null, noPath: null, outcome: 'Obtain proxy consent from family/guardian. Proceed with treatment.', riskLevel: 'medium' },
  { id: 'emergency-refusal', question: 'Does the patient have decision-making capacity?', yesPath: 'refusal-capacity', noPath: 'refusal-incapacity' },
  
  // Capacity assessment
  { id: 'capacity', question: 'Does the patient have full decision-making capacity?', yesPath: 'informed-consent', noPath: 'capacity-assessment' },
  { id: 'capacity-assessment', question: 'Is there a legal guardian or healthcare proxy?', yesPath: 'proxy-decision', noPath: 'ethics-consult' },
  { id: 'proxy-decision', question: '', yesPath: null, noPath: null, outcome: 'Obtain informed consent from legal proxy. Document capacity assessment.', riskLevel: 'medium' },
  
  // Informed consent flow
  { id: 'informed-consent', question: 'Has the patient received complete information about the treatment?', yesPath: 'consent-given', noPath: 'provide-information' },
  { id: 'provide-information', question: 'Can you provide adequate information in patient\'s language?', yesPath: 'information-provided', noPath: 'interpreter-needed' },
  { id: 'interpreter-needed', question: '', yesPath: null, noPath: null, outcome: 'Arrange medical interpreter. Do not proceed without proper communication.', riskLevel: 'medium' },
  { id: 'information-provided', question: 'Does the patient understand the information provided?', yesPath: 'consent-given', noPath: 'comprehension-issue' },
  { id: 'comprehension-issue', question: '', yesPath: null, noPath: null, outcome: 'Use alternative communication methods. Consider family involvement. Document comprehension efforts.', riskLevel: 'medium' },
  
  // Consent outcomes
  { id: 'consent-given', question: 'Does the patient provide informed consent?', yesPath: 'proceed-treatment', noPath: 'refusal-handling' },
  { id: 'proceed-treatment', question: '', yesPath: null, noPath: null, outcome: 'Proceed with treatment. Ensure documentation is complete.', recommendation: 'Document consent, treatment plan, and patient understanding.', riskLevel: 'low' },
  
  // Refusal handling
  { id: 'refusal-handling', question: 'Is the refusal based on religious or cultural beliefs?', yesPath: 'cultural-refusal', noPath: 'general-refusal' },
  { id: 'refusal-capacity', question: '', yesPath: null, noPath: null, outcome: 'Patient has right to refuse. Document refusal and capacity assessment. Offer alternatives.', riskLevel: 'high' },
  { id: 'refusal-incapacity', question: '', yesPath: null, noPath: null, outcome: 'Patient lacks capacity. Proceed with emergency care in best interest. Seek ethics consultation.', riskLevel: 'critical' },
  { id: 'cultural-refusal', question: '', yesPath: null, noPath: null, outcome: 'Respect cultural/religious beliefs. Explore acceptable alternatives. Document thoroughly.', riskLevel: 'medium' },
  { id: 'general-refusal', question: 'Has the patient been informed of consequences of refusal?', yesPath: 'documented-refusal', noPath: 'inform-consequences' },
  { id: 'inform-consequences', question: '', yesPath: null, noPath: null, outcome: 'Clearly explain consequences. Offer alternatives. Document discussion.', riskLevel: 'medium' },
  { id: 'documented-refusal', question: '', yesPath: null, noPath: null, outcome: 'Document refusal. Have patient sign refusal form. Offer follow-up options.', riskLevel: 'high' },
  
  // Ethics consultation
  { id: 'ethics-consult', question: '', yesPath: null, noPath: null, outcome: 'Request ethics committee consultation. Do not proceed without guidance.', recommendation: 'Complex case requiring multidisciplinary review.', riskLevel: 'critical' },
];

// ============================================================================
// DATA - PATIENT RIGHTS
// ============================================================================

const PATIENT_RIGHTS: PatientRight[] = [
  {
    id: 'information',
    name: 'Right to Information',
    description: 'You have the right to receive complete, accurate, and understandable information about your diagnosis, treatment options, risks, and prognosis.',
    icon: '📋',
    articles: ['WMA Declaration of Lisbon Art. 7', 'ECHR Article 8', 'HIPAA'],
    actions: ['Ask questions', 'Request written information', 'Seek second opinion', 'Access medical records']
  },
  {
    id: 'consent',
    name: 'Right to Informed Consent',
    description: 'No medical procedure can be performed without your voluntary and informed consent, except in emergencies when you cannot communicate.',
    icon: '✅',
    articles: ['Nuremberg Code', 'Helsinki Declaration', 'UNESCO Declaration on Bioethics'],
    actions: ['Take time to decide', 'Ask about alternatives', 'Refuse any procedure', 'Withdraw consent']
  },
  {
    id: 'privacy',
    name: 'Right to Privacy',
    description: 'All your medical information is confidential and cannot be disclosed without your permission, except as required by law.',
    icon: '🔒',
    articles: ['GDPR Article 9', 'HIPAA Privacy Rule', 'Medical Confidentiality Laws'],
    actions: ['Control who sees records', 'Request corrections', 'Know who accessed data', 'File privacy complaints']
  },
  {
    id: 'dignity',
    name: 'Right to Dignity',
    description: 'You must be treated with respect and dignity regardless of your condition, background, beliefs, or ability to pay.',
    icon: '🤝',
    articles: ['UN Declaration of Human Rights', 'WMA International Code', 'Patient Bill of Rights'],
    actions: ['Report disrespectful treatment', 'Request same-gender care', 'Maintain modesty', 'Express cultural needs']
  },
  {
    id: 'choice',
    name: 'Right to Choose',
    description: 'You have the right to choose your healthcare provider, seek second opinions, and participate in treatment decisions.',
    icon: '🎯',
    articles: ['EU Patient Rights Directive', 'National Healthcare Laws'],
    actions: ['Change doctors', 'Choose treatment facility', 'Refuse recommended treatment', 'Select alternatives']
  },
  {
    id: 'safety',
    name: 'Right to Safety',
    description: 'You have the right to safe, quality healthcare that meets established standards and minimizes risks of harm.',
    icon: '🛡️',
    articles: ['WHO Patient Safety', 'Medical Practice Standards', 'Quality Assurance Regulations'],
    actions: ['Report safety concerns', 'Ask about qualifications', 'Verify procedures', 'Request incident reports']
  },
  {
    id: 'refusal',
    name: 'Right to Refuse',
    description: 'You can refuse any treatment, test, or procedure, even if it is medically recommended, as long as you have decision-making capacity.',
    icon: '✋',
    articles: ['Autonomy Principle', 'Self-Determination Laws', 'Advance Directive Laws'],
    actions: ['Refuse treatment verbally', 'Sign refusal forms', 'Document reasons', 'Discuss alternatives']
  },
  {
    id: 'complaint',
    name: 'Right to Complain',
    description: 'You can file complaints about your care without fear of retaliation and have them investigated fairly.',
    icon: '📢',
    articles: ['Healthcare Ombudsman Laws', 'Patient Advocacy Regulations'],
    actions: ['File formal complaints', 'Contact ombudsman', 'Report to licensing boards', 'Seek legal advice']
  }
];

// ============================================================================
// DATA - ETHICAL SCENARIOS
// ============================================================================

const ETHICAL_SCENARIOS: EthicalScenario[] = [
  {
    id: 'ES-001',
    title: 'Treatment Refusal by Competent Patient',
    category: 'Autonomy',
    description: 'A competent adult patient refuses life-saving blood transfusion due to religious beliefs (Jehovah\'s Witness).',
    stakeholders: ['Patient', 'Family', 'Medical Team', 'Hospital Ethics Committee'],
    dilemma: 'Respecting patient autonomy vs. duty to preserve life',
    options: [
      { action: 'Respect refusal and seek alternatives', pros: ['Respects autonomy', 'Legal protection', 'Trust maintained'], cons: ['Potential death', 'Emotional burden'], risk: 'high' },
      { action: 'Attempt to persuade patient', pros: ['May save life', 'Due diligence shown'], cons: ['May be coercive', 'Time-consuming'], risk: 'medium' },
      { action: 'Seek court order', pros: ['Legal backing', 'Shared responsibility'], cons: ['Time delay', 'Damages trust', 'Usually unsuccessful for competent adults'], risk: 'high' }
    ],
    recommendation: 'Respect the competent patient\'s informed refusal. Document capacity assessment, offer alternatives (e.g., cell salvage, EPO), ensure patient understands consequences, and provide supportive care.',
    references: ['WMA Declaration of Lisbon', 'Sidaway v. Bethlem Royal Hospital', 'Re T (Adult: Refusal of Treatment)']
  },
  {
    id: 'ES-002',
    title: 'Breaking Bad News',
    category: 'Communication',
    description: 'You need to inform a patient about terminal cancer diagnosis. Family requests you not tell the patient.',
    stakeholders: ['Patient', 'Family', 'Oncology Team', 'Palliative Care'],
    dilemma: 'Patient\'s right to know vs. family\'s protective wishes',
    options: [
      { action: 'Tell patient directly', pros: ['Respects autonomy', 'Enables planning', 'Legal requirement'], cons: ['Family conflict', 'Patient distress'], risk: 'medium' },
      { action: 'Follow family wishes', pros: ['Family harmony', 'Cultural sensitivity'], cons: ['Violates patient rights', 'Legal liability', 'Prevents planning'], risk: 'high' },
      { action: 'Assess patient preferences first', pros: ['Patient-centered', 'Respects culture', 'Builds trust'], cons: ['Delays disclosure', 'Complex navigation'], risk: 'low' }
    ],
    recommendation: 'First assess what the patient wants to know. Use SPIKES protocol. Patient has ultimate right to information about their condition. Work with family to support patient, not to hide information.',
    references: ['SPIKES Protocol', 'Truth-Telling in Medicine', 'Cultural Competency Guidelines']
  },
  {
    id: 'ES-003',
    title: 'Resource Allocation in Emergency',
    category: 'Justice',
    description: 'ICU has one ventilator available. Two patients need it: a 75-year-old with COVID pneumonia and a 40-year-old trauma victim.',
    stakeholders: ['Both Patients', 'Families', 'ICU Team', 'Hospital Administration'],
    dilemma: 'Fair resource allocation under scarcity',
    options: [
      { action: 'First-come-first-served', pros: ['Simple', 'Non-discriminatory'], cons: ['May not maximize outcomes', 'Ignores prognosis'], risk: 'medium' },
      { action: 'Prioritize better prognosis', pros: ['Maximizes lives saved', 'Evidence-based'], cons: ['Age discrimination concerns', 'Prognostic uncertainty'], risk: 'medium' },
      { action: 'Use formal triage protocol', pros: ['Systematic', 'Defensible', 'Equitable'], cons: ['Protocol may not fit situation', 'Time required'], risk: 'low' }
    ],
    recommendation: 'Use established triage protocols that consider likelihood of survival, life-years saved, and time-sensitivity. Document decision-making process. Consider ethics consultation for complex cases.',
    references: ['WHO Emergency Triage Guidelines', 'CHEST Triage Statement', 'Utilitarian vs Egalitarian Frameworks']
  },
  {
    id: 'ES-004',
    title: 'Confidentiality vs. Public Safety',
    category: 'Confidentiality',
    description: 'Patient discloses they are HIV-positive and refuses to inform sexual partner who is also your patient.',
    stakeholders: ['Index Patient', 'Partner', 'Public Health', 'Medical Team'],
    dilemma: 'Patient confidentiality vs. duty to warn/protect third party',
    options: [
      { action: 'Maintain strict confidentiality', pros: ['Trust preserved', 'Follows traditional ethics'], cons: ['Partner at risk', 'Potential liability'], risk: 'high' },
      { action: 'Breach confidentiality to warn partner', pros: ['Protects third party', 'May be legally required'], cons: ['Destroys trust', 'Ethical breach'], risk: 'high' },
      { action: 'Counsel patient, involve public health', pros: ['Supports patient autonomy', 'Uses proper channels'], cons: ['May fail to protect partner', 'Time-dependent'], risk: 'medium' }
    ],
    recommendation: 'Strongly counsel patient on disclosure. If patient refuses, many jurisdictions allow/require partner notification through public health authorities. Follow local reporting laws. Document all counseling efforts.',
    references: ['Tarasoff Principle', 'HIV Disclosure Laws', 'Public Health Reporting Requirements']
  },
  {
    id: 'ES-005',
    title: 'End-of-Life Decision Making',
    category: 'End of Life',
    description: 'Family requests continuation of aggressive treatment for brain-dead patient. Medical team believes it is futile.',
    stakeholders: ['Patient', 'Family', 'Medical Team', 'Ethics Committee', 'Hospital Legal'],
    dilemma: 'Respecting family wishes vs. appropriate use of medical resources and patient dignity',
    options: [
      { action: 'Continue treatment per family wishes', pros: ['Avoids conflict', 'Respects grief process'], cons: ['Resource waste', 'Staff moral distress', 'Prolongs dying'], risk: 'medium' },
      { action: 'Unilaterally withdraw treatment', pros: ['Medically appropriate', 'Frees resources'], cons: ['Legal risk', 'Family trauma', 'Trust damage'], risk: 'critical' },
      { action: 'Structured communication with ethics support', pros: ['Builds understanding', 'Shared decision-making', 'Documented process'], cons: ['Time-consuming', 'May not resolve conflict'], risk: 'low' }
    ],
    recommendation: 'Engage palliative care and ethics committee. Hold family meetings to clarify prognosis and goals. Allow time for grief. If impasse persists, follow institutional futility policy with legal guidance.',
    references: ['AMA Ethics Opinion on Futility', 'POLST Guidelines', 'Brain Death Determination Standards']
  }
];

// ============================================================================
// DATA - COMMUNICATION PROTOCOLS
// ============================================================================

const COMMUNICATION_PROTOCOLS: CommunicationProtocol[] = [
  {
    id: 'SPIKES',
    name: 'SPIKES Protocol',
    acronym: 'SPIKES',
    steps: [
      { letter: 'S', step: 'Setting', description: 'Prepare the environment for the conversation', tips: ['Private room', 'Sit down', 'Adequate time', 'Tissues available', 'Turn off phone'] },
      { letter: 'P', step: 'Perception', description: 'Assess patient\'s understanding of their situation', tips: ['Ask open questions', 'Listen actively', 'Correct misunderstandings gently', 'Note denial or anxiety'] },
      { letter: 'I', step: 'Invitation', description: 'Ask how much information the patient wants', tips: ['Respect preferences', 'Some want details, others don\'t', 'Offer to include family', 'Document preferences'] },
      { letter: 'K', step: 'Knowledge', description: 'Share information clearly and compassionately', tips: ['Use simple language', 'Avoid jargon', 'Give warning shot', 'Pause frequently', 'Check understanding'] },
      { letter: 'E', step: 'Emotions', description: 'Address emotional reactions with empathy', tips: ['Acknowledge feelings', 'Allow silence', 'Use empathic statements', 'Offer support', 'Be present'] },
      { letter: 'S', step: 'Strategy/Summary', description: 'Discuss next steps and provide hope', tips: ['Outline treatment options', 'Set realistic goals', 'Schedule follow-up', 'Provide written information', 'Ensure support system'] }
    ],
    applicableTo: ['Cancer diagnosis', 'Terminal illness', 'Serious prognosis', 'Treatment failure', 'Life-changing diagnosis']
  },
  {
    id: 'NURSE',
    name: 'NURSE Empathy Protocol',
    acronym: 'NURSE',
    steps: [
      { letter: 'N', step: 'Name', description: 'Name the emotion you observe', tips: ['You seem worried', 'I can see this is upsetting', 'It sounds like you\'re angry'] },
      { letter: 'U', step: 'Understand', description: 'Express understanding of the emotion', tips: ['I can understand why you feel that way', 'That makes sense given what you\'re facing'] },
      { letter: 'R', step: 'Respect', description: 'Show respect for the patient\'s coping', tips: ['You\'ve been very strong', 'I respect your decision', 'You\'re handling this well'] },
      { letter: 'S', step: 'Support', description: 'Express your commitment to support', tips: ['I\'m here for you', 'We\'ll get through this together', 'You\'re not alone'] },
      { letter: 'E', step: 'Explore', description: 'Explore the emotion further if appropriate', tips: ['Tell me more about that', 'What worries you most?', 'How is your family coping?'] }
    ],
    applicableTo: ['Emotional distress', 'Difficult conversations', 'Family meetings', 'Breaking bad news', 'End-of-life discussions']
  },
  {
    id: 'SBAR',
    name: 'SBAR Communication',
    acronym: 'SBAR',
    steps: [
      { letter: 'S', step: 'Situation', description: 'State the current situation clearly', tips: ['Patient name and location', 'Chief complaint', 'Current status', 'Why you\'re calling'] },
      { letter: 'B', step: 'Background', description: 'Provide relevant background information', tips: ['Relevant medical history', 'Current medications', 'Allergies', 'Recent changes'] },
      { letter: 'A', step: 'Assessment', description: 'Share your clinical assessment', tips: ['What you think is happening', 'Vital signs', 'Physical findings', 'Concerns'] },
      { letter: 'R', step: 'Recommendation', description: 'State what you need or recommend', tips: ['Specific request', 'Urgency level', 'What you\'ve already done', 'Expected response time'] }
    ],
    applicableTo: ['Handoffs', 'Consultations', 'Emergency calls', 'Escalations', 'Team communication']
  }
];

// ============================================================================
// DATA - CONSENT FORMS
// ============================================================================

const CONSENT_FORMS: ConsentForm[] = [
  { id: 'CF-001', name: 'General Treatment Consent', type: 'general', required: ['Patient ID', 'Diagnosis', 'Treatment plan', 'Signature', 'Date', 'Witness'], sections: ['Purpose', 'Benefits', 'Risks', 'Alternatives', 'Right to withdraw'], validityPeriod: '1 year or until treatment complete' },
  { id: 'CF-002', name: 'Surgical Procedure Consent', type: 'procedure', required: ['Patient ID', 'Procedure name', 'Surgeon name', 'Anesthesia type', 'Signature', 'Date', 'Witness'], sections: ['Procedure description', 'Expected outcomes', 'Risks and complications', 'Anesthesia risks', 'Recovery expectations', 'Alternatives'], validityPeriod: '30 days before procedure' },
  { id: 'CF-003', name: 'Research Participation Consent', type: 'research', required: ['Patient ID', 'Study name', 'Principal investigator', 'IRB approval', 'Signature', 'Date', 'Witness', 'Copy provided'], sections: ['Study purpose', 'Procedures', 'Risks', 'Benefits', 'Confidentiality', 'Voluntary participation', 'Right to withdraw', 'Contact information'], validityPeriod: 'Duration of study' },
  { id: 'CF-004', name: 'Emergency Implied Consent', type: 'emergency', required: ['Patient ID', 'Nature of emergency', 'Attempts to contact family', 'Treating physician', 'Time', 'Witnesses'], sections: ['Emergency circumstances', 'Inability to consent', 'Life-threatening nature', 'Treatment provided'], validityPeriod: 'Emergency period only' },
  { id: 'CF-005', name: 'Minor/Guardian Consent', type: 'minor', required: ['Minor ID', 'Guardian ID', 'Relationship', 'Legal documentation', 'Guardian signature', 'Date', 'Witness'], sections: ['Treatment for minor', 'Guardian understanding', 'Minor assent if appropriate', 'Emergency contact'], validityPeriod: 'As specified or until age of majority' },
];

// ============================================================================
// DATA - RISK ASSESSMENT
// ============================================================================

const calculateRiskScore = (factors: Record<string, number>): RiskScore => {
  const clinical = factors.clinical || 0;
  const ethical = factors.ethical || 0;
  const communication = factors.communication || 0;
  const legal = factors.legal || 0;
  const emotional = factors.emotional || 0;
  const reputational = factors.reputational || 0;
  
  const composite = Math.round((clinical * 0.25 + ethical * 0.2 + legal * 0.2 + communication * 0.15 + emotional * 0.1 + reputational * 0.1) * 10) / 10;
  
  let level: RiskScore['level'] = 'low';
  if (composite >= 7) level = 'critical';
  else if (composite >= 5) level = 'high';
  else if (composite >= 3) level = 'medium';
  
  return { clinical, ethical, communication, legal, emotional, reputational, composite, level };
};

// ============================================================================
// DATA - COMPLIANCE STANDARDS
// ============================================================================

const COMPLIANCE_STANDARDS = [
  { id: 'WHO', name: 'WHO Patient Safety', icon: '🌍', areas: ['Safety protocols', 'Infection control', 'Medication safety'] },
  { id: 'WMA', name: 'WMA Declaration of Lisbon', icon: '⚕️', areas: ['Patient rights', 'Medical ethics', 'Professional conduct'] },
  { id: 'HIPAA', name: 'HIPAA (US)', icon: '🇺🇸', areas: ['Privacy', 'Data security', 'Breach notification'] },
  { id: 'GDPR', name: 'GDPR (EU)', icon: '🇪🇺', areas: ['Data protection', 'Consent', 'Patient access'] },
  { id: 'JCI', name: 'Joint Commission International', icon: '🏥', areas: ['Quality standards', 'Patient safety', 'Accreditation'] },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HBSHealthModule() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('doctor');
  const [currentNode, setCurrentNode] = useState<string>('start');
  const [decisionPath, setDecisionPath] = useState<string[]>(['start']);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [riskFactors, setRiskFactors] = useState({ clinical: 3, ethical: 4, communication: 2, legal: 3, emotional: 4, reputational: 2 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDecision = DECISION_TREE.find(n => n.id === currentNode);
  const riskScore = calculateRiskScore(riskFactors);

  const handleDecision = (answer: 'yes' | 'no') => {
    if (!currentDecision) return;
    const nextNode = answer === 'yes' ? currentDecision.yesPath : currentDecision.noPath;
    if (nextNode) {
      setCurrentNode(nextNode);
      setDecisionPath([...decisionPath, nextNode]);
    }
  };

  const resetDecisionTree = () => {
    setCurrentNode('start');
    setDecisionPath(['start']);
  };

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">HBS</div>
              <div>
                <div className="font-bold text-lg">IVYAR Health</div>
                <div className="text-xs text-[#8B949E]">Ethical Governance Module</div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#161B22] rounded-lg border border-[#1F242C]">
              <button
                onClick={() => setUserRole('doctor')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${userRole === 'doctor' ? 'bg-[#00E0B8] text-[#0D1117]' : 'text-[#8B949E]'}`}
              >
                👨‍⚕️ Doctor
              </button>
              <button
                onClick={() => setUserRole('patient')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${userRole === 'patient' ? 'bg-[#00A3FF] text-[#0D1117]' : 'text-[#8B949E]'}`}
              >
                🧑‍🤝‍🧑 Patient
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#161B22] rounded-lg border border-[#1F242C] text-sm text-[#8B949E]">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {userRole === 'doctor' ? '👨‍⚕️ Doctor Dashboard' : '🧑‍🤝‍🧑 Patient Dashboard'}
            </h1>
            <p className="text-[#8B949E]">
              {userRole === 'doctor' 
                ? 'Ethical decision support, communication protocols, and risk assessment tools'
                : 'Understand your rights, treatment options, and communicate effectively with your healthcare team'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#161B22] rounded-xl border border-[#1F242C] w-fit">
            {userRole === 'doctor' ? (
              <>
                {[
                  { key: 'dashboard', label: 'Overview', icon: '📊' },
                  { key: 'decisions', label: 'Decision Tree', icon: '🌳' },
                  { key: 'scenarios', label: 'Ethics Scenarios', icon: '⚖️' },
                  { key: 'communication', label: 'Communication', icon: '💬' },
                  { key: 'risk', label: 'Risk Assessment', icon: '⚠️' },
                  { key: 'consent', label: 'Consent Forms', icon: '📝' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.key ? 'bg-[#00E0B8] text-[#0D1117]' : 'hover:bg-[#1F242C] text-[#8B949E]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                {[
                  { key: 'dashboard', label: 'Overview', icon: '📊' },
                  { key: 'rights', label: 'Your Rights', icon: '📋' },
                  { key: 'communication', label: 'Communication', icon: '💬' },
                  { key: 'consent', label: 'Consent Info', icon: '✅' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.key ? 'bg-[#00A3FF] text-[#0D1117]' : 'hover:bg-[#1F242C] text-[#8B949E]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* ============================================================ */}
          {/* DASHBOARD TAB */}
          {/* ============================================================ */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4">
                {userRole === 'doctor' ? (
                  <>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">🌳</div>
                      <div className="text-xl font-bold">{DECISION_TREE.length}</div>
                      <div className="text-xs text-[#8B949E]">Decision Nodes</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">⚖️</div>
                      <div className="text-xl font-bold">{ETHICAL_SCENARIOS.length}</div>
                      <div className="text-xs text-[#8B949E]">Ethical Scenarios</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">💬</div>
                      <div className="text-xl font-bold">{COMMUNICATION_PROTOCOLS.length}</div>
                      <div className="text-xs text-[#8B949E]">Communication Protocols</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">📝</div>
                      <div className="text-xl font-bold">{CONSENT_FORMS.length}</div>
                      <div className="text-xs text-[#8B949E]">Consent Templates</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">🌍</div>
                      <div className="text-xl font-bold">{COMPLIANCE_STANDARDS.length}</div>
                      <div className="text-xs text-[#8B949E]">Compliance Standards</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">📋</div>
                      <div className="text-xl font-bold">{PATIENT_RIGHTS.length}</div>
                      <div className="text-xs text-[#8B949E]">Patient Rights</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">💬</div>
                      <div className="text-xl font-bold">{COMMUNICATION_PROTOCOLS.length}</div>
                      <div className="text-xs text-[#8B949E]">Communication Guides</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-xl font-bold">{CONSENT_FORMS.length}</div>
                      <div className="text-xs text-[#8B949E]">Consent Types</div>
                    </div>
                    <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl col-span-2">
                      <div className="text-2xl mb-1">🛡️</div>
                      <div className="text-xl font-bold">Protected</div>
                      <div className="text-xs text-[#8B949E]">Your Rights Are Guaranteed</div>
                    </div>
                  </>
                )}
              </div>

              {/* Main Content */}
              {userRole === 'doctor' ? (
                <>
                  {/* Risk Overview */}
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <h3 className="font-semibold">Current Risk Assessment</h3>
                    </div>
                    <div className="p-4">
                      <div className={`text-center p-6 rounded-xl mb-4 ${getRiskColor(riskScore.level)}`}>
                        <div className="text-4xl font-bold">{riskScore.composite}</div>
                        <div className="text-sm uppercase">{riskScore.level} Risk</div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: 'Clinical', value: riskScore.clinical },
                          { name: 'Ethical', value: riskScore.ethical },
                          { name: 'Legal', value: riskScore.legal },
                          { name: 'Communication', value: riskScore.communication },
                        ].map(item => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="text-sm text-[#8B949E]">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-[#1F242C] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#00E0B8] rounded-full"
                                  style={{ width: `${item.value * 10}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-6">{item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compliance Standards */}
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <h3 className="font-semibold">Compliance Standards</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {COMPLIANCE_STANDARDS.map(std => (
                        <div key={std.id} className="p-3 bg-[#0D1117] rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{std.icon}</span>
                            <span className="font-medium text-sm">{std.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {std.areas.map(area => (
                              <span key={area} className="px-2 py-0.5 bg-[#1F242C] rounded text-xs text-[#8B949E]">{area}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <h3 className="font-semibold">Quick Actions</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      <button onClick={() => setActiveTab('decisions')} className="w-full p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg hover:border-[#00E0B8] text-left flex items-center gap-3">
                        <span className="text-xl">🌳</span>
                        <div><div className="font-medium text-sm">Start Decision Tree</div><div className="text-xs text-[#8B949E]">Ethical guidance for complex cases</div></div>
                      </button>
                      <button onClick={() => setActiveTab('scenarios')} className="w-full p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg hover:border-[#00E0B8] text-left flex items-center gap-3">
                        <span className="text-xl">⚖️</span>
                        <div><div className="font-medium text-sm">Review Scenarios</div><div className="text-xs text-[#8B949E]">Common ethical dilemmas</div></div>
                      </button>
                      <button onClick={() => setActiveTab('communication')} className="w-full p-3 bg-[#0D1117] border border-[#1F242C] rounded-lg hover:border-[#00E0B8] text-left flex items-center gap-3">
                        <span className="text-xl">💬</span>
                        <div><div className="font-medium text-sm">Communication Protocols</div><div className="text-xs text-[#8B949E]">SPIKES, NURSE, SBAR</div></div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Patient Rights Summary */}
                  <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <h3 className="font-semibold">Your Rights at a Glance</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                      {PATIENT_RIGHTS.slice(0, 6).map(right => (
                        <button
                          key={right.id}
                          onClick={() => { setSelectedRight(right.id); setActiveTab('rights'); }}
                          className="p-4 bg-[#0D1117] border border-[#1F242C] rounded-lg hover:border-[#00A3FF] text-left"
                        >
                          <span className="text-2xl block mb-2">{right.icon}</span>
                          <div className="font-medium text-sm">{right.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* What to Expect */}
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    <div className="p-4 border-b border-[#1F242C]">
                      <h3 className="font-semibold">What to Expect</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        { icon: '👋', text: 'Respectful treatment at all times' },
                        { icon: '📋', text: 'Clear explanation of your condition' },
                        { icon: '💬', text: 'Opportunity to ask questions' },
                        { icon: '✅', text: 'Your consent before any procedure' },
                        { icon: '🔒', text: 'Privacy and confidentiality' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-[#0D1117] rounded-lg">
                          <span>{item.icon}</span>
                          <span className="text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* DECISION TREE TAB (Doctor Only) */}
          {/* ============================================================ */}
          {activeTab === 'decisions' && userRole === 'doctor' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Decision Path */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                  <h3 className="font-semibold">Decision Path</h3>
                  <button onClick={resetDecisionTree} className="text-xs text-[#00E0B8] hover:underline">Reset</button>
                </div>
                <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                  {decisionPath.map((nodeId, index) => {
                    const node = DECISION_TREE.find(n => n.id === nodeId);
                    return (
                      <div key={index} className={`p-2 rounded-lg text-sm ${nodeId === currentNode ? 'bg-[#00E0B8]/20 border border-[#00E0B8]' : 'bg-[#0D1117]'}`}>
                        <div className="text-xs text-[#8B949E] mb-1">Step {index + 1}</div>
                        <div>{node?.question || node?.outcome}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Decision */}
              <div className="lg:col-span-2 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Current Decision Point</h3>
                </div>
                <div className="p-6">
                  {currentDecision?.outcome ? (
                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-full mb-4 ${getRiskColor(currentDecision.riskLevel || 'low')}`}>
                        {currentDecision.riskLevel?.toUpperCase()} RISK
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Recommendation</h3>
                      <p className="text-lg mb-4">{currentDecision.outcome}</p>
                      {currentDecision.recommendation && (
                        <p className="text-[#8B949E] mb-6">{currentDecision.recommendation}</p>
                      )}
                      <button onClick={resetDecisionTree} className="px-6 py-3 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium hover:bg-[#00E0B8]/80">
                        Start New Assessment
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-6">{currentDecision?.question}</h3>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleDecision('yes')}
                          className="px-8 py-4 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-medium hover:bg-green-500/30 min-w-[120px]"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleDecision('no')}
                          className="px-8 py-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium hover:bg-red-500/30 min-w-[120px]"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETHICAL SCENARIOS TAB (Doctor Only) */}
          {/* ============================================================ */}
          {activeTab === 'scenarios' && userRole === 'doctor' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                {ETHICAL_SCENARIOS.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                    className={`w-full p-4 bg-[#161B22] border rounded-xl text-left transition-all ${
                      selectedScenario === scenario.id ? 'border-[#00E0B8]' : 'border-[#1F242C] hover:border-[#3D444D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[#8B949E]">{scenario.id}</span>
                      <span className="px-2 py-0.5 bg-[#1F242C] rounded text-xs">{scenario.category}</span>
                    </div>
                    <h4 className="font-medium">{scenario.title}</h4>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-2">
                {selectedScenario ? (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    {(() => {
                      const scenario = ETHICAL_SCENARIOS.find(s => s.id === selectedScenario);
                      if (!scenario) return null;
                      return (
                        <>
                          <div className="p-4 border-b border-[#1F242C]">
                            <h3 className="font-semibold text-lg">{scenario.title}</h3>
                            <p className="text-sm text-[#8B949E] mt-1">{scenario.category}</p>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-[#8B949E] mb-2">Scenario</h4>
                              <p>{scenario.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[#8B949E] mb-2">Ethical Dilemma</h4>
                              <p className="text-[#F59E0B]">{scenario.dilemma}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[#8B949E] mb-2">Options</h4>
                              <div className="space-y-2">
                                {scenario.options.map((opt, i) => (
                                  <div key={i} className="p-3 bg-[#0D1117] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">{opt.action}</span>
                                      <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(opt.risk)}`}>{opt.risk} risk</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div><span className="text-green-400">Pros:</span> {opt.pros.join(', ')}</div>
                                      <div><span className="text-red-400">Cons:</span> {opt.cons.join(', ')}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 bg-[#00E0B8]/10 border border-[#00E0B8]/30 rounded-lg">
                              <h4 className="text-sm font-medium text-[#00E0B8] mb-2">Recommendation</h4>
                              <p className="text-sm">{scenario.recommendation}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[#8B949E] mb-2">References</h4>
                              <div className="flex flex-wrap gap-2">
                                {scenario.references.map(ref => (
                                  <span key={ref} className="px-2 py-1 bg-[#1F242C] rounded text-xs">{ref}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">⚖️</span>
                    <h3 className="font-semibold mb-2">Select a Scenario</h3>
                    <p className="text-[#8B949E]">Choose an ethical scenario to review guidance and recommendations.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* COMMUNICATION TAB */}
          {/* ============================================================ */}
          {activeTab === 'communication' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                {COMMUNICATION_PROTOCOLS.map(protocol => (
                  <button
                    key={protocol.id}
                    onClick={() => setSelectedProtocol(selectedProtocol === protocol.id ? null : protocol.id)}
                    className={`w-full p-4 bg-[#161B22] border rounded-xl text-left transition-all ${
                      selectedProtocol === protocol.id ? 'border-[#00E0B8]' : 'border-[#1F242C] hover:border-[#3D444D]'
                    }`}
                  >
                    <div className="text-2xl font-bold text-[#00E0B8] mb-2">{protocol.acronym}</div>
                    <h4 className="font-medium">{protocol.name}</h4>
                    <div className="text-xs text-[#8B949E] mt-1">{protocol.steps.length} steps</div>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-2">
                {selectedProtocol ? (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                    {(() => {
                      const protocol = COMMUNICATION_PROTOCOLS.find(p => p.id === selectedProtocol);
                      if (!protocol) return null;
                      return (
                        <>
                          <div className="p-4 border-b border-[#1F242C]">
                            <h3 className="font-semibold text-lg">{protocol.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {protocol.applicableTo.map(item => (
                                <span key={item} className="px-2 py-0.5 bg-[#1F242C] rounded text-xs">{item}</span>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 space-y-4">
                            {protocol.steps.map((step, i) => (
                              <div key={i} className="p-4 bg-[#0D1117] rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-[#00E0B8] rounded-lg flex items-center justify-center text-[#0D1117] font-bold text-lg">
                                    {step.letter}
                                  </div>
                                  <div>
                                    <div className="font-medium">{step.step}</div>
                                    <div className="text-sm text-[#8B949E]">{step.description}</div>
                                  </div>
                                </div>
                                <div className="ml-13 pl-13">
                                  <div className="text-xs text-[#8B949E] mb-1">Tips:</div>
                                  <ul className="text-sm space-y-1">
                                    {step.tips.map((tip, j) => (
                                      <li key={j} className="flex items-start gap-2">
                                        <span className="text-[#00E0B8]">•</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
                    <span className="text-4xl mb-4 block">💬</span>
                    <h3 className="font-semibold mb-2">Select a Protocol</h3>
                    <p className="text-[#8B949E]">Choose a communication protocol to view detailed guidance.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* RISK ASSESSMENT TAB (Doctor Only) */}
          {/* ============================================================ */}
          {activeTab === 'risk' && userRole === 'doctor' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Risk Factor Assessment</h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { key: 'clinical', name: 'Clinical Risk', desc: 'Medical complexity and patient health status' },
                    { key: 'ethical', name: 'Ethical Risk', desc: 'Potential for ethical dilemmas or conflicts' },
                    { key: 'communication', name: 'Communication Risk', desc: 'Language barriers, comprehension issues' },
                    { key: 'legal', name: 'Legal Risk', desc: 'Litigation potential, documentation needs' },
                    { key: 'emotional', name: 'Emotional Risk', desc: 'Patient/family emotional state' },
                    { key: 'reputational', name: 'Reputational Risk', desc: 'Potential impact on trust and reputation' },
                  ].map(factor => (
                    <div key={factor.key} className="p-3 bg-[#0D1117] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm">{factor.name}</div>
                          <div className="text-xs text-[#8B949E]">{factor.desc}</div>
                        </div>
                        <span className="text-lg font-bold text-[#00E0B8]">{riskFactors[factor.key as keyof typeof riskFactors]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={riskFactors[factor.key as keyof typeof riskFactors]}
                        onChange={(e) => setRiskFactors({ ...riskFactors, [factor.key]: parseInt(e.target.value) })}
                        className="w-full accent-[#00E0B8]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="p-4 border-b border-[#1F242C]">
                  <h3 className="font-semibold">Risk Analysis</h3>
                </div>
                <div className="p-4">
                  <div className={`text-center p-8 rounded-xl mb-6 ${getRiskColor(riskScore.level)}`}>
                    <div className="text-6xl font-bold">{riskScore.composite}</div>
                    <div className="text-xl uppercase mt-2">{riskScore.level} Risk</div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="text-sm space-y-1 text-[#8B949E]">
                        {riskScore.level === 'critical' && (
                          <>
                            <li>• Request ethics committee consultation</li>
                            <li>• Involve senior staff in decision-making</li>
                            <li>• Ensure comprehensive documentation</li>
                            <li>• Consider legal consultation</li>
                          </>
                        )}
                        {riskScore.level === 'high' && (
                          <>
                            <li>• Document all decisions thoroughly</li>
                            <li>• Seek second opinion if needed</li>
                            <li>• Ensure clear communication with patient</li>
                          </>
                        )}
                        {riskScore.level === 'medium' && (
                          <>
                            <li>• Follow standard protocols</li>
                            <li>• Maintain good documentation</li>
                            <li>• Regular follow-up recommended</li>
                          </>
                        )}
                        {riskScore.level === 'low' && (
                          <>
                            <li>• Continue with standard care</li>
                            <li>• Routine documentation sufficient</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PATIENT RIGHTS TAB */}
          {/* ============================================================ */}
          {activeTab === 'rights' && userRole === 'patient' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PATIENT_RIGHTS.map(right => (
                <div
                  key={right.id}
                  className={`p-5 bg-[#161B22] border rounded-xl transition-all cursor-pointer ${
                    selectedRight === right.id ? 'border-[#00A3FF] ring-2 ring-[#00A3FF]/20' : 'border-[#1F242C] hover:border-[#3D444D]'
                  }`}
                  onClick={() => setSelectedRight(selectedRight === right.id ? null : right.id)}
                >
                  <span className="text-3xl block mb-3">{right.icon}</span>
                  <h3 className="font-semibold mb-2">{right.name}</h3>
                  <p className="text-sm text-[#8B949E] mb-3">{right.description}</p>
                  {selectedRight === right.id && (
                    <div className="mt-4 pt-4 border-t border-[#1F242C]">
                      <div className="mb-3">
                        <div className="text-xs font-medium text-[#8B949E] mb-1">Legal Basis:</div>
                        <div className="flex flex-wrap gap-1">
                          {right.articles.map(art => (
                            <span key={art} className="px-2 py-0.5 bg-[#1F242C] rounded text-xs">{art}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#8B949E] mb-1">You Can:</div>
                        <ul className="text-xs space-y-1">
                          {right.actions.map(action => (
                            <li key={action} className="flex items-center gap-1">
                              <span className="text-[#00A3FF]">✓</span> {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ============================================================ */}
          {/* CONSENT TAB */}
          {/* ============================================================ */}
          {activeTab === 'consent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONSENT_FORMS.map(form => (
                <div key={form.id} className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#8B949E]">{form.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      form.type === 'emergency' ? 'bg-red-500/20 text-red-400' :
                      form.type === 'research' ? 'bg-purple-500/20 text-purple-400' :
                      form.type === 'minor' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{form.type}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{form.name}</h3>
                  <div className="mb-3">
                    <div className="text-xs text-[#8B949E] mb-1">Required Information:</div>
                    <div className="flex flex-wrap gap-1">
                      {form.required.slice(0, 4).map(req => (
                        <span key={req} className="px-2 py-0.5 bg-[#0D1117] rounded text-xs">{req}</span>
                      ))}
                      {form.required.length > 4 && <span className="text-xs text-[#8B949E]">+{form.required.length - 4} more</span>}
                    </div>
                  </div>
                  <div className="text-xs text-[#8B949E]">
                    Validity: {form.validityPeriod}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/governance" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div><div className="font-medium">AGM</div><div className="text-xs text-[#8B949E]">Access Governance</div></div>
            </Link>
            <Link href="/admin/hub" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div><div className="font-medium">Admin Hub</div><div className="text-xs text-[#8B949E]">Dashboard</div></div>
            </Link>
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div><div className="font-medium">Security</div><div className="text-xs text-[#8B949E]">Monitoring</div></div>
            </Link>
            <Link href="/hbs" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8] flex items-center gap-3">
              <span className="text-2xl">🏛️</span>
              <div><div className="font-medium">HBS Portal</div><div className="text-xs text-[#8B949E]">Governance</div></div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-[1600px] mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | HBS Health Module v1.0 | Ethical Governance Platform
        </div>
      </footer>
    </div>
  );
}
