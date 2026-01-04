import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ success: false, error: 'Query too short' }, { status: 400 });
  }

  try {
    const docs = [
      { file: 'WHITEPAPER_v1.0.md', name: 'whitepaper' },
      { file: 'GOVERNANCE.md', name: 'governance' },
      { file: 'EDUCATION.md', name: 'education' }
    ];

    const results = [];

    for (const d of docs) {
      const doc = loadMarkdownFileSync(d.file);
      if (doc.content.toLowerCase().includes(query)) {
        const lines = doc.content.split('\n').filter(l => l.toLowerCase().includes(query));
        results.push({ document: d.name, matches: lines.slice(0, 5) });
      }
    }

    return NextResponse.json({ success: true, query, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}