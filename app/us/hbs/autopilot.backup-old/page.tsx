"use client";

import { Header } from '@/components/Header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GovernanceMesh } from '@/components/GovernanceMesh';
import WizardContainer from "./components/WizardContainer";
import { Brain } from 'lucide-react';

export default function AutopilotPage() {
  return (
    <div className="min-h-screen bg-bg-obsidian text-text-primary relative overflow-hidden">
      <GovernanceMesh />
      <ScrollProgress />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6 animate-in slide-in-from-left">
              <div className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40">
                <Brain className="w-8 h-8 text-accent-cyan" />
              </div>
              <div className="px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan text-sm font-medium">
                HBS AUTOPILOT ENGINE
              </div>
            </div>

            <h1 className="text-display-xl mb-6 max-w-4xl animate-in slide-in-from-left delay-100">
              AI Decision Engine
            </h1>

            <p className="text-body-l text-text-secondary max-w-2xl mb-8 animate-in slide-in-from-left delay-200">
              Advanced scenario-based cognitive evaluation powered by AI. Make informed decisions with confidence scoring, explainable reasoning, and institutional-grade audit trails.
            </p>

            <div className="flex flex-wrap gap-4 mb-10 animate-in slide-in-from-left delay-300">
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-subtle rounded-card">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-label-s text-text-secondary">AI Engine Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-subtle rounded-card">
                <span className="text-label-s text-text-secondary">3 Scenarios Available</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-subtle rounded-card">
                <span className="text-label-s text-text-secondary">Explainable AI</span>
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
      </main>
    </div>
  );
}
