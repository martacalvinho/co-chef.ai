import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Camera, Upload, X, Scan, Plus, Star, Check } from 'lucide-react';

// Favorite Meal Picker Modal
interface FavoriteMealPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedMeals: string[]) => void;
}

const FavoriteMealPicker: React.FC<FavoriteMealPickerProps> = ({ isOpen, onClose, onConfirm }) => {
  const { savedMenus } = useAppStore();
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const allMeals = savedMenus.flatMap(menu => 
    menu.meals.map(meal => ({ meal, menuTitle: menu.title }))
  );

  const handleToggleMeal = (meal: string) => {
    const newSelected = new Set(selectedMeals);
    if (newSelected.has(meal)) {
      newSelected.delete(meal);
    } else {
      newSelected.add(meal);
    }
    setSelectedMeals(newSelected);
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedMeals));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pick Your Favorite Meals</h2>
          <p className="text-gray-600 mt-1">Select meals from your history to create a new week</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {allMeals.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleMeal(item.meal)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-1 ${
                      selectedMeals.has(item.meal)
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {selectedMeals.has(item.meal) && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.meal}</p>
                    <p className="text-xs text-gray-500">From {item.menuTitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedMeals.size} meals selected
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedMeals.size === 0}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              Create Week from Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Receipt Scan Modal
const ReceiptScanModal: React.FC = () => {
  const { receiptScanModalOpen, closeReceiptScanModal } = useAppStore();
  const [dragActive, setDragActive] = useState(false);

  if (!receiptScanModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    console.log('Processing receipt files:', files);
    // TODO: Implement receipt processing
    closeReceiptScanModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Scan Receipt</h2>
          <button
            onClick={closeReceiptScanModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Scan className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Receipt</h3>
            <p className="text-gray-500 mb-4">Drag and drop your receipt image or click to browse</p>
            
            <div className="space-y-3">
              <label className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center space-x-2 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
              </label>
              
              <div className="text-sm text-gray-500">
                or
              </div>
              
              <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors">
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            Supported formats: JPG, PNG, PDF. AI will extract items and add them to your inventory.
          </div>
        </div>
      </div>
    </div>
  );
};

// Fridge Photo Modal
const FridgePhotoModal: React.FC = () => {
  const { fridgePhotoModalOpen, closeFridgePhotoModal } = useAppStore();

  if (!fridgePhotoModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Scan Fridge</h2>
          <button
            onClick={closeFridgePhotoModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 text-center">
          <Camera className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Take a Fridge Photo</h3>
          <p className="text-gray-500 mb-6">AI will identify visible items and update your inventory</p>
          
          <div className="space-y-3">
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors">
              Open Camera
            </button>
            <button
              onClick={closeFridgePhotoModal}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Leftover Modal
const LeftoverModal: React.FC = () => {
  const { leftoverModalOpen, closeLeftoverModal } = useAppStore();
  const [leftoverData, setLeftoverData] = useState({
    ingredient: '',
    quantity: '',
    unit: 'cups',
    location: 'fridge'
  });

  if (!leftoverModalOpen) return null;

  const handleSave = () => {
    console.log('Saving leftover:', leftoverData);
    // TODO: Implement leftover saving
    closeLeftoverModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Log Leftover</h2>
          <button
            onClick={closeLeftoverModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredient</label>
            <input
              type="text"
              value={leftoverData.ingredient}
              onChange={(e) => setLeftoverData({ ...leftoverData, ingredient: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
              placeholder="e.g., Cooked Rice"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="text"
                value={leftoverData.quantity}
                onChange={(e) => setLeftoverData({ ...leftoverData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
                placeholder="2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={leftoverData.unit}
                onChange={(e) => setLeftoverData({ ...leftoverData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
              >
                <option value="cups">cups</option>
                <option value="portions">portions</option>
                <option value="lbs">pounds</option>
                <option value="oz">ounces</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
            <select
              value={leftoverData.location}
              onChange={(e) => setLeftoverData({ ...leftoverData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-success-500 focus:border-transparent"
            >
              <option value="fridge">Fridge</option>
              <option value="freezer">Freezer</option>
              <option value="countertop">Countertop</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={closeLeftoverModal}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg transition-colors"
          >
            Save Leftover
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Add Modal
const QuickAddModal: React.FC = () => {
  const { quickAddModalOpen, closeQuickAddModal } = useAppStore();
  const [activeTab, setActiveTab] = useState<'ingredient' | 'note'>('ingredient');

  if (!quickAddModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Quick Add</h2>
          <button
            onClick={closeQuickAddModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'ingredient', label: 'Ingredient' },
              { id: 'note', label: 'Note' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {activeTab === 'ingredient' && (
              <>
                <input
                  type="text"
                  placeholder="Ingredient name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Quantity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>cups</option>
                    <option>lbs</option>
                    <option>pieces</option>
                  </select>
                </div>
              </>
            )}
            
            {activeTab === 'note' && (
              <textarea
                placeholder="Add a note or reminder..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={closeQuickAddModal}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Quick adding:', activeTab);
              closeQuickAddModal();
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Meal Rating Modal
const MealRatingModal: React.FC = () => {
  const { mealRatingModalOpen, closeMealRatingModal } = useAppStore();
  const [ratings, setRatings] = useState({
    taste: 0,
    difficulty: 0,
    wouldEatAgain: null as boolean | null,
    notes: ''
  });

  if (!mealRatingModalOpen) return null;

  const StarRating: React.FC<{ value: number; onChange: (value: number) => void; label: string }> = ({ value, onChange, label }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`p-1 ${star <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Rate Your Meal</h2>
          <button
            onClick={closeMealRatingModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <StarRating
            value={ratings.taste}
            onChange={(value) => setRatings({ ...ratings, taste: value })}
            label="How did it taste?"
          />
          
          <StarRating
            value={ratings.difficulty}
            onChange={(value) => setRatings({ ...ratings, difficulty: value })}
            label="How difficult was it to make?"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Would you eat this again?</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setRatings({ ...ratings, wouldEatAgain: true })}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  ratings.wouldEatAgain === true
                    ? 'bg-success-100 border-success-500 text-success-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setRatings({ ...ratings, wouldEatAgain: false })}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  ratings.wouldEatAgain === false
                    ? 'bg-error-100 border-error-500 text-error-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                No
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional notes</label>
            <textarea
              value={ratings.notes}
              onChange={(e) => setRatings({ ...ratings, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any feedback about the meal..."
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={closeMealRatingModal}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => {
              console.log('Saving meal rating:', ratings);
              closeMealRatingModal();
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Save Rating
          </button>
        </div>
      </div>
    </div>
  );
};

// Global Modals Component
export const GlobalModals: React.FC = () => {
  return (
    <>
      <ReceiptScanModal />
      <FridgePhotoModal />
      <LeftoverModal />
      <QuickAddModal />
      <MealRatingModal />
    </>
  );
};

// Export the FavoriteMealPicker for use in other components
export { FavoriteMealPicker };