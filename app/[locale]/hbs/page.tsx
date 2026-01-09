// ============================================================================
// HBS MODULE - COMPLETE WITH MODULE ACTIONS
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
                
                {/* MODULE ACTIONS - NAVIGATION BUTTONS */}
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
            {/* Left Column - Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Features */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-cyan-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-mono text-cyan-400 tracking-widest flex items-center gap-2">
                      <span className="text-cyan-500 animate-pulse">▸</span> CORE CAPABILITIES
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <FeatureItem icon="📊" title="Budget Tracking & Transparency" description="Real-time monitoring of fund allocation and expenditure with complete audit trail" metrics="99.9% accuracy" progress={99.9} />
                    <FeatureItem icon="🌍" title="Humanitarian Aid Distribution" description="Coordinated multi-region aid distribution with supply chain optimization" metrics="24 countries" progress={88} />
                    <FeatureItem icon="⚖️" title="Ethical Governance Frameworks" description="AI-powered decision support with built-in compliance and ethics validation" metrics="ISO 27001" progress={100} />
                    <FeatureItem icon="🤖" title="AI Decision Support (v8)" description="Explainable AI reasoning with automatic bias detection and fairness validation" metrics="90% confidence" progress={90} />
                    <FeatureItem icon="📋" title="Full Audit Trail" description="Immutable transaction logs with cryptographic verification" metrics="SOC 2 Type II" progress={100} />
                  </div>
                </div>
              </div>

              {/* API Endpoints Terminal Style */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-purple-900/30 rounded-lg overflow-hidden backdrop-blur-sm">
                  {/* Terminal Header */}
                  <div className="bg-slate-950/50 px-4 py-2 border-b border-purple-900/30 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-gray-500 ml-2">api_endpoints.log</span>
                  </div>
                  
                  {/* Terminal Content */}
                  <div className="p-6">
                    <h3 className="text-xs font-mono text-purple-400 mb-6 tracking-widest flex items-center gap-2">
                      <span className="text-purple-500">▸</span> API ENDPOINTS
                    </h3>
                    
                    <div className="space-y-2 font-mono text-xs">
                      <ApiEndpoint method="POST" path="/api/hbs/autopilot/decide" status="live" latency="142ms" />
                      <ApiEndpoint method="POST" path="/api/hbs/autopilot/compare" status="live" latency="98ms" />
                      <ApiEndpoint method="GET" path="/api/hbs/autopilot/status" status="live" latency="23ms" />
                      <ApiEndpoint method="POST" path="/api/hbs/autopilot/flags/enable" status="live" latency="67ms" />
                      <ApiEndpoint method="POST" path="/api/hbs/autopilot/flags/disable" status="live" latency="54ms" />
                      <ApiEndpoint method="GET" path="/api/hbs/analytics" status="live" latency="189ms" />
                      <ApiEndpoint method="POST" path="/api/hbs/audit/log" status="live" latency="45ms" />
                      <ApiEndpoint method="GET" path="/api/hbs/governance/report" status="live" latency="234ms" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Activity Feed */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-emerald-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-mono text-emerald-400 mb-6 tracking-widest flex items-center gap-2">
                    <span className="text-emerald-500 animate-pulse">▸</span> REAL-TIME ACTIVITY
                  </h3>
                  
                  <div className="space-y-3">
                    <ActivityItem time="00:23" action="Decision approved" user="AI-v8" type="success" />
                    <ActivityItem time="00:21" action="Audit log created" user="SYSTEM" type="info" />
                    <ActivityItem time="00:19" action="Budget allocation updated" user="Admin" type="warning" />
                    <ActivityItem time="00:17" action="Compliance check passed" user="AI-v8" type="success" />
                    <ActivityItem time="00:15" action="New request queued" user="API" type="info" />
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
                    <ActionButton href="/us/hbs/governance" label="Governance Reports" icon="⚖️" />
                  </div>
                </div>
              </div>

              {/* System Metrics */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-blue-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-mono text-blue-400 mb-6 tracking-widest flex items-center gap-2">
                    <span className="text-blue-500 animate-pulse">▸</span> SYSTEM METRICS
                  </h3>
                  
                  <div className="space-y-4">
                    <Metric label="Response Time" value="142ms" trend="down" percentage={75} color="emerald" />
                    <Metric label="Success Rate" value="99.7%" trend="stable" percentage={99.7} color="cyan" />
                    <Metric label="Active Sessions" value="847" trend="up" percentage={84} color="blue" />
                    <Metric label="Data Processed" value="2.4TB" trend="up" percentage={92} color="purple" />
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-mono text-emerald-400 mb-4 tracking-widest flex items-center gap-2">
                    <span className="text-emerald-500">◆</span> SECURITY STATUS
                  </h3>
                  
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                    <div className="absolute inset-2 rounded-full border-2 border-emerald-500/30" />
                    <div className="absolute inset-4 rounded-full border-2 border-emerald-500/40" />
                    <div className="absolute inset-6 rounded-full border-2 border-emerald-500/50" />
                    <div className="absolute inset-8 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl">🛡️</div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent origin-left animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  
                  <div className="space-y-3 text-xs font-mono">
                    <SecurityItem label="Encryption" status="AES-256" level="high" />
                    <SecurityItem label="Auth Protocol" status="OAuth 2.0" level="high" />
                    <SecurityItem label="Last Audit" status="2026-01-08" level="medium" />
                    <SecurityItem label="Threat Level" status="MINIMAL" level="low" />
                  </div>
                </div>
              </div>

              {/* Global Network Map */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 border border-violet-900/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-mono text-violet-400 mb-4 tracking-widest flex items-center gap-2">
                    <span className="text-violet-500 animate-pulse">▸</span> GLOBAL REACH
                  </h3>
                  
                  <div className="relative h-32 bg-slate-950/50 rounded border border-violet-900/20 overflow-hidden">
                    <svg className="w-full h-full opacity-40" viewBox="0 0 200 100">
                      <line x1="50" y1="30" x2="150" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-violet-500" strokeDasharray="2,2">
                        <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="1s" repeatCount="indefinite" />
                      </line>
                      <line x1="80" y1="50" x2="120" y2="40" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" strokeDasharray="2,2">
                        <animate attributeName="stroke-dashoffset" from="0" to="-4" dur="0.8s" repeatCount="indefinite" />
                      </line>
                      
                      <circle cx="50" cy="30" r="2" fill="currentColor" className="text-violet-500">
                        <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="80" cy="50" r="2" fill="currentColor" className="text-cyan-500">
                        <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="120" cy="40" r="2" fill="currentColor" className="text-blue-500">
                        <animate attributeName="r" values="2;3;2" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="150" cy="70" r="2" fill="currentColor" className="text-purple-500">
                        <animate attributeName="r" values="2;3;2" dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-violet-400">
                      24 ACTIVE REGIONS
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span className="text-gray-400">Americas: 8</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span className="text-gray-400">Europe: 6</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-gray-400">Asia: 7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="text-gray-400">Africa: 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-cyan-900/30 pt-6 mt-12">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <span>CLASSIFICATION:</span>
                <span className="text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/30">UNCLASSIFIED</span>
              </div>
              <div className="flex items-center gap-2">
                <span>LAST UPDATED:</span>
                <span className="text-cyan-400">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>VERSION:</span>
                <span className="text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/30">8.0.0</span>
              </div>
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

// Components
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

function FeatureItem({ icon, title, description, metrics, progress }: any) {
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

function ApiEndpoint({ method, path, status, latency }: {
  method: 'GET' | 'POST';
  path: string;
  status: string;
  latency: string;
}) {
  const methodColors: Record<'GET' | 'POST', string> = {
    GET: 'text-green-400 bg-green-500/10 border-green-500/30',
    POST: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/30 transition-colors group">
      <span className={`px-2 py-1 rounded text-[10px] font-bold border ${methodColors[method]}`}>{method}</span>
      <span className="text-gray-400 group-hover:text-cyan-400 transition-colors flex-1 font-mono">{path}</span>
      <span className="text-[10px] text-gray-500">{latency}</span>
      <div className="relative w-2 h-2">
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
      </div>
    </div>
  );
}

function ActionButton({ href, label, icon, status = 'default' }: any) {
  const isPrimary = status === 'primary';
  return (
    <Link href={href} className={`relative block p-4 rounded border overflow-hidden ${isPrimary ? 'border-cyan-500/50 bg-gradient-to-r from-cyan-900/30 to-blue-900/30' : 'border-cyan-900/30 bg-slate-800/20'} transition-all group`}>
      {isPrimary && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}
      <div className="relative flex items-center gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <div className="flex-1">
          <div className={`text-sm font-mono ${isPrimary ? 'text-cyan-300' : 'text-gray-300'} group-hover:text-cyan-400 transition-colors`}>{label}</div>
        </div>
        <span className="text-cyan-500 text-xs group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

function Metric({ label, value, trend, percentage, color }: any) {
  const trendIcons = { up: '↗', down: '↘', stable: '→' };
  const trendColors = { up: 'text-green-400', down: 'text-red-400', stable: 'text-gray-400' };
  const barColors = { emerald: 'from-emerald-500 to-emerald-700', cyan: 'from-cyan-500 to-cyan-700', blue: 'from-blue-500 to-blue-700', purple: 'from-purple-500 to-purple-700' };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-cyan-400">{value}</span>
          <span className={`text-xs ${trendColors[trend]}`}>{trendIcons[trend]}</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${barColors[color]} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function SecurityItem({ label, status, level }: any) {
  const levelColors = { high: 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30', medium: 'text-yellow-400 bg-yellow-950/30 border-yellow-500/30', low: 'text-blue-400 bg-blue-950/30 border-blue-500/30' };

  return (
    <div className="flex items-center justify-between p-2 rounded bg-emerald-950/20 border border-emerald-900/20 hover:border-emerald-500/30 transition-colors">
      <span className="text-gray-400">{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded border ${levelColors[level]}`}>{status}</span>
    </div>
  );
}

function ActivityItem({ time, action, user, type }: any) {
  const typeColors = { success: 'text-green-400 border-green-500/30', warning: 'text-yellow-400 border-yellow-500/30', info: 'text-cyan-400 border-cyan-500/30' };

  return (
    <div className="flex items-center gap-3 p-2 rounded bg-slate-950/30 border border-slate-800 hover:border-cyan-500/30 transition-colors group">
      <div className={`text-[10px] font-mono ${typeColors[type]}`}>{time}</div>
      <div className="flex-1 text-xs text-gray-300 group-hover:text-cyan-400 transition-colors">{action}</div>
      <div className="text-[10px] font-mono text-gray-500">{user}</div>
      <div className={`w-1.5 h-1.5 rounded-full ${typeColors[type].split(' ')[0].replace('text-', 'bg-')}`} />
    </div>
  );
}
