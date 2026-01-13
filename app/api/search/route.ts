import { NextRequest, NextResponse } from 'next/server';

const MOCK_DATA = [
  { id: '1', title: 'Procurement Engine', description: 'Tender management and contract oversight', category: 'module', path: '/modules/procurement', keywords: ['procurement', 'tender', 'contract'] },
  { id: '2', title: 'Materials Hub', description: 'Construction materials catalog', category: 'module', path: '/materials', keywords: ['materials', 'construction', 'catalog'] },
  { id: '3', title: 'Zoning Module', description: 'Land use and zoning regulations', category: 'module', path: '/zoning', keywords: ['zoning', 'land', 'regulations'] },
  { id: '4', title: 'Violations', description: 'Construction violations tracking', category: 'module', path: '/violations', keywords: ['violations', 'enforcement'] },
  { id: '5', title: 'Donor Portal', description: 'Reconstruction funding transparency', category: 'module', path: '/donors', keywords: ['donors', 'funding', 'reconstruction'] },
  { id: '6', title: 'US Construction', description: 'US building codes and permits', category: 'module', path: '/us-construction', keywords: ['us', 'building', 'codes', 'permits'] },
  { id: '7', title: 'Geo Intelligence', description: 'Geographic data and utilities', category: 'module', path: '/geo', keywords: ['geo', 'flood', 'utilities'] },
  { id: '8', title: 'HBS Prometheus', description: 'Platform monitoring and observability', category: 'module', path: '/hbs/prometheus', keywords: ['monitoring', 'prometheus', 'metrics'] },
  { id: '9', title: 'USA', description: 'United States operations', category: 'country', path: '/us', keywords: ['usa', 'united states', 'america'] },
  { id: '10', title: 'Ukraine', description: 'Ukraine operations', category: 'country', path: '/ua', keywords: ['ukraine', 'ua'] },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = MOCK_DATA.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.keywords.some(k => k.toLowerCase().includes(query))
  ).slice(0, limit);

  return NextResponse.json({ results });
}
