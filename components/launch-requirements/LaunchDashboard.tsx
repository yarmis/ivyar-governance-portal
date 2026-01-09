'use client';

import { useState, useEffect } from 'react';

interface Requirement {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  progressPercentage: number;
  dueDate?: string;
}

interface Readiness {
  totalRequirements: number;
  completed: number;
  blocked: number;
  inProgress: number;
  completionPercentage: number;
  criticalBlockers: number;
}

interface Props {
  moduleId: string;
  moduleName: string;
}

export default function LaunchDashboard({ moduleId, moduleName }: Props) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/modules/${moduleId}/requirements`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequirements(data.requirements);
          setReadiness(data.readiness);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  const categoryColors: Record<string, string> = {
    technical: 'bg-blue-500/20 text-blue-500',
    security: 'bg-red-500/20 text-red-500',
    compliance: 'bg-purple-500/20 text-purple-500',
    documentation: 'bg-yellow-500/20 text-yellow-500',
    testing: 'bg-green-500/20 text-green-500',
    business: 'bg-orange-500/20 text-orange-500'
  };

  const statusColors: Record<string, string> = {
    not_started: 'bg-gray-500/20 text-gray-500',
    in_progress: 'bg-blue-500/20 text-blue-500',
    blocked: 'bg-red-500/20 text-red-500',
    completed: 'bg-green-500/20 text-green-500',
    waived: 'bg-yellow-500/20 text-yellow-500'
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{moduleName} - Launch Requirements</h1>
        <p className="text-gray-400 mb-8">Track progress towards production launch</p>

        {readiness && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold">{readiness.totalRequirements}</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{readiness.completed}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{readiness.inProgress}</div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold text-red-500">{readiness.blocked}</div>
              <div className="text-gray-400 text-sm">Blocked</div>
            </div>
            <div className="bg-[#1a1f3a] p-6 rounded-lg">
              <div className="text-3xl font-bold">{readiness.completionPercentage}%</div>
              <div className="text-gray-400 text-sm">Complete</div>
            </div>
          </div>
        )}

        <div className="bg-[#1a1f3a] rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Requirements Checklist</h2>
          
          {requirements.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No requirements defined yet. Add requirements to track launch readiness.
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.map(req => (
                <div key={req.id} className="bg-[#0d1117] p-4 rounded-lg border border-[#2a2f4a]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{req.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${categoryColors[req.category] || 'bg-gray-500/20 text-gray-500'}`}>
                          {req.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${statusColors[req.status] || 'bg-gray-500/20 text-gray-500'}`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </div>
                      {req.dueDate && (
                        <div className="text-sm text-gray-500">
                          Due: {new Date(req.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{req.progressPercentage}%</div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#1a1f3a] rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${req.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
