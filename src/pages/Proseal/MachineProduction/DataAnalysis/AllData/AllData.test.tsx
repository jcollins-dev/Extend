import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AllData from './AllData';

describe('All Data', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AllData />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
