import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Menu.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  onNewChat?: () => void;
}

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const SidebarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
);
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
);

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, isLoggedIn, user, onLogout, onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const handleNewChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNewChat) onNewChat();
    navigate('/');
  };

  return (
    <nav className="menu-sidebar">
      <div className="menu-header">
        <div style={{ flex: 1 }}></div>
        <div className="menu-header-icon" onClick={onClose} title="Close Sidebar">
           <SidebarIcon /> 
        </div>
      </div>

      <div className="menu-scroll-area">
        <a href="/" onClick={handleNewChatClick} className="new-chat-btn">
          <span>Nova Conversa</span>
          <EditIcon />
        </a>

        {!isLoggedIn && (
           <div style={{ marginTop: 'auto' }}>
           </div>
        )}
      </div>

      <div className="user-profile-section">
        {isLoggedIn ? (
          <div className="user-profile logged-in">
            <div className="user-info">
              <div className="user-name">{user?.email}</div>
              <div className="user-plan-badge pro">Versão Pro</div>
            </div>
            <button className="logout-btn" onClick={handleLogoutClick} title="Sair">
              <LogOutIcon />
            </button>
          </div>
        ) : (
          <div className="user-profile logged-out">
            {location.pathname === '/login' ? (
              <Link to="/" className="menu-auth-link">
                <HomeIcon />
                <span>Ir para o chat</span>
              </Link>
            ) : (
              <Link to="/login" className="menu-auth-link">
                <LoginIcon />
                <span>Entrar / Registrar</span>
              </Link>
            )}
            <div className="version-badge free">Versão Free</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Menu;
