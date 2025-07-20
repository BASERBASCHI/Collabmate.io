import React from 'react';
import { useState, useEffect } from 'react';
import { Users, MessageCircle, Lightbulb, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import { User, ProjectSuggestion as ProjectSuggestionType } from '../../types';
import { StatsCard } from './StatsCard';
import { MatchCard } from './MatchCard';
import { ProjectSuggestion } from './ProjectSuggestion';
import { useFirebaseMatches } from '../../hooks/useFirebaseMatches';
import { generateProjectSuggestion } from '../../lib/gemini';

interface DashboardProps {
  user: User;
  onViewProfile: () => void;
  onSendMessage: () => void;
  onRefresh: () => void;
  onAskGemini: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onViewProfile,
  onSendMessage,
  onRefresh,
  onAskGemini
}) => {
  const { matches, loading: matchesLoading, generateMatches } = useFirebaseMatches(user.id);
  const [projectSuggestions, setProjectSuggestions] = useState<ProjectSuggestionType[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Generate AI project suggestions on component mount
  useEffect(() => {
    generateAIProjectSuggestions();
  }, [user.skills]);

  const generateAIProjectSuggestions = async () => {
    setLoadingProjects(true);
    try {
      const suggestions = await Promise.all([
        generateProjectSuggestion(user.skills),
        generateProjectSuggestion(user.skills)
      ]);

      const formattedSuggestions: ProjectSuggestionType[] = suggestions.map((suggestion, index) => ({
        id: `ai-${index + 1}`,
        title: suggestion.title,
        description: suggestion.description,
        technologies: suggestion.technologies,
        estimatedTime: suggestion.estimatedTime,
        suggestedTeammates: Math.floor(Math.random() * 5) + 2, // Random 2-6 teammates
        reason: suggestion.reason
      }));

      setProjectSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error generating project suggestions:', error);
      // Fallback to default suggestions
      setProjectSuggestions([
        {
          id: '1',
          title: 'AI Resume Parser',
          description: 'Build a tool that extracts and categorizes information from resumes using NLP',
          technologies: ['Python', 'NLP', 'Flask'],
          estimatedTime: '2-3 weeks',
          suggestedTeammates: 5,
          reason: 'Suggested based on your skills and 5 potential teammates'
        }
      ]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleRefresh = async () => {
    try {
      onRefresh();
      await generateMatches();
      await generateAIProjectSuggestions();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Dashboard</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={onAskGemini}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask Gemini</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Potential Matches" value={matches.length.toString()} icon={Users} color="indigo" />
          <StatsCard title="Active Chats" value="7" icon={MessageCircle} color="purple" />
          <StatsCard title="Active Projects" value="3" icon={Lightbulb} color="green" />
        </div>

        {/* Top Matches */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Top AI-Generated Matches</h3>
          {matchesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Finding your perfect matches...</p>
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.slice(0, 4).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onViewProfile={onViewProfile}
                  onSendMessage={onSendMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No matches found yet</p>
              <button
                onClick={generateMatches}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Generate Matches
              </button>
            </div>
          )}
        </div>

        {/* Project Suggestions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">AI-Generated Project Suggestions</h3>
            <button 
              onClick={generateAIProjectSuggestions}
              className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
              <span>Refresh Suggestions</span>
            </button>
          </div>
          {loadingProjects ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Generating AI project suggestions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projectSuggestions.map((suggestion) => (
                <ProjectSuggestion
                  key={suggestion.id}
                  suggestion={suggestion}
                  onFindTeam={() => console.log('Find team for', suggestion.title)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};