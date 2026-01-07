// lib/freight/documents.ts
// IVYAR Direct Freight - Document Flow Engine v1.0
// Complete document lifecycle: Rate Confirmation → BOL → POD → Invoice

// ============================================================================
// TYPES
// ============================================================================

export type DocumentType = 
  | 'rate_confirmation' 
  | 'bill_of_lading' 
  | 'proof_of_delivery' 
  | 'invoice' 
  | 'lumper_receipt'
  | 'inspection_report'
  | 'accessorial_receipt'
  | 'customs_declaration';

export type DocumentStatus = 
  | 'draft' 
  | 'pending_signature' 
  | 'signed' 
  | 'submitted' 
  | 'verified' 
  | 'rejected' 
  | 'archived';

export type SignatureType = 'shipper' | 'driver' | 'receiver' | 'carrier' | 'inspector';

export interface DocumentMetadata {
  id: string;
  documentNumber: string;
  type: DocumentType;
  loadId: string;
  loadNumber: string;
  status: DocumentStatus;
  
  // Parties
  shipperId: string;
  shipperName: string;
  carrierId?: string;
  carrierName?: string;
  driverId?: string;
  driverName?: string;
  receiverId?: string;
  receiverName?: string;
  
  // Verification
  signatures: Signature[];
  qrCode: string;
  verificationHash: string;
  
  // Files
  fileUrl?: string;
  thumbnailUrl?: string;
  fileSize?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export interface Signature {
  id: string;
  type: SignatureType;
  signerId: string;
  signerName: string;
  signerTitle?: string;
  signatureData: string; // Base64 signature image or typed name
  signatureMethod: 'drawn' | 'typed' | 'digital';
  ipAddress?: string;
  deviceInfo?: string;
  location?: { lat: number; lng: number };
  timestamp: string;
}

// ============================================================================
// RATE CONFIRMATION
// ============================================================================

export interface RateConfirmation extends DocumentMetadata {
  type: 'rate_confirmation';
  
  // Route
  origin: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    contact: string;
    phone: string;
  };
  destination: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    contact: string;
    phone: string;
  };
  
  // Schedule
  pickupDate: string;
  pickupTimeWindow: string;
  deliveryDate: string;
  deliveryTimeWindow: string;
  
  // Cargo
  commodity: string;
  weight: number;
  pieces?: number;
  equipmentType: string;
  specialInstructions?: string;
  temperatureRequirements?: {
    min: number;
    max: number;
    unit: 'F' | 'C';
  };
  
  // Rate
  lineHaulRate: number;
  fuelSurcharge: number;
  accessorials: AccessorialCharge[];
  totalRate: number;
  currency: string;
  
  // Payment Terms
  paymentTerms: 'instant' | 'quick_pay' | 'net_15' | 'net_30';
  quickPayFee?: number;
  
  // Insurance
  cargoInsuranceRequired: number;
  liabilityInsuranceRequired: number;
  
  // Terms
  termsAndConditions: string;
  cancellationPolicy: string;
  detentionPolicy: string;
}

export interface AccessorialCharge {
  code: string;
  description: string;
  amount: number;
  quantity?: number;
  unit?: string;
}

// ============================================================================
// BILL OF LADING (BOL)
// ============================================================================

export interface BillOfLading extends DocumentMetadata {
  type: 'bill_of_lading';
  bolNumber: string;
  
  // Shipper
  shipper: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    sid?: string; // Shipper ID number
  };
  
  // Consignee
  consignee: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    cid?: string; // Consignee ID number
  };
  
  // Third Party (Bill To)
  billTo?: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  
  // Carrier
  carrier: {
    company: string;
    mcNumber: string;
    dotNumber: string;
    scac?: string; // Standard Carrier Alpha Code
    proNumber?: string;
  };
  
  // Driver
  driver: {
    name: string;
    cdlNumber: string;
    truckNumber: string;
    trailerNumber: string;
  };
  
  // Shipment Details
  shipmentDate: string;
  items: BOLItem[];
  
  // Totals
  totalPieces: number;
  totalWeight: number;
  totalCube?: number;
  freightClass?: string;
  
  // Special Instructions
  specialInstructions?: string;
  hazmatInfo?: HazmatInfo;
  
  // COD (Cash on Delivery)
  codAmount?: number;
  codPaymentType?: 'check' | 'cash' | 'certified_check';
  
  // Freight Charges
  freightCharges: 'prepaid' | 'collect' | 'third_party';
  declaredValue?: number;
  
  // Seals
  sealNumbers: string[];
  
  // Pickup confirmation
  pickupTime?: string;
  pickupPhotos?: string[];
}

