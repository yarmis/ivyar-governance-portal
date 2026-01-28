'use client';

import { useTranslation } from '@/i18n/useTranslation';
import Link from 'next/link';

export default function DonorDemoPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full text-accent-cyan text-sm font-medium mb-6">
            🌍 AI-Powered Governance Platform
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-accent-cyan to-white bg-clip-text text-transparent">
            IVYAR Governance Platform
          </h1>
          
          <p className="text-2xl text-white/70 mb-4 max-w-3xl mx-auto">
            Institutional-Grade AI Infrastructure for Transparent Governance
          </p>
          
          <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto">
            Trusted by World Bank • USAID • NATO DIANA
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/us/hbs" 
              className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-teal text-bg-obsidian rounded-lg font-semibold hover:shadow-glow-strong transition-all"
            >
              Live Demo →
            </Link>
            <a 
              href="mailto:info@ivyar.org?subject=Partnership Inquiry" 
              className="px-8 py-4 border border-border-subtle rounded-lg font-semibold hover:bg-white/5 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: '9.6M', label: 'Users Ready', sublabel: 'Ukrainian Citizens' },
              { value: '20+', label: 'AI Modules', sublabel: 'Production Ready' },
              { value: '3', label: 'Languages', sublabel: 'US/UA/ES' },
              { value: '99.97%', label: 'Uptime', sublabel: 'NATO-Grade' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white/[0.03] border border-white/10 rounded-lg">
                <div className="text-4xl font-bold text-accent-cyan mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-white/50">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Use Cases for Development Institutions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏛️',
                title: 'World Bank Projects',
                desc: 'Transparent fund allocation, AI-powered compliance monitoring, real-time impact tracking'
              },
              {
                icon: '🇺🇦',
                title: 'USAID Programs',
                desc: 'Democracy defense tools, anti-corruption AI, public feedback systems'
              },
              {
                icon: '🛡️',
                title: 'NATO DIANA',
                desc: 'Defense innovation tracking, secure communications, institutional oversight'
              }
            ].map((useCase, i) => (
              <div key={i} className="p-8 bg-white/[0.03] border border-white/10 rounded-lg hover:border-accent-cyan/40 transition-all">
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-white/70">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Enterprise-Grade Technology</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Next.js 16', 'TypeScript', 'AI/ML Ready', 'Blockchain',
              'PostgreSQL', 'Vercel CDN', 'NATO Security', 'Multi-language'
            ].map((tech, i) => (
              <div key={i} className="p-6 bg-white/[0.03] border border-white/10 rounded-lg text-center font-semibold">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Governance?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join leading institutions in building transparent, AI-powered governance
          </p>
          
          <div className="flex gap-4 justify-center">
            <a 
              href="mailto:info@ivyar.org?subject=Demo Request&body=Hello IVYAR Team,%0D%0A%0D%0AI'm interested in scheduling a demo of the IVYAR Governance Platform.%0D%0A%0D%0AOrganization:%0D%0ARole:%0D%0AUse Case:%0D%0A%0D%0AThank you!" 
              className="px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-teal text-bg-obsidian rounded-lg font-semibold hover:shadow-glow-strong transition-all"
            >
              📧 Request Demo
            </a>
            <Link 
              href="/us/hbs/autopilot" 
              className="px-8 py-4 border border-border-subtle rounded-lg font-semibold hover:bg-white/5 transition-all"
            >
              🤖 Try AI Autopilot
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white/50 mb-4">
            🇺🇸 Built in USA • 💙💛 Inspired by Ukraine • 🌍 Designed for the World
          </div>
          <div className="text-white/30 text-sm">
            © 2024-2026 IVYAR LLC. All Rights Reserved. | info@ivyar.org
          </div>
        </div>
      </footer>
    </div>
  );
}
