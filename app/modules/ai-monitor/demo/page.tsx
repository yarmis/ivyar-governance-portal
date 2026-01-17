'use client';
import Link from 'next/link';

export default function AIMonitorDemoPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/modules/ai-monitor" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">← Back</Link>
        <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">AI Monitor Demo</h1>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4"><div className="text-sm text-[#8B949E]">Decisions</div><div className="text-2xl font-bold text-[#E6EDF3]">1,247</div></div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4"><div className="text-sm text-[#8B949E]">Accuracy</div><div className="text-2xl font-bold text-[#E6EDF3]">94%</div></div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4"><div className="text-sm text-[#8B949E]">Override</div><div className="text-2xl font-bold text-[#E6EDF3]">3.8%</div></div>
        </div>
      </div>
    </div>
  );
}
