'use client';

import AutopilotWidget from '@/components/AutopilotWidget';

import { useState } from 'react';
import Link from 'next/link';

const CAPABILITIES = [
  { 
    icon: '📊', 
    title: 'Budget tracking & transparency',
    details: {
      description: 'Real-time monitoring of all budget allocations, expenditures, and fund transfers with complete transparency and accountability.',
      features: [
        'Live dashboard with up-to-the-minute budget status',
        'Automated alerts for unusual spending patterns',
        'Multi-currency support with automatic conversion',
        'Granular permissions for different stakeholder levels',
        'Immutable audit trail for all transactions',
      ],
      metrics: {
        'Tracked Budgets': '$3.8B',
        'Transactions/Day': '12,400',
        'Accuracy': '99.97%',
      }
    }
  },
  { 
    icon: '🌍', 
    title: 'Humanitarian aid distribution',
    details: {
      description: 'Coordinated multi-region aid distribution with real-time tracking from donor to beneficiary.',
      features: [
        'GPS tracking of aid shipments',
        'Digital proof of delivery with photos',
        'Beneficiary registration and verification',
        'Multi-country coordination dashboard',
        'Impact metrics and reporting',
      ],
      metrics: {
        'Beneficiaries Served': '5.4M',
        'Active Programs': '267',
        'Countries': '24',
      }
    }
  },
  { 
    icon: '⚖️', 
    title: 'Ethical governance frameworks',
    details: {
      description: 'Built-in compliance checks and ethical safeguards aligned with international humanitarian standards.',
      features: [
        'Automated compliance monitoring (ISO 27001, SOC 2, GDPR)',
        'Ethical decision support with AI reasoning',
        'Conflict of interest detection',
        'Human rights impact assessment',
        'Whistleblower protection mechanisms',
      ],
      metrics: {
        'Compliance Score': '95.3%',
        'Policies Enforced': '340',
        'Audits Passed': '100%',
      }
    }
  },
  { 
    icon: '🤖', 
    title: 'AI-powered decision support',
    details: {
      description: 'Intelligent automation with explainable AI that assists human decision-makers without replacing them.',
      features: [
        'Risk scoring for procurement and projects',
        'Fraud detection with anomaly analysis',
        'Predictive analytics for demand forecasting',
        'Natural language processing for document analysis',
        'Human-in-the-loop approval for all AI decisions',
      ],
      metrics: {
        'AI Accuracy': '97.2%',
        'Decisions/Day': '45,000',
        'Fraud Prevented': '$89M',
      }
    }
  },
  { 
    icon: '📋', 
    title: 'Full audit trail & compliance',
    details: {
      description: 'Complete immutable logging of all system actions with blockchain-anchored audit trails.',
      features: [
        'Every action logged with timestamp and user ID',
        'Blockchain anchoring for tamper-proof records',
        'Automated compliance report generation',
        'Export capabilities for external auditors',
        'GDPR-compliant data retention',
      ],
      metrics: {
        'Records Logged': '847M',
        'Audit Requests': '12,400/mo',
        'Uptime': '99.99%',
      }
    }
  },
  { 
    icon: '🧩', 
    title: 'Module integration',
    details: {
      description: 'Seamless integration with Procurement, Logistics, Donor Dashboard, and other IVYAR modules.',
      features: [
        'Real-time data sync across all modules',
        'Unified authentication and permissions',
        'Cross-module analytics and reporting',
        'Webhook support for external systems',
        'RESTful and GraphQL APIs',
      ],
      metrics: {
        'Connected Modules': '11',
        'API Calls/Day': '2.4M',
        'Integration Partners': '34',
      }
    }
  },
];

