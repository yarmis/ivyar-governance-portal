import { NextResponse } from 'next/server';
import { loadMarkdownFileSync } from '@/lib/markdown/loader';

export async function GET() {
  try {
    const whitepaper = loadMarkdownFileSync('WHITEPAPER_v1.0.md');
    const governance = loadMarkdownFileSync('GOVERNANCE.md');
    const education = loadMarkdownFileSync('EDUCATION.md');

    const totalWords = [whitepaper, governance, education].reduce((acc, doc) => {
      return acc + doc.content.split(/\s+/).length;
    }, 0);

    return NextResponse.json({
      success: true,
      module: { 
        name: 'HBS Module',
        version: '1.3',
        description: 'Humanitarian Budget Support - Live Governance Engine',
        status: 'live'
      },
      features: {
        decisionTree: {
          enabled: true,
          endpoint: '/api/hbs/governance/tree',
          description: 'Interactive decision framework'
        },
        boundaries: {
          enabled: true,
          endpoint: '/api/hbs/governance/boundaries',
          description: 'Ethical constraints engine'
        },
        reasoning: {
          enabled: true,
          endpoint: '/api/hbs/reasoning',
          description: 'Live decision analysis'
        }
      },
      analytics: {
        totalDocuments: 3,
        totalWords
      },
      endpoints: {
        core: {
          overview: '/api/hbs',
          whitepaper: '/api/hbs/whitepaper',
          governance: '/api/hbs/governance',
          education: '/api/hbs/education',
          search: '/api/hbs/search?q={query}'
        },
        v13: {
          decisionTree: '/api/hbs/governance/tree',
          boundaries: '/api/hbs/governance/boundaries',
          reasoning: '/api/hbs/reasoning (POST)'
        },
        utilities: {
          analytics: '/api/hbs/analytics',
          modules: '/api/hbs/modules',
          structure: '/api/hbs/structure',
          export: '/api/hbs/export',
          changelog: '/api/hbs/changelog'
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}