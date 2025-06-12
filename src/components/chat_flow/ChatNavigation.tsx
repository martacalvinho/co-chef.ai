import React from 'react';
import { 
  Utensils, 
  Calendar, 
  Users, 
  ChefHat, 
  BookOpen, 
  ShoppingCart, 
  Receipt, 
  CheckCircle 
} from 'lucide-react';
import { ChatStep, NavigationStep } from './types';

interface ChatNavigationProps {
  currentStep: ChatStep;
  onNavigateToStep: (step: ChatStep) => void;
}

const NAVIGATION_STEPS: Array<{
  id: ChatStep;
  icon: React.ElementType;
  label: string;
  order: number;
}> = [
  { id: 'plan-type', icon: Utensils, label: 'Meal Type', order: 1 },
  { id: 'meals-per-day', icon: Calendar, label: 'Meal Count', order: 2 },
  { id: 'people-count', icon: Users, label: 'People Count', order: 3 },
  { id: 'skill-level', icon: ChefHat, label: 'Cooking Level', order: 4 },
  { id: 'menu-review', icon: BookOpen, label: 'Weekly Meals', order: 5 },
  { id: 'shopping-list', icon: ShoppingCart, label: 'Shopping List', order: 6 },
  { id: 'week-execution', icon: Receipt, label: 'Weekly Recipes', order: 7 },
  { id: 'week-complete', icon: CheckCircle, label: 'End Week', order: 8 },
];

export const ChatNavigation: React.FC<ChatNavigationProps> = ({ 
  currentStep, 
  onNavigateToStep 
}) => {
  const getCurrentStepOrder = (step: ChatStep): number => {
    const stepData = NAVIGATION_STEPS.find(s => s.id === step);
    return stepData?.order || 0;
  };

  const currentOrder = getCurrentStepOrder(currentStep);

  const getStepState = (step: typeof NAVIGATION_STEPS[0]) => {
    const isActive = currentStep === step.id;
    const isCompleted = step.order < currentOrder;
    const isDisabled = step.order > currentOrder;
    
    return {
      isActive,
      isCompleted,
      isDisabled,
      isVisible: step.order <= currentOrder || isCompleted
    };
  };

  if (currentStep === 'initial' || currentStep === 'custom-input' || currentStep === 'generating' || currentStep === 'recipe-check') {
    return null;
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
        <div className="space-y-3">
          {NAVIGATION_STEPS.map((step) => {
            const state = getStepState(step);
            const Icon = step.icon;
            
            if (!state.isVisible) return null;

            return (
              <div key={step.id} className="relative group">
                <button
                  onClick={() => !state.isDisabled && onNavigateToStep(step.id)}
                  disabled={state.isDisabled}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    state.isActive
                      ? 'bg-primary-500 text-white shadow-lg scale-110'
                      : state.isCompleted
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : state.isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                    {step.label}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
                
                {/* Connection line */}
                {step.order < NAVIGATION_STEPS.length && state.isVisible && (
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-3 ${
                    state.isCompleted ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};