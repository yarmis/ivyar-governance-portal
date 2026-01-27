"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GovernanceMesh } from '@/components/GovernanceMesh';
import WizardContainer from "./components/WizardContainer";
import { 
  Brain, 
  Sparkles, 
  Download, 
  Share2, 
  Activity,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

export default function AutopilotPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    decisionsToday: 0,
    avgConfidence: 0,
    activeScenarios: 3
  });

  // Load stats from localStorage
  useEffect(() => {
    const history = localStorage.getItem('autopilot-history');
    if (history) {
      try {
        const parsed = JSON.parse(history);
        const today = new Date().toDateString();
        const todayDecisions = parsed.filter((d: any) => 
          new Date(d.timestamp).toDateString() === today
        );
        
        const avgConf = todayDecisions.length > 0
          ? Math.round(todayDecisions.reduce((sum: number, d: any) => 
              sum + (typeof d.decision.score === 'number' ? d.decision.score * 100 : 0), 0
            ) / todayDecisions.length)
          : 0;

        setStats({
          decisionsToday: todayDecisions.length,
          avgConfidence: avgConf,
          activeScenarios: 3
        });
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const handleExport = () => {
    const report = {
      exportDate: new Date().toISOString(),
      platform: 'HBS Autopilot Decision Engine',
      stats,
      capabilities: [
        'Scenario-based evaluation',
        'AI-powered decision making',
        'Confidence scoring',
        'Explainable AI reasoning',
        'Institutional audit trails'
      ]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hbs-autopilot-report-${Date.now()}.json`;
    a.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'HBS Autopilot Decision Engine',
      text: 'Advanced AI-powered decision engine with scenario-based evaluation',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-bg-obsidian text-text-primary relative overflow-hidden">
      <GovernanceMesh />
      <ScrollProgress />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section - ENHANCED */}
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 animate-in slide-in-from-left">
                <div className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40 shadow-glow">
                  <Brain className="w-8 h-8 text-accent-cyan" />
                </div>
                <div className="px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-medium tracking-wide">
                  {t.hbsAutopilot?.hero?.badge || 'HBS AUTOPILOT ENGINE'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 animate-in slide-in-from-right">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all flex items-center gap-2 text-sm font-medium group"
                >
                  <Download className="w-4 h-4 group-hover:text-accent-cyan transition-colors" />
                  <span className="hidden md:inline">Export Report</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-teal text-bg-obsidian rounded-lg hover:shadow-glow-strong transition-all flex items-center gap-2 text-sm font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-display-xl mb-6 max-w-4xl animate-in slide-in-from-left delay-100 bg-gradient-to-r from-text-primary via-accent-cyan to-text-primary bg-clip-text text-transparent">
              {t.hbsAutopilot?.hero?.title || 'AI Decision Engine'}
            </h1>

            <p className="text-body-l text-text-secondary max-w-2xl mb-8 animate-in slide-in-from-left delay-200 leading-relaxed">
              {t.hbsAutopilot?.hero?.subtitle || 'Advanced scenario-based cognitive evaluation powered by AI. Make informed decisions with confidence scoring, explainable reasoning, and institutional-grade audit trails.'}
            </p>

            {/* Status Indicators - ENHANCED */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-in slide-in-from-left delay-300">
              {/* AI Engine Status */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-card blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-3 px-5 py-4 bg-bg-surface/90 backdrop-blur border border-border-subtle rounded-card hover:border-green-500/40 transition-all">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <div>
                    <div className="text-label-xs text-text-secondary uppercase tracking-wide mb-0.5">Status</div>
                    <div className="text-label-m font-semibold text-green-400">
                      {t.hbsAutopilot?.hero?.aiEngineActive || 'AI Engine Active'}
                    </div>
                  </div>
                  <Activity className="w-5 h-5 text-green-400 ml-auto" />
                </div>
              </div>

              {/* Scenarios Available */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-teal/20 rounded-card blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-3 px-5 py-4 bg-bg-surface/90 backdrop-blur border border-border-subtle rounded-card hover:border-accent-cyan/40 transition-all">
                  <div>
                    <div className="text-label-xs text-text-secondary uppercase tracking-wide mb-0.5">Available</div>
                    <div className="text-label-m font-semibold text-accent-cyan">
                      {stats.activeScenarios} {t.hbsAutopilot?.hero?.scenariosAvailable || 'Scenarios'}
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-accent-cyan ml-auto" />
                </div>
              </div>

              {/* Explainable AI */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-card blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center gap-3 px-5 py-4 bg-bg-surface/90 backdrop-blur border border-border-subtle rounded-card hover:border-purple-500/40 transition-all">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-label-xs text-text-secondary uppercase tracking-wide mb-0.5">Powered by</div>
                    <div className="text-label-m font-semibold text-purple-400">
                      {t.hbsAutopilot?.hero?.explainableAI || 'Explainable AI'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Metrics - NEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-in slide-in-from-bottom delay-400">
              {/* Decisions Today */}
              <div className="p-5 bg-gradient-to-br from-bg-surface/80 to-bg-surface/40 backdrop-blur border border-border-subtle rounded-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-s text-text-secondary">Decisions Today</span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-heading-l font-bold text-text-primary">{stats.decisionsToday}</div>
                <div className="text-label-xs text-text-secondary mt-1">Real-time processing</div>
              </div>

              {/* Average Confidence */}
              <div className="p-5 bg-gradient-to-br from-bg-surface/80 to-bg-surface/40 backdrop-blur border border-border-subtle rounded-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-s text-text-secondary">Avg Confidence</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-heading-l font-bold text-text-primary">{stats.avgConfidence}%</div>
                <div className="text-label-xs text-text-secondary mt-1">Across all scenarios</div>
              </div>

              {/* Uptime */}
              <div className="p-5 bg-gradient-to-br from-bg-surface/80 to-bg-surface/40 backdrop-blur border border-border-subtle rounded-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-s text-text-secondary">Platform Uptime</span>
                  <Activity className="w-4 h-4 text-accent-cyan" />
                </div>
                <div className="text-heading-l font-bold text-text-primary">99.97%</div>
                <div className="text-label-xs text-text-secondary mt-1">NATO-grade reliability</div>
              </div>
            </div>
          </div>
        </section>

        {/* Wizard Container */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <WizardContainer />
          </div>
        </section>

        {/* Features Highlight - NEW */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 bg-bg-surface border border-border-subtle rounded-card group hover:border-accent-cyan/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="text-heading-m mb-2">Scenario-Based Evaluation</h3>
                <p className="text-body-s text-text-secondary">
                  Choose from multiple decision scenarios tailored to your governance needs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-bg-surface border border-border-subtle rounded-card group hover:border-accent-cyan/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-heading-m mb-2">Confidence Scoring</h3>
                <p className="text-body-s text-text-secondary">
                  Visual circular gauge shows AI confidence levels with detailed breakdowns.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-bg-surface border border-border-subtle rounded-card group hover:border-accent-cyan/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-heading-m mb-2">Decision History</h3>
                <p className="text-body-s text-text-secondary">
                  Track, compare, and analyze your decision history with full audit trails.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
