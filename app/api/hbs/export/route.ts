import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function GET(request: NextRequest) {
  const document = request.nextUrl.searchParams.get('document') || 'all';

  try {
    if (document === 'all') {
      return NextResponse.json({
        success: true,
        exportedAt: new Date().toISOString(),
        documents: {
          whitepaper: loadMarkdownFileSync('WHITEPAPER_v1.0.md'),
          governance: loadMarkdownFileSync('GOVERNANCE.md'),
          education: loadMarkdownFileSync('EDUCATION.md')
        }
      });
    }

    const docMap: Record<string, string> = {
      whitepaper: 'WHITEPAPER_v1.0.md',
      governance: 'GOVERNANCE.md',
      education: 'EDUCATION.md'
    };

    const filename = docMap[document];
    if (!filename) return NextResponse.json({ success: false, error: 'Invalid document' }, { status: 400 });

    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      document: loadMarkdownFileSync(filename)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}