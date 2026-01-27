"use client";

import { useState } from "react";
import { useTranslation } from '@/i18n/useTranslation';
import { type AutopilotDecision } from "@/lib/autopilot";
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface DecisionHistory {
  id: string;
  timestamp: Date;
  scenarioId: string;
  scenarioName: string;
  decision: AutopilotDecision;
  input: Record<string, any>;
}

interface Props {
  currentDecision: AutopilotDecision;
  history: DecisionHistory[];
  onClose: () => void;
}

export default function ComparisonView({ currentDecision, history, onClose }: Props) {
  const { t } = useTranslation();
  const [selectedHistory, setSelectedHistory] = useState<DecisionHistory | null>(
    history[0] || null
  );

  if (!selectedHistory) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-bg-surface border border-border-subtle rounded-card p-8 max-w-md">
          <h3 className="text-heading-m text-text-primary mb-4">
            {t.hbsAutopilot?.history?.noHistory || 'No History Available'}
          </h3>
          <p className="text-body-m text-text-secondary mb-6">
            You need at least one previous decision to compare.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-lg font-semibold"
          >
            {t.hbsAutopilot?.comparison?.close || 'Close'}
          </button>
        </div>
      </div>
    );
  }

  const currentScore = typeof currentDecision.score === 'number' 
    ? Math.round(currentDecision.score * 100) 
    : 0;
  
  const historyScore = typeof selectedHistory.decision.score === 'number'
    ? Math.round(selectedHistory.decision.score * 100)
    : 0;

  const scoreDiff = currentScore - historyScore;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-bg-obsidian border border-border-subtle rounded-card max-w-6xl w-full my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div>
            <h2 className="text-heading-l mb-1">{t.hbsAutopilot?.comparison?.title || 'Decision Comparison'}</h2>
            <p className="text-body-m text-text-secondary">
              {t.hbsAutopilot?.comparison?.subtitle || 'Compare current decision with historical results'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-surface rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* History Selector */}
        <div className="p-6 border-b border-border-subtle">
          <label className="block text-label-m font-medium mb-2">
            {t.hbsAutopilot?.comparison?.compareWith || 'Compare with:'}
          </label>
          <select
            value={selectedHistory.id}
            onChange={(e) => {
              const found = history.find(h => h.id === e.target.value);
              if (found) setSelectedHistory(found);
            }}
            className="w-full px-4 py-3 bg-bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
          >
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {h.scenarioName} - {new Date(h.timestamp).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Current Decision */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-heading-m">{t.hbsAutopilot?.comparison?.currentDecision || 'Current Decision'}</h3>
                <span className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full text-label-s text-accent-cyan">
                  {t.hbsAutopilot?.comparison?.new || 'NEW'}
                </span>
              </div>

              {/* Status */}
              <div className="p-4 bg-bg-surface rounded-lg">
                <div className="text-label-s text-text-secondary mb-1">{t.hbsAutopilot?.comparison?.status || 'Status'}</div>
                <div className="text-heading-s uppercase">{currentDecision.status}</div>
              </div>

              {/* Score */}
              <div className="p-4 bg-bg-surface rounded-lg">
                <div className="text-label-s text-text-secondary mb-1">{t.hbsAutopilot?.results?.confidenceScore || 'Confidence Score'}</div>
                <div className="flex items-center gap-2">
                  <div className="text-heading-s">{currentScore}%</div>
                  {scoreDiff !== 0 && (
                    <div className={`flex items-center gap-1 text-label-s ${scoreDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {scoreDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(scoreDiff)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 bg-bg-surface rounded-lg">
                <div className="text-label-s text-text-secondary mb-2">{t.hbsAutopilot?.comparison?.explanation || 'Explanation'}</div>
                <div className="text-body-s text-text-primary line-clamp-4">
                  {currentDecision.explanation}
                </div>
              </div>
            </div>

            {/* Historical Decision */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-heading-m">{t.hbsAutopilot?.comparison?.previousDecision || 'Previous Decision'}</h3>
                <span className="px-3 py-1 bg-bg-surface border border-border-subtle rounded-full text-label-s text-text-secondary">
                  {new Date(selectedHistory.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Status */}
              <div className="p-4 bg-bg-surface rounded-lg">
                <div className="text-label-s text-text-secondary mb-1">{t.hbsAutopilot?.comparison?.status || 'Status'}</div>
                <div className="text-heading-s uppercase">{selectedHistory.decision.status}</div>
              </div>

              {/* Score */}
              <div className="p-4 bg-bg-surface rounded-lg">
                <div className="text-label-s text-text-secondary mb-1">{t.hbsAutopilot?.results?.confidenceScore || 'Confidence Score'}</div>
                <div className="text-heading-s">{historyScore}%</div>
              </div>

              {/* Explanation */}
              <div className="p-4 bg-bg-surface rounded-lg">
                <div className="text-label-s text-text-secondary mb-2">{t.hbsAutopilot?.comparison?.explanation || 'Explanation'}</div>
                <div className="text-body-s text-text-primary line-clamp-4">
                  {selectedHistory.decision.explanation}
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-6 p-6 bg-accent-cyan/5 border border-accent-cyan/20 rounded-lg">
            <h4 className="text-label-m font-semibold mb-2">{t.hbsAutopilot?.comparison?.insights || 'Comparison Insights'}</h4>
            <div className="space-y-2 text-body-s text-text-secondary">
              {currentDecision.status === selectedHistory.decision.status ? (
                <p>✓ {t.hbsAutopilot?.comparison?.sameStatus || 'Both decisions have the same status'}: <strong>{currentDecision.status}</strong></p>
              ) : (
                <p>⚠ {t.hbsAutopilot?.comparison?.statusChanged || 'Status changed from'} <strong>{selectedHistory.decision.status}</strong> {t.hbsAutopilot?.comparison?.to || 'to'} <strong>{currentDecision.status}</strong></p>
              )}
              
              {scoreDiff === 0 && <p>• {t.hbsAutopilot?.comparison?.scoresIdentical || 'Confidence scores are identical'}</p>}
              {scoreDiff > 0 && <p className="text-green-400">↑ {t.hbsAutopilot?.comparison?.confidenceImproved || 'Confidence improved by'} {scoreDiff} {t.hbsAutopilot?.comparison?.points || 'points'}</p>}
              {scoreDiff < 0 && <p className="text-red-400">↓ {t.hbsAutopilot?.comparison?.confidenceDecreased || 'Confidence decreased by'} {Math.abs(scoreDiff)} {t.hbsAutopilot?.comparison?.points || 'points'}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all font-medium"
          >
            {t.hbsAutopilot?.comparison?.close || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
