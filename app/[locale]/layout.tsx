// app/[locale]/layout.tsx
import { localeCodes, getLocaleByCode } from '@/i18n/config';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 15+
  const { locale: localeCode } = await params;

  // Validate locale
  if (!localeCodes.includes(localeCode as any)) {
    notFound();
  }

  const locale = getLocaleByCode(localeCode);

  return (
    <div dir={locale.dir} lang={locale.lang}>
      {children}
    </div>
  );
}
