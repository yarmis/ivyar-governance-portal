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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-4">
          Humanitarian Budget Support (HBS)
        </h2>
        <p className="text-lg text-blue-100 max-w-3xl">
          The HBS Module provides a comprehensive framework for ethical, transparent, 
          and accountable budget support in humanitarian contexts. Built on principles 
          of dignity, sustainability, and local empowerment.
        </p>
      </div>

      {/* Key Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl mb-3">🤝</div>
          <h3 className="font-semibold text-lg mb-2">Human-Centered</h3>
          <p className="text-gray-600 text-sm">
            Prioritizes dignity, agency, and sustainable impact for affected communities.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-semibold text-lg mb-2">Transparent</h3>
          <p className="text-gray-600 text-sm">
            Open governance, clear accountability, and verifiable outcomes.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="font-semibold text-lg mb-2">Sustainable</h3>
          <p className="text-gray-600 text-sm">
            Builds local capacity and creates lasting positive change.
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <h3 className="text-2xl font-bold mb-6">HBS Module Components</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group"
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
            <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
              {module.title}
            </h4>
            <p className="text-gray-600 text-sm">
              {module.description}
            </p>
            <div className="mt-4 text-blue-600 text-sm font-medium">
              Learn more →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 bg-gray-100 rounded-lg p-8">
        <h3 className="text-xl font-bold mb-6">HBS by the Numbers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-600">15+</div>
            <div className="text-sm text-gray-600">Framework Sections</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Core Principles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Educational Modules</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600">Open & Transparent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
