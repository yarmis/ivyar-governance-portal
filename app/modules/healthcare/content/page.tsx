import Link from 'next/link';

export default function HealthcareContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/healthcare" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Healthcare Coordination
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">
            Healthcare Coordination Documentation
          </h1>
          <p className="text-lg text-[#8B949E]">
            Unified infrastructure for medical records, provider networks, and cost optimization
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🏥 Overview
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Healthcare Coordination provides unified infrastructure built on Medicare/Medicaid 
                frameworks and HL7 FHIR standards for interoperable healthcare data exchange.
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Capabilities:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Cross-jurisdictional medical records (HL7 FHIR)</li>
                  <li>Provider network transparency</li>
                  <li>Cost optimization and price transparency</li>
                  <li>HIPAA-compliant data exchange</li>
                  <li>Healthcare outcome analytics</li>
                  <li>Public/private system integration</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              📋 Medical Records Interoperability
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Seamless exchange of medical records across providers using HL7 FHIR standard:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Patient Access</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>View complete medical history</li>
                    <li>Lab results and imaging</li>
                    <li>Prescription history</li>
                    <li>Share records with providers</li>
                  </ul>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Provider Benefits</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Real-time access to patient data</li>
                    <li>Reduce duplicate testing</li>
                    <li>Better care coordination</li>
                    <li>Clinical decision support</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              💰 Price Transparency
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Enable patients to make informed decisions with transparent pricing:
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Available Information:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Procedure costs by provider and facility</li>
                  <li>Insurance coverage estimates</li>
                  <li>Out-of-pocket cost calculator</li>
                  <li>Quality ratings and outcomes data</li>
                  <li>Compare costs across providers</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🔐 Privacy & Security
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                HIPAA-compliant infrastructure with robust security controls:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Data Protection</h3>
                  <p className="text-sm">End-to-end encryption, access controls, audit logging</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Patient Control</h3>
                  <p className="text-sm">Consent management, sharing preferences, access history</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              📊 Healthcare Analytics
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Population health insights and outcome tracking:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Quality Metrics</div>
                  <div className="text-sm">Patient outcomes, readmission rates, infection rates</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Cost Analysis</div>
                  <div className="text-sm">Regional cost variations, efficiency opportunities</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Access Gaps</div>
                  <div className="text-sm">Identify underserved populations and regions</div>
                </div>
                <div className="rounded bg-[#0D1117] p-3">
                  <div className="font-semibold text-[#E6EDF3]">Preventive Care</div>
                  <div className="text-sm">Track screenings, vaccinations, wellness programs</div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🤝 Public-Private Integration
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Seamless coordination between government programs and private insurance:
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Integration Points:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Medicare/Medicaid eligibility verification</li>
                  <li>Dual-eligible patient coordination</li>
                  <li>Provider network directories</li>
                  <li>Claims processing and adjudication</li>
                  <li>Prescription drug programs (Part D)</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
