import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, timeframe = '30d', filters = {} } = await request.json();

    if (action === 'user-activity') {
      return NextResponse.json({ success: true, ...getUserActivity(timeframe, filters) });
    }
    if (action === 'decision-patterns') {
      return NextResponse.json({ success: true, ...getDecisionPatterns(timeframe, filters) });
    }
    if (action === 'engagement-metrics') {
      return NextResponse.json({ success: true, ...getEngagementMetrics(timeframe, filters) });
    }
    if (action === 'anomalies') {
      return NextResponse.json({ success: true, ...detectAnomalies(timeframe, filters) });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getUserActivity(timeframe: string, filters: any) {
  const days = parseInt(timeframe) || 30;
  
  // Simulated analytics data
  const dailyActive = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 86400000).toISOString().split('T')[0],
    users: Math.floor(150 + Math.random() * 100),
    sessions: Math.floor(300 + Math.random() * 200),
    decisions: Math.floor(50 + Math.random() * 80)
  }));

  const totalUsers = dailyActive.reduce((sum, d) => sum + d.users, 0);
  const totalSessions = dailyActive.reduce((sum, d) => sum + d.sessions, 0);
  const totalDecisions = dailyActive.reduce((sum, d) => sum + d.decisions, 0);

  return {
    timeframe,
    summary: {
      totalUsers: Math.floor(totalUsers / days),
      totalSessions,
      totalDecisions,
      avgSessionDuration: '12m 34s',
      avgDecisionsPerUser: (totalDecisions / totalUsers * days).toFixed(1),
      returnRate: '67%'
    },
    dailyActive,
    userSegments: [
      { segment: 'Program Managers', count: 234, percentage: 35, avgDecisions: 8.2 },
      { segment: 'Finance Officers', count: 187, percentage: 28, avgDecisions: 12.5 },
      { segment: 'Field Staff', count: 156, percentage: 23, avgDecisions: 4.1 },
      { segment: 'Auditors', count: 67, percentage: 10, avgDecisions: 15.8 },
      { segment: 'Executives', count: 27, percentage: 4, avgDecisions: 3.2 }
    ],
    peakHours: [
      { hour: '09:00', activity: 85 },
      { hour: '10:00', activity: 95 },
      { hour: '11:00', activity: 100 },
      { hour: '14:00', activity: 90 },
      { hour: '15:00', activity: 88 },
      { hour: '16:00', activity: 75 }
    ],
    topModules: [
      { module: 'Decision Tree', usage: 340, percentage: 28 },
      { module: 'Risk Engine', usage: 285, percentage: 23 },
      { module: 'AI Advisor', usage: 245, percentage: 20 },
      { module: 'Boundaries', usage: 198, percentage: 16 },
      { module: 'Certification', usage: 156, percentage: 13 }
    ]
  };
}

function getDecisionPatterns(timeframe: string, filters: any) {
  return {
    timeframe,
    totalDecisions: 2847,
    patterns: [
      {
        id: 'P-001',
        name: 'Expedited Emergency Approvals',
        frequency: 156,
        trend: 'increasing',
        trendValue: '+23%',
        riskLevel: 'medium',
        description: 'High volume of emergency funding approvals bypassing standard review',
        affectedAreas: ['Procurement', 'Finance'],
        recommendation: 'Implement post-hoc review protocol for emergency decisions'
      },
      {
        id: 'P-002',
        name: 'Threshold Splitting',
        frequency: 43,
        trend: 'stable',
        trendValue: '+2%',
        riskLevel: 'high',
        description: 'Multiple transactions just below approval thresholds',
        affectedAreas: ['Procurement', 'Logistics'],
        recommendation: 'Review threshold policies and implement aggregate monitoring'
      },
      {
        id: 'P-003',
        name: 'Single-Source Preference',
        frequency: 87,
        trend: 'decreasing',
        trendValue: '-15%',
        riskLevel: 'medium',
        description: 'Repeated selection of same vendors without competitive process',
        affectedAreas: ['Procurement'],
        recommendation: 'Enforce vendor rotation and competitive bidding requirements'
      },
      {
        id: 'P-004',
        name: 'Late Documentation',
        frequency: 234,
        trend: 'increasing',
        trendValue: '+31%',
        riskLevel: 'low',
        description: 'Documentation submitted after decision implementation',
        affectedAreas: ['All Departments'],
        recommendation: 'Strengthen pre-decision documentation requirements'
      },
      {
        id: 'P-005',
        name: 'Governance Bypass',
        frequency: 12,
        trend: 'stable',
        trendValue: '0%',
        riskLevel: 'critical',
        description: 'Decisions made without required governance approval',
        affectedAreas: ['Senior Management'],
        recommendation: 'Implement mandatory governance checkpoints in workflow'
      }
    ],
    decisionTypes: [
      { type: 'Procurement', count: 876, approved: 812, rejected: 64, avgTime: '2.3 days' },
      { type: 'Partner Approval', count: 234, approved: 198, rejected: 36, avgTime: '5.1 days' },
      { type: 'Budget Reallocation', count: 567, approved: 534, rejected: 33, avgTime: '1.8 days' },
      { type: 'Emergency Response', count: 189, approved: 187, rejected: 2, avgTime: '0.4 days' },
      { type: 'Policy Exception', count: 98, approved: 67, rejected: 31, avgTime: '4.2 days' }
    ],
    approvalRates: {
      overall: 92.3,
      byRiskLevel: [
        { level: 'Low', rate: 98.5 },
        { level: 'Medium', rate: 94.2 },
        { level: 'High', rate: 82.1 },
        { level: 'Critical', rate: 61.3 }
      ]
    }
  };
}

