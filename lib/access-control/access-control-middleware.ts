import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import {
  UserRole,
  Permission,
  AccessContext,
  AccessRequest
} from './access-control-types';
import { accessCoordinator } from './smart-access-coordinator';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    sessionId: string;
    mfaVerified: boolean;
  };
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Read from cookie header directly
    const cookieHeader = request.headers.get('cookie');
    const tokenMatch = cookieHeader?.match(/auth-token=([^;]+)/);
    const token = tokenMatch?.[1];
    
    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 });
    }
    
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = verify(token, JWT_SECRET) as any;
    
    (request as AuthenticatedRequest).user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      sessionId: decoded.sessionId || 'unknown',
      mfaVerified: decoded.mfaVerified || false
    };
    
    return await handler(request as AuthenticatedRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function protectedRoute(
  request: NextRequest,
  permission: Permission,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (authReq) => {
    if (!authReq.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const context: AccessContext = {
      userId: authReq.user.id,
      role: authReq.user.role,
      category: accessCoordinator.getRoleCategory(authReq.user.role),
      ipAddress: authReq.ip || authReq.headers.get('x-forwarded-for') || undefined,
      mfaVerified: authReq.user.mfaVerified,
      sessionId: authReq.user.sessionId,
      timestamp: new Date()
    };
    
    const decision = await accessCoordinator.checkAccess({
      action: permission,
      context
    });
    
    if (!decision.allowed) {
      return NextResponse.json(
        { error: 'Forbidden', reason: decision.reason },
        { status: 403 }
      );
    }
    
    return await handler(authReq);
  });
}
