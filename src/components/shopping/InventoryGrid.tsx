import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, Edit, Trash2, Camera, Scan } from 'lucide-react';
import { useAppStore } from '../../store';

interface InventoryItemProps {
  item: {
    id: string;
    ingredient_name: string;
    quantity?: number;
    unit?: string;
    current_status: 'available' | 'low' | 'out_of_stock' | 'used' | 'expired';
    expiry_date?: string;
    location?: string;
  };
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success-100 text-success-700 border-success-200';
      case 'low': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'out_of_stock': return 'bg-error-100 text-error-700 border-error-200';
      case 'expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const isExpiringSoon = item.expiry_date && new Date(item.expiry_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{item.ingredient_name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {item.quantity && (
              <span>{item.quantity} {item.unit}</span>
            )}
            {item.location && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.location}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-gray-400 hover:text-secondary-600 transition-colors"
            title="Edit item"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-gray-400 hover:text-error-600 transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {isExpiringSoon && (
          <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 ml-2" />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(item.current_status)}`}>
          {item.current_status.replace('_', ' ')}
        </span>
        {item.expiry_date && (
          <span className={`text-xs ${isExpiringSoon ? 'text-warning-600 font-medium' : 'text-gray-500'}`}>
            Expires {new Date(item.expiry_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  editItem?: any;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isOpen, onClose, onSave, editItem }) => {
  const [formData, setFormData] = useState(editItem || {
    ingredient_name: '',
    quantity: '',
    unit: 'pcs',
    current_status: 'available',
    expiry_date: '',
    location: 'pantry'
  });

  React.useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      setFormData({
        ingredient_name: '',
        quantity: '',
        unit: 'pcs',
        current_status: 'available',
        expiry_date: '',
        location: 'pantry'
      });
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (formData.ingredient_name.trim()) {
      onSave({
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredient Name</label>
            <input
              type="text"
              value={formData.ingredient_name}
              onChange={(e) => setFormData({ ...formData, ingredient_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              placeholder="e.g., Chicken Breast"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                placeholder="2.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              >
                <option value="pcs">pieces</option>
                <option value="lbs">pounds</option>
                <option value="kg">kilograms</option>
                <option value="g">grams</option>
                <option value="oz">ounces</option>
                <option value="cups">cups</option>
                <option value="tbsp">tablespoons</option>
                <option value="tsp">teaspoons</option>
                <option value="ml">milliliters</option>
                <option value="l">liters</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.current_status}
                onChange={(e) => setFormData({ ...formData, current_status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="low">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              >
                <option value="pantry">Pantry</option>
                <option value="fridge">Fridge</option>
                <option value="freezer">Freezer</option>
                <option value="countertop">Countertop</option>
                <option value="spice_rack">Spice Rack</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors"
          >
            {editItem ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const InventoryGrid: React.FC = () => {
  const { 
    inventory, 
    updateInventoryItem, 
    deleteInventoryItem, 
    addInventoryItem,
    openReceiptScanModal,
    openFridgePhotoModal 
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.current_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item from inventory?')) {
      deleteInventoryItem(id);
    }
  };

  const handleSaveItem = (itemData: any) => {
    if (editingItem) {
      updateInventoryItem(editingItem.id, itemData);
    } else {
      addInventoryItem({
        ...itemData,
        id: Date.now().toString(),
        household_id: '1',
        source: 'manual_entry',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    setEditingItem(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-secondary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={openFridgePhotoModal}
            className="bg-accent-500 hover:bg-accent-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            title="Scan fridge"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Scan Fridge</span>
          </button>
          <button
            onClick={openReceiptScanModal}
            className="bg-warning-500 hover:bg-warning-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            title="Scan receipt"
          >
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Scan Receipt</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="low">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map(item => (
          <InventoryItem 
            key={item.id} 
            item={item} 
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No items found' : 'No inventory items'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first inventory item to get started'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add First Item
            </button>
          )}
        </div>
      )}

      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
      />
    </div>
  );
};