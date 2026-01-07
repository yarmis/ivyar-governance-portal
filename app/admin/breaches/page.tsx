'use client';

import { useState } from 'react';
import Link from 'next/link';

const STATS = [
  { label: 'Open Incidents', value: '7', change: '+2', icon: '🔴', color: 'red' },
  { label: 'Investigating', value: '3', change: '0', icon: '🔍', color: 'yellow' },
  { label: 'Resolved (30d)', value: '24', change: '+8', icon: '✅', color: 'green' },
  { label: 'Avg Resolution', value: '4.2h', change: '-1.5h', icon: '⏱️', color: 'green' },
];

type Severity = 'critical' | 'high' | 'medium' | 'low';
type Status = 'open' | 'investigating' | 'resolved' | 'closed';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  reporter: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  affectedUsers: number;
  category: string;
}

const INCIDENTS: Incident[] = [
  { id: 'INC-001', title: 'Unauthorized API Access Attempt', description: 'Multiple failed API authentication attempts from suspicious IP range', severity: 'critical', status: 'investigating', reporter: 'System', assignee: 'Security Team', createdAt: '2 hours ago', updatedAt: '30 min ago', affectedUsers: 0, category: 'API Security' },
  { id: 'INC-002', title: 'Brute Force Attack Detected', description: 'Over 500 login attempts from single IP in 10 minutes', severity: 'high', status: 'open', reporter: 'System', assignee: 'Unassigned', createdAt: '4 hours ago', updatedAt: '4 hours ago', affectedUsers: 0, category: 'Authentication' },
  { id: 'INC-003', title: 'Data Export Anomaly', description: 'Unusual large data export by user account', severity: 'high', status: 'investigating', reporter: 'o.kovalenko@gov.ua', assignee: 'I. Petrenko', createdAt: '1 day ago', updatedAt: '2 hours ago', affectedUsers: 1, category: 'Data Leak' },
  { id: 'INC-004', title: 'Session Hijacking Attempt', description: 'Detected session token reuse from different location', severity: 'critical', status: 'resolved', reporter: 'System', assignee: 'Security Team', createdAt: '2 days ago', updatedAt: '1 day ago', affectedUsers: 3, category: 'Session Security' },
  { id: 'INC-005', title: 'SQL Injection Blocked', description: 'Malicious SQL query detected and blocked', severity: 'medium', status: 'closed', reporter: 'WAF', assignee: 'Auto-resolved', createdAt: '3 days ago', updatedAt: '3 days ago', affectedUsers: 0, category: 'Web Security' },
  { id: 'INC-006', title: 'Suspicious Permission Change', description: 'User elevated own permissions without approval', severity: 'high', status: 'investigating', reporter: 'Audit System', assignee: 'M. Garcia', createdAt: '3 days ago', updatedAt: '1 day ago', affectedUsers: 1, category: 'Access Control' },
  { id: 'INC-007', title: 'DDoS Attack Mitigated', description: 'Distributed denial of service attack from botnet', severity: 'critical', status: 'resolved', reporter: 'Cloudflare', assignee: 'Infrastructure Team', createdAt: '5 days ago', updatedAt: '4 days ago', affectedUsers: 0, category: 'Infrastructure' },
];

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const STATUS_STYLES: Record<Status, string> = {
  open: 'bg-red-500/20 text-red-400',
  investigating: 'bg-yellow-500/20 text-yellow-400',
  resolved: 'bg-green-500/20 text-green-400',
  closed: 'bg-gray-500/20 text-gray-400',
};

const CATEGORIES = ['All', 'API Security', 'Authentication', 'Data Leak', 'Session Security', 'Web Security', 'Access Control', 'Infrastructure'];

