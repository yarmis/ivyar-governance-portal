/**
 * IVYAR SLA Breach Escalation Engine
 * 3-Level Institutional Escalation Workflow
 */

import { sendNotification, NotificationPriority } from './notificationService';
import { emailTemplates } from './emailTemplates';

export type EscalationLevel = 1 | 2 | 3;

export interface BreachEvent {
  id: string;
  claimId: string;
  externalClaimId: string;
  actorType: string;
  actorName: string;
  delayDays: number;
  severity: 'minor' | 'major' | 'critical';
  createdAt: Date;
  escalationLevel: EscalationLevel;
  escalatedAt?: Date;
  contacts: {
    workerEmail?: string;
    workerPhone?: string;
    attorneyEmail?: string;
    employerEmail?: string;
    tpaEmail?: string;
  };
}

/**
 * LEVEL 1: Automated Alerts (0-24 hours)
 * - Email to Attorney
 * - Portal notification to Client
 * - Optional SMS to Client
 */
export async function escalateLevel1(breach: BreachEvent): Promise<void> {
  console.log(`[ESCALATION] Level 1 for breach ${breach.id}`);

  // Email to Attorney
  if (breach.contacts.attorneyEmail) {
    await sendNotification({
      claimId: breach.claimId,
      channel: 'email',
      recipient: breach.contacts.attorneyEmail,
      subject: `SLA Breach Detected — Claim ${breach.externalClaimId}`,
      message: emailTemplates.breachAttorney(breach),
      priority: breach.severity === 'critical' ? 'critical' : 'high',
    });
  }

  // Portal notification to Client
  await sendNotification({
    claimId: breach.claimId,
    channel: 'portal',
    recipient: breach.contacts.workerEmail || 'client',
    subject: 'Delay Detected in Your Claim',
    message: `A ${breach.severity} delay of ${breach.delayDays} days has been detected. Responsible: ${breach.actorName}`,
    priority: 'normal',
  });

  // SMS for critical breaches
  if (breach.severity === 'critical' && breach.contacts.workerPhone) {
    await sendNotification({
      claimId: breach.claimId,
      channel: 'sms',
      recipient: breach.contacts.workerPhone,
      subject: 'IVYAR Alert',
      message: `IVYAR: Critical delay detected in your claim ${breach.externalClaimId}. Check portal for details.`,
      priority: 'critical',
    });
  }
}

/**
 * LEVEL 2: Operational Escalation (24-72 hours)
 * - Email to Employer
 * - Email to TPA Supervisor
 * - Timeline event: "Escalated"
 */
export async function escalateLevel2(breach: BreachEvent): Promise<void> {
  console.log(`[ESCALATION] Level 2 for breach ${breach.id}`);

  // Email to Employer
  if (breach.contacts.employerEmail) {
    await sendNotification({
      claimId: breach.claimId,
      channel: 'email',
      recipient: breach.contacts.employerEmail,
      subject: `SLA Breach Escalation — Claim ${breach.externalClaimId}`,
      message: emailTemplates.breachEmployer(breach),
      priority: 'high',
    });
  }

  // Email to TPA
  if (breach.contacts.tpaEmail) {
    await sendNotification({
      claimId: breach.claimId,
      channel: 'email',
      recipient: breach.contacts.tpaEmail,
      subject: `ESCALATION: SLA Breach Requires Attention — ${breach.externalClaimId}`,
      message: emailTemplates.breachTPA(breach),
      priority: 'high',
    });
  }
}

/**
 * LEVEL 3: Institutional Escalation (72+ hours)
 * - Critical Breach Report generated
 * - Email to ALL parties
 * - Severity upgraded to CRITICAL
 * - Workflow: "Case Review Required"
 */
export async function escalateLevel3(breach: BreachEvent): Promise<void> {
  console.log(`[ESCALATION] Level 3 (CRITICAL) for breach ${breach.id}`);

  const allRecipients = [
    breach.contacts.attorneyEmail,
    breach.contacts.employerEmail,
    breach.contacts.tpaEmail,
  ].filter(Boolean) as string[];

  for (const recipient of allRecipients) {
    await sendNotification({
      claimId: breach.claimId,
      channel: 'email',
      recipient,
      subject: `🚨 CRITICAL: Institutional Escalation — Claim ${breach.externalClaimId}`,
      message: emailTemplates.criticalEscalation(breach),
      priority: 'critical',
    });
  }

  // Portal notification
  await sendNotification({
    claimId: breach.claimId,
    channel: 'portal',
    recipient: 'all',
    subject: 'Case Review Required',
    message: `Critical institutional escalation triggered for claim ${breach.externalClaimId}. Immediate review required.`,
    priority: 'critical',
  });
}

/**
 * Main escalation processor
 */
export async function processEscalation(breach: BreachEvent): Promise<EscalationLevel> {
  const hoursElapsed = (Date.now() - breach.createdAt.getTime()) / (1000 * 60 * 60);

  if (hoursElapsed >= 72) {
    await escalateLevel3(breach);
    return 3;
  } else if (hoursElapsed >= 24) {
    await escalateLevel2(breach);
    return 2;
  } else {
    await escalateLevel1(breach);
    return 1;
  }
}

export default {
  level1: escalateLevel1,
  level2: escalateLevel2,
  level3: escalateLevel3,
  process: processEscalation,
};