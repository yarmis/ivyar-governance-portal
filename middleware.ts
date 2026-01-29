import { NextRequest, NextResponse } from 'next/server';
import { localeCodes, defaultLocale } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;
const EXCLUDED_PATHS = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/sitemap',
  '/demo',
  '/pricing',
  '/faq',
  '/support',
  '/roadmap',
  '/docs',
  '/academy',
  '/about',
  '/contact',
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_FILE.test(pathname) ||
    EXCLUDED_PATHS.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = localeCodes.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const cookieLocale = request.cookies.get('IVYAR_LOCALE')?.value;
    const acceptLanguage = request.headers.get('accept-language');
    
    let detectedLocale = defaultLocale;
    
    if (cookieLocale && localeCodes.includes(cookieLocale as any)) {
      detectedLocale = cookieLocale as typeof defaultLocale;
    } else if (acceptLanguage) {
      const browserLang = acceptLanguage.split(',')[0].split('-')[0];
      const langToLocale: Record<string, string> = {
        en: 'us',
        uk: 'ua',
        de: 'de',
        fr: 'fr',
        es: 'es',
        pl: 'pl',
        ja: 'jp',
        ko: 'kr',
        zh: 'cn',
        ar: 'sa',
        he: 'il',
        tr: 'tr',
      };
      if (langToLocale[browserLang]) {
        detectedLocale = langToLocale[browserLang] as typeof defaultLocale;
      }
    }

    return NextResponse.redirect(new URL(`/${detectedLocale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
