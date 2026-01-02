import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailType = 
  | 'sla_breach_attorney'
  | 'sla_breach_client'
  | 'sla_breach_employer'
  | 'escalation_level2'
  | 'escalation_level3'
  | 'welcome'
  | 'pilot_invitation';

interface SendEmailParams {
  to: string;
  type: EmailType;
  data: Record<string, any>;
}

// Email templates
const templates: Record<EmailType, (data: any) => { subject: string; html: string }> = {
  
  sla_breach_attorney: (data) => ({
    subject: `SLA Breach Detected — Claim ${data.claimId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A4B84; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛡️ IVYAR Platform</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>Dear Counsel,</p>
          <p>A service-level agreement (SLA) breach has been detected:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Claim ID</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.claimId}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Actor</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.actor}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Delay</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.delayDays} days</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Severity</strong></td><td style="padding: 8px; border: 1px solid #ddd; color: ${data.severity === 'critical' ? '#DC2626' : '#F59E0B'};">${data.severity.toUpperCase()}</td></tr>
          </table>
          <p>This breach has been recorded in the immutable legal timeline.</p>
          <a href="${data.portalUrl}" style="display: inline-block; background: #10B9B9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Case Details</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>IVYAR Platform — Institutional Transparency & Legal Integrity</p>
          <p>Lake Stevens, Washington, USA</p>
        </div>
      </div>
    `,
  }),

  sla_breach_client: (data) => ({
    subject: `Update on Your Claim — Delay Detected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A4B84; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛡️ IVYAR Platform</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>Hello,</p>
          <p>A delay has been detected in the processing of your claim.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Claim ID:</strong> ${data.claimId}</p>
            <p><strong>Delay:</strong> ${data.delayDays} days</p>
            <p><strong>Responsible Party:</strong> ${data.actor}</p>
          </div>
          <p>This delay has been automatically documented and added to your case file.</p>
          <a href="${data.portalUrl}" style="display: inline-block; background: #10B9B9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Your Case</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>IVYAR Platform — Protecting workers through transparency</p>
        </div>
      </div>
    `,
  }),

  sla_breach_employer: (data) => ({
    subject: `SLA Breach Alert — Claim ${data.claimId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A4B84; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛡️ IVYAR Platform</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>Dear Employer,</p>
          <p>An SLA breach has been detected in a workers' compensation claim associated with your organization.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Claim ID</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.claimId}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Delay</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.delayDays} days</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Severity</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.severity}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Responsible</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.actor}</td></tr>
          </table>
          <p>This breach may impact employee well-being and compliance timelines.</p>
          <a href="${data.portalUrl}" style="display: inline-block; background: #10B9B9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Dashboard</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>IVYAR Platform — Institutional Transparency & Legal Integrity</p>
        </div>
      </div>
    `,
  }),

  escalation_level2: (data) => ({
    subject: `⚠️ Escalation Notice — Claim ${data.claimId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #F59E0B; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">⚠️ ESCALATION LEVEL 2</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>An SLA breach has exceeded 24 hours and requires operational review.</p>
          <div style="background: #FEF3C7; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Claim:</strong> ${data.claimId}</p>
            <p><strong>Actor:</strong> ${data.actor}</p>
            <p><strong>Delay:</strong> ${data.delayDays} days</p>
            <p><strong>Hours since detection:</strong> ${data.hoursElapsed}</p>
          </div>
          <p><strong>Required Action:</strong> Review and resolve the underlying cause of this delay.</p>
          <a href="${data.portalUrl}" style="display: inline-block; background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Take Action</a>
        </div>
      </div>
    `,
  }),

  escalation_level3: (data) => ({
    subject: `🚨 CRITICAL: Institutional Escalation — Claim ${data.claimId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #DC2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🚨 CRITICAL ESCALATION</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p><strong>IMMEDIATE ATTENTION REQUIRED</strong></p>
          <p>A workers' compensation claim has reached CRITICAL escalation status due to unresolved SLA breaches exceeding 72 hours.</p>
          <div style="background: #FEE2E2; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <p><strong>Claim:</strong> ${data.claimId}</p>
            <p><strong>Actor:</strong> ${data.actor}</p>
            <p><strong>Total Delay:</strong> ${data.delayDays} days</p>
            <p><strong>Escalation Level:</strong> 3 (CRITICAL)</p>
            <p><strong>Status:</strong> CASE REVIEW REQUIRED</p>
          </div>
          <p><strong>Immediate Actions Required:</strong></p>
          <ol>
            <li>Review case status immediately</li>
            <li>Identify root cause of delay</li>
            <li>Implement corrective measures</li>
            <li>Document resolution steps</li>
          </ol>
          <a href="${data.portalUrl}" style="display: inline-block; background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Review Case Now</a>
        </div>
      </div>
    `,
  }),

  welcome: (data) => ({
    subject: `Welcome to IVYAR Platform`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A4B84; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛡️ Welcome to IVYAR</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>Hello ${data.name},</p>
          <p>Your account has been created on the IVYAR Platform.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Role:</strong> ${data.role}</p>
          </div>
          <a href="${data.portalUrl}/login" style="display: inline-block; background: #10B9B9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Sign In</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>IVYAR Platform — Institutional Transparency & Legal Integrity</p>
        </div>
      </div>
    `,
  }),

  pilot_invitation: (data) => ({
    subject: `Invitation to IVYAR Pilot Program`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A4B84; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛡️ IVYAR Pilot Program</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>Dear ${data.name},</p>
          <p>We invite your organization to participate in the <strong>IVYAR Pilot Program</strong> — an institutional initiative designed to improve transparency, accountability, and legal integrity in claims processing.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>The pilot includes:</strong></p>
            <ul>
              <li>SLA monitoring and delay detection</li>
              <li>Immutable legal timeline</li>
              <li>Notifications governance</li>
              <li>SLA Breach Center</li>
              <li>Comprehensive reporting</li>
            </ul>
          </div>
          <p>We would be glad to schedule a 30-minute demonstration at your convenience.</p>
          <a href="${data.portalUrl}/pilot" style="display: inline-block; background: #10B9B9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Learn More</a>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
          <p>IVYAR Platform — Lake Stevens, Washington, USA</p>
          <p>www.ivyar.org</p>
        </div>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail({ to, type, data }: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const template = templates[type](data);
    
    const result = await resend.emails.send({
      from: 'IVYAR Platform <notifications@ivyar.org>',
      to,
      subject: template.subject,
      html: template.html,
    });

    console.log(`[EMAIL] Sent ${type} to ${to}`);
    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error(`[EMAIL ERROR] Failed to send ${type} to ${to}:`, error);
    return { success: false, error: error.message };
  }
}

// Send breach notifications to all parties
export async function sendBreachNotifications(breach: {
  claimId: string;
  actor: string;
  delayDays: number;
  severity: string;
  attorneyEmail?: string;
  clientEmail?: string;
  employerEmail?: string;
}) {
  const portalUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://portal.ivyar.org';
  const results = [];

  if (breach.attorneyEmail) {
    results.push(await sendEmail({
      to: breach.attorneyEmail,
      type: 'sla_breach_attorney',
      data: { ...breach, portalUrl },
    }));
  }

  if (breach.clientEmail) {
    results.push(await sendEmail({
      to: breach.clientEmail,
      type: 'sla_breach_client',
      data: { ...breach, portalUrl },
    }));
  }

  if (breach.employerEmail) {
    results.push(await sendEmail({
      to: breach.employerEmail,
      type: 'sla_breach_employer',
      data: { ...breach, portalUrl },
    }));
  }

  return results;
}

export default { send: sendEmail, sendBreachNotifications };