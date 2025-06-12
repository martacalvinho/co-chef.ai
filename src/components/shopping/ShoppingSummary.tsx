import React from 'react';
import { ShoppingCart, Package, AlertTriangle, DollarSign } from 'lucide-react';

export const ShoppingSummary: React.FC = () => {
  const stats = [
    {
      title: 'Shopping List Items',
      value: '12',
      subtitle: '3 urgent, 9 normal',
      icon: ShoppingCart,
      color: 'bg-primary-500',
    },
    {
      title: 'Inventory Items',
      value: '148',
      subtitle: '23 low stock',
      icon: Package,
      color: 'bg-secondary-500',
    },
    {
      title: 'Expiring Soon',
      value: '5',
      subtitle: 'Next 3 days',
      icon: AlertTriangle,
      color: 'bg-warning-500',
    },
    {
      title: 'Est. Shopping Cost',
      value: '$67',
      subtitle: 'This week',
      icon: DollarSign,
      color: 'bg-success-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};