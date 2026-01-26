'use client';

import { X, TrendingUp, Activity, Clock, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AutopilotModuleDefinition } from '@/data/autopilot-modules';
import { formatNumber, formatPercent } from '@/lib/utils/helpers';

interface AutopilotModuleModalProps {
  module: AutopilotModuleDefinition;
  onClose: () => void;
}

export function AutopilotModuleModal({ module, onClose }: AutopilotModuleModalProps) {
  const Icon = (Icons[module.icon as keyof typeof Icons] || Icons.Cpu) as LucideIcon;

  // Mock historical data for charts
  const historicalAccuracy = [92.1, 93.4, 94.2, 94.8, 95.1, 95.4, module.accuracy];
  const dailyDecisions = [234, 267, 289, 312, 298, 334, module.decisionsToday];

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-bg-obsidian border border-accent-cyan/40 rounded-card max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-glow-strong animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg-obsidian/95 backdrop-blur-md border-b border-border-subtle p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40">
                <Icon className="w-8 h-8 text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-heading-l text-text-primary mb-1">{module.name}</h2>
                <p className="text-body-m text-text-secondary">{module.category}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-text-secondary hover:text-text-primary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-heading-s text-text-primary mb-2">Overview</h3>
            <p className="text-body-m text-text-secondary leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBox
              icon={<TrendingUp className="w-5 h-5" />}
              label="Accuracy"
              value={formatPercent(module.accuracy)}
              color="text-green-400"
            />
            <MetricBox
              icon={<Activity className="w-5 h-5" />}
              label="Decisions Today"
              value={formatNumber(module.decisionsToday)}
              color="text-accent-cyan"
            />
            <MetricBox
              icon={<Clock className="w-5 h-5" />}
              label="Avg Response"
              value="127ms"
              color="text-yellow-400"
            />
            <MetricBox
              icon={<CheckCircle className="w-5 h-5" />}
              label="Success Rate"
              value="98.2%"
              color="text-green-400"
            />
          </div>

          {/* Accuracy Trend */}
          <div>
            <h3 className="text-heading-s text-text-primary mb-4">Accuracy Trend (Last 7 Days)</h3>
            <div className="bg-bg-surface border border-border-subtle rounded-card p-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {historicalAccuracy.map((acc, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-bg-obsidian rounded-t-lg relative overflow-hidden group">
                      <div 
                        className="w-full bg-gradient-to-t from-accent-cyan to-accent-teal transition-all duration-500 group-hover:opacity-80"
                        style={{ height: `${(acc / 100) * 128}px` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">{acc}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decision Volume */}
          <div>
            <h3 className="text-heading-s text-text-primary mb-4">Decision Volume (Last 7 Days)</h3>
            <div className="bg-bg-surface border border-border-subtle rounded-card p-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {dailyDecisions.map((count, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-bg-obsidian rounded-t-lg relative overflow-hidden group">
                      <div 
                        className="w-full bg-gradient-to-t from-green-500/50 to-green-400/50 transition-all duration-500 group-hover:opacity-80"
                        style={{ height: `${(count / Math.max(...dailyDecisions)) * 128}px` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">{formatNumber(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h3 className="text-heading-s text-text-primary mb-4">Capabilities</h3>
            <div className="grid gap-3">
              {module.capabilities.map((capability, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-3 bg-bg-surface border border-border-subtle rounded-lg p-4 hover:border-accent-cyan/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-body-m text-text-primary">{capability}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Decisions Sample */}
          <div>
            <h3 className="text-heading-s text-text-primary mb-4">Recent Decisions</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="bg-bg-surface border border-border-subtle rounded-lg p-4 hover:border-accent-cyan/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body-s text-accent-cyan font-medium">
                      DEC-{Date.now() + i}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {i * 5} min ago
                    </span>
                  </div>
                  <p className="text-body-m text-text-primary mb-2">
                    Decision {i}: Automated processing completed successfully
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-green-400">✓ Approved</span>
                    <span className="text-xs text-text-secondary">
                      {(95 + Math.random() * 5).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Health */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-bg-surface border border-border-subtle rounded-card p-4">
              <h4 className="text-heading-s text-text-primary mb-3">System Health</h4>
              <div className="space-y-3">
                <HealthItem label="API Latency" value="127ms" status="good" />
                <HealthItem label="Error Rate" value="0.2%" status="good" />
                <HealthItem label="Uptime" value="99.97%" status="good" />
              </div>
            </div>

            <div className="bg-bg-surface border border-border-subtle rounded-card p-4">
              <h4 className="text-heading-s text-text-primary mb-3">Model Info</h4>
              <div className="space-y-2 text-body-s">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Version:</span>
                  <span className="text-text-primary">v12.3.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Training Data:</span>
                  <span className="text-text-primary">45.8M samples</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Last Updated:</span>
                  <span className="text-text-primary">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle p-6 bg-bg-surface/50">
          <div className="flex items-center justify-between">
            <p className="text-body-s text-text-secondary">
              All decisions are logged to immutable audit trail
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-card font-semibold hover:bg-accent-teal transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 hover:border-accent-cyan/40 transition-colors">
      <div className="flex items-center gap-2 mb-2 text-text-secondary">
        {icon}
        <span className="text-label-s">{label}</span>
      </div>
      <div className={`text-heading-m font-bold ${color}`}>{value}</div>
    </div>
  );
}

function HealthItem({ label, value, status }: { 
  label: string; 
  value: string; 
  status: 'good' | 'warning' | 'bad' 
}) {
  const colors = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500',
    bad: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
        <span className="text-body-s text-text-secondary">{label}</span>
      </div>
      <span className="text-body-s text-text-primary font-medium">{value}</span>
    </div>
  );
}
