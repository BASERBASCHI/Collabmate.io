import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy,
  limit,
  getDocs,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, COLLECTIONS, FirebaseUser } from '../lib/firebase';
import { User } from '../types';

export const useFirebaseUsers = (currentUserId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentUserId]);

  const fetchUsers = async (loadMore = false) => {
    try {
      setLoading(true);
      
      let usersQuery = query(
        collection(db, COLLECTIONS.USERS),
        orderBy('lastActive', 'desc'),
        limit(20)
      );

      // Exclude current user
      if (currentUserId) {
        usersQuery = query(
          collection(db, COLLECTIONS.USERS),
          where('uid', '!=', currentUserId),
          orderBy('lastActive', 'desc'),
          limit(20)
        );
      }

      // For pagination
      if (loadMore && lastDoc) {
        usersQuery = query(
          collection(db, COLLECTIONS.USERS),
          where('uid', '!=', currentUserId || ''),
          orderBy('lastActive', 'desc'),
          startAfter(lastDoc),
          limit(20)
        );
      }

      const snapshot = await getDocs(usersQuery);
      const fetchedUsers: User[] = [];

      snapshot.docs.forEach(doc => {
        const userData = doc.data() as FirebaseUser;
        
        fetchedUsers.push({
          id: userData.uid,
          name: userData.displayName || 'Anonymous User',
          email: userData.email,
          title: userData.title || 'Developer',
          avatar: userData.photoURL || generateRealisticAvatar(userData.displayName || 'User', userData.email),
          skills: userData.skills || [],
          interests: userData.interests || [],
          experience: userData.experience || 'Beginner',
          github: userData.github,
          linkedin: userData.linkedin,
          portfolio: userData.portfolio,
          location: userData.location,
          isProfileComplete: userData.isProfileComplete || false,
          preferences: {
            availability: userData.availability || 'Weekends',
            timezone: userData.timezone || 'UTC',
            roles: userData.preferredRoles || [],
            communication: userData.communicationStyle || 'Slack',
            hackathonPreference: userData.hackathonPreference || 'Virtual',
            remoteWork: userData.remoteWork || true,
            maxDistance: userData.maxDistance,
            workStyle: userData.workStyle || [],
            personalityTags: userData.personalityTags || [],
            codingHours: userData.codingHours || '',
            collaborationStyle: userData.collaborationStyle || '',
            projectPace: userData.projectPace || ''
          },
          profileStrength: userData.profileStrength || 75,
          about: userData.bio || '',
          projects: [], // Will be fetched separately if needed
          createdAt: userData.createdAt ? new Date(userData.createdAt.toDate()).toISOString() : new Date().toISOString(),
          lastActive: userData.lastActive ? new Date(userData.lastActive.toDate()).toISOString() : new Date().toISOString()
        });
      });

      if (loadMore) {
        setUsers(prev => [...prev, ...fetchedUsers]);
      } else {
        setUsers(fetchedUsers);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to empty array
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = () => {
    if (hasMore && !loading) {
      fetchUsers(true);
    }
  };

  const filterUsersByLocation = (maxDistance: number, userLocation?: { lat: number; lng: number }) => {
    if (!userLocation) return users;

    return users.filter(user => {
      if (!user.location?.coordinates) return false;
      
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        user.location.coordinates.lat,
        user.location.coordinates.lng
      );
      
      return distance <= maxDistance;
    });
  };

  const filterUsersBySkills = (skills: string[]) => {
    return users.filter(user => 
      skills.some(skill => 
        user.skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  };

  const filterUsersByInterests = (interests: string[]) => {
    return users.filter(user => 
      interests.some(interest => 
        user.interests.some(userInterest => 
          userInterest.toLowerCase().includes(interest.toLowerCase())
        )
      )
    );
  };

  return {
    users,
    loading,
    hasMore,
    fetchUsers: () => fetchUsers(false),
    loadMoreUsers,
    filterUsersByLocation,
    filterUsersBySkills,
    filterUsersByInterests
  };
};

// Generate realistic avatars based on user info
const generateRealisticAvatar = (name: string, email: string): string => {
  const avatars = [
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  ];
  
  // Use email hash to consistently assign same avatar to same user
  const hash = email.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return avatars[Math.abs(hash) % avatars.length];
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