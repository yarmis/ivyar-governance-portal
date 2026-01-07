'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROLES, RoleCode } from '@/lib/auth/roles';

const STATS = [
  { label: 'Total Users', value: '2,847', change: '+12%', icon: '👥' },
  { label: 'Active Roles', value: '12', change: '0', icon: '🎭' },
  { label: 'Permissions', value: '48', change: '+3', icon: '🔐' },
  { label: 'Restricted', value: '23', change: '-5', icon: '🚫' },
];

const USERS = [
  { id: '1', name: 'Olena Kovalenko', email: 'o.kovalenko@gov.ua', role: 'super_admin' as RoleCode, status: 'active', lastLogin: '2 min ago' },
  { id: '2', name: 'John Smith', email: 'j.smith@company.com', role: 'business' as RoleCode, status: 'active', lastLogin: '1 hour ago' },
  { id: '3', name: 'Maria Garcia', email: 'm.garcia@legal.com', role: 'attorney' as RoleCode, status: 'active', lastLogin: '3 hours ago' },
  { id: '4', name: 'Ahmed Hassan', email: 'a.hassan@org.com', role: 'employer' as RoleCode, status: 'pending', lastLogin: 'Never' },
  { id: '5', name: 'Sarah Johnson', email: 's.johnson@usaid.gov', role: 'donor' as RoleCode, status: 'active', lastLogin: '1 day ago' },
  { id: '6', name: 'Ivan Petrenko', email: 'i.petrenko@audit.com', role: 'auditor' as RoleCode, status: 'active', lastLogin: '2 days ago' },
  { id: '7', name: 'Test User', email: 'test@test.com', role: 'citizen' as RoleCode, status: 'suspended', lastLogin: '1 week ago' },
];

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  security_admin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  breaches_admin: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  pilot_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  government: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  donor: 'bg-green-500/20 text-green-400 border-green-500/30',
  auditor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  attorney: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  employer: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  business: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  citizen: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  public: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  suspended: 'bg-red-500/20 text-red-400',
  blocked: 'bg-gray-500/20 text-gray-400',
};

export default function AccessControlCenter() {
  const [selectedRole, setSelectedRole] = useState<RoleCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const roles = Object.values(ROLES);
  const filteredUsers = USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="text-[#00A3FF]">Access Control Center</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">● System Online</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Access Control Center</h1>
            <p className="text-[#8B949E]">Manage roles, permissions, and user access across the platform</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-5 bg-[#161B22] border border-[#1F242C] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : stat.change.startsWith('-') ? 'bg-red-500/20 text-red-400' : 'bg-[#1F242C] text-[#8B949E]'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-[#8B949E]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Roles Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Roles ({roles.length})</h2>
              <button className="px-4 py-2 bg-[#00A3FF] text-[#0D1117] font-medium rounded-lg hover:bg-[#33B5FF] transition-colors">
                + Create Role
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {roles.map((role) => (
                <button
                  key={role.code}
                  onClick={() => setSelectedRole(selectedRole === role.code ? null : role.code)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedRole === role.code
                      ? 'bg-[#00A3FF]/10 border-[#00A3FF]'
                      : 'bg-[#161B22] border-[#1F242C] hover:border-[#3D444D]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${ROLE_COLORS[role.code]}`}>
                      Lvl {role.level}
                    </span>
                    <span className="text-[#8B949E] text-xs">{role.permissions.length} perms</span>
                  </div>
                  <h3 className="font-semibold mb-1">{role.name}</h3>
                  <p className="text-xs text-[#8B949E]">{role.nameUk}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Role Details */}
          {selectedRole && (
            <div className="mb-8 p-6 bg-[#161B22] border border-[#00A3FF] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{ROLES[selectedRole].name} — Permissions</h3>
                <button onClick={() => setSelectedRole(null)} className="text-[#8B949E] hover:text-white">✕</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ROLES[selectedRole].permissions.map((perm) => (
                  <span key={perm} className="px-3 py-1 bg-[#1F242C] rounded-lg text-sm">
                    {perm}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#1F242C]">
                <p className="text-sm text-[#8B949E]">
                  <strong>Routes:</strong> {ROLES[selectedRole].routes.join(', ')}
                </p>
                <p className="text-sm text-[#8B949E] mt-1">
                  <strong>Can Create:</strong> {ROLES[selectedRole].canCreate.join(', ') || 'None'}
                </p>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Users</h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm focus:border-[#00A3FF] focus:outline-none"
                />
                <button className="px-4 py-2 bg-[#1F242C] text-white font-medium rounded-lg hover:bg-[#2D333B] transition-colors">
                  + Add User
                </button>
              </div>
            </div>
            <div className="bg-[#161B22] border border-[#1F242C] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1F242C]">
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#8B949E]">Last Login</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-[#8B949E]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#1F242C] last:border-0 hover:bg-[#1F242C]/50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-[#8B949E]">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs border ${ROLE_COLORS[user.role]}`}>
                          {ROLES[user.role].name}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[user.status]}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#8B949E]">{user.lastLogin}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-[#1F242C] rounded-lg transition-colors" title="Edit">
                            ✏️
                          </button>
                          <button className="p-2 hover:bg-[#1F242C] rounded-lg transition-colors" title="Permissions">
                            🔐
                          </button>
                          <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors" title="Suspend">
                            🚫
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/security" className="p-4 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00A3FF] transition-colors flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-medium">Security Center</div>
                <div className="text-sm text-[#8B949E]">Monitor threats & access</div>
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
          © 2024-2026 IVYAR. All rights reserved. | Access Control Center v1.0
        </div>
      </footer>
    </div>
  );
}