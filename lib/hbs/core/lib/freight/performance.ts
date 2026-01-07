// lib/freight/performance.ts
// IVYAR Direct Freight - Performance & Discipline System v1.0
// Driver/Shipper scoring, KPIs, penalties, rewards

// ============================================================================
// TYPES
// ============================================================================

export type PerformanceRating = 'excellent' | 'good' | 'average' | 'poor' | 'critical';
export type PenaltyType = 'late_pickup' | 'late_delivery' | 'no_show' | 'cancellation' | 'damage' | 'documentation' | 'communication' | 'safety';
export type RewardType = 'on_time_streak' | 'perfect_delivery' | 'top_rated' | 'milestone' | 'referral';

// ============================================================================
// DRIVER PERFORMANCE
// ============================================================================

export interface DriverPerformance {
  driverId: string;
  driverName: string;
  
  // Overall Score (0-100)
  overallScore: number;
  rating: PerformanceRating;
  rank?: number; // Regional or national rank
  
  // Component Scores (0-100 each)
  scores: {
    onTimePickup: number;      // Weight: 20%
    onTimeDelivery: number;    // Weight: 25%
    communication: number;     // Weight: 15%
    documentation: number;     // Weight: 15%
    safetyRecord: number;      // Weight: 20%
    customerRating: number;    // Weight: 5%
  };
  
  // Statistics
  stats: {
    totalLoads: number;
    completedLoads: number;
    cancelledLoads: number;
    
    onTimePickups: number;
    latePickups: number;
    onTimeDeliveries: number;
    lateDeliveries: number;
    
    claimsCount: number;
    claimsAmount: number;
    
    avgResponseTime: number; // Minutes
    communicationRating: number;
    
    inspectionsPassed: number;
    inspectionsFailed: number;
    
    totalMiles: number;
    emptyMiles: number;
    
    earnings30d: number;
    earnings90d: number;
    earningsYTD: number;
  };
  
  // Penalties
  activePenalties: Penalty[];
  penaltyHistory: Penalty[];
  
  // Rewards
  activeRewards: Reward[];
  rewardHistory: Reward[];
  
  // Streaks
  streaks: {
    onTimeDeliveryStreak: number;
    perfectDeliveryStreak: number;
    fiveStarStreak: number;
  };
  
  // Certifications & Badges
  badges: Badge[];
  
  // Period
  periodStart: string;
  periodEnd: string;
  lastUpdated: string;
}

export interface Penalty {
  id: string;
  type: PenaltyType;
  description: string;
  amount?: number; // Financial penalty
  pointsDeducted: number; // Score impact
  loadId?: string;
  loadNumber?: string;
  issuedAt: string;
  expiresAt?: string;
  status: 'active' | 'paid' | 'appealed' | 'waived' | 'expired';
  appealReason?: string;
  appealStatus?: 'pending' | 'approved' | 'denied';
}

export interface Reward {
  id: string;
  type: RewardType;
  title: string;
  description: string;
  amount?: number; // Bonus amount
  pointsAwarded: number;
  awardedAt: string;
  expiresAt?: string;
  claimed: boolean;
  claimedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt: string;
  criteria: string;
}

// ============================================================================
// SHIPPER PERFORMANCE
// ============================================================================

export interface ShipperPerformance {
  shipperId: string;
  shipperName: string;
  
  // Overall Score (0-100)
  overallScore: number;
  rating: PerformanceRating;
  
  // Component Scores
  scores: {
    paymentSpeed: number;      // Weight: 30%
    loadAccuracy: number;      // Weight: 25%
    facilityEfficiency: number; // Weight: 25%
    communication: number;     // Weight: 20%
  };
  
  // Statistics
  stats: {
    totalLoads: number;
    completedLoads: number;
    cancelledLoads: number;
    
    avgPaymentDays: number;
    onTimePayments: number;
    latePayments: number;
    
    accurateLoadInfo: number;
    inaccurateLoadInfo: number;
    
    avgPickupTime: number; // Minutes at facility
    avgDeliveryTime: number;
    
    driverRatings: number[];
    avgDriverRating: number;
    
    totalSpent: number;
    totalSpent30d: number;
  };
  
  // Alerts
  alerts: ShipperAlert[];
  
  // Preferred Status
  preferredStatus: 'standard' | 'preferred' | 'premium' | 'restricted';
  
  lastUpdated: string;
}

