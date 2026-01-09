'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HbsDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('Demo mounted, starting timer...');
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev >= 100 ? 0 : prev + 10;
        console.log('Progress:', next);
        return next;
      });
    }, 500);
    
    return () => {
      console.log('Cleaning up timer');
      clearInterval(timer);
    };
  }, []);

  console.log('Rendering with progress:', progress);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', color: 'white', padding: '32px' }}>
      <Link href="/us/hbs" style={{ color: '#22d3ee', marginBottom: '16px', display: 'block' }}>
        ← BACK
      </Link>
      
      <h1 style={{ fontSize: '32px', color: '#22d3ee', marginBottom: '32px' }}>HBS Demo Mode</h1>
      
      <div style={{ background: '#1e293b', border: '1px solid #164e63', borderRadius: '8px', padding: '24px', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '20px', color: '#22d3ee', marginBottom: '16px' }}>Running Demo...</h2>
        
        <div style={{ height: '16px', background: '#334155', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
          <div 
            style={{ 
              height: '100%', 
              background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
              width: `${progress}%`,
              transition: 'width 0.5s'
            }} 
          />
        </div>
        
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>{progress}% Complete</p>
      </div>
    </div>
  );
}
