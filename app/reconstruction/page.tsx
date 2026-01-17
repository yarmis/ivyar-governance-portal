'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES & INTERFACES
// ============================================
type UserRole = 'public' | 'donor' | 'contractor' | 'government' | 'auditor' | 'admin';
type ReconstructionView = 
  | 'landing' | 'projects' | 'project-details' | 'map'
  | 'donors' | 'donor-details' | 'donate'
  | 'contractors' | 'contractor-details' | 'contractor-apply'
  | 'procurement' | 'procurement-details'
  | 'logistics' | 'transparency' | 'anti-corruption'
  | 'dashboard' | 'admin' | 'reports';

type ProjectStatus = 'planned' | 'fundraising' | 'procurement' | 'in_progress' | 'completed' | 'verified' | 'on_hold';
type ProjectCategory = 'infrastructure' | 'housing' | 'healthcare' | 'education' | 'energy' | 'water' | 'transport' | 'telecom' | 'agriculture' | 'government';
type ContractorStatus = 'pending' | 'verified' | 'active' | 'suspended' | 'blacklisted';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type FundingSource = 'government' | 'international' | 'ngo' | 'corporate' | 'crowdfund' | 'mixed';

interface Location {
  region: string;
  city: string;
  district?: string;
  coordinates?: { lat: number; lng: number };
}

interface Project {
  id: string;
  projectNumber: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  
  location: Location;
  
  // Financials
  estimatedBudget: number;
  fundedAmount: number;
  spentAmount: number;
  currency: string;
  fundingSource: FundingSource;
  
  // Timeline
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  completionPercentage: number;
  
  // Stakeholders
  donors: { donorId: string; donorName: string; amount: number }[];
  contractorId?: string;
  contractorName?: string;
  governmentAgency: string;
  
  // AI Analysis
  aiRiskScore: number;
  aiRiskFactors: string[];
  aiRecommendations: string[];
  priceAnalysis: {
    estimatedFairPrice: number;
    marketDeviation: number;
    anomalyDetected: boolean;
  };
  
  // Transparency
  publicDocuments: { name: string; type: string; url: string }[];
  milestones: { name: string; targetDate: string; completed: boolean; verifiedBy?: string }[];
  expenditures: { date: string; description: string; amount: number; vendor: string; verified: boolean }[];
  
  // Verification
  independentAudit: boolean;
  lastAuditDate?: string;
  auditScore?: number;
  
  beneficiaries: number;
  impactMetrics: { metric: string; value: string }[];
  
  createdAt: string;
  updatedAt: string;
}

interface Donor {
  id: string;
  name: string;
  type: 'government' | 'organization' | 'corporation' | 'individual' | 'ngo';
  country: string;
  flag: string;
  
  totalPledged: number;
  totalDisbursed: number;
  currency: string;
  
  projectsSupported: number;
  focusAreas: ProjectCategory[];
  
  verificationLevel: 'basic' | 'verified' | 'strategic_partner';
  
  transparencyScore: number;
  
  joinedAt: string;
}

interface Contractor {
  id: string;
  companyName: string;
  registrationNumber: string;
  country: string;
  
  status: ContractorStatus;
  verificationLevel: 'pending' | 'basic' | 'verified' | 'preferred';
  
  // Capabilities
  categories: ProjectCategory[];
  maxProjectSize: number;
  employeeCount: number;
  equipment: string[];
  
  // Track Record
  projectsCompleted: number;
  totalContractValue: number;
  onTimeDelivery: number;
  qualityScore: number;
  
  // AI Scoring
  aiTrustScore: number;
  aiRiskFlags: string[];
  priceCompetitiveness: number;
  
  // Compliance
  licenses: { name: string; valid: boolean; expiresAt: string }[];
  insurance: { type: string; coverage: number; provider: string }[];
  backgroundCheck: boolean;
  ownershipTransparent: boolean;
  
  // Blacklist Check
  sanctionsCleared: boolean;
  corruptionHistoryCleared: boolean;
  
  createdAt: string;
}

interface Procurement {
  id: string;
  procurementNumber: string;
  projectId: string;
  projectName: string;
  
  title: string;
  description: string;
  category: 'materials' | 'equipment' | 'services' | 'works';
  
  status: 'draft' | 'published' | 'bidding' | 'evaluation' | 'awarded' | 'in_progress' | 'completed' | 'cancelled';
  
  estimatedValue: number;
  awardedValue?: number;
  currency: string;
  
  // AI Price Analysis
  aiEstimate: number;
  marketPrice: number;
  priceDeviation: number;
  anomalyFlag: boolean;
  
  bids: {
    contractorId: string;
    contractorName: string;
    amount: number;
    aiScore: number;
    submitted: string;
  }[];
  
  winnerId?: string;
  winnerName?: string;
  
  deadline: string;
  awardDate?: string;
  
  createdAt: string;
}

interface CorruptionAlert {
  id: string;
  type: 'price_anomaly' | 'conflict_of_interest' | 'bid_rigging' | 'shell_company' | 'kickback_pattern' | 'document_fraud' | 'timeline_manipulation';
  severity: RiskLevel;
  
  projectId?: string;
  projectName?: string;
  contractorId?: string;
  contractorName?: string;
  procurementId?: string;
  
  description: string;
  evidence: string[];
  
  aiConfidence: number;
  
  status: 'detected' | 'investigating' | 'confirmed' | 'cleared' | 'escalated';
  
  detectedAt: string;
  resolvedAt?: string;
}

// ============================================
// CONSTANTS & CONFIG
// ============================================
const PROJECT_CATEGORIES: Record<ProjectCategory, { label: string; icon: string; color: string }> = {
  infrastructure: { label: 'Infrastructure', icon: '🏗️', color: '#00A3FF' },
  housing: { label: 'Housing', icon: '🏠', color: '#3CCB7F' },
  healthcare: { label: 'Healthcare', icon: '🏥', color: '#F85149' },
  education: { label: 'Education', icon: '🏫', color: '#A371F7' },
  energy: { label: 'Energy', icon: '⚡', color: '#F59E0B' },
  water: { label: 'Water & Sanitation', icon: '💧', color: '#00A3FF' },
  transport: { label: 'Transport', icon: '🚂', color: '#8B949E' },
  telecom: { label: 'Telecommunications', icon: '📡', color: '#A371F7' },
  agriculture: { label: 'Agriculture', icon: '🌾', color: '#3CCB7F' },
  government: { label: 'Government', icon: '🏛️', color: '#F59E0B' },
};

const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; icon: string }> = {
  planned: { label: 'Planned', color: '#8B949E', icon: '📋' },
  fundraising: { label: 'Fundraising', color: '#A371F7', icon: '💰' },
  procurement: { label: 'Procurement', color: '#00A3FF', icon: '📝' },
  in_progress: { label: 'In Progress', color: '#F59E0B', icon: '🔨' },
  completed: { label: 'Completed', color: '#3CCB7F', icon: '✓' },
  verified: { label: 'Verified', color: '#3CCB7F', icon: '✓✓' },
  on_hold: { label: 'On Hold', color: '#F85149', icon: '⏸️' },
};

