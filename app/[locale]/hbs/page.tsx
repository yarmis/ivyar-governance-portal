import Link from 'next/link';

export default async function HBSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <Link href={`/${locale}`} style={{ color: '#0070f3', textDecoration: 'none', fontSize: '16px' }}>
          ← Back to Home
        </Link>
      </div>

      <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '10px' }}>🏛️ HBS Module</h1>
      <h2 style={{ fontSize: '24px', fontWeight: '400', color: '#666', marginBottom: '30px' }}>
        Humanitarian Budget Support
      </h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px', 
        borderRadius: '16px',
        marginTop: '20px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '10px' }}>
          <strong style={{ opacity: 0.9 }}>Status:</strong>{' '}
          <span style={{ 
            background: 'rgba(34, 197, 94, 0.2)',
            padding: '4px 12px',
            borderRadius: '6px',
            fontWeight: '700',
            color: '#4ade80'
          }}>
            ✓ Core
          </span>
        </p>
        <p style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
          <strong style={{ opacity: 0.9 }}>API Endpoints:</strong>{' '}
          <span style={{ 
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 12px',
            borderRadius: '6px',
            fontWeight: '700'
          }}>
            8
          </span>
        </p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>Overview</h3>
        <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#374151' }}>
          The Humanitarian Budget Support (HBS) module provides comprehensive 
          tools for ethical governance and transparent humanitarian aid distribution.
        </p>

        <h3 style={{ fontSize: '28px', fontWeight: '600', marginTop: '40px', marginBottom: '16px' }}>
          Key Features
        </h3>
        <ul style={{ fontSize: '18px', lineHeight: '2', color: '#374151' }}>
          <li>📊 Budget tracking and transparency</li>
          <li>🌍 Humanitarian aid distribution management</li>
          <li>⚖️ Ethical governance frameworks</li>
          <li>🤖 AI-powered decision support</li>
          <li>📋 Full audit trail and compliance</li>
        </ul>
      </div>
    </main>
  );
}
