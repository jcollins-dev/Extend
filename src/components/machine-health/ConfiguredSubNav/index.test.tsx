import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConfiguredSubNav from '.';

describe('ConfiguredSubNav', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ConfiguredSubNav baseUrl="" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
