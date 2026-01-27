import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// REMOVED HARDCODED CREDENTIALS - USE ENVIRONMENT VARIABLES ONLY
const JWT_SECRET = process.env.JWT_SECRET;
const EMERGENCY_EMAIL = process.env.EMERGENCY_EMAIL;
const EMERGENCY_PASSWORD = process.env.EMERGENCY_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    if (!JWT_SECRET || !EMERGENCY_EMAIL || !EMERGENCY_PASSWORD) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body = await request.json();
    const { email, password, confirmEmergency } = body;

    if (!confirmEmergency) {
      return NextResponse.json({ error: 'Emergency access must be confirmed' }, { status: 400 });
    }

    if (email !== EMERGENCY_EMAIL || password !== EMERGENCY_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = sign(
      { email, role: 'emergency_admin', emergency: true },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ success: true, role: 'emergency_admin' });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600
    });

    return response;
  } catch (error) {
    console.error('Emergency auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
