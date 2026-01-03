import Link from 'next/link';

export default function HBSPage() {
  const modules = [
    {
      title: 'HBS Whitepaper v1.0',
      description: 'Complete documentation of the Humanitarian Budget Support framework, principles, and implementation guidelines.',
      href: '/hbs/whitepaper',
      icon: '📄',
      status: 'Active'
    },
    {
      title: 'Governance Integration',
      description: 'Ethical governance framework, decision-making protocols, and accountability mechanisms.',
      href: '/hbs/governance',
      icon: '⚖️',
      status: 'Active'
    },
    {
      title: 'Educational Model',
      description: 'Training resources, learning paths, and capacity building materials for HBS implementation.',
      href: '/hbs/education',
      icon: '🎓',
      status: 'Active'
    },
    {
      title: 'HBS Portal',
      description: 'Interactive dashboard for HBS operations, monitoring, and stakeholder coordination.',
      href: '/hbs/portal',
      icon: '🖥️',
      status: 'In Development'
    }
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Humanitarian Budget Support (HBS)
        </h2>
        <p className="text-lg text-blue-100 max-w-3xl">
          The HBS Module provides a comprehensive framework for ethical, transparent, 
          and accountable budget support in humanitarian contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{module.icon}</div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                module.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {module.status}
              </span>
            </div>
            <h4 className="font-semibold text-lg mb-2">{module.title}</h4>
            <p className="text-gray-600 text-sm">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
