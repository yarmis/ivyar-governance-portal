'use client';

/**
 * Construction Governance Hub - Permits Workspace
 * Kanban-style permit workflow management
 * 
 * @module PermitsWorkspace
 * @version 2.0.0
 */

import React, { useState } from 'react';

// Types
interface Permit {
  id: string;
  projectName: string;
  type: string;
  developer: string;
  submittedAt: string;
  aiScore: number;
  daysInStatus: number;
}

type PermitStatus = 'draft' | 'submitted' | 'underReview' | 'approved' | 'rejected';

// Mock data
const mockPermits: Record<PermitStatus, Permit[]> = {
  draft: [
    { id: 'PRM-001', projectName: 'Sunrise Apartments', type: 'Construction', developer: 'Urban Dev LLC', submittedAt: '2026-01-05', aiScore: 0, daysInStatus: 2 },
    { id: 'PRM-002', projectName: 'Tech Park Phase 2', type: 'Renovation', developer: 'TechBuild Corp', submittedAt: '2026-01-06', aiScore: 0, daysInStatus: 1 }
  ],
  submitted: [
    { id: 'PRM-003', projectName: 'Metro Station B7', type: 'Construction', developer: 'State Railways', submittedAt: '2026-01-04', aiScore: 78, daysInStatus: 3 },
    { id: 'PRM-004', projectName: 'Hospital Wing C', type: 'Construction', developer: 'Health Ministry', submittedAt: '2026-01-03', aiScore: 92, daysInStatus: 4 },
    { id: 'PRM-005', projectName: 'Shopping Mall West', type: 'Construction', developer: 'Retail Invest', submittedAt: '2026-01-05', aiScore: 65, daysInStatus: 2 }
  ],
  underReview: [
    { id: 'PRM-006', projectName: 'Industrial Complex', type: 'Construction', developer: 'Heavy Industries', submittedAt: '2025-12-28', aiScore: 71, daysInStatus: 10 },
    { id: 'PRM-007', projectName: 'Office Tower Central', type: 'Construction', developer: 'Prime Real Estate', submittedAt: '2025-12-30', aiScore: 88, daysInStatus: 8 }
  ],
  approved: [
    { id: 'PRM-008', projectName: 'Residential Block A', type: 'Construction', developer: 'Home Builders', submittedAt: '2025-12-20', aiScore: 95, daysInStatus: 0 },
    { id: 'PRM-009', projectName: 'School Renovation', type: 'Renovation', developer: 'Education Dept', submittedAt: '2025-12-22', aiScore: 98, daysInStatus: 0 }
  ],
  rejected: [
    { id: 'PRM-010', projectName: 'Warehouse District', type: 'Construction', developer: 'Logistics Co', submittedAt: '2025-12-15', aiScore: 42, daysInStatus: 0 }
  ]
};

const statusConfig = {
  draft: { label: 'Draft', color: '#7A7A7A', bgColor: '#F5F5F5' },
  submitted: { label: 'Submitted', color: '#4A90E2', bgColor: '#E8F0FB' },
  underReview: { label: 'Under Review', color: '#E6A100', bgColor: '#FFF8E6' },
  approved: { label: 'Approved', color: '#2E8B57', bgColor: '#E6F5EC' },
  rejected: { label: 'Rejected', color: '#D64545', bgColor: '#FDEBEB' }
};

const getAIScoreColor = (score: number): string => {
  if (score >= 80) return '#2E8B57';
  if (score >= 60) return '#E6A100';
  if (score >= 40) return '#D64545';
  return '#7A7A7A';
};

export default function PermitsWorkspace() {
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const PermitCard: React.FC<{ permit: Permit; status: PermitStatus }> = ({ permit, status }) => (
    <div
      onClick={() => setSelectedPermit(permit)}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: selectedPermit?.id === permit.id ? '2px solid #1A4B9A' : '1px solid #E0E0E0',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#7A7A7A' }}>{permit.id}</span>
        {permit.aiScore > 0 && (
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: getAIScoreColor(permit.aiScore),
            backgroundColor: getAIScoreColor(permit.aiScore) + '15',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            AI: {permit.aiScore}%
          </span>
        )}
      </div>
      <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
        {permit.projectName}
      </div>
      <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '8px' }}>
        {permit.type} • {permit.developer}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7A7A7A' }}>
        <span>{permit.submittedAt}</span>
        {permit.daysInStatus > 0 && (
          <span style={{ color: permit.daysInStatus > 7 ? '#D64545' : '#7A7A7A' }}>
            {permit.daysInStatus}d in status
          </span>
        )}
      </div>
    </div>
  );

  const KanbanColumn: React.FC<{ status: PermitStatus; permits: Permit[] }> = ({ status, permits }) => (
    <div style={{
      flex: 1,
      minWidth: '260px',
      backgroundColor: statusConfig[status].bgColor,
      borderRadius: '12px',
      padding: '16px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            backgroundColor: statusConfig[status].color
          }} />
          <span style={{ fontWeight: '600', fontSize: '14px' }}>
            {statusConfig[status].label}
          </span>
        </div>
        <span style={{
          backgroundColor: statusConfig[status].color,
          color: 'white',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {permits.length}
        </span>
      </div>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {permits.map(permit => (
          <PermitCard key={permit.id} permit={permit} status={status} />
        ))}
      </div>
    </div>
  );

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
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/construction" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
            ← Dashboard
          </a>
          <div style={{ height: '24px', width: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <span style={{ fontSize: '18px', fontWeight: '600' }}>Permits Workspace</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Types</option>
            <option value="construction">Construction</option>
            <option value="renovation">Renovation</option>
            <option value="demolition">Demolition</option>
          </select>
          <button style={{
            backgroundColor: 'white',
            color: '#1A4B9A',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + New Permit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Permits', value: Object.values(mockPermits).flat().length, color: '#1A4B9A' },
            { label: 'Pending Review', value: mockPermits.submitted.length + mockPermits.underReview.length, color: '#E6A100' },
            { label: 'Approved This Month', value: mockPermits.approved.length, color: '#2E8B57' },
            { label: 'Avg. Processing Time', value: '5.2 days', color: '#7A7A7A' }
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '16px'
        }}>
          {(Object.keys(mockPermits) as PermitStatus[]).map(status => (
            <KanbanColumn
              key={status}
              status={status}
              permits={mockPermits[status]}
            />
          ))}
        </div>
      </main>

      {/* Detail Panel */}
      {selectedPermit && (
        <div style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '400px',
          backgroundColor: 'white',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
          padding: '24px',
          overflowY: 'auto',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Permit Details</h3>
            <button
              onClick={() => setSelectedPermit(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#7A7A7A'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Permit ID</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPermit.id}</div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Project</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{selectedPermit.projectName}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Type</div>
              <div style={{ fontSize: '14px' }}>{selectedPermit.type}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Developer</div>
              <div style={{ fontSize: '14px' }}>{selectedPermit.developer}</div>
            </div>
          </div>

          {selectedPermit.aiScore > 0 && (
            <div style={{
              backgroundColor: '#E8F0FB',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '8px' }}>AI Compliance Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: getAIScoreColor(selectedPermit.aiScore)
                }}>
                  {selectedPermit.aiScore}%
                </div>
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: '#D0D0D0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${selectedPermit.aiScore}%`,
                    height: '100%',
                    backgroundColor: getAIScoreColor(selectedPermit.aiScore),
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1,
              backgroundColor: '#2E8B57',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Approve
            </button>
            <button style={{
              flex: 1,
              backgroundColor: '#D64545',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
