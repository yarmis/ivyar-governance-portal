import Link from 'next/link';

export default function FeedbackContentPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/modules/feedback" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
          ← Back to Citizen Feedback
        </Link>
        <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Citizen Feedback Documentation</h1>
        <p className="mb-6 text-lg text-[#8B949E]">Complete guide to feedback system</p>
        
        <section className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#E6EDF3]">📢 Overview</h2>
          <p className="text-[#8B949E]">Submit and track citizen feedback</p>
        </section>
      </div>
    </div>
  );
}
