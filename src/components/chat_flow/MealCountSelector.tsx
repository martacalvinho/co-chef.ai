import React from 'react';

interface MealCountSelectorProps {
  selectedMealsPerDay: number;
  onSelectMealsPerDay: (count: number) => void;
}

export const MealCountSelector: React.FC<MealCountSelectorProps> = ({
  selectedMealsPerDay,
  onSelectMealsPerDay
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">How many meals per day would you like me to plan?</p>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((count) => (
          <button
            key={count}
            onClick={() => onSelectMealsPerDay(count)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="text-2xl font-bold text-primary-600">{count}</div>
            <div className="text-sm text-gray-600">meal{count > 1 ? 's' : ''}</div>
          </button>
        ))}
      </div>
    </div>
  );
};