import { NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function GET() {
  try {
    const whitepaper = loadMarkdownFileSync('WHITEPAPER_v1.0.md');
    const governance = loadMarkdownFileSync('GOVERNANCE.md');
    const education = loadMarkdownFileSync('EDUCATION.md');

    const analyze = (doc: any, name: string) => ({
      name,
      words: doc.content.split(/\s+/).length,
      headings: doc.headings.length,
      readingTime: Math.ceil(doc.content.split(/\s+/).length / 200)
    });

    const docs = [
      analyze(whitepaper, 'whitepaper'),
      analyze(governance, 'governance'),
      analyze(education, 'education')
    ];

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      totalWords: docs.reduce((a, d) => a + d.words, 0),
      documents: docs
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}