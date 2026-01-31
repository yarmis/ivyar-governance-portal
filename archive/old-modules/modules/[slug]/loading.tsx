export default function ModuleLoading() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E6EDF3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#1F242C] z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1F242C] animate-pulse" />
            <div className="w-20 h-5 bg-[#1F242C] animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-5 bg-[#1F242C] animate-pulse rounded" />
            <div className="w-28 h-9 bg-[#00A3FF]/20 animate-pulse rounded" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="pt-[120px] pb-12 border-b border-[#1F242C]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#1F242C] animate-pulse rounded-xl" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-48 h-8 bg-[#1F242C] animate-pulse rounded" />
                    <div className="w-24 h-6 bg-[#1F242C] animate-pulse rounded" />
                  </div>
                  <div className="w-72 h-5 bg-[#1F242C] animate-pulse rounded" />
                </div>
              </div>
              <div className="w-full h-4 bg-[#1F242C] animate-pulse rounded mt-6 mb-2" />
              <div className="w-3/4 h-4 bg-[#1F242C] animate-pulse rounded" />
            </div>
            
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 gap-4 lg:w-[320px]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#161B22] border border-[#1F242C] p-4 rounded-lg">
                  <div className="w-20 h-7 bg-[#1F242C] animate-pulse rounded mb-2" />
                  <div className="w-16 h-4 bg-[#1F242C] animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Skeleton */}
      <section className="border-b border-[#1F242C] bg-[#0A0D12]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex gap-1 py-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-8 bg-[#1F242C] animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <main className="py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Features */}
              <div>
                <div className="w-32 h-6 bg-[#1F242C] animate-pulse rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-[#161B22] border border-[#1F242C] p-5 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#1F242C] animate-pulse rounded" />
                        <div className="flex-1">
                          <div className="w-32 h-5 bg-[#1F242C] animate-pulse rounded mb-2" />
                          <div className="w-full h-4 bg-[#1F242C] animate-pulse rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#161B22] border border-[#1F242C] p-6 rounded-lg">
                <div className="w-28 h-5 bg-[#1F242C] animate-pulse rounded mb-4" />
                <div className="space-y-3">
                  <div className="w-full h-11 bg-[#00A3FF]/20 animate-pulse rounded" />
                  <div className="w-full h-11 bg-[#1F242C] animate-pulse rounded" />
                  <div className="w-full h-11 bg-[#1F242C] animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
