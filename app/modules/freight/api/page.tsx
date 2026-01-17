import Link from 'next/link';

export default function APIPage() {
  const endpoints = [
    { method: 'GET', path: '/api/v12/freight/metrics', description: 'Get freight metrics and statistics' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/freight" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">← Back</Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Freight Module API</h1>
        </div>
        <div className="space-y-4">
          {endpoints.map((e, i) => (
            <div key={i} className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded bg-blue-500/20 px-2 py-1 text-xs font-bold text-blue-400">{e.method}</span>
                <code className="text-sm text-[#E6EDF3]">{e.path}</code>
              </div>
              <p className="text-sm text-[#8B949E]">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
