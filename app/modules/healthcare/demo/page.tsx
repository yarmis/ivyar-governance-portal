'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HealthcareDemoPage() {
  const [selectedTab, setSelectedTab] = useState<'records' | 'providers' | 'costs'>('records');

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/healthcare" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Healthcare Coordination
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Healthcare Coordination Demo</h1>
          <p className="text-lg text-[#8B949E]">Unified healthcare data platform</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Active Patients</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">2.34M</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Records Exchanged</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">1.23M</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Providers</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">12,340</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Cost Savings</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">$45.6M</div>
          </div>
        </div>

        <div className="mb-6 flex gap-4 border-b border-[#30363D]">
          <button
            onClick={() => setSelectedTab('records')}
            className={`pb-2 font-medium transition-colors ${
              selectedTab === 'records'
                ? 'border-b-2 border-[#00A3FF] text-[#00A3FF]'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Medical Records
          </button>
          <button
            onClick={() => setSelectedTab('providers')}
            className={`pb-2 font-medium transition-colors ${
              selectedTab === 'providers'
                ? 'border-b-2 border-[#00A3FF] text-[#00A3FF]'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Provider Network
          </button>
          <button
            onClick={() => setSelectedTab('costs')}
            className={`pb-2 font-medium transition-colors ${
              selectedTab === 'costs'
                ? 'border-b-2 border-[#00A3FF] text-[#00A3FF]'
                : 'text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            Cost Transparency
          </button>
        </div>

        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          {selectedTab === 'records' && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#E6EDF3]">Medical Records Access</h3>
              <div className="space-y-3">
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#E6EDF3]">Lab Results</span>
                    <span className="text-sm text-green-400">Accessible</span>
                  </div>
                  <p className="text-sm text-[#8B949E]">Complete blood count - Jan 10, 2026</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#E6EDF3]">Prescriptions</span>
                    <span className="text-sm text-green-400">Accessible</span>
                  </div>
                  <p className="text-sm text-[#8B949E]">Active medications: 3 items</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#E6EDF3]">Imaging</span>
                    <span className="text-sm text-green-400">Accessible</span>
                  </div>
                  <p className="text-sm text-[#8B949E]">X-ray - Dec 15, 2025</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'providers' && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#E6EDF3]">Provider Network</h3>
              <div className="space-y-3">
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 font-medium text-[#E6EDF3]">Primary Care</div>
                  <p className="text-sm text-[#8B949E]">3,456 providers • 98% accepting new patients</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 font-medium text-[#E6EDF3]">Specialists</div>
                  <p className="text-sm text-[#8B949E]">8,234 providers • Various specialties</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 font-medium text-[#E6EDF3]">Hospitals</div>
                  <p className="text-sm text-[#8B949E]">234 facilities • Quality ratings available</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'costs' && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[#E6EDF3]">Price Transparency</h3>
              <div className="space-y-3">
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#E6EDF3]">MRI Scan</span>
                    <span className="font-bold text-[#00A3FF]">$450 - $1,200</span>
                  </div>
                  <p className="text-sm text-[#8B949E]">Price range across local providers</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#E6EDF3]">Annual Physical</span>
                    <span className="font-bold text-[#00A3FF]">$150 - $300</span>
                  </div>
                  <p className="text-sm text-[#8B949E]">Covered by most insurance plans</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-[#E6EDF3]">Emergency Visit</span>
                    <span className="font-bold text-[#00A3FF]">$500 - $3,000</span>
                  </div>
                  <p className="text-sm text-[#8B949E]">Depends on severity and treatment</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-[#8B949E]">
              <p>This is a demonstration. In production, patients access their complete medical records and compare healthcare costs across providers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
