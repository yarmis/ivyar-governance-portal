import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1A1A1A' }}>
      
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        background: '#2C2C2C', 
        padding: '30px 20px',
        borderRight: '2px solid #005BBB'
      }}>
        <h2 style={{ 
          color: '#FFD500', 
          fontSize: '24px', 
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          🇺🇦 IVYAR ADMIN
        </h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link href="/admin/dashboard" style={{ 
            display: 'block', 
            padding: '15px 20px', 
            color: '#fff', 
            textDecoration: 'none',
            background: '#005BBB',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}>
            📊 Дашборд
          </Link>

          <Link href="/admin/applications" style={{ 
            display: 'block', 
            padding: '15px 20px', 
            color: '#fff', 
            textDecoration: 'none',
            background: '#444',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}>
            📋 Заявки
          </Link>

          <Link href="/admin/veterans" style={{ 
            display: 'block', 
            padding: '15px 20px', 
            color: '#fff', 
            textDecoration: 'none',
            background: '#444',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}>
            🎖️ Ветерани
          </Link>

          <Link href="/admin/audit" style={{ 
            display: 'block', 
            padding: '15px 20px', 
            color: '#fff', 
            textDecoration: 'none',
            background: '#444',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}>
            📜 Аудит
          </Link>
        </nav>

        <div style={{ 
          marginTop: '50px', 
          padding: '15px', 
          background: '#005BBB', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', margin: 0 }}>Земля героям!</p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
