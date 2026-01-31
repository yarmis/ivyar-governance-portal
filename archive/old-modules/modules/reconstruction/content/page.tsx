import Link from 'next/link';

export default function ReconstructionContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/reconstruction" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Reconstruction Module
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Reconstruction Documentation</h1>
          <p className="text-lg text-[#8B949E]">Post-conflict infrastructure rebuilding and recovery</p>
        </div>
        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">🏗️ Overview</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>Reconstruction Module coordinates post-conflict rebuilding efforts, damage assessment, and infrastructure recovery with transparent fund allocation.</p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Capabilities:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Damage assessment and mapping</li>
                  <li>Priority-based project planning</li>
                  <li>Multi-donor fund coordination</li>
                  <li>Progress tracking and reporting</li>
                  <li>Community engagement</li>
                  <li>Quality assurance</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
