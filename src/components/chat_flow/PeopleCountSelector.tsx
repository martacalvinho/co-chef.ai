import React from 'react';
import { Users } from 'lucide-react';

interface PeopleCountSelectorProps {
  selectedPeopleCount: number;
  onSelectPeopleCount: (count: number) => void;
}

export const PeopleCountSelector: React.FC<PeopleCountSelectorProps> = ({
  selectedPeopleCount,
  onSelectPeopleCount
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">For how many people?</p>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
          <button
            key={count}
            onClick={() => onSelectPeopleCount(count)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <Users className="w-6 h-6 mx-auto mb-1 text-primary-600" />
            <div className="text-lg font-bold text-primary-600">{count}</div>
            <div className="text-xs text-gray-600">people</div>
          </button>
        ))}
      </div>
    </div>
  );
};