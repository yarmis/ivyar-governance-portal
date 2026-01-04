'use client';

import type { Heading } from '@/lib/markdown/parser';

interface WhitepaperNavProps {
  headings: Heading[];
}

export default function WhitepaperNav({ headings }: WhitepaperNavProps) {
  return (
    <nav className="sticky top-8">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Table of Contents</h3>
        <div className="space-y-1">
          {headings.map((h) => <a key={h.id} href={`#${h.id}`} className="block py-1 px-2 text-sm text-gray-600 hover:text-blue-600 rounded">{h.text}</a>)}
        </div>
      </div>
    </nav>
  );
}
