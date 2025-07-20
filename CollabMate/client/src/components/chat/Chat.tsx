import React, { useState } from 'react';
import { ArrowLeft, Phone, Video, MoreHorizontal, Send, Paperclip, Sparkles } from 'lucide-react';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { User } from '../../types';

interface ChatProps {
  user: User;
  partner: {
    id: string;
    name: string;
    avatar: string;
  };
  onBackToDashboard: () => void;
}

export const Chat: React.FC<ChatProps> = ({ 
  user,
  partner,
  onBackToDashboard 
}) => {
  const [message, setMessage] = useState('');
  const { messages, loading, sendMessage, clearMessages } = useGeminiChat();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      const userMessage = message.trim();
      setMessage('');
      
      try {
        await sendMessage(userMessage, `You are chatting with a developer named ${partner.name}. Help facilitate their collaboration by providing relevant coding advice, project suggestions, and team communication tips.`);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handlePhoneCall = () => {
    alert(`📞 Starting voice call with ${partner.name}...\n\nThis would initiate a WebRTC voice call.`);
  };

  const handleVideoCall = () => {
    alert(`📹 Starting video call with ${partner.name}...\n\nThis would open a video conference room.`);
  };

  const handleMoreOptions = () => {
    alert('⚙️ Chat Options\n\n• Mute notifications\n• Share files\n• Schedule meeting\n• View shared projects\n• Block user');
  };

  const handleClearChat = () => {
    clearMessages();
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center flex-1">
          <img
            src={partner.avatar}
            alt={partner.name}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-bold text-gray-800">{partner.name}</h3>
            <p className="text-xs text-gray-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online now • AI Assistant
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleClearChat}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Clear chat"
          >
            <Sparkles className="h-5 w-5 text-purple-600" />
          </button>
          <button 
            onClick={handleMoreOptions}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-700">AI-Powered Chat Assistant</p>
              <p className="text-sm mt-1">Ask me about coding, project ideas, or collaboration tips!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="flex justify-start mt-4">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about coding or collaboration..."
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};