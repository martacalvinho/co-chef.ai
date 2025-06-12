import React, { useState } from 'react';
import { Coffee, Sun, Moon, Cookie } from 'lucide-react';

interface MealPreferenceSelectorProps {
  selectedMealsPerDay: number;
  selectedPreferences: string[];
  onSelectPreferences: (preferences: string[]) => void;
}

const MEAL_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, description: 'Start your day right' },
  { id: 'lunch', label: 'Lunch', icon: Sun, description: 'Midday fuel' },
  { id: 'dinner', label: 'Dinner', icon: Moon, description: 'Evening satisfaction' },
  { id: 'snack', label: 'Snack', icon: Cookie, description: 'Between-meal treats' }
];

export const MealPreferenceSelector: React.FC<MealPreferenceSelectorProps> = ({
  selectedMealsPerDay,
  selectedPreferences,
  onSelectPreferences
}) => {
  const [tempPreferences, setTempPreferences] = useState<string[]>(selectedPreferences);

  const handleTogglePreference = (mealId: string) => {
    const newPreferences = tempPreferences.includes(mealId)
      ? tempPreferences.filter(id => id !== mealId)
      : [...tempPreferences, mealId];
    
    setTempPreferences(newPreferences);
  };

  const handleConfirm = () => {
    if (tempPreferences.length === selectedMealsPerDay) {
      onSelectPreferences(tempPreferences);
    }
  };

  const isSelectionComplete = tempPreferences.length === selectedMealsPerDay;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-700 mb-2">
          Which {selectedMealsPerDay} meal{selectedMealsPerDay > 1 ? 's' : ''} would you like me to plan?
        </p>
        <p className="text-sm text-gray-500">
          Select exactly {selectedMealsPerDay} meal{selectedMealsPerDay > 1 ? 's' : ''} from the options below
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {MEAL_OPTIONS.map((meal) => {
          const Icon = meal.icon;
          const isSelected = tempPreferences.includes(meal.id);
          const isDisabled = !isSelected && tempPreferences.length >= selectedMealsPerDay;
          
          return (
            <button
              key={meal.id}
              onClick={() => !isDisabled && handleTogglePreference(meal.id)}
              disabled={isDisabled}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-25'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSelected
                    ? 'bg-primary-500 text-white'
                    : isDisabled
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{meal.label}</div>
                  <div className="text-sm opacity-75">{meal.description}</div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="text-center">
        <div className="mb-3">
          <span className="text-sm text-gray-600">
            Selected: {tempPreferences.length} of {selectedMealsPerDay}
          </span>
        </div>
        
        <button
          onClick={handleConfirm}
          disabled={!isSelectionComplete}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isSelectionComplete
              ? 'bg-primary-500 hover:bg-primary-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with Selected Meals
        </button>
      </div>
    </div>
  );
};