import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import GraphLegend from '.';

describe('GraphLegend', () => {
  it('Should render correctly when checked', () => {
    render(
      <ThemeProvider theme={theme}>
        <GraphLegend color="red" label="legend1" active={true} id="legend1" onChange={jest.fn} />
      </ThemeProvider>
    );
    const cb = screen.getByRole('checkbox') as HTMLInputElement;
    expect(cb.checked).toBeTruthy();
  });

  it('Should render correctly when unchecked', () => {
    render(
      <ThemeProvider theme={theme}>
        <GraphLegend color="red" label="legend1" active={false} id="legend1" onChange={jest.fn} />
      </ThemeProvider>
    );
    const cb = screen.getByRole('checkbox') as HTMLInputElement;
    expect(cb.checked).toBeFalsy();
  });

  it('Responds to click', () => {
    const mock = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <GraphLegend color="red" label="legend1" active={true} id="legend1" onChange={mock} />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('legend1'));

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('legend1', false);
  });
});
