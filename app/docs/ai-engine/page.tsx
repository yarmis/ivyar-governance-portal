'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================
// TYPES
// ============================================
type DocSection = 
  | 'executive' | 'overview' | 'architecture' | 'data' | 'features'
  | 'pricing' | 'forecasting' | 'fraud' | 'scoring' | 'insights'
  | 'serving' | 'monitoring' | 'governance' | 'security' | 'deployment'
  | 'roadmap' | 'appendix';

// ============================================
// DOCUMENTATION DATA
// ============================================
const DOC_SECTIONS = [
  { id: 'executive', label: '1. Executive Summary', icon: '📋' },
  { id: 'overview', label: '2. System Overview', icon: '🔭' },
  { id: 'architecture', label: '3. Architecture Layers', icon: '🏗️' },
  { id: 'data', label: '4. Data Architecture', icon: '🗄️' },
  { id: 'features', label: '5. Feature Store', icon: '📦' },
  { id: 'pricing', label: '6. Pricing Engine', icon: '💰' },
  { id: 'forecasting', label: '7. Demand Forecasting', icon: '🔮' },
  { id: 'fraud', label: '8. Fraud Detection', icon: '🛡️' },
  { id: 'scoring', label: '9. Scoring Engine', icon: '📊' },
  { id: 'insights', label: '10. AI Insights', icon: '💡' },
  { id: 'serving', label: '11. Serving & API', icon: '⚡' },
  { id: 'monitoring', label: '12. Monitoring', icon: '📈' },
  { id: 'governance', label: '13. Governance & Ethics', icon: '⚖️' },
  { id: 'security', label: '14. Security', icon: '🔒' },
  { id: 'deployment', label: '15. Deployment', icon: '🚀' },
  { id: 'roadmap', label: '16. Roadmap', icon: '🗺️' },
  { id: 'appendix', label: '17. Appendices', icon: '📎' },
];

