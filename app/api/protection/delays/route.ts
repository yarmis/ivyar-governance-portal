import { NextResponse } from "next/server";

const delays = [
  { id: 1, claimId: "SDG-2026-00142", actor: "Sedgwick", days: 18, severity: "critical" },
  { id: 2, claimId: "SDG-2026-00142", actor: "Sedgwick", days: 14, severity: "critical" },
];

export async function GET() {
  return NextResponse.json({ success: true, data: delays });
}