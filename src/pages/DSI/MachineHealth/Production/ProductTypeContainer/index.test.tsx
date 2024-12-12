import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import ProductTypeContainer from '.';

describe('ProductTypeContainer', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ProductTypeContainer
              productTypes={[{ value: 'Portion1', timestamp: '2022-09-08T17:43:34' }]}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
