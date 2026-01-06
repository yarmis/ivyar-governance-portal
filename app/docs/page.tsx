'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// NAVIGATION SECTIONS
// ============================================
const SECTIONS = [
  { id: 'overview', name: 'Overview', icon: '📋' },
  { id: 'architecture', name: 'Architecture', icon: '🏗️' },
  { id: 'use-cases', name: 'Use Cases', icon: '💡' },
  { id: 'api', name: 'API Reference', icon: '🔌' },
  { id: 'diagrams', name: 'Diagrams', icon: '📊' },
  { id: 'deployment', name: 'Deployment', icon: '🚀' },
  { id: 'compliance', name: 'Compliance', icon: '🛡️' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function PlatformDocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <span className="font-semibold">IVYAR Documentation</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-[#00A3FF]/10 text-[#00A3FF] px-2 py-1 rounded font-medium">
              v10.0 Sovereign Intelligence
            </span>
            <Link href="/demo" className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF] transition-colors">
              Request Demo
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#161B22] border-r border-[#1F242C] overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
              Documentation
            </h3>
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#00A3FF]/10 text-[#00A3FF]'
                      : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F242C]'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.name}</span>
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-[#1F242C]">
              <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
                Resources
              </h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-[#8B949E] hover:text-[#00A3FF]">API Reference →</a>
                <a href="#" className="block text-[#8B949E] hover:text-[#00A3FF]">GitHub →</a>
                <a href="#" className="block text-[#8B949E] hover:text-[#00A3FF]">Support →</a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto px-8 py-12">

            {/* ========================================
                SECTION 1: OVERVIEW
            ======================================== */}
            <section id="overview" className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📋</span>
                <h1 className="text-3xl font-bold">IVYAR Governance Platform</h1>
              </div>

              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-8">
                <p className="text-lg text-[#8B949E] leading-relaxed">
                  IVYAR is a <strong className="text-[#E6EDF3]">sovereign intelligence infrastructure</strong> designed 
                  for governments, international organizations, and development partners. The platform enables 
                  <strong className="text-[#E6EDF3]"> ethical, transparent, and AI-aligned decision-making</strong> across 
                  humanitarian budget support, procurement, logistics, and crisis response operations.
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-4">Core Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🏛️', title: 'Humanitarian Budget Support (HBS)', desc: 'End-to-end management of social protection programs, beneficiary registries, and payment disbursement' },
                  { icon: '🔗', title: 'Prometheus Blockchain', desc: 'Ethereum L2 distributed ledger for immutable transaction records and verification' },
                  { icon: '🛡️', title: 'Sovereign Intelligence Layer', desc: 'National-level decision support with policy simulation and impact analysis' },
                  { icon: '⚠️', title: 'Crisis Anticipation Engine', desc: 'Early warning system combining 47+ data sources for threat prediction' },
                  { icon: '🤖', title: 'AI Administrator', desc: 'Ethical AI assistant with human oversight, explainable reasoning, and audit trails' },
                  { icon: '✅', title: 'Ethical Core v2.0', desc: 'Ethics validation layer ensuring non-discrimination and zero-harm principles' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-[#8B949E]">{item.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '24+', label: 'Countries' },
                  { value: '192', label: 'Programs' },
                  { value: '$7.8B', label: 'Budget Managed' },
                  { value: '9.6M', label: 'Beneficiaries' },
                  { value: '45.2M+', label: 'Blockchain Tx' },
                  { value: '99.97%', label: 'Uptime' },
                  { value: '200+', label: 'API Endpoints' },
                  { value: '16', label: 'Modules' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#00A3FF]">{stat.value}</div>
                    <div className="text-sm text-[#8B949E]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================
                SECTION 2: ARCHITECTURE
            ======================================== */}
            <section id="architecture" className="mb-16 pt-8 border-t border-[#1F242C]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏗️</span>
                <h1 className="text-3xl font-bold">System Architecture</h1>
              </div>

              <h2 className="text-xl font-semibold mb-4">Architecture Principles</h2>
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-8">
                <ul className="space-y-3">
                  {[
                    { title: 'Microservices Architecture', desc: 'Independent, deployable services with clear boundaries' },
                    { title: 'Event-Driven Design', desc: 'Asynchronous communication via Apache Kafka message queues' },
                    { title: 'API-First Approach', desc: 'All functionality exposed via versioned REST and GraphQL APIs' },
                    { title: 'Zero Trust Security', desc: 'Every request authenticated, authorized, and encrypted' },
                    { title: 'Multi-Region Deployment', desc: 'Geographic redundancy with data sovereignty compliance' },
                    { title: 'Infrastructure as Code', desc: 'Terraform-managed, version-controlled infrastructure' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#3CCB7F] mt-1">✓</span>
                      <div>
                        <strong className="text-[#E6EDF3]">{item.title}</strong>
                        <span className="text-[#8B949E]"> — {item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#161B22]">
                      <th className="text-left p-3 border border-[#1F242C] font-semibold">Layer</th>
                      <th className="text-left p-3 border border-[#1F242C] font-semibold">Technologies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { layer: 'Frontend', tech: 'Next.js 16, React 19, TypeScript 5.x, Tailwind CSS' },
                      { layer: 'Backend', tech: 'Node.js 22, Express, GraphQL, gRPC' },
                      { layer: 'Database', tech: 'PostgreSQL 16, Redis, TimescaleDB, Elasticsearch' },
                      { layer: 'Blockchain', tech: 'Ethereum L2 (Optimism), Solidity, Hardhat' },
                      { layer: 'AI/ML', tech: 'Python 3.12, TensorFlow, PyTorch, LangChain' },
                      { layer: 'Infrastructure', tech: 'Kubernetes 1.28+, Docker, Terraform, AWS/GCP/Azure' },
                      { layer: 'Monitoring', tech: 'Prometheus, Grafana, ELK Stack, Sentry' },
                      { layer: 'Security', tech: 'HashiCorp Vault, Kong API Gateway, OAuth 2.0/OIDC' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-[#1F242C]">
                        <td className="p-3 border border-[#1F242C] text-[#00A3FF] font-medium">{row.layer}</td>
                        <td className="p-3 border border-[#1F242C] text-[#8B949E]">{row.tech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold mb-4">Module Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { category: 'Core Modules (6)', modules: ['HBS Core', 'Governance Engine', 'Analytics', 'Prometheus', 'Signals', 'Crisis Anticipation'], color: '#00A3FF' },
                  { category: 'Operational (4)', modules: ['Procurement', 'Logistics', 'Donor Dashboard', 'Data Platform'], color: '#3CCB7F' },
                  { category: 'Intelligence (4)', modules: ['Sovereign Layer', 'National Digital Twin', 'AI Operations', 'Protection from Delays'], color: '#A371F7' },
                  { category: 'Support (4)', modules: ['AI Administrator', 'HBS Academy', 'Ethical Core v2.0', 'Audit Layer'], color: '#F59E0B' },
                ].map((cat, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-4">
                    <h3 className="font-semibold mb-3" style={{ color: cat.color }}>{cat.category}</h3>
                    <ul className="space-y-1 text-sm text-[#8B949E]">
                      {cat.modules.map((m, j) => (
                        <li key={j}>• {m}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================
                SECTION 3: USE CASES
            ======================================== */}
            <section id="use-cases" className="mb-16 pt-8 border-t border-[#1F242C]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💡</span>
                <h1 className="text-3xl font-bold">Use Cases</h1>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: 'Social Protection Program Management',
                    icon: '👥',
                    scenario: 'A Ministry of Social Policy needs to manage cash transfers to 2.5 million beneficiaries across 24 regions.',
                    solution: 'IVYAR HBS Core provides beneficiary registration, eligibility verification, payment scheduling, and disbursement tracking with full audit trails.',
                    outcome: 'Reduced payment delays by 67%, eliminated duplicate payments, achieved 99.8% successful disbursement rate.',
                    modules: ['HBS Core', 'Analytics', 'Prometheus', 'Protection from Delays'],
                  },
                  {
                    title: 'Humanitarian Aid Coordination',
                    icon: '🌍',
                    scenario: 'Multiple UN agencies and NGOs need to coordinate emergency food distribution in a crisis zone.',
                    solution: 'IVYAR Logistics Engine optimizes routes, tracks inventory, and coordinates between 47 partner organizations in real-time.',
                    outcome: 'Reduced delivery time by 43%, improved resource utilization by 35%, prevented $12M in supply chain waste.',
                    modules: ['Logistics', 'Signals', 'Crisis Anticipation', 'Donor Dashboard'],
                  },
                  {
                    title: 'Government Procurement Transparency',
                    icon: '📋',
                    scenario: 'A government wants to digitize all public procurement with blockchain verification for anti-corruption.',
                    solution: 'IVYAR Procurement Engine manages tenders, evaluates bids, and records all transactions on Prometheus blockchain.',
                    outcome: 'Increased competition by 52%, reduced procurement costs by 18%, achieved 100% audit traceability.',
                    modules: ['Procurement', 'Prometheus', 'Governance', 'Audit Layer'],
                  },
                  {
                    title: 'Crisis Early Warning System',
                    icon: '⚠️',
                    scenario: 'National disaster management agency needs to predict and prepare for climate-related emergencies.',
                    solution: 'IVYAR Crisis Anticipation Engine aggregates 47+ data sources, applies ML models, and generates early warnings.',
                    outcome: '14-day advance warning for floods, 89% prediction accuracy, reduced emergency response time by 56%.',
                    modules: ['Crisis Anticipation', 'Signals', 'National Digital Twin', 'AI Operations'],
                  },
                  {
                    title: 'Donor Funding Transparency',
                    icon: '💰',
                    scenario: 'International donors require real-time visibility into how their funds are being utilized.',
                    solution: 'IVYAR Donor Dashboard provides IATI-compliant reporting, impact metrics, and blockchain-verified fund flows.',
                    outcome: 'Increased donor confidence, 99.2% IATI compliance, reduced reporting burden by 70%.',
                    modules: ['Donor Dashboard', 'Analytics', 'Prometheus', 'Governance'],
                  },
                  {
                    title: 'National Policy Simulation',
                    icon: '🏛️',
                    scenario: 'Cabinet needs to evaluate economic impact of proposed social policy changes before implementation.',
                    solution: 'IVYAR National Digital Twin simulates policy scenarios using real national data with AI-powered projections.',
                    outcome: 'Avoided $340M in unintended consequences, improved policy precision, accelerated decision-making.',
                    modules: ['National Digital Twin', 'Sovereign Layer', 'AI Operations', 'Analytics'],
                  },
                ].map((useCase, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{useCase.icon}</span>
                      <h3 className="text-xl font-semibold">{useCase.title}</h3>
                    </div>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-[#8B949E] font-medium">Scenario:</span>
                        <p className="text-[#E6EDF3] mt-1">{useCase.scenario}</p>
                      </div>
                      <div>
                        <span className="text-[#00A3FF] font-medium">IVYAR Solution:</span>
                        <p className="text-[#E6EDF3] mt-1">{useCase.solution}</p>
                      </div>
                      <div>
                        <span className="text-[#3CCB7F] font-medium">Outcome:</span>
                        <p className="text-[#E6EDF3] mt-1">{useCase.outcome}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {useCase.modules.map((mod, j) => (
                          <span key={j} className="text-xs bg-[#1F242C] text-[#8B949E] px-2 py-1 rounded">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================
                SECTION 4: API REFERENCE
            ======================================== */}
            <section id="api" className="mb-16 pt-8 border-t border-[#1F242C]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🔌</span>
                <h1 className="text-3xl font-bold">API Reference</h1>
              </div>

              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">API Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-[#8B949E]">Base URL</span>
                    <p className="text-[#00A3FF] font-mono">https://api.ivyar.org/v1</p>
                  </div>
                  <div>
                    <span className="text-[#8B949E]">Authentication</span>
                    <p className="text-[#E6EDF3]">Bearer Token (JWT)</p>
                  </div>
                  <div>
                    <span className="text-[#8B949E]">Rate Limit</span>
                    <p className="text-[#E6EDF3]">1000 req/min</p>
                  </div>
                  <div>
                    <span className="text-[#8B949E]">Specification</span>
                    <p className="text-[#E6EDF3]">OpenAPI 3.1</p>
                  </div>
                  <div>
                    <span className="text-[#8B949E]">Response Format</span>
                    <p className="text-[#E6EDF3]">JSON</p>
                  </div>
                  <div>
                    <span className="text-[#8B949E]">Total Endpoints</span>
                    <p className="text-[#E6EDF3]">200+</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">API Namespaces</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#161B22]">
                      <th className="text-left p-3 border border-[#1F242C]">Namespace</th>
                      <th className="text-left p-3 border border-[#1F242C]">Description</th>
                      <th className="text-left p-3 border border-[#1F242C]">Endpoints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { ns: '/auth/*', desc: 'Authentication & authorization', count: 8 },
                      { ns: '/users/*', desc: 'User management', count: 12 },
                      { ns: '/programs/*', desc: 'Program management', count: 18 },
                      { ns: '/beneficiaries/*', desc: 'Beneficiary registry', count: 15 },
                      { ns: '/payments/*', desc: 'Payment processing', count: 14 },
                      { ns: '/analytics/*', desc: 'Analytics & reporting', count: 22 },
                      { ns: '/procurement/*', desc: 'Procurement operations', count: 18 },
                      { ns: '/logistics/*', desc: 'Logistics management', count: 14 },
                      { ns: '/prometheus/*', desc: 'Blockchain operations', count: 16 },
                      { ns: '/crisis/*', desc: 'Crisis anticipation', count: 12 },
                      { ns: '/ai/*', desc: 'AI operations', count: 8 },
                      { ns: '/webhooks/*', desc: 'Webhook management', count: 6 },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="p-3 border border-[#1F242C] font-mono text-[#00A3FF]">{row.ns}</td>
                        <td className="p-3 border border-[#1F242C] text-[#8B949E]">{row.desc}</td>
                        <td className="p-3 border border-[#1F242C] text-center">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold mb-4">Example Requests</h2>
              <div className="space-y-4">
                {/* Auth Example */}
                <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg overflow-hidden">
                  <div className="bg-[#161B22] px-4 py-2 border-b border-[#1F242C] flex items-center justify-between">
                    <span className="text-sm font-medium">Authentication</span>
                    <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">POST</span>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="text-[#8B949E]">{`POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "operator@gov.ua",
  "password": "********",
  "mfa_code": "123456"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJl...",
    "expires_in": 86400,
    "user": {
      "id": "usr_abc123",
      "role": "operator",
      "organization": "Ministry of Social Policy"
    }
  }
}`}</code>
                  </pre>
                </div>

                {/* Get Programs Example */}
                <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg overflow-hidden">
                  <div className="bg-[#161B22] px-4 py-2 border-b border-[#1F242C] flex items-center justify-between">
                    <span className="text-sm font-medium">List Programs</span>
                    <span className="text-xs bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-0.5 rounded">GET</span>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="text-[#8B949E]">{`GET /api/v1/programs?status=active&limit=10
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Response:
{
  "success": true,
  "data": [
    {
      "id": "prg_xyz789",
      "name": "Social Assistance Program 2026",
      "status": "active",
      "beneficiaries": 1250000,
      "budget": 450000000,
      "disbursed": 287500000,
      "created_at": "2025-01-15T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 47
  }
}`}</code>
                  </pre>
                </div>

                {/* Blockchain Verification */}
                <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg overflow-hidden">
                  <div className="bg-[#161B22] px-4 py-2 border-b border-[#1F242C] flex items-center justify-between">
                    <span className="text-sm font-medium">Verify Transaction (Prometheus)</span>
                    <span className="text-xs bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-0.5 rounded">GET</span>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="text-[#8B949E]">{`GET /api/v1/prometheus/transactions/0x7f8b...3a2c/verify
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Response:
{
  "success": true,
  "data": {
    "transaction_hash": "0x7f8b...3a2c",
    "verified": true,
    "block_number": 18234567,
    "timestamp": "2026-01-05T14:32:18Z",
    "confirmations": 128,
    "status": "confirmed",
    "merkle_proof": "0xabc..."
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#00A3FF]/10 border border-[#00A3FF]/30 rounded-lg">
                <p className="text-sm text-[#00A3FF]">
                  📘 Full API documentation available at{' '}
                  <a href="https://api.ivyar.org/docs" className="underline">https://api.ivyar.org/docs</a>
                </p>
              </div>
            </section>

            {/* ========================================
                SECTION 5: DIAGRAMS
            ======================================== */}
            <section id="diagrams" className="mb-16 pt-8 border-t border-[#1F242C]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📊</span>
                <h1 className="text-3xl font-bold">Architecture Diagrams</h1>
              </div>

              {/* High-Level Architecture */}
              <h2 className="text-xl font-semibold mb-4">System Architecture</h2>
              <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl p-6 mb-8 font-mono text-xs overflow-x-auto">
                <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 IVYAR PLATFORM                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│   │   Web App    │  │  Mobile App  │  │   Admin UI   │  │   Partner    │           │
│   │  (Next.js)   │  │   (React)    │  │   (React)    │  │     APIs     │           │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│          │                 │                 │                 │                    │
│   ┌──────┴─────────────────┴─────────────────┴─────────────────┴───────┐           │
│   │                        API Gateway (Kong)                           │           │
│   │                   Rate Limiting │ Auth │ Routing                    │           │
│   └──────┬─────────────────┬─────────────────┬─────────────────┬───────┘           │
│          │                 │                 │                 │                    │
│   ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐           │
│   │  HBS Service │  │  Analytics   │  │  Prometheus  │  │  AI Service  │           │
│   │   (Node.js)  │  │  (Python)    │  │  (Solidity)  │  │  (Python)    │           │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│          │                 │                 │                 │                    │
│   ┌──────┴─────────────────┴─────────────────┴─────────────────┴───────┐           │
│   │                     Message Queue (Apache Kafka)                    │           │
│   └──────┬─────────────────┬─────────────────┬─────────────────┬───────┘           │
│          │                 │                 │                 │                    │
│   ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐           │
│   │  PostgreSQL  │  │    Redis     │  │Elasticsearch │  │  Ethereum    │           │
│   │   (Primary)  │  │   (Cache)    │  │  (Search)    │  │   L2 Node    │           │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
                `}</pre>
              </div>

              {/* Data Flow */}
              <h2 className="text-xl font-semibold mb-4">Payment Processing Flow</h2>
              <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl p-6 mb-8 font-mono text-xs overflow-x-auto">
                <pre className="text-[#8B949E]">{`
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Program │     │  HBS    │     │ Ethical │     │Prometheus│    │ Payment │
│ Manager │     │  Core   │     │  Core   │     │Blockchain│    │ Gateway │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     │  1. Create    │               │               │               │
     │   Payment     │               │               │               │
     │──────────────>│               │               │               │
     │               │               │               │               │
     │               │ 2. Validate   │               │               │
     │               │    Ethics     │               │               │
     │               │──────────────>│               │               │
     │               │               │               │               │
     │               │<──────────────│               │               │
     │               │  ✓ Approved   │               │               │
     │               │               │               │               │
     │               │ 3. Record on  │               │               │
     │               │   Blockchain  │               │               │
     │               │──────────────────────────────>│               │
     │               │               │               │               │
     │               │<──────────────────────────────│               │
     │               │    Tx Hash    │               │               │
     │               │               │               │               │
     │               │ 4. Execute    │               │               │
     │               │    Payment    │               │               │
     │               │──────────────────────────────────────────────>│
     │               │               │               │               │
     │               │<──────────────────────────────────────────────│
     │               │   Confirmed   │               │               │
     │               │               │               │               │
     │<──────────────│               │               │               │
     │  5. Success   │               │               │               │
     │   + Tx Hash   │               │               │               │
     │               │               │               │               │
                `}</pre>
              </div>

              {/* Module Relationship */}
              <h2 className="text-xl font-semibold mb-4">Module Dependencies</h2>
              <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl p-6 font-mono text-xs overflow-x-auto">
                <pre className="text-[#8B949E]">{`
                              ┌─────────────────┐
                              │  AI Operations  │
                              │    (Beta)       │
                              └────────┬────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│    Sovereign    │          │  Ethical Core   │          │     Crisis      │
│  Intelligence   │◄────────►│     v2.0        │◄────────►│  Anticipation   │
│     Layer       │          │   (Required)    │          │     Engine      │
└────────┬────────┘          └────────┬────────┘          └────────┬────────┘
         │                             │                             │
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│    National     │          │    HBS Core     │          │     Signals     │
│  Digital Twin   │◄────────►│   (Required)    │◄────────►│     Engine      │
│                 │          │                 │          │                 │
└────────┬────────┘          └────────┬────────┘          └────────┬────────┘
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Prometheus    │
                              │   Blockchain    │
                              │   (Required)    │
                              └────────┬────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
     │   Procurement   │     │    Logistics    │     │ Donor Dashboard │
     │     Engine      │     │     Engine      │     │                 │
     └─────────────────┘     └─────────────────┘     └─────────────────┘
                `}</pre>
              </div>
            </section>

            {/* ========================================
                SECTION 6: DEPLOYMENT
            ======================================== */}
            <section id="deployment" className="mb-16 pt-8 border-t border-[#1F242C]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🚀</span>
                <h1 className="text-3xl font-bold">Deployment Guide</h1>
              </div>

              <h2 className="text-xl font-semibold mb-4">Deployment Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { title: 'Cloud (SaaS)', desc: 'Fully managed by IVYAR', features: ['No infrastructure management', 'Automatic updates', 'Multi-region by default', 'Best for: Quick deployment'], recommended: true },
                  { title: 'Hybrid', desc: 'Data on-premise, compute in cloud', features: ['Data sovereignty', 'Flexible scaling', 'Managed compute', 'Best for: Data-sensitive orgs'] },
                  { title: 'On-Premise', desc: 'Full self-hosted deployment', features: ['Complete control', 'Air-gapped option', 'Custom infrastructure', 'Best for: High-security needs'] },
                ].map((option, i) => (
                  <div key={i} className={`bg-[#161B22] border rounded-xl p-5 ${option.recommended ? 'border-[#00A3FF]' : 'border-[#1F242C]'}`}>
                    {option.recommended && (
                      <span className="text-xs bg-[#00A3FF] text-[#0D1117] px-2 py-0.5 rounded font-medium mb-3 inline-block">
                        Recommended
                      </span>
                    )}
                    <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                    <p className="text-sm text-[#8B949E] mb-4">{option.desc}</p>
                    <ul className="space-y-2 text-sm">
                      {option.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-[#8B949E]">
                          <span className="text-[#3CCB7F]">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Infrastructure Requirements</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#161B22]">
                      <th className="text-left p-3 border border-[#1F242C]">Component</th>
                      <th className="text-left p-3 border border-[#1F242C]">Minimum</th>
                      <th className="text-left p-3 border border-[#1F242C]">Recommended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { comp: 'Kubernetes Cluster', min: '6 nodes', rec: '12+ nodes (HA)' },
                      { comp: 'Application Nodes', min: '4 vCPU, 16GB RAM', rec: '8 vCPU, 32GB RAM' },
                      { comp: 'Database Nodes', min: '8 vCPU, 32GB RAM, 500GB SSD', rec: '16 vCPU, 64GB RAM, 1TB NVMe' },
                      { comp: 'Network Bandwidth', min: '1 Gbps', rec: '10 Gbps' },
                      { comp: 'Storage (Total)', min: '2 TB', rec: '10+ TB' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="p-3 border border-[#1F242C] font-medium">{row.comp}</td>
                        <td className="p-3 border border-[#1F242C] text-[#8B949E]">{row.min}</td>
                        <td className="p-3 border border-[#1F242C] text-[#3CCB7F]">{row.rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold mb-4">Deployment Steps</h2>
              <div className="space-y-4 mb-8">
                {[
                  { step: 1, title: 'Infrastructure Setup', duration: '1-2 weeks', tasks: ['Provision Kubernetes cluster', 'Configure networking & firewalls', 'Setup SSL certificates', 'Deploy monitoring stack'] },
                  { step: 2, title: 'Database Initialization', duration: '2-3 days', tasks: ['Deploy PostgreSQL cluster', 'Setup Redis cache', 'Configure Elasticsearch', 'Initialize blockchain node'] },
                  { step: 3, title: 'Application Deployment', duration: '1 week', tasks: ['Deploy core services via Helm', 'Configure environment variables', 'Setup secrets management', 'Deploy API gateway'] },
                  { step: 4, title: 'Data Migration', duration: '2-4 weeks', tasks: ['Export legacy data', 'Transform to IVYAR schema', 'Validate data integrity', 'Import into production'] },
                  { step: 5, title: 'Integration Setup', duration: '1-2 weeks', tasks: ['Configure SSO/LDAP', 'Setup external APIs', 'Configure webhooks', 'Test integrations'] },
                  { step: 6, title: 'User Training & Go-Live', duration: '2-4 weeks', tasks: ['Train administrators', 'Train operators', 'Conduct UAT', 'Production go-live'] },
                ].map((phase, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-[#00A3FF]/10 text-[#00A3FF] rounded-full flex items-center justify-center font-bold">
                        {phase.step}
                      </div>
                      <div>
                        <h3 className="font-semibold">{phase.title}</h3>
                        <span className="text-sm text-[#8B949E]">{phase.duration}</span>
                      </div>
                    </div>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-[#8B949E]">
                      {phase.tasks.map((task, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#3D444D] rounded-full"></span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Quick Start (Docker)</h2>
              <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg overflow-hidden">
                <div className="bg-[#161B22] px-4 py-2 border-b border-[#1F242C] text-sm font-medium">
                  Development Environment
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-[#8B949E]">{`# Clone repository
git clone https://github.com/ivyar/ivyar-platform.git
cd ivyar-platform

# Copy environment template
cp .env.example .env

# Start services with Docker Compose
docker-compose up -d

# Initialize database
docker-compose exec api npm run db:migrate
docker-compose exec api npm run db:seed

# Access application
# Web UI: http://localhost:3000
# API: http://localhost:8080
# Docs: http://localhost:8080/docs

# Default credentials
# Email: admin@ivyar.local
# Password: ivyar-dev-2026`}</code>
                </pre>
              </div>
            </section>

            {/* ========================================
                SECTION 7: COMPLIANCE
            ======================================== */}
            <section id="compliance" className="mb-16 pt-8 border-t border-[#1F242C]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🛡️</span>
                <h1 className="text-3xl font-bold">Compliance & Security</h1>
              </div>

              <h2 className="text-xl font-semibold mb-4">Certifications & Standards</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { name: 'ISO 27001', status: 'Certified', desc: 'Information Security Management', icon: '🔒' },
                  { name: 'SOC 2 Type II', status: 'Compliant', desc: 'Security, Availability, Confidentiality', icon: '✅' },
                  { name: 'GDPR', status: 'Compliant', desc: 'EU Data Protection', icon: '🇪🇺' },
                  { name: 'IRAP', status: 'Assessed', desc: 'Australian Government Security', icon: '🇦🇺' },
                  { name: 'NATO', status: 'Aligned', desc: 'Security Infrastructure', icon: '🛡️' },
                  { name: 'IATI 2.03', status: '99.2%', desc: 'Aid Transparency Standard', icon: '🌍' },
                  { name: 'OCDS 1.1', status: '98.5%', desc: 'Open Contracting Data', icon: '📋' },
                  { name: 'HXL 1.1', status: '99.8%', desc: 'Humanitarian Data Exchange', icon: '🤝' },
                ].map((cert, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-4 text-center">
                    <span className="text-2xl mb-2 block">{cert.icon}</span>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <span className="text-xs text-[#3CCB7F] font-medium">{cert.status}</span>
                    <p className="text-xs text-[#8B949E] mt-1">{cert.desc}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Security Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Encryption', items: ['AES-256 encryption at rest', 'TLS 1.3 encryption in transit', 'HSM-backed key management', 'End-to-end encryption for sensitive data'] },
                  { title: 'Authentication', items: ['Multi-factor authentication (MFA)', 'Single Sign-On (SAML 2.0, OIDC)', 'Role-based access control (RBAC)', 'Session management with token rotation'] },
                  { title: 'Audit & Monitoring', items: ['Complete audit trail for all actions', 'Blockchain-anchored audit records', 'Real-time SIEM integration', 'Anomaly detection alerts'] },
                  { title: 'Data Protection', items: ['Data classification (4 levels)', 'Right to erasure (GDPR Art. 17)', 'Data retention policies', 'Geographic data residency'] },
                ].map((section, i) => (
                  <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-lg p-5">
                    <h3 className="font-semibold mb-3 text-[#00A3FF]">{section.title}</h3>
                    <ul className="space-y-2 text-sm">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-[#8B949E]">
                          <span className="text-[#3CCB7F]">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Data Residency Options</h2>
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#161B22]">
                      <th className="text-left p-3 border border-[#1F242C]">Region</th>
                      <th className="text-left p-3 border border-[#1F242C]">Location</th>
                      <th className="text-left p-3 border border-[#1F242C]">Compliance</th>
                      <th className="text-left p-3 border border-[#1F242C]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { region: 'EU', location: 'Frankfurt, Germany', compliance: 'GDPR, Schrems II', status: 'Active' },
                      { region: 'US', location: 'Virginia, USA', compliance: 'FedRAMP (pending)', status: 'Active' },
                      { region: 'APAC', location: 'Singapore', compliance: 'PDPA, IRAP', status: 'Active' },
                      { region: 'Ukraine', location: 'Kyiv, Ukraine', compliance: 'Local data law', status: 'Active' },
                      { region: 'UK', location: 'London, UK', compliance: 'UK GDPR', status: 'Planned Q2' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="p-3 border border-[#1F242C] font-medium">{row.region}</td>
                        <td className="p-3 border border-[#1F242C] text-[#8B949E]">{row.location}</td>
                        <td className="p-3 border border-[#1F242C] text-[#8B949E]">{row.compliance}</td>
                        <td className="p-3 border border-[#1F242C]">
                          <span className={`text-xs px-2 py-0.5 rounded ${row.status === 'Active' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold mb-4">Ethical AI Compliance</h2>
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
                <p className="text-[#8B949E] mb-4">
                  IVYAR implements <strong className="text-[#E6EDF3]">Ethical Core v2.0</strong>, ensuring all AI-driven 
                  decisions comply with humanitarian principles and international standards.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { principle: 'Zero Harm', desc: 'AI systems must not cause harm to beneficiaries' },
                    { principle: 'Non-Discrimination', desc: 'Equal treatment regardless of demographics' },
                    { principle: 'Transparency', desc: 'All AI decisions are explainable and auditable' },
                    { principle: 'Human Oversight', desc: 'Critical decisions require human approval' },
                    { principle: 'Accountability', desc: 'Clear responsibility chains for all actions' },
                    { principle: 'Privacy Preservation', desc: 'Minimal data collection, maximum protection' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#00A3FF] mt-0.5">●</span>
                      <div>
                        <strong className="text-[#E6EDF3]">{item.principle}</strong>
                        <p className="text-sm text-[#8B949E]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-gradient-to-r from-[#00A3FF]/10 to-[#A371F7]/10 border border-[#1F242C] rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
              <p className="text-[#8B949E] mb-6">Contact our team for a personalized demo and deployment consultation.</p>
              <div className="flex justify-center gap-4">
                <Link href="/demo" className="bg-[#00A3FF] text-[#0D1117] px-6 py-3 rounded-lg font-medium hover:bg-[#33B5FF] transition-colors">
                  Request Demo
                </Link>
                <a href="mailto:info@ivyar.org" className="bg-[#1F242C] text-[#E6EDF3] px-6 py-3 rounded-lg font-medium hover:bg-[#2D333B] transition-colors">
                  Contact Sales
                </a>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
