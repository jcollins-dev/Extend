import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import PermissionWrapper from '.';
import { PermissionScopeName } from 'types/user-management';

describe('PermissionsWrapper', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <PermissionWrapper page={PermissionScopeName.USER_MANAGEMENT}>
              <div />
            </PermissionWrapper>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
