'use client';

import type { Heading } from '@/lib/markdown/parser';

interface WhitepaperNavProps {
  headings: Heading[];
}

export default function WhitepaperNav({ headings }: WhitepaperNavProps) {
  return (
    <nav className="sticky top-8">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Table of Contents</h3>
        <div className="space-y-1 max-h-[70vh] overflow-y-auto">
          {headings.map((heading) => (
            <a key={heading.id} href={"#" + heading.id} className="block py-1 px-2 text-sm text-gray-700 rounded hover:bg-gray-100">{heading.text}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}
