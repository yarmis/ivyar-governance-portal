'use client';

import { useState, useEffect } from 'react';

const sections = [
  { id: 'governance', title: 'Governance & Oversight' },
  { id: 'identity', title: 'Identity, Access & Security' },
  { id: 'operations', title: 'Operations & Logistics' },
  { id: 'social', title: 'Social & Human Services' },
  { id: 'finance', title: 'Finance & Procurement' },
];

export function SidebarNav() {
  const [active, setActive] = useState('governance');

  useEffect(() => {
    const observers = sections.map((section) => {
      const el = document.getElementById(section.id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(section.id);
        },
        { threshold: 0.3 }
      );

      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <aside className="fixed left-8 top-40 hidden xl:flex flex-col gap-3 z-20">
      {sections.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={`text-sm transition ${active === s.id ? 'text-cyan-400 font-medium' : 'text-white/60 hover:text-white'}`}>
          {s.title}
        </a>
      ))}
    </aside>
  );
}
