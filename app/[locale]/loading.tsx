export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Navigation Skeleton */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1F242C] animate-pulse" />
            <div className="w-20 h-5 bg-[#1F242C] animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-5 bg-[#1F242C] animate-pulse rounded" />
            <div className="w-24 h-5 bg-[#1F242C] animate-pulse rounded" />
            <div className="w-32 h-10 bg-[#1F242C] animate-pulse rounded" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="pt-[140px] pb-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="w-32 h-6 bg-[#1F242C] animate-pulse rounded mb-4" />
            <div className="w-full h-12 bg-[#1F242C] animate-pulse rounded mb-4" />
            <div className="w-3/4 h-12 bg-[#1F242C] animate-pulse rounded mb-6" />
            <div className="w-full h-6 bg-[#1F242C] animate-pulse rounded mb-2" />
            <div className="w-2/3 h-6 bg-[#1F242C] animate-pulse rounded mb-8" />
            <div className="flex gap-4">
              <div className="w-36 h-12 bg-[#00A3FF]/20 animate-pulse rounded" />
              <div className="w-36 h-12 bg-[#1F242C] animate-pulse rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Skeleton */}
      <section className="py-20 bg-[#0D1117]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="w-48 h-8 bg-[#1F242C] animate-pulse rounded mx-auto mb-4" />
            <div className="w-72 h-5 bg-[#1F242C] animate-pulse rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#161B22] border border-[#1F242C] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#1F242C] animate-pulse rounded" />
                  <div className="w-16 h-6 bg-[#1F242C] animate-pulse rounded" />
                </div>
                <div className="w-3/4 h-6 bg-[#1F242C] animate-pulse rounded mb-3" />
                <div className="w-full h-4 bg-[#1F242C] animate-pulse rounded mb-2" />
                <div className="w-2/3 h-4 bg-[#1F242C] animate-pulse rounded mb-4" />
                <div className="flex justify-between pt-4 border-t border-[#1F242C]">
                  <div className="w-24 h-4 bg-[#1F242C] animate-pulse rounded" />
                  <div className="w-20 h-4 bg-[#00A3FF]/20 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
