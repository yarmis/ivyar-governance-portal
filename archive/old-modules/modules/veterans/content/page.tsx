import Link from 'next/link';

export default function VeteransContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/veterans" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Veterans Services
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">
            Veterans Services Documentation
          </h1>
          <p className="text-lg text-[#8B949E]">
            Comprehensive guide to veteran benefits, healthcare, and support services
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🎖️ Overview
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                The Veterans Services module provides unified access to benefits, healthcare, 
                education, housing, and employment services for veterans and their families.
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Services:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>VA Healthcare enrollment and records</li>
                  <li>Disability benefits and claims</li>
                  <li>Education benefits (GI Bill)</li>
                  <li>Home loan guarantees</li>
                  <li>Career counseling and job placement</li>
                  <li>Mental health and crisis support</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🏥 Healthcare Benefits
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Veterans have access to comprehensive healthcare through the VA system:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Medical Care</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Primary care services</li>
                    <li>Specialty care</li>
                    <li>Mental health services</li>
                    <li>Prescription medications</li>
                  </ul>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Special Programs</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>PTSD treatment</li>
                    <li>TBI rehabilitation</li>
                    <li>Substance abuse programs</li>
                    <li>Homeless veteran support</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              📚 Education Benefits
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                The GI Bill and other education benefits help veterans pursue education and training:
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Available Benefits:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Post-9/11 GI Bill: Full tuition coverage at public universities</li>
                  <li>Montgomery GI Bill: Monthly education benefits</li>
                  <li>Vocational Rehabilitation: Career training for disabled veterans</li>
                  <li>Survivors' Benefits: Education support for dependents</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🏠 Housing Support
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Veterans can access special home loan programs and housing assistance:
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">VA Home Loans:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>No down payment required</li>
                  <li>Competitive interest rates</li>
                  <li>No private mortgage insurance</li>
                  <li>Assistance for disabled veterans</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              💼 Employment Services
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                Comprehensive career support to help veterans transition to civilian employment:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Career Services</h3>
                  <p className="text-sm">Resume building, interview prep, job placement</p>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Small Business</h3>
                  <p className="text-sm">Veteran-owned business certification and loans</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
