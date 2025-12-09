import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SorteDoDia } from './SorteDoDia';

jest.mock('../../components', () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('SorteDoDia Screen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders initial state correctly', () => {
    render(<SorteDoDia />);
    expect(screen.getByText('Sorte do Dia')).toBeInTheDocument();
    expect(screen.getByText('Clique no botão para descobrir sua sorte!')).toBeInTheDocument();
  });

  test('updates phrase when button is clicked', () => {
    render(<SorteDoDia />);
    const button = screen.getByText('Gerar Nova Frase');

    fireEvent.click(button);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const initialText = 'Clique no botão para descobrir sua sorte!';
    const messageElement = screen.getByText((content, element) => {
      return element?.classList.contains('sorte-message') ?? false;
    });

    expect(messageElement.textContent).not.toBe(initialText);
  });
});
