'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ============================================
// TYPES & INTERFACES (API-aligned)
// ============================================
type PageView = 
  | 'marketplace' | 'product' | 'checkout' | 'orders'
  | 'vendor-dashboard' | 'vendor-products' | 'vendor-analytics'
  | 'orders-pipeline' | 'logistics' | 'admin' | 'compliance'
  | 'ai-insights' | 'ai-assistant';

type UserRole = 'buyer' | 'vendor' | 'logistics' | 'admin';
type OrderStatus = 'pending' | 'paid' | 'packed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'issue';
type VendorTier = 'starter' | 'growth' | 'professional' | 'enterprise';
type FraudSeverity = 'low' | 'medium' | 'high' | 'critical';
type AIInsightType = 'opportunity' | 'risk' | 'optimization' | 'prediction' | 'anomaly';

// API Schemas (OpenAPI 3.0.3 aligned)
interface ProductAIScores {
  recommendation: number;
  demand: number;
  quality: number;
  risk: number;
}

interface ProductSummary {
  id: string;
  title: string;
  vendorId: string;
  vendorName: string;
  priceBase: number;
  priceAI: number;
  currency: string;
  category: string;
  subcategory: string;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  aiScores: ProductAIScores;
  trending: boolean;
  featured: boolean;
}

interface ProductDetail extends ProductSummary {
  description: string;
  specs: Record<string, string>;
  certifications: string[];
  sustainabilityRating: string;
  minOrderQty: number;
  maxOrderQty: number;
  leadTimeDays: number;
  salesVelocity: number;
  competitorPriceAvg: number;
}

