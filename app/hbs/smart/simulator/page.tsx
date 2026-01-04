'use client';

import { useState } from 'react';

export default function SimulatorPage() {
  const [scenario, setScenario] = useState('emergency-funding');
  const [decision, setDecision] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = [
    { id: 'emergency-funding', name: '💰 Emergency Funding Decision', desc: 'Crisis requires immediate $500K reallocation' },
    { id: 'partner-misconduct', name: '⚠️ Partner Misconduct', desc: 'Partner inflating beneficiary numbers by 20%' },
    { id: 'community-conflict', name: '🤝 Community Conflict', desc: 'Two communities in conflict over resources' },
  ];

  const runSimulation = async (selectedDecision: string) => {
    setLoading(true);
    setDecision(selectedDecision);
    try {
      const res = await fetch('/api/hbs/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, decision: selectedDecision, context: {} })
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadScenario = async () => {
    setLoading(true);
    setDecision('');
    try {
      const res = await fetch('/api/hbs/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, decision: '', context: {} })
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getOutcomeColor = (outcome: string) => {
    if (outcome === 'positive') return 'bg-green-100 text-green-700 border-green-300';
    if (outcome === 'negative') return 'bg-red-100 text-red-700 border-red-300';
    if (outcome === 'balanced') return 'bg-blue-100 text-blue-700 border-blue-300';
    return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">🎮 Governance Simulator</h1>
          <p className="text-purple-100">Make decisions, see consequences, learn from outcomes</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Select Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => { setScenario(s.id); setResult(null); setDecision(''); }}
                className={'p-4 rounded-lg border-2 text-left transition-all ' + (scenario === s.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300')}
              >
                <p className="font-bold text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </button>
            ))}
          </div>
          <button
            onClick={loadScenario}
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300"
          >
            {loading ? 'Loading...' : '🎮 Start Simulation'}
          </button>
        </div>

        {result && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.scenario}</h2>
              <p className="text-gray-700 mb-4">{result.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">📊 Initial State</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.initialState && Object.entries(result.initialState).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded border">
                      <p className="text-xs text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="font-bold text-gray-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-3">🤔 Make Your Decision</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.availableDecisions?.map((d: any) => (
                  <button
                    key={d.id}
                    onClick={() => runSimulation(d.id)}
                    disabled={loading}
                    className={'p-4 rounded-lg border-2 text-left transition-all ' + (decision === d.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50')}
                  >
                    <p className="font-medium text-gray-900">{d.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {decision && result.result && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">📈 Simulation Results</h2>
                  <span className={'px-4 py-2 rounded-full font-medium border ' + getOutcomeColor(result.result.outcome)}>
                    {result.result.outcome?.toUpperCase()} OUTCOME
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">{result.result.ethicalScore}</p>
                    <p className="text-sm text-gray-500">Ethical Score</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{result.result.governanceCompliance}</p>
                    <p className="text-sm text-gray-500">Governance Compliance</p>
                  </div>
                  <div className={'p-4 rounded-lg text-center ' + (result.result.riskLevel === 'critical' ? 'bg-red-50' : result.result.riskLevel === 'high' ? 'bg-orange-50' : 'bg-green-50')}>
                    <p className="text-xl font-bold">{result.result.riskLevel?.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">Risk Level</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">📊 Consequences</h3>
                  <div className="space-y-2">
                    {result.result.consequences?.map((c: any, i: number) => (
                      <div key={i} className={'p-3 rounded-lg flex justify-between items-center ' + (c.type === 'positive' ? 'bg-green-50' : c.type === 'negative' ? 'bg-red-50' : 'bg-gray-50')}>
                        <span className="text-gray-800">{c.text}</span>
                        <span className={'font-bold ' + (c.impact > 0 ? 'text-green-600' : 'text-red-600')}>
                          {c.impact > 0 ? '+' : ''}{c.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">👥 Stakeholder Satisfaction</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {result.result.stakeholderSatisfaction && Object.entries(result.result.stakeholderSatisfaction).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 capitalize">{key}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className={'h-full rounded-full ' + (Number(value) >= 70 ? 'bg-green-500' : Number(value) >= 40 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${value}%` }} />
                          </div>
                          <span className="text-sm font-bold">{String(value)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">🛡️ Boundaries Triggered</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.result.boundariesTriggered?.map((b: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{b}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🔮 Long-term Effects</h3>
                    <ul className="space-y-1">
                      {result.result.longTermEffects?.map((e: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">• {e}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">💡 Lessons Learned</h3>
                    <ul className="space-y-1">
                      {result.result.lessonsLearned?.map((l: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">• {l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}