'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ============================================
// TYPES & INTERFACES
// ============================================
type TradeView = 'dashboard' | 'marketplace' | 'vendors' | 'orders' | 'logistics' | 'ai-insights' | 'analytics' | 'compliance';
type UserRole = 'admin' | 'vendor' | 'buyer' | 'logistics';
type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'disputed' | 'refunded';
type VendorTier = 'starter' | 'growth' | 'professional' | 'enterprise';
type AIInsightType = 'opportunity' | 'risk' | 'optimization' | 'prediction' | 'anomaly';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface SmartProduct {
  id: string;
  vendorId: string;
  vendorName: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  images: string[];
  basePrice: number;
  dynamicPrice: number;
  currency: string;
  minOrderQty: number;
  maxOrderQty: number;
  stock: number;
  reservedStock: number;
  leadTimeDays: number;
  rating: number;
  reviewCount: number;
  salesVelocity: number;
  demandScore: number;
  profitMargin: number;
  competitorPriceAvg: number;
  aiRecommendationScore: number;
  fraudRiskScore: number;
  qualityScore: number;
  sustainabilityRating: string;
  certifications: string[];
  specs: Record<string, string>;
  status: 'active' | 'draft' | 'out_of_stock' | 'discontinued' | 'under_review';
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SmartVendor {
  id: string;
  companyName: string;
  legalName: string;
  logo: string;
  industry: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; city: string; state: string; country: string; zip: string };
  taxId: string;
  bankAccount: { verified: boolean; last4: string };
  status: 'active' | 'pending' | 'suspended' | 'under_review' | 'rejected';
  verificationLevel: 'basic' | 'verified' | 'premium' | 'trusted';
  tier: VendorTier;
  rating: number;
  reviewCount: number;
  responseTime: string;
  fulfillmentRate: number;
  onTimeDeliveryRate: number;
  returnRate: number;
  disputeRate: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  monthlyGMV: number;
  trustScore: number;
  fraudRiskScore: number;
  complianceScore: number;
  aiHealthScore: number;
  badges: string[];
  joinedAt: string;
  lastActiveAt: string;
}

