'use client';

import { useState } from 'react';

interface Boundary {
  id: string;
  rule: string;
  description: string;
  category: string;
  severity: string;
  checkpoints: string[];
  violationActions: string[];
}

interface BoundaryCardProps {
  boundary: Boundary;
}

export default function BoundaryCard({ boundary }: BoundaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const severityColors: Record<string, string> = {
    critical: 'border-red-500 bg-red-900/20',
    high: 'border-orange-500 bg-orange-900/20',
    medium: 'border-yellow-500 bg-yellow-900/20'
  };

  const severityBadge: Record<string, string> = {
    critical: 'bg-red-600',
    high: 'bg-orange-600',
    medium: 'bg-yellow-600'
  };

  const categoryIcons: Record<string, string> = {
    safety: '🛡️',
    integrity: '⚖️',
    accountability: '📋',
    mission: '🎯',
    operations: '⚙️',
    compliance: '✓'
  };

  return (
    <div className={`rounded-lg border-2 ${severityColors[boundary.severity]} transition-all`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[boundary.category]}</span>
            <div>
              <span className="text-xs font-mono text-gray-400">{boundary.id}</span>
              <h3 className="font-bold text-white">{boundary.rule}</h3>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${severityBadge[boundary.severity]}`}>
            {boundary.severity}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-3">{boundary.description}</p>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 capitalize">
            {boundary.category}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {expanded ? '▲ Hide Details' : '▼ Show Details'}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-700 p-4 space-y-4">
          {/* Checkpoints */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Checkpoints</h4>
            <ul className="space-y-1">
              {boundary.checkpoints.map((checkpoint, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">○</span>
                  <span className="text-gray-300">{checkpoint}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Violation Actions */}
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Violation Actions</h4>
            <ul className="space-y-1">
              {boundary.violationActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  <span className="text-gray-300">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}