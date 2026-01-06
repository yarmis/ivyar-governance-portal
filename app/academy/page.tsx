'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type AcademySection = 'overview' | 'tracks' | 'certifications' | 'exams' | 'schedule';
type TrackId = 'minister' | 'donor' | 'it' | 'operations' | 'trainer';
type CertificationId = 'architect' | 'operator' | 'donor-reporting' | 'ai-ethics' | 'trainer-lead';

// ============================================
// DATA
// ============================================
const TRACKS = {
  minister: {
    id: 'minister',
    title: 'Minister / Deputy Minister',
    subtitle: 'Executive Leadership Track',
    icon: '🏛️',
    color: '#A371F7',
    duration: '3 days (24 hours)',
    format: 'In-person / VIP Virtual',
    certification: 'HBS Governance Architect',
    description: 'Strategic overview for government executives responsible for national social protection policy and HBS program governance.',
    targetAudience: [
      'Ministers of Social Policy',
      'Deputy Ministers',
      'State Secretaries',
      'Senior Policy Advisors',
      'Cabinet-level Officials',
    ],
    learningOutcomes: [
      'Understand IVYAR platform strategic capabilities',
      'Evaluate policy simulation and national digital twin outputs',
      'Make informed decisions using AI-driven recommendations',
      'Oversee ethical AI governance and human oversight',
      'Engage with international donors and partners effectively',
    ],
    modules: [
      { day: 1, title: 'Strategic Platform Overview', topics: ['IVYAR v10.0 capabilities', 'Sovereign Intelligence Layer', 'National Digital Twin', 'Policy simulation demos'] },
      { day: 2, title: 'Governance & Decision Making', topics: ['AI recommendations interpretation', 'Human oversight protocols', 'Ethical Core v2.0', 'Risk assessment dashboards'] },
      { day: 3, title: 'Stakeholder Engagement', topics: ['Donor reporting & alignment', 'International standards (UN/EU/WB)', 'Crisis response protocols', 'Strategic roadmap planning'] },
    ],
  },
  donor: {
    id: 'donor',
    title: 'Donor / International Partner',
    subtitle: 'Development Partner Track',
    icon: '🤝',
    color: '#EC4899',
    duration: '4 days (32 hours)',
    format: 'Virtual / Hybrid',
    certification: 'HBS Donor Alignment & Reporting',
    description: 'Comprehensive training for international donors, UN agencies, and development partners on IVYAR integration and reporting.',
    targetAudience: [
      'UN Agency Representatives',
      'World Bank Task Team Leaders',
      'USAID Mission Staff',
      'EU Delegation Officers',
      'Bilateral Donor Representatives',
      'NGO Country Directors',
    ],
    learningOutcomes: [
      'Navigate donor dashboard and funding tracking',
      'Generate IATI 2.03 compliant reports',
      'Monitor program impact and KPIs',
      'Verify transactions via Prometheus blockchain',
      'Coordinate multi-donor program alignment',
    ],
    modules: [
      { day: 1, title: 'Platform Orientation', topics: ['Donor dashboard overview', 'Funding allocation tracking', 'Beneficiary registry access', 'Real-time monitoring'] },
      { day: 2, title: 'Reporting & Compliance', topics: ['IATI 2.03 reporting', 'HXL data standards', 'Custom report builder', 'Automated compliance checks'] },
      { day: 3, title: 'Impact & Verification', topics: ['Impact measurement framework', 'KPI dashboards', 'Blockchain verification', 'Audit trail access'] },
      { day: 4, title: 'Coordination & Integration', topics: ['Multi-donor coordination', 'Joint programming', 'API integration options', 'Partner portal access'] },
    ],
  },
  it: {
    id: 'it',
    title: 'IT & Architecture',
    subtitle: 'Technical Implementation Track',
    icon: '💻',
    color: '#00A3FF',
    duration: '10 days (80 hours)',
    format: 'In-person + Labs',
    certification: 'HBS Governance Architect',
    description: 'Deep technical training for IT teams responsible for deploying, integrating, and maintaining IVYAR platform infrastructure.',
    targetAudience: [
      'Ministry IT Directors',
      'System Architects',
      'DevOps Engineers',
      'Database Administrators',
      'Security Officers',
      'Integration Specialists',
    ],
    learningOutcomes: [
      'Deploy IVYAR on Kubernetes (cloud/on-prem/hybrid)',
      'Configure and maintain all platform components',
      'Implement API integrations with national systems',
      'Manage security, encryption, and access controls',
      'Monitor, troubleshoot, and optimize performance',
    ],
    modules: [
      { day: 1, title: 'Architecture Overview', topics: ['System architecture v10.0', 'Component registry', 'Technology stack', 'Security model'] },
      { day: 2, title: 'Infrastructure Setup', topics: ['Kubernetes deployment', 'Helm charts', 'Service mesh (Istio)', 'Monitoring stack'] },
      { day: 3, title: 'Database Layer', topics: ['PostgreSQL clustering', 'Redis configuration', 'Elasticsearch setup', 'Backup & recovery'] },
      { day: 4, title: 'Blockchain & Security', topics: ['Prometheus node setup', 'Smart contract deployment', 'HSM integration', 'Encryption keys'] },
      { day: 5, title: 'API & Integration', topics: ['API Gateway (Kong)', 'OAuth/OIDC setup', 'External system integration', 'Webhook configuration'] },
      { day: 6, title: 'AI/ML Operations', topics: ['AI Ops Center', 'Model deployment', 'MLOps pipeline', 'Ethical Core integration'] },
      { day: 7, title: 'National System Integration', topics: ['National ID integration', 'Treasury management', 'Bank payment gateways', 'Social registry sync'] },
      { day: 8, title: 'Security Hardening', topics: ['Penetration testing prep', 'SIEM integration', 'Incident response', 'Compliance audit'] },
      { day: 9, title: 'Performance & Scaling', topics: ['Load testing', 'Auto-scaling', 'Performance optimization', 'Capacity planning'] },
      { day: 10, title: 'Disaster Recovery', topics: ['DR architecture', 'Failover procedures', 'Backup validation', 'Business continuity'] },
    ],
  },
  operations: {
    id: 'operations',
    title: 'Operations & Monitoring',
    subtitle: 'Daily Operations Track',
    icon: '⚙️',
    color: '#3CCB7F',
    duration: '5 days (40 hours)',
    format: 'In-person / Virtual',
    certification: 'HBS National Operator',
    description: 'Hands-on training for operators managing daily HBS operations, beneficiary services, payments, and monitoring.',
    targetAudience: [
      'Social Protection Officers',
      'Program Managers',
      'Data Entry Operators',
      'Payment Processors',
      'Regional Coordinators',
      'Call Center Supervisors',
    ],
    learningOutcomes: [
      'Manage beneficiary registration and eligibility',
      'Process payments and handle exceptions',
      'Generate operational reports and dashboards',
      'Respond to citizen inquiries and complaints',
      'Monitor program performance indicators',
    ],
    modules: [
      { day: 1, title: 'Platform Fundamentals', topics: ['Login & navigation', 'User roles & permissions', 'Dashboard overview', 'Basic workflows'] },
      { day: 2, title: 'Beneficiary Management', topics: ['Registration process', 'Eligibility verification', 'Data updates', 'Deduplication'] },
      { day: 3, title: 'Payment Operations', topics: ['Payment batch creation', 'Approval workflows', 'Exception handling', 'Reconciliation'] },
      { day: 4, title: 'Reporting & Analytics', topics: ['Standard reports', 'Custom dashboards', 'KPI monitoring', 'Data exports'] },
      { day: 5, title: 'Troubleshooting & Support', topics: ['Common issues', 'Escalation procedures', 'Citizen grievance handling', 'Quality assurance'] },
    ],
  },
  trainer: {
    id: 'trainer',
    title: 'Trainers & Local Hubs',
    subtitle: 'Train-the-Trainer Track',
    icon: '🎓',
    color: '#F59E0B',
    duration: '7 days (56 hours)',
    format: 'In-person Intensive',
    certification: 'HBS Trainer & Academy Lead',
    description: 'Master trainer certification for establishing and leading regional training hubs and cascading knowledge transfer.',
    targetAudience: [
      'Regional Training Coordinators',
      'Ministry Training Officers',
      'University Faculty',
      'NGO Training Managers',
      'Consultants',
      'Future Academy Instructors',
    ],
    learningOutcomes: [
      'Deliver all HBS Academy curriculum modules',
      'Adapt training for local contexts and languages',
      'Assess and certify learners effectively',
      'Establish and manage regional training hubs',
      'Maintain training quality and standards',
    ],
    modules: [
      { day: 1, title: 'Trainer Foundations', topics: ['Adult learning principles', 'Training methodologies', 'Facilitation techniques', 'Cultural adaptation'] },
      { day: 2, title: 'Platform Mastery I', topics: ['Complete platform deep-dive', 'All module content', 'Demo environment setup', 'Sandbox management'] },
      { day: 3, title: 'Platform Mastery II', topics: ['Advanced features', 'Troubleshooting scenarios', 'Integration points', 'Security awareness'] },
      { day: 4, title: 'Curriculum Delivery', topics: ['Module facilitation practice', 'Scenario-based teaching', 'Interactive exercises', 'Q&A handling'] },
      { day: 5, title: 'Assessment & Certification', topics: ['Exam administration', 'Practical assessment rubrics', 'Feedback delivery', 'Certification process'] },
      { day: 6, title: 'Hub Establishment', topics: ['Training hub setup', 'Resource management', 'Scheduling systems', 'Quality assurance'] },
      { day: 7, title: 'Practicum & Evaluation', topics: ['Live training delivery', 'Peer feedback', 'Final assessment', 'Certification ceremony'] },
    ],
  },
};

