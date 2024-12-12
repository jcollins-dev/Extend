import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import SiteTable from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('SiteTable', () => {
  it('Renders with correct number of columns', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <SiteTable plantId="" type={'LINE'} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    const rows = screen.getAllByRole('row');

    // the header row contains 6 columns when the type eq 'LINE'
    expect(rows[0].childElementCount).toBe(6);
  });
});
