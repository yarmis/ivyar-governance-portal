'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

type FreightAIRole = 'driver' | 'shipper' | 'dispatcher' | 'carrier';
type MessageSender = 'user' | 'assistant';

interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  tags?: string[];
  suggestedActions?: SuggestedAction[];
  rateInfo?: {
    estimatedRate?: number;
    ratePerMile?: number;
    confidence?: number;
  };
}

interface SuggestedAction {
  id: string;
  label: string;
  action: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

// ============================================================================
// CONFIGURATIONS
// ============================================================================

const ROLES: Record<FreightAIRole, { name: string; icon: string; description: string; color: string }> = {
  driver: { name: 'Driver', icon: '🚛', description: 'Loads, HOS, earnings, compliance', color: '#3CCB7F' },
  shipper: { name: 'Shipper', icon: '🏭', description: 'Post loads, track, payments', color: '#00A3FF' },
  dispatcher: { name: 'Dispatcher', icon: '📡', description: 'Fleet coordination, assignments', color: '#F59E0B' },
  carrier: { name: 'Carrier', icon: '🚚', description: 'Fleet management, compliance', color: '#A371F7' },
};

const QUICK_ACTIONS: Record<FreightAIRole, SuggestedAction[]> = {
  driver: [
    { id: 'find-loads', label: 'Find Loads Near Me', action: 'find_loads', icon: '🔍', priority: 'high' },
    { id: 'check-hos', label: 'Check My HOS', action: 'check_hos', icon: '⏱️', priority: 'high' },
    { id: 'rate-calc', label: 'Calculate Rate', action: 'calc_rate', icon: '💰', priority: 'medium' },
    { id: 'upload-pod', label: 'How to Upload POD', action: 'upload_pod', icon: '📸', priority: 'medium' },
  ],
  shipper: [
    { id: 'post-load', label: 'How to Post Load', action: 'post_load', icon: '📦', priority: 'high' },
    { id: 'get-quote', label: 'Get Rate Quote', action: 'get_quote', icon: '💵', priority: 'high' },
    { id: 'track-load', label: 'Track My Shipment', action: 'track', icon: '📍', priority: 'medium' },
    { id: 'find-carrier', label: 'Find Reliable Carriers', action: 'find_carrier', icon: '🚛', priority: 'medium' },
  ],
  dispatcher: [
    { id: 'assign-load', label: 'Load Assignment Tips', action: 'assign', icon: '📋', priority: 'high' },
    { id: 'fleet-hos', label: 'Fleet HOS Overview', action: 'fleet_hos', icon: '⏱️', priority: 'high' },
    { id: 'handle-delay', label: 'Handle Delays', action: 'delays', icon: '🚨', priority: 'medium' },
    { id: 'optimize-route', label: 'Route Optimization', action: 'routes', icon: '🗺️', priority: 'medium' },
  ],
  carrier: [
    { id: 'compliance', label: 'Compliance Checklist', action: 'compliance', icon: '✅', priority: 'high' },
    { id: 'insurance', label: 'Insurance Requirements', action: 'insurance', icon: '🛡️', priority: 'high' },
    { id: 'driver-mgmt', label: 'Driver Management', action: 'drivers', icon: '👥', priority: 'medium' },
    { id: 'profitability', label: 'Improve Profitability', action: 'profit', icon: '📈', priority: 'medium' },
  ],
};

const DISCLAIMERS: Record<FreightAIRole, string> = {
  driver: '⚠️ AI guidance only. For legal advice, consult a transportation attorney. Always follow FMCSA/DOT regulations.',
  shipper: '⚠️ Rate estimates are AI-calculated. For binding quotes, create a load posting.',
  dispatcher: '⚠️ Verify driver availability and HOS compliance before assignments.',
  carrier: '⚠️ For legal, tax, or insurance advice, consult qualified professionals.',
};

const SAMPLE_RESPONSES: Record<string, { content: string; tags: string[] }> = {
  hos: {
    content: `**Hours of Service (HOS) Summary:**

📋 **11-Hour Driving Limit**
Drive max 11 hours after 10 consecutive hours off duty.

⏰ **14-Hour Limit**
Cannot drive after 14 hours on-duty (even if you didn't drive all 14).

☕ **30-Minute Break**
Required break after 8 cumulative hours of driving.

📅 **60/70-Hour Limit**
Cannot drive after 60/70 hours on-duty in 7/8 consecutive days.

🔄 **34-Hour Restart**
Restart 7/8-day period with 34+ consecutive hours off-duty.

**Reference:** 49 CFR § 395.3

Would you like me to calculate your remaining drive time?`,
    tags: ['compliance', 'hos', 'regulations'],
  },
  rate: {
    content: `**Rate Calculation Factors:**

📏 **Distance & Lane**
High-volume lanes typically offer better rates. LA→Phoenix averages $2.80-3.20/mile.

🚛 **Equipment Type**
• Dry Van: $2.50-3.50/mile
• Reefer: $3.00-4.00/mile
• Flatbed: $3.00-4.50/mile

⛽ **Fuel Surcharge**
Currently ~$0.45-0.55/mile based on DOE diesel index.

⏰ **Timing Premium**
Expedited/hot loads: +15-30% premium.

💰 **Your Advantage**
Direct Freight = No broker cut. You keep 100% of the rate!

What route would you like me to estimate?`,
    tags: ['rates', 'earnings', 'market'],
  },
  documents: {
    content: `**Document Workflow:**

📋 **1. Rate Confirmation**
Auto-generated when you book a load. Review and e-sign.

📦 **2. Bill of Lading (BOL)**
Generated at pickup. Get shipper signature. Note any cargo exceptions.

📸 **3. Proof of Delivery (POD)**
At delivery:
• Take photos of cargo condition
• Get receiver signature
• Note any damages or shortages
• Upload within 2 hours for instant pay!

💰 **4. Invoice**
Auto-generated when POD is verified. Payment in < 2 hours.

**Pro Tip:** Always photo seals, cargo, and any damage before leaving!`,
    tags: ['documents', 'bol', 'pod'],
  },
};

// ============================================================================
// COMPONENTS
// ============================================================================

function RoleSelector({ 
  selectedRole, 
  onSelect 
}: { 
  selectedRole: FreightAIRole; 
  onSelect: (role: FreightAIRole) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(ROLES).map(([key, role]) => (
        <button
          key={key}
          onClick={() => onSelect(key as FreightAIRole)}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedRole === key
              ? 'border-[#00E0B8] bg-[#00E0B8]/10'
              : 'border-[#1F242C] hover:border-[#00E0B8]/50 bg-[#161B22]'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{role.icon}</span>
            <span className="font-medium" style={{ color: selectedRole === key ? role.color : 'white' }}>
              {role.name}
            </span>
          </div>
          <div className="text-xs text-[#8B949E]">{role.description}</div>
        </button>
      ))}
    </div>
  );
}