const RISK_LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string; icon: string }> = {
  low: { label: 'Low Risk', color: '#3CCB7F', icon: '✓' },
  medium: { label: 'Medium Risk', color: '#F59E0B', icon: '⚠️' },
  high: { label: 'High Risk', color: '#F85149', icon: '🚨' },
  critical: { label: 'Critical', color: '#F85149', icon: '🔴' },
};

// ============================================
// MOCK DATA
// ============================================
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    projectNumber: 'UA-REC-2026-00001',
    name: 'Kyiv Regional Hospital Reconstruction',
    description: 'Full reconstruction of the central regional hospital damaged during missile attacks. Includes new surgical wing, emergency department, and modern diagnostic center.',
    category: 'healthcare',
    status: 'in_progress',
    location: { region: 'Kyiv Oblast', city: 'Brovary', coordinates: { lat: 50.5115, lng: 30.7909 } },
    estimatedBudget: 45000000,
    fundedAmount: 42500000,
    spentAmount: 28750000,
    currency: 'USD',
    fundingSource: 'mixed',
    plannedStart: '2025-06-01',
    plannedEnd: '2027-06-01',
    actualStart: '2025-07-15',
    completionPercentage: 64,
    donors: [
      { donorId: 'don-001', donorName: 'European Union', amount: 25000000 },
      { donorId: 'don-002', donorName: 'United States (USAID)', amount: 12000000 },
      { donorId: 'don-003', donorName: 'Government of Ukraine', amount: 5500000 },
    ],
    contractorId: 'con-001',
    contractorName: 'Budivelnyk Group',
    governmentAgency: 'Ministry of Health',
    aiRiskScore: 18,
    aiRiskFactors: [],
    aiRecommendations: ['Continue current pace', 'Schedule next milestone verification'],
    priceAnalysis: { estimatedFairPrice: 44200000, marketDeviation: 1.8, anomalyDetected: false },
    publicDocuments: [
      { name: 'Project Plan', type: 'pdf', url: '/docs/proj-001-plan.pdf' },
      { name: 'Budget Breakdown', type: 'xlsx', url: '/docs/proj-001-budget.xlsx' },
      { name: 'Progress Report Q4 2025', type: 'pdf', url: '/docs/proj-001-q4.pdf' },
    ],
    milestones: [
      { name: 'Foundation Complete', targetDate: '2025-10-01', completed: true, verifiedBy: 'Independent Auditor' },
      { name: 'Structure Complete', targetDate: '2026-03-01', completed: true, verifiedBy: 'Ministry Inspector' },
      { name: 'Interior & Systems', targetDate: '2026-09-01', completed: false },
      { name: 'Equipment Installation', targetDate: '2027-01-01', completed: false },
      { name: 'Final Commissioning', targetDate: '2027-06-01', completed: false },
    ],
    expenditures: [
      { date: '2025-12-15', description: 'Structural materials - steel', amount: 2450000, vendor: 'MetalProm Ukraine', verified: true },
      { date: '2025-12-20', description: 'Concrete works', amount: 1890000, vendor: 'KyivBeton LLC', verified: true },
      { date: '2026-01-05', description: 'Electrical systems', amount: 890000, vendor: 'ElectroMontazh', verified: true },
    ],
    independentAudit: true,
    lastAuditDate: '2025-12-01',
    auditScore: 94,
    beneficiaries: 450000,
    impactMetrics: [
      { metric: 'Hospital Beds', value: '500 beds' },
      { metric: 'Annual Patients', value: '150,000+' },
      { metric: 'Jobs Created', value: '1,200' },
    ],
    createdAt: '2025-03-15',
    updatedAt: '2026-01-05',
  },
  {
    id: 'proj-002',
    projectNumber: 'UA-REC-2026-00002',
    name: 'Kharkiv School #47 Rebuilding',
    description: 'Complete rebuilding of secondary school destroyed by shelling. Modern educational facility with STEM labs, sports facilities, and bomb shelter.',
    category: 'education',
    status: 'procurement',
    location: { region: 'Kharkiv Oblast', city: 'Kharkiv', district: 'Saltivka', coordinates: { lat: 50.0275, lng: 36.2925 } },
    estimatedBudget: 8500000,
    fundedAmount: 8500000,
    spentAmount: 450000,
    currency: 'USD',
    fundingSource: 'international',
    plannedStart: '2026-03-01',
    plannedEnd: '2027-09-01',
    completionPercentage: 5,
    donors: [
      { donorId: 'don-004', donorName: 'UNICEF', amount: 4500000 },
      { donorId: 'don-005', donorName: 'Government of Germany', amount: 4000000 },
    ],
    governmentAgency: 'Ministry of Education',
    aiRiskScore: 12,
    aiRiskFactors: [],
    aiRecommendations: ['Begin contractor selection', 'Finalize design specifications'],
    priceAnalysis: { estimatedFairPrice: 8200000, marketDeviation: 3.6, anomalyDetected: false },
    publicDocuments: [
      { name: 'Architectural Design', type: 'pdf', url: '/docs/proj-002-design.pdf' },
      { name: 'Tender Documents', type: 'pdf', url: '/docs/proj-002-tender.pdf' },
    ],
    milestones: [
      { name: 'Design Approved', targetDate: '2025-12-15', completed: true, verifiedBy: 'Ministry of Education' },
      { name: 'Contractor Selected', targetDate: '2026-02-15', completed: false },
      { name: 'Construction Start', targetDate: '2026-03-01', completed: false },
    ],
    expenditures: [
      { date: '2025-11-01', description: 'Architectural design services', amount: 320000, vendor: 'ArchDesign Studio', verified: true },
      { date: '2025-12-01', description: 'Site preparation', amount: 130000, vendor: 'Local contractor', verified: true },
    ],
    independentAudit: false,
    beneficiaries: 1200,
    impactMetrics: [
      { metric: 'Student Capacity', value: '1,200 students' },
      { metric: 'Classrooms', value: '45' },
      { metric: 'Bomb Shelter', value: '800 capacity' },
    ],
    createdAt: '2025-08-20',
    updatedAt: '2026-01-03',
  },
  {
    id: 'proj-003',
    projectNumber: 'UA-REC-2026-00003',
    name: 'Mariupol Water Infrastructure',
    description: 'Restoration of critical water supply and treatment infrastructure for Mariupol residents. Includes water treatment plant, distribution network, and monitoring systems.',
    category: 'water',
    status: 'fundraising',
    location: { region: 'Donetsk Oblast', city: 'Mariupol', coordinates: { lat: 47.0951, lng: 37.5499 } },
    estimatedBudget: 125000000,
    fundedAmount: 67000000,
    spentAmount: 0,
    currency: 'USD',
    fundingSource: 'mixed',
    plannedStart: '2026-06-01',
    plannedEnd: '2029-06-01',
    completionPercentage: 0,
    donors: [
      { donorId: 'don-001', donorName: 'European Union', amount: 45000000 },
      { donorId: 'don-006', donorName: 'World Bank', amount: 22000000 },
    ],
    governmentAgency: 'Ministry of Infrastructure',
    aiRiskScore: 35,
    aiRiskFactors: ['Security situation', 'Large budget requires enhanced oversight'],
    aiRecommendations: ['Implement phased approach', 'Establish secure procurement channels', 'Deploy enhanced monitoring'],
    priceAnalysis: { estimatedFairPrice: 118000000, marketDeviation: 5.9, anomalyDetected: false },
    publicDocuments: [
      { name: 'Feasibility Study', type: 'pdf', url: '/docs/proj-003-feasibility.pdf' },
      { name: 'Needs Assessment', type: 'pdf', url: '/docs/proj-003-assessment.pdf' },
    ],
    milestones: [
      { name: 'Funding Secured', targetDate: '2026-04-01', completed: false },
      { name: 'Contractor Selection', targetDate: '2026-05-15', completed: false },
    ],
    expenditures: [],
    independentAudit: false,
    beneficiaries: 350000,
    impactMetrics: [
      { metric: 'Population Served', value: '350,000' },
      { metric: 'Daily Capacity', value: '150,000 m³' },
      { metric: 'Network Length', value: '450 km' },
    ],
    createdAt: '2025-10-01',
    updatedAt: '2026-01-04',
  },
];

