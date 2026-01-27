"use client";

import { useTranslation } from '@/i18n/useTranslation';
import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GovernanceMesh } from '@/components/GovernanceMesh';
import GovernanceCard from './components/GovernanceCard';
import BoundaryTest from './components/BoundaryTest';
import AuditCompliance from './components/AuditCompliance';
import IntegrationMap from './components/IntegrationMap';
import { GOVERNANCE_CARDS } from './components/governance-cards-data';
import { Shield, Sparkles, Scale, Lock, FileCheck } from 'lucide-react';

// Import governance rules (static JSON)
import governanceRules from './governance-rules.json';

export default function GovernanceAutopilotPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-obsidian text-text-primary relative overflow-hidden">
      <GovernanceMesh />
      <ScrollProgress />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-8 animate-in slide-in-from-left">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/40 shadow-glow">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium tracking-wide">
                {t.governanceAutopilot?.hero?.badge || 'GOVERNANCE AUTOPILOT'}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-display-xl mb-6 max-w-4xl animate-in slide-in-from-left delay-100 bg-gradient-to-r from-text-primary via-amber-400 to-text-primary bg-clip-text text-transparent">
              {t.governanceAutopilot?.hero?.title || 'Constitutional Layer for AI Authority & Boundaries'}
            </h1>

            {/* Intro Text */}
            <div className="space-y-4 text-body-l text-text-secondary max-w-3xl mb-10 animate-in slide-in-from-left delay-200 leading-relaxed">
              <p>{t.governanceAutopilot?.hero?.intro1}</p>
              <p>{t.governanceAutopilot?.hero?.intro2}</p>
              <p>
                <strong className="text-amber-400">Governance Autopilot</strong> {t.governanceAutopilot?.hero?.intro3}
              </p>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-in slide-in-from-left delay-300">
              {/* Constitutional Layer */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-card blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-3 px-5 py-4 bg-bg-surface/90 backdrop-blur border border-border-subtle rounded-card hover:border-amber-500/40 transition-all">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-label-xs text-text-secondary uppercase tracking-wide mb-0.5">Layer Type</div>
                    <div className="text-label-m font-semibold text-amber-400">
                      {t.governanceAutopilot?.hero?.layerType || 'Constitutional'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules Enforced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-card blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-3 px-5 py-4 bg-bg-surface/90 backdrop-blur border border-border-subtle rounded-card hover:border-green-500/40 transition-all">
                  <Lock className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-label-xs text-text-secondary uppercase tracking-wide mb-0.5">Enforcement</div>
                    <div className="text-label-m font-semibold text-green-400">
                      {t.governanceAutopilot?.hero?.enforcement || 'Runtime Active'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Ready */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-teal/20 rounded-card blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-3 px-5 py-4 bg-bg-surface/90 backdrop-blur border border-border-subtle rounded-card hover:border-accent-cyan/40 transition-all">
                  <FileCheck className="w-5 h-5 text-accent-cyan" />
                  <div>
                    <div className="text-label-xs text-text-secondary uppercase tracking-wide mb-0.5">Transparency</div>
                    <div className="text-label-m font-semibold text-accent-cyan">
                      {t.governanceAutopilot?.hero?.transparency || 'Audit Ready'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20 rounded-card p-8">
              <h2 className="text-heading-l mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400" />
                {t.governanceAutopilot?.purpose?.title || 'Why This Layer Exists'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  t.governanceAutopilot?.purpose?.delegatedAuthority,
                  t.governanceAutopilot?.purpose?.admissibility,
                  t.governanceAutopilot?.purpose?.runtimeBoundaries,
                  t.governanceAutopilot?.purpose?.refusalLogic,
                  t.governanceAutopilot?.purpose?.intentPreservation,
                  t.governanceAutopilot?.purpose?.constitutionalFoundation
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-bg-surface/50 backdrop-blur rounded-lg">
                    <div className="text-label-m font-semibold text-amber-400 mb-1">
                      {item?.title}
                    </div>
                    <p className="text-body-s text-text-secondary">
                      {item?.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Governance Model - 10 Cards */}
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-heading-l mb-2">
                {t.governanceAutopilot?.governanceModel?.title || 'Governance Model'}
              </h2>
              <p className="text-body-m text-text-secondary">
                {t.governanceAutopilot?.governanceModel?.subtitle || '10 constitutional mechanisms that define AI authority and boundaries'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {GOVERNANCE_CARDS.map((card) => (
                <GovernanceCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </section>

        {/* Boundary Test - Interactive */}
        <section className="pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <BoundaryTest rules={governanceRules} />
          </div>
        </section>

        {/* Audit & Compliance */}
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <AuditCompliance rules={governanceRules} />
          </div>
        </section>

        {/* Integration Map */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <IntegrationMap />
          </div>
        </section>

        {/* Final Message */}
        <section className="pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-card p-8 text-center">
              <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-heading-l mb-3 text-amber-400">
                {t.governanceAutopilot?.footer?.title || 'The Constitutional Foundation of Trustworthy AI'}
              </h2>
              <p className="text-body-l text-text-secondary max-w-2xl mx-auto leading-relaxed">
                {t.governanceAutopilot?.footer?.text || 'Governance Autopilot does not replace the decision engine. It defines the boundaries within which the decision engine must operate.'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
