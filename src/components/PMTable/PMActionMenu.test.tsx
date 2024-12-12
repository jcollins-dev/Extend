import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { testPMData } from 'constants/testdata';
import { BrowserRouter } from 'react-router-dom';
import { default as theme } from 'themes';
import PMActionMenu from './PMActionMenu';

describe('PMActionMenu', () => {
  it('It should display links', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <PMActionMenu task={testPMData[0].tasks[0]} onClose={jest.fn} />
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('See detailed PM')).toBeTruthy();
    expect(screen.getByText('Order parts')).toBeTruthy();
    expect(screen.getByText('Schedule service')).toBeTruthy();
    expect(screen.getByText('Review related PMs')).toBeTruthy();
    expect(screen.getByText('Assign owner')).toBeTruthy();
  });

  it('It calls onClose when clicked', () => {
    const mockOnClose = jest.fn();

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <PMActionMenu task={testPMData[0].tasks[0]} onClose={mockOnClose} />
        </ThemeProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
