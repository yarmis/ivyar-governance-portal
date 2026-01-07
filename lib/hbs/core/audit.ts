// lib/hbs/core/audit.ts
// HBS Governance Core - Centralized Audit Engine v1.0

// ============================================================================
// TYPES
// ============================================================================

export type AuditAction = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'login' | 'logout' | 'mfa_enable' | 'mfa_disable'
  | 'role_assign' | 'role_revoke' | 'permission_grant' | 'permission_revoke'
  | 'policy_create' | 'policy_update' | 'policy_delete' | 'policy_activate'
  | 'decision' | 'escalation' | 'approval' | 'rejection'
  | 'boundary_violation' | 'risk_assessment'
  | 'export' | 'import' | 'archive'
  | 'system_event' | 'error' | 'warning';

export type AuditResult = 'success' | 'failure' | 'denied' | 'pending' | 'partial';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  module: string;
  actorId: string;
  actorRole: string;
  actorIp?: string;
  actorUserAgent?: string;
  action: AuditAction;
  target: string;
  targetType: string;
  targetId?: string;
  result: AuditResult;
  severity: AuditSeverity;
  details?: string;
  metadata?: Record<string, any>;
  previousState?: any;
  newState?: any;
  duration?: number;
  correlationId?: string;
  sessionId?: string;
}

export interface AuditFilter {
  tenantId?: string;
  module?: string;
  actorId?: string;
  actorRole?: string;
  action?: AuditAction | AuditAction[];
  targetType?: string;
  result?: AuditResult;
  severity?: AuditSeverity | AuditSeverity[];
  from?: string;
  to?: string;
  correlationId?: string;
  search?: string;
}

export interface AuditStats {
  totalEntries: number;
  byAction: Record<string, number>;
  byResult: Record<string, number>;
  bySeverity: Record<string, number>;
  byModule: Record<string, number>;
  byActor: { actorId: string; count: number }[];
  timeline: { period: string; count: number; errors: number }[];
}

export interface AuditExport {
  format: 'json' | 'csv' | 'pdf';
  filters: AuditFilter;
  exportedAt: string;
  exportedBy: string;
  entryCount: number;
  data: AuditEntry[] | string;
}

// ============================================================================
// CORE ENGINE
// ============================================================================

export class AuditEngine {
  private entries: AuditEntry[] = [];
  private maxEntries: number = 100000;
  private listeners: ((entry: AuditEntry) => void)[] = [];

  // Log an audit entry
  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
    const fullEntry: AuditEntry = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.entries.push(fullEntry);

