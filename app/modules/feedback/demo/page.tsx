'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function FeedbackDemoPage() {
  const [submitted, setSubmitted] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#0D1117] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/modules/feedback" className="mb-4 inline-flex items-center gap-2 text-sm text-[#00A3FF] hover:underline">
          ← Back to Citizen Feedback
        </Link>
        <h1 className="mb-2 text-4xl font-bold text-[#E6EDF3]">Citizen Feedback Demo</h1>
        
        {submitted ? (
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-8 text-center">
            <div className="mb-4 text-6xl">✅</div>
            <h2 className="mb-2 text-2xl font-bold text-[#E6EDF3]">Feedback Submitted!</h2>
            <button onClick={() => setSubmitted(false)} className="mt-4 rounded-lg bg-[#00A3FF] px-6 py-3 text-white">Submit Another</button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#30363D] bg-[#161B22] p-6">
            <button onClick={() => setSubmitted(true)} className="rounded-lg bg-[#00A3FF] px-6 py-3 text-white">Submit Demo Feedback</button>
          </div>
        )}
      </div>
    </div>
  );
}
