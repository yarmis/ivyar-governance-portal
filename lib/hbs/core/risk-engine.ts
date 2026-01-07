// lib/hbs/core/risk-engine.ts
// HBS Governance Core - Universal Risk Engine v1.0

// ============================================================================
// TYPES
// ============================================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskCategory = 
  | 'operational'
  | 'financial'
  | 'compliance'
  | 'security'
  | 'reputational'
  | 'strategic'
  | 'ethical'
  | 'technical'
  | 'legal'
  | 'environmental';

export interface RiskFactor {
  id: string;
  name: string;
  category: RiskCategory;
  description: string;
  weight: number; // 0-1
  module: string | '*';
  scoreRange: { min: number; max: number };
  thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface RiskInput {
  factors: Record<string, number>;
  context?: Record<string, any>;
  module: string;
  tenantId: string;
}

export interface RiskResult {
  id: string;
  timestamp: string;
  tenantId: string;
  module: string;
  factors: Record<string, { score: number; level: RiskLevel; weight: number }>;
  composite: number;
  level: RiskLevel;
  alerts: string[];
  recommendations: string[];
  context?: Record<string, any>;
}

export interface RiskTrend {
  period: string;
  averageScore: number;
  level: RiskLevel;
  assessmentCount: number;
  criticalCount: number;
  highCount: number;
}

export interface RiskProfile {
  tenantId: string;
  module: string;
  currentScore: number;
  currentLevel: RiskLevel;
  trend: 'improving' | 'stable' | 'degrading';
  topRisks: { factor: string; score: number; level: RiskLevel }[];
  history: RiskTrend[];
  lastAssessment: string;
}

// ============================================================================
// CORE ENGINE
// ============================================================================

export class RiskEngine {
  private factors: Map<string, RiskFactor> = new Map();
  private results: RiskResult[] = [];
  private maxResults: number = 10000;

  // Register a risk factor
  registerFactor(factor: RiskFactor): void {
    this.factors.set(factor.id, factor);
  }

  // Get factor by ID
  getFactor(factorId: string): RiskFactor | undefined {
    return this.factors.get(factorId);
  }

  // Get factors by module
  getFactorsByModule(module: string): RiskFactor[] {
    return Array.from(this.factors.values()).filter(
      f => f.module === module || f.module === '*'
    );
  }

  // Get factors by category
  getFactorsByCategory(category: RiskCategory): RiskFactor[] {
    return Array.from(this.factors.values()).filter(f => f.category === category);
  }

