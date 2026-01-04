'use client';

import { useState, useEffect } from 'react';

export default function EngineControlPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [middleware, modules] = await Promise.all([
        fetch('/api/hbs/middleware', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status' }) }).then(r => r.json()),
        fetch('/api/hbs/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status' }) }).then(r => r.json())
      ]);
      setData({ middleware, modules });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadDashboard(); }, []);

  const runTest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          module: 'procurement',
          operation: 'purchase',
          user: 'test_user',
          data: {
            amount: 75000,
            vendor: 'Test Vendor',
            urgency: 'normal',
            category: 'medical',
            documented: true,
            budgetApproved: true
          }
        })
      });
      setTestResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const tabs = [
    { id: 'dashboard', name: '📊 Dashboard' },
    { id: 'modules', name: '🔌 Modules' },
    { id: 'test', name: '🧪 Test Engine' },
    { id: 'api', name: '📡 API Reference' }
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-8 text-white mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">🧠</span>
                <div>
                  <h1 className="text-4xl font-bold">HBS Governance Engine</h1>
                  <p className="text-pink-200">v2.0 — Central Brain for IVYAR Platform</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 font-medium">OPERATIONAL</span>
              </div>
              <p className="text-pink-200 text-sm mt-1">Uptime: {data.middleware?.uptime || '99.97%'}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={'px-6 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              <StatCard title="Requests Today" value={data.middleware?.metrics?.requestsToday || '-'} icon="📨" />
              <StatCard title="Auto-Approved" value={data.middleware?.metrics?.autoApproved || '-'} icon="✅" color="green" />
              <StatCard title="Blocked" value={data.middleware?.metrics?.blocked || '-'} icon="🚫" color="red" />
              <StatCard title="Escalated" value={data.middleware?.metrics?.escalated || '-'} icon="⬆️" color="yellow" />
              <StatCard title="Avg Latency" value={data.middleware?.metrics?.avgLatency || '-'} icon="⚡" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🔌 Module Status</h3>
                <div className="space-y-3">
                  {data.modules?.modules?.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={'w-2 h-2 rounded-full ' + (m.status === 'active' ? 'bg-green-400' : 'bg-red-400')}></span>
                        <div>
                          <p className="text-white font-medium">{m.name}</p>
                          <p className="text-gray-400 text-xs">v{m.version}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono">{m.metrics?.requestsToday || 0}</p>
                        <p className="text-gray-400 text-xs">requests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">🏥 Health Checks</h3>
                <div className="grid grid-cols-2 gap-3">
                  {data.middleware?.healthChecks && Object.entries(data.middleware.healthChecks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300 capitalize">{key}</span>
                      <span className={'px-2 py-1 rounded text-xs font-bold ' + (value === 'healthy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300')}>
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📊 Module Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm">
                      <th className="text-left pb-3">Module</th>
                      <th className="text-right pb-3">Requests</th>
                      <th className="text-right pb-3">Approved</th>
                      <th className="text-right pb-3">Rejected</th>
                      <th className="text-right pb-3">Pending</th>
                      <th className="text-right pb-3">Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.modules?.modules?.map((m: any) => (
                      <tr key={m.id} className="border-t border-gray-700">
                        <td className="py-3 text-white font-medium">{m.name}</td>
                        <td className="py-3 text-right text-gray-300">{m.metrics?.requestsToday || 0}</td>
                        <td className="py-3 text-right text-green-400">{m.metrics?.approved || 0}</td>
                        <td className="py-3 text-right text-red-400">{m.metrics?.rejected || 0}</td>
                        <td className="py-3 text-right text-yellow-400">{m.metrics?.pending || 0}</td>
                        <td className="py-3 text-right">
                          <span className={'px-2 py-1 rounded text-xs ' + ((m.metrics?.complianceRate || 0) >= 98 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300')}>
                            {m.metrics?.complianceRate || 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="grid grid-cols-3 gap-6">
            {data.modules?.modules?.map((m: any) => (
              <div key={m.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">{m.name}</h3>
                  <span className={'px-2 py-1 rounded text-xs ' + (m.governanceLevel === 'critical' ? 'bg-red-900 text-red-300' : m.governanceLevel === 'high' ? 'bg-orange-900 text-orange-300' : 'bg-blue-900 text-blue-300')}>
                    {m.governanceLevel}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Version</span>
                    <span className="text-white font-mono">{m.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Rules</span>
                    <span className="text-white">{m.activeRules}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Boundaries</span>
                    <span className="text-white">{m.boundariesEnforced}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Sync</span>
                    <span className="text-gray-300 text-xs">{new Date(m.lastSync).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Compliance</span>
                    <span className="text-green-400 font-bold">{m.metrics?.complianceRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${m.metrics?.complianceRate || 0}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'test' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🧪 Test Governance Engine</h3>
              <p className="text-gray-400 mb-4">Run a test evaluation through the governance engine</p>
              <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                <pre className="text-gray-300 text-sm overflow-auto">{JSON.stringify({
                  module: 'procurement',
                  operation: 'purchase',
                  data: { amount: 75000, vendor: 'Test Vendor', urgency: 'normal', category: 'medical' }
                }, null, 2)}</pre>
              </div>
              <button onClick={runTest} disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-600">
                {loading ? 'Running...' : '▶️ Run Evaluation'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">📋 Result</h3>
              {testResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Decision ID</span>
                    <span className="text-white font-mono text-sm">{testResult.decisionId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Decision</span>
                    <span className={'px-3 py-1 rounded font-bold ' + (testResult.evaluation?.decision === 'auto-approve' ? 'bg-green-900 text-green-300' : testResult.evaluation?.decision === 'auto-reject' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300')}>
                      {testResult.evaluation?.decision}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Overall Score</span>
                    <span className="text-white text-2xl font-bold">{testResult.evaluation?.overallScore}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Checks</p>
                    <div className="space-y-2">
                      {testResult.evaluation?.checks && Object.entries(testResult.evaluation.checks).map(([key, val]: any) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-300 capitalize">{key}</span>
                          <div className="flex items-center gap-2">
                            <span className={'w-2 h-2 rounded-full ' + (val.passed ? 'bg-green-400' : 'bg-red-400')}></span>
                            <span className="text-white font-mono">{val.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Run a test to see results</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <APISection title="Governance Engine" endpoint="/api/hbs/engine" actions={['evaluate', 'approve', 'reject', 'escalate', 'audit']} color="purple" />
            <APISection title="Middleware" endpoint="/api/hbs/middleware" actions={['intercept', 'validate', 'transform', 'log', 'status']} color="pink" />
            <APISection title="Module Integration" endpoint="/api/hbs/modules" actions={['register', 'configure', 'status', 'sync', 'health']} color="blue" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: any; icon: string; color?: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    default: 'text-white'
  };
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

function APISection({ title, endpoint, actions, color }: { title: string; endpoint: string; actions: string[]; color: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">{title}</h3>
        <code className={`text-${color}-400 bg-${color}-900/30 px-3 py-1 rounded`}>{endpoint}</code>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map(a => (
          <span key={a} className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm">{a}</span>
        ))}
      </div>
    </div>
  );
}