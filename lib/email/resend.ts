import { Resend } from 'resend';

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Send a single templated email
export async function sendEmail({ to, type, data }: {
  to: string;
  type: string;
  data: any;
}) {
  const resend = getResend();

  // You likely have templates here — keeping your structure
  const html = renderTemplate(type, data);

  return await resend.emails.send({
    from: 'IVYAR <no-reply@ivyar.org>',
    to,
    subject: data.subject ?? 'Notification',
    html,
  });
}

// Send breach notifications to multiple recipients
export async function sendBreachNotifications(data: any) {
  const resend = getResend();

  const recipients = data.recipients ?? [];
  const results = [];

  for (const r of recipients) {
    const html = renderTemplate('breach', { ...data, recipient: r });

    const result = await resend.emails.send({
      from: 'IVYAR <no-reply@ivyar.org>',
      to: r.email,
      subject: data.subject ?? 'Security Breach Notification',
      html,
    });

    results.push({ email: r.email, result });
  }

  return results;
}

// Placeholder — your existing template renderer
function renderTemplate(type: string, data: any): string {
  // Keep your existing implementation here
  return `<div>${type} notification</div>`;
}

