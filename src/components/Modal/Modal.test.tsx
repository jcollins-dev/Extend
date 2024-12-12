import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { default as theme } from '../../themes';
import Modal from './Modal';

describe('Modal', () => {
  it('It should be visible and display its children when visible prop is set to true', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal visible={true} onClose={jest.fn}>
          <button>TEST</button>
        </Modal>
      </ThemeProvider>
    );

    expect(await screen.findByText('TEST')).toBeTruthy();
  });

  it('It should not be visible when visible prop is set to false', () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal visible={false} onClose={jest.fn}>
          <button>TEST</button>
        </Modal>
      </ThemeProvider>
    );

    expect(screen.queryByText('TEST')).not.toBeInTheDocument();
  });

  it('Calls onClose when escape is pressed', async () => {
    const mockOnClose = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <Modal visible={true} onClose={mockOnClose}>
          <button>TEST</button>
        </Modal>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('TEST')).toBeTruthy();
      fireEvent.keyUp(window, { key: 'Escape', code: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
