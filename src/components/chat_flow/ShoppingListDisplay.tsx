import React, { useState } from 'react';
import { Plus, Minus, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { WeekData } from './types';

interface ShoppingListDisplayProps {
  weekData: WeekData;
  onUpdateShoppingQuantity: (itemId: string, newQuantity: number, newUnit?: string) => void;
  onStartWeek: () => void;
  onViewInShoppingApp: () => void;
  onShareList: () => void;
  isLoading?: boolean;
}

// Unit conversion utilities
const UNIT_CONVERSIONS = {
  // Weight conversions
  'lbs': { metric: 'kg', factor: 0.453592 },
  'oz': { metric: 'g', factor: 28.3495 },
  'kg': { imperial: 'lbs', factor: 2.20462 },
  'g': { imperial: 'oz', factor: 0.035274 },
  
  // Volume conversions
  'cups': { metric: 'ml', factor: 236.588 },
  'tbsp': { metric: 'ml', factor: 14.7868 },
  'tsp': { metric: 'ml', factor: 4.92892 },
  'fl oz': { metric: 'ml', factor: 29.5735 },
  'ml': { imperial: 'fl oz', factor: 0.033814 },
  'l': { imperial: 'cups', factor: 4.22675 },
  
  // Count items (no conversion)
  'items': { metric: 'items', factor: 1 },
  'pieces': { metric: 'pieces', factor: 1 },
  'cloves': { metric: 'cloves', factor: 1 },
  'heads': { metric: 'heads', factor: 1 },
  'bunches': { metric: 'bunches', factor: 1 },
  'packages': { metric: 'packages', factor: 1 },
  'cans': { metric: 'cans', factor: 1 },
  'jars': { metric: 'jars', factor: 1 },
  'bottles': { metric: 'bottles', factor: 1 },
  'boxes': { metric: 'boxes', factor: 1 }
};

const convertUnit = (quantity: number, fromUnit: string, isMetric: boolean): { quantity: number; unit: string } => {
  const unitLower = fromUnit.toLowerCase();
  const conversion = UNIT_CONVERSIONS[unitLower as keyof typeof UNIT_CONVERSIONS];
  
  if (!conversion) {
    return { quantity, unit: fromUnit };
  }
  
  if (isMetric && conversion.metric) {
    return {
      quantity: Math.round(quantity * conversion.factor * 100) / 100,
      unit: conversion.metric
    };
  } else if (!isMetric && conversion.imperial) {
    return {
      quantity: Math.round(quantity * conversion.factor * 100) / 100,
      unit: conversion.imperial
    };
  }
  
  return { quantity, unit: fromUnit };
};

// Smart item parsing function
const parseItemString = (itemString: string): { name: string; quantity: number; unit: string } => {
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
    const match = itemString.match(pattern);
    if (match) {
      const quantity = parseFloat(match[1]);
      const unit = match[2] || 'items';
      const name = match[3] || match[2]; // For fallback pattern
      return { name: name.trim(), quantity, unit: unit.toLowerCase() };
    }
  }
  
  // If no pattern matches, treat as single item
  return { name: itemString.trim(), quantity: 1, unit: 'items' };
};

export const ShoppingListDisplay: React.FC<ShoppingListDisplayProps> = ({
  weekData,
  onUpdateShoppingQuantity,
  onStartWeek,
  onViewInShoppingApp,
  onShareList,
  isLoading = false
}) => {
  const [isMetric, setIsMetric] = useState(false);
  const [newItem, setNewItem] = useState('');

  const handleQuantityChange = (itemId: string, newQuantity: number, currentUnit: string) => {
    // Ensure quantity is a valid number and not negative
    const validQuantity = Math.max(0, newQuantity);
    onUpdateShoppingQuantity(itemId, validQuantity, currentUnit);
  };

  const handleIncrement = (itemId: string, currentQuantity: number, currentUnit: string) => {
    const increment = currentQuantity < 1 ? 0.25 : currentQuantity < 5 ? 0.5 : 1; // Smart increment
    handleQuantityChange(itemId, currentQuantity + increment, currentUnit);
  };

  const handleDecrement = (itemId: string, currentQuantity: number, currentUnit: string) => {
    const decrement = currentQuantity <= 1 ? 0.25 : currentQuantity <= 5 ? 0.5 : 1; // Smart decrement
    const newQuantity = Math.max(0, currentQuantity - decrement);
    handleQuantityChange(itemId, newQuantity, currentUnit);
  };

  const handleToggleHaveAtHome = (itemId: string) => {
    if (!weekData.shoppingList) return;
    
    const updatedShoppingList = weekData.shoppingList.map(item =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );
    
    // Update the shopping list in the parent component
    // This would need to be passed as a prop or handled through state management
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    const parsed = parseItemString(newItem);
    // This would need to be implemented to add new items to the shopping list
    console.log('Adding new item:', parsed);
    setNewItem('');
  };

  // Calculate total estimated cost (placeholder calculation)
  const calculateTotalCost = () => {
    if (!weekData.shoppingList) return 0;
    
    return weekData.shoppingList.reduce((total, item) => {
      if (item.isChecked) return total; // Skip items they have at home
      
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity.toString()) || 0;
      const estimatedUnitPrice = 3.50; // Placeholder unit price
      return total + (quantity * estimatedUnitPrice);
    }, 0);
  };

  const getDisplayQuantityAndUnit = (quantity: number, unit: string) => {
    const converted = convertUnit(quantity, unit, isMetric);
    return `${converted.quantity} ${converted.unit}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Your Complete Shopping List</h3>
          
          {/* Metric/Imperial Toggle */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${!isMetric ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Imperial
            </span>
            <button
              onClick={() => setIsMetric(!isMetric)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isMetric ? 'translate-x-6 bg-primary-500' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isMetric ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Metric
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Generated from all {weekData.meals.length} meals in your weekly plan. You can adjust quantities if needed:
        </p>
        
        {/* Add New Item */}
        <div className="flex space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Add item (e.g., '2 lbs chicken breast' or 'milk')"
            className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={handleAddItem}
            className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Add
          </button>
        </div>
        
        <div className="space-y-3 mb-6">
          {weekData.shoppingList?.map((item, index) => {
            const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity.toString()) || 0;
            const displayQuantityUnit = getDisplayQuantityAndUnit(quantity, item.unit || 'items');
            
            return (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                item.isChecked ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                {/* Have at Home Checkbox */}
                <button
                  onClick={() => handleToggleHaveAtHome(item.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    item.isChecked 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                  title="Have at home"
                >
                  {item.isChecked && <Check className="w-3 h-3 text-white" />}
                </button>
                
                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                <span className={`flex-1 ${item.isChecked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {item.name}
                </span>
                
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrement(item.id, quantity, item.unit || 'items')}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                    disabled={quantity <= 0}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  <div className="text-center min-w-[80px]">
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 0, item.unit || 'items')}
                      className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {displayQuantityUnit}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleIncrement(item.id, quantity, item.unit || 'items')}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Estimated Cost */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900">Total Estimated Cost:</span>
            <span className="text-xl font-bold text-blue-900">${calculateTotalCost().toFixed(2)}</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            *Estimated based on average prices. Items marked as "have at home" are excluded.
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