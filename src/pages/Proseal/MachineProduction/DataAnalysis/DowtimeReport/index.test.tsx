import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import RecipeReport from '.';

describe('Recipe Report', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <RecipeReport />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
