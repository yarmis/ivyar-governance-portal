import { NextRequest, NextResponse } from 'next/server';

// Public paths - no auth required
const PUBLIC_PATHS = ['/', '/login', '/pilot', '/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static files
  if (
    PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get('ivyar_auth')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Basic token validation (decode without verification for middleware)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;

    // Role-based access
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
    if (pathname.startsWith('/employer') && role !== 'employer' && role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('ivyar_auth');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};