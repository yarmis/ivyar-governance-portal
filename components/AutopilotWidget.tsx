'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, MessageCircle, Send, Loader2, Sparkles } from 'lucide-react';
import { getModuleScenario, type IvyarModule } from '@/lib/autopilot/ivyar-autopilot-scenarios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AutopilotWidgetProps {
  module?: IvyarModule;
  position?: 'bottom-right' | 'bottom-left' | 'sidebar';
  className?: string;
}

export default function AutopilotWidget({
  module,
  position = 'bottom-right',
  className = '',
}: AutopilotWidgetProps) {
  const pathname = usePathname();
  
  // Auto-detect module from URL path
  const detectModuleFromPath = (): IvyarModule => {
    if (!pathname) return 'general';
    
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'general';
    
    const pathModule = pathSegments[0];
    
    // Map URL paths to module names
    const moduleMap: Record<string, IvyarModule> = {
      'materials': 'materials',
      'zoning': 'zoning',
      'violations': 'violations',
      'donors': 'donors',
      'us-construction': 'us_construction',
      'geo': 'geo_utilities',
      'procurement': 'procurement',
      'aviation-tickets': 'aviation_tickets',
      'uscis-intelligence': 'uscis_family',
      'uscis-family': 'uscis_family',
      'uscis-n400': 'uscis_n400',
      'uscis-employment': 'uscis_employment',
      'uscis-nonimmigrant': 'uscis_nonimmigrant',
      'uscis-humanitarian': 'uscis_humanitarian',
    };
    
    return moduleMap[pathModule] || 'general';
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [currentModule, setCurrentModule] = useState<IvyarModule>(
    module || detectModuleFromPath()
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Update module if prop changes or pathname changes
  useEffect(() => {
    if (module) {
      setCurrentModule(module);
    } else {
      setCurrentModule(detectModuleFromPath());
    }
  }, [module, pathname]);

  const scenario = getModuleScenario(currentModule);
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi! I'm your ${scenario.name}. ${scenario.description}\n\nHow can I help you today?`,
          timestamp: new Date(),
        },
      ]);
      inputRef.current?.focus();
    }
  }, [isOpen, scenario, messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiMessageId = Date.now().toString();
    const aiMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await fetch('https://ivyar-autopilot-v8.ivyar-gov.workers.dev/autopilot/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: inputValue,
          module: currentModule,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const eventMessages = buffer.split('\n\n');
        buffer = eventMessages.pop() || '';

        for (const message of eventMessages) {
          if (!message.trim()) continue;

          const lines = message.split('\n');
          let eventType = '';
          let data = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.substring(7).trim();
            } else if (line.startsWith('data: ')) {
              data = line.substring(6).trim();
            }
          }

          if (eventType === 'text' && data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((msg, idx) =>
                    idx === prev.length - 1
                      ? { ...msg, content: msg.content + parsed.text }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Failed to parse text event:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calling autopilot:', error);
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1
            ? {
                ...msg,
                content: 'Sorry, I encountered an error. Please try again.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'sidebar': 'top-0 right-0 h-screen',
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-gray-50';

  if (position === 'sidebar') {
    return (
      <div className={`${bgColor} ${textColor} ${borderColor} border-l flex flex-col h-full ${className}`}>
        {/* Header */}
        <div className={`p-4 ${borderColor} border-b flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-semibold">{scenario.name}</h3>
              <p className="text-xs opacity-70">{scenario.description}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-800 text-gray-100'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && !isLoading && (
          <div className={`p-4 ${borderColor} border-t space-y-2`}>
            <p className="text-xs font-medium opacity-70">Suggested questions:</p>
            {scenario.suggestedQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(q);
                  inputRef.current?.focus();
                }}
                className={`text-xs ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                } rounded px-2 py-1 w-full text-left transition-colors`}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={`p-4 ${borderColor} border-t`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className={`flex-1 px-4 py-2 ${inputBg} ${borderColor} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`${bgColor} ${textColor} rounded-lg shadow-2xl w-96 h-[600px] flex flex-col ${borderColor} border`}
        >
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">{scenario.name}</h3>
                <p className="text-xs opacity-70">{scenario.description}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded p-1 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'bg-gray-800 text-gray-100'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg px-4 py-2 flex items-center gap-2`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm opacity-70">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && !isLoading && (
            <div className={`p-4 ${borderColor} border-t space-y-2`}>
              <p className="text-xs font-medium opacity-70">Suggested questions:</p>
              {scenario.suggestedQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(q);
                    inputRef.current?.focus();
                  }}
                  className={`text-xs ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  } rounded px-2 py-1 w-full text-left transition-colors`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className={`p-4 ${borderColor} border-t`}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className={`flex-1 px-4 py-2 ${inputBg} ${borderColor} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
