// lib/auth/deployment.ts
// IVYAR Access Governance Module - Deployment Scenarios & TOR v2.0

// ============================================================================
// TYPES
// ============================================================================

export interface CountryScenario {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  ministry: string;
  context: string;
  challenges: string[];
  implementation: ImplementationPlan;
  actors: Actor[];
  outcomes: string[];
  timeline: string;
  budget: string;
}

export interface ImplementationPlan {
  phase1: PhaseDetails;
  phase2: PhaseDetails;
  phase3: PhaseDetails;
  integrations: string[];
  policies: string[];
}

export interface PhaseDetails {
  name: string;
  duration: string;
  tasks: string[];
}

export interface Actor {
  role: string;
  description: string;
  count: number;
}

export interface TORSection {
  id: string;
  title: string;
  content: string[];
}

// ============================================================================
// COUNTRY SCENARIOS
// ============================================================================

export const COUNTRY_SCENARIOS: CountryScenario[] = [
  // ========================================
  // UKRAINE
  // ========================================
  {
    id: 'UA-001',
    country: 'Ukraine',
    countryCode: 'UA',
    flag: '🇺🇦',
    ministry: 'Ministry of Social Policy',
    context: 'Ukraine is rapidly digitalizing government services during wartime, requiring robust access control for sensitive citizen data including IDP registrations, social benefits, and humanitarian aid distribution.',
    challenges: [
      'Wartime security requirements',
      'High volume of IDP data processing',
      'Multiple international donor integrations',
      'Decentralized local administration access',
      'Compliance with EU standards for accession'
    ],
    implementation: {
      phase1: {
        name: 'Foundation',
        duration: '4 weeks',
        tasks: [
          'Deploy AGM infrastructure on Government Cloud',
          'Integrate with Diia SSO',
          'Configure base roles: citizen, social_worker, local_admin',
          'Enable audit logging for all access'
        ]
      },
      phase2: {
        name: 'Expansion',
        duration: '6 weeks',
        tasks: [
          'Add donor, auditor, government roles',
          'Integrate with social registries',
          'Configure regional access boundaries',
          'Enable IP-based restrictions for admin access'
        ]
      },
      phase3: {
        name: 'Full Deployment',
        duration: '4 weeks',
        tasks: [
          'National rollout to all regions',
          'Training for 500+ administrators',
          'Integration with Security Center',
          'Compliance certification'
        ]
      },
      integrations: ['Diia SSO', 'USRPOU (Business Registry)', 'Social Protection Registry', 'Humanitarian Aid Platform'],
      policies: ['Module Access Policy', 'Admin Policy', 'Security Policy', 'Data Protection Policy']
    },
    actors: [
      { role: 'citizen', description: 'IDP and benefit recipients', count: 5000000 },
      { role: 'social_worker', description: 'Local social service staff', count: 15000 },
      { role: 'local_admin', description: 'Regional administrators', count: 500 },
      { role: 'government', description: 'Ministry officials', count: 50 },
      { role: 'donor', description: 'USAID, EU, UN representatives', count: 20 },
      { role: 'auditor', description: 'External compliance auditors', count: 10 }
    ],
    outcomes: [
      'Unified access control across all regions',
      'Full audit trail for donor compliance',
      'Reduced unauthorized access incidents by 95%',
      'EU GDPR compliance achieved'
    ],
    timeline: '14 weeks',
    budget: '$150,000 - $250,000'
  },

  // ========================================
  // POLAND
  // ========================================
  {
    id: 'PL-001',
    country: 'Poland',
    countryCode: 'PL',
    flag: '🇵🇱',
    ministry: 'Ministry of Digital Affairs',
    context: 'Poland has advanced digital infrastructure (mObywatel, Profil Zaufany) but needs unified access management across ministries for cross-agency services.',
    challenges: [
      'Multiple ministry systems with separate access',
      'No centralized audit across agencies',
      'EU compliance requirements',
      'High security standards for government data'
    ],
    implementation: {
      phase1: {
        name: 'Foundation',
        duration: '3 weeks',
        tasks: [
          'Integrate with Profil Zaufany (Trusted Profile) SSO',
          'Configure cross-ministry roles',
          'Enable centralized audit logging'
        ]
      },
      phase2: {
        name: 'Ministry Integration',
        duration: '8 weeks',
        tasks: [
          'Connect ZUS (Social Insurance)',
          'Connect Urząd Pracy (Employment Office)',
          'Configure Separation of Duties policies',
          'Enable Dual Approval for admin actions'
        ]
      },
      phase3: {
        name: 'Optimization',
        duration: '3 weeks',
        tasks: [
          'Performance tuning',
          'EU audit preparation',
          'Staff training',
          'Documentation completion'
        ]
      },
      integrations: ['Profil Zaufany', 'mObywatel', 'ZUS', 'CEIDG', 'KRS'],
      policies: ['Access Control Policy', 'Cross-Ministry Policy', 'EU Compliance Policy']
    },
    actors: [
      { role: 'citizen', description: 'Polish citizens using e-services', count: 10000000 },
      { role: 'ministry_staff', description: 'Government employees', count: 50000 },
      { role: 'ministry_admin', description: 'Ministry IT administrators', count: 200 },
      { role: 'auditor', description: 'EU compliance inspectors', count: 15 }
    ],
    outcomes: [
      'Single access control for all ministries',
      'Transparent audit for EU compliance',
      'Reduced internal access incidents',
      'Improved cross-agency collaboration'
    ],
    timeline: '14 weeks',
    budget: '$200,000 - $350,000'
  },

  // ========================================
  // GEORGIA
  // ========================================
  {
    id: 'GE-001',
    country: 'Georgia',
    countryCode: 'GE',
    flag: '🇬🇪',
    ministry: 'Ministry of Justice',
    context: 'Georgia has a strong digital platform (Public Service Hall) but needs centralized access control for notaries, lawyers, and state registrars.',
    challenges: [
      'Distributed access across agencies',
      'No unified audit mechanism',
      'High-value document access control',
      'International recognition requirements'
    ],
    implementation: {
      phase1: {
        name: 'Core Setup',
        duration: '3 weeks',
        tasks: [
          'Deploy AGM on government infrastructure',
          'Configure legal professional roles',
          'Enable document access logging'
        ]
      },
      phase2: {
        name: 'Registry Integration',
        duration: '6 weeks',
        tasks: [
          'Connect Public Registry',
          'Connect Notary Chamber systems',
          'Configure High-Risk MFA policies',
          'Enable IP-based restrictions'
        ]
      },
      phase3: {
        name: 'Launch',
        duration: '3 weeks',
        tasks: [
          'National rollout',
          'Training for legal professionals',
          'Compliance verification'
        ]
      },
      integrations: ['Public Service Hall SSO', 'Public Registry', 'Notary Information System', 'Courts System'],
      policies: ['Legal Access Policy', 'Document Security Policy', 'Audit Policy']
    },
    actors: [
      { role: 'citizen', description: 'Service users', count: 2000000 },
      { role: 'notary', description: 'Licensed notaries', count: 300 },
      { role: 'attorney', description: 'Registered lawyers', count: 5000 },
      { role: 'registrar', description: 'State registrars', count: 200 },
      { role: 'admin', description: 'Ministry administrators', count: 30 }
    ],
    outcomes: [
      'Unified access for legal professionals',
      'Complete audit trail for document access',
      'Reduced fraud in legal processes',
      'International trust increase'
    ],
    timeline: '12 weeks',
    budget: '$100,000 - $180,000'
  },

  // ========================================
  // MOLDOVA
  // ========================================
  {
    id: 'MD-001',
    country: 'Moldova',
    countryCode: 'MD',
    flag: '🇲🇩',
    ministry: 'Ministry of Labor and Social Protection',
    context: 'Moldova is actively digitalizing with EU support, requiring transparent access control for social programs and EU compliance.',
    challenges: [
      'Multiple separate social systems',
      'No standardized access control',
      'EU accession requirements',
      'Limited IT resources'
    ],
    implementation: {
      phase1: {
        name: 'Foundation',
        duration: '4 weeks',
        tasks: [
          'Deploy cloud-based AGM',
          'Configure social worker roles',
          'Enable basic audit logging'
        ]
      },
      phase2: {
        name: 'Integration',
        duration: '6 weeks',
        tasks: [
          'Connect social assistance systems',
          'Configure local administration access',
          'Enable Least Privilege policies'
        ]
      },
      phase3: {
        name: 'Compliance',
        duration: '4 weeks',
        tasks: [
          'EU compliance certification',
          'Staff training',
          'Documentation in Romanian and Russian'
        ]
      },
      integrations: ['MPass SSO', 'Social Assistance System', 'Population Registry', 'Employment Agency'],
      policies: ['Social Data Policy', 'Access Control Policy', 'EU Compliance Policy']
    },
    actors: [
      { role: 'citizen', description: 'Benefit recipients', count: 500000 },
      { role: 'social_worker', description: 'Social assistance staff', count: 3000 },
      { role: 'local_admin', description: 'Local office managers', count: 100 },
      { role: 'ministry', description: 'Ministry officials', count: 20 }
    ],
    outcomes: [
      'Transparent social program management',
      'Reduced fraud and abuse',
      'EU compliance achieved',
      'Improved efficiency'
    ],
    timeline: '14 weeks',
    budget: '$80,000 - $150,000'
  },

  // ========================================
  // KENYA
  // ========================================
  {
    id: 'KE-001',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    ministry: 'Ministry of Interior',
    context: 'Kenya has rapidly growing digital infrastructure (Huduma) but needs centralized access governance for security-sensitive services.',
    challenges: [
      'Manual access management processes',
      'No centralized audit capability',
      'High corruption risk areas',
      'Multi-agency coordination needed'
    ],
    implementation: {
      phase1: {
        name: 'Security Setup',
        duration: '4 weeks',
        tasks: [
          'Deploy secure AGM infrastructure',
          'Configure security service roles',
          'Enable comprehensive logging'
        ]
      },
      phase2: {
        name: 'Agency Integration',
        duration: '8 weeks',
        tasks: [
          'Connect Immigration Department',
          'Connect Police services',
          'Configure Escalation Policy',
          'Enable Emergency Access protocols'
        ]
      },
      phase3: {
        name: 'National Rollout',
        duration: '4 weeks',
        tasks: [
          'Deploy to all counties',
          'Train security personnel',
          'Compliance verification',
          'Donor reporting setup'
        ]
      },
      integrations: ['Huduma API', 'IPRS (Population Registry)', 'Immigration System', 'Police Records'],
      policies: ['Security Access Policy', 'Escalation Policy', 'Anti-Corruption Policy', 'Emergency Access Policy']
    },
    actors: [
      { role: 'citizen', description: 'Service users', count: 20000000 },
      { role: 'officer', description: 'Government officers', count: 50000 },
      { role: 'supervisor', description: 'Regional supervisors', count: 500 },
      { role: 'security_admin', description: 'Security administrators', count: 50 },
      { role: 'auditor', description: 'Anti-corruption auditors', count: 20 }
    ],
    outcomes: [
      'Real-time access monitoring',
      'Reduced corruption risk',
      'Donor confidence increase',
      'Improved service delivery'
    ],
    timeline: '16 weeks',
    budget: '$120,000 - $220,000'
  }
];

