import React from 'react';
import { ShoppingSummary } from './ShoppingSummary';
import { ShoppingList } from './ShoppingList';
import { InventoryGrid } from './InventoryGrid';

export const ShoppingPage: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Shopping & Inventory
        </h1>
      </div>

      <ShoppingSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShoppingList />
        <div className="space-y-6">
          <InventoryGrid />
        </div>
      </div>
    </div>
  );
};