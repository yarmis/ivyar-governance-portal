import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getBoundariesData = () => {
  const filePath = path.join(process.cwd(), 'app/hbs/governance/boundaries/data/boundaries.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

export async function GET(request: NextRequest) {
  const boundaryId = request.nextUrl.searchParams.get('id');
  const category = request.nextUrl.searchParams.get('category');
  const severity = request.nextUrl.searchParams.get('severity');

  try {
    const data = getBoundariesData();
    let boundaries = data.boundaries;

    // Filter by ID
    if (boundaryId) {
      const boundary = boundaries.find((b: any) => b.id === boundaryId);
      if (!boundary) {
        return NextResponse.json({ success: false, error: 'Boundary not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, boundary });
    }

    // Filter by category
    if (category) {
      boundaries = boundaries.filter((b: any) => b.category === category);
    }

    // Filter by severity
    if (severity) {
      boundaries = boundaries.filter((b: any) => b.severity === severity);
    }

    // Calculate stats
    const stats = {
      totalBoundaries: data.boundaries.length,
      byCategory: {
        safety: data.boundaries.filter((b: any) => b.category === 'safety').length,
        integrity: data.boundaries.filter((b: any) => b.category === 'integrity').length,
        accountability: data.boundaries.filter((b: any) => b.category === 'accountability').length,
        mission: data.boundaries.filter((b: any) => b.category === 'mission').length,
        operations: data.boundaries.filter((b: any) => b.category === 'operations').length,
        compliance: data.boundaries.filter((b: any) => b.category === 'compliance').length
      },
      bySeverity: {
        critical: data.boundaries.filter((b: any) => b.severity === 'critical').length,
        high: data.boundaries.filter((b: any) => b.severity === 'high').length,
        medium: data.boundaries.filter((b: any) => b.severity === 'medium').length
      }
    };

    return NextResponse.json({
      success: true,
      version: data.version,
      lastUpdated: data.lastUpdated,
      stats,
      count: boundaries.length,
      boundaries
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}