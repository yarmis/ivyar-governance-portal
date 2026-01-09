'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ModuleActionsProps {
  moduleName?: string;
  moduleUrl?: string;
  apiUrl?: string;
  demoUrl?: string;
}

export function ModuleActions({ 
  moduleName = 'HBS',
  moduleUrl = '/us/hbs/autopilot',
  apiUrl = '/us/hbs/api-docs',
  demoUrl = '/us/hbs/demo'
}: ModuleActionsProps) {
  const [demoRunning, setDemoRunning] = useState(false);

  const handleRunDemo = async () => {
    setDemoRunning(true);
    try {
      await fetch('/api/hbs/demo', { method: 'POST' });
      window.location.href = demoUrl;
    } catch (error) {
      console.error('Demo start failed:', error);
      window.location.href = demoUrl;
    } finally {
      setDemoRunning(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <Link href={moduleUrl} className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-mono text-sm font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-white/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <span className="relative flex items-center gap-2">
          🎯 OPEN MODULE
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </Link>

      <Link href={apiUrl} className="group px-6 py-3 border-2 border-cyan-500/50 bg-slate-900/50 text-cyan-400 rounded-lg font-mono text-sm font-bold hover:bg-cyan-950/50 hover:border-cyan-400 transition-all backdrop-blur-sm">
        <span className="flex items-center gap-2">
          📋 VIEW API
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </Link>

      <button onClick={handleRunDemo} disabled={demoRunning} className="group px-6 py-3 border-2 border-purple-500/50 bg-slate-900/50 text-purple-400 rounded-lg font-mono text-sm font-bold hover:bg-purple-950/50 hover:border-purple-400 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed">
        <span className="flex items-center gap-2">
          {demoRunning ? (
            <>
              <span className="animate-spin">⚙️</span> STARTING...
            </>
          ) : (
            <>
              🚀 RUN DEMO
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}