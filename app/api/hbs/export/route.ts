import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownDocument } from '@/lib/markdown/loader';

export async function GET(request: NextRequest) {
  const document = request.nextUrl.searchParams.get('document') || 'all';

  try {
    const docMap: Record<string, string> = {
      whitepaper: 'WHITEPAPER_v1.0.md',
      governance: 'GOVERNANCE.md',
      education: 'EDUCATION.md'
    };

    // Export ALL documents
    if (document === 'all') {
      const whitepaper = await loadMarkdownDocument(docMap.whitepaper);
      const governance = await loadMarkdownDocument(docMap.governance);
      const education = await loadMarkdownDocument(docMap.education);

      return NextResponse.json({
        success: true,
        exportedAt: new Date().toISOString(),
        documents: {
          whitepaper,
          governance,
          education
        }
      });
    }

    // Export ONE document
    const filename = docMap[document];
    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Invalid document' },
        { status: 400 }
      );
    }

    const doc = await loadMarkdownDocument(filename);

    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      document: doc
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
