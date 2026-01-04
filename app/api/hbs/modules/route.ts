import { NextRequest, NextResponse } from 'next/server';

const modules = [
  { id: 1, title: 'Introduction to HBS', duration: '2 hours', level: 'Beginner' },
  { id: 2, title: 'Governance Fundamentals', duration: '3 hours', level: 'Beginner' },
  { id: 3, title: 'Financial Management', duration: '4 hours', level: 'Intermediate' },
  { id: 4, title: 'Monitoring & Evaluation', duration: '4 hours', level: 'Intermediate' },
  { id: 5, title: 'Risk Management', duration: '3 hours', level: 'Intermediate' },
  { id: 6, title: 'Stakeholder Engagement', duration: '3 hours', level: 'Intermediate' },
  { id: 7, title: 'Community Participation', duration: '4 hours', level: 'Advanced' },
  { id: 8, title: 'Ethical Decision-Making', duration: '3 hours', level: 'Advanced' },
  { id: 9, title: 'Capacity Building', duration: '4 hours', level: 'Advanced' },
  { id: 10, title: 'Systems Strengthening', duration: '5 hours', level: 'Advanced' },
  { id: 11, title: 'Crisis Response Adaptation', duration: '4 hours', level: 'Expert' },
  { id: 12, title: 'Leadership & Innovation', duration: '5 hours', level: 'Expert' }
];

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level');
  let filtered = modules;
  if (level) filtered = modules.filter(m => m.level.toLowerCase() === level.toLowerCase());

  return NextResponse.json({
    success: true,
    totalModules: modules.length,
    totalHours: modules.reduce((a, m) => a + parseInt(m.duration), 0),
    count: filtered.length,
    modules: filtered
  });
}