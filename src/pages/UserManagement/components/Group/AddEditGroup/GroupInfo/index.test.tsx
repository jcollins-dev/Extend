import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { noop } from 'lodash';
import GroupInfo from 'pages/UserManagement/components/Group/AddEditGroup/GroupInfo';

describe('GroupInfo', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <GroupInfo
              onGroupInfoChange={noop}
              groupInformation={{ name: '', internalAccessGroup: false }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
