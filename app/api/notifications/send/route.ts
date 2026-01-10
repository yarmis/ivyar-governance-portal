import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendEmail, sendBreachNotifications } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    // Initialize Resend safely inside the handler
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (action === 'breach') {
      // Send breach notifications to all parties
      const results = await sendBreachNotifications(data);
      return NextResponse.json({ success: true, results });
    }

    if (action === 'single') {
      // Send single email using your existing helper
      const { to, type, emailData } = data;
      const result = await sendEmail({ to, type, data: emailData });
      return NextResponse.json({ success: true, result });
    }

    if (action === 'direct') {
      // Direct Resend email (your new logic)
      const result = await resend.emails.send({
        from: 'IVYAR <no-reply@ivyar.org>',
        to: data.to,
        subject: data.subject,
        html: data.html,
      });

      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { success: false, error: 'Unknown action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

