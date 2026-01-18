// ============================================================================
// PRIORITY CALCULATOR - VETERAN LAND GRANT SCORING
// ============================================================================

export interface VeteranServiceRecord {
  combatDays?: number;
  serviceYears?: number;
  disabilityLevel?: number;
  awards?: string[];
}

export interface PriorityResult {
  priorityLevel: 'COMBAT_VETERAN' | 'DISABLED_VETERAN' | 'LONG_SERVICE' | 'DEMOBILIZED' | 'STANDARD';
  priorityScore: number;
  breakdown: {
    combatPoints: number;
    disabilityPoints: number;
    servicePoints: number;
    awardsPoints: number;
  };
  explanation: string;
}

const SCORING = {
  COMBAT: { BASE: 100, MONTHS_3: 10, MONTHS_6: 20, YEAR_1: 30, YEAR_2_BONUS: 20 },
  DISABILITY: { LEVEL_1: 50, LEVEL_2: 60, LEVEL_3: 70, LEVEL_4: 80, LEVEL_5: 90 },
  SERVICE: { YEARS_5: 20, YEARS_10: 30, YEARS_20: 40 },
  AWARDS: {
    'Hero of Ukraine': 50,
    'Order of Courage': 30,
    'Order of Bohdan Khmelnytsky': 25,
    'Medal For Courage': 15,
    DEFAULT: 5,
    MAX: 100
  }
} as const;

type AwardName = keyof typeof SCORING.AWARDS;

function calculateCombatPoints(combatDays?: number): number {
  if (!combatDays || combatDays === 0) return 0;
  let points = SCORING.COMBAT.BASE;
  if (combatDays >= 90) points += SCORING.COMBAT.MONTHS_3;
  if (combatDays >= 180) points += SCORING.COMBAT.MONTHS_6;
  if (combatDays >= 365) points += SCORING.COMBAT.YEAR_1;
  if (combatDays >= 730) points += SCORING.COMBAT.YEAR_2_BONUS;
  return points;
}

function calculateDisabilityPoints(disabilityLevel?: number): number {
  if (!disabilityLevel) return 0;
  const levels = [0, 50, 60, 70, 80, 90];
  return levels[disabilityLevel] || 0;
}

function calculateServicePoints(serviceYears?: number): number {
  if (!serviceYears) return 0;
  if (serviceYears >= 20) return SCORING.SERVICE.YEARS_20;
  if (serviceYears >= 10) return SCORING.SERVICE.YEARS_10;
  if (serviceYears >= 5) return SCORING.SERVICE.YEARS_5;
  return 0;
}

function calculateAwardsPoints(awards?: string[]): number {
  if (!awards || awards.length === 0) return 0;
  let points = 0;
  for (const award of awards) {
    const awardKey = award as AwardName;
    points += SCORING.AWARDS[awardKey] || SCORING.AWARDS.DEFAULT;
  }
  return Math.min(points, SCORING.AWARDS.MAX);
}

function determinePriorityLevel(record: VeteranServiceRecord): PriorityResult['priorityLevel'] {
  if (record.combatDays && record.combatDays > 0) return 'COMBAT_VETERAN';
  if (record.disabilityLevel && record.disabilityLevel > 0) return 'DISABLED_VETERAN';
  if (record.serviceYears && record.serviceYears >= 5) return 'LONG_SERVICE';
  if (record.serviceYears && record.serviceYears > 0) return 'DEMOBILIZED';
  return 'STANDARD';
}

export function calculatePriority(record: VeteranServiceRecord): PriorityResult {
  const combatPoints = calculateCombatPoints(record.combatDays);
  const disabilityPoints = calculateDisabilityPoints(record.disabilityLevel);
  const servicePoints = calculateServicePoints(record.serviceYears);
  const awardsPoints = calculateAwardsPoints(record.awards);
  
  const priorityScore = combatPoints + disabilityPoints + servicePoints + awardsPoints;
  const priorityLevel = determinePriorityLevel(record);
  
  return {
    priorityLevel,
    priorityScore,
    breakdown: { combatPoints, disabilityPoints, servicePoints, awardsPoints },
    explanation: `Score: ${priorityScore} (Combat: ${combatPoints}, Disability: ${disabilityPoints}, Service: ${servicePoints}, Awards: ${awardsPoints})`
  };
}
