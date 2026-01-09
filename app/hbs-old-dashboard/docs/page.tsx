'use client';

import { useState } from 'react';
import AIDocPanel from '@/components/hbs/ai/AIDocPanel';

export default function AIDocsPage() {
  const [lang, setLang] = useState('en');

  const exampleSections = ['Human Dignity', 'Transparency', 'Governance', 'Do No Harm', 'Risk Management', 'Community'];
  const exampleSearches = ['transparency', 'conflict of interest', 'ethical boundaries', 'financial controls', 'community participation', 'risk assessment'];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🧠 AI Documentation Intelligence</h1>
              <p className="text-purple-200">Smart explanations, search, and navigation</p>
            </div>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-white/20 text-white border border-white/30 rounded px-3 py-2">
              <option value="en">🇺🇸 English</option>
              <option value="uk">🇺🇦 Українська</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="pl">🇵🇱 Polski</option>
              <option value="es">🇪🇸 Español</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIDocPanel lang={lang} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">📚 Try Explaining</h3>
              <p className="text-sm text-gray-500 mb-2">Copy and paste into the panel:</p>
              <div className="flex flex-wrap gap-2">
                {exampleSections.map((sec) => (
                  <span key={sec} className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full cursor-pointer hover:bg-purple-200" onClick={() => navigator.clipboard.writeText(sec)}>{sec}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">🔍 Try Searching</h3>
              <p className="text-sm text-gray-500 mb-2">Copy and paste into the panel:</p>
              <div className="flex flex-wrap gap-2">
                {exampleSearches.map((s) => (
                  <span key={s} className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full cursor-pointer hover:bg-blue-200" onClick={() => navigator.clipboard.writeText(s)}>{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">✨ Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ AI-powered explanations</li>
                <li>✓ Intelligent search</li>
                <li>✓ Key points and examples</li>
                <li>✓ Risk identification</li>
                <li>✓ 6 languages supported</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}