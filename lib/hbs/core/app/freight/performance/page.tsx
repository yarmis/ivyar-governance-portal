'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

type PerformanceRating = 'excellent' | 'good' | 'average' | 'poor' | 'critical';
type TabType = 'overview' | 'scores' | 'penalties' | 'rewards' | 'leaderboard';

interface DriverPerformance {
  driverId: string;
  driverName: string;
  avatar: string;
  overallScore: number;
  rating: PerformanceRating;
  rank: number;
  totalDrivers: number;
  scores: {
    onTimePickup: number;
    onTimeDelivery: number;
    communication: number;
    documentation: number;
    safetyRecord: number;
    customerRating: number;
  };
  stats: {
    totalLoads: number;
    completedLoads: number;
    onTimeDeliveries: number;
    earnings30d: number;
    totalMiles: number;
  };
  streaks: {
    onTimeDeliveryStreak: number;
    perfectDeliveryStreak: number;
    fiveStarStreak: number;
  };
  penalties: Penalty[];
  rewards: Reward[];
  badges: Badge[];
}

interface Penalty {
  id: string;
  type: string;
  description: string;
  amount: number;
  pointsDeducted: number;
  loadNumber?: string;
  issuedAt: string;
  status: 'active' | 'paid' | 'appealed' | 'waived';
}

interface Reward {
  id: string;
  type: string;
  title: string;
  description: string;
  amount: number;
  pointsAwarded: number;
  awardedAt: string;
  claimed: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt: string;
}

interface LeaderboardEntry {
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
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_DRIVER: DriverPerformance = {
  driverId: 'drv-001',
  driverName: 'Mike Johnson',
  avatar: '🚛',
  overallScore: 87,
  rating: 'good',
  rank: 42,
  totalDrivers: 1250,
  scores: {
    onTimePickup: 94,
    onTimeDelivery: 96,
    communication: 85,
    documentation: 88,
    safetyRecord: 90,
    customerRating: 96,
  },
  stats: {
    totalLoads: 234,
    completedLoads: 228,
    onTimeDeliveries: 218,
    earnings30d: 12450,
    totalMiles: 125000,
  },
  streaks: {
    onTimeDeliveryStreak: 15,
    perfectDeliveryStreak: 8,
    fiveStarStreak: 12,
  },
  penalties: [
    {
      id: 'pen-001',
      type: 'late_delivery',
      description: 'Delivery 45 minutes after scheduled window',
      amount: 75,
      pointsDeducted: 8,
      loadNumber: 'DF-2025-00500',
      issuedAt: '2025-12-15T14:00:00Z',
      status: 'paid',
    },
    {
      id: 'pen-002',
      type: 'documentation',
      description: 'Missing BOL signature',
      amount: 25,
      pointsDeducted: 5,
      loadNumber: 'DF-2025-00612',
      issuedAt: '2025-12-28T10:00:00Z',
      status: 'active',
    },
  ],
  rewards: [
    {
      id: 'rwd-001',
      type: 'on_time_streak',
      title: 'On-Time Streak Bonus',
      description: '15 consecutive on-time deliveries',
      amount: 75,
      pointsAwarded: 8,
      awardedAt: '2026-01-05T12:00:00Z',
      claimed: false,
    },
    {
      id: 'rwd-002',
      type: 'perfect_delivery',
      title: 'Perfect Delivery',
      description: 'No exceptions on load DF-2026-00001',
      amount: 25,
      pointsAwarded: 3,
      awardedAt: '2026-01-04T16:00:00Z',
      claimed: true,
    },
  ],
  badges: [
    { id: 'badge-001', name: 'On-Time Pro', description: '50+ on-time deliveries', icon: '⏱️', tier: 'bronze', earnedAt: '2025-06-15' },
    { id: 'badge-002', name: 'Documentation Star', description: '100% compliance', icon: '📋', tier: 'bronze', earnedAt: '2025-09-01' },
    { id: 'badge-003', name: 'Road Warrior', description: '100,000+ miles', icon: '🛣️', tier: 'silver', earnedAt: '2025-11-20' },
  ],
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, driverId: 'drv-top1', driverName: 'Alex Martinez', avatar: '🏆', score: 98, loadsCompleted: 312, onTimeRate: 99, earnings: 18500, badges: ['⭐', '🏆', '🛡️'], trend: 'stable' },
  { rank: 2, driverId: 'drv-top2', driverName: 'Sarah Chen', avatar: '🥈', score: 96, loadsCompleted: 289, onTimeRate: 98, earnings: 17200, badges: ['⭐', '⏱️'], trend: 'up' },
  { rank: 3, driverId: 'drv-top3', driverName: 'James Wilson', avatar: '🥉', score: 95, loadsCompleted: 275, onTimeRate: 97, earnings: 16800, badges: ['🛣️', '📋'], trend: 'down' },
  { rank: 4, driverId: 'drv-004', driverName: 'Maria Rodriguez', avatar: '🚛', score: 94, loadsCompleted: 268, onTimeRate: 96, earnings: 16200, badges: ['⏱️'], trend: 'up' },
  { rank: 5, driverId: 'drv-005', driverName: 'David Kim', avatar: '🚛', score: 93, loadsCompleted: 255, onTimeRate: 96, earnings: 15800, badges: ['📋'], trend: 'stable' },
  // ... gap ...
  { rank: 41, driverId: 'drv-041', driverName: 'Tom Brown', avatar: '🚛', score: 88, loadsCompleted: 230, onTimeRate: 94, earnings: 12600, badges: ['⏱️'], trend: 'up' },
  { rank: 42, driverId: 'drv-001', driverName: 'Mike Johnson', avatar: '🚛', score: 87, loadsCompleted: 228, onTimeRate: 94, earnings: 12450, badges: ['⏱️', '📋', '🛣️'], trend: 'up' },
  { rank: 43, driverId: 'drv-043', driverName: 'Lisa Anderson', avatar: '🚛', score: 87, loadsCompleted: 225, onTimeRate: 93, earnings: 12300, badges: [], trend: 'down' },
];

