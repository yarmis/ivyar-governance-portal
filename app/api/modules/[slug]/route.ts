import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Core API',
    description: 'Humanitarian Budget Support API root endpoint.',
    endpoints: {
      education: '/api/hbs/education',
      summarize: '/api/hbs/ai/summarize',
      search: '/api/hbs/search',
      export: '/api/hbs/export'
    },
    documents: [
      'WHITEPAPER_v1.0.md',
      'GOVERNANCE.md',
      'EDUCATION.md'
    ]
  });
}
