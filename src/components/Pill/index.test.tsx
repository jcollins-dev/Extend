import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Pill from '.';

describe('Pill', () => {
  it('Should render correctly with a label', () => {
    render(
      <ThemeProvider theme={theme}>
        <Pill>LABEL</Pill>
      </ThemeProvider>
    );

    expect(screen.getByText('LABEL')).toBeInTheDocument();
  });

  it('Should render correctly with a count', () => {
    render(
      <ThemeProvider theme={theme}>
        <Pill count={101}>LABEL</Pill>
      </ThemeProvider>
    );

    expect(screen.getByText('(101)')).toBeInTheDocument();
    expect(screen.getByText('(101)')).toHaveStyle({ color: theme.colors.negativeRed });
  });

  it('Should respond to click', () => {
    const mock = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <Pill onClick={mock}>LABEL</Pill>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('LABEL'));

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
