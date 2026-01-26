'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GovernanceMesh } from '@/components/GovernanceMesh';
import { 
  AutopilotCard, 
  AutopilotMetrics, 
  AutopilotControls,
  LiveSimulation
} from '@/components/autopilot';
import { getAutopilotByCategory } from '@/data/autopilot-modules';
import { getTranslatedModules } from '@/lib/utils/get-translated-modules';
import { Brain, Sparkles, Download, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadJSON, copyToClipboard } from '@/lib/utils/helpers';
import type { SortBy, SortOrder, FilterStatus } from '@/components/autopilot/AutopilotControls';

const categories = [
  'Governance & Oversight',
  'Operations & Logistics', 
  'Finance & Procurement'
];

export default function AutopilotPage() {
  const { t, locale } = useTranslation();
  const autopilotModules = useMemo(() => getTranslatedModules(locale as any), [locale]);
  const toast = useToast?.();
  
  const [searchQuery, setSearchQuery] = useState('');console.log('=== TRANSLATION DEBUG ===');
console.log('Translation object t:', t);
console.log('t.autopilot exists?', !!t.autopilot);
console.log('t.autopilot?.hero?.title:', t.autopilot?.hero?.title);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('accuracy');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter and sort modules
  const filteredModules = useMemo(() => {
    let filtered = autopilotModules;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(module => 
        module.name.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.capabilities.some(cap => cap.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(module => module.status === filterStatus);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'accuracy') {
        comparison = a.accuracy - b.accuracy;
      } else if (sortBy === 'decisions') {
        comparison = a.decisionsToday - b.decisionsToday;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, filterStatus, sortBy, sortOrder]);

  const handleExportReport = () => {
    const report = {
      exportDate: new Date().toISOString(),
      totalModules: autopilotModules.length,
      activeModules: autopilotModules.filter(m => m.status === 'active').length,
      avgAccuracy: autopilotModules.reduce((sum, m) => sum + m.accuracy, 0) / autopilotModules.length,
      totalDecisionsToday: autopilotModules.reduce((sum, m) => sum + m.decisionsToday, 0),
      modules: autopilotModules.map(m => ({
        id: m.id,
        name: m.name,
        category: m.category,
        status: m.status,
        accuracy: m.accuracy,
        decisionsToday: m.decisionsToday,
        capabilities: m.capabilities
      }))
    };

    downloadJSON(report, `autopilot-modules-${Date.now()}.json`);
    
    if (toast) {
      toast.showToast('Report exported successfully!', 'success');
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    copyToClipboard(url);
    
    if (toast) {
      toast.showToast('Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-bg-obsidian text-text-primary relative overflow-hidden">
      <GovernanceMesh />
      <ScrollProgress />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left">
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40">
                <Brain className="w-8 h-8 text-accent-cyan" />
              </div>
              <div className="px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-medium">
                {t.autopilot?.hero?.badge || 'AUTOPILOT API v12'}
              </div>
            </div>

            <h1 className="text-display-xl mb-6 max-w-4xl animate-in slide-in-from-left delay-100">
              {t.autopilot?.hero?.title || 'AI-Powered Governance'}
            </h1>

            <p className="text-body-l text-text-secondary max-w-2xl mb-8 animate-in slide-in-from-left delay-200">
              {t.autopilot?.hero?.subtitle || '10 specialized AI decision engines operating 24/7 across governance, logistics, and finance. Human-aligned, explainable, and fully auditable.'}
            </p>

            <div className="flex flex-wrap gap-4 mb-10 animate-in slide-in-from-left delay-300">
              <a 
                href="#modules" 
                className="px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-card font-semibold hover:bg-accent-teal transition-colors duration-200 shadow-glow hover:shadow-glow-strong"
              >
                {t.autopilot?.hero?.exploreModules || 'Explore Modules'} →
              </a>
              <a 
                href="#live-simulation" 
                className="px-6 py-3 border border-border-subtle rounded-card font-semibold hover:bg-white/5 hover:border-accent-cyan/60 transition-all duration-200"
              >
                {t.autopilot?.hero?.watchDemo || 'Watch Live Demo'}
              </a>
              <button 
                onClick={handleExportReport}
                className="px-6 py-3 border border-border-subtle rounded-card font-semibold hover:bg-white/5 hover:border-accent-cyan/60 transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t.autopilot?.hero?.exportReport || 'Export Report'}
              </button>
              <button 
                onClick={handleShare}
                className="px-6 py-3 border border-border-subtle rounded-card font-semibold hover:bg-white/5 hover:border-accent-cyan/60 transition-all duration-200 flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                {t.autopilot?.hero?.share || 'Share'}
              </button>
            </div>

            <div className="flex items-center gap-6 text-label-s text-text-secondary animate-in slide-in-from-left delay-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t.autopilot?.hero?.operational || 'All systems operational'}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                4,096 {t.autopilot?.hero?.decisionsToday || 'decisions today'}
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <AutopilotMetrics />
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-heading-xl mb-4">
                {t.autopilot?.modules?.title || 'Autopilot AI Modules'}
              </h2>
              <p className="text-body-l text-text-secondary">
                {t.autopilot?.modules?.subtitle || '10 specialized decision engines for transparent governance'}
              </p>
            </div>

            {/* Search and Controls */}
            <AutopilotControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={setSortBy}
              onSortOrderChange={setSortOrder}
              totalModules={autopilotModules.length}
              filteredCount={filteredModules.length}
            />

            {/* Modules Grid */}
            {filteredModules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredModules.map((module, index) => (
                  <div
                    key={module.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-in slide-in-from-bottom"
                  >
                    <AutopilotCard module={module} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-text-secondary" />
                </div>
                <h3 className="text-heading-m text-text-primary mb-2">
                  {t.autopilot?.modules?.noModulesFound || 'No modules found'}
                </h3>
                <p className="text-body-m text-text-secondary">
                  {t.autopilot?.modules?.tryAdjusting || 'Try adjusting your search or filters'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Live Simulation Section */}
        <section id="live-simulation" className="py-20 px-6 bg-gradient-to-b from-transparent to-bg-surface/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-heading-xl mb-4">
                {t.autopilot?.liveSimulation?.title || 'Live Decision Simulation'}
              </h2>
              <p className="text-body-l text-text-secondary">
                {t.autopilot?.liveSimulation?.subtitle || 'Watch AI make governance decisions in real-time'}
              </p>
            </div>

            <LiveSimulation />
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-heading-xl mb-4">
                {t.autopilot?.architecture?.title || 'Technical Architecture'}
              </h2>
              <p className="text-body-l text-text-secondary">
                {t.autopilot?.architecture?.subtitle || 'Built on proven AI governance principles'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-bg-surface border border-border-subtle rounded-card p-8 hover:border-accent-cyan/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="text-heading-m mb-4">
                  {t.autopilot?.architecture?.explainableAI?.title || 'Explainable AI'}
                </h3>
                <p className="text-body-m text-text-secondary">
                  {t.autopilot?.architecture?.explainableAI?.description || 'Every decision includes full reasoning chain and confidence scoring. Human auditors can trace logic and override when needed.'}
                </p>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-card p-8 hover:border-accent-cyan/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-accent-teal/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-heading-m mb-4">
                  {t.autopilot?.architecture?.auditTrail?.title || 'Immutable Audit Trail'}
                </h3>
                <p className="text-body-m text-text-secondary">
                  {t.autopilot?.architecture?.auditTrail?.description || 'All decisions logged to blockchain. Tamper-proof evidence for compliance, investigations, and institutional oversight.'}
                </p>
              </div>

              <div className="bg-bg-surface border border-border-subtle rounded-card p-8 hover:border-accent-cyan/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-heading-m mb-4">
                  {t.autopilot?.architecture?.humanAlignment?.title || 'Human Alignment'}
                </h3>
                <p className="text-body-m text-text-secondary">
                  {t.autopilot?.architecture?.humanAlignment?.description || 'AI recommendations require human approval for high-stakes decisions. Ethical guidelines embedded in all modules.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-bg-surface/30 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-heading-xl mb-6">
              {t.autopilot?.cta?.title || 'Ready to deploy AI governance?'}
            </h2>
            <p className="text-body-l text-text-secondary mb-8">
              {t.autopilot?.cta?.subtitle || 'Schedule a demo to see Autopilot AI in action across your governance workflows.'}
            </p>
            <a 
              href="/demo" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-cyan text-bg-obsidian rounded-card font-semibold hover:bg-accent-teal transition-colors duration-200 shadow-glow hover:shadow-glow-strong"
            >
              {t.autopilot?.cta?.requestDemo || 'Request Demo'} →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
