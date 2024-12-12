import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import ScopeDetail from 'pages/UserManagement/components/Group/AddEditGroup/Scope/ScopeDetail';
import { noop } from 'lodash';

describe('Scope', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ScopeDetail
              onScopeDetail={noop}
              onScopeDetailChange={noop}
              scope={{
                allOrganizations: false,
                allPlants: false,
                allMachines: false,
                organizations: [],
                plants: [],
                machines: []
              }}
              internalAccessGroup={false}
              allOrganizations={[]}
              allPlants={[]}
              setCounts={noop}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
