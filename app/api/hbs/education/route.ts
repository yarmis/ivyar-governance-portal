import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function GET() {
  try {
    const doc = await loadMarkdownFileSync('EDUCATION.md');

    const words = doc.split(/\s+/).length;

    return NextResponse.json({
      success: true,
      data: {
        title: 'HBS Education',
        content: doc,          // raw markdown text
        html: null,            // no HTML parsing in this version
        headings: [],          // no heading extraction
        words,
        readingTime: Math.ceil(words / 200) + ' minutes'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
