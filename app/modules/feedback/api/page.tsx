import Link from 'next/link';

export default function FeedbackAPIPage() {
  const endpoints = [
    { method: 'GET', path: '/api/v12/feedback/metrics', description: 'Get citizen feedback metrics and statistics' },
    { method: 'POST', path: '/api/feedback/submit', description: 'Submit citizen feedback', params: ['category', 'message', 'contact_info', 'attachments'] },
    { method: 'GET', path: '/api/feedback/submissions', description: 'List feedback submissions', params: ['status', 'category', 'date_range'] },
    { method: 'PUT', path: '/api/feedback/update', description: 'Update submission status', params: ['submission_id', 'status', 'response'] },
    { method: 'GET', path: '/api/feedback/analytics', description: 'Get feedback analytics', params: ['period', 'category', 'sentiment'] },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/feedback" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Citizen Feedback
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Citizen Feedback API</h1>
          <p className="text-lg text-[#8B949E]">API documentation for citizen engagement and feedback systems</p>
        </div>

        <div className="mb-8 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">🔐 Authentication</h2>
          <div className="space-y-2 text-sm text-[#8B949E]">
            <p>Public submission endpoints allow anonymous access. Admin endpoints require authentication.</p>
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
                  endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 
                  endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                  'bg-yellow-500/20 text-yellow-400'
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
