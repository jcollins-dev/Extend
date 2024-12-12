import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { default as store } from 'store';
import theme from 'themes';
import ContextAwareCart from '.';

describe('ContextAwareCart', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ContextAwareCart />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