interface OrderItem {
  productId: string;
  title: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  vendorId: string;
  vendorName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
  paymentMethod: string;
  logisticsProvider: string;
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderWithAI extends Order {
  fraudFlags: FraudFlag[];
  riskScore: number;
  aiNotes: string;
}

interface FraudFlag {
  id: string;
  orderId: string;
  type: string;
  severity: FraudSeverity;
  message: string;
  createdAt: string;
}

interface VendorWithHealth {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  contactPerson: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'under_review';
  verificationLevel: 'basic' | 'verified' | 'premium' | 'trusted';
  tier: VendorTier;
  rating: number;
  reviewCount: number;
  aiHealthScore: number;
  trustScore: number;
  fraudRiskScore: number;
  complianceScore: number;
  metrics: {
    onTimeDelivery: number;
    cancellationRate: number;
    disputeRate: number;
    returnRate: number;
    responseTime: string;
    fulfillmentRate: number;
  };
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  monthlyGMV: number;
  badges: string[];
  joinedAt: string;
}

interface PricingRecommendation {
  productId: string;
  basePrice: number;
  recommendedPrice: number;
  confidence: number;
  expectedDemandChange: number;
  rationale: string;
  topFeatures: string[];
}

interface DemandForecast {
  productId: string;
  horizonDays: number;
  points: { date: string; expectedDemand: number; confidence: number }[];
  stockoutRisk: boolean;
  overstockRisk: boolean;
  restockRecommendation: string;
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
  actions: { label: string; action: string; primary: boolean }[];
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed';
  createdAt: string;
}

interface ComplianceDashboard {
  vendorCompliance: {
    vendorId: string;
    vendorName: string;
    status: string;
    certifications: string[];
    riskScore: number;
  }[];
  documentsMissing: string[];
  highRiskVendors: string[];
  overallScore: number;
}

// ============================================
// MOCK DATA (Production-grade)
// ============================================
const CATEGORIES = [
  { id: 'it-infrastructure', name: 'IT Infrastructure', icon: '💻', count: 3420 },
  { id: 'medical-equipment', name: 'Medical Equipment', icon: '🏥', count: 2180 },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', count: 1890 },
  { id: 'office-supplies', name: 'Office Supplies', icon: '📎', count: 4567 },
  { id: 'construction', name: 'Construction', icon: '🏗️', count: 2340 },
  { id: 'automotive', name: 'Automotive', icon: '🚗', count: 2890 },
  { id: 'food-beverage', name: 'Food & Beverage', icon: '🍎', count: 3210 },
  { id: 'textiles', name: 'Textiles', icon: '👔', count: 1780 },
];

const PRODUCTS: ProductDetail[] = [
  {
    id: 'prod-001',
    title: 'Enterprise Server Cluster 128-Core',
    vendorId: 'vnd-001',
    vendorName: 'TechPro Enterprise',
    priceBase: 45999,
    priceAI: 43499,
    currency: 'USD',
    category: 'it-infrastructure',
    subcategory: 'Servers',
    stock: 23,
    rating: 4.9,
    reviewCount: 156,
    images: ['/img/server-1.jpg', '/img/server-2.jpg'],
    description: 'High-performance server cluster with redundant power, cooling, and networking. Ideal for enterprise workloads, AI/ML training, and high-availability applications.',
    specs: { 'CPU': '2x AMD EPYC 64-core', 'RAM': '2TB DDR5 ECC', 'Storage': '100TB NVMe RAID', 'Network': '4x 100GbE' },
    certifications: ['ISO 27001', 'Energy Star', 'CE', 'FCC'],
    sustainabilityRating: 'A',
    minOrderQty: 1,
    maxOrderQty: 10,
    leadTimeDays: 14,
    salesVelocity: 12.4,
    competitorPriceAvg: 47500,
    aiScores: { recommendation: 94, demand: 89, quality: 97, risk: 3 },
    trending: true,
    featured: true,
  },
  {
    id: 'prod-002',
    title: 'AI-Powered Portable Ultrasound System',
    vendorId: 'vnd-002',
    vendorName: 'MedTech Global',
    priceBase: 28500,
    priceAI: 27999,
    currency: 'USD',
    category: 'medical-equipment',
    subcategory: 'Diagnostics',
    stock: 45,
    rating: 4.8,
    reviewCount: 234,
    images: ['/img/ultrasound.jpg'],
    description: 'Next-generation portable ultrasound with AI-powered diagnostics, cloud connectivity, and 15" 4K touchscreen display.',
    specs: { 'Display': '15" 4K Touch', 'Battery': '8 hours', 'AI': 'Real-time diagnostics', 'Connectivity': 'WiFi 6, 5G' },
    certifications: ['FDA', 'CE', 'ISO 13485', 'HIPAA'],
    sustainabilityRating: 'A+',
    minOrderQty: 1,
    maxOrderQty: 20,
    leadTimeDays: 7,
    salesVelocity: 18.7,
    competitorPriceAvg: 32000,
    aiScores: { recommendation: 97, demand: 94, quality: 99, risk: 1 },
    trending: true,
    featured: true,
  },
  {
    id: 'prod-003',
    title: '5-Axis CNC Machining Center with AI Optimization',
    vendorId: 'vnd-003',
    vendorName: 'Industrial Solutions Ltd',
    priceBase: 189000,
    priceAI: 179500,
    currency: 'USD',
    category: 'manufacturing',
    subcategory: 'CNC Machinery',
    stock: 8,
    rating: 4.7,
    reviewCount: 67,
    images: ['/img/cnc.jpg'],
    description: 'Advanced 5-axis simultaneous CNC with AI optimization, predictive maintenance, IoT connectivity, and Industry 4.0 integration.',
    specs: { 'Axes': '5-axis simultaneous', 'Precision': '±0.001mm', 'Spindle': '40,000 RPM', 'Table': '800x600mm' },
    certifications: ['ISO 9001', 'CE', 'UL'],
    sustainabilityRating: 'B+',
    minOrderQty: 1,
    maxOrderQty: 5,
    leadTimeDays: 45,
    salesVelocity: 2.3,
    competitorPriceAvg: 195000,
    aiScores: { recommendation: 82, demand: 76, quality: 95, risk: 5 },
    trending: false,
    featured: false,
  },
  {
    id: 'prod-004',
    title: 'Ergonomic Executive Office Chair Pro',
    vendorId: 'vnd-004',
    vendorName: 'Office Plus',
    priceBase: 899,
    priceAI: 849,
    currency: 'USD',
    category: 'office-supplies',
    subcategory: 'Furniture',
    stock: 340,
    rating: 4.6,
    reviewCount: 1892,
    images: ['/img/chair.jpg'],
    description: 'Premium ergonomic chair with advanced lumbar support, 4D armrests, breathable mesh, and 12-year warranty.',
    specs: { 'Max Weight': '150kg', 'Warranty': '12 years', 'Adjustments': '14-point', 'Material': 'Premium Mesh' },
    certifications: ['BIFMA', 'Greenguard'],
    sustainabilityRating: 'A',
    minOrderQty: 1,
    maxOrderQty: 100,
    leadTimeDays: 5,
    salesVelocity: 45.2,
    competitorPriceAvg: 950,
    aiScores: { recommendation: 91, demand: 88, quality: 92, risk: 2 },
    trending: true,
    featured: false,
  },
];

const VENDORS: VendorWithHealth[] = [
  {
    id: 'vnd-001',
    companyName: 'TechPro Enterprise',
    logo: '💻',
    industry: 'IT Infrastructure',
    contactPerson: 'Michael Chen',
    email: 'michael@techpro.com',
    status: 'active',
    verificationLevel: 'trusted',
    tier: 'enterprise',
    rating: 4.9,
    reviewCount: 1234,
    aiHealthScore: 97,
    trustScore: 98,
    fraudRiskScore: 2,
    complianceScore: 99,
    metrics: { onTimeDelivery: 98.7, cancellationRate: 0.3, disputeRate: 0.2, returnRate: 1.2, responseTime: '< 2 hours', fulfillmentRate: 99.2 },
    totalOrders: 45670,
    totalRevenue: 23400000,
    totalProducts: 456,
    activeProducts: 423,
    monthlyGMV: 1890000,
    badges: ['Top Seller', 'Fast Shipper', 'Verified', 'Trusted'],
    joinedAt: '2022-03-15',
  },
  {
    id: 'vnd-002',
    companyName: 'MedTech Global',
    logo: '🏥',
    industry: 'Medical Equipment',
    contactPerson: 'Dr. Sarah Williams',
    email: 'sarah@medtechglobal.com',
    status: 'active',
    verificationLevel: 'trusted',
    tier: 'enterprise',
    rating: 4.8,
    reviewCount: 2341,
    aiHealthScore: 99,
    trustScore: 99,
    fraudRiskScore: 1,
    complianceScore: 100,
    metrics: { onTimeDelivery: 99.1, cancellationRate: 0.2, disputeRate: 0.1, returnRate: 0.8, responseTime: '< 1 hour', fulfillmentRate: 99.5 },
    totalOrders: 67890,
    totalRevenue: 34500000,
    totalProducts: 789,
    activeProducts: 734,
    monthlyGMV: 2340000,
    badges: ['Top Seller', 'Premium Support', 'Verified', 'Trusted', 'Healthcare Certified'],
    joinedAt: '2021-11-20',
  },
  {
    id: 'vnd-003',
    companyName: 'Industrial Solutions Ltd',
    logo: '🏭',
    industry: 'Manufacturing',
    contactPerson: 'James Miller',
    email: 'james@industrialsolutions.com',
    status: 'active',
    verificationLevel: 'verified',
    tier: 'professional',
    rating: 4.5,
    reviewCount: 456,
    aiHealthScore: 78,
    trustScore: 82,
    fraudRiskScore: 8,
    complianceScore: 89,
    metrics: { onTimeDelivery: 91.2, cancellationRate: 2.1, disputeRate: 1.8, returnRate: 3.2, responseTime: '< 8 hours', fulfillmentRate: 94.5 },
    totalOrders: 12340,
    totalRevenue: 8900000,
    totalProducts: 234,
    activeProducts: 198,
    monthlyGMV: 567000,
    badges: ['Verified'],
    joinedAt: '2023-06-10',
  },
];

const ORDERS: OrderWithAI[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2026-010501',
    buyerId: 'buy-001',
    buyerName: 'John Anderson',
    buyerCompany: 'Global Tech Solutions',
    vendorId: 'vnd-001',
    vendorName: 'TechPro Enterprise',
    items: [{ productId: 'prod-001', title: 'Enterprise Server Cluster', sku: 'SRV-128C', quantity: 3, unitPrice: 43499, totalPrice: 130497, discount: 0 }],
    subtotal: 130497,
    discount: 6525,
    shipping: 2500,
    tax: 11158,
    total: 137630,
    currency: 'USD',
    status: 'packed',
    paymentStatus: 'captured',
    paymentMethod: 'Wire Transfer',
    logisticsProvider: 'FedEx Freight',
    trackingNumber: 'FX-8847293847',
    estimatedDelivery: '2026-01-19',
    actualDelivery: null,
    createdAt: '2026-01-05 09:23:15',
    updatedAt: '2026-01-05 16:45:00',
    fraudFlags: [],
    riskScore: 3,
    aiNotes: 'Low risk. Verified buyer with 12 previous orders.',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2026-010502',
    buyerId: 'buy-002',
    buyerName: 'City Hospital Procurement',
    buyerCompany: 'City General Hospital',
    vendorId: 'vnd-002',
    vendorName: 'MedTech Global',
    items: [{ productId: 'prod-002', title: 'AI-Powered Portable Ultrasound', sku: 'US-AI-PRO', quantity: 5, unitPrice: 27999, totalPrice: 139995, discount: 7000 }],
    subtotal: 139995,
    discount: 7000,
    shipping: 890,
    tax: 0,
    total: 133885,
    currency: 'USD',
    status: 'shipped',
    paymentStatus: 'captured',
    paymentMethod: 'Purchase Order',
    logisticsProvider: 'UPS Healthcare',
    trackingNumber: 'UPS-HC-99128473',
    estimatedDelivery: '2026-01-08',
    actualDelivery: null,
    createdAt: '2026-01-04 14:12:33',
    updatedAt: '2026-01-05 08:30:00',
    fraudFlags: [],
    riskScore: 1,
    aiNotes: 'Trusted healthcare institution. Priority handling.',
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2026-010503',
    buyerId: 'buy-003',
    buyerName: 'Unknown Buyer LLC',
    buyerCompany: 'NewTrade LLC',
    vendorId: 'vnd-001',
    vendorName: 'TechPro Enterprise',
    items: [{ productId: 'prod-001', title: 'Enterprise Server Cluster', sku: 'SRV-128C', quantity: 10, unitPrice: 43499, totalPrice: 434990, discount: 0 }],
    subtotal: 434990,
    discount: 0,
    shipping: 4500,
    tax: 39149,
    total: 478639,
    currency: 'USD',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Credit Card',
    logisticsProvider: '',
    trackingNumber: '',
    estimatedDelivery: '',
    actualDelivery: null,
    createdAt: '2026-01-05 11:45:22',
    updatedAt: '2026-01-05 11:45:22',
    fraudFlags: [
      { id: 'ff-001', orderId: 'ord-003', type: 'velocity', severity: 'high', message: 'New account, high-value order within 24 hours of registration', createdAt: '2026-01-05 11:45:23' },
      { id: 'ff-002', orderId: 'ord-003', type: 'geo_mismatch', severity: 'medium', message: 'Billing address country differs from IP geolocation', createdAt: '2026-01-05 11:45:23' },
    ],
    riskScore: 78,
    aiNotes: 'HIGH RISK: Manual review required. Multiple fraud indicators detected.',
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2026-010498',
    buyerId: 'buy-004',
    buyerName: 'BuildRight Construction',
    buyerCompany: 'BuildRight Inc.',
    vendorId: 'vnd-003',
    vendorName: 'Industrial Solutions Ltd',
    items: [{ productId: 'prod-003', title: '5-Axis CNC Machining Center', sku: 'CNC-5AX', quantity: 2, unitPrice: 179500, totalPrice: 359000, discount: 17950 }],
    subtotal: 359000,
    discount: 17950,
    shipping: 8900,
    tax: 30595,
    total: 380545,
    currency: 'USD',
    status: 'in_transit',
    paymentStatus: 'captured',
    paymentMethod: 'Wire Transfer',
    logisticsProvider: 'Freight Logistics Pro',
    trackingNumber: 'FLP-2026010498',
    estimatedDelivery: '2026-01-25',
    actualDelivery: null,
    createdAt: '2025-12-28 10:15:00',
    updatedAt: '2026-01-04 14:00:00',
    fraudFlags: [],
    riskScore: 5,
    aiNotes: 'Established buyer. Large industrial order. Normal pattern.',
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-2026-010499',
    buyerId: 'buy-005',
    buyerName: 'Corporate HQ Ltd',
    buyerCompany: 'Global Corp',
    vendorId: 'vnd-004',
    vendorName: 'Office Plus',
    items: [{ productId: 'prod-004', title: 'Ergonomic Executive Office Chair', sku: 'CHAIR-ERG-PRO', quantity: 50, unitPrice: 849, totalPrice: 42450, discount: 4245 }],
    subtotal: 42450,
    discount: 4245,
    shipping: 890,
    tax: 3422,
    total: 42517,
    currency: 'USD',
    status: 'delivered',
    paymentStatus: 'captured',
    paymentMethod: 'Invoice (Net 30)',
    logisticsProvider: 'DHL Express',
    trackingNumber: 'DHL-9987234',
    estimatedDelivery: '2026-01-03',
    actualDelivery: '2026-01-03',
    createdAt: '2025-12-20 09:00:00',
    updatedAt: '2026-01-03 16:30:00',
    fraudFlags: [],
    riskScore: 2,
    aiNotes: 'Repeat buyer. Excellent payment history.',
  },
];

