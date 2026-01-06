'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES & INTERFACES
// ============================================
type UserRole = 'business' | 'vendor' | 'driver' | 'admin' | 'compliance';
type PaymentView = 
  | 'landing' | 'dashboard' | 'send' | 'receive' | 'wallets'
  | 'escrow' | 'escrow-details' | 'factoring' | 'factoring-details'
  | 'cross-border' | 'transactions' | 'transaction-details'
  | 'crypto' | 'admin' | 'compliance' | 'settings';

type Currency = 'USD' | 'EUR' | 'UAH' | 'GBP' | 'USDT' | 'USDC';
type TransactionType = 'payment' | 'escrow' | 'factoring' | 'cross_border' | 'crypto' | 'refund' | 'fee';
type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'held' | 'released';
type EscrowStatus = 'created' | 'funded' | 'in_progress' | 'pending_release' | 'released' | 'disputed' | 'refunded';
type FactoringStatus = 'submitted' | 'under_review' | 'approved' | 'funded' | 'collecting' | 'settled' | 'defaulted';

interface Wallet {
  id: string;
  currency: Currency;
  balance: number;
  availableBalance: number;
  pendingIn: number;
  pendingOut: number;
  escrowHeld: number;
  type: 'fiat' | 'crypto';
  accountNumber?: string;
  iban?: string;
  walletAddress?: string;
}

interface Transaction {
  id: string;
  txNumber: string;
  type: TransactionType;
  status: TransactionStatus;
  
  fromId: string;
  fromName: string;
  fromWallet: Currency;
  
  toId: string;
  toName: string;
  toWallet: Currency;
  
  amount: number;
  currency: Currency;
  
  // For cross-border
  exchangeRate?: number;
  convertedAmount?: number;
  convertedCurrency?: Currency;
  
  fee: number;
  netAmount: number;
  
  reference?: string;
  description?: string;
  
  // Linked entities
  orderId?: string;
  loadId?: string;
  invoiceId?: string;
  escrowId?: string;
  
  // AI
  aiRiskScore: number;
  aiFlags: string[];
  
  createdAt: string;
  completedAt?: string;
}

interface Escrow {
  id: string;
  escrowNumber: string;
  status: EscrowStatus;
  
  buyerId: string;
  buyerName: string;
  
  sellerId: string;
  sellerName: string;
  
  amount: number;
  currency: Currency;
  fee: number;
  
  // Conditions
  releaseConditions: string[];
  conditionsMet: boolean[];
  
  // Linked entities
  orderId?: string;
  loadId?: string;
  contractId?: string;
  
  // Timeline
  timeline: { timestamp: string; event: string; actor: string }[];
  
  // Dispute
  disputeReason?: string;
  disputeResolution?: string;
  
  expiresAt: string;
  createdAt: string;
  releasedAt?: string;
}

interface FactoringRequest {
  id: string;
  factorNumber: string;
  status: FactoringStatus;
  
  sellerId: string;
  sellerName: string;
  
  buyerId: string;
  buyerName: string;
  
  invoiceNumber: string;
  invoiceAmount: number;
  currency: Currency;
  invoiceDueDate: string;
  
  // Factoring terms
  advanceRate: number;        // e.g., 95%
  advanceAmount: number;      // What seller gets immediately
  factoringFee: number;       // e.g., 2%
  reserveAmount: number;      // Held until collection
  
  // Collection
  collectedAmount: number;
  collectedAt?: string;
  
  // AI scoring
  buyerCreditScore: number;
  paymentProbability: number;
  aiRecommendation: string;
  
  createdAt: string;
  fundedAt?: string;
  settledAt?: string;
}

interface ExchangeRate {
  from: Currency;
  to: Currency;
  rate: number;
  spread: number;
  updatedAt: string;
}

// ============================================
// CONSTANTS & CONFIG
// ============================================
const CURRENCIES: Record<Currency, { symbol: string; name: string; flag: string; type: 'fiat' | 'crypto' }> = {
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸', type: 'fiat' },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺', type: 'fiat' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦', type: 'fiat' },
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧', type: 'fiat' },
  USDT: { symbol: '₮', name: 'Tether', flag: '💎', type: 'crypto' },
  USDC: { symbol: '$', name: 'USD Coin', flag: '🔵', type: 'crypto' },
};

const TX_STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: '#F59E0B', icon: '⏳' },
  processing: { label: 'Processing', color: '#00A3FF', icon: '⚙️' },
  completed: { label: 'Completed', color: '#3CCB7F', icon: '✓' },
  failed: { label: 'Failed', color: '#F85149', icon: '✗' },
  cancelled: { label: 'Cancelled', color: '#8B949E', icon: '🚫' },
  held: { label: 'Held', color: '#A371F7', icon: '🔒' },
  released: { label: 'Released', color: '#3CCB7F', icon: '🔓' },
};

const ESCROW_STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; icon: string }> = {
  created: { label: 'Created', color: '#8B949E', icon: '📝' },
  funded: { label: 'Funded', color: '#00A3FF', icon: '💰' },
  in_progress: { label: 'In Progress', color: '#F59E0B', icon: '⏳' },
  pending_release: { label: 'Pending Release', color: '#A371F7', icon: '🔓' },
  released: { label: 'Released', color: '#3CCB7F', icon: '✓' },
  disputed: { label: 'Disputed', color: '#F85149', icon: '⚠️' },
  refunded: { label: 'Refunded', color: '#8B949E', icon: '↩️' },
};

const FACTORING_STATUS_CONFIG: Record<FactoringStatus, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: '#8B949E' },
  under_review: { label: 'Under Review', color: '#00A3FF' },
  approved: { label: 'Approved', color: '#A371F7' },
  funded: { label: 'Funded', color: '#3CCB7F' },
  collecting: { label: 'Collecting', color: '#F59E0B' },
  settled: { label: 'Settled', color: '#3CCB7F' },
  defaulted: { label: 'Defaulted', color: '#F85149' },
};

