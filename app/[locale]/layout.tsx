// app/[locale]/layout.tsx
import { localeCodes, getLocaleByCode } from '@/i18n/config';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!localeCodes.includes(params.locale as any)) {
    notFound();
  }

  const locale = getLocaleByCode(params.locale);

  return (
    <div dir={locale.dir} lang={locale.lang}>
      {children}
    </div>
  );
}
