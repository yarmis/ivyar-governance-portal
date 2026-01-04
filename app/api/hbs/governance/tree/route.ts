import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getTreeData = () => {
  const filePath = path.join(process.cwd(), 'app/hbs/governance/tree/data/tree.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export async function GET(request: NextRequest) {
  const nodeId = request.nextUrl.searchParams.get('id');
  const level = request.nextUrl.searchParams.get('level');

  try {
    const tree = getTreeData();
    let nodes = tree.nodes;

    // Filter by ID
    if (nodeId) {
      const node = nodes.find((n: any) => n.id === nodeId);
      if (!node) {
        return NextResponse.json({ success: false, error: 'Node not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, node });
    }

    // Filter by level
    if (level) {
      nodes = nodes.filter((n: any) => n.level === level);
    }

    // Calculate stats
    const stats = {
      totalNodes: tree.nodes.length,
      byLevel: {
        strategic: tree.nodes.filter((n: any) => n.level === 'strategic').length,
        operational: tree.nodes.filter((n: any) => n.level === 'operational').length,
        emergency: tree.nodes.filter((n: any) => n.level === 'emergency').length,
        compliance: tree.nodes.filter((n: any) => n.level === 'compliance').length
      },
      byRisk: {
        critical: tree.nodes.filter((n: any) => n.riskLevel === 'critical').length,
        high: tree.nodes.filter((n: any) => n.riskLevel === 'high').length,
        medium: tree.nodes.filter((n: any) => n.riskLevel === 'medium').length,
        low: tree.nodes.filter((n: any) => n.riskLevel === 'low').length
      }
    };

    return NextResponse.json({
      success: true,
      version: tree.version,
      lastUpdated: tree.lastUpdated,
      stats,
      count: nodes.length,
      nodes
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}