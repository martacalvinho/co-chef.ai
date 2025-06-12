import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { WeekData } from './types';

interface ShoppingListDisplayProps {
  weekData: WeekData;
  onUpdateShoppingQuantity: (itemId: string, newQuantity: string) => void;
  onStartWeek: () => void;
  onViewInShoppingApp: () => void;
  onShareList: () => void;
  isLoading?: boolean;
}

export const ShoppingListDisplay: React.FC<ShoppingListDisplayProps> = ({
  weekData,
  onUpdateShoppingQuantity,
  onStartWeek,
  onViewInShoppingApp,
  onShareList,
  isLoading = false
}) => {
  const handleQuantityChange = (itemId: string, newQuantity: string) => {
    // Ensure quantity is a valid number and not negative
    const parsedQuantity = parseFloat(newQuantity) || 0;
    const validQuantity = Math.max(0, parsedQuantity);
    onUpdateShoppingQuantity(itemId, validQuantity.toString());
  };

  const handleIncrement = (itemId: string, currentQuantity: string) => {
    const current = parseFloat(currentQuantity) || 0;
    handleQuantityChange(itemId, (current + 1).toString());
  };

  const handleDecrement = (itemId: string, currentQuantity: string) => {
    const current = parseFloat(currentQuantity) || 0;
    const newQuantity = Math.max(0, current - 1);
    handleQuantityChange(itemId, newQuantity.toString());
  };

  // Calculate total estimated cost (placeholder calculation)
  const calculateTotalCost = () => {
    if (!weekData.shoppingList) return 0;
    
    return weekData.shoppingList.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const estimatedUnitPrice = 3.50; // Placeholder unit price
      return total + (quantity * estimatedUnitPrice);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Your Complete Shopping List</h3>
        <p className="text-sm text-gray-600 mb-4">
          Generated from all {weekData.meals.length} meals in your weekly plan. You can adjust quantities if needed:
        </p>
        
        <div className="space-y-3 mb-6">
          {weekData.shoppingList?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
              <span className="flex-1 text-gray-700">{item.name}</span>
              
              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecrement(item.id, item.quantity)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                  disabled={parseFloat(item.quantity) <= 0}
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                
                <button
                  onClick={() => handleIncrement(item.id, item.quantity)}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total Estimated Cost */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900">Total Estimated Cost:</span>
            <span className="text-xl font-bold text-blue-900">${calculateTotalCost().toFixed(2)}</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            *Estimated based on average prices. Actual costs may vary.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onStartWeek}
            disabled={isLoading}
            className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Start This Week
          </button>
          <button
            onClick={onViewInShoppingApp}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View in Shopping App
          </button>
          <button
            onClick={onShareList}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Share List
          </button>
        </div>
      </div>
    </div>
  );
};