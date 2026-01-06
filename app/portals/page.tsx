'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type PortalType = 'vendor' | 'contractor' | 'logistics' | 'api' | 'access';

interface PortalFeature {
  icon: string;
  title: string;
  description: string;
}

// ============================================
// DATA
// ============================================
const PORTALS = {
  vendor: {
    id: 'vendor',
    title: 'Vendor Portal',
    subtitle: 'Supplier Management & Procurement',
    icon: '🏪',
    color: '#00A3FF',
    description: 'Register as a vendor, respond to tenders, manage contracts, and track payments through the IVYAR procurement ecosystem.',
    stats: [
      { value: '2,400+', label: 'Registered Vendors' },
      { value: '$890M', label: 'Contract Value' },
      { value: '99.1%', label: 'On-time Payments' },
      { value: '4.8/5', label: 'Vendor Satisfaction' },
    ],
    features: [
      { icon: '📋', title: 'Tender Discovery', description: 'Browse and apply for public procurement opportunities' },
      { icon: '📄', title: 'Bid Submission', description: 'Submit proposals with supporting documentation' },
      { icon: '📊', title: 'Contract Management', description: 'Track contract milestones and deliverables' },
      { icon: '💰', title: 'Payment Tracking', description: 'Real-time visibility into payment status' },
      { icon: '📈', title: 'Performance Dashboard', description: 'Monitor your vendor rating and history' },
      { icon: '🔔', title: 'Notifications', description: 'Alerts for new opportunities and deadlines' },
    ] as PortalFeature[],
    requirements: [
      'Valid business registration certificate',
      'Tax compliance documentation',
      'Bank account verification',
      'Authorized signatory details',
      'Category-specific certifications (if applicable)',
    ],
  },
  contractor: {
    id: 'contractor',
    title: 'Contractor Portal',
    subtitle: 'Project Execution & Compliance',
    icon: '🏗️',
    color: '#3CCB7F',
    description: 'Manage project implementation, submit progress reports, handle compliance requirements, and coordinate with government agencies.',
    stats: [
      { value: '580+', label: 'Active Contractors' },
      { value: '1,240', label: 'Projects Managed' },
      { value: '94%', label: 'On-time Delivery' },
      { value: '$2.1B', label: 'Project Value' },
    ],
    features: [
      { icon: '📁', title: 'Project Dashboard', description: 'Centralized view of all assigned projects' },
      { icon: '📝', title: 'Progress Reporting', description: 'Submit milestones, photos, and documentation' },
      { icon: '✅', title: 'Compliance Tracking', description: 'Environmental and social safeguards monitoring' },
      { icon: '👥', title: 'Workforce Management', description: 'Track labor, safety, and local content' },
      { icon: '💳', title: 'Invoice Submission', description: 'Digital invoicing with blockchain verification' },
      { icon: '📞', title: 'Issue Resolution', description: 'Direct communication with project managers' },
    ] as PortalFeature[],
    requirements: [
      'Contractor license and registration',
      'Insurance certificates (liability, workers comp)',
      'Safety management plan',
      'Environmental compliance certification',
      'Previous project references',
    ],
  },
  logistics: {
    id: 'logistics',
    title: 'Logistics Portal',
    subtitle: 'Supply Chain & Distribution',
    icon: '🚚',
    color: '#F59E0B',
    description: 'Coordinate humanitarian logistics, track shipments, manage warehouses, and optimize distribution routes across the supply chain.',
    stats: [
      { value: '340+', label: 'Logistics Partners' },
      { value: '12.5M', label: 'Items Distributed' },
      { value: '98.7%', label: 'Delivery Accuracy' },
      { value: '47', label: 'Warehouse Locations' },
    ],
    features: [
      { icon: '📦', title: 'Shipment Tracking', description: 'Real-time GPS tracking of all shipments' },
      { icon: '🏭', title: 'Warehouse Management', description: 'Inventory levels, receipts, and dispatches' },
      { icon: '🗺️', title: 'Route Optimization', description: 'AI-powered delivery route planning' },
      { icon: '📋', title: 'Proof of Delivery', description: 'Digital signatures and photo confirmation' },
      { icon: '🔄', title: 'Returns Management', description: 'Handle damaged or rejected items' },
      { icon: '📊', title: 'Analytics', description: 'Performance metrics and cost analysis' },
    ] as PortalFeature[],
    requirements: [
      'Transport operator license',
      'Vehicle fleet documentation',
      'Cold chain certification (if applicable)',
      'Security clearance for sensitive items',
      'GPS/tracking device installation',
    ],
  },
  api: {
    id: 'api',
    title: 'API Access Portal',
    subtitle: 'Developer Integration Hub',
    icon: '🔌',
    color: '#A371F7',
    description: 'Access IVYAR APIs for system integration, build custom applications, and extend platform capabilities with comprehensive developer tools.',
    stats: [
      { value: '200+', label: 'API Endpoints' },
      { value: '450+', label: 'Registered Apps' },
      { value: '99.9%', label: 'API Uptime' },
      { value: '28M', label: 'Monthly Requests' },
    ],
    features: [
      { icon: '🔑', title: 'API Key Management', description: 'Generate, rotate, and revoke API credentials' },
      { icon: '📚', title: 'Documentation', description: 'Interactive OpenAPI 3.1 documentation' },
      { icon: '🧪', title: 'Sandbox Environment', description: 'Test integrations with sample data' },
      { icon: '📊', title: 'Usage Analytics', description: 'Monitor API calls, latency, and errors' },
      { icon: '🔔', title: 'Webhooks', description: 'Configure real-time event notifications' },
      { icon: '💬', title: 'Developer Support', description: 'Technical support and community forum' },
    ] as PortalFeature[],
    requirements: [
      'Verified developer account',
      'Organization affiliation',
      'Use case documentation',
      'Data handling agreement',
      'Security assessment (for production)',
    ],
  },
};

