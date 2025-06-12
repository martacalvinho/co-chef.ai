import { create } from 'zustand';

interface SavedMenu {
  id: string;
  title: string;
  meals: string[];
  createdAt: Date;
  isFavorite: boolean;
  weekData?: {
    planType: string;
    mealsPerDay: number;
    peopleCount: number;
    skillLevel: string;
    weekStartDate: string;
    weekEndDate?: string;
    completionRate?: number;
    averageRating?: number;
    totalCalories?: number;
    mealRatings?: Record<number, { rating: number; notes: string }>;
  };
}

interface InventoryItem {
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

interface AppState {
  currentView: 'homepage' | 'chat' | 'menus' | 'shopping';
  savedMenus: SavedMenu[];
  inventory: InventoryItem[];
  
  // Modal states
  receiptScanModalOpen: boolean;
  fridgePhotoModalOpen: boolean;
  leftoverModalOpen: boolean;
  quickAddModalOpen: boolean;
  mealRatingModalOpen: boolean;
  shareWithPartnerModalOpen: boolean;
  
  // Actions
  setCurrentView: (view: 'homepage' | 'chat' | 'menus' | 'shopping') => void;
  addSavedMenu: (menu: SavedMenu) => void;
  toggleMenuFavorite: (id: string) => void;
  deleteSavedMenu: (id: string) => void;
  
  // Inventory actions
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  
  // Modal actions
  openReceiptScanModal: () => void;
  closeReceiptScanModal: () => void;
  openFridgePhotoModal: () => void;
  closeFridgePhotoModal: () => void;
  openLeftoverModal: () => void;
  closeLeftoverModal: () => void;
  openQuickAddModal: () => void;
  closeQuickAddModal: () => void;
  openMealRatingModal: () => void;
  closeMealRatingModal: () => void;
  openShareWithPartnerModal: () => void;
  closeShareWithPartnerModal: () => void;
}

// Check for automatic week ending on Sunday night
const checkAndEndWeek = () => {
  const savedData = localStorage.getItem('kitchenai-current-week');
  if (!savedData) return;

  try {
    const parsed = JSON.parse(savedData);
    if (!parsed.weekData?.weekStartDate) return;

    const weekStart = new Date(parsed.weekData.weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7); // Add 7 days
    weekEnd.setHours(23, 59, 59, 999); // Set to end of Sunday

    const now = new Date();
    
    // If it's past Sunday night of the week, automatically end the week
    if (now > weekEnd && parsed.step !== 'week-complete') {
      // Auto-complete any remaining meals with default ratings
      const totalMeals = parsed.weekData.meals?.length || 0;
      const completedMeals = new Set(parsed.completedMeals || []);
      const mealRatings = parsed.mealRatings || {};

      // Mark all meals as completed with neutral ratings
      for (let i = 0; i < totalMeals; i++) {
        if (!completedMeals.has(i)) {
          completedMeals.add(i);
          mealRatings[i] = { rating: 3, notes: 'Auto-completed' };
        }
      }

      // Calculate completion stats
      const avgRating = Object.values(mealRatings).reduce((sum: number, r: any) => sum + r.rating, 0) / Object.keys(mealRatings).length;
      const totalCalories = parsed.weekData.meals?.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0) || 0;

      // Update the saved data to mark week as complete
      const updatedData = {
        ...parsed,
        step: 'week-complete',
        completedMeals: Array.from(completedMeals),
        mealRatings,
        weekData: {
          ...parsed.weekData,
          weekEndDate: weekEnd.toISOString(),
          completionRate: 100,
          averageRating: avgRating,
          totalCalories
        }
      };

      localStorage.setItem('kitchenai-current-week', JSON.stringify(updatedData));
    }
  } catch (error) {
    console.error('Error checking for automatic week ending:', error);
  }
};

