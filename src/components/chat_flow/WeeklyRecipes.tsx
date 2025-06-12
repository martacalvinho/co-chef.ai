import React, { useState } from 'react';
import { BookOpen, Clock, Users, ArrowLeft, Star, Zap } from 'lucide-react';
import { WeekData } from './types';
import { MealRatingModal } from '../modals/GlobalModals';

interface WeeklyRecipesProps {
  weekData: WeekData;
  completedMeals: Set<number>;
  mealRatings: Record<number, { rating: number; notes: string }>;
  onMealComplete: (mealIndex: number, rating: number, notes: string) => void;
  viewingRecipe: number | null;
  onSetViewingRecipe: (index: number | null) => void;
  onRecipeConfirm: () => void;
  onEndWeek?: () => void; // Added END WEEK functionality
}

export const WeeklyRecipes: React.FC<WeeklyRecipesProps> = ({
  weekData,
  completedMeals,
  mealRatings,
  onMealComplete,
  viewingRecipe,
  onSetViewingRecipe,
  onRecipeConfirm,
  onEndWeek
}) => {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [currentMealIndex, setCurrentMealIndex] = useState<number | null>(null);

  const handleMarkComplete = (mealIndex: number) => {
    setCurrentMealIndex(mealIndex);
    setRatingModalOpen(true);
  };

  const handleRatingSave = (rating: number, notes: string) => {
    if (currentMealIndex !== null) {
      onMealComplete(currentMealIndex, rating, notes);
      setCurrentMealIndex(null);
    }
    setRatingModalOpen(false);
  };

  const getCurrentMealName = () => {
    if (currentMealIndex !== null && weekData.meals[currentMealIndex]) {
      return weekData.meals[currentMealIndex].name;
    }
    return "this meal";
  };

  // Calculate completion percentage
  const completionPercentage = Math.round((completedMeals.size / weekData.meals.length) * 100);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">This Week's Meals</h3>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              {completedMeals.size} of {weekData.meals.length} completed ({completionPercentage}%)
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          Check off meals as you cook and eat them. Rate each meal to help me learn your preferences!
        </p>
        
        <div className="space-y-3">
          {weekData.meals.map((meal, index) => {
            const isCompleted = completedMeals.has(index);
            const dayIndex = Math.floor(index / weekData.mealsPerDay);
            const mealTypeIndex = index % weekData.mealsPerDay;
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
            
            return (
              <div key={index} className={`p-3 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                      {days[dayIndex]} {mealTypes[mealTypeIndex]}: {meal.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{meal.calories} calories</span>
                      </span>
                      {isCompleted && mealRatings[index] && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < mealRatings[index].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          {mealRatings[index].notes && (
                            <span className="text-xs text-gray-600">"{mealRatings[index].notes}"</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isCompleted && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSetViewingRecipe(index)}
                        className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>See Full Recipe</span>
                      </button>
                      <button
                        onClick={() => handleMarkComplete(index)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Mark Complete & Rate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* END WEEK Button */}
        {completedMeals.size > 0 && onEndWeek && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Ready to End This Week?</h4>
              <p className="text-sm text-blue-700 mb-3">
                You can end your week early if you've completed enough meals or want to start planning next week.
              </p>
              <button
                onClick={onEndWeek}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                End Week & Save Progress
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {viewingRecipe !== null && weekData.meals[viewingRecipe] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{weekData.meals[viewingRecipe].name}</h2>
              <button
                onClick={() => onSetViewingRecipe(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-700 mb-4">{weekData.meals[viewingRecipe].description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{weekData.meals[viewingRecipe].cookTime} minutes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{weekData.meals[viewingRecipe].servings} servings</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    <Zap className="w-4 h-4" />
                    <span>{weekData.meals[viewingRecipe].calories} calories</span>
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    weekData.meals[viewingRecipe].difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    weekData.meals[viewingRecipe].difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {weekData.meals[viewingRecipe].difficulty}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {weekData.meals[viewingRecipe].ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {weekData.meals[viewingRecipe].instructions.map((instruction, i) => (
                    <li key={i} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {i + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal Rating Modal */}
      <MealRatingModal
        isOpen={ratingModalOpen}
        onClose={() => {
          setRatingModalOpen(false);
          setCurrentMealIndex(null);
        }}
        onSave={handleRatingSave}
        mealName={getCurrentMealName()}
      />
    </div>
  );
};