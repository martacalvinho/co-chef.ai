import React from 'react';
import { ChatFlowContainer } from './components/chat_flow/ChatFlowContainer';
import { MenuLibrary } from './components/menus/MenuLibrary';
import { ShoppingList } from './components/shopping/ShoppingList';
import { GlobalModals } from './components/modals/GlobalModals';
import { Homepage } from './components/homepage/Homepage';
import { LandingPage } from './components/landing/LandingPage';
import { useAppStore } from './store';

function App() {
  const { currentView } = useAppStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'homepage':
        return <LandingPage />;
      case 'chat':
        return <ChatFlowContainer />;
      case 'menus':
        return <MenuLibrary />;
      case 'shopping':
        return <ShoppingList />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
      <GlobalModals />
    </div>
  );
}

export default App;