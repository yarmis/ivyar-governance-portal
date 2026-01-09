import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, confirmEmergency } = body;

    if (!confirmEmergency) {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
    }

    if (email !== 'emergency@ivyar.org' || password !== 'IvyarEmergency2026!SecureKey') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = sign(
      {
        userId: 'emergency-admin',
        email: 'emergency@ivyar.org',
        role: 'ADMIN_MAX',
        category: 'ROOT',
        mfaVerified: true
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const response = NextResponse.json({
      success: true,
      warning: 'EMERGENCY ACCESS GRANTED',
      user: {
        email: 'emergency@ivyar.org',
        role: 'ADMIN_MAX',
        category: 'ROOT'
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7200
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Emergency access failed' }, { status: 500 });
  }
}
