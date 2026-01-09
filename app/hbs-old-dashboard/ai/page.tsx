'use client';

import { useState, useEffect, useRef } from 'react';

export default function AIOperationsPage() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState('governance');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadData = async (action: string, extra?: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/hbs/ai-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra })
      });
      const result = await res.json();
      setData((prev: any) => ({ ...prev, [action]: result }));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    loadData('assistant', { module: selectedModule });
    loadData('autopilot');
    loadData('recommendations');
  }, []);

  useEffect(() => {
    loadData('assistant', { module: selectedModule });
  }, [selectedModule]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput, timestamp: new Date().toISOString() };
    setChatMessages((prev: any[]) => [...prev, userMsg]);
    setChatInput('');
    
    const res = await fetch('/api/hbs/ai-ops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'chat', message: chatInput, module: selectedModule })
    });
    const result = await res.json();
    setChatMessages((prev: any[]) => [...prev, { role: 'assistant', content: result.response, suggestions: result.suggestions, timestamp: result.timestamp }]);
  };

  const analyzeTransaction = async () => {
    await loadData('analyze-transaction', { amount: 125000, beneficiary: 'Caritas Ukraine', program: 'IDP Support' });
    await loadData('reasoning', { transactionId: 'TXN-2026-DEMO' });
  };

  const tabs = [
    { id: 'assistant', name: '🤖 AI Assistant', icon: '🤖' },
    { id: 'reasoning', name: '🧠 AI Reasoning', icon: '🧠' },
    { id: 'autopilot', name: '🚀 Autopilot', icon: '🚀' },
    { id: 'chat', name: '💬 AI Chat', icon: '💬' }
  ];

  const modules = [
    { id: 'governance', name: 'Governance', icon: '🏛️' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'compliance', name: 'Compliance', icon: '✅' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'operations', name: 'Operations', icon: '⚙️' }
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl p-8 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-6xl">🤖</span>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-pulse border-2 border-gray-900"></span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Operational AI</h1>
                <p className="text-purple-200">v4.2 — Intelligent Automation & Decision Support</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <StatBadge label="Accuracy" value="97.8%" color="green" />
              <StatBadge label="Decisions" value="12.4K" color="blue" />
              <StatBadge label="Time Saved" value="127h" color="purple" />
              <StatBadge label="Auto Rate" value="73%" color="cyan" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={'px-5 py-3 rounded-lg font-medium transition-all ' + (activeTab === t.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              {t.name}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-10 text-gray-400">Loading AI Systems...</div>}

        {/* AI Assistant Tab */}
        {!loading && activeTab === 'assistant' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Module Selector */}
            <div className="col-span-1 space-y-4">
              <div className="bg-gray-800 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4">Select AI Module</h3>
                <div className="space-y-2">
                  {modules.map(m => (
                    <button key={m.id} onClick={() => setSelectedModule(m.id)} className={'w-full p-4 rounded-lg text-left transition-all flex items-center gap-3 ' + (selectedModule === m.id ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}>
                      <span className="text-2xl">{m.icon}</span>
                      <span className="font-medium">{m.name} AI</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gray-800 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4">🎯 Top Recommendations</h3>
                <div className="space-y-2">
                  {data.recommendations?.recommendations?.slice(0, 3).map((r: any) => (
                    <div key={r.id} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={'w-2 h-2 rounded-full ' + (r.priority === 'high' ? 'bg-red-500' : r.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500')}></span>
                        <p className="text-white text-sm font-medium">{r.title}</p>
                      </div>
                      <p className="text-gray-400 text-xs">{r.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assistant Details */}
            <div className="col-span-2 space-y-4">
              {data.assistant?.assistant && (
                <>
                  <div className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-5xl">{data.assistant.assistant.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{data.assistant.assistant.name}</h2>
                        <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">{data.assistant.assistant.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-white">{data.assistant.assistant.stats?.decisionsAssisted?.toLocaleString() || data.assistant.assistant.stats?.transactionsAnalyzed?.toLocaleString() || data.assistant.assistant.stats?.checksPerformed?.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">Processed</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-400">{data.assistant.assistant.stats?.accuracy}%</p>
                        <p className="text-gray-400 text-sm">Accuracy</p>
                      </div>
                      <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-blue-400">{data.assistant.assistant.stats?.avgResponseTime || '< 2s'}</p>
                        <p className="text-gray-400 text-sm">Response Time</p>
                      </div>
                    </div>

                    <h4 className="text-white font-bold mb-3">Capabilities</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {data.assistant.assistant.capabilities?.map((c: string, i: number) => (
                        <span key={i} className="px-3 py-2 bg-purple-900/50 text-purple-300 rounded-lg text-sm">{c}</span>
                      ))}
                    </div>

                    <h4 className="text-white font-bold mb-3">Recent Actions</h4>
                    <div className="space-y-2">
                      {data.assistant.assistant.recentActions?.map((a: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div>
                            <p className="text-white text-sm">{a.action}</p>
                            <p className="text-gray-500 text-xs">{a.time}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">{a.confidence}% confidence</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* AI Reasoning Tab */}
        {!loading && activeTab === 'reasoning' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">🧠 Transaction Reasoning Engine</h2>
                <button onClick={analyzeTransaction} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Analyze Sample Transaction
                </button>
              </div>

              {data.reasoning && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-6 rounded-xl border border-green-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-green-300 text-sm">Decision</p>
                        <p className="text-3xl font-bold text-white">{data.reasoning.reasoning?.decision}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Confidence</p>
                        <p className="text-4xl font-bold text-green-400">{data.reasoning.reasoning?.confidence}%</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4">{data.reasoning.reasoning?.summary}</p>
                  </div>

                  {/* Factor Analysis */}
                  <div>
                    <h3 className="text-white font-bold mb-4">Factor Analysis</h3>
                    <div className="space-y-3">
                      {data.reasoning.factors?.map((f: any, i: number) => (
                        <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{f.factor}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">Weight: {f.weight}%</span>
                              <span className={'px-2 py-1 rounded text-sm ' + (f.score >= 90 ? 'bg-green-900 text-green-300' : f.score >= 70 ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300')}>{f.score}/100</span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm">{f.reasoning}</p>
                          <div className="mt-2 h-2 bg-gray-600 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${f.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Trail */}
                  <div>
                    <h3 className="text-white font-bold mb-4">Processing Audit Trail</h3>
                    <div className="relative">
                      {data.reasoning.auditTrail?.map((a: any, i: number) => (
                        <div key={i} className="flex gap-4 pb-4">
                          <div className="flex flex-col items-center">
                            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                            {i < data.reasoning.auditTrail.length - 1 && <div className="w-0.5 h-full bg-purple-500/30"></div>}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-white font-medium">{a.step}</p>
                            <p className="text-gray-400 text-sm">{a.detail}</p>
                            <p className="text-gray-500 text-xs">{new Date(a.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!data.reasoning && (
                <div className="text-center py-12 text-gray-400">
                  <span className="text-6xl mb-4 block">🧠</span>
                  <p>Click "Analyze Sample Transaction" to see AI reasoning in action</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Autopilot Tab */}
        {!loading && activeTab === 'autopilot' && data.autopilot && (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-6 border border-cyan-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🚀</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Autopilot</h2>
                    <p className="text-cyan-300">Intelligent Automation System</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-green-400 font-bold text-xl">{data.autopilot.status?.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Mode</p>
                    <p className="text-cyan-400 font-bold text-xl">{data.autopilot.mode?.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today Stats */}
            <div className="grid grid-cols-6 gap-4">
              <StatCard icon="📊" label="Total Processed" value={data.autopilot.todayStats?.totalProcessed?.toLocaleString()} />
              <StatCard icon="✅" label="Auto-Approved" value={data.autopilot.todayStats?.autoApproved?.toLocaleString()} color="green" />
              <StatCard icon="⬆️" label="Auto-Escalated" value={data.autopilot.todayStats?.autoEscalated} color="yellow" />
              <StatCard icon="👤" label="Manual Override" value={data.autopilot.todayStats?.manualOverride} color="blue" />
              <StatCard icon="⏱️" label="Time Saved" value={data.autopilot.todayStats?.timeSaved} color="purple" />
              <StatCard icon="💰" label="Cost Saved" value={`$${(data.autopilot.todayStats?.costSaved / 1000).toFixed(0)}K`} color="green" />
            </div>

            {/* Autopilot Modules */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Autopilot Modules</h3>
              <div className="grid grid-cols-3 gap-4">
                {data.autopilot.modules?.map((m: any) => (
                  <div key={m.name} className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-bold">{m.name}</span>
                      <span className={'px-2 py-1 rounded text-xs ' + (m.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-600 text-gray-300')}>{m.status}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processed</span>
                        <span className="text-white">{m.processed?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy</span>
                        <span className="text-green-400">{m.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Action</span>
                        <span className="text-gray-300">{m.lastAction}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-3 p-2 bg-gray-800 rounded">{m.threshold}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Safeguards */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🛡️ Safety Safeguards</h3>
              <div className="grid grid-cols-5 gap-4">
                {data.autopilot.safeguards?.map((s: any) => (
                  <div key={s.name} className="bg-gray-700/50 p-4 rounded-lg text-center">
                    <span className="text-2xl mb-2 block">{s.status === 'enabled' ? '✅' : '❌'}</span>
                    <p className="text-white font-medium text-sm">{s.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {!loading && activeTab === 'chat' && (
          <div className="grid grid-cols-4 gap-6">
            {/* Module Selector */}
            <div className="col-span-1">
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3">Chat with AI</h3>
                <div className="space-y-2">
                  {modules.map(m => (
                    <button key={m.id} onClick={() => setSelectedModule(m.id)} className={'w-full p-3 rounded-lg text-left transition-all flex items-center gap-2 ' + (selectedModule === m.id ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}>
                      <span>{m.icon}</span>
                      <span className="text-sm">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-3">
              <div className="bg-gray-800 rounded-xl flex flex-col h-[600px]">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{modules.find(m => m.id === selectedModule)?.icon}</span>
                    <span className="text-white font-bold">{modules.find(m => m.id === selectedModule)?.name} AI Assistant</span>
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">Online</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <span className="text-5xl mb-4 block">💬</span>
                      <p>Start a conversation with {modules.find(m => m.id === selectedModule)?.name} AI</p>
                      <p className="text-sm mt-2">Try asking about budgets, compliance, or recommendations</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                      <div className={'max-w-[70%] p-4 rounded-xl ' + (msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-100')}>
                        <p>{msg.content}</p>
                        {msg.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.suggestions.map((s: string, j: number) => (
                              <button key={j} onClick={() => setChatInput(s)} className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs">{s}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendChat()} placeholder="Ask the AI assistant..." className="flex-1 px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <button onClick={sendChat} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = { green: 'bg-green-900/50 text-green-300', blue: 'bg-blue-900/50 text-blue-300', purple: 'bg-purple-900/50 text-purple-300', cyan: 'bg-cyan-900/50 text-cyan-300' };
  return (
    <div className={`px-4 py-2 rounded-lg ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: any; color?: string }) {
  const colors: Record<string, string> = { green: 'text-green-400', yellow: 'text-yellow-400', blue: 'text-blue-400', purple: 'text-purple-400', default: 'text-white' };
  return (
    <div className="bg-gray-800 rounded-xl p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className={`text-2xl font-bold mt-2 ${colors[color || 'default']}`}>{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}
