import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendBreachNotifications } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'breach') {
      // Send breach notifications to all parties
      const results = await sendBreachNotifications(data);
      return NextResponse.json({ success: true, results });
    }

    if (action === 'single') {
      // Send single email
      const { to, type, emailData } = data;
      const result = await sendEmail({ to, type, data: emailData });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
