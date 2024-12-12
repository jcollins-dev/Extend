import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Footer from './Footer';
import { Provider } from 'react-redux';
import store from 'store';

describe('BadgeWithText', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Footer />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