const CERTIFICATIONS = {
  architect: {
    id: 'architect',
    title: 'HBS Governance Architect',
    code: 'HBS-GA-10',
    icon: '🏗️',
    color: '#A371F7',
    level: 'Expert',
    validityPeriod: '3 years',
    prerequisites: ['IT & Architecture Track OR Minister Track', '5+ years relevant experience'],
    description: 'Highest-level certification for professionals who can design, implement, and govern national-scale HBS deployments.',
    domains: [
      { name: 'System Architecture', weight: '25%', topics: ['Platform components', 'Integration patterns', 'Security architecture', 'Scalability design'] },
      { name: 'Governance Framework', weight: '25%', topics: ['Policy alignment', 'Ethical AI governance', 'Compliance standards', 'Stakeholder management'] },
      { name: 'Implementation Strategy', weight: '25%', topics: ['Deployment planning', 'Change management', 'Risk mitigation', 'Success metrics'] },
      { name: 'Operations & Sustainability', weight: '25%', topics: ['Operational excellence', 'Capacity building', 'Continuous improvement', 'Knowledge transfer'] },
    ],
    examFormat: {
      duration: '4 hours',
      sections: [
        { name: 'Multiple Choice', questions: 60, weight: '30%' },
        { name: 'Scenario Analysis', questions: 4, weight: '40%' },
        { name: 'Architecture Design', questions: 1, weight: '30%' },
      ],
      passingScore: '75%',
      retakePolicy: '30 days wait, max 3 attempts/year',
    },
  },
  operator: {
    id: 'operator',
    title: 'HBS National Operator',
    code: 'HBS-NO-10',
    icon: '⚙️',
    color: '#3CCB7F',
    level: 'Professional',
    validityPeriod: '2 years',
    prerequisites: ['Operations & Monitoring Track', 'Government employment or contractor status'],
    description: 'Professional certification for operators managing daily HBS platform operations, beneficiary services, and payments.',
    domains: [
      { name: 'Beneficiary Management', weight: '30%', topics: ['Registration', 'Eligibility verification', 'Data management', 'Deduplication'] },
      { name: 'Payment Operations', weight: '30%', topics: ['Batch processing', 'Approvals', 'Exceptions', 'Reconciliation'] },
      { name: 'Reporting & Monitoring', weight: '20%', topics: ['Dashboard usage', 'Report generation', 'KPI tracking', 'Alerts management'] },
      { name: 'Support & Troubleshooting', weight: '20%', topics: ['Issue resolution', 'Escalation', 'Grievance handling', 'Quality assurance'] },
    ],
    examFormat: {
      duration: '2.5 hours',
      sections: [
        { name: 'Multiple Choice', questions: 50, weight: '40%' },
        { name: 'Practical Simulation', questions: 3, weight: '60%' },
      ],
      passingScore: '70%',
      retakePolicy: '14 days wait, max 4 attempts/year',
    },
  },
  'donor-reporting': {
    id: 'donor-reporting',
    title: 'HBS Donor Alignment & Reporting',
    code: 'HBS-DAR-10',
    icon: '📊',
    color: '#EC4899',
    level: 'Professional',
    validityPeriod: '2 years',
    prerequisites: ['Donor / International Partner Track', 'Affiliation with donor organization'],
    description: 'Professional certification for donor representatives managing funding, monitoring, and IATI-compliant reporting.',
    domains: [
      { name: 'Funding Management', weight: '25%', topics: ['Allocation tracking', 'Disbursement monitoring', 'Budget management', 'Financial reporting'] },
      { name: 'IATI & Standards', weight: '30%', topics: ['IATI 2.03 reporting', 'HXL compliance', 'Data standards', 'Publication process'] },
      { name: 'Impact Measurement', weight: '25%', topics: ['KPI frameworks', 'Results reporting', 'Outcome verification', 'Beneficiary feedback'] },
      { name: 'Coordination', weight: '20%', topics: ['Multi-donor alignment', 'Joint programming', 'Partner collaboration', 'Information sharing'] },
    ],
    examFormat: {
      duration: '2 hours',
      sections: [
        { name: 'Multiple Choice', questions: 40, weight: '35%' },
        { name: 'Report Generation', questions: 2, weight: '40%' },
        { name: 'Case Study', questions: 1, weight: '25%' },
      ],
      passingScore: '70%',
      retakePolicy: '14 days wait, max 4 attempts/year',
    },
  },
  'ai-ethics': {
    id: 'ai-ethics',
    title: 'HBS AI Governance & Ethics',
    code: 'HBS-AGE-10',
    icon: '🤖',
    color: '#00A3FF',
    level: 'Specialist',
    validityPeriod: '2 years',
    prerequisites: ['Any HBS Track completion', 'Interest in AI governance'],
    description: 'Specialist certification for professionals overseeing AI systems, ethical boundaries, and human oversight mechanisms.',
    domains: [
      { name: 'Ethical Framework', weight: '30%', topics: ['Ethical Core v2.0', 'Zero harm principle', 'Non-discrimination', 'Transparency'] },
      { name: 'Human Oversight', weight: '25%', topics: ['Oversight protocols', 'Override mechanisms', 'Escalation procedures', 'ESS (Emergency Stop)'] },
      { name: 'AI Operations', weight: '25%', topics: ['AI Ops Center', 'Model monitoring', 'Bias detection', 'Performance metrics'] },
      { name: 'Governance & Compliance', weight: '20%', topics: ['EU AI Act alignment', 'Audit requirements', 'Documentation', 'Stakeholder communication'] },
    ],
    examFormat: {
      duration: '2.5 hours',
      sections: [
        { name: 'Multiple Choice', questions: 45, weight: '35%' },
        { name: 'Ethical Scenarios', questions: 5, weight: '45%' },
        { name: 'Policy Drafting', questions: 1, weight: '20%' },
      ],
      passingScore: '75%',
      retakePolicy: '21 days wait, max 3 attempts/year',
    },
  },
  'trainer-lead': {
    id: 'trainer-lead',
    title: 'HBS Trainer & Academy Lead',
    code: 'HBS-TAL-10',
    icon: '🎓',
    color: '#F59E0B',
    level: 'Expert',
    validityPeriod: '3 years',
    prerequisites: ['Trainers & Local Hubs Track', '3+ years training experience', 'At least one other HBS certification'],
    description: 'Master trainer certification authorizing professionals to deliver HBS Academy programs and lead regional training hubs.',
    domains: [
      { name: 'Training Delivery', weight: '30%', topics: ['Facilitation skills', 'Content adaptation', 'Engagement techniques', 'Virtual delivery'] },
      { name: 'Platform Expertise', weight: '25%', topics: ['Complete platform mastery', 'All module content', 'Troubleshooting', 'Updates awareness'] },
      { name: 'Assessment & Certification', weight: '25%', topics: ['Exam administration', 'Practical assessment', 'Feedback provision', 'Quality standards'] },
      { name: 'Hub Management', weight: '20%', topics: ['Hub establishment', 'Resource management', 'Reporting', 'Continuous improvement'] },
    ],
    examFormat: {
      duration: '3 hours + Live Teaching Demo',
      sections: [
        { name: 'Multiple Choice', questions: 40, weight: '25%' },
        { name: 'Curriculum Design', questions: 1, weight: '25%' },
        { name: 'Live Teaching Demo', questions: 1, weight: '50%' },
      ],
      passingScore: '80%',
      retakePolicy: '45 days wait, max 2 attempts/year',
    },
  },
};

