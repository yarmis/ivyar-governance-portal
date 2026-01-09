import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    v8Enabled: true,
    rolloutPercentage: 45,
    last24Hours: {
      total: 847,
      v7: 382,
      v8: 465
    },
    avgSimilarity: 0.89,
    comparisons: 847
  });
}
// Force Vercel rebuild Fri Jan  9 14:25:04 PST 2026
