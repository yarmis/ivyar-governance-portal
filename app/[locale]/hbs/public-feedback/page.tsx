'use client';

import Link from 'next/link';

export default function PublicFeedbackPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <Link href="/us/hbs" className="text-white/70 hover:text-white no-underline">← Back</Link>
      <h1 className="text-4xl font-bold mt-8">Public Feedback Module</h1>
      <p className="text-white/65 mt-4">IT WORKS! Module is live!</p>
    </div>
  );
}