// ============================================================================
// TERMS OF REFERENCE (TOR)
// ============================================================================

export const TOR_DOCUMENT: TORSection[] = [
  {
    id: 'TOR-01',
    title: '1. Purpose',
    content: [
      'Establish a centralized access governance system for government agencies.',
      'Provide unified role-based access control (RBAC) across all modules.',
      'Ensure full audit trail for compliance and accountability.',
      'Enable policy-driven access decisions aligned with international standards.'
    ]
  },
  {
    id: 'TOR-02',
    title: '2. Objectives',
    content: [
      'Unify access management across all government platforms.',
      'Provide complete audit trail of all access changes.',
      'Implement formal policies for access control.',
      'Achieve compliance with GDPR, NIST 800-53, ISO 27001.',
      'Reduce unauthorized access incidents by 90%.'
    ]
  },
  {
    id: 'TOR-03',
    title: '3. Scope of Work',
    content: [
      'Deploy RBAC Engine with 11 roles and 54+ permissions.',
      'Implement Policy Engine with 6 formal policies and 25+ rules.',
      'Deploy Audit Engine with immutable logging.',
      'Implement Consistency Checker with 12 automated checks.',
      'Integrate with national SSO/identity provider.',
      'Connect to relevant national registries.',
      'Provide comprehensive training for administrators.',
      'Complete testing and security assessment.',
      'Deliver documentation in local language(s).'
    ]
  },
  {
    id: 'TOR-04',
    title: '4. Deliverables',
    content: [
      'AGM Dashboard (web application)',
      'Roles & Permissions configuration',
      'Policy framework implementation',
      'Audit logging system',
      'Consistency checking system',
      'API documentation (OpenAPI)',
      'Administrator playbook',
      'Training materials and sessions',
      'Deployment guide',
      'Maintenance procedures'
    ]
  },
  {
    id: 'TOR-05',
    title: '5. Technical Requirements',
    content: [
      'REST API with OpenAPI 3.0 specification',
      'JSON/YAML configuration for RBAC',
      'Multi-tenant architecture support',
      'Multi-country deployment capability',
      'SSO integration (OAuth2, SAML, OpenID Connect)',
      'Immutable audit log storage',
      'High availability (99.9% uptime)',
      'Horizontal scalability',
      'Encrypted data at rest and in transit'
    ]
  },
  {
    id: 'TOR-06',
    title: '6. Security Requirements',
    content: [
      'Multi-factor authentication (MFA) for admin actions',
      'IP-based access restrictions',
      'Dual approval for critical changes',
      'Automatic incident triggers for suspicious activity',
      'Session timeout after 30 minutes of inactivity',
      'Failed login lockout after 5 attempts',
      'Encrypted communications (TLS 1.3)',
      'Regular security assessments'
    ]
  },
  {
    id: 'TOR-07',
    title: '7. Compliance Standards',
    content: [
      'GDPR (EU General Data Protection Regulation)',
      'NIST 800-53 (Security Controls)',
      'ISO/IEC 27001 (Information Security)',
      'USAID Digital Strategy requirements',
      'EU Digital Governance Framework'
    ]
  },
  {
    id: 'TOR-08',
    title: '8. Implementation Timeline',
    content: [
      'Phase 1 - Architecture & Setup: 2-4 weeks',
      'Phase 2 - Development & Configuration: 4-8 weeks',
      'Phase 3 - Integration: 2-4 weeks',
      'Phase 4 - Testing & Security Assessment: 2-3 weeks',
      'Phase 5 - Training & Documentation: 1-2 weeks',
      'Phase 6 - Deployment & Support: 2-3 weeks',
      'Total: 12-24 weeks depending on scope'
    ]
  },
  {
    id: 'TOR-09',
    title: '9. Team Requirements',
    content: [
      'Project Manager: 1 FTE',
      'Solution Architect: 1 FTE',
      'Backend Developers: 2-3 FTE',
      'Frontend Developer: 1-2 FTE',
      'Security Specialist: 1 FTE',
      'QA Engineer: 1 FTE',
      'Technical Writer: 0.5 FTE',
      'Training Specialist: 0.5 FTE'
    ]
  },
  {
    id: 'TOR-10',
    title: '10. Acceptance Criteria',
    content: [
      'All 12 consistency checks passing',
      'Audit log capturing 100% of access changes',
      'MFA working for all high-risk actions',
      'SSO integration tested and verified',
      'Performance: < 200ms response time for 95% of requests',
      'Security assessment completed with no critical findings',
      'Training completed for all designated administrators',
      'Documentation approved by client'
    ]
  }
];

