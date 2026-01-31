'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function VeteransDemoPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    { id: 'healthcare', name: 'VA Healthcare', icon: '🏥', status: 'Active', beneficiaries: 234567 },
    { id: 'disability', name: 'Disability Benefits', icon: '💰', status: 'Active', beneficiaries: 156789 },
    { id: 'education', name: 'GI Bill Education', icon: '📚', status: 'Active', beneficiaries: 89012 },
    { id: 'housing', name: 'VA Home Loans', icon: '🏠', status: 'Active', beneficiaries: 45678 },
    { id: 'employment', name: 'Career Services', icon: '💼', status: 'Active', beneficiaries: 23456 },
    { id: 'crisis', name: 'Crisis Support', icon: '🆘', status: '24/7', beneficiaries: 12345 },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/veterans" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Veterans Services
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Veterans Services Demo</h1>
          <p className="text-lg text-[#8B949E]">Interactive demonstration of veteran support services</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Active Veterans</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">18.2M</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Benefits Processed</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">2.4M/yr</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Satisfaction Rate</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">87.5%</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">Available Services</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  selectedService === service.id
                    ? 'border-[#00A3FF] bg-[#00A3FF]/10'
                    : 'border-[#30363D] bg-[#0D1117] hover:border-[#00A3FF]/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="rounded bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                    {service.status}
                  </span>
                </div>
                <div className="mb-1 font-semibold text-[#E6EDF3]">{service.name}</div>
                <div className="text-sm text-[#8B949E]">{service.beneficiaries.toLocaleString()} beneficiaries</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-[#8B949E]">
              <p>This is a demonstration. In production, veterans can access real-time benefits status, apply for services, and connect with VA counselors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