const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-001',
    type: 'risk',
    priority: 'critical',
    category: 'Fraud Prevention',
    title: 'High-Risk Order Detected',
    description: 'Order ORD-2026-010503 flagged with multiple fraud indicators: new account, high-value order, geo mismatch.',
    impact: 'Potential fraud exposure: $478,639',
    recommendation: 'Hold order for manual review. Require additional KYC verification.',
    confidence: 97,
    dataPoints: 847,
    actions: [
      { label: 'Hold Order', action: 'hold_order', primary: true },
      { label: 'Review Details', action: 'view_order', primary: false },
    ],
    status: 'new',
    createdAt: '2026-01-05 11:45:25',
  },
  {
    id: 'ai-002',
    type: 'opportunity',
    priority: 'high',
    category: 'Revenue Optimization',
    title: 'Dynamic Pricing Opportunity',
    description: '234 products identified with pricing below market average and high demand scores. AI pricing can increase revenue.',
    impact: '+$127,000 estimated monthly revenue',
    recommendation: 'Enable AI dynamic pricing for IT Infrastructure and Medical Equipment categories.',
    confidence: 94,
    dataPoints: 12450,
    actions: [
      { label: 'Enable Pricing', action: 'enable_pricing', primary: true },
      { label: 'View Analysis', action: 'view_analysis', primary: false },
    ],
    status: 'new',
    createdAt: '2026-01-05 08:00:00',
  },
  {
    id: 'ai-003',
    type: 'prediction',
    priority: 'medium',
    category: 'Demand Forecasting',
    title: 'Q1 Medical Equipment Surge',
    description: 'Historical patterns and market signals indicate 34% increase in Medical Equipment orders in next 6 weeks.',
    impact: 'Estimated additional GMV: $2.1M',
    recommendation: 'Notify top medical vendors to increase inventory. Consider promotional campaigns.',
    confidence: 89,
    dataPoints: 45670,
    actions: [
      { label: 'Notify Vendors', action: 'notify_vendors', primary: true },
      { label: 'View Forecast', action: 'view_forecast', primary: false },
    ],
    status: 'acknowledged',
    createdAt: '2026-01-04 16:00:00',
  },
  {
    id: 'ai-004',
    type: 'anomaly',
    priority: 'medium',
    category: 'Vendor Health',
    title: 'Vendor Performance Degradation',
    description: 'Industrial Solutions Ltd showing 23% increase in late shipments and 45% increase in support tickets over 14 days.',
    impact: 'Risk of negative reviews and buyer churn',
    recommendation: 'Proactively reach out to vendor. Consider temporary badge removal if issues persist.',
    confidence: 92,
    dataPoints: 234,
    actions: [
      { label: 'Contact Vendor', action: 'contact_vendor', primary: true },
      { label: 'View Metrics', action: 'view_metrics', primary: false },
    ],
    status: 'in_progress',
    createdAt: '2026-01-05 06:00:00',
  },
  {
    id: 'ai-005',
    type: 'optimization',
    priority: 'low',
    category: 'Search & Discovery',
    title: 'Search Model Update Ready',
    description: 'New AI model trained on recent data shows 18% improvement in search relevance. Ready for deployment.',
    impact: '+12% expected search-to-purchase conversion',
    recommendation: 'Deploy updated search model during low-traffic window.',
    confidence: 96,
    dataPoints: 890000,
    actions: [
      { label: 'Schedule Deploy', action: 'schedule_deployment', primary: true },
      { label: 'View A/B Results', action: 'view_ab', primary: false },
    ],
    status: 'new',
    createdAt: '2026-01-03 12:00:00',
  },
];

