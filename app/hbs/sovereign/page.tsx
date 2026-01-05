'use client';

import { useState, useEffect } from 'react';

export default function SovereignPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/hbs/sovereign-cloud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'federation-status' })
        });
        const result = await res.json();
        setData(result);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center"><span className="text-6xl animate-pulse">🏛️</span></div>;

  const regionColors: Record<string, string> = {
    Europe: 'from-blue-600 to-indigo-600',
    Africa: 'from-orange-600 to-red-600',
    Asia: 'from-green-600 to-teal-600',
    Americas: 'from-purple-600 to-pink-600'
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-6xl">🏛️</span>
            <div>
              <p className="text-indigo-200 text-sm font-mono">SOVEREIGN EDITION v5.0</p>
              <h1 className="text-4xl font-bold text-white">National Governance Cloud</h1>
              <p className="text-purple-200">Federated | Multi-Ministry | Sovereign Data</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-900/50 text-indigo-300 px-4 py-3 rounded-lg text-center">
            <p className="text-3xl font-bold">{data.statistics?.totalCountries || 8}</p>
            <p className="text-sm">Countries</p>
          </div>
          <div className="bg-green-900/50 text-green-300 px-4 py-3 rounded-lg text-center">
            <p className="text-3xl font-bold">{data.statistics?.activeNodes || 5}</p>
            <p className="text-sm">Active Nodes</p>
          </div>
          <div className="bg-purple-900/50 text-purple-300 px-4 py-3 rounded-lg text-center">
            <p className="text-3xl font-bold">{data.statistics?.totalMinistries || 36}</p>
            <p className="text-sm">Ministries</p>
          </div>
          <div className="bg-pink-900/50 text-pink-300 px-4 py-3 rounded-lg text-center">
            <p className="text-3xl font-bold">{data.statistics?.avgCompliance || 96.8}%</p>
            <p className="text-sm">Compliance</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">🗺️ Federation Nodes</h3>
          <div className="grid grid-cols-4 gap-4">
            {['Europe', 'Africa', 'Asia', 'Americas'].map(region => {
              const nodes = (data.nodes || []).filter((n: any) => n.region === region);
              return (
                <div key={region} className={`bg-gradient-to-br ${regionColors[region]} p-4 rounded-xl`}>
                  <h4 className="text-white font-bold text-lg mb-2">{region}</h4>
                  <div className="space-y-2">
                    {nodes.length > 0 ? nodes.map((n: any) => (
                      <div key={n.code} className="flex items-center gap-2 bg-white/10 p-2 rounded">
                        <span className="text-xl">{n.flag}</span>
                        <span className="text-white text-sm">{n.name}</span>
                        <span className={`ml-auto w-2 h-2 rounded-full ${n.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                      </div>
                    )) : (
                      <p className="text-white/60 text-sm">Coming soon</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">🔐 Sovereignty Principles</h3>
            <div className="space-y-3">
              {[
                { icon: '🏛️', name: 'Data Sovereignty', desc: 'All data within borders' },
                { icon: '🔐', name: 'Government Control', desc: 'Full administrative control' },
                { icon: '🔗', name: 'Interoperability', desc: 'National e-gov integration' },
                { icon: '🛡️', name: 'Resilience', desc: 'Offline capability & DR' }
              ].map(p => (
                <div key={p.name} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">📦 Deployment Kit</h3>
            <div className="space-y-3">
              {[
                { icon: '📦', name: 'Installation Package', size: '2.4 GB' },
                { icon: '📚', name: 'Documentation', size: '900+ pages' },
                { icon: '📋', name: 'Policy Templates', size: '16 templates' },
                { icon: '🎓', name: 'Training Materials', size: '84+ hours' }
              ].map(item => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white">{item.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{item.size}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">🏛️ Governance Council</h3>
            <div className="space-y-3">
              <div className="p-3 bg-indigo-900/30 border border-indigo-700 rounded-lg">
                <p className="text-white font-medium">Chair: Ukraine 🇺🇦</p>
                <p className="text-indigo-300 text-sm">Vice-Chair: Kenya 🇰🇪</p>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Next Meeting</p>
                <p className="text-white font-bold">January 20, 2026</p>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-400 text-sm">Decisions Made</p>
                <p className="text-white font-bold">45 decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
