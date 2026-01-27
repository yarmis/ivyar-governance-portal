'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GlobalSearch } from './GlobalSearch';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'HBS', href: '/hbs' },
  { label: 'Modules', href: '/modules' },
  { label: 'Documentation', href: '/docs' },
  { label: 'Dashboard', href: '/dashboard' },
];

interface HeaderProps {
  className?: string;
}

/**
 * IVYAR v2.3 — Header / Top Navigation
 * 
 * Features:
 * - Sticky positioning with backdrop blur
 * - Active state indicator
 * - Global Search (Cmd+K)
 * - Request Demo CTA
 * - Responsive mobile menu
 * - Language switcher integration
 */
export function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`
        sticky top-0 z-40 w-full
        bg-slate-900/80 backdrop-blur-md
        border-b border-slate-800
        transition-shadow duration-200
        ${isScrolled ? 'shadow-lg shadow-black/10' : ''}
        ${className}
      `}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
            aria-label="IVYAR Home"
          >
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm group-hover:bg-primary-500 transition-colors">
              IV
            </div>
            {/* Logo Text */}
            <span className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">
              IVYAR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-3 py-2 text-sm font-medium rounded-lg
                  transition-colors duration-150
                  ${isActive(item.href)
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }
                `}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
                {/* Active indicator */}
                {isActive(item.href) && (
                  <span 
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-500 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>     

{/* Global Search */}
<GlobalSearch className="hidden sm:flex" />


          {/* Language Switcher - Hidden on small screens */}
          <div className="hidden md:block">
          {/* Navigation Buttons */}
<div className="flex items-center gap-2 mr-4">
  <a href="/us" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
    Platform
  </a>
  <a href="/us/autopilot" className="px-4 py-2 text-sm font-medium bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 rounded-lg transition-colors">
    Autopilot AI
  </a>
</div>
<LanguageSwitcher />
          </div>

          {/* Request Demo CTA */}
          <Link
            href="/demo"
            className="
              hidden sm:inline-flex items-center gap-2
              px-4 py-2 text-sm font-semibold
              bg-gradient-to-r from-primary-600 to-primary-500
              hover:from-primary-500 hover:to-primary-400
              text-white rounded-lg
              shadow-lg shadow-primary-600/25
              transition-all duration-200
              hover:shadow-xl hover:shadow-primary-500/30
              hover:scale-[1.02]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
            "
          >
            <span>Request Demo</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`
          lg:hidden overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-4 space-y-2 border-t border-slate-800 bg-slate-900/95">
          {/* Mobile Search */}
          <div className="pb-3 border-b border-slate-800">
            <GlobalSearch className="w-full justify-start" />
          </div>

          {/* Navigation Links */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-4 py-2.5 text-sm font-medium rounded-lg
                transition-colors duration-150
                ${isActive(item.href)
                  ? 'text-white bg-primary-600/20 border-l-2 border-primary-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="pt-3 mt-3 border-t border-slate-800">
            <p className="px-4 mb-2 text-xs text-slate-500 uppercase tracking-wider">Language</p>
            <div className="px-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="pt-3 mt-3 border-t border-slate-800">
            <Link
              href="/demo"
              className="
                flex items-center justify-center gap-2
                w-full px-4 py-3 text-sm font-semibold
                bg-gradient-to-r from-primary-600 to-primary-500
                text-white rounded-lg
                transition-all duration-200
              "
            >
              <span>Request Demo</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
