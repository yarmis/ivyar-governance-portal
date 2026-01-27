"use client";

import { useState } from "react";
import { useTranslation } from '@/i18n/useTranslation';
import { X, Clock, Play, Trash2, Search } from 'lucide-react';

interface DecisionHistory {
  id: string;
  timestamp: Date;
  scenarioId: string;
  scenarioName: string;
  decision: any;
  input: Record<string, any>;
}

interface Props {
  history: DecisionHistory[];
  onClose: () => void;
  onRerun: (entry: DecisionHistory) => void;
}

export default function HistoryPanel({ history, onClose, onRerun }: Props) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DecisionHistory | null>(null);

  const filteredHistory = history.filter(entry =>
    entry.scenarioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.decision.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const confirmMsg = t.hbsAutopilot?.history?.deleteConfirm || 'Delete this decision from history?';
    if (confirm(confirmMsg)) {
      const newHistory = history.filter(h => h.id !== id);
      localStorage.setItem('autopilot-history', JSON.stringify(newHistory));
      window.location.reload();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approve': return 'text-green-400 bg-green-500/10 border-green-500/40';
      case 'reject': return 'text-red-400 bg-red-500/10 border-red-500/40';
      case 'review': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/40';
      default: return 'text-text-secondary bg-bg-surface border-border-subtle';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-bg-obsidian border border-border-subtle rounded-card max-w-5xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle flex-shrink-0">
          <div>
            <h2 className="text-heading-l mb-1">{t.hbsAutopilot?.history?.title || 'Decision History'}</h2>
            <p className="text-body-m text-text-secondary">
              {history.length} {history.length !== 1 ? (t.hbsAutopilot?.history?.decisions || 'decisions') : (t.hbsAutopilot?.history?.decision || 'decision')} {t.hbsAutopilot?.history?.recorded || 'recorded'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-surface rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-border-subtle flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.hbsAutopilot?.history?.searchPlaceholder || 'Search by scenario or status...'}
              className="w-full pl-11 pr-4 py-3 bg-bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-heading-m text-text-secondary mb-2">
                {searchQuery ? (t.hbsAutopilot?.history?.noMatching || 'No matching history') : (t.hbsAutopilot?.history?.noHistory || 'No decisions yet')}
              </h3>
              <p className="text-body-s text-text-secondary">
                {searchQuery ? (t.hbsAutopilot?.history?.tryDifferent || 'Try a different search term') : (t.hbsAutopilot?.history?.noHistoryText || 'Your decision history will appear here')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((entry) => {
                const score = typeof entry.decision.score === 'number'
                  ? Math.round(entry.decision.score * 100)
                  : 0;

                return (
                  <div
                    key={entry.id}
                    className="bg-bg-surface border border-border-subtle rounded-lg p-4 hover:border-accent-cyan/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Scenario Name & Time */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-body-l font-semibold truncate">
                            {entry.scenarioName}
                          </h3>
                          <span className="text-label-s text-text-secondary flex-shrink-0">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {/* Status & Score */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`px-3 py-1 rounded-full border text-label-s font-medium uppercase ${getStatusColor(entry.decision.status)}`}>
                            {entry.decision.status}
                          </div>
                          <div className="text-label-m text-text-secondary">
                            {score}% {t.hbsAutopilot?.results?.confidence || 'confidence'}
                          </div>
                        </div>

                        {/* Explanation Preview */}
                        <p className="text-body-s text-text-secondary line-clamp-2">
                          {entry.decision.explanation}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onRerun(entry)}
                          className="p-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg transition-colors"
                          title={t.hbsAutopilot?.history?.rerun || 'Rerun with same inputs'}
                        >
                          <Play className="w-4 h-4 text-accent-cyan" />
                        </button>
                        <button
                          onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                          className="px-3 py-2 bg-bg-obsidian hover:bg-bg-surface border border-border-subtle rounded-lg transition-colors text-label-s"
                        >
                          {selectedEntry?.id === entry.id ? (t.hbsAutopilot?.history?.hide || 'Hide') : (t.hbsAutopilot?.history?.details || 'Details')}
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
                          title={t.hbsAutopilot?.history?.delete || 'Delete'}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedEntry?.id === entry.id && (
                      <div className="mt-4 pt-4 border-t border-border-subtle space-y-3 animate-in slide-in-from-top">
                        <div>
                          <h4 className="text-label-m font-semibold mb-2">{t.hbsAutopilot?.history?.inputData || 'Input Data'}</h4>
                          <div className="bg-bg-obsidian rounded-lg p-3">
                            <pre className="text-label-s text-text-secondary overflow-x-auto">
                              {JSON.stringify(entry.input, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-label-m font-semibold mb-2">{t.hbsAutopilot?.history?.fullExplanation || 'Full Explanation'}</h4>
                          <p className="text-body-s text-text-secondary">
                            {entry.decision.explanation}
                          </p>
                        </div>
                        {entry.decision.references && entry.decision.references.length > 0 && (
                          <div>
                            <h4 className="text-label-m font-semibold mb-2">{t.hbsAutopilot?.results?.references || 'References'}</h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.decision.references.map((ref: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full text-label-xs text-accent-cyan"
                                >
                                  {ref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle flex justify-between items-center flex-shrink-0">
          <button
            onClick={() => {
              const confirmMsg = `${t.hbsAutopilot?.history?.deleteAllConfirm || 'Delete all'} ${history.length} ${history.length !== 1 ? (t.hbsAutopilot?.history?.decisions || 'decisions') : (t.hbsAutopilot?.history?.decision || 'decision')}?`;
              if (confirm(confirmMsg)) {
                localStorage.removeItem('autopilot-history');
                window.location.reload();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all"
          >
            {t.hbsAutopilot?.wizard?.clearAllHistory || 'Clear All History'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-lg font-semibold hover:bg-accent-teal transition-all"
          >
            {t.hbsAutopilot?.comparison?.close || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
