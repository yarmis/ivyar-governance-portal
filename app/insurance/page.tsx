'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES & INTERFACES
// ============================================
type InsuranceView = 
  | 'landing' | 'catalog' | 'quote' | 'checkout' | 'customer' 
  | 'claims' | 'claim-details' | 'admin' | 'policy-details';

type InsuranceType = 'health' | 'travel' | 'auto' | 'property' | 'business';
type PolicyStatus = 'active' | 'pending' | 'expired' | 'cancelled';
type ClaimStatus = 'filed' | 'under_review' | 'info_requested' | 'approved' | 'rejected' | 'paid';

interface InsuranceProduct {
  id: string;
  type: InsuranceType;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  color: string;
  baseRate: number;
  coverageOptions: { id: string; name: string; multiplier: number }[];
  features: string[];
  exclusions: string[];
  popular: boolean;
  aiRecommended: boolean;
}

interface Quote {
  id: string;
  productId: string;
  productName: string;
  productType: InsuranceType;
  coverageAmount: number;
  durationMonths: number;
  basePremium: number;
  aiPremium: number;
  currency: string;
  rationale: string;
  riskFactors: { factor: string; impact: string; weight: number }[];
  createdAt: string;
}

interface Policy {
  id: string;
  policyNumber: string;
  productId: string;
  productName: string;
  productType: InsuranceType;
  customerId: string;
  premium: number;
  coverageAmount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  paymentFrequency: 'monthly' | 'quarterly' | 'annual';
  nextPaymentDate: string;
  documents: { name: string; url: string }[];
  createdAt: string;
}

interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  productType: InsuranceType;
  type: string;
  description: string;
  status: ClaimStatus;
  amountRequested: number;
  amountApproved: number | null;
  currency: string;
  documents: { name: string; type: string; uploadedAt: string }[];
  timeline: { timestamp: string; event: string; actor: string }[];
  aiRiskScore: number;
  aiRecommendation: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: { street: string; city: string; state: string; country: string; zip: string };
  kycVerified: boolean;
  totalPolicies: number;
  totalClaims: number;
  lifetimeValue: number;
  riskScore: number;
  joinedAt: string;
}

// ============================================
// MOCK DATA
// ============================================
const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    id: 'prod-health-001',
    type: 'health',
    name: 'Health Shield Pro',
    shortDescription: 'Comprehensive health coverage for individuals and families',
    description: 'Complete medical coverage including hospitalization, outpatient care, prescription drugs, dental, and vision. 24/7 telemedicine access included.',
    icon: '🏥',
    color: '#3CCB7F',
    baseRate: 89,
    coverageOptions: [
      { id: 'basic', name: 'Basic ($50K)', multiplier: 1 },
      { id: 'standard', name: 'Standard ($100K)', multiplier: 1.8 },
      { id: 'premium', name: 'Premium ($250K)', multiplier: 3.2 },
      { id: 'platinum', name: 'Platinum ($500K)', multiplier: 5.5 },
    ],
    features: ['Hospitalization', 'Outpatient care', 'Prescription drugs', 'Dental & Vision', '24/7 Telemedicine', 'Mental health coverage'],
    exclusions: ['Pre-existing conditions (first 12 months)', 'Cosmetic surgery', 'Experimental treatments'],
    popular: true,
    aiRecommended: true,
  },
  {
    id: 'prod-travel-001',
    type: 'travel',
    name: 'Global Traveler',
    shortDescription: 'Worldwide coverage for business and leisure travel',
    description: 'Protect your trips with medical emergency coverage, trip cancellation, lost baggage, and 24/7 assistance worldwide.',
    icon: '✈️',
    color: '#00A3FF',
    baseRate: 12,
    coverageOptions: [
      { id: 'basic', name: 'Basic ($25K)', multiplier: 1 },
      { id: 'standard', name: 'Standard ($50K)', multiplier: 1.6 },
      { id: 'premium', name: 'Premium ($100K)', multiplier: 2.5 },
    ],
    features: ['Medical emergencies abroad', 'Trip cancellation', 'Lost/delayed baggage', 'Flight delay coverage', '24/7 assistance', 'Emergency evacuation'],
    exclusions: ['Extreme sports (unless added)', 'Travel to sanctioned countries', 'Pre-existing conditions'],
    popular: true,
    aiRecommended: false,
  },
  {
    id: 'prod-auto-001',
    type: 'auto',
    name: 'Auto Protect Plus',
    shortDescription: 'Comprehensive vehicle insurance with roadside assistance',
    description: 'Full coverage for your vehicle including collision, comprehensive, liability, and 24/7 roadside assistance.',
    icon: '🚗',
    color: '#F59E0B',
    baseRate: 65,
    coverageOptions: [
      { id: 'liability', name: 'Liability Only', multiplier: 0.6 },
      { id: 'basic', name: 'Basic ($50K)', multiplier: 1 },
      { id: 'full', name: 'Full Coverage ($100K)', multiplier: 1.8 },
      { id: 'premium', name: 'Premium ($250K)', multiplier: 2.8 },
    ],
    features: ['Collision coverage', 'Comprehensive coverage', 'Liability protection', 'Roadside assistance', 'Rental car coverage', 'Uninsured motorist'],
    exclusions: ['Racing or competition', 'Commercial use (unless declared)', 'Intentional damage'],
    popular: false,
    aiRecommended: false,
  },
  {
    id: 'prod-property-001',
    type: 'property',
    name: 'Home Guardian',
    shortDescription: 'Protect your home and belongings',
    description: 'Complete protection for your home including structure, contents, liability, and additional living expenses.',
    icon: '🏠',
    color: '#A371F7',
    baseRate: 45,
    coverageOptions: [
      { id: 'basic', name: 'Basic ($100K)', multiplier: 1 },
      { id: 'standard', name: 'Standard ($250K)', multiplier: 2 },
      { id: 'premium', name: 'Premium ($500K)', multiplier: 3.5 },
      { id: 'luxury', name: 'Luxury ($1M)', multiplier: 6 },
    ],
    features: ['Dwelling coverage', 'Personal property', 'Liability protection', 'Additional living expenses', 'Natural disaster coverage', 'Theft protection'],
    exclusions: ['Flood (separate policy)', 'Earthquake (separate policy)', 'Wear and tear'],
    popular: false,
    aiRecommended: true,
  },
  {
    id: 'prod-business-001',
    type: 'business',
    name: 'Business Shield',
    shortDescription: 'Comprehensive coverage for your business',
    description: 'Protect your business with general liability, property, professional liability, and cyber coverage.',
    icon: '🏢',
    color: '#F85149',
    baseRate: 150,
    coverageOptions: [
      { id: 'starter', name: 'Starter ($100K)', multiplier: 1 },
      { id: 'growth', name: 'Growth ($500K)', multiplier: 3.5 },
      { id: 'enterprise', name: 'Enterprise ($1M)', multiplier: 6 },
      { id: 'corporate', name: 'Corporate ($5M)', multiplier: 15 },
    ],
    features: ['General liability', 'Property coverage', 'Professional liability', 'Cyber liability', 'Business interruption', 'Workers compensation'],
    exclusions: ['Intentional acts', 'Criminal activity', 'Nuclear/war events'],
    popular: false,
    aiRecommended: false,
  },
];

