import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      const sessionUser = { ...userWithoutPassword, plan: foundUser.plan || 'pro' } as User;
      
      setUser(sessionUser);
      localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    } else {
      setError('Email ou senha incorretos.');
      throw new Error('Email ou senha incorretos.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    const usersStr = localStorage.getItem('users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email === email)) {
      setError('Este email já está cadastrado.');
      throw new Error('Este email já está cadastrado.');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      plan: 'pro',
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const deleteAccount = () => {
    if (!user) return;

    const usersStr = localStorage.getItem('users');
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr);
      const updatedUsers = users.filter(u => u.email !== user.email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    logout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, deleteAccount, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
