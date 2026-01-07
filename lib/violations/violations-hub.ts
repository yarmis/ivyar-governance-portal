// lib/violations/violations-hub.ts
// IVYAR Violations & Enforcement Module v1.0
// Violations, Fines, Escalations & AI Risk Assessment

// ============================================================================
// TYPES
// ============================================================================

export type ViolationType = 
  | 'building_code' 
  | 'zoning' 
  | 'environmental' 
  | 'safety' 
  | 'permit' 
  | 'documentation' 
  | 'labor' 
  | 'quality' 
  | 'timeline' 
  | 'financial';

export type ViolationSeverity = 'minor' | 'moderate' | 'major' | 'critical';

export type ViolationStatus = 
  | 'reported' 
  | 'under_investigation' 
  | 'confirmed' 
  | 'disputed' 
  | 'remediation_required' 
  | 'remediation_in_progress' 
  | 'resolved' 
  | 'escalated' 
  | 'closed';

export type FineStatus = 'pending' | 'issued' | 'paid' | 'overdue' | 'contested' | 'waived' | 'payment_plan';

export type EscalationLevel = 'internal' | 'regional' | 'national' | 'legal' | 'international';

export type InspectionResult = 'pass' | 'fail' | 'conditional' | 'reinspection_required';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Violation {
  id: string;
  caseNumber: string;
  type: ViolationType;
  severity: ViolationSeverity;
  status: ViolationStatus;
  title: string;
  titleUk: string;
  description: string;
  descriptionUk: string;
  projectId: string;
  projectName: string;
  parcelId?: string;
  cadastralNumber?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  reportedBy: string;
  reportedDate: string;
  confirmedDate?: string;
  confirmedBy?: string;
  violator: Violator;
  legalBasis: string[];
  evidence: Evidence[];
  fines: Fine[];
  remediationPlan?: RemediationPlan;
  inspections: Inspection[];
  escalations: Escalation[];
  timeline: TimelineEvent[];
  aiRiskScore: number;
  aiRecommendations: string[];
  deadlines: Deadline[];
  relatedViolations: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Violator {
  id: string;
  type: 'individual' | 'company' | 'contractor' | 'official';
  name: string;
  identificationCode: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  previousViolations: number;
  riskLevel: RiskLevel;
}

export interface Evidence {
  id: string;
  type: 'photo' | 'video' | 'document' | 'testimony' | 'report' | 'other';
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  verified: boolean;
  description?: string;
}

export interface Fine {
  id: string;
  violationId: string;
  fineNumber: string;
  amount: number;
  currency: string;
  status: FineStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  legalBasis: string;
  issuedBy: string;
  appealDeadline?: string;
  appealStatus?: 'none' | 'filed' | 'under_review' | 'upheld' | 'reduced' | 'overturned';
  paymentPlan?: PaymentPlan;
  notes?: string;
}

export interface PaymentPlan {
  totalAmount: number;
  installments: number;
  paidInstallments: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

export interface RemediationPlan {
  id: string;
  status: 'draft' | 'submitted' | 'approved' | 'in_progress' | 'completed' | 'failed';
  description: string;
  submittedDate: string;
  approvedDate?: string;
  deadline: string;
  steps: RemediationStep[];
  estimatedCost: number;
  actualCost?: number;
  responsibleParty: string;
  supervisor?: string;
}

export interface RemediationStep {
  id: string;
  order: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  deadline: string;
  completedDate?: string;
  notes?: string;
}

export interface Inspection {
  id: string;
  type: 'initial' | 'follow_up' | 'remediation_check' | 'final';
  date: string;
  inspector: string;
  inspectorOrg: string;
  result: InspectionResult;
  findings: string[];
  recommendations: string[];
  photos: string[];
  reportUrl?: string;
  nextInspectionDate?: string;
}

export interface Escalation {
  id: string;
  level: EscalationLevel;
  reason: string;
  escalatedTo: string;
  escalatedBy: string;
  escalatedDate: string;
  status: 'pending' | 'acknowledged' | 'in_review' | 'resolved' | 'transferred';
  resolution?: string;
  resolvedDate?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: string;
  description: string;
  performedBy: string;
  details?: string;
}

export interface Deadline {
  id: string;
  type: 'response' | 'remediation' | 'payment' | 'appeal' | 'inspection';
  date: string;
  description: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const VIOLATIONS: Violation[] = [
  {
    id: 'viol-001',
    caseNumber: 'VIO-2025-0001',
    type: 'building_code',
    severity: 'major',
    status: 'remediation_required',
    title: 'Structural Load Bearing Wall Modification Without Permit',
    titleUk: 'Зміна несучої стіни без дозволу',
    description: 'Unauthorized removal of load-bearing wall on 3rd floor without structural engineering approval',
    descriptionUk: 'Несанкціоноване видалення несучої стіни на 3 поверсі без затвердження інженера-конструктора',
    projectId: 'proj-001',
    projectName: 'Kyiv Business Center Renovation',
    parcelId: 'parcel-001',
    cadastralNumber: '8000000000:01:001:0001',
    location: '15 Khreshchatyk Street, Kyiv',
    coordinates: { lat: 50.4501, lng: 30.5234 },
    reportedBy: 'State Construction Inspector',
    reportedDate: '2025-01-03',
    confirmedDate: '2025-01-04',
    confirmedBy: 'Chief Inspector Petrov',
    violator: {
      id: 'violator-001',
      type: 'company',
      name: 'Kyiv Development LLC',
      identificationCode: '12345678',
      contactEmail: 'info@kyivdev.ua',
      contactPhone: '+380 44 555 1234',
      previousViolations: 2,
      riskLevel: 'medium',
    },
    legalBasis: ['DBN V.1.2-14:2018', 'Building Code Art. 42'],
    evidence: [
      { id: 'ev-001', type: 'photo', name: 'Wall removal photo 1', url: '/evidence/viol-001-1.jpg', uploadedBy: 'Inspector Koval', uploadedAt: '2025-01-03', verified: true },
      { id: 'ev-002', type: 'photo', name: 'Wall removal photo 2', url: '/evidence/viol-001-2.jpg', uploadedBy: 'Inspector Koval', uploadedAt: '2025-01-03', verified: true },
      { id: 'ev-003', type: 'document', name: 'Structural assessment', url: '/evidence/viol-001-assessment.pdf', uploadedBy: 'Structural Engineer', uploadedAt: '2025-01-04', verified: true },
    ],
    fines: [
      {
        id: 'fine-001',
        violationId: 'viol-001',
        fineNumber: 'FN-2025-0001',
        amount: 850000,
        currency: 'UAH',
        status: 'issued',
        issuedDate: '2025-01-05',
        dueDate: '2025-02-05',
        legalBasis: 'Building Code Art. 42, Para 3',
        issuedBy: 'State Architectural Inspectorate',
        appealDeadline: '2025-01-20',
        appealStatus: 'none',
      },
    ],
    remediationPlan: {
      id: 'rem-001',
      status: 'approved',
      description: 'Install temporary supports and engage certified structural engineer for permanent solution',
      submittedDate: '2025-01-05',
      approvedDate: '2025-01-06',
      deadline: '2025-02-15',
      steps: [
        { id: 'step-1', order: 1, description: 'Install temporary steel supports', status: 'completed', deadline: '2025-01-10', completedDate: '2025-01-08' },
        { id: 'step-2', order: 2, description: 'Structural engineering assessment', status: 'in_progress', deadline: '2025-01-20' },
        { id: 'step-3', order: 3, description: 'Permanent reinforcement installation', status: 'pending', deadline: '2025-02-10' },
        { id: 'step-4', order: 4, description: 'Final inspection and certification', status: 'pending', deadline: '2025-02-15' },
      ],
      estimatedCost: 450000,
      responsibleParty: 'Kyiv Development LLC',
      supervisor: 'Chief Inspector Petrov',
    },
    inspections: [
      {
        id: 'insp-001',
        type: 'initial',
        date: '2025-01-03',
        inspector: 'Inspector Koval',
        inspectorOrg: 'State Construction Inspectorate',
        result: 'fail',
        findings: ['Load-bearing wall removed without authorization', 'No structural engineering approval', 'Immediate safety risk'],
        recommendations: ['Stop all work immediately', 'Install temporary supports', 'Engage certified structural engineer'],
        photos: ['/inspections/viol-001-insp1-1.jpg', '/inspections/viol-001-insp1-2.jpg'],
        reportUrl: '/reports/viol-001-insp1.pdf',
        nextInspectionDate: '2025-01-15',
      },
    ],
    escalations: [],
    timeline: [
      { id: 'tl-1', date: '2025-01-03', type: 'reported', description: 'Violation reported during routine inspection', performedBy: 'Inspector Koval' },
      { id: 'tl-2', date: '2025-01-04', type: 'confirmed', description: 'Violation confirmed by chief inspector', performedBy: 'Chief Inspector Petrov' },
      { id: 'tl-3', date: '2025-01-05', type: 'fine_issued', description: 'Fine of 850,000 UAH issued', performedBy: 'State Inspectorate' },
      { id: 'tl-4', date: '2025-01-06', type: 'remediation_approved', description: 'Remediation plan approved', performedBy: 'Chief Inspector Petrov' },
    ],
    aiRiskScore: 75,
    aiRecommendations: ['Prioritize structural stabilization', 'Monitor daily until supports installed', 'Consider escalation if deadline missed'],
    deadlines: [
      { id: 'dl-1', type: 'appeal', date: '2025-01-20', description: 'Fine appeal deadline', status: 'upcoming' },
      { id: 'dl-2', type: 'payment', date: '2025-02-05', description: 'Fine payment deadline', status: 'upcoming' },
      { id: 'dl-3', type: 'remediation', date: '2025-02-15', description: 'Remediation completion deadline', status: 'upcoming' },
    ],
    relatedViolations: [],
    tags: ['structural', 'safety', 'high-priority'],
    createdAt: '2025-01-03',
    updatedAt: '2025-01-06',
  },
  {
    id: 'viol-002',
    caseNumber: 'VIO-2025-0002',
    type: 'environmental',
    severity: 'critical',
    status: 'escalated',
    title: 'Illegal Waste Disposal on Construction Site',
    titleUk: 'Незаконне захоронення відходів на будмайданчику',
    description: 'Hazardous construction waste dumped without proper containment or documentation',
    descriptionUk: 'Небезпечні будівельні відходи скинуті без належного утримання або документації',
    projectId: 'proj-003',
    projectName: 'Industrial Facility Expansion',
    parcelId: 'parcel-003',
    cadastralNumber: '8000000000:03:022:0112',
    location: '25 Industrial Street, Kyiv',
    coordinates: { lat: 50.4234, lng: 30.5567 },
    reportedBy: 'Environmental Agency Inspector',
    reportedDate: '2025-01-02',
    confirmedDate: '2025-01-03',
    confirmedBy: 'Environmental Chief Officer',
    violator: {
      id: 'violator-002',
      type: 'company',
      name: 'Industrial Holdings JSC',
      identificationCode: '87654321',
      contactEmail: 'contact@indholdings.ua',
      previousViolations: 5,
      riskLevel: 'high',
    },
    legalBasis: ['Law on Waste Management Art. 33', 'Environmental Protection Law Art. 68'],
    evidence: [
      { id: 'ev-004', type: 'photo', name: 'Waste dump site', url: '/evidence/viol-002-1.jpg', uploadedBy: 'Env Inspector', uploadedAt: '2025-01-02', verified: true },
      { id: 'ev-005', type: 'report', name: 'Soil contamination report', url: '/evidence/viol-002-soil.pdf', uploadedBy: 'Lab Technician', uploadedAt: '2025-01-03', verified: true },
    ],
    fines: [
      {
        id: 'fine-002',
        violationId: 'viol-002',
        fineNumber: 'FN-2025-0002',
        amount: 2500000,
        currency: 'UAH',
        status: 'contested',
        issuedDate: '2025-01-04',
        dueDate: '2025-02-04',
        legalBasis: 'Waste Management Law Art. 33',
        issuedBy: 'Ministry of Environment',
        appealDeadline: '2025-01-19',
        appealStatus: 'filed',
      },
    ],
    remediationPlan: undefined,
    inspections: [
      {
        id: 'insp-002',
        type: 'initial',
        date: '2025-01-02',
        inspector: 'Env Inspector Bondar',
        inspectorOrg: 'State Environmental Inspectorate',
        result: 'fail',
        findings: ['Hazardous waste illegally dumped', 'No waste management documentation', 'Soil contamination detected'],
        recommendations: ['Immediate site cleanup required', 'Full environmental impact assessment', 'Criminal investigation recommended'],
        photos: ['/inspections/viol-002-insp1-1.jpg'],
        reportUrl: '/reports/viol-002-insp1.pdf',
      },
    ],
    escalations: [
      {
        id: 'esc-001',
        level: 'national',
        reason: 'Severity of environmental damage and repeat offender status',
        escalatedTo: 'Ministry of Environment',
        escalatedBy: 'Regional Environmental Director',
        escalatedDate: '2025-01-05',
        status: 'in_review',
      },
    ],
    timeline: [
      { id: 'tl-5', date: '2025-01-02', type: 'reported', description: 'Violation reported by environmental inspector', performedBy: 'Env Inspector Bondar' },
      { id: 'tl-6', date: '2025-01-03', type: 'confirmed', description: 'Violation confirmed with soil testing', performedBy: 'Environmental Chief Officer' },
      { id: 'tl-7', date: '2025-01-04', type: 'fine_issued', description: 'Fine of 2,500,000 UAH issued', performedBy: 'Ministry of Environment' },
      { id: 'tl-8', date: '2025-01-05', type: 'escalated', description: 'Case escalated to national level', performedBy: 'Regional Director' },
      { id: 'tl-9', date: '2025-01-06', type: 'appeal_filed', description: 'Violator filed appeal against fine', performedBy: 'Industrial Holdings JSC' },
    ],
    aiRiskScore: 92,
    aiRecommendations: ['Recommend criminal referral', 'Suspend all site permits', 'Require environmental bond for future projects'],
    deadlines: [
      { id: 'dl-4', type: 'appeal', date: '2025-01-19', description: 'Appeal response deadline', status: 'due_soon' },
    ],
    relatedViolations: ['viol-005'],
    tags: ['environmental', 'hazardous', 'repeat-offender', 'escalated'],
    createdAt: '2025-01-02',
    updatedAt: '2025-01-06',
  },
  {
    id: 'viol-003',
    caseNumber: 'VIO-2024-0156',
    type: 'safety',
    severity: 'moderate',
    status: 'resolved',
    title: 'Missing Safety Equipment on Site',
    titleUk: 'Відсутність захисного обладнання на майданчику',
    description: 'Workers observed without required PPE, safety barriers not installed',
    descriptionUk: 'Робітники без необхідних ЗІЗ, захисні бар\'єри не встановлені',
    projectId: 'proj-002',
    projectName: 'Peremohy Residential Complex',
    location: '78 Peremohy Avenue, Kyiv',
    reportedBy: 'Labor Inspector',
    reportedDate: '2024-12-15',
    confirmedDate: '2024-12-16',
    confirmedBy: 'Labor Inspection Chief',
    violator: {
      id: 'violator-003',
      type: 'contractor',
      name: 'BuildRight Contractors',
      identificationCode: '11223344',
      previousViolations: 1,
      riskLevel: 'low',
    },
    legalBasis: ['Labor Safety Law Art. 15'],
    evidence: [
      { id: 'ev-006', type: 'photo', name: 'Workers without helmets', url: '/evidence/viol-003-1.jpg', uploadedBy: 'Labor Inspector', uploadedAt: '2024-12-15', verified: true },
    ],
    fines: [
      {
        id: 'fine-003',
        violationId: 'viol-003',
        fineNumber: 'FN-2024-0156',
        amount: 125000,
        currency: 'UAH',
        status: 'paid',
        issuedDate: '2024-12-18',
        dueDate: '2025-01-18',
        paidDate: '2024-12-28',
        paidAmount: 125000,
        legalBasis: 'Labor Safety Law Art. 15',
        issuedBy: 'State Labor Service',
      },
    ],
    remediationPlan: {
      id: 'rem-002',
      status: 'completed',
      description: 'Provide PPE to all workers and install safety barriers',
      submittedDate: '2024-12-17',
      approvedDate: '2024-12-17',
      deadline: '2024-12-20',
      steps: [
        { id: 'step-5', order: 1, description: 'Distribute PPE to all workers', status: 'completed', deadline: '2024-12-18', completedDate: '2024-12-17' },
        { id: 'step-6', order: 2, description: 'Install safety barriers', status: 'completed', deadline: '2024-12-19', completedDate: '2024-12-19' },
        { id: 'step-7', order: 3, description: 'Conduct safety training', status: 'completed', deadline: '2024-12-20', completedDate: '2024-12-20' },
      ],
      estimatedCost: 45000,
      actualCost: 42000,
      responsibleParty: 'BuildRight Contractors',
    },
    inspections: [
      {
        id: 'insp-003',
        type: 'initial',
        date: '2024-12-15',
        inspector: 'Labor Inspector Shevchuk',
        inspectorOrg: 'State Labor Service',
        result: 'fail',
        findings: ['Workers without helmets', 'Missing safety barriers on 4th floor', 'No first aid kit visible'],
        recommendations: ['Immediate PPE distribution', 'Install barriers before continuing work'],
        photos: [],
        nextInspectionDate: '2024-12-21',
      },
      {
        id: 'insp-004',
        type: 'follow_up',
        date: '2024-12-21',
        inspector: 'Labor Inspector Shevchuk',
        inspectorOrg: 'State Labor Service',
        result: 'pass',
        findings: ['All workers properly equipped', 'Safety barriers installed', 'First aid kits available'],
        recommendations: ['Continue monitoring'],
        photos: [],
        reportUrl: '/reports/viol-003-insp2.pdf',
      },
    ],
    escalations: [],
    timeline: [
      { id: 'tl-10', date: '2024-12-15', type: 'reported', description: 'Safety violation observed', performedBy: 'Labor Inspector Shevchuk' },
      { id: 'tl-11', date: '2024-12-18', type: 'fine_issued', description: 'Fine of 125,000 UAH issued', performedBy: 'State Labor Service' },
      { id: 'tl-12', date: '2024-12-21', type: 'inspection_passed', description: 'Follow-up inspection passed', performedBy: 'Labor Inspector Shevchuk' },
      { id: 'tl-13', date: '2024-12-28', type: 'fine_paid', description: 'Fine paid in full', performedBy: 'BuildRight Contractors' },
      { id: 'tl-14', date: '2024-12-30', type: 'resolved', description: 'Case closed', performedBy: 'System' },
    ],
    aiRiskScore: 25,
    aiRecommendations: [],
    deadlines: [],
    relatedViolations: [],
    tags: ['safety', 'resolved'],
    createdAt: '2024-12-15',
    updatedAt: '2024-12-30',
  },
  {
    id: 'viol-004',
    caseNumber: 'VIO-2025-0003',
    type: 'permit',
    severity: 'major',
    status: 'under_investigation',
    title: 'Construction Without Valid Permit',
    titleUk: 'Будівництво без дійсного дозволу',
    description: 'Construction activities commenced before permit approval received',
    descriptionUk: 'Будівельні роботи розпочато до отримання дозволу',
    projectId: 'proj-004',
    projectName: 'Unauthorized Residential Development',
    location: '45 Svobody Street, Kyiv',
    reportedBy: 'Citizen Complaint',
    reportedDate: '2025-01-06',
    violator: {
      id: 'violator-004',
      type: 'company',
      name: 'Quick Build LLC',
      identificationCode: '99887766',
      previousViolations: 0,
      riskLevel: 'medium',
    },
    legalBasis: ['Urban Planning Law Art. 37'],
    evidence: [
      { id: 'ev-007', type: 'photo', name: 'Construction in progress', url: '/evidence/viol-004-1.jpg', uploadedBy: 'Citizen', uploadedAt: '2025-01-06', verified: false },
    ],
    fines: [],
    remediationPlan: undefined,
    inspections: [],
    escalations: [],
    timeline: [
      { id: 'tl-15', date: '2025-01-06', type: 'reported', description: 'Citizen complaint received', performedBy: 'Hotline Operator' },
      { id: 'tl-16', date: '2025-01-07', type: 'investigation_started', description: 'Investigation assigned', performedBy: 'Dispatch' },
    ],
    aiRiskScore: 60,
    aiRecommendations: ['Verify permit status in system', 'Schedule site inspection within 48 hours'],
    deadlines: [
      { id: 'dl-5', type: 'inspection', date: '2025-01-09', description: 'Initial inspection deadline', status: 'upcoming' },
    ],
    relatedViolations: [],
    tags: ['permit', 'citizen-complaint', 'new'],
    createdAt: '2025-01-06',
    updatedAt: '2025-01-07',
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

export const VIOLATION_TYPE_CONFIG: Record<ViolationType, { label: string; labelUk: string; icon: string; color: string }> = {
  building_code: { label: 'Building Code', labelUk: 'Будівельні норми', icon: '🏗️', color: '#F59E0B' },
  zoning: { label: 'Zoning', labelUk: 'Зонування', icon: '🗺️', color: '#3B82F6' },
  environmental: { label: 'Environmental', labelUk: 'Екологічні', icon: '🌿', color: '#10B981' },
  safety: { label: 'Safety', labelUk: 'Безпека', icon: '⚠️', color: '#EF4444' },
  permit: { label: 'Permit', labelUk: 'Дозвільні', icon: '📋', color: '#8B5CF6' },
  documentation: { label: 'Documentation', labelUk: 'Документація', icon: '📄', color: '#6B7280' },
  labor: { label: 'Labor', labelUk: 'Трудові', icon: '👷', color: '#EC4899' },
  quality: { label: 'Quality', labelUk: 'Якість', icon: '✓', color: '#14B8A6' },
  timeline: { label: 'Timeline', labelUk: 'Терміни', icon: '⏰', color: '#F97316' },
  financial: { label: 'Financial', labelUk: 'Фінансові', icon: '💰', color: '#84CC16' },
};

export const SEVERITY_CONFIG: Record<ViolationSeverity, { label: string; labelUk: string; color: string; bg: string; fineMultiplier: number }> = {
  minor: { label: 'Minor', labelUk: 'Незначне', color: '#3B82F6', bg: '#DBEAFE', fineMultiplier: 1 },
  moderate: { label: 'Moderate', labelUk: 'Помірне', color: '#F59E0B', bg: '#FEF3C7', fineMultiplier: 2 },
  major: { label: 'Major', labelUk: 'Серйозне', color: '#F97316', bg: '#FFEDD5', fineMultiplier: 5 },
  critical: { label: 'Critical', labelUk: 'Критичне', color: '#DC2626', bg: '#FEE2E2', fineMultiplier: 10 },
};

export const STATUS_CONFIG: Record<ViolationStatus, { label: string; labelUk: string; color: string; bg: string }> = {
  reported: { label: 'Reported', labelUk: 'Повідомлено', color: '#3B82F6', bg: '#DBEAFE' },
  under_investigation: { label: 'Under Investigation', labelUk: 'Розслідується', color: '#F59E0B', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmed', labelUk: 'Підтверджено', color: '#F97316', bg: '#FFEDD5' },
  disputed: { label: 'Disputed', labelUk: 'Оскаржується', color: '#8B5CF6', bg: '#EDE9FE' },
  remediation_required: { label: 'Remediation Required', labelUk: 'Потрібне усунення', color: '#DC2626', bg: '#FEE2E2' },
  remediation_in_progress: { label: 'Remediation In Progress', labelUk: 'Усунення в процесі', color: '#F59E0B', bg: '#FEF3C7' },
  resolved: { label: 'Resolved', labelUk: 'Вирішено', color: '#10B981', bg: '#D1FAE5' },
  escalated: { label: 'Escalated', labelUk: 'Ескальовано', color: '#DC2626', bg: '#FEE2E2' },
  closed: { label: 'Closed', labelUk: 'Закрито', color: '#6B7280', bg: '#F3F4F6' },
};

export const FINE_STATUS_CONFIG: Record<FineStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#6B7280', bg: '#F3F4F6' },
  issued: { label: 'Issued', color: '#3B82F6', bg: '#DBEAFE' },
  paid: { label: 'Paid', color: '#10B981', bg: '#D1FAE5' },
  overdue: { label: 'Overdue', color: '#DC2626', bg: '#FEE2E2' },
  contested: { label: 'Contested', color: '#8B5CF6', bg: '#EDE9FE' },
  waived: { label: 'Waived', color: '#6B7280', bg: '#F3F4F6' },
  payment_plan: { label: 'Payment Plan', color: '#F59E0B', bg: '#FEF3C7' },
};

export const ESCALATION_CONFIG: Record<EscalationLevel, { label: string; labelUk: string; color: string }> = {
  internal: { label: 'Internal', labelUk: 'Внутрішній', color: '#3B82F6' },
  regional: { label: 'Regional', labelUk: 'Регіональний', color: '#F59E0B' },
  national: { label: 'National', labelUk: 'Національний', color: '#F97316' },
  legal: { label: 'Legal', labelUk: 'Правовий', color: '#DC2626' },
  international: { label: 'International', labelUk: 'Міжнародний', color: '#8B5CF6' },
};

// ============================================================================
// AI ENGINE
// ============================================================================

export class ViolationsAIEngine {
  static calculateRiskScore(violation: Violation): number {
    let score = 0;
    
    // Severity impact
    const severityScores: Record<ViolationSeverity, number> = { minor: 10, moderate: 30, major: 60, critical: 90 };
    score += severityScores[violation.severity];
    
    // Violator history
    if (violation.violator.previousViolations > 3) score += 20;
    else if (violation.violator.previousViolations > 0) score += 10;
    
    // Status impact
    if (violation.status === 'escalated') score += 15;
    if (violation.status === 'disputed') score += 5;
    
    // Overdue deadlines
    const overdueDeadlines = violation.deadlines.filter(d => d.status === 'overdue').length;
    score += overdueDeadlines * 10;
    
    return Math.min(100, score);
  }

  static generateRecommendations(violation: Violation): string[] {
    const recommendations: string[] = [];
    
    if (violation.severity === 'critical') {
      recommendations.push('Immediate action required - consider work stoppage order');
    }
    
    if (violation.violator.previousViolations > 2) {
      recommendations.push('Repeat offender - recommend enhanced monitoring');
    }
    
    if (violation.type === 'environmental') {
      recommendations.push('Conduct environmental impact assessment');
    }
    
    if (violation.type === 'safety') {
      recommendations.push('Ensure all workers evacuated from hazard area');
    }
    
    if (!violation.remediationPlan && ['confirmed', 'remediation_required'].includes(violation.status)) {
      recommendations.push('Request remediation plan from violator');
    }
    
    const overdueDeadlines = violation.deadlines.filter(d => d.status === 'overdue');
    if (overdueDeadlines.length > 0) {
      recommendations.push('Escalate due to missed deadlines');
    }
    
    return recommendations;
  }

  static assessViolatorRisk(violator: Violator): RiskLevel {
    let score = 0;
    
    if (violator.previousViolations >= 5) score += 50;
    else if (violator.previousViolations >= 3) score += 30;
    else if (violator.previousViolations >= 1) score += 15;
    
    if (violator.type === 'contractor') score += 10;
    
    if (score >= 50) return 'critical';
    if (score >= 35) return 'high';
    if (score >= 15) return 'medium';
    return 'low';
  }
}

// ============================================================================
// SERVICES
// ============================================================================

export class ViolationService {
  static getAll = () => VIOLATIONS;
  static getById = (id: string) => VIOLATIONS.find(v => v.id === id);
  static getByCase = (caseNum: string) => VIOLATIONS.find(v => v.caseNumber === caseNum);
  static getByStatus = (status: ViolationStatus) => VIOLATIONS.filter(v => v.status === status);
  static getByType = (type: ViolationType) => VIOLATIONS.filter(v => v.type === type);
  static getBySeverity = (severity: ViolationSeverity) => VIOLATIONS.filter(v => v.severity === severity);
  static getActive = () => VIOLATIONS.filter(v => !['resolved', 'closed'].includes(v.status));
  static getEscalated = () => VIOLATIONS.filter(v => v.status === 'escalated');
  static getByViolator = (violatorId: string) => VIOLATIONS.filter(v => v.violator.id === violatorId);
}

export class FineService {
  static getAll = () => VIOLATIONS.flatMap(v => v.fines);
  static getOverdue = () => VIOLATIONS.flatMap(v => v.fines).filter(f => f.status === 'overdue');
  static getPending = () => VIOLATIONS.flatMap(v => v.fines).filter(f => ['pending', 'issued'].includes(f.status));
  static getTotalIssued = () => VIOLATIONS.flatMap(v => v.fines).reduce((sum, f) => sum + f.amount, 0);
  static getTotalCollected = () => VIOLATIONS.flatMap(v => v.fines).filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.paidAmount || 0), 0);
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface ViolationsDashboardMetrics {
  totalViolations: number;
  activeViolations: number;
  resolvedThisMonth: number;
  escalatedCases: number;
  totalFinesIssued: number;
  totalFinesCollected: number;
  collectionRate: number;
  avgResolutionDays: number;
  byType: Record<ViolationType, number>;
  bySeverity: Record<ViolationSeverity, number>;
  byStatus: Record<ViolationStatus, number>;
  upcomingDeadlines: Deadline[];
  highRiskViolators: { name: string; violations: number; risk: RiskLevel }[];
}

export class DashboardService {
  static getMetrics(): ViolationsDashboardMetrics {
    const all = VIOLATIONS;
    const active = all.filter(v => !['resolved', 'closed'].includes(v.status));
    const allFines = all.flatMap(v => v.fines);
    const totalIssued = allFines.reduce((s, f) => s + f.amount, 0);
    const totalCollected = allFines.filter(f => f.status === 'paid').reduce((s, f) => s + (f.paidAmount || 0), 0);

    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    all.forEach(v => {
      byType[v.type] = (byType[v.type] || 0) + 1;
      bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
      byStatus[v.status] = (byStatus[v.status] || 0) + 1;
    });

    const upcomingDeadlines = all.flatMap(v => v.deadlines.filter(d => ['upcoming', 'due_soon'].includes(d.status))).slice(0, 5);

    return {
      totalViolations: all.length,
      activeViolations: active.length,
      resolvedThisMonth: all.filter(v => v.status === 'resolved').length,
      escalatedCases: all.filter(v => v.status === 'escalated').length,
      totalFinesIssued: totalIssued,
      totalFinesCollected: totalCollected,
      collectionRate: totalIssued > 0 ? Math.round((totalCollected / totalIssued) * 100) : 0,
      avgResolutionDays: 12,
      byType: byType as Record<ViolationType, number>,
      bySeverity: bySeverity as Record<ViolationSeverity, number>,
      byStatus: byStatus as Record<ViolationStatus, number>,
      upcomingDeadlines,
      highRiskViolators: [
        { name: 'Industrial Holdings JSC', violations: 5, risk: 'high' },
        { name: 'Kyiv Development LLC', violations: 2, risk: 'medium' },
      ],
    };
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================

export const VIOLATIONS_MODULE_INFO = {
  id: 'violations',
  name: 'Violations & Enforcement',
  nameUk: 'Порушення та контроль',
  version: '1.0.0',
  description: 'Violation tracking, fines, escalations, and AI risk assessment',
  descriptionUk: 'Відстеження порушень, штрафи, ескалації та AI-оцінка ризиків',
};
