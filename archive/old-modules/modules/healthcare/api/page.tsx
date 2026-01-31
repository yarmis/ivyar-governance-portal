import Link from 'next/link';

export default function HealthcareAPIPage() {
  const endpoints = [
    { method: 'GET', path: '/api/v12/healthcare/metrics', description: 'Get healthcare coordination metrics and statistics' },
    { method: 'GET', path: '/api/healthcare/records', description: 'Access patient medical records (FHIR)', params: ['patient_id', 'record_type', 'date_range'] },
    { method: 'GET', path: '/api/healthcare/providers', description: 'Search provider network', params: ['specialty', 'location', 'accepting_patients'] },
    { method: 'GET', path: '/api/healthcare/pricing', description: 'Get procedure cost estimates', params: ['procedure_code', 'provider_id', 'insurance'] },
    { method: 'POST', path: '/api/healthcare/share', description: 'Share medical records with provider', params: ['patient_id', 'provider_id', 'records', 'consent'] },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/healthcare" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Healthcare Coordination
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Healthcare Coordination API</h1>
          <p className="text-lg text-[#8B949E]">HL7 FHIR-compliant API for healthcare data exchange</p>
        </div>

        <div className="mb-8 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">🔐 Authentication & Security</h2>
          <div className="space-y-2 text-sm text-[#8B949E]">
            <p>HIPAA-compliant authentication with patient consent verification</p>
            <div className="rounded bg-[#0D1117] p-3 font-mono text-xs">
              Authorization: Bearer YOUR_HEALTHCARE_TOKEN
            </div>
            <p className="mt-2">All data exchanges are encrypted and logged for compliance</p>
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

        <div className="mt-8 rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#E6EDF3]">🏥 HL7 FHIR Compliance</h2>
          <div className="space-y-2 text-sm text-[#8B949E]">
            <p>All medical record APIs follow HL7 FHIR R4 standard for interoperability</p>
            <p>Supported resource types: Patient, Observation, Condition, MedicationRequest, DiagnosticReport</p>
          </div>
        </div>
      </div>
    </div>
  );
}
