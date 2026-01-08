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
        <Link href={`/${locale}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>

      <h1>🏛️ HBS Module</h1>
      <h2>Humanitarian Budget Support</h2>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px' 
      }}>
        <p><strong>Status:</strong> <span style={{color: '#22c55e'}}>Core</span></p>
        <p><strong>API Endpoints:</strong> 8</p>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Overview</h3>
        <p>
          The Humanitarian Budget Support (HBS) module provides comprehensive 
          tools for ethical governance and transparent humanitarian aid distribution.
        </p>

        <h3 style={{ marginTop: '30px' }}>Key Features</h3>
        <ul style={{ lineHeight: '1.8' }}>
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