const DEMAND_FORECAST: DemandForecast = {
  productId: 'prod-001',
  horizonDays: 30,
  points: [
    { date: '2026-01-06', expectedDemand: 12, confidence: 94 },
    { date: '2026-01-13', expectedDemand: 15, confidence: 91 },
    { date: '2026-01-20', expectedDemand: 18, confidence: 88 },
    { date: '2026-01-27', expectedDemand: 14, confidence: 85 },
    { date: '2026-02-03', expectedDemand: 16, confidence: 82 },
  ],
  stockoutRisk: false,
  overstockRisk: false,
  restockRecommendation: 'Current stock (23 units) sufficient for 30-day forecast. Monitor weekly.',
};

const PRICING_RECOMMENDATION: PricingRecommendation = {
  productId: 'prod-001',
  basePrice: 45999,
  recommendedPrice: 43499,
  confidence: 94,
  expectedDemandChange: 12,
  rationale: 'Competitor pricing analysis shows average market price at $47,500. Recommended price of $43,499 offers competitive advantage while maintaining 24% margin. Expected 12% demand increase.',
  topFeatures: ['Competitor pricing', 'Demand elasticity', 'Seasonal trend', 'Inventory level'],
};

const PLATFORM_METRICS = {
  gmv: { total: 47890000, mtd: 4230000, growth: 18.4 },
  orders: { total: 189450, mtd: 12847, pending: 234, processing: 456, shipped: 1234 },
  vendors: { total: 2847, active: 2134, pending: 89, flagged: 23 },
  buyers: { total: 34560, active: 18934, new30d: 2341 },
  ai: { fraudBlocked: 890000, pricingOptimized: 12450, forecastAccuracy: 94.7 },
};

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string; bgColor: string }> = {
  pending: { label: 'Pending', color: '#8B949E', icon: '⏳', bgColor: '#8B949E20' },
  paid: { label: 'Paid', color: '#00A3FF', icon: '💳', bgColor: '#00A3FF20' },
  packed: { label: 'Packed', color: '#A371F7', icon: '📦', bgColor: '#A371F720' },
  shipped: { label: 'Shipped', color: '#F59E0B', icon: '🚀', bgColor: '#F59E0B20' },
  in_transit: { label: 'In Transit', color: '#F59E0B', icon: '🚚', bgColor: '#F59E0B20' },
  delivered: { label: 'Delivered', color: '#3CCB7F', icon: '✓', bgColor: '#3CCB7F20' },
  cancelled: { label: 'Cancelled', color: '#F85149', icon: '✗', bgColor: '#F8514920' },
  issue: { label: 'Issue', color: '#F85149', icon: '⚠️', bgColor: '#F8514920' },
};

