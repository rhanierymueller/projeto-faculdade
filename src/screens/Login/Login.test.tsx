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

describe('Login Screen', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      error: null,
    });
    mockLogin.mockClear();
    mockRegister.mockClear();
  });

  test('renders login form by default', () => {
    render(<Login />);

    expect(screen.getByText(/Faça login para continuar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  test('toggles to register mode', () => {
    render(<Login />);

    fireEvent.click(screen.getByText(/Cadastre-se/i));

    expect(screen.getByText(/Crie sua conta para começar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });

  test('calls login function on form submission', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('calls register function on form submission in register mode', async () => {
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
