'use client';

import { useState, useEffect } from 'react';

export default function SignalsPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [testSignal, setTestSignal] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboard, signals] = await Promise.all([
        fetch('/api/hbs/signals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'dashboard' }) }).then(r => r.json()),
        fetch('/api/hbs/signals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) }).then(r => r.json())
      ]);
      setData({ dashboard, signals });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); const interval = setInterval(loadData, 30000); return () => clearInterval(interval); }, []);

  const emitTestSignal = async (type: string, severity: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'emit',
          type,
          severity,
          source: 'manual-test',
          module: 'procurement',
          data: { amount: 250000, description: 'Test signal', boundary: type === 'boundary-violation' ? 'sanctions' : null }
        })
      });
      setTestSignal(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const acknowledgeSignal = async (signalId: string) => {
    await fetch('/api/hbs/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'acknowledge', signalId, userId: 'current_user', notes: 'Acknowledged via dashboard' })
    });
    loadData();
  };

  const tabs = [
    { id: 'live', name: '🔴 Live Signals' },
    { id: 'dashboard', name: '📊 Analytics' },
    { id: 'automation', name: '🤖 Automation' },
    { id: 'test', name: '🧪 Test' }
  ];

  const severityColors: Record<string, string> = {
    critical: 'bg-red-600',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  const statusColors: Record<string, string> = {
    active: 'bg-red-900 text-red-300',
    investigating: 'bg-yellow-900 text-yellow-300',
    resolved: 'bg-green-900 text-green-300'
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-xl p-8 text-white mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-5xl">🚨</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Autonomous Signals</h1>
                <p className="text-orange-200">v2.1 — Real-time Governance Monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 font-medium">MONITORING</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-red-500/50 rounded-full text-sm font-bold">{data.dashboard?.realTimeMetrics?.criticalActive || 0} Critical</span>
                <span className="px-3 py-1 bg-orange-500/50 rounded-full text-sm font-bold">{data.dashboard?.realTimeMetrics?.highActive || 0} High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={'px-6 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
          <button onClick={loadData} className="ml-auto px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
            🔄 Refresh
          </button>
        </div>

        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              <MetricCard title="Active Signals" value={data.dashboard?.realTimeMetrics?.activeSignals || 0} icon="📡" />
              <MetricCard title="Critical" value={data.dashboard?.realTimeMetrics?.criticalActive || 0} icon="🔴" color="red" />
              <MetricCard title="Pending Ack" value={data.dashboard?.realTimeMetrics?.pendingAcknowledgment || 0} icon="⏳" color="yellow" />
              <MetricCard title="Avg Response" value={data.dashboard?.realTimeMetrics?.avgResponseTime || '-'} icon="⚡" />
              <MetricCard title="Automation" value={data.dashboard?.realTimeMetrics?.automationRate || '-'} icon="🤖" color="green" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Live Signal Feed
              </h3>
              <div className="space-y-3">
                {data.signals?.signals?.map((s: any) => (
                  <div key={s.signalId} className={'p-4 rounded-lg border-l-4 ' + (s.severity === 'critical' ? 'bg-red-900/30 border-red-500' : s.severity === 'high' ? 'bg-orange-900/30 border-orange-500' : 'bg-gray-700/50 border-gray-500')}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className={'w-3 h-3 rounded-full ' + severityColors[s.severity]}></span>
                        <div>
                          <p className="text-white font-medium">{s.message}</p>
                          <p className="text-gray-400 text-sm">{s.signalId} • {s.module} • {s.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={'px-2 py-1 rounded text-xs font-bold ' + statusColors[s.status]}>{s.status}</span>
                        <span className="text-gray-500 text-xs">{new Date(s.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {!s.acknowledged && (
                        <button onClick={() => acknowledgeSignal(s.signalId)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          ✓ Acknowledge
                        </button>
                      )}
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600">
                        View Details
                      </button>
                      {s.severity === 'critical' || s.severity === 'high' ? (
                        <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                          ⬆️ Escalate
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📈 Signal Trend (24h)</h3>
                <div className="space-y-2">
                  {data.dashboard?.signalTrend?.map((t: any) => (
                    <div key={t.hour} className="flex items-center gap-3">
                      <span className="text-gray-400 w-16 text-sm">{t.hour}</span>
                      <div className="flex-1 h-6 bg-gray-700 rounded overflow-hidden flex">
                        {t.critical > 0 && <div className="h-full bg-red-500" style={{ width: `${(t.critical / 10) * 100}%` }}></div>}
                        {t.high > 0 && <div className="h-full bg-orange-500" style={{ width: `${(t.high / 10) * 100}%` }}></div>}
                        <div className="h-full bg-blue-500" style={{ width: `${((t.count - t.critical - t.high) / 10) * 100}%` }}></div>
                      </div>
                      <span className="text-white font-mono w-8">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🏷️ Signal Types</h3>
                <div className="space-y-3">
                  {data.dashboard?.topSignalTypes?.map((t: any) => (
                    <div key={t.type} className="flex items-center justify-between">
                      <span className="text-gray-300">{t.type.replace(/-/g, ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${t.percentage}%` }}></div>
                        </div>
                        <span className="text-white font-mono w-12 text-right">{t.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🔌 Module Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm">
                      <th className="text-left pb-3">Module</th>
                      <th className="text-right pb-3">Total Signals</th>
                      <th className="text-right pb-3">Critical</th>
                      <th className="text-right pb-3">Resolved</th>
                      <th className="text-right pb-3">Resolution Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dashboard?.moduleBreakdown?.map((m: any) => (
                      <tr key={m.module} className="border-t border-gray-700">
                        <td className="py-3 text-white font-medium capitalize">{m.module}</td>
                        <td className="py-3 text-right text-gray-300">{m.signals}</td>
                        <td className="py-3 text-right text-red-400">{m.critical}</td>
                        <td className="py-3 text-right text-green-400">{m.resolved}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">
                            {Math.round((m.resolved / m.signals) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Avg Acknowledge Time</p>
                <p className="text-2xl font-bold text-white">{data.dashboard?.responseMetrics?.avgAcknowledgeTime}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-white">{data.dashboard?.responseMetrics?.avgResolutionTime}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">SLA Compliance</p>
                <p className="text-2xl font-bold text-green-400">{data.dashboard?.responseMetrics?.slaCompliance}%</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Escalation Rate</p>
                <p className="text-2xl font-bold text-yellow-400">{data.dashboard?.responseMetrics?.escalationRate}%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <MetricCard title="Rules Triggered" value={data.dashboard?.automationStats?.totalTriggered || 0} icon="⚡" />
              <MetricCard title="Successful" value={data.dashboard?.automationStats?.successfulActions || 0} icon="✅" color="green" />
              <MetricCard title="Failed" value={data.dashboard?.automationStats?.failedActions || 0} icon="❌" color="red" />
              <MetricCard title="Manual Overrides" value={data.dashboard?.automationStats?.manualOverrides || 0} icon="👤" color="yellow" />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🤖 Automation Rules</h3>
              <div className="space-y-4">
                {[
                  { id: 'AUTO-001', name: 'Block Sanctions Violations', trigger: 'boundary-violation + sanctions', action: 'block-transaction', enabled: true, triggered: 12 },
                  { id: 'AUTO-002', name: 'Escalate High-Value Risks', trigger: 'amount > $500K + high severity', action: 'escalate-to-board', enabled: true, triggered: 28 },
                  { id: 'AUTO-003', name: 'Freeze on Fraud Detection', trigger: 'anomaly + fraud category', action: 'freeze-account', enabled: true, triggered: 5 },
                  { id: 'AUTO-004', name: 'Alert Compliance Team', trigger: 'compliance-alert + severity >= medium', action: 'notify-compliance', enabled: true, triggered: 34 },
                  { id: 'AUTO-005', name: 'Pause Ethics Concerns', trigger: 'ethics-concern + any', action: 'pause-and-review', enabled: true, triggered: 10 }
                ].map(rule => (
                  <div key={rule.id} className="p-4 bg-gray-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={'w-3 h-3 rounded-full ' + (rule.enabled ? 'bg-green-400' : 'bg-gray-500')}></div>
                      <div>
                        <p className="text-white font-medium">{rule.name}</p>
                        <p className="text-gray-400 text-sm">Trigger: {rule.trigger}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">→ {rule.action}</span>
                      <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-sm">{rule.triggered}x triggered</span>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🧪 Emit Test Signal</h3>
              <p className="text-gray-400 mb-4">Generate a test signal to see the autonomous response</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => emitTestSignal('boundary-violation', 'critical')} className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-left hover:bg-red-900">
                  <p className="text-red-400 font-bold">🚫 Boundary Violation</p>
                  <p className="text-gray-400 text-sm">Critical severity</p>
                </button>
                <button onClick={() => emitTestSignal('risk-threshold', 'high')} className="p-4 bg-orange-900/50 border border-orange-700 rounded-lg text-left hover:bg-orange-900">
                  <p className="text-orange-400 font-bold">⚠️ Risk Threshold</p>
                  <p className="text-gray-400 text-sm">High severity</p>
                </button>
                <button onClick={() => emitTestSignal('anomaly-detected', 'high')} className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-left hover:bg-yellow-900">
                  <p className="text-yellow-400 font-bold">🔍 Anomaly Detected</p>
                  <p className="text-gray-400 text-sm">High severity</p>
                </button>
                <button onClick={() => emitTestSignal('compliance-alert', 'medium')} className="p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-left hover:bg-blue-900">
                  <p className="text-blue-400 font-bold">📋 Compliance Alert</p>
                  <p className="text-gray-400 text-sm">Medium severity</p>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📋 Signal Response</h3>
              {testSignal ? (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-xs">Signal ID</p>
                    <p className="text-white font-mono">{testSignal.signal?.signalId}</p>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-xs">Auto Response</p>
                    <p className="text-white font-bold">{testSignal.autoResponse?.action}</p>
                    <p className="text-gray-300 text-sm">{testSignal.autoResponse?.message}</p>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-xs">Auto Actions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {testSignal.autoResponse?.autoActions?.map((a: string) => (
                        <span key={a} className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-xs">Notifications</p>
                    <div className="space-y-1 mt-1">
                      {testSignal.notifications?.map((n: any, i: number) => (
                        <p key={i} className="text-gray-300 text-sm">→ {n.channel}: {n.recipients?.join(', ')}</p>
                      ))}
                    </div>
                  </div>
                  {testSignal.automationTriggered?.length > 0 && (
                    <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
                      <p className="text-green-400 text-xs font-bold">Automation Triggered!</p>
                      {testSignal.automationTriggered.map((a: any) => (
                        <p key={a.ruleId} className="text-green-300 text-sm">{a.name} → {a.action}</p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Emit a test signal to see the response</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string; value: any; icon: string; color?: string }) {
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