'use client';

import { useState } from 'react';
import TreeViewer from './components/TreeViewer';
import treeData from './data/tree.json';

export default function GovernanceTreePage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const levelColors: Record<string, string> = {
    strategic: 'bg-purple-600',
    operational: 'bg-blue-600',
    emergency: 'bg-red-600',
    compliance: 'bg-amber-600'
  };

  const riskColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Governance Decision Tree</h1>
        <p className="text-indigo-200 mt-1">Interactive decision framework v{treeData.version}</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Total Nodes:</span>
            <span className="font-bold text-white">{treeData.nodes.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${levelColors.strategic}`}></span>
            <span className="text-gray-300">Strategic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${levelColors.operational}`}></span>
            <span className="text-gray-300">Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${levelColors.emergency}`}></span>
            <span className="text-gray-300">Emergency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${levelColors.compliance}`}></span>
            <span className="text-gray-300">Compliance</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Tree View */}
        <div className="flex-1 p-6">
          <TreeViewer 
            nodes={treeData.nodes} 
            onSelectNode={setSelectedNode}
            selectedNodeId={selectedNode?.id}
          />
        </div>

        {/* Detail Panel */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 p-6">
          {selectedNode ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${levelColors[selectedNode.level]}`}>
                    {selectedNode.level.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${riskColors[selectedNode.riskLevel]}`}>
                    {selectedNode.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <h2 className="text-xl font-bold">{selectedNode.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedNode.id}</p>
              </div>

              <div>
                <p className="text-gray-300">{selectedNode.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Conditions</h3>
                <ul className="space-y-2">
                  {selectedNode.conditions.map((condition: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-400 mt-0.5">○</span>
                      <span className="text-gray-300">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.actions.map((action: any) => (
                    <button
                      key={action.id}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Boundaries</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.boundaries.map((b: string) => (
                    <span key={b} className="px-2 py-1 bg-red-900/50 border border-red-700 rounded text-xs text-red-300">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="font-bold">Approval:</span> {selectedNode.approvalRequired}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>Select a node to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}