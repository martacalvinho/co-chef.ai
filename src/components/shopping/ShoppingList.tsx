import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Check, Trash2, Share, Edit } from 'lucide-react';
import { useAppStore } from '../../store';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  isChecked: boolean;
}

export const ShoppingList: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState('');

  // Load shopping list from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('kitchenai-current-week');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.weekData?.shoppingList) {
          setItems(parsed.weekData.shoppingList);
        }
      } catch (error) {
        console.error('Error loading shopping list:', error);
      }
    }
  }, []);

  const handleToggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: Date.now().toString(),
        name: newItem.trim(),
        quantity: '1',
        isChecked: false
      }]);
      setNewItem('');
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleShare = () => {
    const listText = items.map(item => `${item.isChecked ? '✓' : '○'} ${item.name} (${item.quantity})`).join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'Shopping List',
        text: listText
      });
    } else {
      navigator.clipboard.writeText(listText);
      alert('Shopping list copied to clipboard!');
    }
  };

  const checkedCount = items.filter(item => item.isChecked).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('chat')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Shopping List</h1>
              <p className="text-sm text-gray-500">{checkedCount} of {items.length} items</p>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Item */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Add item..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleAddItem}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Shopping Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 flex items-center space-x-3">
              <button
                onClick={() => handleToggleItem(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  item.isChecked 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-gray-300 hover:border-primary-500'
                }`}
              >
                {item.isChecked && <Check className="w-4 h-4 text-white" />}
              </button>
              <span className={`flex-1 ${item.isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {item.name}
              </span>
              <input
                type="text"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                placeholder="Qty"
              />
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-500">Add your first shopping item above or generate a list from your meal plan</p>
          </div>
        )}
      </div>
    </div>
  );
};