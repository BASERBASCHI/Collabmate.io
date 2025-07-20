import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  addDoc,
  orderBy,
  limit,
  serverTimestamp,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, COLLECTIONS, FirebaseUser, FirebaseMatch } from '../lib/firebase';
import { Match, User } from '../types';
import { useFirebaseUsers } from './useFirebaseUsers';

export const useFirebaseMatches = (userId: string | null) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { users: allUsers } = useFirebaseUsers(userId || undefined);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchMatches();
  }, [userId]);

  const fetchMatches = async () => {
    if (!userId) return;

    try {
      const matchesQuery = query(
        collection(db, COLLECTIONS.MATCHES),
        where('userId', '==', userId),
        orderBy('compatibilityScore', 'desc'),
        limit(10)
      );

      const matchesSnapshot = await getDocs(matchesQuery);
      const matchesData = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseMatch[];

      // Fetch matched user profiles
      const formattedMatches: Match[] = [];
      
      for (const match of matchesData) {
        const userDocRef = doc(db, COLLECTIONS.USERS, match.matchedUserId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as FirebaseUser;
          
          formattedMatches.push({
            id: match.id,
            user: {
              id: userData.uid,
              name: userData.displayName,
              email: userData.email,
              title: userData.title,
              avatar: userData.photoURL || `https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
              skills: userData.skills || [],
              preferences: {
                availability: userData.availability || '',
                timezone: userData.timezone || '',
                roles: userData.preferredRoles || [],
                communication: userData.communicationStyle || '',
                hackathonPreference: userData.hackathonPreference || '',
                remoteWork: userData.remoteWork || true,
                maxDistance: userData.maxDistance,
                workStyle: userData.workStyle || [],
                personalityTags: userData.personalityTags || [],
                codingHours: userData.codingHours || '',
                collaborationStyle: userData.collaborationStyle || '',
                projectPace: userData.projectPace || ''
              },
              profileStrength: userData.profileStrength || 85,
              about: userData.bio || '',
              projects: []
            },
            compatibility: match.compatibilityScore,
            reason: match.reason,
            commonSkills: match.commonSkills
          });
        }
      }

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMatches = async () => {
    if (!userId) return;

    try {
      // Clear existing matches first
      const existingMatchesQuery = query(
        collection(db, COLLECTIONS.MATCHES),
        where('userId', '==', userId)
      );
      const existingSnapshot = await getDocs(existingMatchesQuery);
      
      // Get current user's profile
      const currentUserDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (!currentUserDoc.exists()) return;

      const currentUser = currentUserDoc.data() as FirebaseUser;

      // Get other users to match with
      const otherUsers = allUsers.filter(user => user.id !== userId);
      
      if (otherUsers.length === 0) {
        console.log('No other users found for matching');
        return;
      }

      // Generate matches based on common skills, interests, and location
      const newMatches = otherUsers.map(otherUser => {
        const currentUserSkills = currentUser.skills || [];
        const otherUserSkills = otherUser.skills;
        const commonSkills = currentUserSkills.filter(skill => 
          otherUserSkills.includes(skill)
        );
        
        const currentUserInterests = currentUser.interests || [];
        const otherUserInterests = otherUser.interests;
        const commonInterests = currentUserInterests.filter(interest => 
          otherUserInterests.includes(interest)
        );
        
        // Check personality compatibility
        const currentUserTags = currentUser.personalityTags || [];
        const otherUserTags = otherUser.preferences.personalityTags || [];
        const commonPersonality = currentUserTags.filter(tag => 
          otherUserTags.includes(tag)
        );
        
        // Check work style compatibility
        const currentUserWorkStyle = currentUser.workStyle || [];
        const otherUserWorkStyle = otherUser.preferences.workStyle || [];
        const commonWorkStyle = currentUserWorkStyle.filter(style => 
          otherUserWorkStyle.includes(style)
        );
        
        // Calculate compatibility score based on multiple factors
        const skillScore = (commonSkills.length / Math.max(currentUserSkills.length, 1)) * 40;
        const interestScore = (commonInterests.length / Math.max(currentUserInterests.length, 1)) * 25;
        const personalityScore = (commonPersonality.length / Math.max(currentUserTags.length, 1)) * 15;
        const workStyleScore = (commonWorkStyle.length / Math.max(currentUserWorkStyle.length, 1)) * 10;
        
        // Location proximity bonus
        let locationScore = 0;
        if (currentUser.location?.coordinates && otherUser.location?.coordinates) {
          const distance = calculateDistance(
            currentUser.location.coordinates.lat,
            currentUser.location.coordinates.lng,
            otherUser.location.coordinates.lat,
            otherUser.location.coordinates.lng
          );
          const maxDistance = currentUser.maxDistance || 100;
          if (distance <= maxDistance) {
            locationScore = Math.max(0, 20 - (distance / maxDistance) * 20);
          }
        }
        
        const randomBonus = Math.random() * 5; // Small randomness
        const compatibilityScore = Math.min(Math.round(skillScore + interestScore + personalityScore + workStyleScore + locationScore + randomBonus), 100);

        // Generate contextual reasons
        let reason = '';
        if (commonSkills.length > 0 && commonInterests.length > 0 && commonPersonality.length > 0) {
          reason = `Amazing match! Skills: ${commonSkills.slice(0, 2).join(', ')}, interests: ${commonInterests.slice(0, 2).join(', ')}, personality: ${commonPersonality.slice(0, 2).join(', ')}`;
        } else if (commonSkills.length > 0 && commonPersonality.length > 0) {
          reason = `Great match! Technical skills in ${commonSkills.slice(0, 2).join(', ')} and similar personality: ${commonPersonality.slice(0, 2).join(', ')}`;
        } else if (commonSkills.length > 0) {
          reason = `Great technical match with shared skills in ${commonSkills.slice(0, 3).join(', ')}`;
        } else if (commonPersonality.length > 0) {
          reason = `Personality match! You both are ${commonPersonality.slice(0, 3).join(', ')}`;
        } else if (commonInterests.length > 0) {
          reason = `Similar interests in ${commonInterests.slice(0, 3).join(', ')} - great for collaboration`;
        } else {
          reason = 'Complementary skills could lead to innovative projects together';
        }
        
        if (commonWorkStyle.length > 0) {
          reason += ` • Compatible work styles: ${commonWorkStyle.slice(0, 2).join(', ')}`;
        }
        
        if (locationScore > 0) {
          reason += ` • Located nearby for potential in-person collaboration`;
        }

        return {
          userId: userId,
          matchedUserId: otherUser.id,
          compatibilityScore: compatibilityScore,
          reason: reason,
          commonSkills: commonSkills,
          createdAt: serverTimestamp()
        };
      }).filter(match => match.compatibilityScore > 50); // Only keep good matches

      // Add matches to Firestore
      for (const match of newMatches) {
        await addDoc(collection(db, COLLECTIONS.MATCHES), match);
      }

      // Refresh matches
      await fetchMatches();
    } catch (error) {
      console.error('Error generating matches:', error);
    }
  };

  return {
    matches,
    loading,
    generateMatches,
    refetch: fetchMatches
  };
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};