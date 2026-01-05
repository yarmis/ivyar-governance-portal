'use client';

import { useState, useEffect } from 'react';

export default function AutopilotPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mission');
  const [liveFeed, setLiveFeed] = useState<any[]>([]);

  const loadData = async (action: string) => {
    try {
      const res = await fetch('/api/hbs/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const result = await res.json();
      setData((prev: any) => ({ ...prev, [action]: result }));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([
        loadData('status'),
        loadData('mission-control'),
        loadData('live-feed')
      ]);
      setLoading(false);
    };
    loadAll();
    const interval = setInterval(() => loadData('live-feed'), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data['live-feed']?.feed) setLiveFeed(data['live-feed'].feed);
  }, [data['live-feed']]);

  const tabs = [
    { id: 'mission', name: '🎯 Mission Control' },
    { id: 'engine', name: '🧠 Autonomous Engine' },
    { id: 'predictive', name: '🔮 Predictions' },
    { id: 'compliance', name: '🛡️ Compliance' }
  ];

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center"><span className="text-6xl animate-pulse">🤖</span></div>;

  const status = data['status'];
  const mission = data['mission-control'];

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="py-2 px-4 text-center text-white font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 animate-pulse">
        🤖 AUTOPILOT ENGAGED • Mode: {status?.autopilot?.mode || 'FULL_AUTONOMOUS'} • Confidence: {status?.autopilot?.confidence || 97.8}%
      </div>

      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 py-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className="text-6xl">🤖</span>
              <div>
                <p className="text-cyan-400 text-sm font-mono">VERSION 7.0</p>
                <h1 className="text-4xl font-bold text-white">Global Governance Autopilot</h1>
                <p className="text-gray-400">Autonomous Decision Engine • Zero-Touch Operations</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <MetricBox label="Decisions Today" value="45,678" color="cyan" />
              <MetricBox label="Auto-Approved" value="44,892" color="green" />
              <MetricBox label="Accuracy" value="99.2%" color="emerald" />
              <MetricBox label="Time Saved" value="1,456h" color="purple" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={'px-5 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {activeTab === 'mission' && (
              <>
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">📊 Real-Time Metrics</h3>
                  <div className="grid grid-cols-6 gap-3">
                    <StatBox label="TXN/sec" value={mission?.realTimeMetrics?.transactionsPerSecond || 528} />
                    <StatBox label="Decisions/min" value={mission?.realTimeMetrics?.decisionsPerMinute || 762} />
                    <StatBox label="Active Users" value="12,456" />
                    <StatBox label="Workflows" value="3,456" />
                    <StatBox label="Pending" value="234" />
                    <StatBox label="Load" value="45%" color="green" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">🌍 Regional Status</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { region: 'Europe', load: 42, decisions: 12456 },
                      { region: 'Africa', load: 58, decisions: 18234 },
                      { region: 'Asia', load: 51, decisions: 15678 },
                      { region: 'Americas', load: 38, decisions: 8456 }
                    ].map(r => (
                      <div key={r.region} className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{r.region}</span>
                          <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between"><span className="text-gray-400">Load</span><span className="text-white">{r.load}%</span></div>
                          <div className="flex justify-between"><span className="text-gray-400">Decisions</span><span className="text-white">{r.decisions.toLocaleString()}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">🧠 AI Model Confidence</h3>
                  <div className="space-y-3">
                    {[
                      { model: 'Transaction Approval', confidence: 99.2 },
                      { model: 'Risk Assessment', confidence: 97.8 },
                      { model: 'Demand Forecast', confidence: 91.5 },
                      { model: 'Fraud Detection', confidence: 98.9 }
                    ].map(ai => (
                      <div key={ai.model} className="flex items-center gap-4">
                        <span className="text-gray-300 w-48">{ai.model}</span>
                        <div className="flex-1 h-3 bg-gray-700 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${ai.confidence}%` }}></div>
                        </div>
                        <span className="text-white font-mono w-16">{ai.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'engine' && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">⚙️ Autonomous Capabilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Zero-Touch Approvals', icon: '✅', processed: 44892, accuracy: '99.2%' },
                    { name: 'Self-Healing Workflows', icon: '🔄', processed: 228, accuracy: '97.4%' },
                    { name: 'Predictive Escalation', icon: '⬆️', processed: 678, accuracy: '94.5%' },
                    { name: 'Auto-Optimization', icon: '⚡', processed: 456, accuracy: '96.3%' }
                  ].map(c => (
                    <div key={c.name} className="bg-gray-700/50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{c.icon}</span>
                        <h4 className="text-white font-bold">{c.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2 rounded text-center">
                          <p className="text-white font-bold">{c.processed.toLocaleString()}</p>
                          <p className="text-gray-500 text-xs">Processed</p>
                        </div>
                        <div className="bg-gray-800 p-2 rounded text-center">
                          <p className="text-green-400 font-bold">{c.accuracy}</p>
                          <p className="text-gray-500 text-xs">Accuracy</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'predictive' && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-4">📈 Demand Forecast</h3>
                  <div className="space-y-3">
                    {[
                      { region: '🌍 Africa', change: '+16.7%', confidence: 89 },
                      { region: '🌏 Asia', change: '+9.8%', confidence: 87 },
                      { region: '🇪🇺 Europe', change: '-5.5%', confidence: 92 },
                      { region: '🌎 Americas', change: '+21.4%', confidence: 85 }
                    ].map((p, i) => (
                      <div key={i} className="p-4 bg-gray-700/30 rounded-lg flex justify-between">
                        <span className="text-white">{p.region}</span>
                        <div className="text-right">
                          <span className={p.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{p.change}</span>
                          <span className="text-gray-500 text-xs ml-2">{p.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">🛡️ Compliance Status</h3>
                  <span className="px-4 py-2 bg-green-900 text-green-300 rounded-lg font-bold">98.5%</span>
                </div>
                <div className="space-y-3">
                  {['USAID ADS 303', 'EU GDPR', 'IATI 2.03', 'UN OCHA', 'World Bank PFM'].map((f, i) => (
                    <div key={f} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-green-400">✓</span>
                      <span className="text-white flex-1">{f}</span>
                      <span className="text-green-400">{99 - i}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3">💚 Health</h3>
              {['Decision Engine', 'Predictions', 'Global Sync', 'Compliance'].map((h, i) => (
                <div key={h} className="flex justify-between items-center py-2">
                  <span className="text-gray-300 text-sm">{h}</span>
                  <span className="text-green-400 text-sm">{99.9 - i * 0.3}%</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>Live Feed
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {liveFeed.slice(0, 8).map((item: any) => (
                  <div key={item.id} className="p-2 bg-gray-700/30 rounded border-l-2 border-green-500">
                    <div className="flex items-center gap-2">
                      <span>{item.country}</span>
                      <span className="text-cyan-400 text-xs ml-auto">🤖</span>
                    </div>
                    <p className="text-gray-300 text-sm">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyan-900/30 rounded-xl p-4 border border-cyan-700">
              <h3 className="text-white font-bold mb-3">📊 Today</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Decisions</span><span className="text-white font-bold">45,678</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Auto-Approved</span><span className="text-green-400 font-bold">44,892</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Escalated</span><span className="text-yellow-400 font-bold">678</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Savings</span><span className="text-emerald-400 font-bold">$892K</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = { cyan: 'bg-cyan-900/50 text-cyan-300', green: 'bg-green-900/50 text-green-300', emerald: 'bg-emerald-900/50 text-emerald-300', purple: 'bg-purple-900/50 text-purple-300' };
  return <div className={`px-4 py-3 rounded-lg ${colors[color]}`}><p className="text-2xl font-bold">{value}</p><p className="text-xs opacity-80">{label}</p></div>;
}

function StatBox({ label, value, color }: { label: string; value: any; color?: string }) {
  return <div className="bg-gray-700/50 p-3 rounded-lg text-center"><p className={`text-xl font-bold ${color === 'green' ? 'text-green-400' : 'text-white'}`}>{value}</p><p className="text-gray-400 text-xs">{label}</p></div>;
}
