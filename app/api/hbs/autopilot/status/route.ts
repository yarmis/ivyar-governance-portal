import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: 'HBS_AUTOPILOT_V8' },
    });

    const [v7Count, v8Count] = await Promise.all([
      prisma.autopilotDecision.count({
        where: {
          version: '7.0.0',
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.autopilotDecision.count({
        where: {
          version: '8.0.0',
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const comparisons = await prisma.autopilotComparison.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { similarity: true },
    });

    const avgSimilarity =
      comparisons.length > 0
        ? comparisons.reduce((sum, c) => sum + c.similarity, 0) / comparisons.length
        : 0;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      flag: {
        enabled: flag?.enabled || false,
        strategy: flag?.rolloutStrategy || null,
      },
      last24Hours: {
        v7Decisions: v7Count,
        v8Decisions: v8Count,
        totalDecisions: v7Count + v8Count,
        v8Percentage:
          v7Count + v8Count > 0
            ? ((v8Count / (v7Count + v8Count)) * 100).toFixed(1)
            : '0',
      },
      comparison: {
        averageSimilarity: avgSimilarity.toFixed(2),
        totalComparisons: comparisons.length,
      },
    });
  } catch (error) {
    console.error('Error getting status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
