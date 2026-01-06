'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Config, BlockchainData, EarlyWarningData, AIModelsData, AIDecisions, FairnessMetrics, CountriesData } from './data/config';
import { StatCard, RiskMeter, Transaction, AlertCard, ModelCard, ContractCard, AnimatedBackground } from './components/UI';
import Terminal from './components/Terminal';

export default function PrometheusPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveDecisions, setLiveDecisions] = useState(AIDecisions.today);
  const [liveTxCount, setLiveTxCount] = useState(45234567);

  // Live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setLiveDecisions(prev => prev + Math.floor(Math.random() * 3));
      setLiveTxCount(prev => prev + Math.floor(Math.random() * 8));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Calculate totals
  const totals = useMemo(() => CountriesData.reduce((acc, c) => ({
    programs: acc.programs + c.programs,
    budget: acc.budget + c.budget,
    beneficiaries: acc.beneficiaries + c.beneficiaries,
    digitalIds: acc.digitalIds + c.digitalIds
  }), { programs: 0, budget: 0, beneficiaries: 0, digitalIds: 0 }), []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏛️' },
    { id: 'blockchain', label: 'Blockchain', icon: '🔗' },
    { id: 'ai', label: 'AI Governance', icon: '🤖' },
    { id: 'ews', label: 'Early Warning', icon: '🚨' },
    { id: 'network', label: 'Network', icon: '🌐' }
  ];

  return (
    <div className="min-h-screen text-slate-100">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/hbs" className="text-slate-400 hover:text-slate-200 text-sm">
                ← Back to HBS
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-xl">
                🏛️
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  HBS Sovereign Cloud v{Config.version}
                </h1>
                <p className="text-slate-500 text-xs">Codename: {Config.codename} | {Config.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">🔗 {liveTxCount.toLocaleString()}</span>
                <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-400">🤖 {liveDecisions.toLocaleString()}</span>
                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">⚡ {Config.ai.autonomy}%</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-slate-200 font-mono text-xs">
                  {currentTime.toISOString().slice(0, 19).replace('T', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-[57px] z-40 backdrop-blur-xl bg-slate-950/60 border-b border-slate-800/50 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Countries" value={CountriesData.length} icon="🌍" color="blue" trend={4.2} />
              <StatCard label="Programs" value={totals.programs} icon="📋" color="indigo" trend={8.5} />
              <StatCard label="Budget" value={`$${totals.budget.toFixed(1)}B`} icon="💰" color="emerald" trend={12.3} />
              <StatCard label="Beneficiaries" value={`${totals.beneficiaries.toFixed(1)}M`} icon="👥" color="cyan" trend={15.7} />
              <StatCard label="Digital IDs" value={`${totals.digitalIds.toFixed(1)}M`} icon="🆔" color="violet" trend={22.4} pulse />
              <StatCard label="AI Decisions" value={liveDecisions.toLocaleString()} icon="🤖" color="amber" pulse />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/40 backdrop-blur-xl">
                <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">🔗 Blockchain</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Total TX</span><span className="text-cyan-400 font-mono">{Config.blockchain.totalTx}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Smart Contracts</span><span className="text-violet-400 font-mono">{Config.blockchain.contracts}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Digital IDs</span><span className="text-emerald-400 font-mono">{(BlockchainData.identities.verified / 1000000).toFixed(1)}M</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">TPS</span><span className="text-amber-400 font-mono">{Config.blockchain.tps.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-violet-500/30 bg-slate-900/40 backdrop-blur-xl">
                <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">🤖 AI Governance</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Autonomy</span><span className="text-emerald-400 font-mono">{Config.ai.autonomy}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Accuracy</span><span className="text-cyan-400 font-mono">{Config.ai.accuracy}%</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Bias Score</span><span className="text-emerald-400 font-mono">{Config.ai.bias}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Explainability</span><span className="text-violet-400 font-mono">{Config.ai.explainability}%</span></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-amber-500/30 bg-slate-900/40 backdrop-blur-xl">
                <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">🚨 Early Warning</h3>
                <div className="flex justify-around">
                  <RiskMeter value={EarlyWarningData.risk.overall} label="Risk Index" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 text-center text-xs">
                  <div className="p-2 rounded-lg bg-rose-500/10">
                    <span className="text-rose-400 font-bold">{EarlyWarningData.alerts.filter(a => a.severity === 'high').length}</span>
                    <p className="text-slate-500">High</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <span className="text-amber-400 font-bold">{EarlyWarningData.alerts.filter(a => a.severity === 'medium').length}</span>
                    <p className="text-slate-500">Medium</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <Terminal />
          </div>
        )}

        {/* Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total TX" value={Config.blockchain.totalTx} icon="🔗" color="cyan" />
              <StatCard label="Smart Contracts" value={Config.blockchain.contracts} icon="📜" color="violet" />
              <StatCard label="Digital IDs" value={`${(BlockchainData.identities.verified / 1000000).toFixed(1)}M`} icon="🆔" color="emerald" />
              <StatCard label="TPS" value={Config.blockchain.tps.toLocaleString()} icon="⚡" color="amber" />
            </div>

            <div className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl">
              <h3 className="text-slate-200 font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {BlockchainData.transactions.map((tx, i) => <Transaction key={i} tx={tx} />)}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl">
              <h3 className="text-slate-200 font-semibold mb-4">Smart Contracts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {BlockchainData.contracts.map((c, i) => <ContractCard key={i} contract={c} />)}
              </div>
            </div>
          </div>
        )}

        {/* AI Governance Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Autonomy" value={`${Config.ai.autonomy}%`} icon="⚡" color="emerald" />
              <StatCard label="Daily Decisions" value={liveDecisions.toLocaleString()} icon="🤖" color="violet" pulse />
              <StatCard label="Accuracy" value={`${Config.ai.accuracy}%`} icon="🎯" color="cyan" />
              <StatCard label="Bias Score" value={Config.ai.bias} icon="⚖️" color="blue" />
            </div>

            <div className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl">
              <h3 className="text-slate-200 font-semibold mb-4">Production AI Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {AIModelsData.map((m, i) => <ModelCard key={i} model={m} />)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-xl">
                <h3 className="text-slate-200 font-semibold mb-4">🔍 Explainability (XAI)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['SHAP Values', 'LIME', 'Counterfactuals', 'Feature Importance', 'Audit Logs', 'Decision Trees'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-violet-500/30 bg-violet-500/5 backdrop-blur-xl">
                <h3 className="text-slate-200 font-semibold mb-4">⚖️ Fairness Metrics</h3>
                <div className="space-y-3">
                  {Object.entries(FairnessMetrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-emerald-400">{value}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${value * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Early Warning Tab */}
        {activeTab === 'ews' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl">
              <h3 className="text-slate-200 font-semibold mb-4">📊 INFORM Risk Index</h3>
              <div className="flex justify-around flex-wrap gap-4">
                <RiskMeter value={EarlyWarningData.risk.overall} label="Overall" />
                <RiskMeter value={EarlyWarningData.risk.hazard} label="Hazard" />
                <RiskMeter value={EarlyWarningData.risk.vulnerability} label="Vulnerability" />
                <RiskMeter value={EarlyWarningData.risk.coping} label="Coping" />
              </div>
            </div>

            <div>
              <h3 className="text-slate-200 font-semibold mb-4">Active Alerts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {EarlyWarningData.alerts.map((a, i) => <AlertCard key={i} alert={a} />)}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-xl">
              <h3 className="text-slate-200 font-semibold mb-4">📡 Sensor Network</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(EarlyWarningData.sensors).map(([name, data]) => (
                  <div key={name} className="p-4 rounded-xl bg-slate-800/40 text-center">
                    <div className="w-3 h-3 mx-auto rounded-full bg-emerald-500 animate-pulse mb-2" />
                    <p className="text-slate-200 capitalize font-medium">{name}</p>
                    <p className="text-cyan-400 font-mono">{data.count.toLocaleString()}</p>
                    <p className="text-slate-500 text-xs">Latency: {data.latency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Countries" value={CountriesData.length} icon="🌍" color="blue" />
              <StatCard label="Programs" value={totals.programs} icon="📋" color="indigo" />
              <StatCard label="Budget" value={`$${totals.budget.toFixed(1)}B`} icon="💰" color="emerald" />
              <StatCard label="Avg Sync" value="99.7%" icon="🔄" color="cyan" />
            </div>

            <div className="p-5 rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl overflow-x-auto">
              <h3 className="text-slate-200 font-semibold mb-4">Country Network Status</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-left border-b border-slate-700/50">
                    <th className="p-3">Country</th>
                    <th className="p-3 text-center">Programs</th>
                    <th className="p-3 text-center">Budget</th>
                    <th className="p-3 text-center">Beneficiaries</th>
                    <th className="p-3 text-center">Digital IDs</th>
                    <th className="p-3 text-center">Risk</th>
                    <th className="p-3 text-center">Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {CountriesData.map((c, i) => (
                    <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-800/30">
                      <td className="p-3 flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-slate-200">{c.name}</span>
                        <span className="text-slate-500 text-xs">({c.code})</span>
                      </td>
                      <td className="p-3 text-center text-slate-300">{c.programs}</td>
                      <td className="p-3 text-center text-emerald-400">${c.budget}B</td>
                      <td className="p-3 text-center text-cyan-400">{c.beneficiaries}M</td>
                      <td className="p-3 text-center text-violet-400">{c.digitalIds}M</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          c.risk === 'high' ? 'bg-rose-500/20 text-rose-400' :
                          c.risk === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>{c.risk}</span>
                      </td>
                      <td className="p-3 text-center text-emerald-400">{c.sync}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <span>HBS Sovereign Cloud v{Config.version} &quot;{Config.codename}&quot; — Blockchain + AI + EWS</span>
          <span>© 2024-2026 IVYAR. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
