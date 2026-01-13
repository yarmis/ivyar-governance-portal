'use client';

import Link from 'next/link';
import { useState } from 'react';

type DemoView = 'dashboard' | 'aid' | 'governance' | 'audit' | 'transactions';

export default function HbsDemo() {
  const [currentView, setCurrentView] = useState<DemoView>('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', color: 'white' }}>
      {/* Header */}
      <header style={{ 
        borderBottom: '1px solid #1e293b', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/us/hbs" style={{ color: '#22d3ee', textDecoration: 'none', fontFamily: 'monospace' }}>
            ← BACK
          </Link>
          <div style={{ width: '1px', height: '24px', background: '#334155' }} />
          <h1 style={{ fontSize: '20px', color: '#22d3ee', fontFamily: 'monospace', margin: 0 }}>
            HBS DEMO MODE
          </h1>
        </div>
        <div style={{ 
          padding: '0.5rem 1rem', 
          background: '#166534', 
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#86efac'
        }}>
          ✓ DEMO ACTIVE
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        {/* Sidebar Navigation */}
        <nav style={{ 
          width: '250px', 
          borderRight: '1px solid #1e293b',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
            icon="📊"
            label="Budget Dashboard"
          />
          <NavButton 
            active={currentView === 'aid'} 
            onClick={() => setCurrentView('aid')}
            icon="🌍"
            label="Aid Distribution"
          />
          <NavButton 
            active={currentView === 'governance'} 
            onClick={() => setCurrentView('governance')}
            icon="⚖️"
            label="AI Governance"
          />
          <NavButton 
            active={currentView === 'audit'} 
            onClick={() => setCurrentView('audit')}
            icon="📋"
            label="Audit Trail"
          />
          <NavButton 
            active={currentView === 'transactions'} 
            onClick={() => setCurrentView('transactions')}
            icon="💰"
            label="Transactions"
          />
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {currentView === 'dashboard' && <BudgetDashboard />}
          {currentView === 'aid' && <AidDistribution />}
          {currentView === 'governance' && <AIGovernance />}
          {currentView === 'audit' && <AuditTrail />}
          {currentView === 'transactions' && <Transactions />}
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1rem',
        background: active ? '#1e40af' : 'transparent',
        border: active ? '1px solid #3b82f6' : '1px solid transparent',
        borderRadius: '6px',
        color: active ? 'white' : '#94a3b8',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontFamily: 'system-ui',
        fontSize: '14px',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = '#1e293b';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function BudgetDashboard() {
  const budgets = [
    { name: 'Healthcare', allocated: 2400000, spent: 1850000, color: '#3b82f6' },
    { name: 'Education', allocated: 1800000, spent: 1200000, color: '#10b981' },
    { name: 'Infrastructure', allocated: 3200000, spent: 2800000, color: '#f59e0b' },
    { name: 'Emergency Aid', allocated: 1500000, spent: 980000, color: '#ef4444' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '1.5rem', color: '#22d3ee' }}>
        Budget Tracking & Transparency
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Budget" value="$8.9M" trend="+12%" />
        <StatCard label="Allocated" value="$7.2M" trend="+8%" />
        <StatCard label="Remaining" value="$1.7M" trend="-4%" />
        <StatCard label="Efficiency" value="94.7%" trend="+2%" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '1.5rem', color: '#e2e8f0' }}>Budget Allocation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            return (
              <div key={budget.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>{budget.name}</span>
                  <span style={{ color: '#22d3ee', fontSize: '14px', fontFamily: 'monospace' }}>
                    ${(budget.spent / 1000).toFixed(0)}K / ${(budget.allocated / 1000).toFixed(0)}K
                  </span>
                </div>
                <div style={{ width: '100%', height: '32px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: `linear-gradient(to right, ${budget.color}, ${budget.color}dd)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '0.75rem',
                    transition: 'width 1s ease'
                  }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '600', fontFamily: 'monospace' }}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div style={{ 
      background: '#1e293b', 
      border: '1px solid #334155', 
      borderRadius: '8px', 
      padding: '1.25rem'
    }}>
      <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#22d3ee', fontFamily: 'monospace' }}>
          {value}
        </div>
        <div style={{ 
          fontSize: '13px', 
          fontWeight: '600',
          color: isPositive ? '#86efac' : '#fca5a5',
          fontFamily: 'monospace'
        }}>
          {trend}
        </div>
      </div>
    </div>
  );
}


function AidDistribution() {
  const distributions = [
    { region: 'Eastern Region', beneficiaries: 145000, packages: 2400, status: 'active' },
    { region: 'Northern Region', beneficiaries: 89000, packages: 1850, status: 'active' },
    { region: 'Southern Region', beneficiaries: 210000, packages: 3200, status: 'completed' },
    { region: 'Western Region', beneficiaries: 67000, packages: 980, status: 'pending' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '1.5rem', color: '#22d3ee' }}>
        Humanitarian Aid Distribution
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Beneficiaries Served" value="5.4M" trend="+18%" />
        <StatCard label="Active Programs" value="267" trend="+12%" />
        <StatCard label="Countries" value="24" trend="+3" />
        <StatCard label="Delivery Rate" value="96.2%" trend="+1.5%" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '1.5rem', color: '#e2e8f0' }}>Regional Distribution</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {distributions.map((dist) => (
            <div key={dist.region} style={{ 
              background: '#0f172a', 
              border: '1px solid #1e293b', 
              borderRadius: '6px', 
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                  {dist.region}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {(dist.beneficiaries / 1000).toFixed(0)}K beneficiaries • {dist.packages} packages
                </div>
              </div>
              <div style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '20px',
                background: dist.status === 'active' ? '#166534' : dist.status === 'completed' ? '#1e40af' : '#713f12',
                color: dist.status === 'active' ? '#86efac' : dist.status === 'completed' ? '#93c5fd' : '#fde047',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {dist.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIGovernance() {
  const [selectedDecision, setSelectedDecision] = useState(0);
  
  const decisions = [
    { 
      id: 1, 
      type: 'Procurement Approval', 
      status: 'approved', 
      confidence: 94,
      details: 'Supplier verification passed all checks. Background clean, pricing competitive, delivery timeline reasonable.'
    },
    { 
      id: 2, 
      type: 'Budget Reallocation', 
      status: 'review', 
      confidence: 67,
      details: 'Request for emergency fund transfer. Requires human approval due to amount exceeding threshold.'
    },
    { 
      id: 3, 
      type: 'Vendor Risk Assessment', 
      status: 'rejected', 
      confidence: 88,
      details: 'Multiple red flags detected: recent legal disputes, inconsistent documentation, pricing anomalies.'
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '1.5rem', color: '#22d3ee' }}>
        AI Governance & Decision Support
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Decisions Today" value="1,247" trend="+8%" />
        <StatCard label="AI Accuracy" value="97.2%" trend="+0.3%" />
        <StatCard label="Human Reviews" value="143" trend="-5%" />
        <StatCard label="Fraud Prevented" value="$89M" trend="+12%" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '1.5rem', color: '#e2e8f0' }}>Recent AI Decisions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {decisions.map((decision, idx) => {
            const statusColor = decision.status === 'approved' ? '#166534' : decision.status === 'review' ? '#713f12' : '#7f1d1d';
            const statusText = decision.status === 'approved' ? '#86efac' : decision.status === 'review' ? '#fde047' : '#fca5a5';
            
            return (
              <div 
                key={decision.id} 
                onClick={() => setSelectedDecision(idx)}
                style={{ 
                  background: selectedDecision === idx ? '#0f172a' : 'transparent', 
                  border: `1px solid ${selectedDecision === idx ? '#3b82f6' : '#1e293b'}`, 
                  borderRadius: '6px', 
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#e2e8f0' }}>
                    {decision.type}
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px',
                    background: statusColor,
                    color: statusText,
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {decision.status}
                  </div>
                </div>
                
                {selectedDecision === idx && (
                  <>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '0.25rem' }}>
                        Confidence Score
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '20px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${decision.confidence}%`,
                            height: '100%',
                            background: decision.confidence >= 80 ? '#10b981' : decision.confidence >= 60 ? '#f59e0b' : '#ef4444',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                        <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: '14px', fontWeight: '600' }}>
                          {decision.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', padding: '0.75rem', background: '#0a0e27', borderRadius: '4px' }}>
                      {decision.details}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AuditTrail() {
  const logs = [
    { time: '14:32:18', user: 'admin@ministry.gov', action: 'Budget Approved', target: 'Healthcare Q1 2026', status: 'success' },
    { time: '14:28:45', user: 'ai-system', action: 'Fraud Detection', target: 'Vendor ID #8472', status: 'warning' },
    { time: '14:25:12', user: 'finance@ministry.gov', action: 'Fund Transfer', target: '$125,000 → Emergency', status: 'success' },
    { time: '14:21:33', user: 'ai-system', action: 'Risk Assessment', target: 'Procurement #3391', status: 'info' },
    { time: '14:18:56', user: 'auditor@oversight.org', action: 'Report Generated', target: 'Monthly Compliance', status: 'success' },
    { time: '14:15:22', user: 'admin@ministry.gov', action: 'Permission Updated', target: 'User: j.smith', status: 'success' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '1.5rem', color: '#22d3ee' }}>
        Full Audit Trail & Compliance
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Events Logged" value="847M" trend="+24%" />
        <StatCard label="Audit Requests" value="12.4K/mo" trend="+8%" />
        <StatCard label="Compliance" value="100%" trend="0%" />
        <StatCard label="Uptime" value="99.99%" trend="0%" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '18px', color: '#e2e8f0', margin: 0 }}>Live Activity Log</h3>
          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
            🟢 LIVE • Updated 2s ago
          </div>
        </div>
        
        <div style={{ 
          background: '#0f172a', 
          borderRadius: '6px', 
          fontFamily: 'monospace', 
          fontSize: '13px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {logs.map((log, idx) => {
            const statusColors = {
              success: '#86efac',
              warning: '#fde047',
              info: '#93c5fd',
              error: '#fca5a5'
            };
            
            return (
              <div 
                key={idx}
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderBottom: idx < logs.length - 1 ? '1px solid #1e293b' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '80px 200px 1fr 180px 80px',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: '#64748b' }}>{log.time}</span>
                <span style={{ color: '#94a3b8' }}>{log.user}</span>
                <span style={{ color: '#cbd5e1' }}>{log.action}</span>
                <span style={{ color: '#64748b' }}>{log.target}</span>
                <span style={{ color: statusColors[log.status as keyof typeof statusColors] }}>
                  {log.status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Transactions() {
  const transactions = [
    { id: 'TX-8472', amount: 125000, from: 'Central Budget', to: 'Emergency Aid', time: '14:25', status: 'completed' },
    { id: 'TX-8471', amount: 85000, from: 'Healthcare Fund', to: 'Regional Hospital', time: '14:18', status: 'completed' },
    { id: 'TX-8470', amount: 210000, from: 'Infrastructure', to: 'Road Construction', time: '14:12', status: 'pending' },
    { id: 'TX-8469', amount: 45000, from: 'Education Budget', to: 'School Supplies', time: '14:08', status: 'completed' },
    { id: 'TX-8468', amount: 320000, from: 'Donor Fund', to: 'Multiple Programs', time: '14:02', status: 'processing' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', marginBottom: '1.5rem', color: '#22d3ee' }}>
        Real-time Transaction Monitoring
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Today's Volume" value="$8.2M" trend="+15%" />
        <StatCard label="Transactions" value="1,247" trend="+8%" />
        <StatCard label="Avg Amount" value="$6.5K" trend="+3%" />
        <StatCard label="Success Rate" value="99.8%" trend="+0.1%" />
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '1.5rem', color: '#e2e8f0' }}>Recent Transactions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {transactions.map((tx) => (
            <div 
              key={tx.id}
              style={{ 
                background: '#0f172a', 
                border: '1px solid #1e293b', 
                borderRadius: '6px', 
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '100px 1fr 100px 100px',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '13px' }}>
                {tx.id}
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                  {tx.from} → {tx.to}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {tx.time} • ${tx.amount.toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#22d3ee', fontFamily: 'monospace', textAlign: 'right' }}>
                ${(tx.amount / 1000).toFixed(0)}K
              </div>
              <div style={{ 
                padding: '0.35rem 0.75rem', 
                borderRadius: '12px',
                background: tx.status === 'completed' ? '#166534' : tx.status === 'processing' ? '#713f12' : '#1e40af',
                color: tx.status === 'completed' ? '#86efac' : tx.status === 'processing' ? '#fde047' : '#93c5fd',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                {tx.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
