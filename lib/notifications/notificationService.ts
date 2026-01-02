/**
 * IVYAR Notification Service
 * Institutional-grade notification system with legal integrity
 */

export type NotificationChannel = 'email' | 'sms' | 'portal';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface NotificationPayload {
  claimId: string;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  message: string;
  priority: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface NotificationRecord {
  id: string;
  claimId: string;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  message: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  createdAt: Date;
}

// In-memory store (replace with database in production)
const notifications: NotificationRecord[] = [];

/**
 * Create and send notification
 */
export async function sendNotification(payload: NotificationPayload): Promise<NotificationRecord> {
  const record: NotificationRecord = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...payload,
    status: 'pending',
    createdAt: new Date(),
  };

  try {
    switch (payload.channel) {
      case 'email':
        await sendEmail(payload);
        break;
      case 'sms':
        await sendSMS(payload);
        break;
      case 'portal':
        // Portal notifications are instant
        break;
    }
    
    record.status = 'sent';
    record.sentAt = new Date();
  } catch (error: any) {
    record.status = 'failed';
    record.failedAt = new Date();
    record.failureReason = error.message;
  }

  notifications.push(record);
  return record;
}

/**
 * Send email via Resend/SendGrid
 */
async function sendEmail(payload: NotificationPayload): Promise<void> {
  // In production: use Resend or SendGrid
  console.log(`[EMAIL] To: ${payload.recipient}, Subject: ${payload.subject}`);
  
  // Simulated API call
  if (process.env.RESEND_API_KEY) {
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({...});
  }
}

/**
 * Send SMS via Twilio
 */
async function sendSMS(payload: NotificationPayload): Promise<void> {
  // In production: use Twilio
  console.log(`[SMS] To: ${payload.recipient}, Message: ${payload.message.substring(0, 50)}...`);
  
  if (process.env.TWILIO_SID) {
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await client.messages.create({...});
  }
}

/**
 * Get notifications with filters
 */
export function getNotifications(filters?: {
  claimId?: string;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  priority?: NotificationPriority;
}): NotificationRecord[] {
  let result = [...notifications];
  
  if (filters?.claimId) {
    result = result.filter(n => n.claimId === filters.claimId);
  }
  if (filters?.channel) {
    result = result.filter(n => n.channel === filters.channel);
  }
  if (filters?.status) {
    result = result.filter(n => n.status === filters.status);
  }
  if (filters?.priority) {
    result = result.filter(n => n.priority === filters.priority);
  }
  
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Update notification status (for webhooks)
 */
export function updateNotificationStatus(
  id: string,
  status: NotificationStatus,
  metadata?: { deliveredAt?: Date; failureReason?: string }
): NotificationRecord | null {
  const notification = notifications.find(n => n.id === id);
  if (!notification) return null;
  
  notification.status = status;
  if (metadata?.deliveredAt) notification.deliveredAt = metadata.deliveredAt;
  if (metadata?.failureReason) notification.failureReason = metadata.failureReason;
  
  return notification;
}

export default {
  send: sendNotification,
  getAll: getNotifications,
  updateStatus: updateNotificationStatus,
};