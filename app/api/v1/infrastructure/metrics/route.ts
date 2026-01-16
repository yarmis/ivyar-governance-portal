import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      infrastructure: {
        totalAssets: 4,
        totalProjects: 2,
        activeProjects: 2,
        upcomingInspections: 0,
      },
      logistics: {
        totalShipments: 1,
        shipmentsInTransit: 1,
      },
      risks: {
        totalRisks: 2,
        unresolvedCritical: 0,
      },
    },
  });
}
