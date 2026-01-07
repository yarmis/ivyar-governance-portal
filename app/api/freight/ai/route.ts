// app/api/freight/ai/route.ts
// IVYAR Direct Freight - AI Assistant API v1.0

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

type FreightAIRole = 'driver' | 'shipper' | 'dispatcher' | 'carrier' | 'admin';
type FreightAIModule = 'loads' | 'documents' | 'payments' | 'tracking' | 'compliance' | 'performance' | 'rates' | 'general';

interface AIRequest {
  role: FreightAIRole;
  module?: FreightAIModule;
  question: string;
  context?: {
    loadId?: string;
    loadNumber?: string;
    route?: string;
    currentLocation?: string;
    equipmentType?: string;
    userId?: string;
    locale?: string;
  };
  sessionId?: string;
}

// ============================================================================
// CONFIGURATIONS
// ============================================================================

const VALID_ROLES: FreightAIRole[] = ['driver', 'shipper', 'dispatcher', 'carrier', 'admin'];
const VALID_MODULES: FreightAIModule[] = ['loads', 'documents', 'payments', 'tracking', 'compliance', 'performance', 'rates', 'general'];

const ROLE_SYSTEM_PROMPTS: Record<FreightAIRole, string> = {
  driver: 'You are a helpful freight assistant for truck drivers. Help with loads, HOS compliance, documents, and earnings.',
  shipper: 'You are a freight assistant for shippers. Help with load posting, carrier selection, tracking, and payments.',
  dispatcher: 'You are a freight assistant for dispatchers. Help with load assignment, fleet coordination, and operations.',
  carrier: 'You are a freight assistant for carriers. Help with fleet management, compliance, and business operations.',
  admin: 'You are a freight platform administrator assistant. Provide comprehensive platform support.',
};

const DISCLAIMERS: Record<FreightAIRole, string> = {
  driver: 'This is AI-generated guidance. For legal advice, consult a transportation attorney. Always follow FMCSA/DOT regulations.',
  shipper: 'Rate estimates are AI-calculated and may vary. For binding quotes, create a load posting.',
  dispatcher: 'Verify driver availability and HOS compliance before assignments.',
  carrier: 'For legal, tax, or insurance advice, consult qualified professionals.',
  admin: 'Administrative AI assistance. Verify critical decisions through proper channels.',
};

const MODULE_KEYWORDS: Record<FreightAIModule, string[]> = {
  loads: ['load', 'booking', 'freight', 'shipment', 'haul', 'route', 'lane', 'pickup', 'delivery'],
  documents: ['document', 'bol', 'pod', 'invoice', 'paperwork', 'signature', 'receipt', 'lumper'],
  payments: ['pay', 'payment', 'rate', 'money', 'earning', 'invoice', 'factoring', 'quick pay'],
  tracking: ['track', 'location', 'eta', 'status', 'where', 'arrival', 'delay'],
  compliance: ['compliance', 'regulation', 'hos', 'hours', 'dot', 'fmcsa', 'eld', 'log', 'inspection', 'csa'],
  performance: ['score', 'rating', 'performance', 'review', 'badge', 'penalty', 'reward', 'rank'],
  rates: ['rate', 'price', 'cost', 'market', 'per mile', 'fuel', 'surcharge', 'accessorial'],
  general: [],
};

// ============================================================================
// IN-MEMORY STORES (Replace with Redis/Database in production)
// ============================================================================

