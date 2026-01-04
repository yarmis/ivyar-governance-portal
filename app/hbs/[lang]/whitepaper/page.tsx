import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { parseMarkdown } from '@/lib/markdown/parser';
import MarkdownRenderer from '@/components/hbs/viewers/MarkdownRenderer';
import WhitepaperNav from '@/components/hbs/navigation/WhitepaperNav';

const languages = ['en', 'uk', 'de', 'fr', 'pl', 'es'];

const titles: Record<string, string> = {
  en: 'HBS Whitepaper v1.0',
  uk: 'HBS Whitepaper v1.0',
  de: 'HBS Whitepaper v1.0',
  fr: 'Livre Blanc HBS v1.0',
  pl: 'HBS Whitepaper v1.0',
  es: 'Libro Blanco HBS v1.0'
};

const subtitles: Record<string, string> = {
  en: 'Humanitarian Budget Support Framework',
  uk: 'Рамка Гуманітарної Бюджетної Підтримки',
  de: 'Rahmenwerk für Humanitäre Budgetunterstützung',
  fr: 'Cadre de Soutien Budgétaire Humanitaire',
  pl: 'Ramy Humanitarnego Wsparcia Budżetowego',
  es: 'Marco de Apoyo Presupuestario Humanitario'
};

export default function WhitepaperLangPage({ params }: { params: { lang: string } }) {
  const lang = params.lang;

  if (!languages.includes(lang)) {
    notFound();
  }

  // Try to load language-specific file, fallback to English
  let filePath = path.join(process.cwd(), `docs/hbs/${lang}/WHITEPAPER.md`);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'docs/hbs/en/WHITEPAPER.md');
  }

  const source = fs.readFileSync(filePath, 'utf-8');
  const doc = parseMarkdown(source);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {titles[lang]}
            </h1>
            <p className="text-blue-200">{subtitles[lang]}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <MarkdownRenderer html={doc.html} light />
          </div>
        </div>

        <div className="lg:col-span-1">
          <WhitepaperNav headings={doc.headings} />
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}