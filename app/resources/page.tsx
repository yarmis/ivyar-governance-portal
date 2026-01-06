'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type ResourceSection = 'overview' | 'countries' | 'packs' | 'usecases' | 'meta';
type CountryId = 'ukraine' | 'poland' | 'germany' | 'georgia' | 'moldova' | 'jordan' | 'kenya' | 'ethiopia';
type PackId = 'government' | 'donor' | 'technical' | 'legal';
type SectorId = 'health' | 'education' | 'social' | 'reconstruction' | 'procurement' | 'crisis';

// ============================================
// COUNTRY PROFILES DATA
// ============================================
const COUNTRY_PROFILES: Record<CountryId, {
  id: CountryId;
  name: string;
  flag: string;
  region: string;
  status: 'National Scale' | 'Active' | 'Pilot' | 'Planned';
  since: string;
  population: string;
  beneficiaries: string;
  budget: string;
  programs: number;
  context: string;
  implementationModel: string;
  governanceModel: string;
  keyPartners: string[];
  lessonsLearned: string[];
  keyMetrics: { label: string; value: string }[];
}> = {
  ukraine: {
    id: 'ukraine',
    name: 'Ukraine',
    flag: '🇺🇦',
    region: 'Eastern Europe',
    status: 'National Scale',
    since: '2022',
    population: '37M',
    beneficiaries: '9.6M',
    budget: '$4.2B',
    programs: 192,
    context: 'Full-scale war since 2022 created unprecedented social protection needs. IVYAR deployed as the national platform for coordinating humanitarian and social assistance across all 24 oblasts.',
    implementationModel: 'National deployment with Ministry of Social Policy as lead agency. Integrated with Diia digital services, national ID system (ID.GOV.UA), and banking infrastructure. Phased rollout starting with IDP assistance, expanding to all social protection programs.',
    governanceModel: 'Central governance through Cabinet of Ministers with Ministry of Social Policy as operational lead. Multi-stakeholder Steering Committee includes Ministry of Finance, Ministry of Digital Transformation, and international partners. Regional coordination through Oblast administrations.',
    keyPartners: ['World Bank', 'USAID', 'EU', 'UNHCR', 'UNICEF', 'WFP', 'IOM'],
    lessonsLearned: [
      'Rapid deployment possible with strong political will and pre-existing digital infrastructure',
      'Integration with national ID system critical for deduplication and fraud prevention',
      'Multi-donor coordination requires dedicated platform governance',
      'Blockchain verification builds trust with international partners',
      'Crisis conditions require flexible, adaptive program design',
    ],
    keyMetrics: [
      { label: 'Deployment Time', value: '6 weeks initial' },
      { label: 'Payment Success Rate', value: '99.7%' },
      { label: 'Fraud Prevention', value: '$127M saved' },
      { label: 'IATI Compliance', value: '99.4%' },
    ],
  },
  poland: {
    id: 'poland',
    name: 'Poland',
    flag: '🇵🇱',
    region: 'Central Europe',
    status: 'Active',
    since: '2022',
    population: '38M',
    beneficiaries: '1.2M',
    budget: '$890M',
    programs: 12,
    context: 'Largest refugee influx in EU history with 1.5M+ Ukrainian refugees. IVYAR deployed for cross-border coordination and refugee assistance management in partnership with government and UN agencies.',
    implementationModel: 'Hybrid model with IVYAR operating alongside national systems. Focus on refugee registration, assistance coordination, and cross-border data sharing with Ukraine (with consent). Integration with ZUS (Social Insurance) for long-term integration support.',
    governanceModel: 'Joint governance between Ministry of Family and Social Policy and UNHCR. Technical hosting in EU data center (Frankfurt) with Polish data residency for citizen data. Cross-border coordination protocols with Ukraine.',
    keyPartners: ['UNHCR', 'EU DG ECHO', 'IOM', 'UNICEF', 'Polish Red Cross'],
    lessonsLearned: [
      'Cross-border data sharing requires robust consent management',
      'Integration with EU systems (EURODAC) enables better coordination',
      'Language support (Ukrainian, Polish, English) essential for user adoption',
      'Hybrid model allows gradual integration with national systems',
    ],
    keyMetrics: [
      { label: 'Refugees Registered', value: '1.2M' },
      { label: 'Cross-border Sync', value: 'Real-time' },
      { label: 'Processing Time', value: '-67%' },
      { label: 'Partner Orgs', value: '47' },
    ],
  },
  germany: {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Western Europe',
    status: 'Active',
    since: '2023',
    population: '84M',
    beneficiaries: '890K',
    budget: '$1.1B',
    programs: 8,
    context: 'Federal system with 16 Länder required federated approach. IVYAR deployed for refugee benefit coordination across federal and state levels, ensuring consistent service delivery.',
    implementationModel: 'Federated deployment respecting Länder autonomy. Central coordination layer with state-level instances. Integration with federal ID system and banking infrastructure. GDPR-compliant architecture certified by BSI.',
    governanceModel: 'Federal-state coordination model. BAMF (Federal Migration Office) leads technical implementation. Each Land maintains operational autonomy with shared standards. Data protection oversight by BfDI.',
    keyPartners: ['BAMF', 'Federal Ministry of Interior', 'GIZ', 'UNHCR Germany'],
    lessonsLearned: [
      'Federal systems require flexible, federated architecture',
      'GDPR compliance must be built-in, not added later',
      'German certification requirements (BSI) require significant preparation',
      'Multi-level governance requires clear RACI matrices',
    ],
    keyMetrics: [
      { label: 'Länder Connected', value: '16/16' },
      { label: 'BSI Certification', value: 'Achieved' },
      { label: 'Processing Efficiency', value: '+45%' },
      { label: 'Data Quality', value: '98.2%' },
    ],
  },
  georgia: {
    id: 'georgia',
    name: 'Georgia',
    flag: '🇬🇪',
    region: 'South Caucasus',
    status: 'Active',
    since: '2023',
    population: '3.7M',
    beneficiaries: '420K',
    budget: '$156M',
    programs: 24,
    context: 'EU candidate country modernizing social protection systems. IVYAR deployed as comprehensive e-governance platform integrating social protection, procurement, and citizen services.',
    implementationModel: 'Full national deployment with Social Service Agency as lead. Integration with national ID (electronic ID cards), Treasury single account, and e-Georgia portal. Supports EU accession alignment.',
    governanceModel: 'Centralized under Ministry of IDPs, Labor, Health and Social Affairs. E-Governance Agency provides technical oversight. EU Delegation monitors alignment with EU standards.',
    keyPartners: ['EU Delegation', 'World Bank', 'UNDP', 'GIZ'],
    lessonsLearned: [
      'EU accession provides strong alignment incentive',
      'Smaller country enables faster, more agile deployment',
      'Strong digital ID infrastructure accelerates implementation',
      'Integration with existing e-governance portal improves adoption',
    ],
    keyMetrics: [
      { label: 'Coverage', value: '94% eligible' },
      { label: 'EU Alignment', value: '89%' },
      { label: 'Digital Adoption', value: '78%' },
      { label: 'Processing Time', value: '-52%' },
    ],
  },
  moldova: {
    id: 'moldova',
    name: 'Moldova',
    flag: '🇲🇩',
    region: 'Eastern Europe',
    status: 'Active',
    since: '2023',
    population: '2.6M',
    beneficiaries: '380K',
    budget: '$89M',
    programs: 18,
    context: 'EU candidate country with significant refugee population and ongoing reform agenda. IVYAR deployed to modernize social protection and support EU accession requirements.',
    implementationModel: 'National deployment with Ministry of Labour and Social Protection. Integration with MPay (national payment system) and national registry. Supports both citizens and 100K+ Ukrainian refugees.',
    governanceModel: 'Ministry-led with E-Governance Agency technical support. EU Delegation provides accession alignment oversight. UNDP supports capacity building.',
    keyPartners: ['EU Delegation', 'UNDP', 'UNICEF', 'World Bank'],
    lessonsLearned: [
      'Refugee and citizen systems can be unified with proper design',
      'Limited IT capacity requires strong partner support',
      'Romanian language support essential for accessibility',
      'EU funding mechanisms require specific reporting formats',
    ],
    keyMetrics: [
      { label: 'Refugees Supported', value: '102K' },
      { label: 'System Uptime', value: '99.8%' },
      { label: 'EU Standards', value: '84%' },
      { label: 'Cost Savings', value: '23%' },
    ],
  },
  jordan: {
    id: 'jordan',
    name: 'Jordan',
    flag: '🇯🇴',
    region: 'Middle East',
    status: 'Active',
    since: '2024',
    population: '11M',
    beneficiaries: '680K',
    budget: '$234M',
    programs: 14,
    context: 'Host to 680K+ registered Syrian refugees. IVYAR deployed to unify fragmented assistance delivery and enable better coordination between government and humanitarian actors.',
    implementationModel: 'Hybrid humanitarian-development model. Integration with UNHCR proGres and NAF (National Aid Fund). Supports both camp-based and urban refugee populations. Mobile-first design for accessibility.',
    governanceModel: 'Joint governance between Ministry of Social Development and UNHCR. Jordan Response Platform provides coordination. Data sharing agreements with humanitarian partners.',
    keyPartners: ['UNHCR', 'WFP', 'UNICEF', 'USAID', 'EU MADAD'],
    lessonsLearned: [
      'Camp and urban contexts require different delivery modalities',
      'Mobile-first essential in refugee contexts',
      'Humanitarian-development nexus requires flexible systems',
      'Arabic language and RTL support critical',
    ],
    keyMetrics: [
      { label: 'Refugees Served', value: '680K' },
      { label: 'Deduplication', value: '12K removed' },
      { label: 'Mobile Usage', value: '89%' },
      { label: 'Partner Integration', value: '23 orgs' },
    ],
  },
  kenya: {
    id: 'kenya',
    name: 'Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    status: 'Pilot',
    since: '2024',
    population: '54M',
    beneficiaries: '145K',
    budget: '$45M',
    programs: 6,
    context: 'Pilot deployment for public procurement transparency. Focus on county-level procurement with blockchain verification to reduce corruption and improve value for money.',
    implementationModel: 'Pilot in 3 counties (Nairobi, Mombasa, Kisumu) with Public Procurement Regulatory Authority. Integration with IFMIS (government financial system). Expansion to national level planned.',
    governanceModel: 'National Treasury oversight with PPRA operational lead. County governments maintain procurement autonomy. Civil society monitoring through open data portal.',
    keyPartners: ['World Bank', 'DFID/FCDO', 'Open Contracting Partnership', 'Transparency International Kenya'],
    lessonsLearned: [
      'Procurement transparency generates strong political support',
      'Civil society engagement increases accountability',
      'County-level pilots enable learning before scale',
      'OCDS compliance attracts international partners',
    ],
    keyMetrics: [
      { label: 'Contracts Published', value: '2,340' },
      { label: 'Corruption Indicators', value: '-67%' },
      { label: 'Competition', value: '+52%' },
      { label: 'Cost Savings', value: '18%' },
    ],
  },
  ethiopia: {
    id: 'ethiopia',
    name: 'Ethiopia',
    flag: '🇪🇹',
    region: 'East Africa',
    status: 'Pilot',
    since: '2024',
    population: '120M',
    beneficiaries: '2.1M',
    budget: '$320M',
    programs: 4,
    context: 'Integration with PSNP (Productive Safety Net Program), Africa\'s largest social protection program. Pilot focuses on payment digitization and beneficiary management modernization.',
    implementationModel: 'Integration layer over existing PSNP systems. Focus on payment digitization through mobile money and bank accounts. Gradual expansion of platform capabilities. Offline-first design for rural areas.',
    governanceModel: 'Ministry of Agriculture (PSNP lead) with World Bank supervision. Regional state coordination for implementation. Food Security Coordination Directorate provides oversight.',
    keyPartners: ['World Bank', 'WFP', 'USAID', 'EU', 'DFID/FCDO'],
    lessonsLearned: [
      'Integration with existing systems more feasible than replacement',
      'Offline functionality essential for rural coverage',
      'Mobile money infrastructure enables payment modernization',
      'Scale (8M beneficiaries) requires phased approach',
    ],
    keyMetrics: [
      { label: 'Payment Digitization', value: '34%' },
      { label: 'Targeting Accuracy', value: '+23%' },
      { label: 'Payment Time', value: '-45%' },
      { label: 'Leakage Reduction', value: '31%' },
    ],
  },
};

