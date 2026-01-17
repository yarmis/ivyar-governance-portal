'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EmergencyDemoPage() {
  const [activeIncident, setActiveIncident] = useState<number | null>(null);

  const incidents = [
    { id: 1, type: 'Hurricane', name: 'Hurricane Delta', severity: 'High', affected: 125000, status: 'Active' },
    { id: 2, type: 'Wildfire', name: 'Canyon Fire', severity: 'Critical', affected: 45000, status: 'Active' },
    { id: 3, type: 'Flood', name: 'River Valley Flooding', severity: 'Medium', affected: 23000, status: 'Monitoring' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/emergency" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Emergency Response
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Emergency Response Demo</h1>
          <p className="text-lg text-[#8B949E]">Real-time disaster coordination dashboard</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Active Incidents</div>
            <div className="text-2xl font-bold text-red-400">3</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">People Affected</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">193K</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Responders</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">2,456</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Shelters Open</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">47</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">Active Incidents</h2>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => setActiveIncident(incident.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  activeIncident === incident.id
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-[#30363D] bg-[#0D1117] hover:border-red-500/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${
                      incident.severity === 'Critical' ? 'bg-red-500 animate-pulse' :
                      incident.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <span className="font-semibold text-[#E6EDF3]">{incident.name}</span>
                  </div>
                  <span className="rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
                    {incident.status}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-[#8B949E]">
                  <span>Type: {incident.type}</span>
                  <span>Affected: {incident.affected.toLocaleString()}</span>
                  <span>Severity: {incident.severity}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-[#8B949E]">
              <p>This is a demonstration. In production, emergency managers coordinate real-time response across multiple agencies using live data feeds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
