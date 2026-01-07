// app/api/freight/documents/route.ts
// IVYAR Direct Freight - Document API v1.0

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

type DocumentType = 'rate_confirmation' | 'bill_of_lading' | 'proof_of_delivery' | 'invoice' | 'inspection_report';
type DocumentStatus = 'draft' | 'pending_signature' | 'signed' | 'submitted' | 'verified' | 'rejected';

interface DocumentRequest {
  loadId: string;
  type: DocumentType;
  data?: Record<string, any>;
}

interface SignatureRequest {
  documentId: string;
  signerType: 'shipper' | 'driver' | 'receiver' | 'carrier';
  signerName: string;
  signerTitle?: string;
  signatureData: string;
  signatureMethod: 'drawn' | 'typed' | 'digital';
}

// ============================================================================
// IN-MEMORY STORE (Replace with database in production)
// ============================================================================

const documents: Map<string, any> = new Map();
const workflows: Map<string, any> = new Map();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateDocumentNumber(type: DocumentType): string {
  const prefix: Record<DocumentType, string> = {
    rate_confirmation: 'RC',
    bill_of_lading: 'BOL',
    proof_of_delivery: 'POD',
    invoice: 'INV',
    inspection_report: 'INS',
  };
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
  return `${prefix[type]}-${year}-${seq}`;
}

function generateVerificationHash(data: any): string {
  const str = JSON.stringify(data) + Date.now();
  return Buffer.from(str).toString('base64').slice(0, 32);
}

function generateQRCodeUrl(documentId: string, hash: string): string {
  return `https://verify.ivyar.org/doc/${documentId}?h=${hash}`;
}

// ============================================================================
// GET /api/freight/documents
// List documents with optional filters
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');
    const type = searchParams.get('type') as DocumentType | null;
    const status = searchParams.get('status') as DocumentStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let results = Array.from(documents.values());

    // Apply filters
    if (loadId) {
      results = results.filter(d => d.loadId === loadId);
    }
    if (type) {
      results = results.filter(d => d.type === type);
    }
    if (status) {
      results = results.filter(d => d.status === status);
    }

    // Sort by createdAt desc
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = results.length;
    results = results.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        documents: results,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Document list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list documents' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/freight/documents
// Create a new document
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: DocumentRequest = await request.json();
    const { loadId, type, data } = body;

    // Validate required fields
    if (!loadId || !type) {
      return NextResponse.json(
        { success: false, error: 'loadId and type are required' },
        { status: 400 }
      );
    }

    // Validate document type
    const validTypes: DocumentType[] = ['rate_confirmation', 'bill_of_lading', 'proof_of_delivery', 'invoice', 'inspection_report'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Generate document
    const now = new Date().toISOString();
    const documentNumber = generateDocumentNumber(type);
    const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const verificationHash = generateVerificationHash({ id, loadId, type });

    const document = {
      id,
      documentNumber,
      type,
      loadId,
      loadNumber: data?.loadNumber || `DF-${loadId}`,
      status: 'draft' as DocumentStatus,
      
      // Parties
      shipperId: data?.shipperId,
      shipperName: data?.shipperName,
      driverId: data?.driverId,
      driverName: data?.driverName,
      carrierId: data?.carrierId,
      carrierName: data?.carrierName,
      
      // Document-specific data
      ...data,
      
      // Verification
      signatures: [],
      qrCode: generateQRCodeUrl(id, verificationHash),
      verificationHash,
      
      // Timestamps
      createdAt: now,
      updatedAt: now,
    };

    // Store document
    documents.set(id, document);

    // Update workflow if exists
    const workflow = workflows.get(loadId);
    if (workflow) {
      const stepIndex = workflow.steps.findIndex((s: any) => 
        s.documentType === type && s.status === 'pending'
      );
      if (stepIndex >= 0) {
        workflow.steps[stepIndex].documentId = id;
        workflow.steps[stepIndex].status = 'in_progress';
        workflows.set(loadId, workflow);
      }
    }

    return NextResponse.json({
      success: true,
      data: { document },
    }, { status: 201 });
  } catch (error) {
    console.error('Document creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/freight/documents
// Update a document (status, add signature, etc.)
// ============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, action, data } = body;

    if (!documentId || !action) {
      return NextResponse.json(
        { success: false, error: 'documentId and action are required' },
        { status: 400 }
      );
    }

    const document = documents.get(documentId);
    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    switch (action) {
      case 'update_status':
        document.status = data.status;
        document.updatedAt = now;
        break;

      case 'add_signature':
        const signature = {
          id: `sig-${Date.now()}`,
          type: data.signerType,
          signerId: data.signerId || 'anonymous',
          signerName: data.signerName,
          signerTitle: data.signerTitle,
          signatureData: data.signatureData,
          signatureMethod: data.signatureMethod || 'typed',
          ipAddress: data.ipAddress,
          location: data.location,
          timestamp: now,
        };
        document.signatures.push(signature);
        document.updatedAt = now;
        
        // Auto-update status if all required signatures collected
        const requiredSignatures = getRequiredSignatures(document.type);
        const collectedTypes = document.signatures.map((s: any) => s.type);
        const allSigned = requiredSignatures.every((t: string) => collectedTypes.includes(t));
        if (allSigned) {
          document.status = 'signed';
          document.signedAt = now;
        } else {
          document.status = 'pending_signature';
        }
        break;

      case 'submit':
        document.status = 'submitted';
        document.submittedAt = now;
        document.updatedAt = now;
        break;

      case 'verify':
        document.status = 'verified';
        document.verifiedAt = now;
        document.verifiedBy = data.verifiedBy;
        document.updatedAt = now;
        break;

      case 'reject':
        document.status = 'rejected';
        document.rejectedAt = now;
        document.rejectionReason = data.reason;
        document.updatedAt = now;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    documents.set(documentId, document);

    return NextResponse.json({
      success: true,
      data: { document },
    });
  } catch (error) {
    console.error('Document update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER: Get required signatures by document type
// ============================================================================

function getRequiredSignatures(type: DocumentType): string[] {
  const requirements: Record<DocumentType, string[]> = {
    rate_confirmation: ['shipper', 'driver'],
    bill_of_lading: ['shipper', 'driver'],
    proof_of_delivery: ['driver', 'receiver'],
    invoice: [], // No signature required
    inspection_report: ['driver'],
  };
  return requirements[type] || [];
}
