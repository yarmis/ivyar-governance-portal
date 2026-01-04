import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getTreeData = () => {
  const filePath = path.join(process.cwd(), 'app/hbs/governance/tree/data/tree.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const getBoundariesData = () => {
  const filePath = path.join(process.cwd(), 'app/hbs/governance/boundaries/data/boundaries.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

interface IntegrationRequest {
  module: string;
  action: string;
  context: {
    amount?: number;
    type?: string;
    urgency?: string;
    description?: string;
  };
}

const moduleMapping: Record<string, string> = {
  'admin:user_delete': 'GOV-5',
  'admin:policy_change': 'GOV-1',
  'admin:security_override': 'GOV-2',
  'employer:payment_approve': 'GOV-1',
  'employer:contract_terminate': 'GOV-3',
  'client:data_export': 'GOV-5',
  'client:account_delete': 'GOV-5',
  'pilot:emergency_action': 'GOV-2',
  'pilot:budget_request': 'GOV-1',
  'pilot:partner_add': 'GOV-3',
  'procurement:vendor_approve': 'GOV-3',
  'procurement:large_purchase': 'GOV-4',
  'logistics:emergency_dispatch': 'GOV-2',
  'donor:fund_reallocation': 'GOV-4'
};

export async function POST(request: NextRequest) {
  try {
    const body: IntegrationRequest = await request.json();
    const { module, action, context } = body;

    if (!module || !action) {
      return NextResponse.json({ success: false, error: 'module and action required' }, { status: 400 });
    }

    const actionKey = `${module}:${action}`;
    const nodeId = moduleMapping[actionKey];

    if (!nodeId) {
      return NextResponse.json({
        success: true,
        governance: {
          required: false,
          message: 'No governance check required for this action'
        }
      });
    }

    const tree = getTreeData();
    const boundariesData = getBoundariesData();

    const node = tree.nodes.find((n: any) => n.id === nodeId);
    if (!node) {
      return NextResponse.json({ success: false, error: 'Governance node not found' }, { status: 500 });
    }

    const applicableBoundaries = boundariesData.boundaries.filter((b: any) => 
      node.boundaries.includes(b.id)
    );

    const criticalBoundaries = applicableBoundaries.filter((b: any) => b.severity === 'critical');
    const warnings: string[] = [];
    const blockers: string[] = [];

    // Check context against boundaries
    if (context.amount && context.amount > 100000) {
      warnings.push('Large amount requires additional approval');
    }

    if (context.urgency === 'emergency' && node.level !== 'emergency') {
      warnings.push('Emergency context on non-emergency decision path');
    }

    criticalBoundaries.forEach((b: any) => {
      blockers.push(`Critical boundary applies: ${b.rule}`);
    });

    const canProceed = blockers.length === 0 || context.urgency === 'emergency';
    const requiresApproval = node.riskLevel === 'critical' || node.riskLevel === 'high';

    return NextResponse.json({
      success: true,
      governance: {
        required: true,
        nodeId: node.id,
        nodeTitle: node.title,
        riskLevel: node.riskLevel,
        canProceed,
        requiresApproval,
        approvalAuthority: node.approvalRequired,
        boundaries: applicableBoundaries.map((b: any) => ({
          id: b.id,
          rule: b.rule,
          severity: b.severity
        })),
        warnings,
        blockers,
        conditions: node.conditions,
        actions: node.actions.map((a: any) => a.label)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Integration API',
    version: '1.3',
    description: 'Unified governance check for all IVYAR modules',
    supportedModules: ['admin', 'employer', 'client', 'pilot', 'procurement', 'logistics', 'donor'],
    usage: {
      method: 'POST',
      body: {
        module: 'string (e.g., admin, employer)',
        action: 'string (e.g., user_delete, payment_approve)',
        context: {
          amount: 'number (optional)',
          type: 'string (optional)',
          urgency: 'string (optional)',
          description: 'string (optional)'
        }
      }
    },
    examples: [
      { module: 'admin', action: 'user_delete', context: { type: 'permanent' } },
      { module: 'employer', action: 'payment_approve', context: { amount: 50000 } },
      { module: 'pilot', action: 'emergency_action', context: { urgency: 'emergency' } }
    ]
  });
}