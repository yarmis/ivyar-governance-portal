'use client';

import Link from 'next/link';
import AIAssistant from '@/app/components/AIAssistant';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="border-b border-[#1F242C] bg-[#161B22] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#E6EDF3]">
            🏛️ IVYAR
          </Link>
          <Link href="/modules" className="text-sm text-[#8B949E] hover:text-[#E6EDF3]">
            ← BACK TO MODULES
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#1F242C] bg-gradient-to-b from-[#161B22] to-[#0D1117] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="text-6xl">💬</div>
            <div>
              <h1 className="text-5xl font-bold text-[#E6EDF3]">CITIZEN FEEDBACK</h1>
              <p className="mt-2 text-xl text-[#8B949E]">
                Structured Public Dialogue & Insight
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-lg border border-[#30363D] bg-[#161B22] px-4 py-2">
              <div className="text-xs text-[#8B949E]">Status</div>
              <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                LIVE
              </div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#161B22] px-4 py-2">
              <div className="text-xs text-[#8B949E]">API Endpoints</div>
              <div className="text-2xl font-bold text-[#E6EDF3]">12</div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#161B22] px-4 py-2">
              <div className="text-xs text-[#8B949E]">Version</div>
              <div className="text-sm font-medium text-[#E6EDF3]">2.8</div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-2xl font-bold text-[#E6EDF3]">📘 OVERVIEW</h2>
          <p className="text-lg leading-relaxed text-[#8B949E]">
            The Citizen Feedback module creates a structured, respectful channel for public input on 
            government services, policies, and institutional performance. Unlike traditional complaint 
            systems, this module treats citizen insights as valuable intelligence that informs continuous 
            improvement, policy refinement, and responsive governance.
          </p>
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="border-t border-[#1F242C] bg-[#161B22] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-[#E6EDF3]">🔑 KEY CAPABILITIES</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-[#30363D] bg-[#0D1117] p-4">
              <div className="mb-2 text-2xl">📝</div>
              <div className="font-medium text-[#E6EDF3]">Multi-channel feedback collection</div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#0D1117] p-4">
              <div className="mb-2 text-2xl">🔄</div>
              <div className="font-medium text-[#E6EDF3]">"You Said, We Did" transparency</div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#0D1117] p-4">
              <div className="mb-2 text-2xl">📊</div>
              <div className="font-medium text-[#E6EDF3]">Trend analysis and reporting</div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#0D1117] p-4">
              <div className="mb-2 text-2xl">🔔</div>
              <div className="font-medium text-[#E6EDF3]">Response tracking and notifications</div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#0D1117] p-4">
              <div className="mb-2 text-2xl">🌍</div>
              <div className="font-medium text-[#E6EDF3]">Multi-language support (24+ languages)</div>
            </div>
            <div className="rounded-lg border border-[#30363D] bg-[#0D1117] p-4">
              <div className="mb-2 text-2xl">🛡️</div>
              <div className="font-medium text-[#E6EDF3]">Anonymous and authenticated modes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="border-t border-[#1F242C] bg-[#0D1117] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold text-[#E6EDF3]">🔗 ACTIONS</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg border border-[#00A3FF] bg-[#00A3FF]/10 px-6 py-3 font-medium text-[#00A3FF] transition-colors hover:bg-[#00A3FF]/20">
              OPEN MODULE →
            </button>
            <button className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]">
              VIEW API →
            </button>
            <button className="rounded-lg border border-[#334155] bg-[#161B22] px-6 py-3 font-medium text-[#E6EDF3] transition-colors hover:bg-[#1F242C]">
              RUN DEMO →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1F242C] bg-[#161B22] px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-[#6E7681]">
          🇺🇸 Built in the United States • 💙💛 Inspired by Ukraine • 🌍 Designed for the world
        </div>
      </footer>
      {/* AI Assistant */}
      <AIAssistant module="feedback" />
    </div>
  );
}
