// middleware.ts
// IVYAR i18n URL Routing Middleware

import { NextRequest, NextResponse } from 'next/server';
import { localeCodes, defaultLocale } from './config';

// Pages that don't need locale prefix
const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = ['api', '_next', 'static', 'favicon.ico'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PATHS.some(path => pathname.startsWith(`/${path}`))
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = localeCodes.some(
    (locale: string) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale from various sources
  const locale = detectLocale(request);

  // Redirect to locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(url);
}

function detectLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('IVYAR_LOCALE')?.value;
  if (cookieLocale && localeCodes.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLocale = parseAcceptLanguage(acceptLanguage);
    if (browserLocale) {
      return browserLocale;
    }
  }

  // 3. Check geo location (Vercel provides this)
  const country = (request as any).geo?.country?.toLowerCase();
  if (country && localeCodes.includes(country as any)) {
    return country;
  }

  // 4. Default
  return defaultLocale;
}

function parseAcceptLanguage(header: string): string | null {
  const languages = header
    .split(',')
    .map(lang => {
      const [code, priority = 'q=1'] = lang.trim().split(';');
      return {
        code: code.split('-')[0].toLowerCase(),
        priority: parseFloat(priority.split('=')[1] || '1'),
      };
    })
    .sort((a, b) => b.priority - a.priority);

  // Map language codes to our locale codes
  const langToLocale: Record<string, string> = {
    en: 'us',
    de: 'de',
    fr: 'fr',
    es: 'es',
    it: 'it',
    pl: 'pl',
    uk: 'ua',
    cs: 'cz',
    bg: 'bg',
    sr: 'rs',
    sq: 'al',
    lv: 'lv',
    lt: 'lt',
    et: 'ee',
    ka: 'ge',
    hy: 'am',
    kk: 'kz',
    tr: 'tr',
    he: 'il',
    ar: 'sa',
    ja: 'jp',
    ko: 'kr',
    zh: 'cn',
  };

  for (const lang of languages) {
    const locale = langToLocale[lang.code];
    if (locale && localeCodes.includes(locale as any)) {
      return locale;
    }
  }

  return null;
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
