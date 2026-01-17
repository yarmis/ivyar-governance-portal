'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  module: string;
  placeholder?: string;
}

export default function AIAssistant({ module, placeholder }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: `This is a demo response for the ${module} module. In production, this would connect to Claude API to provide intelligent assistance based on your question: "${input}"`
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* AI Assistant Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00A3FF] to-[#0066CC] text-2xl shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Open AI Assistant"
      >
        🤖
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col rounded-xl border border-[#30363D] bg-[#0D1117] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#30363D] bg-gradient-to-r from-[#00A3FF]/10 to-[#0066CC]/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="text-xl">🤖</div>
              <div>
                <div className="font-semibold text-[#E6EDF3]">AI Assistant</div>
                <div className="text-xs text-[#8B949E]">{module} Module</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8B949E] transition-colors hover:text-[#E6EDF3]"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-2 text-4xl">💬</div>
                <div className="text-sm text-[#8B949E]">
                  Ask me anything about the {module} module
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-[#00A3FF]/20 text-[#E6EDF3]'
                          : 'bg-[#161B22] text-[#8B949E]'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-[#161B22] px-4 py-2 text-[#8B949E]">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-[#00A3FF]" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-[#00A3FF]" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-[#00A3FF]" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#30363D] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={placeholder || "Ask a question..."}
                className="flex-1 rounded-lg border border-[#30363D] bg-[#161B22] px-3 py-2 text-sm text-[#E6EDF3] placeholder-[#6E7681] focus:border-[#00A3FF] focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="rounded-lg bg-[#00A3FF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0066CC] disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
