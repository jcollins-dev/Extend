import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { AlertTabGlobal } from '.';
import { Provider } from 'react-redux';
import store from 'store';
import AlertsTable from './AlertsTable';
import { Dropdown } from './Dropdown';

describe('AlertTabGlobal', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertTabGlobal />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('AlertsTable', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertsTable />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Dropdown', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Dropdown />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('AlertsTable', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertsTable />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
