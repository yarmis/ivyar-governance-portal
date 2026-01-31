import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;
const EMERGENCY_PASSWORD_HASH = process.env.EMERGENCY_PASSWORD_HASH;
const EMERGENCY_EMAIL = process.env.EMERGENCY_EMAIL;

// Rate limiting
const emergencyAttempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = emergencyAttempts.get(ip) || [];
  const recent = attempts.filter(t => now - t < WINDOW_MS);
  
  if (recent.length >= MAX_ATTEMPTS) return false;
  
  recent.push(now);
  emergencyAttempts.set(ip, recent);
  return true;
}

async function logSecurity(type: string, email: string, ip: string, success: boolean) {
  console.log('[SECURITY]', JSON.stringify({ type, email, ip, success, timestamp: new Date().toISOString() }));
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  try {
    if (!JWT_SECRET || !EMERGENCY_EMAIL || !EMERGENCY_PASSWORD_HASH) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!checkRateLimit(ip)) {
      await logSecurity('EMERGENCY_BLOCKED', '', ip, false);
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const body = await request.json();
    const { email, password, confirmEmergency } = body;

    if (!confirmEmergency) {
      return NextResponse.json({ error: 'Emergency access must be confirmed' }, { status: 400 });
    }

    if (email !== EMERGENCY_EMAIL) {
      await logSecurity('EMERGENCY_FAILED', email, ip, false);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, EMERGENCY_PASSWORD_HASH);
    
    if (!passwordValid) {
      await logSecurity('EMERGENCY_FAILED', email, ip, false);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await logSecurity('EMERGENCY_SUCCESS', email, ip, true);
    emergencyAttempts.delete(ip);

    const token = sign(
      { email, role: 'emergency_admin', emergency: true },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const response = NextResponse.json({ success: true, role: 'emergency_admin' });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900
    });

    return response;
  } catch (error) {
    await logSecurity('EMERGENCY_ERROR', '', ip, false);
    console.error('Emergency auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
