'use client';

import { useState } from 'react';

export default function AIDocPanel({ lang = 'en' }: { lang?: string }) {
  const [tab, setTab] = useState('explain');
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!section.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/ai/explain', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, lang }) });
      const data = await res.json();
      if (data.success) setResult({ type: 'explain', data: data.explanation });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/ai/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, lang }) });
      const data = await res.json();
      if (data.success) setResult({ type: 'search', data: data.results, count: data.resultsCount });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex border-b border-gray-200">
        <button onClick={() => setTab('explain')} className={"flex-1 px-4 py-3 text-sm font-medium " + (tab === 'explain' ? 'bg-blue-50 text-blue-700' : 'text-gray-600')}>Explain</button>
        <button onClick={() => setTab('search')} className={"flex-1 px-4 py-3 text-sm font-medium " + (tab === 'search' ? 'bg-blue-50 text-blue-700' : 'text-gray-600')}>Search</button>
      </div>
      <div className="p-4">
        {tab === 'explain' ? (
          <div>
            <textarea value={section} onChange={(e) => setSection(e.target.value)} placeholder="Enter section to explain..." className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" />
            <button onClick={handleExplain} disabled={loading} className="w-full mt-2 py-2 bg-blue-600 text-white rounded">{loading ? '...' : 'Explain'}</button>
          </div>
        ) : (
          <div>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Search documentation..." className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" />
            <button onClick={handleSearch} disabled={loading} className="w-full mt-2 py-2 bg-blue-600 text-white rounded">{loading ? '...' : 'Search'}</button>
          </div>
        )}
        {result && result.type === 'explain' && result.data && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-800 mb-4">{result.data.summary}</p>
            <h4 className="font-semibold text-gray-900 mb-2">📌 Key Points</h4>
            <ul className="mb-4">{result.data.keyPoints.map((p: string, i: number) => <li key={i} className="text-sm text-gray-700 mb-1">• {p}</li>)}</ul>
            <h4 className="font-semibold text-gray-900 mb-2">💡 Example</h4>
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded mb-4">{result.data.example}</p>
            <h4 className="font-semibold text-gray-900 mb-2">⚠️ Risks</h4>
            <ul>{result.data.risks.map((r: string, i: number) => <li key={i} className="text-sm text-orange-700 mb-1">• {r}</li>)}</ul>
          </div>
        )}
        {result && result.type === 'search' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">{result.count} results</p>
            {result.data.map((item: any) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.type}</span>
                <p className="font-medium text-gray-900 mt-1">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}