export default function HBSPage() {
  const [selectedCapability, setSelectedCapability] = useState<typeof CAPABILITIES[0] | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/us" 
            className="inline-flex items-center text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors"
          >
            ← BACK TO MODULES
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 border-l-4 border-blue-500 pl-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-6xl">🏛️</span>
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-1">
                HBS MODULE
              </h1>
              <p className="text-lg text-gray-400 font-light">
                Humanitarian Budget Support
              </p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-12 bg-[#111111] border border-gray-800 rounded-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
              <div className="text-green-400 font-mono font-semibold">✓ CORE</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Version</div>
              <div className="text-white font-mono">3.0</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">API Endpoints</div>
              <div className="text-white font-mono">8</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Updated</div>
              <div className="text-white font-mono text-sm">2026-01-08</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Compliance</div>
            <div className="flex flex-wrap gap-2">
              {['ISO 27001', 'SOC 2', 'GDPR', 'IRAP'].map((cert) => (
                <span
                  key={cert}
                  className="px-3 py-1 bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs font-mono"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          
          {/* Overview */}
          <div className="bg-[#111111] border border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
              <span className="text-2xl">📘</span>
              <h2 className="text-xl font-light tracking-wide text-white">OVERVIEW</h2>
            </div>
            <p className="text-gray-400 leading-relaxed font-light">
              The HBS module provides institutional-grade tools for transparent, ethical, and AI-aligned humanitarian budget governance across ministries, donors, and international partners.
            </p>
          </div>

          {/* AI Governance */}
          <div className="bg-[#111111] border border-blue-900/30 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-900/30">
              <span className="text-2xl">🧠</span>
              <h2 className="text-xl font-light tracking-wide text-blue-400">AI GOVERNANCE</h2>
            </div>
            <ul className="space-y-3 text-gray-400 font-light">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Human-in-the-loop approval</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Explainable decisions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Risk scoring & assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Complete audit logs</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Key Capabilities - Clickable */}
        <div className="bg-[#111111] border border-gray-800 p-8 mb-6">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
            <span className="text-2xl">🔑</span>
            <h2 className="text-xl font-light tracking-wide text-white">KEY CAPABILITIES</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {CAPABILITIES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCapability(item)}
                className="flex items-start gap-3 p-4 bg-[#1a1a1a] border border-gray-800 hover:border-blue-600 hover:bg-[#1f1f1f] transition-all cursor-pointer text-left group"
              >
                <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <span className="text-gray-400 text-sm font-light group-hover:text-gray-200 transition-colors">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#111111] border border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            <span className="text-2xl">🔗</span>
            <h2 className="text-xl font-light tracking-wide text-white">ACTIONS</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/us/hbs/autopilot"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm tracking-wider transition-colors"
            >
              OPEN MODULE →
            </Link>
            <Link
              href="/us/hbs/api-docs"
              className="px-8 py-3 border border-gray-700 hover:border-blue-600 text-gray-300 hover:text-blue-400 font-mono text-sm tracking-wider transition-colors"
            >
              VIEW API →
            </Link>
            <Link
              href="/us/hbs/demo"
              className="px-8 py-3 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-mono text-sm tracking-wider transition-colors"
            >
              RUN DEMO →
            </Link>
          </div>
        </div>

      </div>

      {/* Modal */}
      {selectedCapability && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedCapability(null)}
        >
          <div 
            className="bg-[#0d1117] border border-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#0d1117] border-b border-gray-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCapability.icon}</span>
                <h3 className="text-2xl font-light text-white">{selectedCapability.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedCapability(null)}
                className="text-gray-500 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Description */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Description</h4>
                <p className="text-gray-300 leading-relaxed">{selectedCapability.details.description}</p>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Features</h4>
                <ul className="space-y-2">
                  {selectedCapability.details.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-blue-500 mt-1">▸</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Key Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(selectedCapability.details.metrics).map(([label, value]) => (
                    <div key={label} className="bg-[#161b22] border border-gray-800 p-4 rounded">
                      <div className="text-2xl font-bold text-white mb-1">{value}</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-800 p-6 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedCapability(null)}
                className="px-6 py-2 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-mono text-sm transition-colors"
              >
                CLOSE
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm transition-colors">
                LEARN MORE →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AutopilotWidget module="hbs" />
    </main>
  );
}
