import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Switch from '.';

describe('Switch', () => {
  it('Reponds to click', () => {
    const mock = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <Switch checked={true} onChange={mock} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('switch'));

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