const VERSION_INFO = {
  version: '10.5.0',
  releaseDate: '2026-01-05',
  status: 'Production',
  lastUpdated: '2026-01-05',
  authors: ['IVYAR AI Team', 'Architecture Board'],
  reviewers: ['Ministry of Digital Transformation', 'Donor Technical Committee'],
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AIEngineArchitecturePage() {
  const [activeSection, setActiveSection] = useState<DocSection>('executive');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/docs" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A371F7] to-[#00A3FF] rounded-xl flex items-center justify-center">
                <span className="text-xl">🧠</span>
              </div>
              <div>
                <div className="font-bold">AI Engine Architecture</div>
                <div className="text-xs text-[#6E7681]">Technical Documentation v10.5</div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-1.5">
              <span className="text-xs text-[#8B949E]">Version</span>
              <span className="text-xs font-mono bg-[#A371F7]/20 text-[#A371F7] px-2 py-0.5 rounded">v{VERSION_INFO.version}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#161B22] border border-[#1F242C] rounded-lg px-3 py-1.5">
              <span className="text-xs text-[#8B949E]">Status</span>
              <span className="text-xs font-mono bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-0.5 rounded">{VERSION_INFO.status}</span>
            </div>
            <button className="bg-[#00A3FF] text-white px-4 py-2 rounded-lg text-sm font-medium">
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className={`fixed left-0 top-16 bottom-0 bg-[#0D1117] border-r border-[#1F242C] overflow-y-auto transition-all ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        }`}>
          <div className="p-4">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 hover:bg-[#161B22] rounded-lg mb-4"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
            
            {!sidebarCollapsed && (
              <nav className="space-y-1">
                {DOC_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as DocSection)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-[#A371F7]/20 text-[#A371F7] border-l-2 border-[#A371F7]'
                        : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="truncate">{section.label}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all ${sidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
          <div className="max-w-4xl mx-auto px-8 py-12">
            {activeSection === 'executive' && <ExecutiveSummarySection />}
            {activeSection === 'overview' && <SystemOverviewSection />}
            {activeSection === 'architecture' && <ArchitectureLayersSection />}
            {activeSection === 'data' && <DataArchitectureSection />}
            {activeSection === 'features' && <FeatureStoreSection />}
            {activeSection === 'pricing' && <PricingEngineSection />}
            {activeSection === 'forecasting' && <ForecastingEngineSection />}
            {activeSection === 'fraud' && <FraudDetectionSection />}
            {activeSection === 'scoring' && <ScoringEngineSection />}
            {activeSection === 'insights' && <AIInsightsSection />}
            {activeSection === 'serving' && <ServingAPISection />}
            {activeSection === 'monitoring' && <MonitoringSection />}
            {activeSection === 'governance' && <GovernanceSection />}
            {activeSection === 'security' && <SecuritySection />}
            {activeSection === 'deployment' && <DeploymentSection />}
            {activeSection === 'roadmap' && <RoadmapSection />}
            {activeSection === 'appendix' && <AppendixSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================
// SECTION COMPONENTS
// ============================================

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-[#1F242C]">
      <div className="text-sm text-[#A371F7] font-mono mb-2">Section {number}</div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-[#8B949E]">{subtitle}</p>}
    </div>
  );
}

function InfoBox({ type, title, children }: { type: 'info' | 'warning' | 'success' | 'note'; title: string; children: React.ReactNode }) {
  const config = {
    info: { bg: 'bg-[#00A3FF]/10', border: 'border-[#00A3FF]/30', icon: 'ℹ️', color: 'text-[#00A3FF]' },
    warning: { bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', icon: '⚠️', color: 'text-[#F59E0B]' },
    success: { bg: 'bg-[#3CCB7F]/10', border: 'border-[#3CCB7F]/30', icon: '✓', color: 'text-[#3CCB7F]' },
    note: { bg: 'bg-[#A371F7]/10', border: 'border-[#A371F7]/30', icon: '📝', color: 'text-[#A371F7]' },
  };
  const c = config[type];
  
  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-4 mb-6`}>
      <div className={`flex items-center gap-2 font-semibold mb-2 ${c.color}`}>
        <span>{c.icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-sm text-[#8B949E]">{children}</div>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="bg-[#0D1117] border border-[#1F242C] rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2 bg-[#161B22] border-b border-[#1F242C] flex items-center justify-between">
        <span className="text-xs text-[#8B949E] font-mono">{language}</span>
        <button className="text-xs text-[#00A3FF] hover:underline">Copy</button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-[#E6EDF3] font-mono">{code}</code>
      </pre>
    </div>
  );
}

function DiagramPlaceholder({ title, type }: { title: string; type: string }) {
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 mb-6 text-center">
      <div className="text-4xl mb-4">📊</div>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-xs text-[#6E7681]">{type} Diagram</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1F242C] bg-[#0D1117]">
              {headers.map((h, i) => (
                <th key={i} className="text-left p-4 text-[#8B949E] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[#1F242C] last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="p-4">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// 1. EXECUTIVE SUMMARY
// ============================================
function ExecutiveSummarySection() {
  return (
    <div>
      <SectionHeader 
        number="1" 
        title="Executive Summary" 
        subtitle="AI Engine v10.5 — Cognitive Commerce Intelligence"
      />
      
      <InfoBox type="success" title="Document Status">
        This document describes the official architecture of AI Engine v10.5, 
        the cognitive intelligence layer powering IVYAR Business Trade Module.
      </InfoBox>

      <h2 className="text-xl font-semibold mb-4">1.1 Purpose</h2>
      <p className="text-[#8B949E] mb-6">
        AI Engine v10.5 provides intelligent decision-making capabilities for the IVYAR/HBS platform,
        enabling automated pricing optimization, demand forecasting, fraud detection, and vendor/product
        scoring. This engine operates with full transparency, explainability, and human oversight.
      </p>

      <h2 className="text-xl font-semibold mb-4">1.2 Scope of Capabilities</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { icon: '💰', title: 'Pricing Optimization', desc: 'AI-driven dynamic pricing with constraints' },
          { icon: '🔮', title: 'Demand Forecasting', desc: '30/90-day predictions with confidence intervals' },
          { icon: '🛡️', title: 'Fraud Detection', desc: 'Real-time risk scoring and flagging' },
          { icon: '📊', title: 'Scoring Engine', desc: 'Vendor health and product AI scores' },
        ].map((cap, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <span className="text-2xl">{cap.icon}</span>
            <div className="font-semibold mt-2">{cap.title}</div>
            <div className="text-sm text-[#8B949E]">{cap.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">1.3 Key Improvements over v10.0</h2>
      <Table 
        headers={['Feature', 'v10.0', 'v10.5', 'Improvement']}
        rows={[
          ['Fraud Detection Accuracy', '96.2%', '99.2%', '+3.0pp'],
          ['Forecast Accuracy', '89.4%', '94.7%', '+5.3pp'],
          ['Pricing Response Time', '450ms', '85ms', '5.3x faster'],
          ['Feature Store Latency', '120ms', '15ms', '8x faster'],
          ['Explainability Coverage', '60%', '100%', 'Full coverage'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">1.4 Intended Audiences</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {['Ministries', 'Donors', 'Vendors', 'Operators', 'Auditors', 'Technical Teams'].map((audience) => (
          <span key={audience} className="bg-[#1F242C] px-3 py-1.5 rounded-lg text-sm">{audience}</span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">1.5 Architecture Alignment</h2>
      <p className="text-[#8B949E] mb-4">
        AI Engine v10.5 is fully aligned with:
      </p>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2 mb-6">
        <li>IVYAR Platform Architecture v10.0</li>
        <li>HBS Sovereign Intelligence Framework</li>
        <li>OpenAPI Specification v10.5</li>
        <li>GDPR, SOC 2, ISO 27001 compliance requirements</li>
        <li>NATO AI Standards for Government Systems</li>
      </ul>
    </div>
  );
}

// ============================================
// 2. SYSTEM OVERVIEW
// ============================================
function SystemOverviewSection() {
  return (
    <div>
      <SectionHeader 
        number="2" 
        title="System Overview" 
        subtitle="What the AI Engine does and how it operates"
      />

      <h2 className="text-xl font-semibold mb-4">2.1 What the AI Engine Does</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 gap-4">
          {[
            { title: 'Pricing Optimization', desc: 'Recommends optimal prices based on demand, competition, and constraints', metrics: 'Revenue +12%' },
            { title: 'Demand Forecasting', desc: 'Predicts product demand with 30/90-day horizons', metrics: '94.7% accuracy' },
            { title: 'Fraud Detection', desc: 'Scores orders in real-time, flags suspicious patterns', metrics: '$890K blocked/month' },
            { title: 'Vendor Health Scoring', desc: 'Calculates trust and risk scores for all vendors', metrics: '2,847 vendors scored' },
            { title: 'Product AI Scoring', desc: 'Multi-dimensional scoring: recommendation, demand, quality, risk', metrics: '38,940 products' },
            { title: 'Real-time Insights', desc: 'Generates actionable recommendations and alerts', metrics: '5 insight types' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#0D1117] rounded-lg">
              <div className="flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-[#8B949E]">{item.desc}</div>
              </div>
              <div className="text-xs bg-[#3CCB7F]/20 text-[#3CCB7F] px-2 py-1 rounded">{item.metrics}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">2.2 Core Principles</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: '🏛️', title: 'Sovereignty', desc: 'Data and models remain under institutional control' },
          { icon: '🔍', title: 'Transparency', desc: 'All decisions are logged and traceable' },
          { icon: '📖', title: 'Explainability', desc: 'Every recommendation includes rationale' },
          { icon: '📋', title: 'Auditability', desc: 'Complete audit trails for compliance' },
          { icon: '👤', title: 'Human-in-the-loop', desc: 'Critical decisions require human approval' },
          { icon: '⚖️', title: 'Ethical AI', desc: 'Fairness, non-discrimination, proportionality' },
        ].map((principle, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
            <span className="text-2xl">{principle.icon}</span>
            <div className="font-semibold mt-2">{principle.title}</div>
            <div className="text-xs text-[#8B949E]">{principle.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">2.3 High-Level Architecture</h2>
      <DiagramPlaceholder title="AI Engine v10.5 High-Level Architecture" type="Mermaid Flowchart" />
      
      <CodeBlock 
        language="mermaid"
        code={`flowchart LR
    subgraph DataLayer[Data Layer]
        Orders((Orders))
        Products((Products))
        Vendors((Vendors))
        Buyers((Buyers))
    end

    subgraph FeatureStore[Feature Store]
        ProductFeatures[[Product Features]]
        VendorFeatures[[Vendor Features]]
        OrderFeatures[[Order Features]]
    end

    subgraph Models[Model Layer]
        PricingModel[[Pricing]]
        ForecastModel[[Forecasting]]
        FraudModel[[Fraud]]
        ScoringModel[[Scoring]]
    end

    subgraph Serving[Serving Layer]
        RTAPI[[Real-time API]]
        BatchJobs[[Batch Jobs]]
    end

    subgraph Governance[Governance]
        Explainability[[Explainability]]
        Audit[[Audit Logs]]
    end

    DataLayer --> FeatureStore
    FeatureStore --> Models
    Models --> Serving
    Serving --> Governance`}
      />
    </div>
  );
}

// ============================================
// 3. ARCHITECTURE LAYERS
// ============================================
function ArchitectureLayersSection() {
  return (
    <div>
      <SectionHeader 
        number="3" 
        title="Architecture Layers" 
        subtitle="Five-layer architecture for cognitive intelligence"
      />

      <h2 className="text-xl font-semibold mb-4">3.1 Data Layer</h2>
      <p className="text-[#8B949E] mb-4">
        The Data Layer ingests and stores all transactional, behavioral, and operational data.
      </p>
      <Table 
        headers={['Data Type', 'Source', 'Volume', 'Refresh Rate']}
        rows={[
          ['Transactional', 'Orders, Payments', '~50K/day', 'Real-time'],
          ['Behavioral', 'Views, Clicks, Searches', '~2M/day', 'Near real-time'],
          ['Operational', 'Logistics, Inventory', '~100K/day', 'Hourly'],
          ['External', 'Market signals (optional)', 'Variable', 'Daily'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">3.2 Feature Layer</h2>
      <p className="text-[#8B949E] mb-4">
        Central Feature Store with online (low-latency) and offline (batch) capabilities.
      </p>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-[#00A3FF]">Online Store</h3>
            <ul className="text-sm text-[#8B949E] space-y-2">
              <li>• Latency: &lt;15ms p99</li>
              <li>• Use: Real-time inference</li>
              <li>• Storage: Redis Cluster</li>
              <li>• TTL: Configurable per feature</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[#A371F7]">Offline Store</h3>
            <ul className="text-sm text-[#8B949E] space-y-2">
              <li>• Latency: Minutes</li>
              <li>• Use: Training, Batch scoring</li>
              <li>• Storage: Data Warehouse</li>
              <li>• History: 2 years</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">3.3 Model Layer</h2>
      <Table 
        headers={['Model', 'Type', 'Framework', 'Latency', 'Refresh']}
        rows={[
          ['Pricing', 'Regression/Uplift', 'XGBoost', '~20ms', 'Nightly'],
          ['Demand', 'Time-Series', 'Prophet/TFT', '~50ms', 'Daily'],
          ['Fraud', 'Classification + Rules', 'LightGBM + Rules Engine', '~30ms', 'Hourly'],
          ['Vendor Score', 'Composite', 'Weighted Average + ML', '~10ms', 'Daily'],
          ['Product Score', 'Multi-output', 'Neural Network', '~15ms', 'Daily'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">3.4 Serving Layer</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <h3 className="font-semibold mb-2">Real-time Inference</h3>
          <ul className="text-sm text-[#8B949E] space-y-1">
            <li>• REST/gRPC APIs</li>
            <li>• Auto-scaling pods</li>
            <li>• Circuit breakers</li>
            <li>• Request caching</li>
          </ul>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <h3 className="font-semibold mb-2">Batch Processing</h3>
          <ul className="text-sm text-[#8B949E] space-y-1">
            <li>• Scheduled jobs (cron)</li>
            <li>• Spark for large datasets</li>
            <li>• Incremental updates</li>
            <li>• Backfill capability</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">3.5 Governance Layer</h2>
      <InfoBox type="note" title="Human Oversight">
        All critical AI decisions support human override. Audit logs capture 100% of predictions and actions.
      </InfoBox>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Explainability:</strong> Every prediction includes top contributing features and rationale</li>
        <li><strong>Overrides:</strong> Authorized users can override AI recommendations</li>
        <li><strong>Thresholds:</strong> Configurable confidence and risk thresholds per use case</li>
        <li><strong>Audit Logs:</strong> Immutable logs with tamper-proof storage</li>
        <li><strong>Drift Detection:</strong> Automated monitoring for data and model drift</li>
      </ul>
    </div>
  );
}

// ============================================
// 4. DATA ARCHITECTURE
// ============================================
function DataArchitectureSection() {
  return (
    <div>
      <SectionHeader 
        number="4" 
        title="Data Architecture" 
        subtitle="Data sources, pipelines, and models"
      />

      <h2 className="text-xl font-semibold mb-4">4.1 Data Sources</h2>
      <Table 
        headers={['Source', 'Data Type', 'Volume', 'Key Fields']}
        rows={[
          ['Orders', 'Transactional', '~50K/day', 'id, buyerId, vendorId, items[], total, status'],
          ['Products', 'Master', '~40K active', 'id, vendorId, title, priceBase, category, specs'],
          ['Vendors', 'Master', '~2.8K', 'id, companyName, status, rating, tier'],
          ['Buyers', 'Master', '~35K', 'id, name, email, company, orderHistory'],
          ['Logistics', 'Events', '~100K/day', 'orderId, status, trackingNumber, timestamp'],
          ['Ratings', 'Feedback', '~5K/day', 'orderId, vendorId, productId, score, comment'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">4.2 Entity Relationship Diagram</h2>
      <DiagramPlaceholder title="AI Engine Data Model ERD" type="Mermaid ERD" />
      
      <CodeBlock 
        language="mermaid"
        code={`erDiagram
    PRODUCT {
      string id PK
      string vendorId FK
      string title
      string category
      float priceBase
      float priceAI
    }

    PRODUCT_AISCORE {
      string productId FK
      float recommendation
      float demand
      float quality
      float risk
    }

    VENDOR {
      string id PK
      string companyName
      string status
      float rating
    }

    VENDOR_HEALTH {
      string vendorId FK
      float aiHealthScore
      float onTimeDelivery
      float disputeRate
    }

    ORDER {
      string id PK
      string buyerId FK
      string vendorId FK
      float total
      string status
    }

    FRAUD_FLAG {
      string id PK
      string orderId FK
      string type
      string severity
    }

    VENDOR ||--o{ PRODUCT : owns
    PRODUCT ||--|| PRODUCT_AISCORE : has
    VENDOR ||--|| VENDOR_HEALTH : has
    ORDER ||--o{ FRAUD_FLAG : may_have`}
      />

      <h2 className="text-xl font-semibold mb-4">4.3 Data Pipelines</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="bg-[#00A3FF]/20 text-[#00A3FF] px-3 py-1 rounded text-xs font-mono">Real-time</span>
            <span className="text-sm">Kafka → Flink → Feature Store → Redis</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-[#A371F7]/20 text-[#A371F7] px-3 py-1 rounded text-xs font-mono">Batch</span>
            <span className="text-sm">Data Warehouse → Spark → Feature Store → S3</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-[#3CCB7F]/20 text-[#3CCB7F] px-3 py-1 rounded text-xs font-mono">Training</span>
            <span className="text-sm">Feature Store → Training Pipeline → Model Registry</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">4.4 Data Quality & Validation</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Schema Validation:</strong> JSON Schema enforcement at ingestion</li>
        <li><strong>Anomaly Detection:</strong> Statistical monitoring for unusual patterns</li>
        <li><strong>Missing Data:</strong> Imputation strategies per feature type</li>
        <li><strong>Freshness:</strong> SLA monitoring with alerts for stale data</li>
      </ul>
    </div>
  );
}

// ============================================
// 5. FEATURE STORE
// ============================================
function FeatureStoreSection() {
  return (
    <div>
      <SectionHeader 
        number="5" 
        title="Feature Store Architecture" 
        subtitle="Centralized feature management for ML models"
      />

      <h2 className="text-xl font-semibold mb-4">5.1 Feature Groups</h2>
      <Table 
        headers={['Group', 'Entity', 'Features', 'Update Frequency']}
        rows={[
          ['Product Features', 'Product', 'views_30d, conversion_rate, price_elasticity, return_rate', 'Hourly'],
          ['Vendor Features', 'Vendor', 'on_time_rate_90d, cancellation_rate, dispute_rate, volume_tier', 'Daily'],
          ['Buyer Features', 'Buyer', 'orders_90d, chargeback_rate, dispute_count, geo_stability', 'Daily'],
          ['Order Features', 'Order', 'basket_value, high_risk_flag, ip_geo_mismatch, velocity_score', 'Real-time'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">5.2 Feature Types</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { type: 'Time-series', examples: 'orders_30d, views_7d, revenue_mtd', color: '#00A3FF' },
          { type: 'Aggregates', examples: 'avg_order_value, total_returns, sum_revenue', color: '#A371F7' },
          { type: 'Behavioral', examples: 'conversion_rate, click_through_rate, bounce_rate', color: '#3CCB7F' },
          { type: 'Risk Indicators', examples: 'fraud_score, velocity_flag, geo_mismatch', color: '#F85149' },
        ].map((ft, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="font-semibold mb-2" style={{ color: ft.color }}>{ft.type}</div>
            <div className="text-sm text-[#8B949E] font-mono">{ft.examples}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">5.3 Online vs Offline Store</h2>
      <Table 
        headers={['Aspect', 'Online Store', 'Offline Store']}
        rows={[
          ['Latency', '<15ms p99', 'Minutes to hours'],
          ['Use Case', 'Real-time inference', 'Training, batch scoring'],
          ['Storage', 'Redis Cluster', 'Data Warehouse (Snowflake)'],
          ['History', 'Latest value', '2+ years'],
          ['Sync', 'Continuous streaming', 'Scheduled jobs'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">5.4 Feature Governance</h2>
      <InfoBox type="info" title="Feature Ownership">
        Every feature has a designated owner responsible for quality, documentation, and monitoring.
      </InfoBox>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Documentation:</strong> Automated feature documentation from schema</li>
        <li><strong>Versioning:</strong> Semantic versioning for breaking changes</li>
        <li><strong>Monitoring:</strong> Drift detection, null rates, distribution shifts</li>
        <li><strong>Lineage:</strong> Full traceability from source to model</li>
      </ul>
    </div>
  );
}

// ============================================
// 6. PRICING ENGINE
// ============================================
function PricingEngineSection() {
  return (
    <div>
      <SectionHeader 
        number="6" 
        title="Pricing Engine Architecture" 
        subtitle="AI-optimized dynamic pricing"
      />

      <h2 className="text-xl font-semibold mb-4">6.1 Objective</h2>
      <p className="text-[#8B949E] mb-6">
        Maximize marketplace revenue while maintaining fairness, respecting vendor constraints,
        and ensuring competitive positioning.
      </p>

      <h2 className="text-xl font-semibold mb-4">6.2 Inputs</h2>
      <Table 
        headers={['Input', 'Description', 'Source']}
        rows={[
          ['Base Price', 'Vendor-set starting price', 'Product catalog'],
          ['Elasticity', 'Price sensitivity of demand', 'Historical analysis'],
          ['Demand Signals', 'Views, searches, cart additions', 'Feature Store'],
          ['Competitiveness', 'Market price benchmarks', 'External (optional)'],
          ['Seasonality', 'Time-based demand patterns', 'Historical analysis'],
          ['Inventory', 'Stock levels and constraints', 'Operational data'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">6.3 Model Design</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold">Regression</div>
            <div className="text-xs text-[#8B949E]">Revenue prediction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold">Uplift</div>
            <div className="text-xs text-[#8B949E]">Price change impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold">Optimization</div>
            <div className="text-xs text-[#8B949E]">Price grid selection</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">6.4 Outputs</h2>
      <CodeBlock 
        language="typescript"
        code={`interface PricingRecommendation {
  productId: string;
  basePrice: number;
  recommendedPrice: number;
  confidence: number;          // 0-100
  expectedDemandChange: number; // percentage
  rationale: string;
  topFeatures: string[];
}`}
      />

      <h2 className="text-xl font-semibold mb-4">6.5 Sequence Diagram</h2>
      <DiagramPlaceholder title="Pricing Engine Flow" type="Sequence" />
      <CodeBlock 
        language="mermaid"
        code={`sequenceDiagram
    participant Vendor
    participant TradeAPI
    participant AIEngine
    participant FeatureStore
    participant PricingModel

    Vendor->>TradeAPI: Request pricing (productId)
    TradeAPI->>AIEngine: getPricingRecommendation()
    AIEngine->>FeatureStore: fetchProductFeatures()
    FeatureStore-->>AIEngine: features
    AIEngine->>PricingModel: predict(features)
    PricingModel-->>AIEngine: recommendation
    AIEngine-->>TradeAPI: PricingRecommendation
    TradeAPI-->>Vendor: Display AI price`}
      />

      <h2 className="text-xl font-semibold mb-4">6.6 Controls & Constraints</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Price Bounds:</strong> ±20% from base price (configurable)</li>
        <li><strong>Vendor Rules:</strong> Minimum margin, no undercutting policies</li>
        <li><strong>Manual Override:</strong> Vendors can lock prices</li>
        <li><strong>Audit:</strong> All price changes logged with rationale</li>
      </ul>
    </div>
  );
}

// ============================================
// 7. DEMAND FORECASTING ENGINE
// ============================================
function ForecastingEngineSection() {
  return (
    <div>
      <SectionHeader 
        number="7" 
        title="Demand Forecasting Engine" 
        subtitle="Predictive demand intelligence"
      />

      <h2 className="text-xl font-semibold mb-4">7.1 Objective</h2>
      <p className="text-[#8B949E] mb-6">
        Predict future demand per product with 30/90-day horizons, identify stock risks,
        and provide restock recommendations to vendors.
      </p>

      <h2 className="text-xl font-semibold mb-4">7.2 Inputs</h2>
      <Table 
        headers={['Input', 'Description', 'Granularity']}
        rows={[
          ['Historical Orders', 'Order counts and values', 'Daily, by product'],
          ['Views & Conversions', 'Traffic and conversion metrics', 'Daily'],
          ['Price History', 'Price changes over time', 'Per change event'],
          ['Seasonality', 'DOW, month, holidays', 'Calendar-based'],
          ['Promotions', 'Campaign data (if available)', 'Event-based'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">7.3 Model Design</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-[#00A3FF]">Primary: Time-Series Model</h3>
            <ul className="text-sm text-[#8B949E] space-y-1">
              <li>• Prophet-style decomposition</li>
              <li>• Temporal Fusion Transformer (TFT)</li>
              <li>• Per-product modeling for high-volume</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[#A371F7]">Fallback: Category-Level</h3>
            <ul className="text-sm text-[#8B949E] space-y-1">
              <li>• For low-volume products</li>
              <li>• Category-based aggregation</li>
              <li>• Transfer learning</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">7.4 Outputs</h2>
      <CodeBlock 
        language="typescript"
        code={`interface DemandForecast {
  productId: string;
  horizonDays: number;
  points: {
    date: string;
    expectedDemand: number;
    confidence: number;
  }[];
  stockoutRisk: boolean;
  overstockRisk: boolean;
  restockRecommendation: string;
}`}
      />

      <h2 className="text-xl font-semibold mb-4">7.5 Serving</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <h3 className="font-semibold mb-2">Batch (Daily)</h3>
          <p className="text-sm text-[#8B949E]">
            Nightly recomputation for all active products. Results stored in Feature Store.
          </p>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <h3 className="font-semibold mb-2">On-Demand API</h3>
          <p className="text-sm text-[#8B949E]">
            /ai/demand/forecast endpoint for vendor dashboards and planning tools.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">7.6 Performance Metrics</h2>
      <Table 
        headers={['Metric', 'Target', 'Current']}
        rows={[
          ['MAPE (Mean Absolute Percentage Error)', '<10%', '5.3%'],
          ['Coverage (within 90% CI)', '>85%', '92%'],
          ['Stockout Prediction Accuracy', '>90%', '94.7%'],
        ]}
      />
    </div>
  );
}

// ============================================
// 8. FRAUD DETECTION ENGINE
// ============================================
function FraudDetectionSection() {
  return (
    <div>
      <SectionHeader 
        number="8" 
        title="Fraud Detection Engine" 
        subtitle="Real-time risk scoring and prevention"
      />

      <InfoBox type="warning" title="Critical System">
        Fraud detection operates in real-time on every order. High-risk orders are automatically
        held for manual review before processing.
      </InfoBox>

      <h2 className="text-xl font-semibold mb-4">8.1 Objective</h2>
      <p className="text-[#8B949E] mb-6">
        Detect high-risk orders and buyers in real-time, prevent financial losses,
        and reduce dispute rates while minimizing false positives.
      </p>

      <h2 className="text-xl font-semibold mb-4">8.2 Inputs</h2>
      <Table 
        headers={['Category', 'Features', 'Weight']}
        rows={[
          ['Order Features', 'basket_value, high_risk_category, expedited_shipping', 'High'],
          ['Buyer History', 'orders_count, chargeback_rate, dispute_count', 'High'],
          ['Device/Geo', 'ip_geo_mismatch, new_device, vpn_detected', 'Medium'],
          ['Velocity', 'orders_last_24h, registration_age, value_spike', 'High'],
          ['Payment', 'payment_method_risk, card_country_mismatch', 'Medium'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">8.3 Model Design</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0D1117] rounded-lg p-4">
            <div className="text-[#F85149] font-semibold mb-2">Supervised Model</div>
            <p className="text-xs text-[#8B949E]">LightGBM trained on historical fraud cases</p>
          </div>
          <div className="bg-[#0D1117] rounded-lg p-4">
            <div className="text-[#F59E0B] font-semibold mb-2">Rules Engine</div>
            <p className="text-xs text-[#8B949E]">Expert-defined rules for known patterns</p>
          </div>
          <div className="bg-[#0D1117] rounded-lg p-4">
            <div className="text-[#A371F7] font-semibold mb-2">Anomaly Detection</div>
            <p className="text-xs text-[#8B949E]">Unsupervised model for new patterns</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">8.4 Outputs</h2>
      <CodeBlock 
        language="typescript"
        code={`interface FraudResult {
  orderId: string;
  riskScore: number;          // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  fraudFlags: {
    type: string;             // velocity, geo_mismatch, etc.
    message: string;
    confidence: number;
  }[];
  recommendedAction: 'allow' | 'review' | 'block';
  explainability: string;
}`}
      />

      <h2 className="text-xl font-semibold mb-4">8.5 Risk Thresholds</h2>
      <Table 
        headers={['Risk Score', 'Severity', 'Action', 'Volume %']}
        rows={[
          ['0-30', 'Low', 'Auto-approve', '92%'],
          ['31-60', 'Medium', 'Auto-approve with flag', '5%'],
          ['61-85', 'High', 'Manual review required', '2.5%'],
          ['86-100', 'Critical', 'Auto-block', '0.5%'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">8.6 Performance</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Detection Rate', value: '99.2%', desc: 'True positive rate' },
          { label: 'False Positive', value: '0.3%', desc: 'Legitimate orders blocked' },
          { label: 'Fraud Blocked', value: '$890K/mo', desc: 'Value prevented' },
        ].map((m, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#3CCB7F]">{m.value}</div>
            <div className="font-semibold">{m.label}</div>
            <div className="text-xs text-[#8B949E]">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 9. SCORING ENGINE
// ============================================
function ScoringEngineSection() {
  return (
    <div>
      <SectionHeader 
        number="9" 
        title="Scoring Engine" 
        subtitle="Vendor health and product AI scores"
      />

      <h2 className="text-xl font-semibold mb-4">9.1 Vendor AI Health Score</h2>
      <p className="text-[#8B949E] mb-4">
        Single trust metric (0-100) representing overall vendor reliability and risk.
      </p>
      
      <h3 className="text-lg font-semibold mb-3">Inputs & Weights</h3>
      <Table 
        headers={['Factor', 'Weight', 'Description']}
        rows={[
          ['On-Time Delivery', '25%', 'Orders delivered by promised date'],
          ['Fulfillment Rate', '20%', 'Orders successfully completed'],
          ['Dispute Rate', '20%', 'Disputes as % of orders'],
          ['Rating', '15%', 'Average customer rating'],
          ['Cancellation Rate', '10%', 'Vendor-initiated cancellations'],
          ['Fraud Association', '10%', 'Involvement in flagged orders'],
        ]}
      />

      <h3 className="text-lg font-semibold mb-3 mt-6">Risk Tiers</h3>
      <div className="flex gap-4 mb-6">
        {[
          { tier: 'Green', range: '85-100', color: '#3CCB7F' },
          { tier: 'Yellow', range: '60-84', color: '#F59E0B' },
          { tier: 'Red', range: '0-59', color: '#F85149' },
        ].map((t, i) => (
          <div key={i} className="flex-1 rounded-xl p-4 text-center" style={{ backgroundColor: `${t.color}20`, borderColor: t.color, borderWidth: 1 }}>
            <div className="font-bold" style={{ color: t.color }}>{t.tier}</div>
            <div className="text-sm text-[#8B949E]">{t.range}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">9.2 Product AI Scores</h2>
      <p className="text-[#8B949E] mb-4">
        Multi-dimensional scoring (0-100) for each product.
      </p>
      
      <Table 
        headers={['Dimension', 'Description', 'Key Factors']}
        rows={[
          ['Recommendation', 'How strongly platform recommends', 'Demand, quality, margin, vendor health'],
          ['Demand', 'Current and predicted demand level', 'Views, orders, trends, seasonality'],
          ['Quality', 'Product quality indicators', 'Ratings, returns, complaints'],
          ['Risk', 'Risk of issues with product', 'Category risk, vendor risk, disputes'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">9.3 Score Governance</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Transparency:</strong> Score breakdown visible to vendors</li>
        <li><strong>Explainability:</strong> Top factors shown for each dimension</li>
        <li><strong>Appeal Process:</strong> Vendors can request score review</li>
        <li><strong>Manual Override:</strong> Admin can adjust scores with justification</li>
      </ul>
    </div>
  );
}

// ============================================
// 10. AI INSIGHTS ENGINE
// ============================================
function AIInsightsSection() {
  return (
    <div>
      <SectionHeader 
        number="10" 
        title="AI Insights Engine" 
        subtitle="Real-time recommendations and alerts"
      />

      <h2 className="text-xl font-semibold mb-4">10.1 Insight Types</h2>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { type: 'Opportunity', icon: '💡', color: '#3CCB7F', desc: 'Revenue optimization' },
          { type: 'Risk', icon: '🚨', color: '#F85149', desc: 'Fraud & threats' },
          { type: 'Prediction', icon: '🔮', color: '#00A3FF', desc: 'Demand forecasts' },
          { type: 'Anomaly', icon: '⚠️', color: '#F59E0B', desc: 'Unusual patterns' },
          { type: 'Optimization', icon: '⚙️', color: '#A371F7', desc: 'System improvements' },
        ].map((t, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-3 text-center">
            <span className="text-xl">{t.icon}</span>
            <div className="font-semibold mt-1" style={{ color: t.color }}>{t.type}</div>
            <div className="text-xs text-[#8B949E]">{t.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">10.2 Insight Structure</h2>
      <CodeBlock 
        language="typescript"
        code={`interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'prediction' | 'anomaly' | 'optimization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  confidence: number;
  dataPoints: number;
  actions: { label: string; action: string; primary: boolean }[];
  expiresAt: string | null;
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed';
}`}
      />

      <h2 className="text-xl font-semibold mb-4">10.3 Assistant Panel Integration</h2>
      <p className="text-[#8B949E] mb-4">
        AI Insights are surfaced in the global Assistant Panel with:
      </p>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li>Priority-sorted display (critical first)</li>
        <li>Contextual recommendations based on current view</li>
        <li>One-click action buttons</li>
        <li>Explanation tooltips on hover</li>
        <li>Dismiss/acknowledge tracking</li>
      </ul>
    </div>
  );
}

// ============================================
// 11. SERVING & API ARCHITECTURE
// ============================================
function ServingAPISection() {
  return (
    <div>
      <SectionHeader 
        number="11" 
        title="Serving & API Architecture" 
        subtitle="Real-time and batch inference infrastructure"
      />

      <h2 className="text-xl font-semibold mb-4">11.1 Real-time Inference APIs</h2>
      <Table 
        headers={['Endpoint', 'Method', 'Latency p99', 'Rate Limit']}
        rows={[
          ['/ai/pricing/recommendation', 'POST', '85ms', '1000/min'],
          ['/ai/demand/forecast', 'GET', '120ms', '500/min'],
          ['/ai/fraud/score', 'POST', '45ms', '5000/min'],
          ['/ai/scoring/vendor/{id}', 'GET', '30ms', '1000/min'],
          ['/ai/scoring/product/{id}', 'GET', '25ms', '2000/min'],
          ['/ai/insights', 'GET', '50ms', '1000/min'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">11.2 Batch Jobs</h2>
      <Table 
        headers={['Job', 'Schedule', 'Duration', 'Output']}
        rows={[
          ['Demand Forecast', 'Daily 02:00 UTC', '~45 min', '40K products'],
          ['Pricing Optimization', 'Daily 03:00 UTC', '~30 min', '40K products'],
          ['Vendor Scoring', 'Daily 04:00 UTC', '~15 min', '2.8K vendors'],
          ['Product Scoring', 'Daily 04:30 UTC', '~20 min', '40K products'],
          ['Drift Detection', 'Hourly', '~5 min', 'Alerts'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">11.3 Caching Strategy</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="font-semibold text-[#00A3FF] mb-2">L1: Request Cache</div>
            <ul className="text-sm text-[#8B949E] space-y-1">
              <li>• In-memory</li>
              <li>• TTL: 60s</li>
              <li>• Same-request dedup</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#A371F7] mb-2">L2: Feature Cache</div>
            <ul className="text-sm text-[#8B949E] space-y-1">
              <li>• Redis</li>
              <li>• TTL: Feature-specific</li>
              <li>• Pre-computed features</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[#3CCB7F] mb-2">L3: Model Cache</div>
            <ul className="text-sm text-[#8B949E] space-y-1">
              <li>• Model artifact cache</li>
              <li>• Pre-loaded models</li>
              <li>• Warm standby</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">11.4 API Authentication</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Bearer Token:</strong> JWT with role-based claims</li>
        <li><strong>API Keys:</strong> For service-to-service communication</li>
        <li><strong>Rate Limiting:</strong> Per-client and per-endpoint limits</li>
        <li><strong>Audit:</strong> All requests logged with correlation ID</li>
      </ul>
    </div>
  );
}

// ============================================
// 12. MONITORING & OBSERVABILITY
// ============================================
function MonitoringSection() {
  return (
    <div>
      <SectionHeader 
        number="12" 
        title="Monitoring & Observability" 
        subtitle="Comprehensive system health monitoring"
      />

      <h2 className="text-xl font-semibold mb-4">12.1 Key Metrics</h2>
      <Table 
        headers={['Category', 'Metrics', 'Thresholds']}
        rows={[
          ['Latency', 'p50, p95, p99 per endpoint', 'p99 < 200ms'],
          ['Throughput', 'RPS, error rate, success rate', 'Error rate < 0.1%'],
          ['Model Performance', 'Accuracy, precision, recall, F1', 'F1 > 0.95'],
          ['Feature Health', 'Null rate, drift score, freshness', 'Null < 1%'],
          ['Business Impact', 'Revenue uplift, fraud blocked, conversion', 'Positive ROI'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">12.2 Dashboards</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { name: 'Model Performance', metrics: 'Accuracy, drift, predictions' },
          { name: 'Feature Health', metrics: 'Freshness, nulls, distributions' },
          { name: 'Risk Events', metrics: 'Fraud alerts, anomalies, overrides' },
        ].map((d, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="font-semibold mb-2">{d.name}</div>
            <div className="text-sm text-[#8B949E]">{d.metrics}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">12.3 Alerting</h2>
      <Table 
        headers={['Alert Type', 'Condition', 'Severity', 'Response']}
        rows={[
          ['Model Drift', 'PSI > 0.25', 'High', 'Retrain model'],
          ['Feature Stale', 'Age > 2x TTL', 'Medium', 'Investigate pipeline'],
          ['Latency Spike', 'p99 > 500ms', 'High', 'Scale or rollback'],
          ['Error Rate', '> 1%', 'Critical', 'Immediate investigation'],
          ['Fraud Spike', '> 2x baseline', 'Critical', 'Manual review all orders'],
        ]}
      />
    </div>
  );
}

// ============================================
// 13. GOVERNANCE, ETHICS & COMPLIANCE
// ============================================
function GovernanceSection() {
  return (
    <div>
      <SectionHeader 
        number="13" 
        title="Governance, Ethics & Compliance" 
        subtitle="Responsible AI framework"
      />

      <InfoBox type="note" title="Ethical AI Commitment">
        IVYAR AI Engine operates under strict ethical guidelines ensuring fairness,
        transparency, and human oversight in all automated decisions.
      </InfoBox>

      <h2 className="text-xl font-semibold mb-4">13.1 Ethical AI Principles</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { principle: 'Fairness', desc: 'No discrimination based on protected characteristics' },
          { principle: 'Transparency', desc: 'All decisions are traceable and explainable' },
          { principle: 'Accountability', desc: 'Clear ownership and responsibility for AI actions' },
          { principle: 'Privacy', desc: 'Data minimization and purpose limitation' },
          { principle: 'Safety', desc: 'Fail-safe mechanisms and human oversight' },
          { principle: 'Proportionality', desc: 'AI decisions proportionate to context' },
        ].map((p, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="font-semibold text-[#A371F7]">{p.principle}</div>
            <div className="text-sm text-[#8B949E]">{p.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">13.2 Explainability Requirements</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2 mb-6">
        <li>Every prediction includes human-readable rationale</li>
        <li>Top contributing features displayed for transparency</li>
        <li>Confidence scores mandatory for all outputs</li>
        <li>Alternative recommendations when confidence is low</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">13.3 Human-in-the-Loop Controls</h2>
      <Table 
        headers={['Decision Type', 'Automation Level', 'Human Involvement']}
        rows={[
          ['Low-risk order approval', 'Full auto', 'None (audit only)'],
          ['Medium-risk order', 'Auto with flag', 'Review queue'],
          ['High-risk order', 'Hold', 'Manual approval required'],
          ['Pricing change >15%', 'Recommend', 'Vendor approval'],
          ['Vendor suspension', 'Recommend', 'Admin approval required'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">13.4 Audit Trails</h2>
      <p className="text-[#8B949E] mb-4">
        Complete audit trail maintained for:
      </p>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li>Every AI prediction with input features</li>
        <li>All human overrides with justification</li>
        <li>Configuration changes to thresholds</li>
        <li>Model deployments and rollbacks</li>
        <li>Access to AI systems and data</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">13.5 Compliance Standards</h2>
      <div className="flex flex-wrap gap-3">
        {['GDPR', 'SOC 2 Type II', 'ISO 27001', 'EU AI Act', 'NATO AI Standards'].map((std) => (
          <span key={std} className="bg-[#3CCB7F]/20 text-[#3CCB7F] px-3 py-1.5 rounded-lg text-sm">
            ✓ {std}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 14. SECURITY ARCHITECTURE
// ============================================
function SecuritySection() {
  return (
    <div>
      <SectionHeader 
        number="14" 
        title="Security Architecture" 
        subtitle="Multi-layer security controls"
      />

      <h2 className="text-xl font-semibold mb-4">14.1 Authentication & Authorization</h2>
      <Table 
        headers={['Layer', 'Mechanism', 'Details']}
        rows={[
          ['API Gateway', 'JWT + API Keys', 'OAuth 2.0, OIDC'],
          ['Service-to-Service', 'mTLS', 'Certificate-based auth'],
          ['Model Access', 'RBAC', 'Role-based permissions'],
          ['Data Access', 'Row-level security', 'Tenant isolation'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">14.2 Data Encryption</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <div className="font-semibold mb-2">At Rest</div>
          <ul className="text-sm text-[#8B949E] space-y-1">
            <li>• AES-256 encryption</li>
            <li>• AWS KMS / HSM</li>
            <li>• Key rotation every 90 days</li>
          </ul>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <div className="font-semibold mb-2">In Transit</div>
          <ul className="text-sm text-[#8B949E] space-y-1">
            <li>• TLS 1.3 only</li>
            <li>• Certificate pinning</li>
            <li>• Perfect forward secrecy</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">14.3 Access Controls</h2>
      <Table 
        headers={['Role', 'Permissions', 'Scope']}
        rows={[
          ['AI Engineer', 'Model training, deployment', 'Non-prod + prod with approval'],
          ['ML Ops', 'Monitoring, alerts, scaling', 'All environments'],
          ['Data Scientist', 'Feature development, analysis', 'Non-prod only'],
          ['Auditor', 'Read-only audit logs', 'All environments'],
          ['Admin', 'Configuration, overrides', 'Prod with approval'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">14.4 Logging & Forensics</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li>Immutable audit logs with tamper detection</li>
        <li>7-year retention for compliance</li>
        <li>Real-time SIEM integration</li>
        <li>Forensic investigation capabilities</li>
      </ul>
    </div>
  );
}

// ============================================
// 15. DEPLOYMENT ARCHITECTURE
// ============================================
function DeploymentSection() {
  return (
    <div>
      <SectionHeader 
        number="15" 
        title="Deployment Architecture" 
        subtitle="Infrastructure and CI/CD"
      />

      <h2 className="text-xl font-semibold mb-4">15.1 Environments</h2>
      <Table 
        headers={['Environment', 'Purpose', 'Data', 'Access']}
        rows={[
          ['Development', 'Feature development', 'Synthetic', 'Engineers'],
          ['Staging', 'Integration testing', 'Anonymized prod', 'Engineers + QA'],
          ['Production', 'Live system', 'Real data', 'Restricted'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">15.2 Deployment Diagram</h2>
      <DiagramPlaceholder title="AI Engine Deployment Architecture" type="PlantUML Component" />
      
      <CodeBlock 
        language="plantuml"
        code={`@startuml
node "Kubernetes Cluster" {
    node "AI Services" {
        [AI Inference Service]
        [AI Batch Service]
        [Feature Store Service]
    }
    
    node "Monitoring" {
        [Metrics & Dashboards]
        [Audit Log Service]
    }
}

database "Feature Store DB" {
    [Online Features]
    [Offline Features]
}

storage "Model Registry" {
    [Model Artifacts]
}

[AI Inference Service] --> [Feature Store Service]
[AI Batch Service] --> [Model Artifacts]
[AI Inference Service] --> [Audit Log Service]
@enduml`}
      />

      <h2 className="text-xl font-semibold mb-4">15.3 CI/CD Pipeline</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          {['Code', 'Build', 'Test', 'Stage', 'Approve', 'Prod'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-[#00A3FF]/20 text-[#00A3FF] px-3 py-2 rounded-lg text-sm font-mono">
                {step}
              </div>
              {i < 5 && <span className="text-[#8B949E]">→</span>}
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">15.4 Rollback Strategy</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li><strong>Blue/Green:</strong> Instant traffic switch on issues</li>
        <li><strong>Canary:</strong> Gradual rollout (1% → 10% → 50% → 100%)</li>
        <li><strong>Model Rollback:</strong> Previous model version ready on standby</li>
        <li><strong>Feature Flags:</strong> Disable AI features without deployment</li>
      </ul>
    </div>
  );
}

// ============================================
// 16. ROADMAP
// ============================================
function RoadmapSection() {
  return (
    <div>
      <SectionHeader 
        number="16" 
        title="Roadmap v10.6 → v11.0" 
        subtitle="Future capabilities and enhancements"
      />

      <div className="space-y-6">
        {[
          {
            version: 'v10.6',
            timeline: 'Q1 2026',
            features: [
              'Reinforcement learning for pricing optimization',
              'Multi-vendor competitive intelligence',
              'Real-time A/B testing framework',
            ],
          },
          {
            version: 'v10.7',
            timeline: 'Q2 2026',
            features: [
              'Cross-border demand modeling',
              'Multi-currency pricing engine',
              'Enhanced fraud graph network',
            ],
          },
          {
            version: 'v10.8',
            timeline: 'Q3 2026',
            features: [
              'Autonomous vendor coaching',
              'Predictive logistics optimization',
              'Natural language insights',
            ],
          },
          {
            version: 'v11.0',
            timeline: 'Q4 2026',
            features: [
              'Sovereign Intelligence Layer',
              'Federated learning across deployments',
              'Full EU AI Act compliance certification',
            ],
          },
        ].map((release, i) => (
          <div key={i} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#A371F7] text-white px-3 py-1 rounded-lg font-mono font-bold">
                {release.version}
              </span>
              <span className="text-[#8B949E]">{release.timeline}</span>
            </div>
            <ul className="space-y-2">
              {release.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm">
                  <span className="text-[#3CCB7F]">→</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 17. APPENDIX
// ============================================
function AppendixSection() {
  return (
    <div>
      <SectionHeader 
        number="17" 
        title="Appendices" 
        subtitle="Reference materials and resources"
      />

      <h2 className="text-xl font-semibold mb-4">A. Glossary</h2>
      <Table 
        headers={['Term', 'Definition']}
        rows={[
          ['Feature Store', 'Centralized repository for ML features with online/offline serving'],
          ['PSI', 'Population Stability Index - metric for measuring data drift'],
          ['TFT', 'Temporal Fusion Transformer - deep learning model for time-series'],
          ['HITL', 'Human-in-the-loop - AI systems requiring human oversight'],
          ['p99 Latency', '99th percentile latency - worst-case response time metric'],
        ]}
      />

      <h2 className="text-xl font-semibold mb-4">B. API Reference</h2>
      <p className="text-[#8B949E] mb-4">
        Full API specification available at:
      </p>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 font-mono text-sm mb-6">
        <span className="text-[#00A3FF]">https://api.ivyar.org/trade/docs/openapi.yaml</span>
      </div>

      <h2 className="text-xl font-semibold mb-4">C. Related Documents</h2>
      <ul className="list-disc list-inside text-[#8B949E] space-y-2">
        <li>IVYAR Platform Architecture v10.0</li>
        <li>HBS Sovereign Intelligence Framework</li>
        <li>Business Trade Module API Specification v10.5</li>
        <li>Data Governance Policy</li>
        <li>AI Ethics Guidelines</li>
        <li>Incident Response Playbook</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4 mt-8">D. Contact</h2>
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-[#8B949E]">Technical Questions</div>
            <div className="font-mono text-[#00A3FF]">ai-engineering@ivyar.org</div>
          </div>
          <div>
            <div className="text-sm text-[#8B949E]">Governance & Ethics</div>
            <div className="font-mono text-[#00A3FF]">ai-governance@ivyar.org</div>
          </div>
        </div>
      </div>
    </div>
  );
}
