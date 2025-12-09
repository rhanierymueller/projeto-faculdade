import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}), { virtual: true });

const mockLogin = jest.fn();
const mockRegister = jest.fn();

describe('Tela de Login', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      error: null,
    });
    mockLogin.mockClear();
    mockRegister.mockClear();
  });

  test('renderiza o formulário de login por padrão', () => {
    render(<Login />);

    expect(screen.getByText(/Faça login para continuar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  test('alterna para o modo de cadastro', () => {
    render(<Login />);

    fireEvent.click(screen.getByText(/Cadastre-se/i));

    expect(screen.getByText(/Crie sua conta para começar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });

  test('chama a função de login ao enviar o formulário', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('chama a função de cadastro ao enviar o formulário no modo de cadastro', async () => {
    render(<Login />);

    fireEvent.click(screen.getByText(/Cadastre-se/i));

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Senha/i), { target: { value: 'password123' } }); 
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
  });
});
