'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function InfrastructureHubPage() {
  const [metrics, setMetrics] = useState({
    totalAssets: 0,
    activeProjects: 0,
    inspectionsDue: 0,
    criticalRisks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/infrastructure/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics({
            totalAssets: data.data.infrastructure.totalAssets,
            activeProjects: data.data.infrastructure.activeProjects,
            inspectionsDue: data.data.infrastructure.upcomingInspections,
            criticalRisks: data.data.risks.unresolvedCritical,
          });
        }
      })
      .catch((err) => console.error('Failed to fetch metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🏗️ Infrastructure Hub
          </h1>
          <p className="text-slate-400">
            Real-time infrastructure monitoring and governance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Assets"
            value={loading ? '...' : metrics.totalAssets}
            icon="🏛️"
            loading={loading}
          />
          <StatCard
            title="Active Projects"
            value={loading ? '...' : metrics.activeProjects}
            icon="🚧"
            loading={loading}
          />
          <StatCard
            title="Inspections Due"
            value={loading ? '...' : metrics.inspectionsDue}
            icon="📋"
            loading={loading}
          />
          <StatCard
            title="Critical Risks"
            value={loading ? '...' : metrics.criticalRisks}
            icon="⚠️"
            loading={loading}
            highlight={!loading && metrics.criticalRisks > 0}
          />
        </div>

        {/* Main Content */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-8">
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-semibold mb-2">
              {loading ? 'Loading Infrastructure Data...' : 
               metrics.totalAssets > 0 ? 'Infrastructure Hub - Live Data' : 'Infrastructure Hub Coming Soon'}
            </h2>
            <p className="text-slate-400 mb-6">
              {loading ? 'Fetching real-time metrics from database...' :
               metrics.totalAssets > 0 ? 
               `Tracking ${metrics.totalAssets} assets across ${metrics.activeProjects} active projects` :
               'Asset registry, project tracking, and inspections module'}
            </p>
            <div className={`inline-block px-4 py-2 rounded-lg border ${
              loading ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              metrics.totalAssets > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {loading ? 'Loading...' :
               metrics.totalAssets > 0 ? '✅ Database Connected - Live Data' : 'Module in development'}
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <FeatureCard
              title="Asset Registry"
              description="Track infrastructure assets with geospatial data"
              icon="🗺️"
              status={metrics.totalAssets > 0 ? 'active' : 'coming-soon'}
            />
            <FeatureCard
              title="Project Tracking"
              description="Monitor reconstruction projects and budgets"
              icon="📊"
              status={metrics.activeProjects > 0 ? 'active' : 'coming-soon'}
            />
            <FeatureCard
              title="Risk Detection"
              description="AI-powered anomaly and corruption detection"
              icon="🔍"
              status={metrics.criticalRisks >= 0 ? 'active' : 'coming-soon'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  loading = false,
  highlight = false 
}: { 
  title: string; 
  value: string | number; 
  icon: string;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-slate-900 rounded-lg border p-4 transition-all ${
      highlight ? 'border-red-500 bg-red-500/5' : 'border-slate-800'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className={`text-3xl font-bold ${loading ? 'animate-pulse' : ''} ${
        highlight ? 'text-red-400' : ''
      }`}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon,
  status = 'coming-soon'
}: { 
  title: string; 
  description: string; 
  icon: string;
  status?: 'active' | 'coming-soon';
}) {
  return (
    <div className={`bg-slate-800/50 rounded-lg border p-6 transition-all ${
      status === 'active' ? 'border-green-500/30' : 'border-slate-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{icon}</div>
        {status === 'active' && (
          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">
            LIVE
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
