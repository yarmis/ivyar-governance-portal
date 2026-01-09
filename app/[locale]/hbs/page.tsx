// ============================================================================
// HBS MODULE - COMPLETE WITH TYPESCRIPT TYPES
// File: app/[locale]/hbs/page.tsx
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ModuleActions } from '@/components/ModuleActions';

interface SystemStatus {
  operational: boolean;
  uptime: number;
  lastCheck: string;
}

export default function HBSModule() {
  const [status, setStatus] = useState<SystemStatus>({
    operational: true,
    uptime: 99.97,
    lastCheck: new Date().toISOString(),
  });

  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        lastCheck: new Date().toISOString(),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(scanInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] text-gray-100 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-blue-900/10 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Scan Line Effect */}
      <div 
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 pointer-events-none"
        style={{ top: `${scanLine}%`, transition: 'top 0.05s linear' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-900/30 bg-[#0d1117]/95 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-cyan-900/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-mono flex items-center gap-2 group">
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span>IVYAR PORTAL</span>
                </Link>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
                <h1 className="text-2xl font-mono tracking-wider relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
                    HBS MODULE
                  </span>
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />
                </h1>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-500/30">
                  <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${status.operational ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className={`absolute inset-0 w-2 h-2 rounded-full ${status.operational ? 'bg-green-500' : 'bg-red-500'} animate-ping`} />
                  </div>
                  <span className="text-green-400">OPERATIONAL</span>
                </div>
                <div className="text-xs font-mono text-gray-500 bg-slate-900/50 px-3 py-1.5 rounded border border-cyan-900/30">
                  UPTIME: <span className="text-cyan-400 font-bold">{status.uptime}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Title Section with Module Actions */}
          <div className="mb-12 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
            <div className="flex items-start gap-4 ml-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-lg font-mono text-cyan-400 tracking-widest uppercase">
                    Humanitarian Budget Support System
                  </h2>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
                <p className="text-gray-400 font-mono text-sm max-w-3xl leading-relaxed mb-6">
                  Comprehensive tools for ethical governance and transparent humanitarian aid distribution. 
                  Powered by AI-driven decision engines with real-time audit capabilities.
                </p>
                
                {/* MODULE ACTIONS */}
                <ModuleActions
                  moduleName="HBS"
                  moduleUrl="/us/hbs/autopilot"
                  apiUrl="/us/hbs/api-docs"
                  demoUrl="/us/hbs/demo"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatusCard label="STATUS" value="CORE" status="active" icon="●" pulse={true} />
            <StatusCard label="API ENDPOINTS" value="8" status="ready" icon="⬢" pulse={false} />
            <StatusCard label="SECURITY LEVEL" value="MAXIMUM" status="secure" icon="◆" pulse={true} />
            <StatusCard label="CLEARANCE" value="AUTHORIZED" status="granted" icon="▲" pulse={false} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Features */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-cyan-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2 mb-6">
                    <span className="text-cyan-500 animate-pulse">▸</span> CORE CAPABILITIES
                  </h3>
                  
                  <div className="space-y-4">
                    <FeatureItem icon="📊" title="Budget Tracking & Transparency" description="Real-time monitoring of fund allocation and expenditure" metrics="99.9% accuracy" progress={99.9} />
                    <FeatureItem icon="🌍" title="Humanitarian Aid Distribution" description="Coordinated multi-region aid distribution" metrics="24 countries" progress={88} />
                    <FeatureItem icon="⚖️" title="Ethical Governance Frameworks" description="AI-powered decision support with compliance" metrics="ISO 27001" progress={100} />
                    <FeatureItem icon="🤖" title="AI Decision Support (v8)" description="Explainable AI reasoning with bias detection" metrics="90% confidence" progress={90} />
                    <FeatureItem icon="📋" title="Full Audit Trail" description="Immutable transaction logs" metrics="SOC 2 Type II" progress={100} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Mission Control */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-cyan-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-mono text-cyan-400 mb-6 tracking-widest flex items-center gap-2">
                    <span className="text-cyan-500 animate-pulse">▸</span> MISSION CONTROL
                  </h3>
                  
                  <div className="space-y-3">
                    <ActionButton href="/us/hbs/autopilot" label="Autopilot Dashboard" icon="🎯" status="primary" />
                    <ActionButton href="/us/hbs/analytics" label="Analytics Suite" icon="📈" />
                    <ActionButton href="/us/hbs/audit" label="Audit Logs" icon="📋" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-cyan-900/30 pt-6 mt-12">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
              <div>CLASSIFICATION: <span className="text-cyan-400">UNCLASSIFIED</span></div>
              <div>VERSION: <span className="text-cyan-400">8.0.0</span></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// TYPED COMPONENTS
// ============================================================================

function StatusCard({ label, value, status, icon, pulse }: {
  label: string;
  value: string;
  status: 'active' | 'ready' | 'secure' | 'granted';
  icon: string;
  pulse: boolean;
}) {
  const statusColors: Record<'active' | 'ready' | 'secure' | 'granted', string> = {
    active: 'from-emerald-500/20 to-emerald-900/20 border-emerald-500/30 text-emerald-400',
    ready: 'from-cyan-500/20 to-cyan-900/20 border-cyan-500/30 text-cyan-400',
    secure: 'from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400',
    granted: 'from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400',
  };

  return (
    <div className="relative group">
      {pulse && <div className={`absolute -inset-0.5 bg-gradient-to-r ${statusColors[status]} rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000`} />}
      <div className={`relative bg-gradient-to-br ${statusColors[status]} border rounded-lg p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-mono text-gray-400">{label}</span>
          <span className="text-lg">{icon}</span>
        </div>
        <div className={`text-2xl font-mono font-bold ${statusColors[status].split(' ')[2]}`}>{value}</div>
        <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${statusColors[status]} animate-pulse`} style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description, metrics, progress }: {
  icon: string;
  title: string;
  description: string;
  metrics: string;
  progress: number;
}) {
  return (
    <div className="relative flex gap-4 p-4 rounded border border-cyan-900/20 hover:border-cyan-500/30 hover:bg-slate-800/30 transition-all group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-full bg-gradient-to-b from-cyan-500 to-blue-500 rounded transition-all duration-500" />
      <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-mono text-gray-200 mb-1 group-hover:text-cyan-400 transition-colors">{title}</h4>
        <p className="text-xs text-gray-500 mb-2">{description}</p>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-cyan-400">{metrics}</div>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[10px] font-mono text-gray-500">{progress}%</div>
        </div>
      </div>
    </div>
  );
}

<div className="space-y-3">
  <ActionButton href="/us/hbs/autopilot" label="Autopilot Dashboard" icon="🎯" status="primary" />
</div>
