import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateChatSuggestion, generateProjectSuggestion, generateGeminiResponse } from "./gemini";
import { insertProjectSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Transform database user to frontend format
      const userProfile = {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        title: user.title || '',
        avatar: user.profileImageUrl || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        skills: user.skills || [],
        interests: user.interests || [],
        experience: user.experience || 'Beginner',
        github: user.github,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
        location: user.location,
        isProfileComplete: user.isProfileComplete || false,
        preferences: user.preferences || {
          availability: '',
          timezone: '',
          roles: [],
          communication: '',
          hackathonPreference: '',
          remoteWork: true,
          workStyle: [],
          personalityTags: [],
          codingHours: '',
          collaborationStyle: '',
          projectPace: ''
        },
        profileStrength: user.profileStrength || 20,
        about: user.bio || '',
        projects: [],
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        lastActive: user.updatedAt?.toISOString() || new Date().toISOString(),
      };

      // Get user's projects
      const projects = await storage.getUserProjects(userId);
      userProfile.projects = projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        technologies: p.technologies || [],
        status: p.status as 'completed' | 'in-progress' | 'planned'
      }));

      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      // Transform frontend format to database format
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.skills) dbUpdates.skills = updates.skills;
      if (updates.interests) dbUpdates.interests = updates.interests;
      if (updates.experience) dbUpdates.experience = updates.experience;
      if (updates.github) dbUpdates.github = updates.github;
      if (updates.linkedin) dbUpdates.linkedin = updates.linkedin;
      if (updates.portfolio) dbUpdates.portfolio = updates.portfolio;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.preferences) dbUpdates.preferences = updates.preferences;
      if (updates.isProfileComplete !== undefined) dbUpdates.isProfileComplete = updates.isProfileComplete;
      if (updates.profileStrength !== undefined) dbUpdates.profileStrength = updates.profileStrength;

      const updatedUser = await storage.updateUser(userId, dbUpdates);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Get user matches
  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getUserMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Generate project suggestion using Gemini
  app.post('/api/gemini/project-suggestion', isAuthenticated, async (req: any, res) => {
    try {
      const { skills, interests } = req.body;
      const suggestion = await generateProjectSuggestion(skills || [], interests);
      res.json(suggestion);
    } catch (error) {
      console.error("Error generating project suggestion:", error);
      res.status(500).json({ message: "Failed to generate project suggestion" });
    }
  });

  // Generate chat suggestion using Gemini
  app.post('/api/gemini/chat-suggestion', isAuthenticated, async (req: any, res) => {
    try {
      const { message, senderName, receiverName, context } = req.body;
      const suggestion = await generateChatSuggestion(message, senderName, receiverName, context);
      res.json({ suggestion });
    } catch (error) {
      console.error("Error generating chat suggestion:", error);
      res.status(500).json({ message: "Failed to generate chat suggestion" });
    }
  });

  // Ask Gemini endpoint - Public for Firebase auth users
  app.post('/api/gemini/ask', async (req: any, res) => {
    try {
      const { question, context } = req.body;
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }
      
      const response = await generateGeminiResponse(question, context);
      res.json({ response });
    } catch (error) {
      console.error("Error with Gemini ask:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Create project
  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedProject = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(validatedProject);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Get chat messages
  app.get('/api/messages/:partnerId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partnerId = req.params.partnerId;
      const messages = await storage.getChatMessages(userId, partnerId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedMessage = insertMessageSchema.parse({ ...req.body, senderId: userId });
      const message = await storage.createMessage(validatedMessage);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
