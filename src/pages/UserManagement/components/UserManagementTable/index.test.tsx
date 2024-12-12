import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { noop } from 'lodash';
import UserManagementTable from '.';
import { UserManagementTableType } from 'types/user-management';

describe('UserManagement', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserManagementTable tableType={UserManagementTableType.GROUP} onClickButton={noop} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
