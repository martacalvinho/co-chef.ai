export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  date_of_birth?: string;
  created_at: string;
}

export interface Household {
  id: string;
  name: string;
  description?: string;
  timezone: string;
  currency: string;
  created_at: string;
}

export interface HouseholdMember {
  household_id: string;
  user_id: string;
  role: 'admin' | 'planner' | 'contributor' | 'viewer' | 'guest';
  nickname?: string;
  permissions: Record<string, any>;
  joined_at: string;
}

export interface MemberProfile {
  household_id: string;
  user_id: string;
  dietary_restrictions: string[];
  allergies: string[];
  favorite_foods: string[];
  disliked_foods: string[];
  preferred_cuisines: string[];
  cooking_skill_level: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'chef';
  max_cooking_time_weekday_minutes?: number;
  max_cooking_time_weekend_minutes?: number;
  health_goals: string[];
  meal_timing_preferences: Record<string, any>;
  special_needs: string[];
  notes?: string;
  updated_at: string;
}

export interface Engram {
  id: string;
  household_id: string;
  user_id?: string;
  content: string;
  type: EngramType;
  context: EngramContext;
  ingredients?: string[];
  relevancy: number;
  confidence: number;
  source: 'user_feedback' | 'auto_generated' | 'pattern_detected' | 'receipt_scan' | 'manual_entry' | 'recipe_import';
  affects_members?: string[];
  created_at: string;
  last_accessed: string;
  access_count: number;
  decay_rate?: number;
}

export type EngramType = 
  | 'meal_record'
  | 'preference_like'
  | 'preference_dislike'
  | 'dietary_restriction'
  | 'allergy'
  | 'leftover_ingredient'
  | 'user_feedback'
  | 'observed_pattern'
  | 'seasonal_preference'
  | 'household_rule'
  | 'cooking_skill'
  | 'time_constraint'
  | 'kitchen_equipment'
  | 'ingredient_availability_pattern'
  | 'social_event_pattern';

export interface EngramContext {
  temporal?: {
    season?: 'spring' | 'summer' | 'autumn' | 'winter';
    day_of_week?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    time_of_day?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    specific_date?: string;
  };
  situational?: {
    cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'chef' | 'none';
    available_time_minutes?: number;
    mood?: string;
    health_goal_focus?: string[];
    guests_present?: boolean;
  };
  location_specific?: string;
}

export interface Meal {
  name: string;
  recipe_id?: string;
  notes?: string;
  cook_time_minutes?: number;
  difficulty?: number;
  assigned_cook?: string;
  ingredients?: string[];
  nutritional_info?: any;
}

export interface WeeklyMenu {
  id: string;
  household_id: string;
  week_start_date: string;
  meals: {
    monday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
    tuesday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
    wednesday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
    thursday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
    friday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
    saturday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
    sunday: { breakfast?: Meal; lunch?: Meal; dinner?: Meal; snack?: Meal };
  };
  dietary_accommodations?: Record<string, any>;
  cooking_assignments?: Record<string, string>;
  prep_assignments?: Record<string, string>;
  generated_by_user_id?: string;
  ai_generated: boolean;
  ai_model_used?: string;
  generation_context?: Record<string, any>;
  approval_status: 'draft' | 'awaiting_approval' | 'approved' | 'active' | 'archived';
  approved_by_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  household_id: string;
  ingredient_name: string;
  quantity?: number;
  unit?: string;
  current_status: 'available' | 'low' | 'out_of_stock' | 'used' | 'expired';
  expiry_date?: string;
  purchase_date?: string;
  cost_per_unit?: number;
  location?: string;
  added_by_user_id?: string;
  source: 'receipt_scan' | 'manual_entry' | 'fridge_photo_ai' | 'leftover_generation';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  ingredient_name: string;
  quantity_needed?: number;
  unit?: string;
  category?: string;
  notes?: string;
  priority: 'urgent' | 'normal' | 'optional';
  added_by_user_id?: string;
  is_purchased: boolean;
  purchased_by_user_id?: string;
  actual_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  household_id: string;
  related_menu_id?: string;
  related_meal_day?: string;
  related_meal_type?: string;
  task_type: 'cooking' | 'shopping' | 'meal_prep' | 'cleanup' | 'ingredient_check';
  title: string;
  description?: string;
  assigned_to_user_id?: string;
  assigned_by_user_id?: string;
  ai_suggested_assignee: boolean;
  ai_suggestion_reasoning?: string;
  due_date?: string;
  estimated_duration_minutes?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'snoozed';
  recurring_pattern?: string;
  recurring_config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}