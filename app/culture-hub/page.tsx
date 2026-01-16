/**
 * Culture & Media Harmony Dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Film, Users, Calendar, Shield, Sparkles } from 'lucide-react';

export default function CultureMediaHubPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/culture/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Culture & Media Harmony
              </h1>
              <p className="text-slate-400 mt-1">
                Ethical cultural infrastructure for creativity and well-being
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Film className="w-5 h-5" />}
            label="Media Items"
            value={loading ? '...' : metrics?.media.totalItems || 0}
            color="purple"
            loading={loading}
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Active Talents"
            value={loading ? '...' : metrics?.talents.totalProfiles || 0}
            color="pink"
            loading={loading}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Upcoming Events"
            value={loading ? '...' : metrics?.events.upcoming || 0}
            color="blue"
            loading={loading}
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            label="Ethics Score"
            value={loading ? '...' : metrics?.ethics.avgScore.toFixed(1) || 0}
            color="green"
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8 backdrop-blur-sm">
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h2 className="text-2xl font-semibold mb-2">
              Culture & Media Harmony - Live!
            </h2>
            <p className="text-slate-400 mb-6">
              {loading ? 'Loading cultural data...' : 
               `Tracking ${metrics?.media.totalItems || 0} media items, ${metrics?.talents.totalProfiles || 0} talents, and ${metrics?.events.totalEvents || 0} events`}
            </p>
            <div className={`inline-block px-4 py-2 rounded-lg border ${
              loading ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              {loading ? 'Loading...' : '✅ Module Active'}
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <FeatureCard title="Media Stream" description="Ethical content curation" icon="🎬" />
            <FeatureCard title="Talent Hub" description="Support creative professionals" icon="🎨" />
            <FeatureCard title="Events & Leisure" description="Cultural calendar" icon="📅" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, loading }: any) {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-4 backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${loading ? 'animate-pulse' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: any) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
