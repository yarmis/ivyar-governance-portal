export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-semibold mb-3">{title}</h2>
      <div className="h-0.5 w-20 bg-cyan-400 mb-4" />
      {subtitle && <p className="text-white/60 max-w-3xl">{subtitle}</p>}
    </div>
  );
}