const SAMPLE_POLICIES: Policy[] = [
  {
    id: 'pol-001',
    policyNumber: 'POL-2025-HLT-00001',
    productId: 'prod-health-001',
    productName: 'Health Shield Pro',
    productType: 'health',
    customerId: 'cust-001',
    premium: 267,
    coverageAmount: 100000,
    currency: 'USD',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    status: 'active',
    paymentFrequency: 'monthly',
    nextPaymentDate: '2026-02-01',
    documents: [
      { name: 'Policy Document', url: '/docs/pol-001.pdf' },
      { name: 'Terms & Conditions', url: '/docs/terms.pdf' },
    ],
    createdAt: '2025-05-28',
  },
  {
    id: 'pol-002',
    policyNumber: 'POL-2025-TRV-00042',
    productId: 'prod-travel-001',
    productName: 'Global Traveler',
    productType: 'travel',
    customerId: 'cust-001',
    premium: 48,
    coverageAmount: 50000,
    currency: 'USD',
    startDate: '2026-01-15',
    endDate: '2026-01-30',
    status: 'active',
    paymentFrequency: 'annual',
    nextPaymentDate: '2026-01-15',
    documents: [
      { name: 'Policy Document', url: '/docs/pol-002.pdf' },
    ],
    createdAt: '2026-01-05',
  },
  {
    id: 'pol-003',
    policyNumber: 'POL-2024-AUT-00156',
    productId: 'prod-auto-001',
    productName: 'Auto Protect Plus',
    productType: 'auto',
    customerId: 'cust-001',
    premium: 117,
    coverageAmount: 100000,
    currency: 'USD',
    startDate: '2024-08-15',
    endDate: '2025-08-14',
    status: 'expired',
    paymentFrequency: 'monthly',
    nextPaymentDate: '',
    documents: [],
    createdAt: '2024-08-10',
  },
];

const SAMPLE_CLAIMS: Claim[] = [
  {
    id: 'clm-001',
    claimNumber: 'CLM-2026-00001',
    policyId: 'pol-001',
    policyNumber: 'POL-2025-HLT-00001',
    productType: 'health',
    type: 'Medical Expense',
    description: 'Emergency room visit and overnight hospitalization due to appendicitis.',
    status: 'approved',
    amountRequested: 8500,
    amountApproved: 8200,
    currency: 'USD',
    documents: [
      { name: 'Hospital Invoice', type: 'invoice', uploadedAt: '2026-01-02' },
      { name: 'Discharge Summary', type: 'medical', uploadedAt: '2026-01-02' },
    ],
    timeline: [
      { timestamp: '2026-01-02 09:15:00', event: 'Claim filed', actor: 'Customer' },
      { timestamp: '2026-01-02 10:30:00', event: 'Documents verified', actor: 'System' },
      { timestamp: '2026-01-03 14:00:00', event: 'Under review', actor: 'Claims Team' },
      { timestamp: '2026-01-04 11:00:00', event: 'Approved - $8,200', actor: 'Claims Manager' },
      { timestamp: '2026-01-05 09:00:00', event: 'Payment initiated', actor: 'System' },
    ],
    aiRiskScore: 12,
    aiRecommendation: 'Approve - Low risk, verified hospital, consistent with coverage.',
    createdAt: '2026-01-02',
    updatedAt: '2026-01-05',
  },
  {
    id: 'clm-002',
    claimNumber: 'CLM-2026-00002',
    policyId: 'pol-002',
    policyNumber: 'POL-2025-TRV-00042',
    productType: 'travel',
    type: 'Trip Cancellation',
    description: 'Flight cancelled due to severe weather. Requesting refund for non-refundable hotel booking.',
    status: 'under_review',
    amountRequested: 1200,
    amountApproved: null,
    currency: 'USD',
    documents: [
      { name: 'Flight Cancellation Notice', type: 'proof', uploadedAt: '2026-01-05' },
      { name: 'Hotel Booking Receipt', type: 'receipt', uploadedAt: '2026-01-05' },
    ],
    timeline: [
      { timestamp: '2026-01-05 14:30:00', event: 'Claim filed', actor: 'Customer' },
      { timestamp: '2026-01-05 14:35:00', event: 'Documents received', actor: 'System' },
      { timestamp: '2026-01-05 16:00:00', event: 'Assigned to reviewer', actor: 'System' },
    ],
    aiRiskScore: 8,
    aiRecommendation: 'Likely approve - Weather event verified, documentation complete.',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
  },
];

