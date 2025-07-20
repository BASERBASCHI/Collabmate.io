import React from 'react';
import { Clock, Users } from 'lucide-react';
import { ProjectSuggestion as ProjectSuggestionType } from '../../types';

interface ProjectSuggestionProps {
  suggestion: ProjectSuggestionType;
  onFindTeam: () => void;
}

export const ProjectSuggestion: React.FC<ProjectSuggestionProps> = ({ suggestion, onFindTeam }) => {
  const handleFindTeam = () => {
    alert(`🎯 Finding team for "${suggestion.title}"\n\nSearching for ${suggestion.suggestedTeammates} teammates with skills in:\n${suggestion.technologies.join(', ')}\n\nEstimated project duration: ${suggestion.estimatedTime}`);
    onFindTeam();
  };
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 mb-2">{suggestion.title}</h4>
          <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestion.technologies.map((tech, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              Estimated time: {suggestion.estimatedTime}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              {suggestion.suggestedTeammates} potential teammates
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-xs text-gray-500">{suggestion.reason}</p>
          </div>
        </div>
        
        <button
          onClick={handleFindTeam}
          className="ml-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Find Team
        </button>
      </div>
    </div>
  );
};