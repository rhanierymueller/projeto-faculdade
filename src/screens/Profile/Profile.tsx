import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Profile.css';

export const Profile: React.FC = () => {
  const { user, deleteAccount } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Você realmente quer excluir sua conta?')) {
      deleteAccount();
    }
  };

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h1 className="profile-title">{user.name}</h1>
            <p className="profile-subtitle">Membro desde 2025</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-info-group">
            <span className="profile-label">Email</span>
            <div className="profile-value">{user.email}</div>
          </div>

          <div className="profile-info-group">
            <span className="profile-label">Nome Completo</span>
            <div className="profile-value">{user.name}</div>
          </div>

          <div className="profile-info-group">
            <span className="profile-label">Plano Atual</span>
            <div className="profile-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={`plan-badge ${user.plan}`}>
                {user.plan === 'pro' ? 'Pro' : 'Gratuito'}
              </span>
              {user.plan === 'pro' && (
                <span style={{ fontSize: '14.4px', color: '#6ee7b7' }}>
                  Acesso Total
                </span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button className="delete-account-btn" onClick={handleDeleteAccount}>
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
