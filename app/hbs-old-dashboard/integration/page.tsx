'use client';

import { useState } from 'react';

export default function IntegrationPage() {
  const [activeModule, setActiveModule] = useState('procurement');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const modules = [
    { id: 'procurement', name: 'Procurement', icon: '🛒' },
    { id: 'logistics', name: 'Logistics', icon: '🚚' },
    { id: 'donor', name: 'Donor', icon: '💰' },
  ];

  const scenarios: Record<string, any> = {
    procurement: { action: 'purchase', context: { amount: 75000, vendor: 'MedSupply Inc', urgency: 'normal', category: 'medical' } },
    logistics: { action: 'dispatch', context: { destination: 'Kharkiv Region', items: ['medical supplies'], beneficiaries: 5000, urgency: 'emergency' } },
    donor: { action: 'accept', context: { amount: 500000, donor: 'Global Health Foundation', purpose: 'Emergency response', restrictions: ['medical only'] } },
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/check/' + activeModule, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenarios[activeModule])
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">🔗 Cross-Module Integration</h1>
          <p className="text-indigo-200">HBS governance checks for Procurement, Logistics, Donor</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {modules.map((m) => (
            <button key={m.id} onClick={() => { setActiveModule(m.id); setResult(null); }} className={'p-4 rounded-lg border-2 ' + (activeModule === m.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white')}>
              <span className="text-3xl">{m.icon}</span>
              <p className="font-bold text-gray-900 mt-2">{m.name}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-gray-900 mb-4">📋 Scenario</h3>
            <pre className="bg-gray-50 p-4 rounded text-sm text-gray-700">{JSON.stringify(scenarios[activeModule], null, 2)}</pre>
            <button onClick={handleCheck} disabled={loading} className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg">{loading ? '...' : '🔍 Run Check'}</button>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-bold text-gray-900 mb-4">📊 Results</h3>
            {!result ? <p className="text-gray-500">Click Run Check</p> : (
              <div className="space-y-3">
                <p className={'inline-block px-3 py-1 rounded text-sm font-medium ' + (result.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : result.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700')}>{result.riskLevel?.toUpperCase()} - Score: {result.riskScore}</p>
                <div>
                  <h4 className="font-semibold text-gray-900">Warnings</h4>
                  {result.warnings?.map((w: string, i: number) => <p key={i} className="text-sm text-orange-600">• {w}</p>)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Requirements</h4>
                  {result.requirements?.map((r: string, i: number) => <p key={i} className="text-sm text-gray-700">• {r}</p>)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Boundaries</h4>
                  {result.boundaries?.map((b: any) => <span key={b.id} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded mr-1">{b.rule}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg border p-6">
          <h3 className="font-bold text-gray-900 mb-4">🔌 API Endpoints</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded"><code className="text-blue-600 text-sm">POST /api/hbs/check/procurement</code></div>
            <div className="bg-gray-50 p-3 rounded"><code className="text-green-600 text-sm">POST /api/hbs/check/logistics</code></div>
            <div className="bg-gray-50 p-3 rounded"><code className="text-purple-600 text-sm">POST /api/hbs/check/donor</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}