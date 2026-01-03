import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/pilot', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (
    PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get('ivyar_auth')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Simple token check - just verify it exists and has 3 parts (JWT format)
  const parts = token.split('.');
  if (parts.length !== 3) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('ivyar_auth');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
