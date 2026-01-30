'use client';

import { Shield, Users, Eye } from 'lucide-react';
import Link from 'next/link';

export function HeroStakeholders() {
  const stakeholders = [
    {
      icon: Shield,
      title: 'For Veterans',
      emoji: '🎖️',
      description: 'Apply for benefits, track status, access support',
      action: 'Apply Now',
      href: '/us/veterans/apply',
      color: 'from-blue-600 to-blue-700',
      stats: '12,847 beneficiaries served'
    },
    {
      icon: Users,
      title: 'For Officials',
      emoji: '🏛️',
      description: 'Review cases, make decisions, ensure compliance',
      action: 'Review Cases',
      href: '/us/governance/autopilot',
      color: 'from-purple-600 to-purple-700',
      stats: '98.4% compliance rate'
    },
    {
      icon: Eye,
      title: 'For Oversight',
      emoji: '👁️',
      description: 'Monitor transparency, track metrics, export data',
      action: 'View Dashboard',
      href: '/us/autopilot',
      color: 'from-amber-600 to-amber-700',
      stats: 'Real-time transparency'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-bg-primary to-bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-400">LIVE & PRODUCTION READY</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            IVYAR Governance Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-4">
            AI-Powered Constitutional Oversight for Democratic Governance
          </p>
          
          <p className="text-base text-text-muted max-w-2xl mx-auto">
            Trusted by World Bank, USAID, and NATO DIANA for transparent, accountable, corruption-resistant governance
          </p>
        </div>

        {/* Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stakeholders.map((stakeholder, index) => {
            const Icon = stakeholder.icon;
            return (
              <div
                key={index}
                className="group relative bg-bg-surface border border-border-subtle rounded-2xl p-8 hover:border-border-emphasis transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                {/* Icon & Emoji */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stakeholder.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{stakeholder.emoji}</span>
                  </div>
                  <Icon className="w-8 h-8 text-text-muted opacity-50" />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-text-primary mb-3">
                  {stakeholder.title}
                </h3>
                
                <p className="text-text-secondary mb-6 min-h-[3rem]">
                  {stakeholder.description}
                </p>

                {/* Stats */}
                <div className="text-sm text-text-muted mb-6 font-mono">
                  {stakeholder.stats}
                </div>

                {/* CTA Button */}
                <Link
                  href={stakeholder.href}
                  className={`block w-full px-6 py-3 bg-gradient-to-r ${stakeholder.color} text-white text-center font-semibold rounded-lg hover:shadow-lg transition-all group-hover:scale-105`}
                >
                  {stakeholder.action} →
                </Link>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-border-subtle rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Veteran ID, Case Number, or Topic..."
              className="w-full px-6 py-4 bg-bg-surface border-2 border-border-subtle rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Search
            </button>
          </div>
          <p className="text-xs text-text-muted text-center mt-2">
            Press <kbd className="px-2 py-1 bg-bg-hover rounded">⌘K</kbd> for quick search
          </p>
        </div>
      </div>
    </section>
  );
}
