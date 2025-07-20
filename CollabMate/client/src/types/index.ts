export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  avatar: string;
  skills: string[];
  location?: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  interests: string[];
  experience: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  isProfileComplete: boolean;
  preferences: {
    availability: string;
    timezone: string;
    roles: string[];
    communication: string;
    hackathonPreference: string;
    remoteWork: boolean;
    maxDistance?: number; // in km for local collaboration
    workStyle: string[];
    personalityTags: string[];
    codingHours: string;
    collaborationStyle: string;
    projectPace: string;
  };
  profileStrength: number;
  about: string;
  projects: Project[];
  createdAt: string;
  lastActive: string;
  createdAt: string;
  lastActive: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Match {
  id: string;
  user: User;
  compatibility: number;
  reason: string;
  commonSkills: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  type: 'user' | 'ai-suggestion';
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  estimatedTime: string;
  suggestedTeammates: number;
  reason: string;
}

export type ViewType = 'dashboard' | 'profile' | 'chat';