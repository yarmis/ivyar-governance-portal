import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Demo started',
    sessionId: `demo-${Date.now()}`,
  });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    available: true,
    duration: '15 seconds',
  });
}