// ============================================================================
// MINISTRY BRIEFING
// ============================================================================

export const MINISTRY_BRIEFING = {
  title: 'IVYAR Access Governance Module (AGM)',
  subtitle: 'Official Briefing for Government Decision Makers',
  location: 'Washington, USA',
  contact: 'info@ivyar.org',
  
  sections: [
    {
      title: 'What is AGM?',
      content: 'AGM is a centralized access governance platform that provides unified role-based access control, policy enforcement, and comprehensive audit capabilities for government digital services.'
    },
    {
      title: 'Key Capabilities',
      items: [
        '11 institutional roles with 54 granular permissions',
        '6 formal policies with 25+ enforceable rules',
        '12 automated consistency checks',
        '100% audit trail for all access changes',
        'Integration with Security and Incident Management'
      ]
    },
    {
      title: 'Benefits',
      items: [
        'Single source of truth for access control',
        'Transparent audit for donors and compliance',
        'Reduced risk of unauthorized access',
        'Compliance with international standards',
        'Improved operational efficiency'
      ]
    },
    {
      title: 'Target Users',
      items: [
        'Ministries and government agencies',
        'Social protection programs',
        'Migration and citizenship services',
        'National digital platforms',
        'Multi-agency coordination systems'
      ]
    },
    {
      title: 'Compliance',
      items: [
        'GDPR (EU)',
        'NIST 800-53 (US)',
        'ISO/IEC 27001',
        'USAID Digital Strategy',
        'EU Digital Governance Framework'
      ]
    },
    {
      title: 'Implementation',
      content: 'Typical deployment takes 12-16 weeks including integration, testing, training, and go-live support. IVYAR provides end-to-end implementation services.'
    }
  ]
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getScenarioByCountry(countryCode: string): CountryScenario | undefined {
  return COUNTRY_SCENARIOS.find(s => s.countryCode === countryCode);
}

export function getTORSection(sectionId: string): TORSection | undefined {
  return TOR_DOCUMENT.find(s => s.id === sectionId);
}

export function getScenariosByBudget(maxBudget: number): CountryScenario[] {
  return COUNTRY_SCENARIOS.filter(s => {
    const maxBudgetValue = parseInt(s.budget.split(' - ')[1]?.replace(/[$,]/g, '') || '0');
    return maxBudgetValue <= maxBudget;
  });
}

// ============================================================================
// STATISTICS
// ============================================================================

export const DEPLOYMENT_STATS = {
  totalScenarios: COUNTRY_SCENARIOS.length,
  regions: ['Europe', 'CIS', 'Africa'],
  averageTimeline: '14 weeks',
  averageBudget: '$130,000 - $230,000',
  torSections: TOR_DOCUMENT.length,
  complianceStandards: 5
};
