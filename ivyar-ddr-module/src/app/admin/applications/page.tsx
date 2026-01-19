export default function ApplicationsPage() {
  const applications = [
    { id: 127, veteran: 'Іван Петренко', oblast: 'Чернігівська', hectares: 10, priority: 245, status: 'PENDING', date: '2026-01-15' },
    { id: 126, veteran: 'Олена Коваль', oblast: 'Житомирська', hectares: 8, priority: 220, status: 'APPROVED', date: '2026-01-14' },
    { id: 125, veteran: 'Андрій Шевченко', oblast: 'Київська', hectares: 12, priority: 198, status: 'UNDER_REVIEW', date: '2026-01-13' },
    { id: 124, veteran: 'Марія Бондар', oblast: 'Полтавська', hectares: 15, priority: 175, status: 'ALLOCATED', date: '2026-01-12' },
    { id: 123, veteran: 'Сергій Мельник', oblast: 'Чернігівська', hectares: 9, priority: 156, status: 'PENDING', date: '2026-01-11' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return '#FF6B00';
      case 'UNDER_REVIEW': return '#FFD500';
      case 'APPROVED': return '#00AA00';
      case 'ALLOCATED': return '#005BBB';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING': return 'На розгляді';
      case 'UNDER_REVIEW': return 'Перевірка';
      case 'APPROVED': return 'Схвалено';
      case 'ALLOCATED': return 'Розподілено';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', background: '#1A1A1A', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px', color: '#FFD500' }}>ЗАЯВКИ ВЕТЕРАНІВ</h1>

      <div style={{ background: '#2C2C2C', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#005BBB' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Ветеран</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Область</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Га</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Пріоритет</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Статус</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Дата</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr key={app.id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '15px' }}>#{app.id}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{app.veteran}</td>
                <td style={{ padding: '15px' }}>{app.oblast}</td>
                <td style={{ padding: '15px' }}>{app.hectares} га</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ background: '#FFD500', color: '#000', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                    {app.priority}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ background: getStatusColor(app.status), padding: '6px 12px', borderRadius: '4px', fontSize: '12px' }}>
                    {getStatusText(app.status)}
                  </span>
                </td>
                <td style={{ padding: '15px', opacity: 0.7 }}>{app.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