export interface ShipperAlert {
  id: string;
  type: 'payment_overdue' | 'high_cancellation' | 'poor_rating' | 'detention_issues';
  severity: 'warning' | 'critical';
  message: string;
  createdAt: string;
  resolvedAt?: string;
}

// ============================================================================
// PENALTY DEFINITIONS
// ============================================================================

export const PENALTY_DEFINITIONS: Record<PenaltyType, {
  name: string;
  description: string;
  baseAmount: number;
  pointsDeducted: number;
  escalation: { threshold: number; multiplier: number }[];
}> = {
  late_pickup: {
    name: 'Late Pickup',
    description: 'Arrival more than 30 minutes after scheduled pickup window',
    baseAmount: 50,
    pointsDeducted: 5,
    escalation: [
      { threshold: 60, multiplier: 1.5 },  // 1 hour late
      { threshold: 120, multiplier: 2 },   // 2 hours late
      { threshold: 240, multiplier: 3 },   // 4+ hours late
    ],
  },
  late_delivery: {
    name: 'Late Delivery',
    description: 'Delivery after scheduled window without prior notification',
    baseAmount: 100,
    pointsDeducted: 10,
    escalation: [
      { threshold: 60, multiplier: 1.5 },
      { threshold: 120, multiplier: 2 },
      { threshold: 240, multiplier: 3 },
    ],
  },
  no_show: {
    name: 'No Show (TONU)',
    description: 'Truck ordered, not used - failure to appear for pickup',
    baseAmount: 250,
    pointsDeducted: 25,
    escalation: [],
  },
  cancellation: {
    name: 'Late Cancellation',
    description: 'Cancellation within 12 hours of pickup',
    baseAmount: 150,
    pointsDeducted: 15,
    escalation: [
      { threshold: 6, multiplier: 1.5 },   // < 6 hours
      { threshold: 2, multiplier: 2 },     // < 2 hours
    ],
  },
  damage: {
    name: 'Cargo Damage',
    description: 'Damage to cargo during transport',
    baseAmount: 0, // Determined by claim
    pointsDeducted: 20,
    escalation: [],
  },
  documentation: {
    name: 'Documentation Failure',
    description: 'Missing or incomplete documentation (BOL, POD)',
    baseAmount: 25,
    pointsDeducted: 5,
    escalation: [],
  },
  communication: {
    name: 'Communication Failure',
    description: 'Failure to respond to calls/messages within 30 minutes',
    baseAmount: 25,
    pointsDeducted: 3,
    escalation: [],
  },
  safety: {
    name: 'Safety Violation',
    description: 'Documented safety violation during transport',
    baseAmount: 200,
    pointsDeducted: 30,
    escalation: [],
  },
};

// ============================================================================
// REWARD DEFINITIONS
// ============================================================================

export const REWARD_DEFINITIONS: Record<RewardType, {
  name: string;
  description: string;
  baseAmount: number;
  pointsAwarded: number;
  criteria: string;
}> = {
  on_time_streak: {
    name: 'On-Time Streak',
    description: 'Bonus for consecutive on-time deliveries',
    baseAmount: 50,
    pointsAwarded: 5,
    criteria: '10+ consecutive on-time deliveries',
  },
  perfect_delivery: {
    name: 'Perfect Delivery',
    description: 'No exceptions, damage, or issues',
    baseAmount: 25,
    pointsAwarded: 3,
    criteria: 'Delivery with no exceptions, full documentation',
  },
  top_rated: {
    name: 'Top Rated Driver',
    description: 'Monthly recognition for highest rated drivers',
    baseAmount: 200,
    pointsAwarded: 20,
    criteria: 'Top 10% driver rating for the month',
  },
  milestone: {
    name: 'Milestone Achievement',
    description: 'Recognition for load milestones',
    baseAmount: 100,
    pointsAwarded: 10,
    criteria: '100, 500, 1000+ loads completed',
  },
  referral: {
    name: 'Referral Bonus',
    description: 'Bonus for referring new verified drivers',
    baseAmount: 500,
    pointsAwarded: 25,
    criteria: 'Referred driver completes first 5 loads',
  },
};

// ============================================================================
// BADGE DEFINITIONS
// ============================================================================

