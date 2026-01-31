import { HeroStakeholders } from '@/components/home/HeroStakeholders';
import { LiveDashboard } from '@/components/home/LiveDashboard';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Stakeholder Cards */}
      <HeroStakeholders />

      {/* Live Transparency Dashboard */}
      <LiveDashboard />

      {/* Features section can go here */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Why IVYAR?
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            The world's first AI-powered governance platform with embedded constitutional safeguards
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-bg-surface border border-border-subtle rounded-xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Constitutional AI
              </h3>
              <p className="text-text-secondary">
                AI that cannot exceed delegated authority. Constitutional boundaries enforced at runtime, not as documentation.
              </p>
            </div>

            <div className="p-6 bg-bg-surface border border-border-subtle rounded-xl">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Full Transparency
              </h3>
              <p className="text-text-secondary">
                Every decision logged and auditable. Real-time compliance metrics. Export all data for independent verification.
              </p>
            </div>

            <div className="p-6 bg-bg-surface border border-border-subtle rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Fast & Accessible
              </h3>
              <p className="text-text-secondary">
                Mobile-first design. Works on any device. WCAG 2.1 AA compliant. Available in 3 languages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
