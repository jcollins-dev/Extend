import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ActionButton from '.';

describe('ActionButton', () => {
  it('Should render correctly with a label', () => {
    render(
      <ThemeProvider theme={theme}>
        <ActionButton>LABEL</ActionButton>
      </ThemeProvider>
    );

    expect(screen.getByText('LABEL')).toBeInTheDocument();
  });

  it('Should respond to click', () => {
    const mock = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ActionButton onClick={mock}>LABEL</ActionButton>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('LABEL'));

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
