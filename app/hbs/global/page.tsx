'use client';

import { useState, useEffect } from 'react';

export default function GlobalNetworkPage() {
  const [activeTab, setActiveTab] = useState('network');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadData = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const result = await res.json();
      setData((prev: any) => ({ ...prev, [action]: result }));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    loadData('network-status');
    loadData('regional-hubs');
  }, []);

  const tabs = [
    { id: 'network', name: '🌐 Network', load: 'network-status' },
    { id: 'hubs', name: '🏛️ Regional Hubs', load: 'regional-hubs' },
    { id: 'crossborder', name: '🔗 Cross-Border', load: 'cross-border' },
    { id: 'standards', name: '📋 Standards', load: 'global-standards' },
    { id: 'ai', name: '🤖 Global AI', load: 'global-ai' },
    { id: 'council', name: '👥 Council', load: 'governance-council' }
  ];

  const tierColors: Record<string, string> = { founding: 'bg-purple-500', full: 'bg-blue-500', associate: 'bg-yellow-500', observer: 'bg-gray-500' };
  const regionColors: Record<string, string> = { Europe: 'from-blue-600 to-indigo-600', Africa: 'from-orange-600 to-red-600', Asia: 'from-green-600 to-teal-600', Americas: 'from-purple-600 to-pink-600' };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl p-8 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className="text-6xl">🌐</span>
              <div>
                <p className="text-cyan-200 text-sm font-mono">VERSION 6.0</p>
                <h1 className="text-4xl font-bold text-white">Global Governance Network</h1>
                <p className="text-blue-200">24 Countries • 4 Regional Hubs • $12.5B Managed</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-cyan-900/50 text-cyan-300 px-4 py-2 rounded-lg"><p className="text-2xl font-bold">{data['network-status']?.statistics?.totalCountries || 24}</p><p className="text-xs">Countries</p></div>
              <div className="bg-green-900/50 text-green-300 px-4 py-2 rounded-lg"><p className="text-2xl font-bold">28M</p><p className="text-xs">Beneficiaries</p></div>
              <div className="bg-blue-900/50 text-blue-300 px-4 py-2 rounded-lg"><p className="text-2xl font-bold">$12.5B</p><p className="text-xs">Budget</p></div>
              <div className="bg-purple-900/50 text-purple-300 px-4 py-2 rounded-lg"><p className="text-2xl font-bold">45</p><p className="text-xs">Programs</p></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); if (!data[t.load]) loadData(t.load); }} className={'px-5 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-gray-400">Loading...</div>}

        {/* Network Tab */}
        {!loading && activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-4">
              <StatCard icon="🌍" label="Active" value={data['network-status']?.statistics?.activeMembers || 18} color="green" />
              <StatCard icon="🤝" label="Associates" value={data['network-status']?.statistics?.associateMembers || 4} color="yellow" />
              <StatCard icon="👁️" label="Observers" value={data['network-status']?.statistics?.observers || 2} />
              <StatCard icon="🏛️" label="Hubs" value={4} color="blue" />
              <StatCard icon="👥" label="Users" value="125K" color="purple" />
              <StatCard icon="📊" label="TXN/Day" value="250K" color="cyan" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🗺️ Network Members by Region</h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {['Europe', 'Africa', 'Asia', 'Americas'].map(region => {
                  const members = data['network-status']?.members?.filter((m: any) => m.region === region) || [];
                  return (
                    <div key={region} className={`bg-gradient-to-br ${regionColors[region]} p-4 rounded-xl`}>
                      <h4 className="text-white font-bold text-lg">{region}</h4>
                      <p className="text-white/80 text-sm">{members.filter((m: any) => m.status === 'active').length} active</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {members.slice(0, 5).map((m: any) => <span key={m.code} className="text-xl">{m.flag}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-6 gap-3">
                {data['network-status']?.members?.filter((m: any) => m.status === 'active').map((m: any) => (
                  <div key={m.code} className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{m.flag}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{m.name}</p>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${tierColors[m.tier]}`}>{m.tier}</span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between"><span className="text-gray-400">Budget</span><span className="text-white">${(m.budget / 1000000).toFixed(0)}M</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Compliance</span><span className="text-green-400">{m.compliance}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regional Hubs Tab */}
        {!loading && activeTab === 'hubs' && data['regional-hubs'] && (
          <div className="grid grid-cols-2 gap-6">
            {data['regional-hubs'].hubs?.map((hub: any) => (
              <div key={hub.id} className={`bg-gradient-to-br ${regionColors[hub.name.replace(' Hub', '')]} rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{hub.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-xl">{hub.name}</h3>
                    <p className="text-white/70">{hub.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{hub.activeCountries}</p>
                    <p className="text-white/60 text-xs">Countries</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">${(hub.budget / 1000000000).toFixed(1)}B</p>
                    <p className="text-white/60 text-xs">Budget</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{(hub.beneficiaries / 1000000).toFixed(1)}M</p>
                    <p className="text-white/60 text-xs">Beneficiaries</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{hub.programs}</p>
                    <p className="text-white/60 text-xs">Programs</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hub.features?.map((f: string) => <span key={f} className="px-2 py-1 bg-white/20 rounded text-white text-xs">{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cross-Border Tab */}
        {!loading && activeTab === 'crossborder' && data['cross-border'] && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard icon="🔗" label="Total Programs" value={data['cross-border'].summary?.total || 45} />
              <StatCard icon="✅" label="Active" value={data['cross-border'].summary?.active || 38} color="green" />
              <StatCard icon="💰" label="Budget" value={`$${((data['cross-border'].summary?.totalBudget || 2850000000) / 1000000000).toFixed(2)}B`} color="blue" />
              <StatCard icon="📊" label="Daily Exchanges" value="12.5K" color="purple" />
            </div>
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🌍 Cross-Border Programs</h3>
              <div className="space-y-4">
                {data['cross-border'].programs?.map((p: any) => (
                  <div key={p.id} className="bg-gray-700/50 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-bold text-lg">{p.name}</h4>
                        <p className="text-gray-400">{p.countries?.join(' • ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">${(p.budget / 1000000).toFixed(0)}M</p>
                        <p className="text-gray-400 text-sm">{(p.beneficiaries / 1000000).toFixed(1)}M beneficiaries</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {p.donors?.map((d: string) => <span key={d} className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">{d}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Standards Tab */}
        {!loading && activeTab === 'standards' && data['global-standards'] && (
          <div className="space-y-6">
            <div className="bg-indigo-900/50 rounded-xl p-6 border border-indigo-700">
              <h2 className="text-2xl font-bold text-white">{data['global-standards'].standard?.name || 'HBS Global Standard (HGS)'}</h2>
              <p className="text-indigo-300">Version 2.0 • 18 Countries Adopted</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {data['global-standards'].domains?.map((d: any) => (
                <div key={d.id} className="bg-gray-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{d.icon}</span>
                    <div>
                      <h4 className="text-white font-bold">{d.name}</h4>
                      <p className="text-gray-400 text-sm">{d.requirements} requirements</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global AI Tab */}
        {!loading && activeTab === 'ai' && data['global-ai'] && (
          <div className="space-y-6">
            <div className="bg-purple-900/50 rounded-xl p-6 border border-purple-700">
              <div className="flex items-center gap-4">
                <span className="text-5xl">🤖</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">HBS Global AI Network</h2>
                  <p className="text-purple-300">4 Nodes • 12 Models • Federated Learning</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {data['global-ai'].capabilities?.map((c: any) => (
                <div key={c.name} className="bg-gray-800 rounded-xl p-4">
                  <span className="text-3xl mb-2 block">{c.icon}</span>
                  <h4 className="text-white font-bold mb-1">{c.name}</h4>
                  <p className="text-gray-400 text-xs">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Council Tab */}
        {!loading && activeTab === 'council' && data['governance-council'] && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">HBS Global Governance Council</h2>
              <div className="grid grid-cols-3 gap-4">
                {data['governance-council'].members?.map((m: any) => (
                  <div key={m.country} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{m.country}</p>
                      <p className="text-gray-400 text-xs">{m.role}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">{m.votes} vote{m.votes > 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-cyan-900/30 rounded-xl p-6 border border-cyan-700">
              <h3 className="text-white font-bold">📅 Next Meeting: {data['governance-council'].decisions?.nextMeeting || '2026-01-25'}</h3>
              <p className="text-cyan-300 mt-2">{data['governance-council'].decisions?.total || 89} decisions made • {data['governance-council'].decisions?.pending || 5} pending</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: any; color?: string }) {
  const colors: Record<string, string> = { green: 'text-green-400', yellow: 'text-yellow-400', blue: 'text-blue-400', purple: 'text-purple-400', cyan: 'text-cyan-400', default: 'text-white' };
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className={`text-2xl font-bold mt-1 ${colors[color || 'default']}`}>{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}
