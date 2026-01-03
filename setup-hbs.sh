#!/bin/bash

echo "🚀 Setting up HBS Module..."

# Navigate to project root
cd ~/ivyar-portal

# 1. Create app/hbs/layout.tsx
cat > app/hbs/layout.tsx << 'EOF'
import Link from 'next/link';

export default function HBSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: 'Overview', href: '/hbs' },
    { name: 'Whitepaper v1.0', href: '/hbs/whitepaper' },
    { name: 'Governance', href: '/hbs/governance' },
    { name: 'Education', href: '/hbs/education' },
    { name: 'Portal', href: '/hbs/portal' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to IVYAR
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                HBS Module
              </h1>
              <p className="text-sm text-gray-600">
                Humanitarian Budget Support & Ethical Governance
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 pb-4 border-b-2 border-transparent hover:border-blue-500 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            © 2026 IVYAR Platform. HBS Module v1.0 - Humanitarian Budget Support
          </p>
        </div>
      </footer>
    </div>
  );
}
EOF

echo "✅ Created app/hbs/layout.tsx"

# 2. Create app/hbs/page.tsx
cat > app/hbs/page.tsx << 'EOF'
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
EOF

echo "✅ Created app/hbs/page.tsx"

# 3. Create app/hbs/whitepaper/page.tsx
cat > app/hbs/whitepaper/page.tsx << 'EOF'
export default function WhitepaperPage() {
  return (
    <div>
      <div className="prose max-w-none">
        <h2 className="text-3xl font-bold mb-6">HBS Whitepaper v1.0</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-sm text-blue-700">
            📝 This is a placeholder for the HBS Whitepaper. 
            The full content will be synced from docs/hbs/WHITEPAPER_v1.0.md
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-2xl font-semibold mb-4">Executive Summary</h3>
            <p className="text-gray-700">
              The Humanitarian Budget Support (HBS) framework provides a comprehensive 
              approach to ethical, transparent, and accountable budget support in 
              humanitarian contexts.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4">Core Principles</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Human dignity and agency</li>
              <li>Transparency and accountability</li>
              <li>Local ownership and capacity building</li>
              <li>Sustainability and long-term impact</li>
              <li>Inclusive participation</li>
              <li>Evidence-based decision making</li>
              <li>Adaptive learning</li>
              <li>Do no harm</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4">Implementation Framework</h3>
            <p className="text-gray-700 mb-4">
              Content to be added from WHITEPAPER_v1.0.md
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Created app/hbs/whitepaper/page.tsx"

# 4. Create app/hbs/governance/page.tsx
cat > app/hbs/governance/page.tsx << 'EOF'
export default function GovernancePage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">HBS Governance Integration</h2>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="text-sm text-yellow-700">
          ⚖️ Governance framework content will be synced from docs/hbs/GOVERNANCE.md
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Decision-Making Protocols</h3>
          <p className="text-gray-600 text-sm">
            Structured processes for ethical decision-making in HBS operations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Accountability Mechanisms</h3>
          <p className="text-gray-600 text-sm">
            Systems for tracking, reporting, and ensuring accountability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Stakeholder Engagement</h3>
          <p className="text-gray-600 text-sm">
            Framework for inclusive participation and consultation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Risk Management</h3>
          <p className="text-gray-600 text-sm">
            Systematic approach to identifying and mitigating risks.
          </p>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Created app/hbs/governance/page.tsx"

# 5. Create app/hbs/education/page.tsx
cat > app/hbs/education/page.tsx << 'EOF'
export default function EducationPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">HBS Educational Model</h2>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
        <p className="text-sm text-green-700">
          🎓 Educational content will be synced from docs/hbs/EDUCATION.md
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Foundation Course</h3>
          <p className="text-gray-600 text-sm mb-4">
            Introduction to HBS principles, framework, and implementation basics.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Module 1-3
            </span>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Start Learning →
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Governance & Ethics</h3>
          <p className="text-gray-600 text-sm mb-4">
            Deep dive into ethical decision-making and governance structures.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Module 4-6
            </span>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Start Learning →
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Implementation & Practice</h3>
          <p className="text-gray-600 text-sm mb-4">
            Practical skills for implementing HBS in real-world contexts.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Module 7-9
            </span>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Start Learning →
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Advanced Topics</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complex scenarios, adaptation strategies, and innovation.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              Module 10-12
            </span>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Start Learning →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "✅ Created app/hbs/education/page.tsx"

# 6. Create app/hbs/portal/page.tsx
cat > app/hbs/portal/page.tsx << 'EOF'
export default function PortalPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">HBS Portal Dashboard</h2>
      
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-8">
        <p className="text-sm text-purple-700">
          🖥️ Portal UI/UX and interactive features - In Development
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600 text-sm">Real-time monitoring and reporting</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold mb-2">Stakeholders</h3>
          <p className="text-gray-600 text-sm">Coordination and communication</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold mb-2">Projects</h3>
          <p className="text-gray-600 text-sm">Project tracking and management</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Portal Features Coming Soon</h3>
        <p className="text-gray-600 mb-6">
          Interactive dashboard, workflow management, and collaboration tools
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Request Early Access
        </button>
      </div>
    </div>
  );
}
EOF

echo "✅ Created app/hbs/portal/page.tsx"

echo ""
echo "✨ HBS Module setup complete!"
echo ""
echo "📁 Created files:"
echo "  - app/hbs/layout.tsx"
echo "  - app/hbs/page.tsx"
echo "  - app/hbs/whitepaper/page.tsx"
echo "  - app/hbs/governance/page.tsx"
echo "  - app/hbs/education/page.tsx"
echo "  - app/hbs/portal/page.tsx"
echo ""
echo "🚀 Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Visit: http://localhost:3000/hbs"
echo "  3. Sync content from docs/hbs/*.md files"
echo ""
