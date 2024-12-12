import React from 'react';
import ReactDOM from 'react-dom';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import FleetMachineDetail from '.';

// Constants
import { JBTRoutes } from 'constants/routes';

// Store
import { default as store } from 'store';
import { authActions } from 'actions';

it('It should mount', () => {
  const div = document.createElement('div');
  store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.fleetMachine]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.fleetMachine}>
            <FleetMachineDetail />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
