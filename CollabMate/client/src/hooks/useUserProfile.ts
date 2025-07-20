import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { User } from '../types';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
  const { user: firebaseUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [firebaseUser]);

  const fetchUserProfile = async () => {
    if (!firebaseUser) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          id: firebaseUser.uid,
          name: data.displayName || firebaseUser.displayName || 'Anonymous User',
          email: firebaseUser.email || '',
          avatar: data.photoURL || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          title: data.title || 'Developer',
          about: data.about || 'No bio available',
          skills: data.skills || [],
          interests: data.interests || [],
          experience: data.experience || 'Beginner',
          location: data.location || { city: '', country: '' },
          github: data.github || '',
          linkedin: data.linkedin || '',
          portfolio: data.portfolio || '',
          preferences: data.preferences || {
            availability: '',
            timezone: '',
            roles: [],
            communication: '',
            hackathonPreference: '',
            remoteWork: true,
            maxDistance: 50,
            workStyle: [],
            personalityTags: [],
            codingHours: '',
            collaborationStyle: '',
            projectPace: ''
          },
          profileStrength: data.profileStrength || 20,
          isProfileComplete: data.isProfileComplete || false,
          createdAt: data.createdAt || new Date(),
          updatedAt: data.updatedAt || new Date()
        });
      } else {
        // Create a new user profile
        const newProfile: Partial<User> = {
          displayName: firebaseUser.displayName || 'New User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          title: 'Developer',
          about: 'Welcome to CollabMate! Let me help you find your perfect coding partner.',
          skills: [],
          interests: [],
          experience: 'Beginner',
          location: { city: '', country: '' },
          preferences: {
            availability: '',
            timezone: '',
            roles: [],
            communication: '',
            hackathonPreference: '',
            remoteWork: true,
            maxDistance: 50,
            workStyle: [],
            personalityTags: [],
            codingHours: '',
            collaborationStyle: '',
            projectPace: ''
          },
          profileStrength: 20,
          isProfileComplete: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), newProfile);
        
        setUserProfile({
          id: firebaseUser.uid,
          name: newProfile.displayName!,
          email: newProfile.email!,
          avatar: newProfile.photoURL!,
          title: newProfile.title!,
          about: newProfile.about!,
          skills: newProfile.skills!,
          interests: newProfile.interests!,
          experience: newProfile.experience!,
          location: newProfile.location!,
          github: '',
          linkedin: '',
          portfolio: '',
          preferences: newProfile.preferences!,
          profileStrength: newProfile.profileStrength!,
          isProfileComplete: newProfile.isProfileComplete!,
          createdAt: newProfile.createdAt!,
          updatedAt: newProfile.updatedAt!
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!firebaseUser || !userProfile) return;

    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
        profileStrength: calculateProfileStrength({ ...userProfile, ...updates })
      };

      await updateDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), updateData);
      
      setUserProfile(prev => prev ? { ...prev, ...updateData } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const calculateProfileStrength = (profile: User): number => {
    let strength = 0;
    
    if (profile.name && profile.name !== 'Anonymous User') strength += 10;
    if (profile.title && profile.title !== 'Developer') strength += 10;
    if (profile.about && profile.about.length > 50) strength += 15;
    if (profile.skills && profile.skills.length > 0) strength += 20;
    if (profile.interests && profile.interests.length > 0) strength += 10;
    if (profile.location?.city && profile.location?.country) strength += 10;
    if (profile.github || profile.linkedin || profile.portfolio) strength += 10;
    if (profile.preferences.availability) strength += 5;
    if (profile.preferences.workStyle && profile.preferences.workStyle.length > 0) strength += 10;
    
    return Math.min(strength, 100);
  };

  return {
    userProfile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchUserProfile
  };
};