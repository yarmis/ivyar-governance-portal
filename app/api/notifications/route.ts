import { NextResponse } from "next/server";

// In-memory store (use database in production)
const notifications: any[] = [
  { id: "n1", claimId: "SDG-2026-00142", channel: "email", recipient: "attorney@lawfirm.com", subject: "SLA Breach Detected", status: "delivered", createdAt: "2026-01-01T10:00:00Z" },
  { id: "n2", claimId: "SDG-2026-00142", channel: "portal", recipient: "john.williams@email.com", subject: "Delay in Your Claim", status: "sent", createdAt: "2026-01-01T10:05:00Z" },
  { id: "n3", claimId: "SDG-2026-00143", channel: "email", recipient: "employer@techcorp.com", subject: "SLA Breach Alert", status: "sent", createdAt: "2026-01-01T12:00:00Z" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const claimId = searchParams.get("claimId");
  const channel = searchParams.get("channel");
  const status = searchParams.get("status");

  let filtered = [...notifications];

  if (claimId) filtered = filtered.filter(n => n.claimId === claimId);
  if (channel) filtered = filtered.filter(n => n.channel === channel);
  if (status) filtered = filtered.filter(n => n.status === status);

  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newNotification = {
    id: `n${Date.now()}`,
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // Simulate sending
  setTimeout(() => {
    newNotification.status = "sent";
  }, 100);

  notifications.push(newNotification);
  
  return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
}