export interface BOLItem {
  lineNumber: number;
  quantity: number;
  quantityUnit: 'pieces' | 'pallets' | 'cartons' | 'crates' | 'drums' | 'bags';
  description: string;
  weight: number;
  weightUnit: 'lbs' | 'kg';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  freightClass?: string;
  nmfcNumber?: string; // National Motor Freight Classification
  hazmat?: boolean;
  hazmatClass?: string;
  unNumber?: string;
}

export interface HazmatInfo {
  hazmatClass: string;
  unNumber: string;
  properShippingName: string;
  packingGroup?: 'I' | 'II' | 'III';
  emergencyContact: string;
  emergencyPhone: string;
  placard: string;
}

// ============================================================================
// PROOF OF DELIVERY (POD)
// ============================================================================

export interface ProofOfDelivery extends DocumentMetadata {
  type: 'proof_of_delivery';
  podNumber: string;
  bolReference: string;
  
  // Delivery Info
  deliveryDate: string;
  deliveryTime: string;
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  
  // Receiver
  receiverName: string;
  receiverTitle?: string;
  receiverCompany: string;
  
  // Items Delivered
  itemsDelivered: PODItem[];
  
  // Condition
  deliveryCondition: 'good' | 'damaged' | 'partial' | 'refused';
  conditionNotes?: string;
  
  // Exceptions
  exceptions: DeliveryException[];
  
  // Photos
  photos: PODPhoto[];
  
  // Timestamps
  arrivalTime: string;
  unloadStartTime?: string;
  unloadEndTime?: string;
  departureTime?: string;
  
  // Detention
  detentionMinutes?: number;
  detentionCharge?: number;
  
  // Lumper
  lumperRequired: boolean;
  lumperReceipt?: string;
  lumperAmount?: number;
}

export interface PODItem {
  bolLineNumber: number;
  description: string;
  quantityOrdered: number;
  quantityDelivered: number;
  quantityDamaged?: number;
  quantityShort?: number;
  condition: 'good' | 'damaged' | 'wet' | 'crushed' | 'other';
  notes?: string;
}

export interface DeliveryException {
  type: 'shortage' | 'overage' | 'damage' | 'refusal' | 'wrong_item' | 'other';
  description: string;
  quantity?: number;
  photos?: string[];
  reportedBy: string;
  timestamp: string;
}

export interface PODPhoto {
  id: string;
  type: 'delivery' | 'damage' | 'signature' | 'seal' | 'other';
  url: string;
  thumbnailUrl: string;
  caption?: string;
  timestamp: string;
  location?: { lat: number; lng: number };
}

// ============================================================================
// INVOICE
// ============================================================================

export interface FreightInvoice extends DocumentMetadata {
  type: 'invoice';
  invoiceNumber: string;
  
  // References
  bolNumber: string;
  podNumber: string;
  rateConfirmationNumber: string;
  purchaseOrderNumber?: string;
  
  // Billing
  billTo: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    paymentTerms: string;
  };
  
  // Remit To
  remitTo: {
    company: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    bankInfo?: {
      bankName: string;
      routingNumber: string;
      accountNumber: string;
      accountType: 'checking' | 'savings';
    };
  };
  
  // Dates
  invoiceDate: string;
  shipDate: string;
  deliveryDate: string;
  dueDate: string;
  
  // Line Items
  lineItems: InvoiceLineItem[];
  
  // Accessorials
  accessorials: AccessorialCharge[];
  
  // Totals
  subtotal: number;
  fuelSurcharge: number;
  accessorialsTotal: number;
  detentionCharges: number;
  lumperCharges: number;
  otherCharges: number;
  discount?: number;
  tax?: number;
  totalDue: number;
  currency: string;
  
  // Payment
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  amountPaid: number;
  amountDue: number;
  paymentMethod?: string;
  paymentDate?: string;
  paymentReference?: string;
  
  // Notes
  notes?: string;
  internalNotes?: string;
}

export interface InvoiceLineItem {
  lineNumber: number;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  reference?: string;
}

// ============================================================================
// DOCUMENT GENERATOR
// ============================================================================

