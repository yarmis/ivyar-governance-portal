// data/modules.ts
import type { LucideIcon } from 'lucide-react';
import {
  Eye, Cpu, CheckCircle, ClipboardList, Shield, AlertTriangle, Lock,
  Truck, Activity, Car, Package, Globe, Medal, HeartPulse, User,
  GraduationCap, Wallet, ClipboardCheck, CreditCard, BarChart,
  LineChart, Network, Users, Database,
} from 'lucide-react';

export type ModuleStatus = 'live' | 'pilot' | 'dev';

export interface ModuleDefinition {
  id: string;
  category: string;
  title: string;
  description: string;
  status: ModuleStatus;
  icon: LucideIcon;
}

export const modules: ModuleDefinition[] = [
  // Governance & Oversight
  { id: 'transparency-hub', category: 'Governance & Oversight', title: 'Transparency Hub', description: 'Real-time visibility across ministries, donors, and national programs.', status: 'live', icon: Eye },
  { id: 'ai-administrator', category: 'Governance & Oversight', title: 'AI Administrator', description: 'Ethical, explainable, human-aligned decision support with full audit trail.', status: 'live', icon: Cpu },
  { id: 'compliance-engine', category: 'Governance & Oversight', title: 'Compliance Engine', description: 'Automated policy enforcement and regulatory alignment across workflows.', status: 'pilot', icon: CheckCircle },
  { id: 'audit-trail', category: 'Governance & Oversight', title: 'Audit Trail Engine', description: 'Immutable, end-to-end evidence of every action, decision, and change.', status: 'live', icon: ClipboardList },
  
  // Identity, Access & Security
  { id: 'identity-access', category: 'Identity, Access & Security', title: 'Identity & Access', description: 'Role-based access, credential management, cross-agency authorization.', status: 'live', icon: Shield },
  { id: 'insurance-risk', category: 'Identity, Access & Security', title: 'Insurance & Risk', description: 'Risk scoring, claims processing, and institutional resilience modeling.', status: 'live', icon: AlertTriangle },
  { id: 'payments-security', category: 'Identity, Access & Security', title: 'Payments Security Layer', description: 'Secure, accountable financial flows across ministries and donors.', status: 'live', icon: Lock },
  
  // Operations & Logistics
  { id: 'logistics-engine', category: 'Operations & Logistics', title: 'Logistics Engine', description: 'End-to-end supply chain visibility across ministries and partners.', status: 'pilot', icon: Truck },
  { id: 'emergency-services', category: 'Operations & Logistics', title: 'Emergency Services', description: 'Coordinated crisis response with real-time routing and resource allocation.', status: 'live', icon: Activity },
  { id: 'fleet-management', category: 'Operations & Logistics', title: 'Fleet Management', description: 'Vehicle tracking, dispatching, and operational readiness monitoring.', status: 'pilot', icon: Car },
  { id: 'warehousing', category: 'Operations & Logistics', title: 'Warehousing', description: 'Stock levels, distribution flows, and automated replenishment.', status: 'live', icon: Package },
  { id: 'freight-coordination', category: 'Operations & Logistics', title: 'Freight Coordination', description: 'Cross-border freight orchestration with full traceability.', status: 'live', icon: Globe },
  
  // Social & Human Services
  { id: 'veterans-services', category: 'Social & Human Services', title: 'Veterans Services', description: 'Comprehensive benefits, case management, and service coordination.', status: 'live', icon: Medal },
  { id: 'healthcare-services', category: 'Social & Human Services', title: 'Healthcare Services', description: 'Medical routing, provider coordination, and patient service management.', status: 'live', icon: HeartPulse },
  { id: 'citizen-services', category: 'Social & Human Services', title: 'Citizen Services', description: 'Unified access to government services and digital identity.', status: 'pilot', icon: User },
  { id: 'education-services', category: 'Social & Human Services', title: 'Education Services', description: 'Skills programs, certifications, and workforce development.', status: 'dev', icon: GraduationCap },
  { id: 'benefits-distribution', category: 'Social & Human Services', title: 'Benefits Distribution', description: 'Transparent, auditable benefits delivery with fraud prevention.', status: 'live', icon: Wallet },
  
  // Finance & Procurement
  { id: 'procurement-engine', category: 'Finance & Procurement', title: 'Procurement Engine', description: 'Transparent, auditable tendering with full lifecycle traceability.', status: 'live', icon: ClipboardCheck },
  { id: 'payments', category: 'Finance & Procurement', title: 'Payments', description: 'Secure, accountable financial flows across ministries and donors.', status: 'live', icon: CreditCard },
  { id: 'donor-dashboard', category: 'Finance & Procurement', title: 'Donor Dashboard', description: 'Visibility into funded programs, KPIs, and impact metrics.', status: 'live', icon: BarChart },
  { id: 'fiscal-planning', category: 'Finance & Procurement', title: 'Fiscal Planning', description: 'Scenario modeling, forecasting, and multi-year budget planning.', status: 'pilot', icon: LineChart },
  
  // Cross-Government Infrastructure
  { id: 'api-gateway', category: 'Cross-Government Infrastructure', title: 'API Gateway', description: 'Standardized inter-agency data exchange and service orchestration.', status: 'live', icon: Network },
  { id: 'multi-donor-coordination', category: 'Cross-Government Infrastructure', title: 'Multi-Donor Coordination', description: 'Unified interface for donor visibility, reporting, and compliance.', status: 'pilot', icon: Users },
  { id: 'national-registry', category: 'Cross-Government Infrastructure', title: 'National Registry Integration', description: 'Citizen data synchronization across government systems.', status: 'pilot', icon: Database },
];