export const useAppStore = create<AppState>((set, get) => {
  // Check for automatic week ending when store is created
  checkAndEndWeek();

  return {
    currentView: 'homepage', // Changed to homepage as default
    savedMenus: [
      {
        id: '1',
        title: 'Week of December 9th',
        meals: [
          'Monday: Chinese noodles with pork',
          'Tuesday: Lasagna',
          'Wednesday: Fried fish with rice and peas',
          'Thursday: Smoked salmon with lemon pasta',
          'Friday: Fish curry'
        ],
        createdAt: new Date('2024-12-09'),
        isFavorite: true,
        weekData: {
          planType: 'pasta dishes',
          mealsPerDay: 1,
          peopleCount: 2,
          skillLevel: 'Medium',
          weekStartDate: '2024-12-09T00:00:00.000Z',
          weekEndDate: '2024-12-15T23:59:59.999Z',
          completionRate: 100,
          averageRating: 4.2,
          totalCalories: 2850,
          mealRatings: {
            0: { rating: 4, notes: 'Delicious!' },
            1: { rating: 5, notes: 'Perfect!' },
            2: { rating: 4, notes: 'Good flavor' },
            3: { rating: 4, notes: 'Really enjoyed it' },
            4: { rating: 4, notes: 'Spicy and tasty' }
          }
        }
      },
      {
        id: '2',
        title: 'Week of December 2nd',
        meals: [
          'Monday: Mushroom risotto',
          'Tuesday: Stroganoff',
          'Wednesday: Empanadas with rice',
          'Thursday: Hamburger with fries',
          'Friday: Carbonara',
          'Saturday: Pizza'
        ],
        createdAt: new Date('2024-12-02'),
        isFavorite: false,
        weekData: {
          planType: 'comfort food',
          mealsPerDay: 1,
          peopleCount: 2,
          skillLevel: 'Easy',
          weekStartDate: '2024-12-02T00:00:00.000Z',
          weekEndDate: '2024-12-08T23:59:59.999Z',
          completionRate: 83,
          averageRating: 3.8,
          totalCalories: 3200,
          mealRatings: {
            0: { rating: 4, notes: 'Creamy and rich' },
            1: { rating: 3, notes: 'Good but heavy' },
            2: { rating: 4, notes: 'Loved the flavors' },
            3: { rating: 4, notes: 'Classic comfort' },
            4: { rating: 4, notes: 'Perfect pasta' }
          }
        }
      }
    ],
    inventory: [
      {
        id: '1',
        household_id: '1',
        ingredient_name: 'Chicken Breast',
        quantity: 2,
        unit: 'lbs',
        current_status: 'available',
        expiry_date: '2024-12-20',
        location: 'fridge',
        source: 'manual_entry',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        household_id: '1',
        ingredient_name: 'Pasta',
        quantity: 1,
        unit: 'box',
        current_status: 'available',
        location: 'pantry',
        source: 'manual_entry',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        household_id: '1',
        ingredient_name: 'Milk',
        quantity: 0.5,
        unit: 'gallon',
        current_status: 'low',
        expiry_date: '2024-12-15',
        location: 'fridge',
        source: 'manual_entry',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    
    // Modal states
    receiptScanModalOpen: false,
    fridgePhotoModalOpen: false,
    leftoverModalOpen: false,
    quickAddModalOpen: false,
    mealRatingModalOpen: false,
    shareWithPartnerModalOpen: false,
    
    setCurrentView: (view) => {
      // Check for automatic week ending when navigating
      checkAndEndWeek();
      set({ currentView: view });
    },
    addSavedMenu: (menu) => set((state) => ({ 
      savedMenus: [menu, ...state.savedMenus] 
    })),
    toggleMenuFavorite: (id) => set((state) => ({
      savedMenus: state.savedMenus.map(menu =>
        menu.id === id ? { ...menu, isFavorite: !menu.isFavorite } : menu
      )
    })),
    deleteSavedMenu: (id) => set((state) => ({
      savedMenus: state.savedMenus.filter(menu => menu.id !== id)
    })),
    
    // Inventory actions
    addInventoryItem: (item) => set((state) => ({
      inventory: [...state.inventory, item]
    })),
    updateInventoryItem: (id, updates) => set((state) => ({
      inventory: state.inventory.map(item =>
        item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      )
    })),
    deleteInventoryItem: (id) => set((state) => ({
      inventory: state.inventory.filter(item => item.id !== id)
    })),
    
    // Modal actions
    openReceiptScanModal: () => set({ receiptScanModalOpen: true }),
    closeReceiptScanModal: () => set({ receiptScanModalOpen: false }),
    openFridgePhotoModal: () => set({ fridgePhotoModalOpen: true }),
    closeFridgePhotoModal: () => set({ fridgePhotoModalOpen: false }),
    openLeftoverModal: () => set({ leftoverModalOpen: true }),
    closeLeftoverModal: () => set({ leftoverModalOpen: false }),
    openQuickAddModal: () => set({ quickAddModalOpen: true }),
    closeQuickAddModal: () => set({ quickAddModalOpen: false }),
    openMealRatingModal: () => set({ mealRatingModalOpen: true }),
    closeMealRatingModal: () => set({ mealRatingModalOpen: false }),
    openShareWithPartnerModal: () => set({ shareWithPartnerModalOpen: true }),
    closeShareWithPartnerModal: () => set({ shareWithPartnerModalOpen: false }),
  };
});

// Set up interval to check for automatic week ending every hour
setInterval(checkAndEndWeek, 60 * 60 * 1000); // Check every hour