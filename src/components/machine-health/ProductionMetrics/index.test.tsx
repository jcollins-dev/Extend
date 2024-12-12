import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ProductionMetrics from '.';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

describe('ProductionMetrics', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ProductionMetrics />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
