import React from 'react';
import { Check, Star, Calendar, Heart, Zap, TrendingUp } from 'lucide-react';
import { WeekData } from './types';

interface EndWeekSummaryProps {
  weekData: WeekData;
  ratings: Record<number, { rating: number; notes: string }>;
  completedCount: number;
  leftoverIngredients: string[];
  onSaveWeek: () => void;
  onViewSavedMenus: () => void;
  onLeftoverSuggestions: () => void;
  onCreateFromFavorites: () => void;
}

export const EndWeekSummary: React.FC<EndWeekSummaryProps> = ({
  weekData,
  ratings,
  completedCount,
  leftoverIngredients,
  onSaveWeek,
  onViewSavedMenus,
  onLeftoverSuggestions,
  onCreateFromFavorites
}) => {
  const avgRating = Object.values(ratings).reduce((sum: number, r: any) => sum + r.rating, 0) / Object.keys(ratings).length;
  const completionRate = Math.round((completedCount / weekData.meals.length) * 100);
  const totalCalories = weekData.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const avgCaloriesPerDay = Math.round(totalCalories / 7);
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Week Complete! 🎉</h3>
        <p className="text-gray-700 mb-4">
          You completed {completedCount} of {weekData.meals.length} meals ({completionRate}% completion rate) with an average rating of {avgRating.toFixed(1)} stars!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-600">Meals Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{avgRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalCalories.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{leftoverIngredients.length}</div>
            <div className="text-sm text-gray-600">Leftover Items</div>
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-orange-900 mb-2 flex items-center justify-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Weekly Nutrition Summary</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-orange-700">Average per day:</span>
              <span className="font-medium text-orange-900 ml-2">{avgCaloriesPerDay} calories</span>
            </div>
            <div>
              <span className="text-orange-700">Total week:</span>
              <span className="font-medium text-orange-900 ml-2">{totalCalories.toLocaleString()} calories</span>
            </div>
          </div>
        </div>
        
        {leftoverIngredients.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-900 mb-2">What ingredients are left?</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {leftoverIngredients.slice(0, 6).map((ingredient, index) => (
                <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  {ingredient}
                </span>
              ))}
              {leftoverIngredients.length > 6 && (
                <span className="text-sm text-yellow-700">+{leftoverIngredients.length - 6} more</span>
              )}
            </div>
            <button
              onClick={onLeftoverSuggestions}
              className="text-sm text-yellow-700 hover:text-yellow-800 underline"
            >
              Get suggestions for using these leftovers
            </button>
          </div>
        )}
        
        {/* Enhanced End Week Message */}
        <div className="bg-white rounded-lg p-6 mb-6 text-left">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <span>Your meal plan has been completed!</span>
          </h4>
          <p className="text-gray-700 mb-4">You can now:</p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>Access this menu anytime in your History</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Reuse the entire week's plan</span>
            </li>
            <li className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Select favorite meals from this and other weeks to create a new plan</span>
            </li>
            <li className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Review nutrition data and meal ratings for insights</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSaveWeek}
              className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Save to History</span>
            </button>
            <button
              onClick={onCreateFromFavorites}
              className="bg-secondary-500 hover:bg-secondary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Create from Favorites</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Saving to history allows you to reuse this menu, analyze nutrition patterns, and pick favorite meals for future weeks.
          </p>
          
          <button
            onClick={onViewSavedMenus}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Saved Menus
          </button>
        </div>
      </div>
    </div>
  );
};