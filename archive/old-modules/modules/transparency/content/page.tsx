import Link from 'next/link';

export default function TransparencyContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/modules/transparency"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline"
          >
            ← Back to Transparency Hub
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">
            Transparency Hub Documentation
          </h1>
          <p className="text-lg text-[#8B949E]">
            Complete guide to institutional accountability and transparency
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">
              🚀 Getting Started
            </h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>
                The Transparency Hub provides real-time visibility into all institutional operations.
              </p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Key Features:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Real-time audit logging</li>
                  <li>Decision tracking and documentation</li>
                  <li>Public contract database</li>
                  <li>Budget transparency</li>
                  <li>Anonymous whistleblower system</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
