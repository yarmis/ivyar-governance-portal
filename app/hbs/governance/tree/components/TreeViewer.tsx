'use client';

interface TreeNode {
  id: string;
  title: string;
  description: string;
  level: string;
  riskLevel: string;
  conditions: string[];
  actions: { id: string; label: string; nextNode: string | null }[];
  boundaries: string[];
  approvalRequired: string;
}

interface TreeViewerProps {
  nodes: TreeNode[];
  onSelectNode: (node: TreeNode) => void;
  selectedNodeId?: string;
}

export default function TreeViewer({ nodes, onSelectNode, selectedNodeId }: TreeViewerProps) {
  const levelColors: Record<string, string> = {
    strategic: 'border-purple-500 bg-purple-900/30',
    operational: 'border-blue-500 bg-blue-900/30',
    emergency: 'border-red-500 bg-red-900/30',
    compliance: 'border-amber-500 bg-amber-900/30'
  };

  const riskIndicators: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const groupedNodes = {
    strategic: nodes.filter(n => n.level === 'strategic'),
    operational: nodes.filter(n => n.level === 'operational'),
    emergency: nodes.filter(n => n.level === 'emergency'),
    compliance: nodes.filter(n => n.level === 'compliance')
  };

  const renderNode = (node: TreeNode) => {
    const isSelected = selectedNodeId === node.id;
    
    return (
      <div
        key={node.id}
        onClick={() => onSelectNode(node)}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${levelColors[node.level]} ${isSelected ? 'ring-2 ring-white' : 'hover:opacity-80'}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{node.id}</span>
              <span className={`w-2 h-2 rounded-full ${riskIndicators[node.riskLevel]}`}></span>
            </div>
            <h3 className="font-bold text-white">{node.title}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{node.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            {node.boundaries.slice(0, 3).map(b => (
              <span key={b} className="px-1.5 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{b}</span>
            ))}
          </div>
          <span className="text-xs text-gray-500">{node.actions.length} actions</span>
        </div>
      </div>
    );
  };

  const renderGroup = (title: string, color: string, groupNodes: TreeNode[]) => {
    if (groupNodes.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color }}>
          <span className="w-3 h-3 rounded" style={{ backgroundColor: color }}></span>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groupNodes.map(renderNode)}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderGroup('Strategic Decisions', '#a855f7', groupedNodes.strategic)}
      {renderGroup('Operational Decisions', '#3b82f6', groupedNodes.operational)}
      {renderGroup('Emergency Decisions', '#ef4444', groupedNodes.emergency)}
      {renderGroup('Compliance Decisions', '#f59e0b', groupedNodes.compliance)}
    </div>
  );
}
