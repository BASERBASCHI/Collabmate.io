import React from 'react';
import { Users, Plus, FileText, Activity, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  onFindTeammates: () => void;
  onCreateTeam: () => void;
  onRecommendedProjects: () => void;
  onAskGemini: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onFindTeammates,
  onCreateTeam,
  onRecommendedProjects,
  onAskGemini
}) => {
  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-4">
      {/* User Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="font-bold text-lg text-gray-800">{user.name}</h2>
            <p className="text-gray-600 text-sm">{user.title}</p>
            <div className="flex mt-2 space-x-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Hackathons
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Projects
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {user.profileStrength < 80 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">Complete Profile</span>
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
              <p className="text-xs text-yellow-700 mb-2">
                Boost your profile to get better matches!
              </p>
              <button
                onClick={() => {
                  window.location.reload(); // Simple way to trigger profile completion check
                }}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors"
              >
                Complete Now
              </button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Profile Strength</span>
            <span className="text-sm font-bold text-indigo-600">{user.profileStrength}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${user.profileStrength}%` }}
            />
          </div>
        </div>
        
        {user.location && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{user.location.city}, {user.location.country}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button
            onClick={onAskGemini}
            className="w-full flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-700 rounded-lg px-4 py-3 transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            <span>Ask Gemini AI</span>
          </button>
          
          <button
            onClick={onFindTeammates}
            className="w-full flex items-center space-x-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg px-4 py-3 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>Find Teammates</span>
          </button>
          
          <button
            onClick={onCreateTeam}
            className="w-full flex items-center space-x-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg px-4 py-3 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Team</span>
          </button>
          
          <button
            onClick={onRecommendedProjects}
            className="w-full flex items-center space-x-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg px-4 py-3 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Recommended Projects</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <img
              src="https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
              alt="Alex Chen"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm">
                <span className="font-semibold">Alex Chen</span> viewed your profile
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <img
              src="https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
              alt="Maya Patel"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm">
                <span className="font-semibold">Maya Patel</span> sent you a message
              </p>
              <p className="text-xs text-gray-500">3 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm">
                You joined <span className="font-semibold">FinTech Innovators</span> team
              </p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};