// ============================================
// OFFICIAL PACKS DATA
// ============================================
const OFFICIAL_PACKS: Record<PackId, {
  id: PackId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  audience: string[];
  documents: { name: string; type: string; pages: number; description: string }[];
  useCases: string[];
}> = {
  government: {
    id: 'government',
    title: 'Government Briefing Pack',
    subtitle: 'Executive Decision Support',
    icon: '🏛️',
    color: '#A371F7',
    description: 'Comprehensive materials for government officials considering or implementing IVYAR. Includes executive summaries, policy briefs, and implementation roadmaps.',
    audience: ['Ministers', 'Deputy Ministers', 'State Secretaries', 'Senior Policy Advisors', 'Cabinet Members'],
    documents: [
      { name: 'Executive Summary: IVYAR Platform v10.0', type: 'PDF', pages: 8, description: 'High-level overview for decision makers' },
      { name: 'Policy Brief: Sovereign Intelligence for Social Protection', type: 'PDF', pages: 12, description: 'Policy implications and opportunities' },
      { name: 'Implementation Roadmap Template', type: 'DOCX', pages: 24, description: 'Customizable national implementation plan' },
      { name: 'Business Case Template', type: 'XLSX', pages: 1, description: 'ROI calculator and cost-benefit analysis' },
      { name: 'Stakeholder Engagement Guide', type: 'PDF', pages: 16, description: 'Managing political and institutional dynamics' },
      { name: 'Ministerial Presentation Deck', type: 'PPTX', pages: 32, description: 'Ready-to-use Cabinet presentation' },
      { name: 'FAQ for Government Officials', type: 'PDF', pages: 10, description: 'Answers to common questions' },
      { name: 'Country Case Studies Compilation', type: 'PDF', pages: 48, description: 'Lessons from 24+ deployments' },
    ],
    useCases: [
      'National social protection reform',
      'Post-crisis humanitarian response',
      'Digital government transformation',
      'EU accession preparation',
      'Donor coordination improvement',
    ],
  },
  donor: {
    id: 'donor',
    title: 'Donor Pack',
    subtitle: 'Development Partner Resources',
    icon: '🤝',
    color: '#EC4899',
    description: 'Materials for international donors, UN agencies, and development partners evaluating IVYAR for funding, integration, or coordination.',
    audience: ['UN Agency Representatives', 'World Bank Teams', 'Bilateral Donors', 'EU Delegation Officers', 'Foundation Program Officers'],
    documents: [
      { name: 'Donor Overview: IVYAR Platform v10.0', type: 'PDF', pages: 16, description: 'Comprehensive donor-focused introduction' },
      { name: 'IATI 2.03 Compliance Documentation', type: 'PDF', pages: 24, description: 'Transparency standard alignment' },
      { name: 'Funding Tracking & Reporting Guide', type: 'PDF', pages: 20, description: 'How IVYAR tracks donor contributions' },
      { name: 'Multi-Donor Coordination Framework', type: 'PDF', pages: 18, description: 'Avoiding duplication and gaps' },
      { name: 'Impact Measurement Framework', type: 'PDF', pages: 28, description: 'KPIs, outcomes, and evaluation' },
      { name: 'Due Diligence Checklist', type: 'XLSX', pages: 1, description: 'Standard assessment criteria' },
      { name: 'Fiduciary Risk Assessment', type: 'PDF', pages: 14, description: 'Financial management controls' },
      { name: 'Integration Options Guide', type: 'PDF', pages: 22, description: 'API, data sharing, and system integration' },
    ],
    useCases: [
      'Program funding decisions',
      'Technical assistance design',
      'Monitoring and evaluation',
      'Multi-donor coordination',
      'Results-based financing',
    ],
  },
  technical: {
    id: 'technical',
    title: 'Technical Pack',
    subtitle: 'Architecture & Implementation',
    icon: '💻',
    color: '#00A3FF',
    description: 'Deep technical documentation for IT teams, architects, and engineers responsible for deploying, integrating, and maintaining IVYAR.',
    audience: ['IT Directors', 'Solution Architects', 'DevOps Engineers', 'Security Officers', 'Database Administrators'],
    documents: [
      { name: 'Technical Architecture Document v10.0', type: 'PDF', pages: 86, description: 'Complete system architecture' },
      { name: 'API Reference (OpenAPI 3.1)', type: 'YAML', pages: 1, description: 'Full API specification' },
      { name: 'Deployment Guide: Cloud', type: 'PDF', pages: 42, description: 'AWS/GCP/Azure deployment' },
      { name: 'Deployment Guide: On-Premise', type: 'PDF', pages: 56, description: 'Air-gapped and hybrid options' },
      { name: 'Integration Patterns Catalog', type: 'PDF', pages: 38, description: 'Common integration scenarios' },
      { name: 'Security Architecture & Controls', type: 'PDF', pages: 64, description: 'Security design and implementation' },
      { name: 'Database Schema Documentation', type: 'PDF', pages: 48, description: 'Data model and relationships' },
      { name: 'Performance Tuning Guide', type: 'PDF', pages: 32, description: 'Optimization best practices' },
      { name: 'Disaster Recovery Playbook', type: 'PDF', pages: 28, description: 'BC/DR procedures' },
      { name: 'Monitoring & Alerting Setup', type: 'PDF', pages: 24, description: 'Observability stack configuration' },
    ],
    useCases: [
      'National deployment planning',
      'System integration design',
      'Security assessment preparation',
      'Performance optimization',
      'Disaster recovery planning',
    ],
  },
  legal: {
    id: 'legal',
    title: 'Legal & Ethics Pack',
    subtitle: 'Compliance & Governance',
    icon: '⚖️',
    color: '#3CCB7F',
    description: 'Legal frameworks, ethical guidelines, and compliance documentation for legal teams, data protection officers, and ethics committees.',
    audience: ['Legal Counsel', 'Data Protection Officers', 'Ethics Committee Members', 'Compliance Officers', 'Procurement Officers'],
    documents: [
      { name: 'IVYAR Ethical Charter v2.0', type: 'PDF', pages: 28, description: 'Core ethical principles and commitments' },
      { name: 'Data Processing Agreement Template', type: 'DOCX', pages: 18, description: 'GDPR-compliant DPA' },
      { name: 'Privacy Impact Assessment', type: 'PDF', pages: 42, description: 'DPIA for IVYAR deployment' },
      { name: 'AI Governance Framework', type: 'PDF', pages: 36, description: 'Ethical AI guidelines and controls' },
      { name: 'Human Oversight Protocols', type: 'PDF', pages: 24, description: 'HITL requirements and procedures' },
      { name: 'Compliance Matrix (UN/EU/USAID/WB)', type: 'XLSX', pages: 1, description: 'Standard-by-standard alignment' },
      { name: 'Terms of Service Template', type: 'DOCX', pages: 22, description: 'Customizable ToS' },
      { name: 'Procurement Documentation Pack', type: 'ZIP', pages: 0, description: 'RFP/RFI templates and responses' },
      { name: 'Insurance & Liability Framework', type: 'PDF', pages: 16, description: 'Risk allocation and coverage' },
    ],
    useCases: [
      'Legal due diligence',
      'Contract negotiation',
      'Data protection compliance',
      'Ethics committee review',
      'Procurement process',
    ],
  },
};