function getEngagementMetrics(timeframe: string, filters: any) {
  return {
    timeframe,
    overallEngagement: 78,
    metrics: {
      moduleCompletion: 73,
      certificationProgress: 45,
      trainingEngagement: 82,
      documentationReview: 68,
      feedbackSubmission: 34
    },
    learningProgress: [
      { module: 'Core Principles', completed: 456, inProgress: 123, notStarted: 92, avgScore: 84 },
      { module: 'Governance', completed: 389, inProgress: 156, notStarted: 126, avgScore: 79 },
      { module: 'Risk Management', completed: 312, inProgress: 187, notStarted: 172, avgScore: 76 },
      { module: 'Ethics', completed: 278, inProgress: 145, notStarted: 248, avgScore: 88 },
      { module: 'Certification', completed: 145, inProgress: 89, notStarted: 437, avgScore: 82 }
    ],
    certifications: {
      practitioner: { issued: 145, pending: 67, expired: 23 },
      specialist: { issued: 45, pending: 34, expired: 8 },
      trainer: { issued: 12, pending: 8, expired: 2 }
    },
    feedbackSummary: {
      totalFeedback: 567,
      positive: 78,
      neutral: 15,
      negative: 7,
      topIssues: ['Complex navigation', 'Slow loading', 'Need more examples'],
      topPraises: ['Comprehensive content', 'Useful simulations', 'Clear guidance']
    }
  };
}

function detectAnomalies(timeframe: string, filters: any) {
  return {
    timeframe,
    totalAnomalies: 23,
    criticalAnomalies: 3,
    anomalies: [
      {
        id: 'A-001',
        type: 'Volume Spike',
        severity: 'high',
        detected: new Date(Date.now() - 86400000).toISOString(),
        description: '300% increase in procurement approvals from single user',
        affectedUser: 'user_pm_045',
        affectedModule: 'Procurement',
        status: 'investigating',
        recommendation: 'Review user activity and verify legitimacy'
      },
      {
        id: 'A-002',
        type: 'Access Pattern',
        severity: 'critical',
        detected: new Date(Date.now() - 172800000).toISOString(),
        description: 'Multiple failed login attempts followed by successful access from new location',
        affectedUser: 'user_fin_012',
        affectedModule: 'Finance',
        status: 'resolved',
        recommendation: 'Verify user identity and enable MFA'
      },
      {
        id: 'A-003',
        type: 'Data Export',
        severity: 'medium',
        detected: new Date(Date.now() - 259200000).toISOString(),
        description: 'Unusual volume of beneficiary data exports',
        affectedUser: 'user_field_089',
        affectedModule: 'Beneficiary Management',
        status: 'monitoring',
        recommendation: 'Review data access policies'
      },
      {
        id: 'A-004',
        type: 'Decision Reversal',
        severity: 'low',
        detected: new Date(Date.now() - 345600000).toISOString(),
        description: 'Multiple approved decisions reversed within 24 hours',
        affectedUser: 'user_mgr_023',
        affectedModule: 'Governance',
        status: 'closed',
        recommendation: 'No action needed - legitimate corrections'
      }
    ],
    anomalyTrends: [
      { week: 'W-4', count: 8 },
      { week: 'W-3', count: 5 },
      { week: 'W-2', count: 6 },
      { week: 'W-1', count: 4 }
    ]
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Behavior Analytics',
    version: '1.6',
    actions: ['user-activity', 'decision-patterns', 'engagement-metrics', 'anomalies'],
    description: 'User behavior analysis and pattern detection'
  });
}