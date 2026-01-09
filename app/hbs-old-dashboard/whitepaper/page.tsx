'use client';

import { useState, useEffect } from 'react';

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState('executive');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadSection = async (section: string) => {
    setLoading(true);
    try {
      const actionMap: Record<string, string> = {
        executive: 'executive-summary',
        maturity: 'governance-maturity',
        standards: 'international-standards',
        donors: 'donor-alignment',
        architecture: 'technical-architecture',
        roadmap: 'implementation-roadmap',
        cases: 'case-studies'
      };
      const res = await fetch('/api/hbs/whitepaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionMap[section] })
      });
      const result = await res.json();
      setData({ ...data, [section]: result });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadSection('executive'); }, []);

  const sections = [
    { id: 'executive', name: '📋 Executive Summary', icon: '📋' },
    { id: 'maturity', name: '📊 Maturity Model', icon: '📊' },
    { id: 'standards', name: '🌍 Standards', icon: '🌍' },
    { id: 'donors', name: '💰 Donor Alignment', icon: '💰' },
    { id: 'architecture', name: '🏗️ Architecture', icon: '🏗️' },
    { id: 'roadmap', name: '🗺️ Roadmap', icon: '🗺️' },
    { id: 'cases', name: '📚 Case Studies', icon: '📚' }
  ];

  const levelColors = ['bg-gray-600', 'bg-red-600', 'bg-orange-600', 'bg-yellow-600', 'bg-green-600', 'bg-emerald-600'];

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">📄</span>
                <div>
                  <p className="text-blue-400 text-sm font-mono">OFFICIAL DOCUMENT</p>
                  <h1 className="text-4xl font-bold text-white">HBS Institutional Whitepaper</h1>
                </div>
              </div>
              <p className="text-xl text-blue-200 mb-2">Comprehensive Framework for Humanitarian Budget Governance</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Version 2.0</span>
                <span>•</span>
                <span>January 2026</span>
                <span>•</span>
                <span>85 pages</span>
                <span>•</span>
                <span className="text-green-400">Public</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <span>📥</span> Download PDF
              </button>
              <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2">
                <span>📄</span> Download DOCX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-xl p-4 sticky top-6">
              <p className="text-gray-400 text-xs uppercase mb-3">Contents</p>
              <div className="space-y-1">
                {sections.map(s => (
                  <button key={s.id} onClick={() => { setActiveSection(s.id); if (!data[s.id]) loadSection(s.id); }} className={'w-full text-left px-3 py-2 rounded-lg text-sm transition-all ' + (activeSection === s.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700')}>
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs uppercase mb-2">Languages</p>
                <div className="flex flex-wrap gap-1">
                  {['🇺🇸 EN', '🇺🇦 UK', '🇫🇷 FR', '🇩🇪 DE', '🇪🇸 ES', '🇵🇱 PL'].map(l => (
                    <span key={l} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading && <div className="text-center py-20 text-gray-400">Loading...</div>}

            {!loading && activeSection === 'executive' && data.executive && (
              <div className="space-y-8">
                <Section title="Vision" icon="🎯">
                  <p className="text-lg text-gray-300 italic mb-4">"{data.executive.vision?.statement}"</p>
                  <div className="grid grid-cols-5 gap-3">
                    {data.executive.vision?.principles?.map((p: any) => (
                      <div key={p.name} className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-white font-bold">{p.name}</p>
                        <p className="text-gray-400 text-xs mt-1">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Mission & Objectives" icon="🚀">
                  <p className="text-gray-300 mb-4">{data.executive.mission?.statement}</p>
                  <div className="space-y-2">
                    {data.executive.mission?.objectives?.map((o: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{o}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Key Innovations" icon="💡">
                  <div className="grid grid-cols-2 gap-4">
                    {data.executive.keyInnovations?.map((i: any) => (
                      <div key={i.name} className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-xl">
                        <p className="text-white font-bold text-lg">{i.name}</p>
                        <p className="text-gray-400 text-sm mt-1">{i.description}</p>
                        <p className="text-blue-400 text-sm mt-3">💫 {i.impact}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Impact Metrics" icon="📈">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-3">Current (2026)</p>
                      <div className="grid grid-cols-2 gap-3">
                        <MetricCard label="Countries" value={data.executive.impactMetrics?.current?.activeCountries} />
                        <MetricCard label="Budget" value={`$${(data.executive.impactMetrics?.current?.totalBudgetManaged / 1000000000).toFixed(1)}B`} />
                        <MetricCard label="Beneficiaries" value={`${(data.executive.impactMetrics?.current?.beneficiariesServed / 1000000).toFixed(1)}M`} />
                        <MetricCard label="Compliance" value={`${data.executive.impactMetrics?.current?.complianceScore}%`} color="green" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-3">Projected (2027)</p>
                      <div className="grid grid-cols-2 gap-3">
                        <MetricCard label="Countries" value={data.executive.impactMetrics?.projected2027?.countries} />
                        <MetricCard label="Budget" value={`$${(data.executive.impactMetrics?.projected2027?.totalBudgetManaged / 1000000000).toFixed(0)}B`} />
                        <MetricCard label="Beneficiaries" value={`${(data.executive.impactMetrics?.projected2027?.beneficiariesServed / 1000000).toFixed(0)}M`} />
                        <MetricCard label="Automation" value={`${data.executive.impactMetrics?.projected2027?.automationRate}%`} color="blue" />
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {!loading && activeSection === 'maturity' && data.maturity && (
              <div className="space-y-8">
                <Section title="Governance Maturity Model (GMM)" icon="📊">
                  <p className="text-gray-300 mb-6">{data.maturity.model?.description}</p>
                  <div className="space-y-4">
                    {data.maturity.levels?.map((l: any) => (
                      <div key={l.level} className={`p-5 rounded-xl border-l-4 ${l.level === 5 ? 'border-emerald-500 bg-emerald-900/20' : l.level === 4 ? 'border-green-500 bg-green-900/20' : l.level === 3 ? 'border-yellow-500 bg-yellow-900/20' : l.level === 2 ? 'border-orange-500 bg-orange-900/20' : 'border-red-500 bg-red-900/20'}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${levelColors[l.level]}`}>{l.level}</span>
                          <div>
                            <p className="text-white font-bold text-lg">{l.name}</p>
                            <p className="text-gray-400 text-sm">{l.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-500 text-xs uppercase mb-2">Characteristics</p>
                            <ul className="space-y-1">
                              {l.characteristics?.slice(0, 4).map((c: string, i: number) => (
                                <li key={i} className="text-gray-300 text-sm">• {c}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase mb-2">Investment</p>
                            <p className="text-white font-mono">{l.investmentRequired}</p>
                            {l.timeToNextLevel && (
                              <>
                                <p className="text-gray-500 text-xs uppercase mt-3 mb-1">Time to Next</p>
                                <p className="text-gray-300">{l.timeToNextLevel}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Current Assessments" icon="🎯">
                  <div className="grid grid-cols-4 gap-4">
                    {data.maturity.currentAssessments?.map((a: any) => (
                      <div key={a.country} className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-white font-bold">{a.country}</p>
                        <p className="text-4xl font-bold text-blue-400 my-2">{a.level}</p>
                        <div className="flex items-center gap-2">
                          <span className={a.trend === 'improving' ? 'text-green-400' : 'text-gray-400'}>{a.trend === 'improving' ? '↑' : '→'}</span>
                          <span className="text-gray-400 text-sm">Target: {a.targetLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {!loading && activeSection === 'standards' && data.standards && (
              <div className="space-y-8">
                <Section title="International Standards Compliance" icon="🌍">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <MetricCard label="Total Standards" value={data.standards.overview?.totalStandards} />
                    <MetricCard label="Full Compliance" value={data.standards.overview?.fullCompliance} color="green" />
                    <MetricCard label="Partial" value={data.standards.overview?.partialCompliance} color="yellow" />
                    <MetricCard label="Overall Score" value={`${data.standards.overview?.overallScore}%`} color="green" />
                  </div>
                </Section>

                {data.standards.frameworks?.map((f: any) => (
                  <Section key={f.organization} title={f.organization} icon="🏛️">
                    <div className="space-y-3">
                      {f.frameworks?.map((fw: any) => (
                        <div key={fw.name} className="p-4 bg-gray-800 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-bold">{fw.name}</p>
                              <p className="text-gray-400 text-sm">{fw.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${fw.compliance >= 95 ? 'bg-green-900 text-green-300' : fw.compliance >= 80 ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>{fw.compliance}%</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {fw.features?.map((feat: string) => (
                              <span key={feat} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{feat}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                ))}

                <Section title="Certifications" icon="🏅">
                  <div className="grid grid-cols-5 gap-3">
                    {data.standards.certifications?.map((c: any) => (
                      <div key={c.name} className="bg-gray-800 p-4 rounded-xl text-center">
                        <span className="text-3xl">✅</span>
                        <p className="text-white font-bold mt-2">{c.name}</p>
                        <p className="text-gray-400 text-xs">{c.scope}</p>
                        <p className="text-green-400 text-xs mt-2">Valid: {c.validUntil}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {!loading && activeSection === 'donors' && data.donors && (
              <div className="space-y-8">
                <Section title="Donor Alignment Framework" icon="💰">
                  <p className="text-gray-300 mb-4">{data.donors.framework?.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.donors.framework?.principles?.map((p: string) => (
                      <span key={p} className="px-3 py-2 bg-blue-900/50 text-blue-300 rounded-lg text-sm">{p}</span>
                    ))}
                  </div>
                </Section>

                <Section title="Current Donors" icon="🤝">
                  <div className="space-y-4">
                    {data.donors.currentDonors?.map((d: any) => (
                      <div key={d.donor} className="p-5 bg-gray-800 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-white font-bold text-xl">{d.donor}</p>
                            <p className="text-gray-400 text-sm capitalize">{d.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-400">${(d.totalCommitment / 1000000).toFixed(0)}M</p>
                            <p className="text-gray-400 text-sm">{d.activeProgramsCount} programs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-gray-500 text-xs mb-1">Compliance</p>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${d.complianceScore}%` }}></div>
                            </div>
                          </div>
                          <span className="text-green-400 font-bold">{d.complianceScore}%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {d.requirements?.map((r: string) => (
                            <span key={r} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{r}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Harmonized Reporting" icon="📊">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {data.donors.harmonizedReporting?.benefits?.map((b: string, i: number) => (
                      <div key={i} className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-center">
                        <p className="text-green-300">{b}</p>
                      </div>
                    ))}
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-sm">
                        <th className="text-left pb-3">Report Type</th>
                        <th className="text-center pb-3">Frequency</th>
                        <th className="text-center pb-3">Donors</th>
                        <th className="text-right pb-3">Automation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.donors.harmonizedReporting?.reportTypes?.map((r: any) => (
                        <tr key={r.type} className="border-t border-gray-700">
                          <td className="py-3 text-white">{r.type}</td>
                          <td className="py-3 text-center text-gray-400">{r.frequency}</td>
                          <td className="py-3 text-center text-gray-400">{Array.isArray(r.donors) ? r.donors.join(', ') : r.donors}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-1 rounded text-xs ${r.automation >= 90 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{r.automation}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Section>
              </div>
            )}

            {!loading && activeSection === 'architecture' && data.architecture && (
              <div className="space-y-8">
                <Section title="Technical Architecture" icon="🏗️">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <MetricCard label="Type" value={data.architecture.overview?.type?.split(',')[0]} />
                    <MetricCard label="Version" value={data.architecture.overview?.version} />
                    <MetricCard label="Deployment" value="Multi-Region" />
                    <MetricCard label="Availability" value={data.architecture.scalability?.currentCapacity?.availability} color="green" />
                  </div>
                </Section>

                {data.architecture.layers?.map((layer: any) => (
                  <Section key={layer.name} title={layer.name} icon="📦">
                    <div className="grid grid-cols-2 gap-3">
                      {layer.components?.map((c: any) => (
                        <div key={c.name} className="p-4 bg-gray-800 rounded-lg">
                          <p className="text-white font-bold">{c.name}</p>
                          <p className="text-blue-400 text-sm font-mono">{c.technology}</p>
                          <p className="text-gray-400 text-xs mt-1">{c.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </Section>
                ))}

                <Section title="Security" icon="🔐">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Encryption</p>
                      <p className="text-white">At Rest: <span className="text-green-400">{data.architecture.security?.encryption?.atRest}</span></p>
                      <p className="text-white">In Transit: <span className="text-green-400">{data.architecture.security?.encryption?.inTransit}</span></p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Authentication</p>
                      <p className="text-white">{data.architecture.security?.authentication?.primary}</p>
                      <p className="text-gray-400 text-sm">MFA: {data.architecture.security?.authentication?.mfa}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Authorization</p>
                      <p className="text-white">{data.architecture.security?.authorization?.model}</p>
                      <p className="text-gray-400 text-sm">{data.architecture.security?.authorization?.roles}</p>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {!loading && activeSection === 'roadmap' && data.roadmap && (
              <div className="space-y-8">
                <Section title="Implementation Roadmap" icon="🗺️">
                  <div className="space-y-6">
                    {data.roadmap.phases?.map((p: any) => (
                      <div key={p.phase} className="relative pl-8 pb-8 border-l-2 border-blue-600 last:border-0">
                        <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{p.phase}</div>
                        <div className="bg-gray-800 p-5 rounded-xl ml-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-white font-bold text-xl">{p.name}</p>
                              <p className="text-gray-400">{p.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-blue-400 font-mono">{p.duration}</p>
                              <p className="text-green-400 text-sm">{p.investmentRange}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-gray-500 text-xs uppercase mb-2">Activities</p>
                              <ul className="space-y-1">
                                {p.activities?.slice(0, 4).map((a: string, i: number) => (
                                  <li key={i} className="text-gray-300 text-sm">• {a}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase mb-2">Deliverables</p>
                              <ul className="space-y-1">
                                {p.deliverables?.slice(0, 4).map((d: string, i: number) => (
                                  <li key={i} className="text-green-400 text-sm">✓ {d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Success Factors" icon="⭐">
                  <div className="grid grid-cols-5 gap-3">
                    {data.roadmap.successFactors?.map((f: string, i: number) => (
                      <div key={i} className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-center">
                        <p className="text-green-300 text-sm">{f}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {!loading && activeSection === 'cases' && data.cases && (
              <div className="space-y-8">
                <Section title="Case Studies" icon="📚">
                  <div className="space-y-6">
                    {data.cases.caseStudies?.map((c: any) => (
                      <div key={c.id} className="bg-gray-800 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-5">
                          <p className="text-blue-300 text-sm">{c.id}</p>
                          <p className="text-white font-bold text-xl">{c.title}</p>
                          <p className="text-gray-300">{c.period}</p>
                        </div>
                        <div className="p-5">
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Context</p>
                              <p className="text-gray-300 text-sm">{c.context}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Challenge</p>
                              <p className="text-gray-300 text-sm">{c.challenge}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Solution</p>
                              <p className="text-gray-300 text-sm">{c.solution}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-3 mb-4">
                            {Object.entries(c.results || {}).slice(0, 4).map(([key, val]) => (
                              <div key={key} className="bg-gray-700/50 p-3 rounded-lg text-center">
                                <p className="text-2xl font-bold text-green-400">{String(val)}</p>
                                <p className="text-gray-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                              </div>
                            ))}
                          </div>
                          {c.testimonial && (
                            <div className="bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                              <p className="text-gray-300 italic">"{c.testimonial.quote}"</p>
                              <p className="text-blue-400 text-sm mt-2">— {c.testimonial.author}, {c.testimonial.country}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: any; color?: string }) {
  const colors: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', yellow: 'text-yellow-400', default: 'text-white' };
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className={'text-2xl font-bold ' + (colors[color || 'default'])}>{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}