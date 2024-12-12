import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { noop } from 'lodash';
import AddEditGroup from 'pages/UserManagement/components/Group/AddEditGroup';

describe('AddEditGroup', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AddEditGroup
              id=""
              initialGroupInfo={{
                name: '',
                internalAccessGroup: false,
                allOrganizations: false,
                allMachines: false,
                allPlants: false,
                organizations: [],
                plants: [],
                machines: [],
                permissions: []
              }}
              setIsChanged={noop}
              onCloseVerifyData={noop}
              onClose={noop}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
