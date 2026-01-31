'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LogisticsDemoPage() {
  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);

  const shipments = [
    { id: 1, origin: 'Warsaw', destination: 'Kyiv', status: 'In Transit', eta: '2h 45m' },
    { id: 2, origin: 'Berlin', destination: 'Lviv', status: 'Loading', eta: '6h 20m' },
    { id: 3, origin: 'Rotterdam', destination: 'Odesa', status: 'Customs', eta: '12h 10m' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/logistics" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Logistics Engine
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Logistics Demo</h1>
          <p className="text-lg text-[#8B949E]">Real-time shipment tracking dashboard</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Active Shipments</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">3</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Warehouses</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">12</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">On-Time Rate</div>
            <div className="text-2xl font-bold text-green-400">94.5%</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">Active Shipments</h2>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <button
                key={shipment.id}
                onClick={() => setSelectedShipment(shipment.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedShipment === shipment.id
                    ? 'border-[#00A3FF] bg-[#00A3FF]/10'
                    : 'border-[#30363D] bg-[#0D1117] hover:border-[#00A3FF]/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-[#E6EDF3]">
                    {shipment.origin} → {shipment.destination}
                  </span>
                  <span className={`rounded px-2 py-1 text-xs font-medium ${
                    shipment.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                    shipment.status === 'Loading' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="text-sm text-[#8B949E]">ETA: {shipment.eta}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-[#8B949E]">
              <p>This is a demonstration. In production, logistics coordinators track real-time shipments with GPS and automated alerts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
