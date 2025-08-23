import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader2, TestTube, MessageCircle, Minimize2, Maximize2, RefreshCw, AlertCircle, CheckCircle, Clock, Zap, Brain } from 'lucide-react';

const AdvancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hi! I\'m Medicare\'s AI Assistant. I can help you with medicine information, order queries, and general health questions. How can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const chatBodyRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate typing indicator
  const showTypingIndicator = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Please enter a message to get started.',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    const newUserMessage = {
      sender: 'user',
      text: trimmedInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    showTypingIndicator();

    // Different Gemini models to try
    const geminiModels = [
      'gemini-1.5-flash',     // Fastest, most available
      'gemini-1.5-pro',      // More capable but busier
      'gemini-pro'           // Fallback legacy model
    ];

    let lastError = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      for (const model of geminiModels) {
        try {
          // Check for API key first
          const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
          
          if (!geminiApiKey) {
            setMessages(prev => [...prev, { 
              sender: 'bot', 
              text: 'API Configuration Required:\n\n1. Visit Google AI Studio: https://aistudio.google.com/app/apikey\n2. Generate your API key\n3. Add to .env file: REACT_APP_GEMINI_API_KEY=your_key_here\n4. Restart the development server\n\nContact support if you need assistance.',
              timestamp: new Date().toISOString(),
              type: 'error'
            }]);
            setIsLoading(false);
            setConnectionStatus('disconnected');
            return;
          }

          setConnectionStatus('connecting');
          
          // Call Google Gemini API with current model
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are Medicare Pharmacy's AI assistant. You help customers with medicine information, order queries, health questions, and pharmacy services. Be helpful, professional, and concise. Here's the customer's question: ${trimmedInput}`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (aiResponse) {
              setMessages(prev => [...prev, { 
                sender: 'bot', 
                text: aiResponse,
                timestamp: new Date().toISOString(),
                model: model
              }]);
              setIsLoading(false);
              setConnectionStatus('connected');
              return; // Success! Exit all loops
            }
          } else {
            const errorData = await response.json();
            lastError = errorData;
            
            // If 503 (overloaded), try next model immediately
            if (response.status === 503) {
              setConnectionStatus('busy');
              continue;
            }
            
            // For other errors, don't try other models in this attempt
            break;
          }

        } catch (error) {
          console.error(`${model} request failed:`, error);
          lastError = { error: { message: error.message } };
          setConnectionStatus('error');
        }
      }

      // Wait before next attempt (exponential backoff)
      if (attempt < 2) {
        const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        
        // Show user we're retrying
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: `All AI models are currently busy. Retrying in ${waitTime/1000} seconds... (Attempt ${attempt + 1}/3)`,
          timestamp: new Date().toISOString(),
          type: 'retry'
        }]);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Remove the retry message
        setMessages(prev => prev.slice(0, -1));
      }
    }

    // If we get here, all attempts failed
    let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. ';
    if (lastError?.error?.code === 503) {
      errorMessage += 'Our AI service is temporarily overloaded. Please try again in a few minutes or contact our support team for immediate assistance.';
    } else if (lastError?.error?.code === 429) {
      errorMessage += 'Too many requests. Please wait a moment before trying again.';
    } else if (lastError?.error?.code === 400) {
      errorMessage += 'There was an issue with your request. Please try rephrasing your question.';
    } else if (lastError?.error?.code === 403) {
      errorMessage += 'Authentication issue detected. Please contact support.';
    } else {
      errorMessage += 'An unexpected error occurred. Please try again or contact support.';
    }
    
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      text: errorMessage,
      timestamp: new Date().toISOString(),
      type: 'error'
    }]);
    setIsLoading(false);
    setConnectionStatus('error');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSend();
      }
    }
  };

  // Test API connection function
  const testConnection = async () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (apiKey) {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Testing AI connection... Please wait.',
        timestamp: new Date().toISOString(),
        type: 'system'
      }]);
      setInput('Hello, are you working properly?');
      setTimeout(() => handleSend(), 500);
    } else {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'No API key detected. Please configure your environment variables.',
        timestamp: new Date().toISOString(),
        type: 'error'
      }]);
    }
  };

  const clearChat = () => {
    setMessages([{
      sender: 'bot', 
      text: 'Chat cleared! How can I help you today?',
      timestamp: new Date().toISOString()
    }]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'connecting':
        return <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />;
      case 'busy':
        return <Clock className="w-3 h-3 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'AI Online';
      case 'connecting':
        return 'Connecting...';
      case 'busy':
        return 'AI Busy';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Enhanced AI Bot Icon */}
      <div 
        className={`chatbot-icon relative transition-all duration-300 ${
          isOpen ? 'transform rotate-0' : 'transform hover:scale-110'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`
          w-16 h-16 rounded-full shadow-lg cursor-pointer flex items-center justify-center
          transition-all duration-300 border-2
          ${isOpen 
            ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-300 hover:from-red-600 hover:to-red-700' 
            : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-300 hover:from-blue-700 hover:to-blue-900'
          }
        `}>
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Brain className="w-8 h-8 text-white" />
          )}
        </div>
        
        {/* Status indicator */}
        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
          connectionStatus === 'connected' ? 'bg-green-500' :
          connectionStatus === 'connecting' ? 'bg-yellow-500' :
          connectionStatus === 'busy' ? 'bg-orange-500' :
          connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
        }`}>
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Pulse animation for new messages */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
        )}
      </div>

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className={`
          absolute bottom-20 left-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
          transform transition-all duration-300 ease-out
          ${isMinimized ? 'h-16' : 'h-[32rem]'}
        `}>
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    {getStatusIcon()}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Medicare AI</h4>
                  <div className="flex items-center space-x-1 text-xs text-blue-100">
                    {getStatusIcon()}
                    <span>{getStatusText()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={testConnection}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Test Connection"
                >
                  <TestTube className="w-4 h-4" />
                </button>
                <button 
                  onClick={clearChat}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div 
                ref={chatBodyRef}
                className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50"
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-sm ${
                      msg.sender === 'user' ? 'order-2' : 'order-1'
                    }`}>
                      {/* Message bubble */}
                      <div className={`
                        px-4 py-3 rounded-2xl shadow-sm relative
                        ${msg.sender === 'user' 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                          : msg.type === 'error'
                          ? 'bg-red-50 border border-red-200 text-red-800'
                          : msg.type === 'retry'
                          ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                          : msg.type === 'system'
                          ? 'bg-blue-50 border border-blue-200 text-blue-800'
                          : 'bg-white border border-gray-200 text-gray-800'
                        }
                      `}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </div>
                        
                        {/* Message metadata */}
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {msg.model && (
                            <span className="flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>{msg.model}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' ? 'order-1 mr-3 bg-blue-600' : 'order-2 ml-3 bg-gray-600'
                    }`}>
                      {msg.sender === 'user' ? (
                        <div className="w-5 h-5 bg-white rounded-full"></div>
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-center">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-full flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Processing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Footer */}
              <div className="border-t border-gray-200 bg-white p-4">
                {/* Input Container */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask about medicines, orders, or health..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                    />
                    <button 
                      onClick={handleSend} 
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Status Bar */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <span>{getStatusText()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      process.env.REACT_APP_GEMINI_API_KEY ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span>
                      {process.env.REACT_APP_GEMINI_API_KEY ? 'API Ready' : 'API Missing'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedChatbot;