import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { percentage } = body;

    const flag = await prisma.featureFlag.update({
      where: { key: 'HBS_AUTOPILOT_V8' },
      data: {
        enabled: true,
        rolloutStrategy: {
          type: 'PERCENTAGE',
          percentage: percentage || 0,
        },
      },
    });

    return NextResponse.json({
      status: 'ok',
      message: 'v8 enabled',
      flag,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