// ============================================
// MOCK DATA
// ============================================
const SAMPLE_WALLETS: Wallet[] = [
  { id: 'w-usd', currency: 'USD', balance: 125430.50, availableBalance: 118930.50, pendingIn: 4500, pendingOut: 2000, escrowHeld: 6500, type: 'fiat', accountNumber: '****4521' },
  { id: 'w-eur', currency: 'EUR', balance: 45230.00, availableBalance: 45230.00, pendingIn: 0, pendingOut: 0, escrowHeld: 0, type: 'fiat', iban: 'DE89****4567' },
  { id: 'w-uah', currency: 'UAH', balance: 892450.00, availableBalance: 842450.00, pendingIn: 50000, pendingOut: 0, escrowHeld: 0, type: 'fiat', accountNumber: '****7890' },
  { id: 'w-usdt', currency: 'USDT', balance: 15000.00, availableBalance: 15000.00, pendingIn: 0, pendingOut: 0, escrowHeld: 0, type: 'crypto', walletAddress: '0x1234...abcd' },
];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    txNumber: 'TXN-2026-000001',
    type: 'payment',
    status: 'completed',
    fromId: 'biz-001',
    fromName: 'ABC Manufacturing',
    fromWallet: 'USD',
    toId: 'biz-002',
    toName: 'Steel Dynamics',
    toWallet: 'USD',
    amount: 45000,
    currency: 'USD',
    fee: 0,
    netAmount: 45000,
    reference: 'INV-2026-0042',
    description: 'Payment for steel shipment',
    orderId: 'ORD-2026-00123',
    aiRiskScore: 5,
    aiFlags: [],
    createdAt: '2026-01-05 10:30:00',
    completedAt: '2026-01-05 10:30:45',
  },
  {
    id: 'tx-002',
    txNumber: 'TXN-2026-000002',
    type: 'escrow',
    status: 'held',
    fromId: 'biz-003',
    fromName: 'Fresh Foods Inc',
    fromWallet: 'USD',
    toId: 'escrow',
    toName: 'Escrow Account',
    toWallet: 'USD',
    amount: 12500,
    currency: 'USD',
    fee: 125,
    netAmount: 12375,
    escrowId: 'esc-001',
    loadId: 'DF-2026-00002',
    aiRiskScore: 8,
    aiFlags: [],
    createdAt: '2026-01-05 08:15:00',
  },
  {
    id: 'tx-003',
    txNumber: 'TXN-2026-000003',
    type: 'cross_border',
    status: 'completed',
    fromId: 'biz-001',
    fromName: 'ABC Manufacturing',
    fromWallet: 'USD',
    toId: 'biz-004',
    toName: 'Kyiv Tech Solutions',
    toWallet: 'UAH',
    amount: 10000,
    currency: 'USD',
    exchangeRate: 41.25,
    convertedAmount: 412500,
    convertedCurrency: 'UAH',
    fee: 50,
    netAmount: 412500,
    description: 'Software development services',
    aiRiskScore: 12,
    aiFlags: ['cross_border', 'new_recipient'],
    createdAt: '2026-01-04 16:45:00',
    completedAt: '2026-01-04 17:02:00',
  },
  {
    id: 'tx-004',
    txNumber: 'TXN-2026-000004',
    type: 'factoring',
    status: 'completed',
    fromId: 'platform',
    fromName: 'IVYAR Payments',
    fromWallet: 'USD',
    toId: 'biz-005',
    toName: 'Logistics Pro LLC',
    toWallet: 'USD',
    amount: 9500,
    currency: 'USD',
    fee: 200,
    netAmount: 9300,
    invoiceId: 'INV-2026-0089',
    aiRiskScore: 15,
    aiFlags: ['factoring'],
    createdAt: '2026-01-03 11:20:00',
    completedAt: '2026-01-03 11:22:00',
  },
];

const SAMPLE_ESCROWS: Escrow[] = [
  {
    id: 'esc-001',
    escrowNumber: 'ESC-2026-000001',
    status: 'in_progress',
    buyerId: 'biz-003',
    buyerName: 'Fresh Foods Inc',
    sellerId: 'drv-001',
    sellerName: 'Mike Johnson (Driver)',
    amount: 3568,
    currency: 'USD',
    fee: 35.68,
    releaseConditions: ['Load picked up', 'Load delivered', 'POD uploaded'],
    conditionsMet: [true, false, false],
    loadId: 'DF-2026-00002',
    timeline: [
      { timestamp: '2026-01-05 08:00:00', event: 'Escrow created', actor: 'System' },
      { timestamp: '2026-01-05 08:15:00', event: 'Funds deposited', actor: 'Fresh Foods Inc' },
      { timestamp: '2026-01-06 06:30:00', event: 'Load picked up', actor: 'Driver' },
    ],
    expiresAt: '2026-01-10',
    createdAt: '2026-01-05 08:00:00',
  },
  {
    id: 'esc-002',
    escrowNumber: 'ESC-2026-000002',
    status: 'pending_release',
    buyerId: 'biz-001',
    buyerName: 'ABC Manufacturing',
    sellerId: 'biz-006',
    sellerName: 'Component Supply Co',
    amount: 28500,
    currency: 'USD',
    fee: 285,
    releaseConditions: ['Order shipped', 'Order received', 'Quality verified'],
    conditionsMet: [true, true, true],
    orderId: 'ORD-2026-00156',
    timeline: [
      { timestamp: '2026-01-02 10:00:00', event: 'Escrow created', actor: 'System' },
      { timestamp: '2026-01-02 10:30:00', event: 'Funds deposited', actor: 'ABC Manufacturing' },
      { timestamp: '2026-01-03 14:00:00', event: 'Order shipped', actor: 'Seller' },
      { timestamp: '2026-01-05 09:00:00', event: 'Order received', actor: 'Buyer' },
      { timestamp: '2026-01-05 11:00:00', event: 'Quality verified', actor: 'Buyer' },
      { timestamp: '2026-01-05 11:05:00', event: 'Release requested', actor: 'Seller' },
    ],
    expiresAt: '2026-01-12',
    createdAt: '2026-01-02 10:00:00',
  },
];

const SAMPLE_FACTORING: FactoringRequest[] = [
  {
    id: 'fac-001',
    factorNumber: 'FAC-2026-000001',
    status: 'funded',
    sellerId: 'biz-005',
    sellerName: 'Logistics Pro LLC',
    buyerId: 'biz-001',
    buyerName: 'ABC Manufacturing',
    invoiceNumber: 'INV-2026-0089',
    invoiceAmount: 10000,
    currency: 'USD',
    invoiceDueDate: '2026-02-05',
    advanceRate: 95,
    advanceAmount: 9500,
    factoringFee: 200,
    reserveAmount: 300,
    collectedAmount: 0,
    buyerCreditScore: 92,
    paymentProbability: 98.5,
    aiRecommendation: 'Approve - Buyer has excellent payment history (99.5% on-time). Low risk.',
    createdAt: '2026-01-03 11:00:00',
    fundedAt: '2026-01-03 11:22:00',
  },
  {
    id: 'fac-002',
    factorNumber: 'FAC-2026-000002',
    status: 'collecting',
    sellerId: 'drv-002',
    sellerName: 'John Smith (Driver)',
    buyerId: 'biz-003',
    buyerName: 'Fresh Foods Inc',
    invoiceNumber: 'DF-2026-00089',
    invoiceAmount: 4200,
    currency: 'USD',
    invoiceDueDate: '2026-01-20',
    advanceRate: 95,
    advanceAmount: 3990,
    factoringFee: 84,
    reserveAmount: 126,
    collectedAmount: 0,
    buyerCreditScore: 96,
    paymentProbability: 99.2,
    aiRecommendation: 'Approve - Fresh Foods has stellar payment record. Minimal risk.',
    createdAt: '2026-01-02 15:00:00',
    fundedAt: '2026-01-02 15:15:00',
  },
];

