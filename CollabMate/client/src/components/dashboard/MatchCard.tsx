import React from 'react';
import { TrendingUp, Eye, MessageSquare, MapPin, Clock } from 'lucide-react';
import { Match } from '../../types';

interface MatchCardProps {
  match: Match;
  onViewProfile: () => void;
  onSendMessage: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onViewProfile, onSendMessage }) => {
  const handleViewProfile = () => {
    alert(`👤 Viewing ${match.user.name}'s Profile\n\n${match.user.title}\n\nCompatibility: ${match.compatibility}%\nCommon Skills: ${match.commonSkills.join(', ')}\n\n"${match.reason}"`);
    onViewProfile();
  };

  const handleSendMessage = () => {
    alert(`💬 Starting conversation with ${match.user.name}\n\nYou can now chat about potential collaboration opportunities!`);
    onSendMessage();
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <img
          src={match.user.avatar}
          alt={match.user.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-gray-800">{match.user.name}</h4>
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              {match.compatibility}%
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">{match.user.title}</p>
          
          {/* Personality Tags */}
          {match.user.preferences.personalityTags && match.user.preferences.personalityTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {match.user.preferences.personalityTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mt-3">
            {match.commonSkills.map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {match.user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {match.user.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
            {match.user.location && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{match.user.location.city}</span>
              </div>
            )}
            {match.user.preferences.codingHours && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{match.user.preferences.codingHours}</span>
              </div>
            )}
            <div className="flex items-center">
              <span>Active: {new Date(match.user.lastActive).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-xs text-gray-500 italic">"{match.reason}"</p>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleViewProfile}
              className="flex items-center space-x-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>View Profile</span>
            </button>
            <button
              onClick={handleSendMessage}
              className="flex items-center space-x-2 text-sm border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};