export function generateDocumentNumber(type: DocumentType, sequence: number): string {
  const prefix: Record<DocumentType, string> = {
    rate_confirmation: 'RC',
    bill_of_lading: 'BOL',
    proof_of_delivery: 'POD',
    invoice: 'INV',
    lumper_receipt: 'LMP',
    inspection_report: 'INS',
    accessorial_receipt: 'ACC',
    customs_declaration: 'CUS',
  };
  
  const year = new Date().getFullYear();
  const seq = String(sequence).padStart(6, '0');
  return `${prefix[type]}-${year}-${seq}`;
}

export function generateQRCode(documentId: string, verificationHash: string): string {
  // In production, use actual QR code library
  return `https://verify.ivyar.org/doc/${documentId}?h=${verificationHash}`;
}

export function generateVerificationHash(document: DocumentMetadata): string {
  // In production, use proper cryptographic hashing
  const data = `${document.id}|${document.documentNumber}|${document.loadId}|${document.createdAt}`;
  return Buffer.from(data).toString('base64').slice(0, 32);
}

// ============================================================================
// RATE CONFIRMATION GENERATOR
// ============================================================================

export function generateRateConfirmation(loadData: any, terms: any): RateConfirmation {
  const now = new Date().toISOString();
  const docNumber = generateDocumentNumber('rate_confirmation', Date.now() % 1000000);
  const id = `rc-${Date.now()}`;
  const verificationHash = generateVerificationHash({ 
    id, 
    documentNumber: docNumber, 
    loadId: loadData.id,
    createdAt: now 
  } as any);
  
  return {
    id,
    documentNumber: docNumber,
    type: 'rate_confirmation',
    loadId: loadData.id,
    loadNumber: loadData.loadNumber,
    status: 'pending_signature',
    
    shipperId: loadData.shipperId,
    shipperName: loadData.shipperName,
    driverId: loadData.driverId,
    driverName: loadData.driverName,
    carrierId: loadData.carrierId,
    carrierName: loadData.carrierName,
    
    signatures: [],
    qrCode: generateQRCode(id, verificationHash),
    verificationHash,
    
    createdAt: now,
    updatedAt: now,
    
    origin: {
      company: loadData.shipperName,
      address: loadData.origin.address || '',
      city: loadData.origin.city,
      state: loadData.origin.state,
      zip: loadData.origin.zip,
      contact: loadData.shipperContact || '',
      phone: loadData.shipperPhone || '',
    },
    destination: {
      company: loadData.consigneeName || 'Consignee',
      address: loadData.destination.address || '',
      city: loadData.destination.city,
      state: loadData.destination.state,
      zip: loadData.destination.zip,
      contact: loadData.consigneeContact || '',
      phone: loadData.consigneePhone || '',
    },
    
    pickupDate: loadData.pickupDate,
    pickupTimeWindow: loadData.pickupTimeWindow,
    deliveryDate: loadData.deliveryDate,
    deliveryTimeWindow: loadData.deliveryTimeWindow,
    
    commodity: loadData.commodity,
    weight: loadData.weight,
    pieces: loadData.pieces,
    equipmentType: loadData.equipmentType,
    specialInstructions: loadData.specialInstructions,
    temperatureRequirements: loadData.temperatureRequirements,
    
    lineHaulRate: loadData.rateBreakdown?.baseRate || loadData.aiRate * 0.8,
    fuelSurcharge: loadData.rateBreakdown?.fuelSurcharge || loadData.aiRate * 0.15,
    accessorials: loadData.accessorials || [],
    totalRate: loadData.aiRate,
    currency: 'USD',
    
    paymentTerms: loadData.paymentMethod === 'instant' ? 'instant' : 'net_15',
    quickPayFee: loadData.paymentMethod === 'instant' ? 0 : 2.5,
    
    cargoInsuranceRequired: loadData.insuranceCoverage || 100000,
    liabilityInsuranceRequired: 1000000,
    
    termsAndConditions: terms?.termsAndConditions || DEFAULT_TERMS,
    cancellationPolicy: terms?.cancellationPolicy || DEFAULT_CANCELLATION,
    detentionPolicy: terms?.detentionPolicy || DEFAULT_DETENTION,
  };
}

// ============================================================================
// BILL OF LADING GENERATOR
// ============================================================================

