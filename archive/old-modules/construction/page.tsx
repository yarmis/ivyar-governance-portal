"use client";

import Link from "next/link";

const MODULES = [
  {
    id: 'materials',
    name: 'Materials Hub',
    nameUk: 'Матеріали',
    icon: '🧱',
    href: '/materials',
    description: 'Material tracking, suppliers, quality control',
    descriptionUk: 'Відстеження матеріалів, постачальники, контроль якості',
    color: '#F59E0B',
    stats: { label: 'Materials', value: '1,250+' },
  },
  {
    id: 'zoning',
    name: 'Zoning & Cadastre',
    nameUk: 'Зонування',
    icon: '🗺️',
    href: '/zoning',
    description: 'Land zoning, parcels, building permits',
    descriptionUk: 'Зонування земель, ділянки, дозволи на будівництво',
    color: '#3B82F6',
    stats: { label: 'Parcels', value: '5,600+' },
  },
  {
    id: 'violations',
    name: 'Violations',
    nameUk: 'Порушення',
    icon: '⚠️',
    href: '/violations',
    description: 'Violations, fines, escalations, enforcement',
    descriptionUk: 'Порушення, штрафи, ескалації, контроль',
    color: '#EF4444',
    stats: { label: 'Active Cases', value: '24' },
  },
  {
    id: 'donors',
    name: 'Donor Portal',
    nameUk: 'Портал донорів',
    icon: '💰',
    href: '/donors',
    description: 'Transparency, fund tracking, compliance',
    descriptionUk: 'Прозорість, відстеження коштів, відповідність',
    color: '#10B981',
    stats: { label: 'Total Funding', value: '$1.66B' },
  },
  {
    id: 'projects',
    name: 'Projects',
    nameUk: 'Проєкти',
    icon: '🏗️',
    href: '/construction/projects',
    description: 'Construction project management',
    descriptionUk: 'Управління будівельними проєктами',
    color: '#8B5CF6',
    stats: { label: 'Active', value: '156' },
  },
  {
    id: 'inspections',
    name: 'Inspections',
    nameUk: 'Інспекції',
    icon: '🔍',
    href: '/construction/inspections',
    description: 'Site inspections and audits',
    descriptionUk: 'Інспекції об\'єктів та аудити',
    color: '#EC4899',
    stats: { label: 'This Month', value: '89' },
  },
  {
    id: 'contracts',
    name: 'Contracts',
    nameUk: 'Контракти',
    icon: '📋',
    href: '/construction/contracts',
    description: 'Contract management and procurement',
    descriptionUk: 'Управління контрактами та закупівлі',
    color: '#14B8A6',
    stats: { label: 'Active', value: '342' },
  },
  {
    id: 'ai-center',
    name: 'AI Operations',
    nameUk: 'AI Центр',
    icon: '🤖',
    href: '/construction/ai',
    description: 'AI-powered analytics and predictions',
    descriptionUk: 'AI-аналітика та прогнози',
    color: '#6366F1',
    stats: { label: 'Insights', value: '1.2K' },
  },
];

const QUICK_STATS = [
  { label: 'Total Projects', value: '2,847', change: '+12%', icon: '🏗️' },
  { label: 'Active Inspections', value: '156', change: '+8%', icon: '🔍' },
  { label: 'Compliance Rate', value: '94.2%', change: '+2.1%', icon: '✅' },
  { label: 'Donor Funds Utilized', value: '$485M', change: '+$45M', icon: '💰' },
];

export default function ConstructionHubPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: '#E2E8F0', fontFamily: 'system-ui' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', borderBottom: '1px solid #334155', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>🏛️</span>
                Construction Governance Hub
              </h1>
              <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#94A3B8' }}>
                IVYAR Platform • Центр управління будівництвом
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/freight" style={{ padding: '10px 20px', background: '#334155', border: 'none', borderRadius: '8px', color: '#E2E8F0', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🚛 Freight
              </Link>
              <button style={{ padding: '10px 20px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
                + New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {QUICK_STATS.map((stat, i) => (
            <div key={i} style={{ 
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
              borderRadius: '12px', 
              padding: '20px',
              border: '1px solid #475569',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{stat.label}</p>
                  <p style={{ margin: '8px 0 4px', fontSize: '28px', fontWeight: 700 }}>{stat.value}</p>
                  <span style={{ fontSize: '12px', color: '#10B981' }}>{stat.change}</span>
                </div>
                <span style={{ fontSize: '28px' }}>{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600 }}>Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {MODULES.map(module => (
            <Link key={module.id} href={module.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: '#1E293B', 
                borderRadius: '16px', 
                border: '1px solid #334155',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = module.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ height: '4px', background: module.color }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '32px' }}>{module.icon}</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{module.name}</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>{module.nameUk}</p>
                      </div>
                    </div>
                    <div style={{ 
                      background: `${module.color}20`, 
                      padding: '6px 12px', 
                      borderRadius: '20px',
                      textAlign: 'center',
                    }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: module.color }}>{module.stats.value}</p>
                      <p style={{ margin: 0, fontSize: '10px', color: '#94A3B8' }}>{module.stats.label}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
                    {module.description}
                  </p>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '13px', color: module.color, fontWeight: 500 }}>
                      Open Module →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Recent Alerts */}
          <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚨 Recent Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { type: 'violation', text: 'Critical violation escalated - VIO-2025-0002', time: '2 hours ago', color: '#EF4444' },
                { type: 'material', text: 'Low stock alert: Steel A500C below minimum', time: '4 hours ago', color: '#F59E0B' },
                { type: 'permit', text: 'Permit BP-2025-0001 under review', time: '6 hours ago', color: '#3B82F6' },
                { type: 'donor', text: 'Q4 Report due in 24 days - World Bank', time: '1 day ago', color: '#10B981' },
              ].map((alert, i) => (
                <div key={i} style={{ background: '#0F172A', borderRadius: '8px', padding: '12px', borderLeft: `3px solid ${alert.color}` }}>
                  <p style={{ margin: 0, fontSize: '13px' }}>{alert.text}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748B' }}>{alert.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Report Violation', icon: '⚠️', href: '/violations' },
                { label: 'Check Parcel', icon: '🗺️', href: '/zoning' },
                { label: 'Track Shipment', icon: '🚛', href: '/freight' },
                { label: 'Submit Report', icon: '📊', href: '/donors' },
                { label: 'New Inspection', icon: '🔍', href: '/construction/inspections' },
                { label: 'Order Materials', icon: '🧱', href: '/materials' },
              ].map((action, i) => (
                <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    background: '#0F172A', 
                    borderRadius: '8px', 
                    padding: '14px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1E293B'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0F172A'}
                  >
                    <span style={{ fontSize: '20px' }}>{action.icon}</span>
                    <span style={{ fontSize: '13px', color: '#E2E8F0' }}>{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '20px 24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#64748B' }}>
            <span>IVYAR Construction Governance Hub v2.0</span>
            <span style={{ margin: '0 12px' }}>•</span>
            <span>Powered by HBS Design System</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
            <Link href="/construction/help" style={{ color: '#94A3B8', textDecoration: 'none' }}>Help</Link>
            <Link href="/construction/settings" style={{ color: '#94A3B8', textDecoration: 'none' }}>Settings</Link>
            <Link href="/construction/api" style={{ color: '#94A3B8', textDecoration: 'none' }}>API Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
