import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Header from './Header';
import { Provider } from 'react-redux';
import store from 'store';

describe('Header', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Header />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
