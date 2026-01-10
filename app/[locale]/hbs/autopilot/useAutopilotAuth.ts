'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  role: string;
  category: string;
}

export function useAutopilotAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login?redirect=/hbs/autopilot');
          return;
        }
        
        const userData = await res.json();
        
        // ROOT ACCESS ONLY
        if (userData.category !== 'ROOT') {
          alert('⚠️ ACCESS DENIED: Autopilot requires ROOT access (admin@ivyar.org)');
          router.push('/');
          return;
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, [router]);

  return { user, loading };
}