// ============================================
// USE CASE LIBRARY DATA
// ============================================
const USE_CASE_SECTORS: Record<SectorId, {
  id: SectorId;
  title: string;
  icon: string;
  color: string;
  description: string;
  useCases: {
    title: string;
    country: string;
    flag: string;
    challenge: string;
    solution: string;
    outcomes: string[];
    metrics: { label: string; value: string }[];
  }[];
}> = {
  health: {
    id: 'health',
    title: 'Health',
    icon: '🏥',
    color: '#F85149',
    description: 'Healthcare system support, medical supply chain, health insurance, and pandemic response.',
    useCases: [
      {
        title: 'Medical Supply Chain Optimization',
        country: 'Ukraine',
        flag: '🇺🇦',
        challenge: 'Fragmented medical supply distribution to frontline hospitals with 40% wastage and frequent stockouts.',
        solution: 'IVYAR Logistics Engine with predictive demand modeling, real-time inventory tracking, and optimized routing for medical supplies.',
        outcomes: [
          'Reduced wastage from 40% to 8%',
          'Eliminated critical stockouts',
          'Real-time visibility across 340 facilities',
          'Automated reorder triggers',
        ],
        metrics: [
          { label: 'Wastage Reduction', value: '80%' },
          { label: 'Delivery Time', value: '-45%' },
          { label: 'Cost Savings', value: '$23M/year' },
        ],
      },
      {
        title: 'Health Insurance Registry',
        country: 'Georgia',
        flag: '🇬🇪',
        challenge: 'Fragmented health insurance coverage data preventing effective universal health coverage planning.',
        solution: 'Unified health insurance registry integrated with social protection data for gap analysis and targeted enrollment.',
        outcomes: [
          'Single view of coverage across providers',
          'Identified 180K uninsured vulnerable households',
          'Automated eligibility for subsidized insurance',
        ],
        metrics: [
          { label: 'Coverage Visibility', value: '98%' },
          { label: 'New Enrollments', value: '145K' },
          { label: 'Processing Time', value: '-67%' },
        ],
      },
    ],
  },
  education: {
    id: 'education',
    title: 'Education',
    icon: '🎓',
    color: '#F59E0B',
    description: 'Education grants, school feeding programs, scholarship management, and education emergency response.',
    useCases: [
      {
        title: 'Education Emergency Cash Grants',
        country: 'Ukraine',
        flag: '🇺🇦',
        challenge: 'Displaced children unable to access education due to lack of supplies, uniforms, and technology.',
        solution: 'Targeted education cash grants to IDP families with school-age children, verified through school enrollment data.',
        outcomes: [
          '890K children received education support',
          'Integration with school registry for verification',
          'Seasonal disbursements aligned with school year',
        ],
        metrics: [
          { label: 'Children Supported', value: '890K' },
          { label: 'School Enrollment', value: '+23%' },
          { label: 'Grant Utilization', value: '94%' },
        ],
      },
      {
        title: 'Scholarship Management System',
        country: 'Jordan',
        flag: '🇯🇴',
        challenge: 'Multiple scholarship programs for refugees with no unified tracking, leading to duplication and gaps.',
        solution: 'Unified scholarship registry across UNHCR, UNICEF, and bilateral programs with shared eligibility assessment.',
        outcomes: [
          'Single application for all scholarship programs',
          'Eliminated duplicate awards',
          'Merit-based allocation algorithm',
        ],
        metrics: [
          { label: 'Programs Unified', value: '12' },
          { label: 'Duplicates Removed', value: '4.2K' },
          { label: 'Processing Time', value: '-78%' },
        ],
      },
    ],
  },
  social: {
    id: 'social',
    title: 'Social Protection',
    icon: '🛡️',
    color: '#A371F7',
    description: 'Cash transfers, social assistance, pension management, disability support, and family benefits.',
    useCases: [
      {
        title: 'National Cash Transfer Program',
        country: 'Ukraine',
        flag: '🇺🇦',
        challenge: 'Emergency cash assistance needed for 9.6M beneficiaries across 192 programs with multiple funding sources.',
        solution: 'IVYAR HBS Core as national platform for all social protection payments with blockchain-verified transactions.',
        outcomes: [
          'Unified platform for all programs',
          '$4.2B disbursed with full traceability',
          '99.7% payment success rate',
          'Multi-donor funding coordination',
        ],
        metrics: [
          { label: 'Beneficiaries', value: '9.6M' },
          { label: 'Programs', value: '192' },
          { label: 'Payment Success', value: '99.7%' },
          { label: 'Fraud Prevented', value: '$127M' },
        ],
      },
      {
        title: 'Disability Benefit Modernization',
        country: 'Moldova',
        flag: '🇲🇩',
        challenge: 'Paper-based disability assessment causing delays, inconsistency, and accessibility barriers.',
        solution: 'Digital disability assessment workflow with standardized criteria, appeal management, and accessible interfaces.',
        outcomes: [
          'Reduced assessment time from 45 to 12 days',
          'Consistent application of criteria',
          'Accessible portal for applicants',
        ],
        metrics: [
          { label: 'Processing Time', value: '-73%' },
          { label: 'Appeal Rate', value: '-34%' },
          { label: 'Satisfaction', value: '87%' },
        ],
      },
    ],
  },
  reconstruction: {
    id: 'reconstruction',
    title: 'Reconstruction',
    icon: '🏗️',
    color: '#00A3FF',
    description: 'Post-conflict and post-disaster reconstruction, housing assistance, and infrastructure restoration.',
    useCases: [
      {
        title: 'Housing Damage Compensation',
        country: 'Ukraine',
        flag: '🇺🇦',
        challenge: 'Massive housing damage from conflict with no systematic assessment or compensation mechanism.',
        solution: 'Digital housing damage registry with satellite verification, AI-assisted assessment, and compensation workflow.',
        outcomes: [
          '2.3M properties assessed',
          'Satellite imagery integration for verification',
          'Tiered compensation based on damage level',
          'Blockchain-recorded disbursements',
        ],
        metrics: [
          { label: 'Properties Assessed', value: '2.3M' },
          { label: 'Compensation Paid', value: '$890M' },
          { label: 'Assessment Accuracy', value: '94%' },
        ],
      },
      {
        title: 'Post-Earthquake Recovery',
        country: 'Albania',
        flag: '🇦🇱',
        challenge: '2019 earthquake left 45,000 households needing reconstruction assistance with limited coordination.',
        solution: 'Integrated reconstruction management platform linking damage assessment, beneficiary registry, contractor management, and disbursement.',
        outcomes: [
          'Unified registry of affected households',
          'Contractor performance tracking',
          'Progress-based payment releases',
        ],
        metrics: [
          { label: 'Households Supported', value: '45K' },
          { label: 'Reconstruction Rate', value: '87%' },
          { label: 'Cost Overruns', value: '-23%' },
        ],
      },
    ],
  },
  procurement: {
    id: 'procurement',
    title: 'Procurement',
    icon: '📋',
    color: '#3CCB7F',
    description: 'Public procurement, tender management, contract monitoring, and anti-corruption measures.',
    useCases: [
      {
        title: 'Transparent Public Procurement',
        country: 'Kenya',
        flag: '🇰🇪',
        challenge: 'Procurement corruption estimated at 30% of public spending with limited transparency and competition.',
        solution: 'Blockchain-verified procurement platform with open data, automated bid evaluation, and contract monitoring.',
        outcomes: [
          'All tenders published openly (OCDS compliant)',
          'Automated bid evaluation reduces manipulation',
          'Contract performance tracking',
          'Civil society monitoring access',
        ],
        metrics: [
          { label: 'Corruption Indicators', value: '-67%' },
          { label: 'Competition', value: '+52%' },
          { label: 'Cost Savings', value: '18%' },
          { label: 'Contracts Published', value: '2,340' },
        ],
      },
      {
        title: 'Humanitarian Procurement Coordination',
        country: 'Jordan',
        flag: '🇯🇴',
        challenge: 'Multiple humanitarian agencies procuring similar items without coordination, losing bulk pricing benefits.',
        solution: 'Joint procurement platform enabling agencies to combine requirements and share framework contracts.',
        outcomes: [
          'Consolidated procurement across 15 agencies',
          'Framework contracts for common items',
          'Shared supplier database',
        ],
        metrics: [
          { label: 'Agencies Participating', value: '15' },
          { label: 'Cost Savings', value: '24%' },
          { label: 'Lead Time', value: '-38%' },
        ],
      },
    ],
  },
  crisis: {
    id: 'crisis',
    title: 'Crisis Response',
    icon: '🚨',
    color: '#F85149',
    description: 'Emergency response, early warning, disaster management, and humanitarian coordination.',
    useCases: [
      {
        title: 'Flood Early Warning & Response',
        country: 'Bangladesh',
        flag: '🇧🇩',
        challenge: 'Annual flooding affects millions with limited advance warning and slow response mobilization.',
        solution: 'Crisis Anticipation Engine integrating satellite, weather, and ground sensor data for 14-day flood prediction.',
        outcomes: [
          '14-day advance warning capability',
          'Automated resource pre-positioning triggers',
          'Beneficiary notification system',
          'Response coordination dashboard',
        ],
        metrics: [
          { label: 'Warning Lead Time', value: '14 days' },
          { label: 'Prediction Accuracy', value: '89%' },
          { label: 'Response Time', value: '-56%' },
          { label: 'Lives Protected', value: '2.3M' },
        ],
      },
      {
        title: 'IDP Emergency Registration',
        country: 'Ukraine',
        flag: '🇺🇦',
        challenge: 'Massive displacement requiring rapid registration and assistance delivery in conflict conditions.',
        solution: 'Mobile-first IDP registration with offline capability, biometric verification, and immediate assistance linkage.',
        outcomes: [
          '2.1M IDPs registered in 6 weeks',
          'Offline registration in affected areas',
          'Same-day assistance activation',
          'Family reunification support',
        ],
        metrics: [
          { label: 'Registration Time', value: '6 weeks' },
          { label: 'IDPs Registered', value: '2.1M' },
          { label: 'Assistance Activation', value: '<24hrs' },
          { label: 'Deduplication', value: '99.4%' },
        ],
      },
    ],
  },
};

