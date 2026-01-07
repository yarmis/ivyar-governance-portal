'use client';

/**
 * Construction Governance Hub - Dashboard Page
 * National Digital Module for Transparent, Safe, and Accountable Construction Governance
 * 
 * @module ConstructionGovernanceHubDashboard
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardMetrics {
  totalActiveProjects: number;
  highRiskProjects: number;
  pendingPermits: number;
  failedInspectionsLast30Days: number;
  approvedPermitsLast30Days: number;
  activeContractors: number;
  suspendedContractors: number;
  totalFinancialVolume: number;
  financialAnomaliesCount: number;
  averageRiskScore: number;
}

interface RegionalData {
  region: string;
  riskScore: number;
  projectCount: number;
  issueCount: number;
}

interface PermitPipeline {
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
}

interface RiskProject {
  id: string;
  name: string;
  riskScore: number;
  riskLevel: string;
  mainRiskFactor: string;
}

interface RecentInspection {
  id: string;
  projectName: string;
  type: string;
  status: string;
  inspector: string;
  date: string;
}

interface FinancialAnomaly {
  projectId: string;
  projectName: string;
  amount: number;
  anomalyScore: number;
  type: string;
  flaggedAt: string;
}

interface ContractorTrust {
  id: string;
  name: string;
  trustScore: number;
  projectsCount: number;
  violationsCount: number;
}

type ViewType = 'dashboard' | 'projects' | 'permits' | 'inspections' | 'contractors' | 'finance' | 'ai';

// ============================================================================
// MOCK DATA
// ============================================================================

const mockMetrics: DashboardMetrics = {
  totalActiveProjects: 1247,
  highRiskProjects: 89,
  pendingPermits: 342,
  failedInspectionsLast30Days: 23,
  approvedPermitsLast30Days: 156,
  activeContractors: 892,
  suspendedContractors: 47,
  totalFinancialVolume: 2850000000,
  financialAnomaliesCount: 12,
  averageRiskScore: 34
};

const mockRegionalData: RegionalData[] = [
  { region: 'Kyiv', riskScore: 42, projectCount: 245, issueCount: 18 },
  { region: 'Lviv', riskScore: 28, projectCount: 123, issueCount: 7 },
  { region: 'Odesa', riskScore: 51, projectCount: 156, issueCount: 24 },
  { region: 'Kharkiv', riskScore: 38, projectCount: 98, issueCount: 11 },
  { region: 'Dnipro', riskScore: 45, projectCount: 187, issueCount: 19 },
  { region: 'Zaporizhzhia', riskScore: 55, projectCount: 76, issueCount: 15 },
  { region: 'Vinnytsia', riskScore: 22, projectCount: 54, issueCount: 3 },
  { region: 'Poltava', riskScore: 31, projectCount: 67, issueCount: 8 }
];

const mockPermitPipeline: PermitPipeline = {
  draft: 89,
  submitted: 156,
  underReview: 97,
  approved: 234,
  rejected: 23
};

const mockRiskProjects: RiskProject[] = [
  { id: 'PRJ001', name: 'Metro Station Expansion Phase 3', riskScore: 78, riskLevel: 'critical', mainRiskFactor: 'Budget overrun detected' },
  { id: 'PRJ002', name: 'Industrial Complex B7', riskScore: 71, riskLevel: 'high', mainRiskFactor: 'Contractor violations' },
  { id: 'PRJ003', name: 'Residential Tower Sunrise', riskScore: 65, riskLevel: 'high', mainRiskFactor: 'Inspection failures' },
  { id: 'PRJ004', name: 'Shopping Center West', riskScore: 58, riskLevel: 'medium', mainRiskFactor: 'Schedule delays' },
  { id: 'PRJ005', name: 'Hospital Renovation', riskScore: 52, riskLevel: 'medium', mainRiskFactor: 'Material certification pending' }
];

const mockRecentInspections: RecentInspection[] = [
  { id: 'INS001', projectName: 'Residential Tower Sunrise', type: 'Structural', status: 'passed', inspector: 'John Smith', date: '2026-01-07' },
  { id: 'INS002', projectName: 'Office Building Central', type: 'Fire Safety', status: 'failed', inspector: 'Maria Garcia', date: '2026-01-07' },
  { id: 'INS003', projectName: 'Metro Station Expansion', type: 'Environmental', status: 'passed', inspector: 'David Lee', date: '2026-01-06' },
  { id: 'INS004', projectName: 'Industrial Complex B7', type: 'Safety', status: 'scheduled', inspector: 'Anna Kowalski', date: '2026-01-08' },
  { id: 'INS005', projectName: 'Hospital Renovation', type: 'Final', status: 'in_progress', inspector: 'Michael Brown', date: '2026-01-07' }
];

const mockAnomalies: FinancialAnomaly[] = [
  { projectId: 'PRJ002', projectName: 'Industrial Complex B7', amount: 450000, anomalyScore: 87, type: 'Unusual Amount', flaggedAt: '2026-01-07' },
  { projectId: 'PRJ005', projectName: 'Shopping Center West', amount: 280000, anomalyScore: 72, type: 'Rapid Transactions', flaggedAt: '2026-01-06' },
  { projectId: 'PRJ001', projectName: 'Metro Station Expansion', amount: 890000, anomalyScore: 65, type: 'Budget Deviation', flaggedAt: '2026-01-05' }
];

const mockContractorTrust: ContractorTrust[] = [
  { id: 'CON001', name: 'BuildTech Solutions', trustScore: 92, projectsCount: 45, violationsCount: 0 },
  { id: 'CON002', name: 'Urban Constructors LLC', trustScore: 78, projectsCount: 32, violationsCount: 2 },
  { id: 'CON003', name: 'Mega Build Corp', trustScore: 65, projectsCount: 28, violationsCount: 5 },
  { id: 'CON004', name: 'Premier Construction', trustScore: 88, projectsCount: 41, violationsCount: 1 },
  { id: 'CON005', name: 'City Builders Inc', trustScore: 71, projectsCount: 23, violationsCount: 3 }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount}`;
};

const getRiskColor = (score: number): string => {
  if (score >= 75) return '#D64545'; // Critical - Red
  if (score >= 50) return '#E6A100'; // High - Yellow
  if (score >= 25) return '#4A90E2'; // Medium - Blue
  return '#2E8B57'; // Low - Green
};

const getRiskLevel = (score: number): string => {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'passed':
    case 'approved':
      return '#2E8B57';
    case 'failed':
    case 'rejected':
      return '#D64545';
    case 'scheduled':
    case 'pending':
    case 'under_review':
      return '#4A90E2';
    case 'in_progress':
      return '#E6A100';
    default:
      return '#7A7A7A';
  }
};

// ============================================================================
// COMPONENTS
// ============================================================================

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}> = ({ title, value, subtitle, trend, trendValue, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    minWidth: '200px'
  }}>
    <div style={{ fontSize: '14px', color: '#7A7A7A', marginBottom: '8px' }}>{title}</div>
    <div style={{ 
      fontSize: '32px', 
      fontWeight: 'bold', 
      color: color || '#1A1A1A',
      marginBottom: '4px'
    }}>
      {value}
    </div>
    {subtitle && (
      <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{subtitle}</div>
    )}
    {trend && trendValue && (
      <div style={{ 
        fontSize: '12px', 
        color: trend === 'up' ? '#2E8B57' : trend === 'down' ? '#D64545' : '#7A7A7A',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
      </div>
    )}
  </div>
);

const RiskHeatmap: React.FC<{ data: RegionalData[] }> = ({ data }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>Regional Risk Heatmap</span>
      <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#2E8B57', borderRadius: '2px' }}></span> Low
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#4A90E2', borderRadius: '2px' }}></span> Medium
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#E6A100', borderRadius: '2px' }}></span> High
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#D64545', borderRadius: '2px' }}></span> Critical
        </span>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {data.map(region => (
        <div 
          key={region.region}
          style={{
            backgroundColor: getRiskColor(region.riskScore) + '15',
            border: `2px solid ${getRiskColor(region.riskScore)}`,
            borderRadius: '8px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>{region.region}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7A7A7A' }}>
            <span>Projects: {region.projectCount}</span>
            <span>Issues: {region.issueCount}</span>
          </div>
          <div style={{ 
            marginTop: '8px', 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: getRiskColor(region.riskScore)
          }}>
            {region.riskScore}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PermitPipelineCard: React.FC<{ data: PermitPipeline }> = ({ data }) => {
  const stages = [
    { key: 'draft', label: 'Draft', color: '#7A7A7A' },
    { key: 'submitted', label: 'Submitted', color: '#4A90E2' },
    { key: 'underReview', label: 'Under Review', color: '#E6A100' },
    { key: 'approved', label: 'Approved', color: '#2E8B57' },
    { key: 'rejected', label: 'Rejected', color: '#D64545' }
  ];

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
        Permit Pipeline
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        {stages.map(stage => (
          <div 
            key={stage.key}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '16px',
              backgroundColor: stage.color + '15',
              borderRadius: '8px',
              borderTop: `4px solid ${stage.color}`
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: stage.color }}>
              {data[stage.key as keyof PermitPipeline]}
            </div>
            <div style={{ fontSize: '12px', color: '#7A7A7A', marginTop: '4px' }}>
              {stage.label}
            </div>
            <div style={{ fontSize: '10px', color: '#7A7A7A', marginTop: '2px' }}>
              {((data[stage.key as keyof PermitPipeline] / total) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HighRiskProjectsTable: React.FC<{ projects: RiskProject[] }> = ({ projects }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>High-Risk Projects</span>
      <button style={{
        backgroundColor: 'transparent',
        border: '1px solid #1A4B9A',
        color: '#1A4B9A',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer'
      }}>
        View All
      </button>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #D0D0D0' }}>
          <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Project</th>
          <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Risk Score</th>
          <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Level</th>
          <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Main Factor</th>
          <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(project => (
          <tr key={project.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
            <td style={{ padding: '12px 8px' }}>
              <div style={{ fontWeight: '500' }}>{project.name}</div>
              <div style={{ fontSize: '12px', color: '#7A7A7A' }}>{project.id}</div>
            </td>
            <td style={{ textAlign: 'center', padding: '12px 8px' }}>
              <span style={{ 
                display: 'inline-block',
                width: '48px',
                padding: '4px 8px',
                backgroundColor: getRiskColor(project.riskScore) + '20',
                color: getRiskColor(project.riskScore),
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {project.riskScore}
              </span>
            </td>
            <td style={{ textAlign: 'center', padding: '12px 8px' }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getRiskColor(project.riskScore) + '15',
                color: getRiskColor(project.riskScore),
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {getRiskLevel(project.riskScore)}
              </span>
            </td>
            <td style={{ padding: '12px 8px', fontSize: '14px', color: '#3A3A3A' }}>
              {project.mainRiskFactor}
            </td>
            <td style={{ textAlign: 'center', padding: '12px 8px' }}>
              <button style={{
                backgroundColor: '#1A4B9A',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                Review
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RecentInspectionsTable: React.FC<{ inspections: RecentInspection[] }> = ({ inspections }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>Recent Inspections</span>
      <button style={{
        backgroundColor: 'transparent',
        border: '1px solid #1A4B9A',
        color: '#1A4B9A',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer'
      }}>
        View Calendar
      </button>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #D0D0D0' }}>
          <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Project</th>
          <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Type</th>
          <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Status</th>
          <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Inspector</th>
          <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', color: '#7A7A7A', fontWeight: '500' }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {inspections.map(inspection => (
          <tr key={inspection.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
            <td style={{ padding: '12px 8px', fontWeight: '500' }}>{inspection.projectName}</td>
            <td style={{ textAlign: 'center', padding: '12px 8px', fontSize: '14px' }}>{inspection.type}</td>
            <td style={{ textAlign: 'center', padding: '12px 8px' }}>
              <span style={{
                padding: '4px 12px',
                backgroundColor: getStatusColor(inspection.status) + '15',
                color: getStatusColor(inspection.status),
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {inspection.status.replace('_', ' ')}
              </span>
            </td>
            <td style={{ padding: '12px 8px', fontSize: '14px' }}>{inspection.inspector}</td>
            <td style={{ textAlign: 'center', padding: '12px 8px', fontSize: '14px', color: '#7A7A7A' }}>
              {inspection.date}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FinancialAnomaliesCard: React.FC<{ anomalies: FinancialAnomaly[] }> = ({ anomalies }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>Financial Anomalies</span>
      <span style={{
        backgroundColor: '#D64545',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {anomalies.length} flagged
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {anomalies.map((anomaly, index) => (
        <div 
          key={index}
          style={{
            padding: '16px',
            backgroundColor: '#D64545' + '10',
            border: '1px solid #D64545' + '30',
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: '500' }}>{anomaly.projectName}</span>
            <span style={{ 
              color: '#D64545', 
              fontWeight: '600',
              fontSize: '18px'
            }}>
              {formatCurrency(anomaly.amount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7A7A7A' }}>
            <span>{anomaly.type}</span>
            <span>AI Score: {anomaly.anomalyScore}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContractorTrustIndex: React.FC<{ contractors: ContractorTrust[] }> = ({ contractors }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
      Contractor Trust Index
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {contractors.map(contractor => (
        <div 
          key={contractor.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px',
            backgroundColor: '#F5F5F5',
            borderRadius: '8px'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>{contractor.name}</div>
            <div style={{ fontSize: '12px', color: '#7A7A7A' }}>
              {contractor.projectsCount} projects • {contractor.violationsCount} violations
            </div>
          </div>
          <div style={{ 
            width: '100px',
            height: '8px',
            backgroundColor: '#D0D0D0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${contractor.trustScore}%`,
              height: '100%',
              backgroundColor: contractor.trustScore >= 80 ? '#2E8B57' : 
                              contractor.trustScore >= 60 ? '#E6A100' : '#D64545',
              borderRadius: '4px'
            }} />
          </div>
          <div style={{ 
            width: '40px',
            textAlign: 'right',
            fontWeight: '600',
            color: contractor.trustScore >= 80 ? '#2E8B57' : 
                   contractor.trustScore >= 60 ? '#E6A100' : '#D64545'
          }}>
            {contractor.trustScore}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ConstructionGovernanceDashboard() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const navItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '🏗️' },
    { id: 'permits', label: 'Permits', icon: '📋' },
    { id: 'inspections', label: 'Inspections', icon: '🔍' },
    { id: 'contractors', label: 'Contractors', icon: '🏢' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'ai', label: 'AI Analysis', icon: '🤖' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F5F5F5',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1A4B9A',
        color: 'white',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>Construction Governance Hub</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>National Digital Module</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                backgroundColor: activeView === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}>
            🌐 EN
          </button>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#2F6BCF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            MR
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeView === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Page Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0, color: '#1A1A1A' }}>
                  National Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: '#7A7A7A', margin: '4px 0 0 0' }}>
                  Real-time overview of construction governance across all regions
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D0D0D0',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}>
                  <option>All Regions</option>
                  <option>Kyiv</option>
                  <option>Lviv</option>
                  <option>Odesa</option>
                </select>
                <select style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D0D0D0',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}>
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
                <button style={{
                  backgroundColor: '#1A4B9A',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  📥 Export Report
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              <MetricCard 
                title="Active Projects" 
                value={metrics.totalActiveProjects.toLocaleString()} 
                trend="up" 
                trendValue="+12% from last month"
              />
              <MetricCard 
                title="High-Risk Projects" 
                value={metrics.highRiskProjects} 
                color="#D64545"
                trend="down" 
                trendValue="-5% from last month"
              />
              <MetricCard 
                title="Pending Permits" 
                value={metrics.pendingPermits} 
                color="#E6A100"
              />
              <MetricCard 
                title="Failed Inspections" 
                value={metrics.failedInspectionsLast30Days} 
                subtitle="Last 30 days"
                color="#D64545"
              />
              <MetricCard 
                title="Avg. Risk Score" 
                value={metrics.averageRiskScore} 
                subtitle="National average"
                color={getRiskColor(metrics.averageRiskScore)}
              />
            </div>

            {/* Risk Heatmap */}
            <RiskHeatmap data={mockRegionalData} />

            {/* Permit Pipeline */}
            <PermitPipelineCard data={mockPermitPipeline} />

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <HighRiskProjectsTable projects={mockRiskProjects} />
              <FinancialAnomaliesCard anomalies={mockAnomalies} />
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <RecentInspectionsTable inspections={mockRecentInspections} />
              <ContractorTrustIndex contractors={mockContractorTrust} />
            </div>

            {/* AI Insights Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #E8F0FB'
            }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🤖</span>
                <span>AI Governance Insights</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#E8F0FB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Risk Trend Analysis
                  </div>
                  <div style={{ fontSize: '13px', color: '#3A3A3A' }}>
                    AI detects 15% increase in permit delays in Odesa region. 
                    Recommend additional reviewer assignment.
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#E8F0FB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Contractor Pattern Alert
                  </div>
                  <div style={{ fontSize: '13px', color: '#3A3A3A' }}>
                    3 contractors show unusual transaction patterns. 
                    Review recommended before new project assignments.
                  </div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#E8F0FB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Compliance Forecast
                  </div>
                  <div style={{ fontSize: '13px', color: '#3A3A3A' }}>
                    12 permits expiring within 30 days. 
                    Automated reminders sent to developers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView !== 'dashboard' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {navItems.find(n => n.id === activeView)?.icon}
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>
              {navItems.find(n => n.id === activeView)?.label} Module
            </h2>
            <p style={{ color: '#7A7A7A', maxWidth: '400px', margin: '0 auto' }}>
              This section provides detailed management and analytics for 
              {' '}{navItems.find(n => n.id === activeView)?.label.toLowerCase()}.
              Full functionality available in production deployment.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 24px',
        borderTop: '1px solid #D0D0D0',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#7A7A7A'
      }}>
        <div>
          Construction Governance Hub v2.0 • IVYAR/HBS Platform
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Last updated: {new Date().toLocaleString()}</span>
          <span>System Status: 🟢 Operational</span>
        </div>
      </footer>
    </div>
  );
}
