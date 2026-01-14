import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'HBS API ready' });
}

export async function POST() {
  return NextResponse.json({ status: 'HBS API ready' });
}
