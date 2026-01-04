'use client';

import { useState } from 'react';
import GovernanceWidget from '@/components/hbs/integration/GovernanceWidget';

export default function IntegrationDemoPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const demoActions = [
    { module: 'admin', action: 'user_delete', label: 'Delete User', context: { type: 'permanent' } },
    { module: 'employer', action: 'payment_approve', label: 'Approve Payment $150K', context: { amount: 150000 } },
    { module: 'pilot', action: 'emergency_action', label: 'Emergency Action', context: { urgency: 'emergency' } },
    { module: 'pilot', action: 'partner_add', label: 'Add Partner', context: { type: 'ngo' } },
    { module: 'donor', action: 'fund_reallocation', label: 'Reallocate Funds', context: { amount: 50000 } },
    { module: 'client', action: 'data_export', label: 'Export Data', context: { type: 'full' } },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-violet-800 to-fuchsia-800 p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">HBS Integration Demo</h1>
        <p className="text-violet-200 mt-1">Test governance checks across IVYAR modules</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Test Actions</h2>
            <p className="text-gray-400 text-sm mb-6">Click any action to trigger a governance check</p>

            <div className="space-y-3">
              {demoActions.map((demo, i) => (
                <GovernanceWidget
                  key={i}
                  module={demo.module}
                  action={demo.action}
                  context={demo.context}
                  onApproved={() => addLog(`✓ APPROVED: ${demo.label}`)}
                  onBlocked={(reason) => addLog(`✕ BLOCKED: ${demo.label} - ${reason}`)}
                >
                  <button className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{demo.label}</p>
                        <p className="text-sm text-gray-400">{demo.module}/{demo.action}</p>
                      </div>
                      <span className="text-gray-500">→</span>
                    </div>
                  </button>
                </GovernanceWidget>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Activity Log</h2>
              <button onClick={() => setLogs([])} className="text-sm text-gray-400 hover:text-white">Clear</button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-500">No activity yet. Click an action to begin.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`mb-2 ${log.includes('APPROVED') ? 'text-green-400' : log.includes('BLOCKED') ? 'text-red-400' : 'text-gray-400'}`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Integration Code Example</h2>
          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-green-400">
{`import GovernanceWidget from '@/components/hbs/integration/GovernanceWidget';

<GovernanceWidget
  module="employer"
  action="payment_approve"
  context={{ amount: 150000 }}
  onApproved={() => processPayment()}
  onBlocked={(reason) => showError(reason)}
>
  <button>Approve Payment</button>
</GovernanceWidget>`}
          </pre>
        </div>
      </div>
    </div>
  );
}