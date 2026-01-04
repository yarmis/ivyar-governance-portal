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
    const { scenario, context = {} } = body;

    if (!scenario) {
      return NextResponse.json({ success: false, error: 'Scenario required' }, { status: 400 });
    }

    const tree = getTreeData();
    const boundariesData = getBoundariesData();
    const scenarioLower = scenario.toLowerCase();

    // Determine category
    let category = 'funding';
    if (scenarioLower.includes('emergency') || scenarioLower.includes('urgent')) category = 'emergency';
    else if (scenarioLower.includes('partner') || scenarioLower.includes('ngo')) category = 'partner';
    else if (scenarioLower.includes('whistleblower') || scenarioLower.includes('complaint')) category = 'compliance';
    else if (scenarioLower.includes('reallocat')) category = 'reallocation';

    const nodeMap: Record<string, string> = {
      emergency: 'GOV-2', funding: 'GOV-1', partner: 'GOV-3', compliance: 'GOV-5', reallocation: 'GOV-4'
    };

    const node = tree.nodes.find((n: any) => n.id === nodeMap[category]);
    const boundaries = boundariesData.boundaries.filter((b: any) => node?.boundaries.includes(b.id));

    // Calculate risk
    let riskScore = 30;
    if (context.amount > 100000) riskScore += 25;
    if (context.urgency === 'emergency') riskScore += 20;
    if (boundaries.some((b: any) => b.severity === 'critical')) riskScore += 15;
    riskScore = Math.min(100, riskScore);

    const riskLevel = riskScore >= 70 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

    // Risk factors
    const riskFactors: string[] = [];
    if (context.amount > 100000) riskFactors.push('High-value transaction requires oversight');
    if (context.urgency === 'emergency') riskFactors.push('Emergency bypasses standard controls');
    if (boundaries.some((b: any) => b.severity === 'critical')) riskFactors.push('Critical boundaries apply');

    // Recommendations
    const recommendations = [];
    if (riskScore >= 70) {
      recommendations.push({ priority: 'critical', title: 'Escalate to Leadership', description: 'High risk requires senior approval' });
    }
    if (riskScore >= 50) {
      recommendations.push({ priority: 'high', title: 'Enhanced Due Diligence', description: 'Additional verification needed' });
    }
    if (category === 'emergency') {
      recommendations.push({ priority: 'high', title: 'Activate Emergency Protocol', description: 'Use expedited process with safeguards' });
    }
    recommendations.push({ priority: 'medium', title: 'Document Rationale', description: 'Record all decision factors' });
    recommendations.push({ priority: 'low', title: 'Schedule Review', description: 'Review outcomes in 30 days' });

    // Checklist
    const complianceChecklist = node?.conditions.map((c: string) => ({ item: c, required: true })) || [];
    if (context.amount > 100000) {
      complianceChecklist.push({ item: 'Finance Director approval', required: true });
    }

    return NextResponse.json({
      success: true,
      analysis: {
        category,
        riskScore,
        riskLevel,
        riskFactors,
        confidence: 75,
        recommendedPath: {
          nodeId: node?.id,
          title: node?.title,
          description: node?.description,
          approvalRequired: node?.approvalRequired
        },
        boundaries: boundaries.map((b: any) => ({ id: b.id, rule: b.rule, severity: b.severity })),
        recommendations,
        complianceChecklist,
        suggestedActions: node?.actions || []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, service: 'HBS AI Recommendations', version: '1.3' });
}