export const BADGE_DEFINITIONS: Badge[] = [
  { id: 'on_time_pro', name: 'On-Time Pro', description: '50+ on-time deliveries', icon: '⏱️', tier: 'bronze', earnedAt: '', criteria: '50 on-time deliveries' },
  { id: 'on_time_elite', name: 'On-Time Elite', description: '200+ on-time deliveries', icon: '🏆', tier: 'gold', earnedAt: '', criteria: '200 on-time deliveries' },
  { id: 'safe_driver', name: 'Safe Driver', description: 'Zero safety incidents for 6 months', icon: '🛡️', tier: 'silver', earnedAt: '', criteria: '6 months zero incidents' },
  { id: 'top_earner', name: 'Top Earner', description: 'Top 10% earnings for quarter', icon: '💰', tier: 'gold', earnedAt: '', criteria: 'Top 10% earnings' },
  { id: 'documentation_star', name: 'Documentation Star', description: '100% documentation compliance', icon: '📋', tier: 'bronze', earnedAt: '', criteria: '100% doc compliance 30 days' },
  { id: 'five_star', name: 'Five Star Driver', description: 'Maintain 4.9+ rating', icon: '⭐', tier: 'platinum', earnedAt: '', criteria: '4.9+ rating 90 days' },
  { id: 'road_warrior', name: 'Road Warrior', description: '100,000+ miles', icon: '🚛', tier: 'silver', earnedAt: '', criteria: '100,000 miles completed' },
  { id: 'trusted_partner', name: 'Trusted Partner', description: '1 year on platform', icon: '🤝', tier: 'gold', earnedAt: '', criteria: '1 year active' },
];

// ============================================================================
// SCORE CALCULATION
// ============================================================================

export function calculateDriverScore(stats: DriverPerformance['stats'], weights = {
  onTimePickup: 0.20,
  onTimeDelivery: 0.25,
  communication: 0.15,
  documentation: 0.15,
  safetyRecord: 0.20,
  customerRating: 0.05,
}): { overallScore: number; scores: DriverPerformance['scores']; rating: PerformanceRating } {
  
  // On-Time Pickup Score
  const pickupTotal = stats.onTimePickups + stats.latePickups;
  const onTimePickup = pickupTotal > 0 ? (stats.onTimePickups / pickupTotal) * 100 : 100;
  
  // On-Time Delivery Score
  const deliveryTotal = stats.onTimeDeliveries + stats.lateDeliveries;
  const onTimeDelivery = deliveryTotal > 0 ? (stats.onTimeDeliveries / deliveryTotal) * 100 : 100;
  
  // Communication Score (based on response time)
  // < 5 min = 100, 5-15 min = 90, 15-30 min = 70, 30-60 min = 50, > 60 min = 30
  let communication = 100;
  if (stats.avgResponseTime > 60) communication = 30;
  else if (stats.avgResponseTime > 30) communication = 50;
  else if (stats.avgResponseTime > 15) communication = 70;
  else if (stats.avgResponseTime > 5) communication = 90;
  
  // Documentation Score (based on inspection pass rate)
  const inspectionTotal = stats.inspectionsPassed + stats.inspectionsFailed;
  const documentation = inspectionTotal > 0 ? (stats.inspectionsPassed / inspectionTotal) * 100 : 100;
  
  // Safety Score (inversely related to claims)
  // 0 claims = 100, 1 claim = 80, 2 claims = 60, 3+ claims = 40
  let safetyRecord = 100;
  if (stats.claimsCount >= 3) safetyRecord = 40;
  else if (stats.claimsCount === 2) safetyRecord = 60;
  else if (stats.claimsCount === 1) safetyRecord = 80;
  
  // Customer Rating (direct mapping, 5.0 = 100)
  const customerRating = (stats.communicationRating / 5) * 100;
  
  const scores = {
    onTimePickup: Math.round(onTimePickup),
    onTimeDelivery: Math.round(onTimeDelivery),
    communication: Math.round(communication),
    documentation: Math.round(documentation),
    safetyRecord: Math.round(safetyRecord),
    customerRating: Math.round(customerRating),
  };
  
  // Weighted overall score
  const overallScore = Math.round(
    scores.onTimePickup * weights.onTimePickup +
    scores.onTimeDelivery * weights.onTimeDelivery +
    scores.communication * weights.communication +
    scores.documentation * weights.documentation +
    scores.safetyRecord * weights.safetyRecord +
    scores.customerRating * weights.customerRating
  );
  
  // Rating
  let rating: PerformanceRating;
  if (overallScore >= 90) rating = 'excellent';
  else if (overallScore >= 75) rating = 'good';
  else if (overallScore >= 60) rating = 'average';
  else if (overallScore >= 40) rating = 'poor';
  else rating = 'critical';
  
  return { overallScore, scores, rating };
}

