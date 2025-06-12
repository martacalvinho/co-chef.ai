import React, { useState, useRef, useEffect } from 'react';
import { Send, Wand2, ShoppingCart, Camera, Utensils, Plus, MessageSquare, ArrowLeft, RefreshCw, Check, Share, Users, Clock, ChefHat, Star, Receipt, History, Edit, BookOpen, Eye } from 'lucide-react';
import { useAppStore } from '../../store';
import { generateMealPlan, generateShoppingList, generateSingleMeal, type MealPlanRequest, type GeneratedMeal, AIResponseError, JSONParseError } from '../../services/aiService';
import { ChatNavigation } from './ChatNavigation';
import { MealTypeSelector } from './MealTypeSelector';
import { MealCountSelector } from './MealCountSelector';
import { MealPreferenceSelector } from './MealPreferenceSelector';
import { PeopleCountSelector } from './PeopleCountSelector';
import { CookingLevelSelector } from './CookingLevelSelector';
import { WeeklyMealOptions } from './WeeklyMealOptions';
import { ShoppingListDisplay } from './ShoppingListDisplay';
import { RecipeCheckDisplay } from './RecipeCheckDisplay';
import { WeeklyRecipes } from './WeeklyRecipes';
import { EndWeekSummary } from './EndWeekSummary';
import { WeekData, ShoppingListItem, ChatStep } from './types';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  data?: any;
  showRetry?: boolean;
  retryAction?: () => void;
}

// Smart item parsing function
const parseItemString = (itemString: string): { name: string; quantity: number; unit: string } => {
  // Handle structured items from AI (objects with name, quantity, unit)
  if (typeof itemString === 'object' && itemString.name) {
    return {
      name: itemString.name,
      quantity: itemString.quantity || 1,
      unit: itemString.unit || 'items'
    };
  }
  
  // Convert to string if it's not already
  const str = typeof itemString === 'string' ? itemString : String(itemString);
  
  // Common patterns: "2 lbs ground beef", "1 cup flour", "3 large eggs"
  const patterns = [
    /^(\d+(?:\.\d+)?)\s+(lbs?|pounds?|kg|kilograms?)\s+(.+)$/i,
    /^(\d+(?:\.\d+)?)\s+(oz|ounces?|g|grams?)\s+(.+)$/i,
    /^(\d+(?:\.\d+)?)\s+(cups?|tbsp|tablespoons?|tsp|teaspoons?|ml|l|liters?)\s+(.+)$/i,
    /^(\d+(?:\.\d+)?)\s+(items?|pieces?|cloves?|heads?|bunches?)\s+(.+)$/i,
    /^(\d+(?:\.\d+)?)\s+(cans?|jars?|bottles?|boxes?|packages?)\s+(.+)$/i,
    /^(\d+(?:\.\d+)?)\s+(.+)$/i // Fallback: number + name
  ];
  
  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match) {
      const quantity = parseFloat(match[1]);
      const unit = match[2] || 'items';
      const name = match[3] || match[2]; // For fallback pattern
      return { name: name.trim(), quantity, unit: unit.toLowerCase() };
    }
  }
  
  // If no pattern matches, treat as single item
  return { name: str.trim(), quantity: 1, unit: 'items' };
};

