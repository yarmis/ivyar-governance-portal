'use client';
import Link from 'next/link';
import AIAssistant from '@/app/components/AIAssistant';

export default function EmergencyResponsePage() {
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
            <div className="text-6xl">🚨</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">EMERGENCY RESPONSE HUB</h1>
              <p className="text-lg text-[#8B949E]">Global Disaster Coordination & Multi-Agency Response</p>
              <div className="mt-2 text-sm text-[#F85149]">🇺🇸 Built on FEMA & DHS best practices</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><div className="text-xs text-[#8B949E] mb-1">STATUS</div><div className="text-sm font-medium text-[#A371F7]">⚙️ PILOT</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">VERSION</div><div className="text-sm font-medium">1.0</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">API ENDPOINTS</div><div className="text-sm font-medium">16</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">UPDATED</div><div className="text-sm font-medium">2026-01-16</div></div>
            <div><div className="text-xs text-[#8B949E] mb-1">GLOBAL REACH</div><div className="text-sm font-medium">🌍 International</div></div>
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-12 text-white space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">📘 OVERVIEW</h2>
          <p className="text-[#8B949E]">Emergency Response Hub provides real-time coordination for natural disasters and humanitarian crises, built on proven FEMA and NIMS frameworks.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">🔑 KEY CAPABILITIES</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              {icon:'🌪️',title:'Real-time disaster tracking'},
              {icon:'🚁',title:'Resource deployment coordination'},
              {icon:'🏥',title:'Multi-agency communication hub'},
              {icon:'📍',title:'Affected population mapping'},
              {icon:'📊',title:'Impact assessment dashboards'},
              {icon:'🔄',title:'Supply chain coordination'}
            ].map((item,i)=>(
              <div key={i} className="p-4 bg-[#161B22] border border-[#1F242C] rounded cursor-pointer hover:border-[#F85149] transition-all" onClick={()=>alert(`${item.title}\n\nComing soon`)}>
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
      <AIAssistant module="emergency" />
    </div>
  );
}
