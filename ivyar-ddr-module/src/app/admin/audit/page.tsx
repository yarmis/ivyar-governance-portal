export default function AuditPage() {
  const logs = [
    { id: 1, user: 'Оператор Петров', action: 'APPROVE', resource: 'Заявка #127', time: '2026-01-18 18:15', ip: '192.168.1.100' },
    { id: 2, user: 'Комісія Іванова', action: 'REVIEW', resource: 'Заявка #126', time: '2026-01-18 17:45', ip: '192.168.1.101' },
    { id: 3, user: 'Система', action: 'CREATE', resource: 'Ветеран #127', time: '2026-01-18 16:30', ip: '192.168.1.102' },
    { id: 4, user: 'Оператор Сидоров', action: 'UPDATE', resource: 'Ділянка UA-CHE-001', time: '2026-01-18 15:20', ip: '192.168.1.103' },
    { id: 5, user: 'Комісія Коваленко', action: 'ALLOCATE', resource: 'Заявка #125', time: '2026-01-18 14:10', ip: '192.168.1.104' },
    { id: 6, user: 'Аудитор Шевченко', action: 'VIEW', resource: 'Звіт 2026-01', time: '2026-01-18 13:05', ip: '192.168.1.105' },
    { id: 7, user: 'Система', action: 'CALCULATE', resource: 'Пріоритет #124', time: '2026-01-18 12:00', ip: 'system' },
  ];

  const getActionColor = (action: string) => {
    switch(action) {
      case 'APPROVE': return '#00AA00';
      case 'ALLOCATE': return '#005BBB';
      case 'CREATE': return '#FFD500';
      case 'UPDATE': return '#FF6B00';
      case 'REVIEW': return '#9C27B0';
      case 'VIEW': return '#666';
      default: return '#666';
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', background: '#1A1A1A', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#FFD500' }}>ЖУРНАЛ АУДИТУ</h1>
      <p style={{ marginBottom: '30px', opacity: 0.7 }}>Всі дії в системі записуються для прозорості</p>

      <div style={{ background: '#2C2C2C', borderRadius: '8px', padding: '20px' }}>
        {logs.map(log => (
          <div key={log.id} style={{ 
            borderBottom: '1px solid #444',
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ 
                  background: getActionColor(log.action),
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {log.action}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{log.resource}</span>
              </div>
              <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '14px' }}>
                👤 {log.user} • 📍 {log.ip}
              </p>
            </div>

            <div style={{ textAlign: 'right', opacity: 0.6, fontSize: '13px' }}>
              {log.time}
            </div>

          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#005BBB', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          🔒 Всі записи незмінні • Blockchain гарантує прозорість
        </p>
      </div>
    </div>
  );
}
