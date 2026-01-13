'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import AutopilotWidget from '@/components/AutopilotWidget';

const MODULES_DATA: Record<string, {
  name: string;
  icon: string;
  status: string;
  statusLabel: string;
  description: string;
  longDescription: string;
  features: { title: string; description: string; icon: string }[];
  apis: { method: string; endpoint: string; description: string }[];
  stats: { label: string; value: string; trend?: string }[];
  integrations: { name: string; icon: string; status: string }[];
  roadmap: { version: string; title: string; status: string; items: string[] }[];
  useCases: string[];
}> = {
  'procurement': {
    name: 'Procurement Engine',
    icon: '📋',
    status: 'live',
    statusLabel: 'Production Ready',
    description: 'Transparent tender management and contract oversight for government operations.',
    longDescription: 'The Procurement Engine provides end-to-end digital procurement capabilities, from tender creation to contract management. Built with transparency and accountability at its core, it ensures every transaction is auditable and compliant with international standards.',
    features: [
      { title: 'Automated Tender Publishing', description: 'Create and publish tenders with automated compliance checks', icon: '📝' },
      { title: 'Bid Evaluation Matrix', description: 'AI-assisted scoring with transparent criteria weighting', icon: '⚖️' },
      { title: 'Contract Lifecycle', description: 'End-to-end contract management from award to completion', icon: '📄' },
      { title: 'Supplier Verification', description: 'Automated background checks and credential verification', icon: '✅' },
      { title: 'Audit Trail', description: 'Immutable logging of all actions for full accountability', icon: '🔍' },
      { title: 'Multi-currency Support', description: 'Handle international procurement in any currency', icon: '💱' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/procurement/tenders', description: 'List all active tenders' },
      { method: 'POST', endpoint: '/api/procurement/tenders', description: 'Create new tender' },
      { method: 'GET', endpoint: '/api/procurement/tenders/{id}', description: 'Get tender details' },
      { method: 'POST', endpoint: '/api/procurement/bids', description: 'Submit bid' },
      { method: 'GET', endpoint: '/api/procurement/contracts', description: 'List contracts' },
      { method: 'POST', endpoint: '/api/procurement/contracts/{id}/approve', description: 'Approve contract' },
    ],
    stats: [
      { label: 'Active Tenders', value: '847', trend: '+12%' },
      { label: 'Total Contracts', value: '$2.4B', trend: '+28%' },
      { label: 'Verified Suppliers', value: '12,453', trend: '+8%' },
      { label: 'Avg. Processing Time', value: '3.2 days', trend: '-15%' },
    ],
    integrations: [
      { name: 'SAP', icon: '🔷', status: 'active' },
      { name: 'Oracle', icon: '🔴', status: 'active' },
      { name: 'Dynamics 365', icon: '🟦', status: 'active' },
      { name: 'QuickBooks', icon: '🟢', status: 'beta' },
    ],
    roadmap: [
      { version: 'v2.1', title: 'Q1 2026', status: 'current', items: ['AI bid analysis', 'Blockchain audit trail', 'Mobile app'] },
      { version: 'v2.2', title: 'Q2 2026', status: 'planned', items: ['Smart contracts', 'Predictive pricing', 'Vendor scoring AI'] },
      { version: 'v3.0', title: 'Q4 2026', status: 'future', items: ['Full automation', 'Cross-border procurement', 'Real-time compliance'] },
    ],
    useCases: [
      'Government infrastructure projects',
      'Humanitarian aid procurement',
      'Medical supply chain management',
      'Defense contractor management',
    ],
  },
  'logistics': {
    name: 'Logistics Engine',
    icon: '🚚',
    status: 'pilot',
    statusLabel: 'Pilot Program',
    description: 'Route optimization and supply chain tracking for humanitarian operations.',
    longDescription: 'The Logistics Engine optimizes delivery routes, tracks shipments in real-time, and ensures aid reaches those who need it most. Designed for complex humanitarian environments with limited infrastructure.',
    features: [
      { title: 'Real-time GPS Tracking', description: 'Live location updates every 30 seconds', icon: '📍' },
      { title: 'Route Optimization AI', description: 'ML-powered routing considering terrain, weather, security', icon: '🛣️' },
      { title: 'Delivery Confirmation', description: 'Digital proof of delivery with photo and signature', icon: '✍️' },
      { title: 'Fleet Management', description: 'Vehicle maintenance, fuel tracking, driver management', icon: '🚛' },
      { title: 'Warehouse Integration', description: 'Inventory sync with major WMS platforms', icon: '🏭' },
      { title: 'Cold Chain Monitoring', description: 'Temperature tracking for medical supplies', icon: '❄️' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/logistics/shipments', description: 'List all shipments' },
      { method: 'POST', endpoint: '/api/logistics/shipments', description: 'Create shipment' },
      { method: 'GET', endpoint: '/api/logistics/tracking/{id}', description: 'Get tracking info' },
      { method: 'POST', endpoint: '/api/logistics/routes/optimize', description: 'Optimize route' },
      { method: 'GET', endpoint: '/api/logistics/fleet', description: 'Fleet status' },
    ],
    stats: [
      { label: 'Active Shipments', value: '2,341', trend: '+45%' },
      { label: 'On-time Delivery', value: '94.7%', trend: '+3%' },
      { label: 'Route Efficiency', value: '+23%', trend: '+5%' },
      { label: 'Fleet Vehicles', value: '456', trend: '+18%' },
    ],
    integrations: [
      { name: 'Google Maps', icon: '🗺️', status: 'active' },
      { name: 'HERE', icon: '📍', status: 'active' },
      { name: 'Samsara', icon: '🚛', status: 'beta' },
      { name: 'Fleetio', icon: '🔧', status: 'planned' },
    ],
    roadmap: [
      { version: 'v1.5', title: 'Q1 2026', status: 'current', items: ['Drone delivery planning', 'Weather integration', 'Offline mode'] },
      { version: 'v2.0', title: 'Q3 2026', status: 'planned', items: ['Autonomous vehicle support', 'Cross-border logistics', 'Carbon tracking'] },
      { version: 'v2.5', title: 'Q1 2027', status: 'future', items: ['AI demand prediction', 'Multi-modal transport', 'Last-mile optimization'] },
    ],
    useCases: [
      'Humanitarian aid delivery',
      'Medical supply distribution',
      'Reconstruction material transport',
      'Emergency response logistics',
    ],
  },
  'donor-dashboard': {
    name: 'Donor Dashboard',
    icon: '🤝',
    status: 'design',
    statusLabel: 'In Design',
    description: 'Funding transparency and impact reporting for international donors.',
    longDescription: 'The Donor Dashboard provides complete visibility into fund allocation and impact. Every dollar is tracked from commitment to outcome, with real-time reporting and AI-powered impact analysis.',
    features: [
      { title: 'Real-time Fund Tracking', description: 'See exactly where every dollar goes', icon: '💰' },
      { title: 'Impact Metrics', description: 'Quantifiable outcomes tied to funding', icon: '📊' },
      { title: 'Project Reporting', description: 'Automated progress reports with milestones', icon: '📈' },
      { title: 'Donor Analytics', description: 'Portfolio analysis and ROI tracking', icon: '🎯' },
      { title: 'Compliance Reports', description: 'Auto-generated reports for regulatory requirements', icon: '📋' },
      { title: 'Beneficiary Feedback', description: 'Direct feedback from aid recipients', icon: '💬' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/donor/projects', description: 'List funded projects' },
      { method: 'GET', endpoint: '/api/donor/impact/{id}', description: 'Get impact metrics' },
      { method: 'GET', endpoint: '/api/donor/allocation', description: 'Fund allocation breakdown' },
      { method: 'POST', endpoint: '/api/donor/reports', description: 'Generate report' },
    ],
    stats: [
      { label: 'Total Donations', value: '$847M', trend: '+34%' },
      { label: 'Active Projects', value: '1,234', trend: '+22%' },
      { label: 'Beneficiaries', value: '2.3M', trend: '+41%' },
      { label: 'Transparency Score', value: '98.4%', trend: '+2%' },
    ],
    integrations: [
      { name: 'World Bank', icon: '🏦', status: 'planned' },
      { name: 'USAID', icon: '🇺🇸', status: 'planned' },
      { name: 'EU Commission', icon: '🇪🇺', status: 'design' },
      { name: 'UN OCHA', icon: '🇺🇳', status: 'design' },
    ],
    roadmap: [
      { version: 'v0.1', title: 'Q2 2026', status: 'current', items: ['Core dashboard', 'Basic reporting', 'Fund tracking'] },
      { version: 'v1.0', title: 'Q4 2026', status: 'planned', items: ['Impact AI', 'Predictive analytics', 'Mobile app'] },
      { version: 'v1.5', title: 'Q2 2027', status: 'future', items: ['Blockchain verification', 'Real-time beneficiary tracking', 'Multi-donor coordination'] },
    ],
    useCases: [
      'International development funding',
      'Humanitarian response coordination',
      'Government aid transparency',
      'NGO fund management',
    ],
  },
  'data-platform': {
    name: 'Data Platform',
    icon: '🗄️',
    status: 'dev',
    statusLabel: 'In Development',
    description: 'Unified data lake and document management system.',
    longDescription: 'The Data Platform centralizes all organizational data into a secure, scalable infrastructure. With advanced analytics and AI-powered insights, it transforms raw data into actionable intelligence.',
    features: [
      { title: 'Centralized Storage', description: 'Single source of truth for all data', icon: '💾' },
      { title: 'Document Versioning', description: 'Full history with diff comparison', icon: '📚' },
      { title: 'Access Control', description: 'Role-based permissions with audit logging', icon: '🔐' },
      { title: 'Data Analytics', description: 'Built-in BI tools and custom dashboards', icon: '📊' },
      { title: 'API Integrations', description: 'Connect any system via REST or GraphQL', icon: '🔌' },
      { title: 'Data Quality', description: 'Automated validation and cleansing', icon: '✨' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/data/documents', description: 'List documents' },
      { method: 'POST', endpoint: '/api/data/upload', description: 'Upload document' },
      { method: 'GET', endpoint: '/api/data/analytics', description: 'Run analytics query' },
      { method: 'POST', endpoint: '/api/data/transform', description: 'Transform dataset' },
    ],
    stats: [
      { label: 'Documents Stored', value: '4.2M', trend: '+67%' },
      { label: 'Storage Used', value: '12.4 TB', trend: '+23%' },
      { label: 'Daily Queries', value: '847K', trend: '+89%' },
      { label: 'Uptime', value: '99.99%', trend: '0%' },
    ],
    integrations: [
      { name: 'AWS S3', icon: '☁️', status: 'active' },
      { name: 'Azure Blob', icon: '🔷', status: 'active' },
      { name: 'Snowflake', icon: '❄️', status: 'dev' },
      { name: 'Databricks', icon: '🧱', status: 'planned' },
    ],
    roadmap: [
      { version: 'v0.8', title: 'Q1 2026', status: 'current', items: ['Core storage', 'Basic analytics', 'REST API'] },
      { version: 'v1.0', title: 'Q3 2026', status: 'planned', items: ['GraphQL API', 'Real-time sync', 'ML pipelines'] },
      { version: 'v2.0', title: 'Q1 2027', status: 'future', items: ['Federated queries', 'Auto-scaling', 'Data marketplace'] },
    ],
    useCases: [
      'Government record management',
      'Cross-agency data sharing',
      'Research data repositories',
      'Compliance documentation',
    ],
  },
  'ai-services': {
    name: 'AI Services',
    icon: '🤖',
    status: 'beta',
    statusLabel: 'Public Beta',
    description: 'Intelligent automation and decision support systems.',
    longDescription: 'AI Services provides cutting-edge machine learning capabilities for governance applications. From risk assessment to document analysis, our AI models are trained on governance-specific data with built-in explainability.',
    features: [
      { title: 'Risk Assessment AI', description: 'Predict and quantify operational risks', icon: '⚠️' },
      { title: 'Document Analysis', description: 'Extract insights from unstructured documents', icon: '📄' },
      { title: 'Anomaly Detection', description: 'Identify unusual patterns in real-time', icon: '🔔' },
      { title: 'Predictive Analytics', description: 'Forecast trends and outcomes', icon: '🔮' },
      { title: 'NLP Processing', description: 'Multi-language text analysis', icon: '💬' },
      { title: 'Explainable AI', description: 'Transparent reasoning for all decisions', icon: '🧠' },
    ],
    apis: [
      { method: 'POST', endpoint: '/api/ai/analyze', description: 'Analyze document' },
      { method: 'POST', endpoint: '/api/ai/risk', description: 'Risk assessment' },
      { method: 'POST', endpoint: '/api/ai/predict', description: 'Run prediction' },
      { method: 'GET', endpoint: '/api/ai/models', description: 'List available models' },
    ],
    stats: [
      { label: 'Models Deployed', value: '24', trend: '+6' },
      { label: 'Daily Predictions', value: '1.2M', trend: '+156%' },
      { label: 'Accuracy', value: '97.3%', trend: '+1.2%' },
      { label: 'Avg Response', value: '45ms', trend: '-23%' },
    ],
    integrations: [
      { name: 'OpenAI', icon: '🟢', status: 'active' },
      { name: 'Anthropic', icon: '🟤', status: 'active' },
      { name: 'Hugging Face', icon: '🤗', status: 'beta' },
      { name: 'Google AI', icon: '🔵', status: 'planned' },
    ],
    roadmap: [
      { version: 'v1.0', title: 'Q1 2026', status: 'current', items: ['Production release', 'Model fine-tuning', 'API v2'] },
      { version: 'v1.5', title: 'Q2 2026', status: 'planned', items: ['Custom model training', 'Edge deployment', 'Batch processing'] },
      { version: 'v2.0', title: 'Q4 2026', status: 'future', items: ['Multi-modal AI', 'Autonomous agents', 'Federated learning'] },
    ],
    useCases: [
      'Fraud detection in procurement',
      'Document classification',
      'Risk scoring for projects',
      'Sentiment analysis of feedback',
    ],
  },
  'trade': {
    name: 'Trade Module',
    icon: '🏪',
    status: 'live',
    statusLabel: 'Production Ready',
    description: 'B2B marketplace for verified business transactions.',
    longDescription: 'The Trade Module enables secure business-to-business transactions with verified counterparties. Features escrow protection, smart contracts, and AI-powered fraud detection for safe international trade.',
    features: [
      { title: 'Verified Merchants', description: 'KYC/KYB verified business profiles', icon: '✅' },
      { title: 'Escrow Protection', description: 'Funds held securely until delivery confirmed', icon: '🔒' },
      { title: 'Smart Contracts', description: 'Automated contract execution', icon: '📜' },
      { title: 'Multi-currency', description: 'Trade in any currency including crypto', icon: '💱' },
      { title: 'Dispute Resolution', description: 'AI-mediated conflict resolution', icon: '⚖️' },
      { title: 'Trade Finance', description: 'Invoice factoring and credit lines', icon: '💳' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/trade/listings', description: 'Browse listings' },
      { method: 'POST', endpoint: '/api/trade/orders', description: 'Create order' },
      { method: 'GET', endpoint: '/api/trade/escrow/{id}', description: 'Escrow status' },
      { method: 'POST', endpoint: '/api/trade/dispute', description: 'Open dispute' },
    ],
    stats: [
      { label: 'Total Volume', value: '$1.2B', trend: '+89%' },
      { label: 'Active Merchants', value: '8,432', trend: '+34%' },
      { label: 'Dispute Rate', value: '0.3%', trend: '-12%' },
      { label: 'Avg Transaction', value: '$14.2K', trend: '+8%' },
    ],
    integrations: [
      { name: 'Stripe', icon: '💳', status: 'active' },
      { name: 'PayPal', icon: '🅿️', status: 'active' },
      { name: 'Wise', icon: '🌍', status: 'beta' },
      { name: 'Crypto', icon: '₿', status: 'beta' },
    ],
    roadmap: [
      { version: 'v2.0', title: 'Q1 2026', status: 'current', items: ['NFT trade', 'Cross-border optimization', 'Mobile app'] },
      { version: 'v2.5', title: 'Q3 2026', status: 'planned', items: ['AI pricing', 'Bulk trading', 'Warehouse integration'] },
      { version: 'v3.0', title: 'Q1 2027', status: 'future', items: ['Decentralized trade', 'IoT tracking', 'Predictive demand'] },
    ],
    useCases: [
      'International B2B trade',
      'Commodity trading',
      'Manufacturing supply chain',
      'Wholesale distribution',
    ],
  },
  'insurance': {
    name: 'Insurance Module',
    icon: '🛡️',
    status: 'live',
    statusLabel: 'Production Ready',
    description: 'AI-powered insurance for cargo, liability, and operations.',
    longDescription: 'The Insurance Module provides instant quotes and policies for all operational risks. AI-powered underwriting enables real-time pricing and automated claims processing.',
    features: [
      { title: 'Instant Quotes', description: 'AI-generated quotes in seconds', icon: '⚡' },
      { title: 'Cargo Coverage', description: 'Full protection for goods in transit', icon: '📦' },
      { title: 'Liability Insurance', description: 'Professional and general liability', icon: '⚖️' },
      { title: 'Claims Processing', description: 'Automated claims with fast payouts', icon: '💰' },
      { title: 'Risk Assessment', description: 'AI-powered risk scoring', icon: '📊' },
      { title: 'Policy Management', description: 'Digital policy lifecycle', icon: '📋' },
    ],
    apis: [
      { method: 'POST', endpoint: '/api/insurance/quote', description: 'Get instant quote' },
      { method: 'POST', endpoint: '/api/insurance/policy', description: 'Create policy' },
      { method: 'POST', endpoint: '/api/insurance/claim', description: 'File claim' },
      { method: 'GET', endpoint: '/api/insurance/policies', description: 'List policies' },
    ],
    stats: [
      { label: 'Policies Issued', value: '45.2K', trend: '+67%' },
      { label: 'Coverage Volume', value: '$890M', trend: '+45%' },
      { label: 'Claims Paid', value: '$12.3M', trend: '+23%' },
      { label: 'Avg Claim Time', value: '4.2 hrs', trend: '-34%' },
    ],
    integrations: [
      { name: 'Lloyds', icon: '🏛️', status: 'active' },
      { name: 'Swiss Re', icon: '🇨🇭', status: 'active' },
      { name: 'Munich Re', icon: '🇩🇪', status: 'beta' },
      { name: 'Blockchain', icon: '⛓️', status: 'planned' },
    ],
    roadmap: [
      { version: 'v1.5', title: 'Q1 2026', status: 'current', items: ['Parametric insurance', 'IoT integration', 'Mobile claims'] },
      { version: 'v2.0', title: 'Q3 2026', status: 'planned', items: ['Smart contracts', 'Instant payouts', 'Risk pools'] },
      { version: 'v2.5', title: 'Q1 2027', status: 'future', items: ['Decentralized insurance', 'AI underwriting', 'Climate coverage'] },
    ],
    useCases: [
      'Cargo and freight insurance',
      'Construction project coverage',
      'Trade credit insurance',
      'Operational risk coverage',
    ],
  },
  'payments': {
    name: 'Payments Module',
    icon: '💳',
    status: 'live',
    statusLabel: 'Production Ready',
    description: 'Instant settlements, multi-currency wallets, and cross-border payments.',
    longDescription: 'The Payments Module enables instant B2B settlements with zero platform fees. Multi-currency wallets, escrow services, and cross-border FX optimization make international payments seamless.',
    features: [
      { title: 'Instant Settlement', description: 'Payments in under 30 seconds', icon: '⚡' },
      { title: 'Multi-currency Wallets', description: 'Hold and convert 50+ currencies', icon: '💱' },
      { title: 'Escrow Services', description: 'Secure holding for transactions', icon: '🔐' },
      { title: 'Invoice Factoring', description: 'Get paid early on invoices', icon: '📄' },
      { title: 'Cross-border FX', description: 'Best rates for international transfers', icon: '🌍' },
      { title: 'Crypto Rails', description: 'USDC/USDT settlement options', icon: '₿' },
    ],
    apis: [
      { method: 'POST', endpoint: '/api/payments/send', description: 'Send payment' },
      { method: 'GET', endpoint: '/api/payments/balance', description: 'Wallet balance' },
      { method: 'POST', endpoint: '/api/payments/escrow', description: 'Create escrow' },
      { method: 'GET', endpoint: '/api/payments/fx-rate', description: 'Get FX rates' },
    ],
    stats: [
      { label: 'Total Processed', value: '$2.8B', trend: '+124%' },
      { label: 'Transactions', value: '847K', trend: '+89%' },
      { label: 'Avg Settlement', value: '<30s', trend: '-45%' },
      { label: 'Platform Fee', value: '0%', trend: '0%' },
    ],
    integrations: [
      { name: 'Stripe', icon: '💳', status: 'active' },
      { name: 'SWIFT', icon: '🏦', status: 'active' },
      { name: 'Circle', icon: '⭕', status: 'active' },
      { name: 'Stellar', icon: '⭐', status: 'beta' },
    ],
    roadmap: [
      { version: 'v2.0', title: 'Q1 2026', status: 'current', items: ['Real-time rails', 'Virtual cards', 'Batch payments'] },
      { version: 'v2.5', title: 'Q2 2026', status: 'planned', items: ['DeFi integration', 'Programmable money', 'AI fraud detection'] },
      { version: 'v3.0', title: 'Q4 2026', status: 'future', items: ['CBDC support', 'Cross-chain', 'Embedded finance'] },
    ],
    useCases: [
      'B2B instant payments',
      'International settlements',
      'Escrow for trade',
      'Payroll and disbursements',
    ],
  },
  'reconstruction': {
    name: 'Reconstruction Module',
    icon: '🏗️',
    status: 'pilot',
    statusLabel: 'Pilot Program',
    description: 'Transparent post-war rebuilding with AI anti-corruption.',
    longDescription: 'The Reconstruction Module ensures transparent allocation of rebuilding funds. AI-powered anti-corruption monitoring, contractor verification, and real-time progress tracking prevent waste and fraud.',
    features: [
      { title: 'Donor Tracking', description: 'Every dollar tracked from source to use', icon: '💰' },
      { title: 'Contractor Verification', description: 'Background checks and performance history', icon: '✅' },
      { title: 'AI Anti-corruption', description: 'Real-time fraud detection', icon: '🤖' },
      { title: 'Progress Monitoring', description: 'Satellite and IoT verification', icon: '📡' },
      { title: 'Impact Reporting', description: 'Quantifiable outcomes for stakeholders', icon: '📊' },
      { title: 'Community Feedback', description: 'Direct input from beneficiaries', icon: '💬' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/reconstruction/projects', description: 'List projects' },
      { method: 'POST', endpoint: '/api/reconstruction/fund', description: 'Allocate funds' },
      { method: 'GET', endpoint: '/api/reconstruction/progress/{id}', description: 'Track progress' },
      { method: 'POST', endpoint: '/api/reconstruction/verify', description: 'Verify completion' },
    ],
    stats: [
      { label: 'Projects Active', value: '1,247', trend: '+156%' },
      { label: 'Funds Allocated', value: '$4.2B', trend: '+234%' },
      { label: 'Fraud Prevented', value: '$89M', trend: '+67%' },
      { label: 'Completion Rate', value: '94.2%', trend: '+8%' },
    ],
    integrations: [
      { name: 'World Bank', icon: '🏦', status: 'active' },
      { name: 'USAID', icon: '🇺🇸', status: 'active' },
      { name: 'EU Commission', icon: '🇪🇺', status: 'pilot' },
      { name: 'Satellite', icon: '🛰️', status: 'active' },
    ],
    roadmap: [
      { version: 'v1.0', title: 'Q1 2026', status: 'current', items: ['Core platform', 'Donor dashboard', 'Basic reporting'] },
      { version: 'v1.5', title: 'Q3 2026', status: 'planned', items: ['AI monitoring', 'Satellite integration', 'Mobile verification'] },
      { version: 'v2.0', title: 'Q1 2027', status: 'future', items: ['Predictive analytics', 'Blockchain audit', 'Community voting'] },
    ],
    useCases: [
      'Post-war infrastructure rebuilding',
      'Disaster recovery projects',
      'International development',
      'Municipal reconstruction',
    ],
  },
  'freight': {
    name: 'Direct Freight',
    icon: '🚛',
    status: 'live',
    statusLabel: 'Production Ready',
    description: 'Broker-free logistics with AI rate optimization and instant pay.',
    longDescription: 'Direct Freight connects shippers directly with carriers, eliminating broker fees. AI-powered rate optimization ensures fair pricing, while instant pay gets drivers paid within 2 hours of delivery.',
    features: [
      { title: 'Zero Broker Fees', description: 'Direct shipper-carrier connections', icon: '🚫' },
      { title: 'AI Rate Engine', description: 'Fair market pricing in real-time', icon: '🤖' },
      { title: 'Instant Pay', description: 'Get paid within 2 hours of POD', icon: '⚡' },
      { title: 'GPS Tracking', description: 'Real-time load visibility', icon: '📍' },
      { title: 'POD Upload', description: 'Digital proof of delivery', icon: '📸' },
      { title: 'Load Board', description: 'Browse and book available loads', icon: '📋' },
    ],
    apis: [
      { method: 'GET', endpoint: '/api/freight/loads', description: 'Browse loads' },
      { method: 'POST', endpoint: '/api/freight/book', description: 'Book load' },
      { method: 'POST', endpoint: '/api/freight/pod', description: 'Upload POD' },
      { method: 'POST', endpoint: '/api/freight/payout', description: 'Request instant pay' },
    ],
    stats: [
      { label: 'Active Drivers', value: '4,567', trend: '+45%' },
      { label: 'Loads Completed', value: '28.4K', trend: '+89%' },
      { label: 'Avg Savings', value: '17%', trend: '+3%' },
      { label: 'Instant Payouts', value: '$8.9M', trend: '+124%' },
    ],
    integrations: [
      { name: 'ELD Devices', icon: '📟', status: 'active' },
      { name: 'DAT', icon: '📊', status: 'active' },
      { name: 'Truckstop', icon: '🚛', status: 'active' },
      { name: 'Motive', icon: '🔧', status: 'beta' },
    ],
    roadmap: [
      { version: 'v1.5', title: 'Q1 2026', status: 'current', items: ['Carrier app', 'Route optimization', 'Fuel cards'] },
      { version: 'v2.0', title: 'Q2 2026', status: 'planned', items: ['Shipper portal', 'Capacity prediction', 'Carbon tracking'] },
      { version: 'v2.5', title: 'Q4 2026', status: 'future', items: ['Autonomous support', 'Multi-modal', 'Smart contracts'] },
    ],
    useCases: [
      'FTL and LTL shipping',
      'Owner-operator loads',
      'Fleet carrier contracts',
      'Last-mile delivery', 
    ],
  },
};

const ALL_MODULES = Object.entries(MODULES_DATA).map(([slug, data]) => ({
  slug,
  ...data,
}));

export default function ModulePage() {
  const params = useParams();
  const slug = params.slug as string;
  const module = MODULES_DATA[slug];
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'integrations' | 'roadmap'>('overview'); const [showComingSoon, setShowComingSoon] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
        <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1F242C] animate-pulse" />
              <div className="w-20 h-5 bg-[#1F242C] animate-pulse rounded" />
            </div>
          </div>
        </nav>
        <section className="pt-[120px] pb-12">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#1F242C] animate-pulse rounded-xl" />
              <div>
                <div className="w-48 h-8 bg-[#1F242C] animate-pulse rounded mb-2" />
                <div className="w-72 h-5 bg-[#1F242C] animate-pulse rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#161B22] border border-[#1F242C] p-4 rounded-lg">
                  <div className="w-20 h-7 bg-[#1F242C] animate-pulse rounded mb-2" />
                  <div className="w-16 h-4 bg-[#1F242C] animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Module Not Found</h1>
          <Link href="/" className="text-[#00A3FF] hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    live: 'bg-[#3CCB7F]/15 text-[#3CCB7F] border-[#3CCB7F]/30',
    pilot: 'bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30',
    beta: 'bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30',
    dev: 'bg-[#00A3FF]/15 text-[#00A3FF] border-[#00A3FF]/30',
    design: 'bg-[#8B949E]/15 text-[#8B949E] border-[#8B949E]/30',
  };

  const methodColors: Record<string, string> = {
    GET: 'bg-[#3CCB7F]/20 text-[#3CCB7F]',
    POST: 'bg-[#00A3FF]/20 text-[#00A3FF]',
    PUT: 'bg-[#FFB84D]/20 text-[#FFB84D]',
    DELETE: 'bg-[#F85149]/20 text-[#F85149]',
  };

  const roadmapColors: Record<string, string> = {
    current: 'border-[#3CCB7F] bg-[#3CCB7F]/10',
    planned: 'border-[#00A3FF] bg-[#00A3FF]/10',
    future: 'border-[#8B949E] bg-[#8B949E]/10',
  };

  return (
    <div className="min-h-screen bg-[#0A0D12]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">IV</div>
            <span className="text-lg font-semibold">IVYAR</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#modules" className="text-sm text-[#8B949E] hover:text-[#E6EDF3] transition-colors">All Modules</Link>
            <Link href="/hbs" className="h-9 px-4 bg-[#00A3FF] text-[#0D1117] text-sm font-medium flex items-center hover:bg-[#33B5FF] transition-colors">
              Access Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-[120px] pb-12 border-b border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#00A3FF]/10 flex items-center justify-center text-4xl rounded-xl border border-[#00A3FF]/20">
                  {module.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl lg:text-4xl font-bold">{module.name}</h1>
                    <span className={`text-xs font-semibold uppercase px-2 py-1 border ${statusColors[module.status]}`}>
                      {module.statusLabel}
                    </span>
                  </div>
                  <p className="text-[#8B949E]">{module.description}</p>
                </div>
              </div>
              <p className="text-[#8B949E] leading-relaxed mt-6 max-w-2xl">
                {module.longDescription}
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:w-[320px]">
              {module.stats.map((stat, i) => (
                <div key={i} className="bg-[#161B22] border border-[#1F242C] p-4 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#E6EDF3]">{stat.value}</span>
                    {stat.trend && (
                      <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-[#3CCB7F]' : stat.trend.startsWith('-') ? 'text-[#F85149]' : 'text-[#8B949E]'}`}>
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#8B949E]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-[#1F242C] sticky top-[72px] bg-[#0A0D12] z-40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex gap-1">
            {(['overview', 'api', 'integrations', 'roadmap'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-[#E6EDF3] border-[#00A3FF]'
                    : 'text-[#8B949E] border-transparent hover:text-[#E6EDF3]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Features */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.features.map((feature, i) => (
                      <div key={i} className="bg-[#161B22] border border-[#1F242C] p-5 rounded-lg hover:border-[#00A3FF]/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{feature.icon}</span>
                          <div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-[#8B949E]">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Use Cases</h2>
                  <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.useCases.map((useCase, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[#00A3FF]">→</span>
                          <span>{useCase}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
               <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href={`/${slug}`} className="w-full h-11 bg-[#00A3FF] text-[#0D1117] font-medium flex items-center justify-center hover:bg-[#33B5FF] transition-colors rounded block leading-[44px]">
                      Access Module
                    </Link>
                    <button onClick={() => setActiveTab('api')} className="w-full h-11 border border-[#1F242C] text-[#8B949E] font-medium flex items-center justify-center hover:border-[#00A3FF] hover:text-[#E6EDF3] transition-colors rounded">
                      View Documentation
                    </button>
                    <button onClick={() => setShowDemoForm(true)} className="w-full h-11 border border-[#1F242C] text-[#8B949E] font-medium flex items-center justify-center hover:border-[#00A3FF] hover:text-[#E6EDF3] transition-colors rounded">
                      Request Demo
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Module Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8B949E]">Status</span>
                      <span className={`font-medium ${module.status === 'live' ? 'text-[#3CCB7F]' : 'text-[#FFB84D]'}`}>
                        {module.statusLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B949E]">API Endpoints</span>
                      <span className="font-medium">{module.apis.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B949E]">Integrations</span>
                      <span className="font-medium">{module.integrations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8B949E]">Version</span>
                      <span className="font-medium">{module.roadmap[0]?.version || 'v1.0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Reference</h2>
                <span className="text-sm text-[#8B949E]">{module.apis.length} endpoints</span>
              </div>
              
              <div className="bg-[#161B22] border border-[#1F242C] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#1F242C] bg-[#0D1117]">
                  <code className="text-sm text-[#8B949E]">Base URL: <span className="text-[#00A3FF]">https://api.ivyar.org/v1</span></code>
                </div>
                <div className="divide-y divide-[#1F242C]">
                  {module.apis.map((api, i) => (
                    <div key={i} className="p-4 hover:bg-[#1F242C]/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <span className={`px-2 py-1 text-xs font-mono font-semibold rounded ${methodColors[api.method]}`}>
                          {api.method}
                        </span>
                        <div className="flex-1">
                          <code className="text-sm text-[#E6EDF3]">{api.endpoint}</code>
                          <p className="text-sm text-[#8B949E] mt-1">{api.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Authentication</h3>
                <p className="text-sm text-[#8B949E] mb-4">All API requests require authentication using Bearer tokens.</p>
                <div className="bg-[#0D1117] p-4 rounded font-mono text-sm">
                  <span className="text-[#8B949E]">Authorization:</span> <span className="text-[#3CCB7F]">Bearer</span> <span className="text-[#FFB84D]">{'<your-api-key>'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Integrations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {module.integrations.map((integration, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg text-center hover:border-[#00A3FF]/50 transition-colors">
                    <span className="text-4xl mb-3 block">{integration.icon}</span>
                    <h3 className="font-semibold mb-2">{integration.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      integration.status === 'active' ? 'bg-[#3CCB7F]/15 text-[#3CCB7F]' :
                      integration.status === 'beta' ? 'bg-[#FFB84D]/15 text-[#FFB84D]' :
                      integration.status === 'dev' ? 'bg-[#00A3FF]/15 text-[#00A3FF]' :
                      'bg-[#8B949E]/15 text-[#8B949E]'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Request Integration</h3>
                <p className="text-sm text-[#8B949E] mb-4">Need a specific integration? Contact our team to request new integrations.</p>
                <button className="h-10 px-4 border border-[#00A3FF] text-[#00A3FF] text-sm font-medium rounded hover:bg-[#00A3FF]/10 transition-colors">
                  Request Integration
                </button>
              </div>
            </div>
          )}

          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Roadmap</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {module.roadmap.map((phase, i) => (
                  <div key={i} className={`border-t-4 p-6 rounded-lg bg-[#161B22] border border-[#1F242C] ${roadmapColors[phase.status]}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">{phase.version}</span>
                      <span className="text-sm text-[#8B949E]">{phase.title}</span>
                    </div>
                    <div className="space-y-3">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <span className={phase.status === 'current' ? 'text-[#3CCB7F]' : 'text-[#8B949E]'}>
                            {phase.status === 'current' ? '●' : '○'}
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Other Modules */}
      <section className="py-12 border-t border-[#1F242C] bg-[#0D1117]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-xl font-semibold mb-6">Other Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_MODULES.filter(m => m.slug !== slug).map((m) => (
              <Link 
                key={m.slug} 
                href={`/modules/${m.slug}`}
                className="bg-[#161B22] border border-[#1F242C] p-4 rounded-lg hover:border-[#00A3FF]/50 transition-colors text-center"
              >
                <span className="text-2xl mb-2 block">{m.icon}</span>
                <span className="text-sm font-medium">{m.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    {/* Coming Soon Modal */}
      {showComingSoon && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowComingSoon(false)}
        >
          <div 
            className="bg-[#0d1117] border border-[#1F242C] rounded-lg max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{module.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-[#8B949E] mb-6">
                The {module.name} is currently in {module.statusLabel.toLowerCase()} phase. 
                Full access will be available soon.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B949E]">Status</span>
                  <span className={module.status === 'live' ? 'text-[#3CCB7F]' : 'text-[#FFB84D]'}>
                    {module.statusLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B949E]">Expected Release</span>
                  <span className="text-white">{module.roadmap[0]?.title || 'TBA'}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowComingSoon(false)}
                className="mt-6 w-full h-11 bg-[#00A3FF] text-[#0D1117] font-medium rounded hover:bg-[#33B5FF] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Demo Modal */}
      {showDemoForm && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowDemoForm(false)}
        >
          <div 
            className="bg-[#0d1117] border border-[#1F242C] rounded-lg max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-6">Request Demo</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Demo request submitted!'); setShowDemoForm(false); }} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full h-11 bg-[#161B22] border border-[#1F242C] rounded px-4 text-white focus:border-[#00A3FF] focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full h-11 bg-[#161B22] border border-[#1F242C] rounded px-4 text-white focus:border-[#00A3FF] focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Organization</label>
                <input 
                  type="text" 
                  required
                  className="w-full h-11 bg-[#161B22] border border-[#1F242C] rounded px-4 text-white focus:border-[#00A3FF] focus:outline-none"
                  placeholder="Your organization"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8B949E] mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-[#161B22] border border-[#1F242C] rounded px-4 py-3 text-white focus:border-[#00A3FF] focus:outline-none resize-none"
                  placeholder="Tell us about your use case..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowDemoForm(false)}
                  className="flex-1 h-11 border border-[#1F242C] text-[#8B949E] font-medium rounded hover:border-[#00A3FF] hover:text-[#E6EDF3] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-11 bg-[#00A3FF] text-[#0D1117] font-medium rounded hover:bg-[#33B5FF] transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AutopilotWidget module={slug as any} />

    </div>
  );
}