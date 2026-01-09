import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { createdBy } = body;

    const flag = await prisma.featureFlag.update({
      where: { key: 'HBS_AUTOPILOT_V8' },
      data: {
        enabled: false,
        createdBy: createdBy || 'api',
      },
    });

    return NextResponse.json({
      status: 'ok',
      message: 'v8 disabled',
      flag,
    });
  } catch (error) {
    console.error('Error disabling v8:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
