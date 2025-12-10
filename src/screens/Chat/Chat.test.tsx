import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from './Chat';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessageToGemini } from '../../services/gemini';

jest.mock('../../contexts/AuthContext');
jest.mock('../../services/gemini');

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Tela de Chat', () => {
  const mockUser = {
    id: '1',
    name: 'Rhaniery',
    email: 'rhaniery@example.com',
    plan: 'pro' as const,
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });
    (sendMessageToGemini as jest.Mock).mockResolvedValue('Olá! Sou a Serena AI.');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza a interface de chat com o nome do usuário', () => {
    render(
      <Chat 
        toggleSidebar={() => {}} 
        isSidebarOpen={true}
      />
    );

    expect(screen.getByText(/Bem-vindo de volta, Rhaniery/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Pergunte qualquer coisa/i)).toBeInTheDocument();
  });

  test('envia uma mensagem e exibe a resposta', async () => {
    render(
      <Chat 
        toggleSidebar={() => {}} 
        isSidebarOpen={true}
      />
    );

    const input = screen.getByPlaceholderText(/Pergunte qualquer coisa/i);
    
    fireEvent.change(input, { target: { value: 'Olá' } });
    
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons[buttons.length - 1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Olá')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Olá! Sou a Serena AI.')).toBeInTheDocument();
    });

    expect(sendMessageToGemini).toHaveBeenCalled();
  });
});

