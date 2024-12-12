import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { default as theme } from '../../themes';
import WarningPrompt from '.';

const mockProps = {
  helperText: 'Are you sure?',
  isConfirmPrompt: true,
  isVisible: true,
  onCancelCallback: jest.fn,
  onConfirmCallback: jest.fn,
  title: 'Warning'
};

describe('WarningPrompt', () => {
  it('It should be visible and display a title, helper text, a Cancel button, and a Yes button', async () => {
    render(
      <Router>
        <ThemeProvider theme={theme}>
          <WarningPrompt {...mockProps} />
        </ThemeProvider>
      </Router>
    );

    expect(await screen.findByText(mockProps.title)).toBeTruthy();
    expect(await screen.findByText(mockProps.helperText)).toBeTruthy();
    expect(await screen.findByText('Cancel')).toBeTruthy();
    expect(await screen.findByText('Yes')).toBeTruthy();
  });

  it('It should not be visible when isVisible prop is set to false', () => {
    render(
      <Router>
        <ThemeProvider theme={theme}>
          <WarningPrompt {...mockProps} isVisible={false} />
        </ThemeProvider>
      </Router>
    );

    expect(screen.queryByText(mockProps.title)).not.toBeInTheDocument();
  });

  it('It should call onCancelCallback when escape is pressed', async () => {
    const mockOnCancel = jest.fn();

    render(
      <Router>
        <ThemeProvider theme={theme}>
          <WarningPrompt {...mockProps} onCancelCallback={mockOnCancel} />
        </ThemeProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockProps.title)).toBeTruthy();
      fireEvent.keyUp(window, { key: 'Escape', code: 'Escape' });
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('It should call onCancelCallback when the Cancel button is clicked', async () => {
    const mockOnCancel = jest.fn();

    render(
      <Router>
        <ThemeProvider theme={theme}>
          <WarningPrompt {...mockProps} onCancelCallback={mockOnCancel} />
        </ThemeProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockProps.title)).toBeTruthy();
      screen
        .getByRole('button', {
          name: /Cancel/i
        })
        .click();
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('It should call onConfirmCallback when the Yes button is clicked', async () => {
    const mockOnConfirm = jest.fn();

    render(
      <Router>
        <ThemeProvider theme={theme}>
          <WarningPrompt {...mockProps} onConfirmCallback={mockOnConfirm} />
        </ThemeProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(mockProps.title)).toBeTruthy();
      screen
        .getByRole('button', {
          name: /Yes/i
        })
        .click();
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
