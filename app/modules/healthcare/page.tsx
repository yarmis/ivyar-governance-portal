'use client';
import Link from 'next/link';

export default function HealthcareCoordinationPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <nav className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <Link href="/" className="text-[#8B949E] hover:text-white flex items-center gap-2">← BACK TO MODULES</Link>
        </div>
      </nav>
      <div className="border-b border-[#1F242C] bg-[#161B22]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="flex items-start gap-6 mb-8">
            <div className="text-6xl">🏥</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">HEALTHCARE COORDINATION</h1>
              <p className="text-lg text-[#8B949E]">Global Healthcare Integration & Cost Optimization</p>
              <div className="mt-2 text-sm text-[#3CCB7F]">🇺🇸 Built on Medicare/Medicaid infrastructure standards</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><div className="text-xs text-[#8B949E] mb-1">STATUS</div><div className="text-sm font-medium text-[#A371F7]">⚙️ PILOT</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">VERSION</div><div className="text-sm font-medium">1.0</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div><div className="text-sm font-medium">18</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">UPDATED</div><div className="text-sm font-medium">2026-01-16</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">GLOBAL REACH</div><div className="text-sm font-medium">🌍 International</div></div>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-12 text-white space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">📘 OVERVIEW</h2>
          <p className="text-[#8B949E]">Healthcare Coordination provides unified infrastructure for medical records, provider networks, and cost optimization, built on Medicare/Medicaid and HL7 FHIR standards.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">🔑 KEY CAPABILITIES</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              {icon:'📋',title:'Cross-jurisdictional medical records'},
              {icon:'🏥',title:'Provider network transparency'},
              {icon:'💰',title:'Cost optimization & price transparency'},
              {icon:'🔐',title:'HIPAA-compliant data exchange'},
              {icon:'📊',title:'Healthcare outcome analytics'},
              {icon:'🧩',title:'Public/private system integration'}
            ].map((item,i)=>(
              <div key={i} className="p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer hover:border-[#3CCB7F] transition-all" onClick={()=>alert(`${item.title}\n\nComing soon`)}>
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="text-sm text-[#8B949E]">{item.title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <footer className="mt-16 border-t border-[#1F242C] bg-[#161B22] px-6 py-8">
        <div className="max-w-[1200px] mx-auto text-center text-sm text-[#6E7681]">🇺🇸 Built in the United States • 💙💛 Inspired by Ukraine • 🌍 Designed for the world</div>
      </footer>
    </div>
  );
}