function QuickActions({ 
  role, 
  onAction 
}: { 
  role: FreightAIRole; 
  onAction: (action: SuggestedAction) => void;
}) {
  const actions = QUICK_ACTIONS[role];
  
  return (
    <div className="space-y-2">
      <div className="text-xs text-[#8B949E] uppercase tracking-wide">Quick Questions</div>
      <div className="flex flex-wrap gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
              action.priority === 'high'
                ? 'bg-[#00E0B8]/20 text-[#00E0B8] border border-[#00E0B8]/30 hover:bg-[#00E0B8]/30'
                : 'bg-[#161B22] border border-[#1F242C] hover:border-[#00E0B8]/50'
            }`}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-[#00E0B8] text-[#0D1117] rounded-br-md'
              : 'bg-[#161B22] border border-[#1F242C] rounded-bl-md'
          }`}
        >
          {/* Message Content */}
          <div className={`text-sm whitespace-pre-wrap ${isUser ? '' : 'prose prose-invert prose-sm max-w-none'}`}>
            {message.content.split('\n').map((line, i) => {
              // Bold text
              if (line.startsWith('**') && line.endsWith('**')) {
                return <div key={i} className="font-bold mt-2 mb-1">{line.replace(/\*\*/g, '')}</div>;
              }
              // Bullet points
              if (line.startsWith('• ') || line.startsWith('- ')) {
                return <div key={i} className="ml-2">{line}</div>;
              }
              // Headers with emoji
              if (line.match(/^[📋📦📸💰⏰📏🚛⛽📅🔄☕✅🛡️👥📈📍🔍]/)) {
                return <div key={i} className="font-medium mt-2">{line}</div>;
              }
              return <div key={i}>{line}</div>;
            })}
          </div>
          
          {/* Tags */}
          {message.tags && message.tags.length > 0 && !isUser && (
            <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-[#1F242C]">
              {message.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#00A3FF]/20 text-[#00A3FF] rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Suggested Actions */}
          {message.suggestedActions && message.suggestedActions.length > 0 && !isUser && (
            <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-[#1F242C]">
              {message.suggestedActions.map(action => (
                <button
                  key={action.id}
                  className="px-2 py-1 bg-[#00E0B8]/20 text-[#00E0B8] rounded text-xs hover:bg-[#00E0B8]/30 flex items-center gap-1"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-[#8B949E] mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#161B22] border border-[#1F242C] rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#00E0B8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#00E0B8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#00E0B8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FreightAIAssistantPage() {
  const [selectedRole, setSelectedRole] = useState<FreightAIRole>('driver');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      let response = {
        content: `I understand you're asking about "${content}". Let me help you with that.\n\nAs a ${ROLES[selectedRole].name}, here's what you need to know:\n\n• Direct Freight provides broker-free access to loads\n• You keep 100% of the rate\n• Instant pay available within 2 hours\n• Real-time tracking and document management\n\nWould you like more specific information?`,
        tags: ['general'],
        suggestedActions: QUICK_ACTIONS[selectedRole].slice(0, 2),
      };
      
      // Match specific topics
      if (lowerContent.includes('hos') || lowerContent.includes('hours') || lowerContent.includes('drive time')) {
        response = { ...SAMPLE_RESPONSES.hos, suggestedActions: [] };
      } else if (lowerContent.includes('rate') || lowerContent.includes('pay') || lowerContent.includes('price') || lowerContent.includes('per mile')) {
        response = { ...SAMPLE_RESPONSES.rate, suggestedActions: [] };
      } else if (lowerContent.includes('document') || lowerContent.includes('bol') || lowerContent.includes('pod')) {
        response = { ...SAMPLE_RESPONSES.documents, suggestedActions: [] };
      }
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        tags: response.tags,
        suggestedActions: response.suggestedActions,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleQuickAction = (action: SuggestedAction) => {
    handleSendMessage(action.label);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };
  
  const clearChat = () => {
    setMessages([]);
  };
  
  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-80 border-r border-[#1F242C] flex flex-col bg-[#0D1117]">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#1F242C]">
            <Link href="/freight" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E0B8] to-[#00A3FF] flex items-center justify-center font-bold text-[#0D1117] rounded-lg">🚛</div>
              <div>
                <div className="font-bold">Freight AI</div>
                <div className="text-xs text-[#8B949E]">Your logistics assistant</div>
              </div>
            </Link>
          </div>
          
          {/* Role Selector */}
          <div className="p-4 border-b border-[#1F242C]">
            <div className="text-xs text-[#8B949E] uppercase tracking-wide mb-3">I am a...</div>
            <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
          </div>
          
          {/* Quick Actions */}
          <div className="p-4 flex-1 overflow-y-auto">
            <QuickActions role={selectedRole} onAction={handleQuickAction} />
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#1F242C]">
            <button
              onClick={clearChat}
              className="w-full px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm hover:border-red-500/50 hover:text-red-400 transition-all"
            >
              🗑️ Clear Chat
            </button>
          </div>
        </aside>
      )}
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-[#1F242C] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-[#161B22] rounded-lg"
            >
              ☰
            </button>
            <div>
              <div className="font-semibold flex items-center gap-2">
                <span>{ROLES[selectedRole].icon}</span>
                <span>{ROLES[selectedRole].name} Assistant</span>
              </div>
              <div className="text-xs text-[#8B949E]">{ROLES[selectedRole].description}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
            <Link 
              href="/freight" 
              className="px-3 py-1.5 bg-[#161B22] border border-[#1F242C] rounded-lg text-sm hover:border-[#00E0B8]/50"
            >
              ← Back to Freight
            </Link>
          </div>
        </header>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2">Freight AI Assistant</h2>
              <p className="text-[#8B949E] max-w-md mb-6">
                I'm here to help with loads, rates, documents, compliance, and more. 
                Ask me anything or use the quick actions on the left!
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {QUICK_ACTIONS[selectedRole].map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="px-4 py-2 bg-[#161B22] border border-[#1F242C] rounded-xl hover:border-[#00E0B8]/50 flex items-center gap-2"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Disclaimer */}
        <div className="px-4 py-2 border-t border-[#1F242C] bg-[#161B22]/50">
          <div className="text-xs text-[#8B949E] text-center">
            {DISCLAIMERS[selectedRole]}
          </div>
        </div>
        
        {/* Input */}
        <div className="p-4 border-t border-[#1F242C]">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask me anything about ${ROLES[selectedRole].description.toLowerCase()}...`}
                className="w-full px-4 py-3 bg-[#161B22] border border-[#1F242C] rounded-xl text-sm resize-none focus:outline-none focus:border-[#00E0B8] placeholder-[#8B949E]"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                inputValue.trim() && !isTyping
                  ? 'bg-[#00E0B8] text-[#0D1117] hover:bg-[#00E0B8]/90'
                  : 'bg-[#161B22] text-[#8B949E] cursor-not-allowed'
              }`}
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
