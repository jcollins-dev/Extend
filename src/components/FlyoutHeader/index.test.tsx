import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import FlyoutHeader from '.';

describe('FlyoutHeader', () => {
  it('Renders with title', () => {
    render(
      <ThemeProvider theme={theme}>
        <FlyoutHeader heading="test-heading" />
      </ThemeProvider>
    );
    expect(screen.getByText('test-heading')).toBeInTheDocument();
  });

  it('Resonds to back click', () => {
    const onBack = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <FlyoutHeader heading="test-heading" onBack={onBack} />
      </ThemeProvider>
    );
    screen.getByRole('button').click();
    expect(onBack).toHaveBeenCalled();
  });

  it('Resonds to close click', () => {
    const onClose = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <FlyoutHeader heading="test-heading" onClose={onClose} />
      </ThemeProvider>
    );
    screen.getByRole('button').click();
    expect(onClose).toHaveBeenCalled();
  });
});
