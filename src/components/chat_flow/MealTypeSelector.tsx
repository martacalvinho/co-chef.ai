import React from 'react';
import { Edit } from 'lucide-react';

interface MealTypeSelectorProps {
  selectedPlanType: string;
  customPlanType: string;
  onSelectPlanType: (planType: string) => void;
  onCustomPlanType: () => void;
  onSetCustomPlanType: (value: string) => void;
  onCustomPlanSubmit: () => void;
  onBack?: () => void;
  showCustomInput: boolean;
}

const PLAN_OPTIONS = [
  'healthy meals', 'pasta dishes', 'quick meals', 'budget-friendly meals', 'vegetarian meals',
  'keto meals', 'mediterranean meals', 'asian cuisine', 'mexican cuisine', 'comfort food',
  'low-carb meals', 'high-protein meals', 'family-friendly meals', 'gourmet meals', 'one-pot meals',
  'meal prep friendly', 'gluten-free meals', 'dairy-free meals', 'seafood dishes', 'chicken dishes'
];

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedPlanType,
  customPlanType,
  onSelectPlanType,
  onCustomPlanType,
  onSetCustomPlanType,
  onCustomPlanSubmit,
  onBack,
  showCustomInput
}) => {
  if (showCustomInput) {
    return (
      <div className="space-y-4">
        <p className="text-gray-700">What specific type of meals would you like this week?</p>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700 mb-3">
            <strong>Examples:</strong> "spicy Indian curries", "comfort food from the 90s", "meals using chicken thighs", 
            "30-minute weeknight dinners", "keto-friendly Italian dishes", "budget meals under $5 per serving"
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customPlanType}
              onChange={(e) => onSetCustomPlanType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onCustomPlanSubmit()}
              placeholder="e.g., spicy Thai dishes with lots of vegetables"
              className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={onCustomPlanSubmit}
              disabled={!customPlanType.trim()}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to preset options
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-700">What type of meals would you like for your week?</p>
      
      {/* Predefined Options */}
      <div className="grid grid-cols-2 gap-2">
        {PLAN_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onSelectPlanType(option)}
            className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm"
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Custom Option */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onCustomPlanType}
          className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Edit className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-purple-900">Something specific in mind?</div>
              <div className="text-sm text-purple-700">Tell me exactly what you want this week</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};