export function generateBillOfLading(loadData: any, rateConfirmation: RateConfirmation, driverData: any): BillOfLading {
  const now = new Date().toISOString();
  const docNumber = generateDocumentNumber('bill_of_lading', Date.now() % 1000000);
  const id = `bol-${Date.now()}`;
  const verificationHash = generateVerificationHash({ 
    id, 
    documentNumber: docNumber, 
    loadId: loadData.id,
    createdAt: now 
  } as any);
  
  return {
    id,
    documentNumber: docNumber,
    bolNumber: docNumber,
    type: 'bill_of_lading',
    loadId: loadData.id,
    loadNumber: loadData.loadNumber,
    status: 'draft',
    
    shipperId: loadData.shipperId,
    shipperName: loadData.shipperName,
    driverId: driverData.id,
    driverName: driverData.name,
    carrierId: driverData.carrierId,
    carrierName: driverData.carrierName || driverData.name,
    
    signatures: [],
    qrCode: generateQRCode(id, verificationHash),
    verificationHash,
    
    createdAt: now,
    updatedAt: now,
    
    shipper: {
      company: loadData.shipperName,
      address: rateConfirmation.origin.address,
      city: rateConfirmation.origin.city,
      state: rateConfirmation.origin.state,
      zip: rateConfirmation.origin.zip,
    },
    
    consignee: {
      company: rateConfirmation.destination.company,
      address: rateConfirmation.destination.address,
      city: rateConfirmation.destination.city,
      state: rateConfirmation.destination.state,
      zip: rateConfirmation.destination.zip,
    },
    
    carrier: {
      company: driverData.carrierName || driverData.name,
      mcNumber: driverData.mcNumber || 'MC-PENDING',
      dotNumber: driverData.dotNumber || 'DOT-PENDING',
      scac: driverData.scac,
      proNumber: `PRO-${Date.now()}`,
    },
    
    driver: {
      name: driverData.name,
      cdlNumber: driverData.cdlNumber,
      truckNumber: driverData.truckNumber || 'TRK-001',
      trailerNumber: driverData.trailerNumber || 'TRL-001',
    },
    
    shipmentDate: loadData.pickupDate,
    
    items: [{
      lineNumber: 1,
      quantity: loadData.pieces || 1,
      quantityUnit: 'pallets',
      description: loadData.commodity,
      weight: loadData.weight,
      weightUnit: 'lbs',
      freightClass: loadData.freightClass || '70',
    }],
    
    totalPieces: loadData.pieces || 1,
    totalWeight: loadData.weight,
    freightClass: loadData.freightClass || '70',
    
    specialInstructions: loadData.specialInstructions,
    
    freightCharges: 'prepaid',
    declaredValue: loadData.insuranceCoverage,
    
    sealNumbers: [],
    pickupPhotos: [],
  };
}

// ============================================================================
// PROOF OF DELIVERY GENERATOR
// ============================================================================

export function generateProofOfDelivery(loadData: any, bol: BillOfLading, deliveryData: any): ProofOfDelivery {
  const now = new Date().toISOString();
  const docNumber = generateDocumentNumber('proof_of_delivery', Date.now() % 1000000);
  const id = `pod-${Date.now()}`;
  const verificationHash = generateVerificationHash({ 
    id, 
    documentNumber: docNumber, 
    loadId: loadData.id,
    createdAt: now 
  } as any);
  
  return {
    id,
    documentNumber: docNumber,
    podNumber: docNumber,
    bolReference: bol.bolNumber,
    type: 'proof_of_delivery',
    loadId: loadData.id,
    loadNumber: loadData.loadNumber,
    status: 'pending_signature',
    
    shipperId: loadData.shipperId,
    shipperName: loadData.shipperName,
    driverId: loadData.driverId,
    driverName: loadData.driverName,
    receiverId: deliveryData.receiverId,
    receiverName: deliveryData.receiverName,
    
    signatures: [],
    qrCode: generateQRCode(id, verificationHash),
    verificationHash,
    
    createdAt: now,
    updatedAt: now,
    
    deliveryDate: deliveryData.deliveryDate || new Date().toISOString().split('T')[0],
    deliveryTime: deliveryData.deliveryTime || new Date().toTimeString().slice(0, 5),
    deliveryLocation: {
      address: bol.consignee.address,
      city: bol.consignee.city,
      state: bol.consignee.state,
      zip: bol.consignee.zip,
      lat: deliveryData.location?.lat || 0,
      lng: deliveryData.location?.lng || 0,
    },
    
    receiverName: deliveryData.receiverName,
    receiverTitle: deliveryData.receiverTitle,
    receiverCompany: bol.consignee.company,
    
    itemsDelivered: bol.items.map(item => ({
      bolLineNumber: item.lineNumber,
      description: item.description,
      quantityOrdered: item.quantity,
      quantityDelivered: deliveryData.items?.[item.lineNumber - 1]?.quantityDelivered || item.quantity,
      quantityDamaged: deliveryData.items?.[item.lineNumber - 1]?.quantityDamaged || 0,
      condition: deliveryData.items?.[item.lineNumber - 1]?.condition || 'good',
    })),
    
    deliveryCondition: deliveryData.condition || 'good',
    conditionNotes: deliveryData.conditionNotes,
    
    exceptions: deliveryData.exceptions || [],
    photos: deliveryData.photos || [],
    
    arrivalTime: deliveryData.arrivalTime || now,
    unloadStartTime: deliveryData.unloadStartTime,
    unloadEndTime: deliveryData.unloadEndTime,
    departureTime: deliveryData.departureTime,
    
    detentionMinutes: deliveryData.detentionMinutes,
    detentionCharge: deliveryData.detentionMinutes ? Math.ceil(deliveryData.detentionMinutes / 15) * 25 : 0,
    
    lumperRequired: deliveryData.lumperRequired || false,
    lumperReceipt: deliveryData.lumperReceipt,
    lumperAmount: deliveryData.lumperAmount,
  };
}

