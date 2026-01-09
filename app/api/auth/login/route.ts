import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Client } from 'pg';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    try {
      const result = await client.query(
        'SELECT id, email, password_hash, role, category FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const user = result.rows[0];
      const passwordValid = await bcrypt.compare(password, user.password_hash);

      if (!passwordValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = sign(
        { userId: user.id, email: user.email, role: user.role, category: user.category, mfaVerified: true },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json({
        success: true,
        user: { email: user.email, role: user.role, category: user.category }
      });

      response.cookies.set('auth-token', token, { httpOnly: true, maxAge: 86400 });
      return response;
    } finally {
      await client.end();
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