const ACCESS_STEPS = [
  {
    step: 1,
    title: 'Submit Request',
    description: 'Complete the access request form with organization details and intended use case.',
    duration: '5-10 min',
    icon: '📝',
  },
  {
    step: 2,
    title: 'Document Upload',
    description: 'Upload required verification documents based on portal type.',
    duration: '10-15 min',
    icon: '📎',
  },
  {
    step: 3,
    title: 'Identity Verification',
    description: 'Verify authorized representative identity through secure KYC process.',
    duration: '24-48 hours',
    icon: '🔐',
  },
  {
    step: 4,
    title: 'Compliance Review',
    description: 'IVYAR team reviews application for compliance and eligibility.',
    duration: '3-5 business days',
    icon: '✅',
  },
  {
    step: 5,
    title: 'Security Assessment',
    description: 'Technical security review for API and high-privilege access requests.',
    duration: '5-7 business days',
    icon: '🛡️',
  },
  {
    step: 6,
    title: 'Onboarding',
    description: 'Account activation, training materials, and dedicated support assignment.',
    duration: '1-2 days',
    icon: '🎓',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function PortalsPage() {
  const [activePortal, setActivePortal] = useState<PortalType>('vendor');
  const [showAccessFlow, setShowAccessFlow] = useState(false);

  const portal = PORTALS[activePortal];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <span className="font-semibold">IVYAR Partner Portals</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-[#8B949E] hover:text-white">Documentation</Link>
            <Link href="/support" className="text-sm text-[#8B949E] hover:text-white">Support</Link>
            <button 
              onClick={() => setShowAccessFlow(true)}
              className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]"
            >
              Request Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-[#161B22] to-[#0D1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🌐</span>
            <span className="text-sm bg-[#00A3FF]/10 text-[#00A3FF] px-3 py-1 rounded-full font-medium">
              Partner Ecosystem
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Partner Portals</h1>
          <p className="text-[#8B949E] max-w-2xl">
            Access specialized portals for vendors, contractors, logistics partners, and developers. 
            Join the IVYAR ecosystem to participate in government programs and humanitarian operations.
          </p>
        </div>
      </section>

      {/* Portal Tabs */}
      <section className="border-b border-[#1F242C] sticky top-16 bg-[#0D1117] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {Object.values(PORTALS).map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePortal(p.id as PortalType); setShowAccessFlow(false); }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activePortal === p.id && !showAccessFlow
                    ? 'text-[#0D1117]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
                style={activePortal === p.id && !showAccessFlow ? { backgroundColor: p.color } : {}}
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
              </button>
            ))}
            <button
              onClick={() => setShowAccessFlow(true)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                showAccessFlow
                  ? 'bg-[#EC4899] text-[#0D1117]'
                  : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <span>🔐</span>
              <span>Access Request</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {showAccessFlow ? (
            <SecureAccessFlow onClose={() => setShowAccessFlow(false)} />
          ) : (
            <PortalContent portal={portal} onRequestAccess={() => setShowAccessFlow(true)} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#161B22] border-t border-[#1F242C] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-xs">
                IV
              </div>
              <span className="text-sm text-[#8B949E]">IVYAR Partner Portals — Secure Access</span>
            </div>
            <div className="flex gap-6 text-sm text-[#6E7681]">
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// PORTAL CONTENT COMPONENT
// ============================================
function PortalContent({ portal, onRequestAccess }: { portal: typeof PORTALS.vendor; onRequestAccess: () => void }) {
  return (
    <div className="space-y-12">
      {/* Portal Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${portal.color}20` }}
            >
              {portal.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{portal.title}</h2>
              <p className="text-[#8B949E]">{portal.subtitle}</p>
            </div>
          </div>
          <p className="text-[#8B949E] mb-6">{portal.description}</p>
          <div className="flex gap-4">
            <button 
              onClick={onRequestAccess}
              className="px-6 py-3 rounded-lg font-medium text-[#0D1117]"
              style={{ backgroundColor: portal.color }}
            >
              Request Access
            </button>
            <button className="px-6 py-3 bg-[#1F242C] text-[#E6EDF3] rounded-lg font-medium hover:bg-[#2D333B]">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {portal.stats.map((stat, i) => (
            <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5">
              <div className="text-2xl font-bold" style={{ color: portal.color }}>{stat.value}</div>
              <div className="text-sm text-[#8B949E]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Portal Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portal.features.map((feature, i) => (
            <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-5 hover:border-[#3D444D] transition-colors">
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-[#8B949E]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements & Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requirements */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Registration Requirements</h3>
          <ul className="space-y-3">
            {portal.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#3CCB7F] mt-0.5">✓</span>
                <span className="text-sm text-[#8B949E]">{req}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-[#0D1117] rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <span>⏱️</span>
              <span className="text-[#8B949E]">Average approval time:</span>
              <span className="font-medium">5-7 business days</span>
            </div>
          </div>
        </div>

        {/* Portal Preview */}
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Portal Preview</h3>
          <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg overflow-hidden">
            {/* Mock Portal UI */}
            <div className="h-8 bg-[#161B22] border-b border-[#1F242C] flex items-center px-3 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F85149]"></div>
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
              <div className="w-3 h-3 rounded-full bg-[#3CCB7F]"></div>
              <div className="flex-1 text-center text-xs text-[#6E7681]">
                {portal.title} — Dashboard
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: `${portal.color}30` }}></div>
                  <div>
                    <div className="text-xs font-medium">Welcome back</div>
                    <div className="text-[10px] text-[#6E7681]">Last login: Today, 09:42</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#1F242C]"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded bg-[#1F242C]"></div>
                ))}
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-8 rounded bg-[#1F242C]"></div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#6E7681] mt-3 text-center">
            Actual portal interface shown after access approval
          </p>
        </div>
      </div>

      {/* Integration Options (for API portal) */}
      {portal.id === 'api' && (
        <div>
          <h3 className="text-xl font-semibold mb-6">Available APIs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Programs API', version: 'v1.4', endpoints: 18 },
              { name: 'Beneficiaries API', version: 'v1.3', endpoints: 15 },
              { name: 'Payments API', version: 'v1.5', endpoints: 14 },
              { name: 'Analytics API', version: 'v1.2', endpoints: 22 },
              { name: 'Procurement API', version: 'v1.1', endpoints: 18 },
              { name: 'Logistics API', version: 'v1.0', endpoints: 14 },
              { name: 'Prometheus API', version: 'v1.2', endpoints: 16 },
              { name: 'Webhooks API', version: 'v1.0', endpoints: 6 },
            ].map((api, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{api.name}</span>
                  <span className="text-xs bg-[#A371F7]/20 text-[#A371F7] px-2 py-0.5 rounded">{api.version}</span>
                </div>
                <div className="text-xs text-[#6E7681]">{api.endpoints} endpoints</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            { q: `How do I register for the ${portal.title}?`, a: 'Click "Request Access" and complete the secure registration form. Our team will review your application within 5-7 business days.' },
            { q: 'What documents do I need to provide?', a: `You'll need to provide business registration, tax compliance, and category-specific certifications. Full requirements are listed above.` },
            { q: 'How long does the approval process take?', a: 'Standard approval takes 5-7 business days. Expedited processing is available for urgent requirements.' },
            { q: 'Is there a fee for portal access?', a: 'Basic portal access is free. Premium features and higher API limits may require subscription.' },
          ].map((faq, i) => (
            <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-5">
              <h4 className="font-medium mb-2">{faq.q}</h4>
              <p className="text-sm text-[#8B949E]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECURE ACCESS FLOW COMPONENT
// ============================================
function SecureAccessFlow({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    portalType: 'vendor',
    organizationName: '',
    registrationNumber: '',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    useCase: '',
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
          <div className="w-20 h-20 bg-[#3CCB7F]/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Request Submitted</h2>
          <p className="text-[#8B949E] mb-6">
            Thank you for your application. Our team will review your request and contact you within 5-7 business days.
          </p>
          <div className="bg-[#0D1117] rounded-lg p-4 mb-6">
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-[#8B949E]">Request ID:</span>
                <span className="font-mono">REQ-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#8B949E]">Portal Type:</span>
                <span>{PORTALS[formData.portalType as keyof typeof PORTALS]?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Submitted:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF]"
            >
              Back to Portals
            </button>
            <a 
              href="mailto:support@ivyar.org"
              className="px-6 py-3 bg-[#1F242C] text-[#E6EDF3] rounded-lg font-medium hover:bg-[#2D333B]"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔐</span>
            <h2 className="text-2xl font-bold">Secure Access Request</h2>
          </div>
          <p className="text-[#8B949E]">Complete the form below to request access to IVYAR partner portals</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#8B949E] hover:text-white"
        >
          ✕ Close
        </button>
      </div>

      {/* Process Overview */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-[#8B949E] mb-4">ACCESS REQUEST PROCESS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ACCESS_STEPS.map((step, i) => (
            <div key={i} className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2 ${
                i <= currentStep ? 'bg-[#00A3FF]/20' : 'bg-[#1F242C]'
              }`}>
                {step.icon}
              </div>
              <div className="text-xs font-medium mb-1">{step.title}</div>
              <div className="text-[10px] text-[#6E7681]">{step.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="space-y-6">
          {/* Portal Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Select Portal Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(PORTALS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setFormData({ ...formData, portalType: p.id })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.portalType === p.id
                      ? 'border-[#00A3FF] bg-[#00A3FF]/10'
                      : 'border-[#1F242C] bg-[#0D1117] hover:border-[#3D444D]'
                  }`}
                >
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="text-sm font-medium">{p.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Organization Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Name *</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Registration Number *</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
                placeholder="Business registration number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country of Registration *</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
            >
              <option value="">Select country</option>
              <option value="UA">Ukraine</option>
              <option value="PL">Poland</option>
              <option value="DE">Germany</option>
              <option value="GE">Georgia</option>
              <option value="MD">Moldova</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Contact Details */}
          <div className="border-t border-[#1F242C] pt-6">
            <h4 className="text-sm font-semibold mb-4">Primary Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
                  placeholder="Authorized representative"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
                  placeholder="email@organization.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm"
                  placeholder="+380 XX XXX XXXX"
                />
              </div>
            </div>
          </div>

          {/* Use Case */}
          <div>
            <label className="block text-sm font-medium mb-2">Intended Use Case *</label>
            <textarea
              value={formData.useCase}
              onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
              className="w-full bg-[#0D1117] border border-[#1F242C] rounded-lg px-4 py-3 text-sm h-24 resize-none"
              placeholder="Describe how you plan to use the portal..."
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-[#8B949E]">
              I agree to the <a href="#" className="text-[#00A3FF] hover:underline">Terms of Service</a>, 
              <a href="#" className="text-[#00A3FF] hover:underline"> Privacy Policy</a>, and 
              <a href="#" className="text-[#00A3FF] hover:underline"> Data Processing Agreement</a>. 
              I confirm that I am authorized to submit this request on behalf of the organization.
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={!formData.agreedToTerms || !formData.organizationName || !formData.contactEmail || isSubmitting}
              className="flex-1 py-3 bg-[#00A3FF] text-[#0D1117] rounded-lg font-medium hover:bg-[#33B5FF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Access Request'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#1F242C] text-[#E6EDF3] rounded-lg font-medium hover:bg-[#2D333B]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-[#161B22] border border-[#1F242C] rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <div>
            <h4 className="text-sm font-medium mb-1">Security & Compliance</h4>
            <p className="text-xs text-[#8B949E]">
              All access requests are processed through secure channels. Your information is encrypted 
              and handled in compliance with GDPR and ISO 27001 standards. Background verification 
              may be conducted for sensitive access levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
