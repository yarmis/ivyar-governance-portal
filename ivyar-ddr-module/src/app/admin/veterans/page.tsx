export default function VeteransPage() {
  const veterans = [
    { id: 1, name: 'Іван Петренко', email: 'ivan@example.com', combat: 450, disability: 0, priority: 245, level: 'БОЙОВИЙ' },
    { id: 2, name: 'Олена Коваль', email: 'olena@example.com', combat: 380, disability: 2, priority: 220, level: 'БОЙОВИЙ' },
    { id: 3, name: 'Андрій Шевченко', email: 'andriy@example.com', combat: 290, disability: 1, priority: 198, level: 'ІНВАЛІД' },
    { id: 4, name: 'Марія Бондар', email: 'maria@example.com', combat: 0, disability: 3, priority: 175, level: 'ІНВАЛІД' },
    { id: 5, name: 'Сергій Мельник', email: 'sergiy@example.com', combat: 180, disability: 0, priority: 156, level: 'ДОВГА СЛУЖБА' },
  ];

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', background: '#1A1A1A', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px', color: '#FFD500' }}>ВЕТЕРАНИ В СИСТЕМІ</h1>

      <div style={{ display: 'grid', gap: '20px' }}>
        {veterans.map(vet => (
          <div key={vet.id} style={{ background: '#2C2C2C', padding: '25px', borderRadius: '8px', border: '2px solid #005BBB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '20px', margin: '0 0 10px 0', color: '#FFD500' }}>{vet.name}</h3>
              <p style={{ margin: '5px 0', opacity: 0.7 }}>{vet.email}</p>
            </div>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 5px 0' }}>Бойові дні</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{vet.combat}</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 5px 0' }}>Інвалідність</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{vet.disability > 0 ? `Група ${vet.disability}` : '-'}</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 5px 0' }}>Пріоритет</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#FFD500' }}>{vet.priority}</p>
              </div>

              <div>
                <span style={{ 
                  background: vet.priority >= 200 ? '#00AA00' : vet.priority >= 100 ? '#FF6B00' : '#666',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  {vet.level}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
