import Link from 'next/link';

export default function CultureContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/culture" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Culture & Media Harmony
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Culture & Media Documentation</h1>
          <p className="text-lg text-[#8B949E]">Cultural preservation and media coordination platform</p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">🎭 Overview</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>Culture & Media Harmony platform coordinates cultural preservation, arts funding, media initiatives, and heritage protection during reconstruction.</p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Capabilities:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Cultural heritage documentation</li>
                  <li>Arts grant management</li>
                  <li>Event coordination</li>
                  <li>Media transparency tracking</li>
                  <li>Artist & venue databases</li>
                  <li>Public engagement metrics</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">🏛️ Heritage Preservation</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>Digital preservation and protection of cultural assets:</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Documentation</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>3D scanning of monuments</li>
                    <li>Digital archives</li>
                    <li>Historical records</li>
                  </ul>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Protection</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Site monitoring</li>
                    <li>Restoration planning</li>
                    <li>Security coordination</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">💰 Arts Funding</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>Transparent grant allocation and tracking:</p>
              <div className="rounded bg-[#0D1117] p-4">
                <ul className="ml-6 list-disc space-y-1">
                  <li>Grant application processing</li>
                  <li>Funding transparency dashboard</li>
                  <li>Impact measurement</li>
                  <li>Artist support programs</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
