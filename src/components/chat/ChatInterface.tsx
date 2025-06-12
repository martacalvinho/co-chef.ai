import React, { useState, useRef, useEffect } from 'react';
import { Send, Wand2, ShoppingCart, Camera, Utensils, Plus, MessageSquare, ArrowLeft, RefreshCw, Check, Share, Users, Clock, ChefHat, Star, Receipt, History, Edit, BookOpen, Eye } from 'lucide-react';
import { useAppStore } from '../../store';
import { generateMealPlan, generateShoppingList, generateSingleMeal, type MealPlanRequest, type GeneratedMeal } from '../../services/aiService';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  data?: any;
}

interface WeekData {
  planType: string;
  mealsPerDay: number;
  peopleCount: number;
  skillLevel: string;
  meals: GeneratedMeal[];
  shoppingList?: ShoppingListItem[];
  weekStartDate: string;
}

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  isChecked: boolean;
}

const PLAN_OPTIONS = [
  'healthy meals', 'pasta dishes', 'quick meals', 'budget-friendly meals', 'vegetarian meals',
  'keto meals', 'mediterranean meals', 'asian cuisine', 'mexican cuisine', 'comfort food',
  'low-carb meals', 'high-protein meals', 'family-friendly meals', 'gourmet meals', 'one-pot meals',
  'meal prep friendly', 'gluten-free meals', 'dairy-free meals', 'seafood dishes', 'chicken dishes'
];

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