const SAMPLE_DONORS: Donor[] = [
  {
    id: 'don-001',
    name: 'European Union',
    type: 'organization',
    country: 'EU',
    flag: '🇪🇺',
    totalPledged: 18000000000,
    totalDisbursed: 12500000000,
    currency: 'EUR',
    projectsSupported: 1247,
    focusAreas: ['infrastructure', 'energy', 'healthcare', 'education'],
    verificationLevel: 'strategic_partner',
    transparencyScore: 98,
    joinedAt: '2022-03-01',
  },
  {
    id: 'don-002',
    name: 'United States (USAID)',
    type: 'government',
    country: 'US',
    flag: '🇺🇸',
    totalPledged: 8500000000,
    totalDisbursed: 6200000000,
    currency: 'USD',
    projectsSupported: 892,
    focusAreas: ['infrastructure', 'healthcare', 'government', 'agriculture'],
    verificationLevel: 'strategic_partner',
    transparencyScore: 96,
    joinedAt: '2022-03-15',
  },
  {
    id: 'don-003',
    name: 'Government of Ukraine',
    type: 'government',
    country: 'UA',
    flag: '🇺🇦',
    totalPledged: 5000000000,
    totalDisbursed: 3800000000,
    currency: 'UAH',
    projectsSupported: 2456,
    focusAreas: ['infrastructure', 'housing', 'healthcare', 'education', 'energy'],
    verificationLevel: 'strategic_partner',
    transparencyScore: 92,
    joinedAt: '2022-02-24',
  },
  {
    id: 'don-004',
    name: 'UNICEF',
    type: 'ngo',
    country: 'INT',
    flag: '🌍',
    totalPledged: 850000000,
    totalDisbursed: 720000000,
    currency: 'USD',
    projectsSupported: 345,
    focusAreas: ['education', 'healthcare', 'water'],
    verificationLevel: 'strategic_partner',
    transparencyScore: 99,
    joinedAt: '2022-03-05',
  },
  {
    id: 'don-005',
    name: 'Government of Germany',
    type: 'government',
    country: 'DE',
    flag: '🇩🇪',
    totalPledged: 4200000000,
    totalDisbursed: 2900000000,
    currency: 'EUR',
    projectsSupported: 567,
    focusAreas: ['energy', 'infrastructure', 'housing'],
    verificationLevel: 'strategic_partner',
    transparencyScore: 97,
    joinedAt: '2022-03-10',
  },
];

const SAMPLE_CONTRACTORS: Contractor[] = [
  {
    id: 'con-001',
    companyName: 'Budivelnyk Group',
    registrationNumber: 'UA-12345678',
    country: 'Ukraine',
    status: 'active',
    verificationLevel: 'preferred',
    categories: ['infrastructure', 'healthcare', 'education'],
    maxProjectSize: 100000000,
    employeeCount: 2500,
    equipment: ['Heavy machinery', 'Cranes', 'Concrete plants'],
    projectsCompleted: 47,
    totalContractValue: 892000000,
    onTimeDelivery: 94,
    qualityScore: 96,
    aiTrustScore: 92,
    aiRiskFlags: [],
    priceCompetitiveness: 88,
    licenses: [
      { name: 'General Construction License', valid: true, expiresAt: '2027-12-31' },
      { name: 'Medical Facility License', valid: true, expiresAt: '2026-06-30' },
    ],
    insurance: [
      { type: 'Liability', coverage: 50000000, provider: 'IVYAR Insurance' },
      { type: 'Equipment', coverage: 25000000, provider: 'IVYAR Insurance' },
    ],
    backgroundCheck: true,
    ownershipTransparent: true,
    sanctionsCleared: true,
    corruptionHistoryCleared: true,
    createdAt: '2023-01-15',
  },
  {
    id: 'con-002',
    companyName: 'EnergoMontazh',
    registrationNumber: 'UA-87654321',
    country: 'Ukraine',
    status: 'verified',
    verificationLevel: 'verified',
    categories: ['energy', 'infrastructure'],
    maxProjectSize: 50000000,
    employeeCount: 800,
    equipment: ['Electrical equipment', 'Transformers', 'Cable layers'],
    projectsCompleted: 23,
    totalContractValue: 245000000,
    onTimeDelivery: 91,
    qualityScore: 93,
    aiTrustScore: 87,
    aiRiskFlags: [],
    priceCompetitiveness: 92,
    licenses: [
      { name: 'Electrical Works License', valid: true, expiresAt: '2027-03-15' },
    ],
    insurance: [
      { type: 'Liability', coverage: 20000000, provider: 'IVYAR Insurance' },
    ],
    backgroundCheck: true,
    ownershipTransparent: true,
    sanctionsCleared: true,
    corruptionHistoryCleared: true,
    createdAt: '2023-06-20',
  },
];

const SAMPLE_ALERTS: CorruptionAlert[] = [
  {
    id: 'alert-001',
    type: 'price_anomaly',
    severity: 'medium',
    projectId: 'proj-004',
    projectName: 'Odesa Port Road Repair',
    procurementId: 'proc-012',
    description: 'Bid price 34% above AI-estimated fair market value for asphalt materials',
    evidence: ['Price comparison with 12 similar procurements', 'Market rate analysis', 'Historical pricing data'],
    aiConfidence: 87,
    status: 'investigating',
    detectedAt: '2026-01-03 14:23:00',
  },
  {
    id: 'alert-002',
    type: 'conflict_of_interest',
    severity: 'high',
    contractorId: 'con-005',
    contractorName: 'BuildTech Solutions',
    description: 'Potential ownership connection between contractor and procurement committee member detected',
    evidence: ['Corporate registry analysis', 'Ownership chain investigation', 'Related party transactions'],
    aiConfidence: 78,
    status: 'escalated',
    detectedAt: '2026-01-02 09:45:00',
  },
  {
    id: 'alert-003',
    type: 'bid_rigging',
    severity: 'critical',
    procurementId: 'proc-008',
    description: 'Suspicious bidding pattern detected: 3 bids with identical pricing structure submitted within 2 minutes',
    evidence: ['Bid timing analysis', 'Price correlation', 'IP address clustering'],
    aiConfidence: 94,
    status: 'confirmed',
    detectedAt: '2025-12-28 16:12:00',
  },
];

