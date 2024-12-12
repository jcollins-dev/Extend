import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CreateAlertPage from '.';
import { Provider } from 'react-redux';
import store from 'store';

describe('CreateAlertPage', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <CreateAlertPage />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
