'use client';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href=".." className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">← Back</Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Interactive Demo</h1>
        </div>
        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <p className="text-[#8B949E]">Interactive demonstration of module capabilities.</p>
        </div>
      </div>
    </div>
  );
}
