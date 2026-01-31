'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function KnowledgeDemoPage() {
  const [search, setSearch] = useState('');
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/modules/knowledge" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">← Back</Link>
        <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Knowledge Base Demo</h1>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="mb-4 w-full rounded-lg border border-[#30363D] bg-[#0D1117] px-4 py-3 text-[#E6EDF3]" />
        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6"><p className="text-[#E6EDF3]">Sample Articles</p></div>
      </div>
    </div>
  );
}
