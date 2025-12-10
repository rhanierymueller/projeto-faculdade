import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Profile } from './Profile';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

describe('Tela de Perfil', () => {
  const mockUser = {
    id: '1',
    name: 'Rhaniery Mueller',
    email: 'rhaniery@test.com',
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

  test('renderiza as informações do usuário corretamente', () => {
    render(<Profile />);

    const names = screen.getAllByText('Rhaniery Mueller');
    expect(names).toHaveLength(2);
    
    expect(screen.getByText('rhaniery@test.com')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Acesso Total')).toBeInTheDocument();
  });

  test('chama deleteAccount quando o botão de excluir é clicado e confirmado', () => {
    render(<Profile />);

    const deleteBtn = screen.getByText('Excluir Conta');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteAccount).toHaveBeenCalled();
  });

  test('não chama deleteAccount quando a exclusão é cancelada', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    render(<Profile />);

    const deleteBtn = screen.getByText('Excluir Conta');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });
});