// ============================================================================
// INVOICE GENERATOR
// ============================================================================

export function generateInvoice(
  loadData: any, 
  rateConfirmation: RateConfirmation, 
  pod: ProofOfDelivery,
  carrierData: any
): FreightInvoice {
  const now = new Date().toISOString();
  const docNumber = generateDocumentNumber('invoice', Date.now() % 1000000);
  const id = `inv-${Date.now()}`;
  const verificationHash = generateVerificationHash({ 
    id, 
    documentNumber: docNumber, 
    loadId: loadData.id,
    createdAt: now 
  } as any);
  
  const dueDate = new Date();
  if (rateConfirmation.paymentTerms === 'instant') {
    dueDate.setHours(dueDate.getHours() + 2);
  } else if (rateConfirmation.paymentTerms === 'quick_pay') {
    dueDate.setDate(dueDate.getDate() + 3);
  } else if (rateConfirmation.paymentTerms === 'net_15') {
    dueDate.setDate(dueDate.getDate() + 15);
  } else {
    dueDate.setDate(dueDate.getDate() + 30);
  }
  
  const accessorialsTotal = (rateConfirmation.accessorials || []).reduce((sum, a) => sum + a.amount, 0);
  const detentionCharges = pod.detentionCharge || 0;
  const lumperCharges = pod.lumperAmount || 0;
  
  const totalDue = rateConfirmation.lineHaulRate + 
                   rateConfirmation.fuelSurcharge + 
                   accessorialsTotal + 
                   detentionCharges + 
                   lumperCharges;
  
  return {
    id,
    documentNumber: docNumber,
    invoiceNumber: docNumber,
    type: 'invoice',
    loadId: loadData.id,
    loadNumber: loadData.loadNumber,
    status: 'submitted',
    
    shipperId: loadData.shipperId,
    shipperName: loadData.shipperName,
    driverId: loadData.driverId,
    driverName: loadData.driverName,
    carrierId: carrierData.id,
    carrierName: carrierData.name,
    
    signatures: [],
    qrCode: generateQRCode(id, verificationHash),
    verificationHash,
    
    createdAt: now,
    updatedAt: now,
    
    bolNumber: pod.bolReference,
    podNumber: pod.podNumber,
    rateConfirmationNumber: rateConfirmation.documentNumber,
    
    billTo: {
      company: loadData.shipperName,
      address: rateConfirmation.origin.address,
      city: rateConfirmation.origin.city,
      state: rateConfirmation.origin.state,
      zip: rateConfirmation.origin.zip,
      email: loadData.shipperEmail || 'billing@shipper.com',
      paymentTerms: rateConfirmation.paymentTerms,
    },
    
    remitTo: {
      company: carrierData.name,
      address: carrierData.address || '',
      city: carrierData.city || '',
      state: carrierData.state || '',
      zip: carrierData.zip || '',
      bankInfo: carrierData.bankInfo,
    },
    
    invoiceDate: now.split('T')[0],
    shipDate: loadData.pickupDate,
    deliveryDate: pod.deliveryDate,
    dueDate: dueDate.toISOString().split('T')[0],
    
    lineItems: [
      {
        lineNumber: 1,
        description: `Line Haul: ${rateConfirmation.origin.city}, ${rateConfirmation.origin.state} → ${rateConfirmation.destination.city}, ${rateConfirmation.destination.state}`,
        quantity: 1,
        unit: 'load',
        rate: rateConfirmation.lineHaulRate,
        amount: rateConfirmation.lineHaulRate,
        reference: loadData.loadNumber,
      },
    ],
    
    accessorials: rateConfirmation.accessorials || [],
    
    subtotal: rateConfirmation.lineHaulRate,
    fuelSurcharge: rateConfirmation.fuelSurcharge,
    accessorialsTotal,
    detentionCharges,
    lumperCharges,
    otherCharges: 0,
    totalDue,
    currency: 'USD',
    
    paymentStatus: 'pending',
    amountPaid: 0,
    amountDue: totalDue,
  };
}

