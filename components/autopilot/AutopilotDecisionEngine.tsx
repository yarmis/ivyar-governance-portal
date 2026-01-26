'use client';

import { useState } from 'react';
import { Brain, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

interface Decision {
  id: string;
  timestamp: string;
  module: string;
  action: string;
  confidence: number;
  status: 'approved' | 'pending' | 'rejected';
}

const mockDecisions: Decision[] = [
  {
    id: 'DEC-001',
    timestamp: '2 min ago',
    module: 'Materials AI',
    action: 'Approve Grade A steel for structural use',
    confidence: 98.2,
    status: 'approved',
  },
  {
    id: 'DEC-002',
    timestamp: '5 min ago',
    module: 'Procurement AI',
    action: 'Recommend GlobalTech Solutions for tender #4587',
    confidence: 94.5,
    status: 'approved',
  },
  {
    id: 'DEC-003',
    timestamp: '8 min ago',
    module: 'Violations AI',
    action: 'Issue warning for minor zoning violation #ZV-892',
    confidence: 96.8,
    status: 'approved',
  },
  {
    id: 'DEC-004',
    timestamp: '12 min ago',
    module: 'Routing AI',
    action: 'Optimize freight route SEA → LAX via I-5',
    confidence: 95.3,
    status: 'approved',
  },
];

export function AutopilotDecisionEngine() {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  return (
    <div className="bg-bg-obsidian border border-border-subtle rounded-card">
      {/* Header */}
      <div className="border-b border-border-subtle p-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-accent-cyan" />
          <h3 className="text-heading-m text-text-primary">Live Decision Engine</h3>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-body-s text-green-400">Active</span>
          </div>
        </div>
        <p className="text-body-s text-text-secondary">
          Real-time AI decision-making across all governance modules
        </p>
      </div>

      {/* Decision Feed */}
      <div className="divide-y divide-border-subtle">
        {mockDecisions.map((decision) => (
          <div
            key={decision.id}
            onClick={() => setSelectedDecision(decision)}
            className="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className="mt-1">
                {decision.status === 'approved' && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                {decision.status === 'pending' && (
                  <Clock className="w-5 h-5 text-yellow-400" />
                )}
                {decision.status === 'rejected' && (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-body-s font-medium text-accent-cyan">
                    {decision.module}
                  </span>
                  <span className="text-label-s text-text-secondary">
                    {decision.timestamp}
                  </span>
                  <span className="ml-auto text-body-s text-text-primary font-medium">
                    {decision.confidence}% confidence
                  </span>
                </div>
                
                <p className="text-body-m text-text-primary group-hover:text-accent-cyan transition-colors">
                  {decision.action}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border-subtle p-4 bg-bg-surface">
        <div className="flex items-center justify-between text-body-s text-text-secondary">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>All decisions logged to immutable audit trail</span>
          </div>
          <button className="text-accent-cyan hover:text-accent-teal transition-colors">
            View Full History →
          </button>
        </div>
      </div>

      {/* Decision Detail Modal (simplified) */}
      {selectedDecision && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedDecision(null)}
        >
          <div 
            className="bg-bg-obsidian border border-accent-cyan/40 rounded-card p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-heading-m text-text-primary mb-4">
              Decision Details: {selectedDecision.id}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-label-s text-text-secondary mb-1">Module</div>
                <div className="text-body-m text-text-primary">{selectedDecision.module}</div>
              </div>
              
              <div>
                <div className="text-label-s text-text-secondary mb-1">Action</div>
                <div className="text-body-m text-text-primary">{selectedDecision.action}</div>
              </div>
              
              <div>
                <div className="text-label-s text-text-secondary mb-1">Confidence Level</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-bg-surface rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-accent-cyan to-accent-teal h-2 rounded-full"
                      style={{ width: `${selectedDecision.confidence}%` }}
                    />
                  </div>
                  <span className="text-body-m text-accent-cyan font-medium">
                    {selectedDecision.confidence}%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDecision(null)}
              className="w-full px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-card font-semibold hover:bg-accent-teal transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
