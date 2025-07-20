import React from 'react';
import { Bell, Menu, Sparkles } from 'lucide-react';
import { User } from '../../types';

interface NavigationProps {
  user: User;
  onLogout: () => void;
  onAskGemini: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout, onAskGemini }) => {
  const handleNotificationsClick = () => {
    alert('🔔 Notifications\n\n• Alex Chen viewed your profile (1 hour ago)\n• Maya Patel sent you a message (3 hours ago)\n• New hackathon match available (5 hours ago)');
  };

  const handleProfileClick = () => {
    // Remove any existing dropdown first
    const existingDropdown = document.querySelector('.profile-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
      return;
    }
    
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50';
    dropdown.innerHTML = `
      <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onclick="alert('Profile settings would open here')">Profile Settings</button>
      <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onclick="alert('Account preferences would open here')">Preferences</button>
      <hr class="my-1">
      <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" id="logout-btn">Sign Out</button>
    `;
    
    // Position dropdown
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
      profileBtn.style.position = 'relative';
      profileBtn.appendChild(dropdown);
      
      // Add logout functionality
      const logoutBtn = dropdown.querySelector('#logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', onLogout);
      }
      
      // Remove dropdown when clicking outside
      setTimeout(() => {
        document.addEventListener('click', (e) => {
          if (!profileBtn.contains(e.target as Node)) {
            dropdown.remove();
          }
        }, { once: true });
      }, 100);
    }
  };
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Menu className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">CollabMate</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={onAskGemini}
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            <span className="hidden md:inline">Ask Gemini</span>
          </button>
          
          <button 
            onClick={handleNotificationsClick}
            className="relative p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div 
            id="profile-btn"
            onClick={handleProfileClick}
            className="flex items-center space-x-3 cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg px-2 py-1 transition-colors">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <div className="hidden md:block">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-purple-100">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};