'use client';

import Link from 'next/link';

export default function HbsApiDocs() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-gray-100 p-8">
      <Link href="/us/hbs" className="text-cyan-400 mb-4 block hover:text-cyan-300">
        ← BACK TO MODULE
      </Link>
      
      <h1 className="text-3xl font-mono text-cyan-400 mb-8">HBS API Documentation</h1>
      
      <div className="space-y-6">
        <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded text-xs font-bold border border-green-500/30">GET</span>
            <span className="text-cyan-400 font-mono">/api/hbs/autopilot/status</span>
          </div>
          <p className="text-gray-400 text-sm">Get system status and metrics</p>
        </div>

        <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold border border-blue-500/30">POST</span>
            <span className="text-cyan-400 font-mono">/api/hbs/autopilot/decide</span>
          </div>
          <p className="text-gray-400 text-sm">Make a decision using v12</p>
        </div>

        <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold border border-blue-500/30">POST</span>
            <span className="text-cyan-400 font-mono">/api/hbs/autopilot/compare</span>
          </div>
          <p className="text-gray-400 text-sm">Compare v12 decision versions</p>
        </div>

        <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold border border-blue-500/30">POST</span>
            <span className="text-cyan-400 font-mono">/api/hbs/autopilot/flags/enable</span>
          </div>
          <p className="text-gray-400 text-sm">Enable v12 with percentage rollout</p>
        </div>

        <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-6">
          <div className="flex gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold border border-blue-500/30">POST</span>
            <span className="text-cyan-400 font-mono">/api/hbs/autopilot/flags/disable</span>
          </div>
          <p className="text-gray-400 text-sm">Disable v12 feature flags</p>
        </div>
      </div>
    </div>
  );
}
