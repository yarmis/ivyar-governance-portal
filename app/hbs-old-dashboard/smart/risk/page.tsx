'use client';

import { useState } from 'react';

export default function RiskEnginePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [context, setContext] = useState({
    amount: 250000,
    beneficiaries: 5000,
    urgency: 'urgent',
    location: 'Eastern Ukraine',
    category: 'medical',
    partners: ['Local NGO', 'Ministry of Health'],
    duration: 12,
    vulnerableGroups: true,
    communityConsent: true,
    environmentalImpact: 'low'
  });

  const analyzeRisk = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/risk-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', context, realtime: true })
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">⚡ Ethical Risk Engine</h1>
          <p className="text-orange-100">Real-time multi-factor risk analysis with boundary monitoring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">📝 Context Parameters</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Amount ($)</label>
                  <input type="number" value={context.amount} onChange={(e) => setContext({...context, amount: Number(e.target.value)})} className="w-full p-2 border rounded text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Beneficiaries</label>
                  <input type="number" value={context.beneficiaries} onChange={(e) => setContext({...context, beneficiaries: Number(e.target.value)})} className="w-full p-2 border rounded text-gray-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Urgency</label>
                  <select value={context.urgency} onChange={(e) => setContext({...context, urgency: e.target.value})} className="w-full p-2 border rounded text-gray-900">
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Duration (months)</label>
                  <input type="number" value={context.duration} onChange={(e) => setContext({...context, duration: Number(e.target.value)})} className="w-full p-2 border rounded text-gray-900" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Location</label>
                <input type="text" value={context.location} onChange={(e) => setContext({...context, location: e.target.value})} className="w-full p-2 border rounded text-gray-900" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select value={context.category} onChange={(e) => setContext({...context, category: e.target.value})} className="w-full p-2 border rounded text-gray-900">
                  <option value="medical">Medical</option>
                  <option value="food">Food</option>
                  <option value="shelter">Shelter</option>
                  <option value="education">Education</option>
                  <option value="financial">Financial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Environmental Impact</label>
                <select value={context.environmentalImpact} onChange={(e) => setContext({...context, environmentalImpact: e.target.value})} className="w-full p-2 border rounded text-gray-900">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={context.vulnerableGroups} onChange={(e) => setContext({...context, vulnerableGroups: e.target.checked})} />
                  <span className="text-sm text-gray-700">Vulnerable Groups</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={context.communityConsent} onChange={(e) => setContext({...context, communityConsent: e.target.checked})} />
                  <span className="text-sm text-gray-700">Community Consent</span>
                </label>
              </div>
            </div>

            <button onClick={analyzeRisk} disabled={loading} className="w-full mt-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300">
              {loading ? 'Analyzing...' : '⚡ Analyze Risk'}
            </button>
          </div>

          <div className="space-y-6">
            {result && (
              <>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Overall Risk Assessment</h3>
                    <span className={'px-4 py-2 rounded-full font-bold text-white ' + getRiskBg(result.overallScore)}>
                      {result.riskLevel?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={'h-full transition-all ' + getRiskBg(result.overallScore)} style={{width: `${result.overallScore}%`}} />
                      </div>
                    </div>
                    <span className={'text-3xl font-bold ' + getRiskColor(result.overallScore)}>{result.overallScore}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {result.risks?.map((r: any) => (
                      <div key={r.category} className="text-center">
                        <div className={'w-full h-2 rounded ' + (r.color === 'red' ? 'bg-red-500' : r.color === 'orange' ? 'bg-orange-500' : 'bg-green-500')} />
                        <p className="text-xs text-gray-600 mt-1">{r.category}</p>
                        <p className="font-bold text-sm">{r.score}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {result.criticalAlerts?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-bold text-red-800 mb-2">🚨 Critical Alerts</h3>
                    {result.criticalAlerts.map((a: string, i: number) => (
                      <p key={i} className="text-red-700 text-sm">• {a}</p>
                    ))}
                  </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">🛡️ Boundary Conditions</h3>
                  <div className="space-y-2">
                    {result.boundaryConditions?.map((b: any) => (
                      <div key={b.id} className={'p-3 rounded-lg flex justify-between items-center ' + (b.status === 'AT_RISK' ? 'bg-red-50' : b.status === 'ACTIVE' ? 'bg-yellow-50' : 'bg-blue-50')}>
                        <div>
                          <span className="font-medium text-gray-900">{b.id}: {b.rule}</span>
                          <p className="text-xs text-gray-600">{b.action}</p>
                        </div>
                        <span className={'text-xs px-2 py-1 rounded ' + (b.status === 'AT_RISK' ? 'bg-red-200 text-red-800' : b.status === 'ACTIVE' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800')}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">📋 Governance Requirements</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Approval Required</p>
                      <p className="font-bold text-gray-900">{result.governance?.approvalRequired ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Approval Level</p>
                      <p className="font-bold text-gray-900">{result.governance?.approvalLevel}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Documentation</p>
                      <p className="font-bold text-gray-900">{result.governance?.documentationLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">💡 Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations?.map((r: string, i: number) => (
                      <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="text-blue-500">→</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-3">🔧 Mitigation Strategies</h3>
                  <div className="space-y-2">
                    {result.mitigationStrategies?.map((m: any, i: number) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900">{m.category}</span>
                          <span className={'text-xs px-2 py-1 rounded ' + (m.priority === 'Immediate' ? 'bg-red-100 text-red-700' : m.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700')}>
                            {m.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{m.strategy}</p>
                        <p className="text-xs text-gray-400 mt-1">Owner: {m.owner}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}