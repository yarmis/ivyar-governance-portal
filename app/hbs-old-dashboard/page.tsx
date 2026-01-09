'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CommandCenter() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadDashboard = async () => {
    try {
      const [dashboard, kpis, signals, actions, health, insights, feed, modules] = await Promise.all([
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'dashboard' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'kpis' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'signals-live' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'quick-actions' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'system-health' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ai-insights' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'activity-feed' }) }).then(r => r.json()),
        fetch('/api/hbs/command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'module-stats' }) }).then(r => r.json())
      ]);
      setData({ dashboard, kpis, signals, actions, health, insights, feed, modules });
      setLastUpdate(new Date());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadDashboard(); const interval = setInterval(loadDashboard, 30000); return () => clearInterval(interval); }, []);

  const formatCurrency = (n: number) => n >= 1000000000 ? `$${(n / 1000000000).toFixed(2)}B` : n >= 1000000 ? `$${(n / 1000000).toFixed(0)}M` : `$${n.toLocaleString()}`;
  const formatNumber = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(2)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
  const timeAgo = (ts: string) => { const d = Date.now() - new Date(ts).getTime(); return d < 60000 ? 'just now' : d < 3600000 ? `${Math.floor(d / 60000)}m ago` : `${Math.floor(d / 3600000)}h ago`; };

  const severityColors: Record<string, string> = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-blue-500' };
  const trendIcons: Record<string, string> = { up: '↑', down: '↓', stable: '→' };
  const trendColors: Record<string, string> = { up: 'text-green-400', down: 'text-red-400', stable: 'text-gray-400' };

  if (loading) return <div className="bg-gray-900 min-h-screen flex items-center justify-center"><div className="text-white text-xl">Loading Command Center...</div></div>;

  const d = data.dashboard;
  const s = d?.summary;

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-5xl">🎯</span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-gray-900"></span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Command Center</h1>
                <p className="text-emerald-200">HBS v4.1 — Unified Governance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="text-gray-300">Last updated</p>
                <p className="text-white font-mono">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <button onClick={loadDashboard} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                <span className="text-xl">🔄</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-6 gap-4">
          <KPICard icon="💰" label="Total Budget" value={formatCurrency(s?.budget?.total || 0)} subvalue={`${s?.budget?.rate}% utilized`} trend={s?.budget?.trend} change={`+${s?.budget?.change}%`} />
          <KPICard icon="👥" label="Beneficiaries" value={formatNumber(s?.beneficiaries?.total || 0)} subvalue={`+${formatNumber(s?.beneficiaries?.thisMonth || 0)} this month`} trend={s?.beneficiaries?.trend} change={`+${s?.beneficiaries?.change}%`} />
          <KPICard icon="📋" label="Programs" value={s?.programs?.active || 0} subvalue={`${s?.programs?.at_risk || 0} at risk`} trend="stable" />
          <KPICard icon="🌍" label="Countries" value={s?.countries?.active || 0} subvalue={`${s?.countries?.onboarding || 0} onboarding`} trend="up" />
          <KPICard icon="✅" label="Compliance" value={`${s?.compliance?.score || 0}%`} subvalue="Above target" trend={s?.compliance?.trend} change={`+${s?.compliance?.change}%`} color="green" />
          <KPICard icon="🤖" label="Automation" value={`${s?.automation?.rate || 0}%`} subvalue="AI-powered" trend={s?.automation?.trend} change={`+${s?.automation?.change}%`} color="blue" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Modules */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span>🎯</span> Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {data.actions?.primary?.map((a: any) => (
                  <Link key={a.id} href={a.href} className={`p-4 rounded-lg bg-${a.color}-900/30 border border-${a.color}-700 hover:bg-${a.color}-900/50 transition-all`}>
                    <span className="text-2xl">{a.icon}</span>
                    <p className="text-white font-medium mt-2">{a.name}</p>
                    <p className="text-gray-400 text-xs">{a.description}</p>
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {data.actions?.secondary?.map((a: any) => (
                  <Link key={a.id} href={a.href} className="px-3 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 text-sm flex items-center gap-2">
                    <span>{a.icon}</span> {a.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* System Modules */}
            <div className="bg-gray-800 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span>🗺️</span> System Modules</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.modules?.modules?.map((m: any) => (
                  <Link key={m.id} href={m.href} className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all group">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{m.name}</p>
                        <div className="flex items-center gap-1">
                          <div className="flex-1 h-1 bg-gray-600 rounded-full">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.usage}%` }}></div>
                          </div>
                          <span className="text-gray-400 text-xs">{m.usage}%</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Signals & AI */}
          <div className="space-y-6">
            {/* Live Signals */}
            <div className="bg-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold flex items-center gap-2"><span>🔔</span> Live Signals</h2>
                <div className="flex gap-2">
                  {['critical', 'high', 'medium', 'low'].map(sev => (
                    <span key={sev} className={`px-2 py-1 rounded text-xs text-white ${severityColors[sev]}`}>
                      {data.signals?.summary?.[sev] || 0}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.signals?.signals?.slice(0, 5).map((sig: any) => (
                  <div key={sig.id} className="p-3 bg-gray-700/50 rounded-lg border-l-4" style={{ borderColor: sig.severity === 'critical' ? '#ef4444' : sig.severity === 'high' ? '#f97316' : sig.severity === 'medium' ? '#eab308' : '#3b82f6' }}>
                    <div className="flex justify-between items-start">
                      <p className="text-white text-sm font-medium">{sig.title}</p>
                      <span className="text-gray-500 text-xs">{timeAgo(sig.timestamp)}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{sig.source}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">{sig.action}</span>
                  </div>
                ))}
              </div>
              <Link href="/hbs/signals" className="block text-center text-blue-400 text-sm mt-3 hover:text-blue-300">View All Signals →</Link>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-5 border border-purple-700">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span>🤖</span> AI Insights</h2>
              <div className="space-y-3">
                {data.insights?.insights?.slice(0, 3).map((i: any) => (
                  <div key={i.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${i.priority === 'high' ? 'bg-orange-500' : i.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                      <p className="text-white text-sm font-medium">{i.title}</p>
                    </div>
                    <p className="text-gray-400 text-xs">{i.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-emerald-400 text-xs">{i.impact}</span>
                      <span className="text-gray-500 text-xs">{i.confidence}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/hbs/ai" className="block text-center text-purple-400 text-sm mt-3 hover:text-purple-300">View All Insights →</Link>
            </div>
          </div>

          {/* Right Column - Activity & Health */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold flex items-center gap-2"><span>💚</span> System Health</h2>
                <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm font-bold">{data.health?.score}%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.health?.modules?.slice(0, 6).map((m: any) => (
                  <div key={m.name} className="p-2 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300 text-xs">{m.name}</p>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <p className="text-white text-sm font-mono">{m.latency}ms</p>
                  </div>
                ))}
              </div>
              <Link href="/hbs/national" className="block text-center text-emerald-400 text-sm mt-3 hover:text-emerald-300">View Infrastructure →</Link>
            </div>

            {/* Activity Feed */}
            <div className="bg-gray-800 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span>📜</span> Activity Feed</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.feed?.activities?.slice(0, 6).map((a: any) => (
                  <div key={a.id} className="flex items-start gap-3 p-2 hover:bg-gray-700/30 rounded-lg">
                    <span className="text-lg mt-1">{a.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm">{a.title}</p>
                      <p className="text-gray-400 text-xs">{a.description}</p>
                      <p className="text-gray-500 text-xs mt-1">{a.ministry} • {timeAgo(a.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today Stats */}
            <div className="bg-gray-800 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><span>📅</span> Today</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">{d?.todayStats?.decisions}</p>
                  <p className="text-gray-400 text-xs">Decisions</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">{d?.todayStats?.transactions}</p>
                  <p className="text-gray-400 text-xs">Transactions</p>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-white">{d?.todayStats?.reports}</p>
                  <p className="text-gray-400 text-xs">Reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, subvalue, trend, change, color }: { icon: string; label: string; value: string | number; subvalue?: string; trend?: string; change?: string; color?: string }) {
  const trendColors: Record<string, string> = { up: 'text-green-400', down: 'text-red-400', stable: 'text-gray-400' };
  const trendIcons: Record<string, string> = { up: '↑', down: '↓', stable: '→' };
  const valueColors: Record<string, string> = { green: 'text-green-400', blue: 'text-blue-400', default: 'text-white' };

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${valueColors[color || 'default']}`}>{value}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-gray-500 text-xs">{subvalue}</span>
        {trend && <span className={`text-xs ${trendColors[trend]}`}>{trendIcons[trend]} {change}</span>}
      </div>
    </div>
  );
}