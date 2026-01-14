'use client';

import { useState, useEffect, useRef } from 'react';

interface AutopilotWidgetProps {
  module?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export default function AutopilotWidget({ 
  module = 'general', 
  position = 'bottom-right' 
}: AutopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    console.log('🤖 AutopilotWidget mounting, module:', module, 'position:', position);
    
    // Ініціалізація Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
          
          if (event.results[current].isFinal) {
            setMessage(transcriptText);
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [module, position]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    
    // Симуляція відповіді AI
    const response = `I understand you're asking about ${message}. Let me help you with that in the ${module} module.`;
    
    // Говоримо відповідь
    speak(response);
    
    setMessage('');
    setTranscript('');
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Main Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-[#00A3FF] to-[#0077CC] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg shadow-2xl w-[380px] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00A3FF] to-[#0077CC] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-semibold text-white text-sm">AI Assistant</div>
                <div className="text-xs text-white/80 capitalize">{module} Module</div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                stopSpeaking();
                if (isListening) toggleListening();
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 h-[300px] overflow-y-auto space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#00A3FF]/20 rounded-full flex items-center justify-center flex-shrink-0">
                🤖
              </div>
              <div className="flex-1">
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 text-sm">
                  <p className="text-[#E6EDF3]">
                    👋 Hello! I'm your AI assistant for the <span className="text-[#00A3FF] font-medium capitalize">{module}</span> module.
                  </p>
                  <p className="text-[#8B949E] mt-2">
                    🎤 You can type or use voice input. How can I help you today?
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Status */}
            {isListening && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm">Listening... {transcript && `"${transcript}"`}</span>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="flex justify-center">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm">Speaking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-[#30363D] p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type or speak your message..."
                className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2 text-sm text-[#E6EDF3] placeholder-[#6E7681] focus:outline-none focus:border-[#00A3FF]"
              />
              
              {/* Voice Button */}
              <button
                onClick={toggleListening}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-[#30363D] hover:bg-[#3D444D]'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="6" y="6" width="8" height="8" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#E6EDF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              {/* Send Button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="w-10 h-10 bg-[#00A3FF] hover:bg-[#33B5FF] rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>

              {/* Stop Speaking Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all"
                  title="Stop speaking"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Voice Support Info */}
            <div className="mt-2 text-xs text-[#6E7681] flex items-center gap-2">
              <span>🎤</span>
              <span>Voice input & text-to-speech enabled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
