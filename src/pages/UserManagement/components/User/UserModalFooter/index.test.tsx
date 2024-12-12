import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import UserManagementModalFooter from './index';
import { noop } from 'lodash';

describe('UserManagementModalFooter', () => {
  it('Renders in New State', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserManagementModalFooter onSave={noop} onClose={noop} isSaveValid={false}/>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });

  it('Renders in Edit State', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserManagementModalFooter onSave={noop} onDelete={noop} onClose={noop} isSaveValid={false}/>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
