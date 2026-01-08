import Link from 'next/link';

interface Action {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

interface ModuleActionsProps {
  actions: Action[];
}

export default function ModuleActions({ actions }: ModuleActionsProps) {
  return (
    <div className="py-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-6">🔗 Actions</h2>
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${action.variant === 'primary' 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
              }
            `}
          >
            {action.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
