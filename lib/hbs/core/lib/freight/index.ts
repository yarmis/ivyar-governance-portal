// lib/freight/index.ts
// IVYAR Direct Freight Module v2.0
// Document Flow Engine + Performance & Discipline System

// ============================================================================
// DOCUMENT FLOW ENGINE
// ============================================================================

export * from './documents';

// ============================================================================
// PERFORMANCE & DISCIPLINE SYSTEM
// ============================================================================

export * from './performance';

// ============================================================================
// MODULE INFO
// ============================================================================

export const FREIGHT_MODULE_INFO = {
  name: 'Direct Freight',
  version: '2.0.0',
  description: 'Broker-free logistics platform with document automation and performance tracking',
  
  features: {
    documentFlow: {
      enabled: true,
      documents: [
        'rate_confirmation',
        'bill_of_lading',
        'proof_of_delivery',
        'invoice',
        'inspection_report',
      ],
      signatures: ['electronic', 'drawn', 'typed'],
      verification: ['qr_code', 'hash'],
    },
    performance: {
      enabled: true,
      driverScoring: true,
      shipperScoring: true,
      penalties: true,
      rewards: true,
      badges: true,
      leaderboards: true,
    },
    aiRateEngine: {
      enabled: true,
      confidence: 94,
    },
    instantPay: {
      enabled: true,
      maxHours: 2,
      fee: 0,
    },
  },
  
  routes: {
    freight: '/freight',
    loadBoard: '/freight/load-board',
    documents: '/freight/documents',
    performance: '/freight/performance',
    tracking: '/freight/tracking',
    earnings: '/freight/earnings',
  },
  
  api: {
    loads: '/api/freight/loads',
    documents: '/api/freight/documents',
    performance: '/api/freight/performance',
    tracking: '/api/freight/tracking',
    payments: '/api/freight/payments',
  },
};

// ============================================================================
// QUICK SETUP
// ============================================================================

/**
 * INSTALLATION GUIDE:
 * 
 * 1. Extract files to your Next.js project:
 *    - lib/freight/documents.ts
 *    - lib/freight/performance.ts
 *    - lib/freight/index.ts
 *    - app/freight/documents/page.tsx
 *    - app/freight/performance/page.tsx
 *    - app/api/freight/documents/route.ts
 * 
 * 2. Add to navigation:
 *    - /freight/documents - Document Center
 *    - /freight/performance - Driver Performance
 * 
 * 3. Integrate with existing freight module:
 *    - Import document generators in load booking flow
 *    - Import performance tracking in load completion flow
 * 
 * 4. Configure database (production):
 *    - Replace in-memory stores with database queries
 *    - Add proper authentication middleware
 */
