import React from 'react';
import { ChatFlowContainer } from './components/chat_flow/ChatFlowContainer';
import { MenuLibrary } from './components/menus/MenuLibrary';
import { ShoppingList } from './components/shopping/ShoppingList';
import { useAppStore } from './store';

function App() {
  const { currentView } = useAppStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatFlowContainer />;
      case 'menus':
        return <MenuLibrary />;
      case 'shopping':
        return <ShoppingList />;
      default:
        return <ChatFlowContainer />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
}

export default App;