interface SmartOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  vendorId: string;
  vendorName: string;
  items: {
    productId: string;
    title: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount: number;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId: string;
  shippingAddress: {
    name: string;
    company: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    phone: string;
  };
  billingAddress: {
    name: string;
    company: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  logisticsProvider: string;
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  fraudRiskScore: number;
  aiFlags: string[];
  notes: string;
  timeline: { timestamp: string; event: string; actor: string }[];
  createdAt: string;
  updatedAt: string;
}

interface AIInsight {
  id: string;
  type: AIInsightType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  confidence: number;
  dataPoints: number;
  affectedEntities: { type: string; id: string; name: string }[];
  actions: { label: string; action: string; primary: boolean }[];
  expiresAt: string | null;
  createdAt: string;
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed';
}

// ============================================
// MOCK DATA - SMART PLATFORM
// ============================================
const PLATFORM_METRICS = {
  gmv: { total: 47890000, mtd: 4230000, growth: 18.4 },
  orders: { total: 189450, mtd: 12847, growth: 12.3 },
  vendors: { total: 2847, active: 2134, new30d: 234, growth: 8.7 },
  buyers: { total: 34560, active: 18934, new30d: 2341, growth: 15.2 },
  products: { total: 45670, active: 38940, new30d: 3420, growth: 9.8 },
  aov: { current: 253, previous: 234, growth: 8.1 },
  conversionRate: { current: 4.2, previous: 3.8, growth: 10.5 },
  repeatRate: { current: 47, previous: 42, growth: 11.9 },
  nps: { current: 72, previous: 68, growth: 5.9 },
};

const AI_METRICS = {
  fraudDetected: { count: 234, value: 890000, accuracy: 99.2 },
  pricingOptimized: { products: 12450, revenueImpact: 234000 },
  demandForecasted: { accuracy: 94.7, products: 38940 },
  recommendationsGenerated: { count: 89450, clickRate: 23.4, conversionRate: 8.7 },
  anomaliesDetected: { count: 47, resolved: 42, pending: 5 },
  vendorScored: { count: 2847, flagged: 23 },
};

const SMART_PRODUCTS: SmartProduct[] = [
  {
    id: 'sp-001',
    vendorId: 'sv-001',
    vendorName: 'TechPro Enterprise',
    title: 'Enterprise Server Cluster - 128 Core',
    description: 'High-performance server cluster with redundant power, cooling, and networking. Ideal for enterprise workloads.',
    category: 'IT Infrastructure',
    subcategory: 'Servers',
    tags: ['enterprise', 'high-performance', 'redundant', 'scalable'],
    images: ['/img/server.jpg'],
    basePrice: 45999,
    dynamicPrice: 43499,
    currency: 'USD',
    minOrderQty: 1,
    maxOrderQty: 10,
    stock: 23,
    reservedStock: 5,
    leadTimeDays: 14,
    rating: 4.9,
    reviewCount: 156,
    salesVelocity: 12.4,
    demandScore: 89,
    profitMargin: 24,
    competitorPriceAvg: 47500,
    aiRecommendationScore: 94,
    fraudRiskScore: 2,
    qualityScore: 97,
    sustainabilityRating: 'A',
    certifications: ['ISO 27001', 'Energy Star', 'CE'],
    specs: { 'CPU': '2x AMD EPYC 64-core', 'RAM': '2TB DDR5', 'Storage': '100TB NVMe' },
    status: 'active',
    featured: true,
    trending: true,
    createdAt: '2025-06-15',
    updatedAt: '2026-01-05',
  },
  {
    id: 'sp-002',
    vendorId: 'sv-002',
    vendorName: 'MedTech Global',
    title: 'Portable Ultrasound System Pro',
    description: 'AI-powered portable ultrasound with cloud connectivity, real-time diagnostics, and 15" touchscreen.',
    category: 'Medical Equipment',
    subcategory: 'Diagnostics',
    tags: ['AI-powered', 'portable', 'FDA-approved', 'cloud'],
    images: ['/img/ultrasound.jpg'],
    basePrice: 28500,
    dynamicPrice: 27999,
    currency: 'USD',
    minOrderQty: 1,
    maxOrderQty: 20,
    stock: 45,
    reservedStock: 12,
    leadTimeDays: 7,
    rating: 4.8,
    reviewCount: 234,
    salesVelocity: 18.7,
    demandScore: 94,
    profitMargin: 31,
    competitorPriceAvg: 32000,
    aiRecommendationScore: 97,
    fraudRiskScore: 1,
    qualityScore: 99,
    sustainabilityRating: 'A+',
    certifications: ['FDA', 'CE', 'ISO 13485'],
    specs: { 'Display': '15" 4K Touch', 'Battery': '8 hours', 'AI': 'Real-time diagnostics' },
    status: 'active',
    featured: true,
    trending: true,
    createdAt: '2025-08-20',
    updatedAt: '2026-01-04',
  },
  {
    id: 'sp-003',
    vendorId: 'sv-003',
    vendorName: 'Industrial Solutions Ltd',
    title: 'Automated CNC Machining Center',
    description: '5-axis CNC with AI optimization, predictive maintenance, and IoT connectivity.',
    category: 'Manufacturing',
    subcategory: 'CNC Machinery',
    tags: ['5-axis', 'AI-optimized', 'IoT', 'predictive'],
    images: ['/img/cnc.jpg'],
    basePrice: 189000,
    dynamicPrice: 179500,
    currency: 'USD',
    minOrderQty: 1,
    maxOrderQty: 5,
    stock: 8,
    reservedStock: 2,
    leadTimeDays: 45,
    rating: 4.7,
    reviewCount: 67,
    salesVelocity: 2.3,
    demandScore: 76,
    profitMargin: 18,
    competitorPriceAvg: 195000,
    aiRecommendationScore: 82,
    fraudRiskScore: 3,
    qualityScore: 95,
    sustainabilityRating: 'B+',
    certifications: ['ISO 9001', 'CE', 'UL'],
    specs: { 'Axes': '5-axis simultaneous', 'Precision': '±0.001mm', 'Spindle': '40,000 RPM' },
    status: 'active',
    featured: false,
    trending: false,
    createdAt: '2025-04-10',
    updatedAt: '2026-01-03',
  },
];

const SMART_VENDORS: SmartVendor[] = [
  {
    id: 'sv-001',
    companyName: 'TechPro Enterprise',
    legalName: 'TechPro Enterprise Solutions Inc.',
    logo: '💻',
    industry: 'IT Infrastructure',
    description: 'Leading provider of enterprise IT solutions',
    contactPerson: 'Michael Chen',
    email: 'michael@techpro.com',
    phone: '+1-555-0101',
    website: 'techpro.com',
    address: { street: '100 Tech Park Dr', city: 'San Jose', state: 'CA', country: 'USA', zip: '95110' },
    taxId: '**-***4567',
    bankAccount: { verified: true, last4: '4521' },
    status: 'active',
    verificationLevel: 'trusted',
    tier: 'enterprise',
    rating: 4.9,
    reviewCount: 1234,
    responseTime: '< 2 hours',
    fulfillmentRate: 99.2,
    onTimeDeliveryRate: 98.7,
    returnRate: 1.2,
    disputeRate: 0.3,
    totalOrders: 45670,
    totalRevenue: 23400000,
    totalProducts: 456,
    activeProducts: 423,
    monthlyGMV: 1890000,
    trustScore: 98,
    fraudRiskScore: 2,
    complianceScore: 99,
    aiHealthScore: 97,
    badges: ['Top Seller', 'Fast Shipper', 'Verified', 'Trusted'],
    joinedAt: '2022-03-15',
    lastActiveAt: '2026-01-05',
  },
  {
    id: 'sv-002',
    companyName: 'MedTech Global',
    legalName: 'MedTech Global Healthcare Inc.',
    logo: '🏥',
    industry: 'Medical Equipment',
    description: 'Innovative medical technology solutions',
    contactPerson: 'Dr. Sarah Williams',
    email: 'sarah@medtechglobal.com',
    phone: '+1-555-0102',
    website: 'medtechglobal.com',
    address: { street: '200 Medical Center Blvd', city: 'Boston', state: 'MA', country: 'USA', zip: '02115' },
    taxId: '**-***8901',
    bankAccount: { verified: true, last4: '7832' },
    status: 'active',
    verificationLevel: 'trusted',
    tier: 'enterprise',
    rating: 4.8,
    reviewCount: 2341,
    responseTime: '< 1 hour',
    fulfillmentRate: 99.5,
    onTimeDeliveryRate: 99.1,
    returnRate: 0.8,
    disputeRate: 0.2,
    totalOrders: 67890,
    totalRevenue: 34500000,
    totalProducts: 789,
    activeProducts: 734,
    monthlyGMV: 2340000,
    trustScore: 99,
    fraudRiskScore: 1,
    complianceScore: 100,
    aiHealthScore: 99,
    badges: ['Top Seller', 'Premium Support', 'Verified', 'Trusted', 'Healthcare Certified'],
    joinedAt: '2021-11-20',
    lastActiveAt: '2026-01-05',
  },
];

const SMART_ORDERS: SmartOrder[] = [
  {
    id: 'so-001',
    orderNumber: 'ORD-2026-010501',
    buyerId: 'sb-001',
    buyerName: 'John Anderson',
    buyerCompany: 'Global Tech Solutions',
    vendorId: 'sv-001',
    vendorName: 'TechPro Enterprise',
    items: [{ productId: 'sp-001', title: 'Enterprise Server Cluster', sku: 'SRV-128C', quantity: 3, unitPrice: 43499, totalPrice: 130497, discount: 0 }],
    subtotal: 130497,
    discount: 6525,
    shipping: 2500,
    tax: 11158,
    total: 137630,
    currency: 'USD',
    status: 'processing',
    paymentStatus: 'captured',
    paymentMethod: 'Wire Transfer',
    paymentId: 'PAY-8847293',
    shippingAddress: { name: 'John Anderson', company: 'Global Tech Solutions', street: '500 Enterprise Way', city: 'Seattle', state: 'WA', country: 'USA', zip: '98101', phone: '+1-555-1234' },
    billingAddress: { name: 'Global Tech Solutions', company: 'Global Tech Solutions', street: '500 Enterprise Way', city: 'Seattle', state: 'WA', country: 'USA', zip: '98101' },
    logisticsProvider: 'FedEx Freight',
    trackingNumber: '',
    estimatedDelivery: '2026-01-19',
    actualDelivery: null,
    fraudRiskScore: 3,
    aiFlags: [],
    notes: 'Priority handling requested',
    timeline: [
      { timestamp: '2026-01-05 09:23:15', event: 'Order placed', actor: 'Buyer' },
      { timestamp: '2026-01-05 09:25:42', event: 'Payment authorized', actor: 'System' },
      { timestamp: '2026-01-05 10:15:00', event: 'Order confirmed', actor: 'Vendor' },
      { timestamp: '2026-01-05 14:30:00', event: 'Processing started', actor: 'Vendor' },
    ],
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
  },
];

const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-001',
    type: 'opportunity',
    priority: 'high',
    category: 'Revenue Optimization',
    title: 'Dynamic Pricing Opportunity Detected',
    description: 'Analysis of 234 products shows pricing below market average with high demand scores. Implementing dynamic pricing could increase revenue.',
    impact: '+$127,000 estimated monthly revenue',
    recommendation: 'Enable AI dynamic pricing for identified products in IT Infrastructure and Medical Equipment categories.',
    confidence: 94,
    dataPoints: 12450,
    affectedEntities: [
      { type: 'product', id: 'sp-001', name: 'Enterprise Server Cluster' },
      { type: 'product', id: 'sp-002', name: 'Portable Ultrasound System' },
    ],
    actions: [
      { label: 'Enable Dynamic Pricing', action: 'enable_dynamic_pricing', primary: true },
      { label: 'View Analysis', action: 'view_analysis', primary: false },
    ],
    expiresAt: '2026-01-12',
    createdAt: '2026-01-05 08:00:00',
    status: 'new',
  },
  {
    id: 'ai-002',
    type: 'risk',
    priority: 'critical',
    category: 'Fraud Prevention',
    title: 'Suspicious Order Pattern Detected',
    description: 'AI detected unusual ordering behavior: 3 new accounts, same IP range, high-value orders with expedited shipping to freight forwarder addresses.',
    impact: 'Potential fraud exposure: $89,400',
    recommendation: 'Hold orders for manual review. Require additional verification from buyers.',
    confidence: 97,
    dataPoints: 847,
    affectedEntities: [
      { type: 'order', id: 'ORD-2026-010498', name: 'Order from NewBuyer LLC' },
      { type: 'order', id: 'ORD-2026-010499', name: 'Order from FastTrade Inc' },
      { type: 'order', id: 'ORD-2026-010500', name: 'Order from QuickBuy Co' },
    ],
    actions: [
      { label: 'Hold Orders', action: 'hold_orders', primary: true },
      { label: 'Review Details', action: 'review_fraud', primary: false },
    ],
    expiresAt: null,
    createdAt: '2026-01-05 11:34:22',
    status: 'new',
  },
  {
    id: 'ai-003',
    type: 'prediction',
    priority: 'medium',
    category: 'Demand Forecasting',
    title: 'Q1 Demand Surge Predicted',
    description: 'Historical patterns and market signals indicate 34% increase in Medical Equipment orders in next 6 weeks.',
    impact: 'Estimated additional GMV: $2.1M',
    recommendation: 'Notify top medical vendors to increase inventory. Consider promotional campaigns.',
    confidence: 89,
    dataPoints: 45670,
    affectedEntities: [
      { type: 'category', id: 'medical', name: 'Medical Equipment' },
      { type: 'vendor', id: 'sv-002', name: 'MedTech Global' },
    ],
    actions: [
      { label: 'Notify Vendors', action: 'notify_vendors', primary: true },
      { label: 'View Forecast', action: 'view_forecast', primary: false },
    ],
    expiresAt: '2026-02-15',
    createdAt: '2026-01-04 16:00:00',
    status: 'acknowledged',
  },
  {
    id: 'ai-004',
    type: 'anomaly',
    priority: 'medium',
    category: 'Vendor Health',
    title: 'Vendor Performance Degradation',
    description: 'Industrial Solutions Ltd showing 23% increase in late shipments and 45% increase in support tickets over last 14 days.',
    impact: 'Risk of negative reviews and buyer churn',
    recommendation: 'Proactively reach out to vendor. Consider temporary badge removal if issues persist.',
    confidence: 92,
    dataPoints: 234,
    affectedEntities: [
      { type: 'vendor', id: 'sv-003', name: 'Industrial Solutions Ltd' },
    ],
    actions: [
      { label: 'Contact Vendor', action: 'contact_vendor', primary: true },
      { label: 'View Metrics', action: 'view_metrics', primary: false },
    ],
    expiresAt: '2026-01-10',
    createdAt: '2026-01-05 06:00:00',
    status: 'in_progress',
  },
  {
    id: 'ai-005',
    type: 'optimization',
    priority: 'low',
    category: 'Search & Discovery',
    title: 'Search Relevance Improvement Available',
    description: 'New AI model trained on recent data shows 18% improvement in search relevance. Ready for deployment.',
    impact: '+12% expected search-to-purchase conversion',
    recommendation: 'Deploy updated search model during low-traffic window.',
    confidence: 96,
    dataPoints: 890000,
    affectedEntities: [],
    actions: [
      { label: 'Schedule Deployment', action: 'schedule_deployment', primary: true },
      { label: 'View A/B Results', action: 'view_ab_results', primary: false },
    ],
    expiresAt: '2026-01-20',
    createdAt: '2026-01-03 12:00:00',
    status: 'new',
  },
];

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string; step: number }> = {
  pending: { label: 'Pending', color: '#8B949E', icon: '⏳', step: 1 },
  confirmed: { label: 'Confirmed', color: '#00A3FF', icon: '✓', step: 2 },
  paid: { label: 'Paid', color: '#00A3FF', icon: '💳', step: 3 },
  processing: { label: 'Processing', color: '#A371F7', icon: '⚙️', step: 4 },
  shipped: { label: 'Shipped', color: '#F59E0B', icon: '📦', step: 5 },
  in_transit: { label: 'In Transit', color: '#F59E0B', icon: '🚚', step: 6 },
  delivered: { label: 'Delivered', color: '#3CCB7F', icon: '📍', step: 7 },
  completed: { label: 'Completed', color: '#3CCB7F', icon: '✓', step: 8 },
  cancelled: { label: 'Cancelled', color: '#F85149', icon: '✗', step: -1 },
  disputed: { label: 'Disputed', color: '#F85149', icon: '⚠️', step: -1 },
  refunded: { label: 'Refunded', color: '#8B949E', icon: '↩️', step: -1 },
};

