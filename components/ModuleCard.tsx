import { StatusBadge } from './StatusBadge';
import * as Icons from 'lucide-react';

type Module = {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'pilot' | 'dev';
  icon: string;
};

export function ModuleCard({ module }: { module: Module }) {
  const IconComponent = (Icons as any)[module.icon] || Icons.Box;

  return (
    <div className="group relative bg-slate-800/40 border border-white/10 rounded-lg p-6 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400">
          <IconComponent className="w-6 h-6" />
        </div>
        <StatusBadge status={module.status} />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
        {module.title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">{module.description}</p>
    </div>
  );
}
