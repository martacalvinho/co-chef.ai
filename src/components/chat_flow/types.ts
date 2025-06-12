export interface WeekData {
  planType: string;
  mealsPerDay: number;
  peopleCount: number;
  skillLevel: string;
  meals: GeneratedMeal[];
  shoppingList?: ShoppingListItem[];
  weekStartDate: string;
}

export interface GeneratedMeal {
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
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