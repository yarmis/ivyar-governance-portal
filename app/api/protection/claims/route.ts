import { NextResponse } from "next/server";

const claims = [
  { id: "SDG-2026-00142", worker: "John Williams", status: "Under Review", employer: "TechCorp Inc.", delays: 2 },
  { id: "SDG-2026-00143", worker: "Sarah Chen", status: "Open", employer: "BuildRight", delays: 0 },
];

export async function GET() {
  return NextResponse.json({ success: true, data: claims });
}