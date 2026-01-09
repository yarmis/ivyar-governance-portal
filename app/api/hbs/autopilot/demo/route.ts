import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    v8Enabled: true,
    rolloutPercentage: 45,
    last24Hours: {
      total: 847,
      v7: 382,
      v8: 465
    },
    avgSimilarity: 0.89,
    comparisons: 847,
    categories: {
      procurement: { count: 234, automated: 89 },
      logistics: { count: 189, automated: 92 },
      donor: { count: 424, automated: 87 }
    },
    recentDecisions: [
      {
        id: 'DEC-2026-001',
        type: 'procurement',
        decision: 'approved',
        confidence: 0.94,
        timestamp: new Date().toISOString()
      }
    ]
  });
}
