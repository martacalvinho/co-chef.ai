import React from 'react';

interface CookingLevelSelectorProps {
  selectedSkillLevel: string;
  onSelectSkillLevel: (level: string) => void;
}

const SKILL_LEVELS = [
  { 
    level: 'Easy', 
    description: 'Simple recipes, 15-30 minutes', 
    timeRange: '15-30 min',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  { 
    level: 'Medium', 
    description: 'Moderate complexity, 30-60 minutes', 
    timeRange: '30-60 min',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  { 
    level: 'Hard', 
    description: 'Advanced techniques, 60+ minutes', 
    timeRange: '60+ min',
    color: 'bg-red-100 text-red-700 border-red-200'
  }
];

export const CookingLevelSelector: React.FC<CookingLevelSelectorProps> = ({
  selectedSkillLevel,
  onSelectSkillLevel
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">What's your cooking skill level?</p>
      <div className="space-y-3">
        {SKILL_LEVELS.map((skill) => (
          <button
            key={skill.level}
            onClick={() => onSelectSkillLevel(skill.level)}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{skill.level}</div>
                <div className="text-sm text-gray-600">{skill.description}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm border ${skill.color}`}>
                {skill.timeRange}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};