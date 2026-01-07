// lib/freight/ai-assistant.ts
// IVYAR Direct Freight - AI Assistant Engine v1.0
// Multi-role assistant for drivers, shippers, dispatchers, and carriers

// ============================================================================
// TYPES
// ============================================================================

export type FreightAIRole = 'driver' | 'shipper' | 'dispatcher' | 'carrier' | 'admin';
export type FreightAIModule = 'loads' | 'documents' | 'payments' | 'tracking' | 'compliance' | 'performance' | 'rates' | 'general';

export interface FreightAIRequest {
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

export interface FreightAIResponse {
  success: boolean;
  interactionId: string;
  sessionId: string;
  answer: string;
  role: FreightAIRole;
  module: FreightAIModule;
  tags: string[];
  suggestedActions?: SuggestedAction[];
  relatedDocs?: RelatedDocument[];
  rateInfo?: RateInfo;
  complianceInfo?: ComplianceInfo;
  disclaimer: string;
  timestamp: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  action: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RelatedDocument {
  type: string;
  title: string;
  url?: string;
}

export interface RateInfo {
  estimatedRate?: number;
  ratePerMile?: number;
  marketComparison?: string;
  confidence?: number;
}

export interface ComplianceInfo {
  regulation: string;
  requirement: string;
  deadline?: string;
  penalty?: string;
}

// ============================================================================
// ROLE CONFIGURATIONS
// ============================================================================

export const FREIGHT_AI_ROLES: Record<FreightAIRole, {
  name: string;
  icon: string;
  description: string;
  modules: FreightAIModule[];
  permissions: string[];
  systemPrompt: string;
}> = {
  driver: {
    name: 'Driver',
    icon: '🚛',
    description: 'Load booking, documents, earnings, HOS, and compliance support',
    modules: ['loads', 'documents', 'payments', 'tracking', 'compliance', 'performance', 'general'],
    permissions: [
      'view_available_loads',
      'book_loads',
      'update_load_status',
      'upload_documents',
      'view_earnings',
      'view_performance',
      'ask_compliance_questions',
    ],
    systemPrompt: `You are the IVYAR Freight Assistant for DRIVERS. Your purpose is to help owner-operators and company drivers with:
- Finding and booking loads
- Understanding rates and earnings
- Document management (BOL, POD)
- Hours of Service (HOS) and ELD compliance
- FMCSA/DOT regulations
- Performance tracking and rewards

ALWAYS be practical, driver-friendly, and time-conscious. Drivers are often on the road with limited time.
NEVER provide legal advice. For legal questions, recommend consulting a transportation attorney.
NEVER encourage unsafe driving or HOS violations.
Reference specific regulations when applicable (e.g., 49 CFR Part 395 for HOS).`,
  },
  
  shipper: {
    name: 'Shipper',
    icon: '🏭',
    description: 'Load posting, carrier selection, tracking, and payment support',
    modules: ['loads', 'documents', 'payments', 'tracking', 'rates', 'general'],
    permissions: [
      'post_loads',
      'view_carriers',
      'track_shipments',
      'manage_payments',
      'view_analytics',
      'rate_drivers',
    ],
    systemPrompt: `You are the IVYAR Freight Assistant for SHIPPERS. Your purpose is to help shippers and logistics managers with:
- Posting loads and finding carriers
- Understanding fair market rates
- Tracking shipments in real-time
- Managing documents and payments
- Carrier vetting and performance

ALWAYS focus on efficiency, cost savings, and reliability.
Explain how Direct Freight's broker-free model saves 15-30% vs traditional brokers.
NEVER share specific carrier financial information.
NEVER provide legal advice about liability or claims.`,
  },
  
  dispatcher: {
    name: 'Dispatcher',
    icon: '📡',
    description: 'Fleet coordination, load assignment, and operations support',
    modules: ['loads', 'tracking', 'compliance', 'performance', 'general'],
    permissions: [
      'view_all_loads',
      'assign_loads',
      'track_fleet',
      'monitor_hos',
      'communicate_drivers',
      'handle_exceptions',
    ],
    systemPrompt: `You are the IVYAR Freight Assistant for DISPATCHERS. Your purpose is to help dispatchers with:
- Load assignment and optimization
- Fleet tracking and coordination
- Driver communication
- HOS monitoring and planning
- Exception handling and problem resolution
- Performance monitoring

ALWAYS prioritize safety and compliance.
Provide specific, actionable recommendations.
NEVER encourage HOS violations or unsafe practices.
Help with route optimization and ETA calculations.`,
  },
  
  carrier: {
    name: 'Carrier',
    icon: '🚚',
    description: 'Fleet management, compliance, and business operations support',
    modules: ['loads', 'documents', 'payments', 'compliance', 'performance', 'rates', 'general'],
    permissions: [
      'manage_fleet',
      'manage_drivers',
      'view_all_loads',
      'manage_compliance',
      'view_financials',
      'manage_insurance',
    ],
    systemPrompt: `You are the IVYAR Freight Assistant for CARRIERS and fleet operators. Your purpose is to help with:
- Fleet management and driver oversight
- Compliance (FMCSA, DOT, insurance)
- Business operations and profitability
- Load selection and rate optimization
- Document management and auditing
- Performance analytics

ALWAYS maintain a business-focused perspective.
Provide insights on profitability and efficiency.
NEVER provide legal or tax advice - recommend professional consultation.
Help with compliance deadlines and requirements.`,
  },
  
  admin: {
    name: 'Admin',
    icon: '⚙️',
    description: 'Platform administration and support',
    modules: ['loads', 'documents', 'payments', 'tracking', 'compliance', 'performance', 'rates', 'general'],
    permissions: ['full_access'],
    systemPrompt: `You are the IVYAR Freight Platform Administrator Assistant. You have full knowledge of:
- Platform operations and features
- User management
- Dispute resolution
- Compliance monitoring
- System analytics

Provide comprehensive, accurate information.
Maintain neutrality in disputes.
Follow platform policies strictly.`,
  },
};

// ============================================================================
// MODULE CONFIGURATIONS
// ============================================================================

export const FREIGHT_AI_MODULES: Record<FreightAIModule, {
  name: string;
  icon: string;
  description: string;
  keywords: string[];
}> = {
  loads: {
    name: 'Loads & Booking',
    icon: '📦',
    description: 'Finding, posting, and booking loads',
    keywords: ['load', 'booking', 'freight', 'shipment', 'haul', 'route', 'lane', 'pickup', 'delivery'],
  },
  documents: {
    name: 'Documents',
    icon: '📄',
    description: 'BOL, POD, invoices, and paperwork',
    keywords: ['document', 'bol', 'pod', 'invoice', 'paperwork', 'signature', 'receipt', 'lumper'],
  },
  payments: {
    name: 'Payments & Earnings',
    icon: '💰',
    description: 'Rates, payments, and financial questions',
    keywords: ['pay', 'payment', 'rate', 'money', 'earning', 'invoice', 'factoring', 'quick pay'],
  },
  tracking: {
    name: 'Tracking & ETA',
    icon: '📍',
    description: 'Load tracking and delivery status',
    keywords: ['track', 'location', 'eta', 'status', 'where', 'arrival', 'delay'],
  },
  compliance: {
    name: 'Compliance & Regulations',
    icon: '📋',
    description: 'FMCSA, DOT, HOS, and legal requirements',
    keywords: ['compliance', 'regulation', 'hos', 'hours', 'dot', 'fmcsa', 'eld', 'log', 'inspection', 'csa'],
  },
  performance: {
    name: 'Performance & Ratings',
    icon: '📊',
    description: 'Scores, ratings, and performance metrics',
    keywords: ['score', 'rating', 'performance', 'review', 'badge', 'penalty', 'reward', 'rank'],
  },
  rates: {
    name: 'Rate Intelligence',
    icon: '📈',
    description: 'Market rates, pricing, and rate calculations',
    keywords: ['rate', 'price', 'cost', 'market', 'per mile', 'fuel', 'surcharge', 'accessorial'],
  },
  general: {
    name: 'General',
    icon: '💬',
    description: 'General questions and support',
    keywords: [],
  },
};

// ============================================================================
// QUICK ACTIONS
// ============================================================================

export const FREIGHT_QUICK_ACTIONS: Record<FreightAIRole, SuggestedAction[]> = {
  driver: [
    { id: 'find-loads', label: 'Find Loads Near Me', action: 'find_loads_nearby', icon: '🔍', priority: 'high' },
    { id: 'check-hos', label: 'Check My HOS', action: 'check_hos_status', icon: '⏱️', priority: 'high' },
    { id: 'upload-pod', label: 'Upload POD', action: 'upload_pod', icon: '📸', priority: 'medium' },
    { id: 'view-earnings', label: 'View Earnings', action: 'view_earnings', icon: '💰', priority: 'medium' },
    { id: 'report-issue', label: 'Report Issue', action: 'report_issue', icon: '⚠️', priority: 'low' },
  ],
  shipper: [
    { id: 'post-load', label: 'Post New Load', action: 'create_load', icon: '📦', priority: 'high' },
    { id: 'track-shipment', label: 'Track Shipment', action: 'track_load', icon: '📍', priority: 'high' },
    { id: 'get-quote', label: 'Get Rate Quote', action: 'calculate_rate', icon: '💵', priority: 'medium' },
    { id: 'find-carriers', label: 'Find Carriers', action: 'search_carriers', icon: '🚛', priority: 'medium' },
    { id: 'view-invoices', label: 'View Invoices', action: 'view_invoices', icon: '📄', priority: 'low' },
  ],
  dispatcher: [
    { id: 'view-fleet', label: 'View Fleet Map', action: 'open_fleet_map', icon: '🗺️', priority: 'high' },
    { id: 'assign-load', label: 'Assign Load', action: 'assign_load', icon: '📋', priority: 'high' },
    { id: 'check-hos-all', label: 'Fleet HOS Status', action: 'check_fleet_hos', icon: '⏱️', priority: 'high' },
    { id: 'handle-delay', label: 'Report Delay', action: 'report_delay', icon: '🚨', priority: 'medium' },
    { id: 'contact-driver', label: 'Contact Driver', action: 'open_messaging', icon: '💬', priority: 'medium' },
  ],
  carrier: [
    { id: 'fleet-overview', label: 'Fleet Overview', action: 'view_fleet_dashboard', icon: '📊', priority: 'high' },
    { id: 'compliance-check', label: 'Compliance Status', action: 'view_compliance', icon: '✅', priority: 'high' },
    { id: 'financials', label: 'View Financials', action: 'view_financials', icon: '💰', priority: 'medium' },
    { id: 'add-driver', label: 'Add Driver', action: 'add_driver', icon: '👤', priority: 'medium' },
    { id: 'insurance', label: 'Insurance Status', action: 'view_insurance', icon: '🛡️', priority: 'low' },
  ],
  admin: [
    { id: 'platform-health', label: 'Platform Health', action: 'view_health', icon: '🏥', priority: 'high' },
    { id: 'disputes', label: 'Active Disputes', action: 'view_disputes', icon: '⚖️', priority: 'high' },
    { id: 'users', label: 'User Management', action: 'manage_users', icon: '👥', priority: 'medium' },
    { id: 'analytics', label: 'Analytics', action: 'view_analytics', icon: '📈', priority: 'medium' },
    { id: 'settings', label: 'Settings', action: 'open_settings', icon: '⚙️', priority: 'low' },
  ],
};

// ============================================================================
// DISCLAIMERS
// ============================================================================

export const FREIGHT_DISCLAIMERS: Record<FreightAIRole, string> = {
  driver: '⚠️ This is AI-generated guidance. For legal advice, consult a transportation attorney. Always follow FMCSA/DOT regulations and prioritize safety.',
  shipper: '⚠️ Rate estimates are AI-calculated and may vary. For binding quotes, create a load posting. Not legal or financial advice.',
  dispatcher: '⚠️ AI recommendations should be verified. Always confirm driver availability and HOS compliance before load assignment.',
  carrier: '⚠️ AI analysis for informational purposes. For legal, tax, or insurance advice, consult qualified professionals.',
  admin: '⚠️ Administrative AI assistance. Verify critical decisions through proper channels.',
};

// ============================================================================
// COMPLIANCE DATABASE
// ============================================================================

export const COMPLIANCE_KNOWLEDGE: Record<string, {
  regulation: string;
  title: string;
  summary: string;
  requirements: string[];
  penalties?: string;
  links?: string[];
}> = {
  hos_drive_time: {
    regulation: '49 CFR § 395.3',
    title: 'Maximum Driving Time',
    summary: 'Property-carrying drivers may drive maximum 11 hours after 10 consecutive hours off duty.',
    requirements: [
      '11 hours maximum driving time',
      '10 consecutive hours off duty required before driving',
      '14-hour on-duty window limit',
      'Cannot drive after 60/70 hours on-duty in 7/8 days',
    ],
    penalties: 'Violations can result in fines up to $16,000 and out-of-service orders.',
  },
  hos_break: {
    regulation: '49 CFR § 395.3(a)(3)(ii)',
    title: '30-Minute Break Requirement',
    summary: 'Drivers must take a 30-minute break after 8 cumulative hours of driving.',
    requirements: [
      '30-minute break required',
      'Must be taken before 8 hours of driving',
      'Can be on-duty not driving or off-duty',
      'Sleeper berth time counts',
    ],
    penalties: 'Failure to take required break can result in driver being placed out of of-service.',
  },
  eld_mandate: {
    regulation: '49 CFR Part 395',
    title: 'ELD Mandate',
    summary: 'Most commercial drivers must use Electronic Logging Devices (ELDs) to record HOS.',
    requirements: [
      'ELD must be registered and certified',
      'Driver must have ELD user manual',
      'Must transfer data to inspectors when requested',
      'Paper logs allowed for 8 days if ELD malfunctions',
    ],
    penalties: 'Operating without ELD when required: $16,000+ fine, out-of-service order.',
  },
  cdl_requirements: {
    regulation: '49 CFR Part 383',
    title: 'CDL Requirements',
    summary: 'Commercial Driver License requirements for operating commercial motor vehicles.',
    requirements: [
      'Valid CDL with appropriate class (A, B, or C)',
      'Proper endorsements (H, N, P, S, T, X)',
      'Medical certificate (DOT physical)',
      'Clean driving record',
    ],
    penalties: 'Operating without valid CDL: Criminal offense, fines, imprisonment possible.',
  },
  cargo_securement: {
    regulation: '49 CFR Part 393',
    title: 'Cargo Securement',
    summary: 'Requirements for securing cargo on commercial motor vehicles.',
    requirements: [
      'Cargo must be immobilized or secured',
      'Minimum tie-downs based on cargo length',
      'Working load limit requirements',
      'Specific rules for different cargo types',
    ],
    penalties: 'Improper securement can result in out-of-service and fines up to $16,000.',
  },
  insurance_minimums: {
    regulation: '49 CFR Part 387',
    title: 'Insurance Requirements',
    summary: 'Minimum insurance coverage for motor carriers.',
    requirements: [
      'General freight: $750,000 liability minimum',
      'Household goods: $750,000 liability minimum',
      'Hazmat: $1,000,000 - $5,000,000 depending on cargo',
      'Cargo insurance typically $100,000+',
    ],
    penalties: 'Operating without insurance: Operating authority revocation, fines.',
  },
};

// ============================================================================
// RESPONSE GENERATOR
// ============================================================================

export function detectModule(question: string): FreightAIModule {
  const lowerQuestion = question.toLowerCase();
  
  for (const [module, config] of Object.entries(FREIGHT_AI_MODULES)) {
    if (config.keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return module as FreightAIModule;
    }
  }
  
  return 'general';
}

export function generateFreightAIResponse(request: FreightAIRequest): FreightAIResponse {
  const roleConfig = FREIGHT_AI_ROLES[request.role];
  const module = request.module || detectModule(request.question);
  const moduleConfig = FREIGHT_AI_MODULES[module];
  
  const interactionId = `freight-ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sessionId = request.sessionId || `session-${Date.now()}`;
  
  // Generate contextual response
  const { answer, tags, suggestedActions, relatedDocs, rateInfo, complianceInfo } = 
    generateContextualResponse(request.role, module, request.question, request.context);
  
  return {
    success: true,
    interactionId,
    sessionId,
    answer,
    role: request.role,
    module,
    tags,
    suggestedActions,
    relatedDocs,
    rateInfo,
    complianceInfo,
    disclaimer: FREIGHT_DISCLAIMERS[request.role],
    timestamp: new Date().toISOString(),
  };
}

function generateContextualResponse(
  role: FreightAIRole,
  module: FreightAIModule,
  question: string,
  context?: FreightAIRequest['context']
): {
  answer: string;
  tags: string[];
  suggestedActions?: SuggestedAction[];
  relatedDocs?: RelatedDocument[];
  rateInfo?: RateInfo;
  complianceInfo?: ComplianceInfo;
} {
  const lowerQuestion = question.toLowerCase();
  
  // HOS / Hours of Service questions
  if (lowerQuestion.includes('hos') || lowerQuestion.includes('hours') || lowerQuestion.includes('drive time')) {
    const hosInfo = COMPLIANCE_KNOWLEDGE['hos_drive_time'];
    return {
      answer: `**Hours of Service (HOS) Rules:**\n\n${hosInfo.summary}\n\n**Key Requirements:**\n${hosInfo.requirements.map(r => `• ${r}`).join('\n')}\n\n**Reference:** ${hosInfo.regulation}\n\nRemember to take your required 30-minute break before 8 hours of driving time. Would you like me to calculate your remaining drive time?`,
      tags: ['compliance', 'hos', 'regulations'],
      suggestedActions: [
        { id: 'check-hos', label: 'Check My HOS', action: 'check_hos_status', icon: '⏱️', priority: 'high' },
        { id: 'plan-break', label: 'Plan Break', action: 'plan_break', icon: '☕', priority: 'medium' },
      ],
      complianceInfo: {
        regulation: hosInfo.regulation,
        requirement: hosInfo.summary,
        penalty: hosInfo.penalties,
      },
    };
  }
  
  // Rate / Payment questions
  if (lowerQuestion.includes('rate') || lowerQuestion.includes('pay') || lowerQuestion.includes('per mile') || lowerQuestion.includes('price')) {
    const routeInfo = context?.route || 'your route';
    return {
      answer: `**Rate Information:**\n\nDirect Freight uses AI to calculate fair market rates. Key factors:\n\n• **Distance & Lane:** High-volume lanes typically have better rates\n• **Equipment Type:** Reefer and flatbed command premiums\n• **Timing:** Urgent/expedited loads pay more\n• **Fuel Surcharge:** Automatically calculated based on current diesel prices\n\n**Your Savings:** By using Direct Freight instead of brokers, you keep 100% of the rate. Traditional brokers take 15-30%!\n\nWould you like me to calculate a rate estimate for ${routeInfo}?`,
      tags: ['rates', 'payments', 'earnings'],
      suggestedActions: [
        { id: 'calc-rate', label: 'Calculate Rate', action: 'calculate_rate', icon: '📊', priority: 'high' },
        { id: 'view-market', label: 'View Market Rates', action: 'view_market_rates', icon: '📈', priority: 'medium' },
      ],
      rateInfo: {
        marketComparison: 'Direct Freight rates are typically 15-20% higher than what drivers receive through brokers',
        confidence: 94,
      },
    };
  }
  
  // Document questions
  if (lowerQuestion.includes('bol') || lowerQuestion.includes('pod') || lowerQuestion.includes('document') || lowerQuestion.includes('paperwork')) {
    return {
      answer: `**Document Management:**\n\n📋 **Bill of Lading (BOL)**\n• Generated at pickup\n• Requires shipper and driver signature\n• Lists all cargo details\n• Keep copy for your records\n\n✅ **Proof of Delivery (POD)**\n• Complete at delivery\n• Take photos of cargo condition\n• Get receiver signature\n• Upload within 2 hours for instant pay\n\n💰 **Invoice**\n• Auto-generated when POD is verified\n• Payment released within 2 hours (Instant Pay)\n\nNeed help with a specific document?`,
      tags: ['documents', 'bol', 'pod'],
      suggestedActions: [
        { id: 'upload-doc', label: 'Upload Document', action: 'upload_document', icon: '📤', priority: 'high' },
        { id: 'view-docs', label: 'View My Documents', action: 'view_documents', icon: '📁', priority: 'medium' },
      ],
      relatedDocs: [
        { type: 'template', title: 'BOL Template' },
        { type: 'guide', title: 'POD Best Practices' },
        { type: 'faq', title: 'Document FAQ' },
      ],
    };
  }
  
  // Load finding questions
  if (lowerQuestion.includes('load') || lowerQuestion.includes('freight') || lowerQuestion.includes('haul') || lowerQuestion.includes('find')) {
    const location = context?.currentLocation || 'your location';
    const equipment = context?.equipmentType || 'your equipment';
    return {
      answer: `**Finding Loads:**\n\nI can help you find loads matching ${equipment} near ${location}.\n\n**Tips for Best Loads:**\n• Check during peak posting hours (7-10 AM, 2-5 PM)\n• Set up lane alerts for preferred routes\n• Higher-rated shippers often have better facilities\n• Consider deadhead miles in rate calculation\n\n**Current Market:**\n• Dry Van: $2.50-3.50/mile average\n• Reefer: $3.00-4.00/mile average\n• Flatbed: $3.00-4.50/mile average\n\nWould you like me to search for available loads?`,
      tags: ['loads', 'booking', 'search'],
      suggestedActions: [
        { id: 'search-loads', label: 'Search Loads', action: 'search_loads', icon: '🔍', priority: 'high' },
        { id: 'set-alerts', label: 'Set Lane Alerts', action: 'set_alerts', icon: '🔔', priority: 'medium' },
        { id: 'saved-lanes', label: 'Saved Lanes', action: 'view_saved_lanes', icon: '⭐', priority: 'low' },
      ],
    };
  }
  
  // Performance questions
  if (lowerQuestion.includes('score') || lowerQuestion.includes('rating') || lowerQuestion.includes('performance') || lowerQuestion.includes('rank')) {
    return {
      answer: `**Your Performance Score:**\n\nYour score is calculated from 6 factors:\n\n📍 **On-Time Pickup (20%)** — Arrive within pickup window\n✅ **On-Time Delivery (25%)** — Deliver within scheduled window\n💬 **Communication (15%)** — Response time to messages\n📄 **Documentation (15%)** — Complete, accurate paperwork\n🛡️ **Safety Record (20%)** — Claims and incidents\n⭐ **Customer Rating (5%)** — Shipper feedback\n\n**Improve Your Score:**\n• Maintain on-time streak for bonus points\n• Upload POD photos promptly\n• Respond to messages within 30 minutes\n• Complete pre-trip inspections\n\nWould you like to see your detailed score breakdown?`,
      tags: ['performance', 'ratings', 'scores'],
      suggestedActions: [
        { id: 'view-score', label: 'View My Score', action: 'view_performance', icon: '📊', priority: 'high' },
        { id: 'leaderboard', label: 'Leaderboard', action: 'view_leaderboard', icon: '🏆', priority: 'medium' },
        { id: 'rewards', label: 'My Rewards', action: 'view_rewards', icon: '🎁', priority: 'medium' },
      ],
    };
  }
  
  // ELD questions
  if (lowerQuestion.includes('eld') || lowerQuestion.includes('electronic log')) {
    const eldInfo = COMPLIANCE_KNOWLEDGE['eld_mandate'];
    return {
      answer: `**ELD Requirements:**\n\n${eldInfo.summary}\n\n**Key Points:**\n${eldInfo.requirements.map(r => `• ${r}`).join('\n')}\n\n**If Your ELD Malfunctions:**\n1. Note the malfunction date/time in remarks\n2. Reconstruct logs on paper for that day\n3. You have 8 days to repair/replace\n4. Report malfunction to carrier within 24 hours\n\n**Reference:** ${eldInfo.regulation}`,
      tags: ['compliance', 'eld', 'regulations'],
      complianceInfo: {
        regulation: eldInfo.regulation,
        requirement: 'ELD must be used for HOS recording',
        penalty: eldInfo.penalties,
      },
    };
  }
  
  // Tracking questions
  if (lowerQuestion.includes('track') || lowerQuestion.includes('where') || lowerQuestion.includes('status') || lowerQuestion.includes('eta')) {
    return {
      answer: `**Load Tracking:**\n\nDirect Freight provides real-time GPS tracking for all active loads.\n\n**For Drivers:**\n• Your location updates automatically via the app\n• Update status at each milestone (at pickup, loaded, in transit, at delivery)\n• ETA is calculated based on current location and traffic\n\n**For Shippers:**\n• Track any active load in real-time\n• Receive automatic updates at key milestones\n• Get ETA notifications\n\nDo you have a specific load number you'd like to track?`,
      tags: ['tracking', 'location', 'eta'],
      suggestedActions: [
        { id: 'track-load', label: 'Track Load', action: 'track_load', icon: '📍', priority: 'high' },
        { id: 'update-status', label: 'Update Status', action: 'update_status', icon: '🔄', priority: 'medium' },
      ],
    };
  }
  
  // Default response
  return {
    answer: `I'm here to help with your freight-related questions!\n\n**I can assist with:**\n• 📦 Finding and booking loads\n• 📄 Document management (BOL, POD, invoices)\n• 💰 Rates and payment questions\n• 📍 Load tracking and ETA\n• ⏱️ Hours of Service (HOS) and ELD\n• 📊 Performance scores and rankings\n• 📋 FMCSA/DOT compliance\n\nWhat would you like help with today?`,
    tags: ['general', 'help'],
    suggestedActions: FREIGHT_QUICK_ACTIONS[role],
  };
