import React, { useState } from 'react';
import { ArrowLeft, Heart, Copy, Trash2, Plus, Search, RefreshCw, Calendar, Check } from 'lucide-react';
import { useAppStore } from '../../store';

export const MenuLibrary: React.FC = () => {
  const { setCurrentView, savedMenus, toggleMenuFavorite, deleteSavedMenu } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);

  const filteredMenus = savedMenus.filter(menu =>
    menu.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.meals.some(meal => meal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyMenu = (meals: string[]) => {
    navigator.clipboard.writeText(meals.join('\n'));
    alert('Menu copied to clipboard!');
  };

  const handleReuseMenu = (menu: any) => {
    // Save the menu data to localStorage for the chat interface to pick up
    const weekData = {
      planType: 'reused menu',
      mealsPerDay: 1,
      peopleCount: 2,
      skillLevel: 'Medium',
      meals: menu.meals.map((meal: string) => ({
        name: meal.split(': ')[1] || meal,
        description: 'Reused from saved menu',
        cookTime: 30,
        servings: 2,
        difficulty: 'Medium',
        ingredients: ['Various ingredients'],
        instructions: ['Follow original recipe']
      })),
      weekStartDate: new Date().toISOString()
    };
    
    const dataToSave = {
      weekData,
      step: 'menu-review',
      selectedPlanType: 'reused menu',
      selectedMealsPerDay: 1,
      selectedPeopleCount: 2,
      selectedSkillLevel: 'Medium',
      completedMeals: [],
      mealRatings: {},
      leftoverIngredients: [],
      previousStepStack: []
    };
    
    localStorage.setItem('kitchenai-current-week', JSON.stringify(dataToSave));
    setCurrentView('chat');
  };

  const handleFavoriteMenuCreated = (selectedMeals: string[]) => {
    console.log('Creating menu from favorites:', selectedMeals);
    // TODO: Implement creating a new week from selected favorite meals
    alert(`Creating new week with ${selectedMeals.length} favorite meals!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('chat')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Menu History</h1>
          </div>
          <button
            onClick={() => setShowFavoritePicker(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Pick Favorites</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search menus and meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-primary-600">{savedMenus.length}</div>
            <div className="text-sm text-gray-600">Total Weeks</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-red-500">{savedMenus.filter(m => m.isFavorite).length}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">{savedMenus.reduce((sum, menu) => sum + menu.meals.length, 0)}</div>
            <div className="text-sm text-gray-600">Total Meals</div>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="space-y-3">
          {filteredMenus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{menu.title}</h3>
                    {menu.isFavorite && (
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{menu.createdAt.toLocaleDateString()}</span>
                    <span>{menu.meals.length} meals</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleReuseMenu(menu)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Reuse this menu"
                  >
                    <RefreshCw className="w-4 h-4 text-primary-500" />
                  </button>
                  <button
                    onClick={() => toggleMenuFavorite(menu.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Toggle favorite"
                  >
                    <Heart className={`w-4 h-4 ${menu.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={() => handleCopyMenu(menu.meals)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Copy menu"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this menu?')) {
                        deleteSavedMenu(menu.id);
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Delete menu"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                {menu.meals.map((meal, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1 border-b border-gray-100 last:border-b-0">
                    {meal}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleReuseMenu(menu)}
                  className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  Use This Menu Again
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMenus.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No menus found' : 'No saved menus yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Complete your first week to start building your menu history'
              }
            </p>
            <button
              onClick={() => setCurrentView('chat')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {searchTerm ? 'Clear Search' : 'Start Planning'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};