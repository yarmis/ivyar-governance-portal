'use client';

interface ReasoningPanelProps {
  reasoning: {
    decision: { nodeId: string; title: string; selectedAction: string; nextNode: string | null };
    analysis: { conditionsScore: number; conditionsMet: number; conditionsTotal: number; conditions: { condition: string; met: boolean }[] };
    boundaries: { total: number; critical: number; high: number; list: { id: string; rule: string; severity: string }[] };
    risk: { level: string; factors: string[]; mitigations: string[] };
    approval: { required: string; level: string };
    recommendation: { status: string; message: string; confidence: number };
    timestamp: string;
  };
}

export default function ReasoningPanel({ reasoning }: ReasoningPanelProps) {
  const statusColors: Record<string, string> = {
    proceed: 'bg-green-900/50 border-green-500 text-green-300',
    proceed_with_caution: 'bg-yellow-900/50 border-yellow-500 text-yellow-300',
    review_required: 'bg-orange-900/50 border-orange-500 text-orange-300',
    halt: 'bg-red-900/50 border-red-500 text-red-300',
    document: 'bg-blue-900/50 border-blue-500 text-blue-300'
  };

  const statusIcons: Record<string, string> = {
    proceed: '✓', proceed_with_caution: '⚠', review_required: '⏸', halt: '✕', document: '📝'
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg border-2 ${statusColors[reasoning.recommendation.status]}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{statusIcons[reasoning.recommendation.status]}</span>
          <div>
            <h3 className="font-bold text-lg uppercase">{reasoning.recommendation.status.replace(/_/g, ' ')}</h3>
            <p className="text-sm opacity-80">{reasoning.recommendation.message}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Decision Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Node:</span><span className="ml-2">{reasoning.decision.nodeId}</span></div>
          <div><span className="text-gray-500">Action:</span><span className="ml-2">{reasoning.decision.selectedAction}</span></div>
          <div><span className="text-gray-500">Approval:</span><span className="ml-2">{reasoning.approval.required}</span></div>
          <div><span className="text-gray-500">Level:</span><span className="ml-2 capitalize">{reasoning.approval.level}</span></div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase">Conditions Analysis</h3>
          <span className="text-2xl font-bold">{reasoning.analysis.conditionsScore}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div className={`h-2 rounded-full ${reasoning.analysis.conditionsScore >= 80 ? 'bg-green-500' : reasoning.analysis.conditionsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${reasoning.analysis.conditionsScore}%` }}></div>
        </div>
        <div className="space-y-2">
          {reasoning.analysis.conditions.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className={c.met ? 'text-green-400' : 'text-red-400'}>{c.met ? '✓' : '✕'}</span>
              <span className={c.met ? 'text-gray-300' : 'text-gray-500'}>{c.condition}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Boundaries ({reasoning.boundaries.total})</h3>
        <div className="space-y-2">
          {reasoning.boundaries.list.map(b => (
            <div key={b.id} className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${b.severity === 'critical' ? 'bg-red-500' : b.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`}></span>
              <span className="text-gray-400">{b.id}:</span>
              <span className="text-gray-300">{b.rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-red-400 uppercase mb-3">Risk Factors</h3>
          <ul className="space-y-2">
            {reasoning.risk.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm"><span className="text-red-400">⚠</span><span className="text-gray-300">{f}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-green-400 uppercase mb-3">Mitigations</h3>
          <ul className="space-y-2">
            {reasoning.risk.mitigations.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400">→</span><span className="text-gray-300">{m}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-right text-xs text-gray-500">Generated: {new Date(reasoning.timestamp).toLocaleString()}</div>
    </div>
  );
}