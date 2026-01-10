import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function POST(request: NextRequest) {
  try {
    const { document } = await request.json();

    const docMap: Record<string, string> = {
      whitepaper: 'WHITEPAPER_v1.0.md',
      governance: 'GOVERNANCE.md',
      education: 'EDUCATION.md'
    };

    const filename = docMap[document?.toLowerCase()];
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Invalid document' },
        { status: 400 }
      );
    }

    // Load markdown file (returns string)
    const doc = await loadMarkdownFileSync(filename);

    // Count words
    const words = doc.split(/\s+/).length;

    // Static summaries
    const summaries: Record<string, string> = {
      whitepaper:
        'Comprehensive framework for Humanitarian Budget Support covering principles, governance, and implementation.',
      governance:
        'Ethical governance framework with multi-stakeholder oversight and accountability mechanisms.',
      education:
        'Training curriculum with 12 modules from beginner to expert level with certification pathways.'
    };

    return NextResponse.json({
      success: true,
      document,
      summary: summaries[document],
      words,
      // Markdown is plain text → no headings array exists
      sections: 0,
      readingTime: Math.ceil(words / 200) + ' minutes'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
