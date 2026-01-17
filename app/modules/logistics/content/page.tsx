import Link from 'next/link';

export default function LogisticsContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/modules/logistics" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
            ← Back to Logistics Engine
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Logistics Engine Documentation</h1>
          <p className="text-lg text-[#8B949E]">Advanced supply chain and distribution management</p>
        </div>

        <div className="space-y-8">
          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">🚚 Overview</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>Logistics Engine provides end-to-end supply chain visibility and optimization for humanitarian aid, reconstruction materials, and commercial goods distribution.</p>
              <div className="rounded bg-[#0D1117] p-4">
                <h3 className="mb-2 font-semibold text-[#E6EDF3]">Core Capabilities:</h3>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Multi-modal transportation planning</li>
                  <li>Warehouse management systems</li>
                  <li>Route optimization and tracking</li>
                  <li>Inventory forecasting</li>
                  <li>Cross-border coordination</li>
                  <li>Last-mile delivery</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">📦 Warehouse Operations</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>Automated warehouse management with real-time inventory tracking:</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Receiving</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Barcode scanning</li>
                    <li>Quality inspection</li>
                    <li>Automated putaway</li>
                  </ul>
                </div>
                <div className="rounded bg-[#0D1117] p-4">
                  <h3 className="mb-2 font-semibold text-[#E6EDF3]">Fulfillment</h3>
                  <ul className="ml-6 list-disc space-y-1 text-sm">
                    <li>Pick-pack-ship</li>
                    <li>Wave planning</li>
                    <li>Cross-docking</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">🗺️ Route Optimization</h2>
            <div className="space-y-4 text-[#8B949E]">
              <p>AI-powered route planning for maximum efficiency:</p>
              <div className="rounded bg-[#0D1117] p-4">
                <ul className="ml-6 list-disc space-y-1">
                  <li>Real-time traffic integration</li>
                  <li>Multi-stop optimization</li>
                  <li>Fuel cost minimization</li>
                  <li>Driver schedule optimization</li>
                  <li>Emergency rerouting</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
