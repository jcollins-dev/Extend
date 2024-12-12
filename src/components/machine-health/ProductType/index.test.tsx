import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import ProductType from '.';

describe('ProductType', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ProductType
              productTypeValue="testProductType"
              startDatetime="testStartDateTime"
              endDatetime="testEndDateTime"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
