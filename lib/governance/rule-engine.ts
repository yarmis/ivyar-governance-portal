// Governance Rule Engine - Frontend Deterministic Logic
// No backend API required - all evaluation happens client-side

export type Context = {
  id: string;
  label: string;
  description: string;
  delegated_authority: string[];
  non_permitted_actions: string[];
  escalation_triggers: string[];
  examples: {
    admissible: string;
    escalation: string;
    inadmissible: string;
  };
};

export type GovernanceRules = {
  version: string;
  contexts: Context[];
  global_non_permitted_actions: string[];
  mandatory_refusals: {
    id: string;
    description: string;
    applies_to: string[];
  }[];
  authority_chain: {
    level: string;
    can: string[];
    cannot: string[];
  }[];
};

export type EvaluationResult = {
  status: "admissible" | "inadmissible" | "escalation_required";
  reason: string;
  rule_reference: string;
  level: "system" | "authority" | "constitutional";
  example?: string;
};

/**
 * Normalize text for matching
 */
function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Simple keyword matching - checks if action contains any pattern keywords
 */
function matchesAny(action: string, patterns: string[]): boolean {
  const normalized = normalize(action);
  return patterns.some(pattern => {
    const keywords = pattern.replace(/_/g, " ").split(" ");
    return keywords.some(keyword => normalized.includes(keyword));
  });
}

/**
 * Main evaluation function - determines if action is admissible
 */
export function evaluateAction(
  action: string,
  contextId: string,
  rules: GovernanceRules
): EvaluationResult {
  const normalizedAction = normalize(action);

  // 1. Check global non-permitted actions
  if (matchesAny(normalizedAction, rules.global_non_permitted_actions)) {
    return {
      status: "inadmissible",
      reason: "Global non-permitted action",
      rule_reference: "global_non_permitted_actions",
      level: "constitutional"
    };
  }

  // 2. Find context
  const context = rules.contexts.find(c => c.id === contextId);
  if (!context) {
    return {
      status: "inadmissible",
      reason: "Unknown context",
      rule_reference: "context_not_found",
      level: "system"
    };
  }

  // 3. Check context-specific non-permitted actions
  if (matchesAny(normalizedAction, context.non_permitted_actions)) {
    return {
      status: "inadmissible",
      reason: "Non-permitted action in this context",
      rule_reference: `${context.id}.non_permitted_actions`,
      level: "constitutional",
      example: context.examples.inadmissible
    };
  }

  // 4. Check if action is in delegated authority
  const inDelegated = matchesAny(normalizedAction, context.delegated_authority);

  if (inDelegated) {
    // 5. Check escalation triggers
    if (matchesAny(normalizedAction, context.escalation_triggers)) {
      return {
        status: "escalation_required",
        reason: "Action requires human or institutional escalation",
        rule_reference: `${context.id}.escalation_triggers`,
        level: "authority",
        example: context.examples.escalation
      };
    }

    return {
      status: "admissible",
      reason: "Action within delegated authority",
      rule_reference: `${context.id}.delegated_authority`,
      level: "system",
      example: context.examples.admissible
    };
  }

  // 6. Default: not in delegated authority
  return {
    status: "inadmissible",
    reason: "Action not within delegated authority",
    rule_reference: `${context.id}.delegated_authority_missing`,
    level: "authority"
  };
}

/**
 * Get context by ID
 */
export function getContext(
  contextId: string,
  rules: GovernanceRules
): Context | undefined {
  return rules.contexts.find(c => c.id === contextId);
}

/**
 * Get all contexts
 */
export function getAllContexts(rules: GovernanceRules): Context[] {
  return rules.contexts;
}
