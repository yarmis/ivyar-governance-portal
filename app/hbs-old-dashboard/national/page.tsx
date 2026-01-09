'use client';

import { useState, useEffect } from 'react';

export default function NationalPage() {
  const [activeTab, setActiveTab] = useState('countries');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('UA');

  const loadData = async () => {
    setLoading(true);
    try {
      const [countries, sovereign, audit] = await Promise.all([
        fetch('/api/hbs/national', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list-countries' }) }).then(r => r.json()),
        fetch('/api/hbs/sovereign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sovereignty-compliance', countryCode: 'UA' }) }).then(r => r.json()),
        fetch('/api/hbs/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'transparency-portal' }) }).then(r => r.json())
      ]);
      setData({ countries, sovereign, audit });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadAction = async (endpoint: string, action: string, extra?: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hbs/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra })
      });
      const result = await res.json();
      setData({ ...data, [action]: result });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const tabs = [
    { id: 'countries', name: '🌍 Countries' },
    { id: 'ministries', name: '🏛️ Ministries' },
    { id: 'sovereign', name: '🔐 Sovereign Data' },
    { id: 'audit', name: '📋 National Audit' },
    { id: 'transparency', name: '🌐 Transparency' }
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-green-900 text-green-300',
    onboarding: 'bg-yellow-900 text-yellow-300',
    pending: 'bg-gray-700 text-gray-300'
  };

  const tierColors: Record<string, string> = {
    primary: 'bg-purple-900 text-purple-300',
    secondary: 'bg-blue-900 text-blue-300',
    partner: 'bg-cyan-900 text-cyan-300'
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-xl p-8 text-white mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🏛️</span>
              <div>
                <h1 className="text-4xl font-bold">National Governance Cloud</h1>
                <p className="text-emerald-200">v4.0 — Multi-Country | Multi-Ministry | Sovereign Data</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{data.countries?.activeCountries || 0}</p>
                <p className="text-xs text-emerald-200">Countries</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{data.countries?.summary?.totalPrograms || 0}</p>
                <p className="text-xs text-emerald-200">Programs</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">${((data.countries?.summary?.totalBudget || 0) / 1000000000).toFixed(1)}B</p>
                <p className="text-xs text-emerald-200">Total Budget</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{((data.countries?.summary?.totalBeneficiaries || 0) / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-emerald-200">Beneficiaries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={'px-5 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-gray-400">Loading...</div>}

        {!loading && activeTab === 'countries' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {data.countries?.countries?.filter((c: any) => c.status === 'active').map((country: any) => (
                <div key={country.code} onClick={() => { setSelectedCountry(country.code); loadAction('national', 'country-dashboard', { countryCode: country.code }); }} className={'bg-gray-800 rounded-xl p-5 cursor-pointer transition-all hover:bg-gray-750 ' + (selectedCountry === country.code ? 'ring-2 ring-emerald-500' : '')}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{country.flag}</span>
                    <div>
                      <p className="text-white font-bold">{country.name}</p>
                      <div className="flex gap-1">
                        <span className={'px-2 py-0.5 rounded text-xs ' + statusColors[country.status]}>{country.status}</span>
                        <span className={'px-2 py-0.5 rounded text-xs ' + tierColors[country.tier]}>{country.tier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-700/50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Budget</p>
                      <p className="text-white font-mono">${(country.totalBudget / 1000000).toFixed(0)}M</p>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Beneficiaries</p>
                      <p className="text-white font-mono">{(country.beneficiaries / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Ministries</p>
                      <p className="text-white font-mono">{country.ministries}</p>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded">
                      <p className="text-gray-500 text-xs">Compliance</p>
                      <p className="text-green-400 font-mono">{country.complianceScore}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data['country-dashboard'] && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{data['country-dashboard'].country?.flag}</span>
                  <h3 className="text-white font-bold text-xl">{data['country-dashboard'].country?.name} Dashboard</h3>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <StatCard title="Total Budget" value={`$${(data['country-dashboard'].overview?.totalBudget / 1000000000).toFixed(2)}B`} icon="💰" />
                  <StatCard title="Utilized" value={`${data['country-dashboard'].overview?.utilizationRate}%`} icon="📈" color="green" />
                  <StatCard title="Beneficiaries" value={`${(data['country-dashboard'].overview?.beneficiaries / 1000000).toFixed(1)}M`} icon="👥" />
                  <StatCard title="Programs" value={data['country-dashboard'].overview?.activePrograms} icon="📋" />
                  <StatCard title="Health" value={`${data['country-dashboard'].governanceHealth?.overall}%`} icon="💚" color="green" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-bold mb-3">Top Programs</h4>
                    <div className="space-y-2">
                      {data['country-dashboard'].topPrograms?.slice(0, 4).map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{p.name}</p>
                            <p className="text-gray-400 text-xs">{p.ministry}</p>
                          </div>
                          <p className="text-emerald-400 font-mono">${(p.budget / 1000000).toFixed(0)}M</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {data['country-dashboard'].recentActivity?.map((a: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-white text-sm">{a.action}</p>
                          <p className="text-gray-400 text-xs">{a.ministry || a.partner} • {a.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🌐 Regional Hub</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Region</p>
                  <p className="text-white font-bold">Eastern Europe & South Caucasus</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Cross-Border Exchanges</p>
                  <p className="text-white font-bold">12 Active</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Shared Standards</p>
                  <p className="text-white font-bold">IATI, HXL, OpenAPI 3.1</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'ministries' && (
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              {data.countries?.countries?.filter((c: any) => c.status === 'active').slice(0, 4).map((c: any) => (
                <button key={c.code} onClick={() => { setSelectedCountry(c.code); loadAction('national', 'ministries', { countryCode: c.code }); }} className={'px-4 py-2 rounded-lg ' + (selectedCountry === c.code ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300')}>
                  {c.flag} {c.name}
                </button>
              ))}
            </div>

            {data.ministries && (
              <div className="grid grid-cols-2 gap-4">
                {data.ministries.ministries?.map((m: any) => (
                  <div key={m.id} className="bg-gray-800 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-bold">{m.name}</p>
                        <p className="text-gray-400 text-sm">{m.nameLocal}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">{m.complianceScore}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm mb-3">
                      <div className="bg-gray-700/50 p-2 rounded text-center">
                        <p className="text-gray-500 text-xs">Programs</p>
                        <p className="text-white font-bold">{m.programs}</p>
                      </div>
                      <div className="bg-gray-700/50 p-2 rounded text-center">
                        <p className="text-gray-500 text-xs">Budget</p>
                        <p className="text-white font-bold">${(m.budget / 1000000).toFixed(0)}M</p>
                      </div>
                      <div className="bg-gray-700/50 p-2 rounded text-center">
                        <p className="text-gray-500 text-xs">Utilized</p>
                        <p className="text-green-400 font-bold">{m.budget > 0 ? Math.round((m.utilized / m.budget) * 100) : 0}%</p>
                      </div>
                      <div className="bg-gray-700/50 p-2 rounded text-center">
                        <p className="text-gray-500 text-xs">Beneficiaries</p>
                        <p className="text-white font-bold">{(m.beneficiaries / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.systems?.map((s: string) => (
                        <span key={s} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'sovereign' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Sovereignty Score" value={`${data.sovereign?.overallScore || 0}%`} icon="🔐" color="green" />
              <StatCard title="Data Localization" value="100%" icon="📍" color="green" />
              <StatCard title="Encryption" value="AES-256" icon="🔒" />
              <StatCard title="Certifications" value={data.sovereign?.certifications?.length || 0} icon="🏅" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🔐 Compliance Categories</h3>
                <div className="space-y-3">
                  {data.sovereign?.categories?.map((c: any) => (
                    <div key={c.category} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-white font-medium">{c.category}</p>
                        <span className={'px-2 py-1 rounded text-xs font-bold ' + (c.score >= 95 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300')}>{c.score}%</span>
                      </div>
                      <div className="space-y-1">
                        {c.requirements?.slice(0, 3).map((r: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className={r.status === 'met' ? 'text-green-400' : 'text-yellow-400'}>{r.status === 'met' ? '✓' : '◐'}</span>
                            <span className="text-gray-300">{r.req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🏅 Certifications</h3>
                <div className="space-y-3">
                  {data.sovereign?.certifications?.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="text-white font-medium">{c.name}</p>
                          <p className="text-gray-400 text-sm">Valid until {c.validUntil}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">{c.status}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-white font-bold mb-4 mt-6">⏳ Upcoming Requirements</h3>
                <div className="space-y-2">
                  {data.sovereign?.upcomingRequirements?.map((r: any, i: number) => (
                    <div key={i} className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                      <p className="text-white font-medium">{r.requirement}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400 text-sm">Deadline: {r.deadline}</span>
                        <span className="text-yellow-400 text-sm">{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🔑 Key Management</h3>
              <button onClick={() => loadAction('sovereign', 'key-management', { subAction: 'list' })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mb-4">
                Load Key Status
              </button>
              {data['key-management'] && (
                <div className="grid grid-cols-5 gap-3">
                  {data['key-management'].keys?.map((k: any) => (
                    <div key={k.id} className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-white font-medium text-sm">{k.type}</p>
                      <p className="text-gray-400 text-xs">{k.algorithm}</p>
                      <p className={'text-xs mt-1 ' + (k.status === 'active' ? 'text-green-400' : 'text-yellow-400')}>{k.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🏛️ State Audit Service</h3>
                <button onClick={() => loadAction('audit', 'state-audit', { countryCode: 'UA' })} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mb-4">
                  Load Audit Status
                </button>
                {data['state-audit'] && (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm">Authority</p>
                      <p className="text-white font-bold">{data['state-audit'].auditAuthority?.name}</p>
                      <p className="text-gray-400 text-xs">{data['state-audit'].auditAuthority?.nameLocal}</p>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm">Current Audits</p>
                      {data['state-audit'].currentAudits?.map((a: any) => (
                        <div key={a.id} className="mt-2 p-2 bg-gray-600/50 rounded">
                          <p className="text-white font-medium">{a.title}</p>
                          <p className="text-gray-400 text-xs">Status: {a.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📋 Parliament Report</h3>
                <button onClick={() => loadAction('audit', 'parliament-report', { period: 'Q4-2025' })} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
                  Generate Report
                </button>
                {data['parliament-report'] && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-700/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-white">${(data['parliament-report'].executiveSummary?.utilized / 1000000000).toFixed(2)}B</p>
                        <p className="text-gray-400 text-xs">Utilized</p>
                      </div>
                      <div className="p-3 bg-gray-700/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-400">{data['parliament-report'].executiveSummary?.utilizationRate}%</p>
                        <p className="text-gray-400 text-xs">Rate</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Key Achievements</p>
                      {data['parliament-report'].executiveSummary?.keyAchievements?.slice(0, 3).map((a: string, i: number) => (
                        <p key={i} className="text-green-400 text-sm">✓ {a}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🔍 Anti-Corruption Portal</h3>
              <button onClick={() => loadAction('audit', 'anti-corruption', { subAction: 'portal-status' })} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mb-4">
                Load NABU Portal
              </button>
              {data['anti-corruption'] && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-red-400">{data['anti-corruption'].activeFlags?.highRiskTransactions}</p>
                    <p className="text-gray-400 text-sm">High Risk Flags</p>
                  </div>
                  <div className="p-4 bg-orange-900/30 border border-orange-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-400">{data['anti-corruption'].activeFlags?.conflictOfInterest}</p>
                    <p className="text-gray-400 text-sm">COI Alerts</p>
                  </div>
                  <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-yellow-400">{data['anti-corruption'].activeFlags?.unusualPatterns}</p>
                    <p className="text-gray-400 text-sm">Unusual Patterns</p>
                  </div>
                  <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-400">{data['anti-corruption'].activeFlags?.whistleblowerReports}</p>
                    <p className="text-gray-400 text-sm">Whistleblower</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && activeTab === 'transparency' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">🌐 Public Transparency Portal</h3>
                <a href={data.audit?.url} target="_blank" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Visit Portal →
                </a>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard title="Public Datasets" value={data.audit?.publicDatasets?.length || 0} icon="📊" />
                <StatCard title="API Calls (24h)" value={(data.audit?.openApi?.calls24h || 0).toLocaleString()} icon="📡" />
                <StatCard title="Developers" value={data.audit?.openApi?.registeredDevelopers || 0} icon="👩‍💻" />
                <StatCard title="Satisfaction" value={`${data.audit?.citizenEngagement?.satisfactionScore || 0}/5`} icon="⭐" color="yellow" />
              </div>

              <h4 className="text-white font-bold mb-3">📂 Public Datasets</h4>
              <div className="grid grid-cols-2 gap-4">
                {data.audit?.publicDatasets?.map((d: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white font-medium">{d.name}</p>
                      <span className="text-gray-400 text-xs">{d.updateFrequency}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{d.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {d.format?.map((f: string) => (
                          <span key={f} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">{f}</span>
                        ))}
                      </div>
                      <span className="text-emerald-400 text-sm">{d.downloads?.toLocaleString()} downloads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📈 Visualizations</h3>
              <div className="grid grid-cols-4 gap-4">
                {data.audit?.visualizations?.map((v: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-700/50 rounded-lg text-center">
                    <p className="text-white font-medium">{v.name}</p>
                    <p className="text-gray-400 text-xs">{v.type}</p>
                    <p className="text-emerald-400 text-lg font-bold mt-2">{v.views?.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">views</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: any; icon: string; color?: string }) {
  const colors: Record<string, string> = { green: 'text-green-400', red: 'text-red-400', yellow: 'text-yellow-400', default: 'text-white' };
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <p className={'text-2xl font-bold ' + (colors[color || 'default'])}>{value}</p>
    </div>
  );
}