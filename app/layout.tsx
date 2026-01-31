import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'IVYAR Governance Platform',
  description: 'AI-Powered Constitutional Oversight',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} font-sans`}>
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen">
        <div className="bg-red-600 text-white p-10 text-4xl font-bold rounded-2xl m-10">
          TAILWIND ТЕСТ — якщо бачиш великий червоний блок, Tailwind працює!
        </div>
        {children}
      </body>
    </html>
  );
}
