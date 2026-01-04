'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const loadData = async (tab: string) => {
    setLoading(true);
    try {
      const endpoints: Record<string, { url: string; body: any }[]> = {
        overview: [
          { url: '/api/hbs/analytics/behavior', body: { action: 'user-activity', timeframe: '30d' } },
          { url: '/api/hbs/analytics/predictive', body: { action: 'risk-forecast', horizon: '90d' } }
        ],
        behavior: [
          { url: '/api/hbs/analytics/behavior', body: { action: 'user-activity', timeframe: '30d' } },
          { url: '/api/hbs/analytics/behavior', body: { action: 'decision-patterns', timeframe: '30d' } }
        ],
        risks: [
          { url: '/api/hbs/analytics/predictive', body: { action: 'risk-forecast', horizon: '90d' } },
          { url: '/api/hbs/analytics/predictive', body: { action: 'early-warnings' } }
        ],
        policy: [
          { url: '/api/hbs/analytics/policy', body: { action: 'recommendations' } },
          { url: '/api/hbs/analytics/policy', body: { action: 'benchmarks' } }
        ]
      };

      const results: any = {};
      for (const ep of endpoints[tab] || []) {
        const res = await fetch(ep.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ep.body)
        });
        const json = await res.json();
        results[ep.body.action] = json;
      }
      setData(results);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(activeTab); }, [activeTab]);

  const tabs = [
    { id: 'overview', name: '📊 Overview', color: 'indigo' },
    { id: 'behavior', name: '👥 Behavior', color: 'blue' },
    { id: 'risks', name: '⚠️ Risks', color: 'red' },
    { id: 'policy', name: '📋 Policy', color: 'green' }
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">📈 Institutional Analytics</h1>
              <p className="text-indigo-200">Executive Dashboard for Donors, Auditors & Ministries</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-indigo-200">Last Updated</p>
              <p className="font-mono">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={'px-6 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}
            >
              {t.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading analytics...</div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab data={data} />}
            {activeTab === 'behavior' && <BehaviorTab data={data} />}
            {activeTab === 'risks' && <RisksTab data={data} />}
            {activeTab === 'policy' && <PolicyTab data={data} />}
          </>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: any }) {
  const activity = data['user-activity'];
  const forecast = data['risk-forecast'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Daily Active Users" value={activity?.summary?.totalUsers || '-'} change="+12%" positive />
        <MetricCard title="Decisions Made" value={activity?.summary?.totalDecisions || '-'} change="+8%" positive />
        <MetricCard title="Current Risk Score" value={forecast?.currentRiskScore || '-'} change={forecast?.riskChange || ''} positive={false} />
        <MetricCard title="Predicted Risk (90d)" value={forecast?.predictedRiskScore || '-'} subtitle="Confidence: 78%" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">📈 Risk Trajectory</h3>
          <div className="space-y-3">
            {forecast?.monthlyProjection?.map((m: any) => (
              <div key={m.month} className="flex items-center gap-4">
                <span className="text-gray-400 w-20">{m.month}</span>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div className={'h-full rounded-full ' + (m.score >= 60 ? 'bg-red-500' : m.score >= 40 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${m.score}%` }} />
                </div>
                <span className="text-white font-mono w-12">{m.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">🎯 Top Modules</h3>
          <div className="space-y-3">
            {activity?.topModules?.map((m: any) => (
              <div key={m.module} className="flex items-center justify-between">
                <span className="text-gray-300">{m.module}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${m.percentage}%` }} />
                  </div>
                  <span className="text-white font-mono text-sm">{m.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">🔮 Key Risk Events</h3>
        <div className="grid grid-cols-4 gap-4">
          {forecast?.keyRiskEvents?.map((e: any, i: number) => (
            <div key={i} className={'p-4 rounded-lg ' + (e.impact === 'high' ? 'bg-red-900/30 border border-red-700' : 'bg-yellow-900/30 border border-yellow-700')}>
              <p className="text-white font-medium">{e.event}</p>
              <p className="text-gray-400 text-sm mt-1">{e.date}</p>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Impact: {e.impact}</span>
                <span className="text-xs text-gray-500">{Math.round(e.probability * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BehaviorTab({ data }: { data: any }) {
  const activity = data['user-activity'];
  const patterns = data['decision-patterns'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">👥 User Segments</h3>
          <div className="space-y-3">
            {activity?.userSegments?.map((s: any) => (
              <div key={s.segment} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{s.segment}</p>
                  <p className="text-gray-400 text-sm">{s.count} users</p>
                </div>
                <div className="text-right">
                  <p className="text-indigo-400 font-bold">{s.percentage}%</p>
                  <p className="text-gray-500 text-xs">{s.avgDecisions} decisions/user</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">📊 Decision Types</h3>
          <div className="space-y-3">
            {patterns?.decisionTypes?.map((d: any) => (
              <div key={d.type} className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">{d.type}</span>
                  <span className="text-gray-400">{d.count} total</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded">✓ {d.approved}</span>
                  <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded">✗ {d.rejected}</span>
                  <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded">⏱ {d.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">🔍 Detected Patterns</h3>
        <div className="space-y-4">
          {patterns?.patterns?.map((p: any) => (
            <div key={p.id} className={'p-4 rounded-lg border ' + (p.riskLevel === 'critical' ? 'bg-red-900/20 border-red-700' : p.riskLevel === 'high' ? 'bg-orange-900/20 border-orange-700' : 'bg-yellow-900/20 border-yellow-700')}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-gray-500 text-sm">{p.id}</span>
                  <h4 className="text-white font-bold">{p.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={'px-2 py-1 rounded text-xs ' + (p.trend === 'increasing' ? 'bg-red-900 text-red-300' : p.trend === 'decreasing' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300')}>
                    {p.trendValue}
                  </span>
                  <span className={'px-2 py-1 rounded text-xs font-bold ' + (p.riskLevel === 'critical' ? 'bg-red-600' : p.riskLevel === 'high' ? 'bg-orange-600' : 'bg-yellow-600')}>{p.riskLevel}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">{p.description}</p>
              <p className="text-indigo-400 text-sm">💡 {p.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RisksTab({ data }: { data: any }) {
  const forecast = data['risk-forecast'];
  const warnings = data['early-warnings'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {forecast?.forecasts?.map((f: any) => (
          <div key={f.category} className="bg-gray-800 rounded-xl p-4">
            <h4 className="text-gray-400 text-sm mb-2">{f.category}</h4>
            <div className="flex items-end gap-2 mb-2">
              <span className={'text-3xl font-bold ' + (f.predictedScore >= 60 ? 'text-red-400' : f.predictedScore >= 40 ? 'text-yellow-400' : 'text-green-400')}>
                {f.predictedScore}
              </span>
              <span className={'text-sm ' + (f.trajectory === 'increasing' ? 'text-red-400' : 'text-green-400')}>
                {f.change}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className={'h-full ' + (f.predictedScore >= 60 ? 'bg-red-500' : f.predictedScore >= 40 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${f.predictedScore}%` }} />
            </div>
            <p className="text-gray-500 text-xs mt-2">Peak: {f.peakRiskPeriod}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">🚨 Early Warnings</h3>
          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">{warnings?.criticalWarnings} Critical</span>
        </div>
        <div className="space-y-4">
          {warnings?.warnings?.map((w: any) => (
            <div key={w.id} className={'p-4 rounded-lg border ' + (w.severity === 'critical' ? 'bg-red-900/30 border-red-600' : w.severity === 'high' ? 'bg-orange-900/30 border-orange-600' : 'bg-yellow-900/30 border-yellow-600')}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={'px-2 py-0.5 rounded text-xs font-bold text-white ' + (w.severity === 'critical' ? 'bg-red-600' : w.severity === 'high' ? 'bg-orange-600' : 'bg-yellow-600')}>{w.severity}</span>
                    <span className="text-gray-500 text-sm">{w.category}</span>
                  </div>
                  <h4 className="text-white font-bold text-lg">{w.title}</h4>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Time to Impact</p>
                  <p className="text-white font-mono">{w.timeToImpact}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-3">{w.description}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {w.indicators?.slice(0, 3).map((ind: any, i: number) => (
                  <div key={i} className="bg-gray-800 p-2 rounded">
                    <p className="text-gray-500 text-xs">{ind.name}</p>
                    <p className={'font-mono ' + (ind.status === 'exceeded' ? 'text-red-400' : 'text-yellow-400')}>{ind.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-3">
                <p className="text-gray-400 text-sm mb-2">Recommended Actions:</p>
                <ul className="space-y-1">
                  {w.recommendedActions?.map((a: string, i: number) => (
                    <li key={i} className="text-indigo-400 text-sm">→ {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PolicyTab({ data }: { data: any }) {
  const recs = data['recommendations'];
  const benchmarks = data['benchmarks'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Your Score" value={benchmarks?.organizationScore || '-'} subtitle="Governance Maturity" />
        <MetricCard title="Peer Average" value={benchmarks?.peerAverage || '-'} subtitle="Industry Benchmark" />
        <MetricCard title="Top Quartile" value={benchmarks?.topQuartile || '-'} subtitle="Best in Class" />
        <MetricCard title="Your Rank" value={`#${benchmarks?.peerComparison?.yourRank || '-'}`} subtitle={`of ${benchmarks?.peerComparison?.totalPeers || '-'} peers`} />
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">📋 Policy Recommendations</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">{recs?.summary?.byPriority?.critical || 0} Critical</span>
            <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm">{recs?.summary?.byPriority?.high || 0} High</span>
          </div>
        </div>
        <div className="space-y-4">
          {recs?.recommendations?.slice(0, 5).map((r: any) => (
            <div key={r.id} className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={'px-2 py-0.5 rounded text-xs font-bold text-white ' + (r.priority === 'critical' ? 'bg-red-600' : r.priority === 'high' ? 'bg-orange-600' : 'bg-yellow-600')}>{r.priority}</span>
                    <span className="text-indigo-400 text-sm">{r.domain}</span>
                  </div>
                  <h4 className="text-white font-bold">{r.title}</h4>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">-{r.expectedImpact.riskReduction}% Risk</p>
                  <p className="text-gray-500 text-sm">{r.timeframe}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">📊 Benchmark Comparison</h3>
        <div className="space-y-4">
          {benchmarks?.benchmarks?.map((b: any) => (
            <div key={b.metric} className="flex items-center gap-4">
              <div className="w-48">
                <p className="text-white font-medium">{b.metric}</p>
                <p className={'text-xs ' + (b.trend === 'improving' ? 'text-green-400' : b.trend === 'worsening' ? 'text-red-400' : 'text-gray-400')}>{b.trend}</p>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-3 bg-gray-700 rounded-full relative">
                  <div className="absolute h-full bg-indigo-500 rounded-full" style={{ width: `${(b.yourScore / (b.topQuartile * 1.2)) * 100}%` }} />
                  <div className="absolute h-full w-0.5 bg-yellow-500" style={{ left: `${(b.peerAverage / (b.topQuartile * 1.2)) * 100}%` }} />
                  <div className="absolute h-full w-0.5 bg-green-500" style={{ left: `${(b.topQuartile / (b.topQuartile * 1.2)) * 100}%` }} />
                </div>
                <span className="text-white font-mono w-16 text-right">{b.yourScore}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded" /> Your Score</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-500" /> Peer Average</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500" /> Top Quartile</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, positive, subtitle }: { title: string; value: any; change?: string; positive?: boolean; subtitle?: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {change && <span className={'text-sm ' + (positive ? 'text-green-400' : 'text-red-400')}>{change}</span>}
      </div>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}