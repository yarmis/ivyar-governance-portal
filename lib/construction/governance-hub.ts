/**
 * Construction Governance Hub - Core Engine
 * National Digital Module for Transparent, Safe, and Accountable Construction Governance
 * 
 * @module ConstructionGovernanceHub
 * @version 2.0.0
 * @author IVYAR/HBS Architecture Team
 * 
 * Features:
 * - Project Registry with lifecycle tracking
 * - Digital Permits (Draft → Submission → Review → Approval)
 * - Inspections Management with mobile support
 * - Contractor Registry with trust scoring
 * - Materials Certification tracking
 * - Financial Transparency with AI anomaly detection
 * - Governance Engine with immutable audit logs
 * - AI-powered risk scoring and compliance checking
 */

// ============================================================================
// TYPES & ENUMS
// ============================================================================

export enum ProjectStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  UNDER_CONSTRUCTION = 'under_construction',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  OPERATIONAL = 'operational'
}

export enum ProjectType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  INFRASTRUCTURE = 'infrastructure',
  MIXED_USE = 'mixed_use',
  PUBLIC_FACILITY = 'public_facility'
}

export enum FundingSource {
  PRIVATE = 'private',
  GOVERNMENT = 'government',
  DONOR = 'donor',
  MIXED = 'mixed',
  IFI = 'ifi' // International Financial Institution
}

export enum PermitType {
  CONSTRUCTION = 'construction',
  DEMOLITION = 'demolition',
  RENOVATION = 'renovation',
  OCCUPANCY = 'occupancy',
  ENVIRONMENTAL = 'environmental',
  UTILITY_CONNECTION = 'utility_connection'
}

export enum PermitStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVOKED = 'revoked',
  EXPIRED = 'expired'
}

export enum InspectionType {
  FOUNDATION = 'foundation',
  STRUCTURAL = 'structural',
  SAFETY = 'safety',
  FIRE = 'fire',
  ENVIRONMENTAL = 'environmental',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  FINAL = 'final'
}

export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  PASSED = 'passed',
  FAILED = 'failed',
  REQUIRES_REINSPECTION = 'requires_reinspection'
}

export enum ContractorLicenseStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  PENDING_RENEWAL = 'pending_renewal'
}

export enum ZoningType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  MIXED = 'mixed',
  INDUSTRIAL = 'industrial',
  AGRICULTURAL = 'agricultural',
  PROTECTED = 'protected'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum GovernanceAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  RETURN_FOR_REVISION = 'return_for_revision',
  ESCALATE = 'escalate',
  SUSPEND = 'suspend',
  REVOKE = 'revoke'
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  region?: string;
  municipality?: string;
}

