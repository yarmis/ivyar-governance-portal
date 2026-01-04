import { NextResponse } from 'next/server';

const structure = [
  { id: 'board', title: 'Governing Board', children: [
    { id: 'tech', title: 'Technical Committee' },
    { id: 'comm', title: 'Community Oversight Panel' },
    { id: 'ethics', title: 'Ethics Advisory Board' }
  ]},
  { id: 'exec', title: 'Executive Management', children: [
    { id: 'exec-dir', title: 'Executive Director' },
    { id: 'exec-prog', title: 'Program Management' }
  ]},
  { id: 'partners', title: 'Partner Organizations', children: [
    { id: 'donors', title: 'Donor Representatives' },
    { id: 'govt', title: 'Government Liaisons' },
    { id: 'ngo', title: 'NGO Partners' }
  ]}
];

export async function GET() {
  return NextResponse.json({ success: true, totalNodes: 14, structure });
}