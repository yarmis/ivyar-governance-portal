/**
 * IVYAR Authentication - Simple JWT
 */

const JWT_SECRET = process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is required'); })();

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

// Simple base64 encode/decode for demo
function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64url');
}

function base64Decode(str: string): string {
  return Buffer.from(str, 'base64url').toString();
}

/**
 * Sign a simple JWT token (demo version)
 */
export function signAuthToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const headerB64 = base64Encode(JSON.stringify(header));
  const payloadB64 = base64Encode(JSON.stringify(tokenPayload));
  const signature = base64Encode(JWT_SECRET + headerB64 + payloadB64); // Simplified

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verify and decode JWT token
 */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(base64Decode(parts[1])) as AuthTokenPayload;

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Get redirect URL based on role
 */
export function getRedirectByRole(role: UserRole): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'employer': return '/employer';
    case 'attorney':
    case 'client':
    default: return '/client';
  }
}

export default { sign: signAuthToken, verify: verifyAuthToken, getRedirect: getRedirectByRole };