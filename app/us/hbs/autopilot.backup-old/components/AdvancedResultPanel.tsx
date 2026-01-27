"use client";

import { useState } from "react";
import { type AutopilotDecision, type AutopilotScenario } from "@/lib/autopilot";
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, FileText, Download, Share2, ExternalLink } from 'lucide-react';
import JsonModal from "./JsonModal";

interface Props {
  decision: AutopilotDecision;
  scenario: AutopilotScenario;
  input: Record<string, any>;
}

export default function AdvancedResultPanel({ decision, scenario, input }: Props) {
  const [showJson, setShowJson] = useState(false);

  const statusConfig = {
    approve: {
      color: 'green',
      icon: CheckCircle2,
      bg: 'bg-green-500/10',
      border: 'border-green-500/40',
      text: 'text-green-400',
      label: 'APPROVED'
    },
    review: {
      color: 'yellow',
      icon: AlertTriangle,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      label: 'REVIEW REQUIRED'
    },
    reject: {
      color: 'red',
      icon: XCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/40',
      text: 'text-red-400',
      label: 'REJECTED'
    }
  };

  const config = statusConfig[decision.status as keyof typeof statusConfig] || statusConfig.review;
  const StatusIcon = config.icon;
  
  const scoreDisplay = typeof decision.score === "number" 
    ? Math.round(decision.score * 100) 
    : 0;

  const scoreColor = scoreDisplay >= 80 ? 'green' : scoreDisplay >= 50 ? 'yellow' : 'red';
  const scoreColorClasses = {
    green: 'text-green-400 from-green-500 to-green-600',
    yellow: 'text-yellow-400 from-yellow-500 to-yellow-600',
    red: 'text-red-400 from-red-500 to-red-600'
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      scenario: scenario.name,
      input,
      decision,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-${scenario.id}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom">
      {/* Header Card */}
      <div className={`bg-bg-surface border ${config.border} rounded-card p-8`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${config.bg}`}>
              <StatusIcon className={`w-8 h-8 ${config.text}`} />
            </div>
            <div>
              <h2 className="text-heading-l mb-1">Decision Result</h2>
              <p className="text-body-m text-text-secondary">
                Evaluated: {scenario.name}
              </p>
            </div>
          </div>

          <div className={`px-6 py-3 rounded-full ${config.bg} border ${config.border}`}>
            <span className={`text-label-l font-bold ${config.text}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Confidence Score - Circular Gauge */}
        <div className="flex items-center justify-center py-8">
          <div className="relative w-48 h-48">
            {/* Background Circle */}
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-border-subtle"
              />
              {/* Progress Circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(scoreDisplay / 100) * 553} 553`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={scoreColorClasses[scoreColor].split(' ')[1]} stopOpacity="1" />
                  <stop offset="100%" className={scoreColorClasses[scoreColor].split(' ')[2]} stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${scoreColorClasses[scoreColor].split(' ')[0]}`}>
                {scoreDisplay}
              </span>
              <span className="text-label-m text-text-secondary mt-1">
                Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Score Interpretation */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-bg-obsidian rounded-lg">
            <div className="text-heading-m text-green-400 mb-1">80-100</div>
            <div className="text-label-s text-text-secondary">High Confidence</div>
          </div>
          <div className="text-center p-4 bg-bg-obsidian rounded-lg">
            <div className="text-heading-m text-yellow-400 mb-1">50-79</div>
            <div className="text-label-s text-text-secondary">Medium Confidence</div>
          </div>
          <div className="text-center p-4 bg-bg-obsidian rounded-lg">
            <div className="text-heading-m text-red-400 mb-1">0-49</div>
            <div className="text-label-s text-text-secondary">Low Confidence</div>
          </div>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-accent-cyan" />
          <h3 className="text-heading-m">AI Reasoning</h3>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-body-l text-text-secondary leading-relaxed">
            {decision.explanation}
          </p>
        </div>
      </div>

      {/* References */}
      {decision.references && decision.references.length > 0 && (
        <div className="bg-bg-surface border border-border-subtle rounded-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <ExternalLink className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-heading-m">References & Citations</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {decision.references.map((ref, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full"
              >
                <span className="text-label-s text-accent-cyan">{ref}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Summary */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-8">
        <h3 className="text-heading-m mb-4">Input Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(input).map(([key, value]) => (
            <div key={key} className="p-4 bg-bg-obsidian rounded-lg">
              <div className="text-label-s text-text-secondary mb-1 uppercase tracking-wide">
                {key.replace(/_/g, ' ')}
              </div>
              <div className="text-body-m text-text-primary font-medium">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          className="flex-1 px-6 py-3 bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <Download className="w-5 h-5" />
          Export Decision
        </button>
        
        <button
          onClick={() => setShowJson(true)}
          className="flex-1 px-6 py-3 bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <FileText className="w-5 h-5" />
          View Raw JSON
        </button>

        <button
          className="flex-1 px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-lg hover:bg-accent-teal transition-all flex items-center justify-center gap-2 font-semibold shadow-glow hover:shadow-glow-strong"
        >
          <Share2 className="w-5 h-5" />
          Share Decision
        </button>
      </div>

      {/* JSON Modal */}
      {showJson && (
        <JsonModal decision={decision} onClose={() => setShowJson(false)} />
      )}
    </div>
  );
}
