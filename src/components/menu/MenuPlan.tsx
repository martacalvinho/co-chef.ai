import React, { useState } from 'react';
import { Calendar, ChefHat, Clock, Users, Wand2, Plus, Edit, Trash2, Copy, Share } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import { useAppStore } from '../../store';

const mockMeals = {
  monday: {
    breakfast: { name: 'Overnight Oats', time: 5, cook: 'Sarah', image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=200' },
    lunch: { name: 'Caesar Salad', time: 15, cook: 'Alex', image: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=200' },
    dinner: { name: 'Grilled Salmon', time: 30, cook: 'Alex', image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=200' },
  },
  tuesday: {
    breakfast: { name: 'Greek Yogurt Bowl', time: 5, cook: 'Emma', image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=200' },
    lunch: { name: 'Quinoa Buddha Bowl', time: 20, cook: 'Sarah', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=200' },
    dinner: { name: 'Chicken Stir Fry', time: 25, cook: 'Alex', image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=200' },
  },
  // Add more days...
};

interface MealCardProps {
  meal: {
    name: string;
    time: number;
    cook: string;
    image: string;
  };
  type: string;
  day: string;
}

const MealCard: React.FC<MealCardProps> = ({ meal, type, day }) => {
  const { openMealEditModal } = useAppStore();

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden relative">
      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
        <img 
          src={meal.image} 
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-3">
        <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1">
          {meal.name}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{meal.time}min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{meal.cook}</span>
          </div>
        </div>
      </div>
      
      {/* Hover Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button
            onClick={() => openMealEditModal(meal, type, day)}
            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Edit meal"
          >
            <Edit className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={() => console.log('Delete meal:', meal.name)}
            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Remove meal"
          >
            <Trash2 className="w-3 h-3 text-error-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyMealSlot: React.FC<{ type: string; day: string }> = ({ type, day }) => {
  const { openMealSelectionModal } = useAppStore();

  return (
    <button
      onClick={() => openMealSelectionModal(type, day)}
      className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors group w-full"
    >
      <div className="text-center">
        <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
        <p className="text-sm text-gray-500 group-hover:text-primary-600">
          Add {type}
        </p>
      </div>
    </button>
  );
};

interface MenuGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuGenerationModal: React.FC<MenuGenerationModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    prioritizeLeftovers: true,
    quickMealsOnly: false,
    focusCuisine: '',
    guestFriendly: false,
    dietaryFocus: '',
    maxCookTime: 60,
    creativity: 0.7
  });

  if (!isOpen) return null;

  const handleGenerate = () => {
    console.log('Generating menu with preferences:', preferences);
    // TODO: Implement menu generation
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generate Weekly Menu</h2>
          <p className="text-gray-600 mt-1">Customize your AI-powered menu generation</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.prioritizeLeftovers}
                onChange={(e) => setPreferences({ ...preferences, prioritizeLeftovers: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Prioritize leftovers</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.quickMealsOnly}
                onChange={(e) => setPreferences({ ...preferences, quickMealsOnly: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Quick meals only (&lt;30 min)</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.guestFriendly}
                onChange={(e) => setPreferences({ ...preferences, guestFriendly: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Guest-friendly options</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus Cuisine</label>
              <select
                value={preferences.focusCuisine}
                onChange={(e) => setPreferences({ ...preferences, focusCuisine: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any cuisine</option>
                <option value="italian">Italian</option>
                <option value="asian">Asian</option>
                <option value="mexican">Mexican</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="american">American</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Focus</label>
              <select
                value={preferences.dietaryFocus}
                onChange={(e) => setPreferences({ ...preferences, dietaryFocus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No specific focus</option>
                <option value="high_protein">High Protein</option>
                <option value="low_carb">Low Carb</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="heart_healthy">Heart Healthy</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Cook Time: {preferences.maxCookTime} minutes
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={preferences.maxCookTime}
              onChange={(e) => setPreferences({ ...preferences, maxCookTime: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Creativity: {Math.round(preferences.creativity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.creativity}
              onChange={(e) => setPreferences({ ...preferences, creativity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const MenuPlan: React.FC = () => {
  const { 
    menuGenerationModalOpen, 
    closeMenuGenerationModal,
    openMenuGenerationModal 
  } = useAppStore();
  
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  const today = new Date();
  const weekStart = startOfWeek(new Date(today.getTime() + currentWeekOffset * 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const handleShareMenu = () => {
    console.log('Sharing menu...');
    // TODO: Implement menu sharing
  };

  const handleCopyMenu = () => {
    console.log('Copying menu...');
    // TODO: Implement menu copying
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-7 h-7 text-primary-600" />
            <span>Weekly Menu Plan</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Week of {format(weekStart, 'MMMM do, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePreviousWeek}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Previous Week
          </button>
          <button 
            onClick={openMenuGenerationModal}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Menu</span>
          </button>
          <button 
            onClick={handleNextWeek}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Next Week
          </button>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Menu Actions:</span>
          <button
            onClick={handleCopyMenu}
            className="flex items-center space-x-1 text-sm text-secondary-600 hover:text-secondary-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Week</span>
          </button>
          <button
            onClick={handleShareMenu}
            className="flex items-center space-x-1 text-sm text-secondary-600 hover:text-secondary-700 transition-colors"
          >
            <Share className="w-4 h-4" />
            <span>Share Menu</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {format(new Date(), 'MMM d, h:mm a')}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
              <div className="p-4">
                <span className="text-sm font-medium text-gray-700">Meal</span>
              </div>
              {days.map((day, index) => (
                <div key={day} className="p-4 text-center border-l border-gray-200">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {day.slice(0, 3)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(addDays(weekStart, index), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Rows */}
            {mealTypes.map((mealType) => (
              <div key={mealType} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {mealType}
                  </span>
                </div>
                {days.map((day) => (
                  <div key={`${day}-${mealType}`} className="p-3 border-l border-gray-200">
                    {mockMeals[day as keyof typeof mockMeals]?.[mealType as keyof typeof mockMeals.monday] ? (
                      <MealCard 
                        meal={mockMeals[day as keyof typeof mockMeals][mealType as keyof typeof mockMeals.monday]} 
                        type={mealType} 
                        day={day} 
                      />
                    ) : (
                      <EmptyMealSlot type={mealType} day={day} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <ChefHat className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Total Meals</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">18</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-secondary-600" />
            <span className="text-sm font-medium text-gray-700">Avg Cook Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">22min</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent-600" />
            <span className="text-sm font-medium text-gray-700">Cooks Assigned</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-success-500 rounded-full" />
            <span className="text-sm font-medium text-gray-700">Complete</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">85%</p>
        </div>
      </div>

      <MenuGenerationModal
        isOpen={menuGenerationModalOpen}
        onClose={closeMenuGenerationModal}
      />
    </div>
  );
};