export function calculateShipperScore(stats: ShipperPerformance['stats'], weights = {
  paymentSpeed: 0.30,
  loadAccuracy: 0.25,
  facilityEfficiency: 0.25,
  communication: 0.20,
}): { overallScore: number; scores: ShipperPerformance['scores']; rating: PerformanceRating } {
  
  // Payment Speed Score
  // < 2 days = 100, 2-7 days = 90, 7-15 days = 70, 15-30 days = 50, > 30 days = 30
  let paymentSpeed = 100;
  if (stats.avgPaymentDays > 30) paymentSpeed = 30;
  else if (stats.avgPaymentDays > 15) paymentSpeed = 50;
  else if (stats.avgPaymentDays > 7) paymentSpeed = 70;
  else if (stats.avgPaymentDays > 2) paymentSpeed = 90;
  
  // Load Accuracy Score
  const accuracyTotal = stats.accurateLoadInfo + stats.inaccurateLoadInfo;
  const loadAccuracy = accuracyTotal > 0 ? (stats.accurateLoadInfo / accuracyTotal) * 100 : 100;
  
  // Facility Efficiency Score (pickup time)
  // < 30 min = 100, 30-60 min = 90, 60-120 min = 70, 120-180 min = 50, > 180 min = 30
  let facilityEfficiency = 100;
  if (stats.avgPickupTime > 180) facilityEfficiency = 30;
  else if (stats.avgPickupTime > 120) facilityEfficiency = 50;
  else if (stats.avgPickupTime > 60) facilityEfficiency = 70;
  else if (stats.avgPickupTime > 30) facilityEfficiency = 90;
  
  // Communication Score (avg driver rating)
  const communication = (stats.avgDriverRating / 5) * 100;
  
  const scores = {
    paymentSpeed: Math.round(paymentSpeed),
    loadAccuracy: Math.round(loadAccuracy),
    facilityEfficiency: Math.round(facilityEfficiency),
    communication: Math.round(communication),
  };
  
  const overallScore = Math.round(
    scores.paymentSpeed * weights.paymentSpeed +
    scores.loadAccuracy * weights.loadAccuracy +
    scores.facilityEfficiency * weights.facilityEfficiency +
    scores.communication * weights.communication
  );
  
  let rating: PerformanceRating;
  if (overallScore >= 90) rating = 'excellent';
  else if (overallScore >= 75) rating = 'good';
  else if (overallScore >= 60) rating = 'average';
  else if (overallScore >= 40) rating = 'poor';
  else rating = 'critical';
  
  return { overallScore, scores, rating };
}

// ============================================================================
// PENALTY & REWARD FUNCTIONS
// ============================================================================

export function createPenalty(
  driverId: string,
  type: PenaltyType,
  loadId?: string,
  loadNumber?: string,
  details?: { minutesLate?: number; hoursBeforePickup?: number }
): Penalty {
  const def = PENALTY_DEFINITIONS[type];
  let amount = def.baseAmount;
  let pointsDeducted = def.pointsDeducted;
  
  // Apply escalation
  if (details?.minutesLate && def.escalation.length > 0) {
    for (const esc of def.escalation) {
      if (details.minutesLate >= esc.threshold) {
        amount = def.baseAmount * esc.multiplier;
      }
    }
  }
  
  if (details?.hoursBeforePickup && type === 'cancellation') {
    for (const esc of def.escalation) {
      if (details.hoursBeforePickup <= esc.threshold) {
        amount = def.baseAmount * esc.multiplier;
      }
    }
  }
  
  return {
    id: `pen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    description: def.description,
    amount,
    pointsDeducted,
    loadId,
    loadNumber,
    issuedAt: new Date().toISOString(),
    status: 'active',
  };
}

export function createReward(
  driverId: string,
  type: RewardType,
  customAmount?: number
): Reward {
  const def = REWARD_DEFINITIONS[type];
  
  return {
    id: `rwd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: def.name,
    description: def.description,
    amount: customAmount || def.baseAmount,
    pointsAwarded: def.pointsAwarded,
    awardedAt: new Date().toISOString(),
    claimed: false,
  };
}

