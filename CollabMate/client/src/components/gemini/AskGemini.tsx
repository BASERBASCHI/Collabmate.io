import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, X, Loader } from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';

interface AskGeminiProps {
  onClose: () => void;
  context?: string;
  placeholder?: string;
}

export const AskGemini: React.FC<AskGeminiProps> = ({ 
  onClose, 
  context = '',
  placeholder = "Ask Gemini anything about collaboration, projects, or development..."
}) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'gemini';
    message: string;
    timestamp: string;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = question.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to history
    setConversationHistory(prev => [...prev, {
      type: 'user',
      message: userMessage,
      timestamp
    }]);

    setQuestion('');
    setLoading(true);

    try {
      const result = await apiRequest('/api/gemini/ask', {
        method: 'POST',
        body: JSON.stringify({ question: userMessage, context }),
      });
      const geminiResponse = result.response;
      
      // Add Gemini response to history
      setConversationHistory(prev => [...prev, {
        type: 'gemini',
        message: geminiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      setResponse(geminiResponse);
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      const fallbackResponse = "I'm having trouble connecting right now. Here are some general tips: Consider breaking down your project into smaller tasks, collaborate with teammates who have complementary skills, and don't hesitate to ask for help when needed!";
      
      setConversationHistory(prev => [...prev, {
        type: 'gemini',
        message: fallbackResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setResponse('');
  };

  // Component is always rendered when called

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Ask Gemini AI</h3>
              <p className="text-sm text-gray-600">Your intelligent collaboration assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {conversationHistory.length > 0 && (
              <button
                onClick={clearConversation}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[400px]">
          {conversationHistory.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Gemini AI!</h4>
              <p className="text-gray-600 mb-4">Ask me anything about:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <span className="font-medium text-purple-800">🤝 Team Collaboration</span>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="font-medium text-blue-800">💡 Project Ideas</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <span className="font-medium text-green-800">🛠️ Technical Help</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <span className="font-medium text-orange-800">🚀 Career Advice</span>
                </div>
              </div>
            </div>
          ) : (
            conversationHistory.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                } rounded-lg p-4`}>
                  {message.type === 'gemini' && (
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-600">Gemini AI</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-600">Gemini is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                disabled={loading}
              />
              <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-3 transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "How do I find the right teammates?",
              "What makes a good project idea?",
              "Tips for remote collaboration?",
              "How to manage project timelines?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuestion(suggestion)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};