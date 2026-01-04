import { notFound } from 'next/navigation';
import Link from 'next/link';

const languages = ['en', 'uk', 'de', 'fr', 'pl', 'es'];

const content: Record<string, any> = {
  en: { title: 'Humanitarian Budget Support (HBS)', subtitle: 'Ethical, transparent, and accountable', description: 'The HBS Module provides a comprehensive framework.', modules: [{ title: 'Whitepaper', desc: 'Documentation', href: 'whitepaper', icon: '📄', status: 'Active' }, { title: 'Governance', desc: 'Decision-making', href: 'governance', icon: '⚖️', status: 'Active' }, { title: 'Education', desc: 'Training', href: 'education', icon: '🎓', status: 'Active' }] },
  uk: { title: 'Гуманітарна Бюджетна Підтримка (HBS)', subtitle: 'Етична, прозора та підзвітна', description: 'Модуль HBS забезпечує комплексну рамку.', modules: [{ title: 'Whitepaper', desc: 'Документація', href: 'whitepaper', icon: '📄', status: 'Активний' }, { title: 'Управління', desc: 'Рішення', href: 'governance', icon: '⚖️', status: 'Активний' }, { title: 'Освіта', desc: 'Навчання', href: 'education', icon: '🎓', status: 'Активний' }] },
  de: { title: 'Humanitäre Budgetunterstützung (HBS)', subtitle: 'Ethisch und transparent', description: 'Das HBS-Modul bietet einen Rahmen.', modules: [{ title: 'Whitepaper', desc: 'Dokumentation', href: 'whitepaper', icon: '📄', status: 'Aktiv' }, { title: 'Governance', desc: 'Entscheidung', href: 'governance', icon: '⚖️', status: 'Aktiv' }, { title: 'Bildung', desc: 'Schulung', href: 'education', icon: '🎓', status: 'Aktiv' }] },
  fr: { title: 'Soutien Budgétaire Humanitaire (HBS)', subtitle: 'Éthique et transparent', description: 'Le module HBS fournit un cadre.', modules: [{ title: 'Livre Blanc', desc: 'Documentation', href: 'whitepaper', icon: '📄', status: 'Actif' }, { title: 'Gouvernance', desc: 'Décision', href: 'governance', icon: '⚖️', status: 'Actif' }, { title: 'Éducation', desc: 'Formation', href: 'education', icon: '🎓', status: 'Actif' }] },
  pl: { title: 'Humanitarne Wsparcie Budżetowe (HBS)', subtitle: 'Etyczne i przejrzyste', description: 'Moduł HBS zapewnia ramy.', modules: [{ title: 'Whitepaper', desc: 'Dokumentacja', href: 'whitepaper', icon: '📄', status: 'Aktywny' }, { title: 'Zarządzanie', desc: 'Decyzje', href: 'governance', icon: '⚖️', status: 'Aktywny' }, { title: 'Edukacja', desc: 'Szkolenia', href: 'education', icon: '🎓', status: 'Aktywny' }] },
  es: { title: 'Apoyo Presupuestario Humanitario (HBS)', subtitle: 'Ético y transparente', description: 'El módulo HBS proporciona un marco.', modules: [{ title: 'Libro Blanco', desc: 'Documentación', href: 'whitepaper', icon: '📄', status: 'Activo' }, { title: 'Gobernanza', desc: 'Decisión', href: 'governance', icon: '⚖️', status: 'Activo' }, { title: 'Educación', desc: 'Formación', href: 'education', icon: '🎓', status: 'Activo' }] }
};

export default function LangPage({ params }: { params: { lang: string } }) {
  if (!languages.includes(params.lang)) notFound();
  const t = content[params.lang];
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-blue-100">{t.subtitle}</p>
      </div>
      <p className="text-gray-600 mb-8">{t.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.modules.map((m: any) => (
          <Link key={m.href} href={"/hbs/" + params.lang + "/" + m.href} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{m.icon}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">{m.status}</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{m.title}</h3>
            <p className="text-gray-600 text-sm">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}