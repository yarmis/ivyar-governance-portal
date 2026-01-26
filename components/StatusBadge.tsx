type Status = 'live' | 'pilot' | 'dev';

const statusConfig = {
  live: { label: 'Live', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  pilot: { label: 'Pilot', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  dev: { label: 'Dev', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
