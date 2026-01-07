'use client';

/**
 * Construction Governance Hub - Inspections Management
 * Calendar view, mobile inspection mode, AI anomaly detection
 * 
 * @module InspectionsManagement
 * @version 2.0.0
 */

import React, { useState } from 'react';

// Types
interface Inspection {
  id: string;
  projectId: string;
  projectName: string;
  type: 'foundation' | 'structural' | 'safety' | 'fire' | 'environmental' | 'electrical' | 'plumbing' | 'final';
  status: 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'requires_reinspection';
  inspector: string;
  scheduledDate: string;
  completedDate?: string;
  aiAnomalyScore: number;
  location: string;
  findings?: string;
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'passed' | 'failed' | 'na' | 'pending';
  required: boolean;
}

// Mock data
const mockInspections: Inspection[] = [
  { id: 'INS-001', projectId: 'PRJ-001', projectName: 'Sunrise Apartments', type: 'structural', status: 'scheduled', inspector: 'John Smith', scheduledDate: '2026-01-08', aiAnomalyScore: 0, location: 'Kyiv, District 5' },
  { id: 'INS-002', projectId: 'PRJ-002', projectName: 'Metro Station B7', type: 'safety', status: 'in_progress', inspector: 'Maria Garcia', scheduledDate: '2026-01-07', aiAnomalyScore: 23, location: 'Kyiv, Central' },
  { id: 'INS-003', projectId: 'PRJ-003', projectName: 'Hospital Wing C', type: 'fire', status: 'passed', inspector: 'David Lee', scheduledDate: '2026-01-06', completedDate: '2026-01-06', aiAnomalyScore: 8, location: 'Lviv, Medical District' },
  { id: 'INS-004', projectId: 'PRJ-004', projectName: 'Industrial Complex', type: 'environmental', status: 'failed', inspector: 'Anna Kowalski', scheduledDate: '2026-01-05', completedDate: '2026-01-05', aiAnomalyScore: 67, location: 'Odesa, Industrial Zone', findings: 'Environmental standards not met. Waste management issues detected.' },
  { id: 'INS-005', projectId: 'PRJ-005', projectName: 'Office Tower Central', type: 'final', status: 'scheduled', inspector: 'Michael Brown', scheduledDate: '2026-01-10', aiAnomalyScore: 0, location: 'Dnipro, Business Center' },
  { id: 'INS-006', projectId: 'PRJ-006', projectName: 'Shopping Mall West', type: 'structural', status: 'requires_reinspection', inspector: 'John Smith', scheduledDate: '2026-01-09', aiAnomalyScore: 45, location: 'Kharkiv, West District' },
];

const mockChecklist: ChecklistItem[] = [
  { id: 'C1', category: 'Foundation', item: 'Foundation integrity verification', status: 'passed', required: true },
  { id: 'C2', category: 'Foundation', item: 'Soil compaction check', status: 'passed', required: true },
  { id: 'C3', category: 'Structure', item: 'Load-bearing walls inspection', status: 'pending', required: true },
  { id: 'C4', category: 'Structure', item: 'Beam and column alignment', status: 'pending', required: true },
  { id: 'C5', category: 'Materials', item: 'Concrete quality verification', status: 'pending', required: true },
  { id: 'C6', category: 'Materials', item: 'Steel reinforcement check', status: 'pending', required: true },
  { id: 'C7', category: 'Safety', item: 'Scaffolding safety', status: 'pending', required: false },
  { id: 'C8', category: 'Safety', item: 'PPE compliance', status: 'pending', required: true },
];

