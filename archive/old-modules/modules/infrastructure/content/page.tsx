import Link from 'next/link';

export default function InfrastructureContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/infrastructure" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Infrastructure & Logistics Hub
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">
            Infrastructure & Logistics Documentation
          </h1>
          <p className="text-lg text-[#8B949E]">
            Comprehensive infrastructure project management and logistics coordination
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🏗️ Overview
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Infrastructure & Logistics Hub coordinates large-scale infrastructure projects,
                supply chain management, and transportation logistics for reconstruction and development.
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Capabilities:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Project lifecycle management</li>
                  <li>Resource allocation and tracking</li>
                  <li>Supply chain coordination</li>
                  <li>Quality assurance and compliance</li>
                  <li>Budget and timeline monitoring</li>
                  <li>Stakeholder communication</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🚧 Project Management
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                End-to-end infrastructure project management from planning to completion:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Planning Phase</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Feasibility studies</li>
                    <li>Environmental impact assessments</li>
                    <li>Budget estimation</li>
                    <li>Stakeholder consultation</li>
                  </ul>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Execution Phase</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Contractor management</li>
                    <li>Material procurement</li>
                    <li>Quality inspections</li>
                    <li>Progress monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              📦 Supply Chain Management
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Integrated supply chain coordination for efficient material flow:
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Key Features:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Real-time inventory tracking</li>
                  <li>Automated reordering systems</li>
                  <li>Multi-warehouse coordination</li>
                  <li>Delivery route optimization</li>
                  <li>Supplier performance monitoring</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🎯 Quality Assurance
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Comprehensive quality control and compliance monitoring:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Inspections</div>
                  <div className="text-sm">Regular quality checks and audits</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Compliance</div>
                  <div className="text-sm">Safety and regulatory standards</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Documentation</div>
                  <div className="text-sm">Complete project records and reports</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Corrective Actions</div>
                  <div className="text-sm">Issue tracking and resolution</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
