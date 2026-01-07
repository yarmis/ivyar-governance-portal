"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: '/construction', label: 'Dashboard', icon: '🏛️' },
  { href: '/materials', label: 'Materials', icon: '🧱' },
  { href: '/zoning', label: 'Zoning', icon: '🗺️' },
  { href: '/violations', label: 'Violations', icon: '⚠️' },
  { href: '/donors', label: 'Donors', icon: '💰' },
  { href: '/freight', label: 'Freight', icon: '🚛' },
];

export function GlobalNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '72px',
      background: '#0F172A',
      borderRight: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/construction" style={{ marginBottom: '24px', textDecoration: 'none' }}>
        <div style={{
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 700,
          color: 'white',
        }}>
          IV
        </div>
      </Link>

      {/* Nav Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} title={item.label}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                background: isActive ? '#1E293B' : 'transparent',
                border: isActive ? '1px solid #334155' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {item.icon}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/construction/settings" style={{ textDecoration: 'none' }} title="Settings">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
          }}>
            ⚙️
          </div>
        </Link>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          background: '#334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
          color: '#E2E8F0',
          cursor: 'pointer',
        }}>
          UA
        </div>
      </div>
    </nav>
  );
}

// Compact top navigation bar
export function TopNav({ title, titleUk }: { title: string; titleUk?: string }) {
  return (
    <div style={{
      background: '#1E293B',
      borderBottom: '1px solid #334155',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <Link href="/construction" style={{ 
        color: '#60A5FA', 
        textDecoration: 'none', 
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        ← Hub
      </Link>
      <div style={{ width: '1px', height: '20px', background: '#475569' }} />
      <div>
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h1>
        {titleUk && <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{titleUk}</p>}
      </div>
    </div>
  );
}

// Breadcrumb component
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {i > 0 && <span style={{ color: '#475569' }}>/</span>}
          {item.href ? (
            <Link href={item.href} style={{ color: '#60A5FA', textDecoration: 'none' }}>{item.label}</Link>
          ) : (
            <span style={{ color: '#E2E8F0' }}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
