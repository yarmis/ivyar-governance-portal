import { NextResponse } from 'next/server';

const changelog = [
  { 
    version: '1.3.0', 
    date: '2026-01-04', 
    type: 'major',
    changes: [
      'Added Governance Decision Tree with interactive nodes',
      'Implemented Boundary Conditions Engine (10 ethical rules)',
      'Created Live Reasoning Engine for real-time analysis',
      'New API endpoints: /governance/tree, /governance/boundaries, /reasoning',
      'Military-grade operational UI design',
      'Risk signal indicators and confidence meters'
    ] 
  },
  { 
    version: '1.2.0', 
    date: '2026-01-03', 
    type: 'feature',
    changes: [
      'Added API endpoints for HBS module',
      'Search functionality with filters',
      'Analytics and export capabilities',
      'AI summarization endpoint',
      'Governance structure API'
    ] 
  },
  { 
    version: '1.1.0', 
    date: '2026-01-02', 
    type: 'feature',
    changes: [
      'MarkdownRenderer component',
      'GovernanceTree with interactive expand/collapse',
      'EducationModuleViewer with progress tracking',
      'Enhanced styling with vibrant colors'
    ] 
  },
  { 
    version: '1.0.0', 
    date: '2026-01-01', 
    type: 'release',
    changes: [
      'Initial release of HBS Module',
      'Core documentation: Whitepaper, Governance, Education'
    ] 
  }
];

const roadmap = [
  { version: '1.4.0', planned: '2026-Q1', features: ['AI-powered decision recommendations', 'Multi-language support'] },
  { version: '1.5.0', planned: '2026-Q2', features: ['Real-time collaboration', 'Audit trail system'] },
  { version: '2.0.0', planned: '2026-Q3', features: ['Full integration with IVYAR modules', 'Advanced analytics dashboard'] }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    currentVersion: '1.3.0',
    lastUpdated: '2026-01-04',
    status: 'live',
    changelog,
    roadmap
  });
}