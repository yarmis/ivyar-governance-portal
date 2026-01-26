'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { generateMockDecision, formatTimestamp } from '@/lib/utils/helpers';
import { autopilotModules } from '@/data/autopilot-modules';

interface Decision {
  id: string;
  timestamp: Date;
  module: string;
  moduleName: string;
  action: string;
  confidence: number;
  status: 'approved' | 'pending';
}

export function LiveSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [speed, setSpeed] = useState<number>(3000);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const randomModule = autopilotModules[Math.floor(Math.random() * autopilotModules.length)];
      const mockDecision = generateMockDecision(randomModule.id);
      const decision: Decision = {
        id: mockDecision.id,
        timestamp: mockDecision.timestamp,
        module: randomModule.id,
        moduleName: randomModule.name,
        action: mockDecision.action,
        confidence: mockDecision.confidence,
        status: mockDecision.status as 'approved' | 'pending',
      };
      setDecisions((prev) => [decision, ...prev].slice(0, 20));
    }, speed);
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  return (
    <div className="bg-bg-obsidian border border-accent-cyan/40 rounded-card overflow-hidden">
      <div className="border-b border-border-subtle p-6 bg-gradient-to-r from-accent-cyan/5 to-accent-teal/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-cyan/20">
              <Zap className="w-6 h-6 text-accent-cyan" />
            </div>
            <div>
              <h3 className="text-heading-m text-text-primary">Live Decision Simulation</h3>
              <p className="text-body-s text-text-secondary">Real-time AI decision-making demonstration</p>
            </div>
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              console.log('START CLICKED!');
              setIsRunning(true);
            }}
            disabled={isRunning}
            type="button"
            className={`px-6 py-3 rounded-card font-semibold flex items-center gap-2 transition-all ${
              isRunning ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-accent-cyan text-bg-obsidian hover:bg-accent-teal cursor-pointer'
            }`}
          >
            <Play className="w-5 h-5" />
            Start
          </button>

          <button
            onClick={() => {
              console.log('PAUSE CLICKED!');
              setIsRunning(false);
            }}
            disabled={!isRunning}
            type="button"
            className={`px-6 py-3 rounded-card font-semibold flex items-center gap-2 transition-all ${
              !isRunning ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 cursor-pointer'
            }`}
          >
            <Pause className="w-5 h-5" />
            Pause
          </button>

          <button
            onClick={() => {
              console.log('RESET CLICKED!');
              setDecisions([]);
              setIsRunning(false);
            }}
            type="button"
            className="px-6 py-3 rounded-card border border-border-subtle text-text-secondary hover:border-accent-cyan/40 hover:text-text-primary transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-body-s text-text-secondary">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent-cyan/60"
            >
              <option value={1000}>Fast (1s)</option>
              <option value={3000}>Normal (3s)</option>
              <option value={5000}>Slow (5s)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
        {decisions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-body-m text-text-secondary">Press Start to begin live simulation</p>
          </div>
        ) : (
          decisions.map((decision) => (
            <div key={decision.id} className="bg-bg-surface border border-border-subtle rounded-lg p-4 hover:border-accent-cyan/40 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${decision.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-body-s font-medium text-accent-cyan">{decision.moduleName}</span>
                </div>
                <span className="text-xs text-text-secondary">{formatTimestamp(decision.timestamp)}</span>
              </div>
              <p className="text-body-m text-text-primary mb-3">{decision.action}</p>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium ${decision.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {decision.status === 'approved' ? '✓ APPROVED' : '⏳ PENDING'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-bg-obsidian rounded-full h-1.5 w-24">
                    <div className="bg-gradient-to-r from-accent-cyan to-accent-teal h-1.5 rounded-full" style={{ width: `${decision.confidence}%` }} />
                  </div>
                  <span className="text-xs text-text-secondary">{decision.confidence.toFixed(1)}%</span>
                </div>
                <span className="text-xs text-text-secondary ml-auto">ID: {decision.id.slice(-6)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {decisions.length > 0 && (
        <div className="border-t border-border-subtle p-4 bg-bg-surface/50">
          <div className="flex items-center justify-between text-body-s">
            <span className="text-text-secondary">Total: <span className="text-accent-cyan font-medium">{decisions.length}</span></span>
            <span className="text-text-secondary">Avg: <span className="text-green-400 font-medium">{(decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length).toFixed(1)}%</span></span>
            <span className="text-text-secondary">Approved: <span className="text-green-400 font-medium">{decisions.filter(d => d.status === 'approved').length}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
