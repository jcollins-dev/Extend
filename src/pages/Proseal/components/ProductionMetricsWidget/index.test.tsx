import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import store from 'store';
import theme from 'themes';
import ProductionMetricsWidget from '.';

describe('ProductionMetricsWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ProductionMetricsWidget packCount={12000} feedFactor={1} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
