'use client';

interface RiskSignalProps {
  level: string;
  confidence: number;
  status: string;
}

export default function RiskSignal({ level, confidence, status }: RiskSignalProps) {
  const levelConfig: Record<string, { color: string; bg: string; pulse: boolean }> = {
    critical: { color: 'text-red-400', bg: 'bg-red-500', pulse: true },
    high: { color: 'text-orange-400', bg: 'bg-orange-500', pulse: true },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500', pulse: false },
    low: { color: 'text-green-400', bg: 'bg-green-500', pulse: false }
  };

  const config = levelConfig[level] || levelConfig.medium;

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusMessage = (s: string) => {
    switch (s) {
      case 'proceed': return 'CLEAR TO PROCEED';
      case 'proceed_with_caution': return 'PROCEED WITH CAUTION';
      case 'review_required': return 'REVIEW REQUIRED';
      case 'halt': return 'DO NOT PROCEED';
      case 'document': return 'DOCUMENT DECISION';
      default: return 'UNKNOWN STATUS';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        {/* Risk Level Indicator */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full ${config.bg} opacity-20`}></div>
            <div className={`absolute inset-0 flex items-center justify-center`}>
              <div className={`w-10 h-10 rounded-full ${config.bg} ${config.pulse ? 'animate-pulse' : ''}`}></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase">Risk Level</div>
            <div className={`text-2xl font-bold uppercase ${config.color}`}>{level}</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase">Status</div>
          <div className={`text-lg font-bold ${
            status === 'proceed' ? 'text-green-400' :
            status === 'halt' ? 'text-red-400' :
            'text-yellow-400'
          }`}>
            {getStatusMessage(status)}
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase">Confidence</div>
          <div className={`text-3xl font-bold ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </div>
          <div className="w-32 bg-gray-700 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                confidence >= 80 ? 'bg-green-500' :
                confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Signal Bar */}
      <div className="mt-6 flex gap-1">
        {[...Array(10)].map((_, i) => {
          const threshold = (i + 1) * 10;
          const isActive = confidence >= threshold;
          return (
            <div
              key={i}
              className={`flex-1 h-2 rounded ${
                isActive
                  ? threshold <= 30 ? 'bg-red-500' :
                    threshold <= 60 ? 'bg-yellow-500' : 'bg-green-500'
                  : 'bg-gray-700'
              }`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}