'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

type DocumentType = 'rate_confirmation' | 'bill_of_lading' | 'proof_of_delivery' | 'invoice' | 'inspection_report';
type DocumentStatus = 'draft' | 'pending_signature' | 'signed' | 'submitted' | 'verified' | 'rejected';
type ViewMode = 'list' | 'workflow' | 'create';

interface Document {
  id: string;
  documentNumber: string;
  type: DocumentType;
  loadId: string;
  loadNumber: string;
  status: DocumentStatus;
  shipperName: string;
  driverName?: string;
  route: string;
  amount?: number;
  createdAt: string;
  signedAt?: string;
  signatures: { type: string; name: string; timestamp: string }[];
}

interface LoadWorkflow {
  loadId: string;
  loadNumber: string;
  route: string;
  status: string;
  currentStep: number;
  steps: {
    name: string;
    status: 'completed' | 'current' | 'pending';
    document?: Document;
    completedAt?: string;
  }[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const DOCUMENT_TYPES: Record<DocumentType, { label: string; icon: string; color: string }> = {
  rate_confirmation: { label: 'Rate Confirmation', icon: '📋', color: '#00A3FF' },
  bill_of_lading: { label: 'Bill of Lading', icon: '📦', color: '#A371F7' },
  proof_of_delivery: { label: 'Proof of Delivery', icon: '✅', color: '#3CCB7F' },
  invoice: { label: 'Invoice', icon: '💰', color: '#F59E0B' },
  inspection_report: { label: 'Inspection Report', icon: '🔍', color: '#8B949E' },
};

const STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#8B949E', bg: 'rgba(139,148,158,0.15)' },
  pending_signature: { label: 'Pending Signature', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  signed: { label: 'Signed', color: '#00A3FF', bg: 'rgba(0,163,255,0.15)' },
  submitted: { label: 'Submitted', color: '#A371F7', bg: 'rgba(163,113,247,0.15)' },
  verified: { label: 'Verified', color: '#3CCB7F', bg: 'rgba(60,203,127,0.15)' },
  rejected: { label: 'Rejected', color: '#F85149', bg: 'rgba(248,81,73,0.15)' },
};

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    documentNumber: 'RC-2026-000001',
    type: 'rate_confirmation',
    loadId: 'load-001',
    loadNumber: 'DF-2026-00001',
    status: 'signed',
    shipperName: 'ABC Manufacturing',
    driverName: 'Mike Johnson',
    route: 'Los Angeles, CA → Phoenix, AZ',
    amount: 1860,
    createdAt: '2026-01-05T10:00:00Z',
    signedAt: '2026-01-05T10:30:00Z',
    signatures: [
      { type: 'shipper', name: 'Sarah Williams', timestamp: '2026-01-05T10:15:00Z' },
      { type: 'driver', name: 'Mike Johnson', timestamp: '2026-01-05T10:30:00Z' },
    ],
  },
  {
    id: 'doc-002',
    documentNumber: 'BOL-2026-000001',
    type: 'bill_of_lading',
    loadId: 'load-001',
    loadNumber: 'DF-2026-00001',
    status: 'signed',
    shipperName: 'ABC Manufacturing',
    driverName: 'Mike Johnson',
    route: 'Los Angeles, CA → Phoenix, AZ',
    createdAt: '2026-01-06T08:00:00Z',
    signedAt: '2026-01-06T08:30:00Z',
    signatures: [
      { type: 'shipper', name: 'Warehouse Manager', timestamp: '2026-01-06T08:15:00Z' },
      { type: 'driver', name: 'Mike Johnson', timestamp: '2026-01-06T08:30:00Z' },
    ],
  },
  {
    id: 'doc-003',
    documentNumber: 'POD-2026-000001',
    type: 'proof_of_delivery',
    loadId: 'load-001',
    loadNumber: 'DF-2026-00001',
    status: 'pending_signature',
    shipperName: 'ABC Manufacturing',
    driverName: 'Mike Johnson',
    route: 'Los Angeles, CA → Phoenix, AZ',
    createdAt: '2026-01-07T14:00:00Z',
    signatures: [],
  },
  {
    id: 'doc-004',
    documentNumber: 'RC-2026-000002',
    type: 'rate_confirmation',
    loadId: 'load-002',
    loadNumber: 'DF-2026-00002',
    status: 'verified',
    shipperName: 'Fresh Foods Inc',
    driverName: 'Mike Johnson',
    route: 'Fresno, CA → Seattle, WA',
    amount: 3568,
    createdAt: '2026-01-04T08:00:00Z',
    signedAt: '2026-01-04T09:00:00Z',
    signatures: [
      { type: 'shipper', name: 'John Smith', timestamp: '2026-01-04T08:30:00Z' },
      { type: 'driver', name: 'Mike Johnson', timestamp: '2026-01-04T09:00:00Z' },
    ],
  },
  {
    id: 'doc-005',
    documentNumber: 'INV-2026-000001',
    type: 'invoice',
    loadId: 'load-004',
    loadNumber: 'DF-2025-00892',
    status: 'verified',
    shipperName: 'ABC Manufacturing',
    driverName: 'Mike Johnson',
    route: 'Atlanta, GA → Miami, FL',
    amount: 2317,
    createdAt: '2026-01-04T16:00:00Z',
    signatures: [],
  },
];

