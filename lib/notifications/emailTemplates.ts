/**
 * IVYAR Institutional Email Templates
 * Legal-grade, formal, court-ready
 */

interface BreachData {
  claimId: string;
  externalClaimId: string;
  actorType: string;
  actorName: string;
  delayDays: number;
  severity: string;
  createdAt: Date;
}

const PORTAL_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://portal.ivyar.org';

export const emailTemplates = {
  /**
   * SLA Breach — Attorney Notification
   */
  breachAttorney: (data: BreachData): string => `
Dear Counsel,

This is an automated institutional notification from the IVYAR Protection from Delays module.

A service-level agreement (SLA) breach has been detected:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BREACH DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Claim ID: ${data.externalClaimId}
- Responsible Party: ${data.actorName} (${data.actorType})
- Delay Duration: ${data.delayDays} days
- Severity: ${data.severity.toUpperCase()}
- Detected: ${data.createdAt.toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This event has been recorded in the immutable legal timeline and is now available in the Delay Report and Case Summary.

LEGAL NOTICE: This breach has been cryptographically timestamped and cannot be modified or deleted. The record may be used as evidence in legal proceedings.

Review full case status:
${PORTAL_URL}/claims/${data.claimId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IVYAR Platform
Institutional Transparency & Legal Integrity
Lake Stevens, Washington, USA
www.ivyar.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,

  /**
   * SLA Breach — Client Notification
   */
  breachClient: (data: BreachData): string => `
Hello,

We want to inform you that a delay has been detected in the processing of your workers' compensation claim.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR CLAIM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Claim Number: ${data.externalClaimId}
- Delay: ${data.delayDays} days
- Responsible Party: ${data.actorName}
- Status: ${data.severity.toUpperCase()} DELAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This delay has been automatically documented and added to your case file. This record may be used to support your claim.

View your case timeline and next steps:
${PORTAL_URL}/client

If you have questions, please contact your attorney or case manager.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IVYAR Platform
Protecting workers through transparency
www.ivyar.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,

  /**
   * SLA Breach — Employer Notification
   */
  breachEmployer: (data: BreachData): string => `
Dear Employer,

An SLA breach has been detected in a workers' compensation claim associated with your organization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BREACH SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Claim ID: ${data.externalClaimId}
- Responsible Party: ${data.actorName}
- Delay: ${data.delayDays} days
- Severity: ${data.severity.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This breach may impact:
- Employee well-being and recovery
- Compliance with labor regulations
- Organizational liability exposure
- TPA performance metrics

RECOMMENDED ACTION: Review your TPA's performance and ensure timely claim processing.

Access Employer Dashboard:
${PORTAL_URL}/employer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IVYAR Platform
Institutional Transparency & Legal Integrity
www.ivyar.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,

  /**
   * SLA Breach — TPA Notification
   */
  breachTPA: (data: BreachData): string => `
ATTENTION: TPA Compliance Team

An SLA breach has been recorded in the IVYAR Protection system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BREACH RECORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Claim ID: ${data.externalClaimId}
- Actor: ${data.actorName}
- Delay: ${data.delayDays} days
- Severity: ${data.severity.toUpperCase()}
- Timestamp: ${data.createdAt.toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This breach has been:
✓ Recorded in immutable timeline
✓ Added to Delay Report
✓ Flagged for compliance review
✓ Shared with relevant stakeholders

REQUIRED ACTION: Review and resolve the underlying cause of this delay.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IVYAR Platform
Institutional Transparency & Legal Integrity
www.ivyar.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,

  /**
   * Critical Institutional Escalation (Level 3)
   */
  criticalEscalation: (data: BreachData): string => `
🚨 CRITICAL INSTITUTIONAL ESCALATION

This is an urgent notification from the IVYAR Protection from Delays module.

A workers' compensation claim has reached CRITICAL escalation status due to unresolved SLA breaches exceeding 72 hours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESCALATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Claim ID: ${data.externalClaimId}
- Responsible Party: ${data.actorName}
- Total Delay: ${data.delayDays} days
- Escalation Level: 3 (CRITICAL)
- Status: CASE REVIEW REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMMEDIATE ACTIONS REQUIRED:
1. Review case status immediately
2. Identify root cause of delay
3. Implement corrective measures
4. Document resolution steps

This escalation has been recorded and may be included in:
- Regulatory compliance reports
- Behavior analysis reports
- Legal proceedings documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IVYAR Platform
Institutional Transparency & Legal Integrity
Lake Stevens, Washington, USA
www.ivyar.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
};

export default emailTemplates;