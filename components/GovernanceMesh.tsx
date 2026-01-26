export function GovernanceMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.08]">
        {[...Array(20)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-white/10"
            style={{ left: `${i * 5}%` }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-white/10"
            style={{ top: `${i * 8}%` }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/60 blur-[1px] animate-pulse"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
            }}
          />
        ))}
      </div>
      <div className="absolute -top-40 -left-32 w-96 h-96 bg-cyan-400/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-teal-400/10 blur-[120px] animate-pulse" />
    </div>
  );
}