const VENDOR_TIERS: Record<VendorTier, { name: string; color: string; commission: number }> = {
  starter: { name: 'Starter', color: '#8B949E', commission: 8 },
  growth: { name: 'Growth', color: '#00A3FF', commission: 5 },
  professional: { name: 'Professional', color: '#A371F7', commission: 3 },
  enterprise: { name: 'Enterprise', color: '#F59E0B', commission: 1.5 },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function BusinessTradeModulePage() {
  const [currentPage, setCurrentPage] = useState<PageView>('marketplace');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Navigation items based on role
  const getNavItems = (role: UserRole) => {
    const base = [
      { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    ];
    
    if (role === 'buyer') {
      return [...base,
        { id: 'orders', label: 'My Orders', icon: '📦' },
      ];
    }
    
    if (role === 'vendor') {
      return [...base,
        { id: 'vendor-dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'vendor-products', label: 'Products', icon: '📋' },
        { id: 'vendor-analytics', label: 'Analytics', icon: '📈' },
        { id: 'orders-pipeline', label: 'Orders', icon: '📦' },
      ];
    }
    
    if (role === 'logistics') {
      return [
        { id: 'logistics', label: 'Shipments', icon: '🚚' },
        { id: 'orders-pipeline', label: 'Pipeline', icon: '📦' },
      ];
    }
    
    // Admin sees everything
    return [
      { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
      { id: 'vendor-dashboard', label: 'Vendors', icon: '🏪' },
      { id: 'orders-pipeline', label: 'Orders', icon: '📦' },
      { id: 'logistics', label: 'Logistics', icon: '🚚' },
      { id: 'admin', label: 'Admin', icon: '⚙️' },
      { id: 'compliance', label: 'Compliance', icon: '🛡️' },
      { id: 'ai-insights', label: 'AI Center', icon: '🧠' },
    ];
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* ============================================ */}
      {/* TOP BAR */}
      {/* ============================================ */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A3FF] via-[#A371F7] to-[#3CCB7F] rounded-xl flex items-center justify-center font-bold text-[#0D1117]">
                BT
              </div>
              <div>
                <div className="font-bold">Business Trade</div>
                <div className="text-xs text-[#6E7681]">Cognitive Commerce v10.5</div>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, vendors, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161B22] border border-[#1F242C] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-[#00A3FF] focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7681]">🔍</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6E7681] bg-[#1F242C] px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* AI Panel Toggle */}
            <button 
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                aiPanelOpen 
                  ? 'bg-gradient-to-r from-[#A371F7]/20 to-[#00A3FF]/20 text-[#A371F7] border border-[#A371F7]/30' 
                  : 'bg-[#161B22] text-[#8B949E] border border-transparent'
              }`}
            >
              <span>🧠</span>
              <span>AI</span>
              <span className="bg-[#F85149] text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {AI_INSIGHTS.filter(i => i.status === 'new').length}
              </span>
            </button>

            {/* Role Switcher */}
            <select
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value as UserRole);
                setCurrentPage('marketplace');
              }}
              className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm"
            >
              <option value="admin">👑 Admin</option>
              <option value="vendor">🏪 Vendor</option>
              <option value="buyer">🛒 Buyer</option>
              <option value="logistics">🚚 Logistics</option>
            </select>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-[#161B22] rounded-lg">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F85149] rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] rounded-full flex items-center justify-center text-sm font-bold">
              {userRole[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* NAVIGATION */}
      {/* ============================================ */}
      <nav className="fixed top-16 left-0 right-0 bg-[#0D1117] border-b border-[#1F242C] z-40">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {getNavItems(userRole).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as PageView)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white shadow-lg shadow-[#00A3FF]/20'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="pt-[120px] pb-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className={`grid gap-6 ${aiPanelOpen ? 'grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
            {/* Page Content */}
            <div className="min-w-0">
              {currentPage === 'marketplace' && (
                <MarketplacePage 
                  products={PRODUCTS} 
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onProductClick={(p) => {
                    setSelectedProduct(p);
                    setCurrentPage('product');
                  }}
                />
              )}
              {currentPage === 'product' && selectedProduct && (
                <ProductPage 
                  product={selectedProduct}
                  pricingRec={PRICING_RECOMMENDATION}
                  demandForecast={DEMAND_FORECAST}
                  onBack={() => setCurrentPage('marketplace')}
                />
              )}
              {currentPage === 'orders-pipeline' && (
                <OrdersPipelinePage orders={ORDERS} />
              )}
              {currentPage === 'vendor-dashboard' && (
                <VendorDashboardPage vendors={VENDORS} metrics={PLATFORM_METRICS} />
              )}
              {currentPage === 'vendor-analytics' && (
                <VendorAnalyticsPage forecast={DEMAND_FORECAST} pricing={PRICING_RECOMMENDATION} />
              )}
              {currentPage === 'logistics' && (
                <LogisticsDashboardPage orders={ORDERS} />
              )}
              {currentPage === 'admin' && (
                <AdminPanelPage vendors={VENDORS} orders={ORDERS} metrics={PLATFORM_METRICS} />
              )}
              {currentPage === 'compliance' && (
                <ComplianceDashboardPage vendors={VENDORS} />
              )}
              {currentPage === 'ai-insights' && (
                <AIInsightsPage insights={AI_INSIGHTS} />
              )}
            </div>

            {/* AI Insights Panel (Global) */}
            {aiPanelOpen && (
              <AIInsightsPanel 
                insights={AI_INSIGHTS} 
                onViewAll={() => setCurrentPage('ai-insights')}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================
// 01. MARKETPLACE PAGE
// ============================================
function MarketplacePage({ 
  products, 
  categories,
  selectedCategory,
  setSelectedCategory,
  onProductClick 
}: { 
  products: ProductDetail[];
  categories: typeof CATEGORIES;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  onProductClick: (p: ProductDetail) => void;
}) {
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            !selectedCategory 
              ? 'bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white' 
              : 'bg-[#161B22] text-[#8B949E] hover:text-white'
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white' 
                : 'bg-[#161B22] text-[#8B949E] hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span className="text-xs opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Product Grid (4 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
        ))}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onClick }: { product: ProductDetail; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden hover:border-[#00A3FF]/50 transition-all cursor-pointer group"
    >
      {/* Image Placeholder */}
      <div className="h-40 bg-gradient-to-br from-[#1F242C] to-[#0D1117] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
        {CATEGORIES.find(c => c.id === product.category)?.icon || '📦'}
      </div>
      
      <div className="p-4">
        {/* Badges */}
        <div className="flex gap-2 mb-2">
          {product.featured && <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded">⭐ Featured</span>}
          {product.trending && <span className="text-xs bg-[#F85149]/20 text-[#F85149] px-2 py-0.5 rounded">🔥 Hot</span>}
        </div>
        
        {/* Title */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-[#00A3FF] transition-colors">
          {product.title}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-[#3CCB7F]">${product.priceAI.toLocaleString()}</span>
          {product.priceAI < product.priceBase && (
            <span className="text-xs text-[#8B949E] line-through">${product.priceBase.toLocaleString()}</span>
          )}
        </div>
        
        {/* AI Scores */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          {[
            { label: 'AI', value: product.aiScores.recommendation, color: '#A371F7' },
            { label: 'Demand', value: product.aiScores.demand, color: '#00A3FF' },
            { label: 'Quality', value: product.aiScores.quality, color: '#3CCB7F' },
            { label: 'Risk', value: 100 - product.aiScores.risk, color: '#3CCB7F' },
          ].map((score) => (
            <div key={score.label} className="text-center">
              <div className="text-xs font-bold" style={{ color: score.color }}>{score.value}</div>
              <div className="text-[10px] text-[#6E7681]">{score.label}</div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1F242C]">
          <div className="flex items-center gap-1">
            <span className="text-[#F59E0B]">★</span>
            <span className="text-xs">{product.rating}</span>
            <span className="text-xs text-[#6E7681]">({product.reviewCount})</span>
          </div>
          <span className="text-xs text-[#6E7681]">{product.stock} in stock</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 02. PRODUCT PAGE
// ============================================
function ProductPage({ 
  product, 
  pricingRec,
  demandForecast,
  onBack 
}: { 
  product: ProductDetail;
  pricingRec: PricingRecommendation;
  demandForecast: DemandForecast;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-[#8B949E] hover:text-white">
        ← Back to Marketplace
      </button>
      
      <div className="grid grid-cols-[1fr_400px] gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 flex items-center justify-center h-80">
            <span className="text-8xl">{CATEGORIES.find(c => c.id === product.category)?.icon || '📦'}</span>
          </div>
          
          {/* Specs Table */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <h3 className="font-semibold mb-4">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-[#1F242C] last:border-0">
                  <span className="text-[#8B949E]">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Product Scores */}
          <div className="bg-gradient-to-r from-[#A371F7]/10 to-[#00A3FF]/10 border border-[#A371F7]/30 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span>🧠</span> AI Product Analysis
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Recommendation', value: product.aiScores.recommendation, color: '#A371F7' },
                { label: 'Demand Score', value: product.aiScores.demand, color: '#00A3FF' },
                { label: 'Quality Score', value: product.aiScores.quality, color: '#3CCB7F' },
                { label: 'Risk Score', value: product.aiScores.risk, color: product.aiScores.risk < 10 ? '#3CCB7F' : '#F59E0B' },
              ].map((score) => (
                <div key={score.label} className="bg-[#0D1117]/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: score.color }}>{score.value}</div>
                  <div className="text-xs text-[#8B949E]">{score.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Title & Vendor */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.featured && <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded">⭐ Featured</span>}
              {product.trending && <span className="text-xs bg-[#F85149]/20 text-[#F85149] px-2 py-1 rounded">🔥 Trending</span>}
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">{product.sustainabilityRating}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-3 text-sm text-[#8B949E]">
              <span>{product.vendorName}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-[#F59E0B]">★</span> {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>
          
          {/* Price Block */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-[#8B949E]">AI Optimized Price</div>
                <div className="text-3xl font-bold text-[#3CCB7F]">${product.priceAI.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#8B949E]">Base Price</div>
                <div className="text-lg text-[#8B949E] line-through">${product.priceBase.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-xs text-[#6E7681] bg-[#0D1117] rounded-lg p-3">
              <span className="text-[#A371F7]">🧠 AI:</span> {pricingRec.rationale.substring(0, 100)}...
            </div>
          </div>
          
          {/* Stock & Delivery */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-[#8B949E]">In Stock</div>
                <div className="text-xl font-bold">{product.stock} units</div>
              </div>
              <div>
                <div className="text-sm text-[#8B949E]">Lead Time</div>
                <div className="text-xl font-bold">{product.leadTimeDays} days</div>
              </div>
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min={product.minOrderQty} 
                max={product.maxOrderQty}
                defaultValue={product.minOrderQty}
                className="w-24 bg-[#161B22] border border-[#1F242C] rounded-lg px-4 py-3 text-center"
              />
              <button className="flex-1 bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00A3FF]/20 transition-all">
                Add to Cart
              </button>
            </div>
            <button className="w-full bg-[#161B22] border border-[#1F242C] py-3 rounded-xl hover:bg-[#1F242C] transition-colors">
              Request Quote
            </button>
          </div>
          
          {/* Certifications */}
          <div className="flex flex-wrap gap-2">
            {product.certifications.map((cert) => (
              <span key={cert} className="text-xs bg-[#1F242C] px-3 py-1.5 rounded-lg">{cert}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 07. ORDERS PIPELINE (KANBAN)
// ============================================
function OrdersPipelinePage({ orders }: { orders: OrderWithAI[] }) {
  const columns: OrderStatus[] = ['pending', 'paid', 'packed', 'shipped', 'in_transit', 'delivered', 'issue'];
  
  const getOrdersByStatus = (status: OrderStatus) => {
    if (status === 'issue') {
      return orders.filter(o => o.riskScore > 50 || o.fraudFlags.length > 0);
    }
    return orders.filter(o => o.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Orders Pipeline</h2>
        <div className="flex gap-2">
          <select className="bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-2 text-sm">
            <option>All Vendors</option>
          </select>
          <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg text-sm font-medium">
            Export
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((status) => {
          const config = ORDER_STATUS_CONFIG[status];
          const statusOrders = getOrdersByStatus(status);
          
          return (
            <div key={status} className="flex-shrink-0 w-80">
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
                {/* Column Header */}
                <div 
                  className="px-4 py-3 border-b border-[#1F242C] flex items-center justify-between"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="font-medium" style={{ color: config.color }}>{config.label}</span>
                  </div>
                  <span className="text-xs bg-[#0D1117] px-2 py-1 rounded-full">{statusOrders.length}</span>
                </div>
                
                {/* Orders */}
                <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {statusOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {statusOrders.length === 0 && (
                    <div className="text-center text-[#6E7681] py-8 text-sm">
                      No orders
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order }: { order: OrderWithAI }) {
  const hasRisk = order.riskScore > 50 || order.fraudFlags.length > 0;
  
  return (
    <div className={`bg-[#0D1117] border rounded-lg p-3 cursor-pointer hover:border-[#3D444D] transition-colors ${
      hasRisk ? 'border-[#F85149]' : 'border-[#1F242C]'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-medium">{order.orderNumber}</span>
        {hasRisk && <span className="text-xs bg-[#F85149]/20 text-[#F85149] px-1.5 py-0.5 rounded">⚠️ Risk</span>}
      </div>
      <div className="text-sm mb-2">{order.buyerCompany}</div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#3CCB7F]">${order.total.toLocaleString()}</span>
        <span className="text-xs text-[#6E7681]">{order.items.length} item(s)</span>
      </div>
      {order.trackingNumber && (
        <div className="mt-2 pt-2 border-t border-[#1F242C] text-xs text-[#6E7681]">
          📦 {order.trackingNumber}
        </div>
      )}
    </div>
  );
}

// ============================================
// 04. VENDOR DASHBOARD PAGE
// ============================================
function VendorDashboardPage({ vendors, metrics }: { vendors: VendorWithHealth[]; metrics: typeof PLATFORM_METRICS }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Vendor Management</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: metrics.vendors.total.toLocaleString(), icon: '🏪', color: '#00A3FF' },
          { label: 'Active', value: metrics.vendors.active.toLocaleString(), icon: '✓', color: '#3CCB7F' },
          { label: 'Pending Review', value: metrics.vendors.pending.toString(), icon: '⏳', color: '#F59E0B' },
          { label: 'Flagged', value: metrics.vendors.flagged.toString(), icon: '⚠️', color: '#F85149' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-sm text-[#8B949E]">{kpi.label}</div>
          </div>
        ))}
      </div>
      
      {/* Vendors Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Vendor</th>
                <th className="text-center p-4">AI Health</th>
                <th className="text-center p-4">Trust</th>
                <th className="text-center p-4">On-Time</th>
                <th className="text-right p-4">Monthly GMV</th>
                <th className="text-center p-4">Tier</th>
                <th className="text-center p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => {
                const tier = VENDOR_TIERS[vendor.tier];
                return (
                  <tr key={vendor.id} className="border-b border-[#1F242C] hover:bg-[#1F242C]/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{vendor.logo}</span>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {vendor.companyName}
                            {vendor.verificationLevel === 'trusted' && <span className="text-[#00A3FF]">✓</span>}
                          </div>
                          <div className="text-xs text-[#6E7681]">{vendor.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-lg font-bold ${
                        vendor.aiHealthScore >= 90 ? 'text-[#3CCB7F]' :
                        vendor.aiHealthScore >= 70 ? 'text-[#F59E0B]' : 'text-[#F85149]'
                      }`}>
                        {vendor.aiHealthScore}
                      </span>
                    </td>
                    <td className="p-4 text-center">{vendor.trustScore}</td>
                    <td className="p-4 text-center">{vendor.metrics.onTimeDelivery}%</td>
                    <td className="p-4 text-right font-mono text-[#3CCB7F]">
                      ${(vendor.monthlyGMV / 1000000).toFixed(2)}M
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>
                        {tier.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        vendor.status === 'active' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' :
                        vendor.status === 'pending' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#F85149]/20 text-[#F85149]'
                      }`}>
                        {vendor.status}
                      </span>
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
// 06. VENDOR ANALYTICS PAGE
// ============================================
function VendorAnalyticsPage({ forecast, pricing }: { forecast: DemandForecast; pricing: PricingRecommendation }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Vendor Analytics</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Demand Forecast */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>🔮</span> Demand Forecast (30 days)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {forecast.points.map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-[#00A3FF] to-[#A371F7] rounded-t transition-all hover:opacity-80"
                  style={{ height: `${(point.expectedDemand / 20) * 100}%` }}
                ></div>
                <div className="text-xs text-[#8B949E] mt-2">{point.date.split('-')[2]}</div>
                <div className="text-xs text-[#6E7681]">{point.expectedDemand}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#0D1117] rounded-lg text-sm text-[#8B949E]">
            {forecast.restockRecommendation}
          </div>
        </div>
        
        {/* Price Optimization */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>💰</span> AI Price Optimization
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-sm text-[#8B949E]">Current</div>
              <div className="text-2xl font-bold">${pricing.basePrice.toLocaleString()}</div>
            </div>
            <div className="bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 rounded-lg p-4 text-center">
              <div className="text-sm text-[#3CCB7F]">AI Recommended</div>
              <div className="text-2xl font-bold text-[#3CCB7F]">${pricing.recommendedPrice.toLocaleString()}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8B949E]">Confidence</span>
              <span>{pricing.confidence}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8B949E]">Expected Demand Change</span>
              <span className="text-[#3CCB7F]">+{pricing.expectedDemandChange}%</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#0D1117] rounded-lg text-sm text-[#8B949E]">
            {pricing.rationale}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 08. LOGISTICS DASHBOARD PAGE
// ============================================
function LogisticsDashboardPage({ orders }: { orders: OrderWithAI[] }) {
  const shippedOrders = orders.filter(o => ['shipped', 'in_transit', 'packed'].includes(o.status));
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Logistics Dashboard</h2>
      
      {/* Shipments Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold">Active Shipments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Tracking</th>
                <th className="text-left p-4">Provider</th>
                <th className="text-left p-4">Destination</th>
                <th className="text-left p-4">ETA</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shippedOrders.map((order) => {
                const status = ORDER_STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="border-b border-[#1F242C]">
                    <td className="p-4 font-mono">{order.orderNumber}</td>
                    <td className="p-4 font-mono text-[#00A3FF]">{order.trackingNumber || '—'}</td>
                    <td className="p-4">{order.logisticsProvider || '—'}</td>
                    <td className="p-4 text-[#8B949E]">{order.buyerCompany}</td>
                    <td className="p-4">{order.estimatedDelivery}</td>
                    <td className="p-4 text-center">
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: status.bgColor, color: status.color }}
                      >
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-[#00A3FF] hover:underline text-xs">Update</button>
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
// 09. ADMIN PANEL PAGE
// ============================================
function AdminPanelPage({ 
  vendors, 
  orders, 
  metrics 
}: { 
  vendors: VendorWithHealth[]; 
  orders: OrderWithAI[]; 
  metrics: typeof PLATFORM_METRICS;
}) {
  const flaggedOrders = orders.filter(o => o.riskScore > 50);
  const pendingVendors = vendors.filter(v => v.status === 'pending' || v.status === 'under_review');
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Fraud Blocked (MTD)', value: `$${(metrics.ai.fraudBlocked / 1000).toFixed(0)}K`, icon: '🛡️', color: '#3CCB7F' },
          { label: 'High-Risk Orders', value: flaggedOrders.length.toString(), icon: '⚠️', color: '#F85149' },
          { label: 'Pending Vendors', value: pendingVendors.length.toString(), icon: '⏳', color: '#F59E0B' },
          { label: 'AI Accuracy', value: `${metrics.ai.forecastAccuracy}%`, icon: '🧠', color: '#A371F7' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm text-[#8B949E]">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Fraud Detection */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C] bg-[#F85149]/10">
            <h3 className="font-semibold text-[#F85149]">🚨 Fraud Detection Queue</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {flaggedOrders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{order.orderNumber}</span>
                  <span className="text-xs bg-[#F85149]/20 text-[#F85149] px-2 py-1 rounded">
                    Risk: {order.riskScore}%
                  </span>
                </div>
                <div className="text-sm text-[#8B949E] mb-2">{order.aiNotes}</div>
                <div className="flex gap-2">
                  <button className="text-xs bg-[#F85149] text-white px-3 py-1 rounded">Block</button>
                  <button className="text-xs bg-[#3CCB7F] text-white px-3 py-1 rounded">Approve</button>
                  <button className="text-xs bg-[#1F242C] px-3 py-1 rounded">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vendor Verification */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1F242C]">
            <h3 className="font-semibold">Vendor Verification Queue</h3>
          </div>
          <div className="divide-y divide-[#1F242C]">
            {pendingVendors.length === 0 ? (
              <div className="p-8 text-center text-[#6E7681]">
                No pending verifications
              </div>
            ) : (
              pendingVendors.map((vendor) => (
                <div key={vendor.id} className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{vendor.logo}</span>
                    <div>
                      <div className="font-medium">{vendor.companyName}</div>
                      <div className="text-xs text-[#6E7681]">{vendor.industry}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs bg-[#3CCB7F] text-white px-3 py-1 rounded">Approve</button>
                    <button className="text-xs bg-[#F85149] text-white px-3 py-1 rounded">Reject</button>
                    <button className="text-xs bg-[#1F242C] px-3 py-1 rounded">View Docs</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 10. COMPLIANCE DASHBOARD PAGE
// ============================================
function ComplianceDashboardPage({ vendors }: { vendors: VendorWithHealth[] }) {
  const certifications = ['GDPR', 'SOC 2 Type II', 'PCI DSS', 'ISO 27001', 'HIPAA', 'CCPA'];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Compliance Dashboard</h2>
      
      {/* Certification Status */}
      <div className="grid grid-cols-6 gap-4">
        {certifications.map((cert) => (
          <div key={cert} className="bg-[#161B22] border border-[#3CCB7F]/30 rounded-xl p-4 text-center">
            <span className="text-2xl text-[#3CCB7F]">✓</span>
            <div className="font-medium mt-2">{cert}</div>
            <div className="text-xs text-[#3CCB7F]">Compliant</div>
          </div>
        ))}
      </div>
      
      {/* Vendor Compliance Table */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1F242C]">
          <h3 className="font-semibold">Vendor Compliance Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C] text-[#8B949E]">
                <th className="text-left p-4">Vendor</th>
                <th className="text-center p-4">Compliance Score</th>
                <th className="text-center p-4">Risk Score</th>
                <th className="text-center p-4">Documents</th>
                <th className="text-center p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-[#1F242C]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{vendor.logo}</span>
                      <span>{vendor.companyName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${
                      vendor.complianceScore >= 90 ? 'text-[#3CCB7F]' :
                      vendor.complianceScore >= 70 ? 'text-[#F59E0B]' : 'text-[#F85149]'
                    }`}>
                      {vendor.complianceScore}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={vendor.fraudRiskScore < 10 ? 'text-[#3CCB7F]' : 'text-[#F59E0B]'}>
                      {vendor.fraudRiskScore}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[#3CCB7F]">✓</span> Complete
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">
                      Compliant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 11. AI INSIGHTS PAGE
// ============================================
function AIInsightsPage({ insights }: { insights: AIInsight[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">AI Intelligence Center</h2>
        <div className="flex gap-2">
          {['all', 'risk', 'opportunity', 'prediction', 'anomaly', 'optimization'].map((filter) => (
            <button 
              key={filter}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white' 
                  : 'bg-[#161B22] text-[#8B949E]'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} expanded />
        ))}
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({ insight, expanded = false }: { insight: AIInsight; expanded?: boolean }) {
  const typeConfig = {
    risk: { icon: '🚨', color: '#F85149' },
    opportunity: { icon: '💡', color: '#3CCB7F' },
    prediction: { icon: '🔮', color: '#00A3FF' },
    anomaly: { icon: '⚠️', color: '#F59E0B' },
    optimization: { icon: '⚙️', color: '#A371F7' },
  };
  
  const config = typeConfig[insight.type];
  
  return (
    <div className={`bg-[#161B22] border rounded-xl overflow-hidden ${
      insight.priority === 'critical' ? 'border-[#F85149]' :
      insight.priority === 'high' ? 'border-[#F59E0B]' : 'border-[#1F242C]'
    }`}>
      <div className={`px-4 py-3 border-b border-[#1F242C] ${
        insight.priority === 'critical' ? 'bg-[#F85149]/10' :
        insight.priority === 'high' ? 'bg-[#F59E0B]/10' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{config.icon}</span>
            <div>
              <div className="font-medium">{insight.title}</div>
              <div className="text-xs text-[#6E7681]">{insight.category} • {insight.confidence}% confidence</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${
              insight.priority === 'critical' ? 'bg-[#F85149]/20 text-[#F85149]' :
              insight.priority === 'high' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
              insight.priority === 'medium' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
              'bg-[#8B949E]/20 text-[#8B949E]'
            }`}>
              {insight.priority}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              insight.status === 'new' ? 'bg-[#00A3FF]/20 text-[#00A3FF]' :
              insight.status === 'in_progress' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
              'bg-[#8B949E]/20 text-[#8B949E]'
            }`}>
              {insight.status}
            </span>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-[#8B949E]">{insight.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-3">
              <div className="text-xs text-[#6E7681] mb-1">Impact</div>
              <div className="text-sm font-medium text-[#3CCB7F]">{insight.impact}</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-3">
              <div className="text-xs text-[#6E7681] mb-1">Data Points</div>
              <div className="text-sm font-medium">{insight.dataPoints.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="bg-[#0D1117] rounded-lg p-3">
            <div className="text-xs text-[#6E7681] mb-1">Recommendation</div>
            <div className="text-sm">{insight.recommendation}</div>
          </div>
          
          <div className="flex gap-2">
            {insight.actions.map((action, i) => (
              <button 
                key={i}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  action.primary 
                    ? 'bg-gradient-to-r from-[#00A3FF] to-[#A371F7] text-white' 
                    : 'bg-[#1F242C] text-[#8B949E]'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// AI INSIGHTS PANEL (Global Component)
// ============================================
function AIInsightsPanel({ insights, onViewAll }: { insights: AIInsight[]; onViewAll: () => void }) {
  return (
    <aside className="space-y-4 sticky top-[120px]">
      {/* AI Status */}
      <div className="bg-gradient-to-br from-[#A371F7]/20 to-[#00A3FF]/20 border border-[#A371F7]/30 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🧠</span>
          <div>
            <div className="font-semibold">AI Engine Active</div>
            <div className="text-xs text-[#8B949E]">Cognitive Commerce v10.5</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Fraud Detection', value: '99.2%' },
            { label: 'Forecast Accuracy', value: '94.7%' },
          ].map((metric, i) => (
            <div key={i} className="bg-[#0D1117]/50 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-[#3CCB7F]">{metric.value}</div>
              <div className="text-xs text-[#6E7681]">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Insights */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <div className="p-3 border-b border-[#1F242C] flex items-center justify-between">
          <span className="font-semibold text-sm">Priority Insights</span>
          <span className="text-xs bg-[#F85149] text-white px-2 py-0.5 rounded-full">
            {insights.filter(i => i.status === 'new').length}
          </span>
        </div>
        <div className="divide-y divide-[#1F242C] max-h-[400px] overflow-y-auto">
          {insights.slice(0, 4).map((insight) => {
            const typeConfig = {
              risk: { icon: '🚨', color: '#F85149' },
              opportunity: { icon: '💡', color: '#3CCB7F' },
              prediction: { icon: '🔮', color: '#00A3FF' },
              anomaly: { icon: '⚠️', color: '#F59E0B' },
              optimization: { icon: '⚙️', color: '#A371F7' },
            };
            const config = typeConfig[insight.type];
            
            return (
              <div key={insight.id} className="p-3 hover:bg-[#1F242C]/50 cursor-pointer">
                <div className="flex items-start gap-2">
                  <span>{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs px-1.5 py-0.5 rounded inline-block mb-1 ${
                      insight.priority === 'critical' ? 'bg-[#F85149]/20 text-[#F85149]' :
                      insight.priority === 'high' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#00A3FF]/20 text-[#00A3FF]'
                    }`}>
                      {insight.priority}
                    </div>
                    <div className="font-medium text-sm truncate">{insight.title}</div>
                    <div className="text-xs text-[#6E7681]">{insight.confidence}% confidence</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-2 border-t border-[#1F242C]">
          <button onClick={onViewAll} className="w-full text-center text-xs text-[#00A3FF] py-2 hover:underline">
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
            { label: 'Update AI Pricing', icon: '💰' },
            { label: 'Generate Report', icon: '📄' },
            { label: 'Notify Vendors', icon: '📢' },
          ].map((action, i) => (
            <button 
              key={i}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-[#0D1117] rounded-lg text-sm hover:bg-[#1F242C] transition-colors text-left"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
