'use client';
import { useAutopilotAuth } from './useAutopilotAuth';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  v8Enabled: boolean;
  rolloutPercentage: number;
  last24Hours: {
    total: number;
    v7: number;
    v8: number;
  };
  avgSimilarity: number;
  comparisons: number;
}

export default function AutopilotDashboard() {
  const { user, loading: authLoading } = useAutopilotAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">🔒 Verifying ROOT access...</div>
      </div>
    );
  }

    rolloutPercentage: 0,
    last24Hours: { total: 0, v7: 0, v8: 0 },
    avgSimilarity: 0,
    comparisons: 0,
  });

  const [scanLine, setScanLine] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(scanInterval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('https://ivyar-api.ivyar-gov.workers.dev/api/hbs/autopilot/status');
      const json = await res.json();
      setData({
        v8Enabled: json.v8Enabled || false,
        rolloutPercentage: json.rolloutPercentage || 0,
        last24Hours: json.last24Hours || { total: 0, v7: 0, v8: 0 },
        avgSimilarity: json.avgSimilarity || 0,
        comparisons: json.comparisons || 0,
      });
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const handleRollout = async (percentage: number) => {
    setLoading(true);
    try {
      await fetch('/api/hbs/autopilot/flags/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage }),
      });
      await fetchStatus();
    } catch (error) {
      console.error('Rollout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await fetch('/api/hbs/autopilot/flags/disable', { method: 'POST' });
      await fetchStatus();
    } catch (error) {
      console.error('Disable failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = data?.last24Hours?.total || 1;
  const v7Percent = Math.round((data?.last24Hours?.v7 || 0 / total) * 100) || 0;
  const v8Percent = Math.round((data?.last24Hours?.v8 || 0 / total) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#0a0e27] text-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 pointer-events-none" style={{ top: `${scanLine}%`, transition: 'top 0.05s linear' }} />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-900/30 bg-[#0d1117]/95 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/us/hbs" className="text-cyan-400 hover:text-cyan-300 text-sm font-mono flex items-center gap-2 group">
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span>HBS MODULE</span>
                </Link>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
                <h1 className="text-xl font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  AUTOPILOT DASHBOARD
                </h1>
              </div>
              <div className="text-xs font-mono text-gray-500">
                LAST UPDATED: <span className="text-cyan-400" suppressHydrationWarning>
                  {typeof window !== 'undefined' ? new Date().toLocaleTimeString() : '--:--:--'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600" />
              <h2 className="text-sm font-mono text-cyan-400 tracking-widest uppercase">v7 → v8 Migration Control</h2>
            </div>
            <p className="text-gray-400 font-mono text-sm ml-4">Real-time monitoring and gradual rollout management</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusCard title="v8 Status" value={data.v8Enabled ? 'ENABLED' : 'DISABLED'} status={data.v8Enabled ? 'active' : 'inactive'} subtitle={`${data.rolloutPercentage}% Rollout`} />
              <StatusCard title="Last 24 Hours" value={data.last24Hours.total.toString()} status="info" subtitle={`v7: ${data?.last24Hours?.v7 || 0} | v8: ${data?.last24Hours?.v8 || 0}`} />
              <StatusCard title="Avg Similarity" value={`${Math.round(data.avgSimilarity * 100)}%`} status={data.avgSimilarity > 0.8 ? 'success' : 'warning'} subtitle={`${data.comparisons} comparisons`} />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-cyan-900/30 rounded-lg p-6 backdrop-blur-sm h-full">
                <h3 className="text-xs font-mono text-cyan-400 mb-4 tracking-widest">ROLLOUT PROGRESS</h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={2 * Math.PI * 56} strokeDashoffset={2 * Math.PI * 56 * (1 - data.rolloutPercentage / 100)} className="text-cyan-500 transition-all duration-1000" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-mono font-bold text-cyan-400">{data.rolloutPercentage}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span className={data.rolloutPercentage >= 0 ? 'text-cyan-400' : ''}>0%</span>
                  <span className={data.rolloutPercentage >= 25 ? 'text-cyan-400' : ''}>25%</span>
                  <span className={data.rolloutPercentage >= 50 ? 'text-cyan-400' : ''}>50%</span>
                  <span className={data.rolloutPercentage >= 75 ? 'text-cyan-400' : ''}>75%</span>
                  <span className={data.rolloutPercentage >= 100 ? 'text-cyan-400' : ''}>100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-purple-900/30 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xs font-mono text-purple-400 mb-6 tracking-widest">DECISION DISTRIBUTION</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-gray-300">v7 (Legacy)</span>
                      <span className="text-sm font-mono text-cyan-400">{data?.last24Hours?.v7 || 0}</span>
                    </div>
                    <div className="h-8 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gray-500 to-gray-700 transition-all duration-1000 flex items-center justify-end pr-3" style={{ width: `${v7Percent}%` }}>
                        <span className="text-xs font-mono text-white">{v7Percent}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-gray-300">v8 (AI-Powered)</span>
                      <span className="text-sm font-mono text-cyan-400">{data?.last24Hours?.v8 || 0}</span>
                    </div>
                    <div className="h-8 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000 flex items-center justify-end pr-3" style={{ width: `${v8Percent}%` }}>
                        <span className="text-xs font-mono text-white">{v8Percent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-emerald-900/30 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xs font-mono text-emerald-400 mb-6 tracking-widest">ROLLOUT CONTROLS</h3>
                <p className="text-xs text-gray-400 mb-4 font-mono">Start gradual rollout of v8:</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <ControlButton label="1%" onClick={() => handleRollout(1)} active={data.rolloutPercentage === 1} disabled={loading} />
                  <ControlButton label="5%" onClick={() => handleRollout(5)} active={data.rolloutPercentage === 5} disabled={loading} />
                  <ControlButton label="10%" onClick={() => handleRollout(10)} active={data.rolloutPercentage === 10} disabled={loading} />
                  <ControlButton label="25%" onClick={() => handleRollout(25)} active={data.rolloutPercentage === 25} disabled={loading} />
                  <ControlButton label="50%" onClick={() => handleRollout(50)} active={data.rolloutPercentage === 50} disabled={loading} />
                  <ControlButton label="75%" onClick={() => handleRollout(75)} active={data.rolloutPercentage === 75} disabled={loading} />
                  <ControlButton label="100%" onClick={() => handleRollout(100)} active={data.rolloutPercentage === 100} disabled={loading} fullWidth />
                </div>
                <button onClick={handleDisable} disabled={loading || !data.v8Enabled} className="w-full px-4 py-3 bg-gradient-to-r from-red-900/30 to-red-800/30 border-2 border-red-500/50 text-red-400 rounded-lg font-mono text-sm font-bold hover:bg-red-900/50 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? '⚙️ PROCESSING...' : '🚨 EMERGENCY ROLLBACK'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-900/30 pt-6">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
              <div>STATUS: <span className={data.v8Enabled ? 'text-green-400' : 'text-gray-400'}>{data.v8Enabled ? 'ACTIVE' : 'STANDBY'}</span></div>
              <div>TOTAL DECISIONS: <span className="text-cyan-400">{data.last24Hours.total}</span></div>
              <div>VERSION: <span className="text-cyan-400">8.0.0</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, value, status, subtitle }: { title: string; value: string; status: 'active' | 'inactive' | 'success' | 'warning' | 'info'; subtitle: string }) {
  const colors: Record<string, string> = {
    active: 'from-emerald-500/20 to-emerald-900/20 border-emerald-500/30 text-emerald-400',
    inactive: 'from-gray-500/20 to-gray-900/20 border-gray-500/30 text-gray-400',
    success: 'from-green-500/20 to-green-900/20 border-green-500/30 text-green-400',
    warning: 'from-yellow-500/20 to-yellow-900/20 border-yellow-500/30 text-yellow-400',
    info: 'from-cyan-500/20 to-cyan-900/20 border-cyan-500/30 text-cyan-400',
  };
  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors[status]} rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000`} />
      <div className={`relative bg-gradient-to-br ${colors[status]} border rounded-lg p-4 backdrop-blur-sm h-full`}>
        <div className="text-xs font-mono text-gray-400 mb-2">{title}</div>
        <div className={`text-2xl font-mono font-bold ${colors[status].split(' ')[2]} mb-2`}>{value}</div>
        <div className="text-xs font-mono text-gray-500">{subtitle}</div>
        <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${colors[status]} animate-pulse`} style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, onClick, active, disabled, fullWidth = false }: { label: string; onClick: () => void; active: boolean; disabled: boolean; fullWidth?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`${fullWidth ? 'col-span-2' : ''} px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all ${active ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-2 border-cyan-400' : 'bg-slate-800/50 text-cyan-400 border-2 border-cyan-900/50 hover:border-cyan-500/50 hover:bg-slate-800'} disabled:opacity-50 disabled:cursor-not-allowed`}>
      {label}
    </button>
  );
}
