import Link from 'next/link';

export default function TransparencyAPIPage() {
  const endpoints = [
    { method: 'GET', path: '/api/v12/transparency/metrics', description: 'Get transparency metrics and statistics' },
    { method: 'GET', path: '/api/transparency/audit-logs', description: 'Retrieve audit logs', params: ['date_range', 'category', 'user_id'] },
    { method: 'GET', path: '/api/transparency/decisions', description: 'Access decision records', params: ['decision_type', 'date', 'department'] },
    { method: 'GET', path: '/api/transparency/contracts', description: 'View public contracts', params: ['value_min', 'value_max', 'contractor'] },
    { method: 'POST', path: '/api/transparency/whistleblower', description: 'Submit whistleblower report', params: ['category', 'description', 'evidence', 'anonymous'] },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/transparency" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Transparency Hub
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Transparency Hub API</h1>
          <p className="text-lg text-[#8B949E]">API documentation for transparency and accountability systems</p>
        </div>

        <div className="mb-8 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">🔐 Authentication</h2>
          <div className="space-y-2 text-sm text-[#8B949E]">
            <p>All endpoints require OAuth 2.0 + JWT authentication</p>
            <div className="rounded bg-[#0D1117] p-3 font-mono text-xs">
              Authorization: Bearer YOUR_JWT_TOKEN
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#E6EDF3]">Endpoints</h2>
          {endpoints.map((endpoint, i) => (
            <div key={i} className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded px-2 py-1 text-xs font-bold ${
                  endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm text-[#E6EDF3]">{endpoint.path}</code>
              </div>
              <p className="mb-4 text-sm text-[#8B949E]">{endpoint.description}</p>
              {endpoint.params && (
                <div>
                  <div className="mb-2 text-xs font-semibold text-[#8B949E]">Parameters:</div>
                  <div className="flex flex-wrap gap-2">
                    {endpoint.params.map((param, j) => (
                      <span key={j} className="rounded bg-[#0D1117] px-2 py-1 text-xs font-mono text-[#8B949E]">
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
