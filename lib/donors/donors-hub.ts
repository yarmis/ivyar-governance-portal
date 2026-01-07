// lib/donors/donors-hub.ts
// IVYAR Donor Portal v1.0
// Transparency, Fund Tracking & Compliance for International Donors

// ============================================================================
// TYPES
// ============================================================================

export type DonorType = 'multilateral' | 'bilateral' | 'foundation' | 'corporate' | 'government' | 'ngo';
export type FundingStatus = 'pledged' | 'committed' | 'disbursed' | 'utilized' | 'closed';
export type ProjectPhase = 'planning' | 'procurement' | 'implementation' | 'monitoring' | 'completed' | 'closed';
export type ComplianceStatus = 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant' | 'under_review';
export type ReportType = 'quarterly' | 'annual' | 'completion' | 'audit' | 'special';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Currency = 'USD' | 'EUR' | 'UAH' | 'GBP' | 'JPY';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Donor {
  id: string;
  name: string;
  shortName: string;
  type: DonorType;
  country: string;
  logo?: string;
  website: string;
  contactPerson: string;
  contactEmail: string;
  totalPledged: number;
  totalDisbursed: number;
  activeProjects: number;
  complianceRating: number;
  joinedDate: string;
  focusAreas: string[];
  requirements: DonorRequirement[];
}

export interface DonorRequirement {
  id: string;
  category: string;
  description: string;
  mandatory: boolean;
  frequency?: string;
}

export interface FundingProgram {
  id: string;
  donorId: string;
  donorName: string;
  name: string;
  nameUk: string;
  description: string;
  totalBudget: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  status: FundingStatus;
  disbursementSchedule: Disbursement[];
  projects: string[];
  sector: string;
  region: string;
  complianceStatus: ComplianceStatus;
  lastAuditDate?: string;
  nextReportDue?: string;
}

export interface Disbursement {
  id: string;
  programId: string;
  amount: number;
  currency: Currency;
  scheduledDate: string;
  actualDate?: string;
  status: 'scheduled' | 'pending' | 'processed' | 'delayed' | 'cancelled';
  conditions?: string[];
  conditionsMet: boolean;
  notes?: string;
}

export interface FundedProject {
  id: string;
  programId: string;
  donorId: string;
  donorName: string;
  name: string;
  nameUk: string;
  description: string;
  sector: string;
  region: string;
  oblast: string;
  budget: number;
  currency: Currency;
  budgetUtilized: number;
  utilizationRate: number;
  phase: ProjectPhase;
  startDate: string;
  endDate: string;
  actualEndDate?: string;
  beneficiaries: number;
  outcomes: ProjectOutcome[];
  milestones: Milestone[];
  procurements: Procurement[];
  risks: ProjectRisk[];
  complianceStatus: ComplianceStatus;
  lastInspection?: string;
  geoCoordinates?: { lat: number; lng: number };
}

export interface ProjectOutcome {
  id: string;
  indicator: string;
  indicatorUk: string;
  target: number;
  actual: number;
  unit: string;
  achievementRate: number;
  verificationDate?: string;
}

export interface Milestone {
  id: string;
  name: string;
  nameUk: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'at_risk';
  deliverables: string[];
  budget: number;
  spent: number;
}

export interface Procurement {
  id: string;
  projectId: string;
  title: string;
  method: 'open_tender' | 'limited_tender' | 'direct_contract' | 'framework';
  status: 'planned' | 'announced' | 'evaluation' | 'awarded' | 'completed' | 'cancelled';
  estimatedValue: number;
  contractValue?: number;
  currency: Currency;
  publishDate?: string;
  closingDate?: string;
  awardDate?: string;
  contractor?: string;
  biddersCount?: number;
  complaints?: number;
}

export interface ProjectRisk {
  id: string;
  category: 'financial' | 'operational' | 'compliance' | 'reputational' | 'political';
  description: string;
  level: RiskLevel;
  mitigation: string;
  owner: string;
  status: 'identified' | 'mitigating' | 'resolved' | 'escalated';
}

export interface TransparencyReport {
  id: string;
  type: ReportType;
  programId?: string;
  projectId?: string;
  donorId: string;
  period: string;
  submittedDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'revision_requested';
  documentUrl: string;
  summary: string;
  financialData: FinancialSummary;
  reviewer?: string;
  reviewDate?: string;
  comments?: string;
}