  // Calculate risk score
  evaluate(input: RiskInput): RiskResult {
    const applicableFactors = this.getFactorsByModule(input.module);
    const factorResults: Record<string, { score: number; level: RiskLevel; weight: number }> = {};
    const alerts: string[] = [];
    const recommendations: string[] = [];

    let weightedSum = 0;
    let totalWeight = 0;

    for (const factor of applicableFactors) {
      const score = input.factors[factor.id];
      if (score === undefined) continue;

      // Normalize score to 0-10 range
      const normalizedScore = Math.max(0, Math.min(10, score));
      
      // Determine level
      let level: RiskLevel = 'low';
      if (normalizedScore >= factor.thresholds.critical) level = 'critical';
      else if (normalizedScore >= factor.thresholds.high) level = 'high';
      else if (normalizedScore >= factor.thresholds.medium) level = 'medium';

      factorResults[factor.id] = {
        score: normalizedScore,
        level,
        weight: factor.weight,
      };

      // Generate alerts for high/critical
      if (level === 'critical') {
        alerts.push(`CRITICAL: ${factor.name} score is ${normalizedScore}/10`);
        recommendations.push(this.getRecommendation(factor, 'critical'));
      } else if (level === 'high') {
        alerts.push(`HIGH RISK: ${factor.name} score is ${normalizedScore}/10`);
        recommendations.push(this.getRecommendation(factor, 'high'));
      }

      weightedSum += normalizedScore * factor.weight;
      totalWeight += factor.weight;
    }

    // Calculate composite score
    const composite = totalWeight > 0 
      ? Math.round((weightedSum / totalWeight) * 10) / 10
      : 0;

    // Determine overall level
    let level: RiskLevel = 'low';
    if (composite >= 7.5) level = 'critical';
    else if (composite >= 5) level = 'high';
    else if (composite >= 3) level = 'medium';

    // Add general recommendations based on level
    if (level === 'critical') {
      recommendations.unshift('Immediate escalation to leadership required');
      recommendations.push('Consider activating crisis management protocol');
    } else if (level === 'high') {
      recommendations.unshift('Senior management review recommended');
      recommendations.push('Implement additional controls and monitoring');
    } else if (level === 'medium') {
      recommendations.push('Schedule regular review of risk factors');
    }

    const result: RiskResult = {
      id: `RISK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      tenantId: input.tenantId,
      module: input.module,
      factors: factorResults,
      composite,
      level,
      alerts,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      context: input.context,
    };

    // Store result
    this.results.push(result);
    if (this.results.length > this.maxResults) {
      this.results = this.results.slice(-this.maxResults);
    }

    return result;
  }

  // Get recommendation based on factor and level
  private getRecommendation(factor: RiskFactor, level: RiskLevel): string {
    const recommendations: Record<RiskCategory, Record<string, string>> = {
      operational: {
        critical: 'Review and update operational procedures immediately',
        high: 'Conduct operational audit within 7 days',
      },
      financial: {
        critical: 'Engage finance committee for immediate review',
        high: 'Review financial controls and limits',
      },
      compliance: {
        critical: 'Notify compliance officer and legal immediately',
        high: 'Schedule compliance review within 48 hours',
      },
      security: {
        critical: 'Activate security incident response protocol',
        high: 'Review security controls and access permissions',
      },
      reputational: {
        critical: 'Prepare crisis communication plan',
        high: 'Monitor media and stakeholder sentiment',
      },
      strategic: {
        critical: 'Convene leadership for strategic review',
        high: 'Review strategic alignment and objectives',
      },
      ethical: {
        critical: 'Refer to ethics committee immediately',
        high: 'Document ethical considerations thoroughly',
      },
      technical: {
        critical: 'Engage technical leadership for immediate review',
        high: 'Conduct technical assessment and testing',
      },
      legal: {
        critical: 'Engage legal counsel immediately',
        high: 'Document all decisions and communications',
      },
      environmental: {
        critical: 'Notify environmental officer and authorities',
        high: 'Assess environmental impact and mitigation',
      },
    };

    return recommendations[factor.category]?.[level] || `Review ${factor.name} risk factors`;
  }

  // Get risk history
  getHistory(filters?: {
    tenantId?: string;
    module?: string;
    level?: RiskLevel;
    from?: string;
    to?: string;
    limit?: number;
  }): RiskResult[] {
    let results = [...this.results];

    if (filters?.tenantId) results = results.filter(r => r.tenantId === filters.tenantId);
    if (filters?.module) results = results.filter(r => r.module === filters.module);
    if (filters?.level) results = results.filter(r => r.level === filters.level);
    if (filters?.from) results = results.filter(r => r.timestamp >= filters.from!);
    if (filters?.to) results = results.filter(r => r.timestamp <= filters.to!);

    results = results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  // Get risk profile for tenant/module
  getRiskProfile(tenantId: string, module: string): RiskProfile {
    const history = this.getHistory({ tenantId, module, limit: 100 });
    
    const latest = history[0];
    const currentScore = latest?.composite || 0;
    const currentLevel = latest?.level || 'low';

    // Calculate trend
    const recentAvg = history.slice(0, 10).reduce((sum, r) => sum + r.composite, 0) / Math.min(10, history.length) || 0;
    const olderAvg = history.slice(10, 20).reduce((sum, r) => sum + r.composite, 0) / Math.min(10, history.length - 10) || 0;
    
    let trend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (recentAvg < olderAvg - 0.5) trend = 'improving';
    else if (recentAvg > olderAvg + 0.5) trend = 'degrading';

    // Get top risks from latest assessment
    const topRisks = latest 
      ? Object.entries(latest.factors)
          .map(([factor, data]) => ({ factor, ...data }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
      : [];

    // Calculate monthly trends
    const monthlyTrends: Map<string, RiskTrend> = new Map();
    for (const result of history) {
      const month = result.timestamp.substring(0, 7); // YYYY-MM
      const existing = monthlyTrends.get(month);
      if (existing) {
        existing.assessmentCount++;
        existing.averageScore = (existing.averageScore * (existing.assessmentCount - 1) + result.composite) / existing.assessmentCount;
        if (result.level === 'critical') existing.criticalCount++;
        if (result.level === 'high') existing.highCount++;
      } else {
        monthlyTrends.set(month, {
          period: month,
          averageScore: result.composite,
          level: result.level,
          assessmentCount: 1,
          criticalCount: result.level === 'critical' ? 1 : 0,
          highCount: result.level === 'high' ? 1 : 0,
        });
      }
    }

    return {
      tenantId,
      module,
      currentScore,
      currentLevel,
      trend,
      topRisks,
      history: Array.from(monthlyTrends.values()).slice(0, 12),
      lastAssessment: latest?.timestamp || 'Never',
    };
  }

  // Get statistics
  getStats(tenantId?: string): {
    totalFactors: number;
    totalAssessments: number;
    byLevel: Record<RiskLevel, number>;
    byModule: Record<string, number>;
    averageScore: number;
  } {
    const results = tenantId 
      ? this.results.filter(r => r.tenantId === tenantId)
      : this.results;

    const byLevel: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const byModule: Record<string, number> = {};
    let totalScore = 0;

    for (const result of results) {
      byLevel[result.level]++;
      byModule[result.module] = (byModule[result.module] || 0) + 1;
      totalScore += result.composite;
    }

    return {
      totalFactors: this.factors.size,
      totalAssessments: results.length,
      byLevel,
      byModule,
      averageScore: results.length > 0 ? Math.round((totalScore / results.length) * 10) / 10 : 0,
    };
  }
}

// ============================================================================
// DEFAULT FACTORS
// ============================================================================

export const DEFAULT_RISK_FACTORS: RiskFactor[] = [
  // Universal Factors
  {
    id: 'RF-OPS-001',
    name: 'Operational Complexity',
    category: 'operational',
    description: 'Complexity of operations and processes',
    weight: 0.15,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-FIN-001',
    name: 'Financial Impact',
    category: 'financial',
    description: 'Potential financial impact of decisions',
    weight: 0.15,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-CMP-001',
    name: 'Compliance Exposure',
    category: 'compliance',
    description: 'Regulatory and compliance risk exposure',
    weight: 0.15,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-SEC-001',
    name: 'Security Threat Level',
    category: 'security',
    description: 'Security and data protection risks',
    weight: 0.15,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-REP-001',
    name: 'Reputational Risk',
    category: 'reputational',
    description: 'Potential impact on organizational reputation',
    weight: 0.10,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-STR-001',
    name: 'Strategic Alignment',
    category: 'strategic',
    description: 'Alignment with strategic objectives',
    weight: 0.10,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-ETH-001',
    name: 'Ethical Considerations',
    category: 'ethical',
    description: 'Ethical implications and concerns',
    weight: 0.10,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  {
    id: 'RF-TEC-001',
    name: 'Technical Risk',
    category: 'technical',
    description: 'Technical complexity and failure risk',
    weight: 0.10,
    module: '*',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  // Health Module Specific
  {
    id: 'RF-HLT-001',
    name: 'Clinical Risk',
    category: 'operational',
    description: 'Patient safety and clinical outcome risk',
    weight: 0.25,
    module: 'health',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 2, medium: 4, high: 6, critical: 8 },
  },
  {
    id: 'RF-HLT-002',
    name: 'Communication Risk',
    category: 'ethical',
    description: 'Risk of miscommunication with patients',
    weight: 0.15,
    module: 'health',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 3, medium: 5, high: 7, critical: 9 },
  },
  // Access Module Specific
  {
    id: 'RF-ACC-001',
    name: 'Privilege Escalation Risk',
    category: 'security',
    description: 'Risk of unauthorized privilege escalation',
    weight: 0.20,
    module: 'access',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 2, medium: 4, high: 6, critical: 8 },
  },
  {
    id: 'RF-ACC-002',
    name: 'Data Leakage Risk',
    category: 'security',
    description: 'Risk of unauthorized data access or export',
    weight: 0.20,
    module: 'access',
    scoreRange: { min: 0, max: 10 },
    thresholds: { low: 2, medium: 4, high: 6, critical: 8 },
  },
];

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const riskEngine = new RiskEngine();

// Register default factors
DEFAULT_RISK_FACTORS.forEach(factor => riskEngine.registerFactor(factor));
