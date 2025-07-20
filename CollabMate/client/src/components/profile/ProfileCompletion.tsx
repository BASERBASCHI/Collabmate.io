import React, { useState } from 'react';
import { MapPin, Github, Linkedin, Globe, Plus, X, CheckCircle } from 'lucide-react';
import { User } from '../../types';
import { apiRequest, queryClient } from '../../lib/queryClient';

interface ProfileCompletionProps {
  user: User;
  onClose: () => void;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  user,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: user.title || '',
    bio: user.about || '',
    skills: user.skills || [],
    interests: user.interests || [],
    experience: user.experience || 'Beginner',
    github: user.github || '',
    linkedin: user.linkedin || '',
    portfolio: user.portfolio || '',
    location: {
      city: user.location?.city || '',
      country: user.location?.country || ''
    },
    preferences: {
      availability: user.preferences.availability || '',
      timezone: user.preferences.timezone || '',
      roles: user.preferences.roles || [],
      communication: user.preferences.communication || '',
      hackathonPreference: user.preferences.hackathonPreference || '',
      remoteWork: user.preferences.remoteWork || true,
      maxDistance: user.preferences.maxDistance || 50,
      workStyle: user.preferences.workStyle || [],
      personalityTags: user.preferences.personalityTags || [],
      codingHours: user.preferences.codingHours || '',
      collaborationStyle: user.preferences.collaborationStyle || '',
      projectPace: user.preferences.projectPace || ''
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newTag, setNewTag] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const skillSuggestions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'Go',
    'Machine Learning', 'Data Science', 'UI/UX Design', 'Mobile Development',
    'DevOps', 'Cloud Computing', 'Blockchain', 'Cybersecurity'
  ];

  const interestSuggestions = [
    'Web Development', 'Mobile Apps', 'AI/ML', 'Game Development', 'IoT',
    'Fintech', 'Healthcare Tech', 'EdTech', 'E-commerce', 'Social Impact',
    'Sustainability', 'AR/VR', 'Robotics', 'Data Visualization'
  ];

  const personalityTagSuggestions = [
    '🦉 Night Owl', '🌅 Early Bird', '☕ Coffee Addict', '🎵 Music Lover',
    '🎮 Gamer', '📚 Bookworm', '🏃 Fitness Enthusiast', '🎨 Creative',
    '🤖 Tech Geek', '🌱 Eco-Friendly', '🍕 Pizza Lover', '🎭 Meme Lord',
    '🧘 Zen Coder', '⚡ Speed Demon', '🔍 Detail Oriented', '💡 Idea Generator',
    '🎯 Goal Crusher', '🤝 Team Player', '🦄 Unicorn Hunter', '🚀 Startup Enthusiast'
  ];

  const workStyleOptions = [
    'Agile/Scrum', 'Waterfall', 'Kanban', 'Pair Programming', 
    'Solo Deep Work', 'Mob Programming', 'Test-Driven Development',
    'Rapid Prototyping', 'Documentation Heavy', 'Code Review Focused'
  ];

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
  };

  const addPersonalityTag = (tag: string) => {
    if (tag && !formData.preferences.personalityTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          personalityTags: [...prev.preferences.personalityTags, tag]
        }
      }));
    }
    setNewTag('');
  };

  const removePersonalityTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        personalityTags: prev.preferences.personalityTags.filter(tag => tag !== tagToRemove)
      }
    }));
  };

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const calculateProfileStrength = () => {
    let strength = 20; // Base strength
    
    if (formData.title) strength += 10;
    if (formData.bio) strength += 15;
    if (formData.skills.length > 0) strength += 20;
    if (formData.interests.length > 0) strength += 15;
    if (formData.location.city && formData.location.country) strength += 10;
    if (formData.github || formData.linkedin || formData.portfolio) strength += 10;
    if (formData.preferences.personalityTags.length > 0) strength += 5;
    if (formData.preferences.workStyle.length > 0) strength += 5;
    if (formData.preferences.codingHours) strength += 5;
    
    return Math.min(strength, 100);
  };

  const handleSubmit = async () => {
    const profileStrength = calculateProfileStrength();
    const isComplete = profileStrength >= 80;

    // Get coordinates for location if provided
    let coordinates = undefined;
    if (formData.location.city && formData.location.country) {
      try {
        // In a real app, you'd use a geocoding service like Google Maps API
        // For demo, we'll use approximate coordinates
        coordinates = await getCoordinatesForLocation(formData.location.city, formData.location.country);
      } catch (error) {
        console.log('Could not get coordinates for location');
      }
    }

    const updates = {
      title: formData.title,
      bio: formData.bio,
      skills: formData.skills,
      interests: formData.interests,
      experience: formData.experience,
      github: formData.github,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      location: coordinates ? {
        ...formData.location,
        coordinates
      } : formData.location,
      availability: formData.preferences.availability,
      timezone: formData.preferences.timezone,
      preferredRoles: formData.preferences.roles,
      communicationStyle: formData.preferences.communication,
      hackathonPreference: formData.preferences.hackathonPreference,
      remoteWork: formData.preferences.remoteWork,
      maxDistance: formData.preferences.maxDistance,
      workStyle: formData.preferences.workStyle,
      personalityTags: formData.preferences.personalityTags,
      codingHours: formData.preferences.codingHours,
      collaborationStyle: formData.preferences.collaborationStyle,
      projectPace: formData.preferences.projectPace,
      profileStrength,
      isProfileComplete: isComplete
    };

    onUpdateProfile(updates);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Full Stack Developer, Data Scientist"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About You
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell others about your background, goals, and what you're passionate about..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level
        </label>
        <select
          value={formData.experience}
          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Beginner">Beginner (0-1 years)</option>
          <option value="Intermediate">Intermediate (1-3 years)</option>
          <option value="Advanced">Advanced (3-5 years)</option>
          <option value="Expert">Expert (5+ years)</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Technologies
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
          />
          <button
            onClick={() => addSkill(newSkill)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillSuggestions.filter(skill => !formData.skills.includes(skill)).slice(0, 8).map((skill) => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests & Project Areas
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              {interest}
              <button
                onClick={() => removeInterest(interest)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && addInterest(newInterest)}
          />
          <button
            onClick={() => addInterest(newInterest)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {interestSuggestions.filter(interest => !formData.interests.includes(interest)).slice(0, 8).map((interest) => (
            <button
              key={interest}
              onClick={() => addInterest(interest)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
            >
              + {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            City
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, city: e.target.value }
            }))}
            placeholder="e.g., San Francisco"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={formData.location.country}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              location: { ...prev.location, country: e.target.value }
            }))}
            placeholder="e.g., United States"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Distance for Local Collaboration (km)
        </label>
        <input
          type="range"
          min="5"
          max="500"
          value={formData.preferences.maxDistance}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, maxDistance: parseInt(e.target.value) }
          }))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>5 km</span>
          <span>{formData.preferences.maxDistance} km</span>
          <span>500 km</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Github className="inline h-4 w-4 mr-1" />
            GitHub
          </label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Linkedin className="inline h-4 w-4 mr-1" />
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Portfolio
          </label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
            placeholder="https://yourportfolio.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Personality Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Personality Tags (What describes you?)
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.preferences.personalityTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => removePersonalityTag(tag)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a personality tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && addPersonalityTag(newTag)}
          />
          <button
            onClick={() => addPersonalityTag(newTag)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {personalityTagSuggestions.filter(tag => !formData.preferences.personalityTags.includes(tag)).slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => addPersonalityTag(tag)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Coding Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When do you code best?
        </label>
        <select
          value={formData.preferences.codingHours}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, codingHours: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select your peak hours</option>
          <option value="🌅 Early Morning (5-9 AM)">🌅 Early Morning (5-9 AM)</option>
          <option value="☀️ Morning (9 AM-12 PM)">☀️ Morning (9 AM-12 PM)</option>
          <option value="🌞 Afternoon (12-5 PM)">🌞 Afternoon (12-5 PM)</option>
          <option value="🌆 Evening (5-9 PM)">🌆 Evening (5-9 PM)</option>
          <option value="🦉 Night Owl (9 PM-1 AM)">🦉 Night Owl (9 PM-1 AM)</option>
          <option value="🌙 Late Night (1-5 AM)">🌙 Late Night (1-5 AM)</option>
          <option value="🔄 Flexible/Anytime">🔄 Flexible/Anytime</option>
        </select>
      </div>

      {/* Work Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Work Styles (Select multiple)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {workStyleOptions.map((style) => (
            <label key={style} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.workStyle.includes(style)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        workStyle: [...prev.preferences.workStyle, style]
                      }
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        workStyle: prev.preferences.workStyle.filter(s => s !== style)
                      }
                    }));
                  }
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Collaboration Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Collaboration Style
        </label>
        <select
          value={formData.preferences.collaborationStyle}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, collaborationStyle: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select collaboration style</option>
          <option value="🤝 Highly Collaborative">🤝 Highly Collaborative</option>
          <option value="⚖️ Balanced Team/Solo">⚖️ Balanced Team/Solo</option>
          <option value="🎯 Independent with Check-ins">🎯 Independent with Check-ins</option>
          <option value="👥 Pair Programming Lover">👥 Pair Programming Lover</option>
          <option value="🧘 Solo Deep Work">🧘 Solo Deep Work</option>
        </select>
      </div>

      {/* Project Pace */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Pace Preference
        </label>
        <select
          value={formData.preferences.projectPace}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, projectPace: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select project pace</option>
          <option value="🚀 Fast & Furious">🚀 Fast & Furious</option>
          <option value="⚡ Quick Sprints">⚡ Quick Sprints</option>
          <option value="🎯 Steady Progress">🎯 Steady Progress</option>
          <option value="🐌 Slow & Steady">🐌 Slow & Steady</option>
          <option value="🔄 Flexible Pace">🔄 Flexible Pace</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <select
            value={formData.preferences.availability}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              preferences: { ...prev.preferences, availability: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select availability</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Weekends">Weekends only</option>
            <option value="Evenings">Evenings</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={formData.preferences.timezone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              preferences: { ...prev.preferences, timezone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select timezone</option>
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">GMT (UTC+0)</option>
            <option value="UTC+1">Central European Time (UTC+1)</option>
            <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
            <option value="UTC+8">China Standard Time (UTC+8)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Communication
        </label>
        <select
          value={formData.preferences.communication}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, communication: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select communication style</option>
          <option value="Slack">Slack</option>
          <option value="Discord">Discord</option>
          <option value="Email">Email</option>
          <option value="Video calls">Video calls</option>
          <option value="In-person">In-person meetings</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hackathon Preference
        </label>
        <select
          value={formData.preferences.hackathonPreference}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, hackathonPreference: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select preference</option>
          <option value="Virtual">Virtual hackathons</option>
          <option value="In-person">In-person hackathons</option>
          <option value="Both">Both virtual and in-person</option>
          <option value="None">Not interested in hackathons</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="remoteWork"
          checked={formData.preferences.remoteWork}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, remoteWork: e.target.checked }
          }))}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="remoteWork" className="ml-2 block text-sm text-gray-700">
          Open to remote collaboration
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Profile Strength:</span>
              <span className="font-bold text-indigo-600">{calculateProfileStrength()}%</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock function to get coordinates - in a real app, use Google Maps Geocoding API
const getCoordinatesForLocation = async (city: string, country: string) => {
  // This is a mock implementation
  // In production, you'd use a real geocoding service
  const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'san francisco,united states': { lat: 37.7749, lng: -122.4194 },
    'new york,united states': { lat: 40.7128, lng: -74.0060 },
    'london,united kingdom': { lat: 51.5074, lng: -0.1278 },
    'tokyo,japan': { lat: 35.6762, lng: 139.6503 },
    'bangalore,india': { lat: 12.9716, lng: 77.5946 },
    'berlin,germany': { lat: 52.5200, lng: 13.4050 }
  };
  
  const key = `${city.toLowerCase()},${country.toLowerCase()}`;
  return mockCoordinates[key] || { lat: 0, lng: 0 };
};