    // Trim if exceeds max
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(fullEntry));

    return fullEntry;
  }

  // Log with convenience methods
  logInfo(tenantId: string, module: string, actor: { id: string; role: string }, action: AuditAction, target: string, targetType: string, details?: string): AuditEntry {
    return this.log({
      tenantId,
      module,
      actorId: actor.id,
      actorRole: actor.role,
      action,
      target,
      targetType,
      result: 'success',
      severity: 'info',
      details,
    });
  }

  logWarning(tenantId: string, module: string, actor: { id: string; role: string }, action: AuditAction, target: string, targetType: string, details?: string): AuditEntry {
    return this.log({
      tenantId,
      module,
      actorId: actor.id,
      actorRole: actor.role,
      action,
      target,
      targetType,
      result: 'success',
      severity: 'warning',
      details,
    });
  }

  logError(tenantId: string, module: string, actor: { id: string; role: string }, action: AuditAction, target: string, targetType: string, details?: string): AuditEntry {
    return this.log({
      tenantId,
      module,
      actorId: actor.id,
      actorRole: actor.role,
      action,
      target,
      targetType,
      result: 'failure',
      severity: 'error',
      details,
    });
  }

  logCritical(tenantId: string, module: string, actor: { id: string; role: string }, action: AuditAction, target: string, targetType: string, details?: string): AuditEntry {
    return this.log({
      tenantId,
      module,
      actorId: actor.id,
      actorRole: actor.role,
      action,
      target,
      targetType,
      result: 'failure',
      severity: 'critical',
      details,
    });
  }

  // Query entries
  query(filters: AuditFilter, options?: { page?: number; limit?: number; sort?: 'asc' | 'desc' }): { entries: AuditEntry[]; total: number; page: number; pages: number } {
    let results = [...this.entries];

    // Apply filters
    if (filters.tenantId) results = results.filter(e => e.tenantId === filters.tenantId);
    if (filters.module) results = results.filter(e => e.module === filters.module);
    if (filters.actorId) results = results.filter(e => e.actorId === filters.actorId);
    if (filters.actorRole) results = results.filter(e => e.actorRole === filters.actorRole);
    if (filters.targetType) results = results.filter(e => e.targetType === filters.targetType);
    if (filters.result) results = results.filter(e => e.result === filters.result);
    if (filters.correlationId) results = results.filter(e => e.correlationId === filters.correlationId);

    if (filters.action) {
      const actions = Array.isArray(filters.action) ? filters.action : [filters.action];
      results = results.filter(e => actions.includes(e.action));
    }

    if (filters.severity) {
      const severities = Array.isArray(filters.severity) ? filters.severity : [filters.severity];
      results = results.filter(e => severities.includes(e.severity));
    }

    if (filters.from) results = results.filter(e => e.timestamp >= filters.from!);
    if (filters.to) results = results.filter(e => e.timestamp <= filters.to!);

    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(e => 
        e.target.toLowerCase().includes(search) ||
        e.actorId.toLowerCase().includes(search) ||
        e.details?.toLowerCase().includes(search)
      );
    }

    // Sort
    results = results.sort((a, b) => {
      const cmp = a.timestamp.localeCompare(b.timestamp);
      return options?.sort === 'asc' ? cmp : -cmp;
    });

    // Paginate
    const page = options?.page || 1;
    const limit = options?.limit || 100;
    const total = results.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    results = results.slice(start, start + limit);

    return { entries: results, total, page, pages };
  }

  // Get entry by ID
  getEntry(id: string): AuditEntry | undefined {
    return this.entries.find(e => e.id === id);
  }

  // Get statistics
  getStats(filters?: AuditFilter): AuditStats {
    let results = filters ? this.query(filters, { limit: this.maxEntries }).entries : [...this.entries];

    const byAction: Record<string, number> = {};
    const byResult: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    const byModule: Record<string, number> = {};
    const actorCounts: Map<string, number> = new Map();
    const timelineCounts: Map<string, { count: number; errors: number }> = new Map();

    for (const entry of results) {
      byAction[entry.action] = (byAction[entry.action] || 0) + 1;
      byResult[entry.result] = (byResult[entry.result] || 0) + 1;
      bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
      byModule[entry.module] = (byModule[entry.module] || 0) + 1;
      actorCounts.set(entry.actorId, (actorCounts.get(entry.actorId) || 0) + 1);

      // Timeline (by day)
      const day = entry.timestamp.substring(0, 10);
      const dayStats = timelineCounts.get(day) || { count: 0, errors: 0 };
      dayStats.count++;
      if (entry.severity === 'error' || entry.severity === 'critical') {
        dayStats.errors++;
      }
      timelineCounts.set(day, dayStats);
    }

    const byActor = Array.from(actorCounts.entries())
      .map(([actorId, count]) => ({ actorId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const timeline = Array.from(timelineCounts.entries())
      .map(([period, stats]) => ({ period, ...stats }))
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-30);

    return {
      totalEntries: results.length,
      byAction,
      byResult,
      bySeverity,
      byModule,
      byActor,
      timeline,
    };
  }

  // Export audit log
  export(filters: AuditFilter, format: 'json' | 'csv' | 'pdf', exportedBy: string): AuditExport {
    const { entries } = this.query(filters, { limit: this.maxEntries });

    let data: AuditEntry[] | string = entries;

    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'tenantId', 'module', 'actorId', 'actorRole', 'action', 'target', 'targetType', 'result', 'severity', 'details'];
      const rows = entries.map(e => headers.map(h => JSON.stringify((e as any)[h] || '')).join(','));
      data = [headers.join(','), ...rows].join('\n');
    }

    return {
      format,
      filters,
      exportedAt: new Date().toISOString(),
      exportedBy,
      entryCount: entries.length,
      data,
    };
  }

  // Subscribe to audit events
  subscribe(listener: (entry: AuditEntry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get recent activity for dashboard
  getRecentActivity(tenantId?: string, limit: number = 20): AuditEntry[] {
    let results = tenantId 
      ? this.entries.filter(e => e.tenantId === tenantId)
      : [...this.entries];

    return results
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, limit);
  }

  // Get security events
  getSecurityEvents(tenantId?: string, hours: number = 24): AuditEntry[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    return this.entries.filter(e => 
      (!tenantId || e.tenantId === tenantId) &&
      e.timestamp >= cutoff &&
      (
        e.action === 'login' ||
        e.action === 'logout' ||
        e.action === 'role_assign' ||
        e.action === 'role_revoke' ||
        e.action === 'boundary_violation' ||
        e.result === 'denied' ||
        e.severity === 'critical' ||
        e.severity === 'error'
      )
    ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // Archive old entries (would typically move to cold storage)
  archive(beforeDate: string): { archived: number; remaining: number } {
    const toArchive = this.entries.filter(e => e.timestamp < beforeDate);
    this.entries = this.entries.filter(e => e.timestamp >= beforeDate);

    // In production, would write toArchive to cold storage

    return {
      archived: toArchive.length,
      remaining: this.entries.length,
    };
  }

  // Clear all entries (for testing)
  clear(): void {
    this.entries = [];
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const auditEngine = new AuditEngine();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function createCorrelationId(): string {
  return `COR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function logWithCorrelation(
  correlationId: string,
  ...entries: Omit<AuditEntry, 'id' | 'timestamp' | 'correlationId'>[]
): AuditEntry[] {
  return entries.map(entry => 
    auditEngine.log({ ...entry, correlationId })
  );
}
