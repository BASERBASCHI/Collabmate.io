import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const generateChatSuggestion = async (
  userMessage: string,
  senderName: string,
  receiverName: string,
  context?: string
): Promise<string> => {
  if (!genAI) {
    // Fallback suggestions when API key is not available
    const fallbackSuggestions = [
      "Great idea! This could be a perfect collaboration opportunity.",
      "I suggest scheduling a video call to discuss project details and timeline.",
      "Consider creating a shared GitHub repository to start collaborating on code.",
      "This project aligns well with both of your skill sets and interests.",
      "Have you considered using agile methodology for this project?",
      "What's your preferred tech stack for this collaboration?"
    ];
    return fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are CollabMate AI, an intelligent assistant helping students and developers collaborate on projects. 

Context:
- ${senderName} just sent a message to ${receiverName}
- Message: "${userMessage}"
- This is a professional collaboration platform for finding teammates and working on projects together
${context ? `- Additional context: ${context}` : ''}

Generate a helpful, encouraging, and actionable suggestion that could help facilitate their collaboration. The suggestion should be:
- Professional and friendly
- Focused on collaboration and project success
- Actionable (suggesting next steps, tools, or approaches)
- Brief (1-2 sentences max)
- Relevant to the message content

Respond only with the suggestion, no additional formatting or explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text().trim();

    return suggestion || "Consider discussing your project goals and timeline to ensure successful collaboration.";
  } catch (error) {
    console.error('Error generating Gemini suggestion:', error);
    
    // Fallback to contextual suggestions based on message content
    const message = userMessage.toLowerCase();
    if (message.includes('project') || message.includes('build')) {
      return "Consider creating a project roadmap and defining roles for each team member.";
    } else if (message.includes('meet') || message.includes('call')) {
      return "Great idea! Video calls are excellent for building team rapport and discussing complex topics.";
    } else if (message.includes('code') || message.includes('github')) {
      return "Setting up a shared repository with clear contribution guidelines will help streamline your workflow.";
    } else {
      return "This sounds like a great opportunity for collaboration. What are your next steps?";
    }
  }
};

