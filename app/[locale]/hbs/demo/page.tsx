'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HbsDemo({ params }: { params: { locale: string } }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 10));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-gray-100 p-8">
      <Link href={`/${params.locale}/hbs`} className="text-cyan-400 mb-4 block">← BACK</Link>
      <h1 className="text-3xl font-mono text-cyan-400 mb-8">HBS Demo Mode</h1>
      
      <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-6 max-w-2xl">
        <h2 className="text-xl text-cyan-400 mb-4">Running Demo...</h2>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-gray-400 mt-4 text-sm">{progress}% Complete</p>
      </div>
    </div>
  );
}
