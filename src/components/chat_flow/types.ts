export interface WeekData {
  planType: string;
  mealsPerDay: number;
  peopleCount: number;
  skillLevel: string;
  meals: GeneratedMeal[];
  shoppingList?: ShoppingListItem[];
  weekStartDate: string;
  weekEndDate?: string;
  completionRate?: number;
  averageRating?: number;
  totalCalories?: number;
}

export interface GeneratedMeal {
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  calories: number; // Added calories field
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isChecked: boolean;
}

export type ChatStep = 
  | 'initial' 
  | 'plan-type' 
  | 'custom-input' 
  | 'meals-per-day' 
  | 'meal-preferences'
  | 'people-count' 
  | 'skill-level' 
  | 'generating' 
  | 'menu-review' 
  | 'shopping-list' 
  | 'recipe-check' 
  | 'week-execution' 
  | 'week-complete';

export interface NavigationStep {
  id: ChatStep;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
}