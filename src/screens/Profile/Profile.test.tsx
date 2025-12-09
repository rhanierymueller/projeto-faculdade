import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Profile } from './Profile';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

describe('Profile Screen', () => {
  const mockUser = {
    id: '1',
    name: 'Rhaniery Mueller',
    email: 'rhaniery@example.com',
    plan: 'pro' as const,
  };

  const mockDeleteAccount = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      deleteAccount: mockDeleteAccount,
    });
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information correctly', () => {
    render(<Profile />);

    const names = screen.getAllByText('Rhaniery Mueller');
    expect(names).toHaveLength(2);
    
    expect(screen.getByText('rhaniery@example.com')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Acesso Total')).toBeInTheDocument();
  });

  test('calls deleteAccount when delete button is clicked and confirmed', () => {
    render(<Profile />);

    const deleteBtn = screen.getByText('Excluir Conta');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteAccount).toHaveBeenCalled();
  });

  test('does not call deleteAccount when delete is cancelled', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    render(<Profile />);

    const deleteBtn = screen.getByText('Excluir Conta');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });
});
