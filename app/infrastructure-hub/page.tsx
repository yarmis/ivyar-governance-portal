/**
 * Infrastructure Hub Dashboard Page
 */

'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export default function InfrastructureHubPage() {
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
          <StatCard title="Total Assets" value="0" icon="🏛️" />
          <StatCard title="Active Projects" value="0" icon="🚧" />
          <StatCard title="Inspections Due" value="0" icon="📋" />
          <StatCard title="Critical Risks" value="0" icon="⚠️" />
        </div>

        {/* Main Content */}
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-8">
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-semibold mb-2">
              Infrastructure Hub Coming Soon
            </h2>
            <p className="text-slate-400 mb-6">
              Asset registry, project tracking, and inspections module
            </p>
            <div className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
              Module in development
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <FeatureCard
              title="Asset Registry"
              description="Track infrastructure assets with geospatial data"
              icon="🗺️"
            />
            <FeatureCard
              title="Project Tracking"
              description="Monitor reconstruction projects and budgets"
              icon="📊"
            />
            <FeatureCard
              title="Risk Detection"
              description="AI-powered anomaly and corruption detection"
              icon="🔍"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-slate-400">{title}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: string;
}) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
