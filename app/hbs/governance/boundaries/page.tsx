'use client';

import { useState } from 'react';
import BoundaryCard from './components/BoundaryCard';
import boundariesData from './data/boundaries.json';

export default function BoundariesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const categories = ['safety', 'integrity', 'accountability', 'mission', 'operations', 'compliance'];
  const severities = ['critical', 'high', 'medium'];

  const filteredBoundaries = boundariesData.boundaries.filter(b => {
    if (selectedCategory && b.category !== selectedCategory) return false;
    if (selectedSeverity && b.severity !== selectedSeverity) return false;
    return true;
  });

  const severityColors: Record<string, string> = {
    critical: 'bg-red-600',
    high: 'bg-orange-600',
    medium: 'bg-yellow-600'
  };

  const categoryIcons: Record<string, string> = {
    safety: '🛡️',
    integrity: '⚖️',
    accountability: '📋',
    mission: '🎯',
    operations: '⚙️',
    compliance: '✓'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-800 to-orange-800 p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Boundary Conditions Engine</h1>
        <p className="text-red-200 mt-1">Ethical constraints and compliance requirements v{boundariesData.version}</p>
      </div>

      {/* Stats */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-400">Total Boundaries:</span>
            <span className="font-bold text-white ml-2">{boundariesData.boundaries.length}</span>
          </div>
          <div className="flex items-center gap-4">
            {severities.map(s => (
              <div key={s} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded ${severityColors[s]}`}></span>
                <span className="text-gray-300 capitalize">{s}:</span>
                <span className="font-bold">{boundariesData.boundaries.filter(b => b.severity === s).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-850 border-b border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="text-sm text-gray-400 mr-2">Category:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded text-sm mr-1 ${!selectedCategory ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-sm mr-1 capitalize ${selectedCategory === cat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>
          <div>
            <span className="text-sm text-gray-400 mr-2">Severity:</span>
            <button
              onClick={() => setSelectedSeverity(null)}
              className={`px-3 py-1 rounded text-sm mr-1 ${!selectedSeverity ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              All
            </button>
            {severities.map(sev => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded text-sm mr-1 capitalize ${selectedSeverity === sev ? severityColors[sev] : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Boundaries Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBoundaries.map(boundary => (
            <BoundaryCard key={boundary.id} boundary={boundary} />
          ))}
        </div>

        {filteredBoundaries.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No boundaries match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}