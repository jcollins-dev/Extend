import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import MachinePmPartsPage from '.';

// Statemanagement
import { default as store } from 'store';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

describe('MachinePMPartsPage', () => {
  const testElement = (
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[JBTRoutes.maintenanceMachinepmparts.replace(':machineId', '1')]}
      >
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.maintenanceMachinepmparts.replace(':machineId', '1')}>
            <MachinePmPartsPage />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );

  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(testElement, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
