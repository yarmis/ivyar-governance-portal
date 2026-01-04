import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'emit':
        return NextResponse.json({ success: true, ...emitSignal(body) });
      case 'subscribe':
        return NextResponse.json({ success: true, ...subscribeToSignals(body) });
      case 'list':
        return NextResponse.json({ success: true, ...listSignals(body) });
      case 'acknowledge':
        return NextResponse.json({ success: true, ...acknowledgeSignal(body) });
      case 'escalate':
        return NextResponse.json({ success: true, ...escalateSignal(body) });
      case 'automate':
        return NextResponse.json({ success: true, ...configureAutomation(body) });
      case 'dashboard':
        return NextResponse.json({ success: true, ...getSignalDashboard(body) });
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function emitSignal(body: any): any {
  const { type, severity, source, module, data, autoRespond = true } = body;
  const signalId = `SIG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  const signal = {
    signalId,
    type,
    severity,
    source,
    module,
    data,
    timestamp,
    status: 'active',
    ttl: getTTL(severity),
    expiresAt: new Date(Date.now() + getTTL(severity)).toISOString()
  };

  // Auto-response logic
  let autoResponse = null;
  if (autoRespond) {
    autoResponse = generateAutoResponse(signal);
  }

  // Determine notifications
  const notifications = generateNotifications(signal);

  // Check automation rules
  const automationTriggered = checkAutomationRules(signal);

  return {
    signal,
    autoResponse,
    notifications,
    automationTriggered,
    broadcast: {
      channels: getChannels(severity),
      recipients: getRecipients(severity, module)
    }
  };
}

function getTTL(severity: string): number {
  const ttls: Record<string, number> = {
    critical: 3600000,    // 1 hour
    high: 14400000,       // 4 hours
    medium: 86400000,     // 24 hours
    low: 604800000        // 7 days
  };
  return ttls[severity] || 86400000;
}

function generateAutoResponse(signal: any): any {
  const responses: Record<string, any> = {
    'boundary-violation': {
      action: 'block',
      message: 'Transaction blocked due to boundary violation',
      requiresHumanReview: signal.severity === 'critical',
      autoActions: ['freeze-transaction', 'notify-compliance', 'log-incident']
    },
    'risk-threshold': {
      action: 'escalate',
      message: 'Risk threshold exceeded - escalating for review',
      requiresHumanReview: true,
      autoActions: ['pause-processing', 'gather-context', 'prepare-report']
    },
    'policy-breach': {
      action: 'flag',
      message: 'Policy breach detected - flagged for review',
      requiresHumanReview: signal.severity !== 'low',
      autoActions: ['document-breach', 'notify-manager', 'schedule-review']
    },
    'anomaly-detected': {
      action: 'investigate',
      message: 'Anomaly detected - initiating investigation',
      requiresHumanReview: true,
      autoActions: ['collect-data', 'compare-patterns', 'alert-security']
    },
    'compliance-alert': {
      action: 'review',
      message: 'Compliance issue identified - review required',
      requiresHumanReview: true,
      autoActions: ['halt-if-critical', 'document-issue', 'notify-compliance-team']
    },
    'ethics-concern': {
      action: 'pause',
      message: 'Ethics concern raised - pausing for evaluation',
      requiresHumanReview: true,
      autoActions: ['pause-activity', 'notify-ethics-committee', 'prepare-assessment']
    }
  };

  return responses[signal.type] || {
    action: 'log',
    message: 'Signal logged for review',
    requiresHumanReview: false,
    autoActions: ['log-signal']
  };
}

function generateNotifications(signal: any): any[] {
  const notifications = [];

  if (signal.severity === 'critical') {
    notifications.push(
      { channel: 'sms', recipients: ['executive-team'], priority: 'immediate' },
      { channel: 'email', recipients: ['board', 'compliance'], priority: 'immediate' },
      { channel: 'slack', recipients: ['#critical-alerts'], priority: 'immediate' },
      { channel: 'webhook', url: '/api/webhooks/critical', priority: 'immediate' }
    );
  } else if (signal.severity === 'high') {
    notifications.push(
      { channel: 'email', recipients: ['senior-management', 'compliance'], priority: 'high' },
      { channel: 'slack', recipients: ['#governance-alerts'], priority: 'high' }
    );
  } else if (signal.severity === 'medium') {
    notifications.push(
      { channel: 'email', recipients: ['department-heads'], priority: 'normal' },
      { channel: 'system', recipients: ['dashboard'], priority: 'normal' }
    );
  } else {
    notifications.push(
      { channel: 'system', recipients: ['dashboard'], priority: 'low' }
    );
  }

  return notifications;
}

function getChannels(severity: string): string[] {
  const channels: Record<string, string[]> = {
    critical: ['sms', 'email', 'slack', 'webhook', 'dashboard', 'pager'],
    high: ['email', 'slack', 'webhook', 'dashboard'],
    medium: ['email', 'dashboard'],
    low: ['dashboard']
  };
  return channels[severity] || ['dashboard'];
}

function getRecipients(severity: string, module: string): string[] {
  const base = [`${module}-team`];
  if (severity === 'critical') return [...base, 'executive-team', 'board', 'compliance-officer'];
  if (severity === 'high') return [...base, 'senior-management', 'compliance'];
  if (severity === 'medium') return [...base, 'department-head'];
  return base;
}

function checkAutomationRules(signal: any): any[] {
  const triggered = [];

  // Rule 1: Auto-block sanctions
  if (signal.type === 'boundary-violation' && signal.data?.boundary === 'sanctions') {
    triggered.push({
      ruleId: 'AUTO-001',
      name: 'Auto-block Sanctions Violation',
      action: 'block-transaction',
      executed: true,
      timestamp: new Date().toISOString()
    });
  }

  // Rule 2: Auto-escalate high-value
  if (signal.data?.amount > 500000 && signal.severity === 'high') {
    triggered.push({
      ruleId: 'AUTO-002',
      name: 'Auto-escalate High Value',
      action: 'escalate-to-board',
      executed: true,
      timestamp: new Date().toISOString()
    });
  }

  // Rule 3: Auto-freeze on fraud signal
  if (signal.type === 'anomaly-detected' && signal.data?.category === 'fraud') {
    triggered.push({
      ruleId: 'AUTO-003',
      name: 'Auto-freeze Fraud Detection',
      action: 'freeze-account',
      executed: true,
      timestamp: new Date().toISOString()
    });
  }

  return triggered;
}

function subscribeToSignals(body: any): any {
  const { subscriberId, filters, webhookUrl, channels } = body;
  const subscriptionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  return {
    subscriptionId,
    subscriberId,
    status: 'active',
    createdAt: new Date().toISOString(),
    filters: filters || { severity: ['critical', 'high'], modules: 'all' },
    delivery: {
      webhookUrl,
      channels: channels || ['email', 'dashboard'],
      format: 'json'
    },
    rateLimit: { maxPerHour: 100, maxPerDay: 1000 }
  };
}

function listSignals(body: any): any {
  const { filters, page = 1, limit = 20 } = body;

  const signals = [
    {
      signalId: 'SIG-001',
      type: 'boundary-violation',
      severity: 'critical',
      module: 'procurement',
      message: 'Sanctions screening match detected',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'active',
      acknowledged: false
    },
    {
      signalId: 'SIG-002',
      type: 'risk-threshold',
      severity: 'high',
      module: 'finance',
      message: 'Risk score exceeded 80 for transaction',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'active',
      acknowledged: true,
      acknowledgedBy: 'user_fin_01'
    },
    {
      signalId: 'SIG-003',
      type: 'anomaly-detected',
      severity: 'high',
      module: 'procurement',
      message: 'Unusual transaction pattern detected',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'investigating',
      acknowledged: true
    },
    {
      signalId: 'SIG-004',
      type: 'policy-breach',
      severity: 'medium',
      module: 'hr',
      message: 'Travel policy exception without approval',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'resolved',
      acknowledged: true
    },
    {
      signalId: 'SIG-005',
      type: 'compliance-alert',
      severity: 'medium',
      module: 'donor',
      message: 'Donor reporting deadline approaching',
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      status: 'active',
      acknowledged: false
    },
    {
      signalId: 'SIG-006',
      type: 'ethics-concern',
      severity: 'high',
      module: 'field',
      message: 'Beneficiary complaint escalated',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      status: 'investigating',
      acknowledged: true
    }
  ];

  return {
    signals,
    pagination: { page, limit, total: signals.length, pages: 1 },
    summary: {
      total: signals.length,
      bySeverity: {
        critical: signals.filter(s => s.severity === 'critical').length,
        high: signals.filter(s => s.severity === 'high').length,
        medium: signals.filter(s => s.severity === 'medium').length,
        low: signals.filter(s => s.severity === 'low').length
      },
      byStatus: {
        active: signals.filter(s => s.status === 'active').length,
        investigating: signals.filter(s => s.status === 'investigating').length,
        resolved: signals.filter(s => s.status === 'resolved').length
      },
      unacknowledged: signals.filter(s => !s.acknowledged).length
    }
  };
}

function acknowledgeSignal(body: any): any {
  const { signalId, userId, notes } = body;
  return {
    signalId,
    acknowledged: true,
    acknowledgedBy: userId,
    acknowledgedAt: new Date().toISOString(),
    notes,
    nextSteps: ['Review signal details', 'Take appropriate action', 'Update status when resolved']
  };
}

function escalateSignal(body: any): any {
  const { signalId, escalateTo, reason, urgency } = body;
  return {
    signalId,
    escalated: true,
    escalatedTo: escalateTo,
    escalatedAt: new Date().toISOString(),
    reason,
    urgency,
    expectedResponse: urgency === 'immediate' ? '1 hour' : urgency === 'high' ? '4 hours' : '24 hours',
    escalationChain: ['Department Head', 'Senior Management', 'Executive Team', 'Board']
  };
}

function configureAutomation(body: any): any {
  const { rules } = body;

  const defaultRules = [
    {
      ruleId: 'AUTO-001',
      name: 'Block Sanctions Violations',
      trigger: { type: 'boundary-violation', condition: 'boundary === sanctions' },
      action: 'block-transaction',
      enabled: true,
      priority: 1
    },
    {
      ruleId: 'AUTO-002',
      name: 'Escalate High-Value Risks',
      trigger: { type: 'risk-threshold', condition: 'amount > 500000 && severity === high' },
      action: 'escalate-to-board',
      enabled: true,
      priority: 2
    },
    {
      ruleId: 'AUTO-003',
      name: 'Freeze on Fraud Detection',
      trigger: { type: 'anomaly-detected', condition: 'category === fraud' },
      action: 'freeze-account',
      enabled: true,
      priority: 1
    },
    {
      ruleId: 'AUTO-004',
      name: 'Alert Compliance Team',
      trigger: { type: 'compliance-alert', condition: 'severity >= medium' },
      action: 'notify-compliance',
      enabled: true,
      priority: 3
    },
    {
      ruleId: 'AUTO-005',
      name: 'Pause Ethics Concerns',
      trigger: { type: 'ethics-concern', condition: 'any' },
      action: 'pause-and-review',
      enabled: true,
      priority: 2
    }
  ];

  return {
    configured: true,
    timestamp: new Date().toISOString(),
    rules: rules || defaultRules,
    totalRules: (rules || defaultRules).length,
    enabledRules: (rules || defaultRules).filter((r: any) => r.enabled).length
  };
}

function getSignalDashboard(body: any): any {
  const { timeframe = '24h' } = body;

  return {
    timeframe,
    generatedAt: new Date().toISOString(),
    realTimeMetrics: {
      activeSignals: 12,
      criticalActive: 1,
      highActive: 4,
      pendingAcknowledgment: 3,
      avgResponseTime: '23 minutes',
      automationRate: '67%'
    },
    signalTrend: [
      { hour: '00:00', count: 2, critical: 0, high: 1 },
      { hour: '04:00', count: 1, critical: 0, high: 0 },
      { hour: '08:00', count: 5, critical: 0, high: 2 },
      { hour: '12:00', count: 8, critical: 1, high: 3 },
      { hour: '16:00', count: 6, critical: 0, high: 2 },
      { hour: '20:00', count: 4, critical: 0, high: 1 }
    ],
    topSignalTypes: [
      { type: 'risk-threshold', count: 34, percentage: 28 },
      { type: 'policy-breach', count: 28, percentage: 23 },
      { type: 'anomaly-detected', count: 24, percentage: 20 },
      { type: 'compliance-alert', count: 18, percentage: 15 },
      { type: 'boundary-violation', count: 12, percentage: 10 },
      { type: 'ethics-concern', count: 5, percentage: 4 }
    ],
    moduleBreakdown: [
      { module: 'procurement', signals: 42, critical: 2, resolved: 38 },
      { module: 'finance', signals: 35, critical: 3, resolved: 30 },
      { module: 'logistics', signals: 23, critical: 0, resolved: 22 },
      { module: 'donor', signals: 12, critical: 1, resolved: 10 },
      { module: 'hr', signals: 8, critical: 0, resolved: 8 },
      { module: 'field', signals: 15, critical: 1, resolved: 12 }
    ],
    automationStats: {
      totalTriggered: 89,
      successfulActions: 85,
      failedActions: 4,
      manualOverrides: 7,
      topRules: [
        { ruleId: 'AUTO-004', name: 'Alert Compliance Team', triggered: 34 },
        { ruleId: 'AUTO-002', name: 'Escalate High-Value', triggered: 28 },
        { ruleId: 'AUTO-001', name: 'Block Sanctions', triggered: 12 }
      ]
    },
    responseMetrics: {
      avgAcknowledgeTime: '12 minutes',
      avgResolutionTime: '4.2 hours',
      slaCompliance: 94.5,
      escalationRate: 18
    }
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Autonomous Signals',
    version: '2.1',
    actions: ['emit', 'subscribe', 'list', 'acknowledge', 'escalate', 'automate', 'dashboard'],
    signalTypes: ['boundary-violation', 'risk-threshold', 'policy-breach', 'anomaly-detected', 'compliance-alert', 'ethics-concern'],
    severityLevels: ['critical', 'high', 'medium', 'low']
  });
}