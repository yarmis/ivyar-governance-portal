import Link from 'next/link';
import moduleData from '@/modules/hbs.json';

export default async function HBSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors"
          >
            ← BACK TO MODULES
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 border-l-4 border-blue-500 pl-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-6xl">{moduleData.icon}</span>
            <div>
              <h1 className="text-4xl font-light tracking-tight text-white mb-1">
                {moduleData.name.toUpperCase()}
              </h1>
              <p className="text-lg text-gray-400 font-light">
                {moduleData.fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-12 bg-[#111111] border border-gray-800 rounded-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
              <div className="text-green-400 font-mono font-semibold">
                ✓ {moduleData.status.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Version</div>
              <div className="text-white font-mono">{moduleData.version}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">API Endpoints</div>
              <div className="text-white font-mono">{moduleData.apiEndpoints}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Updated</div>
              <div className="text-white font-mono text-sm">{moduleData.updated}</div>
            </div>
          </div>
          
          {/* Compliance Badges */}
          {moduleData.compliance && moduleData.compliance.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Compliance</div>
              <div className="flex flex-wrap gap-2">
                {moduleData.compliance.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1 bg-[#1a1a1a] border border-gray-700 text-gray-300 text-xs font-mono"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          
          {/* Overview */}
          <div className="bg-[#111111] border border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
              <span className="text-2xl">📘</span>
              <h2 className="text-xl font-light tracking-wide text-white">OVERVIEW</h2>
            </div>
            <p className="text-gray-400 leading-relaxed font-light">
              {moduleData.description}
            </p>
          </div>

          {/* AI Governance */}
          <div className="bg-[#111111] border border-blue-900/30 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-900/30">
              <span className="text-2xl">🧠</span>
              <h2 className="text-xl font-light tracking-wide text-blue-400">AI GOVERNANCE</h2>
            </div>
            <ul className="space-y-3 text-gray-400 font-light">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Human-in-the-loop approval</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Explainable decisions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Risk scoring & assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">▸</span>
                <span>Complete audit logs</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Key Capabilities */}
        <div className="bg-[#111111] border border-gray-800 p-8 mb-6">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
            <span className="text-2xl">🔑</span>
            <h2 className="text-xl font-light tracking-wide text-white">KEY CAPABILITIES</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '📊', text: 'Budget tracking & transparency' },
              { icon: '🌍', text: 'Humanitarian aid distribution' },
              { icon: '⚖️', text: 'Ethical governance frameworks' },
              { icon: '🤖', text: 'AI-powered decision support' },
              { icon: '📋', text: 'Full audit trail & compliance' },
              { icon: '🧩', text: 'Module integration' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-4 bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <span className="text-xl opacity-70">{item.icon}</span>
                <span className="text-gray-400 text-sm font-light">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#111111] border border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            <span className="text-2xl">🔗</span>
            <h2 className="text-xl font-light tracking-wide text-white">ACTIONS</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/portal/hbs"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm tracking-wider transition-colors"
            >
              OPEN MODULE →
            </Link>
            <Link
              href="/docs/hbs"
              className="px-8 py-3 border border-gray-700 hover:border-blue-600 text-gray-300 hover:text-blue-400 font-mono text-sm tracking-wider transition-colors"
            >
              VIEW API →
            </Link>
            <Link
              href="/demo/hbs"
              className="px-8 py-3 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-mono text-sm tracking-wider transition-colors"
            >
              RUN DEMO →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
