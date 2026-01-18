import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculatePriority } from '@/lib/land-registry/priority-calculator';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      participantId,
      combatDays,
      serviceYears,
      disabilityLevel,
      awards,
      preferredOblast,
      preferredAreaMin,
      preferredAreaMax,
      preferredLandUse
    } = body;

    // Validate required fields
    if (!participantId) {
      return NextResponse.json(
        { error: 'participantId is required' },
        { status: 400 }
      );
    }

    // Check if participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: participantId }
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Check if already has grant application
    const existing = await prisma.veteranLandGrant.findUnique({
      where: { participantId }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Veteran already has land grant application' },
        { status: 400 }
      );
    }

    // Calculate priority
    const priority = calculatePriority({
      combatDays,
      serviceYears,
      disabilityLevel,
      awards
    });

    // Create grant application
    const grant = await prisma.veteranLandGrant.create({
      data: {
        tenantId: participant.tenantId,
        participantId,
        priorityLevel: priority.priorityLevel,
        priorityScore: priority.priorityScore,
        combatDays: combatDays || 0,
        serviceYears: serviceYears || 0,
        disabilityLevel: disabilityLevel || 0,
        awards: awards || [],
        preferredOblast,
        preferredAreaMin,
        preferredAreaMax,
        preferredLandUse,
        status: 'PENDING',
        conditions: {
          mustFarmYears: 5,
          noResaleYears: 10,
          cannotLeaseToAgro: true
        }
      },
      include: {
        participant: {
          select: {
            nameHash: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      grant: {
        id: grant.id,
        priorityLevel: grant.priorityLevel,
        priorityScore: grant.priorityScore,
        status: grant.status,
        breakdown: priority.breakdown,
        explanation: priority.explanation,
        estimatedWaitMonths: calculateWaitTime(priority.priorityScore)
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Grant application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateWaitTime(score: number): number {
  if (score >= 200) return 1;
  if (score >= 150) return 3;
  if (score >= 100) return 6;
  if (score >= 50) return 12;
  return 24;
}
