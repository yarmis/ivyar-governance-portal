'use client';

import { useState } from 'react';
import Link from 'next/link';
import AutopilotWidget from '@/components/AutopilotWidget';

// ============================================================================
// TYPES
// ============================================================================

type USCISCategory = 'family' | 'n400' | 'employment' | 'nonimmigrant' | 'humanitarian';

interface CategoryCard {
  id: USCISCategory;
  title: string;
  forms: string;
  description: string;
  icon: string;
  severity: 'standard' | 'complex' | 'critical';
}

// ============================================================================
// DATA
// ============================================================================

const CATEGORIES: CategoryCard[] = [
  {
    id: 'family',
    title: 'Family-Based Immigration',
    forms: 'I-130, I-485, I-765, I-131',
    description: 'General information about family-based petitions and adjustment of status',
    icon: '👨‍👩‍👧‍👦',
    severity: 'standard',
  },
  {
    id: 'n400',
    title: 'Naturalization (N-400)',
    forms: 'N-400',
    description: 'General information about becoming a U.S. citizen through naturalization',
    icon: '🇺🇸',
    severity: 'standard',
  },
  {
    id: 'employment',
    title: 'Employment-Based Immigration',
    forms: 'I-140, I-485, PERM',
    description: 'General information about employment-based green cards',
    icon: '💼',
    severity: 'complex',
  },
  {
    id: 'nonimmigrant',
    title: 'Visa Extensions & Changes',
    forms: 'I-539, I-129',
    description: 'General information about extending or changing non-immigrant status',
    icon: '📋',
    severity: 'complex',
  },
  {
    id: 'humanitarian',
    title: 'Humanitarian Programs',
    forms: 'I-589, TPS',
    description: 'Very general information - attorney consultation REQUIRED',
    icon: '🆘',
    severity: 'critical',
  },
];

const SEVERITY_STYLES = {
  standard: {
    border: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.05)',
    badge: '#3B82F6',
  },
  complex: {
    border: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.05)',
    badge: '#F59E0B',
  },
  critical: {
    border: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.05)',
    badge: '#EF4444',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function USCISIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState<USCISCategory | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E2E8F0' }}>
      {/* Header */}
      <header style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#E2E8F0' }}>
              <div style={{ width: '32px', height: '32px', background: '#3B82F6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>IV</div>
              <span style={{ fontWeight: 600, fontSize: '18px' }}>IVYAR</span>
            </Link>
            <span style={{ color: '#64748B' }}>•</span>
            <span style={{ fontWeight: 600, fontSize: '18px' }}>🇺🇸 USCIS Intelligence</span>
          </div>
          <Link href="/" style={{ padding: '8px 16px', background: '#334155', borderRadius: '6px', textDecoration: 'none', color: '#E2E8F0', fontSize: '14px' }}>
            ← Back to Portal
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '60px 24px', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', marginBottom: '24px' }}>
            <span style={{ fontSize: '20px' }}>🇺🇸</span>
            <span style={{ color: '#60A5FA', fontSize: '14px', fontWeight: 500 }}>U.S.-Developed • Informational Only</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 16px 0', background: 'linear-gradient(to right, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            USCIS Intelligence Assistant
          </h1>
          <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '800px', marginBottom: '24px' }}>
            Informational assistant helping you understand U.S. immigration processes, prepare documentation, and interpret common USCIS case statuses.
          </p>
          
          {/* Critical Disclaimer Box */}
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #EF4444', borderRadius: '12px', padding: '20px', maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>⚖️</span>
              <div>
                <div style={{ fontWeight: 600, color: '#FCA5A5', marginBottom: '8px', fontSize: '16px' }}>IMPORTANT LEGAL DISCLAIMER</div>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#E2E8F0' }}>
                  This tool provides <strong>general information only</strong> and does <strong>NOT</strong> provide legal advice.
                  It does <strong>NOT</strong> submit applications, does <strong>NOT</strong> interact with USCIS systems, and does <strong>NOT</strong> check your case status.
                  <br /><br />
                  <strong>Every immigration case is different.</strong> You should consult a qualified immigration attorney licensed in your state for guidance on your specific situation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Select Information Category</h2>
            <p style={{ color: '#94A3B8', fontSize: '16px' }}>Choose the type of immigration process you need information about</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {CATEGORIES.map((category) => {
              const severity = SEVERITY_STYLES[category.severity];
              return (
                <div
                  key={category.id}
                  style={{
                    background: severity.bg,
                    border: `2px solid ${severity.border}`,
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }}
                  onClick={() => setSelectedCategory(category.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(59, 130, 246, 0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {category.severity === 'critical' && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#EF4444', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: '#fff' }}>
                      ATTORNEY REQUIRED
                    </div>
                  )}

                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>{category.icon}</div>
                  
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#E2E8F0' }}>{category.title}</h3>
                  
                  <div style={{ fontSize: '12px', color: severity.badge, fontWeight: 500, marginBottom: '12px', fontFamily: 'monospace' }}>
                    {category.forms}
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '16px' }}>
                    {category.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: severity.badge, fontSize: '14px', fontWeight: 500 }}>
                    <span>Get Information</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid #334155', background: '#161B22' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px' }}>Official Resources</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px', textDecoration: 'none', color: '#E2E8F0', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏛️</div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>USCIS Official Website</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Check case status, download forms, find processing times</div>
            </a>

            <a href="https://www.uscis.gov/avoid-scams/find-legal-services" target="_blank" rel="noopener noreferrer" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px', textDecoration: 'none', color: '#E2E8F0', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚖️</div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Find an Attorney</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>USCIS-provided resources for finding qualified legal help</div>
            </a>

            <a href="https://www.justice.gov/eoir/list-pro-bono-legal-service-providers" target="_blank" rel="noopener noreferrer" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px', textDecoration: 'none', color: '#E2E8F0', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🆓</div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Free Legal Services</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Pro bono legal service providers directory</div>
            </a>

            <a href="https://egov.uscis.gov/casestatus/landing.do" target="_blank" rel="noopener noreferrer" style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '20px', textDecoration: 'none', color: '#E2E8F0', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; }}>
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Check Case Status</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Official USCIS case status checker (requires receipt number)</div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1E293B', borderTop: '1px solid #334155', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#E2E8F0' }}>⚖️ Legal Disclaimer</div>
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#94A3B8' }}>
              The USCIS Intelligence Assistant is an informational tool only. It does not provide legal advice, does not submit applications, 
              and does not interact with USCIS systems. All information provided is general in nature and may not apply to your specific situation. 
              Every immigration case is unique and complex. You should consult a qualified immigration attorney licensed in your state for guidance 
              on your specific case. No attorney-client relationship is created by using this tool.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
            <span>IVYAR USCIS Intelligence v1.0 • U.S.-Developed</span>
            <span>Informational Only • Not Legal Advice • Consult an Attorney</span>
          </div>
        </div>
      </footer>

      {/* AI Assistant - automatically detects category */}
      <AutopilotWidget />
    </div>
  );
}
