'use client';
import { useState } from 'react';

interface GovernanceNode {
  id: string;
  title: string;
  description: string;
  children?: GovernanceNode[];
}

export default function GovernanceTree({ nodes }: { nodes: GovernanceNode[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['board']));

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const renderNode = (node: GovernanceNode, level: number = 0) => {
    const isExp = expanded.has(node.id);
    const hasCh = node.children && node.children.length > 0;

    const bgColors = [
      'bg-blue-200 border-blue-500 hover:bg-blue-300',
      'bg-emerald-200 border-emerald-500 hover:bg-emerald-300',
      'bg-amber-200 border-amber-500 hover:bg-amber-300',
      'bg-purple-200 border-purple-500 hover:bg-purple-300'
    ];

    return (
      <div key={node.id} className="mb-3">
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer shadow-sm transition-all ${bgColors[level % bgColors.length]}`}
          onClick={() => hasCh && toggle(node.id)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center text-lg">
                {hasCh && <span className="mr-2 text-gray-700">{isExp ? '▼' : '▶'}</span>}
                {node.title}
              </h4>
              <p className="text-gray-800 mt-1">{node.description}</p>
            </div>
            {hasCh && (
              <span className="text-sm font-medium text-gray-700 bg-white/70 px-3 py-1 rounded-full shadow-sm">
                {node.children?.length} sub-items
              </span>
            )}
          </div>
        </div>
        {isExp && hasCh && (
          <div className="ml-6 mt-2 border-l-4 border-blue-500 pl-4">
            {node.children!.map(c => renderNode(c, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div>{nodes.map(n => renderNode(n, 0))}</div>;
}

export const governanceStructure: GovernanceNode[] = [
  {
    id: 'board',
    title: 'Governing Board',
    description: 'Strategic oversight and policy direction for all HBS operations',
    children: [
      { 
        id: 'tech', 
        title: 'Technical Committee', 
        description: 'Expert guidance on program implementation and quality standards',
        children: [
          { id: 'tech-review', title: 'Project Review Panel', description: 'Reviews and approves project proposals' },
          { id: 'tech-qa', title: 'Quality Assurance Team', description: 'Monitors program performance and standards' }
        ]
      },
      { 
        id: 'comm', 
        title: 'Community Oversight Panel', 
        description: 'Ensures local accountability and community participation',
        children: [
          { id: 'comm-rep', title: 'Community Representatives', description: 'Voice of affected communities' },
          { id: 'comm-monitor', title: 'Local Monitors', description: 'On-the-ground implementation oversight' }
        ]
      },
      {
        id: 'ethics',
        title: 'Ethics Advisory Board',
        description: 'Independent ethical guidance and conflict resolution',
        children: [
          { id: 'ethics-review', title: 'Ethics Review Committee', description: 'Reviews ethical concerns and complaints' },
          { id: 'ethics-policy', title: 'Policy Ethics Team', description: 'Ensures policies align with ethical standards' }
        ]
      }
    ]
  },
  {
    id: 'exec',
    title: 'Executive Management',
    description: 'Day-to-day operational leadership and coordination',
    children: [
      { 
        id: 'exec-dir', 
        title: 'Executive Director', 
        description: 'Overall leadership and external representation',
        children: [
          { id: 'exec-ops', title: 'Operations Director', description: 'Manages program implementation' },
          { id: 'exec-fin', title: 'Finance Director', description: 'Oversees financial management and controls' }
        ]
      },
      {
        id: 'exec-prog',
        title: 'Program Management',
        description: 'Coordinates program delivery across regions',
        children: [
          { id: 'prog-mgr1', title: 'Regional Program Managers', description: 'Lead implementation in specific regions' },
          { id: 'prog-me', title: 'M&E Coordinator', description: 'Monitors and evaluates program outcomes' }
        ]
      }
    ]
  },
  {
    id: 'partners',
    title: 'Partner Organizations',
    description: 'External stakeholders and implementing partners',
    children: [
      { id: 'donors', title: 'Donor Representatives', description: 'Funding organizations and accountability' },
      { id: 'govt', title: 'Government Liaisons', description: 'National and local government coordination' },
      { id: 'ngo', title: 'NGO Partners', description: 'Implementing partner organizations' },
      { id: 'academic', title: 'Academic Advisors', description: 'Research and evidence-based guidance' }
    ]
  }
];