// ============================================================================
// DOCUMENT WORKFLOW
// ============================================================================

export interface DocumentWorkflow {
  loadId: string;
  loadNumber: string;
  status: 'pending' | 'in_progress' | 'completed' | 'disputed';
  
  rateConfirmation?: RateConfirmation;
  billOfLading?: BillOfLading;
  proofOfDelivery?: ProofOfDelivery;
  invoice?: FreightInvoice;
  
  currentStep: 'rate_confirmation' | 'pickup' | 'transit' | 'delivery' | 'invoicing' | 'payment' | 'complete';
  
  timeline: WorkflowEvent[];
}

export interface WorkflowEvent {
  id: string;
  event: string;
  documentType?: DocumentType;
  documentId?: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  details?: string;
}

export function createDocumentWorkflow(loadData: any): DocumentWorkflow {
  return {
    loadId: loadData.id,
    loadNumber: loadData.loadNumber,
    status: 'pending',
    currentStep: 'rate_confirmation',
    timeline: [
      {
        id: `evt-${Date.now()}`,
        event: 'workflow_created',
        actor: 'system',
        actorRole: 'system',
        timestamp: new Date().toISOString(),
        details: 'Document workflow initiated',
      },
    ],
  };
}

export function advanceWorkflow(workflow: DocumentWorkflow, event: string, actor: string, actorRole: string): DocumentWorkflow {
  const nextStep: Record<string, DocumentWorkflow['currentStep']> = {
    'rate_confirmation_signed': 'pickup',
    'bol_signed': 'transit',
    'arrived_at_delivery': 'delivery',
    'pod_signed': 'invoicing',
    'invoice_generated': 'payment',
    'payment_received': 'complete',
  };
  
  workflow.timeline.push({
    id: `evt-${Date.now()}`,
    event,
    actor,
    actorRole,
    timestamp: new Date().toISOString(),
  });
  
  if (nextStep[event]) {
    workflow.currentStep = nextStep[event];
  }
  
  if (workflow.currentStep === 'complete') {
    workflow.status = 'completed';
  } else if (workflow.currentStep !== 'rate_confirmation') {
    workflow.status = 'in_progress';
  }
  
  return workflow;
}

// ============================================================================
// DEFAULT TERMS
// ============================================================================

const DEFAULT_TERMS = `
1. CARRIER LIABILITY: Carrier is liable for cargo loss or damage from pickup to delivery per 49 USC §14706.
2. INSURANCE: Carrier must maintain cargo insurance as specified. Proof required upon request.
3. EQUIPMENT: Carrier warrants equipment is clean, safe, and suitable for the commodity.
4. LOADING/UNLOADING: Shipper responsible for loading; consignee responsible for unloading unless otherwise specified.
5. DOCUMENTATION: All documents must be completed accurately and returned within 48 hours of delivery.
6. COMPLIANCE: Carrier must comply with all federal, state, and local regulations.
7. INDEMNIFICATION: Carrier indemnifies shipper against claims arising from carrier's negligence.
`.trim();

const DEFAULT_CANCELLATION = `
CANCELLATION POLICY:
- More than 24 hours before pickup: No charge
- 12-24 hours before pickup: 25% of total rate
- Less than 12 hours before pickup: 50% of total rate
- After truck dispatched: 100% of total rate (TONU)
`.trim();

const DEFAULT_DETENTION = `
DETENTION POLICY:
- Free time: 2 hours at pickup, 2 hours at delivery
- Detention rate: $25 per 15 minutes after free time
- Maximum detention: $400 per stop
- Documentation required for all detention claims
`.trim();

// ============================================================================
// EXPORTS
// ============================================================================

export {
  DEFAULT_TERMS,
  DEFAULT_CANCELLATION,
  DEFAULT_DETENTION,
};