export interface Parcel {
  id: string;
  cadastralNumber: string;
  location: GeoLocation;
  zoningType: ZoningType;
  areaM2: number;
  ownershipType: 'private' | 'state' | 'municipal';
  ownerId: string;
  restrictions: string[];
  registryLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  parcelId: string;
  developerId: string;
  projectName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  estimatedCost: number;
  currency: string;
  fundingSource: FundingSource;
  donorId?: string;
  riskScore: number;
  riskFactors: RiskFactor[];
  description: string;
  expectedStartDate?: Date;
  expectedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  permits: string[]; // Permit IDs
  inspections: string[]; // Inspection IDs
  contractors: string[]; // Contractor IDs
  documents: ProjectDocument[];
  financialSummary: FinancialSummary;
  commissioningStatus?: CommissioningStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permit {
  id: string;
  projectId: string;
  permitType: PermitType;
  status: PermitStatus;
  submittedBy: string;
  reviewedBy?: string;
  issueDate?: Date;
  expiryDate?: Date;
  documents: PermitDocument[];
  aiComplianceScore: number;
  aiComplianceIssues: ComplianceIssue[];
  conditions: string[];
  qrCode?: string;
  digitalSignature?: string;
  auditLog: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Contractor {
  id: string;
  companyName: string;
  registrationNumber: string;
  licenseNumber: string;
  licenseStatus: ContractorLicenseStatus;
  licenseExpiryDate: Date;
  categories: string[]; // Construction categories licensed for
  trustScore: number;
  violationsCount: number;
  violations: Violation[];
  insurancePolicyId?: string;
  insuranceStatus: 'active' | 'expired' | 'pending';
  insuranceCoverage: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  projectHistory: ProjectHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Inspection {
  id: string;
  projectId: string;
  inspectorId: string;
  inspectionType: InspectionType;
  status: InspectionStatus;
  scheduledDate: Date;
  completedDate?: Date;
  location: GeoLocation;
  checklist: ChecklistItem[];
  findings: string;
  photos: InspectionPhoto[];
  videos?: string[];
  aiAnomalyScore: number;
  aiAnomalies: AIAnomaly[];
  recommendations: string[];
  nextInspectionDate?: Date;
  signature?: DigitalSignature;
  auditLog: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  projectId: string;
  supplierId: string;
  materialName: string;
  materialType: string;
  certification: MaterialCertification;
  batchNumber: string;
  quantity: number;
  unit: string;
  deliveryDate: Date;
  qualityScore: number;
  testResults?: TestResult[];
  documents: MaterialDocument[];
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

export interface FinancialTransaction {
  id: string;
  projectId: string;
  amount: number;
  currency: string;
  category: 'materials' | 'labor' | 'equipment' | 'overhead' | 'permits' | 'other';
  source: FundingSource;
  donorId?: string;
  description: string;
  date: Date;
  documentReference?: string;
  anomalyScore: number;
  anomalyFlags: string[];
  verified: boolean;
  createdAt: Date;
}

export interface Insurance {
  id: string;
  projectId?: string;
  contractorId?: string;
  insurerId: string;
  policyNumber: string;
  coverageType: 'liability' | 'structural' | 'workers_safety' | 'comprehensive';
  coverageAmount: number;
  currency: string;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  startDate: Date;
  endDate: Date;
  premiumPaid: boolean;
  documents: InsuranceDocument[];
  createdAt: Date;
}

// Supporting Interfaces

export interface RiskFactor {
  category: string;
  description: string;
  score: number;
  source: 'ai' | 'manual' | 'system';
  detectedAt: Date;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface PermitDocument {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'missing' | 'rejected' | 'verified';
  required: boolean;
  url?: string;
  rejectionReason?: string;
  uploadedAt?: Date;
}

export interface ComplianceIssue {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  regulation: string;
  recommendation: string;
}

export interface Violation {
  id: string;
  date: Date;
  type: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  projectId?: string;
  fineAmount?: number;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface ProjectHistoryEntry {
  projectId: string;
  projectName: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  performanceScore: number;
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'passed' | 'failed' | 'na' | 'pending';
  notes?: string;
  required: boolean;
}

export interface InspectionPhoto {
  id: string;
  url: string;
  caption?: string;
  timestamp: Date;
  location?: GeoLocation;
  aiAnalysis?: AIPhotoAnalysis;
}

export interface AIPhotoAnalysis {
  anomaliesDetected: boolean;
  issues: string[];
  confidence: number;
}

export interface AIAnomaly {
  type: string;
  description: string;
  severity: RiskLevel;
  confidence: number;
  suggestedAction: string;
}

export interface DigitalSignature {
  signerId: string;
  signerName: string;
  timestamp: Date;
  certificate: string;
  valid: boolean;
}

export interface MaterialCertification {
  standard: 'CE' | 'ISO' | 'ASTM' | 'LOCAL' | 'NONE';
  certificateNumber?: string;
  issuedBy?: string;
  issuedDate?: Date;
  expiryDate?: Date;
  verified: boolean;
}

export interface TestResult {
  testType: string;
  result: string;
  passed: boolean;
  testedBy: string;
  testedAt: Date;
  documentUrl?: string;
}

export interface MaterialDocument {
  type: 'certificate' | 'test_report' | 'delivery_note' | 'invoice';
  url: string;
  uploadedAt: Date;
}

export interface InsuranceDocument {
  type: 'policy' | 'certificate' | 'endorsement';
  url: string;
  uploadedAt: Date;
}

export interface FinancialSummary {
  totalBudget: number;
  totalSpent: number;
  totalCommitted: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
  anomalyCount: number;
  lastUpdated: Date;
}

export interface CommissioningStatus {
  status: 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected';
  requestedAt?: Date;
  approvedAt?: Date;
  certificateUrl?: string;
  certificateQRCode?: string;
  blockers: CommissioningBlocker[];
}

export interface CommissioningBlocker {
  type: 'permit' | 'inspection' | 'violation' | 'financial' | 'document' | 'material';
  description: string;
  itemId: string;
  required: boolean;
}

export interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  notes?: string;
}

// ============================================================================
// USER & ROLE TYPES
// ============================================================================

export type UserRole = 
  | 'developer'
  | 'inspector'
  | 'regulator'
  | 'municipality'
  | 'ministry'
  | 'donor'
  | 'contractor'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  region?: string;
  permissions: string[];
}

// ============================================================================
// MIDDLEWARE - AUTO-CHECKS
// ============================================================================

export interface AutoCheckResult {
  passed: boolean;
  checks: IndividualCheck[];
  overallScore: number;
  blockers: string[];
  warnings: string[];
}

export interface IndividualCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'blocker';
  code: string;
}

export class MiddlewareEngine {
  /**
   * Run all auto-checks for permit submission
   */
  static async runPermitChecks(
    permit: Permit,
    project: Project,
    contractor?: Contractor
  ): Promise<AutoCheckResult> {
    const checks: IndividualCheck[] = [];
    const blockers: string[] = [];
    const warnings: string[] = [];

    // Check 1: Parcel/Zoning Validation
    const zoningCheck = await this.checkZoning(project);
    checks.push(zoningCheck);
    if (!zoningCheck.passed && zoningCheck.severity === 'blocker') {
      blockers.push(zoningCheck.message);
    }

    // Check 2: Contractor License Validity
    if (contractor) {
      const licenseCheck = await this.checkContractorLicense(contractor);
      checks.push(licenseCheck);
      if (!licenseCheck.passed) {
        if (licenseCheck.severity === 'blocker') blockers.push(licenseCheck.message);
        else warnings.push(licenseCheck.message);
      }
    }

    // Check 3: Insurance Coverage
    if (contractor) {
      const insuranceCheck = await this.checkInsurance(contractor, project);
      checks.push(insuranceCheck);
      if (!insuranceCheck.passed) {
        blockers.push(insuranceCheck.message);
      }
    }

    // Check 4: Required Documents
    const docsCheck = await this.checkRequiredDocuments(permit);
    checks.push(docsCheck);
    if (!docsCheck.passed) {
      if (docsCheck.severity === 'blocker') blockers.push(docsCheck.message);
      else warnings.push(docsCheck.message);
    }

    // Check 5: Previous Violations
    if (contractor) {
      const violationsCheck = await this.checkViolationHistory(contractor);
      checks.push(violationsCheck);
      if (!violationsCheck.passed) {
        warnings.push(violationsCheck.message);
      }
    }

    // Check 6: Financial Anomalies
    const financialCheck = await this.checkFinancialAnomalies(project);
    checks.push(financialCheck);
    if (!financialCheck.passed) {
      warnings.push(financialCheck.message);
    }

    // Check 7: Material Certifications (if applicable)
    const materialCheck = await this.checkMaterialCertifications(project);
    checks.push(materialCheck);
    if (!materialCheck.passed) {
      warnings.push(materialCheck.message);
    }

    const passedCount = checks.filter(c => c.passed).length;
    const overallScore = Math.round((passedCount / checks.length) * 100);

    return {
      passed: blockers.length === 0,
      checks,
      overallScore,
      blockers,
      warnings
    };
  }

  /**
   * Run commissioning eligibility checks
   */
  static async runCommissioningChecks(project: Project): Promise<AutoCheckResult> {
    const checks: IndividualCheck[] = [];
    const blockers: string[] = [];
    const warnings: string[] = [];

    // Check 1: All permits approved
    const permitsCheck: IndividualCheck = {
      name: 'Permits Approved',
      passed: true, // Mock - would check actual permits
      message: 'All required permits are approved',
      severity: 'info',
      code: 'COMM_PERMITS'
    };
    checks.push(permitsCheck);

    // Check 2: No active violations
    const violationsCheck: IndividualCheck = {
      name: 'No Active Violations',
      passed: true, // Mock
      message: 'No unresolved violations found',
      severity: 'info',
      code: 'COMM_VIOLATIONS'
    };
    checks.push(violationsCheck);

    // Check 3: All inspections passed
    const inspectionsCheck: IndividualCheck = {
      name: 'Inspections Passed',
      passed: true, // Mock
      message: 'All required inspections have passed',
      severity: 'info',
      code: 'COMM_INSPECTIONS'
    };
    checks.push(inspectionsCheck);

    // Check 4: Materials certified
    const materialsCheck: IndividualCheck = {
      name: 'Materials Certified',
      passed: true, // Mock
      message: 'All materials have valid certifications',
      severity: 'info',
      code: 'COMM_MATERIALS'
    };
    checks.push(materialsCheck);

    // Check 5: Financial anomalies closed
    const financialCheck: IndividualCheck = {
      name: 'Financial Anomalies Resolved',
      passed: project.financialSummary.anomalyCount === 0,
      message: project.financialSummary.anomalyCount === 0 
        ? 'No financial anomalies detected'
        : `${project.financialSummary.anomalyCount} financial anomalies require resolution`,
      severity: project.financialSummary.anomalyCount === 0 ? 'info' : 'blocker',
      code: 'COMM_FINANCIAL'
    };
    checks.push(financialCheck);
    if (!financialCheck.passed) blockers.push(financialCheck.message);

    // Check 6: Final inspection completed
    const finalInspectionCheck: IndividualCheck = {
      name: 'Final Inspection Completed',
      passed: true, // Mock
      message: 'Final inspection has been completed and passed',
      severity: 'info',
      code: 'COMM_FINAL_INSPECTION'
    };
    checks.push(finalInspectionCheck);

    // Check 7: As-built documents uploaded
    const asBuiltCheck: IndividualCheck = {
      name: 'As-Built Documents',
      passed: true, // Mock
      message: 'As-built drawings have been uploaded',
      severity: 'info',
      code: 'COMM_AS_BUILT'
    };
    checks.push(asBuiltCheck);

    const passedCount = checks.filter(c => c.passed).length;
    const overallScore = Math.round((passedCount / checks.length) * 100);

    return {
      passed: blockers.length === 0,
      checks,
      overallScore,
      blockers,
      warnings
    };
  }

  // Individual check implementations
  private static async checkZoning(project: Project): Promise<IndividualCheck> {
    // Mock implementation - would check against cadastral registry
    return {
      name: 'Zoning Compliance',
      passed: true,
      message: 'Project type matches parcel zoning requirements',
      severity: 'info',
      code: 'MW_ZONING'
    };
  }

  private static async checkContractorLicense(contractor: Contractor): Promise<IndividualCheck> {
    const isValid = contractor.licenseStatus === ContractorLicenseStatus.ACTIVE;
    const isExpiring = contractor.licenseExpiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    return {
      name: 'Contractor License',
      passed: isValid,
      message: isValid 
        ? (isExpiring ? 'License valid but expiring within 30 days' : 'Contractor license is valid and active')
        : 'Contractor license is not active',
      severity: isValid ? (isExpiring ? 'warning' : 'info') : 'blocker',
      code: 'MW_LICENSE'
    };
  }

  private static async checkInsurance(contractor: Contractor, project: Project): Promise<IndividualCheck> {
    const hasActiveInsurance = contractor.insuranceStatus === 'active';
    const coverageAdequate = contractor.insuranceCoverage >= project.estimatedCost * 0.1;

    return {
      name: 'Insurance Coverage',
      passed: hasActiveInsurance && coverageAdequate,
      message: hasActiveInsurance && coverageAdequate
        ? 'Insurance is active with adequate coverage'
        : hasActiveInsurance
          ? 'Insurance coverage may be insufficient for project value'
          : 'No active insurance policy found',
      severity: hasActiveInsurance && coverageAdequate ? 'info' : 'blocker',
      code: 'MW_INSURANCE'
    };
  }

  private static async checkRequiredDocuments(permit: Permit): Promise<IndividualCheck> {
    const requiredDocs = permit.documents.filter(d => d.required);
    const uploadedRequired = requiredDocs.filter(d => d.status === 'uploaded' || d.status === 'verified');
    const allUploaded = uploadedRequired.length === requiredDocs.length;

    return {
      name: 'Required Documents',
      passed: allUploaded,
      message: allUploaded
        ? `All ${requiredDocs.length} required documents uploaded`
        : `${uploadedRequired.length}/${requiredDocs.length} required documents uploaded`,
      severity: allUploaded ? 'info' : 'blocker',
      code: 'MW_DOCUMENTS'
    };
  }

  private static async checkViolationHistory(contractor: Contractor): Promise<IndividualCheck> {
    const recentViolations = contractor.violations.filter(
      v => v.date > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) && !v.resolved
    );

    return {
      name: 'Violation History',
      passed: recentViolations.length === 0,
      message: recentViolations.length === 0
        ? 'No unresolved violations in the past year'
        : `${recentViolations.length} unresolved violation(s) in the past year`,
      severity: recentViolations.length === 0 ? 'info' : 'warning',
      code: 'MW_VIOLATIONS'
    };
  }

  private static async checkFinancialAnomalies(project: Project): Promise<IndividualCheck> {
    const hasAnomalies = project.financialSummary.anomalyCount > 0;

    return {
      name: 'Financial Anomalies',
      passed: !hasAnomalies,
      message: hasAnomalies
        ? `${project.financialSummary.anomalyCount} financial anomaly(ies) detected`
        : 'No financial anomalies detected',
      severity: hasAnomalies ? 'warning' : 'info',
      code: 'MW_FINANCIAL'
    };
  }

  private static async checkMaterialCertifications(project: Project): Promise<IndividualCheck> {
    // Mock implementation
    return {
      name: 'Material Certifications',
      passed: true,
      message: 'All registered materials have valid certifications',
      severity: 'info',
      code: 'MW_MATERIALS'
    };
  }
}

// ============================================================================
// AI ENGINE - RISK SCORING & ANOMALY DETECTION
// ============================================================================

export interface AIRiskAssessment {
  overallScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  recommendations: string[];
  confidence: number;
}

export interface AIComplianceResult {
  score: number;
  issues: ComplianceIssue[];
  recommendations: string[];
  regulationsChecked: string[];
}

export interface AIAnomalyResult {
  anomaliesFound: boolean;
  anomalies: AIAnomaly[];
  confidence: number;
}

export class AIEngine {
  /**
   * Calculate comprehensive risk score for a project
   */
  static async calculateProjectRisk(
    project: Project,
    contractors: Contractor[],
    inspections: Inspection[],
    transactions: FinancialTransaction[]
  ): Promise<AIRiskAssessment> {
    const factors: RiskFactor[] = [];
    let totalScore = 0;
    let factorCount = 0;

    // Factor 1: Project Type Risk (0-25)
    const projectTypeRisk = this.assessProjectTypeRisk(project.projectType);
    factors.push({
      category: 'Project Type',
      description: `${project.projectType} projects have ${projectTypeRisk > 15 ? 'elevated' : 'standard'} risk profile`,
      score: projectTypeRisk,
      source: 'ai',
      detectedAt: new Date()
    });
    totalScore += projectTypeRisk;
    factorCount++;

    // Factor 2: Contractor Trust (0-25)
    const contractorRisk = this.assessContractorRisk(contractors);
    factors.push({
      category: 'Contractor Trust',
      description: `Average contractor trust score: ${contractorRisk.avgTrust.toFixed(1)}`,
      score: contractorRisk.risk,
      source: 'ai',
      detectedAt: new Date()
    });
    totalScore += contractorRisk.risk;
    factorCount++;

    // Factor 3: Financial Anomalies (0-25)
    const financialRisk = this.assessFinancialRisk(project, transactions);
    factors.push({
      category: 'Financial Transparency',
      description: financialRisk.description,
      score: financialRisk.risk,
      source: 'ai',
      detectedAt: new Date()
    });
    totalScore += financialRisk.risk;
    factorCount++;

    // Factor 4: Inspection History (0-25)
    const inspectionRisk = this.assessInspectionRisk(inspections);
    factors.push({
      category: 'Inspection History',
      description: inspectionRisk.description,
      score: inspectionRisk.risk,
      source: 'ai',
      detectedAt: new Date()
    });
    totalScore += inspectionRisk.risk;
    factorCount++;

    // Factor 5: Schedule Risk (0-15)
    const scheduleRisk = this.assessScheduleRisk(project);
    factors.push({
      category: 'Schedule',
      description: scheduleRisk.description,
      score: scheduleRisk.risk,
      source: 'ai',
      detectedAt: new Date()
    });
    totalScore += scheduleRisk.risk;
    factorCount++;

    // Factor 6: Budget Risk (0-15)
    const budgetRisk = this.assessBudgetRisk(project);
    factors.push({
      category: 'Budget',
      description: budgetRisk.description,
      score: budgetRisk.risk,
      source: 'ai',
      detectedAt: new Date()
    });
    totalScore += budgetRisk.risk;
    factorCount++;

    // Normalize to 0-100 scale
    const normalizedScore = Math.min(100, Math.round(totalScore));
    const riskLevel = this.scoreToRiskLevel(normalizedScore);

    const recommendations = this.generateRiskRecommendations(factors, riskLevel);

    return {
      overallScore: normalizedScore,
      riskLevel,
      factors,
      recommendations,
      confidence: 0.85 // Base confidence level
    };
  }

  /**
   * AI Compliance Check for permits
   */
  static async checkCompliance(permit: Permit, project: Project): Promise<AIComplianceResult> {
    const issues: ComplianceIssue[] = [];
    const regulations: string[] = [];
    let score = 100;

    // Check building codes
    regulations.push('National Building Code 2024');
    // Mock: Would check actual regulations

    // Check environmental requirements
    regulations.push('Environmental Protection Act');
    if (project.projectType === ProjectType.INDUSTRIAL) {
      // Higher scrutiny for industrial
      regulations.push('Industrial Emissions Standards');
    }

    // Check fire safety
    regulations.push('Fire Safety Regulations');

    // Check accessibility
    regulations.push('Accessibility Standards');

    // Generate mock issues based on document completeness
    const missingDocs = permit.documents.filter(d => d.status === 'missing');
    if (missingDocs.length > 0) {
      issues.push({
        code: 'DOC_MISSING',
        description: `${missingDocs.length} required document(s) are missing`,
        severity: 'high',
        regulation: 'Document Requirements',
        recommendation: 'Upload all required documents before submission'
      });
      score -= 15 * missingDocs.length;
    }

    const recommendations = issues.map(i => i.recommendation);

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      regulationsChecked: regulations
    };
  }

  /**
   * Detect financial anomalies using AI
   */
  static async detectFinancialAnomalies(
    transactions: FinancialTransaction[]
  ): Promise<AIAnomalyResult> {
    const anomalies: AIAnomaly[] = [];

    // Check for unusual patterns
    const amounts = transactions.map(t => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length || 0;
    const stdDev = Math.sqrt(
      amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / amounts.length || 0
    );

    // Flag transactions significantly above average
    transactions.forEach(t => {
      if (t.amount > avgAmount + 2 * stdDev) {
        anomalies.push({
          type: 'unusual_amount',
          description: `Transaction amount ${t.amount} significantly exceeds average`,
          severity: RiskLevel.MEDIUM,
          confidence: 0.75,
          suggestedAction: 'Review transaction documentation and verify legitimacy'
        });
      }
    });

    // Check for rapid succession transactions
    const sortedTx = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
    for (let i = 1; i < sortedTx.length; i++) {
      const timeDiff = sortedTx[i].date.getTime() - sortedTx[i - 1].date.getTime();
      if (timeDiff < 3600000 && sortedTx[i].amount > avgAmount) { // Within 1 hour
        anomalies.push({
          type: 'rapid_transactions',
          description: 'Multiple significant transactions within short timeframe',
          severity: RiskLevel.LOW,
          confidence: 0.6,
          suggestedAction: 'Verify if transactions are related to same procurement'
        });
      }
    }

    return {
      anomaliesFound: anomalies.length > 0,
      anomalies,
      confidence: 0.82
    };
  }

  /**
   * Analyze inspection photos for anomalies
   */
  static async analyzeInspectionPhotos(photos: InspectionPhoto[]): Promise<AIAnomalyResult> {
    // Mock AI photo analysis
    const anomalies: AIAnomaly[] = [];

    // In production, this would use computer vision
    // For now, return mock results based on photo count
    if (photos.length < 5) {
      anomalies.push({
        type: 'insufficient_documentation',
        description: 'Fewer photos than recommended for comprehensive inspection',
        severity: RiskLevel.LOW,
        confidence: 0.9,
        suggestedAction: 'Consider taking additional photos of key structural elements'
      });
    }

    return {
      anomaliesFound: anomalies.length > 0,
      anomalies,
      confidence: 0.78
    };
  }

  // Helper methods
  private static assessProjectTypeRisk(type: ProjectType): number {
    const riskMap: Record<ProjectType, number> = {
      [ProjectType.RESIDENTIAL]: 10,
      [ProjectType.COMMERCIAL]: 15,
      [ProjectType.MIXED_USE]: 18,
      [ProjectType.INDUSTRIAL]: 22,
      [ProjectType.INFRASTRUCTURE]: 20,
      [ProjectType.PUBLIC_FACILITY]: 12
    };
    return riskMap[type] || 15;
  }

  private static assessContractorRisk(contractors: Contractor[]): { risk: number; avgTrust: number } {
    if (contractors.length === 0) return { risk: 20, avgTrust: 0 };
    
    const avgTrust = contractors.reduce((sum, c) => sum + c.trustScore, 0) / contractors.length;
    const risk = Math.max(0, 25 - avgTrust / 4);
    return { risk, avgTrust };
  }

  private static assessFinancialRisk(
    project: Project,
    transactions: FinancialTransaction[]
  ): { risk: number; description: string } {
    const anomalyCount = transactions.filter(t => t.anomalyScore > 50).length;
    const spentRatio = project.financialSummary.totalSpent / project.financialSummary.totalBudget;

    if (anomalyCount > 3) {
      return { risk: 25, description: `${anomalyCount} transactions flagged for review` };
    }
    if (spentRatio > 1.1) {
      return { risk: 20, description: 'Budget overrun detected' };
    }
    if (spentRatio > 0.9 && project.status === ProjectStatus.UNDER_CONSTRUCTION) {
      return { risk: 15, description: 'Approaching budget limit' };
    }
    return { risk: 5, description: 'Financial metrics within normal range' };
  }

  private static assessInspectionRisk(inspections: Inspection[]): { risk: number; description: string } {
    const failed = inspections.filter(i => i.status === InspectionStatus.FAILED).length;
    const total = inspections.length;
    
    if (total === 0) return { risk: 15, description: 'No inspections recorded yet' };
    
    const failRate = failed / total;
    if (failRate > 0.3) {
      return { risk: 25, description: `High inspection failure rate: ${Math.round(failRate * 100)}%` };
    }
    if (failRate > 0.1) {
      return { risk: 15, description: `Some inspections failed: ${failed}/${total}` };
    }
    return { risk: 5, description: `Good inspection record: ${total - failed}/${total} passed` };
  }

  private static assessScheduleRisk(project: Project): { risk: number; description: string } {
    if (!project.expectedEndDate) {
      return { risk: 10, description: 'No target completion date set' };
    }
    
    const now = new Date();
    const daysRemaining = Math.ceil(
      (project.expectedEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining < 0) {
      return { risk: 15, description: `Project is ${Math.abs(daysRemaining)} days overdue` };
    }
    if (daysRemaining < 30) {
      return { risk: 10, description: `Less than 30 days to target completion` };
    }
    return { risk: 2, description: 'On schedule' };
  }

  private static assessBudgetRisk(project: Project): { risk: number; description: string } {
    const utilization = project.financialSummary.totalSpent / project.financialSummary.totalBudget;
    
    if (utilization > 1) {
      return { risk: 15, description: `Budget exceeded by ${Math.round((utilization - 1) * 100)}%` };
    }
    if (utilization > 0.9) {
      return { risk: 10, description: 'Approaching budget limit' };
    }
    return { risk: 2, description: 'Within budget' };
  }

  private static scoreToRiskLevel(score: number): RiskLevel {
    if (score >= 75) return RiskLevel.CRITICAL;
    if (score >= 50) return RiskLevel.HIGH;
    if (score >= 25) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private static generateRiskRecommendations(factors: RiskFactor[], level: RiskLevel): string[] {
    const recommendations: string[] = [];

    factors
      .filter(f => f.score > 15)
      .forEach(f => {
        switch (f.category) {
          case 'Contractor Trust':
            recommendations.push('Consider additional oversight for contractors with low trust scores');
            break;
          case 'Financial Transparency':
            recommendations.push('Review flagged transactions and verify documentation');
            break;
          case 'Inspection History':
            recommendations.push('Schedule follow-up inspections for failed items');
            break;
          case 'Schedule':
            recommendations.push('Review project timeline and identify acceleration opportunities');
            break;
          case 'Budget':
            recommendations.push('Conduct budget review and identify cost optimization options');
            break;
        }
      });

    if (level === RiskLevel.CRITICAL) {
      recommendations.unshift('URGENT: Project requires immediate executive review');
    } else if (level === RiskLevel.HIGH) {
      recommendations.unshift('Schedule risk mitigation meeting with stakeholders');
    }

    return recommendations;
  }
}

// ============================================================================
// GOVERNANCE ENGINE
// ============================================================================

export interface GovernanceDecision {
  action: GovernanceAction;
  decidedBy: string;
  decidedAt: Date;
  reason: string;
  conditions?: string[];
  auditId: string;
}

export interface EscalationRequest {
  itemType: 'project' | 'permit' | 'inspection' | 'contractor';
  itemId: string;
  reason: string;
  escalatedBy: string;
  escalatedTo: string;
  priority: 'normal' | 'high' | 'urgent';
}

export class GovernanceEngine {
  private static auditLog: AuditEntry[] = [];

  /**
   * Approve a project submission
   */
  static async approveProject(
    project: Project,
    decidedBy: User,
    conditions?: string[]
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'PROJECT_APPROVED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: project.status },
      newValue: { status: ProjectStatus.APPROVED },
      notes: conditions?.join('; ')
    });

    return {
      action: GovernanceAction.APPROVE,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason: 'Project meets all requirements',
      conditions,
      auditId
    };
  }

  /**
   * Reject a project submission
   */
  static async rejectProject(
    project: Project,
    decidedBy: User,
    reason: string
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'PROJECT_REJECTED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: project.status },
      newValue: { status: ProjectStatus.DRAFT },
      notes: reason
    });

    return {
      action: GovernanceAction.REJECT,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason,
      auditId
    };
  }

