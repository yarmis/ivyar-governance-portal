'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] rounded-xl flex items-center justify-center font-bold text-[#0D1117]">
              IV
            </div>
            <div>
              <span className="font-semibold text-lg">IVYAR</span>
              <span className="text-xs text-[#8B949E] block -mt-1">Governance Platform</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-[#8B949E] hover:text-white">Dashboard</Link>
            <Link href="/resources" className="text-sm text-[#8B949E] hover:text-white">Resources</Link>
            <Link href="/demos" className="text-sm text-[#8B949E] hover:text-white">AI Demos</Link>
            <Link href="/docs" className="text-sm text-[#8B949E] hover:text-white">Docs</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#A371F7]">IVYAR</span>
          </h1>
          <p className="text-xl text-[#8B949E] mb-6">
            For government partnerships, deployments, and institutional cooperation
          </p>
          <div className="inline-flex items-center gap-2 bg-[#161B22] border border-[#1F242C] rounded-full px-6 py-3">
            <span className="text-sm text-[#8B949E]">Ethical, transparent, AI‑aligned governance infrastructure</span>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#00A3FF]/10 via-[#A371F7]/10 to-[#00A3FF]/10 border border-[#1F242C] rounded-2xl p-8 text-center">
            <div className="text-sm text-[#8B949E] mb-4">Operating across</div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { country: 'USA', flag: '🇺🇸' },
                { country: 'Canada', flag: '🇨🇦' },
                { country: 'United Kingdom', flag: '🇬🇧' },
                { country: 'European Union', flag: '🇪🇺' },
                { country: 'Ukraine', flag: '🇺🇦' },
              ].map((location) => (
                <div key={location.country} className="flex items-center gap-2">
                  <span className="text-2xl">{location.flag}</span>
                  <span className="font-medium">{location.country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Inquiries */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl p-6 hover:border-[#00A3FF]/50 transition-colors">
              <div className="w-12 h-12 bg-[#00A3FF]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
              <p className="text-sm text-[#8B949E] mb-4">
                For general questions, media inquiries, and partnership opportunities
              </p>
              <a 
                href="mailto:contact@ivyar.org" 
                className="inline-flex items-center gap-2 text-[#00A3FF] hover:underline font-medium"
              >
                contact@ivyar.org
                <span>→</span>
              </a>
            </div>

            {/* Government & Institutional */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl p-6 hover:border-[#A371F7]/50 transition-colors">
              <div className="w-12 h-12 bg-[#A371F7]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Government & Institutional Programs</h3>
              <p className="text-sm text-[#8B949E] mb-4">
                For state-level deployments, ministry partnerships, and institutional cooperation
              </p>
              <a 
                href="mailto:gov-relations@ivyar.org" 
                className="inline-flex items-center gap-2 text-[#A371F7] hover:underline font-medium"
              >
                gov-relations@ivyar.org
                <span>→</span>
              </a>
            </div>

            {/* Technical Support */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl p-6 hover:border-[#3CCB7F]/50 transition-colors">
              <div className="w-12 h-12 bg-[#3CCB7F]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical & Deployment Support</h3>
              <p className="text-sm text-[#8B949E] mb-4">
                For implementation assistance, technical documentation, and deployment guidance
              </p>
              <a 
                href="mailto:support@ivyar.org" 
                className="inline-flex items-center gap-2 text-[#3CCB7F] hover:underline font-medium"
              >
                support@ivyar.org
                <span>→</span>
              </a>
            </div>

            {/* Security & Compliance */}
            <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl p-6 hover:border-[#F59E0B]/50 transition-colors">
              <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Security & Compliance</h3>
              <p className="text-sm text-[#8B949E] mb-4">
                For security assessments, vulnerability reports, and compliance inquiries
              </p>
              <a 
                href="mailto:security@ivyar.org" 
                className="inline-flex items-center gap-2 text-[#F59E0B] hover:underline font-medium"
              >
                security@ivyar.org
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Head Office */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl overflow-hidden">
            <div className="p-8 md:flex items-center gap-8">
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00A3FF]/20 to-[#A371F7]/20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🏢</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#8B949E] mb-1">Head Office (North America)</div>
                <h3 className="text-2xl font-bold mb-2">Seattle, Washington, USA</h3>
                <p className="text-[#8B949E] mb-4">
                  Strategic headquarters for North American operations, partnerships, and institutional relations.
                </p>
                <a 
                  href="https://www.ivyar.org" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#00A3FF] hover:underline font-medium"
                >
                  www.ivyar.org
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Platform Docs', href: '/docs', icon: '📚' },
              { label: 'AI Demos', href: '/demos', icon: '🧠' },
              { label: 'HBS Academy', href: '/academy', icon: '🎓' },
              { label: 'Resources', href: '/resources', icon: '📁' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 bg-[#161B22] border border-[#1F242C] rounded-xl p-4 hover:border-[#3D444D] transition-colors"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1F242C]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00A3FF] to-[#A371F7] rounded-lg flex items-center justify-center font-bold text-[#0D1117] text-sm">
              IV
            </div>
            <span className="font-semibold">IVYAR Governance Platform</span>
          </div>
          <p className="text-sm text-[#8B949E] mb-4">
            Ethical, transparent, AI‑aligned governance infrastructure
          </p>
          <div className="flex justify-center gap-6 text-sm text-[#6E7681]">
            <span>© 2024-2026 IVYAR. All rights reserved.</span>
            <span>•</span>
            <Link href="/docs" className="hover:text-white">Documentation</Link>
            <span>•</span>
            <Link href="/resources" className="hover:text-white">Resources</Link>
            <span>•</span>
            <a href="mailto:contact@ivyar.org" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