const RATING_CONFIG: Record<PerformanceRating, { label: string; color: string; bg: string }> = {
  excellent: { label: 'Excellent', color: '#3CCB7F', bg: 'rgba(60,203,127,0.15)' },
  good: { label: 'Good', color: '#00A3FF', bg: 'rgba(0,163,255,0.15)' },
  average: { label: 'Average', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  poor: { label: 'Poor', color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
  critical: { label: 'Critical', color: '#F85149', bg: 'rgba(248,81,73,0.15)' },
};

const TIER_CONFIG: Record<Badge['tier'], { color: string; bg: string }> = {
  bronze: { color: '#CD7F32', bg: 'rgba(205,127,50,0.2)' },
  silver: { color: '#C0C0C0', bg: 'rgba(192,192,192,0.2)' },
  gold: { color: '#FFD700', bg: 'rgba(255,215,0,0.2)' },
  platinum: { color: '#E5E4E2', bg: 'rgba(229,228,226,0.3)' },
};

// ============================================================================
// COMPONENTS
// ============================================================================

function ScoreGauge({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const getColor = (s: number) => {
    if (s >= 90) return '#3CCB7F';
    if (s >= 75) return '#00A3FF';
    if (s >= 60) return '#F59E0B';
    if (s >= 40) return '#F97316';
    return '#F85149';
  };
  
  const sizes = {
    sm: { outer: 60, inner: 48, stroke: 4, text: 'text-sm' },
    md: { outer: 80, inner: 64, stroke: 6, text: 'text-lg' },
    lg: { outer: 120, inner: 96, stroke: 8, text: 'text-2xl' },
  };
  const s = sizes[size];
  const radius = (s.outer - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: s.outer, height: s.outer }}>
        <svg className="transform -rotate-90" style={{ width: s.outer, height: s.outer }}>
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={radius}
            stroke="#1F242C"
            strokeWidth={s.stroke}
            fill="none"
          />
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={radius}
            stroke={getColor(score)}
            strokeWidth={s.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${s.text}`} style={{ color: getColor(score) }}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-[#8B949E] mt-1 text-center">{label}</span>
    </div>
  );
}

function OverviewTab({ driver }: { driver: DriverPerformance }) {
  const ratingConfig = RATING_CONFIG[driver.rating];
  
  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="text-6xl">{driver.avatar}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{driver.driverName}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: ratingConfig.bg, color: ratingConfig.color }}
              >
                {ratingConfig.label}
              </span>
              <span className="text-[#8B949E]">
                Rank #{driver.rank} of {driver.totalDrivers.toLocaleString()}
              </span>
            </div>
          </div>
          <ScoreGauge score={driver.overallScore} label="Overall Score" size="lg" />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{driver.stats.completedLoads}</div>
          <div className="text-xs text-[#8B949E]">Loads Completed</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.round((driver.stats.onTimeDeliveries / driver.stats.completedLoads) * 100)}%
          </div>
          <div className="text-xs text-[#8B949E]">On-Time Rate</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#00E0B8]">${driver.stats.earnings30d.toLocaleString()}</div>
          <div className="text-xs text-[#8B949E]">Earnings (30d)</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{(driver.stats.totalMiles / 1000).toFixed(0)}K</div>
          <div className="text-xs text-[#8B949E]">Total Miles</div>
        </div>
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{driver.badges.length}</div>
          <div className="text-xs text-[#8B949E]">Badges Earned</div>
        </div>
      </div>
      
      {/* Streaks */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
        <h3 className="font-semibold mb-4">🔥 Active Streaks</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{driver.streaks.onTimeDeliveryStreak}</div>
            <div className="text-xs text-[#8B949E]">On-Time Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{driver.streaks.perfectDeliveryStreak}</div>
            <div className="text-xs text-[#8B949E]">Perfect Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{driver.streaks.fiveStarStreak}</div>
            <div className="text-xs text-[#8B949E]">5-Star Ratings</div>
          </div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
        <h3 className="font-semibold mb-4">🏆 Badges</h3>
        <div className="flex flex-wrap gap-3">
          {driver.badges.map(badge => {
            const tierConfig = TIER_CONFIG[badge.tier];
            return (
              <div 
                key={badge.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                style={{ backgroundColor: tierConfig.bg, borderColor: tierConfig.color }}
              >
                <span className="text-xl">{badge.icon}</span>
                <div>
                  <div className="text-sm font-medium">{badge.name}</div>
                  <div className="text-xs text-[#8B949E]">{badge.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScoresTab({ driver }: { driver: DriverPerformance }) {
  const scoreItems = [
    { key: 'onTimePickup', label: 'On-Time Pickup', weight: '20%', icon: '📍' },
    { key: 'onTimeDelivery', label: 'On-Time Delivery', weight: '25%', icon: '✅' },
    { key: 'communication', label: 'Communication', weight: '15%', icon: '💬' },
    { key: 'documentation', label: 'Documentation', weight: '15%', icon: '📋' },
    { key: 'safetyRecord', label: 'Safety Record', weight: '20%', icon: '🛡️' },
    { key: 'customerRating', label: 'Customer Rating', weight: '5%', icon: '⭐' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {scoreItems.map(item => (
          <div key={item.key} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-[#8B949E]">Weight: {item.weight}</div>
              </div>
            </div>
            <ScoreGauge 
              score={driver.scores[item.key as keyof typeof driver.scores]} 
              label="" 
              size="md" 
            />
          </div>
        ))}
      </div>
      
      {/* Score Breakdown */}
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
        <h3 className="font-semibold mb-4">Score Calculation</h3>
        <div className="space-y-3">
          {scoreItems.map(item => {
            const score = driver.scores[item.key as keyof typeof driver.scores];
            const weight = parseFloat(item.weight) / 100;
            const contribution = Math.round(score * weight);
            return (
              <div key={item.key} className="flex items-center gap-3">
                <span className="w-40 text-sm text-[#8B949E]">{item.label}</span>
                <div className="flex-1 h-2 bg-[#1F242C] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00E0B8] to-[#00A3FF] rounded-full transition-all"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm">{score}</span>
                <span className="w-8 text-right text-xs text-[#8B949E]">×{item.weight}</span>
                <span className="w-12 text-right text-sm text-[#00E0B8]">+{contribution}</span>
              </div>
            );
          })}
          <div className="border-t border-[#1F242C] pt-3 flex items-center justify-end gap-3">
            <span className="font-semibold">Total Score:</span>
            <span className="text-2xl font-bold text-[#00E0B8]">{driver.overallScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PenaltiesTab({ driver }: { driver: DriverPerformance }) {
  return (
    <div className="space-y-4">
      {driver.penalties.length === 0 ? (
        <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-8 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-lg font-semibold">No Active Penalties!</div>
          <div className="text-sm text-[#8B949E]">Keep up the great work!</div>
        </div>
      ) : (
        driver.penalties.map(penalty => (
          <div key={penalty.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="font-semibold capitalize">{penalty.type.replace('_', ' ')}</div>
                  {penalty.loadNumber && (
                    <div className="text-xs text-[#8B949E]">Load: {penalty.loadNumber}</div>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                penalty.status === 'active' ? 'bg-red-500/20 text-red-400' :
                penalty.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                penalty.status === 'appealed' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {penalty.status}
              </span>
            </div>
            <p className="text-sm text-[#8B949E] mb-3">{penalty.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-red-400">-${penalty.amount}</span>
                <span className="text-[#8B949E]">-{penalty.pointsDeducted} points</span>
              </div>
              <span className="text-xs text-[#8B949E]">
                {new Date(penalty.issuedAt).toLocaleDateString()}
              </span>
            </div>
            {penalty.status === 'active' && (
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1 bg-[#00E0B8] text-[#0D1117] rounded text-sm">
                  Pay Now
                </button>
                <button className="px-3 py-1 border border-[#1F242C] rounded text-sm hover:border-[#00E0B8]/50">
                  Appeal
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function RewardsTab({ driver }: { driver: DriverPerformance }) {
  const unclaimedTotal = driver.rewards.filter(r => !r.claimed).reduce((sum, r) => sum + r.amount, 0);
  
  return (
    <div className="space-y-4">
      {unclaimedTotal > 0 && (
        <div className="bg-gradient-to-r from-[#00E0B8]/20 to-[#00A3FF]/20 border border-[#00E0B8]/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#8B949E]">Unclaimed Rewards</div>
              <div className="text-2xl font-bold text-[#00E0B8]">${unclaimedTotal}</div>
            </div>
            <button className="px-4 py-2 bg-[#00E0B8] text-[#0D1117] rounded-lg font-medium">
              Claim All
            </button>
          </div>
        </div>
      )}
      
      {driver.rewards.map(reward => (
        <div key={reward.id} className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <div>
                <div className="font-semibold">{reward.title}</div>
                <div className="text-xs text-[#8B949E]">{reward.type.replace('_', ' ')}</div>
              </div>
            </div>
            {reward.claimed ? (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Claimed</span>
            ) : (
              <button className="px-3 py-1 bg-[#00E0B8] text-[#0D1117] rounded text-sm">
                Claim
              </button>
            )}
          </div>
          <p className="text-sm text-[#8B949E] mb-3">{reward.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-green-400">+${reward.amount}</span>
              <span className="text-[#8B949E]">+{reward.pointsAwarded} points</span>
            </div>
            <span className="text-xs text-[#8B949E]">
              {new Date(reward.awardedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderboardTab({ currentDriverId }: { currentDriverId: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1F242C]">
              <th className="px-4 py-3 text-left text-xs font-medium text-[#8B949E]">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[#8B949E]">Driver</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8B949E]">Score</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8B949E]">Loads</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8B949E]">On-Time</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#8B949E]">Earnings (30d)</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-[#8B949E]">Badges</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LEADERBOARD.map((entry, i) => {
              const isCurrentDriver = entry.driverId === currentDriverId;
              const showGap = i > 0 && MOCK_LEADERBOARD[i - 1].rank < entry.rank - 1;
              
              return (
                <>
                  {showGap && (
                    <tr key={`gap-${entry.rank}`}>
                      <td colSpan={7} className="text-center py-2 text-[#8B949E] text-sm">
                        • • •
                      </td>
                    </tr>
                  )}
                  <tr 
                    key={entry.driverId}
                    className={`border-b border-[#1F242C]/50 ${
                      isCurrentDriver ? 'bg-[#00E0B8]/10' : 'hover:bg-[#1F242C]/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          entry.rank === 1 ? 'text-yellow-400' :
                          entry.rank === 2 ? 'text-gray-300' :
                          entry.rank === 3 ? 'text-orange-400' :
                          'text-[#8B949E]'
                        }`}>
                          #{entry.rank}
                        </span>
                        {entry.trend === 'up' && <span className="text-green-400 text-xs">↑</span>}
                        {entry.trend === 'down' && <span className="text-red-400 text-xs">↓</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{entry.avatar}</span>
                        <span className={isCurrentDriver ? 'font-bold text-[#00E0B8]' : ''}>
                          {entry.driverName}
                          {isCurrentDriver && <span className="ml-1 text-xs">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-[#00E0B8]">{entry.score}</span>
                    </td>
                    <td className="px-4 py-3 text-center">{entry.loadsCompleted}</td>
                    <td className="px-4 py-3 text-center text-green-400">{entry.onTimeRate}%</td>
                    <td className="px-4 py-3 text-right">${entry.earnings.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {entry.badges.map((badge, bi) => (
                        <span key={bi} className="mr-1">{badge}</span>
                      ))}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DriverPerformancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const driver = MOCK_DRIVER;
  
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'scores', label: 'Scores', icon: '📈' },
    { key: 'penalties', label: 'Penalties', icon: '⚠️' },
    { key: 'rewards', label: 'Rewards', icon: '🎁' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];
  
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
            <span className="font-semibold">Performance</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/freight/documents" className="px-4 py-2 text-sm text-[#8B949E] hover:text-white">Documents</Link>
            <Link href="/freight/earnings" className="px-4 py-2 text-sm text-[#8B949E] hover:text-white">Earnings</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">📊 Driver Performance</h1>
            <p className="text-[#8B949E]">Track your performance metrics, rewards, and ranking</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-[#00E0B8] text-[#0D1117]'
                    : 'bg-[#161B22] text-[#8B949E] hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && <OverviewTab driver={driver} />}
          {activeTab === 'scores' && <ScoresTab driver={driver} />}
          {activeTab === 'penalties' && <PenaltiesTab driver={driver} />}
          {activeTab === 'rewards' && <RewardsTab driver={driver} />}
          {activeTab === 'leaderboard' && <LeaderboardTab currentDriverId={driver.driverId} />}
        </div>
      </main>
    </div>
  );
}
