'use client';

import { useState } from 'react';
import { Config, BlockchainData, EarlyWarningData, CountriesData, AIModelsData } from '../data/config';

interface HistoryItem {
  type: 'system' | 'user' | 'response';
  text: string;
  time: Date;
}

const Terminal = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'system', text: `HBS Sovereign Engine v${Config.version} "${Config.codename}" initialized`, time: new Date() },
    { type: 'system', text: 'Blockchain: Connected | AI: 4 models active | EWS: Armed', time: new Date() },
    { type: 'system', text: 'Type "help" for available commands', time: new Date() }
  ]);

  const processCommand = () => {
    if (!command.trim()) return;

    const cmd = command.toLowerCase().trim();
    setHistory(prev => [...prev, { type: 'user', text: command, time: new Date() }]);

    let response = '';

    // Command handlers
    if (cmd === 'help') {
      response = `Available commands:
  status     - System overview
  blockchain - Blockchain statistics  
  ai         - AI governance metrics
  risk       - INFORM Risk Index
  countries  - Country network status
  alerts     - Active early warnings
  models     - AI model performance
  standards  - Compliance status
  clear      - Clear terminal
  version    - Platform version`;
    } 
    else if (cmd === 'status') {
      const totals = CountriesData.reduce((a, c) => ({
        programs: a.programs + c.programs,
        budget: a.budget + c.budget,
        beneficiaries: a.beneficiaries + c.beneficiaries
      }), { programs: 0, budget: 0, beneficiaries: 0 });
      
      response = `✅ SYSTEM STATUS: All systems operational
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Countries: ${CountriesData.length} connected
📋 Programs: ${totals.programs} active
💰 Budget: $${totals.budget.toFixed(1)}B managed
👥 Beneficiaries: ${totals.beneficiaries.toFixed(1)}M tracked
🔗 Blockchain TX: ${Config.blockchain.totalTx}
🤖 AI Decisions: ${Config.ai.decisions.toLocaleString()}/day
⚡ Autonomy: ${Config.ai.autonomy}%`;
    }
    else if (cmd === 'blockchain') {
      response = `🔗 BLOCKCHAIN STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network: ${Config.blockchain.network}
Total TX: ${Config.blockchain.totalTx}
Smart Contracts: ${Config.blockchain.contracts}
TPS: ${Config.blockchain.tps.toLocaleString()}
Digital IDs: ${(BlockchainData.identities.verified / 1000000).toFixed(1)}M verified
Biometric: ${(BlockchainData.identities.biometric / 1000000).toFixed(1)}M enabled`;
    }
    else if (cmd === 'ai') {
      response = `🤖 AI GOVERNANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Autonomy Rate: ${Config.ai.autonomy}%
Daily Decisions: ${Config.ai.decisions.toLocaleString()}
Model Accuracy: ${Config.ai.accuracy}%
Bias Score: ${Config.ai.bias} (excellent)
Explainability: ${Config.ai.explainability}%
Models Active: ${AIModelsData.filter(m => m.status === 'production').length}`;
    }
    else if (cmd === 'risk') {
      const risk = EarlyWarningData.risk;
      response = `🚨 INFORM RISK INDEX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Risk: ${risk.overall}/5.0 (${risk.trend})
├─ Hazard: ${risk.hazard}/5.0
├─ Vulnerability: ${risk.vulnerability}/5.0
└─ Coping Capacity: ${risk.coping}/5.0
Active Alerts: ${EarlyWarningData.alerts.length}
├─ High: ${EarlyWarningData.alerts.filter(a => a.severity === 'high').length}
├─ Medium: ${EarlyWarningData.alerts.filter(a => a.severity === 'medium').length}
└─ Low: ${EarlyWarningData.alerts.filter(a => a.severity === 'low').length}`;
    }
    else if (cmd === 'countries') {
      response = `🌍 COUNTRY NETWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${CountriesData.map(c => 
  `${c.flag} ${c.name.padEnd(12)} | ${c.programs.toString().padStart(2)} prog | $${c.budget}B | ${c.sync}% sync`
).join('\n')}`;
    }
    else if (cmd === 'alerts') {
      response = `🚨 ACTIVE ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${EarlyWarningData.alerts.map(a => 
  `${a.icon} [${a.severity.toUpperCase().padEnd(6)}] ${a.threat}
   Region: ${a.region} | Confidence: ${a.confidence}% | ETA: ${a.eta}`
).join('\n\n')}`;
    }
    else if (cmd === 'models') {
      response = `🧠 AI MODELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${AIModelsData.map(m => 
  `${m.status === 'production' ? '✅' : '🔄'} ${m.name}
   Accuracy: ${m.accuracy}% | Fairness: ${m.fairness} | Drift: ${m.drift}`
).join('\n\n')}`;
    }
    else if (cmd === 'standards') {
      response = `📋 COMPLIANCE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ IATI ${Config.standards.IATI.version}: ${Config.standards.IATI.compliance}%
✅ HXL ${Config.standards.HXL.version}: ${Config.standards.HXL.compliance}%
✅ OpenAPI ${Config.standards.OpenAPI.version}: ${Config.standards.OpenAPI.compliance}%
✅ GDPR: ${Config.standards.GDPR.status}
✅ ISO 27001: ${Config.standards.ISO27001.status}`;
    }
    else if (cmd === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    }
    else if (cmd === 'version') {
      response = `HBS Sovereign Cloud v${Config.version} "${Config.codename}"
© 2024-2026 IVYAR. All rights reserved.`;
    }
    else {
      response = `❌ Unknown command: "${command}"
Type "help" for available commands`;
    }

    setTimeout(() => {
      setHistory(prev => [...prev, { type: 'response', text: response, time: new Date() }]);
    }, 100);

    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden">
      {/* Terminal Header */}
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer" />
          </div>
          <span className="text-slate-400 text-xs font-mono">hbs-prometheus ~ terminal</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Connected</span>
          <span className="text-slate-500">v{Config.version}</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-2">
        {history.map((item, i) => (
          <div key={i} className={`${
            item.type === 'user' ? 'text-cyan-400' : 
            item.type === 'response' ? 'text-emerald-400' : 
            'text-slate-500'
          }`}>
            {item.type === 'user' && <span className="text-slate-500">$ </span>}
            {item.type === 'response' ? (
              <pre className="whitespace-pre-wrap">{item.text}</pre>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="p-3 border-t border-slate-700/50 flex gap-3">
        <span className="text-cyan-400 font-mono">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none font-mono text-sm"
          autoFocus
        />
        <button
          onClick={processCommand}
          className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Run
        </button>
      </div>
    </div>
  );
};

export default Terminal;
