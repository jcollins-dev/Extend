import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import UserManagementModal from './index';

import { UserManagementTableType } from 'types/user-management';
import { noop } from 'lodash';

describe('UserManagementModal', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <UserManagementModal
              tableType={UserManagementTableType.GROUP}
              setIsOpenModal={noop}
              open={false}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
