// ============================================================================
// HBS AUTOPILOT v8 DASHBOARD
// File: app/[locale]/hbs/autopilot/page.tsx
// ============================================================================

'use client';

import { useState, useEffect } from 'react';

interface AutopilotStatus {
  timestamp: string;
  flag: {
    enabled: boolean;
    strategy: {
      type: string;
      percentage: number;
    } | null;
  };
  last24Hours: {
    v7Decisions: number;
    v8Decisions: number;
    totalDecisions: number;
    v8Percentage: string;
  };
  comparison: {
    averageSimilarity: string;
    totalComparisons: number;
  };
}

export default function AutopilotDashboard() {
  const [status, setStatus] = useState<AutopilotStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/hbs/autopilot/status');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateRollout(percentage: number) {
    setUpdating(true);
    try {
      const res = await fetch('/api/hbs/autopilot/flags/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage }),
      });

      if (res.ok) {
        await fetchStatus();
        alert(`✓ v8 enabled for ${percentage}%`);
      } else {
        alert('Failed to update rollout');
      }
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Failed to update rollout');
    } finally {
      setUpdating(false);
    }
  }

  async function disableV8() {
    if (!confirm('⚠️ Rollback to v7? This will disable v8 for all users.')) {
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch('/api/hbs/autopilot/flags/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        await fetchStatus();
        alert('✓ Rolled back to v7');
      } else {
        alert('Failed to disable v8');
      }
    } catch (error) {
      console.error('Failed to disable:', error);
      alert('Failed to disable v8');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load status</div>
      </div>
    );
  }

  const currentPercentage = status.flag.strategy?.percentage || 0;
  const isEnabled = status.flag.enabled;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🤖 HBS Autopilot Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and control v7 → v8 migration
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* v8 Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">v8 Status</h3>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isEnabled ? '✓ ENABLED' : '○ DISABLED'}
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {currentPercentage}%
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Rollout percentage
            </div>
          </div>

          {/* Total Decisions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Last 24 Hours
            </h3>
            <div className="text-4xl font-bold text-gray-900">
              {status.last24Hours.totalDecisions}
            </div>
            <div className="text-sm text-gray-500 mt-2">Total decisions</div>
            <div className="mt-4 flex gap-4 text-sm">
              <div>
                <span className="text-gray-600">v7:</span>{' '}
                <span className="font-semibold">{status.last24Hours.v7Decisions}</span>
              </div>
              <div>
                <span className="text-blue-600">v8:</span>{' '}
                <span className="font-semibold text-blue-600">
                  {status.last24Hours.v8Decisions}
                </span>
              </div>
            </div>
          </div>

          {/* Similarity Score */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Avg Similarity
            </h3>
            <div className="text-4xl font-bold text-green-600">
              {(parseFloat(status.comparison.averageSimilarity) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500 mt-2">
              v7 vs v8 agreement
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {status.comparison.totalComparisons} comparisons
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Rollout Progress
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 flex items-center justify-center text-white text-sm font-medium transition-all duration-500"
              style={{ width: `${currentPercentage}%` }}
            >
              {currentPercentage}%
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Decision Distribution
          </h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">v7 (Legacy)</span>
                <span className="text-sm font-semibold">
                  {status.last24Hours.v7Decisions}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gray-600 h-4"
                  style={{
                    width: `${
                      status.last24Hours.totalDecisions > 0
                        ? (status.last24Hours.v7Decisions /
                            status.last24Hours.totalDecisions) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600">v8 (AI-Powered)</span>
                <span className="text-sm font-semibold text-blue-600">
                  {status.last24Hours.v8Decisions}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-4"
                  style={{
                    width: `${
                      status.last24Hours.totalDecisions > 0
                        ? (status.last24Hours.v8Decisions /
                            status.last24Hours.totalDecisions) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            Rollout Controls
          </h3>

          {!isEnabled ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Start gradual rollout of v8:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => updateRollout(1)}
                  disabled={updating}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  1%
                </button>
                <button
                  onClick={() => updateRollout(5)}
                  disabled={updating}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  5%
                </button>
                <button
                  onClick={() => updateRollout(10)}
                  disabled={updating}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  10%
                </button>
                <button
                  onClick={() => updateRollout(25)}
                  disabled={updating}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  25%
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Current: {currentPercentage}% - Increase rollout or disable:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {currentPercentage < 25 && (
                  <button
                    onClick={() => updateRollout(25)}
                    disabled={updating}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    25%
                  </button>
                )}
                {currentPercentage < 50 && (
                  <button
                    onClick={() => updateRollout(50)}
                    disabled={updating}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    50%
                  </button>
                )}
                {currentPercentage < 75 && (
                  <button
                    onClick={() => updateRollout(75)}
                    disabled={updating}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    75%
                  </button>
                )}
                {currentPercentage < 100 && (
                  <button
                    onClick={() => updateRollout(100)}
                    disabled={updating}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    100%
                  </button>
                )}
                <button
                  onClick={disableV8}
                  disabled={updating}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Disable v8
                </button>
              </div>
            </div>
          )}

          {updating && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Updating...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date(status.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
