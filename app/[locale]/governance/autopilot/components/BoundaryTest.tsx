"use client";

import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { evaluateAction, type GovernanceRules, type EvaluationResult } from '@/lib/governance/rule-engine';
import { CheckCircle2, AlertTriangle, XCircle, Code } from 'lucide-react';

interface Props {
  rules: GovernanceRules;
}

export default function BoundaryTest({ rules }: Props) {
  const { t } = useTranslation();
  const [contextId, setContextId] = useState(rules.contexts[0]?.id || '');
  const [action, setAction] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleEvaluate = () => {
    if (!action.trim()) return;
    
    const evaluation = evaluateAction(action, contextId, rules);
    setResult(evaluation);
  };

  const getStatusConfig = () => {
    if (!result) return null;
    
    const configs = {
      admissible: {
        color: 'green',
        icon: CheckCircle2,
        bg: 'bg-green-500/10',
        border: 'border-green-500/40',
        text: 'text-green-400',
        label: t.governanceAutopilot?.boundaryTest?.admissible || 'ADMISSIBLE'
      },
      escalation_required: {
        color: 'yellow',
        icon: AlertTriangle,
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/40',
        text: 'text-yellow-400',
        label: t.governanceAutopilot?.boundaryTest?.escalationRequired || 'ESCALATION REQUIRED'
      },
      inadmissible: {
        color: 'red',
        icon: XCircle,
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        text: 'text-red-400',
        label: t.governanceAutopilot?.boundaryTest?.inadmissible || 'INADMISSIBLE'
      }
    };

    return configs[result.status];
  };

  const config = getStatusConfig();
  const StatusIcon = config?.icon;

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-8">
      <div className="mb-6">
        <h2 className="text-heading-l mb-2">
          {t.governanceAutopilot?.boundaryTest?.title || 'Test a Boundary'}
        </h2>
        <p className="text-body-m text-text-secondary">
          {t.governanceAutopilot?.boundaryTest?.subtitle || 'See how the constitutional layer evaluates a proposed action.'}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-6">
        {/* Context Selector */}
        <div>
          <label className="block text-label-m font-medium mb-2">
            {t.governanceAutopilot?.boundaryTest?.context || 'Context'}
          </label>
          <select
            value={contextId}
            onChange={(e) => {
              setContextId(e.target.value);
              setResult(null);
            }}
            className="w-full px-4 py-3 bg-bg-obsidian border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-text-primary"
          >
            {rules.contexts.map(ctx => (
              <option key={ctx.id} value={ctx.id}>
                {ctx.label}
              </option>
            ))}
          </select>
          <p className="text-label-s text-text-secondary mt-1">
            {rules.contexts.find(c => c.id === contextId)?.description}
          </p>
        </div>

        {/* Action Input */}
        <div>
          <label className="block text-label-m font-medium mb-2">
            {t.governanceAutopilot?.boundaryTest?.describeAction || 'Describe the Action'}
          </label>
          <textarea
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setResult(null);
            }}
            placeholder="e.g., Prioritize generator delivery to communities with lowest energy access"
            rows={3}
            className="w-full px-4 py-3 bg-bg-obsidian border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 text-text-primary placeholder:text-text-secondary/50"
          />
        </div>

        {/* Evaluate Button */}
        <button
          onClick={handleEvaluate}
          disabled={!action.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-teal text-bg-obsidian rounded-lg font-semibold hover:shadow-glow-strong transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.governanceAutopilot?.boundaryTest?.evaluate || 'Evaluate'}
        </button>
      </div>

      {/* Result */}
      {result && config && StatusIcon && (
        <div className={`p-6 border ${config.border} ${config.bg} rounded-lg space-y-4 animate-in slide-in-from-bottom`}>
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <StatusIcon className={`w-6 h-6 ${config.text}`} />
            </div>
            <div>
              <div className="text-label-s text-text-secondary uppercase tracking-wide mb-0.5">
                {t.governanceAutopilot?.boundaryTest?.status || 'Status'}
              </div>
              <div className={`text-heading-m font-bold ${config.text}`}>
                {config.label}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="text-label-m font-semibold mb-1">
              {t.governanceAutopilot?.boundaryTest?.reason || 'Reason'}
            </div>
            <p className="text-body-m text-text-secondary">{result.reason}</p>
          </div>

          {/* Rule Reference */}
          <div>
            <div className="text-label-m font-semibold mb-1">
              {t.governanceAutopilot?.boundaryTest?.ruleReference || 'Rule Reference'}
            </div>
            <code className="text-label-s text-accent-cyan bg-bg-obsidian px-3 py-1 rounded">
              {result.rule_reference}
            </code>
          </div>

          {/* Level */}
          <div>
            <div className="text-label-m font-semibold mb-1">
              {t.governanceAutopilot?.boundaryTest?.authorityLevel || 'Authority Level'}
            </div>
            <span className="inline-block px-3 py-1 bg-bg-surface border border-border-subtle rounded-full text-label-s uppercase">
              {result.level}
            </span>
          </div>

          {/* JSON Toggle */}
          <div className="pt-4 border-t border-border-subtle">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 text-label-m text-accent-cyan hover:text-accent-teal transition-colors"
            >
              <Code className="w-4 h-4" />
              {showJson 
                ? (t.governanceAutopilot?.boundaryTest?.hideJson || 'Hide JSON Response')
                : (t.governanceAutopilot?.boundaryTest?.viewJson || 'View JSON Response')
              }
            </button>

            {showJson && (
              <pre className="mt-3 p-4 bg-bg-obsidian rounded-lg text-label-s text-text-secondary overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