export const ChatFlowContainer: React.FC = () => {
  const { setCurrentView, addSavedMenu, openShareWithPartnerModal } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeekData, setCurrentWeekData] = useState<WeekData | null>(null);
  const [currentStep, setCurrentStep] = useState<ChatStep>('initial');
  const [previousStepStack, setPreviousStepStack] = useState<ChatStep[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [customPlanType, setCustomPlanType] = useState('');
  const [selectedMealsPerDay, setSelectedMealsPerDay] = useState(0);
  const [selectedMealPreferences, setSelectedMealPreferences] = useState<string[]>([]);
  const [selectedPeopleCount, setSelectedPeopleCount] = useState(0);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [completedMeals, setCompletedMeals] = useState<Set<number>>(new Set());
  const [mealRatings, setMealRatings] = useState<Record<number, { rating: number; notes: string }>>({});
  const [leftoverIngredients, setLeftoverIngredients] = useState<string[]>([]);
  const [viewingRecipe, setViewingRecipe] = useState<number | null>(null);
  const [showFavoritePicker, setShowFavoritePicker] = useState(false);
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
        setSelectedMealPreferences(parsed.selectedMealPreferences || []);
        setSelectedPeopleCount(parsed.selectedPeopleCount || 0);
        setSelectedSkillLevel(parsed.selectedSkillLevel || '');
        setCompletedMeals(new Set(parsed.completedMeals || []));
        setMealRatings(parsed.mealRatings || {});
        setLeftoverIngredients(parsed.leftoverIngredients || []);
        setPreviousStepStack(parsed.previousStepStack || []);
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
      selectedMealPreferences,
      selectedPeopleCount,
      selectedSkillLevel,
      completedMeals: Array.from(completedMeals),
      mealRatings,
      leftoverIngredients,
      previousStepStack
    };
    localStorage.setItem('kitchenai-current-week', JSON.stringify(dataToSave));
  }, [currentWeekData, currentStep, selectedPlanType, selectedMealsPerDay, selectedMealPreferences, selectedPeopleCount, selectedSkillLevel, completedMeals, mealRatings, leftoverIngredients, previousStepStack]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome-1',
        type: 'assistant',
        content: 'welcome',
        timestamp: new Date()
      }]);
    }
  }, []);

  const addMessage = (type: 'user' | 'assistant' | 'system' | 'error', content: string, data?: any, showRetry?: boolean, retryAction?: () => void) => {
    const newMessage: Message = {
      id: `${type}-${Date.now()}-${Math.random()}`, // Ensure unique keys
      type,
      content,
      timestamp: new Date(),
      data,
      showRetry,
      retryAction
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addSuccessNotification = (message: string) => {
    const notificationId = `success-${Date.now()}`;
    addMessage('system', `✅ ${message}`);
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== notificationId));
    }, 3000);
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

  const resetDependentState = (fromStep: ChatStep) => {
    switch (fromStep) {
      case 'plan-type':
        setSelectedMealsPerDay(0);
        setSelectedMealPreferences([]);
        setSelectedPeopleCount(0);
        setSelectedSkillLevel('');
        setCurrentWeekData(null);
        setCompletedMeals(new Set());
        setMealRatings({});
        setLeftoverIngredients([]);
        break;
      case 'meals-per-day':
        setSelectedMealPreferences([]);
        setSelectedPeopleCount(0);
        setSelectedSkillLevel('');
        setCurrentWeekData(null);
        setCompletedMeals(new Set());
        setMealRatings({});
        setLeftoverIngredients([]);
        break;
      case 'meal-preferences':
        setSelectedPeopleCount(0);
        setSelectedSkillLevel('');
        setCurrentWeekData(null);
        setCompletedMeals(new Set());
        setMealRatings({});
        setLeftoverIngredients([]);
        break;
      case 'people-count':
        setSelectedSkillLevel('');
        setCurrentWeekData(null);
        setCompletedMeals(new Set());
        setMealRatings({});
        setLeftoverIngredients([]);
        break;
      case 'skill-level':
        setCurrentWeekData(null);
        setCompletedMeals(new Set());
        setMealRatings({});
        setLeftoverIngredients([]);
        break;
    }
  };

  const handleNavigateToStep = (step: ChatStep) => {
    if (step !== currentStep) {
      setPreviousStepStack(prev => [...prev, currentStep]);
      resetDependentState(step);
      setCurrentStep(step);
    }
  };

  const proceedToNextStep = (nextStep: ChatStep) => {
    if (previousStepStack.length > 0) {
      const previousStep = previousStepStack[previousStepStack.length - 1];
      setPreviousStepStack(prev => prev.slice(0, -1));
      setCurrentStep(previousStep);
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handlePlanTypeSelection = (planType: string) => {
    setSelectedPlanType(planType);
    addMessage('user', `I want ${planType}`);
    addMessage('assistant', 'meals-per-day-selection');
    proceedToNextStep('meals-per-day');
  };

  const handleCustomPlanType = () => {
    setCurrentStep('custom-input');
    addMessage('user', 'I want to specify something custom');
    addMessage('assistant', 'custom-input');
  };

  const handleCustomPlanSubmit = () => {
    if (!customPlanType.trim()) return;
    
    setSelectedPlanType(customPlanType.trim());
    addMessage('user', `I want ${customPlanType.trim()}`);
    addMessage('assistant', 'meals-per-day-selection');
    setCustomPlanType('');
    proceedToNextStep('meals-per-day');
  };

  const handleMealsPerDaySelection = (mealsPerDay: number) => {
    setSelectedMealsPerDay(mealsPerDay);
    addMessage('user', `${mealsPerDay} meal${mealsPerDay > 1 ? 's' : ''} per day`);
    
    // If 1, 2, or 3 meals per day, ask for meal preferences
    if (mealsPerDay <= 3) {
      addMessage('assistant', 'meal-preferences-selection');
      proceedToNextStep('meal-preferences');
    } else {
      // For 4 meals (all meals), skip preferences and go to people count
      setSelectedMealPreferences(['breakfast', 'lunch', 'dinner', 'snack']);
      addMessage('assistant', 'people-count-selection');
      proceedToNextStep('people-count');
    }
  };

  const handleMealPreferencesSelection = (preferences: string[]) => {
    setSelectedMealPreferences(preferences);
    const preferencesText = preferences.join(', ');
    addMessage('user', `I want ${preferencesText}`);
    addMessage('assistant', 'people-count-selection');
    proceedToNextStep('people-count');
  };

  const handlePeopleCountSelection = (peopleCount: number) => {
    setSelectedPeopleCount(peopleCount);
    addMessage('user', `For ${peopleCount} people`);
    addMessage('assistant', 'skill-level-selection');
    proceedToNextStep('skill-level');
  };

  const handleSkillLevelSelection = async (skillLevel: string) => {
    setSelectedSkillLevel(skillLevel);
    setCurrentStep('generating');
    addMessage('user', `${skillLevel} difficulty level`);
    addMessage('assistant', 'Generating your personalized meal plan...');
    
    setIsLoading(true);
    
    const generateMealPlanWithRetry = async () => {
      try {
        const request: MealPlanRequest = {
          planType: selectedPlanType,
          mealsPerDay: selectedMealsPerDay,
          peopleCount: selectedPeopleCount,
          skillLevel: skillLevel,
          preferences: selectedMealPreferences
        };
        
        console.log('Generating meal plan with request:', request);
        const meals = await generateMealPlan(request);
        console.log('Generated meals:', meals);
        
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
        addSuccessNotification('Meal plan generated successfully!');
      } catch (error) {
        console.error('Error generating meal plan:', error);
        let errorMessage = 'Sorry, there was an error generating your meal plan.';
        
        if (error instanceof AIResponseError) {
          errorMessage = 'AI service is currently unavailable. Please try again.';
        } else if (error instanceof JSONParseError) {
          errorMessage = 'There was an issue processing the meal plan. Please try again.';
        }
        
        addMessage('error', errorMessage, null, true, generateMealPlanWithRetry);
        setCurrentStep('skill-level');
      }
      
      setIsLoading(false);
    };
    
    await generateMealPlanWithRetry();
  };

  const handleRefreshMeal = async (mealIndex: number) => {
    if (!currentWeekData) return;
    
    setIsLoading(true);
    
    const refreshMealWithRetry = async () => {
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
        addSuccessNotification('Meal refreshed successfully!');
      } catch (error) {
        let errorMessage = 'Sorry, there was an error refreshing that meal.';
        
        if (error instanceof AIResponseError) {
          errorMessage = 'AI service is currently unavailable. Please try again.';
        } else if (error instanceof JSONParseError) {
          errorMessage = 'There was an issue processing the new meal. Please try again.';
        }
        
        addMessage('error', errorMessage, null, true, refreshMealWithRetry);
      }
      
      setIsLoading(false);
    };
    
    await refreshMealWithRetry();
  };

  const handleAcceptMenu = async () => {
    if (!currentWeekData) return;
    
    setIsLoading(true);
    addMessage('assistant', 'Generating your comprehensive shopping list from all meals...');
    
    const generateShoppingListWithRetry = async () => {
      try {
        console.log('Generating shopping list for meals:', currentWeekData.meals);
        const shoppingListItems = await generateShoppingList(currentWeekData.meals);
        console.log('Generated shopping list items:', shoppingListItems);
        
        // Handle both string array and structured array responses
        const shoppingList: ShoppingListItem[] = shoppingListItems.map((item, index) => {
          if (typeof item === 'object' && item.name) {
            // Structured item from AI
            return {
              id: `shopping-${index}-${Date.now()}`,
              name: item.name,
              quantity: item.quantity || 1,
              unit: item.unit || 'items',
              isChecked: false
            };
          } else {
            // String item - parse it
            const parsedItem = parseItemString(item);
            return {
              id: `shopping-${index}-${Date.now()}`,
              name: parsedItem.name,
              quantity: parsedItem.quantity,
              unit: parsedItem.unit,
              isChecked: false
            };
          }
        });
        
        console.log('Final shopping list:', shoppingList);
        
        const updatedWeekData = {
          ...currentWeekData,
          shoppingList
        };
        
        setCurrentWeekData(updatedWeekData);
        setCurrentStep('shopping-list');
        addMessage('assistant', 'shopping-list-generated', updatedWeekData);
        addSuccessNotification('Shopping list generated successfully!');
      } catch (error) {
        console.error('Error generating shopping list:', error);
        let errorMessage = 'Sorry, there was an error generating your shopping list.';
        
        if (error instanceof AIResponseError) {
          errorMessage = 'AI service is currently unavailable. Please try again.';
        } else if (error instanceof JSONParseError) {
          errorMessage = 'There was an issue processing the shopping list. Please try again.';
        }
        
        addMessage('error', errorMessage, null, true, generateShoppingListWithRetry);
      }
      
      setIsLoading(false);
    };
    
    await generateShoppingListWithRetry();
  };

  const handleUpdateShoppingQuantity = (itemId: string, newQuantity: number, newUnit?: string) => {
    if (!currentWeekData?.shoppingList) return;
    
    // Validate quantity
    const validQuantity = Math.max(0, newQuantity);
    
    const updatedShoppingList = currentWeekData.shoppingList.map(item =>
      item.id === itemId ? { 
        ...item, 
        quantity: validQuantity,
        unit: newUnit || item.unit
      } : item
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
        id: `saved-${Date.now()}`, // Ensure unique ID
        title: weekTitle,
        meals: mealsList,
        createdAt: new Date(),
        isFavorite: false
      });
      
      addSuccessNotification('Week saved to history successfully!');
    }
    
    // Clear localStorage and reset for new week
    localStorage.removeItem('kitchenai-current-week');
    setCurrentStep('initial');
    setCurrentWeekData(null);
    setCompletedMeals(new Set());
    setMealRatings({});
    setLeftoverIngredients([]);
    setPreviousStepStack([]);
    addMessage('assistant', 'Week saved to your history! You can now access this menu in your history and choose to reuse it in the future. Ready to plan your next week?');
  };

  const handleCreateFromFavorites = () => {
    setShowFavoritePicker(true);
  };

  const handleLeftoverSuggestions = () => {
    addMessage('assistant', 'leftover-suggestions', { leftoverIngredients });
  };

  const handleShareList = () => {
    openShareWithPartnerModal();
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

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 'plan-type':
        return (
          <MealTypeSelector
            selectedPlanType={selectedPlanType}
            customPlanType={customPlanType}
            onSelectPlanType={handlePlanTypeSelection}
            onCustomPlanType={handleCustomPlanType}
            onSetCustomPlanType={setCustomPlanType}
            onCustomPlanSubmit={handleCustomPlanSubmit}
            showCustomInput={false}
          />
        );
      
      case 'custom-input':
        return (
          <MealTypeSelector
            selectedPlanType={selectedPlanType}
            customPlanType={customPlanType}
            onSelectPlanType={handlePlanTypeSelection}
            onCustomPlanType={handleCustomPlanType}
            onSetCustomPlanType={setCustomPlanType}
            onCustomPlanSubmit={handleCustomPlanSubmit}
            onBack={() => setCurrentStep('plan-type')}
            showCustomInput={true}
          />
        );
      
      case 'meals-per-day':
        return (
          <MealCountSelector
            selectedMealsPerDay={selectedMealsPerDay}
            onSelectMealsPerDay={handleMealsPerDaySelection}
          />
        );
      
      case 'meal-preferences':
        return (
          <MealPreferenceSelector
            selectedMealsPerDay={selectedMealsPerDay}
            selectedPreferences={selectedMealPreferences}
            onSelectPreferences={handleMealPreferencesSelection}
          />
        );
      
      case 'people-count':
        return (
          <PeopleCountSelector
            selectedPeopleCount={selectedPeopleCount}
            onSelectPeopleCount={handlePeopleCountSelection}
          />
        );
      
      case 'skill-level':
        return (
          <CookingLevelSelector
            selectedSkillLevel={selectedSkillLevel}
            onSelectSkillLevel={handleSkillLevelSelection}
          />
        );
      
      case 'menu-review':
        return currentWeekData ? (
          <WeeklyMealOptions
            weekData={currentWeekData}
            onRefreshMeal={handleRefreshMeal}
            onAcceptMenu={handleAcceptMenu}
            isLoading={isLoading}
          />
        ) : null;
      
      case 'shopping-list':
        return currentWeekData ? (
          <ShoppingListDisplay
            weekData={currentWeekData}
            onUpdateShoppingQuantity={handleUpdateShoppingQuantity}
            onStartWeek={handleStartWeek}
            onViewInShoppingApp={() => setCurrentView('shopping')}
            onShareList={handleShareList}
          />
        ) : null;
      
      case 'recipe-check':
        return (
          <RecipeCheckDisplay
            onRecipeConfirm={handleRecipeConfirm}
            onViewShoppingList={() => setCurrentView('shopping')}
          />
        );
      
      case 'week-execution':
        return currentWeekData ? (
          <WeeklyRecipes
            weekData={currentWeekData}
            completedMeals={completedMeals}
            mealRatings={mealRatings}
            onMealComplete={handleMealComplete}
            viewingRecipe={viewingRecipe}
            onSetViewingRecipe={setViewingRecipe}
            onRecipeConfirm={handleRecipeConfirm}
          />
        ) : null;
      
      case 'week-complete':
        return currentWeekData ? (
          <EndWeekSummary
            weekData={currentWeekData}
            ratings={mealRatings}
            completedCount={completedMeals.size}
            leftoverIngredients={leftoverIngredients}
            onSaveWeek={handleSaveWeek}
            onViewSavedMenus={() => setCurrentView('menus')}
            onLeftoverSuggestions={handleLeftoverSuggestions}
            onCreateFromFavorites={handleCreateFromFavorites}
          />
        ) : null;
      
      default:
        return null;
    }
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

    // Handle error messages with retry functionality
    if (message.type === 'error') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">!</span>
            </div>
            <div className="flex-1">
              <p className="text-red-800">{message.content}</p>
              {message.showRetry && message.retryAction && (
                <button
                  onClick={message.retryAction}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Handle system messages (success notifications)
    if (message.type === 'system') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">{message.content}</p>
        </div>
      );
    }

    // Handle other message types that don't need special rendering
    if (['plan-type-selection', 'meals-per-day-selection', 'meal-preferences-selection', 'people-count-selection', 'skill-level-selection', 'custom-input', 'recipe-check'].includes(message.content)) {
      return null; // These are handled by the step components
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

      {/* Navigation */}
      <ChatNavigation 
        currentStep={currentStep} 
        onNavigateToStep={handleNavigateToStep} 
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderQuickActions()}
        
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Show welcome message and previous messages */}
          {messages.map((message) => (
            <div key={message.id}>
              {renderMessage(message)}
            </div>
          ))}
          
          {/* Show current step content */}
          {currentStep !== 'initial' && currentStep !== 'generating' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {renderCurrentStepContent()}
            </div>
          )}
          
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