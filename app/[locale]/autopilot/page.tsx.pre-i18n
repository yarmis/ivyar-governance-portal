'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GovernanceMesh } from '@/components/GovernanceMesh';
import { 
  AutopilotCard, 
  AutopilotMetrics, 
  AutopilotControls,
  LiveSimulation
} from '@/components/autopilot';
import { autopilotModules, getAutopilotByCategory } from '@/data/autopilot-modules';
import { Brain, Sparkles, Download, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { downloadJSON, copyToClipboard } from '@/lib/utils/helpers';
import type { SortBy, SortOrder, FilterStatus } from '@/components/autopilot/AutopilotControls';

const categories = [
  'Governance & Oversight',
  'Operations & Logistics',
  'Finance & Procurement',
];

export default function AutopilotPage() {
  const toast = useToast ? useToast() : null;
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('accuracy');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filtered and sorted modules
  const filteredModules = useMemo(() => {
    let result = [...autopilotModules];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.capabilities.some(c => c.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(m => m.status === filterStatus);
    }

    // Apply sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'accuracy':
          comparison = a.accuracy - b.accuracy;
          break;
        case 'decisions':
          comparison = a.decisionsToday - b.decisionsToday;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, filterStatus, sortBy, sortOrder]);

  // Export functionality
  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalModules: autopilotModules.length,
      activeModules: autopilotModules.filter(m => m.status === 'active').length,
      avgAccuracy: autopilotModules.reduce((sum, m) => sum + m.accuracy, 0) / autopilotModules.length,
      modules: autopilotModules.map(m => ({
        id: m.id,
        name: m.name,
        status: m.status,
        accuracy: m.accuracy,
        decisionsToday: m.decisionsToday,
        category: m.category,
      })),
    };
    
    downloadJSON(exportData, `autopilot-modules-${Date.now()}.json`);
    if (toast) toast.showToast('success', 'Report exported successfully!');
  };

  // Share functionality
  const handleShare = async () => {
    const shareText = `IVYAR Autopilot API v12\n10 AI Modules | 95.2% Avg Accuracy | 4,596 Decisions Today\n${window.location.href}`;
    const success = await copyToClipboard(shareText);
    
    toast?.showToast(
      success ? 'success' : 'error',
      success ? 'Link copied to clipboard!' : 'Failed to copy link'
    );
  };

  return (
    <main className="relative bg-bg-obsidian text-text-primary min-h-screen">
      <ScrollProgress />
      <Header trustline="NATO • World Bank • USAID" />

      {/* HERO SECTION */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <GovernanceMesh />

        <div className="relative z-10 max-w-content mx-auto px-6">
          <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left">
            <div className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40">
              <Brain className="w-8 h-8 text-accent-cyan" />
            </div>
            <div className="px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-medium">
              AUTOPILOT API v12
            </div>
          </div>

          <h1 className="text-display-xl mb-6 max-w-4xl animate-in slide-in-from-left delay-100">
            AI-Powered Governance
          </h1>

          <p className="text-body-l text-text-secondary max-w-2xl mb-8 animate-in slide-in-from-left delay-200">
            10 specialized AI decision engines operating 24/7 across governance, logistics, and finance. 
            Human-aligned, explainable, and fully auditable.
          </p>

          <div className="flex flex-wrap gap-4 mb-10 animate-in slide-in-from-left delay-300">
            <a
              href="#modules"
              className="px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-card font-semibold hover:bg-accent-teal transition-colors duration-200 shadow-glow hover:shadow-glow-strong"
            >
              Explore Modules →
            </a>
            <a
              href="#live-simulation"
              className="px-6 py-3 border border-border-subtle rounded-card font-semibold hover:bg-white/5 hover:border-accent-cyan/60 transition-all duration-200"
            >
              Watch Live Demo
            </a>
            <button
              onClick={handleExport}
              className="px-6 py-3 border border-border-subtle rounded-card font-semibold hover:bg-white/5 hover:border-accent-cyan/60 transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 border border-border-subtle rounded-card font-semibold hover:bg-white/5 hover:border-accent-cyan/60 transition-all duration-200 flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          <div className="flex items-center gap-6 text-label-s text-text-secondary animate-in slide-in-from-left delay-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              {autopilotModules.reduce((sum, m) => sum + m.decisionsToday, 0).toLocaleString()} decisions today
            </div>
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="py-20 border-y border-border-subtle bg-gradient-to-b from-transparent via-bg-surface to-transparent">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading-l text-text-primary mb-3">
              System-Wide Performance
            </h2>
            <p className="text-body-m text-text-secondary">
              Real-time metrics from all Autopilot modules
            </p>
          </div>
          
          <AutopilotMetrics />
        </div>
      </section>

      {/* MODULES SECTION WITH SEARCH/FILTER */}
      <section id="modules" className="py-20">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading-l text-text-primary mb-3">
              Autopilot AI Modules
            </h2>
            <p className="text-body-m text-text-secondary">
              10 specialized decision engines for transparent governance
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="mb-12">
            <AutopilotControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(by, order) => {
                setSortBy(by);
                setSortOrder(order);
              }}
              totalModules={autopilotModules.length}
              filteredCount={filteredModules.length}
            />
          </div>

          {/* Modules Grid */}
          {filteredModules.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules.map((module, idx) => (
                <div
                  key={module.id}
                  className="animate-in slide-in-from-bottom"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <AutopilotCard module={module} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-text-secondary" />
              </div>
              <p className="text-body-m text-text-secondary mb-2">
                No modules found
              </p>
              <p className="text-body-s text-text-secondary">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LIVE SIMULATION SECTION */}
      <section id="live-simulation" className="py-20 border-t border-border-subtle bg-gradient-to-b from-transparent to-bg-surface">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading-l text-text-primary mb-3">
              Live Decision Simulation
            </h2>
            <p className="text-body-m text-text-secondary">
              Watch AI make governance decisions in real-time
            </p>
          </div>

          <LiveSimulation />
        </div>
      </section>

      {/* TECHNICAL SPECS */}
      <section className="py-20 border-t border-border-subtle">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading-l text-text-primary mb-3">
              Technical Architecture
            </h2>
            <p className="text-body-m text-text-secondary">
              Built on proven AI governance principles
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-bg-surface border border-border-subtle rounded-card p-8 hover:border-accent-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-accent-cyan" />
              </div>
              <h4 className="text-heading-s text-text-primary mb-3">Explainable AI</h4>
              <p className="text-body-s text-text-secondary">
                Every decision includes full reasoning chain and confidence scoring. 
                Human auditors can trace logic and override when needed.
              </p>
            </div>

            <div className="bg-bg-surface border border-border-subtle rounded-card p-8 hover:border-accent-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-heading-s text-text-primary mb-3">Immutable Audit Trail</h4>
              <p className="text-body-s text-text-secondary">
                All decisions logged to blockchain. Tamper-proof evidence for 
                compliance, investigations, and institutional oversight.
              </p>
            </div>

            <div className="bg-bg-surface border border-border-subtle rounded-card p-8 hover:border-accent-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="text-heading-s text-text-primary mb-3">Human Alignment</h4>
              <p className="text-body-s text-text-secondary">
                AI recommendations require human approval for high-stakes decisions. 
                Ethical guidelines embedded in all modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden border-t border-border-subtle">
        <GovernanceMesh />

        <div className="relative z-10 max-w-content mx-auto px-6 text-center">
          <h2 className="text-heading-l mb-4">
            Ready to deploy AI governance?
          </h2>

          <p className="text-body-m text-text-secondary max-w-2xl mx-auto mb-8">
            Schedule a demo to see Autopilot AI in action across your governance workflows.
          </p>

          <a
            href="/demo"
            className="inline-block px-8 py-4 bg-accent-cyan text-bg-obsidian rounded-card font-semibold hover:bg-accent-teal transition-colors duration-200 shadow-glow"
          >
            Request Demo →
          </a>
        </div>
      </section>
    </main>
  );
}

// Import missing icons
import { CheckCircle, Users } from 'lucide-react';
