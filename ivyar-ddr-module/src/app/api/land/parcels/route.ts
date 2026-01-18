import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const oblast = searchParams.get('oblast');
    const status = searchParams.get('status') || 'AVAILABLE';
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Prisma.LandParcelWhereInput = { 
      status: status as Prisma.EnumLandParcelStatusFilter
    };
    
    if (oblast) where.oblast = oblast;
    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea);
      if (maxArea) where.area.lte = parseFloat(maxArea);
    }

    const [parcels, total] = await Promise.all([
      prisma.landParcel.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { area: 'desc' },
        select: {
          id: true,
          cadastralNumber: true,
          oblast: true,
          raion: true,
          hromada: true,
          area: true,
          soilQuality: true,
          landUseType: true,
          status: true,
          marketValue: true,
          coordinates: true
        }
      }),
      prisma.landParcel.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: parcels,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Parcels list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