const PLATFORM_STATS = {
  totalProjects: 3847,
  activeProjects: 1234,
  completedProjects: 892,
  totalBudget: 47500000000,
  totalFunded: 38900000000,
  totalSpent: 24600000000,
  totalDonors: 127,
  totalContractors: 2456,
  verifiedContractors: 1892,
  corruptionAlerts: 234,
  alertsResolved: 189,
  savedFromCorruption: 890000000,
  beneficiaries: 12500000,
  transparencyScore: 94,
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ReconstructionModulePage() {
  const [currentView, setCurrentView] = useState<ReconstructionView>('landing');
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#005BBB] to-[#FFD500] rounded-xl flex items-center justify-center">
                <span className="text-xl">🇺🇦</span>
              </div>
              <div>
                <div className="font-bold">REBUILD UKRAINE</div>
                <div className="text-xs text-[#6E7681]">Transparent Reconstruction</div>
              </div>
            </Link>
            <span className="text-xs bg-[#FFD500]/20 text-[#FFD500] px-2 py-0.5 rounded-full font-mono">v1.0</span>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { id: 'projects', label: 'Projects', icon: '🏗️' },
              { id: 'map', label: 'Map', icon: '🗺️' },
              { id: 'donors', label: 'Donors', icon: '💰' },
              { id: 'contractors', label: 'Contractors', icon: '🏢' },
              { id: 'transparency', label: 'Transparency', icon: '👁️' },
              { id: 'anti-corruption', label: 'AI Guard', icon: '🛡️' },
              ...(userRole === 'admin' || userRole === 'government' ? [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }] : []),
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ReconstructionView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-[#005BBB]/20 text-[#FFD500]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="public">🌍 Public</option>
              <option value="donor">💰 Donor</option>
              <option value="contractor">🏢 Contractor</option>
              <option value="government">🏛️ Government</option>
              <option value="auditor">🔍 Auditor</option>
              <option value="admin">👑 Admin</option>
            </select>
            <button 
              onClick={() => setCurrentView('donate')}
              className="bg-[#FFD500] text-[#0D1117] px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Donate
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {currentView === 'landing' && <LandingPage onExplore={() => setCurrentView('projects')} stats={PLATFORM_STATS} />}
        {currentView === 'projects' && (
          <ProjectsPage 
            projects={SAMPLE_PROJECTS}
            onViewProject={(p) => { setSelectedProject(p); setCurrentView('project-details'); }}
          />
        )}
        {currentView === 'project-details' && selectedProject && (
          <ProjectDetailsPage project={selectedProject} onBack={() => setCurrentView('projects')} />
        )}
        {currentView === 'map' && <MapPage projects={SAMPLE_PROJECTS} />}
        {currentView === 'donors' && (
          <DonorsPage 
            donors={SAMPLE_DONORS}
            onViewDonor={(d) => { setSelectedDonor(d); setCurrentView('donor-details'); }}
          />
        )}
        {currentView === 'donor-details' && selectedDonor && (
          <DonorDetailsPage donor={selectedDonor} projects={SAMPLE_PROJECTS} onBack={() => setCurrentView('donors')} />
        )}
        {currentView === 'donate' && <DonatePage />}
        {currentView === 'contractors' && (
          <ContractorsPage 
            contractors={SAMPLE_CONTRACTORS}
            onViewContractor={(c) => { setSelectedContractor(c); setCurrentView('contractor-details'); }}
          />
        )}
        {currentView === 'contractor-details' && selectedContractor && (
          <ContractorDetailsPage contractor={selectedContractor} onBack={() => setCurrentView('contractors')} />
        )}
        {currentView === 'transparency' && <TransparencyPage stats={PLATFORM_STATS} projects={SAMPLE_PROJECTS} />}
        {currentView === 'anti-corruption' && <AntiCorruptionPage alerts={SAMPLE_ALERTS} stats={PLATFORM_STATS} />}
        {currentView === 'dashboard' && <DashboardPage stats={PLATFORM_STATS} projects={SAMPLE_PROJECTS} alerts={SAMPLE_ALERTS} />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-6 mt-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-[#6E7681]">
            <div>© 2024-2026 IVYAR. All rights reserved.</div>
            <div className="flex gap-3">
              <span className="bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded text-xs">100% Transparent</span>
              <span className="bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded text-xs">AI Protected</span>
              <span className="bg-[#FFD500]/20 text-[#FFD500] px-2 py-1 rounded text-xs">🇺🇦</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// LANDING PAGE
// ============================================
function LandingPage({ onExplore, stats }: { onExplore: () => void; stats: typeof PLATFORM_STATS }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005BBB]/20 via-transparent to-[#FFD500]/20"></div>
        <div className="max-w-[1440px] mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FFD500]/20 text-[#FFD500] px-4 py-2 rounded-full text-sm mb-6">
              <span>🇺🇦</span>
              <span>Rebuilding Ukraine • Transparent • Accountable • Corruption-Free</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Every Dollar Tracked.<br/>
              <span className="text-[#005BBB]">Every Project Open.</span><br/>
              <span className="text-[#FFD500]">Every Contract Verified.</span>
            </h1>
            <p className="text-xl text-[#8B949E] mb-8">
              The world's most transparent reconstruction platform. AI-powered anti-corruption.
              Real-time tracking of every donation, every project, every contractor.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onExplore}
                className="bg-gradient-to-r from-[#005BBB] to-[#FFD500] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all"
              >
                Explore Projects →
              </button>
              <button onClick={() => alert("Donate to Ukraine Reconstruction\n\nSupport verified rebuilding projects with full transparency.\n\nDonation portal coming soon!")} className="bg-[#161B22] border border-[#1F242C] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1F242C] transition-all cursor-pointer">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-5 gap-4">
            {[
              { value: `$${(stats.totalFunded / 1000000000).toFixed(1)}B`, label: 'Total Funded', icon: '💰' },
              { value: stats.activeProjects.toLocaleString(), label: 'Active Projects', icon: '🏗️' },
              { value: `${(stats.beneficiaries / 1000000).toFixed(1)}M`, label: 'Beneficiaries', icon: '👥' },
              { value: `$${(stats.savedFromCorruption / 1000000).toFixed(0)}M`, label: 'Saved from Corruption', icon: '🛡️' },
              { value: `${stats.transparencyScore}%`, label: 'Transparency Score', icon: '👁️' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 text-center">
                <span className="text-2xl">{stat.icon}</span>
                <div className="text-2xl font-bold mt-2 text-[#FFD500]">{stat.value}</div>
                <div className="text-xs text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Reconstruction Sectors</h2>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(PROJECT_CATEGORIES).slice(0, 5).map(([key, cat]) => (
              <div key={key} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center hover:border-[#FFD500]/50 transition-all cursor-pointer">
                <span className="text-4xl">{cat.icon}</span>
                <div className="font-semibold mt-3">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">How Transparency Works</h2>
          <p className="text-center text-[#8B949E] mb-12 max-w-2xl mx-auto">
            Every step of the reconstruction process is tracked, verified, and publicly visible.
          </p>
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: '💰', title: 'Donors Fund', desc: 'Governments, NGOs, and individuals contribute directly' },
              { icon: '🤖', title: 'AI Verifies', desc: 'Every contractor, price, and bid is AI-analyzed' },
              { icon: '🏗️', title: 'Projects Execute', desc: 'Real-time tracking of milestones and spending' },
              { icon: '👁️', title: 'Public Audits', desc: 'Anyone can verify any transaction, any time' },
            ].map((step, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
                <span className="text-4xl">{step.icon}</span>
                <div className="font-semibold mt-3">{step.title}</div>
                <div className="text-sm text-[#8B949E] mt-2">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anti-Corruption Banner */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="bg-gradient-to-r from-[#F85149]/10 to-[#A371F7]/10 border border-[#F85149]/30 rounded-xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🛡️ AI Anti-Corruption Engine</h3>
                <p className="text-[#8B949E] max-w-xl">
                  Our AI system analyzes every transaction for price anomalies, bid rigging, 
                  conflict of interest, and shell companies. Zero tolerance for corruption.
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[#3CCB7F]">${(stats.savedFromCorruption / 1000000).toFixed(0)}M</div>
                <div className="text-sm text-[#8B949E]">Saved from corruption</div>
                <div className="text-sm text-[#3CCB7F] mt-1">{stats.alertsResolved}/{stats.corruptionAlerts} alerts resolved</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// PROJECTS PAGE
// ============================================
function ProjectsPage({ 
  projects, 
  onViewProject 
}: { 
  projects: Project[];
  onViewProject: (project: Project) => void;
}) {
  const [filterCategory, setFilterCategory] = useState<ProjectCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = projects.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reconstruction Projects</h1>
          <p className="text-[#8B949E]">Track every project in real-time</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ProjectCategory | 'all')}
            className="bg-[#161B22] border border-[#1F242C] rounded-lg px-4 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {Object.entries(PROJECT_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.icon} {cat.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
            className="bg-[#161B22] border border-[#1F242C] rounded-lg px-4 py-2 text-sm"
          >
            <option value="all">All Status</option>
            {Object.entries(PROJECT_STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const cat = PROJECT_CATEGORIES[project.category];
          const status = PROJECT_STATUS_CONFIG[project.status];
          const fundingProgress = Math.round((project.fundedAmount / project.estimatedBudget) * 100);
          
          return (
            <div 
              key={project.id}
              onClick={() => onViewProject(project)}
              className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#FFD500]/50 transition-all cursor-pointer"
            >
              <div className="h-2" style={{ backgroundColor: cat.color }}></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-[#6E7681]">{project.location.city}, {project.location.region}</div>
                    </div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>

                <p className="text-sm text-[#8B949E] mb-4 line-clamp-2">{project.description}</p>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8B949E]">Funded</span>
                    <span className="font-mono">${(project.fundedAmount / 1000000).toFixed(1)}M / ${(project.estimatedBudget / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="h-2 bg-[#1F242C] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#005BBB] to-[#FFD500] rounded-full"
                      style={{ width: `${fundingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Completion Progress */}
                {project.status === 'in_progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#8B949E]">Completion</span>
                      <span className="font-mono text-[#3CCB7F]">{project.completionPercentage}%</span>
                    </div>
                    <div className="h-2 bg-[#1F242C] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#3CCB7F] rounded-full"
                        style={{ width: `${project.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1F242C]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8B949E]">AI Risk:</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      project.aiRiskScore < 25 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                      project.aiRiskScore < 50 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#F85149]/20 text-[#F85149]'
                    }`}>
                      {project.aiRiskScore}%
                    </span>
                  </div>
                  <div className="text-xs text-[#8B949E]">
                    {project.beneficiaries.toLocaleString()} beneficiaries
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// PROJECT DETAILS PAGE
// ============================================
function ProjectDetailsPage({ project, onBack }: { project: Project; onBack: () => void }) {
  const cat = PROJECT_CATEGORIES[project.category];
  const status = PROJECT_STATUS_CONFIG[project.status];
  const fundingProgress = Math.round((project.fundedAmount / project.estimatedBudget) * 100);
  const spendingProgress = Math.round((project.spentAmount / project.fundedAmount) * 100);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Projects
      </button>

      {/* Header */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden mb-6">
        <div className="h-2" style={{ backgroundColor: cat.color }}></div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{cat.icon}</span>
              <div>
                <div className="text-sm text-[#6E7681] font-mono mb-1">{project.projectNumber}</div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <div className="text-[#8B949E]">{project.location.city}, {project.location.region}</div>
              </div>
            </div>
            <div className="text-right">
              <span 
                className="px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
                style={{ backgroundColor: `${status.color}20`, color: status.color }}
              >
                {status.icon} {status.label}
              </span>
              {project.independentAudit && (
                <div className="mt-2 text-xs text-[#3CCB7F]">✓ Independently Audited</div>
              )}
            </div>
          </div>
          <p className="text-[#8B949E]">{project.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Financial Overview */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">💰 Financial Overview</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-xs text-[#8B949E]">Budget</div>
                <div className="text-xl font-bold">${(project.estimatedBudget / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-xs text-[#8B949E]">Funded</div>
                <div className="text-xl font-bold text-[#005BBB]">${(project.fundedAmount / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4 text-center">
                <div className="text-xs text-[#8B949E]">Spent</div>
                <div className="text-xl font-bold text-[#FFD500]">${(project.spentAmount / 1000000).toFixed(1)}M</div>
              </div>
            </div>

            {/* Progress bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#8B949E]">Funding Progress</span>
                  <span>{fundingProgress}%</span>
                </div>
                <div className="h-3 bg-[#1F242C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#005BBB] rounded-full" style={{ width: `${fundingProgress}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#8B949E]">Spending Progress</span>
                  <span>{spendingProgress}%</span>
                </div>
                <div className="h-3 bg-[#1F242C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFD500] rounded-full" style={{ width: `${spendingProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Donors */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">🤝 Donors</h3>
            <div className="space-y-3">
              {project.donors.map((donor, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg">
                  <span>{donor.donorName}</span>
                  <span className="font-mono font-bold">${(donor.amount / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">📋 Milestones</h3>
            <div className="space-y-3">
              {project.milestones.map((milestone, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${
                  milestone.completed ? 'bg-[#3CCB7F]/10' : 'bg-[#0D1117]'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    milestone.completed ? 'bg-[#3CCB7F] text-[#0D1117]' : 'bg-[#1F242C] text-[#8B949E]'
                  }`}>
                    {milestone.completed ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className={milestone.completed ? 'text-[#3CCB7F]' : ''}>{milestone.name}</div>
                    <div className="text-xs text-[#6E7681]">Target: {milestone.targetDate}</div>
                  </div>
                  {milestone.verifiedBy && (
                    <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">
                      ✓ {milestone.verifiedBy}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expenditures */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">📄 Recent Expenditures</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#8B949E] border-b border-[#1F242C]">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Vendor</th>
                    <th className="text-right p-3">Amount</th>
                    <th className="text-center p-3">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {project.expenditures.map((exp, i) => (
                    <tr key={i} className="border-b border-[#1F242C]">
                      <td className="p-3 text-[#8B949E]">{exp.date}</td>
                      <td className="p-3">{exp.description}</td>
                      <td className="p-3 text-[#8B949E]">{exp.vendor}</td>
                      <td className="p-3 text-right font-mono">${exp.amount.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        {exp.verified ? (
                          <span className="text-[#3CCB7F]">✓</span>
                        ) : (
                          <span className="text-[#8B949E]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Analysis */}
          <div className="bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10 border border-[#A371F7]/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span>🤖</span>
              <h3 className="font-semibold">AI Analysis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#8B949E]">Risk Score</span>
                <span className={`text-sm font-bold ${
                  project.aiRiskScore < 25 ? 'text-[#3CCB7F]' :
                  project.aiRiskScore < 50 ? 'text-[#F59E0B]' : 'text-[#F85149]'
                }`}>{project.aiRiskScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#8B949E]">Fair Price Est.</span>
                <span className="text-sm font-mono">${(project.priceAnalysis.estimatedFairPrice / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#8B949E]">Market Deviation</span>
                <span className={`text-sm ${project.priceAnalysis.anomalyDetected ? 'text-[#F85149]' : 'text-[#3CCB7F]'}`}>
                  {project.priceAnalysis.marketDeviation > 0 ? '+' : ''}{project.priceAnalysis.marketDeviation}%
                </span>
              </div>
            </div>
            {project.aiRecommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#1F242C]">
                <div className="text-xs text-[#8B949E] mb-2">Recommendations</div>
                {project.aiRecommendations.map((rec, i) => (
                  <div key={i} className="text-xs text-[#8B949E] flex items-start gap-2">
                    <span className="text-[#A371F7]">→</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contractor */}
          {project.contractorName && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
              <h3 className="font-semibold mb-3">🏢 Contractor</h3>
              <div className="font-medium">{project.contractorName}</div>
              <div className="text-sm text-[#8B949E]">Verified Contractor</div>
            </div>
          )}

          {/* Impact */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <h3 className="font-semibold mb-3">📊 Impact</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#FFD500]">{project.beneficiaries.toLocaleString()}</div>
              <div className="text-sm text-[#8B949E]">Beneficiaries</div>
            </div>
            <div className="space-y-2">
              {project.impactMetrics.map((m, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#8B949E]">{m.metric}</span>
                  <span>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <h3 className="font-semibold mb-3">📁 Public Documents</h3>
            <div className="space-y-2">
              {project.publicDocuments.map((doc, i) => (
                <button key={i} className="w-full flex items-center gap-2 p-2 bg-[#0D1117] rounded hover:bg-[#1F242C] text-left text-sm">
                  <span>📄</span>
                  <span className="flex-1">{doc.name}</span>
                  <span className="text-[#00A3FF]">↓</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAP PAGE
// ============================================
function MapPage({ projects }: { projects: Project[] }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">🗺️ Project Map</h1>
      
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="h-[600px] flex items-center justify-center bg-[#0D1117]">
          <div className="text-center">
            <span className="text-6xl">🗺️</span>
            <p className="text-[#8B949E] mt-4">Interactive map with {projects.length} projects</p>
            <p className="text-xs text-[#6E7681] mt-2">Mapbox/Leaflet integration ready</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 justify-center">
        {Object.entries(PROJECT_STATUS_CONFIG).slice(0, 4).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }}></div>
            <span className="text-[#8B949E]">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// DONORS PAGE
// ============================================
function DonorsPage({ 
  donors, 
  onViewDonor 
}: { 
  donors: Donor[];
  onViewDonor: (donor: Donor) => void;
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Donors & Contributors</h1>
      <p className="text-[#8B949E] mb-8">Transparent tracking of all contributions to Ukraine's reconstruction</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {donors.map((donor) => (
          <div 
            key={donor.id}
            onClick={() => onViewDonor(donor)}
            className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 hover:border-[#FFD500]/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{donor.flag}</span>
                <div>
                  <div className="font-semibold text-lg">{donor.name}</div>
                  <div className="text-sm text-[#8B949E] capitalize">{donor.type}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                donor.verificationLevel === 'strategic_partner' ? 'bg-[#FFD500]/20 text-[#FFD500]' : 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
              }`}>
                {donor.verificationLevel === 'strategic_partner' ? '⭐ Strategic Partner' : '✓ Verified'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <div className="text-xs text-[#8B949E]">Pledged</div>
                <div className="font-bold text-[#005BBB]">${(donor.totalPledged / 1000000000).toFixed(1)}B</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <div className="text-xs text-[#8B949E]">Disbursed</div>
                <div className="font-bold text-[#3CCB7F]">${(donor.totalDisbursed / 1000000000).toFixed(1)}B</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-3 text-center">
                <div className="text-xs text-[#8B949E]">Projects</div>
                <div className="font-bold">{donor.projectsSupported.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {donor.focusAreas.slice(0, 4).map((area) => (
                  <span key={area} className="text-lg">{PROJECT_CATEGORIES[area].icon}</span>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-[#8B949E]">Transparency: </span>
                <span className="text-[#3CCB7F] font-bold">{donor.transparencyScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// DONOR DETAILS PAGE
// ============================================
function DonorDetailsPage({ donor, projects, onBack }: { donor: Donor; projects: Project[]; onBack: () => void }) {
  const donorProjects = projects.filter(p => p.donors.some(d => d.donorId === donor.id));

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Donors
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl">{donor.flag}</span>
          <div>
            <h1 className="text-2xl font-bold">{donor.name}</h1>
            <div className="text-[#8B949E] capitalize">{donor.type}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Total Pledged</div>
            <div className="text-2xl font-bold text-[#005BBB]">${(donor.totalPledged / 1000000000).toFixed(1)}B</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Total Disbursed</div>
            <div className="text-2xl font-bold text-[#3CCB7F]">${(donor.totalDisbursed / 1000000000).toFixed(1)}B</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Projects Supported</div>
            <div className="text-2xl font-bold">{donor.projectsSupported.toLocaleString()}</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Transparency Score</div>
            <div className="text-2xl font-bold text-[#FFD500]">{donor.transparencyScore}%</div>
          </div>
        </div>
      </div>

      {/* Projects by this donor */}
      <h3 className="font-semibold mb-4">Projects Supported</h3>
      <div className="space-y-4">
        {donorProjects.map((project) => {
          const donorContribution = project.donors.find(d => d.donorId === donor.id);
          return (
            <div key={project.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{PROJECT_CATEGORIES[project.category].icon}</span>
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-[#6E7681]">{project.location.city}, {project.location.region}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#FFD500]">${(donorContribution?.amount || 0 / 1000000).toLocaleString()}</div>
                <div className="text-xs text-[#8B949E]">contribution</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// DONATE PAGE
// ============================================
function DonatePage() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Donate to Rebuild Ukraine</h1>
      <p className="text-[#8B949E] mb-8">100% transparent. Track every dollar.</p>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[100, 500, 1000].map((amount) => (
            <button key={amount} className="bg-[#0D1117] border border-[#1F242C] rounded-xl p-6 text-center hover:border-[#FFD500] transition-all">
              <div className="text-2xl font-bold text-[#FFD500]">${amount}</div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#8B949E] mb-2">Custom Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B949E]">$</span>
            <input 
              type="number"
              placeholder="0.00"
              className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 pl-8 text-xl"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#8B949E] mb-2">Direct to Sector (Optional)</label>
          <select className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3">
            <option value="">All sectors (platform decides)</option>
            {Object.entries(PROJECT_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>

        <button onClick={() => alert("Donate to Ukraine 🇺🇦\n\nYour donation supports verified reconstruction projects with full blockchain transparency.\n\nSecure donation portal launching soon!")} className="w-full bg-gradient-to-r from-[#005BBB] to-[#FFD500] text-white py-4 rounded-xl font-bold text-lg cursor-pointer">
          Donate Now 🇺🇦
        </button>

        <p className="text-center text-xs text-[#6E7681] mt-4">
          Your donation is tax-deductible. You will receive a receipt and be able to track how your funds are used.
        </p>
      </div>
    </div>
  );
}

// ============================================
// CONTRACTORS PAGE
// ============================================
function ContractorsPage({ 
  contractors, 
  onViewContractor 
}: { 
  contractors: Contractor[];
  onViewContractor: (contractor: Contractor) => void;
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Verified Contractors</h1>
          <p className="text-[#8B949E]">AI-verified, background-checked, performance-tracked</p>
        </div>
        <button className="bg-[#FFD500] text-[#0D1117] px-4 py-2 rounded-lg font-semibold">
          Apply as Contractor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contractors.map((contractor) => (
          <div 
            key={contractor.id}
            onClick={() => onViewContractor(contractor)}
            className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 hover:border-[#3CCB7F]/50 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-lg">{contractor.companyName}</div>
                <div className="text-sm text-[#8B949E]">{contractor.registrationNumber}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                contractor.verificationLevel === 'preferred' ? 'bg-[#FFD500]/20 text-[#FFD500]' :
                contractor.verificationLevel === 'verified' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                'bg-[#8B949E]/20 text-[#8B949E]'
              }`}>
                {contractor.verificationLevel === 'preferred' ? '⭐ Preferred' : '✓ Verified'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-[#0D1117] rounded-lg p-2 text-center">
                <div className="text-xs text-[#8B949E]">Trust Score</div>
                <div className="font-bold text-[#3CCB7F]">{contractor.aiTrustScore}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-2 text-center">
                <div className="text-xs text-[#8B949E]">Projects</div>
                <div className="font-bold">{contractor.projectsCompleted}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-2 text-center">
                <div className="text-xs text-[#8B949E]">On-Time</div>
                <div className="font-bold">{contractor.onTimeDelivery}%</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-2 text-center">
                <div className="text-xs text-[#8B949E]">Quality</div>
                <div className="font-bold">{contractor.qualityScore}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {contractor.categories.slice(0, 3).map((cat) => (
                  <span key={cat} className="text-lg">{PROJECT_CATEGORIES[cat].icon}</span>
                ))}
              </div>
              <div className="flex gap-2">
                {contractor.sanctionsCleared && (
                  <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">✓ Sanctions Clear</span>
                )}
                {contractor.backgroundCheck && (
                  <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">✓ Background OK</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CONTRACTOR DETAILS PAGE
// ============================================
function ContractorDetailsPage({ contractor, onBack }: { contractor: Contractor; onBack: () => void }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Contractors
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{contractor.companyName}</h1>
            <div className="text-[#8B949E]">{contractor.registrationNumber} • {contractor.country}</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#3CCB7F]">{contractor.aiTrustScore}</div>
            <div className="text-sm text-[#8B949E]">AI Trust Score</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Projects</div>
            <div className="text-xl font-bold">{contractor.projectsCompleted}</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Total Value</div>
            <div className="text-xl font-bold">${(contractor.totalContractValue / 1000000).toFixed(0)}M</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">On-Time</div>
            <div className="text-xl font-bold text-[#3CCB7F]">{contractor.onTimeDelivery}%</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Quality</div>
            <div className="text-xl font-bold text-[#3CCB7F]">{contractor.qualityScore}</div>
          </div>
          <div className="bg-[#0D1117] rounded-xl p-4 text-center">
            <div className="text-xs text-[#8B949E]">Price Index</div>
            <div className="text-xl font-bold">{contractor.priceCompetitiveness}</div>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">✓ Verification Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Sanctions Cleared', value: contractor.sanctionsCleared },
              { label: 'Corruption History Clear', value: contractor.corruptionHistoryCleared },
              { label: 'Background Check', value: contractor.backgroundCheck },
              { label: 'Ownership Transparent', value: contractor.ownershipTransparent },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0D1117] rounded">
                <span className="text-sm">{item.label}</span>
                <span className={item.value ? 'text-[#3CCB7F]' : 'text-[#F85149]'}>
                  {item.value ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">📄 Licenses & Insurance</h3>
          <div className="space-y-3">
            {contractor.licenses.map((license, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-[#0D1117] rounded">
                <span className="text-sm">{license.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${license.valid ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F85149]/20 text-[#F85149]'}`}>
                  {license.valid ? 'Valid' : 'Expired'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRANSPARENCY PAGE
// ============================================
function TransparencyPage({ stats, projects }: { stats: typeof PLATFORM_STATS; projects: Project[] }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">👁️ Full Transparency Dashboard</h1>
      <p className="text-[#8B949E] mb-8">Every dollar tracked. Every decision auditable. No exceptions.</p>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#005BBB]/20 to-[#FFD500]/20 border border-[#FFD500]/30 rounded-xl p-6 text-center">
          <span className="text-4xl">💰</span>
          <div className="text-3xl font-bold mt-2">${(stats.totalFunded / 1000000000).toFixed(1)}B</div>
          <div className="text-sm text-[#8B949E]">Total Funded</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
          <span className="text-4xl">📊</span>
          <div className="text-3xl font-bold mt-2">${(stats.totalSpent / 1000000000).toFixed(1)}B</div>
          <div className="text-sm text-[#8B949E]">Verified Spent</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
          <span className="text-4xl">🛡️</span>
          <div className="text-3xl font-bold mt-2 text-[#3CCB7F]">${(stats.savedFromCorruption / 1000000).toFixed(0)}M</div>
          <div className="text-sm text-[#8B949E]">Saved from Corruption</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
          <span className="text-4xl">✓</span>
          <div className="text-3xl font-bold mt-2 text-[#FFD500]">{stats.transparencyScore}%</div>
          <div className="text-sm text-[#8B949E]">Transparency Score</div>
        </div>
      </div>

      {/* Fund Flow */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">💸 Fund Flow Visualization</h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-[#005BBB]/20 rounded-xl p-4 text-center">
            <div className="text-sm text-[#8B949E]">Pledged</div>
            <div className="text-2xl font-bold">${(stats.totalBudget / 1000000000).toFixed(1)}B</div>
          </div>
          <span className="text-2xl text-[#FFD500]">→</span>
          <div className="flex-1 bg-[#3CCB7F]/20 rounded-xl p-4 text-center">
            <div className="text-sm text-[#8B949E]">Disbursed</div>
            <div className="text-2xl font-bold">${(stats.totalFunded / 1000000000).toFixed(1)}B</div>
          </div>
          <span className="text-2xl text-[#FFD500]">→</span>
          <div className="flex-1 bg-[#FFD500]/20 rounded-xl p-4 text-center">
            <div className="text-sm text-[#8B949E]">Spent & Verified</div>
            <div className="text-2xl font-bold">${(stats.totalSpent / 1000000000).toFixed(1)}B</div>
          </div>
        </div>
      </div>

      {/* Live Activity */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">📡 Live Activity Feed</h3>
        <div className="space-y-3">
          {[
            { time: '2 min ago', event: 'Expenditure verified', details: 'Kyiv Hospital - Steel materials - $2.45M', type: 'verified' },
            { time: '15 min ago', event: 'Milestone completed', details: 'Kharkiv School - Design phase', type: 'milestone' },
            { time: '1 hr ago', event: 'New donation', details: 'UNICEF - $4.5M to education', type: 'donation' },
            { time: '2 hrs ago', event: 'AI alert resolved', details: 'Price anomaly investigation cleared', type: 'alert' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[#0D1117] rounded-lg">
              <span className={`w-2 h-2 rounded-full ${
                activity.type === 'verified' ? 'bg-[#3CCB7F]' :
                activity.type === 'milestone' ? 'bg-[#00A3FF]' :
                activity.type === 'donation' ? 'bg-[#FFD500]' : 'bg-[#F59E0B]'
              }`}></span>
              <div className="flex-1">
                <span className="font-medium">{activity.event}</span>
                <span className="text-[#8B949E] mx-2">•</span>
                <span className="text-sm text-[#8B949E]">{activity.details}</span>
              </div>
              <span className="text-xs text-[#6E7681]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ANTI-CORRUPTION PAGE
// ============================================
function AntiCorruptionPage({ alerts, stats }: { alerts: CorruptionAlert[]; stats: typeof PLATFORM_STATS }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🛡️ AI Anti-Corruption Engine</h1>
      <p className="text-[#8B949E] mb-8">Real-time detection of fraud, bid rigging, and corruption patterns</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <span className="text-2xl">🚨</span>
          <div className="text-2xl font-bold mt-2 text-[#F85149]">{stats.corruptionAlerts}</div>
          <div className="text-sm text-[#8B949E]">Total Alerts</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <span className="text-2xl">✓</span>
          <div className="text-2xl font-bold mt-2 text-[#3CCB7F]">{stats.alertsResolved}</div>
          <div className="text-sm text-[#8B949E]">Resolved</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <span className="text-2xl">💰</span>
          <div className="text-2xl font-bold mt-2 text-[#FFD500]">${(stats.savedFromCorruption / 1000000).toFixed(0)}M</div>
          <div className="text-sm text-[#8B949E]">Funds Protected</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
          <span className="text-2xl">🤖</span>
          <div className="text-2xl font-bold mt-2">24/7</div>
          <div className="text-sm text-[#8B949E]">AI Monitoring</div>
        </div>
      </div>

      {/* Detection Types */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">🔍 What We Detect</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: '💰', type: 'Price Anomalies', desc: 'Bids above market rate' },
            { icon: '🔗', type: 'Conflict of Interest', desc: 'Hidden ownership links' },
            { icon: '🤝', type: 'Bid Rigging', desc: 'Coordinated bidding patterns' },
            { icon: '🏢', type: 'Shell Companies', desc: 'Fake or front companies' },
            { icon: '💸', type: 'Kickback Patterns', desc: 'Suspicious fund flows' },
            { icon: '📄', type: 'Document Fraud', desc: 'Falsified documentation' },
            { icon: '⏰', type: 'Timeline Manipulation', desc: 'Artificial delays' },
            { icon: '🔄', type: 'Double Billing', desc: 'Duplicate payments' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] rounded-lg p-4">
              <span className="text-2xl">{item.icon}</span>
              <div className="font-medium mt-2">{item.type}</div>
              <div className="text-xs text-[#8B949E]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C] bg-[#F85149]/10">
          <h3 className="font-semibold text-[#F85149]">🚨 Active Alerts</h3>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {alerts.map((alert) => {
            const risk = RISK_LEVEL_CONFIG[alert.severity];
            return (
              <div key={alert.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: `${risk.color}20`, color: risk.color }}
                    >
                      {risk.icon} {risk.label}
                    </span>
                    <span className="font-medium capitalize">{alert.type.replace(/_/g, ' ')}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.status === 'confirmed' ? 'bg-[#F85149]/20 text-[#F85149]' :
                    alert.status === 'investigating' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                    'bg-[#8B949E]/20 text-[#8B949E]'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm text-[#8B949E] mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-[#6E7681]">
                    {alert.projectName && <span>Project: {alert.projectName}</span>}
                    {alert.contractorName && <span> • Contractor: {alert.contractorName}</span>}
                  </div>
                  <div className="text-[#A371F7]">AI Confidence: {alert.aiConfidence}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE (Government/Admin)
// ============================================
function DashboardPage({ 
  stats, 
  projects, 
  alerts 
}: { 
  stats: typeof PLATFORM_STATS;
  projects: Project[];
  alerts: CorruptionAlert[];
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">📊 Reconstruction Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: stats.totalProjects.toLocaleString(), icon: '📋', color: '#00A3FF' },
          { label: 'Active', value: stats.activeProjects.toLocaleString(), icon: '🔨', color: '#F59E0B' },
          { label: 'Completed', value: stats.completedProjects.toLocaleString(), icon: '✓', color: '#3CCB7F' },
          { label: 'Contractors', value: stats.verifiedContractors.toLocaleString(), icon: '🏢', color: '#A371F7' },
          { label: 'Beneficiaries', value: `${(stats.beneficiaries / 1000000).toFixed(1)}M`, icon: '👥', color: '#FFD500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold">Recent Projects</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {projects.slice(0, 4).map((project) => {
              const status = PROJECT_STATUS_CONFIG[project.status];
              return (
                <div key={project.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>{PROJECT_CATEGORIES[project.category].icon}</span>
                    <div>
                      <div className="font-medium text-sm">{project.name}</div>
                      <div className="text-xs text-[#6E7681]">{project.location.city}</div>
                    </div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] bg-[#F85149]/10">
            <h3 className="font-semibold text-[#F85149]">Active Alerts ({alerts.filter(a => a.status !== 'cleared').length})</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {alerts.slice(0, 4).map((alert) => {
              const risk = RISK_LEVEL_CONFIG[alert.severity];
              return (
                <div key={alert.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ color: risk.color }}>{risk.icon}</span>
                      <span className="text-sm capitalize">{alert.type.replace(/_/g, ' ')}</span>
                    </div>
                    <span className="text-xs text-[#8B949E]">{alert.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
