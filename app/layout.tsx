import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono, Work_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

// Institutional typography - avoiding generic Inter/Roboto
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IVYAR Governance Platform',
  description: 'Institutional governance infrastructure trusted by leading development institutions',
  keywords: ['governance', 'transparency', 'NATO', 'World Bank', 'USAID', 'digital infrastructure'],
  authors: [{ name: 'IVYAR LLC' }],
  openGraph: {
    title: 'IVYAR Governance Platform',
    description: 'Institutional governance infrastructure trusted by leading development institutions',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar-dark">
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${workSans.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
