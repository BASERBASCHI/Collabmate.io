import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Navigation } from '../navigation/Navigation';
import { Sidebar } from '../sidebar/Sidebar';
import { Dashboard } from '../dashboard/Dashboard';
import { Profile } from '../profile/Profile';
import { Chat } from '../chat/Chat';
import { ProfileCompletion } from '../profile/ProfileCompletion';
import { AskGemini } from '../gemini/AskGemini';
import { ViewType } from '../../types';

export const Home = () => {
  const { user: firebaseUser } = useAuth();
  const { userProfile, loading: profileLoading, updateProfile } = useUserProfile();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedChatPartner, setSelectedChatPartner] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);

  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showAskGemini, setShowAskGemini] = useState(false);

  // Show profile completion modal for incomplete profiles
  React.useEffect(() => {
    if (userProfile && (!userProfile.isProfileComplete || userProfile.profileStrength < 60)) {
      setShowProfileCompletion(true);
    }
  }, [userProfile]);

  const handleViewProfile = () => {
    setCurrentView('profile');
  };

  const handleSendMessage = () => {
    // For demo purposes, use a mock partner
    setSelectedChatPartner({
      id: 'demo-partner',
      name: 'Maya Patel',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1'
    });
    setCurrentView('chat');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedChatPartner(null);
  };

  const handleAskGemini = () => {
    setShowAskGemini(true);
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {userProfile && (
        <>
          <Sidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            onViewProfile={handleViewProfile}
            onAskGemini={handleAskGemini}
            onLogout={handleLogout}
            user={userProfile}
          />
          
          <div className="flex-1 flex flex-col">
            <Navigation
              user={userProfile}
              currentView={currentView}
              onBackToDashboard={handleBackToDashboard}
            />
            
            <main className="flex-1 overflow-hidden">
              {currentView === 'dashboard' && (
                <Dashboard
                  user={userProfile}
                  onViewProfile={handleViewProfile}
                  onSendMessage={handleSendMessage}
                  onRefresh={() => window.location.reload()}
                  onAskGemini={handleAskGemini}
                />
              )}
              
              {currentView === 'profile' && (
                <Profile user={userProfile} onBack={handleBackToDashboard} />
              )}
              
              {currentView === 'chat' && selectedChatPartner && (
                <Chat
                  user={userProfile}
                  partner={selectedChatPartner}
                  onBackToDashboard={handleBackToDashboard}
                />
              )}
            </main>
          </div>
        </>
      )}

      {/* Modals */}
      {showProfileCompletion && userProfile && (
        <ProfileCompletion
          user={userProfile}
          onClose={() => setShowProfileCompletion(false)}
        />
      )}

      {showAskGemini && (
        <AskGemini onClose={() => setShowAskGemini(false)} />
      )}
    </div>
  );
};