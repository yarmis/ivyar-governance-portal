'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function InfrastructureDemoPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    { id: 1, name: 'Highway Reconstruction', status: 'In Progress', completion: 67, budget: 45000000 },
    { id: 2, name: 'Water Treatment Plant', status: 'Planning', completion: 12, budget: 28000000 },
    { id: 3, name: 'Bridge Repair Program', status: 'In Progress', completion: 89, budget: 15000000 },
    { id: 4, name: 'Rail Network Upgrade', status: 'Completed', completion: 100, budget: 120000000 },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/infrastructure" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Infrastructure Hub
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Infrastructure Demo</h1>
          <p className="text-lg text-[#8B949E]">Interactive project management dashboard</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Active Projects</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">4</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Total Budget</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">$208M</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Avg Completion</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">67%</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">On Schedule</div>
            <div className="text-2xl font-bold text-green-400">3/4</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">Active Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedProject === project.id
                    ? 'border-[#00A3FF] bg-[#00A3FF]/10'
                    : 'border-[#30363D] bg-[#0D1117] hover:border-[#00A3FF]/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-[#E6EDF3]">{project.name}</span>
                  <span className={`rounded px-2 py-1 text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="mb-1 flex justify-between text-sm text-[#8B949E]">
                    <span>Completion</span>
                    <span>{project.completion}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#161B22]">
                    <div 
                      className="h-full bg-[#00A3FF]" 
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-[#8B949E]">
                  Budget: ${(project.budget / 1000000).toFixed(1)}M
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-[#8B949E]">
              <p>This is a demonstration. In production, project managers track real-time progress, budgets, and resource allocation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