export const ChatInterface: React.FC = () => {
  const { setCurrentView, addSavedMenu } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeekData, setCurrentWeekData] = useState<WeekData | null>(null);
  const [currentStep, setCurrentStep] = useState<'initial' | 'plan-type' | 'custom-input' | 'meals-per-day' | 'people-count' | 'skill-level' | 'generating' | 'menu-review' | 'shopping-list' | 'recipe-check' | 'week-execution' | 'week-complete'>('initial');
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [customPlanType, setCustomPlanType] = useState('');
  const [selectedMealsPerDay, setSelectedMealsPerDay] = useState(0);
  const [selectedPeopleCount, setSelectedPeopleCount] = useState(0);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [completedMeals, setCompletedMeals] = useState<Set<number>>(new Set());
  const [mealRatings, setMealRatings] = useState<Record<number, { rating: number; notes: string }>>({});
  const [leftoverIngredients, setLeftoverIngredients] = useState<string[]>([]);
  const [viewingRecipe, setViewingRecipe] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('kitchenai-current-week');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCurrentWeekData(parsed.weekData);
        setCurrentStep(parsed.step);
        setSelectedPlanType(parsed.selectedPlanType || '');
        setSelectedMealsPerDay(parsed.selectedMealsPerDay || 0);
        setSelectedPeopleCount(parsed.selectedPeopleCount || 0);
        setSelectedSkillLevel(parsed.selectedSkillLevel || '');
        setCompletedMeals(new Set(parsed.completedMeals || []));
        setMealRatings(parsed.mealRatings || {});
        setLeftoverIngredients(parsed.leftoverIngredients || []);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      weekData: currentWeekData,
      step: currentStep,
      selectedPlanType,
      selectedMealsPerDay,
      selectedPeopleCount,
      selectedSkillLevel,
      completedMeals: Array.from(completedMeals),
      mealRatings,
      leftoverIngredients
    };
    localStorage.setItem('kitchenai-current-week', JSON.stringify(dataToSave));
  }, [currentWeekData, currentStep, selectedPlanType, selectedMealsPerDay, selectedPeopleCount, selectedSkillLevel, completedMeals, mealRatings, leftoverIngredients]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: 'welcome',
        timestamp: new Date()
      }]);
    }
  }, []);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string, data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    addMessage('user', inputValue);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      addMessage('assistant', "I understand you'd like help with meal planning! Let me guide you through creating a personalized weekly menu. Would you like to start planning your week?");
      setIsLoading(false);
    }, 1000);
  };

  const handlePlanMyWeek = () => {
    setCurrentStep('plan-type');
    addMessage('assistant', 'plan-type-selection');
  };

  const handlePlanTypeSelection = (planType: string) => {
    setSelectedPlanType(planType);
    setCurrentStep('meals-per-day');
    addMessage('user', `I want ${planType}`);
    addMessage('assistant', 'meals-per-day-selection');
  };

  const handleCustomPlanType = () => {
    setCurrentStep('custom-input');
    addMessage('user', 'I want to specify something custom');
    addMessage('assistant', 'custom-input');
  };

  const handleCustomPlanSubmit = () => {
    if (!customPlanType.trim()) return;
    
    setSelectedPlanType(customPlanType.trim());
    setCurrentStep('meals-per-day');
    addMessage('user', `I want ${customPlanType.trim()}`);
    addMessage('assistant', 'meals-per-day-selection');
    setCustomPlanType('');
  };

  const handleMealsPerDaySelection = (mealsPerDay: number) => {
    setSelectedMealsPerDay(mealsPerDay);
    setCurrentStep('people-count');
    addMessage('user', `${mealsPerDay} meal${mealsPerDay > 1 ? 's' : ''} per day`);
    addMessage('assistant', 'people-count-selection');
  };

  const handlePeopleCountSelection = (peopleCount: number) => {
    setSelectedPeopleCount(peopleCount);
    setCurrentStep('skill-level');
    addMessage('user', `For ${peopleCount} people`);
    addMessage('assistant', 'skill-level-selection');
  };

  const handleSkillLevelSelection = async (skillLevel: string) => {
    setSelectedSkillLevel(skillLevel);
    setCurrentStep('generating');
    addMessage('user', `${skillLevel} difficulty level`);
    addMessage('assistant', 'Generating your personalized meal plan...');
    
    setIsLoading(true);
    
    try {
      const request: MealPlanRequest = {
        planType: selectedPlanType,
        mealsPerDay: selectedMealsPerDay,
        peopleCount: selectedPeopleCount,
        skillLevel: skillLevel
      };
      
      const meals = await generateMealPlan(request);
      
      const weekData: WeekData = {
        planType: selectedPlanType,
        mealsPerDay: selectedMealsPerDay,
        peopleCount: selectedPeopleCount,
        skillLevel: skillLevel,
        meals: meals,
        weekStartDate: new Date().toISOString()
      };
      
      setCurrentWeekData(weekData);
      setCurrentStep('menu-review');
      addMessage('assistant', 'meal-plan-generated', weekData);
    } catch (error) {
      addMessage('assistant', 'Sorry, there was an error generating your meal plan. Please try again.');
      setCurrentStep('initial');
    }
    
    setIsLoading(false);
  };

  const handleRefreshMeal = async (mealIndex: number) => {
    if (!currentWeekData) return;
    
    setIsLoading(true);
    
    try {
      const request: MealPlanRequest = {
        planType: currentWeekData.planType,
        mealsPerDay: 1,
        peopleCount: currentWeekData.peopleCount,
        skillLevel: currentWeekData.skillLevel
      };
      
      const newMeal = await generateSingleMeal(request);
      const updatedMeals = [...currentWeekData.meals];
      updatedMeals[mealIndex] = newMeal;
      
      const updatedWeekData = {
        ...currentWeekData,
        meals: updatedMeals
      };
      
      setCurrentWeekData(updatedWeekData);
      addMessage('assistant', 'meal-refreshed', { mealIndex, newMeal });
    } catch (error) {
      addMessage('assistant', 'Sorry, there was an error refreshing that meal. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleAcceptMenu = async () => {
    if (!currentWeekData) return;
    
    setIsLoading(true);
    addMessage('assistant', 'Generating your comprehensive shopping list from all meals...');
    
    try {
      const shoppingListStrings = await generateShoppingList(currentWeekData.meals);
      const shoppingList: ShoppingListItem[] = shoppingListStrings.map((item, index) => ({
        id: index.toString(),
        name: item,
        quantity: '1',
        isChecked: false
      }));
      
      const updatedWeekData = {
        ...currentWeekData,
        shoppingList
      };
      
      setCurrentWeekData(updatedWeekData);
      setCurrentStep('shopping-list');
      addMessage('assistant', 'shopping-list-generated', updatedWeekData);
    } catch (error) {
      addMessage('assistant', 'Sorry, there was an error generating your shopping list. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleUpdateShoppingQuantity = (itemId: string, newQuantity: string) => {
    if (!currentWeekData?.shoppingList) return;
    
    const updatedShoppingList = currentWeekData.shoppingList.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCurrentWeekData({
      ...currentWeekData,
      shoppingList: updatedShoppingList
    });
  };

  const handleStartWeek = () => {
    setCurrentStep('recipe-check');
    addMessage('assistant', 'recipe-check');
  };

  const handleRecipeConfirm = () => {
    setCurrentStep('week-execution');
    addMessage('assistant', 'week-execution', currentWeekData);
  };

  const handleMealComplete = (mealIndex: number, rating: number, notes: string) => {
    setCompletedMeals(prev => new Set([...prev, mealIndex]));
    setMealRatings(prev => ({ ...prev, [mealIndex]: { rating, notes } }));
    
    if (completedMeals.size + 1 === currentWeekData?.meals.length) {
      // All meals completed, show leftover ingredients
      const allIngredients = currentWeekData?.meals.flatMap(meal => meal.ingredients) || [];
      const uniqueIngredients = [...new Set(allIngredients)];
      setLeftoverIngredients(uniqueIngredients);
      
      setTimeout(() => {
        setCurrentStep('week-complete');
        addMessage('assistant', 'week-complete', {
          weekData: currentWeekData,
          ratings: { ...mealRatings, [mealIndex]: { rating, notes } },
          completedCount: completedMeals.size + 1,
          leftoverIngredients: uniqueIngredients
        });
      }, 500);
    }
  };

  const handleSaveWeek = () => {
    if (currentWeekData) {
      const weekTitle = `Week of ${new Date(currentWeekData.weekStartDate).toLocaleDateString()}`;
      const mealsList = currentWeekData.meals.map((meal, index) => {
        const dayIndex = Math.floor(index / currentWeekData.mealsPerDay);
        const mealTypeIndex = index % currentWeekData.mealsPerDay;
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
        return `${days[dayIndex]} ${mealTypes[mealTypeIndex]}: ${meal.name}`;
      });
      
      addSavedMenu({
        id: Date.now().toString(),
        title: weekTitle,
        meals: mealsList,
        createdAt: new Date(),
        isFavorite: false
      });
    }
    
    // Clear localStorage and reset for new week
    localStorage.removeItem('kitchenai-current-week');
    setCurrentStep('initial');
    setCurrentWeekData(null);
    setCompletedMeals(new Set());
    setMealRatings({});
    setLeftoverIngredients([]);
    addMessage('assistant', 'Week saved to your history! You can now access this menu in your history and choose to reuse it in the future. Ready to plan your next week?');
  };

  const renderQuickActions = () => {
    const hasShoppingList = currentWeekData?.shoppingList;
    const hasCompletedWeek = currentStep === 'week-complete';
    
    return (
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={handlePlanMyWeek}
          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
        >
          <Wand2 className="w-4 h-4" />
          <span>Plan My Week</span>
        </button>
        
        {hasShoppingList && (
          <button
            onClick={() => setCurrentView('shopping')}
            className="flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Shopping</span>
          </button>
        )}
        
        {hasCompletedWeek && (
          <button
            onClick={() => addMessage('assistant', 'leftover-suggestions', { leftoverIngredients })}
            className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            <Utensils className="w-4 h-4" />
            <span>Leftovers</span>
          </button>
        )}
        
        {hasShoppingList && (
          <button
            onClick={() => addMessage('assistant', 'receipt-scan-prompt')}
            className="flex items-center space-x-2 bg-success-500 hover:bg-success-600 text-white px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            <Receipt className="w-4 h-4" />
            <span>Receipt Photo</span>
          </button>
        )}
        
        <button
          onClick={() => setCurrentView('menus')}
          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    if (message.content === 'welcome') {
      return (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Welcome to Kitchen.AI!</h3>
              <p className="text-sm text-gray-600">Your intelligent meal planning assistant</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <p className="text-gray-700">I can help you:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>Generate personalized weekly meal plans</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                <span>Create smart shopping lists from your meals</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                <span>Track your meals and manage leftovers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Learn your preferences and improve suggestions</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={handlePlanMyWeek}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            Let's Plan Your Week! 🍽️
          </button>
        </div>
      );
    }

    if (message.content === 'plan-type-selection') {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">What type of meals would you like for your week?</p>
          
          {/* Predefined Options */}
          <div className="grid grid-cols-2 gap-2">
            {PLAN_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handlePlanTypeSelection(option)}
                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm"
              >
                {option}
              </button>
            ))}
          </div>
          
          {/* Custom Option */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleCustomPlanType}
              className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Edit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-purple-900">Something specific in mind?</div>
                  <div className="text-sm text-purple-700">Tell me exactly what you want this week</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (message.content === 'custom-input') {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">What specific type of meals would you like this week?</p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-3">
              <strong>Examples:</strong> "spicy Indian curries", "comfort food from the 90s", "meals using chicken thighs", 
              "30-minute weeknight dinners", "keto-friendly Italian dishes", "budget meals under $5 per serving"
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customPlanType}
                onChange={(e) => setCustomPlanType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomPlanSubmit()}
                placeholder="e.g., spicy Thai dishes with lots of vegetables"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleCustomPlanSubmit}
                disabled={!customPlanType.trim()}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentStep('plan-type');
              addMessage('assistant', 'plan-type-selection');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to preset options
          </button>
        </div>
      );
    }

    if (message.content === 'meals-per-day-selection') {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">How many meals per day would you like me to plan?</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => handleMealsPerDaySelection(count)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
              >
                <div className="text-2xl font-bold text-primary-600">{count}</div>
                <div className="text-sm text-gray-600">meal{count > 1 ? 's' : ''}</div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (message.content === 'people-count-selection') {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">For how many people?</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                onClick={() => handlePeopleCountSelection(count)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
              >
                <Users className="w-6 h-6 mx-auto mb-1 text-primary-600" />
                <div className="text-lg font-bold text-primary-600">{count}</div>
                <div className="text-xs text-gray-600">people</div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (message.content === 'skill-level-selection') {
      return (
        <div className="space-y-4">
          <p className="text-gray-700">What's your cooking skill level?</p>
          <div className="space-y-3">
            {SKILL_LEVELS.map((skill) => (
              <button
                key={skill.level}
                onClick={() => handleSkillLevelSelection(skill.level)}
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
    }

    if (message.content === 'meal-plan-generated' && message.data) {
      const weekData = message.data as WeekData;
      const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      };

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
              Here's a weekly meal plan with {weekData.mealsPerDay} meal{weekData.mealsPerDay > 1 ? 's' : ''} per day for {weekData.peopleCount} people, focused on {weekData.planType} at {weekData.skillLevel.toLowerCase()} difficulty. You can refresh individual meals if you don't like them, then accept to generate your shopping list:
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
                            onClick={() => handleRefreshMeal(index)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary-600 transition-all"
                            title="Refresh this meal"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{meal.cookTime}min</span>
                          </span>
                          <span>{meal.servings} servings</span>
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
                onClick={handleAcceptMenu}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
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
    }

    if (message.content === 'shopping-list-generated' && message.data) {
      const weekData = message.data as WeekData;
      
      return (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Your Complete Shopping List</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generated from all {weekData.meals.length} meals in your weekly plan. You can adjust quantities if needed:
            </p>
            <div className="space-y-2 mb-4">
              {weekData.shoppingList?.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="flex-1 text-gray-700">{item.name}</span>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleUpdateShoppingQuantity(item.id, e.target.value)}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleStartWeek}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Start This Week
              </button>
              <button
                onClick={() => setCurrentView('shopping')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View in Shopping App
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Share List
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (message.content === 'recipe-check') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Recipe Check</h3>
          <p className="text-gray-700 mb-4">
            Before we start the week, let's double-check the recipes. Did you get all the ingredients from your shopping list?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleRecipeConfirm}
              className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Yes, I'm Ready to Cook!
            </button>
            <button
              onClick={() => setCurrentView('shopping')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Check Shopping List Again
            </button>
          </div>
        </div>
      );
    }

    if (message.content === 'week-execution' && message.data) {
      const weekData = message.data as WeekData;
      
      return (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">This Week's Meals</h3>
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
                        {isCompleted && mealRatings[index] && (
                          <div className="flex items-center space-x-2 mt-1">
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
                      {!isCompleted && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setViewingRecipe(index)}
                            className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>See Full Recipe</span>
                          </button>
                          <button
                            onClick={() => {
                              const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars for demo
                              const notes = ['Delicious!', 'Really good', 'Perfect!', 'Loved it'][Math.floor(Math.random() * 4)];
                              handleMealComplete(index, rating, notes);
                            }}
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
          </div>

          {/* Recipe Modal */}
          {viewingRecipe !== null && weekData.meals[viewingRecipe] && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{weekData.meals[viewingRecipe].name}</h2>
                  <button
                    onClick={() => setViewingRecipe(null)}
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
        </div>
      );
    }

    if (message.content === 'week-complete' && message.data) {
      const { weekData, ratings, completedCount, leftoverIngredients } = message.data;
      const avgRating = Object.values(ratings).reduce((sum: number, r: any) => sum + r.rating, 0) / Object.keys(ratings).length;
      
      return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Week Complete! 🎉</h3>
            <p className="text-gray-700 mb-4">
              You completed {completedCount} meals with an average rating of {avgRating.toFixed(1)} stars!
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Meals Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{avgRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{leftoverIngredients.length}</div>
                <div className="text-sm text-gray-600">Leftover Items</div>
              </div>
            </div>
            
            {leftoverIngredients.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
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
                <p className="text-sm text-yellow-700">
                  Would you like suggestions for using these leftovers?
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleSaveWeek}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                End Week & Save to History
              </button>
              <p className="text-sm text-gray-600">
                This will save your menu to history so you can reuse it or pick favorite meals from it in the future.
              </p>
              <button
                onClick={() => setCurrentView('menus')}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Saved Menus
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (message.content === 'leftover-suggestions' && message.data) {
      const { leftoverIngredients } = message.data;
      
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Leftover Recipe Suggestions</h3>
          <p className="text-gray-700 mb-4">
            Here are some ideas for using your leftover ingredients:
          </p>
          
          <div className="space-y-3">
            <div className="bg-accent-50 rounded-lg p-3">
              <h4 className="font-medium text-accent-900">Quick Stir Fry</h4>
              <p className="text-sm text-accent-700">Use any leftover vegetables with rice or noodles</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-3">
              <h4 className="font-medium text-secondary-900">Leftover Soup</h4>
              <p className="text-sm text-secondary-700">Combine remaining ingredients into a hearty soup</p>
            </div>
            <div className="bg-success-50 rounded-lg p-3">
              <h4 className="font-medium text-success-900">Creative Omelet</h4>
              <p className="text-sm text-success-700">Perfect way to use up small amounts of ingredients</p>
            </div>
          </div>
          
          <button
            onClick={() => addMessage('assistant', 'Would you like me to create a specific recipe using your leftover ingredients?')}
            className="w-full mt-4 bg-accent-500 hover:bg-accent-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Get Specific Recipe
          </button>
        </div>
      );
    }

    if (message.content === 'receipt-scan-prompt') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Receipt Verification</h3>
          <p className="text-gray-700 mb-4">
            Take a photo of your receipt to verify you got everything from your shopping list and update your inventory automatically.
          </p>
          <div className="flex space-x-3">
            <button className="flex-1 bg-success-500 hover:bg-success-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Skip for Now
            </button>
          </div>
        </div>
      );
    }

    // Regular message
    return (
      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[80%] p-3 rounded-lg ${
          message.type === 'user' 
            ? 'bg-primary-500 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-lg">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Kitchen.AI</h1>
              <p className="text-sm text-gray-500">Your AI meal planning assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('menus')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Saved menus"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentView('shopping')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Shopping list"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderQuickActions()}
        
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id}>
              {renderMessage(message)}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about meal planning..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};