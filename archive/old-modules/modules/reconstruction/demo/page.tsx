'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ReconstructionDemoPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const projects = [
    { id: 1, name: 'Hospital Rebuild', progress: 45, funding: 8500000 },
    { id: 2, name: 'School Restoration', progress: 78, funding: 2300000 },
    { id: 3, name: 'Bridge Repair', progress: 92, funding: 5600000 },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/reconstruction" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">← Back</Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Reconstruction Demo</h1>
        </div>
        <div className="space-y-3">
          {projects.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)} className={`w-full rounded-lg border p-4 text-left ${selected === p.id ? 'border-[#00A3FF] bg-[#00A3FF]/10' : 'border-[#30363D] bg-[#161B22]'}`}>
              <div className="font-semibold text-[#E6EDF3]">{p.name}</div>
              <div className="text-sm text-[#8B949E]">Progress: {p.progress}% • ${(p.funding/1000000).toFixed(1)}M</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
