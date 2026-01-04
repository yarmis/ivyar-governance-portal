'use client';

import type { Heading } from '@/lib/markdown/parser';

interface WhitepaperNavProps {
  headings: Heading[];
}

export default function WhitepaperNav({ headings }: WhitepaperNavProps) {
  return (
    <nav className="sticky top-8">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <h3 className="text-sm font-bold text-white mb-3">Table of Contents</h3>
        <div className="space-y-1">
          {headings.map((h) => (
            <a 
              key={h.id} 
              href={`#${h.id}`} 
              className="block py-1 px-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-colors"
            >
              {h.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}