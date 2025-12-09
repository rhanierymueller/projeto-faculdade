import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDrag } from '@use-gesture/react';
import { Login, Chat, SorteDoDia, Profile } from './screens';
import { Menu } from './components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
                isLoggedIn={isAuthenticated}
                shouldReset={chatResetCounter > 0}
              />
            } 
          />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/sorte-do-dia" 
            element={
              <ProtectedRoute>
                <div style={{ height: '100%', position: 'relative' }}>
                  <div className="mobile-toggle-btn" onClick={toggleSidebar}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </div>
                  <SorteDoDia />
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <div style={{ height: '100%', position: 'relative' }}>
                  <div className="mobile-toggle-btn" onClick={toggleSidebar}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                  </div>
                  <Profile />
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
