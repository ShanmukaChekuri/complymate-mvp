import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI compliance assistant. I can help you with OSHA forms, compliance questions, and workplace safety guidance. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('osha') || input.includes('form')) {
      return "I can help you with OSHA forms! The most common ones are:\n\n• **OSHA 300** - Log of Work-Related Injuries and Illnesses\n• **OSHA 300A** - Summary of Work-Related Injuries and Illnesses\n• **OSHA 301** - Injury and Illness Incident Report\n\nWhich specific form do you need assistance with?";
    }
    
    if (input.includes('injury') || input.includes('incident')) {
      return "For workplace injuries or incidents, you'll need to:\n\n1. **Immediate Response**: Ensure the injured person gets medical attention\n2. **Document**: Fill out OSHA 301 form within 7 days\n3. **Record**: Log it in your OSHA 300 log\n4. **Report**: Some incidents must be reported to OSHA within 24 hours\n\nWould you like me to help you determine which forms you need?";
    }
    
    if (input.includes('safety') || input.includes('training')) {
      return "Safety training is crucial for OSHA compliance! Key training areas include:\n\n• **Hazard Communication** (Chemical Safety)\n• **Personal Protective Equipment** (PPE)\n• **Lockout/Tagout** procedures\n• **Emergency Action Plans**\n• **Equipment-specific** training\n\nWhat type of safety training are you looking to implement?";
    }
    
    return "I understand you're asking about compliance matters. Could you provide more specific details about what you need help with? I can assist with:\n\n• OSHA form completion\n• Incident reporting procedures\n• Safety training requirements\n• Compliance deadlines\n• Workplace safety guidelines";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // In a real app, you'd send this to a speech-to-text service
        simulateTranscription();
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  const simulateTranscription = () => {
    // Simulate speech-to-text result
    const sampleTranscriptions = [
      "How do I fill out an OSHA 300 form?",
      "What should I do after a workplace injury?",
      "I need help with safety training requirements",
      "Can you help me report an incident to OSHA?"
    ];
    
    const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    setInputValue(randomTranscription);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const exampleQuestions = [
    {
      question: "How do I fill out an OSHA 300 form?",
      description: "Get step-by-step guidance for injury logs",
      icon: "📋",
      color: "from-blue-500 to-blue-600"
    },
    {
      question: "What should I do after a workplace injury?",
      description: "Learn immediate response procedures",
      icon: "🚨",
      color: "from-red-500 to-red-600"
    },
    {
      question: "What safety training is required?",
      description: "Understand mandatory training requirements",
      icon: "🎓",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      question: "How do I report an incident to OSHA?",
      description: "Learn reporting timelines and procedures",
      icon: "📞",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Chat Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">AI Compliance Assistant</h1>
              <p className="text-sm text-slate-400">OSHA expert • Always available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                <p className="text-slate-400">Ask me anything about OSHA compliance, workplace safety, or form completion.</p>
              </div>
              
              {/* Styled Example Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exampleQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(item.question)}
                    className="group p-6 text-left rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {item.question}
                        </h3>
                        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                      <div className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full group-hover:bg-slate-600/50 transition-colors">
                        Click to ask
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                )}
                
                <div
                  className={`max-w-3xl rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-12'
                      : 'bg-slate-800/50 border border-slate-700 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-slate-400 text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about OSHA compliance, workplace safety, or form completion..."
                  className="w-full px-4 py-3 pr-20 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
                  rows={1}
                  style={{
                    minHeight: '48px',
                    height: Math.min(Math.max(48, textareaRef.current?.scrollHeight || 48), 128)
                  }}
                />
                
                {/* Voice Recording Button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute right-12 bottom-2 p-2 rounded-lg transition-all ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    {isRecording ? (
                      <rect x="6" y="6" width="12" height="12" rx="2"/>
                    ) : (
                      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    )}
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-slate-500">
                {isRecording ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    Recording... Click microphone to stop
                  </span>
                ) : (
                  'Press Enter to send, Shift + Enter for new line, or use voice recording'
                )}
              </div>
              <div className="text-xs text-slate-500">
                AI responses are simulated for demo purposes
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