const EXCHANGE_RATES: ExchangeRate[] = [
  { from: 'USD', to: 'UAH', rate: 41.25, spread: 0.5, updatedAt: '2026-01-05 15:00:00' },
  { from: 'USD', to: 'EUR', rate: 0.92, spread: 0.2, updatedAt: '2026-01-05 15:00:00' },
  { from: 'EUR', to: 'UAH', rate: 44.85, spread: 0.5, updatedAt: '2026-01-05 15:00:00' },
  { from: 'USD', to: 'GBP', rate: 0.79, spread: 0.2, updatedAt: '2026-01-05 15:00:00' },
  { from: 'USDT', to: 'USD', rate: 1.00, spread: 0.1, updatedAt: '2026-01-05 15:00:00' },
  { from: 'USDC', to: 'USD', rate: 1.00, spread: 0.1, updatedAt: '2026-01-05 15:00:00' },
];

const PLATFORM_STATS = {
  totalVolume: 847500000,
  monthlyVolume: 45200000,
  totalTransactions: 234567,
  activeBusinesses: 8945,
  avgSettlementTime: '< 30 seconds',
  escrowHeld: 12450000,
  factoringAdvanced: 34200000,
  crossBorderVolume: 89000000,
  fraudBlocked: 2340000,
  complianceRate: 99.8,
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function PaymentsModulePage() {
  const [currentView, setCurrentView] = useState<PaymentView>('landing');
  const [userRole, setUserRole] = useState<UserRole>('business');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null);
  const [selectedFactoring, setSelectedFactoring] = useState<FactoringRequest | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3CCB7F] via-[#00A3FF] to-[#A371F7] rounded-xl flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <div className="font-bold">IVYAR Payments</div>
                <div className="text-xs text-[#6E7681]">Direct B2B • Zero Banks</div>
              </div>
            </Link>
            <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded-full font-mono">v1.0</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'wallets', label: 'Wallets', icon: '💰' },
              { id: 'send', label: 'Send', icon: '📤' },
              { id: 'escrow', label: 'Escrow', icon: '🔒' },
              { id: 'factoring', label: 'Factoring', icon: '📄' },
              { id: 'cross-border', label: 'FX', icon: '🌍' },
              ...(userRole === 'admin' ? [{ id: 'admin', label: 'Admin', icon: '⚙️' }] : []),
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as PaymentView)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
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
              <option value="business">🏢 Business</option>
              <option value="vendor">🏭 Vendor</option>
              <option value="driver">🚛 Driver</option>
              <option value="admin">👑 Admin</option>
              <option value="compliance">🛡️ Compliance</option>
            </select>
            <div className="w-9 h-9 bg-gradient-to-br from-[#3CCB7F] to-[#00A3FF] rounded-full flex items-center justify-center text-lg">
              💎
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {currentView === 'landing' && <LandingPage onGetStarted={() => setCurrentView('dashboard')} />}
        {currentView === 'dashboard' && (
          <DashboardPage 
            wallets={SAMPLE_WALLETS} 
            transactions={SAMPLE_TRANSACTIONS}
            onViewTransaction={(tx) => { setSelectedTransaction(tx); setCurrentView('transaction-details'); }}
          />
        )}
        {currentView === 'wallets' && <WalletsPage wallets={SAMPLE_WALLETS} />}
        {currentView === 'send' && <SendPaymentPage wallets={SAMPLE_WALLETS} />}
        {currentView === 'escrow' && (
          <EscrowPage 
            escrows={SAMPLE_ESCROWS}
            onViewEscrow={(esc) => { setSelectedEscrow(esc); setCurrentView('escrow-details'); }}
          />
        )}
        {currentView === 'escrow-details' && selectedEscrow && (
          <EscrowDetailsPage escrow={selectedEscrow} onBack={() => setCurrentView('escrow')} />
        )}
        {currentView === 'factoring' && (
          <FactoringPage 
            requests={SAMPLE_FACTORING}
            onViewRequest={(req) => { setSelectedFactoring(req); setCurrentView('factoring-details'); }}
          />
        )}
        {currentView === 'factoring-details' && selectedFactoring && (
          <FactoringDetailsPage request={selectedFactoring} onBack={() => setCurrentView('factoring')} />
        )}
        {currentView === 'cross-border' && <CrossBorderPage wallets={SAMPLE_WALLETS} rates={EXCHANGE_RATES} />}
        {currentView === 'transactions' && (
          <TransactionsPage 
            transactions={SAMPLE_TRANSACTIONS}
            onViewTransaction={(tx) => { setSelectedTransaction(tx); setCurrentView('transaction-details'); }}
          />
        )}
        {currentView === 'transaction-details' && selectedTransaction && (
          <TransactionDetailsPage transaction={selectedTransaction} onBack={() => setCurrentView('transactions')} />
        )}
        {currentView === 'crypto' && <CryptoPage wallets={SAMPLE_WALLETS.filter(w => w.type === 'crypto')} />}
        {currentView === 'admin' && <AdminPage stats={PLATFORM_STATS} />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-[#1F242C] py-6 mt-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-[#6E7681]">
            <div>© 2024–2026 IVYAR Payments — Direct B2B, Zero Banks, Instant Settlement</div>
            <div className="flex gap-3">
              <span className="bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded text-xs">Instant</span>
              <span className="bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded text-xs">Multi-Currency</span>
              <span className="bg-[#A371F7]/20 text-[#A371F7] px-2 py-1 rounded text-xs">Crypto Ready</span>
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
function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3CCB7F]/10 via-[#00A3FF]/10 to-[#A371F7]/10"></div>
        <div className="max-w-[1440px] mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#3CCB7F]/20 text-[#3CCB7F] px-4 py-2 rounded-full text-sm mb-6">
              <span>💎</span>
              <span>Direct B2B Payments • Zero Banks • Instant Settlement</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Pay Direct.<br/>
              <span className="text-[#3CCB7F]">Get Paid Instantly.</span><br/>
              <span className="text-[#00A3FF]">No Banks. No Fees.</span>
            </h1>
            <p className="text-xl text-[#8B949E] mb-8">
              Move money between businesses in seconds. Cross-border in minutes.
              Escrow for trust. Factoring without banks.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-[#3CCB7F]/30 transition-all"
              >
                Open Account →
              </button>
              <button className="bg-[#161B22] border border-[#1F242C] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1F242C] transition-all">
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-4 gap-6">
            {[
              { value: '$847M+', label: 'Total Volume', icon: '💰' },
              { value: '< 30s', label: 'Settlement Time', icon: '⚡' },
              { value: '0%', label: 'Payment Fees', icon: '🎯' },
              { value: '$89M', label: 'Cross-Border', icon: '🌍' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
                <span className="text-3xl">{stat.icon}</span>
                <div className="text-3xl font-bold mt-3 text-[#3CCB7F]">{stat.value}</div>
                <div className="text-sm text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Financial Infrastructure</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { 
                icon: '📤', 
                title: 'Direct Payments', 
                desc: 'Send to any business instantly. No intermediaries.',
                features: ['Instant settlement', 'Zero fees', 'Real-time tracking']
              },
              { 
                icon: '🔒', 
                title: 'Escrow', 
                desc: 'Hold funds until conditions are met. Trust built-in.',
                features: ['Trade protection', 'Freight payments', 'Multi-party']
              },
              { 
                icon: '📄', 
                title: 'Factoring', 
                desc: 'Get paid now. We collect later. No banks.',
                features: ['95% advance', 'Same-day funding', 'AI credit scoring']
              },
              { 
                icon: '🌍', 
                title: 'Cross-Border', 
                desc: 'UAH ↔ USD ↔ EUR. Best rates. Minutes not days.',
                features: ['Real-time FX', 'Low spreads', 'Compliance built-in']
              },
              { 
                icon: '💎', 
                title: 'Crypto Rails', 
                desc: 'USDT, USDC as alternative settlement layer.',
                features: ['Instant global', 'Stable value', 'Optional']
              },
              { 
                icon: '🛡️', 
                title: 'Compliance', 
                desc: 'KYC/AML built-in. AI fraud detection.',
                features: ['Automated KYC', 'Risk scoring', 'Audit trails']
              },
            ].map((product, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 hover:border-[#3CCB7F]/50 transition-all">
                <span className="text-4xl">{product.icon}</span>
                <h3 className="text-xl font-bold mt-4">{product.title}</h3>
                <p className="text-[#8B949E] text-sm mt-2 mb-4">{product.desc}</p>
                <div className="space-y-2">
                  {product.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <span className="text-[#3CCB7F]">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Ecosystem Integrations</h2>
          <p className="text-center text-[#8B949E] mb-12">Payments flow seamlessly across IVYAR platform</p>
          <div className="flex justify-center gap-6">
            {[
              { module: 'Trade Module', icon: '🏪', desc: 'B2B marketplace payments' },
              { module: 'Freight Module', icon: '🚛', desc: 'Driver instant pay' },
              { module: 'Insurance Module', icon: '🛡️', desc: 'Premium & claims' },
            ].map((int, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center w-64">
                <span className="text-4xl">{int.icon}</span>
                <div className="font-bold mt-3">{int.module}</div>
                <div className="text-sm text-[#8B949E]">{int.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================
function DashboardPage({ 
  wallets, 
  transactions,
  onViewTransaction,
}: { 
  wallets: Wallet[];
  transactions: Transaction[];
  onViewTransaction: (tx: Transaction) => void;
}) {
  const totalBalance = wallets.filter(w => w.currency === 'USD').reduce((sum, w) => sum + w.balance, 0) +
                       wallets.filter(w => w.currency === 'EUR').reduce((sum, w) => sum + w.balance * 1.09, 0) +
                       wallets.filter(w => w.currency === 'UAH').reduce((sum, w) => sum + w.balance / 41.25, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Dashboard</h1>

      {/* Balance Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="col-span-1 bg-gradient-to-br from-[#3CCB7F]/20 to-[#00A3FF]/20 border border-[#3CCB7F]/30 rounded-xl p-6">
          <div className="text-sm text-[#8B949E]">Total Balance (USD eq.)</div>
          <div className="text-3xl font-bold text-[#3CCB7F] mt-2">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-[#8B949E] mt-1">Across all wallets</div>
        </div>
        {wallets.slice(0, 3).map((wallet) => {
          const curr = CURRENCIES[wallet.currency];
          return (
            <div key={wallet.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{curr.flag}</span>
                <span className="text-sm text-[#8B949E]">{wallet.currency}</span>
              </div>
              <div className="text-2xl font-bold">{curr.symbol}{wallet.balance.toLocaleString()}</div>
              <div className="text-xs text-[#6E7681]">
                Available: {curr.symbol}{wallet.availableBalance.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📤', label: 'Send Money', color: '#3CCB7F', action: 'send' },
          { icon: '📥', label: 'Request Payment', color: '#00A3FF', action: 'receive' },
          { icon: '🔒', label: 'Create Escrow', color: '#A371F7', action: 'escrow' },
          { icon: '📄', label: 'Factor Invoice', color: '#F59E0B', action: 'factoring' },
        ].map((action, i) => (
          <button key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 text-left hover:border-[#3CCB7F]/50 transition-all">
            <span className="text-3xl">{action.icon}</span>
            <div className="font-semibold mt-2" style={{ color: action.color }}>{action.label}</div>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
          <h3 className="font-semibold">Recent Transactions</h3>
          <button className="text-[#00A3FF] text-sm hover:underline">View All →</button>
        </div>
        <div className="divide-y divide-[#1F242C]">
          {transactions.slice(0, 5).map((tx) => {
            const status = TX_STATUS_CONFIG[tx.status];
            const curr = CURRENCIES[tx.currency];
            const isOutgoing = tx.fromId === 'biz-001';
            return (
              <div 
                key={tx.id}
                onClick={() => onViewTransaction(tx)}
                className="p-4 flex items-center justify-between hover:bg-[#1F242C]/30 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isOutgoing ? 'bg-[#F85149]/20 text-[#F85149]' : 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                  }`}>
                    {isOutgoing ? '↑' : '↓'}
                  </div>
                  <div>
                    <div className="font-medium">{isOutgoing ? tx.toName : tx.fromName}</div>
                    <div className="text-sm text-[#6E7681]">{tx.txNumber} • {tx.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.icon} {status.label}
                  </span>
                  <div className={`text-right font-mono font-bold ${isOutgoing ? 'text-[#F85149]' : 'text-[#3CCB7F]'}`}>
                    {isOutgoing ? '-' : '+'}{curr.symbol}{tx.amount.toLocaleString()}
                  </div>
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
// WALLETS PAGE
// ============================================
function WalletsPage({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Wallets</h1>
        <button className="bg-[#3CCB7F] text-[#0D1117] px-4 py-2 rounded-lg font-semibold">
          + Add Wallet
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {wallets.map((wallet) => {
          const curr = CURRENCIES[wallet.currency];
          return (
            <div key={wallet.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className={`p-6 ${wallet.type === 'crypto' ? 'bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10' : 'bg-gradient-to-r from-[#3CCB7F]/10 to-[#00A3FF]/10'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{curr.flag}</span>
                    <div>
                      <div className="font-bold text-lg">{curr.name}</div>
                      <div className="text-sm text-[#8B949E]">{wallet.currency}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    wallet.type === 'crypto' ? 'bg-[#A371F7]/20 text-[#A371F7]' : 'bg-[#3CCB7F]/20 text-[#3CCB7F]'
                  }`}>
                    {wallet.type === 'crypto' ? '💎 Crypto' : '🏦 Fiat'}
                  </span>
                </div>
                <div className="text-3xl font-bold">{curr.symbol}{wallet.balance.toLocaleString()}</div>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Available</span>
                  <span className="font-mono text-[#3CCB7F]">{curr.symbol}{wallet.availableBalance.toLocaleString()}</span>
                </div>
                {wallet.pendingIn > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">Pending In</span>
                    <span className="font-mono text-[#00A3FF]">+{curr.symbol}{wallet.pendingIn.toLocaleString()}</span>
                  </div>
                )}
                {wallet.escrowHeld > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#8B949E]">In Escrow</span>
                    <span className="font-mono text-[#A371F7]">🔒 {curr.symbol}{wallet.escrowHeld.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#1F242C]">
                  <span className="text-[#6E7681] text-xs">
                    {wallet.accountNumber || wallet.iban || wallet.walletAddress}
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-[#1F242C] flex gap-2">
                <button className="flex-1 bg-[#3CCB7F] text-[#0D1117] py-2 rounded-lg text-sm font-semibold">Send</button>
                <button className="flex-1 bg-[#1F242C] py-2 rounded-lg text-sm">Receive</button>
                <button className="flex-1 bg-[#1F242C] py-2 rounded-lg text-sm">Exchange</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// SEND PAYMENT PAGE
// ============================================
function SendPaymentPage({ wallets }: { wallets: Wallet[] }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Send Payment</h1>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        {/* Progress */}
        <div className="px-6 py-4 bg-[#0D1117] border-b border-[#1F242C]">
          <div className="flex items-center justify-between">
            {['Recipient', 'Amount', 'Review'].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i + 1 ? 'bg-[#3CCB7F] text-[#0D1117]' : step === i + 1 ? 'bg-[#00A3FF] text-white' : 'bg-[#1F242C] text-[#8B949E]'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className={step >= i + 1 ? 'text-white' : 'text-[#8B949E]'}>{s}</span>
                {i < 2 && <div className={`w-12 h-0.5 ${step > i + 1 ? 'bg-[#3CCB7F]' : 'bg-[#1F242C]'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Recipient Name or ID</label>
                <input 
                  type="text" 
                  placeholder="Business name, email, or account ID"
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                />
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-sm text-[#8B949E] mb-3">Recent Recipients</div>
                {['Steel Dynamics', 'Fresh Foods Inc', 'Kyiv Tech Solutions'].map((name, i) => (
                  <button key={i} className="w-full text-left p-2 hover:bg-[#161B22] rounded flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1F242C] rounded-full flex items-center justify-center">
                      {name[0]}
                    </div>
                    <span>{name}</span>
                  </button>
                ))}
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
                <label className="block text-sm text-[#8B949E] mb-2">From Wallet</label>
                <select className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3">
                  {wallets.filter(w => w.type === 'fiat').map((w) => (
                    <option key={w.id} value={w.currency}>
                      {CURRENCIES[w.currency].flag} {w.currency} — ${w.availableBalance.toLocaleString()} available
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B949E]">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 pl-8 text-2xl font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Reference (Optional)</label>
                <input 
                  type="text"
                  placeholder="Invoice number, order ID, etc."
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 bg-[#1F242C] py-3 rounded-lg">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#3CCB7F] text-[#0D1117] py-3 rounded-lg font-semibold">Review →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-[#0D1117] rounded-xl p-6 text-center">
                <div className="text-sm text-[#8B949E]">You're sending</div>
                <div className="text-4xl font-bold text-[#3CCB7F] my-2">${amount || '0.00'}</div>
                <div className="text-sm text-[#8B949E]">to Steel Dynamics</div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Amount</span>
                  <span className="font-mono">${amount || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Fee</span>
                  <span className="font-mono text-[#3CCB7F]">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">Settlement</span>
                  <span className="text-[#3CCB7F]">⚡ Instant</span>
                </div>
                <div className="border-t border-[#1F242C] pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#3CCB7F]">${amount || '0.00'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 bg-[#1F242C] py-3 rounded-lg">← Back</button>
                <button className="flex-1 bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white py-3 rounded-lg font-semibold">
                  Send Payment ✓
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
// ESCROW PAGE
// ============================================
function EscrowPage({ 
  escrows,
  onViewEscrow,
}: { 
  escrows: Escrow[];
  onViewEscrow: (escrow: Escrow) => void;
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Escrow</h1>
          <p className="text-[#8B949E]">Secure payments with conditions</p>
        </div>
        <button className="bg-[#A371F7] text-white px-4 py-2 rounded-lg font-semibold">
          + Create Escrow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Escrows', value: escrows.filter(e => !['released', 'refunded'].includes(e.status)).length, icon: '🔒', color: '#A371F7' },
          { label: 'Funds Held', value: `$${escrows.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`, icon: '💰', color: '#00A3FF' },
          { label: 'Pending Release', value: escrows.filter(e => e.status === 'pending_release').length, icon: '⏳', color: '#F59E0B' },
          { label: 'Released (30d)', value: '$124,500', icon: '✓', color: '#3CCB7F' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Escrow List */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Escrow #</th>
                <th className="text-left p-4">Parties</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-center p-4">Conditions</th>
                <th className="text-center p-4">Status</th>
                <th className="text-left p-4">Expires</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {escrows.map((escrow) => {
                const status = ESCROW_STATUS_CONFIG[escrow.status];
                const conditionsMet = escrow.conditionsMet.filter(Boolean).length;
                return (
                  <tr key={escrow.id} className="border-b border-[#1F242C] hover:bg-[#1F242C]/30">
                    <td className="p-4 font-mono">{escrow.escrowNumber}</td>
                    <td className="p-4">
                      <div className="text-xs text-[#8B949E]">Buyer: {escrow.buyerName}</div>
                      <div className="text-xs text-[#8B949E]">Seller: {escrow.sellerName}</div>
                    </td>
                    <td className="p-4 text-right font-bold">${escrow.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        conditionsMet === escrow.releaseConditions.length ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}>
                        {conditionsMet}/{escrow.releaseConditions.length}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span 
                        className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                        style={{ backgroundColor: `${status.color}20`, color: status.color }}
                      >
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-[#8B949E]">{escrow.expiresAt}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onViewEscrow(escrow)}
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
// ESCROW DETAILS PAGE
// ============================================
function EscrowDetailsPage({ escrow, onBack }: { escrow: Escrow; onBack: () => void }) {
  const status = ESCROW_STATUS_CONFIG[escrow.status];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Escrow
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1F242C]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-[#6E7681] font-mono mb-1">{escrow.escrowNumber}</div>
              <h1 className="text-2xl font-bold">Escrow Details</h1>
            </div>
            <span 
              className="px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
              style={{ backgroundColor: `${status.color}20`, color: status.color }}
            >
              {status.icon} {status.label}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Amount */}
          <div className="bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10 border border-[#A371F7]/30 rounded-xl p-6 text-center mb-6">
            <div className="text-sm text-[#8B949E]">Amount Held</div>
            <div className="text-4xl font-bold text-[#A371F7]">${escrow.amount.toLocaleString()}</div>
            <div className="text-xs text-[#8B949E] mt-1">Fee: ${escrow.fee}</div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-xs text-[#8B949E] mb-2">💰 Buyer (Payer)</div>
              <div className="font-semibold">{escrow.buyerName}</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-xs text-[#8B949E] mb-2">📦 Seller (Recipient)</div>
              <div className="font-semibold">{escrow.sellerName}</div>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Release Conditions</h3>
            <div className="space-y-2">
              {escrow.releaseConditions.map((condition, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${
                  escrow.conditionsMet[i] ? 'bg-[#3CCB7F]/10' : 'bg-[#0D1117]'
                }`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    escrow.conditionsMet[i] ? 'bg-[#3CCB7F] text-[#0D1117]' : 'bg-[#1F242C] text-[#8B949E]'
                  }`}>
                    {escrow.conditionsMet[i] ? '✓' : i + 1}
                  </span>
                  <span className={escrow.conditionsMet[i] ? 'text-[#3CCB7F]' : ''}>{condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              {escrow.timeline.map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 bg-[#A371F7] rounded-full"></div>
                  <div>
                    <div className="font-medium">{event.event}</div>
                    <div className="text-xs text-[#6E7681]">{event.timestamp} • {event.actor}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {escrow.status === 'pending_release' && (
            <div className="flex gap-3">
              <button className="flex-1 bg-[#3CCB7F] text-[#0D1117] py-3 rounded-lg font-semibold">
                Release Funds
              </button>
              <button className="flex-1 bg-[#F85149] text-white py-3 rounded-lg font-semibold">
                Dispute
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FACTORING PAGE
// ============================================
function FactoringPage({ 
  requests,
  onViewRequest,
}: { 
  requests: FactoringRequest[];
  onViewRequest: (req: FactoringRequest) => void;
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoice Factoring</h1>
          <p className="text-[#8B949E]">Get paid now. We collect later. No banks.</p>
        </div>
        <button className="bg-[#F59E0B] text-[#0D1117] px-4 py-2 rounded-lg font-semibold">
          + Factor Invoice
        </button>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#3CCB7F]/10 border border-[#F59E0B]/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-8">
          {[
            { step: '1', title: 'Submit Invoice', desc: 'Upload your unpaid invoice' },
            { step: '2', title: 'AI Review', desc: 'We score buyer creditworthiness' },
            { step: '3', title: 'Get 95%', desc: 'Receive funds same day' },
            { step: '4', title: 'We Collect', desc: 'You get remaining 5% minus fee' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#0D1117] font-bold">
                  {s.step}
                </div>
                <div className="font-semibold mt-2 text-sm">{s.title}</div>
                <div className="text-xs text-[#8B949E]">{s.desc}</div>
              </div>
              {i < 3 && <span className="text-[#F59E0B] text-xl">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Factoring List */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Invoice</th>
                <th className="text-left p-4">Buyer</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-right p-4">Advanced</th>
                <th className="text-center p-4">Credit Score</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const status = FACTORING_STATUS_CONFIG[req.status];
                return (
                  <tr key={req.id} className="border-b border-[#1F242C] hover:bg-[#1F242C]/30">
                    <td className="p-4">
                      <div className="font-mono">{req.factorNumber}</div>
                      <div className="text-xs text-[#6E7681]">{req.invoiceNumber}</div>
                    </td>
                    <td className="p-4">{req.buyerName}</td>
                    <td className="p-4 text-right font-mono">${req.invoiceAmount.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-[#3CCB7F]">${req.advanceAmount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        req.buyerCreditScore >= 90 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                        req.buyerCreditScore >= 70 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#F85149]/20 text-[#F85149]'
                      }`}>
                        {req.buyerCreditScore}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: `${status.color}20`, color: status.color }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onViewRequest(req)}
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
// FACTORING DETAILS PAGE
// ============================================
function FactoringDetailsPage({ request, onBack }: { request: FactoringRequest; onBack: () => void }) {
  const status = FACTORING_STATUS_CONFIG[request.status];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back to Factoring
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1F242C]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-[#6E7681] font-mono mb-1">{request.factorNumber}</div>
              <h1 className="text-2xl font-bold">Factoring Details</h1>
            </div>
            <span 
              className="px-3 py-1 rounded-lg text-sm font-medium"
              style={{ backgroundColor: `${status.color}20`, color: status.color }}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Amounts */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0D1117] rounded-xl p-4 text-center">
              <div className="text-xs text-[#8B949E]">Invoice Amount</div>
              <div className="text-2xl font-bold">${request.invoiceAmount.toLocaleString()}</div>
            </div>
            <div className="bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 rounded-xl p-4 text-center">
              <div className="text-xs text-[#3CCB7F]">You Received (95%)</div>
              <div className="text-2xl font-bold text-[#3CCB7F]">${request.advanceAmount.toLocaleString()}</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4 text-center">
              <div className="text-xs text-[#8B949E]">Reserve (5%)</div>
              <div className="text-2xl font-bold">${request.reserveAmount.toLocaleString()}</div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-[#A371F7]/10 border border-[#A371F7]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-[#A371F7] mb-2">
              <span>🧠</span>
              <span className="font-semibold">AI Credit Analysis</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-sm text-[#8B949E]">Buyer Credit Score:</span>
                <span className="ml-2 font-bold text-[#3CCB7F]">{request.buyerCreditScore}/100</span>
              </div>
              <div>
                <span className="text-sm text-[#8B949E]">Payment Probability:</span>
                <span className="ml-2 font-bold text-[#3CCB7F]">{request.paymentProbability}%</span>
              </div>
            </div>
            <p className="text-sm text-[#8B949E]">{request.aiRecommendation}</p>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-xs text-[#8B949E] mb-2">Invoice</div>
              <div className="font-mono">{request.invoiceNumber}</div>
              <div className="text-sm text-[#8B949E]">Due: {request.invoiceDueDate}</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-xs text-[#8B949E] mb-2">Buyer</div>
              <div className="font-semibold">{request.buyerName}</div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="border-t border-[#1F242C] pt-6">
            <h3 className="font-semibold mb-3">Fee Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Invoice Amount</span>
                <span className="font-mono">${request.invoiceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Advance ({request.advanceRate}%)</span>
                <span className="font-mono text-[#3CCB7F]">-${request.advanceAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Factoring Fee (2%)</span>
                <span className="font-mono text-[#F59E0B]">-${request.factoringFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1F242C] font-bold">
                <span>Reserve (returned on collection)</span>
                <span>${request.reserveAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CROSS-BORDER PAGE
// ============================================
function CrossBorderPage({ wallets, rates }: { wallets: Wallet[]; rates: ExchangeRate[] }) {
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('UAH');
  const [amount, setAmount] = useState('1000');

  const rate = rates.find(r => r.from === fromCurrency && r.to === toCurrency);
  const convertedAmount = rate ? parseFloat(amount || '0') * rate.rate : 0;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Cross-Border Payments</h1>
      <p className="text-[#8B949E] mb-8">Send money internationally. Best rates. Minutes not days.</p>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        {/* Exchange Form */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Currency Exchange</h3>
          
          {/* From */}
          <div className="mb-4">
            <label className="block text-sm text-[#8B949E] mb-2">You Send</label>
            <div className="flex gap-3">
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as Currency)}
                className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
              >
                {Object.entries(CURRENCIES).filter(([_, c]) => c.type === 'fiat').map(([key, curr]) => (
                  <option key={key} value={key}>{curr.flag} {key}</option>
                ))}
              </select>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-xl font-bold"
              />
            </div>
          </div>

          {/* Rate Display */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px flex-1 bg-[#1F242C]"></div>
            <div className="bg-[#00A3FF]/20 text-[#00A3FF] px-4 py-2 rounded-full text-sm">
              1 {fromCurrency} = {rate?.rate || '—'} {toCurrency}
            </div>
            <div className="h-px flex-1 bg-[#1F242C]"></div>
          </div>

          {/* To */}
          <div className="mb-6">
            <label className="block text-sm text-[#8B949E] mb-2">Recipient Gets</label>
            <div className="flex gap-3">
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as Currency)}
                className="bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3"
              >
                {Object.entries(CURRENCIES).filter(([_, c]) => c.type === 'fiat').map(([key, curr]) => (
                  <option key={key} value={key}>{curr.flag} {key}</option>
                ))}
              </select>
              <div className="flex-1 bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 rounded-lg px-4 py-3 text-xl font-bold text-[#3CCB7F]">
                {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-[#3CCB7F] to-[#00A3FF] text-white py-4 rounded-xl font-semibold text-lg">
            Send {fromCurrency} → {toCurrency}
          </button>
        </div>

        {/* Rates Panel */}
        <div className="space-y-4">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <h3 className="font-semibold mb-3">Live Rates</h3>
            <div className="space-y-2">
              {rates.filter(r => r.from === 'USD').map((rate, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-[#0D1117] rounded">
                  <span className="text-[#8B949E]">{rate.from}/{rate.to}</span>
                  <span className="font-mono">{rate.rate}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <h3 className="font-semibold mb-3">Transfer Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Fee</span>
                <span className="text-[#3CCB7F]">0.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Settlement</span>
                <span className="text-[#3CCB7F]">~15 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Rate Lock</span>
                <span>60 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRANSACTIONS PAGE
// ============================================
function TransactionsPage({ 
  transactions,
  onViewTransaction,
}: { 
  transactions: Transaction[];
  onViewTransaction: (tx: Transaction) => void;
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">All Transactions</h1>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Transaction</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">From/To</th>
                <th className="text-right p-4">Amount</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Risk</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const status = TX_STATUS_CONFIG[tx.status];
                const curr = CURRENCIES[tx.currency];
                return (
                  <tr 
                    key={tx.id} 
                    onClick={() => onViewTransaction(tx)}
                    className="border-b border-[#1F242C] hover:bg-[#1F242C]/30 cursor-pointer"
                  >
                    <td className="p-4 font-mono">{tx.txNumber}</td>
                    <td className="p-4 capitalize">{tx.type.replace('_', ' ')}</td>
                    <td className="p-4">
                      <div className="text-xs">{tx.fromName}</div>
                      <div className="text-xs text-[#6E7681]">→ {tx.toName}</div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold">{curr.symbol}{tx.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span 
                        className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                        style={{ backgroundColor: `${status.color}20`, color: status.color }}
                      >
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        tx.aiRiskScore < 20 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                        tx.aiRiskScore < 50 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#F85149]/20 text-[#F85149]'
                      }`}>
                        {tx.aiRiskScore}%
                      </span>
                    </td>
                    <td className="p-4 text-[#8B949E]">{tx.createdAt.split(' ')[0]}</td>
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
// TRANSACTION DETAILS PAGE
// ============================================
function TransactionDetailsPage({ transaction, onBack }: { transaction: Transaction; onBack: () => void }) {
  const status = TX_STATUS_CONFIG[transaction.status];
  const curr = CURRENCIES[transaction.currency];

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white mb-6">
        ← Back
      </button>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#1F242C]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-[#6E7681] font-mono mb-1">{transaction.txNumber}</div>
              <h1 className="text-2xl font-bold capitalize">{transaction.type.replace('_', ' ')} Transaction</h1>
            </div>
            <span 
              className="px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1"
              style={{ backgroundColor: `${status.color}20`, color: status.color }}
            >
              {status.icon} {status.label}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Amount */}
          <div className="bg-gradient-to-r from-[#3CCB7F]/10 to-[#00A3FF]/10 border border-[#3CCB7F]/30 rounded-xl p-6 text-center mb-6">
            <div className="text-sm text-[#8B949E]">Amount</div>
            <div className="text-4xl font-bold">{curr.symbol}{transaction.amount.toLocaleString()}</div>
            {transaction.exchangeRate && (
              <div className="text-sm text-[#8B949E] mt-1">
                → {CURRENCIES[transaction.convertedCurrency!].symbol}{transaction.convertedAmount?.toLocaleString()} {transaction.convertedCurrency}
              </div>
            )}
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-xs text-[#F85149] mb-2">↑ From</div>
              <div className="font-semibold">{transaction.fromName}</div>
              <div className="text-sm text-[#6E7681]">{transaction.fromWallet} Wallet</div>
            </div>
            <div className="bg-[#0D1117] rounded-xl p-4">
              <div className="text-xs text-[#3CCB7F] mb-2">↓ To</div>
              <div className="font-semibold">{transaction.toName}</div>
              <div className="text-sm text-[#6E7681]">{transaction.toWallet} Wallet</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm mb-6">
            {transaction.reference && (
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Reference</span>
                <span className="font-mono">{transaction.reference}</span>
              </div>
            )}
            {transaction.description && (
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Description</span>
                <span>{transaction.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Fee</span>
              <span className="font-mono text-[#3CCB7F]">${transaction.fee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Created</span>
              <span>{transaction.createdAt}</span>
            </div>
            {transaction.completedAt && (
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Completed</span>
                <span>{transaction.completedAt}</span>
              </div>
            )}
          </div>

          {/* AI Risk */}
          <div className="bg-[#A371F7]/10 border border-[#A371F7]/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#A371F7]">
                <span>🧠</span>
                <span className="font-semibold">AI Risk Analysis</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                transaction.aiRiskScore < 20 ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
              }`}>
                Risk: {transaction.aiRiskScore}%
              </span>
            </div>
            {transaction.aiFlags.length > 0 && (
              <div className="mt-2 flex gap-2">
                {transaction.aiFlags.map((flag, i) => (
                  <span key={i} className="text-xs bg-[#1F242C] px-2 py-1 rounded">{flag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CRYPTO PAGE
// ============================================
function CryptoPage({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Crypto Rails</h1>
          <p className="text-[#8B949E]">Alternative settlement layer with stablecoins</p>
        </div>
        <span className="bg-[#A371F7]/20 text-[#A371F7] px-3 py-1 rounded-lg text-sm">Optional Feature</span>
      </div>

      {/* Crypto Wallets */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {wallets.map((wallet) => {
          const curr = CURRENCIES[wallet.currency];
          return (
            <div key={wallet.id} className="bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10 border border-[#A371F7]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{curr.flag}</span>
                <div>
                  <div className="font-bold">{curr.name}</div>
                  <div className="text-sm text-[#8B949E]">{wallet.currency}</div>
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">${wallet.balance.toLocaleString()}</div>
              <div className="text-xs text-[#6E7681] font-mono">{wallet.walletAddress}</div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-[#A371F7] text-white py-2 rounded-lg text-sm font-semibold">Send</button>
                <button className="flex-1 bg-[#1F242C] py-2 rounded-lg text-sm">Receive</button>
                <button className="flex-1 bg-[#1F242C] py-2 rounded-lg text-sm">Swap</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Why Crypto Rails?</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '🌍', title: 'Global Instant', desc: 'Send anywhere in minutes, 24/7' },
            { icon: '💵', title: 'Stable Value', desc: 'USDT/USDC pegged 1:1 to USD' },
            { icon: '🔒', title: 'Censorship Resistant', desc: 'No bank can block your funds' },
          ].map((b, i) => (
            <div key={i} className="bg-[#0D1117] rounded-lg p-4">
              <span className="text-2xl">{b.icon}</span>
              <div className="font-semibold mt-2">{b.title}</div>
              <div className="text-sm text-[#8B949E]">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADMIN PAGE
// ============================================
function AdminPage({ stats }: { stats: typeof PLATFORM_STATS }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Volume', value: `$${(stats.totalVolume / 1000000).toFixed(0)}M`, icon: '💰', color: '#3CCB7F' },
          { label: 'Monthly Volume', value: `$${(stats.monthlyVolume / 1000000).toFixed(0)}M`, icon: '📊', color: '#00A3FF' },
          { label: 'Transactions', value: stats.totalTransactions.toLocaleString(), icon: '📝', color: '#A371F7' },
          { label: 'Businesses', value: stats.activeBusinesses.toLocaleString(), icon: '🏢', color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: 'Escrow', value: `$${(stats.escrowHeld / 1000000).toFixed(1)}M`, label: 'Currently Held' },
          { title: 'Factoring', value: `$${(stats.factoringAdvanced / 1000000).toFixed(1)}M`, label: 'Advanced' },
          { title: 'Cross-Border', value: `$${(stats.crossBorderVolume / 1000000).toFixed(0)}M`, label: 'Volume' },
        ].map((item, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <div className="text-3xl font-bold text-[#3CCB7F]">{item.value}</div>
            <div className="text-sm text-[#8B949E]">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Compliance */}
      <div className="mt-6 bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Compliance & Risk</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#0D1117] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#3CCB7F]">{stats.complianceRate}%</div>
            <div className="text-sm text-[#8B949E]">KYC Verified</div>
          </div>
          <div className="bg-[#0D1117] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F85149]">${(stats.fraudBlocked / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-[#8B949E]">Fraud Blocked</div>
          </div>
          <div className="bg-[#0D1117] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#3CCB7F]">{stats.avgSettlementTime}</div>
            <div className="text-sm text-[#8B949E]">Avg Settlement</div>
          </div>
          <div className="bg-[#0D1117] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-[#8B949E]">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
