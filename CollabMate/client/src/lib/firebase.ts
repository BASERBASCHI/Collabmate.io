import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6YwCfTn79hYO0iEBGbKU-TqvABUQiE_U",
  authDomain: "collabmate-1b221.firebaseapp.com",
  projectId: "collabmate-1b221",
  storageBucket: "collabmate-1b221.firebasestorage.app",
  messagingSenderId: "420991959380",
  appId: "1:420991959380:web:4fe9203020b5d1953fc8c1",
  measurementId: "G-SSNSGGCZVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  MATCHES: 'matches',
  MESSAGES: 'messages',
  PROJECTS: 'projects'
};

// Firebase types
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isProfileComplete?: boolean;
  profileStrength?: number;
}

export interface FirebaseMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'suggestion';
}

export interface FirebaseMatch {
  id: string;
  userId: string;
  matchedUserId: string;
  score: number;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Date;
}

export default app;