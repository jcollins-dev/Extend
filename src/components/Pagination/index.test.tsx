import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import Pagination from '.';

describe('Pagination', () => {
  it('It should display correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Pagination
          onPageChange={jest.fn}
          pageRangeDisplayed={5}
          numItems={100}
          itemsPerPage={10}
        />
      </ThemeProvider>
    );

    expect(await screen.findByText('1')).toBeTruthy();
    expect(await screen.findByText('2')).toBeTruthy();
    expect(await screen.findByText('3')).toBeTruthy();
    expect(await screen.findByText('4')).toBeTruthy();
    expect(await screen.findByText('5')).toBeTruthy();
    expect(await screen.findByText('6')).toBeTruthy();
    expect(await screen.findByText('...')).toBeTruthy();
    expect(await screen.findByText('10')).toBeTruthy();
  });

  it('It does not display if there is only 1 page of results', async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Pagination onPageChange={jest.fn} pageRangeDisplayed={5} numItems={9} itemsPerPage={10} />
      </ThemeProvider>
    );
    expect(container.firstChild).toEqual(null);
  });
});
