export function PortalHeader({ trustline }: { trustline: string }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center font-bold text-slate-900">
              IV
            </div>
            <div>
              <div className="font-bold text-white">IVYAR</div>
              <div className="text-xs text-white/60">Governance Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="/us" className="text-sm text-white/80 hover:text-cyan-400 transition">🇺🇸 US</a>
            <a href="/ua" className="text-sm text-white/80 hover:text-cyan-400 transition">🇺🇦 UA</a>
            <a href="/sp" className="text-sm text-white/80 hover:text-cyan-400 transition">🇪🇸 SP</a>
          </div>
        </div>
        <div className="mt-2 text-xs text-cyan-400/60">{trustline}</div>
      </div>
    </header>
  );
}
