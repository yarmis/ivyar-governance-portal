'use client';

import { useState } from 'react';
import ReasoningPanel from './components/ReasoningPanel';
import RiskSignal from './components/RiskSignal';
import treeData from '../governance/tree/data/tree.json';

export default function ReasoningPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [checkedConditions, setCheckedConditions] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleNodeSelect = (nodeId: string) => {
    const node = treeData.nodes.find(n => n.id === nodeId);
    setSelectedNode(node);
    setSelectedAction(null);
    setCheckedConditions([]);
    setReasoning(null);
  };

  const toggleCondition = (condition: string) => {
    setCheckedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const analyzeDecision = async () => {
    if (!selectedNode || !selectedAction) return;
    setLoading(true);
    try {
      const response = await fetch('/api/hbs/reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId: selectedNode.id,
          action: selectedAction,
          conditionsMet: checkedConditions
        })
      });
      const data = await response.json();
      if (data.success) {
        setReasoning(data.reasoning);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Live Reasoning Engine</h1>
        <p className="text-emerald-200 mt-1">Real-time decision analysis and risk assessment</p>
      </div>

      <div className="flex">
        <div className="w-1/3 border-r border-gray-700 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">1. Select Decision Node</h2>
            <select
              value={selectedNode?.id || ''}
              onChange={(e) => handleNodeSelect(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white"
            >
              <option value="">-- Select a decision --</option>
              {treeData.nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}: {node.title}</option>
              ))}
            </select>
          </div>

          {selectedNode && (
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">2. Verify Conditions</h2>
              <div className="space-y-2 bg-gray-800 rounded p-4">
                {selectedNode.conditions.map((condition: string, i: number) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedConditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="mt-1 w-4 h-4"
                    />
                    <span className={`text-sm ${checkedConditions.includes(condition) ? 'text-emerald-400' : 'text-gray-300'}`}>
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {checkedConditions.length}/{selectedNode.conditions.length} verified
              </div>
            </div>
          )}

          {selectedNode && (
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase mb-3">3. Select Action</h2>
              <div className="flex flex-wrap gap-2">
                {selectedNode.actions.map((action: any) => (
                  <button
                    key={action.id}
                    onClick={() => setSelectedAction(action.id)}
                    className={`px-4 py-2 rounded font-medium ${selectedAction === action.id ? 'bg-emerald-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedNode && selectedAction && (
            <button
              onClick={analyzeDecision}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 rounded font-bold"
            >
              {loading ? 'Analyzing...' : 'Analyze Decision'}
            </button>
          )}
        </div>

        <div className="flex-1 p-6">
          {reasoning ? (
            <div className="space-y-6">
              <RiskSignal level={reasoning.risk.level} confidence={reasoning.recommendation.confidence} status={reasoning.recommendation.status} />
              <ReasoningPanel reasoning={reasoning} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p>Select a decision node and action to begin analysis</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}