export const generateProjectSuggestion = async (
  userSkills: string[],
  userInterests?: string[]
): Promise<{
  title: string;
  description: string;
  technologies: string[];
  estimatedTime: string;
  reason: string;
}> => {
  if (!genAI) {
    // Fallback project suggestions
    const fallbackProjects = [
      {
        title: "AI Resume Parser",
        description: "Build a tool that extracts and categorizes information from resumes using NLP",
        technologies: ["Python", "NLP", "Flask"],
        estimatedTime: "2-3 weeks",
        reason: "Suggested based on your technical skills and current market demand"
      },
      {
        title: "Collaborative Task Manager",
        description: "Create a real-time task management app for team collaboration",
        technologies: ["React", "Node.js", "Socket.io"],
        estimatedTime: "3-4 weeks",
        reason: "Perfect for showcasing full-stack development skills"
      }
    ];
    return fallbackProjects[Math.floor(Math.random() * fallbackProjects.length)];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Generate a project suggestion for a developer/student with these skills: ${userSkills.join(', ')}
${userInterests ? `Interests: ${userInterests.join(', ')}` : ''}

Create a project that:
- Utilizes their existing skills
- Is achievable in 2-6 weeks
- Would be impressive for a portfolio
- Encourages collaboration with others
- Addresses a real-world problem

Respond in this exact JSON format:
{
  "title": "Project Name",
  "description": "Brief description of what the project does",
  "technologies": ["tech1", "tech2", "tech3"],
  "estimatedTime": "X-Y weeks",
  "reason": "Why this project is suggested for this person"
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      const suggestion = JSON.parse(text);
      return suggestion;
    } catch (parseError) {
      console.error('Error parsing Gemini project suggestion:', parseError);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error generating project suggestion:', error);
    
    // Fallback based on skills
    const hasWebSkills = userSkills.some(skill => 
      ['react', 'javascript', 'html', 'css', 'node.js'].includes(skill.toLowerCase())
    );
    
    if (hasWebSkills) {
      return {
        title: "Social Learning Platform",
        description: "Build a platform where students can share knowledge and collaborate on projects",
        technologies: ["React", "Node.js", "MongoDB"],
        estimatedTime: "4-5 weeks",
        reason: "Leverages your web development skills and addresses educational collaboration"
      };
    } else {
      return {
        title: "Skill Matching Algorithm",
        description: "Create an algorithm that matches people based on complementary skills",
        technologies: ["Python", "Machine Learning", "APIs"],
        estimatedTime: "3-4 weeks",
        reason: "Great for showcasing algorithmic thinking and problem-solving skills"
      };
    }
  }
};

export const generateGeminiResponse = async (
  question: string,
  context?: string
): Promise<string> => {
  if (!genAI) {
    // Fallback responses for common questions
    const fallbackResponses: { [key: string]: string } = {
      'teammate': "When looking for teammates, focus on complementary skills rather than identical ones. Look for people who share your passion for the project but bring different expertise. Good communication and similar work schedules are also crucial for successful collaboration.",
      'project': "Great projects solve real problems and use technologies you're excited to learn. Start with something achievable in 2-4 weeks, ensure it showcases your skills, and consider what would be valuable for your portfolio. Don't be afraid to put your own spin on existing ideas!",
      'collaboration': "Effective collaboration requires clear communication, defined roles, and regular check-ins. Use tools like Slack for daily communication, GitHub for code collaboration, and project management tools like Trello or Notion to track progress.",
      'timeline': "Break your project into weekly milestones. Week 1: Planning and setup, Week 2-3: Core development, Week 4: Testing and polish. Always add buffer time for unexpected challenges, and communicate early if you're falling behind schedule."
    };
    
    const questionLower = question.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (questionLower.includes(key)) {
        return response;
      }
    }
    
    return "That's a great question! While I'm having trouble connecting to my full knowledge base right now, I'd recommend discussing this with your teammates or checking out resources like GitHub, Stack Overflow, or developer communities for detailed guidance.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are Gemini AI, an intelligent assistant for CollabMate - a platform that helps developers and students find teammates and collaborate on projects.

User Question: "${question}"
${context ? `Context: ${context}` : ''}

Provide a helpful, actionable response that:
- Is specific to collaboration, teamwork, and project development
- Offers practical advice and next steps
- Is encouraging and supportive
- Is concise but comprehensive (2-4 sentences)
- Relates to the CollabMate platform when relevant

Focus on topics like:
- Finding and working with teammates
- Project planning and management
- Technical collaboration best practices
- Communication and workflow optimization
- Skill development and learning
- Career advice for developers/students

Respond in a friendly, professional tone as if you're a knowledgeable mentor.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || "I'd be happy to help! Could you provide a bit more detail about what specific aspect you'd like guidance on?";
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Contextual fallback based on question content
    const questionLower = question.toLowerCase();
    if (questionLower.includes('team') || questionLower.includes('collaborate')) {
      return "Successful collaboration starts with clear communication and shared goals. Make sure everyone understands their role, set up regular check-ins, and use collaborative tools like GitHub for code sharing and Slack for communication.";
    } else if (questionLower.includes('project') || questionLower.includes('idea')) {
      return "Great projects solve real problems and showcase your skills. Start with something achievable, consider your target audience, and don't be afraid to iterate on your initial idea based on feedback from potential users.";
    } else if (questionLower.includes('skill') || questionLower.includes('learn')) {
      return "Focus on building projects that stretch your current skills while being achievable. Pair programming with teammates is a great way to learn, and don't hesitate to ask questions - the development community is generally very helpful!";
    } else {
      return "That's an interesting question! For the best guidance, I'd recommend discussing this with experienced developers in your network or checking out resources like developer communities, documentation, and tutorials specific to your technology stack.";
    }
  }
};