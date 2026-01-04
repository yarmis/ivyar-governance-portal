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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nodeId, action, conditionsMet } = body;

    if (!nodeId || !action) {
      return NextResponse.json({ success: false, error: 'nodeId and action required' }, { status: 400 });
    }

    const tree = getTreeData();
    const boundariesData = getBoundariesData();

    const node = tree.nodes.find((n: any) => n.id === nodeId);
    if (!node) {
      return NextResponse.json({ success: false, error: 'Node not found' }, { status: 404 });
    }

    const validAction = node.actions.find((a: any) => a.id === action);
    if (!validAction) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const applicableBoundaries = boundariesData.boundaries.filter((b: any) => node.boundaries.includes(b.id));

    const conditionsAnalysis = node.conditions.map((condition: string) => ({
      condition,
      met: conditionsMet?.includes(condition) || false
    }));

    const conditionsMetCount = conditionsAnalysis.filter((c: any) => c.met).length;
    const conditionsTotal = node.conditions.length;
    const conditionsScore = conditionsTotal > 0 ? Math.round((conditionsMetCount / conditionsTotal) * 100) : 0;

    const riskFactors: string[] = [];
    const riskMitigations: string[] = [];

    if (node.riskLevel === 'critical') {
      riskFactors.push('Decision node classified as critical risk');
      riskMitigations.push('Requires highest-level approval');
    }

    if (conditionsScore < 100) {
      riskFactors.push(`Only ${conditionsMetCount}/${conditionsTotal} conditions verified`);
      riskMitigations.push('Complete all condition verifications before proceeding');
    }

    applicableBoundaries.forEach((b: any) => {
      if (b.severity === 'critical') {
        riskFactors.push(`Critical boundary: ${b.rule}`);
        riskMitigations.push(`Ensure compliance: ${b.description}`);
      }
    });

    let status = 'proceed';
    let message = '';
    let confidence = 0;

    if (conditionsScore === 100 && node.riskLevel !== 'critical') {
      status = 'proceed';
      message = 'All conditions met. Proceed with standard approval.';
      confidence = 95;
    } else if (conditionsScore >= 80) {
      status = 'proceed_with_caution';
      message = 'Most conditions met. Review before final approval.';
      confidence = 75;
    } else if (conditionsScore >= 50) {
      status = 'review_required';
      message = 'Significant conditions unmet. Additional review needed.';
      confidence = 50;
    } else {
      status = 'halt';
      message = 'Insufficient conditions met. Do not proceed.';
      confidence = 25;
    }

    if (node.riskLevel === 'critical') {
      confidence = Math.max(confidence - 20, 10);
      message += ' Critical risk level requires enhanced scrutiny.';
    }

    if (action === 'reject' || action === 'deny') {
      status = 'document';
      message = 'Rejection decision. Ensure thorough documentation.';
    }

    const reasoning = {
      decision: {
        nodeId: node.id,
        title: node.title,
        selectedAction: validAction.label,
        nextNode: validAction.nextNode
      },
      analysis: {
        conditionsScore,
        conditionsMet: conditionsMetCount,
        conditionsTotal,
        conditions: conditionsAnalysis
      },
      boundaries: {
        total: applicableBoundaries.length,
        critical: applicableBoundaries.filter((b: any) => b.severity === 'critical').length,
        high: applicableBoundaries.filter((b: any) => b.severity === 'high').length,
        list: applicableBoundaries.map((b: any) => ({ id: b.id, rule: b.rule, severity: b.severity }))
      },
      risk: {
        level: node.riskLevel,
        factors: riskFactors,
        mitigations: riskMitigations
      },
      approval: {
        required: node.approvalRequired,
        level: node.level
      },
      recommendation: { status, message, confidence },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ success: true, reasoning });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Reasoning Engine',
    version: '1.3',
    usage: { method: 'POST', body: { nodeId: 'string', action: 'string', conditionsMet: 'array' } }
  });
}