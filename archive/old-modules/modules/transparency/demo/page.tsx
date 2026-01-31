'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function TransparencyDemoPage() {
  const [activeTab, setActiveTab] = useState('audit');
  
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/modules/transparency" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
          ← Back to Transparency Hub
        </Link>
        <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Transparency Hub Demo</h1>
        <p className="mb-6 text-lg text-[#8B949E]">Interactive demonstration</p>
        
        <div className="mb-6 flex gap-4 border-b border-[#30363D]">
          <button onClick={() => setActiveTab('audit')} className={`pb-2 ${activeTab === 'audit' ? 'border-b-2 border-[#00A3FF] text-[#00A3FF]' : 'text-[#8B949E]'}`}>
            Audit Log
          </button>
          <button onClick={() => setActiveTab('decisions')} className={`pb-2 ${activeTab === 'decisions' ? 'border-b-2 border-[#00A3FF] text-[#00A3FF]' : 'text-[#8B949E]'}`}>
            Decisions
          </button>
        </div>
        
        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          {activeTab === 'audit' && <div className="text-[#E6EDF3]">Audit log demo content</div>}
          {activeTab === 'decisions' && <div className="text-[#E6EDF3]">Decisions demo content</div>}
        </div>
      </div>
    </div>
  );
}
