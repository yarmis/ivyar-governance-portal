import { NextResponse } from "next/server";
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateRequest(request: Request): { authenticated: boolean; user?: any; error?: string } {
  try {
    const authHeader = request.headers.get('authorization');
    const cookieHeader = request.headers.get('cookie');
    
    let token: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieHeader) {
      const authMatch = cookieHeader.match(/auth-token=([^;]+)/);
      const ivyarMatch = cookieHeader.match(/ivyar_auth=([^;]+)/);
      token = authMatch?.[1] || ivyarMatch?.[1] || null;
    }
    
    if (!token) {
      return { authenticated: false, error: 'No authentication token' };
    }
    
    if (!JWT_SECRET) {
      return { authenticated: false, error: 'Server configuration error' };
    }
    
    const decoded = verify(token, JWT_SECRET);
    return { authenticated: true, user: decoded };
  } catch (error) {
    return { authenticated: false, error: 'Invalid token' };
  }
}

function hasPermission(user: any, action: 'read' | 'write'): boolean {
  const role = user?.role;
  
  if (action === 'read') {
    return ['veteran', 'government_official', 'admin', 'emergency_admin'].includes(role);
  }
  
  if (action === 'write') {
    return ['admin', 'government_official', 'emergency_admin'].includes(role);
  }
  
  return false;
}

const notifications: any[] = [
  { id: "n1", claimId: "SDG-2026-00142", channel: "email", recipient: "attorney@lawfirm.com", subject: "SLA Breach Detected", status: "delivered", createdAt: "2026-01-01T10:00:00Z" },
  { id: "n2", claimId: "SDG-2026-00142", channel: "portal", recipient: "john.williams@email.com", subject: "Delay in Your Claim", status: "sent", createdAt: "2026-01-01T10:05:00Z" },
  { id: "n3", claimId: "SDG-2026-00143", channel: "email", recipient: "employer@techcorp.com", subject: "SLA Breach Alert", status: "sent", createdAt: "2026-01-01T12:00:00Z" },
];

export async function GET(request: Request) {
  const auth = authenticateRequest(request);
  
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized', message: auth.error }, { status: 401 });
  }
  
  if (!hasPermission(auth.user, 'read')) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  
  const { searchParams } = new URL(request.url);
  const claimId = searchParams.get("claimId");
  const channel = searchParams.get("channel");
  const status = searchParams.get("status");

  let filtered = [...notifications];

  if (auth.user.role === 'veteran' && auth.user.email) {
    filtered = filtered.filter(n => n.recipient === auth.user.email);
  }

  if (claimId) filtered = filtered.filter(n => n.claimId === claimId);
  if (channel) filtered = filtered.filter(n => n.channel === channel);
  if (status) filtered = filtered.filter(n => n.status === status);

  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  
  if (!auth.authenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized', message: auth.error }, { status: 401 });
  }
  
  if (!hasPermission(auth.user, 'write')) {
    return NextResponse.json({ success: false, error: 'Forbidden', message: 'Insufficient permissions' }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    
    if (!body.claimId || !body.channel || !body.recipient || !body.subject) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const newNotification = {
      id: `n${Date.now()}`,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdBy: auth.user.email,
    };

    setTimeout(() => { newNotification.status = "sent"; }, 100);
    notifications.push(newNotification);
    
    console.log('[NOTIFICATION_CREATED]', JSON.stringify({ id: newNotification.id, createdBy: auth.user.email }));
    
    return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
