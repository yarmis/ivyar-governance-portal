import { NextResponse } from "next/server";

const rules = [
  { id: 1, name: "Initial Response", actorType: "sedgwick", deadline: 3, unit: "BUSINESS_DAYS" },
  { id: 2, name: "Document Review", actorType: "sedgwick", deadline: 10, unit: "BUSINESS_DAYS" },
];

export async function GET() {
  return NextResponse.json({ success: true, data: rules });
}