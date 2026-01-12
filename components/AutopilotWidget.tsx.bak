/**
 * IVYAR Autopilot Widget
 * Universal AI assistant component that adapts to each module
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IvyarModule, getModuleScenario, getModuleByPath } from '@/lib/autopilot/ivyar-autopilot-scenarios';

// ============================================================================
// TYPES
// ============================================================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AutopilotWidgetProps {
  module?: IvyarModule;
  apiUrl?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'sidebar';
  theme?: 'light' | 'dark';
}

// ============================================================================
// AUTOPILOT WIDGET COMPONENT
// ============================================================================

export default function AutopilotWidget({
  module,
  apiUrl = 'http://localhost:3001/autopilot',
  className = '',
  position = 'bottom-right',
  theme = 'light',
}: AutopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentModule, setCurrentModule] = useState<IvyarModule>(module || 'general');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-detect module from URL if not provided
  useEffect(() => {
    if (!module && typeof window !== 'undefined') {
      const detectedModule = getModuleByPath(window.location.pathname);
      setCurrentModule(detectedModule);
    }
  }, [module]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  // Get current scenario
  const scenario = getModuleScenario(currentModule);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `👋 Hi! I'm your ${scenario.name}. ${scenario.description}

Here are some things I can help you with:
${scenario.capabilities.map((c, i) => `${i + 1}. ${c}`).join('\n')}

What would you like to know?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, scenario]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setCurrentResponse('');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${apiUrl}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  scenario: 'general_inquiry',  // ← Використати існуючий сценарій
  userMessage: userMessage.content,
  conversationHistory: messages,
}),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullResponse += parsed.text;
                setCurrentResponse(fullResponse);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add complete response to messages
      if (fullResponse) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setCurrentResponse('');
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    if (currentResponse) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: currentResponse + ' [Cancelled]',
          timestamp: new Date(),
        },
      ]);
      setCurrentResponse('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'sidebar': 'relative h-full',
  };

  // Theme classes
  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      button: 'bg-blue-600 hover:bg-blue-700',
      userMsg: 'bg-blue-600 text-white',
      assistantMsg: 'bg-gray-100 text-gray-900',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      border: 'border-gray-700',
      button: 'bg-blue-500 hover:bg-blue-600',
      userMsg: 'bg-blue-500 text-white',
      assistantMsg: 'bg-gray-800 text-gray-100',
    },
  };

  const colors = themeClasses[theme];

  return (
    <div className={`${positionClasses[position]} ${className} z-50`}>
      {!isOpen ? (
        // Floating button
        <button
          onClick={() => setIsOpen(true)}
          className={`${colors.button} text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 flex items-center gap-2`}
          aria-label="Open AI Assistant"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="hidden md:inline">Ask AI</span>
        </button>
      ) : (
        // Chat window
        <div
          className={`${colors.bg} ${colors.border} border rounded-lg shadow-2xl flex flex-col ${
            position === 'sidebar' ? 'h-full' : 'w-96 h-[600px]'
          }`}
        >
          {/* Header */}
          <div className={`${colors.button} text-white p-4 rounded-t-lg flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div>
                <h3 className="font-semibold">{scenario.name}</h3>
                <p className="text-xs opacity-90">{currentModule}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? colors.userMsg
                      : colors.assistantMsg
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Current streaming response */}
            {currentResponse && (
              <div className="flex justify-start">
                <div className={`max-w-[85%] rounded-lg p-3 ${colors.assistantMsg}`}>
                  <div className="whitespace-pre-wrap">{currentResponse}</div>
                  <span className="inline-block w-2 h-4 ml-1 bg-gray-600 animate-pulse" />
                </div>
              </div>
            )}

            {/* Suggested questions (only when no messages yet) */}
            {messages.length === 1 && !isStreaming && (
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-70">Try asking:</p>
                {scenario.suggestedQuestions.slice(0, 3).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className={`w-full text-left text-sm p-2 rounded ${colors.assistantMsg} hover:opacity-80 transition`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`border-t ${colors.border} p-4`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isStreaming}
                className={`flex-1 px-4 py-2 border ${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${colors.bg} ${colors.text}`}
              />
              {isStreaming ? (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`px-4 py-2 ${colors.button} text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition`}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
