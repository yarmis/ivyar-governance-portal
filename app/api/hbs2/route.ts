import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS Core API',
    description: 'Humanitarian Budget Support - Root API Endpoint',
    version: '1.3',
    status: 'live',

    documents: [
      'WHITEPAPER_v1.0.md',
      'GOVERNANCE.md',
      'EDUCATION.md'
    ],

    endpoints: {
      core: {
        overview: '/api/hbs',
        education: '/api/hbs/education',
        summarize: '/api/hbs/ai/summarize',
        search: '/api/hbs/search',
        export: '/api/hbs/export'
      },
      governance: {
        decisionTree: '/api/hbs/governance/tree',
        boundaries: '/api/hbs/governance/boundaries',
        reasoning: '/api/hbs/reasoning'
      },
      utilities: {
        analytics: '/api/hbs/analytics',
        modules: '/api/hbs/modules',
        structure: '/api/hbs/structure',
        changelog: '/api/hbs/changelog'
      }
    }
  });
}
// force redeploy
