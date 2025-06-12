import React from 'react';
import { Wand2, Camera, ChefHat } from 'lucide-react';

interface WelcomeScreenProps {
  onGenerateWeeklyMenu: () => void;
  onUseWhatIHave: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGenerateWeeklyMenu,
  onUseWhatIHave
}) => {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 border border-primary-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Welcome to Kitchen.AI!</h3>
          <p className="text-sm text-gray-600">Your intelligent meal planning assistant</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <p className="text-gray-700">I can help you:</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span>Generate personalized weekly meal plans</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
            <span>Create smart shopping lists from your meals</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
            <span>Track your meals and manage leftovers</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span>Learn your preferences and improve suggestions</span>
          </li>
        </ul>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={onGenerateWeeklyMenu}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <Wand2 className="w-5 h-5" />
          <span>Generate Weekly Menu</span>
        </button>
        
        <button
          onClick={onUseWhatIHave}
          className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <Camera className="w-5 h-5" />
          <span>Use What I Have at Home</span>
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Choose your preferred planning method to get started
        </p>
      </div>
    </div>
  );
};