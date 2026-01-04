'use client';

import { useState } from 'react';
import { useGovernance } from '@/lib/hbs/useGovernance';

interface GovernanceWidgetProps {
  module: string;
  action: string;
  context?: {
    amount?: number;
    type?: string;
    urgency?: string;
    description?: string;
  };
  onApproved?: () => void;
  onBlocked?: (reason: string) => void;
  children: React.ReactNode;
}

export default function GovernanceWidget({
  module,
  action,
  context = {},
  onApproved,
  onBlocked,
  children
}: GovernanceWidgetProps) {
  const { check, result, loading, error, reset } = useGovernance();
  const [showDetails, setShowDetails] = useState(false);

  const handleAction = async () => {
    const governance = await check(module, action, context);

    if (!governance) return;

    if (!governance.required) {
      onApproved?.();
      return;
    }

    if (governance.canProceed && !governance.requiresApproval) {
      onApproved?.();
      return;
    }

    setShowDetails(true);

    if (!governance.canProceed) {
      onBlocked?.(governance.blockers[0] || 'Governance check failed');
    }
  };

  const handleProceed = () => {
    setShowDetails(false);
    reset();
    onApproved?.();
  };

  const handleCancel = () => {
    setShowDetails(false);
    reset();
  };

  const severityColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="relative">
      <div onClick={handleAction} className="cursor-pointer">
        {children}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
          <div className="text-white text-sm">Checking governance...</div>
        </div>
      )}

      {showDetails && result && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full mx-4 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Governance Check</h3>
              <span className={`px-3 py-1 rounded text-sm font-bold ${severityColors[result.riskLevel || 'low']}`}>
                {result.riskLevel?.toUpperCase()} RISK
              </span>
            </div>

            <div className="mb-4">
              <p className="text-gray-400 text-sm">Decision Node</p>
              <p className="font-medium">{result.nodeTitle}</p>
            </div>

            {result.warnings.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded">
                <p className="text-yellow-400 font-bold text-sm mb-2">⚠ Warnings</p>
                <ul className="text-sm space-y-1">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-yellow-200">{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.blockers.length > 0 && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-600 rounded">
                <p className="text-red-400 font-bold text-sm mb-2">✕ Blockers</p>
                <ul className="text-sm space-y-1">
                  {result.blockers.map((b, i) => (
                    <li key={i} className="text-red-200">{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.boundaries && result.boundaries.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Applicable Boundaries</p>
                <div className="flex flex-wrap gap-2">
                  {result.boundaries.map(b => (
                    <span
                      key={b.id}
                      className={`px-2 py-1 rounded text-xs ${
                        b.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                        b.severity === 'high' ? 'bg-orange-900/50 text-orange-300' :
                        'bg-yellow-900/50 text-yellow-300'
                      }`}
                    >
                      {b.id}: {b.rule}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.requiresApproval && (
              <div className="mb-4 p-3 bg-blue-900/30 border border-blue-600 rounded">
                <p className="text-blue-400 text-sm">
                  <span className="font-bold">Approval Required:</span> {result.approvalAuthority}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium"
              >
                Cancel
              </button>
              {result.canProceed && (
                <button
                  onClick={handleProceed}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium"
                >
                  Proceed with Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-900 text-red-200 text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
}