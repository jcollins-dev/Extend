import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AllDataTable from './AllDataTable';

describe('All Data Table', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AllDataTable rows={[]} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