const sessions: Map<string, { messages: any[]; role: FreightAIRole; createdAt: string }> = new Map();
const rateLimits: Map<string, { count: number; resetAt: number }> = new Map();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function detectModule(question: string): FreightAIModule {
  const lowerQuestion = question.toLowerCase();
  
  for (const [module, keywords] of Object.entries(MODULE_KEYWORDS)) {
    if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return module as FreightAIModule;
    }
  }
  
  return 'general';
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(userId);
  
  if (!limit || limit.resetAt < now) {
    rateLimits.set(userId, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 20) { // 20 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

function sanitizeInput(input: string): string {
  // Remove potential prompt injection patterns
  const prohibited = [
    /ignore\s*(all\s*)?(previous|above|prior)\s*instructions?/i,
    /disregard\s*(all\s*)?(previous|above|prior)/i,
    /you\s*are\s*now\s*(in\s*)?(a\s*)?new\s*mode/i,
    /pretend\s*(you\s*are|to\s*be)/i,
    /act\s*as\s*(if|a|an)/i,
    /jailbreak/i,
    /DAN\s*mode/i,
  ];
  
  let sanitized = input.slice(0, 2000); // Max 2000 chars
  
  for (const pattern of prohibited) {
    if (pattern.test(sanitized)) {
      return '[Potentially harmful input detected. Please rephrase your question.]';
    }
  }
  
  return sanitized;
}

function generateMockResponse(role: FreightAIRole, module: FreightAIModule, question: string): {
  answer: string;
  tags: string[];
  suggestedActions: any[];
} {
  const lowerQuestion = question.toLowerCase();
  
  // HOS Questions
  if (lowerQuestion.includes('hos') || lowerQuestion.includes('hours') || lowerQuestion.includes('drive time')) {
    return {
      answer: `**Hours of Service (HOS) Summary:**

📋 **11-Hour Driving Limit**
Drive max 11 hours after 10 consecutive hours off duty.

⏰ **14-Hour Limit**
Cannot drive after 14 hours on-duty (even if you didn't drive all 14).

☕ **30-Minute Break**
Required break after 8 cumulative hours of driving.

📅 **60/70-Hour Limit**
Cannot drive after 60/70 hours on-duty in 7/8 consecutive days.

**Reference:** 49 CFR § 395.3

Would you like me to calculate your remaining drive time?`,
      tags: ['compliance', 'hos', 'regulations'],
      suggestedActions: [
        { id: 'calc-hos', label: 'Calculate Remaining Time', icon: '⏱️' },
        { id: 'break-planner', label: 'Plan Break', icon: '☕' },
      ],
    };
  }
  
  // Rate Questions
  if (lowerQuestion.includes('rate') || lowerQuestion.includes('pay') || lowerQuestion.includes('per mile')) {
    return {
      answer: `**Rate Information:**

📏 **Current Market Rates (Average):**
• Dry Van: $2.50-3.50/mile
• Reefer: $3.00-4.00/mile
• Flatbed: $3.00-4.50/mile

⛽ **Fuel Surcharge:**
Currently ~$0.45-0.55/mile based on DOE diesel index.

💰 **Your Advantage with Direct Freight:**
No broker cut = You keep 100% of the rate!
Traditional brokers take 15-30%.

Would you like me to calculate a specific route?`,
      tags: ['rates', 'earnings', 'market'],
      suggestedActions: [
        { id: 'calc-rate', label: 'Calculate Route Rate', icon: '📊' },
        { id: 'view-market', label: 'View Market Trends', icon: '📈' },
      ],
    };
  }
  
  // Document Questions
  if (lowerQuestion.includes('document') || lowerQuestion.includes('bol') || lowerQuestion.includes('pod')) {
    return {
      answer: `**Document Workflow:**

📋 **Rate Confirmation** - Auto-generated at booking
📦 **Bill of Lading (BOL)** - Created at pickup, requires signatures
📸 **Proof of Delivery (POD)** - Complete at delivery with photos
💰 **Invoice** - Auto-generated when POD verified

**For Instant Pay:** Upload POD within 2 hours of delivery!

**Pro Tips:**
• Always photo cargo condition and seals
• Get receiver signature on POD
• Note any exceptions immediately`,
      tags: ['documents', 'bol', 'pod'],
      suggestedActions: [
        { id: 'upload-doc', label: 'Upload Document', icon: '📤' },
        { id: 'view-docs', label: 'View Documents', icon: '📁' },
      ],
    };
  }
  
  // Load Questions
  if (lowerQuestion.includes('load') || lowerQuestion.includes('freight') || lowerQuestion.includes('find')) {
    return {
      answer: `**Finding Loads:**

🔍 **Tips for Best Loads:**
• Check during peak hours (7-10 AM, 2-5 PM)
• Set lane alerts for preferred routes
• Higher-rated shippers = better facilities
• Calculate deadhead in rate decisions

📊 **Current Hot Lanes:**
• CA → AZ: High volume, good rates
• TX → FL: Strong demand
• IL → GA: Consistent freight

Would you like me to search available loads?`,
      tags: ['loads', 'booking', 'search'],
      suggestedActions: [
        { id: 'search', label: 'Search Loads', icon: '🔍' },
        { id: 'alerts', label: 'Set Lane Alerts', icon: '🔔' },
      ],
    };
  }
  
  // Performance Questions
  if (lowerQuestion.includes('score') || lowerQuestion.includes('rating') || lowerQuestion.includes('performance')) {
    return {
      answer: `**Performance Score Breakdown:**

Your score is calculated from 6 factors:

📍 **On-Time Pickup (20%)**
✅ **On-Time Delivery (25%)**
💬 **Communication (15%)**
📄 **Documentation (15%)**
🛡️ **Safety Record (20%)**
⭐ **Customer Rating (5%)**

**Improve Your Score:**
• Maintain on-time streak
• Upload POD photos promptly
• Respond to messages within 30 minutes`,
      tags: ['performance', 'ratings', 'scores'],
      suggestedActions: [
        { id: 'view-score', label: 'View My Score', icon: '📊' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
      ],
    };
  }
  
  // Default response
  return {
    answer: `I'm here to help with your freight-related questions!

**I can assist with:**
• 📦 Finding and booking loads
• 📄 Document management (BOL, POD)
• 💰 Rates and payments
• 📍 Load tracking
• ⏱️ HOS and ELD compliance
• 📊 Performance scores

What would you like help with?`,
    tags: ['general', 'help'],
    suggestedActions: [
      { id: 'loads', label: 'Find Loads', icon: '🔍' },
      { id: 'hos', label: 'HOS Help', icon: '⏱️' },
      { id: 'docs', label: 'Documents', icon: '📄' },
    ],
  };
}

// ============================================================================
// POST /api/freight/ai
// Handle AI chat requests
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { role, module, question, context, sessionId } = body;
    
    // Validate required fields
    if (!role || !question) {
      return NextResponse.json(
        { success: false, error: 'role and question are required' },
        { status: 400 }
      );
    }
    
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Rate limiting
    const userId = context?.userId || 'anonymous';
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait before sending more messages.' },
        { status: 429 }
      );
    }
    
    // Sanitize input
    const sanitizedQuestion = sanitizeInput(question);
    if (sanitizedQuestion.includes('[Potentially harmful')) {
      return NextResponse.json(
        { success: false, error: sanitizedQuestion },
        { status: 400 }
      );
    }
    
    // Detect or use provided module
    const detectedModule = module || detectModule(sanitizedQuestion);
    
    // Generate session ID
    const currentSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    // Get or create session
    let session = sessions.get(currentSessionId);
    if (!session) {
      session = { messages: [], role, createdAt: new Date().toISOString() };
      sessions.set(currentSessionId, session);
    }
    
    // Add user message to session
    session.messages.push({
      role: 'user',
      content: sanitizedQuestion,
      timestamp: new Date().toISOString(),
    });
    
    // Generate response
    const { answer, tags, suggestedActions } = generateMockResponse(role, detectedModule, sanitizedQuestion);
    
    // Add assistant message to session
    session.messages.push({
      role: 'assistant',
      content: answer,
      timestamp: new Date().toISOString(),
    });
    
    // Keep session size manageable
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }
    
    const interactionId = `freight-ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    return NextResponse.json({
      success: true,
      data: {
        interactionId,
        sessionId: currentSessionId,
        answer,
        role,
        module: detectedModule,
        tags,
        suggestedActions,
        disclaimer: DISCLAIMERS[role],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Freight AI error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/freight/ai
// Get AI configuration
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      roles: VALID_ROLES.map(role => ({
        id: role,
        name: role.charAt(0).toUpperCase() + role.slice(1),
        systemPrompt: ROLE_SYSTEM_PROMPTS[role],
        disclaimer: DISCLAIMERS[role],
      })),
      modules: VALID_MODULES.map(module => ({
        id: module,
        keywords: MODULE_KEYWORDS[module],
      })),
      limits: {
        maxQuestionLength: 2000,
        rateLimitPerMinute: 20,
        maxSessionMessages: 20,
      },
    },
  });
}
