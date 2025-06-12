import { create } from 'zustand';

interface SavedMenu {
  id: string;
  title: string;
  meals: string[];
  createdAt: Date;
  isFavorite: boolean;
}

interface AppState {
  currentView: 'chat' | 'menus' | 'shopping';
  savedMenus: SavedMenu[];
  
  // Modal states
  receiptScanModalOpen: boolean;
  fridgePhotoModalOpen: boolean;
  leftoverModalOpen: boolean;
  quickAddModalOpen: boolean;
  mealRatingModalOpen: boolean;
  
  // Actions
  setCurrentView: (view: 'chat' | 'menus' | 'shopping') => void;
  addSavedMenu: (menu: SavedMenu) => void;
  toggleMenuFavorite: (id: string) => void;
  deleteSavedMenu: (id: string) => void;
  
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
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'chat',
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
      isFavorite: true
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
      isFavorite: false
    }
  ],
  
  // Modal states
  receiptScanModalOpen: false,
  fridgePhotoModalOpen: false,
  leftoverModalOpen: false,
  quickAddModalOpen: false,
  mealRatingModalOpen: false,
  
  setCurrentView: (view) => set({ currentView: view }),
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
}));