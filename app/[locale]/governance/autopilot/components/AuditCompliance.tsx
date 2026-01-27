"use client";

import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { FileCheck, ChevronDown, ChevronUp } from 'lucide-react';
import type { GovernanceRules } from '@/lib/governance/rule-engine';

interface Props {
  rules: GovernanceRules;
}

export default function AuditCompliance({ rules }: Props) {
  const { t } = useTranslation();
  const [showFullJson, setShowFullJson] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-heading-l mb-2">
          {t.governanceAutopilot?.audit?.title || 'Audit & Compliance View'}
        </h2>
        <p className="text-body-m text-text-secondary">
          {t.governanceAutopilot?.audit?.subtitle || 'Constitutional rules, refusal logic, and traceability'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Governance Rules Preview */}
        <div className="bg-bg-surface border border-border-subtle rounded-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-heading-m">
              {t.governanceAutopilot?.audit?.governanceRules || 'Governance Rules'}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-bg-obsidian rounded-lg">
              <div className="text-label-s text-text-secondary mb-1">
                {t.governanceAutopilot?.audit?.version || 'Version'}
              </div>
              <div className="text-body-m font-mono">{rules.version}</div>
            </div>

            <div className="p-3 bg-bg-obsidian rounded-lg">
              <div className="text-label-s text-text-secondary mb-1">Contexts Defined</div>
              <div className="text-body-m">{rules.contexts.length}</div>
            </div>

            <div className="p-3 bg-bg-obsidian rounded-lg">
              <div className="text-label-s text-text-secondary mb-1">Global Restrictions</div>
              <div className="text-body-m">{rules.global_non_permitted_actions.length}</div>
            </div>

            <div className="p-3 bg-bg-obsidian rounded-lg">
              <div className="text-label-s text-text-secondary mb-1">Mandatory Refusals</div>
              <div className="text-body-m">{rules.mandatory_refusals.length}</div>
            </div>
          </div>

          <button
            onClick={() => setShowFullJson(!showFullJson)}
            className="mt-4 w-full px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg hover:bg-accent-cyan/20 transition-colors flex items-center justify-center gap-2 text-accent-cyan font-medium"
          >
            {showFullJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showFullJson 
              ? (t.governanceAutopilot?.audit?.hideFullJson || 'Hide Full JSON')
              : (t.governanceAutopilot?.audit?.viewFullJson || 'View Full JSON')
            }
          </button>

          {showFullJson && (
            <div className="mt-4 p-4 bg-bg-obsidian rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-label-xs text-text-secondary">
                {JSON.stringify(rules, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Refusal Logic */}
        <div className="bg-bg-surface border border-border-subtle rounded-card p-6">
          <h3 className="text-heading-m mb-4">
            {t.governanceAutopilot?.audit?.refusalLogic || 'Refusal Logic'}
          </h3>
          
          <div className="space-y-3">
            {rules.mandatory_refusals.map((refusal, idx) => (
              <div 
                key={refusal.id}
                className="p-4 bg-bg-obsidian rounded-lg border border-red-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center flex-shrink-0 text-label-s text-red-400 font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-label-m font-semibold text-red-400 mb-1">
                      {refusal.id.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <p className="text-body-s text-text-secondary mb-2">
                      {refusal.description}
                    </p>
                    <div className="text-label-xs text-text-secondary">
                      Applies to: {refusal.applies_to.includes('*') ? 'All contexts' : refusal.applies_to.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authority Chain */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-6">
        <h3 className="text-heading-m mb-4">
          {t.governanceAutopilot?.audit?.authorityChain || 'Authority Chain'}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-label-m font-semibold">
                  {t.governanceAutopilot?.audit?.level || 'Level'}
                </th>
                <th className="text-left py-3 px-4 text-label-m font-semibold text-green-400">
                  {t.governanceAutopilot?.audit?.can || 'Can'}
                </th>
                <th className="text-left py-3 px-4 text-label-m font-semibold text-red-400">
                  {t.governanceAutopilot?.audit?.cannot || 'Cannot'}
                </th>
              </tr>
            </thead>
            <tbody>
              {rules.authority_chain.map((level, idx) => (
                <tr 
                  key={level.level}
                  className={idx !== rules.authority_chain.length - 1 ? 'border-b border-border-subtle' : ''}
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold uppercase tracking-wide text-label-m">
                      {level.level.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {level.can.map(action => (
                        <div key={action} className="text-body-s text-green-400">
                          ✓ {action.replace(/_/g, ' ')}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {level.cannot.map(action => (
                        <div key={action} className="text-body-s text-red-400">
                          ✗ {action.replace(/_/g, ' ')}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traceability */}
      <div className="bg-gradient-to-br from-accent-cyan/5 to-accent-teal/5 border border-accent-cyan/20 rounded-card p-6">
        <h3 className="text-heading-m mb-3">Traceability Chain</h3>
        <p className="text-body-m text-text-secondary mb-4">
          Every boundary evaluation follows this transparent process:
        </p>
        
        <div className="space-y-2">
          {[
            'Action input received and normalized',
            'Global non-permitted actions checked',
            'Context-specific restrictions validated',
            'Delegated authority scope verified',
            'Escalation triggers evaluated',
            'Decision returned with full reasoning',
            'Rule references logged for audit'
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-bg-surface/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-label-s text-accent-cyan font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div className="text-body-s text-text-secondary">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
