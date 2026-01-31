/**
 * IVYAR Authentication - Secure JWT with crypto
 */

import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || (() => { 
  throw new Error('JWT_SECRET is required'); 
})();

export type UserRole = 'client' | 'attorney' | 'employer' | 'admin';
export type UserCategory = 'Worker' | 'Legal' | 'Employer' | 'Institutional';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  category: UserCategory;
  iat?: number;
  exp?: number;
}

// Base64 URL-safe encode/decode
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString('utf8');
}

/**
 * Create HMAC signature using SHA256
 */
function createSignature(data: string): string {
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(data);
  return hmac.digest('base64url');
}

/**
 * Verify HMAC signature
 */
function verifySignature(data: string, signature: string): boolean {
  const expected = createSignature(data);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

/**
 * Sign a JWT token with HMAC-SHA256
 */
export function signAuthToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload: AuthTokenPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(tokenPayload));
  const data = `${headerB64}.${payloadB64}`;
  const signature = createSignature(data);

  return `${data}.${signature}`;
}

/**
 * Verify and decode JWT token with signature validation
 */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, payloadB64, signature] = parts;
    const data = `${headerB64}.${payloadB64}`;

    // Verify signature FIRST (critical!)
    if (!verifySignature(data, signature)) {
      console.warn('Invalid JWT signature');
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as AuthTokenPayload;

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.warn('JWT token expired');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Get redirect URL based on role
 */
export function getRedirectByRole(role: UserRole): string {
  switch (role) {
    case 'admin': 
      return '/admin';
    case 'employer': 
      return '/employer';
    case 'attorney':
    case 'client':
    default: 
      return '/client';
  }
}

export default { 
  sign: signAuthToken, 
  verify: verifyAuthToken, 
  getRedirect: getRedirectByRole 
};
