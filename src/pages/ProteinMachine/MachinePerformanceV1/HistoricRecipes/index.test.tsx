import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import HistoricRecipes from '.';

const props = {
  endTime: new Date(),
  startTime: new Date()
};

describe('It should mount Historic Recipes', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <HistoricRecipes {...props} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
