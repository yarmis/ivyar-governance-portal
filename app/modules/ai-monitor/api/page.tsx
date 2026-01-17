import Link from 'next/link';

export default function AIMonitorAPIPage() {
  const endpoints = [
    { method: 'GET', path: '/api/v12/ai-monitor/metrics', description: 'Get AI monitoring metrics and statistics' },
    { method: 'GET', path: '/api/ai-monitor/decisions', description: 'List AI decisions', params: ['date_range', 'confidence_min', 'override_status', 'page'] },
    { method: 'GET', path: '/api/ai-monitor/decision/:id', description: 'Get decision details', params: ['id', 'include_explanation'] },
    { method: 'POST', path: '/api/ai-monitor/override', description: 'Override AI decision', params: ['decision_id', 'reason', 'human_decision'] },
    { method: 'GET', path: '/api/ai-monitor/bias-report', description: 'Get bias analysis report', params: ['period', 'category', 'demographic'] },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/ai-monitor" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to AI Monitor
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">AI Monitor API</h1>
          <p className="text-lg text-[#8B949E]">API documentation for AI decision oversight and accountability</p>
        </div>

        <div className="mb-8 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">🔐 Authentication</h2>
          <div className="space-y-2 text-sm text-[#8B949E]">
            <p>Requires elevated permissions for oversight operations</p>
            <div className="rounded bg-[#0D1117] p-3 font-mono text-xs">
              Authorization: Bearer YOUR_OVERSIGHT_TOKEN
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