export interface FinancialSummary {
  totalBudget: number;
  disbursed: number;
  utilized: number;
  committed: number;
  available: number;
  currency: Currency;
  byCategory: { category: string; amount: number }[];
}

export interface AuditFinding {
  id: string;
  auditId: string;
  severity: 'observation' | 'minor' | 'major' | 'critical';
  category: string;
  finding: string;
  recommendation: string;
  managementResponse?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'disputed';
  dueDate?: string;
  resolvedDate?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const DONORS: Donor[] = [
  {
    id: 'donor-001',
    name: 'World Bank',
    shortName: 'WB',
    type: 'multilateral',
    country: 'International',
    website: 'https://worldbank.org',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sjohnson@worldbank.org',
    totalPledged: 500000000,
    totalDisbursed: 320000000,
    activeProjects: 12,
    complianceRating: 94,
    joinedDate: '2022-03-15',
    focusAreas: ['Infrastructure', 'Energy', 'Public Administration'],
    requirements: [
      { id: 'req-1', category: 'Reporting', description: 'Quarterly financial reports', mandatory: true, frequency: 'Quarterly' },
      { id: 'req-2', category: 'Procurement', description: 'World Bank procurement guidelines', mandatory: true },
      { id: 'req-3', category: 'Audit', description: 'Annual external audit', mandatory: true, frequency: 'Annual' },
    ],
  },
  {
    id: 'donor-002',
    name: 'European Bank for Reconstruction and Development',
    shortName: 'EBRD',
    type: 'multilateral',
    country: 'International',
    website: 'https://ebrd.com',
    contactPerson: 'Hans Mueller',
    contactEmail: 'muellerh@ebrd.com',
    totalPledged: 350000000,
    totalDisbursed: 180000000,
    activeProjects: 8,
    complianceRating: 91,
    joinedDate: '2022-06-01',
    focusAreas: ['Transport', 'Municipal Infrastructure', 'Energy Efficiency'],
    requirements: [
      { id: 'req-4', category: 'Reporting', description: 'Semi-annual progress reports', mandatory: true, frequency: 'Semi-annual' },
      { id: 'req-5', category: 'Environmental', description: 'Environmental and social assessment', mandatory: true },
    ],
  },
  {
    id: 'donor-003',
    name: 'European Investment Bank',
    shortName: 'EIB',
    type: 'multilateral',
    country: 'EU',
    website: 'https://eib.org',
    contactPerson: 'Marie Dubois',
    contactEmail: 'mdubois@eib.org',
    totalPledged: 280000000,
    totalDisbursed: 145000000,
    activeProjects: 6,
    complianceRating: 96,
    joinedDate: '2022-09-01',
    focusAreas: ['Housing', 'Social Infrastructure', 'Digital'],
    requirements: [],
  },
  {
    id: 'donor-004',
    name: 'United States Agency for International Development',
    shortName: 'USAID',
    type: 'bilateral',
    country: 'USA',
    website: 'https://usaid.gov',
    contactPerson: 'Michael Chen',
    contactEmail: 'mchen@usaid.gov',
    totalPledged: 200000000,
    totalDisbursed: 125000000,
    activeProjects: 15,
    complianceRating: 89,
    joinedDate: '2022-04-01',
    focusAreas: ['Governance', 'Anti-corruption', 'Capacity Building'],
    requirements: [],
  },
  {
    id: 'donor-005',
    name: 'Government of Japan',
    shortName: 'JICA',
    type: 'bilateral',
    country: 'Japan',
    website: 'https://jica.go.jp',
    contactPerson: 'Yuki Tanaka',
    contactEmail: 'tanaka@jica.go.jp',
    totalPledged: 150000000,
    totalDisbursed: 85000000,
    activeProjects: 5,
    complianceRating: 98,
    joinedDate: '2023-01-15',
    focusAreas: ['Reconstruction', 'Healthcare', 'Education'],
    requirements: [],
  },
  {
    id: 'donor-006',
    name: 'German Development Bank',
    shortName: 'KfW',
    type: 'bilateral',
    country: 'Germany',
    website: 'https://kfw.de',
    contactPerson: 'Klaus Schmidt',
    contactEmail: 'schmidt@kfw.de',
    totalPledged: 180000000,
    totalDisbursed: 95000000,
    activeProjects: 7,
    complianceRating: 93,
    joinedDate: '2022-07-01',
    focusAreas: ['Energy', 'Water', 'Municipal Services'],
    requirements: [],
  },
];

export const PROGRAMS: FundingProgram[] = [
  {
    id: 'prog-001',
    donorId: 'donor-001',
    donorName: 'World Bank',
    name: 'Ukraine Recovery and Reconstruction Program',
    nameUk: 'Програма відновлення та реконструкції України',
    description: 'Multi-sector reconstruction support for war-affected regions',
    totalBudget: 250000000,
    currency: 'USD',
    startDate: '2023-01-01',
    endDate: '2027-12-31',
    status: 'disbursed',
    disbursementSchedule: [
      { id: 'd1', programId: 'prog-001', amount: 50000000, currency: 'USD', scheduledDate: '2023-03-01', actualDate: '2023-03-15', status: 'processed', conditionsMet: true },
      { id: 'd2', programId: 'prog-001', amount: 75000000, currency: 'USD', scheduledDate: '2024-01-01', actualDate: '2024-01-20', status: 'processed', conditionsMet: true },
      { id: 'd3', programId: 'prog-001', amount: 75000000, currency: 'USD', scheduledDate: '2025-01-01', status: 'pending', conditionsMet: false, conditions: ['Q4 2024 report approval', 'Audit clearance'] },
    ],
    projects: ['proj-001', 'proj-002', 'proj-003'],
    sector: 'Multi-sector',
    region: 'National',
    complianceStatus: 'compliant',
    lastAuditDate: '2024-09-15',
    nextReportDue: '2025-01-31',
  },
  {
    id: 'prog-002',
    donorId: 'donor-002',
    donorName: 'EBRD',
    name: 'Municipal Infrastructure Resilience',
    nameUk: 'Стійкість муніципальної інфраструктури',
    description: 'Strengthening critical municipal infrastructure',
    totalBudget: 120000000,
    currency: 'EUR',
    startDate: '2023-06-01',
    endDate: '2026-12-31',
    status: 'disbursed',
    disbursementSchedule: [
      { id: 'd4', programId: 'prog-002', amount: 40000000, currency: 'EUR', scheduledDate: '2023-07-01', actualDate: '2023-07-10', status: 'processed', conditionsMet: true },
      { id: 'd5', programId: 'prog-002', amount: 40000000, currency: 'EUR', scheduledDate: '2024-07-01', actualDate: '2024-08-01', status: 'processed', conditionsMet: true },
    ],
    projects: ['proj-004', 'proj-005'],
    sector: 'Infrastructure',
    region: 'Eastern Ukraine',
    complianceStatus: 'compliant',
    lastAuditDate: '2024-06-01',
    nextReportDue: '2025-02-15',
  },
  {
    id: 'prog-003',
    donorId: 'donor-004',
    donorName: 'USAID',
    name: 'Transparent Governance Initiative',
    nameUk: 'Ініціатива прозорого врядування',
    description: 'Building transparent and accountable institutions',
    totalBudget: 45000000,
    currency: 'USD',
    startDate: '2022-09-01',
    endDate: '2025-08-31',
    status: 'disbursed',
    disbursementSchedule: [],
    projects: ['proj-006'],
    sector: 'Governance',
    region: 'National',
    complianceStatus: 'minor_issues',
    lastAuditDate: '2024-03-15',
    nextReportDue: '2025-01-15',
  },
];

export const PROJECTS: FundedProject[] = [
  {
    id: 'proj-001',
    programId: 'prog-001',
    donorId: 'donor-001',
    donorName: 'World Bank',
    name: 'Kharkiv School Reconstruction',
    nameUk: 'Реконструкція шкіл Харкова',
    description: 'Reconstruction of 25 damaged schools in Kharkiv Oblast',
    sector: 'Education',
    region: 'Eastern',
    oblast: 'Kharkiv',
    budget: 35000000,
    currency: 'USD',
    budgetUtilized: 28500000,
    utilizationRate: 81,
    phase: 'implementation',
    startDate: '2023-04-01',
    endDate: '2025-06-30',
    beneficiaries: 15000,
    outcomes: [
      { id: 'out-1', indicator: 'Schools reconstructed', indicatorUk: 'Реконструйовано шкіл', target: 25, actual: 18, unit: 'schools', achievementRate: 72 },
      { id: 'out-2', indicator: 'Students with improved facilities', indicatorUk: 'Учні з покращеними умовами', target: 15000, actual: 12500, unit: 'students', achievementRate: 83 },
    ],
    milestones: [
      { id: 'm1', name: 'Design Phase', nameUk: 'Фаза проектування', dueDate: '2023-06-30', completedDate: '2023-06-25', status: 'completed', deliverables: ['Designs approved'], budget: 2000000, spent: 1850000 },
      { id: 'm2', name: 'Phase 1 Construction', nameUk: 'Фаза 1 будівництва', dueDate: '2024-06-30', completedDate: '2024-07-15', status: 'completed', deliverables: ['10 schools completed'], budget: 15000000, spent: 14200000 },
      { id: 'm3', name: 'Phase 2 Construction', nameUk: 'Фаза 2 будівництва', dueDate: '2025-03-31', status: 'in_progress', deliverables: ['15 schools completed'], budget: 18000000, spent: 12450000 },
    ],
    procurements: [
      { id: 'proc-1', projectId: 'proj-001', title: 'Construction Works Lot 1', method: 'open_tender', status: 'completed', estimatedValue: 12000000, contractValue: 11500000, currency: 'USD', contractor: 'BuildCo Ukraine', biddersCount: 7 },
      { id: 'proc-2', projectId: 'proj-001', title: 'Construction Works Lot 2', method: 'open_tender', status: 'awarded', estimatedValue: 15000000, contractValue: 14800000, currency: 'USD', contractor: 'ReconStroy Ltd', biddersCount: 5 },
    ],
    risks: [
      { id: 'r1', category: 'operational', description: 'Material supply delays', level: 'medium', mitigation: 'Alternative suppliers identified', owner: 'Project Manager', status: 'mitigating' },
    ],
    complianceStatus: 'compliant',
    lastInspection: '2024-12-15',
    geoCoordinates: { lat: 49.9935, lng: 36.2304 },
  },
  {
    id: 'proj-002',
    programId: 'prog-001',
    donorId: 'donor-001',
    donorName: 'World Bank',
    name: 'Kyiv Energy Infrastructure',
    nameUk: 'Енергетична інфраструктура Києва',
    description: 'Repair and modernization of energy distribution network',
    sector: 'Energy',
    region: 'Central',
    oblast: 'Kyiv',
    budget: 85000000,
    currency: 'USD',
    budgetUtilized: 52000000,
    utilizationRate: 61,
    phase: 'implementation',
    startDate: '2023-07-01',
    endDate: '2026-06-30',
    beneficiaries: 500000,
    outcomes: [
      { id: 'out-3', indicator: 'Substations repaired', indicatorUk: 'Відремонтовано підстанцій', target: 15, actual: 8, unit: 'substations', achievementRate: 53 },
      { id: 'out-4', indicator: 'Grid reliability improved', indicatorUk: 'Покращено надійність мережі', target: 95, actual: 88, unit: '%', achievementRate: 93 },
    ],
    milestones: [],
    procurements: [],
    risks: [],
    complianceStatus: 'compliant',
    lastInspection: '2024-11-20',
    geoCoordinates: { lat: 50.4501, lng: 30.5234 },
  },
  {
    id: 'proj-003',
    programId: 'prog-001',
    donorId: 'donor-001',
    donorName: 'World Bank',
    name: 'Odesa Port Facilities',
    nameUk: 'Портові споруди Одеси',
    description: 'Rehabilitation of port infrastructure',
    sector: 'Transport',
    region: 'Southern',
    oblast: 'Odesa',
    budget: 65000000,
    currency: 'USD',
    budgetUtilized: 18000000,
    utilizationRate: 28,
    phase: 'implementation',
    startDate: '2024-01-01',
    endDate: '2027-12-31',
    beneficiaries: 50000,
    outcomes: [],
    milestones: [],
    procurements: [],
    risks: [
      { id: 'r2', category: 'political', description: 'Security situation in Black Sea', level: 'high', mitigation: 'Flexible implementation schedule', owner: 'Program Director', status: 'identified' },
    ],
    complianceStatus: 'under_review',
    geoCoordinates: { lat: 46.4825, lng: 30.7233 },
  },
];

export const REPORTS: TransparencyReport[] = [
  {
    id: 'rep-001',
    type: 'quarterly',
    programId: 'prog-001',
    donorId: 'donor-001',
    period: 'Q3 2024',
    submittedDate: '2024-10-15',
    status: 'approved',
    documentUrl: '/reports/wb-q3-2024.pdf',
    summary: 'Strong progress on school reconstruction. 3 schools completed in Q3.',
    financialData: {
      totalBudget: 250000000,
      disbursed: 125000000,
      utilized: 98500000,
      committed: 15000000,
      available: 11500000,
      currency: 'USD',
      byCategory: [
        { category: 'Construction', amount: 75000000 },
        { category: 'Equipment', amount: 15000000 },
        { category: 'Consulting', amount: 8500000 },
      ],
    },
    reviewer: 'WB Task Team Leader',
    reviewDate: '2024-10-28',
  },
  {
    id: 'rep-002',
    type: 'quarterly',
    programId: 'prog-002',
    donorId: 'donor-002',
    period: 'Q3 2024',
    submittedDate: '2024-10-20',
    status: 'approved',
    documentUrl: '/reports/ebrd-q3-2024.pdf',
    summary: 'Municipal infrastructure projects on track.',
    financialData: {
      totalBudget: 120000000,
      disbursed: 80000000,
      utilized: 65000000,
      committed: 10000000,
      available: 5000000,
      currency: 'EUR',
      byCategory: [],
    },
    reviewer: 'EBRD Portfolio Manager',
    reviewDate: '2024-11-05',
  },
];

// ============================================================================
// CONFIGURATION
// ============================================================================

export const DONOR_TYPE_CONFIG: Record<DonorType, { label: string; icon: string; color: string }> = {
  multilateral: { label: 'Multilateral', icon: '🌐', color: '#3B82F6' },
  bilateral: { label: 'Bilateral', icon: '🤝', color: '#10B981' },
  foundation: { label: 'Foundation', icon: '🏛️', color: '#8B5CF6' },
  corporate: { label: 'Corporate', icon: '🏢', color: '#F59E0B' },
  government: { label: 'Government', icon: '🏛️', color: '#EC4899' },
  ngo: { label: 'NGO', icon: '💚', color: '#14B8A6' },
};

export const FUNDING_STATUS_CONFIG: Record<FundingStatus, { label: string; color: string; bg: string }> = {
  pledged: { label: 'Pledged', color: '#6B7280', bg: '#F3F4F6' },
  committed: { label: 'Committed', color: '#3B82F6', bg: '#DBEAFE' },
  disbursed: { label: 'Disbursed', color: '#10B981', bg: '#D1FAE5' },
  utilized: { label: 'Utilized', color: '#8B5CF6', bg: '#EDE9FE' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
};

export const PROJECT_PHASE_CONFIG: Record<ProjectPhase, { label: string; color: string; bg: string }> = {
  planning: { label: 'Planning', color: '#6B7280', bg: '#F3F4F6' },
  procurement: { label: 'Procurement', color: '#F59E0B', bg: '#FEF3C7' },
  implementation: { label: 'Implementation', color: '#3B82F6', bg: '#DBEAFE' },
  monitoring: { label: 'Monitoring', color: '#8B5CF6', bg: '#EDE9FE' },
  completed: { label: 'Completed', color: '#10B981', bg: '#D1FAE5' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' },
};

export const COMPLIANCE_CONFIG: Record<ComplianceStatus, { label: string; color: string; bg: string; icon: string }> = {
  compliant: { label: 'Compliant', color: '#10B981', bg: '#D1FAE5', icon: '✅' },
  minor_issues: { label: 'Minor Issues', color: '#F59E0B', bg: '#FEF3C7', icon: '⚠️' },
  major_issues: { label: 'Major Issues', color: '#F97316', bg: '#FFEDD5', icon: '🚨' },
  non_compliant: { label: 'Non-Compliant', color: '#DC2626', bg: '#FEE2E2', icon: '❌' },
  under_review: { label: 'Under Review', color: '#6B7280', bg: '#F3F4F6', icon: '🔍' },
};

// ============================================================================
// SERVICES
// ============================================================================

export class DonorService {
  static getAll = () => DONORS;
  static getById = (id: string) => DONORS.find(d => d.id === id);
  static getByType = (type: DonorType) => DONORS.filter(d => d.type === type);
  static getTotalPledged = () => DONORS.reduce((s, d) => s + d.totalPledged, 0);
  static getTotalDisbursed = () => DONORS.reduce((s, d) => s + d.totalDisbursed, 0);
}

export class ProgramService {
  static getAll = () => PROGRAMS;
  static getById = (id: string) => PROGRAMS.find(p => p.id === id);
  static getByDonor = (donorId: string) => PROGRAMS.filter(p => p.donorId === donorId);
  static getActive = () => PROGRAMS.filter(p => ['committed', 'disbursed'].includes(p.status));
}

export class ProjectService {
  static getAll = () => PROJECTS;
  static getById = (id: string) => PROJECTS.find(p => p.id === id);
  static getByProgram = (programId: string) => PROJECTS.filter(p => p.programId === programId);
  static getByDonor = (donorId: string) => PROJECTS.filter(p => p.donorId === donorId);
  static getBySector = (sector: string) => PROJECTS.filter(p => p.sector === sector);
  static getByRegion = (region: string) => PROJECTS.filter(p => p.region === region);
}

export class ReportService {
  static getAll = () => REPORTS;
  static getById = (id: string) => REPORTS.find(r => r.id === id);
  static getByDonor = (donorId: string) => REPORTS.filter(r => r.donorId === donorId);
  static getPending = () => REPORTS.filter(r => ['draft', 'submitted', 'under_review'].includes(r.status));
}

// ============================================================================
// DASHBOARD
// ============================================================================

export interface DonorDashboardMetrics {
  totalDonors: number;
  totalPledged: number;
  totalDisbursed: number;
  totalUtilized: number;
  disbursementRate: number;
  utilizationRate: number;
  activePrograms: number;
  activeProjects: number;
  totalBeneficiaries: number;
  avgComplianceRating: number;
  byDonorType: Record<DonorType, { count: number; amount: number }>;
  bySector: { sector: string; budget: number; projects: number }[];
  upcomingDeadlines: { type: string; description: string; date: string; donorName: string }[];
}

export class DashboardService {
  static getMetrics(): DonorDashboardMetrics {
    const totalPledged = DONORS.reduce((s, d) => s + d.totalPledged, 0);
    const totalDisbursed = DONORS.reduce((s, d) => s + d.totalDisbursed, 0);
    const totalUtilized = PROJECTS.reduce((s, p) => s + p.budgetUtilized, 0);

    const byDonorType: Record<string, { count: number; amount: number }> = {};
    DONORS.forEach(d => {
      if (!byDonorType[d.type]) byDonorType[d.type] = { count: 0, amount: 0 };
      byDonorType[d.type].count++;
      byDonorType[d.type].amount += d.totalPledged;
    });

    const sectorMap: Record<string, { budget: number; projects: number }> = {};
    PROJECTS.forEach(p => {
      if (!sectorMap[p.sector]) sectorMap[p.sector] = { budget: 0, projects: 0 };
      sectorMap[p.sector].budget += p.budget;
      sectorMap[p.sector].projects++;
    });

    return {
      totalDonors: DONORS.length,
      totalPledged,
      totalDisbursed,
      totalUtilized,
      disbursementRate: Math.round((totalDisbursed / totalPledged) * 100),
      utilizationRate: totalDisbursed > 0 ? Math.round((totalUtilized / totalDisbursed) * 100) : 0,
      activePrograms: PROGRAMS.filter(p => ['committed', 'disbursed'].includes(p.status)).length,
      activeProjects: PROJECTS.filter(p => p.phase === 'implementation').length,
      totalBeneficiaries: PROJECTS.reduce((s, p) => s + p.beneficiaries, 0),
      avgComplianceRating: Math.round(DONORS.reduce((s, d) => s + d.complianceRating, 0) / DONORS.length),
      byDonorType: byDonorType as Record<DonorType, { count: number; amount: number }>,
      bySector: Object.entries(sectorMap).map(([sector, data]) => ({ sector, ...data })),
      upcomingDeadlines: [
        { type: 'report', description: 'Q4 2024 Report Due', date: '2025-01-31', donorName: 'World Bank' },
        { type: 'report', description: 'Semi-annual Report', date: '2025-02-15', donorName: 'EBRD' },
        { type: 'disbursement', description: 'Tranche 3 Conditions', date: '2025-01-31', donorName: 'World Bank' },
      ],
    };
  }
}

// ============================================================================
// MODULE INFO
// ============================================================================

export const DONOR_MODULE_INFO = {
  id: 'donors',
  name: 'Donor Portal',
  nameUk: 'Портал донорів',
  version: '1.0.0',
  description: 'Transparency, fund tracking, and compliance for international donors',
  descriptionUk: 'Прозорість, відстеження коштів та відповідність для міжнародних донорів',
};
