// lib/auth/pricing.ts
// IVYAR Pricing Configuration

export interface PricingPlan {
  id: string;
  name: string;
  nameUk: string;
  price: { monthly: number; annual: number };
  features: string[];
  limits: { users: number; storage: string; apiCalls: number; documents: number };
  recommended?: boolean;
  forRoles: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'free', name: 'Free', nameUk: 'Безкоштовний', price: { monthly: 0, annual: 0 }, features: ['Personal dashboard', 'Up to 100 documents', 'Basic applications', 'Email support'], limits: { users: 1, storage: '1GB', apiCalls: 0, documents: 100 }, forRoles: ['citizen'] },
  { id: 'basic', name: 'Basic', nameUk: 'Базовий', price: { monthly: 19, annual: 190 }, features: ['Everything in Free', 'Company profile', 'Contracts management', 'Payment processing', '1,000 documents', 'Basic API access'], limits: { users: 5, storage: '10GB', apiCalls: 10000, documents: 1000 }, forRoles: ['business'] },
  { id: 'pro', name: 'Pro', nameUk: 'Професійний', price: { monthly: 49, annual: 490 }, features: ['Everything in Basic', 'Employee management', 'HR integrations', 'Bulk applications', '5,000 documents', 'Full API access', 'Priority support'], limits: { users: 25, storage: '50GB', apiCalls: 50000, documents: 5000 }, recommended: true, forRoles: ['business', 'employer'] },
  { id: 'enterprise', name: 'Enterprise', nameUk: 'Корпоративний', price: { monthly: 99, annual: 990 }, features: ['Everything in Pro', 'Client management', 'Digital signatures', 'Legal templates', '10,000 documents', 'Dedicated support', 'Custom integrations', 'SLA guarantee'], limits: { users: 50, storage: '100GB', apiCalls: 100000, documents: 10000 }, forRoles: ['employer', 'attorney'] },
  { id: 'government', name: 'Government', nameUk: 'Державний', price: { monthly: 0, annual: 50000 }, features: ['National dashboard', 'Ministry management', 'Approval workflows', 'Statistics & analytics', 'Unlimited documents', 'Dedicated infrastructure', '24/7 support', 'On-premise option'], limits: { users: 100, storage: '1TB', apiCalls: 1000000, documents: 100000 }, forRoles: ['government'] }
];

export const TRANSACTION_FEES = {
  application: { min: 0.50, max: 3.00, default: 1.00 },
  document: { min: 1.00, max: 5.00, default: 2.00 },
  verification: { min: 0.10, max: 0.50, default: 0.25 },
  signature: { min: 2.00, max: 10.00, default: 5.00 },
  apiCall: { min: 0.01, max: 0.10, default: 0.02 }
};

export const API_TIERS = {
  basic: { calls: 10000, price: 0 },
  standard: { calls: 100000, price: 499 },
  professional: { calls: 500000, price: 999 },
  enterprise: { calls: 2000000, price: 1999 },
  unlimited: { calls: -1, price: 4999 }
};

export const WHITE_LABEL = {
  setup: { min: 250000, max: 2000000 },
  annualSupport: { percentage: 15 },
  includes: ['Full source code license', 'Custom branding', 'Dedicated cloud or on-premise', 'Training & documentation', 'First year support included']
};

export function getPlanForRole(role: string): PricingPlan | null {
  return PRICING_PLANS.find(p => p.forRoles.includes(role)) || null;
}

export function getAnnualDiscount(plan: PricingPlan): number {
  if (plan.price.monthly === 0) return 0;
  return Math.round((1 - plan.price.annual / (plan.price.monthly * 12)) * 100);
}
