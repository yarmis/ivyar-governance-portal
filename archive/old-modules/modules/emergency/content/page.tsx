import Link from 'next/link';

export default function EmergencyContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/emergency" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Emergency Response
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">
            Emergency Response Documentation
          </h1>
          <p className="text-lg text-[#8B949E]">
            Real-time coordination for natural disasters and humanitarian crises
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🚨 Overview
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                The Emergency Response Hub provides real-time coordination for natural disasters,
                humanitarian crises, and mass casualty events based on FEMA and NIMS frameworks.
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Capabilities:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Real-time disaster tracking and alerts</li>
                  <li>Multi-agency coordination platform</li>
                  <li>Resource deployment optimization</li>
                  <li>Affected population mapping</li>
                  <li>Supply chain coordination</li>
                  <li>Communication hub for responders</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🌪️ Disaster Types
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Natural Disasters</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Hurricanes and tropical storms</li>
                  <li>Earthquakes and aftershocks</li>
                  <li>Floods and flash floods</li>
                  <li>Wildfires</li>
                  <li>Tornadoes</li>
                </ul>
              </div>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Human-Caused</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Infrastructure failures</li>
                  <li>Chemical spills</li>
                  <li>Mass casualty incidents</li>
                  <li>Evacuation scenarios</li>
                  <li>Humanitarian crises</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              📍 Coordination Framework
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Built on the National Incident Management System (NIMS) for standardized response:
              </p>
              <div className="space-y-3">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Incident Command</h3>
                  <p className="text-sm">Unified command structure with clear chain of command</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Multi-Agency Coordination</h3>
                  <p className="text-sm">FEMA, state/local emergency management, NGOs, military</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Resource Management</h3>
                  <p className="text-sm">Track and deploy personnel, equipment, supplies in real-time</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🔄 Response Phases
            </h2>
            <div className="space-y-3">
              <div className="rounded bg-[#0D1117] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <h3 className="font-semibold text-[#E6EDF3]">Preparedness</h3>
                </div>
                <p className="text-sm text-[#8B949E]">Pre-positioning resources, training, drills</p>
              </div>
              <div className="rounded bg-[#0D1117] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <h3 className="font-semibold text-[#E6EDF3]">Response</h3>
                </div>
                <p className="text-sm text-[#8B949E]">Immediate life-saving actions, evacuation, medical care</p>
              </div>
              <div className="rounded bg-[#0D1117] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <h3 className="font-semibold text-[#E6EDF3]">Recovery</h3>
                </div>
                <p className="text-sm text-[#8B949E]">Restoration of services, infrastructure rebuilding</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              📊 Real-Time Tracking
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Monitor all aspects of emergency response in real-time:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Affected Population</div>
                  <div className="text-sm">Real-time headcount, needs assessment</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Resource Status</div>
                  <div className="text-sm">Personnel, equipment, supplies availability</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Shelter Capacity</div>
                  <div className="text-sm">Occupancy, services, needs</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Supply Chain</div>
                  <div className="text-sm">Distribution points, inventory levels</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
