import React from 'react';
import { Camera, Check, ShoppingCart } from 'lucide-react';
import { useAppStore } from '../../store';

interface RecipeCheckDisplayProps {
  onRecipeConfirm: () => void;
  onViewShoppingList: () => void;
}

export const RecipeCheckDisplay: React.FC<RecipeCheckDisplayProps> = ({
  onRecipeConfirm,
  onViewShoppingList
}) => {
  const { openReceiptScanModal } = useAppStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Check className="w-5 h-5 text-primary-500" />
        <span>Recipe Check</span>
      </h3>
      
      <p className="text-gray-700 mb-6">
        Before we start the week, let's double-check the recipes. Did you get all the ingredients from your shopping list?
      </p>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Optional: Upload Receipt</h4>
        <p className="text-sm text-blue-700 mb-3">
          Take a photo of your receipt to verify you bought everything correctly and automatically update your inventory.
        </p>
        <button
          onClick={openReceiptScanModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Receipt Photo</span>
        </button>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={onRecipeConfirm}
          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
        >
          Yes, I'm Ready to Cook!
        </button>
        <button
          onClick={onViewShoppingList}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Check Shopping List Again</span>
        </button>
      </div>
    </div>
  );
};