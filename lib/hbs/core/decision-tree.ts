// lib/hbs/core/decision-tree.ts
// HBS Governance Core - Universal Decision Tree Engine v1.0

// ============================================================================
// TYPES
// ============================================================================

export type NodeType = 'question' | 'outcome' | 'emergency' | 'boundary' | 'escalation' | 'branch';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DecisionNode {
  id: string;
  type: NodeType;
  question?: string;
  outcome?: string;
  recommendation?: string;
  riskLevel?: RiskLevel;
  yesPath?: string | null;
  noPath?: string | null;
  branches?: DecisionBranch[];
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface DecisionBranch {
  label: string;
  targetNodeId: string;
  condition?: string;
}

export interface DecisionTree {
  id: string;
  name: string;
  module: string;
  version: string;
  description: string;
  rootNodeId: string;
  nodes: DecisionNode[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'deprecated';
  tenantId?: string;
}

export interface DecisionContext {
  tenantId: string;
  module: string;
  userId: string;
  userRole: string;
  sessionId: string;
  startedAt: string;
  metadata?: Record<string, any>;
}

export interface DecisionRecord {
  id: string;
  treeId: string;
  nodeId: string;
  decision: string;
  context: DecisionContext;
  riskScore?: number;
  outcome?: string;
  timestamp: string;
}

export interface TreeTraversalResult {
  currentNode: DecisionNode;
  path: string[];
  isComplete: boolean;
  outcome?: string;
  recommendation?: string;
  riskLevel?: RiskLevel;
}

// ============================================================================
// CORE ENGINE
// ============================================================================

export class DecisionTreeEngine {
  private trees: Map<string, DecisionTree> = new Map();
  private records: DecisionRecord[] = [];

  // Register a decision tree
  registerTree(tree: DecisionTree): void {
    this.trees.set(tree.id, tree);
  }

  // Get tree by ID
  getTree(treeId: string): DecisionTree | undefined {
    return this.trees.get(treeId);
  }

  // Get trees by module
  getTreesByModule(module: string): DecisionTree[] {
    return Array.from(this.trees.values()).filter(t => t.module === module && t.status === 'active');
  }

  // Get node from tree
  getNode(treeId: string, nodeId: string): DecisionNode | undefined {
    const tree = this.trees.get(treeId);
    if (!tree) return undefined;
    return tree.nodes.find(n => n.id === nodeId);
  }

  // Traverse tree with answer
  traverse(treeId: string, currentNodeId: string, answer: 'yes' | 'no' | string): TreeTraversalResult | null {
    const tree = this.trees.get(treeId);
    if (!tree) return null;

    const currentNode = tree.nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return null;

    let nextNodeId: string | null = null;

    // Handle different node types
    if (currentNode.type === 'question') {
      nextNodeId = answer === 'yes' ? currentNode.yesPath || null : currentNode.noPath || null;
    } else if (currentNode.type === 'branch' && currentNode.branches) {
      const branch = currentNode.branches.find(b => b.label === answer);
      nextNodeId = branch?.targetNodeId || null;
    }

    if (!nextNodeId) {
      // End of path - return outcome
      return {
        currentNode,
        path: [currentNodeId],
        isComplete: true,
        outcome: currentNode.outcome,
        recommendation: currentNode.recommendation,
        riskLevel: currentNode.riskLevel,
      };
    }

    const nextNode = tree.nodes.find(n => n.id === nextNodeId);
    if (!nextNode) return null;

    return {
      currentNode: nextNode,
      path: [currentNodeId, nextNodeId],
      isComplete: nextNode.type === 'outcome' || nextNode.type === 'emergency',
      outcome: nextNode.outcome,
      recommendation: nextNode.recommendation,
      riskLevel: nextNode.riskLevel,
    };
  }

  // Record a decision
  recordDecision(record: Omit<DecisionRecord, 'id' | 'timestamp'>): DecisionRecord {
    const fullRecord: DecisionRecord = {
      ...record,
      id: `DEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    this.records.push(fullRecord);
    return fullRecord;
  }

  // Get decision history
  getDecisionHistory(filters?: {
    treeId?: string;
    userId?: string;
    tenantId?: string;
    from?: string;
    to?: string;
  }): DecisionRecord[] {
    let results = [...this.records];

    if (filters?.treeId) {
      results = results.filter(r => r.treeId === filters.treeId);
    }
    if (filters?.userId) {
      results = results.filter(r => r.context.userId === filters.userId);
    }
    if (filters?.tenantId) {
      results = results.filter(r => r.context.tenantId === filters.tenantId);
    }
    if (filters?.from) {
      results = results.filter(r => r.timestamp >= filters.from!);
    }
    if (filters?.to) {
      results = results.filter(r => r.timestamp <= filters.to!);
    }

    return results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // Validate tree structure
  validateTree(tree: DecisionTree): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check root node exists
    const rootNode = tree.nodes.find(n => n.id === tree.rootNodeId);
    if (!rootNode) {
      errors.push(`Root node '${tree.rootNodeId}' not found`);
    }

    // Check all paths lead somewhere
    for (const node of tree.nodes) {
      if (node.type === 'question') {
        if (node.yesPath && !tree.nodes.find(n => n.id === node.yesPath)) {
          errors.push(`Node '${node.id}': yesPath '${node.yesPath}' not found`);
        }
        if (node.noPath && !tree.nodes.find(n => n.id === node.noPath)) {
          errors.push(`Node '${node.id}': noPath '${node.noPath}' not found`);
        }
      }
      if (node.type === 'branch' && node.branches) {
        for (const branch of node.branches) {
          if (!tree.nodes.find(n => n.id === branch.targetNodeId)) {
            errors.push(`Node '${node.id}': branch target '${branch.targetNodeId}' not found`);
          }
        }
      }
    }

    // Check for orphan nodes
    const reachableNodes = new Set<string>();
    const queue = [tree.rootNodeId];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (reachableNodes.has(nodeId)) continue;
      reachableNodes.add(nodeId);

      const node = tree.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      if (node.yesPath) queue.push(node.yesPath);
      if (node.noPath) queue.push(node.noPath);
      if (node.branches) {
        node.branches.forEach(b => queue.push(b.targetNodeId));
      }
    }

    for (const node of tree.nodes) {
      if (!reachableNodes.has(node.id)) {
        errors.push(`Orphan node: '${node.id}' is not reachable from root`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Get statistics
  getStats(treeId?: string): {
    totalTrees: number;
    totalNodes: number;
    totalDecisions: number;
    decisionsByModule: Record<string, number>;
  } {
    const trees = treeId 
      ? [this.trees.get(treeId)].filter(Boolean) as DecisionTree[]
      : Array.from(this.trees.values());

    const decisionsByModule: Record<string, number> = {};
    for (const record of this.records) {
      const tree = this.trees.get(record.treeId);
      if (tree) {
        decisionsByModule[tree.module] = (decisionsByModule[tree.module] || 0) + 1;
      }
    }

    return {
      totalTrees: trees.length,
      totalNodes: trees.reduce((sum, t) => sum + t.nodes.length, 0),
      totalDecisions: this.records.length,
      decisionsByModule,
    };
  }
}

// ============================================================================
// DEFAULT TREES
// ============================================================================

export const UNIVERSAL_GOVERNANCE_TREE: DecisionTree = {
  id: 'GOV-UNIVERSAL-001',
  name: 'Universal Governance Decision Tree',
  module: 'governance',
  version: '1.0',
  description: 'Universal decision tree for governance scenarios across all modules',
  rootNodeId: 'start',
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2026-01-06T00:00:00Z',
  nodes: [
    // Entry
    { id: 'start', type: 'question', question: 'Is this an emergency requiring immediate action?', yesPath: 'emergency-branch', noPath: 'authority-check' },
    
    // Emergency Branch
    { id: 'emergency-branch', type: 'branch', question: 'What type of emergency?', branches: [
      { label: 'Safety/Security', targetNodeId: 'emergency-safety' },
      { label: 'Operational', targetNodeId: 'emergency-operational' },
      { label: 'Compliance', targetNodeId: 'emergency-compliance' },
    ]},
    { id: 'emergency-safety', type: 'outcome', outcome: 'Activate Emergency Protocol. Contact security immediately. Document all actions.', riskLevel: 'critical', recommendation: 'Follow emergency response plan. Notify all stakeholders.' },
    { id: 'emergency-operational', type: 'outcome', outcome: 'Escalate to operations lead. Implement contingency measures.', riskLevel: 'high', recommendation: 'Assess impact and implement recovery plan.' },
    { id: 'emergency-compliance', type: 'outcome', outcome: 'Contact compliance officer and legal. Preserve all evidence.', riskLevel: 'critical', recommendation: 'Do not proceed without legal guidance.' },
    
    // Authority Check
    { id: 'authority-check', type: 'question', question: 'Do you have authority to make this decision?', yesPath: 'scope-check', noPath: 'escalate-authority' },
    { id: 'escalate-authority', type: 'outcome', outcome: 'Escalate to authorized decision-maker. Document request and reasoning.', riskLevel: 'medium', recommendation: 'Identify the correct authority level for this decision.' },
    
    // Scope Check
    { id: 'scope-check', type: 'question', question: 'Is this within your defined scope of responsibility?', yesPath: 'policy-check', noPath: 'boundary-alert' },
    { id: 'boundary-alert', type: 'outcome', outcome: 'Boundary exceeded. Transfer to appropriate department/person.', riskLevel: 'medium', recommendation: 'Document reason for transfer and ensure handoff is complete.' },
    
    // Policy Check
    { id: 'policy-check', type: 'question', question: 'Is there an existing policy that governs this decision?', yesPath: 'follow-policy', noPath: 'precedent-check' },
    { id: 'follow-policy', type: 'question', question: 'Does the policy clearly apply to this situation?', yesPath: 'apply-policy', noPath: 'interpretation-needed' },
    { id: 'apply-policy', type: 'outcome', outcome: 'Apply existing policy. Document decision and policy reference.', riskLevel: 'low', recommendation: 'Ensure consistent application of policy.' },
    { id: 'interpretation-needed', type: 'outcome', outcome: 'Policy interpretation needed. Consult policy owner or legal.', riskLevel: 'medium', recommendation: 'Document interpretation for future reference.' },
    
    // Precedent Check
    { id: 'precedent-check', type: 'question', question: 'Is there a similar past decision that can guide you?', yesPath: 'follow-precedent', noPath: 'risk-assessment' },
    { id: 'follow-precedent', type: 'question', question: 'Is the precedent still valid and applicable?', yesPath: 'apply-precedent', noPath: 'risk-assessment' },
    { id: 'apply-precedent', type: 'outcome', outcome: 'Follow established precedent. Document decision and reference.', riskLevel: 'low', recommendation: 'Note any differences from precedent case.' },
    
    // Risk Assessment
    { id: 'risk-assessment', type: 'branch', question: 'What is the risk level of this decision?', branches: [
      { label: 'Low', targetNodeId: 'proceed-low' },
      { label: 'Medium', targetNodeId: 'proceed-medium' },
      { label: 'High', targetNodeId: 'proceed-high' },
      { label: 'Critical', targetNodeId: 'proceed-critical' },
    ]},
    { id: 'proceed-low', type: 'outcome', outcome: 'Proceed with decision. Standard documentation required.', riskLevel: 'low', recommendation: 'Document decision and rationale.' },
    { id: 'proceed-medium', type: 'outcome', outcome: 'Proceed with caution. Enhanced documentation and review recommended.', riskLevel: 'medium', recommendation: 'Consider peer review. Document thoroughly.' },
    { id: 'proceed-high', type: 'outcome', outcome: 'Seek approval from supervisor/committee before proceeding.', riskLevel: 'high', recommendation: 'Do not proceed without documented approval.' },
    { id: 'proceed-critical', type: 'outcome', outcome: 'Full governance review required. Escalate to leadership.', riskLevel: 'critical', recommendation: 'Prepare comprehensive briefing. Do not proceed without board/leadership approval.' },
  ],
};

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const decisionTreeEngine = new DecisionTreeEngine();

// Register default trees
decisionTreeEngine.registerTree(UNIVERSAL_GOVERNANCE_TREE);
