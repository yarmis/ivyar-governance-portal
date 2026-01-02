/**
 * IVYAR Login Audit System
 * Institutional-grade access logging
 */

export interface LoginAuditEntry {
  id: string;
  userId: string | null;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface SecurityAlert {
  id: string;
  type: 'FAILED_LOGIN_BURST' | 'NEW_ADMIN_IP' | 'MULTI_ACCOUNT_IP' | 'GEO_ANOMALY';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  email: string | null;
  userId: string | null;
  ipAddress: string;
  details: Record<string, any>;
  status: 'Open' | 'Acknowledged' | 'Closed';
  createdAt: Date;
}

// In-memory stores (replace with PostgreSQL in production)
const loginAudit: LoginAuditEntry[] = [];
const securityAlerts: SecurityAlert[] = [];

// Track failed attempts for burst detection
const failedAttempts: Map<string, { count: number; firstAttempt: Date }> = new Map();

/**
 * Log a login attempt
 */
export function logLoginAttempt(params: {
  userId?: string;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
}): LoginAuditEntry {
  const entry: LoginAuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: params.userId || null,
    email: params.email,
    success: params.success,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    createdAt: new Date(),
  };

  loginAudit.push(entry);

  // Check for security alerts
  if (!params.success) {
    checkFailedLoginBurst(params.email, params.ipAddress);
  }

  return entry;
}

/**
 * Check for failed login burst (>5 attempts in 10 minutes)
 */
function checkFailedLoginBurst(email: string, ipAddress: string): void {
  const key = `${email}:${ipAddress}`;
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  const existing = failedAttempts.get(key);

  if (existing && existing.firstAttempt > tenMinutesAgo) {
    existing.count++;
    if (existing.count >= 5) {
      createSecurityAlert({
        type: 'FAILED_LOGIN_BURST',
        severity: existing.count >= 10 ? 'Critical' : 'High',
        email,
        ipAddress,
        details: { attemptCount: existing.count, windowMinutes: 10 },
      });
      failedAttempts.delete(key);
    }
  } else {
    failedAttempts.set(key, { count: 1, firstAttempt: now });
  }
}

/**
 * Create a security alert
 */
export function createSecurityAlert(params: {
  type: SecurityAlert['type'];
  severity: SecurityAlert['severity'];
  email?: string;
  userId?: string;
  ipAddress: string;
  details: Record<string, any>;
}): SecurityAlert {
  const alert: SecurityAlert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: params.type,
    severity: params.severity,
    email: params.email || null,
    userId: params.userId || null,
    ipAddress: params.ipAddress,
    details: params.details,
    status: 'Open',
    createdAt: new Date(),
  };

  securityAlerts.push(alert);
  console.log(`[SECURITY ALERT] ${alert.type} - ${alert.severity} - ${alert.ipAddress}`);

  return alert;
}

/**
 * Get login audit entries with filters
 */
export function getLoginAudit(filters?: {
  email?: string;
  success?: boolean;
  from?: Date;
  to?: Date;
  limit?: number;
}): LoginAuditEntry[] {
  let result = [...loginAudit];

  if (filters?.email) {
    result = result.filter((e) => e.email.toLowerCase().includes(filters.email!.toLowerCase()));
  }
  if (filters?.success !== undefined) {
    result = result.filter((e) => e.success === filters.success);
  }
  if (filters?.from) {
    result = result.filter((e) => e.createdAt >= filters.from!);
  }
  if (filters?.to) {
    result = result.filter((e) => e.createdAt <= filters.to!);
  }

  result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (filters?.limit) {
    result = result.slice(0, filters.limit);
  }

  return result;
}

/**
 * Get security alerts with filters
 */
export function getSecurityAlerts(filters?: {
  type?: SecurityAlert['type'];
  severity?: SecurityAlert['severity'];
  status?: SecurityAlert['status'];
  limit?: number;
}): SecurityAlert[] {
  let result = [...securityAlerts];

  if (filters?.type) {
    result = result.filter((a) => a.type === filters.type);
  }
  if (filters?.severity) {
    result = result.filter((a) => a.severity === filters.severity);
  }
  if (filters?.status) {
    result = result.filter((a) => a.status === filters.status);
  }

  result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (filters?.limit) {
    result = result.slice(0, filters.limit);
  }

  return result;
}

/**
 * Get security statistics
 */
export function getSecurityStats(): {
  totalLogins: number;
  failedLogins: number;
  openAlerts: number;
  criticalAlerts: number;
} {
  return {
    totalLogins: loginAudit.length,
    failedLogins: loginAudit.filter((e) => !e.success).length,
    openAlerts: securityAlerts.filter((a) => a.status === 'Open').length,
    criticalAlerts: securityAlerts.filter((a) => a.severity === 'Critical' && a.status === 'Open').length,
  };
}

/**
 * Update alert status
 */
export function updateAlertStatus(alertId: string, status: SecurityAlert['status']): SecurityAlert | null {
  const alert = securityAlerts.find((a) => a.id === alertId);
  if (alert) {
    alert.status = status;
  }
  return alert || null;
}

export default {
  logLogin: logLoginAttempt,
  createAlert: createSecurityAlert,
  getAudit: getLoginAudit,
  getAlerts: getSecurityAlerts,
  getStats: getSecurityStats,
  updateAlertStatus,
};