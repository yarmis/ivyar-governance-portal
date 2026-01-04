'use client';

import { useState, useCallback } from 'react';

interface GovernanceContext {
  amount?: number;
  type?: string;
  urgency?: string;
  description?: string;
}

interface GovernanceResult {
  required: boolean;
  nodeId?: string;
  nodeTitle?: string;
  riskLevel?: string;
  canProceed: boolean;
  requiresApproval: boolean;
  approvalAuthority?: string;
  boundaries?: { id: string; rule: string; severity: string }[];
  warnings: string[];
  blockers: string[];
  conditions?: string[];
  actions?: string[];
}

interface UseGovernanceReturn {
  check: (module: string, action: string, context?: GovernanceContext) => Promise<GovernanceResult | null>;
  result: GovernanceResult | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useGovernance(): UseGovernanceReturn {
  const [result, setResult] = useState<GovernanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (
    module: string,
    action: string,
    context: GovernanceContext = {}
  ): Promise<GovernanceResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/hbs/integrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, action, context })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Governance check failed');
        setLoading(false);
        return null;
      }

      const governanceResult: GovernanceResult = data.governance;
      setResult(governanceResult);
      setLoading(false);
      return governanceResult;
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { check, result, loading, error, reset };
}

export default useGovernance;