const CLAIM_STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; icon: string }> = {
  filed: { label: 'Filed', color: '#8B949E', icon: '📝' },
  under_review: { label: 'Under Review', color: '#00A3FF', icon: '🔍' },
  info_requested: { label: 'Info Requested', color: '#F59E0B', icon: '📋' },
  approved: { label: 'Approved', color: '#3CCB7F', icon: '✓' },
  rejected: { label: 'Rejected', color: '#F85149', icon: '✗' },
  paid: { label: 'Paid', color: '#3CCB7F', icon: '💰' },
};

const POLICY_STATUS_CONFIG: Record<PolicyStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: '#3CCB7F' },
  pending: { label: 'Pending', color: '#F59E0B' },
  expired: { label: 'Expired', color: '#8B949E' },
  cancelled: { label: 'Cancelled', color: '#F85149' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function InsuranceModulePage() {
  const [currentView, setCurrentView] = useState<InsuranceView>('landing');
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');

  const handleGetQuote = (product: InsuranceProduct) => {
    setSelectedProduct(product);
    setCurrentView('quote');
  };

  const handleQuoteGenerated = (quote: Quote) => {
    setCurrentQuote(quote);
    setCurrentView('checkout');
  };

  const handleViewPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setCurrentView('policy-details');
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setCurrentView('claim-details');
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3CCB7F] via-[#00A3FF] to-[#A371F7] rounded-xl flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>
              <div>
                <div className="font-bold">IVYAR Insurance</div>
                <div className="text-xs text-[#6E7681]">Independent Coverage v1.0</div>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { id: 'landing', label: 'Home', icon: '🏠' },
              { id: 'catalog', label: 'Products', icon: '📋' },
              { id: 'customer', label: 'My Policies', icon: '📁' },
              { id: 'claims', label: 'Claims', icon: '📝' },
              ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : []),
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as InsuranceView)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id || (item.id === 'catalog' && currentView === 'quote')
                    ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as 'customer' | 'admin')}
              className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="customer">👤 Customer</option>
              <option value="admin">👑 Admin</option>
            </select>
            <div className="w-9 h-9 bg-gradient-to-br from-[#3CCB7F] to-[#00A3FF] rounded-full flex items-center justify-center text-sm font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {currentView === 'landing' && (
          <LandingPage onGetQuote={() => setCurrentView('catalog')} />
        )}
        {currentView === 'catalog' && (
          <CatalogPage products={INSURANCE_PRODUCTS} onGetQuote={handleGetQuote} />
        )}
        {currentView === 'quote' && selectedProduct && (
          <QuotePage 
            product={selectedProduct} 
            onQuoteGenerated={handleQuoteGenerated}
            onBack={() => setCurrentView('catalog')}
          />
        )}
        {currentView === 'checkout' && currentQuote && (
          <CheckoutPage 
            quote={currentQuote}
            onSuccess={() => setCurrentView('customer')}
            onBack={() => setCurrentView('quote')}
          />
        )}
        {currentView === 'customer' && (
          <CustomerPortalPage 
            policies={SAMPLE_POLICIES}
            claims={SAMPLE_CLAIMS}
            onViewPolicy={handleViewPolicy}
            onViewClaim={handleViewClaim}
            onFileClaim={() => setCurrentView('claims')}
          />
        )}
        {currentView === 'policy-details' && selectedPolicy && (
          <PolicyDetailsPage 
            policy={selectedPolicy}
            onBack={() => setCurrentView('customer')}
            onFileClaim={() => setCurrentView('claims')}
          />
        )}
        {currentView === 'claims' && (
          <ClaimsCenterPage 
            claims={SAMPLE_CLAIMS}
            policies={SAMPLE_POLICIES}
            onViewClaim={handleViewClaim}
          />
        )}
        {currentView === 'claim-details' && selectedClaim && (
          <ClaimDetailsPage 
            claim={selectedClaim}
            onBack={() => setCurrentView('claims')}
          />
        )}
        {currentView === 'admin' && (
          <AdminPortalPage 
            products={INSURANCE_PRODUCTS}
            policies={SAMPLE_POLICIES}
            claims={SAMPLE_CLAIMS}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-8 mt-12">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#6E7681]">
              © 2024-2026 IVYAR. All rights reserved.
            </div>
            <div className="flex gap-4 text-xs text-[#6E7681]">
              <span className="bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">GDPR Ready</span>
              <span className="bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded">SOC 2</span>
              <span className="bg-[#A371F7]/20 text-[#A371F7] px-2 py-1 rounded">ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// 01. LANDING PAGE
// ============================================
function LandingPage({ onGetQuote }: { onGetQuote: () => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3CCB7F]/10 via-[#00A3FF]/10 to-[#A371F7]/10"></div>
        <div className="max-w-[1440px] mx-auto px-8 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Insurance Made <span className="text-[#3CCB7F]">Simple</span>
            </h1>
            <p className="text-xl text-[#8B949E] mb-8">
              Get comprehensive coverage for health, travel, auto, property, and business. 
              AI-powered pricing ensures you get the best rates.
            </p>
            <button 
              onClick={onGetQuote}
              className="bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-[#3CCB7F]/30 transition-all"
            >
              Get a Free Quote →
            </button>
          </div>
        </div>
      </section>

      {/* Product Types Grid */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Insurance Products</h2>
          <div className="grid grid-cols-5 gap-4">
            {INSURANCE_PRODUCTS.map((product) => (
              <div 
                key={product.id}
                onClick={() => alert(`${product.icon} ${product.name}\n\nStarting from $${product.baseRate}/month\n\n${product.shortDescription}\n\nFeatures:\n${product.features.slice(0, 3).join('\n')}\n\nClick to get instant AI-powered quote!`)}
                className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center hover:border-[#3CCB7F]/50 transition-all cursor-pointer"
              >
                <span className="text-4xl">{product.icon}</span>
                <div className="font-semibold mt-3">{product.name.split(' ')[0]}</div>
                <div className="text-xs text-[#8B949E] mt-1">From ${product.baseRate}/mo</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose IVYAR Insurance?</h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: '🧠', title: 'AI-Powered Pricing', desc: 'Get personalized rates based on your profile' },
              { icon: '⚡', title: 'Instant Quotes', desc: 'Get coverage quotes in under 60 seconds' },
              { icon: '📱', title: 'Easy Claims', desc: 'File and track claims from your portal' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
            ].map((benefit, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
                <span className="text-3xl">{benefit.icon}</span>
                <div className="font-semibold mt-3">{benefit.title}</div>
                <div className="text-sm text-[#8B949E] mt-2">{benefit.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="flex items-center justify-center gap-8">
            {[
              { step: '1', title: 'Choose Coverage', desc: 'Select the insurance type you need' },
              { step: '2', title: 'Get Quote', desc: 'Answer a few questions for AI pricing' },
              { step: '3', title: 'Purchase Policy', desc: 'Review and complete your purchase' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center max-w-[200px]">
                  <div className="w-12 h-12 bg-[#3CCB7F] rounded-full flex items-center justify-center text-xl font-bold text-[#0D1117]">
                    {step.step}
                  </div>
                  <div className="font-semibold mt-3">{step.title}</div>
                  <div className="text-sm text-[#8B949E] mt-1">{step.desc}</div>
                </div>
                {i < 2 && <div className="text-[#3CCB7F] text-2xl">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// 02. CATALOG PAGE
// ============================================
function CatalogPage({ 
  products, 
  onGetQuote 
}: { 
  products: InsuranceProduct[];
  onGetQuote: (product: InsuranceProduct) => void;
}) {
  const [filterType, setFilterType] = useState<InsuranceType | 'all'>('all');
  
  const filteredProducts = filterType === 'all' 
    ? products 
    : products.filter(p => p.type === filterType);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Insurance Products</h1>
      <p className="text-[#8B949E] mb-8">Choose the coverage that fits your needs</p>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {['all', 'health', 'travel', 'auto', 'property', 'business'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type as InsuranceType | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === type
                ? 'bg-[#3CCB7F] text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#3CCB7F]/50 transition-all"
          >
            <div className="h-2" style={{ backgroundColor: product.color }}></div>
            <div className="p-6">
              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {product.popular && (
                  <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded">⭐ Popular</span>
                )}
                {product.aiRecommended && (
                  <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-2 py-0.5 rounded">🧠 AI Pick</span>
                )}
              </div>

              <div className="flex items-start gap-4">
                <span className="text-4xl">{product.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-[#8B949E] mt-1">{product.shortDescription}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 space-y-1">
                {product.features.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#8B949E]">
                    <span className="text-[#3CCB7F]">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="mt-6 pt-4 border-t border-[#1F242C] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#6E7681]">Starting from</div>
                  <div className="text-xl font-bold" style={{ color: product.color }}>
                    ${product.baseRate}<span className="text-sm text-[#8B949E] font-normal">/mo</span>
                  </div>
                </div>
                <button 
                  onClick={() => onGetQuote(product)}
                  className="bg-[#3CCB7F] text-[#0D1117] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#3CCB7F]/90 transition-colors"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 03. QUOTE PAGE
// ============================================
function QuotePage({ 
  product, 
  onQuoteGenerated,
  onBack 
}: { 
  product: InsuranceProduct;
  onQuoteGenerated: (quote: Quote) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 35,
    region: 'US',
    coverageOption: product.coverageOptions[1].id,
    duration: 12,
  });
  const [quote, setQuote] = useState<Quote | null>(null);

  const calculateQuote = () => {
    const coverage = product.coverageOptions.find(c => c.id === formData.coverageOption)!;
    const basePremium = product.baseRate * coverage.multiplier;
    
    // AI adjustment factors
    const ageAdjustment = formData.age > 50 ? 1.3 : formData.age > 35 ? 1.1 : 1.0;
    const durationDiscount = formData.duration === 12 ? 0.9 : 1.0;
    
    const aiPremium = Math.round(basePremium * ageAdjustment * durationDiscount * 0.95);

    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productType: product.type,
      coverageAmount: parseInt(coverage.name.match(/\$[\d,]+K?M?/)?.[0].replace(/[$,KM]/g, '') || '0') * 1000,
      durationMonths: formData.duration,
      basePremium,
      aiPremium,
      currency: 'USD',
      rationale: `AI pricing considers your age (${formData.age}), region (${formData.region}), and selected duration. Annual commitment qualifies for 10% discount.`,
      riskFactors: [
        { factor: 'Age', impact: ageAdjustment > 1.1 ? 'Higher' : 'Standard', weight: ageAdjustment },
        { factor: 'Duration', impact: formData.duration === 12 ? 'Discount' : 'Standard', weight: durationDiscount },
        { factor: 'AI Optimization', impact: 'Savings', weight: 0.95 },
      ],
      createdAt: new Date().toISOString(),
    };

    setQuote(newQuote);
    setStep(3);
  };

  return (
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Products
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#1F242C] flex items-center gap-4">
          <span className="text-4xl">{product.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-[#8B949E]">Get your personalized quote</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 bg-[#0D1117] border-b border-[#1F242C]">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Your Details' },
              { num: 2, label: 'Coverage' },
              { num: 3, label: 'Your Price' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s.num ? 'bg-[#3CCB7F] text-[#0D1117]' : 'bg-[#1F242C] text-[#8B949E]'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={step >= s.num ? 'text-white' : 'text-[#8B949E]'}>{s.label}</span>
                </div>
                {i < 2 && <div className={`w-24 h-0.5 ${step > s.num ? 'bg-[#3CCB7F]' : 'bg-[#1F242C]'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Your Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                >
                  <option value="US">United States</option>
                  <option value="EU">European Union</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#3CCB7F] text-[#0D1117] py-3 rounded-lg font-semibold"
              >
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Coverage Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {product.coverageOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({ ...formData, coverageOption: option.id })}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        formData.coverageOption === option.id
                          ? 'border-[#3CCB7F] bg-[#3CCB7F]/10'
                          : 'border-[#1F242C] hover:border-[#3D444D]'
                      }`}
                    >
                      <div className="font-semibold">{option.name}</div>
                      <div className="text-sm text-[#8B949E]">${Math.round(product.baseRate * option.multiplier)}/mo</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Duration</label>
                <div className="flex gap-3">
                  {[
                    { months: 1, label: '1 Month' },
                    { months: 6, label: '6 Months' },
                    { months: 12, label: '12 Months', badge: '-10%' },
                  ].map((d) => (
                    <button
                      key={d.months}
                      onClick={() => setFormData({ ...formData, duration: d.months })}
                      className={`flex-1 p-4 rounded-lg border transition-colors relative ${
                        formData.duration === d.months
                          ? 'border-[#3CCB7F] bg-[#3CCB7F]/10'
                          : 'border-[#1F242C] hover:border-[#3D444D]'
                      }`}
                    >
                      {d.badge && (
                        <span className="absolute -top-2 -right-2 text-xs bg-[#3CCB7F] text-[#0D1117] px-2 py-0.5 rounded-full">
                          {d.badge}
                        </span>
                      )}
                      <div className="font-semibold">{d.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-[#1F242C] py-3 rounded-lg"
                >
                  ← Back
                </button>
                <button
                  onClick={calculateQuote}
                  className="flex-1 bg-[#3CCB7F] text-[#0D1117] py-3 rounded-lg font-semibold"
                >
                  Get Quote →
                </button>
              </div>
            </div>
          )}

          {step === 3 && quote && (
            <div className="space-y-6">
              {/* Price Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl p-6 text-center">
                  <div className="text-sm text-[#8B949E]">Base Price</div>
                  <div className="text-2xl font-bold text-[#8B949E] line-through mt-1">
                    ${quote.basePremium}/mo
                  </div>
                </div>
                <div className="bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 rounded-xl p-6 text-center">
                  <div className="text-sm text-[#3CCB7F] flex items-center justify-center gap-1">
                    <span>🧠</span> AI-Optimized Price
                  </div>
                  <div className="text-3xl font-bold text-[#3CCB7F] mt-1">
                    ${quote.aiPremium}/mo
                  </div>
                  <div className="text-xs text-[#8B949E] mt-1">
                    You save ${quote.basePremium - quote.aiPremium}/mo
                  </div>
                </div>
              </div>

              {/* AI Rationale */}
              <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl p-4">
                <div className="text-sm text-[#A371F7] mb-2 flex items-center gap-2">
                  <span>🧠</span> AI Pricing Rationale
                </div>
                <p className="text-sm text-[#8B949E]">{quote.rationale}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-[#1F242C] py-3 rounded-lg"
                >
                  ← Modify
                </button>
                <button
                  onClick={() => onQuoteGenerated(quote)}
                  className="flex-1 bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white py-3 rounded-lg font-semibold"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 04. CHECKOUT PAGE
// ============================================
function CheckoutPage({ 
  quote, 
  onSuccess,
  onBack 
}: { 
  quote: Quote;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePurchase = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Quote
      </button>

      <div className="grid grid-cols-[1fr_400px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8B949E] mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
            <div className="bg-[#0D1117] rounded-lg p-4 h-32 overflow-y-auto text-sm text-[#8B949E] mb-4">
              By purchasing this policy, you agree to the terms and conditions of IVYAR Insurance. 
              Coverage begins on the start date specified. Pre-existing conditions may have waiting periods.
              Claims are subject to review and approval...
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">I have read and agree to the Terms & Conditions</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Product</span>
              <span>{quote.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Coverage</span>
              <span>${quote.coverageAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Duration</span>
              <span>{quote.durationMonths} months</span>
            </div>
            <div className="border-t border-[#1F242C] my-3"></div>
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Monthly Premium</span>
              <span className="font-bold text-[#3CCB7F]">${quote.aiPremium}/mo</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Due Today</span>
              <span className="text-[#3CCB7F]">${quote.aiPremium}</span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={!agreed || processing}
            className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all ${
              agreed && !processing
                ? 'bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white'
                : 'bg-[#1F242C] text-[#6E7681] cursor-not-allowed'
            }`}
          >
            {processing ? 'Processing...' : 'Complete Purchase'}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#6E7681]">
            <span>🔒</span>
            <span>Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 05. CUSTOMER PORTAL PAGE
// ============================================
function CustomerPortalPage({ 
  policies,
  claims,
  onViewPolicy,
  onViewClaim,
  onFileClaim,
}: { 
  policies: Policy[];
  claims: Claim[];
  onViewPolicy: (policy: Policy) => void;
  onViewClaim: (claim: Claim) => void;
  onFileClaim: () => void;
}) {
  const activePolicies = policies.filter(p => p.status === 'active');
  const expiringSoon = policies.filter(p => {
    const endDate = new Date(p.endDate);
    const daysUntil = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return p.status === 'active' && daysUntil <= 30 && daysUntil > 0;
  });
  
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Insurance Portal</h1>
          <p className="text-[#8B949E]">Welcome back, John</p>
        </div>
        <button
          onClick={onFileClaim}
          className="bg-[#3CCB7F] text-[#0D1117] px-4 py-2 rounded-lg font-semibold"
        >
          + File a Claim
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Policies', value: activePolicies.length, icon: '📋', color: '#3CCB7F' },
          { label: 'Total Coverage', value: `$${(policies.reduce((sum, p) => sum + p.coverageAmount, 0) / 1000).toFixed(0)}K`, icon: '🛡️', color: '#00A3FF' },
          { label: 'Open Claims', value: claims.filter(c => !['paid', 'rejected'].includes(c.status)).length, icon: '📝', color: '#F59E0B' },
          { label: 'Monthly Premium', value: `$${policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.premium, 0)}`, icon: '💰', color: '#A371F7' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Expiring Soon Alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-semibold text-[#F59E0B]">Policy Expiring Soon</div>
              <div className="text-sm text-[#8B949E]">{expiringSoon[0].productName} expires on {expiringSoon[0].endDate}</div>
            </div>
          </div>
          <button onClick={() => setShowRenewalModal(true)} className="bg-[#F59E0B] text-[#0D1117] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FBBF24] transition-colors">
            Renew Now
          </button>
        </div>
      )}

      {/* Active Policies */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-[#1F242C]">
          <h2 className="font-semibold">My Policies</h2>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {policies.map((policy) => {
            const statusConfig = POLICY_STATUS_CONFIG[policy.status];
            return (
              <div 
                key={policy.id}
                onClick={() => onViewPolicy(policy)}
                className="p-4 flex items-center justify-between hover:bg-[#1F242C]/30 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">
                    {INSURANCE_PRODUCTS.find(p => p.id === policy.productId)?.icon || '📋'}
                  </span>
                  <div>
                    <div className="font-medium">{policy.productName}</div>
                    <div className="text-sm text-[#6E7681]">{policy.policyNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">${policy.premium}/mo</div>
                  <span 
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
          <h2 className="font-semibold">Recent Claims</h2>
          <button onClick={onFileClaim} className="text-[#3CCB7F] text-sm hover:underline">
            View All →
          </button>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {claims.slice(0, 3).map((claim) => {
            const statusConfig = CLAIM_STATUS_CONFIG[claim.status];
            return (
              <div 
                key={claim.id}
                onClick={() => onViewClaim(claim)}
                className="p-4 flex items-center justify-between hover:bg-[#1F242C]/30 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{statusConfig.icon}</span>
                  <div>
                    <div className="font-medium">{claim.type}</div>
                    <div className="text-sm text-[#6E7681]">{claim.claimNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">${claim.amountRequested.toLocaleString()}</div>
                  <span 
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                  >
                    {statusConfig.label}
                  </span>
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
// 06. POLICY DETAILS PAGE
// ============================================
function PolicyDetailsPage({ 
  policy,
  onBack,
  onFileClaim,
}: { 
  policy: Policy;
  onBack: () => void;
  onFileClaim: () => void;
}) {
  const product = INSURANCE_PRODUCTS.find(p => p.id === policy.productId);
  const statusConfig = POLICY_STATUS_CONFIG[policy.status];

  return (
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Policies
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="h-2" style={{ backgroundColor: product?.color || '#3CCB7F' }}></div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{product?.icon}</span>
              <div>
                <h1 className="text-2xl font-bold">{policy.productName}</h1>
                <div className="text-sm text-[#6E7681] font-mono">{policy.policyNumber}</div>
              </div>
            </div>
            <span 
              className="px-3 py-1 rounded-lg text-sm font-medium"
              style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
            >
              {statusConfig.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-sm text-[#8B949E]">Coverage Amount</div>
              <div className="text-2xl font-bold text-[#3CCB7F]">${policy.coverageAmount.toLocaleString()}</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-sm text-[#8B949E]">Monthly Premium</div>
              <div className="text-2xl font-bold">${policy.premium}/mo</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-sm text-[#8B949E]">Coverage Period</div>
              <div className="font-medium">{policy.startDate} — {policy.endDate}</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-sm text-[#8B949E]">Next Payment</div>
              <div className="font-medium">{policy.nextPaymentDate || 'N/A'}</div>
            </div>
          </div>

          {/* Documents */}
          <div className="border-t border-[#1F242C] pt-6 mb-6">
            <h3 className="font-semibold mb-3">Documents</h3>
            <div className="space-y-2">
              {policy.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span>{doc.name}</span>
                  </div>
                  <button className="text-[#00A3FF] text-sm hover:underline">Download</button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onFileClaim}
              className="flex-1 bg-[#3CCB7F] text-[#0D1117] py-3 rounded-lg font-semibold"
            >
              File a Claim
            </button>
            <button className="flex-1 bg-[#1F242C] py-3 rounded-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 07. CLAIMS CENTER PAGE
// ============================================
function ClaimsCenterPage({ 
  claims,
  policies,
  onViewClaim,
}: { 
  claims: Claim[];
  policies: Policy[];
  onViewClaim: (claim: Claim) => void;
}) {
  const [showNewClaimForm, setShowNewClaimForm] = useState(false);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Claims Center</h1>
          <p className="text-[#8B949E]">File and track your insurance claims</p>
        </div>
        <button
          onClick={() => setShowNewClaimForm(true)}
          className="bg-[#3CCB7F] text-[#0D1117] px-4 py-2 rounded-lg font-semibold"
        >
          + File New Claim
        </button>
      </div>

      {/* Claims List */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Claim #</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Policy</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">AI Risk</th>
                <th className="text-left p-4">Filed</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => {
                const statusConfig = CLAIM_STATUS_CONFIG[claim.status];
                return (
                  <tr key={claim.id} className="border-b border-[#1F242C] hover:bg-[#1F242C]/30">
                    <td className="p-4 font-mono">{claim.claimNumber}</td>
                    <td className="p-4">{claim.type}</td>
                    <td className="p-4 text-[#8B949E]">{claim.policyNumber}</td>
                    <td className="p-4 text-right font-mono">${claim.amountRequested.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span 
                        className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                        style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        claim.aiRiskScore < 30 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                        claim.aiRiskScore < 60 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#F85149]/20 text-[#F85149]'
                      }`}>
                        {claim.aiRiskScore}%
                      </span>
                    </td>
                    <td className="p-4 text-[#8B949E]">{claim.createdAt}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onViewClaim(claim)}
                        className="text-[#00A3FF] hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 08. CLAIM DETAILS PAGE
// ============================================
function ClaimDetailsPage({ 
  claim,
  onBack,
}: { 
  claim: Claim;
  onBack: () => void;
}) {
  const statusConfig = CLAIM_STATUS_CONFIG[claim.status];

  return (
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Claims
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1F242C]">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{claim.type}</h1>
              <div className="text-sm text-[#6E7681] font-mono">{claim.claimNumber}</div>
            </div>
            <span 
              className="px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
              style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
            >
              {statusConfig.icon} {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-sm text-[#8B949E]">Amount Requested</div>
              <div className="text-2xl font-bold">${claim.amountRequested.toLocaleString()}</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-sm text-[#8B949E]">Amount Approved</div>
              <div className="text-2xl font-bold text-[#3CCB7F]">
                {claim.amountApproved !== null ? `$${claim.amountApproved.toLocaleString()}` : 'Pending'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#0D1117] rounded-xl p-4 mb-6">
            <div className="text-sm text-[#8B949E] mb-2">Description</div>
            <p>{claim.description}</p>
          </div>

          {/* AI Insight */}
          <div className="bg-[#A371F7]/10 border border-[#A371F7]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-[#A371F7] mb-2">
              <span>🧠</span>
              <span className="font-semibold">AI Analysis</span>
              <span className="text-xs bg-[#A371F7]/20 px-2 py-0.5 rounded">Risk: {claim.aiRiskScore}%</span>
            </div>
            <p className="text-sm text-[#8B949E]">{claim.aiRecommendation}</p>
          </div>

          {/* Timeline */}
          <div className="border-t border-[#1F242C] pt-6 mb-6">
            <h3 className="font-semibold mb-4">Timeline</h3>
            <div className="space-y-4">
              {claim.timeline.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 bg-[#3CCB7F] rounded-full"></div>
                  <div>
                    <div className="font-medium">{event.event}</div>
                    <div className="text-sm text-[#6E7681]">{event.timestamp} • {event.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="border-t border-[#1F242C] pt-6">
            <h3 className="font-semibold mb-3">Documents</h3>
            <div className="space-y-2">
              {claim.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0D1117] rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span>{doc.name}</span>
                    <span className="text-xs text-[#6E7681]">{doc.type}</span>
                  </div>
                  <button className="text-[#00A3FF] text-sm hover:underline">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 09. ADMIN PORTAL PAGE
// ============================================
function AdminPortalPage({ 
  products,
  policies,
  claims,
}: { 
  products: InsuranceProduct[];
  policies: Policy[];
  claims: Claim[];
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'claims' | 'compliance'>('overview');

  const pendingClaims = claims.filter(c => c.status === 'under_review' || c.status === 'filed');
  const totalPremiums = policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.premium, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
      <p className="text-[#8B949E] mb-8">Insurance management dashboard</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'products', label: 'Products', icon: '📋' },
          { id: 'claims', label: 'Claims Queue', icon: '📝' },
          { id: 'compliance', label: 'Compliance', icon: '🛡️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#3CCB7F] text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Active Policies', value: policies.filter(p => p.status === 'active').length, icon: '📋', color: '#3CCB7F' },
              { label: 'Monthly Premium', value: `$${totalPremiums.toLocaleString()}`, icon: '💰', color: '#00A3FF' },
              { label: 'Pending Claims', value: pendingClaims.length, icon: '📝', color: '#F59E0B' },
              { label: 'Claims Paid (MTD)', value: `$${claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.amountApproved || 0), 0).toLocaleString()}`, icon: '💳', color: '#A371F7' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
                <span className="text-2xl">{stat.icon}</span>
                <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Products Performance */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Products Performance</h3>
            <div className="space-y-3">
              {products.map((product) => {
                const productPolicies = policies.filter(p => p.productId === product.id);
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.icon}</span>
                      <span>{product.name}</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div>
                        <span className="text-[#8B949E]">Policies:</span> {productPolicies.length}
                      </div>
                      <div>
                        <span className="text-[#8B949E]">Revenue:</span> ${productPolicies.reduce((sum, p) => sum + p.premium, 0)}/mo
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] bg-[#F59E0B]/10">
            <h3 className="font-semibold text-[#F59E0B]">Claims Queue ({pendingClaims.length} pending)</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {claims.map((claim) => {
              const statusConfig = CLAIM_STATUS_CONFIG[claim.status];
              return (
                <div key={claim.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-sm">{claim.claimNumber}</div>
                      <div className="font-medium">{claim.type}</div>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#8B949E]">
                      Requested: <span className="text-white font-mono">${claim.amountRequested.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs bg-[#3CCB7F] text-[#0D1117] px-3 py-1 rounded font-medium">Approve</button>
                      <button className="text-xs bg-[#F85149] text-white px-3 py-1 rounded font-medium">Reject</button>
                      <button className="text-xs bg-[#1F242C] px-3 py-1 rounded">Review</button>
                    </div>
                  </div>
                  {/* AI Recommendation */}
                  <div className="mt-3 p-2 bg-[#A371F7]/10 rounded text-xs text-[#8B949E]">
                    <span className="text-[#A371F7]">🧠 AI:</span> {claim.aiRecommendation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {['GDPR Ready', 'SOC 2 Type II', 'ISO 27001'].map((cert) => (
              <div key={cert} className="bg-[#161B22] border border-[#3CCB7F]/30 rounded-xl p-6 text-center">
                <span className="text-3xl text-[#3CCB7F]">✓</span>
                <div className="font-semibold mt-2">{cert}</div>
                <div className="text-xs text-[#3CCB7F]">Compliant</div>
              </div>
            ))}
          </div>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Audit Log</h3>
            <div className="space-y-2 text-sm">
              {[
                { time: '2026-01-05 14:30:22', action: 'Claim CLM-2026-00002 filed', user: 'Customer' },
                { time: '2026-01-05 11:00:00', action: 'Claim CLM-2026-00001 approved', user: 'Claims Manager' },
                { time: '2026-01-05 09:23:15', action: 'Policy POL-2025-TRV-00042 created', user: 'Customer' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-[#0D1117] rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-[#6E7681] font-mono text-xs">{log.time}</span>
                    <span>{log.action}</span>
                  </div>
                  <span className="text-xs text-[#8B949E]">{log.user}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    
      {/* Renewal Modal */}
      {showRenewalModal && expiringSoon.length > 0 && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setShowRenewalModal(false)}>
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#F59E0B]">🔄 Renew Policy</h3>
              <button onClick={() => setShowRenewalModal(false)} className="text-[#8B949E] hover:text-white">✕</button>
            </div>
            
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 mb-6">
              <div className="text-sm text-[#8B949E] mb-1">Policy Details</div>
              <div className="font-semibold">{expiringSoon[0].productName}</div>
              <div className="text-sm text-[#8B949E]">Policy #: {expiringSoon[0].policyNumber}</div>
              <div className="text-sm text-[#F59E0B] mt-2">Expires: {expiringSoon[0].endDate}</div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  alert('✅ Auto-renewal activated!\n\nYour policy will automatically renew on expiration date.\nYou will receive confirmation 7 days before renewal.');
                  setShowRenewalModal(false);
                }}
                className="w-full bg-[#3CCB7F] text-[#0D1117] px-4 py-3 rounded-lg font-semibold hover:bg-[#4ADB8F] transition-colors flex items-center justify-between"
              >
                <span>✅ Auto-renew (recommended)</span>
                <span className="text-sm opacity-80">Easy & convenient</span>
              </button>
              
              <button 
                onClick={() => {
                  alert('🔄 Modify Coverage\n\nThis would allow you to:\n• Change coverage amount\n• Add/remove riders\n• Update beneficiaries\n• Adjust deductibles\n\nRedirecting to coverage editor...');
                  setShowRenewalModal(false);
                }}
                className="w-full bg-[#0D1117] border border-[#1F242C] text-[#E6EDF3] px-4 py-3 rounded-lg font-semibold hover:border-[#3CCB7F] transition-colors flex items-center justify-between"
              >
                <span>🔄 Modify coverage</span>
                <span className="text-sm opacity-60">Customize policy</span>
              </button>
              
              <button 
                onClick={() => {
                  alert('💰 Get New Quote\n\nWe\'ll generate a fresh quote based on:\n• Current market rates\n• Your updated profile\n• Latest AI pricing\n\nStarting quote process...');
                  setShowRenewalModal(false);
                }}
                className="w-full bg-[#0D1117] border border-[#1F242C] text-[#E6EDF3] px-4 py-3 rounded-lg font-semibold hover:border-[#00A3FF] transition-colors flex items-center justify-between"
              >
                <span>💰 Get new quote</span>
                <span className="text-sm opacity-60">Compare options</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#1F242C] flex justify-between">
              <button onClick={() => setShowRenewalModal(false)} className="text-sm text-[#8B949E] hover:text-white">Cancel</button>
              <div className="text-xs text-[#8B949E]">Need help? Contact support</div>
            </div>
          </div>
        </div>
      )}

</div>
  );
}
