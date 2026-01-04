import { NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function GET() {
  try {
    const doc = loadMarkdownFileSync('EDUCATION.md');
    return NextResponse.json({
      success: true,
      data: {
        title: 'HBS Education',
        content: doc.content,
        html: doc.html,
        headings: doc.headings
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}