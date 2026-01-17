'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CultureDemoPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const events = [
    { id: 1, name: 'Heritage Festival', date: 'Feb 15', attendees: 2500, funding: 45000 },
    { id: 2, name: 'Art Exhibition', date: 'Mar 10', attendees: 800, funding: 15000 },
    { id: 3, name: 'Music Concert', date: 'Apr 5', attendees: 1200, funding: 30000 },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/culture" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Culture & Media
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Culture & Media Demo</h1>
          <p className="text-lg text-[#8B949E]">Cultural events and funding dashboard</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Active Events</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">3</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Total Attendees</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">4,500</div>
          </div>
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-4">
            <div className="text-sm text-[#8B949E]">Funding Allocated</div>
            <div className="text-2xl font-bold text-[#E6EDF3]">$90K</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedEvent === event.id
                    ? 'border-[#00A3FF] bg-[#00A3FF]/10'
                    : 'border-[#30363D] bg-[#0D1117] hover:border-[#00A3FF]/50'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-[#E6EDF3]">{event.name}</span>
                  <span className="text-sm text-[#8B949E]">{event.date}</span>
                </div>
                <div className="flex gap-4 text-sm text-[#8B949E]">
                  <span>Attendees: {event.attendees.toLocaleString()}</span>
                  <span>Funding: ${event.funding.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-[#8B949E]">
              <p>This is a demonstration. In production, cultural organizations track events, funding, and community engagement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
