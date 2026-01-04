'use client';
import { useState } from 'react';

interface Module {
  id: number;
  title: string;
  duration: string;
  level: string;
  description: string;
  objectives: string[];
}

interface Props {
  modules: Module[];
}

export default function EducationModuleViewer({ modules }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleComplete = (id: number) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const levelColors: Record<string, string> = {
    'Beginner': 'bg-blue-100 text-blue-700',
    'Intermediate': 'bg-yellow-100 text-yellow-700',
    'Advanced': 'bg-orange-100 text-orange-700',
    'Expert': 'bg-red-100 text-red-700'
  };

  return (
    <div className="grid gap-4">
      {modules.map((m) => (
        <div 
          key={m.id} 
          className={`border rounded-lg p-4 transition-colors shadow-sm ${
            completed.includes(m.id) 
              ? 'bg-green-50 border-green-300' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-bold text-lg text-gray-900">Module {m.id}: {m.title}</h3>
                <span className={`text-xs px-2 py-1 rounded font-medium ${levelColors[m.level]}`}>
                  {m.level}
                </span>
                <span className="text-xs text-gray-500">⏱ {m.duration}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{m.description}</p>
            </div>
            <button
              onClick={() => toggleComplete(m.id)}
              className={`ml-4 px-3 py-1 rounded text-sm font-medium ${
                completed.includes(m.id) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {completed.includes(m.id) ? '✓ Completed' : 'Mark Complete'}
            </button>
          </div>
          
          <button 
            onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {selectedId === m.id ? '▼ Hide Details' : '▶ Show Details'}
          </button>
          
          {selectedId === m.id && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-900">Learning Objectives:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {m.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Progress:</strong> {completed.length} of {modules.length} modules completed 
          ({Math.round((completed.length / modules.length) * 100)}%)
        </p>
        <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(completed.length / modules.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export const educationModules: Module[] = [
  { id: 1, title: 'Introduction to HBS', duration: '2 hours', level: 'Beginner', description: 'An introduction to the Humanitarian Budget Support framework, its origins, purpose, and core principles.', objectives: ['Understand the context and need for HBS', 'Identify the 8 core principles', 'Recognize key stakeholders and their roles'] },
  { id: 2, title: 'Governance Fundamentals', duration: '3 hours', level: 'Beginner', description: 'Understanding governance structures, accountability mechanisms, and decision-making processes.', objectives: ['Describe HBS governance architecture', 'Explain accountability mechanisms', 'Apply transparency standards'] },
  { id: 3, title: 'Financial Management', duration: '4 hours', level: 'Intermediate', description: 'Comprehensive training on budget support financial management, controls, and reporting.', objectives: ['Implement financial controls', 'Manage budget allocation processes', 'Prepare compliant financial reports'] },
  { id: 4, title: 'Monitoring & Evaluation', duration: '4 hours', level: 'Intermediate', description: 'Designing and implementing effective M&E systems for HBS programs.', objectives: ['Design M&E frameworks', 'Select appropriate indicators', 'Conduct data collection and analysis'] },
  { id: 5, title: 'Risk Management', duration: '3 hours', level: 'Intermediate', description: 'Identifying, assessing, and mitigating risks in HBS implementation.', objectives: ['Conduct risk assessments', 'Develop mitigation strategies', 'Implement risk monitoring systems'] },
  { id: 6, title: 'Stakeholder Engagement', duration: '3 hours', level: 'Intermediate', description: 'Building effective relationships and communication with all HBS stakeholders.', objectives: ['Map stakeholder interests and influence', 'Design engagement strategies', 'Facilitate participatory processes'] },
  { id: 7, title: 'Community Participation', duration: '4 hours', level: 'Advanced', description: 'Ensuring meaningful community participation in HBS design, implementation, and oversight.', objectives: ['Apply participatory methodologies', 'Facilitate community decision-making', 'Address power dynamics and inclusion'] },
  { id: 8, title: 'Ethical Decision-Making', duration: '3 hours', level: 'Advanced', description: 'Navigating ethical challenges and dilemmas in humanitarian budget support.', objectives: ['Apply ethical frameworks', 'Analyze complex scenarios', 'Make principled decisions under pressure'] },
  { id: 9, title: 'Capacity Building', duration: '4 hours', level: 'Advanced', description: 'Designing and implementing sustainable capacity building initiatives.', objectives: ['Assess capacity needs', 'Design capacity building programs', 'Measure capacity development outcomes'] },
  { id: 10, title: 'Systems Strengthening', duration: '5 hours', level: 'Advanced', description: 'Supporting national systems and sustainable development through HBS.', objectives: ['Analyze existing systems', 'Design strengthening interventions', 'Balance short-term needs with long-term goals'] },
  { id: 11, title: 'Crisis Response Adaptation', duration: '4 hours', level: 'Expert', description: 'Adapting HBS frameworks for rapid crisis response while maintaining principles.', objectives: ['Apply HBS in emergency contexts', 'Balance speed with accountability', 'Transition from emergency to development'] },
  { id: 12, title: 'Leadership & Innovation', duration: '5 hours', level: 'Expert', description: 'Leading HBS initiatives and driving continuous improvement and innovation.', objectives: ['Lead organizational change', 'Foster innovation culture', 'Advance the HBS field'] }
];