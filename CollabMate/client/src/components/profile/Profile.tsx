import React from 'react';
import { ArrowLeft, Edit, TrendingUp } from 'lucide-react';
import { User } from '../../types';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const handleEditProfile = () => {
    alert('✏️ Edit Profile\n\nThis would open a comprehensive profile editor where you can:\n• Update your bio and skills\n• Modify work preferences\n• Add new projects\n• Update availability\n• Change profile picture');
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <button 
          onClick={handleEditProfile}
          className="flex items-center space-x-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Edit className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-lg text-gray-600">{user.title}</p>
            </div>
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              Profile Strength: {user.profileStrength}%
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="space-y-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">About</h2>
          <p className="text-gray-700">{user.about}</p>
        </div>

        {/* Skills Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Frontend</h3>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">React</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">JavaScript</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">HTML/CSS</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">TailwindCSS</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Backend</h3>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Node.js</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Python</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Express</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Databases</h3>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">MongoDB</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Firebase</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Work Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Availability</h3>
              <p className="text-sm text-gray-600">{user.preferences.availability}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Timezone</h3>
              <p className="text-sm text-gray-600">{user.preferences.timezone}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Preferred Roles</h3>
              <p className="text-sm text-gray-600">{user.preferences.roles.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Communication Style</h3>
              <p className="text-sm text-gray-600">{user.preferences.communication}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Hackathon Preference</h3>
              <p className="text-sm text-gray-600">{user.preferences.hackathonPreference}</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Projects</h2>
          <div className="space-y-4">
            {user.projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{project.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : project.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'completed' ? 'Completed' : 
                     project.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};