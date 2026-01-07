'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATS = [
  { label: 'Active Sessions', value: '1,247', change: '+23', icon: '🟢', color: 'green' },
  { label: 'Blocked IPs', value: '89', change: '+12', icon: '🚫', color: 'red' },
  { label: 'Failed Logins (24h)', value: '156', change: '-8', icon: '⚠️', color: 'yellow' },
  { label: 'Threat Level', value: 'Low', change: '●', icon: '🛡️', color: 'green' },
];

const RECENT_ACTIVITY = [
  { id: '1', type: 'login', user: 'o.kovalenko@gov.ua', ip: '192.168.1.45', location: 'Kyiv, UA', time: '2 min ago', status: 'success' },
  { id: '2', type: 'login_failed', user: 'unknown@test.com', ip: '45.33.32.156', location: 'Moscow, RU', time: '5 min ago', status: 'blocked' },
  { id: '3', type: 'permission_change', user: 'j.smith@company.com', ip: '10.0.0.12', location: 'New York, US', time: '15 min ago', status: 'success' },
  { id: '4', type: 'login_failed', user: 'admin@ivyar.org', ip: '185.220.101.34', location: 'Berlin, DE', time: '23 min ago', status: 'warning' },
  { id: '5', type: 'login', user: 'm.garcia@legal.com', ip: '172.16.0.89', location: 'Madrid, ES', time: '1 hour ago', status: 'success' },
  { id: '6', type: 'api_access', user: 'api-service', ip: '10.0.0.1', location: 'Internal', time: '1 hour ago', status: 'success' },
  { id: '7', type: 'login_failed', user: 'test@test.com', ip: '103.21.244.0', location: 'Beijing, CN', time: '2 hours ago', status: 'blocked' },
];

const BLOCKED_IPS = [
  { ip: '45.33.32.156', reason: 'Brute force attempt', country: 'RU', blockedAt: '5 min ago', attempts: 47 },
  { ip: '185.220.101.34', reason: 'Suspicious activity', country: 'DE', blockedAt: '23 min ago', attempts: 12 },
  { ip: '103.21.244.0', reason: 'Known malicious IP', country: 'CN', blockedAt: '2 hours ago', attempts: 156 },
  { ip: '91.121.87.45', reason: 'SQL injection attempt', country: 'FR', blockedAt: '1 day ago', attempts: 8 },
  { ip: '198.51.100.23', reason: 'DDoS source', country: 'US', blockedAt: '2 days ago', attempts: 2341 },
];

const HEATMAP_DATA = [
  { country: 'UA', requests: 45230, color: '#00A3FF' },
  { country: 'US', requests: 12450, color: '#00A3FF' },
  { country: 'DE', requests: 8920, color: '#00A3FF' },
  { country: 'PL', requests: 6540, color: '#00A3FF' },
  { country: 'RU', requests: 890, color: '#EF4444' },
  { country: 'CN', requests: 456, color: '#EF4444' },
];

const STATUS_STYLES: Record<string, string> = {
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  blocked: 'bg-red-500/20 text-red-400',
  error: 'bg-red-500/20 text-red-400',
};

