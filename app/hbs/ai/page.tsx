'use client';

import { useState } from 'react';

export default function AIPage() {
  const [scenario, setScenario] = useState('');
  const [context, setContext] = useState({ amount: '', urgency: 'medium' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, context: { amount: context.amount ? parseInt(context.amount) : undefined, urgency: context.urgency } })
      });
      const data = await res.json();
      if (data.success) setResult(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const colors: Record<string, string> = {
    critical: 'bg-red-900/50 border-red-500 text-red-300',
    high: 'bg-orange-900/50 border-orange-500 text-orange-300',
    medium: 'bg-yellow-900/50 border-yellow-500 text-yellow-300',
    low: 'bg-green-900/50 border-green-500 text-green-300'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-cyan-800 to-blue-800 p-6">
        <h1 className="text-2xl font-bold">🤖 AI Recommendations</h1>
      </div>
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="font-bold mb-4">Scenario</h2>
          <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-3" placeholder="Describe situation..." />
          <div className="flex gap-3 mt-4">
            <input type="number" placeholder="Amount" value={context.amount} onChange={(e) => setContext({...context, amount: e.target.value})} className="flex-1 bg-gray-900 border border-gray-700 rounded p-2" />
            <select value={context.urgency} onChange={(e) => setContext({...context, urgency: e.target.value})} className="bg-gray-900 border border-gray-700 rounded p-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <button onClick={analyze} disabled={loading} className="w-full mt-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 rounded font-bold">
            {loading ? 'Analyzing...' : 'Get Recommendations'}
          </button>
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-400">Examples:</p>
            {['Emergency food for 5000 families', 'New partner requesting $150K', 'Whistleblower report received'].map((ex, i) => (
              <button key={i} onClick={() => setScenario(ex)} className="block w-full text-left text-sm p-2 bg-gray-700 hover:bg-gray-600 rounded">{ex}</button>
            ))}
          </div>
        </div>
        <div>
          {result ? (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded border ${colors[result.analysis.riskLevel]}`}>{result.analysis.riskLevel.toUpperCase()}</span>
                  <span className="text-3xl font-bold text-cyan-400">{result.analysis.riskScore}</span>
                </div>
                <p className="mt-4 font-bold">{result.analysis.recommendedPath.title}</p>
                <p className="text-sm text-gray-400">{result.analysis.recommendedPath.description}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-3">Recommendations</h3>
                {result.analysis.recommendations.map((r: any, i: number) => (
                  <div key={i} className={`p-3 mb-2 rounded border ${colors[r.priority]}`}>
                    <p className="font-bold">{r.title}</p>
                    <p className="text-sm">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-5xl mb-4">🤖</p>
              <p className="text-gray-400">Enter a scenario to get AI recommendations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}