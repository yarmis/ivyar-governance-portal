import { NextRequest, NextResponse } from 'next/server';
import { signAuthToken, getRedirectByRole } from '@/lib/auth/jwt';
import { findUserByEmail, verifyPassword } from '@/lib/auth/users';
import { logLoginAttempt } from '@/lib/auth/audit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Get client info for audit
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validate input
    if (!email || !password) {
      logLoginAttempt({ email: email || 'unknown', success: false, ipAddress, userAgent });
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      logLoginAttempt({ email, success: false, ipAddress, userAgent });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const validPassword = verifyPassword(password, user);
    if (!validPassword) {
      logLoginAttempt({ userId: user.id, email, success: false, ipAddress, userAgent });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create token
    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      category: user.category,
    });

    // Log successful login
    logLoginAttempt({ userId: user.id, email, success: true, ipAddress, userAgent });

    // Create response with cookie
    const redirectTo = getRedirectByRole(user.role);
    const response = NextResponse.json({ success: true, redirectTo, role: user.role });

    // Set HttpOnly cookie
    response.cookies.set('ivyar_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}