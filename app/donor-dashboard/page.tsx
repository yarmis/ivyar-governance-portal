'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonorDashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/donors');
  }, [router]);
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white' }}>
      <div>Redirecting to Donors Portal...</div>
    </div>
  );
}