const typeConfig: Record<string, { label: string; color: string }> = {
  foundation: { label: 'Foundation', color: '#8B4513' },
  structural: { label: 'Structural', color: '#1A4B9A' },
  safety: { label: 'Safety', color: '#E6A100' },
  fire: { label: 'Fire', color: '#D64545' },
  environmental: { label: 'Environmental', color: '#2E8B57' },
  electrical: { label: 'Electrical', color: '#FFD700' },
  plumbing: { label: 'Plumbing', color: '#4A90E2' },
  final: { label: 'Final', color: '#9932CC' }
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  scheduled: { label: 'Scheduled', color: '#4A90E2', bgColor: '#E8F0FB' },
  in_progress: { label: 'In Progress', color: '#E6A100', bgColor: '#FFF8E6' },
  passed: { label: 'Passed', color: '#2E8B57', bgColor: '#E6F5EC' },
  failed: { label: 'Failed', color: '#D64545', bgColor: '#FDEBEB' },
  requires_reinspection: { label: 'Reinspection', color: '#9932CC', bgColor: '#F3E8FF' }
};

type ViewMode = 'calendar' | 'list' | 'mobile';

export default function InspectionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(mockChecklist);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredInspections = mockInspections.filter(ins => {
    if (filterStatus !== 'all' && ins.status !== filterStatus) return false;
    if (filterType !== 'all' && ins.type !== filterType) return false;
    return true;
  });

  const updateChecklistItem = (id: string, status: 'passed' | 'failed' | 'na') => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const InspectionCard: React.FC<{ inspection: Inspection }> = ({ inspection }) => (
    <div
      onClick={() => setSelectedInspection(inspection)}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: selectedInspection?.id === inspection.id ? '2px solid #1A4B9A' : '1px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: typeConfig[inspection.type].color + '15',
            color: typeConfig[inspection.type].color,
            marginRight: '8px'
          }}>
            {typeConfig[inspection.type].label}
          </span>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: statusConfig[inspection.status].bgColor,
            color: statusConfig[inspection.status].color
          }}>
            {statusConfig[inspection.status].label}
          </span>
        </div>
        {inspection.aiAnomalyScore > 0 && (
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: inspection.aiAnomalyScore > 50 ? '#D64545' : inspection.aiAnomalyScore > 25 ? '#E6A100' : '#2E8B57',
            backgroundColor: (inspection.aiAnomalyScore > 50 ? '#D64545' : inspection.aiAnomalyScore > 25 ? '#E6A100' : '#2E8B57') + '15',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            🤖 {inspection.aiAnomalyScore}%
          </span>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
        {inspection.projectName}
      </h3>
      
      <div style={{ fontSize: '13px', color: '#7A7A7A', marginBottom: '12px' }}>
        <div>📍 {inspection.location}</div>
        <div>👤 {inspection.inspector}</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#7A7A7A' }}>
          📅 {inspection.scheduledDate}
        </span>
        <span style={{ fontSize: '12px', color: '#7A7A7A' }}>
          {inspection.id}
        </span>
      </div>
    </div>
  );

  const MobileInspectionMode: React.FC = () => (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      {/* Mobile Header */}
      <div style={{
        backgroundColor: '#1A4B9A',
        color: 'white',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button onClick={() => setViewMode('list')} style={{ 
          background: 'none', 
          border: 'none', 
          color: 'white', 
          fontSize: '20px',
          cursor: 'pointer'
        }}>
          ←
        </button>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Mobile Inspection</div>
          <div style={{ fontWeight: '600' }}>{selectedInspection?.projectName || 'Select Inspection'}</div>
        </div>
      </div>

      {selectedInspection && (
        <>
          {/* GPS Status */}
          <div style={{
            backgroundColor: '#E6F5EC',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📍</span>
            <span style={{ fontSize: '13px', color: '#2E8B57' }}>Location verified: {selectedInspection.location}</span>
          </div>

          {/* Checklist */}
          <div style={{ padding: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Inspection Checklist</h4>
            
            {Array.from(new Set(checklist.map(c => c.category))).map(category => (
              <div key={category} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#7A7A7A', 
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  {category}
                </div>
                {checklist.filter(c => c.category === category).map(item => (
                  <div key={item.id} style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ 
                      fontSize: '14px', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {item.required && <span style={{ color: '#D64545' }}>*</span>}
                      {item.item}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['passed', 'failed', 'na'].map(status => (
                        <button
                          key={status}
                          onClick={() => updateChecklistItem(item.id, status as 'passed' | 'failed' | 'na')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            backgroundColor: item.status === status 
                              ? (status === 'passed' ? '#2E8B57' : status === 'failed' ? '#D64545' : '#7A7A7A')
                              : '#E0E0E0',
                            color: item.status === status ? 'white' : '#7A7A7A'
                          }}
                        >
                          {status === 'passed' ? '✓ Pass' : status === 'failed' ? '✗ Fail' : 'N/A'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Photo Capture */}
          <div style={{ padding: '0 16px 16px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Photo Evidence</h4>
            <button style={{
              width: '100%',
              padding: '40px',
              border: '2px dashed #D0D0D0',
              borderRadius: '12px',
              backgroundColor: '#F5F5F5',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#7A7A7A'
            }}>
              📷 Tap to add photo
            </button>
          </div>

          {/* AI Alerts */}
          {selectedInspection.aiAnomalyScore > 20 && (
            <div style={{
              margin: '0 16px 16px',
              padding: '16px',
              backgroundColor: '#FFF8E6',
              borderRadius: '12px',
              border: '1px solid #E6A100'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', color: '#E6A100' }}>
                🤖 AI Alert
              </div>
              <div style={{ fontSize: '13px', color: '#7A7A7A' }}>
                Potential anomaly detected. Pay attention to structural elements in sector B.
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ padding: '16px' }}>
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#1A4B9A',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Submit Inspection
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (viewMode === 'mobile' && selectedInspection) {
    return <MobileInspectionMode />;
  }

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
          <span style={{ fontSize: '18px', fontWeight: '600' }}>Inspections Management</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['list', 'calendar'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: viewMode === mode ? 'white' : 'rgba(255,255,255,0.1)',
                color: viewMode === mode ? '#1A4B9A' : 'white',
                fontWeight: viewMode === mode ? '600' : '400'
              }}
            >
              {mode === 'list' ? '📋 List' : '📅 Calendar'}
            </button>
          ))}
          <button style={{
            backgroundColor: 'white',
            color: '#1A4B9A',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + Schedule Inspection
          </button>
        </div>
      </header>

      {/* Filters */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        display: 'flex',
        gap: '16px'
      }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #D0D0D0',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="requires_reinspection">Requires Reinspection</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #D0D0D0',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Types</option>
          {Object.entries(typeConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <main style={{ padding: '24px', display: 'flex', gap: '24px' }}>
        {/* Inspections Grid */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '16px'
          }}>
            {filteredInspections.map(inspection => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedInspection && (
          <div style={{
            width: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Inspection Details</h3>
              <button
                onClick={() => setSelectedInspection(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#7A7A7A' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Project</div>
              <div style={{ fontWeight: '600' }}>{selectedInspection.projectName}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Type</div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: typeConfig[selectedInspection.type].color + '15',
                  color: typeConfig[selectedInspection.type].color
                }}>
                  {typeConfig[selectedInspection.type].label}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Status</div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: statusConfig[selectedInspection.status].bgColor,
                  color: statusConfig[selectedInspection.status].color
                }}>
                  {statusConfig[selectedInspection.status].label}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Inspector</div>
              <div>{selectedInspection.inspector}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '4px' }}>Location</div>
              <div>{selectedInspection.location}</div>
            </div>

            {selectedInspection.findings && (
              <div style={{
                backgroundColor: '#FDEBEB',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', color: '#D64545', marginBottom: '4px', fontWeight: '600' }}>Findings</div>
                <div style={{ fontSize: '13px', color: '#7A7A7A' }}>{selectedInspection.findings}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setViewMode('mobile')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#1A4B9A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📱 Start Mobile Mode
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