export function checkBadgeEligibility(stats: DriverPerformance['stats'], existingBadges: Badge[]): Badge[] {
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();
  
  // On-Time Pro (50+ on-time deliveries)
  if (stats.onTimeDeliveries >= 50 && !existingBadges.find(b => b.id === 'on_time_pro')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'on_time_pro')!, earnedAt: now });
  }
  
  // On-Time Elite (200+ on-time deliveries)
  if (stats.onTimeDeliveries >= 200 && !existingBadges.find(b => b.id === 'on_time_elite')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'on_time_elite')!, earnedAt: now });
  }
  
  // Road Warrior (100,000+ miles)
  if (stats.totalMiles >= 100000 && !existingBadges.find(b => b.id === 'road_warrior')) {
    newBadges.push({ ...BADGE_DEFINITIONS.find(b => b.id === 'road_warrior')!, earnedAt: now });
  }
  
  return newBadges;
}

// ============================================================================
// LEADERBOARD
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  driverId: string;
  driverName: string;
  avatar: string;
  score: number;
  loadsCompleted: number;
  onTimeRate: number;
  earnings: number;
  badges: string[];
  trend: 'up' | 'down' | 'stable';
  previousRank?: number;
}

export interface Leaderboard {
  type: 'regional' | 'national' | 'equipment' | 'lane';
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all_time';
  region?: string;
  equipmentType?: string;
  lane?: { origin: string; destination: string };
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export function generateLeaderboard(
  drivers: DriverPerformance[],
  type: Leaderboard['type'],
  period: Leaderboard['period'],
  filters?: { region?: string; equipmentType?: string }
): Leaderboard {
  const sorted = [...drivers].sort((a, b) => b.overallScore - a.overallScore);
  
  const entries: LeaderboardEntry[] = sorted.slice(0, 100).map((d, i) => ({
    rank: i + 1,
    driverId: d.driverId,
    driverName: d.driverName,
    avatar: '🚛',
    score: d.overallScore,
    loadsCompleted: d.stats.completedLoads,
    onTimeRate: d.stats.totalLoads > 0 
      ? Math.round((d.stats.onTimeDeliveries / d.stats.totalLoads) * 100) 
      : 100,
    earnings: d.stats.earnings30d,
    badges: d.badges.map(b => b.icon),
    trend: d.rank 
      ? (i + 1 < d.rank ? 'up' : i + 1 > d.rank ? 'down' : 'stable')
      : 'stable',
    previousRank: d.rank,
  }));
  
  return {
    type,
    period,
    region: filters?.region,
    equipmentType: filters?.equipmentType,
    entries,
    lastUpdated: new Date().toISOString(),
  };
}

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

export function generateMockDriverPerformance(driverId: string, driverName: string): DriverPerformance {
  const stats = {
    totalLoads: 234,
    completedLoads: 228,
    cancelledLoads: 6,
    onTimePickups: 215,
    latePickups: 13,
    onTimeDeliveries: 218,
    lateDeliveries: 10,
    claimsCount: 1,
    claimsAmount: 1500,
    avgResponseTime: 8,
    communicationRating: 4.8,
    inspectionsPassed: 220,
    inspectionsFailed: 8,
    totalMiles: 125000,
    emptyMiles: 18750,
    earnings30d: 12450,
    earnings90d: 38500,
    earningsYTD: 145000,
  };
  
  const { overallScore, scores, rating } = calculateDriverScore(stats);
  
  return {
    driverId,
    driverName,
    overallScore,
    rating,
    rank: 42,
    scores,
    stats,
    activePenalties: [],
    penaltyHistory: [
      createPenalty(driverId, 'late_delivery', 'load-old-001', 'DF-2025-00500'),
    ],
    activeRewards: [
      createReward(driverId, 'on_time_streak'),
    ],
    rewardHistory: [],
    streaks: {
      onTimeDeliveryStreak: 15,
      perfectDeliveryStreak: 8,
      fiveStarStreak: 12,
    },
    badges: [
      { ...BADGE_DEFINITIONS[0], earnedAt: '2025-06-15' },
      { ...BADGE_DEFINITIONS[4], earnedAt: '2025-09-01' },
    ],
    periodStart: '2026-01-01',
    periodEnd: '2026-01-31',
    lastUpdated: new Date().toISOString(),
  };
}
