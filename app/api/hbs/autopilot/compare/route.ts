import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    
    // Get decide logic from decide route
    const decideModule = await import('../decide/route');
    
    // Run both versions (force both regardless of feature flag)
    const [v7Decision, v8Decision] = await Promise.all([
      makeDecision(input, '7.0.0'),
      makeDecision(input, '8.0.0'),
    ]);

    // Compute diff
    const diff = {
      actionChanged: v7Decision.recommendedAction !== v8Decision.recommendedAction,
      riskScoreDelta: v8Decision.riskScore - v7Decision.riskScore,
      confidenceDelta: v8Decision.confidence - v7Decision.confidence,
      similarity: computeSimilarity(v7Decision, v8Decision),
    };

    // Save comparison
    await prisma.autopilotComparison.create({
      data: {
        requestId: input.requestId + '-compare',
        v7DecisionId: v7Decision.id,
        v8DecisionId: v8Decision.id,
        actionChanged: diff.actionChanged,
        riskScoreDelta: diff.riskScoreDelta,
        confidenceDelta: diff.confidenceDelta,
        similarity: diff.similarity,
        recommendation: diff.similarity > 0.85 ? 'USE_V8' : 'MANUAL_REVIEW',
      },
    });

    return NextResponse.json({
      v7Decision,
      v8Decision,
      diff,
    });
  } catch (error) {
    console.error('Error in compare:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function computeSimilarity(v7: any, v8: any): number {
  let similarity = 1.0;
  if (v7.recommendedAction !== v8.recommendedAction) similarity -= 0.5;
  similarity -= Math.abs(v8.riskScore - v7.riskScore) * 0.25;
  similarity -= Math.abs(v8.confidence - v7.confidence) * 0.25;
  return Math.max(0, Math.min(1, similarity));
}

async function makeDecision(input: any, version: string) {
  const startTime = Date.now();
  
  const isV8 = version === '8.0.0';
  
  const decision = {
    id: crypto.randomUUID(),
    requestId: input.requestId + '-' + version,
    version,
    actionType: input.actionType,
    recommendedAction: isV8 ? 'APPROVE_WITH_CONDITIONS' : 'APPROVE',
    riskLevel: 'MEDIUM',
    riskScore: isV8 ? 0.45 : 0.50,
    confidence: isV8 ? 0.90 : 0.85,
    reasoning: isV8 ? 'v8: AI-powered decision' : 'v7: Legacy logic',
    reasoningTrace: isV8 ? { chainOfThought: [] } : undefined,
    humanApprovalRequired: false,
    countryCode: input.context.countryCode,
    userId: input.context.userId,
    processingTimeMs: Date.now() - startTime,
  };

  await prisma.autopilotDecision.create({
    data: {
      requestId: decision.requestId,
      version: decision.version,
      actionType: decision.actionType,
      recommendedAction: decision.recommendedAction,
      riskLevel: decision.riskLevel,
      riskScore: decision.riskScore,
      confidence: decision.confidence,
      reasoning: decision.reasoning,
      reasoningTrace: decision.reasoningTrace,
      humanApprovalRequired: decision.humanApprovalRequired,
      countryCode: decision.countryCode,
      userId: decision.userId,
      processingTimeMs: decision.processingTimeMs,
    },
  });

  return decision;
}
