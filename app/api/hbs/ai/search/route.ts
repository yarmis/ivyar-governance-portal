import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { query, lang = 'en', scope = 'all' } = await request.json();

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const results = searchDocuments(query, lang, scope);

    return NextResponse.json({
      success: true,
      query,
      lang,
      scope,
      resultsCount: results.length,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function searchDocuments(query: string, lang: string, scope: string): any[] {
  const queryLower = query.toLowerCase();
  const results: any[] = [];

  // Search in boundaries
  if (scope === 'all' || scope === 'boundaries') {
    const boundariesPath = path.join(process.cwd(), 'app/hbs/governance/boundaries/data/boundaries.json');
    if (fs.existsSync(boundariesPath)) {
      const boundaries = JSON.parse(fs.readFileSync(boundariesPath, 'utf-8'));
      boundaries.boundaries.forEach((b: any) => {
        if (b.rule.toLowerCase().includes(queryLower) || 
            b.description.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'boundary',
            id: b.id,
            title: b.rule,
            description: b.description,
            severity: b.severity,
            category: b.category,
            relevance: calculateRelevance(query, b.rule + ' ' + b.description),
            link: '/hbs/governance/boundaries'
          });
        }
      });
    }
  }

  // Search in decision tree
  if (scope === 'all' || scope === 'decisions') {
    const treePath = path.join(process.cwd(), 'app/hbs/governance/tree/data/tree.json');
    if (fs.existsSync(treePath)) {
      const tree = JSON.parse(fs.readFileSync(treePath, 'utf-8'));
      tree.nodes.forEach((n: any) => {
        if (n.title.toLowerCase().includes(queryLower) || 
            n.description.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'decision',
            id: n.id,
            title: n.title,
            description: n.description,
            level: n.level,
            riskLevel: n.riskLevel,
            relevance: calculateRelevance(query, n.title + ' ' + n.description),
            link: '/hbs/governance/tree'
          });
        }
      });
    }
  }

  // Search in education modules
  if (scope === 'all' || scope === 'education') {
    const educationModules = [
      { id: 1, title: 'Introduction to HBS', keywords: 'introduction basics principles overview humanitarian budget support' },
      { id: 2, title: 'Governance Fundamentals', keywords: 'governance accountability decision-making structures' },
      { id: 3, title: 'Financial Management', keywords: 'finance budget allocation controls reporting' },
      { id: 4, title: 'Monitoring & Evaluation', keywords: 'monitoring evaluation M&E indicators data' },
      { id: 5, title: 'Risk Management', keywords: 'risk assessment mitigation strategy' },
      { id: 6, title: 'Stakeholder Engagement', keywords: 'stakeholder engagement communication partnership' },
      { id: 7, title: 'Community Participation', keywords: 'community participation inclusion local' },
      { id: 8, title: 'Ethical Decision-Making', keywords: 'ethics ethical decisions principles values' },
      { id: 9, title: 'Capacity Building', keywords: 'capacity building training development skills' },
      { id: 10, title: 'Systems Strengthening', keywords: 'systems strengthening national development' },
      { id: 11, title: 'Crisis Response', keywords: 'crisis emergency response rapid adaptation' },
      { id: 12, title: 'Leadership & Innovation', keywords: 'leadership innovation change management' }
    ];

    educationModules.forEach((m) => {
      if (m.title.toLowerCase().includes(queryLower) || 
          m.keywords.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'education',
          id: `module-${m.id}`,
          title: `Module ${m.id}: ${m.title}`,
          description: `Educational module covering ${m.title.toLowerCase()}`,
          relevance: calculateRelevance(query, m.title + ' ' + m.keywords),
          link: '/hbs/education'
        });
      }
    });
  }

  // Search common terms
  if (scope === 'all' || scope === 'glossary') {
    const glossary = [
      { term: 'HBS', definition: 'Humanitarian Budget Support - framework for ethical budget support in humanitarian contexts' },
      { term: 'Accountability', definition: 'Obligation to answer for actions and decisions, ensuring transparency' },
      { term: 'Do No Harm', definition: 'Principle ensuring interventions do not exacerbate conflict or vulnerability' },
      { term: 'Beneficiary', definition: 'Person or group receiving humanitarian assistance' },
      { term: 'Fiduciary', definition: 'Relating to financial trust and responsibility' },
      { term: 'M&E', definition: 'Monitoring and Evaluation - systematic tracking and assessment' },
      { term: 'Capacity Building', definition: 'Strengthening skills, abilities, and resources of individuals and organizations' }
    ];

    glossary.forEach((g) => {
      if (g.term.toLowerCase().includes(queryLower) || 
          g.definition.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'glossary',
          id: `term-${g.term.toLowerCase().replace(/\s+/g, '-')}`,
          title: g.term,
          description: g.definition,
          relevance: calculateRelevance(query, g.term + ' ' + g.definition),
          link: '/hbs/whitepaper#glossary'
        });
      }
    });
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, 20);
}

function calculateRelevance(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  
  let score = 0;
  queryWords.forEach(word => {
    if (word.length > 2) {
      const regex = new RegExp(word, 'gi');
      const matches = (textLower.match(regex) || []).length;
      score += matches * 10;
    }
  });

  // Exact phrase bonus
  if (textLower.includes(query.toLowerCase())) {
    score += 50;
  }

  return Math.min(100, score);
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'HBS AI Search',
    version: '1.4',
    description: 'Intelligent search across HBS documentation',
    scopes: ['all', 'boundaries', 'decisions', 'education', 'glossary']
  });
}