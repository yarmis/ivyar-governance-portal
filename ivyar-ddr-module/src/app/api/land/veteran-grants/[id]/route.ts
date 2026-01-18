import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const grant = await prisma.veteranLandGrant.findUnique({
      where: { id },
      include: {
        participant: {
          select: {
            nameHash: true,
            status: true
          }
        },
        parcel: {
          select: {
            cadastralNumber: true,
            oblast: true,
            raion: true,
            area: true,
            coordinates: true
          }
        }
      }
    });

    if (!grant) {
      return NextResponse.json(
        { error: 'Grant application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      grant: {
        id: grant.id,
        status: grant.status,
        priorityLevel: grant.priorityLevel,
        priorityScore: grant.priorityScore,
        combatDays: grant.combatDays,
        serviceYears: grant.serviceYears,
        disabilityLevel: grant.disabilityLevel,
        awards: grant.awards,
        applicationDate: grant.applicationDate,
        allocatedDate: grant.allocatedDate,
        allocatedParcel: grant.parcel,
        conditions: grant.conditions
      }
    });

  } catch (error) {
    console.error('Grant status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
