export default function AdminDashboard() {
  const stats = {
    totalVeterans: 127,
    totalApplications: 89,
    pendingReview: 23,
    approved: 45,
    allocated: 18,
    totalHectares: 8500,
    allocatedHectares: 1850
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', background: '#1A1A1A', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px', color: '#FFD500' }}>
        АДМІН ПАНЕЛЬ IVYAR
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        <div style={{ background: '#005BBB', padding: '30px', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>ВСЬОГО ВЕТЕРАНІВ</p>
          <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0', color: '#FFD500' }}>{stats.totalVeterans}</p>
        </div>

        <div style={{ background: '#2C2C2C', padding: '30px', borderRadius: '8px', border: '2px solid #005BBB' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>ЗАЯВОК</p>
          <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0' }}>{stats.totalApplications}</p>
        </div>

        <div style={{ background: '#FF6B00', padding: '30px', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>НА РОЗГЛЯДІ</p>
          <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0' }}>{stats.pendingReview}</p>
        </div>

        <div style={{ background: '#00AA00', padding: '30px', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>СХВАЛЕНО</p>
          <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '0' }}>{stats.approved}</p>
        </div>

      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#005BBB', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', margin: '0' }}>Земля героям, а не олігархам!</p>
      </div>
    </div>
  );
}
