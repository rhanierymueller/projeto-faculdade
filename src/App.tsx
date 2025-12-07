import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDrag } from '@use-gesture/react';
import { Login, Chat } from './screens';
import { Menu } from './components';
import './App.css';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [chatResetCounter, setChatResetCounter] = useState(0);

  const bind = useDrag(({ movement: [mx], cancel, active }) => {
    if (window.innerWidth > 768) return;

    if (mx > 100 && !isSidebarOpen) {
      setIsSidebarOpen(true);
      cancel();
    }
    if (mx < -100 && isSidebarOpen) {
      setIsSidebarOpen(false);
      cancel();
    }
  }, { filterTaps: true });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
    setUser({ name: 'Rhaniery Mueller', email });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleNewChat = () => {
    setChatResetCounter(prev => prev + 1);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout" {...bind()}>
      <div className={`sidebar-container ${!isSidebarOpen ? 'collapsed' : ''} ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <Menu 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Chat 
                toggleSidebar={toggleSidebar} 
                isSidebarOpen={isSidebarOpen} 
                isLoggedIn={isLoggedIn}
                shouldReset={chatResetCounter > 0}
              />
            } 
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