export default function BreachesCenter() {
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = INCIDENTS.filter(inc => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (filterCategory !== 'All' && inc.category !== filterCategory) return false;
    return true;
  });

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
            <span className="text-[#00A3FF]">⚠️ Breaches Center</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">7 Open Incidents</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Breaches Center</h1>
              <p className="text-[#8B949E]">Incident management, investigation, and response</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
              <span>🚨</span>
              <span>Report Incident</span>
            </button>
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

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="text-sm text-[#8B949E] block mb-1">Severity</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as Severity | 'all')}
                className="px-3 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg focus:border-[#00A3FF] focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#8B949E] block mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Status | 'all')}
                className="px-3 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg focus:border-[#00A3FF] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[#8B949E] block mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg focus:border-[#00A3FF] focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Incidents List */}
          <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#1F242C]">
              <h3 className="font-semibold">Incidents ({filteredIncidents.length})</h3>
            </div>
            <div className="divide-y divide-[#1F242C]">
              {filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  className="p-4 hover:bg-[#1F242C]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      incident.severity === 'critical' ? 'bg-red-500' :
                      incident.severity === 'high' ? 'bg-orange-500' :
                      incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-[#8B949E]">{incident.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${SEVERITY_STYLES[incident.severity]}`}>
                          {incident.severity}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[incident.status]}`}>
                          {incident.status}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{incident.title}</h4>
                      <p className="text-sm text-[#8B949E]">{incident.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[#8B949E]">
                        <span>📁 {incident.category}</span>
                        <span>👤 {incident.assignee}</span>
                        <span>🕐 {incident.createdAt}</span>
                      </div>
                    </div>
                    <div className="text-[#8B949E]">→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Detail Modal */}
          {selectedIncident && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#161B22] border border-[#1F242C] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6 border-b border-[#1F242C] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#8B949E]">{selectedIncident.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${SEVERITY_STYLES[selectedIncident.severity]}`}>
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <button onClick={() => setSelectedIncident(null)} className="text-[#8B949E] hover:text-white text-xl">✕</button>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{selectedIncident.title}</h2>
                  <p className="text-[#8B949E] mb-6">{selectedIncident.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <div className="text-sm text-[#8B949E] mb-1">Status</div>
                      <span className={`text-sm px-2 py-1 rounded ${STATUS_STYLES[selectedIncident.status]}`}>
                        {selectedIncident.status}
                      </span>
                    </div>
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <div className="text-sm text-[#8B949E] mb-1">Category</div>
                      <div className="font-medium">{selectedIncident.category}</div>
                    </div>
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <div className="text-sm text-[#8B949E] mb-1">Reporter</div>
                      <div className="font-medium">{selectedIncident.reporter}</div>
                    </div>
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <div className="text-sm text-[#8B949E] mb-1">Assignee</div>
                      <div className="font-medium">{selectedIncident.assignee}</div>
                    </div>
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <div className="text-sm text-[#8B949E] mb-1">Created</div>
                      <div className="font-medium">{selectedIncident.createdAt}</div>
                    </div>
                    <div className="p-4 bg-[#0D1117] rounded-lg">
                      <div className="text-sm text-[#8B949E] mb-1">Last Updated</div>
                      <div className="font-medium">{selectedIncident.updatedAt}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-[#00A3FF] text-[#0D1117] font-medium rounded-lg hover:bg-[#33B5FF] transition-colors">
                      Start Investigation
                    </button>
                    <button className="px-4 py-2 bg-green-500/20 text-green-400 font-medium rounded-lg hover:bg-green-500/30 transition-colors">
                      Mark Resolved
                    </button>
                    <button className="px-4 py-2 bg-[#1F242C] text-white font-medium rounded-lg hover:bg-[#2D333B] transition-colors">
                      Assign
                    </button>
                  </div>
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
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-colors flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-medium">Security Center</div>
                <div className="text-sm text-[#8B949E]">Monitor threats</div>
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
          © 2024-2026 IVYAR. All rights reserved. | Breaches Center v1.0
        </div>
      </footer>
    </div>
  );
}