const MOCK_WORKFLOWS: LoadWorkflow[] = [
  {
    loadId: 'load-001',
    loadNumber: 'DF-2026-00001',
    route: 'Los Angeles, CA → Phoenix, AZ',
    status: 'in_transit',
    currentStep: 2,
    steps: [
      { name: 'Rate Confirmation', status: 'completed', completedAt: '2026-01-05T10:30:00Z' },
      { name: 'Bill of Lading', status: 'completed', completedAt: '2026-01-06T08:30:00Z' },
      { name: 'In Transit', status: 'current' },
      { name: 'Proof of Delivery', status: 'pending' },
      { name: 'Invoice', status: 'pending' },
      { name: 'Payment', status: 'pending' },
    ],
  },
  {
    loadId: 'load-002',
    loadNumber: 'DF-2026-00002',
    route: 'Fresno, CA → Seattle, WA',
    status: 'in_transit',
    currentStep: 2,
    steps: [
      { name: 'Rate Confirmation', status: 'completed', completedAt: '2026-01-04T09:00:00Z' },
      { name: 'Bill of Lading', status: 'completed', completedAt: '2026-01-06T06:30:00Z' },
      { name: 'In Transit', status: 'current' },
      { name: 'Proof of Delivery', status: 'pending' },
      { name: 'Invoice', status: 'pending' },
      { name: 'Payment', status: 'pending' },
    ],
  },
  {
    loadId: 'load-004',
    loadNumber: 'DF-2025-00892',
    route: 'Atlanta, GA → Miami, FL',
    status: 'completed',
    currentStep: 5,
    steps: [
      { name: 'Rate Confirmation', status: 'completed', completedAt: '2026-01-02T10:00:00Z' },
      { name: 'Bill of Lading', status: 'completed', completedAt: '2026-01-03T08:30:00Z' },
      { name: 'In Transit', status: 'completed', completedAt: '2026-01-04T12:00:00Z' },
      { name: 'Proof of Delivery', status: 'completed', completedAt: '2026-01-04T14:00:00Z' },
      { name: 'Invoice', status: 'completed', completedAt: '2026-01-04T16:00:00Z' },
      { name: 'Payment', status: 'completed', completedAt: '2026-01-04T18:00:00Z' },
    ],
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

function DocumentTypeBadge({ type }: { type: DocumentType }) {
  const config = DOCUMENT_TYPES[type];
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span>{config.icon}</span>
      <span style={{ color: config.color }}>{config.label}</span>
    </span>
  );
}

function DocumentCard({ doc, onView }: { doc: Document; onView: () => void }) {
  const typeConfig = DOCUMENT_TYPES[doc.type];
  
  return (
    <div 
      className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 hover:border-[#00E0B8]/50 transition-all cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeConfig.icon}</span>
          <div>
            <div className="font-mono text-sm text-[#00E0B8]">{doc.documentNumber}</div>
            <div className="text-xs text-[#8B949E]">{typeConfig.label}</div>
          </div>
        </div>
        <StatusBadge status={doc.status} />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#8B949E]">Load:</span>
          <span className="font-mono">{doc.loadNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8B949E]">Route:</span>
          <span className="text-white">{doc.route}</span>
        </div>
        {doc.amount && (
          <div className="flex items-center gap-2">
            <span className="text-[#8B949E]">Amount:</span>
            <span className="text-[#3CCB7F] font-semibold">${doc.amount.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-[#1F242C] flex items-center justify-between">
        <div className="text-xs text-[#8B949E]">
          {new Date(doc.createdAt).toLocaleDateString()}
        </div>
        {doc.signatures.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#8B949E]">{doc.signatures.length} signature(s)</span>
            <span className="text-green-500">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: LoadWorkflow }) {
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[#00E0B8]">{workflow.loadNumber}</div>
          <div className="text-sm text-[#8B949E]">{workflow.route}</div>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${
          workflow.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          workflow.status === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {workflow.status.replace('_', ' ')}
        </span>
      </div>
      
      {/* Progress Steps */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {workflow.steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center" style={{ width: `${100 / workflow.steps.length}%` }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                step.status === 'completed' ? 'bg-[#3CCB7F] text-white' :
                step.status === 'current' ? 'bg-[#00A3FF] text-white animate-pulse' :
                'bg-[#1F242C] text-[#8B949E]'
              }`}>
                {step.status === 'completed' ? '✓' : i + 1}
              </div>
              <div className={`mt-2 text-xs text-center ${
                step.status === 'completed' ? 'text-[#3CCB7F]' :
                step.status === 'current' ? 'text-[#00A3FF]' :
                'text-[#8B949E]'
              }`}>
                {step.name}
              </div>
            </div>
          ))}
        </div>
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#1F242C] -z-0" style={{ marginLeft: '4%', marginRight: '4%' }}>
          <div 
            className="h-full bg-[#3CCB7F] transition-all"
            style={{ width: `${(workflow.currentStep / (workflow.steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function DocumentPreviewModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const typeConfig = DOCUMENT_TYPES[doc.type];
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0D1117] border border-[#1F242C] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{typeConfig.icon}</span>
            <div>
              <h2 className="text-lg font-bold">{typeConfig.label}</h2>
              <div className="font-mono text-sm text-[#00E0B8]">{doc.documentNumber}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B949E] hover:text-white text-2xl">×</button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#161B22] rounded-lg p-3">
              <div className="text-xs text-[#8B949E] mb-1">Load Number</div>
              <div className="font-mono">{doc.loadNumber}</div>
            </div>
            <div className="bg-[#161B22] rounded-lg p-3">
              <div className="text-xs text-[#8B949E] mb-1">Status</div>
              <StatusBadge status={doc.status} />
            </div>
            <div className="bg-[#161B22] rounded-lg p-3">
              <div className="text-xs text-[#8B949E] mb-1">Shipper</div>
              <div>{doc.shipperName}</div>
            </div>
            <div className="bg-[#161B22] rounded-lg p-3">
              <div className="text-xs text-[#8B949E] mb-1">Driver</div>
              <div>{doc.driverName || '—'}</div>
            </div>
            <div className="bg-[#161B22] rounded-lg p-3 col-span-2">
              <div className="text-xs text-[#8B949E] mb-1">Route</div>
              <div>{doc.route}</div>
            </div>
            {doc.amount && (
              <div className="bg-[#161B22] rounded-lg p-3 col-span-2">
                <div className="text-xs text-[#8B949E] mb-1">Amount</div>
                <div className="text-2xl font-bold text-[#3CCB7F]">${doc.amount.toLocaleString()}</div>
              </div>
            )}
          </div>
          
          {/* Signatures */}
          {doc.signatures.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-[#8B949E]">Signatures</h3>
              <div className="space-y-2">
                {doc.signatures.map((sig, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#161B22] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-400">✓</span>
                      </div>
                      <div>
                        <div className="font-medium">{sig.name}</div>
                        <div className="text-xs text-[#8B949E] capitalize">{sig.type}</div>
                      </div>
                    </div>
                    <div className="text-xs text-[#8B949E]">
                      {new Date(sig.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* QR Code Preview */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="w-32 h-32 bg-[#1F242C] rounded flex items-center justify-center text-[#8B949E] text-xs">
                QR Code
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-[#1F242C] flex gap-3">
          {doc.status === 'pending_signature' && (
            <button className="flex-1 py-2 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium hover:bg-[#00E0B8]/90">
              ✍️ Sign Document
            </button>
          )}
          <button className="flex-1 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg hover:border-[#00E0B8]/50">
            📄 Download PDF
          </button>
          <button className="flex-1 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg hover:border-[#00E0B8]/50">
            📧 Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateDocumentForm({ onClose }: { onClose: () => void }) {
  const [docType, setDocType] = useState<DocumentType>('rate_confirmation');
  const [step, setStep] = useState(1);
  
  return (
    <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Create Document</h2>
        <button onClick={onClose} className="text-[#8B949E] hover:text-white">×</button>
      </div>
      
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div 
            key={s}
            className={`flex-1 h-1 rounded ${s <= step ? 'bg-[#00E0B8]' : 'bg-[#1F242C]'}`}
          />
        ))}
      </div>
      
      {step === 1 && (
        <div>
          <h3 className="font-semibold mb-4">Select Document Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(DOCUMENT_TYPES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setDocType(key as DocumentType)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  docType === key 
                    ? 'border-[#00E0B8] bg-[#00E0B8]/10' 
                    : 'border-[#1F242C] hover:border-[#00E0B8]/50'
                }`}
              >
                <span className="text-2xl mb-2 block">{val.icon}</span>
                <span className="font-medium">{val.label}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setStep(2)}
            className="w-full mt-6 py-3 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium"
          >
            Next →
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-4">Select Load</h3>
          <div className="space-y-2 mb-6">
            {['DF-2026-00001', 'DF-2026-00002', 'DF-2026-00003'].map(load => (
              <button
                key={load}
                className="w-full p-4 rounded-xl border border-[#1F242C] hover:border-[#00E0B8]/50 text-left"
              >
                <div className="font-mono text-[#00E0B8]">{load}</div>
                <div className="text-sm text-[#8B949E]">Los Angeles, CA → Phoenix, AZ</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-[#1F242C] rounded-lg"
            >
              ← Back
            </button>
            <button 
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium"
            >
              Next →
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h3 className="font-semibold mb-4">Review & Create</h3>
          <div className="bg-[#0D1117] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{DOCUMENT_TYPES[docType].icon}</span>
              <div>
                <div className="font-semibold">{DOCUMENT_TYPES[docType].label}</div>
                <div className="text-sm text-[#8B949E]">For Load DF-2026-00001</div>
              </div>
            </div>
            <div className="text-sm text-[#8B949E]">
              Document will be auto-populated with load details and sent for signatures.
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-[#1F242C] rounded-lg"
            >
              ← Back
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium"
            >
              ✓ Create Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FreightDocumentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  
  const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.loadNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.shipperName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });
  
  const stats = {
    total: MOCK_DOCUMENTS.length,
    pending: MOCK_DOCUMENTS.filter(d => d.status === 'pending_signature').length,
    signed: MOCK_DOCUMENTS.filter(d => d.status === 'signed').length,
    verified: MOCK_DOCUMENTS.filter(d => d.status === 'verified').length,
  };
  
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/freight" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">🚛</div>
              <span className="font-bold text-lg">Direct Freight</span>
            </Link>
            <span className="text-[#8B949E]">/</span>
            <span className="font-semibold">Document Center</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/freight" className="px-4 py-2 text-sm text-[#8B949E] hover:text-white">Load Board</Link>
            <Link href="/freight/tracking" className="px-4 py-2 text-sm text-[#8B949E] hover:text-white">Tracking</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">📄 Document Center</h1>
              <p className="text-[#8B949E]">Complete document workflow: RC → BOL → POD → Invoice</p>
            </div>
            <button 
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium hover:bg-[#00E0B8]/90 flex items-center gap-2"
            >
              <span>+</span> Create Document
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-[#8B949E]">Total Documents</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-[#8B949E]">Pending Signature</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-blue-400">{stats.signed}</div>
              <div className="text-sm text-[#8B949E]">Signed</div>
            </div>
            <div className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl">
              <div className="text-2xl font-bold text-green-400">{stats.verified}</div>
              <div className="text-sm text-[#8B949E]">Verified</div>
            </div>
          </div>

          {/* View Toggle & Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex bg-[#161B22] rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-[#00E0B8] text-[#0D1117]' : 'text-[#8B949E]'}`}
              >
                📋 Documents
              </button>
              <button 
                onClick={() => setViewMode('workflow')}
                className={`px-4 py-2 rounded-md text-sm transition-all ${viewMode === 'workflow' ? 'bg-[#00E0B8] text-[#0D1117]' : 'text-[#8B949E]'}`}
              >
                🔄 Workflows
              </button>
            </div>
            
            {viewMode === 'list' && (
              <>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm w-64 focus:outline-none focus:border-[#00E0B8]"
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'all')}
                  className="px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  {Object.entries(DOCUMENT_TYPES).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
                  className="px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Content */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map(doc => (
                <DocumentCard 
                  key={doc.id} 
                  doc={doc} 
                  onView={() => setSelectedDoc(doc)}
                />
              ))}
            </div>
          )}
          
          {viewMode === 'workflow' && (
            <div className="space-y-4">
              {MOCK_WORKFLOWS.map(workflow => (
                <WorkflowCard key={workflow.loadId} workflow={workflow} />
              ))}
            </div>
          )}

          {filteredDocs.length === 0 && viewMode === 'list' && (
            <div className="text-center py-12 text-[#8B949E]">
              No documents found matching your criteria.
            </div>
          )}
        </div>
      </main>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <DocumentPreviewModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
      )}

      {/* Create Document Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-lg w-full">
            <CreateDocumentForm onClose={() => setShowCreate(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
