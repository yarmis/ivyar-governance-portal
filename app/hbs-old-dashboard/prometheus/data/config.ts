// HBS Prometheus v9.0 - Platform Configuration

export const Config = {
  version: '9.0',
  codename: 'Prometheus',
  region: 'Eastern Europe & South Caucasus',
  
  standards: {
    IATI: { version: '2.03', compliance: 99.2 },
    HXL: { version: '1.1', compliance: 99.8 },
    OpenAPI: { version: '3.1', compliance: 100 },
    GDPR: { status: 'compliant' },
    ISO27001: { status: 'certified' }
  },

  blockchain: {
    network: 'Ethereum L2 (Optimism)',
    totalTx: '45.2M',
    contracts: 156,
    tps: 4000
  },

  ai: {
    autonomy: 99.4,
    decisions: 52000,
    accuracy: 97.8,
    bias: 0.02,
    explainability: 94.5
  }
};

// Blockchain Data
export const BlockchainData = {
  transactions: [
    { id: 'TX-001', type: 'disbursement', amount: 125000, currency: 'USD', from: 'HBS-Treasury', to: 'UA-Ministry-Health', status: 'confirmed', block: 18234567 },
    { id: 'TX-002', type: 'beneficiary', amount: 450, currency: 'USD', from: 'UA-Program-42', to: 'BEN-00045123', status: 'confirmed', block: 18234568 },
    { id: 'TX-003', type: 'contract', amount: 0, currency: 'USD', from: 'System', to: 'AutoDisburse-Q1', status: 'executed', block: 18234569 },
    { id: 'TX-004', type: 'verification', amount: 0, currency: 'USD', from: 'Validator-Node-EU', to: 'Identity-Registry', status: 'confirmed', block: 18234570 },
    { id: 'TX-005', type: 'disbursement', amount: 89000, currency: 'EUR', from: 'HBS-Treasury', to: 'MD-Ministry-Social', status: 'pending', block: null }
  ],

  identities: {
    total: 9847234,
    verified: 9234567,
    pending: 612667,
    countries: 24,
    biometric: 7823456
  },

  contracts: [
    { name: 'AutoDisburse-Monthly', status: 'active', trigger: 'Day 1 of month', executions: 24 },
    { name: 'EmergencyRelief-Trigger', status: 'armed', trigger: 'Crisis Level > 3', executions: 8 },
    { name: 'BeneficiaryVerification', status: 'active', trigger: 'New registration', executions: 45234 },
    { name: 'AuditTrail-Immutable', status: 'active', trigger: 'Any transaction', executions: 892456 }
  ]
};

// Early Warning System Data
export const EarlyWarningData = {
  alerts: [
    { id: 'EW-001', type: 'humanitarian', icon: '🚨', severity: 'high' as const, region: 'Eastern Ukraine', threat: 'Escalating displacement', confidence: 89, eta: '48-72h' },
    { id: 'EW-002', type: 'climate', icon: '🌡️', severity: 'medium' as const, region: 'Moldova', threat: 'Drought risk Q2', confidence: 76, eta: '30-60 days' },
    { id: 'EW-003', type: 'economic', icon: '📊', severity: 'low' as const, region: 'Georgia', threat: 'Currency pressure', confidence: 65, eta: '90+ days' },
    { id: 'EW-004', type: 'health', icon: '🏥', severity: 'medium' as const, region: 'Poland Border', threat: 'Respiratory illness cluster', confidence: 72, eta: '7-14 days' }
  ],

  risk: {
    overall: 3.2,
    hazard: 2.8,
    vulnerability: 3.5,
    coping: 3.4,
    trend: 'stable'
  },

  sensors: {
    satellite: { count: 12, status: 'active', latency: '15min' },
    iot: { count: 4567, status: 'active', latency: '30sec' },
    social: { count: 45, status: 'active', latency: '5min' },
    news: { count: 6200, status: 'active', latency: '1min' }
  }
};

// AI Models Data
export const AIModelsData = [
  { name: 'ResourceOptimizer-v4', type: 'Predictive', accuracy: 97.8, fairness: 0.98, drift: 0.012, status: 'production' as const, lastRetrain: '2025-12-28' },
  { name: 'BeneficiaryNeeds-v3', type: 'Classification', accuracy: 94.5, fairness: 0.96, drift: 0.008, status: 'production' as const, lastRetrain: '2025-12-30' },
  { name: 'FraudDetection-v2', type: 'Anomaly', accuracy: 99.2, fairness: 0.99, drift: 0.003, status: 'production' as const, lastRetrain: '2026-01-02' },
  { name: 'CrisisPredictor-v1', type: 'TimeSeries', accuracy: 89.4, fairness: 0.95, drift: 0.025, status: 'staging' as const, lastRetrain: '2025-12-15' }
];

export const AIDecisions = {
  today: 52847,
  autonomous: 52534,
  humanReview: 313,
  overridden: 12,
  avgConfidence: 0.94
};

export const FairnessMetrics = {
  demographicParity: 0.98,
  equalizedOdds: 0.97,
  calibration: 0.96,
  individualFairness: 0.95
};

// Countries Data
export const CountriesData = [
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', status: 'active', programs: 52, budget: 3.2, beneficiaries: 4.8, digitalIds: 3.2, blockchainTx: '12.4M', risk: 'high' as const, sync: 99.8 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', status: 'active', programs: 38, budget: 1.5, beneficiaries: 2.1, digitalIds: 1.8, blockchainTx: '5.2M', risk: 'low' as const, sync: 99.9 },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', status: 'active', programs: 28, budget: 0.8, beneficiaries: 0.6, digitalIds: 0.5, blockchainTx: '2.1M', risk: 'medium' as const, sync: 99.7 },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', status: 'active', programs: 24, budget: 0.7, beneficiaries: 0.5, digitalIds: 0.4, blockchainTx: '1.8M', risk: 'low' as const, sync: 99.6 },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', status: 'active', programs: 18, budget: 0.5, beneficiaries: 0.4, digitalIds: 0.3, blockchainTx: '1.2M', risk: 'low' as const, sync: 99.5 },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', status: 'active', programs: 32, budget: 1.1, beneficiaries: 1.2, digitalIds: 1.0, blockchainTx: '3.8M', risk: 'low' as const, sync: 99.8 },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', status: 'warning', programs: 12, budget: 0.3, beneficiaries: 0.2, digitalIds: 0.2, blockchainTx: '0.8M', risk: 'low' as const, sync: 97.8 },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', status: 'active', programs: 18, budget: 0.5, beneficiaries: 0.4, digitalIds: 0.3, blockchainTx: '1.1M', risk: 'low' as const, sync: 99.3 }
];

// Types
export type AlertSeverity = 'high' | 'medium' | 'low';
export type RiskLevel = 'high' | 'medium' | 'low';
export type ModelStatus = 'production' | 'staging' | 'deprecated';

export interface Alert {
  id: string;
  type: string;
  icon: string;
  severity: AlertSeverity;
  region: string;
  threat: string;
  confidence: number;
  eta: string;
}

export interface AIModel {
  name: string;
  type: string;
  accuracy: number;
  fairness: number;
  drift: number;
  status: ModelStatus;
  lastRetrain: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  status: string;
  programs: number;
  budget: number;
  beneficiaries: number;
  digitalIds: number;
  blockchainTx: string;
  risk: RiskLevel;
  sync: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  from: string;
  to: string;
  status: string;
  block: number | null;
}

export interface Contract {
  name: string;
  status: string;
  trigger: string;
  executions: number;
}
