'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type DocSection = 'architecture' | 'api' | 'deployment' | 'compliance';
type ArchitectureTab = 'system-map' | 'data-flows' | 'sovereign' | 'audit' | 'ai-ops';
type DeploymentTab = 'single' | 'federation' | 'disaster' | 'hybrid';

// ============================================
// MAIN COMPONENT
// ============================================
export default function PlatformDocsPage() {
  const [activeSection, setActiveSection] = useState<DocSection>('architecture');
  const [architectureTab, setArchitectureTab] = useState<ArchitectureTab>('system-map');
  const [deploymentTab, setDeploymentTab] = useState<DeploymentTab>('single');

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Platform Docs</span>
              <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded font-mono">v10.0</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8B949E]">HBS v10.0 "Sovereign Intelligence"</span>
            <div className="h-4 w-px bg-[#1F242C]"></div>
            <Link href="/demo" className="text-sm bg-[#00A3FF] text-[#0D1117] px-4 py-2 rounded font-medium hover:bg-[#33B5FF]">
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-72 bg-[#161B22] border-r border-[#1F242C] overflow-y-auto">
          <div className="p-4">
            {/* Version Badge */}
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#3CCB7F] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#3CCB7F] font-medium">CURRENT VERSION</span>
              </div>
              <div className="text-lg font-bold">IVYAR Platform v10.0</div>
              <div className="text-xs text-[#8B949E] mt-1">"Sovereign Intelligence" Release</div>
              <div className="text-xs text-[#6E7681] mt-2">Last updated: January 2026</div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {[
                { id: 'architecture', label: 'Architecture Blueprints', icon: '🏗️', badge: 'v10.0' },
                { id: 'api', label: 'API Governance', icon: '🔌', badge: '200+' },
                { id: 'deployment', label: 'Deployment Playbooks', icon: '🚀', badge: '4' },
                { id: 'compliance', label: 'Compliance & Standards', icon: '✅', badge: 'UN/EU' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as DocSection)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#00A3FF]/10 text-[#00A3FF] border border-[#00A3FF]/30'
                      : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1F242C]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    activeSection === item.id ? 'bg-[#00A3FF]/20' : 'bg-[#1F242C]'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              ))}
            </nav>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-[#1F242C]">
              <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="flex items-center gap-2 text-[#8B949E] hover:text-[#00A3FF]">
                  <span>📄</span> OpenAPI Spec (YAML)
                </a>
                <a href="#" className="flex items-center gap-2 text-[#8B949E] hover:text-[#00A3FF]">
                  <span>📦</span> SDK Downloads
                </a>
                <a href="#" className="flex items-center gap-2 text-[#8B949E] hover:text-[#00A3FF]">
                  <span>🧪</span> Sandbox Environment
                </a>
                <a href="#" className="flex items-center gap-2 text-[#8B949E] hover:text-[#00A3FF]">
                  <span>📊</span> Status Dashboard
                </a>
              </div>
            </div>

            {/* Classification */}
            <div className="mt-8 p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
              <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-semibold mb-1">
                <span>🔒</span> CLASSIFICATION
              </div>
              <div className="text-xs text-[#8B949E]">
                Official Government Technical Documentation. 
                Access restricted to authorized personnel.
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 min-h-screen">
          <div className="max-w-5xl mx-auto px-8 py-12">
            {activeSection === 'architecture' && (
              <ArchitectureSection activeTab={architectureTab} setActiveTab={setArchitectureTab} />
            )}
            {activeSection === 'api' && <APIGovernanceSection />}
            {activeSection === 'deployment' && (
              <DeploymentSection activeTab={deploymentTab} setActiveTab={setDeploymentTab} />
            )}
            {activeSection === 'compliance' && <ComplianceSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================
// ARCHITECTURE BLUEPRINTS SECTION
// ============================================
function ArchitectureSection({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: ArchitectureTab; 
  setActiveTab: (tab: ArchitectureTab) => void;
}) {
  const tabs = [
    { id: 'system-map', label: 'System Map', icon: '🗺️' },
    { id: 'data-flows', label: 'Data Flows', icon: '🔄' },
    { id: 'sovereign', label: 'Sovereign Intelligence', icon: '🛡️' },
    { id: 'audit', label: 'Audit & Compliance', icon: '📋' },
    { id: 'ai-ops', label: 'AI Ops Center', icon: '🤖' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏗️</span>
          <div>
            <h1 className="text-3xl font-bold">Architecture Blueprints</h1>
            <span className="text-sm text-[#00A3FF] font-mono">v10.0 "Sovereign Intelligence"</span>
          </div>
        </div>
        <p className="text-[#8B949E] mt-4">
          Complete technical architecture documentation for IVYAR Platform v10.0. 
          These blueprints define the system structure, data flows, and operational layers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ArchitectureTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#00A3FF] text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'system-map' && <SystemMapContent />}
      {activeTab === 'data-flows' && <DataFlowsContent />}
      {activeTab === 'sovereign' && <SovereignIntelligenceContent />}
      {activeTab === 'audit' && <AuditLayerContent />}
      {activeTab === 'ai-ops' && <AIOpsContent />}
    </div>
  );
}

function SystemMapContent() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">IVYAR Platform System Map v10.0</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          High-level overview of all platform components and their interconnections.
        </p>
        
        {/* System Architecture Diagram */}
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            IVYAR PLATFORM v10.0 — SYSTEM MAP                                 │
│                              "Sovereign Intelligence" Architecture                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐    │
│  │                              PRESENTATION LAYER                                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │    │
│  │  │  Portal  │  │  Mobile  │  │  Admin   │  │  Partner │  │  Public  │              │    │
│  │  │  Web UI  │  │   Apps   │  │ Console  │  │ Portals  │  │   API    │              │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘              │    │
│  └───────┼─────────────┼─────────────┼─────────────┼─────────────┼──────────────────────┘    │
│          │             │             │             │             │                           │
│  ┌───────┴─────────────┴─────────────┴─────────────┴─────────────┴──────────────────────┐    │
│  │                              API GATEWAY LAYER                                        │    │
│  │         Kong API Gateway │ Rate Limiting │ Auth │ SSL │ Routing │ Logging            │    │
│  └───────┬─────────────┬─────────────┬─────────────┬─────────────┬──────────────────────┘    │
│          │             │             │             │             │                           │
│  ┌───────┴─────────────┴─────────────┴─────────────┴─────────────┴──────────────────────┐    │
│  │                             SERVICE MESH (Istio)                                      │    │
│  │                  Service Discovery │ Load Balancing │ mTLS │ Tracing                  │    │
│  └───────┬─────────────┬─────────────┬─────────────┬─────────────┬──────────────────────┘    │
│          │             │             │             │             │                           │
│  ┌───────┴──────┐ ┌────┴──────┐ ┌────┴──────┐ ┌────┴──────┐ ┌────┴──────┐                   │
│  │              │ │           │ │           │ │           │ │           │                   │
│  │  HBS CORE    │ │ ANALYTICS │ │GOVERNANCE │ │PROCUREMENT│ │ LOGISTICS │                   │
│  │  SERVICE     │ │  SERVICE  │ │  ENGINE   │ │  ENGINE   │ │  ENGINE   │                   │
│  │              │ │           │ │           │ │           │ │           │                   │
│  │ • Programs   │ │ • Reports │ │ • Policies│ │ • Tenders │ │ • Tracking│                   │
│  │ • Benefic.   │ │ • KPIs    │ │ • Workflow│ │ • Bids    │ │ • Routing │                   │
│  │ • Payments   │ │ • Dashbd  │ │ • Approval│ │ • Contract│ │ • Warehs  │                   │
│  └───────┬──────┘ └────┬──────┘ └────┬──────┘ └────┬──────┘ └────┬──────┘                   │
│          │             │             │             │             │                           │
│  ┌───────┴──────┐ ┌────┴──────┐ ┌────┴──────┐ ┌────┴──────┐ ┌────┴──────┐                   │
│  │  SOVEREIGN   │ │  CRISIS   │ │ PROMETHEUS│ │  SIGNALS  │ │    AI     │                   │
│  │ INTELLIGENCE │ │ANTICIPAT. │ │ BLOCKCHAIN│ │   ENGINE  │ │OPERATIONS │                   │
│  │    LAYER     │ │  ENGINE   │ │   (L2)    │ │           │ │  CENTER   │                   │
│  │              │ │           │ │           │ │           │ │           │                   │
│  │ • Policy Sim │ │ • Predict │ │ • Verify  │ │ • Ingest  │ │ • Models  │                   │
│  │ • Nat. Twin  │ │ • Warning │ │ • Audit   │ │ • Process │ │ • Train   │                   │
│  │ • Decision   │ │ • Response│ │ • Smart C.│ │ • Stream  │ │ • Deploy  │                   │
│  └───────┬──────┘ └────┬──────┘ └────┬──────┘ └────┬──────┘ └────┬──────┘                   │
│          │             │             │             │             │                           │
│  ┌───────┴─────────────┴─────────────┴─────────────┴─────────────┴──────────────────────┐    │
│  │                              DATA LAYER                                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │    │
│  │  │PostgreSQL│  │  Redis   │  │  Elastic │  │TimescaleDB│  │  S3/Blob │                │    │
│  │  │ Primary  │  │  Cache   │  │  Search  │  │  Metrics │  │  Storage │                │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘                │    │
│  └──────────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         INFRASTRUCTURE LAYER (Kubernetes)                              │  │
│  │    AWS/GCP/Azure │ Multi-Region │ Auto-scaling │ Disaster Recovery │ Monitoring       │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                           ETHICAL CORE v2.0 (Cross-cutting)                            │  │
│  │      Zero Harm │ Non-Discrimination │ Transparency │ Human Oversight │ ESS Layer      │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>

      {/* Component Registry */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Component Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C]">
                <th className="text-left p-3 text-[#8B949E]">Component</th>
                <th className="text-left p-3 text-[#8B949E]">Version</th>
                <th className="text-left p-3 text-[#8B949E]">Technology</th>
                <th className="text-left p-3 text-[#8B949E]">Replicas</th>
                <th className="text-left p-3 text-[#8B949E]">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'HBS Core Service', version: 'v10.0.2', tech: 'Node.js 22', replicas: '6', status: 'Live' },
                { name: 'Analytics Service', version: 'v10.0.1', tech: 'Python 3.12', replicas: '4', status: 'Live' },
                { name: 'Governance Engine', version: 'v10.0.0', tech: 'Node.js 22', replicas: '4', status: 'Live' },
                { name: 'Sovereign Intelligence', version: 'v10.0.0', tech: 'Python 3.12', replicas: '3', status: 'Live' },
                { name: 'Prometheus Blockchain', version: 'v9.0.3', tech: 'Solidity/Go', replicas: '5', status: 'Live' },
                { name: 'Crisis Anticipation', version: 'v10.0.0', tech: 'Python 3.12', replicas: '3', status: 'Live' },
                { name: 'AI Operations Center', version: 'v2.1.0', tech: 'Python 3.12', replicas: '4', status: 'Beta' },
                { name: 'Ethical Core', version: 'v2.0.1', tech: 'Node.js 22', replicas: '3', status: 'Live' },
              ].map((comp, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-3 font-medium">{comp.name}</td>
                  <td className="p-3 font-mono text-[#00A3FF]">{comp.version}</td>
                  <td className="p-3 text-[#8B949E]">{comp.tech}</td>
                  <td className="p-3 text-[#8B949E]">{comp.replicas}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      comp.status === 'Live' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {comp.status}
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

function DataFlowsContent() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Data Flow Architecture</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Primary data flows across the IVYAR platform, showing data ingestion, processing, storage, and distribution.
        </p>

        {/* Payment Flow */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-[#3CCB7F]">●</span> Payment Processing Flow
          </h3>
          <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-[#8B949E]">{`
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Program │───>│   HBS    │───>│ Ethical  │───>│ Governance│───>│Prometheus│───>│ Payment  │
│  Manager │    │   Core   │    │   Core   │    │  Engine  │    │Blockchain│    │ Gateway  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │               │               │
     │  1. Create    │               │               │               │               │
     │   Payment     │               │               │               │               │
     │   Request     │               │               │               │               │
     │               │  2. Validate  │               │               │               │
     │               │   Ethics &    │               │               │               │
     │               │   Boundaries  │               │               │               │
     │               │               │  3. Check     │               │               │
     │               │               │   Authorization│              │               │
     │               │               │   & Limits    │               │               │
     │               │               │               │  4. Record    │               │
     │               │               │               │   Transaction │               │
     │               │               │               │   on Chain    │               │
     │               │               │               │               │  5. Execute   │
     │               │               │               │               │   Payment     │
     │<──────────────│<──────────────│<──────────────│<──────────────│<──────────────│
     │               │               │               │               │               │
     │  6. Confirmation + TX Hash + Audit Trail                                      │
     │                                                                               │
            `}</pre>
          </div>
        </div>

        {/* Data Ingestion Flow */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-[#00A3FF]">●</span> Data Ingestion Flow (Signals Engine)
          </h3>
          <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA SOURCES (47+)                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ UN OCHA │ │  UNHCR  │ │   WFP   │ │  ACLED  │ │  GDACS  │ │ Gov APIs│           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
└───────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────────────────┘
        │          │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SIGNALS ENGINE (Apache Kafka)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Collectors  │─>│  Validators  │─>│ Transformers │─>│   Enrichers  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘             │
└────────────────────────────────────────────┬────────────────────────────────────────┘
                                             │
        ┌────────────────────────────────────┼────────────────────────────────────┐
        │                                    │                                    │
        ▼                                    ▼                                    ▼
┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐
│  TimescaleDB │                    │ Elasticsearch│                    │  Data Lake   │
│   (Metrics)  │                    │   (Search)   │                    │    (S3)      │
└──────────────┘                    └──────────────┘                    └──────────────┘
            `}</pre>
          </div>
        </div>

        {/* Crisis Prediction Flow */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">●</span> Crisis Anticipation Flow
          </h3>
          <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
            <pre className="text-[#8B949E]">{`
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│   Signals  │────>│   Feature  │────>│     ML     │────>│   Early    │────>│  Response  │
│   Engine   │     │ Extraction │     │   Models   │     │  Warning   │     │ Activation │
└────────────┘     └────────────┘     └────────────┘     └────────────┘     └────────────┘
                                            │
                                            │
                                   ┌────────┴────────┐
                                   │                 │
                                   ▼                 ▼
                          ┌──────────────┐  ┌──────────────┐
                          │  Flood Risk  │  │  Food Insec. │
                          │    Model     │  │    Model     │
                          │   (89% acc)  │  │   (84% acc)  │
                          └──────────────┘  └──────────────┘
            `}</pre>
          </div>
        </div>
      </div>

      {/* Data Classification */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Data Classification Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { level: 'PUBLIC', color: '#3CCB7F', desc: 'Open data, published reports, aggregate statistics', retention: '7 years' },
            { level: 'INTERNAL', color: '#00A3FF', desc: 'Operational data, internal reports, analytics', retention: '5 years' },
            { level: 'CONFIDENTIAL', color: '#F59E0B', desc: 'PII, beneficiary data, financial records', retention: '10 years' },
            { level: 'RESTRICTED', color: '#F85149', desc: 'Security data, encryption keys, audit logs', retention: 'Indefinite' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold" style={{ color: item.color }}>{item.level}</span>
                <span className="text-xs text-[#8B949E]">Retention: {item.retention}</span>
              </div>
              <p className="text-sm text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SovereignIntelligenceContent() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Sovereign Intelligence Layer (SIL)</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          The Sovereign Intelligence Layer provides national-level decision support, policy simulation, 
          and strategic planning capabilities while maintaining full sovereignty over data and algorithms.
        </p>

        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto mb-6">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                      SOVEREIGN INTELLIGENCE LAYER (SIL) v10.0                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                           NATIONAL DIGITAL TWIN                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │  │
│  │  │ Population  │  │   Economic  │  │   Social    │  │Infrastructure│               │  │
│  │  │   Model     │  │    Model    │  │   Model     │  │    Model    │               │  │
│  │  │             │  │             │  │             │  │             │               │  │
│  │  │ Demographics│  │ GDP/Budget  │  │ Programs    │  │ Logistics   │               │  │
│  │  │ Migration   │  │ Employment  │  │ Education   │  │ Healthcare  │               │  │
│  │  │ Mortality   │  │ Inflation   │  │ Welfare     │  │ Energy      │               │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘               │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
│                                          │                                               │
│                                          ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          POLICY SIMULATION ENGINE                                  │  │
│  │                                                                                    │  │
│  │   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐              │  │
│  │   │ Scenario Input  │───>│  Simulation     │───>│  Impact         │              │  │
│  │   │ • Policy params │    │  • Monte Carlo  │    │  • Economic     │              │  │
│  │   │ • Constraints   │    │  • Agent-based  │    │  • Social       │              │  │
│  │   │ • Timeframes    │    │  • System dyn.  │    │  • Regional     │              │  │
│  │   └─────────────────┘    └─────────────────┘    └─────────────────┘              │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
│                                          │                                               │
│                                          ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         DECISION SUPPORT INTERFACE                                 │  │
│  │                                                                                    │  │
│  │   • Recommendation Engine (with confidence scores)                                │  │
│  │   • Risk Assessment Dashboard                                                     │  │
│  │   • Scenario Comparison Tool                                                      │  │
│  │   • Stakeholder Impact Analysis                                                   │  │
│  │   • Budget Optimization Advisor                                                   │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          SOVEREIGNTY GUARANTEES                                    │  │
│  │                                                                                    │  │
│  │   ✓ All data remains within national jurisdiction                                 │  │
│  │   ✓ All models trained on national data only                                      │  │
│  │   ✓ Full audit trail of all AI recommendations                                    │  │
│  │   ✓ Human approval required for all policy decisions                              │  │
│  │   ✓ Emergency Stop System (ESS) for immediate AI halt                             │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>

        {/* SIL Capabilities */}
        <h3 className="text-lg font-semibold mb-4">SIL Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Policy Impact Simulation', desc: 'Simulate policy changes before implementation. Model economic, social, and regional impacts with 85%+ accuracy.', metric: '85% accuracy' },
            { title: 'Budget Optimization', desc: 'AI-driven recommendations for optimal budget allocation across programs and regions.', metric: '$340M savings identified' },
            { title: 'Crisis Scenario Planning', desc: 'War-game potential crises and prepare response strategies with resource pre-positioning.', metric: '14-day advance warning' },
            { title: 'Cross-Ministry Coordination', desc: 'Unified view across all ministries for coordinated decision-making.', metric: '24 ministries connected' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <h4 className="font-medium mb-2">{item.title}</h4>
              <p className="text-sm text-[#8B949E] mb-2">{item.desc}</p>
              <span className="text-xs bg-[#00A3FF]/20 text-[#00A3FF] px-2 py-1 rounded">{item.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditLayerContent() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Audit & Compliance Layer</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Complete audit trail system with blockchain verification, real-time monitoring, and automated compliance reporting.
        </p>

        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto mb-6">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          AUDIT & COMPLIANCE LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         EVENT CAPTURE LAYER                                        │  │
│  │                                                                                    │  │
│  │    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │    │   API    │  │    UI    │  │  System  │  │    AI    │  │ External │          │  │
│  │    │  Events  │  │  Events  │  │  Events  │  │ Decisions│  │  Events  │          │  │
│  │    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │  │
│  │         │             │             │             │             │                 │  │
│  │         └─────────────┴─────────────┴──────┬──────┴─────────────┘                 │  │
│  └────────────────────────────────────────────┼──────────────────────────────────────┘  │
│                                               │                                          │
│                                               ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         AUDIT PROCESSING ENGINE                                    │  │
│  │                                                                                    │  │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │  │
│  │   │  Normalize  │───>│   Enrich    │───>│   Classify  │───>│   Store     │       │  │
│  │   │  (Schema)   │    │  (Context)  │    │  (Severity) │    │  (Indexed)  │       │  │
│  │   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘       │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
│                                               │                                          │
│                    ┌──────────────────────────┼──────────────────────────┐               │
│                    │                          │                          │               │
│                    ▼                          ▼                          ▼               │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │    AUDIT DATABASE       │  │   PROMETHEUS ANCHOR     │  │    SIEM INTEGRATION     │  │
│  │                         │  │                         │  │                         │  │
│  │  • Elasticsearch        │  │  • Merkle Tree Hash     │  │  • Real-time Alerts     │  │
│  │  • Full-text Search     │  │  • Immutable Record     │  │  • Anomaly Detection    │  │
│  │  • 7-year Retention     │  │  • Verification API     │  │  • Incident Response    │  │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  │
│                                                                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         COMPLIANCE REPORTING                                       │  │
│  │                                                                                    │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│  │   │  IATI   │  │   HXL   │  │  GDPR   │  │ISO 27001│  │  SOC 2  │  │  Custom │   │  │
│  │   │ Reports │  │ Reports │  │ Reports │  │ Reports │  │ Reports │  │ Reports │   │  │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>

        {/* Audit Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '45.2M+', label: 'Audit Events', period: 'Total' },
            { value: '2.8M', label: 'Events/Day', period: 'Average' },
            { value: '100%', label: 'Blockchain Anchored', period: 'Coverage' },
            { value: '<50ms', label: 'Capture Latency', period: 'p99' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#00A3FF]">{stat.value}</div>
              <div className="text-sm text-[#8B949E]">{stat.label}</div>
              <div className="text-xs text-[#6E7681]">{stat.period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIOpsContent() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">AI Operations Center</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Centralized management of all AI/ML models, training pipelines, deployment, and monitoring.
        </p>

        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto mb-6">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            AI OPERATIONS CENTER                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                         MODEL REGISTRY                                           │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │    │
│  │  │ Crisis Predict │  │ Fraud Detect   │  │ Eligibility    │  │ Allocation Opt │ │    │
│  │  │ v3.2.1 (Live)  │  │ v2.8.0 (Live)  │  │ v4.1.0 (Live)  │  │ v1.5.0 (Beta)  │ │    │
│  │  │ Accuracy: 89%  │  │ Accuracy: 94%  │  │ Accuracy: 97%  │  │ Accuracy: 91%  │ │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                         MLOPS PIPELINE                                           │    │
│  │                                                                                  │    │
│  │    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐        │    │
│  │    │ Data │───>│Train │───>│Valid │───>│Ethics│───>│Deploy│───>│Monitor│        │    │
│  │    │Ingest│    │      │    │      │    │Review│    │      │    │      │        │    │
│  │    └──────┘    └──────┘    └──────┘    └──────┘    └──────┘    └──────┘        │    │
│  │                                           │                                     │    │
│  │                                    Ethical Core v2.0                            │    │
│  │                                    Bias Detection                               │    │
│  │                                    Fairness Audit                               │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                         MONITORING & OBSERVABILITY                               │    │
│  │                                                                                  │    │
│  │    Model Performance │ Data Drift │ Prediction Quality │ Resource Usage         │    │
│  │    ────────────────────────────────────────────────────────────────────────     │    │
│  │    ██████████░░ 89%  │ ████░░░░░░ 4% │ █████████░ 94%   │ ██████░░░░ 62%        │    │
│  │                                                                                  │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │                    HUMAN OVERSIGHT REQUIREMENTS                                  │    │
│  │                                                                                  │    │
│  │    ┌─────────────────────────────────────────────────────────────────────┐      │    │
│  │    │  AUTO-APPROVED          │  REVIEW REQUIRED      │  HUMAN REQUIRED   │      │    │
│  │    │  ─────────────          │  ───────────────      │  ──────────────   │      │    │
│  │    │  • Confidence > 95%     │  • Confidence 85-95%  │  • Confidence < 85%│      │    │
│  │    │  • Standard cases       │  • Edge cases         │  • High-impact     │      │    │
│  │    │  • Routine predictions  │  • Flagged by ethics  │  • Policy changes  │      │    │
│  │    └─────────────────────────────────────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>

        {/* Active Models */}
        <h3 className="text-lg font-semibold mb-4">Active Models</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C]">
                <th className="text-left p-3 text-[#8B949E]">Model</th>
                <th className="text-left p-3 text-[#8B949E]">Version</th>
                <th className="text-left p-3 text-[#8B949E]">Accuracy</th>
                <th className="text-left p-3 text-[#8B949E]">Predictions/Day</th>
                <th className="text-left p-3 text-[#8B949E]">Last Trained</th>
                <th className="text-left p-3 text-[#8B949E]">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Crisis Anticipation', version: 'v3.2.1', accuracy: '89%', preds: '12,400', trained: '2025-12-15', status: 'Live' },
                { name: 'Fraud Detection', version: 'v2.8.0', accuracy: '94.2%', preds: '890,000', trained: '2025-12-20', status: 'Live' },
                { name: 'Eligibility Scoring', version: 'v4.1.0', accuracy: '97.1%', preds: '45,000', trained: '2025-12-18', status: 'Live' },
                { name: 'Budget Allocation', version: 'v1.5.0', accuracy: '91%', preds: '1,200', trained: '2025-12-22', status: 'Beta' },
                { name: 'Demand Forecasting', version: 'v2.0.0', accuracy: '86%', preds: '3,400', trained: '2025-12-10', status: 'Live' },
              ].map((model, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-3 font-medium">{model.name}</td>
                  <td className="p-3 font-mono text-[#00A3FF]">{model.version}</td>
                  <td className="p-3">{model.accuracy}</td>
                  <td className="p-3 text-[#8B949E]">{model.preds}</td>
                  <td className="p-3 text-[#8B949E]">{model.trained}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      model.status === 'Live' ? 'bg-[#3CCB7F]/20 text-[#3CCB7F]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }`}>
                      {model.status}
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
// API GOVERNANCE SECTION
// ============================================
function APIGovernanceSection() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔌</span>
          <h1 className="text-3xl font-bold">API Governance</h1>
        </div>
        <p className="text-[#8B949E] mt-4">
          Comprehensive API governance policies including versioning, rate limiting, access tiers, and security standards.
        </p>
      </div>

      {/* API Overview */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">API Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { value: '200+', label: 'Endpoints' },
            { value: 'v1.x', label: 'Current Version' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<200ms', label: 'Response Time (p95)' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#00A3FF]">{stat.value}</div>
              <div className="text-sm text-[#8B949E]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[#8B949E]">Base URL (Production)</span>
              <p className="font-mono text-[#00A3FF]">https://api.ivyar.org/v1</p>
            </div>
            <div>
              <span className="text-[#8B949E]">Base URL (Sandbox)</span>
              <p className="font-mono text-[#00A3FF]">https://sandbox.api.ivyar.org/v1</p>
            </div>
            <div>
              <span className="text-[#8B949E]">Specification</span>
              <p className="text-[#E6EDF3]">OpenAPI 3.1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Versioning Policy */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Versioning Policy</h2>
        <div className="space-y-4">
          <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#3CCB7F] rounded-full"></span>
              Semantic Versioning (SemVer)
            </h3>
            <p className="text-sm text-[#8B949E] mb-3">
              All APIs follow semantic versioning: <code className="bg-[#1F242C] px-2 py-0.5 rounded">MAJOR.MINOR.PATCH</code>
            </p>
            <ul className="text-sm text-[#8B949E] space-y-1">
              <li>• <strong>MAJOR</strong>: Breaking changes (require migration)</li>
              <li>• <strong>MINOR</strong>: New features (backward compatible)</li>
              <li>• <strong>PATCH</strong>: Bug fixes (backward compatible)</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <h4 className="font-medium text-[#3CCB7F] mb-2">Current Version</h4>
              <div className="font-mono text-2xl">v1.x</div>
              <p className="text-xs text-[#8B949E] mt-2">Fully supported</p>
            </div>
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <h4 className="font-medium text-[#F59E0B] mb-2">Deprecation Notice</h4>
              <div className="font-mono text-2xl">12 months</div>
              <p className="text-xs text-[#8B949E] mt-2">Before removal</p>
            </div>
            <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <h4 className="font-medium text-[#00A3FF] mb-2">Migration Support</h4>
              <div className="font-mono text-2xl">6 months</div>
              <p className="text-xs text-[#8B949E] mt-2">Parallel operation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Rate Limits</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C]">
                <th className="text-left p-3 text-[#8B949E]">Tier</th>
                <th className="text-left p-3 text-[#8B949E]">Requests/Minute</th>
                <th className="text-left p-3 text-[#8B949E]">Requests/Day</th>
                <th className="text-left p-3 text-[#8B949E]">Burst Limit</th>
                <th className="text-left p-3 text-[#8B949E]">Concurrent</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tier: 'Public', rpm: '60', rpd: '10,000', burst: '100', concurrent: '10' },
                { tier: 'Partner', rpm: '300', rpd: '100,000', burst: '500', concurrent: '50' },
                { tier: 'Government', rpm: '1,000', rpd: '1,000,000', burst: '2,000', concurrent: '200' },
                { tier: 'Internal', rpm: '10,000', rpd: 'Unlimited', burst: '20,000', concurrent: '1,000' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-3 font-medium">{row.tier}</td>
                  <td className="p-3 font-mono">{row.rpm}</td>
                  <td className="p-3 font-mono">{row.rpd}</td>
                  <td className="p-3 font-mono">{row.burst}</td>
                  <td className="p-3 font-mono">{row.concurrent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
          <p className="text-sm text-[#F59E0B]">
            ⚠️ Rate limit headers included in all responses: <code className="bg-[#0D1117] px-2 py-0.5 rounded">X-RateLimit-Limit</code>, 
            <code className="bg-[#0D1117] px-2 py-0.5 rounded ml-1">X-RateLimit-Remaining</code>, 
            <code className="bg-[#0D1117] px-2 py-0.5 rounded ml-1">X-RateLimit-Reset</code>
          </p>
        </div>
      </div>

      {/* Access Tiers */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Access Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              tier: 'PUBLIC',
              color: '#3CCB7F',
              desc: 'Open access for public data',
              endpoints: ['GET /programs (public)', 'GET /statistics', 'GET /reports (public)'],
              auth: 'API Key',
              approval: 'Instant',
            },
            {
              tier: 'PARTNER',
              color: '#00A3FF',
              desc: 'For registered partners and developers',
              endpoints: ['All public +', 'POST /beneficiaries', 'GET /payments', 'Webhooks'],
              auth: 'OAuth 2.0',
              approval: '5-7 days',
            },
            {
              tier: 'GOVERNMENT',
              color: '#A371F7',
              desc: 'Full access for government entities',
              endpoints: ['All partner +', 'Admin operations', 'Bulk exports', 'Internal APIs'],
              auth: 'mTLS + OAuth',
              approval: 'Formal agreement',
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg overflow-hidden">
              <div className="h-2" style={{ backgroundColor: item.color }}></div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2" style={{ color: item.color }}>{item.tier}</h3>
                <p className="text-sm text-[#8B949E] mb-4">{item.desc}</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#6E7681]">Endpoints:</span>
                    <ul className="mt-1 space-y-1">
                      {item.endpoints.map((ep, j) => (
                        <li key={j} className="text-[#8B949E]">• {ep}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7681]">Auth:</span>
                    <span>{item.auth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E7681]">Approval:</span>
                    <span>{item.approval}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Logging */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Security & Logging</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 text-[#3CCB7F]">Security Requirements</h3>
            <ul className="space-y-2 text-sm">
              {[
                'TLS 1.3 required for all connections',
                'OAuth 2.0 / JWT for authentication',
                'mTLS for government tier',
                'API keys rotated every 90 days',
                'IP allowlisting available',
                'Request signing for sensitive operations',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[#8B949E]">
                  <span className="text-[#3CCB7F]">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-[#00A3FF]">Logging & Monitoring</h3>
            <ul className="space-y-2 text-sm">
              {[
                'All requests logged with correlation IDs',
                'Request/response bodies logged (redacted)',
                '30-day log retention (standard)',
                '7-year audit log retention',
                'Real-time anomaly detection',
                'Automated abuse prevention',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[#8B949E]">
                  <span className="text-[#00A3FF]">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEPLOYMENT SECTION
// ============================================
function DeploymentSection({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: DeploymentTab; 
  setActiveTab: (tab: DeploymentTab) => void;
}) {
  const tabs = [
    { id: 'single', label: 'Single-Country', icon: '🏛️' },
    { id: 'federation', label: 'Multi-Country Federation', icon: '🌍' },
    { id: 'disaster', label: 'Disaster Recovery', icon: '🔄' },
    { id: 'hybrid', label: 'National Cloud / Hybrid', icon: '☁️' },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚀</span>
          <h1 className="text-3xl font-bold">Deployment Playbooks</h1>
        </div>
        <p className="text-[#8B949E] mt-4">
          Step-by-step deployment guides for various scenarios and infrastructure configurations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DeploymentTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#00A3FF] text-[#0D1117]'
                : 'bg-[#161B22] text-[#8B949E] hover:text-white border border-[#1F242C]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'single' && <SingleCountryPlaybook />}
      {activeTab === 'federation' && <FederationPlaybook />}
      {activeTab === 'disaster' && <DisasterRecoveryPlaybook />}
      {activeTab === 'hybrid' && <HybridCloudPlaybook />}
    </div>
  );
}

function SingleCountryPlaybook() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Single-Country Deployment</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Standard deployment for a single nation with centralized infrastructure.
        </p>

        <div className="space-y-4">
          {[
            { phase: 1, title: 'Infrastructure Setup', duration: '2-4 weeks', tasks: ['Provision Kubernetes cluster (6+ nodes)', 'Configure networking & firewalls', 'Setup SSL certificates', 'Deploy monitoring stack (Prometheus/Grafana)'] },
            { phase: 2, title: 'Database Layer', duration: '1-2 weeks', tasks: ['Deploy PostgreSQL cluster with replication', 'Configure Redis cache cluster', 'Setup Elasticsearch for search', 'Initialize Prometheus blockchain node'] },
            { phase: 3, title: 'Application Deployment', duration: '1-2 weeks', tasks: ['Deploy core services via Helm charts', 'Configure service mesh (Istio)', 'Setup API Gateway (Kong)', 'Deploy AI/ML services'] },
            { phase: 4, title: 'Integration', duration: '2-4 weeks', tasks: ['Connect national ID system', 'Integrate treasury management', 'Setup bank payment gateways', 'Configure external data sources'] },
            { phase: 5, title: 'Testing & Validation', duration: '2-3 weeks', tasks: ['Load testing (10x expected capacity)', 'Security penetration testing', 'User acceptance testing', 'Compliance validation'] },
            { phase: 6, title: 'Go-Live', duration: '1-2 weeks', tasks: ['Pilot with 1-3 ministries', 'Training delivery', 'Phased rollout', 'Production monitoring'] },
          ].map((phase, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-[#00A3FF]/10 text-[#00A3FF] rounded-full flex items-center justify-center font-bold">
                  {phase.phase}
                </div>
                <div className="flex-1">
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

        <div className="mt-6 p-4 bg-[#3CCB7F]/10 border border-[#3CCB7F]/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span>⏱️</span>
            <span className="font-medium text-[#3CCB7F]">Total Timeline: 10-17 weeks</span>
          </div>
          <p className="text-sm text-[#8B949E]">
            Actual timeline depends on infrastructure readiness, integration complexity, and stakeholder availability.
          </p>
        </div>
      </div>
    </div>
  );
}

function FederationPlaybook() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Multi-Country Federation</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Federated deployment across multiple countries with data sovereignty and cross-border coordination.
        </p>

        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto mb-6">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         MULTI-COUNTRY FEDERATION ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                            ┌─────────────────────────┐                                   │
│                            │    FEDERATION HUB       │                                   │
│                            │  (Coordination Layer)   │                                   │
│                            │                         │                                   │
│                            │  • Cross-border auth    │                                   │
│                            │  • Aggregate analytics  │                                   │
│                            │  • Standard APIs        │                                   │
│                            │  • Shared reference     │                                   │
│                            └───────────┬─────────────┘                                   │
│                                        │                                                 │
│           ┌────────────────────────────┼────────────────────────────┐                   │
│           │                            │                            │                   │
│           ▼                            ▼                            ▼                   │
│  ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐         │
│  │   COUNTRY A     │          │   COUNTRY B     │          │   COUNTRY C     │         │
│  │   (Primary)     │          │   (Member)      │          │   (Member)      │         │
│  │                 │          │                 │          │                 │         │
│  │ ┌─────────────┐ │          │ ┌─────────────┐ │          │ ┌─────────────┐ │         │
│  │ │ IVYAR Full  │ │          │ │ IVYAR Full  │ │          │ │ IVYAR Full  │ │         │
│  │ │ Deployment  │ │          │ │ Deployment  │ │          │ │ Deployment  │ │         │
│  │ └─────────────┘ │          │ └─────────────┘ │          │ └─────────────┘ │         │
│  │                 │          │                 │          │                 │         │
│  │ ┌─────────────┐ │          │ ┌─────────────┐ │          │ ┌─────────────┐ │         │
│  │ │ National    │ │          │ │ National    │ │          │ │ National    │ │         │
│  │ │ Data Store  │ │          │ │ Data Store  │ │          │ │ Data Store  │ │         │
│  │ └─────────────┘ │          │ └─────────────┘ │          │ └─────────────┘ │         │
│  │                 │          │                 │          │                 │         │
│  │ Data Sovereign │          │ Data Sovereign │          │ Data Sovereign │         │
│  └─────────────────┘          └─────────────────┘          └─────────────────┘         │
│                                                                                          │
│  ════════════════════════════════════════════════════════════════════════════════════   │
│                                 SHARED COMPONENTS                                        │
│  ════════════════════════════════════════════════════════════════════════════════════   │
│                                                                                          │
│     ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│     │ Shared   │    │ Reference│    │ Cross-   │    │ Aggregate│    │ Common   │       │
│     │ Auth/SSO │    │ Data     │    │ Border   │    │ Analytics│    │ Standards│       │
│     │          │    │ (HXL)    │    │ Payments │    │          │    │ (IATI)   │       │
│     └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>

        <h3 className="text-lg font-semibold mb-4">Federation Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Data Sovereignty', desc: 'Each country maintains full control over national data. No PII crosses borders without explicit consent.' },
            { title: 'Interoperability', desc: 'Common APIs and data standards (IATI, HXL) enable coordination while respecting boundaries.' },
            { title: 'Federated Identity', desc: 'Cross-border SSO for authorized users with country-level access controls.' },
            { title: 'Shared Analytics', desc: 'Aggregate (anonymized) statistics available at federation level for regional planning.' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <h4 className="font-medium mb-2">{item.title}</h4>
              <p className="text-sm text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DisasterRecoveryPlaybook() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Disaster Recovery</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Business continuity and disaster recovery procedures for IVYAR platform.
        </p>

        {/* Recovery Objectives */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { metric: 'RPO', value: '1 hour', desc: 'Recovery Point Objective' },
            { metric: 'RTO', value: '4 hours', desc: 'Recovery Time Objective' },
            { metric: 'Backup Frequency', value: '15 min', desc: 'Continuous replication' },
            { metric: 'Retention', value: '90 days', desc: 'Backup retention period' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#00A3FF]">{item.value}</div>
              <div className="text-sm font-medium">{item.metric}</div>
              <div className="text-xs text-[#6E7681]">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* DR Architecture */}
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto mb-6">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         DISASTER RECOVERY ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│    PRIMARY REGION (Frankfurt)              DR REGION (Dublin)                           │
│    ═══════════════════════════            ════════════════════                          │
│                                                                                          │
│    ┌─────────────────────┐                ┌─────────────────────┐                       │
│    │  Kubernetes Cluster │   ──Sync──>    │  Kubernetes Cluster │                       │
│    │  (Active)           │                │  (Standby/Warm)     │                       │
│    └─────────────────────┘                └─────────────────────┘                       │
│                                                                                          │
│    ┌─────────────────────┐                ┌─────────────────────┐                       │
│    │  PostgreSQL Primary │   ──Async──>   │  PostgreSQL Replica │                       │
│    │  (Read/Write)       │   Replication  │  (Read-only)        │                       │
│    └─────────────────────┘                └─────────────────────┘                       │
│                                                                                          │
│    ┌─────────────────────┐                ┌─────────────────────┐                       │
│    │  Object Storage     │   ──Sync──>    │  Object Storage     │                       │
│    │  (S3/GCS)           │   Replication  │  (S3/GCS Replica)   │                       │
│    └─────────────────────┘                └─────────────────────┘                       │
│                                                                                          │
│    ┌─────────────────────┐                ┌─────────────────────┐                       │
│    │  Prometheus Node    │   ──Sync──>    │  Prometheus Node    │                       │
│    │  (Active)           │   Blockchain   │  (Sync'd)           │                       │
│    └─────────────────────┘                └─────────────────────┘                       │
│                                                                                          │
│    ════════════════════════════════════════════════════════════════════════════════     │
│                              FAILOVER PROCEDURE                                          │
│    ════════════════════════════════════════════════════════════════════════════════     │
│                                                                                          │
│    1. Detect failure (automated monitoring)                                             │
│    2. Verify primary is unreachable (3 health checks)                                   │
│    3. Promote DR database to primary                                                    │
│    4. Update DNS records (TTL: 60s)                                                     │
│    5. Scale DR Kubernetes cluster                                                       │
│    6. Notify operations team                                                            │
│    7. Begin incident response                                                           │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>
    </div>
  );
}

function HybridCloudPlaybook() {
  return (
    <div className="space-y-8">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">National Cloud / Hybrid Deployment</h2>
        <p className="text-sm text-[#8B949E] mb-6">
          Deployment options for national government clouds and hybrid on-premise/cloud configurations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            {
              title: 'Full Cloud',
              icon: '☁️',
              desc: 'Complete deployment on public cloud (AWS/GCP/Azure)',
              pros: ['Fastest deployment', 'Auto-scaling', 'Global availability'],
              cons: ['Data residency concerns', 'Vendor dependency'],
            },
            {
              title: 'Hybrid',
              icon: '🔀',
              desc: 'Sensitive data on-premise, compute in cloud',
              pros: ['Data sovereignty', 'Flexible scaling', 'Cost optimized'],
              cons: ['Complex networking', 'Higher maintenance'],
            },
            {
              title: 'National Cloud',
              icon: '🏛️',
              desc: 'Full deployment on government cloud infrastructure',
              pros: ['Complete control', 'Security compliance', 'Air-gap option'],
              cons: ['Slower deployment', 'Capacity limits'],
            },
          ].map((option, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-5">
              <div className="text-3xl mb-3">{option.icon}</div>
              <h3 className="font-semibold mb-2">{option.title}</h3>
              <p className="text-sm text-[#8B949E] mb-4">{option.desc}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-[#3CCB7F]">Advantages:</span>
                  <ul className="text-xs text-[#8B949E] mt-1">
                    {option.pros.map((p, j) => <li key={j}>+ {p}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-xs text-[#F59E0B]">Considerations:</span>
                  <ul className="text-xs text-[#8B949E] mt-1">
                    {option.cons.map((c, j) => <li key={j}>- {c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hybrid Architecture */}
        <div className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-[#8B949E]">{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         HYBRID DEPLOYMENT ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│    ON-PREMISE (Government Data Center)         CLOUD (AWS/GCP/Azure)                    │
│    ═══════════════════════════════════        ══════════════════════                    │
│                                                                                          │
│    ┌─────────────────────────────┐            ┌─────────────────────────────┐           │
│    │      SENSITIVE DATA         │            │       COMPUTE LAYER          │           │
│    │                             │            │                             │           │
│    │  ┌───────────┐ ┌─────────┐  │            │  ┌───────────┐ ┌─────────┐  │           │
│    │  │PostgreSQL │ │  Vault  │  │            │  │Application│ │   API   │  │           │
│    │  │ (Primary) │ │ (Keys)  │  │            │  │ Services  │ │ Gateway │  │           │
│    │  └───────────┘ └─────────┘  │            │  └───────────┘ └─────────┘  │           │
│    │                             │            │                             │           │
│    │  ┌───────────┐ ┌─────────┐  │            │  ┌───────────┐ ┌─────────┐  │           │
│    │  │ Benefic.  │ │  Audit  │  │  VPN/     │  │ Analytics │ │   AI    │  │           │
│    │  │   PII     │ │  Logs   │  │◄─────────►│  │  Engine   │ │Services │  │           │
│    │  └───────────┘ └─────────┘  │  Direct   │  └───────────┘ └─────────┘  │           │
│    │                             │  Connect  │                             │           │
│    └─────────────────────────────┘            └─────────────────────────────┘           │
│                                                                                          │
│    Security Boundary: All PII remains on-premise. Only anonymized/aggregated data       │
│    flows to cloud. All connections encrypted via dedicated link (not public internet).  │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPLIANCE SECTION
// ============================================
function ComplianceSection() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✅</span>
          <h1 className="text-3xl font-bold">Compliance & Standards</h1>
        </div>
        <p className="text-[#8B949E] mt-4">
          IVYAR alignment with international standards from UN, EU, USAID, World Bank, and other frameworks.
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Compliance Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F242C]">
                <th className="text-left p-3 text-[#8B949E]">Standard</th>
                <th className="text-left p-3 text-[#8B949E]">Organization</th>
                <th className="text-left p-3 text-[#8B949E]">Compliance</th>
                <th className="text-left p-3 text-[#8B949E]">Certification</th>
                <th className="text-left p-3 text-[#8B949E]">Last Audit</th>
              </tr>
            </thead>
            <tbody>
              {[
                { standard: 'IATI 2.03', org: 'UN / IATI', compliance: '99.2%', cert: 'Publisher', audit: '2025-12' },
                { standard: 'HXL 1.1', org: 'UN OCHA', compliance: '99.8%', cert: 'Compliant', audit: '2025-11' },
                { standard: 'OCDS 1.1', org: 'Open Contracting', compliance: '98.5%', cert: 'Compliant', audit: '2025-10' },
                { standard: 'GDPR', org: 'European Union', compliance: '100%', cert: 'Compliant', audit: '2025-12' },
                { standard: 'ISO 27001:2022', org: 'ISO', compliance: '100%', cert: 'Certified', audit: '2025-11' },
                { standard: 'SOC 2 Type II', org: 'AICPA', compliance: '100%', cert: 'Attested', audit: '2025-12' },
                { standard: 'ADS 579', org: 'USAID', compliance: '97%', cert: 'Aligned', audit: '2025-09' },
                { standard: 'OP 4.12', org: 'World Bank', compliance: '95%', cert: 'Aligned', audit: '2025-08' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#1F242C]">
                  <td className="p-3 font-medium">{row.standard}</td>
                  <td className="p-3 text-[#8B949E]">{row.org}</td>
                  <td className="p-3">
                    <span className={`font-mono ${
                      parseFloat(row.compliance) >= 99 ? 'text-[#3CCB7F]' :
                      parseFloat(row.compliance) >= 95 ? 'text-[#00A3FF]' : 'text-[#F59E0B]'
                    }`}>
                      {row.compliance}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">
                      {row.cert}
                    </span>
                  </td>
                  <td className="p-3 text-[#8B949E]">{row.audit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UN Alignment */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🇺🇳</span>
          <h2 className="text-xl font-semibold">UN Standards Alignment</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'IATI 2.03', desc: 'International Aid Transparency Initiative. Full compliance for activity, organization, and results reporting.', compliance: '99.2%' },
            { title: 'HXL 1.1', desc: 'Humanitarian Exchange Language. All humanitarian data exports include HXL hashtags.', compliance: '99.8%' },
            { title: 'UN/CEFACT', desc: 'UN Centre for Trade Facilitation. Trade document standards for procurement.', compliance: '96%' },
            { title: 'UNSDG', desc: 'Sustainable Development Goals. All programs tagged with SDG indicators.', compliance: '100%' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-sm font-mono text-[#3CCB7F]">{item.compliance}</span>
              </div>
              <p className="text-sm text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EU Alignment */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🇪🇺</span>
          <h2 className="text-xl font-semibold">EU Standards Alignment</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'GDPR', desc: 'General Data Protection Regulation. Full compliance including DPO appointment, DPIA, and rights fulfillment.', compliance: '100%' },
            { title: 'EU AI Act', desc: 'Alignment with high-risk AI requirements. Human oversight, transparency, and documentation.', compliance: '95%' },
            { title: 'eIDAS', desc: 'Electronic Identification. Support for EU digital identity framework integration.', compliance: '90%' },
            { title: 'NIS2', desc: 'Network and Information Security Directive. Critical infrastructure security requirements.', compliance: '98%' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-sm font-mono text-[#3CCB7F]">{item.compliance}</span>
              </div>
              <p className="text-sm text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* USAID Alignment */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🇺🇸</span>
          <h2 className="text-xl font-semibold">USAID Standards Alignment</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'ADS 579', desc: 'USAID Development Data Policy. Open data requirements and data sharing protocols.', compliance: '97%' },
            { title: 'ADS 201', desc: 'Program Cycle Operational Policy. Monitoring, evaluation, and learning framework.', compliance: '95%' },
            { title: 'ADS 303', desc: 'Grants and Cooperative Agreements. Financial management and reporting standards.', compliance: '98%' },
            { title: 'CLA', desc: 'Collaborating, Learning, and Adapting. Adaptive management integration.', compliance: '92%' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-sm font-mono text-[#00A3FF]">{item.compliance}</span>
              </div>
              <p className="text-sm text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* World Bank Alignment */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🏦</span>
          <h2 className="text-xl font-semibold">World Bank Standards Alignment</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'ESF', desc: 'Environmental and Social Framework. ESS1-10 safeguards integrated into all operations.', compliance: '95%' },
            { title: 'OP 4.12', desc: 'Involuntary Resettlement. Safeguards for displacement and livelihood restoration.', compliance: '95%' },
            { title: 'Procurement Framework', desc: 'World Bank Procurement Regulations. STEP integration and e-procurement.', compliance: '98%' },
            { title: 'BOOST', desc: 'Open Budget Portal. Budget transparency and fiscal data standards.', compliance: '94%' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-sm font-mono text-[#00A3FF]">{item.compliance}</span>
              </div>
              <p className="text-sm text-[#8B949E]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Security Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'ISO 27001:2022', icon: '🔒', status: 'Certified', auditor: 'Deloitte' },
            { name: 'SOC 2 Type II', icon: '✅', status: 'Attested', auditor: 'KPMG' },
            { name: 'ISO 22301', icon: '🔄', status: 'Certified', auditor: 'BSI' },
            { name: 'CSA STAR', icon: '⭐', status: 'Level 2', auditor: 'CSA' },
          ].map((cert, i) => (
            <div key={i} className="bg-[#0D1117] border border-[#1F242C] rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{cert.icon}</div>
              <div className="font-medium">{cert.name}</div>
              <div className="text-sm text-[#3CCB7F]">{cert.status}</div>
              <div className="text-xs text-[#6E7681] mt-1">Auditor: {cert.auditor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Compliance Docs */}
      <div className="bg-gradient-to-r from-[#00A3FF]/10 to-[#A371F7]/10 border border-[#1F242C] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'ISO 27001 Certificate', type: 'PDF', size: '2.4 MB' },
            { name: 'SOC 2 Type II Report', type: 'PDF', size: '8.1 MB' },
            { name: 'GDPR Compliance Assessment', type: 'PDF', size: '3.2 MB' },
            { name: 'Penetration Test Summary', type: 'PDF', size: '1.8 MB' },
            { name: 'Data Processing Agreement', type: 'DOCX', size: '0.4 MB' },
            { name: 'Security Whitepaper', type: 'PDF', size: '5.6 MB' },
          ].map((doc, i) => (
            <button key={i} className="flex items-center justify-between p-3 bg-[#161B22] border border-[#1F242C] rounded-lg hover:border-[#00A3FF] transition-colors">
              <div className="flex items-center gap-3">
                <span>📄</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{doc.name}</div>
                  <div className="text-xs text-[#6E7681]">{doc.type} • {doc.size}</div>
                </div>
              </div>
              <span className="text-[#00A3FF]">↓</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