const TYPE_ICONS: Record<string, string> = {
  login: '🔓',
  login_failed: '🔒',
  permission_change: '🔐',
  api_access: '🔌',
  logout: '👋',
};

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState<'activity' | 'blocked' | 'heatmap'>('activity');
  const [ipToBlock, setIpToBlock] = useState('');

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117]">IV</div>
              <span className="font-semibold">IVYAR</span>
            </Link>
            <span className="text-[#8B949E]">/</span>
            <span className="text-[#8B949E]">Admin</span>
            <span className="text-[#8B949E]">/</span>
            <span className="text-[#00A3FF]">🛡️ Security Center</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full animate-pulse">● Live Monitoring</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Security Center</h1>
            <p className="text-[#8B949E]">Monitor threats, analyze access patterns, and protect the platform</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    stat.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    stat.color === 'red' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <button className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-red-500 transition-colors text-left group">
              <span className="text-2xl mb-2 block">🚨</span>
              <span className="font-medium group-hover:text-red-400">Emergency Lockdown</span>
            </button>
            <button className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-yellow-500 transition-colors text-left group">
              <span className="text-2xl mb-2 block">🔄</span>
              <span className="font-medium group-hover:text-yellow-400">Force Logout All</span>
            </button>
            <button className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-colors text-left group">
              <span className="text-2xl mb-2 block">📊</span>
              <span className="font-medium group-hover:text-[#00A3FF]">Generate Report</span>
            </button>
            <button className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-green-500 transition-colors text-left group">
              <span className="text-2xl mb-2 block">🔍</span>
              <span className="font-medium group-hover:text-green-400">Run Security Scan</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'activity', label: 'Recent Activity', icon: '📋' },
              { key: 'blocked', label: 'Blocked IPs', icon: '🚫' },
              { key: 'heatmap', label: 'Geo Heatmap', icon: '🗺️' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-[#00A3FF] text-[#0D1117]'
                    : 'bg-[#1F242C] hover:bg-[#2D333B]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <div className="p-4 border-b border-[#1F242C] flex items-center justify-between">
                <h3 className="font-semibold">Live Activity Feed</h3>
                <span className="text-sm text-[#8B949E]">Last 24 hours</span>
              </div>
              <div className="divide-y divide-[#1F242C]">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-[#1F242C]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{TYPE_ICONS[activity.type] || '📌'}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{activity.user}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[activity.status]}`}>
                            {activity.status}
                          </span>
                        </div>
                        <div className="text-sm text-[#8B949E]">
                          {activity.type.replace('_', ' ')} • {activity.ip} • {activity.location}
                        </div>
                      </div>
                      <div className="text-sm text-[#8B949E]">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blocked IPs Tab */}
          {activeTab === 'blocked' && (
            <div>
              {/* Add IP Form */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-4 mb-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter IP address to block..."
                    value={ipToBlock}
                    onChange={(e) => setIpToBlock(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#0D1117] border border-[#1F242C] rounded-lg focus:border-[#00A3FF] focus:outline-none"
                  />
                  <button className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors">
                    Block IP
                  </button>
                </div>
              </div>

              {/* Blocked IPs Table */}
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1F242C]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">IP Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Country</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Attempts</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Blocked</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-[#8B949E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BLOCKED_IPS.map((ip) => (
                      <tr key={ip.ip} className="border-b border-[#1F242C] last:border-0 hover:bg-[#1F242C]/50">
                        <td className="px-4 py-4 font-mono text-red-400">{ip.ip}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-[#1F242C] rounded text-sm">{ip.country}</span>
                        </td>
                        <td className="px-4 py-4 text-sm">{ip.reason}</td>
                        <td className="px-4 py-4">
                          <span className="text-red-400 font-medium">{ip.attempts}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#8B949E]">{ip.blockedAt}</td>
                        <td className="px-4 py-4 text-right">
                          <button className="px-3 py-1 bg-[#1F242C] hover:bg-green-500/20 hover:text-green-400 rounded text-sm transition-colors">
                            Unblock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Heatmap Tab */}
          {activeTab === 'heatmap' && (
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Traffic by Country</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {HEATMAP_DATA.map((item) => (
                  <div
                    key={item.country}
                    className={`p-4 rounded-xl border text-center ${
                      item.color === '#EF4444'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-[#00A3FF]/10 border-[#00A3FF]/30'
                    }`}
                  >
                    <div className="text-3xl mb-2">
                      {item.country === 'UA' ? '🇺🇦' :
                       item.country === 'US' ? '🇺🇸' :
                       item.country === 'DE' ? '🇩🇪' :
                       item.country === 'PL' ? '🇵🇱' :
                       item.country === 'RU' ? '🇷🇺' :
                       item.country === 'CN' ? '🇨🇳' : '🌍'}
                    </div>
                    <div className="font-bold">{item.requests.toLocaleString()}</div>
                    <div className="text-xs text-[#8B949E]">{item.country}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[#1F242C] flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#00A3FF]"></div>
                  <span className="text-sm text-[#8B949E]">Trusted Traffic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm text-[#8B949E]">Suspicious Traffic</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/access" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-colors flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="font-medium">Access Control</div>
                <div className="text-sm text-[#8B949E]">Manage roles & users</div>
              </div>
            </Link>
            <Link href="/admin/breaches" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-colors flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-medium">Breaches Center</div>
                <div className="text-sm text-[#8B949E]">Incidents & investigations</div>
              </div>
            </Link>
            <Link href="/admin/audit" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-colors flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <div className="font-medium">Audit Logs</div>
                <div className="text-sm text-[#8B949E]">Activity & compliance</div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[#1F242C]">
        <div className="max-w-7xl mx-auto text-center text-sm text-[#8B949E]">
          © 2024-2026 IVYAR. All rights reserved. | Security Center v1.0
        </div>
      </footer>
    </div>
  );
}