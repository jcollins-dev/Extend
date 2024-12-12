import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Breadcrumbs from '.';

describe('Breadcrumbs', () => {
  it('Should render correctly and respond to clicks', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <Breadcrumbs
            items={[
              {
                label: 'first page',
                link: '/first-page'
              },
              {
                label: 'current page'
              }
            ]}
          />
        </ThemeProvider>
      </Router>
    );

    expect(screen.getByText('first page')).toBeInTheDocument();
    expect(screen.getByText('current page')).toBeInTheDocument();

    expect(history.location.pathname).toBe('/');

    // Clicking current page does not link anywhere
    fireEvent.click(screen.getByText('current page'));
    expect(history.location.pathname).toBe('/');

    // Clicking first page navigates us there
    fireEvent.click(screen.getByText('first page'));
    expect(history.location.pathname).toBe('/first-page');
  });
});
