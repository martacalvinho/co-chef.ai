import React from 'react';
import { Users, Clock, RefreshCw, Check, Share, Zap } from 'lucide-react';
import { WeekData } from './types';

interface WeeklyMealOptionsProps {
  weekData: WeekData;
  onRefreshMeal: (mealIndex: number) => void;
  onAcceptMenu: () => void;
  isLoading?: boolean;
}

export const WeeklyMealOptions: React.FC<WeeklyMealOptionsProps> = ({
  weekData,
  onRefreshMeal,
  onAcceptMenu,
  isLoading = false
}) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  // Calculate total calories for the week
  const totalWeeklyCalories = weekData.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const avgCaloriesPerMeal = Math.round(totalWeeklyCalories / weekData.meals.length);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Week of {formatDate(weekData.weekStartDate)}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">{weekData.planType}</span>
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{weekData.peopleCount} people</span>
              </span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{weekData.skillLevel}</span>
              <span className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded">
                <Zap className="w-3 h-3" />
                <span>{totalWeeklyCalories.toLocaleString()} cal/week</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => {}}
            className="p-2 text-gray-400 hover:text-secondary-600 transition-colors"
            title="Share menu"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Here's a weekly meal plan with {weekData.mealsPerDay} meal{weekData.mealsPerDay > 1 ? 's' : ''} per day for {weekData.peopleCount} people, focused on {weekData.planType} at {weekData.skillLevel.toLowerCase()} difficulty. Average {avgCaloriesPerMeal} calories per meal. You can refresh individual meals if you don't like them, then accept to generate your shopping list:
        </p>

        <div className="space-y-3">
          {weekData.meals.map((meal, index) => {
            const dayIndex = Math.floor(index / weekData.mealsPerDay);
            const mealTypeIndex = index % weekData.mealsPerDay;
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
            
            return (
              <div key={index} className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {days[dayIndex]} {mealTypes[mealTypeIndex]}: {meal.name}
                      </h4>
                      <button
                        onClick={() => onRefreshMeal(index)}
                        disabled={isLoading}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary-600 transition-all disabled:opacity-50"
                        title="Refresh this meal"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{meal.cookTime}min</span>
                      </span>
                      <span>{meal.servings} servings</span>
                      <span className="flex items-center space-x-1 bg-orange-50 text-orange-600 px-2 py-1 rounded">
                        <Zap className="w-3 h-3" />
                        <span>{meal.calories} cal</span>
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        meal.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        meal.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {meal.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onAcceptMenu}
            disabled={isLoading}
            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Accept & Generate Shopping List</span>
          </button>
          <button
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Share with Partner
          </button>
        </div>
      </div>
    </div>
  );
};