  /**
   * Approve a permit
   */
  static async approvePermit(
    permit: Permit,
    decidedBy: User,
    expiryDays: number = 365,
    conditions?: string[]
  ): Promise<GovernanceDecision> {
    const issueDate = new Date();
    const expiryDate = new Date(issueDate.getTime() + expiryDays * 24 * 60 * 60 * 1000);

    const auditId = this.createAuditEntry({
      action: 'PERMIT_APPROVED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: permit.status },
      newValue: { 
        status: PermitStatus.APPROVED,
        issueDate,
        expiryDate
      },
      notes: conditions?.join('; ')
    });

    return {
      action: GovernanceAction.APPROVE,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason: 'Permit approved after compliance verification',
      conditions,
      auditId
    };
  }

  /**
   * Reject a permit
   */
  static async rejectPermit(
    permit: Permit,
    decidedBy: User,
    reason: string
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'PERMIT_REJECTED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: permit.status },
      newValue: { status: PermitStatus.REJECTED },
      notes: reason
    });

    return {
      action: GovernanceAction.REJECT,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason,
      auditId
    };
  }

  /**
   * Revoke a permit
   */
  static async revokePermit(
    permit: Permit,
    decidedBy: User,
    reason: string
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'PERMIT_REVOKED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: permit.status },
      newValue: { status: PermitStatus.REVOKED },
      notes: reason
    });

    return {
      action: GovernanceAction.REVOKE,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason,
      auditId
    };
  }

  /**
   * Approve inspection results
   */
  static async approveInspection(
    inspection: Inspection,
    decidedBy: User
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'INSPECTION_APPROVED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: inspection.status },
      newValue: { status: InspectionStatus.PASSED }
    });

    return {
      action: GovernanceAction.APPROVE,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason: 'Inspection results verified and approved',
      auditId
    };
  }

  /**
   * Suspend a contractor
   */
  static async suspendContractor(
    contractor: Contractor,
    decidedBy: User,
    reason: string
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'CONTRACTOR_SUSPENDED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { licenseStatus: contractor.licenseStatus },
      newValue: { licenseStatus: ContractorLicenseStatus.SUSPENDED },
      notes: reason
    });

    return {
      action: GovernanceAction.SUSPEND,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason,
      auditId
    };
  }

  /**
   * Approve commissioning request
   */
  static async approveCommissioning(
    project: Project,
    decidedBy: User,
    conditions?: string[]
  ): Promise<GovernanceDecision> {
    const auditId = this.createAuditEntry({
      action: 'COMMISSIONING_APPROVED',
      performedBy: decidedBy.id,
      performedAt: new Date(),
      previousValue: { status: project.status },
      newValue: { 
        status: ProjectStatus.OPERATIONAL,
        commissioningApproved: true
      },
      notes: conditions?.join('; ')
    });

    return {
      action: GovernanceAction.APPROVE,
      decidedBy: decidedBy.id,
      decidedAt: new Date(),
      reason: 'Project meets all commissioning requirements',
      conditions,
      auditId
    };
  }

  /**
   * Escalate an item for higher review
   */
  static async escalate(request: EscalationRequest): Promise<string> {
    const auditId = this.createAuditEntry({
      action: `ESCALATED_${request.itemType.toUpperCase()}`,
      performedBy: request.escalatedBy,
      performedAt: new Date(),
      notes: `Escalated to ${request.escalatedTo}: ${request.reason}`
    });

    return auditId;
  }

  /**
   * Flag a high-risk case
   */
  static async flagRiskCase(
    itemType: string,
    itemId: string,
    riskLevel: RiskLevel,
    flaggedBy: User,
    reason: string
  ): Promise<string> {
    const auditId = this.createAuditEntry({
      action: 'RISK_FLAGGED',
      performedBy: flaggedBy.id,
      performedAt: new Date(),
      newValue: { itemType, itemId, riskLevel },
      notes: reason
    });

    return auditId;
  }

  /**
   * Get audit trail for an item
   */
  static getAuditTrail(itemId?: string): AuditEntry[] {
    if (itemId) {
      return this.auditLog.filter(entry => 
        entry.notes?.includes(itemId) || 
        JSON.stringify(entry.previousValue).includes(itemId) ||
        JSON.stringify(entry.newValue).includes(itemId)
      );
    }
    return [...this.auditLog];
  }

  private static createAuditEntry(entry: Omit<AuditEntry, 'id'>): string {
    const id = `AUDIT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.auditLog.push({ id, ...entry });
    return id;
  }
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================

export interface DashboardMetrics {
  totalActiveProjects: number;
  highRiskProjects: number;
  pendingPermits: number;
  failedInspectionsLast30Days: number;
  approvedPermitsLast30Days: number;
  activeContractors: number;
  suspendedContractors: number;
  totalFinancialVolume: number;
  financialAnomaliesCount: number;
  averageRiskScore: number;
}

export interface RegionalHeatmapData {
  region: string;
  riskScore: number;
  projectCount: number;
  issueCount: number;
}

export interface PermitPipelineData {
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
}

export class DashboardService {
  /**
   * Get main dashboard metrics
   */
  static async getMetrics(regionFilter?: string): Promise<DashboardMetrics> {
    // Mock data - would query database in production
    return {
      totalActiveProjects: 1247,
      highRiskProjects: 89,
      pendingPermits: 342,
      failedInspectionsLast30Days: 23,
      approvedPermitsLast30Days: 156,
      activeContractors: 892,
      suspendedContractors: 47,
      totalFinancialVolume: 2850000000,
      financialAnomaliesCount: 12,
      averageRiskScore: 34
    };
  }

  /**
   * Get regional risk heatmap data
   */
  static async getRegionalHeatmap(): Promise<RegionalHeatmapData[]> {
    // Mock data
    return [
      { region: 'Kyiv', riskScore: 42, projectCount: 245, issueCount: 18 },
      { region: 'Lviv', riskScore: 28, projectCount: 123, issueCount: 7 },
      { region: 'Odesa', riskScore: 51, projectCount: 156, issueCount: 24 },
      { region: 'Kharkiv', riskScore: 38, projectCount: 98, issueCount: 11 },
      { region: 'Dnipro', riskScore: 45, projectCount: 187, issueCount: 19 }
    ];
  }

  /**
   * Get permit pipeline counts
   */
  static async getPermitPipeline(): Promise<PermitPipelineData> {
    return {
      draft: 89,
      submitted: 156,
      underReview: 97,
      approved: 234,
      rejected: 23
    };
  }

  /**
   * Get top high-risk projects
   */
  static async getTopRiskProjects(limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    riskScore: number;
    riskLevel: RiskLevel;
    mainRiskFactor: string;
  }>> {
    // Mock data
    return [
      { id: 'PRJ001', name: 'Metro Station Expansion', riskScore: 78, riskLevel: RiskLevel.CRITICAL, mainRiskFactor: 'Budget overrun' },
      { id: 'PRJ002', name: 'Industrial Complex B7', riskScore: 71, riskLevel: RiskLevel.HIGH, mainRiskFactor: 'Contractor violations' },
      { id: 'PRJ003', name: 'Residential Tower Sunrise', riskScore: 65, riskLevel: RiskLevel.HIGH, mainRiskFactor: 'Inspection failures' }
    ];
  }

  /**
   * Get contractor trust index
   */
  static async getContractorTrustIndex(): Promise<Array<{
    id: string;
    name: string;
    trustScore: number;
    projectsCount: number;
    violationsCount: number;
  }>> {
    return [
      { id: 'CON001', name: 'BuildTech Solutions', trustScore: 92, projectsCount: 45, violationsCount: 0 },
      { id: 'CON002', name: 'Urban Constructors LLC', trustScore: 78, projectsCount: 32, violationsCount: 2 },
      { id: 'CON003', name: 'Mega Build Corp', trustScore: 65, projectsCount: 28, violationsCount: 5 }
    ];
  }

  /**
   * Get financial anomalies list
   */
  static async getFinancialAnomalies(limit: number = 10): Promise<Array<{
    projectId: string;
    projectName: string;
    amount: number;
    anomalyScore: number;
    type: string;
    flaggedAt: Date;
  }>> {
    return [
      { projectId: 'PRJ002', projectName: 'Industrial Complex B7', amount: 450000, anomalyScore: 87, type: 'unusual_amount', flaggedAt: new Date() },
      { projectId: 'PRJ005', projectName: 'Shopping Center West', amount: 280000, anomalyScore: 72, type: 'rapid_transactions', flaggedAt: new Date() }
    ];
  }

  /**
   * Get recent inspections
   */
  static async getRecentInspections(limit: number = 10): Promise<Array<{
    id: string;
    projectName: string;
    type: InspectionType;
    status: InspectionStatus;
    inspector: string;
    date: Date;
  }>> {
    return [
      { id: 'INS001', projectName: 'Residential Tower Sunrise', type: InspectionType.STRUCTURAL, status: InspectionStatus.PASSED, inspector: 'John Smith', date: new Date() },
      { id: 'INS002', projectName: 'Office Building Central', type: InspectionType.FIRE, status: InspectionStatus.FAILED, inspector: 'Maria Garcia', date: new Date() }
    ];
  }
}

// ============================================================================
// MODULE CONFIGURATION
// ============================================================================

export const CONSTRUCTION_MODULE_INFO = {
  id: 'construction-governance-hub',
  name: 'Construction Governance Hub',
  version: '2.0.0',
  description: 'National Digital Module for Transparent, Safe, and Accountable Construction Governance',
  features: {
    projectRegistry: true,
    digitalPermits: true,
    inspectionsManagement: true,
    contractorRegistry: true,
    materialsCertification: true,
    financialTransparency: true,
    aiRiskScoring: true,
    governanceEngine: true,
    donorDashboards: true,
    mobileInspections: true,
    commissioningWorkflow: true
  },
  endpoints: {
    projects: '/api/construction/projects',
    parcels: '/api/construction/parcels',
    permits: '/api/construction/permits',
    contractors: '/api/construction/contractors',
    inspections: '/api/construction/inspections',
    materials: '/api/construction/materials',
    finance: '/api/construction/finance',
    ai: '/api/construction/ai',
    dashboard: '/api/construction/dashboard'
  },
  roles: [
    { id: 'developer', name: 'Developer', permissions: ['submit_project', 'view_own_projects', 'upload_documents'] },
    { id: 'inspector', name: 'Inspector', permissions: ['conduct_inspections', 'view_projects', 'update_inspections'] },
    { id: 'regulator', name: 'Regulator', permissions: ['review_permits', 'approve_permits', 'reject_permits'] },
    { id: 'municipality', name: 'Municipality', permissions: ['manage_local_projects', 'review_permits', 'manage_inspections'] },
    { id: 'ministry', name: 'Ministry', permissions: ['national_overview', 'policy_management', 'system_configuration'] },
    { id: 'donor', name: 'Donor', permissions: ['view_donor_projects', 'view_financial_reports', 'view_transparency_dashboard'] },
    { id: 'contractor', name: 'Contractor', permissions: ['view_assigned_projects', 'update_progress', 'manage_materials'] },
    { id: 'admin', name: 'Administrator', permissions: ['full_access'] }
  ],
  complianceStandards: [
    'National Building Code 2024',
    'Environmental Protection Act',
    'Fire Safety Regulations',
    'Accessibility Standards',
    'Anti-Corruption Framework',
    'Donor Transparency Requirements'
  ]
};

// Export all
export {
  MiddlewareEngine,
  AIEngine,
  GovernanceEngine,
  DashboardService,
  CONSTRUCTION_MODULE_INFO
};
