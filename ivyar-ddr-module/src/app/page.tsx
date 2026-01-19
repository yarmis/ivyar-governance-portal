import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Hero Section */}
      <div style={{ 
        padding: '80px 40px',
        textAlign: 'center',
        borderBottom: '3px solid #FFD500'
      }}>
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          background: 'linear-gradient(90deg, #005BBB 0%, #FFD500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🇺🇦 IVYAR
        </h1>
        <h2 style={{ 
          fontSize: '32px', 
          margin: '0 0 30px 0',
          color: '#FFD500',
          fontWeight: 'normal'
        }}>
          Land Registry & Veteran Grant Module
        </h2>
        <p style={{ 
          fontSize: '18px', 
          maxWidth: '800px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
          opacity: 0.9
        }}>
          Цифрова платформа для справедливого розподілу землі українським ветеранам. 
          Blockchain гарантує прозорість. Математика замість корупції.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin/dashboard" style={{
            padding: '16px 40px',
            background: '#005BBB',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            border: '2px solid #005BBB'
          }}>
            🎯 Admin Panel
          </Link>
          
          <a href="https://ivyar-mobile-app-v2.vercel.app" target="_blank" style={{
            padding: '16px 40px',
            background: 'transparent',
            color: '#FFD500',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid #FFD500',
            transition: 'all 0.3s'
          }}>
            📱 Mobile App
          </a>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ padding: '60px 40px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '36px', 
          marginBottom: '50px',
          color: '#FFD500'
        }}>
          📊 Pilot Program Statistics
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          <div style={{ 
            background: '#005BBB',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid #FFD500'
          }}>
            <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 15px 0' }}>TARGET VETERANS</p>
            <p style={{ fontSize: '56px', fontWeight: 'bold', margin: '0', color: '#FFD500' }}>1,000</p>
          </div>

          <div style={{ 
            background: '#2C2C2C',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid #005BBB'
          }}>
            <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 15px 0' }}>TOTAL HECTARES</p>
            <p style={{ fontSize: '56px', fontWeight: 'bold', margin: '0' }}>10,000</p>
          </div>

          <div style={{ 
            background: '#2C2C2C',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid #00AA00'
          }}>
            <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 15px 0' }}>DURATION</p>
            <p style={{ fontSize: '56px', fontWeight: 'bold', margin: '0', color: '#00AA00' }}>12 mo</p>
          </div>

          <div style={{ 
            background: '#2C2C2C',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '3px solid #FFD500'
          }}>
            <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 15px 0' }}>BUDGET</p>
            <p style={{ fontSize: '56px', fontWeight: 'bold', margin: '0', color: '#FFD500' }}>$5-8M</p>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        padding: '60px 40px',
        background: '#2C2C2C'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '36px', 
          marginBottom: '50px',
          color: '#FFD500'
        }}>
          ⚡ Key Features
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          <div style={{ padding: '30px', borderLeft: '4px solid #005BBB' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#FFD500' }}>📐 Priority Algorithm</h3>
            <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
              Objective scoring: Combat days (0-150), Disability (0-90), Service years (0-40). 
              No corruption - pure mathematics.
            </p>
          </div>

          <div style={{ padding: '30px', borderLeft: '4px solid #FFD500' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#FFD500' }}>⛓️ Blockchain</h3>
            <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
              Smart contracts ensure transparency. Every allocation recorded immutably. 
              Anti-corruption oracle monitors all transactions.
            </p>
          </div>

          <div style={{ padding: '30px', borderLeft: '4px solid #00AA00' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#FFD500' }}>📱 Mobile First</h3>
            <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
              Veterans apply from their phones. Real-time status updates. 
              Works offline - essential for frontline areas.
            </p>
          </div>

          <div style={{ padding: '30px', borderLeft: '4px solid #FF6B00' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#FFD500' }}>🔒 Audit Trail</h3>
            <p style={{ lineHeight: '1.6', opacity: 0.9 }}>
              Every action logged. Who, what, when, why. 
              Full transparency for donors and public oversight.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        borderTop: '3px solid #005BBB',
        background: '#1A1A1A'
      }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px', color: '#FFD500' }}>
          🇺🇦 Земля героям, а не олігархам!
        </p>
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>
          Built in the United States. Shaped by Ukrainian resilience. Designed for governments worldwide.
        </p>
        <p style={{ opacity: 0.5, fontSize: '14px' }}>
          IVYAR LLC © 2026 • World Bank Pilot Program
        </p>
      </div>

    </div>
  );
}

