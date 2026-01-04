'use client';

import { useState, useEffect } from 'react';

export default function InstitutionalPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orgs, executive, hub] = await Promise.all([
        fetch('/api/hbs/institutional', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list-organizations' }) }).then(r => r.json()),
        fetch('/api/hbs/executive', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'board-dashboard' }) }).then(r => r.json()),
        fetch('/api/hbs/hub', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'connections' }) }).then(r => r.json())
      ]);
      setData({ orgs, executive, hub });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const loadPortal = async (portal: string, params?: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/executive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: portal, ...params })
      });
      const result = await res.json();
      setData({ ...data, [portal]: result });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const tabs = [
    { id: 'overview', name: '🏛️ Overview' },
    { id: 'organizations', name: '🏢 Organizations' },
    { id: 'board', name: '📊 Board Dashboard' },
    { id: 'donor', name: '💰 Donor Portal' },
    { id: 'hub', name: '🔗 Integration Hub' }
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-xl p-8 text-white mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🏛️</span>
              <div>
                <h1 className="text-4xl font-bold">Institutional Platform</h1>
                <p className="text-indigo-200">v3.0 — Multi-Organization Governance</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{data.orgs?.totalOrganizations || 0}</p>
                <p className="text-xs text-indigo-200">Organizations</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{data.hub?.activeConnections || 0}</p>
                <p className="text-xs text-indigo-200">Integrations</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">${((data.orgs?.summary?.totalFunding || 0) / 1000000).toFixed(0)}M</p>
                <p className="text-xs text-indigo-200">Total Funding</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); if (t.id === 'board') loadPortal('board-dashboard'); if (t.id === 'donor') loadPortal('donor-portal'); }} className={'px-5 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-gray-400">Loading...</div>}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Total Budget" value={`$${((data.executive?.financialOverview?.totalBudget || 0) / 1000000).toFixed(0)}M`} icon="💰" />
              <StatCard title="Utilization" value={`${data.executive?.financialOverview?.utilizationRate || 0}%`} icon="📈" color="green" />
              <StatCard title="Programs" value={data.executive?.programPerformance?.totalPrograms || 0} icon="📋" />
              <StatCard title="Compliance" value={`${data.executive?.governanceMetrics?.complianceScore || 0}%`} icon="✅" color="green" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🏢 Organizations by Type</h3>
                <div className="space-y-3">
                  {Object.entries(data.orgs?.summary?.byType || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300 capitalize">{type.replace('-', ' ')}</span>
                      <span className="text-white font-bold text-xl">{String(count)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">⚠️ Risk Overview</h3>
                <div className="space-y-3">
                  {data.executive?.riskOverview?.byCategory?.map((r: any) => (
                    <div key={r.category} className="flex items-center gap-3">
                      <span className="text-gray-400 w-24">{r.category}</span>
                      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div className={'h-full rounded-full ' + (r.score >= 60 ? 'bg-red-500' : r.score >= 40 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${r.score}%` }} />
                      </div>
                      <span className="text-white font-mono w-10">{r.score}</span>
                      <span className={'text-xs ' + (r.trend === 'increasing' ? 'text-red-400' : r.trend === 'decreasing' ? 'text-green-400' : 'text-gray-400')}>
                        {r.trend === 'increasing' ? '↑' : r.trend === 'decreasing' ? '↓' : '→'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📊 Program Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm">
                      <th className="text-left pb-3">Program</th>
                      <th className="text-center pb-3">Status</th>
                      <th className="text-right pb-3">Progress</th>
                      <th className="text-right pb-3">Budget</th>
                      <th className="text-right pb-3">Spent</th>
                      <th className="text-right pb-3">Beneficiaries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.executive?.programPerformance?.programs?.map((p: any) => (
                      <tr key={p.name} className="border-t border-gray-700">
                        <td className="py-3 text-white font-medium">{p.name}</td>
                        <td className="py-3 text-center">
                          <span className={'px-2 py-1 rounded text-xs font-bold ' + (p.status === 'on-track' ? 'bg-green-900 text-green-300' : p.status === 'at-risk' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300')}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                            </div>
                            <span className="text-gray-300 text-sm">{p.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-gray-300">${(p.budget / 1000000).toFixed(1)}M</td>
                        <td className="py-3 text-right text-gray-300">${(p.spent / 1000000).toFixed(1)}M</td>
                        <td className="py-3 text-right text-gray-300">{(p.beneficiaries / 1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {data.orgs?.organizations?.map((org: any) => (
                <div key={org.id} className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-all cursor-pointer" onClick={() => setSelectedOrg(selectedOrg?.id === org.id ? null : org)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-bold">{org.name}</p>
                      <p className="text-gray-400 text-sm capitalize">{org.type.replace('-', ' ')}</p>
                    </div>
                    <span className={'px-2 py-1 rounded text-xs font-bold ' + (org.tier === 'primary' ? 'bg-purple-900 text-purple-300' : org.tier === 'secondary' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300')}>
                      {org.tier}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {org.totalFunding && (
                      <div className="bg-gray-700/50 p-2 rounded">
                        <p className="text-gray-500 text-xs">Funding</p>
                        <p className="text-white font-mono">${(org.totalFunding / 1000000).toFixed(0)}M</p>
                      </div>
                    )}
                    {org.activePrograms && (
                      <div className="bg-gray-700/50 p-2 rounded">
                        <p className="text-gray-500 text-xs">Programs</p>
                        <p className="text-white font-mono">{org.activePrograms}</p>
                      </div>
                    )}
                    {org.complianceScore && (
                      <div className="bg-gray-700/50 p-2 rounded col-span-2">
                        <p className="text-gray-500 text-xs">Compliance</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-600 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${org.complianceScore}%` }} />
                          </div>
                          <span className="text-green-400 font-mono text-sm">{org.complianceScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedOrg?.id === org.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">Governance Level: <span className="text-white">{org.governanceLevel}</span></p>
                      <p className="text-gray-400 text-sm">Joined: <span className="text-white">{org.joinedAt}</span></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'board' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              <StatCard title="Health Score" value={data['board-dashboard']?.executiveSummary?.healthScore || data.executive?.executiveSummary?.healthScore || '-'} icon="💚" color="green" />
              <StatCard title="Critical Issues" value={data['board-dashboard']?.executiveSummary?.criticalIssues || data.executive?.executiveSummary?.criticalIssues || 0} icon="🚨" color="red" />
              <StatCard title="Pending Decisions" value={data['board-dashboard']?.executiveSummary?.pendingDecisions || data.executive?.executiveSummary?.pendingDecisions || 0} icon="⏳" color="yellow" />
              <StatCard title="Compliance" value={`${data['board-dashboard']?.governanceMetrics?.complianceScore || data.executive?.governanceMetrics?.complianceScore || 0}%`} icon="✅" />
              <StatCard title="Automation" value={`${data['board-dashboard']?.governanceMetrics?.automationRate || data.executive?.governanceMetrics?.automationRate || 0}%`} icon="🤖" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">💰 Funding by Donor</h3>
                <div className="space-y-3">
                  {(data['board-dashboard']?.financialOverview?.byDonor || data.executive?.financialOverview?.byDonor)?.map((d: any) => (
                    <div key={d.donor} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">{d.donor}</span>
                        <span className="text-green-400">{d.rate}% utilized</span>
                      </div>
                      <div className="h-2 bg-gray-600 rounded-full">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.rate}%` }} />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>${(d.utilized / 1000000).toFixed(1)}M used</span>
                        <span>${(d.allocated / 1000000).toFixed(1)}M total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📅 Upcoming Items</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Decisions</p>
                    {(data['board-dashboard']?.upcomingItems?.decisions || data.executive?.upcomingItems?.decisions)?.map((d: any) => (
                      <div key={d.id} className="flex items-center justify-between p-2 bg-gray-700/50 rounded mb-1">
                        <span className="text-gray-300 text-sm">{d.title}</span>
                        <span className={'text-xs px-2 py-1 rounded ' + (d.priority === 'high' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300')}>{d.deadline}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Meetings</p>
                    {(data['board-dashboard']?.upcomingItems?.meetings || data.executive?.upcomingItems?.meetings)?.map((m: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-700/50 rounded mb-1">
                        <span className="text-gray-300 text-sm">{m.title}</span>
                        <span className="text-gray-400 text-xs">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'donor' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">💰 Donor Funding Overview</h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-white">${((data['donor-portal']?.fundingOverview?.totalCommitted || 50000000) / 1000000).toFixed(0)}M</p>
                  <p className="text-gray-400 text-sm">Committed</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-400">${((data['donor-portal']?.fundingOverview?.totalDisbursed || 45000000) / 1000000).toFixed(0)}M</p>
                  <p className="text-gray-400 text-sm">Disbursed</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-indigo-400">{data['donor-portal']?.fundingOverview?.disbursementRate || 90}%</p>
                  <p className="text-gray-400 text-sm">Disbursement Rate</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-yellow-400">{(data['donor-portal']?.impactMetrics?.totalBeneficiaries || 285000).toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Beneficiaries</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📋 Program Portfolio</h3>
              <div className="space-y-4">
                {(data['donor-portal']?.programPortfolio || []).map((p: any) => (
                  <div key={p.program} className="p-4 bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-bold">{p.program}</p>
                        <p className="text-gray-400 text-sm">${(p.spent / 1000000).toFixed(1)}M of ${(p.allocation / 1000000).toFixed(1)}M</p>
                      </div>
                      <span className={'px-2 py-1 rounded text-xs font-bold ' + (p.status === 'on-track' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300')}>{p.status}</span>
                    </div>
                    <div className="h-2 bg-gray-600 rounded-full mb-3">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {p.keyResults?.map((kr: any, i: number) => (
                        <div key={i} className="text-sm">
                          <span className="text-gray-400">{kr.indicator}: </span>
                          <span className="text-white">{kr.achieved.toLocaleString()}</span>
                          <span className="text-gray-500">/{kr.target.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'hub' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Connections" value={data.hub?.totalConnections || 0} icon="🔗" />
              <StatCard title="Active" value={data.hub?.activeConnections || 0} icon="✅" color="green" />
              <StatCard title="Data In (Today)" value={(data.hub?.dataFlowSummary?.inbound?.today || 0).toLocaleString()} icon="📥" />
              <StatCard title="Data Out (Today)" value={(data.hub?.dataFlowSummary?.outbound?.today || 0).toLocaleString()} icon="📤" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🔌 Connected Systems</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.hub?.connections?.slice(0, 8).map((c: any) => (
                  <div key={c.id} className="p-4 bg-gray-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={'w-3 h-3 rounded-full ' + (c.health >= 95 ? 'bg-green-400' : c.health >= 80 ? 'bg-yellow-400' : 'bg-red-400')}></span>
                      <div>
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.type} • {c.syncFrequency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-mono text-sm">{c.health}%</p>
                      <p className="text-gray-500 text-xs">{c.recordsSynced?.toLocaleString() || '-'} records</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">⏳ Pending Connections</h3>
                <div className="space-y-3">
                  {data.hub?.pendingConnections?.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-white">{c.name}</p>
                        <p className="text-gray-400 text-sm">{c.type}</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-xs">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">⛓️ Blockchain Audit</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white">Ethereum Mainnet</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Records Anchored</span>
                    <span className="text-green-400 font-mono">45,678</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Integrity</span>
                    <span className="text-green-400">100% Verified</span>
                  </div>
                </div>
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
      <p className={'text-3xl font-bold ' + (colors[color || 'default'])}>{value}</p>
    </div>
  );
}