const VENDOR_TIERS: Record<VendorTier, { name: string; color: string; price: number; commission: number; products: number; features: string[] }> = {
  starter: { name: 'Starter', color: '#8B949E', price: 0, commission: 8, products: 25, features: ['Basic listing', 'Standard support', 'Basic analytics'] },
  growth: { name: 'Growth', color: '#00A3FF', price: 149, commission: 5, products: 250, features: ['Featured listings', 'Priority support', 'Advanced analytics', 'API access'] },
  professional: { name: 'Professional', color: '#A371F7', price: 399, commission: 3, products: 1000, features: ['Premium placement', 'Dedicated support', 'Full analytics', 'Bulk upload', 'Custom storefront'] },
  enterprise: { name: 'Enterprise', color: '#F59E0B', price: 999, commission: 1.5, products: -1, features: ['Unlimited products', 'Account manager', 'Custom integrations', 'SLA guarantee', 'White-label', 'API priority'] },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function SmartTradePlatformPage() {
  const [activeView, setActiveView] = useState<TradeView>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A3FF] via-[#A371F7] to-[#3CCB7F] rounded-xl flex items-center justify-center font-bold text-[#0D1117]">
                ST
              </div>
            </Link>
            <div>
              <div className="font-bold text-lg">Smart Trade</div>
              <div className="text-xs text-[#6E7681]">AI-Powered Marketplace</div>
            </div>
            <span className="text-xs bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white px-2 py-0.5 rounded-full font-mono">v10.0</span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, vendors, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161B22] border border-[#1F242C] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-[#00A3FF] focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B949E]">🔍</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6E7681] bg-[#1F242C] px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                aiPanelOpen ? 'bg-[#A371F7]/20 text-[#A371F7]' : 'bg-[#161B22] text-[#8B949E]'
              }`}
            >
              <span className="text-lg">🧠</span>
              <span>AI Insights</span>
              <span className="bg-[#F85149] text-white text-xs px-1.5 py-0.5 rounded-full">5</span>
            </button>

            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
              <option value="buyer">Buyer</option>
              <option value="logistics">Logistics</option>
            </select>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-[#161B22] rounded-lg">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F85149] rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] rounded-full flex items-center justify-center text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed top-16 left-0 right-0 bg-[#0D1117] border-b border-[#1F242C] z-40">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
              { id: 'vendors', label: 'Vendors', icon: '🏪' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'logistics', label: 'Logistics', icon: '🚚' },
              { id: 'ai-insights', label: 'AI Center', icon: '🧠' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'compliance', label: 'Compliance', icon: '🛡️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as TradeView)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white shadow-lg shadow-[#00A3FF]/20'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-12 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className={`grid gap-6 ${aiPanelOpen ? 'grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
            <div>
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'marketplace' && <MarketplaceView products={SMART_PRODUCTS} />}
              {activeView === 'vendors' && <VendorsView vendors={SMART_VENDORS} />}
              {activeView === 'orders' && <OrdersView orders={SMART_ORDERS} />}
              {activeView === 'logistics' && <LogisticsView />}
              {activeView === 'ai-insights' && <AIInsightsView insights={AI_INSIGHTS} />}
              {activeView === 'analytics' && <AnalyticsView />}
              {activeView === 'compliance' && <ComplianceView />}
            </div>

            {/* AI Insights Panel */}
            {aiPanelOpen && (
              <aside className="space-y-4">
                <div className="bg-gradient-to-br from-[#A371F7]/20 to-[#00A3FF]/20 border border-[#A371F7]/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <div className="font-semibold">AI Assistant</div>
                      <div className="text-xs text-[#8B949E]">Smart Trade Intelligence</div>
                    </div>
                  </div>
                  <div className="text-sm text-[#8B949E] mb-3">
                    Monitoring {PLATFORM_METRICS.products.active.toLocaleString()} products, {PLATFORM_METRICS.vendors.active.toLocaleString()} vendors, and {PLATFORM_METRICS.orders.mtd.toLocaleString()} orders this month.
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0D1117] rounded-lg p-2">
                      <div className="text-[#3CCB7F] font-bold">{AI_METRICS.fraudDetected.accuracy}%</div>
                      <div className="text-[#6E7681]">Fraud detection</div>
                    </div>
                    <div className="bg-[#0D1117] rounded-lg p-2">
                      <div className="text-[#00A3FF] font-bold">{AI_METRICS.demandForecasted.accuracy}%</div>
                      <div className="text-[#6E7681]">Forecast accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Priority Insights */}
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-[#1F242C] flex items-center justify-between">
                    <span className="font-semibold text-sm">Priority Insights</span>
                    <span className="text-xs text-[#F85149] bg-[#F85149]/20 px-2 py-0.5 rounded-full">
                      {AI_INSIGHTS.filter(i => i.status === 'new').length} new
                    </span>
                  </div>
                  <div className="divide-y divide-[#1F242C] max-h-[400px] overflow-y-auto">
                    {AI_INSIGHTS.slice(0, 4).map((insight) => (
                      <div key={insight.id} className="p-3 hover:bg-[#1F242C]/50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-2">
                          <span className={`text-lg ${
                            insight.type === 'risk' ? '' :
                            insight.type === 'opportunity' ? '' :
                            insight.type === 'prediction' ? '' :
                            insight.type === 'anomaly' ? '' : ''
                          }`}>
                            {insight.type === 'risk' ? '🚨' :
                             insight.type === 'opportunity' ? '💡' :
                             insight.type === 'prediction' ? '🔮' :
                             insight.type === 'anomaly' ? '⚠️' : '⚙️'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                insight.priority === 'critical' ? 'bg-[#F85149]/20 text-[#F85149]' :
                                insight.priority === 'high' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                                insight.priority === 'medium' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                                'bg-[#8B949E]/20 text-[#8B949E]'
                              }`}>
                                {insight.priority}
                              </span>
                            </div>
                            <div className="font-medium text-sm mt-1 truncate">{insight.title}</div>
                            <div className="text-xs text-[#6E7681] mt-0.5">{insight.confidence}% confidence</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[#1F242C]">
                    <button 
                      onClick={() => setActiveView('ai-insights')}
                      className="w-full text-center text-xs text-[#00A3FF] py-2 hover:underline"
                    >
                      View All Insights →
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
                  <div className="font-semibold text-sm mb-3">Quick Actions</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Run Fraud Scan', icon: '🔍' },
                      { label: 'Update Pricing', icon: '💰' },
                      { label: 'Generate Report', icon: '📄' },
                      { label: 'Notify Vendors', icon: '📢' },
                    ].map((action, i) => (
                      <button 
                        key={i}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-[#0D1117] rounded-lg text-sm hover:bg-[#1F242C] transition-colors"
                      >
                        <span>{action.icon}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// DASHBOARD VIEW
// ============================================
function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total GMV', value: `$${(PLATFORM_METRICS.gmv.total / 1000000).toFixed(1)}M`, sub: `MTD: $${(PLATFORM_METRICS.gmv.mtd / 1000000).toFixed(1)}M`, change: PLATFORM_METRICS.gmv.growth, icon: '💰', color: '#3CCB7F' },
          { label: 'Orders', value: PLATFORM_METRICS.orders.total.toLocaleString(), sub: `MTD: ${PLATFORM_METRICS.orders.mtd.toLocaleString()}`, change: PLATFORM_METRICS.orders.growth, icon: '📦', color: '#00A3FF' },
          { label: 'Active Vendors', value: PLATFORM_METRICS.vendors.active.toLocaleString(), sub: `+${PLATFORM_METRICS.vendors.new30d} this month`, change: PLATFORM_METRICS.vendors.growth, icon: '🏪', color: '#A371F7' },
          { label: 'Active Buyers', value: PLATFORM_METRICS.buyers.active.toLocaleString(), sub: `+${PLATFORM_METRICS.buyers.new30d} this month`, change: PLATFORM_METRICS.buyers.growth, icon: '👥', color: '#F59E0B' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 hover:border-[#3D444D] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded-full">
                +{stat.change}%
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
            <div className="text-xs text-[#6E7681] mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Performance */}
      <div className="bg-gradient-to-r from-[#A371F7]/10 via-[#00A3FF]/10 to-[#3CCB7F]/10 border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧠</span>
          <div>
            <h3 className="font-semibold">AI Engine Performance</h3>
            <p className="text-sm text-[#8B949E]">Real-time intelligent operations</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Fraud Blocked', value: `$${(AI_METRICS.fraudDetected.value / 1000).toFixed(0)}K`, sub: `${AI_METRICS.fraudDetected.count} attempts`, icon: '🛡️' },
            { label: 'Pricing Optimized', value: `${AI_METRICS.pricingOptimized.products.toLocaleString()}`, sub: `+$${(AI_METRICS.pricingOptimized.revenueImpact / 1000).toFixed(0)}K revenue`, icon: '💰' },
            { label: 'Demand Forecast', value: `${AI_METRICS.demandForecasted.accuracy}%`, sub: `${AI_METRICS.demandForecasted.products.toLocaleString()} products`, icon: '📈' },
            { label: 'Recommendations', value: `${(AI_METRICS.recommendationsGenerated.count / 1000).toFixed(0)}K`, sub: `${AI_METRICS.recommendationsGenerated.conversionRate}% conversion`, icon: '💡' },
            { label: 'Anomalies', value: AI_METRICS.anomaliesDetected.count.toString(), sub: `${AI_METRICS.anomaliesDetected.resolved} resolved`, icon: '⚠️' },
          ].map((metric, i) => (
            <div key={i} className="bg-[#0D1117]/50 rounded-lg p-4 text-center">
              <span className="text-2xl">{metric.icon}</span>
              <div className="text-xl font-bold mt-2">{metric.value}</div>
              <div className="text-xs text-[#8B949E]">{metric.label}</div>
              <div className="text-xs text-[#6E7681]">{metric.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Avg Order Value', value: `$${PLATFORM_METRICS.aov.current}`, change: PLATFORM_METRICS.aov.growth },
          { label: 'Conversion Rate', value: `${PLATFORM_METRICS.conversionRate.current}%`, change: PLATFORM_METRICS.conversionRate.growth },
          { label: 'Repeat Purchase', value: `${PLATFORM_METRICS.repeatRate.current}%`, change: PLATFORM_METRICS.repeatRate.growth },
          { label: 'NPS Score', value: PLATFORM_METRICS.nps.current.toString(), change: PLATFORM_METRICS.nps.growth },
        ].map((metric, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8B949E]">{metric.label}</span>
              <span className="text-xs text-[#3CCB7F]">+{metric.change}%</span>
            </div>
            <div className="text-2xl font-bold mt-2">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MARKETPLACE VIEW
// ============================================
function MarketplaceView({ products }: { products: SmartProduct[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Smart Marketplace</h2>
          <p className="text-sm text-[#8B949E]">AI-powered product discovery and dynamic pricing</p>
        </div>
        <button className="bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#00A3FF]/50 transition-colors">
            <div className="h-1 bg-gradient-to-r from-[#00A3FF] to-[#A371F7]"></div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {product.featured && <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded">⭐ Featured</span>}
                  {product.trending && <span className="text-xs bg-[#F85149]/20 text-[#F85149] px-2 py-0.5 rounded">🔥 Trending</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#F59E0B]">★</span>
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-xs text-[#6E7681]">({product.reviewCount})</span>
                </div>
              </div>

              <h3 className="font-semibold mb-2">{product.title}</h3>
              <p className="text-sm text-[#8B949E] mb-4 line-clamp-2">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-[#6E7681]">Dynamic Price</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#3CCB7F]">${product.dynamicPrice.toLocaleString()}</span>
                    {product.dynamicPrice < product.basePrice && (
                      <span className="text-xs text-[#8B949E] line-through">${product.basePrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6E7681]">Stock</div>
                  <div className="text-lg font-bold">
                    {product.stock - product.reservedStock}
                    <span className="text-xs text-[#8B949E] font-normal"> ({product.reservedStock} reserved)</span>
                  </div>
                </div>
              </div>

              {/* AI Scores */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'AI Score', value: product.aiRecommendationScore, color: '#A371F7' },
                  { label: 'Demand', value: product.demandScore, color: '#00A3FF' },
                  { label: 'Quality', value: product.qualityScore, color: '#3CCB7F' },
                  { label: 'Risk', value: 100 - product.fraudRiskScore, color: product.fraudRiskScore < 10 ? '#3CCB7F' : '#F59E0B' },
                ].map((score, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-bold" style={{ color: score.color }}>{score.value}</div>
                    <div className="text-xs text-[#6E7681]">{score.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1F242C]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8B949E]">{product.vendorName}</span>
                  <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-1.5 py-0.5 rounded">{product.sustainabilityRating}</span>
                </div>
                <button className="bg-[#00A3FF] text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                  View Details
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
// VENDORS VIEW
// ============================================
function VendorsView({ vendors }: { vendors: SmartVendor[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Vendor Intelligence</h2>
          <p className="text-sm text-[#8B949E]">AI-scored vendor management and monitoring</p>
        </div>
        <button className="bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Invite Vendor
        </button>
      </div>

      <div className="space-y-4">
        {vendors.map((vendor) => {
          const tier = VENDOR_TIERS[vendor.tier];
          return (
            <div key={vendor.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 hover:border-[#3D444D] transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{vendor.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{vendor.companyName}</h3>
                    {vendor.verificationLevel === 'trusted' && <span className="text-[#00A3FF]" title="Trusted">✓</span>}
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>
                      {tier.name}
                    </span>
                    {vendor.badges.slice(0, 3).map((badge, i) => (
                      <span key={i} className="text-xs bg-[#1F242C] px-2 py-0.5 rounded">{badge}</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#8B949E] mb-3">{vendor.description}</p>
                  
                  <div className="grid grid-cols-6 gap-4">
                    <div>
                      <div className="text-xs text-[#6E7681]">AI Health</div>
                      <div className="text-lg font-bold text-[#A371F7]">{vendor.aiHealthScore}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7681]">Trust Score</div>
                      <div className="text-lg font-bold text-[#3CCB7F]">{vendor.trustScore}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7681]">On-Time</div>
                      <div className="text-lg font-bold">{vendor.onTimeDeliveryRate}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7681]">Monthly GMV</div>
                      <div className="text-lg font-bold text-[#3CCB7F]">${(vendor.monthlyGMV / 1000000).toFixed(2)}M</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7681]">Products</div>
                      <div className="text-lg font-bold">{vendor.activeProducts}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6E7681]">Rating</div>
                      <div className="text-lg font-bold"><span className="text-[#F59E0B]">★</span> {vendor.rating}</div>
                    </div>
                  </div>
                </div>
                <button className="text-[#00A3FF] hover:underline text-sm">View Profile →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// ORDERS VIEW
// ============================================
function OrdersView({ orders }: { orders: SmartOrder[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Order Intelligence</h2>
          <p className="text-sm text-[#8B949E]">AI-monitored order tracking and fraud prevention</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm">
            <option>All Orders</option>
            <option>Flagged by AI</option>
            <option>High Value</option>
          </select>
          <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg text-sm font-medium">
            Export
          </button>
        </div>
      </div>

      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        {orders.map((order) => {
          const status = ORDER_STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="p-5 border-b border-[#1F242C] last:border-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{order.orderNumber}</span>
                    <span 
                      className="text-xs px-2 py-1 rounded inline-flex items-center gap-1"
                      style={{ backgroundColor: `${status.color}20`, color: status.color }}
                    >
                      {status.icon} {status.label}
                    </span>
                    {order.fraudRiskScore > 50 && (
                      <span className="text-xs bg-[#F85149]/20 text-[#F85149] px-2 py-1 rounded">
                        ⚠️ High Risk
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#8B949E] mt-1">
                    {order.buyerCompany} → {order.vendorName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${order.total.toLocaleString()}</div>
                  <div className="text-xs text-[#6E7681]">{order.createdAt}</div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="flex items-center gap-2 mb-4">
                {['pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered'].map((step, i) => {
                  const stepConfig = ORDER_STATUS_CONFIG[step as OrderStatus];
                  const isActive = stepConfig.step <= status.step;
                  const isCurrent = step === order.status;
                  return (
                    <div key={step} className="flex items-center gap-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isCurrent ? 'ring-2 ring-offset-2 ring-offset-[#161B22]' : ''
                        }`}
                        style={{ 
                          backgroundColor: isActive ? `${stepConfig.color}20` : '#1F242C',
                          color: isActive ? stepConfig.color : '#6E7681',
                          outline: isCurrent ? `2px solid ${stepConfig.color}` : 'none'
                        }}
                      >
                        {stepConfig.icon}
                      </div>
                      {i < 5 && <div className={`w-8 h-0.5 ${isActive ? 'bg-[#3CCB7F]' : 'bg-[#1F242C]'}`}></div>}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-[#8B949E]">
                  <span>{order.items.length} item(s)</span>
                  <span>{order.paymentMethod}</span>
                  {order.trackingNumber && <span className="font-mono">{order.trackingNumber}</span>}
                </div>
                <button className="text-[#00A3FF] hover:underline text-sm">View Details →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// LOGISTICS VIEW
// ============================================
function LogisticsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Smart Logistics</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 text-center">
        <span className="text-4xl">🚚</span>
        <p className="text-[#8B949E] mt-4">AI-optimized logistics management coming soon</p>
      </div>
    </div>
  );
}

// ============================================
// AI INSIGHTS VIEW
// ============================================
function AIInsightsView({ insights }: { insights: AIInsight[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">AI Intelligence Center</h2>
          <p className="text-sm text-[#8B949E]">Real-time insights and recommendations</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={`bg-[#161B22] border rounded-xl overflow-hidden ${
              insight.priority === 'critical' ? 'border-[#F85149]' :
              insight.priority === 'high' ? 'border-[#F59E0B]' : 'border-[#1F242C]'
            }`}
          >
            <div className={`px-5 py-4 border-b border-[#1F242C] ${
              insight.priority === 'critical' ? 'bg-[#F85149]/10' :
              insight.priority === 'high' ? 'bg-[#F59E0B]/10' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {insight.type === 'risk' ? '🚨' :
                     insight.type === 'opportunity' ? '💡' :
                     insight.type === 'prediction' ? '🔮' :
                     insight.type === 'anomaly' ? '⚠️' : '⚙️'}
                  </span>
                  <div>
                    <div className="font-semibold">{insight.title}</div>
                    <div className="text-xs text-[#6E7681]">{insight.category} • {insight.confidence}% confidence</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  insight.priority === 'critical' ? 'bg-[#F85149]/20 text-[#F85149]' :
                  insight.priority === 'high' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                  insight.priority === 'medium' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
                  'bg-[#8B949E]/20 text-[#8B949E]'
                }`}>
                  {insight.priority}
                </span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#8B949E] mb-4">{insight.description}</p>
              <div className="bg-[#0D1117] rounded-lg p-4 mb-4">
                <div className="text-xs text-[#6E7681] mb-1">Impact</div>
                <div className="text-sm font-medium text-[#3CCB7F]">{insight.impact}</div>
              </div>
              <div className="bg-[#0D1117] rounded-lg p-4 mb-4">
                <div className="text-xs text-[#6E7681] mb-1">Recommendation</div>
                <div className="text-sm">{insight.recommendation}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6E7681]">{insight.dataPoints.toLocaleString()} data points analyzed</span>
                <div className="flex gap-2">
                  {insight.actions.map((action, i) => (
                    <button 
                      key={i}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        action.primary 
                          ? 'bg-[#00A3FF] text-white' 
                          : 'bg-[#1F242C] text-[#8B949E]'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ANALYTICS VIEW
// ============================================
function AnalyticsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Smart Analytics</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">GMV Trend</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {[2.8, 3.1, 2.9, 3.4, 3.8, 4.2].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-[#00A3FF] to-[#A371F7] rounded-t" style={{ height: `${(v / 4.5) * 100}%` }}></div>
                <div className="text-xs text-[#8B949E] mt-2">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4">AI Impact</h3>
          <div className="space-y-4">
            {[
              { label: 'Fraud Prevention', value: '$890K saved', percent: 99 },
              { label: 'Dynamic Pricing', value: '+$234K revenue', percent: 87 },
              { label: 'Demand Accuracy', value: '94.7% accurate', percent: 95 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span className="text-[#3CCB7F]">{item.value}</span>
                </div>
                <div className="h-2 bg-[#1F242C] rounded-full">
                  <div className="h-full bg-gradient-to-r from-[#00A3FF] to-[#3CCB7F] rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPLIANCE VIEW
// ============================================
function ComplianceView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Compliance & Trust</h2>
      <div className="grid grid-cols-3 gap-4">
        {['GDPR', 'SOC 2 Type II', 'PCI DSS', 'ISO 27001', 'CCPA', 'HIPAA Ready'].map((cert) => (
          <div key={cert} className="bg-[#161B22] border border-[#3CCB7F]/30 rounded-xl p-4 text-center">
            <span className="text-2xl text-[#3CCB7F]">✓</span>
            <div className="font-medium mt-2">{cert}</div>
            <div className="text-xs text-[#8B949E]">Compliant</div>
          </div>
        ))}
      </div>
    </div>
  );
}
