'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HbsDemo() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev >= 100 ? 0 : prev + 10;
        if (next === 0) setStep(0);
        else if (next === 30) setStep(1);
        else if (next === 60) setStep(2);
        else if (next === 90) setStep(3);
        return next;
      });
    }, 500);
    
    return () => clearInterval(timer);
  }, []);

  const steps = [
    '✓ Initializing HBS Demo Environment...',
    '✓ Loading sample budget data...',
    '✓ Configuring AI governance modules...',
    '✓ Demo environment ready!'
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', color: 'white', padding: '32px' }}>
      <Link href="/us/hbs" style={{ color: '#22d3ee', marginBottom: '16px', display: 'block', textDecoration: 'none' }}>
        ← BACK
      </Link>
      
      <h1 style={{ fontSize: '32px', color: '#22d3ee', marginBottom: '32px', fontFamily: 'monospace' }}>
        HBS Demo Mode
      </h1>
      
      <div style={{ background: '#1e293b', border: '1px solid #164e63', borderRadius: '8px', padding: '24px', maxWidth: '700px' }}>
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
        
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', fontFamily: 'monospace' }}>
          {progress}% Complete
        </p>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {steps.map((text, i) => (
            <p 
              key={i}
              style={{ 
                color: i <= step ? '#22d3ee' : '#64748b', 
                fontSize: '14px',
                transition: 'color 0.3s'
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {progress === 100 && (
          <div style={{ marginTop: '24px', padding: '16px', background: '#0f766e', borderRadius: '4px' }}>
            <p style={{ color: '#5eead4', fontSize: '14px', margin: 0 }}>
              🎉 Demo complete! The HBS module is ready for institutional deployment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
