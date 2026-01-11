import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownDocument } from '@/lib/markdown/loader';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Missing search query' },
        { status: 400 }
      );
    }

    const docMap: Record<string, string> = {
      whitepaper: 'WHITEPAPER_v1.0.md',
      governance: 'GOVERNANCE.md',
      education: 'EDUCATION.md'
    };

    const results: any[] = [];

    for (const [key, filename] of Object.entries(docMap)) {
      const doc = await loadMarkdownDocument(filename);

      const lines = doc.raw
        .split('\n')
        .filter(line => line.toLowerCase().includes(query));

      if (lines.length > 0) {
        results.push({
          document: key,
          matches: lines
        });
      }
    }

    return NextResponse.json({
      success: true,
      query,
      results
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
