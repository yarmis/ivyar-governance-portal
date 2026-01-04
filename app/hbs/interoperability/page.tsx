'use client';

import { useState, useEffect } from 'react';

export default function InteroperabilityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [openapi, compliance] = await Promise.all([
        fetch('/api/hbs/openapi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'versions' }) }).then(r => r.json()),
        fetch('/api/hbs/compliance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'compliance-dashboard' }) }).then(r => r.json())
      ]);
      setData({ openapi, compliance });
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
    { id: 'overview', name: '🌍 Overview' },
    { id: 'openapi', name: '📡 OpenAPI' },
    { id: 'usaid', name: '🇺🇸 USAID' },
    { id: 'eu', name: '🇪🇺 EU' },
    { id: 'un', name: '🇺🇳 UN/OCHA' }
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 rounded-xl p-8 text-white mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🌍</span>
              <div>
                <h1 className="text-4xl font-bold">Global Interoperability</h1>
                <p className="text-blue-200">v3.1 — OpenAPI | EU | USAID | UN OCHA</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{data.compliance?.overallScore || 95}%</p>
                <p className="text-xs text-blue-200">Compliance</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-blue-200">Frameworks</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-blue-200">Certifications</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">v3.1</p>
                <p className="text-xs text-blue-200">API Version</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={'px-5 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-gray-400">Loading...</div>}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {data.compliance?.frameworks?.map((f: any) => (
                <div key={f.name} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{f.name}</span>
                    <span className={'w-2 h-2 rounded-full ' + (f.score >= 95 ? 'bg-green-400' : f.score >= 80 ? 'bg-yellow-400' : 'bg-red-400')}></span>
                  </div>
                  <p className="text-3xl font-bold text-white">{f.score}%</p>
                  <p className={'text-xs mt-1 ' + (f.status === 'compliant' || f.status === 'current' || f.status === 'published' ? 'text-green-400' : 'text-yellow-400')}>{f.status}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">⏳ Pending Actions</h3>
                <div className="space-y-3">
                  {data.compliance?.pendingActions?.map((a: any, i: number) => (
                    <div key={i} className={'p-3 rounded-lg border-l-4 ' + (a.priority === 'high' ? 'bg-red-900/30 border-red-500' : a.priority === 'medium' ? 'bg-yellow-900/30 border-yellow-500' : 'bg-blue-900/30 border-blue-500')}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{a.action}</p>
                          <p className="text-gray-400 text-sm">{a.framework}</p>
                        </div>
                        <span className="text-gray-400 text-xs">{a.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🏅 Certifications</h3>
                <div className="space-y-3">
                  {data.compliance?.certifications?.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="text-white font-medium">{c.name}</p>
                          <p className="text-gray-400 text-sm">Expires: {c.expiry}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-bold">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📅 Audit Schedule</h3>
              <div className="grid grid-cols-3 gap-4">
                {data.compliance?.auditSchedule?.map((a: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-white font-bold">{a.auditor}</p>
                    <p className="text-gray-400 text-sm">{a.type}</p>
                    <p className="text-indigo-400 mt-2">{a.scheduled}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'openapi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📡 API Specification</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Standard</span>
                    <span className="text-white font-mono">OpenAPI 3.1.0</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Current Version</span>
                    <span className="text-green-400 font-mono">{data.openapi?.current || '3.1.0'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400">Endpoints</span>
                    <span className="text-white font-mono">45+</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <a href="/api/hbs/openapi" target="_blank" className="block w-full py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700">
                    📄 View JSON Spec
                  </a>
                  <a href="/api/hbs/openapi?format=yaml" target="_blank" className="block w-full py-2 bg-gray-700 text-white text-center rounded-lg hover:bg-gray-600">
                    📝 Download YAML
                  </a>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📦 SDK Downloads</h3>
                <div className="space-y-3">
                  {['JavaScript', 'Python', 'Java'].map(lang => (
                    <div key={lang} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{lang}</span>
                        <button onClick={() => loadAction('openapi', 'sdk-config', { language: lang.toLowerCase() })} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                          Get SDK
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {data['sdk-config'] && (
                  <div className="mt-4 p-3 bg-gray-900 rounded-lg">
                    <p className="text-gray-400 text-xs mb-2">Install:</p>
                    <code className="text-green-400 text-sm">{(Object.values(data['sdk-config'].configs || {}) as any[])[0]?.install}</code>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📚 Version History</h3>
                <div className="space-y-3">
                  {data.openapi?.changelog?.map((v: any, i: number) => (
                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className={'font-mono font-bold ' + (i === 0 ? 'text-green-400' : 'text-gray-300')}>v{v.version}</span>
                        <span className="text-gray-500 text-xs">{v.date}</span>
                      </div>
                      <ul className="text-gray-400 text-xs">
                        {v.changes?.slice(0, 2).map((c: string, j: number) => (
                          <li key={j}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🔐 Authentication</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-bold">Bearer Token (JWT)</p>
                  <p className="text-gray-400 text-sm mt-1">OAuth 2.0 access tokens</p>
                  <code className="text-green-400 text-xs mt-2 block">Authorization: Bearer &lt;token&gt;</code>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-bold">API Key</p>
                  <p className="text-gray-400 text-sm mt-1">For server-to-server</p>
                  <code className="text-green-400 text-xs mt-2 block">X-API-Key: &lt;key&gt;</code>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-bold">OAuth 2.0</p>
                  <p className="text-gray-400 text-sm mt-1">Full OAuth flow</p>
                  <code className="text-green-400 text-xs mt-2 block">Authorization Code Grant</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'usaid' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">🇺🇸</span>
                <div>
                  <h3 className="text-white font-bold text-2xl">USAID Compliance</h3>
                  <p className="text-gray-400">ADS 303, FFATA, SAM.gov Integration</p>
                </div>
                <button onClick={() => loadAction('compliance', 'usaid-compliance')} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Run Assessment
                </button>
              </div>

              {data['usaid-compliance'] && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <StatCard title="Overall Compliance" value={`${data['usaid-compliance'].overallCompliance}%`} icon="📊" color="green" />
                    <StatCard title="SAM.gov Status" value={data['usaid-compliance'].samGovStatus?.registered ? 'Registered' : 'Not Registered'} icon="✅" color="green" />
                    <StatCard title="UEI" value={data['usaid-compliance'].samGovStatus?.uei || '-'} icon="🔢" />
                    <StatCard title="FFATA Current" value={data['usaid-compliance'].ffataStatus?.currentReporting ? 'Yes' : 'No'} icon="📋" color="green" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {data['usaid-compliance'].categories?.map((cat: any) => (
                      <div key={cat.category} className="p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-white font-bold">{cat.category}</p>
                          <span className={'px-2 py-1 rounded text-xs font-bold ' + (cat.status === 'compliant' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300')}>{cat.score}%</span>
                        </div>
                        <div className="space-y-2">
                          {cat.requirements?.map((req: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className={req.status === 'met' ? 'text-green-400' : 'text-yellow-400'}>{req.status === 'met' ? '✓' : '◐'}</span>
                              <span className="text-gray-300">{req.req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📤 Generate Reports</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => loadAction('compliance', 'ffata-report')} className="p-4 bg-gray-700/50 rounded-lg text-left hover:bg-gray-700">
                  <p className="text-white font-bold">FFATA Subaward Report</p>
                  <p className="text-gray-400 text-sm">Federal Funding Accountability</p>
                </button>
                <button className="p-4 bg-gray-700/50 rounded-lg text-left hover:bg-gray-700">
                  <p className="text-white font-bold">SF-425 Financial Report</p>
                  <p className="text-gray-400 text-sm">Federal Financial Report</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'eu' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">🇪🇺</span>
                <div>
                  <h3 className="text-white font-bold text-2xl">EU Compliance</h3>
                  <p className="text-gray-400">GDPR, eIDAS, CEF Building Blocks</p>
                </div>
                <button onClick={() => loadAction('compliance', 'eu-gdpr')} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  GDPR Assessment
                </button>
              </div>

              {data['eu-gdpr'] && (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <StatCard title="GDPR Compliance" value={`${data['eu-gdpr'].overallCompliance}%`} icon="🔒" color="green" />
                    <StatCard title="DPO Appointed" value={data['eu-gdpr'].dataProtectionOfficer?.appointed ? 'Yes' : 'No'} icon="👤" color="green" />
                    <StatCard title="Data Breaches (12m)" value={data['eu-gdpr'].dataBreaches?.last12Months || 0} icon="🛡️" color="green" />
                    <StatCard title="Access Requests" value={data['eu-gdpr'].rightsManagement?.accessRequests?.completed || 0} icon="📨" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="text-white font-bold mb-3">🔐 Technical Measures</h4>
                      <div className="space-y-2">
                        {data['eu-gdpr'].technicalMeasures?.map((m: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-300">{m.measure}</span>
                            <span className="text-green-400 text-sm">{m.standard || m.type || m.scope}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-700/50 rounded-lg">
                      <h4 className="text-white font-bold mb-3">📋 Processing Activities</h4>
                      <div className="space-y-2">
                        {data['eu-gdpr'].processingActivities?.categories?.map((a: any, i: number) => (
                          <div key={i} className="text-sm">
                            <p className="text-white">{a.activity}</p>
                            <p className="text-gray-400 text-xs">Basis: {a.lawfulBasis}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">✍️ eIDAS Digital Signatures</h3>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => loadAction('compliance', 'eu-eidas', { subAction: 'sign' })} className="p-4 bg-indigo-900/50 border border-indigo-700 rounded-lg text-left hover:bg-indigo-900">
                  <p className="text-indigo-400 font-bold">🔏 Create Signature</p>
                  <p className="text-gray-400 text-sm">QES / eIDAS compliant</p>
                </button>
                <button onClick={() => loadAction('compliance', 'eu-eidas', { subAction: 'verify' })} className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-left hover:bg-green-900">
                  <p className="text-green-400 font-bold">✅ Verify Signature</p>
                  <p className="text-gray-400 text-sm">Check validity</p>
                </button>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <p className="text-white font-bold">Supported Formats</p>
                  <p className="text-gray-400 text-sm">PAdES, XAdES, CAdES, ASiC</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'un' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">🇺🇳</span>
                <div>
                  <h3 className="text-white font-bold text-2xl">UN OCHA Integration</h3>
                  <p className="text-gray-400">IATI, HXL, HDX, 3W/4W Reporting</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <button onClick={() => loadAction('compliance', 'iati-report')} className="p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-left hover:bg-blue-900">
                  <p className="text-blue-400 font-bold text-lg">📊 IATI Report</p>
                  <p className="text-gray-400 text-sm">Activity standard 2.03</p>
                </button>
                <button onClick={() => loadAction('compliance', 'hxl-export')} className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-left hover:bg-green-900">
                  <p className="text-green-400 font-bold text-lg">📋 HXL Export</p>
                  <p className="text-gray-400 text-sm">Humanitarian Exchange</p>
                </button>
                <button onClick={() => loadAction('compliance', 'ocha-3w')} className="p-4 bg-purple-900/50 border border-purple-700 rounded-lg text-left hover:bg-purple-900">
                  <p className="text-purple-400 font-bold text-lg">🗺️ 3W Report</p>
                  <p className="text-gray-400 text-sm">Who What Where</p>
                </button>
                <button onClick={() => loadAction('compliance', 'hdx-publish')} className="p-4 bg-orange-900/50 border border-orange-700 rounded-lg text-left hover:bg-orange-900">
                  <p className="text-orange-400 font-bold text-lg">🌐 HDX Publish</p>
                  <p className="text-gray-400 text-sm">Data Exchange</p>
                </button>
              </div>
            </div>

            {data['iati-report'] && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📊 IATI Activity Report</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Format</p>
                    <p className="text-white font-mono">{data['iati-report'].format}</p>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Validation</p>
                    <p className="text-green-400 font-bold">{data['iati-report'].validation?.status}</p>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-sm">Activities</p>
                    <p className="text-white">{data['iati-report'].activities?.length || 0}</p>
                  </div>
                </div>
                {data['iati-report'].activities?.[0] && (
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <p className="text-gray-400 text-xs mb-2">Sample Activity:</p>
                    <p className="text-white font-bold">{data['iati-report'].activities[0].title?.narrative}</p>
                    <p className="text-gray-400 text-sm">{data['iati-report'].activities[0].iatiIdentifier}</p>
                  </div>
                )}
              </div>
            )}

            {data['ocha-3w'] && (
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🗺️ 3W Report - {data['ocha-3w'].period}</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <StatCard title="Organizations" value={data['ocha-3w'].organizations} icon="🏢" />
                  <StatCard title="Activities" value={data['ocha-3w'].activities} icon="📋" />
                  <StatCard title="Locations" value={data['ocha-3w'].locations} icon="📍" />
                  <StatCard title="Beneficiaries" value={(data['ocha-3w'].summary?.totalBeneficiaries / 1000).toFixed(0) + 'K'} icon="👥" color="green" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="text-left pb-2">Cluster</th>
                        <th className="text-left pb-2">Activity</th>
                        <th className="text-left pb-2">Location</th>
                        <th className="text-right pb-2">Beneficiaries</th>
                        <th className="text-center pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data['ocha-3w'].data?.map((d: any, i: number) => (
                        <tr key={i} className="border-t border-gray-700">
                          <td className="py-2 text-white">{d.cluster}</td>
                          <td className="py-2 text-gray-300">{d.activity}</td>
                          <td className="py-2 text-gray-300">{d.admin1}</td>
                          <td className="py-2 text-right text-white">{d.beneficiaries.toLocaleString()}</td>
                          <td className="py-2 text-center">
                            <span className={'px-2 py-1 rounded text-xs ' + (d.status === 'Ongoing' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300')}>{d.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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