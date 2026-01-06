'use client';

import { Alert, AIModel, Transaction as TxType, Contract } from '../data/config';

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: string;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo';
  trend?: number;
  pulse?: boolean;
}

export const StatCard = ({ label, value, subValue, icon, color = 'cyan', trend, pulse }: StatCardProps) => {
  const colors = {
    cyan: 'border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-400',
    violet: 'border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-violet-600/10 text-violet-400',
    emerald: 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400',
    amber: 'border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400',
    rose: 'border-rose-500/30 bg-gradient-to-br from-rose-500/20 to-rose-600/10 text-rose-400',
    blue: 'border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400',
    indigo: 'border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 text-indigo-400'
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.02] ${colors[color]}`}>
      {pulse && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current animate-pulse" />}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium tracking-wider uppercase">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && <p className="text-slate-500 text-xs mt-1">{subValue}</p>}
          {trend !== undefined && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}%</span>
            </p>
          )}
        </div>
        <div className="text-2xl opacity-60">{icon}</div>
      </div>
    </div>
  );
};

// Risk Meter Component
interface RiskMeterProps {
  value: number;
  max?: number;
  label: string;
}

export const RiskMeter = ({ value, max = 5, label }: RiskMeterProps) => {
  const percentage = (value / max) * 100;
  const getColor = (v: number) => {
    if (v < 2) return { text: 'text-emerald-400', stroke: '#10b981' };
    if (v < 3.5) return { text: 'text-amber-400', stroke: '#f59e0b' };
    return { text: 'text-rose-400', stroke: '#f43f5e' };
  };
  const colors = getColor(value);

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="#334155" strokeWidth="6" fill="none" />
          <circle
            cx="48" cy="48" r="40"
            stroke={colors.stroke}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${colors.text}`}>{value.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-slate-400 text-xs mt-2">{label}</p>
    </div>
  );
};

// Transaction Component
interface TransactionProps {
  tx: TxType;
}

export const Transaction = ({ tx }: TransactionProps) => {
  const typeColors: Record<string, string> = {
    disbursement: 'text-emerald-400 bg-emerald-500/10',
    beneficiary: 'text-cyan-400 bg-cyan-500/10',
    contract: 'text-violet-400 bg-violet-500/10',
    verification: 'text-blue-400 bg-blue-500/10'
  };

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-500',
    pending: 'bg-amber-500 animate-pulse',
    executed: 'bg-violet-500'
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusColors[tx.status] || 'bg-slate-500'}`} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-mono text-sm">{tx.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[tx.type] || 'text-slate-400 bg-slate-500/10'}`}>{tx.type}</span>
          </div>
          <p className="text-slate-500 text-xs">{tx.from} → {tx.to}</p>
        </div>
      </div>
      <div className="text-right">
        {tx.amount > 0 && <p className="text-emerald-400 font-mono">${tx.amount.toLocaleString()}</p>}
        <p className="text-slate-500 text-xs">{tx.block ? `Block #${tx.block}` : 'Pending...'}</p>
      </div>
    </div>
  );
};

// Alert Card Component
interface AlertCardProps {
  alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const severityColors = {
    high: 'border-rose-500/50 bg-rose-500/10',
    medium: 'border-amber-500/50 bg-amber-500/10',
    low: 'border-emerald-500/50 bg-emerald-500/10'
  };

  const textColors = {
    high: 'text-rose-400',
    medium: 'text-amber-400',
    low: 'text-emerald-400'
  };

  return (
    <div className={`p-4 rounded-xl border ${severityColors[alert.severity]} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{alert.icon}</span>
          <span className={`text-sm font-semibold ${textColors[alert.severity]}`}>{alert.severity.toUpperCase()}</span>
        </div>
        <span className="text-xs text-slate-500">{alert.id}</span>
      </div>
      <h4 className="text-slate-200 font-medium mb-1">{alert.threat}</h4>
      <p className="text-slate-400 text-sm mb-2">{alert.region}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">ETA: {alert.eta}</span>
        <span className="text-cyan-400">Confidence: {alert.confidence}%</span>
      </div>
    </div>
  );
};

// AI Model Card Component
interface ModelCardProps {
  model: AIModel;
}

export const ModelCard = ({ model }: ModelCardProps) => {
  const statusColors = {
    production: 'bg-emerald-500/20 text-emerald-400',
    staging: 'bg-amber-500/20 text-amber-400',
    deprecated: 'bg-slate-500/20 text-slate-400'
  };

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-slate-200 font-medium text-sm">{model.name}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[model.status]}`}>{model.status}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-emerald-400 font-mono text-lg">{model.accuracy}%</p>
          <p className="text-slate-500 text-xs">Accuracy</p>
        </div>
        <div>
          <p className="text-cyan-400 font-mono text-lg">{model.fairness}</p>
          <p className="text-slate-500 text-xs">Fairness</p>
        </div>
        <div>
          <p className={`font-mono text-lg ${model.drift < 0.02 ? 'text-emerald-400' : 'text-amber-400'}`}>{model.drift}</p>
          <p className="text-slate-500 text-xs">Drift</p>
        </div>
      </div>
      <p className="text-slate-500 text-xs mt-3">Last retrain: {model.lastRetrain}</p>
    </div>
  );
};

// Smart Contract Card Component
interface ContractCardProps {
  contract: Contract;
}

export const ContractCard = ({ contract }: ContractCardProps) => {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500',
    armed: 'bg-amber-500 animate-pulse',
    paused: 'bg-slate-500'
  };

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[contract.status] || 'bg-slate-500'}`} />
          <h4 className="text-slate-200 font-medium text-sm">{contract.name}</h4>
        </div>
      </div>
      <p className="text-slate-500 text-xs mb-2">Trigger: {contract.trigger}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-cyan-400">{contract.executions.toLocaleString()} executions</span>
        <span className={`px-2 py-0.5 rounded-full ${contract.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {contract.status}
        </span>
      </div>
    </div>
  );
};

// Animated Background Component
export const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
    <div className="absolute inset-0">
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
    </div>
  </div>
);