// ============================================
// META DOCUMENTS DATA
// ============================================
const META_DOCUMENTS = [
  {
    id: 'concept-paper',
    title: 'HBS v10.0 Concept Paper',
    subtitle: 'The Unified Vision',
    icon: '📄',
    color: '#00A3FF',
    description: 'The definitive document explaining the HBS v10.0 "Sovereign Intelligence" vision, architecture, and roadmap. Synthesizes all platform components into a coherent strategic narrative.',
    pages: 64,
    sections: [
      'Executive Summary',
      'Problem Statement: Global Social Protection Challenges',
      'Solution: Humanitarian Budget Support Model',
      'Platform Architecture v10.0',
      'Sovereign Intelligence Layer',
      'Ethical Core & Human Oversight',
      'Implementation Approach',
      'Governance Framework',
      'International Standards Alignment',
      'Roadmap & Future Vision',
    ],
  },
  {
    id: 'ethical-framework',
    title: 'Ethical & Sovereign Intelligence Framework',
    subtitle: 'AI Governance for Nation States',
    icon: '🛡️',
    color: '#A371F7',
    description: 'Comprehensive framework for ethical AI deployment in government contexts. Defines principles, boundaries, oversight mechanisms, and accountability structures.',
    pages: 48,
    sections: [
      'Foundational Principles',
      'Ethical Boundaries & Red Lines',
      'Human Oversight Requirements',
      'AI Decision Classification',
      'Emergency Stop System (ESS)',
      'Bias Detection & Mitigation',
      'Transparency & Explainability',
      'Accountability Framework',
      'Audit & Compliance',
      'Continuous Improvement',
    ],
  },
  {
    id: 'deployment-framework',
    title: 'State Deployment Framework',
    subtitle: 'National Implementation Guide',
    icon: '🚀',
    color: '#3CCB7F',
    description: 'Step-by-step framework for national IVYAR deployment. Covers assessment, planning, implementation, and sustainability across all government contexts.',
    pages: 72,
    sections: [
      'Readiness Assessment',
      'Stakeholder Mapping',
      'Governance Design',
      'Technical Architecture Selection',
      'Data Migration Strategy',
      'Integration Planning',
      'Change Management',
      'Training & Capacity Building',
      'Phased Rollout',
      'Sustainability Planning',
    ],
  },
  {
    id: 'alignment-statement',
    title: 'International Alignment Statement',
    subtitle: 'Global Standards Compliance',
    icon: '🌐',
    color: '#EC4899',
    description: 'Official statement on IVYAR alignment with international standards, frameworks, and commitments. Demonstrates compliance with UN, EU, USAID, and World Bank requirements.',
    pages: 36,
    sections: [
      'UN Standards (IATI, HXL, OCHA)',
      'EU Frameworks (GDPR, AI Act, eIDAS)',
      'USAID Requirements (ADS 579, CLA)',
      'World Bank Standards (ESF, Procurement)',
      'SDG Alignment',
      'Grand Bargain Commitments',
      'Humanitarian Principles',
      'Open Data & Transparency',
      'Interoperability Standards',
      'Certification Status',
    ],
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ResourcesV10Page() {
  const [activeSection, setActiveSection] = useState<ResourceSection>('overview');
  const [selectedCountry, setSelectedCountry] = useState<CountryId>('ukraine');
  const [selectedPack, setSelectedPack] = useState<PackId>('government');
  const [selectedSector, setSelectedSector] = useState<SectorId>('social');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Resources</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B949E]">International Knowledge Hub</span>
            <button className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]">
              Download All
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📚</span>
            <span className="text-sm bg-[#00A3FF]/10 text-[#00A3FF] px-3 py-1 rounded-full font-medium">
              v10.0 Knowledge Hub
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Resources Portal</h1>
          <p className="text-lg text-[#8B949E] max-w-2xl">
            Comprehensive knowledge base for IVYAR Platform v10.0. Country profiles, official packs, 
            use case library, and strategic documents for all stakeholders.
          </p>
        </div>
      </section>

      {/* Section Tabs */}
      <section className="border-b border-[#1F242C] sticky top-16 bg-[#0D1117] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'countries', label: 'Country Profiles', icon: '🌍' },
              { id: 'packs', label: 'Official Packs', icon: '📦' },
              { id: 'usecases', label: 'Use Case Library', icon: '💡' },
              { id: 'meta', label: 'Strategic Documents', icon: '📄' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as ResourceSection)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? 'bg-[#00A3FF] text-[#0D1117]'
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
          {activeSection === 'countries' && (
            <CountriesSection selected={selectedCountry} setSelected={setSelectedCountry} />
          )}
          {activeSection === 'packs' && (
            <PacksSection selected={selectedPack} setSelected={setSelectedPack} />
          )}
          {activeSection === 'usecases' && (
            <UseCasesSection selected={selectedSector} setSelected={setSelectedSector} />
          )}
          {activeSection === 'meta' && <MetaSection />}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B949E]">
            Resources Portal v10.0 — International Knowledge Hub for IVYAR Platform
          </p>
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
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '8', label: 'Country Profiles', icon: '🌍' },
          { value: '4', label: 'Official Packs', icon: '📦' },
          { value: '12', label: 'Use Cases', icon: '💡' },
          { value: '4', label: 'Strategic Documents', icon: '📄' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-[#00A3FF]">{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🌍</span> Country Profiles
          </h3>
          <p className="text-sm text-[#8B949E] mb-4">
            Detailed profiles for 8 deployment countries including context, implementation model, 
            governance, partners, and lessons learned.
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(COUNTRY_PROFILES).map((c) => (
              <span key={c.id} className="text-lg">{c.flag}</span>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📦</span> Official Packs
          </h3>
          <p className="text-sm text-[#8B949E] mb-4">
            Curated document packages for specific audiences: Government, Donor, Technical, and Legal teams.
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(OFFICIAL_PACKS).map((p) => (
              <span 
                key={p.id} 
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: `${p.color}20`, color: p.color }}
              >
                {p.title.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💡</span> Use Case Library
          </h3>
          <p className="text-sm text-[#8B949E] mb-4">
            Real-world implementation examples across 6 sectors with challenges, solutions, and measurable outcomes.
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(USE_CASE_SECTORS).map((s) => (
              <span 
                key={s.id} 
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: `${s.color}20`, color: s.color }}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📄</span> Strategic Documents
          </h3>
          <p className="text-sm text-[#8B949E] mb-4">
            Foundational documents defining HBS vision, ethical framework, deployment methodology, and international alignment.
          </p>
          <div className="flex flex-wrap gap-2">
            {META_DOCUMENTS.map((d) => (
              <span 
                key={d.id} 
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: `${d.color}20`, color: d.color }}
              >
                {d.title.split(':')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* World Map */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6 text-center">Global Deployment Footprint</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {Object.values(COUNTRY_PROFILES).map((country) => (
            <div key={country.id} className="text-center">
              <div className="text-3xl mb-1">{country.flag}</div>
              <div className="text-xs font-medium">{country.name}</div>
              <div className={`text-[10px] ${
                country.status === 'National Scale' ? 'text-[#3CCB7F]' :
                country.status === 'Active' ? 'text-[#00A3FF]' : 'text-[#F59E0B]'
              }`}>
                {country.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COUNTRIES SECTION
// ============================================
function CountriesSection({ 
  selected, 
  setSelected 
}: { 
  selected: CountryId; 
  setSelected: (id: CountryId) => void;
}) {
  const country = COUNTRY_PROFILES[selected];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Country Profiles</h2>
        <p className="text-[#8B949E]">
          Detailed deployment profiles for each IVYAR implementation country.
        </p>
      </div>

      {/* Country Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.values(COUNTRY_PROFILES).map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selected === c.id
                ? 'bg-[#00A3FF] text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Country Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">{country.flag}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{country.name}</h3>
                <p className="text-[#8B949E]">{country.region}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    country.status === 'National Scale' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                    country.status === 'Active' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' : 
                    'bg-[#F59E0B]/20 text-[#F59E0B]'
                  }`}>
                    {country.status}
                  </span>
                  <span className="text-xs text-[#6E7681]">Since {country.since}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Population', value: country.population },
                { label: 'Beneficiaries', value: country.beneficiaries },
                { label: 'Budget', value: country.budget },
                { label: 'Programs', value: country.programs.toString() },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0D1117] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-[#00A3FF]">{stat.value}</div>
                  <div className="text-xs text-[#8B949E]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-3">Context</h4>
            <p className="text-sm text-[#8B949E]">{country.context}</p>
          </div>

          {/* Implementation Model */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-3">Implementation Model</h4>
            <p className="text-sm text-[#8B949E]">{country.implementationModel}</p>
          </div>

          {/* Governance Model */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-3">Governance Model</h4>
            <p className="text-sm text-[#8B949E]">{country.governanceModel}</p>
          </div>

          {/* Lessons Learned */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-3">Lessons Learned</h4>
            <ul className="space-y-2">
              {country.lessonsLearned.map((lesson, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#8B949E]">
                  <span className="text-[#3CCB7F] mt-0.5">✓</span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Key Metrics</h4>
            <div className="space-y-3">
              {country.keyMetrics.map((metric, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-[#8B949E]">{metric.label}</span>
                  <span className="font-mono text-[#3CCB7F]">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Partners */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Key Partners</h4>
            <div className="flex flex-wrap gap-2">
              {country.keyPartners.map((partner, i) => (
                <span key={i} className="text-xs bg-[#1F242C] text-[#8B949E] px-2 py-1 rounded">
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Download Profile */}
          <button className="w-full py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF]">
            Download Country Profile (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PACKS SECTION
// ============================================
function PacksSection({ 
  selected, 
  setSelected 
}: { 
  selected: PackId; 
  setSelected: (id: PackId) => void;
}) {
  const pack = OFFICIAL_PACKS[selected];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Official Packs</h2>
        <p className="text-[#8B949E]">
          Curated document packages for specific stakeholder audiences.
        </p>
      </div>

      {/* Pack Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.values(OFFICIAL_PACKS).map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selected === p.id
                ? 'text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
            style={selected === p.id ? { backgroundColor: p.color } : {}}
          >
            <span>{p.icon}</span>
            <span>{p.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Pack Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${pack.color}20` }}
              >
                {pack.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{pack.title}</h3>
                <p className="text-[#8B949E]">{pack.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-[#8B949E] mb-6">{pack.description}</p>

            <h4 className="font-semibold mb-3">Documents Included</h4>
            <div className="space-y-3">
              {pack.documents.map((doc, i) => (
                <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-[#6E7681]">{doc.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8B949E]">{doc.type} • {doc.pages > 0 ? `${doc.pages} pages` : 'Archive'}</span>
                    <button className="text-[#00A3FF] hover:underline text-sm">↓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Target Audience</h4>
            <ul className="space-y-2">
              {pack.audience.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span style={{ color: pack.color }}>•</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h4 className="font-semibold mb-4">Common Use Cases</h4>
            <ul className="space-y-2">
              {pack.useCases.map((uc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                  <span className="text-[#3CCB7F]">✓</span>
                  {uc}
                </li>
              ))}
            </ul>
          </div>

          <button 
            className="w-full py-3 rounded-lg font-medium text-[#0D1117]"
            style={{ backgroundColor: pack.color }}
          >
            Download Complete Pack (ZIP)
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// USE CASES SECTION
// ============================================
function UseCasesSection({ 
  selected, 
  setSelected 
}: { 
  selected: SectorId; 
  setSelected: (id: SectorId) => void;
}) {
  const sector = USE_CASE_SECTORS[selected];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Use Case Library</h2>
        <p className="text-[#8B949E]">
          Real-world implementation examples organized by sector.
        </p>
      </div>

      {/* Sector Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.values(USE_CASE_SECTORS).map((s) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selected === s.id
                ? 'text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
            style={selected === s.id ? { backgroundColor: s.color } : {}}
          >
            <span>{s.icon}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Sector Header */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${sector.color}20` }}
          >
            {sector.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">{sector.title}</h3>
            <p className="text-sm text-[#8B949E]">{sector.description}</p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        {sector.useCases.map((uc, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
            <div className="h-1" style={{ backgroundColor: sector.color }}></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{uc.flag}</span>
                <div>
                  <h4 className="font-semibold">{uc.title}</h4>
                  <span className="text-sm text-[#8B949E]">{uc.country}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#0D1117] rounded-lg p-4">
                  <div className="text-xs text-[#F85149] font-semibold mb-2">CHALLENGE</div>
                  <p className="text-sm text-[#8B949E]">{uc.challenge}</p>
                </div>
                <div className="bg-[#0D1117] rounded-lg p-4">
                  <div className="text-xs font-semibold mb-2" style={{ color: sector.color }}>SOLUTION</div>
                  <p className="text-sm text-[#8B949E]">{uc.solution}</p>
                </div>
                <div className="bg-[#0D1117] rounded-lg p-4">
                  <div className="text-xs text-[#3CCB7F] font-semibold mb-2">OUTCOMES</div>
                  <ul className="space-y-1">
                    {uc.outcomes.slice(0, 3).map((o, j) => (
                      <li key={j} className="text-xs text-[#8B949E]">• {o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {uc.metrics.map((m, j) => (
                  <div key={j} className="bg-[#0D1117] rounded-lg px-4 py-2">
                    <div className="text-lg font-bold" style={{ color: sector.color }}>{m.value}</div>
                    <div className="text-xs text-[#6E7681]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// META SECTION
// ============================================
function MetaSection() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Strategic Documents</h2>
        <p className="text-[#8B949E]">
          Foundational documents defining the HBS v10.0 vision and framework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {META_DOCUMENTS.map((doc) => (
          <div key={doc.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
            <div className="h-2" style={{ backgroundColor: doc.color }}></div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${doc.color}20` }}
                >
                  {doc.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="text-sm text-[#8B949E]">{doc.subtitle}</p>
                  <span className="text-xs text-[#6E7681]">{doc.pages} pages</span>
                </div>
              </div>
              <p className="text-sm text-[#8B949E] mb-4">{doc.description}</p>
              
              <div className="mb-4">
                <div className="text-xs font-semibold text-[#8B949E] mb-2">SECTIONS</div>
                <div className="flex flex-wrap gap-1">
                  {doc.sections.slice(0, 5).map((section, i) => (
                    <span key={i} className="text-xs bg-[#0D1117] text-[#6E7681] px-2 py-1 rounded">
                      {section}
                    </span>
                  ))}
                  {doc.sections.length > 5 && (
                    <span className="text-xs text-[#6E7681]">+{doc.sections.length - 5} more</span>
                  )}
                </div>
              </div>

              <button 
                className="w-full py-2 rounded-lg font-medium text-sm text-[#0D1117]"
                style={{ backgroundColor: doc.color }}
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