const SAMPLE_QUESTIONS = {
  multipleChoice: [
    {
      id: 'MC-001',
      certification: 'HBS-NO-10',
      domain: 'Beneficiary Management',
      difficulty: 'Medium',
      question: 'A beneficiary\'s eligibility status shows "Pending Verification". What is the correct next step?',
      options: [
        'A) Approve the beneficiary manually to expedite the process',
        'B) Wait for automated verification from the national ID system',
        'C) Initiate a field verification request through the system',
        'D) Contact the beneficiary to request additional documents',
      ],
      correctAnswer: 'C',
      explanation: 'When status is "Pending Verification", the operator should initiate a field verification request. Manual approval (A) violates protocols, waiting (B) may cause unnecessary delays, and direct contact (D) should follow proper channels.',
    },
    {
      id: 'MC-002',
      certification: 'HBS-GA-10',
      domain: 'System Architecture',
      difficulty: 'Hard',
      question: 'In a multi-region IVYAR deployment, which component ensures data sovereignty while enabling cross-border coordination?',
      options: [
        'A) API Gateway with geo-routing',
        'B) Federation Hub with aggregate analytics only',
        'C) Shared PostgreSQL cluster with row-level security',
        'D) Prometheus blockchain with cross-chain bridges',
      ],
      correctAnswer: 'B',
      explanation: 'The Federation Hub enables coordination by sharing only aggregate (anonymized) analytics while each country maintains full data sovereignty. Individual PII never crosses borders.',
    },
    {
      id: 'MC-003',
      certification: 'HBS-AGE-10',
      domain: 'Ethical Framework',
      difficulty: 'Hard',
      question: 'The AI system recommends denying 500 applications with 94% confidence. Which oversight action is REQUIRED before processing?',
      options: [
        'A) No action needed - 94% exceeds the auto-approval threshold',
        'B) Random sampling review of 10% of cases',
        'C) Human review of ALL denials regardless of confidence',
        'D) Supervisor approval of the batch decision',
      ],
      correctAnswer: 'C',
      explanation: 'Under Ethical Core v2.0, ALL eligibility denials require human review regardless of AI confidence level. This protects against systematic errors and ensures human accountability.',
    },
  ],
  scenarios: [
    {
      id: 'SC-001',
      certification: 'HBS-NO-10',
      title: 'Payment Exception Handling',
      difficulty: 'Medium',
      timeLimit: '20 minutes',
      scenario: `You are a payment processor in the Ministry of Social Policy. A payment batch of 5,000 transactions worth $2.3M has been submitted for approval. The system flags 127 transactions with the following exceptions:

• 45 transactions: "Bank account number format invalid"
• 38 transactions: "Beneficiary marked as deceased in national registry"  
• 29 transactions: "Duplicate payment detected (same beneficiary, same period)"
• 15 transactions: "Amount exceeds program maximum ($500 vs $350 limit)"

The batch is scheduled for disbursement tomorrow, and the Program Manager is pressuring you to approve quickly.`,
      tasks: [
        'Categorize each exception type by severity (Critical/High/Medium/Low)',
        'Describe the correct handling procedure for each exception type',
        'Identify which transactions can be corrected and resubmitted vs. rejected',
        'Explain the escalation path and documentation requirements',
        'Draft a response to the Program Manager explaining the delay',
      ],
      rubric: {
        excellent: 'Correctly categorizes all exceptions, provides accurate procedures for each, identifies appropriate escalation, and communicates professionally (90-100%)',
        proficient: 'Correctly handles most exceptions with minor omissions, adequate escalation plan (70-89%)',
        developing: 'Understands basic exception handling but misses critical steps or escalation requirements (50-69%)',
        insufficient: 'Major errors in exception handling or bypasses required procedures (<50%)',
      },
    },
    {
      id: 'SC-002',
      certification: 'HBS-GA-10',
      title: 'National Deployment Architecture',
      difficulty: 'Expert',
      timeLimit: '60 minutes',
      scenario: `You are the Lead Architect for a new IVYAR deployment in Country X with the following requirements:

• Population: 25 million
• Expected beneficiaries: 4 million households
• 12 regional offices, 120 district offices
• Existing national ID system (REST API available)
• Two commercial banks for payment disbursement
• Government data center with limited capacity (500 VMs)
• International donors require IATI reporting
• Political sensitivity around data privacy

Current challenges:
• Data center cannot host full deployment (need hybrid approach)
• No prior Kubernetes experience in IT team
• Donor pressure to launch within 6 months
• Recent cyberattack on another government system`,
      tasks: [
        'Design the high-level architecture (hybrid cloud + on-premise)',
        'Define data residency strategy (what stays on-prem vs. cloud)',
        'Create integration architecture for national ID and banks',
        'Develop security architecture addressing recent threats',
        'Propose a phased rollout plan meeting 6-month deadline',
        'Identify key risks and mitigation strategies',
      ],
      rubric: {
        excellent: 'Comprehensive architecture addressing all requirements, innovative solutions to constraints, detailed security model, realistic timeline (90-100%)',
        proficient: 'Solid architecture covering most requirements with minor gaps (70-89%)',
        developing: 'Basic architecture but missing critical components or unrealistic assumptions (50-69%)',
        insufficient: 'Architecture has fundamental flaws or ignores key requirements (<50%)',
      },
    },
    {
      id: 'SC-003',
      certification: 'HBS-AGE-10',
      title: 'Ethical AI Decision Review',
      difficulty: 'Hard',
      timeLimit: '30 minutes',
      scenario: `The Crisis Anticipation Engine has generated an early warning recommending immediate evacuation assistance for Region Y based on flood prediction. The AI analysis shows:

• Prediction confidence: 78% (below 85% auto-threshold)
• Estimated affected population: 45,000 people
• Recommended action: Pre-position supplies, activate evacuation centers
• Cost of response: $1.2M
• Cost of inaction (if flood occurs): $15M+ damages, potential casualties

However, the regional governor disputes the prediction, citing:
• Local weather service predicts no flooding
• Previous AI false alarm caused public trust issues
• Political implications of unnecessary evacuation during election period

You are the AI Governance Officer and must decide whether to recommend activating the response.`,
      tasks: [
        'Analyze the ethical considerations for and against activation',
        'Evaluate the AI confidence level and appropriate human oversight',
        'Assess the stakeholder concerns and political pressures',
        'Make a recommendation with detailed justification',
        'Draft the audit trail documentation for this decision',
      ],
      rubric: {
        excellent: 'Thorough ethical analysis, balances all stakeholders, clear recommendation with strong justification, complete audit documentation (90-100%)',
        proficient: 'Good ethical reasoning with minor gaps in stakeholder analysis or documentation (70-89%)',
        developing: 'Basic understanding but oversimplifies ethical trade-offs or incomplete justification (50-69%)',
        insufficient: 'Fails to recognize key ethical issues or makes unjustified recommendation (<50%)',
      },
    },
  ],
  practicalSimulation: [
    {
      id: 'PS-001',
      certification: 'HBS-NO-10',
      title: 'Beneficiary Registration Workflow',
      difficulty: 'Medium',
      timeLimit: '25 minutes',
      description: 'Complete an end-to-end beneficiary registration in the sandbox environment.',
      tasks: [
        'Create a new beneficiary record with provided demographic data',
        'Link to national ID system and verify identity',
        'Complete household composition and vulnerability assessment',
        'Determine program eligibility and enroll in appropriate program',
        'Generate registration confirmation and payment schedule',
      ],
      evaluationCriteria: [
        'Data entry accuracy (20%)',
        'Correct workflow sequence (25%)',
        'Eligibility determination accuracy (25%)',
        'Documentation completeness (15%)',
        'Time efficiency (15%)',
      ],
    },
    {
      id: 'PS-002',
      certification: 'HBS-DAR-10',
      title: 'IATI Report Generation',
      difficulty: 'Medium',
      timeLimit: '30 minutes',
      description: 'Generate a quarterly IATI 2.03 compliant report for a multi-donor program.',
      tasks: [
        'Select appropriate reporting period and program activities',
        'Configure IATI organization and activity identifiers',
        'Map transactions to IATI transaction types',
        'Add results and indicator data',
        'Validate report against IATI schema and fix errors',
        'Export and verify publication-ready file',
      ],
      evaluationCriteria: [
        'Correct IATI element usage (30%)',
        'Data accuracy and completeness (25%)',
        'Validation error resolution (20%)',
        'Report quality (15%)',
        'Time efficiency (10%)',
      ],
    },
  ],
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AcademyPage() {
  const [activeSection, setActiveSection] = useState<AcademySection>('overview');
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('minister');
  const [selectedCert, setSelectedCert] = useState<CertificationId>('architect');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#F59E0B] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              🎓
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">HBS Academy</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B949E]">Official Government Training & Certification</span>
            <div className="h-4 w-px bg-[#1F242C]"></div>
            <button className="text-sm bg-[#F59E0B] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#FBBF24]">
              Enroll Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#1a1a2e] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🎓</span>
                <div>
                  <span className="text-sm bg-[#F59E0B]/20 text-[#F59E0B] px-3 py-1 rounded-full font-medium">
                    Official Government Academy
                  </span>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">HBS Academy v10.0</h1>
              <p className="text-lg text-[#8B949E] max-w-xl">
                The official training and certification program for IVYAR Platform v10.0 "Sovereign Intelligence". 
                Designed for government officials, international partners, IT professionals, and trainers.
              </p>
              <div className="flex flex-wrap gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">5 Official Tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">5 Certifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">Internationally Recognized</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#3CCB7F]">✓</span>
                  <span className="text-[#8B949E]">Blockchain-Verified</span>
                </div>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 md:w-80">
              <h3 className="text-sm font-semibold text-[#8B949E] mb-4">ACADEMY STATISTICS</h3>
              <div className="space-y-4">
                {[
                  { value: '12,400+', label: 'Certified Professionals' },
                  { value: '24', label: 'Partner Countries' },
                  { value: '156', label: 'Authorized Training Hubs' },
                  { value: '98%', label: 'Employer Satisfaction' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[#8B949E]">{stat.label}</span>
                    <span className="font-bold text-[#F59E0B]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Tabs */}
      <section className="border-b border-[#1F242C] sticky top-16 bg-[#0D1117] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'tracks', label: 'Learning Tracks', icon: '🛤️' },
              { id: 'certifications', label: 'Certifications', icon: '🏅' },
              { id: 'exams', label: 'Exams & Rubrics', icon: '📝' },
              { id: 'schedule', label: 'Schedule & Enrollment', icon: '📅' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as AcademySection)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? 'bg-[#F59E0B] text-[#0D1117]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'tracks' && (
            <TracksSection selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} />
          )}
          {activeSection === 'certifications' && (
            <CertificationsSection selectedCert={selectedCert} setSelectedCert={setSelectedCert} />
          )}
          {activeSection === 'exams' && <ExamsSection />}
          {activeSection === 'schedule' && <ScheduleSection />}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-sm text-[#8B949E]">HBS Academy v10.0 — Official Government Training Program</span>
            </div>
            <div className="flex gap-6 text-sm text-[#6E7681]">
              <a href="#" className="hover:text-white">Certification Verification</a>
              <a href="#" className="hover:text-white">Partner Hub Application</a>
              <a href="#" className="hover:text-white">Contact Academy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// OVERVIEW SECTION
// ============================================
function OverviewSection() {
  return (
    <div className="space-y-12">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.values(TRACKS).map((track) => (
          <div 
            key={track.id} 
            className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 text-center hover:border-[#3D444D] transition-colors"
          >
            <div className="text-3xl mb-2">{track.icon}</div>
            <div className="text-sm font-medium mb-1">{track.title.split('/')[0]}</div>
            <div className="text-xs text-[#8B949E]">{track.duration}</div>
          </div>
        ))}
      </div>

      {/* Certification Path Visualization */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Certification Pathway</h2>
        <div className="relative">
          {/* Path Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#A371F7] via-[#00A3FF] to-[#3CCB7F] -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {Object.values(CERTIFICATIONS).map((cert, i) => (
              <div key={cert.id} className="flex flex-col items-center relative">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 relative z-10 border-4 border-[#0D1117]"
                  style={{ backgroundColor: cert.color }}
                >
                  {cert.icon}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{cert.title.replace('HBS ', '')}</div>
                  <div className="text-xs text-[#8B949E] mt-1">{cert.code}</div>
                  <div className="text-xs mt-2 px-2 py-0.5 rounded" style={{ backgroundColor: `${cert.color}20`, color: cert.color }}>
                    {cert.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Get Certified */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="text-3xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold mb-2">Professional Recognition</h3>
          <p className="text-sm text-[#8B949E]">
            HBS certifications are recognized across 24+ countries and required for key government positions in social protection.
          </p>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="text-3xl mb-4">🔗</div>
          <h3 className="text-lg font-semibold mb-2">Blockchain Verified</h3>
          <p className="text-sm text-[#8B949E]">
            All certifications are recorded on Prometheus blockchain, ensuring tamper-proof verification by any employer or partner.
          </p>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <div className="text-3xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold mb-2">International Standards</h3>
          <p className="text-sm text-[#8B949E]">
            Curriculum aligned with UN, EU, USAID, and World Bank standards for social protection and digital governance.
          </p>
        </div>
      </div>

      {/* Academy Structure */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Academy Structure</h2>
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           HBS ACADEMY v10.0 STRUCTURE                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                              ┌─────────────────────────┐                                 │
│                              │     HBS ACADEMY HQ      │                                 │
│                              │   (Central Governance)  │                                 │
│                              └───────────┬─────────────┘                                 │
│                                          │                                               │
│           ┌──────────────────────────────┼──────────────────────────────┐               │
│           │                              │                              │               │
│           ▼                              ▼                              ▼               │
│  ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐       │
│  │  REGIONAL HUB   │           │  REGIONAL HUB   │           │  REGIONAL HUB   │       │
│  │    (Europe)     │           │    (Africa)     │           │     (Asia)      │       │
│  └────────┬────────┘           └────────┬────────┘           └────────┬────────┘       │
│           │                              │                              │               │
│     ┌─────┴─────┐                  ┌─────┴─────┐                  ┌─────┴─────┐        │
│     │           │                  │           │                  │           │        │
│     ▼           ▼                  ▼           ▼                  ▼           ▼        │
│ ┌───────┐  ┌───────┐          ┌───────┐  ┌───────┐          ┌───────┐  ┌───────┐      │
│ │Country│  │Country│          │Country│  │Country│          │Country│  │Country│      │
│ │ Hub 1 │  │ Hub 2 │          │ Hub 1 │  │ Hub 2 │          │ Hub 1 │  │ Hub 2 │      │
│ └───────┘  └───────┘          └───────┘  └───────┘          └───────┘  └───────┘      │
│                                                                                          │
│  ════════════════════════════════════════════════════════════════════════════════════   │
│                                TRAINING DELIVERY                                         │
│  ════════════════════════════════════════════════════════════════════════════════════   │
│                                                                                          │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│     │  In-Person   │  │   Virtual    │  │   Hybrid     │  │  Self-Paced  │             │
│     │   Training   │  │  Classroom   │  │   Blended    │  │   eLearning  │             │
│     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRACKS SECTION
// ============================================
function TracksSection({ 
  selectedTrack, 
  setSelectedTrack 
}: { 
  selectedTrack: TrackId; 
  setSelectedTrack: (id: TrackId) => void;
}) {
  const track = TRACKS[selectedTrack];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Learning Tracks</h2>
        <p className="text-[#8B949E]">
          Five official tracks designed for different roles in the HBS ecosystem.
        </p>
      </div>

      {/* Track Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.values(TRACKS).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTrack(t.id as TrackId)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedTrack === t.id
                ? 'text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
            style={selectedTrack === t.id ? { backgroundColor: t.color } : {}}
          >
            <span>{t.icon}</span>
            <span>{t.title.split('/')[0]}</span>
          </button>
        ))}
      </div>

      {/* Track Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${track.color}20` }}
              >
                {track.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{track.title}</h3>
                <p className="text-[#8B949E]">{track.subtitle}</p>
              </div>
            </div>
            <p className="text-[#8B949E] mb-6">{track.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#8B949E]">Duration</div>
                <div className="font-medium text-sm">{track.duration}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#8B949E]">Format</div>
                <div className="font-medium text-sm">{track.format}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#8B949E]">Certification</div>
                <div className="font-medium text-sm">{track.certification}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#8B949E]">Modules</div>
                <div className="font-medium text-sm">{track.modules.length} Days</div>
              </div>
            </div>

            <h4 className="font-semibold mb-3">Learning Outcomes</h4>
            <ul className="space-y-2">
              {track.learningOutcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#8B949E]">
                  <span className="text-[#3CCB7F] mt-0.5">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          {/* Curriculum */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Curriculum</h4>
            <div className="space-y-4">
              {track.modules.map((module, i) => (
                <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0D1117]"
                      style={{ backgroundColor: track.color }}
                    >
                      {module.day}
                    </div>
                    <div>
                      <div className="font-medium">Day {module.day}: {module.title}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, j) => (
                      <span key={j} className="text-xs bg-[#1F242C] text-[#8B949E] px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Target Audience */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Target Audience</h4>
            <ul className="space-y-2">
              {track.targetAudience.map((audience, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span style={{ color: track.color }}>•</span>
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          {/* Certification Earned */}
          <div 
            className="rounded-xl p-6 border"
            style={{ backgroundColor: `${track.color}10`, borderColor: `${track.color}30` }}
          >
            <div className="text-sm font-medium mb-2" style={{ color: track.color }}>
              CERTIFICATION EARNED
            </div>
            <div className="text-lg font-bold mb-2">{track.certification}</div>
            <p className="text-sm text-[#8B949E]">
              Upon successful completion and passing the certification exam.
            </p>
          </div>

          {/* Enroll CTA */}
          <button 
            className="w-full py-4 rounded-xl font-medium text-[#0D1117] text-center"
            style={{ backgroundColor: track.color }}
          >
            Enroll in This Track
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CERTIFICATIONS SECTION
// ============================================
function CertificationsSection({ 
  selectedCert, 
  setSelectedCert 
}: { 
  selectedCert: CertificationId; 
  setSelectedCert: (id: CertificationId) => void;
}) {
  const cert = CERTIFICATIONS[selectedCert];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Certifications v10.0</h2>
        <p className="text-[#8B949E]">
          Official HBS Academy certifications with blockchain verification.
        </p>
      </div>

      {/* Certification Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.values(CERTIFICATIONS).map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCert(c.id as CertificationId)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCert === c.id
                ? 'text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
            style={selectedCert === c.id ? { backgroundColor: c.color } : {}}
          >
            <span>{c.icon}</span>
            <span>{c.title.replace('HBS ', '')}</span>
          </button>
        ))}
      </div>

      {/* Certification Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${cert.color}20` }}
              >
                {cert.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{cert.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-sm" style={{ color: cert.color }}>{cert.code}</span>
                  <span className="text-xs bg-[#1F242C] px-2 py-0.5 rounded">{cert.level}</span>
                </div>
              </div>
            </div>
            <p className="text-[#8B949E] mb-6">{cert.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#8B949E]">Validity Period</div>
                <div className="font-medium">{cert.validityPeriod}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3">
                <div className="text-xs text-[#8B949E]">Exam Duration</div>
                <div className="font-medium">{cert.examFormat.duration}</div>
              </div>
            </div>

            <h4 className="font-semibold mb-3">Prerequisites</h4>
            <ul className="space-y-2 mb-6">
              {cert.prerequisites.map((prereq, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span style={{ color: cert.color }}>•</span>
                  {prereq}
                </li>
              ))}
            </ul>
          </div>

          {/* Domains */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Examination Domains</h4>
            <div className="space-y-4">
              {cert.domains.map((domain, i) => (
                <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{domain.name}</span>
                    <span className="text-sm font-mono" style={{ color: cert.color }}>{domain.weight}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {domain.topics.map((topic, j) => (
                      <span key={j} className="text-xs bg-[#1F242C] text-[#8B949E] px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exam Format */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Exam Format</h4>
            <div className="space-y-4">
              {cert.examFormat.sections.map((section, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <div className="text-[#6E7681]">{section.questions} {typeof section.questions === 'number' && section.questions > 1 ? 'items' : 'item'}</div>
                  </div>
                  <span className="font-mono" style={{ color: cert.color }}>{section.weight}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-[#1F242C]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#8B949E]">Passing Score</span>
                  <span className="font-bold text-[#3CCB7F]">{cert.examFormat.passingScore}</span>
                </div>
                <div className="text-xs text-[#6E7681]">
                  {cert.examFormat.retakePolicy}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Sample */}
          <div 
            className="rounded-xl p-6 border text-center"
            style={{ backgroundColor: `${cert.color}10`, borderColor: `${cert.color}30` }}
          >
            <div className="text-4xl mb-3">📜</div>
            <div className="text-sm font-medium mb-1" style={{ color: cert.color }}>
              DIGITAL CERTIFICATE
            </div>
            <p className="text-xs text-[#8B949E]">
              Blockchain-verified on Prometheus. Shareable on LinkedIn and verifiable by employers.
            </p>
          </div>

          {/* Schedule Exam */}
          <button 
            className="w-full py-4 rounded-xl font-medium text-[#0D1117] text-center"
            style={{ backgroundColor: cert.color }}
          >
            Schedule Exam
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXAMS SECTION
// ============================================
function ExamsSection() {
  const [examTab, setExamTab] = useState<'overview' | 'sample-mc' | 'sample-scenario' | 'rubrics'>('overview');

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Exams & Assessment Rubrics</h2>
        <p className="text-[#8B949E]">
          Detailed examination criteria, sample questions, and evaluation rubrics.
        </p>
      </div>

      {/* Exam Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Exam Overview' },
          { id: 'sample-mc', label: 'Sample Multiple Choice' },
          { id: 'sample-scenario', label: 'Sample Scenarios' },
          { id: 'rubrics', label: 'Grading Rubrics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setExamTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              examTab === tab.id
                ? 'bg-[#F59E0B] text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {examTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Exam Types</h3>
            <div className="space-y-4">
              {[
                { type: 'Multiple Choice', desc: 'Knowledge verification across all domains', weight: '25-40%' },
                { type: 'Scenario Analysis', desc: 'Real-world situation handling and decision-making', weight: '25-45%' },
                { type: 'Practical Simulation', desc: 'Hands-on tasks in sandbox environment', weight: '20-60%' },
                { type: 'Architecture Design', desc: 'System design and solution architecture (GA only)', weight: '30%' },
                { type: 'Live Demonstration', desc: 'Teaching or presentation (Trainer only)', weight: '50%' },
              ].map((item, i) => (
                <div key={i} className="bg-[#0D1117] rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{item.type}</span>
                    <span className="text-xs text-[#F59E0B]">{item.weight}</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Exam Policies</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Proctoring', value: 'Online proctored or in-person at authorized center' },
                { label: 'Language', value: 'English, Ukrainian, French, Arabic (others available)' },
                { label: 'Accommodations', value: 'Extended time and accessibility options available' },
                { label: 'ID Requirement', value: 'Government-issued photo ID required' },
                { label: 'Results', value: 'Immediate for MC, 5-7 days for scenarios' },
                { label: 'Appeals', value: '30-day window for result appeals' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between border-b border-[#1F242C] pb-2">
                  <span className="text-[#8B949E]">{item.label}</span>
                  <span className="text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {examTab === 'sample-mc' && (
        <div className="space-y-6">
          {SAMPLE_QUESTIONS.multipleChoice.map((q) => (
            <div key={q.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono bg-[#1F242C] px-2 py-1 rounded">{q.id}</span>
                <span className="text-xs bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded">{q.certification}</span>
                <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-2 py-1 rounded">{q.domain}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  q.difficulty === 'Hard' ? 'bg-[#F85149]/20 text-[#F85149]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                }`}>
                  {q.difficulty}
                </span>
              </div>
              <p className="font-medium mb-4">{q.question}</p>
              <div className="space-y-2 mb-4">
                {q.options.map((option, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg text-sm ${
                      option.startsWith(q.correctAnswer) 
                        ? 'bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 text-[#3CCB7F]' 
                        : 'bg-[#0D1117] border border-[#1F242C] text-[#8B949E]'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-xs font-semibold text-[#3CCB7F] mb-1">EXPLANATION</div>
                <p className="text-sm text-[#8B949E]">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {examTab === 'sample-scenario' && (
        <div className="space-y-6">
          {SAMPLE_QUESTIONS.scenarios.map((s) => (
            <div key={s.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#1F242C]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono bg-[#1F242C] px-2 py-1 rounded">{s.id}</span>
                  <span className="text-xs bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded">{s.certification}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    s.difficulty === 'Expert' ? 'bg-[#A371F7]/20 text-[#A371F7]' :
                    s.difficulty === 'Hard' ? 'bg-[#F85149]/20 text-[#F85149]' : 
                    'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {s.difficulty}
                  </span>
                  <span className="text-xs text-[#8B949E]">⏱️ {s.timeLimit}</span>
                </div>
                <h3 className="text-lg font-semibold mb-4">{s.title}</h3>
                <div className="bg-[#0D1117] rounded-lg p-4 mb-4">
                  <p className="text-sm text-[#8B949E] whitespace-pre-line">{s.scenario}</p>
                </div>
                <h4 className="font-medium mb-3">Tasks</h4>
                <ol className="space-y-2">
                  {s.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#8B949E]">
                      <span className="w-6 h-6 bg-[#1F242C] rounded-full flex items-center justify-center shrink-0 text-xs">
                        {i + 1}
                      </span>
                      {task}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-6 bg-[#0D1117]">
                <h4 className="font-medium mb-4">Grading Rubric</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(s.rubric).map(([level, desc]) => (
                    <div 
                      key={level} 
                      className={`p-3 rounded-lg border ${
                        level === 'excellent' ? 'border-[#3CCB7F]/30 bg-[#3CCB7F]/5' :
                        level === 'proficient' ? 'border-[#00A3FF]/30 bg-[#00A3FF]/5' :
                        level === 'developing' ? 'border-[#F59E0B]/30 bg-[#F59E0B]/5' :
                        'border-[#F85149]/30 bg-[#F85149]/5'
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-1 capitalize ${
                        level === 'excellent' ? 'text-[#3CCB7F]' :
                        level === 'proficient' ? 'text-[#00A3FF]' :
                        level === 'developing' ? 'text-[#F59E0B]' :
                        'text-[#F85149]'
                      }`}>
                        {level}
                      </div>
                      <p className="text-xs text-[#8B949E]">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {examTab === 'rubrics' && (
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Assessment Rubric Framework</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F242C]">
                    <th className="text-left p-3 text-[#8B949E]">Level</th>
                    <th className="text-left p-3 text-[#8B949E]">Score Range</th>
                    <th className="text-left p-3 text-[#8B949E]">Description</th>
                    <th className="text-left p-3 text-[#8B949E]">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { level: 'Excellent', range: '90-100%', desc: 'Demonstrates mastery with innovative solutions', outcome: 'Pass with Distinction', color: '#3CCB7F' },
                    { level: 'Proficient', range: '70-89%', desc: 'Meets all requirements with minor gaps', outcome: 'Pass', color: '#00A3FF' },
                    { level: 'Developing', range: '50-69%', desc: 'Partial understanding, needs improvement', outcome: 'Conditional / Retake', color: '#F59E0B' },
                    { level: 'Insufficient', range: '<50%', desc: 'Does not meet minimum requirements', outcome: 'Fail / Retake Required', color: '#F85149' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[#1F242C]">
                      <td className="p-3 font-medium" style={{ color: row.color }}>{row.level}</td>
                      <td className="p-3 font-mono">{row.range}</td>
                      <td className="p-3 text-[#8B949E]">{row.desc}</td>
                      <td className="p-3">{row.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Practical Simulation Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_QUESTIONS.practicalSimulation.map((sim) => (
                <div key={sim.id} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono bg-[#1F242C] px-2 py-1 rounded">{sim.id}</span>
                    <span className="text-xs text-[#8B949E]">⏱️ {sim.timeLimit}</span>
                  </div>
                  <h4 className="font-medium mb-2">{sim.title}</h4>
                  <p className="text-sm text-[#8B949E] mb-3">{sim.description}</p>
                  <div className="space-y-2">
                    {sim.evaluationCriteria.map((criteria, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-[#8B949E]">{criteria.split('(')[0]}</span>
                        <span className="text-[#F59E0B]">{criteria.match(/\((.*?)\)/)?.[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SCHEDULE SECTION
// ============================================
function ScheduleSection() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Schedule & Enrollment</h2>
        <p className="text-[#8B949E]">
          Upcoming training sessions and enrollment information.
        </p>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-6">Upcoming Training Sessions</h3>
        <div className="space-y-4">
          {[
            { track: 'Minister / Deputy Minister', date: 'February 10-12, 2026', location: 'Kyiv, Ukraine', format: 'In-Person', spots: 8, color: '#A371F7' },
            { track: 'Operations & Monitoring', date: 'February 17-21, 2026', location: 'Virtual', format: 'Online', spots: 25, color: '#3CCB7F' },
            { track: 'IT & Architecture', date: 'March 3-14, 2026', location: 'Warsaw, Poland', format: 'In-Person + Labs', spots: 15, color: '#00A3FF' },
            { track: 'Donor / International Partner', date: 'March 10-13, 2026', location: 'Virtual', format: 'Hybrid', spots: 30, color: '#EC4899' },
            { track: 'Trainers & Local Hubs', date: 'March 24-30, 2026', location: 'Berlin, Germany', format: 'In-Person Intensive', spots: 12, color: '#F59E0B' },
          ].map((session, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${session.color}20` }}
                >
                  {TRACKS[Object.keys(TRACKS).find(k => TRACKS[k as TrackId].title.includes(session.track.split('/')[0].trim())) as TrackId]?.icon || '📚'}
                </div>
                <div>
                  <div className="font-medium">{session.track}</div>
                  <div className="text-sm text-[#8B949E]">{session.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-[#6E7681]">Location</div>
                  <div>{session.location}</div>
                </div>
                <div>
                  <div className="text-[#6E7681]">Format</div>
                  <div>{session.format}</div>
                </div>
                <div>
                  <div className="text-[#6E7681]">Spots Left</div>
                  <div className={session.spots < 10 ? 'text-[#F59E0B]' : 'text-[#3CCB7F]'}>{session.spots}</div>
                </div>
                <button 
                  className="px-4 py-2 rounded-lg font-medium text-[#0D1117]"
                  style={{ backgroundColor: session.color }}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Schedule */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-6">Certification Exam Windows</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { month: 'February 2026', dates: 'Feb 15-28', exams: ['HBS-NO-10', 'HBS-DAR-10'] },
            { month: 'March 2026', dates: 'Mar 1-15', exams: ['HBS-GA-10', 'HBS-AGE-10', 'HBS-TAL-10'] },
            { month: 'April 2026', dates: 'Apr 1-30', exams: ['All Certifications'] },
          ].map((window, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <div className="font-medium mb-2">{window.month}</div>
              <div className="text-sm text-[#8B949E] mb-3">{window.dates}</div>
              <div className="flex flex-wrap gap-1">
                {window.exams.map((exam, j) => (
                  <span key={j} className="text-xs bg-[#1F242C] text-[#8B949E] px-2 py-1 rounded">
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Form */}
      <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#EC4899]/10 border border-[#1F242C] rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-[#8B949E] mb-6">
            Contact HBS Academy to discuss your training needs, group enrollments, or custom programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-[#F59E0B] text-[#0D1117] rounded-lg font-medium hover:bg-[#FBBF24]">
              Request Enrollment
            </button>
            <button className="px-6 py-3 bg-[#1F242C] text-[#E6EDF3] rounded-lg font-medium hover:bg-[#2D